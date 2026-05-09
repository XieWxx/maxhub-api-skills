# MaxHub API Skills

MaxHub API 平台的 OpenClaw Skill 集合，提供多平台数据采集和分析能力。

## 📋 Skill 列表

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

### v1.1.0 (2026-05-09)

- 修复 ClawHub 安全扫描问题
- 移除高风险 API 端点
- 添加调用限制和安全声明
- 更新文档与安全声明一致性

### v1.0.0 (2026-05-08)

- 初始版本发布
- 支持 21 个平台的数据采集

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**MaxHub API** - 让数据采集更简单
