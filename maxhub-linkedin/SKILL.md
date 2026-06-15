---
name: maxhub-linkedin
description: >-
  Query LinkedIn (领英) data via MaxHub API — user profiles, company
  information, job search, posts, comments, and ads.
  Use when user asks about any LinkedIn content, 领英, 用户资料, 公司信息,
  职位, 帖子, 评论, 搜索人脉, or 企业分析.
  Do NOT use for posting content or account operations (read-only).
license: MIT-0
metadata:
  author: maxhub
  version: "3.7.2"
  openclaw:
    emoji: "💼"
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
    tags: ["linkedin", "领英", "职场社交", "公司信息", "职位搜索", "商业情报", "用户画像", "招聘", "B2B营销", "企业分析", "内容广告", "职业数据", "人脉分析", "数据采集"]
    category: productivity
---

# LinkedIn 数据助手

## 1. 简介

LinkedIn 数据查询工具，通过 MaxHub API 接入领英职业社交平台，覆盖用户资料、公司情报、内容动态、职位搜索四大领域，并提供 Web 与 Web V2 双版本接口。专注服务于 B2B 营销、招聘市场分析、海外人才画像、企业竞调与商业情报场景，帮助用户高效采集 LinkedIn 用户画像、公司经营数据、岗位需求与内容互动，构建跨地域人脉与商业洞察。

## 2. 功能特性

- 💼 **用户全景画像** — 基础资料、经历、技能、教育、出版、证书、荣誉、志愿、关注/连接、互动记录全维度覆盖

- 🏢 **公司情报采集** — 公司主页、员工列表、关联页面、附属公司、相似/竞品公司、股票行情、岗位数量一站式查询

- 📰 **内容互动追踪** — 帖子详情、评论、回复、表情反馈、转发、Hashtag Feed、群组帖子完整链路

- 🔍 **多维搜索矩阵** — 人脉、岗位、帖子、广告、学校、地点、行业建议跨域搜索

- 💼 **职位精细筛选** — 关键词 / 城市 / 经验 / 远程 / 雇佣类型 / Easy Apply 等多维过滤的岗位搜索与详情

- 📢 **广告库情报** — 搜索 LinkedIn 广告库 + 广告详情，支持按广告主、国家、日期筛选

- 🔄 **Web / Web V2 双版本** — 同一资源两种接口可选，V2 多以 `username` / `universal_name` 取代 urn，规避字段空洞

- 🛡️ **防臆造硬白名单** — `endpoints_whitelist.yaml` 路径硬校验，404/400 强制自检清单，杜绝 Agent 臆造 API 地址或参数

- 🔗 **链式调用图谱** — 85 个端点的字段流字典 + Chain Recipes，明确 username / urn / universal_name / company_id / post_urn 在端点间的传递路径

- 📊 **错误处理契约** — HTTP 状态码权威定义 + 重试策略矩阵 + 端点替换矩阵（Web ↔ V2 互为降级方案）

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
| 🚫 禁止臆造路径 | 仅使用 `references/endpoints_whitelist.yaml` 中的端点，**不得自行拼接、改 web/web_v2 段、加路径段** |
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
| 查用户 / 经历 / 技能 / 关系 / 搜索人脉 | `references/user.md` | 用户资料、经历、教育、技能、证书、荣誉、关注/连接、互动、人脉/学校/地点搜索（Web + V2 双版本） |
| 查公司 / 员工 / 竞品 / 股票 / 行业 | `references/company.md` | 公司主页、员工、附属页面、岗位数、相似公司、竞品、股价、员工分布（Web + V2 双版本） |
| 查帖子 / 评论 / 反馈 / Hashtag / 广告 | `references/content.md` | 帖子详情、评论、回复、Reactions、Reposts、群组帖子、Hashtag Feed、广告库（Web + V2 双版本） |
| 查岗位 / 搜索职位 | `references/jobs.md` | 岗位详情、岗位搜索（Web + V2 双版本） |
| 跨端点参数查询 / 字段流追溯 | `references/param-mappings.md` | 全局红线 + 端点路由 + 字段流字典 + 错误处理总览 + Web↔V2 替换矩阵 |
| 路径白名单硬校验 | `references/endpoints_whitelist.yaml` | 85 个端点的硬白名单 + Pre-call 4 步自检协议 |
| SKILL 版本检查与升级 | `references/update.md` | SkillHub / ClawHub / GitHub 三通道更新 |

**Step 3 — 构建最小调用计划**

- ✅ 优先使用最少端点完成任务，能用一个端点就不用两个
- ✅ V2 接口字段更稳定，**优先 V2**；V2 缺字段时再降级 Web
- ❌ 禁止"先 head/tail 试运行"或"先调一个看看"等探索性调用

**Step 4 — 执行并验证**

