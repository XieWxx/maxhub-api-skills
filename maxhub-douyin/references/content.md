# Douyin Content Index / 抖音指数

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖

抖音指数（Index API）全部端点：日期与地区工具、热点与关键词趋势、人群画像、达人搜索与分析、视频搜索、品牌分析、话题搜索、创作指南（关键词/话题/发布趋势/时长分布/创作者画像/消费者画像/互动趋势/消费趋势）、洞察报告。**本文件是抖音数据分析的核心入口**——keyword / brand_name / tag_id / user_id 为主要入参，aweme_id / uid 为主要产出字段，可链式调用 video.md / user.md 获取详情。

> 🔒 **安全**：所有请求将 `MAXHUB_API_KEY` 和查询数据传输至 `https://www.aconfig.cn`。禁止在日志、提示词或客户端存储中暴露 API Key。本文件 **30 个 POST 端点均为 risk:high**，调用前必须获得用户确认。

---

## 端点索引 (Endpoint Index)

### 日期与地区工具

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| index_fetch_all_valid_date | ⭐⭐⭐ 首选 | 获取所有维度（关键词/品牌/话题）的有效日期（**链式前置**） | GET | /api/v1/douyin/index/fetch_all_valid_date | low |
| index_fetch_valid_date_for_relation | ⭐⭐ 条件 | 获取关联分析的有效日期范围 | GET | /api/v1/douyin/index/fetch_valid_date_for_relation | low |
| index_fetch_all_area | ⭐⭐ 条件 | 获取省份/城市层级结构列表 | GET | /api/v1/douyin/index/fetch_all_area | low |

### 热点与关键词

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| index_fetch_current_hot_topic | ⭐⭐⭐ 首选 | 获取实时热点排行（**链式起点**） | GET | /api/v1/douyin/index/fetch_current_hot_topic | low |
| index_fetch_hot_words | ⭐⭐⭐ 首选 | 获取热门关键词排行 | GET | /api/v1/douyin/index/fetch_hot_words | low |
| index_fetch_keyword_valid_date | ⭐⭐ 条件 | 查询指定关键词可查询的日期范围（**POST, risk:high**） | POST | /api/v1/douyin/index/fetch_keyword_valid_date | **high** |
| index_fetch_multi_keyword_hot_trend | ⭐⭐⭐ 首选 | 多关键词热度趋势对比（**POST, risk:high**） | POST | /api/v1/douyin/index/fetch_multi_keyword_hot_trend | **high** |
| index_fetch_multi_keyword_interpretation | ⭐⭐ 条件 | 多关键词综合指数解读（**POST, risk:high**） | POST | /api/v1/douyin/index/fetch_multi_keyword_interpretation | **high** |
| index_fetch_relation_word | ⭐⭐ 条件 | 关键词关联词分析（**POST, risk:high**） | POST | /api/v1/douyin/index/fetch_relation_word | **high** |
| index_fetch_portrait | ⭐⭐ 条件 | 关键词人群画像（**POST, risk:high**） | POST | /api/v1/douyin/index/fetch_portrait | **high** |

### 用户订阅与加密

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| index_fetch_get_user_sub_word | ⭐ 条件 | 获取用户已订阅的关键词列表（**POST, risk:high**） | POST | /api/v1/douyin/index/fetch_get_user_sub_word | **high** |
| index_fetch_encrypt_user_id | ⭐⭐ 条件 | 抖音 uid 转加密 user_id | GET | /api/v1/douyin/index/fetch_encrypt_user_id | low |

### 达人分析

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| index_fetch_daren_sug_great_user_list | ⭐⭐⭐ 首选 | 达人搜索建议（**链式起点, POST, risk:high**） | POST | /api/v1/douyin/index/fetch_daren_sug_great_user_list | **high** |
| index_fetch_daren_compare_users_stable | ⭐⭐ 条件 | 达人趋势对比（最多 5 人, **POST, risk:high**） | POST | /api/v1/douyin/index/fetch_daren_compare_users_stable | **high** |
| index_fetch_daren_similar_users | ⭐⭐ 条件 | 获取相似达人（**POST, risk:high**） | POST | /api/v1/douyin/index/fetch_daren_similar_users | **high** |
| index_fetch_daren_great_user_top_video | ⭐⭐ 条件 | 达人热门视频（**POST, risk:high**） | POST | /api/v1/douyin/index/fetch_daren_great_user_top_video | **high** |
| index_fetch_daren_great_item_mile_info | ⭐⭐ 条件 | 达人核心指标（**POST, risk:high**） | POST | /api/v1/douyin/index/fetch_daren_great_item_mile_info | **high** |
| index_fetch_daren_great_user_fans_info | ⭐⭐ 条件 | 达人粉丝分析（**POST, risk:high**） | POST | /api/v1/douyin/index/fetch_daren_great_user_fans_info | **high** |

### 视频搜索

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| index_fetch_item_filter_options | ⭐⭐⭐ 首选 | 获取视频搜索筛选选项（垂类/时长/类型/日期） | GET | /api/v1/douyin/index/fetch_item_filter_options | low |
| index_fetch_item_sug | ⭐⭐ 条件 | 视频搜索建议（**POST, risk:high**） | POST | /api/v1/douyin/index/fetch_item_sug | **high** |
| index_fetch_item_query | ⭐⭐⭐ 首选 | 视频搜索结果（**POST, risk:high**） | POST | /api/v1/douyin/index/fetch_item_query | **high** |

