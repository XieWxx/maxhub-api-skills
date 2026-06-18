# Threads 数据助手

Threads 数据查询 Skill，通过 MaxHub API 接入 Meta 旗下文字社交平台 Threads。覆盖帖子详情、评论、用户资料、用户帖子/转发/回复列表、Top/Recent 搜索、个人主页搜索等核心能力，共 **11 个端点**。专注服务 Threads 内容研究、Meta 社交监控、海外内容创作与跨平台舆情场景。

- 官网：[https://www.aconfig.cn](https://www.aconfig.cn)
- SkillHub 商店：[https://skillhub.cn/user/user_2a9d366c](https://skillhub.cn/user/user_2a9d366c)
- 仓库：[https://github.com/XieWxx/maxhub-api-skills](https://github.com/XieWxx/maxhub-api-skills)

## 功能

### 帖子查询
- 帖子详情查询（ID/URL 双入口）
- 作者上下文

### 评论追踪
- 一级评论列表

### 用户洞察
- 用户资料查询（用户名/user_id 双入口）
- 原创帖子列表
- 转发/回复列表

### 搜索能力
- 热门排序搜索
- 最新排序搜索
- 人物档案搜索

### 游标分页统一
- 全量列表类查询统一游标翻页

## 安装

```bash
npx clawhub install maxhub-threads
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置环境变量：`export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

直接用自然语言与 AI 对话即可：

| 分类 | 示例指令 |
|------|----------|
| 帖子 | 帮我查这个 Threads 帖子的详情和评论 |
| 用户 | 帮我查这个 Threads 用户的资料和帖子列表 |
| 搜索 | 帮我搜索 Threads 上关于"AI"的热门讨论 |

---

由 [MaxHub API](https://www.aconfig.cn) 提供技术支持
