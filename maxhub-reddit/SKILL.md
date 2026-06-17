---
name: maxhub-reddit
description: Reddit 公开社区数据查询与讨论分析 skill，通过 MaxHub API 查询 subreddit、帖子详情、评论树、用户资料、搜索、热门/趋势内容等。适合社区舆情、话题研究、竞品反馈收集、内容洞察和用户讨论分析。默认 read-only；agent 应优先使用 recipes 串联 subreddit/post/comment/user 相关端点，并显式处理评论/UGC 中的个人信息和敏感内容。所有请求发送到 https://www.aconfig.cn。
license: MIT-0
metadata:
  author: maxhub
  version: 3.8.0
  openclaw:
    capability: read_only
    requires_confirmation:
    - non_idempotent
    - cookie_input
    emoji: 🤖
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
    platform: reddit
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
    - reddit
    - subreddit
    - 帖子
    - 评论树
    - 用户资料
    - 搜索
    - 热门
    - 社区舆情
    - UGC
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

# Reddit 数据助手

## 1. 简介

Reddit 数据查询工具，通过 MaxHub API 接入 Reddit 社区平台，覆盖 Subreddit 版块信息、Home / Popular / Games / News / Explore / Topic 多类 Feed、帖子详情与批量、评论与子回复、用户资料 / 帖子 / 评论 / 奖杯、综合搜索与社区亮点等全部能力。专注服务于海外社区舆情监控、产品反馈采集、Reddit KOL 追踪与趋势话题挖掘业务，帮助用户快速捕捉用户原声、识别上升期 subreddit、量化产品口碑。

## 2. 详细功能

### 帖子数据
- 查询 Reddit 单条帖子完整详情，含标题、正文、媒体、奖章、标签等元数据
- 支持图文、Carousel、视频等多形态帖子的结构化展示
- 提供小批量与大批量两种帖子查询接口，满足不同采集规模
- 支持锚定到具体评论 ID，便于直接定位讨论上下文

### 评论与回复
- 拉取帖子一级评论列表，支持游标翻页深度采集
- 拉取指定评论下的二级回复链路
- 支持按 best、top、new、controversial 等多种排序方式查看评论
- 评论数据可与帖子数据组合，构建完整讨论树

### Subreddit 画像
- 查询 Subreddit 版块基础资料卡，含订阅数、简介、规则等
- 拉取 Subreddit 视觉样式信息，了解版块品牌定位
- 拉取 Subreddit 内部分类频道列表
- 查询 Subreddit 高级设置信息，洞察版块运营策略
- 检查 Subreddit 是否被静音，规避无效采集
- 拉取 Subreddit 帖子流，按版块视角监控内容

### 用户画像
- 查询 Reddit 用户基础资料卡，含 karma、注册时间、头像等
- 拉取用户活跃 Subreddit 列表，刻画兴趣分布
- 拉取用户全部历史帖子
- 拉取用户全部历史评论
- 查询用户获得的奖杯（Trophies），评估资历与影响力

### 多类 Feed 矩阵
- 提供 Home 首页 Feed，覆盖默认推荐流
- 提供 Popular 全站热门 Feed
- 提供 Games 游戏垂类 Feed
- 提供 News 新闻垂类 Feed
- 提供 Explore 发现 Feed，按话题分类浏览
- 提供 Topic 分类 Feed，深入特定话题流

### 搜索能力
- 提供动态综合搜索，按关键词检索帖子、用户、版块
- 提供搜索自动补全建议，加速关键词输入
- 提供热门搜索词列表，捕捉全站趋势
- 提供社区亮点接口，发现版块高光内容
- 支持搜索类型、排序、时间范围多维过滤

