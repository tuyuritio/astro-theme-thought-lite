---
title: サイト設定ガイド
timestamp: 2025-11-04 00:00:00+00:00
tags: [Guide, Astro]
description: Astro テーマサイトの基本設定説明、環境変数、サイト情報、Markdown処理、アイコン生成などのコア設定項目をカバー。
---

## `.env`

1. コマンドを実行して `.env` ファイルを作成します：
    ```sh
    cp .env.example .env
    ```
2. 変数を修正または追加します：
    | 変数 | 説明 |
    | - | - |
    | `PUBLIC_TIMEZONE`* | デフォルト表示タイムゾーン、[タイムゾーンリスト](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List)を参照 |
    | `PASS_KEY`* | トークン生成用、16バイトBase64形式キー、`openssl rand -base64 16` コマンドで生成<br>または `node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"` |
    | `NOTIFY_PUBLIC_KEY`* | デスクトッププッシュ通知用のVAPID公開鍵、`npx web-push generate-vapid-keys` コマンドで生成 |
    | `NOTIFY_PRIVATE_KEY`* | デスクトッププッシュ通知用のVAPID秘密鍵、公開鍵と同時に生成 |
    | `AUTHOR_ID` | 著者ID、コメント欄でサイト著者を識別するため；[Cloudflare D1 パネル](https://dash.cloudflare.com/?to=/:account/workers/d1)で確認 |

    `*` は必須オプション。

## `astro.config.ts`

- `site` - サイト URL
- `i18n`
    - `locales` - サポートされている言語のリスト
    - `defaultLocale` - デフォルト言語
- `markdown`
    - `remarkPlugins` - Markdown 処理プラグイン
    - `rehypePlugins` - HTML 処理プラグイン

## `site.config.ts`

- `title` - サイトタイトル
- `prologue` - ホームページのタグライン、`\n` 改行をサポート
- `author`
    - **string** - 著者名
    - **object**
        - `name` - 著者名
        - `email` - 著者メールアドレス
        - `link` - 著者の個人ウェブサイト
- `description` - サイトの説明
- `copyright` - 著作権情報
    - `type` - CC ライセンスタイプ
    - `year` - 著作権年または年範囲
- `feed` - フィード
    - `section` - フィードコンテンツセクション
        - **`*`** - すべてのセクション
        - **array**
            - `note` - 文記セクション
            - `jotting` - 随筆セクション
    - `limit` - コンテンツ数量制限
- `comment`
    - `max-length` - コメントの最大文字数
- `latest` - 最新コンテンツ表示
    - `note` - 最新の文記を表示するかどうか
    - `jotting` - 最新の随筆を表示するかどうか

## アイコン生成

[RealFaviconGenerator](https://realfavicongenerator.net/) を使用してアイコンを生成し、ダウンロードして解凍した以下のファイルを `/public` ディレクトリに上書きすることをお勧めします：

- `favicon-96x96.png`
- `favicon.ico`
- `favicon.svg`

### ホームページロゴ

参照位置は `src/pages/[...locale]/index.astro` にあり、`import Logo from "$icons/site-logo.svg"` 文でインポートします。

```astro
<Logo width={100} />
```

以下の方法で設定できます：

1. SVG ファイルで `src/icons/site-logo.svg` を置き換えます。
    - ライト/ダークテーマの変化に適応するため、`stroke="currentColor"` の使用をお勧めします。
2. 画像インポートに変更します。
3. この部分のコンテンツを直接置き換えるか削除します。
