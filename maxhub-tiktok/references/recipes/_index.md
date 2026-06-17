# Recipe Index / 编排索引


> 🎯 **Trigger 匹配规则（agent 必读）**：
> 1. **最长匹配优先**：用户输入同时命中多个 recipe 时，选 trigger 短语**最长**（最具体）的那个
> 2. **平局询问**：trigger 长度相同时，反问用户消歧后再调用
> 3. **跨域链路**：用户目标跨多个 recipe（如"先搜索再看评论"）→ 串行调用多个 recipe，**不要**自行拆解 atom


> 本文件是编排层（Orchestration Layer）的索引。Recipe 封装用户目标的多步链式调用，Agent 按 recipe_id 快速定位链路，无需全文读取 reference 详情。

## 编排映射表

| recipe_id | 用户目标 | 域 | 步数 | 详情文件 | trigger_keywords |
|-----------|---------|-----|------|---------|-----------------|
| video_comments | 看视频+评论 | 视频→评论 | 2 | recipes/video.md | "视频评论" "看评论" |
| video_author | 看视频+作者主页 | 视频→用户 | 2 | recipes/video.md | "视频作者" "作者主页" |
| share_to_video | 分享链接→视频详情 | 视频 | 2 | recipes/video.md | "分享链接" "解析链接" |
| url_to_video | URL→aweme_id→视频详情 | 视频 | 2 | recipes/video.md | "提取视频ID" "视频链接" |
| video_analytics | 看视频+分析 | 视频→分析 | 2 | recipes/video.md | "视频分析" "视频统计" |
| explore_to_video | 探索页→视频详情 | 视频 | 2 | recipes/video.md | "探索视频" "发现视频" |
| tag_to_video | Tag→视频详情 | 视频 | 2 | recipes/video.md | "标签视频" "Tag视频" |
| username_to_profile | 用户名→用户资料 | 用户 | 2 | recipes/user.md | "用户名查用户" "用户资料" |
| username_to_posts | 用户名→用户作品 | 用户 | 2 | recipes/user.md | "用户作品" "用户视频" |
| username_to_followers | 用户名→粉丝/关注 | 用户 | 2 | recipes/user.md | "用户粉丝" "用户关注" |
| url_to_user | URL→用户资料 | 用户 | 2 | recipes/user.md | "链接提取用户" "解析链接" |
| url_to_user_posts | URL→用户作品 | 用户 | 2 | recipes/user.md | "URL 用户作品" |
| user_creator_info | 用户资料→创作者信息 | 用户 | 2 | recipes/user.md | "创作者信息" "带货" |
| creator_showcase | 创作者信息→橱窗商品 | 用户 | 2 | recipes/user.md | "橱窗商品" "带货商品" |
| user_live_detail | 用户资料→直播详情 | 用户 | 2 | recipes/user.md | "用户直播" "直播详情" |
| user_posts_to_video | 用户作品→视频详情 | 用户→视频 | 2 | recipes/user.md | "用户作品 视频详情" |
| user_similar | 用户资料→类似推荐 | 用户 | 2 | recipes/user.md | "类似用户" "推荐用户" |
| search_video_detail | 搜索视频→看详情 | 搜索→视频 | 2 | recipes/search.md | "搜视频" "搜索视频" |
| search_user_profile | 搜索用户→看主页 | 搜索→用户 | 2 | recipes/search.md | "搜用户" "搜索用户" |
| hashtag_search_videos | 话题搜索→话题详情→视频 | 搜索 | 3 | recipes/search.md | "搜话题" "话题视频" |
| music_search_videos | 音乐搜索→音乐详情→视频 | 搜索 | 3 | recipes/search.md | "搜音乐" "音乐视频" |
| insights_detail | 搜索洞察→详情/趋势 | 搜索 | 2 | recipes/search.md | "搜索洞察" "创作者洞察" |
| live_recommend_tabs | 直播推荐标签→推荐 | 搜索 | 2 | recipes/search.md | "直播推荐" "直播标签" |
| web_search_paging | Web搜索翻页 | 搜索 | 1 | recipes/search.md | "搜索翻页" "Web搜索" |
| comments_replies | 看视频评论+回复 | 评论 | 2 | recipes/comments.md | "评论回复" "看回复" |
| live_link_info | 直播链接→直播信息 | 直播 | 2 | recipes/comments.md | "直播链接" "直播信息" |
| live_ranking | 直播信息→排行榜 | 直播 | 2 | recipes/comments.md | "直播排行" "送礼排行" |
| live_products | 直播信息→商品列表 | 直播 | 2 | recipes/comments.md | "直播商品" "直播间商品" |
| batch_live_online | 批量检测直播在线 | 直播 | 2 | recipes/comments.md | "批量直播" "在线检测" |
| video_to_comments | 视频→评论 | 视频→评论 | 2 | recipes/comments.md | "视频 评论" |
| live_danmaku | 直播间→弹幕 | 直播 | 2 | recipes/comments.md | "直播弹幕" "直播互动" |
| gift_name | 礼物列表→礼物名称 | 直播 | 2 | recipes/comments.md | "礼物名称" "礼物查询" |
| video_metrics | 视频详情→视频统计 | 分析 | 2 | recipes/analytics.md | "视频统计" "播放量" |
| fake_views_detect | 视频统计→虚假流量检测 | 分析 | 2 | recipes/analytics.md | "虚假流量" "刷量检测" |
| video_comment_keywords | 视频详情→评论关键词 | 分析 | 2 | recipes/analytics.md | "评论关键词" "词云" |
| creator_milestones | 用户详情→创作者里程碑 | 分析 | 2 | recipes/analytics.md | "创作者里程碑" "成长数据" |
| cross_verify_metrics | 虚假流量检测→视频统计交叉验证 | 分析 | 2 | recipes/analytics.md | "交叉验证" "数据验证" |
| comment_keywords_to_replies | 评论关键词→评论列表 | 分析→评论 | 2 | recipes/analytics.md | "关键词评论" "评论回复" |
| account_health_violations | 账号信息→账号健康→违规记录 | 创作者 | 3 | recipes/creator.md | "账号健康" "违规记录" |
| account_insights_live | 账号信息→收益概览→直播概览 | 创作者 | 3 | recipes/creator.md | "收益概览" "直播数据" |
| account_video_analytics | 账号信息→视频概览→视频列表 | 创作者 | 3 | recipes/creator.md | "视频分析" "视频列表" |
| video_product_stats | 视频列表→视频关联商品 | 创作者 | 2 | recipes/creator.md | "视频商品" "带货数据" |
| product_related_videos | 商品→关联视频 | 创作者 | 2 | recipes/creator.md | "商品视频" "关联视频" |
| ad_search_detail | 广告搜索→广告详情 | 广告 | 2 | recipes/ads.md | "广告详情" "搜广告" |
| ad_search_keyframe | 广告搜索→关键帧分析 | 广告 | 2 | recipes/ads.md | "广告关键帧" "留存分析" |
| ad_search_percentile | 广告搜索→百分位分析 | 广告 | 2 | recipes/ads.md | "广告百分位" "排名分析" |
| ad_search_interactive | 广告搜索→互动分析 | 广告 | 2 | recipes/ads.md | "广告互动" "互动分析" |
| ad_detail_recommend | 广告详情→推荐广告 | 广告 | 2 | recipes/ads.md | "推荐广告" "相似广告" |
| shop_search_detail | 搜索商品→商品详情 | 电商 | 2 | recipes/shop.md | "搜商品" "商品详情" |
| shop_suggest_search | 搜索建议→搜索商品 | 电商 | 2 | recipes/shop.md | "搜索建议 搜索商品" |
| shop_detail_reviews | 商品详情→商品评论 | 电商 | 2 | recipes/shop.md | "商品评论" "商品评价" |
| shop_detail_seller | 商品详情→商家商品列表 | 电商 | 2 | recipes/shop.md | "商家商品" "店铺商品" |
| fingerprint_msToken | 指纹→加密strData→msToken | 工具 | 3 | recipes/tools.md | "msToken生成" "指纹生成" |


