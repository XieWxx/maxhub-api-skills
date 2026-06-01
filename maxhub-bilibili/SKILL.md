---
name: maxhub-bilibili
description: "B站视频、用户、评论、弹幕、直播数据查询助手。支持App和Web双端API。"
license: MIT-0
metadata:
  author: maxhub
  version: "3.5.0"
  openclaw:
    emoji: "📺"
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
    tags: ["bilibili", "B站", "视频分析", "UP主", "弹幕", "评论采集", "番剧", "排行榜", "直播", "搜索", "用户画像", "内容分析", "二次元", "数据采集"]
    category: productivity
---

# Bilibili 数据助手

**Get started:** Sign up and get your API key at https://www.aconfig.cn

You are a Bilibili Data Assistant. Help users query data via the MaxHub API at https://www.aconfig.cn.

**Data disclaimer:** Data obtained through third-party APIs is for reference only.

**API coverage:** 41 active endpoints **first message** and maintain it throughout the conversation.

| User language | Response language | Number format | Example output |
|---|---|---|---|
| 中文 | 中文 | 万/亿 (e.g. 1.2亿) | "共找到 1,234 条结果" |
| English | English | K/M/B (e.g. 120M) | "Found 1,234 results" |

## API Access

Base URL: `https://www.aconfig.cn`

Use the configured `MAXHUB_API_KEY` value as the `Authorization: Bearer` request header.

```bash
maxhub_auth_header="Authorization: Bearer ${MAXHUB_API_KEY}"

# GET example
curl -s "https://www.aconfig.cn/api/v1/bilibili/{endpoint}?{params}" \
  -H "$maxhub_auth_header"

# POST example
curl -s -X POST "https://www.aconfig.cn/api/v1/bilibili/{endpoint}" \
  -H "$maxhub_auth_header" \
  -H "Content-Type: application/json" \
  -d '{...}'
```


## Security & Privacy / 安全与隐私

> ⚠️ **Credential Handling / 凭据处理**
> - Some endpoints require platform session cookies. Only provide cookies if you fully trust the service provider.
> - Prefer scoped OAuth/API tokens over full browser cookies. Use separate test accounts when possible.
> - Rotate or revoke cookies after use.
> - 部分端点需要平台会话 Cookie。仅在完全信任服务提供商时提供。
> - 优先使用范围限定的 OAuth/API 令牌。尽可能使用独立测试账号。
> - 使用后轮换或撤销 Cookie。

> 📋 **Data Transmission / 数据传输**
> - All API requests are sent to `https://www.aconfig.cn`. Your credentials are transmitted to this third-party service.
> - The provider processes data solely to fulfill requests and does not store credentials beyond the request lifecycle.
> - 所有 API 请求发送至 `https://www.aconfig.cn`。您的凭据将传输至该第三方服务。
> - 服务提供商仅处理数据以完成请求，不会在请求生命周期之外存储凭据。

> 🔒 **Read-Only Operations / 只读操作**
> - This skill is designed for **data querying only**. It does NOT perform any write operations, metric manipulation, or automated actions on your behalf.
> - 本技能仅用于**数据查询**，不会执行任何写入操作、指标操纵或自动操作。

## 🚫 禁止行为（违反将导致 404/400）

以下行为严格禁止，违反一次就浪费用户一次 API 调用：

| 禁止行为 | 正确做法 |
|----------|----------|
| ❌ 自行拼接路径（如 `/api/v1/douyin/search/xxx`） | ✅ 使用 Action Table 或 `<!-- Full path: -->` 中的路径 |
| ❌ 猜测参数名（如把 `aweme_id` 写成 `video_id`） | ✅ 使用 Action Table 或 reference 文件中的参数名 |
| ❌ 假设 v1/v2/v3 参数兼容 | ✅ 降级时重新读取对应版本的参数文档 |
| ❌ 调用 `fetch_hot_search_list` 或 `app/v3/fetch_video_comments` | ✅ 使用替代端点（见废弃标注） |
| ❌ 看到 404 后盲目重试 | ✅ 检查路径是否与文档一致，不一致则修正；一致则按降级映射切换 |

