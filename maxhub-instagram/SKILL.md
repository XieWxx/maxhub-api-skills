---
name: maxhub-instagram
description: Instagram数据采集。当用户提到instagram、ins、图片等相关需求时激活此Skill。
version: 2.0.0
author: MaxHub Team
license: MIT
trigger: "instagram|ins|图片|reel|story|ins搜索"
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
    emoji: "📸"
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
    - instagram
    - ins
    - 图片
    - reel
    - story
    - ins搜索
---

# 📸 Instagram数据采集

## 🎯 我能做什么

以下是你可以用自然语言向我提问的真实场景：

### 搜索Instagram用户

**你说：** `Search Instagram user @xxx`

**我返回：** 返回用户信息，包含粉丝数、帖子数、认证状态

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

共 **88** 个 API，覆盖以下能力：

### Instagram V1（29个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `v1/media_id_to_shortcode` | GET | - | 将Instagram帖子的Media ID转换为Shortcode |
| `v1/shortcode_to_media_id` | GET | - | 将Instagram帖子的Shortcode转换为Media ID |
| `v1/fetch_search` | GET | - | 根据关键词搜索Instagram上的用户、话题标签或地点 |
| `v1/fetch_user_info_by_id_v2` | GET | - | 根据Instagram用户ID获取用户数据，返回更详细的信息 |
| `v1/fetch_user_info_by_id` | GET | - | 根据Instagram用户ID获取用户数据 |
| `v1/fetch_user_info_by_username_v2` | GET | - | 根据Instagram用户名获取用户数据 |
| `v1/fetch_user_info_by_username_v3` | GET | - | 根据Instagram用户名获取用户数据，返回更详细的信息 |
| `v1/fetch_user_info_by_username` | GET | - | 根据Instagram用户名获取用户数据 |
| `v1/user_id_to_username` | GET | - | 通过Instagram用户ID获取用户信息 |
| `v1/fetch_music_posts` | GET | - | 获取使用指定音乐/音频的Reels和帖子列表 |
| ... | | | 还有 19 个API |

### Instagram V2（27个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `v2/media_id_to_shortcode` | GET | - | 将Instagram帖子的Media ID转换为Shortcode |
| `v2/shortcode_to_media_id` | GET | - | 将Instagram帖子的Shortcode转换为Media ID |
| `v2/search_reels` | GET | - | 根据关键词搜索Instagram Reels短视频 |
| `v2/search_locations` | GET | - | 根据关键词搜索Instagram地点 |
| `v2/search_users` | GET | - | 根据关键词搜索Instagram用户 |
| `v2/search_hashtags` | GET | - | 根据关键词搜索Instagram话题标签 |
| `v2/search_music` | GET | - | 根据关键词搜索Instagram上可用的音乐 |
| `v2/search_by_coordinates` | GET | - | 根据GPS坐标搜索附近的Instagram地点 |
| `v2/user_id_to_username` | GET | - | 通过Instagram用户ID获取用户信息 |
| `v2/general_search` | GET | - | 根据关键词进行Instagram综合搜索 |
| ... | | | 还有 17 个API |

### Instagram V3（32个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `v3/extract_shortcode` | GET | - | 从完整的Instagram帖子URL中提取短码 |
| `v3/media_id_to_shortcode` | GET | - | 将数字媒体ID（media_id）转换为帖子短码（shortcode） |
| `v3/bulk_translate_comments` | GET | - | 批量翻译Instagram评论 |
| `v3/search_places` | GET | - | Instagram地点搜索接口 |
| `v3/search_users` | GET | - | Instagram用户搜索接口 |
| `v3/search_hashtags` | GET | - | Instagram话题标签搜索接口 |
| `v3/shortcode_to_media_id` | GET | - | 将帖子短码（shortcode）转换为数字媒体ID（media_id） |
| `v3/general_search` | GET | - | Instagram综合搜索接口（支持分页） |
| `v3/translate_comment` | GET | - | 翻译Instagram帖子文本（caption） |
| `v3/get_highlight_stories` | GET | - | 获取Instagram Highlight精选的详细故事/帖子内容 |
| ... | | | 还有 22 个API |

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
