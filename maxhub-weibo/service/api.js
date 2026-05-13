// 第三方接口请求封装 - weibo
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
 * 价格规则：大部分API为 ¥0.01，fetchHotSearchSummary 为 ¥0.015
 */
const API_REGISTRY = {
  // web
  fetchConfigList: { path: '/web/fetch_config_list', price: 0.01 },
  fetchChannelFeed: { path: '/web/fetch_channel_feed', price: 0.01 },
  fetchTrendTop: { path: '/web/fetch_trend_top', params: ['containerid'], price: 0.01 },
  fetchCommentReplies: { path: '/web/fetch_comment_replies', params: ['cid'], price: 0.01 },
  fetchSearch: { path: '/web/fetch_search', params: ['keyword'], price: 0.01 },
  fetchSearchTopics: { path: '/web/fetch_search_topics', price: 0.01 },
  // web_v2
  fetchPostDetail: { path: '/web_v2/fetch_post_detail', params: ['id'], price: 0.01 },
  fetchUserBasicInfo: { path: '/web_v2/fetch_user_basic_info', params: ['uid'], price: 0.01 },
  fetchUserPosts: { path: '/web_v2/fetch_user_posts', params: ['uid'], price: 0.01 },
  fetchUserOriginalPosts: { path: '/web_v2/fetch_user_original_posts', params: ['uid'], price: 0.01 },
  fetchUserVideoCollectionList: { path: '/web_v2/fetch_user_video_collection_list', params: ['uid'], price: 0.01 },
  fetchUserVideoCollectionDetail: { path: '/web_v2/fetch_user_video_collection_detail', params: ['cid'], price: 0.01 },
  fetchUserVideoList: { path: '/web_v2/fetch_user_video_list', params: ['uid'], price: 0.01 },
  fetchUserFans: { path: '/web_v2/fetch_user_fans', params: ['uid'], price: 0.01 },
  fetchAllGroups: { path: '/web_v2/fetch_all_groups', price: 0.01 },
  fetchUserRecommendTimeline: { path: '/web_v2/fetch_user_recommend_timeline', price: 0.01 },
  fetchCityList: { path: '/web_v2/fetch_city_list', price: 0.01 },
  fetchHotRankingTimeline: { path: '/web_v2/fetch_hot_ranking_timeline', params: ['ranking_type'], price: 0.01 },
  fetchEntertainmentRanking: { path: '/web_v2/fetch_entertainment_ranking', price: 0.01 },
  fetchLifeRanking: { path: '/web_v2/fetch_life_ranking', price: 0.01 },
  fetchSocialRanking: { path: '/web_v2/fetch_social_ranking', price: 0.01 },
  checkAllowCommentWithPic: { path: '/web_v2/check_allow_comment_with_pic', params: ['id'], price: 0.01 },
  fetchPostComments: { path: '/web_v2/fetch_post_comments', params: ['id'], price: 0.01 },
  fetchPostSubComments: { path: '/web_v2/fetch_post_sub_comments', params: ['id'], price: 0.01 },
  fetchUserFollowing: { path: '/web_v2/fetch_user_following', params: ['uid'], price: 0.01 },
  searchUserPosts: { path: '/web_v2/search_user_posts', params: ['uid'], price: 0.01 },
  fetchHotSearchIndex: { path: '/web_v2/fetch_hot_search_index', price: 0.01 },
  fetchHotSearchSummary: { path: '/web_v2/fetch_hot_search_summary', price: 0.015 },
  fetchSimilarSearch: { path: '/web_v2/fetch_similar_search', params: ['keyword'], price: 0.01 },
  fetchAiSearch: { path: '/web_v2/fetch_ai_search', params: ['query'], price: 0.01 },
  fetchAiRelatedSearch: { path: '/web_v2/fetch_ai_related_search', params: ['keyword'], price: 0.01 },
  fetchAdvancedSearch: { path: '/web_v2/fetch_advanced_search', params: ['q'], price: 0.01 },
  fetchRealtimeSearch: { path: '/web_v2/fetch_realtime_search', params: ['query'], price: 0.01 },
  fetchUserSearch: { path: '/web_v2/fetch_user_search', price: 0.01 },
  fetchVideoSearch: { path: '/web_v2/fetch_video_search', params: ['query'], price: 0.01 },
  fetchPicSearch: { path: '/web_v2/fetch_pic_search', params: ['query'], price: 0.01 },
  fetchTopicSearch: { path: '/web_v2/fetch_topic_search', params: ['query'], price: 0.01 },
  // app
  fetchUserInfo: { path: '/app/fetch_user_info', params: ['uid'], price: 0.01 },
  fetchUserInfoDetail: { path: '/app/fetch_user_info_detail', params: ['uid'], price: 0.01 },
  fetchUserTimeline: { path: '/app/fetch_user_timeline', params: ['uid'], price: 0.01 },
  fetchUserVideos: { path: '/app/fetch_user_videos', params: ['uid'], price: 0.01 },
  fetchUserSuperTopics: { path: '/app/fetch_user_super_topics', params: ['uid'], price: 0.01 },
  fetchUserAlbum: { path: '/app/fetch_user_album', params: ['uid'], price: 0.01 },
  fetchUserArticles: { path: '/app/fetch_user_articles', params: ['uid'], price: 0.01 },
  fetchUserAudios: { path: '/app/fetch_user_audios', params: ['uid'], price: 0.01 },
  fetchUserProfileFeed: { path: '/app/fetch_user_profile_feed', params: ['uid'], price: 0.01 },
  fetchStatusDetail: { path: '/app/fetch_status_detail', params: ['status_id'], price: 0.01 },
  fetchStatusReposts: { path: '/app/fetch_status_reposts', params: ['status_id'], price: 0.01 },
  fetchVideoDetail: { path: '/app/fetch_video_detail', params: ['mid'], price: 0.01 },
  fetchVideoFeaturedFeed: { path: '/app/fetch_video_featured_feed', price: 0.01 },
  fetchHomeRecommendFeed: { path: '/app/fetch_home_recommend_feed', price: 0.01 },
  fetchStatusComments: { path: '/app/fetch_status_comments', params: ['status_id'], price: 0.01 },
  fetchStatusLikes: { path: '/app/fetch_status_likes', params: ['status_id'], price: 0.01 },
  fetchSearchAll: { path: '/app/fetch_search_all', params: ['query'], price: 0.01 },
  fetchAiSmartSearch: { path: '/app/fetch_ai_smart_search', params: ['query'], price: 0.01 },
  fetchHotSearch: { path: '/app/fetch_hot_search', price: 0.01 },
  fetchHotSearchCategories: { path: '/app/fetch_hot_search_categories', price: 0.01 },
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
  fetchConfigList: api.fetchConfigList,
  fetchChannelFeed: api.fetchChannelFeed,
  fetchPostDetail: api.fetchPostDetail,
  fetchUserBasicInfo: api.fetchUserBasicInfo,
  fetchUserPosts: api.fetchUserPosts,
  fetchUserOriginalPosts: api.fetchUserOriginalPosts,
  fetchUserVideoCollectionList: api.fetchUserVideoCollectionList,
  fetchUserVideoCollectionDetail: api.fetchUserVideoCollectionDetail,
  fetchUserVideoList: api.fetchUserVideoList,
  fetchUserFans: api.fetchUserFans,
  fetchAllGroups: api.fetchAllGroups,
  fetchUserRecommendTimeline: api.fetchUserRecommendTimeline,
  fetchCityList: api.fetchCityList,
  fetchUserInfo: api.fetchUserInfo,
  fetchUserInfoDetail: api.fetchUserInfoDetail,
  fetchUserTimeline: api.fetchUserTimeline,
  fetchUserVideos: api.fetchUserVideos,
  fetchUserSuperTopics: api.fetchUserSuperTopics,
  fetchUserAlbum: api.fetchUserAlbum,
  fetchUserArticles: api.fetchUserArticles,
  fetchUserAudios: api.fetchUserAudios,
  fetchUserProfileFeed: api.fetchUserProfileFeed,
  fetchStatusDetail: api.fetchStatusDetail,
  fetchStatusReposts: api.fetchStatusReposts,
  fetchVideoDetail: api.fetchVideoDetail,
  fetchVideoFeaturedFeed: api.fetchVideoFeaturedFeed,
  fetchHomeRecommendFeed: api.fetchHomeRecommendFeed,
  fetchTrendTop: api.fetchTrendTop,
  fetchHotRankingTimeline: api.fetchHotRankingTimeline,
  fetchEntertainmentRanking: api.fetchEntertainmentRanking,
  fetchLifeRanking: api.fetchLifeRanking,
  fetchSocialRanking: api.fetchSocialRanking,
  fetchCommentReplies: api.fetchCommentReplies,
  checkAllowCommentWithPic: api.checkAllowCommentWithPic,
  fetchPostComments: api.fetchPostComments,
  fetchPostSubComments: api.fetchPostSubComments,
  fetchUserFollowing: api.fetchUserFollowing,
  fetchStatusComments: api.fetchStatusComments,
  fetchStatusLikes: api.fetchStatusLikes,
  fetchSearch: api.fetchSearch,
  fetchSearchTopics: api.fetchSearchTopics,
  searchUserPosts: api.searchUserPosts,
  fetchHotSearchIndex: api.fetchHotSearchIndex,
  fetchHotSearchSummary: api.fetchHotSearchSummary,
  fetchSimilarSearch: api.fetchSimilarSearch,
  fetchAiSearch: api.fetchAiSearch,
  fetchAiRelatedSearch: api.fetchAiRelatedSearch,
  fetchAdvancedSearch: api.fetchAdvancedSearch,
  fetchRealtimeSearch: api.fetchRealtimeSearch,
  fetchUserSearch: api.fetchUserSearch,
  fetchVideoSearch: api.fetchVideoSearch,
  fetchPicSearch: api.fetchPicSearch,
  fetchTopicSearch: api.fetchTopicSearch,
  fetchSearchAll: api.fetchSearchAll,
  fetchAiSmartSearch: api.fetchAiSmartSearch,
  fetchHotSearch: api.fetchHotSearch,
  fetchHotSearchCategories: api.fetchHotSearchCategories,
};
