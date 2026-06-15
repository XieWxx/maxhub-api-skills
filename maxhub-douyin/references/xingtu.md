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
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
  - 路径是否在 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 中？
  - Method、参数键名是否符合白名单？
  - 资源 ID（kolId / o_author_id / uid）是否来自合法响应字段？
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**，向用户报告
- **禁止**：❌ 改路径段（xingtu→xingtu_v2 试探）❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改资源 ID 重试
- **替换**：参考 [`param-mappings.md`](./param-mappings.md) 的"端点替换矩阵"

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
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

---

## 端点详情

---

### xingtu_get_xingtu_kolid_by_uid — 用 uid 获取星图 kolId

**Full path:** `/api/v1/douyin/xingtu/get_xingtu_kolid_by_uid`
**Method:** GET · **Risk:** low

#### 用途
根据抖音用户 ID（uid）获取星图平台的 kolId。**链式调用的常见起点**——kolId 是 V1 端点的核心入参。

#### 何时使用 / 不使用
- ✅ 已知 uid，需要获取 kolId
- ✅ 链式起点：uid → kolId → KOL 分析端点
- ❌ 已知 sec_user_id → 用 `xingtu_get_xingtu_kolid_by_sec_user_id`
- ❌ 已知 kolId → 直接调用 KOL 分析端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | 纯数字 | 抖音用户 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| kolId | `$.data.kolId` | 星图 KOL ID | xingtu_kol_*_v1 系列端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | uid 缺失 | 补全参数重试 | ≤1 次 | — |
| 404 | uid 不存在或未入驻星图 | STOP | 0 | — |

---

### xingtu_get_xingtu_kolid_by_sec_user_id — 用 sec_user_id 获取星图 kolId

**Full path:** `/api/v1/douyin/xingtu/get_xingtu_kolid_by_sec_user_id`
**Method:** GET · **Risk:** low

#### 用途
根据抖音 sec_user_id 获取星图平台的 kolId。**链式调用的常见起点**——sec_user_id 可从 user.md 或 tools.md 流入。

#### 何时使用 / 不使用
- ✅ 已知 sec_user_id，需要获取 kolId
- ✅ 链式起点：sec_user_id → kolId → KOL 分析端点
- ❌ 已知 uid → 用 `xingtu_get_xingtu_kolid_by_uid`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_user_id | string | yes | — | 抖音用户 sec_user_id |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| kolId | `$.data.kolId` | 星图 KOL ID | xingtu_kol_*_v1 系列端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | sec_user_id 缺失 | 补全参数重试 | ≤1 次 | — |
| 404 | sec_user_id 不存在或未入驻星图 | STOP | 0 | — |

---

### xingtu_get_xingtu_kolid_by_unique_id — 用抖音号获取星图 kolId

**Full path:** `/api/v1/douyin/xingtu/get_xingtu_kolid_by_unique_id`
**Method:** GET · **Risk:** low

#### 用途
根据抖音号（unique_id）获取星图平台的 kolId。

#### 何时使用 / 不使用
- ✅ 已知抖音号，需要获取 kolId
- ❌ 已知 uid 或 sec_user_id → 优先用对应端点（更可靠）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| unique_id | string | yes | — | 抖音号 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| kolId | `$.data.kolId` | 星图 KOL ID | xingtu_kol_*_v1 系列端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | unique_id 缺失 | 补全参数重试 | ≤1 次 | — |
| 404 | 抖音号不存在或未入驻星图 | STOP | 0 | — |

---

### xingtu_get_sign_image — 解析星图加密图片

**Full path:** `/api/v1/douyin/xingtu/get_sign_image`
**Method:** GET · **Risk:** low

#### 用途
解析星图加密图片，返回可访问的图片 URL。星图部分图片（如头像、数据图表）使用加密 URI，需通过本端点解析。

