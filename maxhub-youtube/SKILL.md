---
name: maxhub-youtube
description: >-
  Query YouTube data via MaxHub API — video details, channel profiles,
  search, comments, subtitles, streams, Shorts, and community posts.
  Use when user asks about any YouTube video, channel, 评论, 搜索, 字幕, Shorts, or trending content.
  Do NOT use for posting content or account operations (read-only).
license: MIT-0
metadata:
  author: maxhub
  version: "3.7.2"
  openclaw:
    emoji: "▶️"
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
    tags: ["youtube", "视频分析", "频道分析", "评论采集", "搜索", "字幕", "播放列表", "创作者", "视频统计", "海外平台", "内容营销", "数据采集"]
    category: productivity
---

# YouTube 数据助手

## 1. 简介

YouTube 数据查询工具，通过 MaxHub API 接入 YouTube 平台 Web / Web V2 双版本接口，覆盖视频详情、播放流（Streams）、字幕（Captions）、推荐与趋势、频道资料、频道视频与 Shorts、社区帖子（Community Posts）、视频评论与回复、综合搜索与建议词等全部能力。专注服务于 YouTube 内容创作者、跨境短视频研究、频道竞品分析与字幕翻译爬取业务，帮助用户提炼爆款选题、量化频道增长、批量采集字幕与评论。

## 2. 详细功能

### 视频数据
- 查询 YouTube 视频完整详情，含标题、简介、统计、封面、发布时间等
- 支持通过视频 ID 与视频 URL 双入口定位视频
- 拉取视频播放流，覆盖多分辨率与多编码格式
- 提供签名播放 URL 获取能力，确保下游可直接播放
- 拉取视频相关推荐列表，构建内容图谱

### 字幕能力
- 一键获取视频字幕，无需先取字幕地址
- 同时支持需要先获取字幕 URL 的传统流程，作为兜底降级
- 支持多语言字幕选择，覆盖原始语言与目标翻译语言
- 支持多种字幕格式输出（含 JSON 与 VTT 等通用格式）
- 单点字幕接口失败时可自动切换至备用接口，保证可用性

### 频道画像
- 查询频道完整资料，含订阅数、视频数、简介、头图等
- 拉取频道全部长视频列表，支持翻页深度采集
- 拉取频道全部 Shorts 短视频列表
- 拉取频道社区帖子，洞察非视频形态的运营动作
- 提供频道描述详情接口，获取更丰富的简介字段

### 评论与回复
- 拉取视频一级评论列表，支持排序与翻页
- 拉取指定评论下的二级回复链路
- 查询社区帖子详情、帖子评论与帖子评论的二级回复
- 支持基于游标的连续翻页，便于批量采集

### 搜索能力
- 提供综合搜索，一次返回视频、频道、播放列表等多类型结果
- 支持 Shorts 短视频专项搜索
- 支持频道专项搜索
- 提供搜索建议词，辅助关键词扩展与选题
- 支持按上传时间、时长、特征、排序等条件过滤

### 趋势与推荐
- 按地区与分区获取 YouTube 趋势视频榜
- 拉取与目标视频相关的推荐视频列表
- 趋势与相关视频结合使用，构建内容流量来源分析

### 频道 ID 与 URL 互转
- 将各种频道链接（包括 @handle、自定义路径、标准频道路径）解析为标准频道 ID
- 通过频道 ID 反查标准频道 URL
- 支持中间多种格式输入，避免下游因 ID 不规范导致查询失败

