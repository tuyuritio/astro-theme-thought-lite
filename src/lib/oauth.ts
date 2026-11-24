import { site } from "astro:config/server";
import { env } from "cloudflare:workers";
import { createIdentity } from "@tuyuritio/identity";
import { oauth } from "$config";

const runtimeEnv = env as unknown as Record<string, string | undefined>;

/** Configured OAuth 2.0 / OpenID Connect identity router for enabled providers. */
export const identity = createIdentity(
	Object.fromEntries(
		oauth.flatMap(({ id, name, scopes }) => {
			const prefix = id.toUpperCase();
			const clientID = runtimeEnv[`${prefix}_CLIENT_ID`];
			const clientSecret = runtimeEnv[`${prefix}_CLIENT_SECRET`];
			if (!clientID || !clientSecret) return [];
			return [[id, { clientID, clientSecret, redirectURI: new URL(`/@/reach/${name}`, site).href, scopes }]];
		})
	)
);
