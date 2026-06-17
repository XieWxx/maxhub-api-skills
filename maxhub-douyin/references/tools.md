# Douyin Tools / 抖音工具

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖

设备注册、App Deep-Link 跳转、游客 Cookie 生成、Token/签名生成器（msToken / ttwid / verify_fp / s_v_web_id / X-Bogus / A-Bogus / 弹幕 WSS 签名）、ID 提取工具（sec_user_id / aweme_id / webcast_id）、短链接转换、用户查询。**本文件是 ID 提取的入口**——当用户只有分享链接/URL 时，需先通过 ID 提取端点获取 sec_user_id / aweme_id / webcast_id，再链式调用 video.md / user.md / live.md 的业务端点。

> 🔒 **安全**：所有请求将 `MAXHUB_API_KEY` 和查询数据传输至 `https://www.aconfig.cn`。禁止在日志、提示词或客户端存储中暴露 API Key。POST 端点（含设备注册、签名生成、批量 ID 提取、用户查询）均为 **risk:high**，调用前必须获得用户确认。

---

## 端点索引 (Endpoint Index)

### 设备注册与 App 跳转

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| app_v3_register_device | ⭐⭐ 条件 | 注册抖音 App 设备，获取设备 Cookie（**risk:high**） | GET | /api/v1/douyin/app/v3/register_device | **high** |
| app_v3_open_douyin_app_to_video_detail | ⭐⭐ 条件 | 生成 Deep-Link 跳转到视频详情页 | GET | /api/v1/douyin/app/v3/open_douyin_app_to_video_detail | low |
| app_v3_open_douyin_app_to_user_profile | ⭐⭐ 条件 | 生成 Deep-Link 跳转到用户主页 | GET | /api/v1/douyin/app/v3/open_douyin_app_to_user_profile | low |
| app_v3_open_douyin_app_to_keyword_search | ⭐⭐ 条件 | 生成 Deep-Link 跳转到搜索结果页 | GET | /api/v1/douyin/app/v3/open_douyin_app_to_keyword_search | low |
| app_v3_open_douyin_app_to_send_private_message | ⭐ 条件 | 生成 Deep-Link 发送私信（**risk:high**） | GET | /api/v1/douyin/app/v3/open_douyin_app_to_send_private_message | **high** |

### Cookie 与 Token 生成器

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| web_fetch_douyin_web_guest_cookie | ⭐⭐⭐ 首选 | 获取抖音 Web 游客 Cookie（**链式起点**） | GET | /api/v1/douyin/web/fetch_douyin_web_guest_cookie | low |
| web_generate_real_msToken | ⭐⭐ 条件 | 生成真实 msToken | GET | /api/v1/douyin/web/generate_real_msToken | low |
| web_generate_ttwid | ⭐⭐ 条件 | 生成 ttwid | GET | /api/v1/douyin/web/generate_ttwid | low |
| web_generate_verify_fp | ⭐⭐ 条件 | 生成 verify_fp | GET | /api/v1/douyin/web/generate_verify_fp | low |
| web_generate_s_v_web_id | ⭐⭐ 条件 | 生成 s_v_web_id | GET | /api/v1/douyin/web/generate_s_v_web_id | low |

### 签名生成器

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| web_generate_x_bogus | ⭐ 条件 | 生成 X-Bogus 签名参数（**POST, risk:high**） | POST | /api/v1/douyin/web/generate_x_bogus | **high** |
| web_generate_a_bogus | ⭐ 条件 | 生成 A-Bogus 签名参数（**POST, risk:high**） | POST | /api/v1/douyin/web/generate_a_bogus | **high** |
| web_generate_wss_xb_signature | ⭐⭐ 条件 | 生成弹幕 WSS 签名（需 room_id） | GET | /api/v1/douyin/web/generate_wss_xb_signature | low |

