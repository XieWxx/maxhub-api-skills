# Douyin Trending / 抖音热榜

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖

App V3 热搜榜（热点/直播/音乐/品牌）、Web 热搜结果与视频频道、Billboard 热点榜单（上升/同城/挑战/总榜）、活动日历、作品观众画像与评论词云、热门账号分析（粉丝画像/兴趣/趋势）、视频榜（总榜/低粉爆款/高完播率/高点赞率/高涨粉率）、话题榜、搜索榜、热词榜。**aweme_id 与 sec_uid 多从本文件榜单端点产出**，是 video.md / user.md 等链式调用的常见入口。

> 🔒 **安全**：所有请求将 `MAXHUB_API_KEY` 和查询数据传输至 `https://www.aconfig.cn`。禁止在日志、提示词或客户端存储中暴露 API Key。

---

## 端点索引 (Endpoint Index)

### App V3 热搜榜

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| app_v3_fetch_hot_search_list | ⭐⭐⭐ 首选 | 取抖音热搜榜（热点/种草/娱乐/社会/挑战） | GET | /api/v1/douyin/app/v3/fetch_hot_search_list | low |
| app_v3_fetch_live_hot_search_list | ⭐⭐ 条件 | 取直播热搜榜 | GET | /api/v1/douyin/app/v3/fetch_live_hot_search_list | low |
| app_v3_fetch_music_hot_search_list | ⭐⭐ 条件 | 取音乐榜（热门/飙升/原创） | GET | /api/v1/douyin/app/v3/fetch_music_hot_search_list | low |
| app_v3_fetch_brand_hot_search_list | ⭐⭐ 条件 | 取品牌热榜分类 | GET | /api/v1/douyin/app/v3/fetch_brand_hot_search_list | low |
| app_v3_fetch_brand_hot_search_list_detail | ⭐⭐ 条件 | 取品牌热榜具体分类数据 | GET | /api/v1/douyin/app/v3/fetch_brand_hot_search_list_detail | low |

### Web 热榜与频道

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| web_fetch_hot_search_result | ⭐⭐ 条件 | 取 Web 版热榜数据 | GET | /api/v1/douyin/web/fetch_hot_search_result | low |
| web_fetch_video_channel_result | ⭐⭐ 条件 | 取视频频道内容（需 tag_id） | GET | /api/v1/douyin/web/fetch_video_channel_result | low |

### Billboard 基础数据

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| billboard_fetch_city_list | ⭐⭐⭐ 首选 | 取城市列表（**链式前置**，同城榜需 city_code） | GET | /api/v1/douyin/billboard/fetch_city_list | low |
| billboard_fetch_content_tag | ⭐⭐⭐ 首选 | 取垂类内容标签（**链式前置**，多端点需 query_tag/tags） | GET | /api/v1/douyin/billboard/fetch_content_tag | low |

### Billboard 热点榜单

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| billboard_fetch_hot_category_list | ⭐⭐ 条件 | 取热点榜分类（上升/同城/总榜的 ID 与热度） | GET | /api/v1/douyin/billboard/fetch_hot_category_list | low |
| billboard_fetch_hot_rise_list | ⭐⭐ 条件 | 取上升热点榜 | GET | /api/v1/douyin/billboard/fetch_hot_rise_list | low |
| billboard_fetch_hot_city_list | ⭐⭐ 条件 | 取同城热点榜 | GET | /api/v1/douyin/billboard/fetch_hot_city_list | low |
| billboard_fetch_hot_challenge_list | ⭐⭐ 条件 | 取挑战热榜 | GET | /api/v1/douyin/billboard/fetch_hot_challenge_list | low |
| billboard_fetch_hot_total_list | ⭐⭐⭐ 首选 | 取热点总榜（**最常用**） | GET | /api/v1/douyin/billboard/fetch_hot_total_list | low |

### Billboard 活动日历

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| billboard_fetch_hot_calendar_list | ⭐⭐ 条件 | 取活动日历 | POST | /api/v1/douyin/billboard/fetch_hot_calendar_list | **high** |
| billboard_fetch_hot_calendar_detail | ⭐⭐ 条件 | 取活动日历详情 | GET | /api/v1/douyin/billboard/fetch_hot_calendar_detail | low |

### Billboard 作品分析

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| billboard_fetch_hot_user_portrait_list | ⭐⭐ 条件 | 取作品点赞观众画像（需 aweme_id） | GET | /api/v1/douyin/billboard/fetch_hot_user_portrait_list | low |
| billboard_fetch_hot_comment_word_list | ⭐⭐ 条件 | 取作品评论词云权重（需 aweme_id） | GET | /api/v1/douyin/billboard/fetch_hot_comment_word_list | low |
| billboard_fetch_hot_item_trends_list | ⭐⭐ 条件 | 取作品数据趋势（点赞/分享/评论量） | GET | /api/v1/douyin/billboard/fetch_hot_item_trends_list | low |

