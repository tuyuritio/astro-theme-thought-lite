import { unified } from "unified";
import parse from "remark-parse";
import breaks from "remark-breaks";
import gfm from "remark-gfm";
import ins from "remark-ins";
import emoji from "remark-gemoji";
import math from "remark-math";
import rehype from "remark-rehype";
import links from "rehype-external-links";
import katex from "rehype-katex";
import stringify from "rehype-stringify";

export default unified()
	.use(parse)
	.use(breaks)
	.use(gfm, { singleTilde: false })
	.use(ins)
	.use(emoji)
	.use(math)
	.use(rehype)
	.use(links, { target: "_blank", rel: ["nofollow", "noopener", "noreferrer"] })
	.use(katex)
	.use(stringify);
