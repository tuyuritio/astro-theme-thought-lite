---
title: Cloudflare D1 設定ガイド
timestamp: 2025-07-07 00:00:00+00:00
tags: [Guide, Cloudflare, Database]
description: Cloudflare D1 データベースのゼロからの設定手順、データベース作成、接続設定、データ移行まで完全ガイド。
---

> 公式ドキュメント: [Cloudflare D1](https://developers.cloudflare.com/d1/get-started/)\
> Drizzle ドキュメント: [Cloudflare D1 HTTP API with Drizzle Kit](https://orm.drizzle.team/docs/guides/d1-http-with-drizzle-kit)

## Cloudflare D1 データベースを作成

コマンド `npx wrangler d1 create <DATABASE_NAME>` を実行すると、以下が出力されます：

```toml
✅ Successfully created DB '<DATABASE_NAME>' in region <REGION>
Created your new D1 database.

[[d1_databases]]
binding = "DB"
database_name = "<DATABASE_NAME>"
database_id = "<DATABASE_ID>"
```

## データベースをバインド

`wrangler.toml` ファイルを作成：

```sh
cp wrangler.example.toml wrangler.toml
```

`PROJECT_NAME` を記入します。これは Cloudflare Workers のプロジェクト名として使用されます。

前のステップで生成された `DATABASE_NAME` と `DATABASE_ID` を `wrangler.toml` に記入します。

## 編集トークンの申請

1. Cloudflare ダッシュボードで、右上のアバターをクリックし、**プロファイル**を選択します。
2. **API トークン**タブの下で、*カスタムトークンの作成*セクションの**開始**をクリックします。
3. **トークン名**を記入します。
4. *権限*で [**アカウント**] [**D1**] [**編集**] を選択します。
    - GitHub Actions による自動デプロイが必要な場合は、[**アカウント**] [**Workers スクリプト**] [**編集**] 権限を追加します。
5. *アカウントリソース*で、プロジェクトで使用する Cloudflare アカウントを選択します。
6. オプションで **TTL** を設定します。
7. **概要に進む**をクリックし、API トークンの概要内容が **<アカウント> - D1\:編集** であることを確認します。
    - Workers 権限を追加した場合は **<アカウント> - Workers スクリプト\:編集, D1\:編集** になります。
8. **トークンを作成**をクリックします。
9. 生成されたトークンを**コピー**して保存し、プロンプトに従ってトークンが正常に動作するかテストすることもできます。

## Drizzle 環境変数の設定

`.env` を編集し、以下を記入します：

| 変数 | 説明 |
| - | - |
| `CLOUDFLARE_ACCOUNT_ID`* | Cloudflare アカウント ID、*アカウントホームページ*のユーザー名の隣のドロップダウンで*アカウント ID をコピー*をクリックして取得 |
| `CLOUDFLARE_DATABASE_ID`* | Cloudflare D1 データベース ID |
| `CLOUDFLARE_API_TOKEN`* | Cloudflare アクセストークン |

`*` は必須オプションを示します。

## データベースの削除

データベースを削除する必要がある場合は、以下のコマンドを使用できます：

```sh
npx wrangler d1 delete <DATABASE_NAME>
```
