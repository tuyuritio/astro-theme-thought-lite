---
title: 国際化設定ガイド
timestamp: 2025-11-07 00:00:00+00:00
tags: [Guide, Astro]
description: テーマの多言語サポートの設定方法の詳細ガイド、デフォルト言語の変更、新しい言語の追加、翻訳ファイルの管理、コンテンツディレクトリ構造の設定を含む。
---

テーマには多言語サポートが組み込まれており、デフォルト言語は**英語（`en`）**です。

## デフォルト言語の変更

`site.config.ts` で `i18n.defaultLocale` を修正します：

```ts
export default siteConfig({
    i18n: {
        locales: ["en", "zh-cn", "ja"],
        // デフォルト言語を日本語に変更
        defaultLocale: "ja"
    },
});
```

## 新しい言語の追加

`src/i18n/` ディレクトリに新しい **YAML** 翻訳ファイルを作成します。例えば `tlh/index.yaml`（クリンゴン語）。

`i18n` ディレクトリ内の既存の翻訳ファイルの形式を参考にして翻訳内容を追加します：

```yaml
# src/i18n/tlh/index.yaml

# 注意：現在の言語の表示名として `language` フィールドを追加します
language: tlhIngan Hol
...
```

`src/i18n/index.ts` を修正して、新しい言語をインポートして登録します：

```ts
import tlh from "./tlh/index.yaml";
import tlhScript from "./tlh/script.yaml";

const translations = {
  en: {
    ...en,
    script: enScript
  },
  "zh-cn": {
    ...zhCN,
    script: zhCNScript
  },
  ja: {
    ...ja,
    script: jaScript
  },
  tlh: {
    ...tlh,
    script: tlhScript
  }
};
```

新しい言語に特定のフォントが必要な場合は、`src/layouts/App.astro` の `notoFonts` オブジェクトにフォントマッピングを追加できます：

```ts
const notoFonts: Record<string, string> = {
    "zh-cn": "Noto+Serif+SC",
    ja: "Noto+Serif+JP",
    tlh: "Noto+Serif+..."
};
```

`site.config.ts` で新しい言語を `i18n.locales` 配列に追加します：

```ts
export default siteConfig({
    i18n: {
        locales: ["en", "zh-cn", "ja", "tlh"],
        defaultLocale: "en"
    },
});
```

各コンテンツセクションの下に対応する言語ディレクトリを作成します：

```
content/
├── note/tlh/
├── jotting/tlh/
├── information/tlh/
└── preface/tlh/
```

## 単一言語モード

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

言語サブディレクトリを削除し、セクションディレクトリの直下にコンテンツファイルを作成します。

**多言語ディレクトリ構造：**

```
content/
├── note/
│   ├── en/
│   │   ├── common.md
│   │   └── image-preview/
│   │      ├── index.md
│   │      └── photo.png
│   ├── ja/
│   │   ├── common.md
│   │   ├── image-preview/
│   │   │   ├── index.md
│   │   │   └── photo.png
│   │   └── special.md
│   └── zh-cn/
│       ├── common.md
│       └── image-preview/
│           ├── index.md
│           └── photo.png
├── jotting/
│     ├── en/
│     ├── ja/
│     │   ├── normal.md
│     │   └── ...
│     └── zh-cn/
└── ...
```

**単一言語ディレクトリ構造：**

```
content/
├── note/
│   ├── common.md
│   ├── image-preview/
│   │   ├── index.md
│   │   └── photo.png
│   └── special.md
├── jotting/
│   ├── normal.md
│   └── ...
└── ...
```

> [!Tip]
> - 単一言語モードでは、言語スイッチャーは自動的に非表示になります
> - 作成済みの他の言語翻訳ファイルは保持でき、動作には影響しません
