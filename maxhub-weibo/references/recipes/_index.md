# Recipe Index / 编排索引


> 🎯 **Trigger 匹配规则（agent 必读）**：
> 1. **最长匹配优先**：用户输入同时命中多个 recipe 时，选 trigger 短语**最长**（最具体）的那个
> 2. **平局询问**：trigger 长度相同时，反问用户消歧后再调用
> 3. **跨域链路**：用户目标跨多个 recipe（如"先搜索再看评论"）→ 串行调用多个 recipe，**不要**自行拆解 atom


## Recipe 分类索引

| recipe_id | display_name | trigger_keywords | steps | est_calls | file |
|-----------|-------------|-----------------|-------|-----------|------|
| search_weibo_then_detail | 搜微博看详情 | "搜微博" "找微博" | 2 | 2 | recipes/post.md |
| search_user_then_profile | 搜用户看主页 | "搜用户" "找博主" | 2 | 2 | recipes/user.md |
| search_user_then_posts | 搜用户看微博 | "搜用户微博" | 2 | 2 | recipes/user.md |
| weibo_detail_then_comments | 微博详情看评论 | "微博评论" "看评论" | 2 | 2 | recipes/comments.md |
| weibo_detail_then_reposts | 微博详情看转发 | "微博转发" "看转发" | 2 | 2 | recipes/post.md |
| weibo_detail_then_likes | 微博详情看点赞 | "微博点赞" "看点赞" | 2 | 2 | recipes/post.md |
| comments_then_replies | 评论展开回复 | "看回复" "评论回复" | 2 | 2 | recipes/comments.md |
| video_detail_then_comments | 视频微博看评论 | "视频微博看评论" | 2 | 2 | recipes/comments.md |
| weibo_detail_then_author | 微博看作者主页 | "微博看作者主页" | 2 | 2 | recipes/user.md |
| user_profile_then_timeline | 用户资料加微博 | "用户微博" "主页微博" | 2 | 2 | recipes/user.md |
| username_to_profile | 用户名查主页 | "用户名查用户" | 2 | 2 | recipes/user.md |
| hot_search_then_search | 热搜词搜微博 | "热门搜索" | 2 | 2 | recipes/search.md |
| hot_ranking_then_detail | 热门榜单看详情 | "热门榜单" "微博榜单" | 2 | 2 | recipes/post.md |
| channel_config_then_trend | 频道看热门 | "频道热门" "频道内容" | 2 | 2 | recipes/post.md |
| recommend_feed_then_detail | 推荐看微博详情 | "首页推荐" | 2 | 2 | recipes/post.md |
| advanced_search_then_detail | 高级搜看详情 | "高级搜索" "筛选搜索" | 2 | 2 | recipes/search.md |
| user_video_collection | 用户视频收藏 | "视频收藏" "收藏夹" | 2 | 2 | recipes/user.md |


## 🔗 Recipe 串联图谱 (Chain Graph)

> 当 agent 完成一个 recipe 后，可按本表继续调用下游 recipe，形成跨域链路。
> 自动从 recipe 的 Output 字段与下游 Input 字段计算得出，每个源 recipe 取 top-5 最相关下游。
> 用户目标跨多个 recipe（如「搜某 UP 主 → 看其投稿 → 看视频评论」）时按本图**依序调用**，不要自行拆 atom。

