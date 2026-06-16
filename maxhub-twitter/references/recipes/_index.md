# Recipe Index / 编排索引

> 本文件是编排层（Orchestration Layer）的索引。每个 Recipe 封装一个"用户目标"的多步链式调用。
> Agent 通过用户语义匹配 trigger_keywords，按名调用 Recipe，无需自行拼装链路。

## Recipe 分类索引

| recipe_id | display_name | trigger_keywords | steps | est_calls | file |
|-----------|-------------|-----------------|-------|-----------|------|
| tweet_with_comments | 推文+热门评论 | "推文评论" "看评论" "热门评论" | 2 | 2 | content.md |
| tweet_with_latest_comments | 推文+最新评论 | "最新评论" "最近的评论" | 2 | 2 | content.md |
| tweet_with_retweeters | 推文+转推用户 | "谁转推了" "转推列表" "谁转了" | 2 | 2 | content.md |
| search_to_tweet | 搜索→推文详情 | "搜推文" "搜到后看详情" | 2 | 2 | content.md |
| search_to_author | 搜索→看作者 | "搜推文看作者" "搜到后看主页" | 2 | 2 | content.md |
| trending_to_search | 趋势→搜索 | "热搜搜一下" "趋势话题" "热门话题搜索" | 2 | 2 | content.md |
| tweet_with_author | 推文+作者主页 | "推文作者" "谁发的" "看作者" | 2 | 2 | content.md |
| profile_with_tweets | 用户资料+推文 | "用户推文" "ta的推文" "主页推文" | 2 | 2 | user.md |
| profile_with_media | 用户资料+媒体 | "用户图片" "ta的图片" "用户视频" | 2 | 2 | user.md |
| profile_with_replies | 用户资料+回复 | "用户回复" "ta的回复" | 2 | 2 | user.md |
| user_social_circle | 用户社交圈 | "关注粉丝" "社交关系" "社交圈" | 3 | 3 | user.md |
| profile_with_highlights | 用户资料+高光推文 | "高光推文" "精选推文" "高光" | 2 | 2 | user.md |
| user_tweets_to_detail | 用户推文→推文详情 | "看某条推文详情" "推文详情" | 2 | 2 | user.md |
| search_user_to_profile | 搜索用户→用户主页 | "搜用户" "找用户" "搜索用户名" | 2 | 2 | user.md |

### 字段说明
- **recipe_id**：Recipe 唯一标识
- **display_name**：中文名，便于 Agent 理解
- **trigger_keywords**：用户语义命中关键词（Agent 用来识别该 Recipe）
- **steps**：原子步骤数
- **est_calls**：预估 API 调用次数
- **file**：Recipe 详情所在文件
