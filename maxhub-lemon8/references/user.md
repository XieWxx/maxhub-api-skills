# Lemon8 User / Lemon8 用户

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
用户信息、粉丝列表、关注列表、用户 ID 提取（单个/批量）。**user_id 多通过 `get_user_id` / `get_user_ids` 从分享链接提取**，是链式调用的入口。

## 端点索引 (Endpoint Index)

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| get_user_id | ⭐⭐⭐ 首选 | 用分享链接取 user_id（**链式入口**） | GET | /api/v1/lemon8/app/get_user_id | low |
| get_user_ids | ⭐⭐ 条件 | 用分享链接批量取 user_id（最多 10 个） | POST | /api/v1/lemon8/app/get_user_ids | low |
| fetch_user_profile | ⭐⭐⭐ 首选 | 用 user_id 取用户信息（**链式终点**） | GET | /api/v1/lemon8/app/fetch_user_profile | low |
| fetch_user_follower_list | ⭐⭐ 条件 | 用 user_id 取粉丝列表 | GET | /api/v1/lemon8/app/fetch_user_follower_list | low |
| fetch_user_following_list | ⭐⭐ 条件 | 用 user_id 取关注列表 | GET | /api/v1/lemon8/app/fetch_user_following_list | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 分享链接→用户信息 | get_user_id → fetch_user_profile | `$.data.user_id` → `user_id` | 第 1 步失败：STOP；第 2 步失败：返回 user_id |
| 分享链接→用户信息+粉丝 | get_user_id → fetch_user_profile + fetch_user_follower_list（可并行） | user_id 复用 | 任一失败：返回其他数据 + 告知缺失 |
| 分享链接→用户信息+关注 | get_user_id → fetch_user_profile + fetch_user_following_list（可并行） | user_id 复用 | 任一失败：返回其他数据 + 告知缺失 |
| 批量链接→批量用户信息 | get_user_ids → fetch_user_profile × N | `$.data.user_ids[]` → `user_id` | 单个失败：返回其他成功数据 |
| 搜索用户→用户信息 | fetch_search（content.md, search_tab=user）→ fetch_user_profile | `$.data.users[].user_id` → `user_id` | 跨文件链路 |
| 帖子→作者信息 | fetch_post_detail（content.md）→ fetch_user_profile | `$.data.author_id` → `user_id` | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`content.md` 的 `fetch_search`（search_tab=user）输出 `$.data.users[].user_id` → 本文件
- **流入本文件**：`content.md` 的 `fetch_post_detail` 输出 `$.data.author_id` → 本文件
- **流出本文件**：`fetch_user_follower_list` / `fetch_user_following_list` 输出粉丝/关注的 `user_id` → 本文件 `fetch_user_profile`

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- **第 2 步：自检通过后**才能 STOP 并报告"资源不存在"
- **禁止**：❌ 改路径段 ❌ 把 app 改成 web ❌ 拼接新路径

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
- **特别注意**：POST 端点 `get_user_ids` 的 body 参数 `share_texts` 必须使用 JSON 序列化
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP

### 鉴权 / 余额 / 权限 / 限流 / 上游故障 / 网络超时 / 业务错误
- 通用处理见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)

---

## 端点详情

### get_user_id — 通过分享链接获取用户 ID

**Full path:** `/api/v1/lemon8/app/get_user_id`
**Method:** GET · **Risk:** low

#### 用途
通过 Lemon8 分享链接提取 user_id。**链式入口**——把分享链接转换为 user_id，供后续 user 系端点使用。

#### 何时使用 / 不使用
- ✅ 用户提供 Lemon8 用户分享链接（长链接或短链接）
- ✅ 链式起点：分享链接 → user_id
- ❌ 已有 user_id → 直接 fetch_user_profile
- ❌ 批量链接 → 用 get_user_ids

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| share_text | string | yes | — | 分享链接，支持长链接和短链接，如 `https://www.lemon8-app.com/lemon8cars?region=us` 或 `https://v.lemon8-app.com/al/OgZrsUppx` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user_id | `$.data.user_id` | 用户 ID | fetch_user_profile / fetch_user_follower_list / fetch_user_following_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 链接无效/已过期 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### get_user_ids — 通过分享链接批量获取用户 ID

**Full path:** `/api/v1/lemon8/app/get_user_ids`
**Method:** POST · **Risk:** low

#### 用途
通过多个 Lemon8 分享链接批量提取 user_id（一次最多 10 个）。

#### 何时使用 / 不使用
- ✅ 用户同时提供多个分享链接
- ❌ 只有一个链接 → 用 get_user_id（更简单）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| share_texts | array | yes | maxItems=10 | 分享链接列表，JSON 序列化 |

> **POST body 格式**：必须使用语言原生 JSON 序列化库，禁止手拼 JSON 字符串。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user_ids | `$.data.user_ids[]` | 用户 ID 列表 | fetch_user_profile × N |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | share_texts 格式错/超 10 个 | 修正后重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级 get_user_id 逐个调用 |

---

### fetch_user_profile — 获取用户信息

**Full path:** `/api/v1/lemon8/app/fetch_user_profile`
**Method:** GET · **Risk:** low

#### 用途
用 user_id 获取 Lemon8 用户信息。**链式终点**——大多数链式调用最终汇聚于此端点。

#### 何时使用 / 不使用
- ✅ 已有 user_id，需取用户资料
- ❌ 只有分享链接 → 先用 get_user_id 提取 user_id

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | 纯数字 | 用户 ID，如 `7217844966059656197` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user_id | `$.data.user_id` | 用户 ID（回显） | 复用 |
| nickname | `$.data.nickname` | 昵称 | 仅展示 |
| follower_count | `$.data.follower_count` | 粉丝数 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级 fetch_search（search_tab=user，字段较少） |

---

### fetch_user_follower_list — 获取粉丝列表

**Full path:** `/api/v1/lemon8/app/fetch_user_follower_list`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的粉丝列表（含分页 cursor）。

#### 何时使用 / 不使用
- ✅ 已知 user_id，想看其粉丝
- ❌ 想看关注列表 → fetch_user_following_list

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | 纯数字 | 用户 ID |
| cursor | string | no | — | 分页游标，首次请求留空 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| followers[].user_id | `$.data.followers[].user_id` | 粉丝用户 ID | fetch_user_profile |
| cursor | `$.data.cursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |
| 空数据 | 该用户暂无粉丝 | 返回"暂无粉丝" | 0 | — |

---

### fetch_user_following_list — 获取关注列表

**Full path:** `/api/v1/lemon8/app/fetch_user_following_list`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的关注列表（含分页 cursor）。

#### 何时使用 / 不使用
- ✅ 已知 user_id，想看其关注的人
- ❌ 想看粉丝列表 → fetch_user_follower_list

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | 纯数字 | 用户 ID |
| cursor | string | no | — | 分页游标，首次请求留空 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| following[].user_id | `$.data.following[].user_id` | 关注用户 ID | fetch_user_profile |
| cursor | `$.data.cursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |
| 空数据 | 该用户暂无关注 | 返回"暂无关注" | 0 | — |