#### 何时使用 / 不使用
- ✅ 星图返回的图片 URI 需要解析为可访问 URL
- ❌ 已有可直接访问的图片 URL → 无需解析

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uri | string | yes | — | 图片 URI |
| durationTS | integer | no | default: 86400 | 有效期时长（秒） |
| format | string | no | default: webp | 图片格式 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 图片 URL 为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | uri 缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### xingtu_kol_base_info_v1 — KOL 基本信息

**Full path:** `/api/v1/douyin/xingtu/kol_base_info_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 基本信息（昵称、头像、粉丝数、简介等）。**V1 端点的链式核心**——kolId 和 platformChannel 从此处确认。

#### 何时使用 / 不使用
- ✅ 已知 kolId，需要获取 KOL 基本信息
- ✅ 链式核心：基本信息 → 粉丝画像/服务报价/数据概览
- ❌ 不知 kolId → 先通过 ID 查找端点获取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |
| platformChannel | string | yes | enum: _1=抖音短视频, _10=抖音直播 | 平台渠道 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| kolId | `$.data.kolId` | 星图 KOL ID | xingtu_kol_*_v1 系列端点 |
| platformChannel | `$.data.platformChannel` | 平台渠道 | xingtu_kol_service_price_v1 等 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | kolId 或 platformChannel 缺失 | 补全参数重试 | ≤1 次 | — |
| 404 | kolId 不存在 | STOP | 0 | — |

---

### xingtu_kol_audience_portrait_v1 — KOL 观众画像

**Full path:** `/api/v1/douyin/xingtu/kol_audience_portrait_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 观众画像数据（性别/年龄/地域/兴趣分布等）。

#### 何时使用 / 不使用
- ✅ 查看 KOL 观众画像
- ❌ 查看粉丝画像 → 用 `xingtu_kol_fans_portrait_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 观众画像为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | kolId 缺失 | 补全参数重试 | ≤1 次 | — |
| 404 | kolId 不存在 | STOP | 0 | — |

---

### xingtu_kol_fans_portrait_v1 — KOL 粉丝画像

**Full path:** `/api/v1/douyin/xingtu/kol_fans_portrait_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 粉丝画像数据，支持粉丝/粉丝团/铁粉三种类型。

#### 何时使用 / 不使用
- ✅ 查看 KOL 粉丝画像
- ✅ 需要区分粉丝团/铁粉 → 设置 fansType
- ❌ 查看观众画像 → 用 `xingtu_kol_audience_portrait_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |
| fansType | string | no | enum: _1=粉丝画像, _2=粉丝团画像, _5=铁粉画像, default: _1 | 粉丝类型 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 粉丝画像为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | kolId 缺失 | 补全参数重试 | ≤1 次 | — |
| 404 | kolId 不存在 | STOP | 0 | — |

---

### xingtu_kol_service_price_v1 — KOL 服务报价

**Full path:** `/api/v1/douyin/xingtu/kol_service_price_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 服务报价信息。

#### 何时使用 / 不使用
- ✅ 查看 KOL 商业报价
- ❌ 不知 platformChannel → 先从 `kol_base_info_v1` 获取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |
| platformChannel | string | yes | enum: _1=抖音短视频, _10=抖音直播 | 平台渠道 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 服务报价为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | kolId 或 platformChannel 缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_kol_data_overview_v1 — KOL 数据概览

**Full path:** `/api/v1/douyin/xingtu/kol_data_overview_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 数据概览（播放量、互动数据等）。

#### 何时使用 / 不使用
- ✅ 查看 KOL 整体数据概览
- ❌ 需要转化能力 → 用 `xingtu_kol_conversion_ability_analysis_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |
| _type | string | yes | enum: _1=个人视频, _2=星图视频 | 类型 |
| _range | string | yes | enum: _2=近30天, _3=近90天 | 范围 |
| flowType | integer | yes | 1=默认 | 流量类型 |
| onlyAssign | boolean | no | false=全部, true=仅指派数据 | 是否仅看指派 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 数据概览为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 必填参数缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_kol_conversion_ability_analysis_v1 — KOL 转化能力分析

