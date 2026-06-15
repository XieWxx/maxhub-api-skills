# YouTube Video / YouTube 视频

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
视频详情、流媒体、字幕/字幕、推荐视频、趋势视频 —— 围绕"视频"的全部读取入口。含 Web 和 Web V2 双端。**video_id 多在本文件首步产出**（或从搜索/频道列表端点流入），是评论、流媒体等链式调用的常见起点。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| web_get_video_info | ⭐⭐ 降级 | 获取视频元数据及下载信息（Web V1，含流媒体直链） | GET | /api/v1/youtube/web/get_video_info | low |
| web_get_video_info_v2 | ⭐ 条件 | 获取视频元数据 V2（Web V1，简化版） | GET | /api/v1/youtube/web/get_video_info_v2 | low |
| web_get_video_subtitles | ⭐⭐ 降级 | 获取视频字幕（需先取 subtitle_url） | GET | /api/v1/youtube/web/get_video_subtitles | low |
| web_get_relate_video | ⭐⭐ 降级 | 获取推荐视频（Web V1） | GET | /api/v1/youtube/web/get_relate_video | low |
| web_get_trending_videos | ⭐⭐⭐ 首选 | 获取趋势视频（无入参，冷启动入口） | GET | /api/v1/youtube/web/get_trending_videos | low |
| web_v2_get_video_info | ⭐⭐ 条件 | 获取视频详情（Web V2，原始完整数据） | GET | /api/v1/youtube/web_v2/get_video_info | low |
| web_v2_get_video_info_v2 | ⭐⭐⭐ 首选 | 获取视频详情 V2（Web V2，结构化数据，**链式起点**） | GET | /api/v1/youtube/web_v2/get_video_info_v2 | low |
| web_v2_get_video_streams | ⭐⭐ 条件 | 获取视频流信息（URL 为 null，需两步法） | GET | /api/v1/youtube/web_v2/get_video_streams | low |
| web_v2_get_video_streams_v2 | ⭐⭐⭐ 首选 | 获取视频流信息 V2（URL 已解密，一步到位） | GET | /api/v1/youtube/web_v2/get_video_streams_v2 | low |
| web_v2_get_signed_stream_url | ⭐⭐ 条件 | 获取已签名的视频流 URL（需 itag，配合 streams 两步法） | GET | /api/v1/youtube/web_v2/get_signed_stream_url | low |
| web_v2_get_video_captions | ⭐⭐⭐ 首选 | 获取视频字幕（Web V2，支持多格式） | GET | /api/v1/youtube/web_v2/get_video_captions | low |
| web_v2_get_video_captions_v2 | ⭐⭐ 备用 | 获取视频字幕 V2（Web V2 备用实现） | GET | /api/v1/youtube/web_v2/get_video_captions_v2 | low |
| web_v2_get_related_videos | ⭐⭐⭐ 首选 | 获取视频相似内容（Web V2，结构化数据） | GET | /api/v1/youtube/web_v2/get_related_videos | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看视频详情 + 评论 | web_v2_get_video_info_v2 → 跳转 `comments.md` web_v2_get_video_comments | `$.data.video_id` → `video_id` | 第 1 步失败：STOP；第 2 步失败：返回视频详情 + "评论暂不可取" |
| 看视频详情 + 字幕 | web_v2_get_video_info_v2 → web_v2_get_video_captions | `$.data.video_id` → `video_id` | 第 2 步失败：降级到 web_v2_get_video_captions_v2 |
| 看视频详情 + 推荐 | web_v2_get_video_info_v2 → web_v2_get_related_videos | `$.data.video_id` → `video_id` | 第 2 步失败：降级到 web_get_relate_video |
| 获取视频流（一步法） | web_v2_get_video_streams_v2 | 直接获取所有已解密 URL | 5xx 降级到两步法 |
| 获取视频流（两步法） | web_v2_get_video_streams → web_v2_get_signed_stream_url | `$.data.formats[].itag` / `$.data.adaptive_formats[].itag` → `itag` | 第 1 步失败：STOP；第 2 步失败：返回格式列表 + "播放地址获取失败" |
| 获取字幕（Web V1） | web_get_video_info → web_get_video_subtitles | 响应中 `subtitleUrl` → `subtitle_url` | 第 1 步失败：STOP；第 2 步失败：降级到 Web V2 字幕端点 |
| 趋势视频 → 详情 | web_get_trending_videos → web_v2_get_video_info_v2 | 趋势结果中 `video_id` → `video_id` | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`search.md` 的搜索端点输出 `video_id` → 本文件多个端点
- **流入本文件**：`channel.md` 的频道视频端点输出 `video_id` → 本文件多个端点
- **流出本文件**：`web_v2_get_video_info_v2` 的 `$.data.channel_id` → `channel.md` 全部 channel 系端点
- **流出本文件**：`web_v2_get_video_info_v2` 的 `$.data.video_id` → `comments.md` 的评论端点

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项；通用规则见此处。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
  - 路径是否在 `endpoints_whitelist.yaml` 中？
  - Method、参数键名是否符合白名单？
  - 资源 ID（video_id/channel_id）是否来自合法响应字段？
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**，向用户报告
- **禁止**：改路径段（web→web_v2 试探）切换平台前缀 拼接新路径 自行修改资源 ID 重试
- **替换**：参考 `param-mappings.md` 的"端点替换矩阵"

