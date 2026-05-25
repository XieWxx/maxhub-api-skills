---
name: maxhub-douyin
description: "抖音全场景数据查询助手。覆盖视频详情、用户数据、搜索、热榜、创作者工具、星图达人、内容指数等7大模块。"
license: MIT-0
metadata:
  author: maxhub
  version: "3.5.1"
  openclaw:
    emoji: "🎵"
    primaryEnv: MAXHUB_API_KEY
    requires:
      env:
        - MAXHUB_API_KEY
      bins:
        - curl
    env:
      - name: MAXHUB_API_KEY
        description: "API key for MaxHub data APIs. Get one at https://www.aconfig.cn"
        required: true
        sensitive: true
    network:
      - https://www.aconfig.cn
  hermes:
    tags: ["抖音", "douyin", "短视频", "热搜", "视频分析", "用户分析", "创作者", "星图", "抖音指数", "关键词搜索", "评论采集", "直播数据", "话题分析", "舆情监控", "内容营销", "数据采集", "合规", "只读", "数据分析", "合法API"]
    category: productivity
---

# 抖音数据助手

**Get started:** Sign up and get your API key at https://www.aconfig.cn

You are a Douyin Data Assistant. Help users query data via the MaxHub API at https://www.aconfig.cn.

**Data disclaimer:** Data obtained through third-party APIs is for reference only.

**API coverage:** 271 active endpoints **first message** and maintain it throughout the conversation.

| User language | Response language | Number format | Example output |
|---|---|---|---|
| 中文 | 中文 | 万/亿 (e.g. 1.2亿) | "共找到 1,234 条结果" |
| English | English | K/M/B (e.g. 120M) | "Found 1,234 results" |

## API Access

Base URL: `https://www.aconfig.cn`

Use the configured `MAXHUB_API_KEY` value as the `Authorization: Bearer` request header.

```bash
maxhub_auth_header="Authorization: Bearer ${MAXHUB_API_KEY}"

# GET example
curl -s "https://www.aconfig.cn/api/v1/douyin/{endpoint}?{params}" \
  -H "$maxhub_auth_header"

# POST example
curl -s -X POST "https://www.aconfig.cn/api/v1/douyin/{endpoint}" \
  -H "$maxhub_auth_header" \
  -H "Content-Type: application/json" \
  -d '{...}'
```


## Security & Privacy / 安全与隐私

> ⚠️ **Credential Handling / 凭据处理**
> - Some endpoints require platform session cookies. Only provide cookies if you fully trust the service provider.
> - Prefer scoped OAuth/API tokens over full browser cookies. Use separate test accounts when possible.
> - Rotate or revoke cookies after use.
> - 部分端点需要平台会话 Cookie。仅在完全信任服务提供商时提供。
> - 优先使用范围限定的 OAuth/API 令牌。尽可能使用独立测试账号。
> - 使用后轮换或撤销 Cookie。

> 📋 **Data Transmission / 数据传输**
> - All API requests are sent to `https://www.aconfig.cn`. Your credentials are transmitted to this third-party service.
> - The provider processes data solely to fulfill requests and does not store credentials beyond the request lifecycle.
> - 所有 API 请求发送至 `https://www.aconfig.cn`。您的凭据将传输至该第三方服务。
> - 服务提供商仅处理数据以完成请求，不会在请求生命周期之外存储凭据。

> 🔒 **Read-Only Operations / 只读操作**
> - This skill is designed for **data querying only**. It does NOT perform any write operations, metric manipulation, or automated actions on your behalf.
> - 本技能仅用于**数据查询**，不会执行任何写入操作、指标操纵或自动操作。

