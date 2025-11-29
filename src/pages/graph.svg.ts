import type { APIRoute } from "astro";
import config from "$config";
import graph from "$graph/default";

/**
 * GET handler that generates and returns the Open Graph image for most general pages.
 */
export const GET: APIRoute = async () => {
	const image = await graph({
		locale: config.i18n.defaultLocale,
		title: config.title,
		author: config.author.name,
		description: config.description
	});

	return new Response(image, { headers: { "Content-Type": "image/svg+xml" } });
};