### 参数错误（400 / 422）防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
  - 参数名是否逐字符匹配 IN 表？无大小写/缩写/复数错？
  - **特别注意**：Web 端用 `lang`，Web V2 端用 `language_code`；Web 端用 `nextToken`，Web V2 端用 `continuation_token`
  - 必填项是否齐全？oneOf 是否做到"传且只传一个"？
  - 类型 / pattern / enum 是否严格匹配？
  - 传参方式（query vs body）是否正确？Authorization 头是否正确？
  - **是否有 IN 表外的臆造参数**？
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP
- **禁止**：切换端点 在 IN 表外凭空加参数

### 鉴权错误（401）
- **子场景**：API 令牌无效 / 缺失 / 过期 / 未激活 / 用户不存在
- **行动**：**STOP**，提示用户检查或更换 API Key（https://www.aconfig.cn）

### 余额 / 付费（402）
- **子场景**：余额不足（允许免费额度 / 不接受免费额度）
- **行动**：**STOP**，告知用户充值（https://www.aconfig.cn）；不要自行重试

### 权限错误（403）
- **子场景**：缺少路由访问权限 / 账户已禁用 / 邮箱未验证 / API Token 权限不足
- **行动**：**STOP**，按子场景告知用户去控制台处理

### 限流（429）
- **行动**：读 `Retry-After` 头退避；无该头时按 `delay = min(8s, 2^attempt) * (0.5 + random*0.5)`；最多重试 2 次
- **禁止**：立即重试 换端点（换端点不能解决限流）

### 上游故障（500/502/503/504）
- **行动**：等 3 秒重试 1 次 → 仍失败走端点级"降级/替换"列 → 无替换则 STOP

### 网络超时
- **行动**：**STOP**，向用户报告网络异常

### 业务错误（HTTP 200 且 `code != 0`）
- **行动**：读 `message_zh`/`message` 报告用户；不要把 `data` 当作有效数据；不要重试

---

## 端点详情

### web_get_video_info — 获取视频信息 V1 (Web)

**Full path:** `/api/v1/youtube/web/get_video_info`
**Method:** GET · **Risk:** low

#### 用途
获取视频元数据及下载信息。支持控制返回的音视频格式和字幕。**Web V1 端点，含流媒体直链**。

#### 何时使用 / 不使用
- ✅ 需要流媒体直链（url_access=normal）
- ✅ 需要控制音视频格式返回
- ✅ Web V2 端点不可用时的降级方案
- ❌ 只需要视频基本信息 → 推荐 `web_v2_get_video_info_v2`（结构化数据更易解析）
- ❌ 需要清洗后的结构化数据 → 用 Web V2 端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| video_id | string | yes | length=11 | 视频ID，如 `LuIL5JATZsc` |
| url_access | string | no | enum=`normal,blocked` | URL访问模式：normal=包含音视频URL, blocked=不包含（默认 normal） |
| lang | string | no | — | 语言代码（IETF标签），默认 en-US |
| videos | string | no | enum=`auto,true raw,false` | 视频格式选择（默认 auto） |
| audios | string | no | enum=`auto,true,raw,false` | 音频格式选择（默认 auto） |
| subtitles | boolean | no | — | 是否获取字幕（默认 true） |
| related | boolean | no | — | 是否获取相关视频（默认 true） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| video_id | `$.data.video_id` | 视频 ID | 本文件多端点 / comments.md / search.md |
| subtitleUrl | 响应中的 subtitleUrl | 字幕 URL | web_get_video_subtitles |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 视频不存在/已删除 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 web_v2_get_video_info_v2 |

---

### web_get_video_info_v2 — 获取视频信息 V2 (Web)

**Full path:** `/api/v1/youtube/web/get_video_info_v2`
**Method:** GET · **Risk:** low

