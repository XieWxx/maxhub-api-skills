#!/usr/bin/env node

/**
 * 批量生成Skill V2结构脚本
 * 基于maxhub-douyin模板，为所有skill生成完整的V2目录结构
 * 每个skill适配自己的API返回格式
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..');

// 所有skill的配置信息
const SKILLS = {
  'maxhub-douyin': {
    platform: 'douyin',
    displayName: '抖音数据采集与分析',
    displayNameEn: 'Douyin Data Collection & Analysis',
    description: '抖音/Douyin平台数据采集与智能分析',
    descriptionEn: 'Douyin platform data collection and intelligent analysis',
    emoji: '🎵',
    trigger: '抖音|douyin|短视频热搜|抖音达人|抖音直播|抖音热榜|抖音视频|抖音博主',
    categories: ['social-media', 'data-collection', 'content-analysis'],
    capabilities: ['video-data-collection', 'user-profile-analysis', 'live-streaming-data', 'search-query', 'trending-analysis', 'creator-analytics', 'comment-analysis', 'hashtag-tracking'],
    apiPrefix: '/api/v1/douyin',
    dataFormats: {
      userProfile: ['nickname', 'uniqueId', 'uid', 'secUid', 'signature', 'avatar', 'followerCount', 'followingCount', 'fansCount', 'totalFavorited', 'awemeCount', 'isVerified', 'ipLocation'],
      videoInfo: ['awemeId', 'title', 'author', 'statistics', 'duration', 'createTime', 'coverUrl', 'shareUrl', 'tags'],
    },
  },
  'maxhub-bilibili': {
    platform: 'bilibili',
    displayName: 'B站数据采集与分析',
    displayNameEn: 'Bilibili Data Collection & Analysis',
    description: 'B站视频数据、UP主分析与弹幕采集',
    descriptionEn: 'Bilibili video data, UP host analysis and danmaku collection',
    emoji: '📺',
    trigger: 'b站|bilibili|弹幕|番剧|up主|b站视频|哔哩哔哩',
    categories: ['social-media', 'data-collection', 'content-analysis'],
    capabilities: ['video-data-collection', 'user-profile-analysis', 'danmaku-collection', 'search-query', 'trending-analysis', 'comment-analysis'],
    apiPrefix: '/api/v1/bilibili',
    dataFormats: {
      userProfile: ['name', 'mid', 'sign', 'face', 'fans', 'attention', 'level', 'isLive'],
      videoInfo: ['bvid', 'aid', 'title', 'owner', 'stat', 'duration', 'pubdate', 'desc', 'tag'],
    },
  },
  'maxhub-xiaohongshu': {
    platform: 'xiaohongshu',
    displayName: '小红书数据采集与分析',
    displayNameEn: 'Xiaohongshu Data Collection & Analysis',
    description: '小红书笔记搜索、用户分析与种草数据采集',
    descriptionEn: 'Xiaohongshu note search, user analysis and recommendation data collection',
    emoji: '📕',
    trigger: '小红书|xiaohongshu|red|种草|笔记|小红书搜索',
    categories: ['social-media', 'data-collection', 'content-analysis'],
    capabilities: ['note-search', 'user-profile-analysis', 'search-query', 'trending-analysis', 'comment-analysis'],
    apiPrefix: '/api/v1/xiaohongshu',
    dataFormats: {
      userProfile: ['nickname', 'redId', 'desc', 'image', 'fans', 'follows', 'interaction', 'tags'],
      videoInfo: ['noteId', 'title', 'type', 'user', 'interactInfo', 'time', 'tagList'],
    },
  },
  'maxhub-weibo': {
    platform: 'weibo',
    displayName: '微博数据采集与分析',
    displayNameEn: 'Weibo Data Collection & Analysis',
    description: '微博热搜、话题、用户与博文数据采集',
    descriptionEn: 'Weibo hot search, topic, user and post data collection',
    emoji: '🔥',
    trigger: '微博|weibo|热搜|超话|话题|微博搜索',
    categories: ['social-media', 'data-collection', 'trending'],
    capabilities: ['hot-search', 'user-profile-analysis', 'topic-tracking', 'search-query', 'comment-analysis'],
    apiPrefix: '/api/v1/weibo',
    dataFormats: {
      userProfile: ['screenName', 'id', 'description', 'profileImage', 'followersCount', 'friendsCount', 'statusesCount', 'verified'],
      videoInfo: ['id', 'text', 'user', 'repostsCount', 'commentsCount', 'attitudesCount', 'createdAt'],
    },
  },
  'maxhub-wechat': {
    platform: 'wechat',
    displayName: '微信数据采集与分析',
    displayNameEn: 'WeChat Data Collection & Analysis',
    description: '微信视频号与公众号数据采集分析',
    descriptionEn: 'WeChat Channels and Official Account data collection and analysis',
    emoji: '💬',
    trigger: '微信|wechat|视频号|公众号|微信文章',
    categories: ['social-media', 'data-collection'],
    capabilities: ['channels-data', 'official-account-data', 'article-search', 'search-query'],
    apiPrefix: '/api/v1/wechat',
    dataFormats: {
      userProfile: ['nickname', 'alias', 'signature', 'headImgUrl', 'fansCount', 'readCount'],
      videoInfo: ['title', 'author', 'digest', 'contentUrl', 'publishTime', 'readNum', 'likeNum'],
    },
  },
  'maxhub-zhihu': {
    platform: 'zhihu',
    displayName: '知乎数据采集与分析',
    displayNameEn: 'Zhihu Data Collection & Analysis',
    description: '知乎问答搜索、专栏文章与话题数据采集',
    descriptionEn: 'Zhihu Q&A search, column article and topic data collection',
    emoji: '💡',
    trigger: '知乎|zhihu|问答|专栏|话题|知乎搜索',
    categories: ['social-media', 'data-collection', 'knowledge-base'],
    capabilities: ['qna-search', 'user-profile-analysis', 'topic-tracking', 'search-query', 'column-analysis'],
    apiPrefix: '/api/v1/zhihu',
    dataFormats: {
      userProfile: ['name', 'urlToken', 'headline', 'avatarUrl', 'followerCount', 'followingCount', 'answerCount', 'articlesCount'],
      videoInfo: ['id', 'title', 'author', 'voteupCount', 'commentCount', 'content', 'createdTime'],
    },
  },
  'maxhub-kuaishou': {
    platform: 'kuaishou',
    displayName: '快手数据采集与分析',
    displayNameEn: 'Kuaishou Data Collection & Analysis',
    description: '快手短视频、直播与电商数据采集',
    descriptionEn: 'Kuaishou short video, live streaming and e-commerce data collection',
    emoji: '🎬',
    trigger: '快手|kuaishou|快手视频|快手直播|快手电商',
    categories: ['social-media', 'data-collection', 'e-commerce'],
    capabilities: ['video-data-collection', 'user-profile-analysis', 'live-streaming-data', 'search-query', 'e-commerce-data'],
    apiPrefix: '/api/v1/kuaishou',
    dataFormats: {
      userProfile: ['userName', 'userId', 'userText', 'headUrl', 'fanCount', 'followCount', 'photoCount'],
      videoInfo: ['photoId', 'caption', 'userName', 'viewCount', 'likeCount', 'commentCount', 'timestamp'],
    },
  },
  'maxhub-toutiao': {
    platform: 'toutiao',
    displayName: '头条数据采集与分析',
    displayNameEn: 'Toutiao Data Collection & Analysis',
    description: '今日头条新闻资讯搜索与数据采集',
    descriptionEn: 'Toutiao news and information search and data collection',
    emoji: '📰',
    trigger: '头条|toutiao|新闻|资讯|今日头条',
    categories: ['news', 'data-collection', 'trending'],
    capabilities: ['news-search', 'user-profile-analysis', 'trending-analysis', 'search-query'],
    apiPrefix: '/api/v1/toutiao',
    dataFormats: {
      userProfile: ['name', 'userId', 'description', 'avatarUrl', 'followersCount', 'followingCount'],
      videoInfo: ['itemId', 'title', 'source', 'commentCount', 'diggCount', 'publishTime', 'abstract'],
    },
  },
  'maxhub-xigua': {
    platform: 'xigua',
    displayName: '西瓜视频数据采集',
    displayNameEn: 'Xigua Video Data Collection',
    description: '西瓜视频公开内容搜索与信息查询',
    descriptionEn: 'Xigua public content search and information query',
    emoji: '🍉',
    trigger: '西瓜视频|xigua|长视频|西瓜搜索',
    categories: ['social-media', 'data-collection', 'video-platform'],
    capabilities: ['video-data-collection', 'user-profile-analysis', 'search-query'],
    apiPrefix: '/api/v1/xigua',
    dataFormats: {
      userProfile: ['name', 'userId', 'description', 'avatarUrl', 'followerCount'],
      videoInfo: ['itemId', 'title', 'author', 'playCount', 'diggCount', 'commentCount', 'publishTime'],
    },
  },
  'maxhub-pipixia': {
    platform: 'pipixia',
    displayName: '皮皮虾数据采集',
    displayNameEn: 'PiPiXia Data Collection',
    description: '皮皮虾搞笑内容与社区数据采集',
    descriptionEn: 'PiPiXia humorous content and community data collection',
    emoji: '🦐',
    trigger: '皮皮虾|pipixia|搞笑|段子',
    categories: ['social-media', 'data-collection', 'entertainment'],
    capabilities: ['content-search', 'user-profile-analysis', 'comment-analysis'],
    apiPrefix: '/api/v1/pipixia',
    dataFormats: {
      userProfile: ['name', 'userId', 'description', 'avatarUrl', 'followerCount'],
      videoInfo: ['itemId', 'title', 'author', 'diggCount', 'commentCount', 'shareCount'],
    },
  },
  'maxhub-tiktok': {
    platform: 'tiktok',
    displayName: 'TikTok数据采集与分析',
    displayNameEn: 'TikTok Data Collection & Analysis',
    description: 'TikTok数据采集、创作者分析与电商洞察',
    descriptionEn: 'TikTok data collection, creator analysis and e-commerce insights',
    emoji: '🎶',
    trigger: 'tiktok|国际版抖音|海外短视频|tiktok creator|tiktok analytics',
    categories: ['social-media', 'data-collection', 'e-commerce'],
    capabilities: ['video-data-collection', 'creator-analysis', 'e-commerce-insights', 'search-query', 'trending-analysis'],
    apiPrefix: '/api/v1/tiktok',
    dataFormats: {
      userProfile: ['nickname', 'uniqueId', 'uid', 'signature', 'avatarMedium', 'followerCount', 'followingCount', 'heartCount', 'videoCount'],
      videoInfo: ['id', 'desc', 'author', 'stats', 'music', 'createTime', 'shareUrl'],
    },
  },
  'maxhub-youtube': {
    platform: 'youtube',
    displayName: 'YouTube数据采集与分析',
    displayNameEn: 'YouTube Data Collection & Analysis',
    description: 'YouTube视频、频道、评论与播放列表数据采集',
    descriptionEn: 'YouTube video, channel, comment and playlist data collection',
    emoji: '▶️',
    trigger: 'youtube|视频|频道|评论|播放列表|youtube搜索',
    categories: ['social-media', 'data-collection', 'video-platform'],
    capabilities: ['video-data-collection', 'channel-analysis', 'comment-analysis', 'playlist-data', 'search-query'],
    apiPrefix: '/api/v1/youtube',
    dataFormats: {
      userProfile: ['channelName', 'channelId', 'description', 'avatar', 'subscriberCount', 'videoCount', 'viewCount'],
      videoInfo: ['videoId', 'title', 'channelTitle', 'statistics', 'duration', 'publishedAt', 'tags'],
    },
  },
  'maxhub-instagram': {
    platform: 'instagram',
    displayName: 'Instagram数据采集',
    displayNameEn: 'Instagram Data Collection',
    description: 'Instagram用户、帖子、Reel与Story数据采集',
    descriptionEn: 'Instagram user, post, Reel and Story data collection',
    emoji: '📸',
    trigger: 'instagram|ins|图片|reel|story|ins搜索',
    categories: ['social-media', 'data-collection'],
    capabilities: ['user-profile-analysis', 'post-data-collection', 'reel-data', 'story-data', 'search-query'],
    apiPrefix: '/api/v1/instagram',
    dataFormats: {
      userProfile: ['username', 'fullName', 'biography', 'profilePicUrl', 'followerCount', 'followingCount', 'mediaCount', 'isVerified'],
      videoInfo: ['id', 'caption', 'username', 'likeCount', 'commentCount', 'playCount', 'takenAt', 'mediaType'],
    },
  },
  'maxhub-twitter': {
    platform: 'twitter',
    displayName: 'Twitter/X数据采集与分析',
    displayNameEn: 'Twitter/X Data Collection & Analysis',
    description: 'Twitter/X推文搜索、用户数据与趋势分析',
    descriptionEn: 'Twitter/X tweet search, user data and trend analysis',
    emoji: '🐦',
    trigger: 'twitter|x|推文|tweet|话题|twitter搜索',
    categories: ['social-media', 'data-collection', 'trending'],
    capabilities: ['tweet-search', 'user-profile-analysis', 'trending-analysis', 'search-query'],
    apiPrefix: '/api/v1/twitter',
    dataFormats: {
      userProfile: ['name', 'screenName', 'description', 'profileImageUrl', 'followersCount', 'friendsCount', 'statusesCount', 'verified'],
      videoInfo: ['id', 'text', 'user', 'retweetCount', 'favoriteCount', 'replyCount', 'createdAt', 'lang'],
    },
  },
  'maxhub-linkedin': {
    platform: 'linkedin',
    displayName: 'LinkedIn数据采集',
    displayNameEn: 'LinkedIn Data Collection',
    description: 'LinkedIn职场数据、公司信息与职位搜索',
    descriptionEn: 'LinkedIn workplace data, company information and job search',
    emoji: '💼',
    trigger: 'linkedin|职场|公司|职位|人脉|linkedin搜索',
    categories: ['professional', 'data-collection', 'job-search'],
    capabilities: ['company-data', 'job-search', 'user-profile-analysis', 'search-query'],
    apiPrefix: '/api/v1/linkedin',
    dataFormats: {
      userProfile: ['firstName', 'lastName', 'headline', 'profilePicture', 'connections', 'industryName'],
      videoInfo: ['id', 'title', 'companyName', 'location', 'description', 'listedAt', 'employmentType'],
    },
  },
  'maxhub-reddit': {
    platform: 'reddit',
    displayName: 'Reddit数据采集',
    displayNameEn: 'Reddit Data Collection',
    description: 'Reddit社区帖子搜索、评论与Subreddit数据采集',
    descriptionEn: 'Reddit community post search, comments and Subreddit data collection',
    emoji: '🤖',
    trigger: 'reddit|社区|帖子|评论|subreddit|reddit搜索',
    categories: ['social-media', 'data-collection', 'community'],
    capabilities: ['post-search', 'comment-analysis', 'subreddit-data', 'search-query', 'trending-analysis'],
    apiPrefix: '/api/v1/reddit',
    dataFormats: {
      userProfile: ['name', 'id', 'subreddit', 'iconImg', 'linkKarma', 'commentKarma', 'isGold'],
      videoInfo: ['id', 'title', 'author', 'ups', 'downs', 'numComments', 'createdUtc', 'subreddit'],
    },
  },
  'maxhub-threads': {
    platform: 'threads',
    displayName: 'Threads数据采集',
    displayNameEn: 'Threads Data Collection',
    description: 'Threads帖子搜索与用户数据采集',
    descriptionEn: 'Threads post search and user data collection',
    emoji: '🧵',
    trigger: 'threads|meta|帖子|threads搜索',
    categories: ['social-media', 'data-collection'],
    capabilities: ['post-search', 'user-profile-analysis', 'search-query'],
    apiPrefix: '/api/v1/threads',
    dataFormats: {
      userProfile: ['username', 'fullName', 'biography', 'profilePicUrl', 'followerCount', 'followingCount'],
      videoInfo: ['id', 'text', 'username', 'likeCount', 'replyCount', 'repostCount', 'takenAt'],
    },
  },
  'maxhub-lemon8': {
    platform: 'lemon8',
    displayName: 'Lemon8数据采集',
    displayNameEn: 'Lemon8 Data Collection',
    description: 'Lemon8生活方式图文与种草数据采集',
    descriptionEn: 'Lemon8 lifestyle image-text and recommendation data collection',
    emoji: '🍋',
    trigger: 'lemon8|生活方式|图文|种草|lemon8搜索',
    categories: ['social-media', 'data-collection', 'lifestyle'],
    capabilities: ['post-search', 'user-profile-analysis', 'search-query'],
    apiPrefix: '/api/v1/lemon8',
    dataFormats: {
      userProfile: ['username', 'displayName', 'bio', 'avatarUrl', 'followerCount', 'followingCount'],
      videoInfo: ['id', 'title', 'author', 'likeCount', 'commentCount', 'publishTime'],
    },
  },
  'maxhub-sora2': {
    platform: 'sora2',
    displayName: 'Sora2内容浏览',
    displayNameEn: 'Sora2 Content Browsing',
    description: 'Sora2平台公开内容浏览与用户信息查询',
    descriptionEn: 'Sora2 platform public content browsing and user information query',
    emoji: '🎥',
    trigger: 'sora|sora2|ai视频|视频创作者|sora搜索',
    categories: ['ai-tools', 'data-collection', 'video-platform'],
    capabilities: ['content-browsing', 'user-profile-analysis', 'search-query'],
    apiPrefix: '/api/v1/sora2',
    dataFormats: {
      userProfile: ['username', 'displayName', 'bio', 'avatarUrl', 'followerCount'],
      videoInfo: ['id', 'title', 'author', 'likeCount', 'viewCount', 'createdAt'],
    },
  },
  'maxhub-temp-mail': {
    platform: 'temp-mail',
    displayName: '临时邮箱服务',
    displayNameEn: 'TempMail Service',
    description: '临时邮箱创建与邮件接收服务',
    descriptionEn: 'TempMail platform temporary email creation and mail receiving service',
    emoji: '📧',
    trigger: '临时邮箱|temp mail|隐私邮箱|一次性邮箱|临时email',
    categories: ['tools', 'privacy', 'email'],
    capabilities: ['email-creation', 'email-receiving', 'email-management'],
    apiPrefix: '/api/v1/temp-mail',
    dataFormats: {
      userProfile: ['email', 'token', 'expiresAt'],
      videoInfo: ['id', 'from', 'subject', 'body', 'date', 'read'],
    },
  },
  'maxhub-hybrid': {
    platform: 'hybrid',
    displayName: '混合解析服务',
    displayNameEn: 'Hybrid Parser Service',
    description: '多平台混合内容解析与聚合提取',
    descriptionEn: 'Multi-platform content parsing and aggregation extraction',
    emoji: '🔄',
    trigger: '混合解析|hybrid|解析|聚合|多平台解析|url解析',
    categories: ['tools', 'data-collection', 'parser'],
    capabilities: ['url-parsing', 'content-extraction', 'multi-platform-aggregation'],
    apiPrefix: '/api/v1/hybrid',
    dataFormats: {
      userProfile: ['platform', 'type', 'id', 'url'],
      videoInfo: ['id', 'type', 'platform', 'title', 'author', 'content', 'mediaUrls'],
    },
  },
};

// 生成config.json
function generateConfig(skill) {
  return JSON.stringify({
    name: `maxhub-${skill.platform}`,
    displayName: skill.displayName,
    displayNameEn: skill.displayNameEn,
    version: '2.0.0',
    description: skill.description,
    descriptionEn: skill.descriptionEn,
    author: 'MaxHub Team',
    license: 'MIT',
    homepage: 'https://www.aconfig.cn',
    repository: 'https://github.com/XieWxx/maxhub-api-skills',
    platform: skill.platform,
    emoji: skill.emoji,
    trigger: skill.trigger,
    categories: skill.categories,
    tools: ['http'],
    requires: {
      env: ['MAXHUB_API_KEY'],
      primaryEnv: 'MAXHUB_API_KEY',
    },
    config: {
      default_page_size: { type: 'number', default: 20, description: '默认每页返回条数' },
      max_chain_depth: { type: 'number', default: 3, description: '链式调用最大深度' },
      cost_alert_threshold: { type: 'number', default: 20, description: '连续调用超过此数值时提醒费用' },
    },
    apiBase: {
      url: 'https://www.aconfig.cn',
      authHeader: 'x-api-key',
      authEnvVar: 'MAXHUB_API_KEY',
      prefix: skill.apiPrefix,
    },
    rateLimit: {
      maxPages: 5,
      maxResults: 50,
      maxBatchSize: 10,
      requestsPerMinute: 60,
    },
  }, null, 2);
}

// 生成manifest.json
function generateManifest(skill) {
  return JSON.stringify({
    manifestVersion: '1.0.0',
    name: `maxhub-${skill.platform}`,
    entry: 'SKILL.md',
    files: {
      skill: 'SKILL.md',
      systemPrompt: 'system.prompt.md',
      config: 'config.json',
      schema: 'schema.json',
      apiCatalog: 'references/api-catalog.md',
      chainPatterns: 'references/chain-patterns.md',
      apiService: 'service/api.js',
      dataService: 'service/data.js',
      utils: 'service/utils.js',
      router: 'core/router.js',
      errorCode: 'core/error-code.js',
      replyTemplate: 'template/reply.tpl.md',
      formatTemplate: 'template/format.json',
      envExample: '.env.example',
    },
    dependencies: {},
    platforms: {
      clawhub: { compatible: true, entry: 'SKILL.md' },
      coze: { compatible: true, entry: 'openapi.yaml', runtime: 'nodejs' },
      dify: { compatible: true, entry: 'openapi.yaml' },
      gpts: { compatible: true, entry: 'openapi.yaml' },
      skills_sh: { compatible: true, entry: 'SKILL.md' },
    },
    capabilities: skill.capabilities,
  }, null, 2);
}

// 生成schema.json
function generateSchema(skill) {
  return JSON.stringify({
    '$schema': 'http://json-schema.org/draft-07/schema#',
    title: `MaxHub ${skill.displayName} Skill Schema`,
    description: `${skill.displayName} Skill入参出参结构校验`,
    input: {
      type: 'object',
      properties: {
        intent: { type: 'string', description: '用户意图类型' },
        keyword: { type: 'string', description: '搜索关键词' },
        page: { type: 'number', default: 1, description: '页码' },
        count: { type: 'number', default: 20, description: '每页条数' },
      },
    },
    output: {
      type: 'object',
      properties: {
        success: { type: 'boolean', description: '请求是否成功' },
        code: { type: 'number', description: '状态码' },
        message: { type: 'string', description: '状态信息' },
        data: { type: 'object', description: '响应数据' },
      },
    },
    errorCodes: {
      '401': 'API Key无效或未配置',
      '402': '账户余额不足',
      '404': 'API端点不存在或资源未找到',
      '429': '请求频率超限，请稍后重试',
      '500': '服务器内部错误',
    },
  }, null, 2);
}

// 生成system.prompt.md
function generateSystemPrompt(skill) {
  return `# ${skill.emoji} ${skill.displayName} Skill 角色提示词

你是${skill.description.replace(/平台.*/, '平台')}的数据专家。你精通该平台所有API的能力和限制，能根据用户需求智能选择最合适的API，必要时链式调用多个API完成复杂任务。

