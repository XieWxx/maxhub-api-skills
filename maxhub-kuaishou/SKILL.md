---
name: maxhub-kuaishou
description: 快手（Kuaishou）公开数据查询与短视频分析 skill，通过 MaxHub API 查询作品详情、作者主页、评论、搜索、热榜、直播和相关内容。适合快手内容选题、达人分析、作品互动追踪、热门趋势监控和运营复盘。默认 read-only；agent 应按 recipes 选择单次或链式调用，使用字段流字典传递 photo_id/user_id 等参数，禁止自行拼接路径或猜测参数。所有请求发送到 https://www.aconfig.cn。
license: MIT-0
metadata:
  author: maxhub
  version: 3.8.0
  openclaw:
    capability: read_only
    requires_confirmation:
    - non_idempotent
    - cookie_input
    emoji: 🎬
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
    platform: kuaishou
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
    - kuaishou
    - 快手
    - 短视频
    - 作品详情
    - 作者
    - 评论
    - 搜索
    - 热榜
    - 直播
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

# 快手 数据助手

## 1. 简介

快手数据查询工具，通过 MaxHub API 接入快手平台 App 端与 Web 端双链路，覆盖短视频详情、批量查询、链接解析、用户资料、投稿与收藏、视频评论与子回复、综合搜索、热榜矩阵、直播信息与回放等全部能力。专注服务于快手内容创作者、直播带货分析师、KOL 投放运营、短剧追踪团队与本地生活商家，帮助用户快速锁定爆款视频、量化主播带货能力、追踪热榜走势。

## 2. 详细功能

### 视频数据
- 查询单条快手短视频完整详情，覆盖播放、点赞、评论、转发等核心统计
- 支持通过 photo_id、视频 URL、分享文案三种方式定位视频
- 支持视频批量查询，一次性获取多条视频结构化数据
- 同时提供 App 端与 Web 端两路视频详情接口，互为备份与降级

### 分享链接解析与生成
- 反解快手分享口令文案，识别其中的视频或用户资源
- 通过分享 URL 直接查询对应视频详情
- 生成快手 App 端短链，便于回链分享
- 生成 Web 端短链，覆盖网页传播场景
- 通过分享链接反查目标用户 ID，闭环用户画像采集

### 用户画像
- 查询用户基础资料卡，含粉丝、关注、作品数等核心字段
- 拉取用户投稿视频列表，支持翻页采集全部历史作品
- 拉取用户热门作品，识别账号代表作
- 查询用户公开收藏列表
- 同时提供 App 端与 Web 端用户接口，覆盖不同数据丰富度

### 评论与回复
- 拉取视频一级评论列表，支持游标翻页
- 拉取指定一级评论下的二级回复链路
- App 端与 Web 端均提供独立评论接口，可按场景择优
- 支持评论作者、点赞数、时间戳等结构化字段提取

### 热榜矩阵
- 查询热榜分类列表，了解平台当下榜单维度
- 拉取指定热榜分类的详细内容
- 查询热搜人物榜单，捕捉上升期账号
- 提供 Web 端独立热榜，与 App 端互为补充
- 支持话题 Tag 搜索与 Tag 下视频流采集
- 提供推荐 Feed，洞察平台分发偏好

### 直播能力
- 查询用户当前直播间实时状态与基础信息
- 拉取直播总榜，识别头部主播
- 拉取购物榜、品牌榜，定位带货能力突出的账号
- 拉取音乐榜，发现热门 BGM 与音乐主播
- 查询用户历史直播回放记录，分析直播节奏与品类

### 搜索能力
- 提供综合搜索，一次返回视频、用户、直播等多类型结果
- 支持视频、用户、图集、直播、音乐、Tag 多种垂直搜索
- 支持按发布时间、时长、性别等条件过滤
- 支持搜索结果排序，定位最新或最热内容

### 双端接口并行
- 业务覆盖 App 端与 Web 端两条独立链路
- 两端接口字段互补，单端不可用时可降级切换
- 不同端的入口能力各有侧重，可按业务场景择优组合

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
| 🚫 禁止臆造路径 | 仅使用 `references/endpoints_whitelist.yaml` 中的端点，**不得自行拼接、改 app/web 段、加路径** |
| 📋 数据流向第三方 | 所有请求发送至 `https://www.aconfig.cn`，请使用独立测试账号并定期轮换 API Key |
| 🔑 凭证保护 | 不暴露 API Key、Cookie、Token 至日志或对话 |
| 🔀 端不互通 | App 端与 Web 端端点参数不兼容，**禁止跨端套用参数名** |

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
| 查视频 / 批量 / 分享链接解析 / 短链生成 | `references/video.md` | 视频详情、批量查询、链接解析、分享链接生成（8 端点） |
| 查用户 / 投稿 / 热门 / 收藏 / 反查 user_id | `references/user.md` | 用户信息、投稿列表、热门作品、收藏、share_link 反查（6 端点） |
| 搜索 / 热榜 / 推荐 / 话题 Tag | `references/search.md` | 综合搜索、分类搜索、热榜、推荐 Feed、Tag Feed（14 端点） |
| 查评论 / 二级回复 | `references/comments.md` | 视频一级评论、二级回复（4 端点） |
| 查直播 / 榜单 / 回放 | `references/live.md` | 直播信息、直播榜、购物榜、品牌榜、音乐榜、直播回放（6 端点） |
| 跨端点参数查询 / 字段流追溯 | `references/param-mappings.md` | 全局红线 + 端点路由 + App/Web 字段流字典 + 错误处理总览 |
| 路径白名单硬校验 | `references/endpoints_whitelist.yaml` | 38 端点的硬白名单 + Pre-call 4 步自检协议 |

