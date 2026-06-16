# Recipes: 推文 / 推文

> 本文件包含推文领域的全部编排 Recipe。每个 Recipe 封装一个用户目标的多步链式调用。

---

## Recipe: tweet_with_comments · 推文+热门评论

> ✋ 用户语义命中：「推文评论」「看评论」「热门评论」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| tweet_id | ✓ | string | 纯数字字符串 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_tweet | `tweet_id=$inputs.tweet_id` | `$.data.tweet_id → tweet_id` | STOP |
| s2 | get_comments | `tweet_id=$s1.tweet_id` | `→ comments` | SKIP |

### Output
- tweet_detail（必有）
- comments（可选）

### Fallback
s2 失败 → 返回推文详情 + "评论暂不可取"

---

## Recipe: tweet_with_latest_comments · 推文+最新评论

> ✋ 用户语义命中：「最新评论」「最近的评论」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| tweet_id | ✓ | string | 纯数字字符串 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_tweet | `tweet_id=$inputs.tweet_id` | `$.data.tweet_id → tweet_id` | STOP |
| s2 | get_latest_comments | `tweet_id=$s1.tweet_id` | `→ latest_comments` | SKIP |

### Output
- tweet_detail（必有）
- latest_comments（可选）

### Fallback
s2 失败 → 返回推文详情 + "最新评论暂不可取"

---

## Recipe: tweet_with_retweeters · 推文+转推用户

> ✋ 用户语义命中：「谁转推了」「转推列表」「谁转了」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| tweet_id | ✓ | string | 纯数字字符串 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_tweet | `tweet_id=$inputs.tweet_id` | `$.data.tweet_id → tweet_id` | STOP |
| s2 | get_retweeters | `tweet_id=$s1.tweet_id` | `→ retweeters` | SKIP |

### Output
- tweet_detail（必有）
- retweeters（可选；空=暂无转推）

### Fallback
s2 空数据 → 返回推文详情 + "暂无转推"

---

## Recipe: search_to_tweet · 搜索→推文详情

> ✋ 用户语义命中：「搜推文」「搜到后看详情」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| keyword | ✓ | string | 搜索关键字 |
| search_type | ✗ | string | enum=`Top, Latest, Media, People, Lists`；默认 Top |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | search_tweets | `keyword=$inputs.keyword, search_type=$inputs.search_type` | `$.data.tweets[0].tweet_id → tweet_id` | STOP |
| s2 | get_tweet | `tweet_id=$s1.tweet_id` | `→ tweet_detail` | SKIP |

### Output
- search_results（必有）
- tweet_detail（可选）

### Fallback
s1 空结果 → STOP，告知用户"未搜到相关推文"

---

## Recipe: search_to_author · 搜索→看作者

> ✋ 用户语义命中：「搜推文看作者」「搜到后看主页」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| keyword | ✓ | string | 搜索关键字 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | search_tweets | `keyword=$inputs.keyword` | `$.data.tweets[0].author.screen_name → screen_name` | STOP |
| s2 | cross_ref:user.md#get_profile | `screen_name=$s1.screen_name` | `→ author_profile` | SKIP |

### Output
- search_results（必有）
- author_profile（可选）

### Fallback
s1 空结果 → STOP，告知用户"未搜到相关推文"

---

## Recipe: trending_to_search · 趋势→搜索

> ✋ 用户语义命中：「热搜搜一下」「趋势话题」「热门话题搜索」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| country | ✗ | string | enum=国家代码；默认 UnitedStates |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_trending | `country=$inputs.country` | `$.data.trending[0].name → trending_keyword` | STOP |
| s2 | search_tweets | `keyword=$s1.trending_keyword` | `→ search_results` | SKIP |

### Output
- trending_list（必有）
- search_results（可选）

### Fallback
s2 失败 → 返回趋势列表 + "搜索暂不可用"

---

## Recipe: tweet_with_author · 推文+作者主页

> ✋ 用户语义命中：「推文作者」「谁发的」「看作者」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| tweet_id | ✓ | string | 纯数字字符串 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_tweet | `tweet_id=$inputs.tweet_id` | `$.data.author.screen_name → screen_name` | STOP |
| s2 | cross_ref:user.md#get_profile | `screen_name=$s1.screen_name` | `→ author_profile` | SKIP |

### Output
- tweet_detail（必有）
- author_profile（可选）

### Fallback
s2 失败 → 返回推文详情 + "作者资料暂不可取"
