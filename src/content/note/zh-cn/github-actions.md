---
title: GitHub Actions 配置指南
timestamp: 2025-07-21 00:00:00+00:00
tags: [Guide, GitHub]
description: 配置 GitHub Actions 实现自动部署到 Cloudflare Workers，包括必要的环境变量和密钥设置。
---

> [!TIP]
> 主题默认启用 GitHub Actions 自动部署到 Cloudflare Workers。\
> 如需禁用，请直接删除 `.github/workflows/deploy.yaml` 文件。

在 GitHub 仓库的 *Settings > Secrets and variables > Actions* 中，添加以下 Repository secrets：

- `ENV`：`.env` 文件中的所有内容
- `CLOUDFLARE_PROJECT_NAME`：项目名称
- `CLOUDFLARE_ACCOUNT_ID`：Cloudflare 账户 ID
- `CLOUDFLARE_API_TOKEN`：Cloudflare API Token
- `CLOUDFLARE_DATABASE_NAME`：D1 数据库名称
- `CLOUDFLARE_DATABASE_ID`：D1 数据库 ID
