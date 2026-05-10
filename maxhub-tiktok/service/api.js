// 第三方接口请求封装 - tiktok
// 基于MaxHub API中转站调用，包含所有API

const BASE_URL = process.env.MAXHUB_BASE_URL || 'https://www.aconfig.cn';
const API_KEY = process.env.MAXHUB_API_KEY;
const PLATFORM = 'tiktok';

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
 * 获取单个作品数据/Get single video data
 * GET /api/v1/tiktok/web/fetch_post_detail
 * @param {string} itemId - 必填参数
 */
async function fetchPostDetail(itemId, extraParams = {}) {
  const params = { itemId, ...extraParams };
  return request('/web/fetch_post_detail', params);
}

/**
 * 获取单个作品数据 V2/Get single video data V2
 * GET /api/v1/tiktok/web/fetch_post_detail_v2
 * @param {string} itemId - 必填参数
 */
async function fetchPostDetailV2(itemId, extraParams = {}) {
  const params = { itemId, ...extraParams };
  return request('/web/fetch_post_detail_v2', params);
}

/**
 * 获取探索作品数据/Get explore video data
 * GET /api/v1/tiktok/web/fetch_explore_post
 * 无必填参数
 */
async function fetchExplorePost(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_explore_post', params);
}

/**
 * 获取用户的个人信息/Get user profile
 * GET /api/v1/tiktok/web/fetch_user_profile
 * 无必填参数
 */
async function fetchUserProfile(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_user_profile', params);
}

/**
 * 获取用户的作品列表/Get user posts
 * GET /api/v1/tiktok/web/fetch_user_post
 * @param {string} secUid - 必填参数
 */
async function fetchUserPost(secUid, extraParams = {}) {
  const params = { secUid, ...extraParams };
  return request('/web/fetch_user_post', params);
}

/**
 * 获取用户的转发作品列表/Get user reposts
 * GET /api/v1/tiktok/web/fetch_user_repost
 * @param {string} secUid - 必填参数
 */
async function fetchUserRepost(secUid, extraParams = {}) {
  const params = { secUid, ...extraParams };
  return request('/web/fetch_user_repost', params);
}

/**
 * 获取用户的播放列表/Get user play list
 * GET /api/v1/tiktok/web/fetch_user_play_list
 * @param {string} secUid - 必填参数
 */
async function fetchUserPlayList(secUid, extraParams = {}) {
  const params = { secUid, ...extraParams };
  return request('/web/fetch_user_play_list', params);
}

/**
 * 获取用户的合辑列表/Get user mix list
 * GET /api/v1/tiktok/web/fetch_user_mix
 * @param {string} mixId - 必填参数
 */
async function fetchUserMix(mixId, extraParams = {}) {
  const params = { mixId, ...extraParams };
  return request('/web/fetch_user_mix', params);
}

/**
 * 获取用户的直播详情/Get user live details
 * GET /api/v1/tiktok/web/fetch_user_live_detail
 * @param {string} uniqueId - 必填参数
 */
async function fetchUserLiveDetail(uniqueId, extraParams = {}) {
  const params = { uniqueId, ...extraParams };
  return request('/web/fetch_user_live_detail', params);
}

/**
 * Tag详情/Tag Detail
 * GET /api/v1/tiktok/web/fetch_tag_detail
 * @param {string} tag_name - 必填参数
 */
async function fetchTagDetail(tag_name, extraParams = {}) {
  const params = { tag_name, ...extraParams };
  return request('/web/fetch_tag_detail', params);
}

/**
 * Tag作品/Tag Post
 * GET /api/v1/tiktok/web/fetch_tag_post
 * @param {string} challengeID - 必填参数
 */
async function fetchTagPost(challengeID, extraParams = {}) {
  const params = { challengeID, ...extraParams };
  return request('/web/fetch_tag_post', params);
}

/**
 * 首页推荐作品/Home Feed
 * POST /api/v1/tiktok/web/fetch_home_feed
 * 无必填参数
 */
async function fetchHomeFeed(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_home_feed', params, 'POST');
}

/**
 * 加密strData/Encrypt strData
 * GET /api/v1/tiktok/web/encrypt_strData
 * @param {string} data - 必填参数
 */
async function encryptStrData(data, extraParams = {}) {
  const params = { data, ...extraParams };
  return request('/web/encrypt_strData', params);
}

/**
 * 解密strData/Decrypt strData
 * GET /api/v1/tiktok/web/decrypt_strData
 * @param {string} encrypted_data - 必填参数
 */
async function decryptStrData(encrypted_data, extraParams = {}) {
  const params = { encrypted_data, ...extraParams };
  return request('/web/decrypt_strData', params);
}

/**
 * 获取用户unique_id/Get user unique_id
 * GET /api/v1/tiktok/web/get_unique_id
 * @param {string} url - 必填参数
 */
async function getUniqueId(url, extraParams = {}) {
  const params = { url, ...extraParams };
  return request('/web/get_unique_id', params);
}

/**
 * 获取列表unique_id/Get list unique_id
 * POST /api/v1/tiktok/web/get_all_unique_id
 * 无必填参数
 */
async function getAllUniqueId(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/get_all_unique_id', params, 'POST');
}

/**
 * TikTok直播间弹幕参数获取/tiktok live room danmaku
 * GET /api/v1/tiktok/web/fetch_live_im_fetch
 * @param {string} room_id - 必填参数
 */
async function fetchLiveImFetch(room_id, extraParams = {}) {
  const params = { room_id, ...extraParams };
  return request('/web/fetch_live_im_fetch', params);
}

/**
 * 直播间开播状态检测/Live room start status check
 * GET /api/v1/tiktok/web/fetch_check_live_alive
 * @param {string} room_id - 必填参数
 */
async function fetchCheckLiveAlive(room_id, extraParams = {}) {
  const params = { room_id, ...extraParams };
  return request('/web/fetch_check_live_alive', params);
}

/**
 * 批量直播间开播状态检测/Batch live room start status
 * GET /api/v1/tiktok/web/fetch_batch_check_live_alive
 * @param {string} room_ids - 必填参数
 */
async function fetchBatchCheckLiveAlive(room_ids, extraParams = {}) {
  const params = { room_ids, ...extraParams };
  return request('/web/fetch_batch_check_live_alive', params);
}

/**
 * 通过直播链接获取直播间信息/Get live room information
 * GET /api/v1/tiktok/web/fetch_tiktok_live_data
 * @param {string} live_room_url - 必填参数
 */
async function fetchTiktokLiveData(live_room_url, extraParams = {}) {
  const params = { live_room_url, ...extraParams };
  return request('/web/fetch_tiktok_live_data', params);
}

/**
 * 获取直播间首页推荐列表/Get live room homepage recom
 * GET /api/v1/tiktok/web/fetch_live_recommend
 * @param {string} related_live_tag - 必填参数
 */
async function fetchLiveRecommend(related_live_tag, extraParams = {}) {
  const params = { related_live_tag, ...extraParams };
  return request('/web/fetch_live_recommend', params);
}

/**
 * 获取直播间礼物列表/Get live room gift list
 * GET /api/v1/tiktok/web/fetch_live_gift_list
 * 无必填参数
 */
async function fetchLiveGiftList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_live_gift_list', params);
}

/**
 * 根据Gift ID查询礼物名称/Get gift name by gift ID
 * POST /api/v1/tiktok/web/fetch_gift_name_by_id
 * 无必填参数
 */
async function fetchGiftNameById(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_gift_name_by_id', params, 'POST');
}

/**
 * 批量查询Gift ID对应的礼物名称($0.025/次,建议50个)/Batch
 * POST /api/v1/tiktok/web/fetch_gift_names_by_ids
 * 无必填参数
 */
async function fetchGiftNamesByIds(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_gift_names_by_ids', params, 'POST');
}

/**
 * 获取单个作品数据/Get single video data
 * GET /api/v1/tiktok/app/v3/fetch_one_video
 * @param {string} aweme_id - 必填参数
 */
async function fetchOneVideo(aweme_id, extraParams = {}) {
  const params = { aweme_id, ...extraParams };
  return request('/app/v3/fetch_one_video', params);
}

/**
 * 获取单个作品数据 V2/Get single video data V2
 * GET /api/v1/tiktok/app/v3/fetch_one_video_v2
 * @param {string} aweme_id - 必填参数
 */
