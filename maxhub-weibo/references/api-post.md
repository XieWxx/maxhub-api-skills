# Post & Comment API / 微博与评论接口

Base URL: `https://www.aconfig.cn`
Auth: `Authorization: Bearer $MAXHUB_API_KEY`

---

## fetch_post_detail — 获取微博详情 (App)

`GET /api/v1/weibo/app/fetch_post_detail`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| id | string | ✅ | 微博ID |

---

## fetch_single_post_data — 获取单个作品数据 (V2)

`GET /api/v1/weibo/web_v2/fetch_single_post_data`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| id | string | ✅ | 微博ID |

---

## fetch_post_comments — 获取微博评论 (App)

`GET /api/v1/weibo/app/fetch_post_comments`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| id | string | ✅ | 微博ID |
| page | integer | ❌ | 页码 |

---

## fetch_comments — 获取微博评论 (V2)

`GET /api/v1/weibo/web_v2/fetch_comments`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| id | string | ✅ | 微博ID |
| page | integer | ❌ | 页码 |

---

## fetch_sub_comments — 获取子评论 (App/V2)

`GET /api/v1/weibo/app/fetch_sub_comments` 或 `/api/v1/weibo/web_v2/fetch_sub_comments`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| id | string | ✅ | 评论ID |
| page | integer | ❌ | 页码 |

---

## fetch_post_reposts — 获取微博转发列表 (App)

`GET /api/v1/weibo/app/fetch_post_reposts`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| id | string | ✅ | 微博ID |
| page | integer | ❌ | 页码 |

---

## fetch_post_likes — 获取微博点赞列表 (App)

`GET /api/v1/weibo/app/fetch_post_likes`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| id | string | ✅ | 微博ID |
| page | integer | ❌ | 页码 |

---

## Common Workflows / 常用工作流

### "获取微博详情和评论"

1. `fetch_post_detail(id=xxx)` → 微博详情
2. `fetch_post_comments(id=xxx)` → 评论列表
3. `fetch_post_reposts(id=xxx)` → 转发列表

### "深度分析单条微博"

1. `fetch_single_post_data(id=xxx)` → 完整数据
2. `fetch_comments(id=xxx)` → 评论
3. `fetch_sub_comments(id=comment_id)` → 子评论
