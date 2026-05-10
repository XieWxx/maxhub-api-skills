// 第三方接口请求封装 - douyin
// 基于MaxHub API中转站调用，包含所有API

const BASE_URL = process.env.MAXHUB_BASE_URL || 'https://www.aconfig.cn';
const API_KEY = process.env.MAXHUB_API_KEY;
const PLATFORM = 'douyin';

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
 * GET /api/v1/douyin/web/fetch_one_video
 * @param {string} aweme_id - 必填参数
 */
async function fetchOneVideo(aweme_id, extraParams = {}) {
  const params = { aweme_id, ...extraParams };
  return request('/web/fetch_one_video', params);
}

/**
 * 获取单个作品数据 V2/Get single video data V2
 * GET /api/v1/douyin/web/fetch_one_video_v2
 * @param {string} aweme_id - 必填参数
 */
async function fetchOneVideoV2(aweme_id, extraParams = {}) {
  const params = { aweme_id, ...extraParams };
  return request('/web/fetch_one_video_v2', params);
}

/**
 * 根据分享链接获取单个作品数据/Get single video data by
 * GET /api/v1/douyin/web/fetch_one_video_by_share_url
 * @param {string} share_url - 必填参数
 */
async function fetchOneVideoByShareUrl(share_url, extraParams = {}) {
  const params = { share_url, ...extraParams };
  return request('/web/fetch_one_video_by_share_url', params);
}

/**
 * 获取视频的最高画质播放链接/Get the highest quality pl
 * GET /api/v1/douyin/web/fetch_video_high_quality_play_url
 * 无必填参数
 */
async function fetchVideoHighQualityPlayUrl(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_video_high_quality_play_url', params);
}

/**
 * 批量获取视频的最高画质播放链接/Batch get the highest qu
 * POST /api/v1/douyin/web/fetch_multi_video_high_quality_play_url
 * 无必填参数
 */
async function fetchMultiVideoHighQualityPlayUrl(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_multi_video_high_quality_play_url', params, 'POST');
}

/**
 * 批量获取视频信息/Batch Get Video Information
 * POST /api/v1/douyin/web/fetch_multi_video
 * 无必填参数
 */
async function fetchMultiVideo(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_multi_video', params, 'POST');
}

/**
 * 获取单个作品视频弹幕数据/Get single video danmaku da
 * GET /api/v1/douyin/web/fetch_one_video_danmaku
 * @param {string, string, string, string} item_id, duration, end_time, start_time - 必填参数
 */
async function fetchOneVideoDanmaku(item_id, duration, end_time, start_time, extraParams = {}) {
  const params = { item_id, duration, end_time, start_time, ...extraParams };
  return request('/web/fetch_one_video_danmaku', params);
}

/**
 * 获取首页推荐数据/Get home feed data
 * GET /api/v1/douyin/web/fetch_home_feed
 * 无必填参数
 */
async function fetchHomeFeed(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_home_feed', params);
}

/**
 * 获取相关作品推荐数据/Get related posts recommendat
 * GET /api/v1/douyin/web/fetch_related_posts
 * @param {string} aweme_id - 必填参数
 */
async function fetchRelatedPosts(aweme_id, extraParams = {}) {
  const params = { aweme_id, ...extraParams };
  return request('/web/fetch_related_posts', params);
}

/**
 * 获取用户主页作品数据/Get user homepage video data
 * GET /api/v1/douyin/web/fetch_user_post_videos
 * @param {string} sec_user_id - 必填参数
 */
async function fetchUserPostVideos(sec_user_id, extraParams = {}) {
  const params = { sec_user_id, ...extraParams };
  return request('/web/fetch_user_post_videos', params);
}

/**
 * 获取用户收藏作品数据/Get user collection video dat
 * POST /api/v1/douyin/web/fetch_user_collection_videos
 * 无必填参数
 */
async function fetchUserCollectionVideos(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_user_collection_videos', params, 'POST');
}

/**
 * 获取用户收藏夹/Get user collection
 * POST /api/v1/douyin/web/fetch_user_collects
 * 无必填参数
 */
async function fetchUserCollects(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_user_collects', params, 'POST');
}

/**
 * 获取用户收藏夹数据/Get user collection data
 * GET /api/v1/douyin/web/fetch_user_collects_videos
 * @param {string} collects_id - 必填参数
 */
async function fetchUserCollectsVideos(collects_id, extraParams = {}) {
  const params = { collects_id, ...extraParams };
  return request('/web/fetch_user_collects_videos', params);
}

/**
 * 获取用户合辑作品数据/Get user mix video data
 * GET /api/v1/douyin/web/fetch_user_mix_videos
 * @param {string} mix_id - 必填参数
 */
async function fetchUserMixVideos(mix_id, extraParams = {}) {
  const params = { mix_id, ...extraParams };
  return request('/web/fetch_user_mix_videos', params);
}

/**
 * 获取用户直播流数据/Get user live video data
 * GET /api/v1/douyin/web/fetch_user_live_videos
 * @param {string} webcast_id - 必填参数
 */
async function fetchUserLiveVideos(webcast_id, extraParams = {}) {
  const params = { webcast_id, ...extraParams };
  return request('/web/fetch_user_live_videos', params);
}

/**
 * 通过sec_uid获取指定用户的直播流数据/Get live video dat
 * GET /api/v1/douyin/web/fetch_user_live_videos_by_sec_uid
 * @param {string} sec_uid - 必填参数
 */
async function fetchUserLiveVideosBySecUid(sec_uid, extraParams = {}) {
  const params = { sec_uid, ...extraParams };
  return request('/web/fetch_user_live_videos_by_sec_uid', params);
}

/**
 * 通过room_id获取指定用户的直播流数据 V1/Get live video
 * GET /api/v1/douyin/web/fetch_user_live_videos_by_room_id
 * @param {string} room_id - 必填参数
 */
async function fetchUserLiveVideosByRoomId(room_id, extraParams = {}) {
  const params = { room_id, ...extraParams };
  return request('/web/fetch_user_live_videos_by_room_id', params);
}

/**
 * 通过room_id获取指定用户的直播流数据 V2/Gets the live s
 * GET /api/v1/douyin/web/fetch_user_live_videos_by_room_id_v2
 * @param {string} room_id - 必填参数
 */
async function fetchUserLiveVideosByRoomIdV2(room_id, extraParams = {}) {
  const params = { room_id, ...extraParams };
  return request('/web/fetch_user_live_videos_by_room_id_v2', params);
}

/**
 * 抖音直播间商品信息/Douyin live room product infor
 * GET /api/v1/douyin/web/fetch_live_room_product_result
 * @param {string, string} room_id, author_id - 必填参数
 */
async function fetchLiveRoomProductResult(room_id, author_id, extraParams = {}) {
  const params = { room_id, author_id, ...extraParams };
  return request('/web/fetch_live_room_product_result', params);
}

/**
 * 获取商品详情/Get product detail
 * GET /api/v1/douyin/web/fetch_product_detail
 * @param {string} product_id - 必填参数
 */
async function fetchProductDetail(product_id, extraParams = {}) {
  const params = { product_id, ...extraParams };
  return request('/web/fetch_product_detail', params);
}

/**
 * 获取商品SKU列表/Get product SKU list
 * GET /api/v1/douyin/web/fetch_product_sku_list
 * @param {string, string} product_id, author_id - 必填参数
 */
async function fetchProductSkuList(product_id, author_id, extraParams = {}) {
  const params = { product_id, author_id, ...extraParams };
  return request('/web/fetch_product_sku_list', params);
}

/**
 * 获取商品优惠券信息/Get product coupon information
 * GET /api/v1/douyin/web/fetch_product_coupon
 * @param {string, string, string, string, string} product_id, shop_id, price, author_id, sec_user_id - 必填参数
 */
async function fetchProductCoupon(product_id, shop_id, price, author_id, sec_user_id, extraParams = {}) {
  const params = { product_id, shop_id, price, author_id, sec_user_id, ...extraParams };
  return request('/web/fetch_product_coupon', params);
}

/**
 * 获取商品评价评分/Get product review score
 * GET /api/v1/douyin/web/fetch_product_review_score
 * @param {string, string} product_id, shop_id - 必填参数
 */
async function fetchProductReviewScore(product_id, shop_id, extraParams = {}) {
  const params = { product_id, shop_id, ...extraParams };
  return request('/web/fetch_product_review_score', params);
}

/**
 * 获取商品评价列表/Get product review list
 * GET /api/v1/douyin/web/fetch_product_review_list
 * @param {string, string} product_id, shop_id - 必填参数
 */
async function fetchProductReviewList(product_id, shop_id, extraParams = {}) {
  const params = { product_id, shop_id, ...extraParams };
  return request('/web/fetch_product_review_list', params);
}

/**
 * 使用UID获取用户信息/Get user information by UID
 * GET /api/v1/douyin/web/fetch_user_profile_by_uid
 * @param {string} uid - 必填参数
 */
async function fetchUserProfileByUid(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/web/fetch_user_profile_by_uid', params);
}

/**
 * 获取批量用户信息(最多10个)/Get batch user profile (
 * GET /api/v1/douyin/web/fetch_batch_user_profile_v1
 * @param {string} sec_user_ids - 必填参数
 */
async function fetchBatchUserProfileV1(sec_user_ids, extraParams = {}) {
  const params = { sec_user_ids, ...extraParams };
  return request('/web/fetch_batch_user_profile_v1', params);
}

/**
 * 获取批量用户信息(最多50个)/Get batch user profile (
 * GET /api/v1/douyin/web/fetch_batch_user_profile_v2
 * @param {string} sec_user_ids - 必填参数
 */
async function fetchBatchUserProfileV2(sec_user_ids, extraParams = {}) {
  const params = { sec_user_ids, ...extraParams };
  return request('/web/fetch_batch_user_profile_v2', params);
}

/**
 * 使用UID获取用户开播信息/Get user live information
 * GET /api/v1/douyin/web/fetch_user_live_info_by_uid
 * @param {string} uid - 必填参数
 */
async function fetchUserLiveInfoByUid(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/web/fetch_user_live_info_by_uid', params);
}

/**
 * 使用Short ID获取用户信息/Get user information by
 * GET /api/v1/douyin/web/fetch_user_profile_by_short_id
 * @param {string} short_id - 必填参数
 */
async function fetchUserProfileByShortId(short_id, extraParams = {}) {
  const params = { short_id, ...extraParams };
  return request('/web/fetch_user_profile_by_short_id', params);
}

/**
 * 生成短链接
 * GET /api/v1/douyin/web/handler_shorten_url
 * @param {string} target_url - 必填参数
 */
async function handlerShortenUrl(target_url, extraParams = {}) {
  const params = { target_url, ...extraParams };
  return request('/web/handler_shorten_url', params);
}

/**
 * 使用sec_user_id获取指定用户的信息/Get information o
 * GET /api/v1/douyin/web/handler_user_profile
 * @param {string} sec_user_id - 必填参数
 */
async function handlerUserProfile(sec_user_id, extraParams = {}) {
  const params = { sec_user_id, ...extraParams };
  return request('/web/handler_user_profile', params);
}

/**
 * 使用unique_id（抖音号）获取指定用户的信息/Get informatio
 * GET /api/v1/douyin/web/handler_user_profile_v2
 * @param {string} unique_id - 必填参数
 */
async function handlerUserProfileV2(unique_id, extraParams = {}) {
  const params = { unique_id, ...extraParams };
  return request('/web/handler_user_profile_v2', params);
}

/**
 * 加密用户uid到sec_user_id/Encrypt user uid to
 * GET /api/v1/douyin/web/encrypt_uid_to_sec_user_id
 * @param {string} uid - 必填参数
 */
async function encryptUidToSecUserId(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/web/encrypt_uid_to_sec_user_id', params);
}

/**
 * 根据抖音uid获取指定用户的信息/Get information of spec
 * GET /api/v1/douyin/web/handler_user_profile_v3
 * @param {string} uid - 必填参数
 */
async function handlerUserProfileV3(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/web/handler_user_profile_v3', params);
}

/**
 * 根据sec_user_id获取指定用户的信息（性别，年龄，直播等级、牌子）/Ge
 * GET /api/v1/douyin/web/handler_user_profile_v4
 * @param {string} sec_user_id - 必填参数
 */
async function handlerUserProfileV4(sec_user_id, extraParams = {}) {
  const params = { sec_user_id, ...extraParams };
  return request('/web/handler_user_profile_v4', params);
}

/**
 * 获取用户粉丝列表/Get user fans list
 * GET /api/v1/douyin/web/fetch_user_fans_list
 * 无必填参数
 */
async function fetchUserFansList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_user_fans_list', params);
}

/**
 * 话题作品/Challenge Posts
 * POST /api/v1/douyin/web/fetch_challenge_posts
 * 无必填参数
 */
async function fetchChallengePosts(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_challenge_posts', params, 'POST');
}

/**
 * 抖音视频频道数据/Douyin video channel data
 * GET /api/v1/douyin/web/fetch_video_channel_result
 * @param {string} tag_id - 必填参数
 */
async function fetchVideoChannelResult(tag_id, extraParams = {}) {
  const params = { tag_id, ...extraParams };
  return request('/web/fetch_video_channel_result', params);
}

