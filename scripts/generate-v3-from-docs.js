#!/usr/bin/env node

/**
 * Skill V3 完整生成脚本
 * 基于 /docs/max-api-doc/ 中的 OpenAPI 文档生成精确的 Skill 文件
 * 
 * 解决的问题：
 * 1. index.ts 语法错误修复
 * 2. SKILL.md 场景放到认证上面，去除重复内容
 * 3. 基于 API 文档生成精确的参数和返回值
 * 4. data.js 兼容层设计，支持 API 返回参数变化时自动调整
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..');
const API_DOC_DIR = '/Users/mac/Ai学习/max-api/docs/max-api-doc/docs';

// 平台到文档目录的映射
const PLATFORM_DOC_MAP = {
  'maxhub-douyin': [
    'Douyin-Web-API', 'Douyin-App-V3-API', 'Douyin-Search-API',
    'Douyin-Billboard-API', 'Douyin-Creator-API', 'Douyin-Creator-V2-API',
    'Douyin-Index-API', 'Douyin-Xingtu-API', 'Douyin-Xingtu-V2-API',
  ],
  'maxhub-bilibili': ['Bilibili-Web-API', 'Bilibili-App-API'],
  'maxhub-xiaohongshu': ['Xiaohongshu-Web-API', 'Xiaohongshu-App-API', 'Xiaohongshu-V2-API'],
  'maxhub-weibo': ['Weibo-Web-API', 'Weibo-App-API'],
  'maxhub-wechat': ['WeChat-Web-API', 'WeChat-App-API'],
  'maxhub-zhihu': ['Zhihu-Web-API', 'Zhihu-App-API'],
  'maxhub-kuaishou': ['Kuaishou-App-API', 'Kuaishou-Web-API'],
  'maxhub-toutiao': ['Toutiao-Web-API', 'Toutiao-App-API'],
  'maxhub-xigua': ['Xigua-Web-API', 'Xigua-App-API'],
  'maxhub-pipixia': ['PiPiXia-App-API'],
  'maxhub-tiktok': ['TikTok-Web-API', 'TikTok-App-API', 'TikTok-V2-API'],
  'maxhub-youtube': ['YouTube-Web-API'],
  'maxhub-instagram': ['Instagram-V1-API', 'Instagram-V2-API', 'Instagram-V3-API'],
  'maxhub-twitter': ['Twitter-Web-API'],
  'maxhub-linkedin': ['LinkedIn-Web-API'],
  'maxhub-reddit': ['Reddit-Web-API'],
  'maxhub-threads': ['Threads-Web-API'],
  'maxhub-lemon8': ['Lemon8-Web-API'],
  'maxhub-sora2': ['Sora2-Web-API'],
  'maxhub-temp-mail': ['Temp-Mail-API'],
  'maxhub-hybrid': ['Hybrid-Parsing'],
};

// Skill 配置
const SKILL_CONFIGS = {
  'maxhub-douyin': { platform: 'douyin', displayName: '抖音数据采集与分析', emoji: '🎵', trigger: '抖音|douyin|短视频热搜|抖音达人|抖音直播|抖音热榜|抖音视频|抖音博主', categories: ['social-media', 'data-collection', 'content-analysis'], scenarios: [
    { title: '查看抖音热搜榜', input: '抖音热搜', output: '返回当前热搜榜单，包含排名、话题、热度值' },
    { title: '搜索抖音视频', input: '搜索抖音上关于AI绘画的热门视频', output: '返回视频列表，包含标题、作者、播放量、点赞数' },
    { title: '分析抖音博主', input: '分析抖音博主@某某某的数据', output: '返回博主信息，包含粉丝数、获赞数、作品数、IP属地' },
    { title: '获取视频详情', input: '这个抖音视频的数据 https://v.douyin.com/xxx', output: '返回视频详情，包含播放量、点赞、评论、分享、收藏数据' },
    { title: '查看直播数据', input: '这个抖音直播间有多少人在线', output: '返回直播间信息，包含观看人数、点赞数、直播状态' },
    { title: '获取视频评论', input: '这个视频的评论数据', output: '返回评论列表，包含评论内容、点赞数、IP属地' },
  ]},
  'maxhub-bilibili': { platform: 'bilibili', displayName: 'B站数据采集与分析', emoji: '📺', trigger: 'b站|bilibili|弹幕|番剧|up主|b站视频|哔哩哔哩', categories: ['social-media', 'data-collection', 'content-analysis'], scenarios: [
    { title: '搜索B站视频', input: '搜索B站上编程教程的视频', output: '返回视频列表，包含标题、UP主、播放量、弹幕数' },
    { title: '获取视频弹幕', input: '获取这个B站视频的弹幕数据', output: '返回弹幕列表，包含弹幕内容、时间点、弹幕类型' },
    { title: '查看UP主信息', input: '这个UP主有多少粉丝', output: '返回UP主信息，包含粉丝数、播放量、投稿数' },
  ]},
  'maxhub-xiaohongshu': { platform: 'xiaohongshu', displayName: '小红书数据采集与分析', emoji: '📕', trigger: '小红书|xiaohongshu|red|种草|笔记|小红书搜索', categories: ['social-media', 'data-collection', 'content-analysis'], scenarios: [
    { title: '搜索小红书笔记', input: '在小红书搜索平价护肤笔记', output: '返回笔记列表，包含标题、作者、点赞数、收藏数' },
    { title: '查看用户信息', input: '这个小红书博主的粉丝数', output: '返回用户信息，包含粉丝数、获赞数、笔记数' },
  ]},
  'maxhub-weibo': { platform: 'weibo', displayName: '微博数据采集与分析', emoji: '🔥', trigger: '微博|weibo|热搜|超话|话题|微博搜索', categories: ['social-media', 'data-collection', 'trending'], scenarios: [
    { title: '查看微博热搜', input: '微博热搜', output: '返回热搜榜单，包含排名、话题、热度值' },
    { title: '搜索微博话题', input: '搜索微博上关于科技的话题', output: '返回话题列表，包含阅读量、讨论量' },
  ]},
  'maxhub-wechat': { platform: 'wechat', displayName: '微信数据采集与分析', emoji: '💬', trigger: '微信|wechat|视频号|公众号|微信文章', categories: ['social-media', 'data-collection'], scenarios: [
    { title: '搜索公众号文章', input: '搜索关于AI的公众号文章', output: '返回文章列表，包含标题、公众号、阅读数' },
  ]},
  'maxhub-zhihu': { platform: 'zhihu', displayName: '知乎数据采集与分析', emoji: '💡', trigger: '知乎|zhihu|问答|专栏|话题|知乎搜索', categories: ['social-media', 'data-collection', 'knowledge-base'], scenarios: [
    { title: '搜索知乎问答', input: '知乎上关于AI的问答', output: '返回问答列表，包含问题、回答数、关注数' },
  ]},
  'maxhub-kuaishou': { platform: 'kuaishou', displayName: '快手数据采集与分析', emoji: '🎬', trigger: '快手|kuaishou|快手视频|快手直播|快手电商', categories: ['social-media', 'data-collection', 'e-commerce'], scenarios: [
    { title: '搜索快手视频', input: '搜索快手上的美食视频', output: '返回视频列表，包含标题、作者、播放量' },
  ]},
  'maxhub-toutiao': { platform: 'toutiao', displayName: '头条数据采集与分析', emoji: '📰', trigger: '头条|toutiao|新闻|资讯|今日头条', categories: ['news', 'data-collection', 'trending'], scenarios: [
    { title: '搜索头条新闻', input: '搜索今日头条上的科技新闻', output: '返回新闻列表，包含标题、来源、评论数' },
  ]},
  'maxhub-xigua': { platform: 'xigua', displayName: '西瓜视频数据采集', emoji: '🍉', trigger: '西瓜视频|xigua|长视频|西瓜搜索', categories: ['social-media', 'data-collection', 'video-platform'], scenarios: [
    { title: '搜索西瓜视频', input: '搜索西瓜视频上的纪录片', output: '返回视频列表，包含标题、播放量、时长' },
  ]},
  'maxhub-pipixia': { platform: 'pipixia', displayName: '皮皮虾数据采集', emoji: '🦐', trigger: '皮皮虾|pipixia|搞笑|段子', categories: ['social-media', 'data-collection', 'entertainment'], scenarios: [
    { title: '搜索搞笑内容', input: '皮皮虾上的搞笑段子', output: '返回内容列表，包含标题、点赞数、评论数' },
  ]},
  'maxhub-tiktok': { platform: 'tiktok', displayName: 'TikTok数据采集与分析', emoji: '🎶', trigger: 'tiktok|国际版抖音|海外短视频|tiktok creator|tiktok analytics', categories: ['social-media', 'data-collection', 'e-commerce'], scenarios: [
    { title: '搜索TikTok视频', input: 'Search TikTok videos about AI art', output: '返回视频列表，包含标题、作者、播放量、点赞数' },
    { title: '查看创作者数据', input: 'TikTok creator @xxx analytics', output: '返回创作者信息，包含粉丝数、点赞数、视频数' },
  ]},
  'maxhub-youtube': { platform: 'youtube', displayName: 'YouTube数据采集与分析', emoji: '▶️', trigger: 'youtube|视频|频道|评论|播放列表|youtube搜索', categories: ['social-media', 'data-collection', 'video-platform'], scenarios: [
    { title: '搜索YouTube视频', input: 'Search YouTube for AI tutorials', output: '返回视频列表，包含标题、频道、观看数、点赞数' },
  ]},
  'maxhub-instagram': { platform: 'instagram', displayName: 'Instagram数据采集', emoji: '📸', trigger: 'instagram|ins|图片|reel|story|ins搜索', categories: ['social-media', 'data-collection'], scenarios: [
    { title: '搜索Instagram用户', input: 'Search Instagram user @xxx', output: '返回用户信息，包含粉丝数、帖子数、认证状态' },
  ]},
  'maxhub-twitter': { platform: 'twitter', displayName: 'Twitter/X数据采集与分析', emoji: '🐦', trigger: 'twitter|x|推文|tweet|话题|twitter搜索', categories: ['social-media', 'data-collection', 'trending'], scenarios: [
    { title: '搜索推文', input: 'Search tweets about AI', output: '返回推文列表，包含内容、转发数、点赞数' },
  ]},
  'maxhub-linkedin': { platform: 'linkedin', displayName: 'LinkedIn数据采集', emoji: '💼', trigger: 'linkedin|职场|公司|职位|人脉|linkedin搜索', categories: ['professional', 'data-collection', 'job-search'], scenarios: [
    { title: '搜索公司信息', input: 'LinkedIn company info for Google', output: '返回公司信息，包含员工数、行业、简介' },
  ]},
  'maxhub-reddit': { platform: 'reddit', displayName: 'Reddit数据采集', emoji: '🤖', trigger: 'reddit|社区|帖子|评论|subreddit|reddit搜索', categories: ['social-media', 'data-collection', 'community'], scenarios: [
    { title: '搜索Reddit帖子', input: 'Search Reddit for AI news', output: '返回帖子列表，包含标题、投票数、评论数' },
  ]},
  'maxhub-threads': { platform: 'threads', displayName: 'Threads数据采集', emoji: '🧵', trigger: 'threads|meta|帖子|threads搜索', categories: ['social-media', 'data-collection'], scenarios: [
    { title: '搜索Threads帖子', input: 'Search Threads for AI discussion', output: '返回帖子列表，包含内容、点赞数、回复数' },
  ]},
  'maxhub-lemon8': { platform: 'lemon8', displayName: 'Lemon8数据采集', emoji: '🍋', trigger: 'lemon8|生活方式|图文|种草|lemon8搜索', categories: ['social-media', 'data-collection', 'lifestyle'], scenarios: [
    { title: '搜索Lemon8笔记', input: 'Search Lemon8 for skincare tips', output: '返回笔记列表，包含标题、作者、点赞数' },
  ]},
  'maxhub-sora2': { platform: 'sora2', displayName: 'Sora2内容浏览', emoji: '🎥', trigger: 'sora|sora2|ai视频|视频创作者|sora搜索', categories: ['ai-tools', 'data-collection', 'video-platform'], scenarios: [
    { title: '浏览Sora2内容', input: 'Browse Sora2 AI video creations', output: '返回内容列表，包含标题、作者、点赞数' },
  ]},
  'maxhub-temp-mail': { platform: 'temp-mail', displayName: '临时邮箱服务', emoji: '📧', trigger: '临时邮箱|temp mail|隐私邮箱|一次性邮箱|临时email', categories: ['tools', 'privacy', 'email'], scenarios: [
    { title: '创建临时邮箱', input: '帮我创建一个临时邮箱', output: '返回邮箱地址和Token，可用于接收邮件' },
    { title: '查看收件箱', input: '查看我的临时邮箱有没有收到邮件', output: '返回邮件列表，包含发件人、主题、内容' },
  ]},
  'maxhub-hybrid': { platform: 'hybrid', displayName: '混合解析服务', emoji: '🔄', trigger: '混合解析|hybrid|解析|聚合|多平台解析|url解析', categories: ['tools', 'data-collection', 'parser'], scenarios: [
    { title: '解析URL内容', input: '解析这个链接的内容 https://...', output: '返回解析结果，包含平台、类型、标题、作者' },
  ]},
};

// ==================== 解析 API 文档 ====================

/**
 * 从 API 文档目录解析所有 API 信息
 */
