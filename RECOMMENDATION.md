# 🚀 MaxHub API Skills：一站式多平台数据采集利器

> 让 AI 助手轻松获取抖音、TikTok、B站、小红书等 21 个平台的数据

---

## 📖 项目简介

**MaxHub API Skills** 是一套专为 OpenClaw 平台设计的技能集合，通过简单的自然语言指令，即可让 AI 助手获取各大主流平台的公开数据。无论你是数据分析师、内容创作者、市场研究人员还是开发者，都能从中受益。

- **GitHub**: https://github.com/XieWxx/maxhub-api-skills
- **官网**: https://www.aconfig.cn
- **版本**: v1.1.0
- **协议**: MIT License

### 📦 下载地址

| 平台 | 地址 | 说明 |
|------|------|------|
| GitHub | https://github.com/XieWxx/maxhub-api-skills | 源码仓库 |
| ModelScope | https://modelscope.cn/collections/XieWxx/MaxHub-API | 魔搭社区 |
| ClawHub | https://clawhub.ai/u/xiewxx | OpenClaw 技能市场 |

---

## ✨ 核心优势

### 🎯 一站式多平台支持

支持 **21 个主流平台**，覆盖国内外主流社交媒体、视频平台、知识社区：

| 平台类型 | 支持平台 |
|---------|---------|
| 短视频 | 抖音、TikTok、快手、西瓜视频、皮皮虾 |
| 长视频 | B站、YouTube |
| 社交媒体 | 微博、Twitter/X、Instagram、Threads、Reddit、LinkedIn |
| 知识社区 | 知乎、小红书、微信公众号 |
| 其他 | Lemon8、Sora2（AI视频）、临时邮箱 |

### 🔒 安全合规

- ✅ 仅获取公开数据，不触碰用户隐私
- ✅ 通过 HTTPS 加密传输，保障数据安全
- ✅ 不存储、不转发用户凭证
- ✅ 不执行任何平台操纵操作（刷量、刷播放等）
- ✅ 已通过 ClawHub 安全审核

### 🌍 国际化支持

所有 Skill 文档支持 **中英双语**，方便国内外用户使用：
- 简体中文 (zh-CN)
- English (en)

### ⚡ 智能调度

- 自动识别用户意图，选择最合适的 API
- 支持链式调用，自动填充参数
- 内置调用限制，防止意外产生高额费用

---

## 🎪 热门 Skill 推荐

### 1️⃣ maxhub-douyin（抖音）

**API 数量**: 280+

**核心功能**:
- 🔥 实时热搜榜单获取
- 📹 视频详情、评论、点赞数据
- 👤 用户信息、粉丝列表、作品列表
- 🎵 音乐信息、挑战话题
- 🔍 关键词搜索（视频、用户、话题）

**使用场景**:
```
用户: 帮我看看今天抖音热搜第一是什么
AI: 正在获取抖音热搜榜...
    今天的热搜第一是：[话题名称]，热度 1234.5万

用户: 分析一下 @某博主 的粉丝画像
AI: 正在分析该博主的粉丝数据...
    粉丝总数：100万
    活跃度：高
    主要粉丝群体：18-24岁女性
```

---

### 2️⃣ maxhub-tiktok（TikTok 国际版）

**API 数量**: 190+

**核心功能**:
- 🌍 支持多地区（美国、日本、东南亚等）
- 📹 视频、用户、评论、直播数据
- 🎵 音乐、话题挑战
- 🔍 多维度搜索

**使用场景**:
```
用户: 搜索 TikTok 上关于 #AI 的热门视频
AI: 正在搜索 TikTok #AI 话题...
    找到 1000+ 相关视频
    热门视频：
    1. @user1 - "AI绘画教程" - 500万播放
    2. @user2 - "ChatGPT技巧" - 300万播放
```

---

### 3️⃣ maxhub-bilibili（B站）

**API 数量**: 70+

**核心功能**:
- 📺 视频、番剧、影视信息
- 💬 评论、弹幕数据
- 👤 UP主信息、投稿列表
- 🔥 热门视频、排行榜
- 🔍 综合搜索

**使用场景**:
```
用户: 帮我找 B站 上关于"Python教程"的优质视频
AI: 正在搜索 B站 Python 教程...
    推荐视频：
    1. 《Python零基础入门》- 播放 500万 - UP主：某某
    2. 《Python数据分析实战》- 播放 300万 - UP主：某某
```

---

### 4️⃣ maxhub-xiaohongshu（小红书）

**API 数量**: 75+

**核心功能**:
- 📝 笔记详情、评论数据
- 👤 用户信息、粉丝列表
- 🔥 热门话题、推荐笔记
- 🔍 关键词搜索

**使用场景**:
```
用户: 搜索小红书上"护肤"相关的热门笔记
AI: 正在搜索小红书护肤笔记...
    热门笔记：
    1. 《护肤小白必看！》- 点赞 10万 - 收藏 5万
    2. 《敏感肌护肤指南》- 点赞 8万 - 收藏 4万
```

