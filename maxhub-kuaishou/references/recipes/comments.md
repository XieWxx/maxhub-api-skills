## Recipe: video_comments_then_replies · 评论展开回复

> ✋ 用户语义命中：「看回复」「评论回复」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| photo_id | yes | string | 作品 ID |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | app_fetch_video_comment | photo_id → photo_id | `$.data.comments[].comment_id` → root_comment_id | STOP |
| 2 | app_fetch_video_sub_comments | photo_id → photo_id, root_comment_id → root_comment_id | — | 返回评论列表 + "回复暂不可取" |

### Output
- 评论列表（必有）
- 回复列表（可选）

### Fallback
全部失败 → 告知评论不可取
