# Recipe: 评论 / Comments

> 评论域编排链路，覆盖评论+回复、视频+评论、评论者主页、视频弹幕等场景。

---

## comments_replies — 看评论+回复

**Inputs:** `aweme_id`
**Atomic Steps:**
1. `get_comments` (starter) ← `aweme_id` → 输出 `$.data.comments[].comment_id`
2. `get_comment_replies` (relay) ← `comment_id` + `item_id` → 输出回复列表
**Output:** 一级评论列表 + 指定评论的回复
**Fallback:** 第 1 步失败：STOP；第 2 步失败：返回已有评论 + "回复暂不可取"

---

## video_comments — 看视频+评论

**Inputs:** `aweme_id`
**Atomic Steps:**
1. `cross_ref:video.md#get_video` (starter) → 输出 `$.data.aweme_id`
2. `get_comments` (starter) ← `aweme_id` → 输出评论列表
**Output:** 视频详情 + 评论列表
**Fallback:** 跨文件链路，详见 video.md

---

## comment_user_profile — 看评论+评论者主页

**Inputs:** `aweme_id`
**Atomic Steps:**
1. `get_comments` (starter) ← `aweme_id` → 输出 `$.data.comments[].user.sec_uid`
2. `cross_ref:user.md#get_user` (starter) ← `sec_user_id` → 输出评论者信息
**Output:** 评论列表 + 评论者信息
**Fallback:** 跨文件链路，详见 user.md

---

## video_danmaku — 看视频+弹幕

**Inputs:** `aweme_id`, `duration`
**Atomic Steps:**
1. `cross_ref:video.md#get_video_web` (relay) → 输出 `$.data.aweme_id` + `$.data.duration`
2. `get_video_danmaku` (terminal) ← `item_id` + `duration` → 输出弹幕数据
**Output:** 视频详情 + 弹幕数据
**Fallback:** 跨文件链路，需 duration 字段
