// @ts-check
import { defineConfig, passthroughImageService } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import yaml from "@rollup/plugin-yaml";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import UnoCSS from "unocss/astro";
import swup from "@swup/astro";
import icon from "astro-icon";
import one_light from "shiki/themes/one-light.mjs"

import GFM from "remark-gfm";
import ins from "remark-ins";
import mark from "remark-flexible-markers";
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
          ...one_light,
          colorReplacements: {
            "#fafafa": "var(--block-color)"
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
    }
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
        "fa6-regular": [
          "paper-plane",
          "copyright"
        ],
        "fa6-solid": [
          "train-subway",
          "b",
          "signature",
          "scale-balanced"
        ],
        "fa6-brands": [
          "creative-commons",
          "creative-commons-by",
          "creative-commons-sa",
          "creative-commons-nc",
          "creative-commons-nd",
          "creative-commons-zero"
        ],
        octicon: [
          "three-bars-16",
          "comment-16",
          "move-to-top-16",
          "kebab-horizontal-16",
          "arrow-right-16",
          "arrow-left-16",
          "x-circle-16",
          "question-16",
          "check-circle-16",
          "info-16",
          "unverified-16",
          "verified-16",
          "x-16",
          "sign-out-16",
          "check-16",
          "sync-16",
          "alert-16",
          "file-code-16",
          "smiley-16",
          "trash-16",
          "pencil-16",
          "share-android-16",
          "history-16",
          "reply-16",
          "globe-16",
          "project-roadmap-16",
          "rocket-16",
          "rss-16",
          "calendar-16",
          "repo-16",
          "tag-16",
          "quote-16",
          "milestone-16",
          "moon-16",
          "sun-16",
          "home-16",
          "mail-16",
          "list-unordered-16",
          "mention-16",
          "person-16",
          "note-16",
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