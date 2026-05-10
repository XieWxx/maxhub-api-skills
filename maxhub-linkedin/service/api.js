// 第三方接口请求封装 - linkedin
// 基于MaxHub API中转站调用，包含所有API

const BASE_URL = process.env.MAXHUB_BASE_URL || 'https://www.aconfig.cn';
const API_KEY = process.env.MAXHUB_API_KEY;
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
 * 获取用户资料/Get user profile
 * GET /api/v1/linkedin/web/get_user_profile
 * @param {string} username - 必填参数
 */
async function getUserProfile(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/web/get_user_profile', params);
}

/**
 * 获取用户帖子/Get user posts
 * GET /api/v1/linkedin/web/get_user_posts
 * @param {string} urn - 必填参数
 */
async function getUserPosts(urn, extraParams = {}) {
  const params = { urn, ...extraParams };
  return request('/web/get_user_posts', params);
}

/**
 * 获取用户联系信息/Get user contact information
 * GET /api/v1/linkedin/web/get_user_contact
 * @param {string} username - 必填参数
 */
async function getUserContact(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/web/get_user_contact', params);
}

/**
 * 获取用户推荐信/Get user recommendations
 * GET /api/v1/linkedin/web/get_user_recommendations
 * @param {string} urn - 必填参数
 */
async function getUserRecommendations(urn, extraParams = {}) {
  const params = { urn, ...extraParams };
  return request('/web/get_user_recommendations', params);
}

/**
 * 获取用户视频/Get user videos
 * GET /api/v1/linkedin/web/get_user_videos
 * @param {string} urn - 必填参数
 */
async function getUserVideos(urn, extraParams = {}) {
  const params = { urn, ...extraParams };
  return request('/web/get_user_videos', params);
}

/**
 * 获取用户图片/Get user images
 * GET /api/v1/linkedin/web/get_user_images
 * @param {string} urn - 必填参数
 */
async function getUserImages(urn, extraParams = {}) {
  const params = { urn, ...extraParams };
  return request('/web/get_user_images', params);
}

/**
 * 获取公司资料/Get company profile
 * GET /api/v1/linkedin/web/get_company_profile
 * 无必填参数
 */
async function getCompanyProfile(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/get_company_profile', params);
}

/**
 * 获取公司员工/Get company people
 * GET /api/v1/linkedin/web/get_company_people
 * @param {string} company_id - 必填参数
 */
async function getCompanyPeople(company_id, extraParams = {}) {
  const params = { company_id, ...extraParams };
  return request('/web/get_company_people', params);
}

/**
 * 获取公司帖子/Get company posts
 * GET /api/v1/linkedin/web/get_company_posts
 * @param {string} company_id - 必填参数
 */
async function getCompanyPosts(company_id, extraParams = {}) {
  const params = { company_id, ...extraParams };
  return request('/web/get_company_posts', params);
}

/**
 * 获取公司职位/Get company jobs
 * GET /api/v1/linkedin/web/get_company_jobs
 * @param {string} company_id - 必填参数
 */
async function getCompanyJobs(company_id, extraParams = {}) {
  const params = { company_id, ...extraParams };
  return request('/web/get_company_jobs', params);
}

/**
 * 获取公司职位数量/Get company job count
 * GET /api/v1/linkedin/web/get_company_job_count
 * @param {string} company_id - 必填参数
 */
async function getCompanyJobCount(company_id, extraParams = {}) {
  const params = { company_id, ...extraParams };
  return request('/web/get_company_job_count', params);
}

/**
 * 获取用户简介/Get user about
 * GET /api/v1/linkedin/web/get_user_about
 * @param {string} urn - 必填参数
 */
async function getUserAbout(urn, extraParams = {}) {
  const params = { urn, ...extraParams };
  return request('/web/get_user_about', params);
}

/**
 * 获取用户工作经历/Get user experience
 * GET /api/v1/linkedin/web/get_user_experience
 * @param {string} urn - 必填参数
 */
async function getUserExperience(urn, extraParams = {}) {
  const params = { urn, ...extraParams };
  return request('/web/get_user_experience', params);
}

/**
 * 获取用户技能/Get user skills
 * GET /api/v1/linkedin/web/get_user_skills
 * @param {string} urn - 必填参数
 */
async function getUserSkills(urn, extraParams = {}) {
  const params = { urn, ...extraParams };
  return request('/web/get_user_skills', params);
}

/**
 * 获取用户教育背景/Get user educations
 * GET /api/v1/linkedin/web/get_user_educations
 * @param {string} urn - 必填参数
 */