### 双版本接口并行
- 业务能力同时覆盖两套接口版本
- 不同版本字段丰富度各有侧重，可按场景择优
- 主链路出现异常时支持自动降级到备用版本
- 部分能力（如字幕、视频流）在两版本之间形成互补

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
| 🚫 禁止臆造路径 | 仅使用 `references/endpoints_whitelist.yaml` 中的端点，**不得自行拼接、改 web/web_v2 段、加路径** |
| 📋 数据流向第三方 | 所有请求发送至 `https://www.aconfig.cn`，请使用独立测试账号并定期轮换 API Key |
| 🔑 凭证保护 | 不暴露 API Key、Cookie、Token 至日志或对话 |
| 🔀 版本不互通 | Web 与 Web V2 端点参数不兼容，**禁止跨版本套用参数名（如 `search_query` vs `keyword`）** |

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
| 查视频 / 流媒体 / 字幕 / 推荐 / 趋势 / 签名 URL | `references/video.md` | 视频详情、Streams、Captions、相关视频、趋势视频（13 端点） |
| 查频道 / 长视频 / Shorts / 社区帖 / ID 互转 | `references/channel.md` | 频道信息、视频、Shorts、社区帖子、ID/URL 互转（12 端点） |
| 综合搜索 / Shorts 搜索 / 频道搜索 / 建议词 | `references/search.md` | 综合搜索、Shorts 搜索、频道搜索、搜索建议（7 端点） |
| 查评论 / 回复 / 帖子详情 / 帖子评论 | `references/comments.md` | 视频评论、评论回复、社区帖子详情与评论回复（5 端点） |
| 跨端点参数查询 / 字段流追溯 | `references/param-mappings.md` | 全局红线 + 端点路由 + Web/Web V2 字段流字典 + 错误处理总览 |
| 路径白名单硬校验 | `references/endpoints_whitelist.yaml` | 37 端点的硬白名单 + Pre-call 4 步自检协议 |

**Step 3 — 构建最小调用计划**

- ✅ 优先使用最少端点完成任务，能用一个端点就不用两个
- ✅ Web / Web V2 切换时**必须**重新读取该版本的 reference，禁止套用对版参数
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
| 搜索 → 视频详情 | `web_v2_get_general_search_v2` → `web_v2_get_video_info_v2` | `keyword` → `video_id` |
| 查视频 + 评论 + 回复 | `web_v2_get_video_info` → `web_v2_get_video_comments` → `web_v2_get_video_comment_replies` | `video_id` → `continuation_token` 接力 |
| 查频道 → 视频列表 | `web_get_channel_id` → `web_get_channel_info` → `web_get_channel_videos_v2` | `channel_name` → `channel_id` |
| 频道全面分析 | `web_v2_get_channel_description` → `web_v2_get_channel_videos` + `web_v2_get_channel_shorts` + `web_v2_get_channel_community_posts` | `channel_id` 复用 |
| 字幕双端互降 | `web_v2_get_video_captions` 失败 → 降级 `web_get_video_subtitles` | `video_id` → `subtitle_url` |
| 视频流 + 签名 URL | `web_v2_get_video_streams` → `web_v2_get_signed_stream_url` | `video_id` → `itag` |
| 社区帖子 + 评论 | `web_v2_get_post_detail` → `web_v2_get_post_comments` → `web_v2_get_post_comment_replies` | `post_id` → `continuation_token` |

> ⚠️ **字幕选型陷阱**：`web/get_video_subtitles` 必填 `subtitle_url`（需要先从 `get_video_info` 拿到字幕地址），而 `web_v2/get_video_captions` 直接传 `video_id` 即可。优先使用 V2，失败再回退 V1。

#### 防臆造自检清单（强制前置步骤）

**收到 404 时（A）**：
1. 路径白名单逐字符比对（重点核对 `web/` vs `web_v2/` 段）→ 不在清单中 STOP
2. Method 比对 → 不等 STOP
3. 参数键名比对 → 有清单外参数 STOP
4. 资源 ID 来源溯源 → Agent 编造的 STOP
5. 全通过才判定"上游资源不存在"

