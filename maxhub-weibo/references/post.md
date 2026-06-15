# Weibo Posts / 微博内容

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
微博详情、转发列表、点赞列表、视频详情、推荐 Feed、频道热门、趋势内容、推荐时间轴、热门榜单 —— 围绕"微博内容"的全部读取入口。含 App、Web、Web V2 三端。**status_id / post_id / id 多在本文件首步产出**，是评论、用户等链式调用的常见起点。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| app_fetch_status_detail | ⭐⭐⭐ 首选 | 用 status_id 取微博详情（App 端**链式起点**） | GET | /api/v1/weibo/app/fetch_status_detail | low |
| app_fetch_status_reposts | ⭐⭐ 条件 | 用 status_id 取微博转发列表 | GET | /api/v1/weibo/app/fetch_status_reposts | low |
| app_fetch_status_likes | ⭐⭐ 条件 | 用 status_id 取微博点赞列表 | GET | /api/v1/weibo/app/fetch_status_likes | low |
| app_fetch_video_detail | ⭐⭐⭐ 条件 | 用 mid 取视频详情（**视频评论前置步**） | GET | /api/v1/weibo/app/fetch_video_detail | low |
| app_fetch_video_featured_feed | ⭐⭐ 条件 | 取短视频精选 Feed 流 | GET | /api/v1/weibo/app/fetch_video_featured_feed | low |
| app_fetch_home_recommend_feed | ⭐⭐ 降级 | 取首页推荐 Feed 流（内容冷启动入口） | GET | /api/v1/weibo/app/fetch_home_recommend_feed | low |
| web_fetch_post_detail | ⭐⭐⭐ 首选 | 用 post_id 取微博详情（Web 端） | GET | /api/v1/weibo/web/fetch_post_detail | low |
| web_fetch_config_list | ⭐⭐⭐ 条件 | 取频道配置列表（频道入口） | GET | /api/v1/weibo/web/fetch_config_list | low |
| web_fetch_trend_top | ⭐⭐ 条件 | 用 containerid 取频道热门趋势 | GET | /api/v1/weibo/web/fetch_trend_top | low |
| web_fetch_channel_feed | ⭐⭐ 条件 | 用频道名取热门内容 | GET | /api/v1/weibo/web/fetch_channel_feed | low |
| web_v2_fetch_post_detail | ⭐⭐⭐ 首选 | 用 id 取微博详情（Web V2 端，**支持长文**） | GET | /api/v1/weibo/web_v2/fetch_post_detail | low |
| web_v2_check_allow_comment_with_pic | ⭐ 条件 | 检查微博是否允许带图评论 | GET | /api/v1/weibo/web_v2/check_allow_comment_with_pic | low |
| web_v2_fetch_user_recommend_timeline | ⭐⭐ 条件 | 取微博主页推荐时间轴 | GET | /api/v1/weibo/web_v2/fetch_user_recommend_timeline | low |
| web_v2_fetch_hot_ranking_timeline | ⭐⭐ 条件 | 用 ranking_type 取热门榜单时间轴 | GET | /api/v1/weibo/web_v2/fetch_hot_ranking_timeline | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

