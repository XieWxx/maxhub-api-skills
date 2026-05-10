// 指令路由、分支分发 - YouTube平台
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
    async search({ keyword, page = 1, count = 20 }) {
      const result = await api.searchVideo({ keyword });
      return {
        success: true,
        intent: 'search',
        data: data.formatItem(result),
      };
    },

    // 获取视频详情
    async get_video_detail({ videoId, page = 1, count = 20 }) {
      const result = await api.getVideoInfo({ videoId });
      return {
        success: true,
        intent: 'get_video_detail',
        data: data.formatItem(result),
      };
    },

    // 获取频道信息
    async get_channel_profile({ channelId, page = 1, count = 20 }) {
      const result = await api.getChannelInfo({ channelId });
      return {
        success: true,
        intent: 'get_channel_profile',
        data: data.formatItem(result),
      };
    },

    // 获取评论
    async get_comments({ videoId, page = 1, count = 20 }) {
      const result = await api.getVideoComments({ videoId });
      return {
        success: true,
        intent: 'get_comments',
        data: data.formatItem(result),
      };
    },

    // 获取频道视频
    async get_channel_videos({ channelId, page = 1, count = 20 }) {
      const result = await api.getChannelVideos({ channelId });
      return {
        success: true,
        intent: 'get_channel_videos',
        data: data.formatItem(result),
      };
    },

  },
};

module.exports = router;
