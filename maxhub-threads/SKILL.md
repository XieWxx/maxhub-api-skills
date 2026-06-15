---
name: maxhub-threads
description: >-
  Query Threads data via MaxHub API — posts, user profiles, search, comments, and reposts.
  Use when user asks about Threads, meta threads, threads posts, threads users, or threads search.
  Do NOT use for posting content or account operations (read-only).
license: MIT-0
metadata:
  author: maxhub
  version: "3.7.2"
  openclaw:
    emoji: "🧵"
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
    tags: ["threads", "meta", "帖子分析", "用户分析", "社交媒体", "数据采集"]
    category: productivity
---

# Threads 数据助手

## 1. 简介

Threads 数据查询工具，通过 MaxHub API 接入 Meta 旗下文字社交平台 Threads，覆盖帖子详情、评论、用户资料、用户帖子 / 转发 / 回复列表、Top / Recent 搜索、个人主页搜索等核心能力。专注服务于 Threads 内容研究、Meta 社交监控、海外内容创作与跨平台舆情场景，帮助用户快速采集 Threads 数据、识别热门话题与意见领袖，构建 Meta 生态的内容情报。

## 2. 功能特性

- 🧵 **帖子全维度查询** — 支持 post_id 直查与 V2 版本 URL 兼容查询，含作者、媒体、互动统计

- 💬 **评论链路追溯** — 一级评论列表 + post_id 接力，覆盖完整讨论上下文

- 👤 **用户全景画像** — 用户名 / 用户 ID 双入口，资料 + 帖子 + 转发 + 回复一站式拉取

- 🔍 **搜索三件套** — Top（热门）+ Recent（最新）+ Profiles（人物）三类搜索覆盖内容与用户检索

- 🔄 **游标分页统一** — 全量列表接口统一使用 `end_cursor` 翻页，链路稳定

- 🛡️ **防臆造硬白名单** — `endpoints_whitelist.yaml` 路径硬校验，404/400 强制自检清单，杜绝 Agent 臆造 API 地址或参数

- 🔗 **链式调用图谱** — 11 个端点的字段流字典 + Chain Recipes，明确 username / user_id / post_id / query 在端点间的传递路径

- 📊 **错误处理契约** — HTTP 状态码权威定义 + 重试策略矩阵 + 端点替换矩阵（fetch_post_detail ↔ fetch_post_detail_v2）

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
| 🔒 只读 | 本技能仅用于数据查询和分析，**不执行写入 / 账户操作** |
| 🚫 禁止臆造路径 | 仅使用 `references/endpoints_whitelist.yaml` 中的端点，**不得自行拼接、改版本号、加路径段** |
| 📋 数据流向第三方 | 所有请求发送至 `https://www.aconfig.cn`，请使用独立测试账号并定期轮换 API Key |
| 🔑 凭证保护 | 不暴露 API Key、Cookie、Token 至日志或对话 |

### 基础使用（4 步完成调用）

**Step 1 — 检查 API Key**

```bash
[ -n "${MAXHUB_API_KEY:-}" ] && echo "ok" || echo "missing"
```

若返回 `missing`，停止并提示用户配置 `MAXHUB_API_KEY`。

**Step 2 — 匹配意图 → 选择 reference**

按用户目标从下表选择对应 reference 文件，每个文件自包含其领域的全部端点定义：

| 用户目标 | 加载文件 | 覆盖范围 |
|---------|---------|---------|
| 查帖子 / 评论 / 搜索内容 | `references/content.md` | 帖子详情（v1+v2）、评论列表、Top/Recent/Profiles 搜索（6 端点） |
| 查用户 / 帖子 / 转发 / 回复 | `references/user.md` | 用户资料（username + user_id 双入口）、用户帖子、转发、回复（5 端点） |
| 跨端点参数查询 / 字段流追溯 | `references/param-mappings.md` | 全局红线 + 端点路由 + 字段流字典 + 错误处理总览 |
| 路径白名单硬校验 | `references/endpoints_whitelist.yaml` | 11 个端点的硬白名单 + Pre-call 4 步自检协议 |
| SKILL 版本检查与升级 | `references/update.md` | SkillHub / ClawHub / GitHub 三通道更新 |

**Step 3 — 构建最小调用计划**

