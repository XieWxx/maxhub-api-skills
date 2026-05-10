---
name: maxhub-threads
description: Threads数据采集。当用户提到threads、meta、帖子等相关需求时激活此Skill。
version: 1.0.0
author: MaxHub Team
license: MIT
trigger: "threads|meta|帖子|threads搜索"
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
    emoji: "🧵"
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
    - threads
    - meta
    - 帖子
    - threads搜索
---

# 🧵 Threads数据采集

唯一标识：`maxhub-threads`
版本：v1.0.0
更新时间：2026-05-10
适配平台：OpenClaw, ClawHub, Trae, Cursor, Windsurf, Claude Desktop, Cline, Continue, Augment, Aider, Zed, GitHub Copilot, 通义灵码, CodeGeeX, 豆包MarsCode, Kimi, DeepSeek, 智谱清言, 讯飞星火

## 简介

Threads数据采集——threads、meta、帖子等平台数据的智能采集与分析工具，支持视频搜索、用户分析、热门趋势追踪等能力，用自然语言即可获取数据。

## 功能亮点

- 智能识别：根据自然语言自动匹配最合适的API
- 链式调用：复杂需求自动串联多个API完成
- 全量覆盖：共 11 个API，覆盖数据采集、搜索查询、用户分析等场景
- 兼容设计：API返回字段变化时自动适配，无需手动调整

## 使用方法

### 触发指令

直接输入：threads、meta、帖子、threads搜索

### 使用示例

1. 示例：Search Threads for AI discussion → 返回帖子列表，包含内容、点赞数、回复数

## 参数说明

| 参数名 | 是否必填 | 说明 |
|--------|----------|------|
| MAXHUB_API_KEY | 是 | MaxHub API密钥，访问 https://www.aconfig.cn 注册获取 |
| keyword | 否 | 搜索关键词 |
| page | 否 | 页码，默认1 |
| count | 否 | 每页条数，默认20 |

## 支持功能

**Threads Web**（11个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `web/search_recent` | GET | - | 搜索Threads最新内容 |
| `web/search_top` | GET | - | 搜索Threads热门内容 |
| `web/search_profiles` | GET | - | 搜索Threads用户档案 |
| `web/fetch_user_info_by_id` | GET | - | 根据用户ID获取Threads用户信息 |
| `web/fetch_post_comments` | GET | - | 获取Threads帖子评论列表 |
| `web/fetch_post_detail_v2` | GET | - | 获取Threads帖子详情（支持短代码和完整URL） |
| `web/fetch_post_detail` | GET | - | 获取Threads帖子详情 |
| `web/fetch_user_info` | GET | - | 获取Threads用户信息 |
| `web/fetch_user_replies` | GET | - | 获取Threads用户的回复列表 |
| `web/fetch_user_posts` | GET | - | 获取Threads用户的帖子列表 |
| ... | | | 还有 1 个API |

## 注意事项

1. 使用前需配置环境变量 `MAXHUB_API_KEY`，新用户注册即赠送体验金
2. 批量操作（>10条）前会提示预计调用次数，请注意账户余额
3. 默认最多翻5页，如需更多数据请明确指定
4. 遇到429错误请等待30秒后重试

## 更新日志

v1.0.0 V2架构升级，全量API覆盖，兼容层设计，场景化展示
