# Bilibili Video / B站 视频

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
视频详情、播放URL、字幕、分P信息、BV/AV转换 —— 围绕"视频"的全部读取入口 + 唯一写入端点（大会员视频流）。**bv_id、cid、aid 多在本文件首步产出**，是其他链式调用的常见起点。含 App 端和 Web 端双端。

> 🔒 **Security:** All requests transmit your `MAXHUB_API_KEY` and query data to `https://www.aconfig.cn`. Never expose API keys or cookies in logs, prompts, or client-side storage. For the VIP endpoint, treat the Bilibili cookie as a sensitive credential — use a separate low-risk account, never share or log it.

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| fetch_one_video_web | ⭐⭐⭐ 首选 | 用 bv_id 取视频详情（**链式起点**，Web 端） | GET | /api/v1/bilibili/web/fetch_one_video | low |
| fetch_one_video_app | ⭐⭐ 条件 | 用 av_id/bv_id 取视频详情（App 端，oneOf 入口） | GET | /api/v1/bilibili/app/fetch_one_video | low |
| fetch_one_video_v3 | ⭐⭐ 条件 | 用视频 URL 取视频详情（用户给链接时用） | GET | /api/v1/bilibili/web/fetch_one_video_v3 | low |
| fetch_one_video_v2 | ⭐ 条件 | 用 a_id+c_id 取视频详情 V2（需先获取 cid） | GET | /api/v1/bilibili/web/fetch_one_video_v2 | low |
| fetch_video_detail | ⭐ 条件 | 用 aid 取视频详情（需先获取 aid） | GET | /api/v1/bilibili/web/fetch_video_detail | low |
| fetch_video_play_info | ⭐⭐ 条件 | 用 URL 取视频播放信息（含多清晰度） | GET | /api/v1/bilibili/web/fetch_video_play_info | low |
| fetch_video_playurl | ⭐⭐⭐ 首选 | 用 bv_id+cid 取视频流地址（**播放核心端点**） | GET | /api/v1/bilibili/web/fetch_video_playurl | low |
| fetch_vip_video_playurl | ⚠️ 写入·条件 | 用 bv_id+cid+cookie 取大会员视频流 ⚠️ POST | POST | /api/v1/bilibili/web/fetch_vip_video_playurl | **high ⚠️** |
| fetch_video_subtitle | ⭐⭐ 条件 | 用 a_id+c_id 取视频字幕 | GET | /api/v1/bilibili/web/fetch_video_subtitle | low |
| fetch_video_parts | ⭐⭐ 条件 | 用 bv_id 取视频分P信息（多P视频必需） | GET | /api/v1/bilibili/web/fetch_video_parts | low |
| bv_to_aid | ⭐⭐ 条件 | BV号转AV号（字段转换桥梁） | GET | /api/v1/bilibili/web/bv_to_aid | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

