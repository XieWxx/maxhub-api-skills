# Douyin Search / 抖音搜索

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖

综合搜索（V1/V2）、视频搜索（V1/V2）、用户搜索（V1/V2）、图片搜索/V3、直播搜索、话题搜索（V1/V2）、搜索建议、多重搜索、经验搜索、音乐搜索、讨论搜索、学校搜索、图像识别搜索。**所有端点均为 POST 方法（risk:high）**，keyword 为核心入参，aweme_id / sec_uid / challenge_id 为主要产出字段。

> 🔒 **安全**：所有请求将 `MAXHUB_API_KEY` 和查询数据传输至 `https://www.aconfig.cn`。禁止在日志、提示词或客户端存储中暴露 API Key。**本文件全部端点为 POST + risk:high**，调用前必须获得用户确认。

---

## 端点索引 (Endpoint Index)

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| search_fetch_general_search_v1 | ⭐⭐⭐ 首选 | 综合搜索（视频+用户+话题，**链式起点**） | POST | /api/v1/douyin/search/fetch_general_search_v1 | **high** |
| search_fetch_general_search_v2 | ⭐ 降级 | 综合搜索 V2（备用，稳定性不如 V1） | POST | /api/v1/douyin/search/fetch_general_search_v2 | **high** |
| search_fetch_video_search_v1 | ⭐⭐⭐ 首选 | 视频搜索 V1（专注视频结果） | POST | /api/v1/douyin/search/fetch_video_search_v1 | **high** |
| search_fetch_video_search_v2 | ⭐⭐ 条件 | 视频搜索 V2（字段更详细） | POST | /api/v1/douyin/search/fetch_video_search_v2 | **high** |
| search_fetch_user_search | ⭐⭐⭐ 首选 | 用户搜索（支持粉丝数/类型筛选） | POST | /api/v1/douyin/search/fetch_user_search | **high** |
| search_fetch_user_search_v2 | ⭐ 降级 | 用户搜索 V2（不支持筛选） | POST | /api/v1/douyin/search/fetch_user_search_v2 | **high** |
| search_fetch_image_search | ⭐⭐ 条件 | 图片搜索（图片合集帖子） | POST | /api/v1/douyin/search/fetch_image_search | **high** |
| search_fetch_image_search_v3 | ⭐⭐ 条件 | 图文搜索 V3（aweme_type=68） | POST | /api/v1/douyin/search/fetch_image_search_v3 | **high** |
| search_fetch_live_search_v1 | ⭐⭐ 条件 | 直播搜索 | POST | /api/v1/douyin/search/fetch_live_search_v1 | **high** |
| search_fetch_challenge_search_v1 | ⭐⭐ 条件 | 话题搜索 V1 | POST | /api/v1/douyin/search/fetch_challenge_search_v1 | **high** |
| search_fetch_challenge_search_v2 | ⭐ 降级 | 话题搜索 V2 | POST | /api/v1/douyin/search/fetch_challenge_search_v2 | **high** |
| search_fetch_challenge_suggest | ⭐⭐ 条件 | 话题推荐搜索 | POST | /api/v1/douyin/search/fetch_challenge_suggest | **high** |
| search_fetch_search_suggest | ⭐⭐ 条件 | 搜索关键词推荐（输入补全） | POST | /api/v1/douyin/search/fetch_search_suggest | **high** |
| search_fetch_multi_search | ⭐⭐ 条件 | 多类型搜索（视频+用户+音乐+话题） | POST | /api/v1/douyin/search/fetch_multi_search | **high** |
| search_fetch_experience_search | ⭐⭐ 条件 | 经验搜索（知识/教程） | POST | /api/v1/douyin/search/fetch_experience_search | **high** |
| search_fetch_music_search | ⭐⭐ 条件 | 音乐搜索 | POST | /api/v1/douyin/search/fetch_music_search | **high** |
| search_fetch_discuss_search | ⭐⭐ 条件 | 讨论搜索（问答内容） | POST | /api/v1/douyin/search/fetch_discuss_search | **high** |
| search_fetch_school_search | ⭐ 条件 | 学校搜索 | POST | /api/v1/douyin/search/fetch_school_search | **high** |
| search_fetch_vision_search | ⭐⭐ 条件 | 图像识别搜索（以图搜图） | POST | /api/v1/douyin/search/fetch_vision_search | **high** |

