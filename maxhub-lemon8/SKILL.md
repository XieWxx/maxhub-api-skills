---
name: maxhub-lemon8
description: |-
  Lemon8 数据查询工具，通过 MaxHub API 接入字节跳动旗下海外种草社区 Lemon8（柠檬 8），覆盖笔记详情、评论、用户资料、关注 / 粉丝、Discover 发现、热搜词、话题、综合搜索、分享文本解析等核心能力。专注服务于 Lemon8 种草研究、海外内容运营、话题趋势监测与跨境品牌投放场景，帮助用户高效采集 Lemon8 笔记数据、识别热门话题与种草达人，构建海外生活方式赛道的内容情报。
license: MIT-0
metadata:
  author: maxhub
  version: "3.7.2"
  openclaw:
    emoji: "🍋"
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
    tags: ["lemon8", "柠檬8", "生活方式", "帖子分析", "用户分析", "搜索发现", "种草", "海外社媒", "数据采集"]
    category: productivity
---

# Lemon8 数据助手

## 1. 简介

Lemon8 数据查询工具，通过 MaxHub API 接入字节跳动旗下海外种草社区 Lemon8（柠檬 8），覆盖笔记详情、评论、用户资料、关注 / 粉丝、Discover 发现、热搜词、话题、综合搜索、分享文本解析等核心能力。专注服务于 Lemon8 种草研究、海外内容运营、话题趋势监测与跨境品牌投放场景，帮助用户高效采集 Lemon8 笔记数据、识别热门话题与种草达人，构建海外生活方式赛道的内容情报。

## 2. 详细功能

### 笔记内容

- 通过笔记 ID 直查笔记详情，含标题、正文、配图、视频、作者与互动数据
- 拉取笔记下的真实评论列表，作为种草反馈与用户口碑分析的一手样本
- 串联笔记 → 作者 → 同主题笔记，搭建从单条爆款到选题面的完整还原链路

### 用户档案

- 查询用户资料，覆盖头像、昵称、简介、粉丝量、互动量等基础画像维度
- 拉取用户的粉丝列表与关注列表，用于受众结构分析与达人圈层洞察
- 适配从笔记作者反查用户、从话题热门贴反查 KOC 的多种倒排链路

### Discover 发现

- 拉取 Discover 入口的 Banner 轮播位，捕捉平台官方主推的热门话题与活动
- 拉取 Discover Tab 列表，呈现平台运营分类下的推荐笔记与精选内容
- 拉取 Discover Information Tabs 信息分区，细颗粒度切入垂类内容入口

### 搜索与热搜

- 提供综合搜索能力，单次查询可同时返回笔记、用户与话题等多类目结果
- 拉取实时热搜词列表，识别平台当前正在升温的关键词与趋势
- 串联热搜词 → 搜索 → 笔记详情，复刻真实用户从发现到深度阅读的路径

### 话题深度追踪

- 拉取话题信息，含话题简介、参与人数、累计互动等顶层指标
- 按话题获取参与笔记列表，并支持按热门或最新排序拆解话题贡献结构
- 跟踪同一话题在不同时间窗内的内容增长，识别快速爆发的细分赛道

### 分享文本解析

- 单条解析分享文本中的用户身份，将站外分享口令一键还原为可查询的标识
- 单条解析分享文本中的笔记身份，把分享链接打通到笔记详情查询链路
- 提供批量解析接口，支持单次提交多条分享文本一次性回收解析结果，提升大批量任务效率

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
| 🚫 禁止臆造路径 | 仅使用 `references/endpoints_whitelist.yaml` 中的端点，**不得自行拼接、改 app/web 段、加路径段** |
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
| 查笔记 / 评论 / Discover / 搜索 / 话题 / 解析 item | `references/content.md` | 笔记详情、评论、Discover、热搜、话题、综合搜索、share_text 解析 item_id（11 端点） |
| 查用户 / 粉丝 / 关注 / 解析 user | `references/user.md` | 用户资料、粉丝、关注、share_text 解析 user_id（5 端点） |
| 跨端点参数查询 / 字段流追溯 | `references/param-mappings.md` | 全局红线 + 端点路由 + 字段流字典 + 错误处理总览 |
| 路径白名单硬校验 | `references/endpoints_whitelist.yaml` | 16 个端点的硬白名单 + Pre-call 4 步自检协议 |
| SKILL 版本检查与升级 | `references/update.md` | SkillHub / ClawHub / GitHub 三通道更新 |

**Step 3 — 构建最小调用计划**

- ✅ 优先使用最少端点完成任务，能用一个端点就不用两个
- ✅ 批量解析 share_text → 用 POST 批量端点（`get_user_ids` / `get_item_ids`）单次完成
- ❌ 禁止"先 head/tail 试运行"或"先调一个看看"等探索性调用

