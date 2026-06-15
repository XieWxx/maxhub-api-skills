# Bilibili Search & Discovery / B站 搜索与发现

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
综合搜索、分类搜索、热榜、首页推荐、热门、番剧、影视 —— 围绕"搜索与发现"的全部入口。**bv_id 多在本文件首步产出**（搜索结果是视频链路的常见起点）。含 App 端和 Web 端双端。

> 🔒 **Security:** All requests transmit your `MAXHUB_API_KEY` and query data to `https://www.aconfig.cn`. Never expose API keys in logs, prompts, or client-side storage.

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| fetch_search_all | ⭐⭐⭐ 首选 | 综合搜索（App 端，**关键词→bv_id 入口**） | GET | /api/v1/bilibili/app/fetch_search_all | low |
| fetch_general_search | ⭐⭐⭐ 首选 | 综合搜索（Web 端，4 个必填参数） | GET | /api/v1/bilibili/web/fetch_general_search | low |
| fetch_hot_search | ⭐⭐ 条件 | 热门搜索关键词（Web 端） | GET | /api/v1/bilibili/web/fetch_hot_search | low |
| fetch_search_by_type | ⭐⭐ 条件 | 分类搜索（App 端，可按类型过滤） | GET | /api/v1/bilibili/app/fetch_search_by_type | low |
| fetch_home_feed | ⭐⭐ 降级 | 首页推荐流（App 端，无关键词冷启动） | GET | /api/v1/bilibili/app/fetch_home_feed | low |
| fetch_popular_feed | ⭐⭐ 降级 | 热门推荐（App 端） | GET | /api/v1/bilibili/app/fetch_popular_feed | low |
| fetch_com_popular | ⭐⭐ 降级 | 综合热门（Web 端） | GET | /api/v1/bilibili/web/fetch_com_popular | low |
| fetch_cinema_tab | ⭐ 条件 | 影视推荐（App 端，无参数） | GET | /api/v1/bilibili/app/fetch_cinema_tab | low |
| fetch_bangumi_tab | ⭐ 条件 | 番剧推荐（App 端，无参数） | GET | /api/v1/bilibili/app/fetch_bangumi_tab | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 搜索视频 → 看详情 | fetch_search_all → 跳到 `video.md` fetch_one_video_web | `$.data.item[].bvid` → `bv_id` | 跨文件链路 |
| 搜索视频 → 看详情（Web） | fetch_general_search → 跳到 `video.md` fetch_one_video_web | `$.data.result[].bvid` → `bv_id` | 跨文件链路 |
| 搜索用户 → 看主页 | fetch_search_by_type(search_type=user) → 跳到 `user.md` fetch_user_profile | `$.data.result[].mid` → `uid` | 跨文件链路 |
| 搜索直播 → 看直播间 | fetch_search_by_type(search_type=live) → 跳到 `live.md` fetch_live_room_detail | `$.data.result[].roomid` → `room_id` | 跨文件链路 |
| 热搜词 → 搜索视频 | fetch_hot_search → fetch_search_all / fetch_general_search | 热搜词 → `keyword` | 第 1 步失败：直接让用户输入关键词 |
| 推荐流 → 看详情 | fetch_home_feed / fetch_popular_feed → 跳到 `video.md` | `$.data.item[].bvid` / `$.data.list[].bvid` → `bv_id` | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流出本文件**：`fetch_search_all` / `fetch_general_search` 输出 `bvid` → `video.md` 多端点
- **流出本文件**：`fetch_search_by_type`(search_type=user) 输出 `mid` → `user.md` uid 系端点
- **流出本文件**：`fetch_search_by_type`(search_type=live) 输出 `roomid` → `live.md`
- **流出本文件**：`fetch_home_feed` / `fetch_popular_feed` / `fetch_com_popular` 输出 `bvid` → `video.md`
- **流入本文件**：`fetch_hot_search` 的热搜词可作为本文件搜索端点的 `keyword`

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- **第 2 步：自检通过后**才能 STOP 并报告

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次

