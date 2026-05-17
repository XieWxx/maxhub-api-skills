# Search API / 搜索接口

Base URL: `https://www.aconfig.cn`
Auth: `Authorization: Bearer $MAXHUB_API_KEY`

---

## search_notes

`GET/POST /api/v1/xiaohongshu/.../search_notes`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`

## search_users

`GET/POST /api/v1/xiaohongshu/.../search_users`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`

## search_products

`GET/POST /api/v1/xiaohongshu/.../search_products`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`

## fetch_search_suggestions

`GET/POST /api/v1/xiaohongshu/.../fetch_search_suggestions`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`

## fetch_trending_keywords

`GET/POST /api/v1/xiaohongshu/.../fetch_trending_keywords`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`

## fetch_home_feed

`GET/POST /api/v1/xiaohongshu/.../fetch_home_feed`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`


---

## Common Workflows / 常用工作流

See SKILL.md for cross-group orchestration patterns.
