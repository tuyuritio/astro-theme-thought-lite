import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { and, eq, lt, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Comment, CommentHistory, Drifter, Notification, PushSubscription } from "$db/schema";
import { enhash, Token } from "$utils/token";
import notify from "$utils/notify";
import config, { turnstile, oauth, push } from "$config";
import i18nit from "$i18n";

const env = import.meta.env;

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
	updated: Date | null;
	deleted: boolean | null;
	content: string;
	subcomments: CommentItem[];
};

export const comment = {
	// Action to create a new comment or edit an existing one
	create: defineAction({
		input: z.object({
			locale: z.string(), // Current locale for notifications
			section: z.string(), // The section this comment belongs to
			item: z.string(), // The item ID this comment belongs to
			reply: z.string().nullish(), // ID of replied comment if this is a reply
			content: z.string(), // The comment content
			link: z.string().url(), // URL link for notifications
			notification: z.number().optional(), // Notification subscription ID
			passer: z
				.object({
					nickname: z.string().nullish(), // Nickname for unauthenticated users
					captcha: z.string().nullish() // CAPTCHA token for unauthenticated users
				})
				.optional()
		}),
		handler: async ({ locale, section, item, reply, content, link, notification, passer }, { cookies, request, locals }) => {
			// Check if commenting is enabled
			if (!oauth.length && !turnstile) throw new ActionError({ code: "CONFLICT" });

			// Get the client IP address from Cloudflare headers
			const ip = request.headers.get("CF-Connecting-IP");

			// Verify user authentication if OAuth providers are configured
			const drifter: string | undefined = oauth.length ? (await Token.check(cookies, "passport"))?.visa : undefined;

			if (!drifter) {
				if (turnstile && passer?.captcha && passer.nickname?.trim()) {
					const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							secret: env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
							response: passer.captcha,
							remoteip: ip
						})
					});

					const result = await response.json();
					if (!result.success) throw new ActionError({ code: "FORBIDDEN" });
				} else {
					// If unauthenticated and Turnstile is unavailable, throw unauthorized error
					throw new ActionError({ code: "UNAUTHORIZED" });
				}
			}

			// Apply rate limiting to prevent spam
			// Use drifter ID for authenticated users, clientAddress for unauthenticated users
			const { success } = await locals.runtime.env.COMMENT_LIMIT.limit({ key: drifter ?? ip ?? "unknown" });
			if (!success) throw new ActionError({ code: "TOO_MANY_REQUESTS" });

			if (content.length > Number(config.comment?.["max-length"])) throw new ActionError({ code: "CONTENT_TOO_LARGE" });

			// Generate unique comment ID
			const id = enhash(content + reply).substring(0, 8);

			// Initialize database connection
			const db = drizzle(locals.runtime.env.DB);

			// Insert the new comment
			await db.insert(Comment).values({
				id,
				section,
				item,
				reply,
				drifter,
				nickname: passer?.nickname,
				timestamp: new Date(),
				content
			});

			// If push notifications are not configured, skip notification process
			if (!push) return;

			// Store notification subscription for future notifications
			if (notification) await db.insert(Notification).values({ comment: id, subscription: notification, timestamp: new Date() });

			// Prepare notification subscriptions array
			let subscriptions: { endpoint: string; p256dh: string; auth: string }[] = [];

			if (reply) {
				// Notify the original commenter when someone replies to their comment
				subscriptions = await db
					.select({ endpoint: PushSubscription.endpoint, p256dh: PushSubscription.p256dh, auth: PushSubscription.auth })
					.from(PushSubscription)
					.innerJoin(Notification, eq(Notification.comment, reply));
			} else if (env.AUTHOR_ID) {
			}

			const t = i18nit(locale);
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

			// Send push notifications to subscribers
			subscriptions.forEach(subscription => {
				// Send notification in the background
				// The `ctx.waitUntil()` method is specific to Cloudflare Workers.
				// Remove failed notification endpoints from database
				locals.runtime.ctx.waitUntil(
					notify({ endpoint: subscription.endpoint, p256dh: subscription.p256dh, auth: subscription.auth }, message).then(
						success => success || db.delete(PushSubscription).where(and(eq(PushSubscription.endpoint, subscription.endpoint)))
					)
				);
			});

			// Cleanup old notifications
			const ExpirationDays = 15;
			const expiration = new Date();
			expiration.setDate(expiration.getDate() - ExpirationDays);

			await db.delete(Notification).where(lt(Notification.timestamp, expiration));
		}
	}),

	edit: defineAction({
		input: z.object({
			id: z.string(), // The comment ID to edit
			content: z.string() // New content for the comment
		}),
		handler: async ({ id, content }, { cookies, locals }) => {
			// Check if authenticated commenting is enabled
			if (!oauth.length) throw new ActionError({ code: "CONFLICT" });

			// Verify user authentication
			const drifter = (await Token.check(cookies, "passport")).visa;
			if (!drifter) throw new ActionError({ code: "UNAUTHORIZED" });

			// Initialize database connection
			const db = drizzle(locals.runtime.env.DB);

			// Store the original comment in the history table
			const inserted = await db
				.insert(CommentHistory)
				.select(
					db
						.select({
							id: sql`NULL`.as("id"),
							comment: Comment.id,
							timestamp: sql`COALESCE(${Comment.updated}, ${Comment.timestamp})`.as("timestamp"),
							content: Comment.content
						})
						.from(Comment)
						.where(and(eq(Comment.id, id), eq(Comment.drifter, drifter)))
				)
				.returning();

			// If no history was inserted, the comment doesn't exist or user doesn't own it
			if (inserted.length === 0) throw new ActionError({ code: "NOT_FOUND" });

			// Update the original comment
			await db
				.update(Comment)
				.set({
					updated: new Date(),
					content
				})
				.where(and(eq(Comment.id, id), eq(Comment.drifter, drifter)));
		}
	}),

	// Action to delete a comment (marks it as edited by itself)
	delete: defineAction({
		input: z.object({
			id: z.string() // The comment ID to delete
		}),
		handler: async ({ id }, { cookies, locals }) => {
			// Check if authenticated commenting is enabled
			if (!oauth.length) throw new ActionError({ code: "CONFLICT" });

			// Verify user authentication
			const drifter = (await Token.check(cookies, "passport")).visa;
			if (!drifter) throw new ActionError({ code: "UNAUTHORIZED" });

			// Initialize database connection
			const db = drizzle(locals.runtime.env.DB);

			// Mark the comment as deleted by setting edit field to its own ID
			// This creates a self-reference indicating deletion while preserving the record
			await db
				.update(Comment)
				.set({ deleted: true })
				.where(and(eq(Comment.id, id), eq(Comment.drifter, drifter)));
		}
	}),

	// Action to retrieve the edit history of a comment
	history: defineAction({
		input: z.object({
			id: z.string() // The comment ID to get history for
		}),
		handler: async ({ id }, { locals }) => {
			// Initialize database connection
			const db = drizzle(locals.runtime.env.DB);

			// Fetch all history entries for this comment
			const history = await db
				.select({
					id: CommentHistory.id,
					comment: CommentHistory.comment,
					timestamp: CommentHistory.timestamp,
					content: CommentHistory.content
				})
				.from(CommentHistory)
				.where(eq(CommentHistory.comment, id))
				.orderBy(CommentHistory.timestamp);

			return history;
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
					updated: Comment.updated,
					deleted: Comment.deleted,
					// Return null for content if the comment is deleted
					content: sql`CASE WHEN ${Comment.deleted} = 1 THEN NULL ELSE ${Comment.content} END`,
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

			// Create a map for efficient comment lookup and initialize subcomments arrays
			const map = new Map<string, any>();
			comments.forEach((comment: any) => {
				comment.subcomments = [];
				map.set(comment.id, comment);
			});

			// Build comment tree structure with replies
			const treeification: CommentItem[] = [];

			// Organize comments into tree structure
			comments.forEach((comment: any) => {
				if (comment.reply) {
					// This is a reply, add to parent's subcomments
					map.get(comment.reply)?.subcomments.push(comment);
				} else {
					// This is a top-level comment
					treeification.push(comment);
				}
			});

			return { treeification, count: comments.length };
		}
	})
};
