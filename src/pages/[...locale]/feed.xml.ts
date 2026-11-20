import type { APIRoute } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { type CollectionEntry, getCollection, render } from "astro:content";
import { getRelativeLocaleUrl } from "astro:i18n";
import { Feed } from "feed";
import config, { monolocale } from "$config";
import i18nit from "$i18n";

export async function getStaticPaths() {
	// Create path for each locale, omitting default locale from URL
	return config.i18n.locales.map(locale => ({ params: { locale: config.i18n.defaultLocale === locale ? undefined : locale } }));
}

/**
 * GET endpoint for generating feeds
 * Supports filtering by language, series, and tags
 */
export const GET: APIRoute = async ({ params }) => {
	const { locale: language = config.i18n.defaultLocale } = params;
	const t = i18nit(language);
	const site = new URL(config.site);

	// Initialize feed with site metadata and configuration
	const feed = new Feed({
		title: config.title,
		description: config.description,
		author: config.author,
		// Handle copyright based on license type - CC0 has special formatting
		copyright:
			config.copyright.type === "CC0 1.0"
				? "CC0 1.0 – No Rights Reserved"
				: `${config.copyright.type} © ${config.copyright.year} ${config.author.name}`,
		image: new URL("favicon-96x96.png", site).toString(), // Feed image/logo
		favicon: new URL("favicon.ico", site).toString(), // Feed favicon
		id: site.toString(), // Unique feed identifier
		link: site.toString() // Feed's associated website
	});

	// Aggregate items from specified sections
	const items: CollectionEntry<"note" | "jotting">[] = [];

	// Determine which sections to include
	const sections = config.feed?.section || "*";

	if (sections === "*" || sections.includes("note")) {
		const notes = await getCollection("note", note => {
			// Apply filtering criteria
			const published = !note.data.draft; // Exclude draft posts
			const localed = monolocale || note.id.split("/")[0] === language; // Language filter

			// Include note only if it passes all filters
			return published && localed;
		});

		items.push(...notes);
	}

	if (sections === "*" || sections.includes("jotting")) {
		const jottings = await getCollection("jotting", jotting => {
			// Apply filtering criteria
			const published = !jotting.data.draft; // Exclude draft posts
			const localed = monolocale || jotting.id.split("/")[0] === language; // Language filter

			// Include jotting only if it passes all filters
			return published && localed;
		});

		items.push(...jottings);
	}

	// Sort all items by timestamp and limit to configured number
	const selectedItems = items
		.sort((a, b) => b.data.timestamp.getTime() - a.data.timestamp.getTime()) // Sort by newest first
		.slice(0, config.feed?.limit || items.length); // Limit to number of items

	// Create an Astro container for rendering content
	const container = await AstroContainer.create();
	const feedItems = await Promise.all(
		selectedItems.map(async item => {
			const slug = monolocale ? item.id : item.id.split("/").slice(1).join("/");
			const link = new URL(getRelativeLocaleUrl(language, `/${item.collection}/${slug}`), site).toString();
			let content: string | undefined;
			if (item.data.sensitive) {
				content = t("sensitive.feed", { link });
			} else if (item.rendered) {
				const html = await container.renderToString((await render(item)).Content);

				// Rewrite relative paths to absolute URLs for media assets and links
				content = html.replace(/(?<=(?:src|href)=")\/(?!\/)([^"]+)/g, `${site.origin}/$1`);
			}

			return {
				id: link,
				title: item.data.title,
				link,
				date: item.data.timestamp,
				content,
				description: item.data.description,
				category: item.data.tags?.map(term => ({ term }))
			};
		})
	);

	for (const item of feedItems) {
		feed.addItem(item);
	}

	// Generate Atom 1.0 XML feed
	const xml = feed.atom1();

	return new Response(xml, { headers: { "Content-Type": "application/xml" } });
};
