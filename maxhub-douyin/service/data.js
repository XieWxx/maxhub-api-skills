// 数据解析、格式化处理 - 抖音平台
// 将API返回的原始数据转换为用户友好的格式

/**
 * 格式化用户信息
 * @param {object} rawData - API返回的原始用户数据
 * @returns {object} 格式化后的用户信息
 */
function formatUserProfile(rawData) {
  if (!rawData) return null;

  const userInfo = rawData.user || rawData;

  return {
    nickname: userInfo.nickname || '-',
    uniqueId: userInfo.unique_id || '-',
    uid: userInfo.uid || '-',
    secUid: userInfo.sec_uid || '-',
    signature: userInfo.signature || '-',
    avatar: userInfo.avatar_larger?.url_list?.[0] || userInfo.avatar_thumb?.url_list?.[0] || '-',
    followerCount: formatNumber(userInfo.follower_count || 0),
    followingCount: formatNumber(userInfo.following_count || 0),
    fansCount: formatNumber(userInfo.fans_count || 0),
    totalFavorited: formatNumber(userInfo.total_favorited || 0),
    awemeCount: formatNumber(userInfo.aweme_count || 0),
    isVerified: userInfo.custom_verify || userInfo.enterprise_verify_reason ? true : false,
    verifyReason: userInfo.custom_verify || userInfo.enterprise_verify_reason || '',
    ipLocation: userInfo.ip_location || '-',
  };
}

/**
 * 格式化视频信息
 * @param {object} rawData - API返回的原始视频数据
 * @returns {object} 格式化后的视频信息
 */
function formatVideoInfo(rawData) {
  if (!rawData) return null;

  const video = rawData.aweme_detail || rawData;
  const stats = video.statistics || {};
  const author = video.author || {};

  return {
    awemeId: video.aweme_id || '-',
    title: video.desc || '-',
    author: {
      nickname: author.nickname || '-',
      uid: author.uid || '-',
      secUid: author.sec_uid || '-',
    },
    statistics: {
      playCount: formatNumber(stats.play_count || 0),
      diggCount: formatNumber(stats.digg_count || 0),
      commentCount: formatNumber(stats.comment_count || 0),
      shareCount: formatNumber(stats.share_count || 0),
      collectCount: formatNumber(stats.collect_count || 0),
    },
    duration: formatDuration(video.duration || 0),
    createTime: formatDate(video.create_time),
    coverUrl: video.video?.cover?.url_list?.[0] || '-',
    shareUrl: video.share_url || '-',
    tags: (video.text_extra || []).map(t => t.hashtag_name).filter(Boolean),
  };
}

/**
 * 格式化评论数据
 * @param {object} rawData - API返回的原始评论数据
 * @returns {Array} 格式化后的评论列表
 */
function formatComments(rawData) {
  if (!rawData || !rawData.comments) return [];

  return rawData.comments.map(comment => ({
    cid: comment.cid,
    text: comment.text || '-',
    author: comment.user?.nickname || '-',
    diggCount: formatNumber(comment.digg_count || 0),
    replyCount: comment.reply_comment_total || 0,
    createTime: formatDate(comment.create_time),
    ipLocation: comment.ip_label || '-',
  }));
}

/**
 * 格式化热搜数据
 * @param {object} rawData - API返回的原始热搜数据
 * @returns {Array} 格式化后的热搜列表
 */
function formatHotSearch(rawData) {
  if (!rawData || !rawData.data) return [];

  return rawData.data.map((item, index) => ({
    rank: index + 1,
    title: item.word || item.word_name || '-',
    hotValue: formatNumber(item.hot_value || 0),
    tag: item.label || '',
  }));
}

/**
 * 格式化直播数据
 * @param {object} rawData - API返回的原始直播数据
 * @returns {object} 格式化后的直播信息
 */
function formatLiveData(rawData) {
  if (!rawData) return null;

  const room = rawData.data || rawData;
  const owner = room.owner || {};

  return {
    roomId: room.room_id || '-',
    title: room.title || '-',
    owner: {
      nickname: owner.nickname || '-',
      uid: owner.uid || '-',
    },
    userCount: formatNumber(room.user_count_str || room.user_count || 0),
    likeCount: formatNumber(room.like_count || 0),
    status: room.status === 2 ? '直播中' : '未开播',
    coverUrl: room.cover?.url_list?.[0] || '-',
  };
}

// ==================== 工具函数 ====================

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
 * 格式化时长（毫秒 → mm:ss）
 */
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * 格式化日期（时间戳 → YYYY-MM-DD HH:mm:ss）
 */
function formatDate(timestamp) {
  if (!timestamp) return '-';
  const date = new Date(typeof timestamp === 'number' ? timestamp * 1000 : timestamp);
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

module.exports = {
  formatUserProfile,
  formatVideoInfo,
  formatComments,
  formatHotSearch,
  formatLiveData,
  formatNumber,
  formatDuration,
  formatDate,
};
