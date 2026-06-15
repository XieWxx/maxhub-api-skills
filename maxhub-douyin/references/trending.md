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
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
  - 路径是否在 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 中？
  - Method、参数键名是否符合白名单？注意 Billboard 端点路径前缀为 `/api/v1/douyin/billboard/`
  - 资源 ID（aweme_id / sec_uid / calendar_id / word_id / category_id 等）是否来自合法响应字段？
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**，向用户报告
- **禁止**：❌ 改路径段（billboard→app/v3 试探）❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改资源 ID 重试
- **替换**：参考 [`param-mappings.md`](./param-mappings.md) 的"端点替换矩阵"

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
  - 参数名是否逐字符匹配 IN 表？注意 `page` vs `page_num`、`page_size` vs `count` 的区别
  - 必填项是否齐全？
  - 传参方式：GET 端点参数放 query string；POST 端点参数放 body（JSON 序列化）
  - **是否有 IN 表外的臆造参数**？
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP
- **禁止**：❌ 切换端点 ❌ 在 IN 表外凭空加参数

### 鉴权错误（401）
- **行动**：**STOP**，提示用户检查或更换 API Key（https://www.aconfig.cn/console）

### 余额 / 付费（402）
- **行动**：**STOP**，告知用户充值（https://www.aconfig.cn/billing）；不要自行重试

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

---

## 端点详情

---

### app_v3_fetch_hot_search_list — 获取抖音热搜榜数据

**Full path:** `/api/v1/douyin/app/v3/fetch_hot_search_list`
**Method:** GET · **Risk:** low

#### 用途
获取抖音热搜榜数据，支持多种子榜单（热点/种草/娱乐/社会/挑战）。**最常用的热搜入口**。

#### 何时使用 / 不使用
- ✅ 想查看抖音热搜榜
- ✅ 链式起点：取 keyword / aweme_id 用于搜索或视频详情
- ❌ 想看 Billboard 详细热点分析 → 用 Billboard 系列端点
- ❌ 想看直播热搜 → 用 `app_v3_fetch_live_hot_search_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| board_type | string | no | 枚举：0/2，默认 0 | 榜单类型：0 = 热点榜，2 = 其他榜单 |
| board_sub_type | string | no | 枚举字符串 | 榜单子类型：空 = 热点榜，`"seeding"` = 种草榜，`"2"` = 娱乐榜，`"4"` = 社会榜，`"hotspot_challenge"` = 挑战榜 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| word_list[].aweme_id | `$.data.word_list[].aweme_id` | 关联视频 ID | video.md 各端点 |
| word_list[].keyword | `$.data.word_list[].word` | 热搜关键词 | search.md 各搜索端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`web_fetch_hot_search_result` |

---

### app_v3_fetch_live_hot_search_list — 获取直播热搜榜数据

**Full path:** `/api/v1/douyin/app/v3/fetch_live_hot_search_list`
**Method:** GET · **Risk:** low

#### 用途
获取抖音直播热搜榜数据。无参数，直接返回直播热搜列表。

#### 何时使用 / 不使用
- ✅ 想查看直播热搜排行
- ❌ 想看综合热搜 → 用 `app_v3_fetch_hot_search_list`

#### 输入 (IN)
无参数

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 直播热搜列表 | `$.data` | 直播热搜数据 | live.md 各端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### app_v3_fetch_music_hot_search_list — 获取音乐榜数据

**Full path:** `/api/v1/douyin/app/v3/fetch_music_hot_search_list`
**Method:** GET · **Risk:** low

#### 用途
获取抖音音乐榜数据，支持热门/飙升/原创三种榜单。

#### 何时使用 / 不使用
- ✅ 想查看音乐排行榜
- ✅ 链式起点：取 music_id 用于音乐详情
- ❌ 想看综合热搜 → 用 `app_v3_fetch_hot_search_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| chart_type | string | no | 枚举：hot/trending/original，默认 hot | 榜单类型：hot = 热门榜，trending = 飙升榜，original = 原创榜 |
| cursor | string | no | 默认 "0" | 翻页游标 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| music_id | `$.data.music_list[].id` | 音乐 ID | video.md `app_v3_fetch_music_detail` / `app_v3_fetch_music_video_list` |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### app_v3_fetch_brand_hot_search_list — 获取品牌热榜分类

