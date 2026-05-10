---
name: maxhub-douyin
description: 抖音数据采集与分析。当用户提到抖音、douyin、短视频热搜等相关需求时激活此Skill。
version: 2.0.0
author: MaxHub Team
license: MIT
trigger: "抖音|douyin|短视频热搜|抖音达人|抖音直播|抖音热榜|抖音视频|抖音博主"
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
    emoji: "🎵"
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
    - 抖音
    - douyin
    - 短视频热搜
    - 抖音达人
    - 抖音直播
    - 抖音热榜
    - 抖音视频
    - 抖音博主
---

# 🎵 抖音数据采集与分析

唯一标识：`maxhub-douyin`
版本：v2.0.0
更新时间：2026-05-10
适配平台：MaxHub / Tikhub

## 简介

抖音数据采集与分析——抖音、douyin、短视频热搜等平台数据的智能采集与分析工具，支持视频搜索、用户分析、热门趋势追踪等能力，用自然语言即可获取数据。

## 功能亮点

- 智能识别：根据自然语言自动匹配最合适的API
- 链式调用：复杂需求自动串联多个API完成
- 全量覆盖：共 286 个API，覆盖数据采集、搜索查询、用户分析等场景
- 兼容设计：API返回字段变化时自动适配，无需手动调整

## 使用方法

### 触发指令

直接输入：抖音、douyin、短视频热搜、抖音达人、抖音直播

### 使用示例

1. 示例：抖音热搜 → 返回当前热搜榜单，包含排名、话题、热度值
2. 示例：搜索抖音上关于AI绘画的热门视频 → 返回视频列表，包含标题、作者、播放量、点赞数
3. 示例：分析抖音博主@某某某的数据 → 返回博主信息，包含粉丝数、获赞数、作品数、IP属地
4. 示例：这个抖音视频的数据 https://v.douyin.com/xxx → 返回视频详情，包含播放量、点赞、评论、分享、收藏数据
5. 示例：这个抖音直播间有多少人在线 → 返回直播间信息，包含观看人数、点赞数、直播状态
6. 示例：这个视频的评论数据 → 返回评论列表，包含评论内容、点赞数、IP属地

## 参数说明

| 参数名 | 是否必填 | 说明 |
|--------|----------|------|
| MAXHUB_API_KEY | 是 | MaxHub API密钥，访问 https://www.aconfig.cn 注册获取 |
| keyword | 否 | 搜索关键词 |
| page | 否 | 页码，默认1 |
| count | 否 | 每页条数，默认20 |

## 支持功能

**Douyin Web**（71个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `web/fetch_cartoon_aweme` | GET | - | 二次元作品 |
| `web/fetch_user_profile_by_short_id` | GET | - | 使用Short ID获取用户信息 |
| `web/fetch_user_profile_by_uid` | GET | - | 使用UID获取用户信息 |
| `web/fetch_user_live_info_by_uid` | GET | - | 使用UID获取用户开播信息 |
| `web/handler_user_profile` | GET | - | 获取指定用户的信息 |
| `web/handler_user_profile_v2` | GET | - | 根据抖音号获取指定用户的信息 |
| `web/generate_a_bogus` | POST | - | 使用接口网址生成A-Bogus参数，提交的URL不能带有a_bogus参数，同时a_bogus参数与请求头中的User-Agent有关，需要一起提交和请求。 |
| `web/generate_x_bogus` | POST | - | 使用接口网址生成X-Bogus参数 |
| `web/encrypt_uid_to_sec_user_id` | GET | - | 加密用户uid到sec_user_id |
| `web/fetch_multi_video` | POST | - | 批量获取视频信息，支持图文、视频等，一次性最多支持50个视频，此接口收费固定价格为0.001$ * 50 = 0.05$一次。 |
| ... | | | 还有 61 个API |

**Douyin App V3**（47个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `app/v3` | POST | - | 批量获取视频信息，支持图文、视频等，一次性最多支持10个视频，此接口收费固定价格为0.001$ * 10 = 0.01$一次。 |
| `app/v3` | POST | - | 批量获取视频信息，支持图文、视频等，一次性最多支持50个视频，此接口收费固定价格为0.001$ * 50 = 0.05$一次。 |
| `app/v3` | POST | - | 此接口目前优惠活动价为$0.25，活动结束后恢复原价$0.5。不足50个视频按50个视频收费。 |
| `app/v3` | GET | - | 抖音APP注册设备，获取设备信息以及设备的Cookie信息。 |
| `app/v3` | GET | - | 根据分享口令获取分享信息，比如抖音文章的分享口令提取分享人信息和文章ID等然后再去请求单一作品数据接口获取文章内容。 |
| `app/v3` | GET | - | 根据分享链接获取单个作品数据 |
| `app/v3` | GET | - | 根据视频ID获取作品的统计数据，支持多个视频id，一次性最多支持50个视频。 |
| `app/v3` | GET | - | 根据视频ID来增加作品的播放数 |
| `app/v3` | GET | - | 根据视频ID获取作品的统计数据 |
| `app/v3` | GET | - | 生成抖音分享链接，唤起抖音APP，给指定用户发送私信。 |
| ... | | | 还有 37 个API |