### 品牌分析

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| index_fetch_brand_suggest | ⭐⭐⭐ 首选 | 品牌搜索建议（**链式起点, POST, risk:high**） | POST | /api/v1/douyin/index/fetch_brand_suggest | **high** |
| index_fetch_brand_valid_info | ⭐⭐ 条件 | 品牌指数与可用日期（**POST, risk:high**） | POST | /api/v1/douyin/index/fetch_brand_valid_info | **high** |
| index_fetch_brand_radar_chart | ⭐⭐ 条件 | 品牌雷达图（**POST, risk:high**） | POST | /api/v1/douyin/index/fetch_brand_radar_chart | **high** |
| index_fetch_brand_lines | ⭐⭐ 条件 | 品牌趋势线（**POST, risk:high**） | POST | /api/v1/douyin/index/fetch_brand_lines | **high** |
| index_fetch_brand_cycles | ⭐⭐ 条件 | 品牌周期数据（**POST, risk:high**） | POST | /api/v1/douyin/index/fetch_brand_cycles | **high** |
| index_fetch_brand_initiative_rank_weekly | ⭐ 条件 | 品牌主动排行周榜（**POST, risk:high**） | POST | /api/v1/douyin/index/fetch_brand_initiative_rank_weekly | **high** |
| index_fetch_brand_hot_videos_time_scope | ⭐ 条件 | 品牌热门视频时间范围（**POST, risk:high**） | POST | /api/v1/douyin/index/fetch_brand_hot_videos_time_scope | **high** |

### 话题搜索

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| index_fetch_topic_suggest | ⭐⭐⭐ 首选 | 话题搜索建议（**链式起点, POST, risk:high**） | POST | /api/v1/douyin/index/fetch_topic_suggest | **high** |
| index_fetch_topic_query | ⭐⭐ 条件 | 话题搜索结果（**POST, risk:high**） | POST | /api/v1/douyin/index/fetch_topic_query | **high** |

### 创作指南

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| index_fetch_content_valid_date | ⭐⭐⭐ 首选 | 创作指南有效日期（**链式前置**） | GET | /api/v1/douyin/index/fetch_content_valid_date | low |
| index_fetch_content_creative_keywords | ⭐⭐⭐ 首选 | 创作热门关键词（**链式起点, POST, risk:high**） | POST | /api/v1/douyin/index/fetch_content_creative_keywords | **high** |
| index_fetch_content_creative_keyword_items | ⭐⭐ 条件 | 关键词相关视频（**POST, risk:high**） | POST | /api/v1/douyin/index/fetch_content_creative_keyword_items | **high** |
| index_fetch_content_creative_topic | ⭐⭐ 条件 | 创作热门话题（**POST, risk:high**） | POST | /api/v1/douyin/index/fetch_content_creative_topic | **high** |
| index_fetch_content_publish_trend | ⭐⭐ 条件 | 内容发布趋势 | GET | /api/v1/douyin/index/fetch_content_publish_trend | low |
| index_fetch_content_creative_duration | ⭐ 条件 | 创作时长分布（**POST, risk:high**） | POST | /api/v1/douyin/index/fetch_content_creative_duration | **high** |
| index_fetch_content_author_portrait | ⭐⭐ 条件 | 创作者画像（**POST, risk:high**） | POST | /api/v1/douyin/index/fetch_content_author_portrait | **high** |
| index_fetch_content_consumer_portrait | ⭐⭐ 条件 | 消费者画像（**POST, risk:high**） | POST | /api/v1/douyin/index/fetch_content_consumer_portrait | **high** |
| index_fetch_content_interact_trend | ⭐⭐ 条件 | 互动趋势（**POST, risk:high**） | POST | /api/v1/douyin/index/fetch_content_interact_trend | **high** |
| index_fetch_content_consume_trend | ⭐⭐ 条件 | 消费趋势（**POST, risk:high**） | POST | /api/v1/douyin/index/fetch_content_consume_trend | **high** |

### 洞察报告

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| index_fetch_insight_recommend | ⭐⭐⭐ 首选 | 获取推荐报告列表 | GET | /api/v1/douyin/index/fetch_insight_recommend | low |
| index_fetch_report_search | ⭐⭐ 条件 | 搜索趋势报告（**POST, risk:high**） | POST | /api/v1/douyin/index/fetch_report_search | **high** |
| index_fetch_report_detail | ⭐⭐ 条件 | 获取报告详情 | GET | /api/v1/douyin/index/fetch_report_detail | low |
| index_fetch_insight_get_rec | ⭐ 条件 | 获取报告相关推荐 | GET | /api/v1/douyin/index/fetch_insight_get_rec | low |

---

## 链式调用图谱 (Chain Recipes)

> 当单个端点无法直接产出用户所需数据时，按下面链路组合调用。`字段流`列指明字段如何从上一步流向下一步，避免 Agent 臆造字段名。

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 查关键词趋势 | fetch_all_valid_date → fetch_multi_keyword_hot_trend | `$.data.keyword.date_list[-1]` → `end_date` | 日期获取失败：使用近 7 天日期估算 |
| 查关键词趋势 + 画像 | fetch_multi_keyword_hot_trend → fetch_portrait | `keyword` → `keyword`；`start_date` → `start_date`；`end_date` → `end_date` | 趋势获取失败：STOP |
| 查关键词关联词 | fetch_multi_keyword_hot_trend → fetch_relation_word | `keyword` → `keyword` | 趋势获取失败：STOP |
| 搜索达人 → 达人详情 | fetch_daren_sug_great_user_list → fetch_daren_great_item_mile_info | `$.data.user_list[].user_id` → `user_id` | 搜索失败：STOP |
| 搜索达人 → 达人粉丝 | fetch_daren_sug_great_user_list → fetch_daren_great_user_fans_info | `$.data.user_list[].user_id` → `user_id` | 搜索失败：STOP |
| 搜索达人 → 达人视频 | fetch_daren_sug_great_user_list → fetch_daren_great_user_top_video | `$.data.user_list[].user_id` → `user_id` | 搜索失败：STOP |
| 搜索达人 → 相似达人 | fetch_daren_sug_great_user_list → fetch_daren_similar_users | `$.data.user_list[].user_id` → `user_id` | 搜索失败：STOP |
| 达人对比 | fetch_daren_sug_great_user_list → fetch_daren_compare_users_stable | `$.data.user_list[].user_id`（最多 5 个，逗号拼接）→ `user_list` | 搜索失败：STOP |
| uid 加密 → 达人分析 | fetch_encrypt_user_id → fetch_daren_great_item_mile_info | `$.data.user_id` → `user_id` | 加密失败：STOP |
| 品牌搜索 → 品牌趋势 | fetch_brand_suggest → fetch_brand_lines | `$.data.brand_list[].brand_name` → `brand_name` | 搜索失败：STOP |
| 品牌搜索 → 品牌雷达 | fetch_brand_suggest → fetch_brand_radar_chart | `$.data.brand_list[].brand_name` → `brand_name` | 搜索失败：STOP |
| 话题搜索 → 话题详情 | fetch_topic_suggest → fetch_topic_query | `$.data.topic_list[].keyword` → `keyword` | 搜索失败：STOP |
| 创作指南链路 | fetch_content_valid_date → fetch_content_creative_keywords → fetch_content_creative_keyword_items | `$.data.end_date` → `end_date`；`$.data.keywords[].keyword` → `keyword` | 日期获取失败：STOP |
| 创作热门话题 | fetch_content_valid_date → fetch_content_creative_topic | `$.data.end_date` → `end_date` | 日期获取失败：STOP |
| 报告搜索 → 报告详情 | fetch_report_search → fetch_report_detail → fetch_insight_get_rec | `$.data.list[].report_id` → `report_id` | 搜索失败：STOP |
| 视频搜索 → 视频详情 | fetch_item_query → video.md | `$.data.list[].aweme_id` → `aweme_id` | 跨文件链路，详见 video.md |
| 达人搜索 → 用户详情 | fetch_daren_sug_great_user_list → user.md | `$.data.user_list[].uid` → `uid`（→ `web_fetch_user_profile_by_uid`） | 跨文件链路，详见 user.md |

