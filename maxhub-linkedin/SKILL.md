---
name: maxhub-linkedin
description: LinkedIn 职业社交公开数据查询 skill，通过 MaxHub API 查询公司、职位、人员资料、员工列表、帖子、评论、搜索和关联数据。适合 B2B 市场研究、招聘线索、公司画像、行业情报和职业内容分析。默认 read-only，但数据可能涉及个人职业信息；agent 必须遵守最小化与授权原则，优先调用 recipes，按字段流传递 company_id/profile_id/job_id 等参数。所有请求发送到 https://www.aconfig.cn。
license: MIT-0
metadata:
  author: maxhub
  version: 3.8.0
  openclaw:
    capability: read_only
    requires_confirmation:
    - non_idempotent
    - cookie_input
    emoji: 💼
    primaryEnv: MAXHUB_API_KEY
    requires:
      env:
      - MAXHUB_API_KEY
      bins:
      - curl
    env:
    - name: MAXHUB_API_KEY
      description: API key for MaxHub data APIs. Get one at https://www.aconfig.cn
      required: true
      sensitive: true
    network:
    - https://www.aconfig.cn
    riskLevel: low
    defaultMode: recipes_first_read_only
    skillClass: maxhub-api-skill
    platform: linkedin
    authType: bearer_env
    dataSource: MaxHub API via https://www.aconfig.cn
    agentUse:
      entrypoint: SKILL.md §4 Agent Decision Tree
      intentIndex: references/recipes/_index.md
      chainDetails: references/recipes/<domain>.md
      fieldFlow: references/param-mappings.md
      endpointWhitelist: references/endpoints_whitelist.yaml
      selectionPolicy: recipes_first_then_atoms; longest_trigger_match; ask_on_tie
      parameterPolicy: use recipe extract/in_map and field-flow dictionary; never invent path or parameters
    privacy:
      thirdParty: https://www.aconfig.cn
      transmits:
      - MAXHUB_API_KEY
      - user_supplied_ids
      - keywords
      - urls
      - optional_cookies_or_tokens
      guidance: Use only for authorized data processing; minimize personal data; do not expose secrets in logs or prompts.
  hermes:
    tags:
    - linkedin
    - 领英
    - 公司
    - 职位
    - 人员资料
    - 员工
    - 帖子
    - 评论
    - 搜索
    - B2B
    - 招聘
    - 职业数据
    - 商业情报
    category: data-analysis
    intents:
    - query
    - analyze
    - search
    - chain
    - report
    locale:
    - zh-CN
    - en
---

# LinkedIn 数据助手

## 1. 简介

LinkedIn 数据查询工具，通过 MaxHub API 接入领英职业社交平台，覆盖用户资料、公司情报、内容动态、职位搜索四大领域，并提供 Web 与 Web V2 双版本接口。专注服务于 B2B 营销、招聘市场分析、海外人才画像、企业竞调与商业情报场景，帮助用户高效采集 LinkedIn 用户画像、公司经营数据、岗位需求与内容互动，构建跨地域人脉与商业洞察。

## 2. 详细功能

### 用户画像

- 拉取用户基础资料、个人简介、顶部卡片与概览信息，快速锁定关键身份与头衔
- 完整还原用户工作经历、教育背景、技能、出版物、证书、荣誉、志愿经历等履历切片
- 采集用户的关注关系、人脉连接数量、关联学校、关联公司、互动记录与近期活动
- 抓取用户发布的帖子、评论、视频、图片与推荐信，构建对外表达与口碑画像
- 获取联系信息与可见的对外联系方式，支撑商务触达与背调线索

### 公司情报

- 查询公司主页、企业简介、定位区域、员工规模区间与多地办公点分布
- 拉取公司员工列表、关联页面、附属公司、相似公司与竞品公司，输出竞争图谱
- 获取公司发布的帖子动态、对外行动号召与员工互动洞察，跟踪企业内容策略
- 查询岗位总数、岗位列表与上市公司股价行情，辅助招聘景气度与经营状况判断

### 内容互动

- 查询帖子详情、转发链路、表情反馈分布与互动量级，还原传播路径
- 拉取帖子评论与评论下的二级回复，挖掘用户真实声量与讨论焦点
- 通过 Hashtag 信息流拉取话题相关帖子，跟踪话题在领英生态的扩散
- 采集群组主页信息与群组内的帖子内容，进入垂类社群的封闭讨论

