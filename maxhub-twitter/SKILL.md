---
name: maxhub-twitter
description: >-
  Query Twitter/X data via MaxHub API — tweets, user profiles, search,
  trending, followers, and media. Use when user asks about Twitter, X
  (formerly Twitter), tweets, twitter users, twitter search, or trending
  topics. Do NOT use for posting content or account operations (read-only).
license: MIT-0
metadata:
  author: maxhub
  version: "3.7.2"
  openclaw:
    emoji: "🐦"
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
    tags: ["twitter", "X", "推特", "推文分析", "用户分析", "趋势", "搜索", "数据采集"]
    category: productivity
---

# Twitter/X 数据助手

## 1. 简介

Twitter/X 数据查询与海外舆情研究工具，通过 MaxHub API 接入 Twitter / X（twitter.com / x.com）平台，覆盖推文详情、评论（最新/热门）、转推用户列表、搜索时间线、趋势话题、用户资料、用户推文 / 回复 / 媒体、关注 / 粉丝、用户精选推文等全部能力。专注服务于海外舆情监控、Twitter KOL 影响力分析、推文爆款研究、趋势话题追踪等场景，帮助用户快速采集 X 平台全域数据，构建跨语种海外社媒洞察。

## 2. 功能特性

- 🐦 **推文全维度查询** — 单端点 `fetch_tweet_detail` 拉取推文完整详情，含作者、互动数据、媒体附件、引用链路

- 💬 **评论双轨拉取** — `fetch_post_comments`（热门排序） + `fetch_latest_post_comments`（最新排序）双端点，覆盖不同分析口径

- 🔄 **转推用户追踪** — `fetch_retweet_user_list` 拉取任意推文的转推用户列表，识别传播链路与扩散节点

- 🔍 **搜索时间线** — `fetch_search_timeline` 支持关键词搜索 + `search_type` 切换（最新 / 热门 / 用户 / 媒体），cursor 翻页

- 🌍 **趋势话题** — `fetch_trending` 按 `country` 拉取地域趋势榜，支撑跨地区热点对比

- 👤 **用户全景画像** — 用户资料、推文、回复、媒体、关注、粉丝、精选推文七端点联动，支持 `screen_name` 或 `rest_id` 入参

- 🆔 **screen_name ↔ rest_id 互通** — `fetch_user_profile` 与 `fetch_user_post_tweet` 支持 oneOf 入参，账号改名后可用 rest_id 继续追踪

- 🛡️ **防臆造硬白名单** — `endpoints_whitelist.yaml` 路径硬校验，404/400 强制自检清单，杜绝 Agent 臆造 API 地址或参数

- 🔗 **链式调用图谱** — 13 个端点的字段流字典 + Chain Recipes，明确 tweet_id / screen_name / rest_id / userId / cursor 在端点间的传递路径

- 📊 **错误处理契约** — HTTP 状态码权威定义 + 重试策略矩阵 + 端点替换矩阵，明确 cursor 翻页边界

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
| 🔒 只读 | 本技能仅用于数据查询和分析，**不执行写入 / 账户 / 发推 / 关注操作** |
| 🚫 禁止臆造路径 | 仅使用 `references/endpoints_whitelist.yaml` 中的端点，**不得自行拼接、改版本号、加路径段** |
| 🆔 入参互转规则 | `screen_name`（用户名）与 `rest_id`（数字 ID）按端点要求严格区分，部分端点支持 oneOf，部分仅接受其一 |
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
| 查推文详情 / 评论 / 搜索 / 趋势 / 转推 | `references/content.md` | 推文详情、热门/最新评论、转推用户、搜索时间线、趋势（6 端点） |
| 查用户 / 推文 / 关注 / 粉丝 / 媒体 / 精选 | `references/user.md` | 用户资料、推文、回复、媒体、关注、粉丝、精选推文（7 端点） |
| 跨端点参数查询 / 字段流追溯 | `references/param-mappings.md` | 全局红线 + 端点路由 + 字段流字典 + 错误处理总览 |
| 路径白名单硬校验 | `references/endpoints_whitelist.yaml` | 13 个端点的硬白名单 + Pre-call 4 步自检协议 |

**Step 3 — 构建最小调用计划**

- ✅ 优先使用最少端点完成任务，能用一个端点就不用两个
- ✅ 评论端点二选一（热门 vs 最新），按用户分析意图选择
- ❌ 禁止"先 head/tail 试运行"或"先调一个看看"等探索性调用

**Step 4 — 执行并验证**

- 调用前比对 `endpoints_whitelist.yaml` 完成 4 步 Pre-call 自检（路径 → method → 必填 → screen_name/rest_id 来源）
- 收到 **404** → 必须先做防路径臆造自检（5 步）
- 收到 **400 / 422** → 必须先做防参数臆造自检（6 步），重点检查 `screen_name` 是否带 `@`、`rest_id` 是否为纯数字
- 收到 **业务 code != 0** → 读 `message_zh` 报告用户，**不重试**

