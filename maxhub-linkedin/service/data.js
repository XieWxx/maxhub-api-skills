// 数据解析、格式化处理 - linkedin
// 将API返回的原始数据转换为用户友好的格式

/**
 * 格式化数字（如 12345 → 1.2万）
 */
function formatNumber(num) {
  if (typeof num === 'string') num = parseInt(num, 10);
  if (isNaN(num)) return '0';
  if (num >= 100000000) return (num / 100000000).toFixed(1) + '亿';
  if (num >= 10000) return (num / 10000).toFixed(1) + '万';
  return num.toLocaleString();
}

/**
 * 格式化日期
 */
function formatDate(timestamp) {
  if (!timestamp) return '-';
  const date = new Date(typeof timestamp === 'number' ? timestamp * 1000 : timestamp);
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

/**
 * 格式化时长（毫秒 → mm:ss）
 */
function formatDuration(ms) {
  if (!ms) return '-';
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * 格式化数数据
 */
function format数(rawData) {
  if (!rawData) return null;
  const item = rawData.data || rawData.item || rawData.aweme_detail || rawData;
  return {
    id: item.id || item.aweme_id || item.itemId || item.note_id || '-',
    title: item.desc || item.title || item.caption || item.text || '-',
    author: item.author?.nickname || item.author?.name || item.author?.userName || '-',
    stats: {
      playCount: formatNumber(item.statistics?.play_count || item.stat?.play || item.playCount || 0),
      likeCount: formatNumber(item.statistics?.digg_count || item.stat?.like || item.likeCount || item.diggCount || 0),
      commentCount: formatNumber(item.statistics?.comment_count || item.stat?.comment || item.commentCount || 0),
      shareCount: formatNumber(item.statistics?.share_count || item.stat?.share || item.shareCount || 0),
    },
    createTime: formatDate(item.create_time || item.publishTime || item.createdAt || item.created_time),
  };
}

/**
 * 格式化互数据
 */
function format互(rawData) {
  if (!rawData) return null;
  const item = rawData.data || rawData.item || rawData.aweme_detail || rawData;
  return {
    id: item.id || item.aweme_id || item.itemId || item.note_id || '-',
    title: item.desc || item.title || item.caption || item.text || '-',
    author: item.author?.nickname || item.author?.name || item.author?.userName || '-',
    stats: {
      playCount: formatNumber(item.statistics?.play_count || item.stat?.play || item.playCount || 0),
      likeCount: formatNumber(item.statistics?.digg_count || item.stat?.like || item.likeCount || item.diggCount || 0),
      commentCount: formatNumber(item.statistics?.comment_count || item.stat?.comment || item.commentCount || 0),
      shareCount: formatNumber(item.statistics?.share_count || item.stat?.share || item.shareCount || 0),
    },
    createTime: formatDate(item.create_time || item.publishTime || item.createdAt || item.created_time),
  };
}

/**
 * 格式化搜数据
 */
function format搜(rawData) {
  if (!rawData) return null;
  const item = rawData.data || rawData.item || rawData.aweme_detail || rawData;
  return {
    id: item.id || item.aweme_id || item.itemId || item.note_id || '-',
    title: item.desc || item.title || item.caption || item.text || '-',
    author: item.author?.nickname || item.author?.name || item.author?.userName || '-',
    stats: {
      playCount: formatNumber(item.statistics?.play_count || item.stat?.play || item.playCount || 0),
      likeCount: formatNumber(item.statistics?.digg_count || item.stat?.like || item.likeCount || item.diggCount || 0),
      commentCount: formatNumber(item.statistics?.comment_count || item.stat?.comment || item.commentCount || 0),
      shareCount: formatNumber(item.statistics?.share_count || item.stat?.share || item.shareCount || 0),
    },
    createTime: formatDate(item.create_time || item.publishTime || item.createdAt || item.created_time),
  };
}

/**
 * 通用数据格式化 - 根据API路径自动选择格式化函数
 */
function formatData(apiPath, rawData) {
  if (!rawData) return null;
  // 列表数据处理
  if (rawData.list || rawData.data?.list || rawData.items) {
    const list = rawData.list || rawData.data?.list || rawData.items || [];
    return list.map(item => ({
      id: item.id || item.aweme_id || item.itemId || '-',
      title: item.desc || item.title || item.caption || item.text || '-',
      author: item.author?.nickname || item.author?.name || '-',
      stats: {
        playCount: formatNumber(item.statistics?.play_count || item.playCount || 0),
        likeCount: formatNumber(item.statistics?.digg_count || item.likeCount || item.diggCount || 0),
      },
    }));
  }
  // 单条数据处理
  return {
    id: rawData.id || rawData.aweme_id || rawData.itemId || '-',
    title: rawData.desc || rawData.title || rawData.caption || rawData.text || '-',
  };
}

module.exports = {
  formatNumber,
  formatDate,
  formatDuration,
  formatData,
  format数,
  format互,
  format搜,
};
