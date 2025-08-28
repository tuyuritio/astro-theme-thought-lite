Welcome to subscribe to the site and get the latest content as soon as it's available.

The default subscription link is [`/feed`](/feed), which will push **all notes** in **Atom** format.

---

You can also customize the pushed content by adding query parameters:

| Parameter || Allowed Values |
| - | - |:- |
| **Format** | `format` | `atom` `rss` `json` |
| **Series** | `series` | *refer to series list* |
| **Tag** | `tag` | *refer to tag list* |

> All parameters support multi-selection through **repeated parameters**, except for **subscription format**.

**Examples:**

- Subscribe to *RSS* format for all content: `/feed?format=rss`
- Subscribe to content in the *Call to Arms* series: `/feed?series=Call%20to%20Arms`
- Subscribe to content in the *Astro* series containing either *Demo* or *Markup* tags: `/feed?series=Astro&tag=Demo&tag=Markup`
