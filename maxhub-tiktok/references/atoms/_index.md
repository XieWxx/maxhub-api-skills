# Atomic Index / 原子索引

## 🚨 高风险能力分组（RESTRICTED — 默认禁用）

> 以下原子被分类为高风险，**默认 agent 不应主动调用**。
> 仅在用户明确授权 + 一次性确认后才能执行。具体策略见 SKILL.md 的「高风险能力清单」章节。

| atom_id | 风险类别 | 限制原因 |
|---------|---------|---------|
| 🚨 add_play_count | metric_manipulation | platform metric fraud (写) — violates platform ToS |
| 🚨 extract_aweme_id_batch | bulk_extraction | bulk identifier extractor |
| 🚨 open_app_message | private_messaging | triggers private-message UI; abuse vector for spam/social-engineering |
| 🚨 extract_sec_user_id_batch | bulk_extraction | bulk identifier extractor |
| 🚨 extract_unique_id_batch | bulk_extraction | bulk identifier extractor |
| 🚨 gen_wss_signature | anti_bot_bypass | WSS bullet-chat signature generator |
| 🚨 gen_msToken | session_bootstrap | msToken generator; session bootstrap |
| 🚨 gen_ttwid | session_bootstrap | ttwid generator; session bootstrap |
| 🚨 get_guest_cookie | session_bootstrap | guest cookie acquisition; session bootstrap primitive |
| 🚨 encrypt_login | login_crypto | login request crypto helper; account-credential adjacent |

---

> 本文件是原子化层（Atomic Layer）的索引。每个端点封装为一个"原子"，具备标准化输入/输出/幂等性/链路角色声明。
> Agent 可按 atom_id 快速定位端点，无需全文读取 reference 详情。

## 原子映射表

### 视频（video）

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| get_video_v3 | fetch_one_video_v3 | video.md | 视频 | low | ✓ | ✗ | starter |
| get_video_v1 | fetch_one_video | video.md | 视频 | low | ✓ | ✗ | standalone |
| get_video_v2 | fetch_one_video_v2 | video.md | 视频 | low | ✓ | ✗ | standalone |
| get_video_batch_v2 | fetch_multi_video_v2 | video.md | 视频 | low | ✓ | ✗ | starter |
| get_video_batch_v1 | fetch_multi_video | video.md | 视频 | low | ✓ | ✗ | standalone |
| get_video_by_share_v2 | fetch_one_video_by_share_url_v2 | video.md | 视频 | low | ✓ | ✗ | starter |
| get_video_by_share_v1 | fetch_one_video_by_share_url | video.md | 视频 | low | ✓ | ✗ | standalone |
| get_video_post_detail | fetch_post_detail | video.md | 视频 | low | ✓ | ✗ | relay |
| get_video_post_detail_v2 | fetch_post_detail_v2 | video.md | 视频 | low | ✓ | ✗ | standalone |
| get_explore | fetch_explore_post | video.md | 视频 | low | ✓ | ✗ | starter |
| get_home_feed_app | fetch_home_feed_app_v3 | video.md | 视频 | low | ✓ | ✗ | starter |
| get_home_feed_web | fetch_home_feed_web | video.md | 视频 | low | ✓ | ✗ | standalone |
| get_tag_post | fetch_tag_post | video.md | 视频 | low | ✓ | ✗ | starter |
| get_user_mix | fetch_user_mix | video.md | 视频 | low | ✓ | ✗ | relay |
| get_insights_videos | fetch_creator_search_insights_videos | video.md | 视频 | low | ✓ | ✗ | terminal |
| 🚨 add_play_count | add_video_play_count | video.md | 视频 | high | ✗ | ✓ | terminal |
| open_app_video | open_tiktok_app_to_video_detail | video.md | 视频 | low | ✓ | ✗ | terminal |
| extract_aweme_id | get_aweme_id | video.md | 视频 | low | ✓ | ✗ | starter |
| 🚨 extract_aweme_id_batch | get_all_aweme_id | video.md | 视频 | low | ✓ | ✗ | starter |

