# Reddit Search & Discovery / Reddit 搜索与发现

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
搜索自动补全、动态搜索（帖子/社区/评论/媒体/用户）、社区亮点、热门搜索趋势 —— 围绕"搜索与发现"的全部读取入口。**username / subreddit_name 多在本文件首步产出**，是其他链式调用的常见起点。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| fetch_dynamic_search | ⭐⭐⭐ 首选 | 动态搜索（帖子/社区/评论/媒体/用户，**全功能搜索入口**） | GET | /api/v1/reddit/app/fetch_dynamic_search | low |
| fetch_search_typeahead | ⭐⭐ 条件 | 搜索自动补全建议（仅用户输入时补全用） | GET | /api/v1/reddit/app/fetch_search_typeahead | low |
| fetch_community_highlights | ⭐⭐ 条件 | 用 subreddit_id 取社区亮点精选（需先从 subreddit.md 获取 ID） | GET | /api/v1/reddit/app/fetch_community_highlights | low |
| fetch_trending_searches | ⭐ 条件 | 取今日热门搜索趋势（无入参，趋势浏览用） | GET | /api/v1/reddit/app/fetch_trending_searches | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 搜索帖子 → 帖子详情 | fetch_dynamic_search → 跳转 `content.md` 的 fetch_post_details | `$.data.results[].id` → `post_id` | 第 2 步失败：返回搜索结果 + "详情暂不可取" |
| 搜索社区 → 版块信息 | fetch_dynamic_search → 跳转 `subreddit.md` 的 fetch_subreddit_info | `$.data.results[].name` → `subreddit_name` | 跨文件链路 |
| 搜索用户 → 用户资料 | fetch_dynamic_search → 跳转 `user.md` 的 fetch_user_profile | `$.data.results[].name` → `username` | 跨文件链路 |
| 版块信息 → 社区亮点 | fetch_subreddit_info（subreddit.md）→ fetch_community_highlights | `$.data.subreddit.id` → `subreddit_id` | 跨文件链路 |
| 热门趋势 → 搜索 | fetch_trending_searches → fetch_dynamic_search | 趋势关键词 → `query` | 第 2 步失败：返回趋势列表 |

## 跨 reference 链路 (In-Chain)
- **流出本文件**：`fetch_dynamic_search` 的 `$.data.results[].id`（search_type=post）→ content.md 多端点
- **流出本文件**：`fetch_dynamic_search` 的 `$.data.results[].name`（search_type=community）→ subreddit.md
- **流出本文件**：`fetch_dynamic_search` 的 `$.data.results[].name`（search_type=people）→ user.md
- **流出本文件**：`fetch_search_typeahead` 的 `$.data.subreddits[].name` → subreddit.md
- **流出本文件**：`fetch_search_typeahead` 的 `$.data.users[].name` → user.md
- **流入本文件**：`subreddit.md` 的 `fetch_subreddit_info` 输出 `$.data.subreddit.id` → fetch_community_highlights

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- **第 2 步：自检通过后**才能 STOP 并报告"资源不存在"
- **禁止**：❌ 改路径段 ❌ 切换平台前缀 ❌ 拼接新路径
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

### fetch_dynamic_search — 动态搜索

**Full path:** `/api/v1/reddit/app/fetch_dynamic_search`
**Method:** GET · **Risk:** low

#### 用途
Reddit 全功能搜索入口，支持按帖子/社区/评论/媒体/用户五种类型搜索。**搜索场景的首选端点**——username / subreddit_name / post_id 多从此处产出。

#### 何时使用 / 不使用
- ✅ 用户想搜索任何 Reddit 内容
- ✅ 链式起点：搜索结果中的 username / subreddit_name / post_id 可跳转到其他文件
- ❌ 用户仅需输入补全建议 → fetch_search_typeahead（更轻量）
- ❌ 用户想看热门趋势 → fetch_trending_searches

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| query | string | yes | — | 搜索关键词，如 `python programming` |
| search_type | string | no | enum=`post,community,comment,media,people` | 搜索类型（default: post） |
| sort | string | no | enum=`RELEVANCE,HOT,TOP,NEW,COMMENTS` | 排序（仅 post/comment/media 有效，default: RELEVANCE） |
| time_range | string | no | enum=`all,year,month,week,day,hour` | 时间范围（仅 post/media 有效，default: all） |
| safe_search | string | no | enum=`unset,strict` | 安全搜索（default: unset） |
| allow_nsfw | string | no | enum=`0,1` | 允许 NSFW（default: 0） |
| after | string | no | — | 分页参数 |
| need_format | boolean | no | — | 是否清洗数据（default: False） |

