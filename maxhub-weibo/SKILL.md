---
name: maxhub-weibo
description: 微博数据采集与分析。当用户提到微博、weibo、热搜等相关需求时激活此Skill。
version: 2.0.0
author: MaxHub Team
license: MIT
trigger: "微博|weibo|热搜|超话|话题|微博搜索"
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
    emoji: "🔥"
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
    - 微博
    - weibo
    - 热搜
    - 超话
    - 话题
    - 微博搜索
---

# 🔥 微博数据采集与分析

唯一标识：`maxhub-weibo`
版本：v2.0.0
更新时间：2026-05-10
适配平台：MaxHub / Tikhub

## 简介

微博数据采集与分析——微博、weibo、热搜等平台数据的智能采集与分析工具，支持视频搜索、用户分析、热门趋势追踪等能力，用自然语言即可获取数据。

## 功能亮点

- 智能识别：根据自然语言自动匹配最合适的API
- 链式调用：复杂需求自动串联多个API完成
- 全量覆盖：共 31 个API，覆盖数据采集、搜索查询、用户分析等场景
- 兼容设计：API返回字段变化时自动适配，无需手动调整

## 使用方法

### 触发指令

直接输入：微博、weibo、热搜、超话、话题

### 使用示例

1. 示例：微博热搜 → 返回热搜榜单，包含排名、话题、热度值
2. 示例：搜索微博上关于科技的话题 → 返回话题列表，包含阅读量、讨论量

## 参数说明

| 参数名 | 是否必填 | 说明 |
|--------|----------|------|
| MAXHUB_API_KEY | 是 | MaxHub API密钥，访问 https://www.aconfig.cn 注册获取 |
| keyword | 否 | 搜索关键词 |
| page | 否 | 页码，默认1 |
| count | 否 | 每页条数，默认20 |

## 支持功能

**Weibo Web**（11个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `web/fetch_search` | GET | - | 搜索微博内容 |
| `web/fetch_channel_feed` | GET | - | 根据频道名称获取热门内容（便捷接口） |
| `web/fetch_post_comments` | GET | - | 获取微博的评论列表（热门评论流） |
| `web/fetch_post_detail` | GET | - | 获取单条微博的详情 |
| `web/fetch_search_topics` | GET | - | 获取搜索页的热搜词列表（搜索建议/热门话题） |
| `web/fetch_hot_search` | GET | - | 获取微博实时热搜榜（Top 50）和实时上升热点 |
| `web/fetch_user_info` | GET | - | 获取微博用户信息 |
| `web/fetch_user_posts` | GET | - | 获取微博用户的微博列表 |
| `web/fetch_comment_replies` | GET | - | 获取评论的子评论（回复） |
| `web/fetch_trend_top` | GET | - | 获取指定频道的热门趋势内容 |
| ... | | | 还有 1 个API |

**Weibo App**（20个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `app/fetch_ai_smart_search` | GET | - | 使用微博AI智搜功能进行搜索，返回AI增强的搜索结果。 |
| `app/fetch_search_all` | GET | - | 在微博中进行综合搜索，返回相关内容。支持多种搜索类型。 |
| `app/fetch_status_likes` | GET | - | 获取指定微博的点赞列表（也适用于视频点赞）。 |
| `app/fetch_status_comments` | GET | - | 获取指定微博的一级评论列表（也适用于视频评论）。 |
| `app/fetch_status_detail` | GET | - | 获取指定微博的详细信息。 |
| `app/fetch_status_reposts` | GET | - | 获取指定微博的转发列表（也适用于视频转发）。 |
| `app/fetch_hot_search_categories` | GET | - | 获取微博热搜榜的所有可用分类列表。 |
| `app/fetch_hot_search` | GET | - | 获取微博热搜榜，支持多个分类。 |
| `app/fetch_user_profile_feed` | GET | - | 获取指定用户主页的动态流。 |
| `app/fetch_user_info` | GET | - | 获取微博用户的基本信息，包括昵称、头像、简介、关注数、粉丝数等。 |
| ... | | | 还有 10 个API |

## 注意事项

1. 使用前需配置环境变量 `MAXHUB_API_KEY`，新用户注册即赠送体验金
2. 批量操作（>10条）前会提示预计调用次数，请注意账户余额
3. 默认最多翻5页，如需更多数据请明确指定
4. 遇到429错误请等待30秒后重试

## 更新日志

v2.0.0 V2架构升级，全量API覆盖，兼容层设计，场景化展示
