# 皮皮虾 数据助手

[English](README.md)

皮皮虾帖子、用户、搜索、热搜、话题、评论数据查询助手。通过 MaxHub API 提供 17 个端点，覆盖 2 个功能领域。

## 功能

| 领域 | 参考文件 | 覆盖内容 | 端点数 |
|------|---------|---------|--------|
| 用户 | `references/user.md` | 用户信息、帖子列表、粉丝列表、关注列表 | 4 |
| 内容 | `references/content.md` | 帖子详情、统计、评论、首页推荐、搜索、热搜、话题、短剧、短链接 | 13 |

全部使用 App API 端点。参数速查见 `references/param-mappings.md`。

## 安装

```bash
npx clawhub install maxhub-pipixia
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置：`openclaw config set skills.entries.maxhub-pipixia.apiKey "<你的-key>"` 或 `export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

| 分类 | 示例指令 |
|------|----------|
| 用户 | 查皮皮虾用户信息, 皮皮虾用户帖子列表 |
| 帖子 | 查皮皮虾帖子详情, 皮皮虾帖子统计数据 |
| 搜索 | 皮皮虾热搜, 在皮皮虾搜索搞笑视频 |
| 评论 | 查皮皮虾帖子评论 |
| 话题 | 查皮皮虾话题详情, 皮皮虾话题帖子 |
| 首页 | 皮皮虾首页推荐, 皮皮虾短剧推荐 |

支持 **中文** 和 **英文** 双语。

## 链接

- 官网：[www.aconfig.cn](https://www.aconfig.cn)

---

由 [MaxHub](https://www.aconfig.cn) 提供技术支持
