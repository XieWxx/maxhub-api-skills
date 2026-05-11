// 第三方接口请求封装 - tiktok
// 基于MaxHub API中转站调用，包含所有API

const config = require('../config.json');
const BASE_URL = config.apiBase.url;
const AUTH_HEADER = config.apiBase.authHeader;
const AUTH_ENV_NAME = config.apiBase.authEnvVar;
const PLATFORM = 'tiktok';

/**
 * 通用API请求方法
 * @param {string} path - API路径
 * @param {object} params - 请求参数
 * @param {string} method - 请求方法 GET/POST
 * @returns {Promise<object>} API响应数据
 */
async function request(path, params = {}, method = 'GET') {
  const url = `${BASE_URL}${path}`;
  const headers = {
    [AUTH_HEADER]: process.env[AUTH_ENV_NAME],
    'Content-Type': 'application/json',
  };
  const options = { method, headers };
  if (method === 'GET') {
    const query = new URLSearchParams(params).toString();
    const fullUrl = query ? `${url}?${query}` : url;
    const response = await fetch(fullUrl, options);
    return handleResponse(response);
  }
  options.body = JSON.stringify(params);
  const response = await fetch(url, options);
  return handleResponse(response);
}

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

const API_REGISTRY = {
  // web
  fetchPostDetail: { path: '/web/fetch_post_detail', params: ['itemId'] },
  fetchPostDetailV2: { path: '/web/fetch_post_detail_v2', params: ['itemId'] },
  fetchExplorePost: { path: '/web/fetch_explore_post' },
  fetchUserProfile: { path: '/web/fetch_user_profile' },
  fetchUserPost: { path: '/web/fetch_user_post', params: ['secUid'] },
  fetchUserRepost: { path: '/web/fetch_user_repost', params: ['secUid'] },
  fetchUserPlayList: { path: '/web/fetch_user_play_list', params: ['secUid'] },
  fetchUserMix: { path: '/web/fetch_user_mix', params: ['mixId'] },
  fetchUserLiveDetail: { path: '/web/fetch_user_live_detail', params: ['uniqueId'] },
  fetchTagDetail: { path: '/web/fetch_tag_detail', params: ['tag_name'] },
  fetchTagPost: { path: '/web/fetch_tag_post', params: ['challengeID'] },
  encryptStrData: { path: '/web/encrypt_strData', params: ['data'] },
  decryptStrData: { path: '/web/decrypt_strData', params: ['encrypted_data'] },
  getUniqueId: { path: '/web/get_unique_id', params: ['url'] },
  getAllUniqueId: { path: '/web/get_all_unique_id', method: 'POST' },
  fetchLiveImFetch: { path: '/web/fetch_live_im_fetch', params: ['room_id'] },
  fetchCheckLiveAlive: { path: '/web/fetch_check_live_alive', params: ['room_id'] },
  fetchBatchCheckLiveAlive: { path: '/web/fetch_batch_check_live_alive', params: ['room_ids'] },
  fetchTiktokLiveData: { path: '/web/fetch_tiktok_live_data', params: ['live_room_url'] },
  fetchLiveRecommend: { path: '/web/fetch_live_recommend', params: ['related_live_tag'] },
  fetchLiveGiftList: { path: '/web/fetch_live_gift_list' },
  fetchGiftNameById: { path: '/web/fetch_gift_name_by_id', method: 'POST' },
  fetchGiftNamesByIds: { path: '/web/fetch_gift_names_by_ids', method: 'POST' },
  fetchTrendingPost: { path: '/web/fetch_trending_post' },
  fetchTrendingSearchwords: { path: '/web/fetch_trending_searchwords' },
  fetchGeneralSearch: { path: '/web/fetch_general_search', params: ['keyword'] },
  fetchSearchKeywordSuggest: { path: '/web/fetch_search_keyword_suggest', params: ['keyword'] },
  fetchSearchUser: { path: '/web/fetch_search_user', params: ['keyword'] },
  fetchSearchVideo: { path: '/web/fetch_search_video', params: ['keyword'] },
  fetchSearchLive: { path: '/web/fetch_search_live', params: ['keyword'] },
  fetchSearchPhoto: { path: '/web/fetch_search_photo', params: ['keyword'] },
  fetchUserLike: { path: '/web/fetch_user_like', params: ['secUid'] },
  fetchUserCollect: { path: '/web/fetch_user_collect', params: ['cookie', 'secUid'] },
  fetchPostComment: { path: '/web/fetch_post_comment', params: ['aweme_id'] },
  fetchPostCommentReply: { path: '/web/fetch_post_comment_reply', params: ['item_id', 'comment_id'] },
  fetchUserFans: { path: '/web/fetch_user_fans', params: ['secUid'] },
  fetchUserFollow: { path: '/web/fetch_user_follow', params: ['secUid'] },
  generateXbogus: { path: '/web/generate_xbogus', method: 'POST' },
  generateHashedId: { path: '/web/generate_hashed_id', params: ['email'] },
  getUserId: { path: '/web/get_user_id', params: ['url'] },
  getSecUserId: { path: '/web/get_sec_user_id', params: ['url'] },
  getAllSecUserId: { path: '/web/get_all_sec_user_id', method: 'POST' },
  getAwemeId: { path: '/web/get_aweme_id', params: ['url'] },
  getAllAwemeId: { path: '/web/get_all_aweme_id', method: 'POST' },
  tiktokLiveRoom: { path: '/web/tiktok_live_room', params: ['live_room_url', 'danmaku_type'] },
  getLiveRoomId: { path: '/web/get_live_room_id', params: ['live_room_url'] },
  // app/v3
  fetchOneVideo: { path: '/app/v3/fetch_one_video', params: ['aweme_id'] },
  fetchOneVideoV2: { path: '/app/v3/fetch_one_video_v2', params: ['aweme_id'] },
  fetchOneVideoV3: { path: '/app/v3/fetch_one_video_v3', params: ['aweme_id'] },
  fetchMultiVideo: { path: '/app/v3/fetch_multi_video', method: 'POST' },
  fetchMultiVideoV2: { path: '/app/v3/fetch_multi_video_v2', method: 'POST' },
  fetchOneVideoByShareUrlV2: { path: '/app/v3/fetch_one_video_by_share_url_v2', params: ['share_url'] },
  fetchOneVideoByShareUrl: { path: '/app/v3/fetch_one_video_by_share_url', params: ['share_url'] },
  getUserIdAndSecUserIdByUsername: { path: '/app/v3/get_user_id_and_sec_user_id_by_username', params: ['username'] },
  handlerUserProfile: { path: '/app/v3/handler_user_profile' },
  fetchWebcastUserInfo: { path: '/app/v3/fetch_webcast_user_info' },
  fetchUserCountryByUsername: { path: '/app/v3/fetch_user_country_by_username', params: ['username'] },
  fetchSimilarUserRecommendations: { path: '/app/v3/fetch_similar_user_recommendations', params: ['sec_uid'] },
  fetchUserRepostVideos: { path: '/app/v3/fetch_user_repost_videos', params: ['user_id'] },
  fetchUserPostVideos: { path: '/app/v3/fetch_user_post_videos' },
  fetchUserPostVideosV2: { path: '/app/v3/fetch_user_post_videos_v2' },
  fetchUserPostVideosV3: { path: '/app/v3/fetch_user_post_videos_v3' },
  fetchMusicDetail: { path: '/app/v3/fetch_music_detail', params: ['music_id'] },
  fetchMusicVideoList: { path: '/app/v3/fetch_music_video_list', params: ['music_id'] },
  fetchHashtagDetail: { path: '/app/v3/fetch_hashtag_detail', params: ['ch_id'] },
  fetchHashtagVideoList: { path: '/app/v3/fetch_hashtag_video_list', params: ['ch_id'] },
  fetchLiveRoomInfo: { path: '/app/v3/fetch_live_room_info', params: ['room_id'] },
  checkLiveRoomOnline: { path: '/app/v3/check_live_room_online', params: ['room_id'] },
  checkLiveRoomOnlineBatch: { path: '/app/v3/check_live_room_online_batch', method: 'POST' },
  fetchShareShortLink: { path: '/app/v3/fetch_share_short_link', params: ['url'] },
  fetchShareQrCode: { path: '/app/v3/fetch_share_qr_code', params: ['object_id'] },
  fetchShopIdByShareLink: { path: '/app/v3/fetch_shop_id_by_share_link', params: ['share_link'] },
  fetchProductIdByShareLink: { path: '/app/v3/fetch_product_id_by_share_link', params: ['share_link'] },
  fetchProductDetailV4: { path: '/app/v3/fetch_product_detail_v4', params: ['product_id'] },
  fetchProductReview: { path: '/app/v3/fetch_product_review', params: ['product_id'] },
  fetchShopHomePageList: { path: '/app/v3/fetch_shop_home_page_list', params: ['seller_id'] },
  fetchShopHome: { path: '/app/v3/fetch_shop_home', params: ['page_id', 'seller_id'] },
  fetchShopProductRecommend: { path: '/app/v3/fetch_shop_product_recommend', params: ['seller_id'] },
  fetchShopProductList: { path: '/app/v3/fetch_shop_product_list', params: ['seller_id'] },
  fetchShopProductListV2: { path: '/app/v3/fetch_shop_product_list_v2', params: ['seller_id'] },
  fetchShopInfo: { path: '/app/v3/fetch_shop_info', params: ['shop_id'] },
  fetchShopProductCategory: { path: '/app/v3/fetch_shop_product_category', params: ['seller_id'] },
  fetchUserMusicList: { path: '/app/v3/fetch_user_music_list', params: ['sec_uid'] },
  fetchContentTranslate: { path: '/app/v3/fetch_content_translate', method: 'POST' },
  fetchHomeFeed: { path: '/app/v3/fetch_home_feed', method: 'POST' },
  fetchLiveRoomProductList: { path: '/app/v3/fetch_live_room_product_list', params: ['room_id', 'author_id'] },
  fetchLiveRoomProductListV2: { path: '/app/v3/fetch_live_room_product_list_v2', params: ['room_id', 'author_id'] },
  fetchMusicChartList: { path: '/app/v3/fetch_music_chart_list' },
  fetchLiveRankingList: { path: '/app/v3/fetch_live_ranking_list', params: ['room_id', 'anchor_id'] },
  fetchLiveDailyRank: { path: '/app/v3/fetch_live_daily_rank' },
  fetchGeneralSearchResult: { path: '/app/v3/fetch_general_search_result', params: ['keyword'] },
  fetchVideoSearchResult: { path: '/app/v3/fetch_video_search_result', params: ['keyword'] },
  fetchUserSearchResult: { path: '/app/v3/fetch_user_search_result', params: ['keyword'] },
  fetchMusicSearchResult: { path: '/app/v3/fetch_music_search_result', params: ['keyword'] },
  fetchHashtagSearchResult: { path: '/app/v3/fetch_hashtag_search_result', params: ['keyword'] },
  fetchLiveSearchResult: { path: '/app/v3/fetch_live_search_result', params: ['keyword'] },
  fetchLocationSearch: { path: '/app/v3/fetch_location_search', params: ['keyword'] },
  fetchCreatorSearchInsights: { path: '/app/v3/fetch_creator_search_insights' },
  fetchCreatorSearchInsightsDetail: { path: '/app/v3/fetch_creator_search_insights_detail', params: ['query_id_str'] },
  fetchCreatorSearchInsightsTrend: { path: '/app/v3/fetch_creator_search_insights_trend', params: ['query_id_str'] },
  fetchCreatorSearchInsightsVideos: { path: '/app/v3/fetch_creator_search_insights_videos', params: ['keyword'] },
  searchFollowerList: { path: '/app/v3/search_follower_list', params: ['user_id', 'keyword'] },
  searchFollowingList: { path: '/app/v3/search_following_list', params: ['user_id', 'keyword'] },
  fetchProductSearch: { path: '/app/v3/fetch_product_search', params: ['keyword'] },
  openTiktokAppToKeywordSearch: { path: '/app/v3/open_tiktok_app_to_keyword_search', params: ['keyword'] },
  fetchUserLikeVideos: { path: '/app/v3/fetch_user_like_videos', params: ['sec_user_id'] },
  fetchVideoComments: { path: '/app/v3/fetch_video_comments', params: ['aweme_id'] },
  fetchVideoCommentReplies: { path: '/app/v3/fetch_video_comment_replies', params: ['item_id', 'comment_id'] },
  fetchUserFollowerList: { path: '/app/v3/fetch_user_follower_list' },
  fetchUserFollowingList: { path: '/app/v3/fetch_user_following_list' },
  openTiktokAppToVideoDetail: { path: '/app/v3/open_tiktok_app_to_video_detail', params: ['aweme_id'] },
  openTiktokAppToUserProfile: { path: '/app/v3/open_tiktok_app_to_user_profile', params: ['uid'] },
  openTiktokAppToSendPrivateMessage: { path: '/app/v3/open_tiktok_app_to_send_private_message', params: ['uid'] },
  fetchCreatorInfo: { path: '/app/v3/fetch_creator_info', params: ['creator_uid'] },
  fetchCreatorShowcaseProductList: { path: '/app/v3/fetch_creator_showcase_product_list', params: ['kol_id'] },
  // ads
  getAdsDetail: { path: '/ads/get_ads_detail', params: ['ads_id'] },
  getKeywordInsights: { path: '/ads/get_keyword_insights' },
  getTopProducts: { path: '/ads/get_top_products' },
  getHashtagList: { path: '/ads/get_hashtag_list' },
  getKeywordList: { path: '/ads/get_keyword_list' },
  getTopAdsSpotlight: { path: '/ads/get_top_ads_spotlight' },
  getAdPercentile: { path: '/ads/get_ad_percentile', params: ['material_id'] },
  getRecommendedAds: { path: '/ads/get_recommended_ads', params: ['material_id'] },
  getKeywordFilters: { path: '/ads/get_keyword_filters' },
  getRelatedKeywords: { path: '/ads/get_related_keywords' },
  getKeywordDetails: { path: '/ads/get_keyword_details' },
  getProductFilters: { path: '/ads/get_product_filters' },
  getProductMetrics: { path: '/ads/get_product_metrics', params: ['id'] },
  getProductDetail: { path: '/ads/get_product_detail', params: ['id'] },
  getHashtagFilters: { path: '/ads/get_hashtag_filters' },
  getSoundFilters: { path: '/ads/get_sound_filters' },
  getSoundDetail: { path: '/ads/get_sound_detail', params: ['clip_id'] },
  getSoundRecommendations: { path: '/ads/get_sound_recommendations', params: ['clip_id'] },
  getSoundRankList: { path: '/ads/get_sound_rank_list' },
  getAdKeyframeAnalysis: { path: '/ads/get_ad_keyframe_analysis', params: ['material_id'] },
  getAdInteractiveAnalysis: { path: '/ads/get_ad_interactive_analysis', params: ['material_id'] },
  getCreativePatterns: { path: '/ads/get_creative_patterns' },
  getPopularTrends: { path: '/ads/get_popular_trends' },
  searchAds: { path: '/ads/search_ads' },
  getQuerySuggestions: { path: '/ads/get_query_suggestions' },
  searchSoundHint: { path: '/ads/search_sound_hint', params: ['keyword'] },
  searchSound: { path: '/ads/search_sound', params: ['keyword'] },
  searchCreators: { path: '/ads/search_creators', params: ['keyword'] },
  getHashtagCreator: { path: '/ads/get_hashtag_creator', params: ['hashtag'] },
  getCreatorFilters: { path: '/ads/get_creator_filters' },
  getCreatorList: { path: '/ads/get_creator_list' },
  // shop/web
  fetchProductDetail: { path: '/shop/web/fetch_product_detail', params: ['product_id'] },
  fetchProductDetailV2: { path: '/shop/web/fetch_product_detail_v2', params: ['product_id'] },
  fetchProductDetailV3: { path: '/shop/web/fetch_product_detail_v3', params: ['product_id'] },
  fetchSellerProductsList: { path: '/shop/web/fetch_seller_products_list', params: ['seller_id'] },
  fetchSellerProductsListV2: { path: '/shop/web/fetch_seller_products_list_v2', params: ['seller_id'] },
  fetchProductsCategoryList: { path: '/shop/web/fetch_products_category_list' },
  fetchProductsByCategoryId: { path: '/shop/web/fetch_products_by_category_id', params: ['category_id'] },
  fetchHotSellingProductsList: { path: '/shop/web/fetch_hot_selling_products_list' },
  fetchSearchWordSuggestion: { path: '/shop/web/fetch_search_word_suggestion', params: ['search_word'] },
  fetchSearchWordSuggestionV2: { path: '/shop/web/fetch_search_word_suggestion_v2', params: ['search_word'] },
  fetchSearchProductsList: { path: '/shop/web/fetch_search_products_list', params: ['search_word'] },
  fetchSearchProductsListV2: { path: '/shop/web/fetch_search_products_list_v2', params: ['search_word'] },
  fetchSearchProductsListV3: { path: '/shop/web/fetch_search_products_list_v3', params: ['keyword'] },
  fetchProductReviewsV1: { path: '/shop/web/fetch_product_reviews_v1', params: ['product_id'] },
  fetchProductReviewsV2: { path: '/shop/web/fetch_product_reviews_v2', params: ['product_id'] },
  // creator
  getLiveAnalyticsSummary: { path: '/creator/get_live_analytics_summary', method: 'POST' },
  getVideoAnalyticsSummary: { path: '/creator/get_video_analytics_summary', method: 'POST' },
  getVideoListAnalytics: { path: '/creator/get_video_list_analytics', method: 'POST' },
  getProductAnalyticsList: { path: '/creator/get_product_analytics_list', method: 'POST' },
  getVideoDetailedStats: { path: '/creator/get_video_detailed_stats', method: 'POST' },
  getVideoToProductStats: { path: '/creator/get_video_to_product_stats', method: 'POST' },
  getVideoAudienceStats: { path: '/creator/get_video_audience_stats', method: 'POST' },
  getAccountHealthStatus: { path: '/creator/get_account_health_status', method: 'POST' },
  getAccountViolationList: { path: '/creator/get_account_violation_list', method: 'POST' },
  getAccountInsightsOverview: { path: '/creator/get_account_insights_overview', method: 'POST' },
  getCreatorAccountInfo: { path: '/creator/get_creator_account_info', method: 'POST' },
  getShowcaseProductList: { path: '/creator/get_showcase_product_list', method: 'POST' },
  getVideoAssociatedProductList: { path: '/creator/get_video_associated_product_list', method: 'POST' },
  getProductRelatedVideos: { path: '/creator/get_product_related_videos', method: 'POST' },
  // analytics
  fetchVideoMetrics: { path: '/analytics/fetch_video_metrics', params: ['item_id'] },
  detectFakeViews: { path: '/analytics/detect_fake_views', params: ['item_id'] },
  fetchCommentKeywords: { path: '/analytics/fetch_comment_keywords', params: ['item_id'] },
  fetchCreatorInfoAndMilestones: { path: '/analytics/fetch_creator_info_and_milestones', params: ['user_id'] },
  // interaction
  apply: { path: '/interaction/apply', params: ['api_key', 'invite_code'] },
  postComment: { path: '/interaction/post_comment', method: 'POST' },
  replyComment: { path: '/interaction/reply_comment', method: 'POST' },
  like: { path: '/interaction/like', method: 'POST' },
  follow: { path: '/interaction/follow', method: 'POST' },
  collect: { path: '/interaction/collect', method: 'POST' },
  forward: { path: '/interaction/forward', method: 'POST' },
};

