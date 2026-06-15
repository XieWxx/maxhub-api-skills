# TikTok Creator / TikTok 创作者

Base URL: `https://www.aconfig.cn`
Auth: `Authorization: Bearer $MAXHUB_API_KEY`

> 创作者账号健康状态、违规记录、账号概览、直播概览、视频概览、视频列表分析、商品列表分析、账号信息、橱窗商品、视频关联商品、视频详细统计、视频-商品关联统计、同款商品关联视频、视频受众分析。
>
> 本文件覆盖 TikTok Creator API 全部 14 个端点，均为 **POST** 方法，**全部需要 cookie 认证**。
>
> **安全警告**：所有 Creator 端点需要 session cookie 进行身份认证。仅在用户明确授权且使用测试账号时使用。Cookie 参数绝不硬编码，必须由用户提供。

---

## 本文件覆盖

| 领域 | API 前缀 | 方法 | 端点数 | 认证方式 |
|------|----------|------|--------|----------|
| Creator API | `/api/v1/tiktok/creator/` | POST | 14 | cookie (必填) |

---

## 端点索引

| # | 端点 ID | 方法 | 路径 | 推荐度 | 一句话用途 |
|---|---------|------|------|--------|-----------|
| 1 | get_account_health_status | POST | /api/v1/tiktok/creator/get_account_health_status | ★★★★ | 获取账号健康状态和违规积分 |
| 2 | get_account_violation_list | POST | /api/v1/tiktok/creator/get_account_violation_list | ★★★★ | 获取账号违规记录列表 |
| 3 | get_account_insights_overview | POST | /api/v1/tiktok/creator/get_account_insights_overview | ★★★★★ | 获取账号收益概览 |
| 4 | get_live_analytics_summary | POST | /api/v1/tiktok/creator/get_live_analytics_summary | ★★★★ | 获取直播概览数据 |
| 5 | get_video_analytics_summary | POST | /api/v1/tiktok/creator/get_video_analytics_summary | ★★★★ | 获取视频概览数据 |
| 6 | get_video_list_analytics | POST | /api/v1/tiktok/creator/get_video_list_analytics | ★★★★★ | 获取视频列表及详细数据 |
| 7 | get_product_analytics_list | POST | /api/v1/tiktok/creator/get_product_analytics_list | ★★★★ | 获取商品列表分析 |
| 8 | get_creator_account_info | POST | /api/v1/tiktok/creator/get_creator_account_info | ★★★★★ | 获取创作者账号基础信息 |
| 9 | get_showcase_product_list | POST | /api/v1/tiktok/creator/get_showcase_product_list | ★★★★ | 获取橱窗商品列表 |
| 10 | get_video_associated_product_list | POST | /api/v1/tiktok/creator/get_video_associated_product_list | ★★★ | 获取视频关联商品列表 |
| 11 | get_video_detailed_stats | POST | /api/v1/tiktok/creator/get_video_detailed_stats | ★★★★ | 获取视频详细分段统计 |
| 12 | get_video_to_product_stats | POST | /api/v1/tiktok/creator/get_video_to_product_stats | ★★★ | 获取视频-商品关联统计 |
| 13 | get_product_related_videos | POST | /api/v1/tiktok/creator/get_product_related_videos | ★★★ | 获取同款商品关联视频 |
| 14 | get_video_audience_stats | POST | /api/v1/tiktok/creator/get_video_audience_stats | ★★★★ | 获取视频受众画像 |

---

## 链式调用图谱