**Douyin Search**（19个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `search/fetch_vision_search` | POST | - | 抖音APP图像识别搜索（以图搜图/视觉搜索）。 |
| `search/fetch_image_search_v3` | POST | - | 获取抖音 App 中图文内容搜索的结果。 |
| `search/fetch_image_search` | POST | - | 获取抖音 App 中图片内容搜索的结果。 |
| `search/fetch_multi_search` | POST | - | 获取抖音 App 中多种类型（视频、用户、音乐、话题等）的综合搜索结果。 |
| `search/fetch_school_search` | POST | - | 获取抖音 App 中学校信息的搜索结果。 |
| `search/fetch_search_suggest` | POST | - | 获取抖音 App 中搜索关键词的联想推荐结果。 |
| `search/fetch_user_search_v2` | POST | - | 获取抖音 App 中根据关键词搜索到的用户列表。 |
| `search/fetch_user_search` | POST | - | 获取抖音 App 中根据关键词搜索到的用户列表。 |
| `search/fetch_live_search_v1` | POST | - | 获取抖音 App 中直播搜索结果。 |
| `search/fetch_experience_search` | POST | - | 获取抖音 App 中经验（知识/教程）内容的搜索结果。 |
| ... | | | 还有 9 个API |

**Douyin Billboard**（31个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `billboard/fetch_hot_account_search_list` | GET | - | 获取搜索用户名或抖音号 |
| `billboard/fetch_hot_rise_list` | GET | - | 获取上升热点榜 |
| `billboard/fetch_city_list` | GET | - | 获取城市列表 |
| `billboard/fetch_hot_total_low_fan_list` | POST | - | 获取低粉爆款榜 |
| `billboard/fetch_hot_item_trends_list` | GET | - | 获取作品数据趋势 |
| `billboard/fetch_hot_user_portrait_list` | GET | - | 获取作品点赞观众画像 |
| `billboard/fetch_hot_comment_word_list` | GET | - | 获取作品评论分析-词云权重 |
| `billboard/fetch_hot_total_hot_word_list` | POST | - | 获取全部内容词 |
| `billboard/fetch_hot_total_hot_word_detail_list` | GET | - | 获取内容词详情 |
| `billboard/fetch_hot_city_list` | GET | - | 获取同城热点榜 |
| ... | | | 还有 21 个API |

**Douyin Creator**（17个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `creator/fetch_user_search` | GET | - | 搜索抖音用户，支持抖音号和抖音昵称搜索 |
| `creator/fetch_video_danmaku_list` | GET | - | 获取指定作品的弹幕列表，支持管理和筛选弹幕 |
| `creator/fetch_creator_hot_spot_billboard` | GET | - | 获取抖音创作者热点榜单数据 |
| `creator/fetch_creator_material_center_billboard` | GET | - | 获取抖音创作者中心热门视频榜单数据 |
| `creator/fetch_creator_material_center_config` | GET | - | 获取抖音创作者中心配置信息 |
| `creator/fetch_creator_content_category` | GET | - | 获取抖音创作者平台内容创作的合集分类列表 |
| `creator/fetch_creator_content_course` | GET | - | 获取抖音创作者平台指定分类的内容创作课程 |
| `creator/fetch_creator_activity_list` | GET | - | 获取抖音创作者活动列表数据 |
| `creator/fetch_creator_activity_detail` | GET | - | 获取抖音创作者活动详情数据 |
| `creator/fetch_creator_hot_challenge_billboard` | GET | - | 获取抖音创作者平台热门挑战榜单数据 |
| ... | | | 还有 7 个API |

**Douyin Creator V2**（14个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `creator_v2/fetch_item_list_download` | POST | - | 导出指定时间范围内前1000条投稿作品的详细数据 |
| `creator_v2/fetch_item_analysis_involved_vertical` | POST | - | 获取指定时间段内投稿作品涉及的垂类标签 |
| `creator_v2/fetch_item_danmaku_analysis` | POST | - | 获取抖音作品的弹幕分析数据 |
| `creator_v2/fetch_item_overview_data` | POST | - | 获取抖音作品总览数据，包括流量指标、审核状态、播放信息等 |
| `creator_v2/fetch_item_search_keyword` | POST | - | 获取抖音作品的搜索关键词统计数据 |
| `creator_v2/fetch_item_play_source` | POST | - | 获取抖音作品的流量来源统计数据 |
| `creator_v2/fetch_item_audience_others` | POST | - | 获取抖音作品的观众其他数据分析，包括受众分布和受众关注词 |
| `creator_v2/fetch_item_audience_portrait` | POST | - | 获取抖音作品的观众数据分析 |
| `creator_v2/fetch_item_watch_trend` | POST | - | 获取抖音作品的观看趋势分析数据 |
| `creator_v2/fetch_author_diagnosis` | POST | - | 获取抖音创作者账号的诊断数据和优化建议 |
| ... | | | 还有 4 个API |

