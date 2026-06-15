# Param & Field Mapping Index / 参数与字段映射索引

Skill: `maxhub-lemon8` · Base URL: `https://www.aconfig.cn` · Version: `3.7.2`

> 本文件不重复端点完整说明（详见各 reference 文件），仅承担六个职能：
> 1. **全局红线 + 不支持能力清单**：防臆造的最强约束
> 2. **端点路由索引**：按 ID 快速定位 reference 文件
> 3. **字段流字典**：跨端点链式调用的字段索引
> 4. **错误处理总览 + 端点替换矩阵**：全 skill 共享的错误策略
> 5. **路径合法性硬校验**：以 `endpoints_whitelist.yaml` 为唯一可信源
> 6. **SKILL 更新机制**：版本检查 + SkillHub / ClawHub 更新，详见 [`update.md`](./update.md)

---

## 0. 🚨 全局红线 (Global Forbidden) — 强制约束

> 以下规则**最高优先级**，任何端点级 ERR 表都不得突破。

1. **路径禁止臆造**：所有路径必须逐字符匹配 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml)；不在清单中 → **STOP**，禁止"换一个版本试试"、"改一改路径段试试"、"把 app 改成 web 试探"。
2. **404 / 400 必须先做防臆造自检**：见 [§ 3.1](#-31-防臆造自检清单404--400-处理前置步骤)，绕过自检直接重试或改路径都属于违反防臆造红线。
3. **读取端点 5xx 重试 ≤ 1 次**：避免重复扣配额。
4. **找不到能力必须 STOP 并告知用户**：用户请求 Lemon8 不支持的能力（见下方"不支持能力清单"）→ 直接告知该 skill 不支持，**禁止**用其他端点拼凑伪造结果。
5. **user_id / item_id / forum_id 不可臆造**：均为纯数字 ID；Agent 不可自行编造。`user_id` 可从 `get_user_id` / `get_user_ids` 通过分享链接获取；`item_id` 可从 `get_item_id` / `get_item_ids` 获取。
6. **替换/降级前必须显式告知用户**：例如"由于 X 失败，已切换到 Y，数据完整度可能下降"；禁止静默降级。
7. **404 / 410 强制 STOP**：禁止 Agent 自行修改路径段后重试。**自检通过 + 持续 404** 时才建议用户更新 SKILL（详见 [`update.md`](./update.md)）。
8. **业务 `code != 0` 不重试**：业务错误（配额、合规、权限）不会因重试改变，必须读 `message_zh` 报告用户。
9. **仅 404 / 410 + 自检通过**才建议用户更新 SKILL：401 / 402 / 403 / 网络错**不是** SKILL 版本问题，禁止误导用户更新。
10. **POST 端点 body 使用 JSON 序列化**：`get_item_ids` / `get_user_ids` 的 `share_texts` 参数必须用语言原生 JSON 序列化库，禁止手拼 JSON 字符串。

---

## 0.1 ❌ 本 skill 不支持的能力 (Out of Scope)

> 用户请求以下功能时，**直接告知不支持并 STOP**。**禁止**用现有 16 个端点"拼凑"或"模拟"以下能力：

| 不支持的能力 | 说明 |
|------------|------|
| 发布/编辑/删除帖子 | 无写入端点 |
| 点赞 / 取消点赞 | 无社交互动写入端点 |
| 评论 / 删评论 | 仅支持读评论，无写入端点 |
| 关注 / 取消关注 | 无写入端点 |
| 发送私信 / DM | 无私信端点 |
| 修改用户资料 / 头像 | 无修改端点 |
| 充值 / 计费查询 / 配额查询 | 在 https://www.aconfig.cn 控制台查询 |
| OAuth 用户授权操作 | 本 skill 仅支持 API Key 模式 |
| 实时通知 / WebSocket 流 | 无实时流端点 |
| 直播 / Live | 无相关端点 |
| 电商 / 购物车 | 无相关端点 |

> 遇到上述请求 → 直接回复用户："本 skill 暂不支持此能力，建议在 Lemon8 官方应用中操作"，**禁止**用 fetch_user_profile / fetch_search 等端点伪造结果。

---

## 1. 端点路由索引 (Endpoint Routing Index)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| fetch_user_profile | 用 user_id 取用户信息（**链式终点**） | user.md | GET | low |
| fetch_user_follower_list | 用 user_id 取粉丝列表 | user.md | GET | low |
| fetch_user_following_list | 用 user_id 取关注列表 | user.md | GET | low |
| get_user_id | 用分享链接取 user_id（**链式入口**） | user.md | GET | low |
| get_user_ids | 用分享链接批量取 user_id | user.md | POST | low |
| fetch_post_detail | 用 item_id 取帖子详情（**链式终点**） | content.md | GET | low |
| fetch_post_comment_list | 用 group_id+item_id+media_id 取评论 | content.md | GET | low |
| fetch_discover_banners | 取发现页 Banner | content.md | GET | low |
| fetch_discover_tab | 取发现页主体内容 | content.md | GET | low |
| fetch_discover_tab_information_tabs | 取发现页 Editor's Picks | content.md | GET | low |
| fetch_hot_search_keywords | 取热搜关键词 | content.md | GET | low |
| fetch_topic_info | 用 forum_id 取话题信息 | content.md | GET | low |
| fetch_topic_post_list | 用话题参数取话题帖子列表 | content.md | GET | low |
| fetch_search | 搜索（**内容冷启动入口**） | content.md | GET | low |
| get_item_id | 用分享链接取 item_id（**链式入口**） | content.md | GET | low |
| get_item_ids | 用分享链接批量取 item_id | content.md | POST | low |

---

## 2. 字段流字典 (Field Flow Dictionary)

> 当用户需要的数据需要"先 A 再 B"才能取到时，查此表确认字段如何在端点间传递。

### `user_id` — 用户 ID（纯数字，如 `7217844966059656197`）
- **可从这些端点产出（OUT）**：
  - `get_user_id` → `$.data.user_id`（从分享链接提取）
  - `get_user_ids` → `$.data.user_ids[]`（批量提取）
  - `fetch_user_follower_list` → `$.data.followers[].user_id`（粉丝的 user_id）
  - `fetch_user_following_list` → `$.data.following[].user_id`（关注的 user_id）
  - `fetch_search`（search_tab=user）→ `$.data.users[].user_id`
  - `fetch_post_detail` → `$.data.author_id`（帖子作者）
- **可作为输入（IN）**：
  - `fetch_user_profile`
  - `fetch_user_follower_list`
  - `fetch_user_following_list`

### `item_id` — 帖子/作品 ID（纯数字，如 `7361926875709129222`）
- **可从这些端点产出（OUT）**：
  - `get_item_id` → `$.data.item_id`（从分享链接提取）
  - `get_item_ids` → `$.data.item_ids[]`（批量提取）
  - `fetch_topic_post_list` → `$.data.posts[].item_id`
  - `fetch_search` → `$.data.posts[].item_id`
  - `fetch_discover_tab` → `$.data.posts[].item_id`
- **可作为输入（IN）**：
  - `fetch_post_detail`
  - `fetch_post_comment_list`

### `group_id` / `media_id` — 帖子评论所需的辅助 ID
- **产出**：`fetch_post_detail` → `$.data.group_id` / `$.data.media_id`
- **输入**：`fetch_post_comment_list`（3 个必填参数之一）

### `forum_id` — 话题 ID（纯数字，如 `7174447913778593798`）
- **可从这些端点产出（OUT）**：
  - `fetch_post_detail` → `$.data.forum_id`（帖子所属话题）
  - `fetch_discover_tab_information_tabs` → `$.data.tabs[].forum_id`
  - `fetch_search`（search_tab=hashtag）→ `$.data.hashtags[].forum_id`
- **可作为输入（IN）**：
  - `fetch_topic_info`

### `category` / `category_parameter` / `hashtag_name` — 话题帖子列表参数
- **产出**：`fetch_topic_info` → `$.data.category` / `$.data.category_parameter` / `$.data.hashtag_name`
- **输入**：`fetch_topic_post_list`（3 个必填参数）

### `share_text` — 分享链接（Lemon8 URL）
- **产出**：用户直接提供（从 Lemon8 网页端或 APP 分享按钮获取）
- **输入**：`get_user_id` / `get_item_id`

### `cursor` / `max_cursor` / `max_behot_time` / `offset` — 分页参数（通用）
- **产出/输入**：各支持分页的端点（同端点的下一次调用使用上次响应的游标字段）

---

## 3. 全 skill 错误处理总览 (Error Handling Overview)

### HTTP 状态码权威定义（MaxHub API 官方）

> 以下为 MaxHub API 平台官方 HTTP 状态码定义。**Agent 必须**按此表语义判定错误类型，不要自行解读。

| HTTP 状态码 | 官方含义 | 细分场景 |
|------------|---------|---------|
| **400 Bad Request** | 请求格式错误或参数不正确 | • 参数缺失 / 类型错 / 格式不符 / 互斥参数同时传 |
| **401 Unauthorized** | API 令牌身份无效 | • API 令牌无效 / 缺失 / 过期 / 未激活 / 用户不存在 |
| **402 Payment Required** | 余额不足 / 付费路由 | • 余额不足，允许免费额度 / 不接受免费额度 |
| **403 Forbidden** | 已认证但无权限 | • 缺少路由访问权限 / 账户已禁用 / 邮箱未验证 / Token 权限不足 |
| **404 Not Found** | 路由数据未找到 | • 路径不在白名单 / 上游已下线 / 资源不存在或已删除 |
| **429 Too Many Requests** | 请求速率超限 | • 请求速度过快（读 `Retry-After` 头退避） |
| **500 Internal Server Error** | 服务器内部错误 | • 上游异常（含 502/503/504） |

### 错误码 → 行动 → 修复链接（决策表）

> ⚠️ **400 / 404 强制自检前置**：在按下表"行动"列处理 400 或 404 之前，**必须先完成"防臆造自检清单"**（见下方 §3.1）。自检通过后再走重试或 STOP。

| HTTP 码 | 子场景 | 行动 | 重试 | 修复链接 / 文档 |
|--------|-------|------|------|---------------|
| **400** | 参数错 | **先做 §3.1 防臆造自检 (B)** → 修正参数后重试 1 次；仍失败 STOP | ≤1 次 | 查端点 reference IN 表 |
| **401** | API 令牌无效 / 缺失 / 过期 | **STOP**，提示用户检查或更换 API Key | 0 | https://www.aconfig.cn |
| **402** | 余额不足 | 告知用户充值 | 0 | https://www.aconfig.cn |
| **403** | 权限不足 / 账户禁用 / 邮箱未验证 | **STOP**，按子场景给修复指引 | 0 | https://www.aconfig.cn |
| **404** | 路径不在白名单（疑似臆造） | **先做 §3.1 防臆造自检 (A)** → 自检失败则 STOP | 0 | 查 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) |
| **404** | 资源不存在 | **先做 §3.1 防臆造自检 (A)** → 通过后告知用户资源已删除或不存在 | 0 | — |
| **410** | 上游已下线 | **先做 §3.1 防臆造自检 (A)** → 通过后 STOP；提示更新 SKILL | 0 | 查 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) + §6 |
| **422** | 参数校验失败 | **先做 §3.1 防臆造自检 (B)** → 修正后重试 1 次 | ≤1 次 | 查端点 reference IN 表 |
| **429** | 限流 | 读 `Retry-After` 头退避；最多重试 2 次 | ≤2 次 | https://www.aconfig.cn |
| **500/502/503/504** | 上游故障 | 等 3 秒重试 1 次；仍失败走端点替换矩阵 | ≤1 次 | — |
| **网络超时 / DNS** | 网络异常 | **STOP**，向用户报告 | 0 | — |
| **HTTP 200 + `code != 0`** | 业务层错误 | 读 `message_zh` 报告，不重试 | 0 | — |

