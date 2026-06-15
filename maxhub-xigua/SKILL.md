---
name: maxhub-xigua
description: >-
  Query Xigua (西瓜视频) data via MaxHub API — video details, play URL,
  user profiles, search, and comments.
  Use when user asks about any 西瓜视频 content, 视频, 用户, 搜索, or 评论.
  Do NOT use for posting content or account operations (read-only).
license: MIT-0
metadata:
  author: maxhub
  version: "3.7.2"
  openclaw:
    emoji: "🍉"
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
    tags: ["西瓜视频", "xigua", "视频分析", "用户分析", "中视频", "搜索", "评论", "数据采集"]
    category: productivity
---

# 西瓜视频 数据助手

## 1. 简介

西瓜视频数据查询工具，通过 MaxHub API 接入字节跳动旗下中视频平台西瓜视频，覆盖视频详情（v1 + v2）、视频播放地址、视频评论列表、视频综合搜索、用户资料、用户作品列表等核心能力。专注服务于西瓜视频内容采集、用户研究、中视频内容分析与跨平台数据对齐场景，帮助用户高效获取西瓜视频数据，构建中视频赛道的内容情报基底。

## 2. 功能特性

- 🍉 **视频详情双版本** — `fetch_one_video`（v1）与 `fetch_one_video_v2`（v2）双链路兜底，规避字段空洞

- ▶️ **播放地址直取** — `fetch_one_video_play_url` 单接口取无水印播放 URL

- 💬 **评论分页链路** — `fetch_video_comment_list`（item_id + offset + count）支持翻页采集

- 🔍 **视频综合搜索** — 支持关键词 + 排序 + 时长范围（min_duration / max_duration）多维过滤

- 👤 **用户全景画像** — 用户资料 + 用户作品列表（支持 `max_behot_time` 翻页）

- 🛡️ **防臆造硬白名单** — `endpoints_whitelist.yaml` 路径硬校验，404/400 强制自检清单，杜绝 Agent 臆造 API 地址或参数

- 🔗 **链式调用图谱** — 7 个端点的字段流字典 + Chain Recipes，明确 item_id / user_id / keyword 在端点间的传递路径

- 📊 **错误处理契约** — HTTP 状态码权威定义 + 重试策略矩阵 + v1 ↔ v2 视频详情替换矩阵

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
| 🚫 禁止臆造路径 | 仅使用 `references/endpoints_whitelist.yaml` 中的端点，**不得自行拼接、改 v1/v2 段、加路径段** |
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
| 查视频 / 播放地址 / 评论 / 搜索 | `references/post.md` | 视频详情 v1+v2、播放 URL、评论、视频搜索（5 端点） |
| 查用户 / 作品 | `references/user.md` | 用户资料、用户作品列表（2 端点） |
| 跨端点参数查询 / 字段流追溯 | `references/param-mappings.md` | 全局红线 + 端点路由 + 字段流字典 + 错误处理总览 |
| 路径白名单硬校验 | `references/endpoints_whitelist.yaml` | 7 个端点的硬白名单 + Pre-call 4 步自检协议 |
| SKILL 版本检查与升级 | `references/update.md` | SkillHub / ClawHub / GitHub 三通道更新 |

**Step 3 — 构建最小调用计划**

- ✅ 优先使用最少端点完成任务，能用一个端点就不用两个
- ✅ 视频详情**优先 v2**；v2 缺字段时再降级 v1
- ❌ 禁止"先 head/tail 试运行"或"先调一个看看"等探索性调用

**Step 4 — 执行并验证**

- 调用前比对 `endpoints_whitelist.yaml` 完成 4 步 Pre-call 自检（路径 → method → 必填 → 写入确认）
- 收到 **404** → 必须先做防路径臆造自检（5 步），尤其确认 `app/v2` 段
- 收到 **400 / 422** → 必须先做防参数臆造自检（6 步），重点检查 `item_id` / `user_id` 区分
- 收到 **业务 code != 0** → 读 `message_zh` 报告用户，**不重试**

