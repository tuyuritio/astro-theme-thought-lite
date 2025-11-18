---
title: GitHub Actions 設定ガイド
timestamp: 2025-07-21 00:00:00+00:00
tags: [Guide, GitHub]
description: Cloudflare Workers への自動デプロイのための GitHub Actions 設定、必要な環境変数とシークレットの設定を含む。
---

> [!TIP]
> テーマはデフォルトで GitHub Actions による Cloudflare Workers への自動デプロイを有効にしています。\
> 無効にするには、`.github/workflows/deploy.yaml` ファイルを削除してください。

GitHub リポジトリの *Settings > Secrets and variables > Actions* で、以下の Repository secrets を追加します：

- `ENV`: `.env` ファイルのすべての内容
- `CLOUDFLARE_PROJECT_NAME`: プロジェクト名
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare アカウント ID
- `CLOUDFLARE_API_TOKEN`: Cloudflare API Token
- `CLOUDFLARE_DATABASE_NAME`: D1 データベース名
- `CLOUDFLARE_DATABASE_ID`: D1 データベース ID
