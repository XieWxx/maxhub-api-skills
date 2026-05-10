---
name: maxhub-pipixia
description: 皮皮虾数据采集。当用户提到皮皮虾、pipixia、搞笑等相关需求时激活此Skill。
version: 2.0.0
author: MaxHub Team
license: MIT
trigger: "皮皮虾|pipixia|搞笑|段子"
categories:
  - social-media
  - data-collection
  - entertainment
tools:
  - http
metadata:
  openclaw:
    requires:
      env:
        - MAXHUB_API_KEY
    primaryEnv: MAXHUB_API_KEY
    emoji: "🦐"
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
    - 皮皮虾
    - pipixia
    - 搞笑
    - 段子
---

# 🦐 皮皮虾数据采集

## 🎯 我能做什么

以下是你可以用自然语言向我提问的真实场景：

### 搜索搞笑内容

**你说：** `皮皮虾上的搞笑段子`

**我返回：** 返回内容列表，包含标题、点赞数、评论数

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

共 **17** 个 API，覆盖以下能力：

### PiPiXia App（17个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `app/fetch_increase_post_view_count` | GET | - | 增加作品浏览数。 |
| `app/fetch_search` | GET | - | 搜索接口，支持搜索用户、作品等。 |
| `app/fetch_short_url` | GET | - | 生成短连接。 |
| `app/fetch_post_statistics` | GET | - | 获取单个作品的统计数据，如点赞数、评论数、转发数等。 |
| `app/fetch_post_comment_list` | GET | - | 获取作品的评论列表。 |
| `app/fetch_post_detail` | GET | - | 获取单个作品数据，支持图文、视频等。 |
| `app/fetch_hot_search_board_list` | GET | - | 获取热搜榜单列表数据。 |
| `app/fetch_hot_search_board_detail` | GET | - | 获取热搜榜单详情数据。 |
| `app/fetch_hot_search_words` | GET | - | 获取热搜词条数据。 |
| `app/fetch_user_post_list` | GET | - | 获取用户作品列表，如视频、图文等。 |
| ... | | | 还有 7 个API |

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
