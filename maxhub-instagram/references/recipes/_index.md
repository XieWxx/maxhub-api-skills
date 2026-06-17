# Recipe Index / 编排索引


> 🎯 **Trigger 匹配规则（agent 必读）**：
> 1. **最长匹配优先**：用户输入同时命中多个 recipe 时，选 trigger 短语**最长**（最具体）的那个
> 2. **平局询问**：trigger 长度相同时，反问用户消歧后再调用
> 3. **跨域链路**：用户目标跨多个 recipe（如"先搜索再看评论"）→ 串行调用多个 recipe，**不要**自行拆解 atom


## Recipe 分类索引

| recipe_id | display_name | trigger_keywords | steps | est_calls | file |
|-----------|-------------|-----------------|-------|-----------|------|
| url_to_post_detail | 链接看帖子详情 | "打开链接" "帖子链接" | 2 | 2 | recipes/post.md |
| shortcode_to_post_detail | 短码看帖子详情 | "短码查帖子" | 2 | 2 | recipes/post.md |
| post_detail_then_comments | 帖子详情看评论 | "帖子评论" "看评论" | 2 | 2 | recipes/post.md |
| post_detail_then_author | 帖子看作者主页 | "博主主页" | 2 | 2 | recipes/post.md |
| post_detail_then_likes | 帖子看点赞列表 | "点赞列表" "谁点赞" | 2 | 2 | recipes/post.md |
| reels_recommend_then_detail | 推荐Reels看详情 | "推荐Reels" "Reels推荐" | 2 | 2 | recipes/post.md |
| comments_then_translate | 评论翻译 | "翻译评论" "评论翻译" | 2 | 2 | recipes/post.md |
| search_user_then_profile | 搜用户看主页 | "搜用户" "找博主" | 2 | 2 | recipes/user.md |
| search_user_then_posts | 搜用户看帖子 | "搜用户帖子" | 2 | 2 | recipes/user.md |
| username_to_profile | 用户名查主页 | "用户名查用户" | 2 | 2 | recipes/user.md |
| user_profile_then_posts | 用户资料加帖子 | "用户帖子" "主页帖子" | 2 | 2 | recipes/user.md |
| user_profile_then_reels | 用户资料加Reels | "用户Reels" "主页Reels" | 2 | 2 | recipes/user.md |
| user_highlights_then_stories | 精选看故事 | "精选故事" "Highlights" | 2 | 2 | recipes/user.md |
| user_profile_then_followers | 用户资料加粉丝 | "粉丝列表" "关注粉丝" | 2 | 2 | recipes/user.md |
| explore_then_detail | 探索页看详情 | "探索" "发现" | 2 | 2 | recipes/search.md |
| search_hashtag_then_posts | 搜话题看帖子 | "话题帖子" "标签帖子" | 2 | 2 | recipes/search.md |
| search_location_then_posts | 搜地点看帖子 | "地点帖子" "位置帖子" | 2 | 2 | recipes/search.md |
| music_posts_browse | 音乐帖子浏览 | "音乐帖子" "同音乐帖子" | 2 | 2 | recipes/search.md |
| post_comments_then_replies | 评论展开回复 | "看回复" "评论回复" | 2 | 2 | recipes/comments.md |
| comments_bulk_translate | 批量翻译评论 | "批量翻译" "翻译所有评论" | 2 | 2 | recipes/comments.md |


## 🔗 Recipe 串联图谱 (Chain Graph)

> 当 agent 完成一个 recipe 后，可按本表继续调用下游 recipe，形成跨域链路。
> 自动从 recipe 的 Output 字段与下游 Input 字段计算得出，每个源 recipe 取 top-5 最相关下游。
> 用户目标跨多个 recipe（如「搜某 UP 主 → 看其投稿 → 看视频评论」）时按本图**依序调用**，不要自行拆 atom。

