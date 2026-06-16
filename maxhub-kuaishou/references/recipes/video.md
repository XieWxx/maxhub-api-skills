## Recipe: search_video_then_detail · 搜视频看详情

> ✋ 用户语义命中：「搜视频」「找视频」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| keyword | yes | string | 搜索关键词 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | cross_ref:search.md#app_search_video_v2 | keyword → keyword | `$.data.videos[].photo_id` → photo_id | STOP，告知未找到 |
| 2 | app_fetch_one_video | photo_id → photo_id | — | 返回搜索概要 + "详情暂不可取" |

### Output
- 视频详情（必有）
- 搜索结果列表（第 2 步失败时可选）

### Fallback
全部失败 → 告知关键词未命中，建议换词

---

## Recipe: share_link_to_video_detail · 分享链接看视频

> ✋ 用户语义命中：「打开链接」「视频链接」
> 估算：1 次调用 · ~1K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| share_text | yes | string | 快手分享链接 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | app_fetch_one_video_by_url | share_text → share_text | — | STOP，告知链接无效 |

### Output
- 视频详情（必有）

### Fallback
全部失败 → 告知链接无效

---

## Recipe: video_detail_then_comments · 视频详情看评论

> ✋ 用户语义命中：「视频评论」「看评论」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| photo_id | yes | string | 作品 ID |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | app_fetch_one_video | photo_id → photo_id | `$.data.photo_id` → photo_id | STOP |
| 2 | cross_ref:comments.md#app_fetch_video_comment | photo_id → photo_id | — | 返回视频详情 + "评论暂不可取" |

### Output
- 视频详情（必有）
- 评论列表（可选）

### Fallback
全部失败 → 告知视频不存在

---

## Recipe: video_detail_then_author · 视频看作者主页

> ✋ 用户语义命中：「作者」「博主主页」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| photo_id | yes | string | 作品 ID |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | app_fetch_one_video | photo_id → photo_id | `$.data.user_id` → user_id | STOP |
| 2 | cross_ref:user.md#app_fetch_one_user_v2 | user_id → user_id | — | 返回视频详情 + "作者主页暂不可取" |

### Output
- 视频详情（必有）
- 作者资料（可选）

### Fallback
全部失败 → 告知视频不存在

---

## Recipe: video_detail_then_share · 视频详情生分享

> ✋ 用户语义命中：「分享链接」「生成分享」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| photo_id | yes | string | 作品 ID |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | app_fetch_one_video | photo_id → photo_id | `$.data.photo_id` → shareObjectId | STOP |
| 2 | app_generate_kuaishou_share_link | shareObjectId → shareObjectId | — | 返回视频详情 + "分享链接生成失败" |

### Output
- 视频详情（必有）
- 分享链接（可选）

### Fallback
全部失败 → 告知视频不存在

---

## Recipe: selection_feed_then_detail · 推荐看视频详情

> ✋ 用户语义命中：「推荐」「首页推荐」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| — | — | — | 无需输入 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | cross_ref:search.md#app_fetch_selection_feed | — | `$.data.feeds[].photo_id` → photo_id | STOP |
| 2 | app_fetch_one_video | photo_id → photo_id | — | 返回推荐概要 |

### Output
- 推荐列表（必有）
- 视频详情（可选）

### Fallback
全部失败 → 告知推荐暂不可取

---

## Recipe: hot_list_then_detail · 热榜看视频详情

> ✋ 用户语义命中：「热榜」「快手热榜」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| board_type | no | string | 榜单类型 1-6 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | cross_ref:search.md#web_fetch_kuaishou_hot_list_v2 | board_type → board_type | `$.data.items[].photo_id` → photo_id | STOP |
| 2 | app_fetch_one_video | photo_id → photo_id | — | 返回热榜概要 |

### Output
- 热榜列表（必有）
- 视频详情（可选）

### Fallback
全部失败 → 告知热榜暂不可取
