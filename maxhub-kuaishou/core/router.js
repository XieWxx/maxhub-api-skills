// 指令路由、分支分发 - 快手平台
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
    // 搜索视频
    async search_video({ keyword, page = 1, count = 20 }) {
      const result = await api.searchComprehensive({ keyword });
      return {
        success: true,
        intent: 'search_video',
        data: data.formatItem(result),
      };
    },

    // 获取视频详情
    async get_video_detail({ photo_id, page = 1, count = 20 }) {
      const result = await api.fetchOneVideo({ photo_id });
      return {
        success: true,
        intent: 'get_video_detail',
        data: data.formatItem(result),
      };
    },

    // 获取用户信息
    async get_user_profile({ user_id, page = 1, count = 20 }) {
      const result = await api.fetchUserInfo({ user_id });
      return {
        success: true,
        intent: 'get_user_profile',
        data: data.formatItem(result),
      };
    },

    // 获取用户作品
    async get_user_videos({ user_id, page = 1, count = 20 }) {
      const result = await api.fetchUserPost({ user_id });
      return {
        success: true,
        intent: 'get_user_videos',
        data: data.formatItem(result),
      };
    },

    // 获取评论
    async get_comments({ photo_id, page = 1, count = 20 }) {
      const result = await api.fetchOneVideoComment({ photo_id });
      return {
        success: true,
        intent: 'get_comments',
        data: data.formatItem(result),
      };
    },

  },
};

module.exports = router;
