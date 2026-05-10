// 第三方接口请求封装 - zhihu
// 基于MaxHub API中转站调用，包含所有API

const DEFAULT_BASE_URL = 'https://www.aconfig.cn';
const ENV_KEY_URL = 'MAXHUB_BASE_URL';
const ENV_KEY_API = 'MAXHUB_API_KEY';

function getEnvVar(key) {
  return process.env[key];
}

function getBaseUrl() {
  const envUrl = getEnvVar(ENV_KEY_URL);
  return envUrl || DEFAULT_BASE_URL;
}

function getApiKey() {
  return getEnvVar(ENV_KEY_API);
}

const BASE_URL = getBaseUrl();
const API_KEY = getApiKey();
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

const API_REGISTRY = {
  // web
  fetchColumnArticles: { path: '/web/fetch_column_articles', params: ['column_id'] },
  fetchColumnArticleDetail: { path: '/web/fetch_column_article_detail', params: ['article_id'] },
  fetchColumnRecommend: { path: '/web/fetch_column_recommend', params: ['article_id'] },
  fetchColumnRelationship: { path: '/web/fetch_column_relationship', params: ['article_id'] },
  fetchHotRecommend: { path: '/web/fetch_hot_recommend' },
  fetchHotList: { path: '/web/fetch_hot_list' },
  fetchVideoList: { path: '/web/fetch_video_list' },
  fetchUserInfo: { path: '/web/fetch_user_info', params: ['user_url_token'] },
  fetchUserArticles: { path: '/web/fetch_user_articles', params: ['user_url_token'] },
  fetchUserIncludedArticles: { path: '/web/fetch_user_included_articles', params: ['user_url_token'] },
  fetchQuestionAnswers: { path: '/web/fetch_question_answers', params: ['question_id'] },
  fetchColumnCommentConfig: { path: '/web/fetch_column_comment_config', params: ['article_id'] },
  fetchCommentV5: { path: '/web/fetch_comment_v5', params: ['answer_id'] },
  fetchSubCommentV5: { path: '/web/fetch_sub_comment_v5', params: ['comment_id'] },
  fetchUserFollowees: { path: '/web/fetch_user_followees', params: ['user_url_token'] },
  fetchUserFollowers: { path: '/web/fetch_user_followers', params: ['user_url_token'] },
  fetchUserFollowColumns: { path: '/web/fetch_user_follow_columns', params: ['user_url_token'] },
  fetchUserFollowQuestions: { path: '/web/fetch_user_follow_questions', params: ['user_url_token'] },
  fetchUserFollowCollections: { path: '/web/fetch_user_follow_collections', params: ['user_url_token'] },
  fetchUserFollowTopics: { path: '/web/fetch_user_follow_topics', params: ['user_url_token'] },
  fetchRecommendFollowees: { path: '/web/fetch_recommend_followees' },
  fetchArticleSearchV3: { path: '/web/fetch_article_search_v3', params: ['keyword'] },
  fetchUserSearchV3: { path: '/web/fetch_user_search_v3', params: ['keyword'] },
  fetchTopicSearchV3: { path: '/web/fetch_topic_search_v3', params: ['keyword'] },
  fetchScholarSearchV3: { path: '/web/fetch_scholar_search_v3', params: ['keyword'], method: 'POST' },
  fetchAiSearch: { path: '/web/fetch_ai_search', params: ['message_content'] },
  fetchAiSearchResult: { path: '/web/fetch_ai_search_result', params: ['message_id'] },
  fetchVideoSearchV3: { path: '/web/fetch_video_search_v3', params: ['keyword'] },
  fetchColumnSearchV3: { path: '/web/fetch_column_search_v3', params: ['keyword'] },
  fetchSaltSearchV3: { path: '/web/fetch_salt_search_v3', params: ['keyword'] },
  fetchEbookSearchV3: { path: '/web/fetch_ebook_search_v3', params: ['keyword'] },
  fetchPresetSearch: { path: '/web/fetch_preset_search' },
  fetchSearchRecommend: { path: '/web/fetch_search_recommend' },
  fetchSearchSuggest: { path: '/web/fetch_search_suggest', params: ['keyword'] },
};

/**
 * 通用API调用方法
 * 根据API注册表动态调用，替代重复的函数定义
 * @param {string} apiName - 注册表中的API名称
 * @param {object} params - 请求参数
 * @returns {Promise<object>} API响应数据
 */
async function callApi(apiName, params = {}) {
  const def = API_REGISTRY[apiName];
  if (!def) throw new Error(`未知的API: ${apiName}`);
  const reqParams = {};
  if (def.params) {
    for (const key of def.params) {
      if (params[key] !== undefined) reqParams[key] = params[key];
    }
  }
  Object.assign(reqParams, params);
  return request(def.path, reqParams, def.method || 'GET');
}

/**
 * 批量生成API调用函数
 * 从注册表自动生成所有API的便捷调用方法
 */
const api = {};
for (const [name, def] of Object.entries(API_REGISTRY)) {
  api[name] = async (...args) => {
    const params = {};
    if (def.params) {
      for (let i = 0; i < def.params.length; i++) {
        if (args[i] !== undefined) params[def.params[i]] = args[i];
      }
    }
    if (args.length > 0 && typeof args[args.length - 1] === 'object' && !Array.isArray(args[args.length - 1])) {
      Object.assign(params, args[args.length - 1]);
    }
    return request(def.path, params, def.method || 'GET');
  };
}
module.exports = {
  request,
  callApi,
  API_REGISTRY,
  fetchColumnArticles: api.fetchColumnArticles,
  fetchColumnArticleDetail: api.fetchColumnArticleDetail,
  fetchColumnRecommend: api.fetchColumnRecommend,
  fetchColumnRelationship: api.fetchColumnRelationship,
  fetchHotRecommend: api.fetchHotRecommend,
  fetchHotList: api.fetchHotList,
  fetchVideoList: api.fetchVideoList,
  fetchUserInfo: api.fetchUserInfo,
  fetchUserArticles: api.fetchUserArticles,
  fetchUserIncludedArticles: api.fetchUserIncludedArticles,
  fetchQuestionAnswers: api.fetchQuestionAnswers,
  fetchColumnCommentConfig: api.fetchColumnCommentConfig,
  fetchCommentV5: api.fetchCommentV5,
  fetchSubCommentV5: api.fetchSubCommentV5,
  fetchUserFollowees: api.fetchUserFollowees,
  fetchUserFollowers: api.fetchUserFollowers,
  fetchUserFollowColumns: api.fetchUserFollowColumns,
  fetchUserFollowQuestions: api.fetchUserFollowQuestions,
  fetchUserFollowCollections: api.fetchUserFollowCollections,
  fetchUserFollowTopics: api.fetchUserFollowTopics,
  fetchRecommendFollowees: api.fetchRecommendFollowees,
  fetchArticleSearchV3: api.fetchArticleSearchV3,
  fetchUserSearchV3: api.fetchUserSearchV3,
  fetchTopicSearchV3: api.fetchTopicSearchV3,
  fetchScholarSearchV3: api.fetchScholarSearchV3,
  fetchAiSearch: api.fetchAiSearch,
  fetchAiSearchResult: api.fetchAiSearchResult,
  fetchVideoSearchV3: api.fetchVideoSearchV3,
  fetchColumnSearchV3: api.fetchColumnSearchV3,
  fetchSaltSearchV3: api.fetchSaltSearchV3,
  fetchEbookSearchV3: api.fetchEbookSearchV3,
  fetchPresetSearch: api.fetchPresetSearch,
  fetchSearchRecommend: api.fetchSearchRecommend,
  fetchSearchSuggest: api.fetchSearchSuggest,
};
