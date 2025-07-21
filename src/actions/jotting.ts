import { defineAction } from "astro:actions";
import { getCollection } from "astro:content";
import { z } from "astro:schema";

export const jotting = {
	// Action to retrieve and paginate jotting entries with filtering
	list: defineAction({
		input: z.object({
			locale: z.string().nullish(),			// Language locale for filtering
			size: z.number(),						// Number of items per page
			page: z.number().default(1),			// Current page number (starts from 1)
			tags: z.array(z.string()).default([])	// Array of tags to filter by
		}),
		handler: async ({ locale, size, page, tags }) => {
			// Fetch all jotting entries from the content collection
			let jottings = await getCollection("jotting", jotting => {
				// Extract language and ID from the file path structure
				const [language] = jotting.id.split("/");

				// Filter criteria: must be published and match locale
				let published = !jotting.data.draft;
				let localed = language == locale;

				return published && localed;
			});

			// Extract all unique tags from the filtered jottings
			const tag_list = new Set(jottings.map(jotting => jotting.data.tags).flat().filter(tag => tag));

			// Apply tag filtering and sort by timestamp (newest first)
			jottings = jottings
				.filter(jotting => tags.every(tag => jotting.data.tags?.includes(tag)))
				.sort((a, b) => b.data.timestamp.getTime() - a.data.timestamp.getTime());

			// Calculate pagination
			let pages = Math.ceil(jottings.length / size);
			page = Math.max(1, Math.min(page, pages));		// Ensure page is within valid range

			// Apply pagination by slicing the array
			jottings = jottings.slice((page - 1) * size, page * size);

			return { jottings, pages, page, tag_list };
		}
	})
}
