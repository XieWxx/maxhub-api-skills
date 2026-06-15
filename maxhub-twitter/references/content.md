# Twitter/X Content / Twitter/X 推文内容

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
推文详情、评论（热门/最新）、搜索、趋势、转推用户列表 —— 围绕"推文内容"的全部读取入口。**tweet_id 多在本文件首步产出**，是评论/转推等链式调用的常见起点。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| fetch_tweet_detail | 首选 | 用 tweet_id 取推文完整详情（**链式起点**） | GET | /api/v1/twitter/web/fetch_tweet_detail | low |
| fetch_post_comments | 首选 | 用 tweet_id 取推文热门评论 | GET | /api/v1/twitter/web/fetch_post_comments | low |
| fetch_latest_post_comments | 条件 | 用 tweet_id 取推文最新评论（用户明确要"最新评论"时用） | GET | /api/v1/twitter/web/fetch_latest_post_comments | low |
| fetch_retweet_user_list | 条件 | 用 tweet_id 取转推用户列表（用户明确要"谁转推了"时用） | GET | /api/v1/twitter/web/fetch_retweet_user_list | low |
| fetch_search_timeline | 首选 | 用关键字搜索推文/用户/媒体（**内容冷启动入口**） | GET | /api/v1/twitter/web/fetch_search_timeline | low |
| fetch_trending | 条件 | 按国家取热门趋势（用户问"热搜/趋势"时用） | GET | /api/v1/twitter/web/fetch_trending | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看推文 + 评论 | fetch_tweet_detail → fetch_post_comments | `$.data.tweet_id` → `tweet_id` | 第 1 步失败：STOP；第 2 步失败：返回推文详情 + "评论暂不可取" |
| 看推文 + 最新评论 | fetch_tweet_detail → fetch_latest_post_comments | `$.data.tweet_id` → `tweet_id` | 同上 |
| 看推文 + 转推用户 | fetch_tweet_detail → fetch_retweet_user_list | `$.data.tweet_id` → `tweet_id` | 第 2 步空数据：返回推文详情 + "暂无转推" |
| 搜索 → 看详情 | fetch_search_timeline → fetch_tweet_detail | `$.data.tweets[].tweet_id` → `tweet_id` | 第 1 步空：STOP，告知未搜到 |
| 搜索 → 看作者 | fetch_search_timeline → 跳转 `user.md` 的 fetch_user_profile | `$.data.tweets[].author.screen_name` → `screen_name` | 跨文件链路 |
| 趋势 → 搜索 | fetch_trending → fetch_search_timeline | 趋势关键字 → `keyword` | 第 2 步失败：返回趋势列表 + "搜索暂不可用" |
| 看推文 + 作者主页 | fetch_tweet_detail → 跳转 `user.md` 的 fetch_user_profile | `$.data.author.screen_name` → `screen_name` | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`user.md` 的 `fetch_user_post_tweet` 输出 `$.data.tweets[].tweet_id` → 本文件多个端点的 `tweet_id`
- **流入本文件**：`user.md` 的 `fetch_user_highlights_tweets` 输出 `$.data.tweets[].tweet_id` → 本文件多个端点的 `tweet_id`
- **流出本文件**：`$.data.author.screen_name` / `$.data.author.rest_id` → `user.md` 全部 user 系端点
- **流出本文件**：`fetch_search_timeline`（search_type=People）输出 `$.data.users[].screen_name` → `user.md`

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项；通用规则见此处。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-防路径臆造)）
  - 路径是否在 `endpoints_whitelist.yaml` 中？
  - Method、参数键名是否符合白名单？
  - 资源 ID（tweet_id/screen_name）是否来自合法响应字段？
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**，向用户报告
- **禁止**：改路径段（v1→v2 试探）、切换平台前缀、拼接新路径、自行修改资源 ID 重试
- **替换**：参考 `param-mappings.md` 的"端点替换矩阵"

### 参数错误（400 / 422）防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-防参数与传参方式臆造)）
  - 参数名是否逐字符匹配 IN 表？无大小写/缩写/复数错？
  - 必填项是否齐全？
  - 类型 / enum 是否严格匹配？
  - 传参方式（query vs body）是否正确？Authorization 头是否正确？
  - **是否有 IN 表外的臆造参数**？
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP
- **禁止**：切换端点、在 IN 表外凭空加参数