**Step 4 — 执行并验证**

- 调用前比对 `endpoints_whitelist.yaml` 完成 4 步 Pre-call 自检（路径 → method → 必填 → 写入确认）
- 收到 **404** → 必须先做防路径臆造自检（5 步）
- 收到 **400 / 422** → 必须先做防参数臆造自检（6 步），重点检查 `fetch_post_comment_list` 的三件套必传
- 收到 **业务 code != 0** → 读 `message_zh` 报告用户，**不重试**

### 高级使用

#### 链式调用图谱（Chain Recipes）

| 用户场景 | 链路 | 字段流 |
|---------|------|-------|
| 分享 URL → 笔记详情 → 评论 | `get_item_id` → `fetch_post_detail` → `fetch_post_comment_list` | `share_text` → `item_id` → `group_id+item_id+media_id` |
| 分享 URL → 用户主页 | `get_user_id` → `fetch_user_profile` | `share_text` → `user_id` |
| 用户 → 粉丝 / 关注 | `fetch_user_profile` → `fetch_user_follower_list` + `fetch_user_following_list` | `user_id` 复用 |
| 关键词 → 搜索 → 笔记详情 | `fetch_search` → `fetch_post_detail` | `query` → `item_id` |
| 热搜 → 搜索 → 详情 | `fetch_hot_search_keywords` → `fetch_search` → `fetch_post_detail` | 热词 → `query` → `item_id` |
| 话题 → 帖子列表 | `fetch_topic_info` → `fetch_topic_post_list` | `forum_id` → `hashtag_name` |
| 批量分享 URL → 批量 user_id | `get_user_ids`（POST share_texts[]） | 一次性返回 |
| 批量分享 URL → 批量 item_id | `get_item_ids`（POST share_texts[]） | 一次性返回 |

#### 防臆造自检清单（强制前置步骤）

**收到 404 时（A）**：
1. 路径白名单逐字符比对 → 不在清单中 STOP
2. Method 比对（注意 `get_user_ids` / `get_item_ids` 是 POST）→ 不等 STOP
3. 参数键名比对 → 有清单外参数 STOP
4. 资源 ID 来源溯源 → Agent 编造的 STOP
5. 全通过才判定"上游资源不存在"

**收到 400 / 422 时（B）**：
1. 参数名严格比对（`item_id` / `group_id` / `media_id` / `forum_id` / `hashtag_name` 不可混用）
2. 必填项齐全（`fetch_post_comment_list` 必须三件套；`fetch_topic_post_list` 必须 `category + category_parameter + hashtag_name`）
3. 类型与格式严格匹配（pattern / enum）
4. 传参方式正确（GET 用 query / POST 用 body）
5. 没有 IN 表外的臆造参数
6. 全通过才按 `message_zh` 排查

#### 端点替换矩阵

| 单条端点 | 批量端点 | 推荐使用条件 |
|---|---|---|
| `get_user_id`（GET） | `get_user_ids`（POST） | 待解析 share_text > 1 条时 |
| `get_item_id`（GET） | `get_item_ids`（POST） | 待解析 share_text > 1 条时 |

#### SKILL 版本更新

| 触发条件 | 推荐操作 |
|---------|---------|
| 合法路径持续 404 / 410 | `skillhub upgrade maxhub-lemon8`（国内）或 `clawhub upgrade maxhub-lemon8`（国际） |
| 用户问"版本是多少" | 当前版本 v3.7.2，访问 https://skillhub.cn/skills/maxhub-lemon8 |
| 多端点连续 410 | `skillhub upgrade maxhub-lemon8 --force` |
| 401 / 402 / 403 | **不是版本问题**，去 https://www.aconfig.cn 处理 |

### 常用命令速查表

| 场景 | 命令 |
|---|---|
| 查 API Key | `[ -n "${MAXHUB_API_KEY:-}" ] && echo "ok" \|\| echo "missing"` |
| 解析分享 URL → user_id | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/lemon8/app/get_user_id?share_text=..."` |
| 查笔记详情 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/lemon8/app/fetch_post_detail?item_id=xxx"` |
| 查用户资料 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/lemon8/app/fetch_user_profile?user_id=xxx"` |
| 综合搜索 | `curl -H "$maxhub_auth_header" "https://www.aconfig.cn/api/v1/lemon8/app/fetch_search?query=skincare"` |
| 检查 SKILL 更新 | `skillhub info maxhub-lemon8` 或 `clawhub info maxhub-lemon8` |

## 5. 使用场景

