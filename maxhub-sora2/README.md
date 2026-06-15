# Sora2 Data Assistant

[中文文档](README_CN.md)

Sora2 (sora.chatgpt.com) data assistant — query posts, users, comments, Cameo
features, and trigger Sora2 video generation tasks via the MaxHub API.

## Features

- **Post & Content** — `get_post_detail`, `get_post_comments`, `get_comment_replies`,
  `get_post_remix_list`, `get_video_download_info`, `get_feed`
- **User** — `get_user_profile`, `get_user_posts`, `get_user_following`,
  `get_user_followers`, `get_user_cameo_appearances`, `search_users`
- **Tools & Cameo** — `create_video`, `get_task_status`, `get_task_detail`,
  `upload_image`, `get_cameo_leaderboard`

## Install

```bash
npx clawhub install maxhub-sora2
```

## Setup

1. Go to [www.aconfig.cn](https://www.aconfig.cn) to register and get your API Key
2. Configure: `openclaw config set skills.entries.maxhub-sora2.apiKey "<your-key>"` or `export MAXHUB_API_KEY="<your-key>"`

## Usage Examples

| Category | Example prompts |
|----------|----------------|
| Post & Content | "Get this Sora2 post detail", "查这个 sora 作品的评论" |
| User | "Search Sora2 user 'sam'", "查这个用户的作品" |
| Tools & Cameo | "Create a Sora2 video", "查 Cameo 出镜热榜" |

Supports both **English** and **Chinese**.

## Links

- Website: [www.aconfig.cn](https://www.aconfig.cn)

---

Powered by [MaxHub](https://www.aconfig.cn)
