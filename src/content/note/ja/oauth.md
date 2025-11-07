---
title: OAuth 設定ガイド
timestamp: 2025-06-24 00:00:00+00:00
tags: [Guide, OAuth]
description: GitHub、Google、Twitter などの複数プロバイダーに対応した OAuth 2.0 認証の詳細設定ガイド。
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
| `TWITTER_CLIENT_ID` | X Developer APP を作成, https://developer.x.com/en/portal/dashboard |
| `TWITTER_CLIENT_SECRET` | User authentication settings でシークレットを作成 |

プロバイダー設定では、`Website URL` にサイト URL を、`Callback URI` に `<サイト URL>/drifter/anchor/<プロバイダー>` を記入してください。

## OAuth プロバイダーの拡張

新しい OAuth プロバイダーを追加する必要がある場合は、以下の手順または [Arctic ドキュメント](https://arcticjs.dev/)を参照し、`src/utils/oauth.ts` で対応するロジックを補完してください。

### 1. 環境変数の設定

まず、環境変数に新しいプロバイダーのクライアント認証情報を追加します：

```sh
PLATFORM_CLIENT_ID=client_id
PLATFORM_CLIENT_SECRET=client_secret
```

### 2. OAuth クラスコンストラクタの拡張

`OAuth` クラスのコンストラクタに新しいプロバイダーのサポートを追加します：

```ts
import { PLATFORM } from "arctic";   // Arctic ライブラリがこのプロバイダーをサポートしていることを確認

constructor(platform?: string) {
    // ...

    // 新しいプロバイダーを追加
    else if (platform == "PLATFORM") {
        if (!(env.PLATFORM_CLIENT_ID && env.PLATFORM_CLIENT_SECRET)) throw new Error("Missing Environment Variables");
        this.provider = new PLATFORM(env.PLATFORM_CLIENT_ID, env.PLATFORM_CLIENT_SECRET, `${REDIRECT_URI}/PLATFORM`);
    }

    // ...
}
```

### 3. 認証URL生成の実装

`URL` メソッドに新しいプロバイダーの認証リンク生成ロジックを追加します：

```ts
url(state: string, codeVerifier: string): URL {
    // ...

    else if (this.provider instanceof PLATFORM) {
        // 認証リクエストスコープを提出
        return this.provider.createAuthorizationURL(state, code_verifier, ["identify"]);
    }

    // ...
}
```

### 4. ユーザー情報検証の実装

`validate` メソッドに新しいプロバイダーのユーザー情報取得ロジックを追加します：

```ts
async validate(code: string, verifier: string): Promise<OAuthAccount> {
    const tokens = await this.provider.validateAuthorizationCode(code, verifier);
    const access_token = tokens.accessToken();

    // ...

    else if (this.provider instanceof PLATFORM) {
        // トークンに有効期限がある場合、有効期限とリフレッシュトークンを取得
        const expire_at = tokens.hasRefreshToken() ? tokens.accessTokenExpiresAt() : undefined;
        const refresh_token = tokens.hasRefreshToken() ? tokens.refreshToken() : undefined;

        // 一部のプロバイダーは API を通じてユーザー情報を取得する必要がある
        const response = await fetch("https://platform.com/api/user", { headers: { Authorization: `Bearer ${access_token}`,"User-Agent": USER_AGENT } });
        const user = await response.json();

        // 実際の状況に応じて情報を調整して返す
        return { platform: "PLATFORM", access: access_token, expire: expire_at, refresh: refresh_token, account: user.id, handle: user.login, name: user.username, description: user.description, image: user.avatar_url };
    } else if (this.provider instanceof PLATFORM) {
        // 一部のプロバイダーはトークンにユーザー情報を埋め込む
        const user: any = decodeIdToken(tokens.idToken());

        return { platform: "PLATFORM", access: access_token, expire: expire_at, refresh: refresh_token, account: user.id, handle: user.login, name: user.username, description: user.description, image: user.avatar_url };
    }

    // ...
}
```

### 5. ユーザー情報更新の実装

`update` メソッドに新しいプロバイダーのユーザー情報更新ロジックを追加します：

```ts
async update(token: string, expire: boolean): Promise<OAuthAccount> {
    // ...

    else if (this.provider instanceof PLATFORM) {
        let expire_at: Date | undefined = undefined;

        // トークンが期限切れの場合、更新する
        if (expire) {
            const tokens = await this.provider.refreshAccessToken(token);
            token = tokens.accessToken();
            expire_at = tokens.accessTokenExpiresAt();
        }

        // 最新のユーザー情報を取得
        const response = await fetch("https://platform.com/api/user", { headers: { Authorization: `Bearer ${token}`, "User-Agent": USER_AGENT } });
        const user = await response.json();

        return { platform: "PLATFORM", access: token, expire: expire_at, account: user.id, handle: user.login, name: user.username, description: user.description, image: user.avatar_url };
    }

    // ...
}
```

### 6. トークン失効の実装

`revoke` メソッドに新しいプロバイダーのトークン失効ロジックを追加します：

```ts
async revoke(token: string): Promise<void> {
    // ...

    else if (this.provider instanceof PLATFORM) {
        // プロバイダーがトークン失効をサポートしている場合、対応する API を呼び出す
        await this.provider.revokeToken(token);
    }

    // ...
}
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