---

## 链式调用图谱 (Chain Recipes)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 搜索视频 → 看详情 | search_fetch_video_search_v1 → video.md | `$.data.data[].aweme_id` → `aweme_id` | 第 1 步失败：STOP；跨文件链路 |
| 搜索用户 → 看主页 | search_fetch_user_search → user.md | `$.data.user_list[].sec_uid` → `sec_user_id` | 跨文件链路 |
| 搜索话题 → 看视频 | search_fetch_challenge_search_v1 → video.md | `$.data.challenge_list[].cid` → `ch_id` | 跨文件链路 |
| 搜索直播 → 看直播详情 | search_fetch_live_search_v1 → live.md | `$.data.data[].room_id` → `room_id` | 跨文件链路 |
| 搜索音乐 → 看音乐视频 | search_fetch_music_search → video.md | `$.data.music[].music_id` → `music_id` | 跨文件链路 |
| 综合搜索 → 看视频 + 看用户 | search_fetch_general_search_v1 → video.md + user.md | `aweme_id` + `sec_uid` 双路流出 | 按需组合 |
| 以图搜图 → 看视频 | search_fetch_vision_search → video.md | `$.data.data[].aweme_id` → `aweme_id` | 跨文件链路 |

---

## 跨 reference 链路 (In-Chain)

- **流出本文件**：`$.data.data[].aweme_id` → `video.md` 全部视频端点的 `aweme_id`
- **流出本文件**：`$.data.user_list[].sec_uid` → `user.md` 全部 user 系端点的 `sec_user_id`
- **流出本文件**：`$.data.challenge_list[].cid` → `video.md` 的 `app_v3_fetch_hashtag_detail` 的 `ch_id`
- **流出本文件**：`$.data.data[].room_id` → `live.md` 的 `web_fetch_user_live_videos_by_room_id_v2` 的 `room_id`
- **流出本文件**：`$.data.music[].music_id` → `video.md` 的 `app_v3_fetch_music_detail` 的 `music_id`

---

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项；通用规则见此处。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
  - 路径是否在 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 中？
  - Method 是否为 POST？本文件全部端点均为 POST
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**
- **禁止**：❌ 改路径段 ❌ 切换平台前缀 ❌ 拼接新路径

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
  - 本文件全部端点参数通过 **body** 传递（非 query）
  - `keyword` 为必填参数
  - 筛选参数（sort_type/publish_time/filter_duration/content_type）为字符串类型
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP

### 搜索翻页特化规则
- 综合搜索/视频搜索：首次请求 `cursor=0`、`search_id=""`、`backtrace=""`；翻页时从上次响应取 `cursor`、`search_id`、`backtrace`
- 用户搜索：首次 `cursor=0`、`search_id=""`；翻页从上次响应取值
- 多重搜索：首次 `cursor=0`、`search_id=""`；翻页从上次响应取值
- 图像识别搜索：首次 `cursor=0`、`search_id=""`；翻页从上次响应取值

### POST 端点风险提示
- **本文件全部端点为 POST + risk:high**，调用前必须获得用户确认
- 确认内容：告知用户将执行搜索操作及搜索关键词

---

## 端点详情

---

### search_fetch_general_search_v1 — 综合搜索 V1

**Full path:** `/api/v1/douyin/search/fetch_general_search_v1`
**Method:** POST · **Risk:** **high**

#### 用途
综合搜索，返回视频、用户、话题标签、播放信息、音乐、互动数据等。**搜索链式调用的首选起点**。

