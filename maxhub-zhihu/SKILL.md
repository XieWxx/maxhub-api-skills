---
name: maxhub-zhihu
description: >-
  Query Zhihu (知乎) data via MaxHub API — user profiles, articles, search,
  hot lists, columns, Q&A, and comments.
  Use when user asks about 知乎, zhihu users, zhihu questions, zhihu search,
  zhihu hot list, or zhihu columns.
  Do NOT use for posting content or account operations (read-only).
license: MIT-0
metadata:
  author: maxhub
  version: "3.7.2"
  openclaw:
    emoji: "💡"
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
    tags: ["知乎", "zhihu", "问答", "内容分析", "用户分析", "热门话题", "搜索", "专栏", "知识社区", "舆情监控", "专业内容", "数据采集"]
    category: productivity
---

# 知乎 数据助手

## 1. 简介

知乎数据查询工具，通过 MaxHub API 接入中文专业问答与知识社区知乎，覆盖问题回答、专栏文章、评论 / 子评论、热榜推荐、视频列表、用户资料、用户关注 / 粉丝 / 文章 / 收藏 / 话题、综合搜索 + AI 搜索 + 多类目搜索（文章 / 用户 / 话题 / 视频 / 专栏 / 学者 / 盐选 / 电子书）等核心能力。专注服务于知乎内容研究、问答营销、KOL 分析、话题追踪与舆情场景，帮助用户深度挖掘知乎高质量内容与专业用户画像。

## 2. 功能特性

- 🦓 **专栏 + 问答全维度** — 专栏文章 + 详情 + 推荐 + 关系 + 评论配置；问题回答全量拉取（支持 cursor / order）

- 💬 **评论双链路** — `fetch_comment_v5`（answer_id 主评论）+ `fetch_sub_comment_v5`（comment_id 子评论），完整还原讨论结构

- 🔥 **热榜矩阵** — 热门推荐、热榜列表、视频列表三类入口，识别全站高热内容

- 🔍 **搜索 13 件套** — 文章 / 用户 / 话题 / 学者 / AI / 视频 / 专栏 / 盐选 / 电子书 / 预设搜索 / 推荐搜索 / 联想词搜索全覆盖

- 🤖 **AI 搜索异步链路** — `fetch_ai_search` 提交 message_content → 轮询 `fetch_ai_search_result`（message_id）取最终答复

- 👤 **用户全景画像** — 用户资料 + 关注 / 粉丝 + 文章 + 收藏文章 + 关注专栏 / 问题 / 收藏夹 / 话题 + 推荐用户

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
| 🚫 禁止臆造路径 | 仅使用 `references/endpoints_whitelist.yaml` 中的端点，**不得自行拼接、改 v5/v3 段、加路径段** |
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
| 查文章 / 专栏 / 评论 / 问答 / 热榜 / 视频 | `references/post.md` | 专栏文章、专栏详情、推荐、关系、评论配置、v5 评论、v5 子评论、问题回答、热门推荐、热榜、视频列表（11 端点） |
| 多类目搜索 / AI 搜索 / 联想 | `references/search.md` | 文章/用户/话题/学者/AI/视频/专栏/盐选/电子书 v3 + 预设/推荐/联想（13 端点） |
| 查用户 / 关注 / 粉丝 / 收藏 / 话题 | `references/user.md` | 用户资料、关注/粉丝、文章、收藏文章、关注专栏/问题/收藏夹/话题、推荐用户（10 端点） |
| 跨端点参数查询 / 字段流追溯 | `references/param-mappings.md` | 全局红线 + 端点路由 + 字段流字典 + 错误处理总览 |
| 路径白名单硬校验 | `references/endpoints_whitelist.yaml` | 34 个端点的硬白名单 + Pre-call 4 步自检协议 |
| SKILL 版本检查与升级 | `references/update.md` | SkillHub / ClawHub / GitHub 三通道更新 |

**Step 3 — 构建最小调用计划**

- ✅ 优先使用最少端点完成任务，能用一个端点就不用两个
- ✅ AI 搜索是**异步链路**：必须 `fetch_ai_search` → 轮询 `fetch_ai_search_result`
- ❌ 禁止"先 head/tail 试运行"或"先调一个看看"等探索性调用

**Step 4 — 执行并验证**

- 调用前比对 `endpoints_whitelist.yaml` 完成 4 步 Pre-call 自检（路径 → method → 必填 → 写入确认）
- 收到 **404** → 必须先做防路径臆造自检（5 步），尤其确认 `web` 段与 `_v3` / `_v5` 后缀
- 收到 **400 / 422** → 必须先做防参数臆造自检（6 步），重点检查 `answer_id` / `question_id` / `article_id` / `column_id` / `user_url_token` 区分
- 收到 **业务 code != 0** → 读 `message_zh` 报告用户，**不重试**

