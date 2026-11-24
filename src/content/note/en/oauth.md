---
title: OAuth Configuration Guide
timestamp: 2025-06-24 00:00:00+00:00
series: Comment
tags: [Guide, OAuth]
description: Comprehensive guide for setting up OAuth 2.0 authentication with support for GitHub, Google and other providers.
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

> [!TIP]
> When enabling any third-party auth provider, you must configure both the `*_CLIENT_ID` and `*_CLIENT_SECRET` for that provider; if either variable is missing, the provider will remain **disabled**.

In provider configuration, fill in the site URL for `Website URL`, and fill in `<SITE_URL>/@/reach/<PROVIDER>` for `Callback URI`.

## Extend OAuth Providers

Authentication is powered by [`@tuyuritio/identity`](https://github.com/tuyuritio/thought-lite-toolkit/tree/main/packages/identity). To enable another built-in provider:

### 1. Environment Variable Configuration

Add the provider's client credentials to `.env` using uppercase `<PROVIDER>_CLIENT_ID` / `<PROVIDER>_CLIENT_SECRET`:

```sh
DISCORD_CLIENT_ID=client_id
DISCORD_CLIENT_SECRET=client_secret
```

### 2. Add the Provider in `site.config.ts`

Add the provider's display name, icon, and required `scopes` to `oauth` in `site.config.ts`:

```ts
const oauth = comment
	? providers({
			github: { name: "GitHub", logo: "simple-icons--github", clientID: env.GITHUB_CLIENT_ID, clientSecret: env.GITHUB_CLIENT_SECRET, scopes: ["read:user"] },
			google: { name: "Google", logo: "simple-icons--google", clientID: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET, scopes: ["profile"] },
			discord: { name: "Discord", logo: "simple-icons--discord", clientID: env.DISCORD_CLIENT_ID, clientSecret: env.DISCORD_CLIENT_SECRET, scopes: ["identify"] }
		})
	: [];
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