### 高级使用

#### 链式调用图谱（Chain Recipes）

| 用户场景 | 链路 | 字段流 |
|---------|------|-------|
| 视频详情 + 评论 | `fetch_one_video_v2` → `fetch_video_comment_list` | `item_id` 复用 |
| 视频详情 + 播放地址 | `fetch_one_video_v2` → `fetch_one_video_play_url` | `item_id` 复用 |
| 关键词 → 搜索 → 详情 | `search_video` → `fetch_one_video_v2` | `keyword` → `item_id` |
| 用户 → 作品 → 视频详情 | `fetch_user_info` → `fetch_user_post_list` → `fetch_one_video_v2` | `user_id` → `item_id` |
| 视频 v1 / v2 双采 | `fetch_one_video` + `fetch_one_video_v2` 并行 | 同 `item_id` 双向校对 |

#### 防臆造自检清单（强制前置步骤）

**收到 404 时（A）**：
1. 路径白名单逐字符比对 → 不在清单中 STOP
2. Method 比对 → 不等 STOP
3. 参数键名比对 → 有清单外参数 STOP
4. `app/v2` 段是否丢失 → 错段 STOP
5. 资源 ID 来源溯源 → Agent 编造的 STOP
6. 全通过才判定"上游资源不存在"

**收到 400 / 422 时（B）**：
1. 参数名严格比对（`item_id` / `user_id` / `keyword` 不可混用）
2. 必填项齐全
3. 类型与格式严格匹配（`min_duration` / `max_duration` 为数值秒数）
4. 传参方式正确（query string）
5. 没有 IN 表外的臆造参数
6. 全通过才按 `message_zh` 排查

#### v1 ↔ v2 视频详情替换矩阵

| 优先接口 | 降级接口 | 触发条件 |
|---|---|---|
| `fetch_one_video_v2`（item_id） | `fetch_one_video`（item_id） | v2 字段空洞或 410 时降级 v1 |

#### SKILL 版本更新

| 触发条件 | 推荐操作 |
|---------|---------|
| 合法路径持续 404 / 410 | `skillhub upgrade maxhub-xigua`（国内）或 `clawhub upgrade maxhub-xigua`（国际） |
| 用户问"版本是多少" | 当前版本 v3.7.2，访问 https://skillhub.cn/skills/maxhub-xigua |
| 多端点连续 410 | `skillhub upgrade maxhub-xigua --force` |
| 401 / 402 / 403 | **不是版本问题**，去 https://www.aconfig.cn 处理 |

### 常用命令速查表

| 场景 | 命令 |
|---|---|
| 查 API Key | `[ -n "${MAXHUB_API_KEY:-}" ] && echo "ok" \|\| echo "missing"` |
| 查视频详情（v2） | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/xigua/app/v2/fetch_one_video_v2?item_id=xxx"` |
| 查播放地址 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/xigua/app/v2/fetch_one_video_play_url?item_id=xxx"` |
| 查评论 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/xigua/app/v2/fetch_video_comment_list?item_id=xxx"` |
| 视频搜索 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/xigua/app/v2/search_video?keyword=AI"` |
| 查用户作品 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/xigua/app/v2/fetch_user_post_list?user_id=xxx"` |
| 检查 SKILL 更新 | `skillhub info maxhub-xigua` 或 `clawhub info maxhub-xigua` |

## 5. 使用场景

### 场景一：西瓜视频内容采集与素材库构建

- **角色**：视频内容工程师
- **需求**：批量采集垂类视频的元数据 + 播放地址 + 评论用于素材库
- **使用方式**：`search_video`（关键词 + 时长筛选）→ 取 `item_id` → 并行调 `fetch_one_video_v2` + `fetch_one_video_play_url` + `fetch_video_comment_list`
- **预期收益**：可量化、可下载、可分析的西瓜视频素材数据库

### 场景二：中视频用户研究

- **角色**：MCN 数据研究员
- **需求**：从西瓜视频用户出发完整还原其作品矩阵
- **使用方式**：`fetch_user_info`（user_id）→ `fetch_user_post_list`（max_behot_time 翻页）→ 链式调 `fetch_one_video_v2` 提取每条作品详情
- **预期收益**：构建用户级中视频作品全景画像，识别更新频率与内容偏好

### 场景三：跨平台视频数据对齐

- **角色**：跨平台数据分析师
- **需求**：同一视频在西瓜与其他中视频平台的数据对比
- **使用方式**：`fetch_one_video` + `fetch_one_video_v2` 双采 → 提取通用字段 → 与其他平台数据 schema 对齐
- **预期收益**：实现跨平台中视频数据规范化，输入大盘 BI 仪表

### 场景四：视频选题研究

- **角色**：内容选题研究员
- **需求**：识别西瓜视频热门选题与时长结构
- **使用方式**：`search_video`（按 `min_duration` / `max_duration` 筛选垂类时长）→ 取 `item_id` 链式调 `fetch_one_video_v2` 提取标题 + 互动
- **预期收益**：精准的选题趋势 + 时长偏好洞察，反哺内容生产决策

## 6. 项目架构

### 目录结构

```
maxhub-xigua/
├── SKILL.md                            # Skill 定义与使用文档（本文件）
├── README.md                           # 英文项目说明
├── README_CN.md                        # 中文项目说明
├── _meta.json                          # 版本元信息（version: 3.7.2）
└── references/
    ├── endpoints_whitelist.yaml        # 7 端点路径硬白名单 + Pre-call 4 步自检协议
    ├── param-mappings.md               # 中枢索引（全局红线 + 字段流字典 + 错误处理）
    ├── post.md                         # 视频域：详情 v1+v2/播放地址/评论/搜索（5 端点）
    ├── user.md                         # 用户域：资料/作品（2 端点）
    └── update.md                       # SKILL 更新机制（SkillHub / ClawHub / GitHub）
```

### 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 调用方式 | `curl` + Bearer Token | HTTP GET 请求，参数通过 query string 传递 |
| 数据接口 | MaxHub API | `https://www.aconfig.cn/api/v1/xigua/app/v2/*`，通过 `MAXHUB_API_KEY` 鉴权 |
| 路径校验 | YAML 硬白名单 | `endpoints_whitelist.yaml` 提供 7 端点的逐字符校验 + 4 步 Pre-call 协议 |
| 错误处理 | 决策表 + 自检清单 | HTTP 状态码权威定义 + 防臆造自检（A/B 双轨）+ v1↔v2 替换矩阵 |
| 输出格式 | JSON Standard MaxHub Response | `{code, message, message_zh, data, cache_url}` |
| 更新通道 | SkillHub / ClawHub / GitHub | 国内 ⭐⭐⭐ SkillHub（腾讯云 CDN）/ 国际 ⭐⭐⭐ ClawHub / 降级 GitHub |

### API 覆盖范围

| 领域 | 端点数 | Reference 文件 |
|------|--------|---------------|
| 视频（Post） | 5 | `post.md` |
| 用户（User） | 2 | `user.md` |
| **合计** | **7** | — |

### 关键设计理念

- **防臆造四道闸**：白名单（endpoints_whitelist.yaml）→ 强标记（Full path）→ 禁止规则（Forbidden）→ 错误反馈（STOP）
- **v1 / v2 视频详情双版本契约**：v2 优先 + v1 降级兜底，规避字段空洞
- **链式调用图谱**：字段流字典（`item_id` / `user_id` / `keyword`）+ Chain Recipes
- **错误处理契约**：HTTP 状态码权威定义 + 防臆造自检清单（A: 5 步 / B: 6 步）+ v1↔v2 替换矩阵