> 当单个端点无法直接产出用户所需数据时，按下面链路组合调用。`字段流`列指明字段如何从上一步流向下一步，避免 Agent 臆造字段名。

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看 BV 号视频详情 + 播放 | fetch_one_video_web → fetch_video_playurl | `$.data.bvid` → `bv_id`，`$.data.cid` → `cid` | 第 1 步失败：STOP；第 2 步失败：返回详情 + "播放地址暂不可取" |
| 看 BV 号视频 + 字幕 | fetch_one_video_web → fetch_video_subtitle | `$.data.aid` → `a_id`，`$.data.cid` → `c_id` | 第 2 步失败：返回详情 + "字幕暂不可取" |
| 看 BV 号视频 + 分P | fetch_one_video_web → fetch_video_parts | `$.data.bvid` → `bv_id` | 第 2 步空数据：返回详情 + "该视频为单P" |
| 看 BV 号视频 + 评论 | fetch_one_video_web → 跳转 `comments.md` fetch_video_comments_web | `$.data.bvid` → `bv_id` | 跨文件链路 |
| 看 BV 号视频 + 弹幕 | fetch_one_video_web → 跳转 `comments.md` fetch_video_danmaku | `$.data.cid` → `cid` | 跨文件链路 |
| 看 BV 号视频 + 作者主页 | fetch_one_video_web → 跳转 `user.md` fetch_user_profile | `$.data.owner.mid` → `uid` | 跨文件链路 |
| BV 转 AV 后取详情 | bv_to_aid → fetch_video_detail | `$.data.aid` → `aid` | 第 1 步失败：STOP |
| URL 取视频 + 播放 | fetch_one_video_v3 → fetch_video_playurl | `$.data.bvid` → `bv_id`，`$.data.cid` → `cid` | 第 1 步失败：STOP |
| 大会员视频播放 | fetch_one_video_web → fetch_vip_video_playurl ⚠️ | `$.data.bvid` → `bv_id`，`$.data.cid` → `cid` | 写入端点，必须用户确认 cookie |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`search.md` 的 `fetch_search_all` / `fetch_general_search` 输出 `$.data.item[].bvid` / `$.data.result[].bvid` → 本文件多个端点的 `bv_id`
- **流入本文件**：`user.md` 的 `fetch_user_post_videos` 输出 `$.data.list.vlist[].bvid` → 本文件多个端点的 `bv_id`
- **流入本文件**：`collections.md` 的 `fetch_user_collection_videos` 输出 `$.data.medias[].bvid` → 本文件
- **流出本文件**：`$.data.owner.mid` → `user.md` 全部 uid 系端点
- **流出本文件**：`$.data.bvid` → `comments.md` 评论端点的 `bv_id`
- **流出本文件**：`$.data.cid` → `comments.md` 弹幕端点的 `cid`

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项；通用规则见此处。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
  - 路径是否在 `endpoints_whitelist.yaml` 中？
  - Method、参数键名是否符合白名单？
  - 资源 ID（bv_id/uid/cid）是否来自合法响应字段？
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**，向用户报告
- **禁止**：❌ 改路径段（app→web 试探）❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改 bv_id 重试
- **替换**：参考 `param-mappings.md` 的"端点替换矩阵"

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
  - 参数名是否逐字符匹配 IN 表？无大小写/缩写/复数错？
  - 必填项是否齐全？oneOf 是否做到"传且只传一个"？
  - 类型 / pattern / enum 是否严格匹配？
  - 传参方式（query vs body）是否正确？Authorization 头是否正确？
  - **是否有 IN 表外的臆造参数**？
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP
- **禁止**：❌ 切换端点 ❌ 在 IN 表外凭空加参数

### 鉴权错误（401）
- **子场景**：API 令牌无效 / 缺失 / 过期 / 未激活 / 用户不存在
- **行动**：**STOP**，提示用户检查或更换 API Key（https://www.aconfig.cn）

### 余额 / 付费（402）
- **子场景**：余额不足（允许免费额度 / 不接受免费额度）
- **行动**：**STOP**，告知用户充值（https://www.aconfig.cn）；不要自行重试

### 权限错误（403）
- **子场景**：缺少路由访问权限 / 账户已禁用 / 邮箱未验证 / API Token 权限不足
- **行动**：**STOP**，按子场景告知用户去控制台处理

### 限流（429）
- **行动**：读 `Retry-After` 头退避；无该头时按 `delay = min(8s, 2^attempt) * (0.5 + random*0.5)`；最多重试 2 次
- **禁止**：❌ 立即重试 ❌ 换端点（换端点不能解决限流）

### 上游故障（500/502/503/504）
- **行动**：等 3 秒重试 1 次 → 仍失败走端点级"降级/替换"列 → 无替换则 STOP

### 网络超时
- **行动**：**STOP**，向用户报告网络异常

### 业务错误（HTTP 200 且 `code != 0`）
- **行动**：读 `message_zh`/`message` 报告用户；不要把 `data` 当作有效数据；不要重试

---

## 端点详情

### fetch_one_video_web — 获取视频详情（Web 端）

**Full path:** `/api/v1/bilibili/web/fetch_one_video`
**Method:** GET · **Risk:** low

#### 用途
用 BV号获取视频完整详情，包含作者、播放统计、cid 等。**链式调用的常见起点**——大多数 bv_id、cid、aid 从此处产出。

