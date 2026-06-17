# Recipe Index / 编排索引


> 🎯 **Trigger 匹配规则（agent 必读）**：
> 1. **最长匹配优先**：用户输入同时命中多个 recipe 时，选 trigger 短语**最长**（最具体）的那个
> 2. **平局询问**：trigger 长度相同时，反问用户消歧后再调用
> 3. **跨域链路**：用户目标跨多个 recipe（如"先搜索再看评论"）→ 串行调用多个 recipe，**不要**自行拆解 atom


## Recipe 分类索引

| recipe_id | display_name | trigger_keywords | steps | est_calls | file |
|-----------|-------------|-----------------|-------|-----------|------|
| search_video_then_detail | 搜视频看详情 | "搜视频" "找视频" | 2 | 2 | recipes/video.md |
| share_link_to_video_detail | 分享链接看视频 | "打开链接" "视频链接" | 2 | 2 | recipes/video.md |
| video_detail_then_comments | 视频详情看评论 | "视频评论" "看评论" | 2 | 2 | recipes/video.md |
| video_detail_then_author | 视频看作者主页 | "博主主页" | 2 | 2 | recipes/video.md |
| video_detail_then_share | 视频详情生分享 | "分享链接" "生成分享" | 2 | 2 | recipes/video.md |
| selection_feed_then_detail | 推荐看视频详情 | "首页推荐" | 2 | 2 | recipes/video.md |
| hot_list_then_detail | 热榜看视频详情 | "快手热榜" | 2 | 2 | recipes/video.md |
| search_user_then_profile | 搜用户看主页 | "搜用户" "找博主" | 2 | 2 | recipes/user.md |
| share_link_to_user_profile | 分享链接看用户 | "用户链接" "主页链接" | 2 | 2 | recipes/user.md |
| user_profile_then_posts | 用户资料加视频 | "用户视频" "主页视频" | 2 | 2 | recipes/user.md |
| user_profile_then_hot_posts | 用户资料加热门 | "热门作品" "热门视频" | 2 | 2 | recipes/user.md |
| user_profile_then_live | 用户资料加直播 | "直播信息" "在直播吗" | 2 | 2 | recipes/user.md |
| search_tag_then_feed | 搜话题看内容 | "话题内容" "标签内容" | 2 | 2 | recipes/search.md |
| hot_board_categories_then_detail | 热榜分类看详情 | "热榜分类" "榜单详情" | 2 | 2 | recipes/search.md |
| video_comments_then_replies | 评论展开回复 | "看回复" "评论回复" | 2 | 2 | recipes/comments.md |


## 🔗 Recipe 串联图谱 (Chain Graph)

> 当 agent 完成一个 recipe 后，可按本表继续调用下游 recipe，形成跨域链路。
> 自动从 recipe 的 Output 字段与下游 Input 字段计算得出，每个源 recipe 取 top-5 最相关下游。
> 用户目标跨多个 recipe（如「搜某 UP 主 → 看其投稿 → 看视频评论」）时按本图**依序调用**，不要自行拆 atom。

