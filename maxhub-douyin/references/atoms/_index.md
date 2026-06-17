# Atomic Index / 原子索引

## 🚨 高风险能力分组（RESTRICTED — 默认禁用）

> 以下原子被分类为高风险，**默认 agent 不应主动调用**。
> 仅在用户明确授权 + 一次性确认后才能执行。具体策略见 SKILL.md 的「高风险能力清单」章节。

| atom_id | 风险类别 | 限制原因 |
|---------|---------|---------|
| 🚨 add_play_count | metric_manipulation | platform metric fraud (写) — violates platform ToS |
| 🚨 register_device | session_bootstrap | fake-client device registration; can evade anti-abuse controls |
| 🚨 open_app_message | private_messaging | triggers private-message UI; abuse vector for spam/social-engineering |
| 🚨 get_guest_cookie | session_bootstrap | guest cookie acquisition; session bootstrap primitive |
| 🚨 gen_msToken | session_bootstrap | msToken generator; session bootstrap |
| 🚨 gen_ttwid | session_bootstrap | ttwid generator; session bootstrap |
| 🚨 gen_verify_fp | session_bootstrap | verify_fp generator; session bootstrap |
| 🚨 gen_s_v_web_id | session_bootstrap | s_v_web_id generator |
| 🚨 gen_x_bogus | anti_bot_bypass | X-Bogus signature generator; bypasses platform anti-scrape controls |
| 🚨 gen_a_bogus | anti_bot_bypass | A-Bogus signature generator; bypasses anti-scrape |
| 🚨 gen_wss_signature | anti_bot_bypass | WSS bullet-chat signature generator |
| 🚨 extract_sec_uid_batch | bulk_extraction | bulk identifier extractor; scale-collection vector |
| 🚨 extract_aweme_id_batch | bulk_extraction | bulk identifier extractor |
| 🚨 extract_webcast_id_batch | bulk_extraction | bulk identifier extractor |
| 🚨 query_user | query_helper | high-risk write_op marked user-search helper |

---

> 本文件是原子化层（Atomic Layer）的索引。每个端点封装为一个"原子"，具备标准化输入/输出/幂等性/链路角色声明。
> Agent 可按 atom_id 快速定位端点，无需全文读取 reference 详情。

## 原子映射表

### 视频（video/）

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| get_video | app_v3_fetch_one_video | video/detail.md | 视频 | low | ✓ | ✗ | starter |
| get_video_v2 | app_v3_fetch_one_video_v2 | video/detail.md | 视频 | low | ✓ | ✗ | standalone |
| get_video_v3_nolimit | app_v3_fetch_one_video_v3 | video/detail.md | 视频 | low | ✓ | ✗ | standalone |
| get_video_web | web_fetch_one_video | video/detail.md | 视频 | low | ✓ | ✗ | relay |
| get_video_web_v2 | web_fetch_one_video_v2 | video/detail.md | 视频 | low | ✓ | ✗ | standalone |
| get_video_by_share | app_v3_fetch_one_video_by_share_url | video/detail.md | 视频 | low | ✓ | ✗ | starter |
| get_video_by_share_web | web_fetch_one_video_by_share_url | video/detail.md | 视频 | low | ✓ | ✗ | standalone |
| get_video_hd | app_v3_fetch_video_high_quality_play_url | video/detail.md | 视频 | low | ✓ | ✗ | relay |
| get_video_hd_web | web_fetch_video_high_quality_play_url | video/detail.md | 视频 | low | ✓ | ✗ | standalone |
| get_video_hd_batch | app_v3_fetch_multi_video_high_quality_play_url | video/detail.md | 视频 | high | ✗ | ✓ | terminal |
| get_video_hd_batch_web | web_fetch_multi_video_high_quality_play_url | video/detail.md | 视频 | high | ✗ | ✓ | terminal |
| get_video_batch | app_v3_fetch_multi_video | video/batch-stats.md | 视频 | high | ✗ | ✓ | starter |
| get_video_batch_v2 | app_v3_fetch_multi_video_v2 | video/batch-stats.md | 视频 | high | ✗ | ✓ | starter |
| get_video_batch_web | web_fetch_multi_video | video/batch-stats.md | 视频 | high | ✗ | ✓ | standalone |
| get_video_stats | app_v3_fetch_video_statistics | video/batch-stats.md | 视频 | low | ✓ | ✗ | terminal |
| get_video_stats_batch | app_v3_fetch_multi_video_statistics | video/batch-stats.md | 视频 | low | ✓ | ✗ | terminal |
| 🚨 add_play_count | app_v3_add_video_play_count | video/batch-stats.md | 视频 | high | ✗ | ✓ | terminal |
| get_share_by_code | app_v3_fetch_share_info_by_share_code | video/batch-stats.md | 视频 | low | ✓ | ✗ | starter |
| gen_short_url | app_v3_generate_douyin_short_url | video/batch-stats.md | 视频 | low | ✓ | ✗ | terminal |
| gen_share_qrcode | app_v3_generate_douyin_video_share_qrcode | video/batch-stats.md | 视频 | low | ✓ | ✗ | terminal |
| get_home_feed | web_fetch_home_feed | video/feed-collection.md | 视频 | high | ✗ | ✓ | starter |
| get_related_posts | web_fetch_related_posts | video/feed-collection.md | 视频 | low | ✓ | ✗ | relay |
| get_danmaku | web_fetch_one_video_danmaku | video/feed-collection.md | 视频 | low | ✓ | ✗ | terminal |
| get_channel | web_fetch_video_channel_result | video/feed-collection.md | 视频 | low | ✓ | ✗ | starter |
| get_challenge_posts | web_fetch_challenge_posts | video/feed-collection.md | 视频 | high | ✗ | ✓ | starter |
| get_mix_detail | app_v3_fetch_video_mix_detail | video/feed-collection.md | 视频 | low | ✓ | ✗ | starter |
| get_mix_videos | app_v3_fetch_video_mix_post_list | video/feed-collection.md | 视频 | low | ✓ | ✗ | relay |
| get_user_series | app_v3_fetch_user_series_list | video/feed-collection.md | 视频 | low | ✓ | ✗ | starter |
| get_series_detail | app_v3_fetch_series_detail | video/feed-collection.md | 视频 | low | ✓ | ✗ | starter |
| get_series_videos | app_v3_fetch_series_video_list | video/feed-collection.md | 视频 | low | ✓ | ✗ | relay |
| get_music_detail | app_v3_fetch_music_detail | video/feed-collection.md | 视频 | low | ✓ | ✗ | starter |
| get_music_videos | app_v3_fetch_music_video_list | video/feed-collection.md | 视频 | low | ✓ | ✗ | relay |
| get_hashtag_detail | app_v3_fetch_hashtag_detail | video/feed-collection.md | 视频 | low | ✓ | ✗ | starter |
| get_hashtag_videos | app_v3_fetch_hashtag_video_list | video/feed-collection.md | 视频 | low | ✓ | ✗ | relay |
| get_series_aweme | web_fetch_series_aweme | video/feed-collection.md | 视频 | low | ✓ | ✗ | starter |
| get_knowledge_aweme | web_fetch_knowledge_aweme | video/feed-collection.md | 视频 | low | ✓ | ✗ | starter |
| get_game_aweme | web_fetch_game_aweme | video/feed-collection.md | 视频 | low | ✓ | ✗ | starter |
| get_cartoon_aweme | web_fetch_cartoon_aweme | video/feed-collection.md | 视频 | low | ✓ | ✗ | starter |
| get_music_aweme | web_fetch_music_aweme | video/feed-collection.md | 视频 | low | ✓ | ✗ | starter |
| get_food_aweme | web_fetch_food_aweme | video/feed-collection.md | 视频 | low | ✓ | ✗ | starter |

