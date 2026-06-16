---
name: maxhub-sora2
description: |-
  Sora2 数据查询与视频生成工具，通过 MaxHub API 接入 OpenAI Sora2（sora.chatgpt.com）平台，覆盖作品详情、评论回复、Remix 衍生、视频下载、用户资料、社交关系、Cameo 出镜、首页推荐、用户搜索及视频生成任务等全部能力。专注服务于 Sora2 内容创作者、AI 视频研究者、社媒分析师与自动化工作流场景，帮助用户快速采集 Sora2 数据、提取爆款规律、批量生成 AI 视频内容。
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

> **架构亮点**：本 Skill 采用三层结构 — **Atomic 原子层**（端点的标准化封装）+ **Recipe 编排层**（多步业务场景脚本）+ **Reference 详情层**（端点 5 区契约）。Agent 可按"目标 → recipes 匹配 → atoms 映射 → reference 详情"四步路径精准调用，杜绝臆造。

## 2. 详细功能

### 作品数据
- 查询 Sora2 作品的完整详情，包含作者信息、视频内容、点赞/评论/转发统计、Cameo 出镜信息等
- 支持通过作品 ID 或作品分享链接两种方式查询作品
- 拉取指定作品下的一级评论列表，支持翻页
- 拉取指定评论下的全部二级回复，构建完整评论树
- 查询某个作品的全部 Remix 二创列表，追踪内容传播链路
- 获取作品的无水印视频下载链接，下载受限时自动降级为带水印版本
- 拉取 Sora2 首页的推荐 Feed 流，识别近期热门作品

### 用户数据
- 按用户名搜索 Sora2 平台用户
- 查询指定用户的完整资料画像，包含昵称、头像、简介、粉丝数、作品数、Cameo 数等
- 拉取指定用户已发布的全部作品列表
- 查看指定用户的关注列表与粉丝列表
- 拉取指定用户的 Cameo 出镜记录，分析其在他人作品中的出镜表现

### AI 视频生成
- 上传图片素材，作为后续图生视频任务的输入
- 创建文生视频任务，根据文字 prompt 生成 Sora2 视频
- 创建图生视频任务，基于上传的图片素材生成 Sora2 视频
- 轮询查询视频生成任务的实时状态（排队中、生成中、已完成、失败）
- 获取视频生成任务完成后的最终视频 URL 与元信息

### 平台热榜
- 拉取 Sora2 全平台 Cameo 出镜热度榜单，识别平台明星用户与高频出镜内容

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
| 🧭 优先走编排 | 优先尝试匹配 `recipes/_index.md` 中的预编排脚本；命中即按 Atomic Steps 顺序调用，避免临场拼凑 |
| 📋 数据流向第三方 | 所有请求发送至 `https://www.aconfig.cn`，请使用独立测试账号并定期轮换 API Key |
| 🔑 凭证保护 | 不暴露 API Key、Cookie、Token 至日志或对话 |

### 路由策略：Recipes → Atoms → Reference 三级路径

> Agent 接到用户请求后，**优先按"先编排、后原子、再详情"的顺序进入文档**，避免一上来就读全部 reference。

```
用户输入
   ↓
① 读 recipes/_index.md（轻量索引，~100 行）
   ↓ 匹配 trigger_keywords（命中 → 走 Recipe；未命中 → 步骤 ②）
   ↓
② 读 atoms/_index.md（原子映射表，~30 行核心）
   ↓ 按业务别名找 atom_id → endpoint_id → reference 文件
   ↓
③ 仅在需要 5 区契约（IN/OUT/ERR）时，读对应 reference 文件
   ↓
④ 调用前比对 endpoints_whitelist.yaml 完成 4 步 Pre-call 自检
```

### 基础使用（5 步完成调用）

**Step 1 — 检查 API Key**

```bash
[ -n "${MAXHUB_API_KEY:-}" ] && echo "ok" || echo "missing"
```

若返回 `missing`，停止并提示用户配置 `MAXHUB_API_KEY`。

**Step 2 — 优先匹配 Recipe（编排层）**

读 `references/recipes/_index.md`，按用户目标匹配 `trigger_keywords`：

| Recipe 文件 | 覆盖场景 | 典型触发词 |
|-----------|---------|----------|
| `recipes/post.md` | 作品全维度分析、评论回复链、Remix 传播图谱、视频下载 | 帖子分析、评论、回复、二创、下载 |
| `recipes/user.md` | 用户画像、作品列表、社交关系、Cameo 出镜分析 | 用户分析、粉丝、关注、Cameo |
| `recipes/tools.md` | AI 视频生成（文生/图生）、任务轮询、Cameo 热榜 | 生成视频、文生视频、图生视频、热榜 |

命中 Recipe → 直接按其 Atomic Steps 顺序执行，跳到 Step 5。

**Step 3 — Recipe 未命中：进入原子层**

读 `references/atoms/_index.md`，按业务别名（atom_id）找到对应 endpoint_id：

