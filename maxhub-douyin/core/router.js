// 指令路由、分支分发 - 抖音平台
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
  apiPrefix: '/api/v1/douyin',
  costWeight: 0.6,
  latencyWeight: 0.25,
  completenessWeight: 0.15,
});

/**
 * 意图到API方案的映射
 * 同一意图可映射多个API，决策引擎自动选择最优
 */
const INTENT_API_MAP = {
  get_video_detail: ['fetchOneVideo', 'fetchOneVideoV2', 'fetchOneVideoV3', 'fetchOneVideoByShareUrl'],
  get_user_profile: ['handlerUserProfile', 'handlerUserProfileV2', 'handlerUserProfileV3', 'handlerUserProfileV4', 'fetchUserProfileByUid', 'fetchUserProfileByShortId'],
  search_video: ['fetchGeneralSearchV2', 'fetchVideoSearchV1', 'fetchVideoSearchV2', 'fetchGeneralSearchV1'],
  search_user: ['fetchUserSearchV2', 'fetchUserSearch', 'fetchUserSearchResult'],
  get_comments: ['fetchVideoComments'],
  get_hot_search: ['fetchHotSearchResult', 'fetchHotSearchList'],
  get_user_videos: ['fetchUserPostVideos'],
  get_live_data: ['fetchUserLiveVideosBySecUid', 'fetchUserLiveVideosByRoomId', 'fetchUserLiveVideos'],
  get_trending: ['fetchCurrentHotTopic', 'fetchHotWords'],
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
      const apiName = decision.selected?.apiName || 'fetchGeneralSearchV2';
      const result = await api[apiName]({ keyword });
      return {
        success: true,
        intent: 'search_video',
        data: data.formatItem(result),
        hasMore: result.has_more || false,
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
      const apiName = decision.selected?.apiName || 'fetchUserSearchV2';
      const result = await api[apiName]({ keyword });
      return {
        success: true,
        intent: 'search_user',
        data: data.formatItem(result),
        hasMore: result.has_more || false,
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
          alternatives: decision.alternatives?.map(a => a.apiName),
        },
      };
    },

    // 获取视频详情
    async get_video_detail({ aweme_id, share_url }) {
      const decision = router.decideBestApi('get_video_detail', { aweme_id, share_url });
      let apiName;
      if (aweme_id) {
        apiName = 'fetchOneVideo';
      } else if (share_url) {
        apiName = 'fetchOneVideoByShareUrl';
      } else {
        apiName = decision.selected?.apiName || 'fetchOneVideo';
      }
      const result = await api[apiName]({ aweme_id, share_url });
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
    async get_user_profile({ sec_user_id, unique_id, uid, short_id }) {
      const decision = router.decideBestApi('get_user_profile', { sec_user_id, unique_id, uid, short_id });
      let apiName;
      if (sec_user_id) {
        apiName = 'handlerUserProfile';
      } else if (unique_id) {
        apiName = 'handlerUserProfileV2';
      } else if (uid) {
        apiName = 'fetchUserProfileByUid';
      } else if (short_id) {
        apiName = 'fetchUserProfileByShortId';
      } else {
        apiName = decision.selected?.apiName || 'handlerUserProfile';
      }
      const result = await api[apiName]({ sec_user_id, unique_id, uid, short_id });
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

    // 获取热搜
    async get_hot_search({  }) {
      const decision = router.decideBestApi('get_hot_search', {});
      const apiName = decision.selected?.apiName || 'fetchHotSearchResult';
      const result = await api[apiName]({});
      return {
        success: true,
        intent: 'get_hot_search',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
          alternatives: decision.alternatives?.map(a => a.apiName),
        },
      };
    },

    // 获取视频评论
    async get_comments({ aweme_id, page = 1, count = 20 }) {
      const result = await api.fetchVideoComments({ aweme_id });
      return {
        success: true,
        intent: 'get_comments',
        data: data.formatItem(result),
        hasMore: result.has_more || false,
        _decision: {
          selectedApi: 'fetchVideoComments',
          costEstimate: { perCall: 0.01, currency: 'CNY', estimatedTotal: 0.01 },
        },
      };
    },

    // 获取评论回复
    async get_comment_replies({ item_id, comment_id }) {
      const result = await api.fetchVideoCommentReplies({ item_id, comment_id });
      return {
        success: true,
        intent: 'get_comment_replies',
        data: data.formatItem(result),
        _decision: {
          selectedApi: 'fetchVideoCommentReplies',
          costEstimate: { perCall: 0.01, currency: 'CNY', estimatedTotal: 0.01 },
        },
      };
    },

    // 获取直播数据
    async get_live_data({ sec_uid, webcast_id, room_id }) {
      const decision = router.decideBestApi('get_live_data', { sec_uid, webcast_id, room_id });
      let apiName;
      if (sec_uid) {
        apiName = 'fetchUserLiveVideosBySecUid';
      } else if (webcast_id) {
        apiName = 'fetchUserLiveVideos';
      } else if (room_id) {
        apiName = 'fetchUserLiveVideosByRoomId';
      } else {
        apiName = decision.selected?.apiName || 'fetchUserLiveVideosBySecUid';
      }
      const result = await api[apiName]({ sec_uid, webcast_id, room_id });
      return {
        success: true,
        intent: 'get_live_data',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
          alternatives: decision.alternatives?.map(a => a.apiName),
        },
      };
    },

    // 获取热门趋势
    async get_trending({  }) {
      const decision = router.decideBestApi('get_trending', {});
      const results = await Promise.all([
        api.fetchCurrentHotTopic(),
        api.fetchHotWords(),
      ]);
      return {
        success: true,
        intent: 'get_trending',
        data: results.map(r => data.formatItem(r)),
        _decision: {
          selectedApi: 'fetchCurrentHotTopic,fetchHotWords',
          reason: decision.reason,
          costEstimate: { perCall: 0.02, currency: 'CNY', estimatedTotal: 0.02 },
        },
      };
    },

    // 获取用户作品
    async get_user_videos({ sec_user_id, page = 1, count = 20 }) {
      const result = await api.fetchUserPostVideos({ sec_user_id });
      return {
        success: true,
        intent: 'get_user_videos',
        data: data.formatItem(result),
        hasMore: result.has_more || false,
        _decision: {
          selectedApi: 'fetchUserPostVideos',
          costEstimate: { perCall: 0.01, currency: 'CNY', estimatedTotal: 0.01 },
        },
      };
    },

  },
};

module.exports = router;
