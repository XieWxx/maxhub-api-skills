// 指令路由、分支分发 - TikTok平台
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
      const result = await api.fetchGeneralSearch({ keyword });
      return {
        success: true,
        intent: 'search_video',
        data: data.formatItem(result),
      };
    },

    // 搜索用户
    async search_user({ keyword, page = 1, count = 20 }) {
      const result = await api.fetchSearchUser({ keyword });
      return {
        success: true,
        intent: 'search_user',
        data: data.formatItem(result),
      };
    },

    // 获取视频详情
    async get_video_detail({ aweme_id, page = 1, count = 20 }) {
      const result = await api.fetchOneVideo({ aweme_id });
      return {
        success: true,
        intent: 'get_video_detail',
        data: data.formatItem(result),
      };
    },

    // 获取用户信息
    async get_user_profile({ unique_id, page = 1, count = 20 }) {
      if (unique_id) {
        const result = await api.fetchUserProfile({ unique_id });
        return { success: true, intent: 'get_user_profile', data: data.formatItem(result) };
      } else if (sec_uid) {
        const result = await api.handlerUserProfile({ sec_uid });
        return { success: true, intent: 'get_user_profile', data: data.formatItem(result) };
      }
      return { success: false, message: '请提供必要参数' };
    },

    // 获取评论
    async get_comments({ aweme_id, page = 1, count = 20 }) {
      const result = await api.fetchVideoComments({ aweme_id });
      return {
        success: true,
        intent: 'get_comments',
        data: data.formatItem(result),
      };
    },

    // 获取用户视频
    async get_user_videos({ sec_uid, page = 1, count = 20 }) {
      const result = await api.fetchUserPostVideos({ sec_uid });
      return {
        success: true,
        intent: 'get_user_videos',
        data: data.formatItem(result),
      };
    },

  },
};

module.exports = router;
