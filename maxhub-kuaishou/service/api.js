// 第三方接口请求封装 - kuaishou
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
  // web
  fetchOneVideoV2: { path: '/web/fetch_one_video_v2', params: ['photo_id'], price: 0.02 },
  fetchUserInfo: { path: '/web/fetch_user_info', params: ['user_id'], price: 0.02 },
  fetchUserPost: { path: '/web/fetch_user_post', params: ['user_id'], price: 0.1 },
  fetchUserLiveReplay: { path: '/web/fetch_user_live_replay', params: ['user_id'], price: 0.1 },
  fetchUserCollect: { path: '/web/fetch_user_collect', params: ['user_id'], price: 0.1 },
  fetchKuaishouHotListV1: { path: '/web/fetch_kuaishou_hot_list_v1', price: 0.01 },
  fetchKuaishouHotListV2: { path: '/web/fetch_kuaishou_hot_list_v2', price: 0.01 },
  fetchGetUserId: { path: '/web/fetch_get_user_id', params: ['share_link'], price: 0.01 },
  fetchOneVideoSubComment: { path: '/web/fetch_one_video_sub_comment', params: ['photo_id', 'root_comment_id'], price: 0.1 },
  generateShareShortUrl: { path: '/web/generate_share_short_url', params: ['photo_id'], price: 0.01 },
  // app
  fetchOneVideo: { path: '/app/fetch_one_video', params: ['photo_id'], price: 0.01 },
  fetchOneVideoByUrl: { path: '/app/fetch_one_video_by_url', params: ['share_text'], price: 0.01 },
  fetchOneUserV2: { path: '/app/fetch_one_user_v2', params: ['user_id'], price: 0.1 },
  fetchUserLiveInfo: { path: '/app/fetch_user_live_info', params: ['user_id'], price: 0.01 },
  fetchUserHotPost: { path: '/app/fetch_user_hot_post', params: ['user_id'], price: 0.01 },
  fetchUserPostV2: { path: '/app/fetch_user_post_v2', params: ['user_id'], price: 0.1 },
  fetchHotBoardCategories: { path: '/app/fetch_hot_board_categories', price: 0.01 },
  fetchHotBoardDetail: { path: '/app/fetch_hot_board_detail', price: 0.01 },
  fetchLiveTopList: { path: '/app/fetch_live_top_list', price: 0.01 },
  fetchShoppingTopList: { path: '/app/fetch_shopping_top_list', price: 0.01 },
  fetchBrandTopList: { path: '/app/fetch_brand_top_list', price: 0.01 },
  fetchMagicFaceUsage: { path: '/app/fetch_magic_face_usage', params: ['magic_face_id'], price: 0.025 },
  fetchMagicFaceHot: { path: '/app/fetch_magic_face_hot', params: ['magic_face_id'], price: 0.05 },
  fetchOneVideoComment: { path: '/app/fetch_one_video_comment', params: ['photo_id'], price: 0.01 },
  generateKuaishouShareLink: { path: '/app/generate_kuaishou_share_link', params: ['shareObjectId'], price: 0.01 },
  fetchVideosBatch: { path: '/app/fetch_videos_batch', params: ['photo_ids'], price: 0.4 },
  searchComprehensive: { path: '/app/search_comprehensive', params: ['keyword'], price: 0.1 },
  searchVideoV2: { path: '/app/search_video_v2', params: ['keyword'], price: 0.1 },
  searchUserV2: { path: '/app/search_user_v2', params: ['keyword'], price: 0.1 },
  fetchHotSearchPerson: { path: '/app/fetch_hot_search_person', price: 0.01 },
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
  fetchOneVideoV2: api.fetchOneVideoV2,
  fetchUserInfo: api.fetchUserInfo,
  fetchUserPost: api.fetchUserPost,
  fetchUserLiveReplay: api.fetchUserLiveReplay,
  fetchUserCollect: api.fetchUserCollect,
  fetchKuaishouHotListV1: api.fetchKuaishouHotListV1,
  fetchKuaishouHotListV2: api.fetchKuaishouHotListV2,
  fetchGetUserId: api.fetchGetUserId,
  fetchOneVideo: api.fetchOneVideo,
  fetchOneVideoByUrl: api.fetchOneVideoByUrl,
  fetchOneUserV2: api.fetchOneUserV2,
  fetchUserLiveInfo: api.fetchUserLiveInfo,
  fetchUserHotPost: api.fetchUserHotPost,
  fetchUserPostV2: api.fetchUserPostV2,
  fetchHotBoardCategories: api.fetchHotBoardCategories,
  fetchHotBoardDetail: api.fetchHotBoardDetail,
  fetchLiveTopList: api.fetchLiveTopList,
  fetchShoppingTopList: api.fetchShoppingTopList,
  fetchBrandTopList: api.fetchBrandTopList,
  fetchMagicFaceUsage: api.fetchMagicFaceUsage,
  fetchMagicFaceHot: api.fetchMagicFaceHot,
  fetchOneVideoSubComment: api.fetchOneVideoSubComment,
  fetchOneVideoComment: api.fetchOneVideoComment,
  generateShareShortUrl: api.generateShareShortUrl,
  generateKuaishouShareLink: api.generateKuaishouShareLink,
  fetchVideosBatch: api.fetchVideosBatch,
  searchComprehensive: api.searchComprehensive,
  searchVideoV2: api.searchVideoV2,
  searchUserV2: api.searchUserV2,
  fetchHotSearchPerson: api.fetchHotSearchPerson,
};
