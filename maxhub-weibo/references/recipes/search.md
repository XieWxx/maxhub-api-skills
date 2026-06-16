## Recipe: hot_search_then_search · 热搜词搜微博

> ✋ 用户语义命中：「热搜」「热门搜索」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| — | — | — | 无需输入 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | web_v2_fetch_hot_search_summary | — | `$.data.list[].word` → keyword | 让用户自行输入关键词 |
| 2 | cross_ref:post.md#app_fetch_search_all | keyword → query | — | 返回热搜列表 |

### Output
- 热搜词列表（必有）
- 搜索结果（可选）

### Fallback
全部失败 → 告知热搜暂不可取

---

## Recipe: advanced_search_then_detail · 高级搜看详情

> ✋ 用户语义命中：「高级搜索」「筛选搜索」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| q | yes | string | 搜索关键词 |
| search_type | no | string | 搜索类型 |
| include_type | no | string | 包含类型 |
| timescope | no | string | 时间范围 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | web_v2_fetch_advanced_search | q → q, search_type → search_type, include_type → include_type, timescope → timescope | `$.data.list[].id` → id | STOP，告知未找到 |
| 2 | cross_ref:post.md#web_v2_fetch_post_detail | id → id | — | 返回搜索概要 |

### Output
- 搜索结果列表（必有）
- 微博详情（可选）

### Fallback
全部失败 → 告知搜索条件未命中，建议放宽筛选
