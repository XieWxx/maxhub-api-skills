---
name: maxhub-pipixia
description: 皮皮虾（Pipixia）内容数据查询与轻量运营分析 skill，通过 MaxHub API 查询作品详情、统计、评论、首页流、搜索、热搜、话题和用户相关内容。适合内容研究、互动分析、热点追踪和素材筛选。包含 restricted 高风险能力 fetch_increase_post_view_count（增加浏览数/写操作），不属于纯只读 skill；agent 默认不得调用该能力，必须获得用户明确授权并提示平台 ToS 风险。所有请求发送到 https://www.aconfig.cn。
license: MIT-0
metadata:
  author: maxhub
  version: 3.8.0
  openclaw:
    capability: read_write_high_risk
    requires_confirmation:
    - restricted
    - write
    - non_idempotent
    - cookie_input
    - session_bootstrap
    - anti_bot_signature
    emoji: 🦐
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
    riskLevel: high
    defaultMode: recipes_first_restricted_confirm
    skillClass: maxhub-api-skill
    platform: pipixia
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
    - pipixia
    - 皮皮虾
    - 作品详情
    - 评论
    - 搜索
    - 热搜
    - 话题
    - 首页流
    - restricted
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

# 皮皮虾 数据助手

## 1. 简介

皮皮虾数据查询工具，通过 MaxHub API 接入字节跳动旗下搞笑短视频与段子社区皮皮虾，覆盖帖子详情、统计、评论、Home Feed、短剧 Feed、综合搜索、热搜词、热搜榜、Hashtag、短链、用户资料、用户作品 / 粉丝 / 关注等核心能力。专注服务于段子创作、短视频选题、搞笑内容研究与用户画像场景，帮助用户快速采集皮皮虾爆款数据、识别热门话题与高互动达人。

## 2. 详细功能

### 帖子内容

- 通过帖子标识直查帖子详情，含标题、正文、视频、图片与作者归属
- 拉取帖子统计数据，覆盖播放、点赞、评论、转发等核心互动指标
- 拉取帖子评论列表，作为段子真实共鸣度与槽点的一手参考

### Feed 流双链路

- 拉取综合首页推荐 Feed，聚合平台主推的搞笑短视频与图文段子
- 拉取短剧专区 Feed，单独定位短剧内容池并跟踪短剧赛道的爆款节奏
- 双链路可并行采集，互不干扰，适配「全站热门 + 垂类专区」的双视角分析

### 搜索与热搜

- 提供关键词综合搜索，按主题、品牌或人物聚合相关帖子内容
- 拉取热搜词列表，识别平台当前正在升温的关键词与流行梗
- 拉取热搜榜单与单个榜单的详情内容，定位结构化的官方热点排序
- 串联热搜词或榜单标题 → 搜索 → 帖子详情，复刻完整热点追溯链路

### Hashtag 深挖

- 拉取话题详情，含话题简介、累计内容数与基础热度指标
- 按话题拉取相关帖子列表，并支持按热门或最新排序观察话题结构
- 串联话题 → 帖子 → 评论，输出某个话题的完整内容生态切片

### 短链工具

- 将原始内容 URL 转换为平台风格的分享短链，便于在外部场景中传播
- 输出可直接复制粘贴的分享文本，加速运营素材与对外引流的整理
- 与帖子详情查询配合，形成「站内采集 → 站外分享」的闭环工作流

### 用户画像

- 查询用户资料，覆盖昵称、头像、简介、粉丝量与基础认证信息
- 拉取用户作品列表，按时间线观察其内容产出节奏与代表作
- 拉取用户的粉丝与关注列表，用于受众构成与圈层互动分析

### 写入接口隔离

- 提供单一标记为写入操作的浏览量上报接口，与所有只读查询严格隔离
- 调用前强制要求用户对参数进行明确确认，杜绝误触发的副作用
- 对该接口约束更严格的失败重试规则，避免重复写入造成的异常增长

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
| 🔒 只读优先 | 默认仅用于数据查询；`fetch_increase_post_view_count` 为写入接口，**须用户明确确认参数后调用** |
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
| 查帖子 / 评论 / Feed / 搜索 / Hashtag / 短链 | `references/post.md` | 帖子详情、统计、评论、Home Feed、短剧 Feed、搜索、热搜词、热搜榜、Hashtag、短链、view_count 写入（13 端点） |
| 查用户 / 作品 / 粉丝 / 关注 | `references/user.md` | 用户资料、作品列表、粉丝、关注（4 端点） |
| 跨端点参数查询 / 字段流追溯 | `references/param-mappings.md` | 全局红线 + 端点路由 + 字段流字典 + 错误处理总览 |
| 路径白名单硬校验 | `references/endpoints_whitelist.yaml` | 17 个端点的硬白名单 + Pre-call 4 步自检协议 |
| SKILL 版本检查与升级 | `references/update.md` | SkillHub / ClawHub / GitHub 三通道更新 |

