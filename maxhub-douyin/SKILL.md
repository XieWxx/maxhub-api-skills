---
name: maxhub-douyin
description: >-
  Query Douyin (抖音) data via MaxHub API — video details, user profiles,
  search, trending, creator tools, xingtu KOL analytics, content index,
  live streaming, and comments.
  Use when user asks about any 抖音 content, 视频, 用户, 热榜, 搜索, 创作者, 星图, 直播, 评论, or 抖音数据.
  Do NOT use for posting content or account operations (read-only).
license: MIT-0
metadata:
  author: maxhub
  version: "3.7.2"
  openclaw:
    emoji: "🎵"
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
    tags: ["抖音", "douyin", "短视频", "热搜", "视频分析", "用户分析", "创作者", "星图", "抖音指数", "关键词搜索", "评论采集", "直播数据", "话题分析", "数据采集"]
    category: productivity
---

# 抖音 数据助手

## 1. 简介

抖音数据查询与分析工具，通过 MaxHub API 接入抖音平台全量公开数据，覆盖视频详情、用户画像、关键词搜索、热搜热榜、创作者后台、星图 KOL 分析、抖音指数、直播数据、评论弹幕等十大领域共 273 个端点。专注服务于抖音内容创作者、新媒体运营、星图投放分析师、直播数据团队与品牌竞品研究者，帮助用户快速采集抖音全平台数据、提炼爆款规律、辅助选题与投放决策。

## 2. 详细功能

### 视频数据
- 查询抖音视频的完整详情，包含标题、封面、播放、点赞、评论、收藏、分享等核心指标
- 支持通过视频原始 ID、分享链接、短链接、二维码等多种入口快速定位视频
- 获取视频的无水印高清播放地址，便于素材归档与二次研究
- 批量查询多个视频的详情与统计数据，适合大规模选题对比与赛道扫描
- 拉取视频弹幕全量数据，复原视频实时互动氛围
- 浏览首页推荐流与单条视频的相关推荐，洞察平台分发逻辑
- 查询合集、短剧、音乐、话题的详情与对应作品列表
- 浏览知识、游戏、动漫、美食、音乐等垂直频道下的作品聚合

### 用户数据
- 查询抖音用户主页全量信息，包含昵称、签名、头像、地区、认证、粉丝数、获赞数等
- 支持通过抖音号、短 ID、加密 ID、UID 等多种用户标识互相转换与查询
- 批量查询多个用户的资料卡片，适合达人库扩量
- 拉取用户的粉丝列表与关注列表，构建关系图谱
- 拉取用户的发布作品、点赞作品、收藏夹与合辑视频

### 搜索能力
- 执行抖音综合搜索，一次返回视频、用户、话题、直播等混合结果
- 单独执行视频搜索、用户搜索、图片搜索、直播搜索、话题搜索
- 执行音乐搜索、经验搜索、讨论搜索、学校搜索与以图搜视频
- 获取搜索框联想词与话题挑战联想词，辅助关键词扩展

### 评论与弹幕
- 拉取视频一级评论列表，覆盖 App 端与 Web 端多入口
- 接力拉取每条评论下的二级回复，构建完整评论树
- 拉取视频的实时弹幕与历史弹幕全量数据

### 直播数据
- 查询用户直播间详情，包含主播信息、直播标题、封面、状态、在线人数
- 检测用户当前是否在直播以及关联的直播间标识
- 拉取直播间 IM 实时弹幕流与互动数据
- 完成直播间不同标识体系（webcast 标识与房间标识）之间的互转
- 拉取直播间送礼排行榜，识别核心粉丝与高价值用户
- 拉取直播间挂车商品列表、商品规格、优惠券、评价分与评价详情

### 热榜与趋势
- 拉取抖音综合热搜榜、直播热搜榜、音乐热搜榜、品牌热搜榜
- 浏览分类热榜、上升热榜、同城热榜、挑战热榜与总榜
- 查询活动日历的活动列表与单个活动详情
- 拉取热点话题的关联用户画像、评论词云与作品趋势
- 查询热门账号榜、账号粉丝画像、粉丝兴趣账号、粉丝兴趣话题、粉丝兴趣搜索
- 拉取视频总榜、低粉爆款榜、高播放榜、高点赞榜、高涨粉榜
- 查询话题榜、搜索榜、热词榜及其每个条目的详情
- 浏览城市列表与内容标签维度的热点分布

