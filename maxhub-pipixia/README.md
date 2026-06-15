# PiPiXia Data Assistant

[中文文档](README_CN.md)

PiPiXia post, user, search, trending, hashtag, and comment data assistant via MaxHub API. 17 active endpoints across 2 functional areas.

## Features

| Area | Reference | Covers | Endpoints |
|------|-----------|--------|-----------|
| User | `references/user.md` | User profiles, post list, followers, following | 4 |
| Content | `references/content.md` | Post detail, statistics, comments, home feed, search, hot search, hashtags, short drama, short URL | 13 |

All endpoints use the App API. See `references/param-mappings.md` for parameter quick reference.

## Install

```bash
npx clawhub install maxhub-pipixia
```

## Setup

1. Go to [www.aconfig.cn](https://www.aconfig.cn) to register and get your API Key
2. Configure: `openclaw config set skills.entries.maxhub-pipixia.apiKey "<your-key>"` or `export MAXHUB_API_KEY="<your-key>"`

## Usage Examples

| Category | Example prompts |
|----------|----------------|
| User | 查皮皮虾用户信息, get PiPiXia user profile for user_id... |
| Post | 查皮皮虾帖子详情, get PiPiXia post statistics |
| Search | 皮皮虾热搜, search PiPiXia for 搞笑 videos |
| Comments | 查皮皮虾评论, get PiPiXia post comments |
| Hashtag | 查皮皮虾话题, get PiPiXia hashtag detail |
| Feed | 皮皮虾首页推荐, get PiPiXia home feed |

Supports both **English** and **Chinese**.

## Links

- Website: [www.aconfig.cn](https://www.aconfig.cn)

---

Powered by [MaxHub](https://www.aconfig.cn)
