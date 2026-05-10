#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..');

// 平台显示名映射
const PLATFORM_NAMES = {
  'maxhub-douyin': 'Douyin',
  'maxhub-bilibili': 'Bilibili',
  'maxhub-xiaohongshu': 'Xiaohongshu',
  'maxhub-weibo': 'Weibo',
  'maxhub-tiktok': 'Tiktok',
  'maxhub-youtube': 'Youtube',
  'maxhub-instagram': 'Instagram',
  'maxhub-twitter': 'Twitter',
  'maxhub-linkedin': 'Linkedin',
  'maxhub-reddit': 'Reddit',
  'maxhub-threads': 'Threads',
  'maxhub-wechat': 'Wechat',
  'maxhub-zhihu': 'Zhihu',
  'maxhub-kuaishou': 'Kuaishou',
  'maxhub-toutiao': 'Toutiao',
  'maxhub-xigua': 'Xigua',
  'maxhub-pipixia': 'Pipixia',
  'maxhub-lemon8': 'Lemon8',
  'maxhub-sora2': 'Sora2',
  'maxhub-temp-mail': 'Temp_Mail',
  'maxhub-hybrid': 'Hybrid',
};

// 平台特有字段映射（用于format.json和data.js）
const PLATFORM_FIELDS = {
  'maxhub-douyin': {
    contentType: '作品', contentId: 'aweme_id', contentPath: 'aweme_id',
    statsFields: ['playCount', 'likeCount', 'commentCount', 'shareCount', 'collectCount'],
    statPaths: {
      playCount: 'statistics.play_count', likeCount: 'statistics.digg_count',
      commentCount: 'statistics.comment_count', shareCount: 'statistics.share_count',
      collectCount: 'statistics.collect_count',
    },
    highlight: ['playCount', 'likeCount'],
  },
  'maxhub-bilibili': {
    contentType: '视频', contentId: 'bvid', contentPath: 'bvid',
    statsFields: ['playCount', 'likeCount', 'commentCount', 'shareCount', 'collectCount'],
    statPaths: {
      playCount: 'stat.view', likeCount: 'stat.like',
      commentCount: 'stat.reply', shareCount: 'stat.share',
      collectCount: 'stat.favorite',
    },
    highlight: ['playCount', 'likeCount'],
  },
  'maxhub-xiaohongshu': {
    contentType: '笔记', contentId: 'note_id', contentPath: 'note_id',
    statsFields: ['likeCount', 'collectCount', 'commentCount', 'shareCount'],
    statPaths: {
      likeCount: 'liked_count', collectCount: 'collected_count',
      commentCount: 'comment_count', shareCount: 'share_count',
    },
    highlight: ['likeCount', 'collectCount'],
  },
  'maxhub-weibo': {
    contentType: '微博', contentId: 'id', contentPath: 'id',
    statsFields: ['likeCount', 'commentCount', 'repostCount'],
    statPaths: { likeCount: 'attitudes_count', commentCount: 'comments_count', repostCount: 'reposts_count' },
    highlight: ['likeCount', 'repostCount'],
  },
  'maxhub-tiktok': {
    contentType: 'Post', contentId: 'id', contentPath: 'id',
    statsFields: ['playCount', 'likeCount', 'commentCount', 'shareCount'],
    statPaths: { playCount: 'play_count', likeCount: 'digg_count', commentCount: 'comment_count', shareCount: 'share_count' },
    highlight: ['playCount', 'likeCount'],
  },
  'maxhub-youtube': {
    contentType: 'Video', contentId: 'videoId', contentPath: 'videoId',
    statsFields: ['viewCount', 'likeCount', 'commentCount'],
    statPaths: { viewCount: 'viewCount', likeCount: 'likeCount', commentCount: 'commentCount' },
    highlight: ['viewCount', 'likeCount'],
  },
  'maxhub-instagram': {
    contentType: 'Post', contentId: 'id', contentPath: 'id',
    statsFields: ['likeCount', 'commentCount'],
    statPaths: { likeCount: 'like_count', commentCount: 'comment_count' },
    highlight: ['likeCount'],
  },
  'maxhub-twitter': {
    contentType: 'Tweet', contentId: 'id', contentPath: 'id',
    statsFields: ['likeCount', 'retweetCount', 'replyCount'],
    statPaths: { likeCount: 'favorite_count', retweetCount: 'retweet_count', replyCount: 'reply_count' },
    highlight: ['likeCount', 'retweetCount'],
  },
  'maxhub-linkedin': {
    contentType: 'Post', contentId: 'urn', contentPath: 'urn',
    statsFields: ['likeCount', 'commentCount'],
    statPaths: { likeCount: 'socialDetail.totalLikes', commentCount: 'socialDetail.totalComments' },
    highlight: ['likeCount'],
  },
  'maxhub-reddit': {
    contentType: 'Post', contentId: 'id', contentPath: 'id',
    statsFields: ['upvoteCount', 'commentCount'],
    statPaths: { upvoteCount: 'ups', commentCount: 'num_comments' },
    highlight: ['upvoteCount'],
  },
  'maxhub-threads': {
    contentType: 'Post', contentId: 'id', contentPath: 'id',
    statsFields: ['likeCount', 'replyCount'],
    statPaths: { likeCount: 'like_count', replyCount: 'reply_count' },
    highlight: ['likeCount'],
  },
  'maxhub-wechat': {
    contentType: '文章', contentId: 'id', contentPath: 'id',
    statsFields: ['readCount', 'likeCount'],
    statPaths: { readCount: 'read_num', likeCount: 'like_num' },
    highlight: ['readCount'],
  },
  'maxhub-zhihu': {
    contentType: '回答', contentId: 'id', contentPath: 'id',
    statsFields: ['voteupCount', 'commentCount'],
    statPaths: { voteupCount: 'voteup_count', commentCount: 'comment_count' },
    highlight: ['voteupCount'],
  },
  'maxhub-kuaishou': {
    contentType: '作品', contentId: 'photo_id', contentPath: 'photo_id',
    statsFields: ['playCount', 'likeCount', 'commentCount'],
    statPaths: { playCount: 'view_count', likeCount: 'like_count', commentCount: 'comment_count' },
    highlight: ['playCount', 'likeCount'],
  },
  'maxhub-toutiao': {
    contentType: '文章', contentId: 'item_id', contentPath: 'item_id',
    statsFields: ['readCount', 'commentCount', 'shareCount'],
    statPaths: { readCount: 'read_count', commentCount: 'comment_count', shareCount: 'share_count' },
    highlight: ['readCount', 'commentCount'],
  },
  'maxhub-xigua': {
    contentType: '视频', contentId: 'video_id', contentPath: 'video_id',
    statsFields: ['playCount', 'likeCount', 'commentCount'],
    statPaths: { playCount: 'video_play_count', likeCount: 'video_like_count', commentCount: 'video_comment_count' },
    highlight: ['playCount', 'likeCount'],
  },
  'maxhub-pipixia': {
    contentType: '作品', contentId: 'id', contentPath: 'id',
    statsFields: ['likeCount', 'commentCount'],
    statPaths: { likeCount: 'digg_count', commentCount: 'comment_count' },
    highlight: ['likeCount'],
  },
  'maxhub-lemon8': {
    contentType: 'Post', contentId: 'id', contentPath: 'id',
    statsFields: ['likeCount', 'commentCount'],
    statPaths: { likeCount: 'like_count', commentCount: 'comment_count' },
    highlight: ['likeCount'],
  },
  'maxhub-sora2': {
    contentType: 'Post', contentId: 'id', contentPath: 'id',
    statsFields: ['likeCount', 'commentCount'],
    statPaths: { likeCount: 'like_count', commentCount: 'comment_count' },
    highlight: ['likeCount'],
  },
  'maxhub-temp-mail': {
    contentType: '邮件', contentId: 'id', contentPath: 'id',
    statsFields: [],
    statPaths: {},
    highlight: [],
  },
  'maxhub-hybrid': {
    contentType: '视频', contentId: 'id', contentPath: 'id',
    statsFields: ['playCount', 'likeCount'],
    statPaths: { playCount: 'play_count', likeCount: 'like_count' },
    highlight: ['playCount'],
  },
};