### Reddit Answers 精简数据
- 提供 LLM 友好的精简帖子数据接口，自动剥离冗余字段
- 提供 LLM 友好的精简评论数据接口，节省 token 消耗
- 适合在摘要、问答、主题聚类等大模型场景中直接使用
- 与全字段批量接口形成互补，用户可按是否做 LLM 处理择优

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
| 🔒 只读 | 本技能仅用于数据查询和分析，**不执行写入 / 账户操作（点赞、评论、发帖一律不可）** |
| 🚫 禁止臆造路径 | 仅使用 `references/endpoints_whitelist.yaml` 中的端点，**不得自行拼接、加版本号、加路径段** |
| 📋 数据流向第三方 | 所有请求发送至 `https://www.aconfig.cn`，请使用独立测试账号并定期轮换 API Key |
| 🔑 凭证保护 | 不暴露 API Key、Cookie、Token 至日志或对话 |
| 🔀 ID 区分 | `subreddit_id`（t5_xxx）与 `subreddit_name`（如 `r/AskReddit`）参数不同名，**严禁混用** |

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
| 查 Feed / 帖子详情 / 评论 / 回复 / 精简数据 | `references/content.md` | Home/Popular/Games/News/Explore/Topic Feed、帖子详情、评论、回复、Reddit Answers（13 端点） |
| 查 Subreddit / 信息 / 设置 / Feed / 频道 / 静音 | `references/subreddit.md` | 版块样式、Channels、信息、设置、Feed、静音检查（6 端点） |
| 查用户 / 帖子 / 评论 / 奖杯 / 活跃社区 | `references/user.md` | 用户资料、活跃 Subreddit、用户帖子、用户评论、奖杯（5 端点） |
| 搜索 / 自动补全 / 社区亮点 / 热门搜索 | `references/search.md` | 搜索自动补全、动态搜索、社区亮点、热门搜索（4 端点） |
| 跨端点参数查询 / 字段流追溯 | `references/param-mappings.md` | 全局红线 + 端点路由 + 字段流字典 + 错误处理总览 |
| 路径白名单硬校验 | `references/endpoints_whitelist.yaml` | 28 端点的硬白名单 + Pre-call 4 步自检协议 |

**Step 3 — 构建最小调用计划**

- ✅ 优先使用最少端点完成任务，能用一个端点就不用两个
- ✅ 用户全景分析建议优先 `fetch_user_profile` 单点试探，再决定是否拉评论 / 帖子
- ❌ 禁止"先 head/tail 试运行"或"先调一个看看"等探索性调用

**Step 4 — 执行并验证**

- 调用前比对 `endpoints_whitelist.yaml` 完成 4 步 Pre-call 自检（路径 → method → 必填 → 写入确认）
- 收到 **404** → 必须先做 §3.1 (A) 防路径臆造自检（5 步）
- 收到 **400 / 422** → 必须先做 §3.1 (B) 防参数臆造自检（6 步）
- 收到 **业务 code != 0** → 读 `message_zh` 报告用户，**不重试**

### 高级使用

#### 链式调用图谱（Chain Recipes）

| 用户场景 | 链路 | 字段流 |
|---------|------|-------|
| 搜索 → 帖子详情 | `fetch_dynamic_search` → `fetch_post_details` | `query` → `post_id` |
| 查帖子 + 评论 + 回复 | `fetch_post_details` → `fetch_post_comments` → `fetch_comment_replies` | `post_id` + `cursor` 接力 |
| 查 Subreddit + Feed | `fetch_subreddit_info` → `fetch_subreddit_feed` → `fetch_post_details` | `subreddit_name` → `post_id` |
| 查 Subreddit + 设置 | `fetch_subreddit_info` → `fetch_subreddit_settings` | `subreddit_id`（t5_xxx）接力 |
| 查用户 → 帖子 + 评论 | `fetch_user_profile` → `fetch_user_posts` + `fetch_user_comments` + `fetch_user_active_subreddits` | `username` 复用 |
| Explore → Topic Feed | `fetch_explore_feed` → `fetch_topic_feed` | `topic_id` 接力 |
| 批量帖子精简数据 | `fetch_post_details_batch` → `fetch_generated_posts` | `post_ids` 复用，输出 LLM 友好结构 |

> ⚠️ **ID 陷阱**：Reddit 同时存在 `subreddit_id`（前缀 `t5_`，用于 settings / muted / community_highlights）与 `subreddit_name`（如 `AskReddit`，用于 Feed / info / channels），**两类 ID 不可互换**。

