# Recipe Index / 编排索引


> 🎯 **Trigger 匹配规则（agent 必读）**：
> 1. **最长匹配优先**：用户输入同时命中多个 recipe 时，选 trigger 短语**最长**（最具体）的那个
> 2. **平局询问**：trigger 长度相同时，反问用户消歧后再调用
> 3. **跨域链路**：用户目标跨多个 recipe（如"先搜索再看评论"）→ 串行调用多个 recipe，**不要**自行拆解 atom


## Recipe 分类索引

| recipe_id | display_name | trigger_keywords | steps | est_calls | file |
|-----------|-------------|-----------------|-------|-----------|------|
| post_with_comments | 帖子详情+评论 | "帖子评论" "看看评论" | 2 | 2 | recipes/content.md |
| post_comments_with_replies | 评论+回复 | "评论回复" "展开回复" | 2 | 2 | recipes/content.md |
| explore_to_topic_feed | 发现页→分类Feed | "发现" "浏览分类" "社区分类" | 2 | 2 | recipes/content.md |
| feed_to_post_detail | Feed→帖子详情 | "首页帖子" "热门帖子" | 2 | 2 | recipes/content.md |
| search_post_to_detail | 搜索帖子→详情 | "搜索帖子" "找帖子" | 2 | 2 | recipes/search.md |
| search_user_to_profile | 搜索用户→资料 | "搜索用户" "找人" | 2 | 2 | recipes/search.md |
| trending_to_search | 热门趋势→搜索 | "热门趋势" | 2 | 2 | recipes/search.md |
| subreddit_info_with_settings | 版块信息+设置 | "版块设置" "版块详情" | 2 | 2 | recipes/subreddit.md |
| subreddit_info_with_highlights | 版块信息+亮点 | "版块亮点" "精选" | 2 | 2 | recipes/subreddit.md |
| subreddit_feed_to_post | 版块Feed→帖子 | "版块帖子" | 2 | 2 | recipes/subreddit.md |
| user_profile_with_posts | 用户资料+帖子 | "用户帖子" "看看ta的帖子" | 2 | 2 | recipes/user.md |
| user_profile_with_comments | 用户资料+评论 | "用户评论" "ta的评论" | 2 | 2 | recipes/user.md |


## 🔗 Recipe 串联图谱 (Chain Graph)

> 当 agent 完成一个 recipe 后，可按本表继续调用下游 recipe，形成跨域链路。
> 自动从 recipe 的 Output 字段与下游 Input 字段计算得出，每个源 recipe 取 top-5 最相关下游。
> 用户目标跨多个 recipe（如「搜某 UP 主 → 看其投稿 → 看视频评论」）时按本图**依序调用**，不要自行拆 atom。

