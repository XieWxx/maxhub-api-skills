# YouTube Channel / YouTube 频道

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
频道信息、频道视频、Shorts、社区帖子、频道 ID 查询 —— 围绕"频道"的全部读取入口。含 Web 和 Web V2 双端。**channel_id 多在本文件首步产出**（从 URL/名称解析），是视频列表、帖子等链式调用的常见起点。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| web_get_channel_id | ⭐⭐ 条件 | 用频道名称获取频道 ID | GET | /api/v1/youtube/web/get_channel_id | low |
| web_get_channel_id_v2 | ⭐⭐⭐ 首选 | 用频道 URL 获取频道 ID（支持多种 URL 格式） | GET | /api/v1/youtube/web/get_channel_id_v2 | low |
| web_get_channel_url | ⭐⭐ 条件 | 用频道 ID 获取频道 URL（反向操作） | GET | /api/v1/youtube/web/get_channel_url | low |
| web_get_channel_info | ⭐⭐ 降级 | 获取频道信息（Web V1） | GET | /api/v1/youtube/web/get_channel_info | low |
| web_get_channel_videos_v2 | ⭐⭐ 条件 | 获取频道视频列表（支持排序/类型筛选） | GET | /api/v1/youtube/web/get_channel_videos_v2 | low |
| web_get_channel_short_videos | ⭐⭐ 降级 | 获取频道短视频（Web V1） | GET | /api/v1/youtube/web/get_channel_short_videos | low |
| web_v2_get_channel_description | ⭐⭐⭐ 首选 | 获取频道描述信息（**链式起点**，需两次请求取完整数据） | GET | /api/v1/youtube/web_v2/get_channel_description | low |
| web_v2_get_channel_id | ⭐⭐⭐ 首选 | 用频道 URL 获取频道 ID（Web V2） | GET | /api/v1/youtube/web_v2/get_channel_id | low |
| web_v2_get_channel_url | ⭐⭐ 条件 | 用频道 ID 获取频道 URL（Web V2） | GET | /api/v1/youtube/web_v2/get_channel_url | low |
| web_v2_get_channel_videos | ⭐⭐⭐ 首选 | 获取频道视频列表（Web V2，结构化数据） | GET | /api/v1/youtube/web_v2/get_channel_videos | low |
| web_v2_get_channel_shorts | ⭐⭐⭐ 首选 | 获取频道短视频列表（Web V2） | GET | /api/v1/youtube/web_v2/get_channel_shorts | low |
| web_v2_get_channel_community_posts | ⭐⭐⭐ 首选 | 获取频道社区帖子列表 | GET | /api/v1/youtube/web_v2/get_channel_community_posts | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| URL → 频道信息 | web_v2_get_channel_id → web_v2_get_channel_description | `$.data.channel_id` → `channel_id` | 第 1 步失败：STOP；第 2 步失败：降级到 web_get_channel_info |
| 频道信息（完整） | web_v2_get_channel_description（第 1 次）→ web_v2_get_channel_description（第 2 次，用 continuation_token） | `$.data.continuation_token` → `continuation_token` | 第 2 步失败：返回基本信息 + "高级信息暂不可取" |
| 频道信息 + 视频 | web_v2_get_channel_description → web_v2_get_channel_videos | `$.data.channel_id` → `channel_id` | 第 2 步失败：降级到 web_get_channel_videos_v2 |
| 频道信息 + Shorts | web_v2_get_channel_description → web_v2_get_channel_shorts | `$.data.channel_id` → `channel_id` | 第 2 步失败：降级到 web_get_channel_short_videos |
| 频道信息 + 帖子 | web_v2_get_channel_description → web_v2_get_channel_community_posts | `$.data.channel_id` → `channel_id` | 第 2 步空数据：返回频道信息 + "该频道暂无社区帖子" |
| 频道视频 → 视频详情 | web_v2_get_channel_videos → 跳到 `video.md` web_v2_get_video_info_v2 | `$.data.videos[].video_id` → `video_id` | 跨文件链路 |
| 频道帖子 → 帖子详情 | web_v2_get_channel_community_posts → 跳到 `comments.md` web_v2_get_post_detail | `$.data.posts[].post_id` → `post_id` | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`video.md` 的 web_v2_get_video_info_v2 输出 `$.data.channel_id` → 本文件全部 channel 系端点
- **流入本文件**：`search.md` 的搜索端点输出 `channel_id` → 本文件多个端点
- **流出本文件**：`web_v2_get_channel_videos` 的 `$.data.videos[].video_id` → `video.md` 多端点
- **流出本文件**：`web_v2_get_channel_community_posts` 的 `$.data.posts[].post_id` → `comments.md` 帖子端点

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项；通用规则见此处。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**，向用户报告
- **禁止**：改路径段（web→web_v2 试探）切换平台前缀 拼接新路径 自行修改资源 ID 重试
- **替换**：参考 `param-mappings.md` 的"端点替换矩阵"

