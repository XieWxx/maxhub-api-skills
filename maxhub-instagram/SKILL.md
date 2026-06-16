---
name: maxhub-instagram
description: |-
  Instagram 数据查询工具，通过 MaxHub API 接入 Instagram 平台，覆盖 V1 / V2 / V3 三大版本接口，全面支持帖子（Post）、Reels、Stories、Highlights、用户资料、粉丝/关注、Hashtag、Location、评论与回复、综合搜索等数据采集场景。专注服务于海外网红营销、跨境品牌监控、社媒数据爬取、用户增长分析与内容选题等业务，帮助用户快速锁定目标账号、提取爆款规律、量化品牌话题热度。
license: MIT-0
metadata:
  author: maxhub
  version: "3.7.2"
  openclaw:
    emoji: "📸"
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
    tags: ["instagram", "ins", "帖子", "用户分析", "reels", "快拍", "搜索", "评论采集", "stories", "网红分析", "品牌营销", "海外社媒", "数据采集"]
    category: productivity
---

# Instagram 数据助手

## 1. 简介

Instagram 数据查询工具，通过 MaxHub API 接入 Instagram 平台，覆盖 V1 / V2 / V3 三大版本接口，全面支持帖子（Post）、Reels、Stories、Highlights、用户资料、粉丝/关注、Hashtag、Location、评论与回复、综合搜索等数据采集场景。专注服务于海外网红营销、跨境品牌监控、社媒数据爬取、用户增长分析与内容选题等业务，帮助用户快速锁定目标账号、提取爆款规律、量化品牌话题热度。

## 2. 详细功能

### 帖子数据
- 查询 Instagram 帖子完整详情，覆盖图文、Carousel 多图、视频、Reels 多种形态
- 支持通过短码、媒体 ID、分享链接三种入口直接定位帖子
- 提供帖子点赞用户列表、被标记用户、音乐元数据等关联信息
- 支持帖子 oEmbed 嵌入数据获取，便于第三方页面引用
- 提供短码与媒体 ID 双向互转，解决跨接口资源 ID 不一致的问题

### Reels 与 Stories
- 拉取指定用户的全部 Reels 短视频列表
- 获取系统推荐 Reels 流，洞察平台分发偏好
- 查询用户当日 Stories 快拍内容
- 查询用户 Highlights 精选合集，并支持深入到精选内的具体 Reel 明细
- 查询音乐相关帖子流，支持以同款音乐为线索发现热门内容

### 评论与回复
- 拉取帖子一级评论列表，支持游标翻页
- 拉取指定评论下的二级回复链路
- 提供单条评论翻译能力，覆盖跨语种内容理解
- 支持批量翻译评论，满足海外舆情整理与摘要场景

### 用户画像
- 通过用户名、用户 ID 获取用户完整资料卡
- 提供用户简要信息接口，适合需要轻量数据的场景
- 拉取用户全部投稿帖子、Reels、被标记的帖子、转发记录
- 拉取用户粉丝列表、关注列表，分析受众构成
- 获取用户 About 信息、曾用名历史、相似账号推荐
- 提供用户 ID 与用户名双向互转，便于跨接口数据接力

### 搜索能力
- 支持用户搜索，按账号关键词定位目标博主
- 支持综合搜索，一次返回用户、帖子、话题等多类型结果
- 支持 Reels 视频搜索、音乐搜索，定位特定话题或 BGM 内容
- 支持 Hashtag 话题搜索、Location 地点搜索
- 提供 Explore 探索页与探索分区帖子流

### 地点与话题图谱
- 查询 Hashtag 话题下的帖子流，识别话题热度
- 查询 Location 地点详情、地点帖子流、附近地点列表
- 支持按经纬度坐标搜索附近内容
- 提供城市与地区列表，构建层级化地理筛选

