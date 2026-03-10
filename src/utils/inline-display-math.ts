import { visitParents, SKIP } from "unist-util-visit-parents";
import type { Root, Paragraph, RootContent } from "mdast";
import type { InlineMath } from "mdast-util-math";

interface Options {
	enabled: boolean;
}

function normalizeClass(v: unknown): string[] {
	if (Array.isArray(v)) return v.map(String);
	if (typeof v === "string") return v.split(/\s+/);
	return [];
}

function remarkInlineDisplayMath(opt: Options) {
	const { enabled = true } = opt;

	if (!enabled) return;

	return (tree: Root) => {
		visitParents(tree, "inlineMath", (node: InlineMath, parents) => {
			const parent = parents.at(-1) as Paragraph | undefined;
			const grand = parents.at(-2) as any;

			if (!parent || !grand) return;
			if (parent.type !== "paragraph") return;

			const index = parent.children.indexOf(node);

			const srcLen = (node.position?.end.offset ?? 0) - (node.position?.start.offset ?? 0);

			const valLen = node.value.length;

			// judge if $$...$$
			if (srcLen - valLen <= 2) return;

			const before = parent.children.slice(0, index);
			const after = parent.children.slice(index + 1);

			// Skip if an inlineMath already appeared earlier in this paragraph.
			// This ensures the transformation runs at most once per paragraph
			// and avoids AST mutation issues during traversal.
			if (before.some(n => n.type === "inlineMath")) return;

			const blocks: RootContent[] = [];

			if (before.length) {
				blocks.push({
					type: "paragraph",
					children: before
				});
			}

			const data = {
				...node.data,
				hName: "code",
				hProperties: {
					...node.data?.hProperties,
					className: normalizeClass(node.data?.hProperties?.className).map(c => (c === "math-inline" ? "math-display" : c))
				}
			};

			blocks.push({
				type: "math",
				value: node.value,
				position: node.position,
				data
			} as any);

			if (after.length) {
				blocks.push({
					type: "paragraph",
					children: after
				});
			}

			const pIndex = grand.children.indexOf(parent);
			grand.children.splice(pIndex, 1, ...blocks);

			return SKIP;
		});
	};
}

export default remarkInlineDisplayMath;