### 高级使用

#### 链式调用图谱（Chain Recipes）

| 用户场景 | 链路 | 字段流 |
|---------|------|-------|
| 查推文 + 评论 | `fetch_tweet_detail` → `fetch_post_comments` / `fetch_latest_post_comments` | `tweet_id` 复用 |
| 查用户 → 推文 | `fetch_user_profile` → `fetch_user_post_tweet` | `screen_name` / `rest_id` 复用 |
| screen_name → rest_id | `fetch_user_profile`（screen_name 入参） → 取 `rest_id` → 后续端点 | `screen_name` → `rest_id` |
| 查搜索 → 推文详情 | `fetch_search_timeline` → 取 `tweet_id` → `fetch_tweet_detail` | `keyword` → `tweet_id` |
| 查转推用户 → 用户画像 | `fetch_retweet_user_list` → 取 `screen_name` → `fetch_user_profile` | `tweet_id` → `screen_name` |
| 查用户全面分析 | `fetch_user_profile` + `fetch_user_post_tweet` + `fetch_user_media` + `fetch_user_followers` + `fetch_user_followings` | `screen_name` 复用 |
| 趋势 → 搜索 → 详情 | `fetch_trending` → 取趋势词 → `fetch_search_timeline` → `fetch_tweet_detail` | trend → `keyword` → `tweet_id` |
| 用户精选推文 | `fetch_user_profile` → 取 `rest_id`（作为 `userId`） → `fetch_user_highlights_tweets` | `rest_id` → `userId` |

#### 防臆造自检清单（强制前置步骤）

**收到 404 时（A）**：
1. 路径白名单逐字符比对 → 不在清单中 STOP
2. Method 比对（全部为 GET）→ 不等 STOP
3. 参数键名比对（注意 `userId` 仅用于 `fetch_user_highlights_tweets`，其它端点用 `screen_name` / `rest_id`）→ 有清单外参数 STOP
4. 资源 ID 来源溯源 → Agent 编造的 STOP
5. 全通过才判定"上游资源不存在"

**收到 400 / 422 时（B）**：
1. 参数名严格比对（`screen_name` 不带 `@`，`rest_id` 必须纯数字）
2. 必填项齐全 + oneOf 二选一逻辑（`fetch_user_profile` 接受 screen_name 或 rest_id）
3. `cursor` 翻页参数是否上接前次响应的 cursor，禁止编造
4. 类型与格式严格匹配（pattern / enum）
5. 传参方式正确（query string）
6. 全通过才按 `message_zh` 排查

#### Cursor 翻页最佳实践

- **首次调用不传 cursor**：取出响应中的 `next_cursor`
- **后续调用接力**：用上一轮的 `next_cursor` 作为本轮 cursor 入参
- **终止条件**：响应未返回新 cursor 或返回空数组
- **禁止编造 cursor 字符串**：cursor 是平台签发的不透明字段，不可猜测

#### SKILL 版本更新

| 触发条件 | 推荐操作 |
|---------|---------|
| 合法路径持续 404 / 410 | `skillhub upgrade maxhub-twitter`（国内）或 `clawhub upgrade maxhub-twitter`（国际） |
| 用户问"版本是多少" | 当前版本 v3.7.2，访问 https://skillhub.cn/skills/maxhub-twitter |
| 多端点连续 410 | `skillhub upgrade maxhub-twitter --force` |
| 401 / 402 / 403 | **不是版本问题**，去 https://www.aconfig.cn/console 处理 |

### 常用命令速查表

| 场景 | 命令 |
|---|---|
| 查 API Key | `[ -n "${MAXHUB_API_KEY:-}" ] && echo "ok" \|\| echo "missing"` |
| 查推文详情 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/twitter/web/fetch_tweet_detail?tweet_id=xxx"` |
| 查推文热门评论 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/twitter/web/fetch_post_comments?tweet_id=xxx"` |
| 查用户资料 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/twitter/web/fetch_user_profile?screen_name=elonmusk"` |
| 查用户推文 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/twitter/web/fetch_user_post_tweet?screen_name=elonmusk"` |
| 搜索时间线 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/twitter/web/fetch_search_timeline?keyword=AI"` |
| 趋势话题（美国） | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/twitter/web/fetch_trending?country=US"` |
| 检查 SKILL 更新 | `skillhub info maxhub-twitter` 或 `clawhub info maxhub-twitter` |

## 5. 使用场景

### 场景一：海外舆情分析师跨地区监控

- **角色**：海外公关 / 跨境品牌
- **需求**：监控品牌关键词在美国 / 日本 / 欧洲的实时讨论与情感倾向
- **使用方式**：`fetch_trending`（按 country 切换）+ `fetch_search_timeline`（search_type=Latest）双端点联动 → 命中关键词后链式调 `fetch_tweet_detail` + `fetch_post_comments` 还原舆情上下文 → 取 `screen_name` → `fetch_user_profile` 识别影响力账号
- **预期收益**：实时跨地区舆情雷达 + 情感聚类，识别高影响力扩散节点

