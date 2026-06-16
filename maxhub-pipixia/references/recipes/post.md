## Recipe: post_detail_with_comments · 作品详情+评论

> ✋ 用户语义命中：「作品评论」「看看评论」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| cell_id | yes | string | 纯数字 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_post_detail | cell_id → cell_id | $.data.cell_id → cid | STOP |
| 2 | fetch_post_comment_list | cid → cell_id | — | 返回详情+"评论暂不可取" |

### Output
- 作品详情（必有）
- 评论列表（可选）

### Fallback
全部失败 → STOP

---

## Recipe: post_detail_with_statistics · 作品详情+统计

> ✋ 用户语义命中：「作品统计」「数据」「播放量」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| cell_id | yes | string | 纯数字 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_post_detail | cell_id → cell_id | $.data.cell_id → cid | STOP |
| 2 | fetch_post_statistics | cid → cell_id | — | 返回详情+"统计数据暂不可取" |

### Output
- 作品详情（必有）
- 统计数据（可选）

### Fallback
全部失败 → STOP

---

## Recipe: home_feed_to_detail · 首页推荐→详情

> ✋ 用户语义命中：「皮皮虾热门」「推荐」「有什么好看的」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| 无 | — | — | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_home_feed | — | $.data.data[].cell_id → cid | STOP |
| 2 | fetch_post_detail | cid → cell_id | — | 返回推荐列表+"详情暂不可取" |

### Output
- 推荐列表（必有）
- 作品详情（可选）

### Fallback
全部失败 → STOP

---

## Recipe: search_to_post_detail · 搜索→作品详情

> ✋ 用户语义命中：「搜索作品」「皮皮虾搜索」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| keyword | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_search | keyword → keyword | $.data.data[].cell_id → cid | STOP |
| 2 | fetch_post_detail | cid → cell_id | — | 返回搜索列表+"详情暂不可取" |

### Output
- 搜索结果列表（必有）
- 作品详情（可选）

### Fallback
全部失败 → STOP

---

## Recipe: hashtag_detail_with_posts · 话题详情+作品

> ✋ 用户语义命中：「话题作品」「标签作品」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| hashtag_id | yes | string | 纯数字 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_hashtag_detail | hashtag_id → hashtag_id | $.data.hashtag_id → hid | STOP |
| 2 | fetch_hashtag_post_list | hid → hashtag_id | — | 返回话题信息+"作品暂不可取" |

### Output
- 话题信息（必有）
- 话题作品列表（可选）

### Fallback
全部失败 → STOP

---

## Recipe: hot_search_board_to_detail · 热搜榜单→详情

> ✋ 用户语义命中：「热搜榜单」「皮皮虾热搜」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| 无 | — | — | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_hot_search_board_list | — | $.data.data[].block_type → bt | STOP |
| 2 | fetch_hot_search_board_detail | bt → block_type | — | 返回榜单列表+"详情暂不可取" |

### Output
- 榜单列表（必有）
- 榜单详情（可选）

### Fallback
全部失败 → STOP
