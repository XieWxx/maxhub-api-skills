#!/usr/bin/env node

/**
 * Skill 系统优化脚本
 * 将现有复杂的多层架构简化为直接调用模式
 *
 * 变更内容：
 * 1. 从 api.js 的 API_REGISTRY 生成 api-registry.json
 * 2. 从 chain-patterns.md 生成 chain-patterns.json
 * 3. 重写 system.prompt.md 支持直接 API 调用
 * 4. 简化 SKILL.md 结构
 * 5. 更新 index.ts 使用 SkillExecutor
 * 6. 更新 manifest.json
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..');

const SKILL_META = {
  'maxhub-bilibili': {
    platform: 'bilibili', displayName: 'B站数据采集与分析', emoji: '📺',
    trigger: 'b站|bilibili|弹幕|番剧|up主|b站视频|哔哩哔哩',
    categories: ['social-media', 'data-collection', 'content-analysis'],
    scenarios: [
      { title: '搜索B站视频', input: '搜索B站上编程教程的视频', output: '返回视频列表，包含标题、UP主、播放量、弹幕数' },
      { title: '获取视频弹幕', input: '获取这个B站视频的弹幕数据', output: '返回弹幕列表，包含弹幕内容、时间点、弹幕类型' },
      { title: '查看UP主信息', input: '这个UP主有多少粉丝', output: '返回UP主信息，包含粉丝数、播放量、投稿数' },
    ],
  },
  'maxhub-douyin': {
    platform: 'douyin', displayName: '抖音数据采集与分析', emoji: '🎵',
    trigger: '抖音|douyin|短视频热搜|抖音达人|抖音直播|抖音热榜|抖音视频|抖音博主',
    categories: ['social-media', 'data-collection', 'content-analysis'],
    scenarios: [
      { title: '查看抖音热搜榜', input: '抖音热搜', output: '返回当前热搜榜单，包含排名、话题、热度值' },
      { title: '搜索抖音视频', input: '搜索抖音上关于AI绘画的热门视频', output: '返回视频列表，包含标题、作者、播放量、点赞数' },
      { title: '分析抖音博主', input: '分析抖音博主@某某某的数据', output: '返回博主信息，包含粉丝数、获赞数、作品数' },
    ],
  },
  'maxhub-xiaohongshu': {
    platform: 'xiaohongshu', displayName: '小红书数据采集与分析', emoji: '📕',
    trigger: '小红书|xiaohongshu|red|种草|笔记|小红书搜索',
    categories: ['social-media', 'data-collection', 'content-analysis'],
    scenarios: [
      { title: '搜索小红书笔记', input: '在小红书搜索平价护肤笔记', output: '返回笔记列表，包含标题、作者、点赞数、收藏数' },
      { title: '查看用户信息', input: '这个小红书博主的粉丝数', output: '返回用户信息，包含粉丝数、获赞数、笔记数' },
    ],
  },
  'maxhub-weibo': {
    platform: 'weibo', displayName: '微博数据采集与分析', emoji: '🔥',
    trigger: '微博|weibo|热搜|超话|话题|微博搜索',
    categories: ['social-media', 'data-collection', 'trending'],
    scenarios: [
      { title: '查看微博热搜', input: '微博热搜', output: '返回热搜榜单，包含排名、话题、热度值' },
      { title: '搜索微博话题', input: '搜索微博上关于科技的话题', output: '返回话题列表，包含阅读量、讨论量' },
    ],
  },
  'maxhub-wechat': {
    platform: 'wechat', displayName: '微信数据采集与分析', emoji: '💬',
    trigger: '微信|wechat|视频号|公众号|微信文章',
    categories: ['social-media', 'data-collection'],
    scenarios: [
      { title: '搜索公众号文章', input: '搜索关于AI的公众号文章', output: '返回文章列表，包含标题、公众号、阅读数' },
    ],
  },
  'maxhub-zhihu': {
    platform: 'zhihu', displayName: '知乎数据采集与分析', emoji: '💡',
    trigger: '知乎|zhihu|问答|专栏|话题|知乎搜索',
    categories: ['social-media', 'data-collection', 'knowledge-base'],
    scenarios: [
      { title: '搜索知乎问答', input: '知乎上关于AI的问答', output: '返回问答列表，包含问题、回答数、关注数' },
    ],
  },
  'maxhub-kuaishou': {
    platform: 'kuaishou', displayName: '快手数据采集与分析', emoji: '🎬',
    trigger: '快手|kuaishou|快手视频|快手直播|快手电商',
    categories: ['social-media', 'data-collection', 'e-commerce'],
    scenarios: [
      { title: '搜索快手视频', input: '搜索快手上的美食视频', output: '返回视频列表，包含标题、作者、播放量' },
    ],
  },
  'maxhub-toutiao': {
    platform: 'toutiao', displayName: '头条数据采集与分析', emoji: '📰',
    trigger: '头条|toutiao|新闻|资讯|今日头条',
    categories: ['news', 'data-collection', 'trending'],
    scenarios: [
      { title: '搜索头条新闻', input: '搜索今日头条上的科技新闻', output: '返回新闻列表，包含标题、来源、评论数' },
    ],
  },
  'maxhub-xigua': {
    platform: 'xigua', displayName: '西瓜视频数据采集', emoji: '🍉',
    trigger: '西瓜视频|xigua|长视频|西瓜搜索',
    categories: ['social-media', 'data-collection', 'video-platform'],
    scenarios: [
      { title: '搜索西瓜视频', input: '搜索西瓜视频上的纪录片', output: '返回视频列表，包含标题、播放量、时长' },
    ],
  },
  'maxhub-pipixia': {
    platform: 'pipixia', displayName: '皮皮虾数据采集', emoji: '🦐',
    trigger: '皮皮虾|pipixia|搞笑|段子',
    categories: ['social-media', 'data-collection', 'entertainment'],
    scenarios: [
      { title: '搜索搞笑内容', input: '皮皮虾上的搞笑段子', output: '返回内容列表，包含标题、点赞数、评论数' },
    ],
  },
  'maxhub-tiktok': {
    platform: 'tiktok', displayName: 'TikTok数据采集与分析', emoji: '🎶',
    trigger: 'tiktok|国际版抖音|海外短视频|tiktok creator|tiktok analytics',
    categories: ['social-media', 'data-collection', 'e-commerce'],
    scenarios: [
      { title: '搜索TikTok视频', input: 'Search TikTok videos about AI art', output: '返回视频列表，包含标题、作者、播放量、点赞数' },
    ],
  },
  'maxhub-youtube': {
    platform: 'youtube', displayName: 'YouTube数据采集与分析', emoji: '▶️',
    trigger: 'youtube|视频|频道|评论|播放列表|youtube搜索',
    categories: ['social-media', 'data-collection', 'video-platform'],
    scenarios: [
      { title: '搜索YouTube视频', input: 'Search YouTube for AI tutorials', output: '返回视频列表，包含标题、频道、观看数、点赞数' },
    ],
  },
  'maxhub-instagram': {
    platform: 'instagram', displayName: 'Instagram数据采集', emoji: '📸',
    trigger: 'instagram|ins|图片|reel|story|ins搜索',
    categories: ['social-media', 'data-collection'],
    scenarios: [
      { title: '搜索Instagram用户', input: 'Search Instagram user @xxx', output: '返回用户信息，包含粉丝数、帖子数、认证状态' },
    ],
  },
  'maxhub-twitter': {
    platform: 'twitter', displayName: 'Twitter/X数据采集与分析', emoji: '🐦',
    trigger: 'twitter|x|推文|tweet|话题|twitter搜索',
    categories: ['social-media', 'data-collection', 'trending'],
    scenarios: [
      { title: '搜索推文', input: 'Search tweets about AI', output: '返回推文列表，包含内容、转发数、点赞数' },
    ],
  },
  'maxhub-linkedin': {
    platform: 'linkedin', displayName: 'LinkedIn数据采集', emoji: '💼',
    trigger: 'linkedin|职场|公司|职位|人脉|linkedin搜索',
    categories: ['professional', 'data-collection', 'job-search'],
    scenarios: [
      { title: '搜索公司信息', input: 'LinkedIn company info for Google', output: '返回公司信息，包含员工数、行业、简介' },
    ],
  },
  'maxhub-reddit': {
    platform: 'reddit', displayName: 'Reddit数据采集', emoji: '🤖',
    trigger: 'reddit|社区|帖子|评论|subreddit|reddit搜索',
    categories: ['social-media', 'data-collection', 'community'],
    scenarios: [
      { title: '搜索Reddit帖子', input: 'Search Reddit for AI news', output: '返回帖子列表，包含标题、投票数、评论数' },
    ],
  },
  'maxhub-threads': {
    platform: 'threads', displayName: 'Threads数据采集', emoji: '🧵',
    trigger: 'threads|meta|帖子|threads搜索',
    categories: ['social-media', 'data-collection'],
    scenarios: [
      { title: '搜索Threads帖子', input: 'Search Threads for AI discussion', output: '返回帖子列表，包含内容、点赞数、回复数' },
    ],
  },
  'maxhub-lemon8': {
    platform: 'lemon8', displayName: 'Lemon8数据采集', emoji: '🍋',
    trigger: 'lemon8|生活方式|图文|种草|lemon8搜索',
    categories: ['social-media', 'data-collection', 'lifestyle'],
    scenarios: [
      { title: '搜索Lemon8笔记', input: 'Search Lemon8 for skincare tips', output: '返回笔记列表，包含标题、作者、点赞数' },
    ],
  },
  'maxhub-sora2': {
    platform: 'sora2', displayName: 'Sora2内容浏览', emoji: '🎥',
    trigger: 'sora|sora2|ai视频|视频创作者|sora搜索',
    categories: ['ai-tools', 'data-collection', 'video-platform'],
    scenarios: [
      { title: '浏览Sora2内容', input: 'Browse Sora2 AI video creations', output: '返回内容列表，包含标题、作者、点赞数' },
    ],
  },
  'maxhub-temp-mail': {
    platform: 'temp-mail', displayName: '临时邮箱服务', emoji: '📧',
    trigger: '临时邮箱|temp mail|隐私邮箱|一次性邮箱|临时email',
    categories: ['tools', 'privacy', 'email'],
    scenarios: [
      { title: '创建临时邮箱', input: '帮我创建一个临时邮箱', output: '返回邮箱地址和Token' },
      { title: '查看收件箱', input: '查看我的临时邮箱有没有收到邮件', output: '返回邮件列表，包含发件人、主题、内容' },
    ],
  },
  'maxhub-hybrid': {
    platform: 'hybrid', displayName: '混合解析服务', emoji: '🔄',
    trigger: '混合解析|hybrid|解析|聚合|多平台解析|url解析',
    categories: ['tools', 'data-collection', 'parser'],
    scenarios: [
      { title: '解析URL内容', input: '解析这个链接的内容 https://...', output: '返回解析结果，包含平台、类型、标题、作者' },
    ],
  },
};

// ==================== 步骤1: 从 api.js 提取 API_REGISTRY 并生成 api-registry.json ====================

function extractRegistryFromApiJs(apiJsPath, apiCatalogPath) {
  if (!fs.existsSync(apiJsPath)) return null;

  const code = fs.readFileSync(apiJsPath, 'utf-8');

  const registryMatch = code.match(/const API_REGISTRY\s*=\s*\{([\s\S]*?)\n\};/);
  if (!registryMatch) return null;

  const catalogSummaries = {};
  if (fs.existsSync(apiCatalogPath)) {
    const catalogContent = fs.readFileSync(apiCatalogPath, 'utf-8');
    const catalogRegex = /\|\s*\d+\s*\|\s*(.+?)\s*\|\s*(\w+)\s*\|\s*`?\/api\/v1\/[\w-]+\/([^`|\s]+)`?\s*\|\s*([^|]*)\s*\|/g;
    let cm;
    while ((cm = catalogRegex.exec(catalogContent)) !== null) {
      const summary = cm[1].trim().replace(/\*+/g, '');
      const apiRelPath = '/' + cm[3].trim();
      const requiredParams = cm[4].trim();
      catalogSummaries[apiRelPath] = { summary, requiredParams };
    }
  }

  const registryBody = registryMatch[1];
  const apis = [];

  const apiEntryRegex = /(\w+):\s*\{\s*path:\s*'([^']+)'(?:,\s*params:\s*\[([^\]]*)\])?(?:,\s*price:\s*([\d.]+))?/g;
  let match;
  while ((match = apiEntryRegex.exec(registryBody)) !== null) {
    const name = match[1];
    let apiPath = match[2];
    const paramsStr = match[3] || '';
    const price = parseFloat(match[4]) || 0;

    if (!apiPath.startsWith('/')) {
      apiPath = '/' + apiPath;
    }

    const params = paramsStr
      .split(',')
      .map(p => p.trim().replace(/'/g, ''))
      .filter(Boolean)
      .map(p => ({ name: p, required: true }));

    const category = apiPath.includes('/web/') ? 'web' : apiPath.includes('/app/') ? 'app' : 'default';

    const catalogInfo = catalogSummaries[apiPath] || {};
    const summary = catalogInfo.summary || name.replace(/([A-Z])/g, ' $1').trim();

    apis.push({
      id: name,
      path: apiPath,
      method: 'GET',
      summary,
      description: summary,
      params,
      price,
      category,
    });
  }

  return apis;
}

function generateApiRegistry(skillDir, config) {
  const apiJsPath = path.join(skillDir, 'service', 'api.js');
  const configPath = path.join(skillDir, 'config.json');
  const apiCatalogPath = path.join(skillDir, 'references', 'api-catalog.md');

  let apiPrefix = '';
  if (fs.existsSync(configPath)) {
    const cfg = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    apiPrefix = cfg.apiBase?.prefix || '';
  }

  const apis = extractRegistryFromApiJs(apiJsPath, apiCatalogPath);
  if (!apis || apis.length === 0) {
    console.log(`  ⚠️  未找到 API_REGISTRY，跳过 api-registry.json 生成`);
    return null;
  }

  return {
    version: '2.0',
    apiPrefix,
    apis,
  };
}

// ==================== 步骤2: 生成 chain-patterns.json ====================

function generateChainPatterns(skillDir, meta) {
  const chainMdPath = path.join(skillDir, 'references', 'chain-patterns.md');
  const patterns = [];

  if (fs.existsSync(chainMdPath)) {
    const content = fs.readFileSync(chainMdPath, 'utf-8');

    const patternRegex = /### 模式\d+[：:]\s*(.+?)\n\n\*\*触发场景\*\*[：:]\s*(.+?)\n\n\*\*调用步骤\*\*[：:]\s*\n([\s\S]*?)(?=\n---|\n## |$)/g;
    let match;
    while ((match = patternRegex.exec(content)) !== null) {
      const name = match[1].trim();
      const trigger = match[2].trim();
      const stepsBlock = match[3].trim();

      const steps = [];
      const stepRegex = /\d+\.\s*`([^`]+)`\s*[—\-–]+\s*(.+?)(?:\s*（[^）]*）)?\s*$/gm;
      let stepMatch;
      while ((stepMatch = stepRegex.exec(stepsBlock)) !== null) {
        let api = stepMatch[1].trim();
        const desc = stepMatch[2].trim().replace(/（[^）]*）$/, '').trim();

        if (!api.startsWith('/')) {
          api = '/' + api;
        }

        steps.push({ api, description: desc, params: {} });
      }

      if (steps.length > 0) {
        patterns.push({ name, trigger, steps });
      }
    }
  }

  if (patterns.length === 0) {
    patterns.push(
      {
        name: 'search_then_detail',
        trigger: '用户只提供了关键词，需要先搜索再获取详情',
          steps: [
           { api: '/web/fetch_general_search', description: '搜索关键词获取列表', params: { keyword: '' } },
           { api: '/web/fetch_one_video', description: '用ID获取完整详情', paramMapping: { bv_id: 'data.bvid' } },
          ],
        },
        {
          name: 'hot_then_search',
          trigger: '用户想了解当前热门话题',
          steps: [
           { api: '/web/fetch_hot_search', description: '获取热搜榜单' },
           { api: '/web/fetch_general_search', description: '搜索感兴趣的热门话题', params: { keyword: '' } },
          ],
      },
    );
  }

  return { version: '2.0', patterns };
}

// ==================== 步骤3: 生成 system.prompt.md（含5层防护体系） ====================

function generateSystemPrompt(meta, registry, chainPatterns) {
  const platform = meta.platform;
  const displayName = meta.displayName;
  const emoji = meta.emoji;
  const apiPrefix = registry?.apiPrefix || `/api/v1/${platform}`;

  let apiList = '';
  if (registry && registry.apis) {
    const categories = {};
    for (const api of registry.apis) {
      const cat = api.category || 'default';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(api);
    }

    for (const [cat, apis] of Object.entries(categories)) {
      apiList += `\n### ${cat.toUpperCase()}（${apis.length}个API）\n\n`;
      apiList += '| API路径 | 方法 | 必填参数 | 说明 |\n';
      apiList += '|:---|:---|:---|:---|\n';
      for (const api of apis) {
        const requiredParams = api.params.filter(p => p.required).map(p => p.name).join(', ') || '-';
        apiList += `| \`${api.path}\` | ${api.method} | ${requiredParams} | ${api.summary || api.id} |\n`;
      }
    }
  }

  let chainList = '';
  if (chainPatterns && chainPatterns.patterns && chainPatterns.patterns.length > 0) {
    chainList = '\n### 可用链式调用模式\n\n';
    for (const p of chainPatterns.patterns) {
      chainList += `- **${p.name}**：${p.trigger}\n`;
      for (let i = 0; i < p.steps.length; i++) {
        chainList += `  ${i + 1}. \`${p.steps[i].api}\` — ${p.steps[i].description}\n`;
      }
    }
  }

  return `# ${emoji} ${displayName} Skill 角色提示词

你是${displayName}的数据专家。你**必须**按照本文件定义的执行协议操作，**严禁**自行生成脚本文件。

---

## ⛔ 禁止行为（最高优先级规则）

以下行为被**严格禁止**，违反任何一条都将导致执行失败：

1. **禁止生成脚本文件**：不得创建 .js/.ts/.py/.sh 等任何脚本文件来调用API
2. **禁止使用 require/import**：不得在代码中 require 或 import 本skill的任何模块
3. **禁止执行 node/python 命令**：不得通过 \`node xxx.js\` 或 \`python xxx.py\` 执行脚本
4. **禁止绕过直接调用**：不得通过任何间接方式（脚本、子进程、eval）调用API
5. **禁止创建临时文件**：不得将API请求逻辑写入文件再执行

**唯一允许的调用方式**：使用你内置的HTTP工具（如 fetch/WebFetch）直接发送HTTP请求。

---

## ✅ 执行协议（必须严格遵循）

### 协议步骤

收到用户请求后，**必须**按以下步骤执行：

\`\`\`
步骤1: 分析意图 → 确定需要调用的API和参数
步骤2: 构建请求 → 拼接完整URL和请求头
步骤3: 发送请求 → 使用内置HTTP工具直接请求
步骤4: 解析响应 → 提取关键数据
步骤5: 整理输出 → 格式化后返回给用户
\`\`\`

### 步骤1: 分析意图

根据用户需求，从下方API列表中选择最合适的API：
- 用户给关键词 → 选择搜索类API
- 用户给ID/URL → 选择详情类API
- 用户要热门/推荐 → 选择榜单/推荐类API
- 需要多个数据 → 使用链式调用模式

### 步骤2: 构建请求

请求格式：
- **完整URL**：\`https://www.aconfig.cn${apiPrefix}{API路径}?{参数}\`
- **请求头**：\`x-api-key: \${MAXHUB_API_KEY}\`
- **GET请求**：参数放在URL query string中
- **POST请求**：参数放在JSON body中

**示例**：搜索关键词"编程"
\`\`\`
GET https://www.aconfig.cn${apiPrefix}/web/fetch_general_search?keyword=编程&page=1&page_size=20
Header: x-api-key: mh_sk_xxxxx
\`\`\`

### 步骤3: 发送请求

使用你**内置的HTTP请求工具**（如 fetch、WebFetch 等）直接发送请求。
**不要**写脚本，**不要**创建文件，**不要**启动子进程。

### 步骤4: 解析响应

从API返回的JSON中提取关键数据：
- 列表数据：提取 \`data.list\` 或 \`data.items\` 或 \`data.videos\`
- 详情数据：提取 \`data\` 下的核心字段
- 分页数据：提取总数和当前页信息

### 步骤5: 整理输出

将提取的数据格式化后返回：
- 列表数据 → Markdown表格
- 详情数据 → 结构化展示
- 统计数据 → 关键指标加粗

---

## 🔗 链式调用协议

当用户需求需要多个API配合时：

1. **确定步骤**：根据链式调用模式或自行分析，确定API调用序列
2. **顺序执行**：按顺序逐个调用，等待每步完成后才执行下一步
3. **参数传递**：从上一步响应中提取关键字段，作为下一步的参数
4. **失败中断**：任何一步失败则停止，向用户说明已完成的步骤和失败原因
5. **结果汇总**：将所有步骤的结果整理后统一返回

---

## 🔍 自检机制

在执行任何操作前，进行以下自检：

| 检查项 | 通过条件 | 不通过处理 |
|:---|:---|:---|
| 是否在生成脚本？ | 否 → 通过 | 立即停止，改用HTTP工具直接调用 |
| 是否在创建文件？ | 否 → 通过 | 立即停止，改用HTTP工具直接调用 |
| 是否使用了内置HTTP工具？ | 是 → 通过 | 改用内置HTTP工具 |
| 是否按协议步骤执行？ | 是 → 通过 | 回到步骤1重新执行 |
| API参数是否完整？ | 是 → 通过 | 提示用户提供缺失参数 |

---

## 📋 API能力概览

共 ${registry?.apis?.length || 0} 个API：
${apiList}
${chainList}
## 📤 输出规范

- 数据以结构化表格或列表展示
- 关键数据加粗标注
- 链式调用时说明每步的调用目的和结果
- 超过10条数据时提供摘要
- 错误时给出明确的解决建议

## ⚠️ 错误处理

| 状态码 | 含义 | 处理方式 |
|:---|:---|:---|
| 401 | API Key无效 | 提示用户配置MAXHUB_API_KEY环境变量 |
| 402 | 余额不足 | 提示用户访问 https://www.aconfig.cn 充值 |
| 429 | 频率超限 | 等待30秒后重试 |
| 500 | 服务器错误 | 稍后重试，如持续失败则告知用户 |
`;
}

// ==================== 步骤4: 生成 SKILL.md（含执行协议和反脚本规则） ====================

function generateSkillMd(meta, registry) {
  const platform = meta.platform;
  const displayName = meta.displayName;
  const emoji = meta.emoji;
  const trigger = meta.trigger;
  const today = new Date().toISOString().split('T')[0];
  const apiPrefix = registry?.apiPrefix || `/api/v1/${platform}`;

  let scenarioSection = '';
  if (meta.scenarios) {
    scenarioSection = '### 使用示例\n\n';
    meta.scenarios.forEach((s, i) => {
      scenarioSection += `${i + 1}. 示例：${s.input} → ${s.output}\n`;
    });
  }

  let apiSection = '';
  if (registry && registry.apis) {
    const categories = {};
    for (const api of registry.apis) {
      const cat = api.category || 'default';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(api);
    }

    apiSection = '## 支持功能\n\n';
    for (const [cat, apis] of Object.entries(categories)) {
      apiSection += `**${cat.toUpperCase()}**（${apis.length}个API）\n\n`;
      apiSection += '| API路径 | 方法 | 必填参数 | 说明 |\n';
      apiSection += '|:---|:---|:---|:---|\n';
      for (const api of apis.slice(0, 15)) {
        const requiredParams = api.params.filter(p => p.required).map(p => p.name).join(', ') || '-';
        apiSection += `| \`${api.path}\` | ${api.method} | ${requiredParams} | ${api.summary || api.id} |\n`;
      }
      if (apis.length > 15) {
        apiSection += `| ... | | | 还有 ${apis.length - 15} 个API |\n`;
      }
      apiSection += '\n';
    }
  }

  return `---
name: maxhub-${platform}
description: ${displayName}。当用户提到${trigger.split('|').slice(0, 3).join('、')}等相关需求时激活此Skill。
version: 3.0.0
author: MaxHub Team
license: MIT
trigger: "${trigger}"
categories:
${meta.categories.map(c => `  - ${c}`).join('\n')}
tools:
  - http
execution:
  mode: direct_api_call
  prohibitScriptGeneration: true
  protocol: skill-execution-protocol
metadata:
  openclaw:
    requires:
      env:
        - MAXHUB_API_KEY
    primaryEnv: MAXHUB_API_KEY
    emoji: "${emoji}"
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
  homepage: https://www.aconfig.cn
  repository: https://github.com/XieWxx/maxhub-api-skills
  tags:
${trigger.split('|').map(t => `    - ${t}`).join('\n')}
---

# ${emoji} ${displayName}

唯一标识：\`maxhub-${platform}\`
版本：v3.0.0
更新时间：${today}

## 简介

${displayName}——${trigger.split('|').slice(0, 3).join('、')}等平台数据的智能采集与分析工具。**本Skill采用直接API调用模式，不生成任何脚本文件。**

## ⛔ 执行约束

> **重要**：使用本Skill时，必须遵守以下约束：

1. **直接调用API**：使用内置HTTP工具直接请求 \`${apiPrefix}/*\` 接口
2. **禁止生成脚本**：不得创建 .js/.ts/.py/.sh 等脚本文件
3. **禁止执行脚本**：不得通过 node/python/bash 执行任何脚本
4. **禁止导入模块**：不得 require/import 本Skill的内部模块

**正确做法**：直接用 HTTP 工具请求 → 解析 JSON → 整理返回
**错误做法**：写脚本文件 → 执行脚本 → 读取输出

## 调用方法

### 请求格式

\`\`\`
URL: https://www.aconfig.cn${apiPrefix}{API路径}?{参数}
Header: x-api-key: {MAXHUB_API_KEY}
Method: GET / POST
\`\`\`

### 调用示例

搜索关键词"编程"：
\`\`\`
GET https://www.aconfig.cn${apiPrefix}/web/fetch_general_search?keyword=编程&page=1&page_size=20
x-api-key: mh_sk_xxxxx
\`\`\`

### 触发指令

直接输入：${trigger.split('|').slice(0, 5).join('、')}

${scenarioSection}
## 参数说明

| 参数名 | 是否必填 | 说明 |
|--------|----------|------|
| MAXHUB_API_KEY | 是 | MaxHub API密钥，访问 https://www.aconfig.cn 注册获取 |
| keyword | 否 | 搜索关键词 |
| page | 否 | 页码，默认1 |
| count | 否 | 每页条数，默认20 |

${apiSection}
## 决策流程

\`\`\`
用户请求
  │
  ├─ 有具体ID？ ─── 是 → 直接调用详情API
  │
  ├─ 有关键词？ ─── 是 → 调用搜索API
  │
  ├─ 要热门/推荐？ ─ 是 → 调用榜单/推荐API
  │
  ├─ 需要多个数据？ ─ 是 → 链式调用（先搜索→再详情）
  │
  └─ 不确定？ ──── 分析需求，选择最匹配的API
\`\`\`

## 注意事项

1. 使用前需配置环境变量 \`MAXHUB_API_KEY\`，新用户注册即赠送体验金
2. 批量操作（>10条）前会提示预计调用次数
3. 遇到429错误请等待30秒后重试
4. **不要生成脚本文件**，直接用HTTP工具调用API

## 数据隐私说明

- 本Skill通过MaxHub API（aconfig.cn）获取数据
- 请勿提交涉及个人隐私的敏感信息
- API密钥仅在本地环境变量中读取，不会外泄
`;
}

// ==================== 步骤5: 生成简化的 index.ts ====================

function generateIndexTs(meta) {
  const platform = meta.platform;
  const displayName = meta.displayName;

  return `// 技能入口主文件 - ${displayName}
// 使用 SkillExecutor 统一执行器，支持直接调用和链式调用
// 含协议验证：禁止脚本生成，强制直接API调用

const config = require('./config.json');
const { SkillExecutor } = require('../shared/skill-executor');

const executor = new SkillExecutor({
  skillDir: __dirname,
  apiBase: config.apiBase,
});

/**
 * Skill入口函数
 * @param {string} intent - 用户意图或API路径
 * @param {object} params - 请求参数
 * @returns {Promise<object>} 处理结果
 */
