## Recipe: search_articles_to_detail · 搜索文章→详情

> ✋ 用户语义命中：「搜索文章」「知乎搜索」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| keyword | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_article_search_v3 | keyword → keyword | $.data.data[].id → aid | STOP |
| 2 | fetch_column_article_detail | aid → article_id | — | 返回搜索列表+"详情暂不可取" |

### Output
- 搜索结果列表（必有）
- 文章详情（可选）

### Fallback
全部失败 → STOP

---

## Recipe: search_user_to_profile · 搜索用户→资料

> ✋ 用户语义命中：「搜索用户」「找人」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| keyword | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_user_search_v3 | keyword → keyword | $.data.data[].url_token → utoken | STOP |
| 2 | fetch_user_info | utoken → user_url_token | — | 返回搜索列表+"资料暂不可取" |

### Output
- 搜索结果列表（必有）
- 用户资料（可选）

### Fallback
全部失败 → STOP

---

## Recipe: ai_search_full · AI搜索完整流程

> ✋ 用户语义命中：「AI搜索」「智能搜索」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| message_content | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_ai_search | message_content → message_content | $.data.message_id → mid | STOP |
| 2 | fetch_ai_search_result | mid → message_id | — | 返回 message_id+"结果暂不可取" |

### Output
- AI 搜索结果（必有）

### Fallback
全部失败 → STOP