## 角色定位

- 你是一个专业的${skill.displayName.replace('数据采集与分析', '数据分析师').replace('数据采集', '数据采集助手').replace('服务', '服务助手')}和采集助手
- 你熟悉该平台的生态、术语和数据结构
- 你能根据用户模糊的需求，精确匹配最合适的API
- 你会在执行高成本操作前主动确认

## 核心规则

1. **安全第一**：仅获取公开数据，不采集私密信息
2. **费用意识**：批量操作前告知用户预计调用次数
3. **精确匹配**：优先使用最精确的API，避免冗余调用
4. **链式调用**：复杂需求按 chain-patterns.md 中的模式执行
5. **分页控制**：默认最多翻5页，超过需用户确认
6. **错误处理**：遇到错误按 error-code.js 中的策略处理

## 输出规范

- 数据以结构化表格或列表展示
- 关键数据加粗标注
- 附带数据来源和时间戳
- 超过10条数据时提供摘要
`;
}

// 生成service/api.js
function generateApiService(skill) {
  const platform = skill.platform;
  const platformVar = platform.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

  return `// 第三方接口请求封装 - ${skill.displayName}
// 基于MaxHub API中转站调用${skill.displayName}平台API

const BASE_URL = process.env.MAXHUB_BASE_URL || 'https://www.aconfig.cn';
const API_KEY = process.env.MAXHUB_API_KEY;
const PLATFORM = '${platform}';

