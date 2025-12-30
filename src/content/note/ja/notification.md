---
title: 通知設定
timestamp: 2025-12-30 00:00:00+00:00
---

コメントの返信を即座に通知するために、テーマは **Web Push** と **電子書簡** の2つの方法を提供します。

## Web Push

Web Push 通知（**ウェブプッシュ**）は、Webページが閉じている状態でも、システムレベルのアラートを通じてユーザーにリアルタイムで通知することをサポートします。

### 前提条件

サービスは [VAPID (Voluntary Application Server Identification)](https://datatracker.ietf.org/doc/html/rfc8292) プロトコルに基づいています。

プロトコルの要件に従い、プッシュ送信時には有効な連絡先を提供する必要があります。`site.config.ts` の `author.email` が正しく設定されていることを確認してください。

### キー設定

`pnpx web-push generate-vapid-keys` コマンドを実行すると、以下のような形式のキーペアが生成されます：

```txt
=======================================

Public Key:
<public-key>

Private Key:
<private-key>

=======================================
```

公開鍵と秘密鍵を `.env` に追加します。

| 変数 | 説明 |
| - | - |
| `VAPID_PUBLIC_KEY`* | VAPID 公開鍵 |
| `VAPID_PRIVATE_KEY`* | VAPID 秘密鍵 |

`*` は必須項目を示します。

> [!TIP]
> Web Push を有効にするには、公開鍵と秘密鍵の両方を設定する必要があります。いずれかのキーが欠落している場合、サービスはデフォルトで**無効**のままになります。

## 電子書簡

> [!NOTE]
> Cloudflare Workers 環境下の SMTP（[cloudflare\:sockets](https://developers.cloudflare.com/workers/runtime-apis/tcp-sockets/)）および Email Workers（[cloudflare\:email](https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/)）は**組み込みのネイティブモジュール**に依存しているため、これらのモジュールは現在 Astro のローカル開発環境ではシミュレートできません。
> 
> 開発環境と本番環境の一貫性を確保するため、テーマは RESTful API 方式を採用して電書送信機能を実装しています。

テーマは、複数のサービスプロバイダーをサポートする汎用的な電書送信インターフェースを提供します。

### 基本設定

電書送信を有効にするために必要な基本変数を `.env` に追加します：

| 変数 | 説明 |
| - | - |
| `EMAIL_FROM`* | 送信元アドレス |
| `EMAIL_REPLY_TO` | 返信先アドレス；特別な要件はなく、任意のアドレスで構いません |

`*` は必須項目を示します。

> [!TIP]
> `EMAIL_FROM` が設定されていない場合、電書送信機能は**無効**のままになります。

### プロバイダー設定

#### Resend

`.env` に以下の変数を設定すると、システムは Resend を使用して電書を送信します：

| 変数 | 説明 |
| - | - |
| `RESEND_API_KEY`* | Resend API キー |

`*` は必須項目を示します。

#### Mock (ローカル開発)

電書サービスプロバイダーの設定が検出されない場合、システムは **Mock** にフォールバックします。

電書の内容はコンソールに直接出力され、実際には送信されません。

### プロバイダーの拡張

`EmailProvider` インターフェースを実装して、新しい電書サービスプロバイダーを追加します。

#### 1. プロバイダーファイルの作成

`src/utils/email/providers/` ディレクトリにファイル（例：`postmark.ts`）を作成し、`send` メソッドを実装します：

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

#### 2. プロバイダーの登録

`src/utils/email/index.ts` ファイルを変更し、環境変数に基づいて新しいプロバイダーを選択するようにします：

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