> **search_type 约束**：`community` 和 `people` 类型不支持 `sort` 和 `time_range`。`COMMENTS` 排序仅适用于 `post` 类型。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| results[].id | `$.data.results[].id` | 搜索结果 ID（post_id / comment_id 等） | content.md 多端点 |
| results[].name | `$.data.results[].name` | 名称（社区名/用户名，取决于 search_type） | subreddit.md / user.md |
| after | `$.data.after` | 下一页分页参数 | 同端点翻页 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | query 为空或参数冲突 | 修正后重试 | ≤1 次 | — |
| 空结果 | 无匹配结果 | 告知用户未找到，建议换关键词 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 fetch_search_typeahead |

---

### fetch_search_typeahead — 搜索自动补全

**Full path:** `/api/v1/reddit/app/fetch_search_typeahead`
**Method:** GET · **Risk:** low

#### 用途
获取搜索自动补全建议——相关版块、相关用户、搜索词建议、热门话题。**仅用于输入补全**，不返回完整搜索结果。

#### 何时使用 / 不使用
- ✅ 用户正在输入关键词，需要补全建议
- ✅ 快速查找版块名/用户名（不需要完整搜索结果时）
- ❌ 需要完整搜索结果 → fetch_dynamic_search

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| query | string | yes | — | 搜索关键词，如 `programming` |
| safe_search | string | no | enum=`unset,strict` | 安全搜索（default: unset） |
| allow_nsfw | string | no | enum=`0,1` | 允许 NSFW（default: 0） |
| need_format | boolean | no | — | 是否清洗数据（default: False） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| subreddits[].name | `$.data.subreddits[].name` | 建议版块名称 | subreddit.md 全部 subreddit_name 系端点 |
| users[].name | `$.data.users[].name` | 建议用户名 | user.md 全部 user 系端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | query 为空 | 修正后重试 | ≤1 次 | — |
| 空结果 | 无匹配建议 | 告知用户 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_community_highlights — 社区亮点

**Full path:** `/api/v1/reddit/app/fetch_community_highlights`
**Method:** GET · **Risk:** low

#### 用途
获取社区精选亮点——精选帖子列表、置顶公告、重要动态、推荐内容。**必须先从 subreddit.md 的 fetch_subreddit_info 获取 subreddit_id**。

#### 何时使用 / 不使用
- ✅ 已知 subreddit_id，用户想看社区精选/亮点
- ❌ 不知 subreddit_id → 先调用 subreddit.md 的 fetch_subreddit_info
- ❌ 想看版块普通帖子 → subreddit.md 的 fetch_subreddit_feed

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| subreddit_id | string | yes | pattern=`^t5_` | 版块 ID（t5_ 前缀），如 `t5_2qh0u` |
| need_format | boolean | no | — | 是否清洗数据（default: False） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| posts[].id | `$.data.posts[].id` | 精选帖子 ID | content.md 多端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | subreddit_id 无效 | 检查是否来自 fetch_subreddit_info | ≤1 次 | — |
| 404 | 版块不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 subreddit.md 的 fetch_subreddit_feed |
| 空数据 | 该版块暂无亮点 | 返回"暂无社区亮点" | 0 | — |

---

### fetch_trending_searches — 今日热门搜索

**Full path:** `/api/v1/reddit/app/fetch_trending_searches`
**Method:** GET · **Risk:** low

#### 用途
获取当前热门搜索关键词和趋势话题，含搜索量和热度、相关帖子预览。**无入参**，是趋势浏览的轻量入口。

#### 何时使用 / 不使用
- ✅ 用户想看"Reddit 今天什么热门/趋势"
- ✅ 趋势关键词可作为 fetch_dynamic_search 的 query 入参
- ❌ 用户有明确搜索目标 → 直接 fetch_dynamic_search

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| need_format | boolean | no | — | 是否清洗数据（default: False） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| trending[].query | `$.data.trending[].query` | 趋势搜索关键词 | fetch_dynamic_search.query |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 content.md 的 fetch_popular_feed |
