# Param & Field Mapping Index / 参数与字段映射索引

Skill: `maxhub-twitter` · Base URL: `https://www.aconfig.cn` · Version: `3.7.2`

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
3. **只读操作禁止伪造结果**：所有端点均为只读，失败时禁止用其他端点"模拟"或"伪造"结果；必须 STOP 并让用户重新确认参数。
4. **读端点 5xx 重试 ≤ 1 次**：避免重复扣配额。
5. **找不到能力必须 STOP 并告知用户**：用户请求 Twitter skill 不支持的能力（见下方"不支持能力清单"）→ 直接告知该 skill 不支持，**禁止**用其他端点拼凑伪造结果。
6. **替换/降级前必须显式告知用户**：例如"由于 X 失败，已切换到 Y，数据完整度可能下降"；禁止静默降级。
7. **404 / 410 强制 STOP**：禁止 Agent 自行修改路径段后重试。**自检通过 + 持续 404** 时才建议用户更新 SKILL（详见 [`update.md`](./update.md)）。
8. **业务 `code != 0` 不重试**：业务错误（配额、合规、权限）不会因重试改变，必须读 `message_zh` 报告用户。
9. **仅 404 / 410 + 自检通过**才建议用户更新 SKILL：401 / 402 / 403 / 网络错**不是** SKILL 版本问题，禁止误导用户更新。
10. **screen_name 与 rest_id 互斥逻辑**：`fetch_user_profile` 和 `fetch_user_post_tweet` 中，screen_name 与 rest_id 二选一；同时传可能被忽略或报错，传 rest_id 时 screen_name 会被忽略。

---

## 0.1 本 skill 不支持的能力 (Out of Scope)

> 用户请求以下功能时，**直接告知不支持并 STOP**。**禁止**用现有 13 个端点"拼凑"或"模拟"以下能力：

| 不支持的能力 | 说明 |
|------------|------|
| 发推 / 删推 / 编辑推文 | 无写入端点 |
| 发送私信 / DM | 无私信端点 |
| 点赞 / 取消点赞 | 无社交互动写入端点 |
| 转推 / 引用推文操作 | 无写入端点（仅能读取转推用户列表） |
| 评论 / 删评论 | 仅支持读评论，无写入端点 |
| 关注 / 取消关注 | 仅支持读关注/粉丝列表 |
| 修改用户资料 / 头像 | 无修改端点 |
| 充值 / 计费查询 / 配额查询 | 在 https://www.aconfig.cn 控制台查询 |
| OAuth 用户授权操作 | 本 skill 仅支持 API Key 模式 |
| 实时推文流 / WebSocket 流 | 无实时流端点 |
| 书签 / 列表管理 | 无相关端点 |
| 空间 (Spaces) | 无 Spaces 端点 |

> 遇到上述请求 → 直接回复用户："本 skill 暂不支持此能力，建议在 Twitter/X 官方应用中操作"，**禁止**用 fetch_search_timeline / fetch_user_profile 等端点伪造结果。

---

## 0.2 原子化 + 编排入口 (Atomic & Orchestration)

> Agent 可通过两层入口快速定位端点与链路：
> - **原子层**：[`atoms/_index.md`](./atoms/_index.md) — 每个端点封装为原子（atom_id ↔ endpoint_id 映射 + 幂等性 + 链路角色）
> - **编排层**：[`recipes/_index.md`](./recipes/_index.md) — 每个用户目标封装为 Recipe（trigger_keywords + 多步链路 + 容错）
> - **推荐流程**：用户语义 → `recipes/_index.md` 匹配 Recipe → 按 Recipe 的 Atomic Steps 调用 `atoms/_index.md` 中的原子

---

