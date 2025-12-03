# ThoughtLite

<div align="center">
    <p>
        <img alt="ThoughtLite Light Mode Preview" src=".github/assets/preview-light.webp">
        <img alt="ThoughtLite Dark Mode Preview" src=".github/assets/preview-dark.webp">
    </p>
    <p>
        <a href="https://github.com/tuyuritio/astro-theme-thought-lite/releases/latest"><img alt="GitHub Release" src="https://img.shields.io/github/v/release/tuyuritio/astro-theme-thought-lite"></a>
        <a href="https://raw.githubusercontent.com/tuyuritio/astro-theme-thought-lite/refs/heads/main/LICENSE"><img alt="GitHub License" src="https://img.shields.io/github/license/tuyuritio/astro-theme-thought-lite"></a>
        <a href="https://deepwiki.com/tuyuritio/astro-theme-thought-lite"><img alt="Ask DeepWiki" src="https://deepwiki.com/badge.svg"></a>
    </p>
    <p>コンテンツ作成に特化し、モダンな <a href="https://astro.build/">Astro</a> テーマ 🌟</p>
    <p>
        <small><a href="README.md">English</a></small>
        <small><a href="README.zh-cn.md">简体中文</a></small>
        <small><ins>日本語</ins></small>
    </p>
</div>

> [!NOTE]
> - `main` ブランチ：静的ビルド、任意の静的ホスティングプラットフォームにデプロイ可能。
> - `cloudflare` ブランチ✅：内蔵コメントシステムを有効にし、Cloudflare のみでデプロイ可能。

