// 指令路由、分支分发 - 微信平台
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
  apiPrefix: '/api/v1/wechat',
  costWeight: 0.6,
  latencyWeight: 0.25,
  completenessWeight: 0.15,
});

/**
 * 意图到API方案的映射
 * 同一意图可映射多个API，决策引擎自动选择最优
 */
const INTENT_API_MAP = {
  search: ['fetchDefaultSearch', 'fetchSearchLatest', 'fetchSearchOrdinary'],
  get_article_list: ['fetchMpArticleList'],
  get_article_detail: ['fetchMpArticleDetailJson', 'fetchMpArticleDetailHtml'],
  get_comments: ['fetchMpArticleCommentList'],
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
    // 搜索公众号
    async search({ keyword, page = 1, count = 20 }) {
      const decision = router.decideBestApi('search', { keywords: keyword });
      const apiName = decision.selected?.apiName || 'fetchDefaultSearch';
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

    // 获取文章列表
    async get_article_list({ ghid, page = 1, count = 20 }) {
      const result = await api.fetchMpArticleList({ ghid });
      return {
        success: true,
        intent: 'get_article_list',
        data: data.formatItem(result),
        _decision: {
          selectedApi: 'fetchMpArticleList',
          costEstimate: { perCall: 0.01, currency: 'CNY', estimatedTotal: 0.01 },
        },
      };
    },

    // 获取文章详情
    async get_article_detail({ url, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_article_detail', { url });
      const apiName = decision.selected?.apiName || 'fetchMpArticleDetailJson';
      const result = await api[apiName]({ url });
      return {
        success: true,
        intent: 'get_article_detail',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
          alternatives: decision.alternatives?.map(a => a.apiName),
        },
      };
    },

    // 获取文章评论
    async get_comments({ url, page = 1, count = 20 }) {
      const result = await api.fetchMpArticleCommentList({ url });
      return {
        success: true,
        intent: 'get_comments',
        data: data.formatItem(result),
        _decision: {
          selectedApi: 'fetchMpArticleCommentList',
          costEstimate: { perCall: 0.01, currency: 'CNY', estimatedTotal: 0.01 },
        },
      };
    },

  },
};

module.exports = router;
