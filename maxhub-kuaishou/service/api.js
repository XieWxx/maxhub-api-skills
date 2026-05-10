// 第三方接口请求封装 - 快手数据采集与分析
// 基于MaxHub API中转站调用快手数据采集与分析平台API

const BASE_URL = process.env.MAXHUB_BASE_URL || 'https://www.aconfig.cn';
const API_KEY = process.env.MAXHUB_API_KEY;
const PLATFORM = 'kuaishou';

/**
 * 通用API请求方法
 * @param {string} path - API路径
 * @param {object} params - 请求参数
 * @param {string} method - 请求方法 GET/POST
 * @returns {Promise<object>} API响应数据
 */
async function request(path, params = {}, method = 'GET') {
  const url = `${BASE_URL}/api/v1/${PLATFORM}${path}`;
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

  if (response.status === 401) {
    throw new Error('API Key无效或未配置，请访问 https://www.aconfig.cn 创建API Key');
  }
  if (response.status === 402) {
    throw new Error('账户余额不足，请访问 https://www.aconfig.cn 充值');
  }
  if (response.status === 429) {
    throw new Error('请求频率超限，请等待30秒后重试');
  }
  if (!response.ok) {
    throw new Error(data.message || `请求失败: ${response.status}`);
  }

  return data;
}

/**
 * 搜索内容
 */
async function search(keyword, page = 1, count = 20) {
  return request('/web/fetch_search_result', { keyword, page, count });
}

/**
 * 获取用户信息
 */
async function fetchUserProfile(params) {
  return request('/web/fetch_user_profile', params);
}

/**
 * 获取内容详情
 */
async function fetchDetail(id) {
  return request('/web/fetch_detail', { id });
}

/**
 * 获取热门/趋势数据
 */
async function fetchTrending() {
  return request('/web/fetch_trending');
}

/**
 * 获取评论数据
 */
async function fetchComments(id, page = 1, count = 20) {
  return request('/web/fetch_comments', { id, page, count });
}

module.exports = {
  request,
  search,
  fetchUserProfile,
  fetchDetail,
  fetchTrending,
  fetchComments,
};
