// 第三方接口请求封装 - toutiao
// 基于MaxHub API中转站调用，包含所有API

const BASE_URL = process.env.MAXHUB_BASE_URL || 'https://www.aconfig.cn';
const API_KEY = process.env.MAXHUB_API_KEY;
const PLATFORM = 'toutiao';

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
 * 获取指定文章的信息/Get information of specified a
 * GET /api/v1/toutiao/web/get_article_info
 * @param {string} aweme_id - 必填参数
 */
async function getArticleInfo(aweme_id, extraParams = {}) {
  const params = { aweme_id, ...extraParams };
  return request('/web/get_article_info', params);
}

/**
 * 获取指定视频的信息/Get information of specified v
 * GET /api/v1/toutiao/web/get_video_info
 * @param {string} aweme_id - 必填参数
 */
async function getVideoInfo(aweme_id, extraParams = {}) {
  const params = { aweme_id, ...extraParams };
  return request('/web/get_video_info', params);
}

/**
 * 获取指定文章的信息/Get information of specified a
 * GET /api/v1/toutiao/app/get_article_info
 * @param {string} group_id - 必填参数
 */
async function getArticleInfo(group_id, extraParams = {}) {
  const params = { group_id, ...extraParams };
  return request('/app/get_article_info', params);
}

/**
 * 获取指定视频的信息/Get information of specified v
 * GET /api/v1/toutiao/app/get_video_info
 * @param {string} group_id - 必填参数
 */
async function getVideoInfo(group_id, extraParams = {}) {
  const params = { group_id, ...extraParams };
  return request('/app/get_video_info', params);
}

/**
 * 获取指定用户的信息/Get information of specified u
 * GET /api/v1/toutiao/app/get_user_info
 * @param {string} user_id - 必填参数
 */
async function getUserInfo(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/app/get_user_info', params);
}

/**
 * 从头条用户主页获取用户user_id/Get user_id from user
 * GET /api/v1/toutiao/app/get_user_id
 * @param {string} user_profile_url - 必填参数
 */
async function getUserId(user_profile_url, extraParams = {}) {
  const params = { user_profile_url, ...extraParams };
  return request('/app/get_user_id', params);
}

// ==================== 互 ====================

/**
 * 获取指定作品的评论/Get comments of specified post
 * GET /api/v1/toutiao/app/get_comments
 * @param {string, string} group_id, offset - 必填参数
 */
async function getComments(group_id, offset, extraParams = {}) {
  const params = { group_id, offset, ...extraParams };
  return request('/app/get_comments', params);
}

module.exports = {
  request,
  getArticleInfo,
  getVideoInfo,
  getArticleInfo,
  getVideoInfo,
  getUserInfo,
  getUserId,
  getComments,
};
