// 指令路由、分支分发 - Twitter/X平台
// 根据用户意图路由到对应的API调用

const api = require('../service/api');
const data = require('../service/data');

const router = {
  async dispatch(intent, params = {}) {
    const handler = this.routes[intent];
    if (!handler) {
      return { success: false, message: `未识别的意图: ${intent}` };
    }
    return handler(params);
  },

  routes: {
    // 搜索推文
    async search({ keyword, page = 1, count = 20 }) {
      const result = await api.fetchSearchTimeline({ keyword });
      return {
        success: true,
        intent: 'search',
        data: data.formatItem(result),
      };
    },

    // 获取用户信息
    async get_user_profile({ username, page = 1, count = 20 }) {
      const result = await api.fetchUserProfile({ username });
      return {
        success: true,
        intent: 'get_user_profile',
        data: data.formatItem(result),
      };
    },

    // 获取推文详情
    async get_tweet_detail({ tweet_id, page = 1, count = 20 }) {
      const result = await api.fetchTweetDetail({ tweet_id });
      return {
        success: true,
        intent: 'get_tweet_detail',
        data: data.formatItem(result),
      };
    },

    // 获取用户推文
    async get_user_tweets({ user_id, page = 1, count = 20 }) {
      const result = await api.fetchUserPostTweet({ user_id });
      return {
        success: true,
        intent: 'get_user_tweets',
        data: data.formatItem(result),
      };
    },

  },
};

module.exports = router;
