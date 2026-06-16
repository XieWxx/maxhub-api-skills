# Recipe Index / 编排索引

> 本文件是编排层（Orchestration Layer）的索引。每个 Recipe 封装一个"用户目标"的多步链式调用。
> Agent 通过用户语义匹配 trigger_keywords，按名调用 Recipe，无需自行拼装链路。

## Recipe 分类索引

| recipe_id | display_name | trigger_keywords | steps | est_calls | file |
|-----------|-------------|-----------------|-------|-----------|------|
| post_with_comments | 看作品+评论 | "看作品评论" "帖子评论" "作品评论" | 2 | 2 | post.md |
| comments_with_replies | 看评论+回复 | "评论回复" "看回复" "评论详情" | 2 | 2 | post.md |
| post_full_thread | 看作品+评论+回复 | "完整讨论" "作品评论回复" | 3 | 3 | post.md |
| download_video | 下载作品视频 | "下载视频" "下载作品" "保存视频" | 2 | 2 | post.md |
| post_with_remix | 看作品+二创 | "二创" "Remix" "衍生作品" | 2 | 2 | post.md |
| post_with_author | 看作品+作者主页 | "看作者" "作品作者" "谁发的" | 2 | 2 | post.md |
| username_to_profile | 用户名→用户主页 | "搜用户" "找用户" "用户名查主页" | 2 | 2 | user.md |
| profile_with_posts | 用户资料+作品 | "用户作品" "主页作品" "ta的作品" | 2 | 2 | user.md |
| username_to_posts | 用户名→用户作品 | "搜用户作品" "找ta的作品" | 3 | 3 | user.md |
| user_social_circle | 看用户社交圈 | "关注粉丝" "社交关系" "社交圈" | 3 | 3 | user.md |
| user_with_cameo | 看用户Cameo出镜 | "Cameo" "出镜" "出镜记录" | 2 | 2 | user.md |
| text_to_video | 文生视频 | "生成视频" "文生视频" "创建视频" | 3 | 3 | tools.md |
| image_to_video | 图生视频 | "图生视频" "图片生成视频" "用图做视频" | 4 | 4 | tools.md |
| cameo_to_profile | 热榜→用户主页 | "Cameo热榜" "谁最火" "出镜排行" | 2 | 2 | tools.md |

### 字段说明
- **recipe_id**：Recipe 唯一标识
- **display_name**：中文名，便于 Agent 理解
- **trigger_keywords**：用户语义命中关键词（Agent 用来识别该 Recipe）
- **steps**：原子步骤数
- **est_calls**：预估 API 调用次数
- **file**：Recipe 详情所在文件
