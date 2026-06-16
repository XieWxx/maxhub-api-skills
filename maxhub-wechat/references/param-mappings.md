# Param & Field Mapping Index / 参数与字段映射索引

Skill: `maxhub-wechat` · Base URL: `https://www.aconfig.cn` · Version: `3.7.2`

> 本文件不重复端点完整说明（详见各 reference 文件），仅承担六个职能：
> 1. **全局红线 + 不支持能力清单**：防臆造的最强约束
> 2. **端点路由索引**：按 ID 快速定位 reference 文件
> 3. **字段流字典**：跨端点链式调用的字段索引
> 4. **错误处理总览 + 端点替换矩阵**：全 skill 共享的错误策略
> 5. **路径合法性硬校验**：以 `endpoints_whitelist.yaml` 为唯一可信源
> 6. **SKILL 更新机制**：版本检查 + ClawHub / SkillHub 更新，详见 [`update.md`](./update.md)

---

## 0. 全局红线 (Global Forbidden) — 强制约束

> 以下规则**最高优先级**，任何端点级 ERR 表都不得突破。

1. **路径禁止臆造**：所有路径必须逐字符匹配 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml)；不在清单中 → **STOP**，禁止"换一个版本试试"、"改一改路径段试试"、"把 v1 改成 v2 试探"。
2. **404 / 400 必须先做防臆造自检**：见 [§ 3.1](#-31-防臆造自检清单404--400-处理前置步骤)，绕过自检直接重试或改路径都属于违反防臆造红线。
3. **所有端点均为 POST**：本 skill 全部 22 个端点均为 POST 方法，参数放 request body（JSON），**禁止**放 query string。
4. **所有端点 risk=high**：微信公众号/视频号/搜一搜接口均涉及付费调用，每次调用均消耗配额；**调用前应确认参数正确**，避免无效扣费。
5. **找不到能力必须 STOP 并告知用户**：用户请求微信平台不支持的能力（见下方"不支持能力清单"）→ 直接告知该 skill 不支持，**禁止**用其他端点拼凑伪造结果。
6. **替换/降级前必须显式告知用户**：例如"由于 X 失败，已切换到 Y，数据完整度可能下降"；禁止静默降级。
7. **404 / 410 强制 STOP**：禁止 Agent 自行修改路径段后重试。**自检通过 + 持续 404** 时才建议用户更新 SKILL（详见 [`update.md`](./update.md)）。
8. **业务 `code != 0` 不重试**：业务错误（配额、合规、权限）不会因重试改变，必须读 `message_zh` 报告用户。
9. **仅 404 / 410 + 自检通过**才建议用户更新 SKILL：401 / 402 / 403 / 网络错**不是** SKILL 版本问题，禁止误导用户更新。
10. **超时设置**：所有端点因微信服务器原因响应较慢，客户端 timeout 必须 ≥ 30 秒；设置过小会造成已扣费但收不到响应。

---

## 0.1 本 skill 不支持的能力 (Out of Scope)

> 用户请求以下功能时，**直接告知不支持并 STOP**。**禁止**用现有 22 个端点"拼凑"或"模拟"以下能力：

| 不支持的能力 | 说明 |
|------------|------|
| 发布公众号文章 / 视频号视频 | 无写入端点 |
| 删除 / 编辑公众号文章或视频号作品 | 无删除/编辑端点 |
| 发送 / 回复评论 | 仅支持读评论，无写入端点 |
| 点赞 / 在看 / 收藏 / 转发操作 | 无社交互动写入端点 |
| 关注 / 取消关注公众号或视频号 | 无关注端点 |
| 修改公众号 / 视频号资料 | 无修改端点 |
| 充值 / 计费查询 / 配额查询 | 在 https://www.aconfig.cn 控制台查询 |
| OAuth 用户授权操作 | 本 skill 仅支持 API Key 模式 |
| 实时直播推流 / WebSocket 流 | 无实时流端点 |
| 视频号视频上传 / 剪辑 | 仅支持读取和下载，不支持上传 |
| 微信支付 / 交易操作 | 无支付端点 |
| 小程序相关操作 | 本 skill 不覆盖小程序 |

> 遇到上述请求 → 直接回复用户："本 skill 暂不支持此能力，建议在微信客户端中操作"，**禁止**用 fetch_article_detail / fetch_search 等端点伪造结果。

---

## 0.2 原子化 + 编排入口 (Atomic & Orchestration)

> Agent 可通过两层入口快速定位端点与链路：
> - **原子层**：[`atoms/_index.md`](./atoms/_index.md) — 每个端点封装为原子（atom_id ↔ endpoint_id 映射 + 幂等性 + 链路角色）
> - **编排层**：[`recipes/_index.md`](./recipes/_index.md) — 每个用户目标封装为 Recipe（trigger_keywords + 多步链路 + 容错）
> - **推荐流程**：用户语义 → `recipes/_index.md` 匹配 Recipe → 按 Recipe 的 Atomic Steps 调用 `atoms/_index.md` 中的原子

---

## 1. 端点路由索引 (Endpoint Routing Index)

### 微信公众号 (mp.md)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| fetch_article_detail | 用文章 URL 取文章详情（正文/标题/作者/封面/发布时间） | mp.md | POST | high |
| fetch_article_stats | 用文章 URL 取互动数据（阅读/点赞/在看/分享/收藏/评论数） | mp.md | POST | high |
| fetch_article_comments | 用文章 URL 取一级评论（含翻页） | mp.md | POST | high |
| fetch_comment_replies | 用 content_id 取二级回复 | mp.md | POST | high |
| fetch_related_articles | 用文章 URL 取关联文章 | mp.md | POST | high |
| fetch_article_ad | 用文章 URL 取内嵌广告信息 | mp.md | POST | high |
| fetch_account_profile | 用 gh_username 取公众号资料页 | mp.md | POST | high |
| fetch_account_articles | 用 gh_username 取公众号历史文章列表（含翻页） | mp.md | POST | high |
| fetch_account_services | 用 gh_username 取公众号自定义菜单/服务入口 | mp.md | POST | high |

### 微信视频号 (channels.md)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| fetch_channel_info | 用 username 取视频号账号信息（认证/IP归属） | channels.md | POST | high |
| fetch_channel_id_to_username | 用 sph 短号转 finder username | channels.md | POST | high |
| fetch_user_videos | 用 username 取视频号用户作品列表（含翻页） | channels.md | POST | high |
| fetch_video_detail | 用 object_id/export_id/share_url 取视频详情（含媒体下载） | channels.md | POST | high |
| fetch_video_comments | 用 object_id 取视频评论（含翻页） | channels.md | POST | high |
| fetch_video_share_url | 用 object_id 生成分享短链 | channels.md | POST | high |
| fetch_user_profile | 用 username 取视频号主页资料+统计 | channels.md | POST | high |
| fetch_user_collections | 用 username 取视频号合集列表 | channels.md | POST | high |
| fetch_collection_videos | 用 topic_id 取合集内视频（含翻页） | channels.md | POST | high |
| fetch_live_history | 用 username 取直播回放列表（含翻页） | channels.md | POST | high |
| fetch_live_detail | 用 live_id 取直播间详情 | channels.md | POST | high |
| fetch_search_channel_videos | 用 username+keyword 号内搜索视频 | channels.md | POST | high |

### 微信搜一搜 (search.md)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| fetch_search | 用关键词综合搜索（公众号/文章/视频/直播等垂类） | search.md | POST | high |

---

## 2. 字段流字典 (Field Flow Dictionary)

> 当用户需要的数据需要"先 A 再 B"才能取到时，查此表确认字段如何在端点间传递，避免 Agent 臆造字段名或路径。

### `url` — 公众号文章链接（`https://mp.weixin.qq.com/s/...` 或带 `__biz` 长链）
- **可作为输入（IN）**：
  - `fetch_article_detail`
  - `fetch_article_stats`
  - `fetch_article_comments`
  - `fetch_comment_replies`
  - `fetch_related_articles`
  - `fetch_article_ad`

### `content_id` — 公众号一级评论 ID（纯数字）
- **产出**：`fetch_article_comments` → `$.data.comments[N].content_id`
- **输入**：`fetch_comment_replies`

### `username` (gh_username) — 公众号用户名（`gh_...` 格式）
- **可从这些端点产出（OUT）**：
  - `fetch_article_detail` → `$.data.content.user_name`
  - `fetch_search` (business_type=account) → `$.data.items[N].jumpInfo.userName`
- **可作为输入（IN）**：
  - `fetch_account_profile`
  - `fetch_account_articles`
  - `fetch_account_services`

### `username` (finder_username) — 视频号 finder username（`v2_...@finder` 格式）
- **可从这些端点产出（OUT）**：
  - `fetch_video_detail` → `$.data.username`
  - `fetch_user_videos` → `$.data.videos[N].username`
  - `fetch_channel_id_to_username` → `$.data.username`
  - `fetch_search` (business_type=video) → `$.data.items[N].jumpInfo.userName`（部分）
- **可作为输入（IN）**：
  - `fetch_channel_info`
  - `fetch_user_videos`
  - `fetch_user_profile`
  - `fetch_user_collections`
  - `fetch_live_history`
  - `fetch_search_channel_videos`

### `channel_id` — 视频号 ID（`sph...` 短号）
- **可从这些端点产出（OUT）**：
  - `fetch_channel_info` (raw=false) → `$.data.channel_id`
- **输入**：`fetch_channel_id_to_username`

### `object_id` — 视频号作品 objectId（纯数字）
- **可从这些端点产出（OUT）**：
  - `fetch_user_videos` → `$.data.videos[N].id`
  - `fetch_video_detail` → `$.data.id`
  - `fetch_collection_videos` → `$.data.videos[N].id`
  - `fetch_live_history` → `$.data.lives[N].id`
- **可作为输入（IN）**：
  - `fetch_video_detail`
  - `fetch_video_comments`
  - `fetch_video_share_url`

### `export_id` — 搜索结果中的视频 exportId（`export/...` 格式，会过期）
- **产出**：`fetch_search` (business_type=video/all) → `$.data.items[N].exportId`
- **输入**：`fetch_video_detail`

### `comment_id` — 视频号一级评论 ID（纯数字）
- **产出**：`fetch_video_comments` → `$.data.comments[N].comment_id`
- **输入**：`fetch_video_comments`（展开二级回复时传）

### `topic_id` — 视频号合集 ID（纯数字）
- **产出**：`fetch_user_collections` → `$.data.collections[N].topic_id`
- **输入**：`fetch_collection_videos`

### `live_id` — 直播间 ID（纯数字）
- **产出**：`fetch_live_history` → 回放条目中的 live_id
- **输入**：`fetch_live_detail`

### `last_buffer` — 翻页游标（base64，视频号系列端点）
- **产出/输入**：`fetch_user_videos` / `fetch_video_comments` / `fetch_collection_videos` / `fetch_live_history`（同端点的下一次调用使用上次响应的 `$.data.last_buffer`）

### `buffer` — 翻页游标（公众号评论）
- **产出/输入**：`fetch_article_comments`（同端点的下一次调用使用上次响应的 `$.data.buffer`）

### `offset` — 翻页游标（搜一搜 / 公众号文章列表 / 评论回复）
- **产出/输入**：`fetch_search` / `fetch_account_articles` / `fetch_comment_replies`

---

## 3. 全 skill 错误处理总览 (Error Handling Overview)

### HTTP 状态码权威定义（MaxHub API 官方）

> 以下为 MaxHub API 平台官方 HTTP 状态码定义。**Agent 必须**按此表语义判定错误类型，不要自行解读。

| HTTP 状态码 | 官方含义 | 细分场景 |
|------------|---------|---------|
| **400 Bad Request** | 请求格式错误或参数不正确 | 参数缺失 / 类型错 / 格式不符 / 互斥参数同时传 |
| **401 Unauthorized** | API 令牌身份无效 | API 令牌无效 / 缺少 / 过期 / 未激活 / 用户不存在 |
| **402 Payment Required** | 余额不足 / 付费路由 | 余额不足，允许使用免费额度 / 不接受免费额度 |
| **403 Forbidden** | 已认证但无权限 | 缺少路由访问权限 / 账户已禁用 / 邮箱未验证 / API Token 权限不足 |
| **404 Not Found** | 路由数据未找到 | 路径不在白名单 / 上游已下线 / 资源不存在或已删除 |
| **422 Unprocessable Entity** | 参数校验失败 | business_type 不合法 / oneOf 互斥同时传 / 格式不符 |
| **429 Too Many Requests** | 请求速率超限 | 请求速度过快（读 `Retry-After` 头退避） |
| **500 Internal Server Error** | 服务器内部错误 | 上游异常（含 502/503/504） |

### 错误码 → 行动 → 修复链接（决策表）

> **400 / 404 强制自检前置**：在按下表"行动"列处理 400 或 404 之前，**必须先完成"防臆造自检清单"**（见下方 §3.1）。自检通过后再走重试或 STOP。

| HTTP 码 | 子场景 | 行动 | 重试 | 修复链接 / 文档 |
|--------|-------|------|------|---------------|
| **400** | 参数错 | **先做 §3.1 防臆造自检 (B)** → 修正参数后重试 1 次；仍失败 STOP | ≤1 次 | 查端点 reference IN 表 |
| **401** | API 令牌无效 / 缺失 / 过期 / 未激活 / 用户不存在 | **STOP**，提示用户检查或更换 API Key | 0 | https://www.aconfig.cn |
| **402** | 余额不足（允许免费额度） | 告知用户当前免费额度已耗尽，可选择充值 | 0 | https://www.aconfig.cn |
| **402** | 余额不足（不接受免费额度） | 告知用户该端点为付费路由，必须充值 | 0 | https://www.aconfig.cn |
| **403** | 缺少路由访问权限 / API Token 权限不足 | **STOP**，提示用户当前 Token 无该端点权限 | 0 | https://www.aconfig.cn |
| **403** | 账户已禁用 | **STOP**，提示用户账户被禁用 | 0 | https://www.aconfig.cn |
| **403** | 邮箱未验证 | **STOP**，提示用户先到控制台验证邮箱 | 0 | https://www.aconfig.cn |
| **404** | 路径不在白名单（疑似 Agent 臆造） | **先做 §3.1 防臆造自检 (A)** → 自检失败则 STOP | 0 | 查 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) |
| **404** | 资源不存在（文章/视频/账号等） | **先做 §3.1 防臆造自检 (A)** → 通过后告知用户资源不存在 | 0 | — |
| **410** | 上游已下线 | **先做 §3.1 防臆造自检 (A)** → 通过后 STOP；建议用户更新 SKILL | 0 | 查 [`update.md`](./update.md) |
| **422** | 参数校验失败 | **先做 §3.1 防臆造自检 (B)** → 修正后重试 1 次 | ≤1 次 | 查端点 reference IN 表 |
| **429** | 限流 | 读 `Retry-After` 头退避；无该头时指数退避 + jitter；最多重试 2 次 | ≤2 次 | https://www.aconfig.cn |
| **500/502/503/504** | 上游故障 | 等 3 秒重试 1 次；仍失败走"端点替换矩阵" | ≤1 次 | — |
| **网络超时 / DNS 失败** | 网络异常 | **STOP**，向用户报告网络问题 | 0 | — |
| **HTTP 200 + `code != 0`** | 业务层错误 | 读 `message_zh` 告知，不重试 | 0 | — |