### ID 提取工具

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| web_get_sec_user_id | ⭐⭐⭐ 首选 | 从 URL 提取 sec_user_id（**链式起点**） | GET | /api/v1/douyin/web/get_sec_user_id | low |
| web_get_all_sec_user_id | ⭐ 降级 | 批量提取 sec_user_id（**POST, risk:high**） | POST | /api/v1/douyin/web/get_all_sec_user_id | **high** |
| web_get_aweme_id | ⭐⭐⭐ 首选 | 从 URL 提取 aweme_id（**链式起点**） | GET | /api/v1/douyin/web/get_aweme_id | low |
| web_get_all_aweme_id | ⭐ 降级 | 批量提取 aweme_id（**POST, risk:high**） | POST | /api/v1/douyin/web/get_all_aweme_id | **high** |
| web_get_webcast_id | ⭐⭐⭐ 首选 | 从 URL 提取 webcast_id（**链式起点**） | GET | /api/v1/douyin/web/get_webcast_id | low |
| web_get_all_webcast_id | ⭐ 降级 | 批量提取 webcast_id（**POST, risk:high**） | POST | /api/v1/douyin/web/get_all_webcast_id | **high** |

### 其他工具

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| web_handler_shorten_url | ⭐⭐ 条件 | 短链接转换（长链接→短链接） | GET | /api/v1/douyin/web/handler_shorten_url | low |
| web_fetch_query_user | ⭐ 条件 | 查询用户信息（**POST, risk:high**） | POST | /api/v1/douyin/web/fetch_query_user | **high** |

---

## 链式调用图谱 (Chain Recipes)

> 当单个端点无法直接产出用户所需数据时，按下面链路组合调用。`字段流`列指明字段如何从上一步流向下一步，避免 Agent 臆造字段名。

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 从分享链接获取用户信息 | web_get_sec_user_id → user.md | `$.data.sec_user_id` → `sec_user_id` | 第 1 步失败：STOP，提示 URL 无效；第 2 步失败：返回 sec_user_id + "用户详情暂不可取" |
| 从分享链接获取视频详情 | web_get_aweme_id → video.md | `$.data.aweme_id` → `aweme_id` | 第 1 步失败：STOP，提示 URL 无效；第 2 步失败：返回 aweme_id + "视频详情暂不可取" |
| 从直播链接获取直播信息 | web_get_webcast_id → live.md | `$.data.webcast_id` → `webcast_id`（→ `web_webcast_id_2_room_id`） | 第 1 步失败：STOP，提示 URL 无效；第 2 步失败：返回 webcast_id + "直播信息暂不可取" |
| 获取游客 Cookie 后调用 Web 端点 | web_fetch_douyin_web_guest_cookie → video.md/user.md | `$.data.cookie` → `cookie` | Cookie 获取失败：降级尝试不带 cookie 调用（部分端点可无 cookie） |
| 注册设备获取 App Cookie | app_v3_register_device → video.md/user.md/comments.md | `$.data.cookie` → `cookie` | 注册失败：降级到 Web 端点 |
| 获取弹幕签名后连接弹幕 | live.md → web_generate_wss_xb_signature | `$.data.room_id` → `room_id`；`$.data.user_unique_id` → `user_unique_id` | 跨文件链路，详见 live.md |
| 批量 URL 提取 ID | web_get_all_sec_user_id / web_get_all_aweme_id / web_get_all_webcast_id | 批量输出 → 下游批量查询 | 批量端点失败：逐个降级到单条 GET 端点 |

---

## 跨 reference 链路 (In-Chain)

- **流入本文件**：`live.md` 的 `web_fetch_live_im_fetch` 输出 `room_id` + `user_unique_id` → 本文件 `web_generate_wss_xb_signature` 的 `room_id` + `user_unique_id`
- **流出本文件**：`web_get_sec_user_id` 输出 `$.data.sec_user_id` → `user.md` 全部 user 系端点的 `sec_user_id`
- **流出本文件**：`web_get_aweme_id` 输出 `$.data.aweme_id` → `video.md` 全部 video 系端点的 `aweme_id`
- **流出本文件**：`web_get_webcast_id` 输出 `$.data.webcast_id` → `live.md` 的 `web_webcast_id_2_room_id` 的 `webcast_id`
- **流出本文件**：`web_fetch_douyin_web_guest_cookie` 输出 `$.data.cookie` → `video.md` / `user.md` / `live.md` / `search.md` 等需要 cookie 的端点
- **流出本文件**：`app_v3_register_device` 输出 `$.data.cookie` → `video.md` / `user.md` / `comments.md` / `trending.md` 的 App V3 端点

