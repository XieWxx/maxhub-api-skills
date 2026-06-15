---
name: maxhub-douyin
description: >-
  Query Douyin (抖音) data via MaxHub API — video details, user profiles,
  search, trending, creator tools, xingtu KOL analytics, content index,
  live streaming, and comments.
  Use when user asks about any 抖音 content, 视频, 用户, 热榜, 搜索, 创作者, 星图, 直播, 评论, or 抖音数据.
  Do NOT use for posting content or account operations (read-only).
license: MIT-0
metadata:
  author: maxhub
  version: "3.7.2"
  openclaw:
    emoji: "🎵"
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
    tags: ["抖音", "douyin", "短视频", "热搜", "视频分析", "用户分析", "创作者", "星图", "抖音指数", "关键词搜索", "评论采集", "直播数据", "话题分析", "数据采集"]
    category: productivity
---

# 抖音 数据助手

## 1. 简介

抖音数据查询与分析工具，通过 MaxHub API 接入抖音平台全量公开数据，覆盖视频详情、用户画像、关键词搜索、热搜热榜、创作者后台、星图 KOL 分析、抖音指数、直播数据、评论弹幕等十大领域共 273 个端点。专注服务于抖音内容创作者、新媒体运营、星图投放分析师、直播数据团队与品牌竞品研究者，帮助用户快速采集抖音全平台数据、提炼爆款规律、辅助选题与投放决策。

## 2. 功能特性

- 🎵 **视频全维度查询** — 支持 aweme_id / 分享 URL / 短链 / 二维码多种入口查询视频详情，覆盖播放、统计、合集、短剧、音乐、话题等 42 个端点

- 👤 **用户全景画像** — 用户资料、粉丝/关注、作品、喜欢列表、收藏夹、合辑、搜索、开播信息一站式覆盖（24 端点）

- 🔍 **多模态搜索矩阵** — 综合 / 视频 / 用户 / 图片 / 直播 / 话题 / 经验 / 音乐 / 学校 / 图像 10+ 维度搜索 + 搜索建议（19 端点）

- 🔥 **热榜与活动洞察** — 总榜 / 上升 / 同城 / 挑战热点 / 活动日历 / 粉丝画像 / 账号视频话题热榜（39 端点）

- 📊 **创作者后台数据** — 素材中心、商单任务、行业分类、流量分析、观众画像、账号诊断、直播历史（31 端点）

- ⭐ **星图 KOL 全链路** — KOL ID 反查、基本信息、画像、报价、转化、星图指数、视频表现、达人广场、MCN、IP 日历（43 端点）

- 💬 **评论与弹幕** — 视频一级评论、二级回复、视频弹幕完整链路（6 端点）

- 📈 **抖音指数与品牌** — 关键词趋势、关联词、人群画像、品牌指数、达人分析、创作指南、趋势报告（44 端点）

- 📡 **直播间数据** — 直播流、弹幕、送礼排行、直播商品、商品评价、直播间 ID 转换（14 端点）

- 🛠️ **签名与工具** — 设备注册、APP 跳转、游客 Cookie、msToken / ttwid / verify_fp / s_v_web_id、X-Bogus / A-Bogus / 弹幕 xb 签名（13 端点）

- 🛡️ **防臆造硬白名单** — `endpoints_whitelist.yaml` 路径硬校验，404 / 400 强制自检清单，杜绝 Agent 臆造 API 地址或参数

- 🔗 **链式调用图谱** — 跨 10 个领域的字段流字典 + Chain Recipes，明确 aweme_id / sec_user_id / room_id / kolid / keyword 在端点间的传递路径

- 📋 **错误处理契约** — HTTP 状态码权威定义 + 重试策略矩阵 + 端点替换矩阵，写入端点 5xx 重试 ≤ 1 次避免重复扣配额