## 1. 端点路由索引 (Endpoint Routing Index)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| fetch_tweet_detail | 用 tweet_id 取推文完整详情（链式起点） | content.md | GET | low |
| fetch_post_comments | 用 tweet_id 取推文热门评论 | content.md | GET | low |
| fetch_latest_post_comments | 用 tweet_id 取推文最新评论 | content.md | GET | low |
| fetch_retweet_user_list | 用 tweet_id 取转推用户列表 | content.md | GET | low |
| fetch_search_timeline | 用关键字搜索推文/用户/媒体 | content.md | GET | low |
| fetch_trending | 按国家取热门趋势 | content.md | GET | low |
| fetch_user_profile | 用 screen_name/rest_id 取用户资料 | user.md | GET | low |
| fetch_user_post_tweet | 用 screen_name/rest_id 取用户推文 | user.md | GET | low |
| fetch_user_tweet_replies | 用 screen_name 取用户回复 | user.md | GET | low |
| fetch_user_media | 用 screen_name 取用户媒体 | user.md | GET | low |
| fetch_user_followings | 用 screen_name 取关注列表 | user.md | GET | low |
| fetch_user_followers | 用 screen_name 取粉丝列表 | user.md | GET | low |
| fetch_user_highlights_tweets | 用 userId 取用户高光推文 | user.md | GET | low |

---

## 2. 字段流字典 (Field Flow Dictionary)

> 当用户需要的数据需要"先 A 再 B"才能取到时，查此表确认字段如何在端点间传递，避免 Agent 臆造字段名或路径。

### `tweet_id` — 推文 ID（形如纯数字字符串，如 `1808168603721650364`）
- **可从这些端点产出（OUT）**：
  - `fetch_tweet_detail` → `$.data.tweet_id`（回显）
  - `fetch_search_timeline` → `$.data.tweets[].tweet_id`
  - `fetch_user_post_tweet` → `$.data.tweets[].tweet_id`
  - `fetch_user_highlights_tweets` → `$.data.tweets[].tweet_id`
- **可作为输入（IN）**：
  - `fetch_tweet_detail`
  - `fetch_post_comments`
  - `fetch_latest_post_comments`
  - `fetch_retweet_user_list`
- **获取方式**：从推文链接中提取，如 `https://x.com/elonmusk/status/1808168603721650364` 中的 `1808168603721650364`

### `screen_name` — 用户名（如 `elonmusk`）
- **可从这些端点产出（OUT）**：
  - `fetch_user_profile` → `$.data.screen_name`
  - `fetch_search_timeline`（search_type=People）→ `$.data.users[].screen_name`
  - `fetch_retweet_user_list` → `$.data.users[].screen_name`
  - `fetch_user_followings` → `$.data.users[].screen_name`
  - `fetch_user_followers` → `$.data.users[].screen_name`
- **可作为输入（IN）**：
  - `fetch_user_profile`（与 rest_id 二选一）
  - `fetch_user_post_tweet`（与 rest_id 二选一）
  - `fetch_user_tweet_replies`
  - `fetch_user_media`
  - `fetch_user_followings`
  - `fetch_user_followers`
- **获取方式**：从用户主页链接中提取，如 `https://twitter.com/elonmusk` 中的 `elonmusk`

### `rest_id` — 用户数字 ID（如 `44196397`）
- **可从这些端点产出（OUT）**：
  - `fetch_user_profile` → `$.data.rest_id`
  - `fetch_search_timeline` → `$.data.users[].rest_id`
  - `fetch_retweet_user_list` → `$.data.users[].rest_id`
  - `fetch_user_followings` → `$.data.users[].rest_id`
  - `fetch_user_followers` → `$.data.users[].rest_id`
- **可作为输入（IN）**：
  - `fetch_user_profile`（与 screen_name 二选一，优先级高于 screen_name）
  - `fetch_user_post_tweet`（与 screen_name 二选一）
  - `fetch_user_media`（可选，与 screen_name 配合使用）
  - `fetch_user_highlights_tweets`（参数名为 `userId`）

### `cursor` — 分页游标（通用）
- **产出/输入**：所有支持分页的端点（同端点的下一次调用使用上次响应中的 cursor 值）

