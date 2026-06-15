# TikTok Shop / TikTok 电商

Base URL: `https://www.aconfig.cn`
Auth: `Authorization: Bearer $MAXHUB_API_KEY`

> 商品详情、商品评论、商家商品列表、搜索建议、商品搜索、分类浏览、热卖商品、App V3 商品详情/评论/店铺等。
>
> 本文件覆盖 TikTok Shop Web API (12 个端点) + App V3 Shop API (14 个端点)，共 26 个端点。
>
> **重要提示**：Shop Web API 端点需设置 **30 秒超时**，遇到 **400 错误请重试 3 次**。

---

## 本文件覆盖

| 领域 | API 前缀 | 方法 | 端点数 | 特殊要求 |
|------|----------|------|--------|----------|
| Shop Web API | `/api/v1/tiktok/shop/web/` | GET | 12 | 30s 超时 + 400 重试 3 次 |
| App V3 Shop | `/api/v1/tiktok/app/v3/` | GET | 14 | - |

---

## 端点索引

### Shop Web API

| # | 端点 ID | 方法 | 路径 | 推荐度 | 一句话用途 |
|---|---------|------|------|--------|-----------|
| 1 | fetch_product_detail | GET | /api/v1/tiktok/shop/web/fetch_product_detail | ★★★★★ | 商品详情 V1（桌面端-数据完整） |
| 2 | fetch_product_detail_v2 | GET | /api/v1/tiktok/shop/web/fetch_product_detail_v2 | ★★★ | 商品详情 V2（移动端-数据少） |
| 3 | fetch_product_detail_v3 | GET | /api/v1/tiktok/shop/web/fetch_product_detail_v3 | ★★★★★ | 商品详情 V3（移动端-数据完整） |
| 4 | fetch_product_reviews_v2 | GET | /api/v1/tiktok/shop/web/fetch_product_reviews_v2 | ★★★★ | 商品评论 V2 |
| 5 | fetch_seller_products_list | GET | /api/v1/tiktok/shop/web/fetch_seller_products_list | ★★★★ | 商家商品列表 V1 |
| 6 | fetch_seller_products_list_v2 | GET | /api/v1/tiktok/shop/web/fetch_seller_products_list_v2 | ★★★ | 商家商品列表 V2（移动端） |
| 7 | fetch_search_word_suggestion_v2 | GET | /api/v1/tiktok/shop/web/fetch_search_word_suggestion_v2 | ★★★★ | 搜索关键词建议 V2 |
| 8 | fetch_search_products_list | GET | /api/v1/tiktok/shop/web/fetch_search_products_list | ★★★★★ | 搜索商品列表 V1 |
| 9 | fetch_search_products_list_v2 | GET | /api/v1/tiktok/shop/web/fetch_search_products_list_v2 | ★★★ | 搜索商品列表 V2（移动端） |
| 10 | fetch_products_category_list | GET | /api/v1/tiktok/shop/web/fetch_products_category_list | ★★★★ | 商品分类列表 |
| 11 | fetch_products_by_category_id | GET | /api/v1/tiktok/shop/web/fetch_products_by_category_id | ★★★★ | 按分类 ID 获取商品 |
| 12 | fetch_hot_selling_products_list | GET | /api/v1/tiktok/shop/web/fetch_hot_selling_products_list | ★★★★ | 热卖商品列表 |

### App V3 Shop API

