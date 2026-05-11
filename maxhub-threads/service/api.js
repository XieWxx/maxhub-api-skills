// 第三方接口请求封装 - threads
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
const PLATFORM = 'threads';

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
    [AUTH_HEADER]: resolveCredential(),
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
  fetchUserInfo: { path: '/web/fetch_user_info', params: ['username'] },
  fetchUserInfoById: { path: '/web/fetch_user_info_by_id', params: ['user_id'] },
  fetchUserPosts: { path: '/web/fetch_user_posts', params: ['user_id'] },
  fetchUserReposts: { path: '/web/fetch_user_reposts', params: ['user_id'] },
  fetchUserReplies: { path: '/web/fetch_user_replies', params: ['user_id'] },
  fetchPostDetail: { path: '/web/fetch_post_detail', params: ['post_id'] },
  fetchPostDetailV2: { path: '/web/fetch_post_detail_v2' },
  fetchPostComments: { path: '/web/fetch_post_comments', params: ['post_id'] },
  searchTop: { path: '/web/search_top', params: ['query'] },
  searchRecent: { path: '/web/search_recent', params: ['query'] },
  searchProfiles: { path: '/web/search_profiles', params: ['query'] },
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
