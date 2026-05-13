// 指令路由、分支分发 - YouTube平台
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
  apiPrefix: '/api/v1/youtube',
  costWeight: 0.6,
  latencyWeight: 0.25,
  completenessWeight: 0.15,
});

/**
 * 意图到API方案的映射
 * 同一意图可映射多个API，决策引擎自动选择最优
 */
const INTENT_API_MAP = {
  search: ['searchVideo', 'getGeneralSearch', 'getGeneralSearchV2', 'searchChannels'],
  get_video_detail: ['getVideoInfo', 'getVideoInfoV2', 'getVideoInfoV3'],
  get_channel_profile: ['getChannelInfo', 'getChannelDescription'],
  get_comments: ['getVideoComments'],
  get_channel_videos: ['getChannelVideos', 'getChannelVideosV2', 'getChannelVideosV3'],
  get_channel_shorts: ['getChannelShorts', 'getChannelShortVideos'],
  get_trending: ['getTrendingVideos'],
  get_video_captions: ['getVideoCaptions', 'getVideoSubtitles'],
  get_related_videos: ['getRelatedVideos', 'getRelateVideo'],
  get_channel_posts: ['getChannelCommunityPosts'],
  get_post_detail: ['getPostDetail'],
  get_video_streams: ['getVideoStreams', 'getVideoStreamsV2'],
  search_shorts: ['getShortsSearch', 'getShortsSearchV2'],
  get_channel_id: ['getChannelId', 'getChannelIdV2'],
  get_channel_email: ['getChannelEmail'],
  get_search_suggestions: ['getSearchSuggestions'],
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
    async search({ keyword, query, page = 1, count = 20 }) {
      const searchQuery = keyword || query;
      const decision = router.decideBestApi('search', { search_query: searchQuery });
      const apiName = decision.selected?.apiName || 'searchVideo';
      const result = await api[apiName]({ search_query: searchQuery });
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

    // 获取视频详情
    async get_video_detail({ videoId, video_id, page = 1, count = 20 }) {
      const vid = videoId || video_id;
      const decision = router.decideBestApi('get_video_detail', { video_id: vid });
      const apiName = decision.selected?.apiName || 'getVideoInfo';
      const result = await api[apiName]({ video_id: vid });
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

    // 获取频道信息
    async get_channel_profile({ channelId, channel_id, page = 1, count = 20 }) {
      const cid = channelId || channel_id;
      const decision = router.decideBestApi('get_channel_profile', { channel_id: cid });
      const apiName = decision.selected?.apiName || 'getChannelInfo';
      const result = await api[apiName]({ channel_id: cid });
      return {
        success: true,
        intent: 'get_channel_profile',
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
    async get_comments({ videoId, video_id, page = 1, count = 20 }) {
      const vid = videoId || video_id;
      const decision = router.decideBestApi('get_comments', { video_id: vid });
      const apiName = decision.selected?.apiName || 'getVideoComments';
      const result = await api[apiName]({ video_id: vid });
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

    // 获取频道视频
    async get_channel_videos({ channelId, channel_id, page = 1, count = 20 }) {
      const cid = channelId || channel_id;
      const decision = router.decideBestApi('get_channel_videos', { channel_id: cid });
      const apiName = decision.selected?.apiName || 'getChannelVideos';
      const result = await api[apiName]({ channel_id: cid });
      return {
        success: true,
        intent: 'get_channel_videos',
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
