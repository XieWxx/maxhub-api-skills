# Threads Data Assistant

[中文文档](README_CN.md)

Threads posts, user profiles, search, comments, and reposts data assistant via MaxHub API. 11 active endpoints across 2 functional areas.

## Features

| Area | Reference | Covers | Endpoints |
|------|-----------|--------|-----------|
| User | `references/user.md` | User info, posts, reposts, replies | 5 |
| Content | `references/content.md` | Post detail, comments, search | 6 |

See `references/param-mappings.md` for parameter quick reference.

## Install

```bash
npx clawhub install maxhub-threads
```

## Setup

1. Go to [www.aconfig.cn](https://www.aconfig.cn) to register and get your API Key
2. Configure: `openclaw config set skills.entries.maxhub-threads.apiKey "<your-key>"` or `export MAXHUB_API_KEY="<your-key>"`

## Usage Examples

| Category | Example prompts |
|----------|----------------|
| User | 查Threads用户, threads用户 lilbieber, get Threads user posts |
| Content | 查Threads帖子, threads帖子详情, search Threads for bitcoin |
| Search | Threads搜索, search Threads profiles, Threads热门内容 |

Supports both **English** and **Chinese**.

## Links

- Website: [www.aconfig.cn](https://www.aconfig.cn)

---

Powered by [MaxHub](https://www.aconfig.cn)