async function fetchOneVideoV2(aweme_id, extraParams = {}) {
  const params = { aweme_id, ...extraParams };
  return request('/app/v3/fetch_one_video_v2', params);
}

/**
 * 获取单个作品数据 V3(支持国家参数)/Get single video dat
 * GET /api/v1/tiktok/app/v3/fetch_one_video_v3
 * @param {string} aweme_id - 必填参数
 */
async function fetchOneVideoV3(aweme_id, extraParams = {}) {
  const params = { aweme_id, ...extraParams };
  return request('/app/v3/fetch_one_video_v3', params);
}

/**
 * 批量获取视频信息/Batch Get Video Information
 * POST /api/v1/tiktok/app/v3/fetch_multi_video
 * 无必填参数
 */
async function fetchMultiVideo(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/v3/fetch_multi_video', params, 'POST');
}

/**
 * 批量获取视频信息 V2/Batch Get Video Information
 * POST /api/v1/tiktok/app/v3/fetch_multi_video_v2
 * 无必填参数
 */
async function fetchMultiVideoV2(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/v3/fetch_multi_video_v2', params, 'POST');
}

/**
 * 根据分享链接获取单个作品数据/Get single video data by
 * GET /api/v1/tiktok/app/v3/fetch_one_video_by_share_url_v2
 * @param {string} share_url - 必填参数
 */
async function fetchOneVideoByShareUrlV2(share_url, extraParams = {}) {
  const params = { share_url, ...extraParams };
  return request('/app/v3/fetch_one_video_by_share_url_v2', params);
}

/**
 * 根据分享链接获取单个作品数据/Get single video data by
 * GET /api/v1/tiktok/app/v3/fetch_one_video_by_share_url
 * @param {string} share_url - 必填参数
 */
async function fetchOneVideoByShareUrl(share_url, extraParams = {}) {
  const params = { share_url, ...extraParams };
  return request('/app/v3/fetch_one_video_by_share_url', params);
}

/**
 * 使用用户名获取用户 user_id 和 sec_user_id/Get user
 * GET /api/v1/tiktok/app/v3/get_user_id_and_sec_user_id_by_username
 * @param {string} username - 必填参数
 */
async function getUserIdAndSecUserIdByUsername(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/app/v3/get_user_id_and_sec_user_id_by_username', params);
}

/**
 * 获取指定用户的信息/Get information of specified u
 * GET /api/v1/tiktok/app/v3/handler_user_profile
 * 无必填参数
 */
async function handlerUserProfile(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/v3/handler_user_profile', params);
}

/**
 * 获取指定 Webcast 用户的信息/Get information of sp
 * GET /api/v1/tiktok/app/v3/fetch_webcast_user_info
 * 无必填参数
 */
async function fetchWebcastUserInfo(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/v3/fetch_webcast_user_info', params);
}

/**
 * 通过用户名获取用户账号国家地区/Get user account country
 * GET /api/v1/tiktok/app/v3/fetch_user_country_by_username
 * @param {string} username - 必填参数
 */
async function fetchUserCountryByUsername(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/app/v3/fetch_user_country_by_username', params);
}

/**
 * 获取类似用户推荐/Similar User Recommendations
 * GET /api/v1/tiktok/app/v3/fetch_similar_user_recommendations
 * @param {string} sec_uid - 必填参数
 */
async function fetchSimilarUserRecommendations(sec_uid, extraParams = {}) {
  const params = { sec_uid, ...extraParams };
  return request('/app/v3/fetch_similar_user_recommendations', params);
}

/**
 * 获取用户转发的作品数据/Get user repost video data
 * GET /api/v1/tiktok/app/v3/fetch_user_repost_videos
 * @param {string} user_id - 必填参数
 */
async function fetchUserRepostVideos(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/app/v3/fetch_user_repost_videos', params);
}

/**
 * 获取用户主页作品数据 V1/Get user homepage video da
 * GET /api/v1/tiktok/app/v3/fetch_user_post_videos
 * 无必填参数
 */
async function fetchUserPostVideos(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/v3/fetch_user_post_videos', params);
}

/**
 * 获取用户主页作品数据 V2/Get user homepage video da
 * GET /api/v1/tiktok/app/v3/fetch_user_post_videos_v2
 * 无必填参数
 */
async function fetchUserPostVideosV2(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/v3/fetch_user_post_videos_v2', params);
}

/**
 * 获取用户主页作品数据 V3（精简数据-更快速）/Get user homepag
 * GET /api/v1/tiktok/app/v3/fetch_user_post_videos_v3
 * 无必填参数
 */
async function fetchUserPostVideosV3(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/v3/fetch_user_post_videos_v3', params);
}

/**
 * 获取指定音乐的详情数据/Get details of specified mus
 * GET /api/v1/tiktok/app/v3/fetch_music_detail
 * @param {string} music_id - 必填参数
 */
async function fetchMusicDetail(music_id, extraParams = {}) {
  const params = { music_id, ...extraParams };
  return request('/app/v3/fetch_music_detail', params);
}

/**
 * 获取指定音乐的视频列表数据/Get video list of specifie
 * GET /api/v1/tiktok/app/v3/fetch_music_video_list
 * @param {string} music_id - 必填参数
 */
async function fetchMusicVideoList(music_id, extraParams = {}) {
  const params = { music_id, ...extraParams };
  return request('/app/v3/fetch_music_video_list', params);
}

/**
 * 获取指定话题的详情数据/Get details of specified has
 * GET /api/v1/tiktok/app/v3/fetch_hashtag_detail
 * @param {string} ch_id - 必填参数
 */
async function fetchHashtagDetail(ch_id, extraParams = {}) {
  const params = { ch_id, ...extraParams };
  return request('/app/v3/fetch_hashtag_detail', params);
}

/**
 * 获取指定话题的作品数据/Get video list of specified
 * GET /api/v1/tiktok/app/v3/fetch_hashtag_video_list
 * @param {string} ch_id - 必填参数
 */
async function fetchHashtagVideoList(ch_id, extraParams = {}) {
  const params = { ch_id, ...extraParams };
  return request('/app/v3/fetch_hashtag_video_list', params);
}

/**
 * 获取指定直播间的数据/Get data of specified live ro
 * GET /api/v1/tiktok/app/v3/fetch_live_room_info
 * @param {string} room_id - 必填参数
 */
async function fetchLiveRoomInfo(room_id, extraParams = {}) {
  const params = { room_id, ...extraParams };
  return request('/app/v3/fetch_live_room_info', params);
}

/**
 * 检测直播间是否在线/Check if live room is online
 * GET /api/v1/tiktok/app/v3/check_live_room_online
 * @param {string} room_id - 必填参数
 */
async function checkLiveRoomOnline(room_id, extraParams = {}) {
  const params = { room_id, ...extraParams };
  return request('/app/v3/check_live_room_online', params);
}

/**
 * 批量检测直播间是否在线/Batch check if live rooms ar
 * POST /api/v1/tiktok/app/v3/check_live_room_online_batch
 * 无必填参数
 */
async function checkLiveRoomOnlineBatch(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/v3/check_live_room_online_batch', params, 'POST');
}

/**
 * 获取分享短链接/Get share short link
 * GET /api/v1/tiktok/app/v3/fetch_share_short_link
 * @param {string} url - 必填参数
 */
async function fetchShareShortLink(url, extraParams = {}) {
  const params = { url, ...extraParams };
  return request('/app/v3/fetch_share_short_link', params);
}

/**
 * 获取分享二维码/Get share QR code
 * GET /api/v1/tiktok/app/v3/fetch_share_qr_code
 * @param {string} object_id - 必填参数
 */
async function fetchShareQrCode(object_id, extraParams = {}) {
  const params = { object_id, ...extraParams };
  return request('/app/v3/fetch_share_qr_code', params);
}

/**
 * 通过分享链接获取店铺ID/Get Shop ID by Share Link
 * GET /api/v1/tiktok/app/v3/fetch_shop_id_by_share_link
 * @param {string} share_link - 必填参数
 */
async function fetchShopIdByShareLink(share_link, extraParams = {}) {
  const params = { share_link, ...extraParams };
  return request('/app/v3/fetch_shop_id_by_share_link', params);
}

