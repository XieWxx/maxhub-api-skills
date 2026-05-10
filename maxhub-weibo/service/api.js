// 第三方接口请求封装 - weibo
// 基于MaxHub API中转站调用，包含所有API

const BASE_URL = process.env.MAXHUB_BASE_URL || 'https://www.aconfig.cn';
const API_KEY = process.env.MAXHUB_API_KEY;
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

// ==================== 数 ====================

/**
 * 获取频道配置列表/Get channel config list
 * GET /api/v1/weibo/web/fetch_config_list
 * 无必填参数
 */
async function fetchConfigList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_config_list', params);
}

/**
 * 根据频道名称获取热门内容/Get channel feed by name
 * GET /api/v1/weibo/web/fetch_channel_feed
 * 无必填参数
 */
async function fetchChannelFeed(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_channel_feed', params);
}

/**
 * 获取用户信息/Get user information
 * GET /api/v1/weibo/web/fetch_user_info
 * @param {string} uid - 必填参数
 */
async function fetchUserInfo(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/web/fetch_user_info', params);
}

/**
 * 获取用户微博列表/Get user posts
 * GET /api/v1/weibo/web/fetch_user_posts
 * @param {string} uid - 必填参数
 */
async function fetchUserPosts(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/web/fetch_user_posts', params);
}

/**
 * 获取微博详情/Get post detail
 * GET /api/v1/weibo/web/fetch_post_detail
 * @param {string} post_id - 必填参数
 */
async function fetchPostDetail(post_id, extraParams = {}) {
  const params = { post_id, ...extraParams };
  return request('/web/fetch_post_detail', params);
}

/**
 * 获取单个作品数据/Get single post data
 * GET /api/v1/weibo/web_v2/fetch_post_detail
 * @param {string} id - 必填参数
 */
async function fetchPostDetail(id, extraParams = {}) {
  const params = { id, ...extraParams };
  return request('/web_v2/fetch_post_detail', params);
}

/**
 * 获取用户信息/Get user information
 * GET /api/v1/weibo/web_v2/fetch_user_info
 * 无必填参数
 */
async function fetchUserInfo(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web_v2/fetch_user_info', params);
}

/**
 * 获取用户基本信息/Get user basic information
 * GET /api/v1/weibo/web_v2/fetch_user_basic_info
 * @param {string} uid - 必填参数
 */
async function fetchUserBasicInfo(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/web_v2/fetch_user_basic_info', params);
}

/**
 * 获取微博用户文章数据/Get Weibo user posts
 * GET /api/v1/weibo/web_v2/fetch_user_posts
 * @param {string} uid - 必填参数
 */
async function fetchUserPosts(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/web_v2/fetch_user_posts', params);
}

/**
 * 获取微博用户原创微博数据/Get Weibo user original pos
 * GET /api/v1/weibo/web_v2/fetch_user_original_posts
 * @param {string} uid - 必填参数
 */
async function fetchUserOriginalPosts(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/web_v2/fetch_user_original_posts', params);
}

/**
 * 获取用户微博视频收藏夹列表/Get user video collection
 * GET /api/v1/weibo/web_v2/fetch_user_video_collection_list
 * @param {string} uid - 必填参数
 */
async function fetchUserVideoCollectionList(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/web_v2/fetch_user_video_collection_list', params);
}

/**
 * 获取用户微博视频收藏夹详情/Get user video collection
 * GET /api/v1/weibo/web_v2/fetch_user_video_collection_detail
 * @param {string} cid - 必填参数
 */
async function fetchUserVideoCollectionDetail(cid, extraParams = {}) {
  const params = { cid, ...extraParams };
  return request('/web_v2/fetch_user_video_collection_detail', params);
}

/**
 * 获取微博用户全部视频/Get user all videos
 * GET /api/v1/weibo/web_v2/fetch_user_video_list
 * @param {string} uid - 必填参数
 */
async function fetchUserVideoList(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/web_v2/fetch_user_video_list', params);
}

/**
 * 获取用户粉丝列表/Get user fans list
 * GET /api/v1/weibo/web_v2/fetch_user_fans
 * @param {string} uid - 必填参数
 */