```
# 链路 1: 账号信息 → 账号健康
get_creator_account_info(cookie)
  → user_id ──→ get_account_health_status(cookie)

# 链路 2: 账号健康 → 违规记录
get_account_health_status(cookie)
  → violation_score ──→ get_account_violation_list(cookie, page)

# 链路 3: 账号信息 → 收益概览
get_creator_account_info(cookie)
  → ──→ get_account_insights_overview(cookie, start_date)

# 链路 4: 收益概览 → 直播概览
get_account_insights_overview(cookie, start_date)
  → ──→ get_live_analytics_summary(cookie, start_date)

# 链路 5: 收益概览 → 视频概览
get_account_insights_overview(cookie, start_date)
  → ──→ get_video_analytics_summary(cookie)

# 链路 6: 视频概览 → 视频列表
get_video_analytics_summary(cookie)
  → ──→ get_video_list_analytics(cookie, start_date, page, rules)

# 链路 7: 视频列表 → 视频详细统计
get_video_list_analytics(cookie, start_date)
  → timed_lists[].video_meta.item_id ──→ get_video_detailed_stats(cookie, start_date, item_id)

# 链路 8: 视频列表 → 视频关联商品
get_video_list_analytics(cookie, start_date)
  → timed_lists[].video_meta.item_id ──→ get_video_associated_product_list(cookie, start_date, item_ids)

# 链路 9: 视频关联商品 → 视频-商品统计
get_video_associated_product_list(cookie, start_date, item_ids)
  → products[].id ──→ get_video_to_product_stats(cookie, start_date, item_id, product_id)

# 链路 10: 视频-商品统计 → 同款商品关联视频
get_video_to_product_stats(cookie, start_date, item_id, product_id)
  → ──→ get_product_related_videos(cookie, start_date, item_id, product_id)

# 链路 11: 视频详细统计 → 视频受众分析
get_video_detailed_stats(cookie, start_date, item_id)
  → ──→ get_video_audience_stats(cookie, start_date, item_id)

# 链路 12: 收益概览 → 商品列表分析
get_account_insights_overview(cookie, start_date)
  → ──→ get_product_analytics_list(cookie, start_date, end_date, page)

# 链路 13: 账号信息 → 橱窗商品
get_creator_account_info(cookie)
  → ──→ get_showcase_product_list(cookie, count, offset)
```

---

## 跨 reference 链路

| 源端点 | 源字段 | 目标文件 | 目标端点 | 说明 |
|--------|--------|----------|----------|------|
| get_video_list_analytics | timed_lists[].video_meta.item_id | video.md | fetch_video_detail | 视频详情 |
| get_showcase_product_list | products[].product_id | shop.md | fetch_product_detail | 商品详情 |
| get_product_analytics_list | timed_lists[].product.id | shop.md | fetch_product_detail | 商品详情 |
| get_video_associated_product_list | products[].id | shop.md | fetch_product_detail | 商品详情 |
| get_creator_account_info | tt_uid | user.md | handler_user_profile | 用户详情 |
| get_product_related_videos | stats[].video.item_id | video.md | fetch_video_detail | 关联视频详情 |

---

## 错误处理契约

| HTTP 状态码 | 场景 | 处理方式 |
|-------------|------|----------|
| 200 + data 为空 | cookie 过期或无效 | 提示用户重新提供 cookie |
| 401 | 认证失败 | cookie 无效，需重新获取 |
| 404 | 端点路径错误 | 触发防臆造自检(A) |
| 400/422 | 参数格式错误 | 触发防臆造自检(B) |
| 429 | 请求频率过高 | 退避重试，间隔 ≥ 3 秒 |

**Creator API 专用注意事项：**
- **全部端点均为 POST 方法**，参数通过 JSON body 传递
- **cookie 为必填参数**，格式为用户浏览器中的完整 Cookie 字符串
- 仅适用于已开通 TikTok Shop 的创作者账号（部分端点）
- start_date 格式因端点而异：部分为 `MM-DD-YYYY`，部分为 `YYYY-MM-DD`
- proxy 为可选参数，格式为 `http://username:password@host:port`

---

## 端点详情

---

### 1. get_account_health_status

`POST /api/v1/tiktok/creator/get_account_health_status`

#### 用途

获取 TikTok Shop 创作者账号的健康状况信息，包括过去 90 天内的健康评分（风险等级）以及当前累计的违规积分数量。

#### 何时使用 / 何时不使用

- **使用**：检查创作者账号健康状况和违规积分
- **使用**：评估账号是否面临限流、禁播等风险
- **不使用**：需要查看具体违规记录时 → 用 `get_account_violation_list`

