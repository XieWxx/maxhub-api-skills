# Param & Field Mapping Index / 参数与字段映射索引

Skill: `maxhub-tiktok` · Base URL: `https://www.aconfig.cn` · Version: `3.7.2`

> 本文件不重复端点完整说明（详见各 reference 文件），仅承担六个职能：
> 1. **全局红线 + 不支持能力清单**：防臆造的最强约束
> 2. **端点路由索引**：按 ID 快速定位 reference 文件
> 3. **字段流字典**：跨端点链式调用的字段索引
> 4. **错误处理总览 + 端点替换矩阵**：全 skill 共享的错误策略
> 5. **路径合法性硬校验**：以 `endpoints_whitelist.yaml` 为唯一可信源
> 6. **SKILL 更新机制**：版本检查 + SkillHub / ClawHub / GitHub 更新，详见 [`update.md`](./update.md)

---

## 0. 🚨 全局红线 (Global Forbidden) — 强制约束

> 以下规则**最高优先级**，任何端点级 ERR 表都不得突破。

1. **路径禁止臆造**：所有路径必须逐字符匹配 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml)；不在清单中 → **STOP**，禁止"换一个版本试试"、"改一改路径段试试"、"把 v1 改成 v2 试探"。
2. **404 / 400 必须先做防臆造自检**：见 [§ 3.1](#-31-防臆造自检清单404--400-处理前置步骤)，绕过自检直接重试或改路径都属于违反防臆造红线。
3. **写入操作禁止替代**：`add_video_play_count` 失败时，禁止用 `fetch_one_video` 等读端点"模拟"或"伪造"结果；必须 STOP 并让用户重新确认参数。
4. **写入端点 5xx 重试 ≤ 1 次**：避免重复扣配额。读端点可重试 1 次。
5. **找不到能力必须 STOP 并告知用户**：用户请求 TikTok 不支持的能力（见下方"不支持能力清单"）→ 直接告知该 skill 不支持，**禁止**用其他端点拼凑伪造结果。
6. **替换/降级前必须显式告知用户**：例如"由于 X 失败，已切换到 Y，数据完整度可能下降"；禁止静默降级。
7. **404 / 410 强制 STOP**：禁止 Agent 自行修改路径段后重试。**自检通过 + 持续 404** 时才建议用户更新 SKILL（详见 [`update.md`](./update.md)）。
8. **业务 `code != 0` 不重试**：业务错误（配额、合规、权限）不会因重试改变，必须读 `message_zh` 报告用户。
9. **仅 404 / 410 + 自检通过**才建议用户更新 SKILL：401 / 402 / 403 / 网络错**不是** SKILL 版本问题，禁止误导用户更新。
10. **TikTok Web API 返回的视频 CDN 链接需要 `tt_chain_token` Cookie**：访问 CDN 链接时必须携带 `Cookie: tt_chain_token={tt_chain_token}`，否则 HTTP 403。如需绕过此限制，使用 App V3 目录下的接口。
11. **Creator API 全部为 POST 方法且需要 cookie 认证**：调用前必须确认用户已授权提供 cookie。
12. **Shop API 需要 30 秒超时和 400 错误重试 3 次**：Shop 端点响应较慢，需设置合理超时。

---

## 0.1 ❌ 本 skill 不支持的能力 (Out of Scope)

> 用户请求以下功能时，**直接告知不支持并 STOP**。**禁止**用现有端点"拼凑"或"模拟"以下能力：

| 不支持的能力 | 说明 |
|------------|------|
| 发布/上传视频 | 无视频上传端点 |
| 点赞 / 取消点赞 | 无社交互动写入端点 |
| 评论 / 删评论 | 仅支持读评论，无写入端点 |
| 关注 / 取消关注 | 仅支持读关注列表 |
| 转发 / 分享操作 | 无写入端点（仅有生成分享链接的读取端点） |
| 修改用户资料 / 头像 | 无修改端点 |
| 发送私信 | 仅有唤起 APP 跳转链接，无直接发送私信端点 |
| 充值 / 计费查询 / 配额查询 | 在 https://www.aconfig.cn 控制台查询 |
| OAuth 用户授权操作 | 本 skill 仅支持 API Key 模式 |
| 视频编辑 / 二次剪辑 | 仅支持读取视频数据，不支持编辑 |
| 直播开播 / 推流 | 仅支持读取直播信息，无开播端点 |
| 下单 / 购买商品 | 仅支持读取商品信息，无交易端点 |

> 遇到上述请求 → 直接回复用户："本 skill 暂不支持此能力，建议在 TikTok 官方应用中操作"，**禁止**用 fetch_one_video / handler_user_profile 等端点伪造结果。

---

## 0.2 原子化 + 编排入口 (Atomic & Orchestration)

> Agent 可通过两层入口快速定位端点与链路：
> - **原子层**：[`atoms/_index.md`](./atoms/_index.md) — 每个端点封装为原子（atom_id ↔ endpoint_id 映射 + 幂等性 + 链路角色）
> - **编排层**：[`recipes/_index.md`](./recipes/_index.md) — 每个用户目标封装为 Recipe（trigger_keywords + 多步链路 + 容错）
> - **推荐流程**：用户语义 → `recipes/_index.md` 匹配 Recipe → 按 Recipe 的 Atomic Steps 调用 `atoms/_index.md` 中的原子

---

## 1. 端点路由索引 (Endpoint Routing Index)

> 按 reference 文件分组，快速定位端点所属文件。

### Video (video.md)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| fetch_one_video | 用 aweme_id 取单个视频详情（App V3，链式起点） | video.md | GET | low |
| fetch_one_video_v2 | 用 aweme_id 取单个视频详情 V2 | video.md | GET | low |
| fetch_one_video_v3 | 用 aweme_id 取单个视频详情 V3（支持国家参数） | video.md | GET | low |
| fetch_multi_video | 批量获取视频信息（最多 10 个） | video.md | POST | low |
| fetch_multi_video_v2 | 批量获取视频信息 V2（最多 25 个） | video.md | POST | low |
| fetch_one_video_by_share_url | 用分享链接取视频详情 | video.md | GET | low |
| fetch_one_video_by_share_url_v2 | 用分享链接取视频详情 V2 | video.md | GET | low |
| fetch_creator_search_insights_videos | 取创作者搜索洞察相关视频 | video.md | GET | low |
| fetch_home_feed_app_v3 | 取主页视频推荐（App V3） | video.md | POST | low |
| add_video_play_count | 增加视频播放数 ⚠️ 写入 | video.md | GET | **high ⚠️** |
| open_tiktok_app_to_video_detail | 唤起 APP 跳转视频详情 | video.md | GET | low |
| fetch_post_detail | 用 itemId 取视频详情（Web API，需 tt_chain_token） | video.md | GET | low |
| fetch_post_detail_v2 | 用 itemId 取视频详情 V2（Web API） | video.md | GET | low |
| fetch_explore_post | 取探索页视频 | video.md | GET | low |
| fetch_home_feed_web | 取首页推荐（Web API） | video.md | POST | low |
| fetch_tag_post | 用 challengeID 取 Tag 作品 | video.md | GET | low |
| fetch_user_mix | 用 mixId 取用户合辑 | video.md | GET | low |
| get_aweme_id | 从视频链接提取 aweme_id | video.md | GET | low |
| get_all_aweme_id | 批量提取 aweme_id | video.md | POST | low |

### User (user.md)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| get_user_id_and_sec_user_id_by_username | 用用户名获取 user_id 和 sec_user_id（**链式入口**） | user.md | GET | low |
| handler_user_profile | 用 user_id/sec_user_id/unique_id 获取用户信息 | user.md | GET | low |
| fetch_webcast_user_info | 获取 Webcast 用户信息 | user.md | GET | low |
| fetch_user_country_by_username | 用用户名获取账号国家 | user.md | GET | low |
| fetch_similar_user_recommendations | 获取类似用户推荐 | user.md | GET | low |
| fetch_user_repost_videos | 获取用户转发视频 | user.md | GET | low |
| fetch_user_post_videos | 获取用户主页视频 V1 | user.md | GET | low |
| fetch_user_post_videos_v2 | 获取用户主页视频 V2 | user.md | GET | low |
| fetch_user_post_videos_v3 | 获取用户主页视频 V3（精简快速） | user.md | GET | low |
| fetch_user_like_videos | 获取用户喜欢视频 | user.md | GET | low |
| fetch_user_follower_list | 获取粉丝列表（App V3） | user.md | GET | low |
| fetch_user_following_list | 获取关注列表（App V3） | user.md | GET | low |
| search_follower_list | 搜索粉丝列表 | user.md | GET | low |
| search_following_list | 搜索关注列表 | user.md | GET | low |
| fetch_user_music_list | 获取用户音乐列表 | user.md | GET | low |
| fetch_share_qr_code | 获取分享二维码 | user.md | GET | low |
| open_tiktok_app_to_user_profile | 唤起 APP 跳转用户主页 | user.md | GET | low |
| open_tiktok_app_to_send_private_message | 唤起 APP 发送私信 | user.md | GET | low |
| fetch_creator_info | 获取带货创作者信息 | user.md | GET | low |
| fetch_creator_showcase_product_list | 获取创作者橱窗商品 | user.md | GET | low |
| fetch_user_profile | 获取用户资料（Web API） | user.md | GET | low |
| fetch_user_post | 获取用户作品列表（Web API） | user.md | GET | low |
| fetch_user_repost | 获取用户转发（Web API） | user.md | GET | low |
| fetch_user_like | 获取用户点赞（Web API） | user.md | GET | low |
| fetch_user_collect | 获取用户收藏（Web API，需 cookie） | user.md | GET | low |
| fetch_user_play_list | 获取用户播放列表（Web API） | user.md | GET | low |
| fetch_user_fans | 获取粉丝列表（Web API） | user.md | GET | low |
| fetch_user_follow | 获取关注列表（Web API） | user.md | GET | low |
| fetch_user_live_detail | 获取用户直播详情（Web API） | user.md | GET | low |
| get_user_id | 从用户主页链接提取 user_id | user.md | GET | low |
| get_sec_user_id | 从用户主页链接提取 sec_user_id | user.md | GET | low |
| get_all_sec_user_id | 批量提取 sec_user_id | user.md | POST | low |
| get_unique_id | 从用户主页链接提取 unique_id | user.md | GET | low |
| get_all_unique_id | 批量提取 unique_id | user.md | POST | low |

### Comments & Live (comments.md)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| fetch_video_comments | 获取视频评论（App V3） | comments.md | GET | low |
| fetch_video_comment_replies | 获取评论回复（App V3） | comments.md | GET | low |
| fetch_post_comment | 获取视频评论（Web API） | comments.md | GET | low |
| fetch_post_comment_reply | 获取评论回复（Web API） | comments.md | GET | low |
| fetch_live_room_info | 获取直播间信息 | comments.md | GET | low |
| fetch_tiktok_live_data | 获取直播间数据（Web API） | comments.md | GET | low |
| check_live_room_online | 检测直播间在线状态 | comments.md | GET | low |
| check_live_room_online_batch | 批量检测直播间在线 | comments.md | POST | low |
| fetch_check_live_alive | 检测直播存活（Web API） | comments.md | GET | low |
| fetch_batch_check_live_alive | 批量检测直播存活（Web API） | comments.md | GET | low |
| fetch_live_ranking_list | 获取直播排行榜 | comments.md | GET | low |
| fetch_live_room_product_list | 获取直播间商品列表 | comments.md | GET | low |
| fetch_live_room_product_list_v2 | 获取直播间商品列表 V2 | comments.md | GET | low |
| fetch_live_daily_rank | 获取直播每日榜单 | comments.md | GET | low |
| tiktok_live_room | 获取直播间弹幕 | comments.md | GET | low |
| fetch_live_im_fetch | 获取直播间 IM 消息 | comments.md | GET | low |
| generate_wss_xb_signature | 生成 WSS 签名 | comments.md | GET | low |
| get_live_room_id | 从直播链接提取 room_id | comments.md | GET | low |
| fetch_live_gift_list | 获取直播礼物列表 | comments.md | GET | low |
| fetch_gift_name_by_id | 用 ID 查礼物名称 | comments.md | POST | low |
| fetch_gift_names_by_ids | 批量查礼物名称 | comments.md | POST | low |

### Search (search.md)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| fetch_general_search_result | 综合搜索（App V3） | search.md | GET | low |
| fetch_video_search_result | 视频搜索（App V3） | search.md | GET | low |
| fetch_user_search_result | 用户搜索（App V3） | search.md | GET | low |
| fetch_music_search_result | 音乐搜索（App V3） | search.md | GET | low |
| fetch_hashtag_search_result | 话题搜索（App V3） | search.md | GET | low |
| fetch_live_search_result | 直播搜索（App V3） | search.md | GET | low |
| fetch_location_search | 地点搜索 | search.md | GET | low |
| fetch_music_detail | 音乐详情 | search.md | GET | low |
| fetch_music_video_list | 音乐视频列表 | search.md | GET | low |
| fetch_music_chart_list | 音乐排行榜 | search.md | GET | low |
| fetch_hashtag_detail | 话题详情 | search.md | GET | low |
| fetch_hashtag_video_list | 话题视频列表 | search.md | GET | low |
| fetch_creator_search_insights | 创作者搜索洞察 | search.md | GET | low |
| fetch_creator_search_insights_detail | 搜索洞察详情 | search.md | GET | low |
| fetch_creator_search_insights_trend | 搜索洞察趋势 | search.md | GET | low |
| fetch_product_search | 商品搜索 | search.md | GET | low |
| fetch_share_short_link | 生成分享短链接 | search.md | GET | low |
| fetch_content_translate | 内容翻译 | search.md | POST | low |
| open_tiktok_app_to_keyword_search | 唤起 APP 搜索 | search.md | GET | low |
| fetch_general_search | 综合搜索（Web API） | search.md | GET | low |
| fetch_search_keyword_suggest | 搜索关键词建议 | search.md | GET | low |
| fetch_search_user | 用户搜索（Web API） | search.md | GET | low |
| fetch_search_video | 视频搜索（Web API） | search.md | GET | low |
| fetch_search_live | 直播搜索（Web API） | search.md | GET | low |
| fetch_search_photo | 照片搜索（Web API） | search.md | GET | low |
| fetch_tag_detail | Tag 详情（Web API） | search.md | GET | low |
| fetch_trending_searchwords | 趋势关键词 | search.md | GET | low |
| fetch_live_recommend | 直播推荐 | search.md | GET | low |
| fetch_live_recommend_tabs | 直播推荐标签 | search.md | GET | low |

### Ads (ads.md)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| get_ads_detail | 用 ads_id 取广告详情 | ads.md | GET | low |
| search_ads | 搜索广告 | ads.md | GET | low |
| get_top_ads_spotlight | 热门广告聚光灯 | ads.md | GET | low |
| get_ad_keyframe_analysis | 广告关键帧分析 | ads.md | GET | low |
| get_ad_percentile | 广告百分位分析 | ads.md | GET | low |
| get_ad_interactive_analysis | 广告互动分析 | ads.md | GET | low |
| get_recommended_ads | 推荐广告 | ads.md | GET | low |
| get_query_suggestions | 查询建议 | ads.md | GET | low |
| get_configure_safety | 安全配置 | ads.md | GET | low |
| get_location_list | 地区列表 | ads.md | GET | low |
| get_trends_hashtag_list | 趋势标签列表 | ads.md | GET | low |
| get_trends_hashtag_detail | 趋势标签详情 | ads.md | GET | low |

### Analytics (analytics.md)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| fetch_video_metrics | 视频指标（14 天趋势） | analytics.md | GET | low |
| detect_fake_views | 虚假流量检测（8 维度分析） | analytics.md | GET | low |
| fetch_comment_keywords | 评论关键词分析 | analytics.md | GET | low |
| fetch_creator_info_and_milestones | 创作者信息与里程碑 | analytics.md | GET | low |

### Creator (creator.md)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| get_account_health_status | 账号健康状态 | creator.md | POST | low |
| get_account_violation_list | 违规记录 | creator.md | POST | low |
| get_account_insights_overview | 账号概览 | creator.md | POST | low |
| get_live_analytics_summary | 直播概览 | creator.md | POST | low |
| get_video_analytics_summary | 视频概览 | creator.md | POST | low |
| get_video_list_analytics | 视频列表分析 | creator.md | POST | low |
| get_product_analytics_list | 商品列表分析 | creator.md | POST | low |
| get_creator_account_info | 创作者账号信息 | creator.md | POST | low |
| get_showcase_product_list | 橱窗商品 | creator.md | POST | low |
| get_video_associated_product_list | 视频关联商品 | creator.md | POST | low |
| get_video_detailed_stats | 视频详细统计 | creator.md | POST | low |
| get_video_to_product_stats | 视频-商品关联统计 | creator.md | POST | low |
| get_product_related_videos | 同款商品关联视频 | creator.md | POST | low |
| get_video_audience_stats | 视频受众分析 | creator.md | POST | low |

### Shop (shop.md)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| fetch_product_detail_app_v3 | 商品详情（App V3） | shop.md | GET | low |
| fetch_product_detail_v2_app_v3 | 商品详情 V2（App V3） | shop.md | GET | low |
| fetch_product_detail_v3_app_v3 | 商品详情 V3（App V3，支持 region） | shop.md | GET | low |
| fetch_product_detail_v4_app_v3 | 商品详情 V4（App V3，支持 region） | shop.md | GET | low |
| fetch_product_review_app_v3 | 商品评论（App V3） | shop.md | GET | low |
| fetch_shop_id_by_share_link | 通过分享链接获取店铺 ID | shop.md | GET | low |
| fetch_product_id_by_share_link | 通过分享链接获取商品 ID | shop.md | GET | low |
| fetch_shop_home_page_list | 商家主页列表 | shop.md | GET | low |
| fetch_shop_home | 商家主页 | shop.md | GET | low |
| fetch_shop_product_recommend | 商家商品推荐 | shop.md | GET | low |
| fetch_shop_product_list | 商家商品列表 | shop.md | GET | low |
| fetch_shop_product_list_v2 | 商家商品列表 V2 | shop.md | GET | low |
| fetch_shop_info | 商家信息 | shop.md | GET | low |
| fetch_shop_product_category | 商家分类 | shop.md | GET | low |
| fetch_product_detail_shop_web | 商品详情（Shop Web） | shop.md | GET | low |
| fetch_product_detail_v2_shop_web | 商品详情 V2（Shop Web） | shop.md | GET | low |
| fetch_product_detail_v3_shop_web | 商品详情 V3（Shop Web） | shop.md | GET | low |
| fetch_product_reviews_v2 | 商品评论 V2（Shop Web） | shop.md | GET | low |
| fetch_seller_products_list | 商家商品列表（Shop Web） | shop.md | GET | low |
| fetch_seller_products_list_v2 | 商家商品列表 V2（Shop Web） | shop.md | GET | low |
| fetch_search_word_suggestion_v2 | 搜索建议 V2 | shop.md | GET | low |
| fetch_search_products_list | 商品搜索（Shop Web） | shop.md | GET | low |
| fetch_search_products_list_v2 | 商品搜索 V2（Shop Web） | shop.md | GET | low |
| fetch_products_category_list | 分类列表 | shop.md | GET | low |
| fetch_products_by_category_id | 分类商品 | shop.md | GET | low |
| fetch_hot_selling_products_list | 热卖商品 | shop.md | GET | low |

### Tools (tools.md)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| generate_real_msToken | 生成 msToken | tools.md | GET | low |
| encrypt_strData | 加密 strData | tools.md | GET | low |
| decrypt_strData | 解密 strData | tools.md | GET | low |
| generate_fingerprint | 生成浏览器指纹 | tools.md | GET | low |
| generate_webid | 生成 web_id | tools.md | GET | low |
| generate_ttwid | 生成 ttwid | tools.md | GET | low |
| generate_xbogus | 生成 XBogus | tools.md | POST | low |
| generate_xgnarly | 生成 XGnarly | tools.md | POST | low |
| generate_xgnarly_and_xbogus | 同时生成 XGnarly 和 XBogus | tools.md | POST | low |
| generate_x_mssdk_info | 生成 X-Mssdk-Info | tools.md | POST | low |
| generate_hashed_id | 生成哈希 ID | tools.md | GET | low |
| fetch_tiktok_web_guest_cookie | 获取游客 Cookie | tools.md | GET | low |
| device_register | 设备注册 | tools.md | GET | low |
| TTencrypt_algorithm | TT 加密算法 | tools.md | POST | low |
| encrypt_decrypt_login_request | 登录请求加密 | tools.md | POST | low |

---

## 2. 字段流字典 (Field Flow Dictionary)

> 当用户需要的数据需要"先 A 再 B"才能取到时，查此表确认字段如何在端点间传递，避免 Agent 臆造字段名或路径。

### `aweme_id` — 视频/作品 ID（纯数字长整型）
- **可从这些端点产出（OUT）**：
  - `fetch_one_video` → `$.data.data.aweme_id`
  - `fetch_user_post_videos` → `$.data.data.aweme_list[].aweme_id` / `$.data.data.aweme_list[].id`
  - `fetch_user_post` → `$.data.data.itemList[].id`
  - `fetch_video_search_result` → `$.data.data.video_list[].aweme_id`
  - `fetch_general_search_result` → `$.data.data.video_list[].aweme_id`
  - `get_aweme_id` → `$.data.data.aweme_id`
  - `fetch_video_comments` → `$.data.data.aweme_id`（回显）
- **可作为输入（IN）**：
  - `fetch_one_video` / `fetch_one_video_v2` / `fetch_one_video_v3`
  - `fetch_video_comments` / `fetch_video_comment_replies`（作为 item_id）
  - `add_video_play_count`（作为 item_id）
  - `open_tiktok_app_to_video_detail`
  - `fetch_video_metrics` / `detect_fake_views` / `fetch_comment_keywords`（作为 item_id）

### `sec_user_id` — 用户 sec_user_id（混合字母数字）
- **可从这些端点产出（OUT）**：
  - `get_user_id_and_sec_user_id_by_username` → `$.data.data.sec_user_id`
  - `handler_user_profile` → `$.data.data.user.sec_uid`
  - `fetch_user_profile` → `$.data.data.user.secUid`
  - `get_sec_user_id` → `$.data.data.sec_user_id`
  - `fetch_one_video` → `$.data.data.author.sec_uid`
- **可作为输入（IN）**：
  - `handler_user_profile`
  - `fetch_webcast_user_info`
  - `fetch_user_post_videos` / `fetch_user_post_videos_v2` / `fetch_user_post_videos_v3`
  - `fetch_user_like_videos`
  - `fetch_user_follower_list` / `fetch_user_following_list`
  - `fetch_creator_showcase_product_list`（作为 kol_id）
  - `fetch_user_post` / `fetch_user_repost` / `fetch_user_like` / `fetch_user_collect` / `fetch_user_play_list` / `fetch_user_fans` / `fetch_user_follow`（作为 secUid）

### `user_id` — 用户 UID（纯数字）
- **可从这些端点产出（OUT）**：
  - `get_user_id_and_sec_user_id_by_username` → `$.data.data.user_id`
  - `handler_user_profile` → `$.data.data.user.uid`
  - `fetch_user_profile` → `$.data.data.user.id`
  - `get_user_id` → `$.data.data.user_id`
  - `fetch_live_room_info` → `$.data.data.owner.id_str`
- **可作为输入（IN）**：
  - `handler_user_profile`
  - `fetch_webcast_user_info`
  - `fetch_user_repost_videos`
  - `fetch_user_follower_list` / `fetch_user_following_list`
  - `search_follower_list` / `search_following_list`
  - `open_tiktok_app_to_user_profile` / `open_tiktok_app_to_send_private_message`（作为 uid）
  - `fetch_creator_info`（作为 creator_uid）
  - `fetch_creator_info_and_milestones`

### `room_id` — 直播间 ID
- **可从这些端点产出（OUT）**：
  - `get_live_room_id` → `$.data.data.room_id`
  - `fetch_live_room_info` → `$.data.data.room_id`（回显）
  - `fetch_user_live_detail` → `$.data.data.liveRoom.roomId`
- **可作为输入（IN）**：
  - `fetch_live_room_info`
  - `check_live_room_online`
  - `fetch_check_live_alive`
  - `fetch_live_ranking_list`
  - `fetch_live_room_product_list` / `fetch_live_room_product_list_v2`
  - `fetch_live_im_fetch`
  - `fetch_live_gift_list`
  - `fetch_live_daily_rank`

### `anchor_id` / `author_id` — 主播 ID
- **可从这些端点产出（OUT）**：
  - `fetch_live_room_info` → `$.data.data.owner.id_str`
- **可作为输入（IN）**：
  - `fetch_live_ranking_list`（作为 anchor_id）
  - `fetch_live_room_product_list` / `fetch_live_room_product_list_v2`（作为 author_id）

### `comment_id` — 评论 ID
- **可从这些端点产出（OUT）**：
  - `fetch_video_comments` → `$.data.data.comments[].cid`
  - `fetch_post_comment` → `$.data.data.comments[].cid`
- **可作为输入（IN）**：
  - `fetch_video_comment_replies` / `fetch_post_comment_reply`

### `product_id` — 商品 ID
- **可从这些端点产出（OUT）**：
  - `fetch_product_search` → `$.data.data.product_card[].product_id`
  - `fetch_search_products_list` → `$.data.data.product_card[].product_id`
  - `fetch_product_id_by_share_link` → `$.data.data.product_id`
  - `fetch_live_room_product_list` → `$.data.data.product[].product_id`
- **可作为输入（IN）**：
  - `fetch_product_detail_*` 系列
  - `fetch_product_review_*` 系列

### `seller_id` / `shop_id` — 商家/店铺 ID
- **可从这些端点产出（OUT）**：
  - `fetch_shop_id_by_share_link` → `$.data.data.shop_id`
  - `fetch_product_detail_*` → `$.data.data.shop.seller_id` 或 `$.data.data.seller_id`
- **可作为输入（IN）**：
  - `fetch_shop_home_page_list` / `fetch_shop_home` / `fetch_shop_product_*` / `fetch_shop_product_category`（作为 seller_id）
  - `fetch_shop_info`（作为 shop_id）

### `cursor` / `max_cursor` / `offset` / `page_token` — 分页游标（通用）
- **产出/输入**：所有支持分页的端点。不同端点使用不同的分页参数名：
  - App V3 视频列表：`max_cursor`（取自上次响应的 `$.data.data.max_cursor`）
  - App V3 搜索：`offset`（数字偏移量）
  - Web API 搜索：`search_id`（取自 `$.data.extra.logid` 或 `$.data.log_pb.impr_id`）+ `offset`
  - Web API 用户列表：`cursor`（取自上次响应）
  - Shop API：`page_token` / `search_params` / `scroll_param`

### `search_id` — Web API 搜索翻页 ID
- **可从这些端点产出（OUT）**：
  - `fetch_general_search` → `$.data.extra.logid` 或 `$.data.log_pb.impr_id`
  - `fetch_search_video` / `fetch_search_user` / `fetch_search_live` / `fetch_search_photo` → 同上
- **可作为输入（IN）**：
  - 对应搜索端点的下一次翻页调用

### `tt_chain_token` — Web API 视频 CDN 访问令牌
- **可从这些端点产出（OUT）**：
  - 所有 Web API 视频端点（`fetch_post_detail` / `fetch_user_post` / `fetch_explore_post` 等）→ 响应中的 `tt_chain_token` 字段
- **使用方式**：访问视频 CDN 链接时，在请求头中携带 `Cookie: tt_chain_token={tt_chain_token}`

---

## 3. 全 skill 错误处理总览 (Error Handling Overview)

### HTTP 状态码权威定义（MaxHub API 官方）

> 以下为 MaxHub API 平台官方 HTTP 状态码定义。**Agent 必须**按此表语义判定错误类型，不要自行解读。

| HTTP 状态码 | 官方含义 | 细分场景 |
|------------|---------|---------|
| **400 Bad Request** | 请求格式错误或参数不正确 | • 参数缺失 / 类型错 / 格式不符 / 互斥参数同时传<br>• Shop API 400 需重试 3 次（特例） |
| **401 Unauthorized** | API 令牌身份无效 | • API 令牌无效 / 缺失 / 过期 / 未激活 / 用户不存在 |
| **402 Payment Required** | 余额不足 / 付费路由 | • 余额不足，允许使用免费额度<br>• 余额不足，不接受免费额度 |
| **403 Forbidden** | 已认证但无权限 | • 缺少路由访问权限 / 账户已禁用 / 邮箱未验证 / API Token 权限不足<br>• 视频 CDN 链接未携带 tt_chain_token |
| **404 Not Found** | 路由数据未找到 | • 路径不在白名单 / 上游已下线<br>• 资源（aweme_id/user_id 等）不存在或已删除 |
| **429 Too Many Requests** | 请求速率超限 | • 请求速度过快，超过速率限制（读 `Retry-After` 头退避） |
| **500 Internal Server Error** | 服务器内部错误 | • 上游异常，无法完成请求（5xx 通常归入此类，含 502/503/504） |

### 错误码 → 行动 → 修复链接（决策表）

> ⚠️ **400 / 404 强制自检前置**：在按下表"行动"列处理 400 或 404 之前，**必须先完成"防臆造自检清单"**（见下方 §3.1）。自检通过后再走重试或 STOP。

| HTTP 码 | 子场景 | 行动 | 重试 | 修复链接 / 文档 |
|--------|-------|------|------|---------------|
| **400** | 参数错（读端点） | **先做 §3.1 防臆造自检 (B)** → 修正参数后重试 1 次；仍失败 STOP | ≤1 次 | 查端点 reference IN 表 |
| **400** | 参数错（Shop API） | **先做 §3.1 防臆造自检 (B)** → 修正参数后重试最多 3 次 | ≤3 次 | 查 shop.md IN 表 |
| **400** | 参数错（**写端点 ⚠️**） | **先做 §3.1 防臆造自检 (B)** → 让用户重新确认参数，**禁止静默重试** | 0 | 查端点 reference IN 表 |
| **401** | API 令牌无效 / 缺失 / 过期 / 未激活 / 用户不存在 | **STOP**，提示用户检查或更换 API Key | 0 | https://www.aconfig.cn |
| **402** | 余额不足 | **STOP**，告知用户充值 | 0 | https://www.aconfig.cn |
| **403** | 缺少路由访问权限 / API Token 权限不足 | **STOP**，提示用户当前 Token 无该端点权限 | 0 | https://www.aconfig.cn |
| **403** | 视频 CDN 403（未携带 tt_chain_token） | 提示用户需携带 Cookie 访问 CDN 链接，或改用 App V3 接口 | 0 | — |
| **403** | 账户已禁用 / 邮箱未验证 | **STOP**，提示用户去控制台处理 | 0 | https://www.aconfig.cn |
| **404** | 路径不在白名单（疑似 Agent 臆造） | **先做 §3.1 防臆造自检 (A)** → 自检失败则 STOP | 0 | 查 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) |
| **404** | 资源不存在 | **先做 §3.1 防臆造自检 (A)** → 通过后告知用户，**STOP** | 0 | — |
| **410** | 上游已下线 | **先做 §3.1 防臆造自检 (A)** → 通过后 STOP；建议更新 SKILL | 0 | 查 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) + §6 |
| **422** | 参数校验失败 | **先做 §3.1 防臆造自检 (B)** → 修正后重试 1 次；写端点不重试 | 读≤1 / 写=0 | 查端点 reference IN 表 |
| **429** | 限流 | 读 `Retry-After` 头退避；无该头时指数退避 + jitter；最多重试 2 次 | ≤2 次 | https://www.aconfig.cn |
| **500/502/503/504** | 上游故障（读端点） | 等 3 秒重试 1 次；仍失败走"端点替换矩阵" | ≤1 次 | — |
| **500/502/503/504** | 上游故障（**写端点 ⚠️**） | 等 3 秒重试 1 次封顶 | ≤1 次 | — |
| **网络超时 / DNS 失败** | 网络异常 | **STOP**，向用户报告网络问题 | 0 | — |
| **HTTP 200 + `code != 0`** | 业务层错误 | 读 `message_zh` 告知，不重试 | 0 | — |

