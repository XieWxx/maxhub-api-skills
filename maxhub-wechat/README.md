# WeChat Data Assistant

[中文文档](README_CN.md)

WeChat data assistant covering Channels (视频号) videos, Official Accounts (公众号) articles, and cross-platform search via MaxHub API. 22 active endpoints across 3 functional areas.

## Features

| Area | Reference | Covers | Endpoints |
|------|-----------|--------|-----------|
| Channels | `references/channels.md` | Channel info, video detail, comments, live streams, collections, share URLs | 12 |
| MP / Accounts | `references/mp.md` | Article detail, stats, comments, account profile, articles list, services | 9 |
| Search | `references/search.md` | Universal search across Channels + MP | 1 |

See `references/param-mappings.md` for parameter quick reference.

## Install

```bash
npx clawhub install maxhub-wechat
```

## Setup

1. Go to [www.aconfig.cn](https://www.aconfig.cn) to register and get your API Key
2. Configure: `openclaw config set skills.entries.maxhub-wechat.apiKey "<your-key>"` or `export MAXHUB_API_KEY="<your-key>"`

## Usage Examples

| Category | Example prompts |
|----------|----------------|
| Channels | 查微信视频号信息, get WeChat Channels video detail |
| MP / Accounts | 查公众号文章详情, get WeChat official account articles |
| Search | 微信搜索关键词, search WeChat for... |

Supports both **English** and **Chinese**.

## Links

- Website: [www.aconfig.cn](https://www.aconfig.cn)

---

Powered by [MaxHub](https://www.aconfig.cn)