async function fetchUserFans(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/web_v2/fetch_user_fans', params);
}

/**
 * 获取所有分组信息/Get all groups information
 * GET /api/v1/weibo/web_v2/fetch_all_groups
 * 无必填参数
 */
async function fetchAllGroups(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web_v2/fetch_all_groups', params);
}

/**
 * 获取微博主页推荐时间轴/Get user recommend timeline
 * GET /api/v1/weibo/web_v2/fetch_user_recommend_timeline
 * 无必填参数
 */
async function fetchUserRecommendTimeline(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web_v2/fetch_user_recommend_timeline', params);
}

/**
 * 地区省市映射/Region City List
 * GET /api/v1/weibo/web_v2/fetch_city_list
 * 无必填参数
 */
async function fetchCityList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web_v2/fetch_city_list', params);
}

/**
 * 获取用户信息/Get user information
 * GET /api/v1/weibo/app/fetch_user_info
 * @param {string} uid - 必填参数
 */
async function fetchUserInfo(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/app/fetch_user_info', params);
}

/**
 * 获取用户详细信息/Get user detail information
 * GET /api/v1/weibo/app/fetch_user_info_detail
 * @param {string} uid - 必填参数
 */
async function fetchUserInfoDetail(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/app/fetch_user_info_detail', params);
}

/**
 * 获取用户发布的微博/Get user timeline
 * GET /api/v1/weibo/app/fetch_user_timeline
 * @param {string} uid - 必填参数
 */
async function fetchUserTimeline(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/app/fetch_user_timeline', params);
}

/**
 * 获取用户视频列表/Get user videos
 * GET /api/v1/weibo/app/fetch_user_videos
 * @param {string} uid - 必填参数
 */
async function fetchUserVideos(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/app/fetch_user_videos', params);
}

/**
 * 获取用户参与的超话列表/Get user super topics
 * GET /api/v1/weibo/app/fetch_user_super_topics
 * @param {string} uid - 必填参数
 */
async function fetchUserSuperTopics(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/app/fetch_user_super_topics', params);
}

/**
 * 获取用户相册/Get user album
 * GET /api/v1/weibo/app/fetch_user_album
 * @param {string} uid - 必填参数
 */
async function fetchUserAlbum(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/app/fetch_user_album', params);
}

/**
 * 获取用户文章列表/Get user articles
 * GET /api/v1/weibo/app/fetch_user_articles
 * @param {string} uid - 必填参数
 */
async function fetchUserArticles(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/app/fetch_user_articles', params);
}

/**
 * 获取用户音频列表/Get user audios
 * GET /api/v1/weibo/app/fetch_user_audios
 * @param {string} uid - 必填参数
 */
async function fetchUserAudios(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/app/fetch_user_audios', params);
}

/**
 * 获取用户主页动态/Get user profile feed
 * GET /api/v1/weibo/app/fetch_user_profile_feed
 * @param {string} uid - 必填参数
 */
async function fetchUserProfileFeed(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/app/fetch_user_profile_feed', params);
}

/**
 * 获取微博详情/Get post detail
 * GET /api/v1/weibo/app/fetch_status_detail
 * @param {string} status_id - 必填参数
 */
async function fetchStatusDetail(status_id, extraParams = {}) {
  const params = { status_id, ...extraParams };
  return request('/app/fetch_status_detail', params);
}

/**
 * 获取微博转发列表/Get post reposts
 * GET /api/v1/weibo/app/fetch_status_reposts
 * @param {string} status_id - 必填参数
 */
async function fetchStatusReposts(status_id, extraParams = {}) {
  const params = { status_id, ...extraParams };
  return request('/app/fetch_status_reposts', params);
}

/**
 * 获取视频详情/Get video detail
 * GET /api/v1/weibo/app/fetch_video_detail
 * @param {string} mid - 必填参数
 */
async function fetchVideoDetail(mid, extraParams = {}) {
  const params = { mid, ...extraParams };
  return request('/app/fetch_video_detail', params);
}

