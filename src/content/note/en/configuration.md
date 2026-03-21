---
title: Site Configuration Guide
timestamp: 2026-03-21 00:00:00+00:00
series: Guide
tags: [Configuration, Astro]
description: Essential configuration guide for the theme, covering site information, display effects, icon generation, and other core configuration items.
toc: true
---

## Configuration Reference

The theme's custom configuration is located in the `site.config.ts` file in the root directory. Below are the detailed descriptions for each configuration item:

| Configuration Item | Type | Description |
|:- |:- |:- |
| `title` | `string` | Site title. |
| `prologue` | `string` | Homepage slogan; supports `\n` for line breaks. |
| `author.name` | `string` | Author name. |
| `author.email` | `string` | Author email. |
| `author.link` | `string` | Author's personal homepage link. |
| `description` | `string` | Site description. |
| `copyright.type` | `CCLicenseType` | [Creative Commons 4.0](https://creativecommons.org/chooser/) license type. |
| `copyright.year` | `string` | Copyright year or year range. |
| `timezone` | `string` | Site display timezone, refer to [Timezone List](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List). |
| `i18n` | `object` | See [Internationalization Configuration Guide](internationalization) for details. |
| `pagination` | `Record<Section, number>` | Number of items displayed per page for each section. |
| `heatmap` | `Heatmap` | Heatmap display configuration. |
| `feed.section` | `"*" \| Section[]` | Content sections included in the feed; `*` indicates all. |
| `feed.limit` | `number` | Maximum number of items displayed in the feed. |
| `latest` | `"*" \| Section[]` | Sections displayed in the "Latest" on the homepage; `*` indicates all. |

### Type Descriptions

#### `CCLicenseType`

- `"CC0 1.0"`
- `"CC BY 4.0"`
- `"CC BY-SA 4.0"`
- `"CC BY-NC 4.0"`
- `"CC BY-NC-SA 4.0"`
- `"CC BY-ND 4.0"`
- `"CC BY-NC-ND 4.0"`

#### `Section`

- `"note"`
- `"jotting"`

#### `Heatmap`

| `unit` | `weeks` | `years` |
|:- | - | - |
| `day` | Total number of weeks to display | × |
| `week` | *Fixed display of 51 weeks* | × |
| `month` | × | Total number of years to display |

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
