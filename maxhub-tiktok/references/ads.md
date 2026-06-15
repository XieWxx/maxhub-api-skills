# TikTok Ads / TikTok 广告

Base URL: `https://www.aconfig.cn`
Auth: `Authorization: Bearer $MAXHUB_API_KEY`

> 广告搜索、广告详情、热门广告聚光灯、关键帧分析、百分位分析、互动分析、推荐广告、查询建议、安全配置、地区列表、热门标签榜单及详情。
>
> 本文件覆盖 TikTok Ads API 全部 12 个端点，均为只读 GET 请求，无写入操作。

---

## 本文件覆盖

| 领域 | API 前缀 | 方法 | 端点数 |
|------|----------|------|--------|
| Ads API | `/api/v1/tiktok/ads/` | GET | 12 |

---

## 端点索引

| # | 端点 ID | 方法 | 路径 | 推荐度 | 一句话用途 |
|---|---------|------|------|--------|-----------|
| 1 | get_ads_detail | GET | /api/v1/tiktok/ads/get_ads_detail | ★★★★★ | 获取单个广告详情 |
| 2 | search_ads | GET | /api/v1/tiktok/ads/search_ads | ★★★★★ | 多维度搜索广告 |
| 3 | get_top_ads_spotlight | GET | /api/v1/tiktok/ads/get_top_ads_spotlight | ★★★★ | 获取热门广告聚光灯 |
| 4 | get_ad_keyframe_analysis | GET | /api/v1/tiktok/ads/get_ad_keyframe_analysis | ★★★ | 广告关键帧留存分析 |
| 5 | get_ad_percentile | GET | /api/v1/tiktok/ads/get_ad_percentile | ★★★ | 广告百分位排名 |
| 6 | get_ad_interactive_analysis | GET | /api/v1/tiktok/ads/get_ad_interactive_analysis | ★★★ | 广告互动时间分析 |
| 7 | get_recommended_ads | GET | /api/v1/tiktok/ads/get_recommended_ads | ★★★★ | 获取相似推荐广告 |
| 8 | get_query_suggestions | GET | /api/v1/tiktok/ads/get_query_suggestions | ★★★★ | 获取搜索关键词建议 |
| 9 | get_configure_safety | GET | /api/v1/tiktok/ads/get_configure_safety | ★★ | 获取搜索板块安全配置 |
| 10 | get_location_list | GET | /api/v1/tiktok/ads/get_location_list | ★★★ | 获取支持的国家地区列表 |
| 11 | get_trends_hashtag_list | GET | /api/v1/tiktok/ads/get_trends_hashtag_list | ★★★★ | 获取热门标签榜单 |
| 12 | get_trends_hashtag_detail | GET | /api/v1/tiktok/ads/get_trends_hashtag_detail | ★★★ | 获取热门标签详情 |

---

## 链式调用图谱

```
# 链路 1: 广告搜索 → 广告详情
search_ads(keyword, industry)
  → materials[].id ──→ get_ads_detail(ads_id)

# 链路 2: 广告搜索 → 关键帧分析
search_ads(keyword)
  → materials[].id ──→ get_ad_keyframe_analysis(material_id)

# 链路 3: 广告搜索 → 百分位分析
search_ads(keyword)
  → materials[].id ──→ get_ad_percentile(material_id)

# 链路 4: 广告搜索 → 互动分析
search_ads(keyword)
  → materials[].id ──→ get_ad_interactive_analysis(material_id)

# 链路 5: 广告详情 → 推荐广告
get_ads_detail(ads_id)
  → id ──→ get_recommended_ads(material_id)

# 链路 6: 热门广告聚光灯 → 广告详情
get_top_ads_spotlight(industry)
  → materials[].id ──→ get_ads_detail(ads_id)

# 链路 7: 热门标签榜单 → 标签详情
get_trends_hashtag_list(country_code)
  → items[].hashtagID ──→ get_trends_hashtag_detail(hashtag_id)

# 链路 8: 搜索建议 → 广告搜索
get_query_suggestions(query)
  → query[] ──→ search_ads(keyword)

# 链路 9: 地区列表 → 广告搜索（country_code 取值）
get_location_list()
  → country[].id ──→ search_ads(country_code)

# 链路 10: 安全配置 → 判断搜索可用性
get_configure_safety()
  → top_ads_search / keyword_search / hashtag_search ──→ 决定是否调用对应搜索端点
```

