// 指令路由、分支分发 - 混合解析服务
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
    async search({ keyword, page = 1, count = 20 }) {
      const result = await api.search(keyword, page, count);
      return {
        success: true,
        intent: 'search',
        data: data.formatSearchResults(result),
        hasMore: result.has_more || false,
      };
    },

    async get_user_profile(params) {
      const result = await api.fetchUserProfile(params);
      return {
        success: true,
        intent: 'get_user_profile',
        data: data.formatUserProfile(result.data),
      };
    },

    async get_detail({ id }) {
      const result = await api.fetchDetail(id);
      return {
        success: true,
        intent: 'get_detail',
        data: data.formatContentInfo(result.data),
      };
    },

    async get_trending() {
      const result = await api.fetchTrending();
      return {
        success: true,
        intent: 'get_trending',
        data: result.data || [],
      };
    },

    async get_comments({ id, page = 1, count = 20 }) {
      const result = await api.fetchComments(id, page, count);
      return {
        success: true,
        intent: 'get_comments',
        data: result.data || [],
        hasMore: result.has_more || false,
      };
    },
  },
};

module.exports = router;
