// 第三方接口请求封装 - kuaishou
// 基于MaxHub API中转站调用，包含所有API

const BASE_URL = process.env.MAXHUB_BASE_URL || 'https://www.aconfig.cn';
const API_KEY = process.env.MAXHUB_API_KEY;
const PLATFORM = 'kuaishou';

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
 * 获取单个作品数据 V1/Get single video data V1
 * GET /api/v1/kuaishou/web/fetch_one_video
 * @param {string} share_text - 必填参数
 */
async function fetchOneVideo(share_text, extraParams = {}) {
  const params = { share_text, ...extraParams };
  return request('/web/fetch_one_video', params);
}

/**
 * 获取单个作品数据 V2/Get single video data V2
 * GET /api/v1/kuaishou/web/fetch_one_video_v2
 * @param {string} photo_id - 必填参数
 */
async function fetchOneVideoV2(photo_id, extraParams = {}) {
  const params = { photo_id, ...extraParams };
  return request('/web/fetch_one_video_v2', params);
}

/**
 * 链接获取作品数据/Fetch single video by URL
 * GET /api/v1/kuaishou/web/fetch_one_video_by_url
 * @param {string} url - 必填参数
 */
async function fetchOneVideoByUrl(url, extraParams = {}) {
  const params = { url, ...extraParams };
  return request('/web/fetch_one_video_by_url', params);
}

/**
 * 获取用户信息/Fetch user info
 * GET /api/v1/kuaishou/web/fetch_user_info
 * @param {string} user_id - 必填参数
 */
async function fetchUserInfo(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/web/fetch_user_info', params);
}

/**
 * 获取用户发布作品/Fetch user posts
 * GET /api/v1/kuaishou/web/fetch_user_post
 * @param {string} user_id - 必填参数
 */
async function fetchUserPost(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/web/fetch_user_post', params);
}

/**
 * 获取用户直播回放/Fetch user live replay
 * GET /api/v1/kuaishou/web/fetch_user_live_replay
 * @param {string} user_id - 必填参数
 */
async function fetchUserLiveReplay(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/web/fetch_user_live_replay', params);
}

/**
 * 获取用户收藏作品/Fetch user collect
 * GET /api/v1/kuaishou/web/fetch_user_collect
 * @param {string} user_id - 必填参数
 */
async function fetchUserCollect(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/web/fetch_user_collect', params);
}

/**
 * 获取快手热榜 V1/Fetch Kuaishou Hot List V1
 * GET /api/v1/kuaishou/web/fetch_kuaishou_hot_list_v1
 * 无必填参数
 */
async function fetchKuaishouHotListV1(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_kuaishou_hot_list_v1', params);
}

/**
 * 获取快手热榜 V2/Fetch Kuaishou Hot List V2
 * GET /api/v1/kuaishou/web/fetch_kuaishou_hot_list_v2
 * 无必填参数
 */
async function fetchKuaishouHotListV2(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_kuaishou_hot_list_v2', params);
}

/**
 * 获取用户ID/Fetch user ID
 * GET /api/v1/kuaishou/web/fetch_get_user_id
 * @param {string} share_link - 必填参数
 */
async function fetchGetUserId(share_link, extraParams = {}) {
  const params = { share_link, ...extraParams };
  return request('/web/fetch_get_user_id', params);
}

/**
 * 视频详情V1/Video detailsV1
 * GET /api/v1/kuaishou/app/fetch_one_video
 * @param {string} photo_id - 必填参数
 */
async function fetchOneVideo(photo_id, extraParams = {}) {
  const params = { photo_id, ...extraParams };
  return request('/app/fetch_one_video', params);
}

/**
 * 根据链接获取单个作品数据/Fetch single video by URL
 * GET /api/v1/kuaishou/app/fetch_one_video_by_url
 * @param {string} share_text - 必填参数
 */
async function fetchOneVideoByUrl(share_text, extraParams = {}) {
  const params = { share_text, ...extraParams };
  return request('/app/fetch_one_video_by_url', params);
}

/**
 * 获取单个用户数据V2/Get single user data V2
 * GET /api/v1/kuaishou/app/fetch_one_user_v2
 * @param {string} user_id - 必填参数
 */
async function fetchOneUserV2(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/app/fetch_one_user_v2', params);
}

/**
 * 获取用户直播信息/Get user live info
 * GET /api/v1/kuaishou/app/fetch_user_live_info
 * @param {string} user_id - 必填参数
 */
async function fetchUserLiveInfo(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/app/fetch_user_live_info', params);
}

/**
 * 获取用户热门作品数据/Get user hot post data
 * GET /api/v1/kuaishou/app/fetch_user_hot_post
 * @param {string} user_id - 必填参数
 */
async function fetchUserHotPost(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/app/fetch_user_hot_post', params);
}

/**
 * 用户视频列表V2/User video list V2
 * GET /api/v1/kuaishou/app/fetch_user_post_v2
 * @param {string} user_id - 必填参数
 */
async function fetchUserPostV2(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/app/fetch_user_post_v2', params);
}

/**
 * 快手热榜分类/Kuaishou hot categories
 * GET /api/v1/kuaishou/app/fetch_hot_board_categories
 * 无必填参数
 */
async function fetchHotBoardCategories(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_hot_board_categories', params);
}

/**
 * 快手热榜详情/Kuaishou hot board detail
 * GET /api/v1/kuaishou/app/fetch_hot_board_detail
 * 无必填参数
 */
async function fetchHotBoardDetail(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_hot_board_detail', params);
}

/**
 * 快手直播榜单/Kuaishou live top list
 * GET /api/v1/kuaishou/app/fetch_live_top_list
 * 无必填参数
 */
async function fetchLiveTopList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_live_top_list', params);
}

/**
 * 快手购物榜单/Kuaishou shopping top list
 * GET /api/v1/kuaishou/app/fetch_shopping_top_list
 * 无必填参数
 */
async function fetchShoppingTopList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_shopping_top_list', params);
}

/**
 * 快手品牌榜单/Kuaishou brand top list
 * GET /api/v1/kuaishou/app/fetch_brand_top_list
 * 无必填参数
 */
async function fetchBrandTopList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_brand_top_list', params);
}

/**
 * 获取魔法表情使用人数/Fetch magic face usage count
 * GET /api/v1/kuaishou/app/fetch_magic_face_usage
 * @param {string} magic_face_id - 必填参数
 */
async function fetchMagicFaceUsage(magic_face_id, extraParams = {}) {
  const params = { magic_face_id, ...extraParams };
  return request('/app/fetch_magic_face_usage', params);
}

/**
 * 获取魔法表情热门视频/Fetch magic face hot videos
 * GET /api/v1/kuaishou/app/fetch_magic_face_hot
 * @param {string} magic_face_id - 必填参数
 */
async function fetchMagicFaceHot(magic_face_id, extraParams = {}) {
  const params = { magic_face_id, ...extraParams };
  return request('/app/fetch_magic_face_hot', params);
}

// ==================== 互 ====================

/**
 * 获取作品一级评论/Fetch video comments
 * GET /api/v1/kuaishou/web/fetch_one_video_comment
 * @param {string} photo_id - 必填参数
 */
async function fetchOneVideoComment(photo_id, extraParams = {}) {
  const params = { photo_id, ...extraParams };
  return request('/web/fetch_one_video_comment', params);
}

/**
 * 获取作品二级评论/Fetch video sub comments
 * GET /api/v1/kuaishou/web/fetch_one_video_sub_comment
 * @param {string, string} photo_id, root_comment_id - 必填参数
 */
async function fetchOneVideoSubComment(photo_id, root_comment_id, extraParams = {}) {
  const params = { photo_id, root_comment_id, ...extraParams };
  return request('/web/fetch_one_video_sub_comment', params);
}

/**
 * 获取单个作品评论数据/Get single video comment data
 * GET /api/v1/kuaishou/app/fetch_one_video_comment
 * @param {string} photo_id - 必填参数
 */
async function fetchOneVideoComment(photo_id, extraParams = {}) {
  const params = { photo_id, ...extraParams };
  return request('/app/fetch_one_video_comment', params);
}

// ==================== 工 ====================

/**
 * 生成分享短连接/Generate share short URL
 * GET /api/v1/kuaishou/web/generate_share_short_url
 * @param {string} photo_id - 必填参数
 */
async function generateShareShortUrl(photo_id, extraParams = {}) {
  const params = { photo_id, ...extraParams };
  return request('/web/generate_share_short_url', params);
}

/**
 * 生成快手分享链接/Generate Kuaishou share link
 * GET /api/v1/kuaishou/app/generate_kuaishou_share_link
 * @param {string} shareObjectId - 必填参数
 */
async function generateKuaishouShareLink(shareObjectId, extraParams = {}) {
  const params = { shareObjectId, ...extraParams };
  return request('/app/generate_kuaishou_share_link', params);
}

// ==================== 搜 ====================

/**
 * 快手批量视频查询接口/Kuaishou batch video query AP
 * GET /api/v1/kuaishou/app/fetch_videos_batch
 * @param {string} photo_ids - 必填参数
 */
async function fetchVideosBatch(photo_ids, extraParams = {}) {
  const params = { photo_ids, ...extraParams };
  return request('/app/fetch_videos_batch', params);
}

/**
 * 综合搜索/Comprehensive search
 * GET /api/v1/kuaishou/app/search_comprehensive
 * @param {string} keyword - 必填参数
 */
async function searchComprehensive(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app/search_comprehensive', params);
}

/**
 * 搜索视频V2/Search video V2
 * GET /api/v1/kuaishou/app/search_video_v2
 * @param {string} keyword - 必填参数
 */
async function searchVideoV2(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app/search_video_v2', params);
}

/**
 * 搜索用户V2/Search user V2
 * GET /api/v1/kuaishou/app/search_user_v2
 * @param {string} keyword - 必填参数
 */
async function searchUserV2(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app/search_user_v2', params);
}

/**
 * 快手热搜人物榜单/Kuaishou hot search person boar
 * GET /api/v1/kuaishou/app/fetch_hot_search_person
 * 无必填参数
 */
async function fetchHotSearchPerson(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_hot_search_person', params);
}

module.exports = {
  request,
  fetchOneVideo,
  fetchOneVideoV2,
  fetchOneVideoByUrl,
  fetchUserInfo,
  fetchUserPost,
  fetchUserLiveReplay,
  fetchUserCollect,
  fetchKuaishouHotListV1,
  fetchKuaishouHotListV2,
  fetchGetUserId,
  fetchOneVideo,
  fetchOneVideoByUrl,
  fetchOneUserV2,
  fetchUserLiveInfo,
  fetchUserHotPost,
  fetchUserPostV2,
  fetchHotBoardCategories,
  fetchHotBoardDetail,
  fetchLiveTopList,
  fetchShoppingTopList,
  fetchBrandTopList,
  fetchMagicFaceUsage,
  fetchMagicFaceHot,
  fetchOneVideoComment,
  fetchOneVideoSubComment,
  fetchOneVideoComment,
  generateShareShortUrl,
  generateKuaishouShareLink,
  fetchVideosBatch,
  searchComprehensive,
  searchVideoV2,
  searchUserV2,
  fetchHotSearchPerson,
};
