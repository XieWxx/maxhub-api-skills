---
name: maxhub-xiaohongshu
description: 小红书数据采集与分析。当用户提到小红书、xiaohongshu、red等相关需求时激活此Skill。
version: 2.0.0
author: MaxHub Team
license: MIT
trigger: "小红书|xiaohongshu|red|种草|笔记|小红书搜索"
categories:
  - social-media
  - data-collection
  - content-analysis
tools:
  - http
metadata:
  openclaw:
    requires:
      env:
        - MAXHUB_API_KEY
    primaryEnv: MAXHUB_API_KEY
    emoji: "📕"
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
    - 小红书
    - xiaohongshu
    - red
    - 种草
    - 笔记
    - 小红书搜索
---

# 📕 小红书数据采集与分析

## 🎯 我能做什么

以下是你可以用自然语言向我提问的真实场景：

### 搜索小红书笔记

**你说：** `在小红书搜索平价护肤笔记`

**我返回：** 返回笔记列表，包含标题、作者、点赞数、收藏数

### 查看用户信息

**你说：** `这个小红书博主的粉丝数`

**我返回：** 返回用户信息，包含粉丝数、获赞数、笔记数

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

共 **28** 个 API，覆盖以下能力：

### Xiaohongshu Web（17个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `web/sign` | POST | - | 小红书Web签名，用于获取小红书的一些数据。 |
| `web/search_users` | GET | - | 搜索用户 |
| `web/search_notes_v3` | GET | - | 搜索笔记 V3 |
| `web/search_notes` | GET | - | 搜索笔记 |
| `web/get_product_info` | GET | - | 通过分享链接获取小红书的商品信息 |
| `web/get_visitor_cookie` | GET | - | 获取小红书网页版的游客Cookie，可以用于爬取小红书的一些数据。 |
| `web/get_user_info` | GET | - | 获取用户信息 V1 |
| `web/get_user_info_v2` | GET | - | 获取用户信息 V2 |
| `web/get_user_notes_v2` | GET | - | 获取用户的笔记 |
| `web/get_note_info_v2` | GET | - | 获取笔记信息 V2 |
| ... | | | 还有 7 个API |

### Xiaohongshu App（11个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `app/get_user_id_and_xsec_token` | GET | - | 从用户分享链接中提取用户ID和xsec_token |
| `app/extract_share_info` | GET | - | 从分享链接中提取笔记ID和xsec_token |
| `app/search_products` | GET | - | 搜索小红书商品 |
| `app/search_notes` | GET | - | 搜索小红书笔记 |
| `app/get_product_detail` | GET | - | 获取小红书商品详情信息 |
| `app/get_sub_comments` | GET | - | 获取评论的子评论（回复）列表 |
| `app/get_user_notes` | GET | - | 获取用户发布的笔记列表 |
| `app/get_user_info` | GET | - | 获取用户详情信息 |
| `app/get_note_info` | GET | - | 获取笔记信息 V1 |
| `app/get_note_info_v2` | GET | - | 获取笔记信息 V2 |
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
