---
name: maxhub-youtube
description: YouTube数据采集与分析。当用户提到youtube、视频、频道等相关需求时激活此Skill。
version: 1.0.10
author: MaxHub Team
license: MIT
trigger: "youtube|视频|频道|评论|播放列表|youtube搜索"
categories:
  - social-media
  - data-collection
  - video-platform
tools:
  - http
metadata:
  openclaw:
    requires:
      env:
        - MAXHUB_API_KEY
    primaryEnv: MAXHUB_API_KEY
    emoji: "▶️"
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
    - youtube
    - 视频
    - 频道
    - 评论
    - 播放列表
    - youtube搜索
---

# ▶️ YouTube数据采集与分析

唯一标识：`maxhub-youtube`
版本：v1.0.10
更新时间：2026-05-10
适配平台：OpenClaw, ClawHub, Trae, Cursor, Windsurf, Claude Desktop, Cline, Continue, Augment, Aider, Zed, GitHub Copilot, 通义灵码, CodeGeeX, 豆包MarsCode, Kimi, DeepSeek, 智谱清言, 讯飞星火

## 简介

YouTube数据采集与分析——youtube、视频、频道等平台数据的智能采集与分析工具，支持视频搜索、用户分析、热门趋势追踪等能力，用自然语言即可获取数据。

## 功能亮点

- 智能识别：根据自然语言自动匹配最合适的API
- 链式调用：复杂需求可串联多个API完成（需用户明确确认后执行）
- 全量覆盖：共 44 个API，覆盖数据采集、搜索查询、用户分析等场景
- 兼容设计：API返回字段变化时自动适配，无需手动调整

## 使用方法

### 触发指令

直接输入：youtube、视频、频道、评论、播放列表

### 使用示例

1. 示例：Search YouTube for AI tutorials → 返回视频列表，包含标题、频道、观看数、点赞数

## 参数说明

| 参数名 | 是否必填 | 说明 |
|--------|----------|------|
| MAXHUB_API_KEY | 是 | MaxHub API密钥，访问 https://www.aconfig.cn 注册获取 |
| keyword | 否 | 搜索关键词 |
| page | 否 | 页码，默认1 |
| count | 否 | 每页条数，默认20 |

## 支持功能

**YouTube Web**（21个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `web/get_shorts_search` | GET | - | YouTube Shorts短视频专门搜索，使用原生YouTube API接口 |
| `web/get_channel_url` | GET | - | 从YouTube频道ID转换获取频道Handle (@用户名) |
| `web/get_channel_id_v2` | GET | - | 从YouTube频道URL转换获取频道ID（channel_id）。 |
| `web/search_video` | GET | - | 搜索视频。 |
| `web/search_channel` | GET | - | 搜索频道。 |
| `web/get_general_search` | GET | - | YouTube综合搜索，支持多种过滤条件，可以精确筛选搜索结果 |
| `web/get_relate_video` | GET | - | 根据视频ID获取推荐视频数据。 |
| `web/get_video_comment_replies` | GET | - | 获取视频二级评论 |
| `web/get_video_info` | GET | - | 获取视频元数据及下载信息 |
| `web/get_video_info_v2` | GET | - | 获取视频元数据及下载信息 |
| ... | | | 还有 11 个API |

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