---

### § 3.1 防臆造自检清单（404 / 400 处理前置步骤）

> 收到 **404** 或 **400** 时，Agent **必须**先按对应清单完成自检。**自检不是可选的**——绕过自检直接重试或改路径都属于违反防臆造红线。

#### (A) 收到 **404** 时的自检清单 — 防路径臆造

按顺序逐项检查，**任一项失败立即 STOP**：

1. **路径白名单逐字符比对**
   - 把刚才请求的完整路径逐字符与 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 中的 `endpoints[].path` 对照
   - **是否完全相等？** 如果**不在清单中** → 这是 Agent 臆造路径，**STOP**
2. **Method 比对**
   - 实际请求的 HTTP method 是否等于清单中的 `endpoints[].method`？（本 skill 全部为 POST）
   - 如果不等 → STOP
3. **参数键名比对**
   - 实际请求的所有 body 键名是否都在该端点的 `required` ∪ `optional` 中？
   - 是否有 Agent 自己加的"看起来合理但清单没列"的参数？→ STOP
4. **资源 ID 来源溯源**
   - 请求中的 `url` / `username` / `object_id` / `content_id` 等是否真实来自之前某个端点的**响应字段**？
   - 如果是 Agent 自己生成 / 编造的字符串 → STOP
5. **若以上全通过** → 才可以判定"上游资源真的不存在"，向用户报告，**STOP**