**Full path:** `/api/v1/douyin/xingtu/kol_conversion_ability_analysis_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 转化能力分析数据。

#### 何时使用 / 不使用
- ✅ 查看 KOL 转化能力
- ❌ 只看数据概览 → 用 `xingtu_kol_data_overview_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |
| _range | string | yes | enum: _1=近7天, _2=近30天, _3=近90天 | 时间范围 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 转化能力为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 必填参数缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_kol_video_performance_v1 — KOL 视频表现

**Full path:** `/api/v1/douyin/xingtu/kol_video_performance_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 视频表现数据。

#### 何时使用 / 不使用
- ✅ 查看 KOL 视频表现统计
- ❌ 查看具体视频列表 → 用 `xingtu_kol_rec_videos_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |
| onlyAssign | boolean | yes | false=全部, true=仅星图分配作品 | 是否只显示分配作品 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 视频表现为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 必填参数缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_kol_xingtu_index_v1 — KOL 星图指数

**Full path:** `/api/v1/douyin/xingtu/kol_xingtu_index_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 星图指数（传播指数/互动指数/性价比指数等综合评分）。

#### 何时使用 / 不使用
- ✅ 查看 KOL 综合评分
- ❌ 查看具体数据 → 用 `xingtu_kol_data_overview_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 星图指数为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | kolId 缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_kol_convert_video_display_v1 — KOL 转化视频展示

**Full path:** `/api/v1/douyin/xingtu/kol_convert_video_display_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 转化视频展示数据，支持视频数据和商品数据两种类型。

#### 何时使用 / 不使用
- ✅ 查看 KOL 转化视频或商品数据
- ❌ 查看视频表现统计 → 用 `xingtu_kol_video_performance_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |
| detailType | string | yes | enum: _1=相关视频数据, _2=相关商品数据 | 详情类型 |
| page | integer | yes | — | 页码 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 转化视频为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 必填参数缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_kol_link_struct_v1 — KOL 连接用户

**Full path:** `/api/v1/douyin/xingtu/kol_link_struct_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 连接用户数据（粉丝与其他 KOL 的关联结构）。

#### 何时使用 / 不使用
- ✅ 查看 KOL 的用户关联结构
- ❌ 查看连接来源分布 → 用 `xingtu_kol_touch_distribution_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 连接用户为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | kolId 缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_kol_touch_distribution_v1 — KOL 连接用户来源

**Full path:** `/api/v1/douyin/xingtu/kol_touch_distribution_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 连接用户来源分布数据。

#### 何时使用 / 不使用
- ✅ 查看 KOL 粉丝来源渠道分布
- ❌ 查看关联结构 → 用 `xingtu_kol_link_struct_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 来源分布为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | kolId 缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_kol_cp_info_v1 — KOL 性价比分析

**Full path:** `/api/v1/douyin/xingtu/kol_cp_info_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 性价比能力分析数据。

#### 何时使用 / 不使用
- ✅ 评估 KOL 投放性价比
- ❌ 查看服务报价 → 用 `xingtu_kol_service_price_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 性价比为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | kolId 缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_kol_rec_videos_v1 — KOL 内容表现

**Full path:** `/api/v1/douyin/xingtu/kol_rec_videos_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 内容表现数据（推荐视频列表）。

#### 何时使用 / 不使用
- ✅ 查看 KOL 内容表现
- ❌ 查看视频表现统计 → 用 `xingtu_kol_video_performance_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 内容表现为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | kolId 缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_kol_daily_fans_v1 — KOL 粉丝趋势

