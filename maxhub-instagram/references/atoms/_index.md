# Atomic Index / 原子索引

> 本文件是原子化层（Atomic Layer）的索引。每个端点封装为一个"原子"，具备标准化输入/输出/幂等性/链路角色声明。

## 原子映射表

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| v1_fetch_post_by_url | v1_fetch_post_by_url | post.md | 帖子 | low | ✓ | ✗ | starter |
| v1_fetch_post_by_url_v2 | v1_fetch_post_by_url_v2 | post.md | 帖子 | low | ✓ | ✗ | starter |
| v1_fetch_post_by_id | v1_fetch_post_by_id | post.md | 帖子 | low | ✓ | ✗ | starter |
| v1_shortcode_to_media_id | v1_shortcode_to_media_id | post.md | ID转换 | low | ✓ | ✗ | relay |
| v1_media_id_to_shortcode | v1_media_id_to_shortcode | post.md | ID转换 | low | ✓ | ✗ | relay |
| v1_fetch_music_posts | v1_fetch_music_posts | post.md | 音乐 | low | ✓ | ✗ | starter |
| v2_fetch_post_info | v2_fetch_post_info | post.md | 帖子 | low | ✓ | ✗ | starter |
| v2_fetch_post_likes | v2_fetch_post_likes | post.md | 点赞 | low | ✓ | ✗ | terminal |
| v2_shortcode_to_media_id | v2_shortcode_to_media_id | post.md | ID转换 | low | ✓ | ✗ | relay |
| v2_media_id_to_shortcode | v2_media_id_to_shortcode | post.md | ID转换 | low | ✓ | ✗ | relay |
| v2_fetch_music_posts | v2_fetch_music_posts | post.md | 音乐 | low | ✓ | ✗ | starter |
| v3_get_post_info | v3_get_post_info | post.md | 帖子 | low | ✓ | ✗ | starter |
| v3_get_post_info_by_code | v3_get_post_info_by_code | post.md | 帖子 | low | ✓ | ✗ | starter |
| v3_get_post_oembed | v3_get_post_oembed | post.md | 嵌入 | low | ✓ | ✗ | standalone |
| v3_shortcode_to_media_id | v3_shortcode_to_media_id | post.md | ID转换 | low | ✓ | ✗ | relay |
| v3_media_id_to_shortcode | v3_media_id_to_shortcode | post.md | ID转换 | low | ✓ | ✗ | relay |
| v3_extract_shortcode | v3_extract_shortcode | post.md | ID转换 | low | ✓ | ✗ | relay |
| v3_get_recommended_reels | v3_get_recommended_reels | post.md | Reels | low | ✓ | ✗ | starter |
| v3_translate_comment | v3_translate_comment | post.md | 翻译 | low | ✓ | ✗ | terminal |
| v3_bulk_translate_comments | v3_bulk_translate_comments | post.md | 翻译 | low | ✓ | ✗ | terminal |
| v1_user_id_to_username | v1_user_id_to_username | user.md | 用户 | low | ✓ | ✗ | relay |
| v1_fetch_user_info_by_username | v1_fetch_user_info_by_username | user.md | 用户 | low | ✓ | ✗ | starter |
| v1_fetch_user_info_by_username_v2 | v1_fetch_user_info_by_username_v2 | user.md | 用户 | low | ✓ | ✗ | starter |
| v1_fetch_user_info_by_username_v3 | v1_fetch_user_info_by_username_v3 | user.md | 用户 | low | ✓ | ✗ | starter |
| v1_fetch_user_info_by_id | v1_fetch_user_info_by_id | user.md | 用户 | low | ✓ | ✗ | relay |
| v1_fetch_user_info_by_id_v2 | v1_fetch_user_info_by_id_v2 | user.md | 用户 | low | ✓ | ✗ | relay |
| v1_fetch_user_about_info | v1_fetch_user_about_info | user.md | 用户 | low | ✓ | ✗ | terminal |
| v1_fetch_user_posts | v1_fetch_user_posts | user.md | 帖子 | low | ✓ | ✗ | relay |
| v1_fetch_user_posts_v2 | v1_fetch_user_posts_v2 | user.md | 帖子 | low | ✓ | ✗ | relay |
| v1_fetch_user_reels | v1_fetch_user_reels | user.md | Reels | low | ✓ | ✗ | terminal |
| v1_fetch_user_reposts | v1_fetch_user_reposts | user.md | 转发 | low | ✓ | ✗ | terminal |
| v1_fetch_user_tagged_posts | v1_fetch_user_tagged_posts | user.md | 标记 | low | ✓ | ✗ | terminal |
| v1_fetch_related_profiles | v1_fetch_related_profiles | user.md | 推荐 | low | ✓ | ✗ | terminal |
| v2_user_id_to_username | v2_user_id_to_username | user.md | 用户 | low | ✓ | ✗ | relay |
| v2_fetch_user_info | v2_fetch_user_info | user.md | 用户 | low | ✓ | ✗ | starter |
| v2_fetch_user_posts | v2_fetch_user_posts | user.md | 帖子 | low | ✓ | ✗ | relay |
| v2_fetch_user_reels | v2_fetch_user_reels | user.md | Reels | low | ✓ | ✗ | terminal |
| v2_fetch_user_followers | v2_fetch_user_followers | user.md | 粉丝 | low | ✓ | ✗ | terminal |
| v2_fetch_user_following | v2_fetch_user_following | user.md | 关注 | low | ✓ | ✗ | terminal |
| v2_fetch_user_stories | v2_fetch_user_stories | user.md | Stories | low | ✓ | ✗ | terminal |
| v2_fetch_user_highlights | v2_fetch_user_highlights | user.md | 精选 | low | ✓ | ✗ | relay |
| v2_fetch_highlight_stories | v2_fetch_highlight_stories | user.md | 精选 | low | ✓ | ✗ | terminal |
| v2_fetch_user_tagged_posts | v2_fetch_user_tagged_posts | user.md | 标记 | low | ✓ | ✗ | terminal |
| v2_fetch_similar_users | v2_fetch_similar_users | user.md | 推荐 | low | ✓ | ✗ | terminal |
| v3_get_user_id_by_username | v3_get_user_id_by_username | user.md | 用户 | low | ✓ | ✗ | starter |
| v3_get_user_profile | v3_get_user_profile | user.md | 用户 | low | ✓ | ✗ | starter |
| v3_get_user_brief | v3_get_user_brief | user.md | 用户 | low | ✓ | ✗ | standalone |
| v3_get_user_posts | v3_get_user_posts | user.md | 帖子 | low | ✓ | ✗ | relay |
| v3_get_user_tagged_posts | v3_get_user_tagged_posts | user.md | 标记 | low | ✓ | ✗ | terminal |
| v3_get_user_reels | v3_get_user_reels | user.md | Reels | low | ✓ | ✗ | terminal |
| v3_get_user_highlights | v3_get_user_highlights | user.md | 精选 | low | ✓ | ✗ | relay |
| v3_get_highlight_stories | v3_get_highlight_stories | user.md | 精选 | low | ✓ | ✗ | terminal |
| v3_get_user_about | v3_get_user_about | user.md | 用户 | low | ✓ | ✗ | terminal |
| v3_get_user_former_usernames | v3_get_user_former_usernames | user.md | 用户 | low | ✓ | ✗ | terminal |
| v3_get_user_stories | v3_get_user_stories | user.md | Stories | low | ✓ | ✗ | terminal |
| v3_get_user_following | v3_get_user_following | user.md | 关注 | low | ✓ | ✗ | terminal |
| v3_get_user_followers | v3_get_user_followers | user.md | 粉丝 | low | ✓ | ✗ | terminal |
| v1_fetch_search | v1_fetch_search | search.md | 搜索 | low | ✓ | ✗ | starter |
| v1_fetch_hashtag_posts | v1_fetch_hashtag_posts | search.md | 话题 | low | ✓ | ✗ | starter |
| v1_fetch_location_info | v1_fetch_location_info | search.md | 地点 | low | ✓ | ✗ | relay |
| v1_fetch_location_posts | v1_fetch_location_posts | search.md | 地点 | low | ✓ | ✗ | terminal |
| v1_fetch_cities | v1_fetch_cities | search.md | 地区 | low | ✓ | ✗ | standalone |
| v1_fetch_locations | v1_fetch_locations | search.md | 地区 | low | ✓ | ✗ | relay |
| v1_fetch_explore_sections | v1_fetch_explore_sections | search.md | 探索 | low | ✓ | ✗ | standalone |
| v1_fetch_section_posts | v1_fetch_section_posts | search.md | 探索 | low | ✓ | ✗ | terminal |
| v2_search_users | v2_search_users | search.md | 搜索 | low | ✓ | ✗ | starter |
| v2_general_search | v2_general_search | search.md | 搜索 | low | ✓ | ✗ | starter |
| v2_search_reels | v2_search_reels | search.md | 搜索 | low | ✓ | ✗ | starter |
| v2_search_music | v2_search_music | search.md | 音乐 | low | ✓ | ✗ | starter |
| v2_search_hashtags | v2_search_hashtags | search.md | 搜索 | low | ✓ | ✗ | starter |
| v2_search_locations | v2_search_locations | search.md | 搜索 | low | ✓ | ✗ | starter |
| v2_search_by_coordinates | v2_search_by_coordinates | search.md | 地点 | low | ✓ | ✗ | standalone |
| v2_fetch_hashtag_posts | v2_fetch_hashtag_posts | search.md | 话题 | low | ✓ | ✗ | terminal |
| v2_fetch_location_posts | v2_fetch_location_posts | search.md | 地点 | low | ✓ | ✗ | terminal |
| v3_search_users | v3_search_users | search.md | 搜索 | low | ✓ | ✗ | starter |
| v3_search_hashtags | v3_search_hashtags | search.md | 搜索 | low | ✓ | ✗ | starter |
| v3_general_search | v3_general_search | search.md | 搜索 | low | ✓ | ✗ | starter |
| v3_get_explore | v3_get_explore | search.md | 探索 | low | ✓ | ✗ | starter |
| v3_get_location_info | v3_get_location_info | search.md | 地点 | low | ✓ | ✗ | relay |
| v3_get_location_posts | v3_get_location_posts | search.md | 地点 | low | ✓ | ✗ | terminal |
| v3_get_location_nearby | v3_get_location_nearby | search.md | 地点 | low | ✓ | ✗ | terminal |
| v1_fetch_post_comments_v2 | v1_fetch_post_comments_v2 | comments.md | 评论 | low | ✓ | ✗ | relay |
| v1_fetch_comment_replies | v1_fetch_comment_replies | comments.md | 回复 | low | ✓ | ✗ | terminal |
| v2_fetch_post_comments | v2_fetch_post_comments | comments.md | 评论 | low | ✓ | ✗ | relay |
| v2_fetch_comment_replies | v2_fetch_comment_replies | comments.md | 回复 | low | ✓ | ✗ | terminal |
| v3_get_post_comments | v3_get_post_comments | comments.md | 评论 | low | ✓ | ✗ | relay |
| v3_get_comment_replies | v3_get_comment_replies | comments.md | 回复 | low | ✓ | ✗ | terminal |

### 字段说明
- **atom_id**：业务化别名
- **endpoint_id**：原始端点 ID
- **file**：端点详情所在 reference 文件
- **domain**：业务子领域
- **risk**：low / high
- **idempotent**：✓ / ✗
- **write_op**：✓ / ✗
- **chain_role**：starter / relay / terminal / standalone
