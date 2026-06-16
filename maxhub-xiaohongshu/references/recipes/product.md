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