### 场景二：Twitter KOL 投放评估

- **角色**：跨境营销 / KOL 投放代理
- **需求**：评估候选 X KOL 的真实活跃度、粉丝健康度、互动质量
- **使用方式**：`fetch_user_profile` 拉资料 → `fetch_user_post_tweet` 拉近期推文 → `fetch_user_followers` 抽样粉丝 → `fetch_user_media` 拉媒体推文判断内容形态
- **预期收益**：完整 KOL 健康度评估，识别僵尸粉 / 真实粉丝比例与互动健康度

### 场景三：内容团队推文爆款研究

- **角色**：海外内容运营 / 翻译号策划
- **需求**：追踪某垂类（科技 / 加密货币 / AI）近期高互动爆款推文，提炼标题与开头模板
- **使用方式**：`fetch_search_timeline`（search_type=Top） → 取爆款 `tweet_id` → `fetch_tweet_detail` 取全文 → `fetch_retweet_user_list` 看转推扩散链 → 输出爆款样本集
- **预期收益**：海外垂类爆款语料库 + 翻译选题池，提升翻译号 / 资讯号 CTR

### 场景四：研究员追踪趋势话题生命周期

- **角色**：社媒研究员 / 趋势分析师
- **需求**：跟踪某趋势词从出现 → 爆发 → 衰退的完整生命周期与参与人群
- **使用方式**：定时抓取 `fetch_trending` → 命中目标趋势词 → `fetch_search_timeline` 全量拉推文 → 取 `screen_name` 集合 → 抽样 `fetch_user_profile` 构建参与者画像
- **预期收益**：趋势话题完整生命周期图谱，识别话题首发账号 + 扩散节点 + 长尾参与者

## 6. 项目架构

### 目录结构

```
maxhub-twitter/
├── SKILL.md                            # Skill 定义与使用文档（本文件）
├── README.md                           # 英文项目说明
├── README_CN.md                        # 中文项目说明
├── _meta.json                          # 版本元信息（version: 3.7.2）
└── references/
    ├── endpoints_whitelist.yaml        # 13 端点路径硬白名单 + Pre-call 4 步自检协议
    ├── param-mappings.md               # 中枢索引（全局红线 + 字段流字典 + 错误处理）
    ├── content.md                      # 推文域：详情/评论/搜索/趋势/转推（6 端点）
    └── user.md                         # 用户域：资料/推文/回复/媒体/关注/粉丝/精选（7 端点）
```

### 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 调用方式 | `curl` + Bearer Token | HTTP GET 请求，参数通过 query string 传递 |
| 数据接口 | MaxHub API | `https://www.aconfig.cn/api/v1/twitter/web/*`，通过 `MAXHUB_API_KEY` 鉴权 |
| 路径校验 | YAML 硬白名单 | `endpoints_whitelist.yaml` 提供 13 端点的逐字符校验 + 4 步 Pre-call 协议 |
| 错误处理 | 决策表 + 自检清单 | HTTP 状态码权威定义 + 防臆造自检（A/B 双轨）+ 重试策略矩阵 |
| 翻页机制 | Cursor 不透明令牌 | 平台签发，禁止编造，按响应 next_cursor 接力 |
| 输出格式 | JSON Standard MaxHub Response | `{code, message, message_zh, data, cache_url}` |
| 更新通道 | SkillHub / ClawHub / GitHub | 国内 ⭐⭐⭐ SkillHub（腾讯云 CDN）/ 国际 ⭐⭐⭐ ClawHub / 降级 GitHub |

### API 覆盖范围

| 领域 | 端点数 | Reference 文件 |
|------|--------|---------------|
| 推文内容（Content） | 6 | `content.md` |
| 用户（Users） | 7 | `user.md` |
| **合计** | **13** | — |

### 关键设计理念

- **防臆造四道闸**：白名单（endpoints_whitelist.yaml）→ 强标记（Full path）→ 禁止规则（Forbidden）→ 错误反馈（STOP）
- **screen_name / rest_id 双轨**：账号改名场景下使用 rest_id 持续追踪，oneOf 端点支持灵活切换
- **Cursor 不可编造**：cursor 是平台签发的不透明字段，必须按响应接力，禁止猜测
- **Agent 友好 7 大原则**：结构胜于叙述、明确指令优于建议、单一来源、词法稳定性、低 token 密度、边界显式声明、错误处理是契约
- **链式调用图谱**：字段流字典 + Chain Recipes + 跨 reference 链路三层联动，杜绝 Agent 编造字段名
- **错误处理契约**：HTTP 状态码权威定义 + 防臆造自检清单（A: 5 步 / B: 6 步）+ 重试策略矩阵 + 端点替换矩阵
