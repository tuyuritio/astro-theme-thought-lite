import { defineAction } from "astro:actions";
import { getCollection } from "astro:content";
import { z } from "astro:schema";

export const note = {
	// Action to retrieve and paginate note entries with filtering by series and tags
	list: defineAction({
		input: z.object({
			locale: z.string().nullish(),			// Language locale for filtering
			size: z.number(),						// Number of items per page
			page: z.number().default(1),			// Current page number (starts from 1)
			series: z.string().nullish(),			// Series name to filter by
			tags: z.array(z.string()).default([])	// Array of tags to filter by
		}),
		handler: async ({ locale, size, page, series, tags }) => {
			// Fetch all note entries from the content collection
			let notes = await getCollection("note", note => {
				// Extract language from the file path structure
				const [language] = note.id.split("/");

				// Filter criteria: must be published and match locale
				let published = !note.data.draft;
				let localed = language == locale;

				return published && localed;
			});

			// Extract all unique series and tags from the filtered notes
			const series_list = Array.from(new Set(notes.map(note => note.data.series).filter(Boolean))).sort();
			const tag_list = Array.from(new Set(notes.flatMap(note => note.data.tags).filter(Boolean))).sort();

			// Apply series and tag filtering, then sort by timestamp (newest first)
			notes = notes
				.filter(note => {
					// Check if note matches the specified series (if any)
					let match_series = !series || note.data.series == series;
					// Check if note contains all specified tags
					let match_tags = tags.every(tag => note.data.tags?.includes(tag));

					return match_series && match_tags;
				})
				.sort((a, b) => b.data.top - a.data.top || b.data.timestamp.getTime() - a.data.timestamp.getTime());

			// Calculate pagination
			let pages = Math.ceil(notes.length / size);
			page = Math.max(1, Math.min(page, pages));		// Ensure page is within valid range

			// Apply pagination by slicing the array
			notes = notes.slice((page - 1) * size, page * size);

			return { notes, pages, page, series_list, tag_list };
		}
	})
}
