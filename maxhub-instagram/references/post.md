# Instagram Posts, Reels & Media / Instagram 帖子、Reels 与媒体

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
帖子详情、Reels、Stories、Highlights、点赞列表、标记帖子、转发帖子、音乐帖子、媒体 ID 转换、oEmbed 嵌入、翻译 —— 围绕"帖子/媒体"的全部读取入口。**media_id 与 shortcode 多在本文件首步产出**，是其他链式调用的常见起点。

## 端点索引 (Endpoint Index)

### V1 端点
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| v1_fetch_post_by_url | ⭐⭐ 条件 | 用 URL 取帖子详情（数据完整） | GET | /api/v1/instagram/v1/fetch_post_by_url | low |
| v1_fetch_post_by_url_v2 | ⭐⭐ 降级 | 用 URL 取帖子详情 V2（更快但字段少） | GET | /api/v1/instagram/v1/fetch_post_by_url_v2 | low |
| v1_fetch_post_by_id | ⭐⭐ 条件 | 用 post_id 取帖子详情 | GET | /api/v1/instagram/v1/fetch_post_by_id | low |
| v1_shortcode_to_media_id | ⭐⭐⭐ 首选 | Shortcode 转 Media ID（**ID 转换入口**） | GET | /api/v1/instagram/v1/shortcode_to_media_id | low |
| v1_media_id_to_shortcode | ⭐⭐ 条件 | Media ID 转 Shortcode | GET | /api/v1/instagram/v1/media_id_to_shortcode | low |
| v1_fetch_music_posts | ⭐⭐ 条件 | 用 music_id/URL 取音乐帖子 | GET | /api/v1/instagram/v1/fetch_music_posts | low |

### V2 端点
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| v2_fetch_post_info | ⭐⭐⭐ 首选 | 用 code_or_url 取帖子详情（**链式起点**） | GET | /api/v1/instagram/v2/fetch_post_info | low |
| v2_fetch_post_likes | ⭐⭐ 条件 | 用 code_or_url 取点赞列表 | GET | /api/v1/instagram/v2/fetch_post_likes | low |
| v2_shortcode_to_media_id | ⭐⭐⭐ 首选 | Shortcode 转 Media ID | GET | /api/v1/instagram/v2/shortcode_to_media_id | low |
| v2_media_id_to_shortcode | ⭐⭐ 条件 | Media ID 转 Shortcode | GET | /api/v1/instagram/v2/media_id_to_shortcode | low |
| v2_fetch_music_posts | ⭐⭐ 条件 | 用 audio_canonical_id 取音乐帖子 | GET | /api/v1/instagram/v2/fetch_music_posts | low |

### V3 端点
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| v3_get_post_info | ⭐⭐⭐ 首选 | 用 media_id/url 取帖子详情（**链式起点**） | GET | /api/v1/instagram/v3/get_post_info | low |
| v3_get_post_info_by_code | ⭐⭐⭐ 首选 | 用 code 取帖子详情 | GET | /api/v1/instagram/v3/get_post_info_by_code | low |
| v3_get_post_oembed | ⭐ 条件 | 用 url 取 oEmbed 内嵌信息 | GET | /api/v1/instagram/v3/get_post_oembed | low |
| v3_shortcode_to_media_id | ⭐⭐⭐ 首选 | Shortcode 转 Media ID | GET | /api/v1/instagram/v3/shortcode_to_media_id | low |
| v3_media_id_to_shortcode | ⭐⭐ 条件 | Media ID 转 Shortcode | GET | /api/v1/instagram/v3/media_id_to_shortcode | low |
| v3_extract_shortcode | ⭐⭐ 条件 | 从 URL 提取 Shortcode | GET | /api/v1/instagram/v3/extract_shortcode | low |
| v3_get_recommended_reels | ⭐⭐ 降级 | 取 Reels 推荐列表（冷启动入口） | GET | /api/v1/instagram/v3/get_recommended_reels | low |
| v3_translate_comment | ⭐⭐ 条件 | 翻译单条评论/帖子文本 | GET | /api/v1/instagram/v3/translate_comment | low |
| v3_bulk_translate_comments | ⭐⭐ 条件 | 批量翻译评论（最多 10 条） | GET | /api/v1/instagram/v3/bulk_translate_comments | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| URL → 帖子详情 + 评论 | v3_extract_shortcode → v3_get_post_info_by_code → comments.md v3_get_post_comments | `$.shortcode` → `code`，再 `code` 复用 | 第 1 步失败：STOP；第 2 步失败：返回 shortcode |
| Shortcode → 帖子详情 | v3_shortcode_to_media_id → v3_get_post_info | `$.data.media_id` → `media_id` | 第 1 步失败：STOP |
| 帖子详情 + 作者主页 | v3_get_post_info → user.md v3_get_user_profile | `$.data.items[].user.id` → `user_id` | 跨文件链路，详见 user.md |
| 帖子详情 + 点赞列表 | v2_fetch_post_info → v2_fetch_post_likes | `code_or_url` 复用 | 第 2 步失败：返回帖子详情 + "点赞列表暂不可取" |
| 音乐帖子浏览 | v1_fetch_music_posts（翻页） | `$.next_max_id` → `max_id` | 翻页失败：返回已有数据 |
| Reels 推荐 → 帖子详情 | v3_get_recommended_reels → v3_get_post_info | `$.data.edges[].node.media.code` → 先提取 code | 跨文件链路 |
| 翻译评论 | comments.md v3_get_post_comments → v3_translate_comment | `$.data.comments[].pk` → `comment_id` | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`user.md` 的 `v1_fetch_user_posts` / `v2_fetch_user_posts` / `v3_get_user_posts` 输出帖子列表 → 本文件帖子详情端点
- **流入本文件**：`search.md` 的 `v1_fetch_hashtag_posts` / `v2_fetch_hashtag_posts` 输出帖子列表 → 本文件帖子详情端点
- **流出本文件**：`$.data.items[].user.id` → `user.md` 全部 user 系端点的 `user_id`
- **流出本文件**：`$.data.items[].code` → `comments.md` 的 `v3_get_post_comments` 的 `code`

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项；通用规则见此处。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**
- **禁止**：❌ 改路径段（v3→v2 试探）❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改资源 ID 重试
- **替换**：参考 `param-mappings.md` 的"端点替换矩阵"

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
- **特别注意**：V1/V2/V3 同名端点参数名不同（如 V1 用 `media_id`，V3 用 `code`），禁止跨版本套用
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP

### 鉴权错误（401）→ STOP，提示用户检查 API Key
### 余额 / 付费（402）→ STOP，告知用户充值
### 权限错误（403）→ STOP，按子场景告知用户
### 限流（429）→ 读 Retry-After 退避；最多重试 2 次
### 上游故障（500/502/503/504）→ 等 3 秒重试 1 次 → 走端点替换矩阵
### 网络超时 → STOP
### 业务错误（HTTP 200 且 `code != 0`）→ 读 `message_zh`，不重试

---

## 端点详情

### v1_fetch_post_by_url — 通过 URL 获取帖子详情

**Full path:** `/api/v1/instagram/v1/fetch_post_by_url`
**Method:** GET · **Risk:** low

#### 用途
通过帖子 URL 获取完整帖子详情。返回数据最完整，但速度较慢。

#### 何时使用 / 不使用
- ✅ 用户提供 Instagram 帖子 URL
- ✅ 需要最完整的帖子数据
- ❌ 只需要基本信息 → 用 `v1_fetch_post_by_url_v2`（更快）
- ❌ 已有 media_id → 用 `v1_fetch_post_by_id`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| post_url | string | yes | startsWith=`https://www.instagram.com/p/` 或 `/reel/` 或 `/tv/` | 帖子 URL |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| media_id | 响应中的 ID 字段 | 帖子 Media ID | v1_fetch_post_comments_v2 / v1_fetch_comment_replies |
| shortcode | 可从 URL 或响应提取 | 帖子短代码 | v1_shortcode_to_media_id |
| author.pk | 作者 ID | 帖子作者 user_id | user.md 各端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 帖子不存在/已删除 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 v1_fetch_post_by_url_v2 |

---

### v1_fetch_post_by_url_v2 — 通过 URL 获取帖子详情 V2

**Full path:** `/api/v1/instagram/v1/fetch_post_by_url_v2`
**Method:** GET · **Risk:** low

#### 用途
通过帖子 URL 获取帖子详情。数据没有 V1 完整，但速度更快，用于下载大量帖子时推荐使用。

#### 何时使用 / 不使用
- ✅ 批量获取帖子时需要更快速度
- ✅ V1 端点 5xx 时的降级方案
- ❌ 需要完整数据 → 用 `v1_fetch_post_by_url`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| post_url | string | yes | startsWith=`https://www.instagram.com/` | 帖子 URL |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| media_id | 响应中的 ID 字段 | 帖子 Media ID | v1_fetch_post_comments_v2 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 帖子不存在 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### v1_fetch_post_by_id — 通过 ID 获取帖子详情

**Full path:** `/api/v1/instagram/v1/fetch_post_by_id`
**Method:** GET · **Risk:** low

#### 用途
通过帖子 ID（media_id）获取帖子详情。

#### 何时使用 / 不使用
- ✅ 已有 media_id（纯数字），需要帖子详情
- ❌ 只有 URL → 用 `v1_fetch_post_by_url`
- ❌ 只有 shortcode → 先调 `v1_shortcode_to_media_id` 转换

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| post_id | string | yes | 纯数字 | 帖子 ID（media_id），如 `3742637871112032100` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| author.pk | 作者 ID | 帖子作者 user_id | user.md 各端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 帖子不存在 | STOP | 0 | 无替代 |

---

### v1_shortcode_to_media_id — Shortcode 转 Media ID

**Full path:** `/api/v1/instagram/v1/shortcode_to_media_id`
**Method:** GET · **Risk:** low

#### 用途
将帖子 Shortcode（如 `DRhvwVLAHAG`）转换为 Media ID（纯数字）。**ID 转换入口**——很多端点需要 media_id 而非 shortcode。

#### 何时使用 / 不使用
- ✅ 用户提供 shortcode，下游端点需要 media_id
- ✅ 链式中间步：shortcode → media_id
- ❌ 已有 media_id → 不需要转换
- ❌ 有完整 URL → 可直接用 fetch_post_by_url

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| shortcode | string | yes | — | 帖子 Shortcode，如 `DRhvwVLAHAG` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| media_id | `$.media_id` | 转换后的 Media ID | v1_fetch_post_comments_v2 / v1_fetch_comment_replies / v1_fetch_post_by_id |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | shortcode 无效 | STOP | 0 | 无替代 |

---

### v1_media_id_to_shortcode — Media ID 转 Shortcode

**Full path:** `/api/v1/instagram/v1/media_id_to_shortcode`
**Method:** GET · **Risk:** low

#### 用途
将 Media ID（纯数字）转换为 Shortcode。反向转换端点。

#### 何时使用 / 不使用
- ✅ 有 media_id 但需要 shortcode（如用于 V3 评论端点的 code 参数）
- ❌ 已有 shortcode → 不需要转换

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| media_id | string | yes | 纯数字 | 帖子 Media ID，如 `3774507992167247878` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| shortcode | `$.shortcode` | 转换后的 Shortcode | v3_get_post_info_by_code / v3_get_post_comments |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | media_id 无效 | STOP | 0 | 无替代 |

---

### v1_fetch_music_posts — 获取使用特定音乐的帖子

**Full path:** `/api/v1/instagram/v1/fetch_music_posts`
**Method:** GET · **Risk:** low

#### 用途
获取使用特定音乐/音频的帖子列表。

#### 何时使用 / 不使用
- ✅ 用户想看使用了某首音乐的帖子
- ❌ 搜索音乐 → search.md 的 `v2_search_music`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| music_id | string | oneOf(music_id, music_url) | 纯数字 | 音乐 ID，如 `564058920086577` |
| music_url | string | oneOf(music_id, music_url) | startsWith=`https://www.instagram.com/reels/audio/` | 音乐 URL |
| max_id | string | no | — | 分页游标 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| items[].pk | 帖子 ID | 帖子 Media ID | 本文件帖子详情端点 |
| next_max_id | 下一页游标 | 翻页用 | 同端点 max_id |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 音乐不存在 | STOP | 0 | 无替代 |

---

### v2_fetch_post_info — 获取帖子详情

**Full path:** `/api/v1/instagram/v2/fetch_post_info`
**Method:** GET · **Risk:** low

#### 用途
用 Shortcode 或 URL 获取帖子详情。V2 版本推荐端点，支持 shortcode 和 URL 两种输入。

#### 何时使用 / 不使用
- ✅ 用户提供 shortcode 或 URL
- ✅ V3 端点 5xx 时的降级方案
- ❌ 需要 media_id 格式的输入 → 用 V1 端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| code_or_url | string | yes | — | 帖子 Shortcode 或 URL，如 `DRhvwVLAHAG` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.items[].id | 帖子 ID | Media ID | v1_fetch_post_comments_v2 |
| data.items[].code | Shortcode | 帖子短代码 | v2_fetch_post_comments / v2_fetch_post_likes |
| data.items[].user.id | 作者 ID | user_id | user.md 各端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 帖子不存在 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 v1_fetch_post_by_url |

---

### v2_fetch_post_likes — 获取帖子点赞列表

**Full path:** `/api/v1/instagram/v2/fetch_post_likes`
**Method:** GET · **Risk:** low

#### 用途
获取指定帖子的点赞用户列表（含分页）。

#### 何时使用 / 不使用
- ✅ 用户明确想看谁点赞了某个帖子
- ❌ 只需要点赞总数 → 帖子详情中已包含

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| code_or_url | string | yes | — | 帖子 Shortcode 或 URL |
| end_cursor | string | no | — | 分页游标 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.items[].id | 点赞用户 ID | user_id | user.md 各端点 |
| end_cursor | 下一页游标 | 翻页用 | 同端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 帖子不存在 | STOP | 0 | 无替代 |

---

### v2_shortcode_to_media_id — Shortcode 转 Media ID

**Full path:** `/api/v1/instagram/v2/shortcode_to_media_id`
**Method:** GET · **Risk:** low

#### 用途
V2 版本的 Shortcode 转 Media ID。功能与 V1 相同。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| shortcode | string | yes | — | 帖子 Shortcode |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| media_id | `$.media_id` | 转换后的 Media ID | 需 media_id 的各端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | shortcode 无效 | STOP | 0 | 无替代 |

---

### v2_media_id_to_shortcode — Media ID 转 Shortcode

**Full path:** `/api/v1/instagram/v2/media_id_to_shortcode`
**Method:** GET · **Risk:** low

#### 用途
V2 版本的 Media ID 转 Shortcode。功能与 V1 相同。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| media_id | string | yes | 纯数字 | 帖子 Media ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| shortcode | `$.shortcode` | 转换后的 Shortcode | 需 shortcode 的各端点 |

---

### v2_fetch_music_posts — 获取音乐帖子

**Full path:** `/api/v1/instagram/v2/fetch_music_posts`
**Method:** GET · **Risk:** low

#### 用途
V2 版本获取音乐帖子，使用 audio_canonical_id 而非 music_id。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| audio_canonical_id | string | yes | 纯数字 | 音频 ID，如 `564058920086577` |
| pagination_token | string | no | — | 分页 token |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.items[] | 帖子列表 | 帖子数据 | 本文件帖子详情端点 |
| pagination_token | 下一页 token | 翻页用 | 同端点 |

---

### v3_get_post_info — 获取帖子详情 (media_id or URL)

**Full path:** `/api/v1/instagram/v3/get_post_info`
**Method:** GET · **Risk:** low

#### 用途
V3 版本获取帖子详情，支持 media_id 和 URL 两种输入。**V3 推荐首选端点**。

#### 何时使用 / 不使用
- ✅ 已有 media_id 或 URL，需要帖子详情
- ✅ 链式起点：取帖子完整信息
- ❌ 只有 shortcode → 用 `v3_get_post_info_by_code`
- ❌ 想看评论 → 用 comments.md 端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| media_id | string | oneOf(media_id, url) | 纯数字 | 帖子 Media ID，如 `3850699893338385742` |
| url | string | oneOf(media_id, url) | 支持 /p/、/reel/、/reels/、/tv/ | 帖子 URL |

> **二选一逻辑**：media_id 与 url 必须传且只传一个。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.items[].id | 帖子 ID | Media ID | v3_get_comment_replies |
| data.items[].code | Shortcode | 帖子短代码 | v3_get_post_info_by_code / v3_get_post_comments |
| data.items[].user.id | 作者 ID | user_id | user.md 各端点 |
| data.items[].like_count | 点赞数 | 统计数据 | 仅展示 |
| data.items[].comment_count | 评论数 | 统计数据 | 决定是否调评论端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 422 | media_id/url 同时传或都未传 | 修正后重试 | ≤1 次 | — |
| 404 | 帖子不存在 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 v2_fetch_post_info |

---

### v3_get_post_info_by_code — 获取帖子详情 (by shortcode)

**Full path:** `/api/v1/instagram/v3/get_post_info_by_code`
**Method:** GET · **Risk:** low

#### 用途
通过帖子短代码（shortcode/code）获取帖子详情。V3 推荐端点。

#### 何时使用 / 不使用
- ✅ 已有 shortcode/code
- ❌ 已有 media_id → 用 `v3_get_post_info`
- ❌ 已有 URL → 可用 `v3_get_post_info` 或先 `v3_extract_shortcode`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| code | string | yes | — | 帖子短代码，如 `DUajw4YkorV` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.items[].id | Media ID | 帖子 ID | v3_get_comment_replies |
| data.items[].code | Shortcode | 回显 | v3_get_post_comments |
| data.items[].user.id | 作者 ID | user_id | user.md 各端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 帖子不存在 | STOP | 0 | 无替代 |

---

### v3_get_post_oembed — 获取帖子 oEmbed 内嵌信息

**Full path:** `/api/v1/instagram/v3/get_post_oembed`
**Method:** GET · **Risk:** low

#### 用途
获取帖子的 oEmbed 嵌入信息（HTML 嵌入代码、缩略图等），用于在网页中嵌入 Instagram 帖子。

#### 何时使用 / 不使用
- ✅ 需要在网页中嵌入 Instagram 帖子
- ❌ 只需要帖子内容数据 → 用 `v3_get_post_info`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| url | string | yes | Instagram 帖子完整 URL | 帖子 URL |
| hidecaption | boolean | no | — | 是否隐藏帖子文本 (default: false) |
| maxwidth | integer | no | — | 最大宽度（像素）(default: 540) |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| html | 嵌入 HTML 代码 | 直接交付用户 | — |
| thumbnail_url | 缩略图 URL | 仅展示 | — |

---

### v3_shortcode_to_media_id — 短码转媒体 ID

**Full path:** `/api/v1/instagram/v3/shortcode_to_media_id`
**Method:** GET · **Risk:** low

#### 用途
V3 版本的 Shortcode 转 Media ID。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| shortcode | string | yes | — | 帖子短码，如 `CrgVBtHrFHm` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.media_id | Media ID | 转换结果 | v3_get_post_info / v3_get_comment_replies |

---

### v3_media_id_to_shortcode — 媒体 ID 转短码

**Full path:** `/api/v1/instagram/v3/media_id_to_shortcode`
**Method:** GET · **Risk:** low

#### 用途
V3 版本的 Media ID 转 Shortcode。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| media_id | string | yes | 纯数字 | 帖子媒体 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.shortcode | Shortcode | 转换结果 | v3_get_post_info_by_code / v3_get_post_comments |

---

### v3_extract_shortcode — 从 URL 提取短码

**Full path:** `/api/v1/instagram/v3/extract_shortcode`
**Method:** GET · **Risk:** low

#### 用途
从 Instagram 帖子 URL 中提取 Shortcode。支持 /p/、/reel/、/reels/、/tv/ 格式。

#### 何时使用 / 不使用
- ✅ 有完整 URL 但需要 shortcode
- ✅ 链式中间步：URL → shortcode → 其他端点
- ❌ 已有 shortcode → 不需要提取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| url | string | yes | Instagram 帖子完整 URL | 如 `https://www.instagram.com/p/CrgVBtHrFHm/` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| shortcode | 返回值 | 提取的短码 | v3_get_post_info_by_code / v3_get_post_comments |

---

### v3_get_recommended_reels — 获取 Reels 推荐列表

**Full path:** `/api/v1/instagram/v3/get_recommended_reels`
**Method:** GET · **Risk:** low

#### 用途
获取 Reels 推荐列表。**Reels 冷启动入口**——用户没有具体目标时，可从此端点采集 Reels。

#### 何时使用 / 不使用
- ✅ 用户想看推荐的 Reels
- ✅ 冷启动：批量取 Reels 后进入其他链路
- ❌ 想看特定用户的 Reels → user.md 的 `v3_get_user_reels`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| first | integer | no | — | 获取数量 (default: 12) |
| after | string | no | — | 分页游标，从 page_info.end_cursor 获取 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.edges[].node.media.code | Reels shortcode | 帖子短代码 | v3_get_post_info_by_code |
| data.edges[].node.pk | Reels media_id | 帖子 ID | v3_get_post_info |
| data.page_info.end_cursor | 下一页游标 | 翻页用 | 同端点 after |

---

### v3_translate_comment — 翻译评论/帖子文本

**Full path:** `/api/v1/instagram/v3/translate_comment`
**Method:** GET · **Risk:** low

#### 用途
翻译单条评论或帖子 caption。翻译目标语言取决于请求账号的语言设置。

#### 何时使用 / 不使用
- ✅ 用户想翻译某条评论
- ✅ 翻译帖子 caption（传入 media_id 作为 comment_id）
- ❌ 批量翻译 → 用 `v3_bulk_translate_comments`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| comment_id | string | yes | — | 评论 ID 或帖子 caption 的 media_id |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.translation | 翻译文本 | 直接交付用户 | — |
| data.source_language | 原文语言 | 仅展示 | — |

---

### v3_bulk_translate_comments — 批量翻译评论

**Full path:** `/api/v1/instagram/v3/bulk_translate_comments`
**Method:** GET · **Risk:** low

#### 用途
批量翻译评论（最多 10 条）。

#### 何时使用 / 不使用
- ✅ 需要翻译多条评论
- ❌ 只翻译一条 → 用 `v3_translate_comment`
- ❌ 超过 10 条 → 分批调用

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| comment_ids | string | yes | 逗号分隔，最多 10 个 | 评论 ID 列表，如 `18099342953509681,18099342953509682` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.comment_translations | 翻译结果映射 | key: 评论ID, value: 翻译文本 | 直接交付用户 |
