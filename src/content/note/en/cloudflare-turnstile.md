---
title: Cloudflare Turnstile Configuration Guide
timestamp: 2025-07-26 00:00:00+00:00
tags: [Guide, Cloudflare, CAPTCHA]
description: Quick setup guide for Cloudflare Turnstile CAPTCHA service, providing seamless security verification as an alternative to traditional CAPTCHA.
---

> Official Documentation: [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/get-started/)

## Create Turnstile Site

1. In the Cloudflare dashboard sidebar, select [**Turnstile**](https://dash.cloudflare.com/?to=/:account/turnstile).
2. Click **Add widget**.
3. Enter a **Widget name** and **Add Hostnames**.
   - For local development, you can enter `localhost`.
4. Set the *Widget Mode* to **Invisible**.
5. Click **Create**.

## Get Site Keys

After creating the Turnstile widget, you will obtain two keys. Add them to your `.env` file.

| Variable | Description |
| - | - |
| `CLOUDFLARE_TURNSTILE_SITE_KEY`* | Turnstile site key, used for client-side Turnstile widget calls |
| `CLOUDFLARE_TURNSTILE_SECRET_KEY`* | Turnstile secret key, used for server-side verification |

`*` indicates required options.
