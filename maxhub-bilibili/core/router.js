// 指令路由、分支分发 - B站平台
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
      const result = await api.fetchSearchByType({ keyword });
      return {
        success: true,
        intent: 'search_user',
        data: data.formatItem(result),
      };
    },

    // 获取视频详情
    async get_video_detail({ bvid, aid, page = 1, count = 20 }) {
      if (bvid) {
        const result = await api.fetchOneVideo({ bv_id: bvid });
        return { success: true, intent: 'get_video_detail', data: data.formatItem(result) };
      } else if (aid) {
        const result = await api.fetchVideoDetail({ aid });
        return { success: true, intent: 'get_video_detail', data: data.formatItem(result) };
      }
      return { success: false, message: '请提供必要参数(bvid或aid)' };
    },

    // 获取用户信息
    async get_user_profile({ uid, page = 1, count = 20 }) {
      const result = await api.fetchUserProfile({ uid });
      return {
        success: true,
        intent: 'get_user_profile',
        data: data.formatItem(result),
      };
    },

    // 获取热搜
    async get_hot_search({  }) {
      const result = await api.fetchHotSearch({});
      return {
        success: true,
        intent: 'get_hot_search',
        data: data.formatItem(result),
      };
    },

    // 获取视频评论
    async get_comments({ bv_id, page = 1, count = 20 }) {
      const result = await api.fetchVideoComments({ bv_id });
      return {
        success: true,
        intent: 'get_comments',
        data: data.formatItem(result),
      };
    },

    // 获取评论回复
    async get_comment_replies({ bv_id, rpid, page = 1, count = 20 }) {
      const result = await api.fetchCommentReply({ bv_id, rpid });
      return {
        success: true,
        intent: 'get_comment_replies',
        data: data.formatItem(result),
      };
    },

    // 获取用户投稿
    async get_user_videos({ uid, page = 1, count = 20 }) {
      const result = await api.fetchUserPostVideos({ uid });
      return {
        success: true,
        intent: 'get_user_videos',
        data: data.formatItem(result),
      };
    },

  },
};

module.exports = router;