---

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项；通用规则见此处。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
  - 路径是否在 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 中？
  - Method、参数键名是否符合白名单？
  - 资源 ID（url/room_id/user_unique_id）是否来自合法响应字段？
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**，向用户报告
- **禁止**：❌ 改路径段（app/v3→web 试探）❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改资源 ID 重试
- **替换**：参考 [`param-mappings.md`](./param-mappings.md) 的"端点替换矩阵"

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
  - 参数名是否逐字符匹配 IN 表？注意 `url` vs `target_url` 的区别
  - 必填项是否齐全？
  - 传参方式（query vs body）是否正确？Authorization 头是否正确？
  - **是否有 IN 表外的臆造参数**？
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP
- **禁止**：❌ 切换端点 ❌ 在 IN 表外凭空加参数

### 工具类端点特化规则
- **ID 提取端点**：输入的 `url` 必须是完整的抖音分享链接（含 `https://` 前缀），短链接需先通过 `web_handler_shorten_url` 还原
- **Cookie 生成端点**：生成的 Cookie 有时效性，过期后需重新生成；游客 Cookie 权限有限，部分数据无法获取
- **签名生成端点**：X-Bogus / A-Bogus 签名有时效性，生成后应立即使用，不要缓存
- **App Deep-Link 端点**：生成的链接需在移动端打开才能唤起抖音 App，PC 端无法直接使用
- **设备注册端点**：注册设备会产生设备指纹，频繁注册可能触发风控
- **POST 批量端点**：批量 ID 提取端点（`web_get_all_*`）的 body 参数通过请求体传递，非 query

---

## 端点详情

---

### app_v3_register_device — 注册抖音 App 设备

> 🚨 **RESTRICTED — session_bootstrap**：fake-client device registration; can evade anti-abuse controls
>
> 此端点**默认禁用**。仅在用户当次明确授权后调用，且必须告知合规风险。详见 SKILL.md 「高风险能力清单」章节。


**Full path:** `/api/v1/douyin/app/v3/register_device`
**Method:** GET · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
注册抖音 App 设备，获取设备信息以及设备的 Cookie 信息。该 Cookie 可用于后续 App V3 系列端点的调用。

#### 何时使用 / 不使用
- ✅ 需要获取 App V3 端点所需的设备 Cookie
- ✅ App V3 端点返回 Cookie 相关错误时，需重新注册设备
- ❌ 只需 Web 端数据 → 用 `web_fetch_douyin_web_guest_cookie`
- ❌ 频繁注册（可能触发风控）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| proxy | string | no | 格式: `username:password@ip:port`，仅支持 http 代理 | 代理地址，需带 `http://` 或 `https://` 前缀 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| cookie | `$.data.cookie` | 设备 Cookie | video.md / user.md / comments.md / trending.md 的 App V3 端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | proxy 格式无效 | 校正 proxy 参数重试 | ≤1 次 | — |
| 429 | 注册频率过高 | 等 30s 重试 | ≤1 次 | 降级到 `web_fetch_douyin_web_guest_cookie` |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 `web_fetch_douyin_web_guest_cookie` |

---

### app_v3_open_douyin_app_to_video_detail — 生成跳转视频详情的 Deep-Link

**Full path:** `/api/v1/douyin/app/v3/open_douyin_app_to_video_detail`
**Method:** GET · **Risk:** low

#### 用途
生成抖音分享链接，唤起抖音 App 并跳转到指定视频详情页。

#### 何时使用 / 不使用
- ✅ 用户需要在手机端打开指定视频
- ✅ 已知 aweme_id
- ❌ 不知 aweme_id → 先通过 `web_get_aweme_id` 从 URL 提取，或从 `video.md` 获取
- ❌ 在 PC 端使用（Deep-Link 需移动端打开）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | yes | — | 视频/作品 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 分享链接为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | aweme_id 缺失 | 补全参数重试 | ≤1 次 | — |
| 404 | aweme_id 不存在 | STOP | 0 | 无 |

