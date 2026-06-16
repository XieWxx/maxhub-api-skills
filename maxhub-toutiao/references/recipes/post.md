## Recipe: article_with_comments · 文章+评论

> ✋ 用户语义命中：「文章评论」「看看评论」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| group_id | yes | string | 纯数字 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | app_get_article_info | group_id → group_id | $.data.user_id → uid | STOP |
| 2 | app_get_comments | group_id → group_id; offset="0" | — | 返回文章信息+"评论暂不可取" |

### Output
- 文章信息（必有）
- 评论列表（可选）

### Fallback
全部失败 → STOP

---

## Recipe: video_with_comments · 视频+评论

> ✋ 用户语义命中：「视频评论」「看看评论」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| group_id | yes | string | 纯数字 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | app_get_video_info | group_id → group_id | — | STOP |
| 2 | app_get_comments | group_id → group_id; offset="0" | — | 返回视频信息+"评论暂不可取" |

### Output
- 视频信息（必有）
- 评论列表（可选）

### Fallback
全部失败 → STOP

---

## Recipe: article_to_author · 文章→作者

> ✋ 用户语义命中：「文章作者」「谁写的」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| group_id | yes | string | 纯数字 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | app_get_article_info | group_id → group_id | $.data.user_id → uid | STOP |
| 2 | app_get_user_info | uid → user_id | — | 返回文章信息+"作者信息暂不可取" |

### Output
- 文章信息（必有）
- 作者信息（可选）

### Fallback
全部失败 → STOP
