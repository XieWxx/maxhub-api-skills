// 指令路由、分支分发 - 临时邮箱服务
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
    // 创建临时邮箱
    async create_email(params = {}) {
      const result = await api.getTempEmailAddress(params);
      return {
        success: true,
        intent: 'create_email',
        data: data.formatItem(result),
      };
    },

    // 查看收件箱
    async get_inbox({ token }) {
      const result = await api.getEmailsInbox({ token });
      return {
        success: true,
        intent: 'get_inbox',
        data: data.formatData('/temp_mail/v1/get_emails_inbox', result),
        hasMore: false,
      };
    },

    // 查看邮件详情
    async get_email_detail({ token, message_id }) {
      const result = await api.getEmailById({ token, message_id });
      return {
        success: true,
        intent: 'get_email_detail',
        data: data.formatItem(result),
      };
    },

    // 链式调用：创建邮箱→查看收件箱
    async create_and_check(params = {}) {
      const createResult = await api.getTempEmailAddress(params);
      const token = createResult?.token || createResult?.data?.token;
      if (!token) {
        return { success: false, message: '创建邮箱失败，无法获取token' };
      }
      const inboxResult = await api.getEmailsInbox({ token });
      return {
        success: true,
        intent: 'create_and_check',
        data: {
          email: data.formatItem(createResult),
          inbox: data.formatData('/temp_mail/v1/get_emails_inbox', inboxResult),
        },
      };
    },
  },
};

module.exports = router;
