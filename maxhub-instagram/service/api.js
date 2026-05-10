// 第三方接口请求封装 - instagram
// 基于MaxHub API中转站调用，包含所有API

const BASE_URL = process.env.MAXHUB_BASE_URL || 'https://www.aconfig.cn';
const API_KEY = process.env.MAXHUB_API_KEY;
const PLATFORM = 'instagram';

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
 * Shortcode转Media ID/Convert shortcode to
 * GET /api/v1/instagram/v1/shortcode_to_media_id
 * @param {string} shortcode - 必填参数
 */
async function shortcodeToMediaId(shortcode, extraParams = {}) {
  const params = { shortcode, ...extraParams };
  return request('/v1/shortcode_to_media_id', params);
}

/**
 * Media ID转Shortcode/Convert media ID to s
 * GET /api/v1/instagram/v1/media_id_to_shortcode
 * @param {string} media_id - 必填参数
 */
async function mediaIdToShortcode(media_id, extraParams = {}) {
  const params = { media_id, ...extraParams };
  return request('/v1/media_id_to_shortcode', params);
}

/**
 * 用户ID转用户信息/Get user info by user ID
 * GET /api/v1/instagram/v1/user_id_to_username
 * @param {string} user_id - 必填参数
 */
async function userIdToUsername(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/v1/user_id_to_username', params);
}

/**
 * 根据用户名获取用户数据/Get user data by username
 * GET /api/v1/instagram/v1/fetch_user_info_by_username
 * @param {string} username - 必填参数
 */
async function fetchUserInfoByUsername(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/v1/fetch_user_info_by_username', params);
}

/**
 * 根据用户名获取用户数据V2/Get user data by username
 * GET /api/v1/instagram/v1/fetch_user_info_by_username_v2
 * @param {string} username - 必填参数
 */
async function fetchUserInfoByUsernameV2(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/v1/fetch_user_info_by_username_v2', params);
}

/**
 * 根据用户名获取用户数据V3/Get user data by username
 * GET /api/v1/instagram/v1/fetch_user_info_by_username_v3
 * @param {string} username - 必填参数
 */
async function fetchUserInfoByUsernameV3(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/v1/fetch_user_info_by_username_v3', params);
}

/**
 * 根据用户ID获取用户数据/Get user data by user ID
 * GET /api/v1/instagram/v1/fetch_user_info_by_id
 * @param {string} user_id - 必填参数
 */
async function fetchUserInfoById(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/v1/fetch_user_info_by_id', params);
}

/**
 * 根据用户ID获取用户数据V2/Get user data by user ID
 * GET /api/v1/instagram/v1/fetch_user_info_by_id_v2
 * @param {string} user_id - 必填参数
 */
async function fetchUserInfoByIdV2(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/v1/fetch_user_info_by_id_v2', params);
}

/**
 * 获取用户的About信息/Get user about info
 * GET /api/v1/instagram/v1/fetch_user_about_info
 * @param {string} user_id - 必填参数
 */
async function fetchUserAboutInfo(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/v1/fetch_user_about_info', params);
}

/**
 * 获取用户帖子列表/Get user posts list
 * GET /api/v1/instagram/v1/fetch_user_posts
 * @param {string} user_id - 必填参数
 */
async function fetchUserPosts(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/v1/fetch_user_posts', params);
}

/**
 * 获取用户帖子列表V2/Get user posts list V2
 * GET /api/v1/instagram/v1/fetch_user_posts_v2
 * @param {string} user_id - 必填参数
 */
async function fetchUserPostsV2(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/v1/fetch_user_posts_v2', params);
}

/**
 * 获取用户Reels列表/Get user Reels list
 * GET /api/v1/instagram/v1/fetch_user_reels
 * @param {string} user_id - 必填参数
 */
async function fetchUserReels(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/v1/fetch_user_reels', params);
}

/**
 * 获取用户转发列表/Get user reposts list
 * GET /api/v1/instagram/v1/fetch_user_reposts
 * @param {string} user_id - 必填参数
 */
async function fetchUserReposts(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/v1/fetch_user_reposts', params);
}

/**
 * 获取用户被标记的帖子/Get user tagged posts
 * GET /api/v1/instagram/v1/fetch_user_tagged_posts
 * @param {string} user_id - 必填参数
 */
