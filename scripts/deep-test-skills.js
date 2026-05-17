#!/usr/bin/env node

/**
 * Skill 系统深度测试脚本
 * 覆盖边界条件、API路径一致性、参数校验、性能基准、链式调用逻辑验证
 * 每个测试会话前清除缓存，模拟全新安装
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..');
const SHARED_DIR = path.join(SKILLS_DIR, 'shared');

function clearRequireCache() {
  for (const key of Object.keys(require.cache)) {
    if (key.includes('skills-repo')) delete require.cache[key];
  }
}

const issues = [];

function report(category, skill, test, severity, detail) {
  issues.push({ category, skill, test, severity, detail });
  const icon = severity === 'CRITICAL' ? '🔴' : severity === 'ERROR' ? '❌' : severity === 'WARN' ? '⚠️' : 'ℹ️';
  console.log(`  ${icon} [${category}] ${skill} | ${test} | ${detail}`);
}

// ==================== 深度测试1: API路径与config.json前缀一致性 ====================

function testApiPathConsistency() {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 深度测试1: API路径与config.json前缀一致性');
  console.log('='.repeat(60));

  const skillDirs = fs.readdirSync(SKILLS_DIR).filter(d =>
    d.startsWith('maxhub-') && fs.statSync(path.join(SKILLS_DIR, d)).isDirectory()
  );

  for (const dir of skillDirs) {
    clearRequireCache();
    const skillDir = path.join(SKILLS_DIR, dir);

    const configPath = path.join(skillDir, 'config.json');
    const registryPath = path.join(skillDir, 'api-registry.json');

    if (!fs.existsSync(configPath) || !fs.existsSync(registryPath)) continue;

    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));

    const apiPrefix = config.apiBase?.prefix || '';

    // 检查api-registry.json中的apiPrefix是否与config.json一致
    if (registry.apiPrefix !== apiPrefix) {
      report('PATH_CONSISTENCY', dir, 'apiPrefix不一致', 'ERROR',
        `config.json prefix="${apiPrefix}", api-registry.json apiPrefix="${registry.apiPrefix}"`);
    }

    // 检查API路径是否以正确的前缀开头
    if (registry.apis) {
      for (const api of registry.apis) {
        // API路径不应包含apiPrefix（因为前缀会在调用时拼接）
        if (api.path.startsWith(apiPrefix)) {
          report('PATH_CONSISTENCY', dir, `API路径包含前缀: ${api.path}`, 'WARN',
            `路径不应包含apiPrefix "${apiPrefix}"，调用时会重复拼接`);
        }
        // API路径应以/开头
        if (!api.path.startsWith('/')) {
          report('PATH_CONSISTENCY', dir, `API路径不以/开头: ${api.path}`, 'ERROR',
            'API路径必须以/开头');
        }
      }
    }

    // 检查SKILL.md中的URL示例是否正确
    const skillMdPath = path.join(skillDir, 'SKILL.md');
    if (fs.existsSync(skillMdPath)) {
      const content = fs.readFileSync(skillMdPath, 'utf-8');
      const urlPattern = /aconfig\.cn(\/api\/v1\/[\w-]+)?/g;
      let match;
      while ((match = urlPattern.exec(content)) !== null) {
        const urlPath = match[1];
        if (urlPath && !urlPath.startsWith(apiPrefix)) {
          report('PATH_CONSISTENCY', dir, `SKILL.md中URL路径与前缀不匹配: ${match[0]}`, 'WARN',
            `期望前缀: ${apiPrefix}, 实际路径: ${urlPath}`);
        }
      }
    }

    // 检查system.prompt.md中的URL示例
    const promptPath = path.join(skillDir, 'system.prompt.md');
    if (fs.existsSync(promptPath)) {
      const content = fs.readFileSync(promptPath, 'utf-8');
      const urlPattern = /aconfig\.cn(\/api\/v1\/[\w-]+)?/g;
      let match;
      while ((match = urlPattern.exec(content)) !== null) {
        const urlPath = match[1];
        if (urlPath && !urlPath.startsWith(apiPrefix)) {
          report('PATH_CONSISTENCY', dir, `system.prompt.md中URL路径与前缀不匹配: ${match[0]}`, 'WARN',
            `期望前缀: ${apiPrefix}, 实际路径: ${urlPath}`);
        }
      }
    }
  }
}

// ==================== 深度测试2: 链式调用API引用有效性 ====================

function testChainApiReferences() {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 深度测试2: 链式调用API引用有效性');
  console.log('='.repeat(60));

  const skillDirs = fs.readdirSync(SKILLS_DIR).filter(d =>
    d.startsWith('maxhub-') && fs.statSync(path.join(SKILLS_DIR, d)).isDirectory()
  );

  for (const dir of skillDirs) {
    clearRequireCache();
    const skillDir = path.join(SKILLS_DIR, dir);

    const registryPath = path.join(skillDir, 'api-registry.json');
    const chainPath = path.join(skillDir, 'chain-patterns.json');

    if (!fs.existsSync(registryPath) || !fs.existsSync(chainPath)) continue;

    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
    const chains = JSON.parse(fs.readFileSync(chainPath, 'utf-8'));

    const validApiPaths = new Set((registry.apis || []).map(a => a.path));

    const { SkillExecutor } = require(path.join(SHARED_DIR, 'skill-executor.js'));
    const executor = new SkillExecutor({ skillDir });

    for (const pattern of (chains.patterns || [])) {
      for (const step of (pattern.steps || [])) {
        const found = executor.findApi(step.api);
        if (!found && !validApiPaths.has(step.api)) {
          report('CHAIN_REFERENCE', dir, `链式调用引用无效API: ${step.api}`, 'ERROR',
            `模式"${pattern.name}"中引用的API "${step.api}" 无法通过精确或模糊匹配找到`);
        }
      }

      for (const step of (pattern.steps || [])) {
        if (step.paramMapping) {
          for (const [targetKey, sourcePath] of Object.entries(step.paramMapping)) {
            if (!sourcePath || sourcePath === '') {
              report('CHAIN_REFERENCE', dir, `paramMapping值为空: ${targetKey}`, 'WARN',
                `模式"${pattern.name}"中paramMapping.${targetKey}的值为空`);
            }
          }
        }
      }
    }
  }
}

// ==================== 深度测试3: 参数完整性验证 ====================

function testParamCompleteness() {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 深度测试3: 参数完整性验证');
  console.log('='.repeat(60));

  const skillDirs = fs.readdirSync(SKILLS_DIR).filter(d =>
    d.startsWith('maxhub-') && fs.statSync(path.join(SKILLS_DIR, d)).isDirectory()
  );

  for (const dir of skillDirs) {
    clearRequireCache();
    const skillDir = path.join(SKILLS_DIR, dir);

    const registryPath = path.join(skillDir, 'api-registry.json');
    if (!fs.existsSync(registryPath)) continue;

    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));

    for (const api of (registry.apis || [])) {
      // 检查参数格式
      if (api.params) {
        for (const p of api.params) {
          if (typeof p === 'string') {
            report('PARAM_FORMAT', dir, `API ${api.id} 参数为字符串格式`, 'WARN',
              `参数"${p}"应为对象格式 {name, required}`);
          } else if (typeof p === 'object') {
            if (!p.name) {
              report('PARAM_FORMAT', dir, `API ${api.id} 参数缺少name`, 'ERROR',
                `参数对象缺少name字段: ${JSON.stringify(p)}`);
            }
          }
        }
      }

      // 检查必填参数是否与API路径中的占位符一致
      const pathParams = (api.path.match(/:\w+/g) || []).map(p => p.slice(1));
      const declaredParams = (api.params || []).map(p => typeof p === 'string' ? p : p.name);

      for (const pp of pathParams) {
        if (!declaredParams.includes(pp)) {
          report('PARAM_COMPLETENESS', dir, `API ${api.id} 路径参数未声明: ${pp}`, 'WARN',
            `路径中包含参数 :${pp}，但params中未声明`);
        }
      }

      // 检查method字段
      if (!api.method || !['GET', 'POST', 'PUT', 'DELETE'].includes(api.method.toUpperCase())) {
        report('PARAM_FORMAT', dir, `API ${api.id} method无效: ${api.method}`, 'ERROR',
          'method应为 GET/POST/PUT/DELETE');
      }
    }
  }
}

// ==================== 深度测试4: SkillExecutor边界条件 ====================

async function testExecutorEdgeCases() {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 深度测试4: SkillExecutor边界条件');
  console.log('='.repeat(60));

  clearRequireCache();
  const { SkillExecutor } = require(path.join(SHARED_DIR, 'skill-executor.js'));

  const skillDirs = fs.readdirSync(SKILLS_DIR).filter(d =>
    d.startsWith('maxhub-') && fs.statSync(path.join(SKILLS_DIR, d)).isDirectory()
  );

  for (const dir of skillDirs) {
    clearRequireCache();
    const { SkillExecutor: SE } = require(path.join(SHARED_DIR, 'skill-executor.js'));
    const skillDir = path.join(SKILLS_DIR, dir);

    try {
      const executor = new SE({ skillDir });

      const emptyResult = await executor.call('');
      if (emptyResult.success === false) {
      } else {
        report('EDGE_CASE', dir, '空API路径调用', 'WARN', '空路径应返回失败');
      }

      const notFoundResult = await executor.call('nonexistent_api_path_xyz');
      if (notFoundResult.success === false && notFoundResult.error) {
      } else {
        report('EDGE_CASE', dir, '不存在API调用', 'ERROR', '不存在的API应返回失败和错误信息');
      }

      const emptyChain = await executor.chain([]);
      if (emptyChain.success === false) {
      } else {
        report('EDGE_CASE', dir, '空链式调用', 'WARN', '空步骤应返回失败');
      }

      const deepSteps = Array(6).fill({ api: 'test' });
      const deepChain = await executor.chain(deepSteps);
      if (deepChain.success === false && deepChain.error?.includes('超过限制')) {
      } else {
        report('EDGE_CASE', dir, '超深链式调用', 'WARN', '超过MAX_CHAIN_DEPTH应返回失败');
      }

      const emptyBatch = await executor.batch('test', []);
      if (emptyBatch.length === 0) {
      } else {
        report('EDGE_CASE', dir, '空批量调用', 'WARN', '空参数列表应返回空数组');
      }

      const overBatch = await executor.batch('test', Array(11).fill({}));
      if (overBatch.length === 1 && overBatch[0].success === false) {
      } else {
        report('EDGE_CASE', dir, '超限批量调用', 'WARN', '超过MAX_BATCH_SIZE应返回失败');
      }

      if (executor.listApis().length > 0) {
        const firstApi = executor.listApis()[0];
        const foundById = executor.findApi(firstApi.id);
        if (!foundById) {
          report('EDGE_CASE', dir, `findApi by id: ${firstApi.id}`, 'ERROR', '应能通过id查找API');
        }
        const foundByPath = executor.findApi(firstApi.path);
        if (!foundByPath) {
          report('EDGE_CASE', dir, `findApi by path: ${firstApi.path}`, 'ERROR', '应能通过path查找API');
        }
      }

      const emptySearch = executor.searchApis('');
      if (emptySearch.length === executor.listApis().length) {
      }

      const v1 = executor.validateAction('file_write', '');
      if (v1.valid) {
      }

      const v2 = executor.validateAction('code', '');
      if (v2.valid) {
      }

      const v3 = executor.validateAction('unknown_type', 'test.js');
      if (v3.valid) {
      }

    } catch (e) {
      report('EDGE_CASE', dir, 'SkillExecutor创建或测试', 'CRITICAL', e.message);
    }
  }
}

// ==================== 深度测试5: 性能基准 ====================

function testPerformance() {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 深度测试5: 性能基准');
  console.log('='.repeat(60));

  const skillDirs = fs.readdirSync(SKILLS_DIR).filter(d =>
    d.startsWith('maxhub-') && fs.statSync(path.join(SKILLS_DIR, d)).isDirectory()
  );

  // 测试模块加载时间
  for (const dir of skillDirs) {
    clearRequireCache();
    const skillDir = path.join(SKILLS_DIR, dir);

    const start = process.hrtime.bigint();
    try {
      require(path.join(skillDir, 'index.ts'));
    } catch (e) {
      // 忽略
    }
    const end = process.hrtime.bigint();
    const ms = Number(end - start) / 1e6;

    if (ms > 100) {
      report('PERFORMANCE', dir, `模块加载时间: ${ms.toFixed(1)}ms`, 'WARN',
        '加载时间超过100ms，可能存在性能问题');
    }
  }

  // 测试API搜索性能
  clearRequireCache();
  const { SkillExecutor } = require(path.join(SHARED_DIR, 'skill-executor.js'));

  for (const dir of skillDirs) {
    clearRequireCache();
    const { SkillExecutor: SE } = require(path.join(SHARED_DIR, 'skill-executor.js'));
    const skillDir = path.join(SKILLS_DIR, dir);

    try {
      const executor = new SE({ skillDir });
      const apis = executor.listApis();
      if (apis.length === 0) continue;

      // 搜索100次取平均
      const start = process.hrtime.bigint();
      for (let i = 0; i < 100; i++) {
        executor.searchApis('search');
      }
      const end = process.hrtime.bigint();
      const avgMs = Number(end - start) / 1e6 / 100;

      if (avgMs > 1) {
        report('PERFORMANCE', dir, `API搜索平均耗时: ${avgMs.toFixed(3)}ms`, 'WARN',
          '单次搜索超过1ms，大数据量时可能影响响应速度');
      }
    } catch (e) {
      // 忽略
    }
  }

  // 测试api-registry.json文件大小
  for (const dir of skillDirs) {
    const registryPath = path.join(SKILLS_DIR, dir, 'api-registry.json');
    if (fs.existsSync(registryPath)) {
      const size = fs.statSync(registryPath).size;
      const sizeKB = size / 1024;
      if (sizeKB > 100) {
        report('PERFORMANCE', dir, `api-registry.json大小: ${sizeKB.toFixed(1)}KB`, 'WARN',
          '文件过大可能影响加载性能');
      }
    }
  }
}

// ==================== 深度测试6: 协议验证覆盖率 ====================

function testProtocolCoverage() {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 深度测试6: 协议验证覆盖率');
  console.log('='.repeat(60));

  const scriptTestCases = [
    { content: 'const fs = require("fs")', expected: true, desc: 'require("fs")' },
    { content: "const path = require('path')", expected: true, desc: "require('path')" },
    { content: 'import React from "react"', expected: true, desc: 'import from' },
    { content: 'import { useState } from "react"', expected: true, desc: 'import { } from' },
    { content: 'module.exports = { handler }', expected: true, desc: 'module.exports' },
    { content: 'exports.handler = function() {}', expected: true, desc: 'exports.xxx' },
    { content: 'const { exec } = require("child_process")', expected: true, desc: 'require child_process' },
    { content: 'fetch("https://api.example.com/data")', expected: false, desc: 'fetch调用' },
    { content: 'GET /api/v1/bilibili/web/fetch_general_search', expected: false, desc: 'API路径描述' },
    { content: '搜索B站上关于编程的视频', expected: false, desc: '中文自然语言' },
    { content: 'curl https://www.aconfig.cn/api/v1/bilibili/web/fetch_general_search', expected: false, desc: 'curl命令' },
    { content: 'WebFetch("https://www.aconfig.cn/...")', expected: false, desc: 'WebFetch调用' },
  ];

  clearRequireCache();
  const { detectScriptGeneration } = require(path.join(SHARED_DIR, 'skill-executor.js'));

  for (const tc of scriptTestCases) {
    const result = detectScriptGeneration(tc.content);
    if (result.isScript !== tc.expected) {
      report('PROTOCOL_COVERAGE', '_shared', tc.desc, 'ERROR',
        `期望 isScript=${tc.expected}, 实际=${result.isScript}, 内容: "${tc.content}"`);
    }
  }

  // 测试命令拦截覆盖率
  const commandTestCases = [
    { cmd: 'node script.js', expected: false, desc: 'node命令' },
    { cmd: 'python3 app.py', expected: false, desc: 'python3命令' },
    { cmd: 'bash run.sh', expected: false, desc: 'bash命令' },
    { cmd: 'sh deploy.sh', expected: false, desc: 'sh命令' },
    { cmd: 'deno run main.ts', expected: false, desc: 'deno命令' },
    { cmd: 'bun run index.ts', expected: false, desc: 'bun命令' },
    { cmd: 'curl https://api.example.com', expected: true, desc: 'curl命令' },
    { cmd: 'wget https://example.com/data.json', expected: true, desc: 'wget命令' },
    { cmd: 'echo "hello"', expected: true, desc: 'echo命令' },
    { cmd: 'ls -la', expected: true, desc: 'ls命令' },
  ];

  clearRequireCache();
  const { SkillExecutor } = require(path.join(SHARED_DIR, 'skill-executor.js'));
  const executor = new SkillExecutor({ skillDir: path.join(SKILLS_DIR, 'maxhub-bilibili') });

  for (const tc of commandTestCases) {
    const result = executor.validateAction('command', tc.cmd);
    if (result.valid !== tc.expected) {
      report('PROTOCOL_COVERAGE', '_shared', tc.desc, 'ERROR',
        `期望 valid=${tc.expected}, 实际=${result.valid}, 命令: "${tc.cmd}"`);
    }
  }
}

// ==================== 深度测试7: 旧文件残留检查 ====================

function testLegacyFiles() {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 深度测试7: 旧文件残留检查');
  console.log('='.repeat(60));

  const skillDirs = fs.readdirSync(SKILLS_DIR).filter(d =>
    d.startsWith('maxhub-') && fs.statSync(path.join(SKILLS_DIR, d)).isDirectory()
  );

  const legacyDirs = ['core', 'service', 'template', 'references'];
  const legacyFiles = ['shared/cache.js', 'shared/decision.js', 'shared/index.js', 'shared/monitor.js', 'shared/optimizer.js', 'shared/pricing-service.js'];

  for (const dir of skillDirs) {
    const skillDir = path.join(SKILLS_DIR, dir);

    for (const legacyDir of legacyDirs) {
      const fullPath = path.join(skillDir, legacyDir);
      if (fs.existsSync(fullPath)) {
        report('LEGACY_FILES', dir, `残留目录: ${legacyDir}/`, 'WARN',
          '旧架构目录已不再使用，建议清理以减少混淆');
      }
    }

    for (const legacyFile of legacyFiles) {
      const fullPath = path.join(skillDir, legacyFile);
      if (fs.existsSync(fullPath)) {
        report('LEGACY_FILES', dir, `残留文件: ${legacyFile}`, 'WARN',
          '旧架构文件已不再使用，建议清理');
      }
    }
  }
}

// ==================== 主执行函数 ====================

async function main() {
  console.log('🧪 Skill 系统深度测试');
  console.log(`时间: ${new Date().toISOString()}`);

  testApiPathConsistency();
  testChainApiReferences();
  testParamCompleteness();
  await testExecutorEdgeCases();
  testPerformance();
  testProtocolCoverage();
  testLegacyFiles();

  // 汇总
  console.log('\n' + '='.repeat(60));
  console.log('📊 深度测试结果汇总');
  console.log('='.repeat(60));

  const bySeverity = { CRITICAL: 0, ERROR: 0, WARN: 0, INFO: 0 };
  const byCategory = {};

  for (const issue of issues) {
    bySeverity[issue.severity]++;
    if (!byCategory[issue.category]) byCategory[issue.category] = [];
    byCategory[issue.category].push(issue);
  }

  console.log(`\n问题总数: ${issues.length}`);
  console.log(`🔴 CRITICAL: ${bySeverity.CRITICAL}`);
  console.log(`❌ ERROR: ${bySeverity.ERROR}`);
  console.log(`⚠️  WARN: ${bySeverity.WARN}`);
  console.log(`ℹ️  INFO: ${bySeverity.INFO}`);

  if (Object.keys(byCategory).length > 0) {
    console.log('\n按分类统计:');
    for (const [cat, catIssues] of Object.entries(byCategory)) {
      console.log(`\n【${cat}】(${catIssues.length}个)`);
      for (const issue of catIssues.slice(0, 8)) {
        console.log(`  ${issue.severity === 'CRITICAL' ? '🔴' : issue.severity === 'ERROR' ? '❌' : '⚠️'} ${issue.skill} | ${issue.test} | ${issue.detail}`);
      }
      if (catIssues.length > 8) {
        console.log(`  ... 还有 ${catIssues.length - 8} 个`);
      }
    }
  }

  // 保存报告
  const reportPath = path.join(SKILLS_DIR, 'deep-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({ issues, bySeverity, byCategory }, null, 2), 'utf-8');
  console.log(`\n📄 详细报告已保存: ${reportPath}`);

  process.exit(bySeverity.CRITICAL > 0 || bySeverity.ERROR > 0 ? 1 : 0);
}

main().catch(e => {
  console.error('测试执行失败:', e);
  process.exit(1);
});
