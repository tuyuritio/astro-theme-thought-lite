---
title: GitHub Actions 設定ガイド
timestamp: 2025-07-21 00:00:00+00:00
tags: [Guide, GitHub]
description: Cloudflare Workers への自動デプロイのための GitHub Actions 設定、必要な環境変数とシークレットの設定を含む。
---

> [!TIP]
> テーマはデフォルトで GitHub Actions による Cloudflare Workers への自動デプロイを有効にしています。\
> 無効にするには、`.github/workflows/deploy.yaml` ファイルを削除してください。

## API トークンの申請

1. Cloudflare ダッシュボードで、右上のアイコンをクリックし、**プロフィール**を選択します。
2. **API トークン**タブで、*カスタムトークンを作成する*の**開始する**をクリックします。
3. **トークン名**を入力します。
4. *権限*を選択：
    - [**アカウント**] [**D1**] [**編集**]
    - [**アカウント**] [**Workers スクリプト**] [**編集**]
5. *アカウントリソース*で、プロジェクトで使用している Cloudflare アカウントを選択します。
6. 必要に応じて **TTL** を設定します。
7. **概要を表示して続行**をクリックし、API トークン概要の内容が **<アカウント> - Workers スクリプト:編集, D1:編集** であることを確認します。
8. **トークンを作成**をクリックします。
9. 生成されたトークンを**コピー**して保存します。

## リポジトリシークレットの設定

GitHub リポジトリの *Settings > Secrets and variables > Actions* で、以下の Repository secrets を追加します：

- `ENV`: `.env` ファイルのすべての内容
- `CLOUDFLARE_PROJECT_NAME`: プロジェクト名
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare アカウント ID
- `CLOUDFLARE_API_TOKEN`: Cloudflare API トークン
- `CLOUDFLARE_DATABASE_NAME`: D1 データベース名
- `CLOUDFLARE_DATABASE_ID`: D1 データベース ID