### `country` — 趋势国家代码
- **可选值**：UnitedStates（默认）、China、Japan、India、Russia、Germany、Indonesia、Brazil、France、UnitedKingdom、Turkey、Italy、Mexico、SouthKorea、Canada、Spain、SaudiArabia、Egypt、Australia、Poland、Iran、Pakistan、Vietnam、Nigeria、Bangladesh、Netherlands、Argentina、Philippines、Malaysia、Colombia、UniteArabEmirates、Romania、Belgium、Switzerland、Singapore、Sweden、Norway、Austria、Kazakhstan、Algeria、Chile、Czechia、Peru、Iraq、Israel、Ukraine、Denmark、Portugal、Hungary、Greece、Finland、NewZealand、Belarus、Slovakia、Serbia、Lithuania、Luxembourg、Estonia

### `search_type` — 搜索类型
- **可选值**：Top（默认）、Latest、Media、People、Lists

---

## 3. 全 skill 错误处理总览 (Error Handling Overview)

### HTTP 状态码权威定义（MaxHub API 官方）

> 以下为 MaxHub API 平台官方 HTTP 状态码定义。**Agent 必须**按此表语义判定错误类型，不要自行解读。

| HTTP 状态码 | 官方含义 | 细分场景 |
|------------|---------|---------|
| **400 Bad Request** | 请求格式错误或参数不正确 | • 参数缺失 / 类型错 / 格式不符 / 互斥参数同时传 |
| **401 Unauthorized** | API 令牌身份无效 | • API 令牌无效 / 缺失 / 过期 / 未激活 / 用户不存在 |
| **402 Payment Required** | 余额不足 / 付费路由 | • 余额不足，此路由需要付费 |
| **403 Forbidden** | 已认证但无权限 | • 缺少路由访问权限 / 账户已禁用 / 邮箱未验证 / API Token 权限不足 |
| **404 Not Found** | 路由数据未找到 | • 路径不在白名单 / 上游已下线 / 资源不存在或已删除 |
| **429 Too Many Requests** | 请求速率超限 | • 请求速度过快，超过速率限制（读 `Retry-After` 头退避） |
| **500 Internal Server Error** | 服务器内部错误 | • 上游异常，无法完成请求（5xx 通常归入此类，含 502/503/504） |

### 错误码 → 行动 → 修复链接（决策表）

> **400 / 404 强制自检前置**：在按下表"行动"列处理 400 或 404 之前，**必须先完成"防臆造自检清单"**（见下方 §3.1）。自检通过后再走重试或 STOP。

| HTTP 码 | 子场景 | 行动 | 重试 | 修复链接 / 文档 |
|--------|-------|------|------|---------------|
| **400** | 参数错 | **先做 §3.1 防臆造自检 (B)** → 修正参数后重试 1 次；仍失败 STOP | ≤1 次 | 查端点 reference IN 表 |
| **401** | API 令牌无效 / 缺失 / 过期 / 未激活 / 用户不存在 | **STOP**，提示用户检查或更换 API Key | 0 | https://www.aconfig.cn |
| **402** | 余额不足 | 告知用户当前额度已耗尽，可选择充值 | 0 | https://www.aconfig.cn |
| **403** | 缺少路由访问权限 / API Token 权限不足 | **STOP**，提示用户当前 Token 无该端点权限，需联系平台 | 0 | https://www.aconfig.cn |
| **403** | 账户已禁用 | **STOP**，提示用户账户被禁用 | 0 | https://www.aconfig.cn |
| **403** | 邮箱未验证 | **STOP**，提示用户先到控制台验证邮箱 | 0 | https://www.aconfig.cn |
| **404** | 路径不在白名单（疑似 Agent 臆造） | **先做 §3.1 防臆造自检 (A)** → 自检失败则 STOP，**禁止改路径段重试** | 0 | 查 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) |
| **404** | 资源不存在（tweet_id/screen_name 等） | **先做 §3.1 防臆造自检 (A)** → 通过后告知用户资源已删除或不存在，**STOP** | 0 | — |
| **410** | 上游已下线 | **先做 §3.1 防臆造自检 (A)** → 通过后 STOP，禁止改路径重试；若 SKILL 长期未更新，提示用户运行 §5 SKILL 更新检查 | 0 | 查 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) + §5 |
| **422** | 参数校验失败 | **先做 §3.1 防臆造自检 (B)** → 修正后重试 1 次 | ≤1 次 | 查端点 reference IN 表 |
| **429** | 限流 | 读 `Retry-After` 头退避；无该头时指数退避 + jitter；最多重试 2 次 | ≤2 次 | https://www.aconfig.cn |
| **500/502/503/504** | 上游故障 | 等 3 秒重试 1 次；仍失败走"端点替换矩阵" | ≤1 次 | — |
| **网络超时 / DNS 失败** | 网络异常 | **STOP**，向用户报告网络问题 | 0 | — |
| **HTTP 200 + `code != 0`** | 业务层错误 | 读 `message_zh` 告知，不重试 | 0 | https://www.aconfig.cn |

