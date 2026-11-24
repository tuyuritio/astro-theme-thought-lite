---
title: OAuth 配置指南
timestamp: 2025-06-24 00:00:00+00:00
series: Comment
tags: [Guide, OAuth]
description: 详细介绍如何配置 OAuth 2.0 认证，支持 GitHub、Google 等多种提供商的集成设置指南。
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

> [!TIP]
> 启用任一第三方认证提供商，必须确保同时配置了其对应的 `*_CLIENT_ID` 和 `*_CLIENT_SECRET`；任一变量缺失或未配置，该提供商将自动保持**禁用**状态。

提供商配置中，`Website URL` 填写站点 URL，`Callback URI` 填写 `<站点 URL>/@/reach/<提供商>`。

## 扩展 OAuth 提供商

认证基于 [`@tuyuritio/identity`](https://github.com/tuyuritio/thought-lite-toolkit/tree/main/packages/identity)，如需启用其他内置提供商：

### 1. 配置环境变量

在 `.env` 中按 `<PROVIDER>_CLIENT_ID` / `<PROVIDER>_CLIENT_SECRET`（全大写）添加客户端凭证：

```sh
DISCORD_CLIENT_ID=client_id
DISCORD_CLIENT_SECRET=client_secret
```

### 2. 在 `site.config.ts` 中添加配置

在 `site.config.ts` 的 `oauth` 列表中补充展示名称、图标与所需 `scopes`：

```ts
const oauth = comment
	? providers({
			github: { name: "GitHub", logo: "simple-icons--github", clientID: env.GITHUB_CLIENT_ID, clientSecret: env.GITHUB_CLIENT_SECRET, scopes: ["read:user"] },
			google: { name: "Google", logo: "simple-icons--google", clientID: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET, scopes: ["profile"] },
			discord: { name: "Discord", logo: "simple-icons--discord", clientID: env.DISCORD_CLIENT_ID, clientSecret: env.DISCORD_CLIENT_SECRET, scopes: ["identify"] }
		})
	: [];
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
