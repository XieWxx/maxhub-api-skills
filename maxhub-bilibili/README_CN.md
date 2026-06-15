# Bilibili 数据助手

[English](README.md)

B站视频、用户、评论、弹幕、直播、收藏夹数据查询助手。通过 MaxHub API 提供 41 个端点，覆盖 6 个功能领域。

## 功能

| 领域 | 参考文件 | 覆盖内容 | 端点数 |
|------|---------|---------|--------|
| 视频 | `references/video.md` | 视频详情、播放URL、字幕、分P、BV/AV转换 | 13 |
| 用户 | `references/user.md` | 用户信息、UP主统计、投稿、动态、ID提取 | 10 |
| 搜索 | `references/search.md` | 综合搜索、分类搜索、热榜、推荐、番剧影视 | 9 |
| 评论 | `references/comments.md` | 视频评论、二级回复、弹幕 | 5 |
| 直播 | `references/live.md` | 直播间信息、直播流、分区主播、分区列表 | 4 |
| 收藏 | `references/collections.md` | 收藏夹列表、收藏夹内视频 | 2 |

支持 App 和 Web 双端 API。参数速查见 `references/param-mappings.md`。

## 安装

```bash
npx clawhub install maxhub-bilibili
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置：`openclaw config set skills.entries.maxhub-bilibili.apiKey "<你的-key>"` 或 `export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

| 分类 | 示例指令 |
|------|----------|
| 视频 | 查B站这个视频的播放量和详情 BV... |
| 用户 | 查这个B站UP主的粉丝数和投稿 |
| 搜索 | 在B站搜索原神相关视频 |
| 评论 | 查这个B站视频的热门评论 |
| 直播 | 查这个B站直播间有多少人在线 |
| 收藏 | 查看这个B站用户的公开收藏夹 |

支持 **中文** 和 **英文** 双语。

## 链接

- 官网：[www.aconfig.cn](https://www.aconfig.cn)

---

由 [MaxHub](https://www.aconfig.cn) 提供技术支持