**Full path:** `/api/v1/douyin/xingtu/kol_daily_fans_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 每日粉丝趋势数据。**注意：日期格式为 `yyyy-MM-dd`（如 `2024-12-01`），与其他端点不同。**

#### 何时使用 / 不使用
- ✅ 查看 KOL 粉丝增长趋势
- ❌ 查看粉丝画像 → 用 `xingtu_kol_fans_portrait_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |
| startDate | string | yes | 格式 `yyyy-MM-dd` | 开始日期 |
| endDate | string | yes | 格式 `yyyy-MM-dd` | 结束日期 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 粉丝趋势为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 必填参数缺失或日期格式错误 | 校正参数重试 | ≤1 次 | — |

---

### xingtu_author_hot_comment_tokens_v1 — KOL 评论热词

**Full path:** `/api/v1/douyin/xingtu/author_hot_comment_tokens_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 评论热词分析数据。

#### 何时使用 / 不使用
- ✅ 查看 KOL 评论中的热门词汇
- ❌ 查看内容热词 → 用 `xingtu_author_content_hot_comment_keywords_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 评论热词为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | kolId 缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_author_content_hot_comment_keywords_v1 — KOL 内容热词

**Full path:** `/api/v1/douyin/xingtu/author_content_hot_comment_keywords_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 内容热词分析数据。

#### 何时使用 / 不使用
- ✅ 查看 KOL 内容中的热门关键词
- ❌ 查看评论热词 → 用 `xingtu_author_hot_comment_tokens_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 内容热词为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | kolId 缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_search_kol_v1 — 基础关键词搜索 KOL

**Full path:** `/api/v1/douyin/xingtu/search_kol_v1`
**Method:** GET · **Risk:** low

#### 用途
基础关键词搜索 KOL，返回匹配的 KOL 列表。

#### 何时使用 / 不使用
- ✅ 简单关键词搜索 KOL
- ❌ 需要粉丝范围/内容标签筛选 → 用 `xingtu_search_kol_v2`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| platformSource | string | yes | enum: _1=抖音, _2=头条, _3=西瓜 | 平台来源 |
| page | integer | yes | — | 页码 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].kolId | `$.data.list[].kolId` | 星图 KOL ID | xingtu_kol_*_v1 系列端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 必填参数缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### xingtu_search_kol_v2 — 高级搜索 KOL

**Full path:** `/api/v1/douyin/xingtu/search_kol_v2`
**Method:** GET · **Risk:** low

#### 用途
高级搜索 KOL，支持粉丝范围和内容标签筛选。**推荐使用**——筛选能力更强。

#### 何时使用 / 不使用
- ✅ 需要按粉丝范围/内容标签筛选 KOL
- ✅ 链式起点：搜索结果 → kolId → KOL 分析
- ❌ 简单搜索 → 用 `xingtu_search_kol_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| followerRange | string | no | 格式: `10-100` 表示 10 万-100 万 | 粉丝范围 |
| contentTag | string | no | 格式: `tag-{id}` 或 `tag_level_two-{id}` | 内容标签（如 `tag-1`=美妆） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].kolId | `$.data.list[].kolId` | 星图 KOL ID | xingtu_kol_*_v1 系列端点 |
| list[].uid | `$.data.list[].uid` | 抖音 uid | user.md 的 web_fetch_user_profile_by_uid |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | keyword 缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### xingtu_v2_get_ranking_list_catalog — 获取星图热榜分类

**Full path:** `/api/v1/douyin/xingtu_v2/get_ranking_list_catalog`
**Method:** GET · **Risk:** low

#### 用途
获取星图热榜分类目录。**排行榜的前置步骤**——获取 code 和 biz_scene 供 `get_ranking_list_data` 使用。

#### 何时使用 / 不使用
- ✅ 调用 `get_ranking_list_data` 前获取分类
- ❌ 已知榜单参数 → 直接调用 `get_ranking_list_data`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| codes | string | no | default: 空字符串 | 分类代码 |
| biz_scene | string | no | douyin_flow_split_video_author_ranks=短视频达人热榜, douyin_flow_split_live_author_ranks=直播达人热榜 | 业务场景 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| catalog[].code | `$.data.catalog[].code` | 榜单类型代码 | xingtu_v2_get_ranking_list_data 的 code |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### xingtu_v2_get_ranking_list_data — 获取达人商业榜数据

**Full path:** `/api/v1/douyin/xingtu_v2/get_ranking_list_data`
**Method:** GET · **Risk:** low

#### 用途
获取星图达人商业榜数据。

#### 何时使用 / 不使用
- ✅ 查看达人商业排行榜
- ❌ 查看短剧演员榜 → 用 `xingtu_v2_get_playlet_actor_rank_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| code | integer | no | default: 1 | 榜单类型代码 |
| qualifier | string | no | default: 1901 | 榜单分类 ID |
| version | string | no | flow_split=短视频榜单, base=直播榜单, default: flow_split | 版本 |
| period | integer | no | enum: 7=周榜, 30=月榜, default: 30 | 统计周期 |
| date | string | no | 格式 YYYYMMDD | 统计日期 |
| limit | integer | no | default: 100 | 返回数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].o_author_id | `$.data.list[].o_author_id` | 创作者 ID | xingtu_v2_get_author_base_info |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### xingtu_v2_get_playlet_actor_rank_catalog — 获取短剧演员热榜分类

