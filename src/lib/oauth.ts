import { site } from "astro:config/server";
import { createIdentity } from "@tuyuritio/identity";
import { oauthConfig } from "$config";

/** Configured OAuth 2.0 / OpenID Connect identity router for enabled providers. */
export const identity = createIdentity(
	Object.fromEntries(
		Object.entries(oauthConfig).map(([id, { name, clientID, clientSecret, scopes }]) => [
			id,
			{ clientID, clientSecret, redirectURI: new URL(`/@/reach/${name}`, site).href, scopes }
		])
	)
);
