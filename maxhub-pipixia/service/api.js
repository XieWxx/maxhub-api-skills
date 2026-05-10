// 第三方接口请求封装 - pipixia
// 基于MaxHub API中转站调用，包含所有API

const BASE_URL = process.env.MAXHUB_BASE_URL || 'https://www.aconfig.cn';
const API_KEY = process.env.MAXHUB_API_KEY;
const PLATFORM = 'pipixia';

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
 * 获取单个作品数据/Get single video data
 * GET /api/v1/pipixia/app/fetch_post_detail
 * @param {string} cell_id - 必填参数
 */
async function fetchPostDetail(cell_id, extraParams = {}) {
  const params = { cell_id, ...extraParams };
  return request('/app/fetch_post_detail', params);
}

/**
 * 获取用户信息/Get user information
 * GET /api/v1/pipixia/app/fetch_user_info
 * @param {string} user_id - 必填参数
 */
async function fetchUserInfo(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/app/fetch_user_info', params);
}

/**
 * 获取用户作品列表/Get user post list
 * GET /api/v1/pipixia/app/fetch_user_post_list
 * @param {string} user_id - 必填参数
 */
async function fetchUserPostList(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/app/fetch_user_post_list', params);
}

/**
 * 获取首页推荐/Get home feed
 * GET /api/v1/pipixia/app/fetch_home_feed
 * 无必填参数
 */
async function fetchHomeFeed(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_home_feed', params);
}

/**
 * 获取话题详情/Get hashtag detail
 * GET /api/v1/pipixia/app/fetch_hashtag_detail
 * @param {string} hashtag_id - 必填参数
 */
async function fetchHashtagDetail(hashtag_id, extraParams = {}) {
  const params = { hashtag_id, ...extraParams };
  return request('/app/fetch_hashtag_detail', params);
}

/**
 * 获取话题作品列表/Get hashtag post list
 * GET /api/v1/pipixia/app/fetch_hashtag_post_list
 * @param {string} hashtag_id - 必填参数
 */
async function fetchHashtagPostList(hashtag_id, extraParams = {}) {
  const params = { hashtag_id, ...extraParams };
  return request('/app/fetch_hashtag_post_list', params);
}

/**
 * 获取首页短剧推荐/Get home short drama feed
 * GET /api/v1/pipixia/app/fetch_home_short_drama_feed
 * 无必填参数
 */
async function fetchHomeShortDramaFeed(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_home_short_drama_feed', params);
}

/**
 * 获取作品统计数据/Get post statistics
 * GET /api/v1/pipixia/app/fetch_post_statistics
 * @param {string} cell_id - 必填参数
 */
async function fetchPostStatistics(cell_id, extraParams = {}) {
  const params = { cell_id, ...extraParams };
  return request('/app/fetch_post_statistics', params);
}

// ==================== 互 ====================

/**
 * 获取用户粉丝列表/Get user follower list
 * GET /api/v1/pipixia/app/fetch_user_follower_list
 * @param {string} user_id - 必填参数
 */
async function fetchUserFollowerList(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/app/fetch_user_follower_list', params);
}

/**
 * 获取用户关注列表/Get user following list
 * GET /api/v1/pipixia/app/fetch_user_following_list
 * @param {string} user_id - 必填参数
 */
async function fetchUserFollowingList(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/app/fetch_user_following_list', params);
}

/**
 * 获取作品评论列表/Get post comment list
 * GET /api/v1/pipixia/app/fetch_post_comment_list
 * @param {string} cell_id - 必填参数
 */
async function fetchPostCommentList(cell_id, extraParams = {}) {
  const params = { cell_id, ...extraParams };
  return request('/app/fetch_post_comment_list', params);
}

// ==================== 工 ====================

/**
 * 生成短连接/Generate short URL
 * GET /api/v1/pipixia/app/fetch_short_url
 * @param {string} original_url - 必填参数
 */
async function fetchShortUrl(original_url, extraParams = {}) {
  const params = { original_url, ...extraParams };
  return request('/app/fetch_short_url', params);
}

// ==================== 搜 ====================

/**
 * 获取热搜词条/Get hot search words
 * GET /api/v1/pipixia/app/fetch_hot_search_words
 * 无必填参数
 */
async function fetchHotSearchWords(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_hot_search_words', params);
}

/**
 * 获取热搜榜单列表/Get hot search board list
 * GET /api/v1/pipixia/app/fetch_hot_search_board_list
 * 无必填参数
 */
async function fetchHotSearchBoardList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_hot_search_board_list', params);
}

/**
 * 获取热搜榜单详情/Get hot search board detail
 * GET /api/v1/pipixia/app/fetch_hot_search_board_detail
 * @param {string} block_type - 必填参数
 */
async function fetchHotSearchBoardDetail(block_type, extraParams = {}) {
  const params = { block_type, ...extraParams };
  return request('/app/fetch_hot_search_board_detail', params);
}

/**
 * 搜索接口/Search API
 * GET /api/v1/pipixia/app/fetch_search
 * @param {string} keyword - 必填参数
 */
async function fetchSearch(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app/fetch_search', params);
}

module.exports = {
  request,
  fetchPostDetail,
  fetchUserInfo,
  fetchUserPostList,
  fetchHomeFeed,
  fetchHashtagDetail,
  fetchHashtagPostList,
  fetchHomeShortDramaFeed,
  fetchPostStatistics,
  fetchUserFollowerList,
  fetchUserFollowingList,
  fetchPostCommentList,
  fetchShortUrl,
  fetchHotSearchWords,
  fetchHotSearchBoardList,
  fetchHotSearchBoardDetail,
  fetchSearch,
};