| 业务别名 | atom_id | 端点 | 用途 |
|---------|---------|-----|------|
| 查作品 | `get_post` | get_post_detail | 作品详情 |
| 查评论 | `list_comments` | get_post_comments | 一级评论 |
| 查回复 | `list_replies` | get_comment_replies | 二级回复 |
| 查 Remix | `list_remix` | get_post_remix_list | 二创列表 |
| 查下载 | `get_download` | get_video_download_info | 无水印 URL |
| 查 Feed | `get_feed` | get_feed | 推荐流 |
| 搜用户 | `search_users` | search_users | 用户名搜索 |
| 查用户主页 | `get_profile` | get_user_profile | 用户资料 |
| 查用户作品 | `list_user_posts` | get_user_posts | 用户作品 |
| 查关注 | `list_following` | get_user_following | 关注列表 |
| 查粉丝 | `list_followers` | get_user_followers | 粉丝列表 |
| 查 Cameo 出镜 | `list_cameo` | get_user_cameo_appearances | 出镜记录 |
| 上传图片 ⚠️ | `upload_image` | upload_image | 写入：图片上传 |
| 创建视频 ⚠️ | `create_video` | create_video | 写入：AI 视频生成 |
| 查任务状态 | `get_task_status` | get_task_status | 异步任务进度 |
| 查任务详情 | `get_task_detail` | get_task_detail | 最终视频 URL |
| 查 Cameo 热榜 | `get_cameo_board` | get_cameo_leaderboard | 全平台热榜 |

**Step 4 — 仅按需读 reference 详情层**

按 atom 表中 `file` 字段找对应详情：

| Reference 文件 | 覆盖端点数 | 5 区结构 |
|--------------|-----------|---------|
| `references/post.md` | 6 | 用途 / USE 边界 / IN（参数表）/ OUT（链式字段）/ ERR（错误处理）|
| `references/user.md` | 6 | 同上 |
| `references/tools.md` | 5 | 同上（含写入端点的 requires_user_confirmation 标记）|
| `references/param-mappings.md` | — | 中枢索引（全局红线 + 字段流字典 + 错误处理 + 替换矩阵）|
| `references/endpoints_whitelist.yaml` | 17 | 路径硬白名单 + Pre-call 4 步自检协议 |
| `references/update.md` | — | SkillHub / ClawHub / GitHub 三通道更新 |

**Step 5 — 执行并验证**

- 调用前比对 `endpoints_whitelist.yaml` 完成 4 步 Pre-call 自检（路径 → method → 必填 → 写入确认）
- 收到 **404** → 必须先做 §3.1 (A) 防路径臆造自检（5 步）
- 收到 **400 / 422** → 必须先做 §3.1 (B) 防参数臆造自检（6 步）
- 收到 **业务 code != 0** → 读 `message_zh` 报告用户，**不重试**

### 高级使用

#### 链式调用图谱（来自 recipes/）

| 用户场景 | 链路 | 字段流 | Recipe 位置 |
|---------|------|-------|------------|
| 查作品 + 评论 + 回复 | `get_post` → `list_comments` → `list_replies` | `post_id` → `comment_id` 接力 | `recipes/post.md` |
| 下载作品视频 | `get_post` → `get_download` | `post_id` 复用 | `recipes/post.md` |
| 看作品 + 二创 | `get_post` → `list_remix` | `post_id` 复用 | `recipes/post.md` |
| 用户名 → 用户作品 | `search_users` → `get_profile` → `list_user_posts` | `username` → `user_id` | `recipes/user.md` |
| 文生视频（异步） | `create_video` → 轮询 `get_task_status` → `get_task_detail` | `task_id` 接力 | `recipes/tools.md` |
| 图生视频（异步） | `upload_image` → `create_video` → 轮询 → `get_task_detail` | `image_id` → `task_id` | `recipes/tools.md` |
| Cameo 热榜 → 用户主页 | `get_cameo_board` → `get_profile` | `user_id` 复用 | `recipes/tools.md` |

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
- **使用方式**：匹配 `recipes/post.md` 中的 `trending_post_analysis` Recipe → 自动按 `get_feed` → `get_post` 链路执行
- **预期收益**：通过 Feed + 详情链路快速锁定高 totalScore 作品，提炼可复用的提示词模板

### 场景二：AI 视频研究者批量采集 Cameo 数据

- **角色**：AI 视频领域研究者
- **需求**：需要全平台 Cameo 出镜热榜及上榜用户的完整出镜记录，分析 Cameo 传播规律
- **使用方式**：匹配 `recipes/tools.md` 中的 `cameo_full_dataset` Recipe → 按 `get_cameo_board` → `list_cameo` 批量执行
- **预期收益**：一次调用矩阵覆盖全平台 Top Cameo 用户，构建完整的 Cameo 数据集

### 场景三：自媒体团队批量生成 AI 视频

