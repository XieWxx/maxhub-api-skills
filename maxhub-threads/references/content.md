# Threads Content / Threads 内容

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
帖子详情（V1/V2）、帖子评论、搜索（热门/最新/用户档案） —— 围绕"内容"的全部读取入口。**post_id 多在本文件首步产出**，是其他链式调用的常见起点。

## 端点索引 (Endpoint Index)

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| fetch_post_detail | ⭐⭐ 条件 | 用纯数字 post_id 取帖子详情 | GET | /api/v1/threads/web/fetch_post_detail | low |
| fetch_post_detail_v2 | ⭐⭐⭐ 首选 | 用短代码/URL 取帖子详情（**推荐**） | GET | /api/v1/threads/web/fetch_post_detail_v2 | low |
| fetch_post_comments | ⭐⭐⭐ 首选 | 用 post_id 取帖子评论 | GET | /api/v1/threads/web/fetch_post_comments | low |
| search_top | ⭐⭐⭐ 首选 | 搜索热门内容（**内容冷启动入口**） | GET | /api/v1/threads/web/search_top | low |
| search_recent | ⭐⭐ 条件 | 搜索最新内容（仅当用户明确要"最新"时用） | GET | /api/v1/threads/web/search_recent | low |
| search_profiles | ⭐⭐⭐ 首选 | 搜索用户档案（**username 入口**） | GET | /api/v1/threads/web/search_profiles | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看帖子+评论 | fetch_post_detail → fetch_post_comments | `$.data.id` → `post_id` | 第 1 步失败：STOP；第 2 步失败：返回详情 + "评论暂不可取" |
| 看帖子+评论(V2) | fetch_post_detail_v2 → fetch_post_comments | `$.data.post_id` → `post_id` | 第 2 步失败：返回详情 |
| 搜索热门→详情 | search_top → fetch_post_detail | `$.data.threads[].id` → `post_id` | 第 1 步空：STOP |
| 搜索最新→详情 | search_recent → fetch_post_detail | `$.data.threads[].id` → `post_id` | 第 1 步空：STOP |
| 搜索用户→用户信息 | search_profiles → user.md 的 fetch_user_info | `$.data.users[].username` → `username` | 跨文件链路 |
| 帖子→作者信息 | fetch_post_detail → user.md 的 fetch_user_info_by_id | `$.data.user.pk` → `user_id` | 跨文件链路 |
| URL→帖子详情 | fetch_post_detail_v2（传入 url） | url 直接传入 | 失败：尝试提取短代码再调一次 |
| 评论→评论者信息 | fetch_post_comments → user.md 的 fetch_user_info_by_id | `$.data.comments[].user.pk` → `user_id` | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`user.md` 的 `fetch_user_posts` 输出 `$.data.threads[].id` → 本文件 `fetch_post_detail` / `fetch_post_comments`
- **流出本文件**：`search_profiles` 输出 `$.data.users[].username` → `user.md` 的 `fetch_user_info`
- **流出本文件**：`fetch_post_detail` / `fetch_post_detail_v2` 输出 `$.data.user.pk` → `user.md` 的 `fetch_user_info_by_id`
- **流出本文件**：`fetch_post_comments` 输出 `$.data.comments[].user.pk` → `user.md`

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- **第 2 步：自检通过后**才能 STOP 并报告"资源不存在"
- **禁止**：❌ 改路径段 ❌ 把 fetch_post_detail 改成 fetch_post_detail_v3 ❌ 拼接新路径
- **替换**：参考 `param-mappings.md` 的"端点替换矩阵"

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
- **特别注意**：`fetch_post_detail` 仅接受纯数字 post_id；`fetch_post_detail_v2` 的 post_id 和 url 至少提供一个
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP
- **禁止**：❌ 切换端点 ❌ 凭空加参数

### 鉴权 / 余额 / 权限 / 限流 / 上游故障 / 网络超时 / 业务错误
- 通用处理见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)

---