#### 何时使用 / 不使用
- ✅ 用户提供 BV号（形如 BV1xxxxxx）
- ✅ 链式起点：取 cid / aid / owner.mid 等字段
- ❌ 用户给的是视频 URL → 用 `fetch_one_video_v3`
- ❌ 用户给的是 AV号 → 用 `fetch_one_video_app`（av_id）或先 `bv_to_aid` 反向转换
- ❌ 想看评论 → 直接用 `comments.md` 的 `fetch_video_comments_web`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| bv_id | string | yes | pattern=`^BV[a-zA-Z0-9]+$` | BV号，如 `BV1M1421t7hT` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| bvid | `$.data.bvid` | BV号（回显） | fetch_video_playurl / fetch_video_parts / comments.md 端点 |
| aid | `$.data.aid` | AV号/作品aid | fetch_video_detail / fetch_video_subtitle(a_id) / fetch_one_video_v2(a_id) |
| cid | `$.data.cid` | 分P ID | fetch_video_playurl / fetch_vip_video_playurl / fetch_video_subtitle(c_id) / fetch_video_danmaku |
| owner.mid | `$.data.owner.mid` | 作者 uid | user.md 全部 uid 系端点 |
| title | `$.data.title` | 视频标题 | 仅展示 |
| stat.view | `$.data.stat.view` | 播放量 | 仅展示 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | bv_id 不存在/已删除 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级：fetch_one_video_app（如有 av_id）或 fetch_one_video_v3（如有 URL） |

---

### fetch_one_video_app — 获取视频详情（App 端）

**Full path:** `/api/v1/bilibili/app/fetch_one_video`
**Method:** GET · **Risk:** low

#### 用途
用 AV号或 BV号获取视频详情（App 端）。**oneOf 入口**——av_id 与 bv_id 二选一。

#### 何时使用 / 不使用
- ✅ 用户提供 AV号（av_id）
- ✅ Web 端 fetch_one_video_web 失败时的降级端点
- ❌ 已有 BV号且 Web 端可用 → 优先用 fetch_one_video_web
- ❌ 不确定用 av_id 还是 bv_id → 传其中一个，不要同时传

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| av_id | string | oneOf(av_id, bv_id) | 纯数字字符串 | AV号，如 `115568241811221` |
| bv_id | string | oneOf(av_id, bv_id) | pattern=`^BV[a-zA-Z0-9]+$` | BV号，如 `BV18SCrBGE9E` |

> **二选一逻辑**：av_id 与 bv_id 必须传且只传一个。同时传 → 422；都不传 → 422。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| bvid | `$.data.bvid` | BV号 | 同 fetch_one_video_web |
| aid | `$.data.aid` | AV号 | 同 fetch_one_video_web |
| cid | `$.data.cid` | 分P ID | 同 fetch_one_video_web |
| owner.mid | `$.data.owner.mid` | 作者 uid | user.md |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 422 | av_id/bv_id 同时传或都未传 | 修正后重试 | ≤1 次 | — |
| 404 | 视频不存在 | STOP | 0 | 无替代 |

---

### fetch_one_video_v2 — 获取视频详情 V2

**Full path:** `/api/v1/bilibili/web/fetch_one_video_v2`
**Method:** GET · **Risk:** low

#### 用途
用 a_id + c_id 获取视频详情 V2。适用于已知 aid 和 cid 的场景。

#### 何时使用 / 不使用
- ✅ 已通过其他端点取得 a_id 和 c_id
- ❌ 只有 BV号 → 用 fetch_one_video_web（更直接）
- ❌ 只有 URL → 用 fetch_one_video_v3

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| a_id | string | yes | 纯数字字符串 | 作品aid，如 `114006081739452` |
| c_id | string | yes | 纯数字字符串 | 作品cid，如 `28400484458` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| bvid | `$.data.bvid` | BV号 | 本文件多端点 |
| cid | `$.data.cid` | 分P ID | fetch_video_playurl 等 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | a_id/c_id 不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级：fetch_one_video_web（如有 bvid） |

---

### fetch_one_video_v3 — 获取视频详情 V3（通过 URL）

**Full path:** `/api/v1/bilibili/web/fetch_one_video_v3`
**Method:** GET · **Risk:** low