#### 防臆造自检清单（强制前置步骤）

**收到 404 时（A）**：
1. 路径白名单逐字符比对 → 不在清单中 STOP
2. Method 比对 → 不等 STOP
3. 参数键名比对（重点核对 `subreddit_id` vs `subreddit_name`）→ 有清单外参数 STOP
4. 资源 ID 来源溯源 → Agent 编造的 STOP
5. 全通过才判定"上游资源不存在"

**收到 400 / 422 时（B）**：
1. 参数名严格比对（`post_id` 不带 `t3_` 前缀；`subreddit_id` 必带 `t5_` 前缀）
2. 必填项齐全（`fetch_comment_replies` 需 `post_id` + `cursor` 双必填）
3. 类型与格式严格匹配（sort 枚举 / time_range 枚举）
4. 传参方式正确（query vs body）
5. 没有清单外的臆造参数（如把 Reddit 原生 API 的 `limit` 用到 MaxHub 的 `page_size`）
6. 全通过才按 `message_zh` 排查

#### Reddit Answers 精简数据建议

| 场景 | 推荐用法 |
|---|---|
| 给 LLM 做摘要 | 用 `fetch_generated_posts` / `fetch_generated_comments`，自动剥离冗余字段 |
| 全量审计 / 数据归档 | 用 `fetch_post_details_batch` / `fetch_post_details_batch_large`，保留全字段 |
| 单帖深读 | 用 `fetch_post_details`，含 `include_comment_id` 锚定具体评论 |

#### SKILL 版本更新

| 触发条件 | 推荐操作 |
|---------|---------|
| 合法路径持续 404 / 410 | `skillhub upgrade maxhub-reddit`（国内）或 `clawhub upgrade maxhub-reddit`（国际） |
| 用户问"版本是多少" | 当前版本 v3.7.2，访问 https://skillhub.cn/skills/maxhub-reddit |
| 多端点连续 410 | `skillhub upgrade maxhub-reddit --force` |
| 401 / 402 / 403 | **不是版本问题**，去 https://www.aconfig.cn 处理 |

### 常用命令速查表

| 场景 | 命令 |
|---|---|
| 查 API Key | `[ -n "${MAXHUB_API_KEY:-}" ] && echo "ok" \|\| echo "missing"` |
| 查帖子详情 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/reddit/app/fetch_post_details?post_id=xxx"` |
| 查帖子评论 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/reddit/app/fetch_post_comments?post_id=xxx"` |
| 查 Subreddit Feed | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/reddit/app/fetch_subreddit_feed?subreddit_name=AskReddit"` |
| 查用户资料 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/reddit/app/fetch_user_profile?username=xxx"` |
| 检查 SKILL 更新 | `skillhub info maxhub-reddit` 或 `clawhub info maxhub-reddit` |


### 📌 端到端使用示例（agent 快速上手）

**用户输入**：「帮我看 某个 subreddit 的热帖」

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

### 场景一：海外社区舆情监控

- **角色**：跨境品牌公关 / 舆情分析师
- **需求**：实时监控品牌相关 subreddit 与关键词下的负面 / 爆款帖子
- **使用方式**：`fetch_dynamic_search` 关键词搜索 → 取 post_id → `fetch_post_details` 取详情 + `fetch_post_comments` 深挖评论；并行 `fetch_subreddit_feed` 监控自有品牌专属版块
- **预期收益**：第一时间发现负面舆情与口碑爆款，关键事件响应提速

### 场景二：产品反馈与用户原声采集

- **角色**：海外 SaaS 产品经理 / 用户研究员
- **需求**：从 r/SaaS、r/productivity 等版块批量采集用户对产品类型的真实反馈
- **使用方式**：`fetch_subreddit_feed` 翻页取热门帖 → `fetch_post_details_batch` 批量补详情 → `fetch_generated_comments` 输出精简评论喂给 LLM 做主题聚类
- **预期收益**：构建可量化的用户原声库，反向输入产品迭代与营销文案

### 场景三：Reddit KOL / 优质用户追踪

