# TikTok Search & Discovery / TikTok 搜索与发现

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
综合搜索、分类搜索（视频/用户/音乐/话题/直播/地点/照片/商品）、热门关键词、话题详情与作品、音乐详情与排行榜、创作者搜索洞察、关键词推荐、标签详情、直播推荐、短链接、内容翻译、APP 唤起搜索。**keyword 与 search_id 多在本文件首步产出**，是视频、用户等链式调用的常见起点。

> 🔒 **Security:** All requests transmit your `MAXHUB_API_KEY` and query data to `https://www.aconfig.cn`. Never expose API keys in logs, prompts, or client-side storage. Web API endpoints return video CDN links requiring `tt_chain_token` Cookie for access. Some Web API search endpoints may require cookie — use only with explicit user authorization.

> ⚠️ **Web API 翻页特有**：Web API 搜索端点使用 `search_id` 翻页，首次为空，后续从上次响应获取（JSON Path: `$.data.extra.logid` 或 `$.data.log_pb.impr_id`）。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| fetch_general_search_result | ⭐⭐⭐ 首选 | 综合搜索（App V3，支持排序和时间筛选） | GET | /api/v1/tiktok/app/v3/fetch_general_search_result | low |
| fetch_video_search_result | ⭐⭐⭐ 首选 | 视频搜索（App V3，支持 region） | GET | /api/v1/tiktok/app/v3/fetch_video_search_result | low |
| fetch_user_search_result | ⭐⭐⭐ 首选 | 用户搜索（App V3，支持粉丝数筛选） | GET | /api/v1/tiktok/app/v3/fetch_user_search_result | low |
| fetch_music_search_result | ⭐⭐ 条件 | 音乐搜索（App V3） | GET | /api/v1/tiktok/app/v3/fetch_music_search_result | low |
| fetch_hashtag_search_result | ⭐⭐ 条件 | 话题搜索（App V3） | GET | /api/v1/tiktok/app/v3/fetch_hashtag_search_result | low |
| fetch_live_search_result | ⭐⭐ 条件 | 直播搜索（App V3） | GET | /api/v1/tiktok/app/v3/fetch_live_search_result | low |
| fetch_location_search | ⭐⭐ 条件 | 地点搜索（App V3） | GET | /api/v1/tiktok/app/v3/fetch_location_search | low |
| fetch_music_detail | ⭐⭐⭐ 首选 | 音乐详情 | GET | /api/v1/tiktok/app/v3/fetch_music_detail | low |
| fetch_music_video_list | ⭐⭐ 条件 | 音乐关联视频列表 | GET | /api/v1/tiktok/app/v3/fetch_music_video_list | low |
| fetch_hashtag_detail | ⭐⭐⭐ 首选 | 话题详情 | GET | /api/v1/tiktok/app/v3/fetch_hashtag_detail | low |
| fetch_hashtag_video_list | ⭐⭐ 条件 | 话题关联视频列表 | GET | /api/v1/tiktok/app/v3/fetch_hashtag_video_list | low |
| fetch_creator_search_insights | ⭐⭐ 条件 | 创作者搜索洞察（**query_id 入口**） | GET | /api/v1/tiktok/app/v3/fetch_creator_search_insights | low |
| fetch_creator_search_insights_detail | ⭐⭐ 条件 | 搜索洞察详情（用户画像） | GET | /api/v1/tiktok/app/v3/fetch_creator_search_insights_detail | low |
| fetch_creator_search_insights_trend | ⭐⭐ 条件 | 搜索洞察趋势 | GET | /api/v1/tiktok/app/v3/fetch_creator_search_insights_trend | low |
| fetch_music_chart_list | ⭐⭐ 条件 | 音乐排行榜（Top 50 / Viral 50） | GET | /api/v1/tiktok/app/v3/fetch_music_chart_list | low |
| fetch_product_search | ⭐⭐ 条件 | 商品搜索（支持价格/评分筛选） | GET | /api/v1/tiktok/app/v3/fetch_product_search | low |
| fetch_share_short_link | ⭐ 条件 | 获取分享短链接 | GET | /api/v1/tiktok/app/v3/fetch_share_short_link | low |
| fetch_content_translate | ⭐⭐ 条件 | 内容翻译（支持 20+ 语言） | POST | /api/v1/tiktok/app/v3/fetch_content_translate | low |
| open_tiktok_app_to_keyword_search | ⭐ 条件 | 唤起 APP 跳转关键词搜索 | GET | /api/v1/tiktok/app/v3/open_tiktok_app_to_keyword_search | low |
| fetch_general_search | ⭐⭐ 条件 | 综合搜索（Web API，需 search_id 翻页） | GET | /api/v1/tiktok/web/fetch_general_search | low |
| fetch_trending_searchwords | ⭐⭐ 条件 | 每日热门搜索关键词 | GET | /api/v1/tiktok/web/fetch_trending_searchwords | low |
| fetch_search_keyword_suggest | ⭐⭐ 条件 | 搜索关键词推荐 | GET | /api/v1/tiktok/web/fetch_search_keyword_suggest | low |
| fetch_search_user | ⭐⭐ 条件 | 搜索用户（Web API） | GET | /api/v1/tiktok/web/fetch_search_user | low |
| fetch_search_video | ⭐⭐ 条件 | 搜索视频（Web API） | GET | /api/v1/tiktok/web/fetch_search_video | low |
| fetch_search_live | ⭐⭐ 条件 | 搜索直播（Web API） | GET | /api/v1/tiktok/web/fetch_search_live | low |
| fetch_search_photo | ⭐⭐ 条件 | 搜索照片（Web API） | GET | /api/v1/tiktok/web/fetch_search_photo | low |
| fetch_tag_detail | ⭐⭐ 条件 | Tag 详情（Web API） | GET | /api/v1/tiktok/web/fetch_tag_detail | low |
| fetch_live_recommend | ⭐⭐ 条件 | 直播首页推荐（需先获取标签） | GET | /api/v1/tiktok/web/fetch_live_recommend | low |
| fetch_live_recommend_tabs | ⭐⭐⭐ 首选 | 直播推荐可用标签（**fetch_live_recommend 前置**） | GET | /api/v1/tiktok/web/fetch_live_recommend_tabs | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 关键词 → 视频 → 详情 | fetch_video_search_result → video.md fetch_one_video_v3 | `$.data.data.video_list[].aweme_id` → `aweme_id` | 跨文件链路 |
| 关键词 → 用户 → 资料 | fetch_user_search_result → user.md handler_user_profile | `$.data.data.user_list[].user.uid` → `user_id` | 跨文件链路 |
| 话题搜索 → 话题详情 → 视频 | fetch_hashtag_search_result → fetch_hashtag_detail → fetch_hashtag_video_list | `ch_id` 接力 | 第 1 步空：STOP |
| 音乐搜索 → 音乐详情 → 视频 | fetch_music_search_result → fetch_music_detail → fetch_music_video_list | `music_id` 接力 | 同上 |
| 搜索洞察 → 详情/趋势 | fetch_creator_search_insights → fetch_creator_search_insights_detail / fetch_creator_search_insights_trend | `query_id_str` 接力 | 第 1 步空：STOP |
| 直播推荐标签 → 推荐 | fetch_live_recommend_tabs → fetch_live_recommend | `tag_name` → `related_live_tag` | 第 1 步空：STOP |
| Web 搜索翻页 | fetch_general_search（首次）→ fetch_general_search（翻页） | `$.data.extra.logid` → `search_id` | 同端点翻页 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：无（本文件是搜索入口，通常作为链式起点）
- **流出本文件**：`fetch_video_search_result` 的 `$.data.data.video_list[].aweme_id` → `video.md` 多端点
- **流出本文件**：`fetch_user_search_result` 的 `$.data.data.user_list[].user.uid` → `user.md` handler_user_profile
- **流出本文件**：`fetch_live_search_result` 的 room_id → `comments.md` 直播端点
- **流出本文件**：`fetch_hashtag_video_list` 的 aweme_id → `video.md` 多端点

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项；通用规则见此处。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**
- **禁止**：❌ 改路径段 ❌ 切换平台前缀 ❌ 拼接新路径

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP

### Web API 特有：tt_chain_token CDN 403
- Web API 端点返回的视频 CDN 链接需携带 `Cookie: tt_chain_token={tt_chain_token}`
- 如遇 403 → 提示用户携带 Cookie，或**降级**到 App V3 接口

### Web API 特有：search_id 翻页
- Web API 搜索端点翻页需要 `search_id`，首次为空，后续从响应获取
- JSON Path: `$.data.extra.logid` 或 `$.data.log_pb.impr_id`
- 禁止臆造 search_id 值

### Web API 特有：敏感关键词
- Web API 搜索端点如返回 `status_code != 0`，可能是搜索了 TikTok 不允许的关键词
- 行动：更换关键词重试

### 鉴权错误（401）→ STOP，提示用户检查 API Key
### 余额 / 付费（402）→ STOP，告知用户充值
### 权限错误（403）→ STOP，按子场景告知用户
### 限流（429）→ 读 Retry-After 退避；最多重试 2 次
### 上游故障（500/502/503/504）→ 等 3 秒重试 1 次 → 走端点替换
### 业务错误（HTTP 200 且 `code != 0`）→ 读 `message_zh` 报告，不重试

---

## 端点详情

### fetch_general_search_result — 综合搜索（App V3）

**Full path:** `/api/v1/tiktok/app/v3/fetch_general_search_result`
**Method:** GET · **Risk:** low

