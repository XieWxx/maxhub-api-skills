---
name: maxhub-sora2
description: >-
  Query Sora2 (sora.chatgpt.com) data via MaxHub API — post details, comments,
  remix lists, video downloads, user profiles, followers, Cameo appearances,
  feed, search, and video generation tasks.
  Use when user asks about Sora2, AI视频, sora.chatgpt.com posts/users, Cameo出镜秀, feed,
  or generating Sora2 videos.
  Do NOT invent endpoints — only use paths declared in `references/`.
license: MIT-0
metadata:
  author: maxhub
  version: "3.7.2"
  openclaw:
    emoji: "🎥"
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
    tags: ["sora2", "AI视频", "出镜秀", "Cameo", "帖子分析", "用户分析", "AI生成", "视频创作", "数据采集"]
    category: productivity
---

# Sora2 数据助手

## 1. 简介

Sora2 数据查询与视频生成工具，通过 MaxHub API 接入 OpenAI Sora2（sora.chatgpt.com）平台，覆盖作品详情、评论回复、Remix 衍生、视频下载、用户资料、社交关系、Cameo 出镜、首页推荐、用户搜索及视频生成任务等全部能力。专注服务于 Sora2 内容创作者、AI 视频研究者、社媒分析师与自动化工作流场景，帮助用户快速采集 Sora2 数据、提取爆款规律、批量生成 AI 视频内容。

## 2. 功能特性

- 🎬 **作品全维度查询** — 支持 post_id 或分享 URL 二选一查询作品完整详情，含作者、视频、点赞/评论/转发统计、Cameo 出镜信息

- 💬 **评论与回复链路** — 一级评论 + 二级回复完整链式调用，自动接力 comment_id，支持游标翻页

- 🔄 **Remix 衍生追踪** — 查询任意作品的全部 Remix 二创列表，挖掘内容传播链路

- ⬇️ **无水印视频下载** — 提供 Sora2 作品的无水印下载链接，5xx 时自动降级到带水印 video_url

- 👤 **用户全景画像** — 用户资料、作品列表、关注/粉丝、Cameo 出镜记录、用户名搜索一站式覆盖

- 🔥 **Cameo 全平台热榜** — 实时拉取 Cameo 出镜热度榜单，识别平台明星用户

- 🎨 **AI 视频生成** — 支持文生视频、图生视频两种模式，含异步任务轮询与最终视频提取

- 🛡️ **防臆造硬白名单** — `endpoints_whitelist.yaml` 路径硬校验，404/400 强制自检清单，杜绝 Agent 臆造 API 地址或参数

- 🔗 **链式调用图谱** — 17 个端点的字段流字典 + Chain Recipes，明确 post_id / user_id / comment_id / task_id 在端点间的传递路径

- 📊 **错误处理契约** — HTTP 状态码权威定义 + 重试策略矩阵 + 端点替换矩阵，写入端点 5xx 重试 ≤ 1 次避免重复扣配额

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
| 🔒 只读优先 | 默认仅用于数据查询；`create_video` / `upload_image` 为写入接口，**须用户明确确认参数后调用** |
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
| 查作品 / 评论 / Remix / 下载 / Feed | `references/post.md` | 作品详情、评论、回复、Remix 列表、视频下载、推荐 Feed（6 端点） |
| 查用户 / 粉丝 / 关注 / Cameo 出镜 / 搜索用户 | `references/user.md` | 用户资料、用户作品、关注、粉丝、Cameo 出镜、用户搜索（6 端点） |
| 创建视频 / 任务查询 / 上传图片 / Cameo 热榜 | `references/tools.md` | 创建视频、任务状态、任务详情、上传图片、Cameo 热榜（5 端点） |
| 跨端点参数查询 / 字段流追溯 | `references/param-mappings.md` | 全局红线 + 端点路由 + 字段流字典 + 错误处理总览 + 替换矩阵 + 更新机制 |
| 路径白名单硬校验 | `references/endpoints_whitelist.yaml` | 17 个端点的硬白名单 + Pre-call 4 步自检协议 |
| SKILL 版本检查与升级 | `references/update.md` | SkillHub / ClawHub / GitHub 三通道更新 |

