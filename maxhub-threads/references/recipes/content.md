## Recipe: post_detail_with_comments · 帖子详情+评论

> ✋ 用户语义命中：「帖子评论」「看看评论」「帖子下面的评论」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| post_id | yes | string | 纯数字或短代码 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_post_detail_v2 | post_id → post_id | $.data.post_id → pid | STOP |
| 2 | fetch_post_comments | pid → post_id | — | 返回详情+"评论暂不可取" |

### Output
- 帖子详情（必有）
- 评论列表（可选）

### Fallback
全部失败 → STOP

---

## Recipe: search_top_to_detail · 搜索热门→详情

> ✋ 用户语义命中：「搜索帖子」「热门帖子」「Threads搜索」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| query | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | search_top | query → query | $.data.threads[].id → tid | STOP |
| 2 | fetch_post_detail | tid → post_id | — | 返回搜索列表+"详情暂不可取" |

### Output
- 搜索结果列表（必有）
- 帖子详情（可选）

### Fallback
全部失败 → STOP

---

## Recipe: search_profiles_to_user · 搜索用户→资料

> ✋ 用户语义命中：「搜索用户」「找人」「Threads用户」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| query | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | search_profiles | query → query | $.data.users[].username → uname | STOP |
| 2 | fetch_user_info | uname → username | — | 返回搜索列表+"资料暂不可取" |

### Output
- 搜索结果列表（必有）
- 用户资料（可选）

### Fallback
全部失败 → STOP