### 用户（user）

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| get_user | app_v3_handler_user_profile | user.md | 用户 | low | ✓ | ✗ | starter |
| get_user_web | web_handler_user_profile | user.md | 用户 | low | ✓ | ✗ | standalone |
| get_user_v4 | web_handler_user_profile_v4 | user.md | 用户 | low | ✓ | ✗ | standalone |
| get_user_by_unique_id | web_handler_user_profile_v2 | user.md | 用户 | low | ✓ | ✗ | starter |
| get_user_by_uid | web_handler_user_profile_v3 | user.md | 用户 | low | ✓ | ✗ | starter |
| get_user_profile_by_uid | web_fetch_user_profile_by_uid | user.md | 用户 | low | ✓ | ✗ | standalone |
| get_user_by_short_id | web_fetch_user_profile_by_short_id | user.md | 用户 | low | ✓ | ✗ | standalone |
| uid_to_sec_uid | web_encrypt_uid_to_sec_user_id | user.md | 用户 | low | ✓ | ✗ | relay |
| get_user_batch_v1 | web_fetch_batch_user_profile_v1 | user.md | 用户 | low | ✓ | ✗ | starter |
| get_user_batch | web_fetch_batch_user_profile_v2 | user.md | 用户 | low | ✓ | ✗ | starter |
| get_fans | app_v3_fetch_user_fans_list | user.md | 用户 | low | ✓ | ✗ | relay |
| get_fans_web | web_fetch_user_fans_list | user.md | 用户 | low | ✓ | ✗ | standalone |
| get_following | web_fetch_user_following_list | user.md | 用户 | low | ✓ | ✗ | relay |
| get_user_posts | app_v3_fetch_user_post_videos | user.md | 用户 | low | ✓ | ✗ | relay |
| get_user_posts_web | web_fetch_user_post_videos | user.md | 用户 | low | ✓ | ✗ | standalone |
| get_user_likes | app_v3_fetch_user_like_videos | user.md | 用户 | low | ✓ | ✗ | relay |
| get_user_likes_web | web_fetch_user_like_videos | user.md | 用户 | high | ✗ | ✓ | standalone |
| get_user_collection | web_fetch_user_collection_videos | user.md | 用户 | high | ✗ | ✓ | terminal |
| get_user_collects | web_fetch_user_collects | user.md | 用户 | high | ✗ | ✓ | starter |
| get_collects_videos | web_fetch_user_collects_videos | user.md | 用户 | low | ✓ | ✗ | relay |
| get_user_mix | web_fetch_user_mix_videos | user.md | 用户 | low | ✓ | ✗ | relay |

