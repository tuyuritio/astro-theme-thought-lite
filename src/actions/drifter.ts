import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";
import { env } from "cloudflare:workers";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { identity } from "$lib/oauth";
import { Token } from "$lib/token";
import { Drifter, Email } from "$db/schema";
import { oauth } from "$config";

export const drifter = {
	// Action to retrieve the current user's profile information
	profile: defineAction({
		handler: async (_, { cookies }) => {
			// Verify user authentication
			const id = (await Token.check(cookies, "passport"))?.visa;
			if (!id) return;

			// Clean up invalid passport if OAuth providers are disabled
			if (!oauth.length) {
				await Token.revoke("passport", cookies);
				return;
			}

			// Initialize database connection
			const db = drizzle(env.DB);

			// Fetch user profile data from database
			const drifter = await db
				.select({
					id: Drifter.id,
					provider: Drifter.provider,
					name: sql<string>`COALESCE(${Drifter.name}, ${Drifter.handle})`,
					description: Drifter.description,
					image: Drifter.image,
					homepage: Drifter.homepage,
					email: Email.address,
					emailState: Email.state,
					notify: Email.notify
				})
				.from(Drifter)
				.leftJoin(Email, eq(Email.drifter, Drifter.id))
				.where(eq(Drifter.id, id))
				.get();

			return drifter;
		}
	}),

	// Action to synchronize user profile with OAuth provider
	synchronize: defineAction({
		handler: async (_, { cookies }) => {
			// Verify user authentication
			const id = (await Token.check(cookies, "passport"))?.visa;
			if (!id) throw new ActionError({ code: "UNAUTHORIZED" });

			// Initialize database connection
			const db = drizzle(env.DB);

			// Get current OAuth tokens and provider info
			const drifter = await db
				.select({
					provider: Drifter.provider,
					account: Drifter.account,
					access: Drifter.access,
					expire: Drifter.expire,
					refresh: Drifter.refresh
				})
				.from(Drifter)
				.where(eq(Drifter.id, id))
				.get();

			const provider = drifter?.provider.toLowerCase();
			if (!drifter || !provider || !identity.has(provider)) throw new ActionError({ code: "UNAUTHORIZED" });

			// Check if access token has expired
			const expired = drifter.expire ? drifter.expire < Date.now() : false;

			// Require refresh token when access token has expired
			if (expired && !drifter.refresh) throw new ActionError({ code: "UNAUTHORIZED" });

			// Refresh expired access token if needed, then fetch updated user info from OAuth provider
			const refreshed = expired ? await identity.refreshAccessToken(provider, drifter.refresh!) : undefined;
			const userInfo = await identity.getUserInfo(provider, {
				accessToken: refreshed?.accessToken ?? drifter.access,
				expectedSubject: drifter.account
			});

			// Update user profile in database with latest OAuth data
			const newProfile = await db
				.update(Drifter)
				.set({
					...(refreshed && {
						access: refreshed.accessToken,
						expire: refreshed.expiresAt,
						...(refreshed.refreshToken && { refresh: refreshed.refreshToken })
					}),
					handle: userInfo.preferred_username,
					name: userInfo.name,
					description: userInfo.description,
					image: userInfo.picture
				})
				.where(eq(Drifter.id, id))
				.returning({
					name: sql<string>`COALESCE(${Drifter.name}, ${Drifter.handle})`,
					description: Drifter.description,
					image: Drifter.image
				})
				.get();

			return newProfile;
		}
	}),

	// Action to update user profile settings
	update: defineAction({
		input: z.object({
			homepage: z.union([z.url({ protocol: /^https?$/ }), z.literal("").transform(() => null)]).nullish(), // User's personal homepage URL
			notify: z.boolean().nullish() // Whether to notify user via email
		}),
		handler: async ({ homepage, notify }, { cookies }) => {
			// Verify user authentication
			const id = (await Token.check(cookies, "passport"))?.visa;
			if (!id) throw new ActionError({ code: "UNAUTHORIZED" });

			// Initialize database connection
			const db = drizzle(env.DB);

			// Update user settings in database
			await db.update(Drifter).set({ homepage }).where(eq(Drifter.id, id));

			// Update email notification preference if provided
			if (notify != null) await db.update(Email).set({ notify }).where(eq(Email.drifter, id));
		}
	}),

	// Action to deactivate user account and clean up all data
	deactivate: defineAction({
		handler: async (_, { cookies }) => {
			// Verify user authentication
			const id = (await Token.check(cookies, "passport"))?.visa;
			if (!id) throw new ActionError({ code: "UNAUTHORIZED" });

			// Initialize database connection
			const db = drizzle(env.DB);

			// Get user's OAuth provider and tokens for revocation
			const drifter = await db
				.select({ provider: Drifter.provider, access: Drifter.access, refresh: Drifter.refresh })
				.from(Drifter)
				.where(eq(Drifter.id, id))
				.get();
			if (!drifter) throw new ActionError({ code: "UNAUTHORIZED" });

			// Best-effort token revocation: prefer refresh token and do not block deactivation if already expired or revoked
			const provider = drifter.provider.toLowerCase();
			if (identity.has(provider)) {
				try {
					await identity.revokeToken(
						provider,
						drifter.refresh ? { type: "refresh_token", token: drifter.refresh } : { type: "access_token", token: drifter.access }
					);
				} catch (error) {
					console.warn(`Failed to revoke OAuth token for ${drifter.provider}:`, error);
				}
			}

			// Delete user record from database
			await db.delete(Drifter).where(eq(Drifter.id, id));

			// Revoke authentication passport token
			await Token.revoke("passport", cookies);
		}
	})
};
