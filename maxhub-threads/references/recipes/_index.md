# Recipe Index / 编排索引


> 🎯 **Trigger 匹配规则（agent 必读）**：
> 1. **最长匹配优先**：用户输入同时命中多个 recipe 时，选 trigger 短语**最长**（最具体）的那个
> 2. **平局询问**：trigger 长度相同时，反问用户消歧后再调用
> 3. **跨域链路**：用户目标跨多个 recipe（如"先搜索再看评论"）→ 串行调用多个 recipe，**不要**自行拆解 atom


## Recipe 分类索引

| recipe_id | display_name | trigger_keywords | steps | est_calls | file |
|-----------|-------------|-----------------|-------|-----------|------|
| post_detail_with_comments | 帖子详情+评论 | "帖子评论" "看看评论" "帖子下面的评论" | 2 | 2 | recipes/content.md |
| search_top_to_detail | 搜索热门→详情 | "搜索帖子" "热门帖子" "Threads搜索" | 2 | 2 | recipes/content.md |
| search_profiles_to_user | 搜索用户→资料 | "搜索用户" "找人" "Threads用户" | 2 | 2 | recipes/content.md |
| user_info_with_posts | 用户信息+帖子 | "用户帖子" "Threads帖子" "这个人发了什么" | 2 | 2 | recipes/user.md |
| user_info_with_replies | 用户信息+回复 | "用户回复" "这个人回复了什么" | 2 | 2 | recipes/user.md |


## 🔗 Recipe 串联图谱 (Chain Graph)

> 当 agent 完成一个 recipe 后，可按本表继续调用下游 recipe，形成跨域链路。
> 自动从 recipe 的 Output 字段与下游 Input 字段计算得出，每个源 recipe 取 top-5 最相关下游。
> 用户目标跨多个 recipe（如「搜某 UP 主 → 看其投稿 → 看视频评论」）时按本图**依序调用**，不要自行拆 atom。

| 已完成 Recipe | 输出字段 | 可继续 Recipe (按相关性排序) | 接力字段 |
|--------------|---------|----------------------------|---------|
| `search_profiles_to_user` (搜索用户→资料) | `username` | 🔀 `user_info_with_posts` (用户信息+帖子) | `username` |
| `search_profiles_to_user` (搜索用户→资料) | `username` | 🔀 `user_info_with_replies` (用户信息+回复) | `username` |
| `search_profiles_to_user` (搜索用户→资料) | `query` | `search_top_to_detail` (搜索热门→详情) | `query` |
| `search_top_to_detail` (搜索热门→详情) | `post_id` | `post_detail_with_comments` (帖子详情+评论) | `post_id` |
| `search_top_to_detail` (搜索热门→详情) | `query` | `search_profiles_to_user` (搜索用户→资料) | `query` |
| `user_info_with_posts` (用户信息+帖子) | `username` | 🔀 `search_profiles_to_user` (搜索用户→资料) | `username` |
| `user_info_with_posts` (用户信息+帖子) | `pk`, `uid`, `username` | `user_info_with_replies` (用户信息+回复) | `pk`, `uid`, `username` |
| `user_info_with_replies` (用户信息+回复) | `username` | 🔀 `search_profiles_to_user` (搜索用户→资料) | `username` |
| `user_info_with_replies` (用户信息+回复) | `pk`, `uid`, `username` | `user_info_with_posts` (用户信息+帖子) | `pk`, `uid`, `username` |

> 🔀 = 跨文件链路 (cross-domain chain)；优先选 🔀 标记的下游 recipe，因为它能扩展 agent 已有的数据视图。

**典型 3 步用法**：
1. 用户语义 → 在 `_index.md` trigger_keywords 列匹配第 1 个 recipe
2. 执行第 1 个 recipe，得到 Output 字段
3. 在本表查 "已完成 Recipe" 列 → 选合适的下游 → 用 "接力字段" 直接传参，无需问用户重复输入

