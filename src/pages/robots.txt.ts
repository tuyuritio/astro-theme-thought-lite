import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
	const text = `
User-agent: Googlebot
User-agent: Bingbot
User-agent: DuckDuckBot
User-agent: archive.org_bot
Allow: /
Disallow: /cdn-cgi

User-agent: *
Disallow: /

Sitemap: ${new URL("sitemap-index.xml", site)}
`;

	return new Response(text);
};
