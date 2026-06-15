# Kuaishou User / 快手 用户

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
用户信息、视频列表、热门作品、收藏作品、用户 ID 提取 —— 围绕"用户"的全部读取入口。含 App 和 Web 双端。**user_id 多在本文件首步产出**（app_fetch_one_user_v2 是已知 user_id 时的链式入口，web_fetch_get_user_id 是已知分享链接时的入口）。

> **重要提示：快手用户 ID 存在两种格式**
> - **eid**：短字符串格式，如 `3xz63mn6fngqtiq`，从用户主页链接中提取
> - **纯数字 userId**：如 `228905802`，从 API 响应中获取
> - 部分端点仅支持其中一种格式，必须按端点 IN 表的 constraints 传参

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| app_fetch_one_user_v2 | 首选 | 用 user_id 取用户数据 V2（App 端，支持 eid + 纯数字） | GET | /api/v1/kuaishou/app/fetch_one_user_v2 | low |
| app_fetch_user_post_v2 | 首选 | 用 user_id 取用户视频列表（App 端，**仅纯数字**） | GET | /api/v1/kuaishou/app/fetch_user_post_v2 | low |
| app_fetch_user_hot_post | 条件 | 用 user_id 取用户热门作品（App 端，**仅纯数字**） | GET | /api/v1/kuaishou/app/fetch_user_hot_post | low |
| web_fetch_user_info | 首选 | 用 eid 取用户信息（Web 端，**仅 eid**） | GET | /api/v1/kuaishou/web/fetch_user_info | low |
| web_fetch_user_collect | 条件 | 用 eid 取用户收藏作品（Web 端，**仅 eid**） | GET | /api/v1/kuaishou/web/fetch_user_collect | low |
| web_fetch_get_user_id | 首选 | 用分享链接提取用户 ID（Web 端） | GET | /api/v1/kuaishou/web/fetch_get_user_id | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 分享链接 → 用户主页 | web_fetch_get_user_id → web_fetch_user_info | `$.data.user_id` → `user_id`（eid） | 第 1 步失败：STOP；第 2 步失败：返回 ID + "详情暂不可取" |
| 分享链接 → 用户视频 | web_fetch_get_user_id → app_fetch_one_user_v2（取纯数字 userId）→ app_fetch_user_post_v2 | user_id 接力 | 中间步失败：返回截止数据 |
| 用户名 → 用户主页 | search.md 的 app_search_user_v2 → app_fetch_one_user_v2 | `$.data.users[0].user_id` → `user_id` | 跨文件链路 |
| 用户资料 + 视频 | app_fetch_one_user_v2 → app_fetch_user_post_v2 | `$.data.user_id`（纯数字）→ `user_id` | 第 1 步失败：可改用 search；第 2 步失败：返回资料 + "视频列表暂不可取" |
| 用户资料 + 热门 | app_fetch_one_user_v2 → app_fetch_user_hot_post | `$.data.user_id`（纯数字）→ `user_id` | 同上 |
| 用户视频 → 视频详情 | app_fetch_user_post_v2 → video.md 的 app_fetch_one_video | `$.data.videos[].photo_id` → `photo_id` | 跨文件链路 |
| 用户收藏 → 视频详情 | web_fetch_user_collect → video.md 的 web_fetch_one_video_v2 | `$.data.collections[].photo_id` → `photo_id` | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`video.md` 的 `app_fetch_one_video` 输出 `$.data.user_id` → 本文件全部用户端点
- **流入本文件**：`comments.md` 的 `app_fetch_video_comment` 输出评论者 user_id → 本文件
- **流入本文件**：`search.md` 的 `app_search_user_v2` 输出 `$.data.users[].user_id` → 本文件
- **流出本文件**：`app_fetch_user_post_v2` 的 `$.data.videos[].photo_id` → `video.md` 多端点
- **流出本文件**：`app_fetch_user_hot_post` 的 `$.data.videos[].photo_id` → `video.md`

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-防路径臆造)）
- **第 2 步：自检通过后**才能 STOP 并报告"资源不存在"
- **禁止**：改路径段、切换平台前缀、拼接新路径、自行修改 user_id 重试
- **替换**：参考 `param-mappings.md` 的"端点替换矩阵"

