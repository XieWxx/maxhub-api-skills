// 工具函数 - 正则/时间/校验
// 通用工具函数，供api.js和data.js调用

/**
 * 验证API Key格式
 */
function validateApiKey(apiKey) {
  if (!apiKey) return false;
  return /^mh_sk_[a-f0-9]{40,}$/.test(apiKey);
}

/**
 * 延迟函数
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 重试函数
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
  validateApiKey,
  sleep,
  retry,
};
