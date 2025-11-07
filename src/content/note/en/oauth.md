---
title: OAuth Configuration Guide
timestamp: 2025-06-24 00:00:00+00:00
tags: [Guide, OAuth]
description: Comprehensive guide for setting up OAuth 2.0 authentication with support for GitHub, Google, Twitter and other providers.
---

## Create OAuth Token

Use OAuth 2.0 authentication to support visitor login and comments. Currently, some OAuth providers are built-in.

Please add corresponding variables for the providers you need to add in the `.env` file:

| Variable | Description |
| - | - |
| `GITHUB_CLIENT_ID` | Create Github OAuth APP, https://github.com/settings/developers |
| `GITHUB_CLIENT_SECRET` | Create secret in Github OAuth APP, https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps |
| `GOOGLE_CLIENT_ID` | Create Google OAuth Platform, https://console.cloud.google.com/auth |
| `GOOGLE_CLIENT_SECRET` | Get secret from OAuth 2.0 client ID, https://console.cloud.google.com/auth/clients |
| `TWITTER_CLIENT_ID` | Create X Developer APP, https://developer.x.com/en/portal/dashboard |
| `TWITTER_CLIENT_SECRET` | Create secret in User authentication settings |

In provider configuration, fill in the site URL for `Website URL`, and fill in `<SITE_URL>/drifter/anchor/<PROVIDER>` for `Callback URI`.

## Extend OAuth Providers

If you need to add a new OAuth provider, please refer to the following steps or [Arctic documentation](https://arcticjs.dev/), and supplement the corresponding logic in `src/utils/oauth.ts`.

### 1. Environment Variable Configuration

First, add the new provider's client credentials to the environment variables:

```sh
PLATFORM_CLIENT_ID=client_id
PLATFORM_CLIENT_SECRET=client_secret
```

### 2. Extend OAuth Class Constructor

Add new provider support in the `OAuth` class constructor:

```ts
import { PLATFORM } from "arctic";   // Ensure Arctic library supports this provider

constructor(platform?: string) {
    // ...

    // Add new provider
    else if (platform == "PLATFORM") {
        if (!(env.PLATFORM_CLIENT_ID && env.PLATFORM_CLIENT_SECRET)) throw new Error("Missing Environment Variables");
        this.provider = new PLATFORM(env.PLATFORM_CLIENT_ID, env.PLATFORM_CLIENT_SECRET, `${REDIRECT_URI}/PLATFORM`);
    }

    // ...
}
```

### 3. Implement Authorization URL Generation

Add authorization link generation logic for the new provider in the `URL` method:

```ts
url(state: string, codeVerifier: string): URL {
    // ...

    else if (this.provider instanceof PLATFORM) {
        // Submit authorization request scope
        return this.provider.createAuthorizationURL(state, code_verifier, ["identify"]);
    }

    // ...
}
```

### 4. Implement User Information Validation

Add user information retrieval logic for the new provider in the `validate` method:

```ts
async validate(code: string, verifier: string): Promise<OAuthAccount> {
    const tokens = await this.provider.validateAuthorizationCode(code, verifier);
    const access_token = tokens.accessToken();

    // ...

    else if (this.provider instanceof PLATFORM) {
        // If token has expiration, get expiration time and refresh token
        const expire_at = tokens.hasRefreshToken() ? tokens.accessTokenExpiresAt() : undefined;
        const refresh_token = tokens.hasRefreshToken() ? tokens.refreshToken() : undefined;

        // Some providers need to get user info through API
        const response = await fetch("https://platform.com/api/user", { headers: { Authorization: `Bearer ${access_token}`,"User-Agent": USER_AGENT } });
        const user = await response.json();

        // Return information adjusted according to actual situation
        return { platform: "PLATFORM", access: access_token, expire: expire_at, refresh: refresh_token, account: user.id, handle: user.login, name: user.username, description: user.description, image: user.avatar_url };
    } else if (this.provider instanceof PLATFORM) {
        // Some providers embed user info in tokens
        const user: any = decodeIdToken(tokens.idToken());

        return { platform: "PLATFORM", access: access_token, expire: expire_at, refresh: refresh_token, account: user.id, handle: user.login, name: user.username, description: user.description, image: user.avatar_url };
    }

    // ...
}
```

### 5. Implement User Information Update

Add user information update logic for the new provider in the `update` method:

```ts
async update(token: string, expire: boolean): Promise<OAuthAccount> {
    // ...

    else if (this.provider instanceof PLATFORM) {
        let expire_at: Date | undefined = undefined;

        // If token expired, refresh it
        if (expire) {
            const tokens = await this.provider.refreshAccessToken(token);
            token = tokens.accessToken();
            expire_at = tokens.accessTokenExpiresAt();
        }

        // Get latest user info
        const response = await fetch("https://platform.com/api/user", { headers: { Authorization: `Bearer ${token}`, "User-Agent": USER_AGENT } });
        const user = await response.json();

        return { platform: "PLATFORM", access: token, expire: expire_at, account: user.id, handle: user.login, name: user.username, description: user.description, image: user.avatar_url };
    }

    // ...
}
```

### 6. Implement Token Revocation

Add token revocation logic for the new provider in the `revoke` method:

```ts
async revoke(token: string): Promise<void> {
    // ...

    else if (this.provider instanceof PLATFORM) {
        // If provider supports token revocation, call corresponding API
        await this.provider.revokeToken(token);
    }

    // ...
}
```

### Testing

1. Visit the login page
2. Select the new OAuth provider
3. Complete the authorization process
4. Verify that user information is correctly retrieved

### Notes

- Only request necessary permission scopes
- Handle sensitive information properly
- Provide functionality for users to actively delete authorization
