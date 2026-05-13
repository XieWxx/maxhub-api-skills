// 第三方接口请求封装 - bilibili
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
 * 价格规则：大部分API为 ¥0.01，fetch_one_video_v2 为 ¥0.02
 */
const API_REGISTRY = {
  // web
  fetchOneVideoV2: { path: '/web/fetch_one_video_v2', params: ['a_id', 'c_id'], price: 0.02 },
  fetchOneVideoV3: { path: '/web/fetch_one_video_v3', params: ['url'], price: 0.01 },
  fetchVideoDetail: { path: '/web/fetch_video_detail', params: ['aid'], price: 0.01 },
  fetchVideoPlayInfo: { path: '/web/fetch_video_play_info', params: ['url'], price: 0.01 },
  fetchVideoSubtitle: { path: '/web/fetch_video_subtitle', params: ['a_id', 'c_id'], price: 0.01 },
  fetchVideoPlayurl: { path: '/web/fetch_video_playurl', params: ['bv_id', 'cid'], price: 0.01 },
  fetchUserPostVideos: { path: '/web/fetch_user_post_videos', params: ['uid'], price: 0.01 },
  fetchCollectFolders: { path: '/web/fetch_collect_folders', params: ['uid'], price: 0.01 },
  fetchUserCollectionVideos: { path: '/web/fetch_user_collection_videos', params: ['folder_id'], price: 0.01 },
  fetchUserProfile: { path: '/web/fetch_user_profile', params: ['uid'], price: 0.01 },
  fetchComPopular: { path: '/web/fetch_com_popular', price: 0.01 },
  fetchUserDynamic: { path: '/web/fetch_user_dynamic', params: ['uid'], price: 0.01 },
  fetchDynamicDetail: { path: '/web/fetch_dynamic_detail', params: ['dynamic_id'], price: 0.01 },
  fetchDynamicDetailV2: { path: '/web/fetch_dynamic_detail_v2', params: ['dynamic_id'], price: 0.01 },
  fetchVideoDanmaku: { path: '/web/fetch_video_danmaku', params: ['cid'], price: 0.01 },
  fetchLiveRoomDetail: { path: '/web/fetch_live_room_detail', params: ['room_id'], price: 0.01 },
  fetchLiveVideos: { path: '/web/fetch_live_videos', params: ['room_id'], price: 0.01 },
  fetchLiveStreamers: { path: '/web/fetch_live_streamers', params: ['area_id'], price: 0.01 },
  fetchAllLiveAreas: { path: '/web/fetch_all_live_areas', price: 0.01 },
  fetchVideoParts: { path: '/web/fetch_video_parts', params: ['bv_id'], price: 0.01 },
  fetchUserUpStat: { path: '/web/fetch_user_up_stat', params: ['uid'], price: 0.01 },
  fetchUserRelationStat: { path: '/web/fetch_user_relation_stat', params: ['uid'], price: 0.01 },
  fetchHotSearch: { path: '/web/fetch_hot_search', params: ['limit'], price: 0.01 },
  fetchGeneralSearch: { path: '/web/fetch_general_search', params: ['keyword', 'order', 'page', 'page_size'], price: 0.01 },
  fetchCommentReply: { path: '/web/fetch_comment_reply', params: ['bv_id', 'rpid'], price: 0.01 },
  bvToAid: { path: '/web/bv_to_aid', params: ['bv_id'], price: 0.01 },
  fetchGetUserId: { path: '/web/fetch_get_user_id', params: ['share_link'], price: 0.01 },
  // app
  fetchOneVideo: { path: '/app/fetch_one_video', price: 0.01 },
  fetchUserVideos: { path: '/app/fetch_user_videos', params: ['user_id'], price: 0.01 },
  fetchUserInfo: { path: '/app/fetch_user_info', params: ['user_id'], price: 0.01 },
  fetchHomeFeed: { path: '/app/fetch_home_feed', price: 0.01 },
  fetchPopularFeed: { path: '/app/fetch_popular_feed', price: 0.01 },
  fetchCinemaTab: { path: '/app/fetch_cinema_tab', price: 0.01 },
  fetchBangumiTab: { path: '/app/fetch_bangumi_tab', price: 0.01 },
  fetchSearchAll: { path: '/app/fetch_search_all', params: ['keyword'], price: 0.01 },
  fetchSearchByType: { path: '/app/fetch_search_by_type', params: ['keyword'], price: 0.01 },
  fetchVideoComments: { path: '/app/fetch_video_comments', price: 0.01 },
  fetchReplyDetail: { path: '/app/fetch_reply_detail', params: ['root'], price: 0.01 },
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
 * @param {string} path - API路径
 * @param {object} params - 请求参数
 * @param {string} method - 请求方法 GET/POST
 * @returns {Promise<object>} API响应数据
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
  fetchOneVideoV3: api.fetchOneVideoV3,
  fetchVideoDetail: api.fetchVideoDetail,
  fetchVideoPlayInfo: api.fetchVideoPlayInfo,
  fetchVideoSubtitle: api.fetchVideoSubtitle,
  fetchVideoPlayurl: api.fetchVideoPlayurl,
  fetchUserPostVideos: api.fetchUserPostVideos,
  fetchCollectFolders: api.fetchCollectFolders,
  fetchUserCollectionVideos: api.fetchUserCollectionVideos,
  fetchUserProfile: api.fetchUserProfile,
  fetchComPopular: api.fetchComPopular,
  fetchUserDynamic: api.fetchUserDynamic,
  fetchDynamicDetail: api.fetchDynamicDetail,
  fetchDynamicDetailV2: api.fetchDynamicDetailV2,
  fetchVideoDanmaku: api.fetchVideoDanmaku,
  fetchLiveRoomDetail: api.fetchLiveRoomDetail,
  fetchLiveVideos: api.fetchLiveVideos,
  fetchLiveStreamers: api.fetchLiveStreamers,
  fetchAllLiveAreas: api.fetchAllLiveAreas,
  fetchVideoParts: api.fetchVideoParts,
  fetchOneVideo: api.fetchOneVideo,
  fetchUserVideos: api.fetchUserVideos,
  fetchUserInfo: api.fetchUserInfo,
  fetchHomeFeed: api.fetchHomeFeed,
  fetchPopularFeed: api.fetchPopularFeed,
  fetchCinemaTab: api.fetchCinemaTab,
  fetchBangumiTab: api.fetchBangumiTab,
  fetchUserUpStat: api.fetchUserUpStat,
  fetchUserRelationStat: api.fetchUserRelationStat,
  fetchHotSearch: api.fetchHotSearch,
  fetchGeneralSearch: api.fetchGeneralSearch,
  fetchSearchAll: api.fetchSearchAll,
  fetchSearchByType: api.fetchSearchByType,
  fetchCommentReply: api.fetchCommentReply,
  fetchVideoComments: api.fetchVideoComments,
  fetchReplyDetail: api.fetchReplyDetail,
  bvToAid: api.bvToAid,
  fetchGetUserId: api.fetchGetUserId,
};
