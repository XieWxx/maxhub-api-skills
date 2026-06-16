# Douyin Xingtu / 抖音星图

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖

星图（Xingtu）KOL 分析平台全部端点：KOL ID 查找（uid / sec_user_id / unique_id → kolId）、加密图片解析、KOL 分析 V1（基本信息/观众画像/粉丝画像/服务报价/数据概览/转化能力/视频表现/星图指数/转化视频/连接用户/性价比/内容表现/粉丝趋势/热词分析）、KOL 搜索（基础/高级）、星图 V2 排行榜（达人商业榜/短剧演员榜）、星图 V2 创作者分析（基本信息/商业卡片/位置/视频/评论热词/内容热词/相似推荐/传播价值/二维码）、星图 V2 其他（内容趋势/IP 日历/MCN 搜索/营销案例）。**kolId 与 o_author_id 是本文件的核心字段**——前者用于 V1 端点，后者用于 V2 端点，需通过 ID 查找端点转换。

> 🔒 **安全**：所有请求将 `MAXHUB_API_KEY` 和查询数据传输至 `https://www.aconfig.cn`。禁止在日志、提示词或客户端存储中暴露 API Key。本文件 **4 个 POST 端点均为 risk:high**，调用前必须获得用户确认。

---

## 端点索引 (Endpoint Index)

### KOL ID 查找

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| xingtu_get_xingtu_kolid_by_uid | ⭐⭐⭐ 首选 | 用 uid 获取星图 kolId（**链式起点**） | GET | /api/v1/douyin/xingtu/get_xingtu_kolid_by_uid | low |
| xingtu_get_xingtu_kolid_by_sec_user_id | ⭐⭐⭐ 首选 | 用 sec_user_id 获取星图 kolId（**链式起点**） | GET | /api/v1/douyin/xingtu/get_xingtu_kolid_by_sec_user_id | low |
| xingtu_get_xingtu_kolid_by_unique_id | ⭐⭐ 条件 | 用抖音号获取星图 kolId | GET | /api/v1/douyin/xingtu/get_xingtu_kolid_by_unique_id | low |
| xingtu_get_sign_image | ⭐ 条件 | 解析星图加密图片 | GET | /api/v1/douyin/xingtu/get_sign_image | low |

### KOL 分析 V1

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| xingtu_kol_base_info_v1 | ⭐⭐⭐ 首选 | KOL 基本信息（**链式核心**） | GET | /api/v1/douyin/xingtu/kol_base_info_v1 | low |
| xingtu_kol_audience_portrait_v1 | ⭐⭐ 条件 | KOL 观众画像 | GET | /api/v1/douyin/xingtu/kol_audience_portrait_v1 | low |
| xingtu_kol_fans_portrait_v1 | ⭐⭐ 条件 | KOL 粉丝画像（支持粉丝/粉丝团/铁粉） | GET | /api/v1/douyin/xingtu/kol_fans_portrait_v1 | low |
| xingtu_kol_service_price_v1 | ⭐⭐ 条件 | KOL 服务报价 | GET | /api/v1/douyin/xingtu/kol_service_price_v1 | low |
| xingtu_kol_data_overview_v1 | ⭐⭐ 条件 | KOL 数据概览 | GET | /api/v1/douyin/xingtu/kol_data_overview_v1 | low |
| xingtu_kol_conversion_ability_analysis_v1 | ⭐⭐ 条件 | KOL 转化能力分析 | GET | /api/v1/douyin/xingtu/kol_conversion_ability_analysis_v1 | low |
| xingtu_kol_video_performance_v1 | ⭐⭐ 条件 | KOL 视频表现 | GET | /api/v1/douyin/xingtu/kol_video_performance_v1 | low |
| xingtu_kol_xingtu_index_v1 | ⭐⭐ 条件 | KOL 星图指数 | GET | /api/v1/douyin/xingtu/kol_xingtu_index_v1 | low |
| xingtu_kol_convert_video_display_v1 | ⭐ 条件 | KOL 转化视频展示 | GET | /api/v1/douyin/xingtu/kol_convert_video_display_v1 | low |
| xingtu_kol_link_struct_v1 | ⭐ 条件 | KOL 连接用户 | GET | /api/v1/douyin/xingtu/kol_link_struct_v1 | low |
| xingtu_kol_touch_distribution_v1 | ⭐ 条件 | KOL 连接用户来源 | GET | /api/v1/douyin/xingtu/kol_touch_distribution_v1 | low |
| xingtu_kol_cp_info_v1 | ⭐ 条件 | KOL 性价比分析 | GET | /api/v1/douyin/xingtu/kol_cp_info_v1 | low |
| xingtu_kol_rec_videos_v1 | ⭐⭐ 条件 | KOL 内容表现 | GET | /api/v1/douyin/xingtu/kol_rec_videos_v1 | low |
| xingtu_kol_daily_fans_v1 | ⭐⭐ 条件 | KOL 粉丝趋势 | GET | /api/v1/douyin/xingtu/kol_daily_fans_v1 | low |
| xingtu_author_hot_comment_tokens_v1 | ⭐ 条件 | KOL 评论热词 | GET | /api/v1/douyin/xingtu/author_hot_comment_tokens_v1 | low |
| xingtu_author_content_hot_comment_keywords_v1 | ⭐ 条件 | KOL 内容热词 | GET | /api/v1/douyin/xingtu/author_content_hot_comment_keywords_v1 | low |