/**
 * 获取短视频精选Feed流/Get video featured feed
 * GET /api/v1/weibo/app/fetch_video_featured_feed
 * 无必填参数
 */
async function fetchVideoFeaturedFeed(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_video_featured_feed', params);
}

/**
 * 获取首页推荐Feed流/Get home recommend feed
 * GET /api/v1/weibo/app/fetch_home_recommend_feed
 * 无必填参数
 */
async function fetchHomeRecommendFeed(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_home_recommend_feed', params);
}

/**
 * 获取频道热门趋势/Get channel trend top
 * GET /api/v1/weibo/web/fetch_trend_top
 * @param {string} containerid - 必填参数
 */
async function fetchTrendTop(containerid, extraParams = {}) {
  const params = { containerid, ...extraParams };
  return request('/web/fetch_trend_top', params);
}

/**
 * 获取微博热门榜单时间轴/Get hot ranking timeline
 * GET /api/v1/weibo/web_v2/fetch_hot_ranking_timeline
 * @param {string} ranking_type - 必填参数
 */
async function fetchHotRankingTimeline(ranking_type, extraParams = {}) {
  const params = { ranking_type, ...extraParams };
  return request('/web_v2/fetch_hot_ranking_timeline', params);
}

/**
 * 获取微博文娱榜单/Get Weibo entertainment ranking
 * GET /api/v1/weibo/web_v2/fetch_entertainment_ranking
 * 无必填参数
 */
async function fetchEntertainmentRanking(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web_v2/fetch_entertainment_ranking', params);
}

/**
 * 获取微博生活榜单/Get Weibo life ranking
 * GET /api/v1/weibo/web_v2/fetch_life_ranking
 * 无必填参数
 */
async function fetchLifeRanking(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web_v2/fetch_life_ranking', params);
}

/**
 * 获取微博社会榜单/Get Weibo social ranking
 * GET /api/v1/weibo/web_v2/fetch_social_ranking
 * 无必填参数
 */
async function fetchSocialRanking(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web_v2/fetch_social_ranking', params);
}

// ==================== 互 ====================

/**
 * 获取微博评论/Get post comments
 * GET /api/v1/weibo/web/fetch_post_comments
 * @param {string, string} post_id, mid - 必填参数
 */
async function fetchPostComments(post_id, mid, extraParams = {}) {
  const params = { post_id, mid, ...extraParams };
  return request('/web/fetch_post_comments', params);
}

/**
 * 获取评论子评论/Get comment replies
 * GET /api/v1/weibo/web/fetch_comment_replies
 * @param {string} cid - 必填参数
 */
async function fetchCommentReplies(cid, extraParams = {}) {
  const params = { cid, ...extraParams };
  return request('/web/fetch_comment_replies', params);
}

/**
 * 检查微博是否允许带图评论/Check if Weibo allows image
 * GET /api/v1/weibo/web_v2/check_allow_comment_with_pic
 * @param {string} id - 必填参数
 */
async function checkAllowCommentWithPic(id, extraParams = {}) {
  const params = { id, ...extraParams };
  return request('/web_v2/check_allow_comment_with_pic', params);
}

/**
 * 获取微博评论/Get Weibo comments
 * GET /api/v1/weibo/web_v2/fetch_post_comments
 * @param {string} id - 必填参数
 */
async function fetchPostComments(id, extraParams = {}) {
  const params = { id, ...extraParams };
  return request('/web_v2/fetch_post_comments', params);
}

/**
 * 获取微博子评论/Get Weibo sub-comments
 * GET /api/v1/weibo/web_v2/fetch_post_sub_comments
 * @param {string} id - 必填参数
 */
async function fetchPostSubComments(id, extraParams = {}) {
  const params = { id, ...extraParams };
  return request('/web_v2/fetch_post_sub_comments', params);
}

/**
 * 获取用户关注列表/Get user following list
 * GET /api/v1/weibo/web_v2/fetch_user_following
 * @param {string} uid - 必填参数
 */
async function fetchUserFollowing(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/web_v2/fetch_user_following', params);
}

/**
 * 获取微博评论/Get post comments
 * GET /api/v1/weibo/app/fetch_status_comments
 * @param {string} status_id - 必填参数
 */
