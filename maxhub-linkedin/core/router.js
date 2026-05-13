// 指令路由、分支分发 - LinkedIn平台
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
  apiPrefix: '/api/v1/linkedin',
  costWeight: 0.6,
  latencyWeight: 0.25,
  completenessWeight: 0.15,
});

/**
 * 意图到API方案的映射
 * 同一意图可映射多个API，决策引擎自动选择最优
 */
const INTENT_API_MAP = {
  search_people: ['searchPeople', 'searchUsers'],
  get_user_profile: ['getUserProfile', 'getUserBio', 'getUserTopCard'],
  get_company_profile: ['getCompanyProfile'],
  get_user_posts: ['getUserPosts'],
  get_company_posts: ['getCompanyPosts'],
  get_post_detail: ['getPostDetail', 'getPostDetailBySlug'],
  get_post_comments: ['getPostComments', 'getCommentReplies'],
  search_jobs: ['searchJobs', 'getCompanyJobs'],
  get_user_contact: ['getUserContact', 'getUserContactInfo'],
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
    // 搜索用户
    async search_people({ keyword, page = 1, count = 20 }) {
      const decision = router.decideBestApi('search_people', { keyword });
      const apiName = decision.selected?.apiName || 'searchPeople';
      const result = await api[apiName]({ keyword });
      return {
        success: true,
        intent: 'search_people',
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
      const decision = router.decideBestApi('get_user_profile', { username });
      const apiName = decision.selected?.apiName || 'getUserProfile';
      const result = await api[apiName]({ username });
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

    // 获取公司信息
    async get_company_profile({ name, universal_name, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_company_profile', { universal_name: universal_name || name });
      const apiName = decision.selected?.apiName || 'getCompanyProfile';
      const result = await api[apiName]({ universal_name: universal_name || name });
      return {
        success: true,
        intent: 'get_company_profile',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
        },
      };
    },

    // 获取用户帖子
    async get_user_posts({ urn, username, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_user_posts', { username });
      const apiName = decision.selected?.apiName || 'getUserPosts';
      const result = await api[apiName]({ username });
      return {
        success: true,
        intent: 'get_user_posts',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          costEstimate: decision.costEstimate,
        },
      };
    },

    // 获取公司帖子
    async get_company_posts({ name, universal_name, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_company_posts', { universal_name: universal_name || name });
      const apiName = decision.selected?.apiName || 'getCompanyPosts';
      const result = await api[apiName]({ universal_name: universal_name || name });
      return {
        success: true,
        intent: 'get_company_posts',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          costEstimate: decision.costEstimate,
        },
      };
    },
  },
};

module.exports = router;
