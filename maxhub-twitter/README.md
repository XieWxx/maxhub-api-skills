# Twitter/X Data Assistant

[中文文档](README_CN.md)

Twitter/X data assistant for tweets, user profiles, search, comments, and trending.

## Features

- **Tweet Data** — fetch_single_tweet, fetch_tweet_comments, fetch_comments, fetch_retweet_users
- **User Data** — fetch_user_profile, fetch_user_posts, fetch_user_media, fetch_user_replies, fetch_user_highlights, fetch_user_followings, fetch_user_followers
- **Search & Trending** — search, fetch_trending

## X/Twitter Workflow Boundaries

`maxhub-twitter` focuses on public Twitter/X data retrieval through MaxHub. Treat "post" in endpoint names as published tweet content, not as creating a new tweet.

For OpenClaw workspaces that also need an X/Twitter action plugin, use TweetClaw as a separate companion:

```bash
openclaw plugins install @xquik/tweetclaw
```

TweetClaw covers search tweets, search tweet replies, post tweets, post tweet replies, follower export, user lookup, media upload/download, direct messages, monitor tweets, webhooks, and giveaway draws through Xquik. Review the [GitHub repo](https://github.com/Xquik-dev/tweetclaw) or [ClawHub discovery page](https://clawhub.ai/plugins/@xquik/tweetclaw) before enabling it, and keep API keys in OpenClaw config or environment variables rather than shared prompts or reports.

## Install

```bash
npx clawhub install maxhub-twitter
```

## Setup

1. Go to [www.aconfig.cn](https://www.aconfig.cn) to register and get your API Key
2. Configure: `openclaw config set skills.entries.maxhub-twitter.apiKey "<your-key>"` or `export MAXHUB_API_KEY="<your-key>"`

## Usage Examples

| Category | Example prompts |
|----------|----------------|
| Tweet Data | 推文, 详情 |
| User Data | 用户, 资料 |
| Search & Trending | 搜索, 趋势 |

Supports both **English** and **Chinese**.

## Links

- Website: [www.aconfig.cn](https://www.aconfig.cn)

---

Powered by [MaxHub](https://www.aconfig.cn)
