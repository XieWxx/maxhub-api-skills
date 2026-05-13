// 指令路由、分支分发 - 微博平台
// 集成智能决策引擎，自动选择最优API路径

const api = require('../service/api');
const data = require('../service/data');
const { DecisionEngine } = require('../shared/decision');

/**
 * 初始化决策引擎
 * 配置意图到API的映射关系，支持多方案自动选择
 */
const decisionEngine = new DecisionEngine({
  registry: api.API_REGISTRY,
  apiPrefix: '/api/v1/weibo',
  costWeight: 0.6,
  latencyWeight: 0.25,
  completenessWeight: 0.15,
});

/**
 * 意图到API方案的映射
 * 同一意图可映射多个API，决策引擎自动选择最优
 */
const INTENT_API_MAP = {
  search: ['fetchSearch', 'fetchSearchAll', 'fetchAdvancedSearch', 'fetchRealtimeSearch'],
  get_user_profile: ['fetchUserInfo', 'fetchUserInfoDetail', 'fetchUserBasicInfo'],
  get_hot_search: ['fetchHotSearch', 'fetchHotSearchIndex', 'fetchHotSearchSummary'],
  get_detail: ['fetchStatusDetail', 'fetchPostDetail'],
  get_comments: ['fetchStatusComments', 'fetchPostComments'],
};

decisionEngine._getIntentApiMap = () => INTENT_API_MAP;

const router = {
  async dispatch(intent, params = {}) {
    const handler = this.routes[intent];
    if (!handler) {
      return { success: false, message: `未识别的意图: ${intent}` };
    }
    return handler(params);
  },

  /**
   * 智能决策接口
   * 根据参数和成本评估，选择最优API方案
   * @param {string} intentType - 意图类型
   * @param {object} params - 用户参数
   * @returns {object} 决策结果，包含选中方案和备选方案
   */
  decideBestApi(intentType, params = {}) {
    const candidates = decisionEngine.generateCandidates(intentType, params);
    return decisionEngine.decide(intentType, params, candidates);
  },

  /**
   * 多方案费用对比
   * @param {string} intentType - 意图类型
   * @param {number} callCount - 预估调用次数
   * @returns {Array} 按费用排序的方案列表
   */
  compareCosts(intentType, callCount = 1) {
    const candidates = decisionEngine.generateCandidates(intentType, {});
    return decisionEngine.comparePlans(candidates, callCount);
  },

  routes: {
    // 搜索微博
    async search({ keyword, query, page = 1, count = 20 }) {
      const searchQuery = keyword || query;
      const decision = router.decideBestApi('search', { keyword: searchQuery, query: searchQuery, q: searchQuery });
      const apiName = decision.selected?.apiName || 'fetchSearch';
      const result = await api[apiName]({ keyword: searchQuery, query: searchQuery, q: searchQuery });
      return {
        success: true,
        intent: 'search',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
          alternatives: decision.alternatives?.map(a => a.apiName),
        },
      };
    },

    // 获取用户信息
    async get_user_profile({ uid, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_user_profile', { uid });
      const apiName = decision.selected?.apiName || 'fetchUserInfo';
      const result = await api[apiName]({ uid });
      return {
        success: true,
        intent: 'get_user_profile',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
          alternatives: decision.alternatives?.map(a => a.apiName),
        },
      };
    },

    // 获取热搜
    async get_hot_search({ }) {
      const decision = router.decideBestApi('get_hot_search', {});
      const apiName = decision.selected?.apiName || 'fetchHotSearch';
      const result = await api[apiName]({});
      return {
        success: true,
        intent: 'get_hot_search',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
          alternatives: decision.alternatives?.map(a => a.apiName),
        },
      };
    },

    // 获取微博详情
    async get_detail({ id, status_id, page = 1, count = 20 }) {
      const detailId = id || status_id;
      const decision = router.decideBestApi('get_detail', { id: detailId, status_id: detailId });
      const apiName = decision.selected?.apiName || 'fetchStatusDetail';
      const result = await api[apiName]({ id: detailId, status_id: detailId });
      return {
        success: true,
        intent: 'get_detail',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
          alternatives: decision.alternatives?.map(a => a.apiName),
        },
      };
    },

    // 获取评论
    async get_comments({ id, status_id, page = 1, count = 20 }) {
      const commentId = id || status_id;
      const decision = router.decideBestApi('get_comments', { id: commentId, status_id: commentId });
      const apiName = decision.selected?.apiName || 'fetchStatusComments';
      const result = await api[apiName]({ id: commentId, status_id: commentId });
      return {
        success: true,
        intent: 'get_comments',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
          alternatives: decision.alternatives?.map(a => a.apiName),
        },
      };
    },

  },
};

module.exports = router;
