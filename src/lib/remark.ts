import { unified } from "unified";
import parse from "remark-parse";
import breaks from "remark-breaks";
import gfm from "remark-gfm";
import ins from "remark-ins";
import emoji from "remark-gemoji";
import math from "remark-math";
import rehype from "remark-rehype";
import sanitize, { defaultSchema } from "rehype-sanitize";
import links from "rehype-external-links";
import katex from "rehype-katex";
import stringify from "rehype-stringify";

// Extend the default sanitization schema to preserve math classes required by `rehype-katex`
const schema: typeof defaultSchema = {
	...defaultSchema,
	attributes: {
		...defaultSchema.attributes,
		code: [...(defaultSchema.attributes?.code ?? []), ["className", "language-math", "math-inline", "math-display"]]
	}
};

export default unified()
	.use(parse)
	.use(breaks)
	.use(gfm, { singleTilde: false })
	.use(ins)
	.use(emoji)
	.use(math)
	.use(rehype)
	.use(sanitize, schema)
	.use(links, { target: "_blank", rel: ["nofollow", "noopener", "noreferrer"] })
	.use(katex)
	.use(stringify);
