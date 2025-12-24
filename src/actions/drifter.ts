import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { OAuth, type OAuthAccount } from "$utils/oauth";
import { Token } from "$utils/token";
import { Drifter } from "$db/schema";

export const drifter = {
	// Action to retrieve the current user's profile information
	profile: defineAction({
		handler: async (_, { cookies, locals }) => {
			// Verify user authentication
			const id = (await Token.check(cookies, "passport"))?.visa;
			if (!id) return;

			// Initialize database connection
			const db = drizzle(locals.runtime.env.DB);

			// Fetch user profile data from database
			const drifter = (
				await db
					.select({
						id: Drifter.id,
						provider: Drifter.provider,
						name: sql`CASE WHEN ${Drifter.name} IS NULL THEN ${Drifter.handle} ELSE ${Drifter.name} END`,
						description: Drifter.description,
						image: Drifter.image,
						homepage: Drifter.homepage,
						notify: Drifter.notify
					})
					.from(Drifter)
					.where(eq(Drifter.id, id))
			)[0];

			return drifter;
		}
	}),

	// Action to synchronize user profile with OAuth provider
	synchronize: defineAction({
		handler: async (_, { cookies, locals }) => {
			// Verify user authentication
			const id = (await Token.check(cookies, "passport"))?.visa;
			if (!id) throw new ActionError({ code: "UNAUTHORIZED" });

			// Initialize database connection
			const db = drizzle(locals.runtime.env.DB);

			// Get current OAuth tokens and provider info
			const drifter = (
				await db
					.select({
						provider: Drifter.provider,
						access: Drifter.access,
						expire: Drifter.expire,
						refresh: Drifter.refresh
					})
					.from(Drifter)
					.where(eq(Drifter.id, id))
			)[0];

			// Check if access token has expired
			const expire = drifter.expire ? drifter.expire < Date.now() : false;

			// Fetch updated profile from OAuth provider
			// Use refresh token if access token expired, otherwise use access token
			const profile: OAuthAccount = await new OAuth(drifter.provider).update(expire ? drifter.refresh! : drifter.access, expire);

			// Update user profile in database with latest OAuth data
			const newProfile = (
				await db
					.update(Drifter)
					.set({
						handle: profile.handle,
						name: profile.name,
						description: profile.description,
						image: profile.image
					})
					.where(eq(Drifter.id, id))
					.returning({ name: Drifter.name, description: Drifter.description })
			)[0];

			return newProfile;
		}
	}),

	// Action to update user profile settings
	update: defineAction({
		input: z.object({
			homepage: z.string().nullish() // User's personal homepage URL
		}),
		handler: async ({ homepage }, { cookies, locals }) => {
			// Verify user authentication
			const id = (await Token.check(cookies, "passport"))?.visa;
			if (!id) throw new ActionError({ code: "UNAUTHORIZED" });

			// Initialize database connection
			const db = drizzle(locals.runtime.env.DB);

			// Update user settings in database
			await db
				.update(Drifter)
				.set({
					homepage
				})
				.where(eq(Drifter.id, id));
		}
	}),

	// Action to deactivate user account and clean up all data
	deactivate: defineAction({
		handler: async (_, { cookies, locals }) => {
			// Verify user authentication
			const id = (await Token.check(cookies, "passport"))?.visa;
			if (!id) throw new ActionError({ code: "UNAUTHORIZED" });

			// Initialize database connection
			const db = drizzle(locals.runtime.env.DB);

			// Get user's OAuth provider and access token for revocation
			const drifter = (await db.select({ provider: Drifter.provider, access: Drifter.access }).from(Drifter).where(eq(Drifter.id, id)))[0];

			// Revoke OAuth access token with the provider
			await new OAuth(drifter.provider).revoke(drifter.access);

			// Delete user record from database
			await db.delete(Drifter).where(eq(Drifter.id, id));

			// Revoke authentication passport token
			await Token.revoke("passport", cookies);
		}
	})
};
