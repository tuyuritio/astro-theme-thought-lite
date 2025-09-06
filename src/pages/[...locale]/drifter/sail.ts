import { Token } from "$utils/token";
import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ cookies, redirect }) => {
	// Verify user authentication before proceeding with signout
	const passport = (await Token.check(cookies, "passport"));
	if (!passport.visa) return new Response("Unauthorized", { status: 401 });

	// Remove authentication visa from passport token (signout)
	delete passport.visa;
	// Reissue passport token without visa to maintain session but remove auth
	await Token.issue(cookies, "passport", passport);

	// Redirect to home page after successful signout
	return redirect("/", 302);
};
