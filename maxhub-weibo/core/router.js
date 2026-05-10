// 指令路由、分支分发 - 微博平台
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
    // 搜索微博
    async search({ keyword, page = 1, count = 20 }) {
      const result = await api.fetchSearch({ keyword });
      return {
        success: true,
        intent: 'search',
        data: data.formatItem(result),
      };
    },

    // 获取用户信息
    async get_user_profile({ uid, page = 1, count = 20 }) {
      const result = await api.fetchUserInfo({ uid });
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

    // 获取微博详情
    async get_detail({ id, page = 1, count = 20 }) {
      const result = await api.fetchStatusDetail({ id });
      return {
        success: true,
        intent: 'get_detail',
        data: data.formatItem(result),
      };
    },

    // 获取评论
    async get_comments({ id, page = 1, count = 20 }) {
      const result = await api.fetchStatusComments({ id });
      return {
        success: true,
        intent: 'get_comments',
        data: data.formatItem(result),
      };
    },

  },
};

module.exports = router;
