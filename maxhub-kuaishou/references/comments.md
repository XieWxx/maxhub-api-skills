# Kuaishou Comments / 快手 评论

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
视频一级评论、二级回复，支持游标分页。含 App 和 Web 双端。**root_comment_id 多在本文件首步产出**（一级评论端点是二级回复的链式入口）。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| app_fetch_video_comment | 首选 | 用 photo_id 取一级评论（App 端） | GET | /api/v1/kuaishou/app/fetch_video_comment | low |
| app_fetch_video_sub_comments | 条件 | 用 photo_id + root_comment_id 取二级回复（App 端） | GET | /api/v1/kuaishou/app/fetch_video_sub_comments | low |
| web_fetch_one_video_comment | 条件 | 用 photo_id 取一级评论（Web 端） | GET | /api/v1/kuaishou/web/fetch_one_video_comment | low |
| web_fetch_one_video_sub_comment | 条件 | 用 photo_id + root_comment_id 取二级回复（Web 端） | GET | /api/v1/kuaishou/web/fetch_one_video_sub_comment | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看评论 + 回复 | app_fetch_video_comment → app_fetch_video_sub_comments | `$.data.comments[].comment_id` → `root_comment_id` | 第 1 步失败：STOP；第 2 步失败：返回已有评论 + "回复暂不可取" |
| 看评论 + 回复（Web 端） | web_fetch_one_video_comment → web_fetch_one_video_sub_comment | `$.data.comments[].comment_id` → `root_comment_id` | 同上 |
| 视频 → 评论 → 回复 | video.md → app_fetch_video_comment → app_fetch_video_sub_comments | photo_id → root_comment_id 接力 | 任意中间步失败：返回截止失败前的数据 |
| 评论 → 评论者主页 | app_fetch_video_comment → user.md 的 app_fetch_one_user_v2 | `$.data.comments[].user_id` → `user_id` | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`video.md` 多端点输出 `$.data.photo_id` → 本文件全部评论端点的 `photo_id`
- **流入本文件**：`search.md` 的搜索结果输出 `photo_id` → 本文件
- **流出本文件**：`$.data.comments[].comment_id` → 本文件二级回复端点的 `root_comment_id`
- **流出本文件**：`$.data.comments[].user_id` → `user.md` 用户端点

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-防路径臆造)）
- **第 2 步：自检通过后**才能 STOP 并报告"资源不存在"
- **禁止**：改路径段、切换平台前缀、拼接新路径、自行修改 photo_id/root_comment_id 重试
- **替换**：参考 `param-mappings.md` 的"端点替换矩阵"

### 参数错误（400 / 422）防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-防参数与传参方式臆造)）
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP
- **禁止**：切换端点、凭空加参数

### 鉴权错误（401）
- **行动**：**STOP**，提示用户检查或更换 API Key（https://www.aconfig.cn）

### 余额 / 付费（402）
- **行动**：**STOP**，告知用户充值（https://www.aconfig.cn）

### 权限错误（403）
- **行动**：**STOP**，按子场景告知用户处理

### 限流（429）
- **行动**：读 `Retry-After` 头退避；无该头时按指数退避 + jitter；最多重试 2 次

### 上游故障（500/502/503/504）
- **行动**：等 3 秒重试 1 次 → 仍失败走端点级"降级/替换"

### 网络超时 / DNS
- **行动**：**STOP**，向用户报告

### 业务错误（HTTP 200 且 `code != 0`）
- **行动**：读 `message_zh`/`message`；不要把 `data` 当作有效数据；不要重试

---

## 端点详情

### app_fetch_video_comment — 获取作品一级评论（App 端）

**Full path:** `/api/v1/kuaishou/app/fetch_video_comment`
**Method:** GET · **Risk:** low

#### 用途
获取单个作品的一级评论数据（App 端），使用游标分页。**一级评论端点是二级回复的链式入口**——root_comment_id 从此处产出。

