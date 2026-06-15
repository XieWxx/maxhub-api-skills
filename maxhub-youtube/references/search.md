# YouTube Search & Discovery / YouTube 搜索与发现

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
综合搜索、Shorts 搜索、频道搜索、搜索建议、频道内搜索 —— 围绕"搜索与发现"的全部读取入口。含 Web 和 Web V2 双端。**搜索端点是 video_id 和 channel_id 的常见产出源**，是其他链式调用的冷启动入口。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| web_search_video | ⭐⭐ 降级 | 搜索视频（Web V1） | GET | /api/v1/youtube/web/search_video | low |
| web_search_channel | ⭐⭐ 条件 | 搜索频道内视频（需 channel_id + search_query） | GET | /api/v1/youtube/web/search_channel | low |
| web_v2_get_general_search | ⭐⭐ 降级 | 综合搜索（原始数据，需自行解析） | GET | /api/v1/youtube/web_v2/get_general_search | low |
| web_v2_get_general_search_v2 | ⭐⭐⭐ 首选 | 综合搜索 V2（结构化数据，**搜索冷启动入口**） | GET | /api/v1/youtube/web_v2/get_general_search_v2 | low |
| web_v2_get_shorts_search | ⭐⭐ 降级 | Shorts 搜索（原始数据） | GET | /api/v1/youtube/web_v2/get_shorts_search | low |
| web_v2_get_shorts_search_v2 | ⭐⭐⭐ 首选 | Shorts 搜索 V2（结构化数据） | GET | /api/v1/youtube/web_v2/get_shorts_search_v2 | low |
| web_v2_get_search_suggestions | ⭐⭐ 条件 | 获取搜索推荐词（自动补全） | GET | /api/v1/youtube/web_v2/get_search_suggestions | low |
| web_v2_search_channels | ⭐⭐⭐ 首选 | 搜索频道（Web V2，结构化数据） | GET | /api/v1/youtube/web_v2/search_channels | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 搜索视频 → 详情 | web_v2_get_general_search_v2 → 跳到 `video.md` web_v2_get_video_info_v2 | `$.data.videos[].video_id` → `video_id` | 跨文件链路 |
| 搜索频道 → 频道信息 | web_v2_search_channels → 跳到 `channel.md` web_v2_get_channel_description | `$.data.channels[].channel_id` → `channel_id` | 跨文件链路 |
| 搜索 Shorts → 详情 | web_v2_get_shorts_search_v2 → 跳到 `video.md` web_v2_get_video_info_v2 | `$.data.shorts[].video_id` → `video_id` | 跨文件链路 |
| 搜索视频 → 评论 | web_v2_get_general_search_v2 → 跳到 `comments.md` web_v2_get_video_comments | `$.data.videos[].video_id` → `video_id` | 跨文件链路 |
| 频道内搜索 | web_search_channel（需先从 channel.md 获取 channel_id） | channel_id + search_query | 跨文件链路 |
| 搜索建议 → 搜索 | web_v2_get_search_suggestions → web_v2_get_general_search_v2 | 建议词 → keyword | 第 1 步失败：直接用用户原始关键词搜索 |

## 跨 reference 链路 (In-Chain)
- **流出本文件**：`web_v2_get_general_search_v2` 的 `$.data.videos[].video_id` → `video.md` 多端点
- **流出本文件**：`web_v2_get_general_search_v2` 的 `$.data.channels[].channel_id` → `channel.md` 多端点
- **流出本文件**：`web_v2_search_channels` 的 `$.data.channels[].channel_id` → `channel.md` 多端点
- **流出本文件**：`web_v2_get_shorts_search_v2` 的 `$.data.shorts[].video_id` → `video.md` 多端点
- **流入本文件**：`channel.md` 的 channel_id → `web_search_channel`

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项；通用规则见此处。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**
- **禁止**：改路径段 切换平台前缀 拼接新路径 自行修改资源 ID 重试
- **替换**：参考 `param-mappings.md` 的"端点替换矩阵"