---

## 跨 reference 链路 (In-Chain)

- **流入本文件**：`user.md` 的 `web_handler_user_profile_v4` 输出 `$.data.user.uid` → 本文件 `index_fetch_encrypt_user_id` 的 `uid`
- **流入本文件**：`tools.md` 的 `web_get_sec_user_id` 输出 `$.data.sec_user_id` → `user.md` → 本文件达人端点的 `user_id`（需先加密）
- **流出本文件**：`index_fetch_daren_sug_great_user_list` 输出 `$.data.user_list[].uid` → `user.md` 的 `web_fetch_user_profile_by_uid` 的 `uid`
- **流出本文件**：`index_fetch_daren_great_user_top_video` 输出 `$.data.video_list[].aweme_id` → `video.md` 全部 video 系端点的 `aweme_id`
- **流出本文件**：`index_fetch_item_query` 输出 `$.data.list[].aweme_id` → `video.md` 全部 video 系端点的 `aweme_id`
- **流出本文件**：`index_fetch_content_creative_keyword_items` 输出 `$.data.item_list[].aweme_id` → `video.md` 全部 video 系端点的 `aweme_id`

---

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项；通用规则见此处。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
  - 路径是否在 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 中？
  - Method、参数键名是否符合白名单？
  - 资源 ID（keyword_list/brand_name/user_id/tag_id）是否来自合法响应字段？
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**，向用户报告
- **禁止**：❌ 改路径段 ❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改资源 ID 重试
- **替换**：参考 [`param-mappings.md`](./param-mappings.md) 的"端点替换矩阵"

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
  - 参数名是否逐字符匹配 IN 表？注意 `keyword_list` vs `keyword` vs `brand_name` 的区别
  - 必填项是否齐全？
  - 传参方式（query vs body）是否正确？Authorization 头是否正确？
  - **是否有 IN 表外的臆造参数**？
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP
- **禁止**：❌ 切换端点 ❌ 在 IN 表外凭空加参数

### 抖音指数端点特化规则
- **POST 端点全部 risk:high**：本文件 30 个 POST 端点均标记 risk:high，调用前必须获得用户确认
- **日期格式**：统一为 `YYYYMMDD` 字符串（如 `20260412`），非时间戳
- **关联词分析 end_date 必须为周日**：`index_fetch_relation_word` 的 end_date 必须是周日，否则可能返回空数据
- **创作指南 period=7 时 end_date 必须为周日**：`index_fetch_content_creative_keywords` 的 period=7 时，end_date 必须为周日
- **创作指南 tag_id 不支持 0**：创作指南系列端点的 `tag_id` 必填且不支持 0（全部），需从 `index_fetch_item_filter_options` 获取有效 tag_id
- **达人对比最多 5 人**：`index_fetch_daren_compare_users_stable` 的 user_list 最多 5 个 uid
- **达人视频日期范围不超过 30 天**：`index_fetch_daren_great_user_top_video` 的 start_date 到 end_date 不超过 30 天
- **keyword_list 参数**：逗号分隔字符串（如 `美食,旅游`），非数组
- **region 参数**：逗号分隔字符串（如 `云南,上海`），留空表示全国
- **app_name 参数**：`aweme`=抖音（默认），`toutiao`=头条
- **达人 user_id**：达人端点的 `user_id` 参数为纯数字的抖音 uid，非 sec_uid

---

## 端点详情

---

### index_fetch_all_valid_date — 获取所有有效日期

**Full path:** `/api/v1/douyin/index/fetch_all_valid_date`
**Method:** GET · **Risk:** low

#### 用途
获取关键词、品牌、话题等维度的日/周/月最新可用日期。**链式调用的前置步骤**——在调用趋势/画像端点前，先获取有效日期范围。

#### 何时使用 / 不使用
- ✅ 调用趋势/画像端点前获取有效日期
- ✅ 不确定日期范围时查询
- ❌ 已知有效日期范围 → 直接使用

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 无必填参数 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| keyword_date | `$.data.keyword.date_list[-1]` | 关键词最新可用日期 | index_fetch_multi_keyword_hot_trend 等 |
| brand_date | `$.data.brand.date_list[-1]` | 品牌最新可用日期 | index_fetch_brand_lines 等 |
| topic_date | `$.data.topic.date_list[-1]` | 话题最新可用日期 | index_fetch_topic_query 等 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_valid_date_for_relation — 获取关联分析有效日期

**Full path:** `/api/v1/douyin/index/fetch_valid_date_for_relation`
**Method:** GET · **Risk:** low

#### 用途
获取关联分析（`index_fetch_relation_word`）的起止可用日期。

#### 何时使用 / 不使用
- ✅ 调用 `index_fetch_relation_word` 前获取有效日期
- ❌ 非关联分析场景 → 用 `index_fetch_all_valid_date`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 无必填参数 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| start_date | `$.data.start_date` | 关联分析起始日期 | index_fetch_relation_word |
| end_date | `$.data.end_date` | 关联分析结束日期 | index_fetch_relation_word |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_all_area — 获取所有地区列表

