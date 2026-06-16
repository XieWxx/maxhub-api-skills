# Recipe: 视频 / Video

> 视频域编排链路，覆盖视频详情、高清链接、统计、评论、相关推荐、弹幕、合集/短剧/音乐/话题、Feed、频道等场景。

---

## video_detail_hd — 看视频+高清链接

**Inputs:** `aweme_id`
**Atomic Steps:**
1. `get_video` (starter) → 输出 `$.data.aweme_id`
2. `get_video_hd` (relay) ← `aweme_id` → 输出高清播放链接
**Output:** 视频详情 + 高清播放链接
**Fallback:** 第 1 步失败：STOP；第 2 步失败：返回视频详情 + "高清链接暂不可取"

---

## video_detail_stats — 看视频+统计

**Inputs:** `aweme_id`
**Atomic Steps:**
1. `get_video` (starter) → 输出 `$.data.aweme_id`
2. `get_video_stats` (terminal) ← `aweme_ids` → 输出统计数据
**Output:** 视频详情 + 统计数据（播放量/点赞数等）
**Fallback:** 第 2 步失败：返回视频详情 + "统计数据暂不可取"

---

## video_detail_comments — 看视频+评论

**Inputs:** `aweme_id`
**Atomic Steps:**
1. `get_video` (starter) → 输出 `$.data.aweme_id`
2. `cross_ref:comments.md#get_comments` (starter) ← `aweme_id` → 输出评论列表
**Output:** 视频详情 + 评论列表
**Fallback:** 跨文件链路，详见 comments.md

---

## video_detail_related — 看视频+相关推荐

**Inputs:** `aweme_id`
**Atomic Steps:**
1. `get_video` (starter) → 输出 `$.data.aweme_id`
2. `get_related_posts` (relay) ← `aweme_id` → 输出相关推荐视频
**Output:** 视频详情 + 相关推荐列表
**Fallback:** 第 2 步空数据：返回视频详情 + "暂无相关推荐"

---

## video_detail_danmaku — 看视频+弹幕

**Inputs:** `aweme_id`
**Atomic Steps:**
1. `get_video_web` (relay) → 输出 `$.data.aweme_id`
2. `get_danmaku` (terminal) ← `item_id` → 输出弹幕数据
**Output:** 视频详情 + 弹幕数据
**Fallback:** 第 2 步失败：返回视频详情 + "弹幕暂不可取"

---

## share_to_video_hd — 分享链接→视频详情+高清

**Inputs:** `share_url`
**Atomic Steps:**
1. `get_video_by_share` (starter) ← `share_url` → 输出 `$.data.aweme_id`
2. `get_video_hd` (relay) ← `aweme_id` → 输出高清播放链接
**Output:** 视频详情 + 高清播放链接
**Fallback:** 第 1 步失败：STOP

---

## feed_to_video — Feed→视频详情

**Inputs:** 无（首页推荐）
**Atomic Steps:**
1. `get_home_feed` (starter) → 输出 `$.data.aweme_list[].aweme_id`
2. `get_video` (starter) ← `aweme_id` → 输出视频详情
**Output:** Feed 列表 + 首条视频详情
**Fallback:** 批量取首条详情

---

## mix_detail_videos — 合集详情+视频列表

**Inputs:** `mix_id`
**Atomic Steps:**
1. `get_mix_detail` (starter) → 输出 `$.data.mix_id`
2. `get_mix_videos` (relay) ← `mix_id` → 输出合集视频列表
**Output:** 合集详情 + 视频列表
**Fallback:** 第 1 步失败：STOP

---

## series_detail_videos — 短剧详情+视频列表

**Inputs:** `series_id`
**Atomic Steps:**
1. `get_series_detail` (starter) → 输出 `$.data.series_id`
2. `get_series_videos` (relay) ← `series_id` → 输出短剧视频列表
**Output:** 短剧详情 + 视频列表
**Fallback:** 第 1 步失败：STOP

---

## music_detail_videos — 音乐详情+视频列表

**Inputs:** `music_id`
**Atomic Steps:**
1. `get_music_detail` (starter) → 输出 `$.data.music_id`
2. `get_music_videos` (relay) ← `music_id` → 输出音乐关联视频
**Output:** 音乐详情 + 关联视频列表
**Fallback:** 第 1 步失败：STOP

---

## hashtag_detail_videos — 话题详情+视频列表

**Inputs:** `ch_id`
**Atomic Steps:**
1. `get_hashtag_detail` (starter) → 输出 `$.data.ch_id`
2. `get_hashtag_videos` (relay) ← `ch_id` → 输出话题视频列表
**Output:** 话题详情 + 视频列表
**Fallback:** 第 1 步失败：STOP

---

## channel_to_video — 频道→视频详情

**Inputs:** `tag_id`
**Atomic Steps:**
1. `get_channel` (starter) → 输出 `$.data.aweme_list[].aweme_id`
2. `get_video` (starter) ← `aweme_id` → 输出视频详情
**Output:** 频道内容 + 首条视频详情
**Fallback:** 批量取首条详情

---

## video_author_profile — 看视频+作者主页

**Inputs:** `aweme_id`
**Atomic Steps:**
1. `get_video` (starter) → 输出 `$.data.author.sec_uid`
2. `cross_ref:user.md#get_user` (starter) ← `sec_user_id` → 输出用户信息
**Output:** 视频详情 + 作者信息
**Fallback:** 跨文件链路，详见 user.md

---

## batch_video_hd — 批量视频详情+高清链接

**Inputs:** `aweme_ids`（逗号分隔，最多 50 个）
**Atomic Steps:**
1. `get_video_batch_v2` (starter) ← `aweme_ids` → 输出 `$.data[].aweme_id`
2. `get_video_hd_batch` (terminal) ← `aweme_ids` → 输出批量高清链接
**Output:** 批量视频详情 + 高清链接
**Fallback:** 第 2 步失败：返回批量详情 + "高清链接暂不可取"