---

### § 3.1 防臆造自检清单（404 / 400 处理前置步骤）

> 收到 **404** 或 **400** 时，Agent **必须**先按对应清单完成自检。**自检不是可选的**——绕过自检直接重试或改路径都属于违反防臆造红线。

#### (A) 收到 **404** 时的自检清单 ⚠️ 防路径臆造

按顺序逐项检查，**任一项失败立即 STOP**：

1. **路径白名单逐字符比对**
   - 把刚才请求的完整路径（`/api/v1/lemon8/app/<id>`）逐字符与 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 中的 `endpoints[].path` 对照
   - **是否完全相等？** 如果**不在清单中** → 这是 Agent 臆造路径，**STOP**，禁止任何"改 app→web / 加路径段 / 拼接前缀"的尝试
2. **Method 比对**
   - 实际请求的 HTTP method 是否等于清单中的 `endpoints[].method`？
   - 如果不等 → STOP，禁止换 method 重试
3. **参数键名比对**
   - 实际请求的所有 query/body 键名是否都在该端点的 `required` ∪ `optional` 中？
   - 是否有 Agent 自己加的"看起来合理但清单没列"的参数？→ STOP
4. **资源 ID 来源溯源**
   - 请求中的 `user_id` / `item_id` / `forum_id` 等是否真实来自之前某个端点的**响应字段**（json_path 可追溯）？
   - 如果是 Agent 自己生成 / 编造的字符串 → STOP，告知用户资源不存在
5. **若以上全通过** → 才可以判定"上游资源真的不存在"，向用户报告"资源已删除或不存在"，**STOP**（禁止改路径重试）

#### (B) 收到 **400 / 422** 时的自检清单 ⚠️ 防参数与传参方式臆造

按顺序逐项检查，**任一项失败必须修正**：

1. **参数名严格比对**
   - 实际请求的所有键名是否**逐字符**等于该端点 IN 表中的 `name`？
   - 是否有大小写错（`ItemId` vs `item_id`）、复数错（`items` vs `item_id`）、缩写错？
2. **必填项齐全**
   - 该端点 IN 表中所有标 `yes` 的参数是否都已传？
   - `fetch_post_comment_list` 需要 3 个必填参数：`group_id` + `item_id` + `media_id`
   - `fetch_topic_post_list` 需要 3 个必填参数：`category` + `category_parameter` + `hashtag_name`
3. **类型与格式严格匹配**
   - string 是否被错传成了 number？数组是否被传成 JSON 字符串？
   - POST 端点的 body 参数必须使用 JSON 序列化
4. **传参方式正确**
   - GET 端点：参数应放在 query string，不应放在 request body
   - POST 端点：参数应放在 request body（JSON），不应放在 query string
   - Authorization 头格式是否为 `Bearer $MAXHUB_API_KEY`？
