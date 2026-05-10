---
name: maxhub-kuaishou
description: 快手数据采集与分析。当用户提到快手、kuaishou、快手视频等相关需求时激活此Skill。
version: 2.0.0
author: MaxHub Team
license: MIT
trigger: "快手|kuaishou|快手视频|快手直播|快手电商"
categories:
  - social-media
  - data-collection
  - e-commerce
tools:
  - http
metadata:
  openclaw:
    requires:
      env:
        - MAXHUB_API_KEY
    primaryEnv: MAXHUB_API_KEY
    emoji: "🎬"
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
    - 快手
    - kuaishou
    - 快手视频
    - 快手直播
    - 快手电商
---

# 🎬 快手数据采集与分析

## 🎯 我能做什么

以下是你可以用自然语言向我提问的真实场景：

### 搜索快手视频

**你说：** `搜索快手上的美食视频`

**我返回：** 返回视频列表，包含标题、作者、播放量

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

共 **33** 个 API，覆盖以下能力：

### Kuaishou App（20个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `app/fetch_brand_top_list` | GET | - | 快手品牌榜单 |
| `app/fetch_videos_batch` | GET | - | 批量获取多个作品数据，单次请求最多支持40个视频ID。 |
| `app/fetch_hot_search_person` | GET | - | 快手热搜人物榜单 |
| `app/fetch_hot_board_categories` | GET | - | 快手热榜分类 |
| `app/fetch_hot_board_detail` | GET | - | 快手热榜详情 |
| `app/fetch_live_top_list` | GET | - | 快手直播榜单 |
| `app/fetch_shopping_top_list` | GET | - | 快手购物榜单 |
| `app/search_user_v2` | GET | - | 搜索用户 V2 |
| `app/search_video_v2` | GET | - | 搜索视频 V2 |
| `app/fetch_one_video_by_url` | GET | - | 根据链接获取单个作品数据，此接口默认使用价格更便宜的V1接口进行请求。 |
| ... | | | 还有 10 个API |

### Kuaishou Web（13个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `web/generate_share_short_url` | GET | - | 生成分享短连接 |
| `web/fetch_one_video_comment` | GET | - | 获取单个作品评论数据 |
| `web/fetch_one_video_sub_comment` | GET | - | 获取单个作品二级评论数据 |
| `web/fetch_one_video` | GET | - | 获取单个作品数据，此接口不支持图文作品。 |
| `web/fetch_one_video_v2` | GET | - | 快手单一视频查询接口V2 |
| `web/fetch_kuaishou_hot_list_v1` | GET | - | 获取快手热榜 V1 |
| `web/fetch_kuaishou_hot_list_v2` | GET | - | 获取快手热榜 V2 |
| `web/fetch_get_user_id` | GET | - | 通过用户分享链接获取用户ID |
| `web/fetch_user_info` | GET | - | 获取用户信息 |
| `web/fetch_user_post` | GET | - | 获取用户作品列表 |
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
