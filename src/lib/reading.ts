import read from "reading-time";
import type { Root } from "mdast";
// biome-ignore lint/suspicious/noShadowRestrictedNames: toString is a named import from mdast-util-to-string library
import { toString } from "mdast-util-to-string";
import type { Plugin } from "unified";

/**
 * Remark plugin to calculate reading time and word count for markdown content.
 *
 * The word count can be accessed in Astro components via frontmatter.words
 */
const remarkReading: Plugin<[], Root> = () => {
	return (tree, { data }) => {
		// Extract text content from the markdown AST
		const reading = read(toString(tree));

		// Add word count to Astro frontmatter if available
		data.astro?.frontmatter && (data.astro.frontmatter.words = reading.words);
	};
};

export default remarkReading;
