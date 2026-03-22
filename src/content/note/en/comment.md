---
title: Comment System Configuration Guide
timestamp: 2026-03-23 00:00:00+00:00
series: Comment
tags: [Guide, Cloudflare, Database]
description: A complete guide to setting up Cloudflare D1 database from scratch, including database creation, connection setup, and data migration.
toc: true
---

The theme's built-in comment system is built on Astro Actions and Cloudflare D1. For some configuration details, please refer to the [Site Configuration Guide](/note/configuration).

## Create Cloudflare D1 Database

Run the `pnpm wrangler d1 create <DATABASE_NAME>` command to create a [Cloudflare D1](https://developers.cloudflare.com/d1/get-started/) instance. The output will be:

```toml
✅ Successfully created DB '<DATABASE_NAME>' in region <REGION>
Created your new D1 database.

[[d1_databases]]
binding = "DB"
database_name = "<DATABASE_NAME>"
database_id = "<DATABASE_ID>"
```

> [!Tip]
> If you need to delete a database, you can use the command `pnpm wrangler d1 delete <DATABASE_NAME>`.

## Local Environment Configuration

Run the following commands to create the configuration files:

```sh
cp .env.example .env
cp wrangler.example.toml wrangler.toml
```

Generate a 16-byte Base64 key `PASS_KEY` for token generation using the following command and add it to your `.env`:

```sh
# OpenSSL
openssl rand -base64 16

# Node.js
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
```

In `wrangler.toml`, fill in `PROJECT_NAME`, which will be used as the project name for Cloudflare Workers, along with the `DATABASE_NAME` and `DATABASE_ID` generated in the previous step.

The `AUTHOR_ID` in `.env` is used to identify the site author and can be found in the [Cloudflare D1 dashboard](https://dash.cloudflare.com/?to=/:account/workers/d1).

## Guest Comment Configuration

To prevent automated comment spamming, guest comments are disabled by default. Enabling them requires human verification.

The theme uses [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/get-started/) to provide a secure and seamless verification process. Please follow these steps to configure:

1. Select [**Turnstile**](https://dash.cloudflare.com/?to=/:account/turnstile) from the left navigation bar in the Cloudflare dashboard.
2. Click **Add Widget**.
3. Enter a **Widget name** and **add Hostnames**.
   - For local development, you can enter `localhost`.
4. Select *Widget mode* as **Invisible**.
5. Click **Create**.

Once created, you will receive two keys to add to your `.env`:

- `CLOUDFLARE_TURNSTILE_SITE_KEY` - Site key.
- `CLOUDFLARE_TURNSTILE_SECRET_KEY` - Secret key.
