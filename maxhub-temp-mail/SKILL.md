---
name: maxhub-temp-mail
description: >-
  Temp Mail data assistant via MaxHub API — generate temporary emails,
  list inbox messages, and read email details.
  Use when user asks about temp mail, 临时邮箱, disposable email, or email verification.
  Do NOT use for sensitive or private communications.
license: MIT-0
metadata:
  author: maxhub
  version: "3.7.2"
  openclaw:
    emoji: "📧"
    primaryEnv: MAXHUB_API_KEY
    requires:
      env:
        - MAXHUB_API_KEY
      bins:
        - curl
    env:
      - name: MAXHUB_API_KEY
        description: "API key for MaxHub data APIs. Get one at https://www.aconfig.cn"
        required: true
        sensitive: true
    network:
      - https://www.aconfig.cn
  hermes:
    tags: ["临时邮箱", "temp-mail", "邮件", "隐私", "一次性邮箱", "邮件接收", "测试", "数据采集"]
    category: productivity
---

# 临时邮箱助手

## 1. 简介

临时邮箱（一次性邮箱）助手，通过 MaxHub API 提供生成临时邮件地址、查询收件箱与读取邮件详情三件套能力。专注服务于自动化测试、网站注册验证码接收、隐私保护与匿名注册场景，帮助用户在不暴露真实邮箱的前提下完成验证流程。**注意**：本工具会生成新的临时邮箱地址，并非纯只读，且邮件经第三方服务中转，请勿用于接收敏感或私人邮件。

## 2. 功能特性

- 📧 **临时邮箱即开即用** — `get_temp_email_address` 一键生成新邮箱地址 + token

- 📥 **收件箱实时查询** — `get_emails_inbox`（token）拉取当前邮箱的全部收件列表

- 📨 **邮件详情读取** — `get_email_by_id`（token + message_id）读取单封邮件正文与附件元数据

- 🔐 **Token 权限隔离** — 每次创建的邮箱独立 token，不可跨邮箱访问，防止数据泄露

- ⚠️ **写入接口隔离** — `get_temp_email_address` 标记为创建型操作，调用前**强制用户确认场景**

- 🛡️ **防臆造硬白名单** — `endpoints_whitelist.yaml` 路径硬校验，404/400 强制自检清单，杜绝 Agent 臆造 API 地址或参数

- 🔗 **链式调用图谱** — 3 个端点的字段流字典 + Chain Recipes，明确 token / message_id 在端点间的传递路径

- 📊 **错误处理契约** — HTTP 状态码权威定义 + 重试策略矩阵 + token 失效处理规则

- 🔄 **SKILL 自更新机制** — 内置 SkillHub / ClawHub / GitHub 三通道版本检查，仅在合法路径持续 404/410 时建议更新

## 3. 一键安装

### 鉴权

#### 获取 API Key

