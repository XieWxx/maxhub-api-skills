# Recipe: 视频 / Video

> 视频域编排链路，覆盖视频详情+评论/作者/分析、分享链接解析、URL提取、探索页/Tag等场景。

---

## video_comments — 看视频+评论

**Inputs:** `aweme_id`
**Atomic Steps:**
1. `get_video_v3` (starter) ← `aweme_id` → 输出 `$.data.data.aweme_id`
2. `cross_ref:comments.md#get_comments` (starter) ← `aweme_id` → 输出评论列表
**Output:** 视频详情 + 评论列表
**Fallback:** 第 1 步失败：STOP；第 2 步失败：返回视频详情 + "评论暂不可取"

---

## video_author — 看视频+作者主页

**Inputs:** `aweme_id`
**Atomic Steps:**
1. `get_video_v3` (starter) ← `aweme_id` → 输出 `$.data.data.author.sec_uid`
2. `cross_ref:user.md#get_user` (starter) ← `sec_user_id` → 输出用户信息
**Output:** 视频详情 + 作者信息
**Fallback:** 跨文件链路

---

## share_to_video — 分享链接→视频详情

**Inputs:** `share_url`
**Atomic Steps:**
1. `get_video_by_share_v2` (starter) ← `share_url` → 输出 `$.data.data.aweme_id`
2. `get_video_v3` (starter) ← `aweme_id` → 输出视频详情
**Output:** 视频详情
**Fallback:** 第 1 步失败：STOP

---

## url_to_video — URL→aweme_id→视频详情

**Inputs:** `url`
**Atomic Steps:**
1. `extract_aweme_id` (starter) ← `url` → 输出 `$.data.data.aweme_id`
2. `get_video_v3` (starter) ← `aweme_id` → 输出视频详情
**Output:** 视频详情
**Fallback:** 第 1 步失败：STOP

---

## video_analytics — 看视频+分析

**Inputs:** `aweme_id`
**Atomic Steps:**
1. `get_video_v3` (starter) ← `aweme_id` → 输出 `$.data.data.aweme_id`
2. `cross_ref:analytics.md#get_video_metrics` (starter) ← `item_id` → 输出视频统计
**Output:** 视频详情 + 统计数据
**Fallback:** 跨文件链路

---

## explore_to_video — 探索页→视频详情

**Inputs:** `category_id`
**Atomic Steps:**
1. `get_explore` (starter) ← `category_id` → 输出 `$.data.data.itemList[].id`
2. `get_video_v3` (starter) ← `aweme_id` → 输出视频详情
**Output:** 探索页列表 + 首条视频详情
**Fallback:** 第 2 步空：返回探索列表

---

## tag_to_video — Tag→视频详情

**Inputs:** `challengeID`
**Atomic Steps:**
1. `get_tag_post` (starter) ← `challengeID` → 输出 `$.data.data.itemList[].id`
2. `get_video_v3` (starter) ← `aweme_id` → 输出视频详情
**Output:** Tag 视频列表 + 首条视频详情
**Fallback:** 第 2 步空：返回 Tag 列表