| # | 端点 ID | 方法 | 路径 | 推荐度 | 一句话用途 |
|---|---------|------|------|--------|-----------|
| 13 | app_v3_fetch_product_detail | GET | /api/v1/tiktok/app/v3/fetch_product_detail | ★★ | 商品详情（即将弃用） |
| 14 | app_v3_fetch_product_detail_v2 | GET | /api/v1/tiktok/app/v3/fetch_product_detail_v2 | ★★★ | 商品详情 V2 |
| 15 | app_v3_fetch_product_detail_v3 | GET | /api/v1/tiktok/app/v3/fetch_product_detail_v3 | ★★★★ | 商品详情 V3 |
| 16 | app_v3_fetch_product_detail_v4 | GET | /api/v1/tiktok/app/v3/fetch_product_detail_v4 | ★★★★ | 商品详情 V4 |
| 17 | app_v3_fetch_product_review | GET | /api/v1/tiktok/app/v3/fetch_product_review | ★★★★ | 商品评价 |
| 18 | app_v3_fetch_shop_id_by_share_link | GET | /api/v1/tiktok/app/v3/fetch_shop_id_by_share_link | ★★★★ | 通过分享链接获取店铺 ID |
| 19 | app_v3_fetch_product_id_by_share_link | GET | /api/v1/tiktok/app/v3/fetch_product_id_by_share_link | ★★★★ | 通过分享链接获取商品 ID |
| 20 | app_v3_fetch_shop_home_page_list | GET | /api/v1/tiktok/app/v3/fetch_shop_home_page_list | ★★★ | 商家主页 Page 列表 |
| 21 | app_v3_fetch_shop_home | GET | /api/v1/tiktok/app/v3/fetch_shop_home | ★★★ | 商家主页数据 |
| 22 | app_v3_fetch_shop_product_recommend | GET | /api/v1/tiktok/app/v3/fetch_shop_product_recommend | ★★★ | 商家商品推荐 |
| 23 | app_v3_fetch_shop_product_list | GET | /api/v1/tiktok/app/v3/fetch_shop_product_list | ★★★★ | 商家商品列表 |
| 24 | app_v3_fetch_shop_product_list_v2 | GET | /api/v1/tiktok/app/v3/fetch_shop_product_list_v2 | ★★★ | 商家商品列表 V2 |
| 25 | app_v3_fetch_shop_info | GET | /api/v1/tiktok/app/v3/fetch_shop_info | ★★★★ | 商家信息 |
| 26 | app_v3_fetch_shop_product_category | GET | /api/v1/tiktok/app/v3/fetch_shop_product_category | ★★★ | 商家产品分类 |

---

## 链式调用图谱

```
# 链路 1: 搜索商品 → 商品详情
fetch_search_products_list(search_word, region)
  → products[].product_id ──→ fetch_product_detail(product_id, region)

# 链路 2: 搜索建议 → 搜索商品
fetch_search_word_suggestion_v2(search_word, region)
  → data[] ──→ fetch_search_products_list(search_word, region)

# 链路 3: 商品详情 → 商品评论
fetch_product_detail(product_id, region)
  → product_id ──→ fetch_product_reviews_v2(product_id, region)

# 链路 4: 商品详情 → 商家商品列表
fetch_product_detail(product_id, seller_id, region)
  → seller_id ──→ fetch_seller_products_list(seller_id, region)

# 链路 5: 分类列表 → 按分类获取商品
fetch_products_category_list(region)
  → children[].self.category_id ──→ fetch_products_by_category_id(category_id, region)

# 链路 6: 分享链接 → 店铺 ID → 商家信息
app_v3_fetch_shop_id_by_share_link(share_link)
  → shop_id ──→ app_v3_fetch_shop_info(shop_id)

# 链路 7: 分享链接 → 商品 ID → 商品详情
app_v3_fetch_product_id_by_share_link(share_link)
  → product_id ──→ fetch_product_detail_v3(product_id, region)

# 链路 8: 商家主页列表 → 商家主页数据
app_v3_fetch_shop_home_page_list(seller_id)
  → page_id ──→ app_v3_fetch_shop_home(page_id, seller_id)

# 链路 9: 商家信息 → 商家商品列表
app_v3_fetch_shop_info(shop_id)
  → shop_id ──→ app_v3_fetch_shop_product_list(seller_id)

# 链路 10: 商家信息 → 商家商品分类
app_v3_fetch_shop_info(shop_id)
  → shop_id ──→ app_v3_fetch_shop_product_category(seller_id)

# 链路 11: 商品详情 V1 失败 → V3 降级
fetch_product_detail(product_id, region)  [400/无数据]
  → ──→ fetch_product_detail_v3(product_id, region)

# 链路 12: 商品详情 V3 失败 → V4 降级
fetch_product_detail_v3(product_id, region)  [无数据]
  → ──→ app_v3_fetch_product_detail_v4(product_id, region)
```

---

## 跨 reference 链路

