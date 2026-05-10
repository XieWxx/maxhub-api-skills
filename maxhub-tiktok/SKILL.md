---
name: maxhub-tiktok
description: TikTok数据采集与分析。当用户提到tiktok、国际版抖音、海外短视频等相关需求时激活此Skill。
version: 2.0.0
author: MaxHub Team
license: MIT
trigger: "tiktok|国际版抖音|海外短视频|tiktok creator|tiktok analytics"
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
    emoji: "🎶"
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
    - tiktok
    - 国际版抖音
    - 海外短视频
    - tiktok creator
    - tiktok analytics
---

# 🎶 TikTok数据采集与分析

## 🎯 我能做什么

以下是你可以用自然语言向我提问的真实场景：

### 搜索TikTok视频

**你说：** `Search TikTok videos about AI art`

**我返回：** 返回视频列表，包含标题、作者、播放量、点赞数

### 查看创作者数据

**你说：** `TikTok creator @xxx analytics`

**我返回：** 返回创作者信息，包含粉丝数、点赞数、视频数

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

共 **58** 个 API，覆盖以下能力：

### TikTok Web（58个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `web/fetch_tag_post` | GET | - | Tag作品 |
| `web/fetch_tag_detail` | GET | - | Tag详情 |
| `web/fetch_live_im_fetch` | GET | - | TikTok直播间弹幕参数获取 |
| `web/encrypt_strData` | GET | - | 加密strData指纹数据，用于生成msToken请求 |
| `web/fetch_batch_check_live_alive` | GET | - | 批量直播间开播状态检测 |
| `web/get_all_aweme_id` | POST | - | 提取列表作品id |
| `web/get_all_sec_user_id` | POST | - | 提取列表用户id |
| `web/get_aweme_id` | GET | - | 提取单个作品id |
| `web/get_sec_user_id` | GET | - | 提取列表用户id |
| `web/get_user_id` | GET | - | 提取用户user_id |
| ... | | | 还有 48 个API |

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
