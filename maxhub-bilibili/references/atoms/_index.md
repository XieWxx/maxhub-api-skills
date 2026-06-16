# Atomic Index / 原子索引

> 本文件是原子化层（Atomic Layer）的索引。每个端点封装为一个"原子"，具备标准化输入/输出/幂等性/链路角色声明。
> Agent 可按 atom_id 快速定位端点，无需全文读取 reference 详情。

## 原子映射表

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| get_video_app | fetch_one_video_app | video.md | 视频 | low | ✓ | ✗ | starter |
| get_video_web | fetch_one_video_web | video.md | 视频 | low | ✓ | ✗ | starter |
| get_video_v2 | fetch_one_video_v2 | video.md | 视频 | low | ✓ | ✗ | relay |
| get_video_v3 | fetch_one_video_v3 | video.md | 视频 | low | ✓ | ✗ | starter |
| get_video_detail | fetch_video_detail | video.md | 视频 | low | ✓ | ✗ | relay |
| get_play_info | fetch_video_play_info | video.md | 视频 | low | ✓ | ✗ | relay |
| get_playurl | fetch_video_playurl | video.md | 视频 | low | ✓ | ✗ | relay |
| get_vip_playurl | fetch_vip_video_playurl | video.md | 视频 | high | ✗ | ✓ | terminal |
| get_subtitle | fetch_video_subtitle | video.md | 视频 | low | ✓ | ✗ | relay |
| get_parts | fetch_video_parts | video.md | 视频 | low | ✓ | ✗ | relay |
| bv2aid | bv_to_aid | video.md | 视频 | low | ✓ | ✗ | relay |
| get_user_app | fetch_user_info_app | user.md | 用户 | low | ✓ | ✗ | relay |
| get_user_videos_app | fetch_user_videos_app | user.md | 用户 | low | ✓ | ✗ | relay |
| get_profile | fetch_user_profile | user.md | 用户 | low | ✓ | ✗ | starter |
| get_up_stat | fetch_user_up_stat | user.md | 用户 | low | ✓ | ✗ | relay |
| get_relation_stat | fetch_user_relation_stat | user.md | 用户 | low | ✓ | ✗ | relay |
| get_user_posts | fetch_user_post_videos | user.md | 用户 | low | ✓ | ✗ | relay |
| get_user_dynamic | fetch_user_dynamic | user.md | 用户 | low | ✓ | ✗ | relay |
| get_dynamic_v1 | fetch_dynamic_detail | user.md | 用户 | low | ✓ | ✗ | relay |
| get_dynamic_v2 | fetch_dynamic_detail_v2 | user.md | 用户 | low | ✓ | ✗ | relay |
| get_uid_by_link | fetch_get_user_id | user.md | 用户 | low | ✓ | ✗ | starter |
| search_all | fetch_search_all | search.md | 搜索 | low | ✓ | ✗ | starter |
| search_by_type | fetch_search_by_type | search.md | 搜索 | low | ✓ | ✗ | starter |
| get_home_feed | fetch_home_feed | search.md | 搜索 | low | ✓ | ✗ | starter |
| get_popular | fetch_popular_feed | search.md | 搜索 | low | ✓ | ✗ | starter |
| get_cinema | fetch_cinema_tab | search.md | 搜索 | low | ✓ | ✗ | standalone |
| get_bangumi | fetch_bangumi_tab | search.md | 搜索 | low | ✓ | ✗ | standalone |
| get_hot_search | fetch_hot_search | search.md | 热榜 | low | ✓ | ✗ | starter |
| search_general | fetch_general_search | search.md | 搜索 | low | ✓ | ✗ | starter |
| get_com_popular | fetch_com_popular | search.md | 搜索 | low | ✓ | ✗ | starter |
| get_comments_web | fetch_video_comments_web | comments.md | 评论 | low | ✓ | ✗ | relay |
| get_reply_detail | fetch_reply_detail | comments.md | 评论 | low | ✓ | ✗ | relay |
| get_comments_app | fetch_video_comments_app | comments.md | 评论 | low | ✓ | ✗ | relay |
| get_comment_reply | fetch_comment_reply | comments.md | 评论 | low | ✓ | ✗ | relay |
| get_danmaku | fetch_video_danmaku | comments.md | 评论 | low | ✓ | ✗ | relay |
| get_live_room | fetch_live_room_detail | live.md | 直播 | low | ✓ | ✗ | starter |
| get_live_videos | fetch_live_videos | live.md | 直播 | low | ✓ | ✗ | relay |
| get_live_streamers | fetch_live_streamers | live.md | 直播 | low | ✓ | ✗ | relay |
| get_live_areas | fetch_all_live_areas | live.md | 直播 | low | ✓ | ✗ | starter |
| get_folders | fetch_collect_folders | collections.md | 收藏 | low | ✓ | ✗ | relay |
| get_folder_videos | fetch_user_collection_videos | collections.md | 收藏 | low | ✓ | ✗ | relay |

### 字段说明
- **atom_id**：业务化别名，Agent 易记易用
- **endpoint_id**：原始端点 ID，与 endpoints_whitelist.yaml / param-mappings.md 对应
- **file**：端点详情所在的 reference 文件
- **domain**：业务子领域（视频/用户/搜索/热榜/评论/直播/收藏）
- **risk**：low / high（与 endpoints_whitelist.yaml 一致）
- **idempotent**：✓=可安全重试 / ✗=非幂等（写入端点）
- **write_op**：✓=写入端点（需用户确认）/ ✗=只读端点
- **chain_role**：starter=链路起点 / relay=中继 / terminal=终点 / standalone=独立使用
