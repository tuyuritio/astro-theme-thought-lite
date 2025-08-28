欢迎订阅站点，并在第一时间获取最新内容。

默认订阅链接为 [`/zh-cn/feed`](/zh-cn/feed)，将推送 **Atom** 格式的**所有文记**。

---

也可通过添加查询参数定制推送内容：

| 参数 || 可选值 |
| - | - |:- |
| **订阅格式** | `format` | `atom` `rss` `json` |
| **系列筛选** | `series` | *参考系列列表* |
| **标签筛选** | `tag` | *参考标签列表* |

> 除**订阅格式**外，所有参数均支持通过**重复传参**实现多选。

**示例：**

- 订阅 *RSS* 格式的所有内容：`/zh-cn/feed?format=rss`
- 订阅 *呐喊* 系列内容：`/zh-cn/feed?series=呐喊`
- 订阅 *Astro* 系列中，包含 *Demo*、*Markup* 任一标签的内容：`/zh-cn/feed?series=Astro&tag=Demo&tag=Markup`