### 高级使用

#### 链式调用图谱（Chain Recipes）

| 用户场景 | 链路 | 字段流 |
|---------|------|-------|
| 文章 → 详情 → 评论 | `fetch_column_articles` → `fetch_column_article_detail` → `fetch_comment_v5` | `column_id` → `article_id` → `answer_id` |
| 评论 → 子评论 | `fetch_comment_v5` → `fetch_sub_comment_v5` | `comment_id` 接力 |
| 问题 → 全部回答 → 子评论 | `fetch_question_answers` → `fetch_comment_v5` → `fetch_sub_comment_v5` | `question_id` → `answer_id` → `comment_id` |
| 热榜 → 问题回答 → 评论 | `fetch_hot_list` → `fetch_question_answers` → `fetch_comment_v5` | 热榜 → `question_id` → `answer_id` |
| 关键词 → 文章搜索 → 详情 | `fetch_article_search_v3` → `fetch_column_article_detail` | `keyword` → `article_id` |
| AI 搜索（异步） | `fetch_ai_search` → 轮询 `fetch_ai_search_result` | `message_content` → `message_id` |
| 用户 → 文章 / 关注 | `fetch_user_info` → `fetch_user_articles` + `fetch_user_followees` + `fetch_user_followers` | `user_url_token` 复用 |
| 用户搜索 → 主页 → 收藏 / 关注话题 | `fetch_user_search_v3` → `fetch_user_info` → `fetch_user_follow_topics` | `keyword` → `user_url_token` |

#### 防臆造自检清单（强制前置步骤）

**收到 404 时（A）**：
1. 路径白名单逐字符比对 → 不在清单中 STOP
2. Method 比对（注意 `fetch_scholar_search_v3` 是 POST）→ 不等 STOP
3. 参数键名比对 → 有清单外参数 STOP
4. `_v3` / `_v5` 后缀是否写错 → 错段 STOP
5. 资源 ID 来源溯源 → Agent 编造的 STOP
6. 全通过才判定"上游资源不存在"

**收到 400 / 422 时（B）**：
1. 参数名严格比对（`answer_id` / `question_id` / `article_id` / `column_id` / `user_url_token` / `comment_id` / `message_id` 不可混用）
2. 必填项齐全
3. 类型与格式严格匹配（pattern / enum）
4. 传参方式正确（GET 用 query / POST 用 body）
5. 没有 IN 表外的臆造参数
6. 全通过才按 `message_zh` 排查

#### 异步任务最佳实践（仅适用 fetch_ai_search）

- **轮询间隔**：3–5 秒一次
- **状态语义**：未返回最终结果即继续轮询
- **轮询上限**：建议 2 分钟封顶；超时后把 `message_id` 返回用户
- **推荐**：宿主 Agent 支持子会话时，spawn 子会话专职轮询，主会话保持响应

#### SKILL 版本更新

| 触发条件 | 推荐操作 |
|---------|---------|
| 合法路径持续 404 / 410 | `skillhub upgrade maxhub-zhihu`（国内）或 `clawhub upgrade maxhub-zhihu`（国际） |
| 用户问"版本是多少" | 当前版本 v3.7.2，访问 https://skillhub.cn/skills/maxhub-zhihu |
| 多端点连续 410 | `skillhub upgrade maxhub-zhihu --force` |
| 401 / 402 / 403 | **不是版本问题**，去 https://www.aconfig.cn 处理 |

### 常用命令速查表

| 场景 | 命令 |
|---|---|
| 查 API Key | `[ -n "${MAXHUB_API_KEY:-}" ] && echo "ok" \|\| echo "missing"` |
| 查热榜 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/zhihu/web/fetch_hot_list"` |
| 查问题全部回答 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/zhihu/web/fetch_question_answers?question_id=xxx"` |
| 查回答评论 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/zhihu/web/fetch_comment_v5?answer_id=xxx"` |
| 查用户主页 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/zhihu/web/fetch_user_info?user_url_token=xxx"` |
| 文章搜索 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/zhihu/web/fetch_article_search_v3?keyword=AI"` |
| 检查 SKILL 更新 | `skillhub info maxhub-zhihu` 或 `clawhub info maxhub-zhihu` |

## 5. 使用场景

### 场景一：知乎内容研究员追踪问题热度

- **角色**：内容研究员
- **需求**：监测某个问题在知乎的全部高赞回答与评论争议焦点
- **使用方式**：`fetch_question_answers`（order=default 拉高赞）→ 头部回答取 `answer_id` → `fetch_comment_v5` + `fetch_sub_comment_v5` 完整还原讨论
- **预期收益**：构建问题级的内容 + 评论数据集，识别用户共鸣点与反对观点

