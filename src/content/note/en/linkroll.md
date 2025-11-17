---
title: Linkroll Component Guide
timestamp: 2025-11-17 00:00:00+00:00
tags: [Guide, MDX]
toc: true
---

The theme provides a `Linkroll` component for the **Linkroll** section to display friend links or recommended sites in a more elegant and flexible way.

## Import Component

> [!NOTE]
> The `Linkroll` component must be used in `mdx` files.

```mdx
import Linkroll from "$components/Linkroll.astro";

<Linkroll locale={props.locale} links={links} />
```

- `locale` - Current page language code, provided by `about.astro` as a [**component prop**](https://mdxjs.com/docs/using-mdx/#props);
- `links` - Array of link data, refer to [subsequent steps](#define-link-data).

## Define Link Data

```mdx
export const links = [
    {
        title: "Example Site",
        url: "https://example.com",
        image: "https://example.com/favicon.ico",
        description: "This is an example site",
        type: "resources"
    }
];
```

Each link object contains the following fields:

- `title`*: Display title
- `url`*: Target address
- `type`*: Category type, available options include:
  - `resources` - Tools & Resources
  - `community` - Organizations & Projects
  - `insights` - Media & Inspiration
  - `technology` - Technology & Development
  - `expertise` - Professional & Academic
  - `creative` - Design & Creativity
  - `lifestyle` - Life & Hobbies
  - `general` - General & Others
- `image`: Target site icon URL
- `description`: Description text

`*` indicates required fields.