async function fetchStatusComments(status_id, extraParams = {}) {
  const params = { status_id, ...extraParams };
  return request('/app/fetch_status_comments', params);
}

/**
 * 获取微博点赞列表/Get post likes
 * GET /api/v1/weibo/app/fetch_status_likes
 * @param {string} status_id - 必填参数
 */
async function fetchStatusLikes(status_id, extraParams = {}) {
  const params = { status_id, ...extraParams };
  return request('/app/fetch_status_likes', params);
}

// ==================== 搜 ====================

/**
 * 搜索微博/Search Weibo
 * GET /api/v1/weibo/web/fetch_search
 * @param {string} keyword - 必填参数
 */
async function fetchSearch(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web/fetch_search', params);
}

/**
 * 获取热搜榜/Get hot search ranking
 * GET /api/v1/weibo/web/fetch_hot_search
 * 无必填参数
 */
async function fetchHotSearch(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_hot_search', params);
}

/**
 * 获取搜索页热搜词/Get search page hot topics
 * GET /api/v1/weibo/web/fetch_search_topics
 * 无必填参数
 */
async function fetchSearchTopics(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_search_topics', params);
}

/**
 * 搜索用户微博/Search user posts
 * GET /api/v1/weibo/web_v2/search_user_posts
 * @param {string} uid - 必填参数
 */
async function searchUserPosts(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/web_v2/search_user_posts', params);
}

/**
 * 获取微博热搜词条(10条)/Get Weibo hot search index
 * GET /api/v1/weibo/web_v2/fetch_hot_search_index
 * 无必填参数
 */
async function fetchHotSearchIndex(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web_v2/fetch_hot_search_index', params);
}

/**
 * 获取微博完整热搜榜单(50条)/Get Weibo complete hot s
 * GET /api/v1/weibo/web_v2/fetch_hot_search_summary
 * 无必填参数
 */
async function fetchHotSearchSummary(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web_v2/fetch_hot_search_summary', params);
}

/**
 * 获取微博热搜榜单/Get Weibo hot search ranking
 * GET /api/v1/weibo/web_v2/fetch_hot_search
 * 无必填参数
 */
async function fetchHotSearch(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web_v2/fetch_hot_search', params);
}

/**
 * 获取微博相似搜索词推荐/Get Weibo similar search rec
 * GET /api/v1/weibo/web_v2/fetch_similar_search
 * @param {string} keyword - 必填参数
 */
async function fetchSimilarSearch(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web_v2/fetch_similar_search', params);
}

/**
 * 微博智能搜索/Weibo AI Search
 * GET /api/v1/weibo/web_v2/fetch_ai_search
 * @param {string} query - 必填参数
 */
async function fetchAiSearch(query, extraParams = {}) {
  const params = { query, ...extraParams };
  return request('/web_v2/fetch_ai_search', params);
}

/**
 * 微博AI搜索内容扩展/Weibo AI Search Content Exten
 * GET /api/v1/weibo/web_v2/fetch_ai_related_search
 * @param {string} keyword - 必填参数
 */
async function fetchAiRelatedSearch(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web_v2/fetch_ai_related_search', params);
}

/**
 * 微博高级搜索/Weibo Advanced Search
 * GET /api/v1/weibo/web_v2/fetch_advanced_search
 * @param {string} q - 必填参数
 */
async function fetchAdvancedSearch(q, extraParams = {}) {
  const params = { q, ...extraParams };
  return request('/web_v2/fetch_advanced_search', params);
}

/**
 * 实时搜索/Weibo Realtime Search
 * GET /api/v1/weibo/web_v2/fetch_realtime_search
 * @param {string} query - 必填参数
 */
async function fetchRealtimeSearch(query, extraParams = {}) {
  const params = { query, ...extraParams };
  return request('/web_v2/fetch_realtime_search', params);
}

/**
 * 用户搜索/User search
 * GET /api/v1/weibo/web_v2/fetch_user_search
 * 无必填参数
 */
async function fetchUserSearch(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web_v2/fetch_user_search', params);
}

