# Recipe: 电商 / Shop

> 电商域编排链路，覆盖商品搜索→详情、搜索建议→搜索、商品详情→评论/商家列表等场景。

---

## shop_search_detail — 搜索商品→商品详情

**Inputs:** `search_word`, `region`
**Atomic Steps:**
1. `search_products` (starter) ← `search_word` + `region` → 输出 `products[].product_id`
2. `get_product_detail` (starter) ← `product_id` + `region` → 输出商品详情
**Output:** 搜索结果 + 商品详情
**Fallback:** 第 1 步失败：STOP

---

## shop_suggest_search — 搜索建议→搜索商品

**Inputs:** `search_word`, `region`
**Atomic Steps:**
1. `get_search_suggest` (starter) ← `search_word` + `region` → 输出建议关键词
2. `search_products` (starter) ← `search_word` + `region` → 输出商品列表
**Output:** 搜索建议 + 商品列表
**Fallback:** 第 1 步失败：直接搜索

---

## shop_detail_reviews — 商品详情→商品评论

**Inputs:** `product_id`, `region`
**Atomic Steps:**
1. `get_product_detail` (starter) ← `product_id` + `region` → 输出商品详情
2. `get_product_reviews` (terminal) ← `product_id` + `region` → 输出商品评论
**Output:** 商品详情 + 商品评论
**Fallback:** 第 1 步失败：STOP

---

## shop_detail_seller — 商品详情→商家商品列表

**Inputs:** `product_id`, `seller_id`, `region`
**Atomic Steps:**
1. `get_product_detail` (starter) ← `product_id` + `region` → 输出 `seller_id`
2. `get_seller_products` (relay) ← `seller_id` + `region` → 输出商家商品列表
**Output:** 商品详情 + 商家商品列表
**Fallback:** 第 1 步失败：STOP
