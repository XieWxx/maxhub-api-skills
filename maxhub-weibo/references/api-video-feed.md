# Video & Feed API / 视频与推荐接口

Base URL: `https://www.aconfig.cn`
Auth: `Authorization: Bearer $MAXHUB_API_KEY`

整合 App/Web/V2 多版本视频、推荐、频道、收藏夹接口。

---

## fetch_video_detail — 获取视频详情 (App)

`GET /api/v1/weibo/app/fetch_video_detail`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| video_id | string | ✅ | 视频ID |

---

## fetch_video_featured_feed — 获取短视频精选Feed流 (App)

`GET /api/v1/weibo/app/fetch_video_featured_feed`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| page | integer | ❌ | 页码 |

---

## fetch_home_recommend_feed — 获取首页推荐Feed流 (App)

`GET /api/v1/weibo/app/fetch_home_recommend_feed`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| page | integer | ❌ | 页码 |

---

## fetch_channel_feed — 根据频道名称获取热门内容 (Web)

`GET /api/v1/weibo/web/fetch_channel_feed`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| name | string | ✅ | 频道名称 |
| page | integer | ❌ | 页码 |

---

## fetch_channel_trend — 获取频道热门趋势 (Web)

`GET /api/v1/weibo/web/fetch_channel_trend`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| name | string | ✅ | 频道名称 |

---

## fetch_channel_config — 获取频道配置列表 (Web)

`GET /api/v1/weibo/web/fetch_channel_config`

### Parameters

无必填参数。返回所有频道配置。

---

## fetch_video_collection_list — 获取用户视频收藏夹列表 (V2)

`GET /api/v1/weibo/web_v2/fetch_video_collection_list`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| uid | string | ✅ | 用户UID |

---

## fetch_video_collection_detail — 获取视频收藏夹详情 (V2)

`GET /api/v1/weibo/web_v2/fetch_video_collection_detail`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| collection_id | string | ✅ | 收藏夹ID |
| page | integer | ❌ | 页码 |

---

## fetch_all_groups — 获取所有分组信息 (V2)

`GET /api/v1/weibo/web_v2/fetch_all_groups`

### Parameters

无必填参数。

---

## check_image_comment_allowed — 检查是否允许带图评论 (V2)

`GET /api/v1/weibo/web_v2/check_image_comment_allowed`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| id | string | ✅ | 微博ID |

---

## Common Workflows / 常用工作流

### "浏览微博视频"

1. `fetch_video_featured_feed()` → 精选视频
2. `fetch_video_detail(video_id=xxx)` → 视频详情

### "浏览频道内容"

1. `fetch_channel_config()` → 频道列表
2. `fetch_channel_feed(name="xxx")` → 频道内容
3. `fetch_channel_trend(name="xxx")` → 频道趋势
