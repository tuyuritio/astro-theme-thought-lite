# ThoughtLite

<div align="center">
    <img src=".github/assets/preview.webp">
    <p></p>
    <p>コンテンツ作成に特化し、<a href="https://www.cloudflare.com/">Cloudflare</a> 向けに最適化されたモダンな <a href="https://astro.build/">Astro</a> テーマ 🌟</p>
    <small><a href="README.md">English</a></small> <small><a href="README_zh-cn.md">简体中文</a></small> <small><ins>日本語</ins></small>
</div>

<br />

> - `main` ブランチ：**Node SSR** をサポートするプラットフォーム（Vercel、Netlify、従来の Node サーバーなど）に適用；
> - `cloudflare` ブランチ（**現在**）：テーマ内蔵のコメント機能を有効にし、Cloudflare **のみ**でデプロイ可能。

## ✨ 機能

📱 **レスポンシブデザイン** - モバイル、タブレット、デスクトップに対応。\
🌗 **ライト / ダークモード** - システムに自動追従し、手動切り替えもサポート。\
📃 **SSR 動的コンテンツフィルタリング** - History API によるリストフィルタリングとページネーション。\
🌏 **i18n サポート** - 多言語コンテンツの簡単な拡張と管理。\
📰 **サイトマップ & フィード購読** - サイトマップと Atom フィードの自動生成。\
🔗 **OpenGraph サポート** - 組み込みの Open Graph メタタグでソーシャルメディア共有を最適化。\
📝 **コメントシステム** - Cloudflare D1 ベース、デプロイが簡単でプライバシー制御可能；OAuth 認証とゲストコメントをサポート。\
🔔 **デスクトップ通知** - Web Push API を使用したリアルタイム通知。

## 📋 前提条件

開始前に、以下のアカウントをお持ちであることを確認してください：

- [Cloudflare アカウント](https://dash.cloudflare.com/sign-up) - デプロイとデータベースホスティング用
- [GitHub アカウント](https://github.com/signup) - コードホスティングと自動デプロイ用

## 📦 インストール

```sh
git clone https://github.com/tuyuritio/astro-theme-thought-lite.git
cd astro-theme-thought-lite
git remote rename origin theme
git remote add origin <your-git-repo>
npm install
```

## 🔧 設定

1. Cloudflare D1 を作成、[Cloudflare D1 設定ガイド](src/content/note/ja/cloudflare-d1.md)を参照。
2. Cloudflare Turnstile を設定、[Turnstile 設定ガイド](src/content/note/ja/turnstile.md)を参照。
3. OAuth 認証を設定、[OAuth 設定ガイド](src/content/note/ja/oauth.md)を参照。
4. サイト基本情報設定、[サイト設定ガイド](src/content/note/ja/configuration.md)を参照。
5. `.env` ファイルを作成し、変数を追加：

    ```sh
    cp .env.example .env
    ```

    | 変数 | 説明 |
    | - | - |
    | `PUBLIC_TIMEZONE`* | デフォルト表示タイムゾーン、[タイムゾーンリスト](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List)を参照 |
    | `PASS_KEY`* | トークン生成用、16バイトBase64形式キー、`openssl rand -base64 16` コマンドで生成 |
    | `NOTIFY_PUBLIC_KEY`* | デスクトッププッシュ通知用のVAPID公開鍵、`npx web-push generate-vapid-keys` コマンドで生成 |
    | `NOTIFY_PRIVATE_KEY`* | デスクトッププッシュ通知用のVAPID秘密鍵、公開鍵と同時に生成 |
    | `AUTHOR_ID` | 著者ID、コメント欄でサイト著者を識別するため；[Cloudflare D1 パネル](https://dash.cloudflare.com/?to=/:account/workers/d1)で確認 |

    `*` は必須オプション。

## 💻 開発開始

```sh
# ローカルテストデータベースを生成
npm run db:migrate:local

# 開発サーバーを起動
npm run dev
```

## 🚀 デプロイ

```sh
npm run build
npm run deploy
```

GitHub Actions を使用した**自動デプロイ**の設定については、[GitHub Actions 設定ガイド](src/content/note/ja/github-actions.md)を参照してください。

## 🔄 更新

```sh
git checkout main
git pull origin main
git fetch theme
git merge theme/cloudflare
npm i
npm run db:migrate:local
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
- **データベース** - [Cloudflare D1](https://developers.cloudflare.com/d1/)
- **デプロイ** - [Cloudflare Workers](https://workers.cloudflare.com/)

### インスピレーション

- [Fuwari](https://github.com/saicaca/fuwari)
- [astro-vitesse](https://github.com/adrian-ub/astro-vitesse)
- [Astro Blog](https://github.com/williamcachamwri/astro-blog)
- [Astro Theme Pure](https://github.com/cworld1/astro-theme-pure)
- [AstroPaper with I18n](https://github.com/yousef8/astro-paper-i18n)

## 📜 ライセンス

このプロジェクトは [GPLv3](LICENSE) でライセンスされています。
