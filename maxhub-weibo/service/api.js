// 第三方接口请求封装 - weibo
// 基于MaxHub API中转站调用，包含所有API

const config = require('../config.json');
const BASE_URL = config.apiBase.url;
const AUTH_HEADER = config.apiBase.authHeader;
const AUTH_ENV_NAME = config.apiBase.authEnvVar;
const PLATFORM = 'weibo';

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
  // web
  fetchConfigList: { path: '/web/fetch_config_list' },
  fetchChannelFeed: { path: '/web/fetch_channel_feed' },
  fetchTrendTop: { path: '/web/fetch_trend_top', params: ['containerid'] },
  fetchCommentReplies: { path: '/web/fetch_comment_replies', params: ['cid'] },
  fetchSearch: { path: '/web/fetch_search', params: ['keyword'] },
  fetchSearchTopics: { path: '/web/fetch_search_topics' },
  // web_v2
  fetchPostDetail: { path: '/web_v2/fetch_post_detail', params: ['id'] },
  fetchUserBasicInfo: { path: '/web_v2/fetch_user_basic_info', params: ['uid'] },
  fetchUserPosts: { path: '/web_v2/fetch_user_posts', params: ['uid'] },
  fetchUserOriginalPosts: { path: '/web_v2/fetch_user_original_posts', params: ['uid'] },
  fetchUserVideoCollectionList: { path: '/web_v2/fetch_user_video_collection_list', params: ['uid'] },
  fetchUserVideoCollectionDetail: { path: '/web_v2/fetch_user_video_collection_detail', params: ['cid'] },
  fetchUserVideoList: { path: '/web_v2/fetch_user_video_list', params: ['uid'] },
  fetchUserFans: { path: '/web_v2/fetch_user_fans', params: ['uid'] },
  fetchAllGroups: { path: '/web_v2/fetch_all_groups' },
  fetchUserRecommendTimeline: { path: '/web_v2/fetch_user_recommend_timeline' },
  fetchCityList: { path: '/web_v2/fetch_city_list' },
  fetchHotRankingTimeline: { path: '/web_v2/fetch_hot_ranking_timeline', params: ['ranking_type'] },
  fetchEntertainmentRanking: { path: '/web_v2/fetch_entertainment_ranking' },
  fetchLifeRanking: { path: '/web_v2/fetch_life_ranking' },
  fetchSocialRanking: { path: '/web_v2/fetch_social_ranking' },
  checkAllowCommentWithPic: { path: '/web_v2/check_allow_comment_with_pic', params: ['id'] },
  fetchPostComments: { path: '/web_v2/fetch_post_comments', params: ['id'] },
  fetchPostSubComments: { path: '/web_v2/fetch_post_sub_comments', params: ['id'] },
  fetchUserFollowing: { path: '/web_v2/fetch_user_following', params: ['uid'] },
  searchUserPosts: { path: '/web_v2/search_user_posts', params: ['uid'] },
  fetchHotSearchIndex: { path: '/web_v2/fetch_hot_search_index' },
  fetchHotSearchSummary: { path: '/web_v2/fetch_hot_search_summary' },
  fetchSimilarSearch: { path: '/web_v2/fetch_similar_search', params: ['keyword'] },
  fetchAiSearch: { path: '/web_v2/fetch_ai_search', params: ['query'] },
  fetchAiRelatedSearch: { path: '/web_v2/fetch_ai_related_search', params: ['keyword'] },
  fetchAdvancedSearch: { path: '/web_v2/fetch_advanced_search', params: ['q'] },
  fetchRealtimeSearch: { path: '/web_v2/fetch_realtime_search', params: ['query'] },
  fetchUserSearch: { path: '/web_v2/fetch_user_search' },
  fetchVideoSearch: { path: '/web_v2/fetch_video_search', params: ['query'] },
  fetchPicSearch: { path: '/web_v2/fetch_pic_search', params: ['query'] },
  fetchTopicSearch: { path: '/web_v2/fetch_topic_search', params: ['query'] },
  // app
  fetchUserInfo: { path: '/app/fetch_user_info', params: ['uid'] },
  fetchUserInfoDetail: { path: '/app/fetch_user_info_detail', params: ['uid'] },
  fetchUserTimeline: { path: '/app/fetch_user_timeline', params: ['uid'] },
  fetchUserVideos: { path: '/app/fetch_user_videos', params: ['uid'] },
  fetchUserSuperTopics: { path: '/app/fetch_user_super_topics', params: ['uid'] },
  fetchUserAlbum: { path: '/app/fetch_user_album', params: ['uid'] },
  fetchUserArticles: { path: '/app/fetch_user_articles', params: ['uid'] },
  fetchUserAudios: { path: '/app/fetch_user_audios', params: ['uid'] },
  fetchUserProfileFeed: { path: '/app/fetch_user_profile_feed', params: ['uid'] },
  fetchStatusDetail: { path: '/app/fetch_status_detail', params: ['status_id'] },
  fetchStatusReposts: { path: '/app/fetch_status_reposts', params: ['status_id'] },
  fetchVideoDetail: { path: '/app/fetch_video_detail', params: ['mid'] },
  fetchVideoFeaturedFeed: { path: '/app/fetch_video_featured_feed' },
  fetchHomeRecommendFeed: { path: '/app/fetch_home_recommend_feed' },
  fetchStatusComments: { path: '/app/fetch_status_comments', params: ['status_id'] },
  fetchStatusLikes: { path: '/app/fetch_status_likes', params: ['status_id'] },
  fetchSearchAll: { path: '/app/fetch_search_all', params: ['query'] },
  fetchAiSmartSearch: { path: '/app/fetch_ai_smart_search', params: ['query'] },
  fetchHotSearch: { path: '/app/fetch_hot_search' },
  fetchHotSearchCategories: { path: '/app/fetch_hot_search_categories' },
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
  fetchConfigList: api.fetchConfigList,
  fetchChannelFeed: api.fetchChannelFeed,
  fetchPostDetail: api.fetchPostDetail,
  fetchUserBasicInfo: api.fetchUserBasicInfo,
  fetchUserPosts: api.fetchUserPosts,
  fetchUserOriginalPosts: api.fetchUserOriginalPosts,
  fetchUserVideoCollectionList: api.fetchUserVideoCollectionList,
  fetchUserVideoCollectionDetail: api.fetchUserVideoCollectionDetail,
  fetchUserVideoList: api.fetchUserVideoList,
  fetchUserFans: api.fetchUserFans,
  fetchAllGroups: api.fetchAllGroups,
  fetchUserRecommendTimeline: api.fetchUserRecommendTimeline,
  fetchCityList: api.fetchCityList,
  fetchUserInfo: api.fetchUserInfo,
  fetchUserInfoDetail: api.fetchUserInfoDetail,
  fetchUserTimeline: api.fetchUserTimeline,
  fetchUserVideos: api.fetchUserVideos,
  fetchUserSuperTopics: api.fetchUserSuperTopics,
  fetchUserAlbum: api.fetchUserAlbum,
  fetchUserArticles: api.fetchUserArticles,
  fetchUserAudios: api.fetchUserAudios,
  fetchUserProfileFeed: api.fetchUserProfileFeed,
  fetchStatusDetail: api.fetchStatusDetail,
  fetchStatusReposts: api.fetchStatusReposts,
  fetchVideoDetail: api.fetchVideoDetail,
  fetchVideoFeaturedFeed: api.fetchVideoFeaturedFeed,
  fetchHomeRecommendFeed: api.fetchHomeRecommendFeed,
  fetchTrendTop: api.fetchTrendTop,
  fetchHotRankingTimeline: api.fetchHotRankingTimeline,
  fetchEntertainmentRanking: api.fetchEntertainmentRanking,
  fetchLifeRanking: api.fetchLifeRanking,
  fetchSocialRanking: api.fetchSocialRanking,
  fetchCommentReplies: api.fetchCommentReplies,
  checkAllowCommentWithPic: api.checkAllowCommentWithPic,
  fetchPostComments: api.fetchPostComments,
  fetchPostSubComments: api.fetchPostSubComments,
  fetchUserFollowing: api.fetchUserFollowing,
  fetchStatusComments: api.fetchStatusComments,
  fetchStatusLikes: api.fetchStatusLikes,
  fetchSearch: api.fetchSearch,
  fetchSearchTopics: api.fetchSearchTopics,
  searchUserPosts: api.searchUserPosts,
  fetchHotSearchIndex: api.fetchHotSearchIndex,
  fetchHotSearchSummary: api.fetchHotSearchSummary,
  fetchSimilarSearch: api.fetchSimilarSearch,
  fetchAiSearch: api.fetchAiSearch,
  fetchAiRelatedSearch: api.fetchAiRelatedSearch,
  fetchAdvancedSearch: api.fetchAdvancedSearch,
  fetchRealtimeSearch: api.fetchRealtimeSearch,
  fetchUserSearch: api.fetchUserSearch,
  fetchVideoSearch: api.fetchVideoSearch,
  fetchPicSearch: api.fetchPicSearch,
  fetchTopicSearch: api.fetchTopicSearch,
  fetchSearchAll: api.fetchSearchAll,
  fetchAiSmartSearch: api.fetchAiSmartSearch,
  fetchHotSearch: api.fetchHotSearch,
  fetchHotSearchCategories: api.fetchHotSearchCategories,
};
