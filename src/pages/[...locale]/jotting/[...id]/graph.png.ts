import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import config, { monolocale } from "$config";
import graph from "$graph/content";

export async function getStaticPaths() {
	const jottings = await getCollection("jotting", jotting => !jotting.data.draft);

	return jottings.map(jotting => {
		let locale: string | undefined;
		let id: string;

		if (monolocale) {
			locale = undefined;
			id = jotting.id;
		} else {
			const [language, ...ids] = jotting.id.split("/");
			locale = config.i18n.defaultLocale === language ? undefined : language;
			id = ids.join("/");
		}

		return {
			params: { locale, id },
			props: {
				title: jotting.data.title,
				timestamp: jotting.data.timestamp,
				tags: jotting.data.tags
			}
		};
	});
}

/**
 * GET handler that generates and returns the Open Graph image for a jotting.
 */
export const GET: APIRoute = async ({ params, props }) => {
	const image = await graph({
		locale: params.locale || config.i18n.defaultLocale,
		type: "jotting",
		site: config.title,
		author: config.author.name,
		title: props.title,
		timestamp: props.timestamp,
		tags: props.tags
	});

	return new Response(new Uint8Array(image), { headers: { "Content-Type": "image/png" } });
};