#### 用途
获取视频元数据 V2（Web V1 简化版），仅需要 video_id。

#### 何时使用 / 不使用
- ✅ 仅需基础视频元数据
- ❌ 需要流媒体直链 → 用 `web_get_video_info`（url_access=normal）
- ❌ 需要结构化数据 → 用 `web_v2_get_video_info_v2`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| video_id | string | yes | length=11 | 视频ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| video_id | `$.data.video_id` | 视频 ID | 本文件多端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 视频不存在 | STOP | 0 | — |

---

### web_get_video_subtitles — 获取视频字幕 (Web)

**Full path:** `/api/v1/youtube/web/get_video_subtitles`
**Method:** GET · **Risk:** low

#### 用途
通过字幕 URL 获取视频字幕内容。需先调用 `web_get_video_info` 获取 subtitleUrl。

#### 何时使用 / 不使用
- ✅ 已从 web_get_video_info 取得 subtitle_url
- ✅ Web V2 字幕端点不可用时的降级方案
- ❌ 无 subtitle_url → 先调 web_get_video_info
- ❌ 优先使用 Web V2 字幕端点（更方便，直接用 video_id）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| subtitle_url | string | yes | startsWith=`https://www.youtube.com/api/timedtext` | 字幕URL（从视频详情获取） |
| format | string | no | enum=`srt,xml,vtt,txt` | 字幕格式（默认 srt） |
| fix_overlap | boolean | no | — | 修复重叠字幕（默认 true） |
| target_lang | string | no | — | 目标语言代码（留空保持原语言），如 zh-CN |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 字幕内容直接交付用户 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | subtitle_url 格式错 | 检查 URL 来源 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 web_v2_get_video_captions |

---

### web_get_relate_video — 获取推荐视频 (Web)

**Full path:** `/api/v1/youtube/web/get_relate_video`
**Method:** GET · **Risk:** low

#### 用途
根据视频 ID 获取推荐视频数据。Web V1 端点。

#### 何时使用 / 不使用
- ✅ Web V2 推荐端点不可用时的降级方案
- ❌ 优先使用 `web_v2_get_related_videos`（结构化数据）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| video_id | string | yes | length=11 | 视频ID |
| continuation_token | string | no | — | 翻页令牌 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 推荐结果中 video_id | — | 推荐视频 ID | 本文件多端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 视频不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 web_v2_get_related_videos |

---

### web_get_trending_videos — 获取趋势视频

**Full path:** `/api/v1/youtube/web/get_trending_videos`
**Method:** GET · **Risk:** low

#### 用途
获取 YouTube 趋势视频。**视频冷启动入口**——用户没有具体 video_id 时，可从此端点采集 video_id 进入其他链路。

#### 何时使用 / 不使用
- ✅ 用户问"YouTube 有什么热门视频"等无明确目标的场景
- ✅ 链式起点：批量取 video_id 后并行调用视频详情等
- ❌ 用户已给 video_id → 直接 web_v2_get_video_info_v2

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| language_code | string | no | — | 语言代码（默认 en） |
| country_code | string | no | — | 国家代码（默认 us） |
| section | string | no | enum=`Now,Music,Gaming,Movies` | 类型（默认 Now） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 趋势结果中 video_id | — | 趋势视频 ID | 本文件多端点 / comments.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代（趋势是顶层入口） |

---

### web_v2_get_video_info — 获取视频详情 (Web V2)

**Full path:** `/api/v1/youtube/web_v2/get_video_info`
**Method:** GET · **Risk:** low

#### 用途
获取 YouTube 视频详情信息，返回原始完整数据（包含 playerResponse 和 initialData）。字段最全但结构复杂。

#### 何时使用 / 不使用
- ✅ 需要最完整的原始数据（含 streamingData、microformat 等）
- ✅ web_v2_get_video_info_v2 返回空字段时的降级方案
- ❌ 只需要核心字段 → 推荐 `web_v2_get_video_info_v2`（结构化数据更易解析）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| video_id | string | yes | length=11 | 视频ID，如 `oaSNBz4qMQY` |
| language_code | string | no | — | 语言代码（默认 zh-CN） |
| need_format | boolean | no | — | 是否清洗数据（默认 true） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| video_id | `$.data.video_id` | 视频 ID | 本文件多端点 / comments.md |
| channel_id | `$.data.channel_id` | 频道 ID | channel.md 全部 channel 系端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 视频不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 web_get_video_info |

---

### web_v2_get_video_info_v2 — 获取视频详情 V2 (Web V2)

