// 第三方接口请求封装 - xiaohongshu
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
 * 价格来源：pricing.md
 */
const API_REGISTRY = {
  // web_v3
  fetchNoteDetail: { path: '/web_v3/fetch_note_detail', params: ['note_id', 'xsec_token'], price: 0.10 },
  fetchHomefeed: { path: '/web_v3/fetch_homefeed', price: 0.10 },
  fetchHomefeedCategories: { path: '/web_v3/fetch_homefeed_categories', price: 0.10 },
  fetchUserNotes: { path: '/web_v3/fetch_user_notes', params: ['user_id'], price: 0.10 },
  fetchTrending: { path: '/web_v3/fetch_trending', price: 0.10 },
  fetchSearchSuggest: { path: '/web_v3/fetch_search_suggest', price: 0.10 },
  // app_v2
  getImageNoteDetail: { path: '/app_v2/get_image_note_detail', price: 0.10 },
  getVideoNoteDetail: { path: '/app_v2/get_video_note_detail', price: 0.10 },
  getUserPostedNotes: { path: '/app_v2/get_user_posted_notes', price: 0.10 },
  getProductRecommendations: { path: '/app_v2/get_product_recommendations', params: ['sku_id'], price: 0.10 },
  getTopicInfo: { path: '/app_v2/get_topic_info', params: ['page_id'], price: 0.10 },
  getTopicFeed: { path: '/app_v2/get_topic_feed', params: ['page_id'], price: 0.10 },
  getNoteSubComments: { path: '/app_v2/get_note_sub_comments', params: ['comment_id'], price: 0.10 },
  getUserFavedNotes: { path: '/app_v2/get_user_faved_notes', price: 0.10 },
  getProductReviewOverview: { path: '/app_v2/get_product_review_overview', params: ['sku_id'], price: 0.10 },
  getProductReviews: { path: '/app_v2/get_product_reviews', params: ['sku_id'], price: 0.10 },
  searchImages: { path: '/app_v2/search_images', params: ['keyword'], price: 0.10 },
  searchGroups: { path: '/app_v2/search_groups', params: ['keyword'], price: 0.10 },
  getCreatorInspirationFeed: { path: '/app_v2/get_creator_inspiration_feed', price: 0.10 },
  getCreatorHotInspirationFeed: { path: '/app_v2/get_creator_hot_inspiration_feed', price: 0.10 },
  // app
  getNoteInfo: { path: '/app/get_note_info', price: 0.10 },
  getNotesByTopic: { path: '/app/get_notes_by_topic', params: ['page_id', 'first_load_time'], price: 0.10 },
  getUserNotes: { path: '/app/get_user_notes', params: ['user_id'], price: 0.10 },
  getProductDetail: { path: '/app/get_product_detail', params: ['sku_id'], price: 0.10 },
  getSubComments: { path: '/app/get_sub_comments', params: ['note_id', 'comment_id'], price: 0.10 },
  searchProducts: { path: '/app/search_products', params: ['keyword', 'page'], price: 0.10 },
  extractShareInfo: { path: '/app/extract_share_info', params: ['share_link'], price: 0.10 },
  getUserIdAndXsecToken: { path: '/app/get_user_id_and_xsec_token', params: ['share_link'], price: 0.01 },
  // web_v2
  fetchFeedNotes: { path: '/web_v2/fetch_feed_notes', params: ['note_id'], price: 0.10 },
  fetchFeedNotesV2: { path: '/web_v2/fetch_feed_notes_v2', params: ['note_id'], price: 0.10 },
  fetchFeedNotesV3: { path: '/web_v2/fetch_feed_notes_v3', params: ['short_url'], price: 0.10 },
  fetchNoteImage: { path: '/web_v2/fetch_note_image', params: ['note_id'], price: 0.10 },
  fetchHomeNotes: { path: '/web_v2/fetch_home_notes', params: ['user_id'], price: 0.10 },
  fetchHomeNotesApp: { path: '/web_v2/fetch_home_notes_app', params: ['user_id'], price: 0.10 },
  fetchUserInfo: { path: '/web_v2/fetch_user_info', params: ['user_id'], price: 0.10 },
  fetchUserInfoApp: { path: '/web_v2/fetch_user_info_app', params: ['user_id'], price: 0.10 },
  fetchProductList: { path: '/web_v2/fetch_product_list', params: ['user_id'], price: 0.10 },
  fetchHotList: { path: '/web_v2/fetch_hot_list', price: 0.10 },
  fetchFeedNotesV4: { path: '/web_v2/fetch_feed_notes_v4', params: ['note_id'], price: 0.10 },
  fetchFeedNotesV5: { path: '/web_v2/fetch_feed_notes_v5', params: ['note_id'], price: 0.10 },
  fetchNoteComments: { path: '/web_v2/fetch_note_comments', params: ['note_id'], price: 0.10 },
  fetchSubComments: { path: '/web_v2/fetch_sub_comments', params: ['note_id', 'comment_id'], price: 0.10 },
  fetchFollowerList: { path: '/web_v2/fetch_follower_list', params: ['user_id'], price: 0.10 },
  fetchFollowingList: { path: '/web_v2/fetch_following_list', params: ['user_id'], price: 0.10 },
  fetchSearchNotes: { path: '/web_v2/fetch_search_notes', params: ['keywords'], price: 0.10 },
  fetchSearchUsers: { path: '/web_v2/fetch_search_users', params: ['keywords'], price: 0.10 },
  // web
  getHomeRecommend: { path: '/web/get_home_recommend', method: 'POST', price: 0.10 },
  getNoteInfoV2: { path: '/web/get_note_info_v2', price: 0.10 },
  getNoteInfoV4: { path: '/web/get_note_info_v4', price: 0.10 },
  getNoteInfoV5: { path: '/web/get_note_info_v5', price: 0.01 },
  getNoteInfoV7: { path: '/web/get_note_info_v7', price: 0.10 },
  getUserInfo: { path: '/web/get_user_info', params: ['user_id'], price: 0.10 },
  getUserInfoV2: { path: '/web/get_user_info_v2', price: 0.10 },
  getUserNotesV2: { path: '/web/get_user_notes_v2', params: ['user_id'], price: 0.10 },
  getNoteIdAndXsecToken: { path: '/web/get_note_id_and_xsec_token', params: ['share_text'], price: 0.01 },
  getProductInfo: { path: '/web/get_product_info', price: 0.10 },
  getNoteComments: { path: '/web/get_note_comments', params: ['note_id'], price: 0.10 },
  getNoteCommentsV3: { path: '/web/get_note_comments_v3', params: ['note_id'], price: 0.11 },
  getNoteCommentReplies: { path: '/web/get_note_comment_replies', params: ['note_id', 'comment_id'], price: 0.10 },
  searchNotes: { path: '/web/search_notes', params: ['keyword'], price: 0.10 },
  searchNotesV3: { path: '/web/search_notes_v3', params: ['keyword'], price: 0.11 },
  searchUsers: { path: '/web/search_users', params: ['keyword'], price: 0.10 },
  // sign接口
  sign: { path: '/sign', price: 0.01 },
  // test接口
  test: { path: '/test', price: 0 },
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
  fetchNoteDetail: api.fetchNoteDetail,
  fetchHomefeed: api.fetchHomefeed,
  fetchHomefeedCategories: api.fetchHomefeedCategories,
  fetchUserNotes: api.fetchUserNotes,
  getImageNoteDetail: api.getImageNoteDetail,
  getVideoNoteDetail: api.getVideoNoteDetail,
  getUserPostedNotes: api.getUserPostedNotes,
  getProductRecommendations: api.getProductRecommendations,
  getTopicInfo: api.getTopicInfo,
  getTopicFeed: api.getTopicFeed,
  getNoteInfo: api.getNoteInfo,
  getNotesByTopic: api.getNotesByTopic,
  getUserNotes: api.getUserNotes,
  getProductDetail: api.getProductDetail,
  fetchFeedNotes: api.fetchFeedNotes,
  fetchFeedNotesV2: api.fetchFeedNotesV2,
  fetchFeedNotesV3: api.fetchFeedNotesV3,
  fetchNoteImage: api.fetchNoteImage,
  fetchHomeNotes: api.fetchHomeNotes,
  fetchHomeNotesApp: api.fetchHomeNotesApp,
  fetchUserInfo: api.fetchUserInfo,
  fetchUserInfoApp: api.fetchUserInfoApp,
  fetchProductList: api.fetchProductList,
  fetchHotList: api.fetchHotList,
  getHomeRecommend: api.getHomeRecommend,
  getNoteInfoV2: api.getNoteInfoV2,
  getNoteInfoV4: api.getNoteInfoV4,
  getNoteInfoV5: api.getNoteInfoV5,
  getNoteInfoV7: api.getNoteInfoV7,
  getUserInfo: api.getUserInfo,
  getUserInfoV2: api.getUserInfoV2,
  getUserNotesV2: api.getUserNotesV2,
  getNoteIdAndXsecToken: api.getNoteIdAndXsecToken,
  getProductInfo: api.getProductInfo,
  fetchTrending: api.fetchTrending,
  getNoteSubComments: api.getNoteSubComments,
  getUserFavedNotes: api.getUserFavedNotes,
  getProductReviewOverview: api.getProductReviewOverview,
  getProductReviews: api.getProductReviews,
  getSubComments: api.getSubComments,
  fetchFeedNotesV4: api.fetchFeedNotesV4,
  fetchFeedNotesV5: api.fetchFeedNotesV5,
  fetchNoteComments: api.fetchNoteComments,
  fetchSubComments: api.fetchSubComments,
  fetchFollowerList: api.fetchFollowerList,
  fetchFollowingList: api.fetchFollowingList,
  getNoteComments: api.getNoteComments,
  getNoteCommentReplies: api.getNoteCommentReplies,
  fetchSearchSuggest: api.fetchSearchSuggest,
  searchImages: api.searchImages,
  searchGroups: api.searchGroups,
  searchProducts: api.searchProducts,
  fetchSearchNotes: api.fetchSearchNotes,
  fetchSearchUsers: api.fetchSearchUsers,
  searchNotes: api.searchNotes,
  searchNotesV3: api.searchNotesV3,
  searchUsers: api.searchUsers,
  getCreatorInspirationFeed: api.getCreatorInspirationFeed,
  getCreatorHotInspirationFeed: api.getCreatorHotInspirationFeed,
  extractShareInfo: api.extractShareInfo,
  getUserIdAndXsecToken: api.getUserIdAndXsecToken,
  sign: api.sign,
  test: api.test,
};