## 端点详情

### fetch_post_detail — 获取帖子详情

**Full path:** `/api/v1/threads/web/fetch_post_detail`
**Method:** GET · **Risk:** low

#### 用途
用纯数字 post_id 获取 Threads 帖子详情。当已有纯数字帖子 ID 时使用。

#### 何时使用 / 不使用
- ✅ 已有纯数字 post_id（如 `3349029093483693129`）
- ✅ 从 fetch_user_posts / search_top / search_recent 中取得的帖子 ID
- ❌ 有帖子短代码（如 `DPVUglOjOUu`）→ 用 fetch_post_detail_v2
- ❌ 有帖子完整 URL → 用 fetch_post_detail_v2

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| post_id | string | yes | 纯数字 | 帖子 ID，如 `3349029093483693129` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| id | `$.data.id` | 帖子 ID（回显） | fetch_post_comments |
| user.pk | `$.data.user.pk` | 作者用户 ID | user.md 的 fetch_user_info_by_id |
| user.username | `$.data.user.username` | 作者用户名 | user.md 的 fetch_user_info |
| like_count | `$.data.like_count` | 点赞数 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 帖子不存在/已删除 | STOP | 0 | 无替代 |
| 422 | post_id 格式错（非纯数字） | 检查是否应使用 fetch_post_detail_v2 | ≤1 次 | 换 fetch_post_detail_v2 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级 fetch_post_detail_v2（如有短代码或 URL） |

---

### fetch_post_detail_v2 — 获取帖子详情 V2（支持链接）

**Full path:** `/api/v1/threads/web/fetch_post_detail_v2`
**Method:** GET · **Risk:** low

#### 用途
用帖子短代码或完整 URL 获取帖子详情。**推荐优先使用**——支持多种输入格式，更灵活。

#### 何时使用 / 不使用
- ✅ 用户提供帖子短代码（如 `DPVUglOjOUu`）
- ✅ 用户提供完整帖子 URL（如 `https://www.threads.com/@taylorswift/post/DPVUglOjOUu`）
- ✅ 从用户分享的链接中提取信息
- ❌ 已有纯数字 post_id → 也可使用本端点（post_id 参数传入短代码）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| post_id | string | oneOf(post_id, url) | — | 帖子短代码，如 `DPVUglOjOUu` |
| url | string | oneOf(post_id, url) | startsWith=`https://www.threads.com/` | 完整帖子 URL |

> **至少传一个**：post_id 与 url 至少提供一个。同时传时 post_id 优先。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| post_id | `$.data.post_id` | 帖子 ID | fetch_post_comments |
| user.pk | `$.data.user.pk` | 作者用户 ID | user.md 的 fetch_user_info_by_id |
| user.username | `$.data.user.username` | 作者用户名 | user.md 的 fetch_user_info |
| like_count | `$.data.like_count` | 点赞数 | 仅展示 |
| reply_count | `$.data.reply_count` | 回复数 | 用于决定是否调用 fetch_post_comments |
| repost_count | `$.data.repost_count` | 转发数 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 422 | post_id 和 url 都未传 | 至少传一个 | ≤1 次 | — |
| 404 | 帖子不存在/已删除 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级 fetch_post_detail（需纯数字 ID） |

---

### fetch_post_comments — 获取帖子评论

**Full path:** `/api/v1/threads/web/fetch_post_comments`
**Method:** GET · **Risk:** low

#### 用途
获取指定帖子的一级评论列表（含分页 cursor）。

