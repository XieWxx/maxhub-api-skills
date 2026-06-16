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

## 子文件路由 (Sub-file Router)

| 子领域 | 文件 | 端点数 | 用户目标关键词 |
|--------|------|--------|----------|
| 日期与地区工具 | [./tools.md](./tools.md) | 3 | "查有效日期" / "看可用地区" |
| 热点+关键词+订阅+加密 | [./keyword.md](./keyword.md) | 12 | "看热点" / "查关键词趋势" / "看人群画像" |
| 达人分析 + 视频搜索 | [./daren.md](./daren.md) | 9 | "搜达人" / "看达人核心指标" / "搜视频" |
| 品牌+话题 | [./brand-topic.md](./brand-topic.md) | 9 | "查品牌" / "看品牌趋势" / "搜话题" |
| 创作指南+洞察报告 | [./creative-insight.md](./creative-insight.md) | 14 | "看创作指南" / "搜趋势报告" |

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
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](../param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](../param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
  - 路径是否在 [`endpoints_whitelist.yaml`](../endpoints_whitelist.yaml) 中？
  - Method、参数键名是否符合白名单？
  - 资源 ID（keyword_list/brand_name/user_id/tag_id）是否来自合法响应字段？
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**，向用户报告
- **禁止**：❌ 改路径段 ❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改资源 ID 重试
- **替换**：参考 [`param-mappings.md`](../param-mappings.md) 的"端点替换矩阵"

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](../param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
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
