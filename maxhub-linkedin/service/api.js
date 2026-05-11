// 第三方接口请求封装 - linkedin
// 基于MaxHub API中转站调用，包含所有API

const config = require('../config.json');
const BASE_URL = config.apiBase.url;
const AUTH_HEADER = config.apiBase.authHeader;
const AUTH_ENV_NAME = config.apiBase.authEnvVar;
const PLATFORM = 'linkedin';

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
    [AUTH_HEADER]: process.env[AUTH_ENV_NAME],
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
  getUserContact: { path: '/web/get_user_contact', params: ['username'] },
  getCompanyPeople: { path: '/web/get_company_people', params: ['company_id'] },
  getUserAbout: { path: '/web/get_user_about', params: ['urn'] },
  getUserExperience: { path: '/web/get_user_experience', params: ['urn'] },
  getUserInterestsGroups: { path: '/web/get_user_interests_groups', params: ['urn'] },
  getUserInterestsCompanies: { path: '/web/get_user_interests_companies', params: ['urn'] },
  getUserFollowerAndConnection: { path: '/web/get_user_follower_and_connection', params: ['username'] },
  searchPeople: { path: '/web/search_people' },
  // web_v2
  getUserProfile: { path: '/web_v2/get_user_profile', params: ['username'] },
  getUserPosts: { path: '/web_v2/get_user_posts', params: ['username'] },
  getUserContactInfo: { path: '/web_v2/get_user_contact_info', params: ['username'] },
  getUserRecommendations: { path: '/web_v2/get_user_recommendations', params: ['username'] },
  getUserVideos: { path: '/web_v2/get_user_videos', params: ['username'] },
  getUserImages: { path: '/web_v2/get_user_images', params: ['username'] },
  getUserBio: { path: '/web_v2/get_user_bio', params: ['username'] },
  getUserProfileCards: { path: '/web_v2/get_user_profile_cards', params: ['username'] },
  getUserExperiences: { path: '/web_v2/get_user_experiences', params: ['username'] },
  getUserSkills: { path: '/web_v2/get_user_skills', params: ['username'] },
  getUserEducations: { path: '/web_v2/get_user_educations', params: ['username'] },
  getUserPublications: { path: '/web_v2/get_user_publications', params: ['username'] },
  getUserCertifications: { path: '/web_v2/get_user_certifications', params: ['username'] },
  getUserHonors: { path: '/web_v2/get_user_honors', params: ['username'] },
  getUserTopCard: { path: '/web_v2/get_user_top_card', params: ['username'] },
  getUserTopCardSupplementary: { path: '/web_v2/get_user_top_card_supplementary', params: ['username'] },
  getUserRecentActivity: { path: '/web_v2/get_user_recent_activity', params: ['username'] },
  getDiscoveryRelevantToCompany: { path: '/web_v2/get_discovery_relevant_to_company', params: ['universal_name'] },
  getDiscoveryRelevantToUser: { path: '/web_v2/get_discovery_relevant_to_user', params: ['username'] },
  getCompanyProfile: { path: '/web_v2/get_company_profile', params: ['universal_name'] },
  getCompanyEmployees: { path: '/web_v2/get_company_employees', params: ['universal_name'] },
  getCompanyPosts: { path: '/web_v2/get_company_posts', params: ['universal_name'] },
  getCompanyJobs: { path: '/web_v2/get_company_jobs', params: ['universal_name'] },
  getCompanyJobCount: { path: '/web_v2/get_company_job_count', params: ['universal_name'] },
  getCompanySimilarCompanies: { path: '/web_v2/get_company_similar_companies', params: ['universal_name'] },
  getCompanyCompetitors: { path: '/web_v2/get_company_competitors', params: ['universal_name'] },
  getCompanyStockQuote: { path: '/web_v2/get_company_stock_quote', params: ['universal_name'] },
  getCompanyCallToActions: { path: '/web_v2/get_company_call_to_actions', params: ['universal_name'] },
  getCompanyEmployeeCountRanges: { path: '/web_v2/get_company_employee_count_ranges', params: ['universal_name'] },
  getCompanyGroupedLocations: { path: '/web_v2/get_company_grouped_locations', params: ['universal_name'] },
  getPostDetail: { path: '/web_v2/get_post_detail', params: ['post_urn'] },
  getPostDetailBySlug: { path: '/web_v2/get_post_detail_by_slug', params: ['slug'] },
  getPostReactions: { path: '/web_v2/get_post_reactions', params: ['post_urn'] },
  getHashtagFeed: { path: '/web_v2/get_hashtag_feed', params: ['hashtag'] },
  getJobDetail: { path: '/web_v2/get_job_detail', params: ['job_id'] },
  getUserComments: { path: '/web_v2/get_user_comments', params: ['username'] },
  getUserFollowerAndConnectionCount: { path: '/web_v2/get_user_follower_and_connection_count', params: ['username'] },
  getUserInterestedGroups: { path: '/web_v2/get_user_interested_groups', params: ['username'] },
  getUserInterestedCompanies: { path: '/web_v2/get_user_interested_companies', params: ['username'] },
  getPostComments: { path: '/web_v2/get_post_comments', params: ['post_urn'] },
  getCommentReplies: { path: '/web_v2/get_comment_replies', params: ['comment_urn'] },
  searchUsers: { path: '/web_v2/search_users', params: ['keywords'] },
  searchJobs: { path: '/web_v2/search_jobs', params: ['keywords'] },
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
