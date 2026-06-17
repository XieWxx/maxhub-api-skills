---
name: maxhub-toutiao
description: 今日头条（Toutiao）内容数据查询与资讯分析 skill，通过 MaxHub API 查询文章/视频详情、评论、用户/媒体号、搜索、热榜和推荐内容。适合资讯选题、舆情监控、内容互动分析、媒体号画像和热点跟踪。默认 read-only；agent 应按 recipes 匹配文章、评论、搜索、热榜等意图，并用字段流字典传递 item_id/group_id/user_id 等参数。所有请求发送到 https://www.aconfig.cn。
license: MIT-0
metadata:
  author: maxhub
  version: 3.8.0
  openclaw:
    capability: read_only
    requires_confirmation:
    - non_idempotent
    - cookie_input
    emoji: 📰
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
    platform: toutiao
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
    - toutiao
    - 今日头条
    - 文章
    - 视频
    - 评论
    - 媒体号
    - 搜索
    - 热榜
    - 资讯分析
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

# 今日头条 数据助手

## 1. 简介

今日头条数据查询工具，通过 MaxHub API 接入字节跳动旗下资讯聚合平台今日头条，覆盖 App 端文章详情 / 视频详情 / 评论列表 / 用户资料 / 用户 ID 解析，以及 Web 端文章详情 / 视频详情两类入口。专注服务于头条内容采集、用户画像研究、文章 / 视频爬取与跨端数据对齐场景，帮助用户高效获取头条内容数据，构建资讯赛道的内容情报基底。

## 2. 详细功能

### 文章与视频双形态

- 拉取头条文章详情，包含完整正文、配图、作者与发布时间
- 拉取头条视频详情，获取视频元数据、封面与互动统计
- 同一篇内容支持文章与视频两种调用入口，覆盖图文与视频双场景
- 适合批量爬取爆款内容，构建头条赛道的内容数据库

### 评论链路

- 拉取一篇头条文章或视频下的一级评论列表
- 支持游标翻页，可持续翻页直至覆盖全部评论
- 还原读者的真实反馈与争议焦点，辅助舆情研判

### 用户全景画像

- 读取头条号作者的资料、签名、认证身份与粉丝量
- 通过用户主页 URL 反查用户唯一标识，打通"链接 → 资料"的解析链路
- 适合 MCN 与品牌方批量梳理头条号矩阵与作者画像

### App 与 Web 双端覆盖

- 同时支持 App 端与 Web 端两种数据入口，按场景灵活选择
- App 端与 Web 端可双向校对同一篇内容的元数据，提升采集可靠性
- 跨端字段互补，规避单端数据缺失或字段空洞的风险

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
| 🚫 禁止臆造路径 | 仅使用 `references/endpoints_whitelist.yaml` 中的端点，**不得自行拼接、改 app/web 段、加路径段** |
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
| 查文章 / 视频 / 评论 | `references/post.md` | App 端文章 / 视频 / 评论 + Web 端文章 / 视频（5 端点） |
| 查用户 / 解析 user_id | `references/user.md` | App 端用户资料、用户主页 URL → user_id 解析（2 端点） |
| 跨端点参数查询 / 字段流追溯 | `references/param-mappings.md` | 全局红线 + 端点路由 + 字段流字典 + 错误处理总览 |
| 路径白名单硬校验 | `references/endpoints_whitelist.yaml` | 7 个端点的硬白名单 + Pre-call 4 步自检协议 |
| SKILL 版本检查与升级 | `references/update.md` | SkillHub / ClawHub / GitHub 三通道更新 |

**Step 3 — 构建最小调用计划**

- ✅ 优先使用最少端点完成任务，能用一个端点就不用两个
- ✅ App 端 `group_id` 与 Web 端 `aweme_id` 不可混用，须按入口选择
- ❌ 禁止"先 head/tail 试运行"或"先调一个看看"等探索性调用

**Step 4 — 执行并验证**

