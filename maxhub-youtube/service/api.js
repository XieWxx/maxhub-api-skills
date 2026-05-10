// 第三方接口请求封装 - youtube
// 基于MaxHub API中转站调用，包含所有API

const BASE_URL = process.env.MAXHUB_BASE_URL || 'https://www.aconfig.cn';
const API_KEY = process.env.MAXHUB_API_KEY;
const PLATFORM = 'youtube';

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
 * 获取视频信息 V1/Get video information V1
 * GET /api/v1/youtube/web/get_video_info
 * @param {string} video_id - 必填参数
 */
async function getVideoInfo(video_id, extraParams = {}) {
  const params = { video_id, ...extraParams };
  return request('/web/get_video_info', params);
}

/**
 * 获取视频信息 V2/Get video information V2
 * GET /api/v1/youtube/web/get_video_info_v2
 * @param {string} video_id - 必填参数
 */
async function getVideoInfoV2(video_id, extraParams = {}) {
  const params = { video_id, ...extraParams };
  return request('/web/get_video_info_v2', params);
}

/**
 * 获取视频详情 V3/Get video information V3
 * GET /api/v1/youtube/web/get_video_info_v3
 * @param {string} video_id - 必填参数
 */
async function getVideoInfoV3(video_id, extraParams = {}) {
  const params = { video_id, ...extraParams };
  return request('/web/get_video_info_v3', params);
}

/**
 * 获取视频字幕/Get video subtitles
 * GET /api/v1/youtube/web/get_video_subtitles
 * @param {string} subtitle_url - 必填参数
 */
async function getVideoSubtitles(subtitle_url, extraParams = {}) {
  const params = { subtitle_url, ...extraParams };
  return request('/web/get_video_subtitles', params);
}

/**
 * 获取频道描述信息/Get channel description
 * GET /api/v1/youtube/web/get_channel_description
 * 无必填参数
 */
async function getChannelDescription(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/get_channel_description', params);
}

/**
 * 获取推荐视频/Get related videos
 * GET /api/v1/youtube/web/get_relate_video
 * @param {string} video_id - 必填参数
 */
async function getRelateVideo(video_id, extraParams = {}) {
  const params = { video_id, ...extraParams };
  return request('/web/get_relate_video', params);
}

/**
 * 获取频道ID/Get channel ID
 * GET /api/v1/youtube/web/get_channel_id
 * @param {string} channel_name - 必填参数
 */
async function getChannelId(channel_name, extraParams = {}) {
  const params = { channel_name, ...extraParams };
  return request('/web/get_channel_id', params);
}

/**
 * 从频道URL获取频道ID V2/Get channel ID from URL
 * GET /api/v1/youtube/web/get_channel_id_v2
 * @param {string} channel_url - 必填参数
 */
async function getChannelIdV2(channel_url, extraParams = {}) {
  const params = { channel_url, ...extraParams };
  return request('/web/get_channel_id_v2', params);
}

/**
 * 从频道ID获取频道URL/Get channel URL from channe
 * GET /api/v1/youtube/web/get_channel_url
 * @param {string} channel_id - 必填参数
 */
async function getChannelUrl(channel_id, extraParams = {}) {
  const params = { channel_id, ...extraParams };
  return request('/web/get_channel_url', params);
}

/**
 * 获取频道信息/Get channel information
 * GET /api/v1/youtube/web/get_channel_info
 * @param {string} channel_id - 必填参数
 */
async function getChannelInfo(channel_id, extraParams = {}) {
  const params = { channel_id, ...extraParams };
  return request('/web/get_channel_info', params);
}

/**
 * 获取频道视频 V1（即将过时，优先使用 V2）/Get channel vide
 * GET /api/v1/youtube/web/get_channel_videos
 * @param {string} channel_id - 必填参数
 */
async function getChannelVideos(channel_id, extraParams = {}) {
  const params = { channel_id, ...extraParams };
  return request('/web/get_channel_videos', params);
}

/**
 * 获取频道视频 V2/Get channel videos V2
 * GET /api/v1/youtube/web/get_channel_videos_v2
 * @param {string} channel_id - 必填参数
 */
async function getChannelVideosV2(channel_id, extraParams = {}) {
  const params = { channel_id, ...extraParams };
  return request('/web/get_channel_videos_v2', params);
}

/**
 * 获取频道视频 V3/Get channel videos V3
 * GET /api/v1/youtube/web/get_channel_videos_v3
 * @param {string} channel_id - 必填参数
 */
async function getChannelVideosV3(channel_id, extraParams = {}) {
  const params = { channel_id, ...extraParams };
  return request('/web/get_channel_videos_v3', params);
}

/**
 * 获取频道短视频/Get channel short videos
 * GET /api/v1/youtube/web/get_channel_short_videos
 * @param {string} channel_id - 必填参数
 */
async function getChannelShortVideos(channel_id, extraParams = {}) {
  const params = { channel_id, ...extraParams };
  return request('/web/get_channel_short_videos', params);
}

/**
 * 获取视频详情 /Get video information
 * GET /api/v1/youtube/web_v2/get_video_info
 * @param {string} video_id - 必填参数
 */
async function getVideoInfo(video_id, extraParams = {}) {
  const params = { video_id, ...extraParams };
  return request('/web_v2/get_video_info', params);
}

/**
 * 获取频道描述信息/Get channel description
 * GET /api/v1/youtube/web_v2/get_channel_description
 * 无必填参数
 */
async function getChannelDescription(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web_v2/get_channel_description', params);
}

/**
 * 从频道URL获取频道ID /Get channel ID from URL
 * GET /api/v1/youtube/web_v2/get_channel_id
 * @param {string} channel_url - 必填参数
 */
async function getChannelId(channel_url, extraParams = {}) {
  const params = { channel_url, ...extraParams };
  return request('/web_v2/get_channel_id', params);
}

/**
 * 从频道ID获取频道URL/Get channel URL from channe
 * GET /api/v1/youtube/web_v2/get_channel_url
 * @param {string} channel_id - 必填参数
 */
async function getChannelUrl(channel_id, extraParams = {}) {
  const params = { channel_id, ...extraParams };
  return request('/web_v2/get_channel_url', params);
}

/**
 * 获取频道视频 /Get channel videos
 * GET /api/v1/youtube/web_v2/get_channel_videos
 * @param {string} channel_id - 必填参数
 */
async function getChannelVideos(channel_id, extraParams = {}) {
  const params = { channel_id, ...extraParams };
  return request('/web_v2/get_channel_videos', params);
}

/**
 * 获取视频流信息/Get video streams info
 * GET /api/v1/youtube/web_v2/get_video_streams
 * 无必填参数
 */
async function getVideoStreams(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web_v2/get_video_streams', params);
}

/**
 * 获取视频流信息 V2/Get video streams info V2
 * GET /api/v1/youtube/web_v2/get_video_streams_v2
 * 无必填参数
 */
async function getVideoStreamsV2(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web_v2/get_video_streams_v2', params);
}

/**
 * 获取已签名的视频流URL/Get signed video stream URL
 * GET /api/v1/youtube/web_v2/get_signed_stream_url
 * @param {string} itag - 必填参数
 */
async function getSignedStreamUrl(itag, extraParams = {}) {
  const params = { itag, ...extraParams };
  return request('/web_v2/get_signed_stream_url', params);
}

/**
 * 获取视频字幕/Get video captions
 * GET /api/v1/youtube/web_v2/get_video_captions
 * 无必填参数
 */
async function getVideoCaptions(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web_v2/get_video_captions', params);
}

/**
 * 获取视频相似内容/Get related videos
 * GET /api/v1/youtube/web_v2/get_related_videos
 * 无必填参数
 */
async function getRelatedVideos(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web_v2/get_related_videos', params);
}

/**
 * 获取频道短视频列表/Get channel shorts
 * GET /api/v1/youtube/web_v2/get_channel_shorts
 * 无必填参数
 */
async function getChannelShorts(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web_v2/get_channel_shorts', params);
}

/**
 * 获取频道帖子列表/Get channel community posts
 * GET /api/v1/youtube/web_v2/get_channel_community_posts
 * @param {string} channel_id - 必填参数
 */
async function getChannelCommunityPosts(channel_id, extraParams = {}) {
  const params = { channel_id, ...extraParams };
  return request('/web_v2/get_channel_community_posts', params);
}

/**
 * 获取帖子详情/Get post detail
 * GET /api/v1/youtube/web_v2/get_post_detail
 * @param {string} post_id - 必填参数
 */
async function getPostDetail(post_id, extraParams = {}) {
  const params = { post_id, ...extraParams };
  return request('/web_v2/get_post_detail', params);
}

/**
 * 获取趋势视频/Get trending videos
 * GET /api/v1/youtube/web/get_trending_videos
 * 无必填参数
 */
async function getTrendingVideos(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/get_trending_videos', params);
}

// ==================== 互 ====================

/**
 * 获取视频评论/Get video comments
 * GET /api/v1/youtube/web/get_video_comments
 * @param {string} video_id - 必填参数
 */
async function getVideoComments(video_id, extraParams = {}) {
  const params = { video_id, ...extraParams };
  return request('/web/get_video_comments', params);
}

/**
 * 获取视频二级评论/Get video sub comments
 * GET /api/v1/youtube/web/get_video_comment_replies
 * @param {string} continuation_token - 必填参数
 */
async function getVideoCommentReplies(continuation_token, extraParams = {}) {
  const params = { continuation_token, ...extraParams };
  return request('/web/get_video_comment_replies', params);
}

/**
 * 获取视频评论/Get video comments
 * GET /api/v1/youtube/web_v2/get_video_comments
 * @param {string} video_id - 必填参数
 */
async function getVideoComments(video_id, extraParams = {}) {
  const params = { video_id, ...extraParams };
  return request('/web_v2/get_video_comments', params);
}

/**
 * 获取视频二级评论/Get video sub comments
 * GET /api/v1/youtube/web_v2/get_video_comment_replies
 * @param {string} continuation_token - 必填参数
 */
async function getVideoCommentReplies(continuation_token, extraParams = {}) {
  const params = { continuation_token, ...extraParams };
  return request('/web_v2/get_video_comment_replies', params);
}

/**
 * 获取帖子评论/Get post comments
 * GET /api/v1/youtube/web_v2/get_post_comments
 * 无必填参数
 */
async function getPostComments(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web_v2/get_post_comments', params);
}

/**
 * 获取帖子评论回复/Get post comment replies
 * GET /api/v1/youtube/web_v2/get_post_comment_replies
 * @param {string} continuation_token - 必填参数
 */
async function getPostCommentReplies(continuation_token, extraParams = {}) {
  const params = { continuation_token, ...extraParams };
  return request('/web_v2/get_post_comment_replies', params);
}

// ==================== 搜 ====================

/**
 * 搜索视频/Search video
 * GET /api/v1/youtube/web/search_video
 * @param {string} search_query - 必填参数
 */
async function searchVideo(search_query, extraParams = {}) {
  const params = { search_query, ...extraParams };
  return request('/web/search_video', params);
}

/**
 * 综合搜索（支持过滤条件）/General search with filters
 * GET /api/v1/youtube/web/get_general_search
 * @param {string} search_query - 必填参数
 */
async function getGeneralSearch(search_query, extraParams = {}) {
  const params = { search_query, ...extraParams };
  return request('/web/get_general_search', params);
}

/**
 * YouTube Shorts短视频搜索/YouTube Shorts searc
 * GET /api/v1/youtube/web/get_shorts_search
 * @param {string} search_query - 必填参数
 */
async function getShortsSearch(search_query, extraParams = {}) {
  const params = { search_query, ...extraParams };
  return request('/web/get_shorts_search', params);
}

/**
 * 搜索频道/Search channel
 * GET /api/v1/youtube/web/search_channel
 * @param {string, string} channel_id, search_query - 必填参数
 */
async function searchChannel(channel_id, search_query, extraParams = {}) {
  const params = { channel_id, search_query, ...extraParams };
  return request('/web/search_channel', params);
}

/**
 * 综合搜索（原始数据，推荐使用V2）/General search (raw da
 * GET /api/v1/youtube/web_v2/get_general_search
 * @param {string} search_query - 必填参数
 */
async function getGeneralSearch(search_query, extraParams = {}) {
  const params = { search_query, ...extraParams };
  return request('/web_v2/get_general_search', params);
}

/**
 * 综合搜索V2/General search V2
 * GET /api/v1/youtube/web_v2/get_general_search_v2
 * 无必填参数
 */
async function getGeneralSearchV2(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web_v2/get_general_search_v2', params);
}

/**
 * Shorts搜索（原始数据，推荐使用V2）/Shorts search (raw
 * GET /api/v1/youtube/web_v2/get_shorts_search
 * @param {string} search_query - 必填参数
 */
async function getShortsSearch(search_query, extraParams = {}) {
  const params = { search_query, ...extraParams };
  return request('/web_v2/get_shorts_search', params);
}

/**
 * Shorts搜索V2/Shorts search V2
 * GET /api/v1/youtube/web_v2/get_shorts_search_v2
 * 无必填参数
 */
async function getShortsSearchV2(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web_v2/get_shorts_search_v2', params);
}

/**
 * 获取搜索推荐词/Get search suggestions
 * GET /api/v1/youtube/web_v2/get_search_suggestions
 * @param {string} keyword - 必填参数
 */
async function getSearchSuggestions(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web_v2/get_search_suggestions', params);
}

/**
 * 搜索频道/Search channels
 * GET /api/v1/youtube/web_v2/search_channels
 * 无必填参数
 */
async function searchChannels(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web_v2/search_channels', params);
}

module.exports = {
  request,
  getVideoInfo,
  getVideoInfoV2,
  getVideoInfoV3,
  getVideoSubtitles,
  getChannelDescription,
  getRelateVideo,
  getChannelId,
  getChannelIdV2,
  getChannelUrl,
  getChannelInfo,
  getChannelVideos,
  getChannelVideosV2,
  getChannelVideosV3,
  getChannelShortVideos,
  getVideoInfo,
  getChannelDescription,
  getChannelId,
  getChannelUrl,
  getChannelVideos,
  getVideoStreams,
  getVideoStreamsV2,
  getSignedStreamUrl,
  getVideoCaptions,
  getRelatedVideos,
  getChannelShorts,
  getChannelCommunityPosts,
  getPostDetail,
  getVideoComments,
  getVideoCommentReplies,
  getVideoComments,
  getVideoCommentReplies,
  getPostComments,
  getPostCommentReplies,
  searchVideo,
  getGeneralSearch,
  getShortsSearch,
  searchChannel,
  getGeneralSearch,
  getGeneralSearchV2,
  getShortsSearch,
  getShortsSearchV2,
  getSearchSuggestions,
  searchChannels,
  getTrendingVideos,
};
