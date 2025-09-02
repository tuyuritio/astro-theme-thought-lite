---
title: Cloudflare Turnstile 設定ガイド
timestamp: 2025-07-26 00:00:00+00:00
tags: [Guide, Cloudflare, CAPTCHA]
description: 従来のCAPTCHAに代わるシームレスなセキュリティ検証ソリューション、Cloudflare Turnstile の迅速設定ガイド。
---

> 公式ドキュメント：[Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/get-started/)

## Turnstile サイトの作成

1. Cloudflare ダッシュボードの左側ナビゲーションバーで、[**Turnstile**](https://dash.cloudflare.com/?to=/:account/turnstile) を選択します。
2. **ウィジェットを追加** をクリックします。
3. **ウィジェット名** を入力し、**ホスト名の追加** します。
   - ローカル開発時は `localhost` を入力できます。
4. *ウィジェットモード* を **非表示** に設定します。
5. **作成** をクリックします。

## サイトキーの取得

Turnstile ウィジェットを作成した後、2つのキーが取得できます。これらを `.env` ファイルに追加してください。

| 変数 | 説明 |
| - | - |
| `CLOUDFLARE_TURNSTILE_SITE_KEY`* | Turnstile サイトキー、クライアントサイドでの Turnstile ウィジェット呼び出しに使用 |
| `CLOUDFLARE_TURNSTILE_SECRET_KEY`* | Turnstile シークレットキー、サーバーサイドでの検証に使用 |

`*` は必須オプションを示します。
