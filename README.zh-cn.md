# ThoughtLite

<div align="center">
    <img alt="ThoughtLite Light Mode Preview" src=".github/assets/preview-light.webp">
    <img alt="ThoughtLite Dark Mode Preview" src=".github/assets/preview-dark.webp">
    <p></p>
    <p>一款专注内容创作的现代化 <a href="https://astro.build/">Astro</a> 主题 🌟</p>
    <small><a href="README.md">English</a></small> <small><ins>简体中文</ins></small> <small><a href="README.ja.md">日本語</a></small>
</div>

<br />

<div align="center">
    <a href="https://github.com/tuyuritio/astro-theme-thought-lite/releases/latest"><img alt="GitHub Release" src="https://img.shields.io/github/v/release/tuyuritio/astro-theme-thought-lite"></a>
    <a href="https://raw.githubusercontent.com/tuyuritio/astro-theme-thought-lite/refs/heads/main/LICENSE"><img alt="GitHub License" src="https://img.shields.io/github/license/tuyuritio/astro-theme-thought-lite"></a>
</div>

<br />

> [!NOTE]
> - `main` 分支：静态化构建，可部署在任何静态托管平台。
> - `cloudflare` 分支✅：启用内置评论系统，仅支持在 Cloudflare 部署。

🎬 **在线演示**：[Cloudflare Workers](https://thought-lite.ttio.workers.dev/zh-cn/)

## ✨ 特性

- [x] **响应式设计** - 移动端、平板、桌面自适应。\
- [x] **亮色 / 深色模式** - 自动跟随系统，并支持手动切换。\
- [x] **CSR 动态内容筛选** - 通过 History API 实现的列表筛选和分页。\
- [x] **i18n 支持** - 轻松扩展和管理多语言内容。\
- [x] **Sitemap 及 Feed 订阅** - 自动化生成 Sitemap 和 Atom Feed。\
- [x] **OpenGraph 支持** - 内置 Open Graph 元标签，优化社交媒体分享效果。\
- [x] **评论系统** - 基于 Cloudflare D1，部署便捷，隐私可控；支持 OAuth 身份认证和免登录评论。\
- [x] **桌面通知** - 使用 Web Push API 推送实时通知。

## 📋 前期准备

在开始之前，请确保拥有以下账户：

- [Cloudflare 账户](https://dash.cloudflare.com/sign-up) - 用于部署和数据库托管
- [GitHub 账户](https://github.com/signup) - 用于代码托管和自动部署

## ⚡️ 快速上手

### 使用 Astro 命令

运行如下命令：

```sh
# 末尾的 `cloudflare` 是分支名称，请勿省略！
npx create-astro@latest --template tuyuritio/astro-theme-thought-lite#cloudflare

# 根据交互提示创建项目

cd <your-project-name>
npm run db:migrate:local    # 生成本地测试数据库
npm run dev                 # 默认将启动本地开发服务：http://localhost:4321
```

### 使用模板

1. [使用此模板](https://github.com/new?template_name=astro-theme-thought-lite&template_owner=tuyuritio)创建新的仓库（启用 `Include all branches`）或 [Fork](https://github.com/tuyuritio/astro-theme-thought-lite/fork) 此仓库（取消勾选 `Copy the main branch only`）。
2. 运行如下命令：

```sh
git clone <your-repo-url>
cd <your-repo-name>
npm install
npm run db:migrate:local    # 生成本地测试数据库
npm run dev                 # 默认将启动本地开发服务：http://localhost:4321
```

## 🔧 配置

1. 创建 Cloudflare D1，参阅[Cloudflare D1 配置指南](src/content/note/zh-cn/cloudflare-d1.md)。
2. 配置 Cloudflare Turnstile，参阅[Cloudflare Turnstile 配置指南](src/content/note/zh-cn/cloudflare-turnstile.md)。
    - 如果不启用匿名评论，可跳过这一步。
3. 配置 OAuth 认证，参阅[OAuth 配置指南](src/content/note/zh-cn/oauth.md)。
4. 自定义站点配置及国际化（i18n）配置，请修改以下文件，参阅[站点配置指南](src/content/note/zh-cn/configuration.md)：
    - `.env`
    - `astro.config.ts`
    - `site.config.json`

## 🚀 部署

```sh
npm run build
npm run deploy
```

使用 GitHub Actions **自动部署**的配置请参阅[GitHub Actions 配置指南](src/content/note/zh-cn/github-actions.md)。

## 🔄 更新

运行以下命令以同步上游更新：

```sh
git remote add theme https://github.com/tuyuritio/astro-theme-thought-lite.git
git fetch theme
git merge theme/cloudflare  # 首次更新需添加 `--allow-unrelated-histories` 参数
npm install
npm run db:migrate:local
```

## ✍️ 创作

创作内容集中在 `src/content` 目录下，主要包含以下部分：

- `note` - 文记，专注于精心构思、内容详实的长篇作品
- `jotting` - 随笔，轻量级、即时性的内容记录
- `preface` - 前言，作为第一印象在站点首页展示
- `information` - 信息，包含各类说明性内容

所有内容区块均支持多语言，创建对应语言目录后即可开始创作，详情请参阅[内容创作指南](src/content/note/zh-cn/content.md)。

## 🤝 贡献

欢迎并感谢所有形式的贡献！

- 宣传项目或帮助其他用户
- 提交 [issues](https://github.com/tuyuritio/astro-theme-thought-lite/issues) 或新功能建议
- 改进文档及国际化（i18n）支持
- 贡献代码 - 详情请参阅[代码贡献指南](CONTRIBUTING.md)

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
- **图片查看器** - [Medium Zoom](https://github.com/francoischalifour/medium-zoom)
- **TypeScript ORM** - [Drizzle ORM](https://orm.drizzle.team/)
- **数据库** - [Cloudflare D1](https://developers.cloudflare.com/d1/)
- **部署平台** - [Cloudflare Workers](https://workers.cloudflare.com/)

### 灵感来源

- [Fuwari](https://github.com/saicaca/fuwari)
- [Astro Sphere](https://github.com/markhorn-dev/astro-sphere)
- [astro-vitesse](https://github.com/adrian-ub/astro-vitesse)
- [Miniblog](https://github.com/nicholasdly/miniblog)
- [AstroPaper with I18n](https://github.com/yousef8/astro-paper-i18n)

## 📜 许可证

本项目采用 [GPLv3](LICENSE) 进行授权，可自由修改与分发，但须保留原版权声明。
