// 价格查询服务 - 从pricing.md解析价格数据，提供API价格查询
// 支持按完整路径或前缀+相对路径查询

const fs = require('fs');
const path = require('path');

let _pricingMap = null;
let _pricingPath = null;

/**
 * 解析pricing.md文件，构建价格映射表
 * @param {string} filePath - pricing.md文件路径
 * @returns {Map<string, object>} 价格映射表 key=API路径
 */
function parsePricingFile(filePath) {
  const map = new Map();
  if (!fs.existsSync(filePath)) return map;

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|') || trimmed.startsWith('| 接口') || trimmed.startsWith('| ---') || trimmed.startsWith('| 统计') || trimmed.startsWith('| 指标')) {
      continue;
    }
    const cols = trimmed.split('|').map(c => c.trim()).filter(Boolean);
    if (cols.length < 3) continue;

    let apiPath = cols[0].replace(/`/g, '').trim();
    if (!apiPath.startsWith('/api/')) continue;

    const usdStr = cols[1]?.replace('$', '').trim();
    const cnyStr = cols[2]?.replace('¥', '').trim();
    const rateLimit = cols[3]?.trim() || '';
    const freeQuota = cols[4]?.trim() === '✅';
    const discount = cols[5]?.trim() === '✅';

    const usd = parseFloat(usdStr) || 0;
    const cny = parseFloat(cnyStr) || 0;

    if (cny > 0 || usd === 0) {
      map.set(apiPath, { usd, cny, rateLimit, freeQuota, discount });
    }
  }

  return map;
}

/**
 * 初始化价格服务
 * @param {string} pricingFilePath - pricing.md文件路径
 */
function init(pricingFilePath) {
  if (_pricingMap && _pricingPath === pricingFilePath) return _pricingMap;
  _pricingPath = pricingFilePath;
  _pricingMap = parsePricingFile(pricingFilePath);
  return _pricingMap;
}

/**
 * 获取API价格
 * @param {string} fullPath - 完整API路径（如 /api/v1/douyin/web/fetch_one_video）
 * @returns {object|null} 价格信息 { usd, cny, rateLimit, freeQuota, discount }
 */
function getPrice(fullPath) {
  if (!_pricingMap) return null;
  return _pricingMap.get(fullPath) || null;
}

/**
 * 通过前缀和相对路径获取价格
 * @param {string} prefix - API前缀（如 /api/v1/douyin）
 * @param {string} relativePath - 相对路径（如 /web/fetch_one_video）
 * @returns {object|null} 价格信息
 */
function getPriceByPath(prefix, relativePath) {
  const fullPath = `${prefix}${relativePath}`;
  return getPrice(fullPath);
}

/**
 * 为API_REGISTRY批量注入价格信息
 * @param {object} registry - API注册表
 * @param {string} apiPrefix - API前缀
 * @returns {object} 注入价格后的注册表
 */
function injectPrices(registry, apiPrefix) {
  if (!_pricingMap) return registry;

  for (const [name, def] of Object.entries(registry)) {
    const fullPath = `${apiPrefix}${def.path}`;
    const priceInfo = _pricingMap.get(fullPath);
    if (priceInfo) {
      def.price = priceInfo.cny;
      def.freeQuota = priceInfo.freeQuota;
      def.rateLimitInfo = priceInfo.rateLimit;
    } else {
      def.price = def.price || 0;
    }
  }

  return registry;
}

/**
 * 获取指定平台的所有API价格
 * @param {string} platformPrefix - 平台前缀（如 /api/v1/douyin）
 * @returns {Array} 该平台所有API的价格列表
 */
function getPlatformPrices(platformPrefix) {
  if (!_pricingMap) return [];
  const results = [];
  for (const [apiPath, priceInfo] of _pricingMap) {
    if (apiPath.startsWith(platformPrefix)) {
      results.push({ path: apiPath, ...priceInfo });
    }
  }
  return results.sort((a, b) => a.cny - b.cny);
}

/**
 * 获取价格统计信息
 */
function getStats() {
  if (!_pricingMap) return { total: 0 };
  let totalFree = 0;
  let totalPaid = 0;
  let sumCny = 0;
  for (const info of _pricingMap.values()) {
    if (info.cny === 0) totalFree++;
    else { totalPaid++; sumCny += info.cny; }
  }
  return {
    total: _pricingMap.size,
    free: totalFree,
    paid: totalPaid,
    avgCny: totalPaid > 0 ? (sumCny / totalPaid).toFixed(4) : 0,
  };
}

/**
 * 计算一组API调用的总费用
 * @param {Array<{path: string, count?: number}>} calls - 调用列表
 * @returns {object} 费用明细 { total, breakdown }
 */
function calculateCost(calls) {
  let total = 0;
  const breakdown = [];
  for (const call of calls) {
    const info = getPrice(call.path);
    const count = call.count || 1;
    const cost = info ? info.cny * count : 0;
    total += cost;
    breakdown.push({
      path: call.path,
      unitPrice: info?.cny || 0,
      count,
      cost,
    });
  }
  return { total, breakdown };
}

module.exports = {
  init,
  getPrice,
  getPriceByPath,
  injectPrices,
  getPlatformPrices,
  getStats,
  calculateCost,
};
