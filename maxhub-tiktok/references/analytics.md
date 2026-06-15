# TikTok Analytics / TikTok 数据分析

Base URL: `https://www.aconfig.cn`
Auth: `Authorization: Bearer $MAXHUB_API_KEY`

> 视频统计指标、虚假流量检测、评论关键词分析、创作者信息与里程碑。
>
> 本文件覆盖 TikTok Analytics API 全部 4 个端点，均为只读 GET 请求，无写入操作。

---

## 本文件覆盖

| 领域 | API 前缀 | 方法 | 端点数 |
|------|----------|------|--------|
| Analytics API | `/api/v1/tiktok/analytics/` | GET | 4 |

---

## 端点索引

| # | 端点 ID | 方法 | 路径 | 推荐度 | 一句话用途 |
|---|---------|------|------|--------|-----------|
| 1 | fetch_video_metrics | GET | /api/v1/tiktok/analytics/fetch_video_metrics | ★★★★★ | 获取视频统计数据（含 14 天趋势） |
| 2 | detect_fake_views | GET | /api/v1/tiktok/analytics/detect_fake_views | ★★★★★ | 检测视频虚假流量（8 维度 20+ 指标） |
| 3 | fetch_comment_keywords | GET | /api/v1/tiktok/analytics/fetch_comment_keywords | ★★★★ | 获取视频评论关键词分析 |
| 4 | fetch_creator_info_and_milestones | GET | /api/v1/tiktok/analytics/fetch_creator_info_and_milestones | ★★★★ | 获取创作者信息与里程碑 |

---

## 链式调用图谱

```
# 链路 1: 视频详情 → 视频统计
video.md: fetch_video_detail(aweme_id)
  → aweme_id ──→ fetch_video_metrics(item_id)

# 链路 2: 视频统计 → 虚假流量检测
fetch_video_metrics(item_id)
  → item_id ──→ detect_fake_views(item_id)

# 链路 3: 视频详情 → 评论关键词
video.md: fetch_video_detail(aweme_id)
  → aweme_id ──→ fetch_comment_keywords(item_id)

# 链路 4: 用户详情 → 创作者里程碑
user.md: handler_user_profile(sec_user_id)
  → user_id ──→ fetch_creator_info_and_milestones(user_id)

# 链路 5: 虚假流量检测 → 视频统计（交叉验证）
detect_fake_views(item_id)
  → video_metrics.total_views ──→ fetch_video_metrics(item_id) 交叉验证

# 链路 6: 评论关键词 → 评论列表
fetch_comment_keywords(item_id)
  → key_words[].comments[].cid ──→ comments.md: fetch_comment_replies(comment_id)
```

---

## 跨 reference 链路

| 源端点 | 源字段 | 目标文件 | 目标端点 | 说明 |
|--------|--------|----------|----------|------|
| fetch_video_metrics | item_id | video.md | fetch_video_detail | 视频详情 |
| detect_fake_views | item_id | video.md | fetch_video_detail | 视频详情 |
| detect_fake_views | creator_metrics.follower_count | user.md | handler_user_profile | 用户详情 |
| fetch_comment_keywords | key_words[].comments[].cid | comments.md | fetch_comment_replies | 评论回复 |
| fetch_creator_info_and_milestones | creator_info.sec_user_id | user.md | handler_user_profile | 用户详情 |
| fetch_creator_info_and_milestones | user_id | analytics.md | fetch_video_metrics | 创作者视频统计 |

---

## 错误处理契约

| HTTP 状态码 | 场景 | 处理方式 |
|-------------|------|----------|
| 200 + data 为空 | item_id / user_id 无效 | 检查 ID 是否正确 |
| 404 | 端点路径错误 | 触发防臆造自检(A)：检查路径是否在端点索引中 |
| 400/422 | 参数格式错误 | 触发防臆造自检(B)：检查参数名和值是否与文档一致 |
| 429 | 请求频率过高 | 退避重试，间隔 ≥ 2 秒 |

**通用注意事项：**
- detect_fake_views 的 content_category 参数会影响互动率基准值，选择正确的分类可提高检测准确度
- fetch_creator_info_and_milestones 的 user_id 为数字型 ID（如 107955），非 sec_user_id

---

## 端点详情

---

### 1. fetch_video_metrics

`GET /api/v1/tiktok/analytics/fetch_video_metrics`

#### 用途

获取 TikTok 视频的详细统计数据，包括观看量、点赞数、评论数和收藏数等核心指标，提供总量统计以及从发布日期起 14 天的每日趋势数据。

#### 何时使用 / 何时不使用

- **使用**：需要视频的详细统计数据和 14 天趋势
- **使用**：分析视频表现和用户互动情况
- **不使用**：需要检测虚假流量时 → 用 `detect_fake_views`
- **不使用**：需要评论关键词时 → 用 `fetch_comment_keywords`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| item_id | query | string | **是** | 视频 ID（即 aweme_id） | 7502551047378832671 |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| item_id | string | 请求的视频 ID |
| video_views | object | 视频总观看次数 (value) |
| video_views_14_days | object | 近 14 天每日观看量趋势 (interval, value[]) |
| likes | object | 视频总点赞数 (value) |
| likes_14_days | object | 近 14 天每日点赞数趋势 |
| comments | object | 视频总评论数 (value) |
| comments_14_days | object | 近 14 天每日评论数趋势 |
| favorites | object | 视频总收藏数 (value) |
| favorites_14_days | object | 近 14 天每日收藏数趋势 |
| video_summary | object | 视频表现概览 (title, content, summary_type) |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| item_id 无效 | data 为空 | 检查视频 ID 是否正确 |
| 视频已删除 | data 为空 | 该视频可能已被删除 |

---

### 2. detect_fake_views

`GET /api/v1/tiktok/analytics/detect_fake_views`

#### 用途

通过高级算法分析 TikTok 视频流量数据，精确检测可能存在的虚假观看量和不自然互动。基于 TikTok 赛马机制(Traffic Pool)流量池理论，评估内容真实性和流量质量。提供 8 种维度、20+ 指标的深度评估。

#### 何时使用 / 何时不使用

- **使用**：检测视频是否存在虚假流量
- **使用**：评估视频流量质量和账号可信度
- **使用**：获取流量池级别和有机观看量估算
- **不使用**：只需要基础统计数据时 → 用 `fetch_video_metrics`
- **不使用**：需要评论分析时 → 用 `fetch_comment_keywords`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| item_id | query | string | **是** | 视频 ID | 7460937381265411370 |
| content_category | query | string | 否 | 内容分类，影响互动率基准值，默认 default | verified_large |

**content_category 枚举值：**

| 值 | 说明 |
|----|------|
| default | 默认类别，通用内容 |
| entertainment | 娱乐内容，预期较高互动率 |
| education | 教育内容，预期适中互动和较高收藏率 |
| product | 产品内容，预期较低互动但较高转化 |
| verified_large | 大型认证账号，预期互动率适当降低 |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| video_metrics | object | 视频核心指标 (total_views, total_likes, total_comments, total_favorites, total_shares, engagement_rates) |
| creator_metrics | object | 创作者账号健康指标 (account_age_days, follower_count, verified, trust_score) |
| content_metrics | object | 内容质量指标 (content_type, created_by_ai, high_quality_upload) |
| fake_view_analysis | object | 虚假流量综合分析（见下方详细说明） |
| traffic_pool | object | 流量池分析（见下方详细说明） |
| suspicious_features | string[] | 可疑特征列表 |
| recommendations | object | 建议操作 (action, risk_level, potential_revenue_impact, suggested_steps) |
| mcn_report | object | (可选) MCN 商业影响分析报告 |

**fake_view_analysis 详细字段：**

| 字段 | 说明 |
|------|------|
| fake_score | 虚假流量评分 (0-100)，越低越好：0-20 极低风险 / 20-40 低风险 / 40-60 中等 / 60-80 高风险 / 80-100 极高风险 |
| confidence_level | 风险等级：Minimal / Low / Medium / High |
| estimated_fake_views | 估计虚假观看量 |
| fake_view_percentage | 虚假观看百分比 |
| is_suspicious | 是否可疑 |
| main_detection_reason | 主要检测原因 |
| component_scores | 8 维度异常评分 (engagement, distribution, consistency, creator_credibility, content_authenticity, follower_correlation, racing_mechanism, fan_growth)，0-100 越低越好 |

**traffic_pool 详细字段：**

| 字段 | 说明 |
|------|------|
| current_tier | 当前流量池级别 (1-8)，越高流量越大 |
| current_tier_name | 当前流量池名称 |
| expected_tier | 预期流量池级别 |
| current_views_range | 当前流量池预期观看范围 |
| estimated_organic_views | 估计有机观看量 |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| item_id 无效 | data 为空 | 检查视频 ID 是否正确 |
| content_category 不匹配 | 评分偏差 | 选择正确的内容分类 |

---

### 3. fetch_comment_keywords

`GET /api/v1/tiktok/analytics/fetch_comment_keywords`

#### 用途

分析视频评论中出现的热门关键词和话题，挖掘用户反馈，提取观众评论中的主要内容和观点。

#### 何时使用 / 何时不使用

- **使用**：分析视频评论的热门关键词和话题
- **使用**：了解观众关注点和反馈
- **不使用**：需要获取评论列表时 → 用 comments.md 的端点
- **不使用**：需要视频统计数据时 → 用 `fetch_video_metrics`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| item_id | query | string | **是** | 视频 ID | 7502551047378832671 |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| item_id | string | 请求的视频 ID |
| key_words | object[] | 评论关键词列表 |
| key_words[].key_word | string | 关键词文本 |
| key_words[].comments | object[] | 包含该关键词的评论列表 |
| key_words[].comments[].cid | string | 评论 ID |
| key_words[].comments[].text | string | 评论内容 |
| key_words[].comments[].create_date | integer | 评论创建时间戳 |
| key_words[].comments[].digg_count | integer | 评论获赞数量 |
| key_words[].comments[].comment_type | string | 评论类型 |
| key_words[].comments[].comment_author | object | 评论作者信息 (uid, nick_name, cover.url_list) |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| item_id 无效 | data 为空 | 检查视频 ID 是否正确 |
| 视频无评论 | key_words 为空 | 该视频可能没有评论 |

---

### 4. fetch_creator_info_and_milestones

`GET /api/v1/tiktok/analytics/fetch_creator_info_and_milestones`

#### 用途

获取 TikTok 创作者账号的基本信息和关键统计数据，查看创作者账号的成长历程和达成的重要里程碑。

#### 何时使用 / 何时不使用

- **使用**：查看创作者账号基本信息和粉丝数
- **使用**：分析创作者成长历程和里程碑
- **不使用**：需要详细用户资料时 → 用 user.md 的端点
- **不使用**：需要视频统计数据时 → 用 `fetch_video_metrics`

**重要**：user_id 为数字型 ID（如 107955），非 sec_user_id 或 unique_id。

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| user_id | query | string | **是** | 用户 ID（数字型） | 107955 |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| user_id | string | 请求的创作者 ID |
| creator_info | object | 创作者基本信息 |
| creator_info.nickname | string | 创作者昵称 |
| creator_info.sec_user_id | string | 安全用户 ID |
| creator_info.unique_id | string | 唯一用户名 |
| creator_info.avatar_url | string | 头像 URL |
| creator_info.follower_count | integer | 粉丝数量 |
| creator_info.like_count | integer | 获赞总数 |
| milestones | object[] | 里程碑列表 |
| milestones[].milestone | integer | 里程碑类型 ID |
| milestones[].milestone_title | string | 里程碑标题（如 "Reached 1 million followers"） |
| milestones[].milestone_year | string | 达成年份 |
| milestones[].milestone_month_day | string | 达成月日 |
| milestones[].creator_summary | string | 里程碑相关描述 |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| user_id 无效 | data 为空 | 检查用户 ID 是否正确（需为数字型 ID） |
| user_id 类型错误 | data 为空 | 不要传入 sec_user_id 或 unique_id，需为数字型 ID |

---

> 参见 param-mappings.md 获取字段流字典、端点替换矩阵和路径合法性硬校验规则。
> 参见 endpoints_whitelist.yaml 获取端点白名单和预调用验证协议。
