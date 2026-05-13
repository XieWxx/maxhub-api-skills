// 智能决策系统 - 成本预测、多方案对比、动态路径选择
// 综合评估时间成本与经济成本，自动选择最优执行路径

/**
 * API方案定义
 * @typedef {Object} ApiPlan
 * @property {string} name - 方案名称
 * @property {string} apiName - API注册表中的名称
 * @property {number} price - 单次调用价格（CNY）
 * @property {number} estimatedLatency - 预估延迟（毫秒）
 * @property {number} dataCompleteness - 数据完整度（0-1）
 * @property {string[]} requiredParams - 必需参数列表
 * @property {string} deprecation - 弃用状态（null/deprecated）
 */

/**
 * 决策结果
 * @typedef {Object} DecisionResult
 * @property {ApiPlan} selected - 选中的方案
 * @property {ApiPlan[]} alternatives - 备选方案
 * @property {string} reason - 选择理由
 * @property {Object} costEstimate - 费用预估
 */

class DecisionEngine {
  constructor(options = {}) {
    this.costWeight = options.costWeight || 0.6;
    this.latencyWeight = options.latencyWeight || 0.25;
    this.completenessWeight = options.completenessWeight || 0.15;
    this.registry = options.registry || {};
    this.apiPrefix = options.apiPrefix || '';
    this.callHistory = [];
    this.maxHistory = options.maxHistory || 100;
  }

  /**
   * 设置API注册表
   */
  setRegistry(registry, apiPrefix) {
    this.registry = registry;
    this.apiPrefix = apiPrefix || '';
  }

  /**
   * 为指定意图选择最优API
   * @param {string} intent - 用户意图
   * @param {object} params - 用户提供的参数
   * @param {ApiPlan[]} candidates - 候选API方案列表
   * @returns {DecisionResult} 决策结果
   */
  decide(intent, params, candidates) {
    if (!candidates || candidates.length === 0) {
      return { selected: null, alternatives: [], reason: '无可用方案', costEstimate: {} };
    }

    const scored = candidates
      .filter(c => this._canExecute(c, params))
      .filter(c => !c.deprecation)
      .map(c => ({
        ...c,
        score: this._score(c),
      }))
      .sort((a, b) => b.score - a.score);

    if (scored.length === 0) {
      const fallback = candidates.find(c => this._canExecute(c, params));
      if (fallback) {
        return {
          selected: fallback,
          alternatives: [],
          reason: '仅剩弃用方案可用，建议迁移到新接口',
          costEstimate: this._estimateCost(fallback),
        };
      }
      return { selected: null, alternatives: [], reason: '参数不足，无法执行任何方案', costEstimate: {} };
    }

    const selected = scored[0];
    const alternatives = scored.slice(1);

    return {
      selected,
      alternatives,
      reason: this._explain(selected, scored),
      costEstimate: this._estimateCost(selected),
    };
  }

  /**
   * 检查方案是否可执行（参数是否满足）
   */
  _canExecute(candidate, params) {
    if (!candidate.requiredParams || candidate.requiredParams.length === 0) return true;
    return candidate.requiredParams.every(p => params[p] !== undefined && params[p] !== null && params[p] !== '');
  }

  /**
   * 综合评分
   * 分数越高越优
   */
  _score(candidate) {
    const maxPrice = 0.25;
    const maxLatency = 5000;
    const costScore = 1 - Math.min(candidate.price / maxPrice, 1);
    const latencyScore = 1 - Math.min((candidate.estimatedLatency || 1000) / maxLatency, 1);
    const completenessScore = candidate.dataCompleteness || 0.8;

    return (
      costScore * this.costWeight +
      latencyScore * this.latencyWeight +
      completenessScore * this.completenessWeight
    );
  }

  /**
   * 生成选择理由
   */
  _explain(selected, allScored) {
    const reasons = [];
    if (selected.price === 0) {
      reasons.push('免费接口');
    } else if (allScored.length > 1 && selected.price <= allScored[1]?.price) {
      reasons.push(`价格最低（¥${selected.price.toFixed(4)}）`);
    }
    if (selected.dataCompleteness >= 0.9) {
      reasons.push('数据完整度高');
    }
    if (selected.estimatedLatency && selected.estimatedLatency < 1000) {
      reasons.push('响应速度快');
    }
    if (reasons.length === 0) {
      reasons.push('综合评分最优');
    }
    return reasons.join('，');
  }

