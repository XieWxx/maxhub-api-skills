# Bilibili Data Assistant

[中文文档](README_CN.md)

Bilibili video, user, comment, danmaku, live, and collection data assistant via MaxHub API. 41 active endpoints across 6 functional areas.

## Features

| Area | Reference | Endpoints |
|------|-----------|-----------|
| Video | `references/video.md` | Video detail, play URL, subtitle, parts, BV/AV conversion | 13 |
| User | `references/user.md` | User profiles, stats, videos, dynamics, ID extraction | 10 |
| Search | `references/search.md` | Search, hot list, feeds, popular, bangumi, cinema | 9 |
| Comments | `references/comments.md` | Comments, replies, danmaku | 5 |
| Live | `references/live.md` | Room info, live streams, streamers, areas | 4 |
| Collections | `references/collections.md` | Collection folders, folder videos | 2 |

Supports both App and Web API endpoints. See `references/param-mappings.md` for parameter quick reference.

## Install

```bash
npx clawhub install maxhub-bilibili
```

## Setup

1. Go to [www.aconfig.cn](https://www.aconfig.cn) to register and get your API Key
2. Configure: `openclaw config set skills.entries.maxhub-bilibili.apiKey "<your-key>"` or `export MAXHUB_API_KEY="<your-key>"`

## Usage Examples

| Category | Example prompts |
|----------|----------------|
| Video | 查B站视频详情 BV..., get Bilibili video info for BV... |
| User | 查B站UP主粉丝数, get Bilibili user stats for UID... |
| Search | 在B站搜索原神视频, search Bilibili for... |
| Comments | 查B站视频评论, get Bilibili video comments |
| Live | 查B站直播间人数, get Bilibili live room info |
| Collections | 查B站用户收藏夹, get Bilibili user collections |

Supports both **English** and **Chinese**.

## Links

- Website: [www.aconfig.cn](https://www.aconfig.cn)

---

Powered by [MaxHub](https://www.aconfig.cn)
