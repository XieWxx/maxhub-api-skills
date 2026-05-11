// 第三方接口请求封装 - reddit
// 基于MaxHub API中转站调用，包含所有API

const config = require('../config.json');
const BASE_URL = config.apiBase.url;
const AUTH_HEADER = config.apiBase.authHeader;
const AUTH_ENV_NAME = config.apiBase.authEnvVar;
const PLATFORM = 'reddit';

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
  fetchHomeFeed: { path: '/app/fetch_home_feed' },
  fetchPopularFeed: { path: '/app/fetch_popular_feed' },
  fetchGamesFeed: { path: '/app/fetch_games_feed' },
  fetchNewsFeed: { path: '/app/fetch_news_feed' },
  fetchPostDetails: { path: '/app/fetch_post_details', params: ['post_id'] },
  fetchPostDetailsBatch: { path: '/app/fetch_post_details_batch', params: ['post_ids'] },
  fetchPostDetailsBatchLarge: { path: '/app/fetch_post_details_batch_large', params: ['post_ids'] },
  fetchSubredditStyle: { path: '/app/fetch_subreddit_style' },
  fetchSubredditPostChannels: { path: '/app/fetch_subreddit_post_channels' },
  fetchSubredditInfo: { path: '/app/fetch_subreddit_info' },
  fetchSubredditSettings: { path: '/app/fetch_subreddit_settings', params: ['subreddit_id'] },
  fetchCommunityHighlights: { path: '/app/fetch_community_highlights', params: ['subreddit_id'] },
  fetchUserProfile: { path: '/app/fetch_user_profile', params: ['username'] },
  fetchUserActiveSubreddits: { path: '/app/fetch_user_active_subreddits', params: ['username'] },
  fetchUserPosts: { path: '/app/fetch_user_posts', params: ['username'] },
  fetchSubredditFeed: { path: '/app/fetch_subreddit_feed', params: ['subreddit_name'] },
  checkSubredditMuted: { path: '/app/check_subreddit_muted', params: ['subreddit_id'] },
  fetchUserTrophies: { path: '/app/fetch_user_trophies', params: ['username'] },
  fetchPostComments: { path: '/app/fetch_post_comments', params: ['post_id'] },
  fetchCommentReplies: { path: '/app/fetch_comment_replies', params: ['post_id', 'cursor'] },
  fetchUserComments: { path: '/app/fetch_user_comments', params: ['username'] },
  fetchSearchTypeahead: { path: '/app/fetch_search_typeahead', params: ['query'] },
  fetchDynamicSearch: { path: '/app/fetch_dynamic_search', params: ['query'] },
  fetchTrendingSearches: { path: '/app/fetch_trending_searches' },
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
  fetchHomeFeed: api.fetchHomeFeed,
  fetchPopularFeed: api.fetchPopularFeed,
  fetchGamesFeed: api.fetchGamesFeed,
  fetchNewsFeed: api.fetchNewsFeed,
  fetchPostDetails: api.fetchPostDetails,
  fetchPostDetailsBatch: api.fetchPostDetailsBatch,
  fetchPostDetailsBatchLarge: api.fetchPostDetailsBatchLarge,
  fetchSubredditStyle: api.fetchSubredditStyle,
  fetchSubredditPostChannels: api.fetchSubredditPostChannels,
  fetchSubredditInfo: api.fetchSubredditInfo,
  fetchSubredditSettings: api.fetchSubredditSettings,
  fetchCommunityHighlights: api.fetchCommunityHighlights,
  fetchUserProfile: api.fetchUserProfile,
  fetchUserActiveSubreddits: api.fetchUserActiveSubreddits,
  fetchUserPosts: api.fetchUserPosts,
  fetchSubredditFeed: api.fetchSubredditFeed,
  checkSubredditMuted: api.checkSubredditMuted,
  fetchUserTrophies: api.fetchUserTrophies,
  fetchPostComments: api.fetchPostComments,
  fetchCommentReplies: api.fetchCommentReplies,
  fetchUserComments: api.fetchUserComments,
  fetchSearchTypeahead: api.fetchSearchTypeahead,
  fetchDynamicSearch: api.fetchDynamicSearch,
  fetchTrendingSearches: api.fetchTrendingSearches,
};
