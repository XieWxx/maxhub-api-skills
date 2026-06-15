# 快手 数据助手

[English](README.md)

快手视频、用户、搜索、热榜、评论、直播数据查询助手。通过 MaxHub API 提供 38 个端点，覆盖 5 个功能领域。

## 功能

| 领域 | 参考文件 | 覆盖内容 | 端点数 |
|------|---------|---------|--------|
| 视频 | `references/video.md` | 视频详情、批量查询、链接解析、分享链接生成 | 8 |
| 用户 | `references/user.md` | 用户信息、粉丝统计、投稿列表、热门作品、收藏、ID提取 | 6 |
| 搜索 | `references/search.md` | 综合搜索、分类搜索、热榜、推荐Feed、话题标签 | 14 |
| 评论 | `references/comments.md` | 视频一级评论、二级回复 | 4 |
| 直播 | `references/live.md` | 直播信息、直播榜、购物榜、品牌榜、音乐榜、直播回放 | 6 |

支持 App 和 Web 双端 API。参数速查见 `references/param-mappings.md`。

## 安装

```bash
npx clawhub install maxhub-kuaishou
```

## 配置

1. 前往 [www.aconfig.cn](https://www.aconfig.cn) 注册并获取 API Key
2. 配置：`openclaw config set skills.entries.maxhub-kuaishou.apiKey "<你的-key>"` 或 `export MAXHUB_API_KEY="<你的-key>"`

## 使用示例

| 分类 | 示例指令 |
|------|----------|
| 视频 | 查这个快手视频的播放量和详情 photo_id... |
| 用户 | 查这个快手用户的粉丝数和投稿 |
| 搜索 | 查快手热搜/在快手搜索原神相关视频 |
| 评论 | 查这个快手视频的热门评论 |
| 直播 | 查快手直播榜单排名 |

支持 **中文** 和 **英文** 双语。

## 链接

- 官网：[www.aconfig.cn](https://www.aconfig.cn)

---

由 [MaxHub](https://www.aconfig.cn) 提供技术支持