### Billboard 热门账号

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| billboard_fetch_hot_account_list | ⭐⭐ 条件 | 取热门账号列表 | POST | /api/v1/douyin/billboard/fetch_hot_account_list | **high** |
| billboard_fetch_hot_account_search_list | ⭐⭐ 条件 | 搜索用户名或抖音号 | GET | /api/v1/douyin/billboard/fetch_hot_account_search_list | low |
| billboard_fetch_hot_account_trends_list | ⭐⭐ 条件 | 取账号数据趋势（新增点赞/作品/评论/分享） | GET | /api/v1/douyin/billboard/fetch_hot_account_trends_list | low |
| billboard_fetch_hot_account_item_analysis_list | ⭐⭐ 条件 | 取账号作品分析（默认 7 天） | GET | /api/v1/douyin/billboard/fetch_hot_account_item_analysis_list | low |
| billboard_fetch_hot_account_fans_portrait_list | ⭐⭐ 条件 | 取粉丝画像（手机/性别/年龄/地域等） | GET | /api/v1/douyin/billboard/fetch_hot_account_fans_portrait_list | low |
| billboard_fetch_hot_account_fans_interest_account_list | ⭐⭐ 条件 | 取粉丝兴趣作者（20 个） | GET | /api/v1/douyin/billboard/fetch_hot_account_fans_interest_account_list | low |
| billboard_fetch_hot_account_fans_interest_topic_list | ⭐⭐ 条件 | 取粉丝近 3 天感兴趣话题（10 个） | GET | /api/v1/douyin/billboard/fetch_hot_account_fans_interest_topic_list | low |
| billboard_fetch_hot_account_fans_interest_search_list | ⭐⭐ 条件 | 取粉丝近 3 天搜索词（10 个） | GET | /api/v1/douyin/billboard/fetch_hot_account_fans_interest_search_list | low |

### Billboard 视频/话题/搜索/热词榜

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| billboard_fetch_hot_total_video_list | ⭐⭐⭐ 首选 | 取视频热榜（含总榜/低粉爆款/高完播率等子榜） | POST | /api/v1/douyin/billboard/fetch_hot_total_video_list | **high** |
| billboard_fetch_hot_total_low_fan_list | ⭐ 降级 | 取低粉爆款榜（独立端点） | POST | /api/v1/douyin/billboard/fetch_hot_total_low_fan_list | **high** |
| billboard_fetch_hot_total_high_play_list | ⭐ 降级 | 取高完播率榜（独立端点） | POST | /api/v1/douyin/billboard/fetch_hot_total_high_play_list | **high** |
| billboard_fetch_hot_total_high_like_list | ⭐ 降级 | 取高点赞率榜（独立端点） | POST | /api/v1/douyin/billboard/fetch_hot_total_high_like_list | **high** |
| billboard_fetch_hot_total_high_fan_list | ⭐ 降级 | 取高涨粉率榜（独立端点） | POST | /api/v1/douyin/billboard/fetch_hot_total_high_fan_list | **high** |
| billboard_fetch_hot_total_topic_list | ⭐⭐ 条件 | 取话题热榜 | POST | /api/v1/douyin/billboard/fetch_hot_total_topic_list | **high** |
| billboard_fetch_hot_total_high_topic_list | ⭐⭐ 条件 | 取热度飙升话题榜 | POST | /api/v1/douyin/billboard/fetch_hot_total_high_topic_list | **high** |
| billboard_fetch_hot_total_search_list | ⭐⭐ 条件 | 取搜索热榜 | POST | /api/v1/douyin/billboard/fetch_hot_total_search_list | **high** |
| billboard_fetch_hot_total_high_search_list | ⭐⭐ 条件 | 取热度飙升搜索榜 | POST | /api/v1/douyin/billboard/fetch_hot_total_high_search_list | **high** |
| billboard_fetch_hot_total_hot_word_list | ⭐⭐ 条件 | 取全部热门内容词 | POST | /api/v1/douyin/billboard/fetch_hot_total_hot_word_list | **high** |
| billboard_fetch_hot_total_hot_word_detail_list | ⭐⭐ 条件 | 取内容词详情（需 word_id + keyword） | GET | /api/v1/douyin/billboard/fetch_hot_total_hot_word_detail_list | low |

---

## 子文件路由 (Sub-file Router)

| 子领域 | 文件 | 端点数 | 用户目标关键词 |
|--------|------|--------|----------|
| App V3 + Web 热搜+频道+城市/标签基础 | [./hot-search.md](./hot-search.md) | 9 | "看抖音热搜" / "看品牌热榜" / "查城市编码" |
| Billboard 热点榜单+活动日历+作品分析 | [./billboard-events.md](./billboard-events.md) | 10 | "看上升热点" / "看活动日历" / "看作品画像" |
| 热门账号+视频/话题/搜索/热词榜 | [./account-content.md](./account-content.md) | 19 | "看热门账号" / "看视频榜" / "看话题榜" / "看热词" |

---

## 链式调用图谱 (Chain Recipes)

> 当单个端点无法直接产出用户所需数据时，按下面链路组合调用。`字段流`列指明字段如何从上一步流向下一步，避免 Agent 臆造字段名。

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 热搜 → 视频详情 | app_v3_fetch_hot_search_list → video.md | `$.data.word_list[].aweme_id` → `aweme_id` | 跨文件链路，详见 video.md |
| 热点总榜 → 作品画像 | billboard_fetch_hot_total_list → billboard_fetch_hot_user_portrait_list | `$.data.list[].aweme_id` → `aweme_id` | 第 2 步失败：返回榜单 + "画像暂不可取" |
| 热点总榜 → 评论词云 | billboard_fetch_hot_total_list → billboard_fetch_hot_comment_word_list | `$.data.list[].aweme_id` → `aweme_id` | 第 2 步失败：返回榜单 + "词云暂不可取" |
| 热点总榜 → 作品趋势 | billboard_fetch_hot_total_list → billboard_fetch_hot_item_trends_list | `$.data.list[].aweme_id` → `aweme_id` | 第 2 步失败：返回榜单 + "趋势暂不可取" |
| 城市列表 → 同城热点 | billboard_fetch_city_list → billboard_fetch_hot_city_list | `$.data[].city_code` → `city_code` | 第 1 步失败：用空 city_code 查全部 |
| 内容标签 → 热门账号 | billboard_fetch_content_tag → billboard_fetch_hot_account_list | `$.data[].tag` → `query_tag` | 第 1 步失败：用空 query_tag 查全部 |
| 品牌分类 → 品牌详情 | app_v3_fetch_brand_hot_search_list → app_v3_fetch_brand_hot_search_list_detail | `$.data.category_list[].category_id` → `category_id` | 第 1 步失败：STOP |
| 热门账号 → 粉丝画像 | billboard_fetch_hot_account_list → billboard_fetch_hot_account_fans_portrait_list | `$.data.list[].sec_uid` → `sec_uid` | 第 2 步失败：返回账号列表 + "画像暂不可取" |
| 热门账号 → 粉丝兴趣 | billboard_fetch_hot_account_list → billboard_fetch_hot_account_fans_interest_* | `$.data.list[].sec_uid` → `sec_uid` | 第 2 步失败：返回账号列表 |
| 热门账号 → 账号趋势 | billboard_fetch_hot_account_list → billboard_fetch_hot_account_trends_list | `$.data.list[].sec_uid` → `sec_uid` | 第 2 步失败：返回账号列表 |
| 搜索账号 → 账号分析 | billboard_fetch_hot_account_search_list → billboard_fetch_hot_account_item_analysis_list | `$.data.list[].sec_uid` → `sec_uid` | 第 1 步失败：STOP |
| 热词 → 热词详情 | billboard_fetch_hot_total_hot_word_list → billboard_fetch_hot_total_hot_word_detail_list | `$.data.list[].word_id` → `word_id`；`$.data.list[].keyword` → `keyword` | 第 1 步失败：STOP |
| 活动日历 → 日历详情 | billboard_fetch_hot_calendar_list → billboard_fetch_hot_calendar_detail | `$.data.list[].calendar_id` → `calendar_id` | 第 1 步失败：STOP |
| 视频榜 → 视频详情 | billboard_fetch_hot_total_video_list → video.md | `$.data.list[].aweme_id` → `aweme_id` | 跨文件链路，详见 video.md |
| 频道 → 视频详情 | web_fetch_video_channel_result → video.md | `$.data.aweme_list[].aweme_id` → `aweme_id` | 跨文件链路，详见 video.md |

---

## 跨 reference 链路 (In-Chain)

- **流入本文件**：`video.md` 的 `app_v3_fetch_one_video` 输出 `$.data.aweme_id` → 本文件 `billboard_fetch_hot_user_portrait_list` / `billboard_fetch_hot_comment_word_list` / `billboard_fetch_hot_item_trends_list` 的 `aweme_id`
- **流入本文件**：`user.md` 的多个端点输出 `$.data.user.sec_uid` → 本文件 `billboard_fetch_hot_account_*` 系列端点的 `sec_uid`
- **流出本文件**：`$.data.list[].aweme_id` → `video.md` 各端点的 `aweme_id`
- **流出本文件**：`$.data.list[].sec_uid` → `user.md` 各端点的 `sec_user_id`
- **流出本文件**：`$.data.word_list[].keyword` → `search.md` 各搜索端点的 `keyword`
- **流出本文件**：`$.data.list[].word_id` + `keyword` → 本文件 `billboard_fetch_hot_total_hot_word_detail_list`
- **流出本文件**：`$.data[].city_code` → 本文件 `billboard_fetch_hot_city_list` 的 `city_code`
- **流出本文件**：`$.data[].tag` → 本文件 `billboard_fetch_hot_account_list` 等端点的 `query_tag` / `tags`

---

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项；通用规则见此处。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](../param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](../param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
  - 路径是否在 [`endpoints_whitelist.yaml`](../endpoints_whitelist.yaml) 中？
  - Method、参数键名是否符合白名单？注意 Billboard 端点路径前缀为 `/api/v1/douyin/billboard/`
  - 资源 ID（aweme_id / sec_uid / calendar_id / word_id / category_id 等）是否来自合法响应字段？
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**，向用户报告
- **禁止**：❌ 改路径段（billboard→app/v3 试探）❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改资源 ID 重试
- **替换**：参考 [`param-mappings.md`](../param-mappings.md) 的"端点替换矩阵"

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](../param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
  - 参数名是否逐字符匹配 IN 表？注意 `page` vs `page_num`、`page_size` vs `count` 的区别
  - 必填项是否齐全？
  - 传参方式：GET 端点参数放 query string；POST 端点参数放 body（JSON 序列化）
  - **是否有 IN 表外的臆造参数**？
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP
- **禁止**：❌ 切换端点 ❌ 在 IN 表外凭空加参数

### 鉴权错误（401）
- **行动**：**STOP**，提示用户检查或更换 API Key（https://www.aconfig.cn）

### 余额 / 付费（402）
- **行动**：**STOP**，告知用户充值（https://www.aconfig.cn）；不要自行重试

### 权限错误（403）
- **行动**：**STOP**，按子场景告知用户去控制台处理

### 限流（429）
- **行动**：读 `Retry-After` 头退避；无该头时按 `delay = min(8s, 2^attempt) * (0.5 + random*0.5)`；最多重试 2 次
- **禁止**：❌ 立即重试 ❌ 换端点

### 上游故障（500/502/503/504）
- **行动**：等 3 秒重试 1 次 → 仍失败走端点级"降级/替换"列 → 无替换则 STOP

### 网络超时
- **行动**：**STOP**，向用户报告网络异常

### 业务错误（HTTP 200 且 `code != 0`）
- **行动**：读 `message_zh`/`message` 报告用户；不要把 `data` 当作有效数据；不要重试

### 热榜特有：Billboard POST 端点风险提示
- Billboard 系列有 11 个 POST 端点，全部标记 `risk: high` + `requires_user_confirmation: true` + `write_operation: true`
- 调用前**必须**获得用户确认
- 参数通过 body 传递（JSON 序列化），不是 query string

### 热榜特有：分页参数不一致
- `billboard_fetch_hot_rise_list` / `billboard_fetch_hot_city_list` / `billboard_fetch_hot_challenge_list` / `billboard_fetch_hot_total_list`：使用 `page` + `page_size`
- `billboard_fetch_hot_account_search_list`：使用 `cursor` 翻页
- `billboard_fetch_hot_total_search_list` / `billboard_fetch_hot_total_high_search_list` / `billboard_fetch_hot_total_hot_word_list`：使用 `page_num` + `page_size`
- `billboard_fetch_hot_total_video_list` 等 5 个视频榜端点：使用 `page` + `page_size`
- **注意**：`page` vs `page_num` 不可混用

### 热榜特有：日期参数格式
- `snapshot_time`：`yyyyMMddHHmmss` 格式（如 `20250106151500`）
- `start_date` / `end_date`（GET 端点）：`yyyyMMdd` 格式（如 `20250106`）
- `start_date` / `end_date`（POST 活动日历）：10 位时间戳
- `query_day`（热词详情）：`YYYYMMDD` 格式的 integer（如 `20250105`）
- **不可混用格式**

### 热榜特有：垂类标签参数
- `billboard_fetch_content_tag` 返回的标签用于构建 `query_tag` / `tags` / `sentence_tag` 参数
- 不同端点使用不同参数名：`sentence_tag`（GET 榜单）、`query_tag`（热门账号）、`tags`（视频榜）
- 标签格式为 object，需按接口要求传递
