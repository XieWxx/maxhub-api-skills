# 知乎数据助手

知乎数据查询 Skill，通过 MaxHub API 接入中文专业问答与知识社区知乎。覆盖问题回答、专栏文章、评论/子评论、热榜推荐、视频列表、用户资料、用户关注/粉丝/文章/收藏/话题、综合搜索+AI 搜索+多类目搜索等核心能力，共 **34 个端点**。专注服务知乎内容研究、问答营销、KOL 分析、话题追踪与舆情场景。

- 官网：[https://www.aconfig.cn](https://www.aconfig.cn)
- SkillHub 商店：[https://skillhub.cn/user/user_2a9d366c](https://skillhub.cn/user/user_2a9d366c)
- 仓库：[https://github.com/XieWxx/maxhub-api-skills](https://github.com/XieWxx/maxhub-api-skills)

## 功能

### 专栏与问答全维度
- 专栏文章列表（翻页）
- 文章详情查询
- 专栏推荐/关联
- 关注关系/评论配置
- 问题全部回答（热度/时间排序）

### 评论双链路
- 主评论列表
- 子评论（盖楼）
- 长尾翻页

### 热榜矩阵
- 全站热榜
- 首页热门推荐流
- 视频热门列表

### 搜索能力
- 文章/用户/话题/专栏/视频/盐选/电子书搜索
- 学者搜索
- 预设/推荐/联想搜索词

### AI 搜索异步链路
- AI 直答提交 → 轮询 → 获取结果
- 失败降级到普通文章搜索

### 用户全景画像
- 基础资料/签名/认证/统计
- 关注/粉丝列表
- 文章/收藏文章
- 关注专栏/问题/收藏夹/话题
- 推荐关注者

## 安装

```bash
npx clawhub install maxhub-zhihu
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置环境变量：`export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

直接用自然语言与 AI 对话即可：

| 分类 | 示例指令 |
|------|----------|
| 热榜 | 帮我看看今天知乎热榜 |
| 问答 | 帮我查这个问题下的高赞回答 |
| 用户 | 帮我分析这个知乎大 V 的关注领域 |
| 搜索 | 帮我搜索知乎上关于"AI"的优质文章 |
| 专栏 | 帮我查这个专栏的全部文章 |
| AI 搜索 | 帮我用知乎 AI 搜索"量子计算" |

---

由 [MaxHub API](https://www.aconfig.cn) 提供技术支持