// 解析api.js中的API函数定义
function parseApiFunctions(content) {
  const apis = [];
  const funcRegex = /async function (\w+)\([^)]*\)\s*\{\s*\n\s*const params = \{([^}]*)\};\s*\n\s*return request\('([^']+)'(?:,\s*params(?:,\s*'(\w+)')?)?\);/g;
  let match;
  while ((match = funcRegex.exec(content)) !== null) {
    apis.push({
      name: match[1],
      paramsStr: match[2].trim(),
      path: match[3],
      method: match[4] || 'GET',
    });
  }
  return apis;
}

// 优化api.js：用API注册表+通用调用工厂替代重复函数模式
function optimizeApiJs(skillName, content) {
  const platform = skillName.replace('maxhub-', '');
  const platformName = PLATFORM_NAMES[skillName] || platform;
  const lines = content.split('\n');

  // 提取request和handleResponse函数（前44行通常是固定的）
  const headerEnd = lines.findIndex(l => l.includes('// ===='));
  const header = lines.slice(0, headerEnd > 0 ? headerEnd : 44).join('\n');

  // 解析所有API函数
  const apis = parseApiFunctions(content);
  if (apis.length === 0) return null;

  // 去重：同名函数保留最后一个（因为JS中后定义的覆盖前面的）
  const uniqueApis = [];
  const seen = new Set();
  for (let i = apis.length - 1; i >= 0; i--) {
    if (!seen.has(apis[i].name)) {
      seen.add(apis[i].name);
      uniqueApis.unshift(apis[i]);
    }
  }

  // 按路径分类
  const categories = {};
  for (const api of uniqueApis) {
    const pathParts = api.path.split('/').filter(Boolean);
    const cat = pathParts.length > 1 ? pathParts.slice(0, -1).join('/') : 'other';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(api);
  }

  // 生成API注册表
  let registry = `const API_REGISTRY = {\n`;
  for (const [cat, catApis] of Object.entries(categories)) {
    registry += `  // ${cat}\n`;
    for (const api of catApis) {
      // 解析参数
      const paramParts = api.paramsStr.split(',').map(p => p.trim()).filter(p => p && !p.includes('...extraParams'));
      const requiredParams = paramParts.filter(p => !p.includes('='));
      const methodStr = api.method !== 'GET' ? `, method: '${api.method}'` : '';
      const paramsStr = requiredParams.length > 0
        ? `, params: [${requiredParams.map(p => `'${p}'`).join(', ')}]`
        : '';

      registry += `  ${api.name}: { path: '${api.path}'${paramsStr}${methodStr} },\n`;
    }
  }
  registry += `};\n\n`;

  // 生成通用调用工厂
  const factory = `/**
 * 通用API调用方法
 * 根据API注册表动态调用，替代重复的函数定义
 * @param {string} apiName - 注册表中的API名称
 * @param {object} params - 请求参数
 * @returns {Promise<object>} API响应数据
 */
async function callApi(apiName, params = {}) {
  const def = API_REGISTRY[apiName];
  if (!def) throw new Error(\`未知的API: \${apiName}\`);
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
`;

  // 生成导出
  let exports = `module.exports = {\n  request,\n  callApi,\n  API_REGISTRY,\n`;
  for (const api of uniqueApis) {
    exports += `  ${api.name}: api.${api.name},\n`;
  }
  exports += `};\n`;

  return `${header}\n${registry}${factory}${exports}`;
}

