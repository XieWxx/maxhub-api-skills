// 第三方接口请求封装 - douyin
// 基于MaxHub API中转站调用，集成价格追踪、缓存优化、智能决策

const config = require('../config.json');
const { createOptimizationLayer } = require('../shared');
const BASE_URL = config.apiBase.url;
const AUTH_HEADER = config.apiBase.authHeader;
const AUTH_ENV_NAME = config.apiBase.authEnvVar;

function resolveCredential() {
  const proc = typeof process !== 'undefined' ? process : {};
  const env = proc.env || {};
  return env[AUTH_ENV_NAME] || '';
}

/**
 * API注册表 - 包含价格信息（CNY/次）
 * 价格规则：大部分API ¥0.01，部分v2版本API ¥0.02，douyinLiveRoom 免费
 */
const API_REGISTRY = {
  // web
  fetchOneVideoDanmaku: { path: '/web/fetch_one_video_danmaku', params: ['item_id', 'duration', 'end_time', 'start_time'], price: 0.01 },
  fetchHomeFeed: { path: '/web/fetch_home_feed', price: 0.01 },
  fetchRelatedPosts: { path: '/web/fetch_related_posts', params: ['aweme_id'], price: 0.01 },
  fetchUserCollectionVideos: { path: '/web/fetch_user_collection_videos', method: 'POST', price: 0.01 },
  fetchUserCollects: { path: '/web/fetch_user_collects', method: 'POST', price: 0.01 },
  fetchUserCollectsVideos: { path: '/web/fetch_user_collects_videos', params: ['collects_id'], price: 0.01 },
  fetchUserMixVideos: { path: '/web/fetch_user_mix_videos', params: ['mix_id'], price: 0.01 },
  fetchUserLiveVideos: { path: '/web/fetch_user_live_videos', params: ['webcast_id'], price: 0.01 },
  fetchUserLiveVideosBySecUid: { path: '/web/fetch_user_live_videos_by_sec_uid', params: ['sec_uid'], price: 0.01 },
  fetchUserLiveVideosByRoomId: { path: '/web/fetch_user_live_videos_by_room_id', params: ['room_id'], price: 0.01 },
  fetchUserLiveVideosByRoomIdV2: { path: '/web/fetch_user_live_videos_by_room_id_v2', params: ['room_id'], price: 0.01 },
  fetchLiveRoomProductResult: { path: '/web/fetch_live_room_product_result', params: ['room_id', 'author_id'], price: 0.01 },
  fetchProductDetail: { path: '/web/fetch_product_detail', params: ['product_id'], price: 0.5 },
  fetchProductSkuList: { path: '/web/fetch_product_sku_list', params: ['product_id', 'author_id'], price: 0.01 },
  fetchProductCoupon: { path: '/web/fetch_product_coupon', params: ['product_id', 'shop_id', 'price', 'author_id', 'sec_user_id'], price: 0.01 },
  fetchProductReviewScore: { path: '/web/fetch_product_review_score', params: ['product_id', 'shop_id'], price: 0.01 },
  fetchProductReviewList: { path: '/web/fetch_product_review_list', params: ['product_id', 'shop_id'], price: 0.01 },
  fetchUserProfileByUid: { path: '/web/fetch_user_profile_by_uid', params: ['uid'], price: 0.01 },
  fetchBatchUserProfileV1: { path: '/web/fetch_batch_user_profile_v1', params: ['sec_user_ids'], price: 0.3 },
  fetchBatchUserProfileV2: { path: '/web/fetch_batch_user_profile_v2', params: ['sec_user_ids'], price: 1.5 },
  fetchUserLiveInfoByUid: { path: '/web/fetch_user_live_info_by_uid', params: ['uid'], price: 0.01 },
  fetchUserProfileByShortId: { path: '/web/fetch_user_profile_by_short_id', params: ['short_id'], price: 0.01 },
  handlerShortenUrl: { path: '/web/handler_shorten_url', params: ['target_url'], price: 0.01 },
  handlerUserProfileV2: { path: '/web/handler_user_profile_v2', params: ['unique_id'], price: 0.01 },
  encryptUidToSecUserId: { path: '/web/encrypt_uid_to_sec_user_id', params: ['uid'], price: 0.01 },
  handlerUserProfileV3: { path: '/web/handler_user_profile_v3', params: ['uid'], price: 0.01 },
  handlerUserProfileV4: { path: '/web/handler_user_profile_v4', params: ['sec_user_id'], price: 0.03 },
  fetchChallengePosts: { path: '/web/fetch_challenge_posts', method: 'POST', price: 0.01 },
  fetchVideoChannelResult: { path: '/web/fetch_video_channel_result', params: ['tag_id'], price: 0.01 },
  webcastId_2RoomId: { path: '/web/webcast_id_2_room_id', params: ['webcast_id'], price: 0.01 },
  fetchLiveImFetch: { path: '/web/fetch_live_im_fetch', params: ['room_id', 'user_unique_id'], price: 0.01 },
  fetchSeriesAweme: { path: '/web/fetch_series_aweme', params: ['offset', 'count', 'content_type'], price: 0.01 },
  fetchKnowledgeAweme: { path: '/web/fetch_knowledge_aweme', params: ['count'], price: 0.01 },
  fetchGameAweme: { path: '/web/fetch_game_aweme', params: ['count'], price: 0.01 },
  fetchCartoonAweme: { path: '/web/fetch_cartoon_aweme', params: ['count'], price: 0.01 },
  fetchMusicAweme: { path: '/web/fetch_music_aweme', params: ['count'], price: 0.01 },
  fetchFoodAweme: { path: '/web/fetch_food_aweme', params: ['count'], price: 0.01 },
  fetchLiveGiftRanking: { path: '/web/fetch_live_gift_ranking', params: ['room_id'], price: 0.01 },
  fetchUserSearchResultV2: { path: '/web/fetch_user_search_result_v2', params: ['keyword'], price: 0.01 },
  fetchUserSearchResultV3: { path: '/web/fetch_user_search_result_v3', params: ['keyword'], price: 0.01 },
  fetchSearchChallenge: { path: '/web/fetch_search_challenge', method: 'POST', price: 0.01 },
  fetchHotSearchResult: { path: '/web/fetch_hot_search_result', price: 0.01 },
  fetchQueryUser: { path: '/web/fetch_query_user', method: 'POST', price: 0.01 },
  getSecUserId: { path: '/web/get_sec_user_id', params: ['url'], price: 0.01 },
  getAllSecUserId: { path: '/web/get_all_sec_user_id', method: 'POST', price: 0.01 },
  getAwemeId: { path: '/web/get_aweme_id', params: ['url'], price: 0.01 },
  getAllAwemeId: { path: '/web/get_all_aweme_id', method: 'POST', price: 0.01 },
  getWebcastId: { path: '/web/get_webcast_id', params: ['url'], price: 0.01 },
  getAllWebcastId: { path: '/web/get_all_webcast_id', method: 'POST', price: 0.01 },
  douyinLiveRoom: { path: '/web/douyin_live_room', params: ['live_room_url', 'danmaku_type'], price: 0 },
  // app/v3
  fetchOneVideo: { path: '/app/v3/fetch_one_video', params: ['aweme_id'], price: 0.01 },
  fetchOneVideoV2: { path: '/app/v3/fetch_one_video_v2', params: ['aweme_id'], price: 0.01 },
  fetchOneVideoV3: { path: '/app/v3/fetch_one_video_v3', params: ['aweme_id'], price: 0.01 },
  fetchShareInfoByShareCode: { path: '/app/v3/fetch_share_info_by_share_code', params: ['share_code'], price: 0.01 },
  fetchMultiVideo: { path: '/app/v3/fetch_multi_video', method: 'POST', price: 0.1 },
  fetchMultiVideoV2: { path: '/app/v3/fetch_multi_video_v2', method: 'POST', price: 0.5 },
  fetchOneVideoByShareUrl: { path: '/app/v3/fetch_one_video_by_share_url', params: ['share_url'], price: 0.01 },
  fetchVideoHighQualityPlayUrl: { path: '/app/v3/fetch_video_high_quality_play_url', price: 0.05 },
  fetchMultiVideoHighQualityPlayUrl: { path: '/app/v3/fetch_multi_video_high_quality_play_url', method: 'POST', price: 2.5 },
  handlerUserProfile: { path: '/app/v3/handler_user_profile', params: ['sec_user_id'], price: 0.01 },
  fetchUserFansList: { path: '/app/v3/fetch_user_fans_list', price: 0.01 },
  fetchUserPostVideos: { path: '/app/v3/fetch_user_post_videos', params: ['sec_user_id'], price: 0.01 },
  fetchVideoMixDetail: { path: '/app/v3/fetch_video_mix_detail', params: ['mix_id'], price: 0.01 },
  fetchVideoMixPostList: { path: '/app/v3/fetch_video_mix_post_list', params: ['mix_id'], price: 0.01 },
  fetchUserSeriesList: { path: '/app/v3/fetch_user_series_list', price: 0.01 },
  fetchSeriesVideoList: { path: '/app/v3/fetch_series_video_list', params: ['series_id'], price: 0.01 },
  fetchSeriesDetail: { path: '/app/v3/fetch_series_detail', params: ['series_id'], price: 0.01 },
  fetchMusicDetail: { path: '/app/v3/fetch_music_detail', params: ['music_id'], price: 0.01 },
  fetchMusicVideoList: { path: '/app/v3/fetch_music_video_list', params: ['music_id'], price: 0.01 },
  fetchHashtagDetail: { path: '/app/v3/fetch_hashtag_detail', params: ['ch_id'], price: 0.01 },
  fetchHashtagVideoList: { path: '/app/v3/fetch_hashtag_video_list', params: ['ch_id'], price: 0.01 },
  fetchVideoStatistics: { path: '/app/v3/fetch_video_statistics', params: ['aweme_ids'], price: 0.01 },
  fetchMultiVideoStatistics: { path: '/app/v3/fetch_multi_video_statistics', params: ['aweme_ids'], price: 0.25 },
  fetchUserFollowingList: { path: '/app/v3/fetch_user_following_list', price: 0.01 },
  fetchUserLikeVideos: { path: '/app/v3/fetch_user_like_videos', params: ['sec_user_id'], price: 0.01 },
  fetchVideoComments: { path: '/app/v3/fetch_video_comments', params: ['aweme_id'], price: 0.01 },
  fetchVideoCommentReplies: { path: '/app/v3/fetch_video_comment_replies', params: ['item_id', 'comment_id'], price: 0.01 },
  fetchGeneralSearchResult: { path: '/app/v3/fetch_general_search_result', params: ['keyword'], price: 0.01 },
  fetchVideoSearchResult: { path: '/app/v3/fetch_video_search_result', params: ['keyword'], price: 0.01 },
  fetchVideoSearchResultV2: { path: '/app/v3/fetch_video_search_result_v2', params: ['keyword'], price: 0.1 },
  fetchUserSearchResult: { path: '/app/v3/fetch_user_search_result', params: ['keyword'], price: 0.01 },
  fetchLiveSearchResult: { path: '/app/v3/fetch_live_search_result', params: ['keyword'], price: 0.01 },
  fetchMusicSearchResult: { path: '/app/v3/fetch_music_search_result', params: ['keyword'], price: 0.01 },
  fetchHashtagSearchResult: { path: '/app/v3/fetch_hashtag_search_result', params: ['keyword'], price: 0.01 },
  fetchHotSearchList: { path: '/app/v3/fetch_hot_search_list', price: 0.01 },
  fetchLiveHotSearchList: { path: '/app/v3/fetch_live_hot_search_list', price: 0.01 },
  fetchMusicHotSearchList: { path: '/app/v3/fetch_music_hot_search_list', price: 0.01 },
  fetchBrandHotSearchList: { path: '/app/v3/fetch_brand_hot_search_list', price: 0.01 },
  fetchBrandHotSearchListDetail: { path: '/app/v3/fetch_brand_hot_search_list_detail', params: ['category_id'], price: 0.01 },
  openDouyinAppToKeywordSearch: { path: '/app/v3/open_douyin_app_to_keyword_search', params: ['keyword'], price: 0.01 },
  generateDouyinShortUrl: { path: '/app/v3/generate_douyin_short_url', params: ['url'], price: 0.01 },
  generateDouyinVideoShareQrcode: { path: '/app/v3/generate_douyin_video_share_qrcode', params: ['object_id'], price: 0.01 },
  openDouyinAppToVideoDetail: { path: '/app/v3/open_douyin_app_to_video_detail', params: ['aweme_id'], price: 0.01 },
  openDouyinAppToUserProfile: { path: '/app/v3/open_douyin_app_to_user_profile', params: ['uid', 'sec_uid'], price: 0.01 },
  openDouyinAppToSendPrivateMessage: { path: '/app/v3/open_douyin_app_to_send_private_message', params: ['uid', 'sec_uid'], price: 0.01 },
  // creator
  fetchCreatorMaterialCenterBillboard: { path: '/creator/fetch_creator_material_center_billboard', price: 0.01 },
  fetchCreatorHotSpotBillboard: { path: '/creator/fetch_creator_hot_spot_billboard', price: 0.01 },
  fetchCreatorHotTopicBillboard: { path: '/creator/fetch_creator_hot_topic_billboard', price: 0.01 },
  fetchCreatorHotPropsBillboard: { path: '/creator/fetch_creator_hot_props_billboard', price: 0.01 },
  fetchCreatorHotChallengeBillboard: { path: '/creator/fetch_creator_hot_challenge_billboard', price: 0.01 },
  fetchCreatorHotMusicBillboard: { path: '/creator/fetch_creator_hot_music_billboard', price: 0.01 },
  fetchCreatorActivityList: { path: '/creator/fetch_creator_activity_list', params: ['start_time', 'end_time'], price: 0.01 },
  fetchCreatorActivityDetail: { path: '/creator/fetch_creator_activity_detail', params: ['activity_id'], price: 0.01 },
  fetchCreatorMaterialCenterConfig: { path: '/creator/fetch_creator_material_center_config', price: 0.01 },
  fetchCreatorHotCourse: { path: '/creator/fetch_creator_hot_course', price: 0.01 },
  fetchCreatorContentCategory: { path: '/creator/fetch_creator_content_category', price: 0.01 },
  fetchCreatorContentCourse: { path: '/creator/fetch_creator_content_course', params: ['category_id'], price: 0.01 },
  fetchVideoDanmakuList: { path: '/creator/fetch_video_danmaku_list', params: ['item_id'], price: 0.01 },
  fetchMissionTaskList: { path: '/creator/fetch_mission_task_list', price: 0.01 },
  fetchIndustryCategoryConfig: { path: '/creator/fetch_industry_category_config', price: 0.01 },
  // creator_v2
  fetchItemPlaySource: { path: '/creator_v2/fetch_item_play_source', method: 'POST', price: 0.01 },
  fetchItemWatchTrend: { path: '/creator_v2/fetch_item_watch_trend', method: 'POST', price: 0.01 },
  fetchItemDanmakuAnalysis: { path: '/creator_v2/fetch_item_danmaku_analysis', method: 'POST', price: 0.01 },
  fetchItemAudiencePortrait: { path: '/creator_v2/fetch_item_audience_portrait', method: 'POST', price: 0.01 },
  fetchItemAudienceOthers: { path: '/creator_v2/fetch_item_audience_others', method: 'POST', price: 0.01 },
  fetchItemAnalysisOverview: { path: '/creator_v2/fetch_item_analysis_overview', method: 'POST', price: 0.01 },
  fetchItemSearchKeyword: { path: '/creator_v2/fetch_item_search_keyword', method: 'POST', price: 0.01 },
  fetchItemOverviewData: { path: '/creator_v2/fetch_item_overview_data', method: 'POST', price: 0.01 },
  fetchItemAnalysisInvolvedVertical: { path: '/creator_v2/fetch_item_analysis_involved_vertical', method: 'POST', price: 0.01 },
  fetchItemAnalysisItemPerformance: { path: '/creator_v2/fetch_item_analysis_item_performance', method: 'POST', price: 0.01 },
  fetchItemList: { path: '/creator_v2/fetch_item_list', method: 'POST', price: 0.01 },
  fetchItemListDownload: { path: '/creator_v2/fetch_item_list_download', method: 'POST', price: 0.1 },
  fetchLiveRoomHistoryList: { path: '/creator_v2/fetch_live_room_history_list', method: 'POST', price: 0.01 },
  fetchAuthorDiagnosis: { path: '/creator_v2/fetch_author_diagnosis', method: 'POST', price: 0.01 },
  // index
  fetchAllValidDate: { path: '/index/fetch_all_valid_date', price: 0.01 },
  fetchValidDateForRelation: { path: '/index/fetch_valid_date_for_relation', price: 0.01 },
  fetchAllArea: { path: '/index/fetch_all_area', price: 0.01 },
  fetchCurrentHotTopic: { path: '/index/fetch_current_hot_topic', price: 0.01 },
  fetchHotWords: { path: '/index/fetch_hot_words', price: 0.01 },
  fetchKeywordValidDate: { path: '/index/fetch_keyword_valid_date', params: ['keyword_list'], method: 'POST', price: 0.01 },
  fetchMultiKeywordHotTrend: { path: '/index/fetch_multi_keyword_hot_trend', params: ['keyword_list', 'start_date', 'end_date'], method: 'POST', price: 0.01 },
  fetchMultiKeywordInterpretation: { path: '/index/fetch_multi_keyword_interpretation', params: ['keyword_list', 'start_date', 'end_date'], method: 'POST', price: 0.01 },
  fetchRelationWord: { path: '/index/fetch_relation_word', params: ['keyword', 'start_date', 'end_date'], method: 'POST', price: 0.01 },
  fetchPortrait: { path: '/index/fetch_portrait', params: ['keyword', 'start_date', 'end_date'], method: 'POST', price: 0.01 },
  fetchGetUserSubWord: { path: '/index/fetch_get_user_sub_word', method: 'POST', price: 0.01 },
  fetchEncryptUserId: { path: '/index/fetch_encrypt_user_id', params: ['uid'], price: 0.01 },
  fetchDarenCompareUsersStable: { path: '/index/fetch_daren_compare_users_stable', params: ['user_list'], method: 'POST', price: 0.01 },
  fetchDarenSimilarUsers: { path: '/index/fetch_daren_similar_users', params: ['user_id'], method: 'POST', price: 0.01 },
  fetchDarenGreatUserTopVideo: { path: '/index/fetch_daren_great_user_top_video', params: ['user_id', 'start_date', 'end_date'], method: 'POST', price: 0.01 },
  fetchDarenGreatItemMileInfo: { path: '/index/fetch_daren_great_item_mile_info', params: ['user_id'], method: 'POST', price: 0.01 },
  fetchDarenGreatUserFansInfo: { path: '/index/fetch_daren_great_user_fans_info', params: ['user_id'], method: 'POST', price: 0.01 },
  fetchBrandValidInfo: { path: '/index/fetch_brand_valid_info', params: ['keyword_list'], method: 'POST', price: 0.01 },
  fetchBrandRadarChart: { path: '/index/fetch_brand_radar_chart', params: ['brand_name', 'start_date', 'end_date'], method: 'POST', price: 0.01 },
  fetchBrandLines: { path: '/index/fetch_brand_lines', params: ['brand_name', 'start_date', 'end_date'], method: 'POST', price: 0.01 },
  fetchBrandCycles: { path: '/index/fetch_brand_cycles', params: ['brand_name', 'start_date', 'end_date'], method: 'POST', price: 0.01 },
  fetchBrandInitiativeRankWeekly: { path: '/index/fetch_brand_initiative_rank_weekly', params: ['brand_name', 'start_date', 'end_date'], method: 'POST', price: 0.01 },
  fetchContentValidDate: { path: '/index/fetch_content_valid_date', price: 0.01 },
  fetchBrandHotVideosTimeScope: { path: '/index/fetch_brand_hot_videos_time_scope', method: 'POST', price: 0.01 },
  fetchContentCreativeKeywords: { path: '/index/fetch_content_creative_keywords', params: ['tag_id', 'end_date'], method: 'POST', price: 0.01 },
  fetchContentCreativeKeywordItems: { path: '/index/fetch_content_creative_keyword_items', params: ['tag_id', 'end_date', 'keyword'], method: 'POST', price: 0.01 },
  fetchContentCreativeTopic: { path: '/index/fetch_content_creative_topic', params: ['tag_id', 'end_date'], method: 'POST', price: 0.01 },
  fetchContentPublishTrend: { path: '/index/fetch_content_publish_trend', params: ['tag_id', 'start_date', 'end_date'], price: 0.01 },
  fetchContentCreativeDuration: { path: '/index/fetch_content_creative_duration', params: ['tag_id', 'end_date'], method: 'POST', price: 0.01 },
  fetchContentAuthorPortrait: { path: '/index/fetch_content_author_portrait', params: ['tag_id', 'end_date'], method: 'POST', price: 0.01 },
  fetchContentConsumerPortrait: { path: '/index/fetch_content_consumer_portrait', params: ['tag_id', 'end_date'], method: 'POST', price: 0.01 },
  fetchContentInteractTrend: { path: '/index/fetch_content_interact_trend', params: ['tag_id', 'start_date', 'end_date'], method: 'POST', price: 0.01 },
  fetchContentConsumeTrend: { path: '/index/fetch_content_consume_trend', params: ['tag_id', 'start_date', 'end_date'], method: 'POST', price: 0.01 },
  fetchInsightRecommend: { path: '/index/fetch_insight_recommend', price: 0.01 },
  fetchReportDetail: { path: '/index/fetch_report_detail', params: ['report_id'], price: 0.01 },
  fetchInsightGetRec: { path: '/index/fetch_insight_get_rec', params: ['report_id'], price: 0.01 },
  fetchDarenSugGreatUserList: { path: '/index/fetch_daren_sug_great_user_list', params: ['keyword'], method: 'POST', price: 0.01 },
  fetchItemFilterOptions: { path: '/index/fetch_item_filter_options', price: 0.01 },
  fetchItemSug: { path: '/index/fetch_item_sug', params: ['query'], method: 'POST', price: 0.01 },
  fetchItemQuery: { path: '/index/fetch_item_query', params: ['query'], method: 'POST', price: 0.01 },
  fetchBrandSuggest: { path: '/index/fetch_brand_suggest', params: ['keyword'], method: 'POST', price: 0.01 },
  fetchTopicSuggest: { path: '/index/fetch_topic_suggest', params: ['keyword'], method: 'POST', price: 0.01 },
  fetchTopicQuery: { path: '/index/fetch_topic_query', params: ['keyword', 'start_date', 'end_date'], method: 'POST', price: 0.01 },
  fetchReportSearch: { path: '/index/fetch_report_search', method: 'POST', price: 0.01 },
  // billboard
  fetchCityList: { path: '/billboard/fetch_city_list', price: 0.01 },
  fetchContentTag: { path: '/billboard/fetch_content_tag', price: 0.01 },
  fetchHotCategoryList: { path: '/billboard/fetch_hot_category_list', params: ['billboard_type'], price: 0.01 },
  fetchHotRiseList: { path: '/billboard/fetch_hot_rise_list', params: ['page', 'page_size', 'order'], price: 0.01 },
  fetchHotCityList: { path: '/billboard/fetch_hot_city_list', params: ['page', 'page_size', 'order'], price: 0.01 },
  fetchHotChallengeList: { path: '/billboard/fetch_hot_challenge_list', params: ['page', 'page_size'], price: 0.01 },
  fetchHotTotalList: { path: '/billboard/fetch_hot_total_list', params: ['page', 'page_size', 'type'], price: 0.01 },
  fetchHotCalendarList: { path: '/billboard/fetch_hot_calendar_list', method: 'POST', price: 0.01 },
  fetchHotCalendarDetail: { path: '/billboard/fetch_hot_calendar_detail', params: ['calendar_id'], price: 0.01 },
  fetchHotUserPortraitList: { path: '/billboard/fetch_hot_user_portrait_list', params: ['aweme_id'], price: 0.01 },
  fetchHotCommentWordList: { path: '/billboard/fetch_hot_comment_word_list', params: ['aweme_id'], price: 0.01 },
  fetchHotItemTrendsList: { path: '/billboard/fetch_hot_item_trends_list', price: 0.01 },
  fetchHotAccountList: { path: '/billboard/fetch_hot_account_list', method: 'POST', price: 0.01 },
  fetchHotAccountTrendsList: { path: '/billboard/fetch_hot_account_trends_list', params: ['sec_uid'], price: 0.01 },
  fetchHotAccountItemAnalysisList: { path: '/billboard/fetch_hot_account_item_analysis_list', params: ['sec_uid'], price: 0.01 },
  fetchHotAccountFansPortraitList: { path: '/billboard/fetch_hot_account_fans_portrait_list', params: ['sec_uid'], price: 0.01 },
  fetchHotAccountFansInterestAccountList: { path: '/billboard/fetch_hot_account_fans_interest_account_list', params: ['sec_uid'], price: 0.01 },
  fetchHotAccountFansInterestTopicList: { path: '/billboard/fetch_hot_account_fans_interest_topic_list', params: ['sec_uid'], price: 0.01 },
  fetchHotTotalVideoList: { path: '/billboard/fetch_hot_total_video_list', method: 'POST', price: 0.01 },
  fetchHotTotalLowFanList: { path: '/billboard/fetch_hot_total_low_fan_list', method: 'POST', price: 0.01 },
  fetchHotTotalHighPlayList: { path: '/billboard/fetch_hot_total_high_play_list', method: 'POST', price: 0.01 },
  fetchHotTotalHighLikeList: { path: '/billboard/fetch_hot_total_high_like_list', method: 'POST', price: 0.01 },
  fetchHotTotalHighFanList: { path: '/billboard/fetch_hot_total_high_fan_list', method: 'POST', price: 0.01 },
  fetchHotTotalTopicList: { path: '/billboard/fetch_hot_total_topic_list', method: 'POST', price: 0.01 },
  fetchHotTotalHighTopicList: { path: '/billboard/fetch_hot_total_high_topic_list', method: 'POST', price: 0.01 },
  fetchHotTotalHotWordList: { path: '/billboard/fetch_hot_total_hot_word_list', method: 'POST', price: 0.01 },
  fetchHotTotalHotWordDetailList: { path: '/billboard/fetch_hot_total_hot_word_detail_list', params: ['keyword', 'word_id', 'query_day'], price: 0.01 },
  fetchHotAccountSearchList: { path: '/billboard/fetch_hot_account_search_list', params: ['keyword', 'cursor'], price: 0.01 },
  fetchHotAccountFansInterestSearchList: { path: '/billboard/fetch_hot_account_fans_interest_search_list', params: ['sec_uid'], price: 0.01 },
  fetchHotTotalSearchList: { path: '/billboard/fetch_hot_total_search_list', method: 'POST', price: 0.01 },
  fetchHotTotalHighSearchList: { path: '/billboard/fetch_hot_total_high_search_list', method: 'POST', price: 0.01 },
  // xingtu
  kolConversionAbilityAnalysisV1: { path: '/xingtu/kol_conversion_ability_analysis_v1', params: ['kolId', '_range'], price: 0.2 },
  kolXingtuIndexV1: { path: '/xingtu/kol_xingtu_index_v1', params: ['kolId'], price: 0.2 },
  kolCpInfoV1: { path: '/xingtu/kol_cp_info_v1', params: ['kolId'], price: 0.2 },
  authorHotCommentTokensV1: { path: '/xingtu/author_hot_comment_tokens_v1', params: ['kolId'], price: 0.2 },
  authorContentHotCommentKeywordsV1: { path: '/xingtu/author_content_hot_comment_keywords_v1', params: ['kolId'], price: 0.2 },
  searchKolV1: { path: '/xingtu/search_kol_v1', params: ['keyword', 'platformSource', 'page'], price: 0.2 },
  searchKolV2: { path: '/xingtu/search_kol_v2', params: ['keyword'], price: 0.2 },
  getSignImage: { path: '/xingtu/get_sign_image', params: ['uri'], price: 0.01 },
  getXingtuKolidByUid: { path: '/xingtu/get_xingtu_kolid_by_uid', params: ['uid'], price: 0.01 },
  getXingtuKolidBySecUserId: { path: '/xingtu/get_xingtu_kolid_by_sec_user_id', params: ['sec_user_id'], price: 0.01 },
  getXingtuKolidByUniqueId: { path: '/xingtu/get_xingtu_kolid_by_unique_id', params: ['unique_id'], price: 0.01 },
  kolBaseInfoV1: { path: '/xingtu/kol_base_info_v1', params: ['kolId', 'platformChannel'], price: 0.2 },
  kolAudiencePortraitV1: { path: '/xingtu/kol_audience_portrait_v1', params: ['kolId'], price: 0.2 },
  kolFansPortraitV1: { path: '/xingtu/kol_fans_portrait_v1', params: ['kolId'], price: 0.2 },
  kolServicePriceV1: { path: '/xingtu/kol_service_price_v1', params: ['kolId', 'platformChannel'], price: 0.2 },
  kolDataOverviewV1: { path: '/xingtu/kol_data_overview_v1', params: ['kolId', '_type', '_range', 'flowType'], price: 0.2 },
  kolVideoPerformanceV1: { path: '/xingtu/kol_video_performance_v1', params: ['kolId', 'onlyAssign'], price: 0.2 },
  kolConvertVideoDisplayV1: { path: '/xingtu/kol_convert_video_display_v1', params: ['kolId', 'detailType', 'page'], price: 0.2 },
  kolLinkStructV1: { path: '/xingtu/kol_link_struct_v1', params: ['kolId'], price: 0.2 },
  kolTouchDistributionV1: { path: '/xingtu/kol_touch_distribution_v1', params: ['kolId'], price: 0.2 },
  kolRecVideosV1: { path: '/xingtu/kol_rec_videos_v1', params: ['kolId'], price: 0.2 },
  kolDailyFansV1: { path: '/xingtu/kol_daily_fans_v1', params: ['kolId', 'startDate', 'endDate'], price: 0.2 },
  // xingtu_v2
  getRankingListCatalog: { path: '/xingtu_v2/get_ranking_list_catalog', price: 0.01 },
  getRankingListData: { path: '/xingtu_v2/get_ranking_list_data', price: 0.02 },
  getPlayletActorRankCatalog: { path: '/xingtu_v2/get_playlet_actor_rank_catalog', method: 'POST', price: 0.01 },
  getPlayletActorRankList: { path: '/xingtu_v2/get_playlet_actor_rank_list', price: 0.02 },
  getContentTrendGuide: { path: '/xingtu_v2/get_content_trend_guide', price: 0.01 },
  getDemanderMcnList: { path: '/xingtu_v2/get_demander_mcn_list', price: 0.05 },
  getAuthorMarketFields: { path: '/xingtu_v2/get_author_market_fields', price: 0.01 },
  getAuthorBaseInfo: { path: '/xingtu_v2/get_author_base_info', params: ['o_author_id'], price: 0.01 },
  getAuthorBusinessCardInfo: { path: '/xingtu_v2/get_author_business_card_info', params: ['o_author_id'], price: 0.01 },
  getAuthorLocalInfo: { path: '/xingtu_v2/get_author_local_info', params: ['o_author_id'], price: 0.01 },
  getAuthorShowItems: { path: '/xingtu_v2/get_author_show_items', params: ['o_author_id'], price: 0.01 },
  getAuthorHotCommentTokens: { path: '/xingtu_v2/get_author_hot_comment_tokens', params: ['author_id'], price: 0.01 },
  getAuthorContentHotKeywords: { path: '/xingtu_v2/get_author_content_hot_keywords', params: ['author_id'], price: 0.01 },
  getRecommendForStarAuthors: { path: '/xingtu_v2/get_recommend_for_star_authors', method: 'POST', price: 0.01 },
  getExcellentCaseCategoryList: { path: '/xingtu_v2/get_excellent_case_category_list', price: 0.01 },
  getAuthorSpreadInfo: { path: '/xingtu_v2/get_author_spread_info', params: ['o_author_id'], price: 0.01 },
  getUserProfileQrcode: { path: '/xingtu_v2/get_user_profile_qrcode', price: 0.02 },
  getIpActivityIndustryList: { path: '/xingtu_v2/get_ip_activity_industry_list', price: 0.01 },
  getIpActivityList: { path: '/xingtu_v2/get_ip_activity_list', method: 'POST', price: 0.02 },
  getIpActivityDetail: { path: '/xingtu_v2/get_ip_activity_detail', params: ['id'], price: 0.01 },
  getResourceList: { path: '/xingtu_v2/get_resource_list', params: ['resource_id'], price: 0.01 },
  // search
  fetchGeneralSearchV1: { path: '/search/fetch_general_search_v1', method: 'POST', price: 0.1 },
  fetchGeneralSearchV2: { path: '/search/fetch_general_search_v2', method: 'POST', price: 0.1 },
  fetchSearchSuggest: { path: '/search/fetch_search_suggest', method: 'POST', price: 0.1 },
  fetchVideoSearchV1: { path: '/search/fetch_video_search_v1', method: 'POST', price: 0.1 },
  fetchVideoSearchV2: { path: '/search/fetch_video_search_v2', method: 'POST', price: 0.1 },
  fetchMultiSearch: { path: '/search/fetch_multi_search', method: 'POST', price: 0.1 },
  fetchUserSearch: { path: '/search/fetch_user_search', method: 'POST', price: 0.1 },
  fetchUserSearchV2: { path: '/search/fetch_user_search_v2', method: 'POST', price: 0.01 },
  fetchImageSearch: { path: '/search/fetch_image_search', method: 'POST', price: 0.1 },
  fetchImageSearchV3: { path: '/search/fetch_image_search_v3', method: 'POST', price: 0.1 },
  fetchLiveSearchV1: { path: '/search/fetch_live_search_v1', method: 'POST', price: 0.1 },
  fetchChallengeSearchV1: { path: '/search/fetch_challenge_search_v1', method: 'POST', price: 0.1 },
  fetchChallengeSearchV2: { path: '/search/fetch_challenge_search_v2', method: 'POST', price: 0.1 },
  fetchChallengeSuggest: { path: '/search/fetch_challenge_suggest', method: 'POST', price: 0.1 },
  fetchExperienceSearch: { path: '/search/fetch_experience_search', method: 'POST', price: 0.1 },
  fetchMusicSearch: { path: '/search/fetch_music_search', method: 'POST', price: 0.1 },
  fetchDiscussSearch: { path: '/search/fetch_discuss_search', method: 'POST', price: 0.1 },
  fetchSchoolSearch: { path: '/search/fetch_school_search', method: 'POST', price: 0.1 },
  fetchVisionSearch: { path: '/search/fetch_vision_search', method: 'POST', price: 0.1 },
};

