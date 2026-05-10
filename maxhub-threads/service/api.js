// 第三方接口请求封装 - threads
// 基于MaxHub API中转站调用，包含所有API

const BASE_URL = process.env.MAXHUB_BASE_URL || 'https://www.aconfig.cn';
const API_KEY = process.env.MAXHUB_API_KEY;
const PLATFORM = 'threads';

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
 * 获取用户信息/Get user info
 * GET /api/v1/threads/web/fetch_user_info
 * @param {string} username - 必填参数
 */
async function fetchUserInfo(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/web/fetch_user_info', params);
}

/**
 * 根据用户ID获取用户信息/Get user info by ID
 * GET /api/v1/threads/web/fetch_user_info_by_id
 * @param {string} user_id - 必填参数
 */
async function fetchUserInfoById(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/web/fetch_user_info_by_id', params);
}

/**
 * 获取用户帖子列表/Get user posts
 * GET /api/v1/threads/web/fetch_user_posts
 * @param {string} user_id - 必填参数
 */
async function fetchUserPosts(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/web/fetch_user_posts', params);
}

/**
 * 获取用户转发列表/Get user reposts
 * GET /api/v1/threads/web/fetch_user_reposts
 * @param {string} user_id - 必填参数
 */
async function fetchUserReposts(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/web/fetch_user_reposts', params);
}

/**
 * 获取用户回复列表/Get user replies
 * GET /api/v1/threads/web/fetch_user_replies
 * @param {string} user_id - 必填参数
 */
async function fetchUserReplies(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/web/fetch_user_replies', params);
}

/**
 * 获取帖子详情/Get post detail
 * GET /api/v1/threads/web/fetch_post_detail
 * @param {string} post_id - 必填参数
 */
async function fetchPostDetail(post_id, extraParams = {}) {
  const params = { post_id, ...extraParams };
  return request('/web/fetch_post_detail', params);
}

/**
 * 获取帖子详情 V2(支持链接)/Get post detail V2(suppo
 * GET /api/v1/threads/web/fetch_post_detail_v2
 * 无必填参数
 */
async function fetchPostDetailV2(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_post_detail_v2', params);
}

// ==================== 互 ====================

/**
 * 获取帖子评论/Get post comments
 * GET /api/v1/threads/web/fetch_post_comments
 * @param {string} post_id - 必填参数
 */
async function fetchPostComments(post_id, extraParams = {}) {
  const params = { post_id, ...extraParams };
  return request('/web/fetch_post_comments', params);
}

// ==================== 搜 ====================

/**
 * 搜索热门内容/Search top content
 * GET /api/v1/threads/web/search_top
 * @param {string} query - 必填参数
 */
async function searchTop(query, extraParams = {}) {
  const params = { query, ...extraParams };
  return request('/web/search_top', params);
}

/**
 * 搜索最新内容/Search recent content
 * GET /api/v1/threads/web/search_recent
 * @param {string} query - 必填参数
 */
async function searchRecent(query, extraParams = {}) {
  const params = { query, ...extraParams };
  return request('/web/search_recent', params);
}

/**
 * 搜索用户档案/Search profiles
 * GET /api/v1/threads/web/search_profiles
 * @param {string} query - 必填参数
 */
async function searchProfiles(query, extraParams = {}) {
  const params = { query, ...extraParams };
  return request('/web/search_profiles', params);
}

module.exports = {
  request,
  fetchUserInfo,
  fetchUserInfoById,
  fetchUserPosts,
  fetchUserReposts,
  fetchUserReplies,
  fetchPostDetail,
  fetchPostDetailV2,
  fetchPostComments,
  searchTop,
  searchRecent,
  searchProfiles,
};
