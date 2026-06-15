# Lemon8 Content / Lemon8 内容

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
帖子详情、评论、发现页（Banner/主体/Editor's Picks）、热搜关键词、话题信息与帖子列表、搜索、帖子 ID 提取（单个/批量）。**item_id 多通过 `get_item_id` / `get_item_ids` 从分享链接提取**，是链式调用的入口。

## 端点索引 (Endpoint Index)

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| fetch_post_detail | ⭐⭐⭐ 首选 | 用 item_id 取帖子详情（**链式终点**） | GET | /api/v1/lemon8/app/fetch_post_detail | low |
| fetch_post_comment_list | ⭐⭐ 条件 | 用 group_id+item_id+media_id 取评论（需先取详情） | GET | /api/v1/lemon8/app/fetch_post_comment_list | low |
| fetch_search | ⭐⭐⭐ 首选 | 搜索（**内容冷启动入口**） | GET | /api/v1/lemon8/app/fetch_search | low |
| fetch_discover_tab | ⭐⭐ 条件 | 取发现页主体内容（内容冷启动） | GET | /api/v1/lemon8/app/fetch_discover_tab | low |
| fetch_discover_tab_information_tabs | ⭐⭐ 条件 | 取发现页 Editor's Picks | GET | /api/v1/lemon8/app/fetch_discover_tab_information_tabs | low |
| fetch_discover_banners | ⭐ 辅助 | 取发现页 Banner | GET | /api/v1/lemon8/app/fetch_discover_banners | low |
| fetch_hot_search_keywords | ⭐ 辅助 | 取热搜关键词 | GET | /api/v1/lemon8/app/fetch_hot_search_keywords | low |
| fetch_topic_info | ⭐⭐ 条件 | 用 forum_id 取话题信息 | GET | /api/v1/lemon8/app/fetch_topic_info | low |
| fetch_topic_post_list | ⭐⭐ 条件 | 用话题参数取帖子列表（需先取话题信息） | GET | /api/v1/lemon8/app/fetch_topic_post_list | low |
| get_item_id | ⭐⭐⭐ 首选 | 用分享链接取 item_id（**链式入口**） | GET | /api/v1/lemon8/app/get_item_id | low |
| get_item_ids | ⭐⭐ 条件 | 用分享链接批量取 item_id（最多 10 个） | POST | /api/v1/lemon8/app/get_item_ids | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 分享链接→帖子详情 | get_item_id → fetch_post_detail | `$.data.item_id` → `item_id` | 第 1 步失败：STOP |
| 分享链接→帖子详情+评论 | get_item_id → fetch_post_detail → fetch_post_comment_list | item_id → group_id+item_id+media_id | 第 2 步失败：返回详情 + "评论暂不可取" |
| 搜索→帖子详情 | fetch_search → fetch_post_detail | `$.data.posts[].item_id` → `item_id` | 第 1 步空：STOP |
| 发现页→帖子详情 | fetch_discover_tab → fetch_post_detail | `$.data.posts[].item_id` → `item_id` | 第 1 步空：STOP |
| 话题→帖子列表 | fetch_topic_info → fetch_topic_post_list | category+category_parameter+hashtag_name 接力 | 第 1 步失败：STOP |
| 帖子→评论 | fetch_post_detail → fetch_post_comment_list | group_id+item_id+media_id 接力 | 第 1 步失败：STOP |
| 帖子→作者 | fetch_post_detail → user.md 的 fetch_user_profile | `$.data.author_id` → `user_id` | 跨文件链路 |
| 搜索话题→话题帖子 | fetch_search（search_tab=hashtag）→ fetch_topic_info → fetch_topic_post_list | forum_id → category+category_parameter+hashtag_name | 三步链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`user.md` 的 `fetch_user_follower_list` / `fetch_user_following_list` 产出用户信息（间接）
- **流出本文件**：`fetch_post_detail` 输出 `$.data.author_id` → `user.md` 的 `fetch_user_profile`
- **流出本文件**：`fetch_search`（search_tab=user）输出 `$.data.users[].user_id` → `user.md`
- **流出本文件**：`fetch_post_comment_list` 输出评论者 user_id → `user.md`

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- **第 2 步：自检通过后**才能 STOP 并报告"资源不存在"
- **禁止**：❌ 改路径段 ❌ 把 app 改成 web ❌ 拼接新路径

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
- **特别注意**：
  - `fetch_post_comment_list` 需要 3 个必填参数：`group_id` + `item_id` + `media_id`（均从 `fetch_post_detail` 获取）
  - `fetch_topic_post_list` 需要 3 个必填参数：`category` + `category_parameter` + `hashtag_name`（均从 `fetch_topic_info` 获取）
  - `fetch_search` 的 `search_tab` 可选值：`main`(Top) / `user`(Accounts) / `hashtag`(Hashtags) / `article`(Posts)
  - `fetch_search` 的 `filter_type` 可选值：空字符串(All) / `video` / `posts`
  - `fetch_search` 的 `order_by` 可选值：空字符串(Relevance) / `popular` / `recent`
  - POST 端点 `get_item_ids` 的 body 参数 `share_texts` 必须使用 JSON 序列化
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP

### 鉴权 / 余额 / 权限 / 限流 / 上游故障 / 网络超时 / 业务错误
- 通用处理见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)

---

## 端点详情

### fetch_post_detail — 获取帖子详情

**Full path:** `/api/v1/lemon8/app/fetch_post_detail`
**Method:** GET · **Risk:** low

#### 用途
用 item_id 获取 Lemon8 帖子详情。**链式终点**——大多数链式调用最终汇聚于此端点。同时产出评论所需的 `group_id` 和 `media_id`。

#### 何时使用 / 不使用
- ✅ 已有 item_id，需取帖子详情
- ✅ 链式中间步：为 `fetch_post_comment_list` 产出 group_id + media_id
- ❌ 只有分享链接 → 先用 get_item_id 提取 item_id

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| item_id | string | yes | 纯数字 | 帖子/作品 ID，如 `7361926875709129222` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| item_id | `$.data.item_id` | 帖子 ID（回显） | fetch_post_comment_list |
| group_id | `$.data.group_id` | 帖子 group_id | fetch_post_comment_list |
| media_id | `$.data.media_id` | 帖子 media_id | fetch_post_comment_list |
| author_id | `$.data.author_id` | 作者用户 ID | user.md 的 fetch_user_profile |
| forum_id | `$.data.forum_id` | 所属话题 ID | fetch_topic_info |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 帖子不存在/已删除 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级 fetch_search（字段较少） |

---

### fetch_post_comment_list — 获取帖子评论列表

**Full path:** `/api/v1/lemon8/app/fetch_post_comment_list`
**Method:** GET · **Risk:** low

#### 用途
获取指定帖子的评论列表。**必须先调用 `fetch_post_detail` 获取 3 个必填参数**。

#### 何时使用 / 不使用
- ✅ 已通过 fetch_post_detail 取得 group_id + item_id + media_id
- ❌ 不知 group_id / media_id → 先调 fetch_post_detail

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| group_id | string | yes | 纯数字 | 帖子的 group_id，从 fetch_post_detail 获取 |
| item_id | string | yes | 纯数字 | 帖子的 item_id，从 fetch_post_detail 或 get_item_id 获取 |
| media_id | string | yes | 纯数字 | 帖子的 media_id，从 fetch_post_detail 获取 |
| offset | string | no | — | 分页偏移量，首次请求留空或传 `0` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| comments[].user_id | `$.data.comments[].user_id` | 评论者用户 ID | user.md 的 fetch_user_profile |
| offset | `$.data.offset` | 下一页偏移量 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 帖子不存在 | STOP | 0 | 无（评论无替代来源） |
| 空数据 | 该帖子暂无评论 | 返回"暂无评论" | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_search — 搜索接口

**Full path:** `/api/v1/lemon8/app/fetch_search`
**Method:** GET · **Risk:** low

#### 用途
Lemon8 综合搜索接口。**内容冷启动入口**——支持搜索帖子、用户、话题。通过 `search_tab` 参数切换搜索类型。

#### 何时使用 / 不使用
- ✅ 用户想搜索某个话题/帖子/用户
- ✅ 链式起点：搜索 → item_id / user_id / forum_id
- ❌ 想看发现页推荐 → fetch_discover_tab

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| query | string | yes | — | 搜索关键词，如 `lemon8` |
| max_cursor | string | no | — | 分页游标，首次请求留空 |
| filter_type | string | no | enum: ""(All), video, posts | 搜索过滤类型 |
| order_by | string | no | enum: ""(Relevance), popular, recent | 搜索排序方式 |
| search_tab | string | no | enum: main(Top), user(Accounts), hashtag(Hashtags), article(Posts) | 搜索类型，默认 `main` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| posts[].item_id | `$.data.posts[].item_id` | 帖子 ID（search_tab=main/article） | fetch_post_detail |
| users[].user_id | `$.data.users[].user_id` | 用户 ID（search_tab=user） | user.md 的 fetch_user_profile |
| hashtags[].forum_id | `$.data.hashtags[].forum_id` | 话题 ID（search_tab=hashtag） | fetch_topic_info |
| max_cursor | `$.data.max_cursor` | 下一页游标 | 同端点翻页 |
| has_more | `$.data.has_more` | 是否还有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空结果 | 关键词未命中 | STOP，告知用户 | 0 | 可建议换关键词 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级 fetch_discover_tab |

---

### fetch_topic_info — 获取话题信息