### 搜索（search）

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| search_general | search_fetch_general_search_v1 | search.md | 搜索 | high | ✗ | ✓ | starter |
| search_general_v2 | search_fetch_general_search_v2 | search.md | 搜索 | high | ✗ | ✓ | standalone |
| search_video | search_fetch_video_search_v1 | search.md | 搜索 | high | ✗ | ✓ | starter |
| search_video_v2 | search_fetch_video_search_v2 | search.md | 搜索 | high | ✗ | ✓ | standalone |
| search_user | search_fetch_user_search | search.md | 搜索 | high | ✗ | ✓ | starter |
| search_user_v2 | search_fetch_user_search_v2 | search.md | 搜索 | high | ✗ | ✓ | standalone |
| search_image | search_fetch_image_search | search.md | 搜索 | high | ✗ | ✓ | starter |
| search_image_v3 | search_fetch_image_search_v3 | search.md | 搜索 | high | ✗ | ✓ | standalone |
| search_live | search_fetch_live_search_v1 | search.md | 搜索 | high | ✗ | ✓ | starter |
| search_challenge | search_fetch_challenge_search_v1 | search.md | 搜索 | high | ✗ | ✓ | starter |
| search_challenge_v2 | search_fetch_challenge_search_v2 | search.md | 搜索 | high | ✗ | ✓ | standalone |
| search_challenge_suggest | search_fetch_challenge_suggest | search.md | 搜索 | high | ✗ | ✓ | standalone |
| search_suggest | search_fetch_search_suggest | search.md | 搜索 | high | ✗ | ✓ | standalone |
| search_multi | search_fetch_multi_search | search.md | 搜索 | high | ✗ | ✓ | starter |
| search_experience | search_fetch_experience_search | search.md | 搜索 | high | ✗ | ✓ | starter |
| search_music | search_fetch_music_search | search.md | 搜索 | high | ✗ | ✓ | starter |
| search_discuss | search_fetch_discuss_search | search.md | 搜索 | high | ✗ | ✓ | starter |
| search_school | search_fetch_school_search | search.md | 搜索 | high | ✗ | ✓ | terminal |
| search_vision | search_fetch_vision_search | search.md | 搜索 | high | ✗ | ✓ | starter |

### 评论（comments）

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| get_comments | app_v3_fetch_video_comments | comments.md | 评论 | low | ✓ | ✗ | starter |
| get_comment_replies | app_v3_fetch_video_comment_replies | comments.md | 评论 | low | ✓ | ✗ | relay |
| get_comments_web | web_fetch_video_comments | comments.md | 评论 | low | ✓ | ✗ | standalone |
| get_comment_replies_web | web_fetch_video_comment_replies | comments.md | 评论 | low | ✓ | ✗ | standalone |
| get_video_danmaku | web_fetch_one_video_danmaku | comments.md | 评论 | low | ✓ | ✗ | terminal |
| get_danmaku_list | creator_fetch_video_danmaku_list | comments.md | 评论 | low | ✓ | ✗ | terminal |

### 直播（live）

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| get_live_by_webcast | web_fetch_user_live_videos | live.md | 直播 | low | ✓ | ✗ | starter |
| get_live_by_room | web_fetch_user_live_videos_by_room_id_v2 | live.md | 直播 | low | ✓ | ✗ | starter |
| get_live_by_sec_uid | web_fetch_user_live_videos_by_sec_uid | live.md | 直播 | low | ✓ | ✗ | starter |
| get_live_status | web_fetch_user_live_info_by_uid | live.md | 直播 | low | ✓ | ✗ | starter |
| webcast_to_room | web_webcast_id_2_room_id | live.md | 直播 | low | ✓ | ✗ | relay |
| get_live_room | web_douyin_live_room | live.md | 直播 | low | ✓ | ✗ | relay |
| get_live_im | web_fetch_live_im_fetch | live.md | 直播 | low | ✓ | ✗ | relay |
| get_live_gift_rank | web_fetch_live_gift_ranking | live.md | 直播 | low | ✓ | ✗ | terminal |
| get_live_products | web_fetch_live_room_product_result | live.md | 直播 | low | ✓ | ✗ | starter |
| get_product_sku | web_fetch_product_sku_list | live.md | 直播 | low | ✓ | ✗ | terminal |
| get_product_coupon | web_fetch_product_coupon | live.md | 直播 | low | ✓ | ✗ | terminal |
| get_product_review_score | web_fetch_product_review_score | live.md | 直播 | low | ✓ | ✗ | terminal |
| get_product_reviews | web_fetch_product_review_list | live.md | 直播 | low | ✓ | ✗ | terminal |

