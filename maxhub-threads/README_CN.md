# Threads 数据助手

[English](README.md)

Threads 帖子、用户资料、搜索、评论、转发数据查询助手。通过 MaxHub API 提供 11 个端点，覆盖 2 个功能领域。

## 功能

| 领域 | 参考文件 | 覆盖内容 | 端点数 |
|------|---------|---------|--------|
| 用户 | `references/user.md` | 用户信息、帖子列表、转发、回复 | 5 |
| 内容 | `references/content.md` | 帖子详情、评论、综合搜索 | 6 |

参数速查见 `references/param-mappings.md`。

## 安装

```bash
npx clawhub install maxhub-threads
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置：`openclaw config set skills.entries.maxhub-threads.apiKey "<你的-key>"` 或 `export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

| 分类 | 示例指令 |
|------|----------|
| 用户 | 查Threads用户 lilbieber, threads用户帖子列表 |
| 内容 | 查Threads帖子详情, threads搜索 bitcoin |
| 搜索 | 在Threads搜索, Threads热门, Threads最新内容 |

支持 **中文** 和 **英文** 双语。

## 链接

- 官网：[www.aconfig.cn](https://www.aconfig.cn)

---

由 [MaxHub](https://www.aconfig.cn) 提供技术支持
