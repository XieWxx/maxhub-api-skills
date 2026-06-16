# Recipe: 星图 / Xingtu

> 星图域编排链路，覆盖 ID 查找→KOL 分析、KOL 搜索→详情、榜单→创作者、IP 日历等场景。

---

## uid_kol_analysis — uid→KOL分析

**Inputs:** `uid`
**Atomic Steps:**
1. `get_kolid_by_uid` (starter) ← `uid` → 输出 `$.data.kolId`
2. `get_kol_base` (starter) ← `kolId` → 输出 KOL 基本信息
**Output:** KOL 基本信息
**Fallback:** ID 查找失败：STOP

---

## sec_uid_kol_analysis — sec_user_id→KOL分析

**Inputs:** `sec_user_id`
**Atomic Steps:**
1. `get_kolid_by_sec_uid` (starter) ← `sec_user_id` → 输出 `$.data.kolId`
2. `get_kol_base` (starter) ← `kolId` → 输出 KOL 基本信息
**Output:** KOL 基本信息
**Fallback:** ID 查找失败：STOP

---

## kol_search_detail — KOL搜索→KOL详情

**Inputs:** `keyword`
**Atomic Steps:**
1. `search_kol_v2` (starter) ← `keyword` → 输出 `$.data.list[].kolId`
2. `get_kol_base` (starter) ← `kolId` → 输出 KOL 基本信息
**Output:** KOL 搜索结果 + KOL 详情
**Fallback:** 搜索失败：STOP

---

## kol_base_fans — KOL基本信息→粉丝画像

**Inputs:** `kolId`
**Atomic Steps:**
1. `get_kol_base` (starter) ← `kolId` → 输出基本信息
2. `get_kol_fans` (terminal) ← `kolId` → 输出粉丝画像
**Output:** KOL 基本信息 + 粉丝画像
**Fallback:** 基本信息失败：STOP

---

## kol_base_price — KOL基本信息→服务报价

**Inputs:** `kolId`, `platformChannel`
**Atomic Steps:**
1. `get_kol_base` (starter) ← `kolId` → 输出基本信息
2. `get_kol_price` (terminal) ← `kolId` + `platformChannel` → 输出服务报价
**Output:** KOL 基本信息 + 服务报价
**Fallback:** 基本信息失败：STOP

---

## kol_base_overview — KOL基本信息→数据概览

**Inputs:** `kolId`
**Atomic Steps:**
1. `get_kol_base` (starter) ← `kolId` → 输出基本信息
2. `get_kol_overview` (terminal) ← `kolId` → 输出数据概览
**Output:** KOL 基本信息 + 数据概览
**Fallback:** 基本信息失败：STOP

---

## rank_catalog_data — 榜单分类→榜单数据

**Inputs:** 无
**Atomic Steps:**
1. `get_rank_catalog` (starter) → 输出 `$.data.code`
2. `get_rank_data` (relay) ← `code` → 输出达人商业榜数据
**Output:** 榜单分类 + 榜单数据
**Fallback:** 分类获取失败：STOP

---

## rank_author_detail — 榜单→创作者详情

**Inputs:** `code`
**Atomic Steps:**
1. `get_rank_data` (relay) ← `code` → 输出 `$.data.list[].o_author_id`
2. `get_author_base` (starter) ← `o_author_id` → 输出创作者基本信息
**Output:** 榜单数据 + 创作者详情
**Fallback:** 榜单获取失败：STOP

---

## author_business — 创作者基本信息→商业卡片

**Inputs:** `o_author_id`
**Atomic Steps:**
1. `get_author_base` (starter) ← `o_author_id` → 输出基本信息
2. `get_author_business` (terminal) ← `o_author_id` → 输出商业卡片
**Output:** 创作者基本信息 + 商业卡片
**Fallback:** 基本信息失败：STOP

---

## author_videos — 创作者基本信息→视频列表

**Inputs:** `o_author_id`
**Atomic Steps:**
1. `get_author_base` (starter) ← `o_author_id` → 输出基本信息
2. `get_author_videos` (terminal) ← `o_author_id` → 输出视频列表
**Output:** 创作者基本信息 + 视频列表
**Fallback:** 基本信息失败：STOP

---

## ip_industry_activity — IP行业→IP活动→IP详情

**Inputs:** 无
**Atomic Steps:**
1. `get_ip_industry` (starter) → 输出 `$.data.industry_id`
2. `get_ip_activity` (relay) ← `industry_id_list` → 输出 `$.data.list[].id`
3. `get_ip_detail` (terminal) ← `id` → 输出 IP 活动详情
**Output:** IP 行业列表 + 活动列表 + 活动详情
**Fallback:** 行业获取失败：STOP