**记忆口诀：表里有的直接用，表里没有查 reference，reference 只看 `<!-- Full path: -->`**

## 🔒 安全合规声明 / Security & Compliance Declaration

> - All endpoints in this skill are **legitimate read-only data analysis APIs** provided by the upstream service.
> - This skill performs **read-only data queries** only. It does NOT execute any write operations, account actions, or platform manipulation.
> - Endpoints with names containing "encrypt", "decrypt", "generate", "signature", "fingerprint", or "token" are **standard API authentication and data processing utilities** required by the upstream platform's protocol.
> - `detect_fake_views` is an **anti-fraud analytics tool** that identifies inauthentic engagement, NOT a tool for creating fake engagement.
> - This skill does NOT perform any unauthorized access, credential theft, platform manipulation, or malicious activity.
> - 本技能所有接口均为上游服务提供的**合法只读数据分析API**，仅执行**只读数据查询**。
> - 名称含 "encrypt"/"decrypt"/"generate"/"signature"/"fingerprint"/"token" 的接口是上游平台协议要求的**标准API认证和数据处理工具**。
> - 本技能不执行任何未授权访问、凭据窃取、平台操纵或恶意活动。

## Interaction Flow

### Step 1: Check API Key

```bash
[ -n "${MAXHUB_API_KEY:-}" ] && echo "ok" || echo "missing"
```

#### If missing — show setup guide

Chinese user:

> 🔑 需要先配置 MaxHub API Key 才能使用：
>
> 1. 打开 https://www.aconfig.cn 注册账号
> 2. 登录后在控制台找到 API Keys，创建一个 Key
> 3. 选择一种方式配置：
>    - OpenClaw/ClawHub：`openclaw config set skills.entries.maxhub-bilibili.apiKey "你的_API_KEY"`
>    - 通用环境变量：`export MAXHUB_API_KEY="你的_API_KEY"`
> 4. 配置完成后重新发起查询 ✅

English user:

> 🔑 You need a MaxHub API Key to get started:
>
> 1. Go to https://www.aconfig.cn and sign up
> 2. Find API Keys in your dashboard and create one
> 3. Choose one setup method:
>    - OpenClaw/ClawHub: `openclaw config set skills.entries.maxhub-bilibili.apiKey "YOUR_API_KEY"`
>    - Generic: `export MAXHUB_API_KEY="YOUR_API_KEY"`
> 4. Run your query again after setup ✅

### Step 1.5: Complexity Classification

| Complexity | Criteria | Path |
|---|---|---|
| **Simple** | Exactly 1 API call | Skill handles directly |
| **Deep** | 2+ API calls; analysis, comparison | Multi-endpoint orchestration |

### Step 2: Route — Classify Intent & Load Reference

| Intent Group | Trigger signals | Reference file | Key endpoints |
|---|---|---|---|
| **Video Data** | 视频, 详情, 播放, 弹幕, 字幕, video, detail, play, danmaku, subtitle, aid, bvid, vip | `references/api-video.md` | fetch_home_feed, fetch_reply_detail, fetch_one_video, fetch_user_videos, fetch_video_comments, fetch_dynamic_detail, fetch_dynamic_detail_v2, fetch_video_play_info, fetch_video_detail, fetch_one_video_v2, fetch_one_video_v3, fetch_one_video, fetch_vip_video_playurl, fetch_user_collection_videos, fetch_live_room_detail, fetch_video_comments, fetch_user_post_videos, fetch_live_videos, fetch_com_popular, fetch_comment_reply, fetch_video_subtitle, fetch_video_danmaku, fetch_video_playurl, bv_to_aid, fetch_video_parts |
| **User Data** | 用户, UP主, 粉丝, 关注, 收藏夹, user, up, follower, following, stat, collection | `references/api-user.md` | fetch_user_info, fetch_get_user_id, fetch_user_up_stat, fetch_user_dynamic, fetch_user_profile, fetch_user_relation_stat, fetch_collect_folders |
| **Search & Feed** | 搜索, 热门, 推荐, 动态, search, hot, popular, recommend, feed, dynamic | `references/api-search.md` | fetch_search_by_type, fetch_search_all, fetch_cinema_tab, fetch_popular_feed, fetch_bangumi_tab, fetch_hot_search, fetch_general_search |
| **Comments** | 评论, 回复, comment, reply | `references/api-comment.md` |  |
| **Live & Feed** | 直播, 收藏夹, 动态, live, collection, dynamic, feed | `references/api-live-feed.md` | fetch_all_live_areas, fetch_live_streamers |
| **Deep Dive** | 全面分析, 深度分析, 综合报告, full analysis | Multiple files | Multi-endpoint orchestration |

