---
name: maxhub-youtube
description: YouTube数据采集与分析。当用户提到youtube、视频、频道等相关需求时激活此Skill。
version: 2.0.0
author: MaxHub Team
license: MIT
trigger: "youtube|视频|频道|评论|播放列表|youtube搜索"
categories:
  - social-media
  - data-collection
  - video-platform
tools:
  - http
metadata:
  openclaw:
    requires:
      env:
        - MAXHUB_API_KEY
    primaryEnv: MAXHUB_API_KEY
    emoji: "▶️"
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
    - youtube
    - 视频
    - 频道
    - 评论
    - 播放列表
    - youtube搜索
---

# ▶️ YouTube数据采集与分析

## 🎯 我能做什么

以下是你可以用自然语言向我提问的真实场景：

### 搜索YouTube视频

**你说：** `Search YouTube for AI tutorials`

**我返回：** 返回视频列表，包含标题、频道、观看数、点赞数

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

共 **21** 个 API，覆盖以下能力：

### YouTube Web（21个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `web/get_shorts_search` | GET | - | YouTube Shorts短视频专门搜索，使用原生YouTube API接口 |
| `web/get_channel_url` | GET | - | 从YouTube频道ID转换获取频道Handle (@用户名) |
| `web/get_channel_id_v2` | GET | - | 从YouTube频道URL转换获取频道ID（channel_id）。 |
| `web/search_video` | GET | - | 搜索视频。 |
| `web/search_channel` | GET | - | 搜索频道。 |
| `web/get_general_search` | GET | - | YouTube综合搜索，支持多种过滤条件，可以精确筛选搜索结果 |
| `web/get_relate_video` | GET | - | 根据视频ID获取推荐视频数据。 |
| `web/get_video_comment_replies` | GET | - | 获取视频二级评论 |
| `web/get_video_info` | GET | - | 获取视频元数据及下载信息 |
| `web/get_video_info_v2` | GET | - | 获取视频元数据及下载信息 |
| ... | | | 还有 11 个API |

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
