---
title: GitHub Actions 配置指南
timestamp: 2025-07-21 00:00:00+00:00
tags: [Guide, GitHub]
description: 配置 GitHub Actions 实现自动部署到 Cloudflare Workers，包括必要的环境变量和密钥设置。
---

> [!TIP]
> 主题默认启用 GitHub Actions 自动部署到 Cloudflare Workers。\
> 如需禁用，请直接删除 `.github/workflows/deploy.yaml` 文件。

## 申请 API 令牌

1. 在 Cloudflare 仪表盘中，点击右上角头像，选择**配置文件**。
2. 在 **API 令牌**选项卡下，点击*创建自定义令牌*一栏的**开始使用**。
3. 填写**令牌名称**。
4. *权限*选择：
    - [**账户**] [**D1**] [**编辑**]
    - [**账户**] [**Workers 脚本**] [**编辑**]
5. *帐户资源*选择项目中使用的 Cloudflare 账户。
6. 可选配置 **TTL**。
7. 点击**继续以现实摘要**，确保 API 令牌摘要的内容为 **<账户> - Workers 脚本\:编辑, D1\:编辑**。
8. 点击**创建令牌**。
9. **复制**并保存生成的令牌，也可根据提示测试令牌能否正常工作。

## 配置仓库密钥

在 GitHub 仓库的 *Settings > Secrets and variables > Actions* 中，添加以下 Repository secrets：

- `ENV`：`.env` 文件中的所有内容
- `CLOUDFLARE_PROJECT_NAME`：项目名称
- `CLOUDFLARE_ACCOUNT_ID`：Cloudflare 账户 ID
- `CLOUDFLARE_API_TOKEN`：Cloudflare API 令牌
- `CLOUDFLARE_DATABASE_NAME`：D1 数据库名称
- `CLOUDFLARE_DATABASE_ID`：D1 数据库 ID
