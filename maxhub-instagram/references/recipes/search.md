## Recipe: explore_then_detail · 探索页看详情

> ✋ 用户语义命中：「探索」「发现」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| — | — | — | 无需输入 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | v3_get_explore | — | 推荐帖子中的 ID → media_id | STOP |
| 2 | cross_ref:post.md#v3_get_post_info | media_id → media_id | — | 返回探索概要 |

### Output
- 探索页推荐列表（必有）
- 帖子详情（可选）

### Fallback
全部失败 → 告知探索页暂不可取

---

## Recipe: search_hashtag_then_posts · 搜话题看帖子

> ✋ 用户语义命中：「话题帖子」「标签帖子」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| keyword | yes | string | 话题关键词 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | v3_search_hashtags | keyword → query | `$.data.hashtags[].name` → hashtag_name | STOP，告知未找到 |
| 2 | v2_fetch_hashtag_posts | hashtag_name → keyword | — | 返回话题搜索概要 |

### Output
- 话题帖子列表（必有）
- 话题搜索结果（可选）

### Fallback
全部失败 → 告知话题未命中

---

## Recipe: search_location_then_posts · 搜地点看帖子

> ✋ 用户语义命中：「地点帖子」「位置帖子」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| keyword | yes | string | 地点名称 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | v2_search_locations | keyword → keyword | `$.data.items[].id` → location_id | STOP，告知未找到 |
| 2 | v3_get_location_posts | location_id → location_id | — | 返回地点搜索概要 |

### Output
- 地点帖子列表（必有）
- 地点搜索结果（可选）

### Fallback
全部失败 → 告知地点未命中

---

## Recipe: music_posts_browse · 音乐帖子浏览

> ✋ 用户语义命中：「音乐帖子」「同音乐帖子」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| keyword | yes | string | 音乐关键词 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | v2_search_music | keyword → keyword | `$.data.items[].id` → music_id | STOP，告知未找到 |
| 2 | cross_ref:post.md#v1_fetch_music_posts | music_id → music_id | — | 返回音乐搜索概要 |

### Output
- 音乐帖子列表（必有）
- 音乐搜索结果（可选）

### Fallback
全部失败 → 告知音乐未命中