#### 用途
获取指定关键词的综合搜索结果。**搜索链式调用的首选入口**——支持排序和时间筛选。

#### 何时使用 / 不使用
- ✅ 用户给出关键词，需要综合搜索结果
- ✅ 需要按相关度/点赞排序或按时间筛选
- ❌ 只需搜索视频 → fetch_video_search_result（更精准）
- ❌ 想用 Web API → fetch_general_search

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| offset | integer | no | default=0 | 偏移量 |
| count | integer | no | default=20 | 每页数量 |
| sort_type | integer | no | enum: [0, 1] | 排序类型：0=相关度 1=最多点赞 |
| publish_time | integer | no | enum: [0, 1, 7, 30, 90, 180] | 发布时间：0=不限制 1=最近一天 7=最近一周 30=最近一月 90=最近三月 180=最近半年 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| video_list[].aweme_id | `$.data.data.video_list[].aweme_id` | 视频 ID | video.md 多端点 |
| user_list[].user.uid | `$.data.data.user_list[].user.uid` | 用户 ID | user.md handler_user_profile |

---

### fetch_video_search_result — 视频搜索（App V3）

**Full path:** `/api/v1/tiktok/app/v3/fetch_video_search_result`
**Method:** GET · **Risk:** low

#### 用途
获取指定关键词的视频搜索结果。支持 region 参数指定国家/地区。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| offset | integer | no | default=0 | 偏移量 |
| count | integer | no | default=20 | 每页数量 |
| sort_type | integer | no | enum: [0, 1] | 排序类型：0=相关度 1=最多点赞 |
| publish_time | integer | no | enum: [0, 1, 7, 30, 90, 180] | 发布时间筛选 |
| region | string | no | ISO 3166-1 alpha-2 | 地区代码，默认 US |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| video_list[].aweme_id | `$.data.data.video_list[].aweme_id` | 视频 ID | video.md 多端点 |

---

### fetch_user_search_result — 用户搜索（App V3）

**Full path:** `/api/v1/tiktok/app/v3/fetch_user_search_result`
**Method:** GET · **Risk:** low