async function getUserEducations(urn, extraParams = {}) {
  const params = { urn, ...extraParams };
  return request('/web/get_user_educations', params);
}

/**
 * 获取用户出版物/Get user publications
 * GET /api/v1/linkedin/web/get_user_publications
 * @param {string} urn - 必填参数
 */
async function getUserPublications(urn, extraParams = {}) {
  const params = { urn, ...extraParams };
  return request('/web/get_user_publications', params);
}

/**
 * 获取用户认证/Get user certifications
 * GET /api/v1/linkedin/web/get_user_certifications
 * @param {string} urn - 必填参数
 */
async function getUserCertifications(urn, extraParams = {}) {
  const params = { urn, ...extraParams };
  return request('/web/get_user_certifications', params);
}

/**
 * 获取用户荣誉奖项/Get user honors
 * GET /api/v1/linkedin/web/get_user_honors
 * @param {string} urn - 必填参数
 */
async function getUserHonors(urn, extraParams = {}) {
  const params = { urn, ...extraParams };
  return request('/web/get_user_honors', params);
}

/**
 * 获取用户感兴趣的群组/Get user interests groups
 * GET /api/v1/linkedin/web/get_user_interests_groups
 * @param {string} urn - 必填参数
 */
async function getUserInterestsGroups(urn, extraParams = {}) {
  const params = { urn, ...extraParams };
  return request('/web/get_user_interests_groups', params);
}

/**
 * 获取用户感兴趣的公司/Get user interests companies
 * GET /api/v1/linkedin/web/get_user_interests_companies
 * @param {string} urn - 必填参数
 */
async function getUserInterestsCompanies(urn, extraParams = {}) {
  const params = { urn, ...extraParams };
  return request('/web/get_user_interests_companies', params);
}

/**
 * 获取职位详情/Get job detail
 * GET /api/v1/linkedin/web/get_job_detail
 * @param {string} job_id - 必填参数
 */
async function getJobDetail(job_id, extraParams = {}) {
  const params = { job_id, ...extraParams };
  return request('/web/get_job_detail', params);
}

/**
 * 获取用户主页基础信息（可选附带子节）/Get user profile (opt
 * GET /api/v1/linkedin/web_v2/get_user_profile
 * @param {string} username - 必填参数
 */
async function getUserProfile(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/web_v2/get_user_profile', params);
}

/**
 * 获取用户帖子（动态标签）/Get user posts
 * GET /api/v1/linkedin/web_v2/get_user_posts
 * @param {string} username - 必填参数
 */
async function getUserPosts(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/web_v2/get_user_posts', params);
}

/**
 * 获取用户公开联系信息/Get contact info
 * GET /api/v1/linkedin/web_v2/get_user_contact_info
 * @param {string} username - 必填参数
 */
async function getUserContactInfo(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/web_v2/get_user_contact_info', params);
}

/**
 * 获取用户推荐信/Get recommendations
 * GET /api/v1/linkedin/web_v2/get_user_recommendations
 * @param {string} username - 必填参数
 */
async function getUserRecommendations(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/web_v2/get_user_recommendations', params);
}

/**
 * 获取用户视频帖子/Get user videos
 * GET /api/v1/linkedin/web_v2/get_user_videos
 * @param {string} username - 必填参数
 */
async function getUserVideos(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/web_v2/get_user_videos', params);
}

/**
 * 获取用户图片帖子/Get user images
 * GET /api/v1/linkedin/web_v2/get_user_images
 * @param {string} username - 必填参数
 */
async function getUserImages(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/web_v2/get_user_images', params);
}

/**
 * 获取用户简介摘要/Get user bio
 * GET /api/v1/linkedin/web_v2/get_user_bio
 * @param {string} username - 必填参数
 */
async function getUserBio(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/web_v2/get_user_bio', params);
}

/**
 * 获取用户主页全部卡片原始结构/Get full profile cards
 * GET /api/v1/linkedin/web_v2/get_user_profile_cards
 * @param {string} username - 必填参数
 */
async function getUserProfileCards(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/web_v2/get_user_profile_cards', params);
}

/**
 * 获取用户工作经历/Get experiences
 * GET /api/v1/linkedin/web_v2/get_user_experiences
 * @param {string} username - 必填参数
 */
async function getUserExperiences(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/web_v2/get_user_experiences', params);
}

/**
 * 获取用户技能/Get skills
 * GET /api/v1/linkedin/web_v2/get_user_skills
 * @param {string} username - 必填参数
 */
async function getUserSkills(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/web_v2/get_user_skills', params);
}

/**
 * 获取用户教育背景/Get educations
 * GET /api/v1/linkedin/web_v2/get_user_educations
 * @param {string} username - 必填参数
 */
