// 第三方接口请求封装 - bilibili
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
const PLATFORM = 'bilibili';

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
  fetchOneVideoV2: { path: '/web/fetch_one_video_v2', params: ['a_id', 'c_id'] },
  fetchOneVideoV3: { path: '/web/fetch_one_video_v3', params: ['url'] },
  fetchVideoDetail: { path: '/web/fetch_video_detail', params: ['aid'] },
  fetchVideoPlayInfo: { path: '/web/fetch_video_play_info', params: ['url'] },
  fetchVideoSubtitle: { path: '/web/fetch_video_subtitle', params: ['a_id', 'c_id'] },
  fetchVideoPlayurl: { path: '/web/fetch_video_playurl', params: ['bv_id', 'cid'] },
  fetchUserPostVideos: { path: '/web/fetch_user_post_videos', params: ['uid'] },
  fetchCollectFolders: { path: '/web/fetch_collect_folders', params: ['uid'] },
  fetchUserCollectionVideos: { path: '/web/fetch_user_collection_videos', params: ['folder_id'] },
  fetchUserProfile: { path: '/web/fetch_user_profile', params: ['uid'] },
  fetchComPopular: { path: '/web/fetch_com_popular' },
  fetchUserDynamic: { path: '/web/fetch_user_dynamic', params: ['uid'] },
  fetchDynamicDetail: { path: '/web/fetch_dynamic_detail', params: ['dynamic_id'] },
  fetchDynamicDetailV2: { path: '/web/fetch_dynamic_detail_v2', params: ['dynamic_id'] },
  fetchVideoDanmaku: { path: '/web/fetch_video_danmaku', params: ['cid'] },
  fetchLiveRoomDetail: { path: '/web/fetch_live_room_detail', params: ['room_id'] },
  fetchLiveVideos: { path: '/web/fetch_live_videos', params: ['room_id'] },
  fetchLiveStreamers: { path: '/web/fetch_live_streamers', params: ['area_id'] },
  fetchAllLiveAreas: { path: '/web/fetch_all_live_areas' },
  fetchVideoParts: { path: '/web/fetch_video_parts', params: ['bv_id'] },
  fetchUserUpStat: { path: '/web/fetch_user_up_stat', params: ['uid'] },
  fetchUserRelationStat: { path: '/web/fetch_user_relation_stat', params: ['uid'] },
  fetchHotSearch: { path: '/web/fetch_hot_search', params: ['limit'] },
  fetchGeneralSearch: { path: '/web/fetch_general_search', params: ['keyword', 'order', 'page', 'page_size'] },
  fetchCommentReply: { path: '/web/fetch_comment_reply', params: ['bv_id', 'rpid'] },
  bvToAid: { path: '/web/bv_to_aid', params: ['bv_id'] },
  fetchGetUserId: { path: '/web/fetch_get_user_id', params: ['share_link'] },
  // app
  fetchOneVideo: { path: '/app/fetch_one_video' },
  fetchUserVideos: { path: '/app/fetch_user_videos', params: ['user_id'] },
  fetchUserInfo: { path: '/app/fetch_user_info', params: ['user_id'] },
  fetchHomeFeed: { path: '/app/fetch_home_feed' },
  fetchPopularFeed: { path: '/app/fetch_popular_feed' },
  fetchCinemaTab: { path: '/app/fetch_cinema_tab' },
  fetchBangumiTab: { path: '/app/fetch_bangumi_tab' },
  fetchSearchAll: { path: '/app/fetch_search_all', params: ['keyword'] },
  fetchSearchByType: { path: '/app/fetch_search_by_type', params: ['keyword'] },
  fetchVideoComments: { path: '/app/fetch_video_comments' },
  fetchReplyDetail: { path: '/app/fetch_reply_detail', params: ['root'] },
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
