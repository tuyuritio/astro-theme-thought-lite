---
title: 国际化配置指南
timestamp: 2026-03-21 00:00:00+00:00
series: Guide
tags: [Configuration, Astro]
description: 详细介绍如何配置主题的多语言支持，包括修改默认语言、添加新语言、管理翻译文件以及配置内容目录结构。
toc: true
---

主题内置多语言支持，默认语言为**英文（`en`）**。

国际化核心配置位于 `site.config.ts` 的 `i18n` 字段，在此处指定启用的语言列表以及默认语言：

```ts
export default siteConfig({
  i18n: {
    // 数组顺序决定其在语言选择器中的展示顺序
    locales: ["en", "zh-cn", "ja"],
    // 默认语言必须为 `locales` 中的值
    defaultLocale: "zh-cn"
  },
});
```

## 单语言模式

如只需使用单一语言建站，可通过以下步骤精简文件结构以优化创作流程。

> [!Warning]
> 请勿直接删除 `i18n` 配置字段，这将导致主题无法正常工作！

在 `site.config.ts` 的 `i18n.locales` 中保留所需语言，移除其他项：

```ts
export default siteConfig({
  i18n: {
    locales: ["zh-cn"],
    defaultLocale: "zh-cn"
  },
});
```

### 调整内容目录

单语言模式下，不再需要语言子文件夹，直接将内容文件放在对应的板块目录下即可。

以下是「文记」板块的目录结构对比示例：

**多语言模式，需在板块下先区分语言目录：**

```
content/
└── note/
    ├── en/
    │   └── post.md
    ├── ja/
    │   └── post.md
    └── zh-cn/
        └── post.md
```

**单语言目录结构，省去语言层级直接存放文件：**

```
content/
└── note/
    └── post.md
```

> [!Tip]
> - 单语言模式下，语言切换功能将自动隐藏
> - 已创建的其他语言翻译文件可以保留，不会影响运行

## 添加新语言

在站点中添加未预设的语言，请根据以下步骤配置（以克林贡语 `tlh` 为例）：

### 一、注册新语言

在 `site.config.ts` 中将新语言添加到 `i18n.locales` 数组：

```ts
export default siteConfig({
  i18n: {
    locales: ["en", "zh-cn", "ja", "tlh"],
    defaultLocale: "en"
  },
});
```

### 二、创建翻译文件

在 `src/i18n/` 目录下创建对应 **YAML** 翻译文件，参考 `i18n` 目录下已有的翻译文件格式添加翻译内容：

```yaml
# src/i18n/tlh/index.yaml

# 注意添加 `language` 字段作为当前语言的显示名称
language: tlhIngan Hol
...
```

在 `src/i18n/index.ts` 中导入新语言翻译文件：

```ts
import tlh from "./tlh/index.yaml";
import tlhScript from "./tlh/script.yaml";

const translations = {
  ...,
  tlh: {
    ...tlh,
    script: tlhScript
  }
};
```

### 三、创建内容子语言目录

在各个内容板块下创建对应的语言目录：

```
content/
├── note/tlh/
├── jotting/tlh/
├── information/tlh/
└── preface/tlh/
```

### 四、添加字体

如果新语言需要使用特定字体，请在 `astro.config.ts` 的 `experimental.fonts` 中注册新字体：

```ts
{
  name: "Noto Serif TLH",
  provider: SpecificFontProvider(),
  weights: [400, 700],
  fallbacks: ["serif"],
  cssVariable: "--font-noto-serif-tlh"
}
```

并在 `src/layouts/App.astro` 中添加字体映射：

```ts
// src/layouts/App.astro
const mainFonts: Record<string, CssVariable> = {
  ...,
  tlh: "--font-noto-serif-tlh"
};
```

若需支持生成该语言的 Open Graph 图片，需在 `src/graph/index.ts` 中添加字体文件的链接：

```ts
// Locale-specific font URLs
const fonts: Record<string, string> = {
  ...,
  tlh: "https://....otf"
};
```
