# Recipe: 数据分析 / Analytics

> 数据分析域编排链路，覆盖视频统计、虚假流量检测、评论关键词、创作者里程碑等场景。

---

## video_metrics — 视频详情→视频统计

**Inputs:** `aweme_id`
**Atomic Steps:**
1. `cross_ref:video.md#get_video_v3` (starter) → 输出 `$.data.data.aweme_id`
2. `get_video_metrics` (starter) ← `item_id` → 输出视频统计数据（含 14 天趋势）
**Output:** 视频详情 + 统计数据
**Fallback:** 跨文件链路

---

## fake_views_detect — 视频统计→虚假流量检测

**Inputs:** `item_id`
**Atomic Steps:**
1. `get_video_metrics` (starter) ← `item_id` → 输出统计数据
2. `detect_fake_views` (terminal) ← `item_id` → 输出虚假流量检测（8 维度 20+ 指标）
**Output:** 视频统计 + 虚假流量检测报告
**Fallback:** 第 1 步失败：STOP

---

## video_comment_keywords — 视频详情→评论关键词

**Inputs:** `aweme_id`
**Atomic Steps:**
1. `cross_ref:video.md#get_video_v3` (starter) → 输出 `$.data.data.aweme_id`
2. `get_comment_keywords` (terminal) ← `item_id` → 输出评论关键词分析
**Output:** 视频详情 + 评论关键词
**Fallback:** 跨文件链路

---

## creator_milestones — 用户详情→创作者里程碑

**Inputs:** `sec_user_id`
**Atomic Steps:**
1. `cross_ref:user.md#get_user` (starter) → 输出 `$.data.data.user.uid`
2. `get_creator_milestones` (terminal) ← `user_id` → 输出创作者信息与里程碑
**Output:** 用户信息 + 创作者里程碑
**Fallback:** 跨文件链路

---

## cross_verify_metrics — 虚假流量检测→视频统计交叉验证

**Inputs:** `item_id`
**Atomic Steps:**
1. `detect_fake_views` (terminal) ← `item_id` → 输出虚假流量检测
2. `get_video_metrics` (starter) ← `item_id` → 输出统计数据（交叉验证）
**Output:** 虚假流量检测 + 统计数据交叉验证
**Fallback:** 第 1 步失败：STOP

---

## comment_keywords_to_replies — 评论关键词→评论列表

**Inputs:** `item_id`
**Atomic Steps:**
1. `get_comment_keywords` (terminal) ← `item_id` → 输出 `key_words[].comments[].cid`
2. `cross_ref:comments.md#get_comment_replies` (relay) ← `comment_id` → 输出评论回复
**Output:** 评论关键词 + 评论回复
**Fallback:** 跨文件链路