async function getUserEducations(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/web_v2/get_user_educations', params);
}

/**
 * 获取用户出版物/Get publications
 * GET /api/v1/linkedin/web_v2/get_user_publications
 * @param {string} username - 必填参数
 */
async function getUserPublications(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/web_v2/get_user_publications', params);
}

/**
 * 获取用户认证/Get certifications
 * GET /api/v1/linkedin/web_v2/get_user_certifications
 * @param {string} username - 必填参数
 */
async function getUserCertifications(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/web_v2/get_user_certifications', params);
}

/**
 * 获取用户荣誉奖项/Get honors
 * GET /api/v1/linkedin/web_v2/get_user_honors
 * @param {string} username - 必填参数
 */
async function getUserHonors(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/web_v2/get_user_honors', params);
}

/**
 * 获取用户主页顶部卡片/Get profile top card
 * GET /api/v1/linkedin/web_v2/get_user_top_card
 * @param {string} username - 必填参数
 */
async function getUserTopCard(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/web_v2/get_user_top_card', params);
}

/**
 * 获取用户主页顶部卡片补充信息/Get top card supplementar
 * GET /api/v1/linkedin/web_v2/get_user_top_card_supplementary
 * @param {string} username - 必填参数
 */
async function getUserTopCardSupplementary(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/web_v2/get_user_top_card_supplementary', params);
}

/**
 * 获取用户近期动态聚合/Get recent activity summary
 * GET /api/v1/linkedin/web_v2/get_user_recent_activity
 * @param {string} username - 必填参数
 */
async function getUserRecentActivity(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/web_v2/get_user_recent_activity', params);
}

/**
 * 发现："基于公司 X"的相关推荐/Discovery relevant to c
 * GET /api/v1/linkedin/web_v2/get_discovery_relevant_to_company
 * @param {string} universal_name - 必填参数
 */
async function getDiscoveryRelevantToCompany(universal_name, extraParams = {}) {
  const params = { universal_name, ...extraParams };
  return request('/web_v2/get_discovery_relevant_to_company', params);
}

/**
 * 发现："基于用户 X"的相关推荐/Discovery relevant to u
 * GET /api/v1/linkedin/web_v2/get_discovery_relevant_to_user
 * @param {string} username - 必填参数
 */
async function getDiscoveryRelevantToUser(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/web_v2/get_discovery_relevant_to_user', params);
}

/**
 * 获取公司主页资料/Get company profile
 * GET /api/v1/linkedin/web_v2/get_company_profile
 * @param {string} universal_name - 必填参数
 */
async function getCompanyProfile(universal_name, extraParams = {}) {
  const params = { universal_name, ...extraParams };
  return request('/web_v2/get_company_profile', params);
}

/**
 * 获取公司员工列表/Get employees
 * GET /api/v1/linkedin/web_v2/get_company_employees
 * @param {string} universal_name - 必填参数
 */
async function getCompanyEmployees(universal_name, extraParams = {}) {
  const params = { universal_name, ...extraParams };
  return request('/web_v2/get_company_employees', params);
}

/**
 * 获取公司主页帖子流/Get company posts
 * GET /api/v1/linkedin/web_v2/get_company_posts
 * @param {string} universal_name - 必填参数
 */
async function getCompanyPosts(universal_name, extraParams = {}) {
  const params = { universal_name, ...extraParams };
  return request('/web_v2/get_company_posts', params);
}

/**
 * 获取公司在招职位列表/Get company jobs
 * GET /api/v1/linkedin/web_v2/get_company_jobs
 * @param {string} universal_name - 必填参数
 */
async function getCompanyJobs(universal_name, extraParams = {}) {
  const params = { universal_name, ...extraParams };
  return request('/web_v2/get_company_jobs', params);
}

/**
 * 获取公司在招职位总数/Get job count
 * GET /api/v1/linkedin/web_v2/get_company_job_count
 * @param {string} universal_name - 必填参数
 */
async function getCompanyJobCount(universal_name, extraParams = {}) {
  const params = { universal_name, ...extraParams };
  return request('/web_v2/get_company_job_count', params);
}

/**
 * 获取相似公司（People also viewed）/Get similar c
 * GET /api/v1/linkedin/web_v2/get_company_similar_companies
 * @param {string} universal_name - 必填参数
 */
async function getCompanySimilarCompanies(universal_name, extraParams = {}) {
  const params = { universal_name, ...extraParams };
  return request('/web_v2/get_company_similar_companies', params);
}