### 搜索矩阵

- 按关键词、行业、地区、公司、学校等条件搜索人脉，批量发现目标人选
- 全文搜索帖子内容，定位话题、品牌、人物在领英平台的相关讨论
- 搜索学校、地点与行业建议，作为画像与筛选时的标准化字典输入
- 搜索领英广告库内的活跃广告，按广告主、投放国家与日期范围筛选

### 职位筛选

- 按关键词、城市、经验等级、远程类型、雇佣形式与简易投递等多维条件搜索岗位
- 拉取岗位详情，含 JD、技能要求、薪资区间（如有）、招聘公司与发布时间
- 关联岗位 → 公司主页 → 员工分布，构建一条完整的招聘机会洞察链路

### 广告库

- 按关键词或广告主名称检索领英广告库，识别同行业品牌的活跃投放
- 拉取单条广告的素材、文案、投放国家与触达时间，分析创意与策略
- 结合公司画像与广告数据，沉淀对手在领英平台的内容投放图谱

### Web 与 V2 双版本

- 同一份用户、公司、帖子资源同时提供两种接口契约，可按字段稳定性自由切换
- 新版接口以稳定的人类可读标识取代易变的内部 ID，降低长期采集中的失效风险
- 当主推接口字段缺失或暂不可用时，可降级到旧接口兜底完成同等数据采集

> ### 📋 数据传输与隐私声明（请认真阅读）
>
> 1. **第三方传输**：您提供的所有 ID、关键词、链接、cookie 等参数都会通过 HTTPS 发送到 **`https://www.aconfig.cn`**（MaxHub 数据服务）进行处理。
> 2. **UGC 隐私**：拉回的评论 / 弹幕 / 动态 / 私信 / 联系人等内容可能包含个人信息或敏感 UGC，请勿写入未授权的数据库或公开发布。
> 3. **凭证保护**：建议使用**独立测试账号**、定期轮换 API Key；**禁止**传入主力生产账号的 cookie 或 session 凭证。
> 4. **合规责任**：使用方需自行确保符合所在地区的数据保护法律（《个人信息保护法》/ GDPR / 平台 ToS 等），平台账号的合规性由使用方承担。

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


### 🤖 Agent Decision Tree（必读 · 决定调用顺序）

> 此小节定义 agent 在每次接到用户请求时的**标准决策流程**。严格按此顺序执行可大幅提升命中率与减少误调用。

#### 1️⃣ 文档加载顺序（按需 · 不要一次性全读）
| 步骤 | 何时读 | 加载文件 | 估算 token |
|------|-------|---------|-----------|
| ① 永远先读 | 接到任何请求时 | `SKILL.md` §0.1（不支持清单）+ §4（本节） | ~1K |
| ② 选择 recipe | 用户语义清晰时 | `references/recipes/_index.md`（仅索引） | ~1.5K |
| ③ 加载 recipe 详情 | 匹配到具体 recipe 时 | `references/recipes/<domain>.md` 的对应段落 | ~500/段 |
| ④ 加载端点详情 | 自定义链路或参数不明时 | `references/<domain>.md` 单文件 | ~3K |
| ⑤ 路径白名单校验 | 调用前 | `grep '<endpoint_id>' references/endpoints_whitelist.yaml`（**禁止整体读**） | ~50 行 |
| ⑥ 跨端点字段路由 | 链式调用时 | `references/param-mappings.md` § 字段流字典 | ~1K |

#### 2️⃣ Recipe 匹配规则（核心）
1. **加载** `references/recipes/_index.md`，扫 `trigger_keywords` 列
2. **最长匹配优先**：若用户输入同时命中多个 recipe 的 trigger，**选最长 trigger 命中的那个**（最具体）
3. **平局询问**：若两个 trigger 长度相同且都命中 → 主动询问用户："您是想看 A 还是 B？"
4. **无命中**：先查 §0.1 不支持清单 → 不在则进入"自定义链路"流程（步骤 3）

#### 3️⃣ 自定义链路（无现成 Recipe）
1. 读 `references/atoms/_index.md`，按 `chain_role` 列定位起点（`starter`）和终点（`terminal`）
2. **优先用 `⭐⭐⭐ 首选`** 标记的端点；不到必要不用 `⭐ 条件` 端点
3. 字段流（上游 OUT → 下游 IN）由 `param-mappings.md § 字段流字典` 决定，**禁止**自行猜 json_path
4. 链路完成后，可向维护方建议把它编排成新 recipe

