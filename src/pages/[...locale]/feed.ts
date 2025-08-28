import type { APIRoute } from "astro";
import { i18n } from "astro:config/client";
import { getCollection } from "astro:content";
import { getRelativeLocaleUrl } from "astro:i18n";
import { Feed } from "feed";
import config from "$config";
import i18nit from "$i18n";

// Disable prerendering to allow dynamic feed generation with query parameters
export const prerender = false;

/**
 * GET endpoint for generating feeds
 * Supports filtering by language, series, and tags
 */
export const GET: APIRoute = async ({ site, url, params }) => {
	const language = params.locale && (i18n?.locales as string[]).includes(params.locale) ? params.locale : i18n!.defaultLocale;
	const t = i18nit(language);

	const format = url.searchParams.get("format");			// Feed format preference
	const series = url.searchParams.getAll("series");		// Series filters (multi-value)
	const tags = url.searchParams.getAll("tag");			// Tag filters (multi-value)

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

	// Fetch and filter notes based on query parameters
	let notes = (await getCollection("note", note => {
		// Extract language from the file path structure
		const [locale] = note.id.split("/");
		(<any>note).locale = locale;

		// Apply filtering criteria
		let published = !note.data.draft;																// Exclude draft posts
		let localed = language == locale;																// Language filter
		let match_series = !series.length || note.data.series && series.includes(note.data.series);		// Series filter (if specified)
		let match_tags = !tags.length || tags.some(tag => note.data.tags?.includes(tag));				// Tag filter (if specified)

		// Include note only if it passes all filters
		return published && localed && match_series && match_tags;
	})).sort((a, b) => b.data.timestamp.getTime() - a.data.timestamp.getTime());		// Sort by newest first

	// Add each filtered note as a feed item
	notes.forEach((note) => {
		const link = new URL(getRelativeLocaleUrl((<any>note).locale, `/note/${note.id.split("/").slice(1).join("/")}`), site).toString();

		return feed.addItem({
			id: note.id,																			// Unique item identifier
			title: note.data.title,																	// Post title
			link,																					// URL to the post
			date: new Date(note.data.timestamp),													// Publication date
			content: note.data.sensitive ? t("sensitive.feed", { link }) : note.rendered?.html,		// Rendered content
			category: note.data.tags?.map((tag: any) => ({ scheme: "tag", name: tag }))				// Tags as categories
		});
	});

	// Return appropriate feed format based on request
	switch (format?.toLowerCase()) {
		default:
		case "atom":
		case "atom1":
			// Atom 1.0 format (default)
			return new Response(feed.atom1(), { headers: { "Content-Type": "application/xml" } });

		case "rss":
		case "rss2":
			// RSS 2.0 format
			return new Response(feed.rss2(), { headers: { "Content-Type": "application/xml" } });

		case "json":
		case "json1":
			// JSON Feed format
			return new Response(feed.json1(), { headers: { "Content-Type": "application/json" } });
	}
}
