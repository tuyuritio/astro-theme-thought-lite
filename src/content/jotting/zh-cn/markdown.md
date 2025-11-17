---
title: Markdown 扩展手册
timestamp: 2024-07-21 00:00:00+00:00
series: Astro
tags: [Markup, Demo]
description: 详细介绍主题中扩展的 Markdown 语法功能，包括 Ruby 注音、缩写、剧透文本等特殊标记语法。
---

原本想使用我最喜欢的 [markdown-it](https://github.com/markdown-it/markdown-it) 作为 Markdown 渲染引擎。但为了适配 Astro，防止出现意外错误，还是妥协使用了 [remark](https://github.com/remarkjs/remark)。

出于个人的使用习惯，添加了部分插件以实现语法扩展。

## Ruby

> 插件：[`remark-ruby-directive`](https://github.com/brklntmhwk/remark-ruby-directive)

```
:ruby[拼音(pīn yīn)]
```

:ruby[拼音(pīn yīn)]

```
:ruby[振り仮名（ふ　がな）]
```

:ruby[振り仮名（ふ　がな）]

## 遮罩

> 自行实现

```
!!遮罩内容!!
```

!!遮罩内容!!

## Emoji

> 插件：[`remark-gemoji`](https://github.com/remarkjs/remark-gemoji)

```
:wink: :cry: :laughing: :yum:
```

:wink: :cry: :laughing: :yum:

[Emoji 速查表](https://github.com/ikatyang/emoji-cheat-sheet?tab=readme-ov-file#table-of-contents)

## Katex

> 插件：[`remark-math` & `rehype-katex`](https://github.com/remarkjs/remark-math)

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

> 插件：[`remark-footnotes-extra`](https://github.com/miaobuao/remark-footnotes-extra)

```
Footnote[^1]
[^1]: Footnote **can have markup**.
```

Footnote[^1]
[^1]: Footnote **can have markup**.

```
Inline Footnote^[Inline information]
```

Inline Footnote^[Inline information]

## 缩写

> 自行实现

```
ABBR abbr xABBRx

*[ABBR]: Abbreviation
```

ABBR abbr xABBRx

*[ABBR]: Abbreviation

## GitHub Alerts

> 插件：[remark-github-blockquote-alert](https://github.com/jaywcjlove/remark-github-blockquote-alert)

```
> [!NOTE]
> 常规信息
```

> [!NOTE]
> 常规信息

```
> [!TIP]
> 可选信息
```

> [!TIP]
> 可选信息

```
> [!IMPORTANT]
> 重要信息
```

> [!IMPORTANT]
> 重要信息

```
> [!WARNING]
> 风险信息
```

> [!WARNING]
> 风险信息

```
> [!CAUTION]
> 警告信息
```

> [!CAUTION]
> 警告信息

```
> [!NOTE/(･ρ･)ﾉ]
> 自定义标题文字
```

> [!NOTE/(･ρ･)ﾉ]
> 自定义标题文字

## 表格扩展

> 插件：[remark-extended-table](https://github.com/wataru-chocola/remark-extended-table)

```
| 左对齐     | 居中 | 右对齐 |    居中    |
|:---------- |:----:| ------:| ---------- |
| 普通单元格 |  合并单元格  ||   合并列   |
| 普通单元格 |  2×2 单元格  ||     ^      |
| 普通单元格 |       ^      || 普通单元格 |
```

| 左对齐 | 居中 | 右对齐 | 居中 |
|:- |:-:| -:| - |
| 普通单元格 | 合并单元格 || 合并列 |
| 普通单元格 | 2×2 单元格 ||^|
| 普通单元格 | ^ || 普通单元格 |
