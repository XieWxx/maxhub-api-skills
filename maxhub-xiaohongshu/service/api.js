// 第三方接口请求封装 - xiaohongshu
// 基于MaxHub API中转站调用，包含所有API

const BASE_URL = process.env.MAXHUB_BASE_URL || 'https://www.aconfig.cn';
const API_KEY = process.env.MAXHUB_API_KEY;
const PLATFORM = 'xiaohongshu';

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
 * 获取笔记详情/Fetch note detail
 * GET /api/v1/xiaohongshu/web_v3/fetch_note_detail
 * @param {string, string} note_id, xsec_token - 必填参数
 */
async function fetchNoteDetail(note_id, xsec_token, extraParams = {}) {
  const params = { note_id, xsec_token, ...extraParams };
  return request('/web_v3/fetch_note_detail', params);
}

/**
 * 获取首页推荐/Fetch homepage feed
 * GET /api/v1/xiaohongshu/web_v3/fetch_homefeed
 * 无必填参数
 */
async function fetchHomefeed(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web_v3/fetch_homefeed', params);
}

/**
 * 获取首页分类列表/Fetch homepage categories
 * GET /api/v1/xiaohongshu/web_v3/fetch_homefeed_categories
 * 无必填参数
 */
async function fetchHomefeedCategories(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web_v3/fetch_homefeed_categories', params);
}

/**
 * 获取用户信息/Fetch user info
 * GET /api/v1/xiaohongshu/web_v3/fetch_user_info
 * @param {string} user_id - 必填参数
 */
async function fetchUserInfo(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/web_v3/fetch_user_info', params);
}

/**
 * 获取用户笔记列表/Fetch user notes
 * GET /api/v1/xiaohongshu/web_v3/fetch_user_notes
 * @param {string} user_id - 必填参数
 */
async function fetchUserNotes(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/web_v3/fetch_user_notes', params);
}

/**
 * 获取图文笔记详情/Get image note detail
 * GET /api/v1/xiaohongshu/app_v2/get_image_note_detail
 * 无必填参数
 */
async function getImageNoteDetail(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app_v2/get_image_note_detail', params);
}

/**
 * 获取视频笔记详情/Get video note detail
 * GET /api/v1/xiaohongshu/app_v2/get_video_note_detail
 * 无必填参数
 */
async function getVideoNoteDetail(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app_v2/get_video_note_detail', params);
}

/**
 * 获取用户信息/Get user info
 * GET /api/v1/xiaohongshu/app_v2/get_user_info
 * 无必填参数
 */
async function getUserInfo(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app_v2/get_user_info', params);
}

/**
 * 获取用户笔记列表/Get user posted notes
 * GET /api/v1/xiaohongshu/app_v2/get_user_posted_notes
 * 无必填参数
 */
async function getUserPostedNotes(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app_v2/get_user_posted_notes', params);
}

/**
 * 获取商品详情/Get product detail
 * GET /api/v1/xiaohongshu/app_v2/get_product_detail
 * @param {string} sku_id - 必填参数
 */
async function getProductDetail(sku_id, extraParams = {}) {
  const params = { sku_id, ...extraParams };
  return request('/app_v2/get_product_detail', params);
}

/**
 * 获取商品推荐列表/Get product recommendations
 * GET /api/v1/xiaohongshu/app_v2/get_product_recommendations
 * @param {string} sku_id - 必填参数
 */
async function getProductRecommendations(sku_id, extraParams = {}) {
  const params = { sku_id, ...extraParams };
  return request('/app_v2/get_product_recommendations', params);
}

/**
 * 获取话题详情/Get topic info
 * GET /api/v1/xiaohongshu/app_v2/get_topic_info
 * @param {string} page_id - 必填参数
 */
async function getTopicInfo(page_id, extraParams = {}) {
  const params = { page_id, ...extraParams };
  return request('/app_v2/get_topic_info', params);
}

/**
 * 获取话题笔记列表/Get topic feed
 * GET /api/v1/xiaohongshu/app_v2/get_topic_feed
 * @param {string} page_id - 必填参数
 */
async function getTopicFeed(page_id, extraParams = {}) {
  const params = { page_id, ...extraParams };
  return request('/app_v2/get_topic_feed', params);
}