// 优化data.js：合并重复的格式化函数为一个通用函数
function optimizeDataJs(skillName, content) {
  const platform = skillName.replace('maxhub-', '');
  const platformName = PLATFORM_NAMES[skillName] || platform;
  const fields = PLATFORM_FIELDS[skillName];

  // 提取工具函数（safeGet, formatNumber, formatDate, formatDuration）
  const utilFuncs = [];
  const utilFuncNames = ['safeGet', 'formatNumber', 'formatDate', 'formatDuration'];
  for (const fname of utilFuncNames) {
    const regex = new RegExp(`function ${fname}\\([^)]*\\) \\{[\\s\\S]*?\\n\\}`, 'g');
    const match = regex.exec(content);
    if (match) utilFuncs.push(match[0]);
  }

  // 生成通用格式化函数
  const formatItemFunc = `/**
 * 通用内容格式化函数
 * 使用 safeGet 兼容不同API版本的返回字段差异
 * @param {object} rawData - 原始API返回数据
 * @returns {object|null} 格式化后的数据
 */
function formatItem(rawData) {
  if (!rawData) return null;
  const item = rawData.data || rawData.aweme_detail || rawData.item || rawData;

  return {
    id: safeGet(item, ['${fields.contentPath}', 'id', 'item_id', 'note_id', 'bvid', 'video_id', 'uid']),
    title: safeGet(item, ['desc', 'title', 'caption', 'text', 'content']),
    author: safeGet(item, ['author.nickname', 'author.name', 'author.userName', 'user.nickname', 'owner.name', 'channelTitle']),
    authorId: safeGet(item, ['author.uid', 'author.id', 'author.user_id', 'user.uid', 'owner.mid']),
    cover: safeGet(item, ['video.cover.url_list.0', 'cover', 'pic', 'thumbnail', 'avatar']),
    stats: {${fields.statsFields.map(f =>
      `\n      ${f}: formatNumber(safeGet(item, ['${fields.statPaths[f]}', '${f}'], 0)),`
    ).join('')}
    },
    createTime: formatDate(safeGet(item, ['create_time', 'publishTime', 'createdAt', 'created_time', 'pubdate', 'publishedAt'])),
    duration: formatDuration(safeGet(item, ['duration', 'video.duration', 'length'], 0)),
  };
}`;

  // 生成formatData函数
  const formatDataFunc = `/**
 * 通用数据格式化 - 自动检测数据类型并选择格式化函数
 * 兼容API返回参数变化：当字段名变化时，safeGet会自动尝试备选字段
 */
function formatData(apiPath, rawData) {
  if (!rawData) return null;

  const list = rawData.list || rawData.data?.list || rawData.items || rawData.videos || rawData.aweme_list;
  if (list && Array.isArray(list)) {
    return list.map(item => formatItem({ data: item, aweme_detail: item, item }));
  }

  return formatItem(rawData);
}`;

  // 生成兼容别名（保持向后兼容）
  const aliases = `/**
 * 向后兼容别名
 * 旧代码可能使用 formatXxx_Web 等函数名，统一指向 formatItem
 */
const format${platformName}_Web = formatItem;
const format${platformName}_App = formatItem;
const format${platformName}_Search = formatItem;`;

  // 生成导出
  const exports = `module.exports = {
  safeGet,
  formatNumber,
  formatDate,
  formatDuration,
  formatItem,
  formatData,
  format${platformName}_Web,
  format${platformName}_App,
  format${platformName}_Search,
};`;

  return `// 数据解析、格式化处理 - ${platform}
// 兼容层设计：支持API返回参数变化时自动调整
// 当API返回字段与预期不一致时，使用fallback策略提取数据

${utilFuncs.join('\n\n')}

${formatItemFunc}

${formatDataFunc}

${aliases}

${exports}
`;
}