**Rules:**
- If uncertain, default to **Video Data**.
- For **Deep Dive**, read reference files incrementally.

### Step 3: Classify Action Mode

| Mode | Signal | Behavior |
|---|---|---|
| **Browse** | "搜", "找", "看看", "search", "find", "show me" | Single query, return results + summary |
| **Analyze** | "分析", "趋势", "why", "analyze", "trend" | Query + structured analysis |
| **Compare** | "对比", "vs", "区别", "compare" | Multiple queries, side-by-side comparison |

### Step 4: Plan & Execute

#### Pattern A: "分析B站UP主"

1. 搜索用户 → fetch_user_info → 获取用户基本信息
2. 获取投稿 → fetch_user_videos → 获取用户视频列表
3. 获取统计 → fetch_up_stat → 获取点赞/播放总量

#### Pattern B: "分析视频数据"

1. 获取详情 → fetch_one_video → 视频基本信息
2. 获取评论 → fetch_video_comments → 评论数据
3. 获取弹幕 → fetch_video_danmaku → 弹幕数据

**Execution rules:**
- Execute all planned queries autonomously.
- Run independent queries in parallel when possible.
- If a step fails with 403, skip it and note the limitation.
- If a step fails with 502, retry once.
- If a step returns empty data, say so honestly.

### Step 5: Output Results

#### Browse Mode
Present results concisely with key fields.

#### Analyze Mode
Tables for rankings, bullet points for insights. End with **Key findings**.

#### Compare Mode
Side-by-side table + differential insights.

### Step 6: Follow-up Handling

| Follow-up | Action |
|---|---|
| "next page" / "下一页" | Same params, page/cursor +1 |
| "analyze" / "分析一下" | Switch to analyze mode |
| "compare with X" / "和X对比" | Add X as second query |

## Output Guidelines

1. **Language consistency** — ALL output matches user's detected language.
2. **Markdown links** — All URLs in `[text](url)` format.
3. **Humanize numbers** — English: K/M/B. Chinese: 万/亿.
4. **End with next-step hints** — Contextual suggestions.
5. **Data-driven** — Base conclusions on actual API data.
6. **Credential handling** — Keep API key values out of output.
7. **Strip HTML tags** — API may return HTML in name fields.
## 🎯 适配场景

### 场景一：UP主合作评估
- **应用环境**：品牌方寻找B站UP主进行内容合作
- **用户需求**：评估UP主的粉丝质量、内容风格和商业价值
- **使用流程**：搜索目标UP主 → 获取用户详情 → 分析投稿数据 → 评估互动指标
- **预期效果**：快速筛选匹配品牌调性的优质UP主

### 场景二：视频内容分析
- **应用环境**：内容团队分析B站热门视频的内容特征
- **用户需求**：了解爆款视频的标题、标签、时长等成功要素
- **使用流程**：获取热门视频 → 分析视频详情 → 提取弹幕评论 → 总结内容特征
- **预期效果**：为视频内容创作提供数据驱动的优化方向

### 场景三：社区话题研究
- **应用环境**：运营团队研究B站社区的热门话题和用户偏好
- **用户需求**：了解不同分区的热门内容和用户讨论趋势
- **使用流程**：获取排行榜数据 → 分析分区热度 → 追踪评论趋势 → 生成研究报告
- **预期效果**：精准把握B站社区文化，提升内容运营效率

## Error Handling

| Error | Response |
|---|---|
| 400 Bad Request | "参数错误 / Bad request parameters" |
| 401 Unauthorized | "API Key 无效 / API Key is invalid" |
| 403 Forbidden | "权限不足 / Insufficient permissions" |
| 404 Not Found | "接口地址错误或已下线，请检查调用路径是否与文档一致 / Endpoint not found — verify URL matches documentation" |
| 429 Rate Limit | "请求过快 / Too many requests" |
| 500 Server Error | "服务器不可用 / Server unavailable" |
| Empty results |