/**
 * 获取笔记信息 V1/Get note info V1
 * GET /api/v1/xiaohongshu/app/get_note_info
 * 无必填参数
 */
async function getNoteInfo(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/get_note_info', params);
}

/**
 * 获取笔记信息 V2 (蒲公英商家后台)/Get note info V2 (Pu
 * GET /api/v1/xiaohongshu/app/get_note_info_v2
 * 无必填参数
 */
async function getNoteInfoV2(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/get_note_info_v2', params);
}

/**
 * [已弃用/Deprecated] 根据话题标签获取作品/Get notes by
 * GET /api/v1/xiaohongshu/app/get_notes_by_topic
 * @param {string, string} page_id, first_load_time - 必填参数
 */
async function getNotesByTopic(page_id, first_load_time, extraParams = {}) {
  const params = { page_id, first_load_time, ...extraParams };
  return request('/app/get_notes_by_topic', params);
}

/**
 * 获取用户信息/Get user info
 * GET /api/v1/xiaohongshu/app/get_user_info
 * @param {string} user_id - 必填参数
 */
async function getUserInfo(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/app/get_user_info', params);
}

/**
 * 获取用户作品列表/Get user notes
 * GET /api/v1/xiaohongshu/app/get_user_notes
 * @param {string} user_id - 必填参数
 */
async function getUserNotes(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/app/get_user_notes', params);
}

/**
 * 获取商品详情/Get product detail
 * GET /api/v1/xiaohongshu/app/get_product_detail
 * @param {string} sku_id - 必填参数
 */
async function getProductDetail(sku_id, extraParams = {}) {
  const params = { sku_id, ...extraParams };
  return request('/app/get_product_detail', params);
}

/**
 * 获取单一笔记和推荐笔记 V1 (已弃用)/Fetch one note and
 * GET /api/v1/xiaohongshu/web_v2/fetch_feed_notes
 * @param {string} note_id - 必填参数
 */
async function fetchFeedNotes(note_id, extraParams = {}) {
  const params = { note_id, ...extraParams };
  return request('/web_v2/fetch_feed_notes', params);
}

/**
 * 获取单一笔记和推荐笔记 V2/Fetch one note and feed n
 * GET /api/v1/xiaohongshu/web_v2/fetch_feed_notes_v2
 * @param {string} note_id - 必填参数
 */
async function fetchFeedNotesV2(note_id, extraParams = {}) {
  const params = { note_id, ...extraParams };
  return request('/web_v2/fetch_feed_notes_v2', params);
}

/**
 * 获取单一笔记和推荐笔记 V3/Fetch one note and feed n
 * GET /api/v1/xiaohongshu/web_v2/fetch_feed_notes_v3
 * @param {string} short_url - 必填参数
 */
async function fetchFeedNotesV3(short_url, extraParams = {}) {
  const params = { short_url, ...extraParams };
  return request('/web_v2/fetch_feed_notes_v3', params);
}

/**
 * 获取小红书笔记图片/Fetch Xiaohongshu note image
 * GET /api/v1/xiaohongshu/web_v2/fetch_note_image
 * @param {string} note_id - 必填参数
 */
async function fetchNoteImage(note_id, extraParams = {}) {
  const params = { note_id, ...extraParams };
  return request('/web_v2/fetch_note_image', params);
}

/**
 * 获取Web用户主页笔记/Fetch web user profile notes
 * GET /api/v1/xiaohongshu/web_v2/fetch_home_notes
 * @param {string} user_id - 必填参数
 */
async function fetchHomeNotes(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/web_v2/fetch_home_notes', params);
}

/**
 * 获取App用户主页笔记/Fetch App user home notes
 * GET /api/v1/xiaohongshu/web_v2/fetch_home_notes_app
 * @param {string} user_id - 必填参数
 */
async function fetchHomeNotesApp(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/web_v2/fetch_home_notes_app', params);
}

/**
 * 获取用户信息/Fetch user info
 * GET /api/v1/xiaohongshu/web_v2/fetch_user_info
 * @param {string} user_id - 必填参数
 */
async function fetchUserInfo(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/web_v2/fetch_user_info', params);
}