---

### app_v3_open_douyin_app_to_user_profile — 生成跳转用户主页的 Deep-Link

**Full path:** `/api/v1/douyin/app/v3/open_douyin_app_to_user_profile`
**Method:** GET · **Risk:** low

#### 用途
生成抖音分享链接，唤起抖音 App 并跳转到指定用户主页。

#### 何时使用 / 不使用
- ✅ 用户需要在手机端打开指定用户主页
- ✅ 已知 uid 和 sec_uid（**两者都必须有值**）
- ❌ 缺少 uid 或 sec_uid → 无法跳转
- ❌ 在 PC 端使用（Deep-Link 需移动端打开）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | — | 用户 ID |
| sec_uid | string | yes | — | 用户 sec_uid |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 分享链接为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | uid 或 sec_uid 缺失 | 补全参数重试 | ≤1 次 | — |

---

### app_v3_open_douyin_app_to_keyword_search — 生成跳转搜索结果的 Deep-Link

**Full path:** `/api/v1/douyin/app/v3/open_douyin_app_to_keyword_search`
**Method:** GET · **Risk:** low

#### 用途
生成抖音分享链接，唤起抖音 App 并跳转到指定关键词搜索结果页。

#### 何时使用 / 不使用
- ✅ 用户需要在手机端搜索指定关键词
- ✅ 已知 keyword
- ❌ 在 PC 端使用（Deep-Link 需移动端打开）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 分享链接为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | keyword 缺失 | 补全参数重试 | ≤1 次 | — |

---

### app_v3_open_douyin_app_to_send_private_message — 生成发送私信的 Deep-Link

> 🚨 **RESTRICTED — private_messaging**：private-message deep-link
>
> 此端点**默认禁用**。仅在用户当次明确授权后调用，且必须告知合规风险。详见 SKILL.md 「高风险能力清单」章节。


**Full path:** `/api/v1/douyin/app/v3/open_douyin_app_to_send_private_message`
**Method:** GET · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
生成抖音分享链接，唤起抖音 App 并给指定用户发送私信。**涉及用户交互操作，属于写入类端点。**

#### 何时使用 / 不使用
- ✅ 用户明确要求给某人发私信
- ✅ 已知 uid 和 sec_uid（**两者都必须有值**）
- ❌ 缺少 uid 或 sec_uid → 无法发送
- ❌ 在 PC 端使用（Deep-Link 需移动端打开）
- ❌ 未经用户确认 → **禁止自动调用**

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | — | 用户 ID |
| sec_uid | string | yes | — | 用户 sec_uid |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 分享链接为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | uid 或 sec_uid 缺失 | 补全参数重试 | ≤1 次 | — |

---

### web_fetch_douyin_web_guest_cookie — 获取抖音 Web 游客 Cookie

> 🚨 **RESTRICTED — session_bootstrap**：guest cookie acquisition
>
> 此端点**默认禁用**。仅在用户当次明确授权后调用，且必须告知合规风险。详见 SKILL.md 「高风险能力清单」章节。


**Full path:** `/api/v1/douyin/web/fetch_douyin_web_guest_cookie`
**Method:** GET · **Risk:** low

#### 用途
获取抖音 Web 的游客 Cookie，可用于爬取抖音 Web 数据（如用户作品、合辑作品等）。可固定身份避免部分接口重复数据。**注意：游客 Cookie 无法获取所有数据，有一定限制。**

#### 何时使用 / 不使用
- ✅ Web 端点需要 cookie 参数时获取
- ✅ 需要固定身份避免重复数据
- ❌ 需要完整权限数据 → 需要用户登录 Cookie（非本端点提供）
- ❌ 已有有效 Cookie → 无需重复获取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_agent | string | yes | 需为合法浏览器 UA 字符串 | 用户浏览器代理 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| cookie | `$.data.cookie` | 游客 Cookie | video.md / user.md / live.md / search.md 等需要 cookie 的 Web 端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | user_agent 格式无效 | 校正 UA 重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### web_generate_real_msToken — 生成真实 msToken

