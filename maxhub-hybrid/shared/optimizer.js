// 请求优化模块 - 智能去重、请求合并、调用链优化
// 减少冗余API调用，提升调用效率

/**
 * 请求去重器
 * 同一API+参数的并发请求自动合并为一次调用
 */
class RequestDeduplicator {
  constructor() {
    this.pending = new Map();
    this.stats = { deduped: 0, total: 0 };
  }

  /**
   * 生成去重键
   */
  _key(path, params = {}, method = 'GET') {
    const sortedParams = Object.keys(params)
      .sort()
      .map(k => `${k}=${params[k]}`)
      .join('&');
    return `${method}:${path}?${sortedParams}`;
  }

  /**
   * 去重执行请求
   * 如果相同请求正在执行中，复用其Promise
   * @param {string} key - 去重键
   * @param {Function} execFn - 实际执行函数
   * @returns {Promise} 请求结果
   */
  async dedupe(path, params, method, execFn) {
    this.stats.total++;
    const key = this._key(path, params, method);
    if (this.pending.has(key)) {
      this.stats.deduped++;
      return this.pending.get(key);
    }
    const promise = execFn().finally(() => {
      this.pending.delete(key);
    });
    this.pending.set(key, promise);
    return promise;
  }

  getStats() {
    return {
      ...this.stats,
      dedupeRate: this.stats.total > 0
        ? (this.stats.deduped / this.stats.total * 100).toFixed(1) + '%'
        : '0%',
      pendingCount: this.pending.size,
    };
  }
}

/**
 * 批量请求合并器
 * 将短时间内的多个单条请求合并为批量请求
 */
class RequestBatcher {
  constructor(options = {}) {
    this.batchWindow = options.batchWindow || 50;
    this.maxBatchSize = options.maxBatchSize || 10;
    this.queues = new Map();
    this.stats = { batched: 0, batches: 0 };
  }

  /**
   * 添加请求到批量队列
   * @param {string} batchKey - 批量队列标识（如API路径前缀）
   * @param {*} item - 请求参数
   * @param {Function} batchFn - 批量执行函数，接收items数组
   * @returns {Promise} 单个请求的结果
   */
  add(batchKey, item, batchFn) {
    if (!this.queues.has(batchKey)) {
      this.queues.set(batchKey, { items: [], timer: null, fn: batchFn });
    }
    const queue = this.queues.get(batchKey);
    return new Promise((resolve, reject) => {
      queue.items.push({ item, resolve, reject });
      this.stats.batched++;
      if (queue.items.length >= this.maxBatchSize) {
        this._flush(batchKey);
      } else if (!queue.timer) {
        queue.timer = setTimeout(() => this._flush(batchKey), this.batchWindow);
      }
    });
  }

  /**
   * 刷新批量队列，执行合并请求
   */
  async _flush(batchKey) {
    const queue = this.queues.get(batchKey);
    if (!queue || queue.items.length === 0) return;
    if (queue.timer) {
      clearTimeout(queue.timer);
      queue.timer = null;
    }
    const batch = queue.items.splice(0, queue.items.length);
    this.stats.batches++;
    try {
      const items = batch.map(b => b.item);
      const results = await queue.fn(items);
      if (Array.isArray(results)) {
        batch.forEach((b, i) => {
          b.resolve(results[i]);
        });
      } else {
        batch.forEach(b => b.resolve(results));
      }
    } catch (error) {
      batch.forEach(b => b.reject(error));
    }
  }

  getStats() {
    return {
      ...this.stats,
      avgBatchSize: this.stats.batches > 0
        ? (this.stats.batched / this.stats.batches).toFixed(1)
        : '0',
    };
  }
}

/**
 * 冗余调用过滤器
 * 识别并过滤不必要的API调用
 */
class RedundancyFilter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 60000;
    this.callHistory = new Map();
    this.stats = { filtered: 0, total: 0 };
  }

  /**
   * 检查是否为冗余调用
   * 在时间窗口内相同API+参数的重复调用视为冗余
   * @param {string} path - API路径
   * @param {object} params - 请求参数
   * @returns {boolean} 是否冗余
   */
  isRedundant(path, params = {}) {
    this.stats.total++;
    const key = `${path}:${JSON.stringify(params)}`;
    const now = Date.now();
    const lastCall = this.callHistory.get(key);
    if (lastCall && (now - lastCall) < this.windowMs) {
      this.stats.filtered++;
      return true;
    }
    this.callHistory.set(key, now);
    this._prune(now);
    return false;
  }

  /**
   * 清理过期记录
   */
  _prune(now) {
    if (this.callHistory.size > 1000) {
      for (const [key, ts] of this.callHistory) {
        if (now - ts > this.windowMs) {
          this.callHistory.delete(key);
        }
      }
    }
  }

  getStats() {
    return {
      ...this.stats,
      filterRate: this.stats.total > 0
        ? (this.stats.filtered / this.stats.total * 100).toFixed(1) + '%'
        : '0%',
    };
  }
}

/**
 * 创建优化包装器
 * 将去重、过滤、缓存整合为统一的请求优化层
 */
function createOptimizer(options = {}) {
  const deduplicator = new RequestDeduplicator();
  const redundancyFilter = new RedundancyFilter({
    windowMs: options.redundancyWindow || 30000,
  });

  return {
    deduplicator,
    redundancyFilter,

    /**
     * 优化后的请求执行
     * @param {string} path - API路径
     * @param {object} params - 请求参数
     * @param {string} method - 请求方法
     * @param {Function} execFn - 实际执行函数
     * @param {object} cache - 缓存实例（可选）
     * @returns {Promise} 请求结果
     */
    async execute(path, params, method, execFn, cache = null) {
      if (method === 'GET' && cache) {
        const cached = cache.get(path, params);
        if (cached !== null) {
          return { ...cached, _fromCache: true, _cost: 0 };
        }
      }
      if (method === 'GET' && redundancyFilter.isRedundant(path, params)) {
        if (cache) {
          const cached = cache.get(path, params);
          if (cached !== null) {
            return { ...cached, _fromCache: true, _redundant: true, _cost: 0 };
          }
        }
      }
      const result = await deduplicator.dedupe(path, params, method, execFn);
      if (method === 'GET' && cache) {
        cache.set(path, params, result);
      }
      return result;
    },

    getStats() {
      return {
        deduplicator: deduplicator.getStats(),
        redundancyFilter: redundancyFilter.getStats(),
      };
    },
  };
}

module.exports = {
  RequestDeduplicator,
  RequestBatcher,
  RedundancyFilter,
  createOptimizer,
};
