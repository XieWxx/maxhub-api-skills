// 指令路由、分支分发 - Sora2平台
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
  apiPrefix: '/api/v1/sora2',
  costWeight: 0.6,
  latencyWeight: 0.25,
  completenessWeight: 0.15,
});

/**
 * 意图到API方案的映射
 * 同一意图可映射多个API，决策引擎自动选择最优
 */
const INTENT_API_MAP = {
  search_user: ['searchUsers'],
  get_user_profile: ['getUserProfile'],
  get_user_posts: ['getUserPosts'],
  get_post_detail: ['getPostDetail'],
  get_comments: ['getPostComments', 'getCommentReplies'],
  get_feed: ['getFeed'],
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
    // 搜索创作者
    async search_user({ keyword, page = 1, count = 20 }) {
      const decision = router.decideBestApi('search_user', { username: keyword });
      const apiName = decision.selected?.apiName || 'searchUsers';
      const result = await api[apiName]({ keyword });
      return {
        success: true,
        intent: 'search_user',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
        },
      };
    },

    // 获取创作者信息
    async get_user_profile({ user_id, page = 1, count = 20 }) {
      const result = await api.getUserProfile({ user_id });
      return {
        success: true,
        intent: 'get_user_profile',
        data: data.formatItem(result),
        _decision: {
          selectedApi: 'getUserProfile',
          costEstimate: { perCall: 0.01, currency: 'CNY', estimatedTotal: 0.01 },
        },
      };
    },

    // 获取创作者作品
    async get_user_posts({ user_id, page = 1, count = 20 }) {
      const result = await api.getUserPosts({ user_id });
      return {
        success: true,
        intent: 'get_user_posts',
        data: data.formatItem(result),
        _decision: {
          selectedApi: 'getUserPosts',
          costEstimate: { perCall: 0.01, currency: 'CNY', estimatedTotal: 0.01 },
        },
      };
    },

    // 获取作品详情
    async get_post_detail({ post_id, page = 1, count = 20 }) {
      const result = await api.getPostDetail({ post_id });
      return {
        success: true,
        intent: 'get_post_detail',
        data: data.formatItem(result),
        _decision: {
          selectedApi: 'getPostDetail',
          costEstimate: { perCall: 0.01, currency: 'CNY', estimatedTotal: 0.01 },
        },
      };
    },

    // 获取作品评论
    async get_comments({ post_id, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_comments', { post_id });
      const apiName = decision.selected?.apiName || 'getPostComments';
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

    // 获取推荐内容
    async get_feed({  }) {
      const result = await api.getFeed({});
      return {
        success: true,
        intent: 'get_feed',
        data: data.formatItem(result),
        _decision: {
          selectedApi: 'getFeed',
          costEstimate: { perCall: 0.01, currency: 'CNY', estimatedTotal: 0.01 },
        },
      };
    },

  },
};

module.exports = router;