### 鉴权/余额/权限/限流/上游/网络/业务错误
- 按 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview) 通用规则处理

---

## 端点详情

### fetch_search_all — 综合搜索（App 端）

**Full path:** `/api/v1/bilibili/app/fetch_search_all`
**Method:** GET · **Risk:** low

#### 用途
用关键词进行综合搜索（App 端）。**关键词→bv_id 的链式入口**——搜索结果是进入视频详情链路的常见起点。

#### 何时使用 / 不使用
- ✅ 用户给出关键词想搜视频
- ✅ 链式起点：keyword → bvid
- ❌ 需要按类型过滤 → fetch_search_by_type
- ❌ Web 端搜索 → fetch_general_search
- ❌ 想看热搜词 → fetch_hot_search

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词，如 `原神` |
| page | integer | no | ≥1 | 页码（default: 1） |
| page_size | integer | no | ≥1 | 每页数量（default: 20） |
| order | integer | no | enum=`0` | 排序（0=综合，default: 0） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| item[].bvid | `$.data.item[].bvid` | 视频 BV号 | video.md 多端点 |
| item[].aid | `$.data.item[].aid` | 视频 AV号 | video.md |
| item[].title | `$.data.item[].title` | 视频标题 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空结果 | 关键词未命中 | 告知用户，建议换关键词 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级：fetch_general_search（Web 端） |

---

### fetch_search_by_type — 分类搜索（App 端）

**Full path:** `/api/v1/bilibili/app/fetch_search_by_type`
**Method:** GET · **Risk:** low

#### 用途
用关键词进行分类搜索（App 端）。可按 video/bangumi/pgc/live/article/user 类型过滤。

#### 何时使用 / 不使用
- ✅ 用户想搜特定类型内容（如只搜用户、只搜直播）
- ✅ 链式起点：keyword + search_type → mid/roomid
- ❌ 综合搜索 → fetch_search_all
- ❌ 不需要类型过滤 → fetch_search_all 更简单

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| search_type | string | no | enum=`video/bangumi/pgc/live/article/user` | 搜索类型（default: video） |
| page | integer | no | ≥1 | 页码（default: 1） |
| page_size | integer | no | ≥1 | 每页数量（default: 20） |
| order | integer | no | enum=`0,1,2,3` | 排序：0=综合，1=最新，2=播放量，3=弹幕数（default: 0） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| result[].bvid | `$.data.result[].bvid` | 视频 BV号（search_type=video） | video.md |
| result[].mid | `$.data.result[].mid` | 用户 UID（search_type=user） | user.md |
| result[].roomid | `$.data.result[].roomid` | 直播间 ID（search_type=live） | live.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空结果 | 关键词+类型未命中 | 告知用户 | 0 | — |

---

### fetch_home_feed — 首页推荐流（App 端）

**Full path:** `/api/v1/bilibili/app/fetch_home_feed`
**Method:** GET · **Risk:** low

#### 用途
获取首页推荐视频流（App 端）。**视频冷启动入口**——用户没有明确目标时，可从此端点采集 bv_id。

#### 何时使用 / 不使用
- ✅ 用户问"有什么好看的视频"等无明确目标场景
- ✅ 链式起点：批量取 bv_id 后并行调用 video.md 端点
- ❌ 用户有明确关键词 → 用搜索端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| idx | integer | no | — | 页面索引（default: 当前时间戳） |
| flush | integer | no | enum=`0,1` | 刷新标记：0=普通，1=刷新（default: 0） |
| pull | boolean | no | — | 下拉刷新（default: true） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| item[].bvid | `$.data.item[].bvid` | 推荐视频 BV号 | video.md 多端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代（feed 是最顶层入口） |

---

### fetch_popular_feed — 热门推荐（App 端）

**Full path:** `/api/v1/bilibili/app/fetch_popular_feed`
**Method:** GET · **Risk:** low

#### 用途
获取热门推荐视频（App 端）。