---

## 跨 reference 链路

| 源端点 | 源字段 | 目标文件 | 目标端点 | 说明 |
|--------|--------|----------|----------|------|
| search_ads | materials[].aweme_id | video.md | fetch_video_detail | 广告视频详情 |
| get_ads_detail | video_info.vid | video.md | fetch_video_detail | 广告视频详情 |
| get_trends_hashtag_detail | videoList[].itemID | video.md | fetch_video_detail | 标签关联视频 |
| get_trends_hashtag_detail | videoList[].itemID | search.md | search_general | 通过视频搜索更多 |
| get_location_list | country[].id | ads.md | search_ads | 提供国家代码 |
| get_configure_safety | creator_search | search.md | search_general | 判断搜索可用性 |

---

## 错误处理契约

| HTTP 状态码 | 场景 | 处理方式 |
|-------------|------|----------|
| 200 + data 为空 | 筛选条件过严 | 放宽筛选条件或移除部分过滤 |
| 404 | 端点路径错误 | 触发防臆造自检(A)：检查路径是否在端点索引中 |
| 400/422 | 参数格式错误 | 触发防臆造自检(B)：检查参数名和值是否与文档一致 |
| 429 | 请求频率过高 | 退避重试，间隔 ≥ 2 秒 |

**通用注意事项：**
- TikTok 创作者数据集仅收录部分热门数据，不一定包含全量数据
- 如果应用筛选条件后无结果，请尝试调整或移除部分筛选条件
- 行业 ID 完整列表见: https://github.com/MaxHub/TikTok-Ads-Industry-Code

---

## 端点详情

---

### 1. get_ads_detail

`GET /api/v1/tiktok/ads/get_ads_detail`

#### 用途

获取 TikTok 单个广告的详细信息，包括广告素材、品牌信息、互动数据、视频信息等。

#### 何时使用 / 何时不使用

- **使用**：需要查看特定广告的完整详情（品牌、投放国家、CTR、视频等）
- **使用**：分析广告表现指标（观看量、点赞数、评论数等核心数据）
- **不使用**：需要搜索/筛选广告列表时 → 用 `search_ads`
- **不使用**：需要广告关键帧或互动分析时 → 用 `get_ad_keyframe_analysis` / `get_ad_interactive_analysis`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| ads_id | query | string | **是** | 广告 ID | 7131673574381518849 |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| ad_title | string | 广告标题 |
| brand_name | string | 品牌名称 |
| comment | integer | 评论数 |
| cost | integer | 花费等级 (1-5) |
| country_code | string[] | 投放国家代码列表 |
| ctr | float | 点击率（百分比） |
| favorite | boolean | 是否收藏 |
| has_summary | boolean | 是否有摘要 |
| highlight_text | string | 高亮文本 |
| id | string | 广告 ID |
| industry_key | string | 行业标签 |
| is_search | boolean | 是否搜索结果 |
| keyword_list | string[] | 关键词列表 |
| landing_page | string | 落地页 URL |
| like | integer | 点赞数 |
| objective_key | string | 广告目标键 |
| objectives | object[] | 广告目标列表 (label, value) |
| pattern_label | array | 模式标签列表 |
| share | integer | 分享数 |
| source | string | 来源 |
| source_key | integer | 来源键值 |
| tag | integer | 标签 |
| video_info | object | 视频信息 (vid, duration, cover, video_url, width, height) |
| voice_over | boolean | 是否有配音 |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| ads_id 无效 | code != 0 或 data 为空 | 检查 ads_id 是否正确 |
| 广告已下架 | data 为空 | 该广告可能已被删除 |

---

### 2. search_ads

`GET /api/v1/tiktok/ads/search_ads`

#### 用途

