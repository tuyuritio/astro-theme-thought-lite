import ruby from "@tuyuritio/remark-ruby";
import spoiler from "@tuyuritio/remark-spoiler";
import stringify from "rehype-stringify";
import CJK from "remark-cjk-friendly";
import CJKStrikethrough from "remark-cjk-friendly-gfm-strikethrough";
import mark from "remark-flexible-markers";
import GFM from "remark-gfm";
import ins from "remark-ins";
import parse from "remark-parse";
import rehype from "remark-rehype";
import { type Plugin, unified } from "unified";

// Unwrap a single top-level paragraph so inline strings render without an outer `<p>` wrapper
const unwrapParagraph: Plugin = () => (tree: any) => {
	if (tree.children?.length === 1 && tree.children[0].type === "element" && tree.children[0].tagName === "p") {
		tree.children = tree.children[0].children;
	}
};

export default unified()
	.use(parse)
	.use(GFM, { singleTilde: false })
	.use(ins)
	.use(mark)
	.use(spoiler)
	.use(CJK)
	.use(CJKStrikethrough, { singleTilde: false })
	.use(ruby)
	.use(rehype)
	.use(unwrapParagraph)
	.use(stringify);