---

### § 3.1 防臆造自检清单（404 / 400 处理前置步骤）

> 收到 **404** 或 **400** 时，Agent **必须**先按对应清单完成自检。**自检不是可选的**——绕过自检直接重试或改路径都属于违反防臆造红线。

#### (A) 收到 **404** 时的自检清单 ⚠️ 防路径臆造

按顺序逐项检查，**任一项失败立即 STOP**：

1. **路径白名单逐字符比对**
   - 把刚才请求的完整路径逐字符与 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 中的 `endpoints[].path` 对照
   - **是否完全相等？** 如果**不在清单中** → 这是 Agent 臆造路径，**STOP**，禁止任何"改 v1→v2 / 加路径段 / 拼接前缀"的尝试
2. **Method 比对**
   - 实际请求的 HTTP method 是否等于清单中的 `endpoints[].method`？
   - 如果不等 → STOP，禁止换 method 重试
3. **参数键名比对**
   - 实际请求的所有 query/body 键名是否都在该端点的 `required` ∪ `optional` 中？
   - 是否有 Agent 自己加的"看起来合理但清单没列"的参数？→ STOP
4. **资源 ID 来源溯源**
   - 请求中的 `aweme_id` / `user_id` / `sec_user_id` / `room_id` 等是否真实来自之前某个端点的**响应字段**（json_path 可追溯）？
   - 如果是 Agent 自己生成 / 编造的字符串 → STOP，告知用户资源不存在