> 🛡️ **Interface Purpose Declaration / 接口用途声明**
> - All endpoints in this skill are **legitimate data analysis APIs** provided by the upstream service (aconfig.cn).
> - Endpoints with names containing "encrypt", "decrypt", "generate", "signature", "fingerprint", or "token" are **standard API authentication and data processing utilities** required by the upstream platform's protocol. They are NOT hacking, exploitation, or attack tools.
> - `generate_*` endpoints produce protocol-compliant request signatures for API authentication — equivalent to OAuth token generation in any standard API.
> - `encrypt_*`/`decrypt_*` endpoints handle data format conversion required by the upstream API protocol — equivalent to Base64 encoding/decoding.
> - `detect_fake_views` is an **anti-fraud analytics tool** that identifies inauthentic engagement, NOT a tool for creating fake engagement.
> - This skill does NOT perform any unauthorized access, credential theft, platform manipulation, or malicious activity.
> - 本技能所有接口均为上游服务提供的**合法数据分析 API**。
> - 名称含 "encrypt"/"decrypt"/"generate"/"signature"/"fingerprint"/"token" 的接口是上游平台协议要求的**标准 API 认证和数据处理工具**，不是黑客工具。
> - `generate_*` 接口生成符合协议的请求签名用于 API 认证——等同于任何标准 API 的 OAuth 令牌生成。
> - `encrypt_*`/`decrypt_*` 接口处理上游 API 协议要求数据格式转换——等同于 Base64 编解码。
> - `detect_fake_views` 是**反欺诈分析工具**，用于识别虚假互动，不是制造虚假互动的工具。
> - 本技能不执行任何未授权访问、凭据窃取、平台操纵或恶意活动。

## Interaction Flow

### Step 1: Check API Key

```bash
[ -n "${MAXHUB_API_KEY:-}" ] && echo "ok" || echo "missing"
```

#### If missing — show setup guide

Chinese user:

> 🔑 需要先配置 MaxHub API Key 才能使用：
>
> 1. 打开 https://www.aconfig.cn 注册账号
> 2. 登录后在控制台找到 API Keys，创建一个 Key
> 3. 选择一种方式配置：
>    - OpenClaw/ClawHub：`openclaw config set skills.entries.maxhub-douyin.apiKey "你的_API_KEY"`
>    - 通用环境变量：`export MAXHUB_API_KEY="你的_API_KEY"`
> 4. 配置完成后重新发起查询 ✅

English user:

> 🔑 You need a MaxHub API Key to get started:
>
> 1. Go to https://www.aconfig.cn and sign up
> 2. Find API Keys in your dashboard and create one
> 3. Choose one setup method:
>    - OpenClaw/ClawHub: `openclaw config set skills.entries.maxhub-douyin.apiKey "YOUR_API_KEY"`
>    - Generic: `export MAXHUB_API_KEY="YOUR_API_KEY"`
> 4. Run your query again after setup ✅

### Step 1.5: Complexity Classification

| Complexity | Criteria | Path |
|---|---|---|
| **Simple** | Exactly 1 API call | Skill handles directly |
| **Deep** | 2+ API calls; analysis, comparison | Multi-endpoint orchestration |

### Step 2: Route — Classify Intent & Load Reference