| 已完成 Recipe | 输出字段 | 可继续 Recipe (按相关性排序) | 接力字段 |
|--------------|---------|----------------------------|---------|
| `comments_bulk_translate` (批量翻译评论) | `code` | 🔀 `url_to_post_detail` (链接看帖子详情) | `code` |
| `comments_bulk_translate` (批量翻译评论) | `code` | 🔀 `post_detail_then_author` (帖子看作者主页) | `code` |
| `comments_bulk_translate` (批量翻译评论) | `code` | 🔀 `comments_then_translate` (评论翻译) | `code` |
| `comments_bulk_translate` (批量翻译评论) | `code` | 🔀 `post_detail_then_comments` (帖子详情看评论) | `code` |
| `comments_bulk_translate` (批量翻译评论) | `code` | 🔀 `reels_recommend_then_detail` (推荐Reels看详情) | `code` |
| `comments_then_translate` (评论翻译) | `code`, `comment_id` | 🔀 `post_comments_then_replies` (评论展开回复) | `code`, `comment_id` |
| `comments_then_translate` (评论翻译) | `code` | 🔀 `comments_bulk_translate` (批量翻译评论) | `code` |
| `comments_then_translate` (评论翻译) | `code` | `url_to_post_detail` (链接看帖子详情) | `code` |
| `comments_then_translate` (评论翻译) | `code` | `post_detail_then_author` (帖子看作者主页) | `code` |
| `comments_then_translate` (评论翻译) | `code` | `post_detail_then_comments` (帖子详情看评论) | `code` |
| `explore_then_detail` (探索页看详情) | `media_id` | 🔀 `post_comments_then_replies` (评论展开回复) | `media_id` |
| `explore_then_detail` (探索页看详情) | `media_id` | 🔀 `shortcode_to_post_detail` (短码看帖子详情) | `media_id` |
| `music_posts_browse` (音乐帖子浏览) | `keyword` | 🔀 `search_user_then_profile` (搜用户看主页) | `keyword` |
| `music_posts_browse` (音乐帖子浏览) | `keyword` | 🔀 `search_user_then_posts` (搜用户看帖子) | `keyword` |
| `music_posts_browse` (音乐帖子浏览) | `keyword` | `search_hashtag_then_posts` (搜话题看帖子) | `keyword` |
| `music_posts_browse` (音乐帖子浏览) | `keyword` | `search_location_then_posts` (搜地点看帖子) | `keyword` |
| `post_comments_then_replies` (评论展开回复) | `code`, `comment_id` | 🔀 `comments_then_translate` (评论翻译) | `code`, `comment_id` |
| `post_comments_then_replies` (评论展开回复) | `media_id` | 🔀 `explore_then_detail` (探索页看详情) | `media_id` |
| `post_comments_then_replies` (评论展开回复) | `code` | 🔀 `url_to_post_detail` (链接看帖子详情) | `code` |
| `post_comments_then_replies` (评论展开回复) | `media_id` | 🔀 `shortcode_to_post_detail` (短码看帖子详情) | `media_id` |
| `post_comments_then_replies` (评论展开回复) | `code` | 🔀 `post_detail_then_author` (帖子看作者主页) | `code` |
| `post_detail_then_author` (帖子看作者主页) | `user_id` | 🔀 `search_user_then_profile` (搜用户看主页) | `user_id` |
| `post_detail_then_author` (帖子看作者主页) | `user_id` | 🔀 `username_to_profile` (用户名查主页) | `user_id` |
| `post_detail_then_author` (帖子看作者主页) | `code` | 🔀 `post_comments_then_replies` (评论展开回复) | `code` |
| `post_detail_then_author` (帖子看作者主页) | `code` | 🔀 `comments_bulk_translate` (批量翻译评论) | `code` |
| `post_detail_then_author` (帖子看作者主页) | `code` | `url_to_post_detail` (链接看帖子详情) | `code` |
| `post_detail_then_comments` (帖子详情看评论) | `code` | 🔀 `post_comments_then_replies` (评论展开回复) | `code` |
| `post_detail_then_comments` (帖子详情看评论) | `code` | 🔀 `comments_bulk_translate` (批量翻译评论) | `code` |
| `post_detail_then_comments` (帖子详情看评论) | `code` | `url_to_post_detail` (链接看帖子详情) | `code` |
| `post_detail_then_comments` (帖子详情看评论) | `code` | `post_detail_then_author` (帖子看作者主页) | `code` |
| `post_detail_then_comments` (帖子详情看评论) | `code` | `comments_then_translate` (评论翻译) | `code` |
| `reels_recommend_then_detail` (推荐Reels看详情) | `code` | 🔀 `post_comments_then_replies` (评论展开回复) | `code` |
| `reels_recommend_then_detail` (推荐Reels看详情) | `code` | 🔀 `comments_bulk_translate` (批量翻译评论) | `code` |
| `reels_recommend_then_detail` (推荐Reels看详情) | `code` | `url_to_post_detail` (链接看帖子详情) | `code` |
| `reels_recommend_then_detail` (推荐Reels看详情) | `code` | `post_detail_then_author` (帖子看作者主页) | `code` |
| `reels_recommend_then_detail` (推荐Reels看详情) | `code` | `comments_then_translate` (评论翻译) | `code` |
| `search_hashtag_then_posts` (搜话题看帖子) | `keyword` | 🔀 `search_user_then_profile` (搜用户看主页) | `keyword` |
| `search_hashtag_then_posts` (搜话题看帖子) | `keyword` | 🔀 `search_user_then_posts` (搜用户看帖子) | `keyword` |
| `search_hashtag_then_posts` (搜话题看帖子) | `keyword` | `search_location_then_posts` (搜地点看帖子) | `keyword` |
| `search_hashtag_then_posts` (搜话题看帖子) | `keyword` | `music_posts_browse` (音乐帖子浏览) | `keyword` |
| `search_location_then_posts` (搜地点看帖子) | `keyword` | 🔀 `search_user_then_profile` (搜用户看主页) | `keyword` |
| `search_location_then_posts` (搜地点看帖子) | `keyword` | 🔀 `search_user_then_posts` (搜用户看帖子) | `keyword` |
| `search_location_then_posts` (搜地点看帖子) | `keyword` | `search_hashtag_then_posts` (搜话题看帖子) | `keyword` |
| `search_location_then_posts` (搜地点看帖子) | `keyword` | `music_posts_browse` (音乐帖子浏览) | `keyword` |
| `search_user_then_posts` (搜用户看帖子) | `username` | `username_to_profile` (用户名查主页) | `username` |
| `search_user_then_posts` (搜用户看帖子) | `username` | `user_highlights_then_stories` (精选看故事) | `username` |
| `search_user_then_posts` (搜用户看帖子) | `username` | `user_profile_then_posts` (用户资料加帖子) | `username` |
| `search_user_then_posts` (搜用户看帖子) | `username` | `user_profile_then_reels` (用户资料加Reels) | `username` |
| `search_user_then_posts` (搜用户看帖子) | `username` | `user_profile_then_followers` (用户资料加粉丝) | `username` |
| `search_user_then_profile` (搜用户看主页) | `user_id` | 🔀 `post_detail_then_author` (帖子看作者主页) | `user_id` |
| `search_user_then_profile` (搜用户看主页) | `user_id` | `username_to_profile` (用户名查主页) | `user_id` |
| `shortcode_to_post_detail` (短码看帖子详情) | `media_id` | 🔀 `post_comments_then_replies` (评论展开回复) | `media_id` |
| `shortcode_to_post_detail` (短码看帖子详情) | `media_id` | 🔀 `explore_then_detail` (探索页看详情) | `media_id` |
| `url_to_post_detail` (链接看帖子详情) | `code` | 🔀 `post_comments_then_replies` (评论展开回复) | `code` |
| `url_to_post_detail` (链接看帖子详情) | `code` | 🔀 `comments_bulk_translate` (批量翻译评论) | `code` |
| `url_to_post_detail` (链接看帖子详情) | `shortcode` | `shortcode_to_post_detail` (短码看帖子详情) | `shortcode` |
| `url_to_post_detail` (链接看帖子详情) | `code` | `post_detail_then_author` (帖子看作者主页) | `code` |
| `url_to_post_detail` (链接看帖子详情) | `code` | `comments_then_translate` (评论翻译) | `code` |
| `user_highlights_then_stories` (精选看故事) | `username` | `search_user_then_posts` (搜用户看帖子) | `username` |
| `user_highlights_then_stories` (精选看故事) | `username` | `username_to_profile` (用户名查主页) | `username` |
| `user_highlights_then_stories` (精选看故事) | `username` | `user_profile_then_posts` (用户资料加帖子) | `username` |
| `user_highlights_then_stories` (精选看故事) | `username` | `user_profile_then_reels` (用户资料加Reels) | `username` |
| `user_highlights_then_stories` (精选看故事) | `username` | `user_profile_then_followers` (用户资料加粉丝) | `username` |
| `user_profile_then_followers` (用户资料加粉丝) | `username` | `search_user_then_posts` (搜用户看帖子) | `username` |
| `user_profile_then_followers` (用户资料加粉丝) | `username` | `username_to_profile` (用户名查主页) | `username` |
| `user_profile_then_followers` (用户资料加粉丝) | `username` | `user_highlights_then_stories` (精选看故事) | `username` |
| `user_profile_then_followers` (用户资料加粉丝) | `username` | `user_profile_then_posts` (用户资料加帖子) | `username` |
| `user_profile_then_followers` (用户资料加粉丝) | `username` | `user_profile_then_reels` (用户资料加Reels) | `username` |
| `user_profile_then_posts` (用户资料加帖子) | `username` | `search_user_then_posts` (搜用户看帖子) | `username` |
| `user_profile_then_posts` (用户资料加帖子) | `username` | `username_to_profile` (用户名查主页) | `username` |
| `user_profile_then_posts` (用户资料加帖子) | `username` | `user_highlights_then_stories` (精选看故事) | `username` |
| `user_profile_then_posts` (用户资料加帖子) | `username` | `user_profile_then_reels` (用户资料加Reels) | `username` |
| `user_profile_then_posts` (用户资料加帖子) | `username` | `user_profile_then_followers` (用户资料加粉丝) | `username` |
| `user_profile_then_reels` (用户资料加Reels) | `username` | `search_user_then_posts` (搜用户看帖子) | `username` |
| `user_profile_then_reels` (用户资料加Reels) | `username` | `username_to_profile` (用户名查主页) | `username` |
| `user_profile_then_reels` (用户资料加Reels) | `username` | `user_highlights_then_stories` (精选看故事) | `username` |
| `user_profile_then_reels` (用户资料加Reels) | `username` | `user_profile_then_posts` (用户资料加帖子) | `username` |
| `user_profile_then_reels` (用户资料加Reels) | `username` | `user_profile_then_followers` (用户资料加粉丝) | `username` |
| `username_to_profile` (用户名查主页) | `user_id` | 🔀 `post_detail_then_author` (帖子看作者主页) | `user_id` |
| `username_to_profile` (用户名查主页) | `user_id` | `search_user_then_profile` (搜用户看主页) | `user_id` |
| `username_to_profile` (用户名查主页) | `username` | `search_user_then_posts` (搜用户看帖子) | `username` |
| `username_to_profile` (用户名查主页) | `username` | `user_highlights_then_stories` (精选看故事) | `username` |
| `username_to_profile` (用户名查主页) | `username` | `user_profile_then_posts` (用户资料加帖子) | `username` |

> 🔀 = 跨文件链路 (cross-domain chain)；优先选 🔀 标记的下游 recipe，因为它能扩展 agent 已有的数据视图。

**典型 3 步用法**：
1. 用户语义 → 在 `_index.md` trigger_keywords 列匹配第 1 个 recipe
2. 执行第 1 个 recipe，得到 Output 字段
3. 在本表查 "已完成 Recipe" 列 → 选合适的下游 → 用 "接力字段" 直接传参，无需问用户重复输入