#### 用途
获取指定关键词的用户搜索结果。支持按粉丝数和账号类型筛选。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| offset | integer | no | default=0 | 偏移量 |
| count | integer | no | default=20 | 每页数量 |
| user_search_follower_count | string | no | enum: [空, ZERO_TO_ONE_K, ONE_K_TO_TEN_K, TEN_K_TO_ONE_H_K, ONE_H_K_PLUS] | 粉丝数筛选：空=不限制 ZERO_TO_ONE_K=0-1K ONE_K_TO_TEN_K=1K-10K TEN_K_TO_ONE_H_K=10K-100K ONE_H_K_PLUS=100K+ |
| user_search_profile_type | string | no | enum: [空, VERIFIED] | 账号类型：空=不限制 VERIFIED=认证用户 |
| user_search_other_pref | string | no | enum: [空, USERNAME] | 其他偏好：空=不限制 USERNAME=用户名相关性 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user_list[].user.uid | `$.data.data.user_list[].user.uid` | 用户 ID | user.md handler_user_profile |
| user_list[].user.sec_uid | `$.data.data.user_list[].user.sec_uid` | 用户 sec_uid | user.md fetch_user_post_videos_v3 |

---

### fetch_music_search_result — 音乐搜索（App V3）

**Full path:** `/api/v1/tiktok/app/v3/fetch_music_search_result`
**Method:** GET · **Risk:** low

#### 用途
获取指定关键词的音乐搜索结果。支持按标题/作者过滤和多种排序。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| offset | integer | no | default=0 | 偏移量，第二页从响应中获取 cursor 值 |
| count | integer | no | default=20, max=20 | 每页数量 |
| filter_by | integer | no | enum: [0, 1, 2] | 过滤类型：0=全部 1=标题 2=作者 |
| sort_type | integer | no | enum: [0, 1, 2, 3, 4] | 排序类型：0=相关度 1=最多使用 2=最新 3=时长最短 4=时长最长 |
| region | string | no | ISO 3166-1 alpha-2 | 地区代码，默认 US |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| music_list[].id | `$.data.data.music_list[].id` | 音乐 ID | fetch_music_detail / fetch_music_video_list |

---

### fetch_hashtag_search_result — 话题搜索（App V3）

**Full path:** `/api/v1/tiktok/app/v3/fetch_hashtag_search_result`
**Method:** GET · **Risk:** low

#### 用途
获取指定关键词的话题搜索结果。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| offset | integer | no | default=0 | 偏移量 |
| count | integer | no | default=20 | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| hashtag_list[].id | `$.data.data.hashtag_list[].id` | 话题 ID（ch_id） | fetch_hashtag_detail / fetch_hashtag_video_list |

---

### fetch_live_search_result — 直播搜索（App V3）

**Full path:** `/api/v1/tiktok/app/v3/fetch_live_search_result`
**Method:** GET · **Risk:** low

#### 用途
获取指定关键词的直播搜索结果。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| offset | integer | no | default=0 | 偏移量，第二页从响应中获取 cursor 值 |
| count | integer | no | default=20, max=20 | 每页数量 |
| region | string | no | ISO 3166-1 alpha-2 | 地区代码，默认 US |

---

### fetch_location_search — 地点搜索（App V3）

**Full path:** `/api/v1/tiktok/app/v3/fetch_location_search`
**Method:** GET · **Risk:** low

#### 用途
获取地点搜索结果。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| offset | integer | no | default=0 | 偏移量 |
| count | integer | no | default=20 | 每页数量 |

---

### fetch_music_detail — 音乐详情

**Full path:** `/api/v1/tiktok/app/v3/fetch_music_detail`
**Method:** GET · **Risk:** low

#### 用途
获取指定音乐的详情数据。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| music_id | string | yes | 纯数字 | 音乐 ID |

---

### fetch_music_video_list — 音乐关联视频列表

**Full path:** `/api/v1/tiktok/app/v3/fetch_music_video_list`
**Method:** GET · **Risk:** low

