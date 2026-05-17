// 统一 Skill 执行器 - 替代原有的 router + decision + optimizer 复杂链路
// Agent 可直接调用此模块执行 API 请求，无需生成中间脚本文件
// 支持单次调用、链式调用、批量调用
// 含脚本生成检测和拦截机制

const fs = require('fs');
const path = require('path');

const REQUEST_TIMEOUT = 30000;
const MAX_CHAIN_DEPTH = 5;
const MAX_BATCH_SIZE = 10;

const SCRIPT_PATTERNS = [
  /\.js$/, /\.ts$/, /\.py$/, /\.sh$/, /\.mjs$/, /\.cjs$/,
];

const SCRIPT_CONTENT_PATTERNS = [
  /require\s*\(\s*['"]/, /import\s+.*from\s+['"]/,
  /module\.exports/, /exports\.\w+\s*=/,
  /const\s+\w+\s*=\s*require/, /import\s*\{/,
];

/**
 * 检测内容是否为脚本代码
 * @param {string} content - 待检测内容
 * @returns {object} 检测结果 { isScript, reason, suggestion }
 */
function detectScriptGeneration(content) {
  if (!content || typeof content !== 'string') {
    return { isScript: false, reason: '', suggestion: '' };
  }

  for (const pattern of SCRIPT_CONTENT_PATTERNS) {
    if (pattern.test(content)) {
      return {
        isScript: true,
        reason: `检测到脚本代码模式: ${pattern.source}`,
        suggestion: '请使用内置HTTP工具直接调用API，不要生成脚本文件。参考SKILL.md中的调用方法。',
      };
    }
  }

  return { isScript: false, reason: '', suggestion: '' };
}

/**
 * 检测文件路径是否为脚本文件
 * @param {string} filePath - 文件路径
 * @returns {object} 检测结果
 */
function detectScriptFile(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    return { isScript: false, reason: '', suggestion: '' };
  }

  for (const pattern of SCRIPT_PATTERNS) {
    if (pattern.test(filePath)) {
      return {
        isScript: true,
        reason: `检测到脚本文件路径: ${filePath}`,
        suggestion: '禁止创建脚本文件来调用API。请使用内置HTTP工具直接请求。',
      };
    }
  }

  return { isScript: false, reason: '', suggestion: '' };
}

/**
 * 生成协议违规反馈
 * @param {string} violationType - 违规类型
 * @returns {object} 反馈信息
 */
function generateProtocolFeedback(violationType) {
  const feedbackMap = {
    script_generation: {
      code: 'PROTOCOL_VIOLATION',
      message: '⛔ 检测到脚本生成行为，这违反了Skill执行协议',
      detail: '本Skill采用直接API调用模式，禁止生成任何脚本文件。',
      correctApproach: '使用内置HTTP工具（如fetch/WebFetch）直接发送请求到API端点',
      example: 'GET https://www.aconfig.cn/api/v1/{platform}/{api_path}?{params}',
    },
    script_execution: {
      code: 'PROTOCOL_VIOLATION',
      message: '⛔ 检测到脚本执行行为，这违反了Skill执行协议',
      detail: '不得通过 node/python/bash 等命令执行脚本来调用API。',
      correctApproach: '使用内置HTTP工具直接发送请求',
      example: '使用 fetch() 或 WebFetch 工具直接请求API',
    },
    module_import: {
      code: 'PROTOCOL_VIOLATION',
      message: '⛔ 检测到模块导入行为，这违反了Skill执行协议',
      detail: '不得 require/import 本Skill的内部模块（如 api.js、router.js 等）。',
      correctApproach: '直接通过HTTP请求调用API，无需导入任何模块',
      example: 'GET https://www.aconfig.cn/api/v1/{platform}/{api_path}',
    },
  };

  return feedbackMap[violationType] || {
    code: 'PROTOCOL_VIOLATION',
    message: '⛔ 检测到违反Skill执行协议的行为',
    detail: '请按照SKILL.md中定义的执行协议操作。',
    correctApproach: '使用内置HTTP工具直接调用API',
    example: 'GET https://www.aconfig.cn/api/v1/{platform}/{api_path}?{params}',
  };
}

/**
 * SkillExecutor - 统一执行器
 * 核心职责：根据 API 注册表直接调用接口，支持链式调用
 */
class SkillExecutor {
  /**
   * @param {object} options - 配置
   * @param {string} options.skillDir - skill 目录路径
   * @param {object} options.apiBase - API 基础配置 { url, authHeader, authEnvVar, prefix }
   * @param {object} options.registry - API 注册表（可选，不传则从 api-registry.json 加载）
   * @param {object} options.chainPatterns - 链式调用模式（可选，不传则从 chain-patterns.json 加载）
   */
  constructor(options = {}) {
    this.skillDir = options.skillDir || process.cwd();
    this.apiBase = options.apiBase || {};
    this.baseUrl = this.apiBase.url || 'https://www.aconfig.cn';
    this.authHeader = this.apiBase.authHeader || 'x-api-key';
    this.authEnvVar = this.apiBase.authEnvVar || 'MAXHUB_API_KEY';
    this.apiPrefix = this.apiBase.prefix || '';

    this.registry = options.registry || this._loadRegistry();
    this.chainPatterns = options.chainPatterns || this._loadChainPatterns();

    this._cache = new Map();
    this._callLog = [];
  }

  /**
   * 从 api-registry.json 加载注册表
   */
  _loadRegistry() {
    const regPath = path.join(this.skillDir, 'api-registry.json');
    if (fs.existsSync(regPath)) {
      return JSON.parse(fs.readFileSync(regPath, 'utf-8'));
    }
    const configPath = path.join(this.skillDir, 'config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      this.apiBase = config.apiBase || this.apiBase;
      this.baseUrl = this.apiBase.url || this.baseUrl;
      this.authHeader = this.apiBase.authHeader || this.authHeader;
      this.authEnvVar = this.apiBase.authEnvVar || this.authEnvVar;
      this.apiPrefix = this.apiBase.prefix || this.apiPrefix;
    }
    return {};
  }

  /**
   * 从 chain-patterns.json 加载链式调用模式
   */
  _loadChainPatterns() {
    const chainPath = path.join(this.skillDir, 'chain-patterns.json');
    if (fs.existsSync(chainPath)) {
      return JSON.parse(fs.readFileSync(chainPath, 'utf-8'));
    }
    return { patterns: [] };
  }

  /**
   * 获取 API 凭证
   */
  _getCredential() {
    return (typeof process !== 'undefined' && process.env?.[this.authEnvVar]) || '';
  }

  /**
   * 查找 API 定义
   * @param {string} apiPath - API 路径（如 /web/fetch_one_video）或完整路径或ID
   * @returns {object|null} API 定义
   */
  findApi(apiPath) {
    if (!this.registry.apis) return null;

    let normalized = apiPath;
    if (!normalized.startsWith('/')) {
      normalized = '/' + normalized;
    }

    const exact = this.registry.apis.find(a =>
      a.path === normalized ||
      a.path === `${this.apiPrefix}${normalized}` ||
      a.id === apiPath
    );
    if (exact) return exact;

    const fuzzy = this.registry.apis.find(a =>
      a.path.startsWith(normalized + '_v') ||
      a.path.startsWith(normalized.replace(/_v\d+$/, '')) ||
      a.id === apiPath.replace(/[/]/g, '_').replace(/^_/, '')
    );
    if (fuzzy) return fuzzy;

    const baseName = normalized.split('/').pop();
    if (baseName) {
      const byBase = this.registry.apis.find(a => {
        const apiBase = a.path.split('/').pop();
        return apiBase && apiBase.startsWith(baseName.replace(/_v\d+$/, ''));
      });
      if (byBase) return byBase;
    }

    return null;
  }

  /**
   * 搜索 API - 按关键词匹配
   * @param {string} keyword - 搜索关键词
   * @returns {Array} 匹配的 API 列表
   */
  searchApis(keyword) {
    if (!this.registry.apis) return [];
    const kw = keyword.toLowerCase();
    return this.registry.apis.filter(a =>
      (a.path || '').toLowerCase().includes(kw) ||
      (a.summary || '').toLowerCase().includes(kw) ||
      (a.description || '').toLowerCase().includes(kw) ||
      (a.category || '').toLowerCase().includes(kw)
    );
  }

  /**
   * 执行单次 API 调用
   * @param {string} apiPath - API 路径
   * @param {object} params - 请求参数
   * @returns {Promise<object>} 调用结果
   */
  async call(apiPath, params = {}) {
    const apiDef = this.findApi(apiPath);
    if (!apiDef) {
      return { success: false, error: `未找到API: ${apiPath}`, availableApis: this.listApis() };
    }

    const credential = this._getCredential();
    if (!credential) {
      return { success: false, error: `未配置API密钥，请设置环境变量 ${this.authEnvVar}` };
    }

    const method = (apiDef.method || 'GET').toUpperCase();
    let fullPath;
    if (apiDef.path.startsWith('/api/')) {
      fullPath = apiDef.path;
    } else if (apiDef.path.startsWith('/')) {
      fullPath = `${this.apiPrefix}${apiDef.path}`;
    } else {
      fullPath = `${this.apiPrefix}/${apiDef.path}`;
    }
    const url = `${this.baseUrl}${fullPath}`;

    const reqParams = this._buildParams(apiDef, params);
    const cacheKey = `${method}:${url}:${JSON.stringify(reqParams)}`;

    if (method === 'GET' && this._cache.has(cacheKey)) {
      const cached = this._cache.get(cacheKey);
      if (Date.now() - cached.timestamp < 180000) {
        return { ...cached.data, _fromCache: true };
      }
      this._cache.delete(cacheKey);
    }

    const startTime = Date.now();
    try {
      const result = await this._httpRequest(url, reqParams, method, credential);
      const duration = Date.now() - startTime;

      if (method === 'GET') {
        this._cache.set(cacheKey, { data: result, timestamp: Date.now() });
      }

      this._logCall(apiDef, duration, true);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this._logCall(apiDef, duration, false, error.message);
      return { success: false, error: error.message, apiPath };
    }
  }

  /**
   * 执行链式调用
   * 按顺序执行多个 API，上一步的结果可作为下一步的参数
   * @param {Array} steps - 调用步骤数组 [{ api, params, paramMapping }]
   *   - api: API 路径
   *   - params: 固定参数
   *   - paramMapping: 参数映射 { 目标参数名: '上一步返回值的JSONPath' }
   * @returns {Promise<object>} 链式调用结果，包含每步的输出
   */
  async chain(steps) {
    if (!steps || steps.length === 0) {
      return { success: false, error: '链式调用步骤为空' };
    }
    if (steps.length > MAX_CHAIN_DEPTH) {
      return { success: false, error: `链式调用深度超过限制(${MAX_CHAIN_DEPTH})` };
    }

    const results = [];
    let lastResult = null;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepParams = { ...(step.params || {}) };

      if (step.paramMapping && lastResult) {
        for (const [targetKey, sourcePath] of Object.entries(step.paramMapping)) {
          const value = this._resolvePath(lastResult, sourcePath);
          if (value !== undefined && value !== null) {
            stepParams[targetKey] = value;
          }
        }
      }

      const result = await this.call(step.api, stepParams);
      results.push({
        step: i + 1,
        api: step.api,
        params: stepParams,
        result,
      });

      if (!result.success && result.success !== undefined) {
        return {
          success: false,
          error: `链式调用在第${i + 1}步失败: ${result.error}`,
          completedSteps: results,
        };
      }

      lastResult = result;
    }

    return {
      success: true,
      steps: results,
      finalResult: lastResult,
    };
  }

  /**
   * 按预设模式执行链式调用
   * @param {string} patternName - 模式名称
   * @param {object} initialParams - 初始参数
   * @returns {Promise<object>} 链式调用结果
   */
  async chainByPattern(patternName, initialParams = {}) {
    const pattern = this.chainPatterns.patterns?.find(p => p.name === patternName);
    if (!pattern) {
      return { success: false, error: `未找到链式调用模式: ${patternName}` };
    }
    return this.chain(pattern.steps.map(step => ({
      api: step.api,
      params: { ...initialParams, ...(step.params || {}) },
      paramMapping: step.paramMapping || {},
    })));
  }

  /**
   * 批量调用同一 API
   * @param {string} apiPath - API 路径
   * @param {Array<object>} paramsList - 参数列表
   * @returns {Promise<Array>} 所有调用结果
   */
  async batch(apiPath, paramsList) {
    if (!paramsList || paramsList.length === 0) return [];
    if (paramsList.length > MAX_BATCH_SIZE) {
      return [{ success: false, error: `批量调用超过限制(${MAX_BATCH_SIZE})` }];
    }

    const results = [];
    for (const params of paramsList) {
      const result = await this.call(apiPath, params);
      results.push(result);
    }
    return results;
  }

  /**
   * 列出所有可用 API
   * @param {string} category - 按分类筛选（可选）
   * @returns {Array} API 列表
   */
  listApis(category) {
    if (!this.registry.apis) return [];
    if (category) {
      return this.registry.apis.filter(a => a.category === category);
    }
    return this.registry.apis;
  }

  /**
   * 列出所有分类
   */
  listCategories() {
    if (!this.registry.apis) return [];
    const cats = new Set(this.registry.apis.map(a => a.category).filter(Boolean));
    return [...cats];
  }

  /**
   * 列出所有链式调用模式
   */
  listChainPatterns() {
    return this.chainPatterns.patterns || [];
  }

  /**
   * 获取调用日志
   */
  getCallLog() {
    return this._callLog;
  }

  /**
   * 协议验证 - 检查操作是否符合执行协议
   * @param {string} actionType - 操作类型: 'file_write' | 'command' | 'code'
   * @param {string} content - 操作内容
   * @returns {object} 验证结果 { valid, violation, feedback }
   */
  validateAction(actionType, content) {
    if (actionType === 'file_write') {
      const detection = detectScriptFile(content);
      if (detection.isScript) {
        return {
          valid: false,
          violation: 'script_generation',
          feedback: generateProtocolFeedback('script_generation'),
          detection,
        };
      }
    }

    if (actionType === 'command') {
      const scriptCmdPattern = /\b(node|python|python3|bash|sh|deno|bun)\s+/;
      if (scriptCmdPattern.test(content)) {
        return {
          valid: false,
          violation: 'script_execution',
          feedback: generateProtocolFeedback('script_execution'),
        };
      }
    }

    if (actionType === 'code') {
      const detection = detectScriptGeneration(content);
      if (detection.isScript) {
        return {
          valid: false,
          violation: 'module_import',
          feedback: generateProtocolFeedback('module_import'),
          detection,
        };
      }
    }

    return { valid: true, violation: null, feedback: null };
  }

  /**
   * 获取执行协议摘要
   * 供 agent 在开始时读取，了解执行规范
   * @returns {object} 协议摘要
   */
  getProtocolSummary() {
    return {
      mode: 'direct_api_call',
      prohibitScriptGeneration: true,
      allowedMethods: ['HTTP GET', 'HTTP POST'],
      baseUrl: this.baseUrl,
      apiPrefix: this.apiPrefix,
      authHeader: this.authHeader,
      authEnvVar: this.authEnvVar,
      totalApis: this.registry.apis?.length || 0,
      chainPatterns: this.chainPatterns.patterns?.length || 0,
      rules: [
        '禁止生成脚本文件（.js/.ts/.py/.sh等）',
        '禁止使用 require/import 导入模块',
        '禁止执行 node/python/bash 命令',
        '必须使用内置HTTP工具直接请求API',
      ],
    };
  }

  /**
   * 构建请求参数 - 只保留 API 定义中声明的参数
   */
  _buildParams(apiDef, userParams) {
    if (!apiDef.params || apiDef.params.length === 0) {
      return userParams;
    }
    const result = {};
    for (const p of apiDef.params) {
      const name = typeof p === 'string' ? p : p.name;
      if (userParams[name] !== undefined && userParams[name] !== null && userParams[name] !== '') {
        result[name] = userParams[name];
      }
    }
    return result;
  }

  /**
   * 执行 HTTP 请求
   */
  async _httpRequest(url, params, method, credential) {
    const headers = {
      [this.authHeader]: credential,
      'Content-Type': 'application/json',
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      let response;
      if (method === 'GET') {
        const query = new URLSearchParams(params).toString();
        const fullUrl = query ? `${url}?${query}` : url;
        response = await fetch(fullUrl, { method, headers, signal: controller.signal });
      } else {
        response = await fetch(url, {
          method,
          headers,
          body: JSON.stringify(params),
          signal: controller.signal,
        });
      }

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
        throw new Error(data.message || `请求失败: ${response.status}`);
      }

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(`请求超时(${REQUEST_TIMEOUT}ms)`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * 从对象中按路径取值（支持 a.b.c 格式）
   */
  _resolvePath(obj, pathStr) {
    if (!obj || !pathStr) return undefined;
    return pathStr.split('.').reduce((o, k) => {
      if (o === null || o === undefined) return undefined;
      if (Array.isArray(o)) {
        return o.length > 0 ? o[0][k] : undefined;
      }
      return o[k];
    }, obj);
  }

  /**
   * 记录调用日志
   */
  _logCall(apiDef, duration, success, error) {
    this._callLog.push({
      api: apiDef.path,
      duration,
      success,
      error: error || null,
      timestamp: Date.now(),
    });
    if (this._callLog.length > 200) {
      this._callLog = this._callLog.slice(-100);
    }
  }
}

/**
 * 便捷函数 - 快速创建执行器并调用
 * @param {string} skillDir - skill 目录路径
 * @param {string} apiPath - API 路径
 * @param {object} params - 请求参数
 * @returns {Promise<object>} 调用结果
 */
async function quickCall(skillDir, apiPath, params = {}) {
  const executor = new SkillExecutor({ skillDir });
  return executor.call(apiPath, params);
}

/**
 * 便捷函数 - 快速链式调用
 * @param {string} skillDir - skill 目录路径
 * @param {Array} steps - 调用步骤
 * @returns {Promise<object>} 链式调用结果
 */
async function quickChain(skillDir, steps) {
  const executor = new SkillExecutor({ skillDir });
  return executor.chain(steps);
}

/**
 * 从现有 api.js 的 API_REGISTRY 格式转换为新的 api-registry.json 格式
 * @param {object} oldRegistry - 旧的 API_REGISTRY 对象
 * @param {string} apiPrefix - API 前缀
 * @returns {object} 新格式的注册表
 */
function convertLegacyRegistry(oldRegistry, apiPrefix = '') {
  const apis = [];
  for (const [name, def] of Object.entries(oldRegistry)) {
    apis.push({
      id: name,
      path: def.path,
      method: def.method || 'GET',
      summary: def.summary || '',
      description: def.description || '',
      params: (def.params || []).map(p => typeof p === 'string' ? { name: p, required: true } : p),
      price: def.price || 0,
      category: def.category || _inferCategory(def.path),
    });
  }
  return { version: '2.0', apiPrefix, apis };
}

function _inferCategory(apiPath) {
  if (apiPath.includes('/web/')) return 'web';
  if (apiPath.includes('/app/')) return 'app';
  return 'default';
}

module.exports = {
  SkillExecutor,
  quickCall,
  quickChain,
  convertLegacyRegistry,
  detectScriptGeneration,
  detectScriptFile,
  generateProtocolFeedback,
};