**Full path:** `/api/v1/douyin/index/fetch_all_area`
**Method:** GET · **Risk:** low

#### 用途
获取省份和城市的层级结构列表，用于 `region` 参数的地区筛选。

#### 何时使用 / 不使用
- ✅ 需要获取可用的地区列表用于 region 参数
- ❌ 已知地区名称 → 直接使用

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 无必填参数 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 地区列表为参考数据，用于构造 region 参数 | index_fetch_multi_keyword_hot_trend 等 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_current_hot_topic — 获取实时热点排行

**Full path:** `/api/v1/douyin/index/fetch_current_hot_topic`
**Method:** GET · **Risk:** low

#### 用途
获取实时热点排行，包含热点名称、热点指数、排名变化等信息。**链式调用常见起点**——热点关键词可作为 `index_fetch_multi_keyword_hot_trend` 的输入。

#### 何时使用 / 不使用
- ✅ 想了解当前热门话题
- ✅ 链式起点：热点关键词 → 关键词趋势分析
- ❌ 想看关键词趋势 → 直接用 `index_fetch_multi_keyword_hot_trend`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 无必填参数 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| hot_topics[].word | `$.data.hot_topics[].word` | 热点关键词 | index_fetch_multi_keyword_hot_trend 的 keyword_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_hot_words — 获取热门关键词

**Full path:** `/api/v1/douyin/index/fetch_hot_words`
**Method:** GET · **Risk:** low

#### 用途
获取热门关键词排行，包含关键词名称、搜索指数、增长率等。

#### 何时使用 / 不使用
- ✅ 想了解当前热门搜索词
- ❌ 想看特定关键词趋势 → 用 `index_fetch_multi_keyword_hot_trend`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| app_name | string | no | enum: aweme=抖音, toutiao=头条, default: aweme | 平台筛选 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| hot_words[].word | `$.data.hot_words[].word` | 热门关键词 | index_fetch_multi_keyword_hot_trend 的 keyword_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_keyword_valid_date — 获取关键词有效日期

**Full path:** `/api/v1/douyin/index/fetch_keyword_valid_date`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
查询指定关键词可查询的起止日期范围。

#### 何时使用 / 不使用
- ✅ 不确定关键词可查询的日期范围时
- ❌ 已知有效日期 → 直接使用

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword_list | string | yes | 逗号分隔（如 `美食,旅游`） | 关键词列表 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| keyword_dates[].start_date | `$.data.keyword_dates[].start_date` | 各关键词起始日期 | index_fetch_multi_keyword_hot_trend |
| keyword_dates[].end_date | `$.data.keyword_dates[].end_date` | 各关键词结束日期 | index_fetch_multi_keyword_hot_trend |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | keyword_list 缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_multi_keyword_hot_trend — 多关键词热度趋势

**Full path:** `/api/v1/douyin/index/fetch_multi_keyword_hot_trend`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取多个关键词的热度趋势对比数据。**核心分析端点**——每日热度数据可用于趋势对比和关联分析。

#### 何时使用 / 不使用
- ✅ 对比多个关键词的热度趋势
- ✅ 查看单个关键词的历史热度变化
- ❌ 只看实时排行 → 用 `index_fetch_hot_words`
- ❌ 需要人群画像 → 用 `index_fetch_portrait`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword_list | string | yes | 逗号分隔 | 关键词列表 |
| start_date | string | yes | 格式 YYYYMMDD | 开始日期 |
| end_date | string | yes | 格式 YYYYMMDD | 结束日期 |
| app_name | string | no | enum: aweme, toutiao, default: aweme | 平台筛选 |
| region | string | no | 逗号分隔，留空=全国 | 地区筛选 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| trend_data | `$.data.trend_data` | 每日热度数据 | 终端数据，无下游链式调用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或格式错误 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_multi_keyword_interpretation — 多关键词解读

**Full path:** `/api/v1/douyin/index/fetch_multi_keyword_interpretation`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取多关键词的综合指数解读，包含搜索指数、内容指数等。

#### 何时使用 / 不使用
- ✅ 需要关键词的综合指数解读（搜索指数 + 内容指数）
- ❌ 只看热度趋势 → 用 `index_fetch_multi_keyword_hot_trend`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword_list | string | yes | 逗号分隔 | 关键词列表 |
| start_date | string | yes | 格式 YYYYMMDD | 开始日期 |
| end_date | string | yes | 格式 YYYYMMDD | 结束日期 |
| app_name | string | no | default: aweme | 平台筛选 |
| region | string | no | 逗号分隔 | 地区筛选 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 解读数据为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或格式错误 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_relation_word — 关键词关联词分析

**Full path:** `/api/v1/douyin/index/fetch_relation_word`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取关键词的搜索关联词和内容关联词。**注意：end_date 必须为周日，否则可能返回空数据。**

#### 何时使用 / 不使用
- ✅ 需要查看关键词的关联词图谱
- ✅ 发现新的相关关键词
- ❌ 只看热度趋势 → 用 `index_fetch_multi_keyword_hot_trend`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 关键词 |
| start_date | string | yes | 格式 YYYYMMDD，建议为周一 | 开始日期 |
| end_date | string | yes | 格式 YYYYMMDD，**必须为周日** | 结束日期 |
| app_name | string | no | default: aweme | 平台筛选 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| search_relation_words | `$.data.search_relation_words` | 搜索关联词列表 | index_fetch_multi_keyword_hot_trend 的 keyword_list |
| content_relation_words | `$.data.content_relation_words` | 内容关联词列表 | index_fetch_multi_keyword_hot_trend 的 keyword_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或 end_date 非周日 | 校正日期重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_portrait — 关键词人群画像

**Full path:** `/api/v1/douyin/index/fetch_portrait`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取关键词的人群画像数据，包含性别分布、年龄分布、地域分布、兴趣分布等。

