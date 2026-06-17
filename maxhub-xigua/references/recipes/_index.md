# Recipe Index / 编排索引


> 🎯 **Trigger 匹配规则（agent 必读）**：
> 1. **最长匹配优先**：用户输入同时命中多个 recipe 时，选 trigger 短语**最长**（最具体）的那个
> 2. **平局询问**：trigger 长度相同时，反问用户消歧后再调用
> 3. **跨域链路**：用户目标跨多个 recipe（如"先搜索再看评论"）→ 串行调用多个 recipe，**不要**自行拆解 atom


## Recipe 分类索引

| recipe_id | display_name | trigger_keywords | steps | est_calls | file |
|-----------|-------------|-----------------|-------|-----------|------|
| video_detail_with_comments | 视频详情+评论 | "视频评论" "看看评论" | 2 | 2 | recipes/post.md |
| video_detail_with_play_url | 视频详情+播放链接 | "播放链接" "下载视频" "视频地址" | 2 | 2 | recipes/post.md |
| search_to_video_detail | 搜索→视频详情 | "搜索视频" "西瓜搜索" | 2 | 2 | recipes/post.md |
| user_info_with_posts | 用户信息+作品 | "用户作品" "西瓜用户" | 2 | 2 | recipes/user.md |


## 🔗 Recipe 串联图谱 (Chain Graph)

> 当 agent 完成一个 recipe 后，可按本表继续调用下游 recipe，形成跨域链路。
> 自动从 recipe 的 Output 字段与下游 Input 字段计算得出，每个源 recipe 取 top-5 最相关下游。
> 用户目标跨多个 recipe（如「搜某 UP 主 → 看其投稿 → 看视频评论」）时按本图**依序调用**，不要自行拆 atom。

| 已完成 Recipe | 输出字段 | 可继续 Recipe (按相关性排序) | 接力字段 |
|--------------|---------|----------------------------|---------|
| `search_to_video_detail` (搜索→视频详情) | `iid`, `item_id` | `video_detail_with_comments` (视频详情+评论) | `iid`, `item_id` |
| `search_to_video_detail` (搜索→视频详情) | `iid`, `item_id` | `video_detail_with_play_url` (视频详情+播放链接) | `iid`, `item_id` |
| `video_detail_with_comments` (视频详情+评论) | `iid`, `item_id` | `search_to_video_detail` (搜索→视频详情) | `iid`, `item_id` |
| `video_detail_with_comments` (视频详情+评论) | `iid`, `item_id` | `video_detail_with_play_url` (视频详情+播放链接) | `iid`, `item_id` |
| `video_detail_with_play_url` (视频详情+播放链接) | `iid`, `item_id` | `search_to_video_detail` (搜索→视频详情) | `iid`, `item_id` |
| `video_detail_with_play_url` (视频详情+播放链接) | `iid`, `item_id` | `video_detail_with_comments` (视频详情+评论) | `iid`, `item_id` |

> 🔀 = 跨文件链路 (cross-domain chain)；优先选 🔀 标记的下游 recipe，因为它能扩展 agent 已有的数据视图。

**典型 3 步用法**：
1. 用户语义 → 在 `_index.md` trigger_keywords 列匹配第 1 个 recipe
2. 执行第 1 个 recipe，得到 Output 字段
3. 在本表查 "已完成 Recipe" 列 → 选合适的下游 → 用 "接力字段" 直接传参，无需问用户重复输入

