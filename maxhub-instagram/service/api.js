// 第三方接口请求封装 - instagram
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
 * 价格规则：v1端 0.01，v2端 0.02，v3端 0.01
 */
const API_REGISTRY = {
  // v1 - price: 0.01
  fetchUserInfoByUsername: { path: '/v1/fetch_user_info_by_username', params: ['username'], price: 0.01 },
  fetchUserInfoByUsernameV2: { path: '/v1/fetch_user_info_by_username_v2', params: ['username'], price: 0.01 },
  fetchUserInfoByUsernameV3: { path: '/v1/fetch_user_info_by_username_v3', params: ['username'], price: 0.01 },
  fetchUserInfoById: { path: '/v1/fetch_user_info_by_id', params: ['user_id'], price: 0.01 },
  fetchUserInfoByIdV2: { path: '/v1/fetch_user_info_by_id_v2', params: ['user_id'], price: 0.01 },
  fetchUserAboutInfo: { path: '/v1/fetch_user_about_info', params: ['user_id'], price: 0.01 },
  fetchUserPostsV2: { path: '/v1/fetch_user_posts_v2', params: ['user_id'], price: 0.01 },
  fetchUserReposts: { path: '/v1/fetch_user_reposts', params: ['user_id'], price: 0.01 },
  fetchRelatedProfiles: { path: '/v1/fetch_related_profiles', params: ['user_id'], price: 0.01 },
  fetchPostByUrl: { path: '/v1/fetch_post_by_url', params: ['post_url'], price: 0.01 },
  fetchPostByUrlV2: { path: '/v1/fetch_post_by_url_v2', params: ['post_url'], price: 0.01 },
  fetchPostById: { path: '/v1/fetch_post_by_id', params: ['post_id'], price: 0.01 },
  fetchLocationInfo: { path: '/v1/fetch_location_info', params: ['location_id'], price: 0.01 },
  fetchCities: { path: '/v1/fetch_cities', params: ['country_code'], price: 0.01 },
  fetchLocations: { path: '/v1/fetch_locations', params: ['city_id'], price: 0.01 },
  fetchExploreSections: { path: '/v1/fetch_explore_sections', price: 0.01 },
  fetchSectionPosts: { path: '/v1/fetch_section_posts', params: ['section_id'], price: 0.01 },
  fetchSearch: { path: '/v1/fetch_search', params: ['query'], price: 0.01 },
  fetchPostCommentsV2: { path: '/v1/fetch_post_comments_v2', params: ['media_id'], price: 0.01 },
  // v2 - price: 0.02
  userIdToUsername: { path: '/v2/user_id_to_username', params: ['user_id'], price: 0.02 },
  fetchUserInfo: { path: '/v2/fetch_user_info', price: 0.02 },
  fetchUserPosts: { path: '/v2/fetch_user_posts', price: 0.02 },
  fetchUserReels: { path: '/v2/fetch_user_reels', price: 0.02 },
  fetchUserStories: { path: '/v2/fetch_user_stories', price: 0.02 },
  fetchUserHighlights: { path: '/v2/fetch_user_highlights', price: 0.02 },
  fetchHighlightStories: { path: '/v2/fetch_highlight_stories', params: ['highlight_id'], price: 0.02 },
  fetchUserTaggedPosts: { path: '/v2/fetch_user_tagged_posts', price: 0.02 },
  fetchSimilarUsers: { path: '/v2/fetch_similar_users', price: 0.02 },
  fetchPostInfo: { path: '/v2/fetch_post_info', params: ['code_or_url'], price: 0.02 },
  fetchMusicPosts: { path: '/v2/fetch_music_posts', params: ['audio_canonical_id'], price: 0.02 },
  fetchLocationPosts: { path: '/v2/fetch_location_posts', params: ['location_id'], price: 0.02 },
  fetchHashtagPosts: { path: '/v2/fetch_hashtag_posts', params: ['keyword'], price: 0.02 },
  searchReels: { path: '/v2/search_reels', params: ['keyword'], price: 0.02 },
  searchMusic: { path: '/v2/search_music', params: ['keyword'], price: 0.02 },
  searchLocations: { path: '/v2/search_locations', params: ['keyword'], price: 0.02 },
  searchByCoordinates: { path: '/v2/search_by_coordinates', params: ['latitude', 'longitude'], price: 0.02 },
  fetchUserFollowers: { path: '/v2/fetch_user_followers', price: 0.02 },
  fetchUserFollowing: { path: '/v2/fetch_user_following', price: 0.02 },
  fetchPostLikes: { path: '/v2/fetch_post_likes', params: ['code_or_url'], price: 0.02 },
  fetchPostComments: { path: '/v2/fetch_post_comments', params: ['code_or_url'], price: 0.02 },
  fetchCommentReplies: { path: '/v2/fetch_comment_replies', params: ['code_or_url', 'comment_id'], price: 0.02 },
  // v3 - price: 0.01
  getUserIdByUsername: { path: '/v3/get_user_id_by_username', params: ['username'], price: 0.01 },
  getUserProfile: { path: '/v3/get_user_profile', price: 0.02 },
  getUserBrief: { path: '/v3/get_user_brief', params: ['user_id', 'username'], price: 0.01 },
  getUserPosts: { path: '/v3/get_user_posts', params: ['username'], price: 0.02 },
  getUserTaggedPosts: { path: '/v3/get_user_tagged_posts', price: 0.02 },
  getUserReels: { path: '/v3/get_user_reels', price: 0.02 },
  getUserHighlights: { path: '/v3/get_user_highlights', price: 0.02 },
  getHighlightStories: { path: '/v3/get_highlight_stories', params: ['highlight_id'], price: 0.02 },
  getUserAbout: { path: '/v3/get_user_about', price: 0.02 },
  getUserFormerUsernames: { path: '/v3/get_user_former_usernames', price: 0.02 },
  getUserStories: { path: '/v3/get_user_stories', price: 0.02 },
  getRecommendedReels: { path: '/v3/get_recommended_reels', price: 0.02 },
  getPostInfo: { path: '/v3/get_post_info', params: ['media_id'], price: 0.02 },
  getPostInfoByCode: { path: '/v3/get_post_info_by_code', params: ['code'], price: 0.02 },
  getPostOembed: { path: '/v3/get_post_oembed', params: ['url'], price: 0.01 },
  getExplore: { path: '/v3/get_explore', price: 0.02 },
  getLocationInfo: { path: '/v3/get_location_info', params: ['location_id'], price: 0.02 },
  getLocationPosts: { path: '/v3/get_location_posts', params: ['location_id'], price: 0.02 },
  getLocationNearby: { path: '/v3/get_location_nearby', params: ['location_id'], price: 0.02 },
  shortcodeToMediaId: { path: '/v3/shortcode_to_media_id', params: ['shortcode'], price: 0.01 },
  mediaIdToShortcode: { path: '/v3/media_id_to_shortcode', params: ['media_id'], price: 0.01 },
  searchUsers: { path: '/v3/search_users', params: ['query'], price: 0.02 },
  searchHashtags: { path: '/v3/search_hashtags', params: ['query'], price: 0.02 },
  searchPlaces: { path: '/v3/search_places', params: ['query'], price: 0.02 },
  generalSearch: { path: '/v3/general_search', params: ['query'], price: 0.02 },
  getPostComments: { path: '/v3/get_post_comments', params: ['code'], price: 0.02 },
  getCommentReplies: { path: '/v3/get_comment_replies', params: ['media_id', 'comment_id'], price: 0.02 },
  translateComment: { path: '/v3/translate_comment', params: ['comment_id'], price: 0.02 },
  bulkTranslateComments: { path: '/v3/bulk_translate_comments', params: ['comment_ids'], price: 0.035 },
  getUserFollowing: { path: '/v3/get_user_following', price: 0.02 },
  getUserFollowers: { path: '/v3/get_user_followers', price: 0.02 },
  extractShortcode: { path: '/v3/extract_shortcode', params: ['url'], price: 0.01 },
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
  fetchUserInfoByUsername: api.fetchUserInfoByUsername,
  fetchUserInfoByUsernameV2: api.fetchUserInfoByUsernameV2,
  fetchUserInfoByUsernameV3: api.fetchUserInfoByUsernameV3,
  fetchUserInfoById: api.fetchUserInfoById,
  fetchUserInfoByIdV2: api.fetchUserInfoByIdV2,
  fetchUserAboutInfo: api.fetchUserAboutInfo,
  fetchUserPostsV2: api.fetchUserPostsV2,
  fetchUserReposts: api.fetchUserReposts,
  fetchRelatedProfiles: api.fetchRelatedProfiles,
  fetchPostByUrl: api.fetchPostByUrl,
  fetchPostByUrlV2: api.fetchPostByUrlV2,
  fetchPostById: api.fetchPostById,
  fetchLocationInfo: api.fetchLocationInfo,
  fetchCities: api.fetchCities,
  fetchLocations: api.fetchLocations,
  fetchExploreSections: api.fetchExploreSections,
  fetchSectionPosts: api.fetchSectionPosts,
  userIdToUsername: api.userIdToUsername,
  fetchUserInfo: api.fetchUserInfo,
  fetchUserPosts: api.fetchUserPosts,
  fetchUserReels: api.fetchUserReels,
  fetchUserStories: api.fetchUserStories,
  fetchUserHighlights: api.fetchUserHighlights,
  fetchHighlightStories: api.fetchHighlightStories,
  fetchUserTaggedPosts: api.fetchUserTaggedPosts,
  fetchSimilarUsers: api.fetchSimilarUsers,
  fetchPostInfo: api.fetchPostInfo,
  fetchMusicPosts: api.fetchMusicPosts,
  fetchLocationPosts: api.fetchLocationPosts,
  fetchHashtagPosts: api.fetchHashtagPosts,
  getUserIdByUsername: api.getUserIdByUsername,
  getUserProfile: api.getUserProfile,
  getUserBrief: api.getUserBrief,
  getUserPosts: api.getUserPosts,
  getUserTaggedPosts: api.getUserTaggedPosts,
  getUserReels: api.getUserReels,
  getUserHighlights: api.getUserHighlights,
  getHighlightStories: api.getHighlightStories,
  getUserAbout: api.getUserAbout,
  getUserFormerUsernames: api.getUserFormerUsernames,
  getUserStories: api.getUserStories,
  getRecommendedReels: api.getRecommendedReels,
  getPostInfo: api.getPostInfo,
  getPostInfoByCode: api.getPostInfoByCode,
  getPostOembed: api.getPostOembed,
  getExplore: api.getExplore,
  getLocationInfo: api.getLocationInfo,
  getLocationPosts: api.getLocationPosts,
  getLocationNearby: api.getLocationNearby,
  shortcodeToMediaId: api.shortcodeToMediaId,
  mediaIdToShortcode: api.mediaIdToShortcode,
  fetchSearch: api.fetchSearch,
  searchReels: api.searchReels,
  searchMusic: api.searchMusic,
  searchLocations: api.searchLocations,
  searchByCoordinates: api.searchByCoordinates,
  searchUsers: api.searchUsers,
  searchHashtags: api.searchHashtags,
  searchPlaces: api.searchPlaces,
  generalSearch: api.generalSearch,
  fetchPostCommentsV2: api.fetchPostCommentsV2,
  fetchUserFollowers: api.fetchUserFollowers,
  fetchUserFollowing: api.fetchUserFollowing,
  fetchPostLikes: api.fetchPostLikes,
  fetchPostComments: api.fetchPostComments,
  fetchCommentReplies: api.fetchCommentReplies,
  getPostComments: api.getPostComments,
  getCommentReplies: api.getCommentReplies,
  translateComment: api.translateComment,
  bulkTranslateComments: api.bulkTranslateComments,
  getUserFollowing: api.getUserFollowing,
  getUserFollowers: api.getUserFollowers,
  extractShortcode: api.extractShortcode,
};
