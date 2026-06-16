## Recipe: video_detail_with_comments · 视频详情+评论

> ✋ 用户语义命中：「视频评论」「看看评论」「视频下面的评论」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| video_id | yes | string | length=11 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | v2_get_video_info_v2 | video_id → video_id | $.data.video_id → vid | STOP |
| 2 | v2_get_video_comments | vid → video_id | — | 返回详情+"评论暂不可取" |

### Output
- 视频详情（必有）
- 评论列表（可选）

### Fallback
全部失败 → STOP，告知用户视频信息获取失败

---

## Recipe: video_detail_with_captions · 视频详情+字幕

> ✋ 用户语义命中：「视频字幕」「字幕」「有没有字幕」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| video_id | yes | string | length=11 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | v2_get_video_info_v2 | video_id → video_id | $.data.video_id → vid | STOP |
| 2 | v2_get_video_captions | vid → video_id | — | 降级到 v2_get_video_captions_v2 |

### Output
- 视频详情（必有）
- 字幕内容（可选）

### Fallback
全部失败 → STOP

---

## Recipe: video_detail_with_related · 视频详情+推荐

> ✋ 用户语义命中：「相关视频」「推荐」「类似视频」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| video_id | yes | string | length=11 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | v2_get_video_info_v2 | video_id → video_id | $.data.video_id → vid | STOP |
| 2 | v2_get_related_videos | vid → video_id | — | 降级到 get_relate_video |

### Output
- 视频详情（必有）
- 推荐视频列表（可选）

### Fallback
全部失败 → STOP

---

## Recipe: video_stream_one_step · 获取视频流（一步法）

> ✋ 用户语义命中：「下载视频」「播放链接」「视频地址」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| video_id | yes | string | length=11 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | v2_get_video_streams_v2 | video_id → video_id | — | 5xx 降级到两步法 |

### Output
- 已解密播放地址列表（必有）

### Fallback
失败 → 降级到 video_stream_two_step

---

## Recipe: video_stream_two_step · 获取视频流（两步法）

> ✋ 用户语义命中：「指定格式下载」「选清晰度」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| video_id | yes | string | length=11 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | v2_get_video_streams | video_id → video_id | $.data.formats[].itag → itag_list | STOP |
| 2 | v2_get_signed_stream_url | itag → itag | — | 返回格式列表+"播放地址获取失败" |

### Output
- 格式列表（必有）
- 已签名播放地址（可选）

### Fallback
全部失败 → STOP

---

## Recipe: trending_to_detail · 趋势视频→详情

> ✋ 用户语义命中：「热门视频」「趋势」「YouTube热门」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| 无 | — | — | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | get_trending_videos | — | 趋势结果中 video_id → vid | STOP |
| 2 | v2_get_video_info_v2 | vid → video_id | — | 返回趋势列表+"详情暂不可取" |

### Output
- 趋势视频列表（必有）
- 视频详情（可选）

### Fallback
全部失败 → STOP
