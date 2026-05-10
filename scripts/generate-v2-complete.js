#!/usr/bin/env node

/**
 * Skill V2 完整生成脚本
 * 从api-catalog.md解析所有API，生成完整的api.js/data.js/reply.tpl.md/SKILL.md
 * 解决4个问题：
 * 1. 语法错误修复
 * 2. api.js包含所有API
 * 3. 回复模板对应不同API返回参数
 * 4. SKILL.md增加真实使用场景并调整结构
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..');

// ==================== API Catalog 解析器 ====================

/**
 * 从api-catalog.md解析所有API条目
 */
function parseApiCatalog(filePath) {
  if (!fs.existsSync(filePath)) return [];

  const content = fs.readFileSync(filePath, 'utf-8');
  const apis = [];
  let currentCategory = '';

  const lines = content.split('\n');
  for (const line of lines) {
    // 匹配分类标题：## 分类名（N个API）
    const catMatch = line.match(/^## (.+?)(?:（\d+个API）)?/);
    if (catMatch && !line.startsWith('###') && !line.startsWith('# ')) {
      currentCategory = catMatch[1].trim();
      continue;
    }

    // 匹配表格数据行：| 序号 | 名称 | 方法 | 路径 | 必填参数 |
    const rowRe = /^\|\s*(\d+)\s*\|\s*(.+?)\s*\|\s*(GET|POST)\s*\|\s*`?(\/[^`|\s]+)`?\s*\|\s*(.+?)\s*\|/;
    const rowMatch = line.match(rowRe);
    if (rowMatch) {
      const rawParams = rowMatch[5].trim();
      const requiredParams = rawParams === '-'
        ? []
        : rawParams.split(',').map(p => p.trim()).filter(Boolean);

      apis.push({
        category: currentCategory,
        index: parseInt(rowMatch[1]),
        name: rowMatch[2].trim(),
        method: rowMatch[3],
        path: rowMatch[4].trim(),
        requiredParams,
      });
    }
  }

  return apis;
}

// ==================== Skill 配置 ====================

const SKILL_CONFIGS = {
  'maxhub-douyin': {
    platform: 'douyin',
    displayName: '抖音数据采集与分析',
    emoji: '🎵',
    trigger: '抖音|douyin|短视频热搜|抖音达人|抖音直播|抖音热榜|抖音视频|抖音博主',
    categories: ['social-media', 'data-collection', 'content-analysis'],
    scenarios: [
      { title: '查看抖音热搜榜', input: '抖音热搜', output: '返回当前热搜榜单，包含排名、话题、热度值' },
      { title: '搜索抖音视频', input: '搜索抖音上关于AI绘画的热门视频', output: '返回视频列表，包含标题、作者、播放量、点赞数' },
      { title: '分析抖音博主', input: '分析抖音博主@某某某的数据', output: '返回博主信息，包含粉丝数、获赞数、作品数、IP属地' },
      { title: '获取视频详情', input: '这个抖音视频的数据 https://v.douyin.com/xxx', output: '返回视频详情，包含播放量、点赞、评论、分享、收藏数据' },
      { title: '查看直播数据', input: '这个抖音直播间有多少人在线', output: '返回直播间信息，包含观看人数、点赞数、直播状态' },
      { title: '获取视频评论', input: '这个视频的评论数据', output: '返回评论列表，包含评论内容、点赞数、IP属地' },
    ],
  },
  'maxhub-bilibili': {
    platform: 'bilibili',
    displayName: 'B站数据采集与分析',
    emoji: '📺',
    trigger: 'b站|bilibili|弹幕|番剧|up主|b站视频|哔哩哔哩',
    categories: ['social-media', 'data-collection', 'content-analysis'],
    scenarios: [
      { title: '搜索B站视频', input: '搜索B站上编程教程的视频', output: '返回视频列表，包含标题、UP主、播放量、弹幕数' },
      { title: '获取视频弹幕', input: '获取这个B站视频的弹幕数据', output: '返回弹幕列表，包含弹幕内容、时间点、弹幕类型' },
      { title: '查看UP主信息', input: '这个UP主有多少粉丝', output: '返回UP主信息，包含粉丝数、播放量、投稿数' },
      { title: '获取视频评论', input: '这个B站视频的评论', output: '返回评论列表，包含内容、点赞数、回复数' },
    ],
  },
  'maxhub-xiaohongshu': {
    platform: 'xiaohongshu',
    displayName: '小红书数据采集与分析',
    emoji: '📕',
    trigger: '小红书|xiaohongshu|red|种草|笔记|小红书搜索',
    categories: ['social-media', 'data-collection', 'content-analysis'],
    scenarios: [
      { title: '搜索小红书笔记', input: '在小红书搜索平价护肤笔记', output: '返回笔记列表，包含标题、作者、点赞数、收藏数' },
      { title: '查看用户信息', input: '这个小红书博主的粉丝数', output: '返回用户信息，包含粉丝数、获赞数、笔记数' },
      { title: '获取笔记评论', input: '这个笔记的评论数据', output: '返回评论列表，包含内容、IP属地、点赞数' },
    ],
  },
  'maxhub-weibo': {
    platform: 'weibo',
    displayName: '微博数据采集与分析',
    emoji: '🔥',
    trigger: '微博|weibo|热搜|超话|话题|微博搜索',
    categories: ['social-media', 'data-collection', 'trending'],
    scenarios: [
      { title: '查看微博热搜', input: '微博热搜', output: '返回热搜榜单，包含排名、话题、热度值' },
      { title: '搜索微博话题', input: '搜索微博上关于科技的话题', output: '返回话题列表，包含阅读量、讨论量' },
      { title: '查看用户信息', input: '这个微博大V的粉丝数', output: '返回用户信息，包含粉丝数、微博数、认证信息' },
    ],
  },
  'maxhub-wechat': {
    platform: 'wechat',
    displayName: '微信数据采集与分析',
    emoji: '💬',
    trigger: '微信|wechat|视频号|公众号|微信文章',
    categories: ['social-media', 'data-collection'],
    scenarios: [
      { title: '搜索公众号文章', input: '搜索关于AI的公众号文章', output: '返回文章列表，包含标题、公众号、阅读数' },
      { title: '获取视频号数据', input: '这个视频号的数据', output: '返回视频号信息，包含粉丝数、视频数' },
    ],
  },
  'maxhub-zhihu': {
    platform: 'zhihu',
    displayName: '知乎数据采集与分析',
    emoji: '💡',
    trigger: '知乎|zhihu|问答|专栏|话题|知乎搜索',
    categories: ['social-media', 'data-collection', 'knowledge-base'],
    scenarios: [
      { title: '搜索知乎问答', input: '知乎上关于AI的问答', output: '返回问答列表，包含问题、回答数、关注数' },
      { title: '查看用户信息', input: '这个知乎大V的数据', output: '返回用户信息，包含粉丝数、回答数、文章数' },
    ],
  },
  'maxhub-kuaishou': {
    platform: 'kuaishou',
    displayName: '快手数据采集与分析',
    emoji: '🎬',
    trigger: '快手|kuaishou|快手视频|快手直播|快手电商',
    categories: ['social-media', 'data-collection', 'e-commerce'],
    scenarios: [
      { title: '搜索快手视频', input: '搜索快手上的美食视频', output: '返回视频列表，包含标题、作者、播放量' },
      { title: '查看直播数据', input: '这个快手直播间数据', output: '返回直播间信息，包含观看人数、点赞数' },
    ],
  },
  'maxhub-toutiao': {
    platform: 'toutiao',
    displayName: '头条数据采集与分析',
    emoji: '📰',
    trigger: '头条|toutiao|新闻|资讯|今日头条',
    categories: ['news', 'data-collection', 'trending'],
    scenarios: [
      { title: '搜索头条新闻', input: '搜索今日头条上的科技新闻', output: '返回新闻列表，包含标题、来源、评论数' },
      { title: '查看热点资讯', input: '头条热点', output: '返回热点列表，包含标题、热度值' },
    ],
  },
  'maxhub-xigua': {
    platform: 'xigua',
    displayName: '西瓜视频数据采集',
    emoji: '🍉',
    trigger: '西瓜视频|xigua|长视频|西瓜搜索',
    categories: ['social-media', 'data-collection', 'video-platform'],
    scenarios: [
      { title: '搜索西瓜视频', input: '搜索西瓜视频上的纪录片', output: '返回视频列表，包含标题、播放量、时长' },
    ],
  },
  'maxhub-pipixia': {
    platform: 'pipixia',
    displayName: '皮皮虾数据采集',
    emoji: '🦐',
    trigger: '皮皮虾|pipixia|搞笑|段子',
    categories: ['social-media', 'data-collection', 'entertainment'],
    scenarios: [
      { title: '搜索搞笑内容', input: '皮皮虾上的搞笑段子', output: '返回内容列表，包含标题、点赞数、评论数' },
    ],
  },
  'maxhub-tiktok': {
    platform: 'tiktok',
    displayName: 'TikTok数据采集与分析',
    emoji: '🎶',
    trigger: 'tiktok|国际版抖音|海外短视频|tiktok creator|tiktok analytics',
    categories: ['social-media', 'data-collection', 'e-commerce'],
    scenarios: [
      { title: '搜索TikTok视频', input: 'Search TikTok videos about AI art', output: '返回视频列表，包含标题、作者、播放量、点赞数' },
      { title: '查看创作者数据', input: 'TikTok creator @xxx analytics', output: '返回创作者信息，包含粉丝数、点赞数、视频数' },
      { title: '获取热门趋势', input: 'TikTok trending now', output: '返回热门趋势列表，包含标签、视频数' },
    ],
  },
  'maxhub-youtube': {
    platform: 'youtube',
    displayName: 'YouTube数据采集与分析',
    emoji: '▶️',
    trigger: 'youtube|视频|频道|评论|播放列表|youtube搜索',
    categories: ['social-media', 'data-collection', 'video-platform'],
    scenarios: [
      { title: '搜索YouTube视频', input: 'Search YouTube for AI tutorials', output: '返回视频列表，包含标题、频道、观看数、点赞数' },
      { title: '查看频道信息', input: 'YouTube channel stats for @xxx', output: '返回频道信息，包含订阅数、视频数、总观看数' },
      { title: '获取视频评论', input: 'Comments for this YouTube video', output: '返回评论列表，包含内容、点赞数、回复数' },
    ],
  },
  'maxhub-instagram': {
    platform: 'instagram',
    displayName: 'Instagram数据采集',
    emoji: '📸',
    trigger: 'instagram|ins|图片|reel|story|ins搜索',
    categories: ['social-media', 'data-collection'],
    scenarios: [
      { title: '搜索Instagram用户', input: 'Search Instagram user @xxx', output: '返回用户信息，包含粉丝数、帖子数、认证状态' },
      { title: '获取帖子数据', input: 'Instagram post data for this URL', output: '返回帖子信息，包含点赞数、评论数、媒体类型' },
    ],
  },
  'maxhub-twitter': {
    platform: 'twitter',
    displayName: 'Twitter/X数据采集与分析',
    emoji: '🐦',
    trigger: 'twitter|x|推文|tweet|话题|twitter搜索',
    categories: ['social-media', 'data-collection', 'trending'],
    scenarios: [
      { title: '搜索推文', input: 'Search tweets about AI', output: '返回推文列表，包含内容、转发数、点赞数' },
      { title: '查看用户信息', input: 'Twitter user @xxx stats', output: '返回用户信息，包含粉丝数、推文数、认证状态' },
      { title: '获取热门趋势', input: 'Twitter trending topics', output: '返回趋势列表，包含话题名、推文数' },
    ],
  },
  'maxhub-linkedin': {
    platform: 'linkedin',
    displayName: 'LinkedIn数据采集',
    emoji: '💼',
    trigger: 'linkedin|职场|公司|职位|人脉|linkedin搜索',
    categories: ['professional', 'data-collection', 'job-search'],
    scenarios: [
      { title: '搜索公司信息', input: 'LinkedIn company info for Google', output: '返回公司信息，包含员工数、行业、简介' },
      { title: '搜索职位', input: 'LinkedIn jobs for software engineer', output: '返回职位列表，包含标题、公司、地点、类型' },
    ],
  },
  'maxhub-reddit': {
    platform: 'reddit',
    displayName: 'Reddit数据采集',
    emoji: '🤖',
    trigger: 'reddit|社区|帖子|评论|subreddit|reddit搜索',
    categories: ['social-media', 'data-collection', 'community'],
    scenarios: [
      { title: '搜索Reddit帖子', input: 'Search Reddit for AI news', output: '返回帖子列表，包含标题、投票数、评论数' },
      { title: '查看Subreddit', input: 'Reddit r/technology top posts', output: '返回帖子列表，包含标题、作者、投票数' },
    ],
  },
  'maxhub-threads': {
    platform: 'threads',
    displayName: 'Threads数据采集',
    emoji: '🧵',
    trigger: 'threads|meta|帖子|threads搜索',
    categories: ['social-media', 'data-collection'],
    scenarios: [
      { title: '搜索Threads帖子', input: 'Search Threads for AI discussion', output: '返回帖子列表，包含内容、点赞数、回复数' },
    ],
  },
  'maxhub-lemon8': {
    platform: 'lemon8',
    displayName: 'Lemon8数据采集',
    emoji: '🍋',
    trigger: 'lemon8|生活方式|图文|种草|lemon8搜索',
    categories: ['social-media', 'data-collection', 'lifestyle'],
    scenarios: [
      { title: '搜索Lemon8笔记', input: 'Search Lemon8 for skincare tips', output: '返回笔记列表，包含标题、作者、点赞数' },
    ],
  },
  'maxhub-sora2': {
    platform: 'sora2',
    displayName: 'Sora2内容浏览',
    emoji: '🎥',
    trigger: 'sora|sora2|ai视频|视频创作者|sora搜索',
    categories: ['ai-tools', 'data-collection', 'video-platform'],
    scenarios: [
      { title: '浏览Sora2内容', input: 'Browse Sora2 AI video creations', output: '返回内容列表，包含标题、作者、点赞数' },
    ],
  },
  'maxhub-temp-mail': {
    platform: 'temp-mail',
    displayName: '临时邮箱服务',
    emoji: '📧',
    trigger: '临时邮箱|temp mail|隐私邮箱|一次性邮箱|临时email',
    categories: ['tools', 'privacy', 'email'],
    scenarios: [
      { title: '创建临时邮箱', input: '帮我创建一个临时邮箱', output: '返回邮箱地址和Token，可用于接收邮件' },
      { title: '查看收件箱', input: '查看我的临时邮箱有没有收到邮件', output: '返回邮件列表，包含发件人、主题、内容' },
    ],
  },
  'maxhub-hybrid': {
    platform: 'hybrid',
    displayName: '混合解析服务',
    emoji: '🔄',
    trigger: '混合解析|hybrid|解析|聚合|多平台解析|url解析',
    categories: ['tools', 'data-collection', 'parser'],
    scenarios: [
      { title: '解析URL内容', input: '解析这个链接的内容 https://...', output: '返回解析结果，包含平台、类型、标题、作者' },
      { title: '批量解析', input: '批量解析这些链接', output: '返回每个链接的解析结果' },
    ],
  },
};

// ==================== 生成 api.js ====================

function generateApiJs(platform, apis) {
  const platformVar = platform.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

  // 按分类分组
  const categories = {};
  for (const api of apis) {
    if (!categories[api.category]) categories[api.category] = [];
    categories[api.category].push(api);
  }

  let code = `// 第三方接口请求封装 - ${platform}
// 基于MaxHub API中转站调用，包含所有API

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
  const url = \`\${BASE_URL}\${path}\`;
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
  if (response.status === 401) throw new Error('API Key无效或未配置，请访问 https://www.aconfig.cn 创建API Key');
  if (response.status === 402) throw new Error('账户余额不足，请访问 https://www.aconfig.cn 充值');
  if (response.status === 429) throw new Error('请求频率超限，请等待30秒后重试');
  if (!response.ok) throw new Error(data.message || \`请求失败: \${response.status}\`);
  return data;
}

`;

  // 为每个分类生成API函数
  for (const [category, categoryApis] of Object.entries(categories)) {
    code += `// ==================== ${category} ====================\n\n`;

    for (const api of categoryApis) {
      // 生成函数名：从路径中提取
      const pathParts = api.path.split('/');
      const funcSuffix = pathParts[pathParts.length - 1];
      const funcName = funcSuffix.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

      // 生成参数
      const paramStr = api.requiredParams.map(p => `${p}`).join(', ');
      const paramObj = api.requiredParams.length > 0
        ? `{ ${api.requiredParams.join(', ')} }`
        : '{}';

      // 生成路径（去掉平台前缀，因为已经在request中拼接）
      const shortPath = api.path.replace(`/api/v1/${platform}`, '');

      const paramsObj = api.requiredParams.length > 0
        ? `{ ${api.requiredParams.join(', ')}, ...extraParams }`
        : '{ ...extraParams }';

      code += `/**
 * ${api.name}
 * ${api.method} ${api.path}
${api.requiredParams.length > 0 ? ` * @param {${api.requiredParams.map(() => 'string').join(', ')}} ${paramStr} - 必填参数` : ' * 无必填参数'}
 */
async function ${funcName}(${api.requiredParams.join(', ')}${api.requiredParams.length > 0 ? ', ' : ''}extraParams = {}) {
  const params = ${paramsObj};
  return request('${shortPath}', params${api.method === 'POST' ? ", 'POST'" : ''});
}

`;
    }
  }

  // 生成 module.exports
  const allFuncNames = apis.map(api => {
    const pathParts = api.path.split('/');
    const funcSuffix = pathParts[pathParts.length - 1];
    return funcSuffix.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
  });

  code += `module.exports = {\n  request,\n  ${allFuncNames.join(',\n  ')},\n};\n`;

  return code;
}

