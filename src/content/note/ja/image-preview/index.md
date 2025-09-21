---
title: Markdown画像プレビュー
timestamp: 2025-04-04 00:00:00+00:00
series: Astro
tags: [Content, Demo]
description: Markdownにおける3つの画像参照方法のデモンストレーション：相対パス、絶対パス、外部リンク、画像最適化と管理のベストプラクティスを紹介。
---

この記事では、Markdownで画像を参照する3つの方法を紹介します。

## 相対パス

> [!NOTE]
> この方法は、コンテンツの整理と管理に有用であり、Astroが画像を最適化するため推奨されます。

同じディレクトリの画像ファイルを使用する場合[^boat]：

[^boat]: 画像ソース：[Pexels](https://www.pexels.com/photo/white-sailboat-on-water-273886/)

![白いヨット](white_sailboat_on_water.jpg)

## 絶対パス

`/public`ディレクトリの画像ファイルを使用する場合：

![ThoughtLite](/web-app-manifest-512x512.png)

## 外部画像ホスティング

外部URLの画像を使用する場合[^random]：

[^random]: ランダム画像ソース：[Picsum](https://picsum.photos/)

![サンプル画像](https://picsum.photos/1600/900?random=1)