async function fetchUserTaggedPosts(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/v1/fetch_user_tagged_posts', params);
}

/**
 * 获取相关用户推荐/Get related profiles
 * GET /api/v1/instagram/v1/fetch_related_profiles
 * @param {string} user_id - 必填参数
 */
async function fetchRelatedProfiles(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/v1/fetch_related_profiles', params);
}

/**
 * 通过URL获取帖子详情/Get post by URL
 * GET /api/v1/instagram/v1/fetch_post_by_url
 * @param {string} post_url - 必填参数
 */
async function fetchPostByUrl(post_url, extraParams = {}) {
  const params = { post_url, ...extraParams };
  return request('/v1/fetch_post_by_url', params);
}

/**
 * 通过URL获取帖子详情 V2/Get post by URL V2
 * GET /api/v1/instagram/v1/fetch_post_by_url_v2
 * @param {string} post_url - 必填参数
 */
async function fetchPostByUrlV2(post_url, extraParams = {}) {
  const params = { post_url, ...extraParams };
  return request('/v1/fetch_post_by_url_v2', params);
}

/**
 * 通过ID获取帖子详情/Get post by ID
 * GET /api/v1/instagram/v1/fetch_post_by_id
 * @param {string} post_id - 必填参数
 */
async function fetchPostById(post_id, extraParams = {}) {
  const params = { post_id, ...extraParams };
  return request('/v1/fetch_post_by_id', params);
}

/**
 * 获取使用特定音乐的帖子/Get posts using specific mus
 * GET /api/v1/instagram/v1/fetch_music_posts
 * 无必填参数
 */
async function fetchMusicPosts(extraParams = {}) {
  const params = { ...extraParams };
  return request('/v1/fetch_music_posts', params);
}

/**
 * 获取话题标签下的帖子/Get posts by hashtag
 * GET /api/v1/instagram/v1/fetch_hashtag_posts
 * @param {string} hashtag - 必填参数
 */
async function fetchHashtagPosts(hashtag, extraParams = {}) {
  const params = { hashtag, ...extraParams };
  return request('/v1/fetch_hashtag_posts', params);
}

/**
 * 获取地点信息/Get location info
 * GET /api/v1/instagram/v1/fetch_location_info
 * @param {string} location_id - 必填参数
 */
async function fetchLocationInfo(location_id, extraParams = {}) {
  const params = { location_id, ...extraParams };
  return request('/v1/fetch_location_info', params);
}

/**
 * 获取地点下的帖子/Get posts by location
 * GET /api/v1/instagram/v1/fetch_location_posts
 * @param {string} location_id - 必填参数
 */
async function fetchLocationPosts(location_id, extraParams = {}) {
  const params = { location_id, ...extraParams };
  return request('/v1/fetch_location_posts', params);
}

/**
 * 获取国家城市列表/Get cities by country
 * GET /api/v1/instagram/v1/fetch_cities
 * @param {string} country_code - 必填参数
 */
async function fetchCities(country_code, extraParams = {}) {
  const params = { country_code, ...extraParams };
  return request('/v1/fetch_cities', params);
}

/**
 * 获取城市地点列表/Get locations by city
 * GET /api/v1/instagram/v1/fetch_locations
 * @param {string} city_id - 必填参数
 */
async function fetchLocations(city_id, extraParams = {}) {
  const params = { city_id, ...extraParams };
  return request('/v1/fetch_locations', params);
}

/**
 * 获取探索页面分类/Get explore page sections
 * GET /api/v1/instagram/v1/fetch_explore_sections
 * 无必填参数
 */
async function fetchExploreSections(extraParams = {}) {
  const params = { ...extraParams };
  return request('/v1/fetch_explore_sections', params);
}

/**
 * 获取分类下的帖子/Get posts by section
 * GET /api/v1/instagram/v1/fetch_section_posts
 * @param {string} section_id - 必填参数
 */
async function fetchSectionPosts(section_id, extraParams = {}) {
  const params = { section_id, ...extraParams };
  return request('/v1/fetch_section_posts', params);
}

/**
 * Shortcode转Media ID/Convert shortcode to
 * GET /api/v1/instagram/v2/shortcode_to_media_id
 * @param {string} shortcode - 必填参数
 */
async function shortcodeToMediaId(shortcode, extraParams = {}) {
  const params = { shortcode, ...extraParams };
  return request('/v2/shortcode_to_media_id', params);
}

/**
 * Media ID转Shortcode/Convert media ID to s
 * GET /api/v1/instagram/v2/media_id_to_shortcode
 * @param {string} media_id - 必填参数
 */
async function mediaIdToShortcode(media_id, extraParams = {}) {
  const params = { media_id, ...extraParams };
  return request('/v2/media_id_to_shortcode', params);
}

/**
 * 用户ID转用户信息/Get user info by user ID
 * GET /api/v1/instagram/v2/user_id_to_username
 * @param {string} user_id - 必填参数
 */
async function userIdToUsername(user_id, extraParams = {}) {
  const params = { user_id, ...extraParams };
  return request('/v2/user_id_to_username', params);
}

/**
 * 获取用户信息/Get user info
 * GET /api/v1/instagram/v2/fetch_user_info
 * 无必填参数
 */
async function fetchUserInfo(extraParams = {}) {
  const params = { ...extraParams };
  return request('/v2/fetch_user_info', params);
}

/**
 * 获取用户帖子/Get user posts
 * GET /api/v1/instagram/v2/fetch_user_posts
 * 无必填参数
 */
async function fetchUserPosts(extraParams = {}) {
  const params = { ...extraParams };
  return request('/v2/fetch_user_posts', params);
}

/**
 * 获取用户Reels/Get user reels
 * GET /api/v1/instagram/v2/fetch_user_reels
 * 无必填参数
 */
async function fetchUserReels(extraParams = {}) {
  const params = { ...extraParams };
  return request('/v2/fetch_user_reels', params);
}

/**
 * 获取用户故事/Get user stories
 * GET /api/v1/instagram/v2/fetch_user_stories
 * 无必填参数
 */
async function fetchUserStories(extraParams = {}) {
  const params = { ...extraParams };
  return request('/v2/fetch_user_stories', params);
}

/**
 * 获取用户精选/Get user highlights
 * GET /api/v1/instagram/v2/fetch_user_highlights
 * 无必填参数
 */
async function fetchUserHighlights(extraParams = {}) {
  const params = { ...extraParams };
  return request('/v2/fetch_user_highlights', params);
}

/**
 * 获取精选故事详情/Get highlight stories
 * GET /api/v1/instagram/v2/fetch_highlight_stories
 * @param {string} highlight_id - 必填参数
 */
async function fetchHighlightStories(highlight_id, extraParams = {}) {
  const params = { highlight_id, ...extraParams };
  return request('/v2/fetch_highlight_stories', params);
}

/**
 * 获取用户被标记的帖子/Get user tagged posts
 * GET /api/v1/instagram/v2/fetch_user_tagged_posts
 * 无必填参数
 */
async function fetchUserTaggedPosts(extraParams = {}) {
  const params = { ...extraParams };
  return request('/v2/fetch_user_tagged_posts', params);
}

/**
 * 获取相似用户/Get similar users
 * GET /api/v1/instagram/v2/fetch_similar_users
 * 无必填参数
 */
async function fetchSimilarUsers(extraParams = {}) {
  const params = { ...extraParams };
  return request('/v2/fetch_similar_users', params);
}

/**
 * 获取帖子详情/Get post info
 * GET /api/v1/instagram/v2/fetch_post_info
 * @param {string} code_or_url - 必填参数
 */
async function fetchPostInfo(code_or_url, extraParams = {}) {
  const params = { code_or_url, ...extraParams };
  return request('/v2/fetch_post_info', params);
}

/**
 * 获取音乐帖子/Get music posts
 * GET /api/v1/instagram/v2/fetch_music_posts
 * @param {string} audio_canonical_id - 必填参数
 */
async function fetchMusicPosts(audio_canonical_id, extraParams = {}) {
  const params = { audio_canonical_id, ...extraParams };
  return request('/v2/fetch_music_posts', params);
}

/**
 * 获取地点帖子/Get location posts
 * GET /api/v1/instagram/v2/fetch_location_posts
 * @param {string} location_id - 必填参数
 */
async function fetchLocationPosts(location_id, extraParams = {}) {
  const params = { location_id, ...extraParams };
  return request('/v2/fetch_location_posts', params);
}

/**
 * 获取话题帖子/Get hashtag posts
 * GET /api/v1/instagram/v2/fetch_hashtag_posts
 * @param {string} keyword - 必填参数
 */
async function fetchHashtagPosts(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/v2/fetch_hashtag_posts', params);
}

/**
 * 通过用户名获取用户ID/Get user ID by username
 * GET /api/v1/instagram/v3/get_user_id_by_username
 * @param {string} username - 必填参数
 */
async function getUserIdByUsername(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/v3/get_user_id_by_username', params);
}

/**
 * 获取用户信息/Get user profile
 * GET /api/v1/instagram/v3/get_user_profile
 * 无必填参数
 */
async function getUserProfile(extraParams = {}) {
  const params = { ...extraParams };
  return request('/v3/get_user_profile', params);
}

/**
 * 获取用户短详情/Get user brief info
 * GET /api/v1/instagram/v3/get_user_brief
 * @param {string, string} user_id, username - 必填参数
 */
async function getUserBrief(user_id, username, extraParams = {}) {
  const params = { user_id, username, ...extraParams };
  return request('/v3/get_user_brief', params);
}

/**
 * 获取用户帖子列表/Get user posts
 * GET /api/v1/instagram/v3/get_user_posts
 * @param {string} username - 必填参数
 */
async function getUserPosts(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/v3/get_user_posts', params);
}

/**
 * 获取用户被标记的帖子/Get user tagged posts
 * GET /api/v1/instagram/v3/get_user_tagged_posts
 * 无必填参数
 */
async function getUserTaggedPosts(extraParams = {}) {
  const params = { ...extraParams };
  return request('/v3/get_user_tagged_posts', params);
}

/**
 * 获取用户Reels列表/Get user reels
 * GET /api/v1/instagram/v3/get_user_reels
 * 无必填参数
 */
async function getUserReels(extraParams = {}) {
  const params = { ...extraParams };
  return request('/v3/get_user_reels', params);
}

/**
 * 获取用户精选Highlights列表/Get user highlights
 * GET /api/v1/instagram/v3/get_user_highlights
 * 无必填参数
 */
async function getUserHighlights(extraParams = {}) {
  const params = { ...extraParams };
  return request('/v3/get_user_highlights', params);
}

/**
 * 获取Highlight精选详情/Get highlight stories
 * GET /api/v1/instagram/v3/get_highlight_stories
 * @param {string} highlight_id - 必填参数
 */
async function getHighlightStories(highlight_id, extraParams = {}) {
  const params = { highlight_id, ...extraParams };
  return request('/v3/get_highlight_stories', params);
}

/**
 * 获取用户账户简介/Get user about info
 * GET /api/v1/instagram/v3/get_user_about
 * 无必填参数
 */
async function getUserAbout(extraParams = {}) {
  const params = { ...extraParams };
  return request('/v3/get_user_about', params);
}

/**
 * 获取用户曾用用户名/Get user former usernames
 * GET /api/v1/instagram/v3/get_user_former_usernames
 * 无必填参数
 */
async function getUserFormerUsernames(extraParams = {}) {
  const params = { ...extraParams };
  return request('/v3/get_user_former_usernames', params);
}

/**
 * 获取用户Stories（快拍）/Get user stories
 * GET /api/v1/instagram/v3/get_user_stories
 * 无必填参数
 */
async function getUserStories(extraParams = {}) {
  const params = { ...extraParams };
  return request('/v3/get_user_stories', params);
}

/**
 * 获取Reels推荐列表/Get recommended Reels feed
 * GET /api/v1/instagram/v3/get_recommended_reels
 * 无必填参数
 */
async function getRecommendedReels(extraParams = {}) {
  const params = { ...extraParams };
  return request('/v3/get_recommended_reels', params);
}

/**
 * 获取帖子详情/Get post info (media_id or URL)
 * GET /api/v1/instagram/v3/get_post_info
 * @param {string} media_id - 必填参数
 */
async function getPostInfo(media_id, extraParams = {}) {
  const params = { media_id, ...extraParams };
  return request('/v3/get_post_info', params);
}

/**
 * 获取帖子详情(code)/Get post info by shortcode
 * GET /api/v1/instagram/v3/get_post_info_by_code
 * @param {string} code - 必填参数
 */
async function getPostInfoByCode(code, extraParams = {}) {
  const params = { code, ...extraParams };
  return request('/v3/get_post_info_by_code', params);
}

/**
 * 获取帖子oEmbed内嵌信息/Get post oEmbed info
 * GET /api/v1/instagram/v3/get_post_oembed
 * @param {string} url - 必填参数
 */
async function getPostOembed(url, extraParams = {}) {
  const params = { url, ...extraParams };
  return request('/v3/get_post_oembed', params);
}

/**
 * 获取探索页推荐帖子/Get explore feed
 * GET /api/v1/instagram/v3/get_explore
 * 无必填参数
 */
async function getExplore(extraParams = {}) {
  const params = { ...extraParams };
  return request('/v3/get_explore', params);
}

/**
 * 获取地点详情/Get location info
 * GET /api/v1/instagram/v3/get_location_info
 * @param {string} location_id - 必填参数
 */
async function getLocationInfo(location_id, extraParams = {}) {
  const params = { location_id, ...extraParams };
  return request('/v3/get_location_info', params);
}

/**
 * 获取地点相关帖子/Get location posts
 * GET /api/v1/instagram/v3/get_location_posts
 * @param {string} location_id - 必填参数
 */
async function getLocationPosts(location_id, extraParams = {}) {
  const params = { location_id, ...extraParams };
  return request('/v3/get_location_posts', params);
}

/**
 * 获取地点附近内容/Get nearby location content
 * GET /api/v1/instagram/v3/get_location_nearby
 * @param {string} location_id - 必填参数
 */
async function getLocationNearby(location_id, extraParams = {}) {
  const params = { location_id, ...extraParams };
  return request('/v3/get_location_nearby', params);
}

/**
 * 短码转媒体ID/Convert shortcode to media ID
 * GET /api/v1/instagram/v3/shortcode_to_media_id
 * @param {string} shortcode - 必填参数
 */
async function shortcodeToMediaId(shortcode, extraParams = {}) {
  const params = { shortcode, ...extraParams };
  return request('/v3/shortcode_to_media_id', params);
}

/**
 * 媒体ID转短码/Convert media ID to shortcode
 * GET /api/v1/instagram/v3/media_id_to_shortcode
 * @param {string} media_id - 必填参数
 */
async function mediaIdToShortcode(media_id, extraParams = {}) {
  const params = { media_id, ...extraParams };
  return request('/v3/media_id_to_shortcode', params);
}

// ==================== 搜 ====================

/**
 * 搜索用户/话题/地点/Search users/hashtags/places
 * GET /api/v1/instagram/v1/fetch_search
 * @param {string} query - 必填参数
 */
async function fetchSearch(query, extraParams = {}) {
  const params = { query, ...extraParams };
  return request('/v1/fetch_search', params);
}

/**
 * 搜索用户/Search users
 * GET /api/v1/instagram/v2/search_users
 * @param {string} keyword - 必填参数
 */
async function searchUsers(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/v2/search_users', params);
}

/**
 * 综合搜索/General search
 * GET /api/v1/instagram/v2/general_search
 * @param {string} keyword - 必填参数
 */
async function generalSearch(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/v2/general_search', params);
}

/**
 * 搜索Reels/Search reels
 * GET /api/v1/instagram/v2/search_reels
 * @param {string} keyword - 必填参数
 */
async function searchReels(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/v2/search_reels', params);
}

/**
 * 搜索音乐/Search music
 * GET /api/v1/instagram/v2/search_music
 * @param {string} keyword - 必填参数
 */
async function searchMusic(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/v2/search_music', params);
}

/**
 * 搜索话题标签/Search hashtags
 * GET /api/v1/instagram/v2/search_hashtags
 * @param {string} keyword - 必填参数
 */
async function searchHashtags(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/v2/search_hashtags', params);
}

/**
 * 搜索地点/Search locations
 * GET /api/v1/instagram/v2/search_locations
 * @param {string} keyword - 必填参数
 */
async function searchLocations(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/v2/search_locations', params);
}

/**
 * 根据坐标搜索地点/Search locations by coordinates
 * GET /api/v1/instagram/v2/search_by_coordinates
 * @param {string, string} latitude, longitude - 必填参数
 */
async function searchByCoordinates(latitude, longitude, extraParams = {}) {
  const params = { latitude, longitude, ...extraParams };
  return request('/v2/search_by_coordinates', params);
}

/**
 * 搜索用户/Search users
 * GET /api/v1/instagram/v3/search_users
 * @param {string} query - 必填参数
 */
async function searchUsers(query, extraParams = {}) {
  const params = { query, ...extraParams };
  return request('/v3/search_users', params);
}

/**
 * 搜索话题标签/Search hashtags
 * GET /api/v1/instagram/v3/search_hashtags
 * @param {string} query - 必填参数
 */
async function searchHashtags(query, extraParams = {}) {
  const params = { query, ...extraParams };
  return request('/v3/search_hashtags', params);
}

/**
 * 搜索地点/Search places
 * GET /api/v1/instagram/v3/search_places
 * @param {string} query - 必填参数
 */
async function searchPlaces(query, extraParams = {}) {
  const params = { query, ...extraParams };
  return request('/v3/search_places', params);
}

/**
 * 综合搜索（支持分页）/General search (with paginati
 * GET /api/v1/instagram/v3/general_search
 * @param {string} query - 必填参数
 */
async function generalSearch(query, extraParams = {}) {
  const params = { query, ...extraParams };
  return request('/v3/general_search', params);
}

// ==================== 互 ====================

/**
 * 获取帖子评论列表V2/Get post comments V2
 * GET /api/v1/instagram/v1/fetch_post_comments_v2
 * @param {string} media_id - 必填参数
 */
async function fetchPostCommentsV2(media_id, extraParams = {}) {
  const params = { media_id, ...extraParams };
  return request('/v1/fetch_post_comments_v2', params);
}

/**
 * 获取评论的子评论列表/Get comment replies
 * GET /api/v1/instagram/v1/fetch_comment_replies
 * @param {string, string} media_id, comment_id - 必填参数
 */
async function fetchCommentReplies(media_id, comment_id, extraParams = {}) {
  const params = { media_id, comment_id, ...extraParams };
  return request('/v1/fetch_comment_replies', params);
}

/**
 * 获取用户粉丝/Get user followers
 * GET /api/v1/instagram/v2/fetch_user_followers
 * 无必填参数
 */
async function fetchUserFollowers(extraParams = {}) {
  const params = { ...extraParams };
  return request('/v2/fetch_user_followers', params);
}

/**
 * 获取用户关注/Get user following
 * GET /api/v1/instagram/v2/fetch_user_following
 * 无必填参数
 */
async function fetchUserFollowing(extraParams = {}) {
  const params = { ...extraParams };
  return request('/v2/fetch_user_following', params);
}

/**
 * 获取帖子点赞列表/Get post likes
 * GET /api/v1/instagram/v2/fetch_post_likes
 * @param {string} code_or_url - 必填参数
 */
async function fetchPostLikes(code_or_url, extraParams = {}) {
  const params = { code_or_url, ...extraParams };
  return request('/v2/fetch_post_likes', params);
}

/**
 * 获取帖子评论/Get post comments
 * GET /api/v1/instagram/v2/fetch_post_comments
 * @param {string} code_or_url - 必填参数
 */
async function fetchPostComments(code_or_url, extraParams = {}) {
  const params = { code_or_url, ...extraParams };
  return request('/v2/fetch_post_comments', params);
}

/**
 * 获取评论回复/Get comment replies
 * GET /api/v1/instagram/v2/fetch_comment_replies
 * @param {string, string} code_or_url, comment_id - 必填参数
 */
async function fetchCommentReplies(code_or_url, comment_id, extraParams = {}) {
  const params = { code_or_url, comment_id, ...extraParams };
  return request('/v2/fetch_comment_replies', params);
}

/**
 * 获取帖子评论/Get post comments
 * GET /api/v1/instagram/v3/get_post_comments
 * @param {string} code - 必填参数
 */
async function getPostComments(code, extraParams = {}) {
  const params = { code, ...extraParams };
  return request('/v3/get_post_comments', params);
}

/**
 * 获取评论的子评论/回复/Get comment replies
 * GET /api/v1/instagram/v3/get_comment_replies
 * @param {string, string} media_id, comment_id - 必填参数
 */
async function getCommentReplies(media_id, comment_id, extraParams = {}) {
  const params = { media_id, comment_id, ...extraParams };
  return request('/v3/get_comment_replies', params);
}

/**
 * 翻译评论/帖子文本/Translate comment or caption
 * GET /api/v1/instagram/v3/translate_comment
 * @param {string} comment_id - 必填参数
 */
async function translateComment(comment_id, extraParams = {}) {
  const params = { comment_id, ...extraParams };
  return request('/v3/translate_comment', params);
}

/**
 * 批量翻译评论/Bulk translate comments
 * GET /api/v1/instagram/v3/bulk_translate_comments
 * @param {string} comment_ids - 必填参数
 */
async function bulkTranslateComments(comment_ids, extraParams = {}) {
  const params = { comment_ids, ...extraParams };
  return request('/v3/bulk_translate_comments', params);
}

/**
 * 获取用户关注列表/Get user following list
 * GET /api/v1/instagram/v3/get_user_following
 * 无必填参数
 */
async function getUserFollowing(extraParams = {}) {
  const params = { ...extraParams };
  return request('/v3/get_user_following', params);
}

/**
 * 获取用户粉丝列表/Get user followers list
 * GET /api/v1/instagram/v3/get_user_followers
 * 无必填参数
 */
async function getUserFollowers(extraParams = {}) {
  const params = { ...extraParams };
  return request('/v3/get_user_followers', params);
}

// ==================== 内 ====================

/**
 * 从URL提取短码/Extract shortcode from URL
 * GET /api/v1/instagram/v3/extract_shortcode
 * @param {string} url - 必填参数
 */
async function extractShortcode(url, extraParams = {}) {
  const params = { url, ...extraParams };
  return request('/v3/extract_shortcode', params);
}

module.exports = {
  request,
  shortcodeToMediaId,
  mediaIdToShortcode,
  userIdToUsername,
  fetchUserInfoByUsername,
  fetchUserInfoByUsernameV2,
  fetchUserInfoByUsernameV3,
  fetchUserInfoById,
  fetchUserInfoByIdV2,
  fetchUserAboutInfo,
  fetchUserPosts,
  fetchUserPostsV2,
  fetchUserReels,
  fetchUserReposts,
  fetchUserTaggedPosts,
  fetchRelatedProfiles,
  fetchPostByUrl,
  fetchPostByUrlV2,
  fetchPostById,
  fetchMusicPosts,
  fetchHashtagPosts,
  fetchLocationInfo,
  fetchLocationPosts,
  fetchCities,
  fetchLocations,
  fetchExploreSections,
  fetchSectionPosts,
  shortcodeToMediaId,
  mediaIdToShortcode,
  userIdToUsername,
  fetchUserInfo,
  fetchUserPosts,
  fetchUserReels,
  fetchUserStories,
  fetchUserHighlights,
  fetchHighlightStories,
  fetchUserTaggedPosts,
  fetchSimilarUsers,
  fetchPostInfo,
  fetchMusicPosts,
  fetchLocationPosts,
  fetchHashtagPosts,
  getUserIdByUsername,
  getUserProfile,
  getUserBrief,
  getUserPosts,
  getUserTaggedPosts,
  getUserReels,
  getUserHighlights,
  getHighlightStories,
  getUserAbout,
  getUserFormerUsernames,
  getUserStories,
  getRecommendedReels,
  getPostInfo,
  getPostInfoByCode,
  getPostOembed,
  getExplore,
  getLocationInfo,
  getLocationPosts,
  getLocationNearby,
  shortcodeToMediaId,
  mediaIdToShortcode,
  fetchSearch,
  searchUsers,
  generalSearch,
  searchReels,
  searchMusic,
  searchHashtags,
  searchLocations,
  searchByCoordinates,
  searchUsers,
  searchHashtags,
  searchPlaces,
  generalSearch,
  fetchPostCommentsV2,
  fetchCommentReplies,
  fetchUserFollowers,
  fetchUserFollowing,
  fetchPostLikes,
  fetchPostComments,
  fetchCommentReplies,
  getPostComments,
  getCommentReplies,
  translateComment,
  bulkTranslateComments,
  getUserFollowing,
  getUserFollowers,
  extractShortcode,
};
