---
title: Markdown Image Preview
timestamp: 2025-04-04 00:00:00+00:00
series: Astro
tags: [Content, Demo]
description: "Demonstration of three image referencing methods in Markdown: relative paths, absolute paths, and external links, showcasing image optimization and management best practices."
---

This article demonstrates three ways to reference images in Markdown.

## Relative Path

> [!NOTE]
> This approach is recommended as it helps with content organization and management, while Astro will optimize the images.

Using an image file from the same directory[^boat]:

[^boat]: Image source: [Pexels](https://www.pexels.com/photo/white-sailboat-on-water-273886/)

![White Sailboat](white_sailboat_on_water.jpg)

## Absolute Path

Using an image file from the `/public` directory:

![アッカリン～](/akkarin.webp)

## External Image Hosting

Using an image from an external URL[^random]:

[^random]: Random image source: [Picsum](https://picsum.photos/)

![Sample Image](https://picsum.photos/1600/900?random=1)
