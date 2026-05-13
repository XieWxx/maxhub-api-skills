// 指令路由、分支分发 - 临时邮箱服务
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
  apiPrefix: '/api/v1/temp-mail',
  costWeight: 0.6,
  latencyWeight: 0.25,
  completenessWeight: 0.15,
});

/**
 * 意图到API方案的映射
 * 同一意图可映射多个API，决策引擎自动选择最优
 */
const INTENT_API_MAP = {
  create_email: ['getTempEmailAddress'],
  get_inbox: ['getEmailsInbox'],
  get_email_detail: ['getEmailById'],
  create_and_check: ['getTempEmailAddress', 'getEmailsInbox'],
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
    // 创建临时邮箱
    async create_email(params = {}) {
      const decision = router.decideBestApi('create_email', params);
      const apiName = decision.selected?.apiName || 'getTempEmailAddress';
      const result = await api[apiName](params);
      return {
        success: true,
        intent: 'create_email',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
        },
      };
    },

    // 查看收件箱
    async get_inbox({ token }) {
      const result = await api.getEmailsInbox({ token });
      return {
        success: true,
        intent: 'get_inbox',
        data: data.formatData('/temp_mail/v1/get_emails_inbox', result),
        hasMore: false,
        _decision: {
          selectedApi: 'getEmailsInbox',
          costEstimate: { perCall: 0.01, currency: 'CNY', estimatedTotal: 0.01 },
        },
      };
    },

    // 查看邮件详情
    async get_email_detail({ token, message_id }) {
      const result = await api.getEmailById({ token, message_id });
      return {
        success: true,
        intent: 'get_email_detail',
        data: data.formatItem(result),
        _decision: {
          selectedApi: 'getEmailById',
          costEstimate: { perCall: 0.01, currency: 'CNY', estimatedTotal: 0.01 },
        },
      };
    },

    // 链式调用：创建邮箱→查看收件箱
    async create_and_check(params = {}) {
      const createResult = await api.getTempEmailAddress(params);
      const token = createResult?.token || createResult?.data?.token;
      if (!token) {
        return { success: false, message: '创建邮箱失败，无法获取token' };
      }
      const inboxResult = await api.getEmailsInbox({ token });
      return {
        success: true,
        intent: 'create_and_check',
        data: {
          email: data.formatItem(createResult),
          inbox: data.formatData('/temp_mail/v1/get_emails_inbox', inboxResult),
        },
        _decision: {
          selectedApi: 'getTempEmailAddress + getEmailsInbox',
          costEstimate: { perCall: 0.02, currency: 'CNY', estimatedTotal: 0.02 },
        },
      };
    },
  },
};

module.exports = router;
