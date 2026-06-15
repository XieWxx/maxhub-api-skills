# PiPiXia Posts / 皮皮虾 内容

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
作品详情、统计、评论、浏览数、首页推荐、短剧推荐、搜索、热搜、话题、短连接工具 —— 围绕"内容"的全部读取入口及工具。**cell_id 与 user_id 多在本文件首步产出**，是其他链式调用的常见起点。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| fetch_post_detail | ⭐⭐⭐ 首选 | 用 cell_id 取作品完整详情（**链式起点**） | GET | /api/v1/pipixia/app/fetch_post_detail | low |
| fetch_increase_post_view_count | ⚠️ 写入·条件 | 增加作品浏览数 | GET | /api/v1/pipixia/app/fetch_increase_post_view_count | **medium ⚠️** |
| fetch_post_statistics | ⭐⭐ 条件 | 用 cell_id 取作品统计数据 | GET | /api/v1/pipixia/app/fetch_post_statistics | low |
| fetch_post_comment_list | ⭐⭐⭐ 首选 | 用 cell_id 取作品评论列表 | GET | /api/v1/pipixia/app/fetch_post_comment_list | low |
| fetch_home_feed | ⭐⭐⭐ 首选 | 取首页推荐 Feed（**内容冷启动入口**） | GET | /api/v1/pipixia/app/fetch_home_feed | low |
| fetch_home_short_drama_feed | ⭐⭐ 条件 | 取首页短剧推荐 | GET | /api/v1/pipixia/app/fetch_home_short_drama_feed | low |
| fetch_search | ⭐⭐⭐ 首选 | 按关键词搜索（综合/视频/图文/用户/话题） | GET | /api/v1/pipixia/app/fetch_search | low |
| fetch_hot_search_words | ⭐⭐ 条件 | 取热搜词条 | GET | /api/v1/pipixia/app/fetch_hot_search_words | low |
| fetch_hot_search_board_list | ⭐⭐ 条件 | 取热搜榜单列表 | GET | /api/v1/pipixia/app/fetch_hot_search_board_list | low |
| fetch_hot_search_board_detail | ⭐⭐ 条件 | 用 block_type 取热搜榜单详情 | GET | /api/v1/pipixia/app/fetch_hot_search_board_detail | low |
| fetch_hashtag_detail | ⭐⭐ 条件 | 用 hashtag_id 取话题详情 | GET | /api/v1/pipixia/app/fetch_hashtag_detail | low |
| fetch_hashtag_post_list | ⭐⭐ 条件 | 用 hashtag_id 取话题作品列表 | GET | /api/v1/pipixia/app/fetch_hashtag_post_list | low |
| fetch_short_url | ⭐ 工具 | 生成短连接 | GET | /api/v1/pipixia/app/fetch_short_url | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看作品 + 评论 | fetch_post_detail → fetch_post_comment_list | `$.data.cell_id` → `cell_id` | 第 1 步失败：STOP；第 2 步失败：返回作品详情 + "评论暂不可取" |
| 看作品 + 统计 | fetch_post_detail → fetch_post_statistics | `$.data.cell_id` → `cell_id` | 第 2 步失败：返回详情 + "统计数据暂不可取" |
| 看作品 + 作者主页 | fetch_post_detail → 跳转 `user.md` 的 fetch_user_info | `$.data.user.user_id` → `user_id` | 跨文件链路，详见 user.md |
| 首页推荐 → 作品详情 | fetch_home_feed → fetch_post_detail | `$.data.data[].cell_id` → `cell_id` | 第 2 步失败：返回推荐列表 + "详情暂不可取" |
| 搜索 → 作品详情 | fetch_search → fetch_post_detail | `$.data.data[].cell_id` → `cell_id` | 同上 |
| 话题 → 话题作品 | fetch_hashtag_detail → fetch_hashtag_post_list | `$.data.hashtag_id` → `hashtag_id` | 第 2 步空：返回话题详情 + "暂无作品" |
| 热搜榜单 → 榜单详情 | fetch_hot_search_board_list → fetch_hot_search_board_detail | `$.data.data[].block_type` → `block_type` | 第 1 步失败：STOP |
| 搜索用户 → 用户主页 | fetch_search（search_type=4）→ 跳转 `user.md` fetch_user_info | `$.data.data[].user_id` → `user_id` | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`user.md` 的 `fetch_user_post_list` 输出 `$.data.data[].cell_id` → 本文件多个端点的 `cell_id`
- **流出本文件**：`$.data.user.user_id` → `user.md` 全部 user 系端点的 `user_id`
- **流出本文件**：`fetch_search`（search_type=4）输出 `$.data.data[].user_id` → `user.md`

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项；通用规则见此处。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**
- **禁止**：❌ 改路径段 ❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改 cell_id 重试

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP

### 鉴权错误（401）→ **STOP**，提示用户检查 API Key（https://www.aconfig.cn/console）
### 余额 / 付费（402）→ **STOP**，告知用户充值（https://www.aconfig.cn/billing）
### 权限错误（403）→ **STOP**，按子场景告知用户去控制台处理
### 限流（429）→ 读 `Retry-After` 头退避；最多重试 2 次
### 上游故障（500/502/503/504）→ 等 3 秒重试 1 次 → 仍失败走端点级"降级/替换"
### 网络超时 → **STOP**
### 业务错误（HTTP 200 且 `code != 0`）→ 读 `message_zh`/`message` 报告用户；不重试

---

## 端点详情

### fetch_post_detail — 获取作品详情

**Full path:** `/api/v1/pipixia/app/fetch_post_detail`
**Method:** GET · **Risk:** low

#### 用途
获取皮皮虾单个作品的完整详情，包含作者、内容、统计等字段。**链式调用的常见起点**——cell_id 与 author.user_id 从此处产出。

#### 何时使用 / 不使用
- ✅ 用户提供 cell_id
- ✅ 链式起点：取 cell_id 或 author.user_id
- ❌ 想看评论 → 直接用 `fetch_post_comment_list`
- ❌ 想看作者其他作品 → 用 `user.md` 的 `fetch_user_post_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cell_id | string | yes | 纯数字字符串 | 作品 ID，形如 `7411193113223371043` |
| cell_type | integer | no | default=1 | 作品类型（1=默认） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| cell_id | `$.data.cell_id` | 作品 ID | fetch_post_statistics / fetch_post_comment_list / fetch_increase_post_view_count |
| user.user_id | `$.data.user.user_id` | 作者用户 ID | user.md 全部 user 系端点 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 作品不存在/已删除 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 仍失败 → 在 `fetch_search`/`fetch_user_post_list` 中匹配 cell_id 取降级数据 |

---

### fetch_increase_post_view_count — 增加作品浏览数 ⚠️ 写入操作

**Full path:** `/api/v1/pipixia/app/fetch_increase_post_view_count`
**Method:** GET · **Risk:** medium · **write_operation:** true

#### 用途
增加指定作品的浏览计数。**写入操作**——调用前应由用户明确确认。

#### 何时使用 / 不使用
- ✅ 用户明确要求"增加浏览数"
- ❌ 用户只想看作品详情 → 用 `fetch_post_detail`
- ❌ 用户未明确确认 → 先与用户确认

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cell_id | string | yes | 纯数字字符串 | 作品 ID |
| cell_type | integer | no | default=1 | 作品类型 |

> ⚠️ **写入操作前置确认**：调用前应向用户确认 cell_id 准确无误。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 执行结果，无链式字段 | — |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400/422 | 参数错 | **不要静默重试**，让用户确认参数 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | **≤1 次** | 仍失败 STOP |

---

### fetch_post_statistics — 获取作品统计数据

**Full path:** `/api/v1/pipixia/app/fetch_post_statistics`
**Method:** GET · **Risk:** low

#### 用途
获取指定作品的统计数据（点赞数、评论数、转发数等）。

#### 何时使用 / 不使用
- ✅ 用户明确要"统计数据"且不需要完整详情
- ❌ 想看作品完整信息 → 用 `fetch_post_detail`（内含部分统计）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cell_id | string | yes | 纯数字字符串 | 作品 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 统计数据，通常无链式字段 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 作品不存在 | STOP | 0 | **降级**：改用 `fetch_post_detail` 取部分统计字段 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 同上降级 |

---

### fetch_post_comment_list — 获取作品评论列表

**Full path:** `/api/v1/pipixia/app/fetch_post_comment_list`
**Method:** GET · **Risk:** low

#### 用途
获取指定作品的评论列表（含分页 offset）。

#### 何时使用 / 不使用
- ✅ 已知 cell_id，想看评论
- ❌ 不知 cell_id → 先调用 fetch_post_detail 或 fetch_search

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cell_id | string | yes | 纯数字字符串 | 作品 ID |
| cell_type | integer | no | default=1 | 作品类型 |
| offset | string | no | default="0" | 分页游标，首次请求留空或传 "0" |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| comments[].user.user_id | `$.data.comments[].user.user_id` | 评论者用户 ID | user.md user 系端点 |
| offset | `$.data.offset` | 下一页游标 | 同端点的下一次调用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | cell_id 不存在 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_home_feed — 获取首页推荐

**Full path:** `/api/v1/pipixia/app/fetch_home_feed`
**Method:** GET · **Risk:** low

#### 用途
获取首页推荐 Feed 流。**内容冷启动入口**——用户没有具体 cell_id 时，可从此端点采集 cell_id 进入其他链路。

#### 何时使用 / 不使用
- ✅ 用户问"皮皮虾有什么热门"等无明确目标作品的场景
- ✅ 链式起点：批量取 cell_id 后并行调用 fetch_post_detail 等
- ❌ 用户已给 cell_id → 直接 fetch_post_detail

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cursor | string | no | default="0" | 分页游标，下一页从 `$.data.loadmore_cursor` 取 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data[].cell_id | `$.data.data[].cell_id` | 推荐作品 ID | 本文件多端点 |
| data[].user.user_id | `$.data.data[].user.user_id` | 作者用户 ID | user.md |
| loadmore_cursor | `$.data.loadmore_cursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代（feed 是最顶层入口） |

