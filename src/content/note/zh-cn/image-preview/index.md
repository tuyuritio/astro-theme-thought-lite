---
title: Markdown 图片预览
timestamp: 2025-04-04 00:00:00+00:00
series: Astro
tags: [Content, Demo]
description: 演示 Markdown 中图片引用的三种方式：相对路径、绝对路径和外部链接，展示图片优化和管理最佳实践。
---

本文演示 Markdown 中三种图片引用方式。

## 相对路径

> [!NOTE]
> 推荐使用该方式，有利于内容组织管理，同时 Astro 会对图片进行优化处理。

使用同目录下的图片文件[^boat]：

[^boat]: 图片来源：[Pexels](https://www.pexels.com/photo/white-sailboat-on-water-273886/)

![白色帆船](white_sailboat_on_water.jpg)

## 绝对路径

使用 `/public` 目录下的图片文件：

![ThoughtLite](/web-app-manifest-512x512.png)

## 外部图床

使用外部 URL 的图片[^random]：

[^random]: 随机图片来源：[Picsum](https://picsum.photos/)

![示例图片](https://picsum.photos/1600/900?random=1)