/**
 * 获取App用户信息/Fetch App user info
 * GET /api/v1/xiaohongshu/web_v2/fetch_user_info_app
 * @param {string} user_id - 必填参数
 */
async function fetchUserInfoApp(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/web_v2/fetch_user_info_app', params);
}

/**
 * 获取小红书商品列表/Fetch Xiaohongshu product list
 * GET /api/v1/xiaohongshu/web_v2/fetch_product_list
 * @param {string} user_id - 必填参数
 */
async function fetchProductList(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/web_v2/fetch_product_list', params);
}

/**
 * 获取小红书热榜/Fetch Xiaohongshu hot list
 * GET /api/v1/xiaohongshu/web_v2/fetch_hot_list
 * 无必填参数
 */
async function fetchHotList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web_v2/fetch_hot_list', params);
}

/**
 * 获取首页推荐/Get home recommend
 * POST /api/v1/xiaohongshu/web/get_home_recommend
 * 无必填参数
 */
async function getHomeRecommend(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/get_home_recommend', params, 'POST');
}

/**
 * 获取笔记信息 V2/Get note info V2
 * GET /api/v1/xiaohongshu/web/get_note_info_v2
 * 无必填参数
 */
async function getNoteInfoV2(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/get_note_info_v2', params);
}

/**
 * 获取笔记信息 V4/Get note info V4
 * GET /api/v1/xiaohongshu/web/get_note_info_v4
 * 无必填参数
 */
async function getNoteInfoV4(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/get_note_info_v4', params);
}

/**
 * 获取笔记信息 V7/Get note info V7
 * GET /api/v1/xiaohongshu/web/get_note_info_v7
 * 无必填参数
 */
async function getNoteInfoV7(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/get_note_info_v7', params);
}

/**
 * 获取用户信息 V1/Get user info V1
 * GET /api/v1/xiaohongshu/web/get_user_info
 * @param {string} user_id - 必填参数
 */
async function getUserInfo(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/web/get_user_info', params);
}

/**
 * 获取用户信息 V2/Get user info V2
 * GET /api/v1/xiaohongshu/web/get_user_info_v2
 * 无必填参数
 */
async function getUserInfoV2(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/get_user_info_v2', params);
}

/**
 * 获取用户的笔记 V2/Get user notes V2
 * GET /api/v1/xiaohongshu/web/get_user_notes_v2
 * @param {string} user_id - 必填参数
 */
async function getUserNotesV2(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/web/get_user_notes_v2', params);
}

/**
 * 通过分享链接获取小红书的Note ID 和 xsec_token/Get Xia
 * GET /api/v1/xiaohongshu/web/get_note_id_and_xsec_token
 * @param {string} share_text - 必填参数
 */
async function getNoteIdAndXsecToken(share_text, extraParams = {}) {
  const params = { share_text, ...extraParams };
  return request('/web/get_note_id_and_xsec_token', params);
}

/**
 * 获取小红书商品信息/Get Xiaohongshu product info
 * GET /api/v1/xiaohongshu/web/get_product_info
 * 无必填参数
 */
async function getProductInfo(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/get_product_info', params);
}

/**
 * 获取热搜词/Fetch trending keywords
 * GET /api/v1/xiaohongshu/web_v3/fetch_trending
 * 无必填参数
 */
async function fetchTrending(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web_v3/fetch_trending', params);
}

// ==================== 互 ====================

/**
 * 获取笔记评论/Fetch note comments
 * GET /api/v1/xiaohongshu/web_v3/fetch_note_comments
 * @param {string, string} note_id, xsec_token - 必填参数
 */
async function fetchNoteComments(note_id, xsec_token, extraParams = {}) {
  const params = { note_id, xsec_token, ...extraParams };
  return request('/web_v3/fetch_note_comments', params);
}

/**
 * 获取子评论/Fetch sub comments
 * GET /api/v1/xiaohongshu/web_v3/fetch_sub_comments
 * @param {string, string, string} note_id, root_comment_id, xsec_token - 必填参数
 */
async function fetchSubComments(note_id, root_comment_id, xsec_token, extraParams = {}) {
  const params = { note_id, root_comment_id, xsec_token, ...extraParams };
  return request('/web_v3/fetch_sub_comments', params);
}

