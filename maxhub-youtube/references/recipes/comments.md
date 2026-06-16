## Recipe: post_detail_with_comments · 帖子详情+评论

> ✋ 用户语义命中：「帖子评论」「社区帖子详情」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| post_id | yes | string | startsWith=Ugk |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | v2_get_post_detail | post_id → post_id | $.data.comments_continuation_token → ct | STOP |
| 2 | v2_get_post_comments | ct → continuation_token | — | 返回帖子详情+"评论暂不可取" |

### Output
- 帖子详情（必有）
- 评论列表（可选）

### Fallback
全部失败 → STOP

---

## Recipe: video_comments_with_replies · 视频评论+回复

> ✋ 用户语义命中：「评论回复」「看看回复」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| video_id | yes | string | length=11 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | v2_get_video_comments | video_id → video_id | $.data.comments[].reply_continuation_token → rct | STOP |
| 2 | v2_get_video_comment_replies | rct → continuation_token | — | 返回已有评论+"回复暂不可取" |

### Output
- 一级评论列表（必有）
- 二级回复列表（可选）

### Fallback
全部失败 → STOP
