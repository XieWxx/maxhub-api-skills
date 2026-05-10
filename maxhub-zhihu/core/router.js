// 指令路由、分支分发 - 知乎平台
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
    // 搜索
    async search({ keyword, page = 1, count = 20 }) {
      const result = await api.fetchArticleSearchV3({ keyword });
      return {
        success: true,
        intent: 'search',
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

    // 获取问题回答
    async get_question_answers({ question_id, page = 1, count = 20 }) {
      const result = await api.fetchQuestionAnswers({ question_id });
      return {
        success: true,
        intent: 'get_question_answers',
        data: data.formatItem(result),
      };
    },

    // 获取专栏文章
    async get_column_articles({ column_id, page = 1, count = 20 }) {
      const result = await api.fetchColumnArticles({ column_id });
      return {
        success: true,
        intent: 'get_column_articles',
        data: data.formatItem(result),
      };
    },

    // 获取专栏文章详情
    async get_column_article_detail({ article_id, page = 1, count = 20 }) {
      const result = await api.fetchColumnArticleDetail({ article_id });
      return {
        success: true,
        intent: 'get_column_article_detail',
        data: data.formatItem(result),
      };
    },

  },
};

module.exports = router;
