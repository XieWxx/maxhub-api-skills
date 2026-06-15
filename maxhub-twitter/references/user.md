# Twitter/X User / Twitter/X 用户

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
用户资料、用户推文、用户回复、用户媒体、关注、粉丝、高光推文 —— 围绕"用户"的全部读取入口。**screen_name / rest_id 多在本文件首步产出**（fetch_user_profile 是已知用户名时的链式入口）。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| fetch_user_profile | 首选 | 用 screen_name/rest_id 取用户完整资料（**链式起点**） | GET | /api/v1/twitter/web/fetch_user_profile | low |
| fetch_user_post_tweet | 首选 | 用 screen_name/rest_id 取用户推文列表 | GET | /api/v1/twitter/web/fetch_user_post_tweet | low |
| fetch_user_tweet_replies | 条件 | 用 screen_name 取用户回复（用户明确要"回复"时用） | GET | /api/v1/twitter/web/fetch_user_tweet_replies | low |
| fetch_user_media | 条件 | 用 screen_name 取用户媒体（用户明确要"图片/视频"时用） | GET | /api/v1/twitter/web/fetch_user_media | low |
| fetch_user_followings | 条件 | 用 screen_name 取关注列表（用户明确要"关注的人"时用） | GET | /api/v1/twitter/web/fetch_user_followings | low |
| fetch_user_followers | 条件 | 用 screen_name 取粉丝列表（用户明确要"粉丝"时用） | GET | /api/v1/twitter/web/fetch_user_followers | low |
| fetch_user_highlights_tweets | 条件 | 用 userId 取用户高光推文（用户明确要"高光/精选"时用） | GET | /api/v1/twitter/web/fetch_user_highlights_tweets | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看用户资料 + 推文 | fetch_user_profile → fetch_user_post_tweet | `$.data.screen_name` → `screen_name` | 第 1 步失败：可改用搜索取候选；第 2 步失败：返回资料 + "推文列表暂不可取" |
| 看用户资料 + 媒体 | fetch_user_profile → fetch_user_media | `$.data.screen_name` → `screen_name` | 第 2 步空数据：返回资料 + "暂无媒体" |
| 看用户资料 + 回复 | fetch_user_profile → fetch_user_tweet_replies | `$.data.screen_name` → `screen_name` | 第 2 步空数据：返回资料 + "暂无回复" |
| 看用户社交圈 | fetch_user_profile → fetch_user_followers + fetch_user_followings（可并行） | `$.data.screen_name` → `screen_name` | 任一失败：返回另一份 + 告知缺失 |
| 看用户高光推文 | fetch_user_profile → fetch_user_highlights_tweets | `$.data.rest_id` → `userId` | 第 2 步空：返回资料 + "无高光推文" |
| 用户推文 → 推文详情 | fetch_user_post_tweet → 跳到 `content.md` 的 fetch_tweet_detail | `$.data.tweets[].tweet_id` → `tweet_id` | 跨文件链路 |
| 搜索用户 → 用户主页 | fetch_search_timeline（search_type=People）→ fetch_user_profile | `$.data.users[].screen_name` → `screen_name` | 第 1 步空：STOP，告知用户名未命中 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`content.md` 的 `fetch_tweet_detail` 输出 `$.data.author.screen_name` / `$.data.author.rest_id` → 本文件全部 user 系端点
- **流入本文件**：`content.md` 的 `fetch_search_timeline`（search_type=People）输出 `$.data.users[].screen_name` → 本文件
- **流入本文件**：`content.md` 的 `fetch_retweet_user_list` 输出 `$.data.users[].screen_name` → 本文件
- **流出本文件**：`fetch_user_post_tweet` 的 `$.data.tweets[].tweet_id` → `content.md` 多端点
- **流出本文件**：`fetch_user_highlights_tweets` 的 `$.data.tweets[].tweet_id` → `content.md` 多端点

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-防路径臆造)）
- **第 2 步：自检通过后**才能 STOP 并报告"资源不存在"
- **禁止**：改路径段、切换平台前缀、拼接新路径、自行修改 screen_name/rest_id 重试
- **替换**：参考 `param-mappings.md` 的"端点替换矩阵"

### 参数错误（400 / 422）防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-防参数与传参方式臆造)）
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP
- **禁止**：切换端点、凭空加参数

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

**Full path:** `/api/v1/twitter/web/fetch_user_profile`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的完整资料（用户名、头像、个人简介、统计数据等）。**user 系链式调用的常见验证步和起点**。

#### 何时使用 / 不使用
- 已知 screen_name 或 rest_id，想看用户主页信息
- 链式中验证用户是否存在
- 想看用户推文 → fetch_user_post_tweet（不要先调本端点再调 posts）
- 只有推文链接中的 tweet_id → 先用 `content.md` 的 fetch_tweet_detail 取 author.screen_name

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| screen_name | string | oneOf(screen_name, rest_id) | — | 用户名，如 `elonmusk`，可从用户主页链接获取 |
| rest_id | integer | oneOf(screen_name, rest_id) | — | 用户数字 ID，如 `44196397`；传 rest_id 时 screen_name 会被忽略 |

> **二选一逻辑**：screen_name 与 rest_id 至少传一个。同时传时 rest_id 优先，screen_name 被忽略。建议优先使用 screen_name（更直观），如需精确匹配则用 rest_id。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| screen_name | `$.data.screen_name` | 用户名（回显） | 复用于本文件全部 screen_name 系端点 |
| rest_id | `$.data.rest_id` | 用户数字 ID | fetch_user_highlights_tweets 的 userId 参数 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在/已注销 | STOP | 0 | 降级：用 `fetch_search_timeline`（search_type=People）取候选（如有 screen_name 上下文） |

---

### fetch_user_post_tweet — 获取用户推文

