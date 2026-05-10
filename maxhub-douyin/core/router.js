// 指令路由、分支分发 - 抖音平台
// 根据用户意图路由到对应的API调用

const api = require('../service/api');
const data = require('../service/data');
const utils = require('../service/utils');

/**
 * 意图路由器
 * 根据用户输入的意图，分发到对应的处理函数
 */
const router = {
  /**
   * 路由入口
   * @param {string} intent - 用户意图
   * @param {object} params - 参数
   * @returns {Promise<object>} 处理结果
   */
  async dispatch(intent, params = {}) {
    const handler = this.routes[intent];
    if (!handler) {
      return { success: false, message: `未识别的意图: ${intent}` };
    }
    return handler(params);
  },

  /**
   * 路由表
   */
  routes: {
    // 搜索视频
    async search_video({ keyword, page = 1, count = 20 }) {
      const result = await api.searchVideo(keyword, page, count);
      return {
        success: true,
        intent: 'search_video',
        data: (result.data || []).map(item => data.formatVideoInfo(item)),
        hasMore: result.has_more || false,
        cursor: result.cursor || null,
      };
    },

    // 搜索用户
    async search_user({ keyword, page = 1, count = 20 }) {
      const result = await api.searchUser(keyword, page, count);
      return {
        success: true,
        intent: 'search_user',
        data: (result.data || []).map(item => data.formatUserProfile(item)),
        hasMore: result.has_more || false,
      };
    },

    // 获取视频详情
    async get_video_detail({ aweme_id, share_url }) {
      let result;
      if (share_url) {
        result = await api.fetchVideoByShareUrl(share_url);
      } else if (aweme_id) {
        result = await api.fetchOneVideo(aweme_id);
      } else {
        return { success: false, message: '请提供视频ID或分享链接' };
      }
      return {
        success: true,
        intent: 'get_video_detail',
        data: data.formatVideoInfo(result.data),
      };
    },

    // 获取用户信息
    async get_user_profile({ sec_user_id, unique_id, uid }) {
      let result;
      if (unique_id) {
        result = await api.fetchUserProfileByUniqueId(unique_id);
      } else if (uid) {
        result = await api.fetchUserProfileByUid(uid);
      } else if (sec_user_id) {
        result = await api.fetchUserProfile(sec_user_id);
      } else {
        return { success: false, message: '请提供用户ID、抖音号或sec_user_id' };
      }
      return {
        success: true,
        intent: 'get_user_profile',
        data: data.formatUserProfile(result.data),
      };
    },

    // 获取热搜
    async get_hot_search() {
      const result = await api.fetchHotSearch();
      return {
        success: true,
        intent: 'get_hot_search',
        data: data.formatHotSearch(result),
      };
    },

    // 获取视频评论
    async get_comments({ aweme_id, page = 1, count = 20 }) {
      const result = await api.fetchVideoComments(aweme_id, page, count);
      return {
        success: true,
        intent: 'get_comments',
        data: data.formatComments(result.data),
        hasMore: result.has_more || false,
      };
    },

    // 获取直播数据
    async get_live_data({ sec_user_id, webcast_id }) {
      let result;
      if (sec_user_id) {
        result = await api.fetchLiveBySecUid(sec_user_id);
      } else if (webcast_id) {
        result = await api.fetchUserLiveVideos(webcast_id);
      } else {
        return { success: false, message: '请提供sec_user_id或直播间号' };
      }
      return {
        success: true,
        intent: 'get_live_data',
        data: data.formatLiveData(result.data),
      };
    },

    // 获取热门趋势
    async get_trending() {
      const [hotTopic, hotWords] = await Promise.all([
        api.fetchCurrentHotTopic(),
        api.fetchHotWords(),
      ]);
      return {
        success: true,
        intent: 'get_trending',
        data: {
          hotTopics: hotTopic.data || [],
          hotWords: hotWords.data || [],
        },
      };
    },
  },
};

module.exports = router;
