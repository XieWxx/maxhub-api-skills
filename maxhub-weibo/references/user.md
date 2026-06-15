# Weibo Users / 微博用户

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
用户信息、粉丝/关注、用户微博、时间线、原创微博、超话、相册、文章、音频、视频、收藏夹、分组 —— 围绕"用户"的全部读取入口。含 App、Web、Web V2 三端。**uid 多在本文件首步产出**（web_v2_fetch_user_info 支持用户名 custom 查询，是已知用户名时的链式入口）。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| app_fetch_user_info | ⭐⭐⭐ 首选 | 用 uid 取用户基本信息（App 端） | GET | /api/v1/weibo/app/fetch_user_info | low |
| app_fetch_user_info_detail | ⭐⭐ 条件 | 用 uid 取用户详细信息（App 端，更完整） | GET | /api/v1/weibo/app/fetch_user_info_detail | low |
| app_fetch_user_timeline | ⭐⭐⭐ 首选 | 用 uid 取用户发布的微博（App 端，**多类型筛选**） | GET | /api/v1/weibo/app/fetch_user_timeline | low |
| app_fetch_user_videos | ⭐⭐ 条件 | 用 uid 取用户视频列表（App 端） | GET | /api/v1/weibo/app/fetch_user_videos | low |
| app_fetch_user_super_topics | ⭐⭐ 条件 | 用 uid 取用户参与的超话 | GET | /api/v1/weibo/app/fetch_user_super_topics | low |
| app_fetch_user_album | ⭐⭐ 条件 | 用 uid 取用户相册 | GET | /api/v1/weibo/app/fetch_user_album | low |
| app_fetch_user_articles | ⭐⭐ 条件 | 用 uid 取用户文章列表 | GET | /api/v1/weibo/app/fetch_user_articles | low |
| app_fetch_user_audios | ⭐ 条件 | 用 uid 取用户音频列表 | GET | /api/v1/weibo/app/fetch_user_audios | low |
| app_fetch_user_profile_feed | ⭐⭐ 条件 | 用 uid 取用户主页动态 | GET | /api/v1/weibo/app/fetch_user_profile_feed | low |
| web_fetch_user_info | ⭐⭐ 条件 | 用 uid 取用户信息（Web 端） | GET | /api/v1/weibo/web/fetch_user_info | low |
| web_fetch_user_posts | ⭐⭐ 条件 | 用 uid 取用户微博列表（Web 端） | GET | /api/v1/weibo/web/fetch_user_posts | low |
| web_v2_fetch_user_info | ⭐⭐⭐ 首选 | 用 uid/custom 取用户信息（**支持用户名查询**） | GET | /api/v1/weibo/web_v2/fetch_user_info | low |
| web_v2_fetch_user_basic_info | ⭐⭐ 条件 | 用 uid 取用户基本信息（Web V2 端，轻量级） | GET | /api/v1/weibo/web_v2/fetch_user_basic_info | low |
| web_v2_fetch_user_posts | ⭐⭐⭐ 首选 | 用 uid 取用户微博（Web V2 端，feature 控制） | GET | /api/v1/weibo/web_v2/fetch_user_posts | low |
| web_v2_fetch_user_original_posts | ⭐⭐ 条件 | 用 uid 取用户原创微博 | GET | /api/v1/weibo/web_v2/fetch_user_original_posts | low |
| web_v2_search_user_posts | ⭐⭐ 条件 | 用 uid + 关键词搜索用户微博（**多维度筛选**） | GET | /api/v1/weibo/web_v2/search_user_posts | low |
| web_v2_fetch_user_video_collection_list | ⭐ 条件 | 用 uid 取用户视频收藏夹列表 | GET | /api/v1/weibo/web_v2/fetch_user_video_collection_list | low |
| web_v2_fetch_user_video_collection_detail | ⭐ 条件 | 用 cid 取视频收藏夹详情 | GET | /api/v1/weibo/web_v2/fetch_user_video_collection_detail | low |
| web_v2_fetch_user_video_list | ⭐⭐ 条件 | 用 uid 取用户全部视频（Web V2 端） | GET | /api/v1/weibo/web_v2/fetch_user_video_list | low |
| web_v2_fetch_user_following | ⭐⭐ 条件 | 用 uid 取用户关注列表 | GET | /api/v1/weibo/web_v2/fetch_user_following | low |
| web_v2_fetch_user_fans | ⭐⭐ 条件 | 用 uid 取用户粉丝列表 | GET | /api/v1/weibo/web_v2/fetch_user_fans | low |
| web_v2_fetch_all_groups | ⭐ 条件 | 取所有分组信息 | GET | /api/v1/weibo/web_v2/fetch_all_groups | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 用户名 → 用户主页 | web_v2_fetch_user_info(custom) → app_fetch_user_info_detail | `$.data.uid` → `uid` | 第 1 步空：STOP，告知用户名未命中 |
| 看用户资料 + 微博 | app_fetch_user_info → app_fetch_user_timeline | `$.data.uid` → `uid` | 第 1 步失败：STOP；第 2 步失败：返回资料 + "微博列表暂不可取" |
| 看用户资料 + 原创 | web_v2_fetch_user_posts → web_v2_fetch_user_original_posts | `$.data.uid` → `uid` + `$.data.since_id` → `since_id` | 第 2 步空：返回 posts + "无原创微博" |
| 看用户社交圈 | web_v2_fetch_user_info → web_v2_fetch_user_following + web_v2_fetch_user_fans（可并行） | `$.data.uid` → `uid` | 任一失败：返回另一份 + 告知缺失 |
| 看用户视频收藏 | web_v2_fetch_user_video_collection_list → web_v2_fetch_user_video_collection_detail | `$.data.list[].id` → `cid` | 第 1 步空：返回"无收藏夹" |
| 用户微博 → 微博详情 | app_fetch_user_timeline → post.md app_fetch_status_detail | `$.data.list[].idstr` → `status_id` | 跨文件链路 |
| 搜索用户微博 | web_v2_fetch_user_info → web_v2_search_user_posts | `$.data.uid` → `uid` | 第 1 步失败：STOP |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`post.md` 的 app_fetch_status_detail 输出 `$.data.user.id` → 本文件全部 user 系端点的 `uid`
- **流入本文件**：`comments.md` 的评论端点输出 `$.data.list[].user.id` → 本文件
- **流入本文件**：`search.md` 的 web_v2_fetch_user_search 输出 `$.data.list[].uid` → 本文件
- **流出本文件**：`app_fetch_user_timeline` / `web_v2_fetch_user_posts` 等的微博 ID → `post.md` 多端点
- **流出本文件**：`web_v2_fetch_user_video_collection_detail` 的视频列表 → `post.md` 视频相关端点

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- **第 2 步：自检通过后**才能 STOP 并报告"资源不存在"
- **禁止**：❌ 改路径段 ❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改 uid 重试
- **替换**：参考 `param-mappings.md` 的"端点替换矩阵"

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP
- **禁止**：❌ 切换端点 ❌ 凭空加参数

