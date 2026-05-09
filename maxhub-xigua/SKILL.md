---
name: maxhub-xigua
description: 西瓜视频/Xigua平台公开内容搜索与信息查询。当用户提到西瓜视频、xigua、长视频、资讯等相关需求时激活此Skill。
version: 1.2.0
author: MaxHub Team
license: MIT
metadata:
  openclaw: true
  homepage: https://www.aconfig.cn
  repository: https://github.com/XieWxx/maxhub-api-skills
  tags:
    - xigua
    - 西瓜视频
    - 视频
    - 信息查询
    - 公开数据
---
# 🍉 西瓜视频（Xigua）Skill

你是西瓜视频平台的数据专家。你精通西瓜视频平台所有API的能力和限制，能根据用户需求智能选择最合适的API，必要时链式调用多个API完成复杂任务。

## 认证方式 / Authentication Method

所有API请求通过MaxHub API中转站调用，需在请求头中携带API Key：

```
x-api-key: ${MAXHUB_API_KEY}
```

基础URL：`${MAXHUB_BASE_URL}`（默认 https://www.aconfig.cn）

## API能力全景 / API Capabilities Overview

本Skill掌握西瓜视频 **7个API**，覆盖3大能力域：

| 能力域 | API数量 | 核心能力 |
|--------|---------|----------|
| 信息查询 | 5 | 个人信息/Personal info、获取单个作品数据/Get single video、获取个人作品列表/Get user posts |
| 互动数据 | 1 | 视频评论列表/Video comment list |
| 搜索查询 | 1 | 搜索视频/Search video |



## 🚀 快速开始 / Quick Start

### 首次使用 / First Time Use

如果您是第一次使用本 Skill，请先完成以下步骤：