### 创作者后台
- 查询创作者活动列表与单个活动详情，了解平台扶持机会
- 浏览素材中心的素材榜、相关推荐与配置项
- 获取热点榜、热门话题榜、热门道具榜、热门挑战榜、热门音乐榜、热门课程榜
- 拉取行业分类、任务中心商单列表与内容品类信息
- 进行作品流量分析，包括总览、播放来源、搜索关键词、观看趋势
- 进行作品弹幕分析与观众画像，识别真实受众构成
- 拉取作品列表、作品深度分析与可下载报表
- 查询直播间历史回顾与账号诊断报告

### 星图 KOL 分析
- 通过抖音用户标识（UID、加密 ID、抖音号）反查星图达人 ID
- 拉取 KOL 基本信息、达人画像、粉丝画像与服务报价
- 查询 KOL 数据概览、转化能力、视频表现、星图指数与触达分布
- 拉取 KOL 关联推广视频、合作品牌、日活粉丝走势
- 拉取 KOL 热门评论高频词与内容关键词，洞察粉丝关注点
- 进行 KOL 搜索与短剧演员搜索，按多维度筛选合适达人
- 浏览星图榜单分类目录与具体榜单数据
- 查询作者营销字段、商业卡片、本地服务信息与作品展示
- 浏览优秀案例分类、达人传播信息与达人推荐
- 查询 IP 活动行业、IP 活动列表、活动详情、资源位列表与需求方 MCN 列表
- 生成达人主页二维码与内容趋势指引

### 抖音指数
- 查询抖音指数关键词的有效日期范围与当前热点
- 拉取热门词、关键词热度趋势与多词解读
- 拉取关键词关联词、人群画像与用户细分词
- 完成抖音指数体系内的用户标识加密
- 进行达人搜索、达人对比、相似达人推荐与达人筛选项查询
- 拉取达人的代表作品、作品里程碑与粉丝画像
- 进行品牌搜索、品牌信息验证、品牌雷达图、品牌走势线、品牌周期分析
- 拉取品牌主动指数周榜与品牌时段热门视频
- 进行话题搜索与话题详情查询
- 拉取创作灵感关键词、关键词作品、选题建议、发布趋势与时长建议
- 拉取作者画像、消费画像、互动趋势与消费趋势
- 搜索趋势研究报告、查看报告详情与智能洞察推荐

### 工具与签名
- 注册抖音设备并生成 App 端访问凭证
- 拉取抖音 Web 端游客 Cookie，便于无登录态的数据采集
- 生成 msToken、ttwid、verify_fp、s_v_web_id 等访问指纹
- 生成抖音 Web 端反爬签名与弹幕长连接签名
- 从分享链接、短链中提取视频标识、用户标识、直播间标识，支持单条与批量
- 生成抖音短链与视频分享二维码
- 唤起抖音 App 直跳视频、用户主页、关键词搜索与私信会话
- 通过分享码反查分享内容信息

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
| ⚠️ 高风险端点确认 | `fetch_multi_video` 等批量 / 写入端点须用户明确确认参数后才能调用 |

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
| 查视频详情 / 播放 / 下载 / 统计 | `references/video.md` | 视频详情、批量视频、播放 URL、统计、合集 / 短剧、音乐 / 话题、分享 / 短链 / 二维码、频道内容、ID 提取（42 端点） |
| 查用户 / 粉丝 / 作品 / 喜欢 | `references/user.md` | 用户信息、粉丝 / 关注、作品、喜欢、收藏夹、合辑、用户搜索、开播信息（24 端点） |
| 搜索视频 / 用户 / 图片 / 直播 | `references/search.md` | 综合 / 视频 / 用户 / 图片 / 直播 / 话题 / 经验 / 音乐 / 讨论 / 学校 / 图像搜索 + 建议（19 端点） |
| 查热搜 / 热榜 / 活动日历 | `references/trending.md` | 热榜分类、上升 / 同城 / 挑战热点、活动日历、粉丝画像、账号 / 视频 / 话题 / 搜索热榜、首页推荐（39 端点） |
| 查创作者数据 / 作品分析 | `references/creator.md` | 创作者活动、素材中心、热门榜单、商单任务、行业分类、流量分析、观众画像、账号诊断、直播历史（31 端点） |
| 查星图 KOL / 达人分析 | `references/xingtu.md` | KOL ID 查询、基本信息、画像、报价、数据概览、KOL 搜索、转化分析、星图指数、视频表现、热榜、达人广场、MCN、IP 日历（43 端点） |
| 查评论 / 回复 / 弹幕 | `references/comments.md` | 视频评论、评论回复、视频弹幕（6 端点） |
| 查抖音指数 / 品牌 / 达人 | `references/content.md` | 关键词趋势、关联词、人群画像、达人分析、视频搜索、品牌指数、话题搜索、创作指南、趋势报告（44 端点） |
| 查直播 / 直播间 / 商品 | `references/live.md` | 直播流、弹幕、送礼排行、直播间商品、商品详情 / 评价、直播间 ID 转换（14 端点） |
| 生成 Cookie / Token / 签名 | `references/tools.md` | 设备注册、APP 跳转、游客 Cookie、msToken / ttwid / verify_fp / s_v_web_id、X-Bogus / A-Bogus / 弹幕 xb 签名（13 端点） |
| 跨端点参数查询 / 字段流追溯 | `references/param-mappings.md` | 全局红线 + 端点路由 + 字段流字典 + 错误处理总览 + 替换矩阵 |
| 路径白名单硬校验 | `references/endpoints_whitelist.yaml` | 273 个端点的硬白名单 + Pre-call 4 步自检协议 |
| SKILL 版本检查与升级 | `references/update.md` | SkillHub / ClawHub / GitHub 三通道更新 |

