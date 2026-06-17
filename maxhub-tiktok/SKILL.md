---
name: maxhub-tiktok
description: TikTok 数据查询、创作者分析与运营辅助 skill，通过 MaxHub API 查询视频详情、评论、用户资料、搜索、趋势、广告/商店/创作者数据与工具类端点。适合海外短视频选题、账号画像、竞品分析、趋势监控和创作者运营。包含 restricted 高风险能力（播放量变更、私信 deep-link、设备/会话/签名/登录加密辅助等），不属于纯只读 skill；agent 必须优先使用 recipes/atoms，调用 restricted 端点前逐次获得用户明确授权。所有请求发送到 https://www.aconfig.cn。
license: MIT-0
metadata:
  author: maxhub
  version: 3.8.0
  openclaw:
    capability: read_write_high_risk
    requires_confirmation:
    - restricted
    - write
    - non_idempotent
    - cookie_input
    - session_bootstrap
    - anti_bot_signature
    emoji: 🎶
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
    riskLevel: high
    defaultMode: recipes_first_restricted_confirm
    skillClass: maxhub-api-skill
    platform: tiktok
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
    - tiktok
    - 海外抖音
    - 短视频
    - 视频详情
    - 评论
    - 用户画像
    - 搜索
    - 趋势
    - 创作者
    - 广告
    - 电商
    - restricted
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

# TikTok 数据助手

## 1. 简介

TikTok 海外短视频数据查询与分析工具，通过 MaxHub API 接入 TikTok 全平台公开数据，覆盖视频详情、用户画像、搜索趋势、评论直播、广告分析、创作者后台、TikTok Shop 电商、虚假流量分析、签名加密工具等九大领域共 174 个端点。专注服务于 TikTok 出海创作者、跨境电商运营、海外营销广告优化师与数据分析团队，帮助用户高效采集 TikTok 全球数据、洞察广告投放与电商选品策略。

## 2. 详细功能

### 视频数据
- 查询 TikTok 视频的完整详情，包含标题、封面、播放、点赞、评论、收藏、分享等核心指标
- 支持通过视频原始 ID、Web 帖子 ID、分享链接等多种入口快速定位视频
- 批量查询多个视频的详情数据，适合赛道扫描与跨账号横向对比
- 浏览 TikTok 探索流、首页推荐流（App 与 Web 双端）以及标签聚合视频
- 拉取用户合辑作品与创作者搜索洞察推荐的视频
- 从分享链接、短链中提取视频标识，支持单条与批量解析
- 唤起 TikTok App 直跳视频详情页

### 用户数据
- 查询 TikTok 用户主页全量信息，覆盖 App 端与 Web 端两套数据视角
- 支持通过用户名、唯一 ID、加密 ID 等多种用户标识互相转换与查询
- 查询用户所属国家与相似用户推荐，便于横向扩量
- 拉取用户的发布作品、转发作品、点赞作品、收藏作品与播放列表
- 拉取用户的粉丝列表与关注列表，并支持在粉丝/关注中按关键词搜索
- 拉取用户的音乐使用列表与直播详情
- 获取用户主页分享二维码
- 查询创作者带货信息与创作者橱窗商品
- 唤起 TikTok App 直跳用户主页与私信会话

### 搜索能力
- 执行 TikTok 综合搜索，一次返回视频、用户、话题、音乐等混合结果
- 单独执行视频搜索、用户搜索、音乐搜索、话题搜索、直播搜索、地点搜索、图片搜索
- 查询音乐详情与音乐相关作品列表，浏览音乐排行榜
- 查询话题详情与话题作品列表
- 拉取创作者搜索洞察总览、详情与趋势
- 执行 TikTok Shop 商品搜索
- 获取热搜词与搜索关键词联想
- 拉取直播推荐分类与推荐内容
- 调用文本翻译能力对内容进行多语言转换
- 解析 TikTok 短链至原始链接
- 唤起 TikTok App 直跳关键词搜索

### 评论与互动
- 拉取视频一级评论列表，覆盖 App 端与 Web 端多入口
- 接力拉取每条评论下的二级回复
- 通过分享链接提取直播间标识

### 直播数据
- 查询直播间详情、排行榜与日榜数据
- 检测单个或批量直播间的在线状态
- 拉取直播间挂车商品列表与实时直播数据
- 拉取直播间 IM 弹幕流并生成所需的直播长连接签名
- 浏览全部礼物列表，按礼物 ID 单条或批量反查礼物名称

### 数据分析
- 查询视频核心指标，量化播放表现
- 检测视频虚假流量风险，识别异常增长
- 拉取视频评论关键词词云，提炼受众讨论焦点
- 查询创作者基本信息与成长里程碑

### 创作者后台
- 查询账号健康状态与历史违规记录
- 拉取账号洞察总览，掌握账号整体表现
- 进行直播分析、视频分析、视频列表分析与商品分析
- 查询创作者账户信息、橱窗商品列表与视频关联商品列表
- 进行视频深度统计、视频带货转化、商品关联视频与视频观众画像分析

### 广告分析
- 查询单条广告的详情信息
- 搜索 TikTok 广告库并浏览热门广告精选
- 进行广告关键帧分析、百分位排名分析与互动数据分析
- 拉取相似推荐广告、广告搜索建议与安全配置
- 浏览投放地域列表、趋势话题列表与单个趋势话题详情

### TikTok Shop 电商
- 查询商品详情，覆盖多端多版本数据视角
- 拉取商品评价列表
- 浏览商家全部在售商品列表
- 进行商品搜索并获取搜索建议
- 浏览商品分类树与按分类查询商品
- 拉取热卖商品榜单
- 通过分享链接解析店铺标识与商品标识
- 浏览店铺主页布局、店铺主页内容、店铺商品推荐、店铺商品列表与店铺基本信息
- 浏览店铺内的商品分类

### 工具与加密
- 生成 msToken、ttwid、webid、设备指纹、哈希 ID 等访问凭证
- 生成 XBogus、XGnarly、X-mssdk-info 等多类反爬签名
- 完成 TikTok 加密字符串的加密与解密
- 调用 TT 加密算法以及登录请求的加解密
- 注册 TikTok 设备并拉取 Web 端游客 Cookie

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
| 🚫 禁止臆造路径 | 仅使用 `references/endpoints_whitelist.yaml` 中的端点，**不得自行拼接、改版本号、加路径段** |
| 📋 数据流向第三方 | 所有请求发送至 `https://www.aconfig.cn`，请使用独立测试账号并定期轮换 API Key |
| 🔑 凭证保护 | 不暴露 API Key、Cookie、Token 至日志或对话 |
| ⚠️ 加密工具调用谨慎 | `tools.md` 中签名 / 加解密接口仅用于合规研究，**不得用于绕过平台风控** |

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
| 查视频详情 / 播放 / 批量 / 探索 | `references/video.md` | 视频详情、批量视频、分享链接解析、探索流、首页推荐、Tag 视频、合辑、视频 ID 提取（19 端点） |
| 查用户 / 粉丝 / 关注 / 作品 | `references/user.md` | 用户信息、粉丝 / 关注、作品 / 点赞 / 转发、收藏、播放列表、直播详情、用户 ID 提取（34 端点） |
| 搜索 / 热榜 / 发现 / 趋势 | `references/search.md` | 综合 / 视频 / 用户 / 音乐 / 话题 / 直播 / 地点搜索、热搜关键词、创作者搜索洞察、音乐排行榜、商品搜索（29 端点） |
| 查评论 / 回复 / 直播 | `references/comments.md` | 视频评论、评论回复、直播间信息 / 状态 / 排行榜、直播商品、弹幕 / 聊天、礼物（21 端点） |
| 查广告 / 广告分析 | `references/ads.md` | 广告搜索、详情、热门广告、关键帧分析、百分位分析、互动分析、推荐广告（12 端点） |
| 创作者后台 / 账号分析 | `references/creator.md` | 账号健康、违规记录、收益概览、直播 / 视频 / 商品分析、橱窗商品、受众画像（14 端点） |
| 查商品 / 店铺 / 电商 | `references/shop.md` | 商品详情 / 评论、商家商品、搜索建议、商品搜索、分类浏览、热卖商品、店铺信息（26 端点） |
| 数据分析 / 虚假流量 | `references/analytics.md` | 视频指标、虚假流量检测、评论关键词、创作者里程碑（4 端点） |
| 加密签名 / 指纹 / 工具 | `references/tools.md` | msToken、ttwid、web_id、XBogus / XGnarly 签名、strData 加解密、设备注册、游客 Cookie（15 端点） |
| 跨端点参数查询 / 字段流追溯 | `references/param-mappings.md` | 全局红线 + 端点路由 + 字段流字典 + 错误处理总览 + 替换矩阵 |
| 路径白名单硬校验 | `references/endpoints_whitelist.yaml` | 174 个端点的硬白名单 + Pre-call 4 步自检协议 |
| SKILL 版本检查与升级 | `references/update.md` | SkillHub / ClawHub / GitHub 三通道更新 |