5. **若以上全通过** → 才可以判定"上游资源真的不存在"，向用户报告，**STOP**

#### (B) 收到 **400 / 422** 时的自检清单 ⚠️ 防参数与传参方式臆造

按顺序逐项检查，**任一项失败必须修正**：

1. **参数名严格比对**
   - 实际请求的所有键名是否**逐字符**等于该端点 IN 表中的 `name`？
   - 是否有大小写错（`itemId` vs `item_id`）、复数错、缩写错？
2. **必填项齐全**
   - 该端点 IN 表中所有标 `yes` 的参数是否都已传？
   - `oneOf(sec_user_id, unique_id)` 类型是否做到"传且只传一个"？
3. **类型与格式严格匹配**
   - string 是否被错传成了 number？数组是否被传成 JSON 字符串？
   - 是否符合 `pattern` / `enum` / `min` / `max` 等 Constraints？
4. **传参方式正确**
   - GET 端点：参数应放在 query string，不应放在 request body
   - POST 端点：参数应放在 request body（JSON），使用原生 JSON 序列化
   - Authorization 头格式是否为 `Bearer $MAXHUB_API_KEY`？
5. **没有臆造参数**
   - 是否传入了 IN 表中**未列出**的"看起来合理但 API 不接受"的参数？
6. **若以上全通过** → 才可以按错误响应中的 `message_zh` 进一步排查；如仍无法定位 → STOP