- ✅ 优先使用最少端点完成任务，能用一个端点就不用两个
- ✅ 知道 URL → 优先 `fetch_post_detail_v2`（支持 url 直查）；只有 post_id → 用 `fetch_post_detail`
- ❌ 禁止"先 head/tail 试运行"或"先调一个看看"等探索性调用

**Step 4 — 执行并验证**

- 调用前比对 `endpoints_whitelist.yaml` 完成 4 步 Pre-call 自检（路径 → method → 必填 → 写入确认）
- 收到 **404** → 必须先做防路径臆造自检（5 步）
- 收到 **400 / 422** → 必须先做防参数臆造自检（6 步）
- 收到 **业务 code != 0** → 读 `message_zh` 报告用户，**不重试**

### 高级使用

#### 链式调用图谱（Chain Recipes）

| 用户场景 | 链路 | 字段流 |
|---------|------|-------|
| 用户名 → 用户帖子 | `fetch_user_info` → `fetch_user_posts` | `username` → `user_id` 接力 |
| user_id → 全维度内容 | `fetch_user_info_by_id` → `fetch_user_posts` + `fetch_user_reposts` + `fetch_user_replies` | `user_id` 复用 |
| 帖子详情 + 评论 | `fetch_post_detail` → `fetch_post_comments` | `post_id` 复用 |
| URL → 帖子详情 | `fetch_post_detail_v2`（url） | URL 直查免接力 |
| 关键词 → 热门帖 → 详情 | `search_top` → `fetch_post_detail` | `query` → `post_id` |
| 关键词 → 最新帖 → 详情 | `search_recent` → `fetch_post_detail` | `query` → `post_id` |
| 用户搜索 → 资料 → 帖子 | `search_profiles` → `fetch_user_info` → `fetch_user_posts` | `query` → `username` → `user_id` |

#### 防臆造自检清单（强制前置步骤）

**收到 404 时（A）**：
1. 路径白名单逐字符比对 → 不在清单中 STOP
2. Method 比对 → 不等 STOP
3. 参数键名比对 → 有清单外参数 STOP
4. 资源 ID 来源溯源 → Agent 编造的 STOP
5. 全通过才判定"上游资源不存在"

**收到 400 / 422 时（B）**：
1. 参数名严格比对（`username` / `user_id` / `post_id` / `query` 不可混用）
2. 必填项齐全 + `fetch_post_detail_v2` 的 `oneOf: [post_id, url]` 二选一逻辑
3. 类型与格式严格匹配（pattern / enum）
4. 传参方式正确（query vs body）
5. 没有 IN 表外的臆造参数
6. 全通过才按 `message_zh` 排查

#### 端点替换矩阵

| 优先接口 | 降级接口 | 触发条件 |
|---|---|---|
| `fetch_post_detail_v2`（url / post_id） | `fetch_post_detail`（post_id） | 仅有 post_id 时直接使用 v1 |
| `search_top` | `search_recent` | 想要最新内容时切换 |

#### SKILL 版本更新

| 触发条件 | 推荐操作 |
|---------|---------|
| 合法路径持续 404 / 410 | `skillhub upgrade maxhub-threads`（国内）或 `clawhub upgrade maxhub-threads`（国际） |
| 用户问"版本是多少" | 当前版本 v3.7.2，访问 https://skillhub.cn/skills/maxhub-threads |
| 多端点连续 410 | `skillhub upgrade maxhub-threads --force` |
| 401 / 402 / 403 | **不是版本问题**，去 https://www.aconfig.cn 处理 |

### 常用命令速查表

| 场景 | 命令 |
|---|---|
| 查 API Key | `[ -n "${MAXHUB_API_KEY:-}" ] && echo "ok" \|\| echo "missing"` |
| 查用户资料 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/threads/web/fetch_user_info?username=xxx"` |
| 查用户帖子 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/threads/web/fetch_user_posts?user_id=xxx"` |
| 查帖子详情（URL） | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/threads/web/fetch_post_detail_v2?url=https://www.threads.net/@xxx/post/yyy"` |
| 关键词搜索热门 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/threads/web/search_top?query=AI"` |
| 检查 SKILL 更新 | `skillhub info maxhub-threads` 或 `clawhub info maxhub-threads` |

## 5. 使用场景

### 场景一：Threads 内容研究者发掘热门话题

