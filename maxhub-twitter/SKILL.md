---
name: maxhub-twitter
description: Twitter/X数据采集与分析。当用户提到twitter、x、推文等相关需求时激活此Skill。
version: 1.1.1
author: MaxHub Team
license: MIT
trigger: "twitter|x|推文|tweet|话题|twitter搜索"
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
    emoji: "🐦"
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
    - twitter
    - x
    - 推文
    - tweet
    - 话题
    - twitter搜索
---

# 🐦 Twitter/X数据采集与分析

唯一标识：`maxhub-twitter`
版本：v1.0.10
更新时间：2026-05-10
适配平台：OpenClaw, ClawHub, Trae, Cursor, Windsurf, Claude Desktop, Cline, Continue, Augment, Aider, Zed, GitHub Copilot, 通义灵码, CodeGeeX, 豆包MarsCode, Kimi, DeepSeek, 智谱清言, 讯飞星火

## 简介

Twitter/X数据采集与分析——twitter、x、推文等平台数据的智能采集与分析工具，支持视频搜索、用户分析、热门趋势追踪等能力，用自然语言即可获取数据。

## 功能亮点

- 智能识别：根据自然语言自动匹配最合适的API
- 链式调用：复杂需求可串联多个API完成（需用户明确确认后执行）
- 全量覆盖：共 13 个API，覆盖数据采集、搜索查询、用户分析等场景
- 兼容设计：API返回字段变化时自动适配，无需手动调整

## 使用方法

### 触发指令

直接输入：twitter、x、推文、tweet、话题

### 使用示例

1. 示例：Search tweets about AI → 返回推文列表，包含内容、转发数、点赞数

## 参数说明

| 参数名 | 是否必填 | 说明 |
|--------|----------|------|
| MAXHUB_API_KEY | 是 | MaxHub API密钥，访问 https://www.aconfig.cn 注册获取 |
| keyword | 否 | 搜索关键词 |
| page | 否 | 页码，默认1 |
| count | 否 | 每页条数，默认20 |

## 支持功能

**Twitter Web**（13个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `web/fetch_search_timeline` | GET | - | 搜索 |
| `web/fetch_user_followings` | GET | - | 获取用户关注 |
| `web/fetch_user_followers` | GET | - | 获取用户粉丝 |
| `web/fetch_tweet_detail` | GET | - | 获取单个推文数据 |
| `web/fetch_latest_post_comments` | GET | - | 获取最新的推文评论 |
| `web/fetch_user_post_tweet` | GET | - | 获取用户发帖 |
| `web/fetch_user_media` | GET | - | 获取用户媒体 |
| `web/fetch_user_tweet_replies` | GET | - | 获取用户推文回复 |
| `web/fetch_user_profile` | GET | - | 获取用户资料 |
| `web/fetch_user_highlights_tweets` | GET | - | 获取用户高光推文 |
| ... | | | 还有 3 个API |

## 注意事项

1. 使用前需配置环境变量 `MAXHUB_API_KEY`，新用户注册即赠送体验金
2. 批量操作（>10条）前会提示预计调用次数，请注意账户余额
3. 默认最多翻5页，如需更多数据请明确指定
4. 遇到429错误请等待30秒后重试


## 数据隐私说明

- 本Skill通过MaxHub API（aconfig.cn）获取数据，用户查询参数将发送至该服务
- 请勿提交涉及个人隐私的敏感信息
- API密钥仅在本地环境变量中读取，不会外泄
## 更新日志

v1.0.8 安全修复(请求超时/凭证校验)、Bug修复(参数映射/未定义变量)、代码优化(移除冗余依赖)
v1.0.7 V2架构升级，全量API覆盖，兼容层设计，场景化展示
