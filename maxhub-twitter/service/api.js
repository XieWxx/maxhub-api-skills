// 第三方接口请求封装 - twitter
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
const PLATFORM = 'twitter';

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
  fetchTweetDetail: { path: '/web/fetch_tweet_detail', params: ['tweet_id'] },
  fetchUserProfile: { path: '/web/fetch_user_profile' },
  fetchUserPostTweet: { path: '/web/fetch_user_post_tweet' },
  fetchUserTweetReplies: { path: '/web/fetch_user_tweet_replies', params: ['screen_name'] },
  fetchUserHighlightsTweets: { path: '/web/fetch_user_highlights_tweets', params: ['userId'] },
  fetchUserMedia: { path: '/web/fetch_user_media', params: ['screen_name'] },
  fetchRetweetUserList: { path: '/web/fetch_retweet_user_list', params: ['tweet_id'] },
  fetchTrending: { path: '/web/fetch_trending' },
  fetchSearchTimeline: { path: '/web/fetch_search_timeline', params: ['keyword'] },
  fetchPostComments: { path: '/web/fetch_post_comments', params: ['tweet_id'] },
  fetchLatestPostComments: { path: '/web/fetch_latest_post_comments', params: ['tweet_id'] },
  fetchUserFollowings: { path: '/web/fetch_user_followings', params: ['screen_name'] },
  fetchUserFollowers: { path: '/web/fetch_user_followers', params: ['screen_name'] },
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
  fetchTweetDetail: api.fetchTweetDetail,
  fetchUserProfile: api.fetchUserProfile,
  fetchUserPostTweet: api.fetchUserPostTweet,
  fetchUserTweetReplies: api.fetchUserTweetReplies,
  fetchUserHighlightsTweets: api.fetchUserHighlightsTweets,
  fetchUserMedia: api.fetchUserMedia,
  fetchRetweetUserList: api.fetchRetweetUserList,
  fetchTrending: api.fetchTrending,
  fetchSearchTimeline: api.fetchSearchTimeline,
  fetchPostComments: api.fetchPostComments,
  fetchLatestPostComments: api.fetchLatestPostComments,
  fetchUserFollowings: api.fetchUserFollowings,
  fetchUserFollowers: api.fetchUserFollowers,
};
