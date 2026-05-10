---
name: maxhub-twitter
description: Twitter/X数据采集与分析。当用户提到twitter、x、推文等相关需求时激活此Skill。
version: 2.0.0
author: MaxHub Team
license: MIT
trigger: "twitter|x|推文|tweet|话题|twitter搜索"
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
    emoji: "🐦"
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
    - twitter
    - x
    - 推文
    - tweet
    - 话题
    - twitter搜索
---

# 🐦 Twitter/X数据采集与分析

## 🎯 我能做什么

以下是你可以用自然语言向我提问的真实场景：

### 搜索推文

**你说：** `Search tweets about AI`

**我返回：** 返回推文列表，包含内容、转发数、点赞数

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

共 **13** 个 API，覆盖以下能力：

### Twitter Web（13个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `web/fetch_search_timeline` | GET | - | 搜索 |
| `web/fetch_user_followings` | GET | - | 获取用户关注 |
| `web/fetch_user_followers` | GET | - | 获取用户粉丝 |
| `web/fetch_tweet_detail` | GET | - | 获取单个推文数据 |
| `web/fetch_latest_post_comments` | GET | - | 获取最新的推文评论 |
| `web/fetch_user_post_tweet` | GET | - | 获取用户发帖 |
| `web/fetch_user_media` | GET | - | 获取用户媒体 |
| `web/fetch_user_tweet_replies` | GET | - | 获取用户推文回复 |
| `web/fetch_user_profile` | GET | - | 获取用户资料 |
| `web/fetch_user_highlights_tweets` | GET | - | 获取用户高光推文 |
| ... | | | 还有 3 个API |

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