**Step 3 — 构建最小调用计划**

- ✅ 优先使用最少端点完成任务，能用一个端点就不用两个
- ✅ 高风险端点（批量 / 写入）调用前**必须**让用户确认参数
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
| 查创作者 → 视频详情 | `creator.md` → `video.md` | `item_id` → `aweme_id` |
| 查用户 → 星图 KOL | `user.md` → `xingtu.md` | `uid` / `sec_user_id` → `kolid` |
| 查热搜 → 视频详情 | `trending.md` → `video.md` | `aweme_id` 接力 |
| 查直播 → 观众画像 | `live.md` → `creator.md` (audience_portrait) | `room_id` 接力 |
| 查品牌趋势 → 人群画像 | `content.md` → `content.md` (portrait) | `keyword` 接力 |
| 用户全面分析 | `user.md` → `user.md` (stats+posts+likes) → `xingtu.md` | `sec_user_id` 复用 |

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
| 合法路径持续 404 / 410 | `skillhub upgrade maxhub-douyin`（国内）或 `clawhub upgrade maxhub-douyin`（国际） |
| 用户问 "版本是多少" | 当前版本 v3.7.2，访问 https://skillhub.cn/skills/maxhub-douyin |
| 多端点连续 410 | `skillhub upgrade maxhub-douyin --force` |
| 401 / 402 / 403 | **不是版本问题**，去 https://www.aconfig.cn 处理 |

### 常用命令速查表

| 场景 | 命令 |
|---|---|
| 查 API Key | `[ -n "${MAXHUB_API_KEY:-}" ] && echo "ok" \|\| echo "missing"` |
| 查视频详情 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/douyin/app/v3/fetch_one_video?aweme_id=xxx"` |
| 查视频评论 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/douyin/app/v3/fetch_video_comments?aweme_id=xxx"` |
| 分享 URL 解析 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/douyin/app/v3/fetch_one_video_by_share_url?share_url=xxx"` |
| 检查 SKILL 更新 | `skillhub info maxhub-douyin` 或 `clawhub info maxhub-douyin` |

## 5. 使用场景

### 场景一：抖音内容创作者寻找选题

- **角色**：抖音短视频创作者
- **需求**：想分析近期同赛道热门视频共性，寻找下一个选题方向
- **使用方式**：调用 `trending.md` 拉取分类热榜与上升榜 → 取 `aweme_id` → 链式调 `video.md` 提取标题、话题、音乐 → 调 `comments.md` 抓取评论关键词
- **预期收益**：通过热榜 + 详情 + 评论三层链路快速锁定高互动作品共同特征，沉淀可复用的选题模板与音乐库

### 场景二：新媒体团队竞品分析

- **角色**：MCN / 品牌新媒体运营
- **需求**：监控竞品账号的作品节奏、粉丝增长与互动表现
- **使用方式**：`user.md` 取 `sec_user_id` → 拉取作品列表 + 粉丝统计 → `creator.md` 调用流量分析与观众画像 → `comments.md` 抽样评论
- **预期收益**：构建竞品账号画像数据库，量化对比内容策略与受众重合度

### 场景三：星图 KOL 投放分析

- **角色**：品牌投放 / 广告优化师
- **需求**：在投放前评估 KOL 真实粉丝画像、报价合理性与历史转化数据
- **使用方式**：`user.md` 反查 `uid` → `xingtu.md` 用 KOL ID 查询基本信息 + 服务报价 + 转化分析 + 视频表现 + 星图指数
- **预期收益**：投放前完成 KOL 健康度筛查，降低无效投放，提升 ROI 决策准确度