### 创作者（creator）

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| get_activity_list | creator_fetch_creator_activity_list | creator.md | 创作者 | low | ✓ | ✗ | starter |
| get_activity_detail | creator_fetch_creator_activity_detail | creator.md | 创作者 | low | ✓ | ✗ | terminal |
| get_material_config | creator_fetch_creator_material_center_config | creator.md | 创作者 | low | ✓ | ✗ | standalone |
| get_material_billboard | creator_fetch_creator_material_center_billboard | creator.md | 创作者 | low | ✓ | ✗ | terminal |
| get_material_related | creator_fetch_creator_material_center_related | creator.md | 创作者 | low | ✓ | ✗ | terminal |
| get_hot_spot | creator_fetch_creator_hot_spot_billboard | creator.md | 创作者 | low | ✓ | ✗ | starter |
| get_hot_topic | creator_fetch_creator_hot_topic_billboard | creator.md | 创作者 | low | ✓ | ✗ | terminal |
| get_hot_props | creator_fetch_creator_hot_props_billboard | creator.md | 创作者 | low | ✓ | ✗ | terminal |
| get_hot_challenge | creator_fetch_creator_hot_challenge_billboard | creator.md | 创作者 | low | ✓ | ✗ | terminal |
| get_hot_music | creator_fetch_creator_hot_music_billboard | creator.md | 创作者 | low | ✓ | ✗ | terminal |
| get_hot_course | creator_fetch_creator_hot_course | creator.md | 创作者 | low | ✓ | ✗ | terminal |
| get_content_category | creator_fetch_creator_content_category | creator.md | 创作者 | low | ✓ | ✗ | starter |
| get_content_course | creator_fetch_creator_content_course | creator.md | 创作者 | low | ✓ | ✗ | terminal |
| get_creator_danmaku | creator_fetch_video_danmaku_list | creator.md | 创作者 | low | ✓ | ✗ | terminal |
| get_mission_tasks | creator_fetch_mission_task_list | creator.md | 创作者 | low | ✓ | ✗ | terminal |
| get_industry_config | creator_fetch_industry_category_config | creator.md | 创作者 | low | ✓ | ✗ | standalone |
| get_item_overview | creator_v2_fetch_item_overview_data | creator.md | 创作者 | high | ✗ | ✓ | starter |
| get_item_play_source | creator_v2_fetch_item_play_source | creator.md | 创作者 | high | ✗ | ✓ | terminal |
| get_item_search_keyword | creator_v2_fetch_item_search_keyword | creator.md | 创作者 | high | ✗ | ✓ | terminal |
| get_item_watch_trend | creator_v2_fetch_item_watch_trend | creator.md | 创作者 | high | ✗ | ✓ | terminal |
| get_item_danmaku_analysis | creator_v2_fetch_item_danmaku_analysis | creator.md | 创作者 | high | ✗ | ✓ | terminal |
| get_item_audience_portrait | creator_v2_fetch_item_audience_portrait | creator.md | 创作者 | high | ✗ | ✓ | terminal |
| get_item_audience_others | creator_v2_fetch_item_audience_others | creator.md | 创作者 | high | ✗ | ✓ | terminal |
| get_item_vertical | creator_v2_fetch_item_analysis_involved_vertical | creator.md | 创作者 | high | ✗ | ✓ | relay |
| get_item_analysis_overview | creator_v2_fetch_item_analysis_overview | creator.md | 创作者 | high | ✗ | ✓ | terminal |
| get_item_performance | creator_v2_fetch_item_analysis_item_performance | creator.md | 创作者 | high | ✗ | ✓ | terminal |
| get_item_list | creator_v2_fetch_item_list | creator.md | 创作者 | high | ✗ | ✓ | starter |
| get_item_list_download | creator_v2_fetch_item_list_download | creator.md | 创作者 | high | ✗ | ✓ | terminal |
| get_live_history | creator_v2_fetch_live_room_history_list | creator.md | 创作者 | high | ✗ | ✓ | terminal |
| get_author_diagnosis | creator_v2_fetch_author_diagnosis | creator.md | 创作者 | high | ✗ | ✓ | terminal |

### 工具（tools）

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| 🚨 register_device | app_v3_register_device | tools.md | 工具 | high | ✗ | ✓ | starter |
| open_app_video | app_v3_open_douyin_app_to_video_detail | tools.md | 工具 | low | ✓ | ✗ | terminal |
| open_app_user | app_v3_open_douyin_app_to_user_profile | tools.md | 工具 | low | ✓ | ✗ | terminal |
| open_app_search | app_v3_open_douyin_app_to_keyword_search | tools.md | 工具 | low | ✓ | ✗ | terminal |
| 🚨 open_app_message | app_v3_open_douyin_app_to_send_private_message | tools.md | 工具 | high | ✗ | ✓ | terminal |
| 🚨 get_guest_cookie | web_fetch_douyin_web_guest_cookie | tools.md | 工具 | low | ✓ | ✗ | starter |
| 🚨 gen_msToken | web_generate_real_msToken | tools.md | 工具 | low | ✓ | ✗ | standalone |
| 🚨 gen_ttwid | web_generate_ttwid | tools.md | 工具 | low | ✓ | ✗ | standalone |
| 🚨 gen_verify_fp | web_generate_verify_fp | tools.md | 工具 | low | ✓ | ✗ | standalone |
| 🚨 gen_s_v_web_id | web_generate_s_v_web_id | tools.md | 工具 | low | ✓ | ✗ | standalone |
| 🚨 gen_x_bogus | web_generate_x_bogus | tools.md | 工具 | high | ✗ | ✓ | standalone |
| 🚨 gen_a_bogus | web_generate_a_bogus | tools.md | 工具 | high | ✗ | ✓ | standalone |
| 🚨 gen_wss_signature | web_generate_wss_xb_signature | tools.md | 工具 | low | ✓ | ✗ | relay |
| extract_sec_uid | web_get_sec_user_id | tools.md | 工具 | low | ✓ | ✗ | starter |
| 🚨 extract_sec_uid_batch | web_get_all_sec_user_id | tools.md | 工具 | high | ✗ | ✓ | starter |
| extract_aweme_id | web_get_aweme_id | tools.md | 工具 | low | ✓ | ✗ | starter |
| 🚨 extract_aweme_id_batch | web_get_all_aweme_id | tools.md | 工具 | high | ✗ | ✓ | starter |
| extract_webcast_id | web_get_webcast_id | tools.md | 工具 | low | ✓ | ✗ | starter |
| 🚨 extract_webcast_id_batch | web_get_all_webcast_id | tools.md | 工具 | high | ✗ | ✓ | starter |
| shorten_url | web_handler_shorten_url | tools.md | 工具 | low | ✓ | ✗ | standalone |
| 🚨 query_user | web_fetch_query_user | tools.md | 工具 | high | ✗ | ✓ | starter |

