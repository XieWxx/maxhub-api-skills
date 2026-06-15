# Xiaohongshu Notes & Comments / 小红书 笔记与评论

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
笔记详情（图文/视频）、一级评论、二级评论（回复）—— 围绕"笔记"的全部读取入口。支持 App V2、Web V2、Web V3 三个版本。**note_id 与 author.user_id 多在本文件首步产出**，是其他链式调用的常见起点。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| get_image_note_detail | ⭐⭐⭐ 首选 | 用 note_id/分享链接 取图文笔记详情（**链式起点**） | GET | /api/v1/xiaohongshu/app_v2/get_image_note_detail | low |
| get_video_note_detail | ⭐⭐⭐ 首选 | 用 note_id/分享链接 取视频笔记详情（**链式起点**） | GET | /api/v1/xiaohongshu/app_v2/get_video_note_detail | low |
| get_note_comments | ⭐⭐⭐ 首选 | 用 note_id/分享链接 取笔记一级评论（App V2，支持排序/折叠） | GET | /api/v1/xiaohongshu/app_v2/get_note_comments | low |
| get_note_sub_comments | ⭐⭐ 条件 | 用 comment_id 取二级评论回复（App V2，仅当用户明确要"回复"） | GET | /api/v1/xiaohongshu/app_v2/get_note_sub_comments | low |
| fetch_feed_notes | ⭐⭐ 降级 | 用 note_id 取笔记详情 + 关联推荐（Web V2 V1） | GET | /api/v1/xiaohongshu/web_v2/fetch_feed_notes | low |
| fetch_feed_notes_v2 | ⭐⭐ 降级 | 用 note_id 取笔记详情 + 关联推荐（Web V2 V2） | GET | /api/v1/xiaohongshu/web_v2/fetch_feed_notes_v2 | low |
| fetch_note_comments_web_v2 | ⭐⭐ 降级 | 用 note_id 取笔记评论（Web V2，参数较少） | GET | /api/v1/xiaohongshu/web_v2/fetch_note_comments | low |
| fetch_sub_comments_web_v2 | ⭐⭐ 降级 | 用 note_id+comment_id 取子评论（Web V2） | GET | /api/v1/xiaohongshu/web_v2/fetch_sub_comments | low |
| fetch_note_detail | ⭐⭐ 条件 | 用 note_id+xsec_token 取笔记详情（Web V3，需安全令牌） | GET | /api/v1/xiaohongshu/web_v3/fetch_note_detail | low |
| fetch_note_comments_web_v3 | ⭐⭐ 条件 | 用 note_id+xsec_token 取笔记评论（Web V3，需安全令牌） | GET | /api/v1/xiaohongshu/web_v3/fetch_note_comments | low |
| fetch_sub_comments_web_v3 | ⭐ 条件 | 用 note_id+root_comment_id+xsec_token 取子评论（Web V3） | GET | /api/v1/xiaohongshu/web_v3/fetch_sub_comments | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看笔记 + 评论 | get_image_note_detail → get_note_comments | `$.data.note_id` → `note_id` | 第 1 步失败：STOP；第 2 步失败：返回笔记详情 + "评论暂不可取" |
| 看评论 + 回复 | get_note_comments → get_note_sub_comments | `$.data.data.comments[].comment_id` → `comment_id` | 第 2 步失败：返回已有评论 + "回复缺失" |
| 看笔记 + 评论 + 回复 | get_image_note_detail → get_note_comments → get_note_sub_comments | note_id → comment_id 接力 | 任意中间步失败：返回截止失败前的数据 |
| 看笔记 + 作者主页 | get_image_note_detail → 跳转 `user.md` 的 get_user_info | `$.data.user.user_id` → `user_id` | 跨文件链路，详见 user.md |
| 分享链接 → 笔记详情 | get_image_note_detail（传 share_text） | share_text 直接入参 | 无需链式 |
| Web V3 笔记详情 | fetch_note_detail（需 xsec_token） | note_id + xsec_token 直接入参 | 缺 xsec_token → 降级到 App V2 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`search.md` 的 `search_notes` / `fetch_search_notes` 输出 `$.data.items[].note_id` → 本文件多个端点的 `note_id`
- **流入本文件**：`search.md` 的 `fetch_homefeed` 输出 `$.data.items[].note_id` → 本文件多个端点
- **流入本文件**：`user.md` 的 `get_user_posted_notes` / `fetch_user_notes` 输出 `$.data.data.notes[].note_id` → 本文件
- **流入本文件**：`product.md` 的 `get_topic_feed` 输出 `$.data.notes[].note_id` → 本文件
- **流出本文件**：`$.data.user.user_id` → `user.md` 全部 user 系端点的 `user_id`
- **流出本文件**：`$.data.data.comments[].user.user_id` → `user.md`（评论者 user_id）

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项；通用规则见此处。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
  - 路径是否在 `endpoints_whitelist.yaml` 中？
  - Method、参数键名是否符合白名单？
  - 资源 ID（note_id/user_id/comment_id）是否来自合法响应字段？
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**，向用户报告
- **禁止**：❌ 改路径段（app_v2→web_v2 试探）❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改 note_id 重试
- **替换**：参考 `param-mappings.md` 的"端点替换矩阵"

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
  - 参数名是否逐字符匹配 IN 表？无大小写/缩写/复数错？
  - 必填项是否齐全？oneOf 是否做到"至少传一个"？
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
- **行动**：读 `Retry-After` 头退避；无该头时指数退避 + jitter；最多重试 2 次

