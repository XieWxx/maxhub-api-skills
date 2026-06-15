# Toutiao Data Assistant

[中文文档](README_CN.md)

Toutiao article, video, user, and comment data assistant via MaxHub API. 7 active endpoints across 1 functional area.

## Features

| Area | Reference | Covers | Endpoints |
|------|-----------|--------|-----------|
| Content | `references/content.md` | Articles, videos, user profiles, user ID extraction, comments (App+Web) | 7 |

Supports both App and Web API endpoints. See `references/param-mappings.md` for parameter quick reference.

## Install

```bash
npx clawhub install maxhub-toutiao
```

## Setup

1. Go to [www.aconfig.cn](https://www.aconfig.cn) to register and get your API Key
2. Configure: `openclaw config set skills.entries.maxhub-toutiao.apiKey "<your-key>"` or `export MAXHUB_API_KEY="<your-key>"`

## Usage Examples

| Category | Example prompts |
|----------|----------------|
| Article | 查今日头条文章详情 7450114952884503059, get Toutiao article info for... |
| Video | 查今日头条视频信息, get Toutiao video info for group_id... |
| User | 查今日头条用户主页, get Toutiao user info for... |
| Comments | 查今日头条文章评论, get Toutiao article comments |
| Search by URL | 从头条用户主页URL获取用户ID, extract user ID from Toutiao profile URL |

Supports both **English** and **Chinese**.

## Links

- Website: [www.aconfig.cn](https://www.aconfig.cn)

---

Powered by [MaxHub](https://www.aconfig.cn)
