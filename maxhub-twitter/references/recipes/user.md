# Recipes: 用户 / 用户

> 本文件包含用户领域的全部编排 Recipe。每个 Recipe 封装一个用户目标的多步链式调用。

---

## Recipe: profile_with_tweets · 用户资料+推文

> ✋ 用户语义命中：「用户推文」「ta的推文」「主页推文」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| screen_name | ✓ | string | 用户名，如 `elonmusk` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_profile | `screen_name=$inputs.screen_name` | `$.data.screen_name → screen_name` | STOP |
| s2 | get_user_tweets | `screen_name=$s1.screen_name` | `→ tweets` | SKIP |

### Output
- profile（必有）
- tweets（可选）

### Fallback
s1 失败 → 可降级用 search_tweets（search_type=People）取候选
s2 失败 → 返回资料 + "推文列表暂不可取"

---

## Recipe: profile_with_media · 用户资料+媒体

> ✋ 用户语义命中：「用户图片」「ta的图片」「用户视频」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| screen_name | ✓ | string | 用户名，如 `elonmusk` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_profile | `screen_name=$inputs.screen_name` | `$.data.screen_name → screen_name` | STOP |
| s2 | get_user_media | `screen_name=$s1.screen_name` | `→ media` | SKIP |

### Output
- profile（必有）
- media（可选；空=暂无媒体）

### Fallback
s2 空数据 → 返回资料 + "暂无媒体"

---

## Recipe: profile_with_replies · 用户资料+回复

> ✋ 用户语义命中：「用户回复」「ta的回复」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| screen_name | ✓ | string | 用户名，如 `elonmusk` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_profile | `screen_name=$inputs.screen_name` | `$.data.screen_name → screen_name` | STOP |
| s2 | get_user_replies | `screen_name=$s1.screen_name` | `→ replies` | SKIP |

### Output
- profile（必有）
- replies（可选；空=暂无回复）

### Fallback
s2 空数据 → 返回资料 + "暂无回复"

---

## Recipe: user_social_circle · 用户社交圈

> ✋ 用户语义命中：「关注粉丝」「社交关系」「社交圈」
> 估算：3 次调用 · ~3K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| screen_name | ✓ | string | 用户名，如 `elonmusk` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_profile | `screen_name=$inputs.screen_name` | `$.data.screen_name → screen_name` | STOP |
| s2 | get_followers | `screen_name=$s1.screen_name` | `→ followers` | SKIP |
| s3 | get_followings | `screen_name=$s1.screen_name` | `→ followings` | SKIP |

### Output
- profile（必有）
- followers（可选）
- followings（可选）

### Fallback
s2/s3 任一失败 → 返回另一份 + 告知缺失

---

## Recipe: profile_with_highlights · 用户资料+高光推文

> ✋ 用户语义命中：「高光推文」「精选推文」「高光」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| screen_name | ✓ | string | 用户名，如 `elonmusk` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_profile | `screen_name=$inputs.screen_name` | `$.data.rest_id → rest_id` | STOP |
| s2 | get_highlights | `userId=$s1.rest_id` | `→ highlights` | SKIP |

### Output
- profile（必有）
- highlights（可选；空=无高光推文）

### Fallback
s2 空数据 → 返回资料 + "无高光推文"

---

## Recipe: user_tweets_to_detail · 用户推文→推文详情

> ✋ 用户语义命中：「看某条推文详情」「推文详情」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| screen_name | ✓ | string | 用户名，如 `elonmusk` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_user_tweets | `screen_name=$inputs.screen_name` | `$.data.tweets[0].tweet_id → tweet_id` | STOP |
| s2 | cross_ref:content.md#get_tweet | `tweet_id=$s1.tweet_id` | `→ tweet_detail` | SKIP |

### Output
- tweets（必有）
- tweet_detail（可选）

### Fallback
s1 空数据 → 返回"该用户暂无推文"

---

## Recipe: search_user_to_profile · 搜索用户→用户主页

> ✋ 用户语义命中：「搜用户」「找用户」「搜索用户名」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| keyword | ✓ | string | 用户名或关键字 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | cross_ref:content.md#search_tweets | `keyword=$inputs.keyword, search_type=People` | `$.data.users[0].screen_name → screen_name` | STOP |
| s2 | get_profile | `screen_name=$s1.screen_name` | `→ profile` | SKIP |

### Output
- search_results（必有）
- profile（可选）

### Fallback
s1 空结果 → STOP，告知用户"用户名未命中"
