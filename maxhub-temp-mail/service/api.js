// 第三方接口请求封装 - temp-mail
// 基于MaxHub API中转站调用，包含所有API

const BASE_URL = process.env.MAXHUB_BASE_URL || 'https://www.aconfig.cn';
const API_KEY = process.env.MAXHUB_API_KEY;
const PLATFORM = 'temp-mail';

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
 * Get Temp Email
 * GET /api/v1/temp_mail/v1/get_temp_email_address
 * 无必填参数
 */
async function getTempEmailAddress(extraParams = {}) {
  const params = { ...extraParams };
  return request('/api/v1/temp_mail/v1/get_temp_email_address', params);
}

/**
 * Get Emails
 * GET /api/v1/temp_mail/v1/get_emails_inbox
 * @param {string} token - 必填参数
 */
async function getEmailsInbox(token, extraParams = {}) {
  const params = { token, ...extraParams };
  return request('/api/v1/temp_mail/v1/get_emails_inbox', params);
}

/**
 * Get Email By Id
 * GET /api/v1/temp_mail/v1/get_email_by_id
 * @param {string, string} token, message_id - 必填参数
 */
async function getEmailById(token, message_id, extraParams = {}) {
  const params = { token, message_id, ...extraParams };
  return request('/api/v1/temp_mail/v1/get_email_by_id', params);
}

module.exports = {
  request,
  getTempEmailAddress,
  getEmailsInbox,
  getEmailById,
};
