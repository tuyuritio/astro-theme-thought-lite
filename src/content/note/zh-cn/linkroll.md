---
title: 连结组件使用指南
timestamp: 2025-11-17 00:00:00+00:00
tags: [Guide, MDX]
toc: true
---

主题针对**连结**板块提供了 `Linkroll` 组件，以更美观及灵活的方式展示友情链接或推荐站点。

## 导入组件

> [!Note]
> `Linkroll` 组件须在 `mdx` 文件中使用。

```mdx
import Linkroll from "$components/Linkroll.astro";

<Linkroll locale={props.locale} links={links} />
```

- `locale` - 当前页面语言代码，已由 `about.astro` 以[**组件参数**](https://mdxjs.com/docs/using-mdx/#props)方式提供；
- `links` - 链接数据数组，参考[后续步骤](#定义链接数据)。

## 定义链接数据

```mdx
export const links = [
    {
        title: "示例站点",
        url: "https://example.com",
        image: "https://example.com/favicon.ico",
        description: "这是一个示例站点",
        type: "resources"
    }
];
```

每个链接对象包含以下字段：

- `title`*: 显示标题
- `url`*: 目标地址
- `type`*: 分类类型，可选值包括：
  - `resources` - 工具与资源
  - `community` - 组织与项目
  - `insights` - 媒体与灵感
  - `technology` - 技术与开发
  - `expertise` - 专业与学术
  - `creative` - 设计与创意
  - `lifestyle` - 生活与爱好
  - `general` - 综合与其它
- `image`: 目标站点图标地址
- `description`: 描述文字

`*` 表示必要选项。