- 🔄 **SKILL 自更新机制** — 内置 SkillHub / ClawHub / GitHub 三通道版本检查，仅在合法路径持续 404 / 410 时建议更新

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
| 🔒 只读 | 本技能仅用于数据查询和分析，**不执行写入 / 账户 / 发布操作** |
| 🚫 禁止臆造路径 | 仅使用 `references/endpoints_whitelist.yaml` 中的端点，**不得自行拼接、改版本号、加路径段** |
| 📋 数据流向第三方 | 所有请求发送至 `https://www.aconfig.cn`，请使用独立测试账号并定期轮换 API Key |
| 🔑 凭证保护 | 不暴露 API Key、Cookie、Token 至日志或对话 |
| ⚠️ 高风险端点确认 | `fetch_multi_video` 等批量 / 写入端点须用户明确确认参数后才能调用 |

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
| 查视频详情 / 播放 / 下载 / 统计 | `references/video.md` | 视频详情、批量视频、播放 URL、统计、合集 / 短剧、音乐 / 话题、分享 / 短链 / 二维码、频道内容、ID 提取（42 端点） |
| 查用户 / 粉丝 / 作品 / 喜欢 | `references/user.md` | 用户信息、粉丝 / 关注、作品、喜欢、收藏夹、合辑、用户搜索、开播信息（24 端点） |
| 搜索视频 / 用户 / 图片 / 直播 | `references/search.md` | 综合 / 视频 / 用户 / 图片 / 直播 / 话题 / 经验 / 音乐 / 讨论 / 学校 / 图像搜索 + 建议（19 端点） |
| 查热搜 / 热榜 / 活动日历 | `references/trending.md` | 热榜分类、上升 / 同城 / 挑战热点、活动日历、粉丝画像、账号 / 视频 / 话题 / 搜索热榜、首页推荐（39 端点） |
| 查创作者数据 / 作品分析 | `references/creator.md` | 创作者活动、素材中心、热门榜单、商单任务、行业分类、流量分析、观众画像、账号诊断、直播历史（31 端点） |
| 查星图 KOL / 达人分析 | `references/xingtu.md` | KOL ID 查询、基本信息、画像、报价、数据概览、KOL 搜索、转化分析、星图指数、视频表现、热榜、达人广场、MCN、IP 日历（43 端点） |
| 查评论 / 回复 / 弹幕 | `references/comments.md` | 视频评论、评论回复、视频弹幕（6 端点） |
| 查抖音指数 / 品牌 / 达人 | `references/content.md` | 关键词趋势、关联词、人群画像、达人分析、视频搜索、品牌指数、话题搜索、创作指南、趋势报告（44 端点） |
| 查直播 / 直播间 / 商品 | `references/live.md` | 直播流、弹幕、送礼排行、直播间商品、商品详情 / 评价、直播间 ID 转换（14 端点） |
| 生成 Cookie / Token / 签名 | `references/tools.md` | 设备注册、APP 跳转、游客 Cookie、msToken / ttwid / verify_fp / s_v_web_id、X-Bogus / A-Bogus / 弹幕 xb 签名（13 端点） |
| 跨端点参数查询 / 字段流追溯 | `references/param-mappings.md` | 全局红线 + 端点路由 + 字段流字典 + 错误处理总览 + 替换矩阵 |
| 路径白名单硬校验 | `references/endpoints_whitelist.yaml` | 273 个端点的硬白名单 + Pre-call 4 步自检协议 |
| SKILL 版本检查与升级 | `references/update.md` | SkillHub / ClawHub / GitHub 三通道更新 |

**Step 3 — 构建最小调用计划**

- ✅ 优先使用最少端点完成任务，能用一个端点就不用两个
- ✅ 高风险端点（批量 / 写入）调用前**必须**让用户确认参数
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
| 查视频 + 评论 | `video.md` → `comments.md` | `aweme_id` 接力 |
| 搜索 → 视频详情 | `search.md` → `video.md` | `aweme_id` 接力 |
| 查用户 → 作品 | `user.md` → `user.md` (posts) | `sec_user_id` 接力 |
| 查创作者 → 视频详情 | `creator.md` → `video.md` | `item_id` → `aweme_id` |
| 查用户 → 星图 KOL | `user.md` → `xingtu.md` | `uid` / `sec_user_id` → `kolid` |
| 查热搜 → 视频详情 | `trending.md` → `video.md` | `aweme_id` 接力 |
| 查直播 → 观众画像 | `live.md` → `creator.md` (audience_portrait) | `room_id` 接力 |
| 查品牌趋势 → 人群画像 | `content.md` → `content.md` (portrait) | `keyword` 接力 |
| 用户全面分析 | `user.md` → `user.md` (stats+posts+likes) → `xingtu.md` | `sec_user_id` 复用 |

