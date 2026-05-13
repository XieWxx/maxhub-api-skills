// 第三方接口请求封装 - threads
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
  fetchUserInfo: { path: '/web/fetch_user_info', params: ['username'], price: 0.02 },
  fetchUserInfoById: { path: '/web/fetch_user_info_by_id', params: ['user_id'], price: 0.02 },
  fetchUserPosts: { path: '/web/fetch_user_posts', params: ['user_id'], price: 0.02 },
  fetchUserReposts: { path: '/web/fetch_user_reposts', params: ['user_id'], price: 0.02 },
  fetchUserReplies: { path: '/web/fetch_user_replies', params: ['user_id'], price: 0.02 },
  fetchPostDetail: { path: '/web/fetch_post_detail', params: ['post_id'], price: 0.02 },
  fetchPostDetailV2: { path: '/web/fetch_post_detail_v2', price: 0.02, estimatedLatency: 800, dataCompleteness: 0.95 },
  fetchPostComments: { path: '/web/fetch_post_comments', params: ['post_id'], price: 0.02 },
  searchTop: { path: '/web/search_top', params: ['query'], price: 0.02 },
  searchRecent: { path: '/web/search_recent', params: ['query'], price: 0.02 },
  searchProfiles: { path: '/web/search_profiles', params: ['query'], price: 0.02 },
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
  fetchUserInfo: api.fetchUserInfo,
  fetchUserInfoById: api.fetchUserInfoById,
  fetchUserPosts: api.fetchUserPosts,
  fetchUserReposts: api.fetchUserReposts,
  fetchUserReplies: api.fetchUserReplies,
  fetchPostDetail: api.fetchPostDetail,
  fetchPostDetailV2: api.fetchPostDetailV2,
  fetchPostComments: api.fetchPostComments,
  searchTop: api.searchTop,
  searchRecent: api.searchRecent,
  searchProfiles: api.searchProfiles,
};
