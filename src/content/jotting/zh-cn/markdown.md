---
title: Markdown 扩展手册
timestamp: 2025-11-24 00:00:00+00:00
series: Astro
tags: [Markup, Demo]
description: 详细介绍主题中扩展的 Markdown 语法功能，包括 Ruby 注音、缩写、剧透文本等特殊标记语法。
---

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
> 普通信息
```

> [!NOTE]
> 普通信息

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

## 内联元素属性扩展 {#custom-id}

> 自行实现

```
## 内联元素属性扩展 {#custom-id}
```

```
![](https://picsum.photos/1600/900?random=1){width=300}
```

![](https://picsum.photos/1600/900?random=1){width=300}

```
**重要**{.colorful}内容
```

**重要**{.colorful}内容

```
*多个*{.red .big}类名
```

*多个*{.red .big}类名

```
**自定义属性**{key="This is a value"}
```

**自定义属性**{key="This is a value"}
