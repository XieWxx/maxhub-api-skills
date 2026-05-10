// 指令路由、分支分发 - Threads平台
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
    // 搜索用户
    async search({ keyword, page = 1, count = 20 }) {
      const result = await api.searchProfiles({ keyword });
      return {
        success: true,
        intent: 'search',
        data: data.formatItem(result),
      };
    },

    // 获取用户信息
    async get_user_profile({ username, page = 1, count = 20 }) {
      const result = await api.fetchUserInfo({ username });
      return {
        success: true,
        intent: 'get_user_profile',
        data: data.formatItem(result),
      };
    },

    // 获取用户帖子
    async get_user_posts({ user_id, page = 1, count = 20 }) {
      const result = await api.fetchUserPosts({ user_id });
      return {
        success: true,
        intent: 'get_user_posts',
        data: data.formatItem(result),
      };
    },

    // 获取帖子详情
    async get_post_detail({ post_id, page = 1, count = 20 }) {
      const result = await api.fetchPostDetail({ post_id });
      return {
        success: true,
        intent: 'get_post_detail',
        data: data.formatItem(result),
      };
    },

  },
};

module.exports = router;
