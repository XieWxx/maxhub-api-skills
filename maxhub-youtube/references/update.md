# SKILL 更新机制 / Update Mechanism

Skill: `maxhub-youtube` · Current version: `3.7.2` · Owner: `maxhub-skills`

> 本文件定义本 SKILL 的版本检查与更新流程。**Agent 在判断到 SKILL 可能过时**（如频繁 404、字段语义不符、用户主动询问"有没有新版"）时，应引导用户走更新流程。

---

## 1. 何时应触发更新检查

按优先级，**任意一项**满足即触发更新检查：

1. **被动触发（最高优先级）**
   - 调用合法路径（已通过 §3.1(A) 自检确认在 `endpoints_whitelist.yaml` 中）但仍返回 **404 / 410**
   - 多个端点连续返回 410（路由批量下线）
   - 上游响应字段结构与 reference OUT 表明显不一致（如 `$.data.video_id` 改名）

2. **主动触发**
   - 用户问"这个 skill 有没有更新"、"版本是多少"、"是不是最新版"
   - 距离上次成功调用已超过 30 天
   - 用户安装后首次使用

3. **周期性触发**（建议）
   - **每天首次使用**前做一次轻量版本检查

---

## 2. 版本号语义（SemVer）

Skill version 采用 **MAJOR.MINOR.PATCH** 三段式：

| 段位 | 含义 | 升级时 Agent 行为 |
|------|------|----------------|
| **MAJOR**（主版本） | 路径下线 / breaking change | **必须**提示用户更新；旧版多端点可能已 410 |
| **MINOR**（次版本） | 新增端点 / 新增可选参数 | 建议更新；旧版仍可用但缺新功能 |
| **PATCH**（补丁版本） | 文档完善 / 错误修正 / 默认值优化 | 可选更新；不影响现有功能 |

**当前版本来源**：读取 [`../_meta.json`](../_meta.json) 中的 `version` 字段。

---

## 3. 通过 ClawHub / SkillHub 更新

本 skill 同时发布于两个 registry。Agent 在检测到需要更新时，**优先**指引用户使用本地已安装的 CLI；若两者都不可用，再降级到手动 git 拉取。

### 3.1 ClawHub（推荐 国际版主源）

**适用环境**：用户已安装 ClawHub CLI（`clawhub` 命令）。

```bash
# 检查本地版本
clawhub list | grep maxhub-youtube

# 检查远端最新版本
clawhub info maxhub-youtube

# 升级到最新版（保留本地配置）
clawhub upgrade maxhub-youtube

# 强制重装最新版（清空本地修改）
clawhub install --force maxhub-youtube
```

**安装位置**：`~/.openclaw/skills/maxhub-youtube/` 或 `~/.clawhub/skills/maxhub-youtube/`

### 3.2 SkillHub（推荐 国内加速镜像）

**适用环境**：中国大陆用户、ClawHub 下载慢、需要安全审计版本。

```bash
# 检查本地版本
skillhub list | grep maxhub-youtube

# 检查远端最新版本（含 release_note）
skillhub info maxhub-youtube

# 升级到最新版
skillhub upgrade maxhub-youtube

# 强制重装最新版
skillhub install --force maxhub-youtube
```

**Web 入口**：https://skillhub.cn/skills/maxhub-youtube （查看版本号与更新日志）

**特性**：
- 通过腾讯云 CDN 加速下载
- 经过科恩实验室 + 云鼎实验室双安全审计
- 与 ClawHub 完全兼容（同一份 SKILL.md）

### 3.3 直接从 GitHub 更新（降级方案）

当用户**未安装** ClawHub / SkillHub CLI 时使用：

```bash
# 进入 skill 安装目录
cd ~/.openclaw/skills/maxhub-youtube   # 或 ~/.claude/skills/maxhub-youtube

# 拉取最新版本
git pull origin main

# 或重新克隆
cd ~/.openclaw/skills && rm -rf maxhub-youtube \
  && git clone https://github.com/XieWxx/maxhub-api-skills.git maxhub-youtube
```

仓库地址：https://github.com/XieWxx/maxhub-api-skills

---

## 4. Agent 推荐对话话术

当 Agent 判定需要更新时，建议使用以下话术（根据用户环境选择）：

### 场景 A：合法路径返回 404（疑似 SKILL 过时）

> "刚才调用的路径 `<path>` 在本 SKILL 的白名单中合法，但上游返回 404。这通常表示该端点已下线，或本地 SKILL 版本（v3.7.2）落后于上游。
>
> 建议执行更新：
> - 国内推荐：`skillhub upgrade maxhub-youtube`
> - 国际：`clawhub upgrade maxhub-youtube`
> - 或访问 https://skillhub.cn/skills/maxhub-youtube 查看最新版本"

### 场景 B：用户主动询问版本

> "本 SKILL 当前版本：**v3.7.2**。
>
> 检查最新版本：
> - 在 https://skillhub.cn/skills/maxhub-youtube 查看
> - 或运行 `skillhub info maxhub-youtube` / `clawhub info maxhub-youtube`"

### 场景 C：批量端点 410（重大更新提示）

> "本次会话中已多个端点（`<list>`）返回 410，疑似上游接口大版本更新。**必须升级 SKILL** 才能继续使用。
>
> 升级命令：`skillhub upgrade maxhub-youtube --force`"

---

## 5. 更新前后的安全检查（重要）

更新 SKILL 前后，Agent 应提示用户做以下检查：

### 更新前
- 备份本地任何对 references/ 的自定义修改（如有）
- 记录当前版本号 `3.7.2`

### 更新后
- 重新读取 [`../_meta.json`](../_meta.json) 确认新版本号
- 重新读取 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml)（新版可能新增/移除端点）
- 重新读取本 skill 各 reference 文件
- 检查是否有 breaking change（参考 release_note）
- 旧端点如果已下线，提示用户切换到 release_note 中给出的替代端点

---

## 6. 不可恢复的版本错配

以下情况无法通过更新解决，必须人工干预：

- **HTTP 401 / 403**：API Key 失效或权限不足，**不是 SKILL 版本问题**，去 https://www.aconfig.cn/console 处理
- **HTTP 402**：余额不足，**不是 SKILL 版本问题**，去 https://www.aconfig.cn/billing 处理
- **网络 / DNS 问题**：与 SKILL 版本无关
- **用户对自有数据的请求**（如查询一个不存在的 video_id / channel_id）：与 SKILL 版本无关

> Agent **不应**因为 401/402/403/网络错就建议用户更新 SKILL——这会误导用户。**仅 404/410 + 自检通过**时才推荐更新。

---

## 7. 与防臆造红线的关系

更新机制是 **§ 3.1 防臆造自检的最后一环**：

```
404 → §3.1(A) 自检
       ├─ 自检失败：路径臆造，STOP（不要更新）
       └─ 自检通过：路径合法但上游 404
                     ├─ 单次 404：上游资源真的不存在，告知用户
                     └─ 持续 404 / 多端点 410：建议执行 §3 更新流程
```

**重要**：自检失败时**禁止**建议用户更新——这会让用户误以为是 SKILL 问题，掩盖了 Agent 自身的臆造行为。