#### 何时使用 / 不使用
- ✅ 需要了解搜索某关键词的人群特征
- ❌ 只看热度趋势 → 用 `index_fetch_multi_keyword_hot_trend`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 关键词 |
| start_date | string | yes | 格式 YYYYMMDD | 开始日期 |
| end_date | string | yes | 格式 YYYYMMDD | 结束日期 |
| app_name | string | no | default: aweme | 平台筛选 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 画像数据为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或格式错误 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_get_user_sub_word — 获取用户订阅关键词

**Full path:** `/api/v1/douyin/index/fetch_get_user_sub_word`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取用户已订阅的关键词列表。

#### 何时使用 / 不使用
- ✅ 查看用户已订阅的关键词
- ❌ 搜索关键词 → 用 `index_fetch_hot_words`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 无必填参数 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| sub_words | `$.data.sub_words` | 订阅关键词列表 | index_fetch_multi_keyword_hot_trend 的 keyword_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_encrypt_user_id — uid 转加密 user_id

**Full path:** `/api/v1/douyin/index/fetch_encrypt_user_id`
**Method:** GET · **Risk:** low

#### 用途
将抖音 uid（纯数字）转换为加密的 user_id。**达人分析端点的前置步骤**——达人端点需要加密后的 user_id。

#### 何时使用 / 不使用
- ✅ 达人端点需要加密 user_id 时
- ✅ 已知抖音 uid 但达人端点报参数错误
- ❌ 已有加密 user_id → 直接使用

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | 纯数字 | 抖音 uid |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user_id | `$.data.user_id` | 加密后的 user_id | index_fetch_daren_* 系列端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | uid 缺失或格式无效 | 校正参数重试 | ≤1 次 | — |
| 404 | uid 不存在 | STOP | 0 | — |

---

### index_fetch_daren_sug_great_user_list — 达人搜索建议

**Full path:** `/api/v1/douyin/index/fetch_daren_sug_great_user_list`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
搜索达人，返回匹配的达人列表（达人 ID、昵称、头像、粉丝数等）。**达人分析的链式起点**——user_id 从此处产出，供达人详情端点使用。

#### 何时使用 / 不使用
- ✅ 搜索达人获取 user_id
- ✅ 链式起点：user_id → 达人详情/粉丝/视频/相似达人
- ❌ 已知 user_id → 直接调用达人详情端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| total | string | no | default: 20 | 返回数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user_list[].user_id | `$.data.user_list[].user_id` | 达人加密 user_id | index_fetch_daren_* 系列端点 |
| user_list[].uid | `$.data.user_list[].uid` | 达人原始 uid | user.md 的 web_fetch_user_profile_by_uid |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | keyword 缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_daren_compare_users_stable — 达人趋势对比

**Full path:** `/api/v1/douyin/index/fetch_daren_compare_users_stable`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
对比多个达人在指定天数内的趋势数据。**注意：user_list 最多 5 个 uid。**

#### 何时使用 / 不使用
- ✅ 对比 2-5 个达人的趋势数据
- ❌ 超过 5 个达人 → 分批对比
- ❌ 只看单个达人 → 用 `index_fetch_daren_great_item_mile_info`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_list | string | yes | 逗号分隔，**最多 5 个** | 达人 uid 列表 |
| days | string | no | enum: 7, 30, default: 7 | 对比天数 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 对比数据为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | user_list 缺失或超过 5 个 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_daren_similar_users — 获取相似达人

**Full path:** `/api/v1/douyin/index/fetch_daren_similar_users`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取与指定达人相似的达人列表。

#### 何时使用 / 不使用
- ✅ 想找与某达人相似的其他达人
- ✅ 已知 user_id
- ❌ 不知 user_id → 先通过 `index_fetch_daren_sug_great_user_list` 搜索

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | 纯数字 uid | 达人 uid |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| similar_users[].user_id | `$.data.similar_users[].user_id` | 相似达人 user_id | index_fetch_daren_* 系列端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | user_id 缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_daren_great_user_top_video — 达人热门视频

**Full path:** `/api/v1/douyin/index/fetch_daren_great_user_top_video`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取达人热门视频列表。**注意：日期范围不超过 30 天。**

#### 何时使用 / 不使用
- ✅ 查看达人近期热门视频
- ✅ 已知 user_id 和日期范围
- ❌ 日期范围超过 30 天 → 缩小范围

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | 纯数字 uid | 达人 uid |
| start_date | string | yes | 格式 YYYYMMDD | 开始日期 |
| end_date | string | yes | 格式 YYYYMMDD，**不超过 start_date 后 30 天** | 结束日期 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| video_list[].aweme_id | `$.data.video_list[].aweme_id` | 视频 ID | video.md 全部 video 系端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或日期范围超过 30 天 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_daren_great_item_mile_info — 达人核心指标

**Full path:** `/api/v1/douyin/index/fetch_daren_great_item_mile_info`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取达人核心指标数据，包含粉丝数、获赞数、作品数、互动率等。

#### 何时使用 / 不使用
- ✅ 查看达人核心数据概览
- ❌ 需要粉丝画像 → 用 `index_fetch_daren_great_user_fans_info`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | 纯数字 uid | 达人 uid |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 核心指标为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | user_id 缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_daren_great_user_fans_info — 达人粉丝分析

**Full path:** `/api/v1/douyin/index/fetch_daren_great_user_fans_info`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取达人粉丝画像数据，包含性别分布、年龄分布、地域分布、活跃时间等。

#### 何时使用 / 不使用
- ✅ 查看达人粉丝画像
- ❌ 只看核心指标 → 用 `index_fetch_daren_great_item_mile_info`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | 纯数字 uid | 达人 uid |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 粉丝画像为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | user_id 缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_item_filter_options — 获取视频搜索筛选选项

**Full path:** `/api/v1/douyin/index/fetch_item_filter_options`
**Method:** GET · **Risk:** low

#### 用途
获取视频搜索的完整筛选选项，包含垂类（categories）、时长（duration_types）、类型（label_types）、发布时间（date_types）的可选值。**视频搜索的前置步骤**——获取 category_id 等筛选参数。

