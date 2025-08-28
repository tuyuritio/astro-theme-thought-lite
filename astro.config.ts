// @ts-check
import { defineConfig, passthroughImageService } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import yaml from "@rollup/plugin-yaml";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import UnoCSS from "unocss/astro";
import swup from "@swup/astro";
import icon from "astro-icon";
import github_light from "shiki/themes/github-light.mjs"

import GFM from "remark-gfm";
import ins from "remark-ins";
import mark from "remark-flexible-markers";
import CJK from "remark-cjk-friendly";
import CJK_strikethrough from "remark-cjk-friendly-gfm-strikethrough";
import math from "remark-math";
import gemoji from "remark-gemoji";
import footnote from "remark-footnotes-extra";
import { remarkExtendedTable as table, extendedTableHandlers as table_handler } from "remark-extended-table";
import directive from "remark-directive";
import ruby from "remark-ruby-directive";
import alerts from "remark-github-blockquote-alert";
import { rehypeHeadingIds as ids } from "@astrojs/markdown-remark";
import anchor from "rehype-autolink-headings";
import links from "rehype-external-links";
import katex from "rehype-katex";
// @ts-ignore
import figure from "rehype-figure";
import sectionize from "@hbsnow/rehype-sectionize";

import spoiler from "./src/utils/remark/spoiler";
import abbr from "./src/utils/remark/abbr";
import wrapper from "./src/utils/remark/table-wrapper";
import copy from "./src/utils/code-copy";

// https://astro.build/config
export default defineConfig({
  site: "https://astro-theme-thought-lite.ttio.workers.dev",
  trailingSlash: "never",
  i18n: {
    locales: ["en", "zh-cn", "ja"],
    defaultLocale: "en",
    routing: {
      redirectToDefaultLocale: false,
      prefixDefaultLocale: false,
    }
  },
  image: {
    service: passthroughImageService(),
  },
  markdown: {
    remarkPlugins: [
      [GFM, { singleTilde: false }],
      ins,
      mark,
      spoiler,
      CJK,
      [CJK_strikethrough, { singleTilde: false }],
      math,
      gemoji,
      footnote,
      abbr,
      wrapper,
      [table, { colspanWithEmpty: true }],
      wrapper,
      directive,
      ruby,
      [alerts, { legacyTitle: true }]
    ],
    remarkRehype: {
      footnoteLabel: null,
      footnoteLabelTagName: "p",
      footnoteLabelProperties: {
        className: ["hidden"]
      },
      handlers: {
        ...table_handler
      }
    },
    rehypePlugins: [
      ids,
      [anchor, { behavior: "append", content: { type: "text", value: "󰌷" } }],
      [links, { target: "_blank", rel: ["nofollow", "noopener", "noreferrer"] }],
      katex,
      figure,
      sectionize
    ],
    smartypants: false,
    shikiConfig: {
      themes: {
        light: {
          ...github_light,
          colorReplacements: {
            "#fff": "var(--block-color)"
          }
        },
        dark: "dark-plus"
      },
      transformers: [
        copy({
          duration: 1500
        }),
      ]
    }
  },
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    },
    imageService: "compile"
  }),
  vite: {
    plugins: [yaml()]
  },
  integrations: [
    svelte(),
    sitemap(),
    swup({
      globalInstance: true,
      preload: false,
      smoothScrolling: false,
      progress: true
    }),
    UnoCSS({
      injectReset: "@unocss/reset/normalize.css"
    }),
    icon({
      include: {
        "fa6-brands": [
          "creative-commons",
          "creative-commons-by",
          "creative-commons-sa",
          "creative-commons-nc",
          "creative-commons-nd",
          "creative-commons-zero"
        ],
        lucide: [
          "copyright",
          "align-justify",
          "signature",
          "message-square",
          "arrow-up-to-line",
          "ellipsis",
          "arrow-left",
          "arrow-right",
          "circle-x",
          "circle-question-mark",
          "circle-check",
          "circle-alert",
          "info",
          "x",
          "log-out",
          "refresh-cw",
          "triangle-alert",
          "file-search",
          "smile",
          "trash",
          "pencil",
          "share-2",
          "history",
          "reply",
          "earth",
          "rss",
          "calendar",
          "library",
          "tag",
          "sun",
          "moon",
          "house",
          "tent",
          "list",
          "at-sign",
          "feather",
          "user-round",
          "pilcrow",
          "clock-arrow-up",
          "clock-arrow-down",
          "flag-triangle-right",
          "scale",
          "siren",
        ],
        "simple-icons": [
          "astro",
          "svelte",
          "github",
          "google",
          "x",
        ],
        "svg-spinners": [
          "3-dots-move",
          "pulse-3",
          "pulse-rings-3"
        ]
      }
    })
  ]
});