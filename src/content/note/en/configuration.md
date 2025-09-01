---
title: Site Configuration Guide
timestamp: 2025-07-07 00:00:00+00:00
tags: [Guide, Astro]
---

## `astro.config.ts`

- `site` - Site URL
- `i18n`
    - `locales` - List of supported languages
    - `defaultLocale` - Default language
- `markdown`
    - `remarkPlugins` - Markdown processing plugins
    - `rehypePlugins` - HTML processing plugins

## `site.config.json`

- `title` - Site title
- `author`
    - **string** - Author name
    - **object**
        - `name` - Author name
        - `email` - Author email
        - `link` - Author personal website
- `description` - Site description
- `copyright` - Copyright information
    - `type` - CC license type
    - `year` - Copyright year or year range
- `feed` - Feed
    - `limit` - Content quantity limit for feeds

## Icon Generation

It is recommended to use [RealFaviconGenerator](https://realfavicongenerator.net/) to generate icons, and copy all the contents of the downloaded and extracted files to the `/public` directory.

The generated file list is as follows:

- `apple-touch-icon.png`
- `favicon-96x96.png`
- `favicon.ico`
- `favicon.svg`
- `site.webmanifest`
- `web-app-manifest-192x192.png`
- `web-app-manifest-512x512.png`

The content in `<head>` has been adapted according to RealFaviconGenerator's prompts and can be modified as needed.

After modification and deployment, you can use [Favicon checker](https://realfavicongenerator.net/favicon-checker) to verify.

## Internationalization (i18n) Configuration

The theme supports multi-language switching, with the default language being **English (`en`)**.

To add a new language, please create the corresponding translation file in the `src/i18n` directory and add that language to `i18n.locales` in `astro.config.ts`.

Then modify the `src/i18n/index.ts` file:

```ts
// Import the translation file for the new language
import zhCN from "./zh-cn.yaml";

// Add the new language to the locale mapping list
const translations = { 
  ...,
  "zh-cn": zhCN
};
```