🎬 **ライブデモ**：[Cloudflare Workers](https://thought-lite.ttio.workers.dev/ja/)

## ✨ 機能

- [x] **レスポンシブデザイン** - モバイル、タブレット、デスクトップに対応。
- [x] **ライト / ダークモード** - システムに自動追従し、手動切り替えもサポート。
- [x] **CSR 動的コンテンツフィルタリング** - History API によるリストフィルタリングとページネーション。
- [x] **i18n サポート** - 拡張可能な多言語対応、単一言語モードでも完璧に動作。
- [x] **サイトマップ & フィード購読** - サイトマップと Atom フィードの自動生成。
- [x] **OpenGraph サポート** - 組み込みの Open Graph メタタグでソーシャルメディア共有を最適化。
- [x] **コメントシステム** - Cloudflare D1 ベース、デプロイが簡単でプライバシー制御可能；OAuth 認証とゲストコメントをサポート。
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
pnpm create astro --template tuyuritio/astro-theme-thought-lite#cloudflare

# 対話型プロンプトに従ってプロジェクトを作成

cd <your-project-name>
pnpm db:migrate:local    # ローカルテストデータベースを生成
pnpm dev
```

### テンプレートを使用

1. [このテンプレートを使用して](https://github.com/new?template_name=astro-theme-thought-lite&template_owner=tuyuritio)新しいリポジトリを作成する（`Include all branches` を有効にする）か、このリポジトリを [Fork](https://github.com/tuyuritio/astro-theme-thought-lite/fork) します（`Copy the main branch only` のチェックを外す）。
2. 以下のコマンドを実行します：

```sh
git clone <your-repo-url>
cd <your-repo-name>
pnpm install
pnpm db:migrate:local    # ローカルテストデータベースを生成
pnpm dev
```

## 🔧 設定

1. Cloudflare D1 を作成、[Cloudflare D1 設定ガイド](src/content/note/ja/cloudflare-d1.md)を参照。
2. Cloudflare Turnstile を設定、[Cloudflare Turnstile 設定ガイド](src/content/note/ja/cloudflare-turnstile.md)を参照。
    - 匿名コメントを有効にしない場合は、このステップをスキップできます。
3. OAuth 認証を設定、[OAuth 設定ガイド](src/content/note/ja/oauth.md)を参照。
4. サイト設定および国際化（i18n）設定をカスタマイズするには、以下のファイルを変更してください。[サイト設定ガイド](src/content/note/ja/configuration.md)と[国際化設定ガイド](src/content/note/ja/internationalization.md)を参照：
    - `.env`
    - `astro.config.ts`
    - `site.config.ts`

## 💻 コマンド

テーマは以下の一般的なコマンドを提供します：

| コマンド | アクション |
| --- | --- |
| `pnpm install` | プロジェクトの依存関係をインストール |
| `pnpm update` | プロジェクトの依存関係を更新 |
| `pnpm new` | 新しいコンテンツファイルを作成 |
| `pnpm dev` | ローカル開発サーバーを起動（デフォルト：`http://localhost:4321`） |
| `pnpm check` | Astro 型チェックを実行 |
| `pnpm build` | 本番バージョンをビルド |
| `pnpm preview` | ビルドしたサイトをプレビュー |
| `pnpm format` | コードフォーマット |
| `pnpm lint` | コードリント |
| `pnpm deploy` | Cloudflare にデプロイ |
| `pnpm deploy:dry` | デプロイをシミュレート |
| `pnpm db:migration` | データベースマイグレーションファイルを生成 |
| `pnpm db:migrate:local` | データベースマイグレーションをローカルで適用 |
| `pnpm db:migrate:remote` | データベースマイグレーションをリモートで適用 |

## 🚀 デプロイ

```sh
pnpm build
pnpm deploy
```

GitHub Actions による**自動デプロイ**の設定については、[GitHub Actions 設定ガイド](src/content/note/ja/github-actions.md)を参照してください。

## 🔄 更新

アップストリームの更新を同期するには、以下のコマンドを実行します：

```sh
git remote add theme https://github.com/tuyuritio/astro-theme-thought-lite.git
git fetch theme
git merge theme/cloudflare  # 初回更新時は `--allow-unrelated-histories` フラグを追加
pnpm install
pnpm db:migrate:local
```

## ✍️ コンテンツ作成

コンテンツ作成は `src/content` ディレクトリに集中しており、主に以下の部分を含みます：

- `note` - 文記、入念に構成された詳細な長文作品に特化
- `jotting` - 随筆、軽量で即時的なコンテンツ記録
- `preface` - 序文、第一印象としてサイトのホームページに表示
- `information` - 情報、各種説明的なコンテンツを含む

詳細は[コンテンツ作成ガイド](src/content/note/ja/content.md)を参照してください。

## 🤝 貢献

あらゆる形式の貢献を歓迎し、感謝しています！

- プロジェクトの宣伝や他のユーザーの支援
- [Issues](https://github.com/tuyuritio/astro-theme-thought-lite/issues) の報告や新機能の提案
- ドキュメントの改善や国際化（i18n）の支援
- コード貢献の提出 - 詳細は[コード貢献ガイド](CONTRIBUTING.md)を参照してください

## 🙏 謝辞

### 技術スタック

- **コアフレームワーク** - [Astro](https://astro.build/)
- **コア言語** - [TypeScript](https://www.typescriptlang.org/)
- **UI コンポーネント** - [Svelte](https://svelte.dev/)
- **CSS エンジン** - [Tailwind CSS](https://tailwindcss.com/)
- **アイコン** - [Iconify](https://iconify.design/)
- **フォント** - [Google Fonts](https://fonts.google.com/) | [ZeoSeven Fonts](https://fonts.zeoseven.com/)
- **画像ビューア** - [Medium Zoom](https://github.com/francoischalifour/medium-zoom)
- **SPA トランジション** - [Swup](https://swup.js.org/)
- **時間処理** - [Luxon](https://moment.github.io/luxon/)
- **コード品質** - [Biome](https://biomejs.dev/)
- **OAuth 認証** - [Arctic](https://arcticjs.dev/)
- **ORM** - [Drizzle ORM](https://orm.drizzle.team/)
- **データベース** - [Cloudflare D1](https://developers.cloudflare.com/d1/)
- **エッジ展開** - [Cloudflare Workers](https://workers.cloudflare.com/)

### インスピレーション

- [Astro Sphere](https://github.com/markhorn-dev/astro-sphere)
- [astro-vitesse](https://github.com/adrian-ub/astro-vitesse)
- [Miniblog](https://github.com/nicholasdly/miniblog)
- [AstroPaper with I18n](https://github.com/yousef8/astro-paper-i18n)

## 📜 ライセンス

このプロジェクトは [GPLv3](LICENSE) でライセンスされており、自由に変更および配布できますが、元の著作権表示を保持する必要があります。
