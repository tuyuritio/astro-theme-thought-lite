import type { Plugin } from "unified";
import type { Root, Text, Paragraph } from "mdast";
import { visit } from "unist-util-visit";

interface AbbrDefinition {
	abbr: string;
	title: string;
}

/**
 * Remark plugin to process abbreviations in markdown.
 *
 * Syntax: *[ABBR]: Definition
 * Example: *[HTML]: HyperText Markup Language
 *
 * This will convert all instances of "HTML" in the text to <abbr title="HyperText Markup Language">HTML</abbr>
 */
const remarkAbbr: Plugin<[], Root> = () => {
	return (tree: Root) => {
		const abbreviations: AbbrDefinition[] = [];

		// First pass: collect abbreviation definitions
		visit(tree, "paragraph", (node: Paragraph, index, parent) => {
			if (!node.children || node.children.length !== 1) return;

			const child = node.children[0];
			if (child.type !== "text") return;

			const text = child.value;
			const abbrMatch = text.match(/^\*\[([^\]]+)\]:\s*(.+)$/);

			if (abbrMatch) {
				const [, abbr, title] = abbrMatch;
				abbreviations.push({ abbr: abbr.trim(), title: title.trim() });

				// Remove the abbreviation definition from the tree
				if (parent && typeof index === "number") {
					parent.children.splice(index, 1);
				}
			}
		});

		// Second pass: replace abbreviations in text nodes
		if (abbreviations.length > 0) {
			visit(tree, "text", (node: Text) => {
				let text = node.value;
				let hasChanges = false;

				for (const { abbr, title } of abbreviations) {
					// Create a regex that matches the abbreviation as a whole word
					const regex = new RegExp(`\\b${escapeRegExp(abbr)}\\b`, "g");

					if (regex.test(text)) {
						hasChanges = true;
						// Reset regex lastIndex for replacement
						regex.lastIndex = 0;
						text = text.replace(regex, `<abbr title="${escapeHtml(title)}">${abbr}</abbr>`);
					}
				}

				if (hasChanges) {
					// Convert the text node to HTML
					const parent = findParent(tree, node);
					if (parent) {
						const index = parent.children.indexOf(node);
						if (index !== -1) {
							parent.children[index] = {
								type: "html",
								value: text
							};
						}
					}
				}
			});
		}
	};
};

/**
 * Escape special regex characters
 */
function escapeRegExp(string: string): string {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/**
 * Find the parent node of a given child node
 */
function findParent(tree: Root, target: any): any {
	let parent: any = null;

	visit(tree, (node: any) => {
		if (node.children) {
			for (const child of node.children) {
				if (child === target) {
					parent = node;
					return false; // Stop visiting
				}
			}
		}
	});

	return parent;
}

export default remarkAbbr;
