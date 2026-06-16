# Recipe: 搜索 / Search

> 搜索域编排链路，覆盖视频/用户/话题/音乐搜索后链式调用、搜索洞察、直播推荐等场景。

---

## search_video_detail — 搜索视频→看详情

**Inputs:** `keyword`
**Atomic Steps:**
1. `search_video` (starter) ← `keyword` → 输出 `$.data.data.video_list[].aweme_id`
2. `cross_ref:video.md#get_video_v3` (starter) ← `aweme_id` → 输出视频详情
**Output:** 搜索结果 + 视频详情
**Fallback:** 跨文件链路

---

## search_user_profile — 搜索用户→看主页

**Inputs:** `keyword`
**Atomic Steps:**
1. `search_user` (starter) ← `keyword` → 输出 `$.data.data.user_list[].user.uid`
2. `cross_ref:user.md#get_user` (starter) ← `user_id` → 输出用户信息
**Output:** 搜索结果 + 用户信息
**Fallback:** 跨文件链路

---

## hashtag_search_videos — 话题搜索→话题详情→视频

**Inputs:** `keyword`
**Atomic Steps:**
1. `search_hashtag` (starter) ← `keyword` → 输出 `ch_id`
2. `get_hashtag_detail` (starter) ← `ch_id` → 输出话题详情
3. `get_hashtag_videos` (relay) ← `ch_id` → 输出话题视频列表
**Output:** 话题搜索 + 话题详情 + 视频列表
**Fallback:** 第 1 步空：STOP

---

## music_search_videos — 音乐搜索→音乐详情→视频

**Inputs:** `keyword`
**Atomic Steps:**
1. `search_music` (starter) ← `keyword` → 输出 `music_id`
2. `get_music_detail` (starter) ← `music_id` → 输出音乐详情
3. `get_music_videos` (relay) ← `music_id` → 输出音乐关联视频
**Output:** 音乐搜索 + 音乐详情 + 关联视频
**Fallback:** 第 1 步空：STOP

---

## insights_detail — 搜索洞察→详情/趋势

**Inputs:** `keyword`
**Atomic Steps:**
1. `get_search_insights` (starter) ← `keyword` → 输出 `query_id_str`
2. `get_insights_detail` (terminal) / `get_insights_trend` (terminal) ← `query_id_str` → 输出洞察详情/趋势
**Output:** 搜索洞察 + 详情/趋势
**Fallback:** 第 1 步空：STOP

---

## live_recommend_tabs — 直播推荐标签→推荐

**Inputs:** 无
**Atomic Steps:**
1. `get_live_recommend_tabs` (starter) → 输出 `tag_name`
2. `get_live_recommend` (relay) ← `related_live_tag` → 输出直播推荐列表
**Output:** 直播标签 + 推荐列表
**Fallback:** 第 1 步空：STOP

---

## web_search_paging — Web搜索翻页

**Inputs:** `keyword`, `search_id`（翻页时从上次响应获取）
**Atomic Steps:**
1. `search_general_web` (starter) ← `keyword` → 输出 `$.data.extra.logid`
2. `search_general_web` (starter) ← `keyword` + `search_id` → 输出下一页结果
**Output:** 搜索结果 + 翻页数据
**Fallback:** 同端点翻页
