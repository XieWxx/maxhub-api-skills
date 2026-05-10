---
name: maxhub-zhihu
description: 知乎数据采集与分析。当用户提到知乎、zhihu、问答等相关需求时激活此Skill。
version: 2.0.0
author: MaxHub Team
license: MIT
trigger: "知乎|zhihu|问答|专栏|话题|知乎搜索"
categories:
  - social-media
  - data-collection
  - knowledge-base
tools:
  - http
metadata:
  openclaw:
    requires:
      env:
        - MAXHUB_API_KEY
    primaryEnv: MAXHUB_API_KEY
    emoji: "💡"
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
    - 知乎
    - zhihu
    - 问答
    - 专栏
    - 话题
    - 知乎搜索
---

# 💡 知乎数据采集与分析

## 🎯 我能做什么

以下是你可以用自然语言向我提问的真实场景：

### 搜索知乎问答

**你说：** `知乎上关于AI的问答`

**我返回：** 返回问答列表，包含问题、回答数、关注数

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

共 **34** 个 API，覆盖以下能力：

### Zhihu Web（34个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `web/fetch_search_suggest` | GET | - | 知乎搜索预测词 |
| `web/fetch_ai_search` | GET | - | 获取知乎AI搜索 |
| `web/fetch_ai_search_result` | GET | - | 获取知乎AI搜索结果 |
| `web/fetch_column_search_v3` | GET | - | 获取知乎专栏搜索V3 |
| `web/fetch_column_relationship` | GET | - | 获取知乎专栏文章互动关系 |
| `web/fetch_column_articles` | GET | - | 获取知乎专栏文章列表 |
| `web/fetch_column_article_detail` | GET | - | 获取知乎专栏文章详情 |
| `web/fetch_column_comment_config` | GET | - | 获取知乎专栏评论区配置 |
| `web/fetch_sub_comment_v5` | GET | - | 获取知乎子评论区V5 |
| `web/fetch_recommend_followees` | GET | - | 获取知乎推荐关注列表 |
| ... | | | 还有 24 个API |

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