搜索 TikTok 广告创意库中的广告，支持多维度筛选（关键词、行业、目标、国家等）和排序。

#### 何时使用 / 何时不使用

- **使用**：按关键词、行业、目标等条件发现广告案例
- **使用**：为广告策划和创意制作提供参考和灵感
- **不使用**：已知 ads_id 需要查看详情时 → 用 `get_ads_detail`
- **不使用**：需要热门广告排行时 → 用 `get_top_ads_spotlight`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| keyword | query | string | 否 | 搜索关键词 | cat toy |
| objective | query | integer | 否 | 广告目标 (1:流量 2:应用安装 3:转化 4:视频浏览 5:触达 6:潜在客户 7:产品销售)，默认 1 | 3 |
| like | query | integer | 否 | 表现排名 (1:前1-20% 2:前21-40% 3:前41-60% 4:前61-80%)，默认 1 | 1 |
| period | query | integer | 否 | 时间段(天)，默认 180 | 30 |
| industry | query | string | 否 | 行业 ID，多个用逗号分隔 | 27000000000 |
| page | query | integer | 否 | 页码，默认 1 | 1 |
| limit | query | integer | 否 | 每页数量，默认 20，最大 50 | 20 |
| order_by | query | string | 否 | 排序方式 (for_you, likes)，默认 for_you | likes |
| country_code | query | string | 否 | 国家代码，默认 US | US |
| ad_format | query | integer | 否 | 广告格式 (1:视频)，默认 1 | 1 |
| ad_language | query | string | 否 | 广告语言，默认 en | en |
| search_id | query | string | 否 | 搜索 ID（翻页用） | - |

**常用行业 ID：**

| 行业 | ID |
|------|----|
| 游戏 | 27000000000 |
| 电子商务 | 19000000000 |
| 金融服务 | 30000000000 |
| 教育 | 10000000000 |
| 美妆个护 | 22000000000 |
| 食品饮料 | 16000000000 |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| materials | object[] | 广告素材列表 |
| materials[].id | string | 广告素材 ID |
| materials[].aweme_id | string | 广告视频 ID |
| materials[].desc | string | 广告描述 |
| materials[].create_time | integer | 创建时间戳 |
| materials[].video_info | object | 视频信息 (cover, duration) |
| materials[].statistics | object | 统计数据 (digg_count, comment_count, share_count) |
| materials[].ads_info | object | 广告信息 (advertiser_name, landing_page) |
| pagination | object | 分页信息 (page, limit, total, has_more) |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| 无结果 | materials 为空 | 放宽筛选条件或移除部分过滤 |
| search_id 过期 | 返回空或错误 | 重新发起搜索获取新 search_id |

---

### 3. get_top_ads_spotlight

`GET /api/v1/tiktok/ads/get_top_ads_spotlight`

#### 用途

获取特定行业的热门广告聚光灯，展示行业内最受关注的广告案例。

#### 何时使用 / 何时不使用

- **使用**：查看某行业的热门广告排行
- **使用**：获取跨行业聚合的热门广告榜单
- **不使用**：需要按关键词搜索时 → 用 `search_ads`
- **不使用**：需要广告详细分析时 → 用 `get_ad_keyframe_analysis`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| industry | query | string | 否 | 行业 ID，不传返回跨行业聚合 | 25000000000 |
| page | query | integer | 否 | 页码，默认 1 | 1 |
| limit | query | integer | 否 | 每页数量，默认 20 | 20 |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| materials | object[] | 广告素材列表 |
| materials[].cost | integer | 花费等级 |
| materials[].ctr | float | 点击率 |
| materials[].highlight | string | 亮点描述 |
| materials[].id | string | 广告 ID |
| materials[].like | integer | 点赞数 |
| materials[].video_info | object | 视频信息 (vid, duration, cover, video_url, width, height) |
| pagination | object | 分页信息 (page, size, total, has_more) |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| industry 无效 | materials 为空 | 检查行业 ID 是否正确 |

---

### 4. get_ad_keyframe_analysis

`GET /api/v1/tiktok/ads/get_ad_keyframe_analysis`

#### 用途

获取广告视频的关键帧分析，了解视频在不同时间点的观众留存情况，帮助优化广告视频结构。

#### 何时使用 / 何时不使用

- **使用**：分析广告视频的观众留存曲线
- **使用**：找出观众流失点和兴趣高峰点
- **不使用**：需要百分位排名时 → 用 `get_ad_percentile`
- **不使用**：需要互动时间序列时 → 用 `get_ad_interactive_analysis`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| material_id | query | string | **是** | 广告素材 ID | 7213258221116751874 |
| metric | query | string | 否 | 分析指标，默认 retain_ctr | retain_ctr |

**metric 枚举值：**

| 值 | 说明 |
|----|------|
| retain_ctr | 留存点击率（默认） |
| retain_cvr | 留存转化率 |
| click_cnt | 点击次数 |
| convert_cnt | 转化次数 |
| play_retain_cnt | 播放留存量 |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| keyframe_data | object | 关键帧数据 |
| keyframe_data.time_points | integer[] | 时间点列表（秒） |
| keyframe_data.retention_rates | integer[] | 对应时间点的留存率（百分比） |
| keyframe_data.drop_points | integer[] | 流失率较高的时间点 |
| keyframe_data.highlight_points | integer[] | 观众兴趣较高的时间点 |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| material_id 无效 | data 为空 | 检查素材 ID 是否正确 |

---

### 5. get_ad_percentile

`GET /api/v1/tiktok/ads/get_ad_percentile`

#### 用途

获取广告在同行业中的百分位排名数据，了解广告在各项指标上相对于同行的表现水平。

#### 何时使用 / 何时不使用

- **使用**：评估广告在行业中的相对表现
- **使用**：制定广告优化策略
- **不使用**：需要关键帧留存分析时 → 用 `get_ad_keyframe_analysis`
- **不使用**：需要互动时间序列时 → 用 `get_ad_interactive_analysis`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| material_id | query | string | **是** | 广告素材 ID | 7213258221116751874 |
| metric | query | string | 否 | 分析指标，默认 ctr_percentile | ctr_percentile |
| period_type | query | integer | 否 | 时间范围(天)，默认 180 | 30 |

**metric 枚举值：**

| 值 | 说明 |
|----|------|
| ctr_percentile | 点击率百分位（默认） |
| time_attr_conversion_rate_percentile | 时间归因转化率百分位 |
| click_cnt_percentile | 点击次数百分位 |
| time_attr_convert_cnt_percentile | 时间归因转化次数百分位 |
| show_cnt_percentile | 展示次数百分位 |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| percentile_data | object | 百分位数据 |
| percentile_data.ctr_percentile | integer | 点击率百分位 (0-100) |
| percentile_data.cvr_percentile | integer | 转化率百分位 |
| percentile_data.engagement_percentile | integer | 互动率百分位 |
| percentile_data.view_percentile | integer | 观看量百分位 |
| percentile_data.industry_average | object | 行业平均值对比 (ctr, cvr, engagement) |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| material_id 无效 | data 为空 | 检查素材 ID 是否正确 |
| period_type 不匹配 | data 为空 | 调整时间范围 |

---

### 6. get_ad_interactive_analysis

`GET /api/v1/tiktok/ads/get_ad_interactive_analysis`

#### 用途

获取广告的互动时间分析，了解观众在视频不同时间点的留存和互动情况，分析吸引力曲线。

#### 何时使用 / 何时不使用

- **使用**：分析广告视频的吸引力曲线
- **使用**：找出最佳时长和关键互动点
- **不使用**：需要关键帧留存率时 → 用 `get_ad_keyframe_analysis`
- **不使用**：需要行业排名时 → 用 `get_ad_percentile`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| material_id | query | string | **是** | 广告素材 ID | 7213258221116751874 |
| metric_type | query | string | 否 | 分析类型，默认 remain | remain |
| period_type | query | integer | 否 | 时间范围(天)，默认 180 | 30 |

**metric_type 枚举值：**

| 值 | 说明 |
|----|------|
| ctr | 点击率分析 |
| cvr | 转化率分析 |
| clicks | 点击次数分析 |
| conversion | 转化次数分析 |
| remain | 留存率分析（默认） |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| interactive_data | object | 互动分析数据 |
| interactive_data.time_series | object[] | 时间序列数据 (time, value) |
| interactive_data.average_watch_time | float | 平均观看时长 |
| interactive_data.completion_rate | float | 完播率 |
| interactive_data.peak_interaction_time | integer | 互动高峰时间点 |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| material_id 无效 | data 为空 | 检查素材 ID 是否正确 |

---

### 7. get_recommended_ads

`GET /api/v1/tiktok/ads/get_recommended_ads`

#### 用途

基于指定广告获取相似的推荐广告列表，发现同行业或相似风格的优秀广告案例。

#### 何时使用 / 何时不使用

- **使用**：发现与某广告相似的推荐广告
- **使用**：为广告创意提供更多参考和灵感
- **不使用**：需要搜索广告时 → 用 `search_ads`
- **不使用**：需要热门广告排行时 → 用 `get_top_ads_spotlight`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| material_id | query | string | **是** | 参考广告素材 ID | 7213258221116751874 |
| industry | query | string | 否 | 行业 ID，默认 25308000000 | 25308000000 |
| country_code | query | string | 否 | 国家代码，默认 US | US |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| materials | object[] | 推荐广告素材列表 |
| materials[].ad_title | string | 广告标题 |
| materials[].brand_name | string | 品牌名称 |
| materials[].cost | integer | 花费等级 |
| materials[].ctr | float | 点击率 |
| materials[].favorite | boolean | 是否收藏 |
| materials[].id | string | 广告 ID |
| materials[].industry_key | string | 行业键值 |
| materials[].is_search | boolean | 是否搜索结果 |
| materials[].like | integer | 点赞数 |
| materials[].objective_key | string | 广告目标键值 |
| materials[].tag | integer | 标签 |
| materials[].video_info | object | 视频信息 (vid, duration, cover, video_url, width, height) |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| material_id 无效 | data 为空 | 检查素材 ID 是否正确 |
| 无推荐结果 | materials 为空 | 调整 industry 或 country_code |

---

### 8. get_query_suggestions

`GET /api/v1/tiktok/ads/get_query_suggestions`

#### 用途

获取广告搜索的热门查询建议，了解当前流行的广告搜索关键词和趋势。

#### 何时使用 / 何时不使用

- **使用**：获取搜索关键词联想建议
- **使用**：发现热门广告搜索趋势
- **不使用**：需要搜索广告时 → 用 `search_ads`
- **不使用**：需要标签趋势时 → 用 `get_trends_hashtag_list`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| query | query | string | 否 | 输入关键词，不传返回热门建议 | shop |
| count | query | integer | 否 | 建议数量，默认 50 | 20 |
| scenario | query | integer | 否 | 场景类型，默认 1 | 1 |
| country_code | query | string | 否 | 国家代码，默认 US | US |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| query | string[] | 查询建议列表 |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| 无建议 | query 为空 | 更换关键词或 country_code |

---

### 9. get_configure_safety

`GET /api/v1/tiktok/ads/get_configure_safety`

#### 用途

获取 TikTok Creative Center 各搜索板块的安全/可用性配置开关，判断热门广告、关键词、标签、音乐、创作者等搜索功能当前是否可用。

#### 何时使用 / 何时不使用

- **使用**：在调用搜索类端点前检查功能是否可用
- **使用**：判断 Creative Center 各板块的开关状态
- **不使用**：需要搜索广告时 → 用 `search_ads`

#### IN

无参数。

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| top_ads_search | integer | 热门广告搜索开关 (0/1) |
| keyword_search | integer | 关键词搜索开关 (0/1) |
| hashtag_search | integer | 标签搜索开关 (0/1) |
| sound_search | integer | 音乐搜索开关 (0/1) |
| creator_search | integer | 创作者搜索开关 (0/1) |
| cc_banner_key | string | 横幅配置键 |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| 服务不可用 | 请求失败 | 稍后重试 |

---

### 10. get_location_list

`GET /api/v1/tiktok/ads/get_location_list`

#### 用途

获取 TikTok Creative Center 支持的国家/地区列表，可用于其他接口 country_code 参数的取值参考。

#### 何时使用 / 何时不使用

- **使用**：获取 country_code 的合法取值
- **使用**：构建地区选择器
- **不使用**：需要搜索广告时 → 用 `search_ads`

#### IN

无参数。

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| country | object[] | 国家/地区列表 |
| country[].id | string | 国家/地区代码 (如 US, JP) |
| country[].value | string | 国家/地区名称 (如 United States) |
| country[].label | string | 显示标签 |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| 服务不可用 | 请求失败 | 稍后重试 |

---

### 11. get_trends_hashtag_list

`GET /api/v1/tiktok/ads/get_trends_hashtag_list`

#### 用途

获取 TikTok Creative Center 趋势(Trends)板块的热门标签榜单，支持按国家/地区切换。

#### 何时使用 / 何时不使用

- **使用**：获取热门标签排行
- **使用**：发现不同市场的热门话题趋势
- **不使用**：需要标签详情时 → 用 `get_trends_hashtag_detail`
- **不使用**：需要搜索广告时 → 用 `search_ads`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| time_range | query | integer | 否 | 时间范围(天): 7/30/90，默认 7 | 7 |
| country_code | query | string | 否 | 国家代码，默认 US | US |
| page | query | integer | 否 | 页码，默认 1 | 1 |
| limit | query | integer | 否 | 每页数量，默认 20 | 20 |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| items | object[] | 标签列表 |
| items[].hashtagID | string | 标签 ID |
| items[].hashtagName | string | 标签名称 |
| items[].industryIDs | array | 所属行业 ID 列表 |
| items[].popularityCurve | object | 热度曲线 |
| items[].publishCnt | integer | 发布数量 |
| items[].rankIndex | integer | 排名 |
| items[].topCreators | array | 头部创作者 |
| items[].vv | integer | 观看量 |
| pagination | object | 分页信息 (page, limit, totalCount, hasMore) |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| 无结果 | items 为空 | 更换 country_code 或 time_range |

---

### 12. get_trends_hashtag_detail

`GET /api/v1/tiktok/ads/get_trends_hashtag_detail`

#### 用途

获取 TikTok Creative Center 趋势板块单个热门标签的详细数据，包含热度趋势曲线、相关视频、受众年龄分布等。

#### 何时使用 / 何时不使用

- **使用**：查看特定标签的热度趋势和受众画像
- **使用**：分析标签的发布量、观看量变化
- **不使用**：需要标签排行时 → 用 `get_trends_hashtag_list`
- **不使用**：需要搜索广告时 → 用 `search_ads`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| hashtag_id | query | string | **是** | 标签 ID，从 get_trends_hashtag_list 获取 | 7383227119714238469 |
| time_range | query | integer | 否 | 时间范围(天): 7/30/90，默认 90 | 90 |
| country_code | query | string | 否 | 国家代码，默认 US | US |

**重要**：time_range 需与标签上榜的时间范围一致，否则数据可能为空。

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| hashtagName | string | 标签名称 |
| publishCnt | integer | 发布数量 |
| vv | integer | 观看量 |
| popularityCurve | object | 热度趋势曲线 (timestamp, value) |
| videoList | object[] | 相关视频列表 (coverURL, itemID, vid, videoURL) |
| ageProfile | object[] | 受众年龄分布 (ageLevel, vvPercent) |
| representativeCountryProfile | object[] | 代表性国家分布 (countryCode, countryTgiScore) |
| industryIDs | array | 所属行业 ID 列表 |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| hashtag_id 无效 | data 为空 | 检查标签 ID 是否正确 |
| time_range 不匹配 | data 为空 | 使用与标签上榜一致的时间范围 |

---

> 参见 param-mappings.md 获取字段流字典、端点替换矩阵和路径合法性硬校验规则。
> 参见 endpoints_whitelist.yaml 获取端点白名单和预调用验证协议。
