// 第三方接口请求封装 - wechat
// 基于MaxHub API中转站调用，包含所有API

const config = require('../config.json');
const BASE_URL = config.apiBase.url;
const AUTH_HEADER = config.apiBase.authHeader;
const AUTH_ENV_NAME = config.apiBase.authEnvVar;

function resolveCredential() {
  const proc = typeof process !== 'undefined' ? process : {};
  const env = proc.env || {};
  return env[AUTH_ENV_NAME] || '';
}

/**
 * 通用API请求方法
 * @param {string} path - API路径
 * @param {object} params - 请求参数
 * @param {string} method - 请求方法 GET/POST
 * @returns {Promise<object>} API响应数据
 */
const REQUEST_TIMEOUT = 30000;

async function request(path, params = {}, method = 'GET') {
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
  // _mp/web
  fetchMpArticleDetailJson: { path: '_mp/web/fetch_mp_article_detail_json', params: ['url'] },
  fetchMpArticleDetailHtml: { path: '_mp/web/fetch_mp_article_detail_html', params: ['url'] },
  fetchMpArticleList: { path: '_mp/web/fetch_mp_article_list', params: ['ghid'] },
  fetchMpArticleReadCount: { path: '_mp/web/fetch_mp_article_read_count', params: ['url', 'comment_id'] },
  fetchMpArticleUrl: { path: '_mp/web/fetch_mp_article_url', params: ['sogou_url'] },
  fetchMpArticleAd: { path: '_mp/web/fetch_mp_article_ad', params: ['url'] },
  fetchMpArticleUrlConversion: { path: '_mp/web/fetch_mp_article_url_conversion', params: ['url'] },
  fetchMpRelatedArticles: { path: '_mp/web/fetch_mp_related_articles', params: ['url'] },
  fetchMpArticleCommentList: { path: '_mp/web/fetch_mp_article_comment_list', params: ['url'] },
  fetchMpArticleCommentReplyList: { path: '_mp/web/fetch_mp_article_comment_reply_list', params: ['comment_id', 'content_id'] },
  // _channels
  fetchVideoDetail: { path: '_channels/fetch_video_detail' },
  fetchHomePage: { path: '_channels/fetch_home_page', method: 'POST' },
  fetchLiveHistory: { path: '_channels/fetch_live_history', params: ['username'] },
  fetchHotWords: { path: '_channels/fetch_hot_words' },
  fetchComments: { path: '_channels/fetch_comments', method: 'POST' },
  fetchDefaultSearch: { path: '_channels/fetch_default_search', method: 'POST' },
  fetchSearchLatest: { path: '_channels/fetch_search_latest', params: ['keywords'] },
  fetchSearchOrdinary: { path: '_channels/fetch_search_ordinary', params: ['keywords'] },
  fetchUserSearch: { path: '_channels/fetch_user_search', params: ['keywords'] },
  fetchUserSearchV2: { path: '_channels/fetch_user_search_v2' },
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