**Step 3 — 构建最小调用计划**

- ✅ 优先使用最少端点完成任务，能用一个端点就不用两个
- ✅ App 与 Web 切换时**必须**重新读取该端的 reference，禁止套用对端参数
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
| 查视频 + 评论 + 回复 | `app_fetch_one_video` → `app_fetch_video_comment` → `app_fetch_video_sub_comments` | `photo_id` → `root_comment_id` 接力 |
| 搜索 → 视频详情 | `app_search_video_v2` → `app_fetch_one_video` | `photo_id` 复用 |
| 查用户 → 投稿 + 热门 | `app_fetch_one_user_v2` → `app_fetch_user_post_v2` + `app_fetch_user_hot_post` | `user_id` 复用 |
| 查用户 → 直播 + 回放 | `web_fetch_user_info` → `app_fetch_user_live_info` + `web_fetch_user_live_replay` | `user_id` 复用 |
| 热榜 → 详情 | `app_fetch_hot_board_categories` → `app_fetch_hot_board_detail` → `app_fetch_one_video` | `boardId` → `photo_id` |
| 分享文案 → 视频 | `app_fetch_one_video_by_url` → `app_fetch_one_video` | `share_text` → `photo_id` |
| share_link → 用户全景 | `web_fetch_get_user_id` → `web_fetch_user_info` → `web_fetch_user_collect` | `share_link` → `user_id` |

#### 防臆造自检清单（强制前置步骤）

**收到 404 时（A）**：
1. 路径白名单逐字符比对（重点核对 `app/` vs `web/` 段）→ 不在清单中 STOP
2. Method 比对 → 不等 STOP
3. 参数键名比对 → 有清单外参数 STOP
4. 资源 ID 来源溯源 → Agent 编造的 STOP
5. 全通过才判定"上游资源不存在"

**收到 400 / 422 时（B）**：
1. 参数名严格比对（`photo_id` vs `photoId` / `pcursor` 必须小写）
2. 必填项齐全（评论二级回复需 `photo_id` + `root_comment_id` 双必填）
3. 类型与格式严格匹配（pcursor 字符串、boardType 枚举）
4. 传参方式正确（query vs body）
5. 没有清单外的臆造参数（如 App 的 `pcursor` 不能改成 Web 的某些游标命名）
6. 全通过才按 `message_zh` 排查

#### App / Web 双端选型建议

| 维度 | App 端 | Web 端 |
|---|---|---|
| 端点数量 | 25+ | 13+ |
| 数据丰富度 | 最完整（评论、热榜、搜索、直播榜全覆盖） | 偏轻量（视频详情、用户、回放、Web 热榜） |
| 必填参数 | 多以 `photo_id` / `user_id` 为主 | 含 `share_text` / `share_link` / `url` 解析能力 |
| 推荐场景 | 数据采集主链路 | 分享链接反查与备选降级 |

#### SKILL 版本更新

| 触发条件 | 推荐操作 |
|---------|---------|
| 合法路径持续 404 / 410 | `skillhub upgrade maxhub-kuaishou`（国内）或 `clawhub upgrade maxhub-kuaishou`（国际） |
| 用户问"版本是多少" | 当前版本 v3.7.2，访问 https://skillhub.cn/skills/maxhub-kuaishou |
| 多端点连续 410 | `skillhub upgrade maxhub-kuaishou --force` |
| 401 / 402 / 403 | **不是版本问题**，去 https://www.aconfig.cn 处理 |

### 常用命令速查表

| 场景 | 命令 |
|---|---|
| 查 API Key | `[ -n "${MAXHUB_API_KEY:-}" ] && echo "ok" \|\| echo "missing"` |
| 查视频详情 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/kuaishou/app/fetch_one_video?photo_id=xxx"` |
| 查视频评论 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/kuaishou/app/fetch_video_comment?photo_id=xxx"` |
| 综合搜索 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/kuaishou/app/search_comprehensive?keyword=xxx"` |
| 查直播榜 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/kuaishou/app/fetch_live_top_list"` |
| 检查 SKILL 更新 | `skillhub info maxhub-kuaishou` 或 `clawhub info maxhub-kuaishou` |


### 📌 端到端使用示例（agent 快速上手）

**用户输入**：「帮我看 快手某个 photo_id 的评论」

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

### 场景一：快手内容创作者寻找爆款规律

