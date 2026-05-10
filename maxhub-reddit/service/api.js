// 第三方接口请求封装 - reddit
// 基于MaxHub API中转站调用，包含所有API

const BASE_URL = process.env.MAXHUB_BASE_URL || 'https://www.aconfig.cn';
const API_KEY = process.env.MAXHUB_API_KEY;
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
 * 获取Reddit APP首页推荐内容/Fetch Reddit APP Home
 * GET /api/v1/reddit/app/fetch_home_feed
 * 无必填参数
 */
async function fetchHomeFeed(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_home_feed', params);
}

/**
 * 获取Reddit APP流行推荐内容/Fetch Reddit APP Popu
 * GET /api/v1/reddit/app/fetch_popular_feed
 * 无必填参数
 */
async function fetchPopularFeed(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_popular_feed', params);
}

/**
 * 获取Reddit APP游戏推荐内容/Fetch Reddit APP Game
 * GET /api/v1/reddit/app/fetch_games_feed
 * 无必填参数
 */
async function fetchGamesFeed(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_games_feed', params);
}

/**
 * 获取Reddit APP资讯推荐内容/Fetch Reddit APP News
 * GET /api/v1/reddit/app/fetch_news_feed
 * 无必填参数
 */
async function fetchNewsFeed(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_news_feed', params);
}

/**
 * 获取单个Reddit帖子详情/Fetch Single Reddit Post
 * GET /api/v1/reddit/app/fetch_post_details
 * @param {string} post_id - 必填参数
 */
async function fetchPostDetails(post_id, extraParams = {}) {
  const params = { post_id, ...extraParams };
  return request('/app/fetch_post_details', params);
}

/**
 * 批量获取Reddit帖子详情(最多5条)/Fetch Reddit Post D
 * GET /api/v1/reddit/app/fetch_post_details_batch
 * @param {string} post_ids - 必填参数
 */
async function fetchPostDetailsBatch(post_ids, extraParams = {}) {
  const params = { post_ids, ...extraParams };
  return request('/app/fetch_post_details_batch', params);
}

/**
 * 大批量获取Reddit帖子详情(最多30条)/Fetch Reddit Post
 * GET /api/v1/reddit/app/fetch_post_details_batch_large
 * @param {string} post_ids - 必填参数
 */
async function fetchPostDetailsBatchLarge(post_ids, extraParams = {}) {
  const params = { post_ids, ...extraParams };
  return request('/app/fetch_post_details_batch_large', params);
}

/**
 * 获取Reddit APP版块规则样式信息/Fetch Reddit APP Su
 * GET /api/v1/reddit/app/fetch_subreddit_style
 * 无必填参数
 */
async function fetchSubredditStyle(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_subreddit_style', params);
}

/**
 * 获取Reddit APP版块帖子频道信息/Fetch Reddit APP Su
 * GET /api/v1/reddit/app/fetch_subreddit_post_channels
 * 无必填参数
 */
async function fetchSubredditPostChannels(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_subreddit_post_channels', params);
}

/**
 * 获取Reddit APP版块信息/Fetch Reddit APP Subred
 * GET /api/v1/reddit/app/fetch_subreddit_info
 * 无必填参数
 */
async function fetchSubredditInfo(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_subreddit_info', params);
}

/**
 * 获取Reddit APP版块设置/Fetch Reddit APP Subred
 * GET /api/v1/reddit/app/fetch_subreddit_settings
 * @param {string} subreddit_id - 必填参数
 */
async function fetchSubredditSettings(subreddit_id, extraParams = {}) {
  const params = { subreddit_id, ...extraParams };
  return request('/app/fetch_subreddit_settings', params);
}

/**
 * 获取Reddit APP社区亮点/Fetch Reddit APP Commun
 * GET /api/v1/reddit/app/fetch_community_highlights
 * @param {string} subreddit_id - 必填参数
 */
async function fetchCommunityHighlights(subreddit_id, extraParams = {}) {
  const params = { subreddit_id, ...extraParams };
  return request('/app/fetch_community_highlights', params);
}

/**
 * 获取Reddit APP用户资料信息/Fetch Reddit APP User
 * GET /api/v1/reddit/app/fetch_user_profile
 * @param {string} username - 必填参数
 */
async function fetchUserProfile(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/app/fetch_user_profile', params);
}

/**
 * 获取用户活跃的社区列表/Fetch User's Active Subreddi
 * GET /api/v1/reddit/app/fetch_user_active_subreddits
 * @param {string} username - 必填参数
 */
async function fetchUserActiveSubreddits(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/app/fetch_user_active_subreddits', params);
}

/**
 * 获取用户发布的帖子列表/Fetch User Posts
 * GET /api/v1/reddit/app/fetch_user_posts
 * @param {string} username - 必填参数
 */
async function fetchUserPosts(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/app/fetch_user_posts', params);
}

/**
 * 获取Reddit APP版块Feed内容/Fetch Reddit APP Su
 * GET /api/v1/reddit/app/fetch_subreddit_feed
 * @param {string} subreddit_name - 必填参数
 */
async function fetchSubredditFeed(subreddit_name, extraParams = {}) {
  const params = { subreddit_name, ...extraParams };
  return request('/app/fetch_subreddit_feed', params);
}

/**
 * 检查版块是否静音/Check if Subreddit is Muted
 * GET /api/v1/reddit/app/check_subreddit_muted
 * @param {string} subreddit_id - 必填参数
 */
async function checkSubredditMuted(subreddit_id, extraParams = {}) {
  const params = { subreddit_id, ...extraParams };
  return request('/app/check_subreddit_muted', params);
}

/**
 * 获取用户公开奖杯/Fetch User Public Trophies
 * GET /api/v1/reddit/app/fetch_user_trophies
 * @param {string} username - 必填参数
 */
async function fetchUserTrophies(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/app/fetch_user_trophies', params);
}

// ==================== 互 ====================

/**
 * 获取Reddit APP帖子评论/Fetch Reddit APP Post C
 * GET /api/v1/reddit/app/fetch_post_comments
 * @param {string} post_id - 必填参数
 */
async function fetchPostComments(post_id, extraParams = {}) {
  const params = { post_id, ...extraParams };
  return request('/app/fetch_post_comments', params);
}

/**
 * 获取Reddit APP评论回复（二级评论）/Fetch Reddit APP
 * GET /api/v1/reddit/app/fetch_comment_replies
 * @param {string, string} post_id, cursor - 必填参数
 */
async function fetchCommentReplies(post_id, cursor, extraParams = {}) {
  const params = { post_id, cursor, ...extraParams };
  return request('/app/fetch_comment_replies', params);
}

/**
 * 获取用户评论列表/Fetch User Comments
 * GET /api/v1/reddit/app/fetch_user_comments
 * @param {string} username - 必填参数
 */
async function fetchUserComments(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/app/fetch_user_comments', params);
}

// ==================== 搜 ====================

/**
 * 获取Reddit APP搜索自动补全建议/Fetch Reddit APP Se
 * GET /api/v1/reddit/app/fetch_search_typeahead
 * @param {string} query - 必填参数
 */
async function fetchSearchTypeahead(query, extraParams = {}) {
  const params = { query, ...extraParams };
  return request('/app/fetch_search_typeahead', params);
}

/**
 * 获取Reddit APP动态搜索结果/Fetch Reddit APP Dyna
 * GET /api/v1/reddit/app/fetch_dynamic_search
 * @param {string} query - 必填参数
 */
async function fetchDynamicSearch(query, extraParams = {}) {
  const params = { query, ...extraParams };
  return request('/app/fetch_dynamic_search', params);
}

/**
 * 获取Reddit APP今日热门搜索/Fetch Reddit APP Tren
 * GET /api/v1/reddit/app/fetch_trending_searches
 * 无必填参数
 */
async function fetchTrendingSearches(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_trending_searches', params);
}

module.exports = {
  request,
  fetchHomeFeed,
  fetchPopularFeed,
  fetchGamesFeed,
  fetchNewsFeed,
  fetchPostDetails,
  fetchPostDetailsBatch,
  fetchPostDetailsBatchLarge,
  fetchSubredditStyle,
  fetchSubredditPostChannels,
  fetchSubredditInfo,
  fetchSubredditSettings,
  fetchCommunityHighlights,
  fetchUserProfile,
  fetchUserActiveSubreddits,
  fetchUserPosts,
  fetchSubredditFeed,
  checkSubredditMuted,
  fetchUserTrophies,
  fetchPostComments,
  fetchCommentReplies,
  fetchUserComments,
  fetchSearchTypeahead,
  fetchDynamicSearch,
  fetchTrendingSearches,
};