**Full path:** `/api/v1/douyin/app/v3/fetch_brand_hot_search_list`
**Method:** GET · **Risk:** low

#### 用途
获取品牌热榜分类列表。返回各品牌分类的 category_id，用于 `app_v3_fetch_brand_hot_search_list_detail`。

#### 何时使用 / 不使用
- ✅ 想查看品牌热榜有哪些分类
- ✅ 链式前置：取 category_id 用于品牌详情
- ❌ 想看具体品牌排行 → 先取分类，再用 `app_v3_fetch_brand_hot_search_list_detail`

#### 输入 (IN)
无参数

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| category_id | `$.data.category_list[].category_id` | 品牌分类 ID | app_v3_fetch_brand_hot_search_list_detail |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### app_v3_fetch_brand_hot_search_list_detail — 获取品牌热榜具体分类数据

**Full path:** `/api/v1/douyin/app/v3/fetch_brand_hot_search_list_detail`
**Method:** GET · **Risk:** low

#### 用途
获取品牌热榜具体分类下的品牌排行数据。需要 category_id，从 `app_v3_fetch_brand_hot_search_list` 获取。

#### 何时使用 / 不使用
- ✅ 已有 category_id，想查看该分类下的品牌排行
- ❌ 没有 category_id → 先用 `app_v3_fetch_brand_hot_search_list` 获取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| category_id | integer | yes | 正整数 | 分类 ID，如 `10` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 品牌排行数据 | `$.data` | 品牌排行详情 | 仅展示用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | category_id 无效 | 检查参数 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### web_fetch_hot_search_result — 获取 Web 版热榜数据

**Full path:** `/api/v1/douyin/web/fetch_hot_search_result`
**Method:** GET · **Risk:** low

#### 用途
获取 Web 版抖音热榜数据。无参数，直接返回热榜结果。

#### 何时使用 / 不使用
- ✅ App V3 热搜端点失败时的降级方案
- ❌ 首选 → 用 `app_v3_fetch_hot_search_list`（数据更丰富）

#### 输入 (IN)
无参数

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 热榜数据 | `$.data` | 热搜结果 | search.md 各端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`app_v3_fetch_hot_search_list` |

---

### web_fetch_video_channel_result — 获取视频频道数据

**Full path:** `/api/v1/douyin/web/fetch_video_channel_result`
**Method:** GET · **Risk:** low

#### 用途
获取抖音视频频道数据。需要 tag_id 指定频道类型。

