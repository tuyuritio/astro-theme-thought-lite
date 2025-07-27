---
title: GitHub Actions Configuration Guide
timestamp: 2025-07-21 00:00:00+00:00
tags: [Guide, GitHub]
---

> [!TIP]
> The theme enables GitHub Actions automatic deployment to Cloudflare Workers by default.\
> To disable, simply delete the `.github/workflows/deploy.yaml` file.

In your GitHub repository's *Settings > Secrets and variables > Actions*, add the following Repository secrets:

- `ENV`: All contents from the `.env` file
- `CLOUDFLARE_PROJECT_NAME`: Project name
- `CLOUDFLARE_ACCOUNT_ID`: CloudFlare account ID
- `CLOUDFLARE_API_TOKEN`: CloudFlare API Token
- `CLOUDFLARE_DATABASE_NAME`: D1 database name
- `CLOUDFLARE_DATABASE_ID`: D1 database ID