/**
 * 通过分享链接获取商品ID/Get Product ID by Share Lin
 * GET /api/v1/tiktok/app/v3/fetch_product_id_by_share_link
 * @param {string} share_link - 必填参数
 */
async function fetchProductIdByShareLink(share_link, extraParams = {}) {
  const params = { share_link, ...extraParams };
  return request('/app/v3/fetch_product_id_by_share_link', params);
}

/**
 * 获取商品详情数据（即将弃用，使用 fetch_product_detail_v2
 * GET /api/v1/tiktok/app/v3/fetch_product_detail
 * @param {string} product_id - 必填参数
 */
async function fetchProductDetail(product_id, extraParams = {}) {
  const params = { product_id, ...extraParams };
  return request('/app/v3/fetch_product_detail', params);
}

/**
 * 获取商品详情数据V2/Get product detail data V2
 * GET /api/v1/tiktok/app/v3/fetch_product_detail_v2
 * @param {string} product_id - 必填参数
 */
async function fetchProductDetailV2(product_id, extraParams = {}) {
  const params = { product_id, ...extraParams };
  return request('/app/v3/fetch_product_detail_v2', params);
}

/**
 * 获取商品详情数据V3 / Get product detail data V3
 * GET /api/v1/tiktok/app/v3/fetch_product_detail_v3
 * @param {string} product_id - 必填参数
 */
async function fetchProductDetailV3(product_id, extraParams = {}) {
  const params = { product_id, ...extraParams };
  return request('/app/v3/fetch_product_detail_v3', params);
}

/**
 * 获取商品详情数据V4 / Get product detail data V4
 * GET /api/v1/tiktok/app/v3/fetch_product_detail_v4
 * @param {string} product_id - 必填参数
 */
async function fetchProductDetailV4(product_id, extraParams = {}) {
  const params = { product_id, ...extraParams };
  return request('/app/v3/fetch_product_detail_v4', params);
}

/**
 * 获取商品评价数据/Get product review data
 * GET /api/v1/tiktok/app/v3/fetch_product_review
 * @param {string} product_id - 必填参数
 */
async function fetchProductReview(product_id, extraParams = {}) {
  const params = { product_id, ...extraParams };
  return request('/app/v3/fetch_product_review', params);
}

/**
 * 获取商家主页Page列表数据/Get shop home page list d
 * GET /api/v1/tiktok/app/v3/fetch_shop_home_page_list
 * @param {string} seller_id - 必填参数
 */
async function fetchShopHomePageList(seller_id, extraParams = {}) {
  const params = { seller_id, ...extraParams };
  return request('/app/v3/fetch_shop_home_page_list', params);
}

/**
 * 获取商家主页数据/Get shop home page data
 * GET /api/v1/tiktok/app/v3/fetch_shop_home
 * @param {string, string} page_id, seller_id - 必填参数
 */
async function fetchShopHome(page_id, seller_id, extraParams = {}) {
  const params = { page_id, seller_id, ...extraParams };
  return request('/app/v3/fetch_shop_home', params);
}

/**
 * 获取商家商品推荐数据/Get shop product recommend da
 * GET /api/v1/tiktok/app/v3/fetch_shop_product_recommend
 * @param {string} seller_id - 必填参数
 */
async function fetchShopProductRecommend(seller_id, extraParams = {}) {
  const params = { seller_id, ...extraParams };
  return request('/app/v3/fetch_shop_product_recommend', params);
}

/**
 * 获取商家商品列表数据/Get shop product list data
 * GET /api/v1/tiktok/app/v3/fetch_shop_product_list
 * @param {string} seller_id - 必填参数
 */
async function fetchShopProductList(seller_id, extraParams = {}) {
  const params = { seller_id, ...extraParams };
  return request('/app/v3/fetch_shop_product_list', params);
}

/**
 * 获取商家商品列表数据 V2/Get shop product list data
 * GET /api/v1/tiktok/app/v3/fetch_shop_product_list_v2
 * @param {string} seller_id - 必填参数
 */
async function fetchShopProductListV2(seller_id, extraParams = {}) {
  const params = { seller_id, ...extraParams };
  return request('/app/v3/fetch_shop_product_list_v2', params);
}

/**
 * 获取商家信息数据/Get shop information data
 * GET /api/v1/tiktok/app/v3/fetch_shop_info
 * @param {string} shop_id - 必填参数
 */
async function fetchShopInfo(shop_id, extraParams = {}) {
  const params = { shop_id, ...extraParams };
  return request('/app/v3/fetch_shop_info', params);
}

/**
 * 获取商家产品分类数据/Get shop product category dat
 * GET /api/v1/tiktok/app/v3/fetch_shop_product_category
 * @param {string} seller_id - 必填参数
 */
async function fetchShopProductCategory(seller_id, extraParams = {}) {
  const params = { seller_id, ...extraParams };
  return request('/app/v3/fetch_shop_product_category', params);
}

/**
 * 获取用户音乐列表数据/Get user music list data
 * GET /api/v1/tiktok/app/v3/fetch_user_music_list
 * @param {string} sec_uid - 必填参数
 */
async function fetchUserMusicList(sec_uid, extraParams = {}) {
  const params = { sec_uid, ...extraParams };
  return request('/app/v3/fetch_user_music_list', params);
}

/**
 * 获取内容翻译数据/Get content translation data
 * POST /api/v1/tiktok/app/v3/fetch_content_translate
 * 无必填参数
 */
async function fetchContentTranslate(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/v3/fetch_content_translate', params, 'POST');
}

/**
 * 获取主页视频推荐数据/Get home feed(recommend) vide
 * POST /api/v1/tiktok/app/v3/fetch_home_feed
 * 无必填参数
 */
async function fetchHomeFeed(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/v3/fetch_home_feed', params, 'POST');
}

/**
 * 获取直播间商品列表数据/Get live room product list d
 * GET /api/v1/tiktok/app/v3/fetch_live_room_product_list
 * @param {string, string} room_id, author_id - 必填参数
 */
async function fetchLiveRoomProductList(room_id, author_id, extraParams = {}) {
  const params = { room_id, author_id, ...extraParams };
  return request('/app/v3/fetch_live_room_product_list', params);
}

/**
 * 获取直播间商品列表数据 V2 /Get live room product li
 * GET /api/v1/tiktok/app/v3/fetch_live_room_product_list_v2
 * @param {string, string} room_id, author_id - 必填参数
 */
async function fetchLiveRoomProductListV2(room_id, author_id, extraParams = {}) {
  const params = { room_id, author_id, ...extraParams };
  return request('/app/v3/fetch_live_room_product_list_v2', params);
}

/**
 * 获取单个广告详情/Get single ad detail
 * GET /api/v1/tiktok/ads/get_ads_detail
 * @param {string} ads_id - 必填参数
 */
async function getAdsDetail(ads_id, extraParams = {}) {
  const params = { ads_id, ...extraParams };
  return request('/ads/get_ads_detail', params);
}

/**
 * 获取关键词洞察数据/Get keyword insights data
 * GET /api/v1/tiktok/ads/get_keyword_insights
 * 无必填参数
 */
async function getKeywordInsights(extraParams = {}) {
  const params = { ...extraParams };
  return request('/ads/get_keyword_insights', params);
}

/**
 * 获取热门产品列表/Get top products list
 * GET /api/v1/tiktok/ads/get_top_products
 * 无必填参数
 */
async function getTopProducts(extraParams = {}) {
  const params = { ...extraParams };
  return request('/ads/get_top_products', params);
}

/**
 * 获取热门标签列表/Get popular hashtags list
 * GET /api/v1/tiktok/ads/get_hashtag_list
 * 无必填参数
 */
async function getHashtagList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/ads/get_hashtag_list', params);
}

/**
 * 获取关键词列表/Get keyword list
 * GET /api/v1/tiktok/ads/get_keyword_list
 * 无必填参数
 */
async function getKeywordList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/ads/get_keyword_list', params);
}

/**
 * 获取热门广告聚光灯/Get top ads spotlight
 * GET /api/v1/tiktok/ads/get_top_ads_spotlight
 * 无必填参数
 */
async function getTopAdsSpotlight(extraParams = {}) {
  const params = { ...extraParams };
  return request('/ads/get_top_ads_spotlight', params);
}

/**
 * 获取广告百分位数据/Get ad percentile data
 * GET /api/v1/tiktok/ads/get_ad_percentile
 * @param {string} material_id - 必填参数
 */
