# Xigua Video Data Assistant

[中文文档](README_CN.md)

Xigua Video (西瓜视频) video, user, search, and comment data assistant via MaxHub API. 7 active endpoints covering 6 functional areas.

## Features

| Area | Reference | Endpoints |
|------|-----------|-----------|
| Content | `references/content.md` | Video detail (v1/v2), play URL, search, comments, user info, user posts | 7 |

Supports Xigua App V2 API endpoints. See `references/param-mappings.md` for parameter quick reference.

## Install

```bash
npx clawhub install maxhub-xigua
```

## Setup

1. Go to [www.aconfig.cn](https://www.aconfig.cn) to register and get your API Key
2. Configure: `openclaw config set skills.entries.maxhub-xigua.apiKey "<your-key>"` or `export MAXHUB_API_KEY="<your-key>"`

## Usage Examples

| Category | Example prompts |
|----------|----------------|
| Video | 查西瓜视频详情 item_id..., get Xigua video info for item_id... |
| Search | 在西瓜视频搜索..., search Xigua for... |
| Comments | 查西瓜视频评论, get Xigua video comments |
| User | 查西瓜视频用户信息, get Xigua user info and posts |

Supports both **English** and **Chinese**.

## Links

- Website: [www.aconfig.cn](https://www.aconfig.cn)

---

Powered by [MaxHub](https://www.aconfig.cn)
