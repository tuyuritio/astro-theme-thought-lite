---
title: Markdown Extension Manual
timestamp: 2024-07-21 00:00:00+00:00
series: Astro
tags: [Markup, Demo]
description: Detailed guide to extended Markdown syntax features in the theme, including Ruby annotations, abbreviations, spoiler text, and other special markup syntax.
---

I originally wanted to use my favorite [markdown-it](https://github.com/markdown-it/markdown-it) as the Markdown rendering engine. But to adapt to Astro and prevent unexpected errors, I compromised and used [remark](https://github.com/remarkjs/remark).

Out of personal usage habits, I added some plugins to implement syntax extensions.

## Ruby

> Plugin: [`remark-ruby-directive`](https://github.com/brklntmhwk/remark-ruby-directive)

```
:ruby[拼音(pīn yīn)]
```

:ruby[拼音(pīn yīn)]

```
:ruby[振り仮名（ふ　がな）]
```

:ruby[振り仮名（ふ　がな）]

## Spoiler

> Self-implemented

```
!!Spoiler content!!
```

!!Spoiler content!!

## Emoji

> Plugin: [`remark-gemoji`](https://github.com/remarkjs/remark-gemoji)

```
:wink: :cry: :laughing: :yum:
```

:wink: :cry: :laughing: :yum:

[Emoji Cheat Sheet](https://github.com/ikatyang/emoji-cheat-sheet?tab=readme-ov-file#table-of-contents)

## Katex

> Plugin: [`remark-math` & `rehype-katex`](https://github.com/remarkjs/remark-math)

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

## Footnotes

> Plugin: [`remark-footnotes-extra`](https://github.com/miaobuao/remark-footnotes-extra)

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

## Abbreviations

> Self-implemented

```
ABBR abbr xABBRx

*[ABBR]: Abbreviation
```

ABBR abbr xABBRx

*[ABBR]: Abbreviation

## GitHub Alerts

> Plugin: [remark-github-blockquote-alert](https://github.com/jaywcjlove/remark-github-blockquote-alert)

```
> [!NOTE]
> General information
```

> [!NOTE]
> General information

```
> [!TIP]
> Optional information
```

> [!TIP]
> Optional information

```
> [!IMPORTANT]
> Important information
```

> [!IMPORTANT]
> Important information

```
> [!WARNING]
> Risk information
```

> [!WARNING]
> Risk information

```
> [!CAUTION]
> Warning information
```

> [!CAUTION]
> Warning information

```
> [!NOTE/(･ρ･)ﾉ]
> Custom title text
```

> [!NOTE/(･ρ･)ﾉ]
> Custom title text

## Extended Tables

> Plugin: [remark-extended-table](https://github.com/wataru-chocola/remark-extended-table)

```
| Left Align  | Center | Right Align |    Center     |
|:----------- |:------:| -----------:| ------------- |
| Normal Cell |     Merged Cell     || Merged Column |
| Normal Cell |      2×2 Cell       ||       ^       |
| Normal Cell |          ^          ||  Normal Cell  |
```

| Left Align | Center | Right Align | Center |
|:- |:-:| -:| - |
| Normal Cell | Merged Cell || Merged Column |
| Normal Cell | 2×2 Cell ||^|
| Normal Cell | ^ || Normal Cell |
