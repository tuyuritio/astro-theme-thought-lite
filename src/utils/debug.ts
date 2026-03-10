import { visitParents } from "unist-util-visit-parents";
import type { Root } from "mdast";

function debug() {
	return (tree: Root) => {
		visitParents(tree, (node: any, _: any[]) => {
			if (node.type === "math" || node.type === "inlineMath") {
				console.dir(node, { depth: null });
			} else {
				console.log(node);
			}
		});
	};
}

export default debug;