#### 何时使用 / 不使用
- ✅ 想查看特定频道/垂类下的视频内容
- ✅ 链式起点：取 aweme_id 用于视频详情
- ❌ 想看热搜 → 用 `app_v3_fetch_hot_search_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| tag_id | integer | yes | 正整数 | 标签 ID，如 `300203` |
| count | integer | no | 默认 10 | 每页数量 |
| refresh_index | integer | no | 默认 1 | 刷新索引：0 = 首次，>0 = 翻页 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 视频 ID | video.md 各端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | tag_id 无效 | 检查参数 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_city_list — 获取城市列表

**Full path:** `/api/v1/douyin/billboard/fetch_city_list`
**Method:** GET · **Risk:** low

#### 用途
获取中国城市列表。**链式前置端点**——返回的 city_code 用于同城热点榜等端点。

#### 何时使用 / 不使用
- ✅ 需要城市编码用于同城热点榜
- ✅ 链式前置：取 city_code
- ❌ 直接查同城热点 → 可用空 city_code 查全部城市

#### 输入 (IN)
无参数

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| city_code | `$.data[].city_code` | 城市编码 | billboard_fetch_hot_city_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_content_tag — 获取垂类内容标签

**Full path:** `/api/v1/douyin/billboard/fetch_content_tag`
**Method:** GET · **Risk:** low

#### 用途
获取垂类内容标签。**链式前置端点**——返回的标签用于热门账号、视频榜等端点的 query_tag/tags/sentence_tag 参数。

#### 何时使用 / 不使用
- ✅ 需要垂类标签用于筛选热门账号或视频榜
- ✅ 链式前置：取 tag 信息
- ❌ 直接查热门账号 → 可用空 query_tag 查全部

#### 输入 (IN)
无参数

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| tag | `$.data[].tag` | 垂类标签 | billboard_fetch_hot_account_list (query_tag) / billboard_fetch_hot_total_video_list 等 (tags) / billboard_fetch_hot_rise_list 等 (sentence_tag) |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_category_list — 获取热点榜分类

**Full path:** `/api/v1/douyin/billboard/fetch_hot_category_list`
**Method:** GET · **Risk:** low

#### 用途
获取热点榜分类的 ID 与热度。用于了解各热点分类的概况。

#### 何时使用 / 不使用
- ✅ 想了解热点分类概况
- ❌ 想看具体热点列表 → 用 `billboard_fetch_hot_total_list` 等

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| billboard_type | string | yes | 枚举：rise/city/total | 榜单类型：rise = 上升热点榜，city = 城市热点榜，total = 热点总榜 |
| snapshot_time | string | no | yyyyMMddHHmmss 格式 | 快照时间，如 `20250106151500` |
| start_date | string | no | yyyyMMdd 格式 | 快照开始时间（与 end_date 配合，需移除 snapshot_time） |
| end_date | string | no | yyyyMMdd 格式 | 快照结束时间 |
| keyword | string | no | — | 热点搜索词 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 分类 ID 与热度 | `$.data` | 热点分类数据 | 仅展示用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | billboard_type 无效 | 检查参数 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_rise_list — 获取上升热点榜

**Full path:** `/api/v1/douyin/billboard/fetch_hot_rise_list`
**Method:** GET · **Risk:** low

#### 用途
获取上升热点榜，展示热度上升最快的话题。

#### 何时使用 / 不使用
- ✅ 想查看正在上升的热点
- ❌ 想看总榜 → 用 `billboard_fetch_hot_total_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| page | integer | yes | 正整数 | 页码 |
| page_size | integer | yes | 正整数 | 每页数量 |
| order | string | yes | 枚举：rank/rank_diff | 排序方式：rank = 按热度，rank_diff = 按排名变化 |
| sentence_tag | string | no | 逗号分隔 | 热点分类标签，多个逗号分隔，空 = 全部 |
| keyword | string | no | — | 热点搜索词 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 热点列表 | `$.data.list` | 上升热点数据 | search.md 各端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数错误 | 检查 page/page_size/order | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_city_list — 获取同城热点榜

**Full path:** `/api/v1/douyin/billboard/fetch_hot_city_list`
**Method:** GET · **Risk:** low

#### 用途
获取同城热点榜，可按城市编码筛选。

#### 何时使用 / 不使用
- ✅ 想查看特定城市的热点
- ✅ 已有 city_code（从 `billboard_fetch_city_list` 获取）
- ❌ 想看全国热点 → 用 `billboard_fetch_hot_total_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| page | integer | yes | 正整数 | 页码 |
| page_size | integer | yes | 正整数 | 每页数量 |
| order | string | yes | 枚举：rank/rank_diff | 排序方式 |
| city_code | string | no | — | 城市编码，空 = 全部 |
| sentence_tag | string | no | — | 热点分类标签，空 = 全部 |
| keyword | string | no | — | 热点搜索词 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 同城热点列表 | `$.data.list` | 同城热点数据 | search.md 各端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数错误 | 检查必填参数 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_challenge_list — 获取挑战热榜

**Full path:** `/api/v1/douyin/billboard/fetch_hot_challenge_list`
**Method:** GET · **Risk:** low

#### 用途
获取挑战热榜，展示热门挑战赛排行。

#### 何时使用 / 不使用
- ✅ 想查看热门挑战赛排行
- ❌ 想看热搜 → 用 `app_v3_fetch_hot_search_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| page | integer | yes | 正整数 | 页码 |
| page_size | integer | yes | 正整数 | 每页数量 |
| keyword | string | no | — | 热点搜索词 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 挑战列表 | `$.data.list` | 挑战热榜数据 | video.md `app_v3_fetch_hashtag_detail` 等 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数错误 | 检查 page/page_size | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_total_list — 获取热点总榜

