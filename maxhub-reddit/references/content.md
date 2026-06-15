# Reddit Content / Reddit 内容

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
首页推荐、热门/流行、游戏、资讯、发现页、分类 Feed、帖子详情（单个/批量/大批量）、帖子评论、评论回复、Reddit Answers 精简数据 —— 围绕"帖子内容"的全部读取入口。**post_id 与 subreddit_name 多在本文件首步产出**，是其他链式调用的常见起点。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| fetch_home_feed | ⭐⭐⭐ 首选 | 取首页推荐 Feed（无明确目标时的冷启动入口） | GET | /api/v1/reddit/app/fetch_home_feed | low |
| fetch_popular_feed | ⭐⭐⭐ 首选 | 取全站热门帖子（含排序+时间范围） | GET | /api/v1/reddit/app/fetch_popular_feed | low |
| fetch_games_feed | ⭐⭐ 条件 | 取游戏推荐 Feed（仅用户提及"游戏"时用） | GET | /api/v1/reddit/app/fetch_games_feed | low |
| fetch_news_feed | ⭐⭐ 条件 | 取资讯推荐 Feed（仅用户提及"新闻/资讯"时用） | GET | /api/v1/reddit/app/fetch_news_feed | low |
| fetch_explore_feed | ⭐⭐ 条件 | 取发现页（社区分类导航，**topic_id 产出入口**） | GET | /api/v1/reddit/app/fetch_explore_feed | low |
| fetch_topic_feed | ⭐⭐ 条件 | 用 topic_id 取分类 Feed（需先从 explore 获取 topic_id） | GET | /api/v1/reddit/app/fetch_topic_feed | low |
| fetch_post_details | ⭐⭐⭐ 首选 | 用 post_id 取单个帖子完整详情（**链式起点**） | GET | /api/v1/reddit/app/fetch_post_details | low |
| fetch_post_details_batch | ⭐⭐ 条件 | 用 post_ids 批量取帖子详情（≤5 条） | GET | /api/v1/reddit/app/fetch_post_details_batch | low |
| fetch_post_details_batch_large | ⭐ 降级 | 用 post_ids 大批量取帖子详情（≤30 条，响应慢） | GET | /api/v1/reddit/app/fetch_post_details_batch_large | low |
| fetch_post_comments | ⭐⭐⭐ 首选 | 用 post_id 取帖子一级评论 | GET | /api/v1/reddit/app/fetch_post_comments | low |
| fetch_comment_replies | ⭐⭐ 条件 | 用 cursor 取评论回复（二级评论，仅当用户明确要"回复"时用） | GET | /api/v1/reddit/app/fetch_comment_replies | low |
| fetch_generated_posts | ⭐⭐ 条件 | 批量取 Reddit Answers 精简帖子（仅需摘要信息时用） | GET | /api/v1/reddit/app/fetch_generated_posts | low |
| fetch_generated_comments | ⭐⭐ 条件 | 批量取 Reddit Answers 精简评论（仅需摘要信息时用） | GET | /api/v1/reddit/app/fetch_generated_comments | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看帖子 + 评论 | fetch_post_details → fetch_post_comments | `$.data.post_id` → `post_id` | 第 1 步失败：STOP；第 2 步失败：返回帖子详情 + "评论暂不可取" |
| 看评论 + 回复 | fetch_post_comments → fetch_comment_replies | `$.data.commentForest.trees[-1].more.cursor` → `cursor` | 第 2 步失败：返回已有评论 + "回复缺失" |
| 看帖子 + 评论 + 回复 | fetch_post_details → fetch_post_comments → fetch_comment_replies | post_id → cursor 接力 | 任意中间步失败：返回截止失败前的数据 |
| 发现页 → 分类 Feed | fetch_explore_feed → fetch_topic_feed | `$.data.topics[].id` → `topic_id` | 第 1 步失败：STOP；第 2 步空数据：返回分类列表 + "该分类暂无帖子" |
| Feed → 帖子详情 | fetch_home_feed / fetch_popular_feed → fetch_post_details | `$.data.posts[].id` → `post_id` | 第 2 步失败：返回 Feed 列表 + "详情暂不可取" |
| 帖子详情 → 版块信息 | fetch_post_details → 跳转 `subreddit.md` 的 fetch_subreddit_info | `$.data.subreddit.name` → `subreddit_name` | 跨文件链路 |
| 帖子详情 → 作者主页 | fetch_post_details → 跳转 `user.md` 的 fetch_user_profile | `$.data.author.name` → `username` | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`subreddit.md` 的 `fetch_subreddit_feed` 输出 `$.data.posts[].id` → 本文件多个端点的 `post_id`
- **流入本文件**：`user.md` 的 `fetch_user_posts` 输出 `$.data.posts[].id` → 本文件多个端点的 `post_id`
- **流入本文件**：`search.md` 的 `fetch_dynamic_search` 输出 `$.data.results[].id` → 本文件多个端点的 `post_id`
- **流出本文件**：`$.data.subreddit.name` → `subreddit.md` 全部 subreddit 系端点
- **流出本文件**：`$.data.author.name` → `user.md` 全部 user 系端点

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项；通用规则见此处。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
  - 路径是否在 `endpoints_whitelist.yaml` 中？
  - Method、参数键名是否符合白名单？
  - 资源 ID（post_id/topic_id 等）是否来自合法响应字段？
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**，向用户报告
- **禁止**：❌ 改路径段 ❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改资源 ID 重试
- **替换**：参考 `param-mappings.md` 的"端点替换矩阵"

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
  - 参数名是否逐字符匹配 IN 表？无大小写/缩写/复数错？
  - 必填项是否齐全？
  - 类型 / pattern / enum 是否严格匹配？
  - 传参方式（query vs body）是否正确？Authorization 头是否正确？
  - **是否有 IN 表外的臆造参数**？
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP
- **禁止**：❌ 切换端点 ❌ 在 IN 表外凭空加参数

### 鉴权错误（401）
- **行动**：**STOP**，提示用户检查或更换 API Key（https://www.aconfig.cn/console）

### 余额 / 付费（402）
- **行动**：**STOP**，告知用户充值（https://www.aconfig.cn/billing）

### 权限错误（403）
- **行动**：**STOP**，按子场景告知用户去控制台处理

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

### fetch_home_feed — 首页推荐

**Full path:** `/api/v1/reddit/app/fetch_home_feed`
**Method:** GET · **Risk:** low

#### 用途
获取 Reddit 首页推荐帖子列表。**帖子冷启动入口**——用户没有具体 post_id 时，可从此端点采集 post_id 进入其他链路。

#### 何时使用 / 不使用
- ✅ 用户问"Reddit 首页有什么"等无明确目标场景
- ✅ 链式起点：批量取 post_id 后并行调用 fetch_post_details 等
- ❌ 用户已给 post_id → 直接 fetch_post_details
- ❌ 用户想看热门 → fetch_popular_feed（支持更多排序和时间范围）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sort | string | no | enum=`HOT,NEW,TOP,BEST,CONTROVERSIAL` | 排序方式（default: BEST） |
| filter_posts | array\<item\> | no | — | 过滤帖子 ID 列表（default: []） |
| after | string | no | — | 分页参数 |
| need_format | boolean | no | — | 是否清洗数据（default: False） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| posts[].id | `$.data.posts[].id` | 帖子 ID（t3_ 前缀） | fetch_post_details / fetch_post_comments / fetch_generated_posts |
| after | `$.data.after` | 下一页分页参数 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代（首页是最顶层入口） |

---

### fetch_popular_feed — 热门/流行推荐

**Full path:** `/api/v1/reddit/app/fetch_popular_feed`
**Method:** GET · **Risk:** low

#### 用途
获取 Reddit 全站热门帖子列表，支持更多排序和时间范围选项。比 home_feed 更适合"看热门"场景。

#### 何时使用 / 不使用
- ✅ 用户想看"热门/流行/趋势"帖子
- ✅ 需要按时间范围筛选（如"今天的热门"）
- ❌ 用户想看首页个性化推荐 → fetch_home_feed

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sort | string | no | enum=`BEST,HOT,NEW,TOP,CONTROVERSIAL,RISING` | 排序方式（default: BEST） |
| time | string | no | enum=`ALL,HOUR,DAY,WEEK,MONTH,YEAR` | 时间范围（default: ALL） |
| filter_posts | array\<item\> | no | — | 过滤帖子 ID 列表（default: []） |
| after | string | no | — | 分页参数 |
| need_format | boolean | no | — | 是否清洗数据（default: False） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| posts[].id | `$.data.posts[].id` | 帖子 ID | fetch_post_details / fetch_post_comments |
| after | `$.data.after` | 下一页分页参数 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 fetch_home_feed |

---

### fetch_games_feed — 游戏推荐

**Full path:** `/api/v1/reddit/app/fetch_games_feed`
**Method:** GET · **Risk:** low

#### 用途
获取游戏相关帖子列表，含社区讨论、游戏新闻和更新。

#### 何时使用 / 不使用
- ✅ 用户明确提及"游戏"相关内容
- ❌ 用户想看通用热门 → fetch_popular_feed

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sort | string | no | enum=`NEW,HOT,TOP,RISING` | 排序方式（default: NEW） |
| time | string | no | enum=`ALL,HOUR,DAY,WEEK,MONTH,YEAR` | 时间范围（default: ALL） |
| after | string | no | — | 分页参数 |
| need_format | boolean | no | — | 是否清洗数据（default: False） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| posts[].id | `$.data.posts[].id` | 帖子 ID | fetch_post_details |
| after | `$.data.after` | 下一页分页参数 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 fetch_popular_feed |

---

### fetch_news_feed — 资讯推荐

**Full path:** `/api/v1/reddit/app/fetch_news_feed`
**Method:** GET · **Risk:** low

#### 用途
获取新闻帖子列表，含时事讨论、热点话题、新闻来源。

#### 何时使用 / 不使用
- ✅ 用户明确提及"新闻/资讯"相关内容
- ❌ 用户想看通用热门 → fetch_popular_feed

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| subtopic_ids | array\<item\> | no | — | 子话题 ID 列表（default: ['all']） |
| after | string | no | — | 分页参数 |
| need_format | boolean | no | — | 是否清洗数据（default: False） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| posts[].id | `$.data.posts[].id` | 帖子 ID | fetch_post_details |
| after | `$.data.after` | 下一页分页参数 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 fetch_popular_feed |

---

### fetch_explore_feed — 发现页 (社区分类)

**Full path:** `/api/v1/reddit/app/fetch_explore_feed`
**Method:** GET · **Risk:** low

#### 用途
获取发现页内容，含推荐社区轮播、分类导航。**topic_id 的唯一产出入口**——后续调用 fetch_topic_feed 必须先从此端点获取 topic_id。

#### 何时使用 / 不使用
- ✅ 用户想浏览/发现社区分类
- ✅ 链式起点：取 topic_id 后调用 fetch_topic_feed
- ❌ 用户已知具体版块名 → 直接 fetch_subreddit_feed

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sort | string | no | enum=`BEST,HOT,NEW,TOP,CONTROVERSIAL` | 排序方式（default: BEST） |
| time | string | no | enum=`ALL,HOUR,DAY,WEEK,MONTH,YEAR` | 时间范围（default: ALL） |
| need_format | boolean | no | — | 是否清洗数据（default: False） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| topics[].id | `$.data.topics[].id` | 分类 ID（tx1_ 前缀） | fetch_topic_feed.topic_id |
| posts[].id | `$.data.posts[].id` | 帖子 ID | fetch_post_details |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_topic_feed — 分类 Feed

**Full path:** `/api/v1/reddit/app/fetch_topic_feed`
**Method:** GET · **Risk:** low

#### 用途
获取指定社区分类的 Feed 帖子列表。**必须先从 fetch_explore_feed 获取 topic_id**。

#### 何时使用 / 不使用
- ✅ 已通过 fetch_explore_feed 取得 topic_id
- ❌ 不知 topic_id → 先调用 fetch_explore_feed

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| topic_id | string | yes | — | 分类 ID（从 fetch_explore_feed 的 topics 获取），如 `tx1_29m4k39` |
| scheme_name | string | no | — | 分类 scheme（default: communities_tab_taxonomy_topics_default） |
| sort | string | no | enum=`BEST,HOT,NEW,TOP,CONTROVERSIAL` | 排序方式（default: BEST） |
| time | string | no | enum=`ALL,HOUR,DAY,WEEK,MONTH,YEAR` | 时间范围（default: ALL） |
| need_format | boolean | no | — | 是否清洗数据（default: False） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| posts[].id | `$.data.posts[].id` | 帖子 ID | fetch_post_details |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | topic_id 无效 | 检查是否来自 fetch_explore_feed | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_post_details — 单个帖子详情

**Full path:** `/api/v1/reddit/app/fetch_post_details`
**Method:** GET · **Risk:** low