#### (B) 收到 **400 / 422** 时的自检清单 — 防参数与传参方式臆造

按顺序逐项检查，**任一项失败必须修正**：

1. **参数名严格比对**
   - 实际请求的所有键名是否**逐字符**等于该端点 IN 表中的 `name`？
   - 是否有大小写错（`objectId` vs `object_id`）、缩写错（`uid` vs `username`）？
2. **必填项齐全**
   - 该端点 IN 表中所有标 `yes` 的参数是否都已传？
   - `oneOf(object_id, export_id, share_url)` 类型是否做到"传至少一个"？
3. **类型与格式严格匹配**
   - string 是否被错传成了 number？
   - `url` 是否为 `https://mp.weixin.qq.com/s/...` 格式？
   - `username` 是否为 `gh_...`（公众号）或 `v2_...@finder`（视频号）格式？
   - `channel_id` 是否为 `sph...` 格式？
4. **传参方式正确**
   - **本 skill 全部端点均为 POST**：参数应放在 request body（JSON），**禁止**放 query string
   - Authorization 头格式是否为 `Bearer $MAXHUB_API_KEY`？
5. **没有臆造参数**
   - 是否传入了 IN 表中**未列出**的"看起来合理但 API 不接受"的参数？
6. **若以上全通过** → 才可以按错误响应中的 `message_zh` 进一步排查

