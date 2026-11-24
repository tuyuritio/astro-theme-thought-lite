---
title: OAuth 設定ガイド
timestamp: 2025-06-24 00:00:00+00:00
series: Comment
tags: [Guide, OAuth]
description: GitHub、Google などの複数プロバイダーに対応した OAuth 2.0 認証の詳細設定ガイド。
---

## OAuth トークンの作成

OAuth 2.0 認証を使用して訪問者のログインとコメントをサポートします。現在、一部の OAuth プロバイダーが組み込まれています。

追加したいプロバイダーに対応する変数を `.env` ファイルに追加してください：

| 変数 | 説明 |
| - | - |
| `GITHUB_CLIENT_ID` | Github OAuth APP を作成, https://github.com/settings/developers |
| `GITHUB_CLIENT_SECRET` | Github OAuth APP でシークレットを作成, https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps |
| `GOOGLE_CLIENT_ID` | Google OAuth Platform を作成, https://console.cloud.google.com/auth |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 クライアント ID からシークレットを取得, https://console.cloud.google.com/auth/clients |

> [!TIP]
> 任意のサードパーティ認証プロバイダを有効にする場合、そのプロバイダの `*_CLIENT_ID` と `*_CLIENT_SECRET` の両方を設定する必要があります；いずれかが欠けている場合、そのプロバイダは自動的に**無効**になります。

プロバイダー設定では、`Website URL` にサイト URL を、`Callback URI` に `<サイト URL>/@/reach/<プロバイダー>` を記入してください。

## OAuth プロバイダーの拡張

認証は [`@tuyuritio/identity`](https://github.com/tuyuritio/thought-lite-toolkit/tree/main/packages/identity) に基づいています。別の組み込みプロバイダーを有効にする場合：

### 1. 環境変数の設定

`.env` ファイルに大文字の `<PROVIDER>_CLIENT_ID` / `<PROVIDER>_CLIENT_SECRET` 形式でクライアント認証情報を追加します：

```sh
DISCORD_CLIENT_ID=client_id
DISCORD_CLIENT_SECRET=client_secret
```

### 2. `site.config.ts` に設定を追加

`site.config.ts` の `oauth` リストに表示名、アイコン、必要な `scopes` を追加します：

```ts
const oauth = comment
	? providers({
			github: { name: "GitHub", logo: "simple-icons--github", clientID: env.GITHUB_CLIENT_ID, clientSecret: env.GITHUB_CLIENT_SECRET, scopes: ["read:user"] },
			google: { name: "Google", logo: "simple-icons--google", clientID: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET, scopes: ["profile"] },
			discord: { name: "Discord", logo: "simple-icons--discord", clientID: env.DISCORD_CLIENT_ID, clientSecret: env.DISCORD_CLIENT_SECRET, scopes: ["identify"] }
		})
	: [];
```

### テスト

1. ログインページにアクセス
2. 新しい OAuth プロバイダーを選択
3. 認証プロセスを完了
4. ユーザー情報が正しく取得されることを確認

### 注意事項

- 必要な権限スコープのみを要求する
- 機密情報を適切に処理する
- ユーザーが能動的に認証を削除する機能を提供する
