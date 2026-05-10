// 指令路由、分支分发 - 抖音平台
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
      const result = await api.fetchGeneralSearchV2({ keyword });
      return {
        success: true,
        intent: 'search_video',
        data: data.formatItem(result),
        hasMore: result.has_more || false,
      };
    },

    // 搜索用户
    async search_user({ keyword, page = 1, count = 20 }) {
      const result = await api.fetchUserSearchV2({ keyword });
      return {
        success: true,
        intent: 'search_user',
        data: data.formatItem(result),
        hasMore: result.has_more || false,
      };
    },

    // 获取视频详情
    async get_video_detail({ aweme_id, share_url }) {
      if (aweme_id) {
        const result = await api.fetchOneVideo({ aweme_id });
        return { success: true, intent: 'get_video_detail', data: data.formatItem(result) };
      } else if (share_url) {
        const result = await api.fetchOneVideoByShareUrl({ share_url });
        return { success: true, intent: 'get_video_detail', data: data.formatItem(result) };
      }
      return { success: false, message: '请提供必要参数' };
    },

    // 获取用户信息
    async get_user_profile({ sec_user_id, unique_id, uid }) {
      if (sec_user_id) {
        const result = await api.handlerUserProfile({ sec_user_id });
        return { success: true, intent: 'get_user_profile', data: data.formatItem(result) };
      } else if (unique_id) {
        const result = await api.handlerUserProfileV2({ unique_id });
        return { success: true, intent: 'get_user_profile', data: data.formatItem(result) };
      } else if (uid) {
        const result = await api.fetchUserProfileByUid({ uid });
        return { success: true, intent: 'get_user_profile', data: data.formatItem(result) };
      }
      return { success: false, message: '请提供必要参数' };
    },

    // 获取热搜
    async get_hot_search({  }) {
      const result = await api.fetchHotSearchResult({});
      return {
        success: true,
        intent: 'get_hot_search',
        data: data.formatItem(result),
      };
    },

    // 获取视频评论
    async get_comments({ aweme_id, page = 1, count = 20 }) {
      const result = await api.fetchVideoComments({ aweme_id });
      return {
        success: true,
        intent: 'get_comments',
        data: data.formatItem(result),
        hasMore: result.has_more || false,
      };
    },

    // 获取评论回复
    async get_comment_replies({ item_id, comment_id }) {
      const result = await api.fetchVideoCommentReplies({ item_id, comment_id });
      return {
        success: true,
        intent: 'get_comment_replies',
        data: data.formatItem(result),
        
      };
    },

    // 获取直播数据
    async get_live_data({ sec_uid, webcast_id, room_id }) {
      if (sec_uid) {
        const result = await api.fetchUserLiveVideosBySecUid({ sec_uid });
        return { success: true, intent: 'get_live_data', data: data.formatItem(result) };
      } else if (webcast_id) {
        const result = await api.fetchUserLiveVideos({ webcast_id });
        return { success: true, intent: 'get_live_data', data: data.formatItem(result) };
      } else if (room_id) {
        const result = await api.fetchUserLiveVideosByRoomId({ room_id });
        return { success: true, intent: 'get_live_data', data: data.formatItem(result) };
      }
      return { success: false, message: '请提供必要参数' };
    },

    // 获取热门趋势
    async get_trending({  }) {
      const results = await Promise.all([
        api.fetchCurrentHotTopic(),
        api.fetchHotWords(),
      ]);
      return {
        success: true,
        intent: 'get_trending',
        data: results.map(r => data.formatItem(r)),
      };
    },

    // 获取用户作品
    async get_user_videos({ sec_user_id, page = 1, count = 20 }) {
      const result = await api.fetchUserPostVideos({ sec_user_id });
      return {
        success: true,
        intent: 'get_user_videos',
        data: data.formatItem(result),
        hasMore: result.has_more || false,
      };
    },

  },
};

module.exports = router;
