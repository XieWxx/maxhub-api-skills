// 第三方接口请求封装 - instagram
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
const PLATFORM = 'instagram';

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
  // v1
  fetchUserInfoByUsername: { path: '/v1/fetch_user_info_by_username', params: ['username'] },
  fetchUserInfoByUsernameV2: { path: '/v1/fetch_user_info_by_username_v2', params: ['username'] },
  fetchUserInfoByUsernameV3: { path: '/v1/fetch_user_info_by_username_v3', params: ['username'] },
  fetchUserInfoById: { path: '/v1/fetch_user_info_by_id', params: ['user_id'] },
  fetchUserInfoByIdV2: { path: '/v1/fetch_user_info_by_id_v2', params: ['user_id'] },
  fetchUserAboutInfo: { path: '/v1/fetch_user_about_info', params: ['user_id'] },
  fetchUserPostsV2: { path: '/v1/fetch_user_posts_v2', params: ['user_id'] },
  fetchUserReposts: { path: '/v1/fetch_user_reposts', params: ['user_id'] },
  fetchRelatedProfiles: { path: '/v1/fetch_related_profiles', params: ['user_id'] },
  fetchPostByUrl: { path: '/v1/fetch_post_by_url', params: ['post_url'] },
  fetchPostByUrlV2: { path: '/v1/fetch_post_by_url_v2', params: ['post_url'] },
  fetchPostById: { path: '/v1/fetch_post_by_id', params: ['post_id'] },
  fetchLocationInfo: { path: '/v1/fetch_location_info', params: ['location_id'] },
  fetchCities: { path: '/v1/fetch_cities', params: ['country_code'] },
  fetchLocations: { path: '/v1/fetch_locations', params: ['city_id'] },
  fetchExploreSections: { path: '/v1/fetch_explore_sections' },
  fetchSectionPosts: { path: '/v1/fetch_section_posts', params: ['section_id'] },
  fetchSearch: { path: '/v1/fetch_search', params: ['query'] },
  fetchPostCommentsV2: { path: '/v1/fetch_post_comments_v2', params: ['media_id'] },
  // v2
  userIdToUsername: { path: '/v2/user_id_to_username', params: ['user_id'] },
  fetchUserInfo: { path: '/v2/fetch_user_info' },
  fetchUserPosts: { path: '/v2/fetch_user_posts' },
  fetchUserReels: { path: '/v2/fetch_user_reels' },
  fetchUserStories: { path: '/v2/fetch_user_stories' },
  fetchUserHighlights: { path: '/v2/fetch_user_highlights' },
  fetchHighlightStories: { path: '/v2/fetch_highlight_stories', params: ['highlight_id'] },
  fetchUserTaggedPosts: { path: '/v2/fetch_user_tagged_posts' },
  fetchSimilarUsers: { path: '/v2/fetch_similar_users' },
  fetchPostInfo: { path: '/v2/fetch_post_info', params: ['code_or_url'] },
  fetchMusicPosts: { path: '/v2/fetch_music_posts', params: ['audio_canonical_id'] },
  fetchLocationPosts: { path: '/v2/fetch_location_posts', params: ['location_id'] },
  fetchHashtagPosts: { path: '/v2/fetch_hashtag_posts', params: ['keyword'] },
  searchReels: { path: '/v2/search_reels', params: ['keyword'] },
  searchMusic: { path: '/v2/search_music', params: ['keyword'] },
  searchLocations: { path: '/v2/search_locations', params: ['keyword'] },
  searchByCoordinates: { path: '/v2/search_by_coordinates', params: ['latitude', 'longitude'] },
  fetchUserFollowers: { path: '/v2/fetch_user_followers' },
  fetchUserFollowing: { path: '/v2/fetch_user_following' },
  fetchPostLikes: { path: '/v2/fetch_post_likes', params: ['code_or_url'] },
  fetchPostComments: { path: '/v2/fetch_post_comments', params: ['code_or_url'] },
  fetchCommentReplies: { path: '/v2/fetch_comment_replies', params: ['code_or_url', 'comment_id'] },
  // v3
  getUserIdByUsername: { path: '/v3/get_user_id_by_username', params: ['username'] },
  getUserProfile: { path: '/v3/get_user_profile' },
  getUserBrief: { path: '/v3/get_user_brief', params: ['user_id', 'username'] },
  getUserPosts: { path: '/v3/get_user_posts', params: ['username'] },
  getUserTaggedPosts: { path: '/v3/get_user_tagged_posts' },
  getUserReels: { path: '/v3/get_user_reels' },
  getUserHighlights: { path: '/v3/get_user_highlights' },
  getHighlightStories: { path: '/v3/get_highlight_stories', params: ['highlight_id'] },
  getUserAbout: { path: '/v3/get_user_about' },
  getUserFormerUsernames: { path: '/v3/get_user_former_usernames' },
  getUserStories: { path: '/v3/get_user_stories' },
  getRecommendedReels: { path: '/v3/get_recommended_reels' },
  getPostInfo: { path: '/v3/get_post_info', params: ['media_id'] },
  getPostInfoByCode: { path: '/v3/get_post_info_by_code', params: ['code'] },
  getPostOembed: { path: '/v3/get_post_oembed', params: ['url'] },
  getExplore: { path: '/v3/get_explore' },
  getLocationInfo: { path: '/v3/get_location_info', params: ['location_id'] },
  getLocationPosts: { path: '/v3/get_location_posts', params: ['location_id'] },
  getLocationNearby: { path: '/v3/get_location_nearby', params: ['location_id'] },
  shortcodeToMediaId: { path: '/v3/shortcode_to_media_id', params: ['shortcode'] },
  mediaIdToShortcode: { path: '/v3/media_id_to_shortcode', params: ['media_id'] },
  searchUsers: { path: '/v3/search_users', params: ['query'] },
  searchHashtags: { path: '/v3/search_hashtags', params: ['query'] },
  searchPlaces: { path: '/v3/search_places', params: ['query'] },
  generalSearch: { path: '/v3/general_search', params: ['query'] },
  getPostComments: { path: '/v3/get_post_comments', params: ['code'] },
  getCommentReplies: { path: '/v3/get_comment_replies', params: ['media_id', 'comment_id'] },
  translateComment: { path: '/v3/translate_comment', params: ['comment_id'] },
  bulkTranslateComments: { path: '/v3/bulk_translate_comments', params: ['comment_ids'] },
  getUserFollowing: { path: '/v3/get_user_following' },
  getUserFollowers: { path: '/v3/get_user_followers' },
  extractShortcode: { path: '/v3/extract_shortcode', params: ['url'] },
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
  fetchUserInfoByUsername: api.fetchUserInfoByUsername,
  fetchUserInfoByUsernameV2: api.fetchUserInfoByUsernameV2,
  fetchUserInfoByUsernameV3: api.fetchUserInfoByUsernameV3,
  fetchUserInfoById: api.fetchUserInfoById,
  fetchUserInfoByIdV2: api.fetchUserInfoByIdV2,
  fetchUserAboutInfo: api.fetchUserAboutInfo,
  fetchUserPostsV2: api.fetchUserPostsV2,
  fetchUserReposts: api.fetchUserReposts,
  fetchRelatedProfiles: api.fetchRelatedProfiles,
  fetchPostByUrl: api.fetchPostByUrl,
  fetchPostByUrlV2: api.fetchPostByUrlV2,
  fetchPostById: api.fetchPostById,
  fetchLocationInfo: api.fetchLocationInfo,
  fetchCities: api.fetchCities,
  fetchLocations: api.fetchLocations,
  fetchExploreSections: api.fetchExploreSections,
  fetchSectionPosts: api.fetchSectionPosts,
  userIdToUsername: api.userIdToUsername,
  fetchUserInfo: api.fetchUserInfo,
  fetchUserPosts: api.fetchUserPosts,
  fetchUserReels: api.fetchUserReels,
  fetchUserStories: api.fetchUserStories,
  fetchUserHighlights: api.fetchUserHighlights,
  fetchHighlightStories: api.fetchHighlightStories,
  fetchUserTaggedPosts: api.fetchUserTaggedPosts,
  fetchSimilarUsers: api.fetchSimilarUsers,
  fetchPostInfo: api.fetchPostInfo,
  fetchMusicPosts: api.fetchMusicPosts,
  fetchLocationPosts: api.fetchLocationPosts,
  fetchHashtagPosts: api.fetchHashtagPosts,
  getUserIdByUsername: api.getUserIdByUsername,
  getUserProfile: api.getUserProfile,
  getUserBrief: api.getUserBrief,
  getUserPosts: api.getUserPosts,
  getUserTaggedPosts: api.getUserTaggedPosts,
  getUserReels: api.getUserReels,
  getUserHighlights: api.getUserHighlights,
  getHighlightStories: api.getHighlightStories,
  getUserAbout: api.getUserAbout,
  getUserFormerUsernames: api.getUserFormerUsernames,
  getUserStories: api.getUserStories,
  getRecommendedReels: api.getRecommendedReels,
  getPostInfo: api.getPostInfo,
  getPostInfoByCode: api.getPostInfoByCode,
  getPostOembed: api.getPostOembed,
  getExplore: api.getExplore,
  getLocationInfo: api.getLocationInfo,
  getLocationPosts: api.getLocationPosts,
  getLocationNearby: api.getLocationNearby,
  shortcodeToMediaId: api.shortcodeToMediaId,
  mediaIdToShortcode: api.mediaIdToShortcode,
  fetchSearch: api.fetchSearch,
  searchReels: api.searchReels,
  searchMusic: api.searchMusic,
  searchLocations: api.searchLocations,
  searchByCoordinates: api.searchByCoordinates,
  searchUsers: api.searchUsers,
  searchHashtags: api.searchHashtags,
  searchPlaces: api.searchPlaces,
  generalSearch: api.generalSearch,
  fetchPostCommentsV2: api.fetchPostCommentsV2,
  fetchUserFollowers: api.fetchUserFollowers,
  fetchUserFollowing: api.fetchUserFollowing,
  fetchPostLikes: api.fetchPostLikes,
  fetchPostComments: api.fetchPostComments,
  fetchCommentReplies: api.fetchCommentReplies,
  getPostComments: api.getPostComments,
  getCommentReplies: api.getCommentReplies,
  translateComment: api.translateComment,
  bulkTranslateComments: api.bulkTranslateComments,
  getUserFollowing: api.getUserFollowing,
  getUserFollowers: api.getUserFollowers,
  extractShortcode: api.extractShortcode,
};