/**
 * 直播间号转房间号/Webcast id to room id
 * GET /api/v1/douyin/web/webcast_id_2_room_id
 * @param {string} webcast_id - 必填参数
 */
async function webcastId_2RoomId(webcast_id, extraParams = {}) {
  const params = { webcast_id, ...extraParams };
  return request('/web/webcast_id_2_room_id', params);
}

/**
 * 抖音直播间弹幕参数获取/Douyin live room danmaku par
 * GET /api/v1/douyin/web/fetch_live_im_fetch
 * @param {string, string} room_id, user_unique_id - 必填参数
 */
async function fetchLiveImFetch(room_id, user_unique_id, extraParams = {}) {
  const params = { room_id, user_unique_id, ...extraParams };
  return request('/web/fetch_live_im_fetch', params);
}

/**
 * 短剧作品/Series Video
 * GET /api/v1/douyin/web/fetch_series_aweme
 * @param {string, string, string} offset, count, content_type - 必填参数
 */
async function fetchSeriesAweme(offset, count, content_type, extraParams = {}) {
  const params = { offset, count, content_type, ...extraParams };
  return request('/web/fetch_series_aweme', params);
}

/**
 * 知识作品推荐/Knowledge Video
 * GET /api/v1/douyin/web/fetch_knowledge_aweme
 * @param {string} count - 必填参数
 */
async function fetchKnowledgeAweme(count, extraParams = {}) {
  const params = { count, ...extraParams };
  return request('/web/fetch_knowledge_aweme', params);
}

/**
 * 游戏作品推荐/Game Video
 * GET /api/v1/douyin/web/fetch_game_aweme
 * @param {string} count - 必填参数
 */
async function fetchGameAweme(count, extraParams = {}) {
  const params = { count, ...extraParams };
  return request('/web/fetch_game_aweme', params);
}

/**
 * 二次元作品推荐/Anime Video
 * GET /api/v1/douyin/web/fetch_cartoon_aweme
 * @param {string} count - 必填参数
 */
async function fetchCartoonAweme(count, extraParams = {}) {
  const params = { count, ...extraParams };
  return request('/web/fetch_cartoon_aweme', params);
}

/**
 * 音乐作品推荐/Music Video
 * GET /api/v1/douyin/web/fetch_music_aweme
 * @param {string} count - 必填参数
 */
async function fetchMusicAweme(count, extraParams = {}) {
  const params = { count, ...extraParams };
  return request('/web/fetch_music_aweme', params);
}

/**
 * 美食作品推荐/Food Video
 * GET /api/v1/douyin/web/fetch_food_aweme
 * @param {string} count - 必填参数
 */
async function fetchFoodAweme(count, extraParams = {}) {
  const params = { count, ...extraParams };
  return request('/web/fetch_food_aweme', params);
}

/**
 * 获取单个作品数据/Get single video data
 * GET /api/v1/douyin/app/v3/fetch_one_video
 * @param {string} aweme_id - 必填参数
 */
async function fetchOneVideo(aweme_id, extraParams = {}) {
  const params = { aweme_id, ...extraParams };
  return request('/app/v3/fetch_one_video', params);
}

/**
 * 获取单个作品数据 V2/Get single video data V2
 * GET /api/v1/douyin/app/v3/fetch_one_video_v2
 * @param {string} aweme_id - 必填参数
 */
async function fetchOneVideoV2(aweme_id, extraParams = {}) {
  const params = { aweme_id, ...extraParams };
  return request('/app/v3/fetch_one_video_v2', params);
}

/**
 * 获取单个作品数据 V3 (无版权限制)/Get single video dat
 * GET /api/v1/douyin/app/v3/fetch_one_video_v3
 * @param {string} aweme_id - 必填参数
 */
async function fetchOneVideoV3(aweme_id, extraParams = {}) {
  const params = { aweme_id, ...extraParams };
  return request('/app/v3/fetch_one_video_v3', params);
}

/**
 * 根据分享口令获取分享信息/Get share info by share cod
 * GET /api/v1/douyin/app/v3/fetch_share_info_by_share_code
 * @param {string} share_code - 必填参数
 */
async function fetchShareInfoByShareCode(share_code, extraParams = {}) {
  const params = { share_code, ...extraParams };
  return request('/app/v3/fetch_share_info_by_share_code', params);
}

/**
 * 批量获取视频信息 V1/Batch Get Video Information
 * POST /api/v1/douyin/app/v3/fetch_multi_video
 * 无必填参数
 */
async function fetchMultiVideo(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/v3/fetch_multi_video', params, 'POST');
}

/**
 * 批量获取视频信息 V2/Batch Get Video Information
 * POST /api/v1/douyin/app/v3/fetch_multi_video_v2
 * 无必填参数
 */
async function fetchMultiVideoV2(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/v3/fetch_multi_video_v2', params, 'POST');
}

/**
 * 根据分享链接获取单个作品数据/Get single video data by
 * GET /api/v1/douyin/app/v3/fetch_one_video_by_share_url
 * @param {string} share_url - 必填参数
 */
async function fetchOneVideoByShareUrl(share_url, extraParams = {}) {
  const params = { share_url, ...extraParams };
  return request('/app/v3/fetch_one_video_by_share_url', params);
}

/**
 * 获取视频的最高画质播放链接/Get the highest quality pl
 * GET /api/v1/douyin/app/v3/fetch_video_high_quality_play_url
 * 无必填参数
 */
async function fetchVideoHighQualityPlayUrl(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/v3/fetch_video_high_quality_play_url', params);
}

/**
 * 批量获取视频的最高画质播放链接/Batch get the highest qu
 * POST /api/v1/douyin/app/v3/fetch_multi_video_high_quality_play_url
 * 无必填参数
 */
async function fetchMultiVideoHighQualityPlayUrl(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/v3/fetch_multi_video_high_quality_play_url', params, 'POST');
}

/**
 * 获取指定用户的信息/Get information of specified u
 * GET /api/v1/douyin/app/v3/handler_user_profile
 * @param {string} sec_user_id - 必填参数
 */
async function handlerUserProfile(sec_user_id, extraParams = {}) {
  const params = { sec_user_id, ...extraParams };
  return request('/app/v3/handler_user_profile', params);
}

/**
 * 获取用户粉丝列表/Get user fans list
 * GET /api/v1/douyin/app/v3/fetch_user_fans_list
 * 无必填参数
 */
async function fetchUserFansList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/v3/fetch_user_fans_list', params);
}

/**
 * 获取用户主页作品数据/Get user homepage video data
 * GET /api/v1/douyin/app/v3/fetch_user_post_videos
 * @param {string} sec_user_id - 必填参数
 */
async function fetchUserPostVideos(sec_user_id, extraParams = {}) {
  const params = { sec_user_id, ...extraParams };
  return request('/app/v3/fetch_user_post_videos', params);
}

/**
 * 获取抖音视频合集详情数据/Get Douyin video mix detail
 * GET /api/v1/douyin/app/v3/fetch_video_mix_detail
 * @param {string} mix_id - 必填参数
 */
async function fetchVideoMixDetail(mix_id, extraParams = {}) {
  const params = { mix_id, ...extraParams };
  return request('/app/v3/fetch_video_mix_detail', params);
}

/**
 * 获取抖音视频合集作品列表数据/Get Douyin video mix post
 * GET /api/v1/douyin/app/v3/fetch_video_mix_post_list
 * @param {string} mix_id - 必填参数
 */
async function fetchVideoMixPostList(mix_id, extraParams = {}) {
  const params = { mix_id, ...extraParams };
  return request('/app/v3/fetch_video_mix_post_list', params);
}

/**
 * 获取用户短剧合集列表/Get user series list
 * GET /api/v1/douyin/app/v3/fetch_user_series_list
 * 无必填参数
 */
async function fetchUserSeriesList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/v3/fetch_user_series_list', params);
}

/**
 * 获取短剧视频列表/Get series video list
 * GET /api/v1/douyin/app/v3/fetch_series_video_list
 * @param {string} series_id - 必填参数
 */
async function fetchSeriesVideoList(series_id, extraParams = {}) {
  const params = { series_id, ...extraParams };
  return request('/app/v3/fetch_series_video_list', params);
}

/**
 * 获取短剧详情信息/Get series detail
 * GET /api/v1/douyin/app/v3/fetch_series_detail
 * @param {string} series_id - 必填参数
 */
async function fetchSeriesDetail(series_id, extraParams = {}) {
  const params = { series_id, ...extraParams };
  return request('/app/v3/fetch_series_detail', params);
}

/**
 * 获取指定音乐的详情数据/Get details of specified mus
 * GET /api/v1/douyin/app/v3/fetch_music_detail
 * @param {string} music_id - 必填参数
 */
async function fetchMusicDetail(music_id, extraParams = {}) {
  const params = { music_id, ...extraParams };
  return request('/app/v3/fetch_music_detail', params);
}

/**
 * 获取指定音乐的视频列表数据/Get video list of specifie
 * GET /api/v1/douyin/app/v3/fetch_music_video_list
 * @param {string} music_id - 必填参数
 */
async function fetchMusicVideoList(music_id, extraParams = {}) {
  const params = { music_id, ...extraParams };
  return request('/app/v3/fetch_music_video_list', params);
}

/**
 * 获取指定话题的详情数据/Get details of specified has
 * GET /api/v1/douyin/app/v3/fetch_hashtag_detail
 * @param {string} ch_id - 必填参数
 */
async function fetchHashtagDetail(ch_id, extraParams = {}) {
  const params = { ch_id, ...extraParams };
  return request('/app/v3/fetch_hashtag_detail', params);
}

/**
 * 获取指定话题的作品数据/Get video list of specified
 * GET /api/v1/douyin/app/v3/fetch_hashtag_video_list
 * @param {string} ch_id - 必填参数
 */
async function fetchHashtagVideoList(ch_id, extraParams = {}) {
  const params = { ch_id, ...extraParams };
  return request('/app/v3/fetch_hashtag_video_list', params);
}

/**
 * 获取直播间送礼用户排行榜/Get live room gift user ran
 * GET /api/v1/douyin/web/fetch_live_gift_ranking
 * @param {string} room_id - 必填参数
 */
async function fetchLiveGiftRanking(room_id, extraParams = {}) {
  const params = { room_id, ...extraParams };
  return request('/web/fetch_live_gift_ranking', params);
}

/**
 * 根据视频ID获取作品的统计数据（点赞数、下载数、播放数、分享数）/Get the
 * GET /api/v1/douyin/app/v3/fetch_video_statistics
 * @param {string} aweme_ids - 必填参数
 */
async function fetchVideoStatistics(aweme_ids, extraParams = {}) {
  const params = { aweme_ids, ...extraParams };
  return request('/app/v3/fetch_video_statistics', params);
}

/**
 * 根据视频ID批量获取作品的统计数据（点赞数、下载数、播放数、分享数）/Get t
 * GET /api/v1/douyin/app/v3/fetch_multi_video_statistics
 * @param {string} aweme_ids - 必填参数
 */
async function fetchMultiVideoStatistics(aweme_ids, extraParams = {}) {
  const params = { aweme_ids, ...extraParams };
  return request('/app/v3/fetch_multi_video_statistics', params);
}

/**
 * 获取创作者中心热门视频榜单/Get creator material cente
 * GET /api/v1/douyin/creator/fetch_creator_material_center_billboard
 * 无必填参数
 */
async function fetchCreatorMaterialCenterBillboard(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator/fetch_creator_material_center_billboard', params);
}

/**
 * 获取创作者中心创作热点/Get creator hot spot billboa
 * GET /api/v1/douyin/creator/fetch_creator_hot_spot_billboard
 * 无必填参数
 */
async function fetchCreatorHotSpotBillboard(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator/fetch_creator_hot_spot_billboard', params);
}

/**
 * 获取创作者热门话题榜单/Get creator hot topic billbo
 * GET /api/v1/douyin/creator/fetch_creator_hot_topic_billboard
 * 无必填参数
 */
async function fetchCreatorHotTopicBillboard(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator/fetch_creator_hot_topic_billboard', params);
}

/**
 * 获取创作者热门道具榜单/Get creator hot props billbo
 * GET /api/v1/douyin/creator/fetch_creator_hot_props_billboard
 * 无必填参数
 */
async function fetchCreatorHotPropsBillboard(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator/fetch_creator_hot_props_billboard', params);
}

/**
 * 获取创作者热门挑战榜单/Get creator hot challenge bi
 * GET /api/v1/douyin/creator/fetch_creator_hot_challenge_billboard
 * 无必填参数
 */
async function fetchCreatorHotChallengeBillboard(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator/fetch_creator_hot_challenge_billboard', params);
}

/**
 * 获取创作者热门音乐榜单/Get creator hot music billbo
 * GET /api/v1/douyin/creator/fetch_creator_hot_music_billboard
 * 无必填参数
 */
async function fetchCreatorHotMusicBillboard(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator/fetch_creator_hot_music_billboard', params);
}

/**
 * 获取作品流量来源统计/Fetch item play source statis
 * POST /api/v1/douyin/creator_v2/fetch_item_play_source
 * 无必填参数
 */
async function fetchItemPlaySource(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator_v2/fetch_item_play_source', params, 'POST');
}