**Step 3 — 构建最小调用计划**

- ✅ 优先使用最少端点完成任务，能用一个端点就不用两个
- ✅ 加密 / 签名工具调用前**必须**说明用途，避免合规风险
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
| 查视频 + 评论 | `video.md` → `comments.md` | `aweme_id` 接力 |
| 搜索 → 视频详情 | `search.md` → `video.md` | `aweme_id` 接力 |
| 查用户 → 作品 | `user.md` → `user.md` (posts) | `sec_user_id` 接力 |
| 查广告 → 分析 | `ads.md` → `ads.md` (keyframe / percentile) | `material_id` 接力 |
| 查商品 → 评论 | `shop.md` → `shop.md` (product detail) | `product_id` 接力 |
| 查创作者 → 分析 | `creator.md` → `analytics.md` | `sec_user_id` 接力 |
| 直播 + 数据 | `comments.md` → `comments.md` (live room info / ranking) | `room_id` 接力 |
| 创作者 → 商品 | `creator.md` → `shop.md` | `product_id` 接力 |
| 用户全面分析 | `user.md` → `user.md` (posts+followers) → `analytics.md` | `sec_user_id` 复用 |

#### 防臆造自检清单（强制前置步骤）

**收到 404 时（A）**：
1. 路径白名单逐字符比对 → 不在清单中 STOP
2. Method 比对 → 不等 STOP
3. 参数键名比对 → 有清单外参数 STOP
4. 资源 ID 来源溯源 → Agent 编造的 STOP
5. 全通过才判定 "上游资源不存在"

**收到 400 / 422 时（B）**：
1. 参数名严格比对（大小写 / 缩写 / 复数）
2. 必填项齐全 + oneOf 二选一逻辑
3. 类型与格式严格匹配（pattern / enum）
4. 传参方式正确（query vs body）
5. 没有 IN 表外的臆造参数
6. 全通过才按 `message_zh` 排查

#### SKILL 版本更新

| 触发条件 | 推荐操作 |
|---------|---------|
| 合法路径持续 404 / 410 | `skillhub upgrade maxhub-tiktok`（国内）或 `clawhub upgrade maxhub-tiktok`（国际） |
| 用户问 "版本是多少" | 当前版本 v3.7.2，访问 https://skillhub.cn/skills/maxhub-tiktok |
| 多端点连续 410 | `skillhub upgrade maxhub-tiktok --force` |
| 401 / 402 / 403 | **不是版本问题**，去 https://www.aconfig.cn 处理 |

### 常用命令速查表

| 场景 | 命令 |
|---|---|
| 查 API Key | `[ -n "${MAXHUB_API_KEY:-}" ] && echo "ok" \|\| echo "missing"` |
| 查视频详情 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/tiktok/app/v3/fetch_one_video?aweme_id=xxx"` |
| 查视频评论 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/tiktok/app/v3/fetch_video_comments?aweme_id=xxx"` |
| 查商品详情 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/tiktok/shop/fetch_product_detail?product_id=xxx"` |
| 检查 SKILL 更新 | `skillhub info maxhub-tiktok` 或 `clawhub info maxhub-tiktok` |


### 📌 端到端使用示例（agent 快速上手）

**用户输入**：「帮我看 TikTok 某个 aweme_id 的视频信息」

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

### 场景一：TikTok 内容创作者出海选题

- **角色**：TikTok 出海短视频创作者
- **需求**：分析当前北美 / 东南亚地区热门视频与音乐趋势，定位下一支爆款方向
- **使用方式**：调用 `search.md` 拉取热搜关键词 + 音乐排行 → 取 `aweme_id` → 链式调 `video.md` 提取详情 → `analytics.md` 检测虚假流量过滤虚高数据
- **预期收益**：剔除虚假流量影响后锁定真实爆款，提炼可复用的音乐 + 标题模板

### 场景二：跨境电商 TikTok Shop 选品

- **角色**：跨境电商运营 / 选品师
- **需求**：发现 TikTok Shop 当下热卖商品并评估真实带货能力
- **使用方式**：`shop.md` 拉取热卖商品 + 分类浏览 → 取 `product_id` → 商品详情 + 评论 → `creator.md` 反查带货达人画像
- **预期收益**：构建跨境选品决策矩阵，量化商品销量、评论情感与达人匹配度

### 场景三：海外营销广告投放分析

- **角色**：海外营销广告优化师
- **需求**：拆解竞品热门广告创意结构与互动表现，优化自家素材
- **使用方式**：`ads.md` 搜索热门广告 → 取 `material_id` → 关键帧分析 + 百分位分析 + 互动分析 → 推荐广告找相似素材
- **预期收益**：基于真实数据反推爆款广告创意公式，缩短素材测试周期，提升 CTR / CVR