**违规积分惩罚等级：**

| 分数范围 | 惩罚措施 | 时长 |
|----------|----------|------|
| 9-11 | 警告 | 无 |
| 12-14 | 暂停电商权限 | 24 小时 |
| 15-17 | 暂停电商权限 | 48 小时 |
| 18-20 | 暂停电商权限 | 72 小时 |
| 21-23 | 暂停电商权限 | 1 周 |
| 24+ | 永久移除电商权限 | 永久 |

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| cookie | body | string | **是** | 用户 Cookie 字符串 | - |
| proxy | body | string | 否 | HTTP 代理地址 | http://user:pass@host:port |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| risk_info | object | 健康状态信息 (risk_level_text, light_color, dark_color) |
| vio_score_rule_learn_url | string | 违规积分规则说明链接 |
| is_show_score | boolean | 是否展示违规积分 |
| violation_score | integer | 当前违规积分数量 |
| creator_status | integer | 创作者账号状态码 (0=正常) |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| cookie 过期 | 认证失败 | 提示用户重新提供 cookie |
| 非 Shop 创作者 | 数据为空 | 此接口仅适用于 TikTok Shop 创作者 |

---

### 2. get_account_violation_list

`POST /api/v1/tiktok/creator/get_account_violation_list`

#### 用途

获取 TikTok Shop 创作者账号的违规记录信息，包含违规类型、违规时间、违规原因、处理措施、申诉状态等。

#### 何时使用 / 何时不使用

- **使用**：查看账号违规历史和处理情况
- **使用**：账号风险管理和合规审计
- **不使用**：只需了解健康状态时 → 用 `get_account_health_status`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| cookie | body | string | **是** | 用户 Cookie 字符串 | - |
| page | body | integer | 否 | 页码，默认 1 | 1 |
| proxy | body | string | 否 | HTTP 代理地址 | - |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| records | object[] | 违规记录列表 |
| records[].record_id | string | 违规记录 ID |
| records[].violation_time | integer | 违规发生时间（Unix 时间戳） |
| records[].violation_info | object | 违规详情 (violation_reason, violation_detail, violation_suggestion, policy_url, violation_type) |
| records[].record_status | integer | 记录状态 (1=有效) |
| records[].appeal_status | integer | 申诉状态 (0=未申诉, 1=已申诉) |
| records[].enforcement_title | string | 执行措施描述 |
| records[].appeal_valid_time | integer | 申诉有效截止时间 |
| records[].can_appeal | boolean | 是否允许申诉 |
| total | integer | 总违规记录数 |
| has_more | boolean | 是否有更多数据 |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| cookie 过期 | 认证失败 | 提示用户重新提供 cookie |

---

### 3. get_account_insights_overview

`POST /api/v1/tiktok/creator/get_account_insights_overview`

#### 用途

获取 TikTok Shop 创作者账号在指定时间范围内的表现概览，包括收益、曝光、点击、成交等多维度数据。默认统计 start_date 当月起 1 个自然月。

#### 何时使用 / 何时不使用

- **使用**：查看账号整体收益和表现概览
- **使用**：分析直播收益、视频收益、佣金等
- **不使用**：需要直播详细数据时 → 用 `get_live_analytics_summary`
- **不使用**：需要视频详细数据时 → 用 `get_video_analytics_summary`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| cookie | body | string | **是** | 用户 Cookie 字符串 | - |
| start_date | body | string | **是** | 查询开始时间，格式 `MM-DD-YYYY` | 04-01-2025 |
| proxy | body | string | 否 | HTTP 代理地址 | - |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| segments | object[] | 分段数据列表 |
| segments[].time_selector | object | 时间设置 (period, 起止时间戳, 时区, 语言) |
| segments[].timed_stats | object[] | 每日/每段详细数据 |
| timed_stats[].live_revenue.amount | float | 直播带货收益 |
| timed_stats[].video_revenue.amount | float | 视频带货收益 |
| timed_stats[].revenue.amount | float | 总收益 |
| timed_stats[].commission_estimated.amount | float | 预估佣金 |
| timed_stats[].overall_item_sold_cnt | integer | 商品成交数 |
| timed_stats[].product_show_cnt | integer | 商品展示次数 |
| timed_stats[].product_click_cnt | integer | 商品点击次数 |
| meta.is_bound_shop | boolean | 是否绑定 TikTok 店铺 |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| cookie 过期 | 认证失败 | 提示用户重新提供 cookie |
| start_date 格式错误 | 请求失败 | 使用 MM-DD-YYYY 格式 |

