---
name: maxhub-threads
description: Threads 公开社交内容查询与用户分析 skill，通过 MaxHub API 查询帖子、用户资料、评论、搜索、时间线和相关互动数据。适合海外社媒内容研究、账号画像、话题追踪和互动分析。默认 read-only；agent 应从 recipes 匹配用户意图，按 post_id/user_id/keyword 等字段流链式调用，并避免过度采集个人社交数据。所有请求发送到 https://www.aconfig.cn。
license: MIT-0
metadata:
  author: maxhub
  version: 3.8.0
  openclaw:
    capability: read_only
    requires_confirmation:
    - non_idempotent
    - cookie_input
    emoji: 🧵
    primaryEnv: MAXHUB_API_KEY
    requires:
      env:
      - MAXHUB_API_KEY
      bins:
      - curl
    env:
    - name: MAXHUB_API_KEY
      description: API key for MaxHub data APIs. Get one at https://www.aconfig.cn
      required: true
      sensitive: true
    network:
    - https://www.aconfig.cn
    riskLevel: low
    defaultMode: recipes_first_read_only
    skillClass: maxhub-api-skill
    platform: threads
    authType: bearer_env
    dataSource: MaxHub API via https://www.aconfig.cn
    agentUse:
      entrypoint: SKILL.md §4 Agent Decision Tree
      intentIndex: references/recipes/_index.md
      chainDetails: references/recipes/<domain>.md
      fieldFlow: references/param-mappings.md
      endpointWhitelist: references/endpoints_whitelist.yaml
      selectionPolicy: recipes_first_then_atoms; longest_trigger_match; ask_on_tie
      parameterPolicy: use recipe extract/in_map and field-flow dictionary; never invent path or parameters
    privacy:
      thirdParty: https://www.aconfig.cn
      transmits:
      - MAXHUB_API_KEY
      - user_supplied_ids
      - keywords
      - urls
      - optional_cookies_or_tokens
      guidance: Use only for authorized data processing; minimize personal data; do not expose secrets in logs or prompts.
  hermes:
    tags:
    - threads
    - 帖子
    - 评论
    - 用户资料
    - 时间线
    - 搜索
    - 社交媒体
    category: data-analysis
    intents:
    - query
    - analyze
    - search
    - chain
    - report
    locale:
    - zh-CN
    - en
---

# Threads 数据助手

## 1. 简介

Threads 数据查询工具，通过 MaxHub API 接入 Meta 旗下文字社交平台 Threads，覆盖帖子详情、评论、用户资料、用户帖子 / 转发 / 回复列表、Top / Recent 搜索、个人主页搜索等核心能力。专注服务于 Threads 内容研究、Meta 社交监控、海外内容创作与跨平台舆情场景，帮助用户快速采集 Threads 数据、识别热门话题与意见领袖，构建 Meta 生态的内容情报。

## 2. 详细功能

### 帖子查询

- 通过帖子 ID 直查帖子详情，含正文、媒体、作者归属与互动量级
- 支持以原始帖子 URL 直接换取详情，免去先做链接解析的繁琐步骤
- 拉取帖子的完整作者上下文，定位发布者身份并衔接后续用户画像查询

### 评论追踪

- 拉取帖子下的一级评论列表，还原最直观的讨论氛围与高赞观点
- 评论结果与帖子主键无缝接力，可以串联到任意上游入口（搜索、用户、URL）
- 适配整段对话上下文采集，作为情感与共鸣分析的真实样本

### 用户洞察

- 同时支持通过用户名与稳定用户标识两种方式查询用户资料，兼容不同入口
- 拉取用户对外发布的原创帖子列表，识别其内容主题与发布节奏
- 拉取用户的转发与回复列表，全面观察其圈层互动与对其他声音的态度

### 搜索三件套

- 按关键词查询热门排序的帖子结果，快速捕捉话题已沉淀下来的代表性内容
- 按关键词查询最新排序的帖子结果，跟进话题正在发生的最实时进展
- 按关键词搜索人物档案，精准定位目标用户、KOL 或品牌官方账号

### 游标分页统一

- 全量列表类查询采用统一的游标翻页机制，多次翻页无需切换不同的分页策略
- 翻页参数与上一页返回结果直接衔接，链路稳定不易踩到边界异常
- 支持长程持续采集任务，避免在大批量数据回流时丢页或重复

> ### 📋 数据传输与隐私声明（请认真阅读）
>
> 1. **第三方传输**：您提供的所有 ID、关键词、链接、cookie 等参数都会通过 HTTPS 发送到 **`https://www.aconfig.cn`**（MaxHub 数据服务）进行处理。
> 2. **UGC 隐私**：拉回的评论 / 弹幕 / 动态 / 私信 / 联系人等内容可能包含个人信息或敏感 UGC，请勿写入未授权的数据库或公开发布。
> 3. **凭证保护**：建议使用**独立测试账号**、定期轮换 API Key；**禁止**传入主力生产账号的 cookie 或 session 凭证。
> 4. **合规责任**：使用方需自行确保符合所在地区的数据保护法律（《个人信息保护法》/ GDPR / 平台 ToS 等），平台账号的合规性由使用方承担。

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


### 🤖 Agent Decision Tree（必读 · 决定调用顺序）

> 此小节定义 agent 在每次接到用户请求时的**标准决策流程**。严格按此顺序执行可大幅提升命中率与减少误调用。

