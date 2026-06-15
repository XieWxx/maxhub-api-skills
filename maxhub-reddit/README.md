# Reddit Data Assistant

[中文文档](README_CN.md)

Reddit data assistant for posts, user profiles, search, subreddits, comments, and trending. 28 active endpoints across 4 functional areas.

## Features

| Area | Reference | Covers | Endpoints |
|------|-----------|--------|-----------|
| User | `references/user.md` | User profiles, active subreddits, comments, posts, trophies | 5 |
| Content | `references/content.md` | Feeds, post details, comments, replies, Reddit Answers | 13 |
| Search | `references/search.md` | Search typeahead, dynamic search, community highlights, trending | 4 |
| Subreddit | `references/subreddit.md` | Subreddit style, channels, info, settings, feed, mute check | 6 |

See `references/param-mappings.md` for parameter quick reference.

## Install

```bash
npx clawhub install maxhub-reddit
```

## Setup

1. Go to [www.aconfig.cn](https://www.aconfig.cn) to register and get your API Key
2. Configure: `openclaw config set skills.entries.maxhub-reddit.apiKey "<your-key>"` or `export MAXHUB_API_KEY="<your-key>"`

## Usage Examples

| Category | Example prompts |
|----------|----------------|
| User | 查Reddit用户 spez 的资料, get Reddit user profile |
| Content | 查Reddit首页推荐, get Reddit post comments |
| Search | reddit搜索 python, search Reddit for programming |
| Subreddit | 查subreddit r/pics 的帖子, get subreddit info for AskReddit |

Supports both **English** and **Chinese**.

## Links

- Website: [www.aconfig.cn](https://www.aconfig.cn)

---

Powered by [MaxHub](https://www.aconfig.cn)
