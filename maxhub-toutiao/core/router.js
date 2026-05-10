// 指令路由、分支分发 - 头条平台
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
    // 获取文章详情
    async get_article_detail({ item_id, page = 1, count = 20 }) {
      const result = await api.getArticleInfo({ item_id });
      return {
        success: true,
        intent: 'get_article_detail',
        data: data.formatItem(result),
      };
    },

    // 获取视频详情
    async get_video_detail({ item_id, page = 1, count = 20 }) {
      const result = await api.getVideoInfo({ item_id });
      return {
        success: true,
        intent: 'get_video_detail',
        data: data.formatItem(result),
      };
    },

    // 获取用户信息
    async get_user_profile({ user_id, page = 1, count = 20 }) {
      const result = await api.getUserInfo({ user_id });
      return {
        success: true,
        intent: 'get_user_profile',
        data: data.formatItem(result),
      };
    },

    // 获取评论
    async get_comments({ item_id, page = 1, count = 20 }) {
      const result = await api.getComments({ item_id });
      return {
        success: true,
        intent: 'get_comments',
        data: data.formatItem(result),
      };
    },

  },
};

module.exports = router;
