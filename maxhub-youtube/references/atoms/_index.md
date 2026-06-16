# Atomic Index / 原子索引

> 本文件是原子化层（Atomic Layer）的索引。每个端点封装为一个"原子"，具备标准化输入/输出/幂等性/链路角色声明。

## 原子映射表

| atom_id | endpoint_id | file | domain | risk | idempotent | write_op | chain_role |
|---------|------------|------|--------|------|-----------|---------|------------|
| get_video_info | web_get_video_info | video.md | 视频 | low | ✓ | ✗ | standalone |
| get_video_info_v2 | web_get_video_info_v2 | video.md | 视频 | low | ✓ | ✗ | standalone |
| get_video_subtitles | web_get_video_subtitles | video.md | 视频 | low | ✓ | ✗ | relay |
| get_relate_video | web_get_relate_video | video.md | 视频 | low | ✓ | ✗ | relay |
| get_trending_videos | web_get_trending_videos | video.md | 视频 | low | ✓ | ✗ | starter |
| v2_get_video_info | web_v2_get_video_info | video.md | 视频 | low | ✓ | ✗ | standalone |
| v2_get_video_info_v2 | web_v2_get_video_info_v2 | video.md | 视频 | low | ✓ | ✗ | starter |
| v2_get_video_streams | web_v2_get_video_streams | video.md | 视频 | low | ✓ | ✗ | relay |
| v2_get_video_streams_v2 | web_v2_get_video_streams_v2 | video.md | 视频 | low | ✓ | ✗ | terminal |
| v2_get_signed_stream_url | web_v2_get_signed_stream_url | video.md | 视频 | low | ✓ | ✗ | terminal |
| v2_get_video_captions | web_v2_get_video_captions | video.md | 视频 | low | ✓ | ✗ | relay |
| v2_get_video_captions_v2 | web_v2_get_video_captions_v2 | video.md | 视频 | low | ✓ | ✗ | relay |
| v2_get_related_videos | web_v2_get_related_videos | video.md | 视频 | low | ✓ | ✗ | relay |
| get_channel_id | web_get_channel_id | channel.md | 频道 | low | ✓ | ✗ | starter |
| get_channel_id_v2 | web_get_channel_id_v2 | channel.md | 频道 | low | ✓ | ✗ | starter |
| get_channel_url | web_get_channel_url | channel.md | 频道 | low | ✓ | ✗ | standalone |
| get_channel_info | web_get_channel_info | channel.md | 频道 | low | ✓ | ✗ | standalone |
| get_channel_videos_v2 | web_get_channel_videos_v2 | channel.md | 频道 | low | ✓ | ✗ | relay |
| get_channel_short_videos | web_get_channel_short_videos | channel.md | 频道 | low | ✓ | ✗ | relay |
| v2_get_channel_description | web_v2_get_channel_description | channel.md | 频道 | low | ✓ | ✗ | starter |
| v2_get_channel_id | web_v2_get_channel_id | channel.md | 频道 | low | ✓ | ✗ | starter |
| v2_get_channel_url | web_v2_get_channel_url | channel.md | 频道 | low | ✓ | ✗ | standalone |
| v2_get_channel_videos | web_v2_get_channel_videos | channel.md | 频道 | low | ✓ | ✗ | relay |
| v2_get_channel_shorts | web_v2_get_channel_shorts | channel.md | 频道 | low | ✓ | ✗ | relay |
| v2_get_channel_community_posts | web_v2_get_channel_community_posts | channel.md | 频道 | low | ✓ | ✗ | relay |
| search_video | web_search_video | search.md | 搜索 | low | ✓ | ✗ | starter |
| search_channel | web_search_channel | search.md | 搜索 | low | ✓ | ✗ | relay |
| v2_get_general_search | web_v2_get_general_search | search.md | 搜索 | low | ✓ | ✗ | starter |
| v2_get_general_search_v2 | web_v2_get_general_search_v2 | search.md | 搜索 | low | ✓ | ✗ | starter |
| v2_get_shorts_search | web_v2_get_shorts_search | search.md | 搜索 | low | ✓ | ✗ | starter |
| v2_get_shorts_search_v2 | web_v2_get_shorts_search_v2 | search.md | 搜索 | low | ✓ | ✗ | starter |
| v2_get_search_suggestions | web_v2_get_search_suggestions | search.md | 搜索 | low | ✓ | ✗ | starter |
| v2_search_channels | web_v2_search_channels | search.md | 搜索 | low | ✓ | ✗ | starter |
| v2_get_video_comments | web_v2_get_video_comments | comments.md | 评论 | low | ✓ | ✗ | relay |
| v2_get_video_comment_replies | web_v2_get_video_comment_replies | comments.md | 评论 | low | ✓ | ✗ | terminal |
| v2_get_post_detail | web_v2_get_post_detail | comments.md | 评论 | low | ✓ | ✗ | starter |
| v2_get_post_comments | web_v2_get_post_comments | comments.md | 评论 | low | ✓ | ✗ | relay |
| v2_get_post_comment_replies | web_v2_get_post_comment_replies | comments.md | 评论 | low | ✓ | ✗ | terminal |
