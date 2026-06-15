# Reddit 数据助手

[English](README.md)

Reddit 数据查询助手。覆盖帖子、用户资料、搜索、版块、评论和热门趋势。通过 MaxHub API 提供 28 个端点，覆盖 4 个功能领域。

## 功能

| 领域 | 参考文件 | 覆盖内容 | 端点数 |
|------|---------|---------|--------|
| 用户 | `references/user.md` | 用户资料、活跃社区、评论、帖子、奖杯 | 5 |
| 内容 | `references/content.md` | Feed流、帖子详情、评论、回复、Reddit Answers | 13 |
| 搜索 | `references/search.md` | 搜索自动补全、动态搜索、社区亮点、热门搜索 | 4 |
| 版块 | `references/subreddit.md` | 版块样式、频道、信息、设置、Feed、静音检查 | 6 |

参数速查见 `references/param-mappings.md`。

## 安装

```bash
npx clawhub install maxhub-reddit
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置：`openclaw config set skills.entries.maxhub-reddit.apiKey "<你的-key>"` 或 `export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

| 分类 | 示例指令 |
|------|----------|
| 用户 | 查Reddit用户 spez 的资料和帖子 |
| 内容 | 查Reddit首页推荐帖子 |
| 搜索 | reddit搜索编程相关内容 |
| 版块 | 查subreddit r/pics 的热门帖子 |

支持 **中文** 和 **英文** 双语。

## 链接

- 官网：[www.aconfig.cn](https://www.aconfig.cn)

---

由 [MaxHub](https://www.aconfig.cn) 提供技术支持
