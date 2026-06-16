---
name: maxhub-weibo
description: >-
  Query Weibo (微博) data via MaxHub API — post details, user profiles,
  search, comments, hot search rankings, AI search, and video feeds.
  Use when user asks about 微博, Weibo, 热搜, 微博详情, 用户信息, 评论, 转发, 微博搜索.
  Do NOT use for posting content or account operations (read-only).
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
    tags: ["微博", "weibo", "热搜", "舆情监控", "用户分析", "AI搜索", "高级搜索", "评论采集", "视频推荐", "话题分析", "热点追踪", "品牌监控", "数据采集"]
    category: productivity
---

# 微博数据助手

## 1. 简介

微博数据查询与舆情监控工具，通过 MaxHub API 接入新浪微博（weibo.com）平台，覆盖微博详情、转发、点赞、视频、评论与子评论、用户资料、粉丝/关注、用户微博/原创/超话/视频/文章/音频、综合搜索、AI 搜索、高级搜索、实时搜索、热搜榜、文娱/社会/生活榜等全部能力，支持 App / Web / Web V2 三端共 47 个端点。专注服务于舆情监控、热搜趋势分析、KOL 影响力评估、品牌口碑追踪等场景，帮助用户快速采集微博全域数据，构建实时舆情雷达。

## 2. 详细功能

### 微博内容
- 查询任意微博的完整详情，包括正文、图片/视频附件、发布时间、来源、互动数据
- 支持 App、Web、Web 新版三端不同视角的微博详情，适配舆情研究与样本采集需求
- 拉取某条微博的转发列表，绘制传播路径并识别关键扩散节点
- 拉取某条微博的点赞用户列表，分析受众画像与互动质量
- 检查微博是否允许带图评论，识别博主互动权限设置

### 视频与频道
- 查询微博视频内容的完整详情，包括视频流地址、封面、时长与互动数据
- 拉取视频精选 Feed，了解平台视频侧的算法分发池
- 拉取视频频道的配置列表与各频道信息流，按垂类切片采集视频
- 拉取频道置顶/趋势内容，定位频道下的当前热门视频

### 发现与首页推荐
- 拉取 App 端首页推荐信息流，还原平台主页算法分发结果
- 拉取 Web 新版用户推荐时间线，对比不同端口的推荐策略

### 用户画像
- 查询微博用户的基础资料与详细资料，覆盖昵称、简介、认证、粉丝数、关注数等核心画像字段
- 支持通过用户 ID 或自定义域名（用户主页短链）两种入口定位用户
- 拉取用户的微博时间线，覆盖完整发布记录与历史轨迹
- 拉取用户的原创微博列表（剔除转发），用于评估真实内容产能
- 在用户主页内进行站内搜索，定位特定话题或时间段的发博记录
- 拉取用户的视频/超话/相册/文章/音频等多形态内容列表，构建立体内容画像
- 拉取用户主页 Feed 综合推荐
- 查询用户的视频合集列表与某个合集的详情、合集内视频列表，追踪连载内容
- 拉取用户的关注列表、粉丝列表与全部分组，分析社交图谱与圈层归属

### 评论与回复
- 拉取任意微博的一级评论列表，覆盖 App、Web、Web 新版三端
- 接力拉取评论的二级回复与楼中楼，还原完整讨论结构
- 兼容不同评论排序口径（热门/最新），适配不同分析场景

### 综合搜索矩阵
- 执行微博综合搜索，覆盖图文、视频、用户、话题等全类型结果
- 执行 AI 智能搜索与 AI 关联搜索，按语义返回相关微博与衍生话题
- 执行高级搜索，支持地域、性别、年龄、学校、工作、时间范围等多维筛选条件
- 执行实时搜索，捕捉当前正在发生的讨论与突发事件
- 按维度切分的专题搜索：用户搜索、视频搜索、图片搜索、话题搜索
- 拉取相似搜索建议，扩展长尾关键词与衍生话题
- 查询全国城市列表，配合高级搜索做地理舆情筛选

