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
| video_with_play | 看视频+播放 | "看视频播放" "播放视频" "视频流" | 2 | 2 | recipes/video.md |
| video_with_subtitle | 看视频+字幕 | "视频字幕" "看字幕" | 2 | 2 | recipes/video.md |
| video_with_parts | 看视频+分P | "分P" "多P" "第几P" | 2 | 2 | recipes/video.md |
| video_with_comments | 看视频+评论 | "视频评论" "看评论" | 2 | 2 | recipes/video.md |
| video_with_danmaku | 看视频+弹幕 | "看弹幕" | 2 | 2 | recipes/video.md |
| video_with_author | 看视频+作者 | "视频作者" "谁发的" | 2 | 2 | recipes/video.md |
| bv2aid_then_detail | BV转AV取详情 | "BV转AV" "AV号" | 2 | 2 | recipes/video.md |
| url_video_play | URL取视频+播放 | "链接看视频" "URL播放" | 2 | 2 | recipes/video.md |
| vip_video_play | 大会员视频播放 | "大会员" "高清" "4K" | 2 | 2 | recipes/video.md |
| share_to_profile | 分享链接→用户主页 | "分享链接" "b23链接" "看主页" | 2 | 2 | recipes/user.md |
| profile_with_posts | 用户资料+投稿 | "用户投稿" "UP主视频" "ta的视频" | 2 | 2 | recipes/user.md |
| profile_with_stats | 用户资料+统计 | "UP主数据" "播放统计" "粉丝数" | 3 | 3 | recipes/user.md |
| profile_with_dynamic | 用户资料+动态 | "用户动态" "ta的动态" | 2 | 2 | recipes/user.md |
| dynamic_detail | 动态列表→详情 | "动态详情" "看动态" | 2 | 2 | recipes/user.md |
| search_to_video | 搜索→视频详情 | "搜视频" "找视频" | 2 | 2 | recipes/search.md |
| search_user | 搜索用户→主页 | "搜用户" "找UP主" | 2 | 2 | recipes/search.md |
| hot_search_video | 热搜→搜索视频 | "热门搜索" | 2 | 2 | recipes/search.md |
| feed_to_video | 推荐→视频详情 | "推荐视频" "首页推荐" | 2 | 2 | recipes/search.md |
| comments_with_reply | 评论+回复 | "评论回复" "看回复" | 2 | 2 | recipes/comments.md |
| video_full_interact | 视频+评论+弹幕 | "视频互动" "评论弹幕" | 3 | 3 | recipes/comments.md |
| area_to_streamers | 分区→主播列表 | "直播分区" "看主播" | 2 | 2 | recipes/live.md |
| streamer_to_room | 主播→直播间 | "看直播间" "直播详情" | 2 | 2 | recipes/live.md |
| room_to_profile | 直播间→主播主页 | "主播资料" "直播UP主" | 2 | 2 | recipes/live.md |
| folders_with_videos | 收藏夹+夹内视频 | "收藏夹" "看收藏" | 2 | 2 | recipes/collections.md |

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
| `area_to_streamers` (分区→主播列表) | `id` | 🔀 `folders_with_videos` (收藏夹+夹内视频) | `id` |
| `area_to_streamers` (分区→主播列表) | `area_id` | `streamer_to_room` (主播→直播间) | `area_id` |
| `bv2aid_then_detail` (BV转AV取详情) | `aid` | `video_with_subtitle` (看视频+字幕) | `aid` |
| `comments_with_reply` (评论+回复) | `replies` | 🔀 `video_with_comments` (看视频+评论) | `replies` |
| `dynamic_detail` (动态列表→详情) | `cards` | `profile_with_dynamic` (用户资料+动态) | `cards` |
| `feed_to_video` (推荐→视频详情) | `bv_id`, `bvid` | 🔀 `video_full_interact` (视频+评论+弹幕) | `bv_id`, `bvid` |
| `feed_to_video` (推荐→视频详情) | `bv_id`, `bvid` | 🔀 `video_with_play` (看视频+播放) | `bv_id`, `bvid` |
| `feed_to_video` (推荐→视频详情) | `bv_id`, `bvid` | 🔀 `video_with_parts` (看视频+分P) | `bv_id`, `bvid` |
| `feed_to_video` (推荐→视频详情) | `bv_id`, `bvid` | 🔀 `video_with_comments` (看视频+评论) | `bv_id`, `bvid` |
| `feed_to_video` (推荐→视频详情) | `bv_id`, `bvid` | 🔀 `vip_video_play` (大会员视频播放) | `bv_id`, `bvid` |
| `folders_with_videos` (收藏夹+夹内视频) | `id`, `list` | 🔀 `area_to_streamers` (分区→主播列表) | `id`, `list` |
| `profile_with_dynamic` (用户资料+动态) | `uid` | 🔀 `room_to_profile` (直播间→主播主页) | `uid` |
| `profile_with_dynamic` (用户资料+动态) | `uid` | 🔀 `folders_with_videos` (收藏夹+夹内视频) | `uid` |
| `profile_with_dynamic` (用户资料+动态) | `uid` | `share_to_profile` (分享链接→用户主页) | `uid` |
| `profile_with_dynamic` (用户资料+动态) | `uid` | `profile_with_posts` (用户资料+投稿) | `uid` |
| `profile_with_dynamic` (用户资料+动态) | `uid` | `profile_with_stats` (用户资料+统计) | `uid` |
| `profile_with_posts` (用户资料+投稿) | `list` | 🔀 `area_to_streamers` (分区→主播列表) | `list` |
| `profile_with_posts` (用户资料+投稿) | `uid` | 🔀 `room_to_profile` (直播间→主播主页) | `uid` |
| `profile_with_posts` (用户资料+投稿) | `uid` | 🔀 `folders_with_videos` (收藏夹+夹内视频) | `uid` |
| `profile_with_posts` (用户资料+投稿) | `uid` | `share_to_profile` (分享链接→用户主页) | `uid` |
| `profile_with_posts` (用户资料+投稿) | `uid` | `profile_with_stats` (用户资料+统计) | `uid` |
| `profile_with_stats` (用户资料+统计) | `uid` | 🔀 `room_to_profile` (直播间→主播主页) | `uid` |
| `profile_with_stats` (用户资料+统计) | `uid` | 🔀 `folders_with_videos` (收藏夹+夹内视频) | `uid` |
| `profile_with_stats` (用户资料+统计) | `uid` | `share_to_profile` (分享链接→用户主页) | `uid` |
| `profile_with_stats` (用户资料+统计) | `uid` | `profile_with_posts` (用户资料+投稿) | `uid` |
| `profile_with_stats` (用户资料+统计) | `uid` | `profile_with_dynamic` (用户资料+动态) | `uid` |
| `room_to_profile` (直播间→主播主页) | `uid` | 🔀 `share_to_profile` (分享链接→用户主页) | `uid` |
| `room_to_profile` (直播间→主播主页) | `uid` | 🔀 `profile_with_posts` (用户资料+投稿) | `uid` |
| `room_to_profile` (直播间→主播主页) | `uid` | 🔀 `profile_with_stats` (用户资料+统计) | `uid` |
| `room_to_profile` (直播间→主播主页) | `uid` | 🔀 `profile_with_dynamic` (用户资料+动态) | `uid` |
| `room_to_profile` (直播间→主播主页) | `uid` | 🔀 `dynamic_detail` (动态列表→详情) | `uid` |
| `search_to_video` (搜索→视频详情) | `bv_id`, `bvid` | 🔀 `video_full_interact` (视频+评论+弹幕) | `bv_id`, `bvid` |
| `search_to_video` (搜索→视频详情) | `bv_id`, `bvid` | 🔀 `video_with_play` (看视频+播放) | `bv_id`, `bvid` |
| `search_to_video` (搜索→视频详情) | `bv_id`, `bvid` | 🔀 `video_with_parts` (看视频+分P) | `bv_id`, `bvid` |
| `search_to_video` (搜索→视频详情) | `bv_id`, `bvid` | 🔀 `video_with_comments` (看视频+评论) | `bv_id`, `bvid` |
| `search_to_video` (搜索→视频详情) | `bv_id`, `bvid` | 🔀 `vip_video_play` (大会员视频播放) | `bv_id`, `bvid` |
| `search_user` (搜索用户→主页) | `uid` | 🔀 `share_to_profile` (分享链接→用户主页) | `uid` |
| `search_user` (搜索用户→主页) | `uid` | 🔀 `profile_with_posts` (用户资料+投稿) | `uid` |
| `search_user` (搜索用户→主页) | `uid` | 🔀 `profile_with_stats` (用户资料+统计) | `uid` |
| `search_user` (搜索用户→主页) | `uid` | 🔀 `profile_with_dynamic` (用户资料+动态) | `uid` |
| `search_user` (搜索用户→主页) | `uid` | 🔀 `dynamic_detail` (动态列表→详情) | `uid` |
| `share_to_profile` (分享链接→用户主页) | `uid` | 🔀 `room_to_profile` (直播间→主播主页) | `uid` |
| `share_to_profile` (分享链接→用户主页) | `uid` | 🔀 `folders_with_videos` (收藏夹+夹内视频) | `uid` |
| `share_to_profile` (分享链接→用户主页) | `uid` | `profile_with_posts` (用户资料+投稿) | `uid` |
| `share_to_profile` (分享链接→用户主页) | `uid` | `profile_with_stats` (用户资料+统计) | `uid` |
| `share_to_profile` (分享链接→用户主页) | `uid` | `profile_with_dynamic` (用户资料+动态) | `uid` |
| `streamer_to_room` (主播→直播间) | `list` | `area_to_streamers` (分区→主播列表) | `list` |
| `streamer_to_room` (主播→直播间) | `room_id` | `room_to_profile` (直播间→主播主页) | `room_id` |
| `url_video_play` (URL取视频+播放) | `bv_id`, `bvid`, `cid` | 🔀 `video_full_interact` (视频+评论+弹幕) | `bv_id`, `bvid`, `cid` |
| `url_video_play` (URL取视频+播放) | `bv_id` | 🔀 `comments_with_reply` (评论+回复) | `bv_id` |
| `url_video_play` (URL取视频+播放) | `bvid` | 🔀 `search_to_video` (搜索→视频详情) | `bvid` |
| `url_video_play` (URL取视频+播放) | `bvid` | 🔀 `feed_to_video` (推荐→视频详情) | `bvid` |
| `url_video_play` (URL取视频+播放) | `bv_id`, `bvid`, `cid` | `video_with_play` (看视频+播放) | `bv_id`, `bvid`, `cid` |
| `video_full_interact` (视频+评论+弹幕) | `bv_id`, `bvid`, `cid` | 🔀 `vip_video_play` (大会员视频播放) | `bv_id`, `bvid`, `cid` |
| `video_full_interact` (视频+评论+弹幕) | `bv_id`, `bvid`, `cid` | 🔀 `video_with_play` (看视频+播放) | `bv_id`, `bvid`, `cid` |
| `video_full_interact` (视频+评论+弹幕) | `bv_id`, `cid` | 🔀 `video_with_subtitle` (看视频+字幕) | `bv_id`, `cid` |
| `video_full_interact` (视频+评论+弹幕) | `bv_id`, `bvid` | 🔀 `video_with_parts` (看视频+分P) | `bv_id`, `bvid` |
| `video_full_interact` (视频+评论+弹幕) | `bv_id`, `bvid` | 🔀 `video_with_comments` (看视频+评论) | `bv_id`, `bvid` |
| `video_with_author` (看视频+作者) | `uid` | 🔀 `share_to_profile` (分享链接→用户主页) | `uid` |
| `video_with_author` (看视频+作者) | `uid` | 🔀 `profile_with_posts` (用户资料+投稿) | `uid` |
| `video_with_author` (看视频+作者) | `uid` | 🔀 `profile_with_stats` (用户资料+统计) | `uid` |
| `video_with_author` (看视频+作者) | `uid` | 🔀 `profile_with_dynamic` (用户资料+动态) | `uid` |
| `video_with_author` (看视频+作者) | `uid` | 🔀 `dynamic_detail` (动态列表→详情) | `uid` |
| `video_with_comments` (看视频+评论) | `bv_id`, `bvid` | 🔀 `video_full_interact` (视频+评论+弹幕) | `bv_id`, `bvid` |
| `video_with_comments` (看视频+评论) | `bv_id` | 🔀 `comments_with_reply` (评论+回复) | `bv_id` |
| `video_with_comments` (看视频+评论) | `bvid` | 🔀 `search_to_video` (搜索→视频详情) | `bvid` |
| `video_with_comments` (看视频+评论) | `bvid` | 🔀 `feed_to_video` (推荐→视频详情) | `bvid` |
| `video_with_comments` (看视频+评论) | `bv_id`, `bvid` | `video_with_play` (看视频+播放) | `bv_id`, `bvid` |
| `video_with_danmaku` (看视频+弹幕) | `cid` | 🔀 `video_full_interact` (视频+评论+弹幕) | `cid` |
| `video_with_danmaku` (看视频+弹幕) | `cid` | `video_with_play` (看视频+播放) | `cid` |
| `video_with_danmaku` (看视频+弹幕) | `cid` | `video_with_subtitle` (看视频+字幕) | `cid` |
| `video_with_danmaku` (看视频+弹幕) | `cid` | `url_video_play` (URL取视频+播放) | `cid` |
| `video_with_danmaku` (看视频+弹幕) | `cid` | `vip_video_play` (大会员视频播放) | `cid` |
| `video_with_parts` (看视频+分P) | `bv_id`, `bvid` | 🔀 `video_full_interact` (视频+评论+弹幕) | `bv_id`, `bvid` |
| `video_with_parts` (看视频+分P) | `bv_id` | 🔀 `comments_with_reply` (评论+回复) | `bv_id` |
| `video_with_parts` (看视频+分P) | `bvid` | 🔀 `search_to_video` (搜索→视频详情) | `bvid` |
| `video_with_parts` (看视频+分P) | `bvid` | 🔀 `feed_to_video` (推荐→视频详情) | `bvid` |
| `video_with_parts` (看视频+分P) | `bv_id`, `bvid` | `video_with_play` (看视频+播放) | `bv_id`, `bvid` |
| `video_with_play` (看视频+播放) | `bv_id`, `bvid`, `cid` | 🔀 `video_full_interact` (视频+评论+弹幕) | `bv_id`, `bvid`, `cid` |
| `video_with_play` (看视频+播放) | `bv_id` | 🔀 `comments_with_reply` (评论+回复) | `bv_id` |
| `video_with_play` (看视频+播放) | `bvid` | 🔀 `search_to_video` (搜索→视频详情) | `bvid` |
| `video_with_play` (看视频+播放) | `bvid` | 🔀 `feed_to_video` (推荐→视频详情) | `bvid` |
| `video_with_play` (看视频+播放) | `bv_id`, `bvid`, `cid` | `vip_video_play` (大会员视频播放) | `bv_id`, `bvid`, `cid` |
| `video_with_subtitle` (看视频+字幕) | `cid` | 🔀 `video_full_interact` (视频+评论+弹幕) | `cid` |
| `video_with_subtitle` (看视频+字幕) | `cid` | `video_with_play` (看视频+播放) | `cid` |
| `video_with_subtitle` (看视频+字幕) | `cid` | `url_video_play` (URL取视频+播放) | `cid` |
| `video_with_subtitle` (看视频+字幕) | `cid` | `vip_video_play` (大会员视频播放) | `cid` |
| `video_with_subtitle` (看视频+字幕) | `cid` | `video_with_danmaku` (看视频+弹幕) | `cid` |
| `vip_video_play` (大会员视频播放) | `bv_id`, `bvid`, `cid` | 🔀 `video_full_interact` (视频+评论+弹幕) | `bv_id`, `bvid`, `cid` |
| `vip_video_play` (大会员视频播放) | `bv_id` | 🔀 `comments_with_reply` (评论+回复) | `bv_id` |
| `vip_video_play` (大会员视频播放) | `bvid` | 🔀 `search_to_video` (搜索→视频详情) | `bvid` |
| `vip_video_play` (大会员视频播放) | `bvid` | 🔀 `feed_to_video` (推荐→视频详情) | `bvid` |
| `vip_video_play` (大会员视频播放) | `bv_id`, `bvid`, `cid` | `video_with_play` (看视频+播放) | `bv_id`, `bvid`, `cid` |

> 🔀 = 跨文件链路 (cross-domain chain)；优先选 🔀 标记的下游 recipe，因为它能扩展 agent 已有的数据视图。

**典型 3 步用法**：
1. 用户语义 → 在 `_index.md` trigger_keywords 列匹配第 1 个 recipe
2. 执行第 1 个 recipe，得到 Output 字段
3. 在本表查 "已完成 Recipe" 列 → 选合适的下游 → 用 "接力字段" 直接传参，无需问用户重复输入