---

### 重试策略矩阵
| 错误类型 | 最大重试 | 退避算法 | 是否换端点 |
|---------|---------|---------|----------|
| 400 / 422 参数错（读端点） | 1 次（修正参数后） | 立即 | ❌ 不换端点 |
| 400 参数错（Shop API） | 3 次 | 立即 | ❌ 不换端点 |
| 400 / 422 参数错（**写端点 ⚠️**） | **0 次** | — | ❌ 不换端点 |
| 401 鉴权错 | 0 | — | STOP |
| **402 余额不足** | 0 | — | STOP |
| 403 权限/CDN 403 | 0 | — | STOP 或换 App V3 接口 |
| 404 / 410 | 0 | — | ❌ 不改路径，可走"端点替换矩阵" |
| 429 限流 | 2 次 | `min(8s, 2^n) * (0.5 + random*0.5)` | ❌ |
| 5xx 上游错（读端点） | 1 次 | 固定 3s | ✅ 走"端点替换矩阵" |
| 5xx 上游错（**写端点 ⚠️**） | **1 次封顶** | 固定 3s | ❌ |
| 网络超时 / DNS | 0 | — | STOP |
| 业务 `code != 0` | 0 | — | 读 `message_zh` 报告 |

### 降级策略原则
1. **数据完整度降级**：详情接口失败 → 列表接口取相同字段（少几个字段，必须显式告知用户）
2. **数据时效降级**：实时接口失败 → 命中 `cache_url` 取缓存数据（注意时效性）
3. **平台降级**：Web API 403（tt_chain_token 限制）→ 改用 App V3 接口（无 CDN 限制）
4. **版本降级**：V3 接口失败 → V2/V1 接口（字段可能更少）

