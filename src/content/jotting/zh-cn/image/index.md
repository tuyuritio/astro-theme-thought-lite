---
title: Markdown 图片处理
timestamp: 2026-02-27 00:00:00+00:00
series: Astro
tags: [Content, Demo]
description: 演示 Markdown 中图片引用的三种方式：相对路径、绝对路径和外部链接，展示图片优化和管理最佳实践。
---

在 Markdown 正文中插入图片，可以通过三种来源引用：

### 相对路径

使用该方式有利于内容组织管理，同时 Astro 会对图片进行优化处理。

例如，要在 `image.md` 中插入图片：

可以创建 `image` 目录，并将 `image.md` 移动到该目录下后重命名为 `index.md`。此时 Astro 会自动将 `index.md` 视为该目录的默认内容，因此 ID 依旧为 `image`。

接着在 `image` 目录下存放图片文件，如 `photo.jpg`，形成如下文件结构：

```
image
├── index.md
└── photo.jpg
```

最后在 `index.md` 中使用相对路径插入图片：

```md
![图片描述](photo.jpg)
```

![图片描述](photo.jpg)

> 图片来源：[Pexels](https://www.pexels.com/photo/white-sailboat-on-water-273886/)

### 绝对路径

可以将图片存放在 `/public` 目录下，此时 Astro 不会对图片做优化处理。

使用绝对路径插入图片：

```md
![Favicon](/favicon-96x96.png)
```

![Favicon](/favicon-96x96.png)

### 外部图床

如果将图片托管在外部图床上，则可以直接使用图片的 URL：

```md
![示例图片](https://picsum.photos/1600/900?random=1)
```

![示例图片](https://picsum.photos/1600/900?random=1)

> 随机图片来源：[Picsum](https://picsum.photos/)
