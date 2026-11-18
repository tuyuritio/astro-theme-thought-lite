---
title: 站点配置指南
timestamp: 2026-03-21 00:00:00+00:00
series: Guide
tags: [Configuration, Astro]
description: 主题基础配置说明，涵盖站点信息、显示效果、图标生成等核心配置项。
toc: true
---

## 配置参考

主题自定义配置位于根目录下的 `site.config.ts` 文件，以下是各配置项的详细说明：

| 配置项 | 类型 | 描述 |
|:- |:- |:- |
| `title` | `string` | 站点标题。 |
| `prologue` | `string` | 首页标语；支持 `\n` 换行。 |
| `author.name` | `string` | 作者名称。 |
| `author.email` | `string` | 作者邮箱。 |
| `author.link` | `string` | 作者个人主页链接。 |
| `description` | `string` | 站点描述。 |
| `copyright.type` | `CCLicenseType` | [Creative Commons 4.0](https://creativecommons.org/chooser/) 许可类型。 |
| `copyright.year` | `string` | 版权年份或年份范围。 |
| `timezone` | `string` | 站点显示时区，参考[时区列表](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List)。 |
| `i18n` | `object` | 详见[国际化配置指南](internationalization)。 |
| `pagination` | `Record<Section, number>` | 各板块每页显示的条目数。 |
| `heatmap` | `Heatmap` | 热力图显示配置。 |
| `feed.section` | `"*" \| Section[]` | 订阅源包含的内容板块；`*` 表示全部。 |
| `feed.limit` | `number` | 订阅源中显示的最大条目数。 |
| `latest` | `"*" \| Section[]` | 首页「最新内容」展示的板块；`*` 表示全部。 |

### 类型说明

#### `CCLicenseType`

- `"CC0 1.0"`
- `"CC BY 4.0"`
- `"CC BY-SA 4.0"`
- `"CC BY-NC 4.0"`
- `"CC BY-NC-SA 4.0"`
- `"CC BY-ND 4.0"`
- `"CC BY-NC-ND 4.0"`

#### `Section`

- `"note"`
- `"jotting"`

#### `Heatmap`

| `unit` | `weeks` | `years` |
|:- | - | - |
| `day` | 显示的总周数 | × |
| `week` | *固定显示 51 周* | × |
| `month` | × | 显示的总年数 |

## 外观主题

外观由 `site.config.ts` 的 `theme` 配置控制。省略此项时保留 ThoughtLite 原版外观，明暗模式跟随系统。

```ts
theme: {
  preset: "catppuccin", // "thought-lite" | "catppuccin" | 自定义主题对象
  mode: "system",      // "system" | "light" | "dark"
  showToggle: true,
  colors: {
    light: { accent: "#40a02b", link: "#209fb5" },
    dark: { accent: "#a6e3a1", link: "#74c7ec" }
  },
  fonts: { body: "system-ui, sans-serif" },
  layout: { contentWidth: "1100px", lineHeight: 1.8 }
}
```

`thought-lite` 保留原版黑白配色；`catppuccin` 使用 Latte / Mocha，包含页面配色、绿色热力图、Markdown 链接和提示框，以及对应的代码高亮。只覆盖需要修改的字段，其余继承预设，浅色与深色配置分别合并。

四个 [Catppuccin 官方变体](https://github.com/catppuccin/palette) 分别提供，色值保持官方标准：

| 预设名称 | 变体 | 用途 |
| --- | --- | --- |
| `catppuccin-latte` | Latte | 浅色 |
| `catppuccin-frappe` | Frappé | 深色 |
| `catppuccin-macchiato` | Macchiato | 深色 |
| `catppuccin-mocha` | Mocha | 深色 |

通过明暗预设对选择变体，页面和代码高亮会同步使用对应色板：

```ts
theme: {
  preset: {
    light: "catppuccin-latte",
    dark: "catppuccin-frappe" // 或 catppuccin-macchiato / catppuccin-mocha
  },
  mode: "system"
}
```

`preset: "catppuccin"` 是 Latte / Mocha 组合的简写。预设对也可以传给 `defineTheme()` 的 `extends`。`mode` 仍控制初始明暗偏好，访客按钮在选定的浅色、深色变体之间切换。

| 配置 | 作用 |
| --- | --- |
| `colors.light` / `colors.dark` | `primary` 正文、`secondary` 次要文字、`weak` 弱化文字、`background` 页面背景、`block` 内容块、`shadow` 边框与轮廓、`selection` 选区。 |
| 同上 | `accent` 首页最新内容标题、`link` Markdown 链接、`heatmap` 热力图、`success` / `info` / `warning` / `danger` 提示框、`codeBackground` 代码块背景。 |
| `fonts` | `body` 正文字体栈、`mono` 等宽字体栈、`display` 首页标语字体栈。不会下载新字体；默认保留多语言 Noto Serif。自定义网络字体仍需在 `astro.config.ts` 注册。 |
| `layout` | `contentWidth` 页面最大宽度、`fontSize` 桌面字号、`mobileFontSize` 移动端字号，均为 CSS 长度；`lineHeight` 为 Markdown 行高数字。 |
| `code` | `light` / `dark` 使用 Astro 支持的 Shiki 主题名或主题对象，需要重新构建。代码块背景由 `codeBackground` 控制。 |
| `mode` | 无访客偏好时使用的明暗模式，默认 `system`。 |
| `showToggle` | 是否显示明暗切换按钮，默认 `true`；隐藏按钮不会清除访客之前保存的偏好。 |

访客已有的 `localStorage.theme`（`light` 或 `dark`）优先于站点默认设置。没有手动选择时才跟随系统变化；浏览器禁用存储时仍可以在当前页面切换。禁用 JavaScript 时使用站点配置及系统配色。

修改主题预设或代码高亮配置后，请重启开发服务器，并重新构建部署。

### 创建和分享主题

新增 `src/themes/my-theme.ts`，不需要修改核心组件或内置主题注册表：

```ts
import { defineTheme } from "../lib/theme";

export default defineTheme({
  name: "my-theme",
  extends: "catppuccin",
  colors: {
    light: { background: "#fffaf0", accent: "#8839ef" },
    dark: { background: "#181825", accent: "#cba6f7" }
  },
  layout: { contentWidth: "960px" }
});
```

在 `site.config.ts` 导入该文件，设置 `theme: { preset: myTheme }` 即可。分享这个主题文件即可复用，也可以用 `extends: anotherTheme` 继承另一个主题对象。主题是构建时配置，访客按钮只切换浅色与深色。

这套配置覆盖共享页面样式，不替换页面结构、作者卡片或内容；站点 Logo、favicon 和 OpenGraph 图片模板仍独立维护。需要新增结构时，应作为可选组件功能扩展，而不是复制一套主题页面。

## 图标生成

推荐使用 [RealFaviconGenerator](https://realfavicongenerator.net/) 生成图标，下载解压提取以下文件，覆盖到 `/public` 目录下：

- `favicon-96x96.png`
- `favicon.ico`
- `favicon.svg`

### 首页 Logo

引用位置位于 `src/pages/[...locale]/index.astro`，使用 `import Logo from "$icons/site-logo.svg"` 语句导入。

```astro
<Logo width={100} />
```

可通过如下方式配置：

1. 使用 SVG 文件替换 `src/icons/site-logo.svg`。
    - 建议使用 `stroke="currentColor"` 以适应亮色/深色主题变化。
2. 修改为图片导入。
3. 直接替换或删除该部分内容。
