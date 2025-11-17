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
    | `PASS_KEY`* | Used for generating tokens, 16-byte Base64 format key, generate with `openssl rand -base64 16`<br>or `node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"` |
    | `NOTIFY_PUBLIC_KEY`* | VAPID public key for desktop push notifications, generate with `npx web-push generate-vapid-keys` |
    | `NOTIFY_PRIVATE_KEY`* | VAPID private key for desktop push notifications, generated along with public key |
    | `AUTHOR_ID` | Author ID for identifying site author in comment section; check in [Cloudflare D1 Panel](https://dash.cloudflare.com/?to=/:account/workers/d1) |

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
- `comment`
    - `max-length` - Maximum comment length
- `latest` - Latest content display
    - `note` - Whether to display latest note
    - `jotting` - Whether to display latest jotting

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

### Homepage Logo

The reference location is in `src/pages/[...locale]/index.astro`, which uses SVG format icons imported by the `astro-icon` library by default.

```astro
<Icon name="site-logo" size={100} is:inline />
```

Configuration can be done through the following three methods:

1. Replace `src/icons/site-logo.svg` with an SVG file, which will be [automatically read](https://www.astroicon.dev/guides/customization/#local-icons) and applied.
    - It is recommended to use `stroke="currentColor"` to adapt to theme color changes.
2. Use [Iconify icon sets](https://www.astroicon.dev/guides/customization/#open-source-icon-sets), referenced in the format `<PREFIX>:<ICON>`.
3. Directly modify to image import or remove this part of the content.
