#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..');

// skill显示名称映射
const DISPLAY_NAMES = {
  'maxhub-douyin': '抖音数据采集与分析',
  'maxhub-bilibili': 'B站数据采集与分析',
  'maxhub-xiaohongshu': '小红书数据采集与分析',
  'maxhub-weibo': '微博数据采集与分析',
  'maxhub-tiktok': 'TikTok数据采集与分析',
  'maxhub-youtube': 'YouTube数据采集与分析',
  'maxhub-instagram': 'Instagram数据采集与分析',
  'maxhub-twitter': 'Twitter/X数据采集与分析',
  'maxhub-linkedin': 'LinkedIn数据采集与分析',
  'maxhub-reddit': 'Reddit数据采集与分析',
  'maxhub-threads': 'Threads数据采集与分析',
  'maxhub-wechat': '微信数据采集与分析',
  'maxhub-zhihu': '知乎数据采集与分析',
  'maxhub-kuaishou': '快手数据采集与分析',
  'maxhub-toutiao': '头条数据采集与分析',
  'maxhub-xigua': '西瓜视频数据采集与分析',
  'maxhub-pipixia': '皮皮虾数据采集与分析',
  'maxhub-lemon8': 'Lemon8数据采集与分析',
  'maxhub-sora2': 'Sora2内容浏览与分析',
  'maxhub-temp-mail': '临时邮箱服务',
  'maxhub-hybrid': '混合解析服务',
};

// skill emoji映射
const EMOJIS = {
  'maxhub-douyin': '🎵',
  'maxhub-bilibili': '📺',
  'maxhub-xiaohongshu': '📕',
  'maxhub-weibo': '🔥',
  'maxhub-tiktok': '🎬',
  'maxhub-youtube': '▶️',
  'maxhub-instagram': '📸',
  'maxhub-twitter': '🐦',
  'maxhub-linkedin': '💼',
  'maxhub-reddit': '🤖',
  'maxhub-threads': '🧵',
  'maxhub-wechat': '💬',
  'maxhub-zhihu': '💡',
  'maxhub-kuaishou': '📹',
  'maxhub-toutiao': '📰',
  'maxhub-xigua': '🍉',
  'maxhub-pipixia': '🦐',
  'maxhub-lemon8': '🍋',
  'maxhub-sora2': '🎥',
  'maxhub-temp-mail': '📧',
  'maxhub-hybrid': '🔄',
};

// 平台特有术语映射
const PLATFORM_TERMS = {
  'maxhub-douyin': { user: '博主/达人', post: '作品/视频', comment: '评论', topic: '话题/挑战', live: '直播', search: '搜索' },
  'maxhub-bilibili': { user: 'UP主', post: '视频/投稿', comment: '评论/弹幕', topic: '话题', live: '直播', search: '搜索' },
  'maxhub-xiaohongshu': { user: '博主/达人', post: '笔记', comment: '评论', topic: '话题', live: '直播', search: '搜索' },
  'maxhub-weibo': { user: '博主/大V', post: '微博', comment: '评论', topic: '热搜/话题', live: '直播', search: '搜索' },
  'maxhub-tiktok': { user: 'Creator', post: 'Post/Video', comment: 'Comment', topic: 'Hashtag', live: 'Live', search: 'Search' },
  'maxhub-youtube': { user: 'Channel/Creator', post: 'Video', comment: 'Comment', topic: 'Topic', live: 'Live', search: 'Search' },
  'maxhub-instagram': { user: 'User/Profile', post: 'Post/Reel', comment: 'Comment', topic: 'Hashtag', live: 'Live', search: 'Search' },
  'maxhub-twitter': { user: 'User', post: 'Tweet', comment: 'Reply', topic: 'Trending', live: 'Spaces', search: 'Search' },
  'maxhub-linkedin': { user: 'Professional/Company', post: 'Post', comment: 'Comment', topic: 'Hashtag', live: '', search: 'Search' },
  'maxhub-reddit': { user: 'Redditor', post: 'Post', comment: 'Comment', topic: 'Subreddit', live: '', search: 'Search' },
  'maxhub-threads': { user: 'User', post: 'Post', comment: 'Reply', topic: '', live: '', search: 'Search' },
  'maxhub-wechat': { user: '公众号/视频号', post: '文章/视频', comment: '评论', topic: '话题', live: '直播', search: '搜索' },
  'maxhub-zhihu': { user: '答主/作者', post: '回答/文章', comment: '评论', topic: '话题/专栏', live: '', search: '搜索' },
  'maxhub-kuaishou': { user: '主播/达人', post: '作品/视频', comment: '评论', topic: '话题', live: '直播', search: '搜索' },
  'maxhub-toutiao': { user: '作者', post: '文章/视频', comment: '评论', topic: '话题', live: '', search: '搜索' },
  'maxhub-xigua': { user: '创作者', post: '视频', comment: '评论', topic: '', live: '', search: '搜索' },
  'maxhub-pipixia': { user: '用户', post: '作品', comment: '评论', topic: '话题', live: '', search: '搜索' },
  'maxhub-lemon8': { user: 'Creator', post: 'Post', comment: 'Comment', topic: 'Topic', live: '', search: 'Search' },
  'maxhub-sora2': { user: 'Creator', post: 'Post/Video', comment: 'Comment', topic: 'Cameo', live: '', search: 'Search' },
  'maxhub-temp-mail': { user: '', post: '邮件', comment: '', topic: '', live: '', search: '' },
  'maxhub-hybrid': { user: '', post: '视频', comment: '', topic: '', live: '', search: '' },
};

