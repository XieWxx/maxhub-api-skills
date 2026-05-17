# User Data API / 用户数据接口

Base URL: `https://www.aconfig.cn`
Auth: `Authorization: Bearer $MAXHUB_API_KEY`

---

## fetch_user_info — 获取用户信息 (App/Web)

`GET /api/v1/weibo/app/fetch_user_info` 或 `/api/v1/weibo/web/fetch_user_information`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| uid | string | ✅ | 用户UID |

---

## fetch_user_detail — 获取用户详细信息 (App)

`GET /api/v1/weibo/app/fetch_user_detail_information`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| uid | string | ✅ | 用户UID |

---

## fetch_user_basic_info — 获取用户基本信息 (V2)

`GET /api/v1/weibo/web_v2/fetch_user_basic_information`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| uid | string | ✅ | 用户UID |

---

## fetch_user_timeline — 获取用户发布的微博 (App)

`GET /api/v1/weibo/app/fetch_user_timeline`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| uid | string | ✅ | 用户UID |
| page | integer | ❌ | 页码 |

---

## fetch_user_original_posts — 获取用户原创微博 (V2)

`GET /api/v1/weibo/web_v2/fetch_user_original_posts`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| uid | string | ✅ | 用户UID |
| page | integer | ❌ | 页码 |

---

## fetch_user_articles — 获取用户文章列表 (App/V2)

`GET /api/v1/weibo/app/fetch_user_articles` 或 `/api/v1/weibo/web_v2/fetch_user_articles`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| uid | string | ✅ | 用户UID |
| page | integer | ❌ | 页码 |

---

## fetch_user_videos — 获取用户视频列表 (App)

`GET /api/v1/weibo/app/fetch_user_videos`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| uid | string | ✅ | 用户UID |
| page | integer | ❌ | 页码 |

---

## fetch_user_all_videos — 获取用户全部视频 (V2)

`GET /api/v1/weibo/web_v2/fetch_user_all_videos`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| uid | string | ✅ | 用户UID |
| page | integer | ❌ | 页码 |

---

## fetch_user_following — 获取用户关注列表 (App/V2)

`GET /api/v1/weibo/app/fetch_user_following` 或 `/api/v1/weibo/web_v2/fetch_user_following`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| uid | string | ✅ | 用户UID |
| page | integer | ❌ | 页码 |

---

## fetch_user_followers — 获取用户粉丝列表 (App/V2)

`GET /api/v1/weibo/app/fetch_user_followers` 或 `/api/v1/weibo/web_v2/fetch_user_followers`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| uid | string | ✅ | 用户UID |
| page | integer | ❌ | 页码 |

---

## fetch_user_super_topics — 获取用户参与的超话 (App)

`GET /api/v1/weibo/app/fetch_user_super_topics`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| uid | string | ✅ | 用户UID |

---

## user_search — 搜索用户 (V2)

`GET /api/v1/weibo/web_v2/user_search`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| keyword | string | ✅ | 搜索关键词 |
| page | integer | ❌ | 页码 |

---

## Common Workflows / 常用工作流

### "分析微博用户"

1. `user_search(keyword="xxx")` → 搜索用户
2. `fetch_user_info(uid=xxx)` → 用户信息
3. `fetch_user_timeline(uid=xxx)` → 微博列表
4. `fetch_user_original_posts(uid=xxx)` → 原创微博
