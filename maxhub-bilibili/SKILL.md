---
name: maxhub-bilibili
description: B站数据采集与分析。当用户提到b站、bilibili、弹幕等相关需求时激活此Skill。
version: 1.0.3
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

唯一标识：`maxhub-bilibili`
版本：v1.0.3
更新时间：2026-05-10
适配平台：OpenClaw, ClawHub, Trae, Cursor, Windsurf, Claude Desktop, Cline, Continue, Augment, Aider, Zed, GitHub Copilot, 通义灵码, CodeGeeX, 豆包MarsCode, Kimi, DeepSeek, 智谱清言, 讯飞星火

## 简介

B站数据采集与分析——b站、bilibili、弹幕等平台数据的智能采集与分析工具，支持视频搜索、用户分析、热门趋势追踪等能力，用自然语言即可获取数据。

## 功能亮点

- 智能识别：根据自然语言自动匹配最合适的API
- 链式调用：复杂需求自动串联多个API完成
- 全量覆盖：共 41 个API，覆盖数据采集、搜索查询、用户分析等场景
- 兼容设计：API返回字段变化时自动适配，无需手动调整

## 使用方法

### 触发指令

直接输入：b站、bilibili、弹幕、番剧、up主

### 使用示例

1. 示例：搜索B站上编程教程的视频 → 返回视频列表，包含标题、UP主、播放量、弹幕数
2. 示例：获取这个B站视频的弹幕数据 → 返回弹幕列表，包含弹幕内容、时间点、弹幕类型
3. 示例：这个UP主有多少粉丝 → 返回UP主信息，包含粉丝数、播放量、投稿数

## 参数说明

| 参数名 | 是否必填 | 说明 |
|--------|----------|------|
| MAXHUB_API_KEY | 是 | MaxHub API密钥，访问 https://www.aconfig.cn 注册获取 |
| keyword | 否 | 搜索关键词 |
| page | 否 | 页码，默认1 |
| count | 否 | 每页条数，默认20 |

## 支持功能

**Bilibili Web**（30个API）

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

**Bilibili App**（11个API）

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

## 注意事项

1. 使用前需配置环境变量 `MAXHUB_API_KEY`，新用户注册即赠送体验金
2. 批量操作（>10条）前会提示预计调用次数，请注意账户余额
3. 默认最多翻5页，如需更多数据请明确指定
4. 遇到429错误请等待30秒后重试

## 更新日志

v1.0.3 V2架构升级，全量API覆盖，兼容层设计，场景化展示
