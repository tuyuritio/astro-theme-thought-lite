# ThoughtLite

<div align="center">
    <img src=".github/assets/preview-light.webp">
    <img src=".github/assets/preview-dark.webp">
    <p></p>
    <p>一款专注内容创作的现代化 <a href="https://astro.build/">Astro</a> 主题 🌟</p>
    <small><a href="README.md">English</a></small> <small><ins>简体中文</ins></small> <small><a href="README.ja.md">日本語</a></small>
</div>

<br />

> - `main` 分支✅：静态化构建，可部署在任何静态托管平台；
> - `cloudflare` 分支：启用内置评论系统，仅支持在 Cloudflare 部署。

🎬 **在线演示**：[Vercel](https://thought-lite.vercel.app/zh-cn/)

## ✨ 特性

📱 **响应式设计** - 移动端、平板、桌面自适应。\
🌗 **亮色 / 深色模式** - 自动跟随系统，并支持手动切换。\
📃 **CSR 动态内容筛选** - 通过 History API 实现的列表筛选和分页。\
🌏 **i18n 支持** - 轻松扩展和管理多语言内容。\
📰 **Sitemap 及 Feed 订阅** - 自动化生成 Sitemap 和 Atom Feed。\
🔗 **OpenGraph 支持** - 内置 Open Graph 元标签，优化社交媒体分享效果。

## ⚡️ 快速上手

### 使用 Astro 命令

运行如下命令：

```sh
npx create-astro@latest --template tuyuritio/astro-theme-thought-lite

# 根据交互提示创建项目

cd <your-project-name>
npm run dev     # 默认将启动本地开发服务：http://localhost:4321
```

### 使用模板

1. [Fork](https://github.com/tuyuritio/astro-theme-thought-lite/fork) 此仓库或使用模板[创建新的仓库](https://github.com/new?template_name=astro-theme-thought-lite&template_owner=tuyuritio)。
2. 运行如下命令：

```sh
git clone <your-repo-url>
cd <your-repo-name>
npm install
npm run dev     # 默认将启动本地开发服务：http://localhost:4321
```

## 🔧 配置

自定义站点配置及国际化（i18n）配置，请修改以下文件：

- `.env`
- `astro.config.ts`
- `site.config.json`

详情请参考[配置指南](src/content/note/zh-cn/configuration.md)。

## 🚀 部署

当前分支可完全静态化构建，部署在任何静态托管平台。

各平台部署方法请参考 [Astro 官方部署指南](https://docs.astro.build/zh-cn/guides/deploy/)。

## 🔄 更新

运行以下命令以同步上游更新：

```sh
git remote add theme https://github.com/tuyuritio/astro-theme-thought-lite.git
git fetch theme
git merge theme/main    # 首次更新需添加 `--allow-unrelated-histories` 参数
npm install
```

## ✍️ 创作

创作内容集中在 `src/content` 目录下，主要包含以下部分：

- `note` - 文记
- `jotting` - 随笔
- `preface` - 前言
- `information` - 信息

所有内容区块均支持多语言，创建对应语言目录后即可开始创作，详情请参考[内容创作指南](src/content/note/zh-cn/content.md)。

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

### 灵感来源

- [Fuwari](https://github.com/saicaca/fuwari)
- [Astro Sphere](https://github.com/markhorn-dev/astro-sphere)
- [astro-vitesse](https://github.com/adrian-ub/astro-vitesse)
- [Miniblog](https://github.com/nicholasdly/miniblog)
- [AstroPaper with I18n](https://github.com/yousef8/astro-paper-i18n)

## 📜 许可证

本项目采用 [GPLv3](LICENSE) 进行授权，可自由修改与分发，但须保留原版权声明。
