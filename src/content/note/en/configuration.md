---
title: Site Configuration Guide
timestamp: 2025-11-04 00:00:00+00:00
tags: [Guide, Astro]
description: Essential configuration guide for Astro theme sites, covering environment variables, site information, Markdown processing, and icon generation.
---

## `.env`

1. Run the command to create `.env` file:
    ```sh
    cp .env.example .env
    ```
2. Modify or add variables:
    | Variable | Description |
    | - | - |
    | `PUBLIC_TIMEZONE`* | Default display timezone, refer to [Timezone List](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List) |

    `*` indicates required options.

## `astro.config.ts`

- `site` - Site URL
- `i18n`
    - `locales` - List of supported languages
    - `defaultLocale` - Default language
- `markdown`
    - `remarkPlugins` - Markdown processing plugins
    - `rehypePlugins` - HTML processing plugins

## `site.config.ts`

- `title` - Site title
- `prologue` - Homepage tagline, supports `\n` line breaks
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
    - `section` - Feed content sections
        - **`*`** - All sections
        - **array**
            - `note` - Note section
            - `jotting` - Jotting section
    - `limit` - Content quantity limit
- `latest` - Latest content display
    - `note` - Whether to display latest note
    - `jotting` - Whether to display latest jotting

## Icon Generation

It is recommended to use [RealFaviconGenerator](https://realfavicongenerator.net/) to generate icons, download and extract the following files, and overwrite them to the `/public` directory:

- `favicon-96x96.png`
- `favicon.ico`
- `favicon.svg`

### Homepage Logo

The reference location is in `src/pages/[...locale]/index.astro`, imported using the `import Logo from "$icons/site-logo.svg"` statement.

```astro
<Logo width={100} />
```

Configuration can be done through the following methods:

1. Replace `src/icons/site-logo.svg` with an SVG file.
    - It is recommended to use `stroke="currentColor"` to adapt to light/dark theme changes.
2. Modify to image import.
3. Directly replace or remove this part of the content.