**Full path:** `/api/v1/lemon8/app/fetch_topic_info`
**Method:** GET · **Risk:** low

#### 用途
用 forum_id 获取话题信息。**链式中间步**——为 `fetch_topic_post_list` 产出 3 个必填参数。

#### 何时使用 / 不使用
- ✅ 已有 forum_id，需取话题详情
- ✅ 链式中间步：forum_id → category + category_parameter + hashtag_name
- ❌ 不知 forum_id → 先用 fetch_search（search_tab=hashtag）搜索

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| forum_id | string | yes | 纯数字 | 话题 ID，如 `7174447913778593798` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| category | `$.data.category` | 话题分类 ID | fetch_topic_post_list |
| category_parameter | `$.data.category_parameter` | 分类参数 | fetch_topic_post_list |
| hashtag_name | `$.data.hashtag_name` | Hashtag 名称 | fetch_topic_post_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 话题不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_topic_post_list — 获取话题帖子列表

**Full path:** `/api/v1/lemon8/app/fetch_topic_post_list`
**Method:** GET · **Risk:** low

#### 用途
获取指定话题下的帖子列表。**必须先调用 `fetch_topic_info` 获取 3 个必填参数**。

#### 何时使用 / 不使用
- ✅ 已通过 fetch_topic_info 取得 category + category_parameter + hashtag_name
- ❌ 不知话题参数 → 先调 fetch_topic_info

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| category | string | yes | — | 话题分类 ID，从 fetch_topic_info 获取，如 `590` |
| category_parameter | string | yes | — | 分类参数，从 fetch_topic_info 获取，如 `7174447913778593798` |
| hashtag_name | string | yes | — | Hashtag 名称，从 fetch_topic_info 获取，如 `lemon8christmas` |
| max_behot_time | string | no | — | 分页参数，首次请求留空 |
| sort_type | string | no | 默认 `0` | 排序方式，当前仅支持默认排序，**不要传其他值** |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| posts[].item_id | `$.data.posts[].item_id` | 帖子 ID | fetch_post_detail |
| max_behot_time | `$.data.max_behot_time` | 下一页时间戳 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空数据 | 该话题暂无帖子 | 返回"暂无帖子" | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级 fetch_search（search_tab=hashtag） |

---

### get_item_id — 通过分享链接获取帖子 ID

**Full path:** `/api/v1/lemon8/app/get_item_id`
**Method:** GET · **Risk:** low

#### 用途
通过 Lemon8 分享链接提取 item_id。**链式入口**——把分享链接转换为 item_id，供后续帖子系端点使用。

#### 何时使用 / 不使用
- ✅ 用户提供 Lemon8 帖子分享链接
- ✅ 链式起点：分享链接 → item_id
- ❌ 已有 item_id → 直接 fetch_post_detail
- ❌ 批量链接 → 用 get_item_ids

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| share_text | string | yes | — | 分享链接，如 `https://www.lemon8-app.com/@deathlabs_/7445613324903006766` 或 `https://v.lemon8-app.com/al/OghwFTppx` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| item_id | `$.data.item_id` | 帖子 ID | fetch_post_detail / fetch_post_comment_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 链接无效/已过期 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### get_item_ids — 通过分享链接批量获取帖子 ID

**Full path:** `/api/v1/lemon8/app/get_item_ids`
**Method:** POST · **Risk:** low

#### 用途
通过多个 Lemon8 分享链接批量提取 item_id（一次最多 10 个）。

#### 何时使用 / 不使用
- ✅ 用户同时提供多个帖子分享链接
- ❌ 只有一个链接 → 用 get_item_id（更简单）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| share_texts | array | yes | maxItems=10 | 分享链接列表，JSON 序列化 |

> **POST body 格式**：必须使用语言原生 JSON 序列化库，禁止手拼 JSON 字符串。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| item_ids | `$.data.item_ids[]` | 帖子 ID 列表 | fetch_post_detail × N |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | share_texts 格式错/超 10 个 | 修正后重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级 get_item_id 逐个调用 |

---

### 其他端点（简要）

以下端点无需参数或参数较少，用于发现页和热搜场景：

| 端点 ID | 路径 | 必填参数 | 可选参数 | 用途 |
|---------|------|---------|---------|------|
| fetch_discover_banners | /api/v1/lemon8/app/fetch_discover_banners | — | — | 取发现页 Banner（搜索页上方滚动内容） |
| fetch_discover_tab | /api/v1/lemon8/app/fetch_discover_tab | — | — | 取发现页主体内容（搜索页内容） |
| fetch_discover_tab_information_tabs | /api/v1/lemon8/app/fetch_discover_tab_information_tabs | — | — | 取发现页 Editor's Picks（搜索页下方推荐） |
| fetch_hot_search_keywords | /api/v1/lemon8/app/fetch_hot_search_keywords | — | — | 取热搜关键词列表 |
