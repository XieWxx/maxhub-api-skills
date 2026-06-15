# Instagram Comments & Replies / Instagram 评论与回复

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
帖子评论列表、评论回复/子评论列表 —— 围绕"评论读取"的全部入口。**comment_id 多在本文件首步（评论列表）产出**，是子评论端点和翻译端点的常见输入。本 skill **不支持评论写入/删除**（见 [`param-mappings.md` § 0.1](./param-mappings.md#-01-本-skill-不支持的能力-out-of-scope)）。

## 端点索引 (Endpoint Index)

### V1 端点
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| v1_fetch_post_comments_v2 | ⭐⭐ 降级 | 用 media_id 取帖子评论列表 | GET | /api/v1/instagram/v1/fetch_post_comments_v2 | low |
| v1_fetch_comment_replies | ⭐⭐ 降级 | 用 media_id+comment_id 取子评论 | GET | /api/v1/instagram/v1/fetch_comment_replies | low |

### V2 端点
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| v2_fetch_post_comments | ⭐⭐ 条件 | 用 code_or_url 取帖子评论 | GET | /api/v1/instagram/v2/fetch_post_comments | low |
| v2_fetch_comment_replies | ⭐⭐ 条件 | 用 code_or_url+comment_id 取回复 | GET | /api/v1/instagram/v2/fetch_comment_replies | low |

### V3 端点
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| v3_get_post_comments | ⭐⭐⭐ 首选 | 用 code 取帖子评论（**链式起点**） | GET | /api/v1/instagram/v3/get_post_comments | low |
| v3_get_comment_replies | ⭐⭐⭐ 首选 | 用 media_id+comment_id 取子评论 | GET | /api/v1/instagram/v3/get_comment_replies | low |

> **同名端点跨版本参数差异**（全局红线第 3 条）：
> - 取评论：V1 用 `media_id`，V2 用 `code_or_url`，V3 用 `code` —— **禁止跨版本套用参数**
> - 取子评论：V1 用 `media_id`，V2 用 `code_or_url`，V3 用 `media_id` —— V3 子评论端点回退用 media_id 而非 code

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 帖子评论 + 子评论展开 | v3_get_post_comments → v3_get_comment_replies | `$.data.comments[].pk` → `comment_id`；需额外 `media_id`（来自 post.md） | 第 1 步失败：STOP；第 2 步失败：返回评论列表 + "子评论暂不可取" |
| 帖子评论 + 翻译 | v3_get_post_comments → post.md v3_translate_comment | `$.data.comments[].pk` → `comment_id` | 跨文件链路，详见 post.md |
| 帖子评论 + 批量翻译 | v3_get_post_comments → post.md v3_bulk_translate_comments | `$.data.comments[].pk` 最多取 10 个 → `comment_ids`（逗号拼接） | 跨文件链路 |
| URL → 评论 | post.md v3_extract_shortcode → v3_get_post_comments | `$.shortcode` → `code` | 第 1 步失败：STOP |
| Shortcode → 评论 + 子评论 | v3_get_post_comments → v3_get_comment_replies | `$.data.comments[].pk` → `comment_id` | 同第 1 条 |
| V3 评论失败降级 | v3_get_post_comments 失败 → v2_fetch_post_comments → v1_fetch_post_comments_v2 | 需转换参数：`code` → `code_or_url` → `media_id`（可能需 post.md 的转换端点） | 每步降级前显式告知用户 |
| V3 子评论失败降级 | v3_get_comment_replies 失败 → v2_fetch_comment_replies → v1_fetch_comment_replies | 需转换参数：`media_id` → `code_or_url`（可能需转换）→ `media_id` | 每步降级前显式告知用户 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`post.md` 的 `v3_get_post_info` / `v3_get_post_info_by_code` 输出 `code` → 本文件 `v3_get_post_comments` 的 `code`
- **流入本文件**：`post.md` 的 `v3_get_post_info` 输出 `$.data.items[].id`（media_id）→ 本文件 `v3_get_comment_replies` 的 `media_id`
- **流入本文件**：`post.md` 的 `v3_extract_shortcode` 输出 `shortcode` → 本文件 `v3_get_post_comments` 的 `code`
- **流入本文件**：`post.md` 的 `v1_shortcode_to_media_id` / `v2_shortcode_to_media_id` / `v3_shortcode_to_media_id` 输出 `media_id` → 本文件 V1 评论端点的 `media_id`
- **流出本文件**：`$.data.comments[].pk` / `$.comments[].pk` → `post.md` 的 `v3_translate_comment` / `v3_bulk_translate_comments` 的 `comment_id` / `comment_ids`
- **流出本文件**：`$.data.comments[].user.pk` → `user.md` 各端点的 `user_id`（评论者信息）

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
- **特别注意**：V1/V2/V3 同名端点参数名不同（V1 用 `media_id`，V2 用 `code_or_url`，V3 用 `code`），禁止跨版本套用
- **特别注意**：V3 子评论端点 `v3_get_comment_replies` 用 `media_id` 而非 `code`，与 V3 评论列表端点参数类型不同
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

### v1_fetch_post_comments_v2 — 获取帖子评论列表 V2

**Full path:** `/api/v1/instagram/v1/fetch_post_comments_v2`
**Method:** GET · **Risk:** low

#### 用途
通过 media_id 获取帖子评论列表。V1 版本评论端点，返回评论详情较完整（含点赞数、子评论预览等）。

#### 何时使用 / 不使用
- ✅ V3/V2 评论端点 5xx 时的降级方案
- ✅ 已有 media_id（纯数字），无需额外转换
- ❌ 已有 shortcode/code → 优先用 V3 `v3_get_post_comments`（需先转 media_id 或直接用 code）
- ❌ 需要写入评论 → 本 skill 不支持

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| media_id | string | yes | 纯数字 | 帖子 ID（媒体 ID），如 `3766120364183949816` |
| sort_order | string | no | enum: `popular`, `recent` | 排序方式：popular(热门) / recent(最新)，默认 recent |
| min_id | string | no | — | 分页游标，从上一次响应的 `next_min_id` 获取 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| comments[].pk | `$.comments[].pk` | 评论 ID | v1_fetch_comment_replies / post.md v3_translate_comment |
| comments[].user.pk | `$.comments[].user.pk` | 评论者 user_id | user.md 各端点 |
| comments[].child_comment_count | `$.comments[].child_comment_count` | 子评论数量 | 决定是否调子评论端点 |
| next_min_id | `$.next_min_id` | 下一页游标 | 同端点 min_id |
| comment_count | `$.comment_count` | 评论总数 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 帖子不存在或 media_id 无效 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代（V1 已是最低版本） |

---

### v1_fetch_comment_replies — 获取评论的子评论列表

**Full path:** `/api/v1/instagram/v1/fetch_comment_replies`
**Method:** GET · **Risk:** low

#### 用途
通过 media_id 和 comment_id 获取指定评论的子评论/回复列表。

#### 何时使用 / 不使用
- ✅ 已有 media_id 和 comment_id，需要展开子评论
- ✅ V3/V2 子评论端点 5xx 时的降级方案
- ❌ 需要获取帖子的一级评论 → 用 `v1_fetch_post_comments_v2`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| media_id | string | yes | 纯数字 | 帖子 ID（媒体 ID），如 `3766120364183949816` |
| comment_id | string | yes | — | 父评论 ID，如 `17871667485468098` |
| min_id | string | no | — | 分页游标，从上一次响应的 `next_min_child_cursor` 获取 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| child_comments[].pk | `$.child_comments[].pk` | 子评论 ID | post.md v3_translate_comment |
| child_comments[].user.pk | `$.child_comments[].user.pk` | 子评论者 user_id | user.md 各端点 |
| next_min_child_cursor | `$.next_min_child_cursor` | 下一页游标 | 同端点 min_id |
| child_comment_count | `$.child_comment_count` | 子评论总数 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 评论不存在或 media_id 无效 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代（V1 已是最低版本） |

---

### v2_fetch_post_comments — 获取帖子评论

**Full path:** `/api/v1/instagram/v2/fetch_post_comments`
**Method:** GET · **Risk:** low

#### 用途
通过 code_or_url 获取帖子评论列表。V2 版本支持 shortcode 和 URL 两种输入，分页使用 pagination_token。

#### 何时使用 / 不使用
- ✅ 已有 shortcode 或 URL，需要评论列表
- ✅ V3 评论端点 5xx 时的降级方案
- ❌ 已有纯 media_id → 用 V1 `v1_fetch_post_comments_v2` 或先转换
- ❌ 已有 code → 优先用 V3 `v3_get_post_comments`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| code_or_url | string | yes | — | 帖子 Shortcode 或 URL，如 `DRhvwVLAHAG` |
| sort_by | string | no | enum: `recent`, `popular` | 排序方式：recent(最新) / popular(热门)，默认 recent |
| pagination_token | string | no | — | 分页 token，从上一次响应获取 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.items[].id | `$.data.items[].id` | 评论 ID | v2_fetch_comment_replies / post.md v3_translate_comment |
| data.items[].user.id | `$.data.items[].user.id` | 评论者 user_id | user.md 各端点 |
| pagination_token | `$.pagination_token` | 下一页 token | 同端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 帖子不存在 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 v1_fetch_post_comments_v2（需先转换 code→media_id） |

---

### v2_fetch_comment_replies — 获取评论回复

**Full path:** `/api/v1/instagram/v2/fetch_comment_replies`
**Method:** GET · **Risk:** low

#### 用途
通过 code_or_url 和 comment_id 获取指定评论的回复列表。V2 版本子评论端点。

#### 何时使用 / 不使用
- ✅ 已有 shortcode/URL 和 comment_id，需要展开回复
- ✅ V3 子评论端点 5xx 时的降级方案
- ❌ 需要获取帖子的一级评论 → 用 `v2_fetch_post_comments`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| code_or_url | string | yes | — | 帖子 Shortcode 或 URL，如 `DRhvwVLAHAG` |
| comment_id | string | yes | — | 评论 ID，如 `18067775592012345` |
| pagination_token | string | no | — | 分页 token，从上一次响应获取 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.items[].id | `$.data.items[].id` | 回复 ID | post.md v3_translate_comment |
| data.items[].user.id | `$.data.items[].user.id` | 回复者 user_id | user.md 各端点 |
| pagination_token | `$.pagination_token` | 下一页 token | 同端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 评论不存在 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 v1_fetch_comment_replies（需先转换 code→media_id） |

---

### v3_get_post_comments — 获取帖子评论

**Full path:** `/api/v1/instagram/v3/get_post_comments`
**Method:** GET · **Risk:** low

#### 用途
通过 code（shortcode）获取帖子评论列表。V3 版本推荐首选端点，返回评论详情含用户信息、点赞数、子评论数量等。

#### 何时使用 / 不使用
- ✅ 已有 shortcode/code，需要帖子评论 —— **V3 首选**
- ✅ 链式起点：从帖子详情获取 code 后取评论
- ❌ 已有 media_id → 需先转换为 code（用 post.md 的 `v3_media_id_to_shortcode`）或降级到 V1
- ❌ 已有完整 URL → 可先调 post.md `v3_extract_shortcode` 提取 code
- ❌ 需要写入评论 → 本 skill 不支持

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| code | string | yes | — | 帖子短代码，如 `DUajw4YkorV` |
| min_id | string | no | — | 分页游标，从上一次响应的 `next_min_id` 获取 |
| sort_order | string | no | enum: `popular`, `newest` | 排序方式：popular(热门) / newest(最新)，默认 popular |

> **分页注意**：`min_id` 是接口返回的转义 JSON 字符串，直接原样传入即可，接口内部会自动反转义处理。**禁止**自行解码或修改 min_id 值。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.comments[].pk | `$.data.comments[].pk` | 评论 ID | v3_get_comment_replies / post.md v3_translate_comment / post.md v3_bulk_translate_comments |
| data.comments[].user.pk | `$.data.comments[].user.pk` | 评论者 user_id | user.md 各端点 |
| data.comments[].child_comment_count | `$.data.comments[].child_comment_count` | 子评论数量 | 决定是否调子评论端点 |
| data.next_min_id | `$.data.next_min_id` | 下一页游标 | 同端点 min_id |
| data.has_more_comments | `$.data.has_more_comments` | 是否有更多评论 | 决定是否翻页 |
| data.comment_count | `$.data.comment_count` | 评论总数 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 帖子不存在或 code 无效 | STOP | 0 | 无替代 |
| 422 | 参数格式错误 | 修正后重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 v2_fetch_post_comments（code→code_or_url） |

---

### v3_get_comment_replies — 获取评论的子评论/回复

**Full path:** `/api/v1/instagram/v3/get_comment_replies`
**Method:** GET · **Risk:** low

#### 用途
通过 media_id 和 comment_id 获取指定评论的子评论/回复列表。V3 版本推荐首选子评论端点。

> **参数注意**：V3 子评论端点使用 `media_id`（而非 `code`），与 V3 评论列表端点 `v3_get_post_comments` 的入参类型不同。`media_id` 可从帖子详情端点 `v3_get_post_info` 的 `$.data.items[].id` 获取。

#### 何时使用 / 不使用
- ✅ 已有 media_id 和 comment_id，需要展开子评论 —— **V3 首选**
- ✅ 从 `v3_get_post_comments` 获取 comment_id 后的下一步
- ❌ 需要获取帖子的一级评论 → 用 `v3_get_post_comments`
- ❌ 只有 code 没有 media_id → 需先调 post.md `v3_shortcode_to_media_id` 转换

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| media_id | string | yes | 纯数字 | 帖子媒体 ID，如 `3829530490739515971` |
| comment_id | string | yes | — | 父评论 ID（从 `v3_get_post_comments` 返回的 `pk` 字段获取），如 `18065937092249736` |
| min_id | string | no | — | 分页游标，从上一次响应的 `next_min_child_cursor` 获取 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.child_comments[].pk | `$.data.child_comments[].pk` | 子评论 ID | post.md v3_translate_comment |
| data.child_comments[].user.pk | `$.data.child_comments[].user.pk` | 子评论者 user_id | user.md 各端点 |
| data.next_min_child_cursor | `$.data.next_min_child_cursor` | 下一页游标 | 同端点 min_id |
| data.has_more_tail_child_comments | `$.data.has_more_tail_child_comments` | 是否有更多子评论 | 决定是否翻页 |
| data.num_tail_child_comments | `$.data.num_tail_child_comments` | 子评论总数 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 评论不存在或 media_id 无效 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 v2_fetch_comment_replies（需 code_or_url）或 v1_fetch_comment_replies（需 media_id） |
