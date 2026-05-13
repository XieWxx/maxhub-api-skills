// 第三方接口请求封装 - wechat
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
  // _mp/web
  fetchMpArticleDetailJson: { path: '_mp/web/fetch_mp_article_detail_json', params: ['url'], price: 0.01 },
  fetchMpArticleDetailHtml: { path: '_mp/web/fetch_mp_article_detail_html', params: ['url'], price: 0.01 },
  fetchMpArticleList: { path: '_mp/web/fetch_mp_article_list', params: ['ghid'], price: 0.01 },
  fetchMpArticleReadCount: { path: '_mp/web/fetch_mp_article_read_count', params: ['url', 'comment_id'], price: 0.01 },
  fetchMpArticleUrl: { path: '_mp/web/fetch_mp_article_url', params: ['sogou_url'], price: 0.01 },
  fetchMpArticleAd: { path: '_mp/web/fetch_mp_article_ad', params: ['url'], price: 0.01 },
  fetchMpArticleUrlConversion: { path: '_mp/web/fetch_mp_article_url_conversion', params: ['url'], price: 0.01 },
  fetchMpRelatedArticles: { path: '_mp/web/fetch_mp_related_articles', params: ['url'], price: 0.01 },
  fetchMpArticleCommentList: { path: '_mp/web/fetch_mp_article_comment_list', params: ['url'], price: 0.01 },
  fetchMpArticleCommentReplyList: { path: '_mp/web/fetch_mp_article_comment_reply_list', params: ['comment_id', 'content_id'], price: 0.01 },
  // _channels
  fetchVideoDetail: { path: '_channels/fetch_video_detail', price: 0.1 },
  fetchHomePage: { path: '_channels/fetch_home_page', method: 'POST', price: 0.1 },
  fetchLiveHistory: { path: '_channels/fetch_live_history', params: ['username'], price: 0.1 },
  fetchHotWords: { path: '_channels/fetch_hot_words', price: 0.1 },
  fetchComments: { path: '_channels/fetch_comments', method: 'POST', price: 0.1 },
  fetchDefaultSearch: { path: '_channels/fetch_default_search', method: 'POST', price: 0.1 },
  fetchSearchLatest: { path: '_channels/fetch_search_latest', params: ['keywords'], price: 0.1 },
  fetchSearchOrdinary: { path: '_channels/fetch_search_ordinary', params: ['keywords'], price: 0.1 },
  fetchUserSearch: { path: '_channels/fetch_user_search', params: ['keywords'], price: 0.1 },
  fetchUserSearchV2: { path: '_channels/fetch_user_search_v2', price: 0.1 },
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
  fetchMpArticleDetailJson: api.fetchMpArticleDetailJson,
  fetchMpArticleDetailHtml: api.fetchMpArticleDetailHtml,
  fetchMpArticleList: api.fetchMpArticleList,
  fetchMpArticleReadCount: api.fetchMpArticleReadCount,
  fetchMpArticleUrl: api.fetchMpArticleUrl,
  fetchMpArticleAd: api.fetchMpArticleAd,
  fetchMpArticleUrlConversion: api.fetchMpArticleUrlConversion,
  fetchMpRelatedArticles: api.fetchMpRelatedArticles,
  fetchVideoDetail: api.fetchVideoDetail,
  fetchHomePage: api.fetchHomePage,
  fetchLiveHistory: api.fetchLiveHistory,
  fetchHotWords: api.fetchHotWords,
  fetchMpArticleCommentList: api.fetchMpArticleCommentList,
  fetchMpArticleCommentReplyList: api.fetchMpArticleCommentReplyList,
  fetchComments: api.fetchComments,
  fetchDefaultSearch: api.fetchDefaultSearch,
  fetchSearchLatest: api.fetchSearchLatest,
  fetchSearchOrdinary: api.fetchSearchOrdinary,
  fetchUserSearch: api.fetchUserSearch,
  fetchUserSearchV2: api.fetchUserSearchV2,
};
