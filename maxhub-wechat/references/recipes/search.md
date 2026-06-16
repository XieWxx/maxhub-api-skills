# Recipes: 搜一搜 / 搜一搜

> 本文件包含搜一搜领域的全部编排 Recipe。每个 Recipe 封装一个用户目标的多步链式调用。

---

## Recipe: search_to_mp · 搜公众号→看资料

> ✋ 用户语义命中：「搜公众号」「找公众号」
> 估算：2 次调用 · ~2K token · 跨文件链路

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| keyword | ✓ | string | length=1-100 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | search_wechat | `keyword=$inputs.keyword, business_type=account` | `$.data.items[0].jumpInfo.userName → username` | STOP |
| s2 | cross_ref:mp.md#get_mp_profile | `username=$s1.username` | `→ profile` | SKIP |

### Output
- search_results（必有）
- profile（可选）

### Fallback
s1 空结果 → 告知用户"未搜到公众号"

---

## Recipe: search_to_articles · 搜公众号→看文章

> ✋ 用户语义命中：「搜文章列表」「公众号文章」
> 估算：2 次调用 · ~2K token · 跨文件链路

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| keyword | ✓ | string | length=1-100 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | search_wechat | `keyword=$inputs.keyword, business_type=account` | `$.data.items[0].jumpInfo.userName → username` | STOP |
| s2 | cross_ref:mp.md#get_mp_articles | `username=$s1.username` | `→ articles` | SKIP |

### Output
- search_results（必有）
- articles（可选）

### Fallback
s1 空结果 → 告知用户"未搜到公众号"

---

## Recipe: search_to_video · 搜视频→下载

> ✋ 用户语义命中：「搜视频下载」「找视频号视频」
> 估算：2 次调用 · ~2K token · 跨文件链路

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| keyword | ✓ | string | length=1-100 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | search_wechat | `keyword=$inputs.keyword, business_type=video` | `$.data.items[0].exportId → export_id` | STOP |
| s2 | cross_ref:channels.md#get_video_detail | `export_id=$s1.export_id` | `→ video_detail` | SKIP |

### Output
- search_results（必有）
- video_detail（可选；含媒体下载+解密密钥）

### Fallback
s1 空结果 → 告知用户"未搜到视频"

---

## Recipe: search_to_live · 搜直播→看详情

> ✋ 用户语义命中：「搜直播」「找直播」
> 估算：2 次调用 · ~2K token · 跨文件链路

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| keyword | ✓ | string | length=1-100 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | search_wechat | `keyword=$inputs.keyword, business_type=live_stream` | `→ live_results` | STOP |
| s2 | cross_ref:channels.md#get_live_detail | `live_id=$s1.live_id` | `→ live_detail` | SKIP |

### Output
- search_results（必有）
- live_detail（可选）

### Fallback
s1 空结果 → 告知用户"未搜到直播"
