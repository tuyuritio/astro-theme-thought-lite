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