### 场景四：MCN 创作者数据洞察

- **角色**：MCN 数据分析师
- **需求**：批量评估签约达人账号健康度与受众画像匹配度
- **使用方式**：`user.md` 取 `sec_user_id` → `creator.md` 拉账号健康 + 违规记录 + 受众画像 → `analytics.md` 创作者里程碑 → `comments.md` 抽样评论质量
- **预期收益**：建立达人健康度档案，提前预警违规风险，匹配品牌投放需求

## 6. 项目架构

### 目录结构

```
maxhub-tiktok/
├── SKILL.md                            # Skill 定义与使用文档（本文件）
├── README.md                           # 英文项目说明
├── README_CN.md                        # 中文项目说明
├── _meta.json                          # 版本元信息（version: 3.7.2）
└── references/
    ├── endpoints_whitelist.yaml        # 174 端点路径硬白名单 + Pre-call 4 步自检协议
    ├── param-mappings.md               # 中枢索引（全局红线 + 字段流字典 + 错误处理 + 替换矩阵）
    ├── video.md                        # 视频域：详情/批量/分享/探索流/Tag/合辑（19 端点）
    ├── user.md                         # 用户域：信息/粉丝/作品/点赞/转发/收藏（34 端点）
    ├── search.md                       # 搜索域：综合/视频/用户/音乐/话题/地点/热搜（29 端点）
    ├── comments.md                     # 评论与直播域：评论/回复/直播间/弹幕/礼物（21 端点）
    ├── ads.md                          # 广告域：搜索/详情/关键帧/百分位/互动分析（12 端点）
    ├── creator.md                      # 创作者域：账号健康/收益/分析/橱窗/受众（14 端点）
    ├── shop.md                         # 电商域：商品/店铺/搜索/分类/热卖（26 端点）
    ├── analytics.md                    # 数据分析域：虚假流量/视频指标/里程碑（4 端点）
    ├── tools.md                        # 工具域：msToken/ttwid/XBogus/strData（15 端点）
    └── update.md                       # SKILL 更新机制（SkillHub / ClawHub / GitHub）
```

### 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 调用方式 | `curl` + Bearer Token | HTTP GET / POST 请求，参数通过 query string 或 JSON body 传递 |
| 数据接口 | MaxHub API | `https://www.aconfig.cn/api/v1/tiktok/*`，通过 `MAXHUB_API_KEY` 鉴权 |
| 路径校验 | YAML 硬白名单 | `endpoints_whitelist.yaml` 提供 174 端点的逐字符校验 + 4 步 Pre-call 协议 |
| 错误处理 | 决策表 + 自检清单 | HTTP 状态码权威定义 + 防臆造自检（A/B 双轨）+ 重试策略矩阵 |
| 输出格式 | JSON Standard MaxHub Response | `{code, message, message_zh, data, cache_url}` |
| 更新通道 | SkillHub / ClawHub / GitHub | 国内 ⭐⭐⭐ SkillHub（腾讯云 CDN）/ 国际 ⭐⭐⭐ ClawHub / 降级 GitHub |

### API 覆盖范围

| 领域 | 端点数 | Reference 文件 |
|------|--------|---------------|
| 视频（Video） | 19 | `video.md` |
| 用户（User） | 34 | `user.md` |
| 搜索（Search） | 29 | `search.md` |
| 评论与直播（Comments） | 21 | `comments.md` |
| 广告（Ads） | 12 | `ads.md` |
| 创作者（Creator） | 14 | `creator.md` |
| 电商（Shop） | 26 | `shop.md` |
| 数据分析（Analytics） | 4 | `analytics.md` |
| 工具（Tools） | 15 | `tools.md` |
| **合计** | **174** | — |

### 关键设计理念

- **防臆造四道闸**：白名单（endpoints_whitelist.yaml）→ 强标记（Full path）→ 禁止规则（Forbidden）→ 错误反馈（STOP）
- **Agent 友好 7 大原则**：结构胜于叙述、明确指令优于建议、单一来源、词法稳定性、低 token 密度、边界显式声明、错误处理是契约
- **链式调用图谱**：字段流字典 + Chain Recipes + 跨 reference 链路三层联动，杜绝 Agent 编造字段名
- **错误处理契约**：HTTP 状态码权威定义 + §3.1 防臆造自检清单（A: 5 步 / B: 6 步）+ 重试策略矩阵 + 端点替换矩阵