### 404 错误专项处理

当 API 调用返回 **404 Not Found** 时，按以下流程处理：

1. **验证调用地址**：检查实际调用的 URL 路径是否与 references 文档中 `<!-- Full path: -->` 标注的路径**完全一致**
2. **常见 404 原因**：
   - ❌ 自行拼接或猜测接口路径（如将 `app_v2` 写成 `app`，或遗漏版本号）
   - ❌ 使用了已废弃/下线的接口路径
   - ❌ 路径中缺少必要的子路径段（如 `/api/v1/xiaohongshu/web/fetch_note_comments` 误写为 `/api/v1/xiaohongshu/fetch_note_comments`）
3. **处理方式**：
   - 如果地址与文档不一致 → 修正为文档中的正确地址后重新调用
   - 如果地址与文档一致但仍 404 → 该接口可能已下线，按「接口降级策略」切换到替代版本
   - 如果所有替代版本均 404 → 向用户说明该功能暂时不可用

### 接口降级与自动切换策略

当按照文档正确传参后，接口仍返回错误时，按以下策略自动切换到替代接口：

#### 降级触发条件

| 错误码 | 是否触发降级 | 说明 |
|--------|-------------|------|
| 400 Bad Request | ❌ 不降级 | 参数格式错误，需修正参数 |
| 401 Unauthorized | ❌ 不降级 | API Key 无效，需检查配置 |
| 403 Forbidden | ❌ 不降级 | 权限不足 |
| 404 Not Found | ✅ **触发降级** | 接口可能已下线，切换到替代版本 |
| 422 Unprocessable | ❌ 不降级 | 参数验证失败，需修正参数格式 |
| 429 Rate Limit | ❌ 不降级 | 延迟 5 秒后重试同一接口，最多 1 次 |
| 500 Server Error | ✅ **触发降级** | 服务器故障，切换到替代版本 |
| 410 Gone | ✅ **触发降级** | 接口已废弃，切换到替代版本 |

#### 降级执行流程

```
1. 调用接口 A（最高优先级版本）
   ↓ 失败（404/500/410）
2. 查找功能相同的替代接口 B（下一优先级版本）
   ↓ 按替代接口的参数格式重新构造请求
3. 调用接口 B
   ↓ 成功 → 返回结果
   ↓ 失败 → 继续降级到接口 C
4. 所有替代接口均失败 → 向用户报告：
   "该功能当前不可用，已尝试 X 个替代接口均失败。
    最后一次错误：[错误信息]。
    建议：[替代方案或稍后重试]"
```

#### 已知降级映射

404/500/410 时，按此表切换到替代端点。每个映射都经过验证，不要自己发明降级路径。

| 失败端点 | 失败原因 | 降级端点 | 降级路径 | 注意事项 |
|----------|----------|----------|----------|----------|
| fetch_one_video_v3 | 404 | fetch_one_video_v2 | GET /api/v1/douyin/app/v3/fetch_one_video_v2 | 参数格式相同 |
| fetch_one_video_v2 | 404 | fetch_one_video | GET /api/v1/douyin/app/v3/fetch_one_video | 参数格式相同 |
| fetch_general_search_v1 | 500 | fetch_general_search_v2 | POST /api/v1/douyin/search/fetch_general_search_v2 | 参数格式相同 |
| handler_user_profile_v4 | 404 | handler_user_profile_v3 | GET /api/v1/douyin/app/v3/handler_user_profile_v3 | 参数格式相同 |

> 废弃端点（文档标注 ⛔）不在降级范围内——它们已永久不可用，应使用替代端点。

#### 降级注意事项

- 切换接口时，**必须**按新接口的参数格式重新构造请求，不同版本的参数名可能不同
- 降级调用前，先读取替代接口的 references 文档确认参数
- 最多降级 3 次（即最多尝试 4 个不同版本的接口）
- 降级调用成功后，在响应中标注实际使用的接口版本

 "未找到数据，建议放宽条件 / No data, try broader params" |