### 用户（user）

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| get_user_by_username | get_user_id_and_sec_user_id_by_username | user.md | 用户 | low | ✓ | ✗ | starter |
| get_user | handler_user_profile | user.md | 用户 | low | ✓ | ✗ | starter |
| get_webcast_user | fetch_webcast_user_info | user.md | 用户 | low | ✓ | ✗ | standalone |
| get_user_country | fetch_user_country_by_username | user.md | 用户 | low | ✓ | ✗ | terminal |
| get_similar_users | fetch_similar_user_recommendations | user.md | 用户 | low | ✓ | ✗ | terminal |
| get_user_posts_v3 | fetch_user_post_videos_v3 | user.md | 用户 | low | ✓ | ✗ | relay |
| get_user_posts_v2 | fetch_user_post_videos_v2 | user.md | 用户 | low | ✓ | ✗ | standalone |
| get_user_posts_v1 | fetch_user_post_videos | user.md | 用户 | low | ✓ | ✗ | standalone |
| get_user_reposts | fetch_user_repost_videos | user.md | 用户 | low | ✓ | ✗ | relay |
| get_user_likes | fetch_user_like_videos | user.md | 用户 | low | ✓ | ✗ | relay |
| get_user_followers | fetch_user_follower_list | user.md | 用户 | low | ✓ | ✗ | relay |
| get_user_following | fetch_user_following_list | user.md | 用户 | low | ✓ | ✗ | relay |
| search_followers | search_follower_list | user.md | 用户 | low | ✓ | ✗ | terminal |
| search_following | search_following_list | user.md | 用户 | low | ✓ | ✗ | terminal |
| get_user_music | fetch_user_music_list | user.md | 用户 | low | ✓ | ✗ | terminal |
| get_share_qr | fetch_share_qr_code | user.md | 用户 | low | ✓ | ✗ | terminal |
| open_app_user | open_tiktok_app_to_user_profile | user.md | 用户 | low | ✓ | ✗ | terminal |
| 🚨 open_app_message | open_tiktok_app_to_send_private_message | user.md | 用户 | high | ✗ | ✓ | terminal |
| get_creator_info | fetch_creator_info | user.md | 用户 | low | ✓ | ✗ | relay |
| get_showcase_products | fetch_creator_showcase_product_list | user.md | 用户 | low | ✓ | ✗ | terminal |
| get_user_web | fetch_user_profile | user.md | 用户 | low | ✓ | ✗ | standalone |
| get_user_post_web | fetch_user_post | user.md | 用户 | low | ✓ | ✗ | standalone |
| get_user_repost_web | fetch_user_repost | user.md | 用户 | low | ✓ | ✗ | standalone |
| get_user_like_web | fetch_user_like | user.md | 用户 | low | ✓ | ✗ | standalone |
| get_user_collect_web | fetch_user_collect | user.md | 用户 | low | ✓ | ✗ | terminal |
| get_user_playlist_web | fetch_user_play_list | user.md | 用户 | low | ✓ | ✗ | terminal |
| get_user_fans_web | fetch_user_fans | user.md | 用户 | low | ✓ | ✗ | standalone |
| get_user_follow_web | fetch_user_follow | user.md | 用户 | low | ✓ | ✗ | standalone |
| get_user_live_web | fetch_user_live_detail | user.md | 用户 | low | ✓ | ✗ | relay |
| extract_user_id | get_user_id | user.md | 用户 | low | ✓ | ✗ | starter |
| extract_sec_user_id | get_sec_user_id | user.md | 用户 | low | ✓ | ✗ | starter |
| 🚨 extract_sec_user_id_batch | get_all_sec_user_id | user.md | 用户 | low | ✓ | ✗ | starter |
| extract_unique_id | get_unique_id | user.md | 用户 | low | ✓ | ✗ | starter |
| 🚨 extract_unique_id_batch | get_all_unique_id | user.md | 用户 | low | ✓ | ✗ | starter |