/**
 * 获取笔记评论列表/Get note comments
 * GET /api/v1/xiaohongshu/app_v2/get_note_comments
 * 无必填参数
 */
async function getNoteComments(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app_v2/get_note_comments', params);
}

/**
 * 获取笔记二级评论列表/Get note sub comments
 * GET /api/v1/xiaohongshu/app_v2/get_note_sub_comments
 * @param {string} comment_id - 必填参数
 */
async function getNoteSubComments(comment_id, extraParams = {}) {
  const params = { comment_id, ...extraParams };
  return request('/app_v2/get_note_sub_comments', params);
}

/**
 * 获取用户收藏笔记列表/Get user faved notes
 * GET /api/v1/xiaohongshu/app_v2/get_user_faved_notes
 * 无必填参数
 */
async function getUserFavedNotes(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app_v2/get_user_faved_notes', params);
}

/**
 * 获取商品评论总览/Get product review overview
 * GET /api/v1/xiaohongshu/app_v2/get_product_review_overview
 * @param {string} sku_id - 必填参数
 */
async function getProductReviewOverview(sku_id, extraParams = {}) {
  const params = { sku_id, ...extraParams };
  return request('/app_v2/get_product_review_overview', params);
}

/**
 * 获取商品评论列表/Get product reviews
 * GET /api/v1/xiaohongshu/app_v2/get_product_reviews
 * @param {string} sku_id - 必填参数
 */
async function getProductReviews(sku_id, extraParams = {}) {
  const params = { sku_id, ...extraParams };
  return request('/app_v2/get_product_reviews', params);
}

/**
 * 获取笔记评论/Get note comments
 * GET /api/v1/xiaohongshu/app/get_note_comments
 * @param {string} note_id - 必填参数
 */
async function getNoteComments(note_id, extraParams = {}) {
  const params = { note_id, ...extraParams };
  return request('/app/get_note_comments', params);
}

/**
 * 获取子评论/Get sub comments
 * GET /api/v1/xiaohongshu/app/get_sub_comments
 * @param {string, string} note_id, comment_id - 必填参数
 */
async function getSubComments(note_id, comment_id, extraParams = {}) {
  const params = { note_id, comment_id, ...extraParams };
  return request('/app/get_sub_comments', params);
}

/**
 * 获取单一笔记和推荐笔记 V4 (互动量有延迟)/Fetch one note a
 * GET /api/v1/xiaohongshu/web_v2/fetch_feed_notes_v4
 * @param {string} note_id - 必填参数
 */
async function fetchFeedNotesV4(note_id, extraParams = {}) {
  const params = { note_id, ...extraParams };
  return request('/web_v2/fetch_feed_notes_v4', params);
}

/**
 * 获取单一笔记和推荐笔记 V5 (互动量有缺失)/Fetch one note a
 * GET /api/v1/xiaohongshu/web_v2/fetch_feed_notes_v5
 * @param {string} note_id - 必填参数
 */
async function fetchFeedNotesV5(note_id, extraParams = {}) {
  const params = { note_id, ...extraParams };
  return request('/web_v2/fetch_feed_notes_v5', params);
}

/**
 * 获取笔记评论/Fetch note comments
 * GET /api/v1/xiaohongshu/web_v2/fetch_note_comments
 * @param {string} note_id - 必填参数
 */
async function fetchNoteComments(note_id, extraParams = {}) {
  const params = { note_id, ...extraParams };
  return request('/web_v2/fetch_note_comments', params);
}

/**
 * 获取子评论/Fetch sub comments
 * GET /api/v1/xiaohongshu/web_v2/fetch_sub_comments
 * @param {string, string} note_id, comment_id - 必填参数
 */
async function fetchSubComments(note_id, comment_id, extraParams = {}) {
  const params = { note_id, comment_id, ...extraParams };
  return request('/web_v2/fetch_sub_comments', params);
}

/**
 * 获取用户粉丝列表/Fetch follower list
 * GET /api/v1/xiaohongshu/web_v2/fetch_follower_list
 * @param {string} user_id - 必填参数
 */
async function fetchFollowerList(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/web_v2/fetch_follower_list', params);
}

/**
 * 获取用户关注列表/Fetch following list
 * GET /api/v1/xiaohongshu/web_v2/fetch_following_list
 * @param {string} user_id - 必填参数
 */
async function fetchFollowingList(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/web_v2/fetch_following_list', params);
}

/**
 * 获取笔记评论 V1/Get note comments V1
 * GET /api/v1/xiaohongshu/web/get_note_comments
 * @param {string} note_id - 必填参数
 */
async function getNoteComments(note_id, extraParams = {}) {
  const params = { note_id, ...extraParams };
  return request('/web/get_note_comments', params);
}

/**
 * 获取笔记评论回复 V1/Get note comment replies V1
 * GET /api/v1/xiaohongshu/web/get_note_comment_replies
 * @param {string, string} note_id, comment_id - 必填参数
 */
async function getNoteCommentReplies(note_id, comment_id, extraParams = {}) {
  const params = { note_id, comment_id, ...extraParams };
  return request('/web/get_note_comment_replies', params);
}

// ==================== 搜 ====================

/**
 * 搜索笔记/Search notes
 * GET /api/v1/xiaohongshu/web_v3/fetch_search_notes
 * @param {string} keyword - 必填参数
 */
async function fetchSearchNotes(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web_v3/fetch_search_notes', params);
}

/**
 * 搜索用户/Search users
 * GET /api/v1/xiaohongshu/web_v3/fetch_search_users
 * @param {string} keyword - 必填参数
 */
async function fetchSearchUsers(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web_v3/fetch_search_users', params);
}

/**
 * 获取搜索联想词/Fetch search suggestions
 * GET /api/v1/xiaohongshu/web_v3/fetch_search_suggest
 * 无必填参数
 */
async function fetchSearchSuggest(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web_v3/fetch_search_suggest', params);
}

/**
 * 搜索笔记/Search notes
 * GET /api/v1/xiaohongshu/app_v2/search_notes
 * @param {string} keyword - 必填参数
 */
async function searchNotes(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app_v2/search_notes', params);
}

/**
 * 搜索用户/Search users
 * GET /api/v1/xiaohongshu/app_v2/search_users
 * @param {string} keyword - 必填参数
 */
async function searchUsers(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app_v2/search_users', params);
}

/**
 * 搜索图片/Search images
 * GET /api/v1/xiaohongshu/app_v2/search_images
 * @param {string} keyword - 必填参数
 */
async function searchImages(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app_v2/search_images', params);
}

/**
 * 搜索商品/Search products
 * GET /api/v1/xiaohongshu/app_v2/search_products
 * @param {string} keyword - 必填参数
 */
async function searchProducts(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app_v2/search_products', params);
}

/**
 * 搜索群聊/Search groups
 * GET /api/v1/xiaohongshu/app_v2/search_groups
 * @param {string} keyword - 必填参数
 */
async function searchGroups(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app_v2/search_groups', params);
}

/**
 * 搜索笔记/Search notes
 * GET /api/v1/xiaohongshu/app/search_notes
 * @param {string, string} keyword, page - 必填参数
 */
async function searchNotes(keyword, page, extraParams = {}) {
  const params = { keyword, page, ...extraParams };
  return request('/app/search_notes', params);
}

/**
 * 搜索商品/Search products
 * GET /api/v1/xiaohongshu/app/search_products
 * @param {string, string} keyword, page - 必填参数
 */
async function searchProducts(keyword, page, extraParams = {}) {
  const params = { keyword, page, ...extraParams };
  return request('/app/search_products', params);
}

/**
 * 获取搜索笔记/Fetch search notes
 * GET /api/v1/xiaohongshu/web_v2/fetch_search_notes
 * @param {string} keywords - 必填参数
 */
async function fetchSearchNotes(keywords, extraParams = {}) {
  const params = { keywords, ...extraParams };
  return request('/web_v2/fetch_search_notes', params);
}

/**
 * 获取搜索用户/Fetch search users
 * GET /api/v1/xiaohongshu/web_v2/fetch_search_users
 * @param {string} keywords - 必填参数
 */
async function fetchSearchUsers(keywords, extraParams = {}) {
  const params = { keywords, ...extraParams };
  return request('/web_v2/fetch_search_users', params);
}

