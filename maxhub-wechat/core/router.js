// 指令路由、分支分发 - 微信平台
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
    // 搜索公众号
    async search({ keyword, page = 1, count = 20 }) {
      const result = await api.fetchDefaultSearch({ keyword });
      return {
        success: true,
        intent: 'search',
        data: data.formatItem(result),
      };
    },

    // 获取文章列表
    async get_article_list({ ghid, page = 1, count = 20 }) {
      const result = await api.fetchMpArticleList({ ghid });
      return {
        success: true,
        intent: 'get_article_list',
        data: data.formatItem(result),
      };
    },

    // 获取文章详情
    async get_article_detail({ url, page = 1, count = 20 }) {
      const result = await api.fetchMpArticleDetailJson({ url });
      return {
        success: true,
        intent: 'get_article_detail',
        data: data.formatItem(result),
      };
    },

    // 获取文章评论
    async get_comments({ url, page = 1, count = 20 }) {
      const result = await api.fetchMpArticleCommentList({ url });
      return {
        success: true,
        intent: 'get_comments',
        data: data.formatItem(result),
      };
    },

  },
};

module.exports = router;