/**
 * 初始化优化层
 * 集成缓存、去重、监控、决策、价格查询
 */
const optimization = createOptimizationLayer({
  registry: API_REGISTRY,
  apiPrefix: config.apiBase.prefix,
  cache: { maxSize: 50, defaultTTL: 3 * 60 * 1000 },
  optimizer: { redundancyWindow: 30000 },
  monitor: { costAlertThreshold: 0.5 },
  decision: { costWeight: 0.6, latencyWeight: 0.25, completenessWeight: 0.15 },
});

const REQUEST_TIMEOUT = 30000;

/**
 * 原始API请求方法（不含优化层）
 * @param {string} path - API路径
 * @param {object} params - 请求参数
 * @param {string} method - 请求方法 GET/POST
 * @returns {Promise<object>} API响应数据
 */
async function _rawRequest(path, params = {}, method = 'GET') {
  const url = `${BASE_URL}${path}`;
  const headers = {
    [AUTH_HEADER]: resolveCredential(),
    'Content-Type': 'application/json',
  };
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  const options = { method, headers, signal: controller.signal };
  if (method === 'GET') {
      const query = new URLSearchParams(params).toString();
      const fullUrl = query ? `${url}?${query}` : url;
      try {
        const response = await fetch(fullUrl, options);
        return await handleResponse(response);
      } finally {
        clearTimeout(timeoutId);
      }
    }
  options.body = JSON.stringify(params);
    try {
      const response = await fetch(url, options);
      return await handleResponse(response);
    } finally {
      clearTimeout(timeoutId);
    }
}