- **角色**：海外 KOL 投放 / 社区营销
- **需求**：追踪垂类 subreddit 中的高活跃用户，评估其内容质量与受众影响力
- **使用方式**：从 `fetch_subreddit_feed` 抽取高赞帖作者 → `fetch_user_profile` + `fetch_user_active_subreddits` 看活跃度 → `fetch_user_posts` + `fetch_user_comments` + `fetch_user_trophies` 评估历史贡献
- **预期收益**：构建 KOL 评分体系，识别有真实影响力（非僵尸号）的合作候选

### 场景四：趋势话题挖掘与选题输入

- **角色**：内容运营 / 跨境媒体编辑
- **需求**：每日识别 Reddit 全站与垂类的趋势话题，输入到内容选题系统
- **使用方式**：`fetch_trending_searches` 取全站热搜词 → `fetch_explore_feed` 取多元话题 → `fetch_topic_feed` 按 topic_id 深挖 → 对热帖 `fetch_post_details` 取上下文
- **预期收益**：建立每日趋势话题简报，选题领先 24–48 小时，跨境媒体首发率提升

## 6. 项目架构

### 目录结构

```
maxhub-reddit/
├── SKILL.md                            # Skill 定义与使用文档（本文件）
├── README.md                           # 英文项目说明
├── README_CN.md                        # 中文项目说明
├── _meta.json                          # 版本元信息（version: 3.7.2）
└── references/
    ├── endpoints_whitelist.yaml        # 28 端点路径硬白名单 + Pre-call 4 步自检协议
    ├── param-mappings.md               # 中枢索引（全局红线 + 字段流字典 + 错误处理）
    ├── content.md                      # 内容域：Feed/帖子/评论/回复/精简数据（13 端点）
    ├── subreddit.md                    # 版块域：信息/样式/设置/Feed/Channels/静音（6 端点）
    ├── user.md                         # 用户域：资料/活跃社区/帖子/评论/奖杯（5 端点）
    └── search.md                       # 搜索域：自动补全/动态搜索/社区亮点/热门搜索（4 端点）
```

### 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 调用方式 | `curl` + Bearer Token | HTTP GET 请求，参数通过 query string 传递 |
| 数据接口 | MaxHub API | `https://www.aconfig.cn/api/v1/reddit/app/*`，通过 `MAXHUB_API_KEY` 鉴权 |
| 路径校验 | YAML 硬白名单 | `endpoints_whitelist.yaml` 提供 28 端点的逐字符校验 + 4 步 Pre-call 协议 |
| 错误处理 | 决策表 + 自检清单 | HTTP 状态码权威定义 + 防臆造自检（A/B 双轨）+ 端点替换矩阵 |
| 输出格式 | JSON Standard MaxHub Response | `{code, message, message_zh, data, cache_url}` |
| 更新通道 | SkillHub / ClawHub / GitHub | 国内 ⭐⭐⭐ SkillHub（腾讯云 CDN）/ 国际 ⭐⭐⭐ ClawHub / 降级 GitHub |

### API 覆盖范围

| 领域 | 端点数 | Reference 文件 |
|------|--------|---------------|
| 内容（Feed / Posts / Comments / Generated） | 13 | `content.md` |
| 版块（Subreddit） | 6 | `subreddit.md` |
| 用户（User） | 5 | `user.md` |
| 搜索（Search） | 4 | `search.md` |
| **合计** | **28** | — |

### 关键设计理念

- **防臆造四道闸**：白名单（endpoints_whitelist.yaml）→ 强标记（Full path）→ 禁止规则（Forbidden）→ 错误反馈（STOP）
- **ID 双轨制**：`subreddit_id`（t5_xxx）与 `subreddit_name`（AskReddit）严格区分，每个端点明确标注必填项类型
- **链式调用图谱**：字段流字典 + Chain Recipes + 跨 reference 链路三层联动，重点防护 post_id / cursor / subreddit ID 接力陷阱
- **错误处理契约**：HTTP 状态码权威定义 + §3.1 防臆造自检清单（A: 5 步 / B: 6 步）+ 端点替换矩阵