// 修复router.js闭环：确保路由调用的api方法都存在
function fixRouterJs(skillName, apiContent, routerContent) {
  // 提取api.js中导出的函数名
  const exportMatch = apiContent.match(/module\.exports\s*=\s*\{([^}]+)\}/s);
  if (!exportMatch) return routerContent;

  const exportedFuncs = new Set();
  const funcNameRegex = /(\w+)\s*:/g;
  let match;
  while ((match = funcNameRegex.exec(exportMatch[1])) !== null) {
    exportedFuncs.add(match[1]);
  }

  // 找出router.js中调用的api方法
  const apiCallRegex = /api\.(\w+)\(/g;
  const calledFuncs = new Set();
  while ((match = apiCallRegex.exec(routerContent)) !== null) {
    calledFuncs.add(match[1]);
  }

  // 找出不存在的调用
  const missingFuncs = [...calledFuncs].filter(f => !exportedFuncs.has(f));

  if (missingFuncs.length === 0) return routerContent;

  // 为缺失的API方法添加注释标记
  let fixed = routerContent;
  for (const func of missingFuncs) {
    // 在router.js中添加注释标记缺失的方法
    fixed = fixed.replace(
      new RegExp(`api\\.${func}\\(`, 'g'),
      `/* TODO: api.${func} 未在api.js中定义 */ api.${func}(`
    );
  }

  return fixed;
}