> 当单个端点无法直接产出用户所需数据时，按下面链路组合调用。`字段流`列指明字段如何从上一步流向下一步，避免 Agent 臆造字段名。

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看微博 + 评论 | app_fetch_status_detail → comments.md app_fetch_status_comments | `$.data.idstr` → `status_id` | 第 1 步失败：STOP；第 2 步失败：返回微博详情 + "评论暂不可取" |
| 看微博 + 转发 | app_fetch_status_detail → app_fetch_status_reposts | `$.data.idstr` → `status_id` | 第 2 步空数据：返回详情 + "暂无转发" |
| 看微博 + 点赞 | app_fetch_status_detail → app_fetch_status_likes | `$.data.idstr` → `status_id` | 同上 |
| 看视频微博 + 评论 | app_fetch_video_detail → comments.md app_fetch_status_comments | `$.data.items[0].data.idstr` → `status_id` | **视频评论必须先取真实视频 ID** |
| 看频道热门 | web_fetch_config_list → web_fetch_trend_top | `$.data[].containerid` → `containerid` | 第 1 步失败：改用 web_fetch_channel_feed（按频道名） |
| 看微博 + 作者主页 | app_fetch_status_detail → user.md app_fetch_user_info | `$.data.user.id` → `uid` | 跨文件链路，详见 user.md |
| 看推荐 Feed + 详情 | app_fetch_home_recommend_feed → app_fetch_status_detail | `$.data.list[].idstr` → `status_id` | 第 2 步失败：返回 Feed 概要 |
| 看热门榜单 + 详情 | web_v2_fetch_hot_ranking_timeline → web_v2_fetch_post_detail | `$.data.list[].id` → `id` | 第 2 步失败：返回榜单概要 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`user.md` 的 `app_fetch_user_timeline` / `web_v2_fetch_user_posts` 等输出微博 ID → 本文件多个端点
- **流入本文件**：`search.md` 的 `app_fetch_search_all` / `web_fetch_search` 等输出微博 ID → 本文件多个端点
- **流出本文件**：`$.data.user.id`（作者 uid）→ `user.md` 全部 user 系端点的 `uid`
- **流出本文件**：`$.data.idstr` / `$.data.id`（微博 ID）→ `comments.md` 全部评论端点

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项；通用规则见此处。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
  - 路径是否在 `endpoints_whitelist.yaml` 中？
  - Method、参数键名是否符合白名单？
  - 资源 ID（status_id/post_id/id）是否来自合法响应字段？
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**，向用户报告
- **禁止**：❌ 改路径段（app→web 试探）❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改资源 ID 重试
- **替换**：参考 `param-mappings.md` 的"端点替换矩阵"

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
  - 参数名是否逐字符匹配 IN 表？无大小写/缩写/端间混用错？
  - 必填项是否齐全？oneOf 是否做到"传且只传一个"？
  - 类型 / pattern / enum 是否严格匹配？
  - 传参方式（query vs body）是否正确？Authorization 头是否正确？
  - **是否有 IN 表外的臆造参数**？
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP
- **禁止**：❌ 切换端点 ❌ 在 IN 表外凭空加参数

### 鉴权错误（401）
- **子场景**：API 令牌无效 / 缺失 / 过期 / 未激活 / 用户不存在
- **行动**：**STOP**，提示用户检查或更换 API Key（https://www.aconfig.cn）

### 余额 / 付费（402）
- **子场景**：余额不足（允许免费额度 / 不接受免费额度）
- **行动**：**STOP**，告知用户充值（https://www.aconfig.cn）

### 权限错误（403）
- **子场景**：缺少路由访问权限 / 账户已禁用 / 邮箱未验证 / API Token 权限不足
- **行动**：**STOP**，按子场景告知用户去控制台处理

### 限流（429）
- **行动**：读 `Retry-After` 头退避；无该头时按 `delay = min(8s, 2^attempt) * (0.5 + random*0.5)`；最多重试 2 次

### 上游故障（500/502/503/504）
- **行动**：等 3 秒重试 1 次 → 仍失败走端点级"降级/替换"列 → 无替换则 STOP

### 网络超时
- **行动**：**STOP**，向用户报告网络异常

### 业务错误（HTTP 200 且 `code != 0`）
- **行动**：读 `message_zh`/`message` 报告用户；不要把 `data` 当作有效数据；不要重试

---

## 端点详情

### app_fetch_status_detail — 获取微博详情 (App)

**Full path:** `/api/v1/weibo/app/fetch_status_detail`
**Method:** GET · **Risk:** low

#### 用途
获取微博完整详情，包含文本、图片、视频、点赞数、评论数、转发数。**App 端链式调用的常见起点**——大多数 status_id 与作者 uid 从此处产出。

