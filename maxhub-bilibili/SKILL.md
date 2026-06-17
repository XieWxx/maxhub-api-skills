---
name: maxhub-bilibili
description: Bilibili（B 站）公开数据查询与内容分析 skill，通过 MaxHub API 查询视频详情、播放信息、字幕、分 P、BV/AV 转换、UP 主资料、投稿、动态、搜索、热搜、评论弹幕、直播间与公开收藏夹等 41 个端点。适合内容选题、UP 主画像、番剧/字幕研究、互动分析和直播数据看板。默认以只读公开数据为主；大会员播放地址属于需 cookie 的 authenticated 高风险能力，agent 必须按 restricted/confirmation 规则确认后再调用。所有请求发送到 https://www.aconfig.cn。
license: MIT-0
metadata:
  author: maxhub
  version: 3.8.0
  openclaw:
    capability: read_write_authenticated
    requires_confirmation:
    - write
    - non_idempotent
    - cookie_input
    emoji: 📺
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
    riskLevel: medium
    defaultMode: recipes_first_confirm_cookie
    skillClass: maxhub-api-skill
    platform: bilibili
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
    - bilibili
    - B站
    - 哔哩哔哩
    - 视频详情
    - UP主
    - 评论
    - 弹幕
    - 字幕
    - 番剧
    - 直播
    - 搜索
    - 热搜
    - 收藏夹
    - 内容分析
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

# B站 数据助手

## 1. 简介

B 站（Bilibili）数据查询与分析工具，通过 MaxHub API 接入 B 站全平台公开数据，覆盖视频详情、UP 主画像、关键词搜索、评论弹幕、直播间数据、收藏夹等六大领域共 41 个端点（含番剧 / BV-AV 转换 / 字幕 / 分 P 等 B 站特色能力）。专注服务于 B 站 UP 主、二次元内容创作者、番剧追踪者、字幕弹幕研究者与直播数据团队，帮助用户高效采集 B 站数据、辅助选题与互动分析。

## 2. 详细功能

### 视频数据
- 查询 B 站视频的完整详情，包含标题、封面、简介、UP 主、播放、点赞、投币、收藏、转发、弹幕等核心指标
- 同时支持通过 BV 号与 AV 号查询，覆盖 App 端与 Web 端两套数据视角
- 拉取视频播放信息与播放地址，便于素材归档与清晰度选择
- 拉取大会员专享视频的高清晰度播放地址
- 获取视频字幕列表与多语言字幕内容
- 获取视频分 P 列表，支持多 P 长视频与番剧的精细化处理
- 完成 BV 号与 AV 号的双向互转，统一上下游接口的标识体系

### UP 主与用户
- 通过 B 站分享链接、b23 短链解析得到 UP 主的用户标识
- 查询 UP 主主页信息，包含昵称、签名、头像、等级、认证、地区等基础资料
- 拉取 UP 主的投稿统计数据，包含视频数、粉丝数、获赞数等
- 拉取 UP 主的关系数据，包含粉丝、关注、黑名单计数
- 浏览 UP 主的全部投稿视频列表
- 拉取用户的动态列表与单条动态详情，覆盖图文、视频、转发等多种动态类型

### 搜索与发现
- 执行 B 站综合搜索，一次返回视频、UP 主、番剧、影视等混合结果
- 按类型执行分类搜索，单独检索视频、用户或专栏
- 浏览首页推荐流、热门推荐流与社区热门内容
- 浏览影视区与番剧区的分类标签，便于按内容形态筛选

### 热榜与趋势
- 拉取 B 站全站热搜榜，洞察当前热点话题与流行词

### 评论与弹幕
- 拉取视频一级评论列表，覆盖 App 端与 Web 端
- 接力拉取每条评论下的二级回复，构建完整评论树
- 拉取视频的全量弹幕数据，复原视频实时互动氛围

### 直播数据
- 查询直播间详情，包含主播信息、直播标题、封面、状态与互动数据
- 拉取直播间的录播视频列表，便于事后回看与素材采集
- 浏览全部直播分区目录，并按分区拉取主播列表

