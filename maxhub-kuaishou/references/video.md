# Kuaishou Video / 快手 视频

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
视频详情、批量查询、链接解析、分享链接生成 —— 围绕"视频/作品"的全部读取入口。含 App 和 Web 双端。**photo_id 多在本文件首步产出**，是评论、分享等链式调用的常见起点。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| app_fetch_one_video | 首选 | 用 photo_id 取视频详情 V1（App 端） | GET | /api/v1/kuaishou/app/fetch_one_video | low |
| app_fetch_videos_batch | 条件 | 批量查询多个视频（最多 40 个） | GET | /api/v1/kuaishou/app/fetch_videos_batch | low |
| app_fetch_one_video_by_url | 首选 | 用分享链接取视频详情（App 端） | GET | /api/v1/kuaishou/app/fetch_one_video_by_url | low |
| app_generate_kuaishou_share_link | 条件 | 生成快手分享链接（App 端） | GET | /api/v1/kuaishou/app/generate_kuaishou_share_link | low |
| web_fetch_one_video | 条件 | 用分享链接取视频详情 V1（Web 端，不支持图文） | GET | /api/v1/kuaishou/web/fetch_one_video | low |
| web_fetch_one_video_v2 | 首选 | 用 photo_id 取视频详情 V2（Web 端） | GET | /api/v1/kuaishou/web/fetch_one_video_v2 | low |
| web_fetch_one_video_by_url | 首选 | 用 URL 取视频详情（Web 端） | GET | /api/v1/kuaishou/web/fetch_one_video_by_url | low |
| web_generate_share_short_url | 条件 | 生成分享短连接（Web 端） | GET | /api/v1/kuaishou/web/generate_share_short_url | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看视频 + 评论 | app_fetch_one_video → comments.md 的 app_fetch_video_comment | `$.data.photo_id` → `photo_id` | 第 1 步失败：STOP；第 2 步失败：返回视频详情 + "评论暂不可取" |
| 看视频 + 评论（Web 端） | web_fetch_one_video_v2 → comments.md 的 web_fetch_one_video_comment | `$.data.photo_id` → `photo_id` | 同上 |
| 看视频 + 生成分享链接 | app_fetch_one_video → app_generate_kuaishou_share_link | `$.data.photo_id` → `shareObjectId` | 第 2 步失败：返回视频详情 + "分享链接生成失败" |
| 看视频 + 生成短链接（Web） | web_fetch_one_video_v2 → web_generate_share_short_url | `$.data.photo_id` → `photo_id` | 同上 |
| 分享链接 → 视频详情 | app_fetch_one_video_by_url → comments.md | `$.data.photo_id` → `photo_id` | 第 1 步失败：STOP |
| 看视频 + 作者主页 | app_fetch_one_video → user.md 的 app_fetch_one_user_v2 | `$.data.user_id` → `user_id` | 跨文件链路，详见 user.md |
| 批量视频详情 | app_fetch_videos_batch → 逐个取评论 | `$.data.videos[].photo_id` → `photo_id` | 部分失败返回成功的 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`user.md` 的 `app_fetch_user_post_v2` 输出 `$.data.videos[].photo_id` → 本文件多个端点的 `photo_id`
- **流入本文件**：`search.md` 的 `app_search_video_v2` 输出 `$.data.videos[].photo_id` → 本文件
- **流入本文件**：`search.md` 的 `app_fetch_selection_feed` 输出 `$.data.feeds[].photo_id` → 本文件
- **流出本文件**：`$.data.photo_id` → `comments.md` 全部评论端点
- **流出本文件**：`$.data.user_id` → `user.md` 全部用户端点

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项；通用规则见此处。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-防路径臆造)）
  - 路径是否在 `endpoints_whitelist.yaml` 中？
  - Method、参数键名是否符合白名单？
  - 资源 ID（photo_id/user_id）是否来自合法响应字段？
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**，向用户报告
- **禁止**：改路径段（app→web 试探）、切换平台前缀、拼接新路径、自行修改资源 ID 重试
- **替换**：参考 `param-mappings.md` 的"端点替换矩阵"

### 参数错误（400 / 422）防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-防参数与传参方式臆造)）
  - 参数名是否逐字符匹配 IN 表？无大小写/缩写/端点混淆错？
  - 必填项是否齐全？
  - 类型 / enum 是否严格匹配？
  - 传参方式（query vs body）是否正确？Authorization 头是否正确？
  - **是否有 IN 表外的臆造参数**？
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP
- **禁止**：切换端点、在 IN 表外凭空加参数

