# Recipe Index / 编排索引

> 本文件是编排层（Orchestration Layer）的索引。每个 Recipe 封装一个"用户目标"的多步链式调用。
> Agent 通过用户语义匹配 trigger_keywords，按名调用 Recipe，无需自行拼装链路。

## Recipe 分类索引

| recipe_id | display_name | trigger_keywords | steps | est_calls | file |
|-----------|-------------|-----------------|-------|-----------|------|
| video_with_play | 看视频+播放 | "看视频播放" "播放视频" "视频流" | 2 | 2 | video.md |
| video_with_subtitle | 看视频+字幕 | "视频字幕" "看字幕" | 2 | 2 | video.md |
| video_with_parts | 看视频+分P | "分P" "多P" "第几P" | 2 | 2 | video.md |
| video_with_comments | 看视频+评论 | "视频评论" "看评论" | 2 | 2 | video.md |
| video_with_danmaku | 看视频+弹幕 | "弹幕" "看弹幕" | 2 | 2 | video.md |
| video_with_author | 看视频+作者 | "视频作者" "UP主" "谁发的" | 2 | 2 | video.md |
| bv2aid_then_detail | BV转AV取详情 | "BV转AV" "AV号" | 2 | 2 | video.md |
| url_video_play | URL取视频+播放 | "链接看视频" "URL播放" | 2 | 2 | video.md |
| vip_video_play | 大会员视频播放 | "大会员" "高清" "4K" | 2 | 2 | video.md |
| share_to_profile | 分享链接→用户主页 | "分享链接" "b23链接" "看主页" | 2 | 2 | user.md |
| profile_with_posts | 用户资料+投稿 | "用户投稿" "UP主视频" "ta的视频" | 2 | 2 | user.md |
| profile_with_stats | 用户资料+统计 | "UP主数据" "播放统计" "粉丝数" | 3 | 3 | user.md |
| profile_with_dynamic | 用户资料+动态 | "用户动态" "ta的动态" | 2 | 2 | user.md |
| dynamic_detail | 动态列表→详情 | "动态详情" "看动态" | 2 | 2 | user.md |
| search_to_video | 搜索→视频详情 | "搜视频" "找视频" | 2 | 2 | search.md |
| search_user | 搜索用户→主页 | "搜用户" "找UP主" | 2 | 2 | search.md |
| hot_search_video | 热搜→搜索视频 | "热搜" "热门搜索" | 2 | 2 | search.md |
| feed_to_video | 推荐→视频详情 | "推荐视频" "首页推荐" | 2 | 2 | search.md |
| comments_with_reply | 评论+回复 | "评论回复" "看回复" | 2 | 2 | comments.md |
| video_full_interact | 视频+评论+弹幕 | "视频互动" "评论弹幕" | 3 | 3 | comments.md |
| area_to_streamers | 分区→主播列表 | "直播分区" "看主播" | 2 | 2 | live.md |
| streamer_to_room | 主播→直播间 | "看直播间" "直播详情" | 2 | 2 | live.md |
| room_to_profile | 直播间→主播主页 | "主播资料" "直播UP主" | 2 | 2 | live.md |
| folders_with_videos | 收藏夹+夹内视频 | "收藏夹" "看收藏" | 2 | 2 | collections.md |

### 字段说明
- **recipe_id**：Recipe 唯一标识
- **display_name**：中文名，便于 Agent 理解
- **trigger_keywords**：用户语义命中关键词（Agent 用来识别该 Recipe）
- **steps**：原子步骤数
- **est_calls**：预估 API 调用次数
- **file**：Recipe 详情所在文件