/**
 * 通用API请求方法
 * @param {string} path - API路径
 * @param {object} params - 请求参数
 * @param {string} method - 请求方法 GET/POST
 * @returns {Promise<object>} API响应数据
 */
async function request(path, params = {}, method = 'GET') {
  const url = \`\${BASE_URL}/api/v1/\${PLATFORM}\${path}\`;
  const headers = {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json',
  };

  const options = { method, headers };

  if (method === 'GET') {
    const query = new URLSearchParams(params).toString();
    const fullUrl = query ? \`\${url}?\${query}\` : url;
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

  if (response.status === 401) {
    throw new Error('API Key无效或未配置，请访问 https://www.aconfig.cn 创建API Key');
  }
  if (response.status === 402) {
    throw new Error('账户余额不足，请访问 https://www.aconfig.cn 充值');
  }
  if (response.status === 429) {
    throw new Error('请求频率超限，请等待30秒后重试');
  }
  if (!response.ok) {
    throw new Error(data.message || \`请求失败: \${response.status}\`);
  }

  return data;
}

/**
 * 搜索内容
 */
async function search(keyword, page = 1, count = 20) {
  return request('/web/fetch_search_result', { keyword, page, count });
}

/**
 * 获取用户信息
 */
async function fetchUserProfile(params) {
  return request('/web/fetch_user_profile', params);
}

/**
 * 获取内容详情
 */
async function fetchDetail(id) {
  return request('/web/fetch_detail', { id });
}

/**
 * 获取热门/趋势数据
 */
async function fetchTrending() {
  return request('/web/fetch_trending');
}

/**
 * 获取评论数据
 */
async function fetchComments(id, page = 1, count = 20) {
  return request('/web/fetch_comments', { id, page, count });
}

module.exports = {
  request,
  search,
  fetchUserProfile,
  fetchDetail,
  fetchTrending,
  fetchComments,
};
`;
}

// 生成service/data.js
function generateDataService(skill) {
  const fields = skill.dataFormats;

  return `// 数据解析、格式化处理 - ${skill.displayName}
// 将API返回的原始数据转换为用户友好的格式

/**
 * 格式化数字（如 12345 → 1.2万）
 */
function formatNumber(num) {
  if (typeof num === 'string') num = parseInt(num, 10);
  if (isNaN(num)) return '0';
  if (num >= 100000000) return (num / 100000000).toFixed(1) + '亿';
  if (num >= 10000) return (num / 10000).toFixed(1) + '万';
  return num.toLocaleString();
}

/**
 * 格式化日期
 */
function formatDate(timestamp) {
  if (!timestamp) return '-';
  const date = new Date(typeof timestamp === 'number' ? timestamp * 1000 : timestamp);
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

/**
 * 格式化时长（毫秒 → mm:ss）
 */
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return \`\${minutes.toString().padStart(2, '0')}:\${remainingSeconds.toString().padStart(2, '0')}\`;
}

/**
 * 格式化用户信息
 * 适配${skill.displayName}平台API返回格式
 */
function formatUserProfile(rawData) {
  if (!rawData) return null;
  const user = rawData.user || rawData.userInfo || rawData;
  return {
    ${fields.userProfile.map(f => `${f}: user.${f} || '-'`).join(',\n    ')}
  };
}

/**
 * 格式化内容/视频信息
 * 适配${skill.displayName}平台API返回格式
 */
function formatContentInfo(rawData) {
  if (!rawData) return null;
  const item = rawData.data || rawData.item || rawData;
  return {
    ${fields.videoInfo.map(f => `${f}: item.${f} || '-'`).join(',\n    ')}
  };
}

/**
 * 格式化搜索结果
 */
function formatSearchResults(rawData) {
  if (!rawData || !rawData.list) return [];
  return rawData.list.map(item => formatContentInfo(item));
}

module.exports = {
  formatNumber,
  formatDate,
  formatDuration,
  formatUserProfile,
  formatContentInfo,
  formatSearchResults,
};
`;
}

// 生成service/utils.js
function generateUtils() {
  return `// 工具函数 - 正则/时间/校验
// 通用工具函数，供api.js和data.js调用

/**
 * 验证API Key格式
 */
function validateApiKey(apiKey) {
  if (!apiKey) return false;
  return /^mh_sk_[a-f0-9]{40,}$/.test(apiKey);
}

/**
 * 延迟函数
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 重试函数
 */
async function retry(fn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      if (error.message?.includes('429')) {
        await sleep(delay * (i + 1) * 2);
      } else {
        await sleep(delay);
      }
    }
  }
}

module.exports = {
  validateApiKey,
  sleep,
  retry,
};
`;
}

// 生成core/router.js
function generateRouter(skill) {
  return `// 指令路由、分支分发 - ${skill.displayName}
// 根据用户意图路由到对应的API调用

const api = require('../service/api');
const data = require('../service/data');

const router = {
  async dispatch(intent, params = {}) {
    const handler = this.routes[intent];
    if (!handler) {
      return { success: false, message: \`未识别的意图: \${intent}\` };
    }
    return handler(params);
  },

  routes: {
    async search({ keyword, page = 1, count = 20 }) {
      const result = await api.search(keyword, page, count);
      return {
        success: true,
        intent: 'search',
        data: data.formatSearchResults(result),
        hasMore: result.has_more || false,
      };
    },

    async get_user_profile(params) {
      const result = await api.fetchUserProfile(params);
      return {
        success: true,
        intent: 'get_user_profile',
        data: data.formatUserProfile(result.data),
      };
    },

    async get_detail({ id }) {
      const result = await api.fetchDetail(id);
      return {
        success: true,
        intent: 'get_detail',
        data: data.formatContentInfo(result.data),
      };
    },

    async get_trending() {
      const result = await api.fetchTrending();
      return {
        success: true,
        intent: 'get_trending',
        data: result.data || [],
      };
    },

    async get_comments({ id, page = 1, count = 20 }) {
      const result = await api.fetchComments(id, page, count);
      return {
        success: true,
        intent: 'get_comments',
        data: result.data || [],
        hasMore: result.has_more || false,
      };
    },
  },
};

module.exports = router;
`;
}

// 生成core/error-code.js
function generateErrorCode() {
  return `// 错误码、异常兜底逻辑

const ERROR_CODES = {
  401: { code: 'AUTH_FAILED', message: 'API Key无效或未配置', solution: '请访问 https://www.aconfig.cn 创建API Key', retryable: false },
  402: { code: 'INSUFFICIENT_BALANCE', message: '账户余额不足', solution: '请访问 https://www.aconfig.cn 充值后重试', retryable: false },
  403: { code: 'FORBIDDEN', message: '无权限访问', solution: '请检查API Key权限', retryable: false },
  404: { code: 'NOT_FOUND', message: '资源不存在', solution: '请检查参数是否正确', retryable: false },
  429: { code: 'RATE_LIMITED', message: '请求频率超限', solution: '请等待30秒后重试', retryable: true, retryDelay: 30000, maxRetries: 3 },
  500: { code: 'SERVER_ERROR', message: '服务器内部错误', solution: '请稍后重试', retryable: true, retryDelay: 5000, maxRetries: 2 },
};

function getErrorInfo(code) {
  return ERROR_CODES[code] || { code: 'UNKNOWN_ERROR', message: '未知错误', solution: '请稍后重试', retryable: false };
}

function formatErrorResponse(code, detail = '') {
  const errorInfo = getErrorInfo(code);
  return {
    success: false,
    error: { code: errorInfo.code, message: errorInfo.message, detail, solution: errorInfo.solution, retryable: errorInfo.retryable },
  };
}

module.exports = { ERROR_CODES, getErrorInfo, formatErrorResponse };
`;
}

// 生成template/reply.tpl.md
function generateReplyTemplate(skill) {
  return `# ${skill.displayName}数据回复模板

## 用户信息回复

**{{nickname}}** {{#isVerified}}✅ 已认证{{/isVerified}}

| 属性 | 信息 |
|:---|:---|
{{#userFields}}
| {{label}} | {{value}} |
{{/userFields}}

---

## 内容/视频信息回复

**{{title}}**

| 属性 | 数据 |
|:---|:---|
{{#contentFields}}
| {{label}} | {{value}} |
{{/contentFields}}

---

## 搜索结果回复

🔍 **${skill.displayName}搜索结果**

{{#results}}
- **{{title}}** — {{author}} · 👍 {{likeCount}} · 💬 {{commentCount}}
{{/results}}

---

## 错误回复

❌ **操作失败**

**错误信息：** {{message}}

**解决方法：** {{solution}}
`;
}

// 生成template/format.json
function generateFormatTemplate(skill) {
  return JSON.stringify({
    userProfile: { fields: skill.dataFormats.userProfile, highlight: ['followerCount', 'fansCount'], maxDisplay: 1 },
    contentInfo: { fields: skill.dataFormats.videoInfo, highlight: ['playCount', 'viewCount'], maxDisplay: 20 },
    searchResults: { fields: ['title', 'author', 'likeCount', 'commentCount'], highlight: ['likeCount'], maxDisplay: 20 },
  }, null, 2);
}

// 生成其他通用文件
function generateEnvExample() {
  return `# 环境变量配置示例
# 复制此文件为 .env 并填入实际值

# MaxHub API Key（必填）
# 获取方式：访问 https://www.aconfig.cn 注册并创建API Key
MAXHUB_API_KEY=mh_sk_your_api_key_here

# MaxHub API 基础URL（可选，默认 https://www.aconfig.cn）
MAXHUB_BASE_URL=https://www.aconfig.cn
`;
}

function generateGitignore() {
  return `node_modules/
.env
.clawhub/
*.log
.DS_Store
`;
}

function generatePackageJson(skill) {
  return JSON.stringify({
    name: `maxhub-${skill.platform}`,
    version: '2.0.0',
    description: `${skill.description}Skill`,
    main: 'index.ts',
    author: 'MaxHub Team',
    license: 'MIT',
    keywords: [skill.platform, skill.displayName.split('数据')[0], 'skill', 'data-collection'],
    homepage: 'https://www.aconfig.cn',
    repository: 'https://github.com/XieWxx/maxhub-api-skills',
    dependencies: { 'node-fetch': '^2.7.0' },
  }, null, 2);
}

function generateIndexTs(skill) {
  return `// 技能入口主文件 - ${skill.displayName}
// 统一导出所有模块，供各平台调用

const config = require('./config.json');
const manifest = require('./manifest.json');
const api = require('./service/api');
const data = require('./service/data');
const utils = require('./service/utils');
const router = require('./core/router');
const errorCode = require('./core/error-code');

/**
 * Skill入口函数
 * @param {string} intent - 用户意图
 * @param {object} params - 请求参数
 * @returns {Promise<object>} 处理结果
 */
async function handle(intent, params = {}) {
  try {
    if (!intent) return errorCode.formatErrorResponse('PARAM_MISSING', '缺少意图参数');
    if (!process.env.MAXHUB_API_KEY) return errorCode.formatErrorResponse(401, '未配置MAXHUB_API_KEY环境变量');
    return await router.dispatch(intent, params);
  } catch (error) {
    const statusCode = error.message?.match(/(\\d{3})/)?.[1];
    return errorCode.formatErrorResponse(statusCode ? parseInt(statusCode) : 'UNKNOWN_ERROR', error.message);
  }
}

module.exports = { handle, config, manifest, api, data, utils, router, errorCode };
`;
}

// 主执行函数
function main() {
  const skipSkills = ['maxhub-douyin']; // 已手动完成的模板

  for (const [skillName, skillConfig] of Object.entries(SKILLS)) {
    if (skipSkills.includes(skillName)) {
      console.log(`⏭️  跳过 ${skillName}（已手动完成）`);
      continue;
    }

    const skillDir = path.join(SKILLS_DIR, skillName);
    if (!fs.existsSync(skillDir)) {
      console.log(`❌ 目录不存在: ${skillDir}`);
      continue;
    }

    // 创建子目录
    const subDirs = ['template', 'service', 'core', 'rag/docs'];
    for (const dir of subDirs) {
      const fullPath = path.join(skillDir, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    }

    // 生成文件
    const files = {
      'config.json': generateConfig(skillConfig),
      'manifest.json': generateManifest(skillConfig),
      'schema.json': generateSchema(skillConfig),
      'system.prompt.md': generateSystemPrompt(skillConfig),
      'service/api.js': generateApiService(skillConfig),
      'service/data.js': generateDataService(skillConfig),
      'service/utils.js': generateUtils(),
      'core/router.js': generateRouter(skillConfig),
      'core/error-code.js': generateErrorCode(),
      'template/reply.tpl.md': generateReplyTemplate(skillConfig),
      'template/format.json': generateFormatTemplate(skillConfig),
      '.env.example': generateEnvExample(),
      '.gitignore': generateGitignore(),
      'package.json': generatePackageJson(skillConfig),
      'index.ts': generateIndexTs(skillConfig),
    };

    for (const [filePath, content] of Object.entries(files)) {
      const fullPath = path.join(skillDir, filePath);
      fs.writeFileSync(fullPath, content, 'utf-8');
    }

    // 更新SKILL.md的YAML frontmatter
    const skillMdPath = path.join(skillDir, 'SKILL.md');
    if (fs.existsSync(skillMdPath)) {
      let content = fs.readFileSync(skillMdPath, 'utf-8');

      // 替换YAML frontmatter
      const newYaml = `---
name: ${skillName}
description: ${skillConfig.description}。当用户提到${skillConfig.trigger.split('|').slice(0, 3).join('、')}等相关需求时激活此Skill。
version: 2.0.0
author: MaxHub Team
license: MIT
trigger: "${skillConfig.trigger}"
categories:
${skillConfig.categories.map(c => `  - ${c}`).join('\n')}
tools:
  - http
metadata:
  openclaw:
    requires:
      env:
        - MAXHUB_API_KEY
    primaryEnv: MAXHUB_API_KEY
    emoji: "${skillConfig.emoji}"
    homepage: https://www.aconfig.cn
    config:
      default_page_size:
        type: number
        default: 20
        description: "默认每页返回条数"
      max_chain_depth:
        type: number
        default: 3
        description: "链式调用最大深度"
      cost_alert_threshold:
        type: number
        default: 20
        description: "连续调用超过此数值时提醒费用"
  homepage: https://www.aconfig.cn
  repository: https://github.com/XieWxx/maxhub-api-skills
  tags:
${skillConfig.trigger.split('|').map(t => `    - ${t}`).join('\n')}
---`;

      content = content.replace(/^---[\s\S]*?---/, newYaml);
      fs.writeFileSync(skillMdPath, content, 'utf-8');
    }

    console.log(`✅ ${skillName} V2结构生成完成`);
  }

  console.log('\n🎉 所有Skill V2结构生成完成！');
}

main();