- **角色**：快手短视频创作者
- **需求**：分析同领域热门作品的标题、时长、配乐、互动率，提炼可复用的爆款模板
- **使用方式**：`app_search_comprehensive` 关键词搜索 → 取 `photo_id` → 链式调 `app_fetch_one_video` 取详情；对评论 Top 视频再 `app_fetch_video_comment` 抽取高频用户反馈
- **预期收益**：1 小时内梳理 50+ 同类爆款共性，输出脚本与配乐选型建议

### 场景二：直播带货能力分析

- **角色**：MCN 机构 / 品牌方直播投放
- **需求**：评估候选主播的直播带货能力、品牌榜表现、历史回放节奏
- **使用方式**：`app_fetch_shopping_top_list` + `app_fetch_brand_top_list` 锁定头部主播 → `app_fetch_user_live_info` 取实时直播间 → `web_fetch_user_live_replay` 拉历史回放分析时长与品类
- **预期收益**：基于榜单 + 实时 + 回放三维数据筛主播，避免凭 GMV 单一指标决策

### 场景三：KOL 投放与竞品监控

- **角色**：品牌投放运营
- **需求**：跟踪 50 个候选快手 KOL 的近期视频表现与粉丝增长
- **使用方式**：批量 `web_fetch_user_info` 取粉丝数 → `app_fetch_user_post_v2` 翻页采集近期投稿 → `app_fetch_one_video` 补充视频详情字段，统计平均播放与互动
- **预期收益**：可量化对比的 KOL 看板，识别上升期账号优先投放

### 场景四：短剧 / 话题趋势追踪

- **角色**：内容选题策划
- **需求**：追踪快手热搜、Tag 话题、热榜分类下的视频流，识别下一个风口
- **使用方式**：`app_fetch_hot_board_categories` → `app_fetch_hot_board_detail` 拉每个分类详情；对话题用 `app_search_tag` → `app_fetch_tag_feed` 抓取 Tag 下视频
- **预期收益**：第一时间捕捉短剧、网梗、地域话题的爆发节点，选题领先一周

## 6. 项目架构

### 目录结构

```
maxhub-kuaishou/
├── SKILL.md                            # Skill 定义与使用文档（本文件）
├── README.md                           # 英文项目说明
├── README_CN.md                        # 中文项目说明
├── _meta.json                          # 版本元信息（version: 3.7.2）
└── references/
    ├── endpoints_whitelist.yaml        # 38 端点路径硬白名单 + Pre-call 4 步自检协议
    ├── param-mappings.md               # 中枢索引（全局红线 + 字段流字典 + 错误处理 + App/Web 差异）
    ├── video.md                        # 视频域：详情/批量/链接解析/短链生成（8 端点）
    ├── user.md                         # 用户域：资料/投稿/热门/收藏/反查（6 端点）
    ├── search.md                       # 搜索域：综合/分类/热榜/Feed/Tag（14 端点）
    ├── comments.md                     # 评论域：一级评论/二级回复（4 端点）
    └── live.md                         # 直播域：直播信息/榜单/回放（6 端点）
```

### 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 调用方式 | `curl` + Bearer Token | HTTP GET 请求，参数通过 query string 传递 |
| 数据接口 | MaxHub API | `https://www.aconfig.cn/api/v1/kuaishou/{app,web}/*`，通过 `MAXHUB_API_KEY` 鉴权 |
| 路径校验 | YAML 硬白名单 | `endpoints_whitelist.yaml` 提供 38 端点的逐字符校验 + 4 步 Pre-call 协议 |
| 错误处理 | 决策表 + 自检清单 | HTTP 状态码权威定义 + 防臆造自检（A/B 双轨）+ App↔Web 替换矩阵 |
| 输出格式 | JSON Standard MaxHub Response | `{code, message, message_zh, data, cache_url}` |
| 更新通道 | SkillHub / ClawHub / GitHub | 国内 ⭐⭐⭐ SkillHub（腾讯云 CDN）/ 国际 ⭐⭐⭐ ClawHub / 降级 GitHub |

### API 覆盖范围

| 领域 | 端点数 | Reference 文件 |
|------|--------|---------------|
| 视频（Video） | 8 | `video.md` |
| 用户（User） | 6 | `user.md` |
| 搜索 / 热榜（Search） | 14 | `search.md` |
| 评论（Comments） | 4 | `comments.md` |
| 直播（Live） | 6 | `live.md` |
| **合计** | **38** | — |

### 关键设计理念

- **防臆造四道闸**：白名单（endpoints_whitelist.yaml）→ 强标记（Full path）→ 禁止规则（Forbidden）→ 错误反馈（STOP）
- **App / Web 双链路**：两端独立维护参数命名与翻页协议，杜绝 Agent 把 Web 的 `share_link` 用到 App 的 `share_text` 上
- **链式调用图谱**：字段流字典 + Chain Recipes + 跨 reference 链路三层联动，重点防护 `photo_id` / `root_comment_id` / `user_id` 接力链路
- **错误处理契约**：HTTP 状态码权威定义 + §3.1 防臆造自检清单（A: 5 步 / B: 6 步）+ App↔Web 替换矩阵
