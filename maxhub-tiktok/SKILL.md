---
name: maxhub-tiktok
description: TikTok数据采集与分析。当用户提到tiktok、国际版抖音、海外短视频等相关需求时激活此Skill。
version: 1.0.5
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

唯一标识：`maxhub-tiktok`
版本：v1.0.5
更新时间：2026-05-10
适配平台：OpenClaw, ClawHub, Trae, Cursor, Windsurf, Claude Desktop, Cline, Continue, Augment, Aider, Zed, GitHub Copilot, 通义灵码, CodeGeeX, 豆包MarsCode, Kimi, DeepSeek, 智谱清言, 讯飞星火

## 简介

TikTok数据采集与分析——tiktok、国际版抖音、海外短视频等平台数据的智能采集与分析工具，支持视频搜索、用户分析、热门趋势追踪等能力，用自然语言即可获取数据。

## 功能亮点

- 智能识别：根据自然语言自动匹配最合适的API
- 链式调用：复杂需求自动串联多个API完成
- 全量覆盖：共 58 个API，覆盖数据采集、搜索查询、用户分析等场景
- 兼容设计：API返回字段变化时自动适配，无需手动调整

## 使用方法

### 触发指令

直接输入：tiktok、国际版抖音、海外短视频、tiktok creator、tiktok analytics

### 使用示例

1. 示例：Search TikTok videos about AI art → 返回视频列表，包含标题、作者、播放量、点赞数
2. 示例：TikTok creator @xxx analytics → 返回创作者信息，包含粉丝数、点赞数、视频数

## 参数说明

| 参数名 | 是否必填 | 说明 |
|--------|----------|------|
| MAXHUB_API_KEY | 是 | MaxHub API密钥，访问 https://www.aconfig.cn 注册获取 |
| keyword | 否 | 搜索关键词 |
| page | 否 | 页码，默认1 |
| count | 否 | 每页条数，默认20 |

## 支持功能

**TikTok Web**（58个API）

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

## 注意事项

1. 使用前需配置环境变量 `MAXHUB_API_KEY`，新用户注册即赠送体验金
2. 批量操作（>10条）前会提示预计调用次数，请注意账户余额
3. 默认最多翻5页，如需更多数据请明确指定
4. 遇到429错误请等待30秒后重试

## 更新日志

v1.0.5 V2架构升级，全量API覆盖，兼容层设计，场景化展示
