import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import config, { monolocale } from "$config";
import graph from "$graph/content";

export async function getStaticPaths() {
	const notes = await getCollection("note", note => !note.data.draft);

	return notes.map(note => {
		let locale: string | undefined;
		let id: string;

		if (monolocale) {
			locale = undefined;
			id = note.id;
		} else {
			const [language, ...ids] = note.id.split("/");
			locale = config.i18n.defaultLocale === language ? undefined : language;
			id = ids.join("/");
		}

		return {
			params: { locale, id },
			props: {
				title: note.data.title,
				timestamp: note.data.timestamp,
				series: note.data.series,
				tags: note.data.tags
			}
		};
	});
}

/**
 * GET handler that generates and returns the Open Graph image for a note.
 */
export const GET: APIRoute = async ({ params, props }) => {
	const image = await graph({
		locale: params.locale || config.i18n.defaultLocale,
		type: "note",
		site: config.title,
		author: config.author.name,
		title: props.title,
		timestamp: props.timestamp,
		series: props.series,
		tags: props.tags
	});

	return new Response(new Uint8Array(image), { headers: { "Content-Type": "image/png" } });
};
