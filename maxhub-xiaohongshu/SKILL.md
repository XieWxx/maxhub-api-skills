---
name: maxhub-xiaohongshu
description: 小红书（Xiaohongshu/RED）公开笔记与用户数据分析 skill，通过 MaxHub API 查询笔记详情、评论、用户资料、搜索、话题、商品/种草内容和推荐流。适合品牌种草分析、KOL 画像、内容选题、竞品监控和评论洞察。默认 read-only；agent 应按 recipes 选择笔记/用户/搜索/评论链路，使用 note_id/user_id/keyword 等字段流传参，并避免采集超出授权的个人数据。所有请求发送到 https://www.aconfig.cn。
license: MIT-0
metadata:
  author: maxhub
  version: 3.8.0
  openclaw:
    capability: read_only
    requires_confirmation:
    - non_idempotent
    - cookie_input
    emoji: 📕
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
    platform: xiaohongshu
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
    - xiaohongshu
    - 小红书
    - RED
    - 笔记
    - 评论
    - 用户资料
    - 搜索
    - 话题
    - 商品
    - 种草
    - KOL
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

# 小红书数据助手

## 1. 简介

小红书数据查询与种草内容研究工具，通过 MaxHub API 接入小红书（xiaohongshu.com）平台，覆盖笔记详情、评论与子评论、用户资料、用户发布/收藏笔记、综合搜索（笔记/用户/图片/商品/话题）、热榜与首页推荐、商品详情与评价、话题信息与 Feed、创作者灵感等全部能力。专注服务于内容种草研究、商品选品、KOL 数据采集、笔记爆款规律分析等场景，帮助用户快速采集小红书全域数据，提炼可复用的内容创作模板。

## 2. 详细功能

### 笔记数据
- 查询小红书图文笔记的完整详情，包括标题、正文、图片组、标签、话题、发布时间、地理位置等结构化字段
- 查询视频笔记的完整详情，包括视频封面、播放地址、时长、标签与正文文案
- 支持通过笔记 ID、分享链接、复制口令、短链等多种入口反查同一篇笔记
- 拉取与某篇笔记相关的推荐笔记 Feed，识别相似选题与同类爆款
- 还原笔记的图文/视频媒体资源、互动数据（点赞、收藏、评论数）与作者基础信息

### 评论与互动
- 拉取任意笔记的一级评论列表，覆盖 App、Web、Web 新版三端不同口径
- 顺着一级评论接力拉取二级子评论与楼中楼回复，还原完整讨论结构
- 适配不同采集场景：App 端最贴近真实用户视角，Web 端便于大批量采集

### 用户与主页
- 查询任意小红书用户的主页资料，包括头像、昵称、简介、粉丝数、获赞收藏数等画像数据
- 支持通过用户 ID 或主页分享链接两种入口定位用户
- 拉取该用户已发布的全部笔记列表，用于评估内容产出节奏与垂类倾向
- 拉取该用户公开收藏的笔记列表，用于反推 KOL 内容偏好与潜在合作品类
- 拉取用户主页推荐 Feed，看到平台为该账号匹配的相似创作者圈层

### 综合搜索
- 按关键词搜索笔记，支持热门排序与最新排序，覆盖种草内容采集主场景
- 按关键词搜索用户/博主，用于 KOL 候选池建立
- 按关键词搜索图片，定位高热视觉素材与设计灵感
- 按关键词搜索商品，对接选品与口碑调研
- 按关键词搜索话题/群组/品牌专区
- 获取搜索框联想词与下拉推荐词，识别用户真实搜索意图与长尾词

### 发现与热榜
- 拉取小红书实时热榜，监测平台当前的热门话题与上升词
- 拉取趋势词列表，识别近期上升中的关键词
- 拉取首页推荐信息流，了解算法分发的内容池
- 拉取首页推荐的分类标签，按生活方式垂类切片浏览推荐内容

