// 第三方接口请求封装 - xigua
// 基于MaxHub API中转站调用，包含所有API

const BASE_URL = process.env.MAXHUB_BASE_URL || 'https://www.aconfig.cn';
const API_KEY = process.env.MAXHUB_API_KEY;
const PLATFORM = 'xigua';

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
 * GET /api/v1/xigua/app/v2/fetch_one_video
 * @param {string} item_id - 必填参数
 */
async function fetchOneVideo(item_id, extraParams = {}) {
  const params = { item_id, ...extraParams };
  return request('/app/v2/fetch_one_video', params);
}

/**
 * 获取单个作品数据 V2/Get single video data V2
 * GET /api/v1/xigua/app/v2/fetch_one_video_v2
 * @param {string} item_id - 必填参数
 */
async function fetchOneVideoV2(item_id, extraParams = {}) {
  const params = { item_id, ...extraParams };
  return request('/app/v2/fetch_one_video_v2', params);
}

/**
 * 获取单个作品的播放链接/Get single video play URL
 * GET /api/v1/xigua/app/v2/fetch_one_video_play_url
 * @param {string} item_id - 必填参数
 */
async function fetchOneVideoPlayUrl(item_id, extraParams = {}) {
  const params = { item_id, ...extraParams };
  return request('/app/v2/fetch_one_video_play_url', params);
}

/**
 * 个人信息/Personal information
 * GET /api/v1/xigua/app/v2/fetch_user_info
 * @param {string} user_id - 必填参数
 */
async function fetchUserInfo(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/app/v2/fetch_user_info', params);
}

/**
 * 获取个人作品列表/Get user post list
 * GET /api/v1/xigua/app/v2/fetch_user_post_list
 * @param {string} user_id - 必填参数
 */
async function fetchUserPostList(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/app/v2/fetch_user_post_list', params);
}

// ==================== 互 ====================

/**
 * 视频评论列表/Video comment list
 * GET /api/v1/xigua/app/v2/fetch_video_comment_list
 * @param {string} item_id - 必填参数
 */
async function fetchVideoCommentList(item_id, extraParams = {}) {
  const params = { item_id, ...extraParams };
  return request('/app/v2/fetch_video_comment_list', params);
}

// ==================== 搜 ====================

/**
 * 搜索视频/Search video
 * GET /api/v1/xigua/app/v2/search_video
 * @param {string} keyword - 必填参数
 */
async function searchVideo(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app/v2/search_video', params);
}

module.exports = {
  request,
  fetchOneVideo,
  fetchOneVideoV2,
  fetchOneVideoPlayUrl,
  fetchUserInfo,
  fetchUserPostList,
  fetchVideoCommentList,
  searchVideo,
};
