import type { APIRoute } from "astro";
import type { OAuthTokens, OAuthUserInfo } from "@tuyuritio/identity";
import { env } from "cloudflare:workers";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { identity } from "$lib/oauth";
import { random, Token } from "$lib/token";
import { safeRedirect } from "$lib/url";
import { Drifter } from "$db/schema";

export const prerender = false;

export const GET: APIRoute = async ({ cookies, params, url, redirect, request }) => {
	const { provider } = params;
	const providerKey = provider?.toLowerCase();
	if (!provider || !providerKey || !identity.has(providerKey)) return new Response("Not Found", { status: 404 });

	// Retrieve and clean up escort token containing OAuth state
	const escort = await Token.check(cookies, "escort");
	await Token.revoke("escort", cookies);

	// Handle OAuth errors returned by the provider
	const error = url.searchParams.get("error");
	if (error) {
		if (error === "access_denied") return redirect(safeRedirect(escort?.referrer, url.origin), 302);
		if (error === "redirect_uri_mismatch" || error === "application_suspended") return new Response("Internal Server Error", { status: 500 });
		return new Response("Unauthorized", { status: 401 });
	}

	// Handle OAuth authorization callback
	if (url.searchParams.has("code")) {
		if (!escort) return new Response("Unauthorized", { status: 401 });

		let userInfo: OAuthUserInfo;
		let tokens: OAuthTokens;
		try {
			({ userInfo, tokens } = await identity.handleAuthorizationResponse(providerKey, url, {
				state: escort.state,
				codeVerifier: escort.codeVerifier,
				nonce: escort.nonce
			}));
		} catch {
			return new Response("Unauthorized", { status: 401 });
		}

		const db = drizzle(env.DB);
		const drifter = await db
			.insert(Drifter)
			.values({
				id: random(16),
				provider,
				account: userInfo.sub,
				access: tokens.accessToken,
				expire: tokens.expiresAt,
				refresh: tokens.refreshToken,
				handle: userInfo.preferred_username,
				name: userInfo.name,
				description: userInfo.description,
				image: userInfo.picture
			})
			.onConflictDoUpdate({
				target: [Drifter.provider, Drifter.account],
				set: {
					access: sql`excluded.access`,
					expire: sql`excluded.expire`,
					refresh: sql`COALESCE(excluded.refresh, ${Drifter.refresh})`,
					handle: sql`excluded.handle`,
					name: sql`excluded.name`,
					description: sql`excluded.description`,
					image: sql`excluded.image`
				}
			})
			.returning({ id: Drifter.id })
			.get();

		await Token.issue(cookies, "passport", { visa: drifter.id });
		return redirect(safeRedirect(escort.referrer, url.origin), 302);
	}

	// Initialize OAuth flow with PKCE parameters
	const {
		url: link,
		transaction: { state, codeVerifier, nonce }
	} = await identity.buildAuthorizationRequest(providerKey, {
		// biome-ignore lint/style/useNamingConvention: Google OAuth query parameter
		parameters: providerKey === "google" ? { access_type: "offline" } : undefined
	});

	await Token.issue(
		cookies,
		"escort",
		{ state, codeVerifier, nonce, referrer: safeRedirect(request.headers.get("referer"), url.origin) },
		"5 minutes"
	);

	return redirect(link.toString(), 302);
};