### 商品与评价
- 查询小红书商城商品的完整详情，包括标题、价格、SKU、卖点、详情图等
- 拉取商品评价的整体概览与情感分布，快速判断口碑健康度
- 拉取真实用户评价列表，作为种草口碑与差评分析的数据源
- 拉取相关商品推荐列表，构建竞品/替代品矩阵

### 话题与创作者灵感
- 查询任意话题页的基础信息，包括话题描述、参与人数、累计阅读
- 拉取话题下的笔记 Feed，绘制话题传播链与参与创作者图谱
- 拉取创作者灵感中心的最新选题 Feed，获取平台官方推荐的创作选题
- 拉取创作者灵感中心的热门选题 Feed，识别近期高潜爆款选题方向

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
| 🔒 只读 | 本技能仅用于数据查询和分析，**不执行写入 / 账户 / 发布操作** |
| 🚫 禁止臆造路径 | 仅使用 `references/endpoints_whitelist.yaml` 中的端点，**不得自行拼接、改版本号（app_v2/web_v2/web_v3）、加路径段** |
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
| 查笔记 / 评论 / 子评论 | `references/note.md` | 图文/视频笔记详情、评论、子评论（App V2 + Web V2 + Web V3，11 端点） |
| 查用户 / 主页 / 笔记列表 | `references/user.md` | 用户信息、发布笔记、收藏笔记、主页 Feed（7 端点） |
| 搜索 / 热榜 / 发现 | `references/search.md` | 笔记/用户/图片/商品/群组搜索、热榜、趋势、首页推荐（13 端点） |
| 查商品 / 评价 / 话题 / 灵感 | `references/product.md` | 商品详情、评价、推荐、话题信息、话题 Feed、创作者灵感（8 端点） |
| 跨端点参数查询 / 字段流追溯 | `references/param-mappings.md` | 全局红线 + 端点路由 + 字段流字典 + 错误处理总览 |
| 路径白名单硬校验 | `references/endpoints_whitelist.yaml` | 37 个端点的硬白名单 + Pre-call 4 步自检协议 |

**Step 3 — 构建最小调用计划**

- ✅ 优先使用最少端点完成任务，能用一个端点就不用两个
- ✅ 同一意图下三个版本（App V2 / Web V2 / Web V3）任选其一，**不要同时调用**
- ❌ 禁止"先 head/tail 试运行"或"先调一个看看"等探索性调用

**Step 4 — 执行并验证**

- 调用前比对 `endpoints_whitelist.yaml` 完成 4 步 Pre-call 自检（路径 → method → 必填 → 写入确认）
- 收到 **404** → 必须先做防路径臆造自检（5 步），不要立刻切换版本号
- 收到 **400 / 422** → 必须先做防参数臆造自检（6 步），重点检查 `xsec_token` / `oneOf: [note_id, share_text]`
- 收到 **业务 code != 0** → 读 `message_zh` 报告用户，**不重试**

### 高级使用

#### 链式调用图谱（Chain Recipes）

| 用户场景 | 链路 | 字段流 |
|---------|------|-------|
| 搜索 → 笔记详情 | `search_notes` → `get_image_note_detail` / `get_video_note_detail` | `keyword` → `note_id` |
| 查笔记 + 评论 + 子评论 | `get_image_note_detail` → `get_note_comments` → `get_note_sub_comments` | `note_id` → `comment_id` 接力 |
| 查用户 → 笔记列表 | `search_users` → `get_user_info` → `get_user_posted_notes` | `keyword` → `user_id` |
| 查用户全面分析 | `get_user_info` + `get_user_posted_notes` + `get_user_faved_notes` | `user_id` 复用 |
| 查商品 + 评价 | `search_products` → `get_product_detail` → `get_product_reviews` | `keyword` → `sku_id` |
| 话题 → 笔记 Feed | `get_topic_info` → `get_topic_feed` → `get_image_note_detail` | `page_id` → `note_id` |
| 热榜 → 搜索 | `fetch_hot_list` → `search_notes` | 热搜词 → `keyword` |

#### 防臆造自检清单（强制前置步骤）

