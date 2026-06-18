# Sora2 数据助手

Sora2 数据查询与视频生成 Skill，通过 MaxHub API 接入 OpenAI Sora2（sora.chatgpt.com）平台。覆盖作品详情、评论回复、Remix 衍生、视频下载、用户资料、社交关系、Cameo 出镜、首页推荐、用户搜索及视频生成任务等全部能力，共 **17 个端点**。专注服务 Sora2 内容创作者、AI 视频研究者、社媒分析师与自动化工作流场景。

- 官网：[https://www.aconfig.cn](https://www.aconfig.cn)
- SkillHub 商店：[https://skillhub.cn/user/user_2a9d366c](https://skillhub.cn/user/user_2a9d366c)
- 仓库：[https://github.com/XieWxx/maxhub-api-skills](https://github.com/XieWxx/maxhub-api-skills)

## 功能

### 作品数据
- 作品详情查询（ID/分享链接双入口）
- 一级评论（翻页）
- 二级回复
- Remix 二创列表
- 无水印下载（降级带水印）
- 首页推荐 Feed

### 用户数据
- 用户名搜索
- 用户完整资料
- 作品列表
- 关注/粉丝列表
- Cameo 出镜记录

### AI 视频生成
- 上传图片素材
- 文生视频
- 图生视频
- 任务状态轮询
- 最终视频 URL 与元信息

### 平台热榜
- Cameo 出镜热度榜单

## 安装

```bash
npx clawhub install maxhub-sora2
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置环境变量：`export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

直接用自然语言与 AI 对话即可：

| 分类 | 示例指令 |
|------|----------|
| 作品 | 帮我查这个 Sora2 视频的详情和评论 |
| 用户 | 帮我查这个 Sora2 创作者的作品列表 |
| 生成 | 帮我用这张图片生成一个 AI 视频 |
| 热榜 | 帮我看看 Sora2 的 Cameo 热度榜 |

---

由 [MaxHub API](https://www.aconfig.cn) 提供技术支持
