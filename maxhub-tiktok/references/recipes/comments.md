# Recipe: 评论与直播 / Comments & Live

> 评论与直播域编排链路，覆盖评论+回复、直播链接→信息、直播排行/商品/弹幕、礼物查询等场景。

---

## comments_replies — 看视频评论+回复

**Inputs:** `aweme_id`
**Atomic Steps:**
1. `get_comments` (starter) ← `aweme_id` → 输出 `$.data.data.comments[].cid`
2. `get_comment_replies` (relay) ← `comment_id` → 输出回复列表
**Output:** 一级评论列表 + 指定评论的回复
**Fallback:** 第 1 步空：返回"暂无评论"；第 2 步空：返回评论 + "回复暂不可取"

---

## live_link_info — 直播链接→直播信息

**Inputs:** `url`
**Atomic Steps:**
1. `extract_live_room_id` (starter) ← `url` → 输出 `$.data.data.room_id`
2. `get_live_room` (starter) ← `room_id` → 输出直播信息
**Output:** 直播信息
**Fallback:** 第 1 步失败：STOP

---

## live_ranking — 直播信息→排行榜

**Inputs:** `room_id`
**Atomic Steps:**
1. `get_live_room` (starter) ← `room_id` → 输出 `$.data.data.owner.id_str` + `room_id`
2. `get_live_ranking` (terminal) ← `anchor_id` + `room_id` → 输出排行榜
**Output:** 直播信息 + 排行榜
**Fallback:** 第 2 步空：返回直播信息 + "排行榜暂不可取"

---

## live_products — 直播信息→商品列表

**Inputs:** `room_id`
**Atomic Steps:**
1. `get_live_room` (starter) ← `room_id` → 输出 `$.data.data.owner.id_str` + `room_id`
2. `get_live_products` (starter) ← `author_id` + `room_id` → 输出商品列表
**Output:** 直播信息 + 商品列表
**Fallback:** 第 2 步空：返回直播信息 + "暂无商品"

---

## batch_live_online — 批量检测直播在线

**Inputs:** `room_ids`（逗号分隔，最多 50 个）
**Atomic Steps:**
1. `check_live_online_batch` (starter) ← `room_ids` → 输出在线房间列表
2. `get_live_room` (starter) ← 对在线的 `room_id` 逐个获取详情
**Output:** 在线状态 + 直播详情
**Fallback:** 批量检测后仅对在线的调用详情

---

## video_to_comments — 视频→评论

**Inputs:** `aweme_id`
**Atomic Steps:**
1. `cross_ref:video.md#get_video_v3` (starter) → 输出 `$.data.data.aweme_id`
2. `get_comments` (starter) ← `aweme_id` → 输出评论列表
**Output:** 视频详情 + 评论列表
**Fallback:** 跨文件链路

---

## live_danmaku — 直播间→弹幕

**Inputs:** `room_id`
**Atomic Steps:**
1. `get_live_room` (starter) ← `room_id` → 输出 `$.data.data.room_id`
2. `get_live_im` (relay) ← `room_id` → 输出弹幕参数
**Output:** 直播信息 + 弹幕参数
**Fallback:** 第 2 步空：返回直播信息 + "弹幕参数暂不可取"

---

## gift_name — 礼物列表→礼物名称

**Inputs:** `room_id`
**Atomic Steps:**
1. `get_live_gift_list` (starter) ← `room_id` → 输出 `gift_id`
2. `get_gift_name` (terminal) ← `gift_id` → 输出礼物名称
**Output:** 礼物列表 + 礼物名称
**Fallback:** 第 2 步失败：返回 ID + "名称查询失败"
