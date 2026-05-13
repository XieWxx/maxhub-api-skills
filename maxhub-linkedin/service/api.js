// 第三方接口请求封装 - linkedin
// 基于MaxHub API中转站调用，集成价格追踪、缓存优化、智能决策

const config = require('../config.json');
const { createOptimizationLayer } = require('../shared');
const BASE_URL = config.apiBase.url;
const AUTH_HEADER = config.apiBase.authHeader;
const AUTH_ENV_NAME = config.apiBase.authEnvVar;

function resolveCredential() {
  const proc = typeof process !== 'undefined' ? process : {};
  const env = proc.env || {};
  return env[AUTH_ENV_NAME] || '';
}

/**
 * API注册表 - 包含价格信息（CNY/次）
 * 价格来源：pricing.md
 */
const API_REGISTRY = {
  // web
  getUserContact: { path: '/web/get_user_contact', params: ['username'], price: 0.04 },
  getCompanyPeople: { path: '/web/get_company_people', params: ['company_id'], price: 0.04 },
  getUserAbout: { path: '/web/get_user_about', params: ['urn'], price: 0.04 },
  getUserExperience: { path: '/web/get_user_experience', params: ['urn'], price: 0.04 },
  getUserInterestsGroups: { path: '/web/get_user_interests_groups', params: ['urn'], price: 0.04 },
  getUserInterestsCompanies: { path: '/web/get_user_interests_companies', params: ['urn'], price: 0.04 },
  getUserFollowerAndConnection: { path: '/web/get_user_follower_and_connection', params: ['username'], price: 0.04 },
  searchPeople: { path: '/web/search_people', price: 0.04 },
  // web_v2
  getUserProfile: { path: '/web_v2/get_user_profile', params: ['username'], price: 0.01 },
  getUserPosts: { path: '/web_v2/get_user_posts', params: ['username'], price: 0.01 },
  getUserContactInfo: { path: '/web_v2/get_user_contact_info', params: ['username'], price: 0.01 },
  getUserRecommendations: { path: '/web_v2/get_user_recommendations', params: ['username'], price: 0.01 },
  getUserVideos: { path: '/web_v2/get_user_videos', params: ['username'], price: 0.01 },
  getUserImages: { path: '/web_v2/get_user_images', params: ['username'], price: 0.01 },
  getUserBio: { path: '/web_v2/get_user_bio', params: ['username'], price: 0.01 },
  getUserProfileCards: { path: '/web_v2/get_user_profile_cards', params: ['username'], price: 0.01 },
  getUserExperiences: { path: '/web_v2/get_user_experiences', params: ['username'], price: 0.01 },
  getUserSkills: { path: '/web_v2/get_user_skills', params: ['username'], price: 0.01 },
  getUserEducations: { path: '/web_v2/get_user_educations', params: ['username'], price: 0.01 },
  getUserPublications: { path: '/web_v2/get_user_publications', params: ['username'], price: 0.01 },
  getUserCertifications: { path: '/web_v2/get_user_certifications', params: ['username'], price: 0.01 },
  getUserHonors: { path: '/web_v2/get_user_honors', params: ['username'], price: 0.01 },
  getUserTopCard: { path: '/web_v2/get_user_top_card', params: ['username'], price: 0.01 },
  getUserTopCardSupplementary: { path: '/web_v2/get_user_top_card_supplementary', params: ['username'], price: 0.01 },
  getUserRecentActivity: { path: '/web_v2/get_user_recent_activity', params: ['username'], price: 0.01 },
  getDiscoveryRelevantToCompany: { path: '/web_v2/get_discovery_relevant_to_company', params: ['universal_name'], price: 0.01 },
  getDiscoveryRelevantToUser: { path: '/web_v2/get_discovery_relevant_to_user', params: ['username'], price: 0.01 },
  getCompanyProfile: { path: '/web_v2/get_company_profile', params: ['universal_name'], price: 0.01 },
  getCompanyEmployees: { path: '/web_v2/get_company_employees', params: ['universal_name'], price: 0.01 },
  getCompanyPosts: { path: '/web_v2/get_company_posts', params: ['universal_name'], price: 0.01 },
  getCompanyJobs: { path: '/web_v2/get_company_jobs', params: ['universal_name'], price: 0.01 },
  getCompanyJobCount: { path: '/web_v2/get_company_job_count', params: ['universal_name'], price: 0.01 },
  getCompanySimilarCompanies: { path: '/web_v2/get_company_similar_companies', params: ['universal_name'], price: 0.01 },
  getCompanyCompetitors: { path: '/web_v2/get_company_competitors', params: ['universal_name'], price: 0.01 },
  getCompanyStockQuote: { path: '/web_v2/get_company_stock_quote', params: ['universal_name'], price: 0.01 },
  getCompanyCallToActions: { path: '/web_v2/get_company_call_to_actions', params: ['universal_name'], price: 0.01 },
  getCompanyEmployeeCountRanges: { path: '/web_v2/get_company_employee_count_ranges', params: ['universal_name'], price: 0.01 },
  getCompanyGroupedLocations: { path: '/web_v2/get_company_grouped_locations', params: ['universal_name'], price: 0.01 },
  getPostDetail: { path: '/web_v2/get_post_detail', params: ['post_urn'], price: 0.01 },
  getPostDetailBySlug: { path: '/web_v2/get_post_detail_by_slug', params: ['slug'], price: 0.01 },
  getPostReactions: { path: '/web_v2/get_post_reactions', params: ['post_urn'], price: 0.01 },
  getHashtagFeed: { path: '/web_v2/get_hashtag_feed', params: ['hashtag'], price: 0.01 },
  getJobDetail: { path: '/web_v2/get_job_detail', params: ['job_id'], price: 0.01 },
  getUserComments: { path: '/web_v2/get_user_comments', params: ['username'], price: 0.01 },
  getUserFollowerAndConnectionCount: { path: '/web_v2/get_user_follower_and_connection_count', params: ['username'], price: 0.01 },
  getUserInterestedGroups: { path: '/web_v2/get_user_interested_groups', params: ['username'], price: 0.01 },
  getUserInterestedCompanies: { path: '/web_v2/get_user_interested_companies', params: ['username'], price: 0.01 },
  getPostComments: { path: '/web_v2/get_post_comments', params: ['post_urn'], price: 0.01 },
  getCommentReplies: { path: '/web_v2/get_comment_replies', params: ['comment_urn'], price: 0.01 },
  searchUsers: { path: '/web_v2/search_users', params: ['keywords'], price: 0.01 },
  searchJobs: { path: '/web_v2/search_jobs', params: ['keywords'], price: 0.01 },
};