请前往 [MaxHub 控制台](https://www.aconfig.cn) 注册账号并获取 API Key。

#### 配置 API Key

**方案 1：OpenClaw 配置**

将 `MAXHUB_API_KEY` 添加到 `~/.openclaw/openclaw.json` 中：

```json
{ "env": { "MAXHUB_API_KEY": "ak_xxxx..." } }
```

**方案 2：终端环境变量**

```bash
export MAXHUB_API_KEY="ak_xxxx..."
```

### 依赖安装

本 Skill 不需要额外脚本依赖，所有调用通过 `curl` 完成 HTTP 请求即可，无第三方库依赖。

### 环境变量配置

| 环境变量 | 说明 | 是否必填 | 获取方式 |
|---|---|---|---|
| `MAXHUB_API_KEY` | MaxHub 数据 API Key | 是 | [MaxHub 控制台](https://www.aconfig.cn) |

## 4. 使用指南

### 核心约束（强制遵守）

| 规则 | 说明 |
|------|------|
| 🔒 非纯只读 | `get_temp_email_address` 是**创建型**接口，调用前**须用户明确确认场景**（仅限非敏感测试 / 注册验证） |
| 🚫 禁止臆造路径 | 仅使用 `references/endpoints_whitelist.yaml` 中的端点，**不得自行拼接、改版本号、加路径段** |
| 📋 数据流向第三方 | 所有请求发送至 `https://www.aconfig.cn`；邮件正文将经第三方中转，**不得用于敏感 / 私人通信** |
| 🔑 凭证保护 | API Key 与每次返回的 `token` 不得泄漏至日志或对话；不同邮箱的 token 不可混用 |

### 基础使用（4 步完成调用）

**Step 1 — 检查 API Key**

```bash
[ -n "${MAXHUB_API_KEY:-}" ] && echo "ok" || echo "missing"
```

若返回 `missing`，停止并提示用户配置 `MAXHUB_API_KEY`。

**Step 2 — 匹配意图 → 选择 reference**

按用户目标从下表选择对应 reference 文件：

| 用户目标 | 加载文件 | 覆盖范围 |
|---------|---------|---------|
| 创建邮箱 / 查收件箱 / 读邮件 | `references/mail.md` | 临时邮箱地址生成、收件箱列表、邮件详情（3 端点） |
| 跨端点参数查询 / 字段流追溯 | `references/param-mappings.md` | 全局红线 + 端点路由 + token 字段流 + 错误处理总览 |
| 路径白名单硬校验 | `references/endpoints_whitelist.yaml` | 3 个端点的硬白名单 + Pre-call 4 步自检协议 |
| SKILL 版本检查与升级 | `references/update.md` | SkillHub / ClawHub / GitHub 三通道更新 |

**Step 3 — 构建最小调用计划**

- ✅ 创建邮箱前**必须**让用户确认使用场景为非敏感
- ✅ token 是会话凭据，必须在 `get_emails_inbox` / `get_email_by_id` 中复用
- ❌ 禁止"先 head/tail 试运行"或"先调一个看看"等探索性调用

**Step 4 — 执行并验证**

- 调用前比对 `endpoints_whitelist.yaml` 完成 4 步 Pre-call 自检（路径 → method → 必填 → 写入确认）
- 收到 **404** → 必须先做防路径臆造自检（5 步）
- 收到 **400 / 422** → 必须先做防参数臆造自检（6 步），重点确认 `token` 与 `message_id` 是否成对出现
- 收到 **业务 code != 0** → 读 `message_zh` 报告用户，**不重试**

### 高级使用

#### 链式调用图谱（Chain Recipes）

| 用户场景 | 链路 | 字段流 |
|---------|------|-------|
| 创建邮箱 → 等待收件 → 读取验证码 | `get_temp_email_address` → 轮询 `get_emails_inbox` → `get_email_by_id` | `token` 复用 → `message_id` 接力 |
| 收件箱实时检查 | `get_emails_inbox`（token） | token 单参 |
| 单封邮件读取 | `get_email_by_id`（token + message_id） | 必须同 token |

#### 防臆造自检清单（强制前置步骤）

**收到 404 时（A）**：
1. 路径白名单逐字符比对 → 不在清单中 STOP
2. Method 比对 → 不等 STOP
3. 参数键名比对 → 有清单外参数 STOP
4. token 来源溯源（必须来自 `get_temp_email_address` 返回值）→ 编造的 STOP
5. 全通过才判定"邮件不存在或已过期"

**收到 400 / 422 时（B）**：
1. 参数名严格比对（`token` / `message_id` 不可混用）
2. 必填项齐全（`get_email_by_id` 必须 token + message_id 同时传）
3. 类型与格式严格匹配
4. 传参方式正确（query string）
5. 没有 IN 表外的臆造参数
6. 全通过才按 `message_zh` 排查

#### 轮询最佳实践（接收验证码）

- **轮询间隔**：3–5 秒一次
- **轮询上限**：建议 5 分钟封顶；超时后提示用户重试或使用其他邮箱
- **token 失效**：临时邮箱有时效性，超时后需重新调用 `get_temp_email_address` 获取新 token

#### SKILL 版本更新

| 触发条件 | 推荐操作 |
|---------|---------|
| 合法路径持续 404 / 410 | `skillhub upgrade maxhub-temp-mail`（国内）或 `clawhub upgrade maxhub-temp-mail`（国际） |
| 用户问"版本是多少" | 当前版本 v3.7.2，访问 https://skillhub.cn/skills/maxhub-temp-mail |
| 多端点连续 410 | `skillhub upgrade maxhub-temp-mail --force` |
| 401 / 402 / 403 | **不是版本问题**，去 https://www.aconfig.cn 处理 |

### 常用命令速查表

| 场景 | 命令 |
|---|---|
| 查 API Key | `[ -n "${MAXHUB_API_KEY:-}" ] && echo "ok" \|\| echo "missing"` |
| 创建临时邮箱 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/temp_mail/v1/get_temp_email_address"` |
| 查收件箱 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/temp_mail/v1/get_emails_inbox?token=xxx"` |
| 读邮件详情 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/temp_mail/v1/get_email_by_id?token=xxx&message_id=yyy"` |
| 检查 SKILL 更新 | `skillhub info maxhub-temp-mail` 或 `clawhub info maxhub-temp-mail` |

## 5. 使用场景

### 场景一：自动化测试团队接收注册验证码

- **角色**：QA 自动化工程师
- **需求**：在端到端测试中需要批量注册账号，需要可程序化接收验证码邮件
- **使用方式**：`get_temp_email_address` 创建邮箱 → 用其作为注册邮箱提交目标系统 → 轮询 `get_emails_inbox` → 命中验证邮件后 `get_email_by_id` 取正文中的验证码
- **预期收益**：注册场景测试完全无人值守，提升 E2E 测试覆盖率

### 场景二：网站注册验证

- **角色**：开发者 / 普通用户
- **需求**：注册非核心服务时不愿暴露常用邮箱
- **使用方式**：`get_temp_email_address` 取一次性邮箱 → 完成注册 → `get_emails_inbox` 等接收 → `get_email_by_id` 完成验证
- **预期收益**：避免常用邮箱被营销邮件淹没，提升收件箱信噪比

### 场景三：隐私保护场景

- **角色**：隐私敏感用户
- **需求**：在不可信环境下需要短期接收邮件而不留下身份痕迹
- **使用方式**：`get_temp_email_address`（用户场景确认后）→ 一次性使用 → 用完不再访问
- **预期收益**：邮箱不与真实身份绑定，降低数据被聚合的风险（**注意**：仍不适用于敏感 / 法律 / 金融通信）

### 场景四：批量薅羊毛 / 多账号测试

- **角色**：增长测试 / 内部多账号测试
- **需求**：批量为内部测试创建独立邮箱
- **使用方式**：循环调用 `get_temp_email_address` 生成 N 个 token → 分发给测试账号 → 各自轮询 `get_emails_inbox`
- **预期收益**：低成本批量构建测试邮箱矩阵，加速增长实验迭代

## 6. 项目架构

### 目录结构

```
maxhub-temp-mail/
├── SKILL.md                            # Skill 定义与使用文档（本文件）
├── README.md                           # 英文项目说明
├── README_CN.md                        # 中文项目说明
├── _meta.json                          # 版本元信息（version: 3.7.2）
└── references/
    ├── endpoints_whitelist.yaml        # 3 端点路径硬白名单 + Pre-call 4 步自检协议
    ├── param-mappings.md               # 中枢索引（全局红线 + token 字段流 + 错误处理）
    ├── mail.md                         # 邮件域：邮箱创建 / 收件箱 / 邮件详情（3 端点）
    └── update.md                       # SKILL 更新机制（SkillHub / ClawHub / GitHub）
```

### 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 调用方式 | `curl` + Bearer Token | HTTP GET 请求，参数通过 query string 传递 |
| 数据接口 | MaxHub API | `https://www.aconfig.cn/api/v1/temp_mail/v1/*`，通过 `MAXHUB_API_KEY` 鉴权 |
| 路径校验 | YAML 硬白名单 | `endpoints_whitelist.yaml` 提供 3 端点的逐字符校验 + 4 步 Pre-call 协议 |
| 错误处理 | 决策表 + 自检清单 | HTTP 状态码权威定义 + 防臆造自检（A/B 双轨）+ token 失效处理 |
| 输出格式 | JSON Standard MaxHub Response | `{code, message, message_zh, data, cache_url}` |
| 更新通道 | SkillHub / ClawHub / GitHub | 国内 ⭐⭐⭐ SkillHub（腾讯云 CDN）/ 国际 ⭐⭐⭐ ClawHub / 降级 GitHub |

### API 覆盖范围

| 领域 | 端点数 | Reference 文件 |
|------|--------|---------------|
| 邮件（Mail） | 3 | `mail.md` |
| **合计** | **3** | — |

### 关键设计理念

- **防臆造四道闸**：白名单（endpoints_whitelist.yaml）→ 强标记（Full path）→ 禁止规则（Forbidden）→ 错误反馈（STOP）
- **创建型接口隔离**：`get_temp_email_address` 单独标记 + 强制场景确认 + 不得用于敏感场景
- **token 权限模型**：每个临时邮箱独立 token，跨邮箱不可访问，邮件 ID 必须与签发 token 配对使用
- **错误处理契约**：HTTP 状态码权威定义 + 防臆造自检清单（A: 5 步 / B: 6 步）+ token 失效自动重新创建建议
