import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { and, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Comment, Drifter, Notification } from "$db/schema";
import { enhash, Token } from "$utils/token";
import notify from "$utils/notify";
import config from "$config";
import i18nit from "$i18n";

const env = import.meta.env;

// If unauthenticated comments are allowed
const nomad = env.CLOUDFLARE_TURNSTILE_SITE_KEY && env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

/**
 * Define the CommentItem structure
 */
export type CommentItem = {
	id: string;
	section: string;
	item: string;
	reply: string | null;
	drifter: string;
	timestamp: Date;
	content: string;
	history: CommentItem[];
	subcomments: CommentItem[];
};

export const comment = {
	// Action to create a new comment or edit an existing one
	create: defineAction({
		input: z.object({
			section: z.string(), // The section this comment belongs to
			item: z.string(), // The item ID this comment belongs to
			reply: z.string().nullish(), // ID of replied comment if this is a reply
			content: z.string(), // The comment content
			link: z.string().url(), // URL link for notifications
			nickname: z.string().nullish(), // Nickname for nomad users
			captcha: z.string().nullish() // CAPTCHA token for nomad users
		}),
		handler: async ({ section, item, reply, content, link, nickname, captcha }, { cookies, request, locals }) => {
			// Verify user authentication
			const drifter = (await Token.check(cookies, "passport"))?.visa;

			// Get the client IP address from Cloudflare headers
			const ip = request.headers.get("CF-Connecting-IP");

			if (!drifter) {
				if (nomad && nickname?.trim() && captcha) {
					// If nomad is enabled, verify captcha
					const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							secret: env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
							response: captcha,
							remoteip: ip
						})
					});

					const result = await response.json();
					if (!result.success) throw new ActionError({ code: "FORBIDDEN" });
				} else {
					// If unauthenticated and nomad is unavailable, throw unauthorized error
					throw new ActionError({ code: "UNAUTHORIZED" });
				}
			}

			// Apply rate limiting to prevent spam
			// Use drifter ID for authenticated users, clientAddress for unauthenticated users
			const { success } = await locals.runtime.env.COMMENT_LIMIT.limit({ key: drifter ?? ip ?? nickname });
			if (!success) throw new ActionError({ code: "TOO_MANY_REQUESTS" });

			if (content.length > Number(config.comment?.["max-length"])) throw new ActionError({ code: "CONTENT_TOO_LARGE" });

			// Generate unique comment ID and timestamp
			const now = new Date();
			const id = enhash(content + reply + now).substring(0, 8);

			// Initialize database connection
			const db = drizzle(locals.runtime.env.DB);

			// Insert the new comment
			await db.insert(Comment).values({
				id,
				section,
				item,
				reply,
				drifter,
				nickname,
				timestamp: now.getTime(),
				content
			});

			// Prepare notification subscriptions array
			let subscriptions: { locale: string; endpoint: string; p256dh: string; auth: string }[] = [];

			if (reply) {
				// Notify the original commenter when someone replies to their comment
				subscriptions = await db
					.select({ locale: Notification.locale, endpoint: Notification.endpoint, p256dh: Notification.p256dh, auth: Notification.auth })
					.from(Comment)
					.innerJoin(Notification, eq(Notification.drifter, Comment.drifter))
					.where(eq(Comment.id, reply));
			} else if (env.AUTHOR_ID) {
				// Notify the site author when there's a new top-level comment
				subscriptions = await db
					.select({ locale: Notification.locale, endpoint: Notification.endpoint, p256dh: Notification.p256dh, auth: Notification.auth })
					.from(Notification)
					.where(eq(Notification.drifter, env.AUTHOR_ID));
			}

			// Send push notifications to subscribers
			subscriptions.forEach(subscription => {
				const t = i18nit(subscription.locale);
				const message = { title: "", body: "", url: link };

				if (reply) {
					// Notification for reply to comment
					message.title = t("notification.reply.title");
					message.body = t("notification.reply.body");
				} else if (env.AUTHOR_ID) {
					// Notification for new comment to author
					message.title = t("notification.fresh.title");
					message.body = t("notification.fresh.body");
				}

				// Send notification in the background
				// The `ctx.waitUntil()` method is specific to Cloudflare Workers.
				// Remove failed notification endpoints from database
				locals.runtime.ctx.waitUntil(
					notify({ endpoint: subscription.endpoint, p256dh: subscription.p256dh, auth: subscription.auth }, message).then(
						success => success || db.delete(Notification).where(and(eq(Notification.endpoint, subscription.endpoint)))
					)
				);
			});
		}
	}),

	edit: defineAction({
		input: z.object({
			id: z.string(), // The comment ID to edit
			content: z.string() // New content for the comment
		}),
		handler: async ({ id, content }, { cookies, locals }) => {
			// Verify user authentication
			const drifter = (await Token.check(cookies, "passport")).visa;
			if (!drifter) throw new ActionError({ code: "UNAUTHORIZED" });

			// Initialize database connection
			const db = drizzle(locals.runtime.env.DB);

			// Generate new comment ID and timestamp for the edited version
			const now = new Date();
			const edit = enhash(content + id + now).substring(0, 8);

			// Update the original comment to point to the new edited version and return all data for cloning
			const comments = await db
				.update(Comment)
				.set({ edit })
				.where(and(eq(Comment.id, id), eq(Comment.drifter, drifter)))
				.returning();

			if (comments.length === 0) throw new ActionError({ code: "NOT_FOUND" });

			const comment = comments[0];

			// Clone the original comment with new content and timestamp
			await db.insert(Comment).values({
				id: edit,
				section: comment.section,
				item: comment.item,
				reply: comment.reply,
				drifter: comment.drifter,
				timestamp: now.getTime(),
				content
			});
		}
	}),

	// Action to delete a comment (marks it as edited by itself)
	delete: defineAction({
		input: z.object({
			id: z.string() // The comment ID to delete
		}),
		handler: async ({ id }, { cookies, locals }) => {
			// Verify user authentication
			const drifter = (await Token.check(cookies, "passport")).visa;
			if (!drifter) throw new ActionError({ code: "UNAUTHORIZED" });

			// Initialize database connection
			const db = drizzle(locals.runtime.env.DB);

			// Mark the comment as deleted by setting edit field to its own ID
			// This creates a self-reference indicating deletion while preserving the record
			await db
				.update(Comment)
				.set({ edit: id })
				.where(and(eq(Comment.id, id), eq(Comment.drifter, drifter)));
		}
	}),

	// Action to retrieve and list all comments for a specific section and item
	list: defineAction({
		input: z.object({
			section: z.string(), // The section this comment belongs to
			item: z.string() // The item ID to get comments for
		}),
		handler: async ({ section, item }, { locals }) => {
			// Get the site author ID
			const author = env.AUTHOR_ID ?? null;

			// Initialize database connection
			const db = drizzle(locals.runtime.env.DB);

			// Fetch all comments with user information
			const comments = await db
				.select({
					id: Comment.id,
					section: Comment.section,
					item: Comment.item,
					reply: Comment.reply,
					drifter: Comment.drifter,
					timestamp: Comment.timestamp,
					content: Comment.content,
					edit: Comment.edit,
					// Use display name if available, otherwise use handle
					name: sql`CASE WHEN ${Drifter.name} IS NULL THEN ${Drifter.handle} ELSE ${Drifter.name} END`,
					// Use nickname for unauthenticated users
					nickname: Comment.nickname,
					description: Drifter.description,
					image: Drifter.image,
					homepage: Drifter.homepage,
					// Mark if this user is the site author
					author: sql`CASE WHEN ${Drifter.id} = ${author} THEN 1 ELSE 0 END`
				})
				.from(Comment)
				.where(and(eq(Comment.section, section), eq(Comment.item, item)))
				.orderBy(Comment.timestamp)
				.leftJoin(Drifter, eq(Comment.drifter, Drifter.id));

			// Create a map for efficient comment lookup and initialize subcomments & history arrays
			const map = new Map<string, any>();
			comments.forEach((comment: any) => {
				map.set(comment.id, ((comment.subcomments = []), (comment.history = []), comment));
			});
			const list = new Map(map);

			// Build comment tree structure with replies and edit history
			const treeification: CommentItem[] = [];

			// Count the final comments
			let count: number = 0;

			while (list.size) {
				let comment = list.values().next().value;
				count++;

				// Process edit history chain
				let edit: CommentItem;
				while ((edit = map.get(comment.edit))) {
					if (edit.id === comment.id) {
						// Self-reference indicates deletion
						delete comment.content;
					} else {
						// Build edit history chain
						comment.history.push(comment);
						edit.history = comment.history;
					}

					// Preserve subcomments through edit chain
					edit.subcomments = comment.subcomments;
					comment.history = [];
					delete comment.edit;
					list.delete(comment.id);

					comment = edit;
				}

				// Organize comments into tree structure
				if (comment.reply) {
					// This is a reply, add to parent's subcomments
					map.get(comment.reply).subcomments.push(comment);
				} else {
					// This is a top-level comment
					treeification.push(comment);
				}

				list.delete(comment.id);
			}

			return { treeification, count };
		}
	})
};
