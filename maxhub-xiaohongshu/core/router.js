// 指令路由、分支分发 - 小红书平台
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
  apiPrefix: '/api/v1/xiaohongshu',
  costWeight: 0.6,
  latencyWeight: 0.25,
  completenessWeight: 0.15,
});

/**
 * 意图到API方案的映射
 * 同一意图可映射多个API，决策引擎自动选择最优
 */
const INTENT_API_MAP = {
  search_note: ['fetchSearchNotes', 'searchNotes', 'searchNotesV3'],
  search_user: ['fetchSearchUsers', 'searchUsers'],
  get_note_detail: ['fetchNoteDetail', 'getNoteInfo', 'getNoteInfoV2', 'getNoteInfoV4', 'getNoteInfoV5', 'getNoteInfoV7'],
  get_user_profile: ['fetchUserInfo', 'fetchUserInfoApp', 'getUserInfo', 'getUserInfoV2'],
  get_comments: ['fetchNoteComments', 'getNoteComments', 'getNoteCommentsV3'],
  get_user_notes: ['fetchUserNotes', 'getUserNotes', 'getUserPostedNotes', 'getUserNotesV2'],
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
    // 搜索笔记
    async search_note({ keyword, page = 1, count = 20 }) {
      const decision = router.decideBestApi('search_note', { keyword });
      const apiName = decision.selected?.apiName || 'fetchSearchNotes';
      const result = await api[apiName]({ keyword });
      return {
        success: true,
        intent: 'search_note',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
          alternatives: decision.alternatives?.map(a => a.apiName),
        },
      };
    },

    // 搜索用户
    async search_user({ keyword, page = 1, count = 20 }) {
      const decision = router.decideBestApi('search_user', { keyword });
      const apiName = decision.selected?.apiName || 'fetchSearchUsers';
      const result = await api[apiName]({ keyword });
      return {
        success: true,
        intent: 'search_user',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
          alternatives: decision.alternatives?.map(a => a.apiName),
        },
      };
    },

    // 获取笔记详情
    async get_note_detail({ note_id, xsec_token, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_note_detail', { note_id, xsec_token });
      const apiName = decision.selected?.apiName || 'fetchNoteDetail';
      const result = await api[apiName]({ note_id, xsec_token });
      return {
        success: true,
        intent: 'get_note_detail',
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
    async get_user_profile({ user_id, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_user_profile', { user_id });
      const apiName = decision.selected?.apiName || 'fetchUserInfo';
      const result = await api[apiName]({ user_id });
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

    // 获取笔记评论
    async get_comments({ note_id, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_comments', { note_id });
      const apiName = decision.selected?.apiName || 'fetchNoteComments';
      const result = await api[apiName]({ note_id });
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

    // 获取用户笔记
    async get_user_notes({ user_id, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_user_notes', { user_id });
      const apiName = decision.selected?.apiName || 'fetchUserNotes';
      const result = await api[apiName]({ user_id });
      return {
        success: true,
        intent: 'get_user_notes',
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
