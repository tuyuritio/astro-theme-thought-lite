---
title: サイト設定ガイド
timestamp: 2026-03-21 00:00:00+00:00
series: Guide
tags: [Configuration, Astro]
description: テーマの基本設定説明、サイト情報、表示効果、アイコン生成などのコア設定項目をカバー。
toc: true
---

## 設定リファレンス

テーマのカスタム設定はルートディレクトリの `site.config.ts` ファイルにあります。以下は各設定項目の詳細説明です：

| 設定項目 | 型 | 説明 |
|:- |:- |:- |
| `title` | `string` | サイトのタイトル。 |
| `prologue` | `string` | ホームページのキャッチコピー；`\n` での改行をサポート。 |
| `author.name` | `string` | 著者名。 |
| `author.email` | `string` | 著者のメールアドレス。 |
| `author.link` | `string` | 著者の個人ホームページのリンク。 |
| `description` | `string` | サイトの説明。 |
| `copyright.type` | `CCLicenseType` | [クリエイティブ・コモンズ 4.0](https://creativecommons.org/chooser/) ライセンスタイプ。 |
| `copyright.year` | `string` | 著作権年または年範囲。 |
| `timezone` | `string` | サイトの表示タイムゾーン、[タイムゾーンリスト](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List)を参照。 |
| `i18n` | `object` | 詳細は[国際化設定ガイド](internationalization)を参照。 |
| `pagination` | `Record<Section, number>` | 各セクションの1ページあたりの表示件数。 |
| `heatmap` | `Heatmap` | ヒートマップの表示設定。 |
| `feed.section` | `"*" \| Section[]` | フィードに含まれるコンテンツセクション；`*` はすべてを示します。 |
| `feed.limit` | `number` | フィードに表示される最大アイテム数。 |
| `latest` | `"*" \| Section[]` | ホームページの「最新記事」に表示されるセクション；`*` はすべてを示します。 |

### 型の説明

#### `CCLicenseType`

- `"CC0 1.0"`
- `"CC BY 4.0"`
- `"CC BY-SA 4.0"`
- `"CC BY-NC 4.0"`
- `"CC BY-NC-SA 4.0"`
- `"CC BY-ND 4.0"`
- `"CC BY-NC-ND 4.0"`

#### `Section`

- `"note"`
- `"jotting"`

#### `Heatmap`

| `unit` | `weeks` | `years` |
|:- | - | - |
| `day` | 表示する総週数 | × |
| `week` | *51週の固定表示* | × |
| `month` | × | 表示する総年数 |

## アイコン生成

[RealFaviconGenerator](https://realfavicongenerator.net/) を使用してアイコンを生成し、ダウンロードして解凍した以下のファイルを `/public` ディレクトリに上書きすることをお勧めします：

- `favicon-96x96.png`
- `favicon.ico`
- `favicon.svg`

### ホームページロゴ

参照位置は `src/pages/[...locale]/index.astro` にあり、`import Logo from "$icons/site-logo.svg"` 文でインポートします。

```astro
<Logo width={100} />
```

以下の方法で設定できます：

1. SVG ファイルで `src/icons/site-logo.svg` を置き換えます。
    - ライト/ダークテーマの変化に適応するため、`stroke="currentColor"` の使用をお勧めします。
2. 画像インポートに変更します。
3. この部分のコンテンツを直接置き換えるか削除します。
