import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { drizzle } from "drizzle-orm/d1";
import { Token } from "$utils/token";
import { Notification } from "$db/schema";
import { and, eq } from "drizzle-orm";

const env = import.meta.env;

export const notification = {
	// Action to retrieve the public key for push notifications
	key: defineAction({
		handler: async (_, { cookies }) => {
			// Verify user authentication
			const drifter = (await Token.check(cookies, "passport"))?.visa;
			if (!drifter) throw new ActionError({ code: "UNAUTHORIZED" });

			// Return the public key for web push notifications (VAPID key)
			return env.NOTIFY_PUBLIC_KEY;
		}
	}),

	// Action to subscribe a user to push notifications
	subscribe: defineAction({
		input: z.object({
			locale: z.string(), // User's language preference for notifications
			endpoint: z.string().url(), // Push service endpoint URL
			p256dh: z.string(), // Public key for encryption
			auth: z.string() // Authentication secret for encryption
		}),
		handler: async ({ locale, endpoint, p256dh, auth }, { cookies, locals }) => {
			// Verify user authentication
			const drifter = (await Token.check(cookies, "passport"))?.visa;
			if (!drifter) throw new ActionError({ code: "UNAUTHORIZED" });

			// Initialize database connection
			const db = drizzle(locals.runtime.env.DB);

			// Insert new notification subscription
			// Use onConflictDoNothing to handle duplicate subscriptions gracefully
			await db
				.insert(Notification)
				.values({
					locale,
					drifter,
					endpoint,
					p256dh,
					auth
				})
				.onConflictDoNothing();
		}
	}),

	// Action to unsubscribe a user from push notifications
	unsubscribe: defineAction({
		input: z.object({
			endpoint: z.string().url() // Push service endpoint URL to remove
		}),
		handler: async ({ endpoint }, { cookies, locals }) => {
			// Verify user authentication
			const drifter = (await Token.check(cookies, "passport"))?.visa;
			if (!drifter) throw new ActionError({ code: "UNAUTHORIZED" });

			// Initialize database connection
			const db = drizzle(locals.runtime.env.DB);

			// Delete the specific notification subscription
			// Match both user ID and endpoint to ensure user can only remove their own subscriptions
			await db.delete(Notification).where(and(eq(Notification.drifter, drifter), eq(Notification.endpoint, endpoint)));
		}
	}),

	// Action to check if a user is subscribed to notifications for a specific endpoint
	check: defineAction({
		input: z.object({
			endpoint: z.string().url() // Push service endpoint URL to check
		}),
		handler: async ({ endpoint }, { cookies, locals }) => {
			// Verify user authentication
			const drifter = (await Token.check(cookies, "passport"))?.visa;
			if (!drifter) throw new ActionError({ code: "UNAUTHORIZED" });

			// Initialize database connection
			const db = drizzle(locals.runtime.env.DB);

			// Query for existing subscription matching user and endpoint
			const subscription = await db
				.select()
				.from(Notification)
				.where(and(eq(Notification.drifter, drifter), eq(Notification.endpoint, endpoint)));

			// Return true if subscription exists, false otherwise
			return subscription.length > 0;
		}
	})
};