#### 何时使用 / 不使用
- ✅ 已知 photo_id，想看视频评论
- ✅ 链式中间步：为 app_fetch_video_sub_comments 提供 root_comment_id
- ❌ 想看二级回复 → 链式调用 → app_fetch_video_sub_comments
- ❌ 不知 photo_id → 先调用 video.md 端点取 photo_id

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| photo_id | string | yes | 支持纯数字和 eid 两种格式 | 作品 ID，如 `3x7gxp2zhgjv832` |
| pcursor | string | no | — | 评论游标，首次留空，翻页传上一页响应的 pcursor |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| comments[].comment_id | `$.data.comments[].comment_id` | 一级评论 ID | app_fetch_video_sub_comments 的 root_comment_id |
| comments[].user_id | `$.data.comments[].user_id` | 评论者用户 ID | user.md 用户端点 |
| pcursor | `$.data.pcursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | photo_id 不存在 | STOP | 0 | 无（评论无替代来源） |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |
| 空数据 | 该视频暂无评论 | 返回"暂无评论" | 0 | — |

---

### app_fetch_video_sub_comments — 评论二级回复（App 端）

**Full path:** `/api/v1/kuaishou/app/fetch_video_sub_comments`
**Method:** GET · **Risk:** low

#### 用途
获取某条一级评论下的二级回复列表（App 端），使用游标分页。**App 端独有 count 参数**控制每页数量。

#### 何时使用 / 不使用
- ✅ 已通过 app_fetch_video_comment 取得 root_comment_id
- ✅ 用户明确想看某条评论的回复
- ❌ 不要传 photo_id 当作 root_comment_id
- ❌ 不知 root_comment_id → 先调一级评论端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| photo_id | string | yes | — | 作品 ID，如 `5218546261880462502` |
| root_comment_id | string | yes | — | 一级评论 ID，从 app_fetch_video_comment 获取 |
| pcursor | string | no | — | 分页游标，首页留空 |
| count | integer | no | min=1, max=20, 默认=8 | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| replies[].user_id | `$.data.replies[].user_id` | 回复者用户 ID | user.md |
| pcursor | `$.data.pcursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | root_comment_id 不存在 | STOP | 0 | 无 |
| 400 | photo_id 或 root_comment_id 缺失 | 补充参数后重试 | ≤1 次 | — |

---

### web_fetch_one_video_comment — 获取作品一级评论（Web 端）

**Full path:** `/api/v1/kuaishou/web/fetch_one_video_comment`
**Method:** GET · **Risk:** low

#### 用途
获取单个作品的一级评论数据（Web 端），使用游标分页。功能与 App 端 app_fetch_video_comment 相同，但走 Web 端路径。

#### 何时使用 / 不使用
- ✅ 已知 photo_id，Web 端场景下取评论
- ✅ App 端评论端点失败时的降级替代
- ❌ App 端可用时优先用 App 端（字段更丰富）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| photo_id | string | yes | — | 作品 ID，如 `3x7gxp2zhgjv832` |
| pcursor | string | no | — | 评论游标，首次留空 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| comments[].comment_id | `$.data.comments[].comment_id` | 一级评论 ID | web_fetch_one_video_sub_comment 的 root_comment_id |
| comments[].user_id | `$.data.comments[].user_id` | 评论者用户 ID | user.md |
| pcursor | `$.data.pcursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | photo_id 不存在 | STOP | 0 | 无 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级：app_fetch_video_comment |

---

### web_fetch_one_video_sub_comment — 获取作品二级评论（Web 端）

**Full path:** `/api/v1/kuaishou/web/fetch_one_video_sub_comment`
**Method:** GET · **Risk:** low

#### 用途
获取单个作品的二级评论数据（Web 端），使用游标分页。功能与 App 端 app_fetch_video_sub_comments 相同，但走 Web 端路径且**不支持 count 参数**。

#### 何时使用 / 不使用
- ✅ 已通过 web_fetch_one_video_comment 取得 root_comment_id
- ✅ App 端二级回复端点失败时的降级替代
- ❌ 需要控制每页数量 → 用 App 端（支持 count 参数）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| photo_id | string | yes | — | 作品 ID，如 `3xgarycnydawq3g` |
| root_comment_id | string | yes | — | 根评论 ID，如 `908850553827` |
| pcursor | string | no | — | 评论游标，首次留空 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| replies[].user_id | `$.data.replies[].user_id` | 回复者用户 ID | user.md |
| pcursor | `$.data.pcursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | root_comment_id 不存在 | STOP | 0 | 无 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级：app_fetch_video_sub_comments |
