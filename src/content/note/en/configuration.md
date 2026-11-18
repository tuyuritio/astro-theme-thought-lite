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

## Visual themes

Configure appearance with `theme` in `site.config.ts`. Omitting it preserves the original ThoughtLite appearance and follows the system color scheme.

```ts
theme: {
  preset: "catppuccin", // "thought-lite" | "catppuccin" | custom theme object
  mode: "system",      // "system" | "light" | "dark"
  showToggle: true,
  colors: {
    light: { accent: "#40a02b", link: "#209fb5" },
    dark: { accent: "#a6e3a1", link: "#74c7ec" }
  },
  fonts: { body: "system-ui, sans-serif" },
  layout: { contentWidth: "1100px", lineHeight: 1.8 }
}
```

`thought-lite` retains the original monochrome palette. `catppuccin` uses Latte / Mocha for pages, the heatmap, Markdown links and alerts, and syntax highlighting. Overrides merge by field; light and dark palettes merge independently.

All four [official Catppuccin flavors](https://github.com/catppuccin/palette) are provided separately, preserving their official color values:

| Preset name | Flavor | Scheme |
| --- | --- | --- |
| `catppuccin-latte` | Latte | Light |
| `catppuccin-frappe` | Frappé | Dark |
| `catppuccin-macchiato` | Macchiato | Dark |
| `catppuccin-mocha` | Mocha | Dark |

Select a light/dark preset pair to keep page colors and syntax highlighting in sync:

```ts
theme: {
  preset: {
    light: "catppuccin-latte",
    dark: "catppuccin-frappe" // or catppuccin-macchiato / catppuccin-mocha
  },
  mode: "system"
}
```

`preset: "catppuccin"` is shorthand for Latte / Mocha. Preset pairs also work with `defineTheme()` through `extends`. `mode` still controls the initial scheme preference, and the visitor button switches between the selected light and dark flavors.

| Option | Purpose |
| --- | --- |
| `colors.light` / `colors.dark` | `primary`, `secondary`, `weak`: text levels; `background`, `block`, `shadow`, `selection`: page, blocks, borders/outlines, and selection. |
| Same | `accent`: latest-content heading; `link`: Markdown links; `heatmap`: activity cells; `success`, `info`, `warning`, `danger`: alerts; `codeBackground`: code block background. |
| `fonts` | `body`, `mono`, `display`: font stacks for body text, monospace text, and the prologue. These do not download fonts. Defaults retain locale-aware Noto Serif; register additional web fonts in `astro.config.ts`. |
| `layout` | `contentWidth`, `fontSize`, `mobileFontSize`: CSS lengths; `lineHeight`: numeric Markdown line height. |
| `code` | `light` / `dark`: Astro-supported Shiki theme names or objects. Rebuild to apply changes. `codeBackground` controls the background. |
| `mode` | Initial color mode, defaults to `system`. |
| `showToggle` | Show the light/dark button, defaults to `true`. Hiding it does not clear saved visitor preferences. |

An existing visitor preference (`localStorage.theme`, `light` or `dark`) takes priority over the site default. OS changes apply only without a manual choice. Switching still works for the current page if storage is blocked. Without JavaScript, the site default and system color scheme apply.

Restart the development server after changing a preset or syntax highlighting configuration, then rebuild before deploying.

### Create and share a theme

Add `src/themes/my-theme.ts`; no core component or preset registry changes are required:

```ts
import { defineTheme } from "../lib/theme";

export default defineTheme({
  name: "my-theme",
  extends: "catppuccin",
  colors: {
    light: { background: "#fffaf0", accent: "#8839ef" },
    dark: { background: "#181825", accent: "#cba6f7" }
  },
  layout: { contentWidth: "960px" }
});
```

Import this file as `myTheme` in `site.config.ts` and set `theme: { preset: myTheme }`. Share the file to reuse the theme, or pass another theme object to `extends`. Themes are selected at build time; the visitor button switches between light and dark only.

This configuration covers shared page styles. Page structure, author cards, content, logos, favicons, and OpenGraph image templates are maintained separately. Extend structure through optional components instead of copying entire theme pages.

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
