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

## 外観テーマ

`site.config.ts` の `theme` で外観を設定します。省略すると従来の ThoughtLite の外観を保ち、システムの明暗設定に従います。

```ts
theme: {
  preset: "catppuccin", // "thought-lite" | "catppuccin" | カスタムテーマ
  mode: "system",      // "system" | "light" | "dark"
  showToggle: true,
  colors: {
    light: { accent: "#40a02b", link: "#209fb5" },
    dark: { accent: "#a6e3a1", link: "#74c7ec" }
  },
  fonts: { body: "system-ui, sans-serif" },
  layout: { contentWidth: "1100px", lineHeight: 1.8 }
}
```

`thought-lite` は従来のモノクロ配色、`catppuccin` は Latte / Mocha を使用します。ページ、ヒートマップ、Markdown リンク、アラート、コードハイライトに適用されます。指定した項目だけを上書きし、ライト・ダークの設定は個別にマージします。

[Catppuccin 公式](https://github.com/catppuccin/palette) の4つのフレーバーを個別に用意し、公式の色値を維持しています。

| プリセット名 | フレーバー | 明暗 |
| --- | --- | --- |
| `catppuccin-latte` | Latte | ライト |
| `catppuccin-frappe` | Frappé | ダーク |
| `catppuccin-macchiato` | Macchiato | ダーク |
| `catppuccin-mocha` | Mocha | ダーク |

ライト・ダークの組み合わせを選択すると、ページとコードハイライトに同じフレーバーが適用されます。

```ts
theme: {
  preset: {
    light: "catppuccin-latte",
    dark: "catppuccin-frappe" // または catppuccin-macchiato / catppuccin-mocha
  },
  mode: "system"
}
```

`preset: "catppuccin"` は Latte / Mocha の省略形です。組み合わせは `defineTheme()` の `extends` にも指定できます。`mode` は初期の明暗設定を制御し、訪問者のボタンは選択したライト・ダーク間を切り替えます。

| 設定 | 用途 |
| --- | --- |
| `colors.light` / `colors.dark` | `primary` / `secondary` / `weak`：文字色、`background`：背景、`block`：ブロック、`shadow`：境界線、`selection`：選択範囲。 |
| 同上 | `accent`：最新コンテンツ見出し、`link`：Markdown リンク、`heatmap`：ヒートマップ、`success` / `info` / `warning` / `danger`：アラート、`codeBackground`：コード背景。 |
| `fonts` | `body` / `mono` / `display`：本文・等幅・プロローグのフォントスタック。フォントのダウンロードは行いません。標準では言語ごとの Noto Serif を維持します。追加の Web フォントは `astro.config.ts` に登録します。 |
| `layout` | `contentWidth` / `fontSize` / `mobileFontSize` は CSS の長さ、`lineHeight` は Markdown の行高を表す数値。 |
| `code` | `light` / `dark`：Astro が対応する Shiki テーマ名またはオブジェクト。変更後は再ビルドします。背景は `codeBackground` で設定します。 |
| `mode` | 初期の明暗設定。標準は `system`。 |
| `showToggle` | 明暗切替ボタンの表示。標準は `true`。非表示にしても保存済みの設定は削除しません。 |

訪問者の保存済み設定（`localStorage.theme` の `light` / `dark`）が優先されます。手動設定がない場合のみシステムの変更に追従します。ストレージが利用できなくても現在のページでは切替可能です。JavaScript 無効時はサイト設定とシステム設定を使用します。

プリセットやコードハイライトの設定を変更したら、開発サーバーを再起動し、デプロイ前に再ビルドしてください。

### テーマの作成と共有

`src/themes/my-theme.ts` を追加します。コアコンポーネントやプリセット登録表を変更する必要はありません。

```ts
import { defineTheme } from "../lib/theme";

export default defineTheme({
  name: "my-theme",
  extends: "catppuccin",
  colors: {
    light: { background: "#fffaf0", accent: "#8839ef" },
    dark: { background: "#181825", accent: "#cba6f7" }
  },
  layout: { contentWidth: "960px" }
});
```

`site.config.ts` で `myTheme` としてインポートし、`theme: { preset: myTheme }` を設定します。ファイルを共有するだけで再利用できます。`extends` には別のテーマオブジェクトも指定できます。テーマはビルド時に選択し、訪問者はライト・ダークのみ切り替えます。

この設定は共通のページスタイルを対象とします。ページ構造、著者カード、コンテンツ、ロゴ、favicon、OpenGraph 画像テンプレートは別途管理します。構造の追加はページ全体のコピーではなく、オプションのコンポーネントとして実装します。

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
