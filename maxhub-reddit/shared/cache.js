// LRU缓存模块 - 支持TTL过期和容量限制
// 为API响应提供缓存层，减少重复调用

class LRUCache {
  constructor(options = {}) {
    this.maxSize = options.maxSize || 100;
    this.defaultTTL = options.defaultTTL || 5 * 60 * 1000;
    this.cache = new Map();
    this.stats = { hits: 0, misses: 0, evictions: 0 };
  }

  /**
   * 生成缓存键
   * @param {string} path - API路径
   * @param {object} params - 请求参数
   * @returns {string} 缓存键
   */
  _key(path, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(k => `${k}=${params[k]}`)
      .join('&');
    return `${path}?${sortedParams}`;
  }

  /**
   * 获取缓存
   * @param {string} path - API路径
   * @param {object} params - 请求参数
   * @returns {object|null} 缓存数据，过期或不存在返回null
   */
  get(path, params = {}) {
    const key = this._key(path, params);
    const entry = this.cache.get(key);
    if (!entry) {
      this.stats.misses++;
      return null;
    }
    if (Date.now() > entry.expireAt) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }
    this.cache.delete(key);
    this.cache.set(key, entry);
    this.stats.hits++;
    return entry.data;
  }

  /**
   * 设置缓存
   * @param {string} path - API路径
   * @param {object} params - 请求参数
   * @param {*} data - 缓存数据
   * @param {number} ttl - 过期时间（毫秒），默认使用defaultTTL
   */
  set(path, params = {}, data, ttl) {
    const key = this._key(path, params);
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
      this.stats.evictions++;
    }
    this.cache.set(key, {
      data,
      expireAt: Date.now() + (ttl || this.defaultTTL),
      createdAt: Date.now(),
    });
  }

  /**
   * 删除指定缓存
   */
  del(path, params = {}) {
    const key = this._key(path, params);
    return this.cache.delete(key);
  }

  /**
   * 清空所有缓存
   */
  clear() {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0, evictions: 0 };
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    const total = this.stats.hits + this.stats.misses;
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: total > 0 ? (this.stats.hits / total * 100).toFixed(1) + '%' : '0%',
      evictions: this.stats.evictions,
    };
  }

  /**
   * 清理所有过期缓存
   */
  prune() {
    const now = Date.now();
    for (const [key, entry] of this.cache) {
      if (now > entry.expireAt) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * 为API请求函数创建缓存包装器
 * @param {Function} requestFn - 原始请求函数
 * @param {LRUCache} cache - 缓存实例
 * @param {object} options - 缓存选项
 * @returns {Function} 包装后的请求函数
 */
function withCache(requestFn, cache, options = {}) {
  const ttlOverride = options.ttl || null;
  const cacheable = options.cacheable || (() => true);

  return async function cachedRequest(path, params = {}, method = 'GET') {
    if (method !== 'GET' || !cacheable(path, params)) {
      return requestFn(path, params, method);
    }
    const cached = cache.get(path, params);
    if (cached !== null) {
      return { ...cached, _fromCache: true };
    }
    const result = await requestFn(path, params, method);
    cache.set(path, params, result, ttlOverride || undefined);
    return result;
  };
}

module.exports = { LRUCache, withCache };
