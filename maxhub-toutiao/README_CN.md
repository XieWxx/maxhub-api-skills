# 今日头条 数据助手

[English](README.md)

今日头条文章、视频、用户、评论数据查询助手。通过 MaxHub API 提供 7 个端点，覆盖 1 个功能领域。

## 功能

| 领域 | 参考文件 | 覆盖内容 | 端点数 |
|------|---------|---------|--------|
| 内容 | `references/content.md` | 文章详情、视频详情、用户信息、用户ID提取、评论 (App+Web) | 7 |

支持 App 和 Web 双端 API。参数速查见 `references/param-mappings.md`。

## 安装

```bash
npx clawhub install maxhub-toutiao
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置：`openclaw config set skills.entries.maxhub-toutiao.apiKey "<你的-key>"` 或 `export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

| 分类 | 示例指令 |
|------|----------|
| 文章 | 查今日头条这篇文章的详情 7450114952884503059 |
| 视频 | 查今日头条这个视频的信息 |
| 用户 | 查这个今日头条用户的详细信息 |
| 评论 | 查今日头条这篇文章的评论 |
| URL提取 | 从头条用户主页链接获取用户ID |

支持 **中文** 和 **英文** 双语。

## 链接

- 官网：[www.aconfig.cn](https://www.aconfig.cn)

---

由 [MaxHub](https://www.aconfig.cn) 提供技术支持
