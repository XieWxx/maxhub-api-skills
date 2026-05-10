// 错误码、异常兜底逻辑 - 抖音平台

const ERROR_CODES = {
  // HTTP 状态码错误
  401: {
    code: 'AUTH_FAILED',
    message: 'API Key无效或未配置',
    solution: '请访问 https://www.aconfig.cn 创建API Key，并配置到环境变量 MAXHUB_API_KEY',
    retryable: false,
  },
  402: {
    code: 'INSUFFICIENT_BALANCE',
    message: '账户余额不足',
    solution: '请访问 https://www.aconfig.cn 充值后重试',
    retryable: false,
  },
  403: {
    code: 'FORBIDDEN',
    message: '无权限访问该资源',
    solution: '请检查API Key权限或联系客服',
    retryable: false,
  },
  404: {
    code: 'NOT_FOUND',
    message: '资源不存在',
    solution: '请检查参数是否正确，或该资源已被删除',
    retryable: false,
  },
  429: {
    code: 'RATE_LIMITED',
    message: '请求频率超限',
    solution: '请等待30秒后重试',
    retryable: true,
    retryDelay: 30000,
    maxRetries: 3,
  },
  500: {
    code: 'SERVER_ERROR',
    message: '服务器内部错误',
    solution: '请稍后重试，如持续出现请联系客服',
    retryable: true,
    retryDelay: 5000,
    maxRetries: 2,
  },
  502: {
    code: 'BAD_GATEWAY',
    message: '网关错误',
    solution: '请稍后重试',
    retryable: true,
    retryDelay: 5000,
    maxRetries: 2,
  },
  503: {
    code: 'SERVICE_UNAVAILABLE',
    message: '服务暂不可用',
    solution: '请稍后重试',
    retryable: true,
    retryDelay: 10000,
    maxRetries: 3,
  },

  // 业务逻辑错误
  VIDEO_NOT_FOUND: {
    code: 'VIDEO_NOT_FOUND',
    message: '视频不存在或已被删除',
    solution: '请检查视频ID是否正确',
    retryable: false,
  },
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: '用户不存在',
    solution: '请检查用户ID或抖音号是否正确',
    retryable: false,
  },
  LIVE_NOT_ONLINE: {
    code: 'LIVE_NOT_ONLINE',
    message: '该用户当前未在直播',
    solution: '请确认用户直播状态后重试',
    retryable: false,
  },
  PARAM_MISSING: {
    code: 'PARAM_MISSING',
    message: '缺少必要参数',
    solution: '请提供完整的必填参数',
    retryable: false,
  },
};

/**
 * 获取错误信息
 * @param {number|string} code - 错误码
 * @returns {object} 错误信息
 */
function getErrorInfo(code) {
  return ERROR_CODES[code] || {
    code: 'UNKNOWN_ERROR',
    message: '未知错误',
    solution: '请稍后重试或联系客服',
    retryable: false,
  };
}

/**
 * 格式化错误响应
 * @param {number|string} code - 错误码
 * @param {string} detail - 错误详情
 * @returns {object} 格式化的错误响应
 */
function formatErrorResponse(code, detail = '') {
  const errorInfo = getErrorInfo(code);
  return {
    success: false,
    error: {
      code: errorInfo.code,
      message: errorInfo.message,
      detail,
      solution: errorInfo.solution,
      retryable: errorInfo.retryable,
    },
  };
}

module.exports = {
  ERROR_CODES,
  getErrorInfo,
  formatErrorResponse,
};