// ==================== 生成 data.js ====================

function generateDataJs(platform, apis) {
  // 按分类生成格式化函数
  const categories = {};
  for (const api of apis) {
    if (!categories[api.category]) categories[api.category] = [];
    categories[api.category].push(api);
  }

  let code = `// 数据解析、格式化处理 - ${platform}
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
  if (!ms) return '-';
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return \`\${minutes.toString().padStart(2, '0')}:\${remainingSeconds.toString().padStart(2, '0')}\`;
}

`;

  // 为每个分类生成格式化函数
  for (const [category, categoryApis] of Object.entries(categories)) {
    const funcName = category.replace(/[\/\\]/g, '').replace(/\s+/g, '_');

    code += `/**
 * 格式化${category}数据
 */
function format${funcName.charAt(0).toUpperCase() + funcName.slice(1)}(rawData) {
  if (!rawData) return null;
  const item = rawData.data || rawData.item || rawData.aweme_detail || rawData;
  return {
    id: item.id || item.aweme_id || item.itemId || item.note_id || '-',
    title: item.desc || item.title || item.caption || item.text || '-',
    author: item.author?.nickname || item.author?.name || item.author?.userName || '-',
    stats: {
      playCount: formatNumber(item.statistics?.play_count || item.stat?.play || item.playCount || 0),
      likeCount: formatNumber(item.statistics?.digg_count || item.stat?.like || item.likeCount || item.diggCount || 0),
      commentCount: formatNumber(item.statistics?.comment_count || item.stat?.comment || item.commentCount || 0),
      shareCount: formatNumber(item.statistics?.share_count || item.stat?.share || item.shareCount || 0),
    },
    createTime: formatDate(item.create_time || item.publishTime || item.createdAt || item.created_time),
  };
}

`;
  }

  // 通用格式化
  code += `/**
 * 通用数据格式化 - 根据API路径自动选择格式化函数
 */
function formatData(apiPath, rawData) {
  if (!rawData) return null;
  // 列表数据处理
  if (rawData.list || rawData.data?.list || rawData.items) {
    const list = rawData.list || rawData.data?.list || rawData.items || [];
    return list.map(item => ({
      id: item.id || item.aweme_id || item.itemId || '-',
      title: item.desc || item.title || item.caption || item.text || '-',
      author: item.author?.nickname || item.author?.name || '-',
      stats: {
        playCount: formatNumber(item.statistics?.play_count || item.playCount || 0),
        likeCount: formatNumber(item.statistics?.digg_count || item.likeCount || item.diggCount || 0),
      },
    }));
  }
  // 单条数据处理
  return {
    id: rawData.id || rawData.aweme_id || rawData.itemId || '-',
    title: rawData.desc || rawData.title || rawData.caption || rawData.text || '-',
  };
}

module.exports = {
  formatNumber,
  formatDate,
  formatDuration,
  formatData,
${Object.keys(categories).map(cat => {
  const funcName = cat.replace(/[\/\\]/g, '').replace(/\s+/g, '_');
  return `  format${funcName.charAt(0).toUpperCase() + funcName.slice(1)},`;
}).join('\n')}
};
`;

  return code;
}

// ==================== 生成 reply.tpl.md ====================

function generateReplyTemplate(config, apis) {
  const categories = {};
  for (const api of apis) {
    if (!categories[api.category]) categories[api.category] = [];
    categories[api.category].push(api);
  }

  let template = `# ${config.emoji} ${config.displayName} 回复模板

`;

  for (const [category, categoryApis] of Object.entries(categories)) {
    template += `## ${category}

`;

    for (const api of categoryApis.slice(0, 3)) { // 每个分类取前3个API生成模板
      const pathParts = api.path.split('/');
      const funcSuffix = pathParts[pathParts.length - 1];

      template += `### ${api.name}

\`${api.method} ${api.path}\`
${api.requiredParams.length > 0 ? `必填参数：${api.requiredParams.join(', ')}` : '无必填参数'}

**返回数据展示：**

| 字段 | 说明 |
|:---|:---|
| ID | 内容唯一标识 |
| 标题 | 内容标题/描述 |
| 作者 | 创作者昵称 |
| 播放量 | 播放/浏览次数 |
| 点赞数 | 点赞/喜欢次数 |
| 评论数 | 评论条数 |
| 分享数 | 分享次数 |
| 发布时间 | 内容创建时间 |

---

`;
    }
  }

  // 通用错误回复
  template += `## 错误回复

❌ **操作失败**

| 字段 | 内容 |
|:---|:---|
| 错误码 | {{code}} |
| 错误信息 | {{message}} |
| 解决方法 | {{solution}} |

{{#retryable}}
💡 可以稍后重试（建议等待{{retryDelay}}秒）
{{/retryable}}
`;

  return template;
}

// ==================== 生成 SKILL.md 场景部分 ====================

function generateSkillMdScenarios(config) {
  let md = '';

  md += `# ${config.emoji} ${config.displayName}\n\n`;

  // 场景展示放在最前面
  md += `## 🎯 我能做什么\n\n`;
  md += `以下是你可以用自然语言向我提问的真实场景：\n\n`;

  for (const scenario of config.scenarios) {
    md += `### ${scenario.title}\n\n`;
    md += `**你说：** \`${scenario.input}\`\n\n`;
    md += `**我返回：** ${scenario.output}\n\n`;
  }

  md += `> 💡 只要用自然语言描述你的需求，我会自动选择最合适的API来获取数据！\n\n`;

  md += `---\n\n`;

  return md;
}

// ==================== 主执行函数 ====================

function main() {
  const skillDirs = fs.readdirSync(SKILLS_DIR).filter(d =>
    d.startsWith('maxhub-') && fs.statSync(path.join(SKILLS_DIR, d)).isDirectory()
  );

  let totalApis = 0;

  for (const skillDir of skillDirs) {
    const skillPath = path.join(SKILLS_DIR, skillDir);
    const config = SKILL_CONFIGS[skillDir];
    if (!config) {
      console.log(`⚠️  跳过 ${skillDir}（无配置）`);
      continue;
    }

    // 解析api-catalog.md
    const catalogPath = path.join(skillPath, 'references', 'api-catalog.md');
    const apis = parseApiCatalog(catalogPath);
    totalApis += apis.length;

    console.log(`📦 ${skillDir}: 解析到 ${apis.length} 个API`);

    // 1. 生成 api.js（包含所有API）
    const apiJs = generateApiJs(config.platform, apis);
    fs.writeFileSync(path.join(skillPath, 'service', 'api.js'), apiJs, 'utf-8');

    // 2. 生成 data.js
    const dataJs = generateDataJs(config.platform, apis);
    fs.writeFileSync(path.join(skillPath, 'service', 'data.js'), dataJs, 'utf-8');

    // 3. 生成 reply.tpl.md
    const replyTpl = generateReplyTemplate(config, apis);
    fs.writeFileSync(path.join(skillPath, 'template', 'reply.tpl.md'), replyTpl, 'utf-8');

    // 4. 更新 SKILL.md - 在标题后插入场景，调整结构
    const skillMdPath = path.join(skillPath, 'SKILL.md');
    if (fs.existsSync(skillMdPath)) {
      let content = fs.readFileSync(skillMdPath, 'utf-8');

      // 找到YAML frontmatter结束位置
      const frontmatterEnd = content.indexOf('---', 3);
      if (frontmatterEnd !== -1) {
        const frontmatter = content.substring(0, frontmatterEnd + 3);
        let body = content.substring(frontmatterEnd + 3);

        // 移除旧的标题行（如果有的话）
        body = body.replace(/^#\s+.*?\n/, '');

        // 生成场景部分
        const scenariosMd = generateSkillMdScenarios(config);

        // 重新组合：frontmatter + 场景 + 原有内容
        content = frontmatter + '\n' + scenariosMd + body;
        fs.writeFileSync(skillMdPath, content, 'utf-8');
      }
    }

    console.log(`  ✅ api.js (${apis.length} APIs) + data.js + reply.tpl.md + SKILL.md 已更新`);
  }

  console.log(`\n🎉 完成！共处理 ${skillDirs.length} 个 Skill，${totalApis} 个 API`);
}

main();
