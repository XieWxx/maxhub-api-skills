# Douyin Data Assistant

[中文文档](README_CN.md)

Comprehensive Douyin data assistant covering video, user, search, trending, creator, xingtu KOL, content index, live, comments, and tools. 273 endpoints across 10 functional areas.

## Features

| Category | Endpoints | Description |
|----------|-----------|-------------|
| **Video** | 42 | Video detail (single/batch), high-quality play URLs, statistics, mix/series, music/hashtag detail, share/short URL/QR, channel content, related posts, ID extraction |
| **User** | 24 | User profile (multi-method lookup), fans/following lists, user posts, liked videos, collections, batch profiles, user search |
| **Search** | 19 | General search, video/user/image/live/hashtag search, search suggestions, multi-search, experience/music/discussion/school/vision search |
| **Trending** | 39 | Billboard categories, rising/city/challenge hot lists, activity calendar, audience portraits, video/topic/search hot lists, hot words, home feed, video channels |
| **Creator** | 29 | Creator activities, material center billboards, hot spot/topic/props/music/challenge lists, courses, missions, industry configs, item analytics, audience analysis, account diagnosis, live history |
| **Xingtu KOL** | 43 | KOL ID lookup, base info, audience/fans portrait, service pricing, data overview, KOL search, conversion analysis, xingtu index, video performance, hot comment analysis, ranking lists, creator marketplace, MCN search, IP calendar |
| **Content Index** | 44 | Keyword trends, relation words, crowd portrait, daren/creator analytics, brand index/radar/lines/cycles, topic search, content creation guides, audience/creator portraits, consumption/interaction trends, insight reports |
| **Comments** | 6 | Video comments, comment replies, video danmaku (App + Web) |
| **Live** | 14 | Live stream data, danmaku, gift rankings, room products, product SKU/coupon/reviews, live room ID conversion |
| **Tools** | 13 | Device registration, app deep-links, guest cookie, token generators (msToken/ttwid/verify_fp/s_v_web_id), signature generators (X-Bogus/A-Bogus/danmaku xb) |

## Install

```bash
npx clawhub install maxhub-douyin
```

## Setup

1. Go to [www.aconfig.cn](https://www.aconfig.cn) to register and get your API Key
2. Configure: `openclaw config set skills.entries.maxhub-douyin.apiKey "<your-key>"` or `export MAXHUB_API_KEY="<your-key>"`

## Usage Examples

| Category | Example prompts (中文) | Example prompts (English) |
|----------|----------------------|--------------------------|
| Video | 查抖音视频 aweme_id=... | Get Douyin video details aweme_id=... |
| User | 查抖音用户 sec_user_id=... | Get Douyin user profile sec_user_id=... |
| Search | 搜索抖音关键词 "美食" | Search Douyin for "food" |
| Trending | 查抖音热榜 | Show Douyin trending list |
| Creator | 查创作者后台作品数据 | Get Douyin creator item analytics |
| Xingtu KOL | 查星图达人数据 kolId=... | Get Douyin Xingtu KOL data kolId=... |
| Content Index | 查抖音指数关键词趋势 | Get Douyin index keyword trends |
| Comments | 查抖音视频评论 | Get Douyin video comments |
| Live | 查抖音直播数据 | Get Douyin live stream data |
| Tools | 生成抖音游客Cookie | Generate Douyin guest Cookie |

Supports both **English** and **Chinese**.

## Links

- Website: [www.aconfig.cn](https://www.aconfig.cn)

---

Powered by [MaxHub](https://www.aconfig.cn)
