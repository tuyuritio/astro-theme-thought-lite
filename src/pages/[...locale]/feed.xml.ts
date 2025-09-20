import type { APIRoute } from "astro";
import { i18n } from "astro:config/client";
import { getCollection } from "astro:content";
import { getRelativeLocaleUrl } from "astro:i18n";
import { Feed } from "feed";
import config from "$config";
import i18nit from "$i18n";

export async function getStaticPaths() {
	return i18n!.locales.map(locale => ({ params: { locale: locale == i18n?.defaultLocale ? undefined : (locale as string) } }));
}

/**
 * GET endpoint for generating feeds
 * Supports filtering by language, series, and tags
 */
export const GET: APIRoute = async ({ site, params }) => {
	const { locale: language = i18n?.defaultLocale! } = params;
	const t = i18nit(language);

	// Initialize feed with site metadata and configuration
	const feed = new Feed({
		title: config.title,
		description: config.description,
		author: config.author,
		// Handle copyright based on license type - CC0 has special formatting
		copyright: config.copyright.type == "CC0 1.0"
			? "CC0 1.0 – No Rights Reserved"
			: `${config.copyright.type} © ${config.copyright.year} ${typeof config.author == "string" ? config.author : config.author.name}`,
		image: new URL("favicon-96x96.png", site).toString(),		// Feed image/logo
		favicon: new URL("favicon.ico", site).toString(),			// Feed favicon
		id: site!.toString(),										// Unique feed identifier
		link: site!.toString(),										// Feed's associated website
	});

	// Aggregate items from specified sections
	let items = [];

	if (config.feed?.section?.includes("note") || config.feed?.section === "*" || config.feed?.section === undefined) {
		let notes = (await getCollection("note", note => {
			// Extract language from the file path structure
			const [locale, ...id] = note.id.split("/");

			// Attach locale and link
			(<any>note).link = new URL(getRelativeLocaleUrl(locale, `/note/${id.join("/")}`), site).toString();

			// Apply filtering criteria
			let published = !note.data.draft;		// Exclude draft posts
			let localed = language == locale;		// Language filter

			// Include note only if it passes all filters
			return published && localed;
		}));

		items.push(...notes);
	}

	if (config.feed?.section?.includes("jotting") || config.feed?.section === "*" || config.feed?.section === undefined) {
		let jottings = (await getCollection("jotting", jotting => {
			// Extract language from the file path structure
			const [locale, ...id] = jotting.id.split("/");

			// Attach locale and link
			(<any>jotting).link = new URL(getRelativeLocaleUrl(locale, `/jotting/${id.join("/")}`), site).toString();

			// Apply filtering criteria
			let published = !jotting.data.draft;	// Exclude draft posts
			let localed = language == locale;		// Language filter

			// Include note only if it passes all filters
			return published && localed;
		}));

		items.push(...jottings);
	}

	// Sort all items by timestamp and limit to configured number
	items = items
		.sort((a, b) => b.data.timestamp.getTime() - a.data.timestamp.getTime())		// Sort by newest first
		.slice(0, config.feed?.limit || items.length);									// Limit to number of items

	// Add each filtered note as a feed item
	items.forEach((item) => feed.addItem({
		id: item.id,																								// Unique item identifier
		title: item.data.title,																						// Post title
		link: (<any>item).link,																						// URL to the post
		date: item.data.timestamp,																					// Publication date
		content: item.data.sensitive ? t("sensitive.feed", { link: (<any>item).link }) : item.rendered?.html,		// Rendered content
		description: item.data.description,																			// Summary of the post
		category: item.data.tags?.map((tag: any) => ({ term: tag }))												// Tags as categories
	}));

	// Append stylesheet declaration to the feed
	const XML = feed.atom1().replace(
		/(<\?xml version="1\.0" encoding="utf-8".*\?>)/,
		'$1\n<?xml-stylesheet type="text/xsl" href="feed.xsl"?>'
	);

	return new Response(XML, { headers: { "Content-Type": "application/xml" } });
}
