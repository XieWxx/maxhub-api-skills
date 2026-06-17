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
| article_with_stats | 文章详情+互动数据 | "文章数据" "阅读量" "点赞数" | 2 | 2 | recipes/mp.md |
| article_with_comments | 文章+评论 | "文章评论" "看评论" | 2 | 2 | recipes/mp.md |
| comments_with_replies | 评论+回复 | "评论回复" "看回复" | 2 | 2 | recipes/mp.md |
| article_with_related | 文章+关联文章 | "关联文章" "相关文章" | 2 | 2 | recipes/mp.md |
| article_with_author | 文章+公众号主页 | "文章作者" "哪个号" "谁发的" | 2 | 2 | recipes/mp.md |
| mp_profile_articles | 公众号资料+文章列表 | "公众号文章" "历史文章" | 2 | 2 | recipes/mp.md |
| sph_to_info | sph短号→账号信息 | "sph" "短号" "视频号ID" | 2 | 2 | recipes/channels.md |
| video_with_comments | 视频+评论 | "视频评论" "看评论" | 2 | 2 | recipes/channels.md |
| video_with_author | 视频+作者主页 | "视频作者" "谁发的" | 2 | 2 | recipes/channels.md |
| video_with_share | 视频+分享链接 | "分享视频" "分享链接" | 2 | 2 | recipes/channels.md |
| profile_with_collections | 主页+合集 | "合集" "视频合集" | 2 | 2 | recipes/channels.md |
| collection_with_videos | 合集+合集内视频 | "合集视频" "合集内容" | 2 | 2 | recipes/channels.md |
| profile_with_lives | 主页+直播回放 | "直播回放" "历史直播" | 2 | 2 | recipes/channels.md |
| search_to_mp | 搜公众号→看资料 | "搜公众号" "找公众号" | 2 | 2 | recipes/search.md |
| search_to_articles | 搜公众号→看文章 | "搜文章列表" "公众号文章" | 2 | 2 | recipes/search.md |
| search_to_video | 搜视频→下载 | "搜视频下载" "找视频号视频" | 2 | 2 | recipes/search.md |
| search_to_live | 搜直播→看详情 | "搜直播" "找直播" | 2 | 2 | recipes/search.md |

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
| `article_with_author` (文章+公众号主页) | `username` | 🔀 `sph_to_info` (sph短号→账号信息) | `username` |
| `article_with_author` (文章+公众号主页) | `username` | 🔀 `video_with_author` (视频+作者主页) | `username` |
| `article_with_author` (文章+公众号主页) | `username` | 🔀 `profile_with_collections` (主页+合集) | `username` |
| `article_with_author` (文章+公众号主页) | `username` | 🔀 `collection_with_videos` (合集+合集内视频) | `username` |
| `article_with_author` (文章+公众号主页) | `username` | 🔀 `profile_with_lives` (主页+直播回放) | `username` |
| `article_with_comments` (文章+评论) | `content_id` | `comments_with_replies` (评论+回复) | `content_id` |
| `collection_with_videos` (合集+合集内视频) | `topic_id` | `profile_with_collections` (主页+合集) | `topic_id` |
| `comments_with_replies` (评论+回复) | `content_id` | `article_with_comments` (文章+评论) | `content_id` |
| `profile_with_collections` (主页+合集) | `topic_id` | `collection_with_videos` (合集+合集内视频) | `topic_id` |
| `search_to_articles` (搜公众号→看文章) | `username` | 🔀 `sph_to_info` (sph短号→账号信息) | `username` |
| `search_to_articles` (搜公众号→看文章) | `username` | 🔀 `video_with_author` (视频+作者主页) | `username` |
| `search_to_articles` (搜公众号→看文章) | `username` | 🔀 `profile_with_collections` (主页+合集) | `username` |
| `search_to_articles` (搜公众号→看文章) | `username` | 🔀 `collection_with_videos` (合集+合集内视频) | `username` |
| `search_to_articles` (搜公众号→看文章) | `username` | 🔀 `profile_with_lives` (主页+直播回放) | `username` |
| `search_to_mp` (搜公众号→看资料) | `username` | 🔀 `sph_to_info` (sph短号→账号信息) | `username` |
| `search_to_mp` (搜公众号→看资料) | `username` | 🔀 `video_with_author` (视频+作者主页) | `username` |
| `search_to_mp` (搜公众号→看资料) | `username` | 🔀 `profile_with_collections` (主页+合集) | `username` |
| `search_to_mp` (搜公众号→看资料) | `username` | 🔀 `collection_with_videos` (合集+合集内视频) | `username` |
| `search_to_mp` (搜公众号→看资料) | `username` | 🔀 `profile_with_lives` (主页+直播回放) | `username` |
| `sph_to_info` (sph短号→账号信息) | `username` | 🔀 `mp_profile_articles` (公众号资料+文章列表) | `username` |
| `sph_to_info` (sph短号→账号信息) | `username` | `video_with_author` (视频+作者主页) | `username` |
| `sph_to_info` (sph短号→账号信息) | `username` | `profile_with_collections` (主页+合集) | `username` |
| `sph_to_info` (sph短号→账号信息) | `username` | `collection_with_videos` (合集+合集内视频) | `username` |
| `sph_to_info` (sph短号→账号信息) | `username` | `profile_with_lives` (主页+直播回放) | `username` |
| `video_with_author` (视频+作者主页) | `username` | 🔀 `mp_profile_articles` (公众号资料+文章列表) | `username` |
| `video_with_author` (视频+作者主页) | `username` | `sph_to_info` (sph短号→账号信息) | `username` |
| `video_with_author` (视频+作者主页) | `username` | `profile_with_collections` (主页+合集) | `username` |
| `video_with_author` (视频+作者主页) | `username` | `collection_with_videos` (合集+合集内视频) | `username` |
| `video_with_author` (视频+作者主页) | `username` | `profile_with_lives` (主页+直播回放) | `username` |
| `video_with_comments` (视频+评论) | `id`, `object_id` | `video_with_share` (视频+分享链接) | `id`, `object_id` |
| `video_with_comments` (视频+评论) | `object_id` | `video_with_author` (视频+作者主页) | `object_id` |
| `video_with_share` (视频+分享链接) | `id`, `object_id` | `video_with_comments` (视频+评论) | `id`, `object_id` |
| `video_with_share` (视频+分享链接) | `object_id` | `video_with_author` (视频+作者主页) | `object_id` |

> 🔀 = 跨文件链路 (cross-domain chain)；优先选 🔀 标记的下游 recipe，因为它能扩展 agent 已有的数据视图。

**典型 3 步用法**：
1. 用户语义 → 在 `_index.md` trigger_keywords 列匹配第 1 个 recipe
2. 执行第 1 个 recipe，得到 Output 字段
3. 在本表查 "已完成 Recipe" 列 → 选合适的下游 → 用 "接力字段" 直接传参，无需问用户重复输入

