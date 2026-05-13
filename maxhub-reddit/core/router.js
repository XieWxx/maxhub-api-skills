// 指令路由、分支分发 - Reddit平台
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
  apiPrefix: '/api/v1/reddit',
  costWeight: 0.6,
  latencyWeight: 0.25,
  completenessWeight: 0.15,
});

/**
 * 意图到API方案的映射
 * 同一意图可映射多个API，决策引擎自动选择最优
 */
const INTENT_API_MAP = {
  search: ['fetchDynamicSearch', 'fetchSearchTypeahead'],
  get_subreddit_feed: ['fetchSubredditFeed'],
  get_post_detail: ['fetchPostDetails', 'fetchPostDetailsBatch'],
  get_comments: ['fetchPostComments', 'fetchCommentReplies'],
  get_user_profile: ['fetchUserProfile'],
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
    // 搜索
    async search({ keyword, page = 1, count = 20 }) {
      const decision = router.decideBestApi('search', { query: keyword });
      const apiName = decision.selected?.apiName || 'fetchDynamicSearch';
      const result = await api[apiName]({ keyword });
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

    // 获取版块帖子
    async get_subreddit_feed({ subreddit_name, page = 1, count = 20 }) {
      const result = await api.fetchSubredditFeed({ subreddit_name });
      return {
        success: true,
        intent: 'get_subreddit_feed',
        data: data.formatItem(result),
        _decision: {
          selectedApi: 'fetchSubredditFeed',
          costEstimate: { perCall: 0.01, currency: 'CNY', estimatedTotal: 0.01 },
        },
      };
    },

    // 获取帖子详情
    async get_post_detail({ post_id, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_post_detail', { post_id });
      const apiName = decision.selected?.apiName || 'fetchPostDetails';
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

    // 获取评论
    async get_comments({ post_id, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_comments', { post_id });
      const apiName = decision.selected?.apiName || 'fetchPostComments';
      const result = await api[apiName]({ post_id });
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

    // 获取用户信息
    async get_user_profile({ username, page = 1, count = 20 }) {
      const result = await api.fetchUserProfile({ username });
      return {
        success: true,
        intent: 'get_user_profile',
        data: data.formatItem(result),
        _decision: {
          selectedApi: 'fetchUserProfile',
          costEstimate: { perCall: 0.01, currency: 'CNY', estimatedTotal: 0.01 },
        },
      };
    },

  },
};

module.exports = router;