/**
 * 初始化优化层
 * 集成缓存、去重、监控、决策、价格查询
 */
const optimization = createOptimizationLayer({
  registry: API_REGISTRY,
  apiPrefix: config.apiBase.prefix,
  cache: { maxSize: 50, defaultTTL: 3 * 60 * 1000 },
  optimizer: { redundancyWindow: 30000 },
  monitor: { costAlertThreshold: 0.5 },
  decision: { costWeight: 0.6, latencyWeight: 0.25, completenessWeight: 0.15 },
});

const REQUEST_TIMEOUT = 30000;

/**
 * 原始API请求方法（不含优化层）
 */
async function _rawRequest(path, params = {}, method = 'GET') {
  const url = `${BASE_URL}${path}`;
  const headers = {
    [AUTH_HEADER]: resolveCredential(),
    'Content-Type': 'application/json',
  };
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  const options = { method, headers, signal: controller.signal };
  if (method === 'GET') {
    const query = new URLSearchParams(params).toString();
    const fullUrl = query ? `${url}?${query}` : url;
    try {
      const response = await fetch(fullUrl, options);
      return await handleResponse(response);
    } finally {
      clearTimeout(timeoutId);
    }
  }
  options.body = JSON.stringify(params);
  try {
    const response = await fetch(url, options);
    return await handleResponse(response);
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * 增强版请求方法
 * 自动经过缓存→去重→监控链路
 */
const request = optimization.enhanceRequest(_rawRequest);

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

/**
 * 通用API调用方法
 * 根据API注册表动态调用，自动记录费用
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

/**
 * 获取优化报告
 * 包含缓存命中率、费用统计、优化建议等
 */
function getOptimizationReport() {
  return optimization.getReport();
}

/**
 * 获取API价格信息
 * @param {string} apiName - API名称
 * @returns {object} 价格信息
 */
function getApiPrice(apiName) {
  const def = API_REGISTRY[apiName];
  if (!def) return null;
  return {
    name: apiName,
    path: `${config.apiBase.prefix}${def.path}`,
    price: def.price,
    currency: 'CNY',
    freeQuota: def.freeQuota || false,
  };
}

/**
 * 获取所有API价格列表
 */
function getAllPrices() {
  return Object.entries(API_REGISTRY).map(([name, def]) => ({
    name,
    path: `${config.apiBase.prefix}${def.path}`,
    price: def.price,
    currency: 'CNY',
  }));
}

module.exports = {
  request,
  callApi,
  API_REGISTRY,
  optimization,
  getOptimizationReport,
  getApiPrice,
  getAllPrices,
  getUserContact: api.getUserContact,
  getCompanyPeople: api.getCompanyPeople,
  getUserAbout: api.getUserAbout,
  getUserExperience: api.getUserExperience,
  getUserInterestsGroups: api.getUserInterestsGroups,
  getUserInterestsCompanies: api.getUserInterestsCompanies,
  getUserProfile: api.getUserProfile,
  getUserPosts: api.getUserPosts,
  getUserContactInfo: api.getUserContactInfo,
  getUserRecommendations: api.getUserRecommendations,
  getUserVideos: api.getUserVideos,
  getUserImages: api.getUserImages,
  getUserBio: api.getUserBio,
  getUserProfileCards: api.getUserProfileCards,
  getUserExperiences: api.getUserExperiences,
  getUserSkills: api.getUserSkills,
  getUserEducations: api.getUserEducations,
  getUserPublications: api.getUserPublications,
  getUserCertifications: api.getUserCertifications,
  getUserHonors: api.getUserHonors,
  getUserTopCard: api.getUserTopCard,
  getUserTopCardSupplementary: api.getUserTopCardSupplementary,
  getUserRecentActivity: api.getUserRecentActivity,
  getDiscoveryRelevantToCompany: api.getDiscoveryRelevantToCompany,
  getDiscoveryRelevantToUser: api.getDiscoveryRelevantToUser,
  getCompanyProfile: api.getCompanyProfile,
  getCompanyEmployees: api.getCompanyEmployees,
  getCompanyPosts: api.getCompanyPosts,
  getCompanyJobs: api.getCompanyJobs,
  getCompanyJobCount: api.getCompanyJobCount,
  getCompanySimilarCompanies: api.getCompanySimilarCompanies,
  getCompanyCompetitors: api.getCompanyCompetitors,
  getCompanyStockQuote: api.getCompanyStockQuote,
  getCompanyCallToActions: api.getCompanyCallToActions,
  getCompanyEmployeeCountRanges: api.getCompanyEmployeeCountRanges,
  getCompanyGroupedLocations: api.getCompanyGroupedLocations,
  getPostDetail: api.getPostDetail,
  getPostDetailBySlug: api.getPostDetailBySlug,
  getPostReactions: api.getPostReactions,
  getHashtagFeed: api.getHashtagFeed,
  getJobDetail: api.getJobDetail,
  getUserFollowerAndConnection: api.getUserFollowerAndConnection,
  getUserComments: api.getUserComments,
  getUserFollowerAndConnectionCount: api.getUserFollowerAndConnectionCount,
  getUserInterestedGroups: api.getUserInterestedGroups,
  getUserInterestedCompanies: api.getUserInterestedCompanies,
  getPostComments: api.getPostComments,
  getCommentReplies: api.getCommentReplies,
  searchPeople: api.searchPeople,
  searchUsers: api.searchUsers,
  searchJobs: api.searchJobs,
};