#### 1️⃣ 文档加载顺序（按需 · 不要一次性全读）
| 步骤 | 何时读 | 加载文件 | 估算 token |
|------|-------|---------|-----------|
| ① 永远先读 | 接到任何请求时 | `SKILL.md` §0.1（不支持清单）+ §4（本节） | ~1K |
| ② 选择 recipe | 用户语义清晰时 | `references/recipes/_index.md`（仅索引） | ~1.5K |
| ③ 加载 recipe 详情 | 匹配到具体 recipe 时 | `references/recipes/<domain>.md` 的对应段落 | ~500/段 |
| ④ 加载端点详情 | 自定义链路或参数不明时 | `references/<domain>.md` 单文件 | ~3K |
| ⑤ 路径白名单校验 | 调用前 | `grep '<endpoint_id>' references/endpoints_whitelist.yaml`（**禁止整体读**） | ~50 行 |
| ⑥ 跨端点字段路由 | 链式调用时 | `references/param-mappings.md` § 字段流字典 | ~1K |

#### 2️⃣ Recipe 匹配规则（核心）
1. **加载** `references/recipes/_index.md`，扫 `trigger_keywords` 列
2. **最长匹配优先**：若用户输入同时命中多个 recipe 的 trigger，**选最长 trigger 命中的那个**（最具体）
3. **平局询问**：若两个 trigger 长度相同且都命中 → 主动询问用户："您是想看 A 还是 B？"
4. **无命中**：先查 §0.1 不支持清单 → 不在则进入"自定义链路"流程（步骤 3）

#### 3️⃣ 自定义链路（无现成 Recipe）
1. 读 `references/atoms/_index.md`，按 `chain_role` 列定位起点（`starter`）和终点（`terminal`）
2. **优先用 `⭐⭐⭐ 首选`** 标记的端点；不到必要不用 `⭐ 条件` 端点
3. 字段流（上游 OUT → 下游 IN）由 `param-mappings.md § 字段流字典` 决定，**禁止**自行猜 json_path
4. 链路完成后，可向维护方建议把它编排成新 recipe

#### 4️⃣ 调用前自检（按 risk 分级 · 节省 token）
| 端点 risk | 必做自检 | 步骤数 |
|----------|---------|-------|
| `risk: low` | ① 路径在 endpoints_whitelist.yaml | 1 步 |
| `risk: medium` | ① 路径 ② method ③ 必填参数 ④ 写入确认 | 4 步 |
| `risk: high` | 4 步 + 显式向用户确认参数与意图 | 5 步 |
| `risk: critical`（restricted） | 6 步高风险确认流程（详见 §高风险能力清单） | 6 步 |

> 旧 SKILL 强制所有调用都做 4 步——现按 risk 等级简化。`low` 端点（占绝大多数）只校验路径即可。

#### 5️⃣ 错误处理快速决策
| 现象 | 行动 | 重试 |
|------|------|------|
| 404 / 410 | §3.1(A) 5 步防臆造自检 → 通过才 STOP；**禁止**自改路径段重试 | 0 |
| 400 / 422 | §3.1(B) 6 步防参数臆造自检 → 通过才修参重试 | ≤1 |
| 401 / 402 / 403 | STOP，告知用户去 https://www.aconfig.cn 处理 | 0 |
| 429 | 读 `Retry-After` 退避；无该头时指数退避+jitter | ≤2 |
| 5xx | 等 3 秒重试 → 仍失败走端点级"降级/替换" | 1 |
| HTTP 200 + `code != 0` | 读 `message_zh` 报告用户；**不重试**（业务错误重试无用） | 0 |

#### 6️⃣ 输出契约（与用户对话时）
1. **数据来源声明**：每次输出明确告知数据来自 `https://www.aconfig.cn` 三方接口
2. **缺失字段处理**：如某字段链路降级后缺失，**显式说明**"X 暂不可取"，不要静默省略
3. **不要伪造**：用户问的字段若不在响应里 → 说"未返回"，禁止用其他端点拼凑模拟



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


### 📌 端到端使用示例（agent 快速上手）

**用户输入**：「帮我看 Threads 某个 user 的最近 post」

**Agent 执行步骤**：

1. **匹配 recipe**：读 `references/recipes/_index.md` → 找到 trigger 命中 → 选最长匹配的 recipe
2. **加载 recipe 详情**：读 `references/recipes/<domain>.md` 中对应段落，拿到 Inputs / Atomic Steps / Output
3. **路径校验**：对每个 atom 的 endpoint_id，`grep` 一下 `endpoints_whitelist.yaml` 确认存在
4. **risk: low 的端点直接调用，risk: medium+ 先与用户确认**
5. **链式传递**：上游响应的 json_path 字段（如 `$.data.bvid`）按 recipe 的 `extract` 列绑定为变量，传给下游端点
6. **错误处理**：按 §错误处理决策表行动；不要自改路径或瞎加参数
7. **输出**：组装结果给用户，标明数据来自三方接口；缺失字段显式说"未取到"

**反例（agent 不要这么做）**：
- ❌ 全文加载 `endpoints_whitelist.yaml`（大文件，浪费上下文）
- ❌ 看到 404 就改路径段重试（会被防臆造规则阻断）
- ❌ 把没在响应里的字段编一个值返回给用户
- ❌ 链式调用时忽略 recipe 的 `extract` 列，自己猜 json_path


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
