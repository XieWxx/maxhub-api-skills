---
name: maxhub-reddit
description: Reddit数据采集。当用户提到reddit、社区、帖子等相关需求时激活此Skill。
version: 2.0.0
author: MaxHub Team
license: MIT
trigger: "reddit|社区|帖子|评论|subreddit|reddit搜索"
categories:
  - social-media
  - data-collection
  - community
tools:
  - http
metadata:
  openclaw:
    requires:
      env:
        - MAXHUB_API_KEY
    primaryEnv: MAXHUB_API_KEY
    emoji: "🤖"
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
    - reddit
    - 社区
    - 帖子
    - 评论
    - subreddit
    - reddit搜索
---

# 🤖 Reddit数据采集

唯一标识：`maxhub-reddit`
版本：v2.0.0
更新时间：2026-05-10
适配平台：MaxHub / Tikhub

## 简介

Reddit数据采集——reddit、社区、帖子等平台数据的智能采集与分析工具，支持视频搜索、用户分析、热门趋势追踪等能力，用自然语言即可获取数据。

## 功能亮点

- 智能识别：根据自然语言自动匹配最合适的API
- 链式调用：复杂需求自动串联多个API完成
- 全量覆盖：共 0 个API，覆盖数据采集、搜索查询、用户分析等场景
- 兼容设计：API返回字段变化时自动适配，无需手动调整

## 使用方法

### 触发指令

直接输入：reddit、社区、帖子、评论、subreddit

### 使用示例

1. 示例：Search Reddit for AI news → 返回帖子列表，包含标题、投票数、评论数

## 参数说明

| 参数名 | 是否必填 | 说明 |
|--------|----------|------|
| MAXHUB_API_KEY | 是 | MaxHub API密钥，访问 https://www.aconfig.cn 注册获取 |
| keyword | 否 | 搜索关键词 |
| page | 否 | 页码，默认1 |
| count | 否 | 每页条数，默认20 |

## 支持功能

## 注意事项

1. 使用前需配置环境变量 `MAXHUB_API_KEY`，新用户注册即赠送体验金
2. 批量操作（>10条）前会提示预计调用次数，请注意账户余额
3. 默认最多翻5页，如需更多数据请明确指定
4. 遇到429错误请等待30秒后重试

## 更新日志

v2.0.0 V2架构升级，全量API覆盖，兼容层设计，场景化展示
