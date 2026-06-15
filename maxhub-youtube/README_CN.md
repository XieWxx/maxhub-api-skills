# YouTube 数据助手

[English](README.md)

YouTube 视频、频道、评论、字幕、流媒体、Shorts 和社区帖子数据查询助手。通过 MaxHub API 提供 38 个端点，覆盖 4 个功能领域。

## 功能

| 领域 | 参考文件 | 覆盖内容 | 端点数 |
|------|---------|---------|--------|
| 视频 | `references/video.md` | 视频详情、流媒体、字幕、推荐视频、趋势视频 | 13 |
| 频道 | `references/channel.md` | 频道信息、频道视频、Shorts、社区帖子、频道ID查询 | 12 |
| 搜索 | `references/search.md` | 综合搜索、Shorts搜索、频道搜索、搜索建议 | 8 |
| 评论 | `references/comments.md` | 视频评论、评论回复、帖子详情、帖子评论回复 | 5 |

支持 Web 和 Web V2 双端 API。参数速查见 `references/param-mappings.md`。

## 安装

```bash
npx clawhub install maxhub-youtube
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置：`openclaw config set skills.entries.maxhub-youtube.apiKey "<你的-key>"` 或 `export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

| 分类 | 示例指令 |
|------|----------|
| 视频 | 在YouTube上搜索这个视频的详情..., 获取这个YouTube视频的字幕, 查看YouTube趋势视频 |
| 频道 | 查这个YouTube频道的订阅数和视频列表 @..., 获取YouTube频道Shorts短视频 |
| 搜索 | 在YouTube上搜索Minecraft教程, 搜索YouTube Shorts相关内容, YouTube搜索推荐 |
| 评论 | 查看这个YouTube视频的评论, 查看这条评论的回复, 查看YouTube社区帖子 |

支持 **中文** 和 **英文** 双语。

## 链接

- 官网：[www.aconfig.cn](https://www.aconfig.cn)

---

由 [MaxHub](https://www.aconfig.cn) 提供技术支持
