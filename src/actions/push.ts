import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";
import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { push as enabled } from "$config";
import { PushSubscription } from "$db/schema";

const endpointSchema = z.url({ protocol: /^https$/ });

export const push = {
	// Action to subscribe to push notifications
	subscribe: defineAction({
		input: z.object({
			endpoint: endpointSchema, // Push service endpoint URL
			p256dh: z.string().min(1), // Public key for encryption
			auth: z.string().min(1) // Authentication secret for encryption
		}),
		handler: async ({ endpoint, p256dh, auth }, { request }) => {
			if (!enabled) throw new ActionError({ code: "FORBIDDEN" });

			const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
			const { success } = await env.COMMENT_LIMIT.limit({ key: `push:${ip}` });
			if (!success) throw new ActionError({ code: "TOO_MANY_REQUESTS" });

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
		input: endpointSchema, // Push service endpoint URL to remove
		handler: async (endpoint, { request }) => {
			if (!enabled) throw new ActionError({ code: "FORBIDDEN" });

			const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
			const { success } = await env.COMMENT_LIMIT.limit({ key: `push:${ip}` });
			if (!success) throw new ActionError({ code: "TOO_MANY_REQUESTS" });

			// Initialize database connection
			const db = drizzle(env.DB);

			// Delete the specific notification subscription
			await db.delete(PushSubscription).where(eq(PushSubscription.endpoint, endpoint));
		}
	})
};