#### 何时使用 / 不使用
- ✅ 用户提供 status_id
- ✅ 链式起点：取 status_id 或作者 uid
- ❌ 想看评论 → 直接用 `comments.md` 的 app_fetch_status_comments
- ❌ 想看作者其他微博 → 用 `user.md` 的 app_fetch_user_timeline

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| status_id | string | yes | — | 微博 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| idstr | `$.data.idstr` | 微博 ID | app_fetch_status_reposts / app_fetch_status_likes / comments.md |
| user.id | `$.data.user.id` | 作者 uid | user.md 全部 user 系端点 |
| reposts_count | `$.data.reposts_count` | 转发数 | 用于决定是否调用 app_fetch_status_reposts |
| comments_count | `$.data.comments_count` | 评论数 | 用于决定是否调用 comments.md |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 微博不存在/已删除 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 仍失败 → web_v2_fetch_post_detail 或 web_fetch_post_detail |

---

### app_fetch_status_reposts — 获取微博转发列表

**Full path:** `/api/v1/weibo/app/fetch_status_reposts`
**Method:** GET · **Risk:** low

#### 用途
获取指定微博的转发列表（含转发内容、转发者信息、翻页游标）。

#### 何时使用 / 不使用
- ✅ 用户明确想看某条微博的转发
- ❌ 想看微博本身详情 → app_fetch_status_detail

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| status_id | string | yes | — | 微博 ID（也适用于视频转发） |
| max_id | string | no | — | 翻页游标，首次不传 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].user.id | `$.data.list[].user.id` | 转发者 uid | user.md |
| moreInfo.params.max_id | `$.data.moreInfo.params.max_id` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 微博不存在 | STOP | 0 | 无替代 |
| 空数据 | 暂无转发 | 返回"暂无转发" | 0 | — |

---

### app_fetch_status_likes — 获取微博点赞列表

**Full path:** `/api/v1/weibo/app/fetch_status_likes`
**Method:** GET · **Risk:** low

#### 用途
获取指定微博的点赞列表（含点赞者信息、类型）。

#### 何时使用 / 不使用
- ✅ 用户明确想看某条微博的点赞
- ❌ 想看微博详情 → app_fetch_status_detail

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| status_id | string | yes | — | 微博 ID（也适用于视频点赞） |
| attitude_type | string | no | enum=`["0","1","2","3","4","5","6","8"]` | 点赞类型: 0=全部, 1=点赞, 2=开心, 3=惊讶, 4=伤心, 5=愤怒, 6=打赏, 8=抱抱 (default: 0) |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].user.id | `$.data.list[].user.id` | 点赞者 uid | user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 微博不存在 | STOP | 0 | 无替代 |

---

### app_fetch_video_detail — 获取视频详情

**Full path:** `/api/v1/weibo/app/fetch_video_detail`
**Method:** GET · **Risk:** low

#### 用途
获取视频微博的详细数据（播放地址、封面、时长、标题）。**关键前置步**：从微博视频链接获取评论前，必须先调用此接口获取真实视频 ID。

#### 何时使用 / 不使用
- ✅ 用户提供视频微博 ID（mid），需要获取视频详情或真实视频 ID
- ✅ 链式前置：视频评论前获取 status_id
- ❌ 非视频微博 → 用 app_fetch_status_detail

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| mid | string | yes | — | 视频微博 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| items[0].data.idstr | `$.data.items[0].data.idstr` | 真实视频 ID | comments.md app_fetch_status_comments |
| items[0].data.page_info.media_info | `$.data.items[0].data.page_info.media_info` | 视频播放信息 | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 视频不存在 | STOP | 0 | 无替代 |

---

### app_fetch_video_featured_feed — 获取短视频精选 Feed 流

**Full path:** `/api/v1/weibo/app/fetch_video_featured_feed`
**Method:** GET · **Risk:** low

#### 用途
获取短视频精选 Feed 流（约 20 条/页）。

#### 何时使用 / 不使用
- ✅ 用户想浏览短视频精选
- ❌ 想看图文微博 → app_fetch_home_recommend_feed

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| page | string | no | — | 页码，首页不传，第二页传"2"，依次递增 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].idstr | `$.data.list[].idstr` | 视频微博 ID | app_fetch_video_detail |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### app_fetch_home_recommend_feed — 获取首页推荐 Feed 流

**Full path:** `/api/v1/weibo/app/fetch_home_recommend_feed`
**Method:** GET · **Risk:** low