> 🚨 **RESTRICTED — session_bootstrap**：msToken generator
>
> 此端点**默认禁用**。仅在用户当次明确授权后调用，且必须告知合规风险。详见 SKILL.md 「高风险能力清单」章节。


**Full path:** `/api/v1/douyin/web/generate_real_msToken`
**Method:** GET · **Risk:** low

#### 用途
生成真实的 msToken，用于抖音 Web API 请求签名。

#### 何时使用 / 不使用
- ✅ Web 端点请求需要 msToken 参数时
- ❌ 不需要 msToken 的端点 → 无需调用
- ❌ msToken 仍有有效期 → 无需重复生成

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 无必填参数 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| msToken | `$.data.msToken` | msToken 值 | 需要此 Token 的 Web 端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### web_generate_ttwid — 生成 ttwid

> 🚨 **RESTRICTED — session_bootstrap**：ttwid generator
>
> 此端点**默认禁用**。仅在用户当次明确授权后调用，且必须告知合规风险。详见 SKILL.md 「高风险能力清单」章节。


**Full path:** `/api/v1/douyin/web/generate_ttwid`
**Method:** GET · **Risk:** low

#### 用途
生成 ttwid，用于抖音 Web API 请求身份标识。

#### 何时使用 / 不使用
- ✅ Web 端点请求需要 ttwid 参数时
- ❌ 不需要 ttwid 的端点 → 无需调用

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_agent | string | no | default: 标准 Chrome UA | 浏览器 UA |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| ttwid | `$.data.ttwid` | ttwid 值 | 需要此 Token 的 Web 端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### web_generate_verify_fp — 生成 verify_fp

> 🚨 **RESTRICTED — session_bootstrap**：verify_fp generator
>
> 此端点**默认禁用**。仅在用户当次明确授权后调用，且必须告知合规风险。详见 SKILL.md 「高风险能力清单」章节。


**Full path:** `/api/v1/douyin/web/generate_verify_fp`
**Method:** GET · **Risk:** low

#### 用途
生成 verify_fp（验证指纹），用于抖音 Web API 请求反爬校验。

#### 何时使用 / 不使用
- ✅ Web 端点请求需要 verify_fp 参数时
- ❌ 不需要 verify_fp 的端点 → 无需调用

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 无必填参数 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| verify_fp | `$.data.verify_fp` | verify_fp 值 | 需要此参数的 Web 端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### web_generate_s_v_web_id — 生成 s_v_web_id

> 🚨 **RESTRICTED — session_bootstrap**：s_v_web_id generator
>
> 此端点**默认禁用**。仅在用户当次明确授权后调用，且必须告知合规风险。详见 SKILL.md 「高风险能力清单」章节。


**Full path:** `/api/v1/douyin/web/generate_s_v_web_id`
**Method:** GET · **Risk:** low

#### 用途
生成 s_v_web_id，用于抖音 Web API 请求设备标识。

#### 何时使用 / 不使用
- ✅ Web 端点请求需要 s_v_web_id 参数时
- ❌ 不需要 s_v_web_id 的端点 → 无需调用

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 无必填参数 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| s_v_web_id | `$.data.s_v_web_id` | s_v_web_id 值 | 需要此参数的 Web 端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### web_generate_x_bogus — 生成 X-Bogus 签名参数

> 🚨 **RESTRICTED — anti_bot_bypass**：X-Bogus signature generator
>
> 此端点**默认禁用**。仅在用户当次明确授权后调用，且必须告知合规风险。详见 SKILL.md 「高风险能力清单」章节。


**Full path:** `/api/v1/douyin/web/generate_x_bogus`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
使用接口网址生成 X-Bogus 签名参数。X-Bogus 是抖音 Web API 的核心反爬签名，参与 URL 参数加密计算。

#### 何时使用 / 不使用
- ✅ 需要为抖音 Web API 请求生成 X-Bogus 签名
- ✅ 已知目标 API URL 和 user_agent
- ❌ 不直接调用抖音原始 API → 无需使用本端点
- ❌ 使用 MaxHub 封装端点 → 签名已内置，无需手动生成

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| url | string | yes | 需为完整抖音 API URL | 接口网址 |
| user_agent | string | yes | 需为合法浏览器 UA 字符串 | 用户浏览器代理 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| X-Bogus | `$.data.X-Bogus` | X-Bogus 签名值 | 抖音原始 Web API 请求（非 MaxHub 端点） |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | url 或 user_agent 缺失/无效 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### web_generate_a_bogus — 生成 A-Bogus 签名参数

