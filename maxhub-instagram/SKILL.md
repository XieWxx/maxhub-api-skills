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

唯一标识：`maxhub-instagram`
版本：v2.0.0
更新时间：2026-05-10
适配平台：MaxHub / Tikhub

## 简介

Instagram数据采集——instagram、ins、图片等平台数据的智能采集与分析工具，支持视频搜索、用户分析、热门趋势追踪等能力，用自然语言即可获取数据。

## 功能亮点

- 智能识别：根据自然语言自动匹配最合适的API
- 链式调用：复杂需求自动串联多个API完成
- 全量覆盖：共 88 个API，覆盖数据采集、搜索查询、用户分析等场景
- 兼容设计：API返回字段变化时自动适配，无需手动调整

## 使用方法

### 触发指令

直接输入：instagram、ins、图片、reel、story

### 使用示例

1. 示例：Search Instagram user @xxx → 返回用户信息，包含粉丝数、帖子数、认证状态

## 参数说明

| 参数名 | 是否必填 | 说明 |
|--------|----------|------|
| MAXHUB_API_KEY | 是 | MaxHub API密钥，访问 https://www.aconfig.cn 注册获取 |
| keyword | 否 | 搜索关键词 |
| page | 否 | 页码，默认1 |
| count | 否 | 每页条数，默认20 |

## 支持功能

**Instagram V1**（29个API）

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

**Instagram V2**（27个API）

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

**Instagram V3**（32个API）

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

## 注意事项

1. 使用前需配置环境变量 `MAXHUB_API_KEY`，新用户注册即赠送体验金
2. 批量操作（>10条）前会提示预计调用次数，请注意账户余额
3. 默认最多翻5页，如需更多数据请明确指定
4. 遇到429错误请等待30秒后重试

## 更新日志

v2.0.0 V2架构升级，全量API覆盖，兼容层设计，场景化展示
