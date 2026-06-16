# Recipe: 搜索 / Search

> 搜索域编排链路，覆盖综合搜索、视频/用户/直播/音乐/话题搜索后链式调用场景。

---

## search_video_detail — 搜索视频→看详情

**Inputs:** `keyword`
**Atomic Steps:**
1. `search_video` (starter) ← `keyword` → 输出 `$.data.data[].aweme_id`
2. `cross_ref:video.md#get_video` (starter) ← `aweme_id` → 输出视频详情
**Output:** 搜索结果 + 视频详情
**Fallback:** 第 1 步失败：STOP；跨文件链路

---

## search_user_profile — 搜索用户→看主页

**Inputs:** `keyword`
**Atomic Steps:**
1. `search_user` (starter) ← `keyword` → 输出 `$.data.user_list[].sec_uid`
2. `cross_ref:user.md#get_user` (starter) ← `sec_user_id` → 输出用户信息
**Output:** 搜索结果 + 用户信息
**Fallback:** 跨文件链路

---

## search_challenge_videos — 搜索话题→看视频

**Inputs:** `keyword`
**Atomic Steps:**
1. `search_challenge` (starter) ← `keyword` → 输出 `$.data.challenge_list[].cid`
2. `cross_ref:video.md#get_hashtag_detail` (starter) ← `ch_id` → 输出话题详情+视频
**Output:** 话题搜索结果 + 话题视频
**Fallback:** 跨文件链路

---

## search_live_detail — 搜索直播→看直播详情

**Inputs:** `keyword`
**Atomic Steps:**
1. `search_live` (starter) ← `keyword` → 输出 `$.data.data[].room_id`
2. `cross_ref:live.md#get_live_by_room` (starter) ← `room_id` → 输出直播详情
**Output:** 搜索结果 + 直播详情
**Fallback:** 跨文件链路

---

## search_music_videos — 搜索音乐→看音乐视频

**Inputs:** `keyword`
**Atomic Steps:**
1. `search_music` (starter) ← `keyword` → 输出 `$.data.music[].music_id`
2. `cross_ref:video.md#get_music_detail` (starter) ← `music_id` → 输出音乐详情+视频
**Output:** 音乐搜索结果 + 音乐视频
**Fallback:** 跨文件链路

---

## general_search_multi — 综合搜索→看视频+看用户

**Inputs:** `keyword`
**Atomic Steps:**
1. `search_general` (starter) ← `keyword` → 输出 `aweme_id` + `sec_uid`
2. `cross_ref:video.md#get_video` ← `aweme_id` + `cross_ref:user.md#get_user` ← `sec_user_id`（可并行）
**Output:** 综合搜索结果 + 视频详情 + 用户信息
**Fallback:** 按需组合

---

## vision_search_video — 以图搜图→看视频

**Inputs:** `image_uri`
**Atomic Steps:**
1. `search_vision` (starter) ← `image_uri` → 输出 `$.data.data[].aweme_id`
2. `cross_ref:video.md#get_video` (starter) ← `aweme_id` → 输出视频详情
**Output:** 相似视频搜索结果 + 视频详情
**Fallback:** 跨文件链路
