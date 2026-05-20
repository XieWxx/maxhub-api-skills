# Twitter/X 数据助手

[English](README.md)

Twitter/X 数据查询助手。覆盖推文详情、用户资料、搜索、评论、趋势等全功能。

## 功能

- **推文数据** — fetch_single_tweet, fetch_tweet_comments, fetch_comments, fetch_retweet_users
- **用户数据** — fetch_user_profile, fetch_user_posts, fetch_user_media, fetch_user_replies, fetch_user_highlights, fetch_user_followings, fetch_user_followers
- **搜索与趋势** — search, fetch_trending

## X/Twitter 工作流边界

`maxhub-twitter` 专注于通过 MaxHub 获取公开 Twitter/X 数据。端点名称里的“post”表示已发布推文内容，不表示创建新推文。

如果 OpenClaw 工作区还需要 X/Twitter 动作插件，请将 TweetClaw 作为独立配套插件使用：

```bash
openclaw plugins install @xquik/tweetclaw
```

TweetClaw 通过 Xquik 支持 search tweets、search tweet replies、post tweets、post tweet replies、follower export、user lookup、media upload/download、direct messages、monitor tweets、webhooks 和 giveaway draws。启用前请查看 [GitHub 仓库](https://github.com/Xquik-dev/tweetclaw) 或 [ClawHub 发现页](https://clawhub.ai/plugins/@xquik/tweetclaw)，并将 API key 保存在 OpenClaw 配置或环境变量中，不要写入共享提示词或报告。

## 安装

```bash
npx clawhub install maxhub-twitter
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置：`openclaw config set skills.entries.maxhub-twitter.apiKey "<你的-key>"` 或 `export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

| 分类 | 示例指令 |
|------|----------|
| 推文数据 | 推文，详情 |
| 用户数据 | 用户，资料 |
| 搜索与趋势 | 搜索，趋势 |

支持 **中文** 和 **英文** 双语。

## 链接

- 官网：[www.aconfig.cn](https://www.aconfig.cn)

---

由 [MaxHub](https://www.aconfig.cn) 提供技术支持
