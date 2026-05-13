// 第三方接口请求封装 - tiktok
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
 * 价格规则：web端0.01，app/v3端大部分0.01，v2版本0.02，v3/v4版本0.02-0.03，ads端大部分0.01
 */
const API_REGISTRY = {
  // web
  fetchPostDetail: { path: '/web/fetch_post_detail', params: ['itemId'], price: 0.01 },
  fetchPostDetailV2: { path: '/web/fetch_post_detail_v2', params: ['itemId'], price: 0.01 },
  fetchExplorePost: { path: '/web/fetch_explore_post', price: 0.01 },
  fetchUserProfile: { path: '/web/fetch_user_profile', price: 0.01 },
  fetchUserPost: { path: '/web/fetch_user_post', params: ['secUid'], price: 0.01 },
  fetchUserRepost: { path: '/web/fetch_user_repost', params: ['secUid'], price: 0.01 },
  fetchUserPlayList: { path: '/web/fetch_user_play_list', params: ['secUid'], price: 0.01 },
  fetchUserMix: { path: '/web/fetch_user_mix', params: ['mixId'], price: 0.01 },
  fetchUserLiveDetail: { path: '/web/fetch_user_live_detail', params: ['uniqueId'], price: 0.01 },
  fetchTagDetail: { path: '/web/fetch_tag_detail', params: ['tag_name'], price: 0.01 },
  fetchTagPost: { path: '/web/fetch_tag_post', params: ['challengeID'], price: 0.01 },
  encryptStrData: { path: '/web/encrypt_strData', params: ['data'], price: 0.01 },
  decryptStrData: { path: '/web/decrypt_strData', params: ['encrypted_data'], price: 0.01 },
  getUniqueId: { path: '/web/get_unique_id', params: ['url'], price: 0.01 },
  getAllUniqueId: { path: '/web/get_all_unique_id', method: 'POST', price: 0.01 },
  fetchLiveImFetch: { path: '/web/fetch_live_im_fetch', params: ['room_id'], price: 0.01 },
  fetchCheckLiveAlive: { path: '/web/fetch_check_live_alive', params: ['room_id'], price: 0.01 },
  fetchBatchCheckLiveAlive: { path: '/web/fetch_batch_check_live_alive', params: ['room_ids'], price: 0.25 },
  fetchTiktokLiveData: { path: '/web/fetch_tiktok_live_data', params: ['live_room_url'], price: 0.01 },
  fetchLiveRecommend: { path: '/web/fetch_live_recommend', params: ['related_live_tag'], price: 0.01 },
  fetchLiveGiftList: { path: '/web/fetch_live_gift_list', price: 0.25 },
  fetchGiftNameById: { path: '/web/fetch_gift_name_by_id', method: 'POST', price: 0.01 },
  fetchGiftNamesByIds: { path: '/web/fetch_gift_names_by_ids', method: 'POST', price: 0.01 },
  fetchTrendingPost: { path: '/web/fetch_trending_post', price: 0.01 },
  fetchTrendingSearchwords: { path: '/web/fetch_trending_searchwords', price: 0.01 },
  fetchGeneralSearch: { path: '/web/fetch_general_search', params: ['keyword'], price: 0.01 },
  fetchSearchKeywordSuggest: { path: '/web/fetch_search_keyword_suggest', params: ['keyword'], price: 0.01 },
  fetchSearchUser: { path: '/web/fetch_search_user', params: ['keyword'], price: 0.01 },
  fetchSearchVideo: { path: '/web/fetch_search_video', params: ['keyword'], price: 0.01 },
  fetchSearchLive: { path: '/web/fetch_search_live', params: ['keyword'], price: 0.01 },
  fetchSearchPhoto: { path: '/web/fetch_search_photo', params: ['keyword'], price: 0.01 },
  fetchUserLike: { path: '/web/fetch_user_like', params: ['secUid'], price: 0.01 },
  fetchUserCollect: { path: '/web/fetch_user_collect', params: ['cookie', 'secUid'], price: 0.01 },
  fetchPostComment: { path: '/web/fetch_post_comment', params: ['aweme_id'], price: 0.01 },
  fetchPostCommentReply: { path: '/web/fetch_post_comment_reply', params: ['item_id', 'comment_id'], price: 0.01 },
  fetchUserFans: { path: '/web/fetch_user_fans', params: ['secUid'], price: 0.01 },
  fetchUserFollow: { path: '/web/fetch_user_follow', params: ['secUid'], price: 0.01 },
  generateXbogus: { path: '/web/generate_xbogus', method: 'POST', price: 0.01 },
  generateHashedId: { path: '/web/generate_hashed_id', params: ['email'], price: 0.01 },
  getUserId: { path: '/web/get_user_id', params: ['url'], price: 0.01 },
  getSecUserId: { path: '/web/get_sec_user_id', params: ['url'], price: 0.01 },
  getAllSecUserId: { path: '/web/get_all_sec_user_id', method: 'POST', price: 0.01 },
  getAwemeId: { path: '/web/get_aweme_id', params: ['url'], price: 0.01 },
  getAllAwemeId: { path: '/web/get_all_aweme_id', method: 'POST', price: 0.01 },
  tiktokLiveRoom: { path: '/web/tiktok_live_room', params: ['live_room_url', 'danmaku_type'], price: 0 },
  getLiveRoomId: { path: '/web/get_live_room_id', params: ['live_room_url'], price: 0.01 },
  // app/v3
  fetchOneVideo: { path: '/app/v3/fetch_one_video', params: ['aweme_id'], price: 0.01 },
  fetchOneVideoV2: { path: '/app/v3/fetch_one_video_v2', params: ['aweme_id'], price: 0.01 },
  fetchOneVideoV3: { path: '/app/v3/fetch_one_video_v3', params: ['aweme_id'], price: 0.01 },
  fetchMultiVideo: { path: '/app/v3/fetch_multi_video', method: 'POST', price: 0.1 },
  fetchMultiVideoV2: { path: '/app/v3/fetch_multi_video_v2', method: 'POST', price: 0.25 },
  fetchOneVideoByShareUrlV2: { path: '/app/v3/fetch_one_video_by_share_url_v2', params: ['share_url'], price: 0.01 },
  fetchOneVideoByShareUrl: { path: '/app/v3/fetch_one_video_by_share_url', params: ['share_url'], price: 0.01 },
  getUserIdAndSecUserIdByUsername: { path: '/app/v3/get_user_id_and_sec_user_id_by_username', params: ['username'], price: 0.01 },
  handlerUserProfile: { path: '/app/v3/handler_user_profile', price: 0.01 },
  fetchWebcastUserInfo: { path: '/app/v3/fetch_webcast_user_info', price: 0.01 },
  fetchUserCountryByUsername: { path: '/app/v3/fetch_user_country_by_username', params: ['username'], price: 0.01 },
  fetchSimilarUserRecommendations: { path: '/app/v3/fetch_similar_user_recommendations', params: ['sec_uid'], price: 0.01 },
  fetchUserRepostVideos: { path: '/app/v3/fetch_user_repost_videos', params: ['user_id'], price: 0.01 },
  fetchUserPostVideos: { path: '/app/v3/fetch_user_post_videos', price: 0.01 },
  fetchUserPostVideosV2: { path: '/app/v3/fetch_user_post_videos_v2', price: 0.01 },
  fetchUserPostVideosV3: { path: '/app/v3/fetch_user_post_videos_v3', price: 0.01 },
  fetchMusicDetail: { path: '/app/v3/fetch_music_detail', params: ['music_id'], price: 0.01 },
  fetchMusicVideoList: { path: '/app/v3/fetch_music_video_list', params: ['music_id'], price: 0.01 },
  fetchHashtagDetail: { path: '/app/v3/fetch_hashtag_detail', params: ['ch_id'], price: 0.01 },
  fetchHashtagVideoList: { path: '/app/v3/fetch_hashtag_video_list', params: ['ch_id'], price: 0.01 },
  fetchLiveRoomInfo: { path: '/app/v3/fetch_live_room_info', params: ['room_id'], price: 0.01 },
  checkLiveRoomOnline: { path: '/app/v3/check_live_room_online', params: ['room_id'], price: 0.01 },
  checkLiveRoomOnlineBatch: { path: '/app/v3/check_live_room_online_batch', method: 'POST', price: 0.1 },
  fetchShareShortLink: { path: '/app/v3/fetch_share_short_link', params: ['url'], price: 0.01 },
  fetchShareQrCode: { path: '/app/v3/fetch_share_qr_code', params: ['object_id'], price: 0.01 },
  fetchShopIdByShareLink: { path: '/app/v3/fetch_shop_id_by_share_link', params: ['share_link'], price: 0.01 },
  fetchProductIdByShareLink: { path: '/app/v3/fetch_product_id_by_share_link', params: ['share_link'], price: 0.01 },
  fetchProductDetailV4: { path: '/app/v3/fetch_product_detail_v4', params: ['product_id'], price: 0.02 },
  fetchProductReview: { path: '/app/v3/fetch_product_review', params: ['product_id'], price: 0.01 },
  fetchShopHomePageList: { path: '/app/v3/fetch_shop_home_page_list', params: ['seller_id'], price: 0.01 },
  fetchShopHome: { path: '/app/v3/fetch_shop_home', params: ['page_id', 'seller_id'], price: 0.01 },
  fetchShopProductRecommend: { path: '/app/v3/fetch_shop_product_recommend', params: ['seller_id'], price: 0.01 },
  fetchShopProductList: { path: '/app/v3/fetch_shop_product_list', params: ['seller_id'], price: 0.01 },
  fetchShopProductListV2: { path: '/app/v3/fetch_shop_product_list_v2', params: ['seller_id'], price: 0.01 },
  fetchShopInfo: { path: '/app/v3/fetch_shop_info', params: ['shop_id'], price: 0.01 },
  fetchShopProductCategory: { path: '/app/v3/fetch_shop_product_category', params: ['seller_id'], price: 0.01 },
  fetchUserMusicList: { path: '/app/v3/fetch_user_music_list', params: ['sec_uid'], price: 0.01 },
  fetchContentTranslate: { path: '/app/v3/fetch_content_translate', method: 'POST', price: 0.01 },
  fetchHomeFeed: { path: '/app/v3/fetch_home_feed', method: 'POST', price: 0.01 },
  fetchLiveRoomProductList: { path: '/app/v3/fetch_live_room_product_list', params: ['room_id', 'author_id'], price: 0.01 },
  fetchLiveRoomProductListV2: { path: '/app/v3/fetch_live_room_product_list_v2', params: ['room_id', 'author_id'], price: 0.01 },
  fetchMusicChartList: { path: '/app/v3/fetch_music_chart_list', price: 0.01 },
  fetchLiveRankingList: { path: '/app/v3/fetch_live_ranking_list', params: ['room_id', 'anchor_id'], price: 0.01 },
  fetchLiveDailyRank: { path: '/app/v3/fetch_live_daily_rank', price: 0.01 },
  fetchGeneralSearchResult: { path: '/app/v3/fetch_general_search_result', params: ['keyword'], price: 0.01 },
  fetchVideoSearchResult: { path: '/app/v3/fetch_video_search_result', params: ['keyword'], price: 0.01 },
  fetchUserSearchResult: { path: '/app/v3/fetch_user_search_result', params: ['keyword'], price: 0.01 },
  fetchMusicSearchResult: { path: '/app/v3/fetch_music_search_result', params: ['keyword'], price: 0.01 },
  fetchHashtagSearchResult: { path: '/app/v3/fetch_hashtag_search_result', params: ['keyword'], price: 0.01 },
  fetchLiveSearchResult: { path: '/app/v3/fetch_live_search_result', params: ['keyword'], price: 0.01 },
  fetchLocationSearch: { path: '/app/v3/fetch_location_search', params: ['keyword'], price: 0.01 },
  fetchCreatorSearchInsights: { path: '/app/v3/fetch_creator_search_insights', price: 0.01 },
  fetchCreatorSearchInsightsDetail: { path: '/app/v3/fetch_creator_search_insights_detail', params: ['query_id_str'], price: 0.01 },
  fetchCreatorSearchInsightsTrend: { path: '/app/v3/fetch_creator_search_insights_trend', params: ['query_id_str'], price: 0.01 },
  fetchCreatorSearchInsightsVideos: { path: '/app/v3/fetch_creator_search_insights_videos', params: ['keyword'], price: 0.01 },
  searchFollowerList: { path: '/app/v3/search_follower_list', params: ['user_id', 'keyword'], price: 0.01 },
  searchFollowingList: { path: '/app/v3/search_following_list', params: ['user_id', 'keyword'], price: 0.01 },
  fetchProductSearch: { path: '/app/v3/fetch_product_search', params: ['keyword'], price: 0.01 },
  openTiktokAppToKeywordSearch: { path: '/app/v3/open_tiktok_app_to_keyword_search', params: ['keyword'], price: 0.01 },
  fetchUserLikeVideos: { path: '/app/v3/fetch_user_like_videos', params: ['sec_user_id'], price: 0.01 },
  fetchVideoComments: { path: '/app/v3/fetch_video_comments', params: ['aweme_id'], price: 0.01 },
  fetchVideoCommentReplies: { path: '/app/v3/fetch_video_comment_replies', params: ['item_id', 'comment_id'], price: 0.01 },
  fetchUserFollowerList: { path: '/app/v3/fetch_user_follower_list', price: 0.01 },
  fetchUserFollowingList: { path: '/app/v3/fetch_user_following_list', price: 0.01 },
  openTiktokAppToVideoDetail: { path: '/app/v3/open_tiktok_app_to_video_detail', params: ['aweme_id'], price: 0.01 },
  openTiktokAppToUserProfile: { path: '/app/v3/open_tiktok_app_to_user_profile', params: ['uid'], price: 0.01 },
  openTiktokAppToSendPrivateMessage: { path: '/app/v3/open_tiktok_app_to_send_private_message', params: ['uid'], price: 0.01 },
  fetchCreatorInfo: { path: '/app/v3/fetch_creator_info', params: ['creator_uid'], price: 0.01 },
  fetchCreatorShowcaseProductList: { path: '/app/v3/fetch_creator_showcase_product_list', params: ['kol_id'], price: 0.01 },
  // ads
  getAdsDetail: { path: '/ads/get_ads_detail', params: ['ads_id'], price: 0.01 },
  getKeywordInsights: { path: '/ads/get_keyword_insights', price: 0.01 },
  getTopProducts: { path: '/ads/get_top_products', price: 0.01 },
  getHashtagList: { path: '/ads/get_hashtag_list', price: 0.01 },
  getKeywordList: { path: '/ads/get_keyword_list', price: 0.01 },
  getTopAdsSpotlight: { path: '/ads/get_top_ads_spotlight', price: 0.01 },
  getAdPercentile: { path: '/ads/get_ad_percentile', params: ['material_id'], price: 0.01 },
  getRecommendedAds: { path: '/ads/get_recommended_ads', params: ['material_id'], price: 0.01 },
  getKeywordFilters: { path: '/ads/get_keyword_filters', price: 0.01 },
  getRelatedKeywords: { path: '/ads/get_related_keywords', price: 0.01 },
  getKeywordDetails: { path: '/ads/get_keyword_details', price: 0.01 },
  getProductFilters: { path: '/ads/get_product_filters', price: 0.01 },
  getProductMetrics: { path: '/ads/get_product_metrics', params: ['id'], price: 0.01 },
  getProductDetail: { path: '/ads/get_product_detail', params: ['id'], price: 0.01 },
  getHashtagFilters: { path: '/ads/get_hashtag_filters', price: 0.01 },
  getSoundFilters: { path: '/ads/get_sound_filters', price: 0.01 },
  getSoundDetail: { path: '/ads/get_sound_detail', params: ['clip_id'], price: 0.01 },
  getSoundRecommendations: { path: '/ads/get_sound_recommendations', params: ['clip_id'], price: 0.01 },
  getSoundRankList: { path: '/ads/get_sound_rank_list', price: 0.01 },
  getAdKeyframeAnalysis: { path: '/ads/get_ad_keyframe_analysis', params: ['material_id'], price: 0.01 },
  getAdInteractiveAnalysis: { path: '/ads/get_ad_interactive_analysis', params: ['material_id'], price: 0.01 },
  getCreativePatterns: { path: '/ads/get_creative_patterns', price: 0.01 },
  getPopularTrends: { path: '/ads/get_popular_trends', price: 0.01 },
  searchAds: { path: '/ads/search_ads', price: 0.01 },
  getQuerySuggestions: { path: '/ads/get_query_suggestions', price: 0.01 },
  searchSoundHint: { path: '/ads/search_sound_hint', params: ['keyword'], price: 0.01 },
  searchSound: { path: '/ads/search_sound', params: ['keyword'], price: 0.01 },
  searchCreators: { path: '/ads/search_creators', params: ['keyword'], price: 0.01 },
  getHashtagCreator: { path: '/ads/get_hashtag_creator', params: ['hashtag'], price: 0.01 },
  getCreatorFilters: { path: '/ads/get_creator_filters', price: 0.01 },
  getCreatorList: { path: '/ads/get_creator_list', price: 0.01 },
  // shop/web
  fetchProductDetail: { path: '/shop/web/fetch_product_detail', params: ['product_id'], price: 0.01 },
  fetchProductDetailV2: { path: '/shop/web/fetch_product_detail_v2', params: ['product_id'], price: 0.01 },
  fetchProductDetailV3: { path: '/shop/web/fetch_product_detail_v3', params: ['product_id'], price: 0.01 },
  fetchSellerProductsList: { path: '/shop/web/fetch_seller_products_list', params: ['seller_id'], price: 0.01 },
  fetchSellerProductsListV2: { path: '/shop/web/fetch_seller_products_list_v2', params: ['seller_id'], price: 0.01 },
  fetchProductsCategoryList: { path: '/shop/web/fetch_products_category_list', price: 0.01 },
  fetchProductsByCategoryId: { path: '/shop/web/fetch_products_by_category_id', params: ['category_id'], price: 0.01 },
  fetchHotSellingProductsList: { path: '/shop/web/fetch_hot_selling_products_list', price: 0.01 },
  fetchSearchWordSuggestion: { path: '/shop/web/fetch_search_word_suggestion', params: ['search_word'], price: 0.01 },
  fetchSearchWordSuggestionV2: { path: '/shop/web/fetch_search_word_suggestion_v2', params: ['search_word'], price: 0.01 },
  fetchSearchProductsList: { path: '/shop/web/fetch_search_products_list', params: ['search_word'], price: 0.01 },
  fetchSearchProductsListV2: { path: '/shop/web/fetch_search_products_list_v2', params: ['search_word'], price: 0.01 },
  fetchSearchProductsListV3: { path: '/shop/web/fetch_search_products_list_v3', params: ['keyword'], price: 0.01 },
  fetchProductReviewsV1: { path: '/shop/web/fetch_product_reviews_v1', params: ['product_id'], price: 0.01 },
  fetchProductReviewsV2: { path: '/shop/web/fetch_product_reviews_v2', params: ['product_id'], price: 0.01 },
  // creator
  getLiveAnalyticsSummary: { path: '/creator/get_live_analytics_summary', method: 'POST', price: 0.01 },
  getVideoAnalyticsSummary: { path: '/creator/get_video_analytics_summary', method: 'POST', price: 0.01 },
  getVideoListAnalytics: { path: '/creator/get_video_list_analytics', method: 'POST', price: 0.01 },
  getProductAnalyticsList: { path: '/creator/get_product_analytics_list', method: 'POST', price: 0.01 },
  getVideoDetailedStats: { path: '/creator/get_video_detailed_stats', method: 'POST', price: 0.01 },
  getVideoToProductStats: { path: '/creator/get_video_to_product_stats', method: 'POST', price: 0.01 },
  getVideoAudienceStats: { path: '/creator/get_video_audience_stats', method: 'POST', price: 0.01 },
  getAccountHealthStatus: { path: '/creator/get_account_health_status', method: 'POST', price: 0.01 },
  getAccountViolationList: { path: '/creator/get_account_violation_list', method: 'POST', price: 0.01 },
  getAccountInsightsOverview: { path: '/creator/get_account_insights_overview', method: 'POST', price: 0.01 },
  getCreatorAccountInfo: { path: '/creator/get_creator_account_info', method: 'POST', price: 0.01 },
  getShowcaseProductList: { path: '/creator/get_showcase_product_list', method: 'POST', price: 0.01 },
  getVideoAssociatedProductList: { path: '/creator/get_video_associated_product_list', method: 'POST', price: 0.01 },
  getProductRelatedVideos: { path: '/creator/get_product_related_videos', method: 'POST', price: 0.01 },
  // analytics
  fetchVideoMetrics: { path: '/analytics/fetch_video_metrics', params: ['item_id'], price: 0.01 },
  detectFakeViews: { path: '/analytics/detect_fake_views', params: ['item_id'], price: 0.1 },
  fetchCommentKeywords: { path: '/analytics/fetch_comment_keywords', params: ['item_id'], price: 0.01 },
  fetchCreatorInfoAndMilestones: { path: '/analytics/fetch_creator_info_and_milestones', params: ['user_id'], price: 0.01 },
  // interaction
  apply: { path: '/interaction/apply', params: ['api_key', 'invite_code'], price: 0 },
  postComment: { path: '/interaction/post_comment', method: 'POST', price: 0.1 },
  replyComment: { path: '/interaction/reply_comment', method: 'POST', price: 0.1 },
  like: { path: '/interaction/like', method: 'POST', price: 0.1 },
  follow: { path: '/interaction/follow', method: 'POST', price: 0.1 },
  collect: { path: '/interaction/collect', method: 'POST', price: 0.1 },
  forward: { path: '/interaction/forward', method: 'POST', price: 0.1 },
};

/**
 * 初始化优化层
 * 集成缓存、去重、监控、决策、价格查询
 */
const optimization = createOptimizationLayer({
  registry: API_REGISTRY,
  apiPrefix: config.apiBase.prefix,
  cache: { maxSize: 100, defaultTTL: 3 * 60 * 1000 },
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
