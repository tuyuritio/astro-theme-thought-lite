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
			const ID = (await Token.check(cookies, "passport"))?.visa;
			if (!ID) return;

			// Initialize database connection
			let db = drizzle(locals.runtime.env.DB);

			// Fetch user profile data from database
			let drifter = (await db
				.select({
					ID: Drifter.ID,
					platform: Drifter.platform,
					name: sql`CASE WHEN ${Drifter.name} IS NULL THEN ${Drifter.handle} ELSE ${Drifter.name} END`,
					description: Drifter.description,
					image: Drifter.image,
					homepage: Drifter.homepage,
					notify: Drifter.notify,
				})
				.from(Drifter)
				.where(eq(Drifter.ID, ID))
			)[0];

			return drifter;
		}
	}),

	// Action to synchronize user profile with OAuth provider
	synchronize: defineAction({
		handler: async (_, { cookies, locals }) => {
			// Verify user authentication
			const ID = (await Token.check(cookies, "passport"))?.visa;
			if (!ID) throw new ActionError({ code: "UNAUTHORIZED" });

			// Initialize database connection
			let db = drizzle(locals.runtime.env.DB);

			// Get current OAuth tokens and platform info
			let drifter = (await db
				.select({
					platform: Drifter.platform,
					access: Drifter.access,
					expire: Drifter.expire,
					refresh: Drifter.refresh
				})
				.from(Drifter)
				.where(eq(Drifter.ID, ID)))[0];

			// Check if access token has expired
			let expire = drifter.expire ? drifter.expire < new Date().getTime() : false;

			// Fetch updated profile from OAuth provider
			// Use refresh token if access token expired, otherwise use access token
			let profile: OAuthAccount = await new OAuth(drifter.platform).update(expire ? drifter.refresh! : drifter.access, expire);

			// Update user profile in database with latest OAuth data
			let new_profile = (await db
				.update(Drifter)
				.set({
					handle: profile.handle,
					name: profile.name,
					description: profile.description,
					image: profile.image
				})
				.where(eq(Drifter.ID, ID))
				.returning({ name: Drifter.name, description: Drifter.description })
			)[0];

			return new_profile;
		}
	}),

	// Action to update user profile settings
	update: defineAction({
		input: z.object({
			homepage: z.string().nullish()						// User's personal homepage URL
		}),
		handler: async ({ homepage }, { cookies, locals }) => {
			// Verify user authentication
			const ID = (await Token.check(cookies, "passport"))?.visa;
			if (!ID) throw new ActionError({ code: "UNAUTHORIZED" });

			// Initialize database connection
			let db = drizzle(locals.runtime.env.DB);

			// Update user settings in database
			await db
				.update(Drifter)
				.set({
					homepage
				})
				.where(eq(Drifter.ID, ID));
		}
	}),

	// Action to deactivate user account and clean up all data
	deactivate: defineAction({
		handler: async (_, { cookies, locals }) => {
			// Verify user authentication
			const ID = (await Token.check(cookies, "passport"))?.visa;
			if (!ID) throw new ActionError({ code: "UNAUTHORIZED" });

			// Initialize database connection
			let db = drizzle(locals.runtime.env.DB);

			// Get user's OAuth platform and access token for revocation
			let drifter = (await db
				.select({ platform: Drifter.platform, access: Drifter.access })
				.from(Drifter)
				.where(eq(Drifter.ID, ID)))[0];

			// Revoke OAuth access token with the provider
			await new OAuth(drifter.platform).revoke(drifter.access);

			// Delete user record from database
			await db
				.delete(Drifter)
				.where(eq(Drifter.ID, ID));

			// Revoke authentication passport token
			await Token.revoke("passport", cookies);
		}
	})
}
