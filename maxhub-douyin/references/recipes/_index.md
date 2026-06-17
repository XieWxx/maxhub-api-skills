# Recipe Index / 编排索引


> 🎯 **Trigger 匹配规则（agent 必读）**：
> 1. **最长匹配优先**：用户输入同时命中多个 recipe 时，选 trigger 短语**最长**（最具体）的那个
> 2. **平局询问**：trigger 长度相同时，反问用户消歧后再调用
> 3. **跨域链路**：用户目标跨多个 recipe（如"先搜索再看评论"）→ 串行调用多个 recipe，**不要**自行拆解 atom


> 本文件是编排层（Orchestration Layer）的索引。Recipe 封装用户目标的多步链式调用，Agent 按 recipe_id 快速定位链路，无需全文读取 reference 详情。

## 编排映射表

| recipe_id | 用户目标 | 域 | 步数 | 详情文件 | trigger_keywords |
|-----------|---------|-----|------|---------|-----------------|
| video_detail_hd | 看视频+高清链接 | 视频 | 2 | recipes/video.md | "视频详情" "高清" "下载视频" "视频链接" |
| video_detail_stats | 看视频+统计 | 视频 | 2 | recipes/video.md | "视频统计" "播放量" "点赞数" |
| video_detail_comments | 看视频+评论 | 视频→评论 | 2 | recipes/video.md | "视频评论" "看评论" |
| video_detail_related | 看视频+相关推荐 | 视频 | 2 | recipes/video.md | "相关推荐" "相似视频" |
| video_detail_danmaku | 看视频+弹幕 | 视频 | 2 | recipes/video.md | "视频弹幕" |
| share_to_video_hd | 分享链接→视频详情+高清 | 视频 | 2 | recipes/video.md | "分享链接" "解析链接" "分享视频" |
| feed_to_video | Feed→视频详情 | 视频 | 2 | recipes/video.md | "首页推荐" "推荐视频" |
| mix_detail_videos | 合集详情+视频列表 | 视频 | 2 | recipes/video.md | "合集" "合集视频" |
| series_detail_videos | 短剧详情+视频列表 | 视频 | 2 | recipes/video.md | "短剧" "短剧视频" |
| music_detail_videos | 音乐详情+视频列表 | 视频 | 2 | recipes/video.md | "音乐视频" "音乐详情" |
| hashtag_detail_videos | 话题详情+视频列表 | 视频 | 2 | recipes/video.md | "话题视频" "话题详情" |
| channel_to_video | 频道→视频详情 | 视频 | 2 | recipes/video.md | "频道" "频道视频" |
| video_author_profile | 看视频+作者主页 | 视频→用户 | 2 | recipes/video.md | "视频作者" "作者主页" |
| batch_video_hd | 批量视频详情+高清链接 | 视频 | 2 | recipes/video.md | "批量视频" "批量高清" |
| user_posts | 看用户+作品 | 用户 | 2 | recipes/user.md | "用户作品" "用户主页" |
| user_fans | 看用户+粉丝 | 用户 | 2 | recipes/user.md | "用户粉丝" "粉丝列表" |
| user_following | 看用户+关注 | 用户 | 2 | recipes/user.md | "用户关注" "关注列表" |
| uid_to_profile | uid→sec_user_id→用户信息 | 用户 | 2 | recipes/user.md | "uid转sec_uid" "ID转换" |
| user_live | 看用户+直播信息 | 用户→直播 | 2 | recipes/user.md | "用户直播" "直播状态" |
| user_xingtu | 看用户+星图数据 | 用户→星图 | 2 | recipes/user.md | "用户星图" "星图数据" |
| user_video_hd | 看用户+视频+高清链接 | 用户→视频 | 3 | recipes/user.md | "看用户 视频 高清链接" |
| collects_videos | 收藏夹列表+收藏夹视频 | 用户 | 2 | recipes/user.md | "收藏夹" "收藏视频" |
| batch_user_video | 批量用户→批量视频 | 用户→视频 | 2 | recipes/user.md | "批量用户" "批量视频" |
| search_video_detail | 搜索视频→看详情 | 搜索→视频 | 2 | recipes/search.md | "搜视频" "搜索视频" |
| search_user_profile | 搜索用户→看主页 | 搜索→用户 | 2 | recipes/search.md | "搜用户" "搜索用户" |
| search_challenge_videos | 搜索话题→看视频 | 搜索→视频 | 2 | recipes/search.md | "搜话题" "搜索话题" |
| search_live_detail | 搜索直播→看直播详情 | 搜索→直播 | 2 | recipes/search.md | "搜直播" "搜索直播" |
| search_music_videos | 搜索音乐→看音乐视频 | 搜索→视频 | 2 | recipes/search.md | "搜音乐" "搜索音乐" |
| general_search_multi | 综合搜索→看视频+看用户 | 搜索→视频+用户 | 2 | recipes/search.md | "综合搜索" "搜抖音" |
| vision_search_video | 以图搜图→看视频 | 搜索→视频 | 2 | recipes/search.md | "以图搜图" "图片搜索" |
| comments_replies | 看评论+回复 | 评论 | 2 | recipes/comments.md | "评论回复" "看回复" |
| video_comments | 看视频+评论 | 视频→评论 | 2 | recipes/comments.md | "看视频 评论" |
| comment_user_profile | 看评论+评论者主页 | 评论→用户 | 2 | recipes/comments.md | "评论者" "评论者主页" |
| video_danmaku | 看视频+弹幕 | 视频→评论 | 2 | recipes/comments.md | "看视频 弹幕" |
| live_gift_rank | 看直播+送礼排行 | 直播 | 2 | recipes/live.md | "直播排行" "送礼排行" |
| live_products | 看直播+商品列表 | 直播 | 2 | recipes/live.md | "直播商品" "直播间商品" |
| live_danmaku_ws | 看直播+弹幕 | 直播 | 2 | recipes/live.md | "直播弹幕" "直播互动" |
| webcast_to_live | webcast_id→room_id→直播流 | 直播 | 2 | recipes/live.md | "webcast转room" "直播流" |
| uid_live_status | uid→直播状态+直播流 | 直播 | 2 | recipes/live.md | "直播状态" "是否开播" |
| product_sku | 商品列表→SKU | 直播 | 2 | recipes/live.md | "商品SKU" "商品详情" |
| product_review | 商品列表→评价 | 直播 | 2 | recipes/live.md | "商品评价" "商品评分" |
| product_coupon | 商品列表→优惠券 | 直播 | 2 | recipes/live.md | "商品优惠券" "领券" |
| creator_overview_source | 看作品总览+流量来源 | 创作者 | 2 | recipes/creator.md | "作品流量来源" "流量分析" |
| creator_overview_keyword | 看作品总览+搜索关键词 | 创作者 | 2 | recipes/creator.md | "搜索关键词" "关键词分析" |
| creator_overview_audience | 看作品总览+观众画像 | 创作者 | 2 | recipes/creator.md | "观众画像" "受众分析" |
| creator_list_overview | 投稿列表→作品详情 | 创作者 | 2 | recipes/creator.md | "投稿作品" "作品列表" |
| creator_vertical_analysis | 垂类标签→投稿分析 | 创作者 | 2 | recipes/creator.md | "垂类分析" "投稿分析" |
| hotspot_related | 热点榜单→相关视频 | 创作者 | 2 | recipes/creator.md | "热点视频" "相关视频" |
| url_to_user | 从分享链接获取用户信息 | 工具→用户 | 2 | recipes/tools.md | "链接提取用户" "解析链接" |
| url_to_video | 从分享链接获取视频详情 | 工具→视频 | 2 | recipes/tools.md | "链接提取视频" "解析链接" |
| url_to_live | 从直播链接获取直播信息 | 工具→直播 | 2 | recipes/tools.md | "链接提取直播" "解析直播链接" |
| guest_cookie | 获取游客Cookie后调用Web端点 | 工具→视频/用户 | 2 | recipes/tools.md | "游客Cookie" "获取Cookie" |
| device_register | 注册设备获取App Cookie | 工具→视频/评论 | 2 | recipes/tools.md | "设备注册" "App Cookie" |
| keyword_trend | 查关键词趋势 | 内容指数 | 2 | recipes/content.md | "关键词趋势" "热度趋势" |
| keyword_trend_portrait | 查关键词趋势+画像 | 内容指数 | 2 | recipes/content.md | "关键词画像" "人群画像" |
| keyword_relation | 查关键词关联词 | 内容指数 | 2 | recipes/content.md | "关联词" "相关词" |
| daren_search_detail | 搜索达人→达人详情 | 内容指数 | 2 | recipes/content.md | "搜达人" "达人详情" |
| daren_search_fans | 搜索达人→达人粉丝 | 内容指数 | 2 | recipes/content.md | "达人粉丝" "粉丝分析" |
| daren_search_video | 搜索达人→达人视频 | 内容指数 | 2 | recipes/content.md | "达人视频" "热门视频" |
| daren_search_similar | 搜索达人→相似达人 | 内容指数 | 2 | recipes/content.md | "相似达人" "达人推荐" |
| daren_compare | 达人对比 | 内容指数 | 2 | recipes/content.md | "达人对比" "达人比较" |
| uid_encrypt_daren | uid加密→达人分析 | 内容指数 | 2 | recipes/content.md | "uid加密" "达人分析" |
| brand_search_trend | 品牌搜索→品牌趋势 | 内容指数 | 2 | recipes/content.md | "品牌趋势" "品牌分析" |
| brand_search_radar | 品牌搜索→品牌雷达 | 内容指数 | 2 | recipes/content.md | "品牌雷达" "品牌画像" |
| topic_search_detail | 话题搜索→话题详情 | 内容指数 | 2 | recipes/content.md | "话题详情" "话题分析" |
| creative_guide | 创作指南链路 | 内容指数 | 3 | recipes/content.md | "创作指南" "创作建议" |
| creative_hot_topic | 创作热门话题 | 内容指数 | 2 | recipes/content.md | "创作话题" "热门话题" |
| report_search_detail | 报告搜索→报告详情 | 内容指数 | 3 | recipes/content.md | "趋势报告" "洞察报告" |
| hot_search_video | 热搜→视频详情 | 热榜→视频 | 2 | recipes/trending.md | "热搜视频" "热搜详情" |
| hot_total_portrait | 热点总榜→作品画像 | 热榜 | 2 | recipes/trending.md | "热点画像" "作品画像" |
| hot_total_comment | 热点总榜→评论词云 | 热榜 | 2 | recipes/trending.md | "热点词云" "评论词云" |
| hot_total_trends | 热点总榜→作品趋势 | 热榜 | 2 | recipes/trending.md | "热点趋势" "作品趋势" |
| city_hot | 城市列表→同城热点 | 热榜 | 2 | recipes/trending.md | "同城热点" "城市热点" |
| tag_hot_account | 内容标签→热门账号 | 热榜 | 2 | recipes/trending.md | "热门账号" "热门博主" |
| brand_category_detail | 品牌分类→品牌详情 | 热榜 | 2 | recipes/trending.md | "品牌详情" "品牌分类" |
| hot_account_fans | 热门账号→粉丝画像 | 热榜 | 2 | recipes/trending.md | "账号粉丝画像" "粉丝分析" |
| hot_account_interest | 热门账号→粉丝兴趣 | 热榜 | 2 | recipes/trending.md | "粉丝兴趣" "粉丝关注" |
| hot_account_trends | 热门账号→账号趋势 | 热榜 | 2 | recipes/trending.md | "账号趋势" "数据趋势" |
| search_account_analysis | 搜索账号→账号分析 | 热榜 | 2 | recipes/trending.md | "账号分析" "账号搜索" |
| hotword_detail | 热词→热词详情 | 热榜 | 2 | recipes/trending.md | "热词详情" "热词分析" |
| calendar_detail | 活动日历→日历详情 | 热榜 | 2 | recipes/trending.md | "活动日历" "日历详情" |
| video_rank_detail | 视频榜→视频详情 | 热榜→视频 | 2 | recipes/trending.md | "视频榜详情" "视频排行" |
| channel_video_detail | 频道→视频详情 | 热榜→视频 | 2 | recipes/trending.md | "频道视频" "频道详情" |
| uid_kol_analysis | uid→KOL分析 | 星图 | 2 | recipes/xingtu.md | "uid转kolId" "KOL分析" |
| sec_uid_kol_analysis | sec_user_id→KOL分析 | 星图 | 2 | recipes/xingtu.md | "sec_uid转kolId" "KOL分析" |
| kol_search_detail | KOL搜索→KOL详情 | 星图 | 2 | recipes/xingtu.md | "搜KOL" "KOL详情" |
| kol_base_fans | KOL基本信息→粉丝画像 | 星图 | 2 | recipes/xingtu.md | "KOL基本信息 粉丝画像" |
| kol_base_price | KOL基本信息→服务报价 | 星图 | 2 | recipes/xingtu.md | "KOL报价" "服务报价" |
| kol_base_overview | KOL基本信息→数据概览 | 星图 | 2 | recipes/xingtu.md | "KOL基本信息 数据概览" |
| rank_catalog_data | 榜单分类→榜单数据 | 星图 | 2 | recipes/xingtu.md | "达人商业榜" "星图榜单" |
| rank_author_detail | 榜单→创作者详情 | 星图 | 2 | recipes/xingtu.md | "创作者详情" "星图详情" |
| author_business | 创作者基本信息→商业卡片 | 星图 | 2 | recipes/xingtu.md | "创作者基本信息 商业卡片" |
| author_videos | 创作者基本信息→视频列表 | 星图 | 2 | recipes/xingtu.md | "创作者视频" "星图视频" |
| ip_industry_activity | IP行业→IP活动→IP详情 | 星图 | 3 | recipes/xingtu.md | "IP日历" "IP活动" |