> 🚨 **RESTRICTED — anti_bot_bypass**：A-Bogus signature generator
>
> 此端点**默认禁用**。仅在用户当次明确授权后调用，且必须告知合规风险。详见 SKILL.md 「高风险能力清单」章节。


**Full path:** `/api/v1/douyin/web/generate_a_bogus`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
使用接口网址生成 A-Bogus 签名参数。A-Bogus 是抖音 Web API 的另一核心反爬签名，参与 URL + 请求体加密计算。**注意：请求 URL 中需去除原有的 a_bogus 参数。**

#### 何时使用 / 不使用
- ✅ 需要为抖音 Web API POST 请求生成 A-Bogus 签名
- ✅ 已知目标 API URL、user_agent 和请求载荷
- ❌ 不直接调用抖音原始 API → 无需使用本端点
- ❌ 使用 MaxHub 封装端点 → 签名已内置，无需手动生成
- ❌ GET 请求时 data 参数传空字符串 `""`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| url | string | yes | 需去除 URL 中原有的 a_bogus 参数 | API 链接 |
| data | string | no | POST 请求时需要，GET 请求用空字符串 `""` | 请求载荷 |
| user_agent | string | yes | 该值参与 a_bogus 参数的计算 | user-agent |
| index_0 | integer | no | default: 0 | 加密明文列表第一个值 |
| index_1 | integer | no | default: 1 | 加密明文列表第二个值 |
| index_2 | integer | no | default: 14 | 加密明文列表第三个值 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| a_bogus | `$.data.a_bogus` | A-Bogus 签名值 | 抖音原始 Web API 请求（非 MaxHub 端点） |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | url 或 user_agent 缺失/无效 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### web_generate_wss_xb_signature — 生成弹幕 WSS 签名

> 🚨 **RESTRICTED — anti_bot_bypass**：WSS signature generator
>
> 此端点**默认禁用**。仅在用户当次明确授权后调用，且必须告知合规风险。详见 SKILL.md 「高风险能力清单」章节。


**Full path:** `/api/v1/douyin/web/generate_wss_xb_signature`
**Method:** GET · **Risk:** low

#### 用途
生成弹幕 WebSocket 连接所需的 xb 签名。用于连接抖音直播间弹幕服务。

#### 何时使用 / 不使用
- ✅ 需要连接直播间弹幕 WebSocket 服务
- ✅ 已知 room_id 和 user_unique_id（可从 `live.md` 获取）
- ❌ 不需要弹幕实时推送 → 无需使用
- ❌ 不知 room_id → 先从 `live.md` 获取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_agent | string | yes | 需为合法浏览器 UA 字符串 | 用户浏览器代理 |
| room_id | string | yes | — | 直播间房间号 |
| user_unique_id | string | yes | — | 用户唯一 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| xb_signature | `$.data.xb_signature` | WSS 弹幕签名 | 直播间弹幕 WebSocket 连接 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或无效 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### web_get_sec_user_id — 从 URL 提取 sec_user_id

**Full path:** `/api/v1/douyin/web/get_sec_user_id`
**Method:** GET · **Risk:** low

#### 用途
从抖音分享链接/URL 中提取 sec_user_id。**链式调用常见起点**——当用户只提供分享链接时，先提取 sec_user_id，再调用 user.md 的用户详情端点。

#### 何时使用 / 不使用
- ✅ 用户提供了抖音用户分享链接，需要提取 sec_user_id
- ✅ 链式起点：提取 sec_user_id 后调用 user.md 端点
- ❌ 已知 sec_user_id → 直接调用 user.md 端点
- ❌ 批量 URL → 用 `web_get_all_sec_user_id`
- ❌ URL 不是抖音用户链接 → 无法提取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| url | string | yes | 需为完整抖音分享链接（含 `https://` 前缀） | 抖音用户分享链接 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| sec_user_id | `$.data.sec_user_id` | 用户 sec_uid | user.md 全部 user 系端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | url 缺失或格式无效 | 校正 URL 重试 | ≤1 次 | — |
| 404 | URL 中无法提取 sec_user_id | STOP | 0 | 提示用户确认链接是否为用户主页 |

