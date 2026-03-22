---
title: 评论系统配置指南
timestamp: 2026-03-23 00:00:00+00:00
series: Comment
tags: [Guide, Cloudflare, Database]
description: 从零开始配置 Cloudflare D1 数据库，包括创建数据库、设置连接、迁移数据等完整流程。
toc: true
---

本主题内置评论系统基于 Astro Actions 及 Cloudflare D1 构建，部分配置请参考[站点配置指南](/zh-cn/note/configuration)。

## 创建 Cloudflare D1 数据库

运行命令 `pnpm wrangler d1 create <DATABASE_NAME>` 创建 [Cloudflare D1](https://developers.cloudflare.com/d1/get-started/) 实例，将输出：

```toml
✅ Successfully created DB '<DATABASE_NAME>' in region <REGION>
Created your new D1 database.

[[d1_databases]]
binding = "DB"
database_name = "<DATABASE_NAME>"
database_id = "<DATABASE_ID>"
```

> [!Tip]
> 如需删除数据库，可使用命令 `pnpm wrangler d1 delete <DATABASE_NAME>`。

## 本地环境配置

运行如下命令创建配置文件：

```sh
cp .env.example .env
cp wrangler.example.toml wrangler.toml
```

使用如下命令生成 16 字节 Base64 密钥 `PASS_KEY` 填入 `.env`，其将用于生成 Token：

```sh
# OpenSSL
openssl rand -base64 16

# Node.js
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
```

在 `wrangler.toml` 中填写 `PROJECT_NAME`，这将作为 Cloudflare Workers 的项目名称，同时填入上一步生成的 `DATABASE_NAME` 与 `DATABASE_ID`。

`.env` 中的 `AUTHOR_ID` 用于标识站点作者，需在 [Cloudflare D1 面板](https://dash.cloudflare.com/?to=/:account/workers/d1)中查询。

## 免登录评论配置

为防止脚本滥刷评论，匿名评论默认关闭，如需启用需配置人机校验。

主题采用 [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/get-started/) 以提供安全无感的校验流程，请根据以下步骤配置：

1. 在 Cloudflare 仪表盘中的左侧导航栏中，选择 [**Turnstile**](https://dash.cloudflare.com/?to=/:account/turnstile)。
2. 点击**添加小组件**。
3. 输入**小组件名称**并**添加主机名**。
   - 本地开发时可输入 `localhost`。
4. 选择*小组件模式*为**不可见**。
5. 点击**创建**。

创建成功后，将获得的两个密钥添加在 `.env` 中：

- `CLOUDFLARE_TURNSTILE_SITE_KEY` - 站点密钥。
- `CLOUDFLARE_TURNSTILE_SECRET_KEY` - 私钥。
