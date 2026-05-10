---
name: maxhub-bilibili
description: B站数据采集与分析。当用户提到b站、bilibili、弹幕等相关需求时激活此Skill。
version: 2.0.0
author: MaxHub Team
license: MIT
trigger: "b站|bilibili|弹幕|番剧|up主|b站视频|哔哩哔哩"
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
    emoji: "📺"
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
    - b站
    - bilibili
    - 弹幕
    - 番剧
    - up主
    - b站视频
    - 哔哩哔哩
---

# 📺 B站数据采集与分析

## 🎯 我能做什么

以下是你可以用自然语言向我提问的真实场景：

### 搜索B站视频

**你说：** `搜索B站上编程教程的视频`

**我返回：** 返回视频列表，包含标题、UP主、播放量、弹幕数

### 获取视频弹幕

**你说：** `获取这个B站视频的弹幕数据`

**我返回：** 返回弹幕列表，包含弹幕内容、时间点、弹幕类型

### 查看UP主信息

**你说：** `这个UP主有多少粉丝`

**我返回：** 返回UP主信息，包含粉丝数、播放量、投稿数

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

共 **41** 个 API，覆盖以下能力：

### Bilibili Web（30个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `web/fetch_get_user_id` | GET | - | 提取用户ID |
| `web/fetch_user_up_stat` | GET | - | 获取UP主状态统计信息（总获赞数、总播放数） |
| `web/fetch_dynamic_detail` | GET | - | 获取指定动态的详情信息（v1接口） |
| `web/fetch_dynamic_detail_v2` | GET | - | 获取指定动态的详情信息（v2接口） |
| `web/fetch_video_play_info` | GET | - | 获取单个视频播放信息 |
| `web/fetch_video_detail` | GET | - | 获取单个视频详情 |
| `web/fetch_one_video_v2` | GET | - | 获取单个视频详情信息V2 |
| `web/fetch_one_video_v3` | GET | - | 获取单个视频详情信息V3 |
| `web/fetch_one_video` | GET | - | 获取单个视频详情信息 |
| `web/fetch_vip_video_playurl` | POST | - | 获取大会员清晰度视频流地址 |
| ... | | | 还有 20 个API |

### Bilibili App（11个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `app/fetch_search_by_type` | GET | - | 分类搜索（按类型搜索） |
| `app/fetch_search_all` | GET | - | 综合搜索（返回所有类型的搜索结果） |
| `app/fetch_home_feed` | GET | - | 获取主页推荐视频流 |
| `app/fetch_reply_detail` | GET | - | 获取二级评论回复 |
| `app/fetch_one_video` | GET | - | 获取单个视频详情信息（APP接口） |
| `app/fetch_cinema_tab` | GET | - | 获取主页影视推荐 |
| `app/fetch_popular_feed` | GET | - | 获取热门推荐视频 |
| `app/fetch_user_info` | GET | - | 获取用户信息 |
| `app/fetch_user_videos` | GET | - | 获取用户投稿视频列表 |
| `app/fetch_bangumi_tab` | GET | - | 获取主页番剧推荐 |
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