**收到 404 时（A）**：
1. 路径白名单逐字符比对 → 不在清单中 STOP
2. Method 比对（全部为 GET）→ 不等 STOP
3. 参数键名比对（`note_id` vs `noteId`、`user_id` vs `userId`）→ 有清单外参数 STOP
4. 资源 ID 来源溯源 → Agent 编造的 STOP
5. 全通过才判定"上游资源不存在"

**收到 400 / 422 时（B）**：
1. 参数名严格比对（大小写 / 缩写 / 复数）
2. 必填项齐全 + oneOf 二选一逻辑（如 `note_id` 与 `share_text`）
3. Web V3 端点 `xsec_token` 是否携带
4. 类型与格式严格匹配（pattern / enum）
5. 传参方式正确（query string）
6. 全通过才按 `message_zh` 排查

#### SKILL 版本更新

| 触发条件 | 推荐操作 |
|---------|---------|
| 合法路径持续 404 / 410 | `skillhub upgrade maxhub-xiaohongshu`（国内）或 `clawhub upgrade maxhub-xiaohongshu`（国际） |
| 用户问"版本是多少" | 当前版本 v3.7.2，访问 https://skillhub.cn/skills/maxhub-xiaohongshu |
| 多端点连续 410 | `skillhub upgrade maxhub-xiaohongshu --force` |
| 401 / 402 / 403 | **不是版本问题**，去 https://www.aconfig.cn 处理 |

### 常用命令速查表

| 场景 | 命令 |
|---|---|
| 查 API Key | `[ -n "${MAXHUB_API_KEY:-}" ] && echo "ok" \|\| echo "missing"` |
| 查图文笔记详情 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/xiaohongshu/app_v2/get_image_note_detail?note_id=xxx"` |
| 查笔记评论 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/xiaohongshu/app_v2/get_note_comments?note_id=xxx"` |
| 搜索笔记 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/xiaohongshu/app_v2/search_notes?keyword=咖啡"` |
| 查商品详情 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/xiaohongshu/app_v2/get_product_detail?sku_id=xxx"` |
| 查热榜 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/xiaohongshu/web_v2/fetch_hot_list"` |
| 检查 SKILL 更新 | `skillhub info maxhub-xiaohongshu` 或 `clawhub info maxhub-xiaohongshu` |


### 📌 端到端使用示例（agent 快速上手）

**用户输入**：「帮我看 小红书某个 note_id 的评论」

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

### 场景一：内容种草研究者寻找爆款规律

- **角色**：小红书内容创作者 / 种草研究员
- **需求**：分析某垂类（美妆 / 母婴 / 旅游）近期高互动笔记的共同特征，提炼爆款选题与文案模板
- **使用方式**：调用 `fetch_hot_list` 拉取热榜 → `search_notes` 按关键词检索 → 批量取 `note_id` → `get_image_note_detail` 提取标题/正文/标签/互动数据
- **预期收益**：通过热榜 + 搜索 + 详情链路快速锁定高互动笔记，沉淀可复用的爆款标题与封面公式

### 场景二：电商团队商品选品分析

- **角色**：电商运营 / 选品 PM
- **需求**：选品前需要快速调研某 SKU 在小红书的真实口碑、评价情感与相关推荐
- **使用方式**：`search_products` 按品类搜索 → 取 `sku_id` → `get_product_detail` + `get_product_review_overview` + `get_product_reviews` 三端点并行 → `get_product_recommendations` 拉取相关品
- **预期收益**：一次调用矩阵覆盖商品基本信息、评价情感分布与替代推荐，决策周期从天级缩短到分钟级

### 场景三：MCN 机构 KOL 数据采集

- **角色**：MCN 机构 / 品牌投放方
- **需求**：批量评估候选 KOL 的真实粉丝活跃度、笔记产出节奏与近期收藏倾向
- **使用方式**：`search_users` 关键词找人 → 取 `user_id` → `get_user_info` 拉资料 → `get_user_posted_notes` + `get_user_faved_notes` 双 Feed 联查
- **预期收益**：完整 KOL 画像 + 内容产出节奏 + 收藏品味，识别真实活跃账号与内容方向匹配度