#### 用途
获取使用指定音乐的视频列表。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| music_id | string | yes | 纯数字 | 音乐 ID |
| cursor | integer | no | default=0 | 翻页游标 |
| count | integer | no | default=10 | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.data.aweme_list[].aweme_id` | 视频 ID | video.md 多端点 |

---

### fetch_hashtag_detail — 话题详情

**Full path:** `/api/v1/tiktok/app/v3/fetch_hashtag_detail`
**Method:** GET · **Risk:** low

#### 用途
获取指定话题的详情数据。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| ch_id | string | yes | — | 话题 ID |
| region | string | no | enum: [US, GB, FR, JP, VN, SG], default=US | 地区代码 |

---

### fetch_hashtag_video_list — 话题关联视频列表

**Full path:** `/api/v1/tiktok/app/v3/fetch_hashtag_video_list`
**Method:** GET · **Risk:** low

#### 用途
获取指定话题下的视频列表。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| ch_id | string | yes | — | 话题 ID |
| cursor | integer | no | default=0 | 翻页游标 |
| count | integer | no | default=10 | 每页数量 |
| region | string | no | enum: [US, GB, FR, JP, VN, SG], default=US | 地区代码 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.data.aweme_list[].aweme_id` | 视频 ID | video.md 多端点 |

---

### fetch_creator_search_insights — 创作者搜索洞察

**Full path:** `/api/v1/tiktok/app/v3/fetch_creator_search_insights`
**Method:** GET · **Risk:** low

#### 用途
获取创作者搜索洞察数据，了解热门搜索趋势和创作灵感。**query_id_str 的链式入口**。

#### 何时使用 / 不使用
- ✅ 用户想了解热门搜索趋势
- ✅ 链式起点：获取 query_id_str 给详情/趋势端点
- ❌ 想搜索具体视频 → fetch_video_search_result

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| offset | integer | no | default=0 | 分页偏移量 |
| limit | integer | no | default=20 | 每页数量 |
| tab | string | no | enum: [all, content_gap, follower_searched, life_style, topics, challenges, sounds, hashtags] | 标签页类型，默认 all |
| language_filters | string | no | 逗号分隔 | 语言过滤器：id/de/en/es/fr/pt/vi/tr/ar/th/ja/ko，默认 en |
| category_filters | string | no | 逗号分隔 | 分类过滤器：Gaming/Fashion/Tourism/Science/Food/Sports |
| creator_source | string | no | default=general_search | 创作者来源 |
| force_refresh | boolean | no | default=False | 是否强制刷新 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| query_id_str | `$.data.data.query_id_str` | 搜索词条 ID | fetch_creator_search_insights_detail / fetch_creator_search_insights_trend / video.md fetch_creator_search_insights_videos |

---

### fetch_creator_search_insights_detail — 搜索洞察详情

**Full path:** `/api/v1/tiktok/app/v3/fetch_creator_search_insights_detail`
**Method:** GET · **Risk:** low

#### 用途
获取特定搜索词条的搜索统计数据，包含搜索趋势、用户画像（性别/年龄/国家）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| query_id_str | string | yes | — | 搜索词条 ID，从 fetch_creator_search_insights 获取 |
| time_range | string | no | enum: [past_7_days, past_30_days, past_60_days, past_6_months, custom] | 时间范围，默认 past_30_days |
| start_date | integer | no | 仅 time_range=custom | 开始时间戳（秒） |
| end_date | integer | no | 仅 time_range=custom | 结束时间戳（秒），不能超过 6 个月 |
| dimension_list | string | no | 逗号分隔: gender/age/country | 维度列表，默认 gender,age,country |

---

### fetch_creator_search_insights_trend — 搜索洞察趋势

**Full path:** `/api/v1/tiktok/app/v3/fetch_creator_search_insights_trend`
**Method:** GET · **Risk:** low

#### 用途
获取搜索洞察趋势数据，包含地区和时间维度的搜索热度。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| query_id_str | string | yes | — | 搜索词条 ID，从 fetch_creator_search_insights 获取 |
| from_tab_path | string | no | default=TRENDING,TOPICS | 来源标签路径 |
| query_analysis_required | boolean | no | default=True | 是否需要查询分析 |

---

### fetch_music_chart_list — 音乐排行榜

**Full path:** `/api/v1/tiktok/app/v3/fetch_music_chart_list`
**Method:** GET · **Risk:** low