### 上游故障（500/502/503/504）
- **行动**：等 3 秒重试 1 次 → 仍失败走端点级"降级/替换"列 → 无替换则 STOP

### 网络超时
- **行动**：**STOP**，向用户报告网络异常

### 业务错误（HTTP 200 且 `code != 0`）
- **行动**：读 `message_zh`/`message` 报告用户；不要把 `data` 当作有效数据；不要重试

---

## 端点详情

### get_image_note_detail — 获取图文笔记详情

**Full path:** `/api/v1/xiaohongshu/app_v2/get_image_note_detail`
**Method:** GET · **Risk:** low

#### 用途
获取小红书图文笔记的完整详情，包含笔记内容、图片列表、作者信息、互动数据等。**链式调用的常见起点**——大多数 note_id 与 author.user_id 从此处产出。

#### 何时使用 / 不使用
- ✅ 用户提供 note_id 或分享链接，想看图文笔记详情
- ✅ 链式起点：取 note_id 或 author.user_id
- ❌ 想看视频笔记 → 用 `get_video_note_detail`
- ❌ 想看评论 → 直接用 `get_note_comments`（不要先调本端点再绕一圈）
- ❌ 想看作者其他笔记 → 用 `user.md` 的 `get_user_posted_notes`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| note_id | string | oneOf(note_id, share_text) | 24 位 hex | 笔记ID，如 `697c0eee000000000a03c308` |
| share_text | string | oneOf(note_id, share_text) | xhslink.com 链接 | 分享链接，如 `http://xhslink.com/o/8GqargIxrko` |

> **二选一逻辑**：note_id 与 share_text 至少传一个。优先使用 note_id；两个参数如都携带则以 note_id 为准。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| note_id | `$.data.note_id` | 笔记 ID | get_note_comments / get_note_sub_comments / fetch_feed_notes 等 |
| user.user_id | `$.data.user.user_id` | 作者用户 ID | user.md 全部 user 系端点 |
| interact_info | `$.data.interact_info` | 互动数据（点赞/收藏/评论数） | 用于决定是否调用评论端点 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 笔记不存在/已删除 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 fetch_feed_notes（Web V2）或 fetch_note_detail（Web V3，需 xsec_token） |

---

### get_video_note_detail — 获取视频笔记详情