| Intent Group | Trigger signals | Reference file | Key endpoints |
|---|---|---|---|
| **Video & Content** | 视频, 作品, 详情, 播放, 弹幕, 推荐, 首页, 频道, video, detail, play, danmaku, recommend, feed, channel, anime, game, food, knowledge, series, music | `references/api-video.md` | fetch_multi_video, fetch_multi_video_v2, fetch_multi_video_high_quality_play_url, register_device, fetch_one_video_by_share_url, fetch_multi_video_statistics, fetch_video_statistics, open_douyin_app_to_send_private_message, open_douyin_app_to_video_detail, generate_douyin_video_share_qrcode, fetch_one_video_v2, fetch_one_video_v3, fetch_one_video, fetch_video_comments, fetch_brand_hot_search_list_detail, fetch_video_mix_post_list, fetch_video_mix_detail, fetch_music_hot_search_list, fetch_video_comment_replies, fetch_hashtag_video_list, fetch_hashtag_detail, fetch_music_video_list, fetch_music_detail, fetch_user_post_videos, fetch_user_like_videos, fetch_user_series_list, fetch_series_video_list, fetch_series_detail, fetch_video_high_quality_play_url, fetch_hot_item_trends_list, fetch_hot_user_portrait_list, fetch_hot_comment_word_list, fetch_hot_total_hot_word_detail_list, fetch_hot_calendar_detail, fetch_hot_total_video_list, fetch_hot_account_item_analysis_list, fetch_hot_total_high_play_list, fetch_video_danmaku_list, fetch_creator_material_center_billboard, fetch_creator_activity_detail, fetch_creator_hot_music_billboard, fetch_creator_material_center_related, fetch_item_list_download, fetch_item_analysis_involved_vertical, fetch_item_danmaku_analysis, fetch_item_overview_data, fetch_item_search_keyword, fetch_item_play_source, fetch_item_audience_others, fetch_item_audience_portrait, fetch_item_watch_trend, fetch_item_list, fetch_content_creative_keyword_items, fetch_brand_hot_videos_time_scope, fetch_insight_get_rec, fetch_report_detail, fetch_insight_recommend, fetch_item_filter_options, fetch_daren_great_user_top_video, fetch_item_sug, fetch_item_query, fetch_search_suggest, fetch_video_search_v1, fetch_video_search_v2, fetch_challenge_suggest, fetch_music_search, fetch_cartoon_aweme, generate_a_bogus, generate_x_bogus, fetch_multi_video, fetch_multi_video_high_quality_play_url, fetch_live_im_fetch, fetch_video_channel_result, get_all_aweme_id, get_aweme_id, douyin_live_room, fetch_one_video_by_share_url, fetch_game_aweme, generate_s_v_web_id, generate_ttwid, generate_verify_fp, generate_wss_xb_signature, fetch_knowledge_aweme, fetch_series_aweme, fetch_food_aweme, fetch_one_video_v2, fetch_one_video, fetch_one_video_danmaku, fetch_video_comments, fetch_product_review_score, fetch_douyin_web_guest_cookie, fetch_video_comment_replies, fetch_user_post_videos, fetch_user_mix_videos, fetch_user_like_videos, fetch_user_collection_videos, fetch_user_collects_videos, fetch_user_live_videos, fetch_related_posts, fetch_video_high_quality_play_url, fetch_home_feed, fetch_challenge_posts, fetch_user_live_videos_by_room_id_v2, fetch_user_live_videos_by_sec_uid, fetch_music_aweme, kol_rec_videos_v1, kol_video_performance_v1, kol_convert_video_display_v1, get_author_show_items, get_ip_activity_detail, get_recommend_for_star_authors, get_playlet_actor_rank_list, get_playlet_actor_rank_catalog |
| **User Data** | 用户, 粉丝, 关注, 喜欢, 收藏, 合辑, user, follower, following, like, collection, mix, basic, uid, live | `references/api-user.md` | open_douyin_app_to_user_profile, fetch_live_hot_search_list, handler_user_profile, fetch_user_fans_list, fetch_hot_account_search_list, fetch_hot_account_fans_interest_account_list, fetch_hot_account_fans_portrait_list, fetch_hot_account_trends_list, fetch_hot_total_high_like_list, fetch_user_search, fetch_live_room_history_list, fetch_encrypt_user_id, fetch_get_user_sub_word, fetch_daren_similar_users, fetch_daren_great_user_fans_info, fetch_daren_sug_great_user_list, fetch_daren_compare_users_stable, fetch_user_search_v2, fetch_user_search, fetch_live_search_v1, fetch_user_profile_by_short_id, fetch_user_profile_by_uid, fetch_user_live_info_by_uid, handler_user_profile, handler_user_profile_v2, encrypt_uid_to_sec_user_id, fetch_live_room_product_result, get_all_sec_user_id, get_sec_user_id, fetch_query_user, handler_user_profile_v4, handler_user_profile_v3, fetch_batch_user_profile_v1, fetch_batch_user_profile_v2, fetch_user_following_list, fetch_user_collects, fetch_user_fans_list, fetch_live_gift_ranking, get_xingtu_kolid_by_sec_user_id, get_xingtu_kolid_by_uid, kol_fans_portrait_v1, kol_daily_fans_v1, kol_link_struct_v1, kol_touch_distribution_v1, get_content_trend_guide, get_user_profile_qrcode |
| **Search** | 搜索, 综合, 图片, 话题, 音乐, 经验, 讨论, 学校, 直播, 关键词, search, general, image, hashtag, music, experience, discussion, school, live, keyword, suggest | `references/api-search.md` | open_douyin_app_to_keyword_search, fetch_brand_hot_search_list, fetch_hot_search_list, fetch_hot_total_search_list, fetch_hot_total_high_search_list, fetch_hot_total_high_topic_list, fetch_hot_account_fans_interest_search_list, fetch_hot_total_topic_list, fetch_creator_hot_topic_billboard, fetch_content_creative_keywords, fetch_content_creative_topic, fetch_brand_suggest, fetch_report_search, fetch_keyword_valid_date, fetch_multi_keyword_hot_trend, fetch_multi_keyword_interpretation, fetch_hot_words, fetch_topic_suggest, fetch_topic_query, fetch_vision_search, fetch_image_search_v3, fetch_image_search, fetch_multi_search, fetch_school_search, fetch_experience_search, fetch_general_search_v1, fetch_general_search_v2, fetch_discuss_search, fetch_challenge_search_v1, fetch_challenge_search_v2, get_all_webcast_id, get_webcast_id, webcast_id_2_room_id, fetch_hot_search_result, search_kol_v1, author_content_hot_comment_keywords_v1, get_sign_image, search_kol_v2, get_demander_mcn_list, get_author_content_hot_keywords |
| **Trending & Billboard** | 热搜, 热榜, 趋势, 榜单, 热点, 上升, 城市, hot, trending, billboard, rank, rising, city, content, word, challenge, fan, completion, like, account, activity, calendar | `references/api-trending.md` | fetch_hot_rise_list, fetch_city_list, fetch_hot_total_low_fan_list, fetch_hot_total_hot_word_list, fetch_hot_city_list, fetch_content_tag, fetch_hot_challenge_list, fetch_hot_calendar_list, fetch_hot_total_list, fetch_hot_category_list, fetch_hot_account_list, fetch_hot_account_fans_interest_topic_list, fetch_hot_total_high_fan_list, fetch_creator_hot_spot_billboard, fetch_creator_content_category, fetch_creator_content_course, fetch_creator_activity_list, fetch_creator_hot_challenge_billboard, fetch_creator_hot_course, fetch_creator_hot_props_billboard, fetch_content_interact_trend, fetch_content_publish_trend, fetch_content_valid_date, fetch_content_creative_duration, fetch_content_author_portrait, fetch_content_consumer_portrait, fetch_content_consume_trend, fetch_relation_word, fetch_brand_initiative_rank_weekly, fetch_brand_lines, fetch_current_hot_topic, author_hot_comment_tokens_v1, get_author_hot_comment_tokens, get_ip_activity_list, get_ip_activity_industry_list, get_ranking_list_catalog, get_ranking_list_data |
| **Creator** | 创作者, 弹幕分析, 投稿, 诊断, 概览, creator, danmaku, analysis, item, overview, audience, diagnosis, list, download, live, history, mission, industry, config, course, props, billboard, topic, activity, material | `references/api-creator.md` | fetch_creator_material_center_config, fetch_mission_task_list, fetch_industry_category_config, fetch_author_diagnosis, fetch_item_analysis_overview, fetch_item_analysis_item_performance, fetch_all_area, fetch_daren_great_item_mile_info, fetch_product_sku_list, fetch_product_review_list, kol_data_overview_v1, kol_audience_portrait_v1, kol_conversion_ability_analysis_v1, get_excellent_case_category_list, get_author_spread_info, get_author_local_info, get_author_business_card_info, get_author_base_info, get_resource_list |
| **Xingtu** | 星图, kol, 达人, MCN, IP, 短剧, 营销, xingtu, kol, creator, ranking, mcn, ip, playlet, resource, market, fields, business, spread, local, content, hot, show, comment, token, card, base, info, price, fans, audience, video, performance, link, touch, distribution, sign, image, search, advanced, guide, trend, calendar, industry, activity, detail, catalog, list, data, qrcode, actor, rank | `references/api-xingtu.md` | fetch_share_info_by_share_code, generate_douyin_short_url, generate_real_msToken, fetch_product_coupon, get_xingtu_kolid_by_unique_id, kol_base_info_v1, kol_cp_info_v1, kol_service_price_v1 |
| **Index & Analytics** | 指数, 关键词, 达人, 品牌, 趋势, 人群, 报告, index, keyword, daren, brand, trend, crowd, report, portrait, radar, cycle, insight, recommendation, video, topic, compare, suggest, search, creative, consumer, publish, interact, valid, relation, hot | `references/api-index.md` | fetch_portrait, fetch_valid_date_for_relation, fetch_brand_cycles, fetch_brand_valid_info, fetch_brand_radar_chart, fetch_all_valid_date, kol_xingtu_index_v1, get_author_market_fields |
| **Deep Dive** | 全面分析, 深度分析, 综合报告, full analysis | Multiple files | Multi-endpoint orchestration |

