# Sora2 Users / Sora2 用户

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
用户资料、用户作品、关注/粉丝、Cameo 出镜、用户搜索 —— 围绕"用户"的全部读取入口。**user_id 多在本文件首步产出**（search_users 是已知用户名时的链式入口）。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| search_users | ⭐⭐⭐ 首选 | 用 username 搜索用户（**用户名→user_id 入口**） | GET | /api/v1/sora2/search_users | low |
| get_user_profile | ⭐⭐⭐ 首选 | 用 user_id 取用户完整资料 | GET | /api/v1/sora2/get_user_profile | low |
| get_user_posts | ⭐⭐⭐ 首选 | 用 user_id 取该用户作品列表 | GET | /api/v1/sora2/get_user_posts | low |
| get_user_following | ⭐⭐ 条件 | 用 user_id 取关注列表（仅用户明确要"关注的人"时用） | GET | /api/v1/sora2/get_user_following | low |
| get_user_followers | ⭐⭐ 条件 | 用 user_id 取粉丝列表（仅用户明确要"粉丝"时用） | GET | /api/v1/sora2/get_user_followers | low |
| get_user_cameo_appearances | ⭐⭐ 条件 | 用 user_id 取 Cameo 出镜记录（仅用户明确提及"Cameo/出镜"时用） | GET | /api/v1/sora2/get_user_cameo_appearances | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看用户资料 + 作品 | get_user_profile → get_user_posts | `$.data.user_id` → `user_id`（user_id 直接复用） | 第 1 步失败：可改用 search_users 取候选；第 2 步失败：返回资料 + "作品列表暂不可取" |
| 用户名 → 用户主页 | search_users → get_user_profile | `$.data.users[0].user_id` → `user_id` | 第 1 步空：STOP，告知用户名未命中 |
| 用户名 → 用户作品 | search_users → get_user_profile（验证）→ get_user_posts | user_id 接力 | 中间步失败：返回截止数据 |
| 看用户社交圈 | get_user_profile → get_user_followers + get_user_following（可并行） | user_id 复用 | 任一失败：返回另一份 + 告知缺失 |
| 看用户 Cameo 出镜 | get_user_profile → get_user_cameo_appearances | user_id 复用 | 第 2 步空：返回资料 + "无 Cameo 出镜记录" |
| 用户作品 → 作品详情 | get_user_posts → 跳到 `post.md` 的 get_post_detail | `$.data.posts[].post_id` → `post_id` | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`post.md` 的 `get_post_detail` 输出 `$.data.author.user_id` → 本文件全部 user 系端点的 `user_id`
- **流入本文件**：`post.md` 的 `get_post_comments` 输出 `$.data.comments[].user.user_id` → 本文件
- **流入本文件**：`tools.md` 的 `get_cameo_leaderboard` 输出 `$.data.leaderboard[].user_id` → 本文件
- **流出本文件**：`get_user_posts` 的 `$.data.posts[].post_id` → `post.md` 多端点

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

### search_users — 搜索用户

**Full path:** `/api/v1/sora2/search_users`
**Method:** GET · **Risk:** low

#### 用途
按用户名（username）搜索 Sora2 用户。**已知用户名时的链式入口**——把 username 转换为 user_id，供后续 user 系端点使用。

#### 何时使用 / 不使用
- ✅ 用户给出用户名（昵称）但未提供 user_id
- ✅ 链式起点：username → user_id
- ❌ 已知 user_id（形如 user-xxx）→ 直接 get_user_profile
- ❌ 想搜作品/评论 → 本端点不做内容搜索

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| username | string | yes | — | 搜索关键词（用户名） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| users[].user_id | `$.data.users[].user_id` | 命中用户 ID | 本文件全部 user 系端点 |
| users[].username | `$.data.users[].username` | 用户名 | 用于核对身份避免误命中 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空结果 | 用户名未命中 | STOP，告知用户未找到 | 0 | — |
| 多结果 | 重名 | 让用户选择或返回前 N 个候选 | 0 | — |

---

### get_user_profile — 获取用户资料