| 源端点 | 源字段 | 目标文件 | 目标端点 | 说明 |
|--------|--------|----------|----------|------|
| fetch_product_detail | product_info | video.md | fetch_video_detail | 关联视频 |
| fetch_product_reviews_v2 | reviews[].user.user_id | user.md | handler_user_profile | 评论用户详情 |
| fetch_search_products_list | products[].seller_info.seller_id | shop.md | fetch_seller_products_list | 商家全部商品 |
| app_v3_fetch_product_detail_v4 | product_id | creator.md | get_video_associated_product_list | 创作者关联商品 |
| fetch_hot_selling_products_list | products[].product_id | shop.md | fetch_product_detail | 热卖商品详情 |
| app_v3_fetch_shop_info | shop_id | shop.md | app_v3_fetch_shop_product_list | 商家商品 |

---

## 错误处理契约

| HTTP 状态码 | 场景 | 处理方式 |
|-------------|------|----------|
| 400 | Shop Web API 风控 | **重试 3 次**，每次间隔 1 秒 |
| 404 | 端点路径错误 | 触发防臆造自检(A) |
| 400/422 | 参数格式错误 | 触发防臆造自检(B) |
| 200 + data 为空 | product_id/region 不匹配 | 确保 region 与 product_id 对应 |

**Shop API 专用注意事项：**
- **Shop Web API 必须设置 30 秒超时**
- **遇到 400 错误请重试 3 次**
- fetch_product_detail V1 某些地区（如泰国）可能无法获取数据，降级使用 V3
- fetch_product_detail_v3 的 **region 必须与 product_id 对应**，否则无数据
- 支持的 region 代码：US / GB / SG / MY / PH / TH / VN / ID / MX / IE / ES

---

## 端点详情

---

### 1. fetch_product_detail

`GET /api/v1/tiktok/shop/web/fetch_product_detail`

#### 用途

获取 TikTok Shop 商品详情（桌面端接口），包含完整数据：商品信息、卖家信息、物流信息、评价信息。

#### 何时使用 / 何时不使用

- **使用**：需要最完整的商品数据（桌面端）
- **使用**：需要推荐商品、评价摘要等
- **不使用**：泰国等特殊地区商品 → 用 `fetch_product_detail_v3`
- **不使用**：只需精简数据时 → 用 `fetch_product_detail_v2`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| product_id | query | string | **是** | 商品 ID | 1729556436942358002 |
| seller_id | query | string | 否 | 卖家 ID（可传空字符串） | 7494629757824764402 |
| region | query | string | 否 | 地区代码，默认 MY | MY |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| global_fe_config | object | 全局前端配置 |
| components_map | array | 组件映射列表 |
| global_data | object | 全局数据 |
| global_data.product_info | object | 商品信息 |
| global_data.seller_info | object | 卖家信息 |
| global_data.shipping_info | object | 物流信息 |
| global_data.review_info | object | 评价信息 |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| 400 | 风控拦截 | 重试 3 次 |
| region 不匹配 | data 为空 | 确保 region 正确或降级用 V3 |

---

### 2. fetch_product_detail_v2

`GET /api/v1/tiktok/shop/web/fetch_product_detail_v2`

#### 用途

获取 TikTok Shop 商品详情（移动端接口），数据结构更精简，响应速度更快。

#### 何时使用 / 何时不使用

- **使用**：需要快速获取商品基本信息
- **不使用**：需要完整数据时 → 用 `fetch_product_detail` 或 `fetch_product_detail_v3`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| product_id | query | string | **是** | 商品 ID | 1729556436942358002 |
| seller_id | query | string | 否 | 卖家 ID（可传空字符串） | 7494629757824764402 |
| region | query | string | 否 | 地区代码，默认 MY | MY |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| productDetailSchema | object | 商品详细信息 |
| productCategoryInfoSchema | object | 分类信息 |
| pdpRelatedKwSchema | array | 相关关键词 |
| productsForComponentListSchema | array | 推荐商品组件 |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| 400 | 风控拦截 | 重试 3 次 |

---

### 3. fetch_product_detail_v3

`GET /api/v1/tiktok/shop/web/fetch_product_detail_v3`

#### 用途

获取 TikTok Shop 商品详情（移动端接口），提供最完整的商品信息，适用于所有地区。

#### 何时使用 / 何时不使用

- **使用**：需要完整数据且 V1 不可用时
- **使用**：泰国等特殊地区商品
- **不使用**：V1 可用且需要桌面端数据时 → 用 `fetch_product_detail`