**Full path:** `/api/v1/douyin/xingtu_v2/get_playlet_actor_rank_catalog`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取短剧演员热榜分类数据。

#### 何时使用 / 不使用
- ✅ 调用 `get_playlet_actor_rank_list` 前获取分类
- ❌ 已知分类参数 → 直接调用 `get_playlet_actor_rank_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 无必填参数 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 分类数据为参考数据 | xingtu_v2_get_playlet_actor_rank_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### xingtu_v2_get_playlet_actor_rank_list — 获取短剧演员热榜

**Full path:** `/api/v1/douyin/xingtu_v2/get_playlet_actor_rank_list`
**Method:** GET · **Risk:** low

#### 用途
获取短剧演员热榜数据。

#### 何时使用 / 不使用
- ✅ 查看短剧演员排行榜
- ❌ 查看达人商业榜 → 用 `xingtu_v2_get_ranking_list_data`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| category | string | no | default: playlet_actor_list | 分类 |
| name | string | no | default: playlet_actor_composite_list | 榜单名称 |
| qualifier | string | no | 空=不限 | 达人类型 |
| period | integer | no | enum: 7=周榜, 30=月榜, default: 30 | 统计周期 |
| date | string | no | 格式 YYYYMMDD | 统计日期 |
| limit | integer | no | default: 100 | 返回数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 短剧演员榜为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### xingtu_v2_get_author_market_fields — 获取达人广场筛选字段

**Full path:** `/api/v1/douyin/xingtu_v2/get_author_market_fields`
**Method:** GET · **Risk:** low

#### 用途
获取达人广场筛选字段数据。

#### 何时使用 / 不使用
- ✅ 需要了解达人广场的筛选维度
- ❌ 直接搜索达人 → 用 `xingtu_search_kol_v2`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| market_scene | integer | no | default: 1 | 市场场景 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 筛选字段为参考数据 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### xingtu_v2_get_author_base_info — 创作者基本信息

**Full path:** `/api/v1/douyin/xingtu_v2/get_author_base_info`
**Method:** GET · **Risk:** low

#### 用途
获取创作者基本信息（昵称、头像、粉丝数、sec_uid 等）。**V2 端点的链式核心**——o_author_id 从此处确认，sec_uid 可流出至 user.md。

#### 何时使用 / 不使用
- ✅ 已知 o_author_id，需要获取创作者基本信息
- ✅ 链式核心：基本信息 → 商业卡片/位置/视频/传播价值
- ❌ 不知 o_author_id → 先通过搜索或排行榜获取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| o_author_id | string | yes | — | 创作者 ID |
| platform_source | integer | no | default: 1 | 平台来源 |
| platform_channel | integer | no | default: 1 | 平台渠道 |
| recommend | boolean | no | default: true | 是否返回推荐信息 |
| need_sec_uid | boolean | no | default: true | 是否返回 sec_uid |
| need_linkage_info | boolean | no | default: true | 是否返回联动信息 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| o_author_id | `$.data.o_author_id` | 创作者 ID | xingtu_v2_get_author_* 系列端点 |
| sec_uid | `$.data.sec_uid` | 用户 sec_uid | user.md 全部 user 系端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | o_author_id 缺失 | 补全参数重试 | ≤1 次 | — |
| 404 | o_author_id 不存在 | STOP | 0 | — |

---

### xingtu_v2_get_author_business_card_info — 创作者商业卡片

**Full path:** `/api/v1/douyin/xingtu_v2/get_author_business_card_info`
**Method:** GET · **Risk:** low

#### 用途
获取创作者商业卡片信息。

#### 何时使用 / 不使用
- ✅ 查看创作者商业卡片
- ❌ 查看基本信息 → 用 `xingtu_v2_get_author_base_info`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| o_author_id | string | yes | — | 创作者 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 商业卡片为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | o_author_id 缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_v2_get_author_local_info — 创作者位置信息

**Full path:** `/api/v1/douyin/xingtu_v2/get_author_local_info`
**Method:** GET · **Risk:** low

#### 用途
获取创作者位置信息数据。

#### 何时使用 / 不使用
- ✅ 查看创作者地域分布
- ❌ 查看基本信息 → 用 `xingtu_v2_get_author_base_info`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| o_author_id | string | yes | — | 创作者 ID |
| platform_source | integer | no | default: 1 | 平台来源 |
| platform_channel | integer | no | default: 1 | 平台渠道 |
| time_range | integer | no | default: 30 | 时间范围（天） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 位置信息为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | o_author_id 缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_v2_get_author_show_items — 创作者视频列表

**Full path:** `/api/v1/douyin/xingtu_v2/get_author_show_items`
**Method:** GET · **Risk:** low

#### 用途
获取创作者视频列表数据。

#### 何时使用 / 不使用
- ✅ 查看创作者视频列表
- ❌ 查看视频表现统计 → 用 `xingtu_kol_video_performance_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| o_author_id | string | yes | — | 创作者 ID |
| platform_source | integer | no | default: 1 | 平台来源 |
| platform_channel | integer | no | default: 1 | 平台渠道 |
| limit | integer | no | default: 10 | 返回数量 |
| only_assign | boolean | no | default: false | 仅看指派视频 |
| flow_type | integer | no | default: 0 | 流量类型 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].aweme_id | `$.data.list[].aweme_id` | 视频 ID | video.md 全部 video 系端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | o_author_id 缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_v2_get_author_hot_comment_tokens — 创作者评论热词

