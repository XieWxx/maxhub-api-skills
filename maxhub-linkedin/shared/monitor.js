// 性能监控模块 - 调用统计、费用追踪、耗时分析
// 实时监控API调用链路，提供优化建议

/**
 * API调用记录
 * @typedef {Object} CallRecord
 * @property {string} apiName - API名称
 * @property {string} path - API路径
 * @property {number} cost - 调用费用（CNY）
 * @property {number} duration - 耗时（毫秒）
 * @property {number} timestamp - 调用时间戳
 * @property {boolean} success - 是否成功
 * @property {boolean} fromCache - 是否来自缓存
 */

class PerformanceMonitor {
  constructor(options = {}) {
    this.maxRecords = options.maxRecords || 1000;
    this.costAlertThreshold = options.costAlertThreshold || 1.0;
    this.records = [];
    this.sessionStats = {
      totalCalls: 0,
      totalCost: 0,
      totalDuration: 0,
      cacheHits: 0,
      errors: 0,
    };
    this.apiStats = new Map();
    this.alerts = [];
  }

  /**
   * 记录一次API调用
   * @param {Object} info - 调用信息
   * @param {string} info.apiName - API名称
   * @param {string} info.path - API路径
   * @param {number} info.price - 单次调用价格（CNY）
   * @param {number} info.duration - 耗时（毫秒）
   * @param {boolean} info.success - 是否成功
   * @param {boolean} info.fromCache - 是否来自缓存
   * @param {boolean} info.deduped - 是否被去重
   */
  record(info) {
    const actualCost = (info.fromCache || info.deduped) ? 0 : (info.price || 0);
    const record = {
      apiName: info.apiName,
      path: info.path,
      price: info.price || 0,
      cost: actualCost,
      duration: info.duration || 0,
      timestamp: Date.now(),
      success: info.success !== false,
      fromCache: !!info.fromCache,
      deduped: !!info.deduped,
    };

    this.records.push(record);
    if (this.records.length > this.maxRecords) {
      this.records.shift();
    }

    this.sessionStats.totalCalls++;
    this.sessionStats.totalCost += actualCost;
    this.sessionStats.totalDuration += record.duration;
    if (info.fromCache) this.sessionStats.cacheHits++;
    if (!record.success) this.sessionStats.errors++;

    this._updateApiStats(record);
    this._checkCostAlert(record);

    return record;
  }

  /**
   * 更新单个API的统计信息
   */
  _updateApiStats(record) {
    if (!this.apiStats.has(record.path)) {
      this.apiStats.set(record.path, {
        calls: 0,
        cost: 0,
        duration: 0,
        errors: 0,
        cacheHits: 0,
      });
    }
    const stats = this.apiStats.get(record.path);
    stats.calls++;
    stats.cost += record.cost;
    stats.duration += record.duration;
    if (!record.success) stats.errors++;
    if (record.fromCache) stats.cacheHits++;
  }

  /**
   * 检查费用告警
   */
  _checkCostAlert(record) {
    if (this.sessionStats.totalCost >= this.costAlertThreshold) {
      const alert = {
        type: 'cost_threshold',
        message: `累计费用 ¥${this.sessionStats.totalCost.toFixed(4)} 已超过阈值 ¥${this.costAlertThreshold}`,
        totalCost: this.sessionStats.totalCost,
        threshold: this.costAlertThreshold,
        timestamp: Date.now(),
      };
      this.alerts.push(alert);
      this.costAlertThreshold *= 2;
    }
  }

  /**
   * 获取会话统计概览
   */
  getSessionStats() {
    return {
      ...this.sessionStats,
      avgDuration: this.sessionStats.totalCalls > 0
        ? (this.sessionStats.totalDuration / this.sessionStats.totalCalls).toFixed(0)
        : 0,
      cacheHitRate: this.sessionStats.totalCalls > 0
        ? (this.sessionStats.cacheHits / this.sessionStats.totalCalls * 100).toFixed(1) + '%'
        : '0%',
      errorRate: this.sessionStats.totalCalls > 0
        ? (this.sessionStats.errors / this.sessionStats.totalCalls * 100).toFixed(1) + '%'
        : '0%',
    };
  }

  /**
   * 获取按API分组的统计信息
   * @param {string} sortBy - 排序字段：cost/calls/duration
   * @param {number} limit - 返回数量
   */
  getApiStats(sortBy = 'cost', limit = 20) {
    const entries = Array.from(this.apiStats.entries())
      .map(([path, stats]) => ({
        path,
        ...stats,
        avgDuration: stats.calls > 0 ? (stats.duration / stats.calls).toFixed(0) : 0,
        costPerCall: stats.calls > 0 ? (stats.cost / stats.calls).toFixed(4) : 0,
      }))
      .sort((a, b) => b[sortBy] - a[sortBy]);
    return entries.slice(0, limit);
  }

  /**
   * 获取费用最高的API列表
   */
  getTopCostApis(limit = 10) {
    return this.getApiStats('cost', limit);
  }

  /**
   * 获取最慢的API列表
   */
  getSlowestApis(limit = 10) {
    return this.getApiStats('avgDuration', limit);
  }

  /**
   * 获取最近的告警
   */
  getAlerts() {
    return this.alerts.slice(-10);
  }

  /**
   * 生成调用报告
   */
  getReport() {
    return {
      session: this.getSessionStats(),
      topCostApis: this.getTopCostApis(5),
      slowestApis: this.getSlowestApis(5),
      recentAlerts: this.getAlerts(),
      optimizationSuggestions: this._generateSuggestions(),
    };
  }

  /**
   * 生成优化建议
   */
  _generateSuggestions() {
    const suggestions = [];
    const stats = this.getSessionStats();

    if (parseFloat(stats.cacheHitRate) < 20 && this.sessionStats.totalCalls > 5) {
      suggestions.push({
        type: 'cache',
        message: '缓存命中率偏低，建议增加缓存TTL或扩大缓存容量',
        impact: '可减少重复调用费用',
      });
    }

    const topCost = this.getTopCostApis(3);
    for (const api of topCost) {
      if (api.calls > 3) {
        suggestions.push({
          type: 'dedup',
          message: `${api.path} 被调用 ${api.calls} 次，建议检查是否存在冗余调用`,
          impact: `可节省 ¥${(api.cost * 0.3).toFixed(4)}`,
        });
      }
    }

    if (this.sessionStats.errors > 2) {
      suggestions.push({
        type: 'reliability',
        message: `错误率 ${stats.errorRate}，建议增加重试机制或检查参数`,
        impact: '提升调用成功率',
      });
    }

    return suggestions;
  }

  /**
   * 重置会话统计
   */
  reset() {
    this.records = [];
    this.sessionStats = {
      totalCalls: 0,
      totalCost: 0,
      totalDuration: 0,
      cacheHits: 0,
      errors: 0,
    };
    this.apiStats.clear();
    this.alerts = [];
  }
}

/**
 * 为请求函数创建监控包装器
 * @param {Function} requestFn - 原始请求函数
 * @param {PerformanceMonitor} monitor - 监控实例
 * @param {object} registry - API注册表（用于查找价格）
 * @param {string} apiPrefix - API路径前缀
 */
function withMonitor(requestFn, monitor, registry, apiPrefix) {
  return async function monitoredRequest(path, params = {}, method = 'GET') {
    const startTime = Date.now();
    let success = true;
    let result;

    const apiName = _findApiName(registry, path);
    const price = _findPrice(registry, path);

    try {
      result = await requestFn(path, params, method);
    } catch (error) {
      success = false;
      throw error;
    } finally {
      const duration = Date.now() - startTime;
      monitor.record({
        apiName,
        path: `${apiPrefix}${path}`,
        price,
        duration,
        success,
        fromCache: !!result?._fromCache,
        deduped: !!result?._deduped,
      });
    }
    return result;
  };
}

function _findApiName(registry, path) {
  if (!registry) return 'unknown';
  for (const [name, def] of Object.entries(registry)) {
    if (def.path === path) return name;
  }
  return 'unknown';
}

function _findPrice(registry, path) {
  if (!registry) return 0;
  for (const def of Object.values(registry)) {
    if (def.path === path) return def.price || 0;
  }
  return 0;
}

module.exports = { PerformanceMonitor, withMonitor };
