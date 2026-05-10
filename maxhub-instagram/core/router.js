// 指令路由、分支分发 - Instagram平台
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
    async search_user({ keyword, page = 1, count = 20 }) {
      const result = await api.searchUsers({ keyword });
      return {
        success: true,
        intent: 'search_user',
        data: data.formatItem(result),
      };
    },

    // 获取用户信息
    async get_user_profile({ username, page = 1, count = 20 }) {
      if (username) {
        const result = await api.fetchUserInfoByUsername({ username });
        return { success: true, intent: 'get_user_profile', data: data.formatItem(result) };
      } else if (user_id) {
        const result = await api.fetchUserInfoById({ user_id });
        return { success: true, intent: 'get_user_profile', data: data.formatItem(result) };
      }
      return { success: false, message: '请提供必要参数' };
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
    async get_post_detail({ shortcode, page = 1, count = 20 }) {
      const result = await api.fetchPostByUrl({ shortcode });
      return {
        success: true,
        intent: 'get_post_detail',
        data: data.formatItem(result),
      };
    },

    // 获取评论
    async get_comments({ shortcode, page = 1, count = 20 }) {
      const result = await api.fetchPostComments({ shortcode });
      return {
        success: true,
        intent: 'get_comments',
        data: data.formatItem(result),
      };
    },

  },
};

module.exports = router;