### 场景四：直播数据采集与商品分析

- **角色**：直播电商运营 / 数据分析师
- **需求**：实时监控直播间互动、礼物排行与挂车商品转化
- **使用方式**：`live.md` 取 `room_id` → 拉取弹幕 + 送礼排行 + 直播商品 → `live.md` 商品详情 / 评价 → `creator.md` 观众画像
- **预期收益**：构建直播间秒级监控面板，识别高转化商品组合与观众分层特征

## 6. 项目架构

### 目录结构

```
maxhub-douyin/
├── SKILL.md                            # Skill 定义与使用文档（本文件）
├── README.md                           # 英文项目说明
├── README_CN.md                        # 中文项目说明
├── _meta.json                          # 版本元信息（version: 3.7.2）
└── references/
    ├── endpoints_whitelist.yaml        # 273 端点路径硬白名单 + Pre-call 4 步自检协议
    ├── param-mappings.md               # 中枢索引（全局红线 + 字段流字典 + 错误处理 + 替换矩阵）
    ├── video.md                        # 视频域：详情/播放/下载/统计/合集/音乐/话题（42 端点）
    ├── user.md                         # 用户域：资料/粉丝/作品/喜欢/收藏夹/合辑/搜索（24 端点）
    ├── search.md                       # 搜索域：综合/视频/用户/图片/直播/话题/经验等（19 端点）
    ├── trending.md                     # 热榜域：分类/上升/同城/挑战/活动/账号/话题（39 端点）
    ├── creator.md                      # 创作者域：素材/商单/流量/画像/账号诊断（31 端点）
    ├── xingtu.md                       # 星图域：KOL/画像/报价/转化/指数/MCN/IP 日历（43 端点）
    ├── comments.md                     # 评论域：评论/回复/弹幕（6 端点）
    ├── content.md                      # 抖音指数域：关键词/品牌/人群/趋势报告（44 端点）
    ├── live.md                         # 直播域：直播流/弹幕/礼物/商品/转换（14 端点）
    ├── tools.md                        # 工具域：Cookie/Token/签名/设备注册（13 端点）
    └── update.md                       # SKILL 更新机制（SkillHub / ClawHub / GitHub）
```

### 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 调用方式 | `curl` + Bearer Token | HTTP GET / POST 请求，参数通过 query string 或 JSON body 传递 |
| 数据接口 | MaxHub API | `https://www.aconfig.cn/api/v1/douyin/*`，通过 `MAXHUB_API_KEY` 鉴权 |
| 路径校验 | YAML 硬白名单 | `endpoints_whitelist.yaml` 提供 273 端点的逐字符校验 + 4 步 Pre-call 协议 |
| 错误处理 | 决策表 + 自检清单 | HTTP 状态码权威定义 + 防臆造自检（A/B 双轨）+ 重试策略矩阵 |
| 输出格式 | JSON Standard MaxHub Response | `{code, message, message_zh, data, cache_url}` |
| 更新通道 | SkillHub / ClawHub / GitHub | 国内 ⭐⭐⭐ SkillHub（腾讯云 CDN）/ 国际 ⭐⭐⭐ ClawHub / 降级 GitHub |

### API 覆盖范围

| 领域 | 端点数 | Reference 文件 |
|------|--------|---------------|
| 视频（Video） | 42 | `video.md` |
| 用户（User） | 24 | `user.md` |
| 搜索（Search） | 19 | `search.md` |
| 热榜（Trending） | 39 | `trending.md` |
| 创作者（Creator） | 31 | `creator.md` |
| 星图（Xingtu） | 43 | `xingtu.md` |
| 评论（Comments） | 6 | `comments.md` |
| 抖音指数（Content） | 44 | `content.md` |
| 直播（Live） | 14 | `live.md` |
| 工具（Tools） | 13 | `tools.md` |
| **合计** | **273** | — |

### 关键设计理念

- **防臆造四道闸**：白名单（endpoints_whitelist.yaml）→ 强标记（Full path）→ 禁止规则（Forbidden）→ 错误反馈（STOP）
- **Agent 友好 7 大原则**：结构胜于叙述、明确指令优于建议、单一来源、词法稳定性、低 token 密度、边界显式声明、错误处理是契约
- **链式调用图谱**：字段流字典 + Chain Recipes + 跨 reference 链路三层联动，杜绝 Agent 编造字段名
- **错误处理契约**：HTTP 状态码权威定义 + §3.1 防臆造自检清单（A: 5 步 / B: 6 步）+ 重试策略矩阵 + 端点替换矩阵
