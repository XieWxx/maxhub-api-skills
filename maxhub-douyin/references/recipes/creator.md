# Recipe: 创作者 / Creator

> 创作者域编排链路，覆盖作品总览+流量/关键词/画像、投稿列表+详情、热点+相关视频等场景。

---

## creator_overview_source — 看作品总览+流量来源

**Inputs:** `cookie`, `item_id`
**Atomic Steps:**
1. `get_item_overview` (starter) ← `cookie` + `item_id` → 输出作品总览数据
2. `get_item_play_source` (terminal) ← `cookie` + `item_id` → 输出流量来源
**Output:** 作品总览 + 流量来源
**Fallback:** 第 1 步失败：STOP

---

## creator_overview_keyword — 看作品总览+搜索关键词

**Inputs:** `cookie`, `item_id`
**Atomic Steps:**
1. `get_item_overview` (starter) ← `cookie` + `item_id` → 输出作品总览数据
2. `get_item_search_keyword` (terminal) ← `cookie` + `item_id` → 输出搜索关键词
**Output:** 作品总览 + 搜索关键词
**Fallback:** 第 2 步失败：返回总览 + "搜索关键词暂不可取"

---

## creator_overview_audience — 看作品总览+观众画像

**Inputs:** `cookie`, `item_id`
**Atomic Steps:**
1. `get_item_overview` (starter) ← `cookie` + `item_id` → 输出作品总览数据
2. `get_item_audience_portrait` (terminal) ← `cookie` + `item_id` → 输出观众画像
**Output:** 作品总览 + 观众画像
**Fallback:** 第 2 步失败：返回总览 + "观众画像暂不可取"

---

## creator_list_overview — 投稿列表→作品详情

**Inputs:** `cookie`
**Atomic Steps:**
1. `get_item_list` (starter) ← `cookie` → 输出 `$.data.items[].item_id`
2. `get_item_overview` (starter) ← `cookie` + `ids` → 输出作品详情
**Output:** 投稿列表 + 作品详情
**Fallback:** 第 1 步失败：STOP

---

## creator_vertical_analysis — 垂类标签→投稿分析

**Inputs:** `cookie`, `item_id`
**Atomic Steps:**
1. `get_item_vertical` (relay) ← `cookie` + `item_id` → 输出 `$.data.primary_verticals[]`
2. `get_item_analysis_overview` (terminal) ← `cookie` + `primary_verticals` → 输出投稿分析概览
**Output:** 垂类标签 + 投稿分析概览
**Fallback:** 第 1 步失败：STOP

---

## hotspot_related — 热点榜单→相关视频

**Inputs:** 无
**Atomic Steps:**
1. `get_hot_spot` (starter) → 输出 `$.data[].query_id`
2. `get_material_related` (terminal) ← `query_id` → 输出相关视频
**Output:** 热点榜单 + 相关视频
**Fallback:** 第 2 步失败：返回榜单 + "相关视频暂不可取"