### 参数错误（400 / 422）防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-防参数与传参方式臆造)）
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP
- **user_id 格式**：特别注意 App 端部分端点仅支持纯数字，Web 端部分端点仅支持 eid
- **禁止**：切换端点、凭空加参数

### 鉴权错误（401）
- **行动**：**STOP**，提示用户检查或更换 API Key（https://www.aconfig.cn/console）

### 余额 / 付费（402）
- **行动**：**STOP**，告知用户充值（https://www.aconfig.cn/billing）

### 权限错误（403）
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

### app_fetch_one_user_v2 — 获取单个用户数据 V2（App 端）

**Full path:** `/api/v1/kuaishou/app/fetch_one_user_v2`
**Method:** GET · **Risk:** low

#### 用途
获取单个用户数据 V2（App 端）。**支持 eid 和纯数字 userId 两种格式**，是用户信息查询的首选入口。返回昵称、头像、粉丝、关注、获赞数等。

#### 何时使用 / 不使用
- ✅ 已知 user_id（eid 或纯数字均可）
- ✅ 链式起点：从 user_id 取用户详情
- ✅ 需要获取纯数字 userId（供 fetch_user_post_v2 等仅支持纯数字的端点使用）
- ❌ 只有分享链接 → 先用 `web_fetch_get_user_id`
- ❌ 只有用户名 → 先用 `search.md` 的 `app_search_user_v2`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | 支持 eid 和纯数字两种格式 | 如 `3xz63mn6fngqtiq` 或 `228905802` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user_id | `$.data.user_id` | 用户 ID（回显） | 复用 |
| user_name | `$.data.user_name` | 用户昵称 | 仅展示 |
| fan | `$.data.fan` | 粉丝数 | 用于判断是否调用粉丝相关端点 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在/已注销 | STOP | 0 | 降级：search.md 的 app_search_user_v2（如有用户名上下文） |

---

### app_fetch_user_post_v2 — 用户视频列表 V2（App 端）

**Full path:** `/api/v1/kuaishou/app/fetch_user_post_v2`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的视频列表（App 端 V2），支持按最新/热门排序。**仅支持纯数字 userId，不支持 eid**。

#### 何时使用 / 不使用
- ✅ 已知纯数字 userId，想看其视频列表
- ✅ 链式产出 photo_id 给 `video.md`
- ❌ 只有 eid → 先用 `app_fetch_one_user_v2` 获取纯数字 userId
- ❌ 想看用户资料本身 → `app_fetch_one_user_v2`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | **仅纯数字 userId**，不支持 eid | 如 `903511772` |
| pcursor | string | no | — | 分页游标，首次留空 |
| sort | string | no | enum=`latest`/`hot` | 排序方式：latest(最新, 默认) / hot(热门) |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| videos[].photo_id | `$.data.videos[].photo_id` | 作品 ID | video.md 多端点 |
| pcursor | `$.data.pcursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | user_id 为 eid 格式 | 提示需纯数字 userId | 0 | 先调 app_fetch_one_user_v2 获取 |
| 404 | 用户不存在 | STOP | 0 | — |
| 空数据 | 该用户暂无作品 | 返回"暂无作品" | 0 | — |

---

### app_fetch_user_hot_post — 获取用户热门作品（App 端）

**Full path:** `/api/v1/kuaishou/app/fetch_user_hot_post`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的热门作品数据（App 端）。**仅支持纯数字 userId，不支持 eid**。

#### 何时使用 / 不使用
- ✅ 已知纯数字 userId，想看其热门作品
- ❌ 想看全部作品（含非热门） → `app_fetch_user_post_v2`
- ❌ 只有 eid → 先获取纯数字 userId

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | **仅纯数字 userId** | 如 `228905802` |
| pcursor | string | no | — | 分页游标，首次留空 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| videos[].photo_id | `$.data.videos[].photo_id` | 作品 ID | video.md |
| pcursor | `$.data.pcursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | user_id 为 eid 格式 | 提示需纯数字 userId | 0 | — |
| 404 | 用户不存在 | STOP | 0 | — |