**Full path:** `/api/v1/douyin/billboard/fetch_hot_total_list`
**Method:** GET · **Risk:** low

#### 用途
获取热点总榜。**最常用的 Billboard 榜单端点**，支持按时刻或时间范围查询。

#### 何时使用 / 不使用
- ✅ 想查看当前热点总排行
- ✅ 链式起点：取 aweme_id 用于作品分析
- ❌ 想看上升热点 → 用 `billboard_fetch_hot_rise_list`
- ❌ 想看同城热点 → 用 `billboard_fetch_hot_city_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| page | integer | yes | 正整数 | 页码 |
| page_size | integer | yes | 正整数 | 每页数量 |
| type | string | yes | 枚举：snapshot/range | 快照类型：snapshot = 按时刻，range = 按时间范围 |
| snapshot_time | string | no | yyyyMMddHHmmss 格式 | 快照时间（type=snapshot 时有效） |
| start_date | string | no | yyyyMMdd 格式 | 开始时间（type=range 时有效） |
| end_date | string | no | yyyyMMdd 格式 | 结束时间（type=range 时有效） |
| sentence_tag | string | no | — | 热点分类标签，空 = 全部 |
| keyword | string | no | — | 热点搜索词 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].aweme_id | `$.data.list[].aweme_id` | 关联作品 ID | billboard_fetch_hot_user_portrait_list / billboard_fetch_hot_comment_word_list / billboard_fetch_hot_item_trends_list / video.md |
| list[].sec_uid | `$.data.list[].sec_uid` | 关联用户 ID | user.md 各端点 / billboard_fetch_hot_account_* |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数错误（type/snapshot_time 冲突） | 检查参数组合 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_calendar_list — 获取活动日历

**Full path:** `/api/v1/douyin/billboard/fetch_hot_calendar_list`
**Method:** POST · **Risk:** **high** · **需用户确认**

#### 用途
获取活动日历列表。POST 端点，参数通过 body 传递。

#### 何时使用 / 不使用
- ✅ 想查看活动日历
- ❌ 想看热点排行 → 用 GET 榜单端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| start_date | string | yes | 10 位时间戳 | 开始时间 |
| end_date | string | yes | 10 位时间戳 | 结束时间 |
| city_code | string | no | — | 城市编码，空 = 全部 |
| category_code | string | no | — | 热点榜分类编码，空 = 全部 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].calendar_id | `$.data.list[].calendar_id` | 活动 ID | billboard_fetch_hot_calendar_detail |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 日期格式错误 | 检查时间戳格式 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_calendar_detail — 获取活动日历详情

**Full path:** `/api/v1/douyin/billboard/fetch_hot_calendar_detail`
**Method:** GET · **Risk:** low

#### 用途
获取活动日历详情。需要 calendar_id。

#### 何时使用 / 不使用
- ✅ 已有 calendar_id，想查看活动详情
- ❌ 没有 calendar_id → 先用 `billboard_fetch_hot_calendar_list` 获取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| calendar_id | string | yes | — | 活动 ID，如 `1720` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 活动详情 | `$.data` | 活动日历详情 | 仅展示用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | calendar_id 不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_user_portrait_list — 获取作品点赞观众画像

**Full path:** `/api/v1/douyin/billboard/fetch_hot_user_portrait_list`
**Method:** GET · **Risk:** low

#### 用途
获取作品点赞观众画像数据，支持多维度分析（手机价格/性别/年龄/地域/城市等级/手机品牌）。

#### 何时使用 / 不使用
- ✅ 已有 aweme_id，想分析点赞用户画像
- ❌ 没有 aweme_id → 先从榜单或视频端点获取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | yes | 纯数字字符串 | 作品 ID |
| option | integer | no | 枚举 1-7，默认 4 | 选项：1 = 手机价格，2 = 性别，3 = 年龄，4 = 地域-省份，5 = 地域-城市，6 = 城市等级，7 = 手机品牌 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 画像数据 | `$.data` | 观众画像 | 仅展示用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | aweme_id 不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_comment_word_list — 获取作品评论词云权重

**Full path:** `/api/v1/douyin/billboard/fetch_hot_comment_word_list`
**Method:** GET · **Risk:** low

#### 用途
获取作品评论分析的词云权重数据。

#### 何时使用 / 不使用
- ✅ 已有 aweme_id，想分析评论关键词
- ❌ 想看评论列表 → 用 `comments.md` 的评论端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | yes | 纯数字字符串 | 作品 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 词云数据 | `$.data` | 评论词云权重 | 仅展示用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | aweme_id 不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_item_trends_list — 获取作品数据趋势

**Full path:** `/api/v1/douyin/billboard/fetch_hot_item_trends_list`
**Method:** GET · **Risk:** low

#### 用途
获取作品数据趋势（点赞量/分享量/评论量随时间变化）。

#### 何时使用 / 不使用
- ✅ 已有 aweme_id，想分析数据趋势
- ❌ 想看账号趋势 → 用 `billboard_fetch_hot_account_trends_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | no | 纯数字字符串 | 作品 ID |
| option | integer | no | 枚举 7-9，默认 7 | 选项：7 = 点赞量，8 = 分享量，9 = 评论量 |
| date_window | integer | no | 枚举 1-2，默认 1 | 时间窗口：1 = 按小时，2 = 按天 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 趋势数据 | `$.data` | 数据趋势 | 仅展示用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_account_list — 获取热门账号

