import type { APIRoute } from "astro";
import config from "$config";

export const GET: APIRoute = () => {
	const text = `User-agent: Googlebot
User-agent: Bingbot
User-agent: DuckDuckBot
User-agent: archive.org_bot
Allow: /
Disallow: /cdn-cgi

User-agent: *
Disallow: /

Sitemap: ${new URL("sitemap-index.xml", config.site)}
`;

	return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
