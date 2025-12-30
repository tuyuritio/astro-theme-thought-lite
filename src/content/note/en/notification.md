---
title: Notification Configuration
timestamp: 2025-12-30 00:00:00+00:00
---

To notify comment replies instantly, the theme provides two methods: **Web Push** and **Email**.

## Web Push

Web Push notifications support reaching users in real-time via system-level alerts even when the webpage is closed.

### Prerequisites

The service is based on the [VAPID (Voluntary Application Server Identification)](https://datatracker.ietf.org/doc/html/rfc8292) protocol.

According to the protocol requirements, a valid contact method must be provided when sending pushes. Please ensure that `author.email` in `site.config.ts` is correctly configured.

### Key Configuration

Run the `pnpx web-push generate-vapid-keys` command, which will generate a pair of keys in the following format:

```txt
=======================================

Public Key:
<public-key>

Private Key:
<private-key>

=======================================
```

Add the public and private keys to `.env`.

| Variable | Description |
| - | - |
| `VAPID_PUBLIC_KEY`* | VAPID Public Key |
| `VAPID_PRIVATE_KEY`* | VAPID Private Key |

`*` Indicates a required option.

> [!TIP]
> To enable Web Push, both the public and private keys must be configured. Missing either key will cause the service to remain **disabled** by default.

## Email

> [!NOTE]
> Since SMTP ([cloudflare\:sockets](https://developers.cloudflare.com/workers/runtime-apis/tcp-sockets/)) and Email Workers ([cloudflare\:email](https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/)) in the Cloudflare Workers environment rely on their **built-in native modules**, these modules currently cannot be simulated in the Astro local development environment.
> 
> To ensure consistency between development and production environments, the theme uses a RESTful API approach to implement email sending functionality.

The theme provides a generic email sending interface that supports multiple service providers.

### Basic Configuration

Add the basic variables required to enable email sending in `.env`:

| Variable | Description |
| - | - |
| `EMAIL_FROM`* | Sender address |
| `EMAIL_REPLY_TO` | Reply-to address; no special requirements, any valid address will do |

`*` Indicates a required option.

> [!TIP]
> If `EMAIL_FROM` is not configured, the email sending function will remain **disabled**.

### Provider Configuration

#### Resend

After configuring the following variable in `.env`, the system will use Resend to send emails:

| Variable | Description |
| - | - |
| `RESEND_API_KEY`* | Resend API Key |

`*` Indicates a required option.

#### Mock (Local Development)

If no email service provider configuration is detected, the system will fall back to **Mock**.

Email content will be output directly to the console and will not actually be sent.

### Extending Providers

Implement the `EmailProvider` interface to add new email service providers.

#### 1. Create Provider File

Create a file in the `src/utils/email/providers/` directory (e.g., `postmark.ts`) and implement the `send` method:

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

#### 2. Register Provider

Modify the `src/utils/email/index.ts` file to select your new provider based on environment variables:

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