**重要**：region 必须与 product_id 对应，否则无数据。

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| product_id | query | string | **是** | 商品 ID | 1732108663255959373 |
| region | query | string | 否 | 地区代码，默认 SG | SG |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| productInfo | object | 商品详细信息 |
| frequentlyBoughtTogether | array | 经常一起购买 |
| similarProductsInCategory | array | 同类别相似商品 |
| exploreMoreFromShop | array | 店铺更多商品 |
| customersAlsoBought | array | 顾客还购买了 |
| relatedVideos | array | 相关视频 |
| shopPerformance | object | 店铺表现 |
| categoryInfo | object | 分类信息 |
| shopInfo | object | 店铺信息 |
| shopHotReviews | array | 店铺热门评论 |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| region 不匹配 | data 为空 | 确保 region 与 product_id 对应 |
| 400 | 风控拦截 | 重试 3 次 |

---

### 4. fetch_product_reviews_v2

`GET /api/v1/tiktok/shop/web/fetch_product_reviews_v2`

#### 用途

获取 TikTok Shop 商品评论，支持多种筛选和排序方式。

#### 何时使用 / 何时不使用

- **使用**：查看商品评论和评分分布
- **使用**：筛选有图/视频评论或真实购买评论
- **不使用**：需要 App 端评论时 → 用 `app_v3_fetch_product_review`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| product_id | query | string | **是** | 商品 ID | 1729408816995078528 |
| page_start | query | integer | 否 | 起始页码，默认 1 | 1 |
| sort_rule | query | integer | 否 | 排序规则，默认 2 | 2 |
| filter_type | query | integer | 否 | 筛选类型 (1:默认 2:有图/视频 3:真实购买)，默认 1 | 2 |
| filter_value | query | integer | 否 | 星级筛选 (6:全部 5-1:对应星级)，默认 6 | 5 |
| region | query | string | 否 | 地区代码，默认 US | US |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| reviews | object[] | 评论列表（每页 20 条） |
| reviews[].review_id | string | 评论 ID |
| reviews[].user | object | 用户信息 (user_id, nickname, avatar) |
| reviews[].rating | integer | 评分 (1-5 星) |
| reviews[].content | string | 评论内容 |
| reviews[].medias | object[] | 媒体文件 (type, url) |
| reviews[].create_time | integer | 创建时间戳 |
| reviews[].verified_purchase | boolean | 是否认证购买 |
| reviews[].likes_count | integer | 点赞数 |
| reviews[].seller_reply | object | 卖家回复 |
| has_more | integer | 是否有更多 (1=有, 0=无) |
| total_count | integer | 总评论数 |
| review_summary | object | 评论摘要 (average_rating, star_distribution) |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| 400 | 风控拦截 | 重试 3 次 |
| 商品不支持 Web 访问 | data 为空 | 使用 App V3 端点 |

---

### 5. fetch_seller_products_list

`GET /api/v1/tiktok/shop/web/fetch_seller_products_list`

#### 用途

获取指定商家的商品列表（桌面端），支持分页加载。

#### 何时使用 / 何时不使用

- **使用**：查看商家全部商品
- **不使用**：需要移动端精简数据时 → 用 `fetch_seller_products_list_v2`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| seller_id | query | string | **是** | 卖家 ID | 7495150558072178725 |
| search_params | query | string | 否 | 搜索参数（分页用） | - |
| region | query | string | 否 | 地区代码，默认 US | US |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| products | object[] | 商品列表（每页 30 个） |
| products[].product_id | string | 商品 ID |
| products[].title | string | 商品标题 |
| products[].image | string | 商品图片 URL |
| products[].product_price_info | object | 价格信息 |
| products[].rate_info | object | 评分信息 |
| products[].sold_info | object | 销量信息 |
| products[].seller_info | object | 卖家信息 |
| has_more | boolean | 是否有更多 |
| load_more_params | object | 加载更多参数 |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| 400 | 风控拦截 | 重试 3 次 |

---

### 6. fetch_seller_products_list_v2

`GET /api/v1/tiktok/shop/web/fetch_seller_products_list_v2`

#### 用途

获取商家商品列表（移动端接口），数据结构更精简。

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| seller_id | query | string | **是** | 卖家 ID | 7495150558072178725 |
| searchParams | query | string | 否 | 搜索参数 | - |
| region | query | string | 否 | 地区代码，默认 US | US |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| products | array | 商品列表 |
| has_more | boolean | 是否有更多 |
| load_more_params | object | 加载更多参数 |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| 400 | 风控拦截 | 重试 3 次 |