async function handle(intent, params = {}) {
  try {
    if (!intent) return { success: false, error: '缺少意图参数' };
    const apiKey = (typeof process !== 'undefined' && process.env?.[config.requires?.primaryEnv]) || '';
    if (!apiKey) return { success: false, error: \`未配置API密钥，请设置环境变量 \${config.requires?.primaryEnv || 'MAXHUB_API_KEY'}\` };
    return await executor.call(intent, params);
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 链式调用入口
 * @param {Array} steps - 调用步骤数组
 * @returns {Promise<object>} 链式调用结果
 */
async function chain(steps) {
  return executor.chain(steps);
}

/**
 * 按预设模式链式调用
 * @param {string} patternName - 模式名称
 * @param {object} params - 初始参数
 * @returns {Promise<object>} 链式调用结果
 */
async function chainByPattern(patternName, params = {}) {
  return executor.chainByPattern(patternName, params);
}

/**
 * 批量调用
 * @param {string} apiPath - API路径
 * @param {Array} paramsList - 参数列表
 * @returns {Promise<Array>} 所有调用结果
 */
async function batch(apiPath, paramsList) {
  return executor.batch(apiPath, paramsList);
}

/**
 * 列出所有可用API
 * @param {string} category - 按分类筛选
 * @returns {Array} API列表
 */
function listApis(category) {
  return executor.listApis(category);
}

/**
 * 列出所有链式调用模式
 * @returns {Array} 模式列表
 */
function listChainPatterns() {
  return executor.listChainPatterns();
}

/**
 * 协议验证 - 检查操作是否符合执行协议
 * @param {string} actionType - 操作类型: 'file_write' | 'command' | 'code'
 * @param {string} content - 操作内容
 * @returns {object} 验证结果
 */
function validateAction(actionType, content) {
  return executor.validateAction(actionType, content);
}

/**
 * 获取执行协议摘要
 * @returns {object} 协议摘要
 */
function getProtocolSummary() {
  return executor.getProtocolSummary();
}

module.exports = {
  handle,
  chain,
  chainByPattern,
  batch,
  listApis,
  listChainPatterns,
  validateAction,
  getProtocolSummary,
  executor,
  config,
};
`;
}

// ==================== 步骤6: 更新 manifest.json ====================

function updateManifest(skillDir, meta) {
  const manifestPath = path.join(skillDir, 'manifest.json');
  let manifest = {};

  if (fs.existsSync(manifestPath)) {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  }

  manifest.files = {
    skill: 'SKILL.md',
    systemPrompt: 'system.prompt.md',
    config: 'config.json',
    schema: 'schema.json',
    apiRegistry: 'api-registry.json',
    chainPatterns: 'chain-patterns.json',
  };

  manifest.execution = {
    mode: 'direct_api_call',
    prohibitScriptGeneration: true,
    protocol: 'system.prompt.md',
  };

  return manifest;
}

// ==================== 主执行函数 ====================

function main() {
  const skillDirs = fs.readdirSync(SKILLS_DIR).filter(d =>
    d.startsWith('maxhub-') && fs.statSync(path.join(SKILLS_DIR, d)).isDirectory()
  );

  let totalApis = 0;
  let updatedSkills = 0;

  for (const skillDirName of skillDirs) {
    const skillDir = path.join(SKILLS_DIR, skillDirName);
    const meta = SKILL_META[skillDirName];
    if (!meta) {
      console.log(`⚠️  跳过 ${skillDirName}（无元数据配置）`);
      continue;
    }

    console.log(`\n📦 处理 ${skillDirName}...`);

    // 1. 生成 api-registry.json
    const registry = generateApiRegistry(skillDir, meta);
    if (registry) {
      fs.writeFileSync(
        path.join(skillDir, 'api-registry.json'),
        JSON.stringify(registry, null, 2),
        'utf-8'
      );
      totalApis += registry.apis.length;
      console.log(`  ✅ api-registry.json（${registry.apis.length} 个API）`);
    }

    // 2. 生成 chain-patterns.json
    const chainPatterns = generateChainPatterns(skillDir, meta);
    fs.writeFileSync(
      path.join(skillDir, 'chain-patterns.json'),
      JSON.stringify(chainPatterns, null, 2),
      'utf-8'
    );
    console.log(`  ✅ chain-patterns.json（${chainPatterns.patterns.length} 个模式）`);

    // 3. 生成 system.prompt.md
    const systemPrompt = generateSystemPrompt(meta, registry, chainPatterns);
    fs.writeFileSync(
      path.join(skillDir, 'system.prompt.md'),
      systemPrompt,
      'utf-8'
    );
    console.log(`  ✅ system.prompt.md`);

    // 4. 生成 SKILL.md
    const skillMd = generateSkillMd(meta, registry);
    fs.writeFileSync(
      path.join(skillDir, 'SKILL.md'),
      skillMd,
      'utf-8'
    );
    console.log(`  ✅ SKILL.md`);

    // 5. 更新 index.ts
    const indexTs = generateIndexTs(meta);
    fs.writeFileSync(
      path.join(skillDir, 'index.ts'),
      indexTs,
      'utf-8'
    );
    console.log(`  ✅ index.ts`);

    // 6. 更新 manifest.json
    const manifest = updateManifest(skillDir, meta);
    fs.writeFileSync(
      path.join(skillDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2),
      'utf-8'
    );
    console.log(`  ✅ manifest.json`);

    updatedSkills++;
  }

  console.log(`\n🎉 完成！共更新 ${updatedSkills} 个 Skill，${totalApis} 个 API`);
  console.log('\n📋 优化说明：');
  console.log('  - 新增 api-registry.json：结构化API注册表，替代 api.js 中的硬编码');
  console.log('  - 新增 chain-patterns.json：结构化链式调用模式，替代 chain-patterns.md');
  console.log('  - 简化 system.prompt.md：支持直接API调用，无需生成中间脚本');
  console.log('  - 简化 SKILL.md：聚焦核心信息，去除冗余内容');
  console.log('  - 简化 index.ts：使用 SkillExecutor 统一执行器');
  console.log('  - 更新 manifest.json：指向新的文件结构');
  console.log('\n⚠️  旧文件（core/、service/、shared/、template/、references/）已保留，可手动删除');
}

main();
