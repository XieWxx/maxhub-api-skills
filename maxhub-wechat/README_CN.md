# 微信数据助手

[English](README.md)

微信数据查询助手。覆盖视频号和公众号两大模块，支持搜索、视频详情、评论、文章、用户等全功能。通过 MaxHub API 提供 22 个端点，覆盖 3 个功能领域。

## 功能

| 领域 | 参考文件 | 覆盖内容 | 端点数 |
|------|---------|---------|--------|
| 视频号 | `references/channels.md` | 视频号信息、视频详情、评论、直播、合集、分享链接 | 12 |
| 公众号 | `references/mp.md` | 文章详情、互动数据、评论、账号资料、文章列表、服务菜单 | 9 |
| 搜索 | `references/search.md` | 视频号+公众号综合搜索 | 1 |

参数速查见 `references/param-mappings.md`。

## 安装

```bash
npx clawhub install maxhub-wechat
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置：`openclaw config set skills.entries.maxhub-wechat.apiKey "<你的-key>"` 或 `export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

| 分类 | 示例指令 |
|------|----------|
| 视频号 | 查这个视频号的最近视频和信息 |
| 公众号 | 查这篇文章的阅读量和评论 |
| 搜索 | 在微信中搜索关键词 |

支持 **中文** 和 **英文** 双语。

## 链接

- 官网：[www.aconfig.cn](https://www.aconfig.cn)

---

由 [MaxHub](https://www.aconfig.cn) 提供技术支持