### 热搜与榜单
- 拉取微博实时热搜榜，覆盖 App、Web、Web 新版三端权威口径
- 拉取热搜分类榜单，按娱乐/社会/财经等垂类切片热点
- 拉取热搜的索引视图与摘要视图，分别对接概览与深度阅读两种使用场景
- 拉取话题搜索榜，识别当下高热话题
- 拉取文娱榜、社会榜、生活榜，按行业垂类追踪头部话题
- 拉取热搜榜单时间线，回看热搜词的上榜时间与停留轨迹

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
| 🔒 只读 | 本技能仅用于数据查询和分析，**不执行写入 / 账户 / 发博 / 评论操作** |
| 🚫 禁止臆造路径 | 仅使用 `references/endpoints_whitelist.yaml` 中的端点，**不得自行拼接、改版本号（app/web/web_v2）、加路径段** |
| 🆔 主键不可混用 | App 用 `status_id` / `mid`、Web 用 `post_id` / `mid`、Web V2 用 `id`，**绝不可在端点间复用错误主键名** |
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
| 查微博详情 / 转发 / 点赞 / 视频 / 推荐 Feed | `references/post.md` | 微博详情、转发、点赞、视频详情、推荐 Feed、频道 Feed、榜单时间线（14 端点） |
| 查用户 / 粉丝 / 关注 / 微博列表 / 收藏 | `references/user.md` | 用户基本/详细信息、粉丝、关注、用户微博、原创、超话、视频、文章、音频、相册、视频合集、分组（22 端点） |
| 搜索 / 热搜 / 榜单 / AI 搜索 | `references/search.md` | 综合搜索、分类搜索、AI 搜索、高级搜索、实时搜索、视频/图片/话题/用户搜索、热搜榜、文娱/社会/生活榜、城市列表（22 端点） |
| 查评论 / 回复 | `references/comments.md` | 微博评论、子评论、评论回复（5 端点） |
| 跨端点参数查询 / 字段流追溯 | `references/param-mappings.md` | 全局红线 + 端点路由 + 字段流字典 + 错误处理总览 |
| 路径白名单硬校验 | `references/endpoints_whitelist.yaml` | 47 个端点的硬白名单 + Pre-call 4 步自检协议 |

**Step 3 — 构建最小调用计划**

- ✅ 优先使用最少端点完成任务，能用一个端点就不用两个
- ✅ 同一意图下三端（App / Web / Web V2）任选其一，**不要同时调用**
- ❌ 禁止"先 head/tail 试运行"或"先调一个看看"等探索性调用

**Step 4 — 执行并验证**

- 调用前比对 `endpoints_whitelist.yaml` 完成 4 步 Pre-call 自检（路径 → method → 必填 → 主键名）
- 收到 **404** → 必须先做防路径臆造自检（5 步），不要立刻切换三端版本
- 收到 **400 / 422** → 必须先做防参数臆造自检（6 步），重点检查主键命名（`status_id` vs `post_id` vs `id` vs `mid`）
- 收到 **业务 code != 0** → 读 `message_zh` 报告用户，**不重试**

### 高级使用

#### 链式调用图谱（Chain Recipes）

| 用户场景 | 链路 | 字段流 |
|---------|------|-------|
| 查微博 + 评论 + 子评论 | `app_fetch_status_detail` → `app_fetch_status_comments` → `web_v2_fetch_post_sub_comments` | `status_id` → `cid` 接力 |
| 查用户 → 微博列表 | `web_v2_fetch_user_info` → `web_v2_fetch_user_posts` | `uid` 复用 |
| 用户名 → uid（自定义域名） | `web_v2_fetch_user_info`（custom 入参） → 取 `uid` → 后续端点 | `custom` → `uid` |
| 查热搜 → 微博详情 | `web_v2_fetch_hot_search` → `web_v2_fetch_advanced_search` → `web_fetch_post_detail` | 热搜词 → `q` → `post_id` |
| 查用户全面分析 | `app_fetch_user_info_detail` + `web_v2_fetch_user_posts` + `web_v2_fetch_user_following` + `web_v2_fetch_user_fans` | `uid` 复用 |
| 视频合集追踪 | `web_v2_fetch_user_video_collection_list` → `web_v2_fetch_user_video_collection_detail` | `uid` → `cid` |
| 高级人群搜索 | `web_v2_fetch_city_list` → `web_v2_fetch_user_search`（带 region/age/gender） | `city` → query 参数 |