| 已完成 Recipe | 输出字段 | 可继续 Recipe (按相关性排序) | 接力字段 |
|--------------|---------|----------------------------|---------|
| `hot_list_then_detail` (热榜看视频详情) | `photo_id` | 🔀 `video_comments_then_replies` (评论展开回复) | `photo_id` |
| `hot_list_then_detail` (热榜看视频详情) | `photo_id` | `search_video_then_detail` (搜视频看详情) | `photo_id` |
| `hot_list_then_detail` (热榜看视频详情) | `photo_id` | `video_detail_then_author` (视频看作者主页) | `photo_id` |
| `hot_list_then_detail` (热榜看视频详情) | `photo_id` | `video_detail_then_share` (视频详情生分享) | `photo_id` |
| `hot_list_then_detail` (热榜看视频详情) | `photo_id` | `video_detail_then_comments` (视频详情看评论) | `photo_id` |
| `search_tag_then_feed` (搜话题看内容) | `keyword` | 🔀 `search_user_then_profile` (搜用户看主页) | `keyword` |
| `search_tag_then_feed` (搜话题看内容) | `keyword` | 🔀 `search_video_then_detail` (搜视频看详情) | `keyword` |
| `search_user_then_profile` (搜用户看主页) | `keyword` | 🔀 `search_tag_then_feed` (搜话题看内容) | `keyword` |
| `search_user_then_profile` (搜用户看主页) | `keyword` | 🔀 `search_video_then_detail` (搜视频看详情) | `keyword` |
| `search_user_then_profile` (搜用户看主页) | `user_id` | 🔀 `video_detail_then_author` (视频看作者主页) | `user_id` |
| `search_user_then_profile` (搜用户看主页) | `user_id` | `share_link_to_user_profile` (分享链接看用户) | `user_id` |
| `search_user_then_profile` (搜用户看主页) | `user_id` | `user_profile_then_posts` (用户资料加视频) | `user_id` |
| `search_video_then_detail` (搜视频看详情) | `keyword` | 🔀 `search_user_then_profile` (搜用户看主页) | `keyword` |
| `search_video_then_detail` (搜视频看详情) | `photo_id` | 🔀 `video_comments_then_replies` (评论展开回复) | `photo_id` |
| `search_video_then_detail` (搜视频看详情) | `keyword` | 🔀 `search_tag_then_feed` (搜话题看内容) | `keyword` |
| `search_video_then_detail` (搜视频看详情) | `photo_id` | `video_detail_then_author` (视频看作者主页) | `photo_id` |
| `search_video_then_detail` (搜视频看详情) | `photo_id` | `video_detail_then_share` (视频详情生分享) | `photo_id` |
| `selection_feed_then_detail` (推荐看视频详情) | `photo_id` | 🔀 `video_comments_then_replies` (评论展开回复) | `photo_id` |
| `selection_feed_then_detail` (推荐看视频详情) | `photo_id` | `search_video_then_detail` (搜视频看详情) | `photo_id` |
| `selection_feed_then_detail` (推荐看视频详情) | `photo_id` | `video_detail_then_author` (视频看作者主页) | `photo_id` |
| `selection_feed_then_detail` (推荐看视频详情) | `photo_id` | `video_detail_then_share` (视频详情生分享) | `photo_id` |
| `selection_feed_then_detail` (推荐看视频详情) | `photo_id` | `hot_list_then_detail` (热榜看视频详情) | `photo_id` |
| `share_link_to_user_profile` (分享链接看用户) | `user_id` | 🔀 `video_detail_then_author` (视频看作者主页) | `user_id` |
| `share_link_to_user_profile` (分享链接看用户) | `user_id` | `search_user_then_profile` (搜用户看主页) | `user_id` |
| `share_link_to_user_profile` (分享链接看用户) | `user_id` | `user_profile_then_posts` (用户资料加视频) | `user_id` |
| `share_link_to_user_profile` (分享链接看用户) | `user_id` | `user_profile_then_hot_posts` (用户资料加热门) | `user_id` |
| `share_link_to_user_profile` (分享链接看用户) | `user_id` | `user_profile_then_live` (用户资料加直播) | `user_id` |
| `user_profile_then_hot_posts` (用户资料加热门) | `user_id` | 🔀 `video_detail_then_author` (视频看作者主页) | `user_id` |
| `user_profile_then_hot_posts` (用户资料加热门) | `user_id` | `search_user_then_profile` (搜用户看主页) | `user_id` |
| `user_profile_then_hot_posts` (用户资料加热门) | `user_id` | `share_link_to_user_profile` (分享链接看用户) | `user_id` |
| `user_profile_then_hot_posts` (用户资料加热门) | `user_id` | `user_profile_then_posts` (用户资料加视频) | `user_id` |
| `user_profile_then_hot_posts` (用户资料加热门) | `user_id` | `user_profile_then_live` (用户资料加直播) | `user_id` |
| `user_profile_then_live` (用户资料加直播) | `user_id` | 🔀 `video_detail_then_author` (视频看作者主页) | `user_id` |
| `user_profile_then_live` (用户资料加直播) | `user_id` | `search_user_then_profile` (搜用户看主页) | `user_id` |
| `user_profile_then_live` (用户资料加直播) | `user_id` | `share_link_to_user_profile` (分享链接看用户) | `user_id` |
| `user_profile_then_live` (用户资料加直播) | `user_id` | `user_profile_then_posts` (用户资料加视频) | `user_id` |
| `user_profile_then_live` (用户资料加直播) | `user_id` | `user_profile_then_hot_posts` (用户资料加热门) | `user_id` |
| `user_profile_then_posts` (用户资料加视频) | `user_id` | 🔀 `video_detail_then_author` (视频看作者主页) | `user_id` |
| `user_profile_then_posts` (用户资料加视频) | `user_id` | `search_user_then_profile` (搜用户看主页) | `user_id` |
| `user_profile_then_posts` (用户资料加视频) | `user_id` | `share_link_to_user_profile` (分享链接看用户) | `user_id` |
| `user_profile_then_posts` (用户资料加视频) | `user_id` | `user_profile_then_hot_posts` (用户资料加热门) | `user_id` |
| `user_profile_then_posts` (用户资料加视频) | `user_id` | `user_profile_then_live` (用户资料加直播) | `user_id` |
| `video_comments_then_replies` (评论展开回复) | `photo_id` | 🔀 `search_video_then_detail` (搜视频看详情) | `photo_id` |
| `video_comments_then_replies` (评论展开回复) | `photo_id` | 🔀 `video_detail_then_author` (视频看作者主页) | `photo_id` |
| `video_comments_then_replies` (评论展开回复) | `photo_id` | 🔀 `video_detail_then_share` (视频详情生分享) | `photo_id` |
| `video_comments_then_replies` (评论展开回复) | `photo_id` | 🔀 `hot_list_then_detail` (热榜看视频详情) | `photo_id` |
| `video_comments_then_replies` (评论展开回复) | `photo_id` | 🔀 `video_detail_then_comments` (视频详情看评论) | `photo_id` |
| `video_detail_then_author` (视频看作者主页) | `user_id` | 🔀 `search_user_then_profile` (搜用户看主页) | `user_id` |
| `video_detail_then_author` (视频看作者主页) | `user_id` | 🔀 `share_link_to_user_profile` (分享链接看用户) | `user_id` |
| `video_detail_then_author` (视频看作者主页) | `photo_id` | 🔀 `video_comments_then_replies` (评论展开回复) | `photo_id` |
| `video_detail_then_author` (视频看作者主页) | `user_id` | 🔀 `user_profile_then_posts` (用户资料加视频) | `user_id` |
| `video_detail_then_author` (视频看作者主页) | `user_id` | 🔀 `user_profile_then_hot_posts` (用户资料加热门) | `user_id` |
| `video_detail_then_comments` (视频详情看评论) | `photo_id` | 🔀 `video_comments_then_replies` (评论展开回复) | `photo_id` |
| `video_detail_then_comments` (视频详情看评论) | `photo_id` | `search_video_then_detail` (搜视频看详情) | `photo_id` |
| `video_detail_then_comments` (视频详情看评论) | `photo_id` | `video_detail_then_author` (视频看作者主页) | `photo_id` |
| `video_detail_then_comments` (视频详情看评论) | `photo_id` | `video_detail_then_share` (视频详情生分享) | `photo_id` |
| `video_detail_then_comments` (视频详情看评论) | `photo_id` | `hot_list_then_detail` (热榜看视频详情) | `photo_id` |
| `video_detail_then_share` (视频详情生分享) | `photo_id` | 🔀 `video_comments_then_replies` (评论展开回复) | `photo_id` |
| `video_detail_then_share` (视频详情生分享) | `photo_id` | `search_video_then_detail` (搜视频看详情) | `photo_id` |
| `video_detail_then_share` (视频详情生分享) | `photo_id` | `video_detail_then_author` (视频看作者主页) | `photo_id` |
| `video_detail_then_share` (视频详情生分享) | `photo_id` | `hot_list_then_detail` (热榜看视频详情) | `photo_id` |
| `video_detail_then_share` (视频详情生分享) | `photo_id` | `video_detail_then_comments` (视频详情看评论) | `photo_id` |

> 🔀 = 跨文件链路 (cross-domain chain)；优先选 🔀 标记的下游 recipe，因为它能扩展 agent 已有的数据视图。

**典型 3 步用法**：
1. 用户语义 → 在 `_index.md` trigger_keywords 列匹配第 1 个 recipe
2. 执行第 1 个 recipe，得到 Output 字段
3. 在本表查 "已完成 Recipe" 列 → 选合适的下游 → 用 "接力字段" 直接传参，无需问用户重复输入