**Full path:** `/api/v1/douyin/xingtu_v2/get_author_hot_comment_tokens`
**Method:** GET · **Risk:** low

#### 用途
获取创作者评论热词数据。**注意：参数名为 `author_id`（非 `o_author_id`），但实际值与 o_author_id 相同。**

#### 何时使用 / 不使用
- ✅ 查看 V2 创作者评论热词
- ❌ 查看 V1 KOL 评论热词 → 用 `xingtu_author_hot_comment_tokens_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| author_id | string | yes | 值与 o_author_id 相同 | 创作者 ID |
| num | integer | no | default: 10 | 返回热词数量 |
| without_emoji | boolean | no | default: true | 是否排除 emoji |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 评论热词为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | author_id 缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_v2_get_author_content_hot_keywords — 创作者内容热词

**Full path:** `/api/v1/douyin/xingtu_v2/get_author_content_hot_keywords`
**Method:** GET · **Risk:** low

#### 用途
获取创作者内容热词数据。**注意：参数名为 `author_id`（非 `o_author_id`），但实际值与 o_author_id 相同。**

#### 何时使用 / 不使用
- ✅ 查看 V2 创作者内容热词
- ❌ 查看 V1 KOL 内容热词 → 用 `xingtu_author_content_hot_comment_keywords_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| author_id | string | yes | 值与 o_author_id 相同 | 创作者 ID |
| keyword_type | integer | no | default: 0 | 热词类型 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 内容热词为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | author_id 缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_v2_get_recommend_for_star_authors — 相似创作者推荐