---

### 5️⃣ maxhub-weibo（微博）

**API 数量**: 30+

**核心功能**:
- 🔥 实时热搜榜
- 👤 用户信息、微博列表
- 💬 评论数据
- 🔍 话题搜索

**使用场景**:
```
用户: 今天微博有什么热点？
AI: 正在获取微博热搜...
    今日热点：
    1. #话题1# - 阅读 5亿 - 讨论 10万
    2. #话题2# - 阅读 3亿 - 讨论 8万
```

---

## 🛠️ 快速开始

### 第一步：获取 API Key

1. 访问 [MaxHub 官网](https://www.aconfig.cn)
2. 注册账号并登录
3. 在控制台创建 API Key

### 第二步：配置环境变量

```bash
export MAXHUB_API_KEY=mh_sk_your_api_key_here
export MAXHUB_BASE_URL=https://www.aconfig.cn
```

### 第三步：在 OpenClaw 中安装 Skill

1. 打开 OpenClaw 平台
2. 进入 Skill 市场
3. 搜索 `maxhub-douyin` 或其他需要的 Skill
4. 点击安装

### 第四步：开始使用

直接用自然语言与 AI 对话即可：

```
用户: 帮我看看抖音今天的热搜
AI: [自动调用 maxhub-douyin 获取数据并展示]

用户: 分析一下这个 TikTok 视频的评论情感
AI: [自动获取评论并进行情感分析]
```

---

## 💰 费用说明

- **按次计费**：每次 API 调用收取少量费用
- **余额永不过期**：充值后可长期使用
- **透明计费**：可在控制台查看每次调用的费用明细
- **费用提醒**：连续调用超过 20 次时会自动提醒

---

## 📊 使用统计

| Skill | API 数量 | 主要用途 |
|-------|---------|---------|
| maxhub-douyin | 280+ | 抖音数据分析、热搜监控 |
| maxhub-tiktok | 190+ | TikTok 海外数据分析 |
| maxhub-bilibili | 70+ | B站内容分析、UP主研究 |
| maxhub-xiaohongshu | 75+ | 小红书种草分析 |
| maxhub-weibo | 30+ | 微博舆情监控 |
| maxhub-hybrid | 500+ | 多平台综合分析 |

---

## 🎯 典型应用场景

### 📈 市场研究

```
用户: 帮我分析一下最近一周抖音上"新能源汽车"相关话题的热度趋势
AI: [调用多个 API 获取数据并生成趋势报告]
```

### 📝 内容创作

```
用户: 给我找 10 个小红书上关于"减脂餐"的高赞笔记，分析它们的共同特点
AI: [获取笔记数据并分析内容特点]
```

### 🔍 竞品分析

```
用户: 对比分析 @品牌A 和 @品牌B 在抖音上的粉丝画像和互动数据
AI: [获取双方数据并生成对比报告]
```

### 📊 数据监控

```
用户: 每天早上帮我获取抖音、微博、B站的热搜榜并发送到邮箱
AI: [设置定时任务，自动获取并发送]
```

---

## 🔧 技术特点

### 智能意图识别

系统会自动理解用户意图，选择最合适的 API：

```
用户: 看看这个视频有多少点赞
AI: [识别到需要获取视频详情，自动调用对应 API]
```

### 链式调用

支持自动串联多个 API 调用：

```
用户: 找到抖音上粉丝最多的 10 个美食博主，并分析他们的最新视频
AI: 
  1. 搜索美食博主 → 获取列表
  2. 按粉丝数排序 → 筛选 Top 10
  3. 获取每位博主的最新视频 → 汇总分析
```

### 参数智能填充

系统会自动从上下文中提取参数：

```
用户: 分析 @某博主 的粉丝数据
AI: [自动提取博主 ID，调用粉丝分析 API]
```

---

## 📚 文档资源

- **GitHub 仓库**: https://github.com/XieWxx/maxhub-api-skills
- **API 文档**: https://www.aconfig.cn/api/docs
- **问题反馈**: https://github.com/XieWxx/maxhub-api-skills/issues

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

---

## 📄 开源协议

本项目采用 [MIT License](./LICENSE) 开源协议。

---

## 🌟 Star History

如果这个项目对你有帮助，欢迎 Star ⭐️ 支持！

[![Star History Chart](https://api.star-history.com/svg?repos=XieWxx/maxhub-api-skills&type=Date)](https://star-history.com/#XieWxx/maxhub-api-skills&Date)

---

## 📮 联系我们

- **官网**: https://www.aconfig.cn
- **邮箱**: support@aconfig.cn
- **GitHub**: https://github.com/XieWxx/maxhub-api-skills

---

**MaxHub API Skills** - 让数据采集更简单，让 AI 助手更强大！🚀
