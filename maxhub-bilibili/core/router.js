// 指令路由、分支分发 - B站平台
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
  apiPrefix: '/api/v1/bilibili',
  costWeight: 0.6,
  latencyWeight: 0.25,
  completenessWeight: 0.15,
});

/**
 * 意图到API方案的映射
 * 同一意图可映射多个API，决策引擎自动选择最优
 */
const INTENT_API_MAP = {
  search_video: ['fetchGeneralSearch', 'fetchSearchAll', 'fetchSearchByType'],
  search_user: ['fetchSearchByType', 'fetchSearchAll'],
  get_video_detail: ['fetchOneVideoV2', 'fetchOneVideoV3', 'fetchVideoDetail', 'fetchOneVideo'],
  get_user_profile: ['fetchUserProfile', 'fetchUserInfo'],
  get_hot_search: ['fetchHotSearch'],
  get_comments: ['fetchVideoComments', 'fetchCommentReply'],
  get_comment_replies: ['fetchCommentReply'],
  get_user_videos: ['fetchUserPostVideos', 'fetchUserVideos'],
  get_video_subtitle: ['fetchVideoSubtitle'],
  get_video_danmaku: ['fetchVideoDanmaku'],
  get_live_detail: ['fetchLiveRoomDetail', 'fetchLiveVideos'],
  get_dynamic: ['fetchUserDynamic', 'fetchDynamicDetail', 'fetchDynamicDetailV2'],
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
      const apiName = decision.selected?.apiName || 'fetchSearchByType';
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
    async get_video_detail({ bvid, aid, url, a_id, c_id, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_video_detail', { bvid, aid, url, a_id, c_id });
      let apiName;
      if (url) {
        apiName = 'fetchOneVideoV3';
      } else if (a_id && c_id) {
        apiName = 'fetchOneVideoV2';
      } else if (bvid) {
        apiName = 'fetchOneVideo';
      } else if (aid) {
        apiName = 'fetchVideoDetail';
      } else {
        apiName = decision.selected?.apiName || 'fetchVideoDetail';
      }
      const result = await api[apiName]({ bvid, aid, url, a_id, c_id, bv_id: bvid });
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
    async get_user_profile({ uid, user_id, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_user_profile', { uid, user_id });
      let apiName;
      if (uid) {
        apiName = 'fetchUserProfile';
      } else if (user_id) {
        apiName = 'fetchUserInfo';
      } else {
        apiName = decision.selected?.apiName || 'fetchUserProfile';
      }
      const result = await api[apiName]({ uid, user_id });
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

    // 获取热搜
    async get_hot_search({  }) {
      const result = await api.fetchHotSearch({});
      return {
        success: true,
        intent: 'get_hot_search',
        data: data.formatItem(result),
        _decision: {
          selectedApi: 'fetchHotSearch',
          costEstimate: { perCall: 0.01, currency: 'CNY', estimatedTotal: 0.01 },
        },
      };
    },

    // 获取视频评论
    async get_comments({ bv_id, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_comments', { bv_id });
      const apiName = decision.selected?.apiName || 'fetchVideoComments';
      const result = await api[apiName]({ bv_id });
      return {
        success: true,
        intent: 'get_comments',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
        },
      };
    },

    // 获取评论回复
    async get_comment_replies({ bv_id, rpid, page = 1, count = 20 }) {
      const result = await api.fetchCommentReply({ bv_id, rpid });
      return {
        success: true,
        intent: 'get_comment_replies',
        data: data.formatItem(result),
        _decision: {
          selectedApi: 'fetchCommentReply',
          costEstimate: { perCall: 0.01, currency: 'CNY', estimatedTotal: 0.01 },
        },
      };
    },

    // 获取用户投稿
    async get_user_videos({ uid, user_id, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_user_videos', { uid, user_id });
      let apiName;
      if (uid) {
        apiName = 'fetchUserPostVideos';
      } else if (user_id) {
        apiName = 'fetchUserVideos';
      } else {
        apiName = decision.selected?.apiName || 'fetchUserPostVideos';
      }
      const result = await api[apiName]({ uid, user_id });
      return {
        success: true,
        intent: 'get_user_videos',
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
