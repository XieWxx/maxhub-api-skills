# Instagram 数据助手

[English](README.md)

Instagram 帖子、Reels、快拍、用户、搜索、评论数据查询助手。通过 MaxHub API 提供 87 个端点，覆盖 4 个功能领域。

## 功能

| 领域 | 参考文件 | 覆盖内容 | 端点数 |
|------|---------|---------|--------|
| 帖子与Reels | `references/post.md` | 帖子详情、Reels、Stories、Highlights、点赞、标记帖子、转发、音乐帖子、媒体ID转换、oEmbed、翻译 | 34 |
| 用户 | `references/user.md` | 用户信息、帖子列表、粉丝/关注、相关推荐、About、曾用名 | 24 |
| 搜索 | `references/search.md` | 用户搜索、话题搜索、地点搜索、综合搜索、探索页、地点详情 | 23 |
| 评论 | `references/comments.md` | 帖子评论、子评论/回复列表 | 6 |

支持 V1、V2、V3 三个版本 API。参数速查见 `references/param-mappings.md`。

## 安装

```bash
npx clawhub install maxhub-instagram
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置：`openclaw config set skills.entries.maxhub-instagram.apiKey "<你的-key>"` 或 `export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

| 分类 | 示例指令 |
|------|----------|
| 帖子与Reels | 查这个Instagram帖子的详情和点赞数... |
| 用户 | 查这个Instagram用户的粉丝数和关注列表... |
| 搜索 | 在Instagram上搜索... |
| 评论 | 查这个Instagram帖子的热门评论... |

支持 **中文** 和 **英文** 双语。

## 链接

- 官网：[www.aconfig.cn](https://www.aconfig.cn)

---

由 [MaxHub](https://www.aconfig.cn) 提供技术支持
