# ThoughtLite

<div align="center">
    <img src=".github/assets/preview-light.webp">
    <img src=".github/assets/preview-dark.webp">
    <p></p>
    <p>A modern <a href="https://astro.build/">Astro</a> theme, focused on content creation 🌟</p>
    <small><ins>English</ins></small> <small><a href="README_zh-cn.md">简体中文</a></small> <small><a href="README_ja.md">日本語</a></small>
</div>

<br />

> - `main` branch (**current**): Static build, can be deployed on any static hosting platform;
> - `cloudflare` branch: Enables built-in comment functionality, **only** deployable on Cloudflare.

🎬 **Live Demo**: [Vercel](https://thought-lite.vercel.app/)

## ✨ Features

📱 **Responsive Design** - Adaptive for mobile, tablet, and desktop.\
🌗 **Light / Dark Mode** - Auto-follows system preference with manual toggle support.\
📃 **CSR Dynamic Content Filtering** - List filtering and pagination via History API.\
🌏 **i18n Support** - Easy to extend and manage multilingual content.\
📰 **Sitemap & Feed Subscription** - Automated generation of Sitemap and Atom Feed.\
🔗 **OpenGraph Support** - Built-in Open Graph meta tags for optimized social media sharing.

## 📦 Installation

```sh
git clone https://github.com/tuyuritio/astro-theme-thought-lite.git
cd astro-theme-thought-lite
git remote rename origin theme
git remote add origin <your-git-repo>
npm install
```

## 🔧 Configuration

1. Basic site information configuration, refer to [Site Configuration Guide](src/content/note/en/configuration.md).
2. Create `.env` file and add variables:

    ```sh
    cp .env.example .env
    ```

    | Variable | Description |
    | - | - |
    | `PUBLIC_TIMEZONE`* | Default display timezone, refer to [Timezone List](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List) |

    `*` indicates required options.

## 💻 Start Development

```sh
# Start development server
npm run dev
```

## 🔄 Updates

```sh
git checkout main
git pull origin main
git fetch theme
git merge theme/main
npm i
```

## ✍️ Content Creation

Content creation is centralized in the `src/content` directory, mainly including:

- `note` - Notes
- `jotting` - Jottings
- `preface` - Preface
- `information` - Information

All sections support multiple languages. Please create language subdirectories under the corresponding section directory before writing content. For details, refer to [Content Creation Guide](src/content/note/en/content.md).

## 🙏 Acknowledgments

### Tech Stack

- **Main Framework** - [Astro](https://astro.build/)
- **Type Checking** - [TypeScript](https://www.typescriptlang.org/)
- **Style Sheets** - [Less.js](https://lesscss.org/)
- **Reactive Components** - [Svelte](https://svelte.dev/)
- **CSS Engine** - [UnoCSS](https://unocss.dev/)
- **Icons** - [Iconify](https://iconify.design/)
- **Serif Fonts** - [Google Fonts](https://fonts.google.com/)
- **Monospace Fonts** - [ZeoSeven Fonts](https://fonts.zeoseven.com/)
- **Image Viewer** - [Medium Zoom](https://github.com/francoischalifour/medium-zoom)

### Inspiration

- [Fuwari](https://github.com/saicaca/fuwari)
- [Astro Sphere](https://github.com/markhorn-dev/astro-sphere)
- [astro-vitesse](https://github.com/adrian-ub/astro-vitesse)
- [Miniblog](https://github.com/nicholasdly/miniblog)
- [AstroPaper with I18n](https://github.com/yousef8/astro-paper-i18n)

## 📜 License

This project is licensed under [GPLv3](LICENSE).