### 多版本接口共存
- 同时提供三套接口版本并行运行，覆盖不同稳定性与数据丰富度需求
- 不同版本之间端点互为备份，单版本异常时可降级切换
- 不同版本字段丰富度各有侧重，可按业务场景择优调用

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
| 🚫 禁止臆造路径 | 仅使用 `references/endpoints_whitelist.yaml` 中的端点，**不得自行拼接、改版本号、加路径段** |
| 📋 数据流向第三方 | 所有请求发送至 `https://www.aconfig.cn`，请使用独立测试账号并定期轮换 API Key |
| 🔑 凭证保护 | 不暴露 API Key、Cookie、Token 至日志或对话 |
| 🔀 版本不互通 | V1 / V2 / V3 端点参数不兼容，**禁止跨版本套用参数名** |

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
| 查帖子 / Reels / Stories / Highlights / 音乐帖 / 翻译 | `references/post.md` | 帖子详情、Reels、Stories、Highlights、点赞、标记、shortcode↔media_id 转换、评论翻译（34 端点） |
| 查用户 / 粉丝 / 关注 / About / 曾用名 / 相似用户 | `references/user.md` | 用户资料、帖子、Reels、Followers、Following、Tagged、相似推荐（24 端点） |
| 搜索 / 探索 / 话题 / 地点 / 坐标 | `references/search.md` | 用户搜索、综合搜索、Hashtag、Location、坐标、城市、Explore（23 端点） |
| 查评论 / 回复 | `references/comments.md` | V1/V2/V3 帖子评论与子评论回复（6 端点） |
| 跨端点参数查询 / 字段流追溯 | `references/param-mappings.md` | 全局红线 + 端点路由 + V1/V2/V3 字段流字典 + 错误处理总览 |
| 路径白名单硬校验 | `references/endpoints_whitelist.yaml` | 87 端点的硬白名单 + Pre-call 4 步自检协议 |

**Step 3 — 构建最小调用计划**

- ✅ 优先使用最少端点完成任务，能用一个端点就不用两个
- ✅ 跨版本切换时**必须**重新读取该版本的 reference，禁止套用其他版本参数
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
| 搜索用户 → 帖子详情 | `v3_search_users` → `v3_get_post_info_by_code` | `username` → `code` |
| 查帖子 + 评论 + 回复（V3） | `v3_get_post_info_by_code` → `v3_get_post_comments` → `v3_get_comment_replies` | `code` → `media_id` + `comment_id` 接力 |
| 查帖子 + 评论 + 回复（V2） | `v2_fetch_post_info` → `v2_fetch_post_comments` → `v2_fetch_comment_replies` | `code_or_url` → `comment_id` 接力 |
| 查用户 → 帖子 + Reels | `v3_get_user_profile` → `v3_get_user_posts` + `v3_get_user_reels` | `user_id` / `username` 复用 |
| 用户全面画像 | `v2_fetch_user_info` → `v2_fetch_user_posts` + `v2_fetch_user_followers` + `v2_fetch_user_stories` | `user_id` 复用 |
| Hashtag → 帖子流 | `v2_search_hashtags` → `v2_fetch_hashtag_posts` | `keyword` 接力 |
| Location → 附近 + 帖子 | `v3_get_location_info` → `v3_get_location_nearby` + `v3_get_location_posts` | `location_id` 复用 |

> ⚠️ **V3 关键陷阱**：`v3_get_comment_replies` 的必填参数是 **`media_id` + `comment_id`**，不是 `code` + `comment_id`。需先用 `v3_shortcode_to_media_id` 把 code 转成 media_id 再调用。

#### 防臆造自检清单（强制前置步骤）

**收到 404 时（A）**：
1. 路径白名单逐字符比对 → 不在清单中 STOP
2. Method 比对 → 不等 STOP
3. 参数键名比对 → 有清单外参数 STOP
4. 资源 ID 来源溯源 → Agent 编造的 STOP
5. 全通过才判定"上游资源不存在"