### 鉴权错误（401）
- **行动**：**STOP**，提示用户检查或更换 API Key（https://www.aconfig.cn）

### 余额 / 付费（402）
- **行动**：**STOP**，告知用户充值（https://www.aconfig.cn）

### 权限错误（403）
- **行动**：**STOP**，按子场景告知用户处理

### 限流（429）
- **行动**：读 `Retry-After` 头退避；无该头时指数退避 + jitter；最多重试 2 次

### 上游故障（500/502/503/504）
- **行动**：等 3 秒重试 1 次 → 仍失败走端点级"降级/替换"

### 网络超时 / DNS
- **行动**：**STOP**，向用户报告

### 业务错误（HTTP 200 且 `code != 0`）
- **行动**：读 `message_zh`/`message`；不要把 `data` 当作有效数据；不要重试

---

## 端点详情

### app_fetch_user_info — 获取用户信息 (App)

**Full path:** `/api/v1/weibo/app/fetch_user_info`
**Method:** GET · **Risk:** low

#### 用途
获取用户基本信息（昵称、头像、简介、关注数、粉丝数）。**App 端链式起点**。

#### 何时使用 / 不使用
- ✅ 用户提供 uid
- ✅ 链式起点：取 uid 或 screen_name
- ❌ 需要更完整信息（认证、标签、等级）→ app_fetch_user_info_detail
- ❌ 只有用户名 → web_v2_fetch_user_info（支持 custom 参数）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | — | 用户 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| uid | `$.data.uid` | 用户 ID（回显） | 复用 |
| screen_name | `$.data.screen_name` | 用户昵称 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | 无替代 |

