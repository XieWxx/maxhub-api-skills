# Lemon8 数据助手

Lemon8 数据查询 Skill，通过 MaxHub API 接入字节跳动旗下海外种草社区 Lemon8。覆盖笔记详情、评论、用户资料、关注/粉丝、Discover 发现、热搜词、话题、综合搜索、分享文本解析等核心能力，共 **16 个端点**。专注服务 Lemon8 种草研究、海外内容运营、话题趋势监测与跨境品牌投放场景。

- 官网：[https://www.aconfig.cn](https://www.aconfig.cn)
- SkillHub 商店：[https://skillhub.cn/user/user_2a9d366c](https://skillhub.cn/user/user_2a9d366c)
- 仓库：[https://github.com/XieWxx/maxhub-api-skills](https://github.com/XieWxx/maxhub-api-skills)

## 功能

### 笔记内容
- 笔记详情查询（标题/正文/配图/视频/作者/互动）
- 评论列表

### 用户档案
- 用户资料查询
- 粉丝/关注列表

### Discover 发现
- Banner 轮播位
- Tab 列表
- Information Tabs 信息分区

### 搜索与热搜
- 综合搜索（笔记/用户/话题）
- 实时热搜词列表

### 话题深度追踪
- 话题信息查询
- 话题参与笔记列表（热门/最新排序）

### 分享文本解析
- 单条解析 user_id/item_id
- 批量解析接口

## 安装

```bash
npx clawhub install maxhub-lemon8
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置环境变量：`export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

直接用自然语言与 AI 对话即可：

| 分类 | 示例指令 |
|------|----------|
| 笔记 | 帮我查这篇 Lemon8 笔记的详情和互动数据 |
| 搜索 | 帮我搜索 Lemon8 上关于"skincare"的热门笔记 |
| 用户 | 帮我查这个 Lemon8 博主的资料 |
| 话题 | 帮我分析这个话题下的热门笔记 |
| 热搜 | 帮我看看 Lemon8 当前的热搜词 |

---

由 [MaxHub API](https://www.aconfig.cn) 提供技术支持
