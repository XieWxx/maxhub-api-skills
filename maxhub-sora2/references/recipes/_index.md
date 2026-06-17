# Recipe Index / 编排索引


> 🎯 **Trigger 匹配规则（agent 必读）**：
> 1. **最长匹配优先**：用户输入同时命中多个 recipe 时，选 trigger 短语**最长**（最具体）的那个
> 2. **平局询问**：trigger 长度相同时，反问用户消歧后再调用
> 3. **跨域链路**：用户目标跨多个 recipe（如"先搜索再看评论"）→ 串行调用多个 recipe，**不要**自行拆解 atom


> ⚠️ **触发词收窄声明（v2 安全审计）**：所有 recipe 的 `trigger_keywords` 已移除单词级泛触发（如 "UP主"/"热搜"/"弹幕"），改为完整意图短语。Agent 在词义模糊时**必须先回问用户**意图，再调用 recipe。

> 本文件是编排层（Orchestration Layer）的索引。每个 Recipe 封装一个"用户目标"的多步链式调用。
> Agent 通过用户语义匹配 trigger_keywords，按名调用 Recipe，无需自行拼装链路。

## Recipe 分类索引

| recipe_id | display_name | trigger_keywords | steps | est_calls | file |
|-----------|-------------|-----------------|-------|-----------|------|
| post_with_comments | 看作品+评论 | "看作品评论" "帖子评论" "作品评论" | 2 | 2 | recipes/post.md |
| comments_with_replies | 看评论+回复 | "评论回复" "看回复" "评论详情" | 2 | 2 | recipes/post.md |
| post_full_thread | 看作品+评论+回复 | "完整讨论" "作品评论回复" | 3 | 3 | recipes/post.md |
| download_video | 下载作品视频 | "下载视频" "下载作品" "保存视频" | 2 | 2 | recipes/post.md |
| post_with_remix | 看作品+二创 | "二创" "Remix" "衍生作品" | 2 | 2 | recipes/post.md |
| post_with_author | 看作品+作者主页 | "看作者" "作品作者" "谁发的" | 2 | 2 | recipes/post.md |
| username_to_profile | 用户名→用户主页 | "搜用户" "找用户" "用户名查主页" | 2 | 2 | recipes/user.md |
| profile_with_posts | 用户资料+作品 | "用户作品" "主页作品" "ta的作品" | 2 | 2 | recipes/user.md |
| username_to_posts | 用户名→用户作品 | "搜用户作品" "找ta的作品" | 3 | 3 | recipes/user.md |
| user_social_circle | 看用户社交圈 | "关注粉丝" "社交关系" "社交圈" | 3 | 3 | recipes/user.md |
| user_with_cameo | 看用户Cameo出镜 | "Cameo" "出镜" "出镜记录" | 2 | 2 | recipes/user.md |
| text_to_video | 文生视频 | "生成视频" "文生视频" "创建视频" | 3 | 3 | recipes/tools.md |
| image_to_video | 图生视频 | "图生视频" "图片生成视频" "用图做视频" | 4 | 4 | recipes/tools.md |
| cameo_to_profile | 热榜→用户主页 | "Cameo热榜" "谁最火" "出镜排行" | 2 | 2 | recipes/tools.md |

### 字段说明
- **recipe_id**：Recipe 唯一标识
- **display_name**：中文名，便于 Agent 理解
- **trigger_keywords**：用户语义命中关键词（Agent 用来识别该 Recipe）
- **steps**：原子步骤数
- **est_calls**：预估 API 调用次数
- **file**：Recipe 详情所在文件


## 🔗 Recipe 串联图谱 (Chain Graph)

> 当 agent 完成一个 recipe 后，可按本表继续调用下游 recipe，形成跨域链路。
> 自动从 recipe 的 Output 字段与下游 Input 字段计算得出，每个源 recipe 取 top-5 最相关下游。
> 用户目标跨多个 recipe（如「搜某 UP 主 → 看其投稿 → 看视频评论」）时按本图**依序调用**，不要自行拆 atom。

