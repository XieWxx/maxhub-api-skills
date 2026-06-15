# Sora2 Posts / Sora2 作品

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
作品详情、评论、回复、Remix 列表、视频下载、推荐 Feed —— 围绕"作品"的全部读取入口。**post_id 与 author.user_id 多在本文件首步产出**，是其他链式调用的常见起点。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| get_post_detail | ⭐⭐⭐ 首选 | 用 post_id/URL 取作品完整详情（**链式起点**） | GET | /api/v1/sora2/get_post_detail | low |
| get_post_comments | ⭐⭐⭐ 首选 | 用 post_id 取一级评论列表 | GET | /api/v1/sora2/get_post_comments | low |
| get_comment_replies | ⭐⭐ 条件 | 用一级 comment_id 取二级回复（仅当用户明确要"回复"） | GET | /api/v1/sora2/get_comment_replies | low |
| get_post_remix_list | ⭐⭐ 条件 | 用 post_id 取该作品的 Remix 衍生作品 | GET | /api/v1/sora2/get_post_remix_list | low |
| get_video_download_info | ⭐⭐ 条件 | 用 post_id 取无水印下载链接（用户明确要"下载"时用） | GET | /api/v1/sora2/get_video_download_info | low |
| get_feed | ⭐⭐ 降级 | 取首页推荐 Feed 流（无入参，作品冷启动入口） | GET | /api/v1/sora2/get_feed | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

> 当单个端点无法直接产出用户所需数据时，按下面链路组合调用。`字段流`列指明字段如何从上一步流向下一步，避免 Agent 臆造字段名。

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看作品 + 评论 | get_post_detail → get_post_comments | `$.data.post_id` → `post_id` | 第 1 步失败：STOP；第 2 步失败：返回作品详情 + "评论暂不可取" |
| 看评论 + 回复 | get_post_comments → get_comment_replies | `$.data.comments[].comment_id` → `comment_id` | 第 2 步失败：返回已有评论 + "回复缺失" |
| 看作品 + 评论 + 回复 | get_post_detail → get_post_comments → get_comment_replies | post_id → comment_id 接力 | 任意中间步失败：返回截止失败前的数据 |
| 下载作品视频 | get_post_detail（验证存在）→ get_video_download_info | post_id 复用 | 第 2 步 5xx：降级到 `get_post_detail` 中 `$.data.video_url`（可能带水印） |
| 看作品 + 二创 | get_post_detail → get_post_remix_list | post_id 复用 | 第 2 步空数据：返回作品详情 + "暂无 Remix" |
| 看作品 + 作者主页 | get_post_detail → 跳转 `user.md` 的 get_user_profile | `$.data.author.user_id` → `user_id` | 跨文件链路，详见 user.md |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`user.md` 的 `get_user_posts` 输出 `$.data.posts[].post_id` → 本文件多个端点的 `post_id`
- **流入本文件**：`get_feed` 输出 `$.data.feed[].post_id` → 本文件多个端点的 `post_id`
- **流出本文件**：`$.data.author.user_id` → `user.md` 全部 user 系端点的 `user_id`

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项；通用规则见此处。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
  - 路径是否在 `endpoints_whitelist.yaml` 中？
  - Method、参数键名是否符合白名单？
  - 资源 ID（post_id/user_id/comment_id）是否来自合法响应字段？
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**，向用户报告
- **禁止**：❌ 改路径段（v3→v2 试探）❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改资源 ID 重试
- **替换**：参考 `param-mappings.md` 的"端点替换矩阵"

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
  - 参数名是否逐字符匹配 IN 表？无大小写/缩写/复数错？
  - 必填项是否齐全？oneOf 是否做到"传且只传一个"？
  - 类型 / pattern / enum 是否严格匹配？
  - 传参方式（query vs body）是否正确？Authorization 头是否正确？
  - **是否有 IN 表外的臆造参数**？
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP
- **禁止**：❌ 切换端点 ❌ 在 IN 表外凭空加参数

### 鉴权错误（401）
- **子场景**：API 令牌无效 / 缺失 / 过期 / 未激活 / 用户不存在
- **行动**：**STOP**，提示用户检查或更换 API Key（https://www.aconfig.cn/console）

