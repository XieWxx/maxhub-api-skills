// 指令路由、分支分发 - 知乎平台
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
  apiPrefix: '/api/v1/zhihu',
  costWeight: 0.6,
  latencyWeight: 0.25,
  completenessWeight: 0.15,
});

/**
 * 意图到API方案的映射
 * 同一意图可映射多个API，决策引擎自动选择最优
 */
const INTENT_API_MAP = {
  search: ['fetchArticleSearchV3', 'fetchUserSearchV3', 'fetchTopicSearchV3', 'fetchVideoSearchV3', 'fetchColumnSearchV3'],
  get_user_profile: ['fetchUserInfo'],
  get_question_answers: ['fetchQuestionAnswers'],
  get_column_articles: ['fetchColumnArticles'],
  get_column_article_detail: ['fetchColumnArticleDetail'],
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
      const decision = router.decideBestApi('search', { keyword });
      const apiName = decision.selected?.apiName || 'fetchArticleSearchV3';
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

    // 获取用户信息
    async get_user_profile({ user_id, user_url_token, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_user_profile', { user_url_token });
      const apiName = decision.selected?.apiName || 'fetchUserInfo';
      const result = await api[apiName]({ user_url_token: user_url_token || user_id });
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

    // 获取问题回答
    async get_question_answers({ question_id, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_question_answers', { question_id });
      const apiName = decision.selected?.apiName || 'fetchQuestionAnswers';
      const result = await api[apiName]({ question_id });
      return {
        success: true,
        intent: 'get_question_answers',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
        },
      };
    },

    // 获取专栏文章
    async get_column_articles({ column_id, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_column_articles', { column_id });
      const apiName = decision.selected?.apiName || 'fetchColumnArticles';
      const result = await api[apiName]({ column_id });
      return {
        success: true,
        intent: 'get_column_articles',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
        },
      };
    },

    // 获取专栏文章详情
    async get_column_article_detail({ article_id, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_column_article_detail', { article_id });
      const apiName = decision.selected?.apiName || 'fetchColumnArticleDetail';
      const result = await api[apiName]({ article_id });
      return {
        success: true,
        intent: 'get_column_article_detail',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
        },
      };
    },

  },
};

module.exports = router;