**Full path:** `/api/v1/douyin/billboard/fetch_hot_account_list`
**Method:** POST · **Risk:** **high** · **需用户确认**

#### 用途
获取热门账号列表。POST 端点，参数通过 body 传递。**热门账号分析的链式起点**。

#### 何时使用 / 不使用
- ✅ 想查看热门账号排行
- ✅ 链式起点：取 sec_uid 用于粉丝画像/兴趣/趋势分析
- ❌ 想搜索特定用户 → 用 `billboard_fetch_hot_account_search_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| date_window | integer | no | 默认 24 | 时间窗口（小时） |
| page_num | integer | no | 默认 1 | 页码 |
| page_size | integer | no | 默认 20 | 每页数量 |
| query_tag | object | no | — | 子级垂类标签，空 = 全部（从 `billboard_fetch_content_tag` 获取） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].sec_uid | `$.data.list[].sec_uid` | 用户加密 ID | billboard_fetch_hot_account_trends_list / billboard_fetch_hot_account_item_analysis_list / billboard_fetch_hot_account_fans_portrait_list / billboard_fetch_hot_account_fans_interest_* / user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_account_search_list — 搜索用户名或抖音号

**Full path:** `/api/v1/douyin/billboard/fetch_hot_account_search_list`
**Method:** GET · **Risk:** low

#### 用途
在热门账号中搜索用户名或抖音号。

#### 何时使用 / 不使用
- ✅ 想搜索特定用户是否在热门账号中
- ✅ 链式起点：取 sec_uid 用于账号分析
- ❌ 想浏览热门账号列表 → 用 `billboard_fetch_hot_account_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索的用户名或抖音号 |
| cursor | integer | yes | 默认 0 | 游标 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].sec_uid | `$.data.list[].sec_uid` | 用户加密 ID | billboard_fetch_hot_account_* 系列端点 / user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | keyword 为空 | 检查参数 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_account_trends_list — 获取账号数据趋势

**Full path:** `/api/v1/douyin/billboard/fetch_hot_account_trends_list`
**Method:** GET · **Risk:** low

#### 用途
获取账号数据趋势（新增点赞/作品/评论/分享量随时间变化）。

