---
title: Cloudflare D1 配置指南
timestamp: 2025-07-07 00:00:00+00:00
tags: [Guide, Cloudflare, Database]
description: 从零开始配置 Cloudflare D1 数据库，包括创建数据库、设置连接、迁移数据等完整流程。
---

> 官方文档：[Cloudflare D1](https://developers.cloudflare.com/d1/get-started/)\
> Drizzle 文档：[Cloudflare D1 HTTP API with Drizzle Kit](https://orm.drizzle.team/docs/guides/d1-http-with-drizzle-kit)

## 创建 Cloudflare D1 数据库

运行命令 `npx wrangler d1 create <DATABASE_NAME>`，将输出：

```toml
✅ Successfully created DB '<DATABASE_NAME>' in region <REGION>
Created your new D1 database.

[[d1_databases]]
binding = "DB"
database_name = "<DATABASE_NAME>"
database_id = "<DATABASE_ID>"
```

## 绑定数据库

创建 `wrangler.toml` 文件：

```sh
cp wrangler.example.toml wrangler.toml
```

填写 `PROJECT_NAME`，这将作为 Cloudflare Workers 的项目名称。

将上一步生成的 `DATABASE_NAME` 和 `DATABASE_ID` 填入 `wrangler.toml`。

## 申请编辑令牌

1. 在 Cloudflare 仪表盘中，点击右上角头像，选择**配置文件**。
2. 在 **API 令牌**选项卡下，点击*创建自定义令牌*一栏的**开始使用**。
3. 填写**令牌名称**。
4. *权限*选择 [**账户**] [**D1**] [**编辑**]。
    - 如果需通过 GitHub Actions 自动化部署，需添加 [**账户**] [**Workers 脚本**] [**编辑**] 权限。
5. *帐户资源*选择项目中使用的 Cloudflare 账户。
6. 可选配置 **TTL**。
7. 点击**继续以现实摘要**，确保 API 令牌摘要的内容为 **<账户> - D1\:编辑**。
    - 如果添加了 Workers 权限，则为 **<账户> - Workers 脚本\:编辑, D1\:编辑**。
8. 点击**创建令牌**。
9. **复制**并保存生成的令牌，也可根据提示测试令牌能否正常工作。

## 配置 Drizzle 环境变量

编辑 `.env`，填写以下内容：

| 变量 | 描述 |
| - | - |
| `CLOUDFLARE_ACCOUNT_ID`* | Cloudflare 账户 ID，可在*帐户主页*的用户名边的下拉选框中点击*复制账户 ID* |
| `CLOUDFLARE_DATABASE_ID`* | Cloudflare D1 数据库 ID |
| `CLOUDFLARE_API_TOKEN`* | Cloudflare 访问令牌 |

`*` 表示必要选项。

## 删除数据库

如果需要删除数据库，可以使用以下命令：

```sh
npx wrangler d1 delete <DATABASE_NAME>
```