#### 用途
获取 TikTok 音乐排行榜数据（Top 50 或 Viral 50）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| scene | integer | no | enum: [0, 1] | 排行榜类型：0=Top 50 1=Viral 50 |
| cursor | integer | no | default=0 | 分页游标 |
| count | integer | no | default=50, max=50 | 每页数量 |

---

### fetch_product_search — 商品搜索

**Full path:** `/api/v1/tiktok/app/v3/fetch_product_search`
**Method:** GET · **Risk:** low

#### 用途
获取商品搜索结果。支持价格、评分、优惠等筛选。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| cursor | integer | no | default=0 | 翻页游标 |
| count | integer | no | default=12 | 每页数量 |
| sort_type | integer | no | enum: [1, 2, 3, 4, 5] | 排序：1=综合 2=销量 3=价格高到低 4=价格低到高 5=最新 |
| customer_review_four_star | boolean | no | default=False | 四星以上评价 |
| have_discount | boolean | no | default=False | 有优惠 |
| min_price | string | no | — | 最低价格 |
| max_price | string | no | — | 最高价格 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| products[].product_id | `$.data.data.products[].product_id` | 商品 ID | shop.md 相关端点 |

---

### fetch_share_short_link — 获取分享短链接

**Full path:** `/api/v1/tiktok/app/v3/fetch_share_short_link`
**Method:** GET · **Risk:** low

#### 用途
将长链接转换为 TikTok 分享短链接。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| url | string | yes | — | 长链接或想要转换的链接 |

---

### fetch_content_translate — 内容翻译

**Full path:** `/api/v1/tiktok/app/v3/fetch_content_translate`
**Method:** POST · **Risk:** low

#### 用途
翻译文本内容，支持 20+ 种语言。源内容不超过 5000 字符，超出部分只翻译前 5000 字符。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| trg_lang | string | yes | — | 目标语言：zh-Hans/zh-Hant/en/ja/ko/fr/de/ru/es/pt/vi/th/id/ar/it/tr/he/pl/nl/sv/da/fi/no/cs/hu |
| src_content | string | yes | maxLength=5000 | 需要翻译的内容 |

---

### open_tiktok_app_to_keyword_search — 唤起 APP 跳转关键词搜索

**Full path:** `/api/v1/tiktok/app/v3/open_tiktok_app_to_keyword_search`
**Method:** GET · **Risk:** low

#### 用途
生成 TikTok 分享链接，唤起 APP 跳转到指定关键词搜索结果。如未能跳转，需确保 APP 已在后台运行。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |

---

### fetch_general_search — 综合搜索（Web API）

**Full path:** `/api/v1/tiktok/web/fetch_general_search`
**Method:** GET · **Risk:** low

#### 用途
通过 Web API 获取综合搜索列表。翻页需要 search_id。

#### 何时使用 / 不使用
- ✅ 需要 Web API 特有数据时
- ❌ 不想处理 tt_chain_token → 用 App V3 的 fetch_general_search_result

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| offset | integer | no | default=0 | 翻页游标 |
| search_id | string | no | — | 搜索 ID，首次为空，翻页时从上次响应获取（`$.data.extra.logid` 或 `$.data.log_pb.impr_id`） |
| cookie | string | no | 敏感凭据 | 用户 cookie，**仅在用户明确授权时使用** |

> ⚠️ Web API 返回的视频 CDN 链接需 tt_chain_token。

---

### fetch_trending_searchwords — 每日热门搜索关键词

**Full path:** `/api/v1/tiktok/web/fetch_trending_searchwords`
**Method:** GET · **Risk:** low

#### 用途
获取每日热门搜索关键词列表。无需参数。

---

### fetch_search_keyword_suggest — 搜索关键词推荐

**Full path:** `/api/v1/tiktok/web/fetch_search_keyword_suggest`
**Method:** GET · **Risk:** low

#### 用途
根据输入关键词获取搜索推荐关键词列表。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |

---

### fetch_search_user — 搜索用户（Web API）

