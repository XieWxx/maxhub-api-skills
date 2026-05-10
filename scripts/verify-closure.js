#!/usr/bin/env node

// 验证每个skill的闭环完整性
// 检查router.js中调用的api方法是否都在api.js中存在

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..');

function main() {
  const skillDirs = fs.readdirSync(SKILLS_DIR).filter(d =>
    d.startsWith('maxhub-') && fs.statSync(path.join(SKILLS_DIR, d)).isDirectory()
  );

  let totalIssues = 0;

  for (const skillDir of skillDirs) {
    const apiPath = path.join(SKILLS_DIR, skillDir, 'service', 'api.js');
    const routerPath = path.join(SKILLS_DIR, skillDir, 'core', 'router.js');

    if (!fs.existsSync(apiPath) || !fs.existsSync(routerPath)) continue;

    const apiContent = fs.readFileSync(apiPath, 'utf-8');
    const routerContent = fs.readFileSync(routerPath, 'utf-8');

    // 提取API_REGISTRY中的方法名
    const registryMatch = apiContent.match(/const API_REGISTRY = \{([\s\S]*?)\};/);
    const apiMethods = new Set();
    if (registryMatch) {
      const methodRegex = /(\w+):\s*\{/g;
      let match;
      while ((match = methodRegex.exec(registryMatch[1])) !== null) {
        apiMethods.add(match[1]);
      }
    }

    // 提取module.exports中的方法名
    const exportMatch = apiContent.match(/module\.exports\s*=\s*\{([\s\S]*?)\};/);
    if (exportMatch) {
      const methodRegex = /(\w+)\s*:/g;
      let match;
      while ((match = methodRegex.exec(exportMatch[1])) !== null) {
        apiMethods.add(match[1]);
      }
    }

    // 提取router.js中调用的api方法
    const callRegex = /api\.(\w+)\(/g;
    const calledMethods = new Set();
    let match;
    while ((match = callRegex.exec(routerContent)) !== null) {
      calledMethods.add(match[1]);
    }

    // 检查缺失
    const missing = [...calledMethods].filter(m => !apiMethods.has(m));
    if (missing.length > 0) {
      console.log(`❌ ${skillDir}: 缺失API方法: ${missing.join(', ')}`);
      totalIssues += missing.length;
    } else {
      console.log(`✅ ${skillDir}: 闭环完整 (${calledMethods.size}个API调用全部存在)`);
    }
  }

  console.log(`\n${totalIssues === 0 ? '🎉 所有skill闭环完整！' : `⚠️ 共 ${totalIssues} 处闭环问题需要修复`}`);
}

main();