#### 何时使用 / 不使用
- ✅ 已有 sec_uid，想分析账号数据趋势
- ❌ 想看作品数据趋势 → 用 `billboard_fetch_hot_item_trends_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_uid | string | yes | Base64 格式 | 用户 sec_id |
| option | integer | no | 枚举 2-5，默认 2 | 选项：2 = 新增点赞量，3 = 新增作品量，4 = 新增评论量，5 = 新增分享量 |
| date_window | integer | no | 默认 24 | 时间窗口：1 = 按小时，2 = 按天 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 趋势数据 | `$.data` | 账号数据趋势 | 仅展示用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | sec_uid 不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_account_item_analysis_list — 获取账号作品分析

**Full path:** `/api/v1/douyin/billboard/fetch_hot_account_item_analysis_list`
**Method:** GET · **Risk:** low

#### 用途
获取账号作品分析数据（默认 7 天）。

#### 何时使用 / 不使用
- ✅ 已有 sec_uid，想分析账号作品表现
- ❌ 想看数据趋势 → 用 `billboard_fetch_hot_account_trends_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_uid | string | yes | Base64 格式 | 用户 sec_id |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 作品分析数据 | `$.data` | 账号作品分析 | 仅展示用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | sec_uid 不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_account_fans_portrait_list — 获取粉丝画像

**Full path:** `/api/v1/douyin/billboard/fetch_hot_account_fans_portrait_list`
**Method:** GET · **Risk:** low

#### 用途
获取账号粉丝画像，支持 8 个维度分析。

#### 何时使用 / 不使用
- ✅ 已有 sec_uid，想分析粉丝画像
- ❌ 想看粉丝兴趣 → 用 `billboard_fetch_hot_account_fans_interest_*`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_uid | string | yes | Base64 格式 | 用户 sec_id |
| option | integer | no | 枚举 1-8，默认 1 | 选项：1 = 手机价格，2 = 性别，3 = 年龄，4 = 地域-省份，5 = 地域-城市，6 = 城市等级，7 = 手机品牌，8 = 兴趣标签分析 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 画像数据 | `$.data` | 粉丝画像 | 仅展示用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | sec_uid 不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_account_fans_interest_account_list — 获取粉丝兴趣作者

**Full path:** `/api/v1/douyin/billboard/fetch_hot_account_fans_interest_account_list`
**Method:** GET · **Risk:** low

#### 用途
获取粉丝兴趣作者列表（20 个用户）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_uid | string | yes | Base64 格式 | 用户 sec_id |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 兴趣作者列表 | `$.data` | 粉丝兴趣作者（20 个） | user.md 各端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | sec_uid 不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_account_fans_interest_topic_list — 获取粉丝近 3 天感兴趣话题

**Full path:** `/api/v1/douyin/billboard/fetch_hot_account_fans_interest_topic_list`
**Method:** GET · **Risk:** low

#### 用途
获取粉丝近 3 天感兴趣的话题（10 个话题）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_uid | string | yes | Base64 格式 | 用户 sec_id |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 兴趣话题列表 | `$.data` | 粉丝兴趣话题（10 个） | search.md 各端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | sec_uid 不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_account_fans_interest_search_list — 获取粉丝近 3 天搜索词

**Full path:** `/api/v1/douyin/billboard/fetch_hot_account_fans_interest_search_list`
**Method:** GET · **Risk:** low

#### 用途
获取粉丝近 3 天的搜索词（10 个搜索词）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_uid | string | yes | Base64 格式 | 用户 sec_id |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 搜索词列表 | `$.data` | 粉丝搜索词（10 个） | search.md 各端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | sec_uid 不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_total_video_list — 获取视频热榜

**Full path:** `/api/v1/douyin/billboard/fetch_hot_total_video_list`
**Method:** POST · **Risk:** **high** · **需用户确认**

#### 用途
获取视频热榜。**首选视频榜端点**——支持通过 sub_type 切换 5 种子榜（视频总榜/低粉爆款/高完播率/高涨粉率/高点赞率），无需分别调用 5 个独立端点。

#### 何时使用 / 不使用
- ✅ 想查看视频热榜（含各子榜）
- ✅ 链式起点：取 aweme_id 用于视频详情/作品分析
- ❌ 只需低粉爆款 → 可用 `billboard_fetch_hot_total_low_fan_list` 或本端点 `sub_type=1002`
- ❌ 想看话题榜 → 用 `billboard_fetch_hot_total_topic_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| page | integer | no | 默认 1 | 页码 |
| page_size | integer | no | 默认 10 | 每页数量 |
| date_window | integer | no | 枚举 1-2 | 时间窗口：1 = 按小时，2 = 按天 |
| sub_type | integer | no | 枚举，默认 1001 | 榜单分类：1001 = 视频总榜，1002 = 低粉爆款，1003 = 高完播率，1004 = 高涨粉率，1005 = 高点赞率 |
| keyword | string | no | — | 搜索关键词，空 = 全部 |
| tags | object | no | — | 子级垂类标签，空 = 全部 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].aweme_id | `$.data.list[].aweme_id` | 视频 ID | video.md 各端点 / billboard_fetch_hot_user_portrait_list 等 |
| list[].sec_uid | `$.data.list[].sec_uid` | 作者 ID | user.md 各端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_total_low_fan_list — 获取低粉爆款榜

**Full path:** `/api/v1/douyin/billboard/fetch_hot_total_low_fan_list`
**Method:** POST · **Risk:** **high** · **需用户确认**

#### 用途
获取低粉爆款榜。独立端点，也可通过 `billboard_fetch_hot_total_video_list` 的 `sub_type=1002` 获取。

#### 何时使用 / 不使用
- ✅ 专门查低粉爆款榜
- ❌ 首选 → 用 `billboard_fetch_hot_total_video_list`（统一入口）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| page | integer | no | 默认 1 | 页码 |
| page_size | integer | no | 默认 10 | 每页数量 |
| date_window | integer | no | 枚举 1-2 | 时间窗口 |
| keyword | string | no | — | 搜索关键词 |
| tags | object | no | — | 子级垂类标签 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].aweme_id | `$.data.list[].aweme_id` | 视频 ID | video.md 各端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`billboard_fetch_hot_total_video_list` (sub_type=1002) |

---

### billboard_fetch_hot_total_high_play_list — 获取高完播率榜

**Full path:** `/api/v1/douyin/billboard/fetch_hot_total_high_play_list`
**Method:** POST · **Risk:** **high** · **需用户确认**

#### 用途
获取高完播率榜。独立端点，也可通过 `billboard_fetch_hot_total_video_list` 的 `sub_type=1003` 获取。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| page | integer | no | 默认 1 | 页码 |
| page_size | integer | no | 默认 10 | 每页数量 |
| date_window | integer | no | — | 时间窗口 |
| keyword | string | no | — | 搜索关键词 |
| tags | object | no | — | 子级垂类标签 |

#### 输出可链式字段 (OUT)
同 `billboard_fetch_hot_total_low_fan_list`

#### 错误处理 (ERR)
同 `billboard_fetch_hot_total_low_fan_list`，替换：`billboard_fetch_hot_total_video_list` (sub_type=1003)

---

### billboard_fetch_hot_total_high_like_list — 获取高点赞率榜

**Full path:** `/api/v1/douyin/billboard/fetch_hot_total_high_like_list`
**Method:** POST · **Risk:** **high** · **需用户确认**

#### 用途
获取高点赞率榜。独立端点，也可通过 `billboard_fetch_hot_total_video_list` 的 `sub_type=1005` 获取。

#### 输入 (IN)
同 `billboard_fetch_hot_total_high_play_list`

#### 输出可链式字段 (OUT)
同 `billboard_fetch_hot_total_low_fan_list`

#### 错误处理 (ERR)
同 `billboard_fetch_hot_total_low_fan_list`，替换：`billboard_fetch_hot_total_video_list` (sub_type=1005)

---

### billboard_fetch_hot_total_high_fan_list — 获取高涨粉率榜

**Full path:** `/api/v1/douyin/billboard/fetch_hot_total_high_fan_list`
**Method:** POST · **Risk:** **high** · **需用户确认**

#### 用途
获取高涨粉率榜。独立端点，也可通过 `billboard_fetch_hot_total_video_list` 的 `sub_type=1004` 获取。

#### 输入 (IN)
同 `billboard_fetch_hot_total_high_play_list`

#### 输出可链式字段 (OUT)
同 `billboard_fetch_hot_total_low_fan_list`

#### 错误处理 (ERR)
同 `billboard_fetch_hot_total_low_fan_list`，替换：`billboard_fetch_hot_total_video_list` (sub_type=1004)

---

### billboard_fetch_hot_total_topic_list — 获取话题热榜

**Full path:** `/api/v1/douyin/billboard/fetch_hot_total_topic_list`
**Method:** POST · **Risk:** **high** · **需用户确认**

#### 用途
获取话题热榜。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| page | integer | no | 默认 1 | 页码 |
| page_size | integer | no | 默认 10 | 每页数量 |
| date_window | integer | no | — | 时间窗口 |
| keyword | string | no | — | 搜索关键词 |
| tags | object | no | — | 子级垂类标签 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 话题列表 | `$.data.list` | 话题热榜数据 | video.md `app_v3_fetch_hashtag_detail` 等 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_total_high_topic_list — 获取热度飙升话题榜

**Full path:** `/api/v1/douyin/billboard/fetch_hot_total_high_topic_list`
**Method:** POST · **Risk:** **high** · **需用户确认**

#### 用途
获取热度飙升的话题榜。

#### 输入 (IN)
同 `billboard_fetch_hot_total_topic_list`

#### 输出可链式字段 (OUT)
同 `billboard_fetch_hot_total_topic_list`

#### 错误处理 (ERR)
同 `billboard_fetch_hot_total_topic_list`

---

### billboard_fetch_hot_total_search_list — 获取搜索热榜

**Full path:** `/api/v1/douyin/billboard/fetch_hot_total_search_list`
**Method:** POST · **Risk:** **high** · **需用户确认**

#### 用途
获取搜索热榜。注意使用 `page_num`（非 `page`）分页。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| page_num | integer | no | 默认 1 | 页码 |
| page_size | integer | no | 默认 10 | 每页数量 |
| date_window | integer | no | 枚举 1-2 | 时间窗口：1 = 按小时，2 = 按天 |
| keyword | string | no | — | 搜索关键字 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 搜索热榜列表 | `$.data.list` | 搜索热榜数据 | search.md 各端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_total_high_search_list — 获取热度飙升搜索榜

**Full path:** `/api/v1/douyin/billboard/fetch_hot_total_high_search_list`
**Method:** POST · **Risk:** **high** · **需用户确认**

#### 用途
获取热度飙升的搜索榜。注意使用 `page_num` 分页。

#### 输入 (IN)
同 `billboard_fetch_hot_total_search_list`

#### 输出可链式字段 (OUT)
同 `billboard_fetch_hot_total_search_list`

#### 错误处理 (ERR)
同 `billboard_fetch_hot_total_search_list`

---

### billboard_fetch_hot_total_hot_word_list — 获取全部热门内容词

**Full path:** `/api/v1/douyin/billboard/fetch_hot_total_hot_word_list`
**Method:** POST · **Risk:** **high** · **需用户确认**

#### 用途
获取全部热门内容词。**热词详情的链式前置端点**——返回的 word_id + keyword 用于 `billboard_fetch_hot_total_hot_word_detail_list`。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| page_num | integer | no | 默认 1 | 页码 |
| page_size | integer | no | 默认 10 | 每页数量 |
| date_window | integer | no | — | 时间窗口 |
| keyword | string | no | — | 搜索关键字 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].word_id | `$.data.list[].word_id` | 内容词 ID | billboard_fetch_hot_total_hot_word_detail_list |
| list[].keyword | `$.data.list[].keyword` | 关键词 | billboard_fetch_hot_total_hot_word_detail_list / search.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_total_hot_word_detail_list — 获取内容词详情

**Full path:** `/api/v1/douyin/billboard/fetch_hot_total_hot_word_detail_list`
**Method:** GET · **Risk:** low

#### 用途
获取内容词详情。需要 keyword + word_id + query_day 三个必填参数。

#### 何时使用 / 不使用
- ✅ 已有 word_id 和 keyword，想查看内容词详情
- ❌ 没有 word_id → 先用 `billboard_fetch_hot_total_hot_word_list` 获取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键字 |
| word_id | string | yes | — | 内容词 ID |
| query_day | integer | yes | YYYYMMDD 格式 | 查询日期，需为当日，如 `20250105` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 内容词详情 | `$.data` | 内容词详情数据 | 仅展示用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或 query_day 非当日 | 检查参数 | ≤1 次 | — |
| 404 | word_id 不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |
