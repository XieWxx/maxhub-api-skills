// 工具函数 - 正则/时间/校验
// 通用工具函数，供api.js和data.js调用

/**
 * 从URL中提取抖音视频ID
 * @param {string} url - 抖音分享链接
 * @returns {string|null} 视频ID
 */
function extractVideoId(url) {
  if (!url) return null;
  const patterns = [
    /video\/(\d+)/,
    /aweme_id=(\d+)/,
    /modal_id=(\d+)/,
    /\/(\d{19})\//,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * 从URL中提取用户sec_user_id
 * @param {string} url - 抖音用户主页链接
 * @returns {string|null} sec_user_id
 */
function extractSecUserId(url) {
  if (!url) return null;
  const patterns = [
    /user\/(MS4wLjABAAAA[\w-]+)/,
    /sec_user_id=(MS4wLjABAAAA[\w-]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * 从URL中提取直播间号
 * @param {string} url - 抖音直播链接
 * @returns {string|null} webcast_id
 */
function extractWebcastId(url) {
  if (!url) return null;
  const patterns = [
    /live\/(\d+)/,
    /webcast_id=(\d+)/,
    /room_id=(\d+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * 验证API Key格式
 * @param {string} apiKey - API Key
 * @returns {boolean} 是否有效
 */
function validateApiKey(apiKey) {
  if (!apiKey) return false;
  return /^mh_sk_[a-f0-9]{40,}$/.test(apiKey);
}

/**
 * 验证抖音号格式
 * @param {string} uniqueId - 抖音号
 * @returns {boolean} 是否有效
 */
function validateUniqueId(uniqueId) {
  if (!uniqueId) return false;
  return /^[a-zA-Z0-9._-]{2-24}$/.test(uniqueId);
}

/**
 * 验证UID格式
 * @param {string} uid - 用户UID
 * @returns {boolean} 是否有效
 */
function validateUid(uid) {
  if (!uid) return false;
  return /^\d{5,20}$/.test(uid);
}

/**
 * 延迟函数
 * @param {number} ms - 延迟毫秒数
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 重试函数
 * @param {Function} fn - 需要重试的异步函数
 * @param {number} maxRetries - 最大重试次数
 * @param {number} delay - 重试间隔（毫秒）
 */
async function retry(fn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      if (error.message?.includes('429')) {
        await sleep(delay * (i + 1) * 2);
      } else {
        await sleep(delay);
      }
    }
  }
}

module.exports = {
  extractVideoId,
  extractSecUserId,
  extractWebcastId,
  validateApiKey,
  validateUniqueId,
  validateUid,
  sleep,
  retry,
};
