## Recipe: post_comments_then_replies · 评论展开回复

> ✋ 用户语义命中：「看回复」「评论回复」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| code | yes | string | 帖子短码 |
| media_id | yes | string | 帖子 Media ID |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | v3_get_post_comments | code → code | `$.data.comments[].pk` → comment_id | STOP |
| 2 | v3_get_comment_replies | media_id → media_id, comment_id → comment_id | — | 返回评论列表 + "回复暂不可取" |

### Output
- 评论列表（必有）
- 回复列表（可选）

### Fallback
全部失败 → 告知评论不可取

---

## Recipe: comments_bulk_translate · 批量翻译评论

> ✋ 用户语义命中：「批量翻译」「翻译所有评论」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| code | yes | string | 帖子短码 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | v3_get_post_comments | code → code | `$.data.comments[].pk`（最多取 10 个）→ comment_ids（逗号拼接） | STOP |
| 2 | cross_ref:post.md#v3_bulk_translate_comments | comment_ids → comment_ids | — | 返回评论原文 + "翻译暂不可取" |

### Output
- 评论列表（必有）
- 翻译结果（可选）

### Fallback
全部失败 → 告知评论不可取
