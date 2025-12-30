import { ActionError, defineAction } from "astro:actions";
import { getEntry } from "astro:content";
import { z } from "astro:schema";
import { and, eq, isNull, lt, ne, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { alias } from "drizzle-orm/sqlite-core";
import { Comment, CommentHistory, Drifter, Email, Notification, PushSubscription } from "$db/schema";
import config, { turnstile, oauth, push, email } from "$config";
import remark from "$utils/remark";
import { enhash, Token } from "$utils/token";
import { render } from "$utils/email";
import sendEmail from "$utils/email/util";
import sendPush from "$utils/push";
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
			push: z.number().optional(), // Push subscription ID for notifications
			passer: z
				.object({
					nickname: z.string().nullish(), // Nickname for unauthenticated users
					captcha: z.string().nullish() // CAPTCHA token for unauthenticated users
				})
				.optional()
		}),
		handler: async ({ locale, section, item, reply, content, link, push: subscription, passer }, { cookies, request, locals, site }) => {
			const t = i18nit(locale, "email");
			const tIndex = i18nit(locale);

			// Check if the target entry exists
			const entry = await getEntry(section as any, item);
			if (!entry) throw new ActionError({ code: "NOT_FOUND" });
			const title = section === "preface" ? tIndex("navigation.preface") : entry.data.title;

			// Check if commenting is enabled
			if (!oauth.length && !turnstile) throw new ActionError({ code: "FORBIDDEN" });

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
					if (!result.success) throw new ActionError({ code: "BAD_REQUEST" });
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
			await db.insert(Comment).values({ id, section, item, reply, drifter, nickname: passer?.nickname, timestamp: new Date(), content });

			// The `ctx.waitUntil()` method is specific to Cloudflare Workers.
			locals.runtime.ctx.waitUntil(
				Promise.all([
					// Store push subscription for future notifications
					(async () => {
						// If no subscription provided or push notifications are disabled, skip storage process
						if (!push || !subscription) return;
						await db.insert(Notification).values({ comment: id, subscription, timestamp: new Date() });
					})(),

					// Notifying original commenter of replies via Web Push API
					(async () => {
						// If not a reply or push notifications are disabled, skip notification process
						if (!push || !reply) return;

						// Prepare the notification message
						const message = { title: tIndex("push.reply.title"), body: tIndex("push.reply.body"), url: link };

						// Notify the original commenter when someone replies to their comment
						const subscriptions = await db
							.select({ endpoint: PushSubscription.endpoint, p256dh: PushSubscription.p256dh, auth: PushSubscription.auth })
							.from(PushSubscription)
							.innerJoin(Notification, eq(Notification.comment, reply));

						// Send push notifications to subscribers and clean up failed ones
						await Promise.all(
							subscriptions.map(async subscription => {
								try {
									const success = await sendPush(
										{ endpoint: subscription.endpoint, p256dh: subscription.p256dh, auth: subscription.auth },
										message
									);

									if (!success) await db.delete(PushSubscription).where(eq(PushSubscription.endpoint, subscription.endpoint));
								} catch (error) {
									console.error("Push failed for endpoint:", subscription.endpoint, error);
								}
							})
						);

						// Occasionally clean up old notifications
						const CleanupChance = 0.2;
						if (Math.random() < CleanupChance) {
							const ExpirationDays = 15;
							const expiration = new Date();
							expiration.setDate(expiration.getDate() - ExpirationDays);

							await db.delete(Notification).where(lt(Notification.timestamp, expiration));
						}
					})(),

					// Notifying original commenter of replies via Email
					(async () => {
						// If email notifications are disabled, skip email notification process
						if (!email) return;

						if (reply) {
							const Replier = alias(Drifter, "replier");

							// Fetch email of the original commenter and replier details for email notification
							// Skip if the replier is the same as the original commenter
							const result = await db
								.select({
									content: Comment.content,
									id: Drifter.id,
									name: sql<string>`COALESCE(${Drifter.name}, ${Drifter.handle})`,
									image: Drifter.image,
									email: Email.address,
									replier: sql<string>`COALESCE(${Replier.name}, ${Replier.handle}, ${passer?.nickname ?? ""})`,
									replierImage: Replier.image
								})
								.from(Email)
								// Join to get replier details
								.leftJoin(Replier, drifter ? eq(Replier.id, drifter) : sql`FALSE`)
								// Join to get the original comment details
								.innerJoin(
									Comment,
									and(
										eq(Comment.id, reply),
										eq(Email.drifter, Comment.drifter),
										or(isNull(Replier.id), ne(Comment.drifter, Replier.id))
									)
								)
								// Join to get original commenter details
								.innerJoin(Drifter, eq(Comment.drifter, Drifter.id))
								// Ensure email is verified and notifications are enabled
								.where(and(eq(Email.state, "verified"), eq(Email.notify, true)))
								.get();

							if (!result?.email) return;

							// Process markdown content for email notifications
							const [commentContent, replyContent] = await Promise.all([remark.process(result.content), remark.process(content)]);

							// Send email notification to the original commenter
							await sendEmail(locale, result.id, result.email, {
								subject: t("reply.subject"),
								html: render("reply", {
									greeting: t("reply.html.greeting", { name: result.name }),
									notify: t("reply.html.notify", { content: title }),
									"comment.author.image": result.image ?? new URL("/akkarin.webp", site),
									yours: t("reply.html.yours"),
									"comment.content": commentContent,
									"reply.author.image": result.replierImage ?? new URL("/scribe.webp", site),
									reply: t("reply.html.reply", { name: result.replier }),
									"reply.content": replyContent,
									"comment.link": link,
									button: t("reply.html.button")
								}),
								text: t("reply.text", { content: title, reply: content, link }),
								unsubscribe: true
							});
						} else if (env.AUTHOR_ID && drifter !== env.AUTHOR_ID) {
							const Commenter = alias(Drifter, "commenter");

							// Notify site author of new comment
							const result = await db
								.select({
									id: Drifter.id,
									name: sql<string>`COALESCE(${Drifter.name}, ${Drifter.handle})`,
									email: Email.address,
									commenter: sql<string>`COALESCE(${Commenter.name}, ${Commenter.handle}, ${passer?.nickname ?? ""})`,
									commenterImage: Commenter.image
								})
								.from(Email)
								.innerJoin(Drifter, eq(Email.drifter, Drifter.id))
								.leftJoin(Commenter, drifter ? eq(Commenter.id, drifter) : sql`FALSE`)
								.where(and(eq(Drifter.id, env.AUTHOR_ID), eq(Email.state, "verified"), eq(Email.notify, true)))
								.get();

							if (!result?.email) return;

							// Process markdown content for email notifications
							const markdown = await remark.process(content);

							// Send email notification to the site author
							await sendEmail(locale, result.id, result.email, {
								subject: t("comment.subject"),
								html: render("fresh", {
									greeting: t("comment.html.greeting", { name: result.name }),
									notify: t("comment.html.notify", { content: title }),
									"comment.author.image": result.commenterImage ?? new URL("/scribe.webp", site),
									comment: t("comment.html.comment", { name: result.commenter }),
									"comment.content": markdown,
									"comment.link": link,
									button: t("comment.html.button")
								}),
								text: t("comment.text", { content: title, comment: content, link }),
								unsubscribe: true
							});
						}
					})()
				])
			);
		}
	}),

	edit: defineAction({
		input: z.object({
			id: z.string(), // The comment ID to edit
			content: z.string() // New content for the comment
		}),
		handler: async ({ id, content }, { cookies, locals }) => {
			// Check if authenticated commenting is enabled
			if (!oauth.length) throw new ActionError({ code: "FORBIDDEN" });

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
		input: z.string(), // The comment ID to delete
		handler: async (id, { cookies, locals }) => {
			// Check if authenticated commenting is enabled
			if (!oauth.length) throw new ActionError({ code: "FORBIDDEN" });

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
		input: z.string(), // The comment ID to get history for
		handler: async (id, { locals }) => {
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
				.leftJoin(Drifter, eq(Comment.drifter, Drifter.id))
				.where(and(eq(Comment.section, section), eq(Comment.item, item)))
				.orderBy(Comment.timestamp);

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
