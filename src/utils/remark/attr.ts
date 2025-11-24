import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import type { Root } from "mdast";
import type { Properties } from "hast";

// Extend the unist `Data` interface to include `hProperties`.
declare module "unist" {
	interface Data {
		hProperties?: Properties;
	}
}

/**
 * Regex to match the attribute wrapper `{...}` at the START of a string.
 */
const WRAPPER_REGEX_START = /^\{\s*((?:[^{}]|(["']).*?\2)*)\}/;

/**
 * Regex to match the attribute wrapper `{...}` at the END of a string.
 */
const WRAPPER_REGEX_END = /\s*\{\s*((?:[^{}]|(["']).*?\2)*)\}\s*$/;

/**
 * Regex to parse individual attributes within the wrapper.
 *
 * Supports:
 * - ID: `#id`
 * - Class: `.class`
 * - Key-Value: `key="value"`, `key='value'`, `key=value`
 *
 * @see https://regex-vis.com/?r=%2F%28%3F%3A%23%28%3F%3Cid%3E%5B%5E%23%5Cs.%7D%5D%2B%29%29%7C%28%3F%3A%5C.%28%3F%3Cclass%3E%5B%5E%23%5Cs.%7D%5D%2B%29%29%7C%28%3F%3Ckey%3E%5Ba-zA-Z0-9_-%5D%2B%29%28%3F%3A%3D%28%3F%3A%28%3F%3Cquote%3E%5B%27%22%5D%29%28%3F%3Cqvalue%3E.*%3F%29%5Ck%3Cquote%3E%7C%28%3F%3Cvalue%3E%5B%5E%23%5Cs.%7D%5D%2B%29%29%29%3F%2Fg
 */
const ATTRS_REGEX =
	/(?:#(?<id>[^#\s.}]+))|(?:\.(?<class>[^#\s.}]+))|(?<key>[a-zA-Z0-9_-]+)(?:=(?:(?<quote>['"])(?<qvalue>.*?)\k<quote>|(?<value>[^#\s.}]+)))?/g;

/**
 * Helper to parse an attribute string into a key-value object.
 *
 * @param content - The content string inside the braces (e.g., "#id .class")
 * @returns A record of parsed attributes.
 */
const parseAttributes = (content: string): Record<string, string> => {
	// Reset index to ensure fresh matching
	ATTRS_REGEX.lastIndex = 0;

	const attributes: Record<string, string> = {};

	let match: RegExpExecArray | null;
	while ((match = ATTRS_REGEX.exec(content)) !== null) {
		const { id, class: className, key, qvalue, value } = match.groups || {};

		if (id) {
			attributes.id = id;
		} else if (className) {
			attributes.className = attributes.className ? `${attributes.className} ${className}` : className;
		} else if (key) {
			attributes[key] = qvalue ?? value ?? "";
		}
	}

	return attributes;
};

/**
 * Remark plugin to inject HTML attributes into Markdown elements.
 *
 * Syntax Support:
 * - Headings: `## Heading {#custom-id .class}`
 * - Links: `[text](url){target=_blank .external}`
 * - Images: `![alt](img.png){.responsive width=500}`
 * - Inline elements: `**bold**{.red}`
 */
const remarkAttrs: Plugin<[], Root> = () => {
	return (tree: Root) => {
		// List of node types to support
		const elements = ["heading", "image", "link", "strong", "emphasis", "inlineCode", "spoiler"];

		visit(tree, elements, (node, index, parent) => {
			if (index === undefined || !parent) return;

			// Attributes for headings are typically part of the heading's text content
			if (node.type === "heading") {
				const last = node.children[node.children.length - 1];

				if (last?.type === "text") {
					const match = last.value.match(WRAPPER_REGEX_END);

					if (match) {
						const text = match[0];
						const content = match[1];

						const attributes = parseAttributes(content);

						if (Object.keys(attributes).length > 0) {
							node.data = node.data || {};
							node.data.hProperties = node.data.hProperties || {};
							Object.assign(node.data.hProperties, attributes);

							// Remove the attribute syntax string from the visible text
							last.value = last.value.slice(0, -text.length).trimEnd();
						}
					}
				}

				return;
			}

			// Attributes for inline elements are located in the next sibling node
			const next = parent.children[index + 1];
			if (next?.type === "text") {
				// Check if the next text node starts with the attribute wrapper
				const match = next.value.match(WRAPPER_REGEX_START);

				if (match) {
					const text = match[0];
					const content = match[1];

					const attributes = parseAttributes(content);

					if (Object.keys(attributes).length > 0) {
						node.data = node.data || {};
						node.data.hProperties = node.data.hProperties || {};
						Object.assign(node.data.hProperties, attributes);

						// Clean up the text node that contained the attributes
						const remaining = next.value.slice(text.length);

						if (remaining) {
							// If there is text left after the attributes, keep it
							next.value = remaining;
						} else {
							// If the text node is now empty, remove it from the AST entirely
							parent.children.splice(index + 1, 1);
						}
					}
				}
			}
		});
	};
};

export default remarkAttrs;
