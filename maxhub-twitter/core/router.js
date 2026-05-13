// 指令路由、分支分发 - Twitter/X平台
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
  apiPrefix: '/api/v1/twitter',
  costWeight: 0.6,
  latencyWeight: 0.25,
  completenessWeight: 0.15,
});

/**
 * 意图到API方案的映射
 * 同一意图可映射多个API，决策引擎自动选择最优
 */
const INTENT_API_MAP = {
  search: ['fetchSearchTimeline'],
  get_user_profile: ['fetchUserProfile'],
  get_tweet_detail: ['fetchTweetDetail'],
  get_user_tweets: ['fetchUserPostTweet'],
  get_user_replies: ['fetchUserTweetReplies'],
  get_user_highlights: ['fetchUserHighlightsTweets'],
  get_user_media: ['fetchUserMedia'],
  get_retweet_users: ['fetchRetweetUserList'],
  get_trending: ['fetchTrending'],
  get_post_comments: ['fetchPostComments', 'fetchLatestPostComments'],
  get_user_followings: ['fetchUserFollowings'],
  get_user_followers: ['fetchUserFollowers'],
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
    // 搜索推文
    async search({ keyword, page = 1, count = 20 }) {
      const decision = router.decideBestApi('search', { keyword });
      const apiName = decision.selected?.apiName || 'fetchSearchTimeline';
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
    async get_user_profile({ username, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_user_profile', { username });
      const apiName = decision.selected?.apiName || 'fetchUserProfile';
      const result = await api[apiName]({ username });
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

    // 获取推文详情
    async get_tweet_detail({ tweet_id, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_tweet_detail', { tweet_id });
      const apiName = decision.selected?.apiName || 'fetchTweetDetail';
      const result = await api[apiName]({ tweet_id });
      return {
        success: true,
        intent: 'get_tweet_detail',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
        },
      };
    },

    // 获取用户推文
    async get_user_tweets({ user_id, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_user_tweets', { user_id });
      const apiName = decision.selected?.apiName || 'fetchUserPostTweet';
      const result = await api[apiName]({ user_id });
      return {
        success: true,
        intent: 'get_user_tweets',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
        },
      };
    },

    // 获取用户回复
    async get_user_replies({ screen_name, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_user_replies', { screen_name });
      const apiName = decision.selected?.apiName || 'fetchUserTweetReplies';
      const result = await api[apiName]({ screen_name });
      return {
        success: true,
        intent: 'get_user_replies',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
        },
      };
    },

    // 获取用户高亮推文
    async get_user_highlights({ userId, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_user_highlights', { userId });
      const apiName = decision.selected?.apiName || 'fetchUserHighlightsTweets';
      const result = await api[apiName]({ userId });
      return {
        success: true,
        intent: 'get_user_highlights',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
        },
      };
    },

    // 获取用户媒体
    async get_user_media({ screen_name, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_user_media', { screen_name });
      const apiName = decision.selected?.apiName || 'fetchUserMedia';
      const result = await api[apiName]({ screen_name });
      return {
        success: true,
        intent: 'get_user_media',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
        },
      };
    },

    // 获取转推用户列表
    async get_retweet_users({ tweet_id, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_retweet_users', { tweet_id });
      const apiName = decision.selected?.apiName || 'fetchRetweetUserList';
      const result = await api[apiName]({ tweet_id });
      return {
        success: true,
        intent: 'get_retweet_users',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
        },
      };
    },

    // 获取趋势
    async get_trending({ page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_trending', {});
      const apiName = decision.selected?.apiName || 'fetchTrending';
      const result = await api[apiName]({});
      return {
        success: true,
        intent: 'get_trending',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
        },
      };
    },

    // 获取推文评论
    async get_post_comments({ tweet_id, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_post_comments', { tweet_id });
      const apiName = decision.selected?.apiName || 'fetchPostComments';
      const result = await api[apiName]({ tweet_id });
      return {
        success: true,
        intent: 'get_post_comments',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
          alternatives: decision.alternatives?.map(a => a.apiName),
        },
      };
    },

    // 获取用户关注列表
    async get_user_followings({ screen_name, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_user_followings', { screen_name });
      const apiName = decision.selected?.apiName || 'fetchUserFollowings';
      const result = await api[apiName]({ screen_name });
      return {
        success: true,
        intent: 'get_user_followings',
        data: data.formatItem(result),
        _decision: {
          selectedApi: apiName,
          reason: decision.reason,
          costEstimate: decision.costEstimate,
        },
      };
    },

    // 获取用户粉丝列表
    async get_user_followers({ screen_name, page = 1, count = 20 }) {
      const decision = router.decideBestApi('get_user_followers', { screen_name });
      const apiName = decision.selected?.apiName || 'fetchUserFollowers';
      const result = await api[apiName]({ screen_name });
      return {
        success: true,
        intent: 'get_user_followers',
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
