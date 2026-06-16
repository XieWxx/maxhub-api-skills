# Recipe: 直播 / Live

> 直播域编排链路，覆盖直播流+排行/商品/弹幕、ID 转换、直播状态、商品 SKU/评价/优惠券等场景。

---

## live_gift_rank — 看直播+送礼排行

**Inputs:** `webcast_id`
**Atomic Steps:**
1. `get_live_by_webcast` (starter) ← `webcast_id` → 输出 `$.data.room_id`
2. `get_live_gift_rank` (terminal) ← `room_id` → 输出送礼排行
**Output:** 直播流数据 + 送礼排行
**Fallback:** 第 1 步失败：STOP；第 2 步失败：返回直播流 + "排行暂不可取"

---

## live_products — 看直播+商品列表

**Inputs:** `webcast_id`
**Atomic Steps:**
1. `get_live_by_webcast` (starter) ← `webcast_id` → 输出 `$.data.room_id` + `$.data.author.id`
2. `get_live_products` (starter) ← `room_id` + `author_id` → 输出商品列表
**Output:** 直播流数据 + 商品列表
**Fallback:** 第 1 步失败：STOP；第 2 步失败：返回直播流 + "商品暂不可取"

---

## live_danmaku_ws — 看直播+弹幕

**Inputs:** `webcast_id`
**Atomic Steps:**
1. `get_live_by_webcast` (starter) ← `webcast_id` → 输出 `$.data.room_id`
2. `get_live_room` (relay) ← `room_id` → 输出弹幕 WebSocket 连接信息
**Output:** 直播流数据 + 弹幕连接参数
**Fallback:** 第 2 步失败：返回直播流 + "弹幕暂不可取"

---

## webcast_to_live — webcast_id→room_id→直播流

**Inputs:** `webcast_id`
**Atomic Steps:**
1. `webcast_to_room` (relay) ← `webcast_id` → 输出 `$.data.room_id`
2. `get_live_by_room` (starter) ← `room_id` → 输出直播流数据
**Output:** 直播流数据
**Fallback:** 第 1 步失败：STOP

---

## uid_live_status — uid→直播状态+直播流

**Inputs:** `uid`
**Atomic Steps:**
1. `get_live_status` (starter) ← `uid` → 输出 `$.data.room_id`
2. `get_live_by_room` (starter) ← `room_id` → 输出直播流数据
**Output:** 直播状态 + 直播流数据
**Fallback:** 第 1 步返回未开播：STOP，告知用户

---

## product_sku — 商品列表→SKU

**Inputs:** `room_id`, `product_id`, `author_id`
**Atomic Steps:**
1. `get_live_products` (starter) ← `room_id` → 输出 `$.data.product_id` + `$.data.author_id`
2. `get_product_sku` (terminal) ← `product_id` + `author_id` → 输出 SKU 列表
**Output:** 商品列表 + SKU 详情
**Fallback:** 第 1 步失败：STOP

---

## product_review — 商品列表→评价

**Inputs:** `room_id`, `product_id`, `shop_id`
**Atomic Steps:**
1. `get_live_products` (starter) ← `room_id` → 输出 `$.data.product_id` + `$.data.shop_id`
2. `get_product_review_score` (terminal) ← `product_id` + `shop_id` → 输出评价评分
3. `get_product_reviews` (terminal) ← `product_id` + `shop_id` → 输出评价列表
**Output:** 商品列表 + 评价评分 + 评价列表
**Fallback:** 第 2 步失败：返回商品列表 + "评价暂不可取"

---

## product_coupon — 商品列表→优惠券

**Inputs:** `room_id`, `product_id`, `shop_id`, `sec_user_id`
**Atomic Steps:**
1. `get_live_products` (starter) ← `room_id` → 输出 `$.data.product_id` + `$.data.shop_id` + `$.data.author_id`
2. `get_product_coupon` (terminal) ← `product_id` + `shop_id` + `price` + `author_id` + `sec_user_id` → 输出优惠券
**Output:** 商品列表 + 优惠券信息
**Fallback:** 需从 user.md 获取 sec_user_id
