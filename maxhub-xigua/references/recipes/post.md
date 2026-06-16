## Recipe: video_detail_with_comments · 视频详情+评论

> ✋ 用户语义命中：「视频评论」「看看评论」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| item_id | yes | string | 纯数字 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_one_video_v2 | item_id → item_id | $.data.item_id → iid | STOP |
| 2 | fetch_video_comment_list | iid → item_id | — | 返回视频详情+"评论暂不可取" |

### Output
- 视频详情（必有）
- 评论列表（可选）

### Fallback
全部失败 → STOP

---

## Recipe: video_detail_with_play_url · 视频详情+播放链接

> ✋ 用户语义命中：「播放链接」「下载视频」「视频地址」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| item_id | yes | string | 纯数字 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_one_video_v2 | item_id → item_id | $.data.item_id → iid | STOP |
| 2 | fetch_one_video_play_url | iid → item_id | — | 返回视频详情+"播放链接暂不可取" |

### Output
- 视频详情（必有）
- 播放链接（可选）

### Fallback
全部失败 → STOP

---

## Recipe: search_to_video_detail · 搜索→视频详情

> ✋ 用户语义命中：「搜索视频」「西瓜搜索」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| keyword | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | search_video | keyword → keyword | $.data.data[].item_id → iid | STOP |
| 2 | fetch_one_video_v2 | iid → item_id | — | 返回搜索列表+"详情暂不可取" |

### Output
- 搜索结果列表（必有）
- 视频详情（可选）

### Fallback
全部失败 → STOP