---

### 重试策略矩阵

| 错误类型 | 最大重试 | 退避算法 | 是否换端点 |
|---------|---------|---------|----------|
| 400 / 422 参数错 | 1 次（修正参数后） | 立即 | 不换端点 |
| 401 鉴权错 | 0 | — | STOP |
| 402 余额不足 | 0 | — | STOP |
| 403 权限/账户禁用 | 0 | — | STOP |
| 404 / 410 路径错或资源不存在 | 0 | — | 不改路径，可走"端点替换矩阵" |
| 429 限流 | 2 次 | Retry-After 优先；否则 `min(8s, 2^n) * (0.5 + random*0.5)` | 不换端点 |
| 5xx 上游错 | 1 次 | 固定 3s | 走"端点替换矩阵" |
| 网络超时 / DNS | 0 | — | STOP |
| 业务 `code != 0` | 0 | — | 读 `message_zh` 报告 |

### 降级策略原则
1. **数据完整度降级**：详情接口失败 → 列表接口取相同字段（少几个字段，必须显式告知用户）
2. **数据时效降级**：实时接口失败 → 命中 `cache_url` 取缓存数据（注意时效性）
3. **维度降级**：账号详情失败 → 改用 fetch_search 取概要

### 链式调用容错原则
- **第 1 步失败** → 整条链 **STOP**
- **中间步失败** → 返回截止前已有的数据 + **显式告知**用户缺失了哪一段
- **最后步失败** → 返回前序数据 + 告知最终步未完成

