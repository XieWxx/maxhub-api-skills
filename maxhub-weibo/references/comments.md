# Weibo Comments / 微博评论

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
微博评论、子评论（回复）—— 围绕"评论"的全部读取入口。含 App、Web、Web V2 三端。**评论 ID 多在本文件首步产出**，是子评论链式调用的起点。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| app_fetch_status_comments | ⭐⭐⭐ 首选 | 用 status_id 取微博评论（App 端，**支持排序**） | GET | /api/v1/weibo/app/fetch_status_comments | low |
| web_fetch_post_comments | ⭐⭐ 条件 | 用 post_id + mid 取微博评论（Web 端） | GET | /api/v1/weibo/web/fetch_post_comments | low |
| web_fetch_comment_replies | ⭐⭐ 条件 | 用 cid 取评论子评论（Web 端） | GET | /api/v1/weibo/web/fetch_comment_replies | low |
| web_v2_fetch_post_comments | ⭐⭐⭐ 首选 | 用 id 取微博评论（Web V2 端） | GET | /api/v1/weibo/web_v2/fetch_post_comments | low |
| web_v2_fetch_post_sub_comments | ⭐⭐ 条件 | 用 id 取微博子评论（Web V2 端） | GET | /api/v1/weibo/web_v2/fetch_post_sub_comments | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看微博评论 | post.md → app_fetch_status_comments | `$.data.idstr` → `status_id` | 第 1 步失败：STOP |
| 看评论 + 回复 (App/Web) | app_fetch_status_comments → user.md | `$.data.list[].user.id` → `uid` | 跨文件链路 |
| 看评论 + 回复 (Web) | web_fetch_post_comments → web_fetch_comment_replies | `$.data.list[].id` → `cid` | 第 2 步空：返回评论 + "暂无回复" |
| 看评论 + 回复 (Web V2) | web_v2_fetch_post_comments → web_v2_fetch_post_sub_comments | `$.data.list[].id` → `id` | 第 2 步空：返回评论 + "暂无回复" |
| 看视频评论 | post.md app_fetch_video_detail → app_fetch_status_comments | `$.data.items[0].data.idstr` → `status_id` | **必须先取真实视频 ID** |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`post.md` 的 app_fetch_status_detail 输出 `$.data.idstr` → app_fetch_status_comments 的 `status_id`
- **流入本文件**：`post.md` 的 web_fetch_post_detail 输出 `$.data.id` → web_fetch_post_comments 的 `post_id`
- **流入本文件**：`post.md` 的 web_v2_fetch_post_detail 输出 `$.data.id` → web_v2_fetch_post_comments 的 `id`
- **流入本文件**：`post.md` 的 app_fetch_video_detail 输出 `$.data.items[0].data.idstr` → app_fetch_status_comments 的 `status_id`（视频评论）
- **流出本文件**：`$.data.list[].user.id`（评论者 uid）→ `user.md` 全部 user 系端点

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- **第 2 步：自检通过后**才能 STOP 并报告"资源不存在"
- **禁止**：❌ 改路径段 ❌ 切换平台前缀 ❌ 拼接新路径

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
- **特别注意**：App 端 `status_id` ≠ Web 端 `post_id` ≠ Web V2 端 `id`，禁止跨端混用
- **Web 端评论需要 mid 参数**：web_fetch_post_comments 必须同时传 post_id 和 mid
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP

### 鉴权错误（401）
- **行动**：**STOP**，提示用户检查或更换 API Key

### 余额 / 付费（402）
- **行动**：**STOP**，告知用户充值

### 权限错误（403）
- **行动**：**STOP**，按子场景告知用户处理

### 限流（429）
- **行动**：读 `Retry-After` 头退避；最多重试 2 次

### 上游故障（500/502/503/504）
- **行动**：等 3 秒重试 1 次 → 仍失败走端点级"降级/替换"

### 网络超时 / DNS
- **行动**：**STOP**

### 业务错误（HTTP 200 且 `code != 0`）
- **行动**：读 `message_zh`/`message`；不重试

---

## 端点详情

### app_fetch_status_comments — 获取微博评论 (App)

**Full path:** `/api/v1/weibo/app/fetch_status_comments`
**Method:** GET · **Risk:** low

#### 用途
获取指定微博的一级评论列表（约 20 条/页，支持按热度/时间排序）。