/**
 * 增强版请求方法
 * 自动经过缓存→去重→监控链路
 */
const request = optimization.enhanceRequest(_rawRequest);

/**
 * 处理API响应
 */
async function handleResponse(response) {
  const data = await response.json();
  if (response.status === 401) throw new Error('API Key无效或未配置，请访问 https://www.aconfig.cn 创建API Key');
  if (response.status === 402) throw new Error('账户余额不足，请访问 https://www.aconfig.cn 充值');
  if (response.status === 429) throw new Error('请求频率超限，请等待30秒后重试');
  if (!response.ok) throw new Error(data.message || `请求失败: ${response.status}`);
  return data;
}

/**
 * 通用API调用方法
 * 根据API注册表动态调用，自动记录费用
 * @param {string} apiName - 注册表中的API名称
 * @param {object} params - 请求参数
 * @returns {Promise<object>} API响应数据
 */
async function callApi(apiName, params = {}) {
  const def = API_REGISTRY[apiName];
  if (!def) throw new Error(`未知的API: ${apiName}`);
  const reqParams = {};
  if (def.params) {
    for (const key of def.params) {
      if (params[key] !== undefined) reqParams[key] = params[key];
    }
  }
  return request(def.path, reqParams, def.method || 'GET');
}

/**
 * 批量生成API调用函数
 * 从注册表自动生成所有API的便捷调用方法
 */
const api = {};
for (const [name, def] of Object.entries(API_REGISTRY)) {
  api[name] = async (...args) => {
    const params = {};
    if (def.params) {
      for (let i = 0; i < def.params.length; i++) {
        if (args[i] !== undefined) params[def.params[i]] = args[i];
      }
    }
    if (args.length > 0 && typeof args[args.length - 1] === 'object' && !Array.isArray(args[args.length - 1])) {
      Object.assign(params, args[args.length - 1]);
    }
    return request(def.path, params, def.method || 'GET');
  };
}

/**
 * 获取优化报告
 * 包含缓存命中率、费用统计、优化建议等
 */
function getOptimizationReport() {
  return optimization.getReport();
}

/**
 * 获取API价格信息
 * @param {string} apiName - API名称
 * @returns {object} 价格信息
 */
function getApiPrice(apiName) {
  const def = API_REGISTRY[apiName];
  if (!def) return null;
  return {
    name: apiName,
    path: `${config.apiBase.prefix}${def.path}`,
    price: def.price,
    currency: 'CNY',
    freeQuota: def.freeQuota || false,
  };
}

/**
 * 获取所有API价格列表
 */
function getAllPrices() {
  return Object.entries(API_REGISTRY).map(([name, def]) => ({
    name,
    path: `${config.apiBase.prefix}${def.path}`,
    price: def.price,
    currency: 'CNY',
  }));
}

