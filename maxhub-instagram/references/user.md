# Instagram User Profile & Relations / Instagram 用户与关系

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
用户信息、帖子列表、Reels、Stories、Highlights、粉丝/关注列表、相关推荐、About 信息、曾用名 —— 围绕"用户"的全部读取入口。**user_id 与 username 多在本文件首步产出**（搜索/ID转换是已知用户名时的链式入口）。

## 端点索引 (Endpoint Index)

### V1 端点
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| v1_user_id_to_username | ⭐⭐ 条件 | 用 user_id 取用户基本信息 | GET | /api/v1/instagram/v1/user_id_to_username | low |
| v1_fetch_user_info_by_username | ⭐⭐⭐ 首选 | 用 username 取用户数据 | GET | /api/v1/instagram/v1/fetch_user_info_by_username | low |
| v1_fetch_user_info_by_username_v2 | ⭐⭐ 条件 | 用 username 取用户数据 V2（含最近帖子） | GET | /api/v1/instagram/v1/fetch_user_info_by_username_v2 | low |
| v1_fetch_user_info_by_username_v3 | ⭐⭐ 条件 | 用 username 取用户数据 V3（含高清头像） | GET | /api/v1/instagram/v1/fetch_user_info_by_username_v3 | low |
| v1_fetch_user_info_by_id | ⭐⭐ 条件 | 用 user_id 取用户数据 | GET | /api/v1/instagram/v1/fetch_user_info_by_id | low |
| v1_fetch_user_info_by_id_v2 | ⭐⭐ 条件 | 用 user_id 取用户数据 V2（含 bio_links） | GET | /api/v1/instagram/v1/fetch_user_info_by_id_v2 | low |
| v1_fetch_user_about_info | ⭐⭐ 条件 | 用 user_id 取用户 About 信息 | GET | /api/v1/instagram/v1/fetch_user_about_info | low |
| v1_fetch_user_posts | ⭐⭐ 条件 | 用 user_id 取用户帖子列表 | GET | /api/v1/instagram/v1/fetch_user_posts | low |
| v1_fetch_user_posts_v2 | ⭐⭐ 条件 | 用 user_id 取用户帖子列表 V2（GraphQL） | GET | /api/v1/instagram/v1/fetch_user_posts_v2 | low |
| v1_fetch_user_reels | ⭐⭐ 条件 | 用 user_id 取用户 Reels 列表 | GET | /api/v1/instagram/v1/fetch_user_reels | low |
| v1_fetch_user_reposts | ⭐⭐ 条件 | 用 user_id 取用户转发列表 | GET | /api/v1/instagram/v1/fetch_user_reposts | low |
| v1_fetch_user_tagged_posts | ⭐⭐ 条件 | 用 user_id 取被标记帖子 | GET | /api/v1/instagram/v1/fetch_user_tagged_posts | low |
| v1_fetch_related_profiles | ⭐⭐ 条件 | 用 user_id 取相关用户推荐 | GET | /api/v1/instagram/v1/fetch_related_profiles | low |

### V2 端点
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| v2_user_id_to_username | ⭐⭐ 条件 | 用 user_id 取用户基本信息 | GET | /api/v1/instagram/v2/user_id_to_username | low |
| v2_fetch_user_info | ⭐⭐⭐ 首选 | 用 username 或 user_id 取用户信息 | GET | /api/v1/instagram/v2/fetch_user_info | low |
| v2_fetch_user_posts | ⭐⭐⭐ 首选 | 用 username/user_id 取用户帖子 | GET | /api/v1/instagram/v2/fetch_user_posts | low |
| v2_fetch_user_reels | ⭐⭐⭐ 首选 | 用 username/user_id 取用户 Reels | GET | /api/v1/instagram/v2/fetch_user_reels | low |
| v2_fetch_user_followers | ⭐⭐ 条件 | 用 username/user_id 取粉丝列表 | GET | /api/v1/instagram/v2/fetch_user_followers | low |
| v2_fetch_user_following | ⭐⭐ 条件 | 用 username/user_id 取关注列表 | GET | /api/v1/instagram/v2/fetch_user_following | low |
| v2_fetch_user_stories | ⭐⭐ 条件 | 用 username/user_id 取用户 Stories | GET | /api/v1/instagram/v2/fetch_user_stories | low |
| v2_fetch_user_highlights | ⭐⭐ 条件 | 用 username/user_id 取用户精选 | GET | /api/v1/instagram/v2/fetch_user_highlights | low |
| v2_fetch_highlight_stories | ⭐⭐ 条件 | 用 highlight_id 取精选故事详情 | GET | /api/v1/instagram/v2/fetch_highlight_stories | low |
| v2_fetch_user_tagged_posts | ⭐⭐ 条件 | 用 username/user_id 取被标记帖子 | GET | /api/v1/instagram/v2/fetch_user_tagged_posts | low |
| v2_fetch_similar_users | ⭐⭐ 条件 | 用 username/user_id 取相似用户 | GET | /api/v1/instagram/v2/fetch_similar_users | low |

### V3 端点
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| v3_get_user_id_by_username | ⭐⭐⭐ 首选 | 用 username 取 user_id（**username→user_id 入口**） | GET | /api/v1/instagram/v3/get_user_id_by_username | low |
| v3_get_user_profile | ⭐⭐⭐ 首选 | 用 user_id/username 取用户资料 | GET | /api/v1/instagram/v3/get_user_profile | low |
| v3_get_user_brief | ⭐⭐ 条件 | 用 user_id+username 取用户短详情（更快） | GET | /api/v1/instagram/v3/get_user_brief | low |
| v3_get_user_posts | ⭐⭐⭐ 首选 | 用 username 取用户帖子列表 | GET | /api/v1/instagram/v3/get_user_posts | low |
| v3_get_user_tagged_posts | ⭐⭐ 条件 | 用 user_id/username 取被标记帖子 | GET | /api/v1/instagram/v3/get_user_tagged_posts | low |
| v3_get_user_reels | ⭐⭐⭐ 首选 | 用 user_id/username 取用户 Reels | GET | /api/v1/instagram/v3/get_user_reels | low |
| v3_get_user_highlights | ⭐⭐ 条件 | 用 user_id/username 取用户精选 | GET | /api/v1/instagram/v3/get_user_highlights | low |
| v3_get_highlight_stories | ⭐⭐ 条件 | 用 highlight_id 取精选故事详情 | GET | /api/v1/instagram/v3/get_highlight_stories | low |
| v3_get_user_about | ⭐⭐ 条件 | 用 user_id/username 取账户简介 | GET | /api/v1/instagram/v3/get_user_about | low |
| v3_get_user_former_usernames | ⭐ 条件 | 用 user_id/username 取曾用名 | GET | /api/v1/instagram/v3/get_user_former_usernames | low |
| v3_get_user_stories | ⭐⭐ 条件 | 用 user_id/username 取用户 Stories | GET | /api/v1/instagram/v3/get_user_stories | low |
| v3_get_user_following | ⭐⭐ 条件 | 用 user_id/username 取关注列表 | GET | /api/v1/instagram/v3/get_user_following | low |
| v3_get_user_followers | ⭐⭐ 条件 | 用 user_id/username 取粉丝列表 | GET | /api/v1/instagram/v3/get_user_followers | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 用户名 → 用户资料 | v3_get_user_id_by_username → v3_get_user_profile | `$.data.user_id` → `user_id` | 第 1 步空：STOP，告知用户名未命中 |
| 用户名 → 用户帖子 | v3_get_user_id_by_username → v3_get_user_posts | `$.data.user_id` → username 复用 | 第 1 步失败：STOP |
| 用户资料 + 帖子 | v3_get_user_profile → v3_get_user_posts | username 复用 | 第 1 步失败：降级到搜索；第 2 步失败：返回资料 + "帖子暂不可取" |
| 用户资料 + 关注/粉丝 | v3_get_user_profile → v3_get_user_followers + v3_get_user_following（可并行） | user_id 复用 | 任一失败：返回另一份 + 告知缺失 |
| 用户精选 → 精选故事 | v3_get_user_highlights → v3_get_highlight_stories | `$.data.edges[].node.id` → `highlight_id`（加 `highlight:` 前缀） | 第 1 步空：返回"无精选" |
| 用户帖子 → 帖子详情 | v3_get_user_posts → post.md v3_get_post_info | `$.data.edges[].node.code` → `code` | 跨文件链路 |
| 用户 Reels → 帖子详情 | v3_get_user_reels → post.md v3_get_post_info | `$.data.edges[].node.media.code` → `code` | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`post.md` 的帖子详情输出 `$.data.items[].user.id` → 本文件 user 系端点的 `user_id`
- **流入本文件**：`comments.md` 的评论输出 `$.data.comments[].user.pk` → 本文件
- **流入本文件**：`search.md` 的搜索输出用户列表 → 本文件
- **流出本文件**：`v3_get_user_posts` / `v2_fetch_user_posts` 的帖子列表 → `post.md` 帖子详情端点
- **流出本文件**：`v3_get_user_highlights` 的精选 ID → 本文件 `v3_get_highlight_stories`

## 错误处理契约 (Error Contract · 本文件全端点共享)

> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- 必须先做防臆造自检（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- 禁止：❌ 改路径段 ❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改 user_id 重试

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- 必须先做防臆造自检（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
- **特别注意**：V2 多个端点支持 `oneOf(username, user_id)`，至少传一个；V3 的 `v3_get_user_brief` 要求两个都传

### 鉴权错误（401）→ STOP
### 余额 / 付费（402）→ STOP
### 权限错误（403）→ STOP
### 限流（429）→ 退避重试 ≤2 次
### 上游故障（500/502/503/504）→ 等 3s 重试 1 次 → 走端点替换矩阵
### 网络超时 → STOP
### 业务错误（HTTP 200 且 `code != 0`）→ 读 `message_zh`，不重试

---

## 端点详情

### v3_get_user_id_by_username — 通过用户名获取用户 ID

**Full path:** `/api/v1/instagram/v3/get_user_id_by_username`
**Method:** GET · **Risk:** low

#### 用途
将 username 转换为 user_id。**已知用户名时的链式入口**——把 username 转换为 user_id，供后续 user 系端点使用。

#### 何时使用 / 不使用
- ✅ 用户给出用户名但未提供 user_id
- ✅ 链式起点：username → user_id
- ❌ 已知 user_id → 直接 `v3_get_user_profile`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| username | string | yes | — | 用户名，如 `liensue.talks` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.user_id | `$.data.user_id` | 用户 ID | 本文件全部 user 系端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户名不存在 | STOP | 0 | 降级到 search.md v3_search_users |

---

### v3_get_user_profile — 获取用户资料

**Full path:** `/api/v1/instagram/v3/get_user_profile`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的完整资料。**V3 推荐首选端点**。

#### 何时使用 / 不使用
- ✅ 已知 user_id 或 username，想看用户主页信息
- ❌ 只需要 user_id → 用 `v3_get_user_id_by_username`
- ❌ 需要更快响应 → 用 `v3_get_user_brief`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | oneOf(user_id, username) | 纯数字 | 用户 ID |
| username | string | oneOf(user_id, username) | — | 用户名 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.user.id | `$.data.user.id` | 用户 ID | 本文件 user 系端点 |
| data.user.username | `$.data.user.username` | 用户名 | 核对身份 |
| data.user.edge_followed_by.count | 粉丝数 | 统计 | 决定是否调 followers |
| data.user.edge_owner_to_timeline_media.count | 帖子数 | 统计 | 决定是否调 posts |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | 降级到 v2_fetch_user_info |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 v2_fetch_user_info |

---

### v3_get_user_brief — 获取用户短详情

**Full path:** `/api/v1/instagram/v3/get_user_brief`
**Method:** GET · **Risk:** low

#### 用途
获取用户核心信息，响应速度比 `v3_get_user_profile` 更快。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | 纯数字 | 用户 ID |
| username | string | yes | — | 用户名 |

> **注意**：此端点 user_id 和 username 都为必填。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.id | `$.data.id` | 用户 ID | 本文件 user 系端点 |

---

### v3_get_user_posts — 获取用户帖子列表

**Full path:** `/api/v1/instagram/v3/get_user_posts`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的帖子列表（含分页）。是 `post.md` 的常见上游产出帖子数据的端点。

#### 何时使用 / 不使用
- ✅ 已知 username，想看其帖子
- ✅ 链式产出帖子数据给 `post.md`
- ❌ 想看用户资料本身 → `v3_get_user_profile`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| username | string | yes | 不含 @ | Instagram 用户名 |
| first | integer | no | — | 向后翻页时每页数量 (default: 12) |
| after | string | no | — | 向后翻页游标（end_cursor） |
| before | string | no | — | 向前翻页游标（start_cursor） |
| last | integer | no | — | 向前翻页时每页数量 |
| count | integer | no | — | 首次请求数量 (default: 12) |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.edges[].node.code | 帖子 shortcode | 帖子短代码 | post.md v3_get_post_info_by_code |
| data.edges[].node.id | 帖子 media_id | 帖子 ID | post.md v3_get_post_info |
| data.page_info.end_cursor | 下一页游标 | 翻页用 | 同端点 after |
| data.page_info.has_next_page | 是否有下一页 | 翻页终止条件 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |
| 空数据 | 该用户暂无帖子 | 返回"暂无帖子" | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 v2_fetch_user_posts |

---

### v3_get_user_reels — 获取用户 Reels 列表

**Full path:** `/api/v1/instagram/v3/get_user_reels`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的 Reels 列表（含分页）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | oneOf(user_id, username) | 纯数字 | 用户 ID |
| username | string | oneOf(user_id, username) | — | 用户名 |
| first | integer | no | — | 每页数量 (default: 12) |
| after | string | no | — | 向后翻页游标 |
| before | string | no | — | 向前翻页游标 |
| last | integer | no | — | 向前翻页时每页数量 |
| page_size | integer | no | — | 每页视频数量 (default: 12) |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.edges[].node.media.code | Reels shortcode | 帖子短代码 | post.md |
| data.edges[].node.pk | Reels media_id | 帖子 ID | post.md |
| data.page_info.end_cursor | 下一页游标 | 翻页用 | 同端点 after |

---

### v3_get_user_highlights — 获取用户精选 Highlights 列表

**Full path:** `/api/v1/instagram/v3/get_user_highlights`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的精选 Highlights 列表。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | oneOf(user_id, username) | — | 用户 ID |
| username | string | oneOf(user_id, username) | — | 用户名 |
| first | integer | no | — | 每页数量 (default: 10) |
| after | string | no | — | 向后翻页游标 |
| before | string | no | — | 向前翻页游标 |
| last | integer | no | — | 向前翻页时每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.edges[].node.id | 精选 ID | highlight_id（需加 `highlight:` 前缀） | v3_get_highlight_stories |
| data.edges[].node.title | 精选标题 | 仅展示 | — |
| data.edges[].node.media_count | 精选内容数 | 统计 | — |

---

### v3_get_highlight_stories — 获取 Highlight 精选详情

**Full path:** `/api/v1/instagram/v3/get_highlight_stories`
**Method:** GET · **Risk:** low

#### 用途
获取指定精选的故事详情（含图片/视频 URL）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| highlight_id | string | yes | 格式: `highlight:xxx` | 精选 ID，如 `highlight:18064916456320419` |
| reel_ids | string | no | 逗号分隔 | 精选 ID 列表 |
| first | integer | no | — | 每页数量 (default: 3) |
| last | integer | no | — | 获取最后 N 条 (default: 2) |

> **注意**：highlight_id 格式必须为 `highlight:xxx`，从 `v3_get_user_highlights` 获取的 ID 需加 `highlight:` 前缀。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.story_highlight_tray | 精选故事集合 | 含 items 列表 | 直接交付用户 |

---

### v3_get_user_stories — 获取用户 Stories（快拍）

**Full path:** `/api/v1/instagram/v3/get_user_stories`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的 Stories（快拍）。Stories 有 24 小时有效期。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | oneOf(user_id, username) | — | 用户 ID |
| username | string | oneOf(user_id, username) | — | 用户名 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.reels_media | Stories 列表 | 按用户分组 | 直接交付用户 |

---

### v3_get_user_following — 获取用户关注列表

**Full path:** `/api/v1/instagram/v3/get_user_following`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的关注列表（含分页）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | oneOf(user_id, username) | — | 用户 ID |
| username | string | oneOf(user_id, username) | — | 用户名 |
| count | integer | no | — | 每次获取数量 (default: 12) |
| max_id | string | no | — | 分页游标，从 next_max_id 获取 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.users[].pk | 关注用户 ID | user_id | 本文件 user 系端点 |
| data.next_max_id | 下一页游标 | 翻页用 | 同端点 max_id |

---

### v3_get_user_followers — 获取用户粉丝列表

**Full path:** `/api/v1/instagram/v3/get_user_followers`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的粉丝列表（含分页）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | oneOf(user_id, username) | — | 用户 ID |
| username | string | oneOf(user_id, username) | — | 用户名 |
| count | integer | no | — | 每次获取数量 (default: 12) |
| max_id | string | no | — | 分页游标，从 next_max_id 获取 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.users[].pk | 粉丝用户 ID | user_id | 本文件 user 系端点 |
| data.next_max_id | 下一页游标 | 翻页用 | 同端点 max_id |

---

### v3_get_user_about — 获取用户账户简介

**Full path:** `/api/v1/instagram/v3/get_user_about`
**Method:** GET · **Risk:** low

#### 用途
获取用户账户创建日期、所在地区、曾用名历史等信息。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | oneOf(user_id, username) | — | 用户 ID |
| username | string | oneOf(user_id, username) | — | 用户名 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| date_joined | 账户创建日期 | 仅展示 | — |
| account_based_in | 账户所在地区 | 仅展示 | — |

---

### v3_get_user_former_usernames — 获取用户曾用用户名

**Full path:** `/api/v1/instagram/v3/get_user_former_usernames`
**Method:** GET · **Risk:** low

#### 用途
获取用户曾用用户名列表及更改时间。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | oneOf(user_id, username) | — | 用户 ID |
| username | string | oneOf(user_id, username) | — | 用户名 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 曾用名列表 | 响应数据 | 含更改时间 | 直接交付用户 |

---

### v3_get_user_tagged_posts — 获取用户被标记的帖子

**Full path:** `/api/v1/instagram/v3/get_user_tagged_posts`
**Method:** GET · **Risk:** low

#### 用途
获取用户被标记（tagged）的帖子列表。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | oneOf(user_id, username) | — | 用户 ID |
| username | string | oneOf(user_id, username) | — | 用户名 |
| first | integer | no | — | 每页数量 (default: 12) |
| after | string | no | — | 向后翻页游标 |
| before | string | no | — | 向前翻页游标 |
| last | integer | no | — | 向前翻页时每页数量 |
| count | integer | no | — | 首次请求数量 (default: 12) |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.edges[].node.code | 帖子 shortcode | 帖子短代码 | post.md |
| data.edges[].node.id | 帖子 media_id | 帖子 ID | post.md |

---

### V1/V2 端点（降级方案）

> 以下端点作为 V3 的降级方案，详细参数见旧版文档。关键差异：

| V3 首选 | V2 降级 | V1 降级 | 关键差异 |
|---------|---------|---------|---------|
| v3_get_user_profile | v2_fetch_user_info | v1_fetch_user_info_by_username / _by_id | V2 支持 username+user_id；V1 分开两个端点 |
| v3_get_user_posts | v2_fetch_user_posts | v1_fetch_user_posts | V3 必须用 username；V1 仅 user_id |
| v3_get_user_reels | v2_fetch_user_reels | v1_fetch_user_reels | V1 仅 user_id；V2 支持 username/user_id |
| v3_get_user_following | v2_fetch_user_following | — | V2 用 pagination_token；V3 用 max_id |
| v3_get_user_followers | v2_fetch_user_followers | — | 同上 |
| v3_get_user_stories | v2_fetch_user_stories | — | V2 无分页 |
| v3_get_user_highlights | v2_fetch_user_highlights | — | V2 无分页 |
| v3_get_highlight_stories | v2_fetch_highlight_stories | — | V3 highlight_id 需 `highlight:` 前缀 |
| v3_get_user_tagged_posts | v2_fetch_user_tagged_posts | v1_fetch_user_tagged_posts | V1 仅 user_id |
| — | v2_fetch_similar_users | v1_fetch_related_profiles | V3 无直接对应端点 |
| — | — | v1_fetch_user_reposts | 仅 V1 有转发列表 |
| — | — | v1_fetch_user_about_info | V3 有 v3_get_user_about |