| 已完成 Recipe | 输出字段 | 可继续 Recipe (按相关性排序) | 接力字段 |
|--------------|---------|----------------------------|---------|
| `explore_to_topic_feed` (发现页→分类Feed) | `id` | 🔀 `search_post_to_detail` (搜索帖子→详情) | `id` |
| `explore_to_topic_feed` (发现页→分类Feed) | `id` | 🔀 `subreddit_info_with_settings` (版块信息+设置) | `id` |
| `explore_to_topic_feed` (发现页→分类Feed) | `id` | 🔀 `subreddit_info_with_highlights` (版块信息+亮点) | `id` |
| `explore_to_topic_feed` (发现页→分类Feed) | `id` | 🔀 `subreddit_feed_to_post` (版块Feed→帖子) | `id` |
| `explore_to_topic_feed` (发现页→分类Feed) | `id` | `feed_to_post_detail` (Feed→帖子详情) | `id` |
| `feed_to_post_detail` (Feed→帖子详情) | `id`, `pid` | 🔀 `search_post_to_detail` (搜索帖子→详情) | `id`, `pid` |
| `feed_to_post_detail` (Feed→帖子详情) | `id`, `pid` | 🔀 `subreddit_feed_to_post` (版块Feed→帖子) | `id`, `pid` |
| `feed_to_post_detail` (Feed→帖子详情) | `id` | 🔀 `subreddit_info_with_settings` (版块信息+设置) | `id` |
| `feed_to_post_detail` (Feed→帖子详情) | `id` | 🔀 `subreddit_info_with_highlights` (版块信息+亮点) | `id` |
| `feed_to_post_detail` (Feed→帖子详情) | `pid`, `post_id` | `post_with_comments` (帖子详情+评论) | `pid`, `post_id` |
| `post_comments_with_replies` (评论+回复) | `post_id` | `post_with_comments` (帖子详情+评论) | `post_id` |
| `post_with_comments` (帖子详情+评论) | `pid` | 🔀 `search_post_to_detail` (搜索帖子→详情) | `pid` |
| `post_with_comments` (帖子详情+评论) | `pid` | 🔀 `subreddit_feed_to_post` (版块Feed→帖子) | `pid` |
| `post_with_comments` (帖子详情+评论) | `post_id` | `post_comments_with_replies` (评论+回复) | `post_id` |
| `post_with_comments` (帖子详情+评论) | `pid` | `feed_to_post_detail` (Feed→帖子详情) | `pid` |
| `search_post_to_detail` (搜索帖子→详情) | `pid`, `post_id` | 🔀 `post_with_comments` (帖子详情+评论) | `pid`, `post_id` |
| `search_post_to_detail` (搜索帖子→详情) | `id`, `pid` | 🔀 `subreddit_feed_to_post` (版块Feed→帖子) | `id`, `pid` |
| `search_post_to_detail` (搜索帖子→详情) | `id`, `pid` | 🔀 `feed_to_post_detail` (Feed→帖子详情) | `id`, `pid` |
| `search_post_to_detail` (搜索帖子→详情) | `post_id` | 🔀 `post_comments_with_replies` (评论+回复) | `post_id` |
| `search_post_to_detail` (搜索帖子→详情) | `id` | 🔀 `explore_to_topic_feed` (发现页→分类Feed) | `id` |
| `search_user_to_profile` (搜索用户→资料) | `username` | 🔀 `user_profile_with_posts` (用户资料+帖子) | `username` |
| `search_user_to_profile` (搜索用户→资料) | `username` | 🔀 `user_profile_with_comments` (用户资料+评论) | `username` |
| `search_user_to_profile` (搜索用户→资料) | `query` | `search_post_to_detail` (搜索帖子→详情) | `query` |
| `search_user_to_profile` (搜索用户→资料) | `query` | `trending_to_search` (热门趋势→搜索) | `query` |
| `subreddit_feed_to_post` (版块Feed→帖子) | `pid`, `post_id` | 🔀 `post_with_comments` (帖子详情+评论) | `pid`, `post_id` |
| `subreddit_feed_to_post` (版块Feed→帖子) | `id`, `pid` | 🔀 `search_post_to_detail` (搜索帖子→详情) | `id`, `pid` |
| `subreddit_feed_to_post` (版块Feed→帖子) | `id`, `pid` | 🔀 `feed_to_post_detail` (Feed→帖子详情) | `id`, `pid` |
| `subreddit_feed_to_post` (版块Feed→帖子) | `post_id` | 🔀 `post_comments_with_replies` (评论+回复) | `post_id` |
| `subreddit_feed_to_post` (版块Feed→帖子) | `id` | 🔀 `explore_to_topic_feed` (发现页→分类Feed) | `id` |
| `subreddit_info_with_highlights` (版块信息+亮点) | `id` | 🔀 `explore_to_topic_feed` (发现页→分类Feed) | `id` |
| `subreddit_info_with_highlights` (版块信息+亮点) | `id` | 🔀 `feed_to_post_detail` (Feed→帖子详情) | `id` |
| `subreddit_info_with_highlights` (版块信息+亮点) | `id` | 🔀 `search_post_to_detail` (搜索帖子→详情) | `id` |
| `subreddit_info_with_highlights` (版块信息+亮点) | `id`, `sid`, `subreddit_name` | `subreddit_info_with_settings` (版块信息+设置) | `id`, `sid`, `subreddit_name` |
| `subreddit_info_with_highlights` (版块信息+亮点) | `id`, `subreddit_name` | `subreddit_feed_to_post` (版块Feed→帖子) | `id`, `subreddit_name` |
| `subreddit_info_with_settings` (版块信息+设置) | `id` | 🔀 `explore_to_topic_feed` (发现页→分类Feed) | `id` |
| `subreddit_info_with_settings` (版块信息+设置) | `id` | 🔀 `feed_to_post_detail` (Feed→帖子详情) | `id` |
| `subreddit_info_with_settings` (版块信息+设置) | `id` | 🔀 `search_post_to_detail` (搜索帖子→详情) | `id` |
| `subreddit_info_with_settings` (版块信息+设置) | `id`, `sid`, `subreddit_name` | `subreddit_info_with_highlights` (版块信息+亮点) | `id`, `sid`, `subreddit_name` |
| `subreddit_info_with_settings` (版块信息+设置) | `id`, `subreddit_name` | `subreddit_feed_to_post` (版块Feed→帖子) | `id`, `subreddit_name` |
| `trending_to_search` (热门趋势→搜索) | `query` | `search_post_to_detail` (搜索帖子→详情) | `query` |
| `trending_to_search` (热门趋势→搜索) | `query` | `search_user_to_profile` (搜索用户→资料) | `query` |
| `user_profile_with_comments` (用户资料+评论) | `username` | `user_profile_with_posts` (用户资料+帖子) | `username` |
| `user_profile_with_posts` (用户资料+帖子) | `username` | `user_profile_with_comments` (用户资料+评论) | `username` |

> 🔀 = 跨文件链路 (cross-domain chain)；优先选 🔀 标记的下游 recipe，因为它能扩展 agent 已有的数据视图。

**典型 3 步用法**：
1. 用户语义 → 在 `_index.md` trigger_keywords 列匹配第 1 个 recipe
2. 执行第 1 个 recipe，得到 Output 字段
3. 在本表查 "已完成 Recipe" 列 → 选合适的下游 → 用 "接力字段" 直接传参，无需问用户重复输入

