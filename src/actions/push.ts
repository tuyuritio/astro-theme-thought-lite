import { defineAction } from "astro:actions";
import { z } from "astro/zod";
import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { PushSubscription } from "$db/schema";

export const push = {
	// Action to subscribe to push notifications
	subscribe: defineAction({
		input: z.object({
			endpoint: z.url(), // Push service endpoint URL
			p256dh: z.string(), // Public key for encryption
			auth: z.string() // Authentication secret for encryption
		}),
		handler: async ({ endpoint, p256dh, auth }) => {
			// Initialize database connection
			const db = drizzle(env.DB);

			// Refresh keys on conflict so RETURNING yields the existing ID.
			const subscription = await db
				.insert(PushSubscription)
				.values({
					endpoint,
					p256dh,
					auth
				})
				.onConflictDoUpdate({
					target: PushSubscription.endpoint,
					set: { p256dh, auth }
				})
				.returning({ id: PushSubscription.id })
				.get();

			// Return the subscription ID
			return subscription.id;
		}
	}),

	// Action to unsubscribe a push notification
	unsubscribe: defineAction({
		input: z.url(), // Push service endpoint URL to remove
		handler: async endpoint => {
			// Initialize database connection
			const db = drizzle(env.DB);

			// Delete the specific notification subscription
			await db.delete(PushSubscription).where(eq(PushSubscription.endpoint, endpoint));
		}
	})
};
