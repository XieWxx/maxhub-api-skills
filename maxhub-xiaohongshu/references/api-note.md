# Note Data API / 笔记数据接口

Base URL: `https://www.aconfig.cn`
Auth: `Authorization: Bearer $MAXHUB_API_KEY`

---

## fetch_note_info

`GET/POST /api/v1/xiaohongshu/.../fetch_note_info`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`

## fetch_note_detail

`GET/POST /api/v1/xiaohongshu/.../fetch_note_detail`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`

## fetch_note_comments

`GET/POST /api/v1/xiaohongshu/.../fetch_note_comments`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`

## fetch_note_sub_comments

`GET/POST /api/v1/xiaohongshu/.../fetch_note_sub_comments`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`

## fetch_note_image

`GET/POST /api/v1/xiaohongshu/.../fetch_note_image`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`

## fetch_one_note_feed

`GET/POST /api/v1/xiaohongshu/.../fetch_one_note_feed`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`


---

## Common Workflows / 常用工作流

See SKILL.md for cross-group orchestration patterns.