**Full path:** `/api/v1/youtube/web_v2/get_video_info_v2`
**Method:** GET · **Risk:** low

#### 用途
获取 YouTube 视频详情 V2，返回清洗后的结构化数据。**链式调用的常见起点**——video_id 与 channel_id 从此处产出。核心字段提取更稳定。

#### 何时使用 / 不使用
- ✅ 用户提供 video_id 或视频 URL
- ✅ 链式起点：取 video_id 或 channel_id
- ✅ 需要结构化的视频详情（标题、作者、描述、时长等）
- ❌ 需要流媒体直链 → 用 `web_v2_get_video_streams_v2`
- ❌ 需要最完整的原始数据 → 用 `web_v2_get_video_info`
- ❌ 想看评论 → 直接用 `comments.md` 的 web_v2_get_video_comments

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| video_id | string | oneOf(video_id, video_url) | length=11 | 视频ID，如 `dQw4w9WgXcQ` |
| video_url | string | oneOf(video_id, video_url) | startsWith=`https://www.youtube.com/watch` | 视频URL |
| need_format | boolean | no | — | 是否清洗数据（默认 true） |

> **二选一逻辑**：video_id 与 video_url 必须传且只传一个。同时传 → 以 video_id 为准。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| video_id | `$.data.video_id` | 视频 ID | 本文件多端点 / comments.md |
| channel_id | `$.data.channel_id` | 频道 ID | channel.md 全部 channel 系端点 |
| title | `$.data.title` | 视频标题 | 仅展示 |
| author | `$.data.author` | 作者名 | 仅展示 |
| length_seconds | `$.data.length_seconds` | 视频时长（秒） | 仅展示 |
| captions | `$.data.captions` | 字幕列表 | web_v2_get_video_captions |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 422 | video_id/video_url 格式错 | 修正后重试 | ≤1 次 | 换 video_url |
| 404 | 视频不存在/已删除 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 web_v2_get_video_info 或 web_get_video_info |

---

### web_v2_get_video_streams — 获取视频流信息

**Full path:** `/api/v1/youtube/web_v2/get_video_streams`
**Method:** GET · **Risk:** low

#### 用途
获取视频所有可用格式信息。**URL 字段为 null**，必须搭配 `web_v2_get_signed_stream_url` 获取播放地址（两步法）。

#### 何时使用 / 不使用
- ✅ 需要先浏览所有格式再选择特定 itag
- ❌ 想一步获取所有已解密 URL → 用 `web_v2_get_video_streams_v2`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| video_id | string | oneOf(video_id, video_url) | length=11 | 视频ID |
| video_url | string | oneOf(video_id, video_url) | startsWith=`https://www.youtube.com/watch` | 视频URL |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| formats[].itag | `$.data.formats[].itag` | 标准格式 itag | web_v2_get_signed_stream_url |
| adaptive_formats[].itag | `$.data.adaptive_formats[].itag` | 自适应格式 itag | web_v2_get_signed_stream_url |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 视频不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 web_v2_get_video_streams_v2 |

---

### web_v2_get_video_streams_v2 — 获取视频流信息 V2

**Full path:** `/api/v1/youtube/web_v2/get_video_streams_v2`
**Method:** GET · **Risk:** low

#### 用途
自动返回所有格式的已解密播放地址，无需额外调用 `web_v2_get_signed_stream_url`。**一步到位，首选下载入口**。

#### 何时使用 / 不使用
- ✅ 用户想获取视频播放/下载链接
- ✅ 一步获取所有清晰度的可用链接
- ❌ 只需要格式信息不需要 URL → 用 `web_v2_get_video_streams`（响应更快）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| video_id | string | oneOf(video_id, video_url) | length=11 | 视频ID |
| video_url | string | oneOf(video_id, video_url) | startsWith=`https://www.youtube.com/watch` | 视频URL |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| formats[].url | `$.data.formats[].url` | 标准格式已解密播放地址 | 直接交付用户 |
| adaptive_formats[].url | `$.data.adaptive_formats[].url` | 自适应格式已解密播放地址 | 直接交付用户 |
| expires_in_seconds | `$.data.expires_in_seconds` | URL 有效期（约 21600 秒 = 6 小时） | 提示用户时效性 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 视频不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到两步法（web_v2_get_video_streams + web_v2_get_signed_stream_url） |

---

### web_v2_get_signed_stream_url — 获取已签名的视频流 URL

**Full path:** `/api/v1/youtube/web_v2/get_signed_stream_url`
**Method:** GET · **Risk:** low

#### 用途
获取指定 itag 的已签名播放地址。**配合 web_v2_get_video_streams 使用**（两步法）。

