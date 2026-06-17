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
| tweet_with_comments | 推文+热门评论 | "推文评论" "看评论" "热门评论" | 2 | 2 | recipes/content.md |
| tweet_with_latest_comments | 推文+最新评论 | "最新评论" "最近的评论" | 2 | 2 | recipes/content.md |
| tweet_with_retweeters | 推文+转推用户 | "谁转推了" "转推列表" "谁转了" | 2 | 2 | recipes/content.md |
| search_to_tweet | 搜索→推文详情 | "搜推文" "搜到后看详情" | 2 | 2 | recipes/content.md |
| search_to_author | 搜索→看作者 | "搜推文看作者" "搜到后看主页" | 2 | 2 | recipes/content.md |
| trending_to_search | 趋势→搜索 | "热搜搜一下" "趋势话题" "热门话题搜索" | 2 | 2 | recipes/content.md |
| tweet_with_author | 推文+作者主页 | "推文作者" "谁发的" "看作者" | 2 | 2 | recipes/content.md |
| profile_with_tweets | 用户资料+推文 | "用户推文" "ta的推文" "主页推文" | 2 | 2 | recipes/user.md |
| profile_with_media | 用户资料+媒体 | "用户图片" "ta的图片" "用户视频" | 2 | 2 | recipes/user.md |
| profile_with_replies | 用户资料+回复 | "用户回复" "ta的回复" | 2 | 2 | recipes/user.md |
| user_social_circle | 用户社交圈 | "关注粉丝" "社交关系" "社交圈" | 3 | 3 | recipes/user.md |
| profile_with_highlights | 用户资料+高光推文 | "高光推文" "精选推文" "高光" | 2 | 2 | recipes/user.md |
| user_tweets_to_detail | 用户推文→推文详情 | "看某条推文详情" "推文详情" | 2 | 2 | recipes/user.md |
| search_user_to_profile | 搜索用户→用户主页 | "搜用户" "找用户" "搜索用户名" | 2 | 2 | recipes/user.md |

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
| `profile_with_media` (用户资料+媒体) | `screen_name` | 🔀 `search_to_author` (搜索→看作者) | `screen_name` |
| `profile_with_media` (用户资料+媒体) | `screen_name` | 🔀 `tweet_with_author` (推文+作者主页) | `screen_name` |
| `profile_with_media` (用户资料+媒体) | `screen_name` | `profile_with_highlights` (用户资料+高光推文) | `screen_name` |
| `profile_with_media` (用户资料+媒体) | `screen_name` | `user_tweets_to_detail` (用户推文→推文详情) | `screen_name` |
| `profile_with_media` (用户资料+媒体) | `screen_name` | `search_user_to_profile` (搜索用户→用户主页) | `screen_name` |
| `profile_with_replies` (用户资料+回复) | `screen_name` | 🔀 `search_to_author` (搜索→看作者) | `screen_name` |
| `profile_with_replies` (用户资料+回复) | `screen_name` | 🔀 `tweet_with_author` (推文+作者主页) | `screen_name` |
| `profile_with_replies` (用户资料+回复) | `screen_name` | `profile_with_highlights` (用户资料+高光推文) | `screen_name` |
| `profile_with_replies` (用户资料+回复) | `screen_name` | `user_tweets_to_detail` (用户推文→推文详情) | `screen_name` |
| `profile_with_replies` (用户资料+回复) | `screen_name` | `search_user_to_profile` (搜索用户→用户主页) | `screen_name` |
| `profile_with_tweets` (用户资料+推文) | `screen_name` | 🔀 `search_to_author` (搜索→看作者) | `screen_name` |
| `profile_with_tweets` (用户资料+推文) | `screen_name` | 🔀 `tweet_with_author` (推文+作者主页) | `screen_name` |
| `profile_with_tweets` (用户资料+推文) | `screen_name` | `profile_with_highlights` (用户资料+高光推文) | `screen_name` |
| `profile_with_tweets` (用户资料+推文) | `screen_name` | `user_tweets_to_detail` (用户推文→推文详情) | `screen_name` |
| `profile_with_tweets` (用户资料+推文) | `screen_name` | `search_user_to_profile` (搜索用户→用户主页) | `screen_name` |
| `search_to_author` (搜索→看作者) | `screen_name` | 🔀 `profile_with_highlights` (用户资料+高光推文) | `screen_name` |
| `search_to_author` (搜索→看作者) | `screen_name` | 🔀 `user_tweets_to_detail` (用户推文→推文详情) | `screen_name` |
| `search_to_author` (搜索→看作者) | `screen_name` | 🔀 `profile_with_tweets` (用户资料+推文) | `screen_name` |
| `search_to_author` (搜索→看作者) | `screen_name` | 🔀 `profile_with_media` (用户资料+媒体) | `screen_name` |
| `search_to_author` (搜索→看作者) | `screen_name` | 🔀 `profile_with_replies` (用户资料+回复) | `screen_name` |
| `search_to_tweet` (搜索→推文详情) | `tweet_id` | 🔀 `user_tweets_to_detail` (用户推文→推文详情) | `tweet_id` |
| `search_to_tweet` (搜索→推文详情) | `tweet_id` | `tweet_with_author` (推文+作者主页) | `tweet_id` |
| `search_to_tweet` (搜索→推文详情) | `tweet_id` | `tweet_with_comments` (推文+热门评论) | `tweet_id` |
| `search_to_tweet` (搜索→推文详情) | `tweet_id` | `tweet_with_latest_comments` (推文+最新评论) | `tweet_id` |
| `search_to_tweet` (搜索→推文详情) | `tweet_id` | `tweet_with_retweeters` (推文+转推用户) | `tweet_id` |
| `search_user_to_profile` (搜索用户→用户主页) | `screen_name` | 🔀 `tweet_with_author` (推文+作者主页) | `screen_name` |
| `search_user_to_profile` (搜索用户→用户主页) | `screen_name` | 🔀 `search_to_author` (搜索→看作者) | `screen_name` |
| `search_user_to_profile` (搜索用户→用户主页) | `screen_name` | `profile_with_highlights` (用户资料+高光推文) | `screen_name` |
| `search_user_to_profile` (搜索用户→用户主页) | `screen_name` | `user_tweets_to_detail` (用户推文→推文详情) | `screen_name` |
| `search_user_to_profile` (搜索用户→用户主页) | `screen_name` | `profile_with_tweets` (用户资料+推文) | `screen_name` |
| `tweet_with_author` (推文+作者主页) | `screen_name` | 🔀 `profile_with_highlights` (用户资料+高光推文) | `screen_name` |
| `tweet_with_author` (推文+作者主页) | `screen_name` | 🔀 `search_user_to_profile` (搜索用户→用户主页) | `screen_name` |
| `tweet_with_author` (推文+作者主页) | `screen_name` | 🔀 `profile_with_tweets` (用户资料+推文) | `screen_name` |
| `tweet_with_author` (推文+作者主页) | `screen_name` | 🔀 `profile_with_media` (用户资料+媒体) | `screen_name` |
| `tweet_with_author` (推文+作者主页) | `screen_name` | 🔀 `profile_with_replies` (用户资料+回复) | `screen_name` |
| `tweet_with_comments` (推文+热门评论) | `tweet_id` | 🔀 `user_tweets_to_detail` (用户推文→推文详情) | `tweet_id` |
| `tweet_with_comments` (推文+热门评论) | `tweet_id` | `search_to_tweet` (搜索→推文详情) | `tweet_id` |
| `tweet_with_comments` (推文+热门评论) | `tweet_id` | `tweet_with_author` (推文+作者主页) | `tweet_id` |
| `tweet_with_comments` (推文+热门评论) | `tweet_id` | `tweet_with_latest_comments` (推文+最新评论) | `tweet_id` |
| `tweet_with_comments` (推文+热门评论) | `tweet_id` | `tweet_with_retweeters` (推文+转推用户) | `tweet_id` |
| `tweet_with_latest_comments` (推文+最新评论) | `tweet_id` | 🔀 `user_tweets_to_detail` (用户推文→推文详情) | `tweet_id` |
| `tweet_with_latest_comments` (推文+最新评论) | `tweet_id` | `search_to_tweet` (搜索→推文详情) | `tweet_id` |
| `tweet_with_latest_comments` (推文+最新评论) | `tweet_id` | `tweet_with_author` (推文+作者主页) | `tweet_id` |
| `tweet_with_latest_comments` (推文+最新评论) | `tweet_id` | `tweet_with_comments` (推文+热门评论) | `tweet_id` |
| `tweet_with_latest_comments` (推文+最新评论) | `tweet_id` | `tweet_with_retweeters` (推文+转推用户) | `tweet_id` |
| `tweet_with_retweeters` (推文+转推用户) | `tweet_id` | 🔀 `user_tweets_to_detail` (用户推文→推文详情) | `tweet_id` |
| `tweet_with_retweeters` (推文+转推用户) | `tweet_id` | `search_to_tweet` (搜索→推文详情) | `tweet_id` |
| `tweet_with_retweeters` (推文+转推用户) | `tweet_id` | `tweet_with_author` (推文+作者主页) | `tweet_id` |
| `tweet_with_retweeters` (推文+转推用户) | `tweet_id` | `tweet_with_comments` (推文+热门评论) | `tweet_id` |
| `tweet_with_retweeters` (推文+转推用户) | `tweet_id` | `tweet_with_latest_comments` (推文+最新评论) | `tweet_id` |
| `user_social_circle` (用户社交圈) | `screen_name` | 🔀 `search_to_author` (搜索→看作者) | `screen_name` |
| `user_social_circle` (用户社交圈) | `screen_name` | 🔀 `tweet_with_author` (推文+作者主页) | `screen_name` |
| `user_social_circle` (用户社交圈) | `screen_name` | `profile_with_highlights` (用户资料+高光推文) | `screen_name` |
| `user_social_circle` (用户社交圈) | `screen_name` | `user_tweets_to_detail` (用户推文→推文详情) | `screen_name` |
| `user_social_circle` (用户社交圈) | `screen_name` | `search_user_to_profile` (搜索用户→用户主页) | `screen_name` |
| `user_tweets_to_detail` (用户推文→推文详情) | `tweet_id` | 🔀 `search_to_tweet` (搜索→推文详情) | `tweet_id` |
| `user_tweets_to_detail` (用户推文→推文详情) | `tweet_id` | 🔀 `tweet_with_comments` (推文+热门评论) | `tweet_id` |
| `user_tweets_to_detail` (用户推文→推文详情) | `tweet_id` | 🔀 `tweet_with_latest_comments` (推文+最新评论) | `tweet_id` |
| `user_tweets_to_detail` (用户推文→推文详情) | `tweet_id` | 🔀 `tweet_with_retweeters` (推文+转推用户) | `tweet_id` |
| `user_tweets_to_detail` (用户推文→推文详情) | `tweet_id` | 🔀 `tweet_with_author` (推文+作者主页) | `tweet_id` |

> 🔀 = 跨文件链路 (cross-domain chain)；优先选 🔀 标记的下游 recipe，因为它能扩展 agent 已有的数据视图。

**典型 3 步用法**：
1. 用户语义 → 在 `_index.md` trigger_keywords 列匹配第 1 个 recipe
2. 执行第 1 个 recipe，得到 Output 字段
3. 在本表查 "已完成 Recipe" 列 → 选合适的下游 → 用 "接力字段" 直接传参，无需问用户重复输入