#### 4️⃣ 调用前自检（按 risk 分级 · 节省 token）
| 端点 risk | 必做自检 | 步骤数 |
|----------|---------|-------|
| `risk: low` | ① 路径在 endpoints_whitelist.yaml | 1 步 |
| `risk: medium` | ① 路径 ② method ③ 必填参数 ④ 写入确认 | 4 步 |
| `risk: high` | 4 步 + 显式向用户确认参数与意图 | 5 步 |
| `risk: critical`（restricted） | 6 步高风险确认流程（详见 §高风险能力清单） | 6 步 |

> 旧 SKILL 强制所有调用都做 4 步——现按 risk 等级简化。`low` 端点（占绝大多数）只校验路径即可。

#### 5️⃣ 错误处理快速决策
| 现象 | 行动 | 重试 |
|------|------|------|
| 404 / 410 | §3.1(A) 5 步防臆造自检 → 通过才 STOP；**禁止**自改路径段重试 | 0 |
| 400 / 422 | §3.1(B) 6 步防参数臆造自检 → 通过才修参重试 | ≤1 |
| 401 / 402 / 403 | STOP，告知用户去 https://www.aconfig.cn 处理 | 0 |
| 429 | 读 `Retry-After` 退避；无该头时指数退避+jitter | ≤2 |
| 5xx | 等 3 秒重试 → 仍失败走端点级"降级/替换" | 1 |
| HTTP 200 + `code != 0` | 读 `message_zh` 报告用户；**不重试**（业务错误重试无用） | 0 |

#### 6️⃣ 输出契约（与用户对话时）
1. **数据来源声明**：每次输出明确告知数据来自 `https://www.aconfig.cn` 三方接口
2. **缺失字段处理**：如某字段链路降级后缺失，**显式说明**"X 暂不可取"，不要静默省略
3. **不要伪造**：用户问的字段若不在响应里 → 说"未返回"，禁止用其他端点拼凑模拟



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
| 401 / 402 / 403 | **不是版本问题**，去 https://www.aconfig.cn 处理 |

### 常用命令速查表

| 场景 | 命令 |
|---|---|
| 查 API Key | `[ -n "${MAXHUB_API_KEY:-}" ] && echo "ok" \|\| echo "missing"` |
| 查用户资料（V2） | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/linkedin/web_v2/get_user_profile?username=xxx"` |
| 查公司主页（V2） | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/linkedin/web_v2/get_company_profile?universal_name=xxx"` |
| 搜索岗位（V2） | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/linkedin/web_v2/search_jobs?keywords=engineer&location=Beijing"` |
| 查帖子评论（V2） | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/linkedin/web_v2/get_post_comments?post_urn=urn:li:activity:xxx"` |
| 检查 SKILL 更新 | `skillhub info maxhub-linkedin` 或 `clawhub info maxhub-linkedin` |


### 📌 端到端使用示例（agent 快速上手）

**用户输入**：「帮我看 某个 LinkedIn 公司主页的员工列表」

**Agent 执行步骤**：

1. **匹配 recipe**：读 `references/recipes/_index.md` → 找到 trigger 命中 → 选最长匹配的 recipe
2. **加载 recipe 详情**：读 `references/recipes/<domain>.md` 中对应段落，拿到 Inputs / Atomic Steps / Output
3. **路径校验**：对每个 atom 的 endpoint_id，`grep` 一下 `endpoints_whitelist.yaml` 确认存在
4. **risk: low 的端点直接调用，risk: medium+ 先与用户确认**
5. **链式传递**：上游响应的 json_path 字段（如 `$.data.bvid`）按 recipe 的 `extract` 列绑定为变量，传给下游端点
6. **错误处理**：按 §错误处理决策表行动；不要自改路径或瞎加参数
7. **输出**：组装结果给用户，标明数据来自三方接口；缺失字段显式说"未取到"

**反例（agent 不要这么做）**：
- ❌ 全文加载 `endpoints_whitelist.yaml`（大文件，浪费上下文）
- ❌ 看到 404 就改路径段重试（会被防臆造规则阻断）
- ❌ 把没在响应里的字段编一个值返回给用户
- ❌ 链式调用时忽略 recipe 的 `extract` 列，自己猜 json_path


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
