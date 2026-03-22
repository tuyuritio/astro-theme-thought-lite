---
title: 国際化設定ガイド
timestamp: 2026-03-21 00:00:00+00:00
series: Guide
tags: [Configuration, Astro]
description: テーマの多言語サポートの設定方法の詳細ガイド、デフォルト言語の変更、新しい言語の追加、翻訳ファイルの管理、コンテンツディレクトリ構造の設定を含む。
toc: true
---

テーマには多言語サポートが組み込まれており、デフォルト言語は**英語（`en`）**です。

国際化のコア設定は `site.config.ts` の `i18n` フィールドにあり、ここで有効にする言語リストとデフォルト言語を指定します：

```ts
export default siteConfig({
  i18n: {
    // 配列の順序は言語ピッカーでの表示順序を決定します
    locales: ["en", "zh-cn", "ja"],
    // デフォルト言語は `locales` の値である必要があります
    defaultLocale: "ja"
  },
});
```

## 単一言語モード

単一の言語のみでサイトを構築する場合は、以下の手順でファイル構造を簡素化し、制作フローを最適化できます。

> [!Warning]
> `i18n` 設定フィールドを直接削除しないでください。テーマが正常に動作しなくなります！

`site.config.ts` の `i18n.locales` で必要な言語のみを保持し、他の項目を削除します：

```ts
export default siteConfig({
  i18n: {
    locales: ["ja"],
    defaultLocale: "ja"
  },
});
```

### コンテンツディレクトリの調整

単一言語モードでは、言語サブディレクトリは不要になります。コンテンツファイルを対応するセクションディレクトリに直接配置できます。

以下は「文記」セクションのディレクトリ構造の比較例です：

**多言語モードでは、セクションの下に言語ディレクトリで区切る必要があります：**

```
content/
└── note/
    ├── en/
    │   └── post.md
    ├── ja/
    │   └── post.md
    └── zh-cn/
        └── post.md
```

**単一言語ディレクトリ構造では、言語階層を省いてファイルを直接保存します：**

```
content/
└── note/
    └── post.md
```

> [!Tip]
> - 単一言語モードでは、言語切り替え機能が自動的に非表示になります。
> - 作成済みの他の言語の翻訳ファイルは保持できます。動作に影響はありません。

## 新しい言語の追加

プリセットされていない言語を追加するには、以下の手順で設定してください（クリンゴン語 `tlh` を例にします）：

### 1. 新しい言語の登録

`site.config.ts` の `i18n.locales` 配列に新しい言語を追加します：

```ts
export default siteConfig({
  i18n: {
    locales: ["en", "zh-cn", "ja", "tlh"],
    defaultLocale: "en"
  },
});
```

### 2. 翻訳ファイルの作成

`src/i18n/` ディレクトリに対応する **YAML** 翻訳ファイルを作成します。`i18n` ディレクトリ内の既存の翻訳ファイルの形式を参考にしてください：

```yaml
# src/i18n/tlh/index.yaml

# 注意：現在の言語の表示名として `language` フィールドを追加します
language: tlhIngan Hol
...
```

`src/i18n/index.ts` で新しい翻訳ファイルをインポートします：

```ts
import tlh from "./tlh/index.yaml";
import tlhScript from "./tlh/script.yaml";

const translations = {
  ...,
  tlh: {
    ...tlh,
    script: tlhScript
  }
};
```

### 3. コンテンツ言語サブディレクトリの作成

各コンテンツセクションの下に対応する言語ディレクトリを作成します：

```
content/
├── note/tlh/
├── jotting/tlh/
├── information/tlh/
└── preface/tlh/
```

### 4. フォントの追加

新しい言語に特定のフォントが必要な場合は、`astro.config.ts` の `experimental.fonts` に新しいフォントを登録してください：

```ts
{
  name: "Noto Serif TLH",
  provider: SpecificFontProvider(),
  weights: [400, 700],
  fallbacks: ["serif"],
  cssVariable: "--font-noto-serif-tlh"
}
```

そして、`src/layouts/App.astro` でフォントのマッピングを追加します：

```ts
// src/layouts/App.astro
const mainFonts: Record<string, CssVariable> = {
  ...,
  tlh: "--font-noto-serif-tlh"
};
```

その言語の Open Graph 画像生成をサポートする必要がある場合は、`src/graph/index.ts` にフォントファイルのリンクを追加してください：

```ts
// Locale-specific font URLs
const fonts: Record<string, string> = {
  ...,
  tlh: "https://....otf"
};
```
