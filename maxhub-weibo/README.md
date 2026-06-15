# Weibo Data Assistant

[中文文档](README_CN.md)

Weibo posts, users, search, comments, hot search rankings, and video feed data assistant via MaxHub API. 64 active endpoints across 4 functional areas.

## Features

| Area | Reference | Endpoints |
|------|-----------|-----------|
| Posts | `references/post.md` | Post detail, reposts, likes, video detail, feeds, trending content, channel hot | 14 |
| Users | `references/user.md` | User profiles, followers/following, posts, timeline, original posts, super topics, videos, articles, audio, collections, groups | 22 |
| Search | `references/search.md` | Comprehensive search, AI search, advanced search, realtime search, video/picture/topic search, hot search rankings, entertainment/social/life rankings | 23 |
| Comments | `references/comments.md` | Post comments, sub-comments, comment replies | 5 |

Supports App, Web, and Web V2 API endpoints. See `references/param-mappings.md` for parameter quick reference.

## Install

```bash
npx clawhub install maxhub-weibo
```

## Setup

1. Go to [www.aconfig.cn](https://www.aconfig.cn) to register and get your API Key
2. Configure: `openclaw config set skills.entries.maxhub-weibo.apiKey "<your-key>"` or `export MAXHUB_API_KEY="<your-key>"`

## Usage Examples

| Category | Example prompts |
|----------|----------------|
| Posts | 查这条微博的详情 5016922058656962, get Weibo post detail for..., 这条微博有多少转发 |
| Users | 查微博用户 uid 7648703289 的粉丝数和微博列表, get Weibo user profile and followers, 查这个用户的原创微博 |
| Search | 搜微博关于人工智能的内容, search Weibo for AI, 查微博热搜榜, get Weibo hot search ranking |
| Comments | 查微博评论, get Weibo post comments, 查这条评论的回复 |

Supports both **English** and **Chinese**.

## Links

- Website: [www.aconfig.cn](https://www.aconfig.cn)

---

Powered by [MaxHub](https://www.aconfig.cn)