#### 用途
获取首页推荐 Feed 流（基于热门话题和热点事件）。**内容冷启动入口**——用户没有具体 status_id 时，可从此端点采集 status_id 进入其他链路。

#### 何时使用 / 不使用
- ✅ 用户问"微博有什么热门"等无明确目标的场景
- ✅ 链式起点：批量取 status_id 后并行调用详情等
- ❌ 用户已给 status_id → 直接 app_fetch_status_detail

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| page | string | no | — | 页码，首页不传，第二页传"2" |
| count | integer | no | min=1, max=50 | 每页数量 (default: 15) |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].idstr | `$.data.list[].idstr` | 微博 ID | app_fetch_status_detail / comments.md |
| list[].user.id | `$.data.list[].user.id` | 作者 uid | user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | web_v2_fetch_user_recommend_timeline |

---

### web_fetch_post_detail — 获取微博详情 (Web)

**Full path:** `/api/v1/weibo/web/fetch_post_detail`
**Method:** GET · **Risk:** low

#### 用途
Web 端获取微博详情。

#### 何时使用 / 不使用
- ✅ 用户明确使用 Web 端接口
- ❌ 需要长文全文 → web_v2_fetch_post_detail（支持 is_get_long_text）
- ❌ App 端场景 → app_fetch_status_detail

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| post_id | string | yes | — | 微博 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| id | `$.data.id` | 微博 ID | comments.md web_fetch_post_comments |
| user.id | `$.data.user.id` | 作者 uid | user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 微博不存在 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | app_fetch_status_detail 或 web_v2_fetch_post_detail |

---

### web_fetch_config_list — 获取频道配置列表

**Full path:** `/api/v1/weibo/web/fetch_config_list`
**Method:** GET · **Risk:** low

#### 用途
获取频道列表（含频道名称和 containerid）。**频道入口**——为 web_fetch_trend_top 提供 containerid。

#### 何时使用 / 不使用
- ✅ 用户想浏览频道热门，需要先获取频道列表
- ✅ 链式前置：为 web_fetch_trend_top 提供 containerid
- ❌ 已知频道名 → 可直接用 web_fetch_channel_feed

#### 输入 (IN)
无参数

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| [].containerid | `$.data[].containerid` | 频道容器 ID | web_fetch_trend_top |
| [].name | `$.data[].name` | 频道名称 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 改用 web_fetch_channel_feed（按频道名） |

---

### web_fetch_trend_top — 获取频道热门趋势

**Full path:** `/api/v1/weibo/web/fetch_trend_top`
**Method:** GET · **Risk:** low

#### 用途
根据频道容器 ID 获取热门微博列表。

#### 何时使用 / 不使用
- ✅ 已通过 web_fetch_config_list 取得 containerid
- ❌ 不知道 containerid → 先调 web_fetch_config_list，或改用 web_fetch_channel_feed

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| containerid | string | yes | — | 频道容器 ID（从 web_fetch_config_list 获取） |
| page | integer | no | min=1 | 页码 (default: 1) |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].id | `$.data.list[].id` | 微博 ID | web_fetch_post_detail |
| list[].user.id | `$.data.list[].user.id` | 作者 uid | user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | containerid 无效 | 检查是否来自 config_list | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | web_fetch_channel_feed |

---

### web_fetch_channel_feed — 根据频道名称获取热门内容

**Full path:** `/api/v1/weibo/web/fetch_channel_feed`
**Method:** GET · **Risk:** low

#### 用途
根据频道名称获取热门微博列表（自动调用 config_list 获取频道配置）。

#### 何时使用 / 不使用
- ✅ 用户想看某频道热门（如"科技"、"明星"）
- ✅ web_fetch_config_list / web_fetch_trend_top 失败时的降级方案
- ❌ 需要精确 containerid 控制 → web_fetch_trend_top

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| channel_name | string | no | enum=`["热门","榜单","同城","社会","科技","明星","电影","音乐","数码","汽车","游戏"]` | 频道名称（不传则用默认频道） |
| page | integer | no | min=1 | 页码 (default: 1) |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].id | `$.data.list[].id` | 微博 ID | web_fetch_post_detail |
| list[].user.id | `$.data.list[].user.id` | 作者 uid | user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### web_v2_fetch_post_detail — 获取微博详情 (Web V2)