---

### fetch_home_short_drama_feed — 获取首页短剧推荐

**Full path:** `/api/v1/pipixia/app/fetch_home_short_drama_feed`
**Method:** GET · **Risk:** low

#### 用途
获取首页短剧推荐数据。

#### 何时使用 / 不使用
- ✅ 用户明确要"短剧"推荐
- ❌ 想看普通推荐 → 用 `fetch_home_feed`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| page | integer | no | default=1 | 页码，每次翻页加 1 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 短剧推荐数据 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_search — 搜索接口

**Full path:** `/api/v1/pipixia/app/fetch_search`
**Method:** GET · **Risk:** low

#### 用途
按关键词搜索皮皮虾内容，支持多种搜索类型（综合/热门/新鲜/视频/图文/用户/话题）。**多用途入口**——可通过 search_type 切换搜索维度。

#### 何时使用 / 不使用
- ✅ 用户提供关键词想搜索内容或用户
- ✅ 链式起点：搜索用户（search_type=4）→ user.md；搜索话题（search_type=5）→ fetch_hashtag_detail
- ❌ 想看热搜 → 用 `fetch_hot_search_words`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| offset | string | no | default="0" | 分页游标 |
| search_type | string | no | enum=`["1","2","3","4","5","8","9"]`，default="1" | 搜索类型 |

**search_type 可用值：**
| 值 | 含义 |
|----|------|
| 1 | 综合 |
| 8 | 热门 |
| 9 | 新鲜 |
| 2 | 视频 |
| 3 | 图文 |
| 4 | 用户 |
| 5 | 话题 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data[].cell_id | `$.data.data[].cell_id`（search_type=1/2/3/8/9） | 作品 ID | 本文件多端点 |
| data[].user_id | `$.data.data[].user_id`（search_type=4） | 用户 ID | user.md |
| data[].hashtag_id | `$.data.data[].hashtag_id`（search_type=5） | 话题 ID | fetch_hashtag_detail / fetch_hashtag_post_list |
| offset | `$.data.offset` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空结果 | 关键词未命中 | STOP，告知用户未找到 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_hot_search_words — 获取热搜词条