### 内容指数（content）

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| get_valid_date | index_fetch_all_valid_date | content/keyword.md | 内容指数 | low | ✓ | ✗ | starter |
| get_valid_date_relation | index_fetch_valid_date_for_relation | content/keyword.md | 内容指数 | low | ✓ | ✗ | standalone |
| get_all_area | index_fetch_all_area | content/tools.md | 内容指数 | low | ✓ | ✗ | standalone |
| get_hot_topic_index | index_fetch_current_hot_topic | content/keyword.md | 内容指数 | low | ✓ | ✗ | starter |
| get_hot_words | index_fetch_hot_words | content/keyword.md | 内容指数 | low | ✓ | ✗ | starter |
| get_keyword_valid_date | index_fetch_keyword_valid_date | content/keyword.md | 内容指数 | high | ✗ | ✓ | standalone |
| get_keyword_trend | index_fetch_multi_keyword_hot_trend | content/keyword.md | 内容指数 | high | ✗ | ✓ | starter |
| get_keyword_interpretation | index_fetch_multi_keyword_interpretation | content/keyword.md | 内容指数 | high | ✗ | ✓ | terminal |
| get_relation_word | index_fetch_relation_word | content/keyword.md | 内容指数 | high | ✗ | ✓ | terminal |
| get_portrait | index_fetch_portrait | content/keyword.md | 内容指数 | high | ✗ | ✓ | terminal |
| get_user_sub_word | index_fetch_get_user_sub_word | content/keyword.md | 内容指数 | high | ✗ | ✓ | terminal |
| encrypt_uid | index_fetch_encrypt_user_id | content/keyword.md | 内容指数 | low | ✓ | ✗ | relay |
| search_daren | index_fetch_daren_sug_great_user_list | content/daren.md | 内容指数 | high | ✗ | ✓ | starter |
| compare_daren | index_fetch_daren_compare_users_stable | content/daren.md | 内容指数 | high | ✗ | ✓ | terminal |
| get_similar_daren | index_fetch_daren_similar_users | content/daren.md | 内容指数 | high | ✗ | ✓ | terminal |
| get_daren_top_video | index_fetch_daren_great_user_top_video | content/daren.md | 内容指数 | high | ✗ | ✓ | terminal |
| get_daren_mile | index_fetch_daren_great_item_mile_info | content/daren.md | 内容指数 | high | ✗ | ✓ | terminal |
| get_daren_fans | index_fetch_daren_great_user_fans_info | content/daren.md | 内容指数 | high | ✗ | ✓ | terminal |
| get_item_filter | index_fetch_item_filter_options | content/daren.md | 内容指数 | low | ✓ | ✗ | standalone |
| get_item_sug | index_fetch_item_sug | content/daren.md | 内容指数 | high | ✗ | ✓ | standalone |
| get_item_query | index_fetch_item_query | content/daren.md | 内容指数 | high | ✗ | ✓ | starter |
| search_brand | index_fetch_brand_suggest | content/brand-topic.md | 内容指数 | high | ✗ | ✓ | starter |
| get_brand_valid_info | index_fetch_brand_valid_info | content/brand-topic.md | 内容指数 | high | ✗ | ✓ | terminal |
| get_brand_radar | index_fetch_brand_radar_chart | content/brand-topic.md | 内容指数 | high | ✗ | ✓ | terminal |
| get_brand_lines | index_fetch_brand_lines | content/brand-topic.md | 内容指数 | high | ✗ | ✓ | terminal |
| get_brand_cycles | index_fetch_brand_cycles | content/brand-topic.md | 内容指数 | high | ✗ | ✓ | terminal |
| get_brand_rank_weekly | index_fetch_brand_initiative_rank_weekly | content/brand-topic.md | 内容指数 | high | ✗ | ✓ | terminal |
| get_brand_hot_videos | index_fetch_brand_hot_videos_time_scope | content/brand-topic.md | 内容指数 | high | ✗ | ✓ | terminal |
| search_topic | index_fetch_topic_suggest | content/brand-topic.md | 内容指数 | high | ✗ | ✓ | starter |
| get_topic_query | index_fetch_topic_query | content/brand-topic.md | 内容指数 | high | ✗ | ✓ | terminal |
| get_content_valid_date | index_fetch_content_valid_date | content/creative-insight.md | 内容指数 | low | ✓ | ✗ | starter |
| get_creative_keywords | index_fetch_content_creative_keywords | content/creative-insight.md | 内容指数 | high | ✗ | ✓ | starter |
| get_creative_keyword_items | index_fetch_content_creative_keyword_items | content/creative-insight.md | 内容指数 | high | ✗ | ✓ | terminal |
| get_creative_topic | index_fetch_content_creative_topic | content/creative-insight.md | 内容指数 | high | ✗ | ✓ | terminal |
| get_publish_trend | index_fetch_content_publish_trend | content/creative-insight.md | 内容指数 | low | ✓ | ✗ | terminal |
| get_creative_duration | index_fetch_content_creative_duration | content/creative-insight.md | 内容指数 | high | ✗ | ✓ | terminal |
| get_author_portrait | index_fetch_content_author_portrait | content/creative-insight.md | 内容指数 | high | ✗ | ✓ | terminal |
| get_consumer_portrait | index_fetch_content_consumer_portrait | content/creative-insight.md | 内容指数 | high | ✗ | ✓ | terminal |
| get_interact_trend | index_fetch_content_interact_trend | content/creative-insight.md | 内容指数 | high | ✗ | ✓ | terminal |
| get_consume_trend | index_fetch_content_consume_trend | content/creative-insight.md | 内容指数 | high | ✗ | ✓ | terminal |
| get_insight_recommend | index_fetch_insight_recommend | content/creative-insight.md | 内容指数 | low | ✓ | ✗ | starter |
| search_report | index_fetch_report_search | content/creative-insight.md | 内容指数 | high | ✗ | ✓ | starter |
| get_report_detail | index_fetch_report_detail | content/creative-insight.md | 内容指数 | low | ✓ | ✗ | terminal |
| get_insight_rec | index_fetch_insight_get_rec | content/creative-insight.md | 内容指数 | low | ✓ | ✗ | terminal |

