---
name: maxhub-pipixia
description: 皮皮虾数据采集。当用户提到皮皮虾、pipixia、搞笑等相关需求时激活此Skill。
version: 1.0.6
author: MaxHub Team
license: MIT
trigger: "皮皮虾|pipixia|搞笑|段子"
categories:
  - social-media
  - data-collection
  - entertainment
tools:
  - http
metadata:
  openclaw:
    requires:
      env:
        - MAXHUB_API_KEY
    primaryEnv: MAXHUB_API_KEY
    emoji: "🦐"
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
    - 皮皮虾
    - pipixia
    - 搞笑
    - 段子
---

# 🦐 皮皮虾数据采集

唯一标识：`maxhub-pipixia`
版本：v1.0.6
更新时间：2026-05-10
适配平台：OpenClaw, ClawHub, Trae, Cursor, Windsurf, Claude Desktop, Cline, Continue, Augment, Aider, Zed, GitHub Copilot, 通义灵码, CodeGeeX, 豆包MarsCode, Kimi, DeepSeek, 智谱清言, 讯飞星火

## 简介

皮皮虾数据采集——皮皮虾、pipixia、搞笑等平台数据的智能采集与分析工具，支持视频搜索、用户分析、热门趋势追踪等能力，用自然语言即可获取数据。

## 功能亮点

- 智能识别：根据自然语言自动匹配最合适的API
- 链式调用：复杂需求自动串联多个API完成
- 全量覆盖：共 17 个API，覆盖数据采集、搜索查询、用户分析等场景
- 兼容设计：API返回字段变化时自动适配，无需手动调整

## 使用方法

### 触发指令

直接输入：皮皮虾、pipixia、搞笑、段子

### 使用示例

1. 示例：皮皮虾上的搞笑段子 → 返回内容列表，包含标题、点赞数、评论数

## 参数说明

| 参数名 | 是否必填 | 说明 |
|--------|----------|------|
| MAXHUB_API_KEY | 是 | MaxHub API密钥，访问 https://www.aconfig.cn 注册获取 |
| keyword | 否 | 搜索关键词 |
| page | 否 | 页码，默认1 |
| count | 否 | 每页条数，默认20 |

## 支持功能

**PiPiXia App**（17个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `app/fetch_increase_post_view_count` | GET | - | 增加作品浏览数。 |
| `app/fetch_search` | GET | - | 搜索接口，支持搜索用户、作品等。 |
| `app/fetch_short_url` | GET | - | 生成短连接。 |
| `app/fetch_post_statistics` | GET | - | 获取单个作品的统计数据，如点赞数、评论数、转发数等。 |
| `app/fetch_post_comment_list` | GET | - | 获取作品的评论列表。 |
| `app/fetch_post_detail` | GET | - | 获取单个作品数据，支持图文、视频等。 |
| `app/fetch_hot_search_board_list` | GET | - | 获取热搜榜单列表数据。 |
| `app/fetch_hot_search_board_detail` | GET | - | 获取热搜榜单详情数据。 |
| `app/fetch_hot_search_words` | GET | - | 获取热搜词条数据。 |
| `app/fetch_user_post_list` | GET | - | 获取用户作品列表，如视频、图文等。 |
| ... | | | 还有 7 个API |

## 注意事项

1. 使用前需配置环境变量 `MAXHUB_API_KEY`，新用户注册即赠送体验金
2. 批量操作（>10条）前会提示预计调用次数，请注意账户余额
3. 默认最多翻5页，如需更多数据请明确指定
4. 遇到429错误请等待30秒后重试

## 更新日志

v1.0.6 V2架构升级，全量API覆盖，兼容层设计，场景化展示