---

### 4. get_live_analytics_summary

`POST /api/v1/tiktok/creator/get_live_analytics_summary`

#### 用途

获取 TikTok Shop 创作者账号在指定时间范围内的直播表现数据概览，包括直播收益、观看人数、互动数据等。

#### 何时使用 / 何时不使用

- **使用**：分析直播带货表现
- **使用**：查看直播收益、观看人数、转化率等
- **不使用**：需要账号整体收益时 → 用 `get_account_insights_overview`
- **不使用**：需要视频数据时 → 用 `get_video_analytics_summary`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| cookie | body | string | **是** | 用户 Cookie 字符串 | - |
| start_date | body | string | **是** | 查询开始时间，格式 `MM-DD-YYYY` | 04-01-2025 |
| proxy | body | string | 否 | HTTP 代理地址 | - |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| segments | object[] | 分段数据列表 |
| segments[].timed_stats | object[] | 直播表现数据 |
| timed_stats[].live_revenue.amount | float | 直播带货收入 |
| timed_stats[].live_show_gpm.amount | float | 直播场均带货收入 |
| timed_stats[].new_follower_cnt | integer | 新增粉丝数量 |
| timed_stats[].sku_order_paid_cnt | integer | 已付款 SKU 数量 |
| timed_stats[].item_sold_cnt | integer | 成交商品件数 |
| timed_stats[].product_view | integer | 商品曝光次数 |
| timed_stats[].product_click | integer | 商品点击次数 |
| timed_stats[].live_ctr | float | 直播点击率 |
| timed_stats[].live_co | float | 直播转化率 |
| timed_stats[].live_like_cnt | integer | 直播点赞次数 |
| timed_stats[].live_comment_cnt | integer | 直播评论次数 |
| timed_stats[].live_show_cnt | integer | 直播场次 |
| timed_stats[].live_watch_cnt | integer | 直播观看人数 |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| cookie 过期 | 认证失败 | 提示用户重新提供 cookie |

---

### 5. get_video_analytics_summary

`POST /api/v1/tiktok/creator/get_video_analytics_summary`

#### 用途

获取 TikTok Shop 创作者账号在指定时间范围内的视频表现概览，包括播放量、粉丝增长、GMV 等。

#### 何时使用 / 何时不使用

- **使用**：查看视频整体表现
- **使用**：分析视频数量、播放量、粉丝增长、成交数据
- **不使用**：需要视频列表详情时 → 用 `get_video_list_analytics`
- **不使用**：需要直播数据时 → 用 `get_live_analytics_summary`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| cookie | body | string | **是** | 用户 Cookie 字符串 | - |
| proxy | body | string | 否 | HTTP 代理地址 | - |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| segments | object[] | 分段数据列表 |
| segments[].timed_stats | object[] | 视频表现数据 |
| timed_stats[].vv_cnt | integer | 视频播放量 |
| timed_stats[].new_follower_cnt | integer | 新增粉丝数量 |
| timed_stats[].video_cnt | integer | 发布视频数量 |
| timed_stats[].gmv.amount | float | 视频带货 GMV |
| timed_stats[].items_sold | integer | 售出商品数量 |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| cookie 过期 | 认证失败 | 提示用户重新提供 cookie |
| 无数据 | stats 为空 {} | 该时间段可能无视频数据 |

---

### 6. get_video_list_analytics

`POST /api/v1/tiktok/creator/get_video_list_analytics`

#### 用途

获取 TikTok Shop 创作者账号在指定时间范围内发布的视频列表及其详细数据表现，支持分页和多种排序方式。