/**
 * 通用API调用方法
 * 根据API注册表动态调用，替代重复的函数定义
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
  Object.assign(reqParams, params);
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
module.exports = {
  request,
  callApi,
  API_REGISTRY,
  fetchPostDetail: api.fetchPostDetail,
  fetchPostDetailV2: api.fetchPostDetailV2,
  fetchExplorePost: api.fetchExplorePost,
  fetchUserProfile: api.fetchUserProfile,
  fetchUserPost: api.fetchUserPost,
  fetchUserRepost: api.fetchUserRepost,
  fetchUserPlayList: api.fetchUserPlayList,
  fetchUserMix: api.fetchUserMix,
  fetchUserLiveDetail: api.fetchUserLiveDetail,
  fetchTagDetail: api.fetchTagDetail,
  fetchTagPost: api.fetchTagPost,
  encryptStrData: api.encryptStrData,
  decryptStrData: api.decryptStrData,
  getUniqueId: api.getUniqueId,
  getAllUniqueId: api.getAllUniqueId,
  fetchLiveImFetch: api.fetchLiveImFetch,
  fetchCheckLiveAlive: api.fetchCheckLiveAlive,
  fetchBatchCheckLiveAlive: api.fetchBatchCheckLiveAlive,
  fetchTiktokLiveData: api.fetchTiktokLiveData,
  fetchLiveRecommend: api.fetchLiveRecommend,
  fetchLiveGiftList: api.fetchLiveGiftList,
  fetchGiftNameById: api.fetchGiftNameById,
  fetchGiftNamesByIds: api.fetchGiftNamesByIds,
  fetchOneVideo: api.fetchOneVideo,
  fetchOneVideoV2: api.fetchOneVideoV2,
  fetchOneVideoV3: api.fetchOneVideoV3,
  fetchMultiVideo: api.fetchMultiVideo,
  fetchMultiVideoV2: api.fetchMultiVideoV2,
  fetchOneVideoByShareUrlV2: api.fetchOneVideoByShareUrlV2,
  fetchOneVideoByShareUrl: api.fetchOneVideoByShareUrl,
  getUserIdAndSecUserIdByUsername: api.getUserIdAndSecUserIdByUsername,
  handlerUserProfile: api.handlerUserProfile,
  fetchWebcastUserInfo: api.fetchWebcastUserInfo,
  fetchUserCountryByUsername: api.fetchUserCountryByUsername,
  fetchSimilarUserRecommendations: api.fetchSimilarUserRecommendations,
  fetchUserRepostVideos: api.fetchUserRepostVideos,
  fetchUserPostVideos: api.fetchUserPostVideos,
  fetchUserPostVideosV2: api.fetchUserPostVideosV2,
  fetchUserPostVideosV3: api.fetchUserPostVideosV3,
  fetchMusicDetail: api.fetchMusicDetail,
  fetchMusicVideoList: api.fetchMusicVideoList,
  fetchHashtagDetail: api.fetchHashtagDetail,
  fetchHashtagVideoList: api.fetchHashtagVideoList,
  fetchLiveRoomInfo: api.fetchLiveRoomInfo,
  checkLiveRoomOnline: api.checkLiveRoomOnline,
  checkLiveRoomOnlineBatch: api.checkLiveRoomOnlineBatch,
  fetchShareShortLink: api.fetchShareShortLink,
  fetchShareQrCode: api.fetchShareQrCode,
  fetchShopIdByShareLink: api.fetchShopIdByShareLink,
  fetchProductIdByShareLink: api.fetchProductIdByShareLink,
  fetchProductDetailV4: api.fetchProductDetailV4,
  fetchProductReview: api.fetchProductReview,
  fetchShopHomePageList: api.fetchShopHomePageList,
  fetchShopHome: api.fetchShopHome,
  fetchShopProductRecommend: api.fetchShopProductRecommend,
  fetchShopProductList: api.fetchShopProductList,
  fetchShopProductListV2: api.fetchShopProductListV2,
  fetchShopInfo: api.fetchShopInfo,
  fetchShopProductCategory: api.fetchShopProductCategory,
  fetchUserMusicList: api.fetchUserMusicList,
  fetchContentTranslate: api.fetchContentTranslate,
  fetchHomeFeed: api.fetchHomeFeed,
  fetchLiveRoomProductList: api.fetchLiveRoomProductList,
  fetchLiveRoomProductListV2: api.fetchLiveRoomProductListV2,
  getAdsDetail: api.getAdsDetail,
  getKeywordInsights: api.getKeywordInsights,
  getTopProducts: api.getTopProducts,
  getHashtagList: api.getHashtagList,
  getKeywordList: api.getKeywordList,
  getTopAdsSpotlight: api.getTopAdsSpotlight,
  getAdPercentile: api.getAdPercentile,
  getRecommendedAds: api.getRecommendedAds,
  getKeywordFilters: api.getKeywordFilters,
  getRelatedKeywords: api.getRelatedKeywords,
  getKeywordDetails: api.getKeywordDetails,
  getProductFilters: api.getProductFilters,
  getProductMetrics: api.getProductMetrics,
  getProductDetail: api.getProductDetail,
  getHashtagFilters: api.getHashtagFilters,
  getSoundFilters: api.getSoundFilters,
  getSoundDetail: api.getSoundDetail,
  getSoundRecommendations: api.getSoundRecommendations,
  fetchProductDetail: api.fetchProductDetail,
  fetchProductDetailV2: api.fetchProductDetailV2,
  fetchProductDetailV3: api.fetchProductDetailV3,
  fetchSellerProductsList: api.fetchSellerProductsList,
  fetchSellerProductsListV2: api.fetchSellerProductsListV2,
  fetchProductsCategoryList: api.fetchProductsCategoryList,
  fetchProductsByCategoryId: api.fetchProductsByCategoryId,
  fetchHotSellingProductsList: api.fetchHotSellingProductsList,
  fetchTrendingPost: api.fetchTrendingPost,
  fetchMusicChartList: api.fetchMusicChartList,
  fetchLiveRankingList: api.fetchLiveRankingList,
  fetchLiveDailyRank: api.fetchLiveDailyRank,
  getLiveAnalyticsSummary: api.getLiveAnalyticsSummary,
  getVideoAnalyticsSummary: api.getVideoAnalyticsSummary,
  getVideoListAnalytics: api.getVideoListAnalytics,
  getProductAnalyticsList: api.getProductAnalyticsList,
  getVideoDetailedStats: api.getVideoDetailedStats,
  getVideoToProductStats: api.getVideoToProductStats,
  getVideoAudienceStats: api.getVideoAudienceStats,
  fetchVideoMetrics: api.fetchVideoMetrics,
  detectFakeViews: api.detectFakeViews,
  fetchCommentKeywords: api.fetchCommentKeywords,
  fetchCreatorInfoAndMilestones: api.fetchCreatorInfoAndMilestones,
  getSoundRankList: api.getSoundRankList,
  getAdKeyframeAnalysis: api.getAdKeyframeAnalysis,
  getAdInteractiveAnalysis: api.getAdInteractiveAnalysis,
  getCreativePatterns: api.getCreativePatterns,
  getPopularTrends: api.getPopularTrends,
  fetchTrendingSearchwords: api.fetchTrendingSearchwords,
  fetchGeneralSearch: api.fetchGeneralSearch,
  fetchSearchKeywordSuggest: api.fetchSearchKeywordSuggest,
  fetchSearchUser: api.fetchSearchUser,
  fetchSearchVideo: api.fetchSearchVideo,
  fetchSearchLive: api.fetchSearchLive,
  fetchSearchPhoto: api.fetchSearchPhoto,
  fetchGeneralSearchResult: api.fetchGeneralSearchResult,
  fetchVideoSearchResult: api.fetchVideoSearchResult,
  fetchUserSearchResult: api.fetchUserSearchResult,
  fetchMusicSearchResult: api.fetchMusicSearchResult,
  fetchHashtagSearchResult: api.fetchHashtagSearchResult,
  fetchLiveSearchResult: api.fetchLiveSearchResult,
  fetchLocationSearch: api.fetchLocationSearch,
  fetchCreatorSearchInsights: api.fetchCreatorSearchInsights,
  fetchCreatorSearchInsightsDetail: api.fetchCreatorSearchInsightsDetail,
  fetchCreatorSearchInsightsTrend: api.fetchCreatorSearchInsightsTrend,
  fetchCreatorSearchInsightsVideos: api.fetchCreatorSearchInsightsVideos,
  searchFollowerList: api.searchFollowerList,
  searchFollowingList: api.searchFollowingList,
  fetchProductSearch: api.fetchProductSearch,
  openTiktokAppToKeywordSearch: api.openTiktokAppToKeywordSearch,
  searchAds: api.searchAds,
  getQuerySuggestions: api.getQuerySuggestions,
  searchSoundHint: api.searchSoundHint,
  searchSound: api.searchSound,
  searchCreators: api.searchCreators,
  fetchSearchWordSuggestion: api.fetchSearchWordSuggestion,
  fetchSearchWordSuggestionV2: api.fetchSearchWordSuggestionV2,
  fetchSearchProductsList: api.fetchSearchProductsList,
  fetchSearchProductsListV2: api.fetchSearchProductsListV2,
  fetchSearchProductsListV3: api.fetchSearchProductsListV3,
  fetchUserLike: api.fetchUserLike,
  fetchUserCollect: api.fetchUserCollect,
  fetchPostComment: api.fetchPostComment,
  fetchPostCommentReply: api.fetchPostCommentReply,
  fetchUserFans: api.fetchUserFans,
  fetchUserFollow: api.fetchUserFollow,
  fetchUserLikeVideos: api.fetchUserLikeVideos,
  fetchVideoComments: api.fetchVideoComments,
  fetchVideoCommentReplies: api.fetchVideoCommentReplies,
  fetchUserFollowerList: api.fetchUserFollowerList,
  fetchUserFollowingList: api.fetchUserFollowingList,
  fetchProductReviewsV1: api.fetchProductReviewsV1,
  fetchProductReviewsV2: api.fetchProductReviewsV2,
  apply: api.apply,
  postComment: api.postComment,
  replyComment: api.replyComment,
  like: api.like,
  follow: api.follow,
  collect: api.collect,
  forward: api.forward,
  generateXbogus: api.generateXbogus,
  generateHashedId: api.generateHashedId,
  openTiktokAppToVideoDetail: api.openTiktokAppToVideoDetail,
  openTiktokAppToUserProfile: api.openTiktokAppToUserProfile,
  openTiktokAppToSendPrivateMessage: api.openTiktokAppToSendPrivateMessage,
  getUserId: api.getUserId,
  getSecUserId: api.getSecUserId,
  getAllSecUserId: api.getAllSecUserId,
  getAwemeId: api.getAwemeId,
  getAllAwemeId: api.getAllAwemeId,
  tiktokLiveRoom: api.tiktokLiveRoom,
  getLiveRoomId: api.getLiveRoomId,
  fetchCreatorInfo: api.fetchCreatorInfo,
  fetchCreatorShowcaseProductList: api.fetchCreatorShowcaseProductList,
  getAccountHealthStatus: api.getAccountHealthStatus,
  getAccountViolationList: api.getAccountViolationList,
  getAccountInsightsOverview: api.getAccountInsightsOverview,
  getCreatorAccountInfo: api.getCreatorAccountInfo,
  getShowcaseProductList: api.getShowcaseProductList,
  getVideoAssociatedProductList: api.getVideoAssociatedProductList,
  getProductRelatedVideos: api.getProductRelatedVideos,
  getHashtagCreator: api.getHashtagCreator,
  getCreatorFilters: api.getCreatorFilters,
  getCreatorList: api.getCreatorList,
};