#### 防臆造自检清单（强制前置步骤）

**收到 404 时（A）**：
1. 路径白名单逐字符比对 → 不在清单中 STOP
2. Method 比对（全部为 GET）→ 不等 STOP
3. 三端版本段（`/app/` / `/web/` / `/web_v2/`）比对 → 错段 STOP
4. 资源 ID 来源溯源 → Agent 编造的 STOP
5. 全通过才判定"上游资源不存在"

**收到 400 / 422 时（B）**：
1. 主键名严格比对（`status_id` / `post_id` / `id` / `mid` / `uid` 不可互换）
2. 必填项齐全 + oneOf 二选一逻辑（如 `uid` 与 `custom`）
3. 评论端点 `post_id` 与 `mid` 是否同时携带（web 评论端点要求双主键）
4. 类型与格式严格匹配（pattern / enum）
5. 传参方式正确（query string）
6. 全通过才按 `message_zh` 排查

#### SKILL 版本更新

| 触发条件 | 推荐操作 |
|---------|---------|
| 合法路径持续 404 / 410 | `skillhub upgrade maxhub-weibo`（国内）或 `clawhub upgrade maxhub-weibo`（国际） |
| 用户问"版本是多少" | 当前版本 v3.7.2，访问 https://skillhub.cn/skills/maxhub-weibo |
| 多端点连续 410 | `skillhub upgrade maxhub-weibo --force` |
| 401 / 402 / 403 | **不是版本问题**，去 https://www.aconfig.cn 处理 |

### 常用命令速查表

| 场景 | 命令 |
|---|---|
| 查 API Key | `[ -n "${MAXHUB_API_KEY:-}" ] && echo "ok" \|\| echo "missing"` |
| 查微博详情（App） | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/weibo/app/fetch_status_detail?status_id=xxx"` |
| 查微博评论（App） | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/weibo/app/fetch_status_comments?status_id=xxx"` |
| 查用户信息（Web V2） | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/weibo/web_v2/fetch_user_info?uid=xxx"` |
| 查热搜榜 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/weibo/web_v2/fetch_hot_search"` |
| AI 智能搜索 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/weibo/web_v2/fetch_ai_search?query=新能源"` |
| 检查 SKILL 更新 | `skillhub info maxhub-weibo` 或 `clawhub info maxhub-weibo` |

## 5. 使用场景

### 场景一：品牌方 7×24 舆情监控

- **角色**：品牌公关 / 舆情分析师
- **需求**：实时监控品牌关键词在微博的传播情况，第一时间识别潜在危机话题
- **使用方式**：定时调用 `web_v2_fetch_realtime_search` 取实时词流 → `app_fetch_ai_smart_search` 做语义聚类 → 命中关键词后链式调 `app_fetch_status_detail` + `app_fetch_status_comments` 还原原帖 + 评论
- **预期收益**：实时舆情雷达 + 自动情感聚类，把舆情发现窗口从小时级缩短到分钟级

### 场景二：热搜趋势分析师追踪话题生命周期

- **角色**：内容运营 / 热点编辑
- **需求**：分析当日热搜词的来源、扩散路径、参与 KOL，判断话题是否值得跟进
- **使用方式**：`web_v2_fetch_hot_search` 拉热搜榜 → 取热搜词 → `web_v2_fetch_topic_search` + `web_v2_fetch_advanced_search` 取头部微博 → 链式取 `uid` → `web_v2_fetch_user_info` 补充作者画像
- **预期收益**：完整热搜传播图谱，识别话题首发账号、扩散节点与衰退点

### 场景三：MCN 机构 KOL 影响力分析