---

### web_get_all_sec_user_id — 批量提取 sec_user_id

> 🚨 **RESTRICTED — bulk_extraction**：bulk identifier extractor
>
> 此端点**默认禁用**。仅在用户当次明确授权后调用，且必须告知合规风险。详见 SKILL.md 「高风险能力清单」章节。


**Full path:** `/api/v1/douyin/web/get_all_sec_user_id`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
从多个抖音分享链接中批量提取 sec_user_id。适用于需要同时处理多个用户链接的场景。

#### 何时使用 / 不使用
- ✅ 有多个抖音用户分享链接需要批量提取 sec_user_id
- ❌ 只有单个 URL → 用 `web_get_sec_user_id`（更简单，风险更低）
- ❌ 未经用户确认 → **禁止自动调用**

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 参数通过 body 传递，具体格式见 API 文档 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| sec_user_ids | `$.data.sec_user_ids` | 批量 sec_uid 列表 | user.md 全部 user 系端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | body 参数格式无效 | 校正参数重试 | ≤1 次 | 降级到逐个调用 `web_get_sec_user_id` |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到逐个调用 `web_get_sec_user_id` |

---

### web_get_aweme_id — 从 URL 提取 aweme_id

**Full path:** `/api/v1/douyin/web/get_aweme_id`
**Method:** GET · **Risk:** low

#### 用途
从抖音分享链接/URL 中提取 aweme_id。**链式调用常见起点**——当用户只提供分享链接时，先提取 aweme_id，再调用 video.md 的视频详情端点。

#### 何时使用 / 不使用
- ✅ 用户提供了抖音视频分享链接，需要提取 aweme_id
- ✅ 链式起点：提取 aweme_id 后调用 video.md 端点
- ❌ 已知 aweme_id → 直接调用 video.md 端点
- ❌ 批量 URL → 用 `web_get_all_aweme_id`
- ❌ URL 不是抖音视频链接 → 无法提取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| url | string | yes | 需为完整抖音分享链接（含 `https://` 前缀） | 抖音视频分享链接 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_id | `$.data.aweme_id` | 视频/作品 ID | video.md 全部 video 系端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | url 缺失或格式无效 | 校正 URL 重试 | ≤1 次 | — |
| 404 | URL 中无法提取 aweme_id | STOP | 0 | 提示用户确认链接是否为视频页 |

---

### web_get_all_aweme_id — 批量提取 aweme_id

> 🚨 **RESTRICTED — bulk_extraction**：bulk identifier extractor
>
> 此端点**默认禁用**。仅在用户当次明确授权后调用，且必须告知合规风险。详见 SKILL.md 「高风险能力清单」章节。


**Full path:** `/api/v1/douyin/web/get_all_aweme_id`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
从多个抖音分享链接中批量提取 aweme_id。适用于需要同时处理多个视频链接的场景。

#### 何时使用 / 不使用
- ✅ 有多个抖音视频分享链接需要批量提取 aweme_id
- ❌ 只有单个 URL → 用 `web_get_aweme_id`（更简单，风险更低）
- ❌ 未经用户确认 → **禁止自动调用**

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 参数通过 body 传递，具体格式见 API 文档 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_ids | `$.data.aweme_ids` | 批量 aweme_id 列表 | video.md 全部 video 系端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | body 参数格式无效 | 校正参数重试 | ≤1 次 | 降级到逐个调用 `web_get_aweme_id` |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到逐个调用 `web_get_aweme_id` |

---

### web_get_webcast_id — 从 URL 提取 webcast_id

**Full path:** `/api/v1/douyin/web/get_webcast_id`
**Method:** GET · **Risk:** low

#### 用途
从抖音直播分享链接/URL 中提取 webcast_id。**链式调用常见起点**——当用户只提供直播链接时，先提取 webcast_id，再调用 live.md 的 `web_webcast_id_2_room_id` 转换为 room_id。