/**
 * 视频搜索（热门/全部）/Weibo video search (hot/all)
 * GET /api/v1/weibo/web_v2/fetch_video_search
 * @param {string} query - 必填参数
 */
async function fetchVideoSearch(query, extraParams = {}) {
  const params = { query, ...extraParams };
  return request('/web_v2/fetch_video_search', params);
}

/**
 * 图片搜索/Weibo picture search
 * GET /api/v1/weibo/web_v2/fetch_pic_search
 * @param {string} query - 必填参数
 */
async function fetchPicSearch(query, extraParams = {}) {
  const params = { query, ...extraParams };
  return request('/web_v2/fetch_pic_search', params);
}

/**
 * 话题搜索/Weibo topic search
 * GET /api/v1/weibo/web_v2/fetch_topic_search
 * @param {string} query - 必填参数
 */
async function fetchTopicSearch(query, extraParams = {}) {
  const params = { query, ...extraParams };
  return request('/web_v2/fetch_topic_search', params);
}

/**
 * 综合搜索/Comprehensive search
 * GET /api/v1/weibo/app/fetch_search_all
 * @param {string} query - 必填参数
 */
async function fetchSearchAll(query, extraParams = {}) {
  const params = { query, ...extraParams };
  return request('/app/fetch_search_all', params);
}

/**
 * AI智搜/AI Smart Search
 * GET /api/v1/weibo/app/fetch_ai_smart_search
 * @param {string} query - 必填参数
 */
async function fetchAiSmartSearch(query, extraParams = {}) {
  const params = { query, ...extraParams };
  return request('/app/fetch_ai_smart_search', params);
}

/**
 * 获取热搜榜/Get hot search
 * GET /api/v1/weibo/app/fetch_hot_search
 * 无必填参数
 */
async function fetchHotSearch(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_hot_search', params);
}

/**
 * 获取热搜分类列表/Get hot search categories
 * GET /api/v1/weibo/app/fetch_hot_search_categories
 * 无必填参数
 */
async function fetchHotSearchCategories(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_hot_search_categories', params);
}

module.exports = {
  request,
  fetchConfigList,
  fetchChannelFeed,
  fetchUserInfo,
  fetchUserPosts,
  fetchPostDetail,
  fetchPostDetail,
  fetchUserInfo,
  fetchUserBasicInfo,
  fetchUserPosts,
  fetchUserOriginalPosts,
  fetchUserVideoCollectionList,
  fetchUserVideoCollectionDetail,
  fetchUserVideoList,
  fetchUserFans,
  fetchAllGroups,
  fetchUserRecommendTimeline,
  fetchCityList,
  fetchUserInfo,
  fetchUserInfoDetail,
  fetchUserTimeline,
  fetchUserVideos,
  fetchUserSuperTopics,
  fetchUserAlbum,
  fetchUserArticles,
  fetchUserAudios,
  fetchUserProfileFeed,
  fetchStatusDetail,
  fetchStatusReposts,
  fetchVideoDetail,
  fetchVideoFeaturedFeed,
  fetchHomeRecommendFeed,
  fetchTrendTop,
  fetchHotRankingTimeline,
  fetchEntertainmentRanking,
  fetchLifeRanking,
  fetchSocialRanking,
  fetchPostComments,
  fetchCommentReplies,
  checkAllowCommentWithPic,
  fetchPostComments,
  fetchPostSubComments,
  fetchUserFollowing,
  fetchStatusComments,
  fetchStatusLikes,
  fetchSearch,
  fetchHotSearch,
  fetchSearchTopics,
  searchUserPosts,
  fetchHotSearchIndex,
  fetchHotSearchSummary,
  fetchHotSearch,
  fetchSimilarSearch,
  fetchAiSearch,
  fetchAiRelatedSearch,
  fetchAdvancedSearch,
  fetchRealtimeSearch,
  fetchUserSearch,
  fetchVideoSearch,
  fetchPicSearch,
  fetchTopicSearch,
  fetchSearchAll,
  fetchAiSmartSearch,
  fetchHotSearch,
  fetchHotSearchCategories,
};