### 收藏夹
- 拉取指定用户公开的收藏夹列表
- 拉取单个收藏夹内的全部视频明细

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
| 🔒 只读 | 本技能仅用于数据查询和分析，**不执行写入 / 账户 / 发布操作** |
| 🚫 禁止臆造路径 | 仅使用 `references/endpoints_whitelist.yaml` 中的端点，**不得自行拼接、改版本号、加路径段** |
| 📋 数据流向第三方 | 所有请求发送至 `https://www.aconfig.cn`，请使用独立测试账号并定期轮换 API Key |
| 🔑 凭证保护 | 不暴露 API Key、Cookie、Token 至日志或对话 |
| ⚠️ BV / AV 严格区分 | 视频接口区分 `bvid` 与 `aid`，**不得混用**，需要时通过专用转换端点处理 |

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
| 查视频详情 / 播放 / 字幕 / 分 P | `references/video.md` | 视频详情、播放 URL、字幕、分 P 信息、BV / AV 转换（11 端点） |
| 查 UP 主 / 用户 / 动态 | `references/user.md` | 用户信息、粉丝 / 关注、投稿列表、动态详情（10 端点） |
| 搜索 / 热榜 / 推荐 / 番剧 | `references/search.md` | 综合搜索、分类搜索、热榜、首页推荐、番剧影视（9 端点） |
| 查评论 / 弹幕 / 回复 | `references/comments.md` | 视频评论、二级回复、弹幕（5 端点） |
| 查直播 / 直播间 | `references/live.md` | 直播间信息、直播流、分区主播、分区列表（4 端点） |
| 查收藏夹 | `references/collections.md` | 用户收藏夹、收藏夹内视频（2 端点） |
| 跨端点参数查询 / 字段流追溯 | `references/param-mappings.md` | 全局红线 + 端点路由 + 字段流字典 + 错误处理总览 + 替换矩阵 |
| 路径白名单硬校验 | `references/endpoints_whitelist.yaml` | 41 个端点的硬白名单 + Pre-call 4 步自检协议 |
| SKILL 版本检查与升级 | `references/update.md` | SkillHub / ClawHub / GitHub 三通道更新 |

**Step 3 — 构建最小调用计划**

- ✅ 优先使用最少端点完成任务，能用一个端点就不用两个
- ✅ 涉及 BV / AV 转换时**必须**先调专用转换端点，再传入下游
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
| 查视频 + 评论 | `video.md` → `comments.md` | `bvid` / `aid` 接力 |
| BV → AV 转换 | `video.md` (BV/AV 转换) → 后续端点 | `bvid` ↔ `aid` |
| 查 UP 主 → 作品 | `user.md` → `user.md` (videos) | `mid` 接力 |
| 查收藏夹 | `user.md` → `collections.md` (用户收藏夹 → 夹内视频) | `mid` → `fid` |
| 查直播 + 数据 | `live.md` → `live.md` (stream) | `room_id` 接力 |
| 搜索 → 视频详情 | `search.md` → `video.md` | `bvid` / `aid` 接力 |
| UP 主全面分析 | `user.md` → `user.md` (stats+relation+videos) → `collections.md` | `mid` 复用 |
| 番剧追踪 | `search.md` (番剧搜索) → `video.md` (分 P / 字幕) | `season_id` / `bvid` |

#### 防臆造自检清单（强制前置步骤）

**收到 404 时（A）**：
1. 路径白名单逐字符比对 → 不在清单中 STOP
2. Method 比对 → 不等 STOP
3. 参数键名比对 → 有清单外参数 STOP（特别注意 BV / AV 不混用）
4. 资源 ID 来源溯源 → Agent 编造的 STOP
5. 全通过才判定 "上游资源不存在"

**收到 400 / 422 时（B）**：
1. 参数名严格比对（大小写 / 缩写 / 复数）
2. 必填项齐全 + oneOf 二选一逻辑（如 `bvid` 与 `aid` 二选一）
3. 类型与格式严格匹配（pattern / enum）
4. 传参方式正确（query vs body）
5. 没有 IN 表外的臆造参数
6. 全通过才按 `message_zh` 排查

#### SKILL 版本更新

| 触发条件 | 推荐操作 |
|---------|---------|
| 合法路径持续 404 / 410 | `skillhub upgrade maxhub-bilibili`（国内）或 `clawhub upgrade maxhub-bilibili`（国际） |
| 用户问 "版本是多少" | 当前版本 v3.7.2，访问 https://skillhub.cn/skills/maxhub-bilibili |
| 多端点连续 410 | `skillhub upgrade maxhub-bilibili --force` |
| 401 / 402 / 403 | **不是版本问题**，去 https://www.aconfig.cn 处理 |

### 常用命令速查表

| 场景 | 命令 |
|---|---|
| 查 API Key | `[ -n "${MAXHUB_API_KEY:-}" ] && echo "ok" \|\| echo "missing"` |
| 查视频详情 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/bilibili/web/fetch_video_detail?bv_id=BVxxx"` |
| 查视频评论 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/bilibili/web/fetch_video_comments?bv_id=BVxxx"` |
| 查 UP 主投稿 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/bilibili/web/fetch_user_videos?mid=xxx"` |
| 检查 SKILL 更新 | `skillhub info maxhub-bilibili` 或 `clawhub info maxhub-bilibili` |


### 📌 端到端使用示例（agent 快速上手）

**用户输入**：「帮我看 BV1xxxxxx 这个视频的评论」

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

### 场景一：UP 主选题与作品分析

