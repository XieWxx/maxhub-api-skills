// 第三方接口请求封装 - youtube
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
 * 价格规则：
 *   web端大部分API: 0.01
 *   web_v2端大部分API: 0.01
 *   get_video_info(web端): 0.02
 *   get_general_search/get_shorts_search(web端): 0.02
 *   get_trending_videos(web_v2端): 0.02
 *   get_video_captions(web_v2端): 0.02
 *   get_general_search_v2/get_shorts_search_v2(web_v2端): 0.02
 *   get_video_streams_v2(web_v2端): 0.03
 *   get_channel_email: 0.30
 */
const API_REGISTRY = {
  // web端
  getVideoInfoV2: { path: '/web/get_video_info_v2', params: ['video_id'], price: 0.01 },
  getVideoInfoV3: { path: '/web/get_video_info_v3', params: ['video_id'], price: 0.01 },
  getVideoSubtitles: { path: '/web/get_video_subtitles', params: ['subtitle_url'], price: 0.01 },
  getRelateVideo: { path: '/web/get_relate_video', params: ['video_id'], price: 0.01 },
  getChannelIdV2: { path: '/web/get_channel_id_v2', params: ['channel_url'], price: 0.01 },
  getChannelInfo: { path: '/web/get_channel_info', params: ['channel_id'], price: 0.01 },
  getChannelVideosV2: { path: '/web/get_channel_videos_v2', params: ['channel_id'], price: 0.01 },
  getChannelVideosV3: { path: '/web/get_channel_videos_v3', params: ['channel_id'], price: 0.01 },
  getChannelShortVideos: { path: '/web/get_channel_short_videos', params: ['channel_id'], price: 0.01 },
  getTrendingVideos: { path: '/web/get_trending_videos', price: 0.01 },
  searchVideo: { path: '/web/search_video', params: ['search_query'], price: 0.01 },
  searchChannel: { path: '/web/search_channel', params: ['channel_id', 'search_query'], price: 0.01 },
  getVideoInfo: { path: '/web/get_video_info', params: ['video_id'], price: 0.02 },
  getGeneralSearch: { path: '/web/get_general_search', params: ['search_query'], price: 0.02 },
  getShortsSearch: { path: '/web/get_shorts_search', params: ['search_query'], price: 0.02 },
  getChannelEmail: { path: '/web/get_channel_email', price: 0.30 },
  // web_v2端
  getChannelDescription: { path: '/web_v2/get_channel_description', price: 0.01 },
  getChannelId: { path: '/web_v2/get_channel_id', params: ['channel_url'], price: 0.01 },
  getChannelUrl: { path: '/web_v2/get_channel_url', params: ['channel_id'], price: 0.01 },
  getChannelVideos: { path: '/web_v2/get_channel_videos', params: ['channel_id'], price: 0.01 },
  getVideoStreams: { path: '/web_v2/get_video_streams', price: 0.01 },
  getVideoStreamsV2: { path: '/web_v2/get_video_streams_v2', price: 0.03 },
  getSignedStreamUrl: { path: '/web_v2/get_signed_stream_url', params: ['itag'], price: 0.01 },
  getVideoCaptions: { path: '/web_v2/get_video_captions', price: 0.02 },
  getRelatedVideos: { path: '/web_v2/get_related_videos', price: 0.01 },
  getChannelShorts: { path: '/web_v2/get_channel_shorts', price: 0.01 },
  getChannelCommunityPosts: { path: '/web_v2/get_channel_community_posts', params: ['channel_id'], price: 0.01 },
  getPostDetail: { path: '/web_v2/get_post_detail', params: ['post_id'], price: 0.01 },
  getVideoComments: { path: '/web_v2/get_video_comments', params: ['video_id'], price: 0.01 },
  getVideoCommentReplies: { path: '/web_v2/get_video_comment_replies', params: ['continuation_token'], price: 0.01 },
  getPostComments: { path: '/web_v2/get_post_comments', price: 0.01 },
  getPostCommentReplies: { path: '/web_v2/get_post_comment_replies', params: ['continuation_token'], price: 0.01 },
  getGeneralSearchV2: { path: '/web_v2/get_general_search_v2', price: 0.02 },
  getShortsSearchV2: { path: '/web_v2/get_shorts_search_v2', price: 0.02 },
  getSearchSuggestions: { path: '/web_v2/get_search_suggestions', params: ['keyword'], price: 0.01 },
  searchChannels: { path: '/web_v2/search_channels', price: 0.01 },
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
  getVideoInfoV2: api.getVideoInfoV2,
  getVideoInfoV3: api.getVideoInfoV3,
  getVideoSubtitles: api.getVideoSubtitles,
  getRelateVideo: api.getRelateVideo,
  getChannelIdV2: api.getChannelIdV2,
  getChannelInfo: api.getChannelInfo,
  getChannelVideosV2: api.getChannelVideosV2,
  getChannelVideosV3: api.getChannelVideosV3,
  getChannelShortVideos: api.getChannelShortVideos,
  getVideoInfo: api.getVideoInfo,
  getChannelDescription: api.getChannelDescription,
  getChannelId: api.getChannelId,
  getChannelUrl: api.getChannelUrl,
  getChannelVideos: api.getChannelVideos,
  getVideoStreams: api.getVideoStreams,
  getVideoStreamsV2: api.getVideoStreamsV2,
  getSignedStreamUrl: api.getSignedStreamUrl,
  getVideoCaptions: api.getVideoCaptions,
  getRelatedVideos: api.getRelatedVideos,
  getChannelShorts: api.getChannelShorts,
  getChannelCommunityPosts: api.getChannelCommunityPosts,
  getPostDetail: api.getPostDetail,
  getTrendingVideos: api.getTrendingVideos,
  getVideoComments: api.getVideoComments,
  getVideoCommentReplies: api.getVideoCommentReplies,
  getPostComments: api.getPostComments,
  getPostCommentReplies: api.getPostCommentReplies,
  searchVideo: api.searchVideo,
  searchChannel: api.searchChannel,
  getGeneralSearch: api.getGeneralSearch,
  getGeneralSearchV2: api.getGeneralSearchV2,
  getShortsSearch: api.getShortsSearch,
  getShortsSearchV2: api.getShortsSearchV2,
  getSearchSuggestions: api.getSearchSuggestions,
  searchChannels: api.searchChannels,
  getChannelEmail: api.getChannelEmail,
};