- **角色**：海外社媒研究员
- **需求**：监测某关键词在 Threads 平台的热度变化与最新 / 热门讨论
- **使用方式**：`search_top` 拉热门贴 + `search_recent` 拉最新贴 → 取 `post_id` → 链式调 `fetch_post_detail` 提取互动数据
- **预期收益**：双轨搜索覆盖热度与时效，构建关键词的完整 Threads 讨论画像

### 场景二：Meta 社交监控团队追踪 KOL 动态

- **角色**：品牌社交监控
- **需求**：定期采集目标 KOL 在 Threads 上的帖子、转发与回复，识别其内容策略
- **使用方式**：`search_profiles`（用户名搜索）→ `fetch_user_info` → 并行 `fetch_user_posts` + `fetch_user_reposts` + `fetch_user_replies`
- **预期收益**：KOL 全行为画像（原创 / 转发 / 回复三链路），识别其圈层互动与内容偏好

### 场景三：海外内容创作者寻找 Threads 选题

- **角色**：海外自媒体
- **需求**：从 Threads 平台借鉴热门选题与表达方式
- **使用方式**：`search_top` 拉行业关键词热门贴 → `fetch_post_detail` 取完整文本与媒体 → `fetch_post_comments` 看用户共鸣点
- **预期收益**：从 Threads 采集真实表达样本，提升海外内容选题的本地化与共鸣度

### 场景四：跨平台舆情对比分析

- **角色**：舆情分析师
- **需求**：对比同一话题在 Threads 与其他社交平台的传播差异
- **使用方式**：`search_top` + `search_recent` 拉取话题相关帖 → 取 `user_id` 通过 `fetch_user_info_by_id` 反查用户画像 → 输出热度 / 用户层级 / 互动结构对比
- **预期收益**：跨平台舆情数据对齐，识别 Threads 用户群体与其他平台的差异化特征

## 6. 项目架构

### 目录结构

```
maxhub-threads/
├── SKILL.md                            # Skill 定义与使用文档（本文件）
├── README.md                           # 英文项目说明
├── README_CN.md                        # 中文项目说明
├── _meta.json                          # 版本元信息（version: 3.7.2）
└── references/
    ├── endpoints_whitelist.yaml        # 11 端点路径硬白名单 + Pre-call 4 步自检协议
    ├── param-mappings.md               # 中枢索引（全局红线 + 字段流字典 + 错误处理）
    ├── content.md                      # 内容域：帖子详情/评论/搜索（6 端点）
    ├── user.md                         # 用户域：资料/帖子/转发/回复（5 端点）
    └── update.md                       # SKILL 更新机制（SkillHub / ClawHub / GitHub）
```

### 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 调用方式 | `curl` + Bearer Token | HTTP GET 请求，参数通过 query string 传递 |
| 数据接口 | MaxHub API | `https://www.aconfig.cn/api/v1/threads/web/*`，通过 `MAXHUB_API_KEY` 鉴权 |
| 路径校验 | YAML 硬白名单 | `endpoints_whitelist.yaml` 提供 11 端点的逐字符校验 + 4 步 Pre-call 协议 |
| 错误处理 | 决策表 + 自检清单 | HTTP 状态码权威定义 + 防臆造自检（A/B 双轨）+ 端点替换矩阵 |
| 输出格式 | JSON Standard MaxHub Response | `{code, message, message_zh, data, cache_url}` |
| 更新通道 | SkillHub / ClawHub / GitHub | 国内 ⭐⭐⭐ SkillHub（腾讯云 CDN）/ 国际 ⭐⭐⭐ ClawHub / 降级 GitHub |

### API 覆盖范围

| 领域 | 端点数 | Reference 文件 |
|------|--------|---------------|
| 内容（Content） | 6 | `content.md` |
| 用户（User） | 5 | `user.md` |
| **合计** | **11** | — |

### 关键设计理念

- **防臆造四道闸**：白名单（endpoints_whitelist.yaml）→ 强标记（Full path）→ 禁止规则（Forbidden）→ 错误反馈（STOP）
- **链式调用图谱**：字段流字典（`username` / `user_id` / `post_id` / `query`）+ Chain Recipes + 跨 reference 链路三层联动
- **错误处理契约**：HTTP 状态码权威定义 + 防臆造自检清单（A: 5 步 / B: 6 步）+ 端点替换矩阵（v1 ↔ v2）