#### 何时使用 / 何时不使用

- **使用**：查看创作者发布的视频列表及表现
- **使用**：按 GMV、播放量、完播率等排序分析视频
- **不使用**：只需视频概览时 → 用 `get_video_analytics_summary`
- **不使用**：需要单个视频详细统计时 → 用 `get_video_detailed_stats`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| cookie | body | string | **是** | 用户 Cookie 字符串 | - |
| start_date | body | string | **是** | 查询起始日期，格式 `MM-DD-YYYY` | 04-01-2025 |
| page | body | integer | 否 | 页码，默认 0 | 0 |
| rules | body | string | 否 | 排序规则，默认按发布时间 | VIDEO_LIST_GMV |
| proxy | body | string | 否 | HTTP 代理地址 | - |

**rules 枚举值：**

| 值 | 说明 |
|----|------|
| VIDEO_LIST_PUBLISH_TIME | 按发布时间排序（默认） |
| VIDEO_LIST_GMV | 按 GMV 排序 |
| VIDEO_LIST_DIRECT_GMV | 按直接 GMV 排序 |
| VIDEO_LIST_VV_CNT | 按观看人次排序 |
| VIDEO_LIST_ITEM_SOLD_CNT | 按成交件数排序 |
| VIDEO_LIST_CTR | 按商品点击率排序 |
| VIDEO_LIST_COMPLETION_RATE | 按完播率排序 |
| VIDEO_LIST_LIKE_CNT | 按点赞数排序 |
| VIDEO_LIST_NEW_FOLLOWER_CNT | 按新增粉丝数排序 |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| segments | object[] | 分段数据列表 |
| segments[].list_control | object | 列表控制 (rules, next_pagination) |
| segments[].timed_lists | object[] | 视频数据列表 |
| timed_lists[].video_meta | object | 视频元信息 (item_id, name, publish_time, duration, video_play_info) |
| timed_lists[].new_follower_cnt | integer | 新增粉丝数 |
| timed_lists[].vv_cnt | integer | 视频播放量 |
| timed_lists[].ctr | float | 商品点击率 |
| timed_lists[].gmv.amount | float | 视频 GMV |
| timed_lists[].item_sold_cnt | integer | 商品售出数量 |
| timed_lists[].completion_rate | float | 观看完成率 |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| cookie 过期 | 认证失败 | 提示用户重新提供 cookie |
| start_date 格式错误 | 请求失败 | 使用 MM-DD-YYYY 格式 |

---

### 7. get_product_analytics_list

`POST /api/v1/tiktok/creator/get_product_analytics_list`

#### 用途

获取 TikTok Shop 创作者账号在指定时间范围内推广的商品列表及其销售数据分析，支持按成交额排序和分页。

#### 何时使用 / 何时不使用

- **使用**：查看推广商品的销售表现
- **使用**：分析商品 GMV 和佣金收入
- **不使用**：需要橱窗商品时 → 用 `get_showcase_product_list`
- **不使用**：需要视频关联商品时 → 用 `get_video_associated_product_list`

**注意**：此端点的 start_date / end_date 格式为 `YYYY-MM-DD`（与其他端点的 `MM-DD-YYYY` 不同）。

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| cookie | body | string | **是** | 用户 Cookie 字符串 | - |
| start_date | body | string | **是** | 开始日期，格式 `YYYY-MM-DD` | 2025-04-01 |
| end_date | body | string | **是** | 结束日期，格式 `YYYY-MM-DD` | 2025-05-01 |
| page | body | integer | 否 | 页码，默认 0 | 0 |
| proxy | body | string | 否 | HTTP 代理地址 | - |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| segments | object[] | 分段数据列表 |
| segments[].list_control | object | 列表控制 (rules, next_pagination) |
| segments[].timed_lists | object[] | 商品数据列表 |
| timed_lists[].product | object | 商品信息 (id, name, cover_image.thumb_url_list) |
| timed_lists[].item_sold_cnt | integer | 销售商品数量 |
| timed_lists[].revenue.amount | float | 商品 GMV |
| timed_lists[].commission.amount | float | 预估佣金收入 |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| cookie 过期 | 认证失败 | 提示用户重新提供 cookie |
| 日期格式错误 | 请求失败 | 注意此端点使用 YYYY-MM-DD 格式 |

