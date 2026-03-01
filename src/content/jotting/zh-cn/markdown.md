---
title: Markdown 扩展手册
timestamp: 2025-11-24 00:00:00+00:00
series: Astro
tags: [Markup, Demo]
description: 详细介绍主题中扩展的 Markdown 语法功能。
---

Astro 框架使用 [remark](https://github.com/remarkjs/remark) 作为 Markdown 引擎，在 `astro.config.ts` 中提供了相关插件配置接口。

主题内置以下插件以实现语法扩展：

## 插入

> 插件：[`remark-ins`](https://www.npmjs.com/package/remark-ins)

```
++插入内容++
```

++插入内容++

## 标记

> 插件：[`remark-flexible-markers`](https://www.npmjs.com/package/remark-flexible-markers)

```
==标记内容==
```

==标记内容==

## Ruby

> 插件：[`@tuyuritio/remark-ruby`](https://www.npmjs.com/package/@tuyuritio/remark-ruby)

```
{拼音}(pīn|yīn)
```

{拼音}(pīn|yīn)

```
{振り仮名}(ふ||が|な)
```

{振り仮名}(ふ||が|な)

## 遮罩

> 插件：[`@tuyuritio/remark-spoiler`](https://www.npmjs.com/package/@tuyuritio/remark-spoiler)

```
!!遮罩内容!!
```

!!遮罩内容!!

## Emoji

> 插件：[`remark-gemoji`](https://www.npmjs.com/package/remark-gemoji)

```
:wink: :cry: :laughing: :yum:
```

:wink: :cry: :laughing: :yum:

[Emoji 速查表](https://github.com/ikatyang/emoji-cheat-sheet?tab=readme-ov-file#table-of-contents)

## Katex

> 插件：[`remark-math`](https://www.npmjs.com/package/remark-math) & [`rehype-katex`](https://www.npmjs.com/package/rehype-katex)

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

> 插件：[`remark-footnotes-extra`](https://www.npmjs.com/package/remark-footnotes-extra)

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

> 插件：[`@tuyuritio/remark-abbreviation`](https://www.npmjs.com/package/@tuyuritio/remark-abbreviation)

```
ABBR abbr xABBRx

*[ABBR]: Abbreviation
```

ABBR abbr xABBRx

*[ABBR]: Abbreviation

## GitHub Alerts

> 插件：[`@tuyuritio/remark-github-alert`](https://www.npmjs.com/package/@tuyuritio/remark-github-alert)


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
> [!NOTE] (･ρ･)ﾉ
> 自定义标题文字
```

> [!NOTE] (･ρ･)ﾉ
> 自定义标题文字

## 表格扩展

> 插件：[remark-extended-table](https://www.npmjs.com/package/remark-extended-table)

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

> 插件：[`@tuyuritio/remark-attribute`](https://www.npmjs.com/package/@tuyuritio/remark-attribute)

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
