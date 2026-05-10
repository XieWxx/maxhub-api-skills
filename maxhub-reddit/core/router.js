// 指令路由、分支分发 - Reddit平台
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
    // 搜索
    async search({ keyword, page = 1, count = 20 }) {
      const result = await api.fetchDynamicSearch({ keyword });
      return {
        success: true,
        intent: 'search',
        data: data.formatItem(result),
      };
    },

    // 获取版块帖子
    async get_subreddit_feed({ subreddit_name, page = 1, count = 20 }) {
      const result = await api.fetchSubredditFeed({ subreddit_name });
      return {
        success: true,
        intent: 'get_subreddit_feed',
        data: data.formatItem(result),
      };
    },

    // 获取帖子详情
    async get_post_detail({ post_id, page = 1, count = 20 }) {
      const result = await api.fetchPostDetails({ post_id });
      return {
        success: true,
        intent: 'get_post_detail',
        data: data.formatItem(result),
      };
    },

    // 获取评论
    async get_comments({ post_id, page = 1, count = 20 }) {
      const result = await api.fetchPostComments({ post_id });
      return {
        success: true,
        intent: 'get_comments',
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

  },
};

module.exports = router;
