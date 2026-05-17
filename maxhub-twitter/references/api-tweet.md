# Tweet Data API / 推文数据接口

Base URL: `https://www.aconfig.cn`
Auth: `Authorization: Bearer $MAXHUB_API_KEY`

---

## fetch_single_tweet

`GET/POST /api/v1/twitter/.../fetch_single_tweet`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`

## fetch_tweet_comments

`GET/POST /api/v1/twitter/.../fetch_tweet_comments`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`

## fetch_comments

`GET/POST /api/v1/twitter/.../fetch_comments`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`

## fetch_retweet_users

`GET/POST /api/v1/twitter/.../fetch_retweet_users`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| (varies) | | | See https://www.aconfig.cn for details |

### Response

Standard MaxHub response: `{code, message, message_zh, data, cache_url}`


---

## Common Workflows / 常用工作流

See SKILL.md for cross-group orchestration patterns.
