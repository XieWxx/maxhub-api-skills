// 指令路由、分支分发 - Instagram平台
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
  apiPrefix: '/api/v1/instagram',
  costWeight: 0.6,
  latencyWeight: 0.25,
  completenessWeight: 0.15,
});

/**
 * 意图到API方案的映射
 * 同一意图可映射多个API，决策引擎自动选择最优
 */
const INTENT_API_MAP = {
  search_user: ['searchUsers', 'fetchSearch', 'generalSearch'],
  get_user_profile: ['fetchUserInfoByUsername', 'fetchUserInfoByUsernameV2', 'fetchUserInfoByUsernameV3', 'fetchUserInfoById', 'fetchUserInfoByIdV2', 'getUserProfile', 'getUserBrief'],
  get_user_posts: ['fetchUserPostsV2', 'fetchUserPosts', 'getUserPosts'],
  get_post_detail: ['fetchPostByUrl', 'fetchPostByUrlV2', 'fetchPostById', 'fetchPostInfo', 'getPostInfo', 'getPostInfoByCode'],
  get_comments: ['fetchPostCommentsV2', 'fetchPostComments', 'getPostComments', 'fetchCommentReplies', 'getCommentReplies'],
  get_user_followers: ['fetchUserFollowers', 'getUserFollowers'],
  get_user_following: ['fetchUserFollowing', 'getUserFollowing'],
  get_user_stories: ['fetchUserStories', 'getUserStories'],
  get_user_highlights: ['fetchUserHighlights', 'getUserHighlights', 'getHighlightStories'],
  get_user_reels: ['fetchUserReels', 'getUserReels'],
  search_hashtag: ['fetchHashtagPosts', 'searchHashtags'],
  search_location: ['searchLocations', 'searchPlaces', 'searchByCoordinates'],
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
    async search_user({ keyword, query, page = 1, count = 20 }) {
      const searchQuery = keyword || query;
      const decision = router.decideBestApi('search_user', { query: searchQuery });
      const apiName = decision.selected?.apiName || 'searchUsers';
      const result = await api[apiName]({ query: searchQuery });
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

    // 获取用户信息
    async get_user_profile({ username, user_id, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_user_profile', { username, user_id });
      let apiName;
      if (username) {
        apiName = 'fetchUserInfoByUsername';
      } else if (user_id) {
        apiName = 'fetchUserInfoById';
      } else {
        apiName = decision.selected?.apiName || 'fetchUserInfoByUsername';
      }
      const result = await api[apiName]({ username, user_id });
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

    // 获取用户帖子
    async get_user_posts({ user_id, username, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_user_posts', { user_id, username });
      let apiName;
      if (user_id) {
        apiName = 'fetchUserPostsV2';
      } else if (username) {
        apiName = 'getUserPosts';
      } else {
        apiName = decision.selected?.apiName || 'fetchUserPostsV2';
      }
      const result = await api[apiName]({ user_id, username });
      return {
        success: true,
        intent: 'get_user_posts',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
          alternatives: decision.alternatives?.map(a => a.apiName),
        },
      };
    },

    // 获取帖子详情
    async get_post_detail({ shortcode, post_url, post_id, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_post_detail', { shortcode, post_url, post_id });
      let apiName;
      if (post_url || shortcode) {
        apiName = 'fetchPostByUrl';
      } else if (post_id) {
        apiName = 'fetchPostById';
      } else {
        apiName = decision.selected?.apiName || 'fetchPostByUrl';
      }
      const result = await api[apiName]({ post_url: post_url || shortcode, post_id });
      return {
        success: true,
        intent: 'get_post_detail',
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
    async get_comments({ shortcode, media_id, code_or_url, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_comments', { shortcode, media_id, code_or_url });
      let apiName;
      if (media_id) {
        apiName = 'fetchPostCommentsV2';
      } else if (code_or_url) {
        apiName = 'fetchPostComments';
      } else if (shortcode) {
        apiName = 'getPostComments';
      } else {
        apiName = decision.selected?.apiName || 'fetchPostComments';
      }
      const result = await api[apiName]({ media_id, code_or_url, code: shortcode });
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

  },
};

module.exports = router;