## 🔗 Recipe 串联图谱 (Chain Graph)

> 当 agent 完成一个 recipe 后，可按本表继续调用下游 recipe，形成跨域链路。
> 自动从 recipe 的 Output 字段与下游 Input 字段计算得出，每个源 recipe 取 top-5 最相关下游。
> 用户目标跨多个 recipe（如「搜某 UP 主 → 看其投稿 → 看视频评论」）时按本图**依序调用**，不要自行拆 atom。

| 已完成 Recipe | 输出字段 | 可继续 Recipe (按相关性排序) | 接力字段 |
|--------------|---------|----------------------------|---------|
| `author_business` (创作者基本信息→商业卡片) | `o_author_id` | `rank_author_detail` (榜单→创作者详情) | `o_author_id` |
| `author_business` (创作者基本信息→商业卡片) | `o_author_id` | `author_videos` (创作者基本信息→视频列表) | `o_author_id` |
| `author_videos` (创作者基本信息→视频列表) | `o_author_id` | `rank_author_detail` (榜单→创作者详情) | `o_author_id` |
| `author_videos` (创作者基本信息→视频列表) | `o_author_id` | `author_business` (创作者基本信息→商业卡片) | `o_author_id` |
| `batch_user_video` (批量用户→批量视频) | `sec_uid` | 🔀 `hot_account_fans` (热门账号→粉丝画像) | `sec_uid` |
| `batch_user_video` (批量用户→批量视频) | `sec_uid` | 🔀 `hot_account_interest` (热门账号→粉丝兴趣) | `sec_uid` |
| `batch_user_video` (批量用户→批量视频) | `sec_uid` | 🔀 `hot_account_trends` (热门账号→账号趋势) | `sec_uid` |
| `batch_user_video` (批量用户→批量视频) | `sec_uid` | 🔀 `search_account_analysis` (搜索账号→账号分析) | `sec_uid` |
| `batch_video_hd` (批量视频详情+高清链接) | `aweme_id` | 🔀 `user_video_hd` (看用户+视频+高清链接) | `aweme_id` |
| `batch_video_hd` (批量视频详情+高清链接) | `aweme_id` | 🔀 `comments_replies` (看评论+回复) | `aweme_id` |
| `batch_video_hd` (批量视频详情+高清链接) | `aweme_id` | 🔀 `video_comments` (看视频+评论) | `aweme_id` |
| `batch_video_hd` (批量视频详情+高清链接) | `aweme_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `aweme_id` |
| `batch_video_hd` (批量视频详情+高清链接) | `aweme_id` | 🔀 `video_danmaku` (看视频+弹幕) | `aweme_id` |
| `brand_search_radar` (品牌搜索→品牌雷达) | `keyword` | 🔀 `search_video_detail` (搜索视频→看详情) | `keyword` |
| `brand_search_radar` (品牌搜索→品牌雷达) | `keyword` | 🔀 `search_user_profile` (搜索用户→看主页) | `keyword` |
| `brand_search_radar` (品牌搜索→品牌雷达) | `keyword` | 🔀 `search_challenge_videos` (搜索话题→看视频) | `keyword` |
| `brand_search_radar` (品牌搜索→品牌雷达) | `keyword` | 🔀 `search_live_detail` (搜索直播→看直播详情) | `keyword` |
| `brand_search_radar` (品牌搜索→品牌雷达) | `keyword` | 🔀 `search_music_videos` (搜索音乐→看音乐视频) | `keyword` |
| `brand_search_trend` (品牌搜索→品牌趋势) | `keyword` | 🔀 `search_video_detail` (搜索视频→看详情) | `keyword` |
| `brand_search_trend` (品牌搜索→品牌趋势) | `keyword` | 🔀 `search_user_profile` (搜索用户→看主页) | `keyword` |
| `brand_search_trend` (品牌搜索→品牌趋势) | `keyword` | 🔀 `search_challenge_videos` (搜索话题→看视频) | `keyword` |
| `brand_search_trend` (品牌搜索→品牌趋势) | `keyword` | 🔀 `search_live_detail` (搜索直播→看直播详情) | `keyword` |
| `brand_search_trend` (品牌搜索→品牌趋势) | `keyword` | 🔀 `search_music_videos` (搜索音乐→看音乐视频) | `keyword` |
| `channel_to_video` (频道→视频详情) | `aweme_id` | 🔀 `user_video_hd` (看用户+视频+高清链接) | `aweme_id` |
| `channel_to_video` (频道→视频详情) | `aweme_id` | 🔀 `comments_replies` (看评论+回复) | `aweme_id` |
| `channel_to_video` (频道→视频详情) | `aweme_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `aweme_id` |
| `channel_to_video` (频道→视频详情) | `aweme_id` | 🔀 `video_danmaku` (看视频+弹幕) | `aweme_id` |
| `channel_to_video` (频道→视频详情) | `aweme_id` | 🔀 `url_to_video` (从分享链接获取视频详情) | `aweme_id` |
| `channel_video_detail` (频道→视频详情) | `aweme_id`, `tag_id` | 🔀 `channel_to_video` (频道→视频详情) | `aweme_id`, `tag_id` |
| `channel_video_detail` (频道→视频详情) | `aweme_id` | 🔀 `user_video_hd` (看用户+视频+高清链接) | `aweme_id` |
| `channel_video_detail` (频道→视频详情) | `aweme_id` | 🔀 `comments_replies` (看评论+回复) | `aweme_id` |
| `channel_video_detail` (频道→视频详情) | `aweme_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `aweme_id` |
| `channel_video_detail` (频道→视频详情) | `aweme_id` | 🔀 `video_danmaku` (看视频+弹幕) | `aweme_id` |
| `collects_videos` (收藏夹列表+收藏夹视频) | `cookie` | 🔀 `creator_overview_source` (看作品总览+流量来源) | `cookie` |
| `collects_videos` (收藏夹列表+收藏夹视频) | `cookie` | 🔀 `creator_overview_keyword` (看作品总览+搜索关键词) | `cookie` |
| `collects_videos` (收藏夹列表+收藏夹视频) | `cookie` | 🔀 `creator_overview_audience` (看作品总览+观众画像) | `cookie` |
| `collects_videos` (收藏夹列表+收藏夹视频) | `cookie` | 🔀 `creator_vertical_analysis` (垂类标签→投稿分析) | `cookie` |
| `collects_videos` (收藏夹列表+收藏夹视频) | `cookie` | 🔀 `creator_list_overview` (投稿列表→作品详情) | `cookie` |
| `comment_user_profile` (看评论+评论者主页) | `aweme_id`, `sec_user_id` | 🔀 `general_search_multi` (综合搜索→看视频+看用户) | `aweme_id`, `sec_user_id` |
| `comment_user_profile` (看评论+评论者主页) | `aweme_id`, `sec_user_id` | 🔀 `user_video_hd` (看用户+视频+高清链接) | `aweme_id`, `sec_user_id` |
| `comment_user_profile` (看评论+评论者主页) | `aweme_id`, `sec_user_id` | 🔀 `video_author_profile` (看视频+作者主页) | `aweme_id`, `sec_user_id` |
| `comment_user_profile` (看评论+评论者主页) | `sec_user_id` | 🔀 `uid_to_profile` (uid→sec_user_id→用户信息) | `sec_user_id` |
| `comment_user_profile` (看评论+评论者主页) | `sec_user_id` | 🔀 `user_live` (看用户+直播信息) | `sec_user_id` |
| `comments_replies` (看评论+回复) | `aweme_id`, `item_id` | 🔀 `video_detail_danmaku` (看视频+弹幕) | `aweme_id`, `item_id` |
| `comments_replies` (看评论+回复) | `aweme_id` | 🔀 `user_video_hd` (看用户+视频+高清链接) | `aweme_id` |
| `comments_replies` (看评论+回复) | `item_id` | 🔀 `creator_overview_source` (看作品总览+流量来源) | `item_id` |
| `comments_replies` (看评论+回复) | `item_id` | 🔀 `creator_overview_keyword` (看作品总览+搜索关键词) | `item_id` |
| `comments_replies` (看评论+回复) | `item_id` | 🔀 `creator_overview_audience` (看作品总览+观众画像) | `item_id` |
| `creative_guide` (创作指南链路) | `tag_id` | 🔀 `channel_to_video` (频道→视频详情) | `tag_id` |
| `creative_guide` (创作指南链路) | `keyword` | 🔀 `search_video_detail` (搜索视频→看详情) | `keyword` |
| `creative_guide` (创作指南链路) | `keyword` | 🔀 `search_user_profile` (搜索用户→看主页) | `keyword` |
| `creative_guide` (创作指南链路) | `keyword` | 🔀 `search_challenge_videos` (搜索话题→看视频) | `keyword` |
| `creative_guide` (创作指南链路) | `keyword` | 🔀 `search_live_detail` (搜索直播→看直播详情) | `keyword` |
| `creative_hot_topic` (创作热门话题) | `tag_id` | 🔀 `channel_to_video` (频道→视频详情) | `tag_id` |
| `creative_hot_topic` (创作热门话题) | `tag_id` | 🔀 `channel_video_detail` (频道→视频详情) | `tag_id` |
| `creative_hot_topic` (创作热门话题) | `end_date`, `tag_id` | `creative_guide` (创作指南链路) | `end_date`, `tag_id` |
| `creative_hot_topic` (创作热门话题) | `end_date` | `keyword_trend_portrait` (查关键词趋势+画像) | `end_date` |
| `creator_list_overview` (投稿列表→作品详情) | `cookie` | 🔀 `collects_videos` (收藏夹列表+收藏夹视频) | `cookie` |
| `creator_list_overview` (投稿列表→作品详情) | `item_id` | 🔀 `video_danmaku` (看视频+弹幕) | `item_id` |
| `creator_list_overview` (投稿列表→作品详情) | `item_id` | 🔀 `video_detail_danmaku` (看视频+弹幕) | `item_id` |
| `creator_list_overview` (投稿列表→作品详情) | `cookie` | 🔀 `guest_cookie` (获取游客Cookie后调用Web端点) | `cookie` |
| `creator_list_overview` (投稿列表→作品详情) | `cookie` | 🔀 `device_register` (注册设备获取App Cookie) | `cookie` |
| `creator_overview_audience` (看作品总览+观众画像) | `cookie` | 🔀 `collects_videos` (收藏夹列表+收藏夹视频) | `cookie` |
| `creator_overview_audience` (看作品总览+观众画像) | `item_id` | 🔀 `video_danmaku` (看视频+弹幕) | `item_id` |
| `creator_overview_audience` (看作品总览+观众画像) | `item_id` | 🔀 `video_detail_danmaku` (看视频+弹幕) | `item_id` |
| `creator_overview_audience` (看作品总览+观众画像) | `cookie` | 🔀 `guest_cookie` (获取游客Cookie后调用Web端点) | `cookie` |
| `creator_overview_audience` (看作品总览+观众画像) | `cookie` | 🔀 `device_register` (注册设备获取App Cookie) | `cookie` |
| `creator_overview_keyword` (看作品总览+搜索关键词) | `cookie` | 🔀 `collects_videos` (收藏夹列表+收藏夹视频) | `cookie` |
| `creator_overview_keyword` (看作品总览+搜索关键词) | `item_id` | 🔀 `video_danmaku` (看视频+弹幕) | `item_id` |
| `creator_overview_keyword` (看作品总览+搜索关键词) | `item_id` | 🔀 `video_detail_danmaku` (看视频+弹幕) | `item_id` |
| `creator_overview_keyword` (看作品总览+搜索关键词) | `cookie` | 🔀 `guest_cookie` (获取游客Cookie后调用Web端点) | `cookie` |
| `creator_overview_keyword` (看作品总览+搜索关键词) | `cookie` | 🔀 `device_register` (注册设备获取App Cookie) | `cookie` |
| `creator_overview_source` (看作品总览+流量来源) | `cookie` | 🔀 `collects_videos` (收藏夹列表+收藏夹视频) | `cookie` |
| `creator_overview_source` (看作品总览+流量来源) | `item_id` | 🔀 `video_danmaku` (看视频+弹幕) | `item_id` |
| `creator_overview_source` (看作品总览+流量来源) | `item_id` | 🔀 `video_detail_danmaku` (看视频+弹幕) | `item_id` |
| `creator_overview_source` (看作品总览+流量来源) | `cookie` | 🔀 `guest_cookie` (获取游客Cookie后调用Web端点) | `cookie` |
| `creator_overview_source` (看作品总览+流量来源) | `cookie` | 🔀 `device_register` (注册设备获取App Cookie) | `cookie` |
| `creator_vertical_analysis` (垂类标签→投稿分析) | `cookie` | 🔀 `collects_videos` (收藏夹列表+收藏夹视频) | `cookie` |
| `creator_vertical_analysis` (垂类标签→投稿分析) | `item_id` | 🔀 `video_danmaku` (看视频+弹幕) | `item_id` |
| `creator_vertical_analysis` (垂类标签→投稿分析) | `item_id` | 🔀 `video_detail_danmaku` (看视频+弹幕) | `item_id` |
| `creator_vertical_analysis` (垂类标签→投稿分析) | `cookie` | 🔀 `guest_cookie` (获取游客Cookie后调用Web端点) | `cookie` |
| `creator_vertical_analysis` (垂类标签→投稿分析) | `cookie` | 🔀 `device_register` (注册设备获取App Cookie) | `cookie` |
| `daren_compare` (达人对比) | `keyword` | 🔀 `search_video_detail` (搜索视频→看详情) | `keyword` |
| `daren_compare` (达人对比) | `keyword` | 🔀 `search_user_profile` (搜索用户→看主页) | `keyword` |
| `daren_compare` (达人对比) | `keyword` | 🔀 `search_challenge_videos` (搜索话题→看视频) | `keyword` |
| `daren_compare` (达人对比) | `keyword` | 🔀 `search_live_detail` (搜索直播→看直播详情) | `keyword` |
| `daren_compare` (达人对比) | `keyword` | 🔀 `search_music_videos` (搜索音乐→看音乐视频) | `keyword` |
| `daren_search_detail` (搜索达人→达人详情) | `keyword` | 🔀 `search_video_detail` (搜索视频→看详情) | `keyword` |
| `daren_search_detail` (搜索达人→达人详情) | `keyword` | 🔀 `search_user_profile` (搜索用户→看主页) | `keyword` |
| `daren_search_detail` (搜索达人→达人详情) | `keyword` | 🔀 `search_challenge_videos` (搜索话题→看视频) | `keyword` |
| `daren_search_detail` (搜索达人→达人详情) | `keyword` | 🔀 `search_live_detail` (搜索直播→看直播详情) | `keyword` |
| `daren_search_detail` (搜索达人→达人详情) | `keyword` | 🔀 `search_music_videos` (搜索音乐→看音乐视频) | `keyword` |
| `daren_search_fans` (搜索达人→达人粉丝) | `keyword` | 🔀 `search_video_detail` (搜索视频→看详情) | `keyword` |
| `daren_search_fans` (搜索达人→达人粉丝) | `keyword` | 🔀 `search_user_profile` (搜索用户→看主页) | `keyword` |
| `daren_search_fans` (搜索达人→达人粉丝) | `keyword` | 🔀 `search_challenge_videos` (搜索话题→看视频) | `keyword` |
| `daren_search_fans` (搜索达人→达人粉丝) | `keyword` | 🔀 `search_live_detail` (搜索直播→看直播详情) | `keyword` |
| `daren_search_fans` (搜索达人→达人粉丝) | `keyword` | 🔀 `search_music_videos` (搜索音乐→看音乐视频) | `keyword` |
| `daren_search_similar` (搜索达人→相似达人) | `keyword` | 🔀 `search_video_detail` (搜索视频→看详情) | `keyword` |
| `daren_search_similar` (搜索达人→相似达人) | `keyword` | 🔀 `search_user_profile` (搜索用户→看主页) | `keyword` |
| `daren_search_similar` (搜索达人→相似达人) | `keyword` | 🔀 `search_challenge_videos` (搜索话题→看视频) | `keyword` |
| `daren_search_similar` (搜索达人→相似达人) | `keyword` | 🔀 `search_live_detail` (搜索直播→看直播详情) | `keyword` |
| `daren_search_similar` (搜索达人→相似达人) | `keyword` | 🔀 `search_music_videos` (搜索音乐→看音乐视频) | `keyword` |
| `daren_search_video` (搜索达人→达人视频) | `keyword` | 🔀 `search_video_detail` (搜索视频→看详情) | `keyword` |
| `daren_search_video` (搜索达人→达人视频) | `keyword` | 🔀 `search_user_profile` (搜索用户→看主页) | `keyword` |
| `daren_search_video` (搜索达人→达人视频) | `keyword` | 🔀 `search_challenge_videos` (搜索话题→看视频) | `keyword` |
| `daren_search_video` (搜索达人→达人视频) | `keyword` | 🔀 `search_live_detail` (搜索直播→看直播详情) | `keyword` |
| `daren_search_video` (搜索达人→达人视频) | `keyword` | 🔀 `search_music_videos` (搜索音乐→看音乐视频) | `keyword` |
| `device_register` (注册设备获取App Cookie) | `cookie` | 🔀 `collects_videos` (收藏夹列表+收藏夹视频) | `cookie` |
| `device_register` (注册设备获取App Cookie) | `cookie` | 🔀 `creator_overview_source` (看作品总览+流量来源) | `cookie` |
| `device_register` (注册设备获取App Cookie) | `cookie` | 🔀 `creator_overview_keyword` (看作品总览+搜索关键词) | `cookie` |
| `device_register` (注册设备获取App Cookie) | `cookie` | 🔀 `creator_overview_audience` (看作品总览+观众画像) | `cookie` |
| `device_register` (注册设备获取App Cookie) | `cookie` | 🔀 `creator_vertical_analysis` (垂类标签→投稿分析) | `cookie` |
| `feed_to_video` (Feed→视频详情) | `aweme_id` | 🔀 `user_video_hd` (看用户+视频+高清链接) | `aweme_id` |
| `feed_to_video` (Feed→视频详情) | `aweme_id` | 🔀 `comments_replies` (看评论+回复) | `aweme_id` |
| `feed_to_video` (Feed→视频详情) | `aweme_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `aweme_id` |
| `feed_to_video` (Feed→视频详情) | `aweme_id` | 🔀 `video_danmaku` (看视频+弹幕) | `aweme_id` |
| `feed_to_video` (Feed→视频详情) | `aweme_id` | 🔀 `url_to_video` (从分享链接获取视频详情) | `aweme_id` |
| `general_search_multi` (综合搜索→看视频+看用户) | `keyword`, `sec_uid` | 🔀 `search_account_analysis` (搜索账号→账号分析) | `keyword`, `sec_uid` |
| `general_search_multi` (综合搜索→看视频+看用户) | `aweme_id`, `sec_user_id` | 🔀 `user_video_hd` (看用户+视频+高清链接) | `aweme_id`, `sec_user_id` |
| `general_search_multi` (综合搜索→看视频+看用户) | `aweme_id`, `sec_user_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `aweme_id`, `sec_user_id` |
| `general_search_multi` (综合搜索→看视频+看用户) | `aweme_id`, `sec_user_id` | 🔀 `video_author_profile` (看视频+作者主页) | `aweme_id`, `sec_user_id` |
| `general_search_multi` (综合搜索→看视频+看用户) | `sec_user_id` | 🔀 `uid_to_profile` (uid→sec_user_id→用户信息) | `sec_user_id` |
| `guest_cookie` (获取游客Cookie后调用Web端点) | `cookie` | 🔀 `collects_videos` (收藏夹列表+收藏夹视频) | `cookie` |
| `guest_cookie` (获取游客Cookie后调用Web端点) | `cookie` | 🔀 `creator_overview_source` (看作品总览+流量来源) | `cookie` |
| `guest_cookie` (获取游客Cookie后调用Web端点) | `cookie` | 🔀 `creator_overview_keyword` (看作品总览+搜索关键词) | `cookie` |
| `guest_cookie` (获取游客Cookie后调用Web端点) | `cookie` | 🔀 `creator_overview_audience` (看作品总览+观众画像) | `cookie` |
| `guest_cookie` (获取游客Cookie后调用Web端点) | `cookie` | 🔀 `creator_vertical_analysis` (垂类标签→投稿分析) | `cookie` |
| `hashtag_detail_videos` (话题详情+视频列表) | `ch_id` | 🔀 `search_challenge_videos` (搜索话题→看视频) | `ch_id` |
| `hot_account_fans` (热门账号→粉丝画像) | `query_tag`, `sec_uid` | `hot_account_interest` (热门账号→粉丝兴趣) | `query_tag`, `sec_uid` |
| `hot_account_fans` (热门账号→粉丝画像) | `query_tag`, `sec_uid` | `hot_account_trends` (热门账号→账号趋势) | `query_tag`, `sec_uid` |
| `hot_account_fans` (热门账号→粉丝画像) | `sec_uid` | `search_account_analysis` (搜索账号→账号分析) | `sec_uid` |
| `hot_account_fans` (热门账号→粉丝画像) | `query_tag` | `tag_hot_account` (内容标签→热门账号) | `query_tag` |
| `hot_account_interest` (热门账号→粉丝兴趣) | `query_tag`, `sec_uid` | `hot_account_fans` (热门账号→粉丝画像) | `query_tag`, `sec_uid` |
| `hot_account_interest` (热门账号→粉丝兴趣) | `query_tag`, `sec_uid` | `hot_account_trends` (热门账号→账号趋势) | `query_tag`, `sec_uid` |
| `hot_account_interest` (热门账号→粉丝兴趣) | `sec_uid` | `search_account_analysis` (搜索账号→账号分析) | `sec_uid` |
| `hot_account_interest` (热门账号→粉丝兴趣) | `query_tag` | `tag_hot_account` (内容标签→热门账号) | `query_tag` |
| `hot_account_trends` (热门账号→账号趋势) | `query_tag`, `sec_uid` | `hot_account_fans` (热门账号→粉丝画像) | `query_tag`, `sec_uid` |
| `hot_account_trends` (热门账号→账号趋势) | `query_tag`, `sec_uid` | `hot_account_interest` (热门账号→粉丝兴趣) | `query_tag`, `sec_uid` |
| `hot_account_trends` (热门账号→账号趋势) | `sec_uid` | `search_account_analysis` (搜索账号→账号分析) | `sec_uid` |
| `hot_account_trends` (热门账号→账号趋势) | `query_tag` | `tag_hot_account` (内容标签→热门账号) | `query_tag` |
| `hot_search_video` (热搜→视频详情) | `aweme_id` | 🔀 `user_video_hd` (看用户+视频+高清链接) | `aweme_id` |
| `hot_search_video` (热搜→视频详情) | `aweme_id` | 🔀 `comments_replies` (看评论+回复) | `aweme_id` |
| `hot_search_video` (热搜→视频详情) | `aweme_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `aweme_id` |
| `hot_search_video` (热搜→视频详情) | `aweme_id` | 🔀 `video_danmaku` (看视频+弹幕) | `aweme_id` |
| `hot_search_video` (热搜→视频详情) | `aweme_id` | 🔀 `url_to_video` (从分享链接获取视频详情) | `aweme_id` |
| `hot_total_comment` (热点总榜→评论词云) | `aweme_id` | 🔀 `user_video_hd` (看用户+视频+高清链接) | `aweme_id` |
| `hot_total_comment` (热点总榜→评论词云) | `aweme_id` | 🔀 `comments_replies` (看评论+回复) | `aweme_id` |
| `hot_total_comment` (热点总榜→评论词云) | `aweme_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `aweme_id` |
| `hot_total_comment` (热点总榜→评论词云) | `aweme_id` | 🔀 `video_danmaku` (看视频+弹幕) | `aweme_id` |
| `hot_total_comment` (热点总榜→评论词云) | `aweme_id` | 🔀 `url_to_video` (从分享链接获取视频详情) | `aweme_id` |
| `hot_total_portrait` (热点总榜→作品画像) | `aweme_id` | 🔀 `user_video_hd` (看用户+视频+高清链接) | `aweme_id` |
| `hot_total_portrait` (热点总榜→作品画像) | `aweme_id` | 🔀 `comments_replies` (看评论+回复) | `aweme_id` |
| `hot_total_portrait` (热点总榜→作品画像) | `aweme_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `aweme_id` |
| `hot_total_portrait` (热点总榜→作品画像) | `aweme_id` | 🔀 `video_danmaku` (看视频+弹幕) | `aweme_id` |
| `hot_total_portrait` (热点总榜→作品画像) | `aweme_id` | 🔀 `url_to_video` (从分享链接获取视频详情) | `aweme_id` |
| `hot_total_trends` (热点总榜→作品趋势) | `aweme_id` | 🔀 `user_video_hd` (看用户+视频+高清链接) | `aweme_id` |
| `hot_total_trends` (热点总榜→作品趋势) | `aweme_id` | 🔀 `comments_replies` (看评论+回复) | `aweme_id` |
| `hot_total_trends` (热点总榜→作品趋势) | `aweme_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `aweme_id` |
| `hot_total_trends` (热点总榜→作品趋势) | `aweme_id` | 🔀 `video_danmaku` (看视频+弹幕) | `aweme_id` |
| `hot_total_trends` (热点总榜→作品趋势) | `aweme_id` | 🔀 `url_to_video` (从分享链接获取视频详情) | `aweme_id` |
| `hotword_detail` (热词→热词详情) | `keyword` | 🔀 `keyword_trend_portrait` (查关键词趋势+画像) | `keyword` |
| `hotword_detail` (热词→热词详情) | `keyword` | 🔀 `keyword_relation` (查关键词关联词) | `keyword` |
| `hotword_detail` (热词→热词详情) | `keyword` | 🔀 `daren_search_detail` (搜索达人→达人详情) | `keyword` |
| `hotword_detail` (热词→热词详情) | `keyword` | 🔀 `daren_search_fans` (搜索达人→达人粉丝) | `keyword` |
| `hotword_detail` (热词→热词详情) | `keyword` | 🔀 `daren_search_video` (搜索达人→达人视频) | `keyword` |
| `keyword_relation` (查关键词关联词) | `keyword` | 🔀 `search_video_detail` (搜索视频→看详情) | `keyword` |
| `keyword_relation` (查关键词关联词) | `keyword` | 🔀 `search_user_profile` (搜索用户→看主页) | `keyword` |
| `keyword_relation` (查关键词关联词) | `keyword` | 🔀 `search_challenge_videos` (搜索话题→看视频) | `keyword` |
| `keyword_relation` (查关键词关联词) | `keyword` | 🔀 `search_live_detail` (搜索直播→看直播详情) | `keyword` |
| `keyword_relation` (查关键词关联词) | `keyword` | 🔀 `search_music_videos` (搜索音乐→看音乐视频) | `keyword` |
| `keyword_trend` (查关键词趋势) | `end_date`, `keyword_list` | `keyword_trend_portrait` (查关键词趋势+画像) | `end_date`, `keyword_list` |
| `keyword_trend` (查关键词趋势) | `keyword_list` | `keyword_relation` (查关键词关联词) | `keyword_list` |
| `keyword_trend` (查关键词趋势) | `end_date` | `creative_guide` (创作指南链路) | `end_date` |
| `keyword_trend` (查关键词趋势) | `end_date` | `creative_hot_topic` (创作热门话题) | `end_date` |
| `keyword_trend_portrait` (查关键词趋势+画像) | `keyword` | 🔀 `search_video_detail` (搜索视频→看详情) | `keyword` |
| `keyword_trend_portrait` (查关键词趋势+画像) | `keyword` | 🔀 `search_user_profile` (搜索用户→看主页) | `keyword` |
| `keyword_trend_portrait` (查关键词趋势+画像) | `keyword` | 🔀 `search_challenge_videos` (搜索话题→看视频) | `keyword` |
| `keyword_trend_portrait` (查关键词趋势+画像) | `keyword` | 🔀 `search_live_detail` (搜索直播→看直播详情) | `keyword` |
| `keyword_trend_portrait` (查关键词趋势+画像) | `keyword` | 🔀 `search_music_videos` (搜索音乐→看音乐视频) | `keyword` |
| `kol_base_fans` (KOL基本信息→粉丝画像) | `kolId` | `uid_kol_analysis` (uid→KOL分析) | `kolId` |
| `kol_base_fans` (KOL基本信息→粉丝画像) | `kolId` | `sec_uid_kol_analysis` (sec_user_id→KOL分析) | `kolId` |
| `kol_base_fans` (KOL基本信息→粉丝画像) | `kolId` | `kol_search_detail` (KOL搜索→KOL详情) | `kolId` |
| `kol_base_fans` (KOL基本信息→粉丝画像) | `kolId` | `kol_base_price` (KOL基本信息→服务报价) | `kolId` |
| `kol_base_fans` (KOL基本信息→粉丝画像) | `kolId` | `kol_base_overview` (KOL基本信息→数据概览) | `kolId` |
| `kol_base_overview` (KOL基本信息→数据概览) | `kolId` | `uid_kol_analysis` (uid→KOL分析) | `kolId` |
| `kol_base_overview` (KOL基本信息→数据概览) | `kolId` | `sec_uid_kol_analysis` (sec_user_id→KOL分析) | `kolId` |
| `kol_base_overview` (KOL基本信息→数据概览) | `kolId` | `kol_search_detail` (KOL搜索→KOL详情) | `kolId` |
| `kol_base_overview` (KOL基本信息→数据概览) | `kolId` | `kol_base_price` (KOL基本信息→服务报价) | `kolId` |
| `kol_base_overview` (KOL基本信息→数据概览) | `kolId` | `kol_base_fans` (KOL基本信息→粉丝画像) | `kolId` |
| `kol_base_price` (KOL基本信息→服务报价) | `kolId` | `uid_kol_analysis` (uid→KOL分析) | `kolId` |
| `kol_base_price` (KOL基本信息→服务报价) | `kolId` | `sec_uid_kol_analysis` (sec_user_id→KOL分析) | `kolId` |
| `kol_base_price` (KOL基本信息→服务报价) | `kolId` | `kol_search_detail` (KOL搜索→KOL详情) | `kolId` |
| `kol_base_price` (KOL基本信息→服务报价) | `kolId` | `kol_base_fans` (KOL基本信息→粉丝画像) | `kolId` |
| `kol_base_price` (KOL基本信息→服务报价) | `kolId` | `kol_base_overview` (KOL基本信息→数据概览) | `kolId` |
| `kol_search_detail` (KOL搜索→KOL详情) | `keyword` | 🔀 `keyword_trend_portrait` (查关键词趋势+画像) | `keyword` |
| `kol_search_detail` (KOL搜索→KOL详情) | `keyword` | 🔀 `keyword_relation` (查关键词关联词) | `keyword` |
| `kol_search_detail` (KOL搜索→KOL详情) | `keyword` | 🔀 `daren_search_detail` (搜索达人→达人详情) | `keyword` |
| `kol_search_detail` (KOL搜索→KOL详情) | `keyword` | 🔀 `daren_search_fans` (搜索达人→达人粉丝) | `keyword` |
| `kol_search_detail` (KOL搜索→KOL详情) | `keyword` | 🔀 `daren_search_video` (搜索达人→达人视频) | `keyword` |
| `live_danmaku_ws` (看直播+弹幕) | `webcast_id` | 🔀 `url_to_live` (从直播链接获取直播信息) | `webcast_id` |
| `live_danmaku_ws` (看直播+弹幕) | `room_id` | 🔀 `search_live_detail` (搜索直播→看直播详情) | `room_id` |
| `live_danmaku_ws` (看直播+弹幕) | `room_id`, `webcast_id` | `live_gift_rank` (看直播+送礼排行) | `room_id`, `webcast_id` |
| `live_danmaku_ws` (看直播+弹幕) | `room_id`, `webcast_id` | `live_products` (看直播+商品列表) | `room_id`, `webcast_id` |
| `live_danmaku_ws` (看直播+弹幕) | `room_id`, `webcast_id` | `webcast_to_live` (webcast_id→room_id→直播流) | `room_id`, `webcast_id` |
| `live_gift_rank` (看直播+送礼排行) | `webcast_id` | 🔀 `url_to_live` (从直播链接获取直播信息) | `webcast_id` |
| `live_gift_rank` (看直播+送礼排行) | `room_id` | 🔀 `search_live_detail` (搜索直播→看直播详情) | `room_id` |
| `live_gift_rank` (看直播+送礼排行) | `room_id`, `webcast_id` | `live_products` (看直播+商品列表) | `room_id`, `webcast_id` |
| `live_gift_rank` (看直播+送礼排行) | `room_id`, `webcast_id` | `live_danmaku_ws` (看直播+弹幕) | `room_id`, `webcast_id` |
| `live_gift_rank` (看直播+送礼排行) | `room_id`, `webcast_id` | `webcast_to_live` (webcast_id→room_id→直播流) | `room_id`, `webcast_id` |
| `live_products` (看直播+商品列表) | `webcast_id` | 🔀 `url_to_live` (从直播链接获取直播信息) | `webcast_id` |
| `live_products` (看直播+商品列表) | `room_id` | 🔀 `search_live_detail` (搜索直播→看直播详情) | `room_id` |
| `live_products` (看直播+商品列表) | `id` | 🔀 `ip_industry_activity` (IP行业→IP活动→IP详情) | `id` |
| `live_products` (看直播+商品列表) | `author_id`, `room_id` | `product_sku` (商品列表→SKU) | `author_id`, `room_id` |
| `live_products` (看直播+商品列表) | `room_id`, `webcast_id` | `live_gift_rank` (看直播+送礼排行) | `room_id`, `webcast_id` |
| `music_detail_videos` (音乐详情+视频列表) | `music_id` | 🔀 `search_music_videos` (搜索音乐→看音乐视频) | `music_id` |
| `product_coupon` (商品列表→优惠券) | `sec_user_id` | 🔀 `uid_to_profile` (uid→sec_user_id→用户信息) | `sec_user_id` |
| `product_coupon` (商品列表→优惠券) | `sec_user_id` | 🔀 `user_live` (看用户+直播信息) | `sec_user_id` |
| `product_coupon` (商品列表→优惠券) | `sec_user_id` | 🔀 `user_video_hd` (看用户+视频+高清链接) | `sec_user_id` |
| `product_coupon` (商品列表→优惠券) | `sec_user_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `sec_user_id` |
| `product_coupon` (商品列表→优惠券) | `sec_user_id` | 🔀 `url_to_user` (从分享链接获取用户信息) | `sec_user_id` |
| `product_review` (商品列表→评价) | `room_id` | 🔀 `search_live_detail` (搜索直播→看直播详情) | `room_id` |
| `product_review` (商品列表→评价) | `product_id`, `room_id`, `shop_id` | `product_coupon` (商品列表→优惠券) | `product_id`, `room_id`, `shop_id` |
| `product_review` (商品列表→评价) | `product_id`, `room_id` | `product_sku` (商品列表→SKU) | `product_id`, `room_id` |
| `product_review` (商品列表→评价) | `room_id` | `live_gift_rank` (看直播+送礼排行) | `room_id` |
| `product_review` (商品列表→评价) | `room_id` | `live_products` (看直播+商品列表) | `room_id` |
| `product_sku` (商品列表→SKU) | `room_id` | 🔀 `search_live_detail` (搜索直播→看直播详情) | `room_id` |
| `product_sku` (商品列表→SKU) | `product_id`, `room_id` | `product_review` (商品列表→评价) | `product_id`, `room_id` |
| `product_sku` (商品列表→SKU) | `product_id`, `room_id` | `product_coupon` (商品列表→优惠券) | `product_id`, `room_id` |
| `product_sku` (商品列表→SKU) | `room_id` | `live_gift_rank` (看直播+送礼排行) | `room_id` |
| `product_sku` (商品列表→SKU) | `room_id` | `live_products` (看直播+商品列表) | `room_id` |
| `rank_author_detail` (榜单→创作者详情) | `code` | `rank_catalog_data` (榜单分类→榜单数据) | `code` |
| `rank_author_detail` (榜单→创作者详情) | `o_author_id` | `author_business` (创作者基本信息→商业卡片) | `o_author_id` |
| `rank_author_detail` (榜单→创作者详情) | `o_author_id` | `author_videos` (创作者基本信息→视频列表) | `o_author_id` |
| `rank_catalog_data` (榜单分类→榜单数据) | `code` | `rank_author_detail` (榜单→创作者详情) | `code` |
| `report_search_detail` (报告搜索→报告详情) | `keyword` | 🔀 `search_video_detail` (搜索视频→看详情) | `keyword` |
| `report_search_detail` (报告搜索→报告详情) | `keyword` | 🔀 `search_user_profile` (搜索用户→看主页) | `keyword` |
| `report_search_detail` (报告搜索→报告详情) | `keyword` | 🔀 `search_challenge_videos` (搜索话题→看视频) | `keyword` |
| `report_search_detail` (报告搜索→报告详情) | `keyword` | 🔀 `search_live_detail` (搜索直播→看直播详情) | `keyword` |
| `report_search_detail` (报告搜索→报告详情) | `keyword` | 🔀 `search_music_videos` (搜索音乐→看音乐视频) | `keyword` |
| `search_account_analysis` (搜索账号→账号分析) | `keyword` | 🔀 `keyword_trend_portrait` (查关键词趋势+画像) | `keyword` |
| `search_account_analysis` (搜索账号→账号分析) | `keyword` | 🔀 `keyword_relation` (查关键词关联词) | `keyword` |
| `search_account_analysis` (搜索账号→账号分析) | `keyword` | 🔀 `daren_search_detail` (搜索达人→达人详情) | `keyword` |
| `search_account_analysis` (搜索账号→账号分析) | `keyword` | 🔀 `daren_search_fans` (搜索达人→达人粉丝) | `keyword` |
| `search_account_analysis` (搜索账号→账号分析) | `keyword` | 🔀 `daren_search_video` (搜索达人→达人视频) | `keyword` |
| `search_challenge_videos` (搜索话题→看视频) | `keyword` | 🔀 `keyword_trend_portrait` (查关键词趋势+画像) | `keyword` |
| `search_challenge_videos` (搜索话题→看视频) | `keyword` | 🔀 `keyword_relation` (查关键词关联词) | `keyword` |
| `search_challenge_videos` (搜索话题→看视频) | `keyword` | 🔀 `daren_search_detail` (搜索达人→达人详情) | `keyword` |
| `search_challenge_videos` (搜索话题→看视频) | `keyword` | 🔀 `daren_search_fans` (搜索达人→达人粉丝) | `keyword` |
| `search_challenge_videos` (搜索话题→看视频) | `keyword` | 🔀 `daren_search_video` (搜索达人→达人视频) | `keyword` |
| `search_live_detail` (搜索直播→看直播详情) | `room_id` | 🔀 `live_gift_rank` (看直播+送礼排行) | `room_id` |
| `search_live_detail` (搜索直播→看直播详情) | `room_id` | 🔀 `live_products` (看直播+商品列表) | `room_id` |
| `search_live_detail` (搜索直播→看直播详情) | `room_id` | 🔀 `live_danmaku_ws` (看直播+弹幕) | `room_id` |
| `search_live_detail` (搜索直播→看直播详情) | `room_id` | 🔀 `webcast_to_live` (webcast_id→room_id→直播流) | `room_id` |
| `search_live_detail` (搜索直播→看直播详情) | `room_id` | 🔀 `uid_live_status` (uid→直播状态+直播流) | `room_id` |
| `search_music_videos` (搜索音乐→看音乐视频) | `keyword` | 🔀 `keyword_trend_portrait` (查关键词趋势+画像) | `keyword` |
| `search_music_videos` (搜索音乐→看音乐视频) | `keyword` | 🔀 `keyword_relation` (查关键词关联词) | `keyword` |
| `search_music_videos` (搜索音乐→看音乐视频) | `keyword` | 🔀 `daren_search_detail` (搜索达人→达人详情) | `keyword` |
| `search_music_videos` (搜索音乐→看音乐视频) | `keyword` | 🔀 `daren_search_fans` (搜索达人→达人粉丝) | `keyword` |
| `search_music_videos` (搜索音乐→看音乐视频) | `keyword` | 🔀 `daren_search_video` (搜索达人→达人视频) | `keyword` |
| `search_user_profile` (搜索用户→看主页) | `keyword`, `sec_uid` | 🔀 `search_account_analysis` (搜索账号→账号分析) | `keyword`, `sec_uid` |
| `search_user_profile` (搜索用户→看主页) | `sec_user_id` | 🔀 `uid_to_profile` (uid→sec_user_id→用户信息) | `sec_user_id` |
| `search_user_profile` (搜索用户→看主页) | `sec_user_id` | 🔀 `user_live` (看用户+直播信息) | `sec_user_id` |
| `search_user_profile` (搜索用户→看主页) | `sec_user_id` | 🔀 `user_video_hd` (看用户+视频+高清链接) | `sec_user_id` |
| `search_user_profile` (搜索用户→看主页) | `sec_user_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `sec_user_id` |
| `search_video_detail` (搜索视频→看详情) | `aweme_id` | 🔀 `user_video_hd` (看用户+视频+高清链接) | `aweme_id` |
| `search_video_detail` (搜索视频→看详情) | `aweme_id` | 🔀 `comments_replies` (看评论+回复) | `aweme_id` |
| `search_video_detail` (搜索视频→看详情) | `aweme_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `aweme_id` |
| `search_video_detail` (搜索视频→看详情) | `aweme_id` | 🔀 `video_danmaku` (看视频+弹幕) | `aweme_id` |
| `search_video_detail` (搜索视频→看详情) | `aweme_id` | 🔀 `url_to_video` (从分享链接获取视频详情) | `aweme_id` |
| `sec_uid_kol_analysis` (sec_user_id→KOL分析) | `sec_user_id` | 🔀 `uid_to_profile` (uid→sec_user_id→用户信息) | `sec_user_id` |
| `sec_uid_kol_analysis` (sec_user_id→KOL分析) | `sec_user_id` | 🔀 `user_live` (看用户+直播信息) | `sec_user_id` |
| `sec_uid_kol_analysis` (sec_user_id→KOL分析) | `sec_user_id` | 🔀 `user_video_hd` (看用户+视频+高清链接) | `sec_user_id` |
| `sec_uid_kol_analysis` (sec_user_id→KOL分析) | `sec_user_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `sec_user_id` |
| `sec_uid_kol_analysis` (sec_user_id→KOL分析) | `sec_user_id` | 🔀 `product_coupon` (商品列表→优惠券) | `sec_user_id` |
| `share_to_video_hd` (分享链接→视频详情+高清) | `aweme_id` | 🔀 `user_video_hd` (看用户+视频+高清链接) | `aweme_id` |
| `share_to_video_hd` (分享链接→视频详情+高清) | `aweme_id` | 🔀 `comments_replies` (看评论+回复) | `aweme_id` |
| `share_to_video_hd` (分享链接→视频详情+高清) | `aweme_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `aweme_id` |
| `share_to_video_hd` (分享链接→视频详情+高清) | `aweme_id` | 🔀 `video_danmaku` (看视频+弹幕) | `aweme_id` |
| `share_to_video_hd` (分享链接→视频详情+高清) | `aweme_id` | 🔀 `url_to_video` (从分享链接获取视频详情) | `aweme_id` |
| `tag_hot_account` (内容标签→热门账号) | `query_tag` | `hot_account_fans` (热门账号→粉丝画像) | `query_tag` |
| `tag_hot_account` (内容标签→热门账号) | `query_tag` | `hot_account_interest` (热门账号→粉丝兴趣) | `query_tag` |
| `tag_hot_account` (内容标签→热门账号) | `query_tag` | `hot_account_trends` (热门账号→账号趋势) | `query_tag` |
| `topic_search_detail` (话题搜索→话题详情) | `keyword` | 🔀 `search_video_detail` (搜索视频→看详情) | `keyword` |
| `topic_search_detail` (话题搜索→话题详情) | `keyword` | 🔀 `search_user_profile` (搜索用户→看主页) | `keyword` |
| `topic_search_detail` (话题搜索→话题详情) | `keyword` | 🔀 `search_challenge_videos` (搜索话题→看视频) | `keyword` |
| `topic_search_detail` (话题搜索→话题详情) | `keyword` | 🔀 `search_live_detail` (搜索直播→看直播详情) | `keyword` |
| `topic_search_detail` (话题搜索→话题详情) | `keyword` | 🔀 `search_music_videos` (搜索音乐→看音乐视频) | `keyword` |
| `uid_encrypt_daren` (uid加密→达人分析) | `uid` | 🔀 `uid_to_profile` (uid→sec_user_id→用户信息) | `uid` |
| `uid_encrypt_daren` (uid加密→达人分析) | `uid` | 🔀 `user_live` (看用户+直播信息) | `uid` |
| `uid_encrypt_daren` (uid加密→达人分析) | `uid` | 🔀 `uid_live_status` (uid→直播状态+直播流) | `uid` |
| `uid_encrypt_daren` (uid加密→达人分析) | `uid` | 🔀 `uid_kol_analysis` (uid→KOL分析) | `uid` |
| `uid_encrypt_daren` (uid加密→达人分析) | `user_id` | `daren_search_detail` (搜索达人→达人详情) | `user_id` |
| `uid_kol_analysis` (uid→KOL分析) | `uid` | 🔀 `uid_to_profile` (uid→sec_user_id→用户信息) | `uid` |
| `uid_kol_analysis` (uid→KOL分析) | `uid` | 🔀 `user_live` (看用户+直播信息) | `uid` |
| `uid_kol_analysis` (uid→KOL分析) | `uid` | 🔀 `uid_live_status` (uid→直播状态+直播流) | `uid` |
| `uid_kol_analysis` (uid→KOL分析) | `uid` | 🔀 `uid_encrypt_daren` (uid加密→达人分析) | `uid` |
| `uid_kol_analysis` (uid→KOL分析) | `kolId` | `sec_uid_kol_analysis` (sec_user_id→KOL分析) | `kolId` |
| `uid_live_status` (uid→直播状态+直播流) | `uid` | 🔀 `uid_to_profile` (uid→sec_user_id→用户信息) | `uid` |
| `uid_live_status` (uid→直播状态+直播流) | `uid` | 🔀 `user_live` (看用户+直播信息) | `uid` |
| `uid_live_status` (uid→直播状态+直播流) | `uid` | 🔀 `uid_encrypt_daren` (uid加密→达人分析) | `uid` |
| `uid_live_status` (uid→直播状态+直播流) | `room_id` | 🔀 `search_live_detail` (搜索直播→看直播详情) | `room_id` |
| `uid_live_status` (uid→直播状态+直播流) | `uid` | 🔀 `uid_kol_analysis` (uid→KOL分析) | `uid` |
| `uid_to_profile` (uid→sec_user_id→用户信息) | `sec_user_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `sec_user_id` |
| `uid_to_profile` (uid→sec_user_id→用户信息) | `uid` | 🔀 `uid_live_status` (uid→直播状态+直播流) | `uid` |
| `uid_to_profile` (uid→sec_user_id→用户信息) | `sec_user_id` | 🔀 `product_coupon` (商品列表→优惠券) | `sec_user_id` |
| `uid_to_profile` (uid→sec_user_id→用户信息) | `sec_user_id` | 🔀 `url_to_user` (从分享链接获取用户信息) | `sec_user_id` |
| `uid_to_profile` (uid→sec_user_id→用户信息) | `sec_user_id` | 🔀 `video_author_profile` (看视频+作者主页) | `sec_user_id` |
| `url_to_live` (从直播链接获取直播信息) | `webcast_id` | 🔀 `live_gift_rank` (看直播+送礼排行) | `webcast_id` |
| `url_to_live` (从直播链接获取直播信息) | `webcast_id` | 🔀 `live_products` (看直播+商品列表) | `webcast_id` |
| `url_to_live` (从直播链接获取直播信息) | `webcast_id` | 🔀 `live_danmaku_ws` (看直播+弹幕) | `webcast_id` |
| `url_to_live` (从直播链接获取直播信息) | `webcast_id` | 🔀 `webcast_to_live` (webcast_id→room_id→直播流) | `webcast_id` |
| `url_to_live` (从直播链接获取直播信息) | `url` | `url_to_user` (从分享链接获取用户信息) | `url` |
| `url_to_user` (从分享链接获取用户信息) | `sec_user_id` | 🔀 `uid_to_profile` (uid→sec_user_id→用户信息) | `sec_user_id` |
| `url_to_user` (从分享链接获取用户信息) | `sec_user_id` | 🔀 `user_live` (看用户+直播信息) | `sec_user_id` |
| `url_to_user` (从分享链接获取用户信息) | `sec_user_id` | 🔀 `user_video_hd` (看用户+视频+高清链接) | `sec_user_id` |
| `url_to_user` (从分享链接获取用户信息) | `sec_user_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `sec_user_id` |
| `url_to_user` (从分享链接获取用户信息) | `sec_user_id` | 🔀 `product_coupon` (商品列表→优惠券) | `sec_user_id` |
| `url_to_video` (从分享链接获取视频详情) | `aweme_id` | 🔀 `user_video_hd` (看用户+视频+高清链接) | `aweme_id` |
| `url_to_video` (从分享链接获取视频详情) | `aweme_id` | 🔀 `comments_replies` (看评论+回复) | `aweme_id` |
| `url_to_video` (从分享链接获取视频详情) | `aweme_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `aweme_id` |
| `url_to_video` (从分享链接获取视频详情) | `aweme_id` | 🔀 `video_danmaku` (看视频+弹幕) | `aweme_id` |
| `url_to_video` (从分享链接获取视频详情) | `aweme_id` | 🔀 `video_detail_stats` (看视频+统计) | `aweme_id` |
| `user_fans` (看用户+粉丝) | `sec_user_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `sec_user_id` |
| `user_fans` (看用户+粉丝) | `sec_user_id` | 🔀 `product_coupon` (商品列表→优惠券) | `sec_user_id` |
| `user_fans` (看用户+粉丝) | `sec_user_id` | 🔀 `url_to_user` (从分享链接获取用户信息) | `sec_user_id` |
| `user_fans` (看用户+粉丝) | `sec_user_id` | 🔀 `video_author_profile` (看视频+作者主页) | `sec_user_id` |
| `user_fans` (看用户+粉丝) | `sec_user_id` | 🔀 `search_user_profile` (搜索用户→看主页) | `sec_user_id` |
| `user_following` (看用户+关注) | `sec_user_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `sec_user_id` |
| `user_following` (看用户+关注) | `sec_user_id` | 🔀 `product_coupon` (商品列表→优惠券) | `sec_user_id` |
| `user_following` (看用户+关注) | `sec_user_id` | 🔀 `url_to_user` (从分享链接获取用户信息) | `sec_user_id` |
| `user_following` (看用户+关注) | `sec_user_id` | 🔀 `video_author_profile` (看视频+作者主页) | `sec_user_id` |
| `user_following` (看用户+关注) | `sec_user_id` | 🔀 `search_user_profile` (搜索用户→看主页) | `sec_user_id` |
| `user_live` (看用户+直播信息) | `sec_user_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `sec_user_id` |
| `user_live` (看用户+直播信息) | `uid` | 🔀 `uid_live_status` (uid→直播状态+直播流) | `uid` |
| `user_live` (看用户+直播信息) | `sec_user_id` | 🔀 `product_coupon` (商品列表→优惠券) | `sec_user_id` |
| `user_live` (看用户+直播信息) | `sec_user_id` | 🔀 `url_to_user` (从分享链接获取用户信息) | `sec_user_id` |
| `user_live` (看用户+直播信息) | `sec_user_id` | 🔀 `video_author_profile` (看视频+作者主页) | `sec_user_id` |
| `user_posts` (看用户+作品) | `sec_user_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `sec_user_id` |
| `user_posts` (看用户+作品) | `sec_user_id` | 🔀 `product_coupon` (商品列表→优惠券) | `sec_user_id` |
| `user_posts` (看用户+作品) | `sec_user_id` | 🔀 `url_to_user` (从分享链接获取用户信息) | `sec_user_id` |
| `user_posts` (看用户+作品) | `sec_user_id` | 🔀 `video_author_profile` (看视频+作者主页) | `sec_user_id` |
| `user_posts` (看用户+作品) | `sec_user_id` | 🔀 `search_user_profile` (搜索用户→看主页) | `sec_user_id` |
| `user_video_hd` (看用户+视频+高清链接) | `aweme_id`, `sec_user_id` | 🔀 `general_search_multi` (综合搜索→看视频+看用户) | `aweme_id`, `sec_user_id` |
| `user_video_hd` (看用户+视频+高清链接) | `aweme_id`, `sec_user_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `aweme_id`, `sec_user_id` |
| `user_video_hd` (看用户+视频+高清链接) | `aweme_id`, `sec_user_id` | 🔀 `video_author_profile` (看视频+作者主页) | `aweme_id`, `sec_user_id` |
| `user_video_hd` (看用户+视频+高清链接) | `aweme_id` | 🔀 `comments_replies` (看评论+回复) | `aweme_id` |
| `user_video_hd` (看用户+视频+高清链接) | `aweme_id` | 🔀 `video_danmaku` (看视频+弹幕) | `aweme_id` |
| `user_xingtu` (看用户+星图数据) | `sec_user_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `sec_user_id` |
| `user_xingtu` (看用户+星图数据) | `sec_user_id` | 🔀 `product_coupon` (商品列表→优惠券) | `sec_user_id` |
| `user_xingtu` (看用户+星图数据) | `sec_user_id` | 🔀 `url_to_user` (从分享链接获取用户信息) | `sec_user_id` |
| `user_xingtu` (看用户+星图数据) | `sec_user_id` | 🔀 `video_author_profile` (看视频+作者主页) | `sec_user_id` |
| `user_xingtu` (看用户+星图数据) | `sec_user_id` | 🔀 `search_user_profile` (搜索用户→看主页) | `sec_user_id` |
| `video_author_profile` (看视频+作者主页) | `sec_user_id` | 🔀 `uid_to_profile` (uid→sec_user_id→用户信息) | `sec_user_id` |
| `video_author_profile` (看视频+作者主页) | `sec_user_id` | 🔀 `user_live` (看用户+直播信息) | `sec_user_id` |
| `video_author_profile` (看视频+作者主页) | `sec_user_id` | 🔀 `product_coupon` (商品列表→优惠券) | `sec_user_id` |
| `video_author_profile` (看视频+作者主页) | `sec_user_id` | 🔀 `url_to_user` (从分享链接获取用户信息) | `sec_user_id` |
| `video_author_profile` (看视频+作者主页) | `sec_user_id` | 🔀 `search_user_profile` (搜索用户→看主页) | `sec_user_id` |
| `video_comments` (看视频+评论) | `aweme_id` | 🔀 `user_video_hd` (看用户+视频+高清链接) | `aweme_id` |
| `video_comments` (看视频+评论) | `aweme_id` | 🔀 `url_to_video` (从分享链接获取视频详情) | `aweme_id` |
| `video_comments` (看视频+评论) | `aweme_id` | 🔀 `video_detail_stats` (看视频+统计) | `aweme_id` |
| `video_comments` (看视频+评论) | `aweme_id` | 🔀 `video_detail_danmaku` (看视频+弹幕) | `aweme_id` |
| `video_comments` (看视频+评论) | `aweme_id` | 🔀 `share_to_video_hd` (分享链接→视频详情+高清) | `aweme_id` |
| `video_danmaku` (看视频+弹幕) | `aweme_id`, `item_id` | 🔀 `video_detail_danmaku` (看视频+弹幕) | `aweme_id`, `item_id` |
| `video_danmaku` (看视频+弹幕) | `aweme_id` | 🔀 `user_video_hd` (看用户+视频+高清链接) | `aweme_id` |
| `video_danmaku` (看视频+弹幕) | `item_id` | 🔀 `creator_overview_source` (看作品总览+流量来源) | `item_id` |
| `video_danmaku` (看视频+弹幕) | `item_id` | 🔀 `creator_overview_keyword` (看作品总览+搜索关键词) | `item_id` |
| `video_danmaku` (看视频+弹幕) | `item_id` | 🔀 `creator_overview_audience` (看作品总览+观众画像) | `item_id` |
| `video_detail_comments` (看视频+评论) | `aweme_id` | 🔀 `user_video_hd` (看用户+视频+高清链接) | `aweme_id` |
| `video_detail_comments` (看视频+评论) | `aweme_id` | 🔀 `comments_replies` (看评论+回复) | `aweme_id` |
| `video_detail_comments` (看视频+评论) | `aweme_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `aweme_id` |
| `video_detail_comments` (看视频+评论) | `aweme_id` | 🔀 `video_danmaku` (看视频+弹幕) | `aweme_id` |
| `video_detail_comments` (看视频+评论) | `aweme_id` | 🔀 `url_to_video` (从分享链接获取视频详情) | `aweme_id` |
| `video_detail_danmaku` (看视频+弹幕) | `aweme_id`, `item_id` | 🔀 `video_danmaku` (看视频+弹幕) | `aweme_id`, `item_id` |
| `video_detail_danmaku` (看视频+弹幕) | `aweme_id` | 🔀 `user_video_hd` (看用户+视频+高清链接) | `aweme_id` |
| `video_detail_danmaku` (看视频+弹幕) | `aweme_id` | 🔀 `comments_replies` (看评论+回复) | `aweme_id` |
| `video_detail_danmaku` (看视频+弹幕) | `aweme_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `aweme_id` |
| `video_detail_danmaku` (看视频+弹幕) | `item_id` | 🔀 `creator_overview_source` (看作品总览+流量来源) | `item_id` |
| `video_detail_hd` (看视频+高清链接) | `aweme_id` | 🔀 `user_video_hd` (看用户+视频+高清链接) | `aweme_id` |
| `video_detail_hd` (看视频+高清链接) | `aweme_id` | 🔀 `comments_replies` (看评论+回复) | `aweme_id` |
| `video_detail_hd` (看视频+高清链接) | `aweme_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `aweme_id` |
| `video_detail_hd` (看视频+高清链接) | `aweme_id` | 🔀 `video_danmaku` (看视频+弹幕) | `aweme_id` |
| `video_detail_hd` (看视频+高清链接) | `aweme_id` | 🔀 `url_to_video` (从分享链接获取视频详情) | `aweme_id` |
| `video_detail_related` (看视频+相关推荐) | `aweme_id` | 🔀 `user_video_hd` (看用户+视频+高清链接) | `aweme_id` |
| `video_detail_related` (看视频+相关推荐) | `aweme_id` | 🔀 `comments_replies` (看评论+回复) | `aweme_id` |
| `video_detail_related` (看视频+相关推荐) | `aweme_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `aweme_id` |
| `video_detail_related` (看视频+相关推荐) | `aweme_id` | 🔀 `video_danmaku` (看视频+弹幕) | `aweme_id` |
| `video_detail_related` (看视频+相关推荐) | `aweme_id` | 🔀 `url_to_video` (从分享链接获取视频详情) | `aweme_id` |
| `video_detail_stats` (看视频+统计) | `aweme_id` | 🔀 `user_video_hd` (看用户+视频+高清链接) | `aweme_id` |
| `video_detail_stats` (看视频+统计) | `aweme_id` | 🔀 `comments_replies` (看评论+回复) | `aweme_id` |
| `video_detail_stats` (看视频+统计) | `aweme_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `aweme_id` |
| `video_detail_stats` (看视频+统计) | `aweme_id` | 🔀 `video_danmaku` (看视频+弹幕) | `aweme_id` |
| `video_detail_stats` (看视频+统计) | `aweme_id` | 🔀 `url_to_video` (从分享链接获取视频详情) | `aweme_id` |
| `video_rank_detail` (视频榜→视频详情) | `aweme_id` | 🔀 `user_video_hd` (看用户+视频+高清链接) | `aweme_id` |
| `video_rank_detail` (视频榜→视频详情) | `aweme_id` | 🔀 `comments_replies` (看评论+回复) | `aweme_id` |
| `video_rank_detail` (视频榜→视频详情) | `aweme_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `aweme_id` |
| `video_rank_detail` (视频榜→视频详情) | `aweme_id` | 🔀 `video_danmaku` (看视频+弹幕) | `aweme_id` |
| `video_rank_detail` (视频榜→视频详情) | `aweme_id` | 🔀 `url_to_video` (从分享链接获取视频详情) | `aweme_id` |
| `vision_search_video` (以图搜图→看视频) | `aweme_id` | 🔀 `user_video_hd` (看用户+视频+高清链接) | `aweme_id` |
| `vision_search_video` (以图搜图→看视频) | `aweme_id` | 🔀 `comments_replies` (看评论+回复) | `aweme_id` |
| `vision_search_video` (以图搜图→看视频) | `aweme_id` | 🔀 `comment_user_profile` (看评论+评论者主页) | `aweme_id` |
| `vision_search_video` (以图搜图→看视频) | `aweme_id` | 🔀 `video_danmaku` (看视频+弹幕) | `aweme_id` |
| `vision_search_video` (以图搜图→看视频) | `aweme_id` | 🔀 `url_to_video` (从分享链接获取视频详情) | `aweme_id` |
| `webcast_to_live` (webcast_id→room_id→直播流) | `webcast_id` | 🔀 `url_to_live` (从直播链接获取直播信息) | `webcast_id` |
| `webcast_to_live` (webcast_id→room_id→直播流) | `room_id` | 🔀 `search_live_detail` (搜索直播→看直播详情) | `room_id` |
| `webcast_to_live` (webcast_id→room_id→直播流) | `room_id`, `webcast_id` | `live_gift_rank` (看直播+送礼排行) | `room_id`, `webcast_id` |
| `webcast_to_live` (webcast_id→room_id→直播流) | `room_id`, `webcast_id` | `live_products` (看直播+商品列表) | `room_id`, `webcast_id` |
| `webcast_to_live` (webcast_id→room_id→直播流) | `room_id`, `webcast_id` | `live_danmaku_ws` (看直播+弹幕) | `room_id`, `webcast_id` |

> 🔀 = 跨文件链路 (cross-domain chain)；优先选 🔀 标记的下游 recipe，因为它能扩展 agent 已有的数据视图。

**典型 3 步用法**：
1. 用户语义 → 在 `_index.md` trigger_keywords 列匹配第 1 个 recipe
2. 执行第 1 个 recipe，得到 Output 字段
3. 在本表查 "已完成 Recipe" 列 → 选合适的下游 → 用 "接力字段" 直接传参，无需问用户重复输入

