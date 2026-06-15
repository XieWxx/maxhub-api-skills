# Zhihu Data Assistant

[中文文档](README_CN.md)

Zhihu user, content, and search data assistant via MaxHub API. 34 active endpoints across 3 functional areas.

## Features

| Area | Reference | Covers | Endpoints |
|------|-----------|--------|-----------|
| User | `references/user.md` | User profiles, following, followers, articles, columns, questions, collections, topics | 10 |
| Content | `references/content.md` | Column articles, comments, Q&A, hot list, hot recommend, video list | 11 |
| Search | `references/search.md` | Article/user/topic/video/column/scholar/ebook search, AI search, preset search, search recommend/suggest | 13 |

See `references/param-mappings.md` for parameter quick reference.

## Install

```bash
npx clawhub install maxhub-zhihu
```

## Setup

1. Go to [www.aconfig.cn](https://www.aconfig.cn) to register and get your API Key
2. Configure: `openclaw config set skills.entries.maxhub-zhihu.apiKey "<your-key>"` or `export MAXHUB_API_KEY="<your-key>"`

## Usage Examples

| Category | Example prompts |
|----------|----------------|
| User | 查知乎, 知乎用户, get zhihu user info, 查知乎用户关注列表 |
| Content | 知乎热榜, 知乎专栏, zhihu hot list, 查知乎问题回答, get zhihu comments |
| Search | 知乎搜索, zhihu search, 知乎AI搜索, search zhihu for... |

Supports both **English** and **Chinese**.

## Links

- Website: [www.aconfig.cn](https://www.aconfig.cn)

---

Powered by [MaxHub](https://www.aconfig.cn)