#### 用途
用视频 URL 获取视频详情 V3。**用户直接给链接时的首选入口**。

#### 何时使用 / 不使用
- ✅ 用户提供 bilibili.com 视频链接
- ❌ 已有 BV号 → 用 fetch_one_video_web（更轻量）
- ❌ 已有 aid+cid → 用 fetch_one_video_v2

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| url | string | yes | startsWith=`https://www.bilibili.com/video/` | 视频链接 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| bvid | `$.data.bvid` | BV号 | 本文件多端点 |
| cid | `$.data.cid` | 分P ID | fetch_video_playurl 等 |
| aid | `$.data.aid` | AV号 | fetch_video_detail 等 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | URL 格式错 | 让用户确认 URL | 0 | — |
| 404 | 视频不存在 | STOP | 0 | — |

---

### fetch_video_detail — 获取视频详情（通过 aid）

**Full path:** `/api/v1/bilibili/web/fetch_video_detail`
**Method:** GET · **Risk:** low

#### 用途
用 aid 获取视频详情。适用于已知 AV号 的场景。

#### 何时使用 / 不使用
- ✅ 已知 aid（AV号）
- ❌ 已有 BV号 → 用 fetch_one_video_web
- ❌ 已有 URL → 用 fetch_one_video_v3

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aid | string | yes | 纯数字字符串 | 作品aid，如 `114902186396822` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| bvid | `$.data.bvid` | BV号 | 本文件多端点 |
| cid | `$.data.cid` | 分P ID | fetch_video_playurl 等 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | aid 不存在 | STOP | 0 | — |

---

### fetch_video_play_info — 获取视频播放信息

**Full path:** `/api/v1/bilibili/web/fetch_video_play_info`
**Method:** GET · **Risk:** low

#### 用途
用视频 URL 获取播放信息（含多清晰度选项）。适用于需要完整播放信息的场景。

#### 何时使用 / 不使用
- ✅ 需要多清晰度选项
- ✅ fetch_video_playurl 失败时的降级端点
- ❌ 只需基础播放流 → 用 fetch_video_playurl（更轻量）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| url | string | yes | startsWith=`https://www.bilibili.com/video/` | 视频链接 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 播放信息（含多清晰度） | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 视频不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级：fetch_video_playurl（需先取 bv_id+cid） |

---

### fetch_video_playurl — 获取视频流地址

**Full path:** `/api/v1/bilibili/web/fetch_video_playurl`
**Method:** GET · **Risk:** low

#### 用途
用 bv_id + cid 获取视频流地址。**播放核心端点**——大多数视频播放场景通过此端点获取流地址。

#### 何时使用 / 不使用
- ✅ 已通过 fetch_one_video_web 取得 bv_id 和 cid
- ✅ 链式中间步：取播放流地址
- ❌ 需要大会员清晰度 → 用 fetch_vip_video_playurl ⚠️
- ❌ 没有 cid → 先调 fetch_one_video_web 或 fetch_video_parts 获取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| bv_id | string | yes | pattern=`^BV[a-zA-Z0-9]+$` | BV号，如 `BV1y7411Q7Eq` |
| cid | string | yes | 纯数字字符串 | 作品cid，如 `171776208` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 视频流地址 | 直接交付用户 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | bv_id 或 cid 不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级：fetch_video_play_info（如有 URL） |

---

### fetch_vip_video_playurl — 获取大会员视频流 ⚠️ 写入操作

**Full path:** `/api/v1/bilibili/web/fetch_vip_video_playurl`
**Method:** POST · **Risk:** high · **requires_user_confirmation:** true

#### 用途
用 bv_id + cid + cookie 获取大会员清晰度视频流地址。**本 skill 唯一的 POST 写入端点**。调用前必须由用户明确确认所有参数，特别是 Cookie。

