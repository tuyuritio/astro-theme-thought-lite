---
title: 国际化配置指南
timestamp: 2025-11-07 00:00:00+00:00
tags: [Guide, Astro]
description: 详细介绍如何配置主题的多语言支持，包括修改默认语言、添加新语言、管理翻译文件以及配置内容目录结构。
---

主题内置多语言支持，默认语言为**英文（`en`）**。

## 修改默认语言

在 `site.config.ts` 中修改 `i18n.defaultLocale`：

```ts
export default siteConfig({
    i18n: {
        locales: ["en", "zh-cn", "ja"],
        // 将默认语言改为简体中文
        defaultLocale: "zh-cn"
    },
});
```

## 添加新语言

在 `src/i18n/` 目录下创建新的 **YAML** 翻译文件，如 `tlh/index.yaml`（克林贡语）。

参考 `i18n` 目录下已有的翻译文件格式添加翻译内容：

```yaml
# src/i18n/tlh/index.yaml

# 注意添加 `language` 字段作为当前语言的显示名称
language: tlhIngan Hol
...
```

修改 `src/i18n/index.ts`，导入并注册新语言：

```ts
import tlh from "./tlh/index.yaml";
import tlhScript from "./tlh/script.yaml";

const translations = {
  en: {
    ...en,
    script: enScript
  },
  "zh-cn": {
    ...zhCN,
    script: zhCNScript
  },
  ja: {
    ...ja,
    script: jaScript
  },
  tlh: {
    ...tlh,
    script: tlhScript
  }
};
```

如果新语言需要使用特定字体，可在 `src/layouts/App.astro` 中的 `notoFonts` 对象中添加字体映射：

```ts
const notoFonts: Record<string, string> = {
    "zh-cn": "Noto+Serif+SC",
    ja: "Noto+Serif+JP",
    tlh: "Noto+Serif+..."
};
```

在 `site.config.ts` 中将新语言添加到 `i18n.locales` 数组：

```ts
export default siteConfig({
    i18n: {
        locales: ["en", "zh-cn", "ja", "tlh"],
        defaultLocale: "en"
    },
});
```

在各个内容板块下创建对应的语言目录：

```
content/
├── note/tlh/
├── jotting/tlh/
├── information/tlh/
└── preface/tlh/
```

## 单语言模式

> [!Warning]
> 请勿直接删除 `i18n` 配置字段，这会导致主题无法正常工作！

在 `site.config.ts` 的 `i18n.locales` 中保留所需语言，移除其他项：

```ts
export default siteConfig({
    i18n: {
        locales: ["zh-cn"],
        defaultLocale: "zh-cn"
    },
});
```

移除语言子目录，直接在板块目录下创建内容文件。

**多语言目录结构：**

```
content/
├── note/
│   ├── en/
│   │   ├── common.md
│   │   └── image-preview/
│   │      ├── index.md
│   │      └── photo.png
│   ├── ja/
│   │   ├── common.md
│   │   └── image-preview/
│   │       ├── index.md
│   │       └── photo.png
│   └── zh-cn/
│       ├── common.md
│       ├── image-preview/
│       │   ├── index.md
│       │   └── photo.png
│       └── special.md
├── jotting/
│     ├── en/
│     ├── ja/
│     └── zh-cn/
│         ├── normal.md
│         └── ...
└── ...
```

**单语言目录结构：**

```
content/
├── note/
│   ├── common.md
│   ├── image-preview/
│   │   ├── index.md
│   │   └── photo.png
│   └── special.md
├── jotting/
│   ├── normal.md
│   └── ...
└── ...
```

> [!Tip]
> - 单语言模式下，语言切换功能将自动隐藏
> - 已创建的其他语言翻译文件可以保留，不会影响运行