### 搜索（search）

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| search_general | fetch_general_search_result | search.md | 搜索 | low | ✓ | ✗ | starter |
| search_video | fetch_video_search_result | search.md | 搜索 | low | ✓ | ✗ | starter |
| search_user | fetch_user_search_result | search.md | 搜索 | low | ✓ | ✗ | starter |
| search_music | fetch_music_search_result | search.md | 搜索 | low | ✓ | ✗ | starter |
| search_hashtag | fetch_hashtag_search_result | search.md | 搜索 | low | ✓ | ✗ | starter |
| search_live | fetch_live_search_result | search.md | 搜索 | low | ✓ | ✗ | starter |
| search_location | fetch_location_search | search.md | 搜索 | low | ✓ | ✗ | terminal |
| get_music_detail | fetch_music_detail | search.md | 搜索 | low | ✓ | ✗ | starter |
| get_music_videos | fetch_music_video_list | search.md | 搜索 | low | ✓ | ✗ | relay |
| get_hashtag_detail | fetch_hashtag_detail | search.md | 搜索 | low | ✓ | ✗ | starter |
| get_hashtag_videos | fetch_hashtag_video_list | search.md | 搜索 | low | ✓ | ✗ | relay |
| get_search_insights | fetch_creator_search_insights | search.md | 搜索 | low | ✓ | ✗ | starter |
| get_insights_detail | fetch_creator_search_insights_detail | search.md | 搜索 | low | ✓ | ✗ | terminal |
| get_insights_trend | fetch_creator_search_insights_trend | search.md | 搜索 | low | ✓ | ✗ | terminal |
| get_music_chart | fetch_music_chart_list | search.md | 搜索 | low | ✓ | ✗ | terminal |
| search_product | fetch_product_search | search.md | 搜索 | low | ✓ | ✗ | starter |
| get_short_link | fetch_share_short_link | search.md | 搜索 | low | ✓ | ✗ | terminal |
| translate_content | fetch_content_translate | search.md | 搜索 | low | ✓ | ✗ | standalone |
| open_app_search | open_tiktok_app_to_keyword_search | search.md | 搜索 | low | ✓ | ✗ | terminal |
| search_general_web | fetch_general_search | search.md | 搜索 | low | ✓ | ✗ | starter |
| get_trending_words | fetch_trending_searchwords | search.md | 搜索 | low | ✓ | ✗ | starter |
| get_keyword_suggest | fetch_search_keyword_suggest | search.md | 搜索 | low | ✓ | ✗ | standalone |
| search_user_web | fetch_search_user | search.md | 搜索 | low | ✓ | ✗ | standalone |
| search_video_web | fetch_search_video | search.md | 搜索 | low | ✓ | ✗ | standalone |
| search_live_web | fetch_search_live | search.md | 搜索 | low | ✓ | ✗ | standalone |
| search_photo_web | fetch_search_photo | search.md | 搜索 | low | ✓ | ✗ | standalone |
| get_tag_detail_web | fetch_tag_detail | search.md | 搜索 | low | ✓ | ✗ | standalone |
| get_live_recommend | fetch_live_recommend | search.md | 搜索 | low | ✓ | ✗ | relay |
| get_live_recommend_tabs | fetch_live_recommend_tabs | search.md | 搜索 | low | ✓ | ✗ | starter |

### 评论与直播（comments）

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| get_comments | fetch_video_comments | comments.md | 评论 | low | ✓ | ✗ | starter |
| get_comment_replies | fetch_video_comment_replies | comments.md | 评论 | low | ✓ | ✗ | relay |
| get_live_room | fetch_live_room_info | comments.md | 直播 | low | ✓ | ✗ | starter |
| get_live_ranking | fetch_live_ranking_list | comments.md | 直播 | low | ✓ | ✗ | terminal |
| check_live_online | check_live_room_online | comments.md | 直播 | low | ✓ | ✗ | standalone |
| check_live_online_batch | check_live_room_online_batch | comments.md | 直播 | low | ✓ | ✗ | starter |
| get_live_products | fetch_live_room_product_list | comments.md | 直播 | low | ✓ | ✗ | starter |
| get_live_products_v2 | fetch_live_room_product_list_v2 | comments.md | 直播 | low | ✓ | ✗ | standalone |
| get_live_daily_rank | fetch_live_daily_rank | comments.md | 直播 | low | ✓ | ✗ | terminal |
| get_comments_web | fetch_post_comment | comments.md | 评论 | low | ✓ | ✗ | standalone |
| get_comment_replies_web | fetch_post_comment_reply | comments.md | 评论 | low | ✓ | ✗ | standalone |
| extract_live_room_id | get_live_room_id | comments.md | 直播 | low | ✓ | ✗ | starter |
| check_live_alive_web | fetch_check_live_alive | comments.md | 直播 | low | ✓ | ✗ | standalone |
| check_live_alive_batch_web | fetch_batch_check_live_alive | comments.md | 直播 | low | ✓ | ✗ | standalone |
| get_live_data_web | fetch_tiktok_live_data | comments.md | 直播 | low | ✓ | ✗ | standalone |
| get_live_im | fetch_live_im_fetch | comments.md | 直播 | low | ✓ | ✗ | relay |
| 🚨 gen_wss_signature | generate_wss_xb_signature | comments.md | 直播 | low | ✓ | ✗ | relay |
| get_live_gift_list | fetch_live_gift_list | comments.md | 直播 | low | ✓ | ✗ | starter |
| get_gift_name | fetch_gift_name_by_id | comments.md | 直播 | low | ✓ | ✗ | terminal |
| get_gift_names_batch | fetch_gift_names_by_ids | comments.md | 直播 | low | ✓ | ✗ | terminal |