#### 何时使用 / 不使用
- ✅ 用户想搜索抖音内容（无特定类型偏好）
- ✅ 链式起点：取 aweme_id / sec_uid / challenge_id
- ❌ 只想搜视频 → 用 `search_fetch_video_search_v1`（结果更聚焦）
- ❌ 只想搜用户 → 用 `search_fetch_user_search`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| cursor | integer | no | default: 0 | 翻页游标 |
| sort_type | string | no | enum: "0"=综合, "1"=最多点赞, "2"=最新发布 | 排序方式 |
| publish_time | string | no | enum: "0"=不限, "1"=最近一天, "7"=最近一周, "180"=最近半年 | 发布时间筛选 |
| filter_duration | string | no | enum: "0"=不限, "0-1"=1分钟内, "1-5"=1-5分钟, "5-10000"=5分钟以上 | 视频时长筛选 |
| content_type | string | no | enum: "0"=不限, "1"=视频, "2"=图片, "3"=文章 | 内容类型筛选 |
| search_id | string | no | default: "" | 搜索 ID（首次传空，翻页从上次响应获取） |
| backtrace | string | no | default: "" | 翻页回溯标识（首次传空，翻页从上次响应获取） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data[].aweme_id | `$.data.data[].aweme_id` | 视频 ID | video.md 全部视频端点 |
| data[].author.sec_uid | `$.data.data[].author.sec_uid` | 作者 sec_uid | user.md |
| cursor | `$.data.cursor` | 下一页游标 | 同端点翻页 |
| search_id | `$.data.search_id` | 搜索 ID | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | keyword 缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 `search_fetch_general_search_v2` |

---

### search_fetch_general_search_v2 — 综合搜索 V2

**Full path:** `/api/v1/douyin/search/fetch_general_search_v2`
**Method:** POST · **Risk:** **high**

#### 用途
综合搜索 V2 版本，参数与 V1 相同。稳定性可能不如 V1，作为备用接口。

#### 何时使用 / 不使用
- ✅ V1 返回 5xx 时降级使用
- ❌ 首选应使用 `search_fetch_general_search_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| cursor | integer | no | default: 0 | 翻页游标 |
| sort_type | string | no | enum: "0"=综合, "1"=最多点赞, "2"=最新发布 | 排序方式 |
| publish_time | string | no | enum: "0"=不限, "1"=最近一天, "7"=最近一周, "180"=最近半年 | 发布时间 |
| filter_duration | string | no | enum: "0"=不限, "0-1"=1分钟内, "1-5"=1-5分钟, "5-10000"=5分钟以上 | 时长筛选 |
| content_type | string | no | enum: "0"=不限, "1"=视频, "2"=图片, "3"=文章 | 内容类型 |
| search_id | string | no | default: "" | 搜索 ID |
| backtrace | string | no | default: "" | 翻页回溯标识 |

#### 输出可链式字段 (OUT)
同 `search_fetch_general_search_v1`

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代（V2 已是降级端点） |

---

### search_fetch_video_search_v1 — 视频搜索 V1

**Full path:** `/api/v1/douyin/search/fetch_video_search_v1`
**Method:** POST · **Risk:** **high**

#### 用途
专注视频内容的搜索，返回视频列表、作者信息、音乐信息、统计信息、推荐搜索词。

#### 何时使用 / 不使用
- ✅ 用户明确想搜视频
- ✅ 链式起点：取 aweme_id
- ❌ 想搜用户 → 用 `search_fetch_user_search`
- ❌ 想搜综合 → 用 `search_fetch_general_search_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| cursor | integer | no | default: 0 | 翻页游标 |
| sort_type | string | no | enum: "0"=综合, "1"=最多点赞, "2"=最新发布 | 排序方式 |
| publish_time | string | no | enum: "0"=不限, "1"=最近一天, "7"=最近一周, "180"=最近半年 | 发布时间 |
| filter_duration | string | no | enum: "0"=不限, "0-1"=1分钟内, "1-5"=1-5分钟, "5-10000"=5分钟以上 | 时长筛选 |
| content_type | string | no | enum: "0"=不限, "1"=视频, "2"=图片, "3"=文章 | 内容类型 |
| search_id | string | no | default: "" | 搜索 ID |
| backtrace | string | no | default: "" | 翻页回溯标识 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data[].aweme_id | `$.data.data[].aweme_id` | 视频 ID | video.md |
| data[].author.sec_uid | `$.data.data[].author.sec_uid` | 作者 sec_uid | user.md |
| guide_search_words | `$.data.guide_search_words[]` | 推荐搜索词 | 引导用户继续搜索 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 `search_fetch_video_search_v2` |