**Full path:** `/api/v1/weibo/web_v2/fetch_post_detail`
**Method:** GET · **Risk:** low

#### 用途
Web V2 端获取微博详情，**支持长微博全文获取**（is_get_long_text 参数）。

#### 何时使用 / 不使用
- ✅ 需要获取长微博全文（is_get_long_text=true）
- ✅ Web V2 端链式起点
- ❌ App 端场景 → app_fetch_status_detail

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| id | string | yes | — | 微博 ID |
| is_get_long_text | string | no | enum=`["true","false"]` | 是否获取长微博全文 (default: true) |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| id | `$.data.id` | 微博 ID | comments.md web_v2_fetch_post_comments |
| user.id | `$.data.user.id` | 作者 uid | user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 微博不存在 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | app_fetch_status_detail 或 web_fetch_post_detail |

---

### web_v2_check_allow_comment_with_pic — 检查微博是否允许带图评论

**Full path:** `/api/v1/weibo/web_v2/check_allow_comment_with_pic`
**Method:** GET · **Risk:** low

#### 用途
检查指定微博是否允许带图评论。返回 result 字段（true/false）。

#### 何时使用 / 不使用
- ✅ 用户想知道某条微博能否带图评论
- ❌ 本 skill 不支持发评论，此端点仅用于查询状态

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| id | string | yes | — | 微博 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| result | `$.data.result` | 是否允许带图评论 (true/false) | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 微博不存在 | STOP | 0 | — |

---

### web_v2_fetch_user_recommend_timeline — 获取微博主页推荐时间轴

**Full path:** `/api/v1/weibo/web_v2/fetch_user_recommend_timeline`
**Method:** GET · **Risk:** low

#### 用途
获取微博主页推荐时间轴（含 max_id 翻页）。

#### 何时使用 / 不使用
- ✅ 用户想看微博推荐内容
- ✅ app_fetch_home_recommend_feed 的降级替代
- ❌ 想看某条具体微博 → web_v2_fetch_post_detail

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| refresh | integer | no | enum=`[0,1]` | 刷新类型: 0=正常, 1=强制 (default: 0) |
| group_id | string | no | — | 分组 ID (default: 102803) |
| containerid | string | no | — | 容器 ID (default: 102803) |
| extparam | string | no | — | 扩展参数 (default: discover\|new_feed) |
| max_id | string | no | — | 翻页游标 (default: 0) |
| count | integer | no | min=1, max=50 | 获取数量 (default: 10, 建议 5-20) |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].id | `$.data.list[].id` | 微博 ID | web_v2_fetch_post_detail |
| list[].user.id | `$.data.list[].user.id` | 作者 uid | user.md |
| max_id | `$.data.max_id` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | app_fetch_home_recommend_feed |

---

### web_v2_fetch_hot_ranking_timeline — 获取微博热门榜单时间轴

**Full path:** `/api/v1/weibo/web_v2/fetch_hot_ranking_timeline`
**Method:** GET · **Risk:** low

#### 用途
根据榜单类型获取热门微博列表（含微博内容、作者信息、互动数据）。

#### 何时使用 / 不使用
- ✅ 用户想看热门榜单（小时榜、昨日榜、周榜等）
- ❌ 想看热搜词条 → search.md 的 web_v2_fetch_hot_search_summary

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| ranking_type | string | yes | enum=`["hour","yesterday","day_before","week","male","female"]` | 榜单类型 |
| since_id | string | no | — | 分页标识 (default: 0) |
| max_id | string | no | — | 最大 ID (default: 0) |
| count | integer | no | min=1 | 获取数量 (default: 10) |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].id | `$.data.list[].id` | 微博 ID | web_v2_fetch_post_detail |
| list[].user.id | `$.data.list[].user.id` | 作者 uid | user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | ranking_type 无效 | 检查枚举值 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |
