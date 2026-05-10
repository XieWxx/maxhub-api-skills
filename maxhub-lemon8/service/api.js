// 第三方接口请求封装 - lemon8
// 基于MaxHub API中转站调用，包含所有API

const BASE_URL = process.env.MAXHUB_BASE_URL || 'https://www.aconfig.cn';
const API_KEY = process.env.MAXHUB_API_KEY;
const PLATFORM = 'lemon8';

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
 * 获取指定用户的信息/Get information of specified u
 * GET /api/v1/lemon8/app/fetch_user_profile
 * @param {string} user_id - 必填参数
 */
async function fetchUserProfile(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/app/fetch_user_profile', params);
}

/**
 * 获取指定作品的信息/Get information of specified p
 * GET /api/v1/lemon8/app/fetch_post_detail
 * @param {string} item_id - 必填参数
 */
async function fetchPostDetail(item_id, extraParams = {}) {
  const params = { item_id, ...extraParams };
  return request('/app/fetch_post_detail', params);
}

/**
 * 获取发现页Banner/Get banners of discover page
 * GET /api/v1/lemon8/app/fetch_discover_banners
 * 无必填参数
 */
async function fetchDiscoverBanners(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_discover_banners', params);
}

/**
 * 获取发现页主体内容/Get main content of discover p
 * GET /api/v1/lemon8/app/fetch_discover_tab
 * 无必填参数
 */
async function fetchDiscoverTab(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_discover_tab', params);
}

/**
 * 获取发现页的 Editor's Picks/Get Editor's Picks
 * GET /api/v1/lemon8/app/fetch_discover_tab_information_tabs
 * 无必填参数
 */
async function fetchDiscoverTabInformationTabs(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_discover_tab_information_tabs', params);
}

/**
 * 获取话题信息/Get topic information
 * GET /api/v1/lemon8/app/fetch_topic_info
 * @param {string} forum_id - 必填参数
 */
async function fetchTopicInfo(forum_id, extraParams = {}) {
  const params = { forum_id, ...extraParams };
  return request('/app/fetch_topic_info', params);
}

/**
 * 获取话题作品列表/Get topic post list
 * GET /api/v1/lemon8/app/fetch_topic_post_list
 * @param {string, string, string} category, category_parameter, hashtag_name - 必填参数
 */
async function fetchTopicPostList(category, category_parameter, hashtag_name, extraParams = {}) {
  const params = { category, category_parameter, hashtag_name, ...extraParams };
  return request('/app/fetch_topic_post_list', params);
}

/**
 * 通过分享链接获取作品ID/Get post ID through sharing
 * GET /api/v1/lemon8/app/get_item_id
 * @param {string} share_text - 必填参数
 */
async function getItemId(share_text, extraParams = {}) {
  const params = { share_text, ...extraParams };
  return request('/app/get_item_id', params);
}

/**
 * 通过分享链接获取用户ID/Get user ID through sharing
 * GET /api/v1/lemon8/app/get_user_id
 * @param {string} share_text - 必填参数
 */
async function getUserId(share_text, extraParams = {}) {
  const params = { share_text, ...extraParams };
  return request('/app/get_user_id', params);
}

/**
 * 通过分享链接批量获取作品ID/Get post IDs in batch thr
 * POST /api/v1/lemon8/app/get_item_ids
 * 无必填参数
 */
async function getItemIds(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/get_item_ids', params, 'POST');
}

/**
 * 通过分享链接批量获取用户ID/Get user IDs in batch thr
 * POST /api/v1/lemon8/app/get_user_ids
 * 无必填参数
 */
async function getUserIds(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/get_user_ids', params, 'POST');
}

// ==================== 互 ====================

/**
 * 获取指定用户的粉丝列表/Get fans list of specified u
 * GET /api/v1/lemon8/app/fetch_user_follower_list
 * @param {string} user_id - 必填参数
 */
async function fetchUserFollowerList(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/app/fetch_user_follower_list', params);
}

/**
 * 获取指定用户的关注列表/Get following list of specif
 * GET /api/v1/lemon8/app/fetch_user_following_list
 * @param {string} user_id - 必填参数
 */
async function fetchUserFollowingList(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/app/fetch_user_following_list', params);
}

/**
 * 获取指定作品的评论列表/Get comments list of specifi
 * GET /api/v1/lemon8/app/fetch_post_comment_list
 * @param {string, string, string} group_id, item_id, media_id - 必填参数
 */
async function fetchPostCommentList(group_id, item_id, media_id, extraParams = {}) {
  const params = { group_id, item_id, media_id, ...extraParams };
  return request('/app/fetch_post_comment_list', params);
}

// ==================== 搜 ====================

/**
 * 获取热搜关键词/Get hot search keywords
 * GET /api/v1/lemon8/app/fetch_hot_search_keywords
 * 无必填参数
 */
async function fetchHotSearchKeywords(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_hot_search_keywords', params);
}

/**
 * 搜索接口/Search API
 * GET /api/v1/lemon8/app/fetch_search
 * @param {string} query - 必填参数
 */
async function fetchSearch(query, extraParams = {}) {
  const params = { query, ...extraParams };
  return request('/app/fetch_search', params);
}

module.exports = {
  request,
  fetchUserProfile,
  fetchPostDetail,
  fetchDiscoverBanners,
  fetchDiscoverTab,
  fetchDiscoverTabInformationTabs,
  fetchTopicInfo,
  fetchTopicPostList,
  getItemId,
  getUserId,
  getItemIds,
  getUserIds,
  fetchUserFollowerList,
  fetchUserFollowingList,
  fetchPostCommentList,
  fetchHotSearchKeywords,
  fetchSearch,
};
