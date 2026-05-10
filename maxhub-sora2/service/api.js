// 第三方接口请求封装 - sora2
// 基于MaxHub API中转站调用，包含所有API

const DEFAULT_BASE_URL = 'https://www.aconfig.cn';
const ENV_KEY_URL = 'MAXHUB_BASE_URL';
const ENV_KEY_API = 'MAXHUB_API_KEY';

function getEnvVar(key) {
  return process.env[key];
}

function getBaseUrl() {
  const envUrl = getEnvVar(ENV_KEY_URL);
  return envUrl || DEFAULT_BASE_URL;
}

function getApiKey() {
  return getEnvVar(ENV_KEY_API);
}

const BASE_URL = getBaseUrl();
const API_KEY = getApiKey();
const PLATFORM = 'sora2';

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
    'x-api-key': API_KEY,
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
  // other
  getPostDetail: { path: '/get_post_detail' },
  getPostRemixList: { path: '/get_post_remix_list' },
  getUserProfile: { path: '/get_user_profile', params: ['user_id'] },
  getUserPosts: { path: '/get_user_posts', params: ['user_id'] },
  getUserCameoAppearances: { path: '/get_user_cameo_appearances', params: ['user_id'] },
  getFeed: { path: '/get_feed' },
  uploadImage: { path: '/upload_image', method: 'POST' },
  getTaskStatus: { path: '/get_task_status', params: ['task_id'] },
  getVideoDownloadInfo: { path: '/get_video_download_info' },
  getPostComments: { path: '/get_post_comments', params: ['post_id'] },
  getCommentReplies: { path: '/get_comment_replies', params: ['comment_id'] },
  getUserFollowers: { path: '/get_user_followers', params: ['user_id'] },
  getUserFollowing: { path: '/get_user_following', params: ['user_id'] },
  getCameoLeaderboard: { path: '/get_cameo_leaderboard' },
  searchUsers: { path: '/search_users', params: ['username'] },
  createVideo: { path: '/create_video', method: 'POST' },
  getTaskDetail: { path: '/get_task_detail' },
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
  getPostDetail: api.getPostDetail,
  getPostRemixList: api.getPostRemixList,
  getUserProfile: api.getUserProfile,
  getUserPosts: api.getUserPosts,
  getUserCameoAppearances: api.getUserCameoAppearances,
  getFeed: api.getFeed,
  uploadImage: api.uploadImage,
  getTaskStatus: api.getTaskStatus,
  getVideoDownloadInfo: api.getVideoDownloadInfo,
  getPostComments: api.getPostComments,
  getCommentReplies: api.getCommentReplies,
  getUserFollowers: api.getUserFollowers,
  getUserFollowing: api.getUserFollowing,
  getCameoLeaderboard: api.getCameoLeaderboard,
  searchUsers: api.searchUsers,
  createVideo: api.createVideo,
  getTaskDetail: api.getTaskDetail,
};
