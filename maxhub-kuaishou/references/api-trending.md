# Search & Trending API / 搜索与热榜接口

Base URL: `https://www.aconfig.cn`
Auth: `Authorization: Bearer $MAXHUB_API_KEY`

---

## comprehensive_search

`GET/POST /api/v1/kuaishou/.../comprehensive_search`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`

## search_video

`GET/POST /api/v1/kuaishou/.../search_video`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`

## fetch_hot_list

`GET/POST /api/v1/kuaishou/.../fetch_hot_list`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`

## fetch_hot_categories

`GET/POST /api/v1/kuaishou/.../fetch_hot_categories`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`

## fetch_brand_top_list

`GET/POST /api/v1/kuaishou/.../fetch_brand_top_list`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`

## fetch_live_top_list

`GET/POST /api/v1/kuaishou/.../fetch_live_top_list`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`

## fetch_shopping_top_list

`GET/POST /api/v1/kuaishou/.../fetch_shopping_top_list`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`


---

## Common Workflows / 常用工作流

See SKILL.md for cross-group orchestration patterns.