- 调用前比对 `endpoints_whitelist.yaml` 完成 4 步 Pre-call 自检（路径 → method → 必填 → 写入确认）
- 收到 **404** → 必须先做防路径臆造自检（5 步），尤其确认 `web` vs `web_v2` 段是否写错
- 收到 **400 / 422** → 必须先做防参数臆造自检（6 步），重点检查 `urn` / `username` / `universal_name` 是否混用
- 收到 **业务 code != 0** → 读 `message_zh` 报告用户，**不重试**

### 高级使用

#### 链式调用图谱（Chain Recipes）

| 用户场景 | 链路 | 字段流 |
|---------|------|-------|
| 用户名 → 资料 → 帖子 | `v2_search_users` → `v2_get_user_profile` → `v2_get_user_posts` | `keywords` → `username` 接力 |
| 用户主页 → 经历 → 技能 | `v2_get_user_profile` → `v2_get_user_experiences` → `v2_get_user_skills` | `username` 复用 |
| 公司 → 员工 → 岗位 | `v2_get_company_profile` → `v2_get_company_employees` → `v2_get_company_jobs` | `universal_name` 复用 |
| 公司 → 竞品 → 相似公司 | `v2_get_company_profile` → `v2_get_company_competitors` → `v2_get_company_similar_companies` | `universal_name` 复用 |
| 岗位搜索 → 详情 → 公司 | `v2_search_jobs` → `v2_get_job_detail` → `v2_get_company_profile` | `keywords` → `job_id` → `universal_name` |
| 帖子 → 评论 → 回复 | `v2_get_post_detail` → `v2_get_post_comments` → `v2_get_comment_replies` | `post_urn` → `comment_urn` 接力 |
| Hashtag → Feed → 帖子详情 | `v2_get_hashtag_feed` → `v2_get_post_detail` | `hashtag` → `post_urn` |
| 广告库 → 广告详情 | `web_search_ads` → `web_get_ad_detail` | `keyword` → `ad_id` |

#### 防臆造自检清单（强制前置步骤）

**收到 404 时（A）**：
1. 路径白名单逐字符比对 → 不在清单中 STOP
2. Method 比对 → 不等 STOP
3. 参数键名比对 → 有清单外参数 STOP
4. 资源 ID 来源溯源 → Agent 编造的 STOP
5. `web` / `web_v2` 段是否混用 → 错段 STOP
6. 全通过才判定"上游资源不存在"

**收到 400 / 422 时（B）**：
1. 参数名严格比对（`urn` / `username` / `universal_name` / `post_urn` / `comment_urn` 不可混用）
2. 必填项齐全
3. 类型与格式严格匹配（pattern / enum）
4. 传参方式正确（query vs body / POST vs GET）
5. 没有 IN 表外的臆造参数
6. 全通过才按 `message_zh` 排查

#### Web ↔ V2 替换矩阵

| Web 接口（旧） | V2 接口（推荐） | 关键差异 |
|---|---|---|
| `web_get_user_profile`（urn） | `v2_get_user_profile`（username） | V2 主键改为 username，更稳定 |
| `web_get_company_profile` | `v2_get_company_profile`（universal_name） | V2 必传 universal_name |
| `web_get_post_detail`（post_id） | `v2_get_post_detail`（post_urn） | V2 主键 urn 化 |
| `web_search_jobs` | `v2_search_jobs` | V2 参数 `keywords` 取代 `keyword` |

#### SKILL 版本更新

| 触发条件 | 推荐操作 |
|---------|---------|
| 合法路径持续 404 / 410 | `skillhub upgrade maxhub-linkedin`（国内）或 `clawhub upgrade maxhub-linkedin`（国际） |
| 用户问"版本是多少" | 当前版本 v3.7.2，访问 https://skillhub.cn/skills/maxhub-linkedin |
| 多端点连续 410 | `skillhub upgrade maxhub-linkedin --force` |
| 401 / 402 / 403 | **不是版本问题**，去 https://www.aconfig.cn/console 处理 |

### 常用命令速查表

| 场景 | 命令 |
|---|---|
| 查 API Key | `[ -n "${MAXHUB_API_KEY:-}" ] && echo "ok" \|\| echo "missing"` |
| 查用户资料（V2） | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/linkedin/web_v2/get_user_profile?username=xxx"` |
| 查公司主页（V2） | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/linkedin/web_v2/get_company_profile?universal_name=xxx"` |
| 搜索岗位（V2） | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/linkedin/web_v2/search_jobs?keywords=engineer&location=Beijing"` |
| 查帖子评论（V2） | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/linkedin/web_v2/get_post_comments?post_urn=urn:li:activity:xxx"` |
| 检查 SKILL 更新 | `skillhub info maxhub-linkedin` 或 `clawhub info maxhub-linkedin` |

## 5. 使用场景

### 场景一：B2B 营销团队挖掘潜在客户

