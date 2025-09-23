# ThoughtLite

<div align="center">
    <img src=".github/assets/preview-light.webp">
    <img src=".github/assets/preview-dark.webp">
    <p></p>
    <p>コンテンツ作成に特化し、モダンな <a href="https://astro.build/">Astro</a> テーマ 🌟</p>
    <small><a href="README.md">English</a></small> <small><a href="README_zh-cn.md">简体中文</a></small> <small><ins>日本語</ins></small>
</div>

<br />

> - `main` ブランチ（**現在**）：**Node SSR** をサポートするプラットフォーム（Vercel、Render、従来の Node サーバーなど）に適用；
> - `cloudflare` ブランチ：テーマ内蔵のコメント機能を有効にし、Cloudflare **のみ**でデプロイ可能。

🎬 **ライブデモ**：[Vercel](https://thought-lite.vercel.app/ja/)

## ✨ 機能

📱 **レスポンシブデザイン** - モバイル、タブレット、デスクトップに対応。\
🌗 **ライト / ダークモード** - システムに自動追従し、手動切り替えもサポート。\
📃 **SSR 動的コンテンツフィルタリング** - History API によるリストフィルタリングとページネーション。\
🌏 **i18n サポート** - 多言語コンテンツの簡単な拡張と管理。\
📰 **サイトマップ & フィード購読** - サイトマップと Atom フィードの自動生成。\
🔗 **OpenGraph サポート** - 組み込みの Open Graph メタタグでソーシャルメディア共有を最適化。

## 📦 インストール

```sh
git clone https://github.com/tuyuritio/astro-theme-thought-lite.git
cd astro-theme-thought-lite
git remote rename origin theme
git remote add origin <your-git-repo>
npm install
```

## 🔧 設定

1. サイト基本情報設定、[サイト設定ガイド](src/content/note/ja/configuration.md)を参照。
2. `.env` ファイルを作成し、変数を追加：

    ```sh
    cp .env.example .env
    ```

    | 変数 | 説明 |
    | - | - |
    | `PUBLIC_TIMEZONE`* | デフォルト表示タイムゾーン、[タイムゾーンリスト](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List)を参照 |

    `*` は必須オプション。

## 💻 開発開始

```sh
# 開発サーバーを起動
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

## ✍️ コンテンツ作成

コンテンツ作成は `src/content` ディレクトリに集中しており、主に以下の部分を含みます：

- `note` - 文記
- `jotting` - 随筆
- `preface` - 序文
- `information` - 情報

すべての部分で多言語対応しています。対応する部分ディレクトリ下に言語サブディレクトリを作成してからコンテンツを書き始めてください。詳細は[コンテンツ作成ガイド](src/content/note/ja/content.md)を参照してください。

## 🙏 謝辞

### 技術スタック

- **メインフレームワーク** - [Astro](https://astro.build/)
- **型チェック** - [TypeScript](https://www.typescriptlang.org/)
- **スタイルシート** - [Less.js](https://lesscss.org/)
- **リアクティブコンポーネント** - [Svelte](https://svelte.dev/)
- **CSSエンジン** - [UnoCSS](https://unocss.dev/)
- **アイコン** - [Iconify](https://iconify.design/)
- **セリフフォント** - [Google Fonts](https://fonts.google.com/)
- **等幅フォント** - [ZeoSeven Fonts](https://fonts.zeoseven.com/)
- **画像ビューア** - [Medium Zoom](https://github.com/francoischalifour/medium-zoom)
- **TypeScript ORM** - [Drizzle ORM](https://orm.drizzle.team/)

### インスピレーション

- [Fuwari](https://github.com/saicaca/fuwari)
- [astro-vitesse](https://github.com/adrian-ub/astro-vitesse)
- [Astro Blog](https://github.com/williamcachamwri/astro-blog)
- [Astro Theme Pure](https://github.com/cworld1/astro-theme-pure)
- [AstroPaper with I18n](https://github.com/yousef8/astro-paper-i18n)

## 📜 ライセンス

このプロジェクトは [GPLv3](LICENSE) でライセンスされています。