async function getAdPercentile(material_id, extraParams = {}) {
  const params = { material_id, ...extraParams };
  return request('/ads/get_ad_percentile', params);
}

/**
 * 获取推荐广告/Get recommended ads
 * GET /api/v1/tiktok/ads/get_recommended_ads
 * @param {string} material_id - 必填参数
 */
async function getRecommendedAds(material_id, extraParams = {}) {
  const params = { material_id, ...extraParams };
  return request('/ads/get_recommended_ads', params);
}

/**
 * 获取关键词筛选器/Get keyword filters
 * GET /api/v1/tiktok/ads/get_keyword_filters
 * 无必填参数
 */
async function getKeywordFilters(extraParams = {}) {
  const params = { ...extraParams };
  return request('/ads/get_keyword_filters', params);
}

/**
 * 获取相关关键词/Get related keywords
 * GET /api/v1/tiktok/ads/get_related_keywords
 * 无必填参数
 */
async function getRelatedKeywords(extraParams = {}) {
  const params = { ...extraParams };
  return request('/ads/get_related_keywords', params);
}

/**
 * 获取关键词详细信息/Get keyword details
 * GET /api/v1/tiktok/ads/get_keyword_details
 * 无必填参数
 */
async function getKeywordDetails(extraParams = {}) {
  const params = { ...extraParams };
  return request('/ads/get_keyword_details', params);
}

/**
 * 获取产品筛选器/Get product filters
 * GET /api/v1/tiktok/ads/get_product_filters
 * 无必填参数
 */
async function getProductFilters(extraParams = {}) {
  const params = { ...extraParams };
  return request('/ads/get_product_filters', params);
}

/**
 * 获取产品指标数据/Get product metrics
 * GET /api/v1/tiktok/ads/get_product_metrics
 * @param {string} id - 必填参数
 */
async function getProductMetrics(id, extraParams = {}) {
  const params = { id, ...extraParams };
  return request('/ads/get_product_metrics', params);
}

/**
 * 获取产品详细信息/Get product detail
 * GET /api/v1/tiktok/ads/get_product_detail
 * @param {string} id - 必填参数
 */
async function getProductDetail(id, extraParams = {}) {
  const params = { id, ...extraParams };
  return request('/ads/get_product_detail', params);
}

/**
 * 获取标签筛选器/Get hashtag filters
 * GET /api/v1/tiktok/ads/get_hashtag_filters
 * 无必填参数
 */
async function getHashtagFilters(extraParams = {}) {
  const params = { ...extraParams };
  return request('/ads/get_hashtag_filters', params);
}

/**
 * 获取音乐筛选器/Get sound filters
 * GET /api/v1/tiktok/ads/get_sound_filters
 * 无必填参数
 */
async function getSoundFilters(extraParams = {}) {
  const params = { ...extraParams };
  return request('/ads/get_sound_filters', params);
}

/**
 * 获取音乐详情/Get sound detail
 * GET /api/v1/tiktok/ads/get_sound_detail
 * @param {string} clip_id - 必填参数
 */
async function getSoundDetail(clip_id, extraParams = {}) {
  const params = { clip_id, ...extraParams };
  return request('/ads/get_sound_detail', params);
}

/**
 * 获取音乐推荐/Get sound recommendations
 * GET /api/v1/tiktok/ads/get_sound_recommendations
 * @param {string} clip_id - 必填参数
 */
async function getSoundRecommendations(clip_id, extraParams = {}) {
  const params = { clip_id, ...extraParams };
  return request('/ads/get_sound_recommendations', params);
}

/**
 * 获取商品详情V1(桌面端-数据完整)/Get product detail V1
 * GET /api/v1/tiktok/shop/web/fetch_product_detail
 * @param {string} product_id - 必填参数
 */
async function fetchProductDetail(product_id, extraParams = {}) {
  const params = { product_id, ...extraParams };
  return request('/shop/web/fetch_product_detail', params);
}

/**
 * 获取商品详情V2(移动端-数据少)/Get product detail V2
 * GET /api/v1/tiktok/shop/web/fetch_product_detail_v2
 * @param {string} product_id - 必填参数
 */
async function fetchProductDetailV2(product_id, extraParams = {}) {
  const params = { product_id, ...extraParams };
  return request('/shop/web/fetch_product_detail_v2', params);
}

/**
 * 获取商品详情V3(移动端-数据完整)/Get product detail V3
 * GET /api/v1/tiktok/shop/web/fetch_product_detail_v3
 * @param {string} product_id - 必填参数
 */
async function fetchProductDetailV3(product_id, extraParams = {}) {
  const params = { product_id, ...extraParams };
  return request('/shop/web/fetch_product_detail_v3', params);
}

/**
 * 获取商家商品列表V1/Get seller products list V1
 * GET /api/v1/tiktok/shop/web/fetch_seller_products_list
 * @param {string} seller_id - 必填参数
 */
async function fetchSellerProductsList(seller_id, extraParams = {}) {
  const params = { seller_id, ...extraParams };
  return request('/shop/web/fetch_seller_products_list', params);
}

/**
 * 获取商家商品列表V2(移动端)/Get seller products list
 * GET /api/v1/tiktok/shop/web/fetch_seller_products_list_v2
 * @param {string} seller_id - 必填参数
 */
async function fetchSellerProductsListV2(seller_id, extraParams = {}) {
  const params = { seller_id, ...extraParams };
  return request('/shop/web/fetch_seller_products_list_v2', params);
}

/**
 * 获取商品分类列表/Get product category list
 * GET /api/v1/tiktok/shop/web/fetch_products_category_list
 * 无必填参数
 */
async function fetchProductsCategoryList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/shop/web/fetch_products_category_list', params);
}

/**
 * 根据分类ID获取商品列表/Get products by category ID
 * GET /api/v1/tiktok/shop/web/fetch_products_by_category_id
 * @param {string} category_id - 必填参数
 */
async function fetchProductsByCategoryId(category_id, extraParams = {}) {
  const params = { category_id, ...extraParams };
  return request('/shop/web/fetch_products_by_category_id', params);
}

/**
 * 获取热卖商品列表/Get hot selling products list
 * GET /api/v1/tiktok/shop/web/fetch_hot_selling_products_list
 * 无必填参数
 */
async function fetchHotSellingProductsList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/shop/web/fetch_hot_selling_products_list', params);
}

/**
 * 获取每日热门内容作品数据/Get daily trending video da
 * GET /api/v1/tiktok/web/fetch_trending_post
 * 无必填参数
 */
async function fetchTrendingPost(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_trending_post', params);
}

/**
 * 音乐排行榜/Music Chart List
 * GET /api/v1/tiktok/app/v3/fetch_music_chart_list
 * 无必填参数
 */
async function fetchMusicChartList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/v3/fetch_music_chart_list', params);
}

/**
 * 获取直播间排行榜数据/Get live room ranking list
 * GET /api/v1/tiktok/app/v3/fetch_live_ranking_list
 * @param {string, string} room_id, anchor_id - 必填参数
 */
async function fetchLiveRankingList(room_id, anchor_id, extraParams = {}) {
  const params = { room_id, anchor_id, ...extraParams };
  return request('/app/v3/fetch_live_ranking_list', params);
}

/**
 * 获取直播每日榜单数据/Get live daily rank data
 * GET /api/v1/tiktok/app/v3/fetch_live_daily_rank
 * 无必填参数
 */
async function fetchLiveDailyRank(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/v3/fetch_live_daily_rank', params);
}

/**
 * 获取创作者直播概览/Get Creator Live Overview
 * POST /api/v1/tiktok/creator/get_live_analytics_summary
 * 无必填参数
 */
async function getLiveAnalyticsSummary(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator/get_live_analytics_summary', params, 'POST');
}

/**
 * 获取创作者视频概览/Get Creator Video Overview
 * POST /api/v1/tiktok/creator/get_video_analytics_summary
 * 无必填参数
 */
async function getVideoAnalyticsSummary(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator/get_video_analytics_summary', params, 'POST');
}

/**
 * 获取创作者视频列表分析/Get Creator Video List Analy
 * POST /api/v1/tiktok/creator/get_video_list_analytics
 * 无必填参数
 */
async function getVideoListAnalytics(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator/get_video_list_analytics', params, 'POST');
}

/**
 * 获取创作者商品列表分析/Get Creator Product List Ana
 * POST /api/v1/tiktok/creator/get_product_analytics_list
 * 无必填参数
 */
async function getProductAnalyticsList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator/get_product_analytics_list', params, 'POST');
}

/**
 * 获取视频详细分段统计数据/Get Video Detailed Statisti
 * POST /api/v1/tiktok/creator/get_video_detailed_stats
 * 无必填参数
 */
async function getVideoDetailedStats(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator/get_video_detailed_stats', params, 'POST');
}

/**
 * 获取视频与商品关联统计数据/Get Video-Product Associat
 * POST /api/v1/tiktok/creator/get_video_to_product_stats
 * 无必填参数
 */
async function getVideoToProductStats(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator/get_video_to_product_stats', params, 'POST');
}

/**
 * 获取视频受众分析数据/Get Video Audience Analysis D
 * POST /api/v1/tiktok/creator/get_video_audience_stats
 * 无必填参数
 */
async function getVideoAudienceStats(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator/get_video_audience_stats', params, 'POST');
}

/**
 * 获取作品的统计数据/Get video metrics
 * GET /api/v1/tiktok/analytics/fetch_video_metrics
 * @param {string} item_id - 必填参数
 */
async function fetchVideoMetrics(item_id, extraParams = {}) {
  const params = { item_id, ...extraParams };
  return request('/analytics/fetch_video_metrics', params);
}

/**
 * 检测视频虚假流量分析/Detect fake views in video
 * GET /api/v1/tiktok/analytics/detect_fake_views
 * @param {string} item_id - 必填参数
 */
async function detectFakeViews(item_id, extraParams = {}) {
  const params = { item_id, ...extraParams };
  return request('/analytics/detect_fake_views', params);
}

/**
 * 获取视频评论关键词分析/Get comment keywords analysi
 * GET /api/v1/tiktok/analytics/fetch_comment_keywords
 * @param {string} item_id - 必填参数
 */
async function fetchCommentKeywords(item_id, extraParams = {}) {
  const params = { item_id, ...extraParams };
  return request('/analytics/fetch_comment_keywords', params);
}

/**
 * 获取创作者信息和里程碑数据/Get creator info and miles
 * GET /api/v1/tiktok/analytics/fetch_creator_info_and_milestones
 * @param {string} user_id - 必填参数
 */
async function fetchCreatorInfoAndMilestones(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/analytics/fetch_creator_info_and_milestones', params);
}

/**
 * 获取热门音乐排行榜/Get popular sound rankings
 * GET /api/v1/tiktok/ads/get_sound_rank_list
 * 无必填参数
 */
async function getSoundRankList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/ads/get_sound_rank_list', params);
}

/**
 * 获取广告关键帧分析/Get ad keyframe analysis
 * GET /api/v1/tiktok/ads/get_ad_keyframe_analysis
 * @param {string} material_id - 必填参数
 */
async function getAdKeyframeAnalysis(material_id, extraParams = {}) {
  const params = { material_id, ...extraParams };
  return request('/ads/get_ad_keyframe_analysis', params);
}

/**
 * 获取广告互动分析/Get ad interactive analysis
 * GET /api/v1/tiktok/ads/get_ad_interactive_analysis
 * @param {string} material_id - 必填参数
 */
async function getAdInteractiveAnalysis(material_id, extraParams = {}) {
  const params = { material_id, ...extraParams };
  return request('/ads/get_ad_interactive_analysis', params);
}

/**
 * 获取创意模式排行榜/Get creative pattern rankings
 * GET /api/v1/tiktok/ads/get_creative_patterns
 * 无必填参数
 */
async function getCreativePatterns(extraParams = {}) {
  const params = { ...extraParams };
  return request('/ads/get_creative_patterns', params);
}

/**
 * 获取流行趋势视频/Get popular trend videos
 * GET /api/v1/tiktok/ads/get_popular_trends
 * 无必填参数
 */
async function getPopularTrends(extraParams = {}) {
  const params = { ...extraParams };
  return request('/ads/get_popular_trends', params);
}

// ==================== 搜 ====================

/**
 * 获取每日趋势搜索关键词/Get daily trending search wo
 * GET /api/v1/tiktok/web/fetch_trending_searchwords
 * 无必填参数
 */
async function fetchTrendingSearchwords(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_trending_searchwords', params);
}

/**
 * 获取综合搜索列表/Get general search list
 * GET /api/v1/tiktok/web/fetch_general_search
 * @param {string} keyword - 必填参数
 */
async function fetchGeneralSearch(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web/fetch_general_search', params);
}

/**
 * 搜索关键字推荐/Search keyword suggest
 * GET /api/v1/tiktok/web/fetch_search_keyword_suggest
 * @param {string} keyword - 必填参数
 */
async function fetchSearchKeywordSuggest(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web/fetch_search_keyword_suggest', params);
}

/**
 * 搜索用户/Search user
 * GET /api/v1/tiktok/web/fetch_search_user
 * @param {string} keyword - 必填参数
 */
async function fetchSearchUser(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web/fetch_search_user', params);
}

/**
 * 搜索视频/Search video
 * GET /api/v1/tiktok/web/fetch_search_video
 * @param {string} keyword - 必填参数
 */
async function fetchSearchVideo(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web/fetch_search_video', params);
}

/**
 * 搜索直播/Search live
 * GET /api/v1/tiktok/web/fetch_search_live
 * @param {string} keyword - 必填参数
 */
async function fetchSearchLive(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web/fetch_search_live', params);
}

/**
 * 搜索照片/Search photo
 * GET /api/v1/tiktok/web/fetch_search_photo
 * @param {string} keyword - 必填参数
 */
async function fetchSearchPhoto(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web/fetch_search_photo', params);
}

/**
 * 获取指定关键词的综合搜索结果/Get comprehensive search
 * GET /api/v1/tiktok/app/v3/fetch_general_search_result
 * @param {string} keyword - 必填参数
 */
async function fetchGeneralSearchResult(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app/v3/fetch_general_search_result', params);
}

/**
 * 获取指定关键词的视频搜索结果/Get video search results
 * GET /api/v1/tiktok/app/v3/fetch_video_search_result
 * @param {string} keyword - 必填参数
 */
async function fetchVideoSearchResult(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app/v3/fetch_video_search_result', params);
}

/**
 * 获取指定关键词的用户搜索结果/Get user search results o
 * GET /api/v1/tiktok/app/v3/fetch_user_search_result
 * @param {string} keyword - 必填参数
 */
async function fetchUserSearchResult(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app/v3/fetch_user_search_result', params);
}

/**
 * 获取指定关键词的音乐搜索结果/Get music search results
 * GET /api/v1/tiktok/app/v3/fetch_music_search_result
 * @param {string} keyword - 必填参数
 */
async function fetchMusicSearchResult(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app/v3/fetch_music_search_result', params);
}

/**
 * 获取指定关键词的话题搜索结果/Get hashtag search result
 * GET /api/v1/tiktok/app/v3/fetch_hashtag_search_result
 * @param {string} keyword - 必填参数
 */
async function fetchHashtagSearchResult(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app/v3/fetch_hashtag_search_result', params);
}

/**
 * 获取指定关键词的直播搜索结果/Get live search results o
 * GET /api/v1/tiktok/app/v3/fetch_live_search_result
 * @param {string} keyword - 必填参数
 */
async function fetchLiveSearchResult(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app/v3/fetch_live_search_result', params);
}

/**
 * 获取地点搜索结果/Get location search results
 * GET /api/v1/tiktok/app/v3/fetch_location_search
 * @param {string} keyword - 必填参数
 */
async function fetchLocationSearch(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app/v3/fetch_location_search', params);
}

/**
 * 创作者搜索洞察/Creator Search Insights
 * GET /api/v1/tiktok/app/v3/fetch_creator_search_insights
 * 无必填参数
 */
async function fetchCreatorSearchInsights(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/v3/fetch_creator_search_insights', params);
}

/**
 * 创作者搜索洞察详情/Creator Search Insights Detail
 * GET /api/v1/tiktok/app/v3/fetch_creator_search_insights_detail
 * @param {string} query_id_str - 必填参数
 */
async function fetchCreatorSearchInsightsDetail(query_id_str, extraParams = {}) {
  const params = { query_id_str, ...extraParams };
  return request('/app/v3/fetch_creator_search_insights_detail', params);
}

/**
 * 创作者搜索洞察趋势/Creator Search Insights Trend
 * GET /api/v1/tiktok/app/v3/fetch_creator_search_insights_trend
 * @param {string} query_id_str - 必填参数
 */
async function fetchCreatorSearchInsightsTrend(query_id_str, extraParams = {}) {
  const params = { query_id_str, ...extraParams };
  return request('/app/v3/fetch_creator_search_insights_trend', params);
}

/**
 * 创作者搜索洞察相关视频/Creator Search Insights Vide
 * GET /api/v1/tiktok/app/v3/fetch_creator_search_insights_videos
 * @param {string} keyword - 必填参数
 */
async function fetchCreatorSearchInsightsVideos(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app/v3/fetch_creator_search_insights_videos', params);
}

/**
 * 搜索粉丝列表/Search follower list
 * GET /api/v1/tiktok/app/v3/search_follower_list
 * @param {string, string} user_id, keyword - 必填参数
 */
async function searchFollowerList(user_id, keyword, extraParams = {}) {
  const params = { user_id, keyword, ...extraParams };
  return request('/app/v3/search_follower_list', params);
}

/**
 * 搜索关注列表/Search following list
 * GET /api/v1/tiktok/app/v3/search_following_list
 * @param {string, string} user_id, keyword - 必填参数
 */
async function searchFollowingList(user_id, keyword, extraParams = {}) {
  const params = { user_id, keyword, ...extraParams };
  return request('/app/v3/search_following_list', params);
}

/**
 * 获取商品搜索结果/Get product search results
 * GET /api/v1/tiktok/app/v3/fetch_product_search
 * @param {string} keyword - 必填参数
 */
async function fetchProductSearch(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app/v3/fetch_product_search', params);
}

/**
 * 生成TikTok分享链接，唤起TikTok APP，跳转指定关键词搜索结果/Ge
 * GET /api/v1/tiktok/app/v3/open_tiktok_app_to_keyword_search
 * @param {string} keyword - 必填参数
 */
async function openTiktokAppToKeywordSearch(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app/v3/open_tiktok_app_to_keyword_search', params);
}

/**
 * 搜索广告/Search ads
 * GET /api/v1/tiktok/ads/search_ads
 * 无必填参数
 */
async function searchAds(extraParams = {}) {
  const params = { ...extraParams };
  return request('/ads/search_ads', params);
}

/**
 * 获取查询建议/Get query suggestions
 * GET /api/v1/tiktok/ads/get_query_suggestions
 * 无必填参数
 */
async function getQuerySuggestions(extraParams = {}) {
  const params = { ...extraParams };
  return request('/ads/get_query_suggestions', params);
}

/**
 * 搜索音乐提示/Search sound hints
 * GET /api/v1/tiktok/ads/search_sound_hint
 * @param {string} keyword - 必填参数
 */
async function searchSoundHint(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/ads/search_sound_hint', params);
}

/**
 * 搜索音乐/Search sounds
 * GET /api/v1/tiktok/ads/search_sound
 * @param {string} keyword - 必填参数
 */
async function searchSound(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/ads/search_sound', params);
}

/**
 * 搜索创作者/Search creators
 * GET /api/v1/tiktok/ads/search_creators
 * @param {string} keyword - 必填参数
 */
async function searchCreators(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/ads/search_creators', params);
}

/**
 * 获取搜索关键词建议V1/Get search keyword suggestio
 * GET /api/v1/tiktok/shop/web/fetch_search_word_suggestion
 * @param {string} search_word - 必填参数
 */
async function fetchSearchWordSuggestion(search_word, extraParams = {}) {
  const params = { search_word, ...extraParams };
  return request('/shop/web/fetch_search_word_suggestion', params);
}

/**
 * 获取搜索关键词建议V2(移动端)/Get search keyword sugg
 * GET /api/v1/tiktok/shop/web/fetch_search_word_suggestion_v2
 * @param {string} search_word - 必填参数
 */
async function fetchSearchWordSuggestionV2(search_word, extraParams = {}) {
  const params = { search_word, ...extraParams };
  return request('/shop/web/fetch_search_word_suggestion_v2', params);
}

/**
 * 搜索商品列表V1/Search products list V1
 * GET /api/v1/tiktok/shop/web/fetch_search_products_list
 * @param {string} search_word - 必填参数
 */
async function fetchSearchProductsList(search_word, extraParams = {}) {
  const params = { search_word, ...extraParams };
  return request('/shop/web/fetch_search_products_list', params);
}

/**
 * 搜索商品列表V2(移动端)/Search products list V2 (M
 * GET /api/v1/tiktok/shop/web/fetch_search_products_list_v2
 * @param {string} search_word - 必填参数
 */
async function fetchSearchProductsListV2(search_word, extraParams = {}) {
  const params = { search_word, ...extraParams };
  return request('/shop/web/fetch_search_products_list_v2', params);
}

/**
 * 搜索商品列表V3/Search products list V3
 * GET /api/v1/tiktok/shop/web/fetch_search_products_list_v3
 * @param {string} keyword - 必填参数
 */
async function fetchSearchProductsListV3(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/shop/web/fetch_search_products_list_v3', params);
}

// ==================== 互 ====================

/**
 * 获取用户的点赞列表/Get user likes
 * GET /api/v1/tiktok/web/fetch_user_like
 * @param {string} secUid - 必填参数
 */
async function fetchUserLike(secUid, extraParams = {}) {
  const params = { secUid, ...extraParams };
  return request('/web/fetch_user_like', params);
}

/**
 * 获取用户的收藏列表/Get user favorites
 * GET /api/v1/tiktok/web/fetch_user_collect
 * @param {string, string} cookie, secUid - 必填参数
 */
async function fetchUserCollect(cookie, secUid, extraParams = {}) {
  const params = { cookie, secUid, ...extraParams };
  return request('/web/fetch_user_collect', params);
}

/**
 * 获取作品的评论列表/Get video comments
 * GET /api/v1/tiktok/web/fetch_post_comment
 * @param {string} aweme_id - 必填参数
 */
async function fetchPostComment(aweme_id, extraParams = {}) {
  const params = { aweme_id, ...extraParams };
  return request('/web/fetch_post_comment', params);
}

/**
 * 获取作品的评论回复列表/Get video comment replies
 * GET /api/v1/tiktok/web/fetch_post_comment_reply
 * @param {string, string} item_id, comment_id - 必填参数
 */
async function fetchPostCommentReply(item_id, comment_id, extraParams = {}) {
  const params = { item_id, comment_id, ...extraParams };
  return request('/web/fetch_post_comment_reply', params);
}

/**
 * 获取用户的粉丝列表/Get user followers
 * GET /api/v1/tiktok/web/fetch_user_fans
 * @param {string} secUid - 必填参数
 */
async function fetchUserFans(secUid, extraParams = {}) {
  const params = { secUid, ...extraParams };
  return request('/web/fetch_user_fans', params);
}

/**
 * 获取用户的关注列表/Get user followings
 * GET /api/v1/tiktok/web/fetch_user_follow
 * @param {string} secUid - 必填参数
 */
async function fetchUserFollow(secUid, extraParams = {}) {
  const params = { secUid, ...extraParams };
  return request('/web/fetch_user_follow', params);
}

/**
 * 获取用户喜欢作品数据/Get user like video data
 * GET /api/v1/tiktok/app/v3/fetch_user_like_videos
 * @param {string} sec_user_id - 必填参数
 */
async function fetchUserLikeVideos(sec_user_id, extraParams = {}) {
  const params = { sec_user_id, ...extraParams };
  return request('/app/v3/fetch_user_like_videos', params);
}

/**
 * 获取单个视频评论数据/Get single video comments dat
 * GET /api/v1/tiktok/app/v3/fetch_video_comments
 * @param {string} aweme_id - 必填参数
 */
async function fetchVideoComments(aweme_id, extraParams = {}) {
  const params = { aweme_id, ...extraParams };
  return request('/app/v3/fetch_video_comments', params);
}

/**
 * 获取指定视频的评论回复数据/Get comment replies data o
 * GET /api/v1/tiktok/app/v3/fetch_video_comment_replies
 * @param {string, string} item_id, comment_id - 必填参数
 */
async function fetchVideoCommentReplies(item_id, comment_id, extraParams = {}) {
  const params = { item_id, comment_id, ...extraParams };
  return request('/app/v3/fetch_video_comment_replies', params);
}

/**
 * 获取指定用户的粉丝列表数据/Get follower list of speci
 * GET /api/v1/tiktok/app/v3/fetch_user_follower_list
 * 无必填参数
 */
async function fetchUserFollowerList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/v3/fetch_user_follower_list', params);
}

/**
 * 获取指定用户的关注列表数据/Get following list of spec
 * GET /api/v1/tiktok/app/v3/fetch_user_following_list
 * 无必填参数
 */
async function fetchUserFollowingList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/v3/fetch_user_following_list', params);
}

/**
 * 获取商品评论V1/Get product reviews V1
 * GET /api/v1/tiktok/shop/web/fetch_product_reviews_v1
 * @param {string} product_id - 必填参数
 */
async function fetchProductReviewsV1(product_id, extraParams = {}) {
  const params = { product_id, ...extraParams };
  return request('/shop/web/fetch_product_reviews_v1', params);
}

/**
 * 获取商品评论V2/Get product reviews V2
 * GET /api/v1/tiktok/shop/web/fetch_product_reviews_v2
 * @param {string} product_id - 必填参数
 */
async function fetchProductReviewsV2(product_id, extraParams = {}) {
  const params = { product_id, ...extraParams };
  return request('/shop/web/fetch_product_reviews_v2', params);
}

/**
 * 申请使用TikTok交互API权限（Scope）/Apply for TikTo
 * GET /api/v1/tiktok/interaction/apply
 * @param {string, string} api_key, invite_code - 必填参数
 */
async function apply(api_key, invite_code, extraParams = {}) {
  const params = { api_key, invite_code, ...extraParams };
  return request('/interaction/apply', params);
}

/**
 * 发送评论/Post comment
 * POST /api/v1/tiktok/interaction/post_comment
 * 无必填参数
 */
async function postComment(extraParams = {}) {
  const params = { ...extraParams };
  return request('/interaction/post_comment', params, 'POST');
}

/**
 * 回复评论/Reply to comment
 * POST /api/v1/tiktok/interaction/reply_comment
 * 无必填参数
 */
async function replyComment(extraParams = {}) {
  const params = { ...extraParams };
  return request('/interaction/reply_comment', params, 'POST');
}

/**
 * 点赞/Like
 * POST /api/v1/tiktok/interaction/like
 * 无必填参数
 */
async function like(extraParams = {}) {
  const params = { ...extraParams };
  return request('/interaction/like', params, 'POST');
}

/**
 * 关注/Follow
 * POST /api/v1/tiktok/interaction/follow
 * 无必填参数
 */
async function follow(extraParams = {}) {
  const params = { ...extraParams };
  return request('/interaction/follow', params, 'POST');
}

/**
 * 收藏/Collect
 * POST /api/v1/tiktok/interaction/collect
 * 无必填参数
 */
async function collect(extraParams = {}) {
  const params = { ...extraParams };
  return request('/interaction/collect', params, 'POST');
}

/**
 * 转发/Forward
 * POST /api/v1/tiktok/interaction/forward
 * 无必填参数
 */
async function forward(extraParams = {}) {
  const params = { ...extraParams };
  return request('/interaction/forward', params, 'POST');
}

// ==================== 工 ====================

/**
 * 生成 XBogus/Generate XBogus
 * POST /api/v1/tiktok/web/generate_xbogus
 * 无必填参数
 */
async function generateXbogus(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/generate_xbogus', params, 'POST');
}

/**
 * 生成哈希ID/Generate hashed ID
 * GET /api/v1/tiktok/web/generate_hashed_id
 * @param {string} email - 必填参数
 */
async function generateHashedId(email, extraParams = {}) {
  const params = { email, ...extraParams };
  return request('/web/generate_hashed_id', params);
}

/**
 * 生成TikTok分享链接，唤起TikTok APP，跳转指定作品详情页/Gene
 * GET /api/v1/tiktok/app/v3/open_tiktok_app_to_video_detail
 * @param {string} aweme_id - 必填参数
 */
async function openTiktokAppToVideoDetail(aweme_id, extraParams = {}) {
  const params = { aweme_id, ...extraParams };
  return request('/app/v3/open_tiktok_app_to_video_detail', params);
}

/**
 * 生成TikTok分享链接，唤起TikTok APP，跳转指定用户主页/Gener
 * GET /api/v1/tiktok/app/v3/open_tiktok_app_to_user_profile
 * @param {string} uid - 必填参数
 */
async function openTiktokAppToUserProfile(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/app/v3/open_tiktok_app_to_user_profile', params);
}

/**
 * 生成TikTok分享链接，唤起TikTok APP，给指定用户发送私信/Gene
 * GET /api/v1/tiktok/app/v3/open_tiktok_app_to_send_private_message
 * @param {string} uid - 必填参数
 */
async function openTiktokAppToSendPrivateMessage(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/app/v3/open_tiktok_app_to_send_private_message', params);
}

// ==================== 内 ====================

/**
 * 提取用户user_id/Extract user user_id
 * GET /api/v1/tiktok/web/get_user_id
 * @param {string} url - 必填参数
 */
async function getUserId(url, extraParams = {}) {
  const params = { url, ...extraParams };
  return request('/web/get_user_id', params);
}

/**
 * 提取用户sec_user_id/Extract user sec_user_id
 * GET /api/v1/tiktok/web/get_sec_user_id
 * @param {string} url - 必填参数
 */
async function getSecUserId(url, extraParams = {}) {
  const params = { url, ...extraParams };
  return request('/web/get_sec_user_id', params);
}

/**
 * 提取列表用户sec_user_id/Extract list user sec_
 * POST /api/v1/tiktok/web/get_all_sec_user_id
 * 无必填参数
 */
async function getAllSecUserId(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/get_all_sec_user_id', params, 'POST');
}

/**
 * 提取单个作品id/Extract single video id
 * GET /api/v1/tiktok/web/get_aweme_id
 * @param {string} url - 必填参数
 */
async function getAwemeId(url, extraParams = {}) {
  const params = { url, ...extraParams };
  return request('/web/get_aweme_id', params);
}

/**
 * 提取列表作品id/Extract list video id
 * POST /api/v1/tiktok/web/get_all_aweme_id
 * 无必填参数
 */
async function getAllAwemeId(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/get_all_aweme_id', params, 'POST');
}

/**
 * 提取直播间弹幕/Extract live room danmaku
 * GET /api/v1/tiktok/web/tiktok_live_room
 * @param {string, string} live_room_url, danmaku_type - 必填参数
 */
async function tiktokLiveRoom(live_room_url, danmaku_type, extraParams = {}) {
  const params = { live_room_url, danmaku_type, ...extraParams };
  return request('/web/tiktok_live_room', params);
}

/**
 * 根据直播间链接提取直播间ID/Extract live room ID from
 * GET /api/v1/tiktok/web/get_live_room_id
 * @param {string} live_room_url - 必填参数
 */
async function getLiveRoomId(live_room_url, extraParams = {}) {
  const params = { live_room_url, ...extraParams };
  return request('/web/get_live_room_id', params);
}

// ==================== 创 ====================

/**
 * 获取带货创作者信息/Get shopping creator informati
 * GET /api/v1/tiktok/app/v3/fetch_creator_info
 * @param {string} creator_uid - 必填参数
 */
async function fetchCreatorInfo(creator_uid, extraParams = {}) {
  const params = { creator_uid, ...extraParams };
  return request('/app/v3/fetch_creator_info', params);
}

/**
 * 获取创作者橱窗商品列表/Get creator showcase product
 * GET /api/v1/tiktok/app/v3/fetch_creator_showcase_product_list
 * @param {string} kol_id - 必填参数
 */
async function fetchCreatorShowcaseProductList(kol_id, extraParams = {}) {
  const params = { kol_id, ...extraParams };
  return request('/app/v3/fetch_creator_showcase_product_list', params);
}

/**
 * 获取创作者账号健康状态/Get Creator Account Health S
 * POST /api/v1/tiktok/creator/get_account_health_status
 * 无必填参数
 */
async function getAccountHealthStatus(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator/get_account_health_status', params, 'POST');
}

