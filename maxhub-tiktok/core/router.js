// 指令路由、分支分发 - TikTok平台
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
  apiPrefix: '/api/v1/tiktok',
  costWeight: 0.6,
  latencyWeight: 0.25,
  completenessWeight: 0.15,
});

/**
 * 意图到API方案的映射
 * 同一意图可映射多个API，决策引擎自动选择最优
 */
const INTENT_API_MAP = {
  search_video: ['fetchGeneralSearch', 'fetchGeneralSearchResult', 'fetchVideoSearchResult'],
  search_user: ['fetchSearchUser', 'fetchUserSearchResult'],
  get_video_detail: ['fetchOneVideo', 'fetchOneVideoV2', 'fetchOneVideoV3'],
  get_user_profile: ['fetchUserProfile', 'handlerUserProfile'],
  get_comments: ['fetchVideoComments', 'fetchPostComment'],
  get_user_videos: ['fetchUserPostVideos', 'fetchUserPostVideosV2', 'fetchUserPostVideosV3'],
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
    // 搜索视频
    async search_video({ keyword, page = 1, count = 20 }) {
      const decision = router.decideBestApi('search_video', { keyword });
      const apiName = decision.selected?.apiName || 'fetchGeneralSearch';
      const result = await api[apiName]({ keyword });
      return {
        success: true,
        intent: 'search_video',
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
      const apiName = decision.selected?.apiName || 'fetchSearchUser';
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

    // 获取视频详情
    async get_video_detail({ aweme_id, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_video_detail', { aweme_id });
      const apiName = decision.selected?.apiName || 'fetchOneVideo';
      const result = await api[apiName]({ aweme_id });
      return {
        success: true,
        intent: 'get_video_detail',
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
    async get_user_profile({ unique_id, sec_uid, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_user_profile', { unique_id, sec_uid });
      let apiName;
      if (unique_id) {
        apiName = 'fetchUserProfile';
      } else if (sec_uid) {
        apiName = 'handlerUserProfile';
      } else {
        apiName = decision.selected?.apiName || 'fetchUserProfile';
      }
      const result = await api[apiName]({ unique_id, sec_uid });
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

    // 获取评论
    async get_comments({ aweme_id, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_comments', { aweme_id });
      const apiName = decision.selected?.apiName || 'fetchVideoComments';
      const result = await api[apiName]({ aweme_id });
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

    // 获取用户视频
    async get_user_videos({ sec_uid, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_user_videos', { sec_uid });
      const apiName = decision.selected?.apiName || 'fetchUserPostVideos';
      const result = await api[apiName]({ sec_uid });
      return {
        success: true,
        intent: 'get_user_videos',
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
