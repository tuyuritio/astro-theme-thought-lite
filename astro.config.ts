// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import yaml from "@rollup/plugin-yaml";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import swup from "@swup/astro";
import githubLight from "shiki/themes/github-light.mjs";

import GFM from "remark-gfm";
import ins from "remark-ins";
import mark from "remark-flexible-markers";
import CJK from "remark-cjk-friendly";
import CJKStrikethrough from "remark-cjk-friendly-gfm-strikethrough";
import math from "remark-math";
import gemoji from "remark-gemoji";
import footnote from "remark-footnotes-extra";
import { remarkExtendedTable as table, extendedTableHandlers as tableHandler } from "remark-extended-table";
import directive from "remark-directive";
import ruby from "remark-ruby-directive";
import alerts from "remark-github-blockquote-alert";
import { rehypeHeadingIds as ids } from "@astrojs/markdown-remark";
import anchor from "rehype-autolink-headings";
import links from "rehype-external-links";
import katex from "rehype-katex";
import sectionize from "@hbsnow/rehype-sectionize";

import spoiler from "./src/utils/remark/spoiler";
import attr from "./src/utils/remark/attr";
import abbr from "./src/utils/remark/abbr";
import wrapper from "./src/utils/remark/table-wrapper";
import copy from "./src/utils/code-copy";
import reading from "./src/utils/remark/reading";
import figure from "./src/utils/remark/figure";

import siteConfig from "./site.config";

// https://astro.build/config
export default defineConfig({
	adapter: cloudflare({
		platformProxy: {
			enabled: true
		},
		imageService: "compile"
	}),
	site: "https://thought-lite.ttio.workers.dev",
	trailingSlash: "never",
	i18n: {
		...siteConfig.i18n,
		routing: {
			redirectToDefaultLocale: false,
			prefixDefaultLocale: false
		}
	},
	markdown: {
		remarkPlugins: [
			[GFM, { singleTilde: false }],
			ins,
			mark,
			spoiler,
			attr,
			CJK,
			[CJKStrikethrough, { singleTilde: false }],
			math,
			gemoji,
			footnote,
			abbr,
			[table, { colspanWithEmpty: true }],
			wrapper,
			directive,
			ruby,
			[alerts, { legacyTitle: true }],
			reading
		],
		remarkRehype: {
			footnoteLabel: null,
			footnoteLabelTagName: "p",
			footnoteLabelProperties: {
				className: ["hidden"]
			},
			handlers: {
				...tableHandler
			}
		},
		rehypePlugins: [
			ids,
			[anchor, { behavior: "wrap" }],
			[links, { target: "_blank", rel: ["nofollow", "noopener", "noreferrer"] }],
			katex,
			figure,
			sectionize
		],
		smartypants: false,
		shikiConfig: {
			themes: {
				light: {
					...githubLight,
					colorReplacements: {
						"#fff": "var(--block-color)"
					}
				},
				dark: "dark-plus"
			},
			transformers: [
				copy({
					duration: 1500
				})
			]
		}
	},
	vite: {
		// @ts-expect-error
		plugins: [yaml(), tailwindcss()]
	},
	integrations: [
		svelte(),
		mdx(),
		sitemap(),
		swup({
			globalInstance: true,
			preload: false,
			smoothScrolling: false,
			progress: true
		})
	]
});