## 🔗 Recipe 串联图谱 (Chain Graph)

> 当 agent 完成一个 recipe 后，可按本表继续调用下游 recipe，形成跨域链路。
> 自动从 recipe 的 Output 字段与下游 Input 字段计算得出，每个源 recipe 取 top-5 最相关下游。
> 用户目标跨多个 recipe（如「搜某 UP 主 → 看其投稿 → 看视频评论」）时按本图**依序调用**，不要自行拆 atom。

| 已完成 Recipe | 输出字段 | 可继续 Recipe (按相关性排序) | 接力字段 |
|--------------|---------|----------------------------|---------|
| `account_health_violations` (账号信息→账号健康→违规记录) | `user_id` | 🔀 `username_to_followers` (用户名→粉丝/关注) | `user_id` |
| `account_health_violations` (账号信息→账号健康→违规记录) | `user_id` | 🔀 `creator_milestones` (用户详情→创作者里程碑) | `user_id` |
| `account_health_violations` (账号信息→账号健康→违规记录) | `user_id` | 🔀 `search_user_profile` (搜索用户→看主页) | `user_id` |
| `account_health_violations` (账号信息→账号健康→违规记录) | `cookie` | `account_insights_live` (账号信息→收益概览→直播概览) | `cookie` |
| `account_health_violations` (账号信息→账号健康→违规记录) | `cookie` | `product_related_videos` (商品→关联视频) | `cookie` |
| `account_insights_live` (账号信息→收益概览→直播概览) | `cookie` | `product_related_videos` (商品→关联视频) | `cookie` |
| `account_insights_live` (账号信息→收益概览→直播概览) | `cookie` | `account_health_violations` (账号信息→账号健康→违规记录) | `cookie` |
| `account_insights_live` (账号信息→收益概览→直播概览) | `cookie` | `account_video_analytics` (账号信息→视频概览→视频列表) | `cookie` |
| `account_insights_live` (账号信息→收益概览→直播概览) | `cookie` | `video_product_stats` (视频列表→视频关联商品) | `cookie` |
| `account_video_analytics` (账号信息→视频概览→视频列表) | `cookie` | `account_insights_live` (账号信息→收益概览→直播概览) | `cookie` |
| `account_video_analytics` (账号信息→视频概览→视频列表) | `cookie` | `product_related_videos` (商品→关联视频) | `cookie` |
| `account_video_analytics` (账号信息→视频概览→视频列表) | `cookie` | `account_health_violations` (账号信息→账号健康→违规记录) | `cookie` |
| `account_video_analytics` (账号信息→视频概览→视频列表) | `cookie` | `video_product_stats` (视频列表→视频关联商品) | `cookie` |
| `ad_detail_recommend` (广告详情→推荐广告) | `ads_id` | `ad_search_detail` (广告搜索→广告详情) | `ads_id` |
| `ad_detail_recommend` (广告详情→推荐广告) | `material_id` | `ad_search_keyframe` (广告搜索→关键帧分析) | `material_id` |
| `ad_detail_recommend` (广告详情→推荐广告) | `material_id` | `ad_search_percentile` (广告搜索→百分位分析) | `material_id` |
| `ad_detail_recommend` (广告详情→推荐广告) | `material_id` | `ad_search_interactive` (广告搜索→互动分析) | `material_id` |
| `ad_search_detail` (广告搜索→广告详情) | `keyword` | 🔀 `search_video_detail` (搜索视频→看详情) | `keyword` |
| `ad_search_detail` (广告搜索→广告详情) | `keyword` | 🔀 `search_user_profile` (搜索用户→看主页) | `keyword` |
| `ad_search_detail` (广告搜索→广告详情) | `keyword` | 🔀 `hashtag_search_videos` (话题搜索→话题详情→视频) | `keyword` |
| `ad_search_detail` (广告搜索→广告详情) | `keyword` | 🔀 `music_search_videos` (音乐搜索→音乐详情→视频) | `keyword` |
| `ad_search_detail` (广告搜索→广告详情) | `keyword` | 🔀 `insights_detail` (搜索洞察→详情/趋势) | `keyword` |
| `ad_search_interactive` (广告搜索→互动分析) | `keyword` | 🔀 `search_video_detail` (搜索视频→看详情) | `keyword` |
| `ad_search_interactive` (广告搜索→互动分析) | `keyword` | 🔀 `search_user_profile` (搜索用户→看主页) | `keyword` |
| `ad_search_interactive` (广告搜索→互动分析) | `keyword` | 🔀 `hashtag_search_videos` (话题搜索→话题详情→视频) | `keyword` |
| `ad_search_interactive` (广告搜索→互动分析) | `keyword` | 🔀 `music_search_videos` (音乐搜索→音乐详情→视频) | `keyword` |
| `ad_search_interactive` (广告搜索→互动分析) | `keyword` | 🔀 `insights_detail` (搜索洞察→详情/趋势) | `keyword` |
| `ad_search_keyframe` (广告搜索→关键帧分析) | `keyword` | 🔀 `search_video_detail` (搜索视频→看详情) | `keyword` |
| `ad_search_keyframe` (广告搜索→关键帧分析) | `keyword` | 🔀 `search_user_profile` (搜索用户→看主页) | `keyword` |
| `ad_search_keyframe` (广告搜索→关键帧分析) | `keyword` | 🔀 `hashtag_search_videos` (话题搜索→话题详情→视频) | `keyword` |
| `ad_search_keyframe` (广告搜索→关键帧分析) | `keyword` | 🔀 `music_search_videos` (音乐搜索→音乐详情→视频) | `keyword` |
| `ad_search_keyframe` (广告搜索→关键帧分析) | `keyword` | 🔀 `insights_detail` (搜索洞察→详情/趋势) | `keyword` |
| `ad_search_percentile` (广告搜索→百分位分析) | `keyword` | 🔀 `search_video_detail` (搜索视频→看详情) | `keyword` |
| `ad_search_percentile` (广告搜索→百分位分析) | `keyword` | 🔀 `search_user_profile` (搜索用户→看主页) | `keyword` |
| `ad_search_percentile` (广告搜索→百分位分析) | `keyword` | 🔀 `hashtag_search_videos` (话题搜索→话题详情→视频) | `keyword` |
| `ad_search_percentile` (广告搜索→百分位分析) | `keyword` | 🔀 `music_search_videos` (音乐搜索→音乐详情→视频) | `keyword` |
| `ad_search_percentile` (广告搜索→百分位分析) | `keyword` | 🔀 `insights_detail` (搜索洞察→详情/趋势) | `keyword` |
| `batch_live_online` (批量检测直播在线) | `room_id` | `live_link_info` (直播链接→直播信息) | `room_id` |
| `batch_live_online` (批量检测直播在线) | `room_id` | `live_ranking` (直播信息→排行榜) | `room_id` |
| `batch_live_online` (批量检测直播在线) | `room_id` | `live_products` (直播信息→商品列表) | `room_id` |
| `batch_live_online` (批量检测直播在线) | `room_id` | `live_danmaku` (直播间→弹幕) | `room_id` |
| `batch_live_online` (批量检测直播在线) | `room_id` | `gift_name` (礼物列表→礼物名称) | `room_id` |
| `comment_keywords_to_replies` (评论关键词→评论列表) | `comment_id` | 🔀 `comments_replies` (看视频评论+回复) | `comment_id` |
| `comment_keywords_to_replies` (评论关键词→评论列表) | `item_id` | 🔀 `video_analytics` (看视频+分析) | `item_id` |
| `comment_keywords_to_replies` (评论关键词→评论列表) | `item_id` | `video_metrics` (视频详情→视频统计) | `item_id` |
| `comment_keywords_to_replies` (评论关键词→评论列表) | `item_id` | `video_comment_keywords` (视频详情→评论关键词) | `item_id` |
| `comment_keywords_to_replies` (评论关键词→评论列表) | `item_id` | `fake_views_detect` (视频统计→虚假流量检测) | `item_id` |
| `comments_replies` (看视频评论+回复) | `aweme_id` | 🔀 `user_posts_to_video` (用户作品→视频详情) | `aweme_id` |
| `comments_replies` (看视频评论+回复) | `aweme_id` | 🔀 `video_metrics` (视频详情→视频统计) | `aweme_id` |
| `comments_replies` (看视频评论+回复) | `aweme_id` | 🔀 `video_comment_keywords` (视频详情→评论关键词) | `aweme_id` |
| `comments_replies` (看视频评论+回复) | `comment_id` | 🔀 `comment_keywords_to_replies` (评论关键词→评论列表) | `comment_id` |
| `comments_replies` (看视频评论+回复) | `aweme_id` | 🔀 `video_author` (看视频+作者主页) | `aweme_id` |
| `creator_milestones` (用户详情→创作者里程碑) | `user_id` | 🔀 `username_to_followers` (用户名→粉丝/关注) | `user_id` |
| `creator_milestones` (用户详情→创作者里程碑) | `user_id` | 🔀 `search_user_profile` (搜索用户→看主页) | `user_id` |
| `creator_showcase` (创作者信息→橱窗商品) | `sec_user_id` | 🔀 `creator_milestones` (用户详情→创作者里程碑) | `sec_user_id` |
| `creator_showcase` (创作者信息→橱窗商品) | `sec_user_id` | 🔀 `video_author` (看视频+作者主页) | `sec_user_id` |
| `creator_showcase` (创作者信息→橱窗商品) | `creator_uid`, `sec_user_id` | `user_creator_info` (用户资料→创作者信息) | `creator_uid`, `sec_user_id` |
| `creator_showcase` (创作者信息→橱窗商品) | `sec_user_id` | `username_to_profile` (用户名→用户资料) | `sec_user_id` |
| `creator_showcase` (创作者信息→橱窗商品) | `sec_user_id` | `username_to_posts` (用户名→用户作品) | `sec_user_id` |
| `cross_verify_metrics` (虚假流量检测→视频统计交叉验证) | `item_id` | 🔀 `video_analytics` (看视频+分析) | `item_id` |
| `cross_verify_metrics` (虚假流量检测→视频统计交叉验证) | `item_id` | `video_metrics` (视频详情→视频统计) | `item_id` |
| `cross_verify_metrics` (虚假流量检测→视频统计交叉验证) | `item_id` | `video_comment_keywords` (视频详情→评论关键词) | `item_id` |
| `cross_verify_metrics` (虚假流量检测→视频统计交叉验证) | `item_id` | `comment_keywords_to_replies` (评论关键词→评论列表) | `item_id` |
| `cross_verify_metrics` (虚假流量检测→视频统计交叉验证) | `item_id` | `fake_views_detect` (视频统计→虚假流量检测) | `item_id` |
| `explore_to_video` (探索页→视频详情) | `aweme_id` | 🔀 `user_posts_to_video` (用户作品→视频详情) | `aweme_id` |
| `explore_to_video` (探索页→视频详情) | `aweme_id` | 🔀 `comments_replies` (看视频评论+回复) | `aweme_id` |
| `explore_to_video` (探索页→视频详情) | `aweme_id` | 🔀 `video_metrics` (视频详情→视频统计) | `aweme_id` |
| `explore_to_video` (探索页→视频详情) | `aweme_id` | 🔀 `video_comment_keywords` (视频详情→评论关键词) | `aweme_id` |
| `explore_to_video` (探索页→视频详情) | `aweme_id` | 🔀 `search_video_detail` (搜索视频→看详情) | `aweme_id` |
| `fake_views_detect` (视频统计→虚假流量检测) | `item_id` | 🔀 `video_analytics` (看视频+分析) | `item_id` |
| `fake_views_detect` (视频统计→虚假流量检测) | `item_id` | `video_metrics` (视频详情→视频统计) | `item_id` |
| `fake_views_detect` (视频统计→虚假流量检测) | `item_id` | `video_comment_keywords` (视频详情→评论关键词) | `item_id` |
| `fake_views_detect` (视频统计→虚假流量检测) | `item_id` | `comment_keywords_to_replies` (评论关键词→评论列表) | `item_id` |
| `fake_views_detect` (视频统计→虚假流量检测) | `item_id` | `cross_verify_metrics` (虚假流量检测→视频统计交叉验证) | `item_id` |
| `gift_name` (礼物列表→礼物名称) | `room_id` | `live_link_info` (直播链接→直播信息) | `room_id` |
| `gift_name` (礼物列表→礼物名称) | `room_id` | `live_ranking` (直播信息→排行榜) | `room_id` |
| `gift_name` (礼物列表→礼物名称) | `room_id` | `live_products` (直播信息→商品列表) | `room_id` |
| `gift_name` (礼物列表→礼物名称) | `room_id` | `live_danmaku` (直播间→弹幕) | `room_id` |
| `hashtag_search_videos` (话题搜索→话题详情→视频) | `keyword` | 🔀 `ad_search_detail` (广告搜索→广告详情) | `keyword` |
| `hashtag_search_videos` (话题搜索→话题详情→视频) | `keyword` | 🔀 `ad_search_keyframe` (广告搜索→关键帧分析) | `keyword` |
| `hashtag_search_videos` (话题搜索→话题详情→视频) | `keyword` | 🔀 `ad_search_percentile` (广告搜索→百分位分析) | `keyword` |
| `hashtag_search_videos` (话题搜索→话题详情→视频) | `keyword` | 🔀 `ad_search_interactive` (广告搜索→互动分析) | `keyword` |
| `hashtag_search_videos` (话题搜索→话题详情→视频) | `keyword` | `search_video_detail` (搜索视频→看详情) | `keyword` |
| `insights_detail` (搜索洞察→详情/趋势) | `keyword` | 🔀 `ad_search_detail` (广告搜索→广告详情) | `keyword` |
| `insights_detail` (搜索洞察→详情/趋势) | `keyword` | 🔀 `ad_search_keyframe` (广告搜索→关键帧分析) | `keyword` |
| `insights_detail` (搜索洞察→详情/趋势) | `keyword` | 🔀 `ad_search_percentile` (广告搜索→百分位分析) | `keyword` |
| `insights_detail` (搜索洞察→详情/趋势) | `keyword` | 🔀 `ad_search_interactive` (广告搜索→互动分析) | `keyword` |
| `insights_detail` (搜索洞察→详情/趋势) | `keyword` | `search_video_detail` (搜索视频→看详情) | `keyword` |
| `live_danmaku` (直播间→弹幕) | `room_id` | `live_link_info` (直播链接→直播信息) | `room_id` |
| `live_danmaku` (直播间→弹幕) | `room_id` | `live_ranking` (直播信息→排行榜) | `room_id` |
| `live_danmaku` (直播间→弹幕) | `room_id` | `live_products` (直播信息→商品列表) | `room_id` |
| `live_danmaku` (直播间→弹幕) | `room_id` | `gift_name` (礼物列表→礼物名称) | `room_id` |
| `live_link_info` (直播链接→直播信息) | `url` | 🔀 `url_to_user` (URL→用户资料) | `url` |
| `live_link_info` (直播链接→直播信息) | `url` | 🔀 `url_to_user_posts` (URL→用户作品) | `url` |
| `live_link_info` (直播链接→直播信息) | `url` | 🔀 `url_to_video` (URL→aweme_id→视频详情) | `url` |
| `live_link_info` (直播链接→直播信息) | `room_id` | `live_ranking` (直播信息→排行榜) | `room_id` |
| `live_link_info` (直播链接→直播信息) | `room_id` | `live_products` (直播信息→商品列表) | `room_id` |
| `live_products` (直播信息→商品列表) | `room_id` | `live_link_info` (直播链接→直播信息) | `room_id` |
| `live_products` (直播信息→商品列表) | `room_id` | `live_ranking` (直播信息→排行榜) | `room_id` |
| `live_products` (直播信息→商品列表) | `room_id` | `gift_name` (礼物列表→礼物名称) | `room_id` |
| `live_products` (直播信息→商品列表) | `room_id` | `live_danmaku` (直播间→弹幕) | `room_id` |
| `live_ranking` (直播信息→排行榜) | `room_id` | `live_link_info` (直播链接→直播信息) | `room_id` |
| `live_ranking` (直播信息→排行榜) | `room_id` | `live_products` (直播信息→商品列表) | `room_id` |
| `live_ranking` (直播信息→排行榜) | `room_id` | `gift_name` (礼物列表→礼物名称) | `room_id` |
| `live_ranking` (直播信息→排行榜) | `room_id` | `live_danmaku` (直播间→弹幕) | `room_id` |
| `music_search_videos` (音乐搜索→音乐详情→视频) | `keyword` | 🔀 `ad_search_detail` (广告搜索→广告详情) | `keyword` |
| `music_search_videos` (音乐搜索→音乐详情→视频) | `keyword` | 🔀 `ad_search_keyframe` (广告搜索→关键帧分析) | `keyword` |
| `music_search_videos` (音乐搜索→音乐详情→视频) | `keyword` | 🔀 `ad_search_percentile` (广告搜索→百分位分析) | `keyword` |
| `music_search_videos` (音乐搜索→音乐详情→视频) | `keyword` | 🔀 `ad_search_interactive` (广告搜索→互动分析) | `keyword` |
| `music_search_videos` (音乐搜索→音乐详情→视频) | `keyword` | `search_video_detail` (搜索视频→看详情) | `keyword` |
| `product_related_videos` (商品→关联视频) | `product_id` | 🔀 `shop_search_detail` (搜索商品→商品详情) | `product_id` |
| `product_related_videos` (商品→关联视频) | `product_id` | 🔀 `shop_detail_reviews` (商品详情→商品评论) | `product_id` |
| `product_related_videos` (商品→关联视频) | `product_id` | 🔀 `shop_detail_seller` (商品详情→商家商品列表) | `product_id` |
| `product_related_videos` (商品→关联视频) | `cookie` | `account_insights_live` (账号信息→收益概览→直播概览) | `cookie` |
| `product_related_videos` (商品→关联视频) | `cookie` | `account_health_violations` (账号信息→账号健康→违规记录) | `cookie` |
| `search_user_profile` (搜索用户→看主页) | `user_id` | 🔀 `username_to_followers` (用户名→粉丝/关注) | `user_id` |
| `search_user_profile` (搜索用户→看主页) | `user_id` | 🔀 `creator_milestones` (用户详情→创作者里程碑) | `user_id` |
| `search_user_profile` (搜索用户→看主页) | `keyword` | 🔀 `ad_search_detail` (广告搜索→广告详情) | `keyword` |
| `search_user_profile` (搜索用户→看主页) | `keyword` | 🔀 `ad_search_keyframe` (广告搜索→关键帧分析) | `keyword` |
| `search_user_profile` (搜索用户→看主页) | `keyword` | 🔀 `ad_search_percentile` (广告搜索→百分位分析) | `keyword` |
| `search_video_detail` (搜索视频→看详情) | `aweme_id` | 🔀 `user_posts_to_video` (用户作品→视频详情) | `aweme_id` |
| `search_video_detail` (搜索视频→看详情) | `aweme_id` | 🔀 `comments_replies` (看视频评论+回复) | `aweme_id` |
| `search_video_detail` (搜索视频→看详情) | `aweme_id` | 🔀 `video_metrics` (视频详情→视频统计) | `aweme_id` |
| `search_video_detail` (搜索视频→看详情) | `aweme_id` | 🔀 `video_comment_keywords` (视频详情→评论关键词) | `aweme_id` |
| `search_video_detail` (搜索视频→看详情) | `aweme_id` | 🔀 `video_author` (看视频+作者主页) | `aweme_id` |
| `share_to_video` (分享链接→视频详情) | `aweme_id` | 🔀 `user_posts_to_video` (用户作品→视频详情) | `aweme_id` |
| `share_to_video` (分享链接→视频详情) | `aweme_id` | 🔀 `comments_replies` (看视频评论+回复) | `aweme_id` |
| `share_to_video` (分享链接→视频详情) | `aweme_id` | 🔀 `video_metrics` (视频详情→视频统计) | `aweme_id` |
| `share_to_video` (分享链接→视频详情) | `aweme_id` | 🔀 `video_comment_keywords` (视频详情→评论关键词) | `aweme_id` |
| `share_to_video` (分享链接→视频详情) | `aweme_id` | 🔀 `search_video_detail` (搜索视频→看详情) | `aweme_id` |
| `shop_detail_reviews` (商品详情→商品评论) | `product_id` | 🔀 `product_related_videos` (商品→关联视频) | `product_id` |
| `shop_detail_reviews` (商品详情→商品评论) | `product_id`, `region` | `shop_search_detail` (搜索商品→商品详情) | `product_id`, `region` |
| `shop_detail_reviews` (商品详情→商品评论) | `product_id`, `region` | `shop_detail_seller` (商品详情→商家商品列表) | `product_id`, `region` |
| `shop_detail_reviews` (商品详情→商品评论) | `region` | `shop_suggest_search` (搜索建议→搜索商品) | `region` |
| `shop_detail_seller` (商品详情→商家商品列表) | `product_id` | 🔀 `product_related_videos` (商品→关联视频) | `product_id` |
| `shop_detail_seller` (商品详情→商家商品列表) | `product_id`, `region` | `shop_search_detail` (搜索商品→商品详情) | `product_id`, `region` |
| `shop_detail_seller` (商品详情→商家商品列表) | `product_id`, `region` | `shop_detail_reviews` (商品详情→商品评论) | `product_id`, `region` |
| `shop_detail_seller` (商品详情→商家商品列表) | `region` | `shop_suggest_search` (搜索建议→搜索商品) | `region` |
| `shop_search_detail` (搜索商品→商品详情) | `product_id` | 🔀 `product_related_videos` (商品→关联视频) | `product_id` |
| `shop_search_detail` (搜索商品→商品详情) | `product_id`, `region` | `shop_detail_seller` (商品详情→商家商品列表) | `product_id`, `region` |
| `shop_search_detail` (搜索商品→商品详情) | `region`, `search_word` | `shop_suggest_search` (搜索建议→搜索商品) | `region`, `search_word` |
| `shop_search_detail` (搜索商品→商品详情) | `product_id`, `region` | `shop_detail_reviews` (商品详情→商品评论) | `product_id`, `region` |
| `shop_suggest_search` (搜索建议→搜索商品) | `region`, `search_word` | `shop_search_detail` (搜索商品→商品详情) | `region`, `search_word` |
| `shop_suggest_search` (搜索建议→搜索商品) | `region` | `shop_detail_reviews` (商品详情→商品评论) | `region` |
| `shop_suggest_search` (搜索建议→搜索商品) | `region` | `shop_detail_seller` (商品详情→商家商品列表) | `region` |
| `tag_to_video` (Tag→视频详情) | `aweme_id` | 🔀 `user_posts_to_video` (用户作品→视频详情) | `aweme_id` |
| `tag_to_video` (Tag→视频详情) | `aweme_id` | 🔀 `comments_replies` (看视频评论+回复) | `aweme_id` |
| `tag_to_video` (Tag→视频详情) | `aweme_id` | 🔀 `video_metrics` (视频详情→视频统计) | `aweme_id` |
| `tag_to_video` (Tag→视频详情) | `aweme_id` | 🔀 `video_comment_keywords` (视频详情→评论关键词) | `aweme_id` |
| `tag_to_video` (Tag→视频详情) | `aweme_id` | 🔀 `search_video_detail` (搜索视频→看详情) | `aweme_id` |
| `url_to_user` (URL→用户资料) | `url` | 🔀 `live_link_info` (直播链接→直播信息) | `url` |
| `url_to_user` (URL→用户资料) | `sec_user_id` | 🔀 `creator_milestones` (用户详情→创作者里程碑) | `sec_user_id` |
| `url_to_user` (URL→用户资料) | `sec_user_id` | 🔀 `video_author` (看视频+作者主页) | `sec_user_id` |
| `url_to_user` (URL→用户资料) | `url` | 🔀 `url_to_video` (URL→aweme_id→视频详情) | `url` |
| `url_to_user` (URL→用户资料) | `sec_user_id`, `url` | `url_to_user_posts` (URL→用户作品) | `sec_user_id`, `url` |
| `url_to_user_posts` (URL→用户作品) | `url` | 🔀 `live_link_info` (直播链接→直播信息) | `url` |
| `url_to_user_posts` (URL→用户作品) | `sec_user_id` | 🔀 `creator_milestones` (用户详情→创作者里程碑) | `sec_user_id` |
| `url_to_user_posts` (URL→用户作品) | `sec_user_id` | 🔀 `video_author` (看视频+作者主页) | `sec_user_id` |
| `url_to_user_posts` (URL→用户作品) | `url` | 🔀 `url_to_video` (URL→aweme_id→视频详情) | `url` |
| `url_to_user_posts` (URL→用户作品) | `sec_user_id`, `url` | `url_to_user` (URL→用户资料) | `sec_user_id`, `url` |
| `url_to_video` (URL→aweme_id→视频详情) | `url` | 🔀 `url_to_user` (URL→用户资料) | `url` |
| `url_to_video` (URL→aweme_id→视频详情) | `url` | 🔀 `url_to_user_posts` (URL→用户作品) | `url` |
| `url_to_video` (URL→aweme_id→视频详情) | `aweme_id` | 🔀 `user_posts_to_video` (用户作品→视频详情) | `aweme_id` |
| `url_to_video` (URL→aweme_id→视频详情) | `aweme_id` | 🔀 `comments_replies` (看视频评论+回复) | `aweme_id` |
| `url_to_video` (URL→aweme_id→视频详情) | `url` | 🔀 `live_link_info` (直播链接→直播信息) | `url` |
| `user_creator_info` (用户资料→创作者信息) | `sec_user_id` | 🔀 `creator_milestones` (用户详情→创作者里程碑) | `sec_user_id` |
| `user_creator_info` (用户资料→创作者信息) | `sec_user_id` | 🔀 `video_author` (看视频+作者主页) | `sec_user_id` |
| `user_creator_info` (用户资料→创作者信息) | `creator_uid`, `sec_user_id` | `creator_showcase` (创作者信息→橱窗商品) | `creator_uid`, `sec_user_id` |
| `user_creator_info` (用户资料→创作者信息) | `sec_user_id` | `username_to_profile` (用户名→用户资料) | `sec_user_id` |
| `user_creator_info` (用户资料→创作者信息) | `sec_user_id` | `username_to_posts` (用户名→用户作品) | `sec_user_id` |
| `user_posts_to_video` (用户作品→视频详情) | `aweme_id`, `sec_user_id` | 🔀 `video_author` (看视频+作者主页) | `aweme_id`, `sec_user_id` |
| `user_posts_to_video` (用户作品→视频详情) | `aweme_id` | 🔀 `comments_replies` (看视频评论+回复) | `aweme_id` |
| `user_posts_to_video` (用户作品→视频详情) | `aweme_id` | 🔀 `video_metrics` (视频详情→视频统计) | `aweme_id` |
| `user_posts_to_video` (用户作品→视频详情) | `aweme_id` | 🔀 `video_comment_keywords` (视频详情→评论关键词) | `aweme_id` |
| `user_posts_to_video` (用户作品→视频详情) | `sec_user_id` | 🔀 `creator_milestones` (用户详情→创作者里程碑) | `sec_user_id` |
| `user_similar` (用户资料→类似推荐) | `sec_user_id` | 🔀 `creator_milestones` (用户详情→创作者里程碑) | `sec_user_id` |
| `user_similar` (用户资料→类似推荐) | `sec_user_id` | 🔀 `video_author` (看视频+作者主页) | `sec_user_id` |
| `user_similar` (用户资料→类似推荐) | `sec_user_id` | `username_to_profile` (用户名→用户资料) | `sec_user_id` |
| `user_similar` (用户资料→类似推荐) | `sec_user_id` | `username_to_posts` (用户名→用户作品) | `sec_user_id` |
| `user_similar` (用户资料→类似推荐) | `sec_user_id` | `url_to_user` (URL→用户资料) | `sec_user_id` |
| `username_to_followers` (用户名→粉丝/关注) | `user_id` | 🔀 `creator_milestones` (用户详情→创作者里程碑) | `user_id` |
| `username_to_followers` (用户名→粉丝/关注) | `user_id` | 🔀 `search_user_profile` (搜索用户→看主页) | `user_id` |
| `username_to_followers` (用户名→粉丝/关注) | `username` | `username_to_profile` (用户名→用户资料) | `username` |
| `username_to_followers` (用户名→粉丝/关注) | `username` | `username_to_posts` (用户名→用户作品) | `username` |
| `username_to_posts` (用户名→用户作品) | `sec_user_id` | 🔀 `creator_milestones` (用户详情→创作者里程碑) | `sec_user_id` |
| `username_to_posts` (用户名→用户作品) | `sec_user_id` | 🔀 `video_author` (看视频+作者主页) | `sec_user_id` |
| `username_to_posts` (用户名→用户作品) | `sec_user_id`, `username` | `username_to_profile` (用户名→用户资料) | `sec_user_id`, `username` |
| `username_to_posts` (用户名→用户作品) | `username` | `username_to_followers` (用户名→粉丝/关注) | `username` |
| `username_to_posts` (用户名→用户作品) | `sec_user_id` | `url_to_user` (URL→用户资料) | `sec_user_id` |
| `username_to_profile` (用户名→用户资料) | `sec_user_id` | 🔀 `creator_milestones` (用户详情→创作者里程碑) | `sec_user_id` |
| `username_to_profile` (用户名→用户资料) | `sec_user_id` | 🔀 `video_author` (看视频+作者主页) | `sec_user_id` |
| `username_to_profile` (用户名→用户资料) | `sec_user_id`, `username` | `username_to_posts` (用户名→用户作品) | `sec_user_id`, `username` |
| `username_to_profile` (用户名→用户资料) | `username` | `username_to_followers` (用户名→粉丝/关注) | `username` |
| `username_to_profile` (用户名→用户资料) | `sec_user_id` | `url_to_user` (URL→用户资料) | `sec_user_id` |
| `video_analytics` (看视频+分析) | `aweme_id`, `item_id` | 🔀 `video_metrics` (视频详情→视频统计) | `aweme_id`, `item_id` |
| `video_analytics` (看视频+分析) | `aweme_id`, `item_id` | 🔀 `video_comment_keywords` (视频详情→评论关键词) | `aweme_id`, `item_id` |
| `video_analytics` (看视频+分析) | `aweme_id` | 🔀 `user_posts_to_video` (用户作品→视频详情) | `aweme_id` |
| `video_analytics` (看视频+分析) | `aweme_id` | 🔀 `comments_replies` (看视频评论+回复) | `aweme_id` |
| `video_analytics` (看视频+分析) | `item_id` | 🔀 `comment_keywords_to_replies` (评论关键词→评论列表) | `item_id` |
| `video_author` (看视频+作者主页) | `sec_uid`, `sec_user_id` | 🔀 `user_similar` (用户资料→类似推荐) | `sec_uid`, `sec_user_id` |
| `video_author` (看视频+作者主页) | `aweme_id`, `sec_user_id` | 🔀 `user_posts_to_video` (用户作品→视频详情) | `aweme_id`, `sec_user_id` |
| `video_author` (看视频+作者主页) | `sec_user_id` | 🔀 `username_to_profile` (用户名→用户资料) | `sec_user_id` |
| `video_author` (看视频+作者主页) | `sec_user_id` | 🔀 `username_to_posts` (用户名→用户作品) | `sec_user_id` |
| `video_author` (看视频+作者主页) | `sec_user_id` | 🔀 `url_to_user` (URL→用户资料) | `sec_user_id` |
| `video_comment_keywords` (视频详情→评论关键词) | `aweme_id`, `item_id` | 🔀 `video_analytics` (看视频+分析) | `aweme_id`, `item_id` |
| `video_comment_keywords` (视频详情→评论关键词) | `aweme_id` | 🔀 `user_posts_to_video` (用户作品→视频详情) | `aweme_id` |
| `video_comment_keywords` (视频详情→评论关键词) | `aweme_id` | 🔀 `comments_replies` (看视频评论+回复) | `aweme_id` |
| `video_comment_keywords` (视频详情→评论关键词) | `aweme_id` | 🔀 `video_author` (看视频+作者主页) | `aweme_id` |
| `video_comment_keywords` (视频详情→评论关键词) | `aweme_id` | 🔀 `share_to_video` (分享链接→视频详情) | `aweme_id` |
| `video_comments` (看视频+评论) | `aweme_id` | 🔀 `user_posts_to_video` (用户作品→视频详情) | `aweme_id` |
| `video_comments` (看视频+评论) | `aweme_id` | 🔀 `comments_replies` (看视频评论+回复) | `aweme_id` |
| `video_comments` (看视频+评论) | `aweme_id` | 🔀 `video_metrics` (视频详情→视频统计) | `aweme_id` |
| `video_comments` (看视频+评论) | `aweme_id` | 🔀 `video_comment_keywords` (视频详情→评论关键词) | `aweme_id` |
| `video_comments` (看视频+评论) | `aweme_id` | 🔀 `search_video_detail` (搜索视频→看详情) | `aweme_id` |
| `video_metrics` (视频详情→视频统计) | `aweme_id`, `item_id` | 🔀 `video_analytics` (看视频+分析) | `aweme_id`, `item_id` |
| `video_metrics` (视频详情→视频统计) | `aweme_id` | 🔀 `user_posts_to_video` (用户作品→视频详情) | `aweme_id` |
| `video_metrics` (视频详情→视频统计) | `aweme_id` | 🔀 `comments_replies` (看视频评论+回复) | `aweme_id` |
| `video_metrics` (视频详情→视频统计) | `aweme_id` | 🔀 `video_author` (看视频+作者主页) | `aweme_id` |
| `video_metrics` (视频详情→视频统计) | `aweme_id` | 🔀 `share_to_video` (分享链接→视频详情) | `aweme_id` |
| `video_product_stats` (视频列表→视频关联商品) | `cookie` | `account_insights_live` (账号信息→收益概览→直播概览) | `cookie` |
| `video_product_stats` (视频列表→视频关联商品) | `cookie` | `product_related_videos` (商品→关联视频) | `cookie` |
| `video_product_stats` (视频列表→视频关联商品) | `cookie` | `account_health_violations` (账号信息→账号健康→违规记录) | `cookie` |
| `video_product_stats` (视频列表→视频关联商品) | `cookie` | `account_video_analytics` (账号信息→视频概览→视频列表) | `cookie` |
| `video_to_comments` (视频→评论) | `aweme_id` | 🔀 `user_posts_to_video` (用户作品→视频详情) | `aweme_id` |
| `video_to_comments` (视频→评论) | `aweme_id` | 🔀 `video_metrics` (视频详情→视频统计) | `aweme_id` |
| `video_to_comments` (视频→评论) | `aweme_id` | 🔀 `video_comment_keywords` (视频详情→评论关键词) | `aweme_id` |
| `video_to_comments` (视频→评论) | `aweme_id` | 🔀 `video_author` (看视频+作者主页) | `aweme_id` |
| `video_to_comments` (视频→评论) | `aweme_id` | 🔀 `share_to_video` (分享链接→视频详情) | `aweme_id` |
| `web_search_paging` (Web搜索翻页) | `keyword` | 🔀 `ad_search_detail` (广告搜索→广告详情) | `keyword` |
| `web_search_paging` (Web搜索翻页) | `keyword` | 🔀 `ad_search_keyframe` (广告搜索→关键帧分析) | `keyword` |
| `web_search_paging` (Web搜索翻页) | `keyword` | 🔀 `ad_search_percentile` (广告搜索→百分位分析) | `keyword` |
| `web_search_paging` (Web搜索翻页) | `keyword` | 🔀 `ad_search_interactive` (广告搜索→互动分析) | `keyword` |
| `web_search_paging` (Web搜索翻页) | `keyword` | `search_video_detail` (搜索视频→看详情) | `keyword` |

> 🔀 = 跨文件链路 (cross-domain chain)；优先选 🔀 标记的下游 recipe，因为它能扩展 agent 已有的数据视图。

**典型 3 步用法**：
1. 用户语义 → 在 `_index.md` trigger_keywords 列匹配第 1 个 recipe
2. 执行第 1 个 recipe，得到 Output 字段
3. 在本表查 "已完成 Recipe" 列 → 选合适的下游 → 用 "接力字段" 直接传参，无需问用户重复输入