#### 何时使用 / 不使用
- ✅ 调用 `index_fetch_item_query` 前获取筛选选项
- ✅ 需要知道 tag_id / category_id 的有效值
- ❌ 已知筛选参数 → 直接调用 `index_fetch_item_query`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 无必填参数 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| categories[].id | `$.data.categories[].id` | 垂类 ID | index_fetch_item_query 的 category_id；创作指南端点的 tag_id |
| duration_types | `$.data.duration_types` | 时长选项 | index_fetch_item_query 的 duration_type |
| label_types | `$.data.label_types` | 类型选项 | index_fetch_item_query 的 label_type |
| date_types | `$.data.date_types` | 日期选项 | index_fetch_item_query 的 date_type |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_item_sug — 视频搜索建议

**Full path:** `/api/v1/douyin/index/fetch_item_sug`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取视频搜索的关键词建议列表。

#### 何时使用 / 不使用
- ✅ 搜索视频前获取关键词建议
- ❌ 已知搜索关键词 → 直接用 `index_fetch_item_query`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| query | string | yes | — | 搜索关键词 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| suggestions | `$.data.suggestions` | 关键词建议列表 | index_fetch_item_query 的 query |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | query 缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_item_query — 视频搜索结果

**Full path:** `/api/v1/douyin/index/fetch_item_query`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
搜索视频，返回视频列表（含播放量、点赞数、评论数、分享数、作者信息等）。支持垂类/时长/类型/日期筛选。

#### 何时使用 / 不使用
- ✅ 搜索特定类型的视频
- ✅ 需要按垂类/时长/类型筛选
- ❌ 通用搜索 → 用 `search.md` 的搜索端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| query | string | yes | — | 搜索关键词 |
| category_id | string | no | default: 0=全部，从 `index_fetch_item_filter_options` 获取 | 垂类 ID |
| date_type | integer | no | enum: 0=不限, 3=近3天, 7=近7天, 30=近一个月, default: 0 | 发布时间 |
| label_type | integer | no | enum: 0=不限, 1=低粉爆款, 2=高完播率, 3=高涨粉率, 4=高点赞率, default: 0 | 视频类型 |
| duration_type | integer | no | enum: 0=不限, 1=0-15秒, 6=15-60秒, 7=60-120秒, 8=120-180秒, 9=>180秒, default: 0 | 时长 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].aweme_id | `$.data.list[].aweme_id` | 视频 ID | video.md 全部 video 系端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | query 缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_brand_suggest — 品牌搜索建议

**Full path:** `/api/v1/douyin/index/fetch_brand_suggest`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
搜索品牌，返回匹配的品牌列表。**品牌分析的链式起点**——brand_name 从此处产出，供品牌详情端点使用。

#### 何时使用 / 不使用
- ✅ 搜索品牌获取 brand_name
- ✅ 链式起点：brand_name → 品牌趋势/雷达/周期
- ❌ 已知 brand_name → 直接调用品牌详情端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 品牌名称关键词 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| brand_list[].brand_name | `$.data.brand_list[].brand_name` | 品牌名称 | index_fetch_brand_radar_chart / lines / cycles 等 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | keyword 缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_brand_valid_info — 品牌指数与可用日期

**Full path:** `/api/v1/douyin/index/fetch_brand_valid_info`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取品牌指数和可查询的日期范围。

#### 何时使用 / 不使用
- ✅ 查看品牌指数和可用日期
- ❌ 已知品牌可用日期 → 直接调用品牌趋势端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword_list | string | yes | 逗号分隔 | 品牌名称列表 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| brand_info[].start_date | `$.data.brand_info[].start_date` | 品牌起始日期 | index_fetch_brand_lines 等 |
| brand_info[].end_date | `$.data.brand_info[].end_date` | 品牌结束日期 | index_fetch_brand_lines 等 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | keyword_list 缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_brand_radar_chart — 品牌雷达图

**Full path:** `/api/v1/douyin/index/fetch_brand_radar_chart`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取品牌多维度评分雷达图数据。

#### 何时使用 / 不使用
- ✅ 查看品牌多维度评分
- ❌ 只看热度趋势 → 用 `index_fetch_brand_lines`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| brand_name | string | yes | — | 品牌名称 |
| start_date | string | yes | 格式 YYYYMMDD | 开始日期 |
| end_date | string | yes | 格式 YYYYMMDD | 结束日期 |
| app_name | string | no | default: aweme | 平台筛选 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 雷达图数据为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_brand_lines — 品牌趋势线

**Full path:** `/api/v1/douyin/index/fetch_brand_lines`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取品牌热度趋势线数据。

#### 何时使用 / 不使用
- ✅ 查看品牌热度趋势变化
- ❌ 只看综合评分 → 用 `index_fetch_brand_radar_chart`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| brand_name | string | yes | — | 品牌名称 |
| start_date | string | yes | 格式 YYYYMMDD | 开始日期 |
| end_date | string | yes | 格式 YYYYMMDD | 结束日期 |
| app_name | string | no | default: aweme | 平台筛选 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 趋势线数据为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_brand_cycles — 品牌周期数据

**Full path:** `/api/v1/douyin/index/fetch_brand_cycles`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取品牌周期性热度数据。

#### 何时使用 / 不使用
- ✅ 查看品牌周期性变化规律
- ❌ 只看趋势线 → 用 `index_fetch_brand_lines`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| brand_name | string | yes | — | 品牌名称 |
| start_date | string | yes | 格式 YYYYMMDD | 开始日期 |
| end_date | string | yes | 格式 YYYYMMDD | 结束日期 |
| app_name | string | no | default: aweme | 平台筛选 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 周期数据为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_brand_initiative_rank_weekly — 品牌主动排行周榜

**Full path:** `/api/v1/douyin/index/fetch_brand_initiative_rank_weekly`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取品牌在该周的主动排行数据。

#### 何时使用 / 不使用
- ✅ 查看品牌周排行
- ❌ 只看趋势 → 用 `index_fetch_brand_lines`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| brand_name | string | yes | — | 品牌名称 |
| start_date | string | yes | 格式 YYYYMMDD | 开始日期 |
| end_date | string | yes | 格式 YYYYMMDD | 结束日期 |
| app_name | string | no | default: aweme | 平台筛选 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 排行数据为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_brand_hot_videos_time_scope — 品牌热门视频时间范围

