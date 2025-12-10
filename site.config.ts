import siteConfig, { providers } from "./src/utils/config";

const env = import.meta.env ?? {};

const config = siteConfig({
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
		year: "2025"
	},
	i18n: {
		locales: ["en", "zh-cn", "ja"],
		defaultLocale: "en"
	},
	feed: {
		section: "*",
		limit: 20
	},
	comment: {
		"max-length": 500,
		"hide-deleted": true,
		history: true
	},
	latest: "*"
});

const monolocale = Number(config.i18n.locales.length) === 1;

const turnstile = env.CLOUDFLARE_TURNSTILE_SECRET_KEY ? env.CLOUDFLARE_TURNSTILE_SITE_KEY : null;

const oauth = providers([
	{ name: "GitHub", logo: "simple-icons--github", clientID: env.GITHUB_CLIENT_ID, clientSecret: env.GITHUB_CLIENT_SECRET },
	{ name: "Google", logo: "simple-icons--google", clientID: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET },
	{ name: "X", logo: "simple-icons--x", clientID: env.TWITTER_CLIENT_ID, clientSecret: env.TWITTER_CLIENT_SECRET }
]);

export { turnstile, oauth, monolocale };

export default config;