### 参数错误（400 / 422）防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
  - **特别注意**：Web 端用 `lang`，Web V2 端用 `language_code`；Web 端用 `nextToken`，Web V2 端用 `continuation_token`
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP
- **禁止**：切换端点 在 IN 表外凭空加参数

### 鉴权错误（401）/ 余额（402）/ 权限（403）/ 限流（429）/ 上游故障（5xx）/ 网络超时 / 业务错误
- 与 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview) 通用规则一致

---

## 端点详情

### web_get_channel_id — 获取频道 ID（按名称）

**Full path:** `/api/v1/youtube/web/get_channel_id`
**Method:** GET · **Risk:** low

#### 用途
通过频道名称获取频道 ID。仅支持名称查询。

#### 何时使用 / 不使用
- ✅ 用户给出频道名称（如 LinusTechTips）
- ❌ 用户给的是 URL → 用 `web_get_channel_id_v2` 或 `web_v2_get_channel_id`
- ❌ 已知 channel_id → 直接用其他端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| channel_name | string | yes | — | 频道名称，如 `LinusTechTips` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| channel_id | `$.data.channel_id` | 频道 ID | 本文件多端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 频道名称未找到 | STOP | 0 | — |

---

### web_get_channel_id_v2 — 获取频道 ID（按 URL）

**Full path:** `/api/v1/youtube/web/get_channel_id_v2`
**Method:** GET · **Risk:** low

#### 用途
从频道 URL 获取频道 ID。支持多种 URL 格式：@username、/channel/、/c/、/user/。

#### 何时使用 / 不使用
- ✅ 用户提供 YouTube 频道 URL
- ✅ 链式起点：URL → channel_id
- ❌ 只有频道名称 → 用 `web_get_channel_id`
- ❌ 已知 channel_id → 直接用其他端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| channel_url | string | yes | startsWith=`https://www.youtube.com/` | 频道 URL，支持 @username, /channel/, /c/, /user/ 格式 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| channel_id | `$.data.channel_id` | 频道 ID，如 `UCeu6U67OzJhV1KwBansH3Dg` | 本文件多端点 |
| channel_url | `$.data.channel_url` | 标准化 URL | 仅展示 |
| source | `$.data.source` | 解析来源：url_parse / page_parse | 仅调试 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | URL 格式不支持 | 检查 URL 格式 | ≤1 次 | — |
| 404 | 频道不存在 | STOP | 0 | — |

---

### web_get_channel_url — 获取频道 URL（按 ID）

**Full path:** `/api/v1/youtube/web/get_channel_url`
**Method:** GET · **Risk:** low

#### 用途
从频道 ID 获取频道 URL。与 get_channel_id_v2 互为反向操作。

#### 何时使用 / 不使用
- ✅ 有频道 ID 但需要获取 @用户名 格式的 URL
- ❌ 有 URL 需要 ID → 用 `web_get_channel_id_v2`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| channel_id | string | yes | pattern=`^UC[a-zA-Z0-9_-]{22}$` | 频道 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| channel_id | `$.data.channel_id` | 频道 ID（回显） | 复用 |
| handle | `$.data.handle` | @用户名 | 仅展示 |
| vanity_url | `$.data.vanity_url` | /@用户名 格式 URL | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 频道不存在 | STOP | 0 | — |

---

### web_get_channel_info — 获取频道信息 (Web)

**Full path:** `/api/v1/youtube/web/get_channel_info`
**Method:** GET · **Risk:** low

#### 用途
获取频道信息。Web V1 端点，字段较少。

#### 何时使用 / 不使用
- ✅ Web V2 端点不可用时的降级方案
- ❌ 优先使用 `web_v2_get_channel_description`（字段更全）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| channel_id | string | yes | pattern=`^UC[a-zA-Z0-9_-]{22}$` | 频道 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| channel_id | `$.data.channel_id` | 频道 ID | 复用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 频道不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 web_v2_get_channel_description |

---

### web_get_channel_videos_v2 — 获取频道视频 V2 (Web)

**Full path:** `/api/v1/youtube/web/get_channel_videos_v2`
**Method:** GET · **Risk:** low

#### 用途
获取频道视频列表，支持排序和内容类型筛选。channel_id 支持频道 ID 或 @频道名称。

