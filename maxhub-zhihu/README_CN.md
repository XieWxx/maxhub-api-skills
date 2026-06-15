# 知乎数据助手

[English](README.md)

知乎用户、内容、搜索数据查询助手。通过 MaxHub API 提供 34 个端点，覆盖 3 个功能领域。

## 功能

| 领域 | 参考文件 | 覆盖内容 | 端点数 |
|------|---------|---------|--------|
| 用户 | `references/user.md` | 用户信息、关注、粉丝、文章、专栏、问题、收藏、话题 | 10 |
| 内容 | `references/content.md` | 专栏文章、评论、问答、热榜、首页推荐、视频榜 | 11 |
| 搜索 | `references/search.md` | 文章/用户/话题/视频/专栏/论文/电子书搜索、AI搜索、预设搜索、搜索推荐/建议 | 13 |

参数速查见 `references/param-mappings.md`。

## 安装

```bash
npx clawhub install maxhub-zhihu
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置：`openclaw config set skills.entries.maxhub-zhihu.apiKey "<你的-key>"` 或 `export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

| 分类 | 示例指令 |
|------|----------|
| 用户 | 查知乎, 知乎用户, 查知乎用户关注列表, 查知乎用户文章 |
| 内容 | 知乎热榜, 知乎专栏, 查知乎问题回答, 查知乎评论 |
| 搜索 | 知乎搜索, 知乎AI搜索, 在知乎搜索..., 知乎搜索建议 |

支持 **中文** 和 **英文** 双语。

## 链接

- 官网：[www.aconfig.cn](https://www.aconfig.cn)

---

由 [MaxHub](https://www.aconfig.cn) 提供技术支持