### 鉴权错误（401）
- **行动**：**STOP**，提示用户检查或更换 API Key（https://www.aconfig.cn）

### 余额 / 付费（402）
- **行动**：**STOP**，告知用户充值（https://www.aconfig.cn）

### 权限错误（403）
- **行动**：**STOP**，按子场景告知用户去控制台处理

### 限流（429）
- **行动**：读 `Retry-After` 头退避；无该头时按指数退避 + jitter；最多重试 2 次

### 上游故障（500/502/503/504）
- **行动**：等 3 秒重试 1 次 → 仍失败走端点级"降级/替换"列 → 无替换则 STOP

### 网络超时
- **行动**：**STOP**，向用户报告网络异常

### 业务错误（HTTP 200 且 `code != 0`）
- **行动**：读 `message_zh`/`message` 报告用户；不要把 `data` 当作有效数据；不要重试

---

## 端点详情

### app_fetch_one_video — 获取视频详情 V1（App 端）

**Full path:** `/api/v1/kuaishou/app/fetch_one_video`
**Method:** GET · **Risk:** low

#### 用途
获取单个作品的详情数据（App 端 V1）。支持纯数字和 eid 两种 photo_id 格式。**链式调用的常见起点**——photo_id 和 user_id 多从此处产出。

#### 何时使用 / 不使用
- ✅ 用户提供 photo_id（如 `3xhpk3xcf6e4iac` 或 `5246975215478907538`）
- ✅ 链式起点：取 photo_id 或 user_id
- ❌ 用户提供分享链接 → 用 `app_fetch_one_video_by_url`
- ❌ 想看评论 → 直接用 `comments.md` 的 `app_fetch_video_comment`
- ❌ 想批量查询 → 用 `app_fetch_videos_batch`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| photo_id | string | yes | 支持纯数字和 eid 两种格式 | 作品 ID，如 `3xhpk3xcf6e4iac` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| photo_id | `$.data.photo_id` | 作品 ID | comments.md 全部评论端点 / app_generate_kuaishou_share_link / web_generate_share_short_url |
| user_id | `$.data.user_id` | 作者用户 ID | user.md 全部用户端点 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 作品不存在/已删除 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 仍失败 → web_fetch_one_video_v2（如有 photo_id） |

---

### app_fetch_videos_batch — 批量视频查询

**Full path:** `/api/v1/kuaishou/app/fetch_videos_batch`
**Method:** GET · **Risk:** low

#### 用途
批量获取多个作品数据，单次请求最多支持 40 个视频 ID。

#### 何时使用 / 不使用
- ✅ 用户需要同时查看多个视频的详情
- ✅ 从搜索/列表结果中批量取详情
- ❌ 只需查单个视频 → 用 `app_fetch_one_video`
- ❌ ID 数量超过 40 → 需分批调用

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| photo_ids | string | yes | 多个 ID 逗号分隔，最多 40 个 | 如 `5228960823332207296,5196309727975443273` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| videos[].photo_id | `$.data.videos[].photo_id` | 作品 ID | comments.md / 分享链接端点 |
| videos[].user_id | `$.data.videos[].user_id` | 作者用户 ID | user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | photo_ids 格式错或超量 | 修正后重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级：逐个调用 app_fetch_one_video |

---

### app_fetch_one_video_by_url — 根据链接获取视频详情（App 端）

**Full path:** `/api/v1/kuaishou/app/fetch_one_video_by_url`
**Method:** GET · **Risk:** low

#### 用途
根据分享链接获取单个作品数据（App 端）。**用户提供快手分享链接时的首选入口**。

#### 何时使用 / 不使用
- ✅ 用户提供快手分享短链（如 `https://v.kuaishou.com/cNYP0Z`）
- ✅ 链式起点：从链接提取 photo_id
- ❌ 已有 photo_id → 直接用 `app_fetch_one_video`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| share_text | string | yes | — | 作品链接或分享文本，如 `https://v.kuaishou.com/cNYP0Z` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| photo_id | `$.data.photo_id` | 作品 ID | comments.md / 分享链接端点 |
| user_id | `$.data.user_id` | 作者用户 ID | user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 链接格式无效 | 让用户确认链接 | 0 | — |
| 404 | 链接对应作品不存在 | STOP | 0 | — |

