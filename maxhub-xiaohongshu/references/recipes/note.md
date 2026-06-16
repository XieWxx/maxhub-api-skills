## Recipe: search_note_then_detail · 搜索笔记看详情

> ✋ 用户语义命中：「搜笔记」「找笔记」「笔记详情」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| keyword | yes | string | 搜索关键词 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | search_notes | keyword → keyword | `$.data.items[].note_id` → note_id | STOP，告知未找到 |
| 2 | get_image_note_detail | note_id → note_id | — | 返回搜索概要 + "详情暂不可取" |

### Output
- 笔记详情（必有）
- 搜索结果列表（第 2 步失败时可选）

### Fallback
全部失败 → 告知用户关键词未命中，建议换词

---

## Recipe: search_user_then_profile · 搜索用户看主页

> ✋ 用户语义命中：「搜用户」「找博主」「用户主页」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| keyword | yes | string | 用户名/昵称 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | search_users | keyword → keyword | `$.data.users[].user_id` → user_id | STOP，告知未找到 |
| 2 | get_user_info | user_id → user_id | — | 返回搜索概要 |

### Output
- 用户资料（必有）
- 搜索候选列表（第 2 步失败时可选）

### Fallback
全部失败 → 告知用户名未命中

---

## Recipe: search_product_then_detail · 搜商品看详情

> ✋ 用户语义命中：「搜商品」「找商品」「商品详情」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| keyword | yes | string | 商品关键词 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | search_products | keyword → keyword | `$.data.items[].sku_id` → sku_id | STOP |
| 2 | get_product_detail | sku_id → sku_id | — | 返回搜索概要 |

### Output
- 商品详情（必有）

### Fallback
全部失败 → 告知关键词未命中

---

## Recipe: note_detail_then_comments · 笔记详情加评论

> ✋ 用户语义命中：「笔记评论」「看评论」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| note_id | yes | string | 24 位 hex |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | get_image_note_detail | note_id → note_id | `$.data.note_id` → note_id | STOP |
| 2 | get_note_comments | note_id → note_id | — | 返回笔记详情 + "评论暂不可取" |

### Output
- 笔记详情（必有）
- 评论列表（可选）

### Fallback
全部失败 → 告知笔记不存在

---

## Recipe: note_comments_then_replies · 评论展开回复

> ✋ 用户语义命中：「看回复」「评论回复」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| note_id | yes | string | 24 位 hex |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | get_note_comments | note_id → note_id | `$.data.data.comments[].comment_id` → comment_id | STOP |
| 2 | get_note_sub_comments | comment_id → comment_id | — | 返回已有评论 + "回复缺失" |

### Output
- 评论列表（必有）
- 回复列表（可选）

### Fallback
全部失败 → 告知评论不可取

---

## Recipe: note_detail_then_author · 笔记看作者主页

> ✋ 用户语义命中：「作者」「博主主页」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| note_id | yes | string | 24 位 hex |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | get_image_note_detail | note_id → note_id | `$.data.user.user_id` → user_id | STOP |
| 2 | cross_ref:user.md#get_user_info | user_id → user_id | — | 返回笔记详情 + "作者主页暂不可取" |

### Output
- 笔记详情（必有）
- 作者资料（可选）

### Fallback
全部失败 → 告知笔记不存在

---

## Recipe: user_profile_then_notes · 用户资料加笔记

> ✋ 用户语义命中：「用户笔记」「主页笔记」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| user_id | yes | string | 24 位 hex |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | get_user_info | user_id → user_id | `$.data.data.user_id` → user_id | STOP |
| 2 | get_user_posted_notes | user_id → user_id | — | 返回资料 + "笔记列表暂不可取" |

### Output
- 用户资料（必有）
- 笔记列表（可选）

### Fallback
全部失败 → 告知用户不存在

---

## Recipe: user_notes_then_detail · 用户笔记看详情

> ✋ 用户语义命中：「笔记详情」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| user_id | yes | string | 24 位 hex |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | get_user_posted_notes | user_id → user_id | `$.data.data.notes[].note_id` → note_id | STOP |
| 2 | cross_ref:note.md#get_image_note_detail | note_id → note_id | — | 返回笔记列表概要 |

### Output
- 笔记详情（必有）
- 笔记列表（第 2 步失败时可选）

### Fallback
全部失败 → 告知用户无笔记

---

## Recipe: product_detail_then_reviews · 商品详情加评论

