import { visit } from "unist-util-visit";
import type { Root, Table, Html } from "mdast";
import type { Plugin } from "unified";

/**
 * Remark plugin to wrap tables in a div.table-wrapper container.
 *
 * This plugin finds all table nodes in the markdown AST and wraps them
 * with a div element that has the class "table-wrapper". This is useful
 * for styling purposes, especially for responsive table designs.
 *
 * Input:  | Header 1 | Header 2 |
 *         |----------|----------|
 *         | Cell 1   | Cell 2   |
 *
 * Output: <div class="table-wrapper">
 *           <table>...</table>
 *         </div>
 */
const remarkTableWrapper: Plugin<[], Root> = () => {
	return (tree: Root) => {
		visit(tree, "table", (node: Table, index, parent) => {
			if (!parent || typeof index !== "number") {
				return;
			}

			// Create a wrapper div node with the table-wrapper class
			const wrapper: Html = {
				type: "html",
				value: '<div class="table-wrapper">'
			};

			// Create a closing div node
			const closingWrapper: Html = {
				type: "html",
				value: "</div>"
			};

			// Replace the table with the wrapper, table, and closing wrapper
			parent.children.splice(index, 1, wrapper, node, closingWrapper);

			// Skip the newly inserted nodes to avoid infinite loops
			return index + 3;
		});
	};
};

export default remarkTableWrapper;
