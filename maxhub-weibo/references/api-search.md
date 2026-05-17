# Search API / 搜索接口

Base URL: `https://www.aconfig.cn`
Auth: `Authorization: Bearer $MAXHUB_API_KEY`

整合 App/Web/V2 多版本搜索接口。

---

## comprehensive_search — 综合搜索 (App)

`GET /api/v1/weibo/app/comprehensive_search`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| keyword | string | ✅ | 搜索关键词 |
| page | integer | ❌ | 页码 |

---

## search_weibo — 搜索微博 (Web)

`GET /api/v1/weibo/web/search_weibo`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| keyword | string | ✅ | 搜索关键词 |
| page | integer | ❌ | 页码 |

---

## ai_search — 微博AI搜索 (V2)

`GET /api/v1/weibo/web_v2/ai_search`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| keyword | string | ✅ | 搜索关键词 |

---

## ai_search_extension — 微博AI搜索内容扩展 (V2)

`GET /api/v1/weibo/web_v2/ai_search_extension`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| keyword | string | ✅ | 搜索关键词 |

---

## advanced_search — 微博高级搜索 (V2)

`GET /api/v1/weibo/web_v2/advanced_search`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| keyword | string | ✅ | 搜索关键词 |
| starttime | string | ❌ | 开始时间 |
| endtime | string | ❌ | 结束时间 |
| sort | string | ❌ | 排序方式 |
| type | string | ❌ | 内容类型 |

---

## realtime_search — 实时搜索 (V2)

`GET /api/v1/weibo/web_v2/realtime_search`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| keyword | string | ✅ | 搜索关键词 |

---

## picture_search — 图片搜索 (V2)

`GET /api/v1/weibo/web_v2/picture_search`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| keyword | string | ✅ | 搜索关键词 |
| page | integer | ❌ | 页码 |

---

## video_search — 视频搜索（热门/全部）(V2)

`GET /api/v1/weibo/web_v2/video_search`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| keyword | string | ✅ | 搜索关键词 |
| type | string | ❌ | hot=热门, all=全部 |
| page | integer | ❌ | 页码 |

---

## topic_search — 话题搜索 (V2)

`GET /api/v1/weibo/web_v2/topic_search`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| keyword | string | ✅ | 搜索关键词 |

---

## search_user_posts — 搜索用户微博 (V2)

`GET /api/v1/weibo/web_v2/search_user_posts`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| uid | string | ✅ | 用户UID |
| keyword | string | ✅ | 搜索关键词 |
| page | integer | ❌ | 页码 |

---

## fetch_similar_search — 获取相似搜索词推荐 (V2)

`GET /api/v1/weibo/web_v2/fetch_similar_search`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| keyword | string | ✅ | 搜索关键词 |

---

## fetch_search_suggestions — 获取搜索联想词 (V2)

`GET /api/v1/weibo/web_v2/fetch_search_suggestions`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| keyword | string | ✅ | 部分关键词 |

---

## Common Workflows / 常用工作流

### "搜索微博内容"

1. `comprehensive_search(keyword="xxx")` → 综合搜索
2. 如需AI分析 → `ai_search(keyword="xxx")` → AI搜索
3. 如需精确筛选 → `advanced_search(keyword="xxx", starttime="...", endtime="...")` → 高级搜索

### "搜索特定类型内容"

1. 图片 → `picture_search(keyword="xxx")`
2. 视频 → `video_search(keyword="xxx")`
3. 话题 → `topic_search(keyword="xxx")`
