# Recipe Index / 编排索引


> 🎯 **Trigger 匹配规则（agent 必读）**：
> 1. **最长匹配优先**：用户输入同时命中多个 recipe 时，选 trigger 短语**最长**（最具体）的那个
> 2. **平局询问**：trigger 长度相同时，反问用户消歧后再调用
> 3. **跨域链路**：用户目标跨多个 recipe（如"先搜索再看评论"）→ 串行调用多个 recipe，**不要**自行拆解 atom


## Recipe 分类索引

| recipe_id | display_name | trigger_keywords | steps | est_calls | file |
|-----------|-------------|-----------------|-------|-----------|------|
| search_note_then_detail | 搜索笔记看详情 | "搜笔记" "找笔记" "笔记详情" | 2 | 2 | recipes/note.md |
| search_user_then_profile | 搜索用户看主页 | "搜用户" "找博主" "用户主页" | 2 | 2 | recipes/user.md |
| search_product_then_detail | 搜商品看详情 | "搜商品" "找商品" "商品详情" | 2 | 2 | recipes/product.md |
| note_detail_then_comments | 笔记详情加评论 | "笔记评论" "看评论" | 2 | 2 | recipes/note.md |
| note_comments_then_replies | 评论展开回复 | "看回复" "评论回复" | 2 | 2 | recipes/note.md |
| note_detail_then_author | 笔记看作者主页 | "笔记看作者主页" | 2 | 2 | recipes/user.md |
| user_profile_then_notes | 用户资料加笔记 | "用户笔记" "主页笔记" | 2 | 2 | recipes/user.md |
| user_notes_then_detail | 用户笔记看详情 | "笔记详情" | 2 | 2 | recipes/note.md |
| product_detail_then_reviews | 商品详情加评论 | "商品评论" "买家评价" | 2 | 2 | recipes/product.md |
| product_detail_then_recommend | 商品详情加推荐 | "推荐商品" "相似商品" | 2 | 2 | recipes/product.md |
| topic_info_then_feed | 话题详情看笔记 | "话题笔记" "话题内容" | 2 | 2 | recipes/product.md |
| trending_then_search | 热搜词搜笔记 | "热搜词搜笔记" | 2 | 2 | recipes/search.md |
| hot_list_then_detail | 热榜看笔记详情 | "热榜看笔记详情" | 2 | 2 | recipes/search.md |
| homefeed_then_detail | 推荐看笔记详情 | "推荐看笔记详情" | 2 | 2 | recipes/search.md |
| share_link_to_detail | 分享链接看详情 | "分享链接" "打开链接" | 1 | 1 | recipes/note.md |
| full_note_with_comments_replies | 笔记全链路详情评论回复 | "完整笔记" "详情评论回复" | 3 | 3 | recipes/note.md |


## 🔗 Recipe 串联图谱 (Chain Graph)

> 当 agent 完成一个 recipe 后，可按本表继续调用下游 recipe，形成跨域链路。
> 自动从 recipe 的 Output 字段与下游 Input 字段计算得出，每个源 recipe 取 top-5 最相关下游。
> 用户目标跨多个 recipe（如「搜某 UP 主 → 看其投稿 → 看视频评论」）时按本图**依序调用**，不要自行拆 atom。