**收到 400 / 422 时（B）**：
1. 参数名严格比对（V1 用 `search_query`、V2 用 `keyword`）
2. 必填项齐全 + oneOf 二选一逻辑（V2 大量端点支持 `video_id` / `video_url` 二选一）
3. 类型与格式严格匹配（continuation_token 整段透传、itag 整数）
4. 传参方式正确（query vs body）
5. 没有清单外的臆造参数（如把 V1 的 `nextToken` 用到 V2 的 `continuation_token`）
6. 全通过才按 `message_zh` 排查

#### Web / Web V2 选型建议

| 维度 | Web (V1) | Web V2 |
|---|---|---|
| 端点数量 | 13+ | 24+ |
| 字段丰富度 | 基础 | 丰富（含 need_format / language_code / country_code 多语言） |
| 翻页参数 | `nextToken` / `continuation_token` | 统一 `continuation_token` |
| 字幕能力 | `get_video_subtitles` 需 `subtitle_url` | `get_video_captions` 仅需 `video_id` |
| 推荐场景 | 趋势视频 / 频道短视频 / 字幕 URL 抓取 | 视频 / 频道 / 评论 / 搜索主链路 |

#### SKILL 版本更新

| 触发条件 | 推荐操作 |
|---------|---------|
| 合法路径持续 404 / 410 | `skillhub upgrade maxhub-youtube`（国内）或 `clawhub upgrade maxhub-youtube`（国际） |
| 用户问"版本是多少" | 当前版本 v3.7.2，访问 https://skillhub.cn/skills/maxhub-youtube |
| 多端点连续 410 | `skillhub upgrade maxhub-youtube --force` |
| 401 / 402 / 403 | **不是版本问题**，去 https://www.aconfig.cn 处理 |

### 常用命令速查表

| 场景 | 命令 |
|---|---|
| 查 API Key | `[ -n "${MAXHUB_API_KEY:-}" ] && echo "ok" \|\| echo "missing"` |
| 查视频详情（V2） | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/youtube/web_v2/get_video_info?video_id=xxx"` |
| 查视频字幕（V2） | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/youtube/web_v2/get_video_captions?video_id=xxx&language_code=en"` |
| 查频道视频（V2） | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/youtube/web_v2/get_channel_videos?channel_id=UCxxx"` |
| 综合搜索（V2） | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/youtube/web_v2/get_general_search_v2?keyword=xxx"` |
| 检查 SKILL 更新 | `skillhub info maxhub-youtube` 或 `clawhub info maxhub-youtube` |

## 5. 使用场景

### 场景一：YouTube 内容创作者寻找爆款规律

- **角色**：YouTube 频道运营 / 长视频创作者
- **需求**：分析自己赛道的趋势视频特征，提炼标题与封面公式
- **使用方式**：`web_get_trending_videos` 按地区拉趋势榜 → 取 `video_id` → 链式调 `web_v2_get_video_info_v2` 取标题、时长、播放、互动；对 Top 视频再 `web_v2_get_video_comments` 抽取观众反馈关键词
- **预期收益**：1 小时内梳理 50+ 趋势视频共性，输出可复用的标题与开场 Hook 模板

### 场景二：跨境短视频研究（Shorts 选品）

- **角色**：跨境内容研究员 / TikTok 矩阵运营
- **需求**：监控 YouTube Shorts 的热门话题与品类，反推选品方向
- **使用方式**：`web_v2_get_shorts_search_v2` 关键词搜索 → 取 video_id → `web_v2_get_video_info_v2` 取播放与互动；并行 `web_v2_get_channel_shorts` 抓取头部 Shorts 频道全部短视频
- **预期收益**：识别上升期 Shorts 品类与创作者，反向指导跨境选品与广告 Hook 设计

### 场景三：频道竞品全面分析

- **角色**：频道增长经理 / MCN 数据分析
- **需求**：对 10 个竞品频道进行长视频 + Shorts + 社区帖子 + 评论的 360° 分析
- **使用方式**：`web_get_channel_id` 解析 `@handle` → `web_v2_get_channel_description` 取频道概况 → `web_v2_get_channel_videos` + `web_v2_get_channel_shorts` + `web_v2_get_channel_community_posts` 全量采集 → 抽样视频 `web_v2_get_video_comments` 看观众结构
- **预期收益**：构建竞品频道全维度看板，识别其内容节奏、社区运营、爆款规律