> ✋ 用户语义命中：「商品评论」「买家评价」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| sku_id | yes | string | 商品 SKU ID |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | get_product_detail | sku_id → sku_id | sku_id 复用 | STOP |
| 2 | get_product_review_overview | sku_id → sku_id | — | 返回商品详情 + "评论暂不可取" |

### Output
- 商品详情（必有）
- 评论总览（可选）

### Fallback
全部失败 → 告知商品不存在

---

## Recipe: product_detail_then_recommend · 商品详情加推荐

> ✋ 用户语义命中：「推荐商品」「相似商品」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| sku_id | yes | string | 商品 SKU ID |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | get_product_detail | sku_id → sku_id | sku_id 复用 | STOP |
| 2 | get_product_recommendations | sku_id → sku_id | — | 返回商品详情 + "暂无推荐" |

### Output
- 商品详情（必有）
- 推荐列表（可选）

### Fallback
全部失败 → 告知商品不存在

---

## Recipe: topic_info_then_feed · 话题详情看笔记

> ✋ 用户语义命中：「话题笔记」「话题内容」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| page_id | yes | string | 话题页面 ID |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | get_topic_info | page_id → page_id | `$.data.page_id` → page_id | STOP |
| 2 | get_topic_feed | page_id → page_id | — | 返回话题详情 + "暂无笔记" |

### Output
- 话题详情（必有）
- 笔记列表（可选）

### Fallback
全部失败 → 告知话题不存在

---

## Recipe: trending_then_search · 热搜词搜笔记

> ✋ 用户语义命中：「热搜」「热门搜索」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| — | — | — | 无需输入 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | fetch_trending | — | `$.data.queries[].query` → keyword | 让用户自行输入关键词 |
| 2 | search_notes | keyword → keyword | — | 返回热搜列表 |

### Output
- 热搜词列表（必有）
- 搜索结果（可选）

### Fallback
全部失败 → 告知热搜暂不可取

---

## Recipe: hot_list_then_detail · 热榜看笔记详情

> ✋ 用户语义命中：「热榜」「热门笔记」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| — | — | — | 无需输入 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | fetch_hot_list | — | `$.data.items[].note_id` → note_id | STOP |
| 2 | cross_ref:note.md#get_image_note_detail | note_id → note_id | — | 返回热榜概要 |

### Output
- 热榜列表（必有）
- 笔记详情（可选）

### Fallback
全部失败 → 告知热榜暂不可取

---

## Recipe: homefeed_then_detail · 推荐看笔记详情

> ✋ 用户语义命中：「推荐」「首页推荐」
> 估算：2 次调用 · ~2K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| — | — | — | 无需输入 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | fetch_homefeed | — | `$.data.items[].note_id` → note_id | STOP |
| 2 | cross_ref:note.md#get_image_note_detail | note_id → note_id | — | 返回推荐概要 |

### Output
- 推荐列表（必有）
- 笔记详情（可选）

### Fallback
全部失败 → 告知推荐暂不可取

---

## Recipe: share_link_to_detail · 分享链接看详情

> ✋ 用户语义命中：「分享链接」「打开链接」
> 估算：1 次调用 · ~1K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| share_text | yes | string | xhslink.com 链接 |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | get_image_note_detail | share_text → share_text | — | STOP |

### Output
- 笔记详情（必有）

### Fallback
全部失败 → 告知链接无效

---

## Recipe: full_note_with_comments_replies · 笔记全链路详情评论回复

> ✋ 用户语义命中：「完整笔记」「详情评论回复」
> 估算：3 次调用 · ~3K token

### Inputs
| name | required | type | constraint |
|------|---------|------|------------|
| note_id | yes | string | 24 位 hex |

### Atomic Steps
| step | atom | in_map | extract (json_path → var) | on_err |
|------|------|--------|---------------------------|--------|
| 1 | get_image_note_detail | note_id → note_id | `$.data.note_id` → note_id | STOP |
| 2 | get_note_comments | note_id → note_id | `$.data.data.comments[].comment_id` → comment_id | 返回笔记详情 + "评论暂不可取" |
| 3 | get_note_sub_comments | comment_id → comment_id | — | 返回截止数据 + "回复缺失" |

### Output
- 笔记详情（必有）
- 评论列表（可选）
- 回复列表（可选）

### Fallback
全部失败 → 告知笔记不存在