---

## 4. 端点替换矩阵 (Endpoint Substitution Matrix)

> 当首选端点持续 5xx / 数据为空 / 验证失败时，按此表寻找语义相近的替代端点。
> **强约束**：
> - 替换前必须**显式告知**用户
> - 替换次数 ≤ 1 次
> - 所有端点均为读取端点，无写入端点

| 首选端点 | 替代端点 | 替代条件 | 数据差异 |
|---------|---------|---------|---------|
| fetch_article_detail | fetch_account_articles（已知 gh_username） | 从文章列表中匹配 URL | 缺正文/作者详情，仅标题/摘要 |
| fetch_article_stats | 无替代 | — | 互动数据无替代来源，失败直接 STOP |
| fetch_article_comments | 无替代 | — | 评论无替代来源 |
| fetch_comment_replies | 无替代 | — | 回复无替代来源 |
| fetch_related_articles | 无替代 | — | 关联文章无替代来源 |
| fetch_article_ad | 无替代 | — | 广告信息无替代来源 |
| fetch_account_profile | fetch_search (business_type=account) | 用公众号名搜索取概要 | 字段更少，可能命中重名 |
| fetch_account_articles | 无替代 | — | 文章列表无替代来源 |
| fetch_account_services | 无替代 | — | 服务菜单无替代来源 |
| fetch_channel_info | fetch_user_profile | 互补而非替代 | channel_info 偏认证信息，user_profile 偏统计 |
| fetch_channel_id_to_username | fetch_search (business_type=account) | 用公众号名搜索 | 需知公众号名而非 sph 短号 |
| fetch_user_videos | fetch_collection_videos（已知 topic_id） | 仅取合集内视频 | 仅合集子集，非全部作品 |
| fetch_video_detail | fetch_user_videos（已知 username） | 从作品列表中匹配 | 列表项字段较少，缺 media 详情 |
| fetch_video_comments | 无替代 | — | 评论无替代来源 |
| fetch_video_share_url | 无替代 | — | 分享链接无替代来源 |
| fetch_user_profile | fetch_channel_info | 互补而非替代 | 侧重不同维度 |
| fetch_user_collections | 无替代 | — | 合集列表无替代来源 |
| fetch_collection_videos | fetch_user_videos | 取全部作品而非合集 | 含非合集视频 |
| fetch_live_history | 无替代 | — | 直播回放无替代来源 |
| fetch_live_detail | 无替代 | — | 直播详情无替代来源 |
| fetch_search_channel_videos | fetch_search (business_type=video) | 全局搜而非号内搜 | 结果不限于该号 |
| fetch_search | 无替代（顶层入口） | — | 失败 STOP |

