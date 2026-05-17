# Trending & Hot API / 热搜与榜单接口

Base URL: `https://www.aconfig.cn`
Auth: `Authorization: Bearer $MAXHUB_API_KEY`

整合 App/Web/V2 多版本热搜榜单接口。

---

## fetch_hot_search — 获取热搜榜 (App)

`GET /api/v1/weibo/app/fetch_hot_search`

### Parameters

无必填参数。

---

## fetch_hot_search_ranking — 获取热搜榜单 (V2)

`GET /api/v1/weibo/web_v2/fetch_hot_search_ranking`

### Parameters

无必填参数。返回完整热搜榜单数据。

---

## fetch_hot_search_complete — 获取热搜词条 (V2)

`GET /api/v1/weibo/web_v2/fetch_hot_search_complete`

### Parameters

无必填参数。返回约10条热搜词条。

---

## fetch_entertainment_ranking — 获取文娱榜单 (V2)

`GET /api/v1/weibo/web_v2/fetch_entertainment_ranking`

### Parameters

无必填参数。

---

## fetch_social_ranking — 获取社会榜单 (V2)

`GET /api/v1/weibo/web_v2/fetch_social_ranking`

### Parameters

无必填参数。

---

## fetch_life_ranking — 获取生活榜单 (V2)

`GET /api/v1/weibo/web_v2/fetch_life_ranking`

### Parameters

无必填参数。

---

## fetch_hot_ranking_timeline — 获取热门榜单时间线 (V2)

`GET /api/v1/weibo/web_v2/fetch_hot_ranking_timeline`

### Parameters

无必填参数。返回热搜时间线变化数据。

---

## Common Workflows / 常用工作流

### "微博热搜分析"

1. `fetch_hot_search_ranking()` → 热搜榜单
2. `fetch_entertainment_ranking()` → 文娱榜
3. `fetch_social_ranking()` → 社会榜
4. `fetch_hot_ranking_timeline()` → 热搜时间线

### "快速查看热搜"

1. `fetch_hot_search()` → App版热搜
2. `fetch_hot_search_complete()` → 10条热搜词条