---

### web_fetch_user_info — 获取用户信息（Web 端）

**Full path:** `/api/v1/kuaishou/web/fetch_user_info`
**Method:** GET · **Risk:** low

#### 用途
获取用户信息（Web 端）。返回昵称、头像、粉丝数、关注数、获赞数、性别等。**仅支持 eid，不支持纯数字 uid**。

> **风控特殊性**：建议将超时时间设置为 30 秒以上。由于风控特殊性，无法保证 100% 稳定性，如遇失败请稍后重试，推荐重复请求直到成功（最多 2 次）。

#### 何时使用 / 不使用
- ✅ 已知 eid，想取用户详细信息（Web 端）
- ❌ 只有纯数字 userId → 用 `app_fetch_one_user_v2`
- ❌ 只有分享链接 → 先用 `web_fetch_get_user_id`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | **仅 eid 格式**，不支持纯数字 uid | 如 `3xz63mn6fngqtiq` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user_id | `$.data.userProfile.profile.user_id` | 用户 eid | web_fetch_user_collect / web_fetch_user_live_replay |
| user_name | `$.data.userProfile.profile.user_name` | 用户昵称 | 仅展示 |
| fan | `$.data.userProfile.ownerCount.fan` | 粉丝数 | 用于判断用户影响力 |
| like | `$.data.userProfile.ownerCount.like` | 获赞数 | 仅展示 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | user_id 为纯数字格式 | 提示需 eid 格式 | 0 | 改用 app_fetch_one_user_v2 |
| 5xx / 风控拦截 | 风控限制 | 等待后重试 | ≤2 次 | 降级：app_fetch_one_user_v2 |

---

### web_fetch_user_collect — 获取用户收藏作品（Web 端）

**Full path:** `/api/v1/kuaishou/web/fetch_user_collect`
**Method:** GET · **Risk:** low

#### 用途
获取用户收藏作品列表（Web 端）。**仅支持 eid，不支持纯数字 uid**。

#### 何时使用 / 不使用
- ✅ 已知 eid，想看用户收藏的作品
- ❌ 想看用户自己发布的作品 → `app_fetch_user_post_v2`
- ❌ 只有纯数字 userId → 无法使用此端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | **仅 eid 格式** | 如 `3xz63mn6fngqtiq` |
| pcursor | string | no | — | 分页游标，首次留空 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| collections[].photo_id | `$.data.collections[].photo_id` | 收藏作品 ID | video.md |
| pcursor | `$.data.pcursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | user_id 为纯数字格式 | 提示需 eid 格式 | 0 | — |
| 404 | 用户不存在 | STOP | 0 | — |

---

### web_fetch_get_user_id — 获取用户 ID（Web 端）

**Full path:** `/api/v1/kuaishou/web/fetch_get_user_id`
**Method:** GET · **Risk:** low

#### 用途
通过用户分享链接获取用户 ID（Web 端）。**已知分享链接时的链式入口**——把链接转换为 user_id（eid 格式）。

#### 何时使用 / 不使用
- ✅ 用户提供快手分享链接，需要提取 user_id
- ✅ 链式起点：分享链接 → user_id
- ❌ 已知 user_id → 直接用 `app_fetch_one_user_v2` 或 `web_fetch_user_info`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| share_link | string | yes | — | 用户分享链接，如 `https://v.kuaishou.com/KcdKDwFp` |

> **支持多种链接格式**：
> - 分享短链：`https://v.kuaishou.com/KcdKDwFp`
> - Profile 链接：`https://c.kuaishou.com/fw/user/3xcuu5habgc8z29`
> - 直播主页链接：`https://live.kuaishou.com/profile/3xcuu5habgc8z29?fid=...`

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user_id | `$.data.user_id` | 用户 eid | web_fetch_user_info / web_fetch_user_collect / web_fetch_user_live_replay |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 链接格式无效 | 让用户确认链接 | 0 | — |
| 404 | 链接对应用户不存在 | STOP | 0 | — |
