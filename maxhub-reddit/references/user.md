# Reddit User / Reddit 用户

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
用户资料、活跃社区、评论列表、帖子列表、奖杯 —— 围绕"用户"的全部读取入口。**username 是本文件所有端点的核心入参**，多从 content.md / search.md 的响应中产出。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| fetch_user_profile | ⭐⭐⭐ 首选 | 用 username 取用户完整资料 | GET | /api/v1/reddit/app/fetch_user_profile | low |
| fetch_user_posts | ⭐⭐⭐ 首选 | 用 username 取用户帖子列表（**post_id 产出入口**） | GET | /api/v1/reddit/app/fetch_user_posts | low |
| fetch_user_comments | ⭐⭐ 条件 | 用 username 取用户评论列表（仅用户问"用户评论"时用） | GET | /api/v1/reddit/app/fetch_user_comments | low |
| fetch_user_active_subreddits | ⭐⭐ 条件 | 用 username 取用户活跃社区（仅用户问"活跃版块"时用） | GET | /api/v1/reddit/app/fetch_user_active_subreddits | low |
| fetch_user_trophies | ⭐ 条件 | 用 username 取用户奖杯（仅用户问"奖杯/成就"时用） | GET | /api/v1/reddit/app/fetch_user_trophies | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看用户资料 + 帖子 | fetch_user_profile → fetch_user_posts | username 复用 | 第 1 步失败：STOP；第 2 步失败：返回资料 + "帖子列表暂不可取" |
| 看用户资料 + 评论 | fetch_user_profile → fetch_user_comments | username 复用 | 第 2 步失败：返回资料 + "评论列表暂不可取" |
| 看用户资料 + 活跃社区 | fetch_user_profile → fetch_user_active_subreddits | username 复用 | 第 2 步空：返回资料 + "无活跃社区数据" |
| 看用户资料 + 奖杯 | fetch_user_profile → fetch_user_trophies | username 复用 | 第 2 步空：返回资料 + "无奖杯数据" |
| 用户帖子 → 帖子详情 | fetch_user_posts → 跳转 `content.md` 的 fetch_post_details | `$.data.posts[].id` → `post_id` | 跨文件链路 |
| 用户活跃社区 → 版块信息 | fetch_user_active_subreddits → 跳转 `subreddit.md` 的 fetch_subreddit_info | `$.data.subreddits[].name` → `subreddit_name` | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`content.md` 的 `fetch_post_details` 输出 `$.data.author.name` → 本文件全部 user 系端点
- **流入本文件**：`content.md` 的 `fetch_post_comments` 输出 `$.data.comments[].author.name` → 本文件
- **流入本文件**：`content.md` 的 `fetch_comment_replies` 输出 `$.data.replies[].author.name` → 本文件
- **流入本文件**：`search.md` 的 `fetch_dynamic_search` 输出 `$.data.results[].name`（search_type=people）→ 本文件
- **流入本文件**：`search.md` 的 `fetch_search_typeahead` 输出 `$.data.users[].name` → 本文件
- **流出本文件**：`fetch_user_posts` 的 `$.data.posts[].id` → content.md 多端点
- **流出本文件**：`fetch_user_active_subreddits` 的 `$.data.subreddits[].name` → subreddit.md

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- **第 2 步：自检通过后**才能 STOP 并报告"用户不存在"
- **禁止**：❌ 改路径段 ❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改 username 重试
- **替换**：参考 `param-mappings.md` 的"端点替换矩阵"

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP

### 鉴权错误（401）
- **行动**：**STOP**，提示用户检查或更换 API Key（https://www.aconfig.cn/console）

### 余额 / 付费（402）
- **行动**：**STOP**，告知用户充值（https://www.aconfig.cn/billing）

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

### fetch_user_profile — 获取用户资料

**Full path:** `/api/v1/reddit/app/fetch_user_profile`
**Method:** GET · **Risk:** low

#### 用途
获取用户详细资料——用户名、ID、注册时间、Karma（帖子+评论）、头像、横幅、简介、验证状态、徽章、关注者数。**user 系链式调用的常见验证步**。