**Full path:** `/api/v1/sora2/get_user_profile`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的完整资料（用户名、头像、个人简介、统计数据等）。**user 系链式调用的常见验证步**。

#### 何时使用 / 不使用
- ✅ 已知 user_id，想看用户主页信息
- ✅ 链式中验证 user_id 是否有效
- ❌ 想看用户作品 → get_user_posts（不要先调本端点再调 posts）
- ❌ 只有 username → 先 search_users

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | startsWith=`user-` | 用户 ID（形如 `user-xxx`） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user_id | `$.data.user_id` | 用户 ID（回显） | 复用 |
| username | `$.data.username` | 用户名 | 仅展示 |
| stats.followers_count | `$.data.stats.followers_count` | 粉丝数 | 用于决定是否调用 get_user_followers |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在/已注销 | STOP | 0 | **降级**：search_users 取候选（如有 username 上下文） |

---

### get_user_posts — 获取用户作品

**Full path:** `/api/v1/sora2/get_user_posts`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的作品列表（含分页 cursor）。是 `post.md` 的常见上游产出 post_id 的端点。

#### 何时使用 / 不使用
- ✅ 已知 user_id，想看其作品
- ✅ 链式产出 post_id 给 `post.md`
- ❌ 想看用户资料本身 → get_user_profile

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | startsWith=`user-` | 用户 ID |
| cursor | string | no | — | 分页游标 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| posts[].post_id | `$.data.posts[].post_id` | 作品 ID | post.md 多端点 |
| cursor | `$.data.cursor` | 下一页游标 | 同端点翻页 |
| has_more | `$.data.has_more` | 是否还有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |
| 空数据 | 该用户暂无作品 | 返回"暂无作品" | 0 | — |

---

### get_user_following — 获取关注列表

**Full path:** `/api/v1/sora2/get_user_following`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户关注的人列表（含分页 cursor）。

#### 何时使用 / 不使用
- ✅ 已知 user_id，想看 ta 关注了谁
- ❌ 想看 ta 的粉丝 → get_user_followers
- ❌ 隐私限制：部分用户的关注列表可能被隐藏（业务 code≠0）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | startsWith=`user-` | 用户 ID |
| cursor | string | no | — | 分页游标 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| following[].user_id | `$.data.following[].user_id` | 被关注用户 ID | 本文件 user 系端点 |
| cursor | `$.data.cursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 业务 code≠0 | 隐私设置不可见 | 告知用户该列表不可查看 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### get_user_followers — 获取粉丝列表

**Full path:** `/api/v1/sora2/get_user_followers`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的粉丝列表（含分页 cursor）。

#### 何时使用 / 不使用
- ✅ 已知 user_id，想看 ta 的粉丝
- ❌ 想看 ta 关注了谁 → get_user_following

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | startsWith=`user-` | 用户 ID |
| cursor | string | no | — | 分页游标 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| followers[].user_id | `$.data.followers[].user_id` | 粉丝用户 ID | 本文件 user 系端点 |
| cursor | `$.data.cursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 业务 code≠0 | 隐私设置不可见 | 告知用户该列表不可查看 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### get_user_cameo_appearances — 获取用户 Cameo 出镜

**Full path:** `/api/v1/sora2/get_user_cameo_appearances`
**Method:** GET · **Risk:** low

#### 用途
获取该用户在他人作品中的 Cameo（出镜秀）记录列表（含分页 cursor）。

#### 何时使用 / 不使用
- ✅ 用户问"这个人出现在哪些作品里"
- ❌ 想看 ta 自己发布的作品 → get_user_posts
- ❌ 想看 Cameo 全平台热榜 → tools.md 的 get_cameo_leaderboard

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | startsWith=`user-` | 用户 ID |
| cursor | string | no | — | 分页游标 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| appearances[].post_id | `$.data.appearances[].post_id` | Cameo 出镜的作品 ID | post.md |
| cursor | `$.data.cursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空数据 | 该用户暂无 Cameo 出镜 | 返回"无出镜记录" | 0 | — |
