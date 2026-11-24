import siteConfig, { providers } from "./src/lib/config";

const env = import.meta.env ?? {};

const config = siteConfig({
	site: "https://thought-lite.ttio.workers.dev",
	title: "ThoughtLite",
	prologue: "If you need a website\nthat loads fast and has great SEO, then Astro is for you.",
	author: {
		name: "Your Name",
		email: "hi@your.mail",
		link: "https://your.website"
	},
	description: "A modern Astro theme focused on content creation.",
	copyright: {
		type: "CC BY-NC-ND 4.0",
		year: "2026"
	},
	timezone: "UTC",
	i18n: {
		locales: ["en", "zh-cn", "ja"],
		defaultLocale: "en"
	},
	pagination: {
		note: 10,
		jotting: 24
	},
	heatmap: {
		unit: "day",
		weeks: 20
	},
	feed: {
		section: "*",
		limit: 20
	},
	comment: {
		enable: false,
		"max-length": 500,
		"hide-deleted": true,
		history: true
	},
	latest: "*"
});

const monolocale = Number(config.i18n.locales.length) === 1;

const comment = Boolean(config.comment && config.comment.enable !== false);

const turnstile = comment && env.CLOUDFLARE_TURNSTILE_SECRET_KEY ? env.CLOUDFLARE_TURNSTILE_SITE_KEY : undefined;

const push = comment && env.VAPID_PRIVATE_KEY ? env.VAPID_PUBLIC_KEY : undefined;

const email = comment && Boolean(env.EMAIL_FROM);

const { oauth, oauthConfig } = comment
	? providers({
			github: {
				name: "GitHub",
				logo: "simple-icons--github",
				clientID: env.GITHUB_CLIENT_ID,
				clientSecret: env.GITHUB_CLIENT_SECRET,
				scopes: ["read:user"]
			},
			google: {
				name: "Google",
				logo: "simple-icons--google",
				clientID: env.GOOGLE_CLIENT_ID,
				clientSecret: env.GOOGLE_CLIENT_SECRET,
				scopes: ["profile"]
			}
		})
	: { oauth: [], oauthConfig: {} };

if ((oauth.length > 0 || email) && !env.PASS_KEY) {
	throw new Error("PASS_KEY is required when OAuth or email notification is enabled");
}

export { comment, turnstile, oauth, oauthConfig, monolocale, push, email };

export default config;