### 数据分析（analytics）

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| get_video_metrics | fetch_video_metrics | analytics.md | 分析 | low | ✓ | ✗ | starter |
| detect_fake_views | detect_fake_views | analytics.md | 分析 | low | ✓ | ✗ | terminal |
| get_comment_keywords | fetch_comment_keywords | analytics.md | 分析 | low | ✓ | ✗ | terminal |
| get_creator_milestones | fetch_creator_info_and_milestones | analytics.md | 分析 | low | ✓ | ✗ | terminal |

### 创作者（creator）

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| get_account_health | get_account_health_status | creator.md | 创作者 | high | ✗ | ✓ | starter |
| get_account_violations | get_account_violation_list | creator.md | 创作者 | high | ✗ | ✓ | terminal |
| get_account_insights | get_account_insights_overview | creator.md | 创作者 | high | ✗ | ✓ | starter |
| get_live_summary | get_live_analytics_summary | creator.md | 创作者 | high | ✗ | ✓ | terminal |
| get_video_summary | get_video_analytics_summary | creator.md | 创作者 | high | ✗ | ✓ | terminal |
| get_video_list_analytics | get_video_list_analytics | creator.md | 创作者 | high | ✗ | ✓ | starter |
| get_product_analytics | get_product_analytics_list | creator.md | 创作者 | high | ✗ | ✓ | terminal |
| get_creator_account | get_creator_account_info | creator.md | 创作者 | high | ✗ | ✓ | starter |
| get_showcase_products | get_showcase_product_list | creator.md | 创作者 | high | ✗ | ✓ | terminal |
| get_video_products | get_video_associated_product_list | creator.md | 创作者 | high | ✗ | ✓ | terminal |
| get_video_stats | get_video_detailed_stats | creator.md | 创作者 | high | ✗ | ✓ | terminal |
| get_video_product_stats | get_video_to_product_stats | creator.md | 创作者 | high | ✗ | ✓ | terminal |
| get_product_videos | get_product_related_videos | creator.md | 创作者 | high | ✗ | ✓ | terminal |
| get_video_audience | get_video_audience_stats | creator.md | 创作者 | high | ✗ | ✓ | terminal |

### 广告（ads）

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| get_ad_detail | get_ads_detail | ads.md | 广告 | low | ✓ | ✗ | starter |
| search_ads | search_ads | ads.md | 广告 | low | ✓ | ✗ | starter |
| get_top_ads | get_top_ads_spotlight | ads.md | 广告 | low | ✓ | ✗ | starter |
| get_ad_keyframe | get_ad_keyframe_analysis | ads.md | 广告 | low | ✓ | ✗ | terminal |
| get_ad_percentile | get_ad_percentile | ads.md | 广告 | low | ✓ | ✗ | terminal |
| get_ad_interactive | get_ad_interactive_analysis | ads.md | 广告 | low | ✓ | ✗ | terminal |
| get_recommended_ads | get_recommended_ads | ads.md | 广告 | low | ✓ | ✗ | terminal |
| get_query_suggestions | get_query_suggestions | ads.md | 广告 | low | ✓ | ✗ | standalone |
| get_safety_config | get_configure_safety | ads.md | 广告 | low | ✓ | ✗ | standalone |
| get_location_list | get_location_list | ads.md | 广告 | low | ✓ | ✗ | starter |
| get_trends_hashtags | get_trends_hashtag_list | ads.md | 广告 | low | ✓ | ✗ | starter |
| get_trends_hashtag_detail | get_trends_hashtag_detail | ads.md | 广告 | low | ✓ | ✗ | terminal |