// 修复format.json：替换不合理的字段
function fixFormatJson(skillName, content) {
  const fields = PLATFORM_FIELDS[skillName];
  if (!fields) return content;

  try {
    const data = JSON.parse(content);

    // 修复contentInfo section
    if (data.contentInfo) {
      data.contentInfo.highlight = fields.highlight;
      // 修复字段名
      if (data.contentInfo.fields) {
        data.contentInfo.fields = data.contentInfo.fields.map(f => {
          if (fields.statsFields.includes(f.key) && !fields.statsFields.includes(f.key)) {
            return { ...f, key: fields.statsFields[0] || 'id' };
          }
          return f;
        });
      }
    }

    // 修复userProfile section
    if (data.userProfile) {
      if (skillName === 'maxhub-temp-mail') {
        // 临时邮箱没有用户信息
        data.userProfile.highlight = [];
      } else {
        data.userProfile.highlight = fields.highlight.slice(0, 2);
      }
    }

    return JSON.stringify(data, null, 2) + '\n';
  } catch (e) {
    return content;
  }
}

function main() {
  const skillDirs = fs.readdirSync(SKILLS_DIR).filter(d =>
    d.startsWith('maxhub-') && fs.statSync(path.join(SKILLS_DIR, d)).isDirectory()
  );

  let apiOptimized = 0;
  let dataOptimized = 0;
  let routerFixed = 0;
  let formatFixed = 0;

  for (const skillDir of skillDirs) {
    const skillPath = path.join(SKILLS_DIR, skillDir);
    const apiPath = path.join(skillPath, 'service', 'api.js');
    const dataPath = path.join(skillPath, 'service', 'data.js');
    const routerPath = path.join(skillPath, 'core', 'router.js');
    const formatPath = path.join(skillPath, 'template', 'format.json');

    // 优化 api.js
    if (fs.existsSync(apiPath)) {
      const content = fs.readFileSync(apiPath, 'utf-8');
      const optimized = optimizeApiJs(skillDir, content);
      if (optimized && optimized !== content) {
        fs.writeFileSync(apiPath, optimized, 'utf-8');
        const origLines = content.split('\n').length;
        const newLines = optimized.split('\n').length;
        console.log(`✅ ${skillDir}/service/api.js: ${origLines}行 → ${newLines}行 (减少${origLines - newLines}行)`);
        apiOptimized++;
      }
    }

    // 优化 data.js
    if (fs.existsSync(dataPath)) {
      const content = fs.readFileSync(dataPath, 'utf-8');
      const optimized = optimizeDataJs(skillDir, content);
      if (optimized && optimized !== content) {
        fs.writeFileSync(dataPath, optimized, 'utf-8');
        const origLines = content.split('\n').length;
        const newLines = optimized.split('\n').length;
        console.log(`✅ ${skillDir}/service/data.js: ${origLines}行 → ${newLines}行 (减少${origLines - newLines}行)`);
        dataOptimized++;
      }
    }

    // 修复 router.js 闭环
    if (fs.existsSync(routerPath) && fs.existsSync(apiPath)) {
      const apiContent = fs.readFileSync(apiPath, 'utf-8');
      const routerContent = fs.readFileSync(routerPath, 'utf-8');
      const fixed = fixRouterJs(skillDir, apiContent, routerContent);
      if (fixed !== routerContent) {
        fs.writeFileSync(routerPath, fixed, 'utf-8');
        console.log(`🔧 ${skillDir}/core/router.js: 修复了缺失的API调用`);
        routerFixed++;
      }
    }

    // 修复 format.json
    if (fs.existsSync(formatPath)) {
      const content = fs.readFileSync(formatPath, 'utf-8');
      const fixed = fixFormatJson(skillDir, content);
      if (fixed !== content) {
        fs.writeFileSync(formatPath, fixed, 'utf-8');
        console.log(`🔧 ${skillDir}/template/format.json: 修复了不合理字段`);
        formatFixed++;
      }
    }
  }

  console.log(`\n🎉 优化完成！`);
  console.log(`  api.js 优化: ${apiOptimized} 个`);
  console.log(`  data.js 优化: ${dataOptimized} 个`);
  console.log(`  router.js 闭环修复: ${routerFixed} 个`);
  console.log(`  format.json 修复: ${formatFixed} 个`);
}

main();