### 热榜（trending）

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| get_hot_search | app_v3_fetch_hot_search_list | trending/hot-search.md | 热榜 | low | ✓ | ✗ | starter |
| get_live_hot_search | app_v3_fetch_live_hot_search_list | trending/hot-search.md | 热榜 | low | ✓ | ✗ | starter |
| get_music_hot_search | app_v3_fetch_music_hot_search_list | trending/hot-search.md | 热榜 | low | ✓ | ✗ | starter |
| get_brand_hot_search | app_v3_fetch_brand_hot_search_list | trending/hot-search.md | 热榜 | low | ✓ | ✗ | starter |
| get_brand_hot_detail | app_v3_fetch_brand_hot_search_list_detail | trending/hot-search.md | 热榜 | low | ✓ | ✗ | terminal |
| get_web_hot_search | web_fetch_hot_search_result | trending/hot-search.md | 热榜 | low | ✓ | ✗ | starter |
| get_channel_trending | web_fetch_video_channel_result | trending/hot-search.md | 热榜 | low | ✓ | ✗ | starter |
| get_city_list | billboard_fetch_city_list | trending/hot-search.md | 热榜 | low | ✓ | ✗ | starter |
| get_content_tag | billboard_fetch_content_tag | trending/hot-search.md | 热榜 | low | ✓ | ✗ | starter |
| get_hot_category | billboard_fetch_hot_category_list | trending/billboard-events.md | 热榜 | low | ✓ | ✗ | starter |
| get_hot_rise | billboard_fetch_hot_rise_list | trending/billboard-events.md | 热榜 | low | ✓ | ✗ | terminal |
| get_hot_city | billboard_fetch_hot_city_list | trending/billboard-events.md | 热榜 | low | ✓ | ✗ | terminal |
| get_hot_challenge_bb | billboard_fetch_hot_challenge_list | trending/billboard-events.md | 热榜 | low | ✓ | ✗ | terminal |
| get_hot_total | billboard_fetch_hot_total_list | trending/billboard-events.md | 热榜 | low | ✓ | ✗ | starter |
| get_hot_calendar | billboard_fetch_hot_calendar_list | trending/billboard-events.md | 热榜 | high | ✗ | ✓ | starter |
| get_hot_calendar_detail | billboard_fetch_hot_calendar_detail | trending/billboard-events.md | 热榜 | low | ✓ | ✗ | terminal |
| get_hot_user_portrait | billboard_fetch_hot_user_portrait_list | trending/billboard-events.md | 热榜 | low | ✓ | ✗ | terminal |
| get_hot_comment_words | billboard_fetch_hot_comment_word_list | trending/billboard-events.md | 热榜 | low | ✓ | ✗ | terminal |
| get_hot_item_trends | billboard_fetch_hot_item_trends_list | trending/billboard-events.md | 热榜 | low | ✓ | ✗ | terminal |
| get_hot_account | billboard_fetch_hot_account_list | trending/account-content.md | 热榜 | high | ✗ | ✓ | starter |
| search_hot_account | billboard_fetch_hot_account_search_list | trending/account-content.md | 热榜 | low | ✓ | ✗ | starter |
| get_account_trends | billboard_fetch_hot_account_trends_list | trending/account-content.md | 热榜 | low | ✓ | ✗ | terminal |
| get_account_analysis | billboard_fetch_hot_account_item_analysis_list | trending/account-content.md | 热榜 | low | ✓ | ✗ | terminal |
| get_account_fans_portrait | billboard_fetch_hot_account_fans_portrait_list | trending/account-content.md | 热榜 | low | ✓ | ✗ | terminal |
| get_account_fans_interest | billboard_fetch_hot_account_fans_interest_account_list | trending/account-content.md | 热榜 | low | ✓ | ✗ | terminal |
| get_account_fans_topic | billboard_fetch_hot_account_fans_interest_topic_list | trending/account-content.md | 热榜 | low | ✓ | ✗ | terminal |
| get_account_fans_search | billboard_fetch_hot_account_fans_interest_search_list | trending/account-content.md | 热榜 | low | ✓ | ✗ | terminal |
| get_video_rank | billboard_fetch_hot_total_video_list | trending/account-content.md | 热榜 | high | ✗ | ✓ | starter |
| get_low_fan_rank | billboard_fetch_hot_total_low_fan_list | trending/account-content.md | 热榜 | high | ✗ | ✓ | terminal |
| get_high_play_rank | billboard_fetch_hot_total_high_play_list | trending/account-content.md | 热榜 | high | ✗ | ✓ | terminal |
| get_high_like_rank | billboard_fetch_hot_total_high_like_list | trending/account-content.md | 热榜 | high | ✗ | ✓ | terminal |
| get_high_fan_rank | billboard_fetch_hot_total_high_fan_list | trending/account-content.md | 热榜 | high | ✗ | ✓ | terminal |
| get_topic_rank | billboard_fetch_hot_total_topic_list | trending/account-content.md | 热榜 | high | ✗ | ✓ | starter |
| get_topic_hot_rank | billboard_fetch_hot_total_high_topic_list | trending/account-content.md | 热榜 | high | ✗ | ✓ | terminal |
| get_search_rank | billboard_fetch_hot_total_search_list | trending/account-content.md | 热榜 | high | ✗ | ✓ | starter |
| get_search_hot_rank | billboard_fetch_hot_total_high_search_list | trending/account-content.md | 热榜 | high | ✗ | ✓ | terminal |
| get_hot_word_rank | billboard_fetch_hot_total_hot_word_list | trending/account-content.md | 热榜 | high | ✗ | ✓ | starter |
| get_hot_word_detail | billboard_fetch_hot_total_hot_word_detail_list | trending/account-content.md | 热榜 | low | ✓ | ✗ | terminal |

