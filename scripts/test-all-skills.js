#!/usr/bin/env node

/**
 * Skill 系统全量测试脚本
 * 模拟全新安装初始状态，对每个 skill 模块进行独立测试
 * 测试维度：模块加载、配置校验、API注册表、链式调用、协议验证、内容完整性、跨模块一致性
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..');
const SHARED_DIR = path.join(SKILLS_DIR, 'shared');

// 清除 require 缓存，模拟全新安装
function clearRequireCache() {
  const keysToDelete = [];
  for (const key of Object.keys(require.cache)) {
    if (key.includes('skills-repo')) {
      keysToDelete.push(key);
    }
  }
  keysToDelete.forEach(k => delete require.cache[k]);
}

// 测试结果收集
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  issues: [],
  skillResults: {},
};

function log(skillName, category, testName, status, detail) {
  results.total++;
  if (status === 'PASS') results.passed++;
  else if (status === 'FAIL') results.failed++;
  else if (status === 'WARN') results.warnings++;

  if (!results.skillResults[skillName]) {
    results.skillResults[skillName] = { passed: 0, failed: 0, warnings: 0, issues: [] };
  }
  if (status === 'PASS') results.skillResults[skillName].passed++;
  else if (status === 'FAIL') results.skillResults[skillName].failed++;
  else if (status === 'WARN') results.skillResults[skillName].warnings++;

  const entry = { skill: skillName, category, test: testName, status, detail };
  if (status !== 'PASS') {
    results.issues.push(entry);
    results.skillResults[skillName].issues.push(entry);
  }
}

// ==================== 测试1: 共享模块测试 ====================

function testSharedModules() {
  console.log('\n' + '='.repeat(60));
  console.log('📦 测试共享模块');
  console.log('='.repeat(60));

  clearRequireCache();

  // 测试 skill-executor.js 加载
  try {
    const executor = require(path.join(SHARED_DIR, 'skill-executor.js'));
    log('_shared', 'module_load', 'skill-executor.js加载', 'PASS');

    // 测试导出完整性
    const expectedExports = ['SkillExecutor', 'quickCall', 'quickChain', 'convertLegacyRegistry', 'detectScriptGeneration', 'detectScriptFile', 'generateProtocolFeedback'];
    for (const exp of expectedExports) {
      if (executor[exp]) {
        log('_shared', 'exports', `导出 ${exp}`, 'PASS');
      } else {
        log('_shared', 'exports', `导出 ${exp}`, 'FAIL', `缺少导出: ${exp}`);
      }
    }

    // 测试脚本检测功能
    const scriptTests = [
      { fn: 'detectScriptGeneration', args: ['const x = require("a")'], expected: true, desc: 'require检测' },
      { fn: 'detectScriptGeneration', args: ['import { x } from "y"'], expected: true, desc: 'import检测' },
      { fn: 'detectScriptGeneration', args: ['module.exports = {}'], expected: true, desc: 'module.exports检测' },
      { fn: 'detectScriptGeneration', args: ['搜索B站视频'], expected: false, desc: '正常文本放行' },
      { fn: 'detectScriptFile', args: ['test.js'], expected: true, desc: '.js文件检测' },
      { fn: 'detectScriptFile', args: ['test.py'], expected: true, desc: '.py文件检测' },
      { fn: 'detectScriptFile', args: ['config.json'], expected: false, desc: '.json文件放行' },
      { fn: 'detectScriptFile', args: ['SKILL.md'], expected: false, desc: '.md文件放行' },
    ];

    for (const t of scriptTests) {
      const result = executor[t.fn](...t.args);
      if (result.isScript === t.expected) {
        log('_shared', 'script_detection', t.desc, 'PASS');
      } else {
        log('_shared', 'script_detection', t.desc, 'FAIL', `期望 isScript=${t.expected}, 实际=${result.isScript}`);
      }
    }

    // 测试协议违规反馈
    const feedback = executor.generateProtocolFeedback('script_generation');
    if (feedback.code === 'PROTOCOL_VIOLATION' && feedback.message && feedback.correctApproach) {
      log('_shared', 'protocol_feedback', '协议违规反馈完整性', 'PASS');
    } else {
      log('_shared', 'protocol_feedback', '协议违规反馈完整性', 'FAIL', '反馈内容不完整');
    }

  } catch (e) {
    log('_shared', 'module_load', 'skill-executor.js加载', 'FAIL', e.message);
  }
}

// ==================== 测试2: 单个 Skill 模块测试 ====================

function testSkillModule(skillDir, skillName) {
  clearRequireCache();

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`🔍 测试 ${skillName}`);
  console.log('─'.repeat(50));

  // 2.1 模块加载测试
  try {
    const skill = require(path.join(skillDir, 'index.ts'));
    log(skillName, 'module_load', 'index.ts加载', 'PASS');

    // 检查必要导出
    const requiredExports = ['handle', 'chain', 'chainByPattern', 'batch', 'listApis', 'listChainPatterns', 'validateAction', 'getProtocolSummary', 'executor', 'config'];
    for (const exp of requiredExports) {
      if (skill[exp] !== undefined) {
        log(skillName, 'exports', `导出 ${exp}`, 'PASS');
      } else {
        log(skillName, 'exports', `导出 ${exp}`, 'FAIL', `缺少导出: ${exp}`);
      }
    }
  } catch (e) {
    log(skillName, 'module_load', 'index.ts加载', 'FAIL', e.message);
    return;
  }

  // 2.2 配置文件测试
  const configPath = path.join(skillDir, 'config.json');
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      log(skillName, 'config', 'config.json解析', 'PASS');

      if (config.platform) {
        log(skillName, 'config', 'platform字段', 'PASS');
      } else {
        log(skillName, 'config', 'platform字段', 'WARN', '缺少platform字段');
      }

      if (config.apiBase && config.apiBase.url && config.apiBase.prefix) {
        log(skillName, 'config', 'apiBase完整性', 'PASS');
      } else {
        log(skillName, 'config', 'apiBase完整性', 'FAIL', 'apiBase缺少url或prefix');
      }

      if (config.requires && config.requires.primaryEnv) {
        log(skillName, 'config', 'requires.primaryEnv', 'PASS');
      } else {
        log(skillName, 'config', 'requires.primaryEnv', 'WARN', '缺少requires.primaryEnv');
      }
    } catch (e) {
      log(skillName, 'config', 'config.json解析', 'FAIL', e.message);
    }
  } else {
    log(skillName, 'config', 'config.json存在', 'FAIL', '文件不存在');
  }

  // 2.3 API注册表测试
  const registryPath = path.join(skillDir, 'api-registry.json');
  if (fs.existsSync(registryPath)) {
    try {
      const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
      log(skillName, 'registry', 'api-registry.json解析', 'PASS');

      if (registry.version) {
        log(skillName, 'registry', 'version字段', 'PASS');
      } else {
        log(skillName, 'registry', 'version字段', 'WARN', '缺少version字段');
      }

      if (registry.apis && Array.isArray(registry.apis)) {
        log(skillName, 'registry', `API数量: ${registry.apis.length}`, 'PASS');

        // 检查每个API的完整性
        let incompleteApis = 0;
        let noSummaryApis = 0;
        for (const api of registry.apis) {
          if (!api.path || !api.id) {
            incompleteApis++;
          }
          if (!api.summary || api.summary === '') {
            noSummaryApis++;
          }
          if (api.params && !Array.isArray(api.params)) {
            log(skillName, 'registry', `API ${api.id} params格式`, 'FAIL', 'params不是数组');
          }
        }
        if (incompleteApis > 0) {
          log(skillName, 'registry', 'API完整性', 'FAIL', `${incompleteApis}个API缺少path或id`);
        } else {
          log(skillName, 'registry', 'API完整性', 'PASS');
        }
        if (noSummaryApis > 0) {
          log(skillName, 'registry', 'API摘要', 'WARN', `${noSummaryApis}个API缺少summary`);
        } else {
          log(skillName, 'registry', 'API摘要', 'PASS');
        }

        // 检查API路径重复
        const pathCounts = {};
        for (const api of registry.apis) {
          pathCounts[api.path] = (pathCounts[api.path] || 0) + 1;
        }
        const duplicates = Object.entries(pathCounts).filter(([, c]) => c > 1);
        if (duplicates.length > 0) {
          log(skillName, 'registry', 'API路径重复', 'WARN', `重复路径: ${duplicates.map(([p, c]) => `${p}(${c}次)`).join(', ')}`);
        } else {
          log(skillName, 'registry', 'API路径唯一性', 'PASS');
        }
      } else {
        log(skillName, 'registry', 'apis字段', 'FAIL', '缺少apis数组');
      }
    } catch (e) {
      log(skillName, 'registry', 'api-registry.json解析', 'FAIL', e.message);
    }
  } else {
    log(skillName, 'registry', 'api-registry.json存在', 'FAIL', '文件不存在');
  }

  // 2.4 链式调用模式测试
  const chainPath = path.join(skillDir, 'chain-patterns.json');
  if (fs.existsSync(chainPath)) {
    try {
      const chains = JSON.parse(fs.readFileSync(chainPath, 'utf-8'));
      log(skillName, 'chain', 'chain-patterns.json解析', 'PASS');

      if (chains.patterns && Array.isArray(chains.patterns)) {
        log(skillName, 'chain', `链式模式数量: ${chains.patterns.length}`, 'PASS');

        for (const p of chains.patterns) {
          if (!p.name || !p.trigger || !p.steps || p.steps.length === 0) {
            log(skillName, 'chain', `模式 ${p.name || 'unnamed'} 完整性`, 'FAIL', '缺少name/trigger/steps');
          }
          for (const step of (p.steps || [])) {
            if (!step.api || !step.description) {
              log(skillName, 'chain', `模式 ${p.name} 步骤完整性`, 'WARN', `步骤缺少api或description`);
            }
          }
        }
      } else {
        log(skillName, 'chain', 'patterns字段', 'WARN', '缺少patterns数组');
      }
    } catch (e) {
      log(skillName, 'chain', 'chain-patterns.json解析', 'FAIL', e.message);
    }
  } else {
    log(skillName, 'chain', 'chain-patterns.json存在', 'FAIL', '文件不存在');
  }

  // 2.5 SkillExecutor 功能测试
  try {
    const skill = require(path.join(skillDir, 'index.ts'));

    // 列出API
    const apis = skill.listApis();
    log(skillName, 'executor', `listApis()返回${apis.length}个API`, apis.length > 0 ? 'PASS' : 'FAIL', apis.length === 0 ? 'API列表为空' : '');

    // 按分类列出
    const categories = [...new Set(apis.map(a => a.category).filter(Boolean))];
    for (const cat of categories) {
      const catApis = skill.listApis(cat);
      log(skillName, 'executor', `listApis('${cat}')返回${catApis.length}个`, catApis.length > 0 ? 'PASS' : 'FAIL');
    }

    // 搜索API
    if (apis.length > 0) {
      const searchKeyword = apis[0].path.split('/').pop()?.replace('fetch_', '') || 'search';
      const searchResults = skill.executor.searchApis(searchKeyword);
      log(skillName, 'executor', `searchApis('${searchKeyword}')返回${searchResults.length}个`, 'PASS');
    }

    // 查找API
    if (apis.length > 0) {
      const found = skill.executor.findApi(apis[0].path);
      if (found && found.id === apis[0].id) {
        log(skillName, 'executor', 'findApi()精确查找', 'PASS');
      } else {
        log(skillName, 'executor', 'findApi()精确查找', 'FAIL', `查找 ${apis[0].path} 失败`);
      }
    }

    // 协议验证
    const v1 = skill.validateAction('file_write', 'test.js');
    if (!v1.valid && v1.violation === 'script_generation') {
      log(skillName, 'executor', 'validateAction拦截脚本文件', 'PASS');
    } else {
      log(skillName, 'executor', 'validateAction拦截脚本文件', 'FAIL', '未能拦截.js文件');
    }

    const v2 = skill.validateAction('command', 'node script.js');
    if (!v2.valid && v2.violation === 'script_execution') {
      log(skillName, 'executor', 'validateAction拦截node命令', 'PASS');
    } else {
      log(skillName, 'executor', 'validateAction拦截node命令', 'FAIL', '未能拦截node命令');
    }

    const v3 = skill.validateAction('command', 'curl https://api.example.com');
    if (v3.valid) {
      log(skillName, 'executor', 'validateAction放行curl命令', 'PASS');
    } else {
      log(skillName, 'executor', 'validateAction放行curl命令', 'FAIL', '误拦截curl命令');
    }

    // 协议摘要
    const summary = skill.getProtocolSummary();
    if (summary.mode === 'direct_api_call' && summary.prohibitScriptGeneration === true) {
      log(skillName, 'executor', 'getProtocolSummary()完整性', 'PASS');
    } else {
      log(skillName, 'executor', 'getProtocolSummary()完整性', 'FAIL', '协议摘要不完整');
    }

  } catch (e) {
    log(skillName, 'executor', 'SkillExecutor功能测试', 'FAIL', e.message);
  }

  // 2.6 SKILL.md 内容测试
  const skillMdPath = path.join(skillDir, 'SKILL.md');
  if (fs.existsSync(skillMdPath)) {
    const content = fs.readFileSync(skillMdPath, 'utf-8');
    log(skillName, 'skillmd', 'SKILL.md存在', 'PASS');

    const checks = [
      { name: '禁止生成脚本规则', pattern: /禁止生成脚本/ },
      { name: '禁止执行脚本规则', pattern: /禁止执行脚本/ },
      { name: '执行约束章节', pattern: /执行约束/ },
      { name: '决策流程', pattern: /决策流程/ },
      { name: '调用方法/请求格式', pattern: /请求格式/ },
      { name: '版本号v3.0', pattern: /3\.0\.0/ },
      { name: 'prohibitScriptGeneration', pattern: /prohibitScriptGeneration/ },
      { name: 'API路径表格', pattern: /API路径.*方法.*必填参数/ },
    ];

    for (const check of checks) {
      if (check.pattern.test(content)) {
        log(skillName, 'skillmd', check.name, 'PASS');
      } else {
        log(skillName, 'skillmd', check.name, 'FAIL', `SKILL.md缺少: ${check.name}`);
      }
    }

    // 检查YAML front matter
    const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (yamlMatch) {
      log(skillName, 'skillmd', 'YAML front matter', 'PASS');
      const yaml = yamlMatch[1];
      if (/execution:/.test(yaml) && /mode:\s*direct_api_call/.test(yaml)) {
        log(skillName, 'skillmd', 'YAML execution配置', 'PASS');
      } else {
        log(skillName, 'skillmd', 'YAML execution配置', 'FAIL', '缺少execution.mode: direct_api_call');
      }
    } else {
      log(skillName, 'skillmd', 'YAML front matter', 'FAIL', '缺少YAML front matter');
    }
  } else {
    log(skillName, 'skillmd', 'SKILL.md存在', 'FAIL', '文件不存在');
  }

  // 2.7 system.prompt.md 内容测试
  const promptPath = path.join(skillDir, 'system.prompt.md');
  if (fs.existsSync(promptPath)) {
    const content = fs.readFileSync(promptPath, 'utf-8');
    log(skillName, 'prompt', 'system.prompt.md存在', 'PASS');

    const checks = [
      { name: '禁止行为章节', pattern: /禁止行为/ },
      { name: '禁止生成脚本', pattern: /禁止生成脚本文件/ },
      { name: '禁止require/import', pattern: /禁止使用.*require.*import/ },
      { name: '执行协议章节', pattern: /执行协议/ },
      { name: '5步协议流程', pattern: /步骤1.*分析意图/ },
      { name: '自检机制', pattern: /自检机制/ },
      { name: 'API列表', pattern: /API路径.*方法.*必填参数/ },
      { name: '错误处理', pattern: /401.*API Key/ },
      { name: '完整URL示例', pattern: /aconfig\.cn/ },
      { name: 'x-api-key示例', pattern: /x-api-key/ },
    ];

    for (const check of checks) {
      if (check.pattern.test(content)) {
        log(skillName, 'prompt', check.name, 'PASS');
      } else {
        log(skillName, 'prompt', check.name, 'FAIL', `system.prompt.md缺少: ${check.name}`);
      }
    }
  } else {
    log(skillName, 'prompt', 'system.prompt.md存在', 'FAIL', '文件不存在');
  }

  // 2.8 manifest.json 测试
  const manifestPath = path.join(skillDir, 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
      log(skillName, 'manifest', 'manifest.json解析', 'PASS');

      if (manifest.files) {
        const requiredFiles = ['skill', 'systemPrompt', 'config', 'apiRegistry', 'chainPatterns'];
        for (const f of requiredFiles) {
          if (manifest.files[f]) {
            log(skillName, 'manifest', `files.${f}`, 'PASS');
          } else {
            log(skillName, 'manifest', `files.${f}`, 'WARN', `缺少files.${f}`);
          }
        }
      } else {
        log(skillName, 'manifest', 'files字段', 'FAIL', '缺少files字段');
      }

      if (manifest.execution && manifest.execution.mode === 'direct_api_call') {
        log(skillName, 'manifest', 'execution.mode', 'PASS');
      } else {
        log(skillName, 'manifest', 'execution.mode', 'FAIL', '缺少execution.mode: direct_api_call');
      }
    } catch (e) {
      log(skillName, 'manifest', 'manifest.json解析', 'FAIL', e.message);
    }
  } else {
    log(skillName, 'manifest', 'manifest.json存在', 'FAIL', '文件不存在');
  }
}

// ==================== 测试3: 跨模块一致性检查 ====================

function testCrossModuleConsistency() {
  console.log('\n' + '='.repeat(60));
  console.log('🔗 跨模块一致性检查');
  console.log('='.repeat(60));

  const skillDirs = fs.readdirSync(SKILLS_DIR).filter(d =>
    d.startsWith('maxhub-') && fs.statSync(path.join(SKILLS_DIR, d)).isDirectory()
  );

  // 检查版本号一致性
  const versions = new Set();
  for (const dir of skillDirs) {
    const skillMdPath = path.join(SKILLS_DIR, dir, 'SKILL.md');
    if (fs.existsSync(skillMdPath)) {
      const content = fs.readFileSync(skillMdPath, 'utf-8');
      const vMatch = content.match(/version:\s*(\S+)/);
      if (vMatch) versions.add(vMatch[1]);
    }
  }
  if (versions.size <= 1) {
    log('_consistency', 'version', '所有skill版本号一致', 'PASS', `版本: ${[...versions].join(', ')}`);
  } else {
    log('_consistency', 'version', 'skill版本号不一致', 'WARN', `发现版本: ${[...versions].join(', ')}`);
  }

  // 检查共享依赖引用一致性
  const indexContents = [];
  for (const dir of skillDirs) {
    const indexPath = path.join(SKILLS_DIR, dir, 'index.ts');
    if (fs.existsSync(indexPath)) {
      indexContents.push({ dir, content: fs.readFileSync(indexPath, 'utf-8') });
    }
  }

  const sharedRefPattern = /require\(['"]([^'"]*shared[^'"]*)['"]\)/g;
  const sharedRefs = new Set();
  for (const { dir, content } of indexContents) {
    let match;
    while ((match = sharedRefPattern.exec(content)) !== null) {
      sharedRefs.add(match[1]);
    }
  }
  if (sharedRefs.size <= 1) {
    log('_consistency', 'shared_ref', '共享依赖引用路径一致', 'PASS', `路径: ${[...sharedRefs].join(', ')}`);
  } else {
    log('_consistency', 'shared_ref', '共享依赖引用路径不一致', 'WARN', `路径: ${[...sharedRefs].join(', ')}`);
  }

  // 检查api-registry.json格式一致性
  const registryVersions = new Set();
  for (const dir of skillDirs) {
    const regPath = path.join(SKILLS_DIR, dir, 'api-registry.json');
    if (fs.existsSync(regPath)) {
      const reg = JSON.parse(fs.readFileSync(regPath, 'utf-8'));
      if (reg.version) registryVersions.add(reg.version);
    }
  }
  if (registryVersions.size <= 1) {
    log('_consistency', 'registry_version', 'api-registry.json版本一致', 'PASS', `版本: ${[...registryVersions].join(', ')}`);
  } else {
    log('_consistency', 'registry_version', 'api-registry.json版本不一致', 'WARN', `版本: ${[...registryVersions].join(', ')}`);
  }

  // 检查禁止规则覆盖一致性
  let allHaveProhibit = true;
  for (const dir of skillDirs) {
    const promptPath = path.join(SKILLS_DIR, dir, 'system.prompt.md');
    if (fs.existsSync(promptPath)) {
      const content = fs.readFileSync(promptPath, 'utf-8');
      if (!/禁止生成脚本文件/.test(content) || !/禁止使用.*require/.test(content)) {
        allHaveProhibit = false;
        log('_consistency', 'prohibit_rules', `${dir} 缺少禁止规则`, 'FAIL');
      }
    }
  }
  if (allHaveProhibit) {
    log('_consistency', 'prohibit_rules', '所有skill禁止规则覆盖一致', 'PASS');
  }

  // 检查执行协议覆盖一致性
  let allHaveProtocol = true;
  for (const dir of skillDirs) {
    const promptPath = path.join(SKILLS_DIR, dir, 'system.prompt.md');
    if (fs.existsSync(promptPath)) {
      const content = fs.readFileSync(promptPath, 'utf-8');
      if (!/执行协议/.test(content) || !/步骤1.*分析意图/.test(content)) {
        allHaveProtocol = false;
        log('_consistency', 'protocol', `${dir} 缺少执行协议`, 'FAIL');
      }
    }
  }
  if (allHaveProtocol) {
    log('_consistency', 'protocol', '所有skill执行协议覆盖一致', 'PASS');
  }
}

// ==================== 主执行函数 ====================

function main() {
  console.log('🧪 Skill 系统全量测试');
  console.log('模拟全新安装初始状态，逐模块独立测试');
  console.log(`时间: ${new Date().toISOString()}`);

  // 测试共享模块
  testSharedModules();

  // 测试每个skill模块
  const skillDirs = fs.readdirSync(SKILLS_DIR).filter(d =>
    d.startsWith('maxhub-') && fs.statSync(path.join(SKILLS_DIR, d)).isDirectory()
  );

  for (const dir of skillDirs) {
    const skillDir = path.join(SKILLS_DIR, dir);
    testSkillModule(skillDir, dir);
  }

  // 跨模块一致性检查
  testCrossModuleConsistency();

  // 输出结果
  console.log('\n' + '='.repeat(60));
  console.log('📊 测试结果汇总');
  console.log('='.repeat(60));
  console.log(`总测试数: ${results.total}`);
  console.log(`✅ 通过: ${results.passed}`);
  console.log(`❌ 失败: ${results.failed}`);
  console.log(`⚠️  警告: ${results.warnings}`);
  console.log(`通过率: ${((results.passed / results.total) * 100).toFixed(1)}%`);

  console.log('\n' + '-'.repeat(60));
  console.log('各Skill测试概况:');
  for (const [name, r] of Object.entries(results.skillResults)) {
    const total = r.passed + r.failed + r.warnings;
    const rate = total > 0 ? ((r.passed / total) * 100).toFixed(0) : 0;
    const status = r.failed > 0 ? '❌' : r.warnings > 0 ? '⚠️' : '✅';
    console.log(`  ${status} ${name}: ${r.passed}/${total} 通过 (${rate}%) ${r.failed > 0 ? `失败${r.failed}项` : ''} ${r.warnings > 0 ? `警告${r.warnings}项` : ''}`);
  }

  // 分类整理问题
  if (results.issues.length > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('🔍 问题分类整理');
    console.log('='.repeat(60));

    const categories = {};
    for (const issue of results.issues) {
      const key = `${issue.category}:${issue.status}`;
      if (!categories[key]) categories[key] = [];
      categories[key].push(issue);
    }

    for (const [key, issues] of Object.entries(categories)) {
      console.log(`\n【${key}】(${issues.length}个)`);
      for (const issue of issues.slice(0, 5)) {
        console.log(`  - ${issue.skill} | ${issue.test} | ${issue.detail || ''}`);
      }
      if (issues.length > 5) {
        console.log(`  ... 还有 ${issues.length - 5} 个同类问题`);
      }
    }
  }

  // 保存详细结果到JSON
  const reportPath = path.join(SKILLS_DIR, 'test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`\n📄 详细测试报告已保存: ${reportPath}`);

  // 返回退出码
  process.exit(results.failed > 0 ? 1 : 0);
}

main();