### 参数错误（400 / 422）防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
  - **特别注意**：Web 端用 `search_query`，Web V2 综合搜索 V2 用 `keyword`；Web 端用 `order_by`，Web V2 用 `sort_by`
  - **特别注意**：Web V2 综合搜索用 `upload_time`，V2 版用 `upload_date`（枚举值也不同）
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP

### 鉴权错误（401）/ 余额（402）/ 权限（403）/ 限流（429）/ 上游故障（5xx）/ 网络超时 / 业务错误
- 与 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview) 通用规则一致

---

## 端点详情

### web_search_video — 搜索视频 (Web)

**Full path:** `/api/v1/youtube/web/search_video`
**Method:** GET · **Risk:** low

#### 用途
搜索 YouTube 视频。Web V1 端点。

#### 何时使用 / 不使用
- ✅ Web V2 搜索端点不可用时的降级方案
- ❌ 优先使用 `web_v2_get_general_search_v2`（结构化数据，更多过滤选项）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| search_query | string | yes | — | 搜索关键字，如 `Minecraft` |
| language_code | string | no | — | 语言代码（默认 en） |
| order_by | string | no | enum=`this_week,this_month,this_year,last_hour,today` | 排序方式（默认 this_month） |
| country_code | string | no | — | 国家代码（默认 us） |
| continuation_token | string | no | — | 翻页令牌 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 搜索结果中 video_id | — | 视频 ID | video.md 多端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | search_query 缺失 | 修正后重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 web_v2_get_general_search_v2 |

---

### web_search_channel — 搜索频道内视频

**Full path:** `/api/v1/youtube/web/search_channel`
**Method:** GET · **Risk:** low

#### 用途
在指定频道内搜索视频。需要 channel_id 和 search_query 两个必填参数。

#### 何时使用 / 不使用
- ✅ 已知 channel_id，想在频道内搜索特定视频
- ❌ 想搜索全站视频 → 用 web_v2_get_general_search_v2
- ❌ 不知 channel_id → 先从频道 URL 获取（channel.md）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| channel_id | string | yes | pattern=`^UC[a-zA-Z0-9_-]{22}$` | 频道 ID |
| search_query | string | yes | — | 搜索关键字，如 `AMD` |
| language_code | string | no | — | 语言代码（默认 en） |
| country_code | string | no | — | 国家代码（默认 us） |
| continuation_token | string | no | — | 翻页令牌 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 搜索结果中 video_id | — | 视频 ID | video.md 多端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | channel_id 或 search_query 缺失 | 修正后重试 | ≤1 次 | — |
| 404 | 频道不存在 | STOP | 0 | — |

---

### web_v2_get_general_search — 综合搜索（原始数据）

**Full path:** `/api/v1/youtube/web_v2/get_general_search`
**Method:** GET · **Risk:** low

#### 用途
综合搜索 YouTube，返回原始数据结构（需自行解析）。支持丰富的过滤选项。

#### 何时使用 / 不使用
- ✅ web_v2_get_general_search_v2 不可用时的降级方案
- ❌ 优先使用 `web_v2_get_general_search_v2`（清洗后的结构化数据）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| search_query | string | yes | — | 搜索关键字，如 `Python编程` |
| language_code | string | no | — | 语言代码（默认 zh-CN） |
| country_code | string | no | — | 国家代码（默认 US） |
| time_zone | string | no | — | 时区（默认 America/Los_Angeles），如 Asia/Shanghai |
| upload_time | string | no | enum=`hour,today,week,month,year` | 上传时间过滤 |
| duration | string | no | enum=`short,medium,long` | 视频时长过滤：short(<4min)/medium(4-20min)/long(>20min) |
| content_type | string | no | enum=`video,channel,playlist,movie` | 内容类型过滤 |
| feature | string | no | enum=`hd,4k,subtitles,live,creative_commons,360,vr180,3d,hdr,location,purchased` | 特征过滤 |
| sort_by | string | no | enum=`relevance,upload_date,view_count,rating` | 排序方式 |
| continuation_token | string | no | — | 翻页令牌 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 原始数据中的 video_id / channel_id | — | 需自行解析 | video.md / channel.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | search_query 缺失 | 修正后重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 web_v2_get_general_search_v2 |

