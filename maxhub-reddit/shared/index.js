// 共享模块统一入口
// 提供缓存、优化、监控、决策、价格查询的统一导出

const { LRUCache, withCache } = require('./cache');
const { RequestDeduplicator, RequestBatcher, RedundancyFilter, createOptimizer } = require('./optimizer');
const { PerformanceMonitor, withMonitor } = require('./monitor');
const { DecisionEngine, withDecision } = require('./decision');
const pricingService = require('./pricing-service');

/**
 * 为skill创建完整的优化层
 * 一站式初始化缓存、优化器、监控器、决策引擎
 * @param {object} options - 配置选项
 * @param {object} options.registry - API注册表
 * @param {string} options.apiPrefix - API路径前缀
 * @param {object} options.cache - 缓存配置 { maxSize, defaultTTL }
 * @param {object} options.optimizer - 优化器配置 { redundancyWindow }
 * @param {object} options.monitor - 监控配置 { costAlertThreshold }
 * @param {object} options.decision - 决策配置 { costWeight, latencyWeight }
 * @param {string} options.pricingFile - pricing.md文件路径
 * @returns {object} 完整优化层实例
 */
function createOptimizationLayer(options = {}) {
  const registry = options.registry || {};
  const apiPrefix = options.apiPrefix || '';

  if (options.pricingFile) {
    try {
      pricingService.init(options.pricingFile);
      pricingService.injectPrices(registry, apiPrefix);
    } catch (e) {
      _injectFromRegistry(registry, apiPrefix);
    }
  } else {
    _injectFromRegistry(registry, apiPrefix);
  }

  const cache = new LRUCache({
    maxSize: options.cache?.maxSize || 100,
    defaultTTL: options.cache?.defaultTTL || 5 * 60 * 1000,
  });

  const optimizer = createOptimizer({
    redundancyWindow: options.optimizer?.redundancyWindow || 30000,
  });

  const monitor = new PerformanceMonitor({
    costAlertThreshold: options.monitor?.costAlertThreshold || 1.0,
  });

  const decision = new DecisionEngine({
    registry,
    apiPrefix,
    costWeight: options.decision?.costWeight || 0.6,
    latencyWeight: options.decision?.latencyWeight || 0.25,
    completenessWeight: options.decision?.completenessWeight || 0.15,
  });

  return {
    cache,
    optimizer,
    monitor,
    decision,
    pricingService,

    /**
     * 创建增强版请求函数
     * 集成缓存、去重、监控的完整请求链路
     * @param {Function} originalRequest - 原始request函数
     * @returns {Function} 增强后的请求函数
     */
    enhanceRequest(originalRequest) {
      return async function enhancedRequest(path, params = {}, method = 'GET') {
        return optimizer.execute(
          path, params, method,
          () => {
            const startTime = Date.now();
            let success = true;

            const monitoredFn = originalRequest(path, params, method);
            return monitoredFn
              .then(result => {
                const duration = Date.now() - startTime;
                const apiName = _findApiName(registry, path);
                const price = _findPrice(registry, path);
                monitor.record({
                  apiName,
                  path: `${apiPrefix}${path}`,
                  price,
                  duration,
                  success: true,
                  fromCache: !!result?._fromCache,
                });
                return result;
              })
              .catch(error => {
                const duration = Date.now() - startTime;
                const apiName = _findApiName(registry, path);
                const price = _findPrice(registry, path);
                monitor.record({
                  apiName,
                  path: `${apiPrefix}${path}`,
                  price,
                  duration,
                  success: false,
                });
                throw error;
              });
          },
          cache
        );
      };
    },

    /**
     * 获取完整的优化报告
     */
    getReport() {
      return {
        cache: cache.getStats(),
        optimizer: optimizer.getStats(),
        monitor: monitor.getReport(),
        decision: {
          weights: decision.getWeights(),
          historySize: decision.callHistory.length,
        },
        pricing: _registryPricingStats(registry),
      };
    },
  };
}

function _findApiName(registry, path) {
  for (const [name, def] of Object.entries(registry)) {
    if (def.path === path) return name;
  }
  return 'unknown';
}

function _findPrice(registry, path) {
  for (const def of Object.values(registry)) {
    if (def.path === path) return def.price || 0;
  }
  return 0;
}

/**
 * 从registry自身构建价格数据（无需外部pricing.md）
 */
function _injectFromRegistry(registry, apiPrefix) {
  for (const def of Object.values(registry)) {
    if (def.price === undefined) def.price = 0;
  }
}

/**
 * 从registry统计价格信息
 */
function _registryPricingStats(registry) {
  let total = 0;
  let free = 0;
  let paid = 0;
  let sumCny = 0;
  for (const def of Object.values(registry)) {
    total++;
    if (!def.price || def.price === 0) free++;
    else { paid++; sumCny += def.price; }
  }
  return {
    total,
    free,
    paid,
    avgCny: paid > 0 ? (sumCny / paid).toFixed(4) : 0,
    source: 'registry',
  };
}

module.exports = {
  createOptimizationLayer,
  LRUCache,
  withCache,
  RequestDeduplicator,
  RequestBatcher,
  RedundancyFilter,
  createOptimizer,
  PerformanceMonitor,
  withMonitor,
  DecisionEngine,
  withDecision,
  pricingService,
};