#### 何时使用 / 不使用
- ✅ 已知 username，想看用户主页信息
- ✅ 链式中验证 username 是否有效
- ❌ 想看用户帖子 → fetch_user_posts（不要先调本端点再绕一圈）
- ❌ 想看用户评论 → fetch_user_comments
- ❌ 不知 username → 先从 content.md 或 search.md 获取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| username | string | yes | — | 用户名（不带 u/ 前缀），如 `spez` |
| need_format | boolean | no | — | 是否清洗数据（default: False） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| username | `$.data.username` | 用户名（回显） | 本文件全部 user 系端点复用 |
| id | `$.data.id` | 用户 ID | — |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在/已注销 | STOP | 0 | 降级到 fetch_search_typeahead（如有 username 上下文） |

---

### fetch_user_posts — 获取用户帖子列表

**Full path:** `/api/v1/reddit/app/fetch_user_posts`
**Method:** GET · **Risk:** low

#### 用途
获取用户帖子列表，含标题、内容、发布时间、所属版块、点赞数、评论数、帖子类型、媒体内容、分页信息。是 content.md 的常见上游产出 post_id 的端点。

#### 何时使用 / 不使用
- ✅ 已知 username，想看其帖子
- ✅ 链式产出 post_id 给 content.md
- ❌ 想看用户资料本身 → fetch_user_profile

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| username | string | yes | — | 用户名，如 `spez` |
| sort | string | no | enum=`NEW,TOP,HOT,CONTROVERSIAL` | 排序方式（default: NEW） |
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
| 404 | 用户不存在 | STOP | 0 | — |
| 空数据 | 该用户暂无帖子 | 返回"暂无帖子" | 0 | — |

---

### fetch_user_comments — 获取用户评论列表

**Full path:** `/api/v1/reddit/app/fetch_user_comments`
**Method:** GET · **Risk:** low

#### 用途
获取用户评论列表，含评论内容、所在帖子、时间、点赞数、回复数、分页信息。

#### 何时使用 / 不使用
- ✅ 已知 username，用户明确想看该用户的评论
- ❌ 想看用户帖子 → fetch_user_posts
- ❌ 想看某个帖子的评论 → content.md 的 fetch_post_comments

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| username | string | yes | — | 用户名，如 `spez` |
| sort | string | no | enum=`NEW,TOP,HOT,CONTROVERSIAL` | 排序方式（default: NEW） |
| page_size | integer | no | — | 每页数量（default: 25） |
| after | string | no | — | 分页参数 |
| need_format | boolean | no | — | 是否清洗数据（default: False） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| comments[].id | `$.data.comments[].id` | 评论 ID | fetch_generated_comments |
| after | `$.data.after` | 下一页分页参数 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |
| 空数据 | 该用户暂无评论 | 返回"暂无评论" | 0 | — |

---

### fetch_user_active_subreddits — 获取用户活跃社区

**Full path:** `/api/v1/reddit/app/fetch_user_active_subreddits`
**Method:** GET · **Risk:** low

#### 用途
获取用户最活跃的社区列表，含活跃度和社区基本信息。

#### 何时使用 / 不使用
- ✅ 用户明确问"某用户活跃在哪些版块"
- ❌ 想看用户帖子 → fetch_user_posts
- ❌ 想看用户资料 → fetch_user_profile

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| username | string | yes | — | 用户名，如 `spez` |
| need_format | boolean | no | — | 是否清洗数据（default: False） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| subreddits[].name | `$.data.subreddits[].name` | 社区名称 | subreddit.md 全部 subreddit_name 系端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |
| 空数据 | 该用户暂无活跃社区 | 返回"无活跃社区数据" | 0 | — |

---

### fetch_user_trophies — 获取用户奖杯

**Full path:** `/api/v1/reddit/app/fetch_user_trophies`
**Method:** GET · **Risk:** low

#### 用途
获取用户公开奖杯/成就列表，含奖杯名称、描述、图标 URL、获得时间。

#### 何时使用 / 不使用
- ✅ 用户明确问"某用户的奖杯/成就"
- ❌ 想看用户资料 → fetch_user_profile

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| username | string | yes | — | 用户名（不带 u/ 前缀），如 `spez` |
| need_format | boolean | no | — | 是否清洗数据（default: False） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 奖杯信息，无常用链式字段 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |
| 空数据 | 该用户暂无公开奖杯 | 返回"无奖杯数据" | 0 | — |