**Step 3 — 构建最小调用计划**

- ✅ 优先使用最少端点完成任务，能用一个端点就不用两个
- ✅ 写入端点（`fetch_increase_post_view_count`）调用前**必须**让用户确认参数
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
| Feed → 帖子详情 → 评论 | `fetch_home_feed` → `fetch_post_detail` → `fetch_post_comment_list` | `cell_id` 复用 |
| 帖子 → 统计数据 | `fetch_post_detail` → `fetch_post_statistics` | `cell_id` 复用 |
| 关键词 → 搜索 → 详情 | `fetch_search` → `fetch_post_detail` | `keyword` → `cell_id` |
| 热搜词 → 搜索 → 详情 | `fetch_hot_search_words` → `fetch_search` → `fetch_post_detail` | 热词 → `keyword` → `cell_id` |
| 热搜榜 → 榜详情 | `fetch_hot_search_board_list` → `fetch_hot_search_board_detail` | `block_type` 接力 |
| Hashtag → 帖列表 → 详情 | `fetch_hashtag_detail` → `fetch_hashtag_post_list` → `fetch_post_detail` | `hashtag_id` → `cell_id` |
| 用户 → 作品 → 粉丝 / 关注 | `fetch_user_info` → `fetch_user_post_list` + `fetch_user_follower_list` + `fetch_user_following_list` | `user_id` 复用 |
| 短剧专区 → 详情 | `fetch_home_short_drama_feed` → `fetch_post_detail` | `cell_id` 接力 |

#### 防臆造自检清单（强制前置步骤）

**收到 404 时（A）**：
1. 路径白名单逐字符比对 → 不在清单中 STOP
2. Method 比对 → 不等 STOP
3. 参数键名比对 → 有清单外参数 STOP
4. 资源 ID 来源溯源 → Agent 编造的 STOP
5. 全通过才判定"上游资源不存在"

**收到 400 / 422 时（B）**：
1. 参数名严格比对（`cell_id` / `hashtag_id` / `user_id` / `keyword` / `block_type` 不可混用）
2. 必填项齐全
3. 类型与格式严格匹配（pattern / enum）
4. 传参方式正确（query vs body）
5. 没有 IN 表外的臆造参数
6. 全通过才按 `message_zh` 排查

#### 写入端点最佳实践（仅适用 fetch_increase_post_view_count）

- **风险等级**：`risk: medium` / `write_operation: true`
- **调用前**：必须把 `cell_id` 与 `cell_type` 明确告知用户并获得确认
- **重试规则**：5xx 失败重试 ≤ 1 次，避免重复增长 view_count 引起异常

#### SKILL 版本更新

| 触发条件 | 推荐操作 |
|---------|---------|
| 合法路径持续 404 / 410 | `skillhub upgrade maxhub-pipixia`（国内）或 `clawhub upgrade maxhub-pipixia`（国际） |
| 用户问"版本是多少" | 当前版本 v3.7.2，访问 https://skillhub.cn/skills/maxhub-pipixia |
| 多端点连续 410 | `skillhub upgrade maxhub-pipixia --force` |
| 401 / 402 / 403 | **不是版本问题**，去 https://www.aconfig.cn 处理 |

### 常用命令速查表

| 场景 | 命令 |
|---|---|
| 查 API Key | `[ -n "${MAXHUB_API_KEY:-}" ] && echo "ok" \|\| echo "missing"` |
| 查帖子详情 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/pipixia/app/fetch_post_detail?cell_id=xxx"` |
| 查 Home Feed | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/pipixia/app/fetch_home_feed"` |
| 查热搜榜列表 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/pipixia/app/fetch_hot_search_board_list"` |
| 查用户作品 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/pipixia/app/fetch_user_post_list?user_id=xxx"` |
| 检查 SKILL 更新 | `skillhub info maxhub-pipixia` 或 `clawhub info maxhub-pipixia` |


### 📌 端到端使用示例（agent 快速上手）

**用户输入**：「帮我看 皮皮虾某个 cell_id 作品的详情」

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

### 场景一：段子创作者寻找爆款选题

- **角色**：搞笑内容创作者
- **需求**：从皮皮虾 Home Feed 与热搜榜中识别近期爆款段子结构
- **使用方式**：`fetch_home_feed` + `fetch_hot_search_board_list` 拉热门 → `fetch_hot_search_board_detail` 取榜内贴 → 链式调 `fetch_post_detail` + `fetch_post_statistics` 提取互动指标
- **预期收益**：高效复用爆款叙事结构，提升单条作品互动率 2 倍以上

### 场景二：短视频团队挖掘选题与素材

- **角色**：短视频内容运营
- **需求**：从皮皮虾搜索 + Hashtag 中批量采集垂类素材
- **使用方式**：`fetch_hashtag_detail` → `fetch_hashtag_post_list`（sort_type=hot）→ 批量取 `cell_id` → `fetch_post_detail` 提取标题 + 视频结构
- **预期收益**：构建分类素材库，加速二创短视频生产流水线

### 场景三：用户画像分析师研究皮皮虾达人

- **角色**：MCN 数据研究员
- **需求**：分析皮皮虾达人的内容产出节奏与粉丝黏性
- **使用方式**：`fetch_user_info` → `fetch_user_post_list` 拉作品 → `fetch_user_follower_list` 拉粉丝构成
- **预期收益**：识别真实活跃达人，过滤刷量账号，输入达人合作决策

### 场景四：舆情研究员监测搞笑赛道热点

- **角色**：内容生态研究员
- **需求**：周期性监测皮皮虾热搜词与热搜榜，识别新兴梗与话题
- **使用方式**：`fetch_hot_search_words` + `fetch_hot_search_board_list` 定时拉取 → 关键词进入 `fetch_search` → `fetch_post_detail` 验证内容形态
- **预期收益**：搞笑赛道的趋势日报输出，输入内容选题与广告投放节奏

## 6. 项目架构

### 目录结构

```
maxhub-pipixia/
├── SKILL.md                            # Skill 定义与使用文档（本文件）
├── README.md                           # 英文项目说明
├── README_CN.md                        # 中文项目说明
├── _meta.json                          # 版本元信息（version: 3.7.2）
└── references/
    ├── endpoints_whitelist.yaml        # 17 端点路径硬白名单 + Pre-call 4 步自检协议
    ├── param-mappings.md               # 中枢索引（全局红线 + 字段流字典 + 错误处理）
    ├── post.md                         # 帖子域：详情/统计/评论/Feed/搜索/Hashtag/短链/写入（13 端点）
    ├── user.md                         # 用户域：资料/作品/粉丝/关注（4 端点）
    └── update.md                       # SKILL 更新机制（SkillHub / ClawHub / GitHub）
```

### 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 调用方式 | `curl` + Bearer Token | HTTP GET 请求，参数通过 query string 传递 |
| 数据接口 | MaxHub API | `https://www.aconfig.cn/api/v1/pipixia/app/*`，通过 `MAXHUB_API_KEY` 鉴权 |
| 路径校验 | YAML 硬白名单 | `endpoints_whitelist.yaml` 提供 17 端点的逐字符校验 + 4 步 Pre-call 协议 |
| 错误处理 | 决策表 + 自检清单 | HTTP 状态码权威定义 + 防臆造自检（A/B 双轨）+ 写入端点重试规则 |
| 输出格式 | JSON Standard MaxHub Response | `{code, message, message_zh, data, cache_url}` |
| 更新通道 | SkillHub / ClawHub / GitHub | 国内 ⭐⭐⭐ SkillHub（腾讯云 CDN）/ 国际 ⭐⭐⭐ ClawHub / 降级 GitHub |

### API 覆盖范围

| 领域 | 端点数 | Reference 文件 |
|------|--------|---------------|
| 帖子（Post） | 13 | `post.md` |
| 用户（User） | 4 | `user.md` |
| **合计** | **17** | — |

### 关键设计理念

- **防臆造四道闸**：白名单（endpoints_whitelist.yaml）→ 强标记（Full path）→ 禁止规则（Forbidden）→ 错误反馈（STOP）
- **写入端点隔离**：`fetch_increase_post_view_count` 单独标记 + 强制确认 + 5xx ≤ 1 次重试，避免重复扣配额或异常增长
- **链式调用图谱**：字段流字典（`cell_id` / `hashtag_id` / `user_id` / `keyword` / `block_type`）+ Chain Recipes + 跨 reference 链路三层联动
- **错误处理契约**：HTTP 状态码权威定义 + 防臆造自检清单（A: 5 步 / B: 6 步）+ 写入端点重试规则
