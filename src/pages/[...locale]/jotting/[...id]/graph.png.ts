import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import config, { monolocale } from "$config";
import graph, { contentMap } from "$graph/content";
import i18nit from "$i18n";

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

		contentMap.set(jotting.id, {
			locale: locale || config.i18n.defaultLocale,
			type: i18nit(locale || config.i18n.defaultLocale)("navigation.jotting"),
			title: jotting.data.title,
			timestamp: jotting.data.timestamp.toISOString().split("T")[0].replace(/-/g, "/"),
			tags: jotting.data.tags
		});

		return {
			params: { locale, id },
			props: { id: jotting.id }
		};
	});
}

/**
 * GET handler that generates and returns the Open Graph image for a jotting.
 */
export const GET: APIRoute = async ({ props }) => {
	const image = await graph(props.id);

	return new Response(new Uint8Array(image), { headers: { "Content-Type": "image/png" } });
};
