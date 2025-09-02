---
title: Cloudflare Turnstile 配置指南
timestamp: 2025-07-26 00:00:00+00:00
tags: [Guide, Cloudflare, CAPTCHA]
description: 快速配置 Cloudflare Turnstile 验证码服务，提供无感知的安全验证方案替代传统 CAPTCHA。
---

> 官方文档：[Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/get-started/)

## 创建 Turnstile 站点

1. 在 Cloudflare 仪表盘中的左侧导航栏中，选择 [**Turnstile**](https://dash.cloudflare.com/?to=/:account/turnstile)。
2. 点击**添加小组件**。
3. 输入**小组件名称**并**添加主机名**。
   - 本地开发时可输入 `localhost`。
4. 选择*小组件模式*为**不可见**。
5. 点击**创建**。

## 获取站点密钥

创建 Turnstile 小组件后，将获得两个密钥，将其添加在 `.env` 中。

| 变量 | 描述 |
| - | - |
| `CLOUDFLARE_TURNSTILE_SITE_KEY`* | Turnstile 站点密钥，用于客户端调用 Turnstile 小组件 |
| `CLOUDFLARE_TURNSTILE_SECRET_KEY`* | Turnstile 密钥，用于服务器端验证 |

`*` 表示必要选项。