### KOL 搜索

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| xingtu_search_kol_v1 | ⭐⭐ 条件 | 基础关键词搜索 KOL | GET | /api/v1/douyin/xingtu/search_kol_v1 | low |
| xingtu_search_kol_v2 | ⭐⭐⭐ 首选 | 高级搜索 KOL（支持粉丝范围/内容标签筛选） | GET | /api/v1/douyin/xingtu/search_kol_v2 | low |

### 星图 V2 排行榜

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| xingtu_v2_get_ranking_list_catalog | ⭐⭐⭐ 首选 | 获取星图热榜分类（**链式前置**） | GET | /api/v1/douyin/xingtu_v2/get_ranking_list_catalog | low |
| xingtu_v2_get_ranking_list_data | ⭐⭐ 条件 | 获取达人商业榜数据 | GET | /api/v1/douyin/xingtu_v2/get_ranking_list_data | low |
| xingtu_v2_get_playlet_actor_rank_catalog | ⭐ 条件 | 获取短剧演员热榜分类（**POST, risk:high**） | POST | /api/v1/douyin/xingtu_v2/get_playlet_actor_rank_catalog | **high** |
| xingtu_v2_get_playlet_actor_rank_list | ⭐ 条件 | 获取短剧演员热榜 | GET | /api/v1/douyin/xingtu_v2/get_playlet_actor_rank_list | low |

### 星图 V2 创作者分析

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| xingtu_v2_get_author_market_fields | ⭐⭐ 条件 | 获取达人广场筛选字段 | GET | /api/v1/douyin/xingtu_v2/get_author_market_fields | low |
| xingtu_v2_get_author_base_info | ⭐⭐⭐ 首选 | 创作者基本信息（**链式核心**） | GET | /api/v1/douyin/xingtu_v2/get_author_base_info | low |
| xingtu_v2_get_author_business_card_info | ⭐⭐ 条件 | 创作者商业卡片 | GET | /api/v1/douyin/xingtu_v2/get_author_business_card_info | low |
| xingtu_v2_get_author_local_info | ⭐⭐ 条件 | 创作者位置信息 | GET | /api/v1/douyin/xingtu_v2/get_author_local_info | low |
| xingtu_v2_get_author_show_items | ⭐⭐ 条件 | 创作者视频列表 | GET | /api/v1/douyin/xingtu_v2/get_author_show_items | low |
| xingtu_v2_get_author_hot_comment_tokens | ⭐ 条件 | 创作者评论热词 | GET | /api/v1/douyin/xingtu_v2/get_author_hot_comment_tokens | low |
| xingtu_v2_get_author_content_hot_keywords | ⭐ 条件 | 创作者内容热词 | GET | /api/v1/douyin/xingtu_v2/get_author_content_hot_keywords | low |
| xingtu_v2_get_recommend_for_star_authors | ⭐ 条件 | 相似创作者推荐（**POST, risk:high**） | POST | /api/v1/douyin/xingtu_v2/get_recommend_for_star_authors | **high** |