#### 用途
获取单个帖子的完整详情，包含标题、内容、作者、统计数据、版块信息、奖励、媒体资源。**链式调用的常见起点**——post_id、subreddit_name、author.name 多从此处产出。

#### 何时使用 / 不使用
- ✅ 用户提供 post_id（t3_ 前缀）
- ✅ 链式起点：取 post_id 或 subreddit_name 或 author.name
- ❌ 想看评论 → 直接用 fetch_post_comments
- ❌ 想批量查看 → fetch_post_details_batch（≤5）或 fetch_post_details_batch_large（≤30）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| post_id | string | yes | pattern=`^t3_` | 帖子 ID，如 `t3_1ojnh50` |
| include_comment_id | boolean | no | — | 是否包含特定评论（default: False） |
| comment_id | string | no | — | 评论 ID（include_comment_id=True 时使用） |
| need_format | boolean | no | — | 是否清洗数据（default: False） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| post_id | `$.data.post_id` | 帖子 ID | fetch_post_comments / fetch_generated_posts |
| subreddit.name | `$.data.subreddit.name` | 所属版块名称 | subreddit.md 全部 subreddit 系端点 |
| subreddit.id | `$.data.subreddit.id` | 所属版块 ID（t5_ 前缀） | subreddit.md 的 fetch_subreddit_settings / check_subreddit_muted / search.md 的 fetch_community_highlights |
| author.name | `$.data.author.name` | 作者用户名 | user.md 全部 user 系端点 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 帖子不存在/已删除 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 fetch_post_details_batch（单 ID） |

---

### fetch_post_details_batch — 批量帖子详情 (≤5 条)

**Full path:** `/api/v1/reddit/app/fetch_post_details_batch`
**Method:** GET · **Risk:** low

#### 用途
批量获取最多 5 条帖子的详情列表。

#### 何时使用 / 不使用
- ✅ 用户需要同时查看 2-5 条帖子详情
- ❌ 只需 1 条 → fetch_post_details（更轻量）
- ❌ 超过 5 条 → fetch_post_details_batch_large（≤30）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| post_ids | string | yes | 逗号分隔，最多 5 条 | 帖子 ID，如 `t3_1ojnh50,t3_1ok432f,t3_1nwil8j` |
| include_comment_id | boolean | no | — | 是否包含特定评论（default: False） |
| comment_id | string | no | — | 评论 ID |
| need_format | boolean | no | — | 是否清洗数据（default: False） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| posts[].id | `$.data.posts[].id` | 帖子 ID | fetch_post_comments 等 |
| posts[].subreddit.name | `$.data.posts[].subreddit.name` | 版块名称 | subreddit.md |
| posts[].author.name | `$.data.posts[].author.name` | 作者用户名 | user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | post_ids 格式错或超限 | 修正后重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到逐条 fetch_post_details |

---

### fetch_post_details_batch_large — 大批量帖子详情 (≤30 条)

**Full path:** `/api/v1/reddit/app/fetch_post_details_batch_large`
**Method:** GET · **Risk:** low

#### 用途
大批量获取最多 30 条帖子的详情列表。**响应时间较长**，仅在确实需要大量数据时使用。

#### 何时使用 / 不使用
- ✅ 用户需要同时查看 6-30 条帖子详情
- ❌ ≤5 条 → fetch_post_details_batch（更快）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| post_ids | string | yes | 逗号分隔，最多 30 条 | 帖子 ID |
| include_comment_id | boolean | no | — | 是否包含特定评论（default: False） |
| comment_id | string | no | — | 评论 ID |
| need_format | boolean | no | — | 是否清洗数据（default: False） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| posts[].id | `$.data.posts[].id` | 帖子 ID | fetch_post_comments 等 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | post_ids 格式错或超限 | 修正后重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 fetch_post_details_batch（分批） |

---

### fetch_post_comments — 帖子评论

**Full path:** `/api/v1/reddit/app/fetch_post_comments`
**Method:** GET · **Risk:** low

#### 用途
获取帖子下的一级评论列表，含评论树和分页信息。**cursor 的产出入口**——后续调用 fetch_comment_replies 需从此端点获取 cursor。