5. **没有臆造参数**
   - 是否传入了 IN 表中**未列出**的"看起来合理但 API 不接受"的参数？
   - 这类参数即使被忽略也可能触发 400
6. **若以上全通过** → 才可以按错误响应中的 `message_zh` 进一步排查；如仍无法定位 → STOP，向用户报告参数错误

> 💡 **自检方法**：建议在响应解析阶段把请求 URL、headers、body 与 `endpoints_whitelist.yaml` + reference IN 表做一次结构化对比，再决定是否重试。

---

### 重试策略矩阵

| 错误类型 | 最大重试 | 退避算法 | 是否换端点 |
|---------|---------|---------|----------|
| 400 / 422 参数错 | 1 次（修正参数后） | 立即 | ❌ 不换端点 |
| 401 鉴权错 | 0 | — | STOP |
| 402 余额不足 | 0 | — | STOP |
| 403 权限/账户问题 | 0 | — | STOP |
| 404 / 410 路径错或资源不存在 | 0 | — | ❌ 不改路径，可走端点替换矩阵 |
| 429 限流 | 2 次 | Retry-After 优先；否则 `min(8s, 2^n) * (0.5 + random*0.5)` | ❌ |
| 5xx 上游错 | 1 次 | 固定 3s | ✅ 走端点替换矩阵 |
| 网络超时 / DNS | 0 | — | STOP |
| 业务 `code != 0` | 0 | — | 读 `message_zh` 报告 |