---

### § 3.1 防臆造自检清单（404 / 400 处理前置步骤）

> 收到 **404** 或 **400** 时，Agent **必须**先按对应清单完成自检。**自检不是可选的**——绕过自检直接重试或改路径都属于违反防臆造红线。

#### (A) 收到 **404** 时的自检清单 防路径臆造

按顺序逐项检查，**任一项失败立即 STOP**：

1. **路径白名单逐字符比对**
   - 把刚才请求的完整路径（`/api/v1/twitter/web/<id>`）逐字符与 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 中的 `endpoints[].path` 对照
   - **是否完全相等？** 如果**不在清单中** → 这是 Agent 臆造路径，**STOP**，禁止任何"改 v1→v2 / 加路径段 / 拼接前缀"的尝试
2. **Method 比对**
   - 实际请求的 HTTP method 是否等于清单中的 `endpoints[].method`？
   - 如果不等 → STOP，禁止换 method 重试
3. **参数键名比对**
   - 实际请求的所有 query/body 键名是否都在该端点的 `required` ∪ `optional` 中？
   - 是否有 Agent 自己加的"看起来合理但清单没列"的参数？→ STOP
4. **资源 ID 来源溯源**
   - 请求中的 `tweet_id` / `screen_name` / `rest_id` / `userId` 等是否真实来自之前某个端点的**响应字段**（json_path 可追溯）？
   - 如果是 Agent 自己生成 / 编造的字符串 → STOP，告知用户资源不存在
5. **若以上全通过** → 才可以判定"上游资源真的不存在"，向用户报告"资源已删除或不存在"，**STOP**（禁止改路径重试）

#### (B) 收到 **400 / 422** 时的自检清单 防参数与传参方式臆造

按顺序逐项检查，**任一项失败必须修正**：

1. **参数名严格比对**
   - 实际请求的所有键名是否**逐字符**等于该端点 IN 表中的 `name`？
   - 是否有大小写错（`tweetId` vs `tweet_id`）、缩写错（`uid` vs `userId`）、名称错（`user_id` vs `rest_id`）？
2. **必填项齐全**
   - 该端点 IN 表中所有标 `yes` 的参数是否都已传？
   - `oneOf(screen_name, rest_id)` 类型是否做到"至少传一个"？
3. **类型与格式严格匹配**
   - string 是否被错传成了 number？`rest_id` 是 integer 类型但 `userId` 是 string 类型
   - 是否符合 `enum` 约束（如 search_type 只能是 Top/Latest/Media/People/Lists）？
4. **传参方式正确**
   - GET 端点：参数应放在 query string，不应放在 request body
   - Authorization 头格式是否为 `Bearer $MAXHUB_API_KEY`？
5. **没有臆造参数**
   - 是否传入了 IN 表中**未列出**的"看起来合理但 API 不接受"的参数？例如 `sort_by` / `lang` / `limit` 等 Agent 自行编造的字段
6. **若以上全通过** → 才可以按错误响应中的 `message_zh` 进一步排查；如仍无法定位 → STOP，向用户报告参数错误

---