#### 防臆造自检清单（强制前置步骤）

**收到 404 时（A）**：
1. 路径白名单逐字符比对 → 不在清单中 STOP
2. Method 比对 → 不等 STOP
3. 参数键名比对 → 有清单外参数 STOP
4. 资源 ID 来源溯源 → Agent 编造的 STOP
5. 全通过才判定 "上游资源不存在"

**收到 400 / 422 时（B）**：
1. 参数名严格比对（大小写 / 缩写 / 复数）
2. 必填项齐全 + oneOf 二选一逻辑
3. 类型与格式严格匹配（pattern / enum）
4. 传参方式正确（query vs body）
5. 没有 IN 表外的臆造参数
6. 全通过才按 `message_zh` 排查

#### SKILL 版本更新

| 触发条件 | 推荐操作 |
|---------|---------|
| 合法路径持续 404 / 410 | `skillhub upgrade maxhub-douyin`（国内）或 `clawhub upgrade maxhub-douyin`（国际） |
| 用户问 "版本是多少" | 当前版本 v3.7.2，访问 https://skillhub.cn/skills/maxhub-douyin |
| 多端点连续 410 | `skillhub upgrade maxhub-douyin --force` |
| 401 / 402 / 403 | **不是版本问题**，去 https://www.aconfig.cn/console 处理 |

### 常用命令速查表

| 场景 | 命令 |
|---|---|
| 查 API Key | `[ -n "${MAXHUB_API_KEY:-}" ] && echo "ok" \|\| echo "missing"` |
| 查视频详情 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/douyin/app/v3/fetch_one_video?aweme_id=xxx"` |
| 查视频评论 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/douyin/app/v3/fetch_video_comments?aweme_id=xxx"` |
| 分享 URL 解析 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/douyin/app/v3/fetch_one_video_by_share_url?share_url=xxx"` |
| 检查 SKILL 更新 | `skillhub info maxhub-douyin` 或 `clawhub info maxhub-douyin` |

## 5. 使用场景

### 场景一：抖音内容创作者寻找选题

- **角色**：抖音短视频创作者
- **需求**：想分析近期同赛道热门视频共性，寻找下一个选题方向
- **使用方式**：调用 `trending.md` 拉取分类热榜与上升榜 → 取 `aweme_id` → 链式调 `video.md` 提取标题、话题、音乐 → 调 `comments.md` 抓取评论关键词
- **预期收益**：通过热榜 + 详情 + 评论三层链路快速锁定高互动作品共同特征，沉淀可复用的选题模板与音乐库

### 场景二：新媒体团队竞品分析

- **角色**：MCN / 品牌新媒体运营
- **需求**：监控竞品账号的作品节奏、粉丝增长与互动表现
- **使用方式**：`user.md` 取 `sec_user_id` → 拉取作品列表 + 粉丝统计 → `creator.md` 调用流量分析与观众画像 → `comments.md` 抽样评论
- **预期收益**：构建竞品账号画像数据库，量化对比内容策略与受众重合度

### 场景三：星图 KOL 投放分析

- **角色**：品牌投放 / 广告优化师
- **需求**：在投放前评估 KOL 真实粉丝画像、报价合理性与历史转化数据
- **使用方式**：`user.md` 反查 `uid` → `xingtu.md` 用 KOL ID 查询基本信息 + 服务报价 + 转化分析 + 视频表现 + 星图指数
- **预期收益**：投放前完成 KOL 健康度筛查，降低无效投放，提升 ROI 决策准确度

### 场景四：直播数据采集与商品分析

- **角色**：直播电商运营 / 数据分析师
- **需求**：实时监控直播间互动、礼物排行与挂车商品转化
- **使用方式**：`live.md` 取 `room_id` → 拉取弹幕 + 送礼排行 + 直播商品 → `live.md` 商品详情 / 评价 → `creator.md` 观众画像
- **预期收益**：构建直播间秒级监控面板，识别高转化商品组合与观众分层特征