- **角色**：B2B SaaS 销售
- **需求**：按行业 + 职位 + 地区批量挖掘目标公司的决策层联系信息
- **使用方式**：`v2_search_users`（按 title + industry + geo_urn）→ 取 `username` → 链式调 `v2_get_user_profile` + `v2_get_user_top_card` 提取头衔与联系方式线索
- **预期收益**：批量构建精准客户名单，替代 Sales Navigator 高昂订阅，营销线索成本下降 60%+

### 场景二：招聘市场分析师追踪行业岗位需求

- **角色**：HRBP / 招聘市场研究员
- **需求**：监控竞争对手公司近期发布的岗位、JD 关键词与薪资范围
- **使用方式**：`v2_get_company_profile` 锁定公司 → `v2_get_company_jobs` 拉取岗位列表 → 链式调 `v2_get_job_detail` 提取 JD 与技能要求
- **预期收益**：竞品招聘动态可日级追踪，识别人才争夺热点与组织扩张方向

### 场景三：海外人才画像与背景调查

- **角色**：跨境招聘 / 人才合伙人
- **需求**：根据候选人 LinkedIn URL 完整还原其经历、技能、推荐与人脉网络
- **使用方式**：`v2_get_user_profile` → `v2_get_user_experiences` + `v2_get_user_educations` + `v2_get_user_skills` + `v2_get_user_recommendations` 全维度并行采集
- **预期收益**：候选人画像构建效率提升 5 倍，人脉网络可视化辅助内推决策

### 场景四：企业竞调与情报采集

- **角色**：战略分析师 / 投研
- **需求**：跟踪某海外标的公司的员工增长、岗位动向、内容传播与竞品图谱
- **使用方式**：`v2_get_company_profile` → `v2_get_company_employee_count_ranges` → `v2_get_company_competitors` → `v2_get_company_posts` → `web_search_ads`（advertiser_name）补齐广告投放数据
- **预期收益**：完整的公司经营画像 + 竞品图谱 + 广告策略一站式输出，为投研决策提供高质量原始数据

## 6. 项目架构

### 目录结构

```
maxhub-linkedin/
├── SKILL.md                            # Skill 定义与使用文档（本文件）
├── README.md                           # 英文项目说明
├── README_CN.md                        # 中文项目说明
├── _meta.json                          # 版本元信息（version: 3.7.2）
└── references/
    ├── endpoints_whitelist.yaml        # 85 端点路径硬白名单 + Pre-call 4 步自检协议
    ├── param-mappings.md               # 中枢索引（全局红线 + 字段流字典 + 错误处理 + Web↔V2 替换矩阵）
    ├── user.md                         # 用户域：资料/经历/技能/教育/关系/搜索（Web + V2）
    ├── company.md                      # 公司域：主页/员工/岗位/竞品/股价（Web + V2）
    ├── content.md                      # 内容域：帖子/评论/回复/反馈/广告/群组（Web + V2）
    ├── jobs.md                         # 职位域：岗位详情/岗位搜索（Web + V2）
    └── update.md                       # SKILL 更新机制（SkillHub / ClawHub / GitHub）
```

### 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 调用方式 | `curl` + Bearer Token | HTTP GET / POST 请求，参数通过 query string 或 body 传递 |
| 数据接口 | MaxHub API | `https://www.aconfig.cn/api/v1/linkedin/web/*` 与 `web_v2/*`，通过 `MAXHUB_API_KEY` 鉴权 |
| 路径校验 | YAML 硬白名单 | `endpoints_whitelist.yaml` 提供 85 端点的逐字符校验 + 4 步 Pre-call 协议 |
| 错误处理 | 决策表 + 自检清单 | HTTP 状态码权威定义 + 防臆造自检（A/B 双轨）+ Web↔V2 替换矩阵 |
| 输出格式 | JSON Standard MaxHub Response | `{code, message, message_zh, data, cache_url}` |
| 更新通道 | SkillHub / ClawHub / GitHub | 国内 ⭐⭐⭐ SkillHub（腾讯云 CDN）/ 国际 ⭐⭐⭐ ClawHub / 降级 GitHub |

### API 覆盖范围

| 领域 | 端点数 | Reference 文件 |
|------|--------|---------------|
| 用户（User） | 43 | `user.md` |
| 公司（Company） | 20 | `company.md` |
| 内容（Content） | 16 | `content.md` |
| 职位（Jobs） | 4 | `jobs.md` |
| **合计** | **85** | — |

### 关键设计理念

- **防臆造四道闸**：白名单（endpoints_whitelist.yaml）→ 强标记（Full path）→ 禁止规则（Forbidden）→ 错误反馈（STOP）
- **Web / V2 双版本契约**：V2 优先策略 + 替换矩阵兜底，规避单接口字段空洞或 410 失效风险
- **链式调用图谱**：字段流字典（`username` / `urn` / `universal_name` / `post_urn` / `comment_urn`）+ Chain Recipes + 跨 reference 链路三层联动
- **错误处理契约**：HTTP 状态码权威定义 + 防臆造自检清单（A: 5 步 / B: 6 步）+ Web↔V2 替换矩阵