### 星图 V2 其他

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| xingtu_v2_get_excellent_case_category_list | ⭐ 条件 | 获取优秀行业分类列表 | GET | /api/v1/douyin/xingtu_v2/get_excellent_case_category_list | low |
| xingtu_v2_get_author_spread_info | ⭐⭐ 条件 | 创作者传播价值 | GET | /api/v1/douyin/xingtu_v2/get_author_spread_info | low |
| xingtu_v2_get_user_profile_qrcode | ⭐ 条件 | 用户主页二维码（**oneOf: core_user_id / sec_uid**） | GET | /api/v1/douyin/xingtu_v2/get_user_profile_qrcode | low |
| xingtu_v2_get_content_trend_guide | ⭐ 条件 | 内容趋势指南 | GET | /api/v1/douyin/xingtu_v2/get_content_trend_guide | low |
| xingtu_v2_get_ip_activity_industry_list | ⭐⭐ 条件 | IP 日历行业列表（**链式前置**） | GET | /api/v1/douyin/xingtu_v2/get_ip_activity_industry_list | low |
| xingtu_v2_get_ip_activity_list | ⭐⭐ 条件 | IP 日历活动列表（**POST, risk:high**） | POST | /api/v1/douyin/xingtu_v2/get_ip_activity_list | **high** |
| xingtu_v2_get_ip_activity_detail | ⭐⭐ 条件 | IP 活动详情 | GET | /api/v1/douyin/xingtu_v2/get_ip_activity_detail | low |
| xingtu_v2_get_resource_list | ⭐ 条件 | 营销活动案例 | GET | /api/v1/douyin/xingtu_v2/get_resource_list | low |
| xingtu_v2_get_demander_mcn_list | ⭐⭐ 条件 | 搜索 MCN 机构 | GET | /api/v1/douyin/xingtu_v2/get_demander_mcn_list | low |

---

## 子文件路由 (Sub-file Router)

| 子领域 | 文件 | 端点数 | 用户目标关键词 |
|--------|------|--------|----------|
| KOL ID 查找 | [./kol-resolver.md](./kol-resolver.md) | 4 | "uid 转 kolId" / "解析星图加密图" |
| KOL 分析 V1 | [./kol-info-v1.md](./kol-info-v1.md) | 16 | "看 KOL 基本信息" / "看粉丝画像" / "看服务报价" |
| KOL 搜索 + V2 排行榜 | [./search-rank.md](./search-rank.md) | 7 | "搜 KOL" / "看达人商业榜" / "看短剧演员榜" |
| 星图 V2 业务 | [./v2-business.md](./v2-business.md) | 17 | "看创作者基本信息" / "看 IP 日历" / "搜 MCN" |

---

## 链式调用图谱 (Chain Recipes)

> 当单个端点无法直接产出用户所需数据时，按下面链路组合调用。`字段流`列指明字段如何从上一步流向下一步，避免 Agent 臆造字段名。

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| uid → KOL 分析 | get_xingtu_kolid_by_uid → kol_base_info_v1 | `$.data.kolId` → `kolId` | ID 查找失败：STOP |
| sec_user_id → KOL 分析 | get_xingtu_kolid_by_sec_user_id → kol_base_info_v1 | `$.data.kolId` → `kolId` | ID 查找失败：STOP |
| KOL 搜索 → KOL 详情 | search_kol_v2 → kol_base_info_v1 | `$.data.list[].kolId` → `kolId` | 搜索失败：STOP |
| KOL 基本信息 → 粉丝画像 | kol_base_info_v1 → kol_fans_portrait_v1 | `kolId` → `kolId` | 基本信息失败：STOP |
| KOL 基本信息 → 服务报价 | kol_base_info_v1 → kol_service_price_v1 | `kolId` → `kolId`；`platformChannel` → `platformChannel` | 基本信息失败：STOP |
| KOL 基本信息 → 数据概览 | kol_base_info_v1 → kol_data_overview_v1 | `kolId` → `kolId` | 基本信息失败：STOP |
| 榜单分类 → 榜单数据 | get_ranking_list_catalog → get_ranking_list_data | `$.data.code` → `code` | 分类获取失败：STOP |
| 榜单 → 创作者详情 | get_ranking_list_data → get_author_base_info | `$.data.list[].o_author_id` → `o_author_id` | 榜单获取失败：STOP |
| 创作者基本信息 → 商业卡片 | get_author_base_info → get_author_business_card_info | `o_author_id` → `o_author_id` | 基本信息失败：STOP |
| 创作者基本信息 → 视频列表 | get_author_base_info → get_author_show_items | `o_author_id` → `o_author_id` | 基本信息失败：STOP |
| IP 行业 → IP 活动 → IP 详情 | get_ip_activity_industry_list → get_ip_activity_list → get_ip_activity_detail | `$.data.industry_id` → `industry_id_list`；`$.data.list[].id` → `id` | 行业获取失败：STOP |
| KOL 搜索 → 用户详情 | search_kol_v2 → user.md | `$.data.list[].uid` → `uid`（→ `web_fetch_user_profile_by_uid`） | 跨文件链路，详见 user.md |
| 创作者详情 → 用户详情 | get_author_base_info → user.md | `$.data.sec_uid` → `sec_user_id`（→ user.md 端点） | 跨文件链路，详见 user.md |