**Douyin Index**（44个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `index/fetch_content_interact_trend` | POST | - | 获取指定垂类的互动数据（点赞/评论/分享/收藏等）随时间变化趋势 |
| `index/fetch_content_creative_keyword_items` | POST | - | 获取指定垂类下、指定热门关键词的相关视频列表 |
| `index/fetch_content_publish_trend` | GET | - | 获取指定垂类的视频发布数量随时间变化趋势 |
| `index/fetch_content_valid_date` | GET | - | 获取创作指南各类型数据的有效日期范围 |
| `index/fetch_content_creative_duration` | POST | - | 获取指定垂类下视频时长分布数据 |
| `index/fetch_content_creative_keywords` | POST | - | 获取指定垂类下创作热门关键词 |
| `index/fetch_content_creative_topic` | POST | - | 获取指定垂类下创作热门话题 |
| `index/fetch_content_author_portrait` | POST | - | 获取指定垂类下**创作者**人群画像（即"发布该垂类视频的作者"画像） |
| `index/fetch_brand_suggest` | POST | - | 获取品牌搜索的自动补全建议列表 |
| `index/fetch_encrypt_user_id` | GET | - | 将抖音 uid（纯数字）转换为抖音指数 API 内部使用的加密 user_id |
| ... | | | 还有 34 个API |

**Douyin Xingtu**（22个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `xingtu/search_kol_v1` | GET | - | 关键词搜索kol V1 |
| `xingtu/get_xingtu_kolid_by_sec_user_id` | GET | - | 通过抖音sec_user_id获取游客星图kolid |
| `xingtu/get_xingtu_kolid_by_unique_id` | GET | - | 通过抖音号获取游客星图kolid |
| `xingtu/get_xingtu_kolid_by_uid` | GET | - | 通过抖音用户ID获取游客星图kolid |
| `xingtu/kol_rec_videos_v1` | GET | - | 获取kol内容表现V1 |
| `xingtu/kol_base_info_v1` | GET | - | 获取kol基本信息V1 |
| `xingtu/kol_cp_info_v1` | GET | - | 获取kol性价比能力分析V1 |
| `xingtu/kol_data_overview_v1` | GET | - | 获取kol数据概览V1 |
| `xingtu/kol_xingtu_index_v1` | GET | - | 获取kol星图指数V1 |
| `xingtu/kol_service_price_v1` | GET | - | 获取kol服务报价V1 |
| ... | | | 还有 12 个API |

**Douyin Xingtu V2**（21个API）

| API | 方法 | 必填参数 | 说明 |
|:---|:---|:---|:---|
| `xingtu_v2/get_demander_mcn_list` | GET | - | 搜索MCN机构列表 |
| `xingtu_v2/get_excellent_case_category_list` | GET | - | 获取连接用户漏斗中的优秀行业分类列表 |
| `xingtu_v2/get_content_trend_guide` | GET | - | 获取内容趋势指南数据（CDN静态JSON，无需Cookie） |
| `xingtu_v2/get_author_spread_info` | GET | - | 获取创作者商业能力的传播价值信息 |
| `xingtu_v2/get_author_local_info` | GET | - | 获取创作者位置信息 |
| `xingtu_v2/get_author_content_hot_keywords` | GET | - | 获取创作者内容热词 |
| `xingtu_v2/get_author_business_card_info` | GET | - | 获取创作者商业卡片信息 |
| `xingtu_v2/get_author_base_info` | GET | - | 获取创作者基本信息 |
| `xingtu_v2/get_author_show_items` | GET | - | 获取创作者视频列表 |
| `xingtu_v2/get_author_hot_comment_tokens` | GET | - | 获取创作者评论热词 |
| ... | | | 还有 11 个API |

## 注意事项

1. 使用前需配置环境变量 `MAXHUB_API_KEY`，新用户注册即赠送体验金
2. 批量操作（>10条）前会提示预计调用次数，请注意账户余额
3. 默认最多翻5页，如需更多数据请明确指定
4. 遇到429错误请等待30秒后重试

## 更新日志

v2.0.0 V2架构升级，全量API覆盖，兼容层设计，场景化展示
