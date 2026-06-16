# Recipe: 用户 / User

> 用户域编排链路，覆盖用户资料、作品、粉丝、关注、收藏、直播、星图等场景。

---

## user_posts — 看用户+作品

**Inputs:** `sec_user_id`
**Atomic Steps:**
1. `get_user` (starter) ← `sec_user_id` → 输出 `$.data.user.sec_uid`
2. `get_user_posts` (relay) ← `sec_user_id` → 输出用户作品列表
**Output:** 用户信息 + 作品列表
**Fallback:** 第 1 步失败：STOP；第 2 步空：返回用户信息 + "暂无作品"

---

## user_fans — 看用户+粉丝

**Inputs:** `sec_user_id`
**Atomic Steps:**
1. `get_user` (starter) ← `sec_user_id` → 输出 `$.data.user.sec_uid`
2. `get_fans` (relay) ← `sec_user_id` → 输出粉丝列表
**Output:** 用户信息 + 粉丝列表
**Fallback:** 第 2 步空：返回用户信息 + "暂无粉丝数据"

---

## user_following — 看用户+关注

**Inputs:** `sec_user_id`
**Atomic Steps:**
1. `get_user` (starter) ← `sec_user_id` → 输出 `$.data.user.sec_uid`
2. `get_following` (relay) ← `sec_user_id` → 输出关注列表
**Output:** 用户信息 + 关注列表
**Fallback:** 第 2 步空：返回用户信息 + "暂无关注数据"

---

## uid_to_profile — uid→sec_user_id→用户信息

**Inputs:** `uid`
**Atomic Steps:**
1. `uid_to_sec_uid` (relay) ← `uid` → 输出 `$.data.sec_user_id`
2. `get_user` (starter) ← `sec_user_id` → 输出用户信息
**Output:** 用户信息
**Fallback:** 第 1 步失败：STOP

---

## user_live — 看用户+直播信息

**Inputs:** `sec_user_id`
**Atomic Steps:**
1. `get_user` (starter) ← `sec_user_id` → 输出 `$.data.user.uid`
2. `cross_ref:live.md#get_live_status` (starter) ← `uid` → 输出直播状态
**Output:** 用户信息 + 直播状态
**Fallback:** 跨文件链路，详见 live.md

---

## user_xingtu — 看用户+星图数据

**Inputs:** `sec_user_id`
**Atomic Steps:**
1. `get_user` (starter) ← `sec_user_id` → 输出 `$.data.user.sec_uid`
2. `cross_ref:xingtu.md#get_kolid_by_sec_uid` (starter) ← `sec_user_id` → 输出星图数据
**Output:** 用户信息 + 星图数据
**Fallback:** 跨文件链路，详见 xingtu.md

---

## user_video_hd — 看用户+视频+高清链接

**Inputs:** `sec_user_id`
**Atomic Steps:**
1. `get_user` (starter) ← `sec_user_id` → 输出 `$.data.user.sec_uid`
2. `get_user_posts` (relay) ← `sec_user_id` → 输出 `$.data.aweme_list[].aweme_id`
3. `cross_ref:video.md#get_video_hd` (relay) ← `aweme_id` → 输出高清链接
**Output:** 用户信息 + 作品列表 + 高清链接
**Fallback:** 三步链路，任一步失败返回已有数据

---

## collects_videos — 收藏夹列表+收藏夹视频

**Inputs:** `cookie`（需用户授权）
**Atomic Steps:**
1. `get_user_collects` (starter) ← `cookie` → 输出 `$.data.collects_list[].collects_id`
2. `get_collects_videos` (relay) ← `collects_id` → 输出收藏夹内视频
**Output:** 收藏夹列表 + 各收藏夹视频
**Fallback:** 第 1 步失败：STOP（需 cookie）

---

## batch_user_video — 批量用户→批量视频

**Inputs:** `sec_user_ids`（逗号分隔，最多 50 个）
**Atomic Steps:**
1. `get_user_batch` (starter) ← `sec_user_ids` → 输出 `$.data[].sec_uid`
2. `cross_ref:video.md#get_video_batch_v2` (starter) ← 批量 aweme_id → 输出视频详情
**Output:** 批量用户信息 + 视频详情
**Fallback:** 按需组合