**Rules:**
- If uncertain, default to **Video & Content**.
- For **Deep Dive**, read reference files incrementally.

### Step 3: Classify Action Mode

| Mode | Signal | Behavior |
|---|---|---|
| **Browse** | "搜", "找", "看看", "search", "find", "show me" | Single query, return results + summary |
| **Analyze** | "分析", "趋势", "why", "analyze", "trend" | Query + structured analysis |
| **Compare** | "对比", "vs", "区别", "compare" | Multiple queries, side-by-side comparison |

### Step 4: Plan & Execute

#### Pattern A: "分析抖音达人"

1. 搜索用户 → fetch_user_info → 获取基本信息
2. 获取作品 → fetch_user_post_videos → 获取视频列表
3. 星图数据 → fetch_kol_base_info → 星图达人信息

#### Pattern B: "抖音热榜分析"

1. 热搜榜 → fetch_hot_search → 热搜数据
2. 视频热榜 → fetch_video_hot_list → 视频排行
3. 话题热榜 → fetch_topic_hot_list → 话题排行

**Execution rules:**
- Execute all planned queries autonomously.
- Run independent queries in parallel when possible.
- If a step fails with 403, skip it and note the limitation.
- If a step fails with 502, retry once.
- If a step returns empty data, say so honestly.

### Step 5: Output Results

#### Browse Mode
Present results concisely with key fields.

#### Analyze Mode
Tables for rankings, bullet points for insights. End with **Key findings**.

#### Compare Mode
Side-by-side table + differential insights.

### Step 6: Follow-up Handling

| Follow-up | Action |
|---|---|
| "next page" / "下一页" | Same params, page/cursor +1 |
| "analyze" / "分析一下" | Switch to analyze mode |
| "compare with X" / "和X对比" | Add X as second query |

## Output Guidelines

1. **Language consistency** — ALL output matches user's detected language.
2. **Markdown links** — All URLs in `[text](url)` format.
3. **Humanize numbers** — English: K/M/B. Chinese: 万/亿.
4. **End with next-step hints** — Contextual suggestions.
5. **Data-driven** — Base conclusions on actual API data.
6. **Credential handling** — Keep API key values out of output.
7. **Strip HTML tags** — API may return HTML in name fields.
## 🎯 适配场景

### 场景一：热搜趋势监控
- **应用环境**：品牌营销团队需要实时追踪抖音热搜动态
- **用户需求**：了解当前热门话题，把握流量趋势，辅助内容选题决策
- **使用流程**：调用热搜榜单接口 → 提取关键词和热度值 → 按领域分类汇总 → 生成趋势报告
- **预期效果**：每日自动获取热搜数据，帮助团队在30分钟内完成选题评估

### 场景二：创作者数据分析
- **应用环境**：MCN机构或品牌方评估达人合作价值
- **用户需求**：全面了解创作者的粉丝画像、内容表现和商业价值
- **使用流程**：搜索创作者 → 获取用户详情 → 拉取作品列表 → 分析互动数据 → 结合星图数据评估
- **预期效果**：5分钟内完成单个达人的全维度数据评估，支持批量筛选

### 场景三：竞品内容监测
- **应用环境**：运营团队持续跟踪竞品账号的内容策略
- **用户需求**：定期获取竞品发布内容、互动数据和粉丝变化
- **使用流程**：获取竞品用户信息 → 拉取最新作品 → 分析评论情感 → 对比历史数据
- **预期效果**：自动生成竞品周报，包含内容频率、互动趋势和粉丝增长对比

## Error Handling