---

### web_v2_get_general_search_v2 — 综合搜索 V2（结构化数据）

**Full path:** `/api/v1/youtube/web_v2/get_general_search_v2`
**Method:** GET · **Risk:** low

#### 用途
搜索 YouTube 视频、Shorts、频道、播放列表，返回清洗后的结构化数据。**搜索冷启动入口**——video_id 和 channel_id 从此处产出。支持丰富的过滤选项。

#### 何时使用 / 不使用
- ✅ 用户想搜索 YouTube 内容
- ✅ 链式起点：批量取 video_id / channel_id 后并行调用详情端点
- ✅ 需要按时间/时长/类型/特征过滤搜索结果
- ❌ 只想搜 Shorts → 用 `web_v2_get_shorts_search_v2`
- ❌ 只想搜频道 → 用 `web_v2_search_channels`
- ❌ 想在频道内搜索 → 用 `web_search_channel`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes（首次请求） | — | 搜索关键词，如 `Python tutorial` |
| continuation_token | string | no | — | 分页 token，用于获取下一页 |
| upload_date | string | no | enum=`last_hour,today,this_week,this_month,this_year` | 上传时间过滤 |
| type | string | no | enum=`video,channel,playlist,movie` | 类型过滤 |
| duration | string | no | enum=`short,medium,long` | 时长过滤：short(<4min)/medium(4-20min)/long(>20min) |
| features | string | no | — | 特性过滤（逗号分隔）：live/4k/hd/subtitles/creative_commons/360/vr180/3d/hdr |
| sort_by | string | no | enum=`relevance,upload_date,view_count,rating` | 排序方式 |

> **注意**：首次请求必须传 keyword，翻页请求传 continuation_token。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| videos[].video_id | `$.data.videos[].video_id` | 搜索到的视频 ID | video.md 多端点 / comments.md |
| channels[].channel_id | `$.data.channels[].channel_id` | 搜索到的频道 ID | channel.md 多端点 |
| shorts[].video_id | `$.data.shorts[].video_id` | 搜索到的 Shorts ID | video.md 多端点 |
| continuation_token | `$.data.continuation_token` | 下一页 token | 同端点翻页 |
| completion_suggestions | `$.data.completion_suggestions` | 搜索建议词 | 仅展示 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | keyword 缺失（首次请求） | 修正后重试 | ≤1 次 | — |
| 空结果 | 关键词无匹配 | 告知用户，建议换关键词 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 web_v2_get_general_search 或 web_search_video |

---

### web_v2_get_shorts_search — Shorts 搜索（原始数据）

**Full path:** `/api/v1/youtube/web_v2/get_shorts_search`
**Method:** GET · **Risk:** low

#### 用途
专门搜索 YouTube Shorts 短视频，返回原始数据结构。首次请求可能返回混合内容，默认自动过滤长视频。

#### 何时使用 / 不使用
- ✅ web_v2_get_shorts_search_v2 不可用时的降级方案
- ❌ 优先使用 `web_v2_get_shorts_search_v2`（结构化数据）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| search_query | string | yes | — | 搜索关键字，如 `Python编程` |
| language_code | string | no | — | 语言代码（默认 en-US） |
| country_code | string | no | — | 国家代码（默认 US） |
| time_zone | string | no | — | 时区（默认 America/Los_Angeles） |
| upload_time | string | no | enum=`hour,today,week,month,year` | 上传时间过滤 |
| sort_by | string | no | enum=`relevance,upload_date,view_count,rating` | 排序方式 |
| continuation_token | string | no | — | 翻页令牌 |
| filter_mixed_content | boolean | no | — | 是否过滤混合内容（长视频），默认 true |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 原始数据中的 video_id | — | 需自行解析 | video.md 多端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | search_query 缺失 | 修正后重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 web_v2_get_shorts_search_v2 |

