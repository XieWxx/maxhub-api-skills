# YouTube Comments / YouTube 评论

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
视频评论、视频评论回复、帖子详情、帖子评论、帖子评论回复 —— 围绕"评论与社区帖子"的全部读取入口。全部来自 Web V2 端点。**reply_continuation_token 是本文件链式调用的核心字段**，从一级评论流向二级回复。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| web_v2_get_video_comments | ⭐⭐⭐ 首选 | 获取视频一级评论 | GET | /api/v1/youtube/web_v2/get_video_comments | low |
| web_v2_get_video_comment_replies | ⭐⭐ 条件 | 获取视频二级评论/回复（仅当用户明确要"回复"） | GET | /api/v1/youtube/web_v2/get_video_comment_replies | low |
| web_v2_get_post_detail | ⭐⭐⭐ 首选 | 获取社区帖子详情（**帖子链式起点**） | GET | /api/v1/youtube/web_v2/get_post_detail | low |
| web_v2_get_post_comments | ⭐⭐⭐ 首选 | 获取社区帖子评论 | GET | /api/v1/youtube/web_v2/get_post_comments | low |
| web_v2_get_post_comment_replies | ⭐⭐ 条件 | 获取帖子评论回复（仅当用户明确要"回复"） | GET | /api/v1/youtube/web_v2/get_post_comment_replies | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看视频评论 | web_v2_get_video_comments | 直接获取一级评论 | 失败：STOP（评论无替代来源） |
| 看视频评论 + 回复 | web_v2_get_video_comments → web_v2_get_video_comment_replies | `$.data.comments[].reply_continuation_token` → `continuation_token` | 第 2 步失败：返回已有评论 + "回复暂不可取" |
| 看帖子详情 + 评论 | web_v2_get_post_detail → web_v2_get_post_comments | `$.data.comments_continuation_token` → `continuation_token`（或 `post_id` → `post_id`） | 第 1 步失败：STOP；第 2 步失败：返回帖子详情 + "评论暂不可取" |
| 看帖子评论 + 回复 | web_v2_get_post_comments → web_v2_get_post_comment_replies | `$.data.comments[].reply_continuation_token` → `continuation_token` | 第 2 步失败：返回已有评论 + "回复缺失" |
| 频道帖子 → 帖子详情 + 评论 | channel.md web_v2_get_channel_community_posts → web_v2_get_post_detail → web_v2_get_post_comments | `$.data.posts[].post_id` → `post_id` 接力 | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`video.md` 的视频详情端点输出 `video_id` → web_v2_get_video_comments
- **流入本文件**：`channel.md` 的 web_v2_get_channel_community_posts 输出 `$.data.posts[].post_id` → web_v2_get_post_detail / web_v2_get_post_comments
- **流出本文件**：web_v2_get_video_comments 的 `$.data.comments[].author.channel_id` → channel.md
- **流出本文件**：web_v2_get_post_detail 的 `$.data.author_channel_id` → channel.md

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项；通用规则见此处。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**
- **禁止**：改路径段 切换平台前缀 拼接新路径 自行修改资源 ID 重试
- **替换**：评论端点**无替代来源**，失败直接 STOP

### 参数错误（400 / 422）防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
  - **特别注意**：视频评论的 `reply_continuation_token` 只能用于 `web_v2_get_video_comment_replies`，帖子评论的只能用于 `web_v2_get_post_comment_replies`，**禁止混用**
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP

### 鉴权错误（401）/ 余额（402）/ 权限（403）/ 限流（429）/ 上游故障（5xx）/ 网络超时 / 业务错误
- 与 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview) 通用规则一致

---

## 端点详情

### web_v2_get_video_comments — 获取视频评论

**Full path:** `/api/v1/youtube/web_v2/get_video_comments`
**Method:** GET · **Risk:** low

#### 用途
获取 YouTube 视频的一级评论列表（含分页）。**视频评论的唯一入口**。

#### 何时使用 / 不使用
- ✅ 已知 video_id，想看视频评论
- ✅ 链式中间步：为 web_v2_get_video_comment_replies 提供 reply_continuation_token
- ❌ 想看二级回复 → 链式调用 → web_v2_get_video_comment_replies
- ❌ 想看帖子评论 → 用 web_v2_get_post_comments

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| video_id | string | yes | length=11 | 视频ID，如 `LuIL5JATZsc` |
| language_code | string | no | — | 语言代码（默认 zh-CN） |
| country_code | string | no | — | 国家代码（默认 US） |
| sort_by | string | no | enum=`top,newest` | 排序方式：top=热门（按点赞数），newest=最新（默认 top） |
| continuation_token | string | no | — | 翻页令牌 |
| need_format | boolean | no | — | 是否清洗数据（默认 true） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| comments[].comment_id | `$.data.comments[].comment_id` | 评论唯一 ID | 仅标识 |
| comments[].reply_continuation_token | `$.data.comments[].reply_continuation_token` | 该评论的回复令牌 | web_v2_get_video_comment_replies |
| comments[].author.channel_id | `$.data.comments[].author.channel_id` | 评论者频道 ID | channel.md |
| continuation_token | `$.data.continuation_token` | 下一页评论 token | 同端点翻页 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 视频不存在 | STOP | 0 | 无替代（评论无替代来源） |
| 空评论 | 视频评论已关闭 | 告知用户 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### web_v2_get_video_comment_replies — 获取视频二级评论/回复

**Full path:** `/api/v1/youtube/web_v2/get_video_comment_replies`
**Method:** GET · **Risk:** low

#### 用途
获取视频一级评论下的二级回复列表。**必须先通过 web_v2_get_video_comments 获取 reply_continuation_token**。

#### 何时使用 / 不使用
- ✅ 已从 web_v2_get_video_comments 取得 reply_continuation_token
- ❌ 不要传 post_id 的 reply_continuation_token（帖子评论用 web_v2_get_post_comment_replies）
- ❌ 不要传 video_id（本端点不接受 video_id）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| continuation_token | string | yes | — | 回复的 continuation token（从一级评论的 reply_continuation_token 字段获取） |
| language_code | string | no | — | 语言代码（默认 zh-CN） |
| country_code | string | no | — | 国家代码（默认 US） |
| need_format | boolean | no | — | 是否清洗数据（默认 true） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| comments[].comment_id | `$.data.comments[].comment_id` | 回复 ID | 仅标识 |
| comments[].author.channel_id | `$.data.comments[].author.channel_id` | 回复者频道 ID | channel.md |
| continuation_token | `$.data.continuation_token` | 下一页回复 token | 同端点翻页 |

> reply_level 为 1 表示二级评论。is_creator 为 true 表示创作者回复。

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | continuation_token 无效 | 检查 token 来源 | ≤1 次 | — |
| 404 | 评论不存在 | STOP | 0 | 无替代 |

---

### web_v2_get_post_detail — 获取帖子详情

**Full path:** `/api/v1/youtube/web_v2/get_post_detail`
**Method:** GET · **Risk:** low

#### 用途
获取 YouTube 社区帖子的详细信息。**帖子链式调用的起点**——post_id 和 comments_continuation_token 从此处产出。

#### 何时使用 / 不使用
- ✅ 已知 post_id（以 Ugk 开头），想看帖子详情
- ✅ 链式起点：取 comments_continuation_token 给评论端点
- ❌ 想看频道所有帖子 → 用 channel.md 的 web_v2_get_channel_community_posts
- ❌ 想看帖子评论 → 直接用 web_v2_get_post_comments（传 post_id 即可）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| post_id | string | yes | startsWith=`Ugk` | 帖子 ID，如 `UgkxiCSRfD6g7SPlWGPDa3vbP7aIsytXRkvy` |
| language_code | string | no | — | 语言代码（默认 zh-CN） |
| country_code | string | no | — | 国家代码（默认 US） |
| need_format | boolean | no | — | 是否清洗数据（默认 true） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| post.post_id | `$.data.post.post_id` | 帖子 ID | web_v2_get_post_comments |
| comments_continuation_token | `$.data.comments_continuation_token` | 评论分页 token | web_v2_get_post_comments（作为 continuation_token） |
| post.author_channel_id | `$.data.post.author_channel_id` | 帖子作者频道 ID | channel.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 帖子不存在/已删除 | STOP | 0 | 无替代 |

---

### web_v2_get_post_comments — 获取帖子评论

**Full path:** `/api/v1/youtube/web_v2/get_post_comments`
**Method:** GET · **Risk:** low

#### 用途
获取 YouTube 社区帖子的评论列表（含分页）。首次请求传 post_id，翻页时传 continuation_token。

#### 何时使用 / 不使用
- ✅ 已知 post_id 或从 web_v2_get_post_detail 取得 comments_continuation_token
- ✅ 链式中间步：为 web_v2_get_post_comment_replies 提供 reply_continuation_token
- ❌ 想看视频评论 → 用 web_v2_get_video_comments
- ❌ 不知 post_id → 先从 channel.md 的帖子列表获取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| post_id | string | oneOf(post_id, continuation_token) | startsWith=`Ugk` | 帖子 ID（首次请求时必填） |
| continuation_token | string | oneOf(post_id, continuation_token) | — | 分页 token（分页时必填，也可用 get_post_detail 返回的 comments_continuation_token） |
| language_code | string | no | — | 语言代码（默认 zh-CN） |
| country_code | string | no | — | 国家代码（默认 US） |
| need_format | boolean | no | — | 是否清洗数据（默认 true） |

> **首次请求**：传 post_id。**翻页请求**：传 continuation_token。也可用 web_v2_get_post_detail 返回的 comments_continuation_token 作为 continuation_token 传入。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| comments[].comment_id | `$.data.comments[].comment_id` | 评论 ID | 仅标识 |
| comments[].reply_continuation_token | `$.data.comments[].reply_continuation_token` | 该评论的回复令牌 | web_v2_get_post_comment_replies |
| comments[].author.channel_id | `$.data.comments[].author.channel_id` | 评论者频道 ID | channel.md |
| continuation_token | `$.data.continuation_token` | 下一页评论 token | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | post_id 和 continuation_token 都未传 | 修正后重试 | ≤1 次 | — |
| 404 | 帖子不存在 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### web_v2_get_post_comment_replies — 获取帖子评论回复

**Full path:** `/api/v1/youtube/web_v2/get_post_comment_replies`
**Method:** GET · **Risk:** low

#### 用途
获取帖子一级评论下的二级回复列表。**必须先通过 web_v2_get_post_comments 获取 reply_continuation_token**。

#### 何时使用 / 不使用
- ✅ 已从 web_v2_get_post_comments 取得 reply_continuation_token
- ❌ 不要传视频评论的 reply_continuation_token（视频评论用 web_v2_get_video_comment_replies）
- ❌ 不要传 post_id（本端点不接受 post_id）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| continuation_token | string | yes | — | 回复的 continuation token（从帖子评论的 reply_continuation_token 字段获取） |
| language_code | string | no | — | 语言代码（默认 zh-CN） |
| country_code | string | no | — | 国家代码（默认 US） |
| need_format | boolean | no | — | 是否清洗数据（默认 true） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| comments[].comment_id | `$.data.comments[].comment_id` | 回复 ID | 仅标识 |
| comments[].author.channel_id | `$.data.comments[].author.channel_id` | 回复者频道 ID | channel.md |
| continuation_token | `$.data.continuation_token` | 下一页回复 token | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | continuation_token 无效 | 检查 token 来源 | ≤1 次 | — |
| 404 | 评论不存在 | STOP | 0 | 无替代 |
