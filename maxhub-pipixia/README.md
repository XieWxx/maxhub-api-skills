# 皮皮虾数据助手

皮皮虾数据查询 Skill，通过 MaxHub API 接入字节跳动旗下搞笑短视频与段子社区皮皮虾。覆盖帖子详情、统计、评论、Home Feed、短剧 Feed、综合搜索、热搜词、热搜榜、Hashtag、短链、用户资料、用户作品/粉丝/关注等核心能力，共 **17 个端点**。专注服务段子创作、短视频选题、搞笑内容研究与用户画像场景。

- 官网：[https://www.aconfig.cn](https://www.aconfig.cn)
- SkillHub 商店：[https://skillhub.cn/user/user_2a9d366c](https://skillhub.cn/user/user_2a9d366c)
- 仓库：[https://github.com/XieWxx/maxhub-api-skills](https://github.com/XieWxx/maxhub-api-skills)

## 功能

### 帖子内容
- 帖子详情查询
- 统计数据（播放/点赞/评论/转发）
- 评论列表

### Feed 流双链路
- 综合首页推荐 Feed
- 短剧专区 Feed

### 搜索与热搜
- 关键词综合搜索
- 热搜词列表
- 热搜榜单与详情

### Hashtag 深挖
- 话题详情
- 话题帖子列表（热门/最新排序）

### 短链工具
- 原始 URL → 分享短链

### 用户画像
- 用户资料查询
- 作品列表
- 粉丝/关注列表

## 安装

```bash
npx clawhub install maxhub-pipixia
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置环境变量：`export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

直接用自然语言与 AI 对话即可：

| 分类 | 示例指令 |
|------|----------|
| 帖子 | 帮我查这个皮皮虾帖子的详情和评论 |
| 搜索 | 帮我搜索皮皮虾上的热门段子 |
| 热榜 | 帮我看看今天皮皮虾热搜榜 |
| 用户 | 帮我查这个皮皮虾创作者的基本信息 |

---

由 [MaxHub API](https://www.aconfig.cn) 提供技术支持