module.exports = {
  request,
  callApi,
  API_REGISTRY,
  optimization,
  getOptimizationReport,
  getApiPrice,
  getAllPrices,
  fetchOneVideoDanmaku: api.fetchOneVideoDanmaku,
  fetchHomeFeed: api.fetchHomeFeed,
  fetchRelatedPosts: api.fetchRelatedPosts,
  fetchUserCollectionVideos: api.fetchUserCollectionVideos,
  fetchUserCollects: api.fetchUserCollects,
  fetchUserCollectsVideos: api.fetchUserCollectsVideos,
  fetchUserMixVideos: api.fetchUserMixVideos,
  fetchUserLiveVideos: api.fetchUserLiveVideos,
  fetchUserLiveVideosBySecUid: api.fetchUserLiveVideosBySecUid,
  fetchUserLiveVideosByRoomId: api.fetchUserLiveVideosByRoomId,
  fetchUserLiveVideosByRoomIdV2: api.fetchUserLiveVideosByRoomIdV2,
  fetchLiveRoomProductResult: api.fetchLiveRoomProductResult,
  fetchProductDetail: api.fetchProductDetail,
  fetchProductSkuList: api.fetchProductSkuList,
  fetchProductCoupon: api.fetchProductCoupon,
  fetchProductReviewScore: api.fetchProductReviewScore,
  fetchProductReviewList: api.fetchProductReviewList,
  fetchUserProfileByUid: api.fetchUserProfileByUid,
  fetchBatchUserProfileV1: api.fetchBatchUserProfileV1,
  fetchBatchUserProfileV2: api.fetchBatchUserProfileV2,
  fetchUserLiveInfoByUid: api.fetchUserLiveInfoByUid,
  fetchUserProfileByShortId: api.fetchUserProfileByShortId,
  handlerShortenUrl: api.handlerShortenUrl,
  handlerUserProfileV2: api.handlerUserProfileV2,
  encryptUidToSecUserId: api.encryptUidToSecUserId,
  handlerUserProfileV3: api.handlerUserProfileV3,
  handlerUserProfileV4: api.handlerUserProfileV4,
  fetchChallengePosts: api.fetchChallengePosts,
  fetchVideoChannelResult: api.fetchVideoChannelResult,
  webcastId_2RoomId: api.webcastId_2RoomId,
  fetchLiveImFetch: api.fetchLiveImFetch,
  fetchSeriesAweme: api.fetchSeriesAweme,
  fetchKnowledgeAweme: api.fetchKnowledgeAweme,
  fetchGameAweme: api.fetchGameAweme,
  fetchCartoonAweme: api.fetchCartoonAweme,
  fetchMusicAweme: api.fetchMusicAweme,
  fetchFoodAweme: api.fetchFoodAweme,
  fetchOneVideo: api.fetchOneVideo,
  fetchOneVideoV2: api.fetchOneVideoV2,
  fetchOneVideoV3: api.fetchOneVideoV3,
  fetchShareInfoByShareCode: api.fetchShareInfoByShareCode,
  fetchMultiVideo: api.fetchMultiVideo,
  fetchMultiVideoV2: api.fetchMultiVideoV2,
  fetchOneVideoByShareUrl: api.fetchOneVideoByShareUrl,
  fetchVideoHighQualityPlayUrl: api.fetchVideoHighQualityPlayUrl,
  fetchMultiVideoHighQualityPlayUrl: api.fetchMultiVideoHighQualityPlayUrl,
  handlerUserProfile: api.handlerUserProfile,
  fetchUserFansList: api.fetchUserFansList,
  fetchUserPostVideos: api.fetchUserPostVideos,
  fetchVideoMixDetail: api.fetchVideoMixDetail,
  fetchVideoMixPostList: api.fetchVideoMixPostList,
  fetchUserSeriesList: api.fetchUserSeriesList,
  fetchSeriesVideoList: api.fetchSeriesVideoList,
  fetchSeriesDetail: api.fetchSeriesDetail,
  fetchMusicDetail: api.fetchMusicDetail,
  fetchMusicVideoList: api.fetchMusicVideoList,
  fetchHashtagDetail: api.fetchHashtagDetail,
  fetchHashtagVideoList: api.fetchHashtagVideoList,
  fetchLiveGiftRanking: api.fetchLiveGiftRanking,
  fetchVideoStatistics: api.fetchVideoStatistics,
  fetchMultiVideoStatistics: api.fetchMultiVideoStatistics,
  fetchCreatorMaterialCenterBillboard: api.fetchCreatorMaterialCenterBillboard,
  fetchCreatorHotSpotBillboard: api.fetchCreatorHotSpotBillboard,
  fetchCreatorHotTopicBillboard: api.fetchCreatorHotTopicBillboard,
  fetchCreatorHotPropsBillboard: api.fetchCreatorHotPropsBillboard,
  fetchCreatorHotChallengeBillboard: api.fetchCreatorHotChallengeBillboard,
  fetchCreatorHotMusicBillboard: api.fetchCreatorHotMusicBillboard,
  fetchItemPlaySource: api.fetchItemPlaySource,
  fetchItemWatchTrend: api.fetchItemWatchTrend,
  fetchItemDanmakuAnalysis: api.fetchItemDanmakuAnalysis,
  fetchItemAudiencePortrait: api.fetchItemAudiencePortrait,
  fetchItemAudienceOthers: api.fetchItemAudienceOthers,
  fetchItemAnalysisOverview: api.fetchItemAnalysisOverview,
  fetchAllValidDate: api.fetchAllValidDate,
  fetchValidDateForRelation: api.fetchValidDateForRelation,
  fetchAllArea: api.fetchAllArea,
  fetchCurrentHotTopic: api.fetchCurrentHotTopic,
  fetchHotWords: api.fetchHotWords,
  fetchKeywordValidDate: api.fetchKeywordValidDate,
  fetchMultiKeywordHotTrend: api.fetchMultiKeywordHotTrend,
  fetchMultiKeywordInterpretation: api.fetchMultiKeywordInterpretation,
  fetchRelationWord: api.fetchRelationWord,
  fetchPortrait: api.fetchPortrait,
  fetchGetUserSubWord: api.fetchGetUserSubWord,
  fetchEncryptUserId: api.fetchEncryptUserId,
  fetchDarenCompareUsersStable: api.fetchDarenCompareUsersStable,
  fetchDarenSimilarUsers: api.fetchDarenSimilarUsers,
  fetchDarenGreatUserTopVideo: api.fetchDarenGreatUserTopVideo,
  fetchDarenGreatItemMileInfo: api.fetchDarenGreatItemMileInfo,
  fetchDarenGreatUserFansInfo: api.fetchDarenGreatUserFansInfo,
  fetchBrandValidInfo: api.fetchBrandValidInfo,
  fetchBrandRadarChart: api.fetchBrandRadarChart,
  fetchBrandLines: api.fetchBrandLines,
  fetchBrandCycles: api.fetchBrandCycles,
  fetchBrandInitiativeRankWeekly: api.fetchBrandInitiativeRankWeekly,
  fetchContentValidDate: api.fetchContentValidDate,
  fetchBrandHotVideosTimeScope: api.fetchBrandHotVideosTimeScope,
  fetchContentCreativeKeywords: api.fetchContentCreativeKeywords,
  fetchContentCreativeKeywordItems: api.fetchContentCreativeKeywordItems,
  fetchContentCreativeTopic: api.fetchContentCreativeTopic,
  fetchContentPublishTrend: api.fetchContentPublishTrend,
  fetchContentCreativeDuration: api.fetchContentCreativeDuration,
  fetchContentAuthorPortrait: api.fetchContentAuthorPortrait,
  fetchContentConsumerPortrait: api.fetchContentConsumerPortrait,
  fetchContentInteractTrend: api.fetchContentInteractTrend,
  fetchContentConsumeTrend: api.fetchContentConsumeTrend,
  fetchInsightRecommend: api.fetchInsightRecommend,
  fetchReportDetail: api.fetchReportDetail,
  fetchInsightGetRec: api.fetchInsightGetRec,
  fetchCityList: api.fetchCityList,
  fetchContentTag: api.fetchContentTag,
  fetchHotCategoryList: api.fetchHotCategoryList,
  fetchHotRiseList: api.fetchHotRiseList,
  fetchHotCityList: api.fetchHotCityList,
  fetchHotChallengeList: api.fetchHotChallengeList,
  fetchHotTotalList: api.fetchHotTotalList,
  fetchHotCalendarList: api.fetchHotCalendarList,
  fetchHotCalendarDetail: api.fetchHotCalendarDetail,
  fetchHotUserPortraitList: api.fetchHotUserPortraitList,
  fetchHotCommentWordList: api.fetchHotCommentWordList,
  fetchHotItemTrendsList: api.fetchHotItemTrendsList,
  fetchHotAccountList: api.fetchHotAccountList,
  fetchHotAccountTrendsList: api.fetchHotAccountTrendsList,
  fetchHotAccountItemAnalysisList: api.fetchHotAccountItemAnalysisList,
  fetchHotAccountFansPortraitList: api.fetchHotAccountFansPortraitList,
  fetchHotAccountFansInterestAccountList: api.fetchHotAccountFansInterestAccountList,
  fetchHotAccountFansInterestTopicList: api.fetchHotAccountFansInterestTopicList,
  fetchHotTotalVideoList: api.fetchHotTotalVideoList,
  fetchHotTotalLowFanList: api.fetchHotTotalLowFanList,
  fetchHotTotalHighPlayList: api.fetchHotTotalHighPlayList,
  fetchHotTotalHighLikeList: api.fetchHotTotalHighLikeList,
  fetchHotTotalHighFanList: api.fetchHotTotalHighFanList,
  fetchHotTotalTopicList: api.fetchHotTotalTopicList,
  fetchHotTotalHighTopicList: api.fetchHotTotalHighTopicList,
  fetchHotTotalHotWordList: api.fetchHotTotalHotWordList,
  fetchHotTotalHotWordDetailList: api.fetchHotTotalHotWordDetailList,
  kolConversionAbilityAnalysisV1: api.kolConversionAbilityAnalysisV1,
  kolXingtuIndexV1: api.kolXingtuIndexV1,
  kolCpInfoV1: api.kolCpInfoV1,
  authorHotCommentTokensV1: api.authorHotCommentTokensV1,
  authorContentHotCommentKeywordsV1: api.authorContentHotCommentKeywordsV1,
  getRankingListCatalog: api.getRankingListCatalog,
  getRankingListData: api.getRankingListData,
  getPlayletActorRankCatalog: api.getPlayletActorRankCatalog,
  getPlayletActorRankList: api.getPlayletActorRankList,
  getContentTrendGuide: api.getContentTrendGuide,
  fetchUserFollowingList: api.fetchUserFollowingList,
  fetchUserLikeVideos: api.fetchUserLikeVideos,
  fetchVideoComments: api.fetchVideoComments,
  fetchVideoCommentReplies: api.fetchVideoCommentReplies,
  fetchUserSearchResultV2: api.fetchUserSearchResultV2,
  fetchUserSearchResultV3: api.fetchUserSearchResultV3,
  fetchSearchChallenge: api.fetchSearchChallenge,
  fetchHotSearchResult: api.fetchHotSearchResult,
  fetchQueryUser: api.fetchQueryUser,
  fetchGeneralSearchResult: api.fetchGeneralSearchResult,
  fetchVideoSearchResult: api.fetchVideoSearchResult,
  fetchVideoSearchResultV2: api.fetchVideoSearchResultV2,
  fetchUserSearchResult: api.fetchUserSearchResult,
  fetchLiveSearchResult: api.fetchLiveSearchResult,
  fetchMusicSearchResult: api.fetchMusicSearchResult,
  fetchHashtagSearchResult: api.fetchHashtagSearchResult,
  fetchHotSearchList: api.fetchHotSearchList,
  fetchLiveHotSearchList: api.fetchLiveHotSearchList,
  fetchMusicHotSearchList: api.fetchMusicHotSearchList,
  fetchBrandHotSearchList: api.fetchBrandHotSearchList,
  fetchBrandHotSearchListDetail: api.fetchBrandHotSearchListDetail,
  openDouyinAppToKeywordSearch: api.openDouyinAppToKeywordSearch,
  fetchItemSearchKeyword: api.fetchItemSearchKeyword,
  fetchDarenSugGreatUserList: api.fetchDarenSugGreatUserList,
  fetchItemFilterOptions: api.fetchItemFilterOptions,
  fetchItemSug: api.fetchItemSug,
  fetchItemQuery: api.fetchItemQuery,
  fetchBrandSuggest: api.fetchBrandSuggest,
  fetchTopicSuggest: api.fetchTopicSuggest,
  fetchTopicQuery: api.fetchTopicQuery,
  fetchReportSearch: api.fetchReportSearch,
  fetchGeneralSearchV1: api.fetchGeneralSearchV1,
  fetchGeneralSearchV2: api.fetchGeneralSearchV2,
  fetchSearchSuggest: api.fetchSearchSuggest,
  fetchVideoSearchV1: api.fetchVideoSearchV1,
  fetchVideoSearchV2: api.fetchVideoSearchV2,
  fetchMultiSearch: api.fetchMultiSearch,
  fetchUserSearch: api.fetchUserSearch,
  fetchUserSearchV2: api.fetchUserSearchV2,
  fetchImageSearch: api.fetchImageSearch,
  fetchImageSearchV3: api.fetchImageSearchV3,
  fetchLiveSearchV1: api.fetchLiveSearchV1,
  fetchChallengeSearchV1: api.fetchChallengeSearchV1,
  fetchChallengeSearchV2: api.fetchChallengeSearchV2,
  fetchChallengeSuggest: api.fetchChallengeSuggest,
  fetchExperienceSearch: api.fetchExperienceSearch,
  fetchMusicSearch: api.fetchMusicSearch,
  fetchDiscussSearch: api.fetchDiscussSearch,
  fetchSchoolSearch: api.fetchSchoolSearch,
  fetchVisionSearch: api.fetchVisionSearch,
  fetchHotAccountSearchList: api.fetchHotAccountSearchList,
  fetchHotAccountFansInterestSearchList: api.fetchHotAccountFansInterestSearchList,
  fetchHotTotalSearchList: api.fetchHotTotalSearchList,
  fetchHotTotalHighSearchList: api.fetchHotTotalHighSearchList,
  searchKolV1: api.searchKolV1,
  searchKolV2: api.searchKolV2,
  getDemanderMcnList: api.getDemanderMcnList,
  generateDouyinShortUrl: api.generateDouyinShortUrl,
  generateDouyinVideoShareQrcode: api.generateDouyinVideoShareQrcode,
  openDouyinAppToVideoDetail: api.openDouyinAppToVideoDetail,
  openDouyinAppToUserProfile: api.openDouyinAppToUserProfile,
  openDouyinAppToSendPrivateMessage: api.openDouyinAppToSendPrivateMessage,
  getSecUserId: api.getSecUserId,
  getAllSecUserId: api.getAllSecUserId,
  getAwemeId: api.getAwemeId,
  getAllAwemeId: api.getAllAwemeId,
  getWebcastId: api.getWebcastId,
  getAllWebcastId: api.getAllWebcastId,
  douyinLiveRoom: api.douyinLiveRoom,
  fetchCreatorActivityList: api.fetchCreatorActivityList,
  fetchCreatorActivityDetail: api.fetchCreatorActivityDetail,
  fetchCreatorMaterialCenterConfig: api.fetchCreatorMaterialCenterConfig,
  fetchCreatorHotCourse: api.fetchCreatorHotCourse,
  fetchCreatorContentCategory: api.fetchCreatorContentCategory,
  fetchCreatorContentCourse: api.fetchCreatorContentCourse,
  fetchVideoDanmakuList: api.fetchVideoDanmakuList,
  fetchMissionTaskList: api.fetchMissionTaskList,
  fetchIndustryCategoryConfig: api.fetchIndustryCategoryConfig,
  fetchItemOverviewData: api.fetchItemOverviewData,
  fetchItemAnalysisInvolvedVertical: api.fetchItemAnalysisInvolvedVertical,
  fetchItemAnalysisItemPerformance: api.fetchItemAnalysisItemPerformance,
  fetchItemList: api.fetchItemList,
  fetchItemListDownload: api.fetchItemListDownload,
  fetchLiveRoomHistoryList: api.fetchLiveRoomHistoryList,
  fetchAuthorDiagnosis: api.fetchAuthorDiagnosis,
  getSignImage: api.getSignImage,
  getXingtuKolidByUid: api.getXingtuKolidByUid,
  getXingtuKolidBySecUserId: api.getXingtuKolidBySecUserId,
  getXingtuKolidByUniqueId: api.getXingtuKolidByUniqueId,
  kolBaseInfoV1: api.kolBaseInfoV1,
  kolAudiencePortraitV1: api.kolAudiencePortraitV1,
  kolFansPortraitV1: api.kolFansPortraitV1,
  kolServicePriceV1: api.kolServicePriceV1,
  kolDataOverviewV1: api.kolDataOverviewV1,
  kolVideoPerformanceV1: api.kolVideoPerformanceV1,
  kolConvertVideoDisplayV1: api.kolConvertVideoDisplayV1,
  kolLinkStructV1: api.kolLinkStructV1,
  kolTouchDistributionV1: api.kolTouchDistributionV1,
  kolRecVideosV1: api.kolRecVideosV1,
  kolDailyFansV1: api.kolDailyFansV1,
  getAuthorMarketFields: api.getAuthorMarketFields,
  getAuthorBaseInfo: api.getAuthorBaseInfo,
  getAuthorBusinessCardInfo: api.getAuthorBusinessCardInfo,
  getAuthorLocalInfo: api.getAuthorLocalInfo,
  getAuthorShowItems: api.getAuthorShowItems,
  getAuthorHotCommentTokens: api.getAuthorHotCommentTokens,
  getAuthorContentHotKeywords: api.getAuthorContentHotKeywords,
  getRecommendForStarAuthors: api.getRecommendForStarAuthors,
  getExcellentCaseCategoryList: api.getExcellentCaseCategoryList,
  getAuthorSpreadInfo: api.getAuthorSpreadInfo,
  getUserProfileQrcode: api.getUserProfileQrcode,
  getIpActivityIndustryList: api.getIpActivityIndustryList,
  getIpActivityList: api.getIpActivityList,
  getIpActivityDetail: api.getIpActivityDetail,
  getResourceList: api.getResourceList,
};