#### 何时使用 / 不使用
- ✅ 已知或已通过 fetch_post_detail 取得 post_id
- ✅ 链式中间步：为获取评论者信息提供 user_id
- ❌ 不知 post_id → 先调用 fetch_post_detail / fetch_post_detail_v2

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| post_id | string | yes | 纯数字 | 帖子 ID，如 `3390920896561588969` |
| end_cursor | string | no | — | 分页游标，首次请求留空 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| comments[].user.pk | `$.data.comments[].user.pk` | 评论者用户 ID | user.md 的 fetch_user_info_by_id |
| comments[].user.username | `$.data.comments[].user.username` | 评论者用户名 | user.md 的 fetch_user_info |
| next_cursor | `$.data.next_cursor` | 下一页游标 | 同端点翻页 |
| has_more | `$.data.has_more` | 是否还有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | post_id 不存在 | STOP | 0 | 无（评论无替代来源） |
| 空数据 | 该帖子暂无评论 | 返回"暂无评论" | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### search_top — 搜索热门内容

**Full path:** `/api/v1/threads/web/search_top`
**Method:** GET · **Risk:** low

#### 用途
按关键词搜索 Threads 热门内容。**内容冷启动入口**——用户没有具体 post_id 时，可从此端点采集。

#### 何时使用 / 不使用
- ✅ 用户想搜索某个话题的热门帖子
- ✅ 链式起点：搜索 → post_id → 帖子详情
- ❌ 用户明确要"最新"内容 → search_recent
- ❌ 想搜索用户 → search_profiles

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| query | string | yes | — | 搜索关键词，如 `bitcoin` |
| end_cursor | string | no | — | 分页游标，首次请求留空 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| threads[].id | `$.data.threads[].id` | 帖子 ID | fetch_post_detail / fetch_post_comments |
| threads[].user.pk | `$.data.threads[].user.pk` | 作者用户 ID | user.md |
| next_cursor | `$.data.next_cursor` | 下一页游标 | 同端点翻页 |
| has_more | `$.data.has_more` | 是否还有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空结果 | 关键词未命中 | STOP，告知用户 | 0 | 可建议换关键词或用 search_recent |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级 search_recent |

---

### search_recent — 搜索最新内容

**Full path:** `/api/v1/threads/web/search_recent`
**Method:** GET · **Risk:** low

#### 用途
按关键词搜索 Threads 最新内容（按时间排序）。

#### 何时使用 / 不使用
- ✅ 用户明确要"最新"内容
- ✅ search_top 失败时的降级选项
- ❌ 用户想看热门内容 → search_top

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| query | string | yes | — | 搜索关键词，如 `bitcoin` |
| end_cursor | string | no | — | 分页游标，首次请求留空 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| threads[].id | `$.data.threads[].id` | 帖子 ID | fetch_post_detail / fetch_post_comments |
| threads[].user.pk | `$.data.threads[].user.pk` | 作者用户 ID | user.md |
| next_cursor | `$.data.next_cursor` | 下一页游标 | 同端点翻页 |
| has_more | `$.data.has_more` | 是否还有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空结果 | 关键词未命中 | STOP，告知用户 | 0 | 可建议换关键词或用 search_top |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级 search_top |

---

### search_profiles — 搜索用户档案

**Full path:** `/api/v1/threads/web/search_profiles`
**Method:** GET · **Risk:** low

#### 用途
按关键词搜索 Threads 用户档案。**username 入口**——把搜索关键词转换为 username，供后续 user 系端点使用。

#### 何时使用 / 不使用
- ✅ 用户给出人名/昵称但不知 username
- ✅ 链式起点：搜索 → username → fetch_user_info
- ❌ 已知 username → 直接 fetch_user_info
- ❌ 想搜内容 → search_top / search_recent

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| query | string | yes | — | 搜索关键词，如 `mark` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| users[].pk | `$.data.users[].pk` | 用户 ID | user.md 的 fetch_user_info_by_id |
| users[].username | `$.data.users[].username` | 用户名 | user.md 的 fetch_user_info |
| users[].full_name | `$.data.users[].full_name` | 全名 | 用于核对身份避免误命中 |
| users[].is_verified | `$.data.users[].is_verified` | 是否认证 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空结果 | 关键词未命中 | STOP，告知用户 | 0 | — |
| 多结果 | 重名 | 让用户选择或返回前 N 个候选 | 0 | — |