| 已完成 Recipe | 输出字段 | 可继续 Recipe (按相关性排序) | 接力字段 |
|--------------|---------|----------------------------|---------|
| `full_note_with_comments_replies` (笔记全链路详情评论回复) | `comment_id`, `note_id` | `note_comments_then_replies` (评论展开回复) | `comment_id`, `note_id` |
| `full_note_with_comments_replies` (笔记全链路详情评论回复) | `note_id` | `search_note_then_detail` (搜索笔记看详情) | `note_id` |
| `full_note_with_comments_replies` (笔记全链路详情评论回复) | `note_id` | `note_detail_then_author` (笔记看作者主页) | `note_id` |
| `full_note_with_comments_replies` (笔记全链路详情评论回复) | `note_id` | `user_notes_then_detail` (用户笔记看详情) | `note_id` |
| `full_note_with_comments_replies` (笔记全链路详情评论回复) | `note_id` | `note_detail_then_comments` (笔记详情加评论) | `note_id` |
| `homefeed_then_detail` (推荐看笔记详情) | `note_id` | `search_note_then_detail` (搜索笔记看详情) | `note_id` |
| `homefeed_then_detail` (推荐看笔记详情) | `note_id` | `note_comments_then_replies` (评论展开回复) | `note_id` |
| `homefeed_then_detail` (推荐看笔记详情) | `note_id` | `note_detail_then_author` (笔记看作者主页) | `note_id` |
| `homefeed_then_detail` (推荐看笔记详情) | `note_id` | `user_notes_then_detail` (用户笔记看详情) | `note_id` |
| `homefeed_then_detail` (推荐看笔记详情) | `note_id` | `full_note_with_comments_replies` (笔记全链路详情评论回复) | `note_id` |
| `hot_list_then_detail` (热榜看笔记详情) | `note_id` | `search_note_then_detail` (搜索笔记看详情) | `note_id` |
| `hot_list_then_detail` (热榜看笔记详情) | `note_id` | `note_comments_then_replies` (评论展开回复) | `note_id` |
| `hot_list_then_detail` (热榜看笔记详情) | `note_id` | `note_detail_then_author` (笔记看作者主页) | `note_id` |
| `hot_list_then_detail` (热榜看笔记详情) | `note_id` | `user_notes_then_detail` (用户笔记看详情) | `note_id` |
| `hot_list_then_detail` (热榜看笔记详情) | `note_id` | `full_note_with_comments_replies` (笔记全链路详情评论回复) | `note_id` |
| `note_comments_then_replies` (评论展开回复) | `comment_id`, `note_id` | `full_note_with_comments_replies` (笔记全链路详情评论回复) | `comment_id`, `note_id` |
| `note_comments_then_replies` (评论展开回复) | `note_id` | `search_note_then_detail` (搜索笔记看详情) | `note_id` |
| `note_comments_then_replies` (评论展开回复) | `note_id` | `note_detail_then_author` (笔记看作者主页) | `note_id` |
| `note_comments_then_replies` (评论展开回复) | `note_id` | `user_notes_then_detail` (用户笔记看详情) | `note_id` |
| `note_comments_then_replies` (评论展开回复) | `note_id` | `note_detail_then_comments` (笔记详情加评论) | `note_id` |
| `note_detail_then_author` (笔记看作者主页) | `note_id`, `user_id` | `user_notes_then_detail` (用户笔记看详情) | `note_id`, `user_id` |
| `note_detail_then_author` (笔记看作者主页) | `user_id` | `search_user_then_profile` (搜索用户看主页) | `user_id` |
| `note_detail_then_author` (笔记看作者主页) | `note_id` | `search_note_then_detail` (搜索笔记看详情) | `note_id` |
| `note_detail_then_author` (笔记看作者主页) | `note_id` | `note_comments_then_replies` (评论展开回复) | `note_id` |
| `note_detail_then_author` (笔记看作者主页) | `note_id` | `full_note_with_comments_replies` (笔记全链路详情评论回复) | `note_id` |
| `note_detail_then_comments` (笔记详情加评论) | `note_id` | `search_note_then_detail` (搜索笔记看详情) | `note_id` |
| `note_detail_then_comments` (笔记详情加评论) | `note_id` | `note_comments_then_replies` (评论展开回复) | `note_id` |
| `note_detail_then_comments` (笔记详情加评论) | `note_id` | `note_detail_then_author` (笔记看作者主页) | `note_id` |
| `note_detail_then_comments` (笔记详情加评论) | `note_id` | `user_notes_then_detail` (用户笔记看详情) | `note_id` |
| `note_detail_then_comments` (笔记详情加评论) | `note_id` | `full_note_with_comments_replies` (笔记全链路详情评论回复) | `note_id` |
| `product_detail_then_recommend` (商品详情加推荐) | `sku_id` | `search_product_then_detail` (搜商品看详情) | `sku_id` |
| `product_detail_then_recommend` (商品详情加推荐) | `sku_id` | `product_detail_then_reviews` (商品详情加评论) | `sku_id` |
| `product_detail_then_reviews` (商品详情加评论) | `sku_id` | `search_product_then_detail` (搜商品看详情) | `sku_id` |
| `product_detail_then_reviews` (商品详情加评论) | `sku_id` | `product_detail_then_recommend` (商品详情加推荐) | `sku_id` |
| `search_note_then_detail` (搜索笔记看详情) | `keyword` | `search_user_then_profile` (搜索用户看主页) | `keyword` |
| `search_note_then_detail` (搜索笔记看详情) | `keyword` | `search_product_then_detail` (搜商品看详情) | `keyword` |
| `search_note_then_detail` (搜索笔记看详情) | `note_id` | `note_comments_then_replies` (评论展开回复) | `note_id` |
| `search_note_then_detail` (搜索笔记看详情) | `note_id` | `note_detail_then_author` (笔记看作者主页) | `note_id` |
| `search_note_then_detail` (搜索笔记看详情) | `note_id` | `user_notes_then_detail` (用户笔记看详情) | `note_id` |
| `search_product_then_detail` (搜商品看详情) | `keyword` | `search_user_then_profile` (搜索用户看主页) | `keyword` |
| `search_product_then_detail` (搜商品看详情) | `keyword` | `search_note_then_detail` (搜索笔记看详情) | `keyword` |
| `search_product_then_detail` (搜商品看详情) | `sku_id` | `product_detail_then_reviews` (商品详情加评论) | `sku_id` |
| `search_product_then_detail` (搜商品看详情) | `sku_id` | `product_detail_then_recommend` (商品详情加推荐) | `sku_id` |
| `search_product_then_detail` (搜商品看详情) | `keyword` | `trending_then_search` (热搜词搜笔记) | `keyword` |
| `search_user_then_profile` (搜索用户看主页) | `keyword` | `search_product_then_detail` (搜商品看详情) | `keyword` |
| `search_user_then_profile` (搜索用户看主页) | `keyword` | `search_note_then_detail` (搜索笔记看详情) | `keyword` |
| `search_user_then_profile` (搜索用户看主页) | `user_id` | `note_detail_then_author` (笔记看作者主页) | `user_id` |
| `search_user_then_profile` (搜索用户看主页) | `user_id` | `user_notes_then_detail` (用户笔记看详情) | `user_id` |
| `search_user_then_profile` (搜索用户看主页) | `user_id` | `user_profile_then_notes` (用户资料加笔记) | `user_id` |
| `trending_then_search` (热搜词搜笔记) | `keyword` | `search_user_then_profile` (搜索用户看主页) | `keyword` |
| `trending_then_search` (热搜词搜笔记) | `keyword` | `search_product_then_detail` (搜商品看详情) | `keyword` |
| `trending_then_search` (热搜词搜笔记) | `keyword` | `search_note_then_detail` (搜索笔记看详情) | `keyword` |
| `user_notes_then_detail` (用户笔记看详情) | `note_id`, `user_id` | `note_detail_then_author` (笔记看作者主页) | `note_id`, `user_id` |
| `user_notes_then_detail` (用户笔记看详情) | `user_id` | `search_user_then_profile` (搜索用户看主页) | `user_id` |
| `user_notes_then_detail` (用户笔记看详情) | `note_id` | `search_note_then_detail` (搜索笔记看详情) | `note_id` |
| `user_notes_then_detail` (用户笔记看详情) | `note_id` | `note_comments_then_replies` (评论展开回复) | `note_id` |
| `user_notes_then_detail` (用户笔记看详情) | `note_id` | `full_note_with_comments_replies` (笔记全链路详情评论回复) | `note_id` |
| `user_profile_then_notes` (用户资料加笔记) | `user_id` | `search_user_then_profile` (搜索用户看主页) | `user_id` |
| `user_profile_then_notes` (用户资料加笔记) | `user_id` | `note_detail_then_author` (笔记看作者主页) | `user_id` |
| `user_profile_then_notes` (用户资料加笔记) | `user_id` | `user_notes_then_detail` (用户笔记看详情) | `user_id` |

> 🔀 = 跨文件链路 (cross-domain chain)；优先选 🔀 标记的下游 recipe，因为它能扩展 agent 已有的数据视图。

**典型 3 步用法**：
1. 用户语义 → 在 `_index.md` trigger_keywords 列匹配第 1 个 recipe
2. 执行第 1 个 recipe，得到 Output 字段
3. 在本表查 "已完成 Recipe" 列 → 选合适的下游 → 用 "接力字段" 直接传参，无需问用户重复输入

