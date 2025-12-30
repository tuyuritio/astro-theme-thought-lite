---
title: 通知配置
timestamp: 2025-12-30 00:00:00+00:00
---

为即时通知评论回复，主题提供 **Web Push** 及**电子邮件**两种方式。

## Web Push

Web Push 通知，即**网页推送**，支持在网页关闭状态下，通过系统级提醒实时触达用户。

### 前置要求

服务基于 [VAPID (Voluntary Application Server Identification)](https://datatracker.ietf.org/doc/html/rfc8292) 协议。

根据协议要求，发送推送时需提供有效的联系方式，请确保 `site.config.ts` 中的 `author.email` 已正确配置。

### 密钥配置

运行 `pnpx web-push generate-vapid-keys` 命令，将生成如下形式的一对密钥：

```txt
=======================================

Public Key:
<public-key>

Private Key:
<private-key>

=======================================
```

将公钥与私钥添加在 `.env` 中。

| 变量 | 描述 |
| - | - |
| `VAPID_PUBLIC_KEY`* | VAPID 公钥 |
| `VAPID_PRIVATE_KEY`* | VAPID 私钥 |

`*` 表示必要选项。

> [!TIP]
> 启用 Web Push 必须同时配置公钥与私钥，任一密钥缺失将使该服务默认保持**禁用**状态。

## 电子邮件

> [!NOTE]
> 由于 Cloudflare Workers 环境下的 SMTP（[cloudflare\:sockets](https://developers.cloudflare.com/workers/runtime-apis/tcp-sockets/)）及 Email Workers（[cloudflare\:email](https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/)）依赖其**内置原生模块**，这些模块目前无法在 Astro 本地开发环境中模拟运行。
> 
> 为了确保开发与生产环境的一致性，主题采用 RESTful API 方式实现邮件发送功能。

主题提供一个通用的邮件发送接口，支持多种服务提供商。

### 基础配置

在 `.env` 中添加启用邮件发送所需的基础变量：

| 变量 | 描述 |
| - | - |
| `EMAIL_FROM`* | 发件人地址 |
| `EMAIL_REPLY_TO` | 回复地址；无特殊要求，任意即可 |

`*` 表示必要选项。

> [!TIP]
> 若 `EMAIL_FROM` 未配置，邮件发送功能将保持**禁用**状态。

### 提供商配置

#### Resend

在 `.env` 中配置以下变量后，系统将使用 Resend 发送邮件：

| 变量 | 描述 |
| - | - |
| `RESEND_API_KEY`* | Resend API 密钥 |

`*` 表示必要选项。

#### Mock (本地开发)

如未检测到任何邮件服务提供商的配置，系统将回退到 **Mock**。

邮件内容将直接输出到控制台，不会实际发送。

### 扩展提供商

实现 `EmailProvider` 接口以添加新的邮件服务提供商。

#### 1. 创建提供商文件

在 `src/utils/email/providers/` 目录下创建文件（如 `postmark.ts`），并实现 `send` 方法：

```typescript
// src/utils/email/providers/postmark.ts
export class Postmark implements EmailProvider {
    name = "Postmark";

	constructor(
		private serverToken: string = "POSTMARK_API_TEST",
		private unsubscribeURL?: string | URL
	) {}

    async send(payload: EmailPayload): Promise<void> {
        await fetch("https://api.postmarkapp.com/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Postmark-Server-Token": this.serverToken,
            },
            body: JSON.stringify({
                From: payload.from,
                To: payload.to,
                ReplyTo: payload.replyTo,
                Subject: payload.subject,
                HtmlBody: payload.html,
                TextBody: payload.text,
                Headers: this.unsubscribeURL
					? [
							{
								Name: "List-Unsubscribe",
								Value: `<${this.unsubscribeURL}>`
							},
							{
								Name: "List-Unsubscribe-Post",
								Value: "List-Unsubscribe=One-Click"
							}
						]
					: null
            })
        });
    }
}
```

#### 2. 注册提供商

修改 `src/utils/email/index.ts` 文件，根据环境变量选择你的新提供商：

```typescript
import { Postmark } from "./providers/postmark";

export async function send(payload: EmailPayload, unsubscribeURL?: string | URL) {
    if (env.POSTMARK_SERVER_TOKEN) {
        await new Postmark(env.POSTMARK_SERVER_TOKEN).send(payload);
    } else if (env.RESEND_API_KEY) {
        // ...
    }
}
```