---

## 跨 reference 链路 (In-Chain)

- **流入本文件**：`user.md` 的 `web_handler_user_profile_v4` 输出 `$.data.user.uid` → 本文件 `xingtu_get_xingtu_kolid_by_uid` 的 `uid`
- **流入本文件**：`user.md` 的 `web_handler_user_profile_v4` 输出 `$.data.user.sec_uid` → 本文件 `xingtu_get_xingtu_kolid_by_sec_user_id` 的 `sec_user_id`
- **流入本文件**：`tools.md` 的 `web_get_sec_user_id` 输出 `$.data.sec_user_id` → 本文件 `xingtu_get_xingtu_kolid_by_sec_user_id` 的 `sec_user_id`
- **流出本文件**：`xingtu_search_kol_v2` 输出 `$.data.list[].uid` → `user.md` 的 `web_fetch_user_profile_by_uid` 的 `uid`
- **流出本文件**：`xingtu_v2_get_author_base_info` 输出 `$.data.sec_uid` → `user.md` 全部 user 系端点的 `sec_user_id`
- **流出本文件**：`xingtu_v2_get_author_show_items` 输出 `$.data.list[].aweme_id` → `video.md` 全部 video 系端点的 `aweme_id`

---

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项；通用规则见此处。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](../param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](../param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
  - 路径是否在 [`endpoints_whitelist.yaml`](../endpoints_whitelist.yaml) 中？
  - Method、参数键名是否符合白名单？
  - 资源 ID（kolId / o_author_id / uid）是否来自合法响应字段？
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**，向用户报告
- **禁止**：❌ 改路径段（xingtu→xingtu_v2 试探）❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改资源 ID 重试
- **替换**：参考 [`param-mappings.md`](../param-mappings.md) 的"端点替换矩阵"

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](../param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
  - 参数名是否逐字符匹配 IN 表？注意 `kolId` vs `o_author_id` vs `author_id` 的区别
  - 必填项是否齐全？
  - 传参方式（query vs body）是否正确？Authorization 头是否正确？
  - **是否有 IN 表外的臆造参数**？
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP
- **禁止**：❌ 切换端点 ❌ 在 IN 表外凭空加参数

### 星图端点特化规则
- **kolId 与 o_author_id 是不同 ID 体系**：kolId 用于 V1 端点（`xingtu_kol_*`），o_author_id 用于 V2 端点（`xingtu_v2_get_author_*`），不可混用
- **author_id 参数**：`xingtu_v2_get_author_hot_comment_tokens` 和 `xingtu_v2_get_author_content_hot_keywords` 使用 `author_id`（非 `o_author_id`），实际值与 o_author_id 相同
- **platformChannel 参数**：`_1`=抖音短视频，`_10`=抖音直播
- **platformSource 参数**：`_1`=抖音，`_2`=头条，`_3`=西瓜
- **_type 参数**：`_1`=个人视频，`_2`=星图视频
- **_range 参数**：`_1`=近 7 天，`_2`=近 30 天，`_3`=近 90 天（不同端点支持范围不同）
- **fansType 参数**：`_1`=粉丝画像，`_2`=粉丝团画像，`_5`=铁粉画像
- **detailType 参数**：`_1`=相关视频数据，`_2`=相关商品数据
- **日期格式不一致**：`kol_daily_fans_v1` 使用 `yyyy-MM-dd`（如 `2024-12-01`），其他端点使用不同格式
- **contentTag 参数**：格式为 `tag-{id}`（一级标签）或 `tag_level_two-{id}`（二级标签），如 `tag-1`=美妆
- **4 个 POST 端点全部 risk:high**：`get_playlet_actor_rank_catalog`、`get_recommend_for_star_authors`、`get_ip_activity_list`，调用前必须获得用户确认
- **oneOf 逻辑**：`get_user_profile_qrcode` 的 `core_user_id` 与 `sec_uid` 二选一