/**
 * 获取作品观看趋势分析/Fetch item watch trend analys
 * POST /api/v1/douyin/creator_v2/fetch_item_watch_trend
 * 无必填参数
 */
async function fetchItemWatchTrend(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator_v2/fetch_item_watch_trend', params, 'POST');
}

/**
 * 获取作品弹幕分析/Fetch item bullet analysis
 * POST /api/v1/douyin/creator_v2/fetch_item_danmaku_analysis
 * 无必填参数
 */
async function fetchItemDanmakuAnalysis(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator_v2/fetch_item_danmaku_analysis', params, 'POST');
}

/**
 * 获取作品观众数据分析/Fetch item audience portrait
 * POST /api/v1/douyin/creator_v2/fetch_item_audience_portrait
 * 无必填参数
 */
async function fetchItemAudiencePortrait(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator_v2/fetch_item_audience_portrait', params, 'POST');
}

/**
 * 获取作品观众其他数据分析/Fetch item audience others
 * POST /api/v1/douyin/creator_v2/fetch_item_audience_others
 * 无必填参数
 */
async function fetchItemAudienceOthers(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator_v2/fetch_item_audience_others', params, 'POST');
}

/**
 * 获取投稿分析概览/Fetch item analysis overview
 * POST /api/v1/douyin/creator_v2/fetch_item_analysis_overview
 * 无必填参数
 */
async function fetchItemAnalysisOverview(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator_v2/fetch_item_analysis_overview', params, 'POST');
}

/**
 * 获取所有有效日期/Get all valid dates
 * GET /api/v1/douyin/index/fetch_all_valid_date
 * 无必填参数
 */
async function fetchAllValidDate(extraParams = {}) {
  const params = { ...extraParams };
  return request('/index/fetch_all_valid_date', params);
}

/**
 * 获取关联分析有效日期/Get valid date for relation
 * GET /api/v1/douyin/index/fetch_valid_date_for_relation
 * 无必填参数
 */
async function fetchValidDateForRelation(extraParams = {}) {
  const params = { ...extraParams };
  return request('/index/fetch_valid_date_for_relation', params);
}

/**
 * 获取所有地区列表/Get all area list
 * GET /api/v1/douyin/index/fetch_all_area
 * 无必填参数
 */
async function fetchAllArea(extraParams = {}) {
  const params = { ...extraParams };
  return request('/index/fetch_all_area', params);
}

/**
 * 获取实时热点排行/Get current hot topics
 * GET /api/v1/douyin/index/fetch_current_hot_topic
 * 无必填参数
 */
async function fetchCurrentHotTopic(extraParams = {}) {
  const params = { ...extraParams };
  return request('/index/fetch_current_hot_topic', params);
}

/**
 * 获取热门关键词/Get hot words
 * GET /api/v1/douyin/index/fetch_hot_words
 * 无必填参数
 */
async function fetchHotWords(extraParams = {}) {
  const params = { ...extraParams };
  return request('/index/fetch_hot_words', params);
}

/**
 * 获取关键词有效日期/Get keyword valid date
 * POST /api/v1/douyin/index/fetch_keyword_valid_date
 * @param {string} keyword_list - 必填参数
 */
async function fetchKeywordValidDate(keyword_list, extraParams = {}) {
  const params = { keyword_list, ...extraParams };
  return request('/index/fetch_keyword_valid_date', params, 'POST');
}

/**
 * 获取多关键词热度趋势/Get multi-keyword hot trend
 * POST /api/v1/douyin/index/fetch_multi_keyword_hot_trend
 * @param {string, string, string} keyword_list, start_date, end_date - 必填参数
 */
async function fetchMultiKeywordHotTrend(keyword_list, start_date, end_date, extraParams = {}) {
  const params = { keyword_list, start_date, end_date, ...extraParams };
  return request('/index/fetch_multi_keyword_hot_trend', params, 'POST');
}

/**
 * 获取多关键词解读/Get multi-keyword interpretatio
 * POST /api/v1/douyin/index/fetch_multi_keyword_interpretation
 * @param {string, string, string} keyword_list, start_date, end_date - 必填参数
 */
async function fetchMultiKeywordInterpretation(keyword_list, start_date, end_date, extraParams = {}) {
  const params = { keyword_list, start_date, end_date, ...extraParams };
  return request('/index/fetch_multi_keyword_interpretation', params, 'POST');
}

/**
 * 获取关联词分析/Get relation word analysis
 * POST /api/v1/douyin/index/fetch_relation_word
 * @param {string, string, string} keyword, start_date, end_date - 必填参数
 */
async function fetchRelationWord(keyword, start_date, end_date, extraParams = {}) {
  const params = { keyword, start_date, end_date, ...extraParams };
  return request('/index/fetch_relation_word', params, 'POST');
}

/**
 * 获取人群画像/Get crowd portrait
 * POST /api/v1/douyin/index/fetch_portrait
 * @param {string, string, string} keyword, start_date, end_date - 必填参数
 */
async function fetchPortrait(keyword, start_date, end_date, extraParams = {}) {
  const params = { keyword, start_date, end_date, ...extraParams };
  return request('/index/fetch_portrait', params, 'POST');
}

/**
 * 获取用户订阅关键词/Get user subscribed keywords
 * POST /api/v1/douyin/index/fetch_get_user_sub_word
 * 无必填参数
 */
async function fetchGetUserSubWord(extraParams = {}) {
  const params = { ...extraParams };
  return request('/index/fetch_get_user_sub_word', params, 'POST');
}

/**
 * 抖音 uid 转加密 user_id/Encrypt Douyin uid to
 * GET /api/v1/douyin/index/fetch_encrypt_user_id
 * @param {string} uid - 必填参数
 */
async function fetchEncryptUserId(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/index/fetch_encrypt_user_id', params);
}

/**
 * 达人趋势对比/Daren compare users
 * POST /api/v1/douyin/index/fetch_daren_compare_users_stable
 * @param {string} user_list - 必填参数
 */
async function fetchDarenCompareUsersStable(user_list, extraParams = {}) {
  const params = { user_list, ...extraParams };
  return request('/index/fetch_daren_compare_users_stable', params, 'POST');
}

/**
 * 获取相似达人/Get similar daren
 * POST /api/v1/douyin/index/fetch_daren_similar_users
 * @param {string} user_id - 必填参数
 */
async function fetchDarenSimilarUsers(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/index/fetch_daren_similar_users', params, 'POST');
}

/**
 * 获取达人视频/Get daren top videos
 * POST /api/v1/douyin/index/fetch_daren_great_user_top_video
 * @param {string, string, string} user_id, start_date, end_date - 必填参数
 */
async function fetchDarenGreatUserTopVideo(user_id, start_date, end_date, extraParams = {}) {
  const params = { user_id, start_date, end_date, ...extraParams };
  return request('/index/fetch_daren_great_user_top_video', params, 'POST');
}

/**
 * 获取达人核心指标/Get daren core metrics
 * POST /api/v1/douyin/index/fetch_daren_great_item_mile_info
 * @param {string} user_id - 必填参数
 */
async function fetchDarenGreatItemMileInfo(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/index/fetch_daren_great_item_mile_info', params, 'POST');
}

/**
 * 获取达人粉丝分析/Get daren fans analysis
 * POST /api/v1/douyin/index/fetch_daren_great_user_fans_info
 * @param {string} user_id - 必填参数
 */
async function fetchDarenGreatUserFansInfo(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/index/fetch_daren_great_user_fans_info', params, 'POST');
}

/**
 * 获取品牌指数/Get brand index
 * POST /api/v1/douyin/index/fetch_brand_valid_info
 * @param {string} keyword_list - 必填参数
 */
async function fetchBrandValidInfo(keyword_list, extraParams = {}) {
  const params = { keyword_list, ...extraParams };
  return request('/index/fetch_brand_valid_info', params, 'POST');
}

/**
 * 获取品牌雷达图/Get brand radar chart
 * POST /api/v1/douyin/index/fetch_brand_radar_chart
 * @param {string, string, string} brand_name, start_date, end_date - 必填参数
 */
async function fetchBrandRadarChart(brand_name, start_date, end_date, extraParams = {}) {
  const params = { brand_name, start_date, end_date, ...extraParams };
  return request('/index/fetch_brand_radar_chart', params, 'POST');
}

/**
 * 获取品牌趋势线/Get brand trend lines
 * POST /api/v1/douyin/index/fetch_brand_lines
 * @param {string, string, string} brand_name, start_date, end_date - 必填参数
 */
async function fetchBrandLines(brand_name, start_date, end_date, extraParams = {}) {
  const params = { brand_name, start_date, end_date, ...extraParams };
  return request('/index/fetch_brand_lines', params, 'POST');
}

/**
 * 获取品牌周期数据/Get brand cycles
 * POST /api/v1/douyin/index/fetch_brand_cycles
 * @param {string, string, string} brand_name, start_date, end_date - 必填参数
 */
async function fetchBrandCycles(brand_name, start_date, end_date, extraParams = {}) {
  const params = { brand_name, start_date, end_date, ...extraParams };
  return request('/index/fetch_brand_cycles', params, 'POST');
}

/**
 * 获取品牌主动排行周榜/Get brand initiative rank wee
 * POST /api/v1/douyin/index/fetch_brand_initiative_rank_weekly
 * @param {string, string, string} brand_name, start_date, end_date - 必填参数
 */
async function fetchBrandInitiativeRankWeekly(brand_name, start_date, end_date, extraParams = {}) {
  const params = { brand_name, start_date, end_date, ...extraParams };
  return request('/index/fetch_brand_initiative_rank_weekly', params, 'POST');
}

/**
 * 创作指南有效日期/Get content valid date
 * GET /api/v1/douyin/index/fetch_content_valid_date
 * 无必填参数
 */
async function fetchContentValidDate(extraParams = {}) {
  const params = { ...extraParams };
  return request('/index/fetch_content_valid_date', params);
}

/**
 * 热门视频时间范围/Brand hot videos time scope
 * POST /api/v1/douyin/index/fetch_brand_hot_videos_time_scope
 * 无必填参数
 */
async function fetchBrandHotVideosTimeScope(extraParams = {}) {
  const params = { ...extraParams };
  return request('/index/fetch_brand_hot_videos_time_scope', params, 'POST');
}

/**
 * 创作热门关键词/Content creative keywords
 * POST /api/v1/douyin/index/fetch_content_creative_keywords
 * @param {string, string} tag_id, end_date - 必填参数
 */
async function fetchContentCreativeKeywords(tag_id, end_date, extraParams = {}) {
  const params = { tag_id, end_date, ...extraParams };
  return request('/index/fetch_content_creative_keywords', params, 'POST');
}

/**
 * 关键词相关视频/Creative keyword related items
 * POST /api/v1/douyin/index/fetch_content_creative_keyword_items
 * @param {string, string, string} tag_id, end_date, keyword - 必填参数
 */
async function fetchContentCreativeKeywordItems(tag_id, end_date, keyword, extraParams = {}) {
  const params = { tag_id, end_date, keyword, ...extraParams };
  return request('/index/fetch_content_creative_keyword_items', params, 'POST');
}

/**
 * 创作热门话题/Content creative topic
 * POST /api/v1/douyin/index/fetch_content_creative_topic
 * @param {string, string} tag_id, end_date - 必填参数
 */
async function fetchContentCreativeTopic(tag_id, end_date, extraParams = {}) {
  const params = { tag_id, end_date, ...extraParams };
  return request('/index/fetch_content_creative_topic', params, 'POST');
}

/**
 * 内容发布趋势/Content publish trend
 * GET /api/v1/douyin/index/fetch_content_publish_trend
 * @param {string, string, string} tag_id, start_date, end_date - 必填参数
 */
async function fetchContentPublishTrend(tag_id, start_date, end_date, extraParams = {}) {
  const params = { tag_id, start_date, end_date, ...extraParams };
  return request('/index/fetch_content_publish_trend', params);
}

/**
 * 创作时长分布/Content creative duration
 * POST /api/v1/douyin/index/fetch_content_creative_duration
 * @param {string, string} tag_id, end_date - 必填参数
 */
async function fetchContentCreativeDuration(tag_id, end_date, extraParams = {}) {
  const params = { tag_id, end_date, ...extraParams };
  return request('/index/fetch_content_creative_duration', params, 'POST');
}

/**
 * 创作者画像/Content author portrait
 * POST /api/v1/douyin/index/fetch_content_author_portrait
 * @param {string, string} tag_id, end_date - 必填参数
 */
async function fetchContentAuthorPortrait(tag_id, end_date, extraParams = {}) {
  const params = { tag_id, end_date, ...extraParams };
  return request('/index/fetch_content_author_portrait', params, 'POST');
}

/**
 * 消费者画像/Content consumer portrait
 * POST /api/v1/douyin/index/fetch_content_consumer_portrait
 * @param {string, string} tag_id, end_date - 必填参数
 */
async function fetchContentConsumerPortrait(tag_id, end_date, extraParams = {}) {
  const params = { tag_id, end_date, ...extraParams };
  return request('/index/fetch_content_consumer_portrait', params, 'POST');
}

