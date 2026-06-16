# Recipes: 视频号 / 视频号

> 本文件包含视频号领域的全部编排 Recipe。每个 Recipe 封装一个用户目标的多步链式调用。

---

## Recipe: sph_to_info · sph短号→账号信息

> ✋ 用户语义命中：「sph」「短号」「视频号ID」
> 估算：2 次调用 · ~2K token · 中间步不可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| channel_id | ✓ | string | startsWith=`sph` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | sph_to_username | `channel_id=$inputs.channel_id` | `$.data.username → username` | STOP |
| s2 | get_channel_info | `username=$s1.username` | `→ channel_info` | SKIP |

### Output
- username（必有）
- channel_info（可选）

### Fallback
s1 失败 → STOP

---

## Recipe: video_with_comments · 视频+评论

> ✋ 用户语义命中：「视频评论」「看评论」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| object_id | ✓ | string | 纯数字；或 export_id / share_url |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_video_detail | `object_id=$inputs.object_id` | `$.data.id → object_id` | STOP |
| s2 | get_video_comments | `object_id=$s1.object_id` | `→ comments` | SKIP |

### Output
- video_detail（必有）
- comments（可选）

### Fallback
s2 失败 → 返回视频详情 + "评论暂不可取"

---

## Recipe: video_with_author · 视频+作者主页

> ✋ 用户语义命中：「视频作者」「谁发的」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| object_id | ✓ | string | 纯数字；或 export_id / share_url |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_video_detail | `object_id=$inputs.object_id` | `$.data.username → username` | STOP |
| s2 | get_ch_profile | `username=$s1.username` | `→ profile` | SKIP |

### Output
- video_detail（必有）
- profile（可选）

### Fallback
s2 失败 → 返回视频详情 + "作者资料暂不可取"

---

## Recipe: video_with_share · 视频+分享链接

> ✋ 用户语义命中：「分享视频」「分享链接」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| object_id | ✓ | string | 纯数字 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_video_detail | `object_id=$inputs.object_id` | `$.data.id → object_id` | STOP |
| s2 | get_share_url | `object_id=$s1.object_id` | `$.data.share_url → share_url` | SKIP |

### Output
- video_detail（必有）
- share_url（可选）

### Fallback
s2 失败 → 返回视频详情 + "分享链接暂不可取"

---

## Recipe: profile_with_collections · 主页+合集

> ✋ 用户语义命中：「合集」「视频合集」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| username | ✓ | string | `v2_...@finder` 格式 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_ch_profile | `username=$inputs.username` | `→ profile` | STOP |
| s2 | get_collections | `username=$inputs.username` | `$.data.collections[N].topic_id → topic_id` | SKIP |

### Output
- profile（必有）
- collections（可选；空=暂无合集）

### Fallback
s2 空数据 → 返回资料 + "暂无合集"

---

## Recipe: collection_with_videos · 合集+合集内视频

> ✋ 用户语义命中：「合集视频」「合集内容」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| username | ✓ | string | `v2_...@finder` 格式 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_collections | `username=$inputs.username` | `$.data.collections[0].topic_id → topic_id` | STOP |
| s2 | get_collection_videos | `topic_id=$s1.topic_id` | `→ videos` | SKIP |

### Output
- collections（必有）
- videos（可选）

### Fallback
s2 失败 → 返回合集列表 + "合集视频暂不可取"

---

## Recipe: profile_with_lives · 主页+直播回放

> ✋ 用户语义命中：「直播回放」「历史直播」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| username | ✓ | string | `v2_...@finder` 格式 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_ch_profile | `username=$inputs.username` | `→ profile` | STOP |
| s2 | get_live_history | `username=$inputs.username` | `→ lives` | SKIP |

### Output
- profile（必有）
- lives（可选；空=暂无直播回放）

### Fallback
s2 空数据 → 返回资料 + "暂无直播回放"
