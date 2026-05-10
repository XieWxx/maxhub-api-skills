// 指令路由、分支分发 - Sora2平台
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
    // 搜索创作者
    async search_user({ keyword, page = 1, count = 20 }) {
      const result = await api.searchUsers({ keyword });
      return {
        success: true,
        intent: 'search_user',
        data: data.formatItem(result),
      };
    },

    // 获取创作者信息
    async get_user_profile({ user_id, page = 1, count = 20 }) {
      const result = await api.getUserProfile({ user_id });
      return {
        success: true,
        intent: 'get_user_profile',
        data: data.formatItem(result),
      };
    },

    // 获取创作者作品
    async get_user_posts({ user_id, page = 1, count = 20 }) {
      const result = await api.getUserPosts({ user_id });
      return {
        success: true,
        intent: 'get_user_posts',
        data: data.formatItem(result),
      };
    },

    // 获取作品详情
    async get_post_detail({ post_id, page = 1, count = 20 }) {
      const result = await api.getPostDetail({ post_id });
      return {
        success: true,
        intent: 'get_post_detail',
        data: data.formatItem(result),
      };
    },

    // 获取作品评论
    async get_comments({ post_id, page = 1, count = 20 }) {
      const result = await api.getPostComments({ post_id });
      return {
        success: true,
        intent: 'get_comments',
        data: data.formatItem(result),
      };
    },

    // 获取推荐内容
    async get_feed({  }) {
      const result = await api.getFeed({});
      return {
        success: true,
        intent: 'get_feed',
        data: data.formatItem(result),
      };
    },

  },
};

module.exports = router;