### 场景四：字幕翻译爬取与素材库

- **角色**：知识博主 / 海外内容搬运团队
- **需求**：批量获取目标频道全部视频的多语言字幕，用于翻译与二创
- **使用方式**：`web_v2_get_channel_videos` 翻页采集 video_id → `web_v2_get_video_captions` 拉原始字幕 → 失败时降级 `web_get_video_info` 拿 subtitle_url，再 `web_get_video_subtitles` 指定 `target_lang` 翻译
- **预期收益**：构建带时间码的中英对照字幕素材库，支撑学习笔记、二创剪辑、知识专题制作

## 6. 项目架构

### 目录结构

```
maxhub-youtube/
├── SKILL.md                            # Skill 定义与使用文档（本文件）
├── README.md                           # 英文项目说明
├── README_CN.md                        # 中文项目说明
├── _meta.json                          # 版本元信息（version: 3.7.2）
└── references/
    ├── endpoints_whitelist.yaml        # 37 端点路径硬白名单 + Pre-call 4 步自检协议
    ├── param-mappings.md               # 中枢索引（全局红线 + 字段流字典 + 错误处理 + Web/V2 差异）
    ├── video.md                        # 视频域：详情/Streams/Captions/相关/趋势（13 端点）
    ├── channel.md                      # 频道域：信息/视频/Shorts/社区帖/ID互转（12 端点）
    ├── search.md                       # 搜索域：综合/Shorts/频道/建议词（7 端点）
    └── comments.md                     # 评论域：视频评论/回复/帖子评论（5 端点）
```

### 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 调用方式 | `curl` + Bearer Token | HTTP GET 请求，参数通过 query string 传递 |
| 数据接口 | MaxHub API | `https://www.aconfig.cn/api/v1/youtube/{web,web_v2}/*`，通过 `MAXHUB_API_KEY` 鉴权 |
| 路径校验 | YAML 硬白名单 | `endpoints_whitelist.yaml` 提供 37 端点的逐字符校验 + 4 步 Pre-call 协议 |
| 错误处理 | 决策表 + 自检清单 | HTTP 状态码权威定义 + 防臆造自检（A/B 双轨）+ Web↔Web V2 替换矩阵 |
| 输出格式 | JSON Standard MaxHub Response | `{code, message, message_zh, data, cache_url}` |
| 更新通道 | SkillHub / ClawHub / GitHub | 国内 ⭐⭐⭐ SkillHub（腾讯云 CDN）/ 国际 ⭐⭐⭐ ClawHub / 降级 GitHub |

### API 覆盖范围

| 领域 | 端点数 | Reference 文件 |
|------|--------|---------------|
| 视频（Video / Streams / Captions） | 13 | `video.md` |
| 频道（Channel / Shorts / Community） | 12 | `channel.md` |
| 搜索（Search / Suggestions） | 7 | `search.md` |
| 评论（Comments / Post Replies） | 5 | `comments.md` |
| **合计** | **37** | — |

### 关键设计理念

- **防臆造四道闸**：白名单（endpoints_whitelist.yaml）→ 强标记（Full path）→ 禁止规则（Forbidden）→ 错误反馈（STOP）
- **Web / Web V2 双版本**：两版独立维护参数命名（`search_query` vs `keyword`），杜绝 Agent 跨版本套用
- **链式调用图谱**：字段流字典 + Chain Recipes + 跨 reference 链路三层联动，重点防护字幕双端互降与 channel_id 解析陷阱
- **错误处理契约**：HTTP 状态码权威定义 + §3.1 防臆造自检清单（A: 5 步 / B: 6 步）+ Web↔Web V2 替换矩阵
