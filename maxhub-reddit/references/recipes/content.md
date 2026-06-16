## Recipe: post_with_comments · 帖子详情+评论

> ✋ 用户语义命中：「帖子评论」「看看评论」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| post_id | yes | string | pattern=^t3_ |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_post_details | post_id → post_id | $.data.post_id → pid | STOP |
| 2 | fetch_post_comments | pid → post_id | — | 返回详情+"评论暂不可取" |

### Output
- 帖子详情（必有）
- 评论列表（可选）

### Fallback
全部失败 → STOP

---

## Recipe: post_comments_with_replies · 评论+回复

> ✋ 用户语义命中：「评论回复」「展开回复」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| post_id | yes | string | pattern=^t3_ |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_post_comments | post_id → post_id | $.data.commentForest.trees[-1].more.cursor → cur | STOP |
| 2 | fetch_comment_replies | post_id → post_id, cur → cursor | — | 返回已有评论+"回复缺失" |

### Output
- 一级评论列表（必有）
- 二级回复列表（可选）

### Fallback
全部失败 → STOP

---

## Recipe: explore_to_topic_feed · 发现页→分类Feed

> ✋ 用户语义命中：「发现」「浏览分类」「社区分类」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| 无 | — | — | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_explore_feed | — | $.data.topics[].id → tid | STOP |
| 2 | fetch_topic_feed | tid → topic_id | — | 空数据：返回分类列表+"该分类暂无帖子" |

### Output
- 分类列表（必有）
- 分类帖子列表（可选）

### Fallback
全部失败 → STOP

---

## Recipe: feed_to_post_detail · Feed→帖子详情

> ✋ 用户语义命中：「首页帖子」「热门帖子」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| 无 | — | — | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_popular_feed | — | $.data.posts[].id → pid | STOP |
| 2 | fetch_post_details | pid → post_id | — | 返回Feed列表+"详情暂不可取" |

### Output
- Feed列表（必有）
- 帖子详情（可选）

### Fallback
全部失败 → STOP