#### 何时使用 / 不使用
- ✅ 需要按排序/类型筛选频道视频
- ✅ Web V2 频道视频端点不可用时的降级方案
- ❌ 优先使用 `web_v2_get_channel_videos`（结构化数据）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| channel_id | string | yes | — | 频道 ID 或 @频道名称，如 `UCXuqSBlHAE6Xw-yeJA0Tunw` 或 `@LinusTechTips` |
| lang | string | no | — | 视频结果语言代码，默认 en-US |
| sortBy | string | no | enum=`newest,oldest,mostPopular` | 排序方式（默认 newest） |
| contentType | string | no | enum=`videos,shorts,live` | 内容类型（默认 videos） |
| nextToken | string | no | — | 翻页令牌 |

> **注意**：Web 端翻页参数名为 `nextToken`，Web V2 端为 `continuation_token`，禁止混用。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 视频列表中 video_id | — | 视频 ID | video.md 多端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 频道不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 web_v2_get_channel_videos |

---

### web_get_channel_short_videos — 获取频道短视频 (Web)

**Full path:** `/api/v1/youtube/web/get_channel_short_videos`
**Method:** GET · **Risk:** low

#### 用途
获取频道短视频。Web V1 端点。

#### 何时使用 / 不使用
- ✅ Web V2 Shorts 端点不可用时的降级方案
- ❌ 优先使用 `web_v2_get_channel_shorts`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| channel_id | string | yes | pattern=`^UC[a-zA-Z0-9_-]{22}$` | 频道 ID |
| continuation_token | string | no | — | 翻页令牌 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 短视频列表中 video_id | — | 视频 ID | video.md 多端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 频道不存在 | STOP | 0 | — |

---

### web_v2_get_channel_description — 获取频道描述信息 (Web V2)

**Full path:** `/api/v1/youtube/web_v2/get_channel_description`
**Method:** GET · **Risk:** low

#### 用途
获取频道完整描述信息。**必须进行两次请求才能获取完整数据**。第一次获取基本信息 + continuation_token，第二次获取高级信息（注册时间、社媒链接等）。**链式调用的常见起点**。

#### 何时使用 / 不使用
- ✅ 需要频道完整信息（注册时间、社媒链接等）
- ✅ 链式起点：取 channel_id
- ❌ 只需要基础信息 → 第一次请求即可
- ❌ 只需要视频列表 → 直接用 `web_v2_get_channel_videos`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| channel_id | string | oneOf(channel_id, continuation_token) | pattern=`^UC[a-zA-Z0-9_-]{22}$` | 频道 ID |
| continuation_token | string | oneOf(channel_id, continuation_token) | — | 翻页标志（用于获取高级信息） |
| language_code | string | no | — | 语言代码（默认 zh-CN） |
| country_code | string | no | — | 国家代码（默认 US） |
| need_format | boolean | no | — | 是否清洗数据（默认 true） |

> **二选一逻辑**：channel_id 与 continuation_token 必须提供其中一个。首次请求传 channel_id，第二次传第一次返回的 continuation_token。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| channel_id | `$.data.channel_id` | 频道 ID | 本文件多端点 |
| continuation_token | `$.data.continuation_token` | 第二次请求令牌 | 同端点第二次请求 |
| title | `$.data.title` | 频道名称 | 仅展示 |
| subscriber_count | `$.data.subscriber_count` | 订阅数 | 仅展示 |
| creation_date | `$.data.creation_date`（第 2 次请求） | 注册时间 | 仅展示 |
| links | `$.data.links`（第 2 次请求） | 社媒链接 | 仅展示 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | channel_id 和 continuation_token 都未传 | 修正后重试 | ≤1 次 | — |
| 404 | 频道不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 web_get_channel_info（字段较少） |

---

### web_v2_get_channel_id — 获取频道 ID (Web V2)

**Full path:** `/api/v1/youtube/web_v2/get_channel_id`
**Method:** GET · **Risk:** low

#### 用途
从频道 URL 获取频道 ID（Web V2 版本）。与 web_get_channel_id_v2 功能相同。

#### 何时使用 / 不使用
- ✅ 用户提供 YouTube 频道 URL
- ❌ 只有频道名称 → 用 `web_get_channel_id`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| channel_url | string | yes | startsWith=`https://www.youtube.com/` | 频道 URL |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| channel_id | `$.data.channel_id` | 频道 ID | 本文件多端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 频道不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 web_get_channel_id_v2 |

---

### web_v2_get_channel_url — 获取频道 URL (Web V2)

**Full path:** `/api/v1/youtube/web_v2/get_channel_url`
**Method:** GET · **Risk:** low