**Full path:** `/api/v1/douyin/xingtu_v2/get_recommend_for_star_authors`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取与指定创作者相似的推荐创作者列表。参数通过 body 传递。

#### 何时使用 / 不使用
- ✅ 查找与某创作者相似的其他创作者
- ❌ 简单搜索 → 用 `xingtu_search_kol_v2`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| author_ids | array | yes | body 传递 | 创作者 ID 列表 |
| similar_type | string | yes | body 传递, enum: comprehension=综合, content=内容, audience=用户, commercial=商业 | 相似类型 |
| page | integer | no | body 传递, default: 1 | 页码 |
| limit | integer | no | body 传递, default: 12 | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].o_author_id | `$.data.list[].o_author_id` | 推荐创作者 ID | xingtu_v2_get_author_base_info |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 必填参数缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### xingtu_v2_get_excellent_case_category_list — 优秀行业分类列表

**Full path:** `/api/v1/douyin/xingtu_v2/get_excellent_case_category_list`
**Method:** GET · **Risk:** low

#### 用途
获取优秀行业分类列表。

#### 何时使用 / 不使用
- ✅ 浏览行业分类
- ❌ 搜索 MCN → 用 `xingtu_v2_get_demander_mcn_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| platform_source | integer | no | default: 1 | 平台来源 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 行业分类为参考数据 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### xingtu_v2_get_author_spread_info — 创作者传播价值

**Full path:** `/api/v1/douyin/xingtu_v2/get_author_spread_info`
**Method:** GET · **Risk:** low

#### 用途
获取创作者传播价值数据。

#### 何时使用 / 不使用
- ✅ 评估创作者传播价值
- ❌ 查看基本信息 → 用 `xingtu_v2_get_author_base_info`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| o_author_id | string | yes | — | 创作者 ID |
| platform_source | integer | no | default: 1 | 平台来源 |
| platform_channel | integer | no | default: 1 | 平台渠道 |
| type | integer | no | 1=个人视频, default: 1 | 视频类型 |
| flow_type | integer | no | default: 0 | 流量类型 |
| only_assign | boolean | no | default: false | 仅看指派视频 |
| range | integer | no | 2=近30天, 3=近90天, default: 2 | 时间范围 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 传播价值为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | o_author_id 缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_v2_get_user_profile_qrcode — 用户主页二维码

**Full path:** `/api/v1/douyin/xingtu_v2/get_user_profile_qrcode`
**Method:** GET · **Risk:** low

#### 用途
获取用户主页二维码。**oneOf 逻辑**：`core_user_id` 与 `sec_uid` 二选一。

#### 何时使用 / 不使用
- ✅ 需要生成用户主页二维码
- ✅ 已知 core_user_id 或 sec_uid（二选一）
- ❌ 不知任何 ID → 先通过搜索或 ID 查找获取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| core_user_id | string | **oneOf** | 与 sec_uid 二选一 | 用户核心 ID |
| sec_uid | string | **oneOf** | 与 core_user_id 二选一 | 用户 sec_uid |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 二维码为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | core_user_id 和 sec_uid 都未提供 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_v2_get_content_trend_guide — 内容趋势指南

**Full path:** `/api/v1/douyin/xingtu_v2/get_content_trend_guide`
**Method:** GET · **Risk:** low

#### 用途
获取内容趋势指南数据（CDN 静态 JSON，无需 Cookie）。

#### 何时使用 / 不使用
- ✅ 查看内容趋势指南
- ❌ 查看具体创作者 → 用搜索端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 无必填参数 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 趋势指南为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### xingtu_v2_get_ip_activity_industry_list — IP 日历行业列表

**Full path:** `/api/v1/douyin/xingtu_v2/get_ip_activity_industry_list`
**Method:** GET · **Risk:** low

#### 用途
获取星图 IP 日历行业列表。**IP 日历的前置步骤**——获取 industry_id 供 `get_ip_activity_list` 使用。

#### 何时使用 / 不使用
- ✅ 调用 `get_ip_activity_list` 前获取行业列表
- ❌ 已知行业 ID → 直接调用 `get_ip_activity_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 无必填参数 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].industry_id | `$.data.list[].industry_id` | 行业 ID | xingtu_v2_get_ip_activity_list 的 industry_id_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### xingtu_v2_get_ip_activity_list — IP 日历活动列表