// 解析api-catalog.md
function parseApiCatalog(catalogPath) {
  const content = fs.readFileSync(catalogPath, 'utf-8');
  const apis = [];
  let currentCategory = '';
  let totalApiCount = 0;

  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 匹配分类标题
    const catMatch = line.match(/^##\s+(.+?)（(\d+)个API）/);
    if (catMatch) {
      currentCategory = catMatch[1];
      continue;
    }
    // 也匹配没有中文括号的分类
    const catMatch2 = line.match(/^##\s+(.+)/);
    if (catMatch2 && !line.includes('个API') && !line.includes('API完整目录') && !line.includes('共')) {
      currentCategory = catMatch2[1];
      continue;
    }

    // 匹配API表格行
    const tableMatch = line.match(/^\|\s*(\d+)\s*\|\s*(.+?)\s*\|\s*(GET|POST)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|/);
    if (tableMatch) {
      const name = tableMatch[2].replace(/\*\*/g, '').replace(/`/g, '').trim();
      const method = tableMatch[3];
      const apiPath = tableMatch[4].replace(/`/g, '').trim();
      const requiredParams = tableMatch[5].replace(/`/g, '').trim();

      // 提取短路径（去掉 /api/v1/platform/ 前缀）
      const pathParts = apiPath.replace('/api/v1/', '').split('/');
      const platformPrefix = pathParts[0]; // e.g., douyin, bilibili
      const shortPath = pathParts.slice(1).join('/'); // e.g., web/fetch_one_video

      // 提取中文名
      const cnName = name.split('/')[0].trim();

      // 判断API功能类型
      const funcType = detectApiFunction(shortPath, cnName, currentCategory);

      apis.push({
        name: cnName,
        method,
        fullPath: apiPath,
        shortPath,
        platformPrefix,
        requiredParams,
        category: currentCategory,
        funcType,
      });
      totalApiCount++;
    }
  }

  return { apis, totalApiCount };
}

// 检测API功能类型
function detectApiFunction(shortPath, cnName, category) {
  const p = shortPath.toLowerCase();
  const n = cnName.toLowerCase();

  // 热搜/趋势/榜单类（必须在搜索检测之前）
  if ((p.includes('hot_search') || p.includes('hot_list') || p.includes('trending') || p.includes('rank') || p.includes('billboard') || p.includes('chart') || n.includes('热搜') || n.includes('热榜') || n.includes('榜单') || n.includes('趋势') || n.includes('排行')) && !p.includes('live_gift') && !p.includes('live_rank')) {
    return 'trending';
  }

  // 搜索类
  if (p.includes('search') || n.includes('搜索') || p.includes('suggest') || n.includes('联想') || n.includes('推荐词')) {
    if (p.includes('user') || n.includes('用户搜索')) return 'search_user';
    if (p.includes('video') || p.includes('post') || n.includes('视频搜索') || n.includes('笔记搜索')) return 'search_content';
    if (p.includes('live') || n.includes('直播搜索')) return 'search_live';
    if (p.includes('hashtag') || p.includes('topic') || p.includes('challenge') || n.includes('话题搜索')) return 'search_topic';
    if (p.includes('music') || n.includes('音乐搜索')) return 'search_music';
    if (p.includes('product') || n.includes('商品搜索')) return 'search_product';
    if (p.includes('image') || n.includes('图片搜索') || n.includes('图像')) return 'search_image';
    return 'search_general';
  }

  // 用户详情类
  if ((p.includes('user') && (p.includes('profile') || p.includes('info'))) || n.includes('用户信息') || n.includes('用户资料') || n.includes('用户的信息') || n.includes('个人信息')) {
    if (p.includes('post') || p.includes('video') || p.includes('note') || p.includes('article')) return 'user_content_list';
    return 'user_detail';
  }

  // 用户内容列表类
  if ((p.includes('user') && (p.includes('post') || p.includes('video') || p.includes('note') || p.includes('article'))) || n.includes('用户') && (n.includes('作品') || n.includes('笔记') || n.includes('视频') || n.includes('帖子'))) {
    return 'user_content_list';
  }

  // 内容详情类
  if ((p.includes('one_video') || p.includes('post_detail') || p.includes('note_detail') || p.includes('video_detail') || p.includes('article_detail') || p.includes('status_detail') || p.includes('article_info') || p.includes('video_info')) || n.includes('单个作品') || n.includes('笔记详情') || n.includes('视频详情') || n.includes('帖子详情') || n.includes('微博详情') || n.includes('文章详情') || n.includes('文章的信息') || n.includes('视频的信息')) {
    return 'content_detail';
  }

  // 评论类
  if (p.includes('comment') || n.includes('评论')) {
    if (p.includes('reply') || p.includes('sub_comment') || n.includes('回复') || n.includes('子评论') || n.includes('二级评论')) return 'comment_reply';
    return 'comment_list';
  }

  // 直播类
  if (p.includes('live') || n.includes('直播')) {
    if (p.includes('search')) return 'search_live';
    return 'live_detail';
  }

  // 话题/标签详情类
  if ((p.includes('hashtag') || p.includes('topic') || p.includes('challenge') || p.includes('tag')) && (p.includes('detail') || p.includes('info'))) {
    return 'topic_detail';
  }

  // 话题内容列表类
  if ((p.includes('hashtag') || p.includes('topic') || p.includes('challenge') || p.includes('tag')) && (p.includes('post') || p.includes('video') || p.includes('list') || p.includes('feed'))) {
    return 'topic_content_list';
  }

  // 音乐详情类
  if (p.includes('music') && (p.includes('detail') || p.includes('info'))) {
    return 'music_detail';
  }

  // 商品详情类
  if (p.includes('product') && (p.includes('detail') || p.includes('info'))) {
    return 'product_detail';
  }

  // 粉丝/关注列表类
  if (p.includes('follower') || p.includes('fan') || n.includes('粉丝')) return 'follower_list';
  if (p.includes('following') || p.includes('follow') || n.includes('关注列表')) return 'following_list';

  // 临时邮箱类（必须在tool检测之前）
  if (p.includes('temp_email') || p.includes('get_temp_email') || n.includes('临时邮箱') || n.includes('get temp email')) return 'email_create';
  if ((p.includes('inbox') || p.includes('emails')) && !p.includes('by_id')) return 'email_list';
  if (p.includes('email_by_id') || p.includes('email_detail') || (p.includes('get_email') && p.includes('by_id'))) return 'email_detail';

  // 混合解析类（必须在tool检测之前）
  if (p.includes('video_data') || p.includes('hybrid')) return 'hybrid_parse';

  // ID提取/转换类
  if (p.includes('get_') || p.includes('extract') || p.includes('convert') || p.includes('shorten') || n.includes('提取') || n.includes('转换') || n.includes('生成')) {
    return 'tool';
  }

  // 首页推荐类
  if (p.includes('home') || p.includes('feed') || p.includes('recommend') || p.includes('popular') || n.includes('推荐') || n.includes('首页')) {
    return 'feed';
  }

  // 分析类
  if (p.includes('analytic') || p.includes('statistic') || p.includes('metric') || p.includes('overview') || n.includes('分析') || n.includes('统计') || n.includes('概览')) {
    return 'analytics';
  }

  return 'other';
}

// 分析skill的API能力
function analyzeCapabilities(apis) {
  const caps = {
    hasSearch: false,
    hasSearchUser: false,
    hasSearchContent: false,
    hasSearchLive: false,
    hasSearchTopic: false,
    hasUserDetail: false,
    hasUserContentList: false,
    hasContentDetail: false,
    hasCommentList: false,
    hasCommentReply: false,
    hasTrending: false,
    hasLive: false,
    hasTopicDetail: false,
    hasTopicContentList: false,
    hasMusicDetail: false,
    hasProductDetail: false,
    hasFollowerList: false,
    hasFollowingList: false,
    hasFeed: false,
    hasTool: false,
    hasAnalytics: false,
    hasEmailCreate: false,
    hasEmailList: false,
    hasEmailDetail: false,
    hasHybridParse: false,
    searchApis: [],
    userDetailApis: [],
    userContentApis: [],
    contentDetailApis: [],
    commentApis: [],
    commentReplyApis: [],
    trendingApis: [],
    liveApis: [],
    topicDetailApis: [],
    topicContentApis: [],
    followerApis: [],
    followingApis: [],
    feedApis: [],
    toolApis: [],
    analyticsApis: [],
    emailCreateApis: [],
    emailListApis: [],
    emailDetailApis: [],
    hybridParseApis: [],
  };

  for (const api of apis) {
    switch (api.funcType) {
      case 'search_general': case 'search_content':
        caps.hasSearch = true; caps.hasSearchContent = true; caps.searchApis.push(api); break;
      case 'search_user':
        caps.hasSearch = true; caps.hasSearchUser = true; caps.searchApis.push(api); break;
      case 'search_live':
        caps.hasSearch = true; caps.hasSearchLive = true; caps.searchApis.push(api); break;
      case 'search_topic':
        caps.hasSearch = true; caps.hasSearchTopic = true; caps.searchApis.push(api); break;
      case 'search_music': case 'search_product': case 'search_image':
        caps.hasSearch = true; caps.searchApis.push(api); break;
      case 'user_detail':
        caps.hasUserDetail = true; caps.userDetailApis.push(api); break;
      case 'user_content_list':
        caps.hasUserContentList = true; caps.userContentApis.push(api); break;
      case 'content_detail':
        caps.hasContentDetail = true; caps.contentDetailApis.push(api); break;
      case 'comment_list':
        caps.hasCommentList = true; caps.commentApis.push(api); break;
      case 'comment_reply':
        caps.hasCommentReply = true; caps.commentReplyApis.push(api); break;
      case 'trending':
        caps.hasTrending = true; caps.trendingApis.push(api); break;
      case 'live_detail':
        caps.hasLive = true; caps.liveApis.push(api); break;
      case 'topic_detail':
        caps.hasTopicDetail = true; caps.topicDetailApis.push(api); break;
      case 'topic_content_list':
        caps.hasTopicContentList = true; caps.topicContentApis.push(api); break;
      case 'music_detail':
        caps.hasMusicDetail = true; break;
      case 'product_detail':
        caps.hasProductDetail = true; break;
      case 'follower_list':
        caps.hasFollowerList = true; caps.followerApis.push(api); break;
      case 'following_list':
        caps.hasFollowingList = true; caps.followingApis.push(api); break;
      case 'feed':
        caps.hasFeed = true; caps.feedApis.push(api); break;
      case 'tool':
        caps.hasTool = true; caps.toolApis.push(api); break;
      case 'analytics':
        caps.hasAnalytics = true; caps.analyticsApis.push(api); break;
      case 'email_create':
        caps.hasEmailCreate = true; caps.emailCreateApis.push(api); break;
      case 'email_list':
        caps.hasEmailList = true; caps.emailListApis.push(api); break;
      case 'email_detail':
        caps.hasEmailDetail = true; caps.emailDetailApis.push(api); break;
      case 'hybrid_parse':
        caps.hasHybridParse = true; caps.hybridParseApis.push(api); break;
    }
  }

  return caps;
}

// 获取API的短路径显示名
function apiDisplay(api) {
  return api.shortPath;
}

// 获取API的必填参数显示
function apiParamsDisplay(api) {
  const p = api.requiredParams;
  if (p === '-' || p === '' || p === '无') return '无必填参数';
  return p;
}

// 生成链式调用模式
function generateChainPatterns(skillName, displayName, caps, apis, terms) {
  const patterns = [];

  // 模式：搜索→内容详情
  if (caps.hasSearchContent && caps.hasContentDetail) {
    const searchApi = caps.searchApis.find(a => a.funcType === 'search_content') || caps.searchApis[0];
    const detailApi = caps.contentDetailApis[0];
    patterns.push({
      name: `搜索→${terms.post}详情`,
      trigger: `用户搜索某个主题/关键词后想看具体${terms.post}内容`,
      steps: [
        { api: apiDisplay(searchApi), desc: `搜索关键词获取${terms.post}列表和ID`, params: apiParamsDisplay(searchApi) },
        { api: apiDisplay(detailApi), desc: `用${terms.post}ID获取完整详情`, params: `ID（从上一步获取）` },
      ],
      example: {
        input: `搜索关于xxx的${terms.post}`,
        steps: [
          `${apiDisplay(searchApi)}?keyword=xxx`,
          `${apiDisplay(detailApi)}?id=<Step1返回的ID>`,
        ],
      },
    });
  }

  // 模式：搜索用户→用户详情→用户内容
  if (caps.hasSearchUser && caps.hasUserDetail && caps.hasUserContentList) {
    const searchApi = caps.searchApis.find(a => a.funcType === 'search_user') || caps.searchApis[0];
    const userApi = caps.userDetailApis[0];
    const contentApi = caps.userContentApis[0];
    patterns.push({
      name: `${terms.user}查找→${terms.user}详情→${terms.post}列表`,
      trigger: `用户想了解某个${terms.user}`,
      steps: [
        { api: apiDisplay(searchApi), desc: `搜索${terms.user}名获取ID`, params: apiParamsDisplay(searchApi) },
        { api: apiDisplay(userApi), desc: `获取${terms.user}完整资料`, params: `用户ID（从上一步获取）` },
        { api: apiDisplay(contentApi), desc: `获取${terms.user}${terms.post}列表`, params: `用户ID` },
      ],
      example: {
        input: `分析${terms.user}@某某某的数据`,
        steps: [
          `${apiDisplay(searchApi)}?keyword=某某某`,
          `${apiDisplay(userApi)}?id=<Step1返回>`,
          `${apiDisplay(contentApi)}?id=<同上>`,
        ],
      },
    });
  } else if (caps.hasSearchUser && caps.hasUserDetail) {
    const searchApi = caps.searchApis.find(a => a.funcType === 'search_user') || caps.searchApis[0];
    const userApi = caps.userDetailApis[0];
    patterns.push({
      name: `${terms.user}查找→${terms.user}详情`,
      trigger: `用户想了解某个${terms.user}的基本信息`,
      steps: [
        { api: apiDisplay(searchApi), desc: `搜索${terms.user}名获取ID`, params: apiParamsDisplay(searchApi) },
        { api: apiDisplay(userApi), desc: `获取${terms.user}完整资料`, params: `用户ID（从上一步获取）` },
      ],
      example: {
        input: `查看${terms.user}@某某某的信息`,
        steps: [
          `${apiDisplay(searchApi)}?keyword=某某某`,
          `${apiDisplay(userApi)}?id=<Step1返回>`,
        ],
      },
    });
  }

  // 模式：热搜→话题详情→话题内容
  if (caps.hasTrending && caps.hasTopicContentList) {
    const trendingApi = caps.trendingApis[0];
    const topicApi = caps.topicContentApis[0];
    patterns.push({
      name: `热搜→话题${terms.post}`,
      trigger: `用户想了解当前热门话题`,
      steps: [
        { api: apiDisplay(trendingApi), desc: `获取热搜榜单`, params: apiParamsDisplay(trendingApi) },
        { api: apiDisplay(topicApi), desc: `获取热门话题下的${terms.post}`, params: `话题ID（从热搜选取）` },
      ],
      example: {
        input: `现在什么最火`,
        steps: [
          `${apiDisplay(trendingApi)}`,
          `${apiDisplay(topicApi)}?id=<Step1热门话题ID>`,
        ],
      },
    });
  } else if (caps.hasTrending && caps.hasSearch) {
    const trendingApi = caps.trendingApis[0];
    const searchApi = caps.searchApis[0];
    patterns.push({
      name: `热搜→搜索相关内容`,
      trigger: `用户想了解当前热门话题`,
      steps: [
        { api: apiDisplay(trendingApi), desc: `获取热搜榜单`, params: apiParamsDisplay(trendingApi) },
        { api: apiDisplay(searchApi), desc: `搜索感兴趣的热门话题`, params: `keyword（从热搜选取）` },
      ],
      example: {
        input: `现在什么最火`,
        steps: [
          `${apiDisplay(trendingApi)}`,
          `${apiDisplay(searchApi)}?keyword=<Step1热门话题>`,
        ],
      },
    });
  }

  // 模式：内容详情→评论→评论回复
  if (caps.hasContentDetail && caps.hasCommentList && caps.hasCommentReply) {
    const detailApi = caps.contentDetailApis[0];
    const commentApi = caps.commentApis[0];
    const replyApi = caps.commentReplyApis[0];
    patterns.push({
      name: `${terms.post}→${terms.comment}→${terms.comment}回复`,
      trigger: `用户想看${terms.post}的${terms.comment}互动`,
      steps: [
        { api: apiDisplay(detailApi), desc: `获取${terms.post}基本信息`, params: apiParamsDisplay(detailApi) },
        { api: apiDisplay(commentApi), desc: `获取${terms.comment}列表`, params: `${terms.post}ID` },
        { api: apiDisplay(replyApi), desc: `获取${terms.comment}回复`, params: `comment_id（从${terms.comment}列表获取）` },
      ],
      example: {
        input: `这个${terms.post}的${terms.comment}数据`,
        steps: [
          `${apiDisplay(detailApi)}?id=xxx`,
          `${apiDisplay(commentApi)}?id=xxx`,
          `${apiDisplay(replyApi)}?comment_id=<Step2${terms.comment}ID>`,
        ],
      },
    });
  } else if (caps.hasContentDetail && caps.hasCommentList) {
    const detailApi = caps.contentDetailApis[0];
    const commentApi = caps.commentApis[0];
    patterns.push({
      name: `${terms.post}→${terms.comment}`,
      trigger: `用户想看${terms.post}的${terms.comment}`,
      steps: [
        { api: apiDisplay(detailApi), desc: `获取${terms.post}基本信息`, params: apiParamsDisplay(detailApi) },
        { api: apiDisplay(commentApi), desc: `获取${terms.comment}列表`, params: `${terms.post}ID` },
      ],
      example: {
        input: `这个${terms.post}的${terms.comment}`,
        steps: [
          `${apiDisplay(detailApi)}?id=xxx`,
          `${apiDisplay(commentApi)}?id=xxx`,
        ],
      },
    });
  }

  // 模式：搜索→内容详情→评论
  if (caps.hasSearchContent && caps.hasContentDetail && caps.hasCommentList && !patterns.some(p => p.name.includes('搜索') && p.name.includes('评论'))) {
    const searchApi = caps.searchApis.find(a => a.funcType === 'search_content') || caps.searchApis[0];
    const detailApi = caps.contentDetailApis[0];
    const commentApi = caps.commentApis[0];
    patterns.push({
      name: `搜索→${terms.post}详情→${terms.comment}`,
      trigger: `用户搜索后想看${terms.post}详情和${terms.comment}`,
      steps: [
        { api: apiDisplay(searchApi), desc: `搜索关键词获取${terms.post}列表`, params: apiParamsDisplay(searchApi) },
        { api: apiDisplay(detailApi), desc: `获取${terms.post}详情`, params: `ID（从搜索结果获取）` },
        { api: apiDisplay(commentApi), desc: `获取${terms.comment}`, params: `${terms.post}ID` },
      ],
      example: {
        input: `搜索xxx并看${terms.comment}`,
        steps: [
          `${apiDisplay(searchApi)}?keyword=xxx`,
          `${apiDisplay(detailApi)}?id=<Step1返回>`,
          `${apiDisplay(commentApi)}?id=<同上>`,
        ],
      },
    });
  }

  // 模式：直播相关
  if (caps.hasSearchLive && caps.hasLive) {
    const searchApi = caps.searchApis.find(a => a.funcType === 'search_live');
    const liveApi = caps.liveApis[0];
    if (searchApi) {
      patterns.push({
        name: `搜索${terms.live}→${terms.live}详情`,
        trigger: `用户想了解某个${terms.live}间的数据`,
        steps: [
          { api: apiDisplay(searchApi), desc: `搜索${terms.live}间`, params: apiParamsDisplay(searchApi) },
          { api: apiDisplay(liveApi), desc: `获取${terms.live}详情`, params: `房间ID或用户ID（从上一步获取）` },
        ],
        example: {
          input: `这个${terms.live}间有多少人在线`,
          steps: [
            `${apiDisplay(searchApi)}?keyword=xxx`,
            `${apiDisplay(liveApi)}?id=<Step1返回>`,
          ],
        },
      });
    }
  }

  // 模式：用户详情→粉丝/关注列表
  if (caps.hasUserDetail && (caps.hasFollowerList || caps.hasFollowingList)) {
    const userApi = caps.userDetailApis[0];
    const followApi = caps.hasFollowerList ? caps.followerApis[0] : caps.followingApis[0];
    const followType = caps.hasFollowerList ? '粉丝' : '关注';
    patterns.push({
      name: `${terms.user}详情→${followType}列表`,
      trigger: `用户想看某个${terms.user}的${followType}`,
      steps: [
        { api: apiDisplay(userApi), desc: `获取${terms.user}信息`, params: apiParamsDisplay(userApi) },
        { api: apiDisplay(followApi), desc: `获取${followType}列表`, params: `用户ID` },
      ],
      example: {
        input: `这个${terms.user}有多少${followType}`,
        steps: [
          `${apiDisplay(userApi)}?id=xxx`,
          `${apiDisplay(followApi)}?id=xxx`,
        ],
      },
    });
  }

  // 模式：临时邮箱
  if (caps.hasEmailCreate && caps.hasEmailList && caps.hasEmailDetail) {
    const createApi = caps.emailCreateApis[0];
    const listApi = caps.emailListApis[0];
    const detailApi = caps.emailDetailApis[0];
    patterns.push({
      name: '创建邮箱→接收邮件→查看邮件详情',
      trigger: '用户需要临时邮箱服务',
      steps: [
        { api: apiDisplay(createApi), desc: '创建临时邮箱地址', params: apiParamsDisplay(createApi) },
        { api: apiDisplay(listApi), desc: '查看收件箱', params: 'token（从创建结果获取）' },
        { api: apiDisplay(detailApi), desc: '查看邮件详情', params: 'token + message_id（从收件箱获取）' },
      ],
      example: {
        input: '帮我创建一个临时邮箱',
        steps: [
          `${apiDisplay(createApi)}`,
          `${apiDisplay(listApi)}?token=<Step1返回的token>`,
          `${apiDisplay(detailApi)}?token=<同上>&message_id=<Step2邮件ID>`,
        ],
      },
    });
  }

  // 模式：混合解析
  if (caps.hasHybridParse) {
    const parseApi = caps.hybridParseApis[0];
    patterns.push({
      name: 'URL解析→视频数据',
      trigger: '用户提供视频链接，想获取视频数据',
      steps: [
        { api: apiDisplay(parseApi), desc: '通过URL解析视频数据', params: apiParamsDisplay(parseApi) },
      ],
      example: {
        input: '解析这个视频链接：https://...',
        steps: [
          `${apiDisplay(parseApi)}?url=<用户提供的链接>`,
        ],
      },
    });
  }

  // 模式：Sora2特有 - 搜索用户→用户帖子→帖子评论
  if (skillName === 'maxhub-sora2') {
    const searchApi = caps.searchApis.find(a => a.funcType === 'search_user');
    const userApi = caps.userDetailApis[0];
    const userContentApi = caps.userContentApis[0];
    const commentApi = caps.commentApis[0];
    const commentReplyApi = caps.commentReplyApis[0];
    const feedApi = caps.feedApis[0];

    // 移除通用模式中已生成的"用户查找→用户详情→用户内容列表"模式（Sora2用下面的更精确版本替代）
    const duplicateIdx = patterns.findIndex(p => p.name.includes('Creator查找→Creator详情→Post/Video列表'));
    if (duplicateIdx >= 0) patterns.splice(duplicateIdx, 1);

    if (searchApi && userApi && userContentApi) {
      patterns.push({
        name: '搜索创作者→创作者详情→作品列表',
        trigger: '用户想了解Sora2上的创作者',
        steps: [
          { api: apiDisplay(searchApi), desc: '搜索创作者用户名', params: apiParamsDisplay(searchApi) },
          { api: apiDisplay(userApi), desc: '获取创作者详情', params: 'user_id（从搜索结果获取）' },
          { api: apiDisplay(userContentApi), desc: '获取创作者作品列表', params: 'user_id' },
        ],
        example: {
          input: 'Sora2上有个创作者叫xxx',
          steps: [
            `${apiDisplay(searchApi)}?username=xxx`,
            `${apiDisplay(userApi)}?user_id=<Step1返回>`,
            `${apiDisplay(userContentApi)}?user_id=<同上>`,
          ],
        },
      });
    }

    if (caps.hasContentDetail && commentApi) {
      const detailApi = caps.contentDetailApis[0];
      patterns.push({
        name: '作品详情→作品评论',
        trigger: '用户想看Sora2作品的评论',
        steps: [
          { api: apiDisplay(detailApi), desc: '获取作品详情', params: apiParamsDisplay(detailApi) },
          { api: apiDisplay(commentApi), desc: '获取作品评论', params: 'post_id' },
        ],
        example: {
          input: '这个Sora2作品的评论',
          steps: [
            `${apiDisplay(detailApi)}?id=xxx`,
            `${apiDisplay(commentApi)}?post_id=xxx`,
          ],
        },
      });
    }

    if (feedApi) {
      patterns.push({
        name: '浏览推荐→查看详情',
        trigger: '用户想浏览Sora2推荐内容',
        steps: [
          { api: apiDisplay(feedApi), desc: '获取推荐Feed流', params: apiParamsDisplay(feedApi) },
          { api: apiDisplay(caps.contentDetailApis[0]), desc: '查看感兴趣的作品详情', params: 'post_id（从Feed获取）' },
        ],
        example: {
          input: 'Sora2上有什么好看的',
          steps: [
            `${apiDisplay(feedApi)}`,
            `${apiDisplay(caps.contentDetailApis[0])}?post_id=<Step1感兴趣的作品ID>`,
          ],
        },
      });
    }
  }

  // 模式：LinkedIn特有 - 公司详情→公司帖子/员工/职位
  if (skillName === 'maxhub-linkedin') {
    const companyApis = apis.filter(a => a.shortPath.includes('company'));
    if (companyApis.length > 0) {
      const companyProfileApi = companyApis.find(a => a.shortPath.includes('profile') || a.shortPath.includes('profile'));
      const companyPostsApi = companyApis.find(a => a.shortPath.includes('posts'));
      const companyEmployeesApi = companyApis.find(a => a.shortPath.includes('employee') || a.shortPath.includes('people'));
      const companyJobsApi = companyApis.find(a => a.shortPath.includes('job'));

      if (companyProfileApi) {
        const steps = [
          { api: apiDisplay(companyProfileApi), desc: '获取公司主页资料', params: apiParamsDisplay(companyProfileApi) },
        ];
        const exampleSteps = [
          `${apiDisplay(companyProfileApi)}?name=xxx`,
        ];

        if (companyPostsApi) {
          steps.push({ api: apiDisplay(companyPostsApi), desc: '获取公司帖子流', params: '公司标识（从上一步获取）' });
          exampleSteps.push(`${apiDisplay(companyPostsApi)}?name=<Step1公司标识>`);
        }
        if (companyEmployeesApi) {
          steps.push({ api: apiDisplay(companyEmployeesApi), desc: '获取公司员工列表', params: '公司标识' });
          exampleSteps.push(`${apiDisplay(companyEmployeesApi)}?name=<Step1公司标识>`);
        }

        patterns.push({
          name: '公司详情→公司动态/员工',
          trigger: '用户想了解某家公司的信息',
          steps,
          example: {
            input: '查看xxx公司的LinkedIn信息',
            steps: exampleSteps,
          },
        });
      }
    }
  }

  // 模式：微信特有 - 公众号文章列表→文章详情→评论
  if (skillName === 'maxhub-wechat') {
    const articleListApi = apis.find(a => a.shortPath.includes('article_list'));
    const articleDetailApi = apis.find(a => a.shortPath.includes('article_detail'));
    const commentApi = caps.commentApis[0];

    if (articleListApi && articleDetailApi) {
      patterns.push({
        name: '公众号文章列表→文章详情',
        trigger: '用户想查看公众号的文章',
        steps: [
          { api: apiDisplay(articleListApi), desc: '获取公众号文章列表', params: apiParamsDisplay(articleListApi) },
          { api: apiDisplay(articleDetailApi), desc: '获取文章详情', params: 'url（从列表获取）' },
        ],
        example: {
          input: '查看这个公众号的文章',
          steps: [
            `${apiDisplay(articleListApi)}?ghid=xxx`,
            `${apiDisplay(articleDetailApi)}?url=<Step1文章链接>`,
          ],
        },
      });
    }

    if (articleDetailApi && commentApi) {
      patterns.push({
        name: '文章详情→文章评论',
        trigger: '用户想看公众号文章的评论',
        steps: [
          { api: apiDisplay(articleDetailApi), desc: '获取文章详情', params: apiParamsDisplay(articleDetailApi) },
          { api: apiDisplay(commentApi), desc: '获取文章评论', params: 'url' },
        ],
        example: {
          input: '这篇文章的评论',
          steps: [
            `${apiDisplay(articleDetailApi)}?url=xxx`,
            `${apiDisplay(commentApi)}?url=xxx`,
          ],
        },
      });
    }
  }

  // 模式：知乎特有 - 专栏文章列表→文章详情→评论
  if (skillName === 'maxhub-zhihu') {
    const columnApi = apis.find(a => a.shortPath.includes('column_articles'));
    const articleDetailApi = apis.find(a => a.shortPath.includes('column_article_detail'));
    const commentApi = caps.commentApis[0];

    if (columnApi && articleDetailApi) {
      patterns.push({
        name: '专栏文章列表→文章详情→评论',
        trigger: '用户想查看知乎专栏的文章',
        steps: [
          { api: apiDisplay(columnApi), desc: '获取专栏文章列表', params: apiParamsDisplay(columnApi) },
          { api: apiDisplay(articleDetailApi), desc: '获取文章详情', params: 'article_id（从列表获取）' },
          ...(commentApi ? [{ api: apiDisplay(commentApi), desc: '获取文章评论', params: 'article_id' }] : []),
        ],
        example: {
          input: '查看这个知乎专栏的文章',
          steps: [
            `${apiDisplay(columnApi)}?column_id=xxx`,
            `${apiDisplay(articleDetailApi)}?article_id=<Step1返回>`,
            ...(commentApi ? [`${apiDisplay(commentApi)}?article_id=<同上>`] : []),
          ],
        },
      });
    }

    const questionApi = apis.find(a => a.shortPath.includes('question_answers'));
    if (questionApi) {
      patterns.push({
        name: '问题→回答列表→评论',
        trigger: '用户想看知乎问题的回答',
        steps: [
          { api: apiDisplay(questionApi), desc: '获取问题回答列表', params: apiParamsDisplay(questionApi) },
          ...(commentApi ? [{ api: apiDisplay(commentApi), desc: '获取回答评论', params: 'answer_id（从回答列表获取）' }] : []),
        ],
        example: {
          input: '知乎上关于xxx的问题',
          steps: [
            `${apiDisplay(questionApi)}?question_id=xxx`,
            ...(commentApi ? [`${apiDisplay(commentApi)}?answer_id=<Step1回答ID>`] : []),
          ],
        },
      });
    }
  }

  // 模式：Reddit特有 - 版块帖子→帖子详情→评论
  if (skillName === 'maxhub-reddit') {
    const subredditFeedApi = apis.find(a => a.shortPath.includes('subreddit_feed'));
    const postDetailApi = caps.contentDetailApis[0];
    const commentApi = caps.commentApis[0];

    if (subredditFeedApi && postDetailApi) {
      patterns.push({
        name: 'Subreddit帖子→帖子详情→评论',
        trigger: '用户想浏览Reddit版块内容',
        steps: [
          { api: apiDisplay(subredditFeedApi), desc: '获取版块帖子列表', params: apiParamsDisplay(subredditFeedApi) },
          { api: apiDisplay(postDetailApi), desc: '获取帖子详情', params: 'post_id（从列表获取）' },
          ...(commentApi ? [{ api: apiDisplay(commentApi), desc: '获取帖子评论', params: 'post_id' }] : []),
        ],
        example: {
          input: '看看r/programming的热门帖子',
          steps: [
            `${apiDisplay(subredditFeedApi)}?subreddit_name=programming`,
            `${apiDisplay(postDetailApi)}?post_id=<Step1返回>`,
            ...(commentApi ? [`${apiDisplay(commentApi)}?post_id=<同上>`] : []),
          ],
        },
      });
    }
  }

  // 模式：头条/西瓜等简单平台 - 用户信息→用户内容
  if (skillName === 'maxhub-toutiao' || skillName === 'maxhub-xigua') {
    const userInfoApi = caps.userDetailApis[0];
    const userPostApi = caps.userContentApis[0];
    const detailApi = caps.contentDetailApis[0];
    const commentApi = caps.commentApis[0];

    if (userInfoApi && userPostApi) {
      patterns.push({
        name: `${terms.user}信息→${terms.post}列表`,
        trigger: `用户想查看某个${terms.user}的${terms.post}`,
        steps: [
          { api: apiDisplay(userInfoApi), desc: `获取${terms.user}信息`, params: apiParamsDisplay(userInfoApi) },
          { api: apiDisplay(userPostApi), desc: `获取${terms.user}${terms.post}列表`, params: 'user_id' },
        ],
        example: {
          input: `查看这个${terms.user}的${terms.post}`,
          steps: [
            `${apiDisplay(userInfoApi)}?user_id=xxx`,
            `${apiDisplay(userPostApi)}?user_id=xxx`,
          ],
        },
      });
    }

    if (detailApi && commentApi) {
      patterns.push({
        name: `${terms.post}详情→${terms.comment}`,
        trigger: `用户想看${terms.post}的${terms.comment}`,
        steps: [
          { api: apiDisplay(detailApi), desc: `获取${terms.post}详情`, params: apiParamsDisplay(detailApi) },
          { api: apiDisplay(commentApi), desc: `获取${terms.comment}`, params: `${terms.post}ID` },
        ],
        example: {
          input: `这个${terms.post}的${terms.comment}`,
          steps: [
            `${apiDisplay(detailApi)}?id=xxx`,
            `${apiDisplay(commentApi)}?id=xxx`,
          ],
        },
      });
    }
  }

  // 去重：移除步骤完全相同的模式
  const seen = new Set();
  const deduped = [];
  for (const p of patterns) {
    const key = p.steps.map(s => s.api).join('→');
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(p);
    }
  }

  return deduped;
}

// 生成未知场景处理策略（基于实际API能力）
function generateUnknownScenarios(caps, terms) {
  const scenarios = [];

  // 单API直接调用（所有skill都适用）
  scenarios.push({
    name: '单API直接调用',
    trigger: '用户需求明确，单个API即可满足',
    strategy: '直接匹配最合适的API调用，无需链式',
  });

  // 先搜索后详情（仅适用于有搜索能力的skill）
  if (caps.hasSearch && (caps.hasContentDetail || caps.hasUserDetail)) {
    scenarios.push({
      name: '先搜索后详情',
      trigger: `用户提到某个${terms.post}或${terms.user}但不知道具体ID`,
      strategy: `先用搜索类API获取ID，再用详情API获取完整数据`,
    });
  }

  // 先列表后逐条（仅适用于有列表和详情API的skill）
  if (caps.hasUserContentList && caps.hasContentDetail) {
    scenarios.push({
      name: '先列表后逐条',
      trigger: `用户需要某个${terms.user}的${terms.post}中每条的详细数据`,
      strategy: `先获取${terms.user}${terms.post}列表，再对每条${terms.post}调用详情API（注意控制数量，默认最多10条）`,
    });
  }

  // 多维度组合（仅适用于有多种API类型的skill）
  const apiTypeCount = [caps.hasSearch, caps.hasUserDetail, caps.hasContentDetail, caps.hasCommentList, caps.hasTrending, caps.hasAnalytics].filter(Boolean).length;
  if (apiTypeCount >= 3) {
    scenarios.push({
      name: '多维度组合分析',
      trigger: '用户需求跨多个数据维度（如同时需要用户数据、内容数据、互动数据）',
      strategy: '按维度分别调用对应API，将结果组合输出分析报告',
    });
  }

  // 热搜探索（仅适用于有热搜能力的skill）
  if (caps.hasTrending && caps.hasSearch) {
    scenarios.push({
      name: '热搜探索',
      trigger: '用户想发现热门内容但不知道具体关键词',
      strategy: `先获取热搜/榜单数据，再根据用户兴趣搜索相关${terms.post}`,
    });
  }

  // 临时邮箱轮询（仅适用于temp-mail）
  if (caps.hasEmailCreate && caps.hasEmailList) {
    scenarios.push({
      name: '邮箱轮询检查',
      trigger: '用户创建临时邮箱后需要等待邮件',
      strategy: '创建邮箱后，定时调用收件箱API检查新邮件，发现新邮件后可调用详情API查看完整内容',
    });
  }

  // URL解析（仅适用于hybrid）
  if (caps.hasHybridParse) {
    scenarios.push({
      name: 'URL直接解析',
      trigger: '用户提供任意视频链接',
      strategy: '直接调用混合解析API，传入URL即可获取视频数据，无需预先知道平台或ID',
    });
  }

  return scenarios;
}

// 生成决策树（基于实际API能力）
function generateDecisionTree(caps, terms) {
  let tree = '用户需求\n  │\n';

  const branches = [];

  if (caps.hasContentDetail || caps.hasUserDetail) {
    branches.push(`  ├─ 是否知道具体ID？\n  │    ├─ 是 → 直接调用详情API\n  │    └─ 否 → ${caps.hasSearch ? '先搜索获取ID' : '请用户提供ID或链接'}`);
  }

  if (caps.hasSearch && (caps.hasContentDetail || caps.hasUserDetail)) {
    branches.push(`  ├─ 是否需要多个数据维度？\n  │    ├─ 是 → 按维度分别调用API，组合输出\n  │    └─ 否 → 单API直接返回`);
  }

  if (caps.hasUserContentList && caps.hasContentDetail) {
    branches.push(`  ├─ 是否需要批量数据？\n  │    ├─ 是 → 先获取列表，再逐条获取详情（默认≤10条）\n  │    └─ 否 → 单条获取`);
  }

  if (caps.hasTrending) {
    branches.push(`  └─ 想发现热门内容？\n       └─ 先看热搜/榜单，再搜索感兴趣的${terms.post}`);
  } else if (caps.hasSearch) {
    branches.push(`  └─ 场景不明确？\n       └─ 先用搜索API探索，再根据结果决定下一步`);
  } else if (caps.hasFeed) {
    branches.push(`  └─ 想浏览内容？\n       └─ 获取推荐Feed流，再查看感兴趣的详情`);
  } else if (caps.hasHybridParse) {
    branches.push(`  └─ 有视频链接？\n       └─ 直接调用混合解析API`);
  } else if (caps.hasEmailCreate) {
    branches.push(`  └─ 需要临时邮箱？\n       └─ 创建邮箱→查看收件箱→查看邮件详情`);
  }

  if (branches.length === 0) {
    branches.push(`  └─ 直接匹配最合适的API调用`);
  }

  return tree + branches.join('\n');
}

// 生成chain-patterns.md完整内容
function buildChainPatternsMd(skillName, displayName, caps, apis, terms) {
  const patterns = generateChainPatterns(skillName, displayName, caps, apis, terms);
  const unknownScenarios = generateUnknownScenarios(caps, terms);
  const decisionTree = generateDecisionTree(caps, terms);

  let md = `# ${displayName}链式调用模式库\n\n## 核心原则\n\n1. **按需调用**：用户需求能用1个API解决就不要调用2个\n2. **参数传递**：链式调用中，上一步的返回值作为下一步的参数\n3. **数量控制**：批量获取详情时默认最多10条，需用户确认才能更多\n4. **错误中断**：任何一步失败则停止，向用户说明原因\n\n---\n\n`;

  if (patterns.length > 0) {
    md += `## 已知场景模式\n\n`;
    for (let i = 0; i < patterns.length; i++) {
      const p = patterns[i];
      md += `### 模式${i + 1}：${p.name}\n\n`;
      md += `**触发场景**：${p.trigger}\n\n`;
      md += `**调用步骤**：\n\n`;
      for (let j = 0; j < p.steps.length; j++) {
        const s = p.steps[j];
        md += `${j + 1}. \`${s.api}\` — ${s.desc}（参数：${s.params}）\n`;
      }
      md += `\n**示例**：\n\`\`\`\n用户: "${p.example.input}"\n`;
      for (let j = 0; j < p.example.steps.length; j++) {
        md += `→ Step${j + 1}: ${p.example.steps[j]}\n`;
      }
      md += `\`\`\`\n\n---\n\n`;
    }
  }

  md += `## 未知场景处理策略\n\n当用户需求不在上述已知模式中时，按以下策略处理：\n\n`;
  for (const s of unknownScenarios) {
    md += `### ${s.name}\n\n**触发场景**：${s.trigger}\n\n**处理策略**：${s.strategy}\n\n`;
  }

  md += `---\n\n## 链式调用决策树\n\n\`\`\`\n${decisionTree}\n\`\`\`\n`;

  return md;
}

// 生成system.prompt.md完整内容
function buildSystemPromptMd(skillName, displayName, caps, apis, terms) {
  const emoji = EMOJIS[skillName] || '📊';

  // 按分类分组API
  const catGroups = {};
  for (const api of apis) {
    const cat = api.category || '其他';
    if (!catGroups[cat]) catGroups[cat] = [];
    catGroups[cat].push(api);
  }

  // 生成API选择优先级（基于实际能力）
  let priorityRules = [];
  if (caps.hasContentDetail || caps.hasUserDetail) {
    priorityRules.push(`**精确匹配**：用户提供了具体ID → 直接调用详情API`);
  }
  if (caps.hasSearch) {
    priorityRules.push(`**搜索优先**：用户只提供了关键词 → 先搜索再获取详情`);
  }
  if (caps.hasUserDetail && caps.hasUserContentList) {
    priorityRules.push(`**列表优先**：用户要查看某${terms.user}的内容 → 先获取${terms.user}信息再获取内容列表`);
  }
  if (caps.hasHybridParse) {
    priorityRules.push(`**URL直接解析**：用户提供了视频链接 → 直接调用混合解析API`);
  }
  if (caps.hasEmailCreate) {
    priorityRules.push(`**创建优先**：用户需要临时邮箱 → 先创建邮箱再查看收件箱`);
  }
  priorityRules.push(`**避免冗余**：能用1个API解决的不调用2个`);

  // 生成参数处理规则（基于实际能力）
  let paramRules = [];
  if (caps.hasTool || caps.hasHybridParse) {
    paramRules.push(`用户给URL → ${caps.hasHybridParse ? '直接调用混合解析API' : '先提取ID再调用API'}`);
  } else if (caps.hasContentDetail) {
    paramRules.push(`用户给URL → 先提取ID再调用API`);
  }
  if (caps.hasSearchUser) {
    paramRules.push(`用户给${terms.user}名 → 先搜索获取ID`);
  }
  if (caps.hasSearch) {
    paramRules.push(`用户给关键词 → 先搜索获取列表`);
  }
  if (caps.hasEmailCreate) {
    paramRules.push(`用户需要邮箱 → 先创建获取token，再用token查收件箱`);
  }
  if (caps.hasUserContentList || caps.hasCommentList || caps.hasFeed) {
    paramRules.push(`分页参数：默认page=1, count=20`);
  }

  // 生成未知场景处理规则（基于实际能力）
  let unknownRules = [];
  unknownRules.push(`1. 分析需求需要哪些数据维度`);
  if (caps.hasSearch) {
    unknownRules.push(`2. 在API目录中找到能提供这些数据的API`);
    unknownRules.push(`3. 如需ID先搜索，再按依赖关系排列调用顺序`);
  } else {
    unknownRules.push(`2. 在API目录中找到能提供这些数据的API`);
    unknownRules.push(`3. 如需ID请用户提供，或通过URL提取`);
  }
  unknownRules.push(`4. 执行调用并组合结果`);

  let md = `# ${emoji} ${displayName} Skill 角色提示词\n\n你是${displayName}的数据专家。你精通该平台所有API的能力和限制，能根据用户需求智能选择最合适的API，必要时链式调用多个API完成复杂任务。\n\n## 角色定位\n\n- 你是专业的${displayName.replace('数据采集与分析', '数据分析师').replace('数据采集', '数据采集助手').replace('服务', '服务助手')}\n- 你熟悉该平台的生态、术语和数据结构\n- 你能根据用户模糊的需求，精确匹配最合适的API\n- 你会在执行高成本操作前主动确认\n\n## API使用规则\n\n### 1. API选择优先级\n\n`;
  for (let i = 0; i < priorityRules.length; i++) {
    md += `${i + 1}. ${priorityRules[i]}\n`;
  }

  md += `\n### 2. 链式调用规则\n\n- 遵循 chain-patterns.md 中的模式\n- 每步传递必要参数（ID、token等）\n- 任何一步失败则停止并说明原因\n- 批量获取详情默认最多10条\n`;

  md += `\n### 3. 参数处理规则\n\n`;
  if (paramRules.length > 0) {
    for (const rule of paramRules) {
      md += `- ${rule}\n`;
    }
  } else {
    md += `- 根据API目录中的必填参数要求提供参数\n`;
  }

  md += `\n### 4. 未知场景处理\n\n当用户需求不在已知模式中时：\n`;
  for (const rule of unknownRules) {
    md += `${rule}\n`;
  }

  md += `\n## API能力概览\n\n共 ${apis.length} 个API，按分类如下：\n\n`;

  for (const [cat, catApis] of Object.entries(catGroups)) {
    md += `### ${cat}（${catApis.length}个）\n\n`;
    const coreApis = catApis.slice(0, 8);
    for (const api of coreApis) {
      const paramsStr = api.requiredParams && api.requiredParams !== '-' && api.requiredParams !== '无'
        ? `（需要：${api.requiredParams}）` : '';
      md += `- \`${api.shortPath}\`：${api.name}${paramsStr}\n`;
    }
    if (catApis.length > 8) {
      md += `- ...还有 ${catApis.length - 8} 个API\n`;
    }
    md += `\n`;
  }

  md += `## 输出规范\n\n- 数据以结构化表格或列表展示\n- 关键数据加粗标注\n- 附带数据来源和时间戳\n- 超过10条数据时提供摘要\n- 链式调用时说明每步的调用目的和结果\n`;

  return md;
}

function main() {
  const skillDirs = fs.readdirSync(SKILLS_DIR).filter(d =>
    d.startsWith('maxhub-') && fs.statSync(path.join(SKILLS_DIR, d)).isDirectory()
  );

  let count = 0;
  for (const skillDir of skillDirs) {
    const skillPath = path.join(SKILLS_DIR, skillDir);
    const catalogPath = path.join(skillPath, 'references', 'api-catalog.md');

    if (!fs.existsSync(catalogPath)) {
      console.log(`⚠️  ${skillDir}: api-catalog.md 不存在，跳过`);
      continue;
    }

    const displayName = DISPLAY_NAMES[skillDir] || skillDir.replace('maxhub-', '');
    const terms = PLATFORM_TERMS[skillDir] || { user: '用户', post: '内容', comment: '评论', topic: '话题', live: '直播', search: '搜索' };

    // 解析API目录
    const { apis, totalApiCount } = parseApiCatalog(catalogPath);

    if (apis.length === 0) {
      console.log(`⚠️  ${skillDir}: 未解析到API，跳过`);
      continue;
    }

    // 分析API能力
    const caps = analyzeCapabilities(apis);

    // 生成 chain-patterns.md
    const chainMd = buildChainPatternsMd(skillDir, displayName, caps, apis, terms);
    fs.writeFileSync(path.join(skillPath, 'references', 'chain-patterns.md'), chainMd, 'utf-8');

    // 生成 system.prompt.md
    const promptMd = buildSystemPromptMd(skillDir, displayName, caps, apis, terms);
    fs.writeFileSync(path.join(skillPath, 'system.prompt.md'), promptMd, 'utf-8');

    count++;
    console.log(`✅ ${skillDir}: ${apis.length}个API, ${generateChainPatterns(skillDir, displayName, caps, apis, terms).length}个链式模式`);
  }

  console.log(`\n🎉 完成！共处理 ${count} 个 Skill`);
}

main();
