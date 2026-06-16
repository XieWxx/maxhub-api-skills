# Recipe: 创作者 / Creator

> 创作者域编排链路，覆盖账号健康/违规、收益/直播/视频概览、视频-商品关联等场景。所有端点需要 cookie 认证。

---

## account_health_violations — 账号信息→账号健康→违规记录

**Inputs:** `cookie`
**Atomic Steps:**
1. `get_creator_account` (starter) ← `cookie` → 输出 `user_id`
2. `get_account_health` (starter) ← `cookie` → 输出健康状态和违规积分
3. `get_account_violations` (terminal) ← `cookie` → 输出违规记录列表
**Output:** 账号信息 + 健康状态 + 违规记录
**Fallback:** 第 1 步失败：STOP

---

## account_insights_live — 账号信息→收益概览→直播概览

**Inputs:** `cookie`, `start_date`
**Atomic Steps:**
1. `get_creator_account` (starter) ← `cookie` → 输出账号信息
2. `get_account_insights` (starter) ← `cookie` + `start_date` → 输出收益概览
3. `get_live_summary` (terminal) ← `cookie` + `start_date` → 输出直播概览
**Output:** 账号信息 + 收益概览 + 直播概览
**Fallback:** 第 1 步失败：STOP

---

## account_video_analytics — 账号信息→视频概览→视频列表

**Inputs:** `cookie`
**Atomic Steps:**
1. `get_creator_account` (starter) ← `cookie` → 输出账号信息
2. `get_video_summary` (terminal) ← `cookie` → 输出视频概览
3. `get_video_list_analytics` (starter) ← `cookie` → 输出视频列表及详细数据
**Output:** 账号信息 + 视频概览 + 视频列表
**Fallback:** 第 1 步失败：STOP

---

## video_product_stats — 视频列表→视频关联商品

**Inputs:** `cookie`
**Atomic Steps:**
1. `get_video_list_analytics` (starter) ← `cookie` → 输出视频列表
2. `get_video_products` (terminal) ← `cookie` → 输出视频关联商品列表
**Output:** 视频列表 + 关联商品
**Fallback:** 第 1 步失败：STOP

---

## product_related_videos — 商品→关联视频

**Inputs:** `cookie`, `product_id`
**Atomic Steps:**
1. `get_product_analytics` (terminal) ← `cookie` → 输出商品列表
2. `get_product_videos` (terminal) ← `cookie` + `product_id` → 输出关联视频
**Output:** 商品列表 + 关联视频
**Fallback:** 第 1 步失败：STOP
