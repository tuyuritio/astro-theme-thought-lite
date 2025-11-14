---
title: Internationalization Configuration Guide
timestamp: 2025-11-07 00:00:00+00:00
tags: [Guide, Astro]
description: Detailed guide on configuring multi-language support for the theme, including changing default language, adding new languages, managing translation files, and configuring content directory structure.
---

The theme has built-in multi-language support, with the default language being **English (`en`)**.

## Changing Default Language

Modify `i18n.defaultLocale` in `site.config.ts`:

```ts
export default siteConfig({
    i18n: {
        locales: ["en", "zh-cn", "ja"],
        // Change default language to Simplified Chinese
        defaultLocale: "zh-cn"
    },
});
```

## Adding a New Language

Create a new **YAML** translation file in the `src/i18n/` directory, such as `tlh/index.yaml` (Klingon).

Add translation content following the format of existing translation files in the `i18n` directory:

```yaml
# src/i18n/tlh/index.yaml

# Note: Add the `language` field as the display name for the current language
language: tlhIngan Hol
...
```

Modify `src/i18n/index.ts` to import and register the new language:

```ts
import tlh from "./tlh/index.yaml";
import tlhScript from "./tlh/script.yaml";

const translations = {
  en: {
    ...en,
    script: enScript
  },
  "zh-cn": {
    ...zhCN,
    script: zhCNScript
  },
  ja: {
    ...ja,
    script: jaScript
  },
  tlh: {
    ...tlh,
    script: tlhScript
  }
};
```

If the new language requires specific font support, you can add a font mapping in the `notoFonts` object in `src/layouts/App.astro`:

```ts
const notoFonts: Record<string, string> = {
    "zh-cn": "Noto+Serif+SC",
    ja: "Noto+Serif+JP",
    tlh: "Noto+Serif+..."
};
```

Add the new language to the `i18n.locales` array in `site.config.ts`:

```ts
export default siteConfig({
    i18n: {
        locales: ["en", "zh-cn", "ja", "tlh"],
        defaultLocale: "en"
    },
});
```

Create corresponding language directories under each content section:

```
content/
├── note/tlh/
├── jotting/tlh/
├── information/tlh/
└── preface/tlh/
```

## Single Language Mode

> [!Warning]
> Do not directly delete the `i18n` configuration field, as this will cause the theme to malfunction!

Keep only the desired language in `i18n.locales` in `site.config.ts`, removing other entries:

```ts
export default siteConfig({
    i18n: {
        locales: ["en"],
        defaultLocale: "en"
    },
});
```

Remove language subdirectories and create content files directly under section directories.

**Multi-language directory structure:**

```
content/
├── note/
│   ├── en/
│   │   ├── common.md
│   │   ├── image-preview/
│   │   │   ├── index.md
│   │   │   └── photo.png
│   │   └── special.md
│   ├── ja/
│   │   ├── common.md
│   │   └── image-preview/
│   │       ├── index.md
│   │       └── photo.png
│   └── zh-cn/
│       ├── common.md
│       └── image-preview/
│           ├── index.md
│           └── photo.png
├── jotting/
│     ├── en/
│     │   ├── normal.md
│     │   └── ...
│     ├── ja/
│     └── zh-cn/
└── ...
```

**Single language directory structure:**

```
content/
├── note/
│   ├── common.md
│   ├── image-preview/
│   │   ├── index.md
│   │   └── photo.png
│   └── special.md
├── jotting/
│   ├── normal.md
│   └── ...
└── ...
```

> [!Tip]
> - In single language mode, the language switcher will be automatically hidden
> - Other language translation files that have been created can be kept and will not affect operation
