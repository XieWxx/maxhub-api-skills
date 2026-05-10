// 第三方接口请求封装 - bilibili
// 基于MaxHub API中转站调用，包含所有API

const BASE_URL = process.env.MAXHUB_BASE_URL || 'https://www.aconfig.cn';
const API_KEY = process.env.MAXHUB_API_KEY;
const PLATFORM = 'bilibili';

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
 * 获取单个视频详情信息/Get single video data
 * GET /api/v1/bilibili/web/fetch_one_video
 * @param {string} bv_id - 必填参数
 */
async function fetchOneVideo(bv_id, extraParams = {}) {
  const params = { bv_id, ...extraParams };
  return request('/web/fetch_one_video', params);
}

/**
 * 获取单个视频详情信息V2/Get single video data V2
 * GET /api/v1/bilibili/web/fetch_one_video_v2
 * @param {string, string} a_id, c_id - 必填参数
 */
async function fetchOneVideoV2(a_id, c_id, extraParams = {}) {
  const params = { a_id, c_id, ...extraParams };
  return request('/web/fetch_one_video_v2', params);
}

/**
 * 获取单个视频详情信息V3/Get single video data V3
 * GET /api/v1/bilibili/web/fetch_one_video_v3
 * @param {string} url - 必填参数
 */
async function fetchOneVideoV3(url, extraParams = {}) {
  const params = { url, ...extraParams };
  return request('/web/fetch_one_video_v3', params);
}

/**
 * 获取单个视频详情/Get single video detail
 * GET /api/v1/bilibili/web/fetch_video_detail
 * @param {string} aid - 必填参数
 */
async function fetchVideoDetail(aid, extraParams = {}) {
  const params = { aid, ...extraParams };
  return request('/web/fetch_video_detail', params);
}

/**
 * 获取单个视频播放信息/Get single video play info
 * GET /api/v1/bilibili/web/fetch_video_play_info
 * @param {string} url - 必填参数
 */
async function fetchVideoPlayInfo(url, extraParams = {}) {
  const params = { url, ...extraParams };
  return request('/web/fetch_video_play_info', params);
}

/**
 * 获取视频字幕信息/Get video subtitle info
 * GET /api/v1/bilibili/web/fetch_video_subtitle
 * @param {string, string} a_id, c_id - 必填参数
 */
async function fetchVideoSubtitle(a_id, c_id, extraParams = {}) {
  const params = { a_id, c_id, ...extraParams };
  return request('/web/fetch_video_subtitle', params);
}

/**
 * 获取视频流地址/Get video playurl
 * GET /api/v1/bilibili/web/fetch_video_playurl
 * @param {string, string} bv_id, cid - 必填参数
 */
async function fetchVideoPlayurl(bv_id, cid, extraParams = {}) {
  const params = { bv_id, cid, ...extraParams };
  return request('/web/fetch_video_playurl', params);
}

/**
 * 获取用户主页作品数据/Get user homepage video data
 * GET /api/v1/bilibili/web/fetch_user_post_videos
 * @param {string} uid - 必填参数
 */
async function fetchUserPostVideos(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/web/fetch_user_post_videos', params);
}

/**
 * 获取用户所有收藏夹信息/Get user collection folders
 * GET /api/v1/bilibili/web/fetch_collect_folders
 * @param {string} uid - 必填参数
 */
async function fetchCollectFolders(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/web/fetch_collect_folders', params);
}

/**
 * 获取指定收藏夹内视频数据/Gets video data from a coll
 * GET /api/v1/bilibili/web/fetch_user_collection_videos
 * @param {string} folder_id - 必填参数
 */
async function fetchUserCollectionVideos(folder_id, extraParams = {}) {
  const params = { folder_id, ...extraParams };
  return request('/web/fetch_user_collection_videos', params);
}

/**
 * 获取指定用户的信息/Get information of specified u
 * GET /api/v1/bilibili/web/fetch_user_profile
 * @param {string} uid - 必填参数
 */
async function fetchUserProfile(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/web/fetch_user_profile', params);
}

/**
 * 获取综合热门视频信息/Get comprehensive popular vid
 * GET /api/v1/bilibili/web/fetch_com_popular
 * 无必填参数
 */
async function fetchComPopular(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_com_popular', params);
}

/**
 * 获取指定用户动态/Get dynamic information of spec
 * GET /api/v1/bilibili/web/fetch_user_dynamic
 * @param {string} uid - 必填参数
 */
async function fetchUserDynamic(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/web/fetch_user_dynamic', params);
}

/**
 * 获取动态详情/Get dynamic detail
 * GET /api/v1/bilibili/web/fetch_dynamic_detail
 * @param {string} dynamic_id - 必填参数
 */
