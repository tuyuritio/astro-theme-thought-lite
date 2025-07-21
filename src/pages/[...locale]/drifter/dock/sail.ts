import { Token } from "$utils/token";
import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ cookies, redirect }) => {
	// Verify user authentication before proceeding with logout
	const passport = (await Token.check("passport", cookies));
	if (!passport.visa) return new Response("Unauthorized", { status: 401 });

	// Remove authentication visa from passport token (logout)
	delete passport.visa;
	// Reissue passport token without visa to maintain session but remove auth
	await Token.issue("passport", cookies, passport);

	// Redirect to home page after successful logout
	return redirect("/", 302);
};
