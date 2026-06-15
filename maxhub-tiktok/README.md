# TikTok Data Assistant

[中文文档](README_CN.md)

TikTok comprehensive data assistant covering video, user, search, comments, live, ads, creator, shop, analytics, and crypto tools with App and Web API support.

## Features

- **Video & Content** — video detail, batch video, share URL parsing, explore feed, home feed, tag videos, mixes, video ID extraction (19 endpoints)
- **User Data** — user profile, followers/following, posts/likes/reposts, collections, playlists, music list, creator info, user ID extraction (34 endpoints)
- **Search & Discovery** — general search, type search (video/user/music/hashtag/live/location/photo), trending keywords, hashtag/music detail, creator search insights, product search (29 endpoints)
- **Comments & Live** — video comments, comment replies, live room info/status/ranking, live products, danmaku/chat, gifts (21 endpoints)
- **Ads** — ad search, ad detail, top ads spotlight, keyframe/percentile/interactive analysis, recommended ads, trending hashtags (12 endpoints)
- **Creator Tools** — account health, violations, revenue overview, live/video/product analytics, showcase, audience stats (14 endpoints)
- **Shop & Ecommerce** — product detail/reviews, seller products, search suggestions, product search, category browsing, hot selling, shop info (26 endpoints)
- **Analytics** — video metrics, fake view detection, comment keywords, creator milestones (4 endpoints)
- **Crypto & Tools** — msToken, ttwid, web_id, XBogus/XGnarly signing, strData encrypt/decrypt, device registration, guest cookie (15 endpoints)

## Install

```bash
npx clawhub install maxhub-tiktok
```

## Setup

1. Go to [www.aconfig.cn](https://www.aconfig.cn) to register and get your API Key
2. Configure: `openclaw config set skills.entries.maxhub-tiktok.apiKey "<your-key>"` or `export MAXHUB_API_KEY="<your-key>"`

## Usage Examples

| Category | Example prompts |
|----------|----------------|
| Video & Content | 查TikTok视频 + video URL, 批量获取视频数据, 解析TikTok分享链接 |
| User Data | 查TikTok用户 + @username, 获取粉丝列表, 查看用户作品 |
| Search & Discovery | 在TikTok搜索 + keyword, TikTok热榜, 搜索TikTok话题 |
| Comments & Live | 查TikTok视频评论, 直播间状态, 获取直播弹幕 |
| Ads | 搜索TikTok广告, 广告详情分析, TikTok热门广告 |
| Creator Tools | TikTok创作者数据分析, 账号健康状态, 直播收益概览 |
| Shop & Ecommerce | 查TikTok Shop商品, 搜索商品, 热卖商品列表 |
| Analytics | TikTok视频数据分析, 虚假流量检测, 评论关键词分析 |
| Crypto & Tools | 生成TikTok XBogus签名, 获取游客Cookie, 设备注册 |

Supports both **English** and **Chinese**.

## Links

- Website: [www.aconfig.cn](https://www.aconfig.cn)

---

Powered by [MaxHub](https://www.aconfig.cn)
