---
title: サイト設定ガイド
timestamp: 2025-07-07 00:00:00+00:00
tags: [Guide, Astro]
description: Astro テーマサイトの基本設定説明、サイト設定、国際化、Markdown処理などのコア設定項目をカバー。
---

## `.env`

1. コマンドを実行して `.env` ファイルを作成します：
    ```sh
    cp .env.example .env
    ```
2. 変数を修正または追加します：
    | 変数 | 説明 |
    | - | - |
    | `PUBLIC_TIMEZONE`* | デフォルト表示タイムゾーン、[タイムゾーンリスト](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List)を参照 |

    `*` は必須オプションを示します。

## `astro.config.ts`

- `site` - サイト URL
- `i18n`
    - `locales` - サポートされている言語のリスト
    - `defaultLocale` - デフォルト言語
- `markdown`
    - `remarkPlugins` - Markdown 処理プラグイン
    - `rehypePlugins` - HTML 処理プラグイン

## `site.config.json`

- `title` - サイトタイトル
- `prologue` - ホームページのタグライン、`\n` 改行をサポート
- `author`
    - **string** - 著者名
    - **object**
        - `name` - 著者名
        - `email` - 著者メールアドレス
        - `link` - 著者の個人ウェブサイト
- `description` - サイトの説明
- `copyright` - 著作権情報
    - `type` - CC ライセンスタイプ
    - `year` - 著作権年または年範囲
- `feed` - フィード
    - `section` - フィードコンテンツセクション
        - **`*`** - すべてのセクション
        - **array**
            - `note` - 文記セクション
            - `jotting` - 随筆セクション
    - `limit` - フィードの返すコンテンツ数量制限

## アイコン生成

[RealFaviconGenerator](https://realfavicongenerator.net/) を使用してアイコンを生成し、ダウンロードして解凍したすべてのコンテンツを `/public` ディレクトリに上書きすることをお勧めします。

生成されるファイルリストは以下の通りです：

- `apple-touch-icon.png`
- `favicon-96x96.png`
- `favicon.ico`
- `favicon.svg`
- `site.webmanifest`
- `web-app-manifest-192x192.png`
- `web-app-manifest-512x512.png`

`<head>` 内のコンテンツは RealFaviconGenerator のプロンプトに従って適応されており、必要に応じて変更することもできます。

修正と展開が完了した後、[Favicon checker](https://realfavicongenerator.net/favicon-checker) を使用して検証できます。

### ホームページロゴ

参照位置は `src/pages/[...locale]/index.astro` にあり、デフォルトでは `astro-icon` ライブラリによってインポートされる SVG 形式のアイコンを使用します。

```astro
<Icon name="site-logo" size={100} is:inline />
```

以下の3つの方法で設定できます：

1. SVG ファイルで `src/icons/site-logo.svg` を置き換えると、[自動的に読み取られ](https://www.astroicon.dev/guides/customization/#local-icons)適用されます。
    - テーマカラーの変化に適応するため、`stroke="currentColor"` の使用をお勧めします。
2. [Iconify アイコンセット](https://www.astroicon.dev/guides/customization/#open-source-icon-sets)を使用し、`<PREFIX>:<ICON>` 形式で参照します。
3. 画像インポートに直接修正するか、この部分のコンテンツを削除します。

## 国際化（i18n）設定

テーマは多言語切り替えをサポートしており、デフォルト言語は**英語（`en`）**です。

デフォルト言語を変更する必要がある場合は、`i18n.defaultLocale` を修正してください。値は `i18n.locales` から選択する必要があります。

新しい言語を追加するには、`src/i18n` ディレクトリに対応する翻訳ファイルを作成し、`astro.config.ts` の `i18n.locales` にその言語を追加してください。

その後、`src/i18n/index.ts` ファイルを修正します：

```ts
// 新しい言語の翻訳ファイルをインポート
import zhCN from "./zh-cn.yaml";

// 新しい言語をロケールマッピングリストに追加
const translations = { 
  ...,
  "zh-cn": zhCN
};
```
