// 技能入口主文件 - 微博数据采集与分析
// 统一导出所有模块，供各平台调用
// 集成优化层与智能决策，支持报告查询、价格查询、方案决策

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
    const apiKey = (typeof process !== 'undefined' && process.env?.[config.requires?.primaryEnv]) || '';
    if (!apiKey) return errorCode.formatErrorResponse(401, '未配置API密钥，请在平台设置中配置MAXHUB_API_KEY');
    return await router.dispatch(intent, params);
  } catch (error) {
    const statusCode = error.message?.match(/(\d{3})/)?.[1];
    return errorCode.formatErrorResponse(statusCode ? parseInt(statusCode) : 'UNKNOWN_ERROR', error.message);
  }
}

/**
 * 获取优化报告
 * 包含缓存命中率、费用统计、优化建议等
 * @returns {object} 优化报告
 */
function getReport() {
  return api.getOptimizationReport();
}

/**
 * 查询API价格
 * @param {string} apiName - API名称（可选，不传则返回全部）
 * @returns {object|Array} 价格信息
 */
function queryPrice(apiName) {
  if (apiName) return api.getApiPrice(apiName);
  return api.getAllPrices();
}

/**
 * 智能决策接口
 * 根据意图和参数，自动选择最优API方案
 * @param {string} intentType - 意图类型
 * @param {object} params - 用户参数
 * @returns {object} 决策结果，包含选中方案和备选方案
 */
function decide(intentType, params = {}) {
  return router.decideBestApi(intentType, params);
}

/**
 * 多方案费用对比
 * @param {string} intentType - 意图类型
 * @param {number} callCount - 预估调用次数
 * @returns {Array} 按费用排序的方案列表
 */
function compareCosts(intentType, callCount = 1) {
  return router.compareCosts(intentType, callCount);
}

module.exports = {
  handle,
  config,
  manifest,
  api,
  data,
  utils,
  router,
  errorCode,
  getReport,
  queryPrice,
  decide,
  compareCosts,
};