  /**
   * 费用预估
   */
  _estimateCost(plan) {
    return {
      perCall: plan.price,
      currency: 'CNY',
      estimatedTotal: plan.price,
    };
  }

  /**
   * 多方案费用对比
   * @param {ApiPlan[]} plans - 候选方案列表
   * @param {number} callCount - 预估调用次数
   * @returns {Object} 对比结果
   */
  comparePlans(plans, callCount = 1) {
    return plans.map(plan => ({
      name: plan.name,
      apiName: plan.apiName,
      pricePerCall: plan.price,
      totalCost: plan.price * callCount,
      estimatedLatency: plan.estimatedLatency,
      dataCompleteness: plan.dataCompleteness,
      deprecation: plan.deprecation,
    })).sort((a, b) => a.totalCost - b.totalCost);
  }

  /**
   * 记录调用历史，用于动态调整权重
   */
  recordCall(apiName, duration, success) {
    this.callHistory.push({ apiName, duration, success, timestamp: Date.now() });
    if (this.callHistory.length > this.maxHistory) {
      this.callHistory.shift();
    }
    this._adjustWeights();
  }

  /**
   * 根据历史数据动态调整权重
   * 如果延迟普遍较高，增加延迟权重
   * 如果费用累积较高，增加费用权重
   */
  _adjustWeights() {
    if (this.callHistory.length < 10) return;
    const recent = this.callHistory.slice(-20);
    const avgLatency = recent.reduce((s, r) => s + r.duration, 0) / recent.length;
    const errorRate = recent.filter(r => !r.success).length / recent.length;

    if (avgLatency > 3000) {
      this.latencyWeight = Math.min(0.4, this.latencyWeight + 0.05);
      this.costWeight = Math.max(0.4, this.costWeight - 0.03);
      this.completenessWeight = 1 - this.costWeight - this.latencyWeight;
    }
    if (errorRate > 0.2) {
      this.completenessWeight = Math.min(0.3, this.completenessWeight + 0.05);
      this.costWeight = Math.max(0.4, this.costWeight - 0.03);
      this.latencyWeight = 1 - this.costWeight - this.completenessWeight;
    }
  }

  /**
   * 从API_REGISTRY自动生成候选方案
   * @param {string} intentType - 意图类型（如 video_detail, user_profile, search）
   * @param {object} params - 用户参数
   * @returns {ApiPlan[]} 候选方案列表
   */
  generateCandidates(intentType, params) {
    const candidates = [];
    const intentMap = this._getIntentApiMap();

    const apiNames = intentMap[intentType] || [];
    for (const apiName of apiNames) {
      const def = this.registry[apiName];
      if (!def) continue;
      candidates.push({
        name: apiName,
        apiName,
        price: def.price || 0,
        estimatedLatency: def.estimatedLatency || 1000,
        dataCompleteness: def.dataCompleteness || 0.8,
        requiredParams: def.params || [],
        deprecation: def.deprecated ? 'deprecated' : null,
      });
    }
    return candidates;
  }

  /**
   * 意图到API的映射表（由各skill覆写）
   */
  _getIntentApiMap() {
    return {};
  }

  /**
   * 获取当前权重配置
   */
  getWeights() {
    return {
      cost: this.costWeight,
      latency: this.latencyWeight,
      completeness: this.completenessWeight,
    };
  }
}

/**
 * 为路由分发创建决策增强包装器
 * @param {object} router - 原始路由对象
 * @param {DecisionEngine} engine - 决策引擎实例
 */
function withDecision(router, engine) {
  const originalDispatch = router.dispatch.bind(router);

  router.dispatch = async function enhancedDispatch(intent, params = {}) {
    const result = await originalDispatch(intent, params);
    if (result && result._apiName) {
      engine.recordCall(
        result._apiName,
        result._duration || 0,
        result.success !== false
      );
    }
    return {
      ...result,
      _decision: {
        weights: engine.getWeights(),
        sessionCalls: engine.callHistory.length,
      },
    };
  };

  return router;
}

module.exports = { DecisionEngine, withDecision };
