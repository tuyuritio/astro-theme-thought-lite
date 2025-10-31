import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

/**
 * Note collection configuration
 * Represents main blog articles with comprehensive metadata
 */
const note = defineCollection({
  // Load all markdown files except those starting with underscore (private/draft files)
  loader: glob({ pattern: ["**/*.md", "!**/_*.md", "!**/_*/*.md"], base: "./src/content/note" }),
  schema: z.object({
    title: z.string(),                // Post title (required)
    timestamp: z.date(),              // Publication date (required)
    series: z.string().optional(),          // Series name for grouped posts
    tags: z.array(z.string()).optional(),     // Array of topic tags
    description: z.string().optional(),       // Post description/excerpt
    sensitive: z.boolean().default(false),      // Marks content as sensitive
    toc: z.boolean().default(false),        // Whether to show table of contents
    top: z.number().int().nonnegative().default(0), // Top priority for sorting (higher is more important)
    draft: z.boolean().default(false)       // Draft status (excludes from public listing)
  })
});

/**
 * Jotting collection configuration
 * Represents shorter posts, quick thoughts, or micro-blog entries
 */
const jotting = defineCollection({
  // Load all markdown files except those starting with underscore
  loader: glob({ pattern: ["**/*.md", "!**/_*.md", "!**/_*/*.md"], base: "./src/content/jotting" }),
  schema: z.object({
    title: z.string(),                // Jotting title (required)
    timestamp: z.date(),              // Publication date (required)
    tags: z.array(z.string()).optional(),     // Array of topic tags
    description: z.string().optional(),       // Brief description
    sensitive: z.boolean().default(false),      // Marks content as sensitive
    top: z.number().int().nonnegative().default(0), // Top priority for sorting (higher is more important)
    draft: z.boolean().default(false)       // Draft status
  })
});

/**
 * Preface collection configuration
 * Represents introductory content, site announcements, or special pages
 */
const preface = defineCollection({
  // Load all markdown files
  loader: glob({ pattern: "**/*.md", base: "./src/content/preface" }),
  schema: z.object({
    timestamp: z.date()   // Creation timestamp
  })
});

/**
 * Information collection configuration
 * Represents static content like about pages, policies, or site information
 */
const information = defineCollection({
  // Load both markdown and YAML files for mixed content types
  loader: glob({ pattern: "**/*.(md|yaml)", base: "./src/content/information" })
});

/**
 * Knowledge collection configuration
 * Represents structured learning materials (books, video series, courses)
 * with progress tracking and reading notes
 */
const knowledge = defineCollection({
  // Load all markdown files except those starting with underscore (private/draft files)
  loader: glob({ pattern: ["**/*.md", "!**/_*.md", "!**/_*/*.md"], base: "./src/content/knowledge" }),
  schema: z.object({
    title: z.string(),                  // Title of the book/series/course (required)
    cover: z.string().optional(),           // Cover image URL or path
    type: z.enum(['book', 'video_series', 'course']), // Type of learning material
    status: z.enum(['todo', 'in_progress', 'done']).default('todo'),  // Reading/watching status
    totalPages: z.number().int().positive().optional(), // Total pages/episodes (optional for non-paginated content)
    currentPage: z.number().int().nonnegative().default(0), // Current page/episode (default 0)
    dates: z.object({
      start: z.date().optional(),           // Start date
      finish: z.date().optional(),          // Completion date
      lastEdited: z.date().optional()         // Last edited date for activity tracking
    }).optional(),
    showAsNote: z.boolean().default(false),       // Whether to show in main blog notes
    tags: z.array(z.string()).optional(),       // Tags for categorization
    description: z.string().optional(),         // Brief description or notes
    author: z.string().optional(),            // Author/creator of the material
    sensitive: z.boolean().default(false),        // Marks content as sensitive
    toc: z.boolean().default(false),          // Whether to show table of contents
    draft: z.boolean().default(false)         // Draft status
  })
});

export const collections = { note, jotting, preface, information, knowledge };