### 降级策略原则
1. **数据完整度降级**：详情接口失败 → 列表接口取相同字段
2. **维度降级**：用户详情失败 → `fetch_search`（search_tab=user）取概要
3. **入口降级**：`get_item_id` 失败 → 尝试 `fetch_search` 搜索帖子

### 链式调用容错原则
- **第 1 步失败** → 整条链 **STOP**
- **中间步失败** → 返回截止前已有的数据 + **显式告知**用户缺失了哪一段
- **最后步失败** → 返回前序数据 + 告知最终步未完成

---

## 4. 端点替换矩阵 (Endpoint Substitution Matrix)

> 当首选端点持续 5xx / 数据为空时，按此表寻找替代。
> **强约束**：替换前必须显式告知用户；替换次数 ≤ 1 次

| 首选端点 | 替代端点 | 替代条件 | 数据差异 |
|---------|---------|---------|---------|
| fetch_user_profile | fetch_search（search_tab=user） | 已知用户名关键词 | 搜索结果字段较少，可能命中重名 |
| get_user_id | get_user_ids（单个链接） | 单个分享链接 | 批量接口开销略大，但功能等价 |
| get_item_id | get_item_ids（单个链接） | 单个分享链接 | 同上 |
| fetch_post_detail | fetch_search（搜索帖子标题关键词） | 已知帖子内容关键词 | 搜索结果字段较少，需匹配确认 |
| fetch_topic_post_list | fetch_search（search_tab=hashtag） | 已知 hashtag_name | 搜索结果可能更广，非话题限定 |
| fetch_discover_tab | fetch_discover_tab_information_tabs | 需要发现页内容 | Editor's Picks 仅为子集 |
| fetch_search | fetch_topic_post_list | 已知具体话题参数 | 仅限话题内帖子 |
| fetch_user_follower_list | 无替代 | — | 失败 STOP |
| fetch_user_following_list | 无替代 | — | 失败 STOP |
| fetch_post_comment_list | 无替代 | — | 评论无替代来源，失败直接 STOP |
| fetch_topic_info | 无替代 | — | 失败 STOP |
| fetch_discover_banners | 无替代 | — | 失败 STOP |
| fetch_hot_search_keywords | 无替代 | — | 失败 STOP |

---

## 5. 路径合法性硬校验

> 所有端点的合法路径以 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 为唯一可信源。
> Agent **必须**在调用 API 前对照 `endpoints_whitelist.yaml` 逐字符核对路径，未在清单中的路径**禁止调用**。

---

## 6. SKILL 更新机制（版本检查 + SkillHub / ClawHub 更新）

> 完整流程见 [`update.md`](./update.md)。本节给出关键索引：

### 何时建议用户更新
- ✅ 合法路径（已通过 §3.1(A) 自检）持续返回 **404 / 410**
- ✅ 多个端点连续返回 410
- ✅ 上游响应字段结构与 reference OUT 表明显不一致
- ✅ 用户主动询问"版本/更新"
- ✅ 距上次成功调用已超过 30 天

### 何时**禁止**建议更新
- ❌ 收到 401 / 402 / 403 / 网络/DNS 错
- ❌ §3.1(A) 自检**失败**

### 更新通道（按优先级）
1. **国内首选 ⭐⭐⭐**：`skillhub upgrade maxhub-lemon8`
2. **国际主源 ⭐⭐⭐**：`clawhub upgrade maxhub-lemon8`
3. **降级方案**：`git pull` 仓库 https://github.com/XieWxx/maxhub-api-skills

### 当前版本
- 读取 [`../_meta.json`](../_meta.json) 中的 `version` 字段（当前：`3.7.2`）

### Agent 推荐话术（详见 [`update.md` § 4](./update.md#4-agent-推荐对话话术)）
- 场景 A：合法路径 404 → 建议升级
- 场景 B：用户问版本 → 给出当前版本 + 检查方法
- 场景 C：批量 410 → 强制升级提示
