---
name: maxhub-kuaishou
description: >-
  Query Kuaishou (快手) data via MaxHub API — video details, user profiles,
  search, trending, comments, and live streams.
  Use when user asks about any 快手 content, 视频, 用户, 直播, 评论, 热搜, or 搜索.
  Do NOT use for posting content or account operations (read-only).
license: MIT-0
metadata:
  author: maxhub
  version: "3.7.2"
  openclaw:
    emoji: "🎬"
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
    tags: ["快手", "kuaishou", "短视频", "视频分析", "用户分析", "热榜", "直播", "评论采集", "搜索", "数据采集"]
    category: productivity
---

# 快手 数据助手

## 1. 简介

快手数据查询工具，通过 MaxHub API 接入快手平台 App 端与 Web 端双链路，覆盖短视频详情、批量查询、链接解析、用户资料、投稿与收藏、视频评论与子回复、综合搜索、热榜矩阵、直播信息与回放等全部能力。专注服务于快手内容创作者、直播带货分析师、KOL 投放运营、短剧追踪团队与本地生活商家，帮助用户快速锁定爆款视频、量化主播带货能力、追踪热榜走势。

## 2. 功能特性

- ⚡ **视频全维度查询** — 支持 photo_id 单条 / 批量、分享文案、Web 链接四种入口查询视频详情，含播放、点赞、评论、转发统计

- 🔗 **分享链接解析与生成** — App 短链生成 + Web 短链生成，支持口令分享文本反解为 photo_id，闭环采集与回链

- 👤 **用户全景画像** — App 端 + Web 端用户资料并行覆盖，含投稿列表、热门作品、收藏、share_link 反查 user_id

- 💬 **评论与回复链路** — 一级评论 + 二级回复完整链式调用，App / Web 双端独立端点，支持 pcursor 翻页

- 🔥 **热榜矩阵** — 热榜分类、热榜详情、热搜人物、Web 热榜 V1/V2 等多维度榜单一站式拉取

- 📺 **直播能力闭环** — 用户直播信息、直播榜、购物榜、品牌榜、音乐榜、直播回放六大端点，覆盖直播带货与 IP 分析

- 🎯 **多维度搜索** — 综合、视频、用户、图集、直播、音乐、Tag 七类搜索，支持排序、发布时间、时长、性别等过滤

- 🔗 **链式调用图谱** — 35 端点的字段流字典 + Chain Recipes，明确 photo_id / user_id / root_comment_id 在端点间的传递路径

- 🛡️ **防臆造硬白名单** — `endpoints_whitelist.yaml` 路径硬校验，404/400 强制自检清单，杜绝 Agent 臆造 API 地址或参数

- 📊 **错误处理契约** — HTTP 状态码权威定义 + 重试策略矩阵 + App↔Web 双端互降矩阵，写入 5xx 重试 ≤ 1 次避免重复扣配额

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
| 401 / 402 / 403 | **不是版本问题**，去 https://www.aconfig.cn/console 处理 |

### 常用命令速查表

| 场景 | 命令 |
|---|---|
| 查 API Key | `[ -n "${MAXHUB_API_KEY:-}" ] && echo "ok" \|\| echo "missing"` |
| 查视频详情 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/kuaishou/app/fetch_one_video?photo_id=xxx"` |
| 查视频评论 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/kuaishou/app/fetch_video_comment?photo_id=xxx"` |
| 综合搜索 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/kuaishou/app/search_comprehensive?keyword=xxx"` |
| 查直播榜 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/kuaishou/app/fetch_live_top_list"` |
| 检查 SKILL 更新 | `skillhub info maxhub-kuaishou` 或 `clawhub info maxhub-kuaishou` |

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
