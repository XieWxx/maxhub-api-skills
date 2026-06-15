# Xiaohongshu User / 小红书 用户

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
用户信息、用户笔记列表、用户收藏列表 —— 围绕"用户"的全部读取入口。支持 App V2、Web V2、Web V3 三个版本。**user_id 多在本文件首步产出**（search_users 是已知用户名时的链式入口，但位于 search.md）。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| get_user_info | ⭐⭐⭐ 首选 | 用 user_id/分享链接 取用户信息（App V2，支持 share_text） | GET | /api/v1/xiaohongshu/app_v2/get_user_info | low |
| get_user_posted_notes | ⭐⭐⭐ 首选 | 用 user_id/分享链接 取用户笔记列表（App V2） | GET | /api/v1/xiaohongshu/app_v2/get_user_posted_notes | low |
| get_user_faved_notes | ⭐⭐ 条件 | 用 user_id/分享链接 取用户收藏列表（App V2，仅公开收藏） | GET | /api/v1/xiaohongshu/app_v2/get_user_faved_notes | low |
| fetch_home_notes_app | ⭐⭐ 降级 | 用 user_id 取用户笔记列表（Web V2） | GET | /api/v1/xiaohongshu/web_v2/fetch_home_notes_app | low |
| fetch_user_info_app | ⭐⭐ 降级 | 用 user_id 取 App 用户信息（Web V2） | GET | /api/v1/xiaohongshu/web_v2/fetch_user_info_app | low |
| fetch_user_info | ⭐⭐ 降级 | 用 user_id 取用户信息（Web V3） | GET | /api/v1/xiaohongshu/web_v3/fetch_user_info | low |
| fetch_user_notes | ⭐⭐ 降级 | 用 user_id 取用户笔记列表（Web V3，支持 num） | GET | /api/v1/xiaohongshu/web_v3/fetch_user_notes | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看用户资料 + 笔记 | get_user_info → get_user_posted_notes | `$.data.data.user_id` → `user_id`（直接复用） | 第 1 步失败：可改用 search_users 取候选；第 2 步失败：返回资料 + "笔记列表暂不可取" |
| 分享链接 → 用户主页 | get_user_info（传 share_text） | share_text 直接入参 | 无需链式 |
| 用户名 → 用户主页 | search_users → get_user_info | `$.data.users[0].user_id` → `user_id` | 第 1 步空：STOP，告知用户名未命中 |
| 用户笔记 → 笔记详情 | get_user_posted_notes → 跳到 `note.md` 的 get_image_note_detail | `$.data.data.notes[].note_id` → `note_id` | 跨文件链路 |
| 用户收藏 → 笔记详情 | get_user_faved_notes → 跳到 `note.md` | `$.data.data.notes[].note_id` → `note_id` | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`note.md` 的 `get_image_note_detail` / `get_video_note_detail` 输出 `$.data.user.user_id` → 本文件全部 user 系端点
- **流入本文件**：`note.md` 的 `get_note_comments` 输出 `$.data.data.comments[].user.user_id` → 本文件
- **流入本文件**：`search.md` 的 `search_users` / `fetch_search_users` 输出 `$.data.users[].user_id` → 本文件
- **流出本文件**：`get_user_posted_notes` / `fetch_user_notes` 的 `$.data.data.notes[].note_id` → `note.md` 多端点
- **流出本文件**：`get_user_faved_notes` 的 `$.data.data.notes[].note_id` → `note.md`

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- **第 2 步：自检通过后**才能 STOP 并报告"资源不存在"
- **禁止**：❌ 改路径段 ❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改 user_id 重试
- **替换**：参考 `param-mappings.md` 的"端点替换矩阵"

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP
- **禁止**：❌ 切换端点 ❌ 凭空加参数

### 鉴权错误（401）→ STOP，提示检查 API Key
### 余额 / 付费（402）→ STOP，告知充值
### 权限错误（403）→ STOP，按子场景告知用户
### 限流（429）→ 读 Retry-After 退避，最多重试 2 次
### 上游故障（500/502/503/504）→ 等 3s 重试 1 次，仍失败走替换
### 网络超时 → STOP
### 业务错误（HTTP 200 且 code != 0）→ 读 message_zh，不重试

---

## 端点详情

### get_user_info — 获取用户信息

**Full path:** `/api/v1/xiaohongshu/app_v2/get_user_info`
**Method:** GET · **Risk:** low

#### 用途
获取小红书用户详细信息，包含昵称、头像、简介、粉丝数、关注数、笔记数等。**user 系链式调用的常见起点**。

#### 何时使用 / 不使用
- ✅ 已知 user_id 或分享链接，想看用户信息
- ✅ 链式起点：取 user_id 供后续端点使用
- ❌ 只有用户名 → 先用 `search.md` 的 `search_users` 取 user_id
- ❌ 想看用户笔记 → 直接用 `get_user_posted_notes`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | oneOf(user_id, share_text) | 24 位 hex | 用户ID，如 `61b46d790000000010008153` |
| share_text | string | oneOf(user_id, share_text) | xhslink.com 链接 | 分享链接，如 `https://xhslink.com/m/3ZSCJZAMz0a` |

> **二选一逻辑**：user_id 与 share_text 至少传一个。优先使用 user_id；两个参数如都携带则以 user_id 为准。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user_id | `$.data.data.user_id` | 用户 ID（回显） | 复用 |
| nickname | `$.data.data.nickname` | 昵称 | 仅展示 |
| fans | `$.data.data.interaction.fans` | 粉丝数 | 用于决定是否调用收藏端点 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在/已注销 | STOP | 0 | 降级：search_users 取候选（如有 keyword 上下文） |