- 调用前比对 `endpoints_whitelist.yaml` 完成 4 步 Pre-call 自检（路径 → method → 必填 → 写入确认）
- 收到 **404** → 必须先做防路径臆造自检（5 步），尤其确认 `app` / `web` 段
- 收到 **400 / 422** → 必须先做防参数臆造自检（6 步），重点检查 `group_id` / `aweme_id`
- 收到 **业务 code != 0** → 读 `message_zh` 报告用户，**不重试**

### 高级使用

#### 链式调用图谱（Chain Recipes）

| 用户场景 | 链路 | 字段流 |
|---------|------|-------|
| App 端文章 + 评论 | `app_get_article_info` → `app_get_comments` | `group_id` 复用 |
| App 端视频 + 评论 | `app_get_video_info` → `app_get_comments` | `group_id` 复用 |
| 用户主页 URL → 用户资料 | `app_get_user_id` → `app_get_user_info` | `user_profile_url` → `user_id` 接力 |
| Web 文章详情 | `web_get_article_info`（aweme_id） | Web 端独立链路 |
| Web 视频详情 | `web_get_video_info`（aweme_id） | Web 端独立链路 |

#### 防臆造自检清单（强制前置步骤）

**收到 404 时（A）**：
1. 路径白名单逐字符比对 → 不在清单中 STOP
2. Method 比对 → 不等 STOP
3. 参数键名比对 → 有清单外参数 STOP
4. `app` / `web` 段是否混用 → 错段 STOP
5. 资源 ID 来源溯源 → Agent 编造的 STOP
6. 全通过才判定"上游资源不存在"

**收到 400 / 422 时（B）**：
1. 参数名严格比对（App 端用 `group_id` / Web 端用 `aweme_id`，不可混用）
2. 必填项齐全（`app_get_comments` 必传 `offset`）
3. 类型与格式严格匹配
4. 传参方式正确（query string）
5. 没有 IN 表外的臆造参数
6. 全通过才按 `message_zh` 排查

#### App ↔ Web 端点替换矩阵

| App 端 | Web 端 | 关键差异 |
|---|---|---|
| `app_get_article_info`（group_id） | `web_get_article_info`（aweme_id） | 主键不同 |
| `app_get_video_info`（group_id） | `web_get_video_info`（aweme_id） | 主键不同 |

#### SKILL 版本更新

| 触发条件 | 推荐操作 |
|---------|---------|
| 合法路径持续 404 / 410 | `skillhub upgrade maxhub-toutiao`（国内）或 `clawhub upgrade maxhub-toutiao`（国际） |
| 用户问"版本是多少" | 当前版本 v3.7.2，访问 https://skillhub.cn/skills/maxhub-toutiao |
| 多端点连续 410 | `skillhub upgrade maxhub-toutiao --force` |
| 401 / 402 / 403 | **不是版本问题**，去 https://www.aconfig.cn 处理 |

### 常用命令速查表

| 场景 | 命令 |
|---|---|
| 查 API Key | `[ -n "${MAXHUB_API_KEY:-}" ] && echo "ok" \|\| echo "missing"` |
| App 端查文章 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/toutiao/app/get_article_info?group_id=xxx"` |
| App 端查视频 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/toutiao/app/get_video_info?group_id=xxx"` |
| App 端查评论 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/toutiao/app/get_comments?group_id=xxx&offset=0"` |
| 主页 URL → user_id | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/toutiao/app/get_user_id?user_profile_url=..."` |
| Web 端查文章 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/toutiao/web/get_article_info?aweme_id=xxx"` |
| 检查 SKILL 更新 | `skillhub info maxhub-toutiao` 或 `clawhub info maxhub-toutiao` |


### 📌 端到端使用示例（agent 快速上手）

**用户输入**：「帮我看 今日头条某个文章的评论」

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

### 场景一：头条内容采集团队批量爬取爆款

