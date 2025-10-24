---
title: 站点配置指南
timestamp: 2025-07-07 00:00:00+00:00
tags: [Guide, Astro]
description: Astro 主题站点的基础配置说明，涵盖站点设置、国际化、Markdown 处理等核心配置项。
---

## `.env`

1. 运行命令创建 `.env` 文件：
    ```sh
    cp .env.example .env
    ```
2. 修改或添加变量：
    | 变量 | 描述 |
    | - | - |
    | `PUBLIC_TIMEZONE`* | 默认显示时区，参考[时区列表](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List) |

    `*` 表示必要选项。

## `astro.config.ts`

- `site` - 站点 URL
- `i18n`
    - `locales` - 支持的语言列表
    - `defaultLocale` - 默认语言
- `markdown`
    - `remarkPlugins` - Markdown 处理插件
    - `rehypePlugins` - HTML 处理插件

## `site.config.json`

- `title` - 站点标题
- `prologue` - 首页标语，支持 `\n` 换行
- `author`
    - **string** - 作者名称
    - **object**
        - `name` - 作者名称
        - `email` - 作者邮箱
        - `link` - 作者个人网站
- `description` - 站点描述
- `copyright` - 版权信息
    - `type` - CC 许可类型
    - `year` - 版权年份或年份范围
- `feed` - 订阅源
    - `section` - 订阅源内容板块
        - **`*`** - 所有板块
        - **array**
            - `note` - 笔记板块
            - `jotting` - 随笔板块
    - `limit` - 返回内容数量限制

## 图标生成

推荐使用 [RealFaviconGenerator](https://realfavicongenerator.net/) 生成图标，并将下载解压后的所有内容覆盖到 `/public` 目录下。

生成的文件列表如下：

- `apple-touch-icon.png`
- `favicon-96x96.png`
- `favicon.ico`
- `favicon.svg`
- `site.webmanifest`
- `web-app-manifest-192x192.png`
- `web-app-manifest-512x512.png`

`<head>` 中的内容已根据 RealFaviconGenerator 的提示完成适配，也可根据需求自行更改。

修改完成并部署后，可使用 [Favicon checker](https://realfavicongenerator.net/favicon-checker) 校验。

### 首页 Logo

引用位置位于 `src/pages/[...locale]/index.astro`，默认使用由 `astro-icon` 库导入 SVG 格式图标。

```astro
<Icon name="site-logo" size={100} is:inline />
```

可通过如下三种方式配置：

1. 使用 SVG 文件替换 `src/icons/site-logo.svg`，将[自动读取](https://www.astroicon.dev/guides/customization/#local-icons)并应用。
    - 建议使用 `stroke="currentColor"` 以适应主题色彩变化。
2. 使用 [Iconify 图标集](https://www.astroicon.dev/guides/customization/#open-source-icon-sets)，以 `<PREFIX>:<ICON>` 形式引用。
3. 直接修改为图片导入或删除该部分内容。

## 国际化（i18n）配置

主题支持多语言切换，默认语言为**英文（`en`）**。

如需变更默认语言请修改 `i18n.defaultLocale`，注意值须在 `i18n.locales` 中选择。

如需添加新语言，请在 `src/i18n` 目录下创建相应的翻译文件，并在 `astro.config.ts` 中的 `i18n.locales` 中添加该语言。

然后修改 `src/i18n/index.ts` 文件：

```ts
// 导入新语言的翻译文件
import zhCN from "./zh-cn.yaml";

// 添加新语言到 locale 映射列表
const translations = { 
  ...,
  "zh-cn": zhCN
};
```
