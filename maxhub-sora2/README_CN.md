# Sora2 数据助手

[English](README.md)

Sora2（sora.chatgpt.com）数据查询助手。覆盖作品、用户、评论、Cameo出镜秀、视频下载，
并支持触发 Sora2 视频生成任务，全部通过 MaxHub API。

## 功能

- **作品与内容** — `get_post_detail`、`get_post_comments`、`get_comment_replies`、
  `get_post_remix_list`、`get_video_download_info`、`get_feed`
- **用户** — `get_user_profile`、`get_user_posts`、`get_user_following`、
  `get_user_followers`、`get_user_cameo_appearances`、`search_users`
- **工具与 Cameo** — `create_video`、`get_task_status`、`get_task_detail`、
  `upload_image`、`get_cameo_leaderboard`

## 安装

```bash
npx clawhub install maxhub-sora2
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置：`openclaw config set skills.entries.maxhub-sora2.apiKey "<你的-key>"` 或 `export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

| 分类 | 示例指令 |
|------|----------|
| 作品与内容 | "查这个 Sora2 作品详情"，"查作品的评论列表" |
| 用户 | "搜索 Sora2 用户 sam"，"查这个用户发布的作品" |
| 工具与 Cameo | "生成一个 Sora2 视频"，"查 Cameo 出镜热榜" |

支持 **中文** 和 **英文** 双语。

## 链接

- 官网：[www.aconfig.cn](https://www.aconfig.cn)

---

由 [MaxHub](https://www.aconfig.cn) 提供技术支持
