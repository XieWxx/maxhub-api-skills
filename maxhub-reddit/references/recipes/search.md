## Recipe: search_post_to_detail · 搜索帖子→详情

> ✋ 用户语义命中：「搜索帖子」「找帖子」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| query | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_dynamic_search | query → query, search_type=post | $.data.results[].id → pid | 空结果：STOP |
| 2 | cross_ref:content.md#fetch_post_details | pid → post_id | — | 返回搜索列表+"详情暂不可取" |

### Output
- 搜索结果列表（必有）
- 帖子详情（可选）

### Fallback
搜索失败 → 降级到 fetch_search_typeahead

---

## Recipe: search_user_to_profile · 搜索用户→资料

> ✋ 用户语义命中：「搜索用户」「找人」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| query | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_dynamic_search | query → query, search_type=people | $.data.results[].name → uname | 空结果：STOP |
| 2 | cross_ref:user.md#fetch_user_profile | uname → username | — | 返回搜索列表 |

### Output
- 搜索结果列表（必有）
- 用户资料（可选）

### Fallback
搜索失败 → STOP

---

## Recipe: trending_to_search · 热门趋势→搜索

> ✋ 用户语义命中：「热门趋势」「热搜」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| 无 | — | — | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_trending_searches | — | $.data.trending[].query → kw | STOP |
| 2 | fetch_dynamic_search | kw → query | — | 返回趋势列表 |

### Output
- 热门趋势列表（必有）
- 搜索结果（可选）

### Fallback
趋势失败 → 降级到 fetch_popular_feed
