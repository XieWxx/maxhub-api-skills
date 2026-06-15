# Instagram Data Assistant

[中文文档](README_CN.md)

Instagram post, reel, story, user, search, and comment data assistant via MaxHub API. 87 active endpoints across 4 functional areas.

## Features

| Area | Reference | Covers | Endpoints |
|------|-----------|--------|-----------|
| Posts & Reels | `references/post.md` | Post details, Reels, Stories, Highlights, likes, tagged posts, reposts, music posts, media ID conversion, oEmbed, translation | 34 |
| User | `references/user.md` | User profiles, posts, followers, following, related profiles, about, former usernames | 24 |
| Search | `references/search.md` | User search, hashtag search, location search, general search, explore feed, location details | 23 |
| Comments | `references/comments.md` | Post comments, comment replies | 6 |

Supports V1, V2, and V3 API endpoints. See `references/param-mappings.md` for parameter quick reference.

## Install

```bash
npx clawhub install maxhub-instagram
```

## Setup

1. Go to [www.aconfig.cn](https://www.aconfig.cn) to register and get your API Key
2. Configure: `openclaw config set skills.entries.maxhub-instagram.apiKey "<your-key>"` or `export MAXHUB_API_KEY="<your-key>"`

## Usage Examples

| Category | Example prompts |
|----------|----------------|
| Posts & Reels | get Instagram post info for..., 查这个Instagram帖子的详情... |
| User | get Instagram user profile for..., 查这个Instagram用户的粉丝数和帖子... |
| Search | search Instagram for..., 在Instagram上搜索... |
| Comments | get Instagram post comments for..., 查这个Instagram帖子的评论... |

Supports both **English** and **Chinese**.

## Links

- Website: [www.aconfig.cn](https://www.aconfig.cn)

---

Powered by [MaxHub](https://www.aconfig.cn)