#### 用途
从频道 ID 获取频道 URL（Web V2 版本）。与 web_get_channel_url 功能相同。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| channel_id | string | yes | pattern=`^UC[a-zA-Z0-9_-]{22}$` | 频道 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| channel_id | `$.data.channel_id` | 频道 ID（回显） | 复用 |
| vanity_url | `$.data.vanity_url` | /@用户名 格式 URL | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 频道不存在 | STOP | 0 | — |

---

### web_v2_get_channel_videos — 获取频道视频 (Web V2)

**Full path:** `/api/v1/youtube/web_v2/get_channel_videos`
**Method:** GET · **Risk:** low

#### 用途
获取 YouTube 频道的视频列表，支持分页。返回清洗后的结构化数据。**频道视频的首选端点**。

#### 何时使用 / 不使用
- ✅ 已知 channel_id，想看频道视频
- ✅ 链式产出 video_id 给 `video.md`
- ❌ 想看频道信息 → `web_v2_get_channel_description`
- ❌ 想看 Shorts → `web_v2_get_channel_shorts`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| channel_id | string | yes | pattern=`^UC[a-zA-Z0-9_-]{22}$` | 频道 ID |
| language_code | string | no | — | 语言代码（默认 zh-CN） |
| country_code | string | no | — | 国家代码（默认 US） |
| continuation_token | string | no | — | 分页 token |
| need_format | boolean | no | — | 是否清洗数据（默认 true） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| channel | `$.data.channel` | 频道元数据（仅首页返回） | 仅展示 |
| videos[].video_id | `$.data.videos[].video_id` | 视频 ID | video.md 多端点 |
| continuation_token | `$.data.continuation_token` | 下一页 token | 同端点翻页 |

> **注意**：分页响应里不包含 channel 字段，请缓存首页结果。分页响应里 videos[].is_verified 恒为 false（不可信）。

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 频道不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 web_get_channel_videos_v2 |

---

### web_v2_get_channel_shorts — 获取频道短视频列表 (Web V2)

**Full path:** `/api/v1/youtube/web_v2/get_channel_shorts`
**Method:** GET · **Risk:** low

#### 用途
获取 YouTube 频道的短视频(Shorts)列表，支持分页。**频道 Shorts 的首选端点**。

#### 何时使用 / 不使用
- ✅ 已知 channel_id 或 channel_url，想看频道 Shorts
- ❌ 想看普通视频 → `web_v2_get_channel_videos`
- ❌ 暂不支持 @username 格式 → 请使用频道 ID（UCxxxx 格式）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| channel_id | string | oneOf(channel_id, channel_url) | pattern=`^UC[a-zA-Z0-9_-]{22}$` | 频道 ID |
| channel_url | string | oneOf(channel_id, channel_url) | startsWith=`https://www.youtube.com/channel/` | 频道 URL（如果提供 channel_id 则忽略） |
| continuation_token | string | no | — | 分页 token |
| need_format | boolean | no | — | 是否格式化数据（默认 true） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| shorts[].video_id | `$.data.shorts[].video_id` | Shorts 视频 ID | video.md 多端点 |
| continuation_token | `$.data.continuation_token` | 下一页 token | 同端点翻页 |
| has_more | `$.data.has_more` | 是否还有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 频道不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 web_get_channel_short_videos |

---

### web_v2_get_channel_community_posts — 获取频道帖子列表

**Full path:** `/api/v1/youtube/web_v2/get_channel_community_posts`
**Method:** GET · **Risk:** low

#### 用途
获取 YouTube 频道的社区帖子列表，支持分页。帖子附件支持图片/多图/视频/投票等类型。

#### 何时使用 / 不使用
- ✅ 已知 channel_id，想看频道社区帖子
- ✅ 链式产出 post_id 给 `comments.md`
- ❌ 想看视频 → `web_v2_get_channel_videos`
- ❌ 部分频道可能没有帖子/社区标签页

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| channel_id | string | yes | pattern=`^UC[a-zA-Z0-9_-]{22}$` | 频道 ID |
| language_code | string | no | — | 语言代码（默认 zh-CN） |
| country_code | string | no | — | 国家代码（默认 US） |
| continuation_token | string | no | — | 分页 token |
| need_format | boolean | no | — | 是否清洗数据（默认 true） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| posts[].post_id | `$.data.posts[].post_id` | 帖子 ID | comments.md 帖子端点 |
| continuation_token | `$.data.continuation_token` | 下一页 token | 同端点翻页 |
| has_more | `$.data.has_more` | 是否还有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 频道不存在 | STOP | 0 | — |
| 空数据 | 该频道暂无社区帖子 | 返回"暂无社区帖子" | 0 | — |