### 重试策略矩阵
| 错误类型 | 最大重试 | 退避算法 | 是否换端点 |
|---------|---------|---------|----------|
| 400 / 422 参数错 | 1 次（修正参数后） | 立即 | 不换端点 |
| 401 鉴权错 | 0 | — | STOP |
| **402 余额不足** | 0 | — | STOP，告知用户充值 |
| 403 权限/账户禁用/邮箱未验证 | 0 | — | STOP |
| 404 / 410 路径错或资源不存在 | 0 | — | 不改路径，可走"端点替换矩阵" |
| 429 限流 | 2 次 | Retry-After 优先；否则 `min(8s, 2^n) * (0.5 + random*0.5)` | 不换端点 |
| 5xx 上游错 | 1 次 | 固定 3s | 走"端点替换矩阵" |
| 网络超时 / DNS | 0 | — | STOP |
| 业务 `code != 0` | 0 | — | 读 `message_zh` 报告，不重试 |

### 降级策略原则
1. **数据完整度降级**：详情接口失败 → 列表接口取相同字段（少几个字段，必须显式告知用户）
2. **数据时效降级**：实时接口失败 → 命中 `cache_url` 取缓存数据（注意时效性）
3. **维度降级**：用户资料失败 → 改用搜索结果中的概要信息（必须 screen_name 上下文）

### 链式调用容错原则
- **第 1 步失败** → 整条链 **STOP**
- **中间步失败** → 返回截止前已有的数据 + **显式告知**用户缺失了哪一段
- **最后步失败** → 返回前序数据 + 告知最终步未完成

---

## 4. 端点替换矩阵 (Endpoint Substitution Matrix)

> 当首选端点持续 5xx / 数据为空 / 验证失败时，按此表寻找语义相近的替代端点。
> **强约束**：
> - 替换前必须**显式告知**用户："由于 X 失败，已切换到 Y，数据完整度可能下降"
> - 替换次数 ≤ 1 次（禁止无限链式替换）

| 首选端点 | 替代端点 | 替代条件 | 数据差异 |
|---------|---------|---------|---------|
| fetch_tweet_detail | fetch_search_timeline（用关键字搜到同推文） | 需知推文内容关键字 | 字段较少，需从搜索结果中匹配 |
| fetch_post_comments | fetch_latest_post_comments | 用户接受按最新排序而非热门排序 | 排序方式不同 |
| fetch_latest_post_comments | fetch_post_comments | 用户接受按热门排序而非最新排序 | 排序方式不同 |
| fetch_user_profile | fetch_search_timeline（search_type=People） | 用户名足够独特 | 字段更少，可能命中重名 |
| fetch_user_post_tweet | fetch_user_media（仅含媒体推文） | 用户只需要含图片/视频的推文 | 仅返回含媒体的推文 |
| fetch_user_followings | 无替代 | — | 多数因隐私限制不可见 |
| fetch_user_followers | 无替代 | — | 同上 |
| fetch_user_highlights_tweets | fetch_user_post_tweet | 用户接受非高光推文 | 包含全部推文，非精选 |
| fetch_search_timeline | 无替代 | — | 搜索无替代来源 |
| fetch_trending | 无替代 | — | 趋势无替代来源 |
| fetch_retweet_user_list | 无替代 | — | 转推列表无替代来源 |
| fetch_user_tweet_replies | 无替代 | — | 回复无替代来源 |

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
- 收到 401（鉴权错）、402（余额）、403（权限）、网络/DNS 错——这些**不是** SKILL 版本问题
- §3.1(A) 自检**失败**——这是 Agent 臆造路径，不是 SKILL 过时

### 更新通道（按优先级）
1. **国内首选**：`skillhub upgrade maxhub-twitter`（腾讯云 CDN 加速 + 安全审计）
   - Web 入口：https://skillhub.cn/skills/maxhub-twitter
2. **国际主源**：`clawhub upgrade maxhub-twitter`
3. **降级方案**：`git pull` 仓库 https://github.com/XieWxx/maxhub-api-skills

### 当前版本
- 读取 [`../_meta.json`](../_meta.json) 中的 `version` 字段（当前：`3.7.2`）

### Agent 推荐话术（详见 [`update.md` § 4](./update.md#4-agent-推荐对话话术)）
- 场景 A：合法路径 404 → 建议升级
- 场景 B：用户问版本 → 给出当前版本 + 检查方法
- 场景 C：批量 410 → 强制升级提示
