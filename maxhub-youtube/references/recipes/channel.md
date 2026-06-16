## Recipe: channel_url_to_info · URL→频道信息

> ✋ 用户语义命中：「频道信息」「频道详情」「看看这个频道」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| channel_url | yes | string | startsWith=https://www.youtube.com/ |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | v2_get_channel_id | channel_url → channel_url | $.data.channel_id → cid | STOP |
| 2 | v2_get_channel_description | cid → channel_id | — | 降级到 get_channel_info |

### Output
- 频道 ID（必有）
- 频道描述信息（可选）

### Fallback
全部失败 → STOP

---

## Recipe: channel_info_with_videos · 频道信息+视频

> ✋ 用户语义命中：「频道视频」「频道的视频」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| channel_id | yes | string | UC前缀22位 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | v2_get_channel_description | channel_id → channel_id | $.data.channel_id → cid | STOP |
| 2 | v2_get_channel_videos | cid → channel_id | — | 降级到 get_channel_videos_v2 |

### Output
- 频道信息（必有）
- 视频列表（可选）

### Fallback
全部失败 → STOP

---

## Recipe: channel_info_with_shorts · 频道信息+Shorts

> ✋ 用户语义命中：「频道短视频」「Shorts」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| channel_id | yes | string | UC前缀22位 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | v2_get_channel_description | channel_id → channel_id | $.data.channel_id → cid | STOP |
| 2 | v2_get_channel_shorts | cid → channel_id | — | 降级到 get_channel_short_videos |

### Output
- 频道信息（必有）
- Shorts 列表（可选）

### Fallback
全部失败 → STOP

---

## Recipe: channel_info_with_posts · 频道信息+帖子

> ✋ 用户语义命中：「社区帖子」「频道帖子」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| channel_id | yes | string | UC前缀22位 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | v2_get_channel_description | channel_id → channel_id | $.data.channel_id → cid | STOP |
| 2 | v2_get_channel_community_posts | cid → channel_id | — | 空数据：返回频道信息+"暂无社区帖子" |

### Output
- 频道信息（必有）
- 社区帖子列表（可选）

### Fallback
全部失败 → STOP
