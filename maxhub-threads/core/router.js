// 指令路由、分支分发 - Threads平台
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
  apiPrefix: '/api/v1/threads',
  costWeight: 0.6,
  latencyWeight: 0.25,
  completenessWeight: 0.15,
});

/**
 * 意图到API方案的映射
 * 同一意图可映射多个API，决策引擎自动选择最优
 */
const INTENT_API_MAP = {
  get_user_profile: ['fetchUserInfo', 'fetchUserInfoById'],
  get_user_posts: ['fetchUserPosts'],
  get_post_detail: ['fetchPostDetail', 'fetchPostDetailV2'],
  get_post_comments: ['fetchPostComments'],
  search: ['searchTop', 'searchRecent', 'searchProfiles'],
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
    async search({ keyword, query, page = 1, count = 20 }) {
      const searchQuery = keyword || query;
      const decision = router.decideBestApi('search', { query: searchQuery });
      const apiName = decision.selected?.apiName || 'searchProfiles';
      const result = await api[apiName]({ query: searchQuery });
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

    async get_user_profile({ username, user_id, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_user_profile', { username, user_id });
      let apiName;
      if (username) {
        apiName = 'fetchUserInfo';
      } else if (user_id) {
        apiName = 'fetchUserInfoById';
      } else {
        apiName = decision.selected?.apiName || 'fetchUserInfo';
      }
      const result = await api[apiName]({ username, user_id });
      return {
        success: true,
        intent: 'get_user_profile',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
        },
      };
    },

    async get_user_posts({ user_id, page = 1, count = 20 }) {
      const result = await api.fetchUserPosts({ user_id });
      return {
        success: true,
        intent: 'get_user_posts',
        data: data.formatItem(result),
        _decision: {
          selectedApi: 'fetchUserPosts',
          costEstimate: { perCall: 0.02, currency: 'CNY', estimatedTotal: 0.02 },
        },
      };
    },

    async get_post_detail({ post_id, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_post_detail', { post_id });
      const apiName = decision.selected?.apiName || 'fetchPostDetail';
      const result = await api[apiName]({ post_id });
      return {
        success: true,
        intent: 'get_post_detail',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
          alternatives: decision.alternatives?.map(a => a.apiName),
        },
      };
    },

    async get_post_comments({ post_id, page = 1, count = 20 }) {
      const result = await api.fetchPostComments({ post_id });
      return {
        success: true,
        intent: 'get_post_comments',
        data: data.formatItem(result),
        _decision: {
          selectedApi: 'fetchPostComments',
          costEstimate: { perCall: 0.02, currency: 'CNY', estimatedTotal: 0.02 },
        },
      };
    },
  },
};

module.exports = router;
