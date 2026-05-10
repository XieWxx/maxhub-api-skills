# 第三方接口请求封装 - 抖音平台
// 基于MaxHub API中转站调用抖音平台API

const BASE_URL = process.env.MAXHUB_BASE_URL || 'https://www.aconfig.cn';
const API_KEY = process.env.MAXHUB_API_KEY;
const PLATFORM = 'douyin';

/**
 * 通用API请求方法
 * @param {string} path - API路径（如 /web/fetch_one_video）
 * @param {object} params - 请求参数
 * @param {string} method - 请求方法 GET/POST
 * @returns {Promise<object>} API响应数据
 */
async function request(path, params = {}, method = 'GET') {
  const url = `${BASE_URL}/api/v1/${PLATFORM}${path}`;
  const headers = {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json',
  };

  const options = { method, headers };

  if (method === 'GET') {
    const query = new URLSearchParams(params).toString();
    const fullUrl = query ? `${url}?${query}` : url;
    const response = await fetch(fullUrl, options);
    return handleResponse(response);
  }

  options.body = JSON.stringify(params);
  const response = await fetch(url, options);
  return handleResponse(response);
}

/**
 * 处理API响应
 */
async function handleResponse(response) {
  const data = await response.json();

  if (response.status === 401) {
    throw new Error('API Key无效或未配置，请访问 https://www.aconfig.cn 创建API Key');
  }
  if (response.status === 402) {
    throw new Error('账户余额不足，请访问 https://www.aconfig.cn 充值');
  }
  if (response.status === 429) {
    throw new Error('请求频率超限，请等待30秒后重试');
  }
  if (!response.ok) {
    throw new Error(data.message || `请求失败: ${response.status}`);
  }

  return data;
}

// ==================== 数据采集 API ====================

/**
 * 获取单个作品数据
 */
async function fetchOneVideo(awemeId) {
  return request('/web/fetch_one_video', { aweme_id: awemeId });
}

/**
 * 根据分享链接获取作品数据
 */
async function fetchVideoByShareUrl(shareUrl) {
  return request('/web/fetch_one_video_by_share_url', { share_url: shareUrl });
}

/**
 * 获取用户主页作品数据
 */
async function fetchUserPostVideos(secUserId, page = 1, count = 20) {
  return request('/web/fetch_user_post_videos', { sec_user_id: secUserId, page, count });
}

/**
 * 获取用户信息（通过sec_user_id）
 */
async function fetchUserProfile(secUserId) {
  return request('/web/handler_user_profile', { sec_user_id: secUserId });
}

/**
 * 获取用户信息（通过抖音号）
 */
async function fetchUserProfileByUniqueId(uniqueId) {
  return request('/web/handler_user_profile_v2', { unique_id: uniqueId });
}

/**
 * 获取用户信息（通过UID）
 */
async function fetchUserProfileByUid(uid) {
  return request('/web/handler_user_profile_v3', { uid });
}

// ==================== 搜索查询 API ====================

/**
 * 获取抖音热搜榜
 */
async function fetchHotSearch() {
  return request('/web/fetch_hot_search_result');
}

/**
 * 视频搜索
 */
async function searchVideo(keyword, page = 1, count = 20) {
  return request('/search/fetch_video_search_v2', { keyword, page, count });
}

/**
 * 用户搜索
 */
async function searchUser(keyword, page = 1, count = 20) {
  return request('/search/fetch_user_search_v2', { keyword, page, count });
}

/**
 * 综合搜索
 */
async function generalSearch(keyword, page = 1, count = 20) {
  return request('/search/fetch_general_search_v2', { keyword, page, count });
}

// ==================== 互动操作 API ====================

/**
 * 获取视频评论
 */
async function fetchVideoComments(awemeId, page = 1, count = 20) {
  return request('/web/fetch_video_comments', { aweme_id: awemeId, page, count });
}

/**
 * 获取评论回复
 */
async function fetchCommentReplies(itemId, commentId, page = 1, count = 20) {
  return request('/web/fetch_video_comment_replies', { item_id: itemId, comment_id: commentId, page, count });
}

// ==================== 直播 API ====================

/**
 * 获取用户直播数据
 */
async function fetchUserLiveVideos(webcastId) {
  return request('/web/fetch_user_live_videos', { webcast_id: webcastId });
}

/**
 * 通过sec_uid获取直播数据
 */
async function fetchLiveBySecUid(secUserId) {
  return request('/web/fetch_user_live_videos_by_sec_uid', { sec_user_id: secUserId });
}

// ==================== 榜单 API ====================

/**
 * 获取实时热点排行
 */
async function fetchCurrentHotTopic() {
  return request('/index/fetch_current_hot_topic');
}

/**
 * 获取热门关键词
 */
async function fetchHotWords() {
  return request('/index/fetch_hot_words');
}

module.exports = {
  request,
  fetchOneVideo,
  fetchVideoByShareUrl,
  fetchUserPostVideos,
  fetchUserProfile,
  fetchUserProfileByUniqueId,
  fetchUserProfileByUid,
  fetchHotSearch,
  searchVideo,
  searchUser,
  generalSearch,
  fetchVideoComments,
  fetchCommentReplies,
  fetchUserLiveVideos,
  fetchLiveBySecUid,
  fetchCurrentHotTopic,
  fetchHotWords,
};
