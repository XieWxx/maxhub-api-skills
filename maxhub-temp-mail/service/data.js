// 数据解析、格式化处理 - temp-mail
// 兼容层设计：支持API返回参数变化时自动调整
// 当API返回字段与预期不一致时，使用fallback策略提取数据

function safeGet(obj, paths, defaultValue = '-') {
  if (!obj) return defaultValue;
  for (const path of paths) {
    const value = path.split('.').reduce((o, k) => o?.[k], obj);
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return defaultValue;
}

function formatNumber(num) {
  if (typeof num === 'string') num = parseInt(num, 10);
  if (isNaN(num)) return '0';
  if (num >= 100000000) return (num / 100000000).toFixed(1) + '亿';
  if (num >= 10000) return (num / 10000).toFixed(1) + '万';
  return num.toLocaleString();
}

function formatDate(timestamp) {
  if (!timestamp) return '-';
  const date = new Date(typeof timestamp === 'number' ? (timestamp > 1e12 ? timestamp : timestamp * 1000) : timestamp);
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

function formatDuration(ms) {
  if (!ms) return '-';
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * 通用内容格式化函数
 * 使用 safeGet 兼容不同API版本的返回字段差异
 * @param {object} rawData - 原始API返回数据
 * @returns {object|null} 格式化后的数据
 */
function formatItem(rawData) {
  if (!rawData) return null;
  const item = rawData.data || rawData.aweme_detail || rawData.item || rawData;

  return {
    id: safeGet(item, ['id', 'id', 'item_id', 'note_id', 'bvid', 'video_id', 'uid']),
    title: safeGet(item, ['desc', 'title', 'caption', 'text', 'content']),
    author: safeGet(item, ['author.nickname', 'author.name', 'author.userName', 'user.nickname', 'owner.name', 'channelTitle']),
    authorId: safeGet(item, ['author.uid', 'author.id', 'author.user_id', 'user.uid', 'owner.mid']),
    cover: safeGet(item, ['video.cover.url_list.0', 'cover', 'pic', 'thumbnail', 'avatar']),
    stats: {
    },
    createTime: formatDate(safeGet(item, ['create_time', 'publishTime', 'createdAt', 'created_time', 'pubdate', 'publishedAt'])),
    duration: formatDuration(safeGet(item, ['duration', 'video.duration', 'length'], 0)),
  };
}

/**
 * 通用数据格式化 - 自动检测数据类型并选择格式化函数
 * 兼容API返回参数变化：当字段名变化时，safeGet会自动尝试备选字段
 */
function formatData(apiPath, rawData) {
  if (!rawData) return null;

  const list = rawData.list || rawData.data?.list || rawData.items || rawData.videos || rawData.aweme_list;
  if (list && Array.isArray(list)) {
    return list.map(item => formatItem({ data: item, aweme_detail: item, item }));
  }

  return formatItem(rawData);
}

/**
 * 向后兼容别名
 * 旧代码可能使用 formatXxx_Web 等函数名，统一指向 formatItem
 */
const formatTemp_Mail_Web = formatItem;
const formatTemp_Mail_App = formatItem;
const formatTemp_Mail_Search = formatItem;

module.exports = {
  safeGet,
  formatNumber,
  formatDate,
  formatDuration,
  formatItem,
  formatData,
  formatTemp_Mail_Web,
  formatTemp_Mail_App,
  formatTemp_Mail_Search,
};