**收到 400 / 422 时（B）**：
1. 参数名严格比对（大小写 / 缩写 / 复数 / 版本差异）
2. 必填项齐全 + oneOf 二选一逻辑（V2/V3 大量端点支持 `username` 或 `user_id` 二选一）
3. 类型与格式严格匹配（pattern / enum）
4. 传参方式正确（query vs body）
5. 没有清单外的臆造参数（如把 V1 的 `max_id` 用到 V3 的 `after`）
6. 全通过才按 `message_zh` 排查

#### V1 / V2 / V3 版本选型建议

| 维度 | V1 | V2 | V3 |
|---|---|---|---|
| 稳定性 | 较旧，部分端点已迁移 | 中等，仍主力 | 最新，推荐优先使用 |
| 字段丰富度 | 基础 | 中等 | 最丰富（含 Carousel / oEmbed / 推荐 Reels） |
| 翻页参数 | `max_id` / `end_cursor` | `pagination_token` | `after` / `first` / `last` |
| 推荐场景 | 历史脚本兼容 | 综合搜索、Stories、Highlights | 用户 / 帖子主流查询 |

#### SKILL 版本更新

| 触发条件 | 推荐操作 |
|---------|---------|
| 合法路径持续 404 / 410 | `skillhub upgrade maxhub-instagram`（国内）或 `clawhub upgrade maxhub-instagram`（国际） |
| 用户问"版本是多少" | 当前版本 v3.7.2，访问 https://skillhub.cn/skills/maxhub-instagram |
| 多端点连续 410 | `skillhub upgrade maxhub-instagram --force` |
| 401 / 402 / 403 | **不是版本问题**，去 https://www.aconfig.cn 处理 |

### 常用命令速查表

| 场景 | 命令 |
|---|---|
| 查 API Key | `[ -n "${MAXHUB_API_KEY:-}" ] && echo "ok" \|\| echo "missing"` |
| 查帖子详情（V3 by code） | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/instagram/v3/get_post_info_by_code?code=Cxxxx"` |
| 查用户资料（V3） | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/instagram/v3/get_user_profile?username=xxx"` |
| 查帖子评论（V3） | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/instagram/v3/get_post_comments?code=Cxxxx"` |
| 综合搜索（V3） | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/instagram/v3/general_search?query=xxx"` |
| 检查 SKILL 更新 | `skillhub info maxhub-instagram` 或 `clawhub info maxhub-instagram` |

## 5. 使用场景

### 场景一：Instagram 网红营销选号

- **角色**：跨境 DTC 品牌投放经理
- **需求**：批量分析候选 KOL 的粉丝量、互动率、Reels 表现，筛选投放对象
- **使用方式**：`v3_search_users` 搜索领域关键词 → 取 `username` → 链式调 `v3_get_user_profile` + `v3_get_user_posts` + `v3_get_user_reels`，提取 follower_count / 平均点赞 / Reels 播放
- **预期收益**：一次链路完成数十账号筛选，量化对比互动率，避免凭直觉选号

### 场景二：海外品牌话题与舆情监控

- **角色**：海外品牌 PR / 公关团队
- **需求**：监控品牌相关 Hashtag 与 Location 下的实时帖子流，及时发现负面或爆款
- **使用方式**：`v2_search_hashtags` → `v2_fetch_hashtag_posts` 拉取热门帖；`v3_get_location_posts` 监控线下门店所在 Location；对热门帖 `v3_get_post_comments` 深挖评论情感
- **预期收益**：构建 Hashtag + Location + 评论的三维舆情监控网，关键事件响应提速

### 场景三：社媒数据爬取与素材库构建

