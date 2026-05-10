// 第三方接口请求封装 - zhihu
// 基于MaxHub API中转站调用，包含所有API

const BASE_URL = process.env.MAXHUB_BASE_URL || 'https://www.aconfig.cn';
const API_KEY = process.env.MAXHUB_API_KEY;
const PLATFORM = 'zhihu';

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
 * 获取知乎专栏文章列表/Get Zhihu Column Articles
 * GET /api/v1/zhihu/web/fetch_column_articles
 * @param {string} column_id - 必填参数
 */
async function fetchColumnArticles(column_id, extraParams = {}) {
  const params = { column_id, ...extraParams };
  return request('/web/fetch_column_articles', params);
}

/**
 * 获取知乎专栏文章详情/Get Zhihu Column Article Deta
 * GET /api/v1/zhihu/web/fetch_column_article_detail
 * @param {string} article_id - 必填参数
 */
async function fetchColumnArticleDetail(article_id, extraParams = {}) {
  const params = { article_id, ...extraParams };
  return request('/web/fetch_column_article_detail', params);
}

/**
 * 获取知乎相似专栏推荐/Get Zhihu Similar Column Reco
 * GET /api/v1/zhihu/web/fetch_column_recommend
 * @param {string} article_id - 必填参数
 */
async function fetchColumnRecommend(article_id, extraParams = {}) {
  const params = { article_id, ...extraParams };
  return request('/web/fetch_column_recommend', params);
}

/**
 * 获取知乎专栏文章互动关系/Get Zhihu Column Article Re
 * GET /api/v1/zhihu/web/fetch_column_relationship
 * @param {string} article_id - 必填参数
 */
async function fetchColumnRelationship(article_id, extraParams = {}) {
  const params = { article_id, ...extraParams };
  return request('/web/fetch_column_relationship', params);
}

/**
 * 获取知乎首页推荐/Get Zhihu Hot Recommend
 * GET /api/v1/zhihu/web/fetch_hot_recommend
 * 无必填参数
 */
async function fetchHotRecommend(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_hot_recommend', params);
}

/**
 * 获取知乎首页热榜/Get Zhihu Hot List
 * GET /api/v1/zhihu/web/fetch_hot_list
 * 无必填参数
 */
async function fetchHotList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_hot_list', params);
}

/**
 * 获取知乎首页视频榜/Get Zhihu Video List
 * GET /api/v1/zhihu/web/fetch_video_list
 * 无必填参数
 */
async function fetchVideoList(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_video_list', params);
}

/**
 * 获取知乎用户信息/Get Zhihu User Info
 * GET /api/v1/zhihu/web/fetch_user_info
 * @param {string} user_url_token - 必填参数
 */
async function fetchUserInfo(user_url_token, extraParams = {}) {
  const params = { user_url_token, ...extraParams };
  return request('/web/fetch_user_info', params);
}

/**
 * 获取知乎用户的文章列表/Get Zhihu User Articles
 * GET /api/v1/zhihu/web/fetch_user_articles
 * @param {string} user_url_token - 必填参数
 */
async function fetchUserArticles(user_url_token, extraParams = {}) {
  const params = { user_url_token, ...extraParams };
  return request('/web/fetch_user_articles', params);
}

/**
 * 获取知乎用户的被收录文章列表/Get Zhihu User Included A
 * GET /api/v1/zhihu/web/fetch_user_included_articles
 * @param {string} user_url_token - 必填参数
 */
async function fetchUserIncludedArticles(user_url_token, extraParams = {}) {
  const params = { user_url_token, ...extraParams };
  return request('/web/fetch_user_included_articles', params);
}

/**
 * 获取知乎问题回答列表/Get Zhihu Question Answers
 * GET /api/v1/zhihu/web/fetch_question_answers
 * @param {string} question_id - 必填参数
 */
async function fetchQuestionAnswers(question_id, extraParams = {}) {
  const params = { question_id, ...extraParams };
  return request('/web/fetch_question_answers', params);
}

// ==================== 互 ====================

/**
 * 获取知乎专栏评论区配置/Get Zhihu Column Comment Con
 * GET /api/v1/zhihu/web/fetch_column_comment_config
 * @param {string} article_id - 必填参数
 */
