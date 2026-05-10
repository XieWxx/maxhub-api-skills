// 第三方接口请求封装 - twitter
// 基于MaxHub API中转站调用，包含所有API

const BASE_URL = process.env.MAXHUB_BASE_URL || 'https://www.aconfig.cn';
const API_KEY = process.env.MAXHUB_API_KEY;
const PLATFORM = 'twitter';

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
 * 获取单个推文数据/Get single tweet data
 * GET /api/v1/twitter/web/fetch_tweet_detail
 * @param {string} tweet_id - 必填参数
 */
async function fetchTweetDetail(tweet_id, extraParams = {}) {
  const params = { tweet_id, ...extraParams };
  return request('/web/fetch_tweet_detail', params);
}

/**
 * 获取用户资料/Get user profile
 * GET /api/v1/twitter/web/fetch_user_profile
 * 无必填参数
 */
async function fetchUserProfile(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_user_profile', params);
}

/**
 * 获取用户发帖/Get user post
 * GET /api/v1/twitter/web/fetch_user_post_tweet
 * 无必填参数
 */
async function fetchUserPostTweet(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_user_post_tweet', params);
}

/**
 * 获取用户推文回复/Get user tweet replies
 * GET /api/v1/twitter/web/fetch_user_tweet_replies
 * @param {string} screen_name - 必填参数
 */
async function fetchUserTweetReplies(screen_name, extraParams = {}) {
  const params = { screen_name, ...extraParams };
  return request('/web/fetch_user_tweet_replies', params);
}

/**
 * 获取用户高光推文/Get user highlights tweets
 * GET /api/v1/twitter/web/fetch_user_highlights_tweets
 * @param {string} userId - 必填参数
 */
async function fetchUserHighlightsTweets(userId, extraParams = {}) {
  const params = { userId, ...extraParams };
  return request('/web/fetch_user_highlights_tweets', params);
}

/**
 * 获取用户媒体/Get user media
 * GET /api/v1/twitter/web/fetch_user_media
 * @param {string} screen_name - 必填参数
 */
async function fetchUserMedia(screen_name, extraParams = {}) {
  const params = { screen_name, ...extraParams };
  return request('/web/fetch_user_media', params);
}

/**
 * 转推用户列表/ReTweet User list
 * GET /api/v1/twitter/web/fetch_retweet_user_list
 * @param {string} tweet_id - 必填参数
 */
async function fetchRetweetUserList(tweet_id, extraParams = {}) {
  const params = { tweet_id, ...extraParams };
  return request('/web/fetch_retweet_user_list', params);
}

/**
 * 趋势/Trending
 * GET /api/v1/twitter/web/fetch_trending
 * 无必填参数
 */
async function fetchTrending(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_trending', params);
}

// ==================== 搜 ====================

/**
 * 搜索/Search
 * GET /api/v1/twitter/web/fetch_search_timeline
 * @param {string} keyword - 必填参数
 */
async function fetchSearchTimeline(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web/fetch_search_timeline', params);
}

// ==================== 互 ====================

/**
 * 获取评论/Get comments
 * GET /api/v1/twitter/web/fetch_post_comments
 * @param {string} tweet_id - 必填参数
 */
async function fetchPostComments(tweet_id, extraParams = {}) {
  const params = { tweet_id, ...extraParams };
  return request('/web/fetch_post_comments', params);
}

/**
 * 获取最新的推文评论/Get the latest tweet comments
 * GET /api/v1/twitter/web/fetch_latest_post_comments
 * @param {string} tweet_id - 必填参数
 */
async function fetchLatestPostComments(tweet_id, extraParams = {}) {
  const params = { tweet_id, ...extraParams };
  return request('/web/fetch_latest_post_comments', params);
}

/**
 * 用户关注/User Followings
 * GET /api/v1/twitter/web/fetch_user_followings
 * @param {string} screen_name - 必填参数
 */
async function fetchUserFollowings(screen_name, extraParams = {}) {
  const params = { screen_name, ...extraParams };
  return request('/web/fetch_user_followings', params);
}

/**
 * 用户粉丝/User Followers
 * GET /api/v1/twitter/web/fetch_user_followers
 * @param {string} screen_name - 必填参数
 */
async function fetchUserFollowers(screen_name, extraParams = {}) {
  const params = { screen_name, ...extraParams };
  return request('/web/fetch_user_followers', params);
}

module.exports = {
  request,
  fetchTweetDetail,
  fetchUserProfile,
  fetchUserPostTweet,
  fetchUserTweetReplies,
  fetchUserHighlightsTweets,
  fetchUserMedia,
  fetchRetweetUserList,
  fetchSearchTimeline,
  fetchPostComments,
  fetchLatestPostComments,
  fetchUserFollowings,
  fetchUserFollowers,
  fetchTrending,
};
