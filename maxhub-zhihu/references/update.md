# SKILL 更新机制 / Update Mechanism

Skill: `maxhub-zhihu` · Current version: `3.7.2` · Owner: `maxhub-skills`

> 本文件定义本 SKILL 的版本检查与更新流程。**Agent 在判断到 SKILL 可能过时**（如频繁 404、字段语义不符、用户主动询问"有没有新版"）时，应引导用户走更新流程。

---

## 1. 何时应触发更新检查

按优先级，**任意一项**满足即触发更新检查：

1. **被动触发（最高优先级）**
   - 调用合法路径（已通过 §3.1(A) 自检确认在 `endpoints_whitelist.yaml` 中）但仍返回 **404 / 410**
   - 多个端点连续返回 410（路由批量下线）
   - 上游响应字段结构与 reference OUT 表明显不一致

2. **主动触发**
   - 用户问"这个 skill 有没有更新"、"版本是多少"
   - 距离上次成功调用已超过 30 天
   - 用户安装后首次使用

3. **周期性触发**（建议）
   - **每天首次使用**前做一次轻量版本检查

---

## 2. 版本号语义（SemVer）

Skill version 采用 **MAJOR.MINOR.PATCH** 三段式：

| 段位 | 含义 | 升级时 Agent 行为 |
|------|------|----------------|
| **MAJOR** | 路径下线 / breaking change | **必须**提示用户更新 |
| **MINOR** | 新增端点 / 新增可选参数 | 建议更新；旧版仍可用但缺新功能 |
| **PATCH** | 文档完善 / 错误修正 | 可选更新 |

**当前版本来源**：读取 [`../_meta.json`](../_meta.json) 中的 `version` 字段。

---

## 3. 通过 ClawHub / SkillHub 更新

### 3.1 ClawHub（推荐 ⭐⭐⭐ 国际版主源）

```bash
clawhub list | grep maxhub-zhihu
clawhub info maxhub-zhihu
clawhub upgrade maxhub-zhihu
clawhub install --force maxhub-zhihu
```

### 3.2 SkillHub（推荐 ⭐⭐⭐ 国内加速镜像）

```bash
skillhub list | grep maxhub-zhihu
skillhub info maxhub-zhihu
skillhub upgrade maxhub-zhihu
skillhub install --force maxhub-zhihu
```

**Web 入口**：https://skillhub.cn/skills/maxhub-zhihu

### 3.3 直接从 GitHub 更新（降级方案）

```bash
cd ~/.openclaw/skills/maxhub-zhihu
git pull origin main
```

仓库地址：https://github.com/XieWxx/maxhub-api-skills

---

## 4. Agent 推荐对话话术

### 场景 A：合法路径返回 404

> "刚才调用的路径 `<path>` 在本 SKILL 的白名单中合法，但上游返回 404。这通常表示该端点已下线，或本地 SKILL 版本（v3.7.2）落后于上游。
>
> 建议执行更新：
> - 国内推荐：`skillhub upgrade maxhub-zhihu`
> - 国际：`clawhub upgrade maxhub-zhihu`"

### 场景 B：用户主动询问版本

> "本 SKILL 当前版本：**v3.7.2**。
>
> 检查最新版本：
> - 在 https://skillhub.cn/skills/maxhub-zhihu 查看
> - 或运行 `skillhub info maxhub-zhihu` / `clawhub info maxhub-zhihu`"

### 场景 C：批量端点 410

> "本次会话中已多个端点返回 410，疑似上游接口大版本更新。**必须升级 SKILL**。
>
> 升级命令：`skillhub upgrade maxhub-zhihu --force`"

---

## 5. 更新前后的安全检查

### 更新前
- 备份本地对 references/ 的自定义修改（如有）
- 记录当前版本号 `3.7.2`

### 更新后
- 重新读取 [`../_meta.json`](../_meta.json) 确认新版本号
- 重新读取 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml)
- 重新读取本 skill 各 reference 文件
- 检查是否有 breaking change

---

## 6. 不可恢复的版本错配

- **HTTP 401 / 403**：API Key 失效或权限不足 → https://www.aconfig.cn
- **HTTP 402**：余额不足 → https://www.aconfig.cn
- **网络 / DNS 问题**：与 SKILL 版本无关

> ⚠️ Agent **不应**因为 401/402/403/网络错就建议用户更新 SKILL。**仅 404/410 + 自检通过**时才推荐更新。

---

## 7. 与防臆造红线的关系

```
404 → §3.1(A) 自检
       ├─ 自检失败：路径臆造，STOP（不要更新）
       └─ 自检通过：路径合法但上游 404
                     ├─ 单次 404：上游资源真的不存在，告知用户
                     └─ 持续 404 / 多端点 410：建议执行 §3 更新流程
```