- **角色**：内容运营 / 数据分析师
- **需求**：批量采集竞品账号近 30 天的所有帖子与 Reels，建立内容素材库
- **使用方式**：`v3_get_user_id_by_username` 解析 `user_id` → `v3_get_user_posts` + `v3_get_user_reels` 翻页采集 → 对高互动帖 `v3_get_post_info_by_code` 取详情 + Carousel 媒体地址
- **预期收益**：完整素材库 + 字段标准化，支撑选题、剪辑、广告 Hook 提炼

### 场景四：用户增长 / 粉丝结构分析

- **角色**：增长分析师
- **需求**：分析自有账号或竞品账号的 Followers / Following 重合度、粉丝头像与 bio 特征
- **使用方式**：`v2_fetch_user_followers` + `v2_fetch_user_following` 采集列表 → 抽样 `v2_fetch_user_info` 取每个粉丝的 bio / 是否私密 / followers_count
- **预期收益**：识别核心粉丝群体画像，为后续投放圈选与内容定位提供依据

## 6. 项目架构

### 目录结构

```
maxhub-instagram/
├── SKILL.md                            # Skill 定义与使用文档（本文件）
├── README.md                           # 英文项目说明
├── README_CN.md                        # 中文项目说明
├── _meta.json                          # 版本元信息（version: 3.7.2）
└── references/
    ├── endpoints_whitelist.yaml        # 87 端点路径硬白名单 + Pre-call 4 步自检协议
    ├── param-mappings.md               # 中枢索引（全局红线 + 字段流字典 + 错误处理 + 版本差异）
    ├── post.md                         # 帖子域：详情/Reels/Stories/Highlights/点赞/标记/转换/翻译（34 端点）
    ├── user.md                         # 用户域：资料/帖子/粉丝/关注/About/曾用名/相似用户（24 端点）
    ├── search.md                       # 搜索域：用户/综合/Hashtag/Location/坐标/Explore（23 端点）
    └── comments.md                     # 评论域：V1/V2/V3 帖子评论与子回复（6 端点）
```

### 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 调用方式 | `curl` + Bearer Token | HTTP GET 请求，参数通过 query string 传递 |
| 数据接口 | MaxHub API | `https://www.aconfig.cn/api/v1/instagram/*`，通过 `MAXHUB_API_KEY` 鉴权 |
| 路径校验 | YAML 硬白名单 | `endpoints_whitelist.yaml` 提供 87 端点的逐字符校验 + 4 步 Pre-call 协议 |
| 错误处理 | 决策表 + 自检清单 | HTTP 状态码权威定义 + 防臆造自检（A/B 双轨）+ V1↔V2↔V3 替换矩阵 |
| 输出格式 | JSON Standard MaxHub Response | `{code, message, message_zh, data, cache_url}` |
| 更新通道 | SkillHub / ClawHub / GitHub | 国内 ⭐⭐⭐ SkillHub（腾讯云 CDN）/ 国际 ⭐⭐⭐ ClawHub / 降级 GitHub |

### API 覆盖范围

| 领域 | 端点数 | Reference 文件 |
|------|--------|---------------|
| 帖子（Posts / Reels / Stories / Highlights） | 34 | `post.md` |
| 用户（Users） | 24 | `user.md` |
| 搜索（Search / Explore / Location / Hashtag） | 23 | `search.md` |
| 评论（Comments） | 6 | `comments.md` |
| **合计** | **87** | — |

### 关键设计理念

- **防臆造四道闸**：白名单（endpoints_whitelist.yaml）→ 强标记（Full path）→ 禁止规则（Forbidden）→ 错误反馈（STOP）
- **多版本路由**：V1 / V2 / V3 三版本并行，每个版本独立维护参数命名与翻页协议，杜绝 Agent 跨版本套用
- **链式调用图谱**：字段流字典 + Chain Recipes + 跨 reference 链路三层联动，重点防护 V3 子评论需 `media_id` 这类细节陷阱
- **错误处理契约**：HTTP 状态码权威定义 + §3.1 防臆造自检清单（A: 5 步 / B: 6 步）+ V1↔V2↔V3 替换矩阵