**Full path:** `/api/v1/xiaohongshu/app_v2/get_video_note_detail`
**Method:** GET · **Risk:** low

#### 用途
获取小红书视频笔记的完整详情，包含视频播放地址、封面图、作者信息、互动数据等。

#### 何时使用 / 不使用
- ✅ 用户提供 note_id 或分享链接，想看视频笔记详情
- ❌ 想看图文笔记 → 用 `get_image_note_detail`
- ❌ 不确定笔记类型 → 可先尝试 get_image_note_detail，失败后再试本端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| note_id | string | oneOf(note_id, share_text) | 24 位 hex | 笔记ID |
| share_text | string | oneOf(note_id, share_text) | xhslink.com 链接 | 分享链接 |

> **二选一逻辑**：同 get_image_note_detail。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| note_id | `$.data.note_id` | 笔记 ID | 同 get_image_note_detail |
| user.user_id | `$.data.user.user_id` | 作者用户 ID | user.md |
| video.media.stream | `$.data.video.media.stream` | 视频流地址 | 直接交付用户 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 笔记不存在/已删除 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 fetch_note_detail（Web V3，需 xsec_token） |

---

### get_note_comments — 获取笔记评论列表

**Full path:** `/api/v1/xiaohongshu/app_v2/get_note_comments`
**Method:** GET · **Risk:** low

#### 用途
获取指定笔记的一级评论列表（含分页），支持排序策略和折叠状态控制。

#### 何时使用 / 不使用
- ✅ 用户已知或已通过笔记详情取得 note_id，想看评论
- ✅ 链式中间步：为 get_note_sub_comments 提供 comment_id
- ❌ 想看二级回复 → 链式调用 → get_note_sub_comments
- ❌ 不知 note_id → 先调用笔记详情端点取 note_id

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| note_id | string | oneOf(note_id, share_text) | 24 位 hex | 笔记ID |
| share_text | string | oneOf(note_id, share_text) | xhslink.com 链接 | 分享链接 |
| cursor | string | no | — | 分页游标，首次请求留空 |
| index | integer | no | default=0 | 评论索引，首次请求传 0 |
| pageArea | string | no | enum=`UNFOLDED, FOLDED` | 折叠状态：UNFOLDED(展开), FOLDED(折叠)，默认 UNFOLDED |
| sort_strategy | string | no | enum=`default, latest_v2, like_count` | 排序策略，默认 latest_v2；`default` 不推荐（翻页可能丢评论） |

> **翻页说明**：首次请求 cursor 留空、index 传 0；翻页时传入上一次响应返回的 cursor、index、pageArea。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| comments[].comment_id | `$.data.data.comments[].comment_id` | 一级评论 ID | get_note_sub_comments.comment_id |
| comments[].user.user_id | `$.data.data.comments[].user.user_id` | 评论者用户 ID | user.md user 系端点 |
| cursor | `$.data.data.cursor` | 分页游标（JSON 对象） | 同端点翻页 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | note_id 不存在 | STOP | 0 | 无（评论无替代来源） |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 fetch_note_comments_web_v2 或 fetch_note_comments_web_v3 |

---

### get_note_sub_comments — 获取笔记二级评论（回复）

**Full path:** `/api/v1/xiaohongshu/app_v2/get_note_sub_comments`
**Method:** GET · **Risk:** low

#### 用途
获取指定一级评论下的二级回复列表（含分页）。

#### 何时使用 / 不使用
- ✅ 已通过 get_note_comments 取得 comment_id，想看该评论的回复
- ❌ 不要传笔记的 note_id 作为 comment_id（会 404）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| note_id | string | no | 24 位 hex | 笔记ID（与 share_text 二选一，辅助定位） |
| share_text | string | no | xhslink.com 链接 | 分享链接 |
| comment_id | string | **yes** | 24 位 hex | 父评论ID（必填），如 `699fb9930000000008030db6` |
| cursor | string | no | — | 分页游标，首次留空；翻页时从 `$.data.data.cursor` 提取 |
| index | integer | no | default=1 | 分页索引，首次传 1；翻页时从 `$.data.data.cursor` 提取 |