### 鉴权错误（401）
- **行动**：**STOP**，提示用户检查或更换 API Key（https://www.aconfig.cn/console）

### 余额 / 付费（402）
- **行动**：**STOP**，告知用户充值（https://www.aconfig.cn/billing）

### 权限错误（403）
- **行动**：**STOP**，按子场景告知用户去控制台处理

### 限流（429）
- **行动**：读 `Retry-After` 头退避；无该头时按 `delay = min(8s, 2^attempt) * (0.5 + random*0.5)`；最多重试 2 次

### 上游故障（500/502/503/504）
- **行动**：等 3 秒重试 1 次 → 仍失败走端点级"降级/替换"列 → 无替换则 STOP

### 网络超时
- **行动**：**STOP**，向用户报告网络异常

### 业务错误（HTTP 200 且 `code != 0`）
- **行动**：读 `message_zh`/`message` 报告用户；不要把 `data` 当作有效数据；不要重试

---

## 端点详情

### fetch_tweet_detail — 获取推文详情

**Full path:** `/api/v1/twitter/web/fetch_tweet_detail`
**Method:** GET · **Risk:** low

#### 用途
获取 Twitter/X 单个推文的完整详情，包含作者、内容、统计（点赞/评论/转发数）等字段。**链式调用的常见起点**——大多数 tweet_id 与作者信息从此处产出。

#### 何时使用 / 不使用
- 用户提供 tweet_id 或推文链接
- 链式起点：取 tweet_id 或作者 screen_name
- 想看评论 → 直接用 `fetch_post_comments`（不要先调本端点再绕一圈）
- 想看作者其他推文 → 用 `user.md` 的 `fetch_user_post_tweet`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| tweet_id | string | yes | 纯数字字符串 | 推文ID，可从推文链接中获取，如 `https://x.com/elonmusk/status/1808168603721650364` 中的 `1808168603721650364` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| tweet_id | `$.data.tweet_id` | 推文 ID（回显） | fetch_post_comments / fetch_latest_post_comments / fetch_retweet_user_list |
| author.screen_name | `$.data.author.screen_name` | 作者用户名 | user.md 全部 user 系端点 |
| author.rest_id | `$.data.author.rest_id` | 作者用户数字 ID | user.md 的 fetch_user_profile / fetch_user_post_tweet |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 推文不存在/已删除 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 仍失败 → 用 `fetch_search_timeline` 搜关键字取降级数据 |

---

### fetch_post_comments — 获取推文热门评论

**Full path:** `/api/v1/twitter/web/fetch_post_comments`
**Method:** GET · **Risk:** low

#### 用途
获取指定推文下的热门评论列表（含分页 cursor）。

#### 何时使用 / 不使用
- 用户已知或已通过 fetch_tweet_detail 取得 tweet_id
- 用户想看"热门评论"
- 用户想看"最新评论" → 用 `fetch_latest_post_comments`
- 不知 tweet_id → 先调用 fetch_tweet_detail 或从推文链接提取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| tweet_id | string | yes | 纯数字字符串 | 推文 ID |
| cursor | string | no | — | 分页游标，首次请求留空 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| comments[].screen_name | `$.data.comments[].screen_name` | 评论者用户名 | user.md user 系端点 |
| cursor | `$.data.cursor` | 下一页游标 | 同端点的下一次调用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | tweet_id 不存在 | STOP | 0 | 无（评论无替代来源） |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_latest_post_comments — 获取推文最新评论

**Full path:** `/api/v1/twitter/web/fetch_latest_post_comments`
**Method:** GET · **Risk:** low

#### 用途
获取指定推文下的最新评论列表（含分页 cursor）。与 `fetch_post_comments` 的区别在于排序方式：本端点按时间倒序，`fetch_post_comments` 按热度排序。

#### 何时使用 / 不使用
- 用户明确要"最新评论"或"最近的评论"
- 用户要"热门评论" → 用 `fetch_post_comments`
- 不知 tweet_id → 先调用 fetch_tweet_detail 或从推文链接提取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| tweet_id | string | yes | 纯数字字符串 | 推文 ID |
| cursor | string | no | — | 分页游标，首次请求留空 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| comments[].screen_name | `$.data.comments[].screen_name` | 评论者用户名 | user.md user 系端点 |
| cursor | `$.data.cursor` | 下一页游标 | 同端点的下一次调用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | tweet_id 不存在 | STOP | 0 | 降级到 `fetch_post_comments`（排序不同） |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 `fetch_post_comments` |

