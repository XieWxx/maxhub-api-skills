# Kuaishou Data Assistant

[中文文档](README_CN.md)

Kuaishou video, user, search, trending, comment, and live data assistant via MaxHub API. 38 active endpoints across 5 functional areas.

## Features

| Area | Reference | Covers | Endpoints |
|------|-----------|--------|-----------|
| Video | `references/video.md` | Video detail, batch query, URL fetch, share links | 8 |
| User | `references/user.md` | User profiles, stats, posts, hot posts, collections, ID extraction | 6 |
| Search | `references/search.md` | Comprehensive search, hot lists, feeds, tags | 14 |
| Comments | `references/comments.md` | Video comments, sub-comment replies | 4 |
| Live | `references/live.md` | Live info, live rankings, shopping/brand/music rankings, replays | 6 |

Supports both App and Web API endpoints. See `references/param-mappings.md` for parameter quick reference.

## Install

```bash
npx clawhub install maxhub-kuaishou
```

## Setup

1. Go to [www.aconfig.cn](https://www.aconfig.cn) to register and get your API Key
2. Configure: `openclaw config set skills.entries.maxhub-kuaishou.apiKey "<your-key>"` or `export MAXHUB_API_KEY="<your-key>"`

## Usage Examples

| Category | Example prompts |
|----------|----------------|
| Video | 查快手视频详情 photo_id..., get Kuaishou video info for... |
| User | 查快手用户粉丝数, get Kuaishou user stats for... |
| Search | 查快手热搜/在快手搜索原神, search Kuaishou for... |
| Comments | 查快手视频评论, get Kuaishou video comments |
| Live | 查快手直播间榜单, get Kuaishou live rankings |

Supports both **English** and **Chinese**.

## Links

- Website: [www.aconfig.cn](https://www.aconfig.cn)

---

Powered by [MaxHub](https://www.aconfig.cn)