#### 何时使用 / 不使用
- ✅ 已知 status_id，想看评论
- ✅ App 端评论首选端点（支持排序）
- ❌ 想看子评论/回复 → 先取评论 ID，再调子评论端点
- ❌ 视频微博评论 → 必须先调 post.md 的 app_fetch_video_detail 获取真实视频 ID

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| status_id | string | yes | — | 微博 ID（也适用于视频评论） |
| max_id | string | no | — | 翻页游标，首次不传，后续使用返回的 max_id |
| sort_type | string | no | enum=`["0","1"]` | 排序: 0=热度, 1=时间 (default: 0) |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].id | `$.data.list[].id` | 评论 ID | 无直接子评论端点（App 端无 fetch_sub_comments） |
| list[].user.id | `$.data.list[].user.id` | 评论者 uid | user.md |
| moreInfo.params.max_id | `$.data.moreInfo.params.max_id` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 微博不存在 | STOP | 0 | 无替代 |
| 空数据 | 暂无评论 | 返回"暂无评论" | 0 | — |

---

### web_fetch_post_comments — 获取微博评论 (Web)

**Full path:** `/api/v1/weibo/web/fetch_post_comments`
**Method:** GET · **Risk:** low

#### 用途
获取指定微博的热门评论流（Web 端）。

#### 何时使用 / 不使用
- ✅ 已知 post_id 和 mid
- ❌ 不知道 mid → 优先使用 App 端或 Web V2 端（不需要 mid）
- ❌ 想看子评论 → web_fetch_comment_replies

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| post_id | string | yes | — | 微博 ID |
| mid | string | yes | — | 微博 MID |
| max_id | string | no | — | 翻页 ID |
| max_id_type | integer | no | — | 翻页 ID 类型 (default: 0) |

> **注意**：Web 端评论需要同时传 post_id 和 mid，缺一不可。如无法获取 mid，建议改用 App 端或 Web V2 端。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].id | `$.data.list[].id` | 评论 ID | web_fetch_comment_replies.cid |
| list[].user.id | `$.data.list[].user.id` | 评论者 uid | user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 缺少 mid | 改用 web_v2_fetch_post_comments | 0 | web_v2_fetch_post_comments |
| 404 | 微博不存在 | STOP | 0 | 无替代 |

---

### web_fetch_comment_replies — 获取评论子评论 (Web)

**Full path:** `/api/v1/weibo/web/fetch_comment_replies`
**Method:** GET · **Risk:** low

#### 用途
获取指定一级评论下的子评论（回复）列表。

#### 何时使用 / 不使用
- ✅ 已通过 web_fetch_post_comments 取得 cid
- ❌ 不要传微博 ID（参数名是 cid，不是 post_id）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cid | string | yes | — | 根评论 ID（从 web_fetch_post_comments 返回获取） |
| max_id | string | no | — | 翻页 ID，默认 0 为第一页 (default: 0) |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].user.id | `$.data.list[].user.id` | 回复者 uid | user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 评论不存在 | STOP | 0 | 无替代 |
| 空数据 | 暂无回复 | 返回"暂无回复" | 0 | — |

---

### web_v2_fetch_post_comments — 获取微博评论 (Web V2)

**Full path:** `/api/v1/weibo/web_v2/fetch_post_comments`
**Method:** GET · **Risk:** low

#### 用途
获取指定微博的一级评论列表（Web V2 端，含 max_id 翻页）。

#### 何时使用 / 不使用
- ✅ 已知微博 ID，想看评论（Web V2 端不需要 mid）
- ✅ Web 端评论的替代方案（无需 mid 参数）
- ❌ 想看子评论 → web_v2_fetch_post_sub_comments

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| id | string | yes | — | 微博 ID |
| count | integer | no | min=1 | 评论数量 (default: 10) |
| max_id | string | no | — | 翻页游标，首次传空 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].id | `$.data.list[].id` | 评论 ID | web_v2_fetch_post_sub_comments.id |
| list[].user.id | `$.data.list[].user.id` | 评论者 uid | user.md |
| max_id | `$.data.max_id` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 微博不存在 | STOP | 0 | 无替代 |
| 空数据 | 暂无评论 | 返回"暂无评论" | 0 | — |

---

### web_v2_fetch_post_sub_comments — 获取微博子评论 (Web V2)

**Full path:** `/api/v1/weibo/web_v2/fetch_post_sub_comments`
**Method:** GET · **Risk:** low

#### 用途
获取指定一级评论下的子评论（回复）列表（Web V2 端）。

> 与 web_v2_fetch_post_comments 的区别：本接口获取评论的回复，而非微博的主评论。

#### 何时使用 / 不使用
- ✅ 已通过 web_v2_fetch_post_comments 取得评论 ID
- ❌ 不要传微博 ID（参数名是 id，但语义是评论 ID，不是微博 ID）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| id | string | yes | — | 主评论 ID（从 web_v2_fetch_post_comments 返回获取） |
| count | integer | no | min=1 | 子评论数量 (default: 10) |
| max_id | string | no | — | 分页标识，首次传空 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].user.id | `$.data.list[].user.id` | 回复者 uid | user.md |
| max_id | `$.data.max_id` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 评论不存在 | STOP | 0 | 无替代 |
| 空数据 | 暂无回复 | 返回"暂无回复" | 0 | — |