/**
 * 互动趋势/Content interact trend
 * POST /api/v1/douyin/index/fetch_content_interact_trend
 * @param {string, string, string} tag_id, start_date, end_date - 必填参数
 */
async function fetchContentInteractTrend(tag_id, start_date, end_date, extraParams = {}) {
  const params = { tag_id, start_date, end_date, ...extraParams };
  return request('/index/fetch_content_interact_trend', params, 'POST');
}

/**
 * 消费趋势/Content consume trend
 * POST /api/v1/douyin/index/fetch_content_consume_trend
 * @param {string, string, string} tag_id, start_date, end_date - 必填参数
 */
async function fetchContentConsumeTrend(tag_id, start_date, end_date, extraParams = {}) {
  const params = { tag_id, start_date, end_date, ...extraParams };
  return request('/index/fetch_content_consume_trend', params, 'POST');
}

/**
 * 获取推荐报告/Get recommended insight reports
 * GET /api/v1/douyin/index/fetch_insight_recommend
 * 无必填参数
 */
async function fetchInsightRecommend(extraParams = {}) {
  const params = { ...extraParams };
  return request('/index/fetch_insight_recommend', params);
}

/**
 * 获取报告详情/Get report detail
 * GET /api/v1/douyin/index/fetch_report_detail
 * @param {string} report_id - 必填参数
 */
async function fetchReportDetail(report_id, extraParams = {}) {
  const params = { report_id, ...extraParams };
  return request('/index/fetch_report_detail', params);
}

/**
 * 获取报告相关推荐/Get related insight recommendat
 * GET /api/v1/douyin/index/fetch_insight_get_rec
 * @param {string} report_id - 必填参数
 */
async function fetchInsightGetRec(report_id, extraParams = {}) {
  const params = { report_id, ...extraParams };
  return request('/index/fetch_insight_get_rec', params);
}

/**
 * 获取中国城市列表/Fetch Chinese city list
 * GET /api/v1/douyin/billboard/fetch_city_list
 * 无必填参数
 */
async function fetchCityList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/billboard/fetch_city_list', params);
}

/**
 * 获取垂类内容标签/Fetch vertical content tags
 * GET /api/v1/douyin/billboard/fetch_content_tag
 * 无必填参数
 */
async function fetchContentTag(extraParams = {}) {
  const params = { ...extraParams };
  return request('/billboard/fetch_content_tag', params);
}

/**
 * 获取热点榜分类/Fetch hot list category
 * GET /api/v1/douyin/billboard/fetch_hot_category_list
 * @param {string} billboard_type - 必填参数
 */
async function fetchHotCategoryList(billboard_type, extraParams = {}) {
  const params = { billboard_type, ...extraParams };
  return request('/billboard/fetch_hot_category_list', params);
}

/**
 * 获取上升热点榜/Fetch rising hot list
 * GET /api/v1/douyin/billboard/fetch_hot_rise_list
 * @param {string, string, string} page, page_size, order - 必填参数
 */
async function fetchHotRiseList(page, page_size, order, extraParams = {}) {
  const params = { page, page_size, order, ...extraParams };
  return request('/billboard/fetch_hot_rise_list', params);
}

/**
 * 获取同城热点榜/Fetch city hot list
 * GET /api/v1/douyin/billboard/fetch_hot_city_list
 * @param {string, string, string} page, page_size, order - 必填参数
 */
async function fetchHotCityList(page, page_size, order, extraParams = {}) {
  const params = { page, page_size, order, ...extraParams };
  return request('/billboard/fetch_hot_city_list', params);
}

/**
 * 获取挑战热榜/Fetch hot challenge list
 * GET /api/v1/douyin/billboard/fetch_hot_challenge_list
 * @param {string, string} page, page_size - 必填参数
 */
async function fetchHotChallengeList(page, page_size, extraParams = {}) {
  const params = { page, page_size, ...extraParams };
  return request('/billboard/fetch_hot_challenge_list', params);
}

/**
 * 获取热点总榜/Fetch total hot list
 * GET /api/v1/douyin/billboard/fetch_hot_total_list
 * @param {string, string, string} page, page_size, type - 必填参数
 */
async function fetchHotTotalList(page, page_size, type, extraParams = {}) {
  const params = { page, page_size, type, ...extraParams };
  return request('/billboard/fetch_hot_total_list', params);
}

/**
 * 获取活动日历/Fetch activity calendar
 * POST /api/v1/douyin/billboard/fetch_hot_calendar_list
 * 无必填参数
 */
async function fetchHotCalendarList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/billboard/fetch_hot_calendar_list', params, 'POST');
}

/**
 * 获取活动日历详情/Fetch activity calendar detail
 * GET /api/v1/douyin/billboard/fetch_hot_calendar_detail
 * @param {string} calendar_id - 必填参数
 */
async function fetchHotCalendarDetail(calendar_id, extraParams = {}) {
  const params = { calendar_id, ...extraParams };
  return request('/billboard/fetch_hot_calendar_detail', params);
}

/**
 * 获取作品点赞观众画像-仅限热门榜/Fetch work like audienc
 * GET /api/v1/douyin/billboard/fetch_hot_user_portrait_list
 * @param {string} aweme_id - 必填参数
 */
async function fetchHotUserPortraitList(aweme_id, extraParams = {}) {
  const params = { aweme_id, ...extraParams };
  return request('/billboard/fetch_hot_user_portrait_list', params);
}

/**
 * 获取作品评论分析-词云权重/Fetch work comment analysi
 * GET /api/v1/douyin/billboard/fetch_hot_comment_word_list
 * @param {string} aweme_id - 必填参数
 */
async function fetchHotCommentWordList(aweme_id, extraParams = {}) {
  const params = { aweme_id, ...extraParams };
  return request('/billboard/fetch_hot_comment_word_list', params);
}

/**
 * 获取作品数据趋势/Fetch post data trend
 * GET /api/v1/douyin/billboard/fetch_hot_item_trends_list
 * 无必填参数
 */
async function fetchHotItemTrendsList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/billboard/fetch_hot_item_trends_list', params);
}

/**
 * 获取热门账号/Fetch hot account list
 * POST /api/v1/douyin/billboard/fetch_hot_account_list
 * 无必填参数
 */
async function fetchHotAccountList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/billboard/fetch_hot_account_list', params, 'POST');
}

/**
 * 获取账号粉丝数据趋势/Fetch account fan data trend
 * GET /api/v1/douyin/billboard/fetch_hot_account_trends_list
 * @param {string} sec_uid - 必填参数
 */
async function fetchHotAccountTrendsList(sec_uid, extraParams = {}) {
  const params = { sec_uid, ...extraParams };
  return request('/billboard/fetch_hot_account_trends_list', params);
}

/**
 * 获取账号作品分析-上周/Fetch account work analysis
 * GET /api/v1/douyin/billboard/fetch_hot_account_item_analysis_list
 * @param {string} sec_uid - 必填参数
 */
async function fetchHotAccountItemAnalysisList(sec_uid, extraParams = {}) {
  const params = { sec_uid, ...extraParams };
  return request('/billboard/fetch_hot_account_item_analysis_list', params);
}

/**
 * 获取粉丝画像/Fetch fan portrait
 * GET /api/v1/douyin/billboard/fetch_hot_account_fans_portrait_list
 * @param {string} sec_uid - 必填参数
 */
async function fetchHotAccountFansPortraitList(sec_uid, extraParams = {}) {
  const params = { sec_uid, ...extraParams };
  return request('/billboard/fetch_hot_account_fans_portrait_list', params);
}

/**
 * 获取粉丝兴趣作者 20个用户/Fetch fan interest author
 * GET /api/v1/douyin/billboard/fetch_hot_account_fans_interest_account_list
 * @param {string} sec_uid - 必填参数
 */
async function fetchHotAccountFansInterestAccountList(sec_uid, extraParams = {}) {
  const params = { sec_uid, ...extraParams };
  return request('/billboard/fetch_hot_account_fans_interest_account_list', params);
}

/**
 * 获取粉丝近3天感兴趣的话题 10个话题/Fetch fan interest t
 * GET /api/v1/douyin/billboard/fetch_hot_account_fans_interest_topic_list
 * @param {string} sec_uid - 必填参数
 */
async function fetchHotAccountFansInterestTopicList(sec_uid, extraParams = {}) {
  const params = { sec_uid, ...extraParams };
  return request('/billboard/fetch_hot_account_fans_interest_topic_list', params);
}

/**
 * 获取视频热榜/Fetch video hot list
 * POST /api/v1/douyin/billboard/fetch_hot_total_video_list
 * 无必填参数
 */
async function fetchHotTotalVideoList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/billboard/fetch_hot_total_video_list', params, 'POST');
}

/**
 * 获取低粉爆款榜/Fetch low fan explosion list
 * POST /api/v1/douyin/billboard/fetch_hot_total_low_fan_list
 * 无必填参数
 */
async function fetchHotTotalLowFanList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/billboard/fetch_hot_total_low_fan_list', params, 'POST');
}

/**
 * 获取高完播率榜/Fetch high completion rate list
 * POST /api/v1/douyin/billboard/fetch_hot_total_high_play_list
 * 无必填参数
 */
async function fetchHotTotalHighPlayList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/billboard/fetch_hot_total_high_play_list', params, 'POST');
}

/**
 * 获取高点赞率榜/Fetch high like rate list
 * POST /api/v1/douyin/billboard/fetch_hot_total_high_like_list
 * 无必填参数
 */
async function fetchHotTotalHighLikeList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/billboard/fetch_hot_total_high_like_list', params, 'POST');
}

/**
 * 获取高涨粉率榜/Fetch high fan rate list
 * POST /api/v1/douyin/billboard/fetch_hot_total_high_fan_list
 * 无必填参数
 */
async function fetchHotTotalHighFanList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/billboard/fetch_hot_total_high_fan_list', params, 'POST');
}

/**
 * 获取话题热榜/Fetch topic hot list
 * POST /api/v1/douyin/billboard/fetch_hot_total_topic_list
 * 无必填参数
 */
async function fetchHotTotalTopicList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/billboard/fetch_hot_total_topic_list', params, 'POST');
}

/**
 * 获取热度飙升的话题榜/Fetch topic list with rising
 * POST /api/v1/douyin/billboard/fetch_hot_total_high_topic_list
 * 无必填参数
 */
async function fetchHotTotalHighTopicList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/billboard/fetch_hot_total_high_topic_list', params, 'POST');
}

/**
 * 获取全部热门内容词/Fetch all hot content words
 * POST /api/v1/douyin/billboard/fetch_hot_total_hot_word_list
 * 无必填参数
 */
async function fetchHotTotalHotWordList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/billboard/fetch_hot_total_hot_word_list', params, 'POST');
}

/**
 * 获取内容词详情/Fetch content word details
 * GET /api/v1/douyin/billboard/fetch_hot_total_hot_word_detail_list
 * @param {string, string, string} keyword, word_id, query_day - 必填参数
 */
async function fetchHotTotalHotWordDetailList(keyword, word_id, query_day, extraParams = {}) {
  const params = { keyword, word_id, query_day, ...extraParams };
  return request('/billboard/fetch_hot_total_hot_word_detail_list', params);
}

/**
 * 获取kol转化能力分析V1/Get kol Conversion Ability
 * GET /api/v1/douyin/xingtu/kol_conversion_ability_analysis_v1
 * @param {string, string} kolId, _range - 必填参数
 */
async function kolConversionAbilityAnalysisV1(kolId, _range, extraParams = {}) {
  const params = { kolId, _range, ...extraParams };
  return request('/xingtu/kol_conversion_ability_analysis_v1', params);
}

/**
 * 获取kol星图指数V1/Get kol Xingtu Index V1
 * GET /api/v1/douyin/xingtu/kol_xingtu_index_v1
 * @param {string} kolId - 必填参数
 */
async function kolXingtuIndexV1(kolId, extraParams = {}) {
  const params = { kolId, ...extraParams };
  return request('/xingtu/kol_xingtu_index_v1', params);
}

/**
 * 获取kol性价比能力分析V1/Get kol Cp Info V1
 * GET /api/v1/douyin/xingtu/kol_cp_info_v1
 * @param {string} kolId - 必填参数
 */
async function kolCpInfoV1(kolId, extraParams = {}) {
  const params = { kolId, ...extraParams };
  return request('/xingtu/kol_cp_info_v1', params);
}

/**
 * 获取kol热词分析评论V1/Get Author Hot Comment Tok
 * GET /api/v1/douyin/xingtu/author_hot_comment_tokens_v1
 * @param {string} kolId - 必填参数
 */
async function authorHotCommentTokensV1(kolId, extraParams = {}) {
  const params = { kolId, ...extraParams };
  return request('/xingtu/author_hot_comment_tokens_v1', params);
}

/**
 * 获取kol热词分析内容V1/Get Author Content Hot Com
 * GET /api/v1/douyin/xingtu/author_content_hot_comment_keywords_v1
 * @param {string} kolId - 必填参数
 */
async function authorContentHotCommentKeywordsV1(kolId, extraParams = {}) {
  const params = { kolId, ...extraParams };
  return request('/xingtu/author_content_hot_comment_keywords_v1', params);
}

/**
 * 获取星图热榜分类/Get Ranking List Catalog
 * GET /api/v1/douyin/xingtu_v2/get_ranking_list_catalog
 * 无必填参数
 */
