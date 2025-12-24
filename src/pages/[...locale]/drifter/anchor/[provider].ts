import type { APIRoute } from "astro";
import { generateCodeVerifier, generateState } from "arctic";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { OAuth, type OAuthAccount } from "$utils/oauth";
import { random, Token } from "$utils/token";
import { Drifter } from "$db/schema";

export const prerender = false;

export const GET: APIRoute = async ({ cookies, params, url, locals, redirect, request }) => {
	const { provider } = params;

	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const errorStatus = url.searchParams.get("error");

	// Retrieve and clean up escort token containing OAuth state
	const escort = await Token.check(cookies, "escort");
	await Token.revoke("escort", cookies);

	if (code) {
		// Validate state parameter to prevent CSRF attacks
		if (escort?.state !== state) return new Response("Unauthorized", { status: 401 });

		// Exchange authorization code for user account information
		const user: OAuthAccount = await new OAuth(provider).validate(code, escort.codeVerifier);

		const db = drizzle(locals.runtime.env.DB);
		// Insert or update user account in database with conflict resolution
		const drifter = (
			await db
				.insert(Drifter)
				.values({
					id: random(16),
					provider: user.provider,
					account: user.account,
					refresh: user.refresh,
					access: user.access,
					expire: user.expire?.getTime(),
					handle: user.handle,
					name: user.name,
					description: user.description,
					image: user.image
				})
				.onConflictDoUpdate({
					// Update existing user if provider+account combination exists
					target: [Drifter.provider, Drifter.account],
					set: {
						access: sql`excluded.access`,
						expire: sql`excluded.expire`,
						handle: sql`excluded.handle`,
						name: sql`excluded.name`,
						description: sql`excluded.description`,
						image: sql`excluded.image`
					}
				})
				.returning({ id: Drifter.id })
		)[0];

		// Issue passport token with user visa for authentication
		await Token.issue(cookies, "passport", { visa: drifter.id });

		// Redirect to original page or home after successful authentication
		return redirect(escort.referrer ?? "/", 302);
	} else if (errorStatus) {
		// Handle OAuth errors from provider
		switch (errorStatus) {
			case "access_denied":
				// User denied access, redirect back to referrer
				return redirect(escort?.referrer ?? "/", 302);

			case "redirect_uri_mismatch":
			case "application_suspended":
				// OAuth configuration errors
				return new Response("Internal Server Error", { status: 500 });

			default:
				// Other OAuth errors
				return new Response("Unauthorized", { status: 401 });
		}
	} else {
		// Initialize OAuth flow with PKCE parameters
		const state = generateState();
		const codeVerifier = generateCodeVerifier();

		// Store OAuth state and referrer in escort token
		await Token.issue(cookies, "escort", { state, codeVerifier, referrer: request.headers.get("referer") ?? "/" }, "5 minutes");

		// Generate OAuth authorization URL and redirect user
		const link: URL = new OAuth(provider).url(state, codeVerifier);
		return redirect(link.toString(), 302);
	}
};