---

### 7. fetch_search_word_suggestion_v2

`GET /api/v1/tiktok/shop/web/fetch_search_word_suggestion_v2`

#### 用途

获取搜索关键词建议（移动端接口），专为电商搜索结果优化。

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| search_word | query | string | **是** | 搜索关键词 | labubu |
| lang | query | string | 否 | 语言，默认 en-US | en-US |
| region | query | string | 否 | 地区代码，默认 US | US |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| data | string[] | 建议列表（最多 50 个） |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| 400 | 风控拦截 | 重试 3 次 |

---

### 8. fetch_search_products_list

`GET /api/v1/tiktok/shop/web/fetch_search_products_list`

#### 用途

根据关键词搜索商品（桌面端接口），支持分页加载更多结果。

#### 何时使用 / 何时不使用

- **使用**：按关键词搜索商品
- **使用**：发现特定品类的商品
- **不使用**：需要移动端精简数据时 → 用 `fetch_search_products_list_v2`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| search_word | query | string | **是** | 搜索关键词 | labubu |
| offset | query | integer | 否 | 偏移量，默认 0 | 0 |
| page_token | query | string | 否 | 分页标记 | - |
| region | query | string | 否 | 地区代码，默认 US | US |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| products | object[] | 商品列表（每页 30 个） |
| products[].product_id | string | 商品 ID |
| products[].title | string | 商品标题 |
| products[].image | string | 商品图片 URL |
| products[].product_price_info | object | 价格信息 |
| products[].rate_info | object | 评分信息 |
| products[].sold_info | object | 销量信息 |
| products[].seller_info | object | 卖家信息 |
| products[].product_marketing_info | object | 营销信息 |
| has_more | boolean | 是否有更多 |
| load_more_params | object | 分页参数 (offset, page_token, api_source) |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| 400 | 风控拦截 | 重试 3 次 |

---

### 9. fetch_search_products_list_v2

`GET /api/v1/tiktok/shop/web/fetch_search_products_list_v2`

#### 用途

搜索商品（移动端接口），数据结构更精简，响应更快。

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| search_word | query | string | **是** | 搜索关键词 | labubu |
| offset | query | integer | 否 | 偏移量，默认 0 | 0 |
| page_token | query | string | 否 | 分页标记 | - |
| region | query | string | 否 | 地区代码，默认 US | US |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| products | array | 商品列表 |
| has_more | boolean | 是否有更多 |
| load_more_params | object | 加载更多参数 |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| 400 | 风控拦截 | 重试 3 次 |

---

### 10. fetch_products_category_list

`GET /api/v1/tiktok/shop/web/fetch_products_category_list`

#### 用途

获取 TikTok Shop 的商品分类目录，返回完整的分类树结构（约 28 个主分类）。

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| region | query | string | 否 | 地区代码，默认 US | US |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| (根数组) | object[] | 分类树 |
| [].self | object | 分类自身 (category_id, category_level, is_leaf, parent_category_id, category_name, category_name_en, image_url) |
| [].children | object[] | 子分类列表（递归结构） |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| 服务不可用 | 请求失败 | 稍后重试 |

---

### 11. fetch_products_by_category_id

`GET /api/v1/tiktok/shop/web/fetch_products_by_category_id`

#### 用途

根据商品分类 ID 获取该分类下的商品列表，可用于构建分类浏览功能。

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| category_id | query | integer | **是** | 分类 ID（从 fetch_products_category_list 获取） | 963976 |
| offset | query | integer | 否 | 翻页偏移量，默认 0（每页 20 个，+20 翻页） | 0 |
| region | query | string | 否 | 地区代码，默认 US | US |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| products | object[] | 商品列表（最多 20 个） |
| products[].product_id | string | 商品 ID |
| products[].title | string | 商品标题 |
| products[].price | object | 价格信息 |
| products[].rating | object | 评分信息 |
| products[].sales | object | 销量信息 |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| 400 | 风控拦截 | 重试 3 次 |
| category_id 无效 | products 为空 | 从 fetch_products_category_list 获取有效 ID |

---

### 12. fetch_hot_selling_products_list

`GET /api/v1/tiktok/shop/web/fetch_hot_selling_products_list`

#### 用途