async function getRankingListCatalog(extraParams = {}) {
  const params = { ...extraParams };
  return request('/xingtu_v2/get_ranking_list_catalog', params);
}

/**
 * 获取星图达人商业榜数据/Get Ranking List Data
 * GET /api/v1/douyin/xingtu_v2/get_ranking_list_data
 * 无必填参数
 */
async function getRankingListData(extraParams = {}) {
  const params = { ...extraParams };
  return request('/xingtu_v2/get_ranking_list_data', params);
}

/**
 * 获取短剧演员热榜分类/Get Playlet Actor Rank Catalo
 * POST /api/v1/douyin/xingtu_v2/get_playlet_actor_rank_catalog
 * 无必填参数
 */
async function getPlayletActorRankCatalog(extraParams = {}) {
  const params = { ...extraParams };
  return request('/xingtu_v2/get_playlet_actor_rank_catalog', params, 'POST');
}

/**
 * 获取短剧演员热榜/Get Playlet Actor Rank List
 * GET /api/v1/douyin/xingtu_v2/get_playlet_actor_rank_list
 * 无必填参数
 */
async function getPlayletActorRankList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/xingtu_v2/get_playlet_actor_rank_list', params);
}

/**
 * 获取内容趋势指南/Get Content Trend Guide
 * GET /api/v1/douyin/xingtu_v2/get_content_trend_guide
 * 无必填参数
 */
async function getContentTrendGuide(extraParams = {}) {
  const params = { ...extraParams };
  return request('/xingtu_v2/get_content_trend_guide', params);
}

// ==================== 互 ====================

/**
 * 获取用户喜欢作品数据/Get user like video data
 * POST /api/v1/douyin/web/fetch_user_like_videos
 * 无必填参数
 */
async function fetchUserLikeVideos(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_user_like_videos', params, 'POST');
}

/**
 * 获取用户关注列表/Get user following list
 * GET /api/v1/douyin/web/fetch_user_following_list
 * 无必填参数
 */
async function fetchUserFollowingList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_user_following_list', params);
}

/**
 * 获取单个视频评论数据/Get single video comments dat
 * GET /api/v1/douyin/web/fetch_video_comments
 * @param {string} aweme_id - 必填参数
 */
async function fetchVideoComments(aweme_id, extraParams = {}) {
  const params = { aweme_id, ...extraParams };
  return request('/web/fetch_video_comments', params);
}

/**
 * 获取指定视频的评论回复数据/Get comment replies data o
 * GET /api/v1/douyin/web/fetch_video_comment_replies
 * @param {string, string} item_id, comment_id - 必填参数
 */
async function fetchVideoCommentReplies(item_id, comment_id, extraParams = {}) {
  const params = { item_id, comment_id, ...extraParams };
  return request('/web/fetch_video_comment_replies', params);
}

/**
 * 获取用户关注列表 (弃用，使用 /api/v1/douyin/web/fetch
 * GET /api/v1/douyin/app/v3/fetch_user_following_list
 * 无必填参数
 */
async function fetchUserFollowingList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/v3/fetch_user_following_list', params);
}

/**
 * 获取用户喜欢作品数据/Get user like video data
 * GET /api/v1/douyin/app/v3/fetch_user_like_videos
 * @param {string} sec_user_id - 必填参数
 */
async function fetchUserLikeVideos(sec_user_id, extraParams = {}) {
  const params = { sec_user_id, ...extraParams };
  return request('/app/v3/fetch_user_like_videos', params);
}

/**
 * 获取单个视频评论数据/Get single video comments dat
 * GET /api/v1/douyin/app/v3/fetch_video_comments
 * @param {string} aweme_id - 必填参数
 */
async function fetchVideoComments(aweme_id, extraParams = {}) {
  const params = { aweme_id, ...extraParams };
  return request('/app/v3/fetch_video_comments', params);
}

/**
 * 获取指定视频的评论回复数据/Get comment replies data o
 * GET /api/v1/douyin/app/v3/fetch_video_comment_replies
 * @param {string, string} item_id, comment_id - 必填参数
 */
async function fetchVideoCommentReplies(item_id, comment_id, extraParams = {}) {
  const params = { item_id, comment_id, ...extraParams };
  return request('/app/v3/fetch_video_comment_replies', params);
}

// ==================== 搜 ====================

/**
 * [已弃用/Deprecated] 获取指定关键词的综合搜索结果/Get comp
 * GET /api/v1/douyin/web/fetch_general_search_result
 * @param {string} keyword - 必填参数
 */
async function fetchGeneralSearchResult(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web/fetch_general_search_result', params);
}

/**
 * [已弃用/Deprecated] 获取指定关键词的视频搜索结果/Get vide
 * GET /api/v1/douyin/web/fetch_video_search_result
 * @param {string} keyword - 必填参数
 */
async function fetchVideoSearchResult(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web/fetch_video_search_result', params);
}

/**
 * 获取指定关键词的视频搜索结果 V2 （废弃，替代接口请参考下方文档）/Get v
 * GET /api/v1/douyin/web/fetch_video_search_result_v2
 * @param {string} keyword - 必填参数
 */
async function fetchVideoSearchResultV2(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web/fetch_video_search_result_v2', params);
}

/**
 * 获取指定关键词的用户搜索结果(废弃，替代接口请参考下方文档)/Get user
 * GET /api/v1/douyin/web/fetch_user_search_result
 * @param {string} keyword - 必填参数
 */
async function fetchUserSearchResult(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web/fetch_user_search_result', params);
}

/**
 * 获取指定关键词的用户搜索结果 V2 (已弃用，替代接口请参考下方文档)/Get
 * GET /api/v1/douyin/web/fetch_user_search_result_v2
 * @param {string} keyword - 必填参数
 */
async function fetchUserSearchResultV2(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web/fetch_user_search_result_v2', params);
}

/**
 * 获取指定关键词的用户搜索结果 V3 (已弃用，替代接口请参考下方文档)/Get
 * GET /api/v1/douyin/web/fetch_user_search_result_v3
 * @param {string} keyword - 必填参数
 */
async function fetchUserSearchResultV3(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web/fetch_user_search_result_v3', params);
}

/**
 * [已弃用/Deprecated] 获取指定关键词的直播搜索结果/Get live
 * GET /api/v1/douyin/web/fetch_live_search_result
 * @param {string} keyword - 必填参数
 */
async function fetchLiveSearchResult(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web/fetch_live_search_result', params);
}

/**
 * [已弃用/Deprecated] 搜索话题/Search Challenge
 * POST /api/v1/douyin/web/fetch_search_challenge
 * 无必填参数
 */
async function fetchSearchChallenge(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_search_challenge', params, 'POST');
}

/**
 * 获取抖音热榜数据/Get Douyin hot search results
 * GET /api/v1/douyin/web/fetch_hot_search_result
 * 无必填参数
 */
async function fetchHotSearchResult(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_hot_search_result', params);
}

/**
 * 查询抖音用户基本信息/Query Douyin user basic infor
 * POST /api/v1/douyin/web/fetch_query_user
 * 无必填参数
 */
async function fetchQueryUser(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_query_user', params, 'POST');
}

/**
 * 获取指定关键词的综合搜索结果（弃用，替代接口见下方文档说明）/Get compr
 * GET /api/v1/douyin/app/v3/fetch_general_search_result
 * @param {string} keyword - 必填参数
 */
async function fetchGeneralSearchResult(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app/v3/fetch_general_search_result', params);
}

/**
 * 获取指定关键词的视频搜索结果（弃用，替代接口见下方文档说明）/Get video
 * GET /api/v1/douyin/app/v3/fetch_video_search_result
 * @param {string} keyword - 必填参数
 */
async function fetchVideoSearchResult(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app/v3/fetch_video_search_result', params);
}

/**
 * 获取指定关键词的视频搜索结果 V2 （弃用，替代接口见下方文档说明）/Get v
 * GET /api/v1/douyin/app/v3/fetch_video_search_result_v2
 * @param {string} keyword - 必填参数
 */
async function fetchVideoSearchResultV2(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app/v3/fetch_video_search_result_v2', params);
}

/**
 * 获取指定关键词的用户搜索结果（弃用，替代接口见下方文档说明）/Get user
 * GET /api/v1/douyin/app/v3/fetch_user_search_result
 * @param {string} keyword - 必填参数
 */
async function fetchUserSearchResult(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app/v3/fetch_user_search_result', params);
}

/**
 * 获取指定关键词的直播搜索结果（弃用，替代接口见下方文档说明）/Get live
 * GET /api/v1/douyin/app/v3/fetch_live_search_result
 * @param {string} keyword - 必填参数
 */
async function fetchLiveSearchResult(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app/v3/fetch_live_search_result', params);
}

/**
 * 获取指定关键词的音乐搜索结果（弃用，替代接口见下方文档说明）/Get music
 * GET /api/v1/douyin/app/v3/fetch_music_search_result
 * @param {string} keyword - 必填参数
 */
async function fetchMusicSearchResult(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app/v3/fetch_music_search_result', params);
}

/**
 * 获取指定关键词的话题搜索结果（弃用，替代接口见下方文档说明）/Get hasht
 * GET /api/v1/douyin/app/v3/fetch_hashtag_search_result
 * @param {string} keyword - 必填参数
 */
async function fetchHashtagSearchResult(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app/v3/fetch_hashtag_search_result', params);
}

/**
 * 获取抖音热搜榜数据/Get Douyin hot search list dat
 * GET /api/v1/douyin/app/v3/fetch_hot_search_list
 * 无必填参数
 */
async function fetchHotSearchList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/v3/fetch_hot_search_list', params);
}

/**
 * 获取抖音直播热搜榜数据/Get Douyin live hot search l
 * GET /api/v1/douyin/app/v3/fetch_live_hot_search_list
 * 无必填参数
 */
async function fetchLiveHotSearchList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/v3/fetch_live_hot_search_list', params);
}

/**
 * 获取抖音音乐榜数据/Get Douyin music hot search li
 * GET /api/v1/douyin/app/v3/fetch_music_hot_search_list
 * 无必填参数
 */
async function fetchMusicHotSearchList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/v3/fetch_music_hot_search_list', params);
}

/**
 * 获取抖音品牌热榜分类数据/Get Douyin brand hot search
 * GET /api/v1/douyin/app/v3/fetch_brand_hot_search_list
 * 无必填参数
 */
async function fetchBrandHotSearchList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/app/v3/fetch_brand_hot_search_list', params);
}

/**
 * 获取抖音品牌热榜具体分类数据/Get Douyin brand hot sear
 * GET /api/v1/douyin/app/v3/fetch_brand_hot_search_list_detail
 * @param {string} category_id - 必填参数
 */
async function fetchBrandHotSearchListDetail(category_id, extraParams = {}) {
  const params = { category_id, ...extraParams };
  return request('/app/v3/fetch_brand_hot_search_list_detail', params);
}

/**
 * 生成抖音分享链接，唤起抖音APP，跳转指定关键词搜索结果/Generate Do
 * GET /api/v1/douyin/app/v3/open_douyin_app_to_keyword_search
 * @param {string} keyword - 必填参数
 */
async function openDouyinAppToKeywordSearch(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/app/v3/open_douyin_app_to_keyword_search', params);
}

/**
 * 搜索用户/Search users
 * GET /api/v1/douyin/creator/fetch_user_search
 * @param {string} user_name - 必填参数
 */
async function fetchUserSearch(user_name, extraParams = {}) {
  const params = { user_name, ...extraParams };
  return request('/creator/fetch_user_search', params);
}

/**
 * 获取作品搜索关键词统计/Fetch item search keywords s
 * POST /api/v1/douyin/creator_v2/fetch_item_search_keyword
 * 无必填参数
 */
async function fetchItemSearchKeyword(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator_v2/fetch_item_search_keyword', params, 'POST');
}

/**
 * 达人搜索建议/Daren search suggest
 * POST /api/v1/douyin/index/fetch_daren_sug_great_user_list
 * @param {string} keyword - 必填参数
 */
async function fetchDarenSugGreatUserList(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/index/fetch_daren_sug_great_user_list', params, 'POST');
}

/**
 * 获取视频搜索筛选选项/Get video search filter optio
 * GET /api/v1/douyin/index/fetch_item_filter_options
 * 无必填参数
 */
async function fetchItemFilterOptions(extraParams = {}) {
  const params = { ...extraParams };
  return request('/index/fetch_item_filter_options', params);
}

/**
 * 视频搜索建议/Video search suggest
 * POST /api/v1/douyin/index/fetch_item_sug
 * @param {string} query - 必填参数
 */
async function fetchItemSug(query, extraParams = {}) {
  const params = { query, ...extraParams };
  return request('/index/fetch_item_sug', params, 'POST');
}

/**
 * 视频搜索结果/Video search results
 * POST /api/v1/douyin/index/fetch_item_query
 * @param {string} query - 必填参数
 */
async function fetchItemQuery(query, extraParams = {}) {
  const params = { query, ...extraParams };
  return request('/index/fetch_item_query', params, 'POST');
}

/**
 * 品牌搜索建议/Brand search suggest
 * POST /api/v1/douyin/index/fetch_brand_suggest
 * @param {string} keyword - 必填参数
 */
async function fetchBrandSuggest(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/index/fetch_brand_suggest', params, 'POST');
}

/**
 * 话题搜索建议/Topic search suggest
 * POST /api/v1/douyin/index/fetch_topic_suggest
 * @param {string} keyword - 必填参数
 */
async function fetchTopicSuggest(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/index/fetch_topic_suggest', params, 'POST');
}

/**
 * 话题搜索结果/Topic search results
 * POST /api/v1/douyin/index/fetch_topic_query
 * @param {string, string, string} keyword, start_date, end_date - 必填参数
 */
async function fetchTopicQuery(keyword, start_date, end_date, extraParams = {}) {
  const params = { keyword, start_date, end_date, ...extraParams };
  return request('/index/fetch_topic_query', params, 'POST');
}

/**
 * 搜索趋势报告/Search trend reports
 * POST /api/v1/douyin/index/fetch_report_search
 * 无必填参数
 */
async function fetchReportSearch(extraParams = {}) {
  const params = { ...extraParams };
  return request('/index/fetch_report_search', params, 'POST');
}

/**
 * 获取综合搜索 V1/Fetch general search V1
 * POST /api/v1/douyin/search/fetch_general_search_v1
 * 无必填参数
 */
async function fetchGeneralSearchV1(extraParams = {}) {
  const params = { ...extraParams };
  return request('/search/fetch_general_search_v1', params, 'POST');
}

/**
 * 获取综合搜索 V2/Fetch general search V2
 * POST /api/v1/douyin/search/fetch_general_search_v2
 * 无必填参数
 */
async function fetchGeneralSearchV2(extraParams = {}) {
  const params = { ...extraParams };
  return request('/search/fetch_general_search_v2', params, 'POST');
}

/**
 * 获取搜索关键词推荐/Fetch search keyword suggestio
 * POST /api/v1/douyin/search/fetch_search_suggest
 * 无必填参数
 */
async function fetchSearchSuggest(extraParams = {}) {
  const params = { ...extraParams };
  return request('/search/fetch_search_suggest', params, 'POST');
}

/**
 * 获取视频搜索 V1/Fetch video search V1
 * POST /api/v1/douyin/search/fetch_video_search_v1
 * 无必填参数
 */
async function fetchVideoSearchV1(extraParams = {}) {
  const params = { ...extraParams };
  return request('/search/fetch_video_search_v1', params, 'POST');
}

/**
 * 获取视频搜索 V2/Fetch video search V2
 * POST /api/v1/douyin/search/fetch_video_search_v2
 * 无必填参数
 */
async function fetchVideoSearchV2(extraParams = {}) {
  const params = { ...extraParams };
  return request('/search/fetch_video_search_v2', params, 'POST');
}

/**
 * 获取多重搜索/Fetch multi-type search
 * POST /api/v1/douyin/search/fetch_multi_search
 * 无必填参数
 */
async function fetchMultiSearch(extraParams = {}) {
  const params = { ...extraParams };
  return request('/search/fetch_multi_search', params, 'POST');
}

/**
 * 获取用户搜索/Fetch user search
 * POST /api/v1/douyin/search/fetch_user_search
 * 无必填参数
 */
async function fetchUserSearch(extraParams = {}) {
  const params = { ...extraParams };
  return request('/search/fetch_user_search', params, 'POST');
}

/**
 * 获取用户搜索 V2/Fetch user search V2
 * POST /api/v1/douyin/search/fetch_user_search_v2
 * 无必填参数
 */
async function fetchUserSearchV2(extraParams = {}) {
  const params = { ...extraParams };
  return request('/search/fetch_user_search_v2', params, 'POST');
}

/**
 * 获取图片搜索/Fetch image search
 * POST /api/v1/douyin/search/fetch_image_search
 * 无必填参数
 */
async function fetchImageSearch(extraParams = {}) {
  const params = { ...extraParams };
  return request('/search/fetch_image_search', params, 'POST');
}

/**
 * 获取图文搜索 V3/Fetch image-text search V3
 * POST /api/v1/douyin/search/fetch_image_search_v3
 * 无必填参数
 */
async function fetchImageSearchV3(extraParams = {}) {
  const params = { ...extraParams };
  return request('/search/fetch_image_search_v3', params, 'POST');
}

/**
 * 获取直播搜索 V1/Fetch live search V1
 * POST /api/v1/douyin/search/fetch_live_search_v1
 * 无必填参数
 */
async function fetchLiveSearchV1(extraParams = {}) {
  const params = { ...extraParams };
  return request('/search/fetch_live_search_v1', params, 'POST');
}

/**
 * 获取话题搜索 V1/Fetch hashtag search V1
 * POST /api/v1/douyin/search/fetch_challenge_search_v1
 * 无必填参数
 */
async function fetchChallengeSearchV1(extraParams = {}) {
  const params = { ...extraParams };
  return request('/search/fetch_challenge_search_v1', params, 'POST');
}

/**
 * 获取话题搜索 V2/Fetch hashtag search V2
 * POST /api/v1/douyin/search/fetch_challenge_search_v2
 * 无必填参数
 */
async function fetchChallengeSearchV2(extraParams = {}) {
  const params = { ...extraParams };
  return request('/search/fetch_challenge_search_v2', params, 'POST');
}

/**
 * 获取话题推荐搜索/Fetch hashtag suggestions
 * POST /api/v1/douyin/search/fetch_challenge_suggest
 * 无必填参数
 */
async function fetchChallengeSuggest(extraParams = {}) {
  const params = { ...extraParams };
  return request('/search/fetch_challenge_suggest', params, 'POST');
}

/**
 * 获取经验搜索/Fetch experience search
 * POST /api/v1/douyin/search/fetch_experience_search
 * 无必填参数
 */
async function fetchExperienceSearch(extraParams = {}) {
  const params = { ...extraParams };
  return request('/search/fetch_experience_search', params, 'POST');
}

/**
 * 获取音乐搜索/Fetch music search
 * POST /api/v1/douyin/search/fetch_music_search
 * 无必填参数
 */
async function fetchMusicSearch(extraParams = {}) {
  const params = { ...extraParams };
  return request('/search/fetch_music_search', params, 'POST');
}

/**
 * 获取讨论搜索/Fetch discussion search
 * POST /api/v1/douyin/search/fetch_discuss_search
 * 无必填参数
 */
async function fetchDiscussSearch(extraParams = {}) {
  const params = { ...extraParams };
  return request('/search/fetch_discuss_search', params, 'POST');
}

/**
 * 获取学校搜索/Fetch school search
 * POST /api/v1/douyin/search/fetch_school_search
 * 无必填参数
 */
async function fetchSchoolSearch(extraParams = {}) {
  const params = { ...extraParams };
  return request('/search/fetch_school_search', params, 'POST');
}

/**
 * 获取图像识别搜索/Fetch vision search (image-base
 * POST /api/v1/douyin/search/fetch_vision_search
 * 无必填参数
 */
async function fetchVisionSearch(extraParams = {}) {
  const params = { ...extraParams };
  return request('/search/fetch_vision_search', params, 'POST');
}

/**
 * 搜索用户名或抖音号/Fetch account search list
 * GET /api/v1/douyin/billboard/fetch_hot_account_search_list
 * @param {string, string} keyword, cursor - 必填参数
 */
async function fetchHotAccountSearchList(keyword, cursor, extraParams = {}) {
  const params = { keyword, cursor, ...extraParams };
  return request('/billboard/fetch_hot_account_search_list', params);
}

/**
 * 获取粉丝近3天搜索词 10个搜索词/Fetch fan interest sea
 * GET /api/v1/douyin/billboard/fetch_hot_account_fans_interest_search_list
 * @param {string} sec_uid - 必填参数
 */
async function fetchHotAccountFansInterestSearchList(sec_uid, extraParams = {}) {
  const params = { sec_uid, ...extraParams };
  return request('/billboard/fetch_hot_account_fans_interest_search_list', params);
}

/**
 * 获取搜索热榜/Fetch search hot list
 * POST /api/v1/douyin/billboard/fetch_hot_total_search_list
 * 无必填参数
 */
async function fetchHotTotalSearchList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/billboard/fetch_hot_total_search_list', params, 'POST');
}

/**
 * 获取热度飙升的搜索榜/Fetch search list with rising
 * POST /api/v1/douyin/billboard/fetch_hot_total_high_search_list
 * 无必填参数
 */
async function fetchHotTotalHighSearchList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/billboard/fetch_hot_total_high_search_list', params, 'POST');
}

/**
 * 关键词搜索kol V1/Search Kol V1
 * GET /api/v1/douyin/xingtu/search_kol_v1
 * @param {string, string, string} keyword, platformSource, page - 必填参数
 */
async function searchKolV1(keyword, platformSource, page, extraParams = {}) {
  const params = { keyword, platformSource, page, ...extraParams };
  return request('/xingtu/search_kol_v1', params);
}

/**
 * 高级搜索kol V2/Search Kol Advanced V2
 * GET /api/v1/douyin/xingtu/search_kol_v2
 * @param {string} keyword - 必填参数
 */
async function searchKolV2(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/xingtu/search_kol_v2', params);
}

/**
 * 搜索MCN机构列表/Get Demander MCN List
 * GET /api/v1/douyin/xingtu_v2/get_demander_mcn_list
 * 无必填参数
 */
async function getDemanderMcnList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/xingtu_v2/get_demander_mcn_list', params);
}

// ==================== 工 ====================

/**
 * 生成抖音短链接/Generate Douyin short link
 * GET /api/v1/douyin/app/v3/generate_douyin_short_url
 * @param {string} url - 必填参数
 */
async function generateDouyinShortUrl(url, extraParams = {}) {
  const params = { url, ...extraParams };
  return request('/app/v3/generate_douyin_short_url', params);
}

/**
 * 生成抖音视频分享二维码/Generate Douyin video share
 * GET /api/v1/douyin/app/v3/generate_douyin_video_share_qrcode
 * @param {string} object_id - 必填参数
 */
async function generateDouyinVideoShareQrcode(object_id, extraParams = {}) {
  const params = { object_id, ...extraParams };
  return request('/app/v3/generate_douyin_video_share_qrcode', params);
}

/**
 * 生成抖音分享链接，唤起抖音APP，跳转指定作品详情页/Generate Douy
 * GET /api/v1/douyin/app/v3/open_douyin_app_to_video_detail
 * @param {string} aweme_id - 必填参数
 */
async function openDouyinAppToVideoDetail(aweme_id, extraParams = {}) {
  const params = { aweme_id, ...extraParams };
  return request('/app/v3/open_douyin_app_to_video_detail', params);
}

/**
 * 生成抖音分享链接，唤起抖音APP，跳转指定用户主页/Generate Douyi
 * GET /api/v1/douyin/app/v3/open_douyin_app_to_user_profile
 * @param {string, string} uid, sec_uid - 必填参数
 */
async function openDouyinAppToUserProfile(uid, sec_uid, extraParams = {}) {
  const params = { uid, sec_uid, ...extraParams };
  return request('/app/v3/open_douyin_app_to_user_profile', params);
}

/**
 * 生成抖音分享链接，唤起抖音APP，给指定用户发送私信/Generate Douy
 * GET /api/v1/douyin/app/v3/open_douyin_app_to_send_private_message
 * @param {string, string} uid, sec_uid - 必填参数
 */
async function openDouyinAppToSendPrivateMessage(uid, sec_uid, extraParams = {}) {
  const params = { uid, sec_uid, ...extraParams };
  return request('/app/v3/open_douyin_app_to_send_private_message', params);
}

// ==================== 内 ====================

/**
 * 提取单个用户id/Extract single user id
 * GET /api/v1/douyin/web/get_sec_user_id
 * @param {string} url - 必填参数
 */
async function getSecUserId(url, extraParams = {}) {
  const params = { url, ...extraParams };
  return request('/web/get_sec_user_id', params);
}

/**
 * 提取列表用户id/Extract list user id
 * POST /api/v1/douyin/web/get_all_sec_user_id
 * 无必填参数
 */
async function getAllSecUserId(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/get_all_sec_user_id', params, 'POST');
}

/**
 * 提取单个作品id/Extract single video id
 * GET /api/v1/douyin/web/get_aweme_id
 * @param {string} url - 必填参数
 */
async function getAwemeId(url, extraParams = {}) {
  const params = { url, ...extraParams };
  return request('/web/get_aweme_id', params);
}

/**
 * 提取列表作品id/Extract list video id
 * POST /api/v1/douyin/web/get_all_aweme_id
 * 无必填参数
 */
async function getAllAwemeId(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/get_all_aweme_id', params, 'POST');
}

/**
 * 提取直播间号/Extract webcast id
 * GET /api/v1/douyin/web/get_webcast_id
 * @param {string} url - 必填参数
 */
async function getWebcastId(url, extraParams = {}) {
  const params = { url, ...extraParams };
  return request('/web/get_webcast_id', params);
}

/**
 * 提取列表直播间号/Extract list webcast id
 * POST /api/v1/douyin/web/get_all_webcast_id
 * 无必填参数
 */
async function getAllWebcastId(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/get_all_webcast_id', params, 'POST');
}

/**
 * 提取直播间弹幕/Extract live room danmaku
 * GET /api/v1/douyin/web/douyin_live_room
 * @param {string, string} live_room_url, danmaku_type - 必填参数
 */
async function douyinLiveRoom(live_room_url, danmaku_type, extraParams = {}) {
  const params = { live_room_url, danmaku_type, ...extraParams };
  return request('/web/douyin_live_room', params);
}

// ==================== 创 ====================

/**
 * 获取创作者活动列表/Get creator activity list
 * GET /api/v1/douyin/creator/fetch_creator_activity_list
 * @param {string, string} start_time, end_time - 必填参数
 */
async function fetchCreatorActivityList(start_time, end_time, extraParams = {}) {
  const params = { start_time, end_time, ...extraParams };
  return request('/creator/fetch_creator_activity_list', params);
}

/**
 * 获取创作者活动详情/Get creator activity detail
 * GET /api/v1/douyin/creator/fetch_creator_activity_detail
 * @param {string} activity_id - 必填参数
 */
async function fetchCreatorActivityDetail(activity_id, extraParams = {}) {
  const params = { activity_id, ...extraParams };
  return request('/creator/fetch_creator_activity_detail', params);
}

/**
 * 获取创作者中心配置/Get creator material center co
 * GET /api/v1/douyin/creator/fetch_creator_material_center_config
 * 无必填参数
 */
async function fetchCreatorMaterialCenterConfig(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator/fetch_creator_material_center_config', params);
}

/**
 * 获取创作者热门课程/Get creator hot course
 * GET /api/v1/douyin/creator/fetch_creator_hot_course
 * 无必填参数
 */
async function fetchCreatorHotCourse(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator/fetch_creator_hot_course', params);
}

/**
 * 获取创作者内容创作合集分类/Get creator content creati
 * GET /api/v1/douyin/creator/fetch_creator_content_category
 * 无必填参数
 */
async function fetchCreatorContentCategory(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator/fetch_creator_content_category', params);
}

/**
 * 获取创作者内容创作课程/Get creator content creation
 * GET /api/v1/douyin/creator/fetch_creator_content_course
 * @param {string} category_id - 必填参数
 */
async function fetchCreatorContentCourse(category_id, extraParams = {}) {
  const params = { category_id, ...extraParams };
  return request('/creator/fetch_creator_content_course', params);
}

/**
 * 获取作品弹幕列表/Get video danmaku list
 * GET /api/v1/douyin/creator/fetch_video_danmaku_list
 * @param {string} item_id - 必填参数
 */
async function fetchVideoDanmakuList(item_id, extraParams = {}) {
  const params = { item_id, ...extraParams };
  return request('/creator/fetch_video_danmaku_list', params);
}

/**
 * 获取商单任务列表/Get mission task list
 * GET /api/v1/douyin/creator/fetch_mission_task_list
 * 无必填参数
 */
async function fetchMissionTaskList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator/fetch_mission_task_list', params);
}

/**
 * 获取行业分类配置/Get industry category config
 * GET /api/v1/douyin/creator/fetch_industry_category_config
 * 无必填参数
 */
async function fetchIndustryCategoryConfig(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator/fetch_industry_category_config', params);
}

/**
 * 获取作品总览数据/Fetch item overview data
 * POST /api/v1/douyin/creator_v2/fetch_item_overview_data
 * 无必填参数
 */
async function fetchItemOverviewData(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator_v2/fetch_item_overview_data', params, 'POST');
}

/**
 * 获取作品垂类标签/Fetch item analysis involved ve
 * POST /api/v1/douyin/creator_v2/fetch_item_analysis_involved_vertical
 * 无必填参数
 */
async function fetchItemAnalysisInvolvedVertical(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator_v2/fetch_item_analysis_involved_vertical', params, 'POST');
}

/**
 * 获取投稿表现数据/Fetch item analysis item perfor
 * POST /api/v1/douyin/creator_v2/fetch_item_analysis_item_performance
 * 无必填参数
 */
async function fetchItemAnalysisItemPerformance(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator_v2/fetch_item_analysis_item_performance', params, 'POST');
}

/**
 * 获取投稿作品列表/Fetch item list
 * POST /api/v1/douyin/creator_v2/fetch_item_list
 * 无必填参数
 */
async function fetchItemList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator_v2/fetch_item_list', params, 'POST');
}

/**
 * 导出投稿作品列表/Download item list
 * POST /api/v1/douyin/creator_v2/fetch_item_list_download
 * 无必填参数
 */
async function fetchItemListDownload(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator_v2/fetch_item_list_download', params, 'POST');
}

/**
 * 获取直播场次历史记录/Fetch live room history list
 * POST /api/v1/douyin/creator_v2/fetch_live_room_history_list
 * 无必填参数
 */
async function fetchLiveRoomHistoryList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator_v2/fetch_live_room_history_list', params, 'POST');
}

/**
 * 获取创作者账号诊断/Fetch author diagnosis
 * POST /api/v1/douyin/creator_v2/fetch_author_diagnosis
 * 无必填参数
 */
async function fetchAuthorDiagnosis(extraParams = {}) {
  const params = { ...extraParams };
  return request('/creator_v2/fetch_author_diagnosis', params, 'POST');
}

/**
 * 获取加密图片解析/Get Sign Image
 * GET /api/v1/douyin/xingtu/get_sign_image
 * @param {string} uri - 必填参数
 */
async function getSignImage(uri, extraParams = {}) {
  const params = { uri, ...extraParams };
  return request('/xingtu/get_sign_image', params);
}

/**
 * 根据抖音用户ID获取游客星图kolid/Get XingTu kolid by
 * GET /api/v1/douyin/xingtu/get_xingtu_kolid_by_uid
 * @param {string} uid - 必填参数
 */
async function getXingtuKolidByUid(uid, extraParams = {}) {
  const params = { uid, ...extraParams };
  return request('/xingtu/get_xingtu_kolid_by_uid', params);
}

/**
 * 根据抖音sec_user_id获取游客星图kolid/Get XingTu ko
 * GET /api/v1/douyin/xingtu/get_xingtu_kolid_by_sec_user_id
 * @param {string} sec_user_id - 必填参数
 */
async function getXingtuKolidBySecUserId(sec_user_id, extraParams = {}) {
  const params = { sec_user_id, ...extraParams };
  return request('/xingtu/get_xingtu_kolid_by_sec_user_id', params);
}

/**
 * 根据抖音号获取游客星图kolid/Get XingTu kolid by Dou
 * GET /api/v1/douyin/xingtu/get_xingtu_kolid_by_unique_id
 * @param {string} unique_id - 必填参数
 */
async function getXingtuKolidByUniqueId(unique_id, extraParams = {}) {
  const params = { unique_id, ...extraParams };
  return request('/xingtu/get_xingtu_kolid_by_unique_id', params);
}

/**
 * 获取kol基本信息V1/Get kol Base Info V1
 * GET /api/v1/douyin/xingtu/kol_base_info_v1
 * @param {string, string} kolId, platformChannel - 必填参数
 */
async function kolBaseInfoV1(kolId, platformChannel, extraParams = {}) {
  const params = { kolId, platformChannel, ...extraParams };
  return request('/xingtu/kol_base_info_v1', params);
}

/**
 * 获取kol观众画像V1/Get kol Audience Portrait V1
 * GET /api/v1/douyin/xingtu/kol_audience_portrait_v1
 * @param {string} kolId - 必填参数
 */
async function kolAudiencePortraitV1(kolId, extraParams = {}) {
  const params = { kolId, ...extraParams };
  return request('/xingtu/kol_audience_portrait_v1', params);
}

/**
 * 获取kol粉丝画像V1/Get kol Fans Portrait V1
 * GET /api/v1/douyin/xingtu/kol_fans_portrait_v1
 * @param {string} kolId - 必填参数
 */
async function kolFansPortraitV1(kolId, extraParams = {}) {
  const params = { kolId, ...extraParams };
  return request('/xingtu/kol_fans_portrait_v1', params);
}

/**
 * 获取kol服务报价V1/Get kol Service Price V1
 * GET /api/v1/douyin/xingtu/kol_service_price_v1
 * @param {string, string} kolId, platformChannel - 必填参数
 */
async function kolServicePriceV1(kolId, platformChannel, extraParams = {}) {
  const params = { kolId, platformChannel, ...extraParams };
  return request('/xingtu/kol_service_price_v1', params);
}

/**
 * 获取kol数据概览V1/Get kol Data Overview V1
 * GET /api/v1/douyin/xingtu/kol_data_overview_v1
 * @param {string, string, string, string} kolId, _type, _range, flowType - 必填参数
 */
async function kolDataOverviewV1(kolId, _type, _range, flowType, extraParams = {}) {
  const params = { kolId, _type, _range, flowType, ...extraParams };
  return request('/xingtu/kol_data_overview_v1', params);
}

/**
 * 获取kol视频表现V1/Get kol Video Performance V1
 * GET /api/v1/douyin/xingtu/kol_video_performance_v1
 * @param {string, string} kolId, onlyAssign - 必填参数
 */
async function kolVideoPerformanceV1(kolId, onlyAssign, extraParams = {}) {
  const params = { kolId, onlyAssign, ...extraParams };
  return request('/xingtu/kol_video_performance_v1', params);
}

/**
 * 获取kol转化视频展示V1/Get kol Convert Video Disp
 * GET /api/v1/douyin/xingtu/kol_convert_video_display_v1
 * @param {string, string, string} kolId, detailType, page - 必填参数
 */
async function kolConvertVideoDisplayV1(kolId, detailType, page, extraParams = {}) {
  const params = { kolId, detailType, page, ...extraParams };
  return request('/xingtu/kol_convert_video_display_v1', params);
}

/**
 * 获取kol连接用户V1/Get kol Link Struct V1
 * GET /api/v1/douyin/xingtu/kol_link_struct_v1
 * @param {string} kolId - 必填参数
 */
async function kolLinkStructV1(kolId, extraParams = {}) {
  const params = { kolId, ...extraParams };
  return request('/xingtu/kol_link_struct_v1', params);
}

/**
 * 获取kol连接用户来源V1/Get kol Touch Distribution
 * GET /api/v1/douyin/xingtu/kol_touch_distribution_v1
 * @param {string} kolId - 必填参数
 */
async function kolTouchDistributionV1(kolId, extraParams = {}) {
  const params = { kolId, ...extraParams };
  return request('/xingtu/kol_touch_distribution_v1', params);
}

/**
 * 获取kol内容表现V1/Get kol Rec Videos V1
 * GET /api/v1/douyin/xingtu/kol_rec_videos_v1
 * @param {string} kolId - 必填参数
 */
async function kolRecVideosV1(kolId, extraParams = {}) {
  const params = { kolId, ...extraParams };
  return request('/xingtu/kol_rec_videos_v1', params);
}

/**
 * 获取kol粉丝趋势V1/Get kol Daily Fans V1
 * GET /api/v1/douyin/xingtu/kol_daily_fans_v1
 * @param {string, string, string} kolId, startDate, endDate - 必填参数
 */
async function kolDailyFansV1(kolId, startDate, endDate, extraParams = {}) {
  const params = { kolId, startDate, endDate, ...extraParams };
  return request('/xingtu/kol_daily_fans_v1', params);
}

/**
 * 获取达人广场筛选字段/Get Author Market Fields
 * GET /api/v1/douyin/xingtu_v2/get_author_market_fields
 * 无必填参数
 */
async function getAuthorMarketFields(extraParams = {}) {
  const params = { ...extraParams };
  return request('/xingtu_v2/get_author_market_fields', params);
}

/**
 * 获取创作者基本信息/Get Author Base Info
 * GET /api/v1/douyin/xingtu_v2/get_author_base_info
 * @param {string} o_author_id - 必填参数
 */
async function getAuthorBaseInfo(o_author_id, extraParams = {}) {
  const params = { o_author_id, ...extraParams };
  return request('/xingtu_v2/get_author_base_info', params);
}

/**
 * 获取创作者商业卡片信息/Get Author Business Card Inf
 * GET /api/v1/douyin/xingtu_v2/get_author_business_card_info
 * @param {string} o_author_id - 必填参数
 */
async function getAuthorBusinessCardInfo(o_author_id, extraParams = {}) {
  const params = { o_author_id, ...extraParams };
  return request('/xingtu_v2/get_author_business_card_info', params);
}

/**
 * 获取创作者位置信息/Get Author Local Info
 * GET /api/v1/douyin/xingtu_v2/get_author_local_info
 * @param {string} o_author_id - 必填参数
 */
async function getAuthorLocalInfo(o_author_id, extraParams = {}) {
  const params = { o_author_id, ...extraParams };
  return request('/xingtu_v2/get_author_local_info', params);
}

/**
 * 获取创作者视频列表/Get Author Show Items
 * GET /api/v1/douyin/xingtu_v2/get_author_show_items
 * @param {string} o_author_id - 必填参数
 */
async function getAuthorShowItems(o_author_id, extraParams = {}) {
  const params = { o_author_id, ...extraParams };
  return request('/xingtu_v2/get_author_show_items', params);
}

/**
 * 获取创作者评论热词/Get Author Hot Comment Tokens
 * GET /api/v1/douyin/xingtu_v2/get_author_hot_comment_tokens
 * @param {string} author_id - 必填参数
 */
