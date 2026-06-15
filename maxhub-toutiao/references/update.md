# SKILL 更新机制 / Update Mechanism

Skill: `maxhub-toutiao` · Current version: `3.7.2` · Owner: `maxhub-skills`

> 本文件定义本 SKILL 的版本检查与更新流程。

---

## 1. 何时应触发更新检查

1. **被动触发**：合法路径持续 404 / 410；多端点连续 410；响应字段结构与 reference 不一致
2. **主动触发**：用户问版本/更新；距上次成功调用超 30 天
3. **周期性触发**：每天首次使用前做一次轻量版本检查

---

## 2. 版本号语义（SemVer）

| 段位 | 含义 | 升级时 Agent 行为 |
|------|------|----------------|
| MAJOR | 路径下线 / breaking change | **必须**提示用户更新 |
| MINOR | 新增端点 / 新增可选参数 | 建议更新 |
| PATCH | 文档完善 / 错误修正 | 可选更新 |

**当前版本来源**：读取 [`../_meta.json`](../_meta.json) 中的 `version` 字段。

---

## 3. 通过 ClawHub / SkillHub 更新

### 3.1 ClawHub（国际版主源）
```bash
clawhub upgrade maxhub-toutiao
```

### 3.2 SkillHub（国内加速镜像）
```bash
skillhub upgrade maxhub-toutiao
```
Web 入口：https://skillhub.cn/skills/maxhub-toutiao

### 3.3 GitHub（降级方案）
```bash
cd ~/.openclaw/skills/maxhub-toutiao && git pull origin main
```
仓库地址：https://github.com/XieWxx/maxhub-api-skills

---

## 4. Agent 推荐对话话术

### 场景 A：合法路径返回 404
> "路径 `<path>` 在白名单中合法，但上游返回 404。建议更新：`skillhub upgrade maxhub-toutiao`"

### 场景 B：用户询问版本
> "本 SKILL 当前版本：**v3.7.2**。检查最新版本：`skillhub info maxhub-toutiao`"

---

## 5. 更新前后安全检查

### 更新前
- 备份本地对 references/ 的自定义修改
- 记录当前版本号 `3.7.2`

### 更新后
- 重新读取 [`../_meta.json`](../_meta.json) 确认新版本号
- 重新读取 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml)
- 重新读取各 reference 文件

---

## 6. 不可恢复的版本错配

- HTTP 401/403 → API Key 问题，去 https://www.aconfig.cn/console
- HTTP 402 → 余额不足，去 https://www.aconfig.cn/billing
- 网络/DNS → 与版本无关

> ⚠️ 仅 404/410 + 自检通过时才推荐更新。

---

## 7. 与防臆造红线的关系

```
404 → §3.1(A) 自检
       ├─ 自检失败：路径臆造，STOP
       └─ 自检通过：路径合法但上游 404
                     ├─ 单次 404：资源不存在，告知用户
                     └─ 持续 404 / 多端点 410：建议更新
```
