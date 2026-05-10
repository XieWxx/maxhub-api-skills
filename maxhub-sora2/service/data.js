// 数据解析、格式化处理 - Sora2内容浏览
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
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * 格式化用户信息
 * 适配Sora2内容浏览平台API返回格式
 */
function formatUserProfile(rawData) {
  if (!rawData) return null;
  const user = rawData.user || rawData.userInfo || rawData;
  return {
    username: user.username || '-',
    displayName: user.displayName || '-',
    bio: user.bio || '-',
    avatarUrl: user.avatarUrl || '-',
    followerCount: user.followerCount || '-'
  };
}

/**
 * 格式化内容/视频信息
 * 适配Sora2内容浏览平台API返回格式
 */
function formatContentInfo(rawData) {
  if (!rawData) return null;
  const item = rawData.data || rawData.item || rawData;
  return {
    id: item.id || '-',
    title: item.title || '-',
    author: item.author || '-',
    likeCount: item.likeCount || '-',
    viewCount: item.viewCount || '-',
    createdAt: item.createdAt || '-'
  };
}

/**
 * 格式化搜索结果
 */
function formatSearchResults(rawData) {
  if (!rawData || !rawData.list) return [];
  return rawData.list.map(item => formatContentInfo(item));
}

module.exports = {
  formatNumber,
  formatDate,
  formatDuration,
  formatUserProfile,
  formatContentInfo,
  formatSearchResults,
};
