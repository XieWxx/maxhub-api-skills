# TikTok Video / TikTok 视频

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
视频详情（App V3 + Web API）、批量视频、分享链接取视频、探索页、首页推荐、Tag 作品、合辑列表、视频 ID 提取、播放数增加、APP 唤起。**aweme_id 多在本文件首步产出**，是评论、搜索、分析等链式调用的常见起点。

> 🔒 **Security:** All requests transmit your `MAXHUB_API_KEY` and query data to `https://www.aconfig.cn`. Never expose API keys in logs, prompts, or client-side storage. Web API endpoints return video CDN links requiring `tt_chain_token` Cookie for access.

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| fetch_one_video_v3 | ⭐⭐⭐ 首选 | 用 aweme_id 取视频详情（支持国家参数，**链式起点**） | GET | /api/v1/tiktok/app/v3/fetch_one_video_v3 | low |
| fetch_one_video | ⭐⭐ 降级 | 用 aweme_id 取视频详情 V1 | GET | /api/v1/tiktok/app/v3/fetch_one_video | low |
| fetch_one_video_v2 | ⭐⭐ 降级 | 用 aweme_id 取视频详情 V2 | GET | /api/v1/tiktok/app/v3/fetch_one_video_v2 | low |
| fetch_multi_video_v2 | ⭐⭐⭐ 首选 | 批量获取视频信息（最多 25 个） | POST | /api/v1/tiktok/app/v3/fetch_multi_video_v2 | low |
| fetch_multi_video | ⭐⭐ 降级 | 批量获取视频信息（最多 10 个） | POST | /api/v1/tiktok/app/v3/fetch_multi_video | low |
| fetch_one_video_by_share_url_v2 | ⭐⭐⭐ 首选 | 用分享链接取视频详情 V2 | GET | /api/v1/tiktok/app/v3/fetch_one_video_by_share_url_v2 | low |
| fetch_one_video_by_share_url | ⭐⭐ 降级 | 用分享链接取视频详情 V1 | GET | /api/v1/tiktok/app/v3/fetch_one_video_by_share_url | low |
| fetch_post_detail | ⭐⭐ 条件 | 用 itemId 取视频详情（Web API，需 tt_chain_token） | GET | /api/v1/tiktok/web/fetch_post_detail | low |
| fetch_post_detail_v2 | ⭐⭐ 条件 | 用 itemId 取视频详情 V2（Web API） | GET | /api/v1/tiktok/web/fetch_post_detail_v2 | low |
| fetch_explore_post | ⭐⭐ 条件 | 取探索页视频（按分类） | GET | /api/v1/tiktok/web/fetch_explore_post | low |
| fetch_home_feed_app_v3 | ⭐⭐ 条件 | 取主页视频推荐（App V3） | POST | /api/v1/tiktok/app/v3/fetch_home_feed | low |
| fetch_home_feed_web | ⭐⭐ 条件 | 取首页推荐（Web API） | POST | /api/v1/tiktok/web/fetch_home_feed | low |
| fetch_tag_post | ⭐⭐ 条件 | 用 challengeID 取 Tag 作品 | GET | /api/v1/tiktok/web/fetch_tag_post | low |
| fetch_user_mix | ⭐⭐ 条件 | 用 mixId 取用户合辑 | GET | /api/v1/tiktok/web/fetch_user_mix | low |
| fetch_creator_search_insights_videos | ⭐⭐ 条件 | 取创作者搜索洞察相关视频 | GET | /api/v1/tiktok/app/v3/fetch_creator_search_insights_videos | low |
| add_video_play_count | ⚠️ 写入 | 增加视频播放数 | GET | /api/v1/tiktok/app/v3/add_video_play_count | **high ⚠️** |
| open_tiktok_app_to_video_detail | ⭐ 条件 | 唤起 APP 跳转视频详情 | GET | /api/v1/tiktok/app/v3/open_tiktok_app_to_video_detail | low |
| get_aweme_id | ⭐⭐⭐ 首选 | 从视频链接提取 aweme_id | GET | /api/v1/tiktok/web/get_aweme_id | low |
| get_all_aweme_id | ⭐⭐ 条件 | 批量提取 aweme_id | POST | /api/v1/tiktok/web/get_all_aweme_id | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看视频 + 评论 | fetch_one_video_v3 → 跳转 `comments.md` fetch_video_comments | `$.data.data.aweme_id` → `aweme_id` | 第 1 步失败：STOP；第 2 步失败：返回视频详情 + "评论暂不可取" |
| 看视频 + 作者主页 | fetch_one_video_v3 → 跳转 `user.md` handler_user_profile | `$.data.data.author.sec_uid` → `sec_user_id` | 跨文件链路 |
| 分享链接 → 视频详情 | fetch_one_video_by_share_url_v2 → fetch_one_video_v3 | `$.data.data.aweme_id` → `aweme_id` | 第 1 步失败：STOP |
| URL → aweme_id → 视频详情 | get_aweme_id → fetch_one_video_v3 | `$.data.data.aweme_id` → `aweme_id` | 第 1 步失败：STOP |
| 看视频 + 分析 | fetch_one_video_v3 → 跳转 `analytics.md` fetch_video_metrics | `$.data.data.aweme_id` → `item_id` | 跨文件链路 |
| 探索页 → 视频详情 | fetch_explore_post → fetch_one_video_v3 | `$.data.data.itemList[].id` → `aweme_id` | 第 2 步空：返回探索列表 |
| Tag → 视频详情 | fetch_tag_post → fetch_one_video_v3 | `$.data.data.itemList[].id` → `aweme_id` | 同上 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`user.md` 的 `fetch_user_post_videos` 输出 `$.data.data.aweme_list[].aweme_id` → 本文件多端点的 `aweme_id`
- **流入本文件**：`search.md` 的 `fetch_video_search_result` 输出 `$.data.data.video_list[].aweme_id` → 本文件
- **流出本文件**：`$.data.data.aweme_id` → `comments.md` 全部评论端点的 `aweme_id` / `item_id`
- **流出本文件**：`$.data.data.author.sec_uid` → `user.md` 全部 user 系端点的 `sec_user_id`
- **流出本文件**：`$.data.data.aweme_id` → `analytics.md` 的 `item_id`

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项；通用规则见此处。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**
- **禁止**：❌ 改路径段（v3→v2 试探）❌ 切换平台前缀 ❌ 拼接新路径

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP

### Web API 特有：tt_chain_token CDN 403
- Web API 端点返回的视频 CDN 链接需携带 `Cookie: tt_chain_token={tt_chain_token}`
- 如遇 403 → 提示用户携带 Cookie，或**降级**到 App V3 接口（无此限制）

### 鉴权错误（401）→ STOP，提示用户检查 API Key
### 余额 / 付费（402）→ STOP，告知用户充值
### 权限错误（403）→ STOP，按子场景告知用户
### 限流（429）→ 读 Retry-After 退避；最多重试 2 次
### 上游故障（500/502/503/504）→ 等 3 秒重试 1 次 → 走端点替换
### 业务错误（HTTP 200 且 `code != 0`）→ 读 `message_zh` 报告，不重试

---

## 端点详情

### fetch_one_video_v3 — 获取单个视频详情 V3（支持国家参数）

**Full path:** `/api/v1/tiktok/app/v3/fetch_one_video_v3`
**Method:** GET · **Risk:** low

#### 用途
获取单个视频的完整详情数据，支持国家/地区参数。**链式调用的常见起点**——大多数 aweme_id 与 author.sec_uid 从此处产出。

#### 何时使用 / 不使用
- ✅ 用户提供 aweme_id，需要视频详情
- ✅ 链式起点：取 aweme_id 或 author.sec_uid
- ✅ 需要指定国家/地区获取数据
- ❌ 想看评论 → 直接用 `comments.md` 的 fetch_video_comments
- ❌ 想看作者其他作品 → 用 `user.md` 的 fetch_user_post_videos
- ❌ 仅有分享链接 → 用 fetch_one_video_by_share_url_v2

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | yes | 纯数字长整型 | 视频/作品 ID，如 `7350810998023949599` |
| region | string | no | ISO 3166-1 alpha-2 | 国家代码，默认 US，如 US、GB、FR、DE、IN、JP 等 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_id | `$.data.data.aweme_id` | 视频 ID | comments.md 全部评论端点 / analytics.md / add_video_play_count |
| author.sec_uid | `$.data.data.author.sec_uid` | 作者 sec_user_id | user.md 全部 user 系端点 |
| author.uid | `$.data.data.author.uid` | 作者 user_id | user.md / fetch_creator_info |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 视频不存在/已删除 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 fetch_one_video_v2 / fetch_one_video |

---

### fetch_one_video — 获取单个视频详情 V1

**Full path:** `/api/v1/tiktok/app/v3/fetch_one_video`
**Method:** GET · **Risk:** low

#### 用途
获取单个视频详情 V1。作为 V3 的降级备选。

#### 何时使用 / 不使用
- ✅ V3 接口失败时的降级选择
- ❌ 需要国家参数 → 用 fetch_one_video_v3

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | yes | 纯数字长整型 | 视频 ID |

#### 输出可链式字段 (OUT)
同 fetch_one_video_v3

#### 错误处理 (ERR)
同 fetch_one_video_v3

---

### fetch_one_video_v2 — 获取单个视频详情 V2

**Full path:** `/api/v1/tiktok/app/v3/fetch_one_video_v2`
**Method:** GET · **Risk:** low

