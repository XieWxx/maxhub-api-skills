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
    // 通过URL解析视频数据
    async parse_url({ url }) {
      const result = await api.videoData({ url });
      return {
        success: true,
        intent: 'parse_url',
        data: data.formatItem(result),
      };
    },

    // 通过URL解析视频数据（别名）
    async get_detail({ url }) {
      const result = await api.videoData({ url });
      return {
        success: true,
        intent: 'get_detail',
        data: data.formatItem(result),
      };
    },
  },
};

module.exports = router;