---

### search_fetch_video_search_v2 — 视频搜索 V2

**Full path:** `/api/v1/douyin/search/fetch_video_search_v2`
**Method:** POST · **Risk:** **high**

#### 用途
视频搜索 V2，返回字段更详细（含多清晰度播放源、标签列表等）。

#### 何时使用 / 不使用
- ✅ V1 返回 5xx 时降级
- ✅ 需要更详细的视频字段（多清晰度、标签）
- ❌ 首选应使用 `search_fetch_video_search_v1`

#### 输入 (IN)
同 `search_fetch_video_search_v1`

#### 输出可链式字段 (OUT)
同 `search_fetch_video_search_v1`，额外含 `business_data[].data` 详细字段

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### search_fetch_user_search — 用户搜索

**Full path:** `/api/v1/douyin/search/fetch_user_search`
**Method:** POST · **Risk:** **high**

#### 用途
根据关键词搜索用户，支持粉丝数量和用户类型筛选。

#### 何时使用 / 不使用
- ✅ 用户明确想搜人
- ✅ 链式起点：取 sec_uid
- ❌ 想搜视频 → 用 `search_fetch_video_search_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| cursor | integer | no | default: 0 | 翻页游标 |
| douyin_user_fans | string | no | enum: ""=不限, "0_1k"=1千以下, "1k_1w"=1千到1万, "1w_10w"=1万到10万, "10w_100w"=10万到100万, "100w_"=100万以上 | 粉丝数量筛选 |
| douyin_user_type | string | no | enum: ""=不限, "common_user"=普通用户, "enterprise_user"=企业认证, "personal_user"=个人认证 | 用户类型筛选 |
| search_id | string | no | default: "" | 搜索 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user_list[].sec_uid | `$.data.user_list[].sec_uid` | 用户 sec_uid | user.md |
| user_list[].uid | `$.data.user_list[].uid` | 用户 uid | user.md / live.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 `search_fetch_user_search_v2`（无筛选） |

---

### search_fetch_user_search_v2 — 用户搜索 V2

**Full path:** `/api/v1/douyin/search/fetch_user_search_v2`
**Method:** POST · **Risk:** **high**

#### 用途
用户搜索 V2，不支持粉丝数/类型筛选。作为 V1 的简化降级。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| cursor | integer | no | default: 0 | 翻页游标 |

#### 输出可链式字段 (OUT)
同 `search_fetch_user_search`

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### search_fetch_image_search — 图片搜索

**Full path:** `/api/v1/douyin/search/fetch_image_search`
**Method:** POST · **Risk:** **high**

#### 用途
搜索图片内容（图片合集帖子），content_type 固定传 "2"。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| cursor | integer | no | default: 0 | 翻页游标 |
| sort_type | string | no | enum: "0"=综合, "1"=最多点赞, "2"=最新发布 | 排序方式 |
| publish_time | string | no | — | 发布时间筛选 |
| filter_duration | string | no | 固定 "0" | 时长筛选 |
| content_type | string | no | 固定 "2" | 内容类型（图片） |
| search_id | string | no | default: "" | 搜索 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data[].aweme_info.aweme_id | `$.data.data[].aweme_info.aweme_id` | 图文作品 ID | video.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 `search_fetch_image_search_v3` |

---

### search_fetch_image_search_v3 — 图文搜索 V3

**Full path:** `/api/v1/douyin/search/fetch_image_search_v3`
**Method:** POST · **Risk:** **high**

#### 用途
图文搜索 V3，返回 aweme_type=68 的图文内容。与 `search_fetch_image_search` 使用不同数据源。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| cursor | integer | no | default: 0 | 翻页游标 |
| search_id | string | no | default: "" | 搜索 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| business_data[].data.aweme_list[].aweme_id | `$.data.business_data[].data.aweme_list[].aweme_id` | 图文作品 ID | video.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### search_fetch_live_search_v1 — 直播搜索

**Full path:** `/api/v1/douyin/search/fetch_live_search_v1`
**Method:** POST · **Risk:** **high**

#### 用途
搜索正在直播的房间，返回主播资料、观众人数、拉流地址等。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| cursor | integer | no | default: 0 | 翻页游标 |
| sort_type | string | no | — | 排序方式 |
| publish_time | string | no | — | 发布时间筛选 |
| filter_duration | string | no | — | 时长过滤 |
| content_type | string | no | 固定 "1" | 内容类型（直播） |
| search_id | string | no | default: "" | 搜索 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data[].room_id | `$.data.data[].room_id` | 直播间 ID | live.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### search_fetch_challenge_search_v1 — 话题搜索 V1

**Full path:** `/api/v1/douyin/search/fetch_challenge_search_v1`
**Method:** POST · **Risk:** **high**

#### 用途
搜索话题（挑战/标签），返回话题 ID、名称、浏览量、参与人数等。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| cursor | integer | no | default: 0 | 翻页游标 |
| sort_type | string | no | enum: "0"=综合, "1"=最多点赞, "2"=最新发布 | 排序方式 |
| publish_time | string | no | — | 发布时间筛选 |
| filter_duration | string | no | — | 时长筛选 |
| content_type | string | no | — | 内容类型筛选 |
| search_id | string | no | default: "" | 搜索 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| challenge_list[].cid | `$.data.challenge_list[].cid` | 话题 ID | video.md `app_v3_fetch_hashtag_detail` |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 `search_fetch_challenge_search_v2` |

---

### search_fetch_challenge_search_v2 — 话题搜索 V2

**Full path:** `/api/v1/douyin/search/fetch_challenge_search_v2`
**Method:** POST · **Risk:** **high**

#### 用途
话题搜索 V2 版本。参数与 V1 相同。

#### 输入 (IN)
同 `search_fetch_challenge_search_v1`

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| business_data[].data.challenge_info | `$.data.business_data[].data.challenge_info` | 话题信息 | video.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### search_fetch_challenge_suggest — 话题推荐搜索

**Full path:** `/api/v1/douyin/search/fetch_challenge_suggest`
**Method:** POST · **Risk:** **high**

#### 用途
根据关键词返回话题建议列表（输入补全）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| sug_list[] | `$.data.sug_list[]` | 推荐话题列表 | 引导用户选择话题后调用 `search_fetch_challenge_search_v1` |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### search_fetch_search_suggest — 搜索关键词推荐

**Full path:** `/api/v1/douyin/search/fetch_search_suggest`
**Method:** POST · **Risk:** **high**

#### 用途
获取搜索关键词联想推荐（输入补全），用于提升搜索体验。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 输入的关键词 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| sug_list[] | `$.data.sug_list[]` | 推荐关键词列表 | 引导用户选择后调用对应搜索端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### search_fetch_multi_search — 多类型搜索

**Full path:** `/api/v1/douyin/search/fetch_multi_search`
**Method:** POST · **Risk:** **high**

#### 用途
一次搜索返回多种类型结果：视频(type=1)、用户(type=2)、音乐(type=4)、话题(type=6)。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| cursor | integer | no | default: 0 | 翻页游标 |
| sort_type | string | no | enum: "0"=综合, "1"=最多点赞, "2"=最新发布 | 排序方式 |
| publish_time | string | no | — | 发布时间筛选 |
| filter_duration | string | no | — | 时长筛选 |
| content_type | string | no | — | 内容类型筛选 |
| search_id | string | no | default: "" | 搜索 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| business_data[] | `$.data.business_data[]` | 多类型结果（按 type 区分） | 按类型路由到对应文件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### search_fetch_experience_search — 经验搜索

**Full path:** `/api/v1/douyin/search/fetch_experience_search`
**Method:** POST · **Risk:** **high**

#### 用途
搜索经验/知识/教程类视频内容。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| cursor | integer | no | default: 0 | 翻页游标 |
| sort_type | integer | no | enum: 0=综合, 1=最多点赞, 2=最新发布 | 排序方式（注意：此处为 integer 类型） |
| publish_time | integer | no | — | 发布时间筛选 |
| filter_duration | integer | no | — | 时长筛选 |
| content_type | integer | no | 通常固定为 1（视频） | 内容类型 |
| search_id | string | no | default: "" | 搜索 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| business_data.aweme_list[] | `$.data.business_data.aweme_list[]` | 经验视频列表 | video.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### search_fetch_music_search — 音乐搜索

**Full path:** `/api/v1/douyin/search/fetch_music_search`
**Method:** POST · **Risk:** **high**

#### 用途
搜索音乐内容，返回标题、作者、专辑、播放地址、时长、标签等。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| cursor | integer | no | default: 0 | 翻页游标 |
| sort_type | string | no | — | 排序方式 |
| publish_time | string | no | — | 发布时间筛选 |
| filter_duration | string | no | — | 时长筛选 |
| content_type | string | no | — | 内容类型筛选 |
| search_id | string | no | default: "" | 搜索 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| music[] | `$.data.music[]` | 音乐列表 | video.md `app_v3_fetch_music_detail` |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### search_fetch_discuss_search — 讨论搜索

**Full path:** `/api/v1/douyin/search/fetch_discuss_search`
**Method:** POST · **Risk:** **high**

#### 用途
搜索讨论/问答类视频内容。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| cursor | integer | no | default: 0 | 翻页游标 |
| sort_type | string | no | enum: "0"=综合, "1"=最多点赞, "2"=最新发布 | 排序方式 |
| publish_time | string | no | — | 发布时间筛选 |
| filter_duration | string | no | — | 时长筛选 |
| content_type | string | no | — | 内容类型筛选 |
| search_id | string | no | default: "" | 搜索 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data[] | `$.data.data[]` | 讨论视频列表 | video.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### search_fetch_school_search — 学校搜索

**Full path:** `/api/v1/douyin/search/fetch_school_search`
**Method:** POST · **Risk:** **high**

#### 用途
搜索学校信息，返回学校名称列表。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| schools[] | `$.data.schools[]` | 学校名称列表 | 终端数据，无下游 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### search_fetch_vision_search — 图像识别搜索

**Full path:** `/api/v1/douyin/search/fetch_vision_search`
**Method:** POST · **Risk:** **high**

#### 用途
以图搜图/视觉搜索，通过图片 URI 搜索相似的视频/图文内容。`image_uri` 可从抖音其他接口的返回数据中获取。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| image_uri | string | yes | — | 图片 URI（从其他接口返回获取） |
| cursor | integer | no | default: 0 | 翻页游标 |
| search_id | string | no | default: "" | 搜索 ID |
| search_source | string | no | enum: "graphic_detail"=图片详情页搜索, "visual_normal_search"=带关键词追加搜索 | 搜索来源 |
| detection | string | no | 格式 "x1,y1,x2,y2" | 检测区域坐标 |
| detection_index | integer | no | default: 0 | 检测索引 |
| user_query | string | no | 仅 search_source="visual_normal_search" 时使用 | 搜索关键词 |
| aweme_id | string | no | 仅 search_source="visual_normal_search" 时使用 | 原视频 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data[].aweme_id | `$.data.data[].aweme_id` | 相似视频 ID | video.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | image_uri 缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |
