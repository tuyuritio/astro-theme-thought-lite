---
title: OAuth 配置指南
timestamp: 2025-06-24 00:00:00+00:00
tags: [Guide, OAuth]
description: 详细介绍如何配置 OAuth 2.0 认证，支持 GitHub、Google、Twitter 等多种提供商的集成设置指南。
---

## 创建 OAuth Token

使用 OAuth 2.0 认证以支持访客登录和评论，目前内置部分 OAuth 提供商。

请在 `.env` 文件中针对需要添加的提供商添加对应变量：

| 变量 | 描述 |
| - | - |
| `GITHUB_CLIENT_ID` | 创建 Github OAuth APP，https://github.com/settings/developers |
| `GITHUB_CLIENT_SECRET` | 在 Github OAuth APP 中创建密钥，https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps |
| `GOOGLE_CLIENT_ID` | 创建 Google OAuth Platform，https://console.cloud.google.com/auth |
| `GOOGLE_CLIENT_SECRET` | 从 OAuth 2.0 客户端 ID 中获取密钥，https://console.cloud.google.com/auth/clients |
| `TWITTER_CLIENT_ID` | 创建 X Developer APP，https://developer.x.com/en/portal/dashboard |
| `TWITTER_CLIENT_SECRET` | 在 User authentication settings 中创建密钥 |

提供商配置中，`Website URL` 填写站点 URL，`Callback URI` 填写 `<站点 URL>/drifter/anchor/<提供商>`。

## 扩展 OAuth 提供商

如果需要添加新的 OAuth 提供商，请参考以下步骤或 [Arctic 文档](https://arcticjs.dev/)，并在 `src/utils/oauth.ts` 中补充相应逻辑。

### 1. 环境变量配置

首先，在环境变量中添加新提供商的客户端凭证：

```sh
PLATFORM_CLIENT_ID=client_id
PLATFORM_CLIENT_SECRET=client_secret
```

### 2. 扩展 OAuth 类构造函数

在 `OAuth` 类的构造函数中添加新的提供商支持：

```ts
import { PLATFORM } from "arctic";   // 确保 Arctic 库支持该提供商

constructor(platform?: string) {
    // ...

    // 添加新提供商
    else if (platform == "PLATFORM") {
        if (!(env.PLATFORM_CLIENT_ID && env.PLATFORM_CLIENT_SECRET)) throw new Error("Missing Environment Variables");
        this.provider = new PLATFORM(env.PLATFORM_CLIENT_ID, env.PLATFORM_CLIENT_SECRET, `${REDIRECT_URI}/PLATFORM`);
    }

    // ...
}
```

### 3. 实现授权 URL 生成

在 `URL` 方法中添加新提供商的授权链接生成逻辑：

```ts
url(state: string, codeVerifier: string): URL {
    // ...

    else if (this.provider instanceof PLATFORM) {
        // 提交授权请求范围
        return this.provider.createAuthorizationURL(state, code_verifier, ["identify"]);
    }

    // ...
}
```

### 4. 实现用户信息验证

在 `validate` 方法中添加新提供商的用户信息获取逻辑：

```ts
async validate(code: string, verifier: string): Promise<OAuthAccount> {
    const tokens = await this.provider.validateAuthorizationCode(code, verifier);
    const access_token = tokens.accessToken();

    // ...

    else if (this.provider instanceof PLATFORM) {
        // 如果令牌存在有效期，获取过期时间和刷新令牌
        const expire_at = tokens.hasRefreshToken() ? tokens.accessTokenExpiresAt() : undefined;
        const refresh_token = tokens.hasRefreshToken() ? tokens.refreshToken() : undefined;

        // 有些提供商需要通过 API 获取用户信息
        const response = await fetch("https://platform.com/api/user", { headers: { Authorization: `Bearer ${access_token}`,"User-Agent": USER_AGENT } });
        const user = await response.json();

        // 返回信息根据实际情况调整
        return { platform: "PLATFORM", access: access_token, expire: expire_at, refresh: refresh_token, account: user.id, handle: user.login, name: user.username, description: user.description, image: user.avatar_url };
    } else if (this.provider instanceof PLATFORM) {
        // 有些提供商将用户信息嵌入在令牌中
        const user: any = decodeIdToken(tokens.idToken());

        return { platform: "PLATFORM", access: access_token, expire: expire_at, refresh: refresh_token, account: user.id, handle: user.login, name: user.username, description: user.description, image: user.avatar_url };
    }

    // ...
}
```

### 5. 实现用户信息更新

在 `update` 方法中添加新提供商的用户信息更新逻辑：

```ts
async update(token: string, expire: boolean): Promise<OAuthAccount> {
    // ...

    else if (this.provider instanceof PLATFORM) {
        let expire_at: Date | undefined = undefined;

        // 如果令牌过期，进行刷新
        if (expire) {
            const tokens = await this.provider.refreshAccessToken(token);
            token = tokens.accessToken();
            expire_at = tokens.accessTokenExpiresAt();
        }

        // 获取最新用户信息
        const response = await fetch("https://platform.com/api/user", { headers: { Authorization: `Bearer ${token}`, "User-Agent": USER_AGENT } });
        const user = await response.json();

        return { platform: "PLATFORM", access: token, expire: expire_at, account: user.id, handle: user.login, name: user.username, description: user.description, image: user.avatar_url };
    }

    // ...
}
```

### 6. 实现令牌撤销

在 `revoke` 方法中添加新提供商的令牌撤销逻辑：

```ts
async revoke(token: string): Promise<void> {
    // ...

    else if (this.provider instanceof PLATFORM) {
        // 如果提供商支持令牌撤销，调用相应的 API
        await this.provider.revokeToken(token);
    }

    // ...
}
```

### 测试

1. 访问登录页面
2. 选择新的 OAuth 提供商
3. 完成授权流程
4. 验证用户信息是否正确获取

### 注意事项

- 只申请必要的权限范围（scope）
- 妥善处理敏感信息
- 提供用户主动删除授权的功能