### 链式调用容错原则
- **第 1 步失败** → 整条链 **STOP**
- **中间步失败** → 返回截止前已有的数据 + **显式告知**用户缺失了哪一段
- **最后步失败** → 返回前序数据 + 告知最终步未完成

---

## 4. 端点替换矩阵 (Endpoint Substitution Matrix)

> 当首选端点持续 5xx / 数据为空 / 验证失败时，按此表寻找语义相近的替代端点。
> **强约束**：
> - 替换前必须**显式告知**用户
> - 替换次数 ≤ 1 次
> - 写入端点（add_video_play_count）**无替代**，失败必须 STOP

| 首选端点 | 替代端点 | 替代条件 | 数据差异 |
|---------|---------|---------|---------|
| fetch_one_video_v3 | fetch_one_video_v2 / fetch_one_video | 不需要 region 参数时 | V1/V2 无 region 字段 |
| fetch_multi_video_v2 | fetch_multi_video | V2 失败时 | V1 最多 10 个，V2 最多 25 个 |
| fetch_one_video_by_share_url_v2 | fetch_one_video_by_share_url | V2 失败时 | V1 无 region 字段 |
| fetch_post_detail | fetch_one_video（App V3） | Web API tt_chain_token 限制时 | App V3 无 CDN 限制，字段名不同（itemId vs aweme_id） |
| fetch_user_post_videos | fetch_user_post_videos_v2 / v3 | V1 失败时 | V3 精简数据更快，V2 居中 |
| fetch_user_post | fetch_user_post_videos（App V3） | Web API 失败时 | 参数名不同（secUid vs sec_user_id） |
| fetch_user_like | fetch_user_like_videos（App V3） | Web API 失败时 | 同上 |
| fetch_general_search | fetch_general_search_result（App V3） | Web API 失败时 | Web API 翻页用 search_id，App V3 用 offset |
| fetch_search_video | fetch_video_search_result（App V3） | Web API 失败时 | 同上 |
| fetch_video_comments | fetch_post_comment（Web API） | App V3 失败时 | Web API 参数名不同（aweme_id vs itemId） |
| fetch_product_detail_v4 | fetch_product_detail_v3 / v2 / v1 | V4 失败时 | 低版本字段更少 |
| fetch_product_detail_shop_web | fetch_product_detail_app_v3 | Shop Web 失败时 | App V3 无 seller_id/region |
| fetch_shop_product_list_v2 | fetch_shop_product_list | V2 失败时 | V1 字段更少 |
| handler_user_profile | fetch_user_profile（Web API） | App V3 失败时 | 参数名不同 |
| add_video_play_count | **无替代** ⚠️ | — | 写入操作，失败 STOP |