---

### app_fetch_user_info_detail — 获取用户详细信息 (App)

**Full path:** `/api/v1/weibo/app/fetch_user_info_detail`
**Method:** GET · **Risk:** low

#### 用途
获取用户详细信息（含认证信息、标签、等级等，比 app_fetch_user_info 更完整）。

#### 何时使用 / 不使用
- ✅ 需要用户完整资料（认证、标签、等级）
- ❌ 只需基本信息 → app_fetch_user_info（更轻量）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | — | 用户 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| uid | `$.data.uid` | 用户 ID | 复用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | **降级**：app_fetch_user_info |

---

### app_fetch_user_timeline — 获取用户发布的微博

**Full path:** `/api/v1/weibo/app/fetch_user_timeline`
**Method:** GET · **Risk:** low

#### 用途
获取用户发布的微博列表（约 20 条/页，支持多种内容筛选）。**产出 status_id 的常见端点**。

#### 何时使用 / 不使用
- ✅ 已知 uid，想看其微博
- ✅ 链式产出 status_id 给 `post.md`
- ❌ 想看用户资料本身 → app_fetch_user_info

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | — | 用户 ID |
| page | integer | no | min=1 | 页码 (default: 1) |
| filter_type | string | no | enum=`["all","original","likes","video","pic","location","month"]` | 筛选类型 (default: all) |
| month | string | no | pattern=`^\d{8}$` | 时间筛选 YYYYMMDD（仅 filter_type=month 时有效） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].idstr | `$.data.list[].idstr` | 微博 ID | post.md app_fetch_status_detail / comments.md |
| list[].user.id | `$.data.list[].user.id` | 作者 uid | 复用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |
| 空数据 | 该用户暂无微博 | 返回"暂无微博" | 0 | — |

---

### app_fetch_user_videos — 获取用户视频列表 (App)

**Full path:** `/api/v1/weibo/app/fetch_user_videos`
**Method:** GET · **Risk:** low

#### 用途
获取用户视频列表（瀑布流，仅返回含视频的微博）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | — | 用户 ID |
| since_id | string | no | — | 翻页游标（首次不传，使用返回的 since_id 继续） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| moreInfo.params.since_id | `$.data.moreInfo.params.since_id` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |

---

### app_fetch_user_super_topics — 获取用户参与的超话列表

**Full path:** `/api/v1/weibo/app/fetch_user_super_topics`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | — | 用户 ID |
| page | integer | no | min=1 | 页码 (default: 1) |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 超话列表 | 仅展示 |

---

### app_fetch_user_album — 获取用户相册

**Full path:** `/api/v1/weibo/app/fetch_user_album`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | — | 用户 ID |
| since_id | string | no | — | 翻页游标（首次不传） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 图片列表 | 仅展示 |

---

### app_fetch_user_articles — 获取用户文章列表

**Full path:** `/api/v1/weibo/app/fetch_user_articles`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | — | 用户 ID |
| since_id | string | no | — | 翻页游标（首次不传） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 文章列表 | 仅展示 |

---

### app_fetch_user_audios — 获取用户音频列表

**Full path:** `/api/v1/weibo/app/fetch_user_audios`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | — | 用户 ID |
| since_id | string | no | — | 翻页游标（首次不传） |

---

### app_fetch_user_profile_feed — 获取用户主页动态

