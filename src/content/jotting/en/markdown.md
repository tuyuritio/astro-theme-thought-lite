---
title: Markdown Extension Manual
timestamp: 2025-11-24 00:00:00+00:00
series: Astro
tags: [Markup, Demo]
description: Detailed guide to extended Markdown syntax features in the theme.
---

Astro uses [remark](https://github.com/remarkjs/remark) as its Markdown engine, providing a plugin configuration interface in `astro.config.ts`.

The theme includes the following plugins for syntax extensions:

## Insertion

> Plugin: [`remark-ins`](https://www.npmjs.com/package/remark-ins)

```
++Inserted content++
```

++Inserted content++

## Marking

> Plugin: [`remark-flexible-markers`](https://www.npmjs.com/package/remark-flexible-markers)

```
==Marked content==
```

==Marked content==

## Ruby

> Plugin: [`@tuyuritio/remark-ruby`](https://www.npmjs.com/package/@tuyuritio/remark-ruby)

```
{拼音}(pīn|yīn)
```

{拼音}(pīn|yīn)

```
{振り仮名}(ふ||が|な)
```

{振り仮名}(ふ||が|な)

## Spoiler

> Plugin: [`@tuyuritio/remark-spoiler`](https://www.npmjs.com/package/@tuyuritio/remark-spoiler)

```
!!Spoiler content!!
```

!!Spoiler content!!

## Emoji

> Plugin: [`remark-gemoji`](https://www.npmjs.com/package/remark-gemoji)

```
:wink: :cry: :laughing: :yum:
```

:wink: :cry: :laughing: :yum:

[Emoji Cheat Sheet](https://github.com/ikatyang/emoji-cheat-sheet?tab=readme-ov-file#table-of-contents)

## Katex

> Plugin: [`remark-math`](https://www.npmjs.com/package/remark-math) & [`rehype-katex`](https://www.npmjs.com/package/rehype-katex)

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

> Plugin: [`remark-footnotes-extra`](https://www.npmjs.com/package/remark-footnotes-extra)

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

> Plugin: [`@tuyuritio/remark-abbreviation`](https://www.npmjs.com/package/@tuyuritio/remark-abbreviation)

```
ABBR abbr xABBRx

*[ABBR]: Abbreviation
```

ABBR abbr xABBRx

*[ABBR]: Abbreviation

## GitHub Alerts

> Plugin: [`@tuyuritio/remark-github-alert`](https://www.npmjs.com/package/@tuyuritio/remark-github-alert)


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
> [!NOTE] (･ρ･)ﾉ
> Custom title text
```

> [!NOTE] (･ρ･)ﾉ
> Custom title text

## Extended Tables

> Plugin: [remark-extended-table](https://www.npmjs.com/package/remark-extended-table)

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

## Inline Element Attributes Extension {#custom-id}

<style>
.red {
  color: #ef4444;
  font-weight: 600;
}

.big {
  font-size: 1.25em;
  font-weight: bold;
}

.colorful {
  font-weight: bold;
  background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: rainbow 3s linear infinite;
}

@keyframes rainbow {
  0% {
    background-position: 0% center;
  }
  100% {
    background-position: 200% center;
  }
}
</style>

> Plugin: [`@tuyuritio/remark-attribute`](https://www.npmjs.com/package/@tuyuritio/remark-attribute)

```
## Inline Element Attributes Extension {#custom-id}
```

```
![](https://picsum.photos/1600/900?random=1){width=300}
```

![](https://picsum.photos/1600/900?random=1){width=300}

```
**Important**{.colorful} content
```

**Important**{.colorful} content

```
*Multiple*{.red .big} classes
```

*Multiple*{.red .big} classes

```
**Custom attributes**{key="This is a value"}
```

**Custom attributes**{key="This is a value"}