---

### web_v2_get_shorts_search_v2 — Shorts 搜索 V2（结构化数据）

**Full path:** `/api/v1/youtube/web_v2/get_shorts_search_v2`
**Method:** GET · **Risk:** low

#### 用途
专门搜索 YouTube Shorts 短视频，返回清洗后的结构化数据，自动过滤非 Shorts 内容。**Shorts 搜索的首选端点**。

#### 何时使用 / 不使用
- ✅ 用户明确想搜 Shorts 短视频
- ✅ 需要结构化的搜索结果
- ❌ 想搜普通视频 → 用 `web_v2_get_general_search_v2`
- ❌ 想搜全类型内容 → 用 `web_v2_get_general_search_v2`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes（首次请求） | — | 搜索关键词，如 `coding tips` |
| continuation_token | string | no | — | 分页 token |
| upload_date | string | no | enum=`last_hour,today,this_week,this_month,this_year` | 上传时间过滤 |
| sort_by | string | no | enum=`relevance,upload_date,view_count,rating` | 排序方式 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| shorts[].video_id | `$.data.shorts[].video_id` | Shorts 视频 ID | video.md 多端点 |
| continuation_token | `$.data.continuation_token` | 下一页 token | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | keyword 缺失 | 修正后重试 | ≤1 次 | — |
| 空结果 | 无匹配 Shorts | 告知用户 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 web_v2_get_shorts_search |

---

### web_v2_get_search_suggestions — 获取搜索推荐词

**Full path:** `/api/v1/youtube/web_v2/get_search_suggestions`
**Method:** GET · **Risk:** low

#### 用途
获取 YouTube 搜索推荐词（自动补全），类似在 YouTube 搜索框输入时显示的推荐词。响应速度非常快（< 1 秒）。

#### 何时使用 / 不使用
- ✅ 用户想获取搜索建议/补全词
- ✅ 辅助用户选择更精确的搜索关键词
- ❌ 想直接搜索内容 → 用搜索端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词，如 `Rick Astley` |
| language | string | no | — | 语言代码（默认 en），如 en, zh-cn, ja |
| region | string | no | — | 地区代码（默认 US），如 US, SG, CN, JP |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| suggestions | `$.data.suggestions` | 推荐词字符串数组 | 可作为搜索端点的 keyword |
| total_count | `$.data.total_count` | 推荐词总数 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | keyword 缺失 | 修正后重试 | ≤1 次 | — |

---

### web_v2_search_channels — 搜索频道 (Web V2)

**Full path:** `/api/v1/youtube/web_v2/search_channels`
**Method:** GET · **Risk:** low

#### 用途
搜索 YouTube 频道，只返回频道类型的搜索结果。**频道搜索的首选端点**。

#### 何时使用 / 不使用
- ✅ 用户明确想搜频道
- ✅ 链式起点：keyword → channel_id
- ❌ 想搜视频 → 用 `web_v2_get_general_search_v2`
- ❌ 想在频道内搜视频 → 用 `web_search_channel`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes（首次请求） | — | 搜索关键词，如 `Rick Astley` |
| continuation_token | string | no | — | 分页 token |
| need_format | boolean | no | — | 是否格式化数据（默认 true） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| channels[].channel_id | `$.data.channels[].channel_id` | 频道 ID | channel.md 多端点 |
| channels[].title | `$.data.channels[].title` | 频道名称 | 仅展示 |
| channels[].handle | `$.data.channels[].handle` | @用户名 | 仅展示 |
| continuation_token | `$.data.continuation_token` | 下一页 token | 同端点翻页 |
| has_more | `$.data.has_more` | 是否还有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | keyword 缺失 | 修正后重试 | ≤1 次 | — |
| 空结果 | 关键词无匹配频道 | 告知用户 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 web_v2_get_general_search_v2（type=channel） |