/**
 * 获取公司竞争对手/Get competitors
 * GET /api/v1/linkedin/web_v2/get_company_competitors
 * @param {string} universal_name - 必填参数
 */
async function getCompanyCompetitors(universal_name, extraParams = {}) {
  const params = { universal_name, ...extraParams };
  return request('/web_v2/get_company_competitors', params);
}

/**
 * 获取上市公司股价/Get stock quote
 * GET /api/v1/linkedin/web_v2/get_company_stock_quote
 * @param {string} universal_name - 必填参数
 */
async function getCompanyStockQuote(universal_name, extraParams = {}) {
  const params = { universal_name, ...extraParams };
  return request('/web_v2/get_company_stock_quote', params);
}

/**
 * 获取公司主页 CTA 按钮配置/Get CTA buttons
 * GET /api/v1/linkedin/web_v2/get_company_call_to_actions
 * @param {string} universal_name - 必填参数
 */
async function getCompanyCallToActions(universal_name, extraParams = {}) {
  const params = { universal_name, ...extraParams };
  return request('/web_v2/get_company_call_to_actions', params);
}

/**
 * 获取公司员工数量范围（各 segment）/Get employee count
 * GET /api/v1/linkedin/web_v2/get_company_employee_count_ranges
 * @param {string} universal_name - 必填参数
 */
async function getCompanyEmployeeCountRanges(universal_name, extraParams = {}) {
  const params = { universal_name, ...extraParams };
  return request('/web_v2/get_company_employee_count_ranges', params);
}

/**
 * 获取公司全部办公地点（按地理分组）/Get grouped locations
 * GET /api/v1/linkedin/web_v2/get_company_grouped_locations
 * @param {string} universal_name - 必填参数
 */
async function getCompanyGroupedLocations(universal_name, extraParams = {}) {
  const params = { universal_name, ...extraParams };
  return request('/web_v2/get_company_grouped_locations', params);
}

/**
 * 获取单条帖子详情（按 post URN）/Get post detail by
 * GET /api/v1/linkedin/web_v2/get_post_detail
 * @param {string} post_urn - 必填参数
 */
async function getPostDetail(post_urn, extraParams = {}) {
  const params = { post_urn, ...extraParams };
  return request('/web_v2/get_post_detail', params);
}

/**
 * 按 URL slug 获取帖子/Get post by URL slug
 * GET /api/v1/linkedin/web_v2/get_post_detail_by_slug
 * @param {string} slug - 必填参数
 */
async function getPostDetailBySlug(slug, extraParams = {}) {
  const params = { slug, ...extraParams };
  return request('/web_v2/get_post_detail_by_slug', params);
}

/**
 * 获取帖子点赞/反应人列表/Get post reactions
 * GET /api/v1/linkedin/web_v2/get_post_reactions
 * @param {string} post_urn - 必填参数
 */
async function getPostReactions(post_urn, extraParams = {}) {
  const params = { post_urn, ...extraParams };
  return request('/web_v2/get_post_reactions', params);
}

/**
 * 按 hashtag 获取话题动态流/Get hashtag feed
 * GET /api/v1/linkedin/web_v2/get_hashtag_feed
 * @param {string} hashtag - 必填参数
 */
async function getHashtagFeed(hashtag, extraParams = {}) {
  const params = { hashtag, ...extraParams };
  return request('/web_v2/get_hashtag_feed', params);
}

/**
 * 获取职位详情/Get job detail
 * GET /api/v1/linkedin/web_v2/get_job_detail
 * @param {string} job_id - 必填参数
 */
async function getJobDetail(job_id, extraParams = {}) {
  const params = { job_id, ...extraParams };
  return request('/web_v2/get_job_detail', params);
}

// ==================== 互 ====================

/**
 * 获取用户评论/Get user comments
 * GET /api/v1/linkedin/web/get_user_comments
 * @param {string} urn - 必填参数
 */
async function getUserComments(urn, extraParams = {}) {
  const params = { urn, ...extraParams };
  return request('/web/get_user_comments', params);
}

/**
 * 获取用户粉丝和连接数/Get user follower and connect
 * GET /api/v1/linkedin/web/get_user_follower_and_connection
 * @param {string} username - 必填参数
 */
async function getUserFollowerAndConnection(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/web/get_user_follower_and_connection', params);
}

/**
 * 获取用户评论（在他人帖子下的评论）/Get user comments
 * GET /api/v1/linkedin/web_v2/get_user_comments
 * @param {string} username - 必填参数
 */
async function getUserComments(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/web_v2/get_user_comments', params);
}

