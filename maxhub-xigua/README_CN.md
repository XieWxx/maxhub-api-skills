# 西瓜视频 数据助手

[English](README.md)

西瓜视频数据查询助手。通过 MaxHub API 提供 7 个端点，覆盖视频详情、播放链接、搜索、评论、用户信息、用户作品。

## 功能

| 领域 | 参考文件 | 覆盖内容 | 端点数 |
|------|---------|---------|--------|
| 内容 | `references/content.md` | 视频详情 (v1/v2)、播放URL、搜索、评论、用户信息、用户作品 | 7 |

支持西瓜视频 App V2 API。参数速查见 `references/param-mappings.md`。

## 安装

```bash
npx clawhub install maxhub-xigua
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置：`openclaw config set skills.entries.maxhub-xigua.apiKey "<你的-key>"` 或 `export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

| 分类 | 示例指令 |
|------|----------|
| 视频 | 查西瓜视频这个作品的详情和播放量 item_id... |
| 搜索 | 在西瓜视频搜索关键词 |
| 评论 | 查这个西瓜视频作品的评论 |
| 用户 | 查这个西瓜视频用户的信息和作品列表 |

支持 **中文** 和 **英文** 双语。

## 链接

- 官网：[www.aconfig.cn](https://www.aconfig.cn)

---

由 [MaxHub](https://www.aconfig.cn) 提供技术支持