## 6. 项目架构

### 目录结构

```
maxhub-douyin/
├── SKILL.md                            # Skill 定义与使用文档（本文件）
├── README.md                           # 英文项目说明
├── README_CN.md                        # 中文项目说明
├── _meta.json                          # 版本元信息（version: 3.7.2）
└── references/
    ├── endpoints_whitelist.yaml        # 273 端点路径硬白名单 + Pre-call 4 步自检协议
    ├── param-mappings.md               # 中枢索引（全局红线 + 字段流字典 + 错误处理 + 替换矩阵）
    ├── video.md                        # 视频域：详情/播放/下载/统计/合集/音乐/话题（42 端点）
    ├── user.md                         # 用户域：资料/粉丝/作品/喜欢/收藏夹/合辑/搜索（24 端点）
    ├── search.md                       # 搜索域：综合/视频/用户/图片/直播/话题/经验等（19 端点）
    ├── trending.md                     # 热榜域：分类/上升/同城/挑战/活动/账号/话题（39 端点）
    ├── creator.md                      # 创作者域：素材/商单/流量/画像/账号诊断（31 端点）
    ├── xingtu.md                       # 星图域：KOL/画像/报价/转化/指数/MCN/IP 日历（43 端点）
    ├── comments.md                     # 评论域：评论/回复/弹幕（6 端点）
    ├── content.md                      # 抖音指数域：关键词/品牌/人群/趋势报告（44 端点）
    ├── live.md                         # 直播域：直播流/弹幕/礼物/商品/转换（14 端点）
    ├── tools.md                        # 工具域：Cookie/Token/签名/设备注册（13 端点）
    └── update.md                       # SKILL 更新机制（SkillHub / ClawHub / GitHub）
```

### 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 调用方式 | `curl` + Bearer Token | HTTP GET / POST 请求，参数通过 query string 或 JSON body 传递 |
| 数据接口 | MaxHub API | `https://www.aconfig.cn/api/v1/douyin/*`，通过 `MAXHUB_API_KEY` 鉴权 |
| 路径校验 | YAML 硬白名单 | `endpoints_whitelist.yaml` 提供 273 端点的逐字符校验 + 4 步 Pre-call 协议 |
| 错误处理 | 决策表 + 自检清单 | HTTP 状态码权威定义 + 防臆造自检（A/B 双轨）+ 重试策略矩阵 |
| 输出格式 | JSON Standard MaxHub Response | `{code, message, message_zh, data, cache_url}` |
| 更新通道 | SkillHub / ClawHub / GitHub | 国内 ⭐⭐⭐ SkillHub（腾讯云 CDN）/ 国际 ⭐⭐⭐ ClawHub / 降级 GitHub |

### API 覆盖范围

| 领域 | 端点数 | Reference 文件 |
|------|--------|---------------|
| 视频（Video） | 42 | `video.md` |
| 用户（User） | 24 | `user.md` |
| 搜索（Search） | 19 | `search.md` |
| 热榜（Trending） | 39 | `trending.md` |
| 创作者（Creator） | 31 | `creator.md` |
| 星图（Xingtu） | 43 | `xingtu.md` |
| 评论（Comments） | 6 | `comments.md` |
| 抖音指数（Content） | 44 | `content.md` |
| 直播（Live） | 14 | `live.md` |
| 工具（Tools） | 13 | `tools.md` |
| **合计** | **273** | — |

### 关键设计理念

- **防臆造四道闸**：白名单（endpoints_whitelist.yaml）→ 强标记（Full path）→ 禁止规则（Forbidden）→ 错误反馈（STOP）
- **Agent 友好 7 大原则**：结构胜于叙述、明确指令优于建议、单一来源、词法稳定性、低 token 密度、边界显式声明、错误处理是契约
- **链式调用图谱**：字段流字典 + Chain Recipes + 跨 reference 链路三层联动，杜绝 Agent 编造字段名
- **错误处理契约**：HTTP 状态码权威定义 + §3.1 防臆造自检清单（A: 5 步 / B: 6 步）+ 重试策略矩阵 + 端点替换矩阵
