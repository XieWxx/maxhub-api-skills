# Recipe Index / 编排索引


> 🎯 **Trigger 匹配规则（agent 必读）**：
> 1. **最长匹配优先**：用户输入同时命中多个 recipe 时，选 trigger 短语**最长**（最具体）的那个
> 2. **平局询问**：trigger 长度相同时，反问用户消歧后再调用
> 3. **跨域链路**：用户目标跨多个 recipe（如"先搜索再看评论"）→ 串行调用多个 recipe，**不要**自行拆解 atom


## Recipe 分类索引

| recipe_id | display_name | trigger_keywords | steps | est_calls | file |
|-----------|-------------|-----------------|-------|-----------|------|
| video_detail_with_comments | 视频详情+评论 | "视频评论" "看看评论" "视频下面的评论" | 2 | 2 | recipes/video.md |
| video_detail_with_captions | 视频详情+字幕 | "视频字幕" "有没有字幕" | 2 | 2 | recipes/video.md |
| video_detail_with_related | 视频详情+推荐 | "相关视频" "类似视频" | 2 | 2 | recipes/video.md |
| video_stream_one_step | 获取视频流（一步法） | "下载视频" "播放链接" "视频地址" | 1 | 1 | recipes/video.md |
| video_stream_two_step | 获取视频流（两步法） | "指定格式下载" "选清晰度" | 2 | 2 | recipes/video.md |
| trending_to_detail | 趋势视频→详情 | "热门视频" "趋势" "YouTube热门" | 2 | 2 | recipes/video.md |
| channel_url_to_info | URL→频道信息 | "频道信息" "频道详情" "看看这个频道" | 2 | 2 | recipes/channel.md |
| channel_info_with_videos | 频道信息+视频 | "频道视频" "频道的视频" | 2 | 2 | recipes/channel.md |
| channel_info_with_shorts | 频道信息+Shorts | "频道短视频" "Shorts" | 2 | 2 | recipes/channel.md |
| channel_info_with_posts | 频道信息+帖子 | "社区帖子" "频道帖子" | 2 | 2 | recipes/channel.md |
| search_video_to_detail | 搜索视频→详情 | "搜索视频" "找视频" "搜YouTube" | 2 | 2 | recipes/search.md |
| search_channel_to_info | 搜索频道→信息 | "搜索频道" "找频道" | 2 | 2 | recipes/search.md |
| post_detail_with_comments | 帖子详情+评论 | "帖子评论" "社区帖子详情" | 2 | 2 | recipes/comments.md |
| video_comments_with_replies | 视频评论+回复 | "评论回复" "看看回复" | 2 | 2 | recipes/comments.md |


## 🔗 Recipe 串联图谱 (Chain Graph)

> 当 agent 完成一个 recipe 后，可按本表继续调用下游 recipe，形成跨域链路。
> 自动从 recipe 的 Output 字段与下游 Input 字段计算得出，每个源 recipe 取 top-5 最相关下游。
> 用户目标跨多个 recipe（如「搜某 UP 主 → 看其投稿 → 看视频评论」）时按本图**依序调用**，不要自行拆 atom。