#### 何时使用 / 不使用
- ✅ 用户明确需要大会员清晰度（1080P 高码率 / 4K 等）
- ✅ 用户已提供有效的 Bilibili 大会员 Cookie
- ❌ 用户未提供 Cookie → 先让用户提供
- ❌ 只需普通清晰度 → 用 fetch_video_playurl
- ❌ Cookie 可能过期 → 先让用户确认 Cookie 有效性

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| bv_id | string | yes | pattern=`^BV[a-zA-Z0-9]+$` | BV号（body 参数） |
| cid | string | yes | 纯数字字符串 | 作品cid（body 参数） |
| cookie | string | yes | — | 大会员 Cookie（body 参数，敏感信息） |

> ⚠️ **写入操作前置确认**：调用前必须向用户确认 bv_id、cid、cookie 准确无误。Cookie 为敏感信息，禁止记录到日志或提示中。

> ⚠️ **传参方式**：本端点为 POST，参数放在 request body（JSON），不是 query string。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 大会员清晰度视频流地址 | 直接交付用户 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400/422 | 参数错（bv_id/cid/cookie 缺失或格式错） | **不要静默重试**，让用户确认参数 | 0 | — |
| 业务 code≠0 | Cookie 无效/过期/非大会员 | 读 `message_zh` 告知用户更新 Cookie | 0 | 降级：fetch_video_playurl（普通清晰度），**必须显式告知用户** |
| 5xx | 上游故障 | 等 3s 重试 | **≤1 次** | 仍失败 STOP（避免重复消耗配额） |

---

### fetch_video_subtitle — 获取视频字幕

**Full path:** `/api/v1/bilibili/web/fetch_video_subtitle`
**Method:** GET · **Risk:** low

#### 用途
用 a_id + c_id 获取视频字幕信息。

#### 何时使用 / 不使用
- ✅ 已通过 fetch_one_video_web 取得 aid 和 cid
- ✅ 用户明确需要字幕
- ❌ 没有 a_id/c_id → 先调 fetch_one_video_web 获取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| a_id | string | yes | 纯数字字符串 | 作品aid，如 `114006081739452` |
| c_id | string | yes | 纯数字字符串 | 作品cid，如 `28400484458` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 字幕信息（含字幕文件 URL） | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 视频不存在或无字幕 | 告知用户 | 0 | — |
| 空数据 | 该视频无字幕 | 返回"该视频暂无字幕" | 0 | — |

---

### fetch_video_parts — 获取视频分P信息

**Full path:** `/api/v1/bilibili/web/fetch_video_parts`
**Method:** GET · **Risk:** low

#### 用途
用 bv_id 获取视频分P信息。**多P视频必需**——用于获取每个分P的 cid。

#### 何时使用 / 不使用
- ✅ 用户想看多P视频的某一P
- ✅ 需要特定分P的 cid
- ❌ 单P视频 → 直接用 fetch_one_video_web 中的 cid

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| bv_id | string | yes | pattern=`^BV[a-zA-Z0-9]+$` | BV号，如 `BV1vf421i7hV` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| parts[].cid | `$.data.parts[].cid` | 各分P的 cid | fetch_video_playurl / fetch_video_subtitle / fetch_video_danmaku |
| parts[].title | `$.data.parts[].title` | 各分P标题 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | bv_id 不存在 | STOP | 0 | — |
| 空数据 | 单P视频 | 返回"该视频为单P" | 0 | 用 fetch_one_video_web 的 cid |

---

### bv_to_aid — BV号转AV号

**Full path:** `/api/v1/bilibili/web/bv_to_aid`
**Method:** GET · **Risk:** low

#### 用途
将 BV号 转换为 AV号（aid）。**字段转换桥梁**——当后续端点需要 aid 而只有 bv_id 时使用。

#### 何时使用 / 不使用
- ✅ 需要 aid 但只有 bv_id
- ✅ 链式中间步：bv_id → aid → fetch_video_detail
- ❌ 已有 aid → 直接用
- ❌ 需要 cid → 用 fetch_one_video_web（同时返回 aid 和 cid）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| bv_id | string | yes | pattern=`^BV[a-zA-Z0-9]+$` | BV号，如 `BV1M1421t7hT` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aid | `$.data.aid` | AV号/作品aid | fetch_video_detail / fetch_video_subtitle(a_id) / fetch_one_video_v2(a_id) |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | bv_id 不存在 | STOP | 0 | — |
