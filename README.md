# MaxHub Skills

20 platform API skills for AI agent data query, providing 995+ active endpoints across major social media, video, and content platforms. All skills refactored with semantic reference routing for fast, accurate agent usage.

## Skills

| # | Skill | Platform | Endpoints | Reference Files |
|---|-------|----------|-----------|-----------------|
| 1 | 📺 maxhub-bilibili | B站 | 41 | video, user, search, comments, live, collections |
| 2 | 🎵 maxhub-douyin | 抖音 | 273 | video, user, search, trending, creator, xingtu, comments, content, live |
| 3 | 📸 maxhub-instagram | Instagram | 87 | post, user, search, comments |
| 4 | 🎬 maxhub-kuaishou | 快手 | 38 | video, user, search, comments, live |
| 5 | 🍋 maxhub-lemon8 | Lemon8 | 16 | user, content |
| 6 | 💼 maxhub-linkedin | LinkedIn | 85 | user, company, jobs, content |
| 7 | 🦐 maxhub-pipixia | 皮皮虾 | 17 | user, content |
| 8 | 🤖 maxhub-reddit | Reddit | 28 | user, content, search, subreddit |
| 9 | 🎥 maxhub-sora2 | Sora2 | 17 | post, user, tools |
| 10 | 📧 maxhub-temp-mail | 临时邮箱 | 3 | content |
| 11 | 🧵 maxhub-threads | Threads | 11 | user, content |
| 12 | 🎶 maxhub-tiktok | TikTok | 174 | video, user, search, comments, ads, creator, shop, analytics |
| 13 | 📰 maxhub-toutiao | 今日头条 | 7 | content |
| 14 | 𝕏 maxhub-twitter | Twitter/X | 12 | user, content |
| 15 | 💬 maxhub-wechat | 微信 | 22 | channels, mp, search |
| 16 | 🐦 maxhub-weibo | 微博 | 64 | post, user, search, comments |
| 17 | 📕 maxhub-xiaohongshu | 小红书 | 38 | note, user, search, product |
| 18 | 🍉 maxhub-xigua | 西瓜视频 | 7 | content |
| 19 | ▶️ maxhub-youtube | YouTube | 38 | video, channel, search, comments |
| 20 | 💡 maxhub-zhihu | 知乎 | 34 | user, content, search |

Total: **995 active endpoints**

## Setup

1. Get API key at [www.aconfig.cn](https://www.aconfig.cn)
2. `export MAXHUB_API_KEY="<your-key>"`
3. Agent auto-activates based on user intent + platform trigger terms

## Structure

```
maxhub-{platform}/
├── SKILL.md              # Agent entry point: routing table, chains, protocols
├── README.md / README_CN.md
├── _meta.json
└── references/           # Semantic files (load only what's needed)
    ├── video.md / user.md / search.md / ...
    └── param-mappings.md
```

All skills follow the [Agent Skills](https://agentskills.io) standard with:
- **Progressive disclosure** — agent loads only relevant reference files
- **Semantic routing** — filenames describe content, no blind scanning
- **Chain guidance** — common multi-step patterns documented
- **ClawHub compliant** — security notices on every reference, no pricing, no cross-contamination