/**
 * 获取创作者账号违规记录列表/Get Creator Account Violat
 * POST /api/v1/tiktok/creator/get_account_violation_list
 * 无必填参数
 */
async function getAccountViolationList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator/get_account_violation_list', params, 'POST');
}

/**
 * 获取创作者账号概览/Get Creator Account Overview
 * POST /api/v1/tiktok/creator/get_account_insights_overview
 * 无必填参数
 */
async function getAccountInsightsOverview(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator/get_account_insights_overview', params, 'POST');
}

/**
 * 获取创作者账号信息/Get Creator Account Info
 * POST /api/v1/tiktok/creator/get_creator_account_info
 * 无必填参数
 */
async function getCreatorAccountInfo(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator/get_creator_account_info', params, 'POST');
}

/**
 * 获取橱窗商品列表/Get Showcase Product List
 * POST /api/v1/tiktok/creator/get_showcase_product_list
 * 无必填参数
 */
async function getShowcaseProductList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator/get_showcase_product_list', params, 'POST');
}

/**
 * 获取视频关联商品列表/Get Video Associated Product
 * POST /api/v1/tiktok/creator/get_video_associated_product_list
 * 无必填参数
 */
async function getVideoAssociatedProductList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator/get_video_associated_product_list', params, 'POST');
}

/**
 * 获取同款商品关联视频/Get Product Related Videos
 * POST /api/v1/tiktok/creator/get_product_related_videos
 * 无必填参数
 */
async function getProductRelatedVideos(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator/get_product_related_videos', params, 'POST');
}

/**
 * 获取标签创作者信息/Get hashtag creator info
 * GET /api/v1/tiktok/ads/get_hashtag_creator
 * @param {string} hashtag - 必填参数
 */
async function getHashtagCreator(hashtag, extraParams = {}) {
  const params = { hashtag, ...extraParams };
  return request('/ads/get_hashtag_creator', params);
}

/**
 * 获取创作者筛选器/Get creator filters
 * GET /api/v1/tiktok/ads/get_creator_filters
 * 无必填参数
 */
async function getCreatorFilters(extraParams = {}) {
  const params = { ...extraParams };
  return request('/ads/get_creator_filters', params);
}

/**
 * 获取创作者列表/Get creator list
 * GET /api/v1/tiktok/ads/get_creator_list
 * 无必填参数
 */
async function getCreatorList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/ads/get_creator_list', params);
}

module.exports = {
  request,
  fetchPostDetail,
  fetchPostDetailV2,
  fetchExplorePost,
  fetchUserProfile,
  fetchUserPost,
  fetchUserRepost,
  fetchUserPlayList,
  fetchUserMix,
  fetchUserLiveDetail,
  fetchTagDetail,
  fetchTagPost,
  fetchHomeFeed,
  encryptStrData,
  decryptStrData,
  getUniqueId,
  getAllUniqueId,
  fetchLiveImFetch,
  fetchCheckLiveAlive,
  fetchBatchCheckLiveAlive,
  fetchTiktokLiveData,
  fetchLiveRecommend,
  fetchLiveGiftList,
  fetchGiftNameById,
  fetchGiftNamesByIds,
  fetchOneVideo,
  fetchOneVideoV2,
  fetchOneVideoV3,
  fetchMultiVideo,
  fetchMultiVideoV2,
  fetchOneVideoByShareUrlV2,
  fetchOneVideoByShareUrl,
  getUserIdAndSecUserIdByUsername,
  handlerUserProfile,
  fetchWebcastUserInfo,
  fetchUserCountryByUsername,
  fetchSimilarUserRecommendations,
  fetchUserRepostVideos,
  fetchUserPostVideos,
  fetchUserPostVideosV2,
  fetchUserPostVideosV3,
  fetchMusicDetail,
  fetchMusicVideoList,
  fetchHashtagDetail,
  fetchHashtagVideoList,
  fetchLiveRoomInfo,
  checkLiveRoomOnline,
  checkLiveRoomOnlineBatch,
  fetchShareShortLink,
  fetchShareQrCode,
  fetchShopIdByShareLink,
  fetchProductIdByShareLink,
  fetchProductDetail,
  fetchProductDetailV2,
  fetchProductDetailV3,
  fetchProductDetailV4,
  fetchProductReview,
  fetchShopHomePageList,
  fetchShopHome,
  fetchShopProductRecommend,
  fetchShopProductList,
  fetchShopProductListV2,
  fetchShopInfo,
  fetchShopProductCategory,
  fetchUserMusicList,
  fetchContentTranslate,
  fetchHomeFeed,
  fetchLiveRoomProductList,
  fetchLiveRoomProductListV2,
  getAdsDetail,
  getKeywordInsights,
  getTopProducts,
  getHashtagList,
  getKeywordList,
  getTopAdsSpotlight,
  getAdPercentile,
  getRecommendedAds,
  getKeywordFilters,
  getRelatedKeywords,
  getKeywordDetails,
  getProductFilters,
  getProductMetrics,
  getProductDetail,
  getHashtagFilters,
  getSoundFilters,
  getSoundDetail,
  getSoundRecommendations,
  fetchProductDetail,
  fetchProductDetailV2,
  fetchProductDetailV3,
  fetchSellerProductsList,
  fetchSellerProductsListV2,
  fetchProductsCategoryList,
  fetchProductsByCategoryId,
  fetchHotSellingProductsList,
  fetchTrendingPost,
  fetchMusicChartList,
  fetchLiveRankingList,
  fetchLiveDailyRank,
  getLiveAnalyticsSummary,
  getVideoAnalyticsSummary,
  getVideoListAnalytics,
  getProductAnalyticsList,
  getVideoDetailedStats,
  getVideoToProductStats,
  getVideoAudienceStats,
  fetchVideoMetrics,
  detectFakeViews,
  fetchCommentKeywords,
  fetchCreatorInfoAndMilestones,
  getSoundRankList,
  getAdKeyframeAnalysis,
  getAdInteractiveAnalysis,
  getCreativePatterns,
  getPopularTrends,
  fetchTrendingSearchwords,
  fetchGeneralSearch,
  fetchSearchKeywordSuggest,
  fetchSearchUser,
  fetchSearchVideo,
  fetchSearchLive,
  fetchSearchPhoto,
  fetchGeneralSearchResult,
  fetchVideoSearchResult,
  fetchUserSearchResult,
  fetchMusicSearchResult,
  fetchHashtagSearchResult,
  fetchLiveSearchResult,
  fetchLocationSearch,
  fetchCreatorSearchInsights,
  fetchCreatorSearchInsightsDetail,
  fetchCreatorSearchInsightsTrend,
  fetchCreatorSearchInsightsVideos,
  searchFollowerList,
  searchFollowingList,
  fetchProductSearch,
  openTiktokAppToKeywordSearch,
  searchAds,
  getQuerySuggestions,
  searchSoundHint,
  searchSound,
  searchCreators,
  fetchSearchWordSuggestion,
  fetchSearchWordSuggestionV2,
  fetchSearchProductsList,
  fetchSearchProductsListV2,
  fetchSearchProductsListV3,
  fetchUserLike,
  fetchUserCollect,
  fetchPostComment,
  fetchPostCommentReply,
  fetchUserFans,
  fetchUserFollow,
  fetchUserLikeVideos,
  fetchVideoComments,
  fetchVideoCommentReplies,
  fetchUserFollowerList,
  fetchUserFollowingList,
  fetchProductReviewsV1,
  fetchProductReviewsV2,
  apply,
  postComment,
  replyComment,
  like,
  follow,
  collect,
  forward,
  generateXbogus,
  generateHashedId,
  openTiktokAppToVideoDetail,
  openTiktokAppToUserProfile,
  openTiktokAppToSendPrivateMessage,
  getUserId,
  getSecUserId,
  getAllSecUserId,
  getAwemeId,
  getAllAwemeId,
  tiktokLiveRoom,
  getLiveRoomId,
  fetchCreatorInfo,
  fetchCreatorShowcaseProductList,
  getAccountHealthStatus,
  getAccountViolationList,
  getAccountInsightsOverview,
  getCreatorAccountInfo,
  getShowcaseProductList,
  getVideoAssociatedProductList,
  getProductRelatedVideos,
  getHashtagCreator,
  getCreatorFilters,
  getCreatorList,
};