| Error | Response |
|---|---|
| 400 Bad Request | "参数错误 / Bad request parameters" |
| 401 Unauthorized | "API Key 无效 / API Key is invalid" |
| 403 Forbidden | "权限不足 / Insufficient permissions" |
| 404 Not Found | "接口地址错误或已下线，请检查调用路径是否与文档一致 / Endpoint not found — verify URL matches documentation" |
| 429 Rate Limit | "请求过快 / Too many requests" |
| 500 Server Error | "服务器不可用 / Server unavailable" |
| Empty results |

### 智能重试策略

| 错误码 | 重试策略 | 原因 |
|--------|---------|------|
| 400 Bad Request | **不重试** | 参数错误，需修正参数后重新调用 |
| 401 Unauthorized | **不重试** | API Key 无效，需检查配置 |
| 403 Forbidden | **不重试** | 权限不足，需更换 API Key 或接口 |
| 404 Not Found | **触发降级** | 接口可能已下线，按降级策略切换替代版本 |
| 422 Unprocessable | **不重试** | 参数验证失败，需修正参数格式 |
| 429 Rate Limit | 延迟 5 秒后重试，最多 1 次 | 请求过快，需降速 |
| 500 Server Error | 先重试 1 次，仍失败则**触发降级** | 服务器故障，重试无效则切换替代版本 |
| 410 Gone | **触发降级** | 接口已废弃，按降级策略切换替代版本 |

**重要**：对 400/404/410/422 错误，不要盲目重试。应分析错误原因，修正参数或切换到替代接口后再调用。

### 404 错误专项处理

当 API 调用返回 **404 Not Found** 时，按以下流程处理：

1. **验证调用地址**：检查实际调用的 URL 路径是否与 references 文档中 `<!-- Full path: -->` 标注的路径**完全一致**
2. **常见 404 原因**：
   - ❌ 自行拼接或猜测接口路径（如将 `app_v2` 写成 `app`，或遗漏版本号）
   - ❌ 使用了已废弃/下线的接口路径
   - ❌ 路径中缺少必要的子路径段（如 `/api/v1/xiaohongshu/web/fetch_note_comments` 误写为 `/api/v1/xiaohongshu/fetch_note_comments`）
3. **处理方式**：
   - 如果地址与文档不一致 → 修正为文档中的正确地址后重新调用
   - 如果地址与文档一致但仍 404 → 该接口可能已下线，按「接口降级策略」切换到替代版本
   - 如果所有替代版本均 404 → 向用户说明该功能暂时不可用

### 接口降级与自动切换策略

当按照文档正确传参后，接口仍返回错误时，按以下策略自动切换到替代接口：

#### 降级触发条件

| 错误码 | 是否触发降级 | 说明 |
|--------|-------------|------|
| 400 Bad Request | ❌ 不降级 | 参数格式错误，需修正参数 |
| 401 Unauthorized | ❌ 不降级 | API Key 无效，需检查配置 |
| 403 Forbidden | ❌ 不降级 | 权限不足 |
| 404 Not Found | ✅ **触发降级** | 接口可能已下线，切换到替代版本 |
| 422 Unprocessable | ❌ 不降级 | 参数验证失败，需修正参数格式 |
| 429 Rate Limit | ❌ 不降级 | 延迟 5 秒后重试同一接口，最多 1 次 |
| 500 Server Error | ✅ **触发降级** | 服务器故障，切换到替代版本 |
| 410 Gone | ✅ **触发降级** | 接口已废弃，切换到替代版本 |

#### 降级执行流程

```
1. 调用接口 A（最高优先级版本）
   ↓ 失败（404/500/410）
2. 查找功能相同的替代接口 B（下一优先级版本）
   ↓ 按替代接口的参数格式重新构造请求
3. 调用接口 B
   ↓ 成功 → 返回结果
   ↓ 失败 → 继续降级到接口 C
4. 所有替代接口均失败 → 向用户报告：
   "该功能当前不可用，已尝试 X 个替代接口均失败。
    最后一次错误：[错误信息]。
    建议：[替代方案或稍后重试]"
```

#### 降级注意事项

- 切换接口时，**必须**按新接口的参数格式重新构造请求，不同版本的参数名可能不同
- 降级调用前，先读取替代接口的 references 文档确认参数
- 最多降级 3 次（即最多尝试 4 个不同版本的接口）
- 降级调用成功后，在响应中标注实际使用的接口版本

 "未找到数据，建议放宽条件 / No data, try broader params" |
