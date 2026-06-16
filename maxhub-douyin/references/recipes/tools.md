# Recipe: 工具 / Tools

> 工具域编排链路，覆盖 ID 提取→业务端点、Cookie/签名生成、设备注册等场景。

---

## url_to_user — 从分享链接获取用户信息

**Inputs:** `url`
**Atomic Steps:**
1. `extract_sec_uid` (starter) ← `url` → 输出 `$.data.sec_user_id`
2. `cross_ref:user.md#get_user` (starter) ← `sec_user_id` → 输出用户信息
**Output:** 用户信息
**Fallback:** 第 1 步失败：STOP，提示 URL 无效；第 2 步失败：返回 sec_user_id + "用户详情暂不可取"

---

## url_to_video — 从分享链接获取视频详情

**Inputs:** `url`
**Atomic Steps:**
1. `extract_aweme_id` (starter) ← `url` → 输出 `$.data.aweme_id`
2. `cross_ref:video.md#get_video` (starter) ← `aweme_id` → 输出视频详情
**Output:** 视频详情
**Fallback:** 第 1 步失败：STOP，提示 URL 无效；第 2 步失败：返回 aweme_id + "视频详情暂不可取"

---

## url_to_live — 从直播链接获取直播信息

**Inputs:** `url`
**Atomic Steps:**
1. `extract_webcast_id` (starter) ← `url` → 输出 `$.data.webcast_id`
2. `cross_ref:live.md#get_live_by_webcast` (starter) ← `webcast_id` → 输出直播信息
**Output:** 直播信息
**Fallback:** 第 1 步失败：STOP，提示 URL 无效；第 2 步失败：返回 webcast_id + "直播信息暂不可取"

---

## guest_cookie — 获取游客Cookie后调用Web端点

**Inputs:** 无
**Atomic Steps:**
1. `get_guest_cookie` (starter) → 输出 `$.data.cookie`
2. `cross_ref:video.md` 或 `cross_ref:user.md` ← `cookie` → 调用 Web 端点
**Output:** Cookie + Web 端点数据
**Fallback:** Cookie 获取失败：降级尝试不带 cookie 调用

---

## device_register — 注册设备获取App Cookie

**Inputs:** 无
**Atomic Steps:**
1. `register_device` (starter) → 输出 `$.data.cookie`
2. `cross_ref:video.md` 或 `cross_ref:comments.md` ← `cookie` → 调用 App V3 端点
**Output:** 设备 Cookie + App V3 端点数据
**Fallback:** 注册失败：降级到 Web 端点
