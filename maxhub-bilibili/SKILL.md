---
name: maxhub-bilibili
description: >-
  Query Bilibili (B站) data via MaxHub API — video details, user profiles,
  search, comments, danmaku, live streams, collections, and rankings.
  Use when user asks about any B站 content, UP主, 视频, 弹幕, 直播, 评论, or 搜索.
  Do NOT use for posting content or account operations (read-only).
license: MIT-0
metadata:
  author: maxhub
  version: "3.7.2"
  openclaw:
    emoji: "📺"
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
    tags: ["bilibili", "B站", "视频分析", "UP主", "弹幕", "评论采集", "番剧", "排行榜", "直播", "搜索", "用户画像", "内容分析", "二次元", "数据采集"]
    category: productivity
---

# B站 数据助手

## 1. 简介

B 站（Bilibili）数据查询与分析工具，通过 MaxHub API 接入 B 站全平台公开数据，覆盖视频详情、UP 主画像、关键词搜索、评论弹幕、直播间数据、收藏夹等六大领域共 41 个端点（含番剧 / BV-AV 转换 / 字幕 / 分 P 等 B 站特色能力）。专注服务于 B 站 UP 主、二次元内容创作者、番剧追踪者、字幕弹幕研究者与直播数据团队，帮助用户高效采集 B 站数据、辅助选题与互动分析。

## 2. 功能特性

- 📺 **视频全维度查询** — 支持 BV / AV / 短链多入口，覆盖视频详情、播放 URL、字幕、分 P 信息、BV ↔ AV 转换（11 端点）

- 👤 **UP 主全景画像** — 用户信息、粉丝 / 关注统计、投稿列表、动态详情完整链路（10 端点）

- 🔍 **多维搜索矩阵** — 综合搜索、分类搜索、热榜、首页推荐、番剧 / 影视搜索（9 端点）

- 💬 **评论与弹幕** — 视频评论、二级回复、弹幕实时数据（5 端点）

- 📡 **直播间数据** — 直播间信息、直播流、分区主播、分区列表（4 端点）

- ⭐ **收藏夹追踪** — 用户收藏夹列表、收藏夹内视频明细（2 端点）

- 🎬 **番剧与 BV-AV 转换** — 番剧 / 影视专属搜索 + B 站特色 ID 互转，避免 BV / AV 混用错误

- 🛡️ **防臆造硬白名单** — `endpoints_whitelist.yaml` 路径硬校验，404 / 400 强制自检清单，杜绝 Agent 臆造 API 地址或参数

- 🔗 **链式调用图谱** — 跨 6 个领域的字段流字典 + Chain Recipes，明确 bvid / aid / mid / room_id / fid 在端点间的传递路径

- 📋 **错误处理契约** — HTTP 状态码权威定义 + 重试策略矩阵 + 端点替换矩阵

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