#### 何时使用 / 不使用
- ✅ 用户想看热门视频
- ❌ 用户有明确关键词 → 用搜索端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| idx | integer | no | ≥1 | 页面索引（default: 1） |
| last_param | string | no | — | 上一页最后视频 ID（分页用） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].bvid | `$.data.list[].bvid` | 热门视频 BV号 | video.md 多端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级：fetch_com_popular（Web 端） |

---

### fetch_cinema_tab — 影视推荐（App 端）

**Full path:** `/api/v1/bilibili/app/fetch_cinema_tab`
**Method:** GET · **Risk:** low

#### 用途
获取影视推荐数据（App 端，无参数）。

#### 何时使用 / 不使用
- ✅ 用户想看影视推荐
- ❌ 想看番剧 → fetch_bangumi_tab

#### 输入 (IN)
无参数

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 影视推荐数据 | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_bangumi_tab — 番剧推荐（App 端）

**Full path:** `/api/v1/bilibili/app/fetch_bangumi_tab`
**Method:** GET · **Risk:** low

#### 用途
获取番剧推荐数据（App 端，无参数）。

#### 何时使用 / 不使用
- ✅ 用户想看番剧推荐
- ❌ 想看影视 → fetch_cinema_tab

#### 输入 (IN)
无参数

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 番剧推荐数据 | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_hot_search — 热门搜索（Web 端）

**Full path:** `/api/v1/bilibili/web/fetch_hot_search`
**Method:** GET · **Risk:** low

#### 用途
获取 B站 热门搜索关键词列表。

#### 何时使用 / 不使用
- ✅ 用户想看热搜榜
- ✅ 链式起点：热搜词 → 搜索端点的 keyword
- ❌ 已有搜索关键词 → 直接搜索

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| limit | string | yes | 1-50 | 返回数量，如 `10` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 热搜关键词列表 | 热搜词可作为 fetch_search_all / fetch_general_search 的 keyword |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_general_search — 综合搜索（Web 端）

**Full path:** `/api/v1/bilibili/web/fetch_general_search`
**Method:** GET · **Risk:** low

#### 用途
用关键词进行综合搜索（Web 端，4 个必填参数）。**Web 端搜索首选**——支持更多排序和筛选选项。

#### 何时使用 / 不使用
- ✅ 用户需要 Web 端搜索
- ✅ 需要更多排序/筛选选项（时长、时间范围）
- ❌ 只需简单搜索 → fetch_search_all（App 端，参数更少）
- ❌ 4 个必填参数不全 → 补全后再调用

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| order | string | yes | enum=`totalrank/click/pubdate/dm/stow` | 排序方式 |
| page | integer | yes | ≥1 | 页码 |
| page_size | integer | yes | ≥1 | 每页数量 |
| duration | integer | no | enum=`0,1,2,3,4` | 时长筛选：0=全部，1=<10min，2=10-30min，3=30-60min，4=>60min |
| pubtime_begin_s | integer | no | 10 位时间戳 | 开始时间 |
| pubtime_end_s | integer | no | 10 位时间戳 | 结束时间 |

> **注意**：本端点有 4 个必填参数（keyword/order/page/page_size），缺少任何一个将返回 400。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| result[].bvid | `$.data.result[].bvid` | 视频 BV号 | video.md 多端点 |
| result[].aid | `$.data.result[].aid` | 视频 AV号 | video.md |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 必填参数缺失 | 补全参数后重试 | ≤1 次 | — |
| 空结果 | 关键词未命中 | 告知用户 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级：fetch_search_all（App 端） |

---

### fetch_com_popular — 综合热门（Web 端）

**Full path:** `/api/v1/bilibili/web/fetch_com_popular`
**Method:** GET · **Risk:** low

#### 用途
获取综合热门视频列表（Web 端）。

#### 何时使用 / 不使用
- ✅ 用户想看热门视频（Web 端）
- ❌ App 端 → fetch_popular_feed

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| pn | integer | no | ≥1 | 页码（default: 1） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].bvid | `$.data.list[].bvid` | 热门视频 BV号 | video.md 多端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级：fetch_popular_feed（App 端） |
