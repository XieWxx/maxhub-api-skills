# B站数据助手

B 站（Bilibili）数据查询与分析 Skill，通过 MaxHub API 接入 B 站全平台公开数据。覆盖视频详情、UP 主画像、关键词搜索、评论弹幕、直播间数据、收藏夹等六大领域共 **41 个端点**。专注服务 B 站 UP 主、二次元内容创作者、番剧追踪者、字幕弹幕研究者与直播数据团队。

- 官网：[https://www.aconfig.cn](https://www.aconfig.cn)
- SkillHub 商店：[https://skillhub.cn/user/user_2a9d366c](https://skillhub.cn/user/user_2a9d366c)
- 仓库：[https://github.com/XieWxx/maxhub-api-skills](https://github.com/XieWxx/maxhub-api-skills)

## 功能

### 视频数据
- 查询视频完整详情，支持 BV 号和 AV 号双入口
- 获取视频播放地址，支持大会员高清播放
- 获取字幕列表与多语言字幕
- 获取分 P 列表，适配多集视频场景
- BV 号与 AV 号双向互转

### UP 主与用户
- 通过分享链接解析用户信息
- 查询 UP 主主页信息与投稿统计
- 获取关系数据：粉丝列表、关注列表、黑名单
- 获取全部投稿列表与动态列表

### 搜索与发现
- 综合搜索、分类搜索（视频/用户/专栏）
- 首页推荐流、热门推荐流
- 影视/番剧分类标签

### 热榜与趋势
- 全站热搜榜

### 评论与弹幕
- 一级评论（App/Web 双端）
- 二级回复
- 全量弹幕数据

### 直播数据
- 直播间详情
- 录播视频列表
- 直播分区目录与主播列表

### 收藏夹
- 用户公开收藏夹列表
- 收藏夹内视频明细

## 安装

```bash
npx clawhub install maxhub-bilibili
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置环境变量：`export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

直接用自然语言与 AI 对话即可：

| 分类 | 示例指令 |
|------|----------|
| 视频 | 帮我查这个 B 站视频的详情和弹幕数据 |
| UP 主 | 帮我分析这个 UP 主的投稿数据和粉丝画像 |
| 搜索 | 帮我搜索 B 站上关于"AI"的热门视频 |
| 热榜 | 帮我看看今天 B 站热搜榜 |
| 评论 | 帮我拉取这个视频的弹幕和评论 |
| 直播 | 帮我查这个直播间的实时数据 |
| 收藏夹 | 帮我查这个用户的公开收藏夹 |

---

由 [MaxHub API](https://www.aconfig.cn) 提供技术支持
