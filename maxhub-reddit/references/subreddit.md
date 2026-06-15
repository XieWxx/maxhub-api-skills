# Reddit Subreddit / Reddit 版块

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
版块规则样式、帖子频道、版块信息、版块设置、版块 Feed、静音状态 —— 围绕"版块"的全部读取入口。**subreddit_id 多在本文件首步产出**（fetch_subreddit_info 是 subreddit_name → subreddit_id 的链式入口）。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| fetch_subreddit_info | ⭐⭐⭐ 首选 | 用 subreddit_name 取版块信息（**subreddit_id 产出入口**） | GET | /api/v1/reddit/app/fetch_subreddit_info | low |
| fetch_subreddit_feed | ⭐⭐⭐ 首选 | 用 subreddit_name 取版块帖子 Feed | GET | /api/v1/reddit/app/fetch_subreddit_feed | low |
| fetch_subreddit_style | ⭐⭐ 条件 | 用 subreddit_name 取版块规则样式（仅用户问"规则/样式"时用） | GET | /api/v1/reddit/app/fetch_subreddit_style | low |
| fetch_subreddit_post_channels | ⭐⭐ 条件 | 用 subreddit_name 取版块帖子频道（仅用户问"频道/分类"时用） | GET | /api/v1/reddit/app/fetch_subreddit_post_channels | low |
| fetch_subreddit_settings | ⭐⭐ 条件 | 用 subreddit_id 取版块设置（需先从 info 获取 subreddit_id） | GET | /api/v1/reddit/app/fetch_subreddit_settings | low |
| check_subreddit_muted | ⭐ 条件 | 用 subreddit_id 检查版块静音状态 | GET | /api/v1/reddit/app/check_subreddit_muted | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 版块名 → 版块信息 + 设置 | fetch_subreddit_info → fetch_subreddit_settings | `$.data.subreddit.id` → `subreddit_id` | 第 1 步失败：STOP；第 2 步失败：返回版块信息 + "设置暂不可取" |
| 版块名 → 版块信息 + 静音 | fetch_subreddit_info → check_subreddit_muted | `$.data.subreddit.id` → `subreddit_id` | 第 2 步失败：返回版块信息 + "静音状态未知" |
| 版块名 → 版块信息 + 亮点 | fetch_subreddit_info → 跳转 `search.md` 的 fetch_community_highlights | `$.data.subreddit.id` → `subreddit_id` | 跨文件链路 |
| 版块 Feed → 帖子详情 | fetch_subreddit_feed → 跳转 `content.md` 的 fetch_post_details | `$.data.posts[].id` → `post_id` | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`content.md` 的 `fetch_post_details` 输出 `$.data.subreddit.name` → 本文件全部 subreddit_name 系端点
- **流入本文件**：`content.md` 的 `fetch_post_details` 输出 `$.data.subreddit.id` → fetch_subreddit_settings / check_subreddit_muted
- **流入本文件**：`search.md` 的 `fetch_dynamic_search` 输出 `$.data.results[].name`（search_type=community）→ 本文件
- **流入本文件**：`search.md` 的 `fetch_search_typeahead` 输出 `$.data.subreddits[].name` → 本文件
- **流入本文件**：`user.md` 的 `fetch_user_active_subreddits` 输出 `$.data.subreddits[].name` → 本文件
- **流出本文件**：`fetch_subreddit_info` 的 `$.data.subreddit.id` → search.md 的 fetch_community_highlights
- **流出本文件**：`fetch_subreddit_feed` 的 `$.data.posts[].id` → content.md 多端点

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- **第 2 步：自检通过后**才能 STOP 并报告"资源不存在"
- **禁止**：❌ 改路径段 ❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改 subreddit_id 重试
- **替换**：参考 `param-mappings.md` 的"端点替换矩阵"

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP

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

### fetch_subreddit_info — 版块信息

**Full path:** `/api/v1/reddit/app/fetch_subreddit_info`
**Method:** GET · **Risk:** low

#### 用途
获取版块详细信息——描述、订阅数、创建时间、规则等元数据。**subreddit_id 的主要产出入口**——后续调用 fetch_subreddit_settings / check_subreddit_muted / fetch_community_highlights 需从此端点获取 subreddit_id。

#### 何时使用 / 不使用
- ✅ 用户提供版块名称（如 `pics`），想看版块详情
- ✅ 链式起点：subreddit_name → subreddit_id
- ❌ 想看版块帖子 → 直接 fetch_subreddit_feed
- ❌ 想看版块规则样式 → fetch_subreddit_style

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| subreddit_name | string | no | — | 版块名称（不带 r/ 前缀，default: pics），如 `pics` |
| need_format | boolean | no | — | 是否清洗数据（default: False） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| subreddit.id | `$.data.subreddit.id` | 版块 ID（t5_ 前缀） | fetch_subreddit_settings / check_subreddit_muted / search.md 的 fetch_community_highlights |
| subreddit.name | `$.data.subreddit.name` | 版块名称 | 本文件 subreddit_name 系端点 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 版块不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 fetch_subreddit_style（仅样式信息） |