- **角色**：B 站 UP 主 / 内容运营
- **需求**：分析同分区头部 UP 主作品节奏与互动表现，寻找选题灵感
- **使用方式**：调用 `search.md` 拉分类热榜 → 取 `mid` → `user.md` 拉投稿列表 → `video.md` 取视频详情 → `comments.md` 抽样评论
- **预期收益**：构建赛道头部 UP 矩阵分析报表，提炼标题、封面、节奏的爆款共性

### 场景二：番剧追踪与字幕采集

- **角色**：番剧研究者 / 字幕组
- **需求**：批量追踪番剧更新，采集分 P 与多语言字幕用于研究分析
- **使用方式**：`search.md` 番剧搜索 → 取 `season_id` / `bvid` → `video.md` 拉取分 P 信息 + 字幕
- **预期收益**：自动化番剧元数据采集流程，构建字幕语料库

### 场景三：弹幕与评论数据研究

- **角色**：内容数据分析师 / 学术研究者
- **需求**：采集热门视频的弹幕与评论文本，做情感与话题分析
- **使用方式**：`search.md` / 热榜 → 取 `bvid` → `comments.md` 拉评论 + 弹幕 → 本地 NLP 分析
- **预期收益**：建立 B 站弹幕 / 评论文本数据集，支持二次元话题与情感传播研究

### 场景四：B 站直播数据监控

- **角色**：直播运营 / 数据团队
- **需求**：实时监控分区主播热度与直播流状态
- **使用方式**：`live.md` 拉分区列表 → 分区主播 → 取 `room_id` → 直播间信息 + 直播流
- **预期收益**：构建分区直播实时看板，识别上升期主播并辅助签约决策

## 6. 项目架构

### 目录结构

```
maxhub-bilibili/
├── SKILL.md                            # Skill 定义与使用文档（本文件）
├── README.md                           # 英文项目说明
├── README_CN.md                        # 中文项目说明
├── _meta.json                          # 版本元信息（version: 3.7.2）
└── references/
    ├── endpoints_whitelist.yaml        # 41 端点路径硬白名单 + Pre-call 4 步自检协议
    ├── param-mappings.md               # 中枢索引（全局红线 + 字段流字典 + 错误处理 + 替换矩阵）
    ├── video.md                        # 视频域：详情/播放/字幕/分 P/BV-AV 转换（11 端点）
    ├── user.md                         # 用户域：UP 主信息/粉丝/投稿/动态（10 端点）
    ├── search.md                       # 搜索域：综合/分类/热榜/推荐/番剧（9 端点）
    ├── comments.md                     # 评论域：评论/二级回复/弹幕（5 端点）
    ├── live.md                         # 直播域：直播间/直播流/分区主播（4 端点）
    ├── collections.md                  # 收藏夹域：用户收藏夹/夹内视频（2 端点）
    └── update.md                       # SKILL 更新机制（SkillHub / ClawHub / GitHub）
```

### 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 调用方式 | `curl` + Bearer Token | HTTP GET / POST 请求，参数通过 query string 或 JSON body 传递 |
| 数据接口 | MaxHub API | `https://www.aconfig.cn/api/v1/bilibili/*`，通过 `MAXHUB_API_KEY` 鉴权 |
| 路径校验 | YAML 硬白名单 | `endpoints_whitelist.yaml` 提供 41 端点的逐字符校验 + 4 步 Pre-call 协议 |
| 错误处理 | 决策表 + 自检清单 | HTTP 状态码权威定义 + 防臆造自检（A/B 双轨）+ 重试策略矩阵 |
| 输出格式 | JSON Standard MaxHub Response | `{code, message, message_zh, data, cache_url}` |
| 更新通道 | SkillHub / ClawHub / GitHub | 国内 ⭐⭐⭐ SkillHub（腾讯云 CDN）/ 国际 ⭐⭐⭐ ClawHub / 降级 GitHub |

### API 覆盖范围

| 领域 | 端点数 | Reference 文件 |
|------|--------|---------------|
| 视频（Video） | 11 | `video.md` |
| 用户（User） | 10 | `user.md` |
| 搜索（Search） | 9 | `search.md` |
| 评论（Comments） | 5 | `comments.md` |
| 直播（Live） | 4 | `live.md` |
| 收藏夹（Collections） | 2 | `collections.md` |
| **合计** | **41** | — |

### 关键设计理念

- **防臆造四道闸**：白名单（endpoints_whitelist.yaml）→ 强标记（Full path）→ 禁止规则（Forbidden）→ 错误反馈（STOP）
- **Agent 友好 7 大原则**：结构胜于叙述、明确指令优于建议、单一来源、词法稳定性、低 token 密度、边界显式声明、错误处理是契约
- **链式调用图谱**：字段流字典 + Chain Recipes + 跨 reference 链路三层联动，杜绝 Agent 编造字段名
- **错误处理契约**：HTTP 状态码权威定义 + §3.1 防臆造自检清单（A: 5 步 / B: 6 步）+ 重试策略矩阵 + 端点替换矩阵