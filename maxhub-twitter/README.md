# Twitter/X 数据助手

Twitter/X 数据查询与海外舆情研究 Skill，通过 MaxHub API 接入 Twitter/X 平台。覆盖推文详情、评论（最新/热门）、转推用户列表、搜索时间线、趋势话题、用户资料、用户推文/回复/媒体、关注/粉丝、用户精选推文等全部能力，共 **13 个端点**。专注服务海外舆情监控、Twitter KOL 影响力分析、推文爆款研究、趋势话题追踪等场景。

- 官网：[https://www.aconfig.cn](https://www.aconfig.cn)
- SkillHub 商店：[https://skillhub.cn/user/user_2a9d366c](https://skillhub.cn/user/user_2a9d366c)
- 仓库：[https://github.com/XieWxx/maxhub-api-skills](https://github.com/XieWxx/maxhub-api-skills)

## 功能

### 推文详情
- 完整详情查询（正文/媒体/发布时间/来源/引用回复链路）
- 互动数据（点赞/转推/引用/评论/书签）
- 作者基础画像

### 评论双轨
- 热门评论（热度排序）
- 最新评论（时间倒序）

### 转推用户列表
- 传播链路与扩散节点识别

### 搜索时间线
- 全站搜索（最新/热门/用户/媒体四种类型）
- 游标翻页

### 趋势话题
- 按国家/地区实时趋势榜（美国/英国/日本等）

### 用户画像
- 完整资料（头像/简介/注册时间/所在地/认证/粉丝关注数）
- 推文时间线、回复时间线、媒体推文
- 关注/粉丝列表
- 精选/置顶高光推文
- screen_name ↔ rest_id 互通（用户名与数字 ID 双入口）

## 安装

```bash
npx clawhub install maxhub-twitter
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置环境变量：`export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

直接用自然语言与 AI 对话即可：

| 分类 | 示例指令 |
|------|----------|
| 推文 | 帮我查这条推文的详情和互动数据 |
| 搜索 | 帮我搜索 Twitter 上关于"AI"的最新讨论 |
| 趋势 | 帮我看看美国地区 Twitter 趋势话题 |
| 用户 | 帮我分析这个 Twitter 账号的粉丝画像 |
| 评论 | 帮我拉取这条推文的热门评论 |

---

由 [MaxHub API](https://www.aconfig.cn) 提供技术支持