---

### get_user_posted_notes — 获取用户笔记列表

**Full path:** `/api/v1/xiaohongshu/app_v2/get_user_posted_notes`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户发布的笔记列表（含分页）。是 `note.md` 的常见上游产出 note_id 的端点。

#### 何时使用 / 不使用
- ✅ 已知 user_id，想看其发布的笔记
- ✅ 链式产出 note_id 给 `note.md`
- ❌ 想看用户资料本身 → get_user_info
- ❌ 想看用户收藏 → get_user_faved_notes

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | oneOf(user_id, share_text) | 24 位 hex | 用户ID |
| share_text | string | oneOf(user_id, share_text) | xhslink.com 链接 | 分享链接 |
| cursor | string | no | — | 分页游标，首次请求留空；翻页时传入上一次响应返回的 cursor |

> **翻页说明**：首次请求 cursor 留空；翻页时传入上一次响应返回的 cursor 值。cursor 通常为 notes 列表最后一条笔记的 note_id（JSON 路径: `$.data.data.notes[-1].cursor`）。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| notes[].note_id | `$.data.data.notes[].note_id` | 笔记 ID | note.md 多端点 |
| cursor | `$.data.data.cursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |
| 空数据 | 该用户暂无笔记 | 返回"暂无笔记" | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 fetch_home_notes_app 或 fetch_user_notes |

---

### get_user_faved_notes — 获取用户收藏笔记列表

**Full path:** `/api/v1/xiaohongshu/app_v2/get_user_faved_notes`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的公开收藏笔记列表（含分页）。注意：仅能获取用户公开的收藏，私密收藏不可见。

#### 何时使用 / 不使用
- ✅ 已知 user_id，想看其公开收藏
- ❌ 想看用户发布的笔记 → get_user_posted_notes
- ❌ 隐私限制：部分用户收藏列表可能不可见（业务 code≠0）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | oneOf(user_id, share_text) | 24 位 hex | 用户ID |
| share_text | string | oneOf(user_id, share_text) | xhslink.com 链接 | 分享链接 |
| cursor | string | no | — | 分页游标，首次请求留空；翻页时传入上一页最后一条笔记的 note_id |

> **翻页说明**：首次请求 cursor 留空；翻页时传入上一页列表中最后一条笔记的 note_id。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| notes[].note_id | `$.data.data.notes[].note_id` | 收藏笔记 ID | note.md 多端点 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 业务 code≠0 | 隐私设置不可见 | 告知用户该列表不可查看 | 0 | — |
| 404 | 用户不存在 | STOP | 0 | — |
| 空数据 | 该用户暂无公开收藏 | 返回"暂无公开收藏" | 0 | — |

---

### fetch_home_notes_app — 获取用户笔记列表（Web V2）

**Full path:** `/api/v1/xiaohongshu/web_v2/fetch_home_notes_app`
**Method:** GET · **Risk:** low

#### 用途
通过 Web V2 接口获取用户笔记列表。不支持 share_text 入参。

#### 何时使用 / 不使用
- ✅ App V2 的 get_user_posted_notes 5xx 时的降级选择
- ❌ 首选应使用 App V2（支持 share_text）
- ❌ 只有分享链接 → 用 App V2

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | 24 位 hex | 用户ID |
| cursor | string | no | — | 分页游标 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| notes[].note_id | `$.data.notes[].note_id` | 笔记 ID | note.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |

---

### fetch_user_info_app — 获取 App 用户信息（Web V2）

**Full path:** `/api/v1/xiaohongshu/web_v2/fetch_user_info_app`
**Method:** GET · **Risk:** low

#### 用途
通过 Web V2 接口获取 App 端用户信息。不支持 share_text 入参。

#### 何时使用 / 不使用
- ✅ App V2 的 get_user_info 5xx 时的降级选择
- ❌ 首选应使用 App V2（支持 share_text）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | 24 位 hex | 用户ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user_id | `$.data.user_id` | 用户 ID（回显） | 复用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |

---

### fetch_user_info — 获取用户信息（Web V3）

**Full path:** `/api/v1/xiaohongshu/web_v3/fetch_user_info`
**Method:** GET · **Risk:** low

#### 用途
通过 Web V3 接口获取用户公开资料。不支持 share_text 入参。

#### 何时使用 / 不使用
- ✅ App V2 / Web V2 用户信息端点不可用时的降级选择
- ❌ 首选应使用 App V2（支持 share_text）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | 24 位 hex | 用户ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user_id | `$.data.user_id` | 用户 ID（回显） | 复用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |

---

### fetch_user_notes — 获取用户笔记列表（Web V3）

**Full path:** `/api/v1/xiaohongshu/web_v3/fetch_user_notes`
**Method:** GET · **Risk:** low

#### 用途
通过 Web V3 接口获取用户发布的笔记列表（含分页）。支持 num 参数控制返回数量。

#### 何时使用 / 不使用
- ✅ App V2 / Web V2 用户笔记端点不可用时的降级选择
- ✅ 需要精确控制返回数量（num 参数）
- ❌ 首选应使用 App V2（支持 share_text）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | 24 位 hex | 用户ID |
| cursor | string | no | — | 分页游标 |
| num | integer | no | max=30, default=30 | 返回数量，最大 30 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| notes[].note_id | `$.data.notes[].note_id` | 笔记 ID | note.md |
| cursor | `$.data.cursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |
| 空数据 | 该用户暂无笔记 | 返回"暂无笔记" | 0 | — |
