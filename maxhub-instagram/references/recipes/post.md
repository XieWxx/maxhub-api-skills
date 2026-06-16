## Recipe: url_to_post_detail · 链接看帖子详情

> ✋ 用户语义命中：「打开链接」「帖子链接」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| url | yes | string | Instagram 帖子 URL |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | v3_extract_shortcode | url → url | `$.shortcode` → code | STOP |
| 2 | v3_get_post_info_by_code | code → code | — | 返回 shortcode + "详情暂不可取" |

### Output
- 帖子详情（必有）
- Shortcode（第 2 步失败时可选）

### Fallback
全部失败 → 告知链接无效

---

## Recipe: shortcode_to_post_detail · 短码看帖子详情

> ✋ 用户语义命中：「短码查帖子」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| shortcode | yes | string | 帖子短码 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | v3_shortcode_to_media_id | shortcode → shortcode | `$.data.media_id` → media_id | STOP |
| 2 | v3_get_post_info | media_id → media_id | — | 返回 media_id + "详情暂不可取" |

### Output
- 帖子详情（必有）
- Media ID（可选）

### Fallback
全部失败 → 告知短码无效

---

## Recipe: post_detail_then_comments · 帖子详情看评论

> ✋ 用户语义命中：「帖子评论」「看评论」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| code | yes | string | 帖子短码 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | v3_get_post_info_by_code | code → code | `$.data.items[].code` → code | STOP |
| 2 | cross_ref:comments.md#v3_get_post_comments | code → code | — | 返回帖子详情 + "评论暂不可取" |

### Output
- 帖子详情（必有）
- 评论列表（可选）

### Fallback
全部失败 → 告知帖子不存在

---

## Recipe: post_detail_then_author · 帖子看作者主页

> ✋ 用户语义命中：「作者」「博主主页」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| code | yes | string | 帖子短码 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | v3_get_post_info_by_code | code → code | `$.data.items[].user.id` → user_id | STOP |
| 2 | cross_ref:user.md#v3_get_user_profile | user_id → user_id | — | 返回帖子详情 + "作者主页暂不可取" |

### Output
- 帖子详情（必有）
- 作者资料（可选）

### Fallback
全部失败 → 告知帖子不存在

---

## Recipe: post_detail_then_likes · 帖子看点赞列表

> ✋ 用户语义命中：「点赞列表」「谁点赞」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| code_or_url | yes | string | 帖子短码或 URL |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | v2_fetch_post_info | code_or_url → code_or_url | code_or_url 复用 | STOP |
| 2 | v2_fetch_post_likes | code_or_url → code_or_url | — | 返回帖子详情 + "点赞列表暂不可取" |

### Output
- 帖子详情（必有）
- 点赞用户列表（可选）

### Fallback
全部失败 → 告知帖子不存在

---

## Recipe: reels_recommend_then_detail · 推荐Reels看详情

> ✋ 用户语义命中：「推荐Reels」「Reels推荐」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| — | — | — | 无需输入 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | v3_get_recommended_reels | — | `$.data.edges[].node.media.code` → code | STOP |
| 2 | v3_get_post_info_by_code | code → code | — | 返回推荐概要 |

### Output
- Reels 推荐列表（必有）
- Reels 详情（可选）

### Fallback
全部失败 → 告知推荐暂不可取

---

## Recipe: comments_then_translate · 评论翻译

> ✋ 用户语义命中：「翻译评论」「评论翻译」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| code | yes | string | 帖子短码 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | cross_ref:comments.md#v3_get_post_comments | code → code | `$.data.comments[].pk` → comment_id | STOP |
| 2 | v3_translate_comment | comment_id → comment_id | — | 返回评论原文 + "翻译暂不可取" |

### Output
- 评论列表（必有）
- 翻译结果（可选）

### Fallback
全部失败 → 告知评论不可取