| 已完成 Recipe | 输出字段 | 可继续 Recipe (按相关性排序) | 接力字段 |
|--------------|---------|----------------------------|---------|
| `cameo_to_profile` (热榜→用户主页) | `user_id` | 🔀 `username_to_profile` (用户名→用户主页) | `user_id` |
| `cameo_to_profile` (热榜→用户主页) | `user_id` | 🔀 `profile_with_posts` (用户资料+作品) | `user_id` |
| `cameo_to_profile` (热榜→用户主页) | `user_id` | 🔀 `username_to_posts` (用户名→用户作品) | `user_id` |
| `cameo_to_profile` (热榜→用户主页) | `user_id` | 🔀 `user_social_circle` (看用户社交圈) | `user_id` |
| `cameo_to_profile` (热榜→用户主页) | `user_id` | 🔀 `user_with_cameo` (看用户Cameo出镜) | `user_id` |
| `comments_with_replies` (看评论+回复) | `comment_id`, `replies` | `post_full_thread` (看作品+评论+回复) | `comment_id`, `replies` |
| `comments_with_replies` (看评论+回复) | `comments` | `post_with_comments` (看作品+评论) | `comments` |
| `download_video` (下载作品视频) | `post_id` | `post_with_comments` (看作品+评论) | `post_id` |
| `download_video` (下载作品视频) | `post_id` | `comments_with_replies` (看评论+回复) | `post_id` |
| `download_video` (下载作品视频) | `post_id` | `post_full_thread` (看作品+评论+回复) | `post_id` |
| `download_video` (下载作品视频) | `post_id` | `post_with_remix` (看作品+二创) | `post_id` |
| `download_video` (下载作品视频) | `post_id` | `post_with_author` (看作品+作者主页) | `post_id` |
| `image_to_video` (图生视频) | `status`, `task_id`, `url` | `text_to_video` (文生视频) | `status`, `task_id`, `url` |
| `post_full_thread` (看作品+评论+回复) | `comment_id`, `post_id`, `replies` | `comments_with_replies` (看评论+回复) | `comment_id`, `post_id`, `replies` |
| `post_full_thread` (看作品+评论+回复) | `comments`, `post_id` | `post_with_comments` (看作品+评论) | `comments`, `post_id` |
| `post_full_thread` (看作品+评论+回复) | `post_id` | `download_video` (下载作品视频) | `post_id` |
| `post_full_thread` (看作品+评论+回复) | `post_id` | `post_with_remix` (看作品+二创) | `post_id` |
| `post_full_thread` (看作品+评论+回复) | `post_id` | `post_with_author` (看作品+作者主页) | `post_id` |
| `post_with_author` (看作品+作者主页) | `user_id` | 🔀 `username_to_profile` (用户名→用户主页) | `user_id` |
| `post_with_author` (看作品+作者主页) | `user_id` | 🔀 `profile_with_posts` (用户资料+作品) | `user_id` |
| `post_with_author` (看作品+作者主页) | `user_id` | 🔀 `username_to_posts` (用户名→用户作品) | `user_id` |
| `post_with_author` (看作品+作者主页) | `user_id` | 🔀 `user_social_circle` (看用户社交圈) | `user_id` |
| `post_with_author` (看作品+作者主页) | `user_id` | 🔀 `user_with_cameo` (看用户Cameo出镜) | `user_id` |
| `post_with_comments` (看作品+评论) | `post_id` | `comments_with_replies` (看评论+回复) | `post_id` |
| `post_with_comments` (看作品+评论) | `post_id` | `post_full_thread` (看作品+评论+回复) | `post_id` |
| `post_with_comments` (看作品+评论) | `post_id` | `download_video` (下载作品视频) | `post_id` |
| `post_with_comments` (看作品+评论) | `post_id` | `post_with_remix` (看作品+二创) | `post_id` |
| `post_with_comments` (看作品+评论) | `post_id` | `post_with_author` (看作品+作者主页) | `post_id` |
| `post_with_remix` (看作品+二创) | `post_id` | `post_with_comments` (看作品+评论) | `post_id` |
| `post_with_remix` (看作品+二创) | `post_id` | `comments_with_replies` (看评论+回复) | `post_id` |
| `post_with_remix` (看作品+二创) | `post_id` | `post_full_thread` (看作品+评论+回复) | `post_id` |
| `post_with_remix` (看作品+二创) | `post_id` | `download_video` (下载作品视频) | `post_id` |
| `post_with_remix` (看作品+二创) | `post_id` | `post_with_author` (看作品+作者主页) | `post_id` |
| `profile_with_posts` (用户资料+作品) | `user_id` | 🔀 `cameo_to_profile` (热榜→用户主页) | `user_id` |
| `profile_with_posts` (用户资料+作品) | `user_id` | 🔀 `post_with_author` (看作品+作者主页) | `user_id` |
| `profile_with_posts` (用户资料+作品) | `posts`, `user_id` | `username_to_posts` (用户名→用户作品) | `posts`, `user_id` |
| `profile_with_posts` (用户资料+作品) | `user_id` | `username_to_profile` (用户名→用户主页) | `user_id` |
| `profile_with_posts` (用户资料+作品) | `user_id` | `user_social_circle` (看用户社交圈) | `user_id` |
| `text_to_video` (文生视频) | `status`, `task_id`, `url` | `image_to_video` (图生视频) | `status`, `task_id`, `url` |
| `user_social_circle` (看用户社交圈) | `user_id` | 🔀 `cameo_to_profile` (热榜→用户主页) | `user_id` |
| `user_social_circle` (看用户社交圈) | `user_id` | 🔀 `post_with_author` (看作品+作者主页) | `user_id` |
| `user_social_circle` (看用户社交圈) | `user_id` | `username_to_profile` (用户名→用户主页) | `user_id` |
| `user_social_circle` (看用户社交圈) | `user_id` | `profile_with_posts` (用户资料+作品) | `user_id` |
| `user_social_circle` (看用户社交圈) | `user_id` | `username_to_posts` (用户名→用户作品) | `user_id` |
| `user_with_cameo` (看用户Cameo出镜) | `user_id` | 🔀 `cameo_to_profile` (热榜→用户主页) | `user_id` |
| `user_with_cameo` (看用户Cameo出镜) | `user_id` | 🔀 `post_with_author` (看作品+作者主页) | `user_id` |
| `user_with_cameo` (看用户Cameo出镜) | `user_id` | `username_to_profile` (用户名→用户主页) | `user_id` |
| `user_with_cameo` (看用户Cameo出镜) | `user_id` | `profile_with_posts` (用户资料+作品) | `user_id` |
| `user_with_cameo` (看用户Cameo出镜) | `user_id` | `username_to_posts` (用户名→用户作品) | `user_id` |
| `username_to_posts` (用户名→用户作品) | `user_id` | 🔀 `cameo_to_profile` (热榜→用户主页) | `user_id` |
| `username_to_posts` (用户名→用户作品) | `user_id` | 🔀 `post_with_author` (看作品+作者主页) | `user_id` |
| `username_to_posts` (用户名→用户作品) | `posts`, `user_id` | `profile_with_posts` (用户资料+作品) | `posts`, `user_id` |
| `username_to_posts` (用户名→用户作品) | `user_id` | `user_social_circle` (看用户社交圈) | `user_id` |
| `username_to_posts` (用户名→用户作品) | `user_id` | `user_with_cameo` (看用户Cameo出镜) | `user_id` |
| `username_to_profile` (用户名→用户主页) | `user_id` | 🔀 `cameo_to_profile` (热榜→用户主页) | `user_id` |
| `username_to_profile` (用户名→用户主页) | `user_id` | 🔀 `post_with_author` (看作品+作者主页) | `user_id` |
| `username_to_profile` (用户名→用户主页) | `user_id` | `profile_with_posts` (用户资料+作品) | `user_id` |
| `username_to_profile` (用户名→用户主页) | `user_id` | `username_to_posts` (用户名→用户作品) | `user_id` |
| `username_to_profile` (用户名→用户主页) | `user_id` | `user_social_circle` (看用户社交圈) | `user_id` |

> 🔀 = 跨文件链路 (cross-domain chain)；优先选 🔀 标记的下游 recipe，因为它能扩展 agent 已有的数据视图。

**典型 3 步用法**：
1. 用户语义 → 在 `_index.md` trigger_keywords 列匹配第 1 个 recipe
2. 执行第 1 个 recipe，得到 Output 字段
3. 在本表查 "已完成 Recipe" 列 → 选合适的下游 → 用 "接力字段" 直接传参，无需问用户重复输入

