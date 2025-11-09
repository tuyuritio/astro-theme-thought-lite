import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import type { Root } from "hast";
import { h } from "hastscript";

/**
 * Rehype plugin to convert standalone images into figure elements with captions.
 *
 * This plugin finds paragraph elements that contain only a single image
 * (at the root level) and converts them into semantic HTML figure elements.
 * The image's alt text is used as the figcaption content.
 *
 * Input:  ```
 *         <p><img src="image.jpg" alt="Image description" /></p>
 *         ```
 *
 * Output: ```
 *         <figure>
 *           <img src="image.jpg" alt="Image description" />
 *           <figcaption>Image description</figcaption>
 *         </figure>
 *         ```
 *
 * Requirements:
 * - The paragraph must contain exactly one child element
 * - That child must be an img element
 * - The img must have both src and alt attributes
 * - The paragraph must be at the root level (no parent or parent is root)
 */
const rehypeFigure: Plugin<[], Root> = () => {
	return (tree: Root) => {
		// Visit all element nodes in the HTML AST
		visit(tree, "element", (node, _index, parent) => {
			// Check if this is a paragraph with a single image child at root level
			if (
				node.tagName === "p" &&
				node.children.length === 1 &&
				node.children[0].type === "element" &&
				node.children[0].tagName === "img" &&
				(!parent || parent.type === "root")
			) {
				const child = node.children[0];
				// Ensure the image has both src and alt attributes
				if (child.properties.src && child.properties.alt) {
					// Transform the paragraph into a figure element
					node.tagName = "figure";

					// Create new children: img element and figcaption with alt text
					node.children = [h("img", { ...child.properties }), h("figcaption", String(child.properties.alt))];
				}
			}
		});
	};
};

export default rehypeFigure;
