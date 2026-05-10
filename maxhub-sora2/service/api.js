// 第三方接口请求封装 - sora2
// 基于MaxHub API中转站调用，包含所有API

const BASE_URL = process.env.MAXHUB_BASE_URL || 'https://www.aconfig.cn';
const API_KEY = process.env.MAXHUB_API_KEY;
const PLATFORM = 'sora2';

/**
 * 通用API请求方法
 * @param {string} path - API路径
 * @param {object} params - 请求参数
 * @param {string} method - 请求方法 GET/POST
 * @returns {Promise<object>} API响应数据
 */
async function request(path, params = {}, method = 'GET') {
  const url = `${BASE_URL}${path}`;
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
  if (response.status === 401) throw new Error('API Key无效或未配置，请访问 https://www.aconfig.cn 创建API Key');
  if (response.status === 402) throw new Error('账户余额不足，请访问 https://www.aconfig.cn 充值');
  if (response.status === 429) throw new Error('请求频率超限，请等待30秒后重试');
  if (!response.ok) throw new Error(data.message || `请求失败: ${response.status}`);
  return data;
}

// ==================== 数 ====================

/**
 * 获取单一作品详情/Fetch single post detail
 * GET /api/v1/sora2/get_post_detail
 * 无必填参数
 */
async function getPostDetail(extraParams = {}) {
  const params = { ...extraParams };
  return request('/get_post_detail', params);
}

/**
 * 获取作品的 Remix 列表/Fetch post remix list
 * GET /api/v1/sora2/get_post_remix_list
 * 无必填参数
 */
async function getPostRemixList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/get_post_remix_list', params);
}

/**
 * 获取用户信息档案/Fetch user profile
 * GET /api/v1/sora2/get_user_profile
 * @param {string} user_id - 必填参数
 */
async function getUserProfile(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/get_user_profile', params);
}

/**
 * 获取用户发布的帖子列表/Fetch user posts
 * GET /api/v1/sora2/get_user_posts
 * @param {string} user_id - 必填参数
 */
async function getUserPosts(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/get_user_posts', params);
}

/**
 * 获取用户Cameo出镜秀列表/Fetch user cameo appearan
 * GET /api/v1/sora2/get_user_cameo_appearances
 * @param {string} user_id - 必填参数
 */
async function getUserCameoAppearances(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/get_user_cameo_appearances', params);
}

/**
 * 获取Feed流（热门/推荐视频）/Fetch feed
 * GET /api/v1/sora2/get_feed
 * 无必填参数
 */
async function getFeed(extraParams = {}) {
  const params = { ...extraParams };
  return request('/get_feed', params);
}

/**
 * 上传图片获取media_id/Upload image to get media
 * POST /api/v1/sora2/upload_image
 * 无必填参数
 */
async function uploadImage(extraParams = {}) {
  const params = { ...extraParams };
  return request('/upload_image', params, 'POST');
}

/**
 * [已弃用/Deprecated] 查询任务状态/Get task status
 * GET /api/v1/sora2/get_task_status
 * @param {string} task_id - 必填参数
 */
async function getTaskStatus(task_id, extraParams = {}) {
  const params = { task_id, ...extraParams };
  return request('/get_task_status', params);
}

// ==================== 内 ====================

/**
 * 获取无水印视频下载信息/Fetch none watermark video d
 * GET /api/v1/sora2/get_video_download_info
 * 无必填参数
 */
async function getVideoDownloadInfo(extraParams = {}) {
  const params = { ...extraParams };
  return request('/get_video_download_info', params);
}

// ==================== 互 ====================

/**
 * 获取作品一级评论/Fetch post comments
 * GET /api/v1/sora2/get_post_comments
 * @param {string} post_id - 必填参数
 */
async function getPostComments(post_id, extraParams = {}) {
  const params = { post_id, ...extraParams };
  return request('/get_post_comments', params);
}

/**
 * 获取评论的回复/Fetch comment replies
 * GET /api/v1/sora2/get_comment_replies
 * @param {string} comment_id - 必填参数
 */
async function getCommentReplies(comment_id, extraParams = {}) {
  const params = { comment_id, ...extraParams };
  return request('/get_comment_replies', params);
}

/**
 * 获取用户粉丝列表/Fetch user followers
 * GET /api/v1/sora2/get_user_followers
 * @param {string} user_id - 必填参数
 */
async function getUserFollowers(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/get_user_followers', params);
}

/**
 * 获取用户关注列表/Fetch user following
 * GET /api/v1/sora2/get_user_following
 * @param {string} user_id - 必填参数
 */
async function getUserFollowing(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/get_user_following', params);
}

// ==================== 创 ====================

/**
 * 获取 Cameo 出镜秀达人排行榜/Fetch Cameo leaderboar
 * GET /api/v1/sora2/get_cameo_leaderboard
 * 无必填参数
 */
async function getCameoLeaderboard(extraParams = {}) {
  const params = { ...extraParams };
  return request('/get_cameo_leaderboard', params);
}

// ==================== 搜 ====================

/**
 * 搜索用户/Search users
 * GET /api/v1/sora2/search_users
 * @param {string} username - 必填参数
 */
async function searchUsers(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/search_users', params);
}

// ==================== 工 ====================

/**
 * [已弃用/Deprecated] 文本/图片生成视频/Create video
 * POST /api/v1/sora2/create_video
 * 无必填参数
 */
async function createVideo(extraParams = {}) {
  const params = { ...extraParams };
  return request('/create_video', params, 'POST');
}

/**
 * [已弃用/Deprecated] 获取任务生成的作品详情（无水印版本）/Get
 * GET /api/v1/sora2/get_task_detail
 * 无必填参数
 */
async function getTaskDetail(extraParams = {}) {
  const params = { ...extraParams };
  return request('/get_task_detail', params);
}

module.exports = {
  request,
  getPostDetail,
  getPostRemixList,
  getUserProfile,
  getUserPosts,
  getUserCameoAppearances,
  getFeed,
  uploadImage,
  getTaskStatus,
  getVideoDownloadInfo,
  getPostComments,
  getCommentReplies,
  getUserFollowers,
  getUserFollowing,
  getCameoLeaderboard,
  searchUsers,
  createVideo,
  getTaskDetail,
};