---

## 5. 路径合法性硬校验

> 所有端点的合法路径以 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 为唯一可信源。
> Agent **必须**在调用 API 前对照 `endpoints_whitelist.yaml` 逐字符核对路径，未在清单中的路径**禁止调用**。

---

## 6. SKILL 更新机制（版本检查 + SkillHub / ClawHub / GitHub 更新）

> 完整流程见 [`update.md`](./update.md)。本节给出关键索引：

### 何时建议用户更新
- ✅ 合法路径（已通过 §3.1(A) 自检）持续返回 **404 / 410**
- ✅ 多个端点连续返回 410（路由批量下线）
- ✅ 上游响应字段结构与 reference OUT 表明显不一致
- ✅ 用户主动询问"版本/更新"
- ✅ 距上次成功调用已超过 30 天

### 何时**禁止**建议更新
- ❌ 收到 401（鉴权错）、402（余额）、403（权限）、网络/DNS 错——这些**不是** SKILL 版本问题
- ❌ §3.1(A) 自检**失败**——这是 Agent 臆造路径，不是 SKILL 过时

### 更新通道（按优先级）
1. **国内首选 ⭐⭐⭐**：`skillhub upgrade maxhub-tiktok`（腾讯云 CDN 加速 + 安全审计）
   - Web 入口：https://skillhub.cn/skills/maxhub-tiktok
2. **国际主源 ⭐⭐⭐**：`clawhub upgrade maxhub-tiktok`
3. **降级方案**：`git pull` 仓库 https://github.com/XieWxx/maxhub-api-skills

### 当前版本
- 读取 [`../_meta.json`](../_meta.json) 中的 `version` 字段（当前：`3.7.2`）

### Agent 推荐话术（详见 [`update.md` § 4](./update.md#4-agent-推荐对话话术)）
- 场景 A：合法路径 404 → 建议升级
- 场景 B：用户问版本 → 给出当前版本 + 检查方法
- 场景 C：批量 410 → 强制升级提示