async function fetchColumnCommentConfig(article_id, extraParams = {}) {
  const params = { article_id, ...extraParams };
  return request('/web/fetch_column_comment_config', params);
}

/**
 * 获取知乎评论区V5/Get Zhihu Comment V5
 * GET /api/v1/zhihu/web/fetch_comment_v5
 * @param {string} answer_id - 必填参数
 */
async function fetchCommentV5(answer_id, extraParams = {}) {
  const params = { answer_id, ...extraParams };
  return request('/web/fetch_comment_v5', params);
}

/**
 * 获取知乎子评论区V5/Get Zhihu Sub Comment V5
 * GET /api/v1/zhihu/web/fetch_sub_comment_v5
 * @param {string} comment_id - 必填参数
 */
async function fetchSubCommentV5(comment_id, extraParams = {}) {
  const params = { comment_id, ...extraParams };
  return request('/web/fetch_sub_comment_v5', params);
}

/**
 * 获取知乎用户关注列表/Get Zhihu User Following
 * GET /api/v1/zhihu/web/fetch_user_followees
 * @param {string} user_url_token - 必填参数
 */
async function fetchUserFollowees(user_url_token, extraParams = {}) {
  const params = { user_url_token, ...extraParams };
  return request('/web/fetch_user_followees', params);
}

/**
 * 获取知乎用户粉丝列表/Get Zhihu User Followers
 * GET /api/v1/zhihu/web/fetch_user_followers
 * @param {string} user_url_token - 必填参数
 */
async function fetchUserFollowers(user_url_token, extraParams = {}) {
  const params = { user_url_token, ...extraParams };
  return request('/web/fetch_user_followers', params);
}

/**
 * 获取知乎用户订阅的专栏/Get Zhihu User Columns
 * GET /api/v1/zhihu/web/fetch_user_follow_columns
 * @param {string} user_url_token - 必填参数
 */
async function fetchUserFollowColumns(user_url_token, extraParams = {}) {
  const params = { user_url_token, ...extraParams };
  return request('/web/fetch_user_follow_columns', params);
}

/**
 * 获取知乎用户关注的问题/Get Zhihu User Follow Questi
 * GET /api/v1/zhihu/web/fetch_user_follow_questions
 * @param {string} user_url_token - 必填参数
 */
async function fetchUserFollowQuestions(user_url_token, extraParams = {}) {
  const params = { user_url_token, ...extraParams };
  return request('/web/fetch_user_follow_questions', params);
}

/**
 * 获取知乎用户关注的收藏/Get Zhihu User Follow Collec
 * GET /api/v1/zhihu/web/fetch_user_follow_collections
 * @param {string} user_url_token - 必填参数
 */
async function fetchUserFollowCollections(user_url_token, extraParams = {}) {
  const params = { user_url_token, ...extraParams };
  return request('/web/fetch_user_follow_collections', params);
}

/**
 * 获取知乎用户关注的话题/Get Zhihu User Follow Topics
 * GET /api/v1/zhihu/web/fetch_user_follow_topics
 * @param {string} user_url_token - 必填参数
 */
async function fetchUserFollowTopics(user_url_token, extraParams = {}) {
  const params = { user_url_token, ...extraParams };
  return request('/web/fetch_user_follow_topics', params);
}

/**
 * 获取知乎推荐关注列表/Get Zhihu Recommend Followees
 * GET /api/v1/zhihu/web/fetch_recommend_followees
 * 无必填参数
 */
async function fetchRecommendFollowees(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_recommend_followees', params);
}

// ==================== 搜 ====================

/**
 * 获取知乎文章搜索V3/Get Zhihu Article Search V3
 * GET /api/v1/zhihu/web/fetch_article_search_v3
 * @param {string} keyword - 必填参数
 */
async function fetchArticleSearchV3(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web/fetch_article_search_v3', params);
}

/**
 * 获取知乎用户搜索V3/Get Zhihu User Search V3
 * GET /api/v1/zhihu/web/fetch_user_search_v3
 * @param {string} keyword - 必填参数
 */
async function fetchUserSearchV3(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web/fetch_user_search_v3', params);
}

/**
 * 获取知乎话题搜索V3/Get Zhihu Topic Search V3
 * GET /api/v1/zhihu/web/fetch_topic_search_v3
 * @param {string} keyword - 必填参数
 */
async function fetchTopicSearchV3(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web/fetch_topic_search_v3', params);
}

/**
 * 获取知乎论文搜索V3/Get Zhihu Scholar Search V3
 * POST /api/v1/zhihu/web/fetch_scholar_search_v3
 * @param {string} keyword - 必填参数
 */
async function fetchScholarSearchV3(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web/fetch_scholar_search_v3', params, 'POST');
}

/**
 * 获取知乎AI搜索/Get Zhihu AI Search
 * GET /api/v1/zhihu/web/fetch_ai_search
 * @param {string} message_content - 必填参数
 */
async function fetchAiSearch(message_content, extraParams = {}) {
  const params = { message_content, ...extraParams };
  return request('/web/fetch_ai_search', params);
}

/**
 * 获取知乎AI搜索结果/Get Zhihu AI Search Result
 * GET /api/v1/zhihu/web/fetch_ai_search_result
 * @param {string} message_id - 必填参数
 */
async function fetchAiSearchResult(message_id, extraParams = {}) {
  const params = { message_id, ...extraParams };
  return request('/web/fetch_ai_search_result', params);
}

/**
 * 获取知乎视频搜索V3/Get Zhihu Video Search V3
 * GET /api/v1/zhihu/web/fetch_video_search_v3
 * @param {string} keyword - 必填参数
 */
async function fetchVideoSearchV3(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web/fetch_video_search_v3', params);
}

/**
 * 获取知乎专栏搜索V3/Get Zhihu Column Search V3
 * GET /api/v1/zhihu/web/fetch_column_search_v3
 * @param {string} keyword - 必填参数
 */
async function fetchColumnSearchV3(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web/fetch_column_search_v3', params);
}

/**
 * 获取知乎盐选内容搜索V3/Get Zhihu Salt Search V3
 * GET /api/v1/zhihu/web/fetch_salt_search_v3
 * @param {string} keyword - 必填参数
 */
async function fetchSaltSearchV3(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web/fetch_salt_search_v3', params);
}

/**
 * 获取知乎电子书搜索V3/Get Zhihu Ebook Search V3
 * GET /api/v1/zhihu/web/fetch_ebook_search_v3
 * @param {string} keyword - 必填参数
 */
async function fetchEbookSearchV3(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web/fetch_ebook_search_v3', params);
}

/**
 * 获取知乎搜索预设词/Get Zhihu Preset Search
 * GET /api/v1/zhihu/web/fetch_preset_search
 * 无必填参数
 */
async function fetchPresetSearch(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_preset_search', params);
}

/**
 * 获取知乎搜索发现/Get Zhihu Search Recommend
 * GET /api/v1/zhihu/web/fetch_search_recommend
 * 无必填参数
 */
async function fetchSearchRecommend(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/fetch_search_recommend', params);
}

/**
 * 知乎搜索预测词/Get Zhihu Search Suggest
 * GET /api/v1/zhihu/web/fetch_search_suggest
 * @param {string} keyword - 必填参数
 */
async function fetchSearchSuggest(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web/fetch_search_suggest', params);
}

module.exports = {
  request,
  fetchColumnArticles,
  fetchColumnArticleDetail,
  fetchColumnRecommend,
  fetchColumnRelationship,
  fetchHotRecommend,
  fetchHotList,
  fetchVideoList,
  fetchUserInfo,
  fetchUserArticles,
  fetchUserIncludedArticles,
  fetchQuestionAnswers,
  fetchColumnCommentConfig,
  fetchCommentV5,
  fetchSubCommentV5,
  fetchUserFollowees,
  fetchUserFollowers,
  fetchUserFollowColumns,
  fetchUserFollowQuestions,
  fetchUserFollowCollections,
  fetchUserFollowTopics,
  fetchRecommendFollowees,
  fetchArticleSearchV3,
  fetchUserSearchV3,
  fetchTopicSearchV3,
  fetchScholarSearchV3,
  fetchAiSearch,
  fetchAiSearchResult,
  fetchVideoSearchV3,
  fetchColumnSearchV3,
  fetchSaltSearchV3,
  fetchEbookSearchV3,
  fetchPresetSearch,
  fetchSearchRecommend,
  fetchSearchSuggest,
};
