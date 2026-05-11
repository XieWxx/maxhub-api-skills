// 第三方接口请求封装 - lemon8
// 基于MaxHub API中转站调用，包含所有API

const config = require('../config.json');
const BASE_URL = config.apiBase.url;
const AUTH_HEADER = config.apiBase.authHeader;
const AUTH_ENV_NAME = config.apiBase.authEnvVar;
const PLATFORM = 'lemon8';

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
  // app
  fetchUserProfile: { path: '/app/fetch_user_profile', params: ['user_id'] },
  fetchPostDetail: { path: '/app/fetch_post_detail', params: ['item_id'] },
  fetchDiscoverBanners: { path: '/app/fetch_discover_banners' },
  fetchDiscoverTab: { path: '/app/fetch_discover_tab' },
  fetchDiscoverTabInformationTabs: { path: '/app/fetch_discover_tab_information_tabs' },
  fetchTopicInfo: { path: '/app/fetch_topic_info', params: ['forum_id'] },
  fetchTopicPostList: { path: '/app/fetch_topic_post_list', params: ['category', 'category_parameter', 'hashtag_name'] },
  getItemId: { path: '/app/get_item_id', params: ['share_text'] },
  getUserId: { path: '/app/get_user_id', params: ['share_text'] },
  getItemIds: { path: '/app/get_item_ids', method: 'POST' },
  getUserIds: { path: '/app/get_user_ids', method: 'POST' },
  fetchUserFollowerList: { path: '/app/fetch_user_follower_list', params: ['user_id'] },
  fetchUserFollowingList: { path: '/app/fetch_user_following_list', params: ['user_id'] },
  fetchPostCommentList: { path: '/app/fetch_post_comment_list', params: ['group_id', 'item_id', 'media_id'] },
  fetchHotSearchKeywords: { path: '/app/fetch_hot_search_keywords' },
  fetchSearch: { path: '/app/fetch_search', params: ['query'] },
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
  fetchUserProfile: api.fetchUserProfile,
  fetchPostDetail: api.fetchPostDetail,
  fetchDiscoverBanners: api.fetchDiscoverBanners,
  fetchDiscoverTab: api.fetchDiscoverTab,
  fetchDiscoverTabInformationTabs: api.fetchDiscoverTabInformationTabs,
  fetchTopicInfo: api.fetchTopicInfo,
  fetchTopicPostList: api.fetchTopicPostList,
  getItemId: api.getItemId,
  getUserId: api.getUserId,
  getItemIds: api.getItemIds,
  getUserIds: api.getUserIds,
  fetchUserFollowerList: api.fetchUserFollowerList,
  fetchUserFollowingList: api.fetchUserFollowingList,
  fetchPostCommentList: api.fetchPostCommentList,
  fetchHotSearchKeywords: api.fetchHotSearchKeywords,
  fetchSearch: api.fetchSearch,
};
