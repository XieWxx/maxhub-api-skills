---
name: maxhub-tiktok
description: >-
  Query TikTok data via MaxHub API — video details, user profiles,
  search, trending, comments, live streams, ads analytics, creator tools,
  shop/ecommerce, and crypto/encryption utilities.
  Use when user asks about TikTok content, 视频, 用户, 搜索, 广告, 创作者, 商店, 直播, 评论.
  Do NOT use for posting content or account operations (read-only).
license: MIT-0
metadata:
  author: maxhub
  version: "3.7.2"
  openclaw:
    emoji: "🎶"
    primaryEnv: MAXHUB_API_KEY
    requires:
      env: [MAXHUB_API_KEY]
      bins: [curl]
    env:
      - name: MAXHUB_API_KEY
        description: "API key for MaxHub data APIs. Get one at https://www.aconfig.cn"
        required: true
        sensitive: true
    network: ["https://www.aconfig.cn"]
  hermes:
    tags: ["tiktok", "TikTok", "短视频", "视频分析", "用户分析", "搜索", "广告分析", "创作者工具", "电商", "直播", "评论", "加密工具"]
    category: productivity
---

# TikTok 数据助手

## 1. 简介

TikTok 海外短视频数据查询与分析工具，通过 MaxHub API 接入 TikTok 全平台公开数据，覆盖视频详情、用户画像、搜索趋势、评论直播、广告分析、创作者后台、TikTok Shop 电商、虚假流量分析、签名加密工具等九大领域共 174 个端点。专注服务于 TikTok 出海创作者、跨境电商运营、海外营销广告优化师与数据分析团队，帮助用户高效采集 TikTok 全球数据、洞察广告投放与电商选品策略。

## 2. 功能特性

- 🎬 **视频全维度查询** — 支持 aweme_id / 分享链接 / Tag 多入口查询，覆盖详情、批量、探索流、首页推荐、合辑、ID 提取（19 端点）

- 👤 **用户全景画像** — 用户信息、粉丝 / 关注、作品 / 点赞 / 转发列表、收藏、播放列表、直播详情、用户 ID 提取（34 端点）

- 🔍 **多模态搜索矩阵** — 综合 / 视频 / 用户 / 音乐 / 话题 / 直播 / 地点 / 商品搜索 + 热搜关键词 + 创作者洞察 + 音乐排行（29 端点）

- 💬 **评论与直播实时数据** — 视频评论、回复、直播间信息 / 状态 / 排行榜、直播商品、弹幕 / 聊天、礼物（21 端点）

- 📢 **广告分析全链路** — 广告搜索、详情、热门广告、关键帧分析、百分位分析、互动分析、推荐广告（12 端点）

- 📊 **创作者后台数据** — 账号健康、违规记录、收益概览、直播 / 视频 / 商品分析、橱窗商品、受众画像（14 端点）

- 🛒 **TikTok Shop 电商** — 商品详情 / 评论、商家商品、搜索建议、商品搜索、分类浏览、热卖商品、店铺信息（26 端点）

- 🔬 **数据质量分析** — 视频指标、虚假流量检测、评论关键词、创作者里程碑（4 端点）

- 🛠️ **签名与加密工具** — msToken、ttwid、web_id、XBogus / XGnarly 签名、strData 加解密、设备注册、游客 Cookie（15 端点）

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
