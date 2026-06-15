# YouTube Data Assistant

[中文文档](README_CN.md)

YouTube video, channel, comment, subtitle, stream, Shorts, and community post data assistant via MaxHub API. 38 active endpoints across 4 functional areas.

## Features

| Area | Reference | Endpoints |
|------|-----------|-----------|
| Video | `references/video.md` | Video detail, streams, subtitles/captions, related videos, trending | 13 |
| Channel | `references/channel.md` | Channel info, videos, Shorts, community posts, channel ID lookup | 12 |
| Search | `references/search.md` | General search, Shorts search, channel search, search suggestions | 8 |
| Comments | `references/comments.md` | Video comments, comment replies, post details, post comments/replies | 5 |

Supports both Web and Web V2 API endpoints. See `references/param-mappings.md` for parameter quick reference.

## Install

```bash
npx clawhub install maxhub-youtube
```

## Setup

1. Go to [www.aconfig.cn](https://www.aconfig.cn) to register and get your API Key
2. Configure: `openclaw config set skills.entries.maxhub-youtube.apiKey "<your-key>"` or `export MAXHUB_API_KEY="<your-key>"`

## Usage Examples

| Category | Example prompts |
|----------|----------------|
| Video | Get YouTube video details for..., get subtitles for this YouTube video, get trending YouTube videos |
| Channel | Get YouTube channel info for @..., fetch YouTube channel videos, get YouTube Shorts from this channel |
| Search | Search YouTube for Minecraft tutorials, search YouTube Shorts for..., get YouTube search suggestions for... |
| Comments | Get YouTube video comments for..., get replies to this YouTube comment, check YouTube community post |

Supports both **English** and **Chinese**.

## Links

- Website: [www.aconfig.cn](https://www.aconfig.cn)

---

Powered by [MaxHub](https://www.aconfig.cn)