- **角色**：内容采集工程师
- **需求**：根据头条号文章 / 视频 ID 批量采集详情用于内容数据库
- **使用方式**：`group_id` 列表 → 并行调 `app_get_article_info` / `app_get_video_info` → 链式调 `app_get_comments` 取评论
- **预期收益**：构建头条爆款内容数据库，支持后续数据挖掘与训练样本生产

### 场景二：用户画像分析师研究头条号

- **角色**：MCN 数据研究员
- **需求**：从头条号主页 URL 出发完整还原作者画像
- **使用方式**：`app_get_user_id`（user_profile_url 解析）→ `app_get_user_info`（user_id 拉资料）
- **预期收益**：批量构建头条号作者画像，识别真实活跃账号

### 场景三：文章爬取自动化任务

- **角色**：自媒体监控
- **需求**：跨 App / Web 双端对齐采集同一篇文章的元数据
- **使用方式**：App 端 `app_get_article_info`（group_id）+ Web 端 `web_get_article_info`（aweme_id）双向校对
- **预期收益**：双端数据交叉校对，提升爬取数据完整性与可靠性

### 场景四：视频内容研究者追踪头条视频

- **角色**：视频内容研究员
- **需求**：监测头条视频的播放数据 + 评论争议
- **使用方式**：`app_get_video_info`（group_id）→ `app_get_comments`（group_id + offset）翻页全量拉评论
- **预期收益**：完整还原头条视频的用户反馈与传播路径

## 6. 项目架构

### 目录结构

```
maxhub-toutiao/
├── SKILL.md                            # Skill 定义与使用文档（本文件）
├── README.md                           # 英文项目说明
├── README_CN.md                        # 中文项目说明
├── _meta.json                          # 版本元信息（version: 3.7.2）
└── references/
    ├── endpoints_whitelist.yaml        # 7 端点路径硬白名单 + Pre-call 4 步自检协议
    ├── param-mappings.md               # 中枢索引（全局红线 + 字段流字典 + 错误处理）
    ├── post.md                         # 内容域：App 文章/视频/评论 + Web 文章/视频（5 端点）
    ├── user.md                         # 用户域：用户资料 + 主页 URL 解析（2 端点）
    └── update.md                       # SKILL 更新机制（SkillHub / ClawHub / GitHub）
```

### 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 调用方式 | `curl` + Bearer Token | HTTP GET 请求，参数通过 query string 传递 |
| 数据接口 | MaxHub API | `https://www.aconfig.cn/api/v1/toutiao/app/*` 与 `web/*`，通过 `MAXHUB_API_KEY` 鉴权 |
| 路径校验 | YAML 硬白名单 | `endpoints_whitelist.yaml` 提供 7 端点的逐字符校验 + 4 步 Pre-call 协议 |
| 错误处理 | 决策表 + 自检清单 | HTTP 状态码权威定义 + 防臆造自检（A/B 双轨）+ App↔Web 替换矩阵 |
| 输出格式 | JSON Standard MaxHub Response | `{code, message, message_zh, data, cache_url}` |
| 更新通道 | SkillHub / ClawHub / GitHub | 国内 ⭐⭐⭐ SkillHub（腾讯云 CDN）/ 国际 ⭐⭐⭐ ClawHub / 降级 GitHub |

### API 覆盖范围

| 领域 | 端点数 | Reference 文件 |
|------|--------|---------------|
| 内容（Post） | 5 | `post.md` |
| 用户（User） | 2 | `user.md` |
| **合计** | **7** | — |

### 关键设计理念

- **防臆造四道闸**：白名单（endpoints_whitelist.yaml）→ 强标记（Full path）→ 禁止规则（Forbidden）→ 错误反馈（STOP）
- **App / Web 双端契约**：`group_id` ↔ `aweme_id` 主键互斥 + 替换矩阵兜底
- **链式调用图谱**：字段流字典（`group_id` / `aweme_id` / `user_id` / `user_profile_url`）+ Chain Recipes
- **错误处理契约**：HTTP 状态码权威定义 + 防臆造自检清单（A: 5 步 / B: 6 步）+ App↔Web 替换矩阵
