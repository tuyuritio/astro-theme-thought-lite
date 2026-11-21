---
title: GitHub Actions Configuration Guide
timestamp: 2025-07-21 00:00:00+00:00
tags: [Guide, GitHub]
description: Configure GitHub Actions for automatic deployment to Cloudflare Workers, including required environment variables and secrets setup.
---

> [!TIP]
> The theme enables GitHub Actions automatic deployment to Cloudflare Workers by default.\
> To disable, simply delete the `.github/workflows/deploy.yaml` file.

## Request API Token

1. In the Cloudflare dashboard, click the profile icon in the top right corner and select **My Profile**.
2. Under the **API Tokens** tab, click **Get started** in the *Create Custom Token* row.
3. Enter a **Token name**.
4. Select *Permissions*:
    - [**Account**] [**D1**] [**Edit**]
    - [**Account**] [**Workers Scripts**] [**Edit**]
5. Select the Cloudflare account used in the project for *Account Resources*.
6. Optionally configure **TTL**.
7. Click **Continue to summary** and ensure the API token summary says **<Account> - Workers Scripts: Edit, D1: Edit**.
8. Click **Create Token**.
9. **Copy** and save the generated token.

## Configure Repository Secrets

In your GitHub repository's *Settings > Secrets and variables > Actions*, add the following Repository secrets:

- `ENV`: All contents from the `.env` file
- `CLOUDFLARE_PROJECT_NAME`: Project name
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account ID
- `CLOUDFLARE_API_TOKEN`: Cloudflare API Token
- `CLOUDFLARE_DATABASE_NAME`: D1 database name
- `CLOUDFLARE_DATABASE_ID`: D1 database ID