### 星图（xingtu）

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| get_kolid_by_uid | xingtu_get_xingtu_kolid_by_uid | xingtu/kol-resolver.md | 星图 | low | ✓ | ✗ | starter |
| get_kolid_by_sec_uid | xingtu_get_xingtu_kolid_by_sec_user_id | xingtu/kol-resolver.md | 星图 | low | ✓ | ✗ | starter |
| get_kolid_by_unique_id | xingtu_get_xingtu_kolid_by_unique_id | xingtu/kol-resolver.md | 星图 | low | ✓ | ✗ | standalone |
| get_sign_image | xingtu_get_sign_image | xingtu/kol-resolver.md | 星图 | low | ✓ | ✗ | terminal |
| get_kol_base | xingtu_kol_base_info_v1 | xingtu/kol-info-v1.md | 星图 | low | ✓ | ✗ | starter |
| get_kol_audience | xingtu_kol_audience_portrait_v1 | xingtu/kol-info-v1.md | 星图 | low | ✓ | ✗ | terminal |
| get_kol_fans | xingtu_kol_fans_portrait_v1 | xingtu/kol-info-v1.md | 星图 | low | ✓ | ✗ | terminal |
| get_kol_price | xingtu_kol_service_price_v1 | xingtu/kol-info-v1.md | 星图 | low | ✓ | ✗ | terminal |
| get_kol_overview | xingtu_kol_data_overview_v1 | xingtu/kol-info-v1.md | 星图 | low | ✓ | ✗ | terminal |
| get_kol_conversion | xingtu_kol_conversion_ability_analysis_v1 | xingtu/kol-info-v1.md | 星图 | low | ✓ | ✗ | terminal |
| get_kol_video_perf | xingtu_kol_video_performance_v1 | xingtu/kol-info-v1.md | 星图 | low | ✓ | ✗ | terminal |
| get_kol_index | xingtu_kol_xingtu_index_v1 | xingtu/kol-info-v1.md | 星图 | low | ✓ | ✗ | terminal |
| get_kol_convert_video | xingtu_kol_convert_video_display_v1 | xingtu/kol-info-v1.md | 星图 | low | ✓ | ✗ | terminal |
| get_kol_link | xingtu_kol_link_struct_v1 | xingtu/kol-info-v1.md | 星图 | low | ✓ | ✗ | terminal |
| get_kol_touch | xingtu_kol_touch_distribution_v1 | xingtu/kol-info-v1.md | 星图 | low | ✓ | ✗ | terminal |
| get_kol_cp | xingtu_kol_cp_info_v1 | xingtu/kol-info-v1.md | 星图 | low | ✓ | ✗ | terminal |
| get_kol_rec_videos | xingtu_kol_rec_videos_v1 | xingtu/kol-info-v1.md | 星图 | low | ✓ | ✗ | terminal |
| get_kol_daily_fans | xingtu_kol_daily_fans_v1 | xingtu/kol-info-v1.md | 星图 | low | ✓ | ✗ | terminal |
| get_kol_comment_tokens | xingtu_author_hot_comment_tokens_v1 | xingtu/kol-info-v1.md | 星图 | low | ✓ | ✗ | terminal |
| get_kol_content_keywords | xingtu_author_content_hot_comment_keywords_v1 | xingtu/kol-info-v1.md | 星图 | low | ✓ | ✗ | terminal |
| search_kol | xingtu_search_kol_v1 | xingtu/search-rank.md | 星图 | low | ✓ | ✗ | starter |
| search_kol_v2 | xingtu_search_kol_v2 | xingtu/search-rank.md | 星图 | low | ✓ | ✗ | starter |
| get_rank_catalog | xingtu_v2_get_ranking_list_catalog | xingtu/search-rank.md | 星图 | low | ✓ | ✗ | starter |
| get_rank_data | xingtu_v2_get_ranking_list_data | xingtu/search-rank.md | 星图 | low | ✓ | ✗ | relay |
| get_playlet_catalog | xingtu_v2_get_playlet_actor_rank_catalog | xingtu/search-rank.md | 星图 | high | ✗ | ✓ | starter |
| get_playlet_rank | xingtu_v2_get_playlet_actor_rank_list | xingtu/search-rank.md | 星图 | low | ✓ | ✗ | terminal |
| get_author_market_fields | xingtu_v2_get_author_market_fields | xingtu/v2-business.md | 星图 | low | ✓ | ✗ | standalone |
| get_author_base | xingtu_v2_get_author_base_info | xingtu/v2-business.md | 星图 | low | ✓ | ✗ | starter |
| get_author_business | xingtu_v2_get_author_business_card_info | xingtu/v2-business.md | 星图 | low | ✓ | ✗ | terminal |
| get_author_local | xingtu_v2_get_author_local_info | xingtu/v2-business.md | 星图 | low | ✓ | ✗ | terminal |
| get_author_videos | xingtu_v2_get_author_show_items | xingtu/v2-business.md | 星图 | low | ✓ | ✗ | terminal |
| get_author_comment_tokens | xingtu_v2_get_author_hot_comment_tokens | xingtu/v2-business.md | 星图 | low | ✓ | ✗ | terminal |
| get_author_content_keywords | xingtu_v2_get_author_content_hot_keywords | xingtu/v2-business.md | 星图 | low | ✓ | ✗ | terminal |
| get_author_recommend | xingtu_v2_get_recommend_for_star_authors | xingtu/v2-business.md | 星图 | high | ✗ | ✓ | terminal |
| get_case_category | xingtu_v2_get_excellent_case_category_list | xingtu/v2-business.md | 星图 | low | ✓ | ✗ | standalone |
| get_author_spread | xingtu_v2_get_author_spread_info | xingtu/v2-business.md | 星图 | low | ✓ | ✗ | terminal |
| get_user_qrcode | xingtu_v2_get_user_profile_qrcode | xingtu/v2-business.md | 星图 | low | ✓ | ✗ | terminal |
| get_content_trend | xingtu_v2_get_content_trend_guide | xingtu/v2-business.md | 星图 | low | ✓ | ✗ | terminal |
| get_ip_industry | xingtu_v2_get_ip_activity_industry_list | xingtu/v2-business.md | 星图 | low | ✓ | ✗ | starter |
| get_ip_activity | xingtu_v2_get_ip_activity_list | xingtu/v2-business.md | 星图 | high | ✗ | ✓ | relay |
| get_ip_detail | xingtu_v2_get_ip_activity_detail | xingtu/v2-business.md | 星图 | low | ✓ | ✗ | terminal |
| get_resource_list | xingtu_v2_get_resource_list | xingtu/v2-business.md | 星图 | low | ✓ | ✗ | terminal |
| search_mcn | xingtu_v2_get_demander_mcn_list | xingtu/v2-business.md | 星图 | low | ✓ | ✗ | terminal |

### 字段说明
- **atom_id**：业务化别名，Agent 易记易用
- **endpoint_id**：原始端点 ID，与 endpoints_whitelist.yaml / param-mappings.md 对应
- **file**：端点详情所在的 reference 文件（含子目录路径，如 `video/detail.md`）
- **domain**：业务子领域
- **risk**：low / high
- **idempotent**：✓=可安全重试 / ✗=非幂等
- **write_op**：✓=写入端点 / ✗=只读端点
- **chain_role**：starter / relay / terminal / standalone
