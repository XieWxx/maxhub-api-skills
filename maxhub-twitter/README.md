# Twitter/X Data Assistant

[中文文档](README_CN.md)

Twitter/X data assistant for tweets, user profiles, search, comments, trending, followers, and media via MaxHub API. 12 active endpoints across 2 functional areas.

## Features

| Area | Reference | Covers | Endpoints |
|------|-----------|--------|-----------|
| User | `references/user.md` | User profiles, user tweets, replies, media, followings, followers | 6 |
| Content | `references/content.md` | Tweet detail, comments, search timeline, trending, retweet list | 6 |

Supports Web API endpoints. See `references/param-mappings.md` for parameter quick reference.

## Install

```bash
npx clawhub install maxhub-twitter
```

## Setup

1. Go to [www.aconfig.cn](https://www.aconfig.cn) to register and get your API Key
2. Configure: `openclaw config set skills.entries.maxhub-twitter.apiKey "<your-key>"` or `export MAXHUB_API_KEY="<your-key>"`

## Usage Examples

| Category | Example prompts |
|----------|----------------|
| User | 查推特用户资料 @elonmusk, get Twitter user profile for... |
| Content | 查推文详情和评论, search Twitter for... |
| Trending | 查Twitter趋势, get Twitter trending topics |

Supports both **English** and **Chinese**.

## Links

- Website: [www.aconfig.cn](https://www.aconfig.cn)

---

Powered by [MaxHub](https://www.aconfig.cn)
