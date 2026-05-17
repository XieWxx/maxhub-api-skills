#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..');
const LEGACY_DIRS = ['core', 'service', 'template', 'references'];
const LEGACY_FILES = ['shared/cache.js', 'shared/decision.js', 'shared/index.js', 'shared/monitor.js', 'shared/optimizer.js', 'shared/pricing-service.js'];

const skillDirs = fs.readdirSync(SKILLS_DIR).filter(d =>
  d.startsWith('maxhub-') && fs.statSync(path.join(SKILLS_DIR, d)).isDirectory()
);

let removed = 0;

for (const dir of skillDirs) {
  const skillDir = path.join(SKILLS_DIR, dir);

  for (const legacyDir of LEGACY_DIRS) {
    const fullPath = path.join(skillDir, legacyDir);
    if (fs.existsSync(fullPath)) {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`  🗑️  ${dir}/${legacyDir}/`);
      removed++;
    }
  }

  for (const legacyFile of LEGACY_FILES) {
    const fullPath = path.join(skillDir, legacyFile);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`  🗑️  ${dir}/${legacyFile}`);
      removed++;
    }
  }

  const sharedDir = path.join(skillDir, 'shared');
  if (fs.existsSync(sharedDir)) {
    const remaining = fs.readdirSync(sharedDir);
    if (remaining.length === 0) {
      fs.rmdirSync(sharedDir);
      console.log(`  🗑️  ${dir}/shared/ (空目录)`);
    }
  }
}

console.log(`\n✅ 清理完成，共删除 ${removed} 个旧架构文件/目录`);
