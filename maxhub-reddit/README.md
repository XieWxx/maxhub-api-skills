# Reddit 数据助手

Reddit 数据查询 Skill，通过 MaxHub API 接入 Reddit 社区平台。覆盖 Subreddit 版块信息、Home/Popular/Games/News/Explore/Topic 多类 Feed、帖子详情与批量、评论与子回复、用户资料/帖子/评论/奖杯、综合搜索与社区亮点等全部能力，共 **28 个端点**。专注服务海外社区舆情监控、产品反馈采集、Reddit KOL 追踪与趋势话题挖掘业务。

- 官网：[https://www.aconfig.cn](https://www.aconfig.cn)
- SkillHub 商店：[https://skillhub.cn/user/user_2a9d366c](https://skillhub.cn/user/user_2a9d366c)
- 仓库：[https://github.com/XieWxx/maxhub-api-skills](https://github.com/XieWxx/maxhub-api-skills)

## 功能

### 帖子数据
- 单条/批量帖子详情查询（图文/Carousel/视频）
- 锚定评论 ID

### 评论与回复
- 一级评论（游标翻页，best/top/new/controversial 排序）
- 二级回复

### Subreddit 画像
- 版块资料卡与视觉样式
- 内部分类频道
- 高级设置与静音检查
- 帖子流

### 用户画像
- 基础资料卡（karma/注册时间/头像）
- 活跃 Subreddit 列表
- 历史帖子/评论
- 奖杯

### 多类 Feed 矩阵
- Home/Popular/Games/News/Explore/Topic 六类 Feed

### 搜索能力
- 动态综合搜索
- 自动补全
- 热门搜索词
- 社区亮点
- 多维过滤

### Reddit Answers 精简数据
- LLM 友好的精简帖子/评论接口

## 安装

```bash
npx clawhub install maxhub-reddit
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置环境变量：`export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

直接用自然语言与 AI 对话即可：

| 分类 | 示例指令 |
|------|----------|
| 帖子 | 帮我查这个 Reddit 帖子的详情和评论 |
| Subreddit | 帮我分析 r/ArtificialIntelligence 的热门帖子 |
| 搜索 | 帮我搜索 Reddit 上关于"ChatGPT"的讨论 |
| 用户 | 帮我查这个 Reddit 用户的活跃版块 |
| Feed | 帮我看看 Reddit 首页热门内容 |

---

由 [MaxHub API](https://www.aconfig.cn) 提供技术支持
