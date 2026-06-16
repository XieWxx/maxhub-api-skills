# Recipes: 搜索与发现 / 搜索与发现

> 本文件包含搜索与发现领域的全部编排 Recipe。每个 Recipe 封装一个用户目标的多步链式调用。

---

## Recipe: search_to_video · 搜索→视频详情

> ✋ 用户语义命中：「搜视频」「找视频」
> 估算：2 次调用 · ~2K token · 跨文件链路

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| keyword | ✓ | string | 搜索关键词 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | search_all | `keyword=$inputs.keyword` | `$.data.item[0].bvid → bv_id` | STOP |
| s2 | cross_ref:video.md#get_video_web | `bv_id=$s1.bv_id` | `→ video_detail` | SKIP |

### Output
- search_results（必有）
- video_detail（可选）

### Fallback
s1 空结果 → 告知用户"未搜到结果"

---

## Recipe: search_user · 搜索用户→主页

> ✋ 用户语义命中：「搜用户」「找UP主」
> 估算：2 次调用 · ~2K token · 跨文件链路

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| keyword | ✓ | string | 搜索关键词 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | search_by_type | `keyword=$inputs.keyword, search_type=user` | `$.data.result[0].mid → uid` | STOP |
| s2 | cross_ref:user.md#get_profile | `uid=$s1.uid` | `→ profile` | SKIP |

### Output
- search_results（必有）
- profile（可选）

### Fallback
s1 空结果 → 告知用户"未搜到用户"

---

## Recipe: hot_search_video · 热搜→搜索视频

> ✋ 用户语义命中：「热搜」「热门搜索」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| limit | ✓ | string | 1-50 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_hot_search | `limit=$inputs.limit` | `→ hot_keywords` | STOP |
| s2 | search_all | `keyword=$s1.hot_keywords[0]` | `→ search_results` | SKIP |

### Output
- hot_keywords（必有）
- search_results（可选）

### Fallback
s2 失败 → 返回热搜词 + "搜索暂不可用"

---

## Recipe: feed_to_video · 推荐→视频详情

> ✋ 用户语义命中：「推荐视频」「首页推荐」
> 估算：2 次调用 · ~2K token · 跨文件链路

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| — | — | — | 无必填参数 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_home_feed | — | `$.data.item[0].bvid → bv_id` | STOP |
| s2 | cross_ref:video.md#get_video_web | `bv_id=$s1.bv_id` | `→ video_detail` | SKIP |

### Output
- feed_list（必有）
- video_detail（可选）

### Fallback
s2 失败 → 返回推荐列表
