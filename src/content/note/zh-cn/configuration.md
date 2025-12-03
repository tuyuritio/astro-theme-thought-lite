---
title: 站点配置指南
timestamp: 2025-11-04 00:00:00+00:00
tags: [Guide, Astro]
description: Astro 主题站点的基础配置说明，涵盖环境变量、站点信息、Markdown 处理、图标生成等核心配置项。
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
    | `PASS_KEY`* | 用于生成 Token，16 字节 Base64 格式密钥，使用命令 `openssl rand -base64 16` 生成<br>或 `node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"` |
    | `NOTIFY_PUBLIC_KEY`* | 桌面推送通知使用的 VAPID 公钥，使用命令 `npx web-push generate-vapid-keys` 生成 |
    | `NOTIFY_PRIVATE_KEY`* | 桌面推送通知使用的 VAPID 私钥，在生成公钥时同时生成 |
    | `AUTHOR_ID` | 作者 ID，用于在评论区中标识站点作者；需在 [Cloudflare D1 面板](https://dash.cloudflare.com/?to=/:account/workers/d1)中查询 |

    `*` 表示必要选项。

## `astro.config.ts`

- `site` - 站点 URL
- `i18n`
    - `locales` - 支持的语言列表
    - `defaultLocale` - 默认语言
- `markdown`
    - `remarkPlugins` - Markdown 处理插件
    - `rehypePlugins` - HTML 处理插件

## `site.config.ts`

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
            - `note` - 文记板块
            - `jotting` - 随笔板块
    - `limit` - 内容数量限制
- `comment`
    - `max-length` - 评论最大字数
- `latest` - 最新内容显示
    - `note` - 是否显示最新文记
    - `jotting` - 是否显示最新随笔

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
