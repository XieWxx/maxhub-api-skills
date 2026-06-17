# Recipe Index / 编排索引


> 🎯 **Trigger 匹配规则（agent 必读）**：
> 1. **最长匹配优先**：用户输入同时命中多个 recipe 时，选 trigger 短语**最长**（最具体）的那个
> 2. **平局询问**：trigger 长度相同时，反问用户消歧后再调用
> 3. **跨域链路**：用户目标跨多个 recipe（如"先搜索再看评论"）→ 串行调用多个 recipe，**不要**自行拆解 atom


## Recipe 分类索引

| recipe_id | display_name | trigger_keywords | steps | est_calls | file |
|-----------|-------------|-----------------|-------|-----------|------|
| column_articles_to_detail | 专栏文章→详情 | "专栏文章" "看看专栏" | 2 | 2 | recipes/post.md |
| article_detail_with_relationship | 文章详情+互动 | "文章互动" "点赞评论" "互动数据" | 2 | 2 | recipes/post.md |
| question_answers_with_comments | 问题回答+评论 | "问题评论" "回答评论" | 2 | 2 | recipes/post.md |
| hot_list_to_answers | 热榜→回答 | "知乎热榜" "热门问题" | 2 | 2 | recipes/post.md |
| user_info_with_articles | 用户信息+文章 | "用户文章" "知乎用户" | 2 | 2 | recipes/user.md |
| user_info_with_social | 用户信息+社交圈 | "用户关注" "用户粉丝" "社交圈" | 3 | 3 | recipes/user.md |
| search_articles_to_detail | 搜索文章→详情 | "搜索文章" "知乎搜索" | 2 | 2 | recipes/search.md |
| search_user_to_profile | 搜索用户→资料 | "搜索用户" "找人" | 2 | 2 | recipes/search.md |
| ai_search_full | AI搜索完整流程 | "AI搜索" "智能搜索" | 2 | 2 | recipes/search.md |


## 🔗 Recipe 串联图谱 (Chain Graph)

> 当 agent 完成一个 recipe 后，可按本表继续调用下游 recipe，形成跨域链路。
> 自动从 recipe 的 Output 字段与下游 Input 字段计算得出，每个源 recipe 取 top-5 最相关下游。
> 用户目标跨多个 recipe（如「搜某 UP 主 → 看其投稿 → 看视频评论」）时按本图**依序调用**，不要自行拆 atom。

| 已完成 Recipe | 输出字段 | 可继续 Recipe (按相关性排序) | 接力字段 |
|--------------|---------|----------------------------|---------|
| `article_detail_with_relationship` (文章详情+互动) | `aid`, `id` | 🔀 `search_articles_to_detail` (搜索文章→详情) | `aid`, `id` |
| `article_detail_with_relationship` (文章详情+互动) | `aid`, `id` | `column_articles_to_detail` (专栏文章→详情) | `aid`, `id` |
| `article_detail_with_relationship` (文章详情+互动) | `id` | `question_answers_with_comments` (问题回答+评论) | `id` |
| `article_detail_with_relationship` (文章详情+互动) | `id` | `hot_list_to_answers` (热榜→回答) | `id` |
| `column_articles_to_detail` (专栏文章→详情) | `aid`, `id` | 🔀 `search_articles_to_detail` (搜索文章→详情) | `aid`, `id` |
| `column_articles_to_detail` (专栏文章→详情) | `aid`, `article_id`, `id` | `article_detail_with_relationship` (文章详情+互动) | `aid`, `article_id`, `id` |
| `column_articles_to_detail` (专栏文章→详情) | `id` | `question_answers_with_comments` (问题回答+评论) | `id` |
| `column_articles_to_detail` (专栏文章→详情) | `id` | `hot_list_to_answers` (热榜→回答) | `id` |
| `hot_list_to_answers` (热榜→回答) | `id` | 🔀 `search_articles_to_detail` (搜索文章→详情) | `id` |
| `hot_list_to_answers` (热榜→回答) | `id`, `question_id` | `question_answers_with_comments` (问题回答+评论) | `id`, `question_id` |
| `hot_list_to_answers` (热榜→回答) | `id` | `column_articles_to_detail` (专栏文章→详情) | `id` |
| `hot_list_to_answers` (热榜→回答) | `id` | `article_detail_with_relationship` (文章详情+互动) | `id` |
| `question_answers_with_comments` (问题回答+评论) | `id` | 🔀 `search_articles_to_detail` (搜索文章→详情) | `id` |
| `question_answers_with_comments` (问题回答+评论) | `id` | `column_articles_to_detail` (专栏文章→详情) | `id` |
| `question_answers_with_comments` (问题回答+评论) | `id` | `article_detail_with_relationship` (文章详情+互动) | `id` |
| `question_answers_with_comments` (问题回答+评论) | `id` | `hot_list_to_answers` (热榜→回答) | `id` |
| `search_articles_to_detail` (搜索文章→详情) | `aid`, `article_id`, `id` | 🔀 `article_detail_with_relationship` (文章详情+互动) | `aid`, `article_id`, `id` |
| `search_articles_to_detail` (搜索文章→详情) | `aid`, `id` | 🔀 `column_articles_to_detail` (专栏文章→详情) | `aid`, `id` |
| `search_articles_to_detail` (搜索文章→详情) | `id` | 🔀 `question_answers_with_comments` (问题回答+评论) | `id` |
| `search_articles_to_detail` (搜索文章→详情) | `id` | 🔀 `hot_list_to_answers` (热榜→回答) | `id` |
| `search_articles_to_detail` (搜索文章→详情) | `keyword` | `search_user_to_profile` (搜索用户→资料) | `keyword` |
| `search_user_to_profile` (搜索用户→资料) | `url_token`, `user_url_token`, `utoken` | 🔀 `user_info_with_articles` (用户信息+文章) | `url_token`, `user_url_token`, `utoken` |
| `search_user_to_profile` (搜索用户→资料) | `url_token`, `user_url_token`, `utoken` | 🔀 `user_info_with_social` (用户信息+社交圈) | `url_token`, `user_url_token`, `utoken` |
| `search_user_to_profile` (搜索用户→资料) | `keyword` | `search_articles_to_detail` (搜索文章→详情) | `keyword` |
| `user_info_with_articles` (用户信息+文章) | `url_token`, `utoken` | 🔀 `search_user_to_profile` (搜索用户→资料) | `url_token`, `utoken` |
| `user_info_with_articles` (用户信息+文章) | `url_token`, `user_url_token`, `utoken` | `user_info_with_social` (用户信息+社交圈) | `url_token`, `user_url_token`, `utoken` |
| `user_info_with_social` (用户信息+社交圈) | `url_token`, `utoken` | 🔀 `search_user_to_profile` (搜索用户→资料) | `url_token`, `utoken` |
| `user_info_with_social` (用户信息+社交圈) | `url_token`, `user_url_token`, `utoken` | `user_info_with_articles` (用户信息+文章) | `url_token`, `user_url_token`, `utoken` |

> 🔀 = 跨文件链路 (cross-domain chain)；优先选 🔀 标记的下游 recipe，因为它能扩展 agent 已有的数据视图。

**典型 3 步用法**：
1. 用户语义 → 在 `_index.md` trigger_keywords 列匹配第 1 个 recipe
2. 执行第 1 个 recipe，得到 Output 字段
3. 在本表查 "已完成 Recipe" 列 → 选合适的下游 → 用 "接力字段" 直接传参，无需问用户重复输入

