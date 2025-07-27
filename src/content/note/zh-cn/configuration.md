---
title: 站点配置指南
timestamp: 2025-07-07 00:00:00+00:00
tags: [Guide, Astro]
---

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

## 国际化（i18n）配置

主题支持多语言切换，默认语言为**英文（`en`）**。

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
