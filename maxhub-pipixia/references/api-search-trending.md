# Search & Trending API / 搜索与热搜接口

Base URL: `https://www.aconfig.cn`
Auth: `Authorization: Bearer $MAXHUB_API_KEY`

---

## fetch_search

`GET/POST /api/v1/pipixia/.../fetch_search`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`

## fetch_hot_search_board_list

`GET/POST /api/v1/pipixia/.../fetch_hot_search_board_list`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`

## fetch_hot_search_board_detail

`GET/POST /api/v1/pipixia/.../fetch_hot_search_board_detail`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`

## fetch_hot_search_words

`GET/POST /api/v1/pipixia/.../fetch_hot_search_words`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`

## fetch_hashtag_detail

`GET/POST /api/v1/pipixia/.../fetch_hashtag_detail`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`

## fetch_hashtag_posts

`GET/POST /api/v1/pipixia/.../fetch_hashtag_posts`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`

## fetch_home_feed

`GET/POST /api/v1/pipixia/.../fetch_home_feed`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`

## fetch_home_short_drama

`GET/POST /api/v1/pipixia/.../fetch_home_short_drama`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`


---

## Common Workflows / 常用工作流

See SKILL.md for cross-group orchestration patterns.
