# Recipe: 用户 / User

> 用户域编排链路，覆盖用户名/URL→用户资料、作品、粉丝/关注、创作者信息、直播详情等场景。

---

## username_to_profile — 用户名→用户资料

**Inputs:** `username`
**Atomic Steps:**
1. `get_user_by_username` (starter) ← `username` → 输出 `$.data.data.sec_user_id`
2. `get_user` (starter) ← `sec_user_id` → 输出用户信息
**Output:** 用户信息
**Fallback:** 第 1 步空：STOP，告知用户名未命中

---

## username_to_posts — 用户名→用户作品

**Inputs:** `username`
**Atomic Steps:**
1. `get_user_by_username` (starter) ← `username` → 输出 `$.data.data.sec_user_id`
2. `get_user_posts_v3` (relay) ← `sec_user_id` → 输出用户作品列表
**Output:** 用户信息 + 作品列表
**Fallback:** 第 1 步空：STOP；第 2 步空：返回 ID + "作品暂不可取"

---

## username_to_followers — 用户名→粉丝/关注

**Inputs:** `username`
**Atomic Steps:**
1. `get_user_by_username` (starter) ← `username` → 输出 `$.data.data.user_id`
2. `get_user_followers` (relay) + `get_user_following` (relay) ← `user_id`（可并行）
**Output:** 粉丝列表 + 关注列表
**Fallback:** 任一失败：返回另一份 + 告知缺失

---

## url_to_user — URL→用户资料

**Inputs:** `url`
**Atomic Steps:**
1. `extract_sec_user_id` (starter) ← `url` → 输出 `$.data.data.sec_user_id`
2. `get_user` (starter) ← `sec_user_id` → 输出用户信息
**Output:** 用户信息
**Fallback:** 第 1 步失败：STOP

---

## url_to_user_posts — URL→用户作品

**Inputs:** `url`
**Atomic Steps:**
1. `extract_sec_user_id` (starter) ← `url` → 输出 `$.data.data.sec_user_id`
2. `get_user_posts_v3` (relay) ← `sec_user_id` → 输出用户作品列表
**Output:** 用户信息 + 作品列表
**Fallback:** 同上

---

## user_creator_info — 用户资料→创作者信息

**Inputs:** `sec_user_id`
**Atomic Steps:**
1. `get_user` (starter) ← `sec_user_id` → 输出 `$.data.data.user.uid`
2. `get_creator_info` (relay) ← `creator_uid` → 输出创作者信息
**Output:** 用户信息 + 创作者信息
**Fallback:** 第 2 步空：返回资料 + "非带货创作者"

---

## creator_showcase — 创作者信息→橱窗商品

**Inputs:** `sec_user_id`
**Atomic Steps:**
1. `get_creator_info` (relay) ← `creator_uid` → 输出 `$.data.data.creator_info.sec_user_id`
2. `get_showcase_products` (terminal) ← `kol_id` → 输出橱窗商品列表
**Output:** 创作者信息 + 橱窗商品
**Fallback:** 第 2 步空：返回创作者信息 + "橱窗暂无商品"

---

## user_live_detail — 用户资料→直播详情

**Inputs:** `uniqueId`
**Atomic Steps:**
1. `get_user_web` (standalone) ← `secUid` → 输出 `$.data.data.user.uniqueId`
2. `get_user_live_web` (relay) ← `uniqueId` → 输出直播详情
**Output:** 用户资料 + 直播详情
**Fallback:** 第 2 步空：返回资料 + "当前未直播"

---

## user_posts_to_video — 用户作品→视频详情

**Inputs:** `sec_user_id`
**Atomic Steps:**
1. `get_user_posts_v3` (relay) ← `sec_user_id` → 输出 `$.data.data.aweme_list[].aweme_id`
2. `cross_ref:video.md#get_video_v3` (starter) ← `aweme_id` → 输出视频详情
**Output:** 作品列表 + 视频详情
**Fallback:** 跨文件链路

---

## user_similar — 用户资料→类似推荐

**Inputs:** `sec_user_id`
**Atomic Steps:**
1. `get_user` (starter) ← `sec_user_id` → 输出 `$.data.data.user.sec_uid`
2. `get_similar_users` (terminal) ← `sec_uid` → 输出类似用户推荐
**Output:** 用户信息 + 类似用户推荐
**Fallback:** 第 2 步空：返回资料 + "暂无推荐"
