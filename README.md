# ThoughtLite

<div align="center">
    <img src=".github/assets/preview-light.webp">
    <img src=".github/assets/preview-dark.webp">
    <p></p>
    <p>A modern <a href="https://astro.build/">Astro</a> theme, focused on content creation 🌟</p>
    <small><ins>English</ins></small> <small><a href="README.zh-cn.md">简体中文</a></small> <small><a href="README.ja.md">日本語</a></small>
</div>

<br />

> - `main` branch✅: Static build, can be deployed on any static hosting platform;
> - `cloudflare` branch: Enables built-in comment system, only deployable on Cloudflare.

🎬 **Live Demo**: [Vercel](https://thought-lite.vercel.app/)

## ✨ Features

📱 **Responsive Design** - Adaptive for mobile, tablet, and desktop.\
🌗 **Light / Dark Mode** - Auto-follows system preference with manual toggle support.\
📃 **CSR Dynamic Content Filtering** - List filtering and pagination via History API.\
🌏 **i18n Support** - Easy to extend and manage multilingual content.\
📰 **Sitemap & Feed Subscription** - Automated generation of Sitemap and Atom Feed.\
🔗 **OpenGraph Support** - Built-in Open Graph meta tags for optimized social media sharing.

## ⚡️ Quick Start

### Using Astro Command

Run the following command:

```sh
npx create-astro@latest --template tuyuritio/astro-theme-thought-lite

# Follow the interactive prompts to create the project

cd <your-project-name>
npm run dev     # Will start the local development server at http://localhost:4321 by default
```

### Using Template

1. [Fork](https://github.com/tuyuritio/astro-theme-thought-lite/fork) this repository or use the template to [create a new repository](https://github.com/new?template_name=astro-theme-thought-lite&template_owner=tuyuritio).
2. Run the following commands:

```sh
git clone <your-repo-url>
cd <your-repo-name>
npm install
npm run dev     # Will start the local development server at http://localhost:4321 by default
```

## 🔧 Configuration

Customize site configuration and internationalization (i18n) by modifying the following files:

- `.env`
- `astro.config.ts`
- `site.config.json`

For details, refer to the [Configuration Guide](src/content/note/en/configuration.md).

## 🚀 Deployment

The current branch can be fully static built and deployed on any static hosting platform.

For deployment methods on various platforms, refer to the [Astro Official Deployment Guide](https://docs.astro.build/en/guides/deploy/).

## 🔄 Updates

Run the following commands to sync upstream updates:

```sh
git remote add theme https://github.com/tuyuritio/astro-theme-thought-lite.git
git fetch theme
git merge theme/main    # Add `--allow-unrelated-histories` flag for first update
npm install
```

## ✍️ Content Creation

Content creation is centralized in the `src/content` directory, mainly including:

- `note` - Notes
- `jotting` - Jottings
- `preface` - Preface
- `information` - Information

All content sections support multiple languages. Create the corresponding language directory to start creating content. For details, refer to the [Content Creation Guide](src/content/note/en/content.md).

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

This project is licensed under [GPLv3](LICENSE), allowing free modification and distribution, but the original copyright notice must be retained.