### 场景四：内容运营追踪话题传播链

- **角色**：品牌内容运营 / 话题策划
- **需求**：追踪某话题页（page_id）下的全部参与笔记与创作者，绘制话题传播链
- **使用方式**：`get_topic_info` 验证话题 → `get_topic_feed` 拉取话题 Feed → 取 `note_id` → `get_image_note_detail` 补全详情 → 取 `user_id` → `get_user_info` 补充作者画像
- **预期收益**：完整的话题参与图谱，识别话题核心 KOC 与扩散路径

## 6. 项目架构

### 目录结构

```
maxhub-xiaohongshu/
├── SKILL.md                            # Skill 定义与使用文档（本文件）
├── README.md                           # 英文项目说明
├── README_CN.md                        # 中文项目说明
├── _meta.json                          # 版本元信息（version: 3.7.2）
└── references/
    ├── endpoints_whitelist.yaml        # 37 端点路径硬白名单 + Pre-call 4 步自检协议
    ├── param-mappings.md               # 中枢索引（全局红线 + 字段流字典 + 错误处理）
    ├── note.md                         # 笔记域：详情/评论/子评论（App V2 + Web V2 + Web V3，11 端点）
    ├── user.md                         # 用户域：资料/发布/收藏/主页 Feed（7 端点）
    ├── search.md                       # 搜索域：笔记/用户/图片/商品/群组/热榜/趋势/首页（13 端点）
    └── product.md                      # 商品/话题域：商品详情/评价/话题/灵感（8 端点）
```

### 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 调用方式 | `curl` + Bearer Token | HTTP GET 请求，参数通过 query string 传递 |
| 数据接口 | MaxHub API | `https://www.aconfig.cn/api/v1/xiaohongshu/{app_v2\|web_v2\|web_v3}/*`，通过 `MAXHUB_API_KEY` 鉴权 |
| 路径校验 | YAML 硬白名单 | `endpoints_whitelist.yaml` 提供 37 端点的逐字符校验 + 4 步 Pre-call 协议 |
| 错误处理 | 决策表 + 自检清单 | HTTP 状态码权威定义 + 防臆造自检（A/B 双轨）+ 重试策略矩阵 |
| 输出格式 | JSON Standard MaxHub Response | `{code, message, message_zh, data, cache_url}` |
| 更新通道 | SkillHub / ClawHub / GitHub | 国内 ⭐⭐⭐ SkillHub（腾讯云 CDN）/ 国际 ⭐⭐⭐ ClawHub / 降级 GitHub |

### API 覆盖范围

| 领域 | 端点数 | Reference 文件 |
|------|--------|---------------|
| 笔记（Notes） | 11 | `note.md` |
| 用户（Users） | 7 | `user.md` |
| 搜索与发现（Search） | 13 | `search.md` |
| 商品与话题（Product） | 8 | `product.md` |
| **合计** | **37（去重 1 个白名单内合并端点后对外暴露 37）** | — |

### 关键设计理念

- **防臆造四道闸**：白名单（endpoints_whitelist.yaml）→ 强标记（Full path）→ 禁止规则（Forbidden）→ 错误反馈（STOP）
- **三版本端点共存**：App V2 / Web V2 / Web V3 同一意图存在多版本端点，强制使用 reference 标注的版本，**不得跨版本拼接**
- **Agent 友好 7 大原则**：结构胜于叙述、明确指令优于建议、单一来源、词法稳定性、低 token 密度、边界显式声明、错误处理是契约
- **链式调用图谱**：字段流字典 + Chain Recipes + 跨 reference 链路三层联动，杜绝 Agent 编造字段名
- **错误处理契约**：HTTP 状态码权威定义 + 防臆造自检清单（A: 5 步 / B: 6 步）+ 重试策略矩阵 + 端点替换矩阵