### 场景二：问答营销团队挖掘投放机会

- **角色**：知乎问答营销
- **需求**：在垂类话题下识别高曝光低回答数的"蓝海问题"
- **使用方式**：`fetch_article_search_v3` + `fetch_topic_search_v3` 拉问题列表 → `fetch_question_answers` 看回答数与赞数 → 链式调 `fetch_user_info` 看头部回答者画像
- **预期收益**：精准锁定高 ROI 投放问题，营销转化率提升 3 倍

### 场景三：KOL 分析师构建知乎大 V 画像

- **角色**：MCN / 公关分析师
- **需求**：从 user_url_token 出发完整还原 KOL 的内容矩阵与圈层关系
- **使用方式**：`fetch_user_info` → `fetch_user_articles` + `fetch_user_followees` + `fetch_user_follow_topics` + `fetch_user_follow_columns` 全维度并行
- **预期收益**：知乎 KOL 完整画像 + 关注图谱，识别其立场与圈层影响力

### 场景四：舆情研究员监测话题趋势

- **角色**：品牌舆情监控
- **需求**：周期性监测品牌词在知乎的文章 / 视频 / 专栏 / 用户多维度提及
- **使用方式**：`fetch_article_search_v3` + `fetch_video_search_v3` + `fetch_column_search_v3` + `fetch_user_search_v3` 并行检索 → 异常增长贴进 `fetch_column_article_detail` + `fetch_comment_v5` 深度复盘
- **预期收益**：知乎舆情多维监测 + 高优先级讨论快速触达，缩短危机响应时间

## 6. 项目架构

### 目录结构

```
maxhub-zhihu/
├── SKILL.md                            # Skill 定义与使用文档（本文件）
├── README.md                           # 英文项目说明
├── README_CN.md                        # 中文项目说明
├── _meta.json                          # 版本元信息（version: 3.7.2）
└── references/
    ├── endpoints_whitelist.yaml        # 34 端点路径硬白名单 + Pre-call 4 步自检协议
    ├── param-mappings.md               # 中枢索引（全局红线 + 字段流字典 + 错误处理）
    ├── post.md                         # 内容域：专栏/文章/评论/问答/热榜/视频（11 端点）
    ├── search.md                       # 搜索域：文章/用户/话题/学者/AI/视频/专栏/盐选/电子书（13 端点）
    ├── user.md                         # 用户域：资料/关注/粉丝/文章/收藏/话题（10 端点）
    └── update.md                       # SKILL 更新机制（SkillHub / ClawHub / GitHub）
```

### 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 调用方式 | `curl` + Bearer Token | HTTP GET / POST 请求，参数通过 query string 或 body 传递 |
| 数据接口 | MaxHub API | `https://www.aconfig.cn/api/v1/zhihu/web/*`，通过 `MAXHUB_API_KEY` 鉴权 |
| 路径校验 | YAML 硬白名单 | `endpoints_whitelist.yaml` 提供 34 端点的逐字符校验 + 4 步 Pre-call 协议 |
| 错误处理 | 决策表 + 自检清单 | HTTP 状态码权威定义 + 防臆造自检（A/B 双轨）+ 搜索域降级矩阵 |
| 输出格式 | JSON Standard MaxHub Response | `{code, message, message_zh, data, cache_url}` |
| 更新通道 | SkillHub / ClawHub / GitHub | 国内 ⭐⭐⭐ SkillHub（腾讯云 CDN）/ 国际 ⭐⭐⭐ ClawHub / 降级 GitHub |

### API 覆盖范围

| 领域 | 端点数 | Reference 文件 |
|------|--------|---------------|
| 内容（Post / Content） | 11 | `post.md` |
| 搜索（Search） | 13 | `search.md` |
| 用户（User） | 10 | `user.md` |
| **合计** | **34** | — |

### 关键设计理念

- **防臆造四道闸**：白名单（endpoints_whitelist.yaml）→ 强标记（Full path）→ 禁止规则（Forbidden）→ 错误反馈（STOP）
- **AI 搜索异步契约**：`fetch_ai_search` + 轮询 `fetch_ai_search_result` + 超时降级到 v3 文章搜索
- **链式调用图谱**：字段流字典（`article_id` / `answer_id` / `question_id` / `column_id` / `user_url_token` / `comment_id` / `message_id`）+ Chain Recipes + 跨 reference 链路三层联动
- **错误处理契约**：HTTP 状态码权威定义 + 防臆造自检清单（A: 5 步 / B: 6 步）+ 搜索域降级矩阵
