import type { Root } from "mdast";
// biome-ignore lint/suspicious/noShadowRestrictedNames: toString is a named import from mdast-util-to-string library
import { toString } from "mdast-util-to-string";
import { type Plugin, unified } from "unified";
import parse from "remark-parse";
import GFM from "remark-gfm";
import ins from "remark-ins";
import mark from "remark-flexible-markers";
import spoiler from "@tuyuritio/remark-spoiler";
import CJK from "remark-cjk-friendly";
import CJKStrikethrough from "remark-cjk-friendly-gfm-strikethrough";
import ruby from "@tuyuritio/remark-ruby";
import attr from "@tuyuritio/remark-attribute";
import math from "remark-math";
import gemoji from "remark-gemoji";
import footnote from "remark-footnotes-extra";
import abbr from "@tuyuritio/remark-abbreviation";
import { remarkExtendedTable as table } from "remark-extended-table";
import alerts from "@tuyuritio/remark-github-alert";

const stringifyPlain: Plugin<[], Root, string> = function () {
	this.compiler = tree => toString(tree).replace(/\s+/g, " ").trim();
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
	.use(attr)
	.use(math)
	.use(gemoji)
	.use(footnote)
	.use(abbr)
	.use(table, { colspanWithEmpty: true })
	.use(alerts, { typeFormat: "capitalize" })
	.use(stringifyPlain);
