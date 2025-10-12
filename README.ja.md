# ThoughtLite

<div align="center">
    <img alt="ThoughtLite Light Mode Preview" src=".github/assets/preview-light.webp">
    <img alt="ThoughtLite Dark Mode Preview" src=".github/assets/preview-dark.webp">
    <p></p>
    <p>コンテンツ作成に特化し、モダンな <a href="https://astro.build/">Astro</a> テーマ 🌟</p>
    <small><a href="README.md">English</a></small> <small><a href="README.zh-cn.md">简体中文</a></small> <small><ins>日本語</ins></small>
</div>

<br />

<div align="center">
    <a href="https://github.com/tuyuritio/astro-theme-thought-lite/releases/latest"><img alt="GitHub Release" src="https://img.shields.io/github/v/release/tuyuritio/astro-theme-thought-lite"></a>
    <a href="https://raw.githubusercontent.com/tuyuritio/astro-theme-thought-lite/refs/heads/main/LICENSE"><img alt="GitHub License" src="https://img.shields.io/github/license/tuyuritio/astro-theme-thought-lite"></a>
</div>

<br />

> [!NOTE]
> - `main` ブランチ：静的ビルド、任意の静的ホスティングプラットフォームにデプロイ可能。
> - `cloudflare` ブランチ✅：内蔵コメントシステムを有効にし、Cloudflare のみでデプロイ可能。

🎬 **ライブデモ**：[Cloudflare Workers](https://thought-lite.ttio.workers.dev/ja/)

## ✨ 機能

- [x] **レスポンシブデザイン** - モバイル、タブレット、デスクトップに対応。\
- [x] **ライト / ダークモード** - システムに自動追従し、手動切り替えもサポート。\
- [x] **CSR 動的コンテンツフィルタリング** - History API によるリストフィルタリングとページネーション。\
- [x] **i18n サポート** - 多言語コンテンツの簡単な拡張と管理。\
- [x] **サイトマップ & フィード購読** - サイトマップと Atom フィードの自動生成。\
- [x] **OpenGraph サポート** - 組み込みの Open Graph メタタグでソーシャルメディア共有を最適化。\
- [x] **コメントシステム** - Cloudflare D1 ベース、デプロイが簡単でプライバシー制御可能；OAuth 認証とゲストコメントをサポート。\
- [x] **デスクトップ通知** - Web Push API を使用したリアルタイム通知。

## 📋 前提条件

開始前に、以下のアカウントをお持ちであることを確認してください：

- [Cloudflare アカウント](https://dash.cloudflare.com/sign-up) - デプロイとデータベースホスティング用
- [GitHub アカウント](https://github.com/signup) - コードホスティングと自動デプロイ用

## ⚡️ クイックスタート

### Astro コマンドを使用

以下のコマンドを実行します：

```sh
# 末尾の `cloudflare` はブランチ名です。省略しないでください！
npx create-astro@latest --template tuyuritio/astro-theme-thought-lite#cloudflare

# 対話型プロンプトに従ってプロジェクトを作成

cd <your-project-name>
npm run db:migrate:local    # ローカルテストデータベースを生成
npm run dev                 # デフォルトで http://localhost:4321 でローカル開発サーバーを起動
```

### テンプレートを使用

1. [このテンプレートを使用して](https://github.com/new?template_name=astro-theme-thought-lite&template_owner=tuyuritio)新しいリポジトリを作成する（`Include all branches` を有効にする）か、このリポジトリを [Fork](https://github.com/tuyuritio/astro-theme-thought-lite/fork) します（`Copy the main branch only` のチェックを外す）。
2. 以下のコマンドを実行します：

```sh
git clone <your-repo-url>
cd <your-repo-name>
npm install
npm run db:migrate:local    # ローカルテストデータベースを生成
npm run dev                 # デフォルトで http://localhost:4321 でローカル開発サーバーを起動
```

## 🔧 設定

1. Cloudflare D1 を作成、[Cloudflare D1 設定ガイド](src/content/note/ja/cloudflare-d1.md)を参照。
2. Cloudflare Turnstile を設定、[Cloudflare Turnstile 設定ガイド](src/content/note/ja/cloudflare-turnstile.md)を参照。
    - 匿名コメントを有効にしない場合は、このステップをスキップできます。
3. OAuth 認証を設定、[OAuth 設定ガイド](src/content/note/ja/oauth.md)を参照。
4. サイト設定および国際化（i18n）設定をカスタマイズするには、以下のファイルを変更してください。[サイト設定ガイド](src/content/note/ja/configuration.md)を参照：
    - `.env`
    - `astro.config.ts`
    - `site.config.json`

## 🚀 デプロイ

```sh
npm run build
npm run deploy
```

GitHub Actions による**自動デプロイ**の設定については、[GitHub Actions 設定ガイド](src/content/note/ja/github-actions.md)を参照してください。

## 🔄 更新

アップストリームの更新を同期するには、以下のコマンドを実行します：

```sh
git remote add theme https://github.com/tuyuritio/astro-theme-thought-lite.git
git fetch theme
git merge theme/cloudflare  # 初回更新時は `--allow-unrelated-histories` フラグを追加
npm install
npm run db:migrate:local
```

## ✍️ コンテンツ作成

コンテンツ作成は `src/content` ディレクトリに集中しており、主に以下の部分を含みます：

- `note` - 文記、入念に構成された詳細な長文作品に特化
- `jotting` - 随筆、軽量で即時的なコンテンツ記録
- `preface` - 序文、第一印象としてサイトのホームページに表示
- `information` - 情報、各種説明的なコンテンツを含む

すべてのコンテンツブロックは多言語に対応しています。対応する言語ディレクトリを作成してからコンテンツ作成を開始してください。詳細は[コンテンツ作成ガイド](src/content/note/ja/content.md)を参照してください。

## 🤝 貢献

あらゆる形式の貢献を歓迎し、感謝しています！

- プロジェクトの宣伝や他のユーザーの支援
- [Issues](https://github.com/tuyuritio/astro-theme-thought-lite/issues) の報告や新機能の提案
- ドキュメントの改善や国際化（i18n）の支援
- コード貢献の提出 - 詳細は[コード貢献ガイド](CONTRIBUTING.md)を参照してください

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
- [Astro Sphere](https://github.com/markhorn-dev/astro-sphere)
- [astro-vitesse](https://github.com/adrian-ub/astro-vitesse)
- [Miniblog](https://github.com/nicholasdly/miniblog)
- [AstroPaper with I18n](https://github.com/yousef8/astro-paper-i18n)

## 📜 ライセンス

このプロジェクトは [GPLv3](LICENSE) でライセンスされており、自由に変更および配布できますが、元の著作権表示を保持する必要があります。