#### 何时使用 / 不使用
- ✅ 用户提供了抖音直播分享链接，需要提取 webcast_id
- ✅ 链式起点：提取 webcast_id 后调用 live.md 端点
- ❌ 已知 room_id → 直接调用 live.md 端点
- ❌ 批量 URL → 用 `web_get_all_webcast_id`
- ❌ URL 不是抖音直播链接 → 无法提取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| url | string | yes | 需为完整抖音直播分享链接（含 `https://` 前缀） | 抖音直播分享链接 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| webcast_id | `$.data.webcast_id` | 直播 webcast_id | live.md 的 `web_webcast_id_2_room_id` |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | url 缺失或格式无效 | 校正 URL 重试 | ≤1 次 | — |
| 404 | URL 中无法提取 webcast_id | STOP | 0 | 提示用户确认链接是否为直播页 |

---

### web_get_all_webcast_id — 批量提取 webcast_id

> 🚨 **RESTRICTED — bulk_extraction**：bulk identifier extractor
>
> 此端点**默认禁用**。仅在用户当次明确授权后调用，且必须告知合规风险。详见 SKILL.md 「高风险能力清单」章节。


**Full path:** `/api/v1/douyin/web/get_all_webcast_id`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
从多个抖音直播分享链接中批量提取 webcast_id。适用于需要同时处理多个直播链接的场景。

#### 何时使用 / 不使用
- ✅ 有多个抖音直播分享链接需要批量提取 webcast_id
- ❌ 只有单个 URL → 用 `web_get_webcast_id`（更简单，风险更低）
- ❌ 未经用户确认 → **禁止自动调用**

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 参数通过 body 传递，具体格式见 API 文档 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| webcast_ids | `$.data.webcast_ids` | 批量 webcast_id 列表 | live.md 的 `web_webcast_id_2_room_id` |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | body 参数格式无效 | 校正参数重试 | ≤1 次 | 降级到逐个调用 `web_get_webcast_id` |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到逐个调用 `web_get_webcast_id` |

---

### web_handler_shorten_url — 短链接转换

**Full path:** `/api/v1/douyin/web/handler_shorten_url`
**Method:** GET · **Risk:** low

#### 用途
将长链接转换为短链接，或将短链接还原为长链接。

#### 何时使用 / 不使用
- ✅ 用户需要缩短链接
- ✅ ID 提取端点无法识别短链接 → 先还原为长链接再提取
- ❌ 已有完整长链接 → 无需转换

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| target_url | string | yes | 需为完整 URL（含 `https://` 前缀） | 目标链接 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 转换结果为终端数据，但还原后的长链接可作为 `web_get_*` 端点的 url 参数 | web_get_sec_user_id / web_get_aweme_id / web_get_webcast_id |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | target_url 缺失或格式无效 | 校正 URL 重试 | ≤1 次 | — |
| 404 | 无法解析短链接 | STOP | 0 | 提示用户确认链接有效性 |

---

### web_fetch_query_user — 查询用户信息

> 🚨 **RESTRICTED — query_helper**：high-risk write_op marked user-search helper
>
> 此端点**默认禁用**。仅在用户当次明确授权后调用，且必须告知合规风险。详见 SKILL.md 「高风险能力清单」章节。


**Full path:** `/api/v1/douyin/web/fetch_query_user`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
通过 POST 方式查询用户信息。适用于需要更详细用户数据的场景。

#### 何时使用 / 不使用
- ✅ 需要通过 POST 方式查询用户信息
- ❌ 常规用户查询 → 优先用 `user.md` 的 GET 端点（风险更低）
- ❌ 未经用户确认 → **禁止自动调用**

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 参数通过 body 传递，具体格式见 API 文档 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| sec_uid | `$.data.sec_uid` | 用户 sec_uid | user.md 全部 user 系端点 |
| uid | `$.data.uid` | 用户 ID | user.md / tools.md 的 App Deep-Link 端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | body 参数格式无效 | 校正参数重试 | ≤1 次 | 降级到 `user.md` 的 GET 端点 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 `user.md` 的 GET 端点 |
