# Recipe Index / 编排索引

> 本文件是编排层（Orchestration Layer）的索引。每个 Recipe 封装一个"用户目标"的多步链式调用。
> Agent 通过用户语义匹配 trigger_keywords，按名调用 Recipe，无需自行拼装链路。

## Recipe 分类索引

| recipe_id | display_name | trigger_keywords | steps | est_calls | file |
|-----------|-------------|-----------------|-------|-----------|------|
| article_with_stats | 文章详情+互动数据 | "文章数据" "阅读量" "点赞数" | 2 | 2 | mp.md |
| article_with_comments | 文章+评论 | "文章评论" "看评论" | 2 | 2 | mp.md |
| comments_with_replies | 评论+回复 | "评论回复" "看回复" | 2 | 2 | mp.md |
| article_with_related | 文章+关联文章 | "关联文章" "相关文章" | 2 | 2 | mp.md |
| article_with_author | 文章+公众号主页 | "文章作者" "哪个号" "谁发的" | 2 | 2 | mp.md |
| mp_profile_articles | 公众号资料+文章列表 | "公众号文章" "历史文章" | 2 | 2 | mp.md |
| sph_to_info | sph短号→账号信息 | "sph" "短号" "视频号ID" | 2 | 2 | channels.md |
| video_with_comments | 视频+评论 | "视频评论" "看评论" | 2 | 2 | channels.md |
| video_with_author | 视频+作者主页 | "视频作者" "谁发的" | 2 | 2 | channels.md |
| video_with_share | 视频+分享链接 | "分享视频" "分享链接" | 2 | 2 | channels.md |
| profile_with_collections | 主页+合集 | "合集" "视频合集" | 2 | 2 | channels.md |
| collection_with_videos | 合集+合集内视频 | "合集视频" "合集内容" | 2 | 2 | channels.md |
| profile_with_lives | 主页+直播回放 | "直播回放" "历史直播" | 2 | 2 | channels.md |
| search_to_mp | 搜公众号→看资料 | "搜公众号" "找公众号" | 2 | 2 | search.md |
| search_to_articles | 搜公众号→看文章 | "搜文章列表" "公众号文章" | 2 | 2 | search.md |
| search_to_video | 搜视频→下载 | "搜视频下载" "找视频号视频" | 2 | 2 | search.md |
| search_to_live | 搜直播→看详情 | "搜直播" "找直播" | 2 | 2 | search.md |

### 字段说明
- **recipe_id**：Recipe 唯一标识
- **display_name**：中文名，便于 Agent 理解
- **trigger_keywords**：用户语义命中关键词（Agent 用来识别该 Recipe）
- **steps**：原子步骤数
- **est_calls**：预估 API 调用次数
- **file**：Recipe 详情所在文件
