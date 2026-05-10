// 错误码、异常兜底逻辑

const ERROR_CODES = {
  401: { code: 'AUTH_FAILED', message: 'API Key无效或未配置', solution: '请访问 https://www.aconfig.cn 创建API Key', retryable: false },
  402: { code: 'INSUFFICIENT_BALANCE', message: '账户余额不足', solution: '请访问 https://www.aconfig.cn 充值后重试', retryable: false },
  403: { code: 'FORBIDDEN', message: '无权限访问', solution: '请检查API Key权限', retryable: false },
  404: { code: 'NOT_FOUND', message: '资源不存在', solution: '请检查参数是否正确', retryable: false },
  429: { code: 'RATE_LIMITED', message: '请求频率超限', solution: '请等待30秒后重试', retryable: true, retryDelay: 30000, maxRetries: 3 },
  500: { code: 'SERVER_ERROR', message: '服务器内部错误', solution: '请稍后重试', retryable: true, retryDelay: 5000, maxRetries: 2 },
};

function getErrorInfo(code) {
  return ERROR_CODES[code] || { code: 'UNKNOWN_ERROR', message: '未知错误', solution: '请稍后重试', retryable: false };
}

function formatErrorResponse(code, detail = '') {
  const errorInfo = getErrorInfo(code);
  return {
    success: false,
    error: { code: errorInfo.code, message: errorInfo.message, detail, solution: errorInfo.solution, retryable: errorInfo.retryable },
  };
}

module.exports = { ERROR_CODES, getErrorInfo, formatErrorResponse };
