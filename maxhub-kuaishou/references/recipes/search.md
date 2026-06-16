## Recipe: search_tag_then_feed · 搜话题看内容

> ✋ 用户语义命中：「话题内容」「标签内容」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| keyword | yes | string | 话题关键词 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | app_search_tag | keyword → keyword | `$.data.tags[].id` → general_tag_id | STOP，告知未找到 |
| 2 | app_fetch_tag_feed | general_tag_id → general_tag_id | — | 返回标签信息 + "暂无内容" |

### Output
- 话题内容列表（必有）
- 话题搜索结果（可选）

### Fallback
全部失败 → 告知话题未命中

---

## Recipe: hot_board_categories_then_detail · 热榜分类看详情

> ✋ 用户语义命中：「热榜分类」「榜单详情」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| — | — | — | 无需输入 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | app_fetch_hot_board_categories | — | `$.data.categories[].boardType` → boardType, `$.data.categories[].boardId` → boardId | STOP |
| 2 | app_fetch_hot_board_detail | boardType → boardType, boardId → boardId | — | 返回分类列表概要 |

### Output
- 热榜详情（必有）
- 热榜分类列表（可选）

### Fallback
全部失败 → 告知热榜暂不可取