#### 何时使用 / 不使用
- ✅ 已通过 web_v2_get_video_streams 获取格式列表，需要特定 itag 的播放地址
- ❌ 想一步获取所有 URL → 用 `web_v2_get_video_streams_v2`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| itag | integer | yes | — | 格式标识符（从 get_video_streams 获取），如 18=360p mp4 |
| video_id | string | no | length=11 | 视频ID |
| video_url | string | no | startsWith=`https://www.youtube.com/watch` | 视频URL（如果提供 video_id 则忽略） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| url | `$.data.url` | 已签名的播放地址 | 直接交付用户 |
| expires_in_seconds | `$.data.expires_in_seconds` | 有效期（约 21600 秒） | 提示用户时效性 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | itag 无效 | 检查 itag 来源 | ≤1 次 | — |
| 404 | 视频不存在 | STOP | 0 | — |

---

### web_v2_get_video_captions — 获取视频字幕 (Web V2)

**Full path:** `/api/v1/youtube/web_v2/get_video_captions`
**Method:** GET · **Risk:** low

#### 用途
获取视频字幕列表或字幕内容。不传 language_code 返回可用字幕列表，传 language_code 返回字幕内容。

#### 何时使用 / 不使用
- ✅ 需要获取视频字幕
- ✅ 首选字幕获取端点
- ❌ 本端点返回空字幕列表 → 降级到 `web_v2_get_video_captions_v2`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| video_id | string | oneOf(video_id, video_url) | length=11 | 视频ID |
| video_url | string | oneOf(video_id, video_url) | startsWith=`https://www.youtube.com/watch` | 视频URL |
| language_code | string | no | — | 语言代码，为空时返回可用字幕列表，如 en |
| format | string | no | enum=`srt,xml,json3,txt` | 字幕格式（默认 srt） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| captions[].language_code | `$.data.captions[].language_code` | 可用字幕语言代码 | 同端点（获取字幕内容时传入） |
| captions[].kind | `$.data.captions[].kind` | 字幕类型（asr=自动生成） | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 视频不存在 | STOP | 0 | — |
| 空字幕列表 | 该视频无字幕 | 告知用户 | 0 | 降级到 web_v2_get_video_captions_v2 重试 |

---

### web_v2_get_video_captions_v2 — 获取视频字幕 V2 (Web V2)

**Full path:** `/api/v1/youtube/web_v2/get_video_captions_v2`
**Method:** GET · **Risk:** low

#### 用途
字幕接口的备用实现，对部分 get_video_captions 取不到字幕的视频有更好的覆盖。

#### 何时使用 / 不使用
- ✅ web_v2_get_video_captions 返回空字幕列表时重试
- ❌ 首选 web_v2_get_video_captions

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| video_id | string | oneOf(video_id, video_url) | length=11 | 视频ID |
| video_url | string | oneOf(video_id, video_url) | startsWith=`https://www.youtube.com/watch` | 视频URL |
| language_code | string | no | — | 语言代码，为空时返回可用字幕列表 |
| format | string | no | enum=`srt,xml,json3,txt` | 字幕格式（默认 srt） |

#### 输出可链式字段 (OUT)
与 web_v2_get_video_captions 相同结构。

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 视频不存在 | STOP | 0 | — |
| 空字幕列表 | 该视频无字幕 | 告知用户 | 0 | 降级到 web_get_video_subtitles（需先取 subtitle_url） |

---

### web_v2_get_related_videos — 获取视频相似内容 (Web V2)

**Full path:** `/api/v1/youtube/web_v2/get_related_videos`
**Method:** GET · **Risk:** low

#### 用途
获取 YouTube 视频的相似内容推荐（类似播放页右侧的相关视频）。一次性返回所有推荐视频（通常 20-30 个），不支持分页。

#### 何时使用 / 不使用
- ✅ 用户想看某个视频的相关推荐
- ✅ 首选推荐端点（结构化数据）
- ❌ 需要分页获取更多推荐 → 用 `web_get_relate_video`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| video_id | string | oneOf(video_id, video_url) | length=11 | 视频ID |
| video_url | string | oneOf(video_id, video_url) | startsWith=`https://www.youtube.com/watch` | 视频URL |
| need_format | boolean | no | — | 是否格式化数据（默认 true） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| related_videos[].video_id | `$.data.related_videos[].video_id` | 推荐视频 ID | 本文件多端点 |
| related_videos[].author_id | `$.data.related_videos[].author_id` | 推荐视频作者频道 ID | channel.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 视频不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 web_get_relate_video |