### 场景一：海外种草研究员监测美妆赛道

- **角色**：跨境美妆品牌内容研究员
- **需求**：监测 Lemon8 上美妆 / 护肤关键词的笔记结构与互动表现
- **使用方式**：`fetch_hot_search_keywords` 取热搜词 → `fetch_search` 拉笔记列表 → 链式调 `fetch_post_detail` + `fetch_post_comment_list` 提取笔记 + 真实评论
- **预期收益**：完整还原 Lemon8 用户对美妆话题的真实表达，反哺品牌内容创作

### 场景二：海外内容运营批量挖掘 KOC

- **角色**：跨境品牌运营
- **需求**：从 Lemon8 话题 + 综合搜索中识别中腰部 KOC 并构建联系名单
- **使用方式**：`fetch_topic_info` → `fetch_topic_post_list` 获取话题贴 → 批量取 `share_text` 通过 `get_user_ids` 解析 user_id → 链式调 `fetch_user_profile`
- **预期收益**：批量构建 KOC 名单，相比手动查找效率提升 8 倍以上

### 场景三：话题趋势分析师追踪 Lemon8 hashtag

- **角色**：海外内容趋势分析
- **需求**：跟踪某个 Lemon8 话题的内容增长 + 头部贴 + 互动趋势
- **使用方式**：`fetch_topic_info`（forum_id）→ `fetch_topic_post_list`（hashtag_name + sort_type=hot）→ 取 `item_id` 链式调 `fetch_post_detail`
- **预期收益**：话题层级的可量化趋势数据，识别快速增长的细分领域

### 场景四：跨境品牌竞调 Lemon8 内容生态

- **角色**：跨境市场分析
- **需求**：分析竞品在 Lemon8 上的笔记数、互动表现与目标受众分布
- **使用方式**：`fetch_search`（品牌名）→ 批量笔记取 `user_id` → `fetch_user_profile` + `fetch_user_follower_list` 拉受众画像
- **预期收益**：构建竞品在 Lemon8 上的完整内容生态画像，输入投放与产品决策

## 6. 项目架构

### 目录结构

```
maxhub-lemon8/
├── SKILL.md                            # Skill 定义与使用文档（本文件）
├── README.md                           # 英文项目说明
├── README_CN.md                        # 中文项目说明
├── _meta.json                          # 版本元信息（version: 3.7.2）
└── references/
    ├── endpoints_whitelist.yaml        # 16 端点路径硬白名单 + Pre-call 4 步自检协议
    ├── param-mappings.md               # 中枢索引（全局红线 + 字段流字典 + 错误处理）
    ├── content.md                      # 内容域：笔记/评论/Discover/搜索/话题/share_text 解析（11 端点）
    ├── user.md                         # 用户域：资料/粉丝/关注/share_text 解析（5 端点）
    └── update.md                       # SKILL 更新机制（SkillHub / ClawHub / GitHub）
```

### 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 调用方式 | `curl` + Bearer Token | HTTP GET / POST 请求，参数通过 query string 或 body 传递 |
| 数据接口 | MaxHub API | `https://www.aconfig.cn/api/v1/lemon8/app/*`，通过 `MAXHUB_API_KEY` 鉴权 |
| 路径校验 | YAML 硬白名单 | `endpoints_whitelist.yaml` 提供 16 端点的逐字符校验 + 4 步 Pre-call 协议 |
| 错误处理 | 决策表 + 自检清单 | HTTP 状态码权威定义 + 防臆造自检（A/B 双轨）+ 端点替换矩阵 |
| 输出格式 | JSON Standard MaxHub Response | `{code, message, message_zh, data, cache_url}` |
| 更新通道 | SkillHub / ClawHub / GitHub | 国内 ⭐⭐⭐ SkillHub（腾讯云 CDN）/ 国际 ⭐⭐⭐ ClawHub / 降级 GitHub |

### API 覆盖范围

| 领域 | 端点数 | Reference 文件 |
|------|--------|---------------|
| 内容（Content） | 11 | `content.md` |
| 用户（User） | 5 | `user.md` |
| **合计** | **16** | — |

### 关键设计理念

- **防臆造四道闸**：白名单（endpoints_whitelist.yaml）→ 强标记（Full path）→ 禁止规则（Forbidden）→ 错误反馈（STOP）
- **链式调用图谱**：字段流字典（`user_id` / `item_id` / `group_id` / `media_id` / `forum_id` / `hashtag_name`）+ Chain Recipes + 跨 reference 链路三层联动
- **错误处理契约**：HTTP 状态码权威定义 + 防臆造自检清单（A: 5 步 / B: 6 步）+ 单条 / 批量端点替换矩阵
