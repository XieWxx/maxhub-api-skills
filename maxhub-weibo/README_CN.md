# 微博 数据助手

[English](README.md)

微博帖子、用户、搜索、评论、热搜榜单、视频推荐数据查询助手。通过 MaxHub API 提供 64 个端点，覆盖 4 个功能领域。

## 功能

| 领域 | 参考文件 | 覆盖内容 | 端点数 |
|------|---------|---------|--------|
| 微博 | `references/post.md` | 微博详情、转发列表、点赞列表、视频详情、推荐Feed、频道热门、榜单时间线 | 14 |
| 用户 | `references/user.md` | 用户信息、粉丝/关注、微博列表、原创微博、超话、视频/文章/音频、收藏夹、分组 | 22 |
| 搜索 | `references/search.md` | 综合搜索、AI搜索、高级搜索、实时搜索、视频/图片/话题搜索、热搜榜、文娱/社会/生活榜 | 23 |
| 评论 | `references/comments.md` | 微博评论、子评论、评论回复 | 5 |

支持 App、Web、Web V2 三端 API。参数速查见 `references/param-mappings.md`。

## 安装

```bash
npx clawhub install maxhub-weibo
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置：`openclaw config set skills.entries.maxhub-weibo.apiKey "<你的-key>"` 或 `export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

| 分类 | 示例指令 |
|------|----------|
| 微博 | 查这条微博详情，这条微博的转发和点赞情况如何，查这个微博视频 |
| 用户 | 查这个微博用户的粉丝数和关注列表，查这个用户最近发的微博 |
| 搜索 | 搜微博关于人工智能的最新讨论，查今天微博热搜榜，在微博搜索用户 |
| 评论 | 查这条微博的评论，查这条评论的回复 |

支持 **中文** 和 **英文** 双语。

## 链接

- 官网：[www.aconfig.cn](https://www.aconfig.cn)

---

由 [MaxHub](https://www.aconfig.cn) 提供技术支持