### 电商（shop）

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| get_product_detail | fetch_product_detail | shop.md | 电商 | low | ✓ | ✗ | starter |
| get_product_detail_v2 | fetch_product_detail_v2 | shop.md | 电商 | low | ✓ | ✗ | standalone |
| get_product_detail_v3 | fetch_product_detail_v3 | shop.md | 电商 | low | ✓ | ✗ | standalone |
| get_product_reviews | fetch_product_reviews_v2 | shop.md | 电商 | low | ✓ | ✗ | terminal |
| get_seller_products | fetch_seller_products_list | shop.md | 电商 | low | ✓ | ✗ | relay |
| get_seller_products_v2 | fetch_seller_products_list_v2 | shop.md | 电商 | low | ✓ | ✗ | standalone |
| get_search_suggest | fetch_search_word_suggestion_v2 | shop.md | 电商 | low | ✓ | ✗ | starter |
| search_products | fetch_search_products_list | shop.md | 电商 | low | ✓ | ✗ | starter |
| search_products_v2 | fetch_search_products_list_v2 | shop.md | 电商 | low | ✓ | ✗ | standalone |
| get_category_list | fetch_products_category_list | shop.md | 电商 | low | ✓ | ✗ | starter |
| get_products_by_category | fetch_products_by_category_id | shop.md | 电商 | low | ✓ | ✗ | relay |
| get_hot_products | fetch_hot_selling_products_list | shop.md | 电商 | low | ✓ | ✗ | starter |
| app_get_product | app_v3_fetch_product_detail | shop.md | 电商 | low | ✓ | ✗ | standalone |
| app_get_product_v2 | app_v3_fetch_product_detail_v2 | shop.md | 电商 | low | ✓ | ✗ | standalone |
| app_get_product_v3 | app_v3_fetch_product_detail_v3 | shop.md | 电商 | low | ✓ | ✗ | standalone |
| app_get_product_v4 | app_v3_fetch_product_detail_v4 | shop.md | 电商 | low | ✓ | ✗ | standalone |
| app_get_review | app_v3_fetch_product_review | shop.md | 电商 | low | ✓ | ✗ | terminal |
| app_get_shop_id | app_v3_fetch_shop_id_by_share_link | shop.md | 电商 | low | ✓ | ✗ | starter |
| app_get_product_id | app_v3_fetch_product_id_by_share_link | shop.md | 电商 | low | ✓ | ✗ | starter |
| app_get_shop_pages | app_v3_fetch_shop_home_page_list | shop.md | 电商 | low | ✓ | ✗ | terminal |
| app_get_shop_home | app_v3_fetch_shop_home | shop.md | 电商 | low | ✓ | ✗ | terminal |
| app_get_shop_recommend | app_v3_fetch_shop_product_recommend | shop.md | 电商 | low | ✓ | ✗ | terminal |
| app_get_shop_products | app_v3_fetch_shop_product_list | shop.md | 电商 | low | ✓ | ✗ | relay |
| app_get_shop_products_v2 | app_v3_fetch_shop_product_list_v2 | shop.md | 电商 | low | ✓ | ✗ | standalone |
| app_get_shop_info | app_v3_fetch_shop_info | shop.md | 电商 | low | ✓ | ✗ | terminal |
| app_get_shop_category | app_v3_fetch_shop_product_category | shop.md | 电商 | low | ✓ | ✗ | starter |

### 工具（tools）

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| 🚨 gen_msToken | generate_real_msToken | tools.md | 工具 | low | ✓ | ✗ | standalone |
| encrypt_strData | encrypt_strData | tools.md | 工具 | low | ✓ | ✗ | relay |
| decrypt_strData | decrypt_strData | tools.md | 工具 | low | ✓ | ✗ | standalone |
| gen_fingerprint | generate_fingerprint | tools.md | 工具 | low | ✓ | ✗ | starter |
| gen_webid | generate_webid | tools.md | 工具 | low | ✓ | ✗ | standalone |
| 🚨 gen_ttwid | generate_ttwid | tools.md | 工具 | low | ✓ | ✗ | standalone |
| gen_xbogus | generate_xbogus | tools.md | 工具 | low | ✓ | ✗ | standalone |
| gen_xgnarly | generate_xgnarly | tools.md | 工具 | low | ✓ | ✗ | standalone |
| gen_xgnarly_xbogus | generate_xgnarly_and_xbogus | tools.md | 工具 | low | ✓ | ✗ | standalone |
| gen_x_mssdk | generate_x_mssdk_info | tools.md | 工具 | low | ✓ | ✗ | standalone |
| gen_hashed_id | generate_hashed_id | tools.md | 工具 | low | ✓ | ✗ | standalone |
| 🚨 get_guest_cookie | fetch_tiktok_web_guest_cookie | tools.md | 工具 | low | ✓ | ✗ | starter |
| device_register | device_register | tools.md | 工具 | low | ✓ | ✗ | starter |
| tt_encrypt | TTencrypt_algorithm | tools.md | 工具 | low | ✓ | ✗ | standalone |
| 🚨 encrypt_login | encrypt_decrypt_login_request | tools.md | 工具 | low | ✓ | ✗ | standalone |

### 字段说明
- **atom_id**：业务化别名，Agent 易记易用
- **endpoint_id**：原始端点 ID，与 endpoints_whitelist.yaml / param-mappings.md 对应
- **file**：端点详情所在的 reference 文件
- **domain**：业务子领域
- **risk**：low / high
- **idempotent**：✓=可安全重试 / ✗=非幂等
- **write_op**：✓=写入端点 / ✗=只读端点
- **chain_role**：starter / relay / terminal / standalone