> **翻页说明**：响应中 `$.data.data.cursor` 为 JSON 对象，如 `{"cursor":"69a0c134000000000c00910d","index":3}`；翻页时分别提取 cursor 和 index 传入。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| comments[].user.user_id | `$.data.data.comments[].user.user_id` | 回复者用户 ID | user.md |
| cursor | `$.data.data.cursor` | 分页游标（JSON 对象含 cursor+index） | 同端点翻页 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | comment_id 不存在 | STOP | 0 | 无 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 fetch_sub_comments_web_v2 或 fetch_sub_comments_web_v3 |

---

### fetch_feed_notes — 获取图文笔记详情 V1（Web V2）

**Full path:** `/api/v1/xiaohongshu/web_v2/fetch_feed_notes`
**Method:** GET · **Risk:** low

#### 用途
通过 Web V2 接口获取笔记详情及关联推荐笔记。返回单一笔记和推荐列表。

#### 何时使用 / 不使用
- ✅ App V2 端点 5xx 时的降级选择
- ✅ 需要关联推荐笔记数据
- ❌ 首选应使用 App V2 端点（字段更完整）
- ❌ 不需要推荐笔记 → 用 get_image_note_detail 更高效

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| note_id | string | yes | 24 位 hex | 笔记ID |
| share_text | string | no | xhslink.com 链接 | 分享链接（可选，note_id 优先） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| note_id | `$.data.note_id` | 笔记 ID | 本文件多端点 |
| user.user_id | `$.data.user.user_id` | 作者用户 ID | user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | note_id 不存在 | STOP | 0 | 无 |

---

### fetch_feed_notes_v2 — 获取图文笔记详情 V2（Web V2）

**Full path:** `/api/v1/xiaohongshu/web_v2/fetch_feed_notes_v2`
**Method:** GET · **Risk:** low

#### 用途
同 fetch_feed_notes 的 V2 版本，返回单一笔记和关联推荐笔记。

#### 何时使用 / 不使用
- ✅ fetch_feed_notes 不可用时的备选
- ❌ 首选应使用 App V2 或 fetch_feed_notes

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| note_id | string | yes | 24 位 hex | 笔记ID |
| share_text | string | no | xhslink.com 链接 | 分享链接 |

#### 输出可链式字段 (OUT)
同 fetch_feed_notes。

#### 错误处理 (ERR)
同 fetch_feed_notes。

---

### fetch_note_comments_web_v2 — 获取笔记评论（Web V2）

**Full path:** `/api/v1/xiaohongshu/web_v2/fetch_note_comments`
**Method:** GET · **Risk:** low

#### 用途
通过 Web V2 接口获取笔记评论列表。参数较少，不支持排序策略和折叠控制。

#### 何时使用 / 不使用
- ✅ App V2 的 get_note_comments 5xx 时的降级选择
- ❌ 首选应使用 App V2（支持排序/折叠）
- ❌ 需要 xsec_token → 用 Web V3

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| note_id | string | yes | 24 位 hex | 笔记ID |
| cursor | string | no | — | 分页游标 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| comments[].comment_id | `$.data.comments[].comment_id` | 评论 ID | fetch_sub_comments_web_v2 |
| comments[].user.user_id | `$.data.comments[].user.user_id` | 评论者用户 ID | user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | note_id 不存在 | STOP | 0 | 无 |

---

### fetch_sub_comments_web_v2 — 获取子评论（Web V2）

**Full path:** `/api/v1/xiaohongshu/web_v2/fetch_sub_comments`
**Method:** GET · **Risk:** low

#### 用途
通过 Web V2 接口获取子评论列表。

