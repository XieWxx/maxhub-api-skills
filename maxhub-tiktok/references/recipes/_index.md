# Recipe Index / 编排索引

> 本文件是编排层（Orchestration Layer）的索引。Recipe 封装用户目标的多步链式调用，Agent 按 recipe_id 快速定位链路，无需全文读取 reference 详情。

## 编排映射表

| recipe_id | 用户目标 | 域 | 步数 | 详情文件 | trigger_keywords |
|-----------|---------|-----|------|---------|-----------------|
| video_comments | 看视频+评论 | 视频→评论 | 2 | video.md | 视频评论,看评论 |
| video_author | 看视频+作者主页 | 视频→用户 | 2 | video.md | 视频作者,作者主页 |
| share_to_video | 分享链接→视频详情 | 视频 | 2 | video.md | 分享链接,解析链接 |
| url_to_video | URL→aweme_id→视频详情 | 视频 | 2 | video.md | 提取视频ID,视频链接 |
| video_analytics | 看视频+分析 | 视频→分析 | 2 | video.md | 视频分析,视频统计 |
| explore_to_video | 探索页→视频详情 | 视频 | 2 | video.md | 探索视频,发现视频 |
| tag_to_video | Tag→视频详情 | 视频 | 2 | video.md | 标签视频,Tag视频 |
| username_to_profile | 用户名→用户资料 | 用户 | 2 | user.md | 用户名查用户,用户资料 |
| username_to_posts | 用户名→用户作品 | 用户 | 2 | user.md | 用户作品,用户视频 |
| username_to_followers | 用户名→粉丝/关注 | 用户 | 2 | user.md | 用户粉丝,用户关注 |
| url_to_user | URL→用户资料 | 用户 | 2 | user.md | 链接提取用户,解析链接 |
| url_to_user_posts | URL→用户作品 | 用户 | 2 | user.md | 链接提取作品 |
| user_creator_info | 用户资料→创作者信息 | 用户 | 2 | user.md | 创作者信息,带货 |
| creator_showcase | 创作者信息→橱窗商品 | 用户 | 2 | user.md | 橱窗商品,带货商品 |
| user_live_detail | 用户资料→直播详情 | 用户 | 2 | user.md | 用户直播,直播详情 |
| user_posts_to_video | 用户作品→视频详情 | 用户→视频 | 2 | user.md | 用户视频详情 |
| user_similar | 用户资料→类似推荐 | 用户 | 2 | user.md | 类似用户,推荐用户 |
| search_video_detail | 搜索视频→看详情 | 搜索→视频 | 2 | search.md | 搜视频,搜索视频 |
| search_user_profile | 搜索用户→看主页 | 搜索→用户 | 2 | search.md | 搜用户,搜索用户 |
| hashtag_search_videos | 话题搜索→话题详情→视频 | 搜索 | 3 | search.md | 搜话题,话题视频 |
| music_search_videos | 音乐搜索→音乐详情→视频 | 搜索 | 3 | search.md | 搜音乐,音乐视频 |
| insights_detail | 搜索洞察→详情/趋势 | 搜索 | 2 | search.md | 搜索洞察,创作者洞察 |
| live_recommend_tabs | 直播推荐标签→推荐 | 搜索 | 2 | search.md | 直播推荐,直播标签 |
| web_search_paging | Web搜索翻页 | 搜索 | 1 | search.md | 搜索翻页,Web搜索 |
| comments_replies | 看视频评论+回复 | 评论 | 2 | comments.md | 评论回复,看回复 |
| live_link_info | 直播链接→直播信息 | 直播 | 2 | comments.md | 直播链接,直播信息 |
| live_ranking | 直播信息→排行榜 | 直播 | 2 | comments.md | 直播排行,送礼排行 |
| live_products | 直播信息→商品列表 | 直播 | 2 | comments.md | 直播商品,直播间商品 |
| batch_live_online | 批量检测直播在线 | 直播 | 2 | comments.md | 批量直播,在线检测 |
| video_to_comments | 视频→评论 | 视频→评论 | 2 | comments.md | 视频评论 |
| live_danmaku | 直播间→弹幕 | 直播 | 2 | comments.md | 直播弹幕,直播互动 |
| gift_name | 礼物列表→礼物名称 | 直播 | 2 | comments.md | 礼物名称,礼物查询 |
| video_metrics | 视频详情→视频统计 | 分析 | 2 | analytics.md | 视频统计,播放量 |
| fake_views_detect | 视频统计→虚假流量检测 | 分析 | 2 | analytics.md | 虚假流量,刷量检测 |
| video_comment_keywords | 视频详情→评论关键词 | 分析 | 2 | analytics.md | 评论关键词,词云 |
| creator_milestones | 用户详情→创作者里程碑 | 分析 | 2 | analytics.md | 创作者里程碑,成长数据 |
| cross_verify_metrics | 虚假流量检测→视频统计交叉验证 | 分析 | 2 | analytics.md | 交叉验证,数据验证 |
| comment_keywords_to_replies | 评论关键词→评论列表 | 分析→评论 | 2 | analytics.md | 关键词评论,评论回复 |
| account_health_violations | 账号信息→账号健康→违规记录 | 创作者 | 3 | creator.md | 账号健康,违规记录 |
| account_insights_live | 账号信息→收益概览→直播概览 | 创作者 | 3 | creator.md | 收益概览,直播数据 |
| account_video_analytics | 账号信息→视频概览→视频列表 | 创作者 | 3 | creator.md | 视频分析,视频列表 |
| video_product_stats | 视频列表→视频关联商品 | 创作者 | 2 | creator.md | 视频商品,带货数据 |
| product_related_videos | 商品→关联视频 | 创作者 | 2 | creator.md | 商品视频,关联视频 |
| ad_search_detail | 广告搜索→广告详情 | 广告 | 2 | ads.md | 广告详情,搜广告 |
| ad_search_keyframe | 广告搜索→关键帧分析 | 广告 | 2 | ads.md | 广告关键帧,留存分析 |
| ad_search_percentile | 广告搜索→百分位分析 | 广告 | 2 | ads.md | 广告百分位,排名分析 |
| ad_search_interactive | 广告搜索→互动分析 | 广告 | 2 | ads.md | 广告互动,互动分析 |
| ad_detail_recommend | 广告详情→推荐广告 | 广告 | 2 | ads.md | 推荐广告,相似广告 |
| shop_search_detail | 搜索商品→商品详情 | 电商 | 2 | shop.md | 搜商品,商品详情 |
| shop_suggest_search | 搜索建议→搜索商品 | 电商 | 2 | shop.md | 商品搜索建议 |
| shop_detail_reviews | 商品详情→商品评论 | 电商 | 2 | shop.md | 商品评论,商品评价 |
| shop_detail_seller | 商品详情→商家商品列表 | 电商 | 2 | shop.md | 商家商品,店铺商品 |
| fingerprint_msToken | 指纹→加密strData→msToken | 工具 | 3 | tools.md | msToken生成,指纹生成 |