---

### 8. get_creator_account_info

`POST /api/v1/tiktok/creator/get_creator_account_info`

#### 用途

获取 TikTok Shop 创作者账号的基础信息，包括用户名、头像、账号 ID、注册地区、绑定合作伙伴信息、权限列表等。

#### 何时使用 / 何时不使用

- **使用**：验证账号状态和基本信息
- **使用**：获取 user_id 用于后续调用
- **使用**：检查合作伙伴绑定和权限
- **不使用**：需要健康状态时 → 用 `get_account_health_status`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| cookie | body | string | **是** | 用户 Cookie 字符串 | - |
| proxy | body | string | 否 | HTTP 代理地址 | - |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| user_id | string | 用户 ID |
| user_type | integer | 用户类型 |
| register_region_id | string | 注册地区代码 (如 "us") |
| user_name | string | 用户名 |
| avatar | object | 头像信息 (uri, url_list) |
| permission_list | integer[] | 权限列表 |
| partner_id | string | 合作伙伴 ID |
| partner_name | string | 合作伙伴名称 |
| shop_account_official | boolean | 是否官方认证店铺账号 |
| switch_info | string | 功能开关信息 |
| tt_uid | string | TikTok UID |
| nick_name | string | 昵称 |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| cookie 过期 | 认证失败 | 提示用户重新提供 cookie |

---

### 9. get_showcase_product_list

`POST /api/v1/tiktok/creator/get_showcase_product_list`

#### 用途

获取 TikTok Shop 创作者账号橱窗中正在展示的商品列表，包含商品标题、价格、卖家信息、佣金等。

#### 何时使用 / 何时不使用

- **使用**：查看橱窗中的推广商品
- **使用**：商品管理和数据分析
- **不使用**：需要商品销售分析时 → 用 `get_product_analytics_list`
- **不使用**：需要视频关联商品时 → 用 `get_video_associated_product_list`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| cookie | body | string | **是** | 用户 Cookie 字符串 | - |
| count | body | integer | 否 | 每页返回商品数量，默认 20 | 20 |
| offset | body | integer | 否 | 分页偏移量，默认 0 | 0 |
| proxy | body | string | 否 | HTTP 代理地址 | - |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| products | object[] | 商品列表 |
| products[].product_id | string | 商品 ID |
| products[].title | string | 商品标题 |
| products[].format_available_price | string | 展示价格 (如 "$7.94") |
| products[].seller_info | object | 卖家信息 (seller_id, shop_name) |
| products[].cover | object | 主图信息 (url_list) |
| products[].images | object[] | 图片列表 |
| products[].source | string | 商品来源渠道 (如 "Affiliate") |
| products[].stock_status | integer | 库存状态 (1=有货) |
| products[].review_status | integer | 审核状态 (1=通过) |
| products[].affiliate_info | object | 佣金信息 (commission_with_currency, commission_rate) |
| products[].category_info | object | 类目信息 (name) |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| cookie 过期 | 认证失败 | 提示用户重新提供 cookie |
| 未开通橱窗 | 数据为空 | 需开通橱窗功能 |

---

### 10. get_video_associated_product_list

`POST /api/v1/tiktok/creator/get_video_associated_product_list`

#### 用途

获取指定视频在 TikTok Shop 中关联展示的商品列表及其推广表现数据，支持一次查询多个视频。

#### 何时使用 / 何时不使用