**Full path:** `/api/v1/weibo/app/fetch_user_profile_feed`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | — | 用户 ID |
| since_id | string | no | — | 翻页游标（首次不传） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].idstr | `$.data.list[].idstr` | 微博 ID | post.md |

---

### web_fetch_user_info — 获取用户信息 (Web)

**Full path:** `/api/v1/weibo/web/fetch_user_info`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | — | 用户 ID |

---

### web_fetch_user_posts — 获取用户微博列表 (Web)

**Full path:** `/api/v1/weibo/web/fetch_user_posts`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | — | 用户 ID |
| page | integer | no | min=1 | 页码 (default: 1) |
| since_id | string | no | — | 翻页 ID，从上一页结果获取 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].id | `$.data.list[].id` | 微博 ID | post.md web_fetch_post_detail |

---

### web_v2_fetch_user_info — 获取用户信息 (Web V2)

**Full path:** `/api/v1/weibo/web_v2/fetch_user_info`
**Method:** GET · **Risk:** low

#### 用途
获取用户详细信息。**支持用户名查询**（custom 参数），是已知用户名时的链式入口。

#### 何时使用 / 不使用
- ✅ 用户提供 uid 或用户名（custom）
- ✅ 链式起点：username → uid
- ❌ 已知 uid 且只需基本信息 → web_v2_fetch_user_basic_info（更轻量）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | oneOf(uid, custom) | — | 用户 ID（与 custom 二选一，优先） |
| custom | string | oneOf(uid, custom) | — | 自定义微博用户名（与 uid 二选一） |

> **二选一逻辑**：uid 与 custom 必须传且只传一个。同时传 → 422；都不传 → 422。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| uid | `$.data.uid` | 用户 ID | 本文件全部 user 系端点 |
| screen_name | `$.data.screen_name` | 用户昵称 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 422 | uid/custom 同时传或都未传 | 修正后重试 | ≤1 次 | — |
| 404 | 用户不存在 | STOP | 0 | **降级**：search.md web_v2_fetch_user_search |

---

### web_v2_fetch_user_basic_info — 获取用户基本信息 (Web V2)

**Full path:** `/api/v1/weibo/web_v2/fetch_user_basic_info`
**Method:** GET · **Risk:** low

#### 用途
获取用户基本信息（轻量级，含 ID、用户名、头像、简介、认证信息，响应更快）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | — | 用户 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| uid | `$.data.uid` | 用户 ID | 复用 |

---

### web_v2_fetch_user_posts — 获取用户微博 (Web V2)

**Full path:** `/api/v1/weibo/web_v2/fetch_user_posts`
**Method:** GET · **Risk:** low

#### 用途
获取用户微博列表（含 since_id 翻页，feature 参数控制返回数据量和字段）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | — | 用户 ID |
| page | integer | no | min=1 | 页码 (default: 1) |
| feature | integer | no | enum=`[0,1,2,3]` | 数据特征: 0=10条基础, 1=20条扩展, 2=20条图片, 3=20条完整 (default: 0) |
| since_id | string | no | — | 翻页标识 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].id | `$.data.list[].id` | 微博 ID | post.md web_v2_fetch_post_detail |
| since_id | `$.data.since_id` | 下一页游标 | 同端点翻页 / web_v2_fetch_user_original_posts |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |
| 空数据 | 暂无微博 | 返回"暂无微博" | 0 | — |

---

### web_v2_fetch_user_original_posts — 获取用户原创微博

**Full path:** `/api/v1/weibo/web_v2/fetch_user_original_posts`
**Method:** GET · **Risk:** low

#### 用途
获取用户原创微博列表（排除转发）。**第一页 since_id 必须从 web_v2_fetch_user_posts 获取**。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | — | 用户 ID |
| page | integer | no | min=1 | 页码 (default: 1) |
| since_id | string | no | — | 翻页标识（第一页必须从 fetch_user_posts 获取） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].id | `$.data.list[].id` | 微博 ID | post.md |

---

### web_v2_search_user_posts — 搜索用户微博

**Full path:** `/api/v1/weibo/web_v2/search_user_posts`
**Method:** GET · **Risk:** low

#### 用途
在指定用户的微博中搜索，支持多维度内容筛选和时间范围。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | — | 用户 ID |
| q | string | no | — | 搜索关键词（空=全部） |
| page | integer | no | min=1 | 页码 (default: 1) |
| starttime | string | no | — | 开始时间戳 |
| endtime | string | no | — | 结束时间戳 |
| hasori | integer | no | enum=`[0,1]` | 含原创: 1=含, 0=不含 (default: 1) |
| hasret | integer | no | enum=`[0,1]` | 含转发: 1=含, 0=不含 (default: 1) |
| hastext | integer | no | enum=`[0,1]` | 含文字: 1=含, 0=不含 (default: 1) |
| haspic | integer | no | enum=`[0,1]` | 含图片: 1=含, 0=不含 (default: 1) |
| hasvideo | integer | no | enum=`[0,1]` | 含视频: 1=含, 0=不含 (default: 1) |
| hasmusic | integer | no | enum=`[0,1]` | 含音乐: 1=含, 0=不含 (default: 1) |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].id | `$.data.list[].id` | 微博 ID | post.md |

---

### web_v2_fetch_user_video_collection_list — 获取用户视频收藏夹列表

**Full path:** `/api/v1/weibo/web_v2/fetch_user_video_collection_list`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | — | 用户 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].id | `$.data.list[].id` | 收藏夹 ID | web_v2_fetch_user_video_collection_detail.cid |

---

### web_v2_fetch_user_video_collection_detail — 获取用户视频收藏夹详情

**Full path:** `/api/v1/weibo/web_v2/fetch_user_video_collection_detail`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cid | string | yes | — | 收藏夹 ID（从 fetch_user_video_collection_list 获取） |
| cursor | string | no | — | 分页游标（首次传空） |
| tab_code | integer | no | enum=`[0,1,2]` | 排序: 0=默认, 1=最热, 2=最新 (default: 0) |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| next_cursor | `$.data.next_cursor` | 下一页游标 | 同端点翻页 |
| has_more | `$.data.has_more` | 是否还有下一页 | 翻页终止条件 |

---

### web_v2_fetch_user_video_list — 获取用户全部视频 (Web V2)

**Full path:** `/api/v1/weibo/web_v2/fetch_user_video_list`
**Method:** GET · **Risk:** low

#### 用途
获取用户发布的视频列表（瀑布流）。与收藏夹接口的区别：本接口获取用户**发布**的视频，收藏夹接口获取用户**收藏**的视频。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | — | 用户 ID |
| cursor | string | no | — | 分页游标 (default: 0) |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| next_cursor | `$.data.next_cursor` | 下一页游标 | 同端点翻页 |
| has_more | `$.data.has_more` | 是否还有下一页 | 翻页终止条件 |

---

### web_v2_fetch_user_following — 获取用户关注列表

**Full path:** `/api/v1/weibo/web_v2/fetch_user_following`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | — | 用户 ID |
| page | integer | no | min=0 | 页码，从 0 开始 (default: 0) |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].uid | `$.data.list[].uid` | 被关注用户 ID | 本文件 user 系端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 业务 code≠0 | 隐私设置不可见 | 告知用户该列表不可查看 | 0 | — |

---

### web_v2_fetch_user_fans — 获取用户粉丝列表

**Full path:** `/api/v1/weibo/web_v2/fetch_user_fans`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | — | 用户 ID |
| page | integer | no | min=0 | 页码，从 0 开始 (default: 0) |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].uid | `$.data.list[].uid` | 粉丝用户 ID | 本文件 user 系端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 业务 code≠0 | 隐私设置不可见 | 告知用户该列表不可查看 | 0 | — |

---

### web_v2_fetch_all_groups — 获取所有分组信息

**Full path:** `/api/v1/weibo/web_v2/fetch_all_groups`
**Method:** GET · **Risk:** low

#### 用途
获取所有分组信息（含分组 ID、名称、容器 ID），建议缓存。

#### 输入 (IN)
无参数

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 分组列表 | 仅展示 |