### 余额 / 付费（402）
- **子场景**：余额不足（允许免费额度 / 不接受免费额度）
- **行动**：**STOP**，告知用户充值（https://www.aconfig.cn/billing）；不要自行重试

### 权限错误（403）
- **子场景**：缺少路由访问权限 / 账户已禁用 / 邮箱未验证 / API Token 权限不足
- **行动**：**STOP**，按子场景告知用户去控制台处理

### 限流（429）
- **行动**：读 `Retry-After` 头退避；无该头时按 `delay = min(8s, 2^attempt) * (0.5 + random*0.5)`；最多重试 2 次
- **禁止**：❌ 立即重试 ❌ 换端点（换端点不能解决限流）

### 上游故障（500/502/503/504）
- **行动**：等 3 秒重试 1 次 → 仍失败走端点级"降级/替换"列 → 无替换则 STOP

### 网络超时
- **行动**：**STOP**，向用户报告网络异常

### 业务错误（HTTP 200 且 `code != 0`）
- **行动**：读 `message_zh`/`message` 报告用户；不要把 `data` 当作有效数据；不要重试

---

## 端点详情

### get_post_detail — 获取作品详情

**Full path:** `/api/v1/sora2/get_post_detail`
**Method:** GET · **Risk:** low

#### 用途
获取 Sora2 单个作品的完整详情，包含作者、视频、统计（点赞/评论/转发数）、Cameo 出镜等字段。**链式调用的常见起点**——大多数 post_id 与 author.user_id 从此处产出。

#### 何时使用 / 不使用
- ✅ 用户提供 post_id（s_xxx）或 sora.chatgpt.com URL
- ✅ 链式起点：取 post_id 或 author.user_id
- ❌ 想看评论 → 直接用 `get_post_comments`（不要先调本端点再绕一圈）
- ❌ 想看作者其他作品 → 用 `get_user_posts`
- ❌ 想看 Remix → 用 `get_post_remix_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| post_id | string | oneOf(post_id, post_url) | pattern=`^s_[a-z0-9]{32}$` | 作品ID，形如 `s_68e853d2...` |
| post_url | string | oneOf(post_id, post_url) | startsWith=`https://sora.chatgpt.com/p/` | 作品分享链接 |

> **二选一逻辑**：post_id 与 post_url 必须传且只传一个。同时传 → 422；都不传 → 422。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| post_id | `$.data.post_id` | 作品 ID | get_post_comments / get_post_remix_list / get_video_download_info |
| author.user_id | `$.data.author.user_id` | 作者用户 ID | user.md 全部 user 系端点 |
| video_url | `$.data.video_url` | 视频链接（可能带水印） | 降级路径：替代 get_video_download_info |
| stats.comment_count | `$.data.stats.comment_count` | 评论总数 | 用于决定是否调用 get_post_comments |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 422 | post_id/post_url 同时传或都未传 | 修正后重试 | ≤1 次 | — |
| 422 | post_id 格式不符 | 校正格式或换 post_url | ≤1 次 | 换 post_url |
| 404 | 作品不存在/已删除 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 仍失败 → 在 `get_feed`/`get_user_posts` 中匹配 post_id 取降级数据 |

---

### get_post_comments — 获取作品评论

**Full path:** `/api/v1/sora2/get_post_comments`
**Method:** GET · **Risk:** low

#### 用途
获取指定作品的一级评论列表（含分页 cursor）。

#### 何时使用 / 不使用
- ✅ 用户已知或已通过 get_post_detail 取得 post_id
- ✅ 链式中间步：为 get_comment_replies 提供 comment_id
- ❌ 想看二级回复 → 链式调用 → get_comment_replies
- ❌ 不知 post_id → 先调用 get_post_detail（输入 post_url）取 post_id

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| post_id | string | yes | pattern=`^s_[a-z0-9]{32}$` | 作品 ID |
| cursor | string | no | — | 分页游标，首次请求留空 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| comments[].comment_id | `$.data.comments[].comment_id` | 一级评论 ID | get_comment_replies.comment_id |
| comments[].user.user_id | `$.data.comments[].user.user_id` | 评论者用户 ID | user.md user 系端点 |
| cursor | `$.data.cursor` | 下一页游标 | 同端点的下一次调用 |
| has_more | `$.data.has_more` | 是否还有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | post_id 不存在 | STOP | 0 | 无（评论无替代来源） |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### get_comment_replies — 获取评论回复

**Full path:** `/api/v1/sora2/get_comment_replies`
**Method:** GET · **Risk:** low

#### 用途
获取指定一级评论下的二级回复列表（含分页 cursor）。

#### 何时使用 / 不使用
- ✅ 已通过 get_post_comments 取得 comment_id
- ❌ 不要传作品 post_id（参数名不一样，会 422）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| comment_id | string | yes | — | 一级评论 ID（从 get_post_comments 取） |
| cursor | string | no | — | 分页游标 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| replies[].user.user_id | `$.data.replies[].user.user_id` | 回复者用户 ID | user.md |
| cursor | `$.data.cursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | comment_id 不存在 | STOP | 0 | 无 |

---

### get_post_remix_list — 获取作品 Remix 列表

**Full path:** `/api/v1/sora2/get_post_remix_list`
**Method:** GET · **Risk:** low

#### 用途
获取指定作品的 Remix 衍生作品列表（其他用户基于该作品再创作的内容）。

#### 何时使用 / 不使用
- ✅ 用户想看一个作品的"二创/衍生"
- ❌ 想看作品本身详情 → get_post_detail
- ❌ 用户给的是 Remix 的 post_id → 直接当作品处理（用 get_post_detail）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| post_id | string | oneOf(post_id, post_url) | pattern=`^s_[a-z0-9]{32}$` | 原作品 ID |
| post_url | string | oneOf(post_id, post_url) | startsWith=`https://sora.chatgpt.com/p/` | 原作品 URL |
| cursor | string | no | — | 分页游标 |

> **二选一逻辑**：post_id 与 post_url 必须传且只传一个。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| remix[].post_id | `$.data.remix[].post_id` | Remix 作品 ID | get_post_detail（看 Remix 详情） |
| cursor | `$.data.cursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 原作品不存在 | STOP | 0 | 无 |
| 空数据 | 暂无 Remix | 返回"暂无 Remix"语义信息，不当作错误 | 0 | — |

---

### get_video_download_info — 获取视频下载信息

**Full path:** `/api/v1/sora2/get_video_download_info`
**Method:** GET · **Risk:** low

#### 用途
获取作品的无水印下载链接、清晰度选项、文件大小等信息。**首选下载入口**。

#### 何时使用 / 不使用
- ✅ 用户明确想下载视频
- ❌ 用户只是想看作品详情 → get_post_detail（其中 video_url 也可播放，但通常带水印）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| post_id | string | oneOf(post_id, post_url) | pattern=`^s_[a-z0-9]{32}$` | 作品 ID |
| post_url | string | oneOf(post_id, post_url) | startsWith=`https://sora.chatgpt.com/p/` | 作品 URL |

> **二选一逻辑**：post_id 与 post_url 必须传且只传一个。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| download_url | `$.data.download_url` | 无水印下载链接 | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 作品不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | **降级**：改用 `get_post_detail` 的 `$.data.video_url`（可能带水印），并显式告知用户 |
| 业务 code≠0 | 该作品不支持下载（如付费/受限） | 告知用户 | 0 | 同上降级 |

---

### get_feed — 获取推荐 Feed

**Full path:** `/api/v1/sora2/get_feed`
**Method:** GET · **Risk:** low

#### 用途
获取首页推荐 Feed 流。**作品冷启动入口**——用户没有具体 post_id 时，可从此端点采集 post_id 进入其他链路。

#### 何时使用 / 不使用
- ✅ 用户问"今天 Sora2 有什么热门作品"等无明确目标作品的场景
- ✅ 链式起点：批量取 post_id 后并行调用 get_post_detail 等
- ❌ 用户已给 post_id/URL → 直接 get_post_detail

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cursor | string | no | — | 分页游标 |
| eager_views | string | no | JSON 字符串 | 视图配置，默认 `{"views":[]}` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| feed[].post_id | `$.data.feed[].post_id` | 推荐作品 ID | 本文件多端点 |
| feed[].author.user_id | `$.data.feed[].author.user_id` | 作者用户 ID | user.md |
| cursor | `$.data.cursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代（feed 是最顶层入口） |
