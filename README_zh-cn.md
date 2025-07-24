# ThoughtLite

<div align="center">
    <img src=".github/assets/preview-light.webp">
    <img src=".github/assets/preview-dark.webp">
    <p></p>
    <p>一款专注内容创作、针对 <a href="https://www.cloudflare.com/">Cloudflare</a> 优化的现代化 <a href="https://astro.build/">Astro</a> 主题 🌟</p>
    <small><a href="README.md">English</a></small> <small><ins>简体中文</ins></small> <small><a href="README_ja.md">日本語</a></small>
</div>

## ✨ 特性

📱 **响应式设计** - 移动端、平板、桌面自适应。\
🌗 **亮色 / 深色模式** - 自动跟随系统，并支持手动切换。\
📃 **SSR 动态内容筛选** - 通过 History API 实现的列表筛选和分页。\
🌏 **i18n 支持** - 轻松扩展和管理多语言内容。\
📰 **Sitemap 及 Feed 订阅** - 自动化生成 Sitemap 和 RSS、Atom、JSON Feed。\
🔗 **OpenGraph 支持** - 内置 Open Graph 元标签，优化社交媒体分享效果。\
📝 **评论系统** - 基于 Cloudflare D1，部署便捷，隐私可控；OAuth 身份认证。\
🔔 **桌面通知** - 使用 Web Push API 推送实时通知。

## 📋 前期准备

在开始之前，请确保拥有以下账户：

- [Cloudflare 账户](https://dash.cloudflare.com/sign-up) - 用于部署和数据库托管
- [GitHub 账户](https://github.com/signup) - 用于代码托管和自动部署

## 📦 安装

```sh
git clone https://github.com/tuyuritio/astro-theme-thought-lite.git
cd astro-theme-thought-lite
git remote rename origin theme
git remote add origin <your-git-repo>
npm install
```

## 🔧 配置

1. 创建 Cloudflare D1，参考[Cloudflare D1 配置指南](src/content/note/zh-cn/cloudflare-d1.md)。
2. 配置 OAuth 认证，参考[OAuth 配置指南](src/content/note/zh-cn/oauth.md)。
3. 站点基本信息配置，参考[站点配置指南](src/content/note/zh-cn/configuration.md)。
5. 创建 `.env` 文件，并添加变量：

    ```sh
    cp .env.example .env
    ```

    | 变量 | 描述 |
    | - | - |
    | `PUBLIC_TIMEZONE`* | 默认显示时区，参考[时区列表](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List) |
    | `PASS_KEY`* | 用于生成 Token，16 字节 Base64 格式密钥，使用命令 `openssl rand -base64 16` 生成 |
    | `NOTIFY_PUBLIC_KEY`* | 桌面推送通知使用的 VAPID 公钥，使用命令 `npx web-push generate-vapid-keys` 生成 |
    | `NOTIFY_PRIVATE_KEY`* | 桌面推送通知使用的 VAPID 私钥，在生成公钥时同时生成 |
    | `AUTHOR_ID` | 作者 ID，用于在评论区中标识站点作者；需在 [Cloudflare D1 面板](https://dash.cloudflare.com/?to=/:account/workers/d1)中查询 |

    `*` 表示必要选项。

## 💻 启动开发

```sh
# 生成本地测试数据库
npm run db:migrate:local

# 启动开发服务器
npm run dev
```

## 🚀 部署

```sh
npm run build
npm run deploy
```

使用 GitHub Actions **自动部署**的配置请参考[GitHub Actions 配置指南](src/content/note/zh-cn/github-actions.md)。

## 🔄 更新

```sh
git checkout main
git pull origin main
git fetch theme
git merge theme/main
npm i
npm run db:migrate:local
```

## ✍️ 创作

创作内容集中在 `src/content` 目录下，主要包含以下部分：

- `note` - 文记
- `jotting` - 随笔
- `preface` - 前言
- `information` - 信息

各部分均支持多语言，请在对应部分目录下创建语言子目录后开始编写内容，详情请参考[内容创作指南](src/content/note/zh-cn/content.md)。

## 🙏 鸣谢

### 技术栈

- **主框架** - [Astro](https://astro.build/)
- **类型检查** - [TypeScript](https://www.typescriptlang.org/)
- **样式表** - [Less.js](https://lesscss.org/)
- **响应式组件** - [Svelte](https://svelte.dev/)
- **CSS 引擎** - [UnoCSS](https://unocss.dev/)
- **图标** - [Iconify](https://iconify.design/)
- **衬线字体** - [Google Fonts](https://fonts.google.com/)
- **等宽字体** - [ZeoSeven Fonts](https://fonts.zeoseven.com/)
- **目录生成** - [Tocbot](https://tscanlin.github.io/tocbot/)
- **图片查看器** - [Medium Zoom](https://github.com/francoischalifour/medium-zoom)
- **TypeScript ORM** - [Drizzle ORM](https://orm.drizzle.team/)
- **数据库** - [Cloudflare D1](https://developers.cloudflare.com/d1/)
- **部署平台** - [Cloudflare Workers](https://workers.cloudflare.com/)

### 灵感来源

- [Fuwari](https://github.com/saicaca/fuwari)
- [astro-vitesse](https://github.com/adrian-ub/astro-vitesse)
- [Astro Blog](https://github.com/williamcachamwri/astro-blog)
- [Astro Theme Pure](https://github.com/cworld1/astro-theme-pure)
- [AstroPaper with I18n](https://github.com/yousef8/astro-paper-i18n)

## 📜 许可证

本项目采用 [GPLv3](LICENSE) 进行授权。