- **角色**：MCN / 投放代理
- **需求**：评估候选博主的真实影响力（粉丝活跃度、原创比例、互动健康度）
- **使用方式**：`app_fetch_user_info_detail` 拉详细资料 → `web_v2_fetch_user_original_posts` 拉原创微博 → 抽样 `app_fetch_status_comments` 检测评论真实性 → `web_v2_fetch_user_fans` 抽样粉丝画像
- **预期收益**：完整 KOL 健康度评估，识别水号与真实影响力账号

### 场景四：内容团队微博爆款追踪

- **角色**：自媒体编辑 / 内容策划
- **需求**：追踪某垂类（科技 / 体育 / 娱乐）近 24 小时的爆款微博，提炼标题与开头公式
- **使用方式**：`app_fetch_hot_search`（带 category） → `web_v2_fetch_advanced_search`（timescope=24h） → 取 Top 微博 `mid` → `app_fetch_status_detail` 取全文 → 输出爆款样本集
- **预期收益**：垂类爆款样本库 + 标题/开头公式提炼，提升原创内容 CTR

## 6. 项目架构

### 目录结构

```
maxhub-weibo/
├── SKILL.md                            # Skill 定义与使用文档（本文件）
├── README.md                           # 英文项目说明
├── README_CN.md                        # 中文项目说明
├── _meta.json                          # 版本元信息（version: 3.7.2）
└── references/
    ├── endpoints_whitelist.yaml        # 47 端点路径硬白名单 + Pre-call 4 步自检协议
    ├── param-mappings.md               # 中枢索引（全局红线 + 字段流字典 + 错误处理）
    ├── post.md                         # 微博域：详情/转发/点赞/视频/Feed（App + Web + Web V2，14 端点）
    ├── user.md                         # 用户域：资料/粉丝/关注/微博/原创/超话/视频/文章/音频（22 端点）
    ├── search.md                       # 搜索域：综合/AI/高级/实时/视频/图片/话题/热搜/榜单/城市（22 端点）
    └── comments.md                     # 评论域：评论/子评论/评论回复（App + Web + Web V2，5 端点）
```

### 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 调用方式 | `curl` + Bearer Token | HTTP GET 请求，参数通过 query string 传递 |
| 数据接口 | MaxHub API | `https://www.aconfig.cn/api/v1/weibo/{app\|web\|web_v2}/*`，通过 `MAXHUB_API_KEY` 鉴权 |
| 路径校验 | YAML 硬白名单 | `endpoints_whitelist.yaml` 提供 47 端点的逐字符校验 + 4 步 Pre-call 协议 |
| 错误处理 | 决策表 + 自检清单 | HTTP 状态码权威定义 + 防臆造自检（A/B 双轨）+ 重试策略矩阵 |
| 输出格式 | JSON Standard MaxHub Response | `{code, message, message_zh, data, cache_url}` |
| 更新通道 | SkillHub / ClawHub / GitHub | 国内 ⭐⭐⭐ SkillHub（腾讯云 CDN）/ 国际 ⭐⭐⭐ ClawHub / 降级 GitHub |

### API 覆盖范围

| 领域 | 端点数 | Reference 文件 |
|------|--------|---------------|
| 微博内容（Posts） | 14 | `post.md` |
| 用户（Users） | 22 | `user.md` |
| 搜索与发现（Search） | 22 | `search.md` |
| 评论（Comments） | 5 | `comments.md` |
| **合计** | **63（按 4 大领域路由，47 个核心场景端点）** | — |

### 关键设计理念

- **防臆造四道闸**：白名单（endpoints_whitelist.yaml）→ 强标记（Full path）→ 禁止规则（Forbidden）→ 错误反馈（STOP）
- **三端口径共存**：App / Web / Web V2 同一意图存在多端点，**主键命名差异（status_id / post_id / id / mid）必须严格匹配端点要求**
- **Agent 友好 7 大原则**：结构胜于叙述、明确指令优于建议、单一来源、词法稳定性、低 token 密度、边界显式声明、错误处理是契约
- **链式调用图谱**：字段流字典 + Chain Recipes + 跨 reference 链路三层联动，杜绝 Agent 编造字段名
- **错误处理契约**：HTTP 状态码权威定义 + 防臆造自检清单（A: 5 步 / B: 6 步）+ 重试策略矩阵 + 端点替换矩阵
