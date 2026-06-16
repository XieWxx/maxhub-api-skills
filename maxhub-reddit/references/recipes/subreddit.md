## Recipe: subreddit_info_with_settings · 版块信息+设置

> ✋ 用户语义命中：「版块设置」「版块详情」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| subreddit_name | yes | string | 不带 r/ 前缀 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_subreddit_info | subreddit_name → subreddit_name | $.data.subreddit.id → sid | STOP |
| 2 | fetch_subreddit_settings | sid → subreddit_id | — | 返回版块信息+"设置暂不可取" |

### Output
- 版块信息（必有）
- 版块设置（可选）

### Fallback
全部失败 → STOP

---

## Recipe: subreddit_info_with_highlights · 版块信息+亮点

> ✋ 用户语义命中：「版块亮点」「精选」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| subreddit_name | yes | string | 不带 r/ 前缀 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_subreddit_info | subreddit_name → subreddit_name | $.data.subreddit.id → sid | STOP |
| 2 | cross_ref:search.md#fetch_community_highlights | sid → subreddit_id | — | 返回版块信息+"亮点暂不可取" |

### Output
- 版块信息（必有）
- 社区亮点（可选）

### Fallback
全部失败 → STOP

---

## Recipe: subreddit_feed_to_post · 版块Feed→帖子

> ✋ 用户语义命中：「版块帖子」

### Inputs
| name | required | type | constraint |
|------|----------|------|-----------|
| subreddit_name | yes | string | 不带 r/ 前缀 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|--------------------------|--------|
| 1 | fetch_subreddit_feed | subreddit_name → subreddit_name | $.data.posts[].id → pid | STOP |
| 2 | cross_ref:content.md#fetch_post_details | pid → post_id | — | 返回Feed列表+"详情暂不可取" |

### Output
- 版块Feed列表（必有）
- 帖子详情（可选）

### Fallback
全部失败 → STOP