**Full path:** `/api/v1/douyin/index/fetch_brand_hot_videos_time_scope`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取品牌热门视频可查询的时间范围（起止日期、周期单位等）。

#### 何时使用 / 不使用
- ✅ 查询品牌热门视频前获取时间范围
- ❌ 已知时间范围 → 直接使用

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 无必填参数 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 时间范围为参考数据 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_topic_suggest — 话题搜索建议

**Full path:** `/api/v1/douyin/index/fetch_topic_suggest`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
搜索话题，返回匹配的话题列表。**话题分析的链式起点**——keyword 从此处产出，供话题详情端点使用。

#### 何时使用 / 不使用
- ✅ 搜索话题获取 keyword
- ✅ 链式起点：keyword → 话题详情
- ❌ 已知话题关键词 → 直接用 `index_fetch_topic_query`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 话题关键词 |
| app_name | string | no | default: aweme | 平台筛选 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| topic_list[].keyword | `$.data.topic_list[].keyword` | 话题关键词 | index_fetch_topic_query 的 keyword |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | keyword 缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_topic_query — 话题搜索结果

**Full path:** `/api/v1/douyin/index/fetch_topic_query`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取话题详情、话题热度、相关视频数等。

#### 何时使用 / 不使用
- ✅ 查看话题详情和热度
- ❌ 只搜索话题 → 用 `index_fetch_topic_suggest`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 话题关键词 |
| start_date | string | yes | 格式 YYYYMMDD | 开始日期 |
| end_date | string | yes | 格式 YYYYMMDD | 结束日期 |
| app_name | string | no | default: aweme | 平台筛选 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 话题数据为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_content_valid_date — 创作指南有效日期

**Full path:** `/api/v1/douyin/index/fetch_content_valid_date`
**Method:** GET · **Risk:** low

#### 用途
获取创作指南可查询的起止日期。**创作指南的前置步骤**——获取 end_date 供创作指南端点使用。

#### 何时使用 / 不使用
- ✅ 调用创作指南端点前获取有效日期
- ❌ 已知有效日期 → 直接使用

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 无必填参数 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| end_date | `$.data.end_date` | 创作指南最新可用日期 | index_fetch_content_creative_* 系列端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_content_creative_keywords — 创作热门关键词

**Full path:** `/api/v1/douyin/index/fetch_content_creative_keywords`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取指定垂类下的热门关键词列表。**创作指南的链式起点**——keyword 从此处产出，供关键词相关视频端点使用。**注意：tag_id 必填且不支持 0；period=7 时 end_date 必须为周日。**

#### 何时使用 / 不使用
- ✅ 查看某垂类的热门关键词
- ✅ 链式起点：keyword → 关键词相关视频
- ❌ tag_id=0（不支持全部）→ 需从 `index_fetch_item_filter_options` 获取有效 tag_id

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| tag_id | string | yes | **必填，不支持 0** | 垂类 ID |
| end_date | string | yes | 格式 YYYYMMDD，**period=7 时必须为周日** | 结束日期 |
| period | string | no | enum: 1=近1天, 3=近3天, 7=近7天, default: 7 | 时间周期 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| keywords[].keyword | `$.data.keywords[].keyword` | 热门关键词 | index_fetch_content_creative_keyword_items 的 keyword |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | tag_id 缺失/为 0，或 end_date 非周日 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_content_creative_keyword_items — 关键词相关视频

**Full path:** `/api/v1/douyin/index/fetch_content_creative_keyword_items`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取与指定关键词相关的视频列表。**注意：tag_id 必填且不支持 0。**

#### 何时使用 / 不使用
- ✅ 查看某关键词下的相关视频
- ✅ 已从 `index_fetch_content_creative_keywords` 获取 keyword
- ❌ 不知 keyword → 先调用 `index_fetch_content_creative_keywords`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| tag_id | string | yes | **必填，不支持 0** | 垂类 ID |
| end_date | string | yes | 格式 YYYYMMDD | 结束日期 |
| keyword | string | yes | 从 `index_fetch_content_creative_keywords` 获取 | 关键词 |
| period | string | no | enum: 1, 3, 7, default: 7 | 时间周期 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| item_list[].aweme_id | `$.data.item_list[].aweme_id` | 视频 ID | video.md 全部 video 系端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或 tag_id=0 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_content_creative_topic — 创作热门话题

**Full path:** `/api/v1/douyin/index/fetch_content_creative_topic`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取指定垂类下的热门话题列表。**注意：tag_id 必填且不支持 0。**

#### 何时使用 / 不使用
- ✅ 查看某垂类的热门话题
- ❌ 只看关键词 → 用 `index_fetch_content_creative_keywords`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| tag_id | string | yes | **必填，不支持 0** | 垂类 ID |
| end_date | string | yes | 格式 YYYYMMDD | 结束日期 |
| period | string | no | enum: 1, 3, 7, default: 7 | 时间周期 |
| rank_type | string | no | enum: index=指数排序, rise=飙升排序, default: index | 排序类型 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 话题列表为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或 tag_id=0 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_content_publish_trend — 内容发布趋势

**Full path:** `/api/v1/douyin/index/fetch_content_publish_trend`
**Method:** GET · **Risk:** low

#### 用途
获取指定垂类按日聚合的发布量数据。**注意：tag_id 必填且不支持 0。**

#### 何时使用 / 不使用
- ✅ 查看某垂类的内容发布趋势
- ❌ 只看互动趋势 → 用 `index_fetch_content_interact_trend`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| tag_id | string | yes | **必填，不支持 0** | 垂类 ID |
| start_date | string | yes | 格式 YYYYMMDD | 起始日期 |
| end_date | string | yes | 格式 YYYYMMDD | 结束日期 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 发布趋势为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或 tag_id=0 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_content_creative_duration — 创作时长分布

**Full path:** `/api/v1/douyin/index/fetch_content_creative_duration`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取指定垂类各时长区间的视频数量与占比。**注意：tag_id 必填且不支持 0；end_date 需与 period 对齐。**

