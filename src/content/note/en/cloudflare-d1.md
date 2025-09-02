---
title: Cloudflare D1 Configuration Guide
timestamp: 2025-07-07 00:00:00+00:00
tags: [Guide, Cloudflare, Database]
description: Complete walkthrough for setting up Cloudflare D1 database from scratch, including database creation, connection setup, and data migration.
---

> Official Documentation: [Cloudflare D1](https://developers.cloudflare.com/d1/get-started/)\
> Drizzle Documentation: [Cloudflare D1 HTTP API with Drizzle Kit](https://orm.drizzle.team/docs/guides/d1-http-with-drizzle-kit)

## Create Cloudflare D1 Database

Run the command `npx wrangler d1 create <DATABASE_NAME>`, which will output:

```toml
✅ Successfully created DB '<DATABASE_NAME>' in region <REGION>
Created your new D1 database.

[[d1_databases]]
binding = "DB"
database_name = "<DATABASE_NAME>"
database_id = "<DATABASE_ID>"
```

## Bind Database

Create `wrangler.toml` file:

```sh
cp wrangler.example.toml wrangler.toml
```

Fill in `PROJECT_NAME`, which will be used as the Cloudflare Workers project name.

Fill in the `DATABASE_NAME` and `DATABASE_ID` generated in the previous step into `wrangler.toml`.

## Apply for Edit Token

1. In the Cloudflare dashboard, click on the avatar in the upper right corner and select **Profile**.
2. Under the **API Tokens** tab, click **Get Started** in the *Create Custom Token* section.
3. Fill in the **Token Name**.
4. For *Permissions*, select [**Account**] [**D1**] [**Edit**].
    - If you need automated deployment via GitHub Actions, add [**Account**] [**Workers Scripts**] [**Edit**] permission.
5. For *Account Resources*, select the Cloudflare account used in the project.
6. Optionally configure **TTL**.
7. Click **Continue to Summary** and ensure the API token summary content is **<Account> - D1\:Edit**.
    - If Workers permission is added, it will be **<Account> - Workers Scripts\:Edit, D1\:Edit**.
8. Click **Create Token**.
9. **Copy** and save the generated token, or test if the token works normally as prompted.

## Configure Drizzle Environment Variables

Edit `.env` and fill in the following:

| Variable | Description |
| - | - |
| `CLOUDFLARE_ACCOUNT_ID`* | Cloudflare account ID, can be found in the *Account Homepage* by clicking *Copy Account ID* in the dropdown next to the username |
| `CLOUDFLARE_DATABASE_ID`* | Cloudflare D1 database ID |
| `CLOUDFLARE_API_TOKEN`* | Cloudflare access token |

`*` indicates required options.

## Delete Database

If you need to delete the database, you can use the following command:

```sh
npx wrangler d1 delete <DATABASE_NAME>
```
