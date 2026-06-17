# Recipe Index / 编排索引


> 🎯 **Trigger 匹配规则（agent 必读）**：
> 1. **最长匹配优先**：用户输入同时命中多个 recipe 时，选 trigger 短语**最长**（最具体）的那个
> 2. **平局询问**：trigger 长度相同时，反问用户消歧后再调用
> 3. **跨域链路**：用户目标跨多个 recipe（如"先搜索再看评论"）→ 串行调用多个 recipe，**不要**自行拆解 atom


## Recipe 分类索引

| recipe_id | display_name | trigger_keywords | steps | est_calls | file |
|-----------|-------------|-----------------|-------|-----------|------|
| article_with_comments | 文章+评论 | "文章评论" "看看评论" | 2 | 2 | recipes/post.md |
| video_with_comments | 视频+评论 | "视频评论" "看看评论" | 2 | 2 | recipes/post.md |
| article_to_author | 文章→作者 | "文章作者" "谁写的" | 2 | 2 | recipes/post.md |
| user_url_to_info | 用户URL→信息 | "用户主页" "头条用户" | 2 | 2 | recipes/user.md |


## 🔗 Recipe 串联图谱 (Chain Graph)

> 当 agent 完成一个 recipe 后，可按本表继续调用下游 recipe，形成跨域链路。
> 自动从 recipe 的 Output 字段与下游 Input 字段计算得出，每个源 recipe 取 top-5 最相关下游。
> 用户目标跨多个 recipe（如「搜某 UP 主 → 看其投稿 → 看视频评论」）时按本图**依序调用**，不要自行拆 atom。

| 已完成 Recipe | 输出字段 | 可继续 Recipe (按相关性排序) | 接力字段 |
|--------------|---------|----------------------------|---------|
| `article_to_author` (文章→作者) | `uid`, `user_id` | 🔀 `user_url_to_info` (用户URL→信息) | `uid`, `user_id` |
| `article_to_author` (文章→作者) | `group_id`, `user_id` | `article_with_comments` (文章+评论) | `group_id`, `user_id` |
| `article_to_author` (文章→作者) | `group_id` | `video_with_comments` (视频+评论) | `group_id` |
| `article_with_comments` (文章+评论) | `uid`, `user_id` | 🔀 `user_url_to_info` (用户URL→信息) | `uid`, `user_id` |
| `article_with_comments` (文章+评论) | `group_id`, `uid`, `user_id` | `article_to_author` (文章→作者) | `group_id`, `uid`, `user_id` |
| `article_with_comments` (文章+评论) | `group_id` | `video_with_comments` (视频+评论) | `group_id` |
| `user_url_to_info` (用户URL→信息) | `uid`, `user_id` | 🔀 `article_to_author` (文章→作者) | `uid`, `user_id` |
| `user_url_to_info` (用户URL→信息) | `user_id` | 🔀 `article_with_comments` (文章+评论) | `user_id` |
| `video_with_comments` (视频+评论) | `group_id` | `article_with_comments` (文章+评论) | `group_id` |
| `video_with_comments` (视频+评论) | `group_id` | `article_to_author` (文章→作者) | `group_id` |

> 🔀 = 跨文件链路 (cross-domain chain)；优先选 🔀 标记的下游 recipe，因为它能扩展 agent 已有的数据视图。

**典型 3 步用法**：
1. 用户语义 → 在 `_index.md` trigger_keywords 列匹配第 1 个 recipe
2. 执行第 1 个 recipe，得到 Output 字段
3. 在本表查 "已完成 Recipe" 列 → 选合适的下游 → 用 "接力字段" 直接传参，无需问用户重复输入

