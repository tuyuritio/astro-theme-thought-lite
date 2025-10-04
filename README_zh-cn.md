# ThoughtLite

<div align="center">
    <img src=".github/assets/preview-light.webp">
    <img src=".github/assets/preview-dark.webp">
    <p></p>
    <p>一款专注内容创作的现代化 <a href="https://astro.build/">Astro</a> 主题 🌟</p>
    <small><a href="README.md">English</a></small> <small><ins>简体中文</ins></small> <small><a href="README_ja.md">日本語</a></small>
</div>

<br />

> - `main` 分支（**当前**）：静态化构建，可部署在任何静态托管平台；
> - `cloudflare` 分支：启用主题内置的评论功能，**仅**可在 Cloudflare 部署。

🎬 **在线演示**：[Vercel](https://thought-lite.vercel.app/zh-cn/)

## ✨ 特性

📱 **响应式设计** - 移动端、平板、桌面自适应。\
🌗 **亮色 / 深色模式** - 自动跟随系统，并支持手动切换。\
📃 **CSR 动态内容筛选** - 通过 History API 实现的列表筛选和分页。\
🌏 **i18n 支持** - 轻松扩展和管理多语言内容。\
📰 **Sitemap 及 Feed 订阅** - 自动化生成 Sitemap 和 Atom Feed。\
🔗 **OpenGraph 支持** - 内置 Open Graph 元标签，优化社交媒体分享效果。

## 📦 安装

```sh
git clone https://github.com/tuyuritio/astro-theme-thought-lite.git
cd astro-theme-thought-lite
git remote rename origin theme
git remote add origin <your-git-repo>
npm install
```

## 🔧 配置

1. 站点基本信息配置，参考[站点配置指南](src/content/note/zh-cn/configuration.md)。
2. 创建 `.env` 文件，并添加变量：

    ```sh
    cp .env.example .env
    ```

    | 变量 | 描述 |
    | - | - |
    | `PUBLIC_TIMEZONE`* | 默认显示时区，参考[时区列表](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List) |

    `*` 表示必要选项。

## 💻 启动开发

```sh
# 启动开发服务器
npm run dev
```

## 🔄 更新

```sh
git checkout main
git pull origin main
git fetch theme
git merge theme/main
npm i
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
- **图片查看器** - [Medium Zoom](https://github.com/francoischalifour/medium-zoom)
- **TypeScript ORM** - [Drizzle ORM](https://orm.drizzle.team/)

### 灵感来源

- [Fuwari](https://github.com/saicaca/fuwari)
- [Astro Sphere](https://github.com/markhorn-dev/astro-sphere)
- [astro-vitesse](https://github.com/adrian-ub/astro-vitesse)
- [Miniblog](https://github.com/nicholasdly/miniblog)
- [AstroPaper with I18n](https://github.com/yousef8/astro-paper-i18n)

## 📜 许可证

本项目采用 [GPLv3](LICENSE) 进行授权。