function parseApiDocs(docDirs) {
  const apis = [];

  for (const docDir of docDirs) {
    const dirPath = path.join(API_DOC_DIR, docDir);
    if (!fs.existsSync(dirPath)) continue;

    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md') && f !== 'README.md');

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      // 提取 YAML 中的 API 信息
      const yamlMatch = content.match(/```yaml\n([\s\S]*?)```/);
      if (!yamlMatch) continue;

      const yaml = yamlMatch[1];

      // 提取路径
      const pathMatch = yaml.match(/\/api\/v1\/[\w-]+\/[\w-]+\/[\w_-]+/);
      if (!pathMatch) continue;

      const apiPath = pathMatch[0];

      // 提取方法
      const method = yaml.match(/\s+(get|post):/i)?.[1]?.toUpperCase() || 'GET';

      // 提取摘要
      const summaryMatch = yaml.match(/summary:\s*(.+)/);
      const summary = summaryMatch ? summaryMatch[1].trim() : file.replace('.md', '');

      // 提取参数
      const params = [];
      const paramRegex = /name:\s*(\w+)\s*\n\s*in:\s*(\w+)\s*\n\s*description:\s*(.+?)(?:\n\s*required:\s*(true|false))?/g;
      let paramMatch;
      while ((paramMatch = paramRegex.exec(yaml)) !== null) {
        params.push({
          name: paramMatch[1],
          in: paramMatch[2],
          description: paramMatch[3].trim(),
          required: paramMatch[4] === 'true',
        });
      }

      // 提取中文描述
      const descMatch = yaml.match(/### 用途:\s*\n\s*-\s*(.+)/);
      const description = descMatch ? descMatch[1].trim() : '';

      // 提取返回描述
      const returnMatch = yaml.match(/### 返回:\s*\n\s*-\s*(.+)/);
      const returnDesc = returnMatch ? returnMatch[1].trim() : '';

      // 从文件名提取分类
      const category = docDir.replace(/-API$/,'').replace(/-/g, ' ');

      apis.push({
        path: apiPath,
        method,
        summary,
        description,
        returnDesc,
        params,
        category,
        docFile: file,
        docDir,
      });
    }
  }

  return apis;
}

// ==================== 生成 data.js（兼容层设计） ====================

function generateDataJs(platform, apis) {
  // 按分类分组
  const categories = {};
  for (const api of apis) {
    const cat = api.docDir.replace(/-API$/, '').replace(/-/g, '_');
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(api);
  }

  let code = `// 数据解析、格式化处理 - ${platform}
// 兼容层设计：支持API返回参数变化时自动调整
// 当API返回字段与预期不一致时，使用fallback策略提取数据

/**
 * 安全取值 - 兼容层核心函数
 * 按优先级尝试多个可能的字段路径，返回第一个有效值
 * @param {object} obj - 数据对象
 * @param {string[]} paths - 字段路径数组（按优先级排序）
 * @param {*} defaultValue - 默认值
 * @returns {*} 取到的值
 */
function safeGet(obj, paths, defaultValue = '-') {
  if (!obj) return defaultValue;
  for (const path of paths) {
    const value = path.split('.').reduce((o, k) => o?.[k], obj);
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return defaultValue;
}

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
  const date = new Date(typeof timestamp === 'number' ? (timestamp > 1e12 ? timestamp : timestamp * 1000) : timestamp);
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
  for (const [cat, catApis] of Object.entries(categories)) {
    const funcName = cat.charAt(0).toUpperCase() + cat.slice(1);

    code += `/**
 * 格式化${cat.replace(/_/g, ' ')}数据
 * 使用 safeGet 兼容不同API版本的返回字段差异
 */
function format${funcName}(rawData) {
  if (!rawData) return null;
  const item = rawData.data || rawData.aweme_detail || rawData.item || rawData;

  return {
    id: safeGet(item, ['aweme_id', 'id', 'item_id', 'note_id', 'bvid', 'video_id', 'uid']),
    title: safeGet(item, ['desc', 'title', 'caption', 'text', 'content']),
    author: safeGet(item, ['author.nickname', 'author.name', 'author.userName', 'user.nickname', 'owner.name', 'channelTitle']),
    authorId: safeGet(item, ['author.uid', 'author.id', 'author.user_id', 'user.uid', 'owner.mid']),
    cover: safeGet(item, ['video.cover.url_list.0', 'cover', 'pic', 'thumbnail', 'avatar']),
    stats: {
      playCount: formatNumber(safeGet(item, ['statistics.play_count', 'stat.play', 'stat.view', 'playCount', 'viewCount', 'play_count'], 0)),
      likeCount: formatNumber(safeGet(item, ['statistics.digg_count', 'stat.like', 'stat.likes', 'likeCount', 'diggCount', 'likes'], 0)),
      commentCount: formatNumber(safeGet(item, ['statistics.comment_count', 'stat.comment', 'stat.comments', 'commentCount', 'comments'], 0)),
      shareCount: formatNumber(safeGet(item, ['statistics.share_count', 'stat.share', 'stat.shares', 'shareCount', 'shares', 'repostCount'], 0)),
      collectCount: formatNumber(safeGet(item, ['statistics.collect_count', 'stat.favorite', 'stat.favorites', 'collectCount', 'favoriteCount'], 0)),
    },
    createTime: formatDate(safeGet(item, ['create_time', 'publishTime', 'createdAt', 'created_time', 'pubdate', 'publishedAt'])),
    duration: formatDuration(safeGet(item, ['duration', 'video.duration', 'length'], 0)),
  };
}

`;
  }

  // 通用格式化函数
  code += `/**
 * 通用数据格式化 - 自动检测数据类型并选择格式化函数
 * 兼容API返回参数变化：当字段名变化时，safeGet会自动尝试备选字段
 */
function formatData(apiPath, rawData) {
  if (!rawData) return null;

  // 列表数据处理
  const list = rawData.list || rawData.data?.list || rawData.items || rawData.videos || rawData.aweme_list;
  if (list && Array.isArray(list)) {
    return list.map(item => ({
      id: safeGet(item, ['aweme_id', 'id', 'item_id', 'note_id', 'bvid']),
      title: safeGet(item, ['desc', 'title', 'caption', 'text']),
      author: safeGet(item, ['author.nickname', 'author.name']),
      playCount: formatNumber(safeGet(item, ['statistics.play_count', 'playCount'], 0)),
      likeCount: formatNumber(safeGet(item, ['statistics.digg_count', 'likeCount', 'diggCount'], 0)),
    }));
  }

  // 单条数据处理
  return {
    id: safeGet(rawData, ['aweme_id', 'id', 'item_id', 'note_id', 'bvid']),
    title: safeGet(rawData, ['desc', 'title', 'caption', 'text']),
  };
}

module.exports = {
  safeGet,
  formatNumber,
  formatDate,
  formatDuration,
  formatData,
${Object.keys(categories).map(cat => {
  const funcName = cat.charAt(0).toUpperCase() + cat.slice(1);
  return `  format${funcName},`;
}).join('\n')}
};
`;

  return code;
}

// ==================== 生成 SKILL.md ====================

function generateSkillMd(config, apis) {
  let md = `---
name: maxhub-${config.platform}
description: ${config.displayName}。当用户提到${config.trigger.split('|').slice(0, 3).join('、')}等相关需求时激活此Skill。
version: 2.0.0
author: MaxHub Team
license: MIT
trigger: "${config.trigger}"
categories:
${config.categories.map(c => `  - ${c}`).join('\n')}
tools:
  - http
metadata:
  openclaw:
    requires:
      env:
        - MAXHUB_API_KEY
    primaryEnv: MAXHUB_API_KEY
    emoji: "${config.emoji}"
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
${config.trigger.split('|').map(t => `    - ${t}`).join('\n')}
---

# ${config.emoji} ${config.displayName}

## 🎯 我能做什么

以下是你可以用自然语言向我提问的真实场景：

`;

  for (const scenario of config.scenarios) {
    md += `### ${scenario.title}\n\n`;
    md += `**你说：** \`${scenario.input}\`\n\n`;
    md += `**我返回：** ${scenario.output}\n\n`;
  }

  md += `> 💡 只要用自然语言描述你的需求，我会自动选择最合适的API来获取数据！\n\n---\n\n`;

  // 认证方式（场景之后）
  md += `## 🔑 认证方式\n\n`;
  md += `本 Skill 需要通过 MaxHub API Key 进行认证：\n\n`;
  md += `1. 访问 [MaxHub API](https://www.aconfig.cn) 注册账号\n`;
  md += `2. 在用户中心创建 API Key\n`;
  md += `3. 将 API Key 配置到环境变量 \`MAXHUB_API_KEY\`\n\n`;
  md += `> 新用户注册即赠送 ¥0.10 体验金\n\n---\n\n`;

  // API 能力概览
  md += `## 📋 API 能力概览\n\n`;
  md += `共 **${apis.length}** 个 API，覆盖以下能力：\n\n`;

  // 按分类分组
  const catGroups = {};
  for (const api of apis) {
    const cat = api.docDir.replace(/-API$/, '').replace(/-/g, ' ');
    if (!catGroups[cat]) catGroups[cat] = [];
    catGroups[cat].push(api);
  }

  for (const [cat, catApis] of Object.entries(catGroups)) {
    md += `### ${cat}（${catApis.length}个API）\n\n`;
    md += `| API | 方法 | 必填参数 | 说明 |\n`;
    md += `|:---|:---|:---|:---|\n`;
    for (const api of catApis.slice(0, 10)) { // 每类最多展示10个
      const shortPath = api.path.replace(`/api/v1/${config.platform}/`, '');
      const requiredParams = api.params.filter(p => p.required).map(p => p.name).join(', ') || '-';
      md += `| \`${shortPath}\` | ${api.method} | ${requiredParams} | ${api.description || api.summary} |\n`;
    }
    if (catApis.length > 10) {
      md += `| ... | | | 还有 ${catApis.length - 10} 个API |\n`;
    }
    md += `\n`;
  }

  md += `---\n\n`;

  // 常见错误
  md += `## ⚠️ 常见错误\n\n`;
  md += `| 错误码 | 原因 | 解决方法 |\n`;
  md += `|:---|:---|:---|\n`;
  md += `| 401 | API Key无效或未配置 | 访问 https://www.aconfig.cn 创建API Key |\n`;
  md += `| 402 | 账户余额不足 | 访问 https://www.aconfig.cn 充值 |\n`;
  md += `| 429 | 请求频率超限 | 等待30秒后重试 |\n`;
  md += `| 404 | API端点不存在 | 检查API路径是否正确 |\n\n`;

  // 安全声明
  md += `---\n\n## 🔒 安全声明\n\n`;
  md += `- 本 Skill **仅** 获取平台已公开的信息\n`;
  md += `- API Key 通过环境变量安全传递，**不会** 被存储或转发\n`;
  md += `- 所有请求均通过 HTTPS 加密传输\n`;
  md += `- 本 Skill **不会** 读取浏览器 Cookie 或其他敏感信息\n`;

  return md;
}