---

### app_generate_kuaishou_share_link — 生成快手分享链接

**Full path:** `/api/v1/kuaishou/app/generate_kuaishou_share_link`
**Method:** GET · **Risk:** low

#### 用途
生成快手分享链接（App 端）。用户需要分享某个作品时使用。

#### 何时使用 / 不使用
- ✅ 用户想为某个作品生成分享链接
- ❌ 想生成短链接 → 用 `web_generate_share_short_url`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| shareObjectId | string | yes | — | 作品 ID，如 `3xg5wjqdtekbb3u` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| share_link | `$.data.share_url` | 分享链接 | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 作品不存在 | STOP | 0 | — |

---

### web_fetch_one_video — 获取视频详情 V1（Web 端）

**Full path:** `/api/v1/kuaishou/web/fetch_one_video`
**Method:** GET · **Risk:** low

#### 用途
获取单个作品数据（Web 端 V1）。**注意：此接口不支持图文作品**。

#### 何时使用 / 不使用
- ✅ 用户提供 `kuaishou.com` 分享链接
- ❌ 想查图文作品 → 用 `web_fetch_one_video_v2`
- ❌ 已有 photo_id → 用 `web_fetch_one_video_v2`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| share_text | string | yes | — | 作品分享链接，如 `https://www.kuaishou.com/f/X-f2k5KJpiXN1SY` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| photo_id | `$.data.photo_id` | 作品 ID | comments.md / 分享端点 |
| user_id | `$.data.user_id` | 作者用户 ID | user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 链接格式错或为图文作品 | 换 web_fetch_one_video_v2 | ≤1 次 | web_fetch_one_video_v2（如有 photo_id） |

---

### web_fetch_one_video_v2 — 获取视频详情 V2（Web 端）

**Full path:** `/api/v1/kuaishou/web/fetch_one_video_v2`
**Method:** GET · **Risk:** low

#### 用途
获取单个作品数据（Web 端 V2）。支持图文作品，用 photo_id 查询。**Web 端首选视频详情入口**。

#### 何时使用 / 不使用
- ✅ 已有 photo_id，想取视频详情（Web 端）
- ✅ 需要查图文作品
- ❌ 只有分享链接 → 用 `web_fetch_one_video_by_url`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| photo_id | string | yes | — | 作品 ID，如 `3xtdqvdnqd3psuc` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| photo_id | `$.data.photo_id` | 作品 ID | comments.md / 分享端点 |
| user_id | `$.data.user_id` | 作者用户 ID | user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 作品不存在 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级：app_fetch_one_video（如有 photo_id） |

---

### web_fetch_one_video_by_url — 根据链接获取视频详情（Web 端）

**Full path:** `/api/v1/kuaishou/web/fetch_one_video_by_url`
**Method:** GET · **Risk:** low

#### 用途
根据 URL 获取单个作品数据（Web 端）。**注意参数名为 `url`，不同于 App 端的 `share_text`**。

#### 何时使用 / 不使用
- ✅ 用户提供快手短链接（Web 端）
- ❌ 已有 photo_id → 用 `web_fetch_one_video_v2`
- ❌ App 端场景 → 用 `app_fetch_one_video_by_url`（参数名不同）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| url | string | yes | — | 作品链接，如 `https://v.kuaishou.com/GKTpYm` |

> **注意**：此端点参数名为 `url`，App 端对应端点参数名为 `share_text`，不要混淆。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| photo_id | `$.data.photo_id` | 作品 ID | comments.md / 分享端点 |
| user_id | `$.data.user_id` | 作者用户 ID | user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | URL 格式无效 | 让用户确认链接 | 0 | — |
| 404 | 作品不存在 | STOP | 0 | — |

---

### web_generate_share_short_url — 生成分享短连接（Web 端）

**Full path:** `/api/v1/kuaishou/web/generate_share_short_url`
**Method:** GET · **Risk:** low

#### 用途
生成分享短连接（Web 端）。返回包含 shortLink 在内的完整分享数据。

#### 何时使用 / 不使用
- ✅ 用户想为某个作品生成短链接
- ❌ 想生成 App 端分享链接 → 用 `app_generate_kuaishou_share_link`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| photo_id | string | yes | — | 作品 ID，如 `3xtdqvdnqd3psuc` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| shortLink | `$.data.share.shareObject.shortLink` | 短链接 | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 作品不存在 | STOP | 0 | — |
