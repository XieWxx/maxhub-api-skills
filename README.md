# MaxHub API Skills / MaxHub API 技能集合

[English](#english) | [中文](#中文)

---

<a name="中文"></a>
## 📋 Skill 列表

MaxHub API 平台的 OpenClaw Skill 集合，提供多平台数据采集和分析能力。

| Skill | 平台 | 功能 | API数量 |
|-------|------|------|---------|
| [maxhub-douyin](./maxhub-douyin) | 抖音 | 热搜、视频、用户、评论等数据采集 | 280+ |
| [maxhub-tiktok](./maxhub-tiktok) | TikTok | 视频、用户、评论、直播等数据采集 | 190+ |
| [maxhub-bilibili](./maxhub-bilibili) | B站 | 视频、用户、评论、直播等数据采集 | 70+ |
| [maxhub-xiaohongshu](./maxhub-xiaohongshu) | 小红书 | 笔记、用户、评论等数据采集 | 75+ |
| [maxhub-weibo](./maxhub-weibo) | 微博 | 热搜、用户、评论等数据采集 | 30+ |
| [maxhub-kuaishou](./maxhub-kuaishou) | 快手 | 视频、用户、评论等数据采集 | 50+ |
| [maxhub-youtube](./maxhub-youtube) | YouTube | 视频、频道、评论等数据采集 | 40+ |
| [maxhub-twitter](./maxhub-twitter) | Twitter/X | 推文、用户、评论等数据采集 | 30+ |
| [maxhub-instagram](./maxhub-instagram) | Instagram | 帖子、用户、评论等数据采集 | 30+ |
| [maxhub-zhihu](./maxhub-zhihu) | 知乎 | 问答、用户、评论等数据采集 | 25+ |
| [maxhub-toutiao](./maxhub-toutiao) | 今日头条 | 文章、用户、评论等数据采集 | 20+ |
| [maxhub-xigua](./maxhub-xigua) | 西瓜视频 | 视频、用户、评论等数据采集 | 15+ |
| [maxhub-pipixia](./maxhub-pipixia) | 皮皮虾 | 视频、用户、评论等数据采集 | 15+ |
| [maxhub-lemon8](./maxhub-lemon8) | Lemon8 | 帖子、用户、评论等数据采集 | 20+ |
| [maxhub-threads](./maxhub-threads) | Threads | 帖子、用户、评论等数据采集 | 15+ |
| [maxhub-linkedin](./maxhub-linkedin) | LinkedIn | 职位、公司、用户等数据采集 | 20+ |
| [maxhub-reddit](./maxhub-reddit) | Reddit | 帖子、评论、用户等数据采集 | 20+ |
| [maxhub-wechat](./maxhub-wechat) | 微信公众号 | 文章、评论等数据采集 | 15+ |
| [maxhub-sora2](./maxhub-sora2) | Sora2 | AI视频生成 | 5+ |
| [maxhub-temp-mail](./maxhub-temp-mail) | 临时邮箱 | 临时邮箱服务 | 5+ |
| [maxhub-hybrid](./maxhub-hybrid) | 多平台 | 综合数据采集 | 500+ |

## 🚀 快速开始

### 1. 获取 API Key

访问 [MaxHub 官网](https://www.aconfig.cn) 注册账号并获取 API Key。

### 2. 配置环境变量

```bash
export MAXHUB_API_KEY=mh_sk_your_api_key_here
export MAXHUB_BASE_URL=https://www.aconfig.cn
```

### 3. 使用 Skill

在 OpenClaw 中安装对应的 skill 即可使用。

## 🔒 安全声明

所有 Skill 均遵循以下安全原则：

- ✅ 仅通过 HTTPS 调用 MaxHub API
- ✅ 不存储、不转发用户凭证
- ✅ 不访问本地文件系统
- ✅ 不执行任何平台操纵操作（刷量、刷播放等）
- ✅ 不生成平台安全绕过签名

## ⚡ 调用限制

为保护用户账户安全和控制费用，所有 Skill 遵循以下限制：

| 限制项 | 默认值 |
|--------|--------|
| 单次最大翻页数 | 5页 |
| 单次最大返回条数 | 50条 |
| 链式调用最大深度 | 3层 |
| 批量操作最大数量 | 10条 |
| 费用提醒阈值 | 连续调用超过20次时提醒 |

## 📖 文档

每个 Skill 目录包含：

- `SKILL.md` - Skill 说明文档
- `references/api-catalog.md` - API 目录

## 🔗 相关链接

- [MaxHub 官网](https://www.aconfig.cn)
- [API 文档](https://www.aconfig.cn/api/docs)
- [GitHub 仓库](https://github.com/XieWxx/maxhub-api-skills)

## 📝 版本历史

### v1.1.1 (2026-05-09)

- 修复 YAML 元数据格式（分隔符、缩进、空值字段）
- repository 地址从 gitee 改为 GitHub
- 统一所有 skill 的 metadata 结构
- 建立 develop 开发分支流程

### v1.1.0 (2026-05-09)

- 修复 ClawHub 安全扫描问题
- 移除高风险 API 端点
- 添加调用限制和安全声明
- 更新文档与安全声明一致性
- **新增：所有文档支持中英双语**

### v1.0.0 (2026-05-08)

- 初始版本发布
- 支持 21 个平台的数据采集

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

<a name="english"></a>
## 📋 Skill List

OpenClaw Skill collection for MaxHub API platform, providing multi-platform data collection and analysis capabilities.

| Skill | Platform | Features | APIs |
|-------|----------|----------|------|
| [maxhub-douyin](./maxhub-douyin) | Douyin | Hot search, videos, users, comments, etc. | 280+ |
| [maxhub-tiktok](./maxhub-tiktok) | TikTok | Videos, users, comments, live streams, etc. | 190+ |
| [maxhub-bilibili](./maxhub-bilibili) | Bilibili | Videos, users, comments, live streams, etc. | 70+ |
| [maxhub-xiaohongshu](./maxhub-xiaohongshu) | Xiaohongshu | Posts, users, comments, etc. | 75+ |
| [maxhub-weibo](./maxhub-weibo) | Weibo | Hot search, users, comments, etc. | 30+ |
| [maxhub-kuaishou](./maxhub-kuaishou) | Kuaishou | Videos, users, comments, etc. | 50+ |
| [maxhub-youtube](./maxhub-youtube) | YouTube | Videos, channels, comments, etc. | 40+ |
| [maxhub-twitter](./maxhub-twitter) | Twitter/X | Tweets, users, comments, etc. | 30+ |
| [maxhub-instagram](./maxhub-instagram) | Instagram | Posts, users, comments, etc. | 30+ |
| [maxhub-zhihu](./maxhub-zhihu) | Zhihu | Q&A, users, comments, etc. | 25+ |
| [maxhub-toutiao](./maxhub-toutiao) | Toutiao | Articles, users, comments, etc. | 20+ |
| [maxhub-xigua](./maxhub-xigua) | Xigua Video | Videos, users, comments, etc. | 15+ |
| [maxhub-pipixia](./maxhub-pipixia) | Pipixia | Videos, users, comments, etc. | 15+ |
| [maxhub-lemon8](./maxhub-lemon8) | Lemon8 | Posts, users, comments, etc. | 20+ |
| [maxhub-threads](./maxhub-threads) | Threads | Posts, users, comments, etc. | 15+ |
| [maxhub-linkedin](./maxhub-linkedin) | LinkedIn | Jobs, companies, users, etc. | 20+ |
| [maxhub-reddit](./maxhub-reddit) | Reddit | Posts, comments, users, etc. | 20+ |
| [maxhub-wechat](./maxhub-wechat) | WeChat Official | Articles, comments, etc. | 15+ |
| [maxhub-sora2](./maxhub-sora2) | Sora2 | AI video generation | 5+ |
| [maxhub-temp-mail](./maxhub-temp-mail) | Temp Mail | Temporary email service | 5+ |
| [maxhub-hybrid](./maxhub-hybrid) | Multi-platform | Comprehensive data collection | 500+ |

## 🚀 Quick Start

### 1. Get API Key

Visit [MaxHub Official Site](https://www.aconfig.cn) to register and get your API Key.

### 2. Configure Environment Variables

```bash
export MAXHUB_API_KEY=mh_sk_your_api_key_here
export MAXHUB_BASE_URL=https://www.aconfig.cn
```

### 3. Use Skills

Install the corresponding skill in OpenClaw to start using.

## 🔒 Security Statement

All Skills follow these security principles:

- ✅ Only call MaxHub API via HTTPS
- ✅ Do not store or forward user credentials
- ✅ Do not access local file system
- ✅ Do not perform any platform manipulation (fake views, likes, etc.)
- ✅ Do not generate platform security bypass signatures

## ⚡ Rate Limits

To protect user account security and control costs, all Skills follow these limits:

| Limit Item | Default Value |
|------------|---------------|
| Max pages per request | 5 pages |
| Max results per request | 50 items |
| Max chain call depth | 3 layers |
| Max batch operation size | 10 items |
| Cost alert threshold | Alert after 20 consecutive calls |

## 📖 Documentation

Each Skill directory contains:

- `SKILL.md` - Skill documentation
- `references/api-catalog.md` - API catalog

## 🔗 Related Links

- [MaxHub Official Site](https://www.aconfig.cn)
- [API Documentation](https://www.aconfig.cn/api/docs)
- [GitHub Repository](https://github.com/XieWxx/maxhub-api-skills)

## 📝 Version History

### v1.1.0 (2026-05-09)

- Fixed ClawHub security scan issues
- Removed high-risk API endpoints
- Added rate limits and security statements
- Updated documentation for security statement consistency
- **New: All documentation now supports bilingual (Chinese/English)**

### v1.0.0 (2026-05-08)

- Initial release
- Support for 21 platforms data collection

## 📄 License

MIT License

## 🤝 Contributing

Issues and Pull Requests are welcome!

---

**MaxHub API** - Making Data Collection Easier / 让数据采集更简单
