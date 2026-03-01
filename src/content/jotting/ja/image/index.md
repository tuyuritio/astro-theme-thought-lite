---
title: Markdown 画像処理
timestamp: 2026-02-27 00:00:00+00:00
series: Astro
tags: [Content, Demo]
description: Markdown での画像参照の3つの方法（相対パス、絶対パス、外部URL）を示し、画像の最適化と管理のベストプラクティスを紹介します。
---

Markdown の本文に画像を挿入する場合、3つのソースから参照できます：

### 相対パス

この方法はコンテンツの整理と管理に役立ち、Astro が画像を最適化します。

例えば、`image.md` に画像を挿入する場合：

`image` ディレクトリを作成し、`image.md` をそのディレクトリに移動して `index.md` にリネームします。Astro は自動的に `index.md` をそのディレクトリのデフォルトコンテンツとして扱うため、ID は引き続き `image` となります。

次に、`photo.jpg` などの画像ファイルを `image` ディレクトリに配置して、以下のファイル構造を形成します：

```
image
├── index.md
└── photo.jpg
```

最後に、`index.md` の中で相対パスを使って画像を挿入します：

```md
![画像の説明](photo.jpg)
```

![画像の説明](photo.jpg)

> 写真提供：[Pexels](https://www.pexels.com/photo/white-sailboat-on-water-273886/)

### 絶対パス

画像を `/public` ディレクトリに配置することができますが、その場合 Astro は画像を最適化しません。

絶対パスで画像を挿入：

```md
![Favicon](/favicon-96x96.png)
```

![Favicon](/favicon-96x96.png)

### 外部画像ホスティング

画像を外部サービスでホストしている場合は、画像の URL を直接使用できます：

```md
![サンプル画像](https://picsum.photos/1600/900?random=1)
```

![サンプル画像](https://picsum.photos/1600/900?random=1)

> ランダム画像提供：[Picsum](https://picsum.photos/)