**Full path:** `/api/v1/douyin/xingtu_v2/get_ip_activity_list`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取星图 IP 日历活动列表。参数通过 body 传递。

#### 何时使用 / 不使用
- ✅ 查看 IP 日历活动列表
- ❌ 查看活动详情 → 用 `xingtu_v2_get_ip_activity_detail`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| query_start_time | string | yes | body 传递，时间戳 | 查询开始时间 |
| query_end_time | string | yes | body 传递，时间戳 | 查询结束时间 |
| industry_id_list | array | no | body 传递 | 行业 ID 列表 |
| category_list | array | no | body 传递, 1=星图大事件, 2=电商节点, 3=情绪节点, 4=创意营销, 5=行业活动 | IP 类型 |
| status_list | array | no | body 传递, 40=筹备中, 50=招商中, 30=资源上线, 20=已结束 | IP 状态 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].id | `$.data.list[].id` | 活动 ID | xingtu_v2_get_ip_activity_detail 的 id |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 必填参数缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### xingtu_v2_get_ip_activity_detail — IP 活动详情

**Full path:** `/api/v1/douyin/xingtu_v2/get_ip_activity_detail`
**Method:** GET · **Risk:** low

#### 用途
获取星图 IP 活动详情。

#### 何时使用 / 不使用
- ✅ 查看 IP 活动详情
- ✅ 已从 `get_ip_activity_list` 获取活动 ID
- ❌ 不知活动 ID → 先调用 `get_ip_activity_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| id | integer | yes | — | 活动 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 活动详情为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | id 缺失 | 补全参数重试 | ≤1 次 | — |
| 404 | id 不存在 | STOP | 0 | — |

---

### xingtu_v2_get_resource_list — 营销活动案例

**Full path:** `/api/v1/douyin/xingtu_v2/get_resource_list`
**Method:** GET · **Risk:** low

#### 用途
获取营销活动案例数据。

#### 何时使用 / 不使用
- ✅ 查看营销活动案例
- ❌ 查看 IP 活动 → 用 `xingtu_v2_get_ip_activity_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| resource_id | integer | yes | — | 资源 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 营销案例为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | resource_id 缺失 | 补全参数重试 | ≤1 次 | — |
| 404 | resource_id 不存在 | STOP | 0 | — |

---

### xingtu_v2_get_demander_mcn_list — 搜索 MCN 机构

**Full path:** `/api/v1/douyin/xingtu_v2/get_demander_mcn_list`
**Method:** GET · **Risk:** low

#### 用途
搜索 MCN 机构列表，支持模糊搜索和排序。

#### 何时使用 / 不使用
- ✅ 搜索 MCN 机构
- ❌ 搜索 KOL → 用 `xingtu_search_kol_v2`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| mcn_name | string | no | 支持模糊搜索 | MCN 机构名称 |
| page | integer | no | default: 1 | 页码 |
| limit | integer | no | default: 20 | 每页数量 |
| order_by | string | no | default: platform_scores | 排序方式 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | MCN 列表为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |
