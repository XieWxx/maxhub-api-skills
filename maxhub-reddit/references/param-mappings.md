# Param & Field Mapping Index / 参数与字段映射索引

Skill: `maxhub-reddit` · Base URL: `https://www.aconfig.cn` · Version: `3.7.2`

> 本文件不重复端点完整说明（详见各 reference 文件），仅承担六个职能：
> 1. **全局红线 + 不支持能力清单**：防臆造的最强约束
> 2. **端点路由索引**：按 ID 快速定位 reference 文件
> 3. **字段流字典**：跨端点链式调用的字段索引
> 4. **错误处理总览 + 端点替换矩阵**：全 skill 共享的错误策略
> 5. **路径合法性硬校验**：以 `endpoints_whitelist.yaml` 为唯一可信源
> 6. **SKILL 更新机制**：版本检查 + ClawHub / SkillHub 更新，详见 [`update.md`](./update.md)

---

## 0. 🚨 全局红线 (Global Forbidden) — 强制约束

> 以下规则**最高优先级**，任何端点级 ERR 表都不得突破。

1. **路径禁止臆造**：所有路径必须逐字符匹配 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml)；不在清单中 → **STOP**，禁止"换一个版本试试"、"改一改路径段试试"、"把 v1 改成 v2 试探"。
2. **404 / 400 必须先做防臆造自检**：见 [§ 3.1](#-31-防臆造自检清单404--400-处理前置步骤)，绕过自检直接重试或改路径都属于违反防臆造红线。
3. **读取操作禁止替代伪造**：本 skill 全部为读取端点，无写入端点。任何端点失败时，禁止用其他端点"模拟"或"伪造"结果；必须 STOP 并让用户重新确认参数。
4. **5xx 重试 ≤ 1 次**：读端点可重试 1 次。
5. **找不到能力必须 STOP 并告知用户**：用户请求 Reddit 不支持的能力（见下方"不支持能力清单"）→ 直接告知该 skill 不支持，**禁止**用其他端点拼凑伪造结果。
6. **替换/降级前必须显式告知用户**：例如"由于 X 失败，已切换到 Y，数据完整度可能下降"；禁止静默降级。
7. **404 / 410 强制 STOP**：禁止 Agent 自行修改路径段后重试。**自检通过 + 持续 404** 时才建议用户更新 SKILL（详见 [`update.md`](./update.md)）。
8. **业务 `code != 0` 不重试**：业务错误（配额、合规、权限）不会因重试改变，必须读 `message_zh` 报告用户。
9. **仅 404 / 410 + 自检通过**才建议用户更新 SKILL：401 / 402 / 403 / 网络错**不是** SKILL 版本问题，禁止误导用户更新。

---

## 0.1 ❌ 本 skill 不支持的能力 (Out of Scope)

> 用户请求以下功能时，**直接告知不支持并 STOP**。**禁止**用现有 27 个端点"拼凑"或"模拟"以下能力：

| 不支持的能力 | 说明 |
|------------|------|
| 发帖 / 提交内容 | 无写入端点 |
| 评论 / 删评论 | 仅支持读评论，无写入端点 |
| 点赞 / 取消点赞 | 无社交互动写入端点 |
| 关注 / 取消关注 | 无写入端点 |
| 发送私信 / DM | 无私信端点 |
| 转发 / 分享操作 | 无写入端点 |
| 修改用户资料 / 头像 | 无修改端点 |
| 订阅 / 退订版块 | 无写入端点 |
| 充值 / 计费查询 / 配额查询 | 在 https://www.aconfig.cn 控制台查询 |
| OAuth 用户授权操作 | 本 skill 仅支持 API Key 模式 |
| 实时通知 / WebSocket 流 | 无实时流端点 |
| Reddit 投票 / 举报 | 无写入端点 |
| 多 Reddit 账号切换 | 无账号管理端点 |

> 遇到上述请求 → 直接回复用户："本 skill 暂不支持此能力，建议在 Reddit 官方应用中操作"，**禁止**用 fetch_post_details / fetch_user_profile 等端点伪造结果。

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
| fetch_home_feed | 取首页推荐 Feed | content.md | GET | low |
| fetch_popular_feed | 取全站热门帖子 | content.md | GET | low |
| fetch_games_feed | 取游戏推荐 Feed | content.md | GET | low |
| fetch_news_feed | 取资讯推荐 Feed | content.md | GET | low |
| fetch_explore_feed | 取发现页（社区分类） | content.md | GET | low |
| fetch_topic_feed | 用 topic_id 取分类 Feed | content.md | GET | low |
| fetch_post_details | 用 post_id 取单个帖子详情 | content.md | GET | low |
| fetch_post_details_batch | 用 post_ids 批量取帖子详情（≤5） | content.md | GET | low |
| fetch_post_details_batch_large | 用 post_ids 大批量取帖子详情（≤30） | content.md | GET | low |
| fetch_post_comments | 用 post_id 取帖子一级评论 | content.md | GET | low |
| fetch_comment_replies | 用 cursor 取评论回复（二级评论） | content.md | GET | low |
| fetch_generated_posts | 批量取 Reddit Answers 精简帖子 | content.md | GET | low |
| fetch_generated_comments | 批量取 Reddit Answers 精简评论 | content.md | GET | low |
| fetch_search_typeahead | 搜索自动补全建议 | search.md | GET | low |
| fetch_dynamic_search | 动态搜索（帖子/社区/评论/媒体/用户） | search.md | GET | low |
| fetch_community_highlights | 用 subreddit_id 取社区亮点 | search.md | GET | low |
| fetch_trending_searches | 取今日热门搜索趋势 | search.md | GET | low |
| fetch_subreddit_style | 用 subreddit_name 取版块规则样式 | subreddit.md | GET | low |
| fetch_subreddit_post_channels | 用 subreddit_name 取版块帖子频道 | subreddit.md | GET | low |
| fetch_subreddit_info | 用 subreddit_name 取版块信息 | subreddit.md | GET | low |
| fetch_subreddit_settings | 用 subreddit_id 取版块设置 | subreddit.md | GET | low |
| fetch_subreddit_feed | 用 subreddit_name 取版块 Feed | subreddit.md | GET | low |
| check_subreddit_muted | 用 subreddit_id 检查版块静音状态 | subreddit.md | GET | low |
| fetch_user_profile | 用 username 取用户资料 | user.md | GET | low |
| fetch_user_active_subreddits | 用 username 取用户活跃社区 | user.md | GET | low |
| fetch_user_comments | 用 username 取用户评论列表 | user.md | GET | low |
| fetch_user_posts | 用 username 取用户帖子列表 | user.md | GET | low |
| fetch_user_trophies | 用 username 取用户奖杯 | user.md | GET | low |

---

## 2. 字段流字典 (Field Flow Dictionary)

> 当用户需要的数据需要"先 A 再 B"才能取到时，查此表确认字段如何在端点间传递，避免 Agent 臆造字段名或路径。

### `post_id` — 帖子 ID（形如 `t3_xxxxx`）
- **可从这些端点产出（OUT）**：
  - `fetch_home_feed` → `$.data.posts[].id` / `$.data.feed[].post_id`
  - `fetch_popular_feed` → `$.data.posts[].id`
  - `fetch_games_feed` → `$.data.posts[].id`
  - `fetch_news_feed` → `$.data.posts[].id`
  - `fetch_explore_feed` → `$.data.posts[].id`
  - `fetch_topic_feed` → `$.data.posts[].id`
  - `fetch_subreddit_feed` → `$.data.posts[].id`
  - `fetch_user_posts` → `$.data.posts[].id`
  - `fetch_dynamic_search` → `$.data.results[].id`（search_type=post）
  - `fetch_generated_posts` → `$.data.posts[].id`
- **可作为输入（IN）**：
  - `fetch_post_details`
  - `fetch_post_details_batch`（逗号分隔）
  - `fetch_post_details_batch_large`（逗号分隔）
  - `fetch_post_comments`
  - `fetch_comment_replies`
  - `fetch_generated_posts`（逗号分隔）

### `comment_id` — 评论 ID（形如 `t1_xxxxx`）
- **产出**：`fetch_post_comments` → `$.data.comments[].id`
- **产出**：`fetch_comment_replies` → `$.data.replies[].id`
- **输入**：`fetch_comment_replies`（通过 cursor 间接引用）
- **输入**：`fetch_generated_comments`（逗号分隔）

### `cursor` — 评论游标（用于二级评论翻页）
- **产出**：`fetch_post_comments` → `$.data.commentForest.trees[-1].more.cursor`
- **输入**：`fetch_comment_replies.cursor`

### `after` — 分页参数（通用）
- **产出/输入**：所有支持分页的端点（同端点的下一次调用使用上次响应的 `$.data.after` 或类似字段）

### `subreddit_name` — 版块名称（如 `pics`、`AskReddit`）
- **可从这些端点产出（OUT）**：
  - `fetch_post_details` → `$.data.subreddit.name`
  - `fetch_subreddit_feed` → 用户直接提供
  - `fetch_dynamic_search` → `$.data.results[].name`（search_type=community）
  - `fetch_search_typeahead` → `$.data.subreddits[].name`
  - `fetch_user_active_subreddits` → `$.data.subreddits[].name`
- **可作为输入（IN）**：
  - `fetch_subreddit_style`
  - `fetch_subreddit_post_channels`
  - `fetch_subreddit_info`
  - `fetch_subreddit_feed`

### `subreddit_id` — 版块 ID（形如 `t5_xxxxx`）
- **可从这些端点产出（OUT）**：
  - `fetch_subreddit_info` → `$.data.subreddit.id`
  - `fetch_post_details` → `$.data.subreddit.id`
- **可作为输入（IN）**：
  - `fetch_subreddit_settings`
  - `check_subreddit_muted`
  - `fetch_community_highlights`

### `topic_id` — 分类 ID（形如 `tx1_xxxxx`）
- **产出**：`fetch_explore_feed` → `$.data.topics[].id`
- **输入**：`fetch_topic_feed.topic_id`

### `username` — 用户名（如 `spez`）
- **可从这些端点产出（OUT）**：
  - `fetch_post_details` → `$.data.author.name`
  - `fetch_post_comments` → `$.data.comments[].author.name`
  - `fetch_comment_replies` → `$.data.replies[].author.name`
  - `fetch_dynamic_search` → `$.data.results[].name`（search_type=people）
  - `fetch_search_typeahead` → `$.data.users[].name`
- **可作为输入（IN）**：
  - `fetch_user_profile`
  - `fetch_user_active_subreddits`
  - `fetch_user_comments`
  - `fetch_user_posts`
  - `fetch_user_trophies`

---

## 3. 全 skill 错误处理总览 (Error Handling Overview)

### HTTP 状态码权威定义（MaxHub API 官方）

> 以下为 MaxHub API 平台官方 HTTP 状态码定义。**Agent 必须**按此表语义判定错误类型，不要自行解读。

| HTTP 状态码 | 官方含义 | 细分场景 |
|------------|---------|---------|
| **400 Bad Request** | 请求格式错误或参数不正确 | • 参数缺失 / 类型错 / 格式不符 / 互斥参数同时传<br>• 偶尔出现于服务器内部错误（罕见，按 422 处理） |
| **401 Unauthorized** | API 令牌身份无效 | • API 令牌无效<br>• 缺少 API 令牌<br>• 无法验证 API 令牌<br>• API 令牌状态无效或未被激活<br>• API 令牌已过期<br>• 用户不存在 |
| **402 Payment Required** | 余额不足 / 付费路由 | • 余额不足，此路由需要付费，**允许使用免费额度**<br>• 余额不足，此路由需要付费，**不接受免费额度** |
| **403 Forbidden** | 已认证但无权限 | • 缺少路由访问权限<br>• 账户已禁用<br>• 邮箱未验证<br>• API Token 权限不足 |
| **404 Not Found** | 路由数据未找到 | • 路径不在白名单 / 上游已下线<br>• 资源（post_id/username 等）不存在或已删除 |
| **429 Too Many Requests** | 请求速率超限 | • 请求速度过快，超过速率限制（读 `Retry-After` 头退避） |
| **500 Internal Server Error** | 服务器内部错误 | • 上游异常，无法完成请求（5xx 通常归入此类，含 502/503/504） |

### 错误码 → 行动 → 修复链接（决策表）

> ⚠️ **400 / 404 强制自检前置**：在按下表"行动"列处理 400 或 404 之前，**必须先完成"防臆造自检清单"**（见下方 §3.1）。自检通过后再走重试或 STOP。

| HTTP 码 | 子场景 | 行动 | 重试 | 修复链接 / 文档 |
|--------|-------|------|------|---------------|
| **400** | 参数错 | **先做 §3.1 防臆造自检 (B)** → 修正参数后重试 1 次；仍失败 STOP | ≤1 次 | 查端点 reference IN 表 |
| **401** | API 令牌无效 / 缺失 / 过期 / 未激活 / 用户不存在 | **STOP**，提示用户检查或更换 API Key | 0 | https://www.aconfig.cn |
| **402** | 余额不足（允许免费额度） | 告知用户当前免费额度已耗尽，可选择充值 | 0 | https://www.aconfig.cn |
| **402** | 余额不足（不接受免费额度） | 告知用户该端点为付费路由，必须充值 | 0 | https://www.aconfig.cn |
| **403** | 缺少路由访问权限 / API Token 权限不足 | **STOP**，提示用户当前 Token 无该端点权限，需联系平台 | 0 | https://www.aconfig.cn |
| **403** | 账户已禁用 | **STOP**，提示用户账户被禁用 | 0 | https://www.aconfig.cn |
| **403** | 邮箱未验证 | **STOP**，提示用户先到控制台验证邮箱 | 0 | https://www.aconfig.cn |
| **404** | 路径不在白名单（疑似 Agent 臆造） | **先做 §3.1 防臆造自检 (A)** → 自检失败则 STOP，**禁止改路径段重试** | 0 | 查 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) |
| **404** | 资源不存在（post_id/username 等） | **先做 §3.1 防臆造自检 (A)** → 通过后告知用户资源已删除或不存在，**STOP** | 0 | — |
| **410** | 上游已下线 | **先做 §3.1 防臆造自检 (A)** → 通过后 STOP，禁止改路径重试；若 SKILL 长期未更新，提示用户运行 §5 SKILL 更新检查 | 0 | 查 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) + §5 |
| **422** | 参数校验失败 | **先做 §3.1 防臆造自检 (B)** → 修正后重试 1 次 | ≤1 次 | 查端点 reference IN 表 |
| **429** | 限流 | 读 `Retry-After` 头退避；无该头时指数退避 + jitter；最多重试 2 次 | ≤2 次 | https://www.aconfig.cn |
| **500/502/503/504** | 上游故障 | 等 3 秒重试 1 次；仍失败走"端点替换矩阵" | ≤1 次 | — |
| **网络超时 / DNS 失败** | 网络异常 | **STOP**，向用户报告网络问题 | 0 | — |
| **HTTP 200 + `code != 0` 配额耗尽** | 业务层配额错 | 读 `message_zh` 告知，不重试 | 0 | https://www.aconfig.cn |
| **HTTP 200 + `code != 0` 其他** | 其他业务错误 | 读 `message_zh` 报告，不重试 | 0 | — |

---

### § 3.1 防臆造自检清单（404 / 400 处理前置步骤）

> 收到 **404** 或 **400** 时，Agent **必须**先按对应清单完成自检。**自检不是可选的**——绕过自检直接重试或改路径都属于违反防臆造红线。

#### (A) 收到 **404** 时的自检清单 ⚠️ 防路径臆造

按顺序逐项检查，**任一项失败立即 STOP**：

1. **路径白名单逐字符比对**
   - 把刚才请求的完整路径（`/api/v1/reddit/app/<id>`）逐字符与 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 中的 `endpoints[].path` 对照
   - **是否完全相等？** 如果**不在清单中** → 这是 Agent 臆造路径，**STOP**，禁止任何"改 v1→v2 / 加路径段 / 拼接前缀"的尝试
2. **Method 比对**
   - 实际请求的 HTTP method 是否等于清单中的 `endpoints[].method`？
   - 如果不等 → STOP，禁止换 method 重试
3. **参数键名比对**
   - 实际请求的所有 query/body 键名是否都在该端点的 `required` ∪ `optional` 中？
   - 是否有 Agent 自己加的"看起来合理但清单没列"的参数？→ STOP
4. **资源 ID 来源溯源**
   - 请求中的 `post_id` / `username` / `subreddit_id` / `topic_id` 等是否真实来自之前某个端点的**响应字段**（json_path 可追溯）？
   - 如果是 Agent 自己生成 / 编造的字符串 → STOP，告知用户资源不存在
5. **若以上全通过** → 才可以判定"上游资源真的不存在"，向用户报告"资源已删除或不存在"，**STOP**（禁止改路径重试）

#### (B) 收到 **400 / 422** 时的自检清单 ⚠️ 防参数与传参方式臆造

按顺序逐项检查，**任一项失败必须修正**：

1. **参数名严格比对**
   - 实际请求的所有键名是否**逐字符**等于该端点 IN 表中的 `name`？
   - 是否有大小写错（`postId` vs `post_id`）、复数错（`usernames` vs `username`）、缩写错（`sub` vs `subreddit_name`）？
2. **必填项齐全**
   - 该端点 IN 表中所有标 `yes` 的参数是否都已传？
3. **类型与格式严格匹配**
   - string 是否被错传成了 number？数组是否被传成 JSON 字符串？
   - 是否符合 `pattern` / `enum` / `min` / `max` 等 Constraints？
4. **传参方式正确**
   - GET 端点：参数应放在 query string，不应放在 request body
   - 是否使用了不被该端点支持的 header / cookie？
   - Authorization 头格式是否为 `Bearer $MAXHUB_API_KEY`？
5. **没有臆造参数**
   - 是否传入了 IN 表中**未列出**的"看起来合理但 API 不接受"的参数？例如 `sort_by` / `lang` 等 Agent 自行编造的字段
   - 这类参数即使被忽略也可能触发 400
6. **若以上全通过** → 才可以按错误响应中的 `message_zh` 进一步排查；如仍无法定位 → STOP，向用户报告参数错误

> 💡 **自检方法**：建议在响应解析阶段把请求 URL、headers、body 与 `endpoints_whitelist.yaml` + reference IN 表做一次结构化对比，再决定是否重试。

---

### 重试策略矩阵
| 错误类型 | 最大重试 | 退避算法 | 是否换端点 |
|---------|---------|---------|----------|
| 400 / 422 参数错 | 1 次（修正参数后） | 立即 | ❌ 不换端点 |
| 401 鉴权错 | 0 | — | STOP |
| **402 余额不足 / 付费路由** | 0 | — | STOP，告知用户充值或升级 |
| 403 权限/账户禁用/邮箱未验证 | 0 | — | STOP，按子场景给修复指引 |
| 404 / 410 路径错或资源不存在 | 0 | — | ❌ 不改路径，可走"端点替换矩阵" |
| 429 限流 | 2 次 | Retry-After 优先；否则 `min(8s, 2^n) * (0.5 + random*0.5)` | ❌ |
| 5xx 上游错 | 1 次 | 固定 3s | ✅ 走"端点替换矩阵" |
| 网络超时 / DNS | 0 | — | STOP |
| 业务 `code != 0` | 0 | — | 读 `message_zh` 报告，不重试 |

### 降级策略原则
1. **数据完整度降级**：详情接口失败 → 列表接口取相同字段（少几个字段，必须显式告知用户）
2. **维度降级**：版块详情失败 → 改用 fetch_subreddit_feed 取概要（必须 subreddit_name 上下文）

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
| fetch_post_details | fetch_post_details_batch（单 ID） | 接口兼容 | 响应格式略不同，字段基本一致 |
| fetch_post_details | fetch_popular_feed / fetch_home_feed（在 feed 中匹配 post_id） | post_id 须出现在最近 feed 中 | 字段较少，缺统计明细 |
| fetch_post_details | fetch_user_posts（已知作者 username） | 必须先取得作者 username | 多一次调用，帖子对象字段较少 |
| fetch_post_comments | 无替代 | — | 评论无替代来源，失败直接 STOP |
| fetch_comment_replies | 无替代 | — | 同上 |
| fetch_home_feed | fetch_popular_feed | 用户接受热门替代推荐 | 排序逻辑不同 |
| fetch_popular_feed | fetch_home_feed | 用户接受首页替代 | 排序逻辑不同 |
| fetch_subreddit_feed | fetch_subreddit_post_channels | 用户接受频道数据替代 | 字段较少，频道维度 |
| fetch_subreddit_info | fetch_subreddit_style | 用户接受样式信息替代 | 缺版块统计信息 |
| fetch_user_profile | fetch_search_typeahead（已知 username） | 用户名足够独特 | 字段更少，可能命中重名 |
| fetch_user_posts | fetch_dynamic_search（search_type=post + 用户名关键词） | 搜索结果可能不完全匹配 | 非精确用户帖子列表 |
| fetch_dynamic_search | fetch_search_typeahead | 仅补全建议，非完整搜索 | 无完整搜索结果 |
| fetch_community_highlights | fetch_subreddit_feed | 用户接受版块 Feed 替代 | 非精选亮点，为普通 Feed |
| fetch_trending_searches | fetch_popular_feed | 用户接受热门帖子替代 | 无搜索趋势，为热门帖子 |

---

## 5. 路径合法性硬校验

> 所有端点的合法路径以 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 为唯一可信源。
> Agent **必须**在调用 API 前对照 `endpoints_whitelist.yaml` 逐字符核对路径，未在清单中的路径**禁止调用**。

---

## 6. SKILL 更新机制（版本检查 + ClawHub / SkillHub 更新）

> 完整流程见 [`update.md`](./update.md)。本节给出关键索引：

### 何时建议用户更新
- ✅ 合法路径（已通过 §3.1(A) 自检）持续返回 **404 / 410**
- ✅ 多个端点连续返回 410（路由批量下线）
- ✅ 上游响应字段结构与 reference OUT 表明显不一致
- ✅ 用户主动询问"版本/更新"
- ✅ 距上次成功调用已超过 30 天

### 何时**禁止**建议更新
- ❌ 收到 401（鉴权错）、402（余额）、403（权限）、网络/DNS 错——这些**不是** SKILL 版本问题
- ❌ §3.1(A) 自检**失败**——这是 Agent 臆造路径，不是 SKILL 过时

### 更新通道（按优先级）
1. **国内首选 ⭐⭐⭐**：`skillhub upgrade maxhub-reddit`（腾讯云 CDN 加速 + 安全审计）
   - Web 入口：https://skillhub.cn/skills/maxhub-reddit
2. **国际主源 ⭐⭐⭐**：`clawhub upgrade maxhub-reddit`
3. **降级方案**：`git pull` 仓库 https://github.com/XieWxx/maxhub-api-skills

### 当前版本
- 读取 [`../_meta.json`](../_meta.json) 中的 `version` 字段（当前：`3.7.2`）

### Agent 推荐话术（详见 [`update.md` § 4](./update.md#4-agent-推荐对话话术)）
- 场景 A：合法路径 404 → 建议升级
- 场景 B：用户问版本 → 给出当前版本 + 检查方法
- 场景 C：批量 410 → 强制升级提示