获取 TikTok Shop 的热卖商品列表，返回当前最受欢迎的商品。

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| region | query | string | 否 | 地区代码，默认 US | US |
| count | query | integer | 否 | 返回商品数量，默认 100 | 100 |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| products | object[] | 热卖商品列表（最多 1000 个） |
| products[].product_id | string | 商品 ID |
| products[].title | string | 商品标题 |
| products[].price | object | 价格信息 |
| products[].rating | object | 评分信息 |
| products[].sales | object | 销量信息 |
| products[].rank | integer | 热卖排名 |

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| 服务不可用 | 请求失败 | 稍后重试 |

---

### 13. app_v3_fetch_product_detail (即将弃用)

`GET /api/v1/tiktok/app/v3/fetch_product_detail`

#### 用途

获取商品详情数据（即将弃用，使用 `app_v3_fetch_product_detail_v2` 代替）。

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| product_id | query | string | **是** | 商品 ID | 1729385239712731370 |

#### OUT

商品详情数据。

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| 即将弃用 | - | 迁移到 v2 端点 |

---

### 14. app_v3_fetch_product_detail_v2

`GET /api/v1/tiktok/app/v3/fetch_product_detail_v2`

#### 用途

获取商品详情数据 V2。

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| product_id | query | string | **是** | 商品 ID | 1729385239712731370 |

#### OUT

商品详情数据 V2。

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| product_id 无效 | data 为空 | 检查商品 ID |

---

### 15. app_v3_fetch_product_detail_v3

`GET /api/v1/tiktok/app/v3/fetch_product_detail_v3`

#### 用途

获取商品详情数据 V3。如果 V2 无法获取，可尝试此接口。

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| product_id | query | string | **是** | 商品 ID | 1729385239712731370 |
| region | query | string | 否 | 地区代码，默认 US | US |

**支持 region：** US, MX, GB, IE, ES, SG, MY, PH, TH, VN, ID

#### OUT

商品详情数据 V3。

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| region 不匹配 | data 为空 | 确保 region 与 product_id 对应 |

---

### 16. app_v3_fetch_product_detail_v4

`GET /api/v1/tiktok/app/v3/fetch_product_detail_v4`

#### 用途

获取商品详情数据 V4。如果 V3 无法获取，可尝试此接口。

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| product_id | query | string | **是** | 商品 ID | 1729385239712731370 |
| region | query | string | 否 | 地区代码，默认 US | US |

**支持 region：** US, MX, GB, IE, ES, SG, MY, PH, TH, VN, ID

#### OUT

商品详情数据 V4。

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| region 不匹配 | data 为空 | 确保 region 与 product_id 对应 |

---

### 17. app_v3_fetch_product_review

`GET /api/v1/tiktok/app/v3/fetch_product_review`

#### 用途

获取商品评价数据（App V3 接口）。

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| product_id | query | string | **是** | 商品 ID | 1729448812983194615 |
| cursor | query | integer | 否 | 游标（翻页用），默认 0 | 0 |
| size | query | integer | 否 | 数量，默认 10 | 10 |
| filter_id | query | integer | 否 | 筛选条件，默认 0 | 0 |
| sort_type | query | integer | 否 | 排序条件，默认 0 | 0 |

**filter_id 枚举值：**

| 值 | 说明 |
|----|------|
| 0 | 全部评价 |
| 1-5 | 对应星级评价 |
| 102 | 有图评价 |
| 104 | 已购买的评价 |

**sort_type 枚举值：**

| 值 | 说明 |
|----|------|
| 1 | 相关度 |
| 2 | 从新到旧 |

#### OUT

商品评价数据。

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| product_id 无效 | data 为空 | 检查商品 ID |

---

### 18. app_v3_fetch_shop_id_by_share_link

`GET /api/v1/tiktok/app/v3/fetch_shop_id_by_share_link`

#### 用途

通过分享链接获取店铺 ID。

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| share_link | query | string | **是** | 分享链接 | https://vt.tiktok.com/ZT2AHoGsE/ |

#### OUT

店铺 ID。

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| 链接无效 | data 为空 | 检查分享链接 |

---

### 19. app_v3_fetch_product_id_by_share_link

`GET /api/v1/tiktok/app/v3/fetch_product_id_by_share_link`

#### 用途

