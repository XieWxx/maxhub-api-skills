# Atomic Index / 原子索引

> 本文件是原子化层（Atomic Layer）的索引。每个端点封装为一个"原子"，具备标准化输入/输出/幂等性/链路角色声明。

## 原子映射表

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| app_fetch_status_detail | app_fetch_status_detail | post.md | 微博内容 | low | ✓ | ✗ | starter |
| app_fetch_status_reposts | app_fetch_status_reposts | post.md | 微博内容 | low | ✓ | ✗ | terminal |
| app_fetch_status_likes | app_fetch_status_likes | post.md | 微博内容 | low | ✓ | ✗ | terminal |
| app_fetch_video_detail | app_fetch_video_detail | post.md | 视频 | low | ✓ | ✗ | starter |
| app_fetch_video_featured_feed | app_fetch_video_featured_feed | post.md | 视频 | low | ✓ | ✗ | standalone |
| app_fetch_home_recommend_feed | app_fetch_home_recommend_feed | post.md | 发现 | low | ✓ | ✗ | starter |
| web_fetch_post_detail | web_fetch_post_detail | post.md | 微博内容 | low | ✓ | ✗ | starter |
| web_fetch_config_list | web_fetch_config_list | post.md | 频道 | low | ✓ | ✗ | starter |
| web_fetch_trend_top | web_fetch_trend_top | post.md | 频道 | low | ✓ | ✗ | relay |
| web_fetch_channel_feed | web_fetch_channel_feed | post.md | 频道 | low | ✓ | ✗ | standalone |
| web_v2_fetch_post_detail | web_v2_fetch_post_detail | post.md | 微博内容 | low | ✓ | ✗ | starter |
| web_v2_check_allow_comment | web_v2_check_allow_comment_with_pic | post.md | 微博内容 | low | ✓ | ✗ | standalone |
| web_v2_fetch_user_recommend_timeline | web_v2_fetch_user_recommend_timeline | post.md | 发现 | low | ✓ | ✗ | starter |
| web_v2_fetch_hot_ranking_timeline | web_v2_fetch_hot_ranking_timeline | post.md | 榜单 | low | ✓ | ✗ | starter |
| app_fetch_user_info | app_fetch_user_info | user.md | 用户 | low | ✓ | ✗ | starter |
| app_fetch_user_info_detail | app_fetch_user_info_detail | user.md | 用户 | low | ✓ | ✗ | relay |
| app_fetch_user_timeline | app_fetch_user_timeline | user.md | 用户 | low | ✓ | ✗ | relay |
| app_fetch_user_videos | app_fetch_user_videos | user.md | 用户 | low | ✓ | ✗ | terminal |
| app_fetch_user_super_topics | app_fetch_user_super_topics | user.md | 用户 | low | ✓ | ✗ | terminal |
| app_fetch_user_album | app_fetch_user_album | user.md | 用户 | low | ✓ | ✗ | terminal |
| app_fetch_user_articles | app_fetch_user_articles | user.md | 用户 | low | ✓ | ✗ | terminal |
| app_fetch_user_audios | app_fetch_user_audios | user.md | 用户 | low | ✓ | ✗ | terminal |
| app_fetch_user_profile_feed | app_fetch_user_profile_feed | user.md | 用户 | low | ✓ | ✗ | relay |
| web_fetch_user_info | web_fetch_user_info | user.md | 用户 | low | ✓ | ✗ | standalone |
| web_fetch_user_posts | web_fetch_user_posts | user.md | 用户 | low | ✓ | ✗ | relay |
| web_v2_fetch_user_info | web_v2_fetch_user_info | user.md | 用户 | low | ✓ | ✗ | starter |
| web_v2_fetch_user_basic_info | web_v2_fetch_user_basic_info | user.md | 用户 | low | ✓ | ✗ | standalone |
| web_v2_fetch_user_posts | web_v2_fetch_user_posts | user.md | 用户 | low | ✓ | ✗ | relay |
| web_v2_fetch_user_original_posts | web_v2_fetch_user_original_posts | user.md | 用户 | low | ✓ | ✗ | terminal |
| web_v2_search_user_posts | web_v2_search_user_posts | user.md | 用户 | low | ✓ | ✗ | terminal |
| web_v2_fetch_user_video_collection_list | web_v2_fetch_user_video_collection_list | user.md | 用户 | low | ✓ | ✗ | starter |
| web_v2_fetch_user_video_collection_detail | web_v2_fetch_user_video_collection_detail | user.md | 用户 | low | ✓ | ✗ | terminal |
| web_v2_fetch_user_video_list | web_v2_fetch_user_video_list | user.md | 用户 | low | ✓ | ✗ | terminal |
| web_v2_fetch_user_following | web_v2_fetch_user_following | user.md | 用户 | low | ✓ | ✗ | terminal |
| web_v2_fetch_user_fans | web_v2_fetch_user_fans | user.md | 用户 | low | ✓ | ✗ | terminal |
| web_v2_fetch_all_groups | web_v2_fetch_all_groups | user.md | 用户 | low | ✓ | ✗ | standalone |
| app_fetch_search_all | app_fetch_search_all | search.md | 搜索 | low | ✓ | ✗ | starter |
| app_fetch_ai_smart_search | app_fetch_ai_smart_search | search.md | 搜索 | low | ✓ | ✗ | standalone |
| app_fetch_hot_search | app_fetch_hot_search | search.md | 热搜 | low | ✓ | ✗ | starter |
| app_fetch_hot_search_categories | app_fetch_hot_search_categories | search.md | 热搜 | low | ✓ | ✗ | standalone |
| web_fetch_search | web_fetch_search | search.md | 搜索 | low | ✓ | ✗ | starter |
| web_fetch_hot_search | web_fetch_hot_search | search.md | 热搜 | low | ✓ | ✗ | standalone |
| web_fetch_search_topics | web_fetch_search_topics | search.md | 热搜 | low | ✓ | ✗ | standalone |
| web_v2_fetch_hot_search_index | web_v2_fetch_hot_search_index | search.md | 热搜 | low | ✓ | ✗ | standalone |
| web_v2_fetch_hot_search_summary | web_v2_fetch_hot_search_summary | search.md | 热搜 | low | ✓ | ✗ | starter |
| web_v2_fetch_hot_search | web_v2_fetch_hot_search | search.md | 热搜 | low | ✓ | ✗ | standalone |
| web_v2_fetch_entertainment_ranking | web_v2_fetch_entertainment_ranking | search.md | 榜单 | low | ✓ | ✗ | standalone |
| web_v2_fetch_life_ranking | web_v2_fetch_life_ranking | search.md | 榜单 | low | ✓ | ✗ | standalone |
| web_v2_fetch_social_ranking | web_v2_fetch_social_ranking | search.md | 榜单 | low | ✓ | ✗ | standalone |
| web_v2_fetch_similar_search | web_v2_fetch_similar_search | search.md | 搜索 | low | ✓ | ✗ | standalone |
| web_v2_fetch_ai_search | web_v2_fetch_ai_search | search.md | 搜索 | low | ✓ | ✗ | standalone |
| web_v2_fetch_ai_related_search | web_v2_fetch_ai_related_search | search.md | 搜索 | low | ✓ | ✗ | standalone |
| web_v2_fetch_advanced_search | web_v2_fetch_advanced_search | search.md | 搜索 | low | ✓ | ✗ | starter |
| web_v2_fetch_city_list | web_v2_fetch_city_list | search.md | 地区 | low | ✓ | ✗ | standalone |
| web_v2_fetch_realtime_search | web_v2_fetch_realtime_search | search.md | 搜索 | low | ✓ | ✗ | starter |
| web_v2_fetch_user_search | web_v2_fetch_user_search | search.md | 搜索 | low | ✓ | ✗ | starter |
| web_v2_fetch_video_search | web_v2_fetch_video_search | search.md | 搜索 | low | ✓ | ✗ | starter |
| web_v2_fetch_pic_search | web_v2_fetch_pic_search | search.md | 搜索 | low | ✓ | ✗ | standalone |
| web_v2_fetch_topic_search | web_v2_fetch_topic_search | search.md | 搜索 | low | ✓ | ✗ | standalone |
| app_fetch_status_comments | app_fetch_status_comments | comments.md | 评论 | low | ✓ | ✗ | relay |
| web_fetch_post_comments | web_fetch_post_comments | comments.md | 评论 | low | ✓ | ✗ | relay |
| web_fetch_comment_replies | web_fetch_comment_replies | comments.md | 评论 | low | ✓ | ✗ | terminal |
| web_v2_fetch_post_comments | web_v2_fetch_post_comments | comments.md | 评论 | low | ✓ | ✗ | relay |
| web_v2_fetch_post_sub_comments | web_v2_fetch_post_sub_comments | comments.md | 评论 | low | ✓ | ✗ | terminal |

### 字段说明
- **atom_id**：业务化别名
- **endpoint_id**：原始端点 ID
- **file**：端点详情所在 reference 文件
- **domain**：业务子领域
- **risk**：low / high
- **idempotent**：✓ / ✗
- **write_op**：✓ / ✗
- **chain_role**：starter / relay / terminal / standalone
