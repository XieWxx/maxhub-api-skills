# 小红书数据助手

[English](README.md)

小红书全场景数据查询助手。覆盖笔记详情、用户数据、搜索与发现、商品与话题等功能。

## 功能

- **笔记与评论** — 笔记详情（图文/视频）、评论、子评论
- **用户数据** — 用户信息、已发布笔记、收藏笔记
- **搜索与发现** — 搜索笔记/用户/图片/商品、热搜、热榜、首页推荐
- **商品与话题** — 商品详情、评价、推荐、话题信息、话题流、创作者灵感

## 安装

```bash
npx clawhub install maxhub-xiaohongshu
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置：`openclaw config set skills.entries.maxhub-xiaohongshu.apiKey "<你的-key>"` 或 `export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

| 分类 | 示例指令 |
|------|----------|
| 笔记与评论 | 笔记，详情，评论 |
| 用户数据 | 用户，资料，主页 |
| 搜索与发现 | 搜索，热榜，热搜 |
| 商品与话题 | 商品，话题，灵感 |

支持 **中文** 和 **英文** 双语。

## 链接

- 官网：[www.aconfig.cn](https://www.aconfig.cn)

---

由 [MaxHub](https://www.aconfig.cn) 提供技术支持
