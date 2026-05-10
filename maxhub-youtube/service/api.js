// 第三方接口请求封装 - youtube
// 基于MaxHub API中转站调用，包含所有API

const BASE_URL = process.env.MAXHUB_BASE_URL || 'https://www.aconfig.cn';
const API_KEY = process.env.MAXHUB_API_KEY;
const PLATFORM = 'youtube';

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
  // web
  getVideoInfoV2: { path: '/web/get_video_info_v2', params: ['video_id'] },
  getVideoInfoV3: { path: '/web/get_video_info_v3', params: ['video_id'] },
  getVideoSubtitles: { path: '/web/get_video_subtitles', params: ['subtitle_url'] },
  getRelateVideo: { path: '/web/get_relate_video', params: ['video_id'] },
  getChannelIdV2: { path: '/web/get_channel_id_v2', params: ['channel_url'] },
  getChannelInfo: { path: '/web/get_channel_info', params: ['channel_id'] },
  getChannelVideosV2: { path: '/web/get_channel_videos_v2', params: ['channel_id'] },
  getChannelVideosV3: { path: '/web/get_channel_videos_v3', params: ['channel_id'] },
  getChannelShortVideos: { path: '/web/get_channel_short_videos', params: ['channel_id'] },
  getTrendingVideos: { path: '/web/get_trending_videos' },
  searchVideo: { path: '/web/search_video', params: ['search_query'] },
  searchChannel: { path: '/web/search_channel', params: ['channel_id', 'search_query'] },
  // web_v2
  getVideoInfo: { path: '/web_v2/get_video_info', params: ['video_id'] },
  getChannelDescription: { path: '/web_v2/get_channel_description' },
  getChannelId: { path: '/web_v2/get_channel_id', params: ['channel_url'] },
  getChannelUrl: { path: '/web_v2/get_channel_url', params: ['channel_id'] },
  getChannelVideos: { path: '/web_v2/get_channel_videos', params: ['channel_id'] },
  getVideoStreams: { path: '/web_v2/get_video_streams' },
  getVideoStreamsV2: { path: '/web_v2/get_video_streams_v2' },
  getSignedStreamUrl: { path: '/web_v2/get_signed_stream_url', params: ['itag'] },
  getVideoCaptions: { path: '/web_v2/get_video_captions' },
  getRelatedVideos: { path: '/web_v2/get_related_videos' },
  getChannelShorts: { path: '/web_v2/get_channel_shorts' },
  getChannelCommunityPosts: { path: '/web_v2/get_channel_community_posts', params: ['channel_id'] },
  getPostDetail: { path: '/web_v2/get_post_detail', params: ['post_id'] },
  getVideoComments: { path: '/web_v2/get_video_comments', params: ['video_id'] },
  getVideoCommentReplies: { path: '/web_v2/get_video_comment_replies', params: ['continuation_token'] },
  getPostComments: { path: '/web_v2/get_post_comments' },
  getPostCommentReplies: { path: '/web_v2/get_post_comment_replies', params: ['continuation_token'] },
  getGeneralSearch: { path: '/web_v2/get_general_search', params: ['search_query'] },
  getGeneralSearchV2: { path: '/web_v2/get_general_search_v2' },
  getShortsSearch: { path: '/web_v2/get_shorts_search', params: ['search_query'] },
  getShortsSearchV2: { path: '/web_v2/get_shorts_search_v2' },
  getSearchSuggestions: { path: '/web_v2/get_search_suggestions', params: ['keyword'] },
  searchChannels: { path: '/web_v2/search_channels' },
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
};
