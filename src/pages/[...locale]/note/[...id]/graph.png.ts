import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import config, { monolocale } from "$config";
import graph, { contentMap } from "$graph/content";
import i18nit from "$i18n";

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

		contentMap.set(note.id, {
			locale: locale || config.i18n.defaultLocale,
			type: i18nit(locale || config.i18n.defaultLocale)("navigation.note"),
			title: note.data.title,
			timestamp: note.data.timestamp.toISOString().split("T")[0].replace(/-/g, "/"),
			series: note.data.series,
			tags: note.data.tags
		});

		return {
			params: { locale, id },
			props: { id: note.id }
		};
	});
}

/**
 * GET handler that generates and returns the Open Graph image for a note.
 */
export const GET: APIRoute = async ({ props }) => {
	const image = await graph(props.id);

	return new Response(new Uint8Array(image), { headers: { "Content-Type": "image/png" } });
};
