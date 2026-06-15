---
name: maxhub-pipixia
description: >-
  Query PiPiXia (皮皮虾) data via MaxHub API — posts, user profiles, search,
  trending, hashtags, and comments. Use when user asks about 皮皮虾, pipixia
  content, pipixia users, pipixia hot search, or pipixia feed. Do NOT use for
  posting content or account operations (read-only).
license: MIT-0
metadata:
  author: maxhub
  version: "3.7.2"
  openclaw:
    emoji: "🦐"
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
    tags: ["pipixia", "皮皮虾", "搞笑", "帖子分析", "用户分析", "热门", "搜索", "评论采集", "数据采集"]
    category: productivity
---

# 皮皮虾 数据助手

## 1. 简介

皮皮虾数据查询工具，通过 MaxHub API 接入字节跳动旗下搞笑短视频与段子社区皮皮虾，覆盖帖子详情、统计、评论、Home Feed、短剧 Feed、综合搜索、热搜词、热搜榜、Hashtag、短链、用户资料、用户作品 / 粉丝 / 关注等核心能力。专注服务于段子创作、短视频选题、搞笑内容研究与用户画像场景，帮助用户快速采集皮皮虾爆款数据、识别热门话题与高互动达人。

## 2. 功能特性

- 🦐 **帖子全维度查询** — `cell_id` 直查详情、统计、评论；可选 `cell_type` 区分帖类型

- 📈 **Feed 流双链路** — `fetch_home_feed`（综合首页）+ `fetch_home_short_drama_feed`（短剧专区），覆盖主信息流

- 🔍 **搜索与热搜矩阵** — 综合搜索 + 热搜词 + 热搜榜列表 + 热搜榜详情，多入口识别热度

- #️⃣ **Hashtag 深挖** — 话题信息 + 话题帖列表（支持 sort_type 排序）

- 🔗 **短链工具** — `fetch_short_url` 将原始 URL 转换为皮皮虾分享短链

- 👤 **用户全景画像** — 用户资料 + 作品列表 + 粉丝 / 关注列表完整链路

- ⚠️ **写入接口隔离** — `fetch_increase_post_view_count` 标记为 `risk: medium / write_operation`，调用前**强制用户确认**

- 🛡️ **防臆造硬白名单** — `endpoints_whitelist.yaml` 路径硬校验，404/400 强制自检清单，杜绝 Agent 臆造 API 地址或参数

- 🔗 **链式调用图谱** — 17 个端点的字段流字典 + Chain Recipes，明确 cell_id / hashtag_id / user_id / keyword 在端点间的传递路径

- 📊 **错误处理契约** — HTTP 状态码权威定义 + 重试策略矩阵 + 写入端点 5xx ≤ 1 次重试规则

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
| 401 / 402 / 403 | **不是版本问题**，去 https://www.aconfig.cn/console 处理 |

### 常用命令速查表

| 场景 | 命令 |
|---|---|
| 查 API Key | `[ -n "${MAXHUB_API_KEY:-}" ] && echo "ok" \|\| echo "missing"` |
| 查帖子详情 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/pipixia/app/fetch_post_detail?cell_id=xxx"` |
| 查 Home Feed | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/pipixia/app/fetch_home_feed"` |
| 查热搜榜列表 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/pipixia/app/fetch_hot_search_board_list"` |
| 查用户作品 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/pipixia/app/fetch_user_post_list?user_id=xxx"` |
| 检查 SKILL 更新 | `skillhub info maxhub-pipixia` 或 `clawhub info maxhub-pipixia` |

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
