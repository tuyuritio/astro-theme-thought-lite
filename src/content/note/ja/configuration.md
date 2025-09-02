---
title: サイト設定ガイド
timestamp: 2025-07-07 00:00:00+00:00
tags: [Guide, Astro]
description: Astro テーマサイトの基本設定説明、サイト設定、国際化、Markdown処理などのコア設定項目をカバー。
---

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

## 国際化（i18n）設定

テーマは多言語切り替えをサポートしており、デフォルト言語は**英語（`en`）**です。

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