- **角色**：自媒体内容运营
- **需求**：根据脚本批量生成 Sora2 视频用于多账号矩阵分发
- **使用方式**：匹配 `recipes/tools.md` 中的 `text_to_video_async` Recipe → 串行 `create_video` → 子会话轮询 `get_task_status` → `get_task_detail`
- **预期收益**：异步任务最佳实践确保不阻塞主会话，写入端点防重复扣配额，视频生产效率提升 5–10 倍

### 场景四：社媒分析师追踪 Remix 传播链

- **角色**：社媒数据分析师
- **需求**：跟踪某个爆款作品的全部 Remix 二创及其作者，绘制传播图谱
- **使用方式**：匹配 `recipes/post.md` 中的 `remix_chain_analysis` Recipe → `get_post` → `list_remix` → `get_profile` 三步走
- **预期收益**：完整的内容传播链分析，识别 KOL 二创节点

## 6. 项目架构

### 目录结构（Atoms + Recipes + Reference 三层）

```
maxhub-sora2/
├── SKILL.md                            # Skill 定义与使用文档（本文件）
├── README.md                           # 英文项目说明
├── README_CN.md                        # 中文项目说明
├── _meta.json                          # 版本元信息（version: 3.7.2）
└── references/
    ├── atoms/                          # ⚛️ 原子层（标准化端点封装）
    │   └── _index.md                   #   17 端点 × 业务别名映射表（atom_id / chain_role / idempotent / write_op）
    ├── recipes/                        # 📜 编排层（多步业务场景脚本）
    │   ├── _index.md                   #   全部 Recipe 索引（trigger_keywords + 文件路径）
    │   ├── post.md                     #   作品域 Recipes（详情/评论/Remix/下载等）
    │   ├── user.md                     #   用户域 Recipes（画像/社交/Cameo 出镜）
    │   └── tools.md                    #   工具域 Recipes（视频生成/任务轮询/热榜）
    ├── post.md                         # 📖 Reference 详情：作品域 6 端点（5 区契约）
    ├── user.md                         # 📖 Reference 详情：用户域 6 端点
    ├── tools.md                        # 📖 Reference 详情：工具域 5 端点（含写入）
    ├── param-mappings.md               # 🔗 中枢索引（全局红线 + 字段流字典 + 错误处理 + 替换矩阵）
    ├── endpoints_whitelist.yaml        # 🛡️ 17 端点路径硬白名单 + Pre-call 4 步自检协议
    └── update.md                       # 🔄 SKILL 更新机制（SkillHub / ClawHub / GitHub）
```

### 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 调用方式 | `curl` + Bearer Token | HTTP GET 请求，参数通过 query string 传递 |
| 数据接口 | MaxHub API | `https://www.aconfig.cn/api/v1/sora2/*`，通过 `MAXHUB_API_KEY` 鉴权 |
| 原子层 | atoms/_index.md | 端点封装为 atom，含业务别名 + 链路角色 + 幂等性 + 写入标记 |
| 编排层 | recipes/*.md | 多步业务脚本，含 trigger_keywords + Atomic Steps + 字段流绑定 + on_err |
| 路径校验 | YAML 硬白名单 | `endpoints_whitelist.yaml` 提供 17 端点的逐字符校验 + 4 步 Pre-call 协议 |
| 错误处理 | 决策表 + 自检清单 | HTTP 状态码权威定义 + 防臆造自检（A/B 双轨）+ 重试策略矩阵 |
| 输出格式 | JSON Standard MaxHub Response | `{code, message, message_zh, data, cache_url}` |
| 更新通道 | SkillHub / ClawHub / GitHub | 国内 ⭐⭐⭐ SkillHub（腾讯云 CDN）/ 国际 ⭐⭐⭐ ClawHub / 降级 GitHub |

### API 覆盖范围

| 领域 | 端点数 | 原子数 | Recipes 数 | Reference 文件 |
|------|--------|-------|----------|---------------|
| 作品（Posts） | 6 | 6 | 5+ | `post.md` |
| 用户（Users） | 6 | 6 | 4+ | `user.md` |
| 工具与 Cameo（Tools） | 5 | 5 | 5+ | `tools.md` |
| **合计** | **17** | **17** | **14** | — |

### 关键设计理念

- **三层架构**：Atomic 原子层（端点标准化）+ Recipe 编排层（业务场景脚本）+ Reference 详情层（5 区契约），Agent 按"目标 → recipes → atoms → reference"四步精准定位
- **防臆造四道闸**：白名单（endpoints_whitelist.yaml）→ 强标记（Full path）→ 禁止规则（Forbidden）→ 错误反馈（STOP）
- **Agent 友好 7 大原则**：结构胜于叙述、明确指令优于建议、单一来源、词法稳定性、低 token 密度、边界显式声明、错误处理是契约
- **链式调用图谱**：字段流字典 + Recipe Atomic Steps + 跨 reference 链路三层联动，杜绝 Agent 编造字段名
- **错误处理契约**：HTTP 状态码权威定义 + §3.1 防臆造自检清单（A: 5 步 / B: 6 步）+ 重试策略矩阵 + 端点替换矩阵
