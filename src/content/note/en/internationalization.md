---
title: Internationalization Configuration Guide
timestamp: 2026-03-21 00:00:00+00:00
series: Guide
tags: [Configuration, Astro]
description: Detailed guide on configuring multi-language support for the theme, including changing default language, adding new languages, managing translation files, and configuring content directory structure.
toc: true
---

The theme has built-in multi-language support, with the default language being **English (`en`)**.

Internationalization core configuration is located in the `i18n` field of `site.config.ts`, where you specify the list of enabled languages and the default language:

```ts
export default siteConfig({
  i18n: {
    // Array order determines the display order in the language picker
    locales: ["en", "zh-cn", "ja"],
    // Default language must be a value from `locales`
    defaultLocale: "en"
  },
});
```

## Single Language Mode

If you only need to use a single language for your site, you can streamline the file structure through the following steps to optimize your creative workflow.

> [!Warning]
> Do not directly delete the `i18n` configuration field, as this will cause the theme to malfunction!

Keep only the desired language in `i18n.locales` in `site.config.ts`, and remove other entries:

```ts
export default siteConfig({
  i18n: {
    locales: ["en"],
    defaultLocale: "en"
  },
});
```

### Adjusting Content Directory

In single language mode, language subdirectories are no longer needed. You can place content files directly under their respective section directories.

Here is a comparison of the directory structure for the "Note" section:

**Multi-language mode requires language directories under the section:**

```
content/
└── note/
    ├── en/
    │   └── post.md
    ├── ja/
    │   └── post.md
    └── zh-cn/
        └── post.md
```

**Single language directory structure removes the language level and stores files directly:**

```
content/
└── note/
    └── post.md
```

> [!Tip]
> - In single language mode, the language switcher will be automatically hidden.
> - Translation files already created for other languages can be kept; they will not affect site operation.

## Adding a New Language

To add a language not preset in the site, please follow these configuration steps (using Klingon `tlh` as an example):

### 1. Register New Language

Add the new language to the `i18n.locales` array in `site.config.ts`:

```ts
export default siteConfig({
  i18n: {
    locales: ["en", "zh-cn", "ja", "tlh"],
    defaultLocale: "en"
  },
});
```

### 2. Create Translation Files

Create a corresponding **YAML** translation file in the `src/i18n/` directory. Refer to existing translation files in the `i18n` directory for the format:

```yaml
# src/i18n/tlh/index.yaml

# Note: Add the `language` field as the display name for the current language
language: tlhIngan Hol
...
```

Import the new translation files in `src/i18n/index.ts`:

```ts
import tlh from "./tlh/index.yaml";
import tlhScript from "./tlh/script.yaml";

const translations = {
  ...,
  tlh: {
    ...tlh,
    script: tlhScript
  }
};
```

### 3. Create Content Language Subdirectories

Create corresponding language directories under each content section:

```
content/
├── note/tlh/
├── jotting/tlh/
├── information/tlh/
└── preface/tlh/
```

### 4. Add Fonts

If the new language requires specific fonts, please register the new font in `experimental.fonts` in `astro.config.ts`:

```ts
{
  name: "Noto Serif TLH",
  provider: SpecificFontProvider(),
  weights: [400, 700],
  fallbacks: ["serif"],
  cssVariable: "--font-noto-serif-tlh"
}
```

And add the font mapping in `src/layouts/App.astro`:

```ts
// src/layouts/App.astro
const mainFonts: Record<string, CssVariable> = {
  ...,
  tlh: "--font-noto-serif-tlh"
};
```

If you need to support Open Graph image generation for this language, you need to add the font file link in `src/graph/index.ts`:

```ts
// Locale-specific font URLs
const fonts: Record<string, string> = {
  ...,
  tlh: "https://....otf"
};
```