**Full path:** `/api/v1/tiktok/web/fetch_search_user`
**Method:** GET · **Risk:** low

#### 用途
通过 Web API 搜索用户。翻页需要 search_id。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| cursor | integer | no | default=0 | 翻页游标 |
| search_id | string | no | — | 搜索 ID，翻页时从上次响应获取 |
| cookie | string | no | 敏感凭据 | 用户 cookie，**仅在用户明确授权时使用** |

> ⚠️ 如响应 `status_code != 0`，可能是搜索了敏感关键词，请更换关键词。

---

### fetch_search_video — 搜索视频（Web API）

**Full path:** `/api/v1/tiktok/web/fetch_search_video`
**Method:** GET · **Risk:** low

#### 用途
通过 Web API 搜索视频。翻页需要 search_id。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| count | integer | no | default=20 | 每页数量 |
| offset | integer | no | default=0 | 翻页游标 |
| search_id | string | no | — | 搜索 ID，翻页时从上次响应获取 |
| cookie | string | no | 敏感凭据 | 用户 cookie |

> ⚠️ Web API 返回的视频 CDN 链接需 tt_chain_token。

---

### fetch_search_live — 搜索直播（Web API）

**Full path:** `/api/v1/tiktok/web/fetch_search_live`
**Method:** GET · **Risk:** low

#### 用途
通过 Web API 搜索直播。翻页需要 search_id。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| count | integer | no | default=20 | 每页数量 |
| offset | integer | no | default=0 | 翻页游标 |
| search_id | string | no | — | 搜索 ID |
| cookie | string | no | 敏感凭据 | 用户 cookie |

---

### fetch_search_photo — 搜索照片（Web API）

**Full path:** `/api/v1/tiktok/web/fetch_search_photo`
**Method:** GET · **Risk:** low

#### 用途
通过 Web API 搜索照片。翻页需要 search_id。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| count | integer | no | default=20 | 每页数量 |
| offset | integer | no | default=0 | 翻页游标 |
| search_id | string | no | — | 搜索 ID |
| cookie | string | no | 敏感凭据 | 用户 cookie |

---

### fetch_tag_detail — Tag 详情（Web API）

**Full path:** `/api/v1/tiktok/web/fetch_tag_detail`
**Method:** GET · **Risk:** low

#### 用途
获取指定 Tag 的详情信息。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| tag_name | string | yes | — | Tag 名称 |

---

### fetch_live_recommend — 直播首页推荐

**Full path:** `/api/v1/tiktok/web/fetch_live_recommend`
**Method:** GET · **Risk:** low

#### 用途
获取直播首页推荐列表。需要 `related_live_tag` 参数，该参数的可选值需先通过 `fetch_live_recommend_tabs` 获取。

#### 何时使用 / 不使用
- ✅ 已知直播分类标签，需要获取该分类下的直播推荐
- ❌ 不知道标签可选值 → 先用 fetch_live_recommend_tabs 获取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| related_live_tag | string | yes | — | 直播分类标签，从 fetch_live_recommend_tabs 获取 |

> ⚠️ Web API 返回的视频 CDN 链接需 tt_chain_token。

---

### fetch_live_recommend_tabs — 直播推荐可用标签

**Full path:** `/api/v1/tiktok/web/fetch_live_recommend_tabs`
**Method:** GET · **Risk:** low

#### 用途
获取直播首页推荐的可用标签（直播分类 Tab）列表。**fetch_live_recommend 的前置端点**。

#### 何时使用 / 不使用
- ✅ 需要获取 fetch_live_recommend 的 related_live_tag 可选值
- ✅ 用户想浏览直播分类

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| logid | string | no | — | 翻页游标，首页留空，加载更多时传上次响应的 logid |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| tabs[].tag_name | `$.data.data.tabs[].tag_name` | 分类标签名 | fetch_live_recommend（作为 related_live_tag） |
| logid | 响应中的 logid | 翻页游标 | 同端点翻页 |

> ⚠️ related_live_tag 的可选值不固定，会随地区/时间变化，建议每次使用前实时获取。
