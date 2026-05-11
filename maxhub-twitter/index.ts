// 技能入口主文件 - Twitter/X数据采集与分析
// 统一导出所有模块，供各平台调用

const config = require('./config.json');
const manifest = require('./manifest.json');
const api = require('./service/api');
const data = require('./service/data');
const utils = require('./service/utils');
const router = require('./core/router');
const errorCode = require('./core/error-code');

/**
 * Skill入口函数
 * @param {string} intent - 用户意图
 * @param {object} params - 请求参数
 * @returns {Promise<object>} 处理结果
 */
async function handle(intent, params = {}) {
  try {
    if (!intent) return errorCode.formatErrorResponse('PARAM_MISSING', '缺少意图参数');
    if (!config.requires?.primaryEnv) return errorCode.formatErrorResponse(401, '未配置API密钥，请在平台设置中配置MAXHUB_API_KEY');
    return await router.dispatch(intent, params);
  } catch (error) {
    const statusCode = error.message?.match(/(\d{3})/)?.[1];
    return errorCode.formatErrorResponse(statusCode ? parseInt(statusCode) : 'UNKNOWN_ERROR', error.message);
  }
}

module.exports = { handle, config, manifest, api, data, utils, router, errorCode };
