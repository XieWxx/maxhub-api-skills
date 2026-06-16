## Recipe: search_video_to_detail · 搜索视频→详情

> ✋ 用户语义命中：「搜索视频」「找视频」「搜YouTube」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| keyword | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | v2_get_general_search_v2 | keyword → keyword | $.data.videos[].video_id → vid | 空结果：STOP |
| 2 | v2_get_video_info_v2 | vid → video_id | — | 返回搜索列表+"详情暂不可取" |

### Output
- 搜索结果列表（必有）
- 视频详情（可选）

### Fallback
搜索失败 → 降级到 v2_get_general_search

---

## Recipe: search_channel_to_info · 搜索频道→信息

> ✋ 用户语义命中：「搜索频道」「找频道」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| keyword | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | v2_search_channels | keyword → keyword | $.data.channels[].channel_id → cid | 空结果：STOP |
| 2 | cross_ref:channel.md#v2_get_channel_description | cid → channel_id | — | 返回搜索列表 |

### Output
- 搜索结果列表（必有）
- 频道详情（可选）

### Fallback
搜索失败 → STOP
