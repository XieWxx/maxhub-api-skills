---
name: maxhub-kuaishou
description: 快手数据采集与分析。当用户提到快手、kuaishou、快手视频等相关需求时激活此Skill。
version: 1.0.7
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

唯一标识：`maxhub-kuaishou`
版本：v1.0.7
更新时间：2026-05-10
适配平台：OpenClaw, ClawHub, Trae, Cursor, Windsurf, Claude Desktop, Cline, Continue, Augment, Aider, Zed, GitHub Copilot, 通义灵码, CodeGeeX, 豆包MarsCode, Kimi, DeepSeek, 智谱清言, 讯飞星火

## 简介

快手数据采集与分析——快手、kuaishou、快手视频等平台数据的智能采集与分析工具，支持视频搜索、用户分析、热门趋势追踪等能力，用自然语言即可获取数据。

## 功能亮点

- 智能识别：根据自然语言自动匹配最合适的API
- 链式调用：复杂需求自动串联多个API完成
- 全量覆盖：共 33 个API，覆盖数据采集、搜索查询、用户分析等场景
- 兼容设计：API返回字段变化时自动适配，无需手动调整

## 使用方法

### 触发指令

直接输入：快手、kuaishou、快手视频、快手直播、快手电商

### 使用示例

1. 示例：搜索快手上的美食视频 → 返回视频列表，包含标题、作者、播放量

## 参数说明

| 参数名 | 是否必填 | 说明 |
|--------|----------|------|
| MAXHUB_API_KEY | 是 | MaxHub API密钥，访问 https://www.aconfig.cn 注册获取 |
| keyword | 否 | 搜索关键词 |
| page | 否 | 页码，默认1 |
| count | 否 | 每页条数，默认20 |

## 支持功能

**Kuaishou App**（20个API）

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
| `app/fetch_one_video_by_url` | GET | - | 根据链接获取单个作品数据 |
| ... | | | 还有 10 个API |

**Kuaishou Web**（13个API）

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

## 注意事项

1. 使用前需配置环境变量 `MAXHUB_API_KEY`，新用户注册即赠送体验金
2. 批量操作（>10条）前会提示预计调用次数，请注意账户余额
3. 默认最多翻5页，如需更多数据请明确指定
4. 遇到429错误请等待30秒后重试

## 更新日志

v1.0.7 V2架构升级，全量API覆盖，兼容层设计，场景化展示