/**
 * 获取用户粉丝/连接数/Get follower & connection cou
 * GET /api/v1/linkedin/web_v2/get_user_follower_and_connection_count
 * @param {string} username - 必填参数
 */
async function getUserFollowerAndConnectionCount(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/web_v2/get_user_follower_and_connection_count', params);
}

/**
 * 获取用户关注的群组/Get followed groups
 * GET /api/v1/linkedin/web_v2/get_user_interested_groups
 * @param {string} username - 必填参数
 */
async function getUserInterestedGroups(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/web_v2/get_user_interested_groups', params);
}

/**
 * 获取用户关注的公司/Get followed companies
 * GET /api/v1/linkedin/web_v2/get_user_interested_companies
 * @param {string} username - 必填参数
 */
async function getUserInterestedCompanies(username, extraParams = {}) {
  const params = { username, ...extraParams };
  return request('/web_v2/get_user_interested_companies', params);
}

/**
 * 获取帖子顶层评论/Get post top-level comments
 * GET /api/v1/linkedin/web_v2/get_post_comments
 * @param {string} post_urn - 必填参数
 */
async function getPostComments(post_urn, extraParams = {}) {
  const params = { post_urn, ...extraParams };
  return request('/web_v2/get_post_comments', params);
}

/**
 * 获取评论的回复/Get comment replies
 * GET /api/v1/linkedin/web_v2/get_comment_replies
 * @param {string} comment_urn - 必填参数
 */
async function getCommentReplies(comment_urn, extraParams = {}) {
  const params = { comment_urn, ...extraParams };
  return request('/web_v2/get_comment_replies', params);
}

// ==================== 搜 ====================

/**
 * 搜索职位/Search jobs
 * GET /api/v1/linkedin/web/search_jobs
 * @param {string} keyword - 必填参数
 */
async function searchJobs(keyword, extraParams = {}) {
  const params = { keyword, ...extraParams };
  return request('/web/search_jobs', params);
}

/**
 * 搜索用户/Search people
 * GET /api/v1/linkedin/web/search_people
 * 无必填参数
 */
async function searchPeople(extraParams = {}) {
  const params = { ...extraParams };
  return request('/web/search_people', params);
}

/**
 * 搜索用户/Search users
 * GET /api/v1/linkedin/web_v2/search_users
 * @param {string} keywords - 必填参数
 */
async function searchUsers(keywords, extraParams = {}) {
  const params = { keywords, ...extraParams };
  return request('/web_v2/search_users', params);
}

/**
 * 搜索职位/Search jobs
 * GET /api/v1/linkedin/web_v2/search_jobs
 * @param {string} keywords - 必填参数
 */
async function searchJobs(keywords, extraParams = {}) {
  const params = { keywords, ...extraParams };
  return request('/web_v2/search_jobs', params);
}

module.exports = {
  request,
  getUserProfile,
  getUserPosts,
  getUserContact,
  getUserRecommendations,
  getUserVideos,
  getUserImages,
  getCompanyProfile,
  getCompanyPeople,
  getCompanyPosts,
  getCompanyJobs,
  getCompanyJobCount,
  getUserAbout,
  getUserExperience,
  getUserSkills,
  getUserEducations,
  getUserPublications,
  getUserCertifications,
  getUserHonors,
  getUserInterestsGroups,
  getUserInterestsCompanies,
  getJobDetail,
  getUserProfile,
  getUserPosts,
  getUserContactInfo,
  getUserRecommendations,
  getUserVideos,
  getUserImages,
  getUserBio,
  getUserProfileCards,
  getUserExperiences,
  getUserSkills,
  getUserEducations,
  getUserPublications,
  getUserCertifications,
  getUserHonors,
  getUserTopCard,
  getUserTopCardSupplementary,
  getUserRecentActivity,
  getDiscoveryRelevantToCompany,
  getDiscoveryRelevantToUser,
  getCompanyProfile,
  getCompanyEmployees,
  getCompanyPosts,
  getCompanyJobs,
  getCompanyJobCount,
  getCompanySimilarCompanies,
  getCompanyCompetitors,
  getCompanyStockQuote,
  getCompanyCallToActions,
  getCompanyEmployeeCountRanges,
  getCompanyGroupedLocations,
  getPostDetail,
  getPostDetailBySlug,
  getPostReactions,
  getHashtagFeed,
  getJobDetail,
  getUserComments,
  getUserFollowerAndConnection,
  getUserComments,
  getUserFollowerAndConnectionCount,
  getUserInterestedGroups,
  getUserInterestedCompanies,
  getPostComments,
  getCommentReplies,
  searchJobs,
  searchPeople,
  searchUsers,
  searchJobs,
};
