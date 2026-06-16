## Recipe: share_link_to_post_detail · 分享链接→帖子详情

> ✋ 用户语义命中：「帖子链接」「看看帖子」「Lemon8帖子」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| share_text | yes | string | Lemon8 分享链接 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | get_item_id | share_text → share_text | $.data.item_id → iid | STOP |
| 2 | fetch_post_detail | iid → item_id | — | 返回 item_id |

### Output
- 帖子详情（必有）

### Fallback
全部失败 → STOP

---

## Recipe: post_detail_with_comments · 帖子详情+评论

> ✋ 用户语义命中：「帖子评论」「看看评论」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| item_id | yes | string | 纯数字 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_post_detail | item_id → item_id | $.data.group_id → gid; $.data.media_id → mid | STOP |
| 2 | fetch_post_comment_list | gid → group_id; item_id → item_id; mid → media_id | — | 返回详情+"评论暂不可取" |

### Output
- 帖子详情（必有）
- 评论列表（可选）

### Fallback
全部失败 → STOP

---

## Recipe: search_to_post_detail · 搜索→帖子详情

> ✋ 用户语义命中：「搜索帖子」「Lemon8搜索」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| query | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_search | query → query | $.data.posts[].item_id → iid | STOP |
| 2 | fetch_post_detail | iid → item_id | — | 返回搜索列表+"详情暂不可取" |

### Output
- 搜索结果列表（必有）
- 帖子详情（可选）

### Fallback
全部失败 → STOP

---

## Recipe: topic_info_with_posts · 话题信息+帖子

> ✋ 用户语义命中：「话题帖子」「hashtag帖子」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| forum_id | yes | string | 纯数字 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_topic_info | forum_id → forum_id | $.data.category → cat; $.data.category_parameter → cp; $.data.hashtag_name → hn | STOP |
| 2 | fetch_topic_post_list | cat → category; cp → category_parameter; hn → hashtag_name | — | 返回话题信息+"帖子暂不可取" |

### Output
- 话题信息（必有）
- 话题帖子列表（可选）

### Fallback
全部失败 → STOP