async function fetchDynamicDetail(dynamic_id, extraParams = {}) {
  const params = { dynamic_id, ...extraParams };
  return request('/web/fetch_dynamic_detail', params);
}

/**
 * 获取动态详情v2/Get dynamic detail v2
 * GET /api/v1/bilibili/web/fetch_dynamic_detail_v2
 * @param {string} dynamic_id - 必填参数
 */
async function fetchDynamicDetailV2(dynamic_id, extraParams = {}) {
  const params = { dynamic_id, ...extraParams };
  return request('/web/fetch_dynamic_detail_v2', params);
}

/**
 * 获取视频实时弹幕/Get Video Danmaku
 * GET /api/v1/bilibili/web/fetch_video_danmaku
 * @param {string} cid - 必填参数
 */
async function fetchVideoDanmaku(cid, extraParams = {}) {
  const params = { cid, ...extraParams };
  return request('/web/fetch_video_danmaku', params);
}

/**
 * 获取指定直播间信息/Get information of specified l
 * GET /api/v1/bilibili/web/fetch_live_room_detail
 * @param {string} room_id - 必填参数
 */
async function fetchLiveRoomDetail(room_id, extraParams = {}) {
  const params = { room_id, ...extraParams };
  return request('/web/fetch_live_room_detail', params);
}

/**
 * 获取直播间视频流/Get live video data of specifie
 * GET /api/v1/bilibili/web/fetch_live_videos
 * @param {string} room_id - 必填参数
 */
async function fetchLiveVideos(room_id, extraParams = {}) {
  const params = { room_id, ...extraParams };
  return request('/web/fetch_live_videos', params);
}

/**
 * 获取指定分区正在直播的主播/Get live streamers of spec
 * GET /api/v1/bilibili/web/fetch_live_streamers
 * @param {string} area_id - 必填参数
 */
async function fetchLiveStreamers(area_id, extraParams = {}) {
  const params = { area_id, ...extraParams };
  return request('/web/fetch_live_streamers', params);
}

/**
 * 获取所有直播分区列表/Get a list of all live areas
 * GET /api/v1/bilibili/web/fetch_all_live_areas
 * 无必填参数
 */
async function fetchAllLiveAreas(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_all_live_areas', params);
}

/**
 * 通过bv号获得视频分p信息/Get Video Parts By bvid
 * GET /api/v1/bilibili/web/fetch_video_parts
 * @param {string} bv_id - 必填参数
 */
async function fetchVideoParts(bv_id, extraParams = {}) {
  const params = { bv_id, ...extraParams };
  return request('/web/fetch_video_parts', params);
}

/**
 * 获取单个视频详情信息/Get single video data
 * GET /api/v1/bilibili/app/fetch_one_video
 * 无必填参数
 */
async function fetchOneVideo(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_one_video', params);
}

/**
 * 获取用户投稿视频/Get user videos
 * GET /api/v1/bilibili/app/fetch_user_videos
 * @param {string} user_id - 必填参数
 */
async function fetchUserVideos(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/app/fetch_user_videos', params);
}

/**
 * 获取用户信息/Get user info
 * GET /api/v1/bilibili/app/fetch_user_info
 * @param {string} user_id - 必填参数
 */
async function fetchUserInfo(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/app/fetch_user_info', params);
}

/**
 * 获取主页推荐视频流/Get home feed
 * GET /api/v1/bilibili/app/fetch_home_feed
 * 无必填参数
 */
async function fetchHomeFeed(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_home_feed', params);
}

/**
 * 获取热门推荐/Get popular feed
 * GET /api/v1/bilibili/app/fetch_popular_feed
 * 无必填参数
 */
async function fetchPopularFeed(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_popular_feed', params);
}

/**
 * 获取影视推荐/Get cinema tab
 * GET /api/v1/bilibili/app/fetch_cinema_tab
 * 无必填参数
 */
async function fetchCinemaTab(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_cinema_tab', params);
}

/**
 * 获取番剧推荐/Get bangumi tab
 * GET /api/v1/bilibili/app/fetch_bangumi_tab
 * 无必填参数
 */
async function fetchBangumiTab(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_bangumi_tab', params);
}

/**
 * 获取UP主状态统计/Get UP stat (total likes and v
 * GET /api/v1/bilibili/web/fetch_user_up_stat
 * @param {string} uid - 必填参数
 */
async function fetchUserUpStat(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/web/fetch_user_up_stat', params);
}

/**
 * 获取用户关系状态统计/Get user relation stat (follo
 * GET /api/v1/bilibili/web/fetch_user_relation_stat
 * @param {string} uid - 必填参数
 */
async function fetchUserRelationStat(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/web/fetch_user_relation_stat', params);
}

// ==================== 搜 ====================

/**
 * 获取热门搜索信息/Get hot search data
 * GET /api/v1/bilibili/web/fetch_hot_search
 * @param {string} limit - 必填参数
 */
async function fetchHotSearch(limit, extraParams = {}) {
  const params = { limit, ...extraParams };
  return request('/web/fetch_hot_search', params);
}

/**
 * 获取综合搜索信息/Get general search data
 * GET /api/v1/bilibili/web/fetch_general_search
 * @param {string, string, string, string} keyword, order, page, page_size - 必填参数
 */
async function fetchGeneralSearch(keyword, order, page, page_size, extraParams = {}) {
  const params = { keyword, order, page, page_size, ...extraParams };
  return request('/web/fetch_general_search', params);
}

/**
 * 综合搜索/search all
 * GET /api/v1/bilibili/app/fetch_search_all
 * @param {string} keyword - 必填参数
 */
async function fetchSearchAll(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app/fetch_search_all', params);
}

/**
 * 分类搜索/ search by type
 * GET /api/v1/bilibili/app/fetch_search_by_type
 * @param {string} keyword - 必填参数
 */
async function fetchSearchByType(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app/fetch_search_by_type', params);
}

// ==================== 互 ====================

/**
 * 获取指定视频的评论/Get comments on the specified
 * GET /api/v1/bilibili/web/fetch_video_comments
 * @param {string} bv_id - 必填参数
 */
async function fetchVideoComments(bv_id, extraParams = {}) {
  const params = { bv_id, ...extraParams };
  return request('/web/fetch_video_comments', params);
}

/**
 * 获取视频下指定评论的回复/Get reply to the specified
 * GET /api/v1/bilibili/web/fetch_comment_reply
 * @param {string, string} bv_id, rpid - 必填参数
 */
async function fetchCommentReply(bv_id, rpid, extraParams = {}) {
  const params = { bv_id, rpid, ...extraParams };
  return request('/web/fetch_comment_reply', params);
}

/**
 * 获取视频评论列表/Get video comments
 * GET /api/v1/bilibili/app/fetch_video_comments
 * 无必填参数
 */
async function fetchVideoComments(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/fetch_video_comments', params);
}

/**
 * 获取二级评论回复/Get reply detail
 * GET /api/v1/bilibili/app/fetch_reply_detail
 * @param {string} root - 必填参数
 */
async function fetchReplyDetail(root, extraParams = {}) {
  const params = { root, ...extraParams };
  return request('/app/fetch_reply_detail', params);
}

// ==================== 工 ====================

/**
 * 通过bv号获得视频aid号/Generate aid by bvid
 * GET /api/v1/bilibili/web/bv_to_aid
 * @param {string} bv_id - 必填参数
 */
async function bvToAid(bv_id, extraParams = {}) {
  const params = { bv_id, ...extraParams };
  return request('/web/bv_to_aid', params);
}

// ==================== 内 ====================

/**
 * 提取用户ID/Extract user ID
 * GET /api/v1/bilibili/web/fetch_get_user_id
 * @param {string} share_link - 必填参数
 */
async function fetchGetUserId(share_link, extraParams = {}) {
  const params = { share_link, ...extraParams };
  return request('/web/fetch_get_user_id', params);
}

module.exports = {
  request,
  fetchOneVideo,
  fetchOneVideoV2,
  fetchOneVideoV3,
  fetchVideoDetail,
  fetchVideoPlayInfo,
  fetchVideoSubtitle,
  fetchVideoPlayurl,
  fetchUserPostVideos,
  fetchCollectFolders,
  fetchUserCollectionVideos,
  fetchUserProfile,
  fetchComPopular,
  fetchUserDynamic,
  fetchDynamicDetail,
  fetchDynamicDetailV2,
  fetchVideoDanmaku,
  fetchLiveRoomDetail,
  fetchLiveVideos,
  fetchLiveStreamers,
  fetchAllLiveAreas,
  fetchVideoParts,
  fetchOneVideo,
  fetchUserVideos,
  fetchUserInfo,
  fetchHomeFeed,
  fetchPopularFeed,
  fetchCinemaTab,
  fetchBangumiTab,
  fetchHotSearch,
  fetchGeneralSearch,
  fetchSearchAll,
  fetchSearchByType,
  fetchUserUpStat,
  fetchUserRelationStat,
  fetchVideoComments,
  fetchCommentReply,
  fetchVideoComments,
  fetchReplyDetail,
  bvToAid,
  fetchGetUserId,
};