**Step 3 — 构建最小调用计划**

- ✅ 优先使用最少端点完成任务，能用一个端点就不用两个
- ✅ 写入端点（`create_video` / `upload_image`）调用前**必须**让用户确认参数
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
| 查作品 + 评论 + 回复 | `get_post_detail` → `get_post_comments` → `get_comment_replies` | `post_id` → `comment_id` 接力 |
| 下载作品视频 | `get_post_detail` → `get_video_download_info` | `post_id` 复用 |
| 看作品 + 二创 | `get_post_detail` → `get_post_remix_list` | `post_id` 复用 |
| 用户名 → 用户作品 | `search_users` → `get_user_profile` → `get_user_posts` | `username` → `user_id` |
| 文生视频（异步） | `create_video` → 轮询 `get_task_status` → `get_task_detail` | `task_id` 接力 |
| 图生视频（异步） | `upload_image` → `create_video` → 轮询 → `get_task_detail` | `image_id` → `task_id` |
| Cameo 热榜 → 用户主页 | `get_cameo_leaderboard` → `get_user_profile` | `user_id` 复用 |

#### 防臆造自检清单（强制前置步骤）

**收到 404 时（A）**：
1. 路径白名单逐字符比对 → 不在清单中 STOP
2. Method 比对 → 不等 STOP
3. 参数键名比对 → 有清单外参数 STOP
4. 资源 ID 来源溯源 → Agent 编造的 STOP
5. 全通过才判定"上游资源不存在"

**收到 400 / 422 时（B）**：
1. 参数名严格比对（大小写 / 缩写 / 复数）
2. 必填项齐全 + oneOf 二选一逻辑
3. 类型与格式严格匹配（pattern / enum）
4. 传参方式正确（query vs body）
5. 没有 IN 表外的臆造参数
6. 全通过才按 `message_zh` 排查

#### 异步任务最佳实践（仅适用 create_video）

- **轮询间隔**：5–10 秒一次
- **状态语义**：`pending` / `running` 不视为失败，必须继续轮询
- **轮询上限**：建议 10 分钟封顶；超时后把 `task_id` 返回用户
- **推荐**：宿主 Agent 支持子会话时，spawn 子会话专职轮询，主会话保持响应

#### SKILL 版本更新

| 触发条件 | 推荐操作 |
|---------|---------|
| 合法路径持续 404 / 410 | `skillhub upgrade maxhub-sora2`（国内）或 `clawhub upgrade maxhub-sora2`（国际） |
| 用户问"版本是多少" | 当前版本 v3.7.2，访问 https://skillhub.cn/skills/maxhub-sora2 |
| 多端点连续 410 | `skillhub upgrade maxhub-sora2 --force` |
| 401 / 402 / 403 | **不是版本问题**，去 https://www.aconfig.cn 处理 |

### 常用命令速查表

| 场景 | 命令 |
|---|---|
| 查 API Key | `[ -n "${MAXHUB_API_KEY:-}" ] && echo "ok" \|\| echo "missing"` |
| 查作品详情 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/sora2/get_post_detail?post_id=s_xxx"` |
| 查作品评论 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/sora2/get_post_comments?post_id=s_xxx"` |
| 查任务状态（轮询） | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/sora2/get_task_status?task_id=xxx"` |
| 检查 SKILL 更新 | `skillhub info maxhub-sora2` 或 `clawhub info maxhub-sora2` |

## 5. 使用场景

### 场景一：Sora2 内容创作者寻找爆款规律

- **角色**：Sora2 内容创作者
- **需求**：想分析近期 Sora2 平台的热门作品有哪些共同特征，寻找下一个 Remix 灵感
- **使用方式**：调用 `get_feed` 拉取首页推荐 → 批量取 `post_id` → 链式调 `get_post_detail` 提取 prompt + 视频特征
- **预期收益**：通过 Feed + 详情链路快速锁定高 totalScore 作品，提炼可复用的提示词模板

### 场景二：AI 视频研究者批量采集 Cameo 数据

