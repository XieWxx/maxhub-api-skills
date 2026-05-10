// 指令路由、分支分发 - 小红书平台
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
    // 搜索笔记
    async search_note({ keyword, page = 1, count = 20 }) {
      const result = await api.fetchSearchNotes({ keyword });
      return {
        success: true,
        intent: 'search_note',
        data: data.formatItem(result),
      };
    },

    // 搜索用户
    async search_user({ keyword, page = 1, count = 20 }) {
      const result = await api.fetchSearchUsers({ keyword });
      return {
        success: true,
        intent: 'search_user',
        data: data.formatItem(result),
      };
    },

    // 获取笔记详情
    async get_note_detail({ note_id, page = 1, count = 20 }) {
      const result = await api.fetchNoteDetail({ note_id });
      return {
        success: true,
        intent: 'get_note_detail',
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

    // 获取笔记评论
    async get_comments({ note_id, page = 1, count = 20 }) {
      const result = await api.fetchNoteComments({ note_id });
      return {
        success: true,
        intent: 'get_comments',
        data: data.formatItem(result),
      };
    },

    // 获取用户笔记
    async get_user_notes({ user_id, page = 1, count = 20 }) {
      const result = await api.fetchUserNotes({ user_id });
      return {
        success: true,
        intent: 'get_user_notes',
        data: data.formatItem(result),
      };
    },

  },
};

module.exports = router;