#### 用途
获取单个视频详情 V2。作为 V3 的降级备选。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | yes | 纯数字长整型 | 视频 ID |

#### 输出可链式字段 (OUT)
同 fetch_one_video_v3

---

### fetch_multi_video_v2 — 批量获取视频信息 V2（最多 25 个）

**Full path:** `/api/v1/tiktok/app/v3/fetch_multi_video_v2`
**Method:** POST · **Risk:** low

#### 用途
一次性获取最多 25 个视频的详情数据。比 V1 更高效。

#### 何时使用 / 不使用
- ✅ 用户需要批量查看多个视频信息
- ❌ 只需一个视频 → 用 fetch_one_video_v3
- ❌ V2 报错 → 用 fetch_multi_video（V1，最多 10 个）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_ids | array[string] | yes | maxItems=25 | 视频 ID 列表 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.data.aweme_list[].aweme_id` | 视频 ID | 同 fetch_one_video_v3 的 OUT |

---

### fetch_multi_video — 批量获取视频信息（最多 10 个）

**Full path:** `/api/v1/tiktok/app/v3/fetch_multi_video`
**Method:** POST · **Risk:** low

#### 用途
批量获取视频信息 V1，最多 10 个。作为 V2 的降级备选。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_ids | array[string] | yes | maxItems=10 | 视频 ID 列表 |

---

### fetch_one_video_by_share_url_v2 — 用分享链接取视频详情 V2

**Full path:** `/api/v1/tiktok/app/v3/fetch_one_video_by_share_url_v2`
**Method:** GET · **Risk:** low

#### 用途
通过 TikTok 分享链接获取视频详情 V2，返回 region 字段。

#### 何时使用 / 不使用
- ✅ 用户提供分享链接（如 `https://www.tiktok.com/t/ZTFNEj8Hk/`）
- ❌ 已有 aweme_id → 直接用 fetch_one_video_v3

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| share_url | string | yes | startsWith=`https://www.tiktok.com/t/` 或 `https://vm.tiktok.com/` | 分享链接 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_id | `$.data.data.aweme_id` | 视频 ID | 同 fetch_one_video_v3 的 OUT |

---

### fetch_one_video_by_share_url — 用分享链接取视频详情 V1

**Full path:** `/api/v1/tiktok/app/v3/fetch_one_video_by_share_url`
**Method:** GET · **Risk:** low

#### 用途
通过分享链接获取视频详情 V1。作为 V2 的降级备选。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| share_url | string | yes | — | 分享链接 |

---

### fetch_post_detail — 获取视频详情（Web API）

**Full path:** `/api/v1/tiktok/web/fetch_post_detail`
**Method:** GET · **Risk:** low

#### 用途
通过 Web API 获取视频详情。注意：返回的视频 CDN 链接需要 `tt_chain_token` Cookie 才能访问。

#### 何时使用 / 不使用
- ✅ 需要 Web API 特有字段时
- ❌ 仅需基本视频信息 → 优先用 App V3 接口（无 CDN 限制）
- ❌ 不想处理 tt_chain_token → 用 App V3 接口

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| itemId | string | yes | 纯数字长整型 | 视频 ID（注意参数名是 itemId 而非 aweme_id） |

> ⚠️ **参数名注意**：Web API 使用 `itemId`，App V3 使用 `aweme_id`，两者值相同但参数名不同。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| tt_chain_token | 响应中的 `tt_chain_token` 字段 | CDN 访问令牌 | 访问视频 CDN 链接时携带 |

---

### fetch_post_detail_v2 — 获取视频详情 V2（Web API）

**Full path:** `/api/v1/tiktok/web/fetch_post_detail_v2`
**Method:** GET · **Risk:** low

#### 用途
同 fetch_post_detail，V2 版本。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| itemId | string | yes | 纯数字长整型 | 视频 ID |

---

### fetch_explore_post — 获取探索页视频

**Full path:** `/api/v1/tiktok/web/fetch_explore_post`
**Method:** GET · **Risk:** low

#### 用途
获取 TikTok 探索页视频，支持按分类筛选。**视频冷启动入口**——用户没有具体 aweme_id 时可从此端点采集。

#### 何时使用 / 不使用
- ✅ 用户想浏览热门视频（无明确目标）
- ✅ 按分类浏览（动画、美食、游戏等）
- ❌ 已有 aweme_id → 直接 fetch_one_video_v3

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| categoryType | string | no | enum: 100-120 | 分类代码：100=动画漫画 101=表演 102=美容 103=游戏 104=喜剧 105=日常 106=家庭 107=情感 108=戏剧 109=穿搭 110=对口型 111=美食 112=运动 113=动物 114=社会 115=汽车 116=教育 117=健身 118=科技 119=歌舞 120=全部 |
| count | integer | no | default=16 | 每页数量 |

> ⚠️ Web API 返回的视频 CDN 链接需 tt_chain_token。

---

### fetch_home_feed_app_v3 — 取主页视频推荐（App V3）

**Full path:** `/api/v1/tiktok/app/v3/fetch_home_feed`
**Method:** POST · **Risk:** low

#### 用途
获取 TikTok 主页推荐视频数据。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cookie | string | no | — | 用户 cookie，可选，用于个性化推荐 |

---

### fetch_home_feed_web — 取首页推荐（Web API）

**Full path:** `/api/v1/tiktok/web/fetch_home_feed`
**Method:** POST · **Risk:** low

#### 用途
获取 TikTok 首页推荐作品（Web API）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| count | integer | no | default=15 | 每页数量 |
| cookie | string | no | — | 用户 cookie，可选 |

> ⚠️ Web API 返回的视频 CDN 链接需 tt_chain_token。

---

### fetch_tag_post — 获取 Tag 作品

**Full path:** `/api/v1/tiktok/web/fetch_tag_post`
**Method:** GET · **Risk:** low

#### 用途
获取指定 Tag（话题）下的视频列表。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| challengeID | string | yes | — | Tag ID |
| count | integer | no | default=30 | 每页数量 |
| cursor | integer | no | default=0 | 翻页游标 |

---

### fetch_user_mix — 获取用户合辑

**Full path:** `/api/v1/tiktok/web/fetch_user_mix`
**Method:** GET · **Risk:** low

#### 用途
获取用户的合辑（播放列表）中的视频。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| mixId | string | yes | — | 合辑 ID |
| cursor | integer | no | default=0 | 翻页游标 |
| count | integer | no | default=30 | 每页数量 |

---

### fetch_creator_search_insights_videos — 创作者搜索洞察相关视频

**Full path:** `/api/v1/tiktok/app/v3/fetch_creator_search_insights_videos`
**Method:** GET · **Risk:** low

#### 用途
获取创作者搜索洞察中某个关键词下的热门相关视频。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词，从 fetch_creator_search_insights 获取 |
| offset | integer | no | default=0 | 分页偏移量 |
| count | integer | no | default=20 | 每页数量 |

---

### add_video_play_count — 增加视频播放数 ⚠️ 写入操作

**Full path:** `/api/v1/tiktok/app/v3/add_video_play_count`
**Method:** GET · **Risk:** high · **requires_user_confirmation:** true · **write_operation:** true

#### 用途
根据视频 ID 增加作品的播放数。**调用前必须由用户明确确认参数**。

#### 何时使用 / 不使用
- ✅ 用户明确要求增加视频播放数
- ❌ 用户未确认 → 先与用户确认
- ❌ 仅需查看视频信息 → 用 fetch_one_video_v3

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_type | integer | yes | enum: [0, 1] | 作品类型：0=视频 1=图文 |
| item_id | string | yes | 纯数字长整型 | 视频 ID（即 aweme_id） |

> ⚠️ **写入操作前置确认**：调用前必须向用户确认 aweme_type 和 item_id 准确无误。

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400/422 | 参数错 | **重新让用户确认参数**，禁止自行修正后重试 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | **≤1 次** | 仍失败 STOP |
| 业务 code≠0 | 邀请码无效/频率限制 | 读 `message_zh` 告知用户 | 0 | — |

---

### open_tiktok_app_to_video_detail — 唤起 APP 跳转视频详情

**Full path:** `/api/v1/tiktok/app/v3/open_tiktok_app_to_video_detail`
**Method:** GET · **Risk:** low

#### 用途
生成 TikTok 分享链接，唤起 TikTok APP 跳转到指定视频详情页。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | yes | 纯数字长整型 | 视频 ID |

---

### get_aweme_id — 从视频链接提取 aweme_id

**Full path:** `/api/v1/tiktok/web/get_aweme_id`
**Method:** GET · **Risk:** low

#### 用途
从 TikTok 视频链接中提取 aweme_id。**URL → aweme_id 的链式入口**。

#### 何时使用 / 不使用
- ✅ 用户提供视频 URL 但需要 aweme_id
- ✅ 链式起点：URL → aweme_id → fetch_one_video_v3
- ❌ 已有 aweme_id → 直接用 fetch_one_video_v3

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| url | string | yes | startsWith=`https://www.tiktok.com/@` | 视频链接 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_id | `$.data.data.aweme_id` | 视频 ID | 本文件多端点 |

---

### get_all_aweme_id — 批量提取 aweme_id

**Full path:** `/api/v1/tiktok/web/get_all_aweme_id`
**Method:** POST · **Risk:** low

#### 用途
批量从视频链接中提取 aweme_id，最多支持 20 个链接。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| url | array[string] | yes | maxItems=20 | 视频链接列表 |
