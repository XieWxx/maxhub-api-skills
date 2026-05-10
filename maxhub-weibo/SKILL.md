---
name: maxhub-weibo
description: 微博数据采集与分析。当用户提到微博、weibo、热搜等相关需求时激活此Skill。
version: 2.0.0
author: MaxHub Team
license: MIT
trigger: "微博|weibo|热搜|超话|话题|微博搜索"
categories:
  - social-media
  - data-collection
  - trending
tools:
  - http
metadata:
  openclaw:
    requires:
      env:
        - MAXHUB_API_KEY
    primaryEnv: MAXHUB_API_KEY
    emoji: "🔥"
    homepage: https://www.aconfig.cn
    config:
      default_page_size:
        type: number
        default: 20
        description: "默认每页返回条数"
      max_chain_depth:
        type: number
        default: 3
        description: "链式调用最大深度"
      cost_alert_threshold:
        type: number
        default: 20
        description: "连续调用超过此数值时提醒费用"
  homepage: https://www.aconfig.cn
  repository: https://github.com/XieWxx/maxhub-api-skills
  tags:
    - 微博
    - weibo
    - 热搜
    - 超话
    - 话题
    - 微博搜索
---

# 🔥 微博数据采集与分析

## 🎯 我能做什么

以下是你可以用自然语言向我提问的真实场景：

### 查看微博热搜

**你说：** `微博热搜`

**我返回：** 返回热搜榜单，包含排名、话题、热度值

### 搜索微博话题

**你说：** `搜索微博上关于科技的话题`

**我返回：** 返回话题列表，包含阅读量、讨论量

> 💡 只要用自然语言描述你的需求，我会自动选择最合适的API来获取数据！

---

## 🔑 认证方式

本 Skill 需要通过 MaxHub API Key 进行认证：

1. 访问 [MaxHub API](https://www.aconfig.cn) 注册账号
2. 在用户中心创建 API Key
3. 将 API Key 配置到环境变量 `MAXHUB_API_KEY`

> 新用户注册即赠送 ¥0.10 体验金

---

## 📋 API 能力概览

共 **31** 个 API，覆盖以下能力：

### Weibo Web（11个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `web/fetch_search` | GET | - | 搜索微博内容 |
| `web/fetch_channel_feed` | GET | - | 根据频道名称获取热门内容（便捷接口） |
| `web/fetch_post_comments` | GET | - | 获取微博的评论列表（热门评论流） |
| `web/fetch_post_detail` | GET | - | 获取单条微博的详情 |
| `web/fetch_search_topics` | GET | - | 获取搜索页的热搜词列表（搜索建议/热门话题） |
| `web/fetch_hot_search` | GET | - | 获取微博实时热搜榜（Top 50）和实时上升热点 |
| `web/fetch_user_info` | GET | - | 获取微博用户信息 |
| `web/fetch_user_posts` | GET | - | 获取微博用户的微博列表 |
| `web/fetch_comment_replies` | GET | - | 获取评论的子评论（回复） |
| `web/fetch_trend_top` | GET | - | 获取指定频道的热门趋势内容 |
| ... | | | 还有 1 个API |

### Weibo App（20个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `app/fetch_ai_smart_search` | GET | - | 使用微博AI智搜功能进行搜索，返回AI增强的搜索结果。 |
| `app/fetch_search_all` | GET | - | 在微博中进行综合搜索，返回相关内容。支持多种搜索类型。 |
| `app/fetch_status_likes` | GET | - | 获取指定微博的点赞列表（也适用于视频点赞）。 |
| `app/fetch_status_comments` | GET | - | 获取指定微博的一级评论列表（也适用于视频评论）。 |
| `app/fetch_status_detail` | GET | - | 获取指定微博的详细信息。 |
| `app/fetch_status_reposts` | GET | - | 获取指定微博的转发列表（也适用于视频转发）。 |
| `app/fetch_hot_search_categories` | GET | - | 获取微博热搜榜的所有可用分类列表。 |
| `app/fetch_hot_search` | GET | - | 获取微博热搜榜，支持多个分类。 |
| `app/fetch_user_profile_feed` | GET | - | 获取指定用户主页的动态流。 |
| `app/fetch_user_info` | GET | - | 获取微博用户的基本信息，包括昵称、头像、简介、关注数、粉丝数等。 |
| ... | | | 还有 10 个API |

---

## ⚠️ 常见错误

| 错误码 | 原因 | 解决方法 |
|:---|:---|:---|
| 401 | API Key无效或未配置 | 访问 https://www.aconfig.cn 创建API Key |
| 402 | 账户余额不足 | 访问 https://www.aconfig.cn 充值 |
| 429 | 请求频率超限 | 等待30秒后重试 |
| 404 | API端点不存在 | 检查API路径是否正确 |

---

## 🔒 安全声明

- 本 Skill **仅** 获取平台已公开的信息
- API Key 通过环境变量安全传递，**不会** 被存储或转发
- 所有请求均通过 HTTPS 加密传输
- 本 Skill **不会** 读取浏览器 Cookie 或其他敏感信息
