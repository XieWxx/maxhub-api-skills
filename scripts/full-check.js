const fs = require('fs');
const path = require('path');

const dirs = fs.readdirSync('.').filter(d => d.startsWith('maxhub-') && fs.statSync(d).isDirectory());
const issues = {};

for (const dir of dirs) {
  const name = path.basename(dir);
  issues[name] = [];

  // === 1. 检查 router.js: 未定义变量 bug ===
  const routerPath = path.join(dir, 'core/router.js');
  if (fs.existsSync(routerPath)) {
    const routerCode = fs.readFileSync(routerPath, 'utf8');

    // 检查解构参数中是否有 else if 使用了未解构的变量
    const routeHandlers = routerCode.match(/async\s+\w+\s*\(\{[^}]*\}\)/g) || [];
    for (const handler of routeHandlers) {
      const destructured = handler.match(/\{([^}]*)\}/)[1];
      const params = destructured.split(',').map(p => p.trim().split('=')[0].split(/\s+/).pop()).filter(p => p && !p.match(/^\d/));

      // 找到这个handler的完整代码块
      const handlerName = handler.match(/async\s+(\w+)/)[1];
      const handlerStart = routerCode.indexOf(handler);
      const handlerBodyStart = routerCode.indexOf('{', routerCode.indexOf(')', handlerStart)) + 1;
      let braceCount = 1;
      let handlerBodyEnd = handlerBodyStart;
      while (braceCount > 0 && handlerBodyEnd < routerCode.length) {
        if (routerCode[handlerBodyEnd] === '{') braceCount++;
        if (routerCode[handlerBodyEnd] === '}') braceCount--;
        handlerBodyEnd++;
      }
      const handlerBody = routerCode.substring(handlerBodyStart, handlerBodyEnd);

      // 检查 else if 中引用的变量是否在解构参数中
      const elseIfVars = handlerBody.match(/else\s+if\s*\((\w+)/g) || [];
      for (const eif of elseIfVars) {
        const varName = eif.replace(/else\s+if\s*\(/, '');
        if (!params.includes(varName)) {
          issues[name].push(`router.js: ${handlerName}() 引用了未解构的变量 "${varName}"`);
        }
      }
    }
  }

  // === 2. 检查 api.js: 请求超时 ===
  const apiPath = path.join(dir, 'service/api.js');
  if (fs.existsSync(apiPath)) {
    const apiCode = fs.readFileSync(apiPath, 'utf8');
    if (!apiCode.includes('AbortController')) {
      issues[name].push('api.js: 缺少请求超时(AbortController)');
    }
    if (!apiCode.includes('REQUEST_TIMEOUT')) {
      issues[name].push('api.js: 缺少超时常量');
    }
    if (apiCode.includes('Object.assign(reqParams, params)')) {
      issues[name].push('api.js: callApi参数过滤被Object.assign覆盖');
    }
    if (/const PLATFORM = /.test(apiCode)) {
      issues[name].push('api.js: 未使用的PLATFORM常量');
    }
    // 检查 handleResponse 中是否处理了 AbortError/超时
    if (!apiCode.includes('AbortError') && !apiCode.includes('abort')) {
      issues[name].push('api.js: handleResponse未处理超时错误');
    }
  }

  // === 3. 检查 index.ts: API密钥检查逻辑 ===
  const indexPath = path.join(dir, 'index.ts');
  if (fs.existsSync(indexPath)) {
    const indexCode = fs.readFileSync(indexPath, 'utf8');
    if (indexCode.includes('!config.requires?.primaryEnv') && !indexCode.includes('process.env')) {
      issues[name].push('index.ts: 检查配置键而非实际环境变量');
    }
  }

  // === 4. 检查 package.json: 未使用依赖 ===
  const pkgPath = path.join(dir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (pkg.dependencies && pkg.dependencies['node-fetch']) {
      issues[name].push('package.json: 未使用的node-fetch依赖');
    }
  }

  // === 5. 检查 manifest.json: 不存在的openapi.yaml引用 ===
  const manifestPath = path.join(dir, 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (manifest.platforms) {
      for (const [platform, config] of Object.entries(manifest.platforms)) {
        if (config.entry === 'openapi.yaml' && !fs.existsSync(path.join(dir, 'openapi.yaml'))) {
          issues[name].push(`manifest.json: ${platform}引用不存在的openapi.yaml`);
        }
      }
    }
  }

  // === 6. 检查版本号一致性 ===
  const skillMdPath = path.join(dir, 'SKILL.md');
  const configPath = path.join(dir, 'config.json');
  if (fs.existsSync(skillMdPath) && fs.existsSync(pkgPath) && fs.existsSync(configPath)) {
    const skillMd = fs.readFileSync(skillMdPath, 'utf8');
    const skillVer = (skillMd.match(/^version:\s*(.+)$/m) || [])[1]?.trim();
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const versions = [skillVer, pkg.version, config.version].filter(Boolean);
    if (new Set(versions).size > 1) {
      issues[name].push(`版本不一致: SKILL.md=${skillVer}, package.json=${pkg.version}, config.json=${config.version}`);
    }
  }

  // === 7. 检查 router.js 参数名与 API_REGISTRY 是否匹配 ===
  if (fs.existsSync(routerPath) && fs.existsSync(apiPath)) {
    const routerCode = fs.readFileSync(routerPath, 'utf8');
    const apiCode = fs.readFileSync(apiPath, 'utf8');

    // 提取 API_REGISTRY 中的参数定义
    const registryMatches = apiCode.matchAll(/(\w+):\s*\{\s*path:\s*'[^']+',\s*params:\s*\[([^\]]*)\]/g);
    const registryParams = {};
    for (const m of registryMatches) {
      const apiName = m[1];
      const params = m[2].split(',').map(p => p.trim().replace(/'/g, '')).filter(Boolean);
      registryParams[apiName] = params;
    }

    // 检查 router 中调用 api.xxx({ key: value }) 时，key 是否与 registry 定义匹配
    const apiCalls = routerCode.matchAll(/api\.(\w+)\(\s*\{([^}]*)\}\s*\)/g);
    for (const call of apiCalls) {
      const apiName = call[1];
      const callParamsStr = call[2];
      if (registryParams[apiName]) {
        const expectedParams = registryParams[apiName];
        const callParams = callParamsStr.split(',').map(p => {
          const kv = p.trim().split(':');
          return kv[0].trim();
        }).filter(Boolean);

        for (const cp of callParams) {
          if (!expectedParams.includes(cp) && cp !== '') {
            issues[name].push(`router.js: api.${apiName}() 传入了未注册的参数 "${cp}"，注册表期望: [${expectedParams.join(', ')}]`);
          }
        }
      }
    }
  }

  // === 8. 检查 .gitignore 是否包含 .env ===
  const gitignorePath = path.join(dir, '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignore = fs.readFileSync(gitignorePath, 'utf8');
    if (!gitignore.includes('.env')) {
      issues[name].push('.gitignore: 缺少.env保护');
    }
  }
}

// 输出结果
const hasIssues = Object.entries(issues).filter(([_, v]) => v.length > 0);
const noIssues = Object.entries(issues).filter(([_, v]) => v.length === 0);

console.log('\n=== 无问题的 Skill ===');
for (const [name] of noIssues) {
  console.log('  ✓ ' + name);
}

console.log('\n=== 有问题的 Skill ===');
for (const [name, issueList] of hasIssues) {
  console.log('\n  ✗ ' + name);
  for (const issue of issueList) {
    console.log('    - ' + issue);
  }
}

console.log('\n=== 统计 ===');
console.log('  无问题: ' + noIssues.length + ' / ' + dirs.length);
console.log('  有问题: ' + hasIssues.length + ' / ' + dirs.length);

// 输出有问题skill的名称列表（供脚本使用）
if (hasIssues.length > 0) {
  console.log('\n=== 有问题的Skill列表 ===');
  console.log(hasIssues.map(([name]) => name).join(','));
}