| 已完成 Recipe | 输出字段 | 可继续 Recipe (按相关性排序) | 接力字段 |
|--------------|---------|----------------------------|---------|
| `channel_info_with_posts` (频道信息+帖子) | `channel_id`, `cid` | 🔀 `search_channel_to_info` (搜索频道→信息) | `channel_id`, `cid` |
| `channel_info_with_posts` (频道信息+帖子) | `channel_id`, `cid` | `channel_url_to_info` (URL→频道信息) | `channel_id`, `cid` |
| `channel_info_with_posts` (频道信息+帖子) | `channel_id`, `cid` | `channel_info_with_videos` (频道信息+视频) | `channel_id`, `cid` |
| `channel_info_with_posts` (频道信息+帖子) | `channel_id`, `cid` | `channel_info_with_shorts` (频道信息+Shorts) | `channel_id`, `cid` |
| `channel_info_with_shorts` (频道信息+Shorts) | `channel_id`, `cid` | 🔀 `search_channel_to_info` (搜索频道→信息) | `channel_id`, `cid` |
| `channel_info_with_shorts` (频道信息+Shorts) | `channel_id`, `cid` | `channel_url_to_info` (URL→频道信息) | `channel_id`, `cid` |
| `channel_info_with_shorts` (频道信息+Shorts) | `channel_id`, `cid` | `channel_info_with_videos` (频道信息+视频) | `channel_id`, `cid` |
| `channel_info_with_shorts` (频道信息+Shorts) | `channel_id`, `cid` | `channel_info_with_posts` (频道信息+帖子) | `channel_id`, `cid` |
| `channel_info_with_videos` (频道信息+视频) | `channel_id`, `cid` | 🔀 `search_channel_to_info` (搜索频道→信息) | `channel_id`, `cid` |
| `channel_info_with_videos` (频道信息+视频) | `channel_id`, `cid` | `channel_url_to_info` (URL→频道信息) | `channel_id`, `cid` |
| `channel_info_with_videos` (频道信息+视频) | `channel_id`, `cid` | `channel_info_with_shorts` (频道信息+Shorts) | `channel_id`, `cid` |
| `channel_info_with_videos` (频道信息+视频) | `channel_id`, `cid` | `channel_info_with_posts` (频道信息+帖子) | `channel_id`, `cid` |
| `channel_url_to_info` (URL→频道信息) | `channel_id`, `cid` | 🔀 `search_channel_to_info` (搜索频道→信息) | `channel_id`, `cid` |
| `channel_url_to_info` (URL→频道信息) | `channel_id`, `cid` | `channel_info_with_videos` (频道信息+视频) | `channel_id`, `cid` |
| `channel_url_to_info` (URL→频道信息) | `channel_id`, `cid` | `channel_info_with_shorts` (频道信息+Shorts) | `channel_id`, `cid` |
| `channel_url_to_info` (URL→频道信息) | `channel_id`, `cid` | `channel_info_with_posts` (频道信息+帖子) | `channel_id`, `cid` |
| `search_channel_to_info` (搜索频道→信息) | `channel_id`, `cid` | 🔀 `channel_url_to_info` (URL→频道信息) | `channel_id`, `cid` |
| `search_channel_to_info` (搜索频道→信息) | `channel_id`, `cid` | 🔀 `channel_info_with_videos` (频道信息+视频) | `channel_id`, `cid` |
| `search_channel_to_info` (搜索频道→信息) | `channel_id`, `cid` | 🔀 `channel_info_with_shorts` (频道信息+Shorts) | `channel_id`, `cid` |
| `search_channel_to_info` (搜索频道→信息) | `channel_id`, `cid` | 🔀 `channel_info_with_posts` (频道信息+帖子) | `channel_id`, `cid` |
| `search_channel_to_info` (搜索频道→信息) | `keyword` | `search_video_to_detail` (搜索视频→详情) | `keyword` |
| `search_video_to_detail` (搜索视频→详情) | `vid`, `video_id` | 🔀 `video_detail_with_comments` (视频详情+评论) | `vid`, `video_id` |
| `search_video_to_detail` (搜索视频→详情) | `vid`, `video_id` | 🔀 `video_detail_with_captions` (视频详情+字幕) | `vid`, `video_id` |
| `search_video_to_detail` (搜索视频→详情) | `vid`, `video_id` | 🔀 `video_detail_with_related` (视频详情+推荐) | `vid`, `video_id` |
| `search_video_to_detail` (搜索视频→详情) | `vid`, `video_id` | 🔀 `trending_to_detail` (趋势视频→详情) | `vid`, `video_id` |
| `search_video_to_detail` (搜索视频→详情) | `video_id` | 🔀 `video_comments_with_replies` (视频评论+回复) | `video_id` |
| `trending_to_detail` (趋势视频→详情) | `vid`, `video_id` | 🔀 `search_video_to_detail` (搜索视频→详情) | `vid`, `video_id` |
| `trending_to_detail` (趋势视频→详情) | `video_id` | 🔀 `video_comments_with_replies` (视频评论+回复) | `video_id` |
| `trending_to_detail` (趋势视频→详情) | `vid`, `video_id` | `video_detail_with_comments` (视频详情+评论) | `vid`, `video_id` |
| `trending_to_detail` (趋势视频→详情) | `vid`, `video_id` | `video_detail_with_captions` (视频详情+字幕) | `vid`, `video_id` |
| `trending_to_detail` (趋势视频→详情) | `vid`, `video_id` | `video_detail_with_related` (视频详情+推荐) | `vid`, `video_id` |
| `video_comments_with_replies` (视频评论+回复) | `video_id` | 🔀 `search_video_to_detail` (搜索视频→详情) | `video_id` |
| `video_comments_with_replies` (视频评论+回复) | `video_id` | 🔀 `video_detail_with_comments` (视频详情+评论) | `video_id` |
| `video_comments_with_replies` (视频评论+回复) | `video_id` | 🔀 `video_detail_with_captions` (视频详情+字幕) | `video_id` |
| `video_comments_with_replies` (视频评论+回复) | `video_id` | 🔀 `video_detail_with_related` (视频详情+推荐) | `video_id` |
| `video_comments_with_replies` (视频评论+回复) | `video_id` | 🔀 `video_stream_two_step` (获取视频流（两步法）) | `video_id` |
| `video_detail_with_captions` (视频详情+字幕) | `vid`, `video_id` | 🔀 `search_video_to_detail` (搜索视频→详情) | `vid`, `video_id` |
| `video_detail_with_captions` (视频详情+字幕) | `video_id` | 🔀 `video_comments_with_replies` (视频评论+回复) | `video_id` |
| `video_detail_with_captions` (视频详情+字幕) | `vid`, `video_id` | `video_detail_with_comments` (视频详情+评论) | `vid`, `video_id` |
| `video_detail_with_captions` (视频详情+字幕) | `vid`, `video_id` | `video_detail_with_related` (视频详情+推荐) | `vid`, `video_id` |
| `video_detail_with_captions` (视频详情+字幕) | `vid`, `video_id` | `trending_to_detail` (趋势视频→详情) | `vid`, `video_id` |
| `video_detail_with_comments` (视频详情+评论) | `vid`, `video_id` | 🔀 `search_video_to_detail` (搜索视频→详情) | `vid`, `video_id` |
| `video_detail_with_comments` (视频详情+评论) | `video_id` | 🔀 `video_comments_with_replies` (视频评论+回复) | `video_id` |
| `video_detail_with_comments` (视频详情+评论) | `vid`, `video_id` | `video_detail_with_captions` (视频详情+字幕) | `vid`, `video_id` |
| `video_detail_with_comments` (视频详情+评论) | `vid`, `video_id` | `video_detail_with_related` (视频详情+推荐) | `vid`, `video_id` |
| `video_detail_with_comments` (视频详情+评论) | `vid`, `video_id` | `trending_to_detail` (趋势视频→详情) | `vid`, `video_id` |
| `video_detail_with_related` (视频详情+推荐) | `vid`, `video_id` | 🔀 `search_video_to_detail` (搜索视频→详情) | `vid`, `video_id` |
| `video_detail_with_related` (视频详情+推荐) | `video_id` | 🔀 `video_comments_with_replies` (视频评论+回复) | `video_id` |
| `video_detail_with_related` (视频详情+推荐) | `vid`, `video_id` | `video_detail_with_comments` (视频详情+评论) | `vid`, `video_id` |
| `video_detail_with_related` (视频详情+推荐) | `vid`, `video_id` | `video_detail_with_captions` (视频详情+字幕) | `vid`, `video_id` |
| `video_detail_with_related` (视频详情+推荐) | `vid`, `video_id` | `trending_to_detail` (趋势视频→详情) | `vid`, `video_id` |
| `video_stream_one_step` (获取视频流（一步法）) | `video_id` | 🔀 `video_comments_with_replies` (视频评论+回复) | `video_id` |
| `video_stream_one_step` (获取视频流（一步法）) | `video_id` | 🔀 `search_video_to_detail` (搜索视频→详情) | `video_id` |
| `video_stream_one_step` (获取视频流（一步法）) | `video_id` | `video_detail_with_comments` (视频详情+评论) | `video_id` |
| `video_stream_one_step` (获取视频流（一步法）) | `video_id` | `video_detail_with_captions` (视频详情+字幕) | `video_id` |
| `video_stream_one_step` (获取视频流（一步法）) | `video_id` | `video_detail_with_related` (视频详情+推荐) | `video_id` |
| `video_stream_two_step` (获取视频流（两步法）) | `video_id` | 🔀 `video_comments_with_replies` (视频评论+回复) | `video_id` |
| `video_stream_two_step` (获取视频流（两步法）) | `video_id` | 🔀 `search_video_to_detail` (搜索视频→详情) | `video_id` |
| `video_stream_two_step` (获取视频流（两步法）) | `video_id` | `video_detail_with_comments` (视频详情+评论) | `video_id` |
| `video_stream_two_step` (获取视频流（两步法）) | `video_id` | `video_detail_with_captions` (视频详情+字幕) | `video_id` |
| `video_stream_two_step` (获取视频流（两步法）) | `video_id` | `video_detail_with_related` (视频详情+推荐) | `video_id` |

> 🔀 = 跨文件链路 (cross-domain chain)；优先选 🔀 标记的下游 recipe，因为它能扩展 agent 已有的数据视图。

**典型 3 步用法**：
1. 用户语义 → 在 `_index.md` trigger_keywords 列匹配第 1 个 recipe
2. 执行第 1 个 recipe，得到 Output 字段
3. 在本表查 "已完成 Recipe" 列 → 选合适的下游 → 用 "接力字段" 直接传参，无需问用户重复输入