- **使用**：查看视频挂载了哪些商品
- **使用**：分析视频与商品的关联关系
- **不使用**：需要视频-商品详细统计时 → 用 `get_video_to_product_stats`
- **不使用**：需要橱窗商品时 → 用 `get_showcase_product_list`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| cookie | body | string | **是** | 用户 Cookie 字符串 | - |
| start_date | body | string | **是** | 查询起始日期，格式 `MM-DD-YYYY` | 04-01-2025 |
| item_ids | body | string[] | **是** | 视频 ID 列表 | ["7496499484705246507"] |
| proxy | body | string | 否 | HTTP 代理地址 | - |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| segments | object[] | 分段数据列表 |
| segments[].timed_lists | object[] | 视频商品关联列表 |
| timed_lists[].videoToProductsMap | object | 视频-商品映射 (item_id, products[]) |
| products[].id | string | 商品 ID |
| products[].name | string | 商品名称 |
| products[].cover_image.thumb_url_list | string[] | 商品图片 URL |
| products[].product_detail_page_url | string | 商品跳转链接 |
| products[].price_min / price_max | object | 价格区间 |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| cookie 过期 | 认证失败 | 提示用户重新提供 cookie |
| item_ids 为空 | 请求失败 | 必须提供视频 ID 列表 |

---

### 11. get_video_detailed_stats

`POST /api/v1/tiktok/creator/get_video_detailed_stats`

#### 用途

获取指定 TikTok 视频在指定自然月内的详细分段统计数据，支持按日/周/月统计新粉丝、点赞、评论、分享、商品浏览、完播率等多维指标。

#### 何时使用 / 何时不使用

- **使用**：深入分析单个视频的表现变化
- **使用**：查看视频的日/周/月趋势数据
- **不使用**：只需视频概览时 → 用 `get_video_analytics_summary`
- **不使用**：需要受众画像时 → 用 `get_video_audience_stats`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| cookie | body | string | **是** | 用户 Cookie 字符串 | - |
| start_date | body | string | **是** | 查询起始日期，格式 `MM-DD-YYYY` | 04-01-2025 |
| item_id | body | string | **是** | 视频 ID | 7496499484705246507 |
| proxy | body | string | 否 | HTTP 代理地址 | - |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| segments | object[] | 数据分段列表 |
| segments[].time_selector | object | 时间筛选 (period, granularity, start/end_timestamp) |
| segments[].timed_stats | object[] | 分段统计数据 |
| timed_stats[].start_timestamp | integer | 开始时间戳 |
| timed_stats[].end_timestamp | integer | 结束时间戳 |
| timed_stats[].stats | object | 统计指标 |
| stats.new_follower_cnt | integer | 新增粉丝数量 |
| stats.share_cnt | integer | 分享次数 |
| stats.comment_cnt | integer | 评论次数 |
| stats.like_cnt | integer | 点赞次数 |
| stats.product_view_cnt | integer | 商品浏览量 |
| stats.video_completion_rate | string | 视频完播率 (0-1) |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| cookie 过期 | 认证失败 | 提示用户重新提供 cookie |
| item_id 无效 | data 为空 | 检查视频 ID |

---

### 12. get_video_to_product_stats

`POST /api/v1/tiktok/creator/get_video_to_product_stats`

#### 用途

获取指定 TikTok 视频与指定商品关联的推广详细统计数据，包括商品浏览量、点击量、销售量、订单量、收入等。

#### 何时使用 / 何时不使用

- **使用**：分析视频为特定商品带来的推广效果
- **使用**：查看视频-商品的收入和转化数据
- **不使用**：只需查看关联商品列表时 → 用 `get_video_associated_product_list`
- **不使用**：需要同款商品的其他视频时 → 用 `get_product_related_videos`

**必须同时提供 item_id 和 product_id。**

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| cookie | body | string | **是** | 用户 Cookie 字符串 | - |
| start_date | body | string | **是** | 查询起始日期，格式 `MM-DD-YYYY` | 04-01-2025 |
| item_id | body | string | **是** | 视频 ID | 7496499484705246507 |
| product_id | body | string | **是** | 商品 ID | 1731050202505515549 |
| proxy | body | string | 否 | HTTP 代理地址 | - |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| segments | object[] | 数据分段列表 |
| segments[].timed_stats | object[] | 分段统计数据 |
| timed_stats[].stats | object | 统计指标 |
| stats.product_revenue.amount_formatted | string | 商品总收入 (如 "$100.00") |
| stats.product_revenue.amount | float | 商品总收入 (数值) |
| stats.direct_revenue.amount_formatted | string | 直接成交收入 |
| stats.product_sales_cnt | integer | 商品销售数量 |
| stats.product_view_cnt | integer | 商品浏览量 |
| stats.product_click_cnt | integer | 商品点击量 |
| stats.order_cnt | integer | 订单数量 |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| cookie 过期 | 认证失败 | 提示用户重新提供 cookie |
| 缺少 item_id 或 product_id | 请求失败 | 必须同时提供 |