/**
 * 搜索笔记/Search notes
 * GET /api/v1/xiaohongshu/web/search_notes
 * @param {string} keyword - 必填参数
 */
async function searchNotes(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web/search_notes', params);
}

/**
 * 搜索笔记 V3/Search notes V3
 * GET /api/v1/xiaohongshu/web/search_notes_v3
 * @param {string} keyword - 必填参数
 */
async function searchNotesV3(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web/search_notes_v3', params);
}

/**
 * 搜索用户/Search users
 * GET /api/v1/xiaohongshu/web/search_users
 * @param {string} keyword - 必填参数
 */
async function searchUsers(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web/search_users', params);
}

// ==================== 创 ====================

/**
 * 获取创作者推荐灵感列表/Get creator inspiration feed
 * GET /api/v1/xiaohongshu/app_v2/get_creator_inspiration_feed
 * 无必填参数
 */
async function getCreatorInspirationFeed(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app_v2/get_creator_inspiration_feed', params);
}

/**
 * 获取创作者热点灵感列表/Get creator hot inspiration
 * GET /api/v1/xiaohongshu/app_v2/get_creator_hot_inspiration_feed
 * 无必填参数
 */
async function getCreatorHotInspirationFeed(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app_v2/get_creator_hot_inspiration_feed', params);
}

// ==================== 内 ====================

/**
 * 提取分享链接信息/Extract share link info
 * GET /api/v1/xiaohongshu/app/extract_share_info
 * @param {string} share_link - 必填参数
 */
async function extractShareInfo(share_link, extraParams = {}) {
  const params = { share_link, ...extraParams };
  return request('/app/extract_share_info', params);
}

/**
 * 从分享链接中提取用户ID和xsec_token/Extract user ID
 * GET /api/v1/xiaohongshu/app/get_user_id_and_xsec_token
 * @param {string} share_link - 必填参数
 */
async function getUserIdAndXsecToken(share_link, extraParams = {}) {
  const params = { share_link, ...extraParams };
  return request('/app/get_user_id_and_xsec_token', params);
}

module.exports = {
  request,
  fetchNoteDetail,
  fetchHomefeed,
  fetchHomefeedCategories,
  fetchUserInfo,
  fetchUserNotes,
  getImageNoteDetail,
  getVideoNoteDetail,
  getUserInfo,
  getUserPostedNotes,
  getProductDetail,
  getProductRecommendations,
  getTopicInfo,
  getTopicFeed,
  getNoteInfo,
  getNoteInfoV2,
  getNotesByTopic,
  getUserInfo,
  getUserNotes,
  getProductDetail,
  fetchFeedNotes,
  fetchFeedNotesV2,
  fetchFeedNotesV3,
  fetchNoteImage,
  fetchHomeNotes,
  fetchHomeNotesApp,
  fetchUserInfo,
  fetchUserInfoApp,
  fetchProductList,
  fetchHotList,
  getHomeRecommend,
  getNoteInfoV2,
  getNoteInfoV4,
  getNoteInfoV7,
  getUserInfo,
  getUserInfoV2,
  getUserNotesV2,
  getNoteIdAndXsecToken,
  getProductInfo,
  fetchNoteComments,
  fetchSubComments,
  getNoteComments,
  getNoteSubComments,
  getUserFavedNotes,
  getProductReviewOverview,
  getProductReviews,
  getNoteComments,
  getSubComments,
  fetchFeedNotesV4,
  fetchFeedNotesV5,
  fetchNoteComments,
  fetchSubComments,
  fetchFollowerList,
  fetchFollowingList,
  getNoteComments,
  getNoteCommentReplies,
  fetchSearchNotes,
  fetchSearchUsers,
  fetchSearchSuggest,
  searchNotes,
  searchUsers,
  searchImages,
  searchProducts,
  searchGroups,
  searchNotes,
  searchProducts,
  fetchSearchNotes,
  fetchSearchUsers,
  searchNotes,
  searchNotesV3,
  searchUsers,
  fetchTrending,
  getCreatorInspirationFeed,
  getCreatorHotInspirationFeed,
  extractShareInfo,
  getUserIdAndXsecToken,
};
