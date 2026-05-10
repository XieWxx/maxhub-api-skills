// 指令路由、分支分发 - LinkedIn平台
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
    // 搜索用户
    async search_people({ keyword, page = 1, count = 20 }) {
      const result = await api.searchPeople({ keyword });
      return {
        success: true,
        intent: 'search_people',
        data: data.formatItem(result),
      };
    },

    // 获取用户信息
    async get_user_profile({ username, page = 1, count = 20 }) {
      const result = await api.getUserProfile({ username });
      return {
        success: true,
        intent: 'get_user_profile',
        data: data.formatItem(result),
      };
    },

    // 获取公司信息
    async get_company_profile({ name, page = 1, count = 20 }) {
      const result = await api.getCompanyProfile({ name });
      return {
        success: true,
        intent: 'get_company_profile',
        data: data.formatItem(result),
      };
    },

    // 获取用户帖子
    async get_user_posts({ urn, page = 1, count = 20 }) {
      const result = await api.getUserPosts({ urn });
      return {
        success: true,
        intent: 'get_user_posts',
        data: data.formatItem(result),
      };
    },

    // 获取公司帖子
    async get_company_posts({ name, page = 1, count = 20 }) {
      const result = await api.getCompanyPosts({ name });
      return {
        success: true,
        intent: 'get_company_posts',
        data: data.formatItem(result),
      };
    },

  },
};

module.exports = router;