---

### 13. get_product_related_videos

`POST /api/v1/tiktok/creator/get_product_related_videos`

#### 用途

获取与指定商品关联的所有视频列表和对应的互动数据，分析同款商品在不同创作者视频中的推广效果。

#### 何时使用 / 何时不使用

- **使用**：查看同款商品在其他视频中的推广效果
- **使用**：对比不同视频推广同一商品的表现
- **不使用**：需要视频-商品统计时 → 用 `get_video_to_product_stats`
- **不使用**：需要视频关联商品列表时 → 用 `get_video_associated_product_list`

**必须同时提供 item_id 和 product_id。**

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| cookie | body | string | **是** | 用户 Cookie 字符串 | - |
| start_date | body | string | **是** | 查询起始日期，格式 `MM-DD-YYYY` | 04-01-2025 |
| item_id | body | string | **是** | 当前视频 ID | 7496499484705246507 |
| product_id | body | string | **是** | 商品 ID | 1731050202505515549 |
| proxy | body | string | 否 | HTTP 代理地址 | - |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| segments | object[] | 数据分段列表 |
| segments[].timed_lists | object[] | 视频列表 |
| timed_lists[].stats | object | 统计数据 |
| stats.video_product_id | string | 商品 ID |
| stats.video | object | 视频信息 (item_id, video_id, name, publish_time, duration, video_play_info) |
| stats.video_like_cnt | integer | 视频点赞数 |
| stats.video_comment_cnt | integer | 视频评论数 |
| stats.video_share_cnt | integer | 视频分享数 |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| cookie 过期 | 认证失败 | 提示用户重新提供 cookie |
| 缺少 item_id 或 product_id | 请求失败 | 必须同时提供 |

---

### 14. get_video_audience_stats

`POST /api/v1/tiktok/creator/get_video_audience_stats`

#### 用途

获取指定 TikTok 视频观众的用户画像统计数据，包括性别分布、年龄分布、地区分布等维度。

#### 何时使用 / 何时不使用

- **使用**：了解视频观众的性别、年龄、地区分布
- **使用**：指导内容创作和商品选择
- **不使用**：需要视频互动统计时 → 用 `get_video_detailed_stats`
- **不使用**：需要视频概览时 → 用 `get_video_analytics_summary`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| cookie | body | string | **是** | 用户 Cookie 字符串 | - |
| start_date | body | string | **是** | 查询起始日期，格式 `MM-DD-YYYY` | 04-01-2025 |
| item_id | body | string | **是** | 视频 ID | 7496499484705246507 |
| proxy | body | string | 否 | HTTP 代理地址 | - |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| segments | object[] | 数据分段列表 |
| segments[].timed_profile | object[] | 分段画像数据 |
| timed_profile[].stats | object | 画像统计 |
| stats.follower_genders | object[] | 性别分布 (key: female/male, value: 占比 0-1) |
| stats.follower_ages | object[] | 年龄段分布 (key: 如 "18-24", value: 占比 0-1) |
| stats.follower_regions | object[] | 地区分布 (key: 国家代码如 "US", value: 占比 0-1) |
| stats.profile_type | integer | 画像类型，固定值 2（受众画像） |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| cookie 过期 | 认证失败 | 提示用户重新提供 cookie |
| item_id 无效 | data 为空 | 检查视频 ID |

---

> 参见 param-mappings.md 获取字段流字典、端点替换矩阵和路径合法性硬校验规则。
> 参见 endpoints_whitelist.yaml 获取端点白名单和预调用验证协议。