#### 何时使用 / 不使用
- ✅ 查看某垂类的视频时长分布
- ❌ 只看发布趋势 → 用 `index_fetch_content_publish_trend`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| tag_id | string | yes | **必填，不支持 0** | 垂类 ID |
| end_date | string | yes | 需与 period 对齐（week→周日, month→月末） | 结束日期 |
| period | string | no | enum: week, month, default: week | 时间粒度 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 时长分布为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或 tag_id=0 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_content_author_portrait — 创作者画像

**Full path:** `/api/v1/douyin/index/fetch_content_author_portrait`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取指定垂类的创作者画像（性别分布、年龄段分布、地域分布、设备分布、活跃时段等）。**注意：tag_id 必填且不支持 0；end_date 需与 period 对齐。**

#### 何时使用 / 不使用
- ✅ 查看某垂类的创作者画像
- ❌ 查看消费者画像 → 用 `index_fetch_content_consumer_portrait`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| tag_id | string | yes | **必填，不支持 0** | 垂类 ID |
| end_date | string | yes | 需与 period 对齐 | 结束日期 |
| period | string | no | enum: week, month, default: month | 时间粒度 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 创作者画像为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或 tag_id=0 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_content_consumer_portrait — 消费者画像

**Full path:** `/api/v1/douyin/index/fetch_content_consumer_portrait`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取指定垂类的消费者画像（性别分布、年龄段分布、地域分布、兴趣偏好、设备分布等）。**注意：tag_id 必填且不支持 0；end_date 需与 period 对齐。**

#### 何时使用 / 不使用
- ✅ 查看某垂类的消费者画像
- ❌ 查看创作者画像 → 用 `index_fetch_content_author_portrait`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| tag_id | string | yes | **必填，不支持 0** | 垂类 ID |
| end_date | string | yes | 需与 period 对齐 | 结束日期 |
| period | string | no | enum: week, month, default: month | 时间粒度 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 消费者画像为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或 tag_id=0 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_content_interact_trend — 互动趋势

**Full path:** `/api/v1/douyin/index/fetch_content_interact_trend`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取指定垂类的每日互动数据（点赞总数、评论总数、分享总数、收藏总数等）。**注意：tag_id 必填且不支持 0。**

#### 何时使用 / 不使用
- ✅ 查看某垂类的互动趋势
- ❌ 只看消费趋势 → 用 `index_fetch_content_consume_trend`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| tag_id | string | yes | **必填，不支持 0** | 垂类 ID |
| start_date | string | yes | 格式 YYYYMMDD | 起始日期 |
| end_date | string | yes | 格式 YYYYMMDD | 结束日期 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 互动趋势为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或 tag_id=0 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_content_consume_trend — 消费趋势

**Full path:** `/api/v1/douyin/index/fetch_content_consume_trend`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取指定垂类的每日消费数据（播放总量、观看时长、独立观看人数等）。**注意：tag_id 必填且不支持 0。**

#### 何时使用 / 不使用
- ✅ 查看某垂类的消费趋势
- ❌ 只看互动趋势 → 用 `index_fetch_content_interact_trend`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| tag_id | string | yes | **必填，不支持 0** | 垂类 ID |
| start_date | string | yes | 格式 YYYYMMDD | 起始日期 |
| end_date | string | yes | 格式 YYYYMMDD | 结束日期 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 消费趋势为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或 tag_id=0 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_insight_recommend — 获取推荐报告

**Full path:** `/api/v1/douyin/index/fetch_insight_recommend`
**Method:** GET · **Risk:** low

#### 用途
获取推荐报告列表（含报告 ID、标题、封面、发布时间等）。

#### 何时使用 / 不使用
- ✅ 浏览推荐报告
- ✅ 链式起点：report_id → 报告详情
- ❌ 搜索特定报告 → 用 `index_fetch_report_search`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 无必填参数 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].report_id | `$.data.list[].report_id` | 报告 ID | index_fetch_report_detail / index_fetch_insight_get_rec |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_report_search — 搜索趋势报告

**Full path:** `/api/v1/douyin/index/fetch_report_search`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
搜索趋势报告，支持按类型/产品/年份/关键词筛选。

#### 何时使用 / 不使用
- ✅ 搜索特定类型的趋势报告
- ❌ 浏览推荐 → 用 `index_fetch_insight_recommend`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| current_page | string | no | default: 1 | 页码 |
| page_size | string | no | default: 16 | 每页数量 |
| type | string | no | 行业洞察/产品洞察/用户洞察/趋势洞察 | 报告类型 |
| business | string | no | 逗号分隔: 巨量引擎,今日头条,抖音,西瓜视频,抖音电商,仕小禄,其他 | 所属产品 |
| report_time | string | no | 逗号分隔的年份 | 发布年份 |
| search | string | no | — | 报告关键词搜索 |
| category | string | no | default: 6 | 顶层分类 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].report_id | `$.data.list[].report_id` | 报告 ID | index_fetch_report_detail / index_fetch_insight_get_rec |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_report_detail — 获取报告详情

**Full path:** `/api/v1/douyin/index/fetch_report_detail`
**Method:** GET · **Risk:** low

#### 用途
获取报告完整数据（标题、封面、发布时间、产品标签、内容、图片、PDF 链接等）。

#### 何时使用 / 不使用
- ✅ 查看报告详情
- ✅ 已从搜索/推荐端点获取 report_id
- ❌ 不知 report_id → 先搜索或浏览推荐

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| report_id | string | yes | — | 报告 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 报告详情为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | report_id 缺失 | 补全参数重试 | ≤1 次 | — |
| 404 | report_id 不存在 | STOP | 0 | — |

---

### index_fetch_insight_get_rec — 获取报告相关推荐

**Full path:** `/api/v1/douyin/index/fetch_insight_get_rec`
**Method:** GET · **Risk:** low

#### 用途
获取与指定报告相关的推荐报告列表。

#### 何时使用 / 不使用
- ✅ 查看报告的相关推荐
- ✅ 已知 report_id
- ❌ 不知 report_id → 先搜索或浏览推荐

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| report_id | string | yes | — | 报告 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| rec_list[].report_id | `$.data.rec_list[].report_id` | 推荐报告 ID | index_fetch_report_detail |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | report_id 缺失 | 补全参数重试 | ≤1 次 | — |
| 404 | report_id 不存在 | STOP | 0 | — |
