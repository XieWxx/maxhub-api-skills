---
name: maxhub-threads
description: Threads数据采集。当用户提到threads、meta、帖子等相关需求时激活此Skill。
version: 2.0.0
author: MaxHub Team
license: MIT
trigger: "threads|meta|帖子|threads搜索"
categories:
  - social-media
  - data-collection
tools:
  - http
metadata:
  openclaw:
    requires:
      env:
        - MAXHUB_API_KEY
    primaryEnv: MAXHUB_API_KEY
    emoji: "🧵"
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
    - threads
    - meta
    - 帖子
    - threads搜索
---

# 🧵 Threads数据采集

## 🎯 我能做什么

以下是你可以用自然语言向我提问的真实场景：

### 搜索Threads帖子

**你说：** `Search Threads for AI discussion`

**我返回：** 返回帖子列表，包含内容、点赞数、回复数

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

共 **11** 个 API，覆盖以下能力：

### Threads Web（11个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `web/search_recent` | GET | - | 搜索Threads最新内容 |
| `web/search_top` | GET | - | 搜索Threads热门内容 |
| `web/search_profiles` | GET | - | 搜索Threads用户档案 |
| `web/fetch_user_info_by_id` | GET | - | 根据用户ID获取Threads用户信息 |
| `web/fetch_post_comments` | GET | - | 获取Threads帖子评论列表 |
| `web/fetch_post_detail_v2` | GET | - | 获取Threads帖子详情（支持短代码和完整URL） |
| `web/fetch_post_detail` | GET | - | 获取Threads帖子详情 |
| `web/fetch_user_info` | GET | - | 获取Threads用户信息 |
| `web/fetch_user_replies` | GET | - | 获取Threads用户的回复列表 |
| `web/fetch_user_posts` | GET | - | 获取Threads用户的帖子列表 |
| ... | | | 还有 1 个API |

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