| 已完成 Recipe | 输出字段 | 可继续 Recipe (按相关性排序) | 接力字段 |
|--------------|---------|----------------------------|---------|
| `advanced_search_then_detail` (高级搜看详情) | `id` | 🔀 `comments_then_replies` (评论展开回复) | `id` |
| `advanced_search_then_detail` (高级搜看详情) | `id` | 🔀 `hot_ranking_then_detail` (热门榜单看详情) | `id` |
| `comments_then_replies` (评论展开回复) | `id` | 🔀 `advanced_search_then_detail` (高级搜看详情) | `id` |
| `comments_then_replies` (评论展开回复) | `id` | 🔀 `hot_ranking_then_detail` (热门榜单看详情) | `id` |
| `hot_ranking_then_detail` (热门榜单看详情) | `id` | 🔀 `comments_then_replies` (评论展开回复) | `id` |
| `hot_ranking_then_detail` (热门榜单看详情) | `id` | 🔀 `advanced_search_then_detail` (高级搜看详情) | `id` |
| `hot_search_then_search` (热搜词搜微博) | `keyword` | 🔀 `search_user_then_profile` (搜用户看主页) | `keyword` |
| `hot_search_then_search` (热搜词搜微博) | `keyword` | 🔀 `search_user_then_posts` (搜用户看微博) | `keyword` |
| `hot_search_then_search` (热搜词搜微博) | `keyword` | 🔀 `search_weibo_then_detail` (搜微博看详情) | `keyword` |
| `recommend_feed_then_detail` (推荐看微博详情) | `status_id` | 🔀 `weibo_detail_then_comments` (微博详情看评论) | `status_id` |
| `recommend_feed_then_detail` (推荐看微博详情) | `status_id` | `search_weibo_then_detail` (搜微博看详情) | `status_id` |
| `recommend_feed_then_detail` (推荐看微博详情) | `status_id` | `video_detail_then_comments` (视频微博看评论) | `status_id` |
| `recommend_feed_then_detail` (推荐看微博详情) | `status_id` | `weibo_detail_then_author` (微博看作者主页) | `status_id` |
| `recommend_feed_then_detail` (推荐看微博详情) | `status_id` | `weibo_detail_then_reposts` (微博详情看转发) | `status_id` |
| `search_user_then_posts` (搜用户看微博) | `uid` | 🔀 `weibo_detail_then_author` (微博看作者主页) | `uid` |
| `search_user_then_posts` (搜用户看微博) | `uid` | `username_to_profile` (用户名查主页) | `uid` |
| `search_user_then_posts` (搜用户看微博) | `uid` | `user_video_collection` (用户视频收藏) | `uid` |
| `search_user_then_posts` (搜用户看微博) | `uid` | `search_user_then_profile` (搜用户看主页) | `uid` |
| `search_user_then_posts` (搜用户看微博) | `uid` | `user_profile_then_timeline` (用户资料加微博) | `uid` |
| `search_user_then_profile` (搜用户看主页) | `uid` | 🔀 `weibo_detail_then_author` (微博看作者主页) | `uid` |
| `search_user_then_profile` (搜用户看主页) | `uid` | `username_to_profile` (用户名查主页) | `uid` |
| `search_user_then_profile` (搜用户看主页) | `uid` | `user_video_collection` (用户视频收藏) | `uid` |
| `search_user_then_profile` (搜用户看主页) | `uid` | `search_user_then_posts` (搜用户看微博) | `uid` |
| `search_user_then_profile` (搜用户看主页) | `uid` | `user_profile_then_timeline` (用户资料加微博) | `uid` |
| `search_weibo_then_detail` (搜微博看详情) | `status_id` | 🔀 `weibo_detail_then_comments` (微博详情看评论) | `status_id` |
| `search_weibo_then_detail` (搜微博看详情) | `status_id` | `video_detail_then_comments` (视频微博看评论) | `status_id` |
| `search_weibo_then_detail` (搜微博看详情) | `status_id` | `weibo_detail_then_author` (微博看作者主页) | `status_id` |
| `search_weibo_then_detail` (搜微博看详情) | `status_id` | `weibo_detail_then_reposts` (微博详情看转发) | `status_id` |
| `search_weibo_then_detail` (搜微博看详情) | `status_id` | `weibo_detail_then_likes` (微博详情看点赞) | `status_id` |
| `user_profile_then_timeline` (用户资料加微博) | `uid` | 🔀 `weibo_detail_then_author` (微博看作者主页) | `uid` |
| `user_profile_then_timeline` (用户资料加微博) | `uid` | `search_user_then_profile` (搜用户看主页) | `uid` |
| `user_profile_then_timeline` (用户资料加微博) | `uid` | `search_user_then_posts` (搜用户看微博) | `uid` |
| `user_profile_then_timeline` (用户资料加微博) | `uid` | `username_to_profile` (用户名查主页) | `uid` |
| `user_profile_then_timeline` (用户资料加微博) | `uid` | `user_video_collection` (用户视频收藏) | `uid` |
| `user_video_collection` (用户视频收藏) | `id` | 🔀 `comments_then_replies` (评论展开回复) | `id` |
| `user_video_collection` (用户视频收藏) | `id` | 🔀 `advanced_search_then_detail` (高级搜看详情) | `id` |
| `user_video_collection` (用户视频收藏) | `uid` | 🔀 `weibo_detail_then_author` (微博看作者主页) | `uid` |
| `user_video_collection` (用户视频收藏) | `id` | 🔀 `hot_ranking_then_detail` (热门榜单看详情) | `id` |
| `user_video_collection` (用户视频收藏) | `uid` | `search_user_then_profile` (搜用户看主页) | `uid` |
| `username_to_profile` (用户名查主页) | `uid` | 🔀 `weibo_detail_then_author` (微博看作者主页) | `uid` |
| `username_to_profile` (用户名查主页) | `uid` | `search_user_then_profile` (搜用户看主页) | `uid` |
| `username_to_profile` (用户名查主页) | `uid` | `search_user_then_posts` (搜用户看微博) | `uid` |
| `username_to_profile` (用户名查主页) | `uid` | `user_video_collection` (用户视频收藏) | `uid` |
| `username_to_profile` (用户名查主页) | `uid` | `user_profile_then_timeline` (用户资料加微博) | `uid` |
| `video_detail_then_comments` (视频微博看评论) | `status_id` | 🔀 `weibo_detail_then_comments` (微博详情看评论) | `status_id` |
| `video_detail_then_comments` (视频微博看评论) | `status_id` | `search_weibo_then_detail` (搜微博看详情) | `status_id` |
| `video_detail_then_comments` (视频微博看评论) | `status_id` | `weibo_detail_then_author` (微博看作者主页) | `status_id` |
| `video_detail_then_comments` (视频微博看评论) | `status_id` | `weibo_detail_then_reposts` (微博详情看转发) | `status_id` |
| `video_detail_then_comments` (视频微博看评论) | `status_id` | `weibo_detail_then_likes` (微博详情看点赞) | `status_id` |
| `weibo_detail_then_author` (微博看作者主页) | `uid` | 🔀 `search_user_then_profile` (搜用户看主页) | `uid` |
| `weibo_detail_then_author` (微博看作者主页) | `uid` | 🔀 `search_user_then_posts` (搜用户看微博) | `uid` |
| `weibo_detail_then_author` (微博看作者主页) | `uid` | 🔀 `username_to_profile` (用户名查主页) | `uid` |
| `weibo_detail_then_author` (微博看作者主页) | `uid` | 🔀 `user_video_collection` (用户视频收藏) | `uid` |
| `weibo_detail_then_author` (微博看作者主页) | `id` | 🔀 `comments_then_replies` (评论展开回复) | `id` |
| `weibo_detail_then_comments` (微博详情看评论) | `status_id` | 🔀 `search_weibo_then_detail` (搜微博看详情) | `status_id` |
| `weibo_detail_then_comments` (微博详情看评论) | `status_id` | 🔀 `video_detail_then_comments` (视频微博看评论) | `status_id` |
| `weibo_detail_then_comments` (微博详情看评论) | `status_id` | 🔀 `weibo_detail_then_author` (微博看作者主页) | `status_id` |
| `weibo_detail_then_comments` (微博详情看评论) | `status_id` | 🔀 `weibo_detail_then_reposts` (微博详情看转发) | `status_id` |
| `weibo_detail_then_comments` (微博详情看评论) | `status_id` | 🔀 `weibo_detail_then_likes` (微博详情看点赞) | `status_id` |
| `weibo_detail_then_likes` (微博详情看点赞) | `status_id` | 🔀 `weibo_detail_then_comments` (微博详情看评论) | `status_id` |
| `weibo_detail_then_likes` (微博详情看点赞) | `status_id` | `search_weibo_then_detail` (搜微博看详情) | `status_id` |
| `weibo_detail_then_likes` (微博详情看点赞) | `status_id` | `video_detail_then_comments` (视频微博看评论) | `status_id` |
| `weibo_detail_then_likes` (微博详情看点赞) | `status_id` | `weibo_detail_then_author` (微博看作者主页) | `status_id` |
| `weibo_detail_then_likes` (微博详情看点赞) | `status_id` | `weibo_detail_then_reposts` (微博详情看转发) | `status_id` |
| `weibo_detail_then_reposts` (微博详情看转发) | `status_id` | 🔀 `weibo_detail_then_comments` (微博详情看评论) | `status_id` |
| `weibo_detail_then_reposts` (微博详情看转发) | `status_id` | `search_weibo_then_detail` (搜微博看详情) | `status_id` |
| `weibo_detail_then_reposts` (微博详情看转发) | `status_id` | `video_detail_then_comments` (视频微博看评论) | `status_id` |
| `weibo_detail_then_reposts` (微博详情看转发) | `status_id` | `weibo_detail_then_author` (微博看作者主页) | `status_id` |
| `weibo_detail_then_reposts` (微博详情看转发) | `status_id` | `weibo_detail_then_likes` (微博详情看点赞) | `status_id` |

> 🔀 = 跨文件链路 (cross-domain chain)；优先选 🔀 标记的下游 recipe，因为它能扩展 agent 已有的数据视图。

**典型 3 步用法**：
1. 用户语义 → 在 `_index.md` trigger_keywords 列匹配第 1 个 recipe
2. 执行第 1 个 recipe，得到 Output 字段
3. 在本表查 "已完成 Recipe" 列 → 选合适的下游 → 用 "接力字段" 直接传参，无需问用户重复输入