#### 何时使用 / 不使用
- ✅ App V2 的 get_note_sub_comments 5xx 时的降级选择
- ❌ 首选应使用 App V2

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| note_id | string | yes | 24 位 hex | 笔记ID |
| comment_id | string | yes | 24 位 hex | 父评论ID |
| cursor | string | no | — | 分页游标 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| comments[].user.user_id | `$.data.comments[].user.user_id` | 回复者用户 ID | user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | comment_id 不存在 | STOP | 0 | 无 |

---

### fetch_note_detail — 获取笔记详情（Web V3）

**Full path:** `/api/v1/xiaohongshu/web_v3/fetch_note_detail`
**Method:** GET · **Risk:** low

#### 用途
通过 Web V3 接口获取笔记详情（图文/视频通用）。需要 xsec_token 安全令牌。

#### 何时使用 / 不使用
- ✅ 有分享链接可提取 xsec_token 时使用
- ✅ App V2 端点不可用时的降级选择
- ❌ 没有 xsec_token → 用 App V2 端点（不需要 xsec_token）
- ❌ 不确定图文/视频类型 → 本端点通用，无需区分

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| note_id | string | yes | 24 位 hex | 笔记ID |
| xsec_token | string | yes | — | 安全令牌，从小红书分享链接中获取 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| note_id | `$.data.note_id` | 笔记 ID | 本文件多端点 |
| user.user_id | `$.data.user.user_id` | 作者用户 ID | user.md |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | note_id 不存在或 xsec_token 无效 | STOP | 0 | 降级到 App V2 端点（无需 xsec_token） |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 get_image_note_detail / get_video_note_detail |

---

### fetch_note_comments_web_v3 — 获取笔记评论（Web V3）

**Full path:** `/api/v1/xiaohongshu/web_v3/fetch_note_comments`
**Method:** GET · **Risk:** low

#### 用途
通过 Web V3 接口获取笔记评论列表。需要 xsec_token。XHS 已升级评论接口风控，xsec_token 为必填。

#### 何时使用 / 不使用
- ✅ 有 xsec_token，且 App V2 / Web V2 评论端点不可用
- ❌ 没有 xsec_token → 用 App V2 的 get_note_comments

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| note_id | string | yes | 24 位 hex | 笔记ID |
| cursor | string | no | — | 分页游标 |
| xsec_token | string | yes | — | 安全令牌（必填） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| comments[].comment_id | `$.data.comments[].comment_id` | 评论 ID | fetch_sub_comments_web_v3.root_comment_id |
| comments[].user.user_id | `$.data.comments[].user.user_id` | 评论者用户 ID | user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | note_id 不存在或 xsec_token 无效 | STOP | 0 | 降级到 App V2 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 get_note_comments 或 fetch_note_comments_web_v2 |

---

### fetch_sub_comments_web_v3 — 获取子评论（Web V3）

**Full path:** `/api/v1/xiaohongshu/web_v3/fetch_sub_comments`
**Method:** GET · **Risk:** low

#### 用途
通过 Web V3 接口获取子评论列表。需要 xsec_token。注意参数名为 `root_comment_id`（非 comment_id）。

#### 何时使用 / 不使用
- ✅ 有 xsec_token，且 App V2 / Web V2 子评论端点不可用
- ❌ 没有 xsec_token → 用 App V2 的 get_note_sub_comments
- ❌ 注意参数名差异：本端点用 `root_comment_id`，App V2 / Web V2 用 `comment_id`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| note_id | string | yes | 24 位 hex | 笔记ID |
| root_comment_id | string | yes | 24 位 hex | 父评论ID（注意：非 comment_id） |
| num | integer | no | default=10 | 返回数量 |
| cursor | string | no | — | 分页游标 |
| xsec_token | string | yes | — | 安全令牌（必填） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| comments[].user.user_id | `$.data.comments[].user.user_id` | 回复者用户 ID | user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | root_comment_id 不存在或 xsec_token 无效 | STOP | 0 | 降级到 App V2 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 get_note_sub_comments 或 fetch_sub_comments_web_v2 |