async function getAuthorHotCommentTokens(author_id, extraParams = {}) {
  const params = { author_id, ...extraParams };
  return request('/xingtu_v2/get_author_hot_comment_tokens', params);
}

/**
 * 获取创作者内容热词/Get Author Content Hot Keyword
 * GET /api/v1/douyin/xingtu_v2/get_author_content_hot_keywords
 * @param {string} author_id - 必填参数
 */
async function getAuthorContentHotKeywords(author_id, extraParams = {}) {
  const params = { author_id, ...extraParams };
  return request('/xingtu_v2/get_author_content_hot_keywords', params);
}

/**
 * 获取相似创作者推荐/Get Recommend Similar Star Aut
 * POST /api/v1/douyin/xingtu_v2/get_recommend_for_star_authors
 * 无必填参数
 */
async function getRecommendForStarAuthors(extraParams = {}) {
  const params = { ...extraParams };
  return request('/xingtu_v2/get_recommend_for_star_authors', params, 'POST');
}

/**
 * 获取优秀行业分类列表/Get Excellent Case Category L
 * GET /api/v1/douyin/xingtu_v2/get_excellent_case_category_list
 * 无必填参数
 */
async function getExcellentCaseCategoryList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/xingtu_v2/get_excellent_case_category_list', params);
}

/**
 * 获取创作者传播价值/Get Author Spread Info
 * GET /api/v1/douyin/xingtu_v2/get_author_spread_info
 * @param {string} o_author_id - 必填参数
 */
async function getAuthorSpreadInfo(o_author_id, extraParams = {}) {
  const params = { o_author_id, ...extraParams };
  return request('/xingtu_v2/get_author_spread_info', params);
}

/**
 * 获取用户主页二维码/Get User Profile QRCode
 * GET /api/v1/douyin/xingtu_v2/get_user_profile_qrcode
 * 无必填参数
 */
async function getUserProfileQrcode(extraParams = {}) {
  const params = { ...extraParams };
  return request('/xingtu_v2/get_user_profile_qrcode', params);
}

/**
 * 获取星图IP日历行业列表/Get IP Activity Industry Li
 * GET /api/v1/douyin/xingtu_v2/get_ip_activity_industry_list
 * 无必填参数
 */
async function getIpActivityIndustryList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/xingtu_v2/get_ip_activity_industry_list', params);
}

/**
 * 获取星图IP日历活动列表/Get IP Activity List
 * POST /api/v1/douyin/xingtu_v2/get_ip_activity_list
 * 无必填参数
 */
async function getIpActivityList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/xingtu_v2/get_ip_activity_list', params, 'POST');
}

/**
 * 获取星图IP活动详情/Get IP Activity Detail
 * GET /api/v1/douyin/xingtu_v2/get_ip_activity_detail
 * @param {string} id - 必填参数
 */
async function getIpActivityDetail(id, extraParams = {}) {
  const params = { id, ...extraParams };
  return request('/xingtu_v2/get_ip_activity_detail', params);
}

/**
 * 获取营销活动案例/Get Resource List
 * GET /api/v1/douyin/xingtu_v2/get_resource_list
 * @param {string} resource_id - 必填参数
 */
async function getResourceList(resource_id, extraParams = {}) {
  const params = { resource_id, ...extraParams };
  return request('/xingtu_v2/get_resource_list', params);
}

module.exports = {
  request,
  fetchOneVideo,
  fetchOneVideoV2,
  fetchOneVideoByShareUrl,
  fetchVideoHighQualityPlayUrl,
  fetchMultiVideoHighQualityPlayUrl,
  fetchMultiVideo,
  fetchOneVideoDanmaku,
  fetchHomeFeed,
  fetchRelatedPosts,
  fetchUserPostVideos,
  fetchUserCollectionVideos,
  fetchUserCollects,
  fetchUserCollectsVideos,
  fetchUserMixVideos,
  fetchUserLiveVideos,
  fetchUserLiveVideosBySecUid,
  fetchUserLiveVideosByRoomId,
  fetchUserLiveVideosByRoomIdV2,
  fetchLiveRoomProductResult,
  fetchProductDetail,
  fetchProductSkuList,
  fetchProductCoupon,
  fetchProductReviewScore,
  fetchProductReviewList,
  fetchUserProfileByUid,
  fetchBatchUserProfileV1,
  fetchBatchUserProfileV2,
  fetchUserLiveInfoByUid,
  fetchUserProfileByShortId,
  handlerShortenUrl,
  handlerUserProfile,
  handlerUserProfileV2,
  encryptUidToSecUserId,
  handlerUserProfileV3,
  handlerUserProfileV4,
  fetchUserFansList,
  fetchChallengePosts,
  fetchVideoChannelResult,
  webcastId_2RoomId,
  fetchLiveImFetch,
  fetchSeriesAweme,
  fetchKnowledgeAweme,
  fetchGameAweme,
  fetchCartoonAweme,
  fetchMusicAweme,
  fetchFoodAweme,
  fetchOneVideo,
  fetchOneVideoV2,
  fetchOneVideoV3,
  fetchShareInfoByShareCode,
  fetchMultiVideo,
  fetchMultiVideoV2,
  fetchOneVideoByShareUrl,
  fetchVideoHighQualityPlayUrl,
  fetchMultiVideoHighQualityPlayUrl,
  handlerUserProfile,
  fetchUserFansList,
  fetchUserPostVideos,
  fetchVideoMixDetail,
  fetchVideoMixPostList,
  fetchUserSeriesList,
  fetchSeriesVideoList,
  fetchSeriesDetail,
  fetchMusicDetail,
  fetchMusicVideoList,
  fetchHashtagDetail,
  fetchHashtagVideoList,
  fetchUserLikeVideos,
  fetchUserFollowingList,
  fetchVideoComments,
  fetchVideoCommentReplies,
  fetchUserFollowingList,
  fetchUserLikeVideos,
  fetchVideoComments,
  fetchVideoCommentReplies,
  fetchLiveGiftRanking,
  fetchVideoStatistics,
  fetchMultiVideoStatistics,
  fetchCreatorMaterialCenterBillboard,
  fetchCreatorHotSpotBillboard,
  fetchCreatorHotTopicBillboard,
  fetchCreatorHotPropsBillboard,
  fetchCreatorHotChallengeBillboard,
  fetchCreatorHotMusicBillboard,
  fetchItemPlaySource,
  fetchItemWatchTrend,
  fetchItemDanmakuAnalysis,
  fetchItemAudiencePortrait,
  fetchItemAudienceOthers,
  fetchItemAnalysisOverview,
  fetchAllValidDate,
  fetchValidDateForRelation,
  fetchAllArea,
  fetchCurrentHotTopic,
  fetchHotWords,
  fetchKeywordValidDate,
  fetchMultiKeywordHotTrend,
  fetchMultiKeywordInterpretation,
  fetchRelationWord,
  fetchPortrait,
  fetchGetUserSubWord,
  fetchEncryptUserId,
  fetchDarenCompareUsersStable,
  fetchDarenSimilarUsers,
  fetchDarenGreatUserTopVideo,
  fetchDarenGreatItemMileInfo,
  fetchDarenGreatUserFansInfo,
  fetchBrandValidInfo,
  fetchBrandRadarChart,
  fetchBrandLines,
  fetchBrandCycles,
  fetchBrandInitiativeRankWeekly,
  fetchContentValidDate,
  fetchBrandHotVideosTimeScope,
  fetchContentCreativeKeywords,
  fetchContentCreativeKeywordItems,
  fetchContentCreativeTopic,
  fetchContentPublishTrend,
  fetchContentCreativeDuration,
  fetchContentAuthorPortrait,
  fetchContentConsumerPortrait,
  fetchContentInteractTrend,
  fetchContentConsumeTrend,
  fetchInsightRecommend,
  fetchReportDetail,
  fetchInsightGetRec,
  fetchCityList,
  fetchContentTag,
  fetchHotCategoryList,
  fetchHotRiseList,
  fetchHotCityList,
  fetchHotChallengeList,
  fetchHotTotalList,
  fetchHotCalendarList,
  fetchHotCalendarDetail,
  fetchHotUserPortraitList,
  fetchHotCommentWordList,
  fetchHotItemTrendsList,
  fetchHotAccountList,
  fetchHotAccountTrendsList,
  fetchHotAccountItemAnalysisList,
  fetchHotAccountFansPortraitList,
  fetchHotAccountFansInterestAccountList,
  fetchHotAccountFansInterestTopicList,
  fetchHotTotalVideoList,
  fetchHotTotalLowFanList,
  fetchHotTotalHighPlayList,
  fetchHotTotalHighLikeList,
  fetchHotTotalHighFanList,
  fetchHotTotalTopicList,
  fetchHotTotalHighTopicList,
  fetchHotTotalHotWordList,
  fetchHotTotalHotWordDetailList,
  kolConversionAbilityAnalysisV1,
  kolXingtuIndexV1,
  kolCpInfoV1,
  authorHotCommentTokensV1,
  authorContentHotCommentKeywordsV1,
  getRankingListCatalog,
  getRankingListData,
  getPlayletActorRankCatalog,
  getPlayletActorRankList,
  getContentTrendGuide,
  fetchGeneralSearchResult,
  fetchVideoSearchResult,
  fetchVideoSearchResultV2,
  fetchUserSearchResult,
  fetchUserSearchResultV2,
  fetchUserSearchResultV3,
  fetchLiveSearchResult,
  fetchSearchChallenge,
  fetchHotSearchResult,
  fetchQueryUser,
  fetchGeneralSearchResult,
  fetchVideoSearchResult,
  fetchVideoSearchResultV2,
  fetchUserSearchResult,
  fetchLiveSearchResult,
  fetchMusicSearchResult,
  fetchHashtagSearchResult,
  fetchHotSearchList,
  fetchLiveHotSearchList,
  fetchMusicHotSearchList,
  fetchBrandHotSearchList,
  fetchBrandHotSearchListDetail,
  openDouyinAppToKeywordSearch,
  fetchUserSearch,
  fetchItemSearchKeyword,
  fetchDarenSugGreatUserList,
  fetchItemFilterOptions,
  fetchItemSug,
  fetchItemQuery,
  fetchBrandSuggest,
  fetchTopicSuggest,
  fetchTopicQuery,
  fetchReportSearch,
  fetchGeneralSearchV1,
  fetchGeneralSearchV2,
  fetchSearchSuggest,
  fetchVideoSearchV1,
  fetchVideoSearchV2,
  fetchMultiSearch,
  fetchUserSearch,
  fetchUserSearchV2,
  fetchImageSearch,
  fetchImageSearchV3,
  fetchLiveSearchV1,
  fetchChallengeSearchV1,
  fetchChallengeSearchV2,
  fetchChallengeSuggest,
  fetchExperienceSearch,
  fetchMusicSearch,
  fetchDiscussSearch,
  fetchSchoolSearch,
  fetchVisionSearch,
  fetchHotAccountSearchList,
  fetchHotAccountFansInterestSearchList,
  fetchHotTotalSearchList,
  fetchHotTotalHighSearchList,
  searchKolV1,
  searchKolV2,
  getDemanderMcnList,
  generateDouyinShortUrl,
  generateDouyinVideoShareQrcode,
  openDouyinAppToVideoDetail,
  openDouyinAppToUserProfile,
  openDouyinAppToSendPrivateMessage,
  getSecUserId,
  getAllSecUserId,
  getAwemeId,
  getAllAwemeId,
  getWebcastId,
  getAllWebcastId,
  douyinLiveRoom,
  fetchCreatorActivityList,
  fetchCreatorActivityDetail,
  fetchCreatorMaterialCenterConfig,
  fetchCreatorHotCourse,
  fetchCreatorContentCategory,
  fetchCreatorContentCourse,
  fetchVideoDanmakuList,
  fetchMissionTaskList,
  fetchIndustryCategoryConfig,
  fetchItemOverviewData,
  fetchItemAnalysisInvolvedVertical,
  fetchItemAnalysisItemPerformance,
  fetchItemList,
  fetchItemListDownload,
  fetchLiveRoomHistoryList,
  fetchAuthorDiagnosis,
  getSignImage,
  getXingtuKolidByUid,
  getXingtuKolidBySecUserId,
  getXingtuKolidByUniqueId,
  kolBaseInfoV1,
  kolAudiencePortraitV1,
  kolFansPortraitV1,
  kolServicePriceV1,
  kolDataOverviewV1,
  kolVideoPerformanceV1,
  kolConvertVideoDisplayV1,
  kolLinkStructV1,
  kolTouchDistributionV1,
  kolRecVideosV1,
  kolDailyFansV1,
  getAuthorMarketFields,
  getAuthorBaseInfo,
  getAuthorBusinessCardInfo,
  getAuthorLocalInfo,
  getAuthorShowItems,
  getAuthorHotCommentTokens,
  getAuthorContentHotKeywords,
  getRecommendForStarAuthors,
  getExcellentCaseCategoryList,
  getAuthorSpreadInfo,
  getUserProfileQrcode,
  getIpActivityIndustryList,
  getIpActivityList,
  getIpActivityDetail,
  getResourceList,
};
