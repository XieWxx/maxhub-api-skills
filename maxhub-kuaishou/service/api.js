// 第三方接口请求封装 - kuaishou
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
  // web
  fetchOneVideoV2: { path: '/web/fetch_one_video_v2', params: ['photo_id'] },
  fetchUserInfo: { path: '/web/fetch_user_info', params: ['user_id'] },
  fetchUserPost: { path: '/web/fetch_user_post', params: ['user_id'] },
  fetchUserLiveReplay: { path: '/web/fetch_user_live_replay', params: ['user_id'] },
  fetchUserCollect: { path: '/web/fetch_user_collect', params: ['user_id'] },
  fetchKuaishouHotListV1: { path: '/web/fetch_kuaishou_hot_list_v1' },
  fetchKuaishouHotListV2: { path: '/web/fetch_kuaishou_hot_list_v2' },
  fetchGetUserId: { path: '/web/fetch_get_user_id', params: ['share_link'] },
  fetchOneVideoSubComment: { path: '/web/fetch_one_video_sub_comment', params: ['photo_id', 'root_comment_id'] },
  generateShareShortUrl: { path: '/web/generate_share_short_url', params: ['photo_id'] },
  // app
  fetchOneVideo: { path: '/app/fetch_one_video', params: ['photo_id'] },
  fetchOneVideoByUrl: { path: '/app/fetch_one_video_by_url', params: ['share_text'] },
  fetchOneUserV2: { path: '/app/fetch_one_user_v2', params: ['user_id'] },
  fetchUserLiveInfo: { path: '/app/fetch_user_live_info', params: ['user_id'] },
  fetchUserHotPost: { path: '/app/fetch_user_hot_post', params: ['user_id'] },
  fetchUserPostV2: { path: '/app/fetch_user_post_v2', params: ['user_id'] },
  fetchHotBoardCategories: { path: '/app/fetch_hot_board_categories' },
  fetchHotBoardDetail: { path: '/app/fetch_hot_board_detail' },
  fetchLiveTopList: { path: '/app/fetch_live_top_list' },
  fetchShoppingTopList: { path: '/app/fetch_shopping_top_list' },
  fetchBrandTopList: { path: '/app/fetch_brand_top_list' },
  fetchMagicFaceUsage: { path: '/app/fetch_magic_face_usage', params: ['magic_face_id'] },
  fetchMagicFaceHot: { path: '/app/fetch_magic_face_hot', params: ['magic_face_id'] },
  fetchOneVideoComment: { path: '/app/fetch_one_video_comment', params: ['photo_id'] },
  generateKuaishouShareLink: { path: '/app/generate_kuaishou_share_link', params: ['shareObjectId'] },
  fetchVideosBatch: { path: '/app/fetch_videos_batch', params: ['photo_ids'] },
  searchComprehensive: { path: '/app/search_comprehensive', params: ['keyword'] },
  searchVideoV2: { path: '/app/search_video_v2', params: ['keyword'] },
  searchUserV2: { path: '/app/search_user_v2', params: ['keyword'] },
  fetchHotSearchPerson: { path: '/app/fetch_hot_search_person' },
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
