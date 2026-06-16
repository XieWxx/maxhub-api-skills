## Recipe: post_with_comments · 帖子+评论

> ✋ 用户语义命中：「帖子评论」「看看评论」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| post_urn | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | v2_get_post_detail | post_urn → post_urn | $.data.urn → purn | STOP |
| 2 | v2_get_post_comments | purn → post_urn | — | 返回详情+"评论暂不可取" |

### Output
- 帖子详情（必有）
- 评论列表（可选）

### Fallback
全部失败 → STOP

---

## Recipe: search_posts_to_detail · 搜索帖子→详情

> ✋ 用户语义命中：「搜索帖子」「找帖子」「领英文章」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| keyword | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | web_search_posts | keyword → keyword | $.data.elements[].urn → purn | STOP |
| 2 | v2_get_post_detail | purn → post_urn | — | 返回搜索列表+"详情暂不可取" |

### Output
- 搜索结果列表（必有）
- 帖子详情（可选）

### Fallback
全部失败 → STOP

---

## Recipe: hashtag_to_posts · 话题→帖子

> ✋ 用户语义命中：「话题动态」「hashtag」「标签帖子」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| hashtag | yes | string | — |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | v2_get_hashtag_feed | hashtag → hashtag | — | STOP |

### Output
- 话题帖子列表（必有）

### Fallback
失败 → STOP
