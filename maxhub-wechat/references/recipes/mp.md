# Recipes: 公众号 / 公众号

> 本文件包含公众号领域的全部编排 Recipe。每个 Recipe 封装一个用户目标的多步链式调用。

---

## Recipe: article_with_stats · 文章详情+互动数据

> ✋ 用户语义命中：「文章数据」「阅读量」「点赞数」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| url | ✓ | string | startsWith=`https://mp.weixin.qq.com/s/` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_article | `url=$inputs.url` | `→ article_detail` | STOP |
| s2 | get_article_stats | `url=$inputs.url` | `→ stats` | SKIP |

### Output
- article_detail（必有）
- stats（可选）

### Fallback
s2 失败 → 返回文章详情 + "互动数据暂不可取"

---

## Recipe: article_with_comments · 文章+评论

> ✋ 用户语义命中：「文章评论」「看评论」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| url | ✓ | string | startsWith=`https://mp.weixin.qq.com/s/` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_article | `url=$inputs.url` | `→ article_detail` | STOP |
| s2 | get_mp_comments | `url=$inputs.url` | `$.data.comments[N].content_id → content_id` | SKIP |

### Output
- article_detail（必有）
- comments（可选）

### Fallback
s2 失败 → 返回文章详情 + "评论暂不可取"

---

## Recipe: comments_with_replies · 评论+回复

> ✋ 用户语义命中：「评论回复」「看回复」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| url | ✓ | string | startsWith=`https://mp.weixin.qq.com/s/` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_mp_comments | `url=$inputs.url` | `$.data.comments[N].content_id → content_id` | STOP |
| s2 | get_mp_replies | `url=$inputs.url, content_id=$s1.content_id` | `→ replies` | SKIP |

### Output
- comments（必有）
- replies（可选）

### Fallback
s2 失败 → 返回评论 + "回复暂不可取"

---

## Recipe: article_with_related · 文章+关联文章

> ✋ 用户语义命中：「关联文章」「相关文章」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| url | ✓ | string | startsWith=`https://mp.weixin.qq.com/s/` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_article | `url=$inputs.url` | `→ article_detail` | STOP |
| s2 | get_related | `url=$inputs.url` | `→ related_articles` | SKIP |

### Output
- article_detail（必有）
- related_articles（可选；空=暂无关联文章）

### Fallback
s2 空数据 → 返回文章详情 + "暂无关联文章"

---

## Recipe: article_with_author · 文章+公众号主页

> ✋ 用户语义命中：「文章作者」「哪个号」「谁发的」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| url | ✓ | string | startsWith=`https://mp.weixin.qq.com/s/` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_article | `url=$inputs.url` | `$.data.content.user_name → username` | STOP |
| s2 | get_mp_profile | `username=$s1.username` | `→ profile` | SKIP |

### Output
- article_detail（必有）
- profile（可选）

### Fallback
s2 失败 → 返回文章详情 + "公众号资料暂不可取"

---

## Recipe: mp_profile_articles · 公众号资料+文章列表

> ✋ 用户语义命中：「公众号文章」「历史文章」
> 估算：2 次调用 · ~2K token · 中间步可降级

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| username | ✓ | string | startsWith=`gh_` |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| s1 | get_mp_profile | `username=$inputs.username` | `→ profile` | STOP |
| s2 | get_mp_articles | `username=$inputs.username` | `→ articles` | SKIP |

### Output
- profile（必有）
- articles（可选）

### Fallback
s2 失败 → 返回资料 + "文章列表暂不可取"
