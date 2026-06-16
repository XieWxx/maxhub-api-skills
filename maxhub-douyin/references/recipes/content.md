# Recipe: 内容指数 / Content Index

> 内容指数域编排链路，覆盖关键词趋势/画像/关联词、达人搜索/分析/对比、品牌分析、话题搜索、创作指南、洞察报告等场景。

---

## keyword_trend — 查关键词趋势

**Inputs:** `keyword_list`
**Atomic Steps:**
1. `get_valid_date` (starter) → 输出 `$.data.keyword.date_list[-1]`
2. `get_keyword_trend` (starter) ← `keyword_list` + `end_date` → 输出热度趋势
**Output:** 关键词热度趋势
**Fallback:** 日期获取失败：使用近 7 天日期估算

---

## keyword_trend_portrait — 查关键词趋势+画像

**Inputs:** `keyword_list`, `start_date`, `end_date`
**Atomic Steps:**
1. `get_keyword_trend` (starter) ← `keyword_list` → 输出趋势数据
2. `get_portrait` (terminal) ← `keyword` + `start_date` + `end_date` → 输出人群画像
**Output:** 关键词趋势 + 人群画像
**Fallback:** 趋势获取失败：STOP

---

## keyword_relation — 查关键词关联词

**Inputs:** `keyword_list`
**Atomic Steps:**
1. `get_keyword_trend` (starter) ← `keyword_list` → 输出趋势数据
2. `get_relation_word` (terminal) ← `keyword` → 输出关联词
**Output:** 关键词趋势 + 关联词
**Fallback:** 趋势获取失败：STOP

---

## daren_search_detail — 搜索达人→达人详情

**Inputs:** `keyword`
**Atomic Steps:**
1. `search_daren` (starter) ← `keyword` → 输出 `$.data.user_list[].user_id`
2. `get_daren_mile` (terminal) ← `user_id` → 输出达人核心指标
**Output:** 达人搜索结果 + 核心指标
**Fallback:** 搜索失败：STOP

---

## daren_search_fans — 搜索达人→达人粉丝

**Inputs:** `keyword`
**Atomic Steps:**
1. `search_daren` (starter) ← `keyword` → 输出 `$.data.user_list[].user_id`
2. `get_daren_fans` (terminal) ← `user_id` → 输出达人粉丝分析
**Output:** 达人搜索结果 + 粉丝分析
**Fallback:** 搜索失败：STOP

---

## daren_search_video — 搜索达人→达人视频

**Inputs:** `keyword`
**Atomic Steps:**
1. `search_daren` (starter) ← `keyword` → 输出 `$.data.user_list[].user_id`
2. `get_daren_top_video` (terminal) ← `user_id` → 输出达人热门视频
**Output:** 达人搜索结果 + 热门视频
**Fallback:** 搜索失败：STOP

---

## daren_search_similar — 搜索达人→相似达人

**Inputs:** `keyword`
**Atomic Steps:**
1. `search_daren` (starter) ← `keyword` → 输出 `$.data.user_list[].user_id`
2. `get_similar_daren` (terminal) ← `user_id` → 输出相似达人
**Output:** 达人搜索结果 + 相似达人
**Fallback:** 搜索失败：STOP

---

## daren_compare — 达人对比

**Inputs:** `keyword`
**Atomic Steps:**
1. `search_daren` (starter) ← `keyword` → 输出 `$.data.user_list[].user_id`（最多 5 个）
2. `compare_daren` (terminal) ← `user_list` → 输出达人趋势对比
**Output:** 达人搜索结果 + 趋势对比
**Fallback:** 搜索失败：STOP

---

## uid_encrypt_daren — uid加密→达人分析

**Inputs:** `uid`
**Atomic Steps:**
1. `encrypt_uid` (relay) ← `uid` → 输出 `$.data.user_id`
2. `get_daren_mile` (terminal) ← `user_id` → 输出达人核心指标
**Output:** 达人核心指标
**Fallback:** 加密失败：STOP

---

## brand_search_trend — 品牌搜索→品牌趋势

**Inputs:** `keyword`
**Atomic Steps:**
1. `search_brand` (starter) ← `keyword` → 输出 `$.data.brand_list[].brand_name`
2. `get_brand_lines` (terminal) ← `brand_name` → 输出品牌趋势线
**Output:** 品牌搜索结果 + 趋势线
**Fallback:** 搜索失败：STOP

---

## brand_search_radar — 品牌搜索→品牌雷达

**Inputs:** `keyword`
**Atomic Steps:**
1. `search_brand` (starter) ← `keyword` → 输出 `$.data.brand_list[].brand_name`
2. `get_brand_radar` (terminal) ← `brand_name` → 输出品牌雷达图
**Output:** 品牌搜索结果 + 雷达图
**Fallback:** 搜索失败：STOP

---

## topic_search_detail — 话题搜索→话题详情

**Inputs:** `keyword`
**Atomic Steps:**
1. `search_topic` (starter) ← `keyword` → 输出 `$.data.topic_list[].keyword`
2. `get_topic_query` (terminal) ← `keyword` → 输出话题详情
**Output:** 话题搜索结果 + 话题详情
**Fallback:** 搜索失败：STOP

---

## creative_guide — 创作指南链路

**Inputs:** `tag_id`, `end_date`
**Atomic Steps:**
1. `get_content_valid_date` (starter) → 输出 `$.data.end_date`
2. `get_creative_keywords` (starter) ← `end_date` + `tag_id` → 输出 `$.data.keywords[].keyword`
3. `get_creative_keyword_items` (terminal) ← `keyword` + `end_date` → 输出关键词相关视频
**Output:** 创作热门关键词 + 相关视频
**Fallback:** 日期获取失败：STOP

---

## creative_hot_topic — 创作热门话题

**Inputs:** `end_date`, `tag_id`
**Atomic Steps:**
1. `get_content_valid_date` (starter) → 输出 `$.data.end_date`
2. `get_creative_topic` (terminal) ← `end_date` + `tag_id` → 输出热门话题
**Output:** 创作热门话题
**Fallback:** 日期获取失败：STOP

---

## report_search_detail — 报告搜索→报告详情

**Inputs:** `keyword`
**Atomic Steps:**
1. `search_report` (starter) ← `keyword` → 输出 `$.data.list[].report_id`
2. `get_report_detail` (terminal) ← `report_id` → 输出报告详情
3. `get_insight_rec` (terminal) ← `report_id` → 输出报告相关推荐
**Output:** 搜索结果 + 报告详情 + 相关推荐
**Fallback:** 搜索失败：STOP