**Full path:** `/api/v1/pipixia/app/fetch_hot_search_words`
**Method:** GET · **Risk:** low

#### 用途
获取皮皮虾热搜词条列表。无参数。

#### 输入 (IN)
无参数。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 热搜词条数据，可作为 fetch_search 的 keyword 输入 | fetch_search |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_hot_search_board_list — 获取热搜榜单列表

**Full path:** `/api/v1/pipixia/app/fetch_hot_search_board_list`
**Method:** GET · **Risk:** low

#### 用途
获取热搜榜单列表，产出 block_type 供 fetch_hot_search_board_detail 使用。无参数。

#### 输入 (IN)
无参数。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data[].block_type | `$.data.data[].block_type` | 榜单类型 | fetch_hot_search_board_detail |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_hot_search_board_detail — 获取热搜榜单详情

**Full path:** `/api/v1/pipixia/app/fetch_hot_search_board_detail`
**Method:** GET · **Risk:** low

#### 用途
用 block_type 获取指定热搜榜单的详情数据。block_type 从 fetch_hot_search_board_list 获取。

#### 何时使用 / 不使用
- ✅ 已通过 fetch_hot_search_board_list 取得 block_type
- ❌ 不知 block_type → 先调用 fetch_hot_search_board_list

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| block_type | integer | yes | — | 榜单类型（从 fetch_hot_search_board_list 获取） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 榜单详情数据 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | block_type 不存在 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_hashtag_detail — 获取话题详情

**Full path:** `/api/v1/pipixia/app/fetch_hashtag_detail`
**Method:** GET · **Risk:** low

#### 用途
获取指定话题的详情信息。

#### 何时使用 / 不使用
- ✅ 已知 hashtag_id，想看话题信息
- ❌ 想看话题下的作品 → 用 `fetch_hashtag_post_list`
- ❌ 不知 hashtag_id → 先用 fetch_search（search_type=5）搜索话题

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| hashtag_id | string | yes | 纯数字字符串 | 话题 ID，形如 `129559` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| hashtag_id | `$.data.hashtag_id` | 话题 ID（回显） | fetch_hashtag_post_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 话题不存在 | STOP | 0 | **降级**：fetch_search（search_type=5）取候选 |

---

### fetch_hashtag_post_list — 获取话题作品列表

**Full path:** `/api/v1/pipixia/app/fetch_hashtag_post_list`
**Method:** GET · **Risk:** low

#### 用途
获取指定话题下的作品列表（含分页 cursor）。

#### 何时使用 / 不使用
- ✅ 已知 hashtag_id，想看话题下的作品
- ❌ 想看话题本身信息 → 用 `fetch_hashtag_detail`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| hashtag_id | string | yes | 纯数字字符串 | 话题 ID |
| cursor | string | no | default="0" | 分页游标，下一页从 `$.data.loadmore_cursor` 取 |
| feed_count | string | no | default="0" | 翻页数量，每次翻页加 1 |
| hashtag_request_type | string | no | enum=`["0","1","2"]`，default="0" | 话题请求类型 |
| hashtag_sort_type | string | no | enum=`["1","2","3"]`，default="3" | 话题排序类型 |

**hashtag_request_type 可用值：** 0=热门，1=最新，2=精华
**hashtag_sort_type 可用值：** 3=按热度，2=按时间（新→旧），1=精华

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data[].cell_id | `$.data.data[].cell_id` | 话题作品 ID | 本文件多端点 |
| loadmore_cursor | `$.data.loadmore_cursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 话题不存在 | STOP | 0 | 无替代 |
| 空数据 | 该话题暂无作品 | 返回"暂无作品" | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_short_url — 生成短连接

**Full path:** `/api/v1/pipixia/app/fetch_short_url`
**Method:** GET · **Risk:** low

#### 用途
将皮皮虾原始链接转换为短连接。

#### 何时使用 / 不使用
- ✅ 用户明确需要短连接
- ❌ 只是想看内容 → 不需要短连接

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| original_url | string | yes | startsWith=`https://h5.pipix.com/` | 原始链接 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 短连接结果 | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400/422 | URL 格式错 | 告知用户检查 URL | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |
