---
title: Content Creation Guide
timestamp: 2025-04-04 00:00:00+00:00
series: Astro
tags: [Content, Demo]
description: "Comprehensive guide to the theme's three sections: Notes, Jottings, and Information, helping users understand content types and publishing standards."
toc: true
top: 1
---

The theme's content can be divided into three sections: Notes, Jottings, and Information. Each section carries different content types and publishing purposes, designed to meet diverse expression and reading needs.

## Notes

"Notes" is the **core section** of this theme. It focuses on carrying and displaying **carefully conceived, content-rich long-form works**.

It is strongly recommended to publish **structurally complete, deeply argued or narratively rich original articles** in this section. This includes but is not limited to: in-depth book/movie reviews, thematic research, complete story creation, detailed experience sharing, systematic opinion discourse, etc.

Authors are encouraged to invest time in polishing content, pursuing depth, breadth, and quality. It is the main area for readers to obtain core valuable content.

## Jottings

"Jottings" aims to provide a **lightweight, immediate** recording space for capturing and sharing **scattered thoughts, momentary inspiration, daily observations, or brief insights**.

Content form is free and flexible, **usually short and concise**, which can be a few sentences of insights, a scene sketch, a fragmented idea that hasn't formed a system, or immediate reading/life notes.

## Information

Informational text contains four parts. If you remove the corresponding file, the corresponding area including the title will not be displayed on the site.

### Preface

"Preface" will be displayed on the site homepage as the **first impression** for visitors to understand you and the site. The homepage only displays the latest preface content, and clicking on the date allows you to view the **preface history**.

You can talk about your **life updates**, **insights** from reading and watching, **journey** of site maintenance, etc. You don't need to be too formal, but you can use this to convey the site's **foundational emotions** and **creative philosophy**.

Of course, you can also use this method to notify the site's **latest updates** or **important announcements**.

It is recommended to use timestamps or serial numbers to name preface files. Although the program will not directly use them for sorting, it helps with maintenance and version management.

### Introduction

"Introduction" is an important window to showcase the **site's characteristics** and **value proposition**.

You can describe the site's **creation background**, **core positioning**, **future vision**, and even display **personal resume**, as well as the emotions or viewpoints you hope to convey through this platform.

### Linkroll

"Linkroll" is used to display websites and resources. This is not only a recommendation for **quality content**, but also an important way to build **internet community** connections.

Here you can elaborate on your recommendation criteria and management methods for external links, providing visitors with opportunities for extended reading, making it an important part of the site.

> For more information about the `Linkroll` component, please refer to the [Linkroll Component Guide](/en/note/linkroll)

### Policy

"Policy" is important content for establishing site **compliance** and clarifying **responsibility relationships**.

It explains the website's privacy policy, terms of service, disclaimers and other key information, ensuring the legality and transparency of website operations.

## Image Insertion

To insert images in Markdown body text, you can use three sources:

### Relative Path

For example, to insert an image in [image-preview.md](image-preview/index.md):

You can create an `image-preview` directory, then move `image-preview.md` to that directory and rename it to `index.md`.

> [!NOTE]
> At this point, Astro will automatically treat `index.md` as the default content for that directory, so the ID remains `image-preview`.

Next, place image files in the `image-preview` directory, such as `photo.png`.

Then use the relative path to insert the image in `index.md`:

```md
![Image description](photo.png)
```

File structure:

```
image-preview
├── index.md
└── photo.png
```

### Absolute Path

You can also place images directly in the `/public` directory and use absolute paths to insert them:

```md
![Image description](/photo.png)
```

However, this method is not conducive to content organization and management. At the same time, Astro will not optimize the images, so it is generally **not recommended**.

### External Image Hosting

If you host images on external image hosting services (such as [imgbb](https://imgbb.com/)), you can directly use the image URL:

```md
![Image description](https://image.host/photo.png)
```
