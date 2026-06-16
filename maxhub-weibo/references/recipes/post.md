## Recipe: search_weibo_then_detail · 搜微博看详情

> ✋ 用户语义命中：「搜微博」「找微博」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| keyword | yes | string | 搜索关键词 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | app_fetch_search_all | keyword → query | `$.data.list[].idstr` → status_id | STOP，告知未找到 |
| 2 | app_fetch_status_detail | status_id → status_id | — | 返回搜索概要 + "详情暂不可取" |

### Output
- 微博详情（必有）
- 搜索结果列表（第 2 步失败时可选）

### Fallback
全部失败 → 告知关键词未命中，建议换词

---

## Recipe: weibo_detail_then_reposts · 微博详情看转发

> ✋ 用户语义命中：「微博转发」「看转发」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| status_id | yes | string | 微博 ID |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | app_fetch_status_detail | status_id → status_id | `$.data.idstr` → status_id | STOP |
| 2 | app_fetch_status_reposts | status_id → status_id | — | 返回详情 + "暂无转发" |

### Output
- 微博详情（必有）
- 转发列表（可选）

### Fallback
全部失败 → 告知微博不存在

---

## Recipe: weibo_detail_then_likes · 微博详情看点赞

> ✋ 用户语义命中：「微博点赞」「看点赞」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| status_id | yes | string | 微博 ID |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | app_fetch_status_detail | status_id → status_id | `$.data.idstr` → status_id | STOP |
| 2 | app_fetch_status_likes | status_id → status_id | — | 返回详情 + "暂无点赞" |

### Output
- 微博详情（必有）
- 点赞列表（可选）

### Fallback
全部失败 → 告知微博不存在

---

## Recipe: video_detail_then_comments · 视频微博看评论

> ✋ 用户语义命中：「视频评论」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| mid | yes | string | 视频微博 ID |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | app_fetch_video_detail | mid → mid | `$.data.items[0].data.idstr` → status_id | STOP |
| 2 | cross_ref:comments.md#app_fetch_status_comments | status_id → status_id | — | 返回视频详情 + "评论暂不可取" |

### Output
- 视频详情（必有）
- 评论列表（可选）

### Fallback
全部失败 → 告知视频不存在

---

## Recipe: weibo_detail_then_author · 微博看作者主页

> ✋ 用户语义命中：「作者」「博主主页」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| status_id | yes | string | 微博 ID |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | app_fetch_status_detail | status_id → status_id | `$.data.user.id` → uid | STOP |
| 2 | cross_ref:user.md#app_fetch_user_info | uid → uid | — | 返回微博详情 + "作者主页暂不可取" |

### Output
- 微博详情（必有）
- 作者资料（可选）

### Fallback
全部失败 → 告知微博不存在

---

## Recipe: channel_config_then_trend · 频道看热门

> ✋ 用户语义命中：「频道热门」「频道内容」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| — | — | — | 无需输入 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | web_fetch_config_list | — | `$.data[].containerid` → containerid | 降级：web_fetch_channel_feed |
| 2 | web_fetch_trend_top | containerid → containerid | — | 返回频道列表 + "热门暂不可取" |

### Output
- 频道热门列表（必有）
- 频道配置（可选）

### Fallback
全部失败 → 告知频道数据暂不可取

---

## Recipe: recommend_feed_then_detail · 推荐看微博详情

> ✋ 用户语义命中：「推荐」「首页推荐」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| — | — | — | 无需输入 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | app_fetch_home_recommend_feed | — | `$.data.list[].idstr` → status_id | STOP |
| 2 | app_fetch_status_detail | status_id → status_id | — | 返回推荐概要 |

### Output
- 推荐列表（必有）
- 微博详情（可选）

### Fallback
全部失败 → 告知推荐暂不可取

---

## Recipe: hot_ranking_then_detail · 热门榜单看详情

> ✋ 用户语义命中：「热门榜单」「微博榜单」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| ranking_type | yes | string | 榜单类型 hour/yesterday/week 等 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | web_v2_fetch_hot_ranking_timeline | ranking_type → ranking_type | `$.data.list[].id` → id | STOP |
| 2 | web_v2_fetch_post_detail | id → id | — | 返回榜单概要 |

### Output
- 榜单列表（必有）
- 微博详情（可选）

### Fallback
全部失败 → 告知榜单暂不可取
