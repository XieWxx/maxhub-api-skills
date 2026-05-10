// 第三方接口请求封装 - wechat
// 基于MaxHub API中转站调用，包含所有API

const BASE_URL = process.env.MAXHUB_BASE_URL || 'https://www.aconfig.cn';
const API_KEY = process.env.MAXHUB_API_KEY;
const PLATFORM = 'wechat';

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
 * 获取微信公众号文章详情的JSON/Get Wechat MP Article D
 * GET /api/v1/wechat_mp/web/fetch_mp_article_detail_json
 * @param {string} url - 必填参数
 */
async function fetchMpArticleDetailJson(url, extraParams = {}) {
  const params = { url, ...extraParams };
  return request('_mp/web/fetch_mp_article_detail_json', params);
}

/**
 * 获取微信公众号文章详情的HTML/Get Wechat MP Article D
 * GET /api/v1/wechat_mp/web/fetch_mp_article_detail_html
 * @param {string} url - 必填参数
 */
async function fetchMpArticleDetailHtml(url, extraParams = {}) {
  const params = { url, ...extraParams };
  return request('_mp/web/fetch_mp_article_detail_html', params);
}

/**
 * 获取微信公众号文章列表/Get Wechat MP Article List
 * GET /api/v1/wechat_mp/web/fetch_mp_article_list
 * @param {string} ghid - 必填参数
 */
async function fetchMpArticleList(ghid, extraParams = {}) {
  const params = { ghid, ...extraParams };
  return request('_mp/web/fetch_mp_article_list', params);
}

/**
 * 获取微信公众号文章阅读量/Get Wechat MP Article Read
 * GET /api/v1/wechat_mp/web/fetch_mp_article_read_count
 * @param {string, string} url, comment_id - 必填参数
 */
async function fetchMpArticleReadCount(url, comment_id, extraParams = {}) {
  const params = { url, comment_id, ...extraParams };
  return request('_mp/web/fetch_mp_article_read_count', params);
}

/**
 * 获取微信公众号文章永久链接/Get Wechat MP Article URL
 * GET /api/v1/wechat_mp/web/fetch_mp_article_url
 * @param {string} sogou_url - 必填参数
 */
async function fetchMpArticleUrl(sogou_url, extraParams = {}) {
  const params = { sogou_url, ...extraParams };
  return request('_mp/web/fetch_mp_article_url', params);
}

/**
 * 获取微信公众号广告/Get Wechat MP Article Ad
 * GET /api/v1/wechat_mp/web/fetch_mp_article_ad
 * @param {string} url - 必填参数
 */
async function fetchMpArticleAd(url, extraParams = {}) {
  const params = { url, ...extraParams };
  return request('_mp/web/fetch_mp_article_ad', params);
}

/**
 * 获取微信公众号长链接转短链接/Get Wechat MP Long URL to
 * GET /api/v1/wechat_mp/web/fetch_mp_article_url_conversion
 * @param {string} url - 必填参数
 */
async function fetchMpArticleUrlConversion(url, extraParams = {}) {
  const params = { url, ...extraParams };
  return request('_mp/web/fetch_mp_article_url_conversion', params);
}

/**
 * 获取微信公众号关联文章/Get Wechat MP Related Articl
 * GET /api/v1/wechat_mp/web/fetch_mp_related_articles
 * @param {string} url - 必填参数
 */
async function fetchMpRelatedArticles(url, extraParams = {}) {
  const params = { url, ...extraParams };
  return request('_mp/web/fetch_mp_related_articles', params);
}

/**
 * 微信视频号视频详情/WeChat Channels Video Detail
 * GET /api/v1/wechat_channels/fetch_video_detail
 * 无必填参数
 */
async function fetchVideoDetail(extraParams = {}) {
  const params = { ...extraParams };
  return request('_channels/fetch_video_detail', params);
}

/**
 * 微信视频号主页/WeChat Channels Home Page
 * POST /api/v1/wechat_channels/fetch_home_page
 * 无必填参数
 */
async function fetchHomePage(extraParams = {}) {
  const params = { ...extraParams };
  return request('_channels/fetch_home_page', params, 'POST');
}

/**
 * 微信视频号直播回放/WeChat Channels Live History
 * GET /api/v1/wechat_channels/fetch_live_history
 * @param {string} username - 必填参数
 */
async function fetchLiveHistory(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('_channels/fetch_live_history', params);
}

/**
 * 微信视频号热门话题/WeChat Channels Hot Topics
 * GET /api/v1/wechat_channels/fetch_hot_words
 * 无必填参数
 */
async function fetchHotWords(extraParams = {}) {
  const params = { ...extraParams };
  return request('_channels/fetch_hot_words', params);
}

// ==================== 互 ====================

/**
 * 获取微信公众号文章评论列表/Get Wechat MP Article Comm
 * GET /api/v1/wechat_mp/web/fetch_mp_article_comment_list
 * @param {string} url - 必填参数
 */
async function fetchMpArticleCommentList(url, extraParams = {}) {
  const params = { url, ...extraParams };
  return request('_mp/web/fetch_mp_article_comment_list', params);
}

/**
 * 获取微信公众号文章评论回复列表/Get Wechat MP Article Co
 * GET /api/v1/wechat_mp/web/fetch_mp_article_comment_reply_list
 * @param {string, string} comment_id, content_id - 必填参数
 */
async function fetchMpArticleCommentReplyList(comment_id, content_id, extraParams = {}) {
  const params = { comment_id, content_id, ...extraParams };
  return request('_mp/web/fetch_mp_article_comment_reply_list', params);
}

/**
 * 微信视频号评论/WeChat Channels Comments
 * POST /api/v1/wechat_channels/fetch_comments
 * 无必填参数
 */
async function fetchComments(extraParams = {}) {
  const params = { ...extraParams };
  return request('_channels/fetch_comments', params, 'POST');
}

// ==================== 搜 ====================

/**
 * 微信视频号默认搜索/WeChat Channels Default Search
 * POST /api/v1/wechat_channels/fetch_default_search
 * 无必填参数
 */
async function fetchDefaultSearch(extraParams = {}) {
  const params = { ...extraParams };
  return request('_channels/fetch_default_search', params, 'POST');
}

/**
 * 微信视频号搜索最新视频/WeChat Channels Search Lates
 * GET /api/v1/wechat_channels/fetch_search_latest
 * @param {string} keywords - 必填参数
 */
async function fetchSearchLatest(keywords, extraParams = {}) {
  const params = { keywords, ...extraParams };
  return request('_channels/fetch_search_latest', params);
}

/**
 * 微信视频号综合搜索/WeChat Channels Comprehensive
 * GET /api/v1/wechat_channels/fetch_search_ordinary
 * @param {string} keywords - 必填参数
 */
async function fetchSearchOrdinary(keywords, extraParams = {}) {
  const params = { keywords, ...extraParams };
  return request('_channels/fetch_search_ordinary', params);
}

/**
 * 微信视频号用户搜索/WeChat Channels User Search
 * GET /api/v1/wechat_channels/fetch_user_search
 * @param {string} keywords - 必填参数
 */
async function fetchUserSearch(keywords, extraParams = {}) {
  const params = { keywords, ...extraParams };
  return request('_channels/fetch_user_search', params);
}

/**
 * 微信视频号用户搜索V2/WeChat Channels User Search
 * GET /api/v1/wechat_channels/fetch_user_search_v2
 * 无必填参数
 */
async function fetchUserSearchV2(extraParams = {}) {
  const params = { ...extraParams };
  return request('_channels/fetch_user_search_v2', params);
}

module.exports = {
  request,
  fetchMpArticleDetailJson,
  fetchMpArticleDetailHtml,
  fetchMpArticleList,
  fetchMpArticleReadCount,
  fetchMpArticleUrl,
  fetchMpArticleAd,
  fetchMpArticleUrlConversion,
  fetchMpRelatedArticles,
  fetchVideoDetail,
  fetchHomePage,
  fetchLiveHistory,
  fetchHotWords,
  fetchMpArticleCommentList,
  fetchMpArticleCommentReplyList,
  fetchComments,
  fetchDefaultSearch,
  fetchSearchLatest,
  fetchSearchOrdinary,
  fetchUserSearch,
  fetchUserSearchV2,
};
