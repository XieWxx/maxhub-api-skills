---
name: maxhub-xiaohongshu
description: 小红书数据采集与分析。当用户提到小红书、xiaohongshu、red等相关需求时激活此Skill。
version: 1.1.1
author: MaxHub Team
license: MIT
trigger: "小红书|xiaohongshu|red|种草|笔记|小红书搜索"
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
    emoji: "📕"
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
    - 小红书
    - xiaohongshu
    - red
    - 种草
    - 笔记
    - 小红书搜索
---

# 📕 小红书数据采集与分析

唯一标识：`maxhub-xiaohongshu`
版本：v1.0.11
更新时间：2026-05-10
适配平台：OpenClaw, ClawHub, Trae, Cursor, Windsurf, Claude Desktop, Cline, Continue, Augment, Aider, Zed, GitHub Copilot, 通义灵码, CodeGeeX, 豆包MarsCode, Kimi, DeepSeek, 智谱清言, 讯飞星火

## 简介

小红书数据采集与分析——小红书、xiaohongshu、red等平台数据的智能采集与分析工具，支持视频搜索、用户分析、热门趋势追踪等能力，用自然语言即可获取数据。

## 功能亮点

- 智能识别：根据自然语言自动匹配最合适的API
- 链式调用：复杂需求可串联多个API完成（需用户明确确认后执行）
- 全量覆盖：共 77 个API，覆盖数据采集、搜索查询、用户分析等场景
- 兼容设计：API返回字段变化时自动适配，无需手动调整

## 使用方法

### 触发指令

直接输入：小红书、xiaohongshu、red、种草、笔记

### 使用示例

1. 示例：在小红书搜索平价护肤笔记 → 返回笔记列表，包含标题、作者、点赞数、收藏数
2. 示例：这个小红书博主的粉丝数 → 返回用户信息，包含粉丝数、获赞数、笔记数

## 参数说明

| 参数名 | 是否必填 | 说明 |
|--------|----------|------|
| MAXHUB_API_KEY | 是 | MaxHub API密钥，访问 https://www.aconfig.cn 注册获取 |
| keyword | 否 | 搜索关键词 |
| page | 否 | 页码，默认1 |
| count | 否 | 每页条数，默认20 |

## 支持功能

**Xiaohongshu Web**（16个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `web/sign` | POST | - | 小红书Web签名，用于获取小红书的一些数据。 |
| `web/search_users` | GET | - | 搜索用户 |
| `web/search_notes_v3` | GET | - | 搜索笔记 V3 |
| `web/search_notes` | GET | - | 搜索笔记 |
| `web/get_product_info` | GET | - | 通过分享链接获取小红书的商品信息 |
| `web/get_user_info` | GET | - | 获取用户信息 V1 |
| `web/get_user_info_v2` | GET | - | 获取用户信息 V2 |
| `web/get_user_notes_v2` | GET | - | 获取用户的笔记 |
| `web/get_note_info_v2` | GET | - | 获取笔记信息 V2 |
| ... | | | 还有 6 个API |

**Xiaohongshu App**（11个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `app/get_user_id_and_xsec_token` | GET | - | 从用户分享链接中提取用户ID和xsec_token |
| `app/extract_share_info` | GET | - | 从分享链接中提取笔记ID和xsec_token |
| `app/search_products` | GET | - | 搜索小红书商品 |
| `app/search_notes` | GET | - | 搜索小红书笔记 |
| `app/get_product_detail` | GET | - | 获取小红书商品详情信息 |
| `app/get_sub_comments` | GET | - | 获取评论的子评论（回复）列表 |
| `app/get_user_notes` | GET | - | 获取用户发布的笔记列表 |
| `app/get_user_info` | GET | - | 获取用户详情信息 |
| `app/get_note_info` | GET | - | 获取笔记信息 V1 |
| `app/get_note_info_v2` | GET | - | 获取笔记信息 V2 |
| ... | | | 还有 1 个API |

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
