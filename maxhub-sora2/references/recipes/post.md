# Recipes: 作品 / 作品

> 本文件包含作品领域的全部编排 Recipe。每个 Recipe 封装一个用户目标的多步链式调用。

---

## Recipe: post_with_comments · 看作品+评论

> ✋ 用户语义命中：「看作品评论」「帖子评论」「作品评论」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| post_id | ✓ | string | 纯数字，形如 `s_xxx`；或 post_url |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_post | `post_id=$inputs.post_id` | `$.data.post_id → post_id` | STOP |
| s2 | list_comments | `post_id=$s1.post_id` | `$.data.comments → comments` | SKIP |

### Output
- post_detail（必有）
- comments（可选）

### Fallback
全部失败 → 告知用户"获取失败，请稍后重试"

---

## Recipe: comments_with_replies · 看评论+回复

> ✋ 用户语义命中：「评论回复」「看回复」「评论详情」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| post_id | ✓ | string | 形如 `s_xxx` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | list_comments | `post_id=$inputs.post_id` | `$.data.comments[].comment_id → comment_id` | STOP |
| s2 | list_replies | `comment_id=$s1.comment_id` | `$.data.replies → replies` | SKIP |

### Output
- comments（必有）
- replies（可选）

### Fallback
全部失败 → 告知用户"获取失败，请稍后重试"

---

## Recipe: post_full_thread · 看作品+评论+回复

> ✋ 用户语义命中：「完整讨论」「作品评论回复」
> 估算：3 次调用 · ~3K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| post_id | ✓ | string | 形如 `s_xxx` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_post | `post_id=$inputs.post_id` | `$.data.post_id → post_id` | STOP |
| s2 | list_comments | `post_id=$s1.post_id` | `$.data.comments[].comment_id → comment_id` | SKIP |
| s3 | list_replies | `comment_id=$s2.comment_id` | `$.data.replies → replies` | SKIP |

### Output
- post_detail（必有）
- comments（可选）
- replies（可选）

### Fallback
全部失败 → 告知用户"获取失败，请稍后重试"

---

## Recipe: download_video · 下载作品视频

> ✋ 用户语义命中：「下载视频」「下载作品」「保存视频」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| post_id | ✓ | string | 形如 `s_xxx`；或 post_url |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_post | `post_id=$inputs.post_id` | `$.data.post_id → post_id` | STOP |
| s2 | get_download | `post_id=$s1.post_id` | `$.data.download_url → download_url` | RETRY_ONCE |

### Output
- post_detail（必有）
- download_url（可选；降级时用 `$.data.video_url`）

### Fallback
s2 失败 → 降级到 s1 的 `$.data.video_url`（可能带水印），告知用户

---

## Recipe: post_with_remix · 看作品+二创

> ✋ 用户语义命中：「二创」「Remix」「衍生作品」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| post_id | ✓ | string | 形如 `s_xxx`；或 post_url |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_post | `post_id=$inputs.post_id` | `$.data.post_id → post_id` | STOP |
| s2 | list_remix | `post_id=$s1.post_id` | `$.data.remix → remix_list` | SKIP |

### Output
- post_detail（必有）
- remix_list（可选；空数据=暂无Remix）

### Fallback
s2 空数据 → 返回作品详情 + "暂无 Remix"

---

## Recipe: post_with_author · 看作品+作者主页

> ✋ 用户语义命中：「看作者」「作品作者」「谁发的」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| post_id | ✓ | string | 形如 `s_xxx`；或 post_url |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_post | `post_id=$inputs.post_id` | `$.data.author.user_id → user_id` | STOP |
| s2 | cross_ref:user.md#get_profile | `user_id=$s1.user_id` | `$.data → author_profile` | SKIP |

### Output
- post_detail（必有）
- author_profile（可选）

### Fallback
s2 失败 → 返回作品详情 + "作者资料暂不可取"