**Full path:** `/api/v1/twitter/web/fetch_user_post_tweet`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的推文列表（含分页 cursor）。是 `content.md` 的常见上游产出 tweet_id 的端点。

#### 何时使用 / 不使用
- 已知 screen_name 或 rest_id，想看其推文
- 链式产出 tweet_id 给 `content.md`
- 想看用户资料本身 → fetch_user_profile
- 想看用户高光推文 → fetch_user_highlights_tweets

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| screen_name | string | oneOf(screen_name, rest_id) | — | 用户名 |
| rest_id | integer | oneOf(screen_name, rest_id) | — | 用户数字 ID；传 rest_id 时 screen_name 被忽略 |
| cursor | string | no | — | 分页游标，首次请求留空，后续从上一次响应的 JSON 中获取 |

> **二选一逻辑**：screen_name 与 rest_id 至少传一个。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| tweets[].tweet_id | `$.data.tweets[].tweet_id` | 推文 ID | content.md 多端点 |
| cursor | `$.data.cursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |
| 空数据 | 该用户暂无推文 | 返回"暂无推文" | 0 | — |

---

### fetch_user_tweet_replies — 获取用户回复

**Full path:** `/api/v1/twitter/web/fetch_user_tweet_replies`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的推文回复列表（含分页 cursor）。

#### 何时使用 / 不使用
- 已知 screen_name，想看 ta 回复了哪些推文
- 想看 ta 自己发布的推文 → fetch_user_post_tweet
- 注意：本端点仅接受 screen_name，不接受 rest_id

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| screen_name | string | yes | — | 用户名，如 `elonmusk` |
| cursor | string | no | — | 分页游标，首次请求留空 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| replies[].tweet_id | `$.data.replies[].tweet_id` | 回复的推文 ID | content.md |
| cursor | `$.data.cursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |
| 空数据 | 该用户暂无回复 | 返回"暂无回复" | 0 | — |

---

### fetch_user_media — 获取用户媒体

**Full path:** `/api/v1/twitter/web/fetch_user_media`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户发布的媒体内容（图片、视频等）列表（含分页 cursor）。

#### 何时使用 / 不使用
- 用户明确要"这个人的图片/视频"
- 想看用户全部推文（含文字） → fetch_user_post_tweet
- 想看用户资料 → fetch_user_profile

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| screen_name | string | yes | — | 用户名，如 `elonmusk` |
| rest_id | integer | no | — | 用户数字 ID；传 rest_id 时 screen_name 被忽略 |
| cursor | string | no | — | 分页游标，首次请求留空，后续从上一次响应的 `next_cursor` 获取 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| media[].tweet_id | `$.data.media[].tweet_id` | 关联推文 ID | content.md |
| cursor | `$.data.next_cursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |
| 空数据 | 该用户暂无媒体 | 返回"暂无媒体" | 0 | — |

---

### fetch_user_followings — 获取关注列表

**Full path:** `/api/v1/twitter/web/fetch_user_followings`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户关注的人列表（含分页 cursor）。

#### 何时使用 / 不使用
- 已知 screen_name，想看 ta 关注了谁
- 想看 ta 的粉丝 → fetch_user_followers
- 注意：部分用户的关注列表可能被隐私设置隐藏（业务 code≠0）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| screen_name | string | yes | — | 用户名，如 `elonmusk` |
| cursor | string | no | — | 分页游标，首次请求留空 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| users[].screen_name | `$.data.users[].screen_name` | 被关注用户名 | 本文件 user 系端点 |
| users[].rest_id | `$.data.users[].rest_id` | 被关注用户数字 ID | 本文件 |
| cursor | `$.data.cursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 业务 code≠0 | 隐私设置不可见 | 告知用户该列表不可查看 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_user_followers — 获取粉丝列表

**Full path:** `/api/v1/twitter/web/fetch_user_followers`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的粉丝列表（含分页 cursor）。

#### 何时使用 / 不使用
- 已知 screen_name，想看 ta 的粉丝
- 想看 ta 关注了谁 → fetch_user_followings

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| screen_name | string | yes | — | 用户名，如 `elonmusk` |
| cursor | string | no | — | 分页游标，首次请求留空 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| users[].screen_name | `$.data.users[].screen_name` | 粉丝用户名 | 本文件 user 系端点 |
| users[].rest_id | `$.data.users[].rest_id` | 粉丝用户数字 ID | 本文件 |
| cursor | `$.data.cursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 业务 code≠0 | 隐私设置不可见 | 告知用户该列表不可查看 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_user_highlights_tweets — 获取用户高光推文

**Full path:** `/api/v1/twitter/web/fetch_user_highlights_tweets`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的高光推文（精选推文）列表（含分页 cursor）。

#### 何时使用 / 不使用
- 用户明确要"高光推文"或"精选推文"
- 想看用户全部推文 → fetch_user_post_tweet
- 注意：本端点使用 `userId`（即 rest_id，string 类型），不是 screen_name

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| userId | string | yes | — | 用户 ID（即 rest_id 的字符串形式），如 `"44196397"` |
| count | integer | no | 默认 20 | 返回数量 |
| cursor | string | no | — | 分页游标，首次请求留空；翻页 cursor 的 JSONPath 为 `$.data.data.user.result.timeline_v2.timeline.instructions.[1].entries.[-1].content.value` |

> **userId 获取方式**：先调用 `fetch_user_profile` 取 `$.data.rest_id`，转为字符串后传入。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| tweets[].tweet_id | `$.data.tweets[].tweet_id` | 高光推文 ID | content.md 多端点 |
| cursor | `$.data.cursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |
| 空数据 | 该用户暂无高光推文 | 返回"无高光推文" | 0 | 降级到 `fetch_user_post_tweet`（非精选） |
