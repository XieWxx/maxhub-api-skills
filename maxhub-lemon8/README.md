# Lemon8 Data Assistant

[中文文档](README_CN.md)

Lemon8 content data assistant via MaxHub API. 16 active endpoints across 2 functional areas.

## Features

| Area | Reference | Covers | Endpoints |
|------|-----------|--------|-----------|
| User | `references/user.md` | User profiles, followers, following, ID extraction | 5 |
| Content | `references/content.md` | Post detail, comments, discover, topics, search, ID extraction | 11 |

See `references/param-mappings.md` for parameter quick reference.

## Install

```bash
npx clawhub install maxhub-lemon8
```

## Setup

1. Go to [www.aconfig.cn](https://www.aconfig.cn) to register and get your API Key
2. Configure: `openclaw config set skills.entries.maxhub-lemon8.apiKey "<your-key>"` or `export MAXHUB_API_KEY="<your-key>"`

## Usage Examples

| Category | Example prompts |
|----------|----------------|
| User | 查柠檬8用户信息, get Lemon8 user profile, 查lemon8用户的粉丝与关注 |
| Content | 查柠檬8帖子详情, search Lemon8 for makeup, 查lemon8发现页, 查lemon8话题帖子 |

Supports both **English** and **Chinese**.

## Links

- Website: [www.aconfig.cn](https://www.aconfig.cn)

---

Powered by [MaxHub](https://www.aconfig.cn)