---

### fetch_subreddit_feed — 版块 Feed

**Full path:** `/api/v1/reddit/app/fetch_subreddit_feed`
**Method:** GET · **Risk:** low

#### 用途
获取版块帖子列表，含帖子详情、版块元数据、分页信息。是 content.md 的常见上游产出 post_id 的端点。

#### 何时使用 / 不使用
- ✅ 已知版块名称，想看该版块帖子
- ✅ 链式产出 post_id 给 content.md
- ❌ 想看版块信息本身 → fetch_subreddit_info
- ❌ 想看版块规则 → fetch_subreddit_style

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| subreddit_name | string | yes | — | 版块名称（不带 r/ 前缀），如 `AskReddit` |
| sort | string | no | enum=`BEST,HOT,NEW,TOP,CONTROVERSIAL,RISING` | 排序方式（default: BEST） |
| filter_posts | array\<item\> | no | — | 过滤帖子 ID 列表（default: []） |
| after | string | no | — | 分页参数 |
| need_format | boolean | no | — | 是否清洗数据（default: False） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| posts[].id | `$.data.posts[].id` | 帖子 ID | content.md 多端点 |
| after | `$.data.after` | 下一页分页参数 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 版块不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 fetch_subreddit_post_channels |

---

### fetch_subreddit_style — 版块规则样式

**Full path:** `/api/v1/reddit/app/fetch_subreddit_style`
**Method:** GET · **Risk:** low

#### 用途
获取版块的规则和样式信息。

#### 何时使用 / 不使用
- ✅ 用户明确问"版块规则/样式"
- ❌ 想看版块基本信息 → fetch_subreddit_info（信息更全）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| subreddit_name | string | no | — | 版块名称（不带 r/ 前缀，default: pics），如 `pics` |
| need_format | boolean | no | — | 是否清洗数据（default: False） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 规则和样式信息，无常用链式字段 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_subreddit_post_channels — 版块帖子频道

**Full path:** `/api/v1/reddit/app/fetch_subreddit_post_channels`
**Method:** GET · **Risk:** low

#### 用途
获取版块的帖子频道信息，含频道分类和帖子列表。

#### 何时使用 / 不使用
- ✅ 用户明确问"版块频道/帖子分类"
- ❌ 想看版块全部帖子 → fetch_subreddit_feed

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| subreddit_name | string | no | — | 版块名称（default: pics），如 `pics` |
| sort | string | no | enum=`HOT,NEW,TOP,CONTROVERSIAL,RISING` | 排序方式（default: HOT） |
| range | string | no | enum=`HOUR,DAY,WEEK,MONTH,YEAR,ALL` | 时间范围（default: DAY） |
| need_format | boolean | no | — | 是否清洗数据（default: False） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 频道信息，无常用链式字段 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 fetch_subreddit_feed |

---

### fetch_subreddit_settings — 版块设置

**Full path:** `/api/v1/reddit/app/fetch_subreddit_settings`
**Method:** GET · **Risk:** low

#### 用途
获取版块设置——subredditType (public/private/restricted)、submissionType、允许的媒体类型、flairSettings、审核设置等。**必须先从 fetch_subreddit_info 获取 subreddit_id**。

#### 何时使用 / 不使用
- ✅ 已通过 fetch_subreddit_info 取得 subreddit_id，用户想看版块设置
- ❌ 不知 subreddit_id → 先调用 fetch_subreddit_info

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| subreddit_id | string | yes | pattern=`^t5_` | 版块 ID（t5_ 前缀），如 `t5_2qh0u` |
| need_format | boolean | no | — | 是否清洗数据（default: False） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 设置信息，无常用链式字段 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | subreddit_id 无效 | 检查是否来自 fetch_subreddit_info | ≤1 次 | — |
| 404 | 版块不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### check_subreddit_muted — 检查版块静音

**Full path:** `/api/v1/reddit/app/check_subreddit_muted`
**Method:** GET · **Risk:** low

#### 用途
检查版块是否被当前用户静音。返回静音状态（isMuted 布尔值）和 subredditId。**必须先从 fetch_subreddit_info 获取 subreddit_id**。

#### 何时使用 / 不使用
- ✅ 已知 subreddit_id，用户想检查是否静音了某版块
- ❌ 不知 subreddit_id → 先调用 fetch_subreddit_info

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| subreddit_id | string | yes | pattern=`^t5_` | 版块 ID（t5_ 前缀），如 `t5_2qh0u` |
| need_format | boolean | no | — | 是否清洗数据（default: False） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| isMuted | `$.data.isMuted` | 是否静音 | — |
| subredditId | `$.data.subredditId` | 版块 ID | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | subreddit_id 无效 | 检查是否来自 fetch_subreddit_info | ≤1 次 | — |
| 404 | 版块不存在 | STOP | 0 | — |