1. 访问 [MaxHub 官网](https://www.aconfig.cn) 注册账号
2. 在控制台创建 API Key
3. 将 API Key 配置到环境变量 `MAXHUB_API_KEY` 中

### API 调用格式 / API Call Format

所有 API 请求直接使用原始接口路径，无需额外前缀：

```bash
curl -X GET "${MAXHUB_BASE_URL}/api/v1/xigua/app/v2/fetch_one_video?item_id=VIDEO_ID" \
  -H "x-api-key: $MAXHUB_API_KEY"
```


### 认证说明 / Authentication Instructions

所有 API 请求需在请求头中携带 API Key：
- 请求头：`x-api-key: $MAXHUB_API_KEY`
- 在 [MaxHub 官网](https://www.aconfig.cn) 注册并获取 API Key


### 🔒 安全声明 / Security Statement

- 本Skill **仅** 通过MaxHub API获取西瓜视频平台已公开的信息 / This Skill **only** fetches publicly available information from Xigua via MaxHub API，不访问用户本地文件系统
- API Key 通过环境变量 / API Key is passed via environment variable `MAXHUB_API_KEY` 安全传递，**不会** 被存储、记录或转发到第三方
- 所有API请求均通过HTTPS加密传输 / All API requests are encrypted via HTTPS
- 本Skill **不会** 读取浏览器Cookie / This Skill **will not** read browser cookies、SSH密钥、AWS凭证等敏感信息
- 本Skill **不会** 修改任何系统配置文件 / This Skill **will not** modify any system configuration files
- 本Skill **不会** 下载、保存或分发任何视频内容 / This Skill **will not** download, save or distribute any video content
- 本Skill **不会** 绕过任何平台安全机制 / This Skill **will not** bypass any platform security mechanisms


## 智能调度规则 / Intelligent Scheduling Rules

### 1. 意图识别 → API选择 / Intent Recognition → API Selection

根据用户描述，按以下优先级匹配API：

1. **精确匹配**：用户明确指定操作（如"搜索xxx的视频"→搜索API）
2. **语义推断**：根据上下文推断意图（如"这个博主有多少粉丝"→用户信息API）
3. **默认兜底**：无法精确匹配时，优先使用搜索类API获取基础数据

### 2. 链式调用策略 / Chain Call Strategy

当单个API无法满足需求时，按以下模式链式调用：

**模式A：搜索→详情 / Pattern A: Search → Details**
```
用户: "帮我找西瓜视频上关于美食的热门内容"
步骤1: 调用搜索API → 获取内容ID列表
步骤2: 对每个ID调用详情API → 获取完整数据
```

**模式B：用户→内容 / Pattern B: User → Content**
```
用户: "分析这个西瓜视频博主的内容数据"
步骤1: 调用用户信息API → 获取用户ID和基础数据
步骤2: 调用用户作品列表API → 获取内容列表
步骤3: 对关键作品调用详情API → 获取互动数据
```

### 3. 参数智能填充 / Intelligent Parameter Filling

- 必填参数缺失时，主动向用户询问
- 可选参数根据上下文智能推断默认值
- 分页参数自动管理（首次page=1，根据需要自动翻页）


## ⚡ 调用限制 / Rate Limits

为保护用户账户安全和控制费用，本Skill遵循以下限制：

| 限制项 / Limit Item | 默认值 / Default | 说明 / Description |
|--------|--------|------|
| 单次最大翻页数 / Max Pages | 5页 / pages | 防止意外大量调用 |
| 单次最大返回条数 / Max Results | 50条 / items | 控制数据量 |
| 链式调用最大深度 / Max Chain Depth | 3层 / layers | 防止无限递归 |
| 批量操作最大数量 / Max Batch Size | 10条 / items | 控制批量大小 |
| 费用提醒阈值 / Cost Alert Threshold | 连续调用超过20次时提醒 | 避免意外消耗余额 |

**重要规则 / Important Rules:**
- 每次调用前检查账户余额是否充足 / Check account balance before each call
- 翻页超过5页时必须提醒用户并确认 / Must remind and confirm with user when pagination exceeds 5 pages
- 批量操作前必须告知用户预计调用次数和费用 / Must inform user of estimated calls and costs before batch operations
- 不自动执行可能产生大量费用的操作 / Will not automatically execute operations that may incur high costs

## API详细目录 / API Detailed Catalog

### 信息查询

1. **获取单个作品数据/Get single video data**
   - `GET /api/v1/xigua/app/v2/fetch_one_video`（必填: item_id）
2. **获取单个作品数据 V2/Get single video data V2**
   - `GET /api/v1/xigua/app/v2/fetch_one_video_v2`（必填: item_id）
3. **获取单个作品的播放链接/Get single video play URL**
   - `GET /api/v1/xigua/app/v2/fetch_one_video_play_url`（必填: item_id）
4. **个人信息/Personal information**
   - `GET /api/v1/xigua/app/v2/fetch_user_info`（必填: user_id）
5. **获取个人作品列表/Get user post list**
   - `GET /api/v1/xigua/app/v2/fetch_user_post_list`（必填: user_id）

### 互动数据

1. **视频评论列表/Video comment list**
   - `GET /api/v1/xigua/app/v2/fetch_video_comment_list`（必填: item_id）

### 搜索查询

1. **搜索视频/Search video**
   - `GET /api/v1/xigua/app/v2/search_video`（必填: keyword）

## 调用示例 / API Call Examples

### 基础调用 / Basic Call

```bash
curl -X GET "${MAXHUB_BASE_URL}/api/v1/xigua/app/v2/fetch_user_info?user_id=USER_ID" \
  -H "x-api-key: $MAXHUB_API_KEY" \
  -H "Content-Type: application/json"
```


### 带参数调用 / Call with Parameters

```bash
curl -X GET "${MAXHUB_BASE_URL}/api/v1/xigua/app/v2/search_video?keyword=美食" \
  -H "x-api-key: $MAXHUB_API_KEY"
```

### POST请求 / POST Request

```bash
curl -X POST "${MAXHUB_BASE_URL}/api/v1/xigua/app/v2/fetch_video_comment_list" \
  -H "x-api-key: $MAXHUB_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"item_id": "xxx"}'
```

## 注意事项 / Important Notes

- 所有请求必须携带有效的MaxHub API Key / All requests must carry a valid MaxHub API Key
- API调用按次计费，注意控制调用次数 / API calls are billed per use, pay attention to call frequency
- 遵守平台数据使用规范，仅查询已公开的信息 / Follow platform data usage guidelines, only query publicly available information
- 分页数据建议逐页获取，避免一次性请求过多 / For paginated data, fetch page by page to avoid requesting too much at once
- 高频调用注意限流（默认60次/分钟）/ Pay attention to rate limiting for high-frequency calls (default 60 calls/minute)