- **角色**：AI 视频领域研究者
- **需求**：需要全平台 Cameo 出镜热榜及上榜用户的完整出镜记录，分析 Cameo 传播规律
- **使用方式**：`get_cameo_leaderboard` → 取上榜 `user_id` → 链式调 `get_user_cameo_appearances` 拉取每个用户的完整出镜列表
- **预期收益**：一次调用矩阵覆盖全平台 Top Cameo 用户，构建完整的 Cameo 数据集

### 场景三：自媒体团队批量生成 AI 视频

- **角色**：自媒体内容运营
- **需求**：根据脚本批量生成 Sora2 视频用于多账号矩阵分发
- **使用方式**：用户提供 prompt 列表 → 串行调用 `create_video` → 子会话轮询 `get_task_status` → 成功后 `get_task_detail` 取最终视频 URL
- **预期收益**：异步任务最佳实践确保不阻塞主会话，写入端点防重复扣配额，视频生产效率提升 5–10 倍

### 场景四：社媒分析师追踪 Remix 传播链

- **角色**：社媒数据分析师
- **需求**：跟踪某个爆款作品的全部 Remix 二创及其作者，绘制传播图谱
- **使用方式**：`get_post_detail` 验证原作品 → `get_post_remix_list` 拉取全部 Remix → 取 `author.user_id` → `get_user_profile` 补充作者画像
- **预期收益**：完整的内容传播链分析，识别 KOL 二创节点

## 6. 项目架构

### 目录结构

```
maxhub-sora2/
├── SKILL.md                            # Skill 定义与使用文档（本文件）
├── README.md                           # 英文项目说明
├── README_CN.md                        # 中文项目说明
├── _meta.json                          # 版本元信息（version: 3.7.2）
└── references/
    ├── endpoints_whitelist.yaml        # 17 端点路径硬白名单 + Pre-call 4 步自检协议
    ├── param-mappings.md               # 中枢索引（全局红线 + 字段流字典 + 错误处理 + 替换矩阵）
    ├── post.md                         # 作品域：详情/评论/回复/Remix/下载/Feed（6 端点）
    ├── user.md                         # 用户域：资料/作品/关注/粉丝/Cameo/搜索（6 端点）
    ├── tools.md                        # 工具域：上传图片/创建视频/任务查询/Cameo 热榜（5 端点）
    └── update.md                       # SKILL 更新机制（SkillHub / ClawHub / GitHub）
```

### 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 调用方式 | `curl` + Bearer Token | HTTP GET 请求，参数通过 query string 传递 |
| 数据接口 | MaxHub API | `https://www.aconfig.cn/api/v1/sora2/*`，通过 `MAXHUB_API_KEY` 鉴权 |
| 路径校验 | YAML 硬白名单 | `endpoints_whitelist.yaml` 提供 17 端点的逐字符校验 + 4 步 Pre-call 协议 |
| 错误处理 | 决策表 + 自检清单 | HTTP 状态码权威定义 + 防臆造自检（A/B 双轨）+ 重试策略矩阵 |
| 输出格式 | JSON Standard MaxHub Response | `{code, message, message_zh, data, cache_url}` |
| 更新通道 | SkillHub / ClawHub / GitHub | 国内 ⭐⭐⭐ SkillHub（腾讯云 CDN）/ 国际 ⭐⭐⭐ ClawHub / 降级 GitHub |

### API 覆盖范围

| 领域 | 端点数 | Reference 文件 |
|------|--------|---------------|
| 作品（Posts） | 6 | `post.md` |
| 用户（Users） | 6 | `user.md` |
| 工具与 Cameo（Tools） | 5 | `tools.md` |
| **合计** | **17** | — |

### 关键设计理念

- **防臆造四道闸**：白名单（endpoints_whitelist.yaml）→ 强标记（Full path）→ 禁止规则（Forbidden）→ 错误反馈（STOP）
- **Agent 友好 7 大原则**：结构胜于叙述、明确指令优于建议、单一来源、词法稳定性、低 token 密度、边界显式声明、错误处理是契约
- **链式调用图谱**：字段流字典 + Chain Recipes + 跨 reference 链路三层联动，杜绝 Agent 编造字段名
- **错误处理契约**：HTTP 状态码权威定义 + §3.1 防臆造自检清单（A: 5 步 / B: 6 步）+ 重试策略矩阵 + 端点替换矩阵
