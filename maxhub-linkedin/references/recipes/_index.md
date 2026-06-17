# Recipe Index / 编排索引


> 🎯 **Trigger 匹配规则（agent 必读）**：
> 1. **最长匹配优先**：用户输入同时命中多个 recipe 时，选 trigger 短语**最长**（最具体）的那个
> 2. **平局询问**：trigger 长度相同时，反问用户消歧后再调用
> 3. **跨域链路**：用户目标跨多个 recipe（如"先搜索再看评论"）→ 串行调用多个 recipe，**不要**自行拆解 atom


## Recipe 分类索引

| recipe_id | display_name | trigger_keywords | steps | est_calls | file |
|-----------|-------------|-----------------|-------|-----------|------|
| user_profile_with_posts | 用户资料+帖子 | "用户帖子" "领英帖子" "这个人发了什么" | 2 | 2 | recipes/user.md |
| search_people_to_profile | 搜索人→资料 | "搜索人" "找人" "领英找人" | 2 | 2 | recipes/user.md |
| user_top_card | 用户顶部卡片 | "用户概览" "用户简介" "快速了解" | 1 | 1 | recipes/user.md |
| post_with_comments | 帖子+评论 | "帖子评论" "看看评论" | 2 | 2 | recipes/content.md |
| search_posts_to_detail | 搜索帖子→详情 | "搜索帖子" "找帖子" "领英文章" | 2 | 2 | recipes/content.md |
| hashtag_to_posts | 话题→帖子 | "话题动态" "hashtag" "标签帖子" | 2 | 2 | recipes/content.md |
| company_with_employees | 公司+员工 | "公司员工" "谁在这家公司" | 2 | 2 | recipes/company.md |
| company_with_posts | 公司+帖子 | "公司帖子" "公司动态" | 2 | 2 | recipes/company.md |
| company_with_jobs | 公司+职位 | "公司职位" "公司招聘" | 2 | 2 | recipes/company.md |
| company_competitor_analysis | 公司竞品分析 | "竞品" "竞争对手" "类似公司" | 2 | 2 | recipes/company.md |
| search_jobs_to_detail | 搜索职位→详情 | "搜索职位" "找工作" "领英职位" | 2 | 2 | recipes/jobs.md |


## 🔗 Recipe 串联图谱 (Chain Graph)

> 当 agent 完成一个 recipe 后，可按本表继续调用下游 recipe，形成跨域链路。
> 自动从 recipe 的 Output 字段与下游 Input 字段计算得出，每个源 recipe 取 top-5 最相关下游。
> 用户目标跨多个 recipe（如「搜某 UP 主 → 看其投稿 → 看视频评论」）时按本图**依序调用**，不要自行拆 atom。

| 已完成 Recipe | 输出字段 | 可继续 Recipe (按相关性排序) | 接力字段 |
|--------------|---------|----------------------------|---------|
| `company_competitor_analysis` (公司竞品分析) | `cid`, `company_id`, `id` | `company_with_employees` (公司+员工) | `cid`, `company_id`, `id` |
| `company_competitor_analysis` (公司竞品分析) | `cid`, `company_id`, `id` | `company_with_posts` (公司+帖子) | `cid`, `company_id`, `id` |
| `company_competitor_analysis` (公司竞品分析) | `cid`, `company_id`, `id` | `company_with_jobs` (公司+职位) | `cid`, `company_id`, `id` |
| `company_with_employees` (公司+员工) | `cid`, `company_id`, `id` | `company_with_posts` (公司+帖子) | `cid`, `company_id`, `id` |
| `company_with_employees` (公司+员工) | `cid`, `company_id`, `id` | `company_with_jobs` (公司+职位) | `cid`, `company_id`, `id` |
| `company_with_employees` (公司+员工) | `cid`, `company_id`, `id` | `company_competitor_analysis` (公司竞品分析) | `cid`, `company_id`, `id` |
| `company_with_jobs` (公司+职位) | `cid`, `company_id`, `id` | `company_with_employees` (公司+员工) | `cid`, `company_id`, `id` |
| `company_with_jobs` (公司+职位) | `cid`, `company_id`, `id` | `company_with_posts` (公司+帖子) | `cid`, `company_id`, `id` |
| `company_with_jobs` (公司+职位) | `cid`, `company_id`, `id` | `company_competitor_analysis` (公司竞品分析) | `cid`, `company_id`, `id` |
| `company_with_posts` (公司+帖子) | `cid`, `company_id`, `id` | `company_with_employees` (公司+员工) | `cid`, `company_id`, `id` |
| `company_with_posts` (公司+帖子) | `cid`, `company_id`, `id` | `company_with_jobs` (公司+职位) | `cid`, `company_id`, `id` |
| `company_with_posts` (公司+帖子) | `cid`, `company_id`, `id` | `company_competitor_analysis` (公司竞品分析) | `cid`, `company_id`, `id` |
| `post_with_comments` (帖子+评论) | `purn`, `urn` | `search_posts_to_detail` (搜索帖子→详情) | `purn`, `urn` |
| `search_jobs_to_detail` (搜索职位→详情) | `keyword` | 🔀 `search_people_to_profile` (搜索人→资料) | `keyword` |
| `search_jobs_to_detail` (搜索职位→详情) | `keyword` | 🔀 `search_posts_to_detail` (搜索帖子→详情) | `keyword` |
| `search_people_to_profile` (搜索人→资料) | `keyword` | 🔀 `search_posts_to_detail` (搜索帖子→详情) | `keyword` |
| `search_people_to_profile` (搜索人→资料) | `keyword` | 🔀 `search_jobs_to_detail` (搜索职位→详情) | `keyword` |
| `search_people_to_profile` (搜索人→资料) | `uname`, `username` | `user_profile_with_posts` (用户资料+帖子) | `uname`, `username` |
| `search_people_to_profile` (搜索人→资料) | `username` | `user_top_card` (用户顶部卡片) | `username` |
| `search_posts_to_detail` (搜索帖子→详情) | `keyword` | 🔀 `search_people_to_profile` (搜索人→资料) | `keyword` |
| `search_posts_to_detail` (搜索帖子→详情) | `keyword` | 🔀 `search_jobs_to_detail` (搜索职位→详情) | `keyword` |
| `search_posts_to_detail` (搜索帖子→详情) | `post_urn`, `purn`, `urn` | `post_with_comments` (帖子+评论) | `post_urn`, `purn`, `urn` |
| `user_profile_with_posts` (用户资料+帖子) | `uname` | `search_people_to_profile` (搜索人→资料) | `uname` |
| `user_profile_with_posts` (用户资料+帖子) | `username` | `user_top_card` (用户顶部卡片) | `username` |
| `user_top_card` (用户顶部卡片) | `username` | `user_profile_with_posts` (用户资料+帖子) | `username` |

> 🔀 = 跨文件链路 (cross-domain chain)；优先选 🔀 标记的下游 recipe，因为它能扩展 agent 已有的数据视图。

**典型 3 步用法**：
1. 用户语义 → 在 `_index.md` trigger_keywords 列匹配第 1 个 recipe
2. 执行第 1 个 recipe，得到 Output 字段
3. 在本表查 "已完成 Recipe" 列 → 选合适的下游 → 用 "接力字段" 直接传参，无需问用户重复输入

