# Atomic Index / 原子索引

> 本文件是原子化层（Atomic Layer）的索引。每个端点封装为一个"原子"，具备标准化输入/输出/幂等性/链路角色声明。

## 原子映射表

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| app_fetch_one_video | app_fetch_one_video | video.md | 视频 | low | ✓ | ✗ | starter |
| app_fetch_videos_batch | app_fetch_videos_batch | video.md | 视频 | low | ✓ | ✗ | starter |
| app_fetch_one_video_by_url | app_fetch_one_video_by_url | video.md | 视频 | low | ✓ | ✗ | starter |
| app_generate_kuaishou_share_link | app_generate_kuaishou_share_link | video.md | 分享 | low | ✓ | ✗ | terminal |
| web_fetch_one_video | web_fetch_one_video | video.md | 视频 | low | ✓ | ✗ | starter |
| web_fetch_one_video_v2 | web_fetch_one_video_v2 | video.md | 视频 | low | ✓ | ✗ | starter |
| web_fetch_one_video_by_url | web_fetch_one_video_by_url | video.md | 视频 | low | ✓ | ✗ | starter |
| web_generate_share_short_url | web_generate_share_short_url | video.md | 分享 | low | ✓ | ✗ | terminal |
| app_fetch_selection_feed | app_fetch_selection_feed | search.md | 推荐 | low | ✓ | ✗ | starter |
| app_search_comprehensive | app_search_comprehensive | search.md | 搜索 | low | ✓ | ✗ | starter |
| app_search_video_v2 | app_search_video_v2 | search.md | 搜索 | low | ✓ | ✗ | starter |
| app_search_user_v2 | app_search_user_v2 | search.md | 搜索 | low | ✓ | ✗ | starter |
| app_search_image | app_search_image | search.md | 搜索 | low | ✓ | ✗ | starter |
| app_search_live | app_search_live | search.md | 搜索 | low | ✓ | ✗ | starter |
| app_search_music | app_search_music | search.md | 搜索 | low | ✓ | ✗ | starter |
| app_search_tag | app_search_tag | search.md | 搜索 | low | ✓ | ✗ | starter |
| app_fetch_tag_feed | app_fetch_tag_feed | search.md | 话题 | low | ✓ | ✗ | relay |
| app_fetch_hot_board_categories | app_fetch_hot_board_categories | search.md | 热榜 | low | ✓ | ✗ | standalone |
| app_fetch_hot_board_detail | app_fetch_hot_board_detail | search.md | 热榜 | low | ✓ | ✗ | relay |
| app_fetch_hot_search_person | app_fetch_hot_search_person | search.md | 热搜 | low | ✓ | ✗ | standalone |
| web_fetch_kuaishou_hot_list_v1 | web_fetch_kuaishou_hot_list_v1 | search.md | 热榜 | low | ✓ | ✗ | standalone |
| web_fetch_kuaishou_hot_list_v2 | web_fetch_kuaishou_hot_list_v2 | search.md | 热榜 | low | ✓ | ✗ | starter |
| app_fetch_one_user_v2 | app_fetch_one_user_v2 | user.md | 用户 | low | ✓ | ✗ | starter |
| app_fetch_user_post_v2 | app_fetch_user_post_v2 | user.md | 视频 | low | ✓ | ✗ | relay |
| app_fetch_user_hot_post | app_fetch_user_hot_post | user.md | 视频 | low | ✓ | ✗ | terminal |
| web_fetch_user_info | web_fetch_user_info | user.md | 用户 | low | ✓ | ✗ | starter |
| web_fetch_user_collect | web_fetch_user_collect | user.md | 收藏 | low | ✓ | ✗ | terminal |
| web_fetch_get_user_id | web_fetch_get_user_id | user.md | 用户 | low | ✓ | ✗ | relay |
| app_fetch_video_comment | app_fetch_video_comment | comments.md | 评论 | low | ✓ | ✗ | relay |
| app_fetch_video_sub_comments | app_fetch_video_sub_comments | comments.md | 回复 | low | ✓ | ✗ | terminal |
| web_fetch_one_video_comment | web_fetch_one_video_comment | comments.md | 评论 | low | ✓ | ✗ | relay |
| web_fetch_one_video_sub_comment | web_fetch_one_video_sub_comment | comments.md | 回复 | low | ✓ | ✗ | terminal |
| app_fetch_user_live_info | app_fetch_user_live_info | live.md | 直播 | low | ✓ | ✗ | terminal |
| app_fetch_live_top_list | app_fetch_live_top_list | live.md | 榜单 | low | ✓ | ✗ | standalone |
| app_fetch_shopping_top_list | app_fetch_shopping_top_list | live.md | 榜单 | low | ✓ | ✗ | standalone |
| app_fetch_brand_top_list | app_fetch_brand_top_list | live.md | 榜单 | low | ✓ | ✗ | standalone |
| app_fetch_music_ranking | app_fetch_music_ranking | live.md | 音乐 | low | ✓ | ✗ | standalone |
| web_fetch_user_live_replay | web_fetch_user_live_replay | live.md | 直播 | low | ✓ | ✗ | terminal |

### 字段说明
- **atom_id**：业务化别名
- **endpoint_id**：原始端点 ID
- **file**：端点详情所在 reference 文件
- **domain**：业务子领域
- **risk**：low / high
- **idempotent**：✓ / ✗
- **write_op**：✓ / ✗
- **chain_role**：starter / relay / terminal / standalone