// ==================== 生成 reply.tpl.md ====================

function generateReplyTemplate(config, apis) {
  let template = `# ${config.emoji} ${config.displayName} 回复模板\n\n`;

  // 按分类分组
  const catGroups = {};
  for (const api of apis) {
    const cat = api.docDir.replace(/-API$/, '').replace(/-/g, ' ');
    if (!catGroups[cat]) catGroups[cat] = [];
    catGroups[cat].push(api);
  }

  for (const [cat, catApis] of Object.entries(catGroups)) {
    template += `## ${cat}\n\n`;

    for (const api of catApis.slice(0, 5)) { // 每类展示前5个
      const shortPath = api.path.replace(`/api/v1/${config.platform}/`, '');
      const requiredParams = api.params.filter(p => p.required);

      template += `### ${api.summary}\n\n`;
      template += `\`${api.method} ${api.path}\`\n\n`;

      if (requiredParams.length > 0) {
        template += `**必填参数：**\n\n`;
        template += `| 参数 | 说明 |\n|:---|:---|\n`;
        for (const p of requiredParams) {
          template += `| ${p.name} | ${p.description} |\n`;
        }
        template += `\n`;
      }

      template += `**返回数据展示：**\n\n`;
      template += `| 字段 | 说明 |\n|:---|:---|\n`;
      template += `| ID | 内容唯一标识 |\n`;
      template += `| 标题 | 内容标题/描述 |\n`;
      template += `| 作者 | 创作者昵称 |\n`;
      template += `| 播放量 | 播放/浏览次数 |\n`;
      template += `| 点赞数 | 点赞/喜欢次数 |\n`;
      template += `| 评论数 | 评论条数 |\n`;
      template += `| 发布时间 | 内容创建时间 |\n`;
      if (api.returnDesc) {
        template += `| 数据说明 | ${api.returnDesc} |\n`;
      }
      template += `\n---\n\n`;
    }

    if (catApis.length > 5) {
      template += `> 该分类下还有 ${catApis.length - 5} 个API，详见 api-catalog.md\n\n`;
    }
  }

  template += `## 错误回复\n\n`;
  template += `❌ **操作失败**\n\n`;
  template += `| 字段 | 内容 |\n|:---|:---|\n`;
  template += `| 错误码 | {{code}} |\n`;
  template += `| 错误信息 | {{message}} |\n`;
  template += `| 解决方法 | {{solution}} |\n`;

  return template;
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

    // 解析 API 文档
    const docDirs = PLATFORM_DOC_MAP[skillDir] || [];
    const apis = parseApiDocs(docDirs);
    totalApis += apis.length;

    console.log(`📦 ${skillDir}: 从文档解析到 ${apis.length} 个API`);

    // 1. 生成 data.js（兼容层）
    if (apis.length > 0) {
      const dataJs = generateDataJs(config.platform, apis);
      fs.writeFileSync(path.join(skillPath, 'service', 'data.js'), dataJs, 'utf-8');
    }

    // 2. 生成 SKILL.md（场景在前，认证在后，去重）
    const skillMd = generateSkillMd(config, apis);
    fs.writeFileSync(path.join(skillPath, 'SKILL.md'), skillMd, 'utf-8');

    // 3. 生成 reply.tpl.md
    const replyTpl = generateReplyTemplate(config, apis);
    fs.writeFileSync(path.join(skillPath, 'template', 'reply.tpl.md'), replyTpl, 'utf-8');

    console.log(`  ✅ data.js + SKILL.md + reply.tpl.md 已更新`);
  }

  console.log(`\n🎉 完成！共处理 ${skillDirs.length} 个 Skill，${totalApis} 个 API`);
}

main();