---

### fetch_retweet_user_list — 获取转推用户列表

**Full path:** `/api/v1/twitter/web/fetch_retweet_user_list`
**Method:** GET · **Risk:** low

#### 用途
获取转推了指定推文的用户列表（含分页 cursor）。

#### 何时使用 / 不使用
- 用户明确问"谁转推了这条推文"
- 想看推文本身详情 → fetch_tweet_detail
- 想看评论 → fetch_post_comments

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| tweet_id | string | yes | 纯数字字符串 | 推文 ID，可从推文链接中获取 |
| cursor | string | no | — | 分页游标，首次请求留空 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| users[].screen_name | `$.data.users[].screen_name` | 转推者用户名 | user.md user 系端点 |
| users[].rest_id | `$.data.users[].rest_id` | 转推者用户数字 ID | user.md |
| cursor | `$.data.cursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | tweet_id 不存在 | STOP | 0 | 无 |
| 空数据 | 暂无转推 | 返回"暂无转推"语义信息，不当作错误 | 0 | — |

---

### fetch_search_timeline — 搜索推文/用户/媒体

**Full path:** `/api/v1/twitter/web/fetch_search_timeline`
**Method:** GET · **Risk:** low

#### 用途
用关键字搜索 Twitter/X 上的推文、用户、媒体、列表。**内容冷启动入口**——用户没有具体 tweet_id 时，可从此端点采集 tweet_id 进入其他链路。

#### 何时使用 / 不使用
- 用户给出搜索关键字
- 链式起点：搜索 → 取 tweet_id / screen_name
- 已知 tweet_id → 直接 fetch_tweet_detail
- 想看趋势 → fetch_trending

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键字，如 `"Elon Musk"` |
| search_type | string | no | enum=`Top, Latest, Media, People, Lists` | 搜索类型，默认 Top |
| cursor | string | no | — | 分页游标，首次请求留空 |

> **search_type 说明**：
> - `Top`（默认）：热门结果
> - `Latest`：最新结果
> - `Media`：含媒体的结果
> - `People`：搜索用户（产出 screen_name → user.md）
> - `Lists`：搜索列表

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| tweets[].tweet_id | `$.data.tweets[].tweet_id` | 搜索到的推文 ID | fetch_tweet_detail / fetch_post_comments 等 |
| tweets[].author.screen_name | `$.data.tweets[].author.screen_name` | 推文作者用户名 | user.md |
| users[].screen_name | `$.data.users[].screen_name`（search_type=People） | 搜索到的用户名 | user.md |
| users[].rest_id | `$.data.users[].rest_id`（search_type=People） | 搜索到的用户数字 ID | user.md |
| cursor | `$.data.cursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空结果 | 关键字未命中 | STOP，告知用户未搜到 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代（搜索是顶层入口） |

---

### fetch_trending — 获取热门趋势

**Full path:** `/api/v1/twitter/web/fetch_trending`
**Method:** GET · **Risk:** low

#### 用途
获取指定国家/地区的 Twitter/X 热门趋势列表。**趋势冷启动入口**——用户问"热搜/趋势"时使用。

#### 何时使用 / 不使用
- 用户问"Twitter 热搜/趋势/热门话题"
- 链式起点：趋势关键字 → fetch_search_timeline 搜索详情
- 想搜具体内容 → 直接 fetch_search_timeline

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| country | string | no | enum=见下方国家列表 | 国家，默认 UnitedStates |

> **country 可选值**：UnitedStates、China、Japan、India、Russia、Germany、Indonesia、Brazil、France、UnitedKingdom、Turkey、Italy、Mexico、SouthKorea、Canada、Spain、SaudiArabia、Egypt、Australia、Poland、Iran、Pakistan、Vietnam、Nigeria、Bangladesh、Netherlands、Argentina、Philippines、Malaysia、Colombia、UniteArabEmirates、Romania、Belgium、Switzerland、Singapore、Sweden、Norway、Austria、Kazakhstan、Algeria、Chile、Czechia、Peru、Iraq、Israel、Ukraine、Denmark、Portugal、Hungary、Greece、Finland、NewZealand、Belarus、Slovakia、Serbia、Lithuania、Luxembourg、Estonia

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| trending[].name | `$.data.trending[].name` | 趋势话题名称 | 作为 fetch_search_timeline 的 keyword |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |
