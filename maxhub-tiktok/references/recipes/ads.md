# Recipe: 广告 / Ads

> 广告域编排链路，覆盖广告搜索→详情/关键帧/百分位/互动分析、广告详情→推荐等场景。

---

## ad_search_detail — 广告搜索→广告详情

**Inputs:** `keyword`, `industry`
**Atomic Steps:**
1. `search_ads` (starter) ← `keyword` + `industry` → 输出 `materials[].id`
2. `get_ad_detail` (starter) ← `ads_id` → 输出广告详情
**Output:** 搜索结果 + 广告详情
**Fallback:** 第 1 步失败：STOP

---

## ad_search_keyframe — 广告搜索→关键帧分析

**Inputs:** `keyword`
**Atomic Steps:**
1. `search_ads` (starter) ← `keyword` → 输出 `materials[].id`
2. `get_ad_keyframe` (terminal) ← `material_id` → 输出关键帧留存分析
**Output:** 搜索结果 + 关键帧分析
**Fallback:** 第 1 步失败：STOP

---

## ad_search_percentile — 广告搜索→百分位分析

**Inputs:** `keyword`
**Atomic Steps:**
1. `search_ads` (starter) ← `keyword` → 输出 `materials[].id`
2. `get_ad_percentile` (terminal) ← `material_id` → 输出百分位排名
**Output:** 搜索结果 + 百分位分析
**Fallback:** 第 1 步失败：STOP

---

## ad_search_interactive — 广告搜索→互动分析

**Inputs:** `keyword`
**Atomic Steps:**
1. `search_ads` (starter) ← `keyword` → 输出 `materials[].id`
2. `get_ad_interactive` (terminal) ← `material_id` → 输出互动时间分析
**Output:** 搜索结果 + 互动分析
**Fallback:** 第 1 步失败：STOP

---

## ad_detail_recommend — 广告详情→推荐广告

**Inputs:** `ads_id`
**Atomic Steps:**
1. `get_ad_detail` (starter) ← `ads_id` → 输出 `id`
2. `get_recommended_ads` (terminal) ← `material_id` → 输出相似推荐广告
**Output:** 广告详情 + 推荐广告
**Fallback:** 第 1 步失败：STOP