#### 何时使用 / 不使用
- ✅ 已知 post_id，想看帖子评论
- ✅ 链式中间步：为 fetch_comment_replies 提供 cursor
- ❌ 想看二级回复 → 链式调用 → fetch_comment_replies

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| post_id | string | yes | pattern=`^t3_` | 帖子 ID，如 `t3_1ojnvca` |
| sort_type | string | no | enum=`CONFIDENCE,NEW,TOP,HOT,CONTROVERSIAL,OLD,RANDOM` | 排序方式（default: CONFIDENCE） |
| after | string | no | — | 分页参数 |
| need_format | boolean | no | — | 是否清洗数据（default: False） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| comments[].id | `$.data.comments[].id` | 评论 ID（t1_ 前缀） | fetch_generated_comments |
| commentForest.trees[-1].more.cursor | `$.data.commentForest.trees[-1].more.cursor` | 评论游标 | fetch_comment_replies.cursor |
| comments[].author.name | `$.data.comments[].author.name` | 评论者用户名 | user.md |
| after | `$.data.after` | 下一页分页参数 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | post_id 不存在 | STOP | 0 | 无（评论无替代来源） |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_comment_replies — 评论回复 (二级评论)

**Full path:** `/api/v1/reddit/app/fetch_comment_replies`
**Method:** GET · **Risk:** low

#### 用途
获取指定评论下的子评论（回复）列表。**必须先从 fetch_post_comments 获取 cursor**。

#### 何时使用 / 不使用
- ✅ 已通过 fetch_post_comments 取得 cursor，用户想看某条评论的回复
- ❌ 不知 cursor → 先调用 fetch_post_comments
- ❌ 想看一级评论 → fetch_post_comments

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| post_id | string | yes | pattern=`^t3_` | 帖子 ID，如 `t3_1qmup73` |
| cursor | string | yes | — | 评论游标（从 fetch_post_comments 的 more.cursor 获取），如 `commenttree:ex:(RjiJd` |
| sort_type | string | no | enum=`CONFIDENCE,NEW,TOP,HOT,CONTROVERSIAL,OLD,RANDOM` | 排序方式（default: CONFIDENCE） |
| need_format | boolean | no | — | 是否清洗数据（default: False） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| replies[].id | `$.data.replies[].id` | 回复 ID | fetch_generated_comments |
| replies[].author.name | `$.data.replies[].author.name` | 回复者用户名 | user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | cursor 无效 | 检查是否来自 fetch_post_comments | ≤1 次 | — |
| 404 | 帖子或评论不存在 | STOP | 0 | 无替代 |

---

### fetch_generated_posts — 批量精简帖子

**Full path:** `/api/v1/reddit/app/fetch_generated_posts`
**Method:** GET · **Risk:** low

#### 用途
批量获取 Reddit Answers 卡片的精简帖子信息（id / title / score / commentCount / createdAt / url / authorInfo / subreddit / media）。**仅需摘要信息时使用**，比完整详情更轻量。

#### 何时使用 / 不使用
- ✅ 用户仅需帖子摘要信息（如 Reddit Answers 场景）
- ❌ 用户需要完整帖子详情 → fetch_post_details / fetch_post_details_batch

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| post_ids | string | yes | 逗号分隔 | 帖子 ID，如 `t3_1tlh0ir,t3_1tl1dlj,t3_1tl0br7` |
| need_format | boolean | no | — | 是否清洗数据（default: False） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| posts[].id | `$.data.posts[].id` | 帖子 ID | fetch_post_details（如需完整详情） |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | post_ids 格式错 | 修正后重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 fetch_post_details_batch |

---

### fetch_generated_comments — 批量精简评论

**Full path:** `/api/v1/reddit/app/fetch_generated_comments`
**Method:** GET · **Risk:** low

#### 用途
批量获取 Reddit Answers 卡片的精简评论信息（id / createdAt / score / authorInfo / postInfo / permalink）。**仅需摘要信息时使用**。

#### 何时使用 / 不使用
- ✅ 用户仅需评论摘要信息（如 Reddit Answers 场景）
- ❌ 用户需要完整评论树 → fetch_post_comments + fetch_comment_replies

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| comment_ids | string | yes | 逗号分隔 | 评论 ID（t1_ 前缀），如 `t1_onfhplx,t1_onfk44g,t1_onfmbu3` |
| need_format | boolean | no | — | 是否清洗数据（default: False） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| comments[].id | `$.data.comments[].id` | 评论 ID | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | comment_ids 格式错 | 修正后重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |
