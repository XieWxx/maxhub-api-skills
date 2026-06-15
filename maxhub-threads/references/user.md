# Threads User / Threads 用户

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
用户信息、帖子列表、转发列表、回复列表 —— 围绕"用户"的全部读取入口。**username 与 user_id 多在本文件首步产出**，是其他链式调用的常见起点。

## 端点索引 (Endpoint Index)

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| fetch_user_info | ⭐⭐⭐ 首选 | 用 username 取用户信息（**链式起点，产出 user_id**） | GET | /api/v1/threads/web/fetch_user_info | low |
| fetch_user_info_by_id | ⭐⭐ 条件 | 用 user_id 取用户信息（仅当已有 user_id 时用） | GET | /api/v1/threads/web/fetch_user_info_by_id | low |
| fetch_user_posts | ⭐⭐⭐ 首选 | 用 user_id 取用户帖子列表 | GET | /api/v1/threads/web/fetch_user_posts | low |
| fetch_user_reposts | ⭐⭐ 条件 | 用 user_id 取用户转发列表（仅当用户明确要"转发"时用） | GET | /api/v1/threads/web/fetch_user_reposts | low |
| fetch_user_replies | ⭐⭐ 条件 | 用 user_id 取用户回复列表（仅当用户明确要"回复"时用） | GET | /api/v1/threads/web/fetch_user_replies | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 用户名→用户信息+帖子 | fetch_user_info → fetch_user_posts | `$.data.pk` → `user_id` | 第 1 步失败：STOP；第 2 步失败：返回用户信息 + "帖子列表暂不可取" |
| 用户名→用户信息+转发 | fetch_user_info → fetch_user_reposts | `$.data.pk` → `user_id` | 第 2 步失败：返回用户信息 + "转发列表暂不可取" |
| 用户名→用户信息+回复 | fetch_user_info → fetch_user_replies | `$.data.pk` → `user_id` | 第 2 步失败：返回用户信息 + "回复列表暂不可取" |
| 用户名→全部内容 | fetch_user_info → fetch_user_posts + fetch_user_reposts + fetch_user_replies（可并行） | user_id 复用 | 任一失败：返回其他数据 + 告知缺失 |
| 搜索用户→用户信息 | search_profiles（content.md）→ fetch_user_info | `$.data.users[].username` → `username` | 跨文件链路 |
| 用户帖子→帖子详情 | fetch_user_posts → content.md 的 fetch_post_detail | `$.data.threads[].id` → `post_id` | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`content.md` 的 `search_profiles` 输出 `$.data.users[].username` → 本文件 `fetch_user_info`
- **流入本文件**：`content.md` 的 `fetch_post_detail` / `fetch_post_detail_v2` 输出 `$.data.user.pk` → 本文件 `fetch_user_info_by_id`
- **流入本文件**：`content.md` 的 `fetch_post_comments` 输出 `$.data.comments[].user.pk` → 本文件
- **流出本文件**：`fetch_user_posts` 输出 `$.data.threads[].id` → `content.md` 的 `fetch_post_detail` / `fetch_post_comments`

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- **第 2 步：自检通过后**才能 STOP 并报告"资源不存在"
- **禁止**：❌ 改路径段 ❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改 user_id 重试
- **替换**：参考 `param-mappings.md` 的"端点替换矩阵"

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP
- **禁止**：❌ 切换端点 ❌ 凭空加参数

### 鉴权错误（401）
- **子场景**：API 令牌无效 / 缺失 / 过期 / 未激活 / 用户不存在
- **行动**：**STOP**，提示用户检查或更换 API Key（https://www.aconfig.cn/console）

### 余额 / 付费（402）
- **子场景**：余额不足（允许免费额度 / 不接受免费额度）
- **行动**：**STOP**，告知用户充值（https://www.aconfig.cn/billing）

### 权限错误（403）
- **子场景**：缺少路由访问权限 / 账户已禁用 / 邮箱未验证 / API Token 权限不足
- **行动**：**STOP**，按子场景告知用户处理

### 限流（429）
- **行动**：读 `Retry-After` 头退避；无该头时按指数退避 + jitter；最多重试 2 次

### 上游故障（500/502/503/504）
- **行动**：等 3 秒重试 1 次 → 仍失败走端点级"降级/替换"

### 网络超时 / DNS
- **行动**：**STOP**，向用户报告

### 业务错误（HTTP 200 且 `code != 0`）
- **行动**：读 `message_zh`/`message`；不要把 `data` 当作有效数据；不要重试

---

## 端点详情

### fetch_user_info — 获取用户信息

**Full path:** `/api/v1/threads/web/fetch_user_info`
**Method:** GET · **Risk:** low

#### 用途
用 username 获取 Threads 用户信息。**链式起点**——产出 `user_id`（pk）供后续 user 系端点使用。

#### 何时使用 / 不使用
- ✅ 用户给出 Threads 用户名（如 `lilbieber`）
- ✅ 链式起点：username → user_id
- ❌ 已有 user_id → 直接 fetch_user_info_by_id
- ❌ 想搜索用户 → 用 content.md 的 search_profiles

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| username | string | yes | — | Threads 用户名（URL slug），如 `lilbieber` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| pk | `$.data.pk` | 用户 ID（纯数字） | fetch_user_info_by_id / fetch_user_posts / fetch_user_reposts / fetch_user_replies |
| username | `$.data.username` | 用户名（回显） | 用于核对身份 |
| full_name | `$.data.full_name` | 全名 | 仅展示 |
| biography | `$.data.biography` | 个人简介 | 仅展示 |
| follower_count | `$.data.follower_count` | 粉丝数 | 仅展示 |
| is_verified | `$.data.is_verified` | 是否认证 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级 search_profiles（字段较少） |

---

### fetch_user_info_by_id — 根据用户 ID 获取用户信息

**Full path:** `/api/v1/threads/web/fetch_user_info_by_id`
**Method:** GET · **Risk:** low

#### 用途
用 user_id 获取 Threads 用户信息。当已有 user_id 但不知 username 时使用。

#### 何时使用 / 不使用
- ✅ 已有 user_id（纯数字，如 `67027868801`）
- ✅ 从帖子/评论中取得作者 pk 后查询作者信息
- ❌ 已有 username → 直接 fetch_user_info（更直观）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | 纯数字 | 用户 ID，如 `67027868801` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| pk | `$.data.pk` | 用户 ID（回显） | fetch_user_posts / fetch_user_reposts / fetch_user_replies |
| username | `$.data.username` | 用户名 | fetch_user_info（如需重新查询） |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_user_posts — 获取用户帖子列表

**Full path:** `/api/v1/threads/web/fetch_user_posts`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的帖子列表（含分页 cursor）。是 `content.md` 的常见上游，产出 post_id。

#### 何时使用 / 不使用
- ✅ 已知 user_id，想看其帖子
- ✅ 链式产出 post_id 给 `content.md`
- ❌ 想看用户转发 → fetch_user_reposts
- ❌ 想看用户回复 → fetch_user_replies

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | 纯数字 | 用户 ID，如 `63625256886` |
| end_cursor | string | no | — | 分页游标，首次请求留空 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| threads[].id | `$.data.threads[].id` | 帖子 ID | content.md 的 fetch_post_detail / fetch_post_comments |
| next_cursor | `$.data.next_cursor` | 下一页游标 | 同端点翻页 |
| has_more | `$.data.has_more` | 是否还有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |
| 空数据 | 该用户暂无帖子 | 返回"暂无帖子" | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_user_reposts — 获取用户转发列表

**Full path:** `/api/v1/threads/web/fetch_user_reposts`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的转发帖子列表（含分页 cursor）。

#### 何时使用 / 不使用
- ✅ 已知 user_id，想看其转发的帖子
- ❌ 想看用户原创帖子 → fetch_user_posts
- ❌ 想看用户回复 → fetch_user_replies

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | 纯数字 | 用户 ID |
| end_cursor | string | no | — | 分页游标，首次请求留空 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| threads[].id | `$.data.threads[].id` | 帖子 ID | content.md |
| next_cursor | `$.data.next_cursor` | 下一页游标 | 同端点翻页 |
| has_more | `$.data.has_more` | 是否还有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |
| 空数据 | 该用户暂无转发 | 返回"暂无转发" | 0 | — |

---

### fetch_user_replies — 获取用户回复列表

**Full path:** `/api/v1/threads/web/fetch_user_replies`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的回复列表（含分页 cursor）。

#### 何时使用 / 不使用
- ✅ 已知 user_id，想看其回复
- ❌ 想看用户原创帖子 → fetch_user_posts
- ❌ 想看用户转发 → fetch_user_reposts

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | 纯数字 | 用户 ID |
| end_cursor | string | no | — | 分页游标，首次请求留空 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| threads[].id | `$.data.threads[].id` | 回复帖子 ID | content.md |
| next_cursor | `$.data.next_cursor` | 下一页游标 | 同端点翻页 |
| has_more | `$.data.has_more` | 是否还有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |
| 空数据 | 该用户暂无回复 | 返回"暂无回复" | 0 | — |
