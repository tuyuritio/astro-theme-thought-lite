---
title: Markdown 拡張マニュアル
timestamp: 2025-08-07 00:00:00+00:00
series: Astro
tags: [Markup, Demo]
description: テーマで拡張されたMarkdown構文機能の詳細ガイド、ルビ注釈、略語、ネタバレテキストなどの特殊マークアップ構文を含む。
---

本来は愛用している [markdown-it](https://github.com/markdown-it/markdown-it) を Markdown レンダリングエンジンとして使いたかったのですが、Astro に適応させ、予期しないエラーを防ぐため、妥協して [remark](https://github.com/remarkjs/remark) を使用しました。

個人的な使用習慣により、構文拡張を実現するためにいくつかのプラグインを追加しました。

## Ruby

> プラグイン：[`remark-ruby-directive`](https://github.com/brklntmhwk/remark-ruby-directive)

```
:ruby[拼音(pīn yīn)]
```

:ruby[拼音(pīn yīn)]

```
:ruby[振り仮名（ふ　がな）]
```

:ruby[振り仮名（ふ　がな）]

## マスク

> 自作実装

```
!!マスクコンテンツ!!
```

!!マスクコンテンツ!!

## Emoji

> プラグイン：[`remark-gemoji`](https://github.com/remarkjs/remark-gemoji)

```
:wink: :cry: :laughing: :yum:
```

:wink: :cry: :laughing: :yum:

[Emoji チートシート](https://github.com/ikatyang/emoji-cheat-sheet?tab=readme-ov-file#table-of-contents)

## Katex

> プラグイン：[`remark-math` & `rehype-katex`](https://github.com/remarkjs/remark-math)

```
$e^{ix} = \cos x + i \sin x$
```

$e^{ix} = \cos x + i \sin x$

```
$$
(f*g)(t)=\int f(\tau)g(t-\tau)d\tau
$$
```

$$
(f*g)(t)=\int f(\tau)g(t-\tau)d\tau
$$

## 脚注

> プラグイン：[`remark-footnotes-extra`](https://github.com/miaobuao/remark-footnotes-extra)

```
脚注[^1]
[^1]: 脚注は**マークアップを含める**ことができます。
```

脚注[^1]
[^1]: 脚注は**マークアップを含める**ことができます。

```
インライン脚注^[インライン情報]
```

インライン脚注^[インライン情報]

## 略語

> 自作実装

```
ABBR abbr xABBRx

*[ABBR]: Abbreviation
```

ABBR abbr xABBRx

*[ABBR]: Abbreviation

## GitHub Alerts

> プラグイン：[remark-github-blockquote-alert](https://github.com/jaywcjlove/remark-github-blockquote-alert)

```
> [!NOTE]
> 一般情報
```

> [!NOTE]
> 一般情報

```
> [!TIP]
> オプション情報
```

> [!TIP]
> オプション情報

```
> [!IMPORTANT]
> 重要情報
```

> [!IMPORTANT]
> 重要情報

```
> [!WARNING]
> リスク情報
```

> [!WARNING]
> リスク情報

```
> [!CAUTION]
> 警告情報
```

> [!CAUTION]
> 警告情報

```
> [!NOTE/(･ρ･)ﾉ]
> カスタムタイトルテキスト
```

> [!NOTE/(･ρ･)ﾉ]
> カスタムタイトルテキスト

## 拡張テーブル

> プラグイン：[remark-extended-table](https://github.com/wataru-chocola/remark-extended-table)

```
| 左揃え   | 中央 | 右揃え |   中央   |
|:-------- |:----:| ------:| -------- |
| 通常セル |  マージセル  || マージ列 |
| 通常セル |   2×2 セル   ||    ^     |
| 通常セル |      ^       || 通常セル |
```

| 左揃え | 中央 | 右揃え | 中央 |
|:- |:-:| -:| - |
| 通常セル | マージセル || マージ列 |
| 通常セル | 2×2 セル ||^|
| 通常セル | ^ || 通常セル |