通过分享链接获取商品 ID。

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| share_link | query | string | **是** | 分享链接 | https://www.tiktok.com/t/ZT98v9dPs6aEC-qHWeW/ |

#### OUT

商品 ID。

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| 链接无效 | data 为空 | 检查分享链接 |

---

### 20. app_v3_fetch_shop_home_page_list

`GET /api/v1/tiktok/app/v3/fetch_shop_home_page_list`

#### 用途

获取商家主页 Page 列表数据，用于商家主页展示和商品数据爬取。

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| seller_id | query | string | **是** | 商家 ID / 店铺 ID | 8646929864612614278 |

#### OUT

商家主页 Page 列表数据。

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| seller_id 无效 | data 为空 | 检查商家 ID |

---

### 21. app_v3_fetch_shop_home

`GET /api/v1/tiktok/app/v3/fetch_shop_home`

#### 用途

获取商家主页的商品数据，需先通过 `app_v3_fetch_shop_home_page_list` 获取 page_id。

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| page_id | query | string | **是** | 商家主页 Page ID | 7314705727611930410 |
| seller_id | query | string | **是** | 商家 ID / 店铺 ID | 8646929864612614278 |

#### OUT

商家主页数据。

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| page_id 无效 | data 为空 | 从 fetch_shop_home_page_list 获取 |

---

### 22. app_v3_fetch_shop_product_recommend

`GET /api/v1/tiktok/app/v3/fetch_shop_product_recommend`

#### 用途

获取商家商品推荐数据。

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| seller_id | query | string | **是** | 商家 ID / 店铺 ID | 8646929864612614278 |
| scroll_param | query | string | 否 | 滚动参数（加载更多） | - |
| page_size | query | integer | 否 | 每页数量，默认 10 | 10 |

#### OUT

商家商品推荐数据。

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| seller_id 无效 | data 为空 | 检查商家 ID |

---

### 23. app_v3_fetch_shop_product_list

`GET /api/v1/tiktok/app/v3/fetch_shop_product_list`

#### 用途

获取商家商品列表数据，支持排序。

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| seller_id | query | string | **是** | 商家 ID / 店铺 ID | 8646929864612614278 |
| scroll_params | query | string | 否 | 滚动参数（加载更多） | - |
| page_size | query | integer | 否 | 每页数量，默认 10 | 10 |
| sort_field | query | integer | 否 | 排序字段，默认 1 | 4 |
| sort_order | query | integer | 否 | 排序方式，默认 0 | 1 |

**sort_field 枚举值：**

| 值 | 说明 |
|----|------|
| 1 | 综合排序（默认） |
| 3 | 最新发布 |
| 4 | 销量最好 |
| 5 | 价格排序 |

**sort_order 枚举值：**

| 值 | 说明 |
|----|------|
| 0 | 默认价格排序 |
| 1 | 价格从高到低 |
| 2 | 价格从低到高 |

#### OUT

商家商品列表数据。

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| seller_id 无效 | data 为空 | 检查商家 ID |

---

### 24. app_v3_fetch_shop_product_list_v2

`GET /api/v1/tiktok/app/v3/fetch_shop_product_list_v2`

#### 用途

获取商家商品列表数据 V2，参数与 V1 相同。

#### IN

同 `app_v3_fetch_shop_product_list`。

#### OUT

商家商品列表数据 V2。

---

### 25. app_v3_fetch_shop_info

`GET /api/v1/tiktok/app/v3/fetch_shop_info`

#### 用途

获取商家信息数据。

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| shop_id | query | string | **是** | 商家 ID / 店铺 ID | 8646942781241463007 |

#### OUT

商家信息数据。

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| shop_id 无效 | data 为空 | 检查店铺 ID |

---

### 26. app_v3_fetch_shop_product_category

`GET /api/v1/tiktok/app/v3/fetch_shop_product_category`

#### 用途

获取商家产品分类数据。

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| seller_id | query | string | **是** | 商家 ID / 店铺 ID | 7495294980909468039 |

#### OUT

商家产品分类数据。

#### ERR

| 错误场景 | 响应特征 | 处理 |
|----------|----------|------|
| seller_id 无效 | data 为空 | 检查商家 ID |

---

> 参见 param-mappings.md 获取字段流字典、端点替换矩阵和路径合法性硬校验规则。
> 参见 endpoints_whitelist.yaml 获取端点白名单和预调用验证协议。
