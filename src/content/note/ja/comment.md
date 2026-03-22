---
title: コメントシステム設定ガイド
timestamp: 2026-03-23 00:00:00+00:00
series: Comment
tags: [Guide, Cloudflare, Database]
description: Cloudflare D1 データベースの作成、接続設定、データの移行など、ゼロからの設定プロセスを詳しく解説します。
toc: true
---

本テーマの内蔵コメントシステムは Astro Actions および Cloudflare D1 に基づいて構築されています。一部の設定については [サイト設定ガイド](/ja/note/configuration) を参照してください。

## Cloudflare D1 データベースの作成

`pnpm wrangler d1 create <DATABASE_NAME>` コマンドを実行して [Cloudflare D1](https://developers.cloudflare.com/d1/get-started/) インスタンスを作成すると、以下のように出力されます：

```toml
✅ Successfully created DB '<DATABASE_NAME>' in region <REGION>
Created your new D1 database.

[[d1_databases]]
binding = "DB"
database_name = "<DATABASE_NAME>"
database_id = "<DATABASE_ID>"
```

> [!Tip]
> データベースを削除する必要がある場合は、`pnpm wrangler d1 delete <DATABASE_NAME>` コマンドを使用できます。

## ローカル環境の設定

以下のコマンドを実行して設定ファイルを作成します：

```sh
cp .env.example .env
cp wrangler.example.toml wrangler.toml
```

以下のコマンドを使用して、トークン生成に使用する 16 バイトの Base64 キー `PASS_KEY` を生成し、`.env` に記入します：

```sh
# OpenSSL
openssl rand -base64 16

# Node.js
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
```

`wrangler.toml` に `PROJECT_NAME`（Cloudflare Workers のプロジェクト名として使用）と、前のステップで生成された `DATABASE_NAME` および `DATABASE_ID` を記入します。

`.env` の `AUTHOR_ID` はサイト作成者を識別するために使用され、[Cloudflare D1 パネル](https://dash.cloudflare.com/?to=/:account/workers/d1) で確認できます。

## ログイン不要のコメント設定

スクリプトによるコメントの乱用を防ぐため、匿名コメントはデフォルトで無効になっています。有効にするには人間による検証（CAPTCHA）の設定が必要です。

本テーマでは [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/get-started/) を採用し、安全でスムーズな検証プロセスを提供しています。以下の手順で設定してください：

1. Cloudflare ダッシュボードの左側ナビゲーションメニューから [**Turnstile**](https://dash.cloudflare.com/?to=/:account/turnstile) を選択します。
2. **Widget を追加** をクリックします。
3. **Widget 名** を入力し、**ホスト名を追加** します。
   - ローカル開発時は `localhost` を入力できます。
4. *Widget モード* を **非表示** に設定します。
5. **作成** をクリックします。

作成に成功すると、2 つのキーが提供されます。これらを `.env` に追加してください：

- `CLOUDFLARE_TURNSTILE_SITE_KEY` - サイトキー。
- `CLOUDFLARE_TURNSTILE_SECRET_KEY` - 秘密キー。