---

## 5. 路径合法性硬校验

> 所有端点的合法路径以 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 为唯一可信源。
> Agent **必须**在调用 API 前对照 `endpoints_whitelist.yaml` 逐字符核对路径，未在清单中的路径**禁止调用**。

---

## 6. SKILL 更新机制（版本检查 + ClawHub / SkillHub 更新）

> 完整流程见 [`update.md`](./update.md)。本节给出关键索引：

### 何时建议用户更新
- 合法路径（已通过 §3.1(A) 自检）持续返回 **404 / 410**
- 多个端点连续返回 410（路由批量下线）
- 上游响应字段结构与 reference OUT 表明显不一致
- 用户主动询问"版本/更新"
- 距上次成功调用已超过 30 天

### 何时**禁止**建议更新
- 收到 401（鉴权错）、402（余额）、403（权限）、网络/DNS 错
- §3.1(A) 自检**失败**——这是 Agent 臆造路径，不是 SKILL 过时

### 更新通道（按优先级）
1. **国内首选**：`skillhub upgrade maxhub-wechat`（腾讯云 CDN 加速 + 安全审计）
   - Web 入口：https://skillhub.cn/skills/maxhub-wechat
2. **国际主源**：`clawhub upgrade maxhub-wechat`
3. **降级方案**：`git pull` 仓库 https://github.com/XieWxx/maxhub-api-skills

### 当前版本
- 读取 [`../_meta.json`](../_meta.json) 中的 `version` 字段（当前：`3.7.2`）
