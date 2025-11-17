---
title: 連結コンポーネント使用ガイド
timestamp: 2025-11-17 00:00:00+00:00
tags: [Guide, MDX]
toc: true
---

テーマは**リンク集**セクションのために `Linkroll` コンポーネントを提供し、友人リンクやおすすめサイトをより美しく柔軟に表示できます。

## コンポーネントのインポート

> [!Note]
> `Linkroll` コンポーネントは `mdx` ファイルで使用する必要があります。

```mdx
import Linkroll from "$components/Linkroll.astro";

<Linkroll locale={props.locale} links={links} />
```

- `locale` - 現在のページの言語コード、`about.astro` によって[**コンポーネントプロパティ**](https://mdxjs.com/docs/using-mdx/#props)として提供されます；
- `links` - リンクデータの配列、[後続のステップ](#リンクデータの定義)を参照してください。

## リンクデータの定義

```mdx
export const links = [
    {
        title: "サンプルサイト",
        url: "https://example.com",
        image: "https://example.com/favicon.ico",
        description: "これはサンプルサイトです",
        type: "resources"
    }
];
```

各リンクオブジェクトには以下のフィールドが含まれます：

- `title`*: 表示タイトル
- `url`*: ターゲットアドレス
- `type`*: カテゴリタイプ、選択肢は以下の通り：
  - `resources` - ツールとリソース
  - `community` - 組織とプロジェクト
  - `insights` - メディアとインスピレーション
  - `technology` - 技術と開発
  - `expertise` - 専門と学術
  - `creative` - デザインとクリエイティブ
  - `lifestyle` - ライフスタイルと趣味
  - `general` - 総合とその他
- `image`: ターゲットサイトのアイコンURL
- `description`: 説明文

`*` は必須項目を示します。
