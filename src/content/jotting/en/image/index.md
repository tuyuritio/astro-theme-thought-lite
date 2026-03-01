---
title: Markdown Image Handling
timestamp: 2026-02-27 00:00:00+00:00
series: Astro
tags: [Content, Demo]
description: Demonstrates three ways to reference images in Markdown—relative paths, absolute paths, and external URLs—showcasing image optimization and management best practices.
---

Images in Markdown body text can be referenced from three sources:

### Relative Path

This approach is beneficial for content organization and management, and Astro will optimize the images.

For example, to insert an image in `image.md`:

Create an `image` directory and move `image.md` into it, renaming it `index.md`. Astro will automatically treat `index.md` as the default content for that directory, so the ID remains `image`.

Then place image files such as `photo.jpg` in the `image` directory, forming the following file structure:

```
image
├── index.md
└── photo.jpg
```

Finally, use a relative path to insert the image in `index.md`:

```md
![Image description](photo.jpg)
```

![Image description](photo.jpg)

> Photo source: [Pexels](https://www.pexels.com/photo/white-sailboat-on-water-273886/)

### Absolute Path

Images can be stored in the `/public` directory, in which case Astro will not optimize them.

Insert using an absolute path:

```md
![Favicon](/favicon-96x96.png)
```

![Favicon](/favicon-96x96.png)

### External Image Hosting

If images are hosted on an external service, use the image URL directly:

```md
![Sample image](https://picsum.photos/1600/900?random=1)
```

![Sample image](https://picsum.photos/1600/900?random=1)

> Random photos from: [Picsum](https://picsum.photos/)
