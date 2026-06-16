## Recipe: weibo_detail_then_comments · 微博详情看评论

> ✋ 用户语义命中：「微博评论」「看评论」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| status_id | yes | string | 微博 ID |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | cross_ref:post.md#app_fetch_status_detail | status_id → status_id | `$.data.idstr` → status_id | STOP |
| 2 | app_fetch_status_comments | status_id → status_id | — | 返回微博详情 + "评论暂不可取" |

### Output
- 微博详情（必有）
- 评论列表（可选）

### Fallback
全部失败 → 告知微博不存在

---

## Recipe: comments_then_replies · 评论展开回复

> ✋ 用户语义命中：「看回复」「评论回复」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| id | yes | string | 微博 ID |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | web_v2_fetch_post_comments | id → id | `$.data.list[].id` → comment_id | STOP |
| 2 | web_v2_fetch_post_sub_comments | comment_id → id | — | 返回评论列表 + "回复暂不可取" |

### Output
- 评论列表（必有）
- 回复列表（可选）

### Fallback
全部失败 → 告知评论不可取
