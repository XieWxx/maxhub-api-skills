# Param & Field Mapping Index / 参数与字段映射索引

Skill: `maxhub-xiaohongshu` · Base URL: `https://www.aconfig.cn` · Version: `3.7.2`

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

1. **路径禁止臆造**：所有路径必须逐字符匹配 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml)；不在清单中 → **STOP**，禁止"换一个版本试试"、"改一改路径段试试"、"把 app_v2 改成 web_v2 试探"。
2. **404 / 400 必须先做防臆造自检**：见 [§ 3.1](#-31-防臆造自检清单404--400-处理前置步骤)，绕过自检直接重试或改路径都属于违反防臆造红线。
3. **只读 Skill 无写入操作**：本 skill 全部 37 个端点均为 **GET 只读**，不存在写入/删除/修改操作；用户请求写入类操作必须直接告知不支持。
4. **读取端点 5xx 重试 ≤ 1 次**：所有端点均为只读，5xx 可重试 1 次。
5. **找不到能力必须 STOP 并告知用户**：用户请求小红书不支持的能力（见下方"不支持能力清单"）→ 直接告知该 skill 不支持，**禁止**用其他端点拼凑伪造结果。
6. **替换/降级前必须显式告知用户**：例如"由于 X 失败，已切换到 Y，数据完整度可能下降"；禁止静默降级。
7. **404 / 410 强制 STOP**：禁止 Agent 自行修改路径段后重试。**自检通过 + 持续 404** 时才建议用户更新 SKILL（详见 [`update.md`](./update.md)）。
8. **业务 `code != 0` 不重试**：业务错误（配额、合规、权限）不会因重试改变，必须读 `message_zh` 报告用户。
9. **仅 404 / 410 + 自检通过**才建议用户更新 SKILL：401 / 402 / 403 / 网络错**不是** SKILL 版本问题，禁止误导用户更新。
10. **oneOf 逻辑必须遵守**：`note_id` 与 `share_text` 二选一、`user_id` 与 `share_text` 二选一，同时传则以 ID 为准，但**禁止都不传**。

---

## 0.1 ❌ 本 skill 不支持的能力 (Out of Scope)

> 用户请求以下功能时，**直接告知不支持并 STOP**。**禁止**用现有 37 个端点"拼凑"或"模拟"以下能力：

| 不支持的能力 | 说明 |
|------------|------|
| 发布笔记 / 删笔记 | 无写入端点 |
| 点赞 / 取消点赞 | 无社交互动写入端点 |
| 评论 / 删评论 | 仅支持读评论，无写入端点 |
| 关注 / 取消关注 | 仅支持读用户信息，无社交写入端点 |
| 私信 / DM | 无私信端点 |
| 收藏 / 取消收藏 | 仅支持读收藏列表，无写入端点 |
| 修改用户资料 / 头像 | 无修改端点 |
| 充值 / 计费查询 / 配额查询 | 在 https://www.aconfig.cn 控制台查询 |
| OAuth 用户授权操作 | 本 skill 仅支持 API Key 模式 |
| 实时直播 / WebSocket 流 | 无实时流端点 |
| 购物 / 下单 / 支付 | 仅支持读商品信息，无交易端点 |

> 遇到上述请求 → 直接回复用户："本 skill 暂不支持此能力，建议在小红书 App 中操作"，**禁止**用 get_note_detail / search_notes 等端点伪造结果。

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
| **note.md** |||||
| get_image_note_detail | 用 note_id/分享链接 取图文笔记详情 | note.md | GET | low |
| get_video_note_detail | 用 note_id/分享链接 取视频笔记详情 | note.md | GET | low |
| get_note_comments | 用 note_id/分享链接 取笔记一级评论（App V2） | note.md | GET | low |
| get_note_sub_comments | 用 comment_id 取二级评论回复（App V2） | note.md | GET | low |
| fetch_feed_notes | 用 note_id 取笔记详情 + 关联推荐（Web V2 V1） | note.md | GET | low |
| fetch_feed_notes_v2 | 用 note_id 取笔记详情 + 关联推荐（Web V2 V2） | note.md | GET | low |
| fetch_note_comments_web_v2 | 用 note_id 取笔记评论（Web V2） | note.md | GET | low |
| fetch_sub_comments_web_v2 | 用 note_id+comment_id 取子评论（Web V2） | note.md | GET | low |
| fetch_note_detail | 用 note_id+xsec_token 取笔记详情（Web V3） | note.md | GET | low |
| fetch_note_comments_web_v3 | 用 note_id+xsec_token 取笔记评论（Web V3） | note.md | GET | low |
| fetch_sub_comments_web_v3 | 用 note_id+root_comment_id+xsec_token 取子评论（Web V3） | note.md | GET | low |
| **user.md** |||||
| get_user_info | 用 user_id/分享链接 取用户信息（App V2） | user.md | GET | low |
| get_user_posted_notes | 用 user_id/分享链接 取用户笔记列表（App V2） | user.md | GET | low |
| get_user_faved_notes | 用 user_id/分享链接 取用户收藏列表（App V2） | user.md | GET | low |
| fetch_home_notes_app | 用 user_id 取用户笔记列表（Web V2） | user.md | GET | low |
| fetch_user_info_app | 用 user_id 取 App 用户信息（Web V2） | user.md | GET | low |
| fetch_user_info | 用 user_id 取用户信息（Web V3） | user.md | GET | low |
| fetch_user_notes | 用 user_id 取用户笔记列表（Web V3） | user.md | GET | low |
| **search.md** |||||
| search_notes | 用 keyword 搜索笔记（App V2） | search.md | GET | low |
| search_users | 用 keyword 搜索用户（App V2） | search.md | GET | low |
| search_images | 用 keyword 搜索图片（App V2） | search.md | GET | low |
| search_products | 用 keyword 搜索商品（App V2） | search.md | GET | low |
| search_groups | 用 keyword 搜索群聊（App V2） | search.md | GET | low |
| fetch_hot_list | 取小红书热榜（Web V2，无参数） | search.md | GET | low |
| fetch_search_notes | 用 keyword 搜索笔记（Web V3） | search.md | GET | low |
| fetch_search_users | 用 keyword 搜索用户（Web V3） | search.md | GET | low |
| fetch_trending | 取热搜词（Web V3，无参数） | search.md | GET | low |
| fetch_search_suggest | 取搜索联想词（Web V3） | search.md | GET | low |
| fetch_homefeed | 取首页推荐 Feed（Web V3） | search.md | GET | low |
| fetch_homefeed_categories | 取首页分类列表（Web V3，无参数） | search.md | GET | low |
| **product.md** |||||
| get_product_detail | 用 sku_id 取商品详情（App V2） | product.md | GET | low |
| get_product_review_overview | 用 sku_id 取商品评论总览（App V2） | product.md | GET | low |
| get_product_reviews | 用 sku_id 取商品评论列表（App V2） | product.md | GET | low |
| get_product_recommendations | 用 sku_id 取商品推荐列表（App V2） | product.md | GET | low |
| get_topic_info | 用 page_id 取话题详情（App V2） | product.md | GET | low |
| get_topic_feed | 用 page_id 取话题笔记列表（App V2） | product.md | GET | low |
| get_creator_inspiration_feed | 取创作者推荐灵感列表（App V2） | product.md | GET | low |
| get_creator_hot_inspiration_feed | 取创作者热点灵感列表（App V2） | product.md | GET | low |

---

## 2. 字段流字典 (Field Flow Dictionary)

> 当用户需要的数据需要"先 A 再 B"才能取到时，查此表确认字段如何在端点间传递，避免 Agent 臆造字段名或路径。

### `note_id` — 笔记 ID（24 位 hex 字符串）
- **可从这些端点产出（OUT）**：
  - `search_notes` → `$.data.items[].note_id` / `$.data.notes[].id`
  - `fetch_search_notes` → `$.data.items[].note_id`
  - `fetch_homefeed` → `$.data.items[].note_id`
  - `get_user_posted_notes` → `$.data.data.notes[].note_id`
  - `fetch_user_notes` → `$.data.notes[].note_id`
  - `fetch_home_notes_app` → `$.data.notes[].note_id`
  - `get_topic_feed` → `$.data.notes[].note_id`
  - `fetch_feed_notes` / `fetch_feed_notes_v2` → `$.data.note_id`（回显）
- **可作为输入（IN）**：
  - `get_image_note_detail` / `get_video_note_detail`（与 share_text 二选一）
  - `get_note_comments`（与 share_text 二选一）
  - `fetch_feed_notes` / `fetch_feed_notes_v2`（必填）
  - `fetch_note_comments_web_v2` / `fetch_note_comments_web_v3`（必填）
  - `fetch_note_detail`（必填，需同时传 xsec_token）
  - `get_topic_info`（可选，从笔记跳转话题时传）

### `user_id` — 用户 ID（24 位 hex 字符串）
- **可从这些端点产出（OUT）**：
  - `search_users` → `$.data.users[].user_id`
  - `fetch_search_users` → `$.data.users[].user_id`
  - `get_image_note_detail` / `get_video_note_detail` → `$.data.user.user_id`
  - `get_user_info` → `$.data.data.user_id`（回显）
  - `fetch_user_info` / `fetch_user_info_app` → `$.data.user_id`（回显）
  - `get_note_comments` → `$.data.data.comments[].user.user_id`
- **可作为输入（IN）**：
  - `get_user_info` / `get_user_posted_notes` / `get_user_faved_notes`（与 share_text 二选一）
  - `fetch_home_notes_app` / `fetch_user_info_app` / `fetch_user_info` / `fetch_user_notes`（必填）

### `comment_id` / `root_comment_id` — 评论 ID
- **产出**：
  - `get_note_comments` → `$.data.data.comments[].comment_id`
  - `fetch_note_comments_web_v2` / `fetch_note_comments_web_v3` → `$.data.comments[].comment_id`
- **输入**：
  - `get_note_sub_comments` 的 `comment_id`（App V2 必填）
  - `fetch_sub_comments_web_v2` 的 `comment_id`（Web V2 必填）
  - `fetch_sub_comments_web_v3` 的 `root_comment_id`（Web V3 必填）

### `sku_id` — 商品 SKU ID
- **产出**：
  - `search_products` → `$.data.items[].sku_id`
- **输入**：
  - `get_product_detail` / `get_product_review_overview` / `get_product_reviews` / `get_product_recommendations`（均必填）

### `page_id` — 话题页面 ID
- **产出**：
  - `get_topic_info` → `$.data.page_id`（回显）
- **输入**：
  - `get_topic_info` / `get_topic_feed`（均必填）

### `keyword` — 搜索关键词
- **输入**：`search_notes` / `search_users` / `search_images` / `search_products` / `search_groups` / `fetch_search_notes` / `fetch_search_users` / `fetch_search_suggest`（均必填，fetch_search_suggest 可选）

### `cursor` / `cursor_score` — 分页游标（通用）
- **产出/输入**：所有支持分页的端点（同端点的下一次调用使用上次响应的游标值）
- **注意**：不同端点的游标语义不同（有的是字符串游标，有的是 note_id，有的是 JSON 对象），必须按各端点说明提取

### `xsec_token` — 安全令牌（Web V3 专用）
- **来源**：从小红书分享链接中提取
- **输入**：`fetch_note_detail` / `fetch_note_comments_web_v3` / `fetch_sub_comments_web_v3`（均必填）

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
| **404 Not Found** | 路由数据未找到 | • 路径不在白名单 / 上游已下线<br>• 资源（note_id/user_id 等）不存在或已删除 |
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
| **404** | 资源不存在（note_id/user_id 等） | **先做 §3.1 防臆造自检 (A)** → 通过后告知用户资源已删除或不存在，**STOP** | 0 | — |
| **410** | 上游已下线 | **先做 §3.1 防臆造自检 (A)** → 通过后 STOP，禁止改路径重试；若 SKILL 长期未更新，提示用户运行 §5 SKILL 更新检查 | 0 | 查 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) + §5 |
| **422** | 参数校验失败（如 oneOf 互斥同时传） | **先做 §3.1 防臆造自检 (B)** → 修正后重试 1 次 | ≤1 次 | 查端点 reference IN 表 |
| **429** | 限流 | 读 `Retry-After` 头退避；无该头时指数退避 + jitter；最多重试 2 次 | ≤2 次 | https://www.aconfig.cn |
| **500/502/503/504** | 上游故障 | 等 3 秒重试 1 次；仍失败走"端点替换矩阵" | ≤1 次 | — |
| **网络超时 / DNS 失败** | 网络异常 | **STOP**，向用户报告网络问题 | 0 | — |
| **HTTP 200 + `code != 0`** | 业务层错误 | 读 `message_zh` 告知，不重试 | 0 | — |

---

### § 3.1 防臆造自检清单（404 / 400 处理前置步骤）

> 收到 **404** 或 **400** 时，Agent **必须**先按对应清单完成自检。**自检不是可选的**——绕过自检直接重试或改路径都属于违反防臆造红线。

#### (A) 收到 **404** 时的自检清单 ⚠️ 防路径臆造

按顺序逐项检查，**任一项失败立即 STOP**：

1. **路径白名单逐字符比对**
   - 把刚才请求的完整路径（`/api/v1/xiaohongshu/<version>/<id>`）逐字符与 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 中的 `endpoints[].path` 对照
   - **是否完全相等？** 如果**不在清单中** → 这是 Agent 臆造路径，**STOP**，禁止任何"改 app_v2→web_v2 / 加路径段 / 拼接前缀"的尝试
2. **Method 比对**
   - 实际请求的 HTTP method 是否等于清单中的 `endpoints[].method`？
   - 如果不等 → STOP，禁止换 method 重试
3. **参数键名比对**
   - 实际请求的所有 query/body 键名是否都在该端点的 `required` ∪ `optional` 中？
   - 是否有 Agent 自己加的"看起来合理但清单没列"的参数？→ STOP
4. **资源 ID 来源溯源**
   - 请求中的 `note_id` / `user_id` / `comment_id` / `sku_id` 等是否真实来自之前某个端点的**响应字段**（json_path 可追溯）？
   - 如果是 Agent 自己生成 / 编造的字符串 → STOP，告知用户资源不存在
5. **若以上全通过** → 才可以判定"上游资源真的不存在"，向用户报告"资源已删除或不存在"，**STOP**（禁止改路径重试）

#### (B) 收到 **400 / 422** 时的自检清单 ⚠️ 防参数与传参方式臆造

按顺序逐项检查，**任一项失败必须修正**：

1. **参数名严格比对**
   - 实际请求的所有键名是否**逐字符**等于该端点 IN 表中的 `name`？
   - 是否有大小写错（`noteId` vs `note_id`）、复数错（`users` vs `user`）、缩写错（`uid` vs `user_id`）？
2. **必填项齐全**
   - 该端点 IN 表中所有标 `yes` 的参数是否都已传？
   - `oneOf(note_id, share_text)` / `oneOf(user_id, share_text)` 类型是否做到"至少传一个"？
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
| 401 鉴权错（含令牌过期/未激活/用户不存在） | 0 | — | STOP |
| **402 余额不足 / 付费路由** | 0 | — | STOP，告知用户充值或升级 |
| 403 权限/账户禁用/邮箱未验证 | 0 | — | STOP，按子场景给修复指引 |
| 404 / 410 路径错或资源不存在 | 0 | — | ❌ 不改路径，可走"端点替换矩阵" |
| 429 限流 | 2 次 | Retry-After 优先；否则 `min(8s, 2^n) * (0.5 + random*0.5)` | ❌ |
| 5xx 上游错 | 1 次 | 固定 3s | ✅ 走"端点替换矩阵" |
| 网络超时 / DNS | 0 | — | STOP |
| 业务 `code != 0` | 0 | — | 读 `message_zh` 报告，不重试 |

### 降级策略原则
1. **数据完整度降级**：详情接口失败 → 列表接口取相同字段（少几个字段，必须显式告知用户）
2. **版本降级**：App V2 端点失败 → Web V2 / Web V3 同功能端点（需注意参数差异，如 Web V3 需要 xsec_token）
3. **维度降级**：用户详情失败 → 改用 search_users 取概要（必须 keyword 上下文）

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
> - 本 skill 全部为只读端点，无写入操作

| 首选端点 | 替代端点 | 替代条件 | 数据差异 |
|---------|---------|---------|---------|
| get_image_note_detail | fetch_note_detail（Web V3） | 需有 xsec_token | 需额外传 xsec_token；字段结构可能不同 |
| get_image_note_detail | fetch_feed_notes / fetch_feed_notes_v2（Web V2） | 有 note_id | 返回笔记+关联推荐，字段可能较少 |
| get_video_note_detail | fetch_note_detail（Web V3） | 需有 xsec_token | 同上 |
| get_note_comments | fetch_note_comments_web_v2（Web V2） | 有 note_id | Web V2 不支持 sort_strategy/pageArea |
| get_note_comments | fetch_note_comments_web_v3（Web V3） | 有 note_id + xsec_token | 需额外传 xsec_token |
| get_note_sub_comments | fetch_sub_comments_web_v2（Web V2） | 有 note_id + comment_id | Web V2 参数名相同 |
| get_note_sub_comments | fetch_sub_comments_web_v3（Web V3） | 有 note_id + root_comment_id + xsec_token | 参数名不同（comment_id→root_comment_id），需 xsec_token |
| get_user_info | fetch_user_info_app（Web V2） | 有 user_id（不支持 share_text） | 不支持 share_text 入参 |
| get_user_info | fetch_user_info（Web V3） | 有 user_id（不支持 share_text） | 同上 |
| get_user_posted_notes | fetch_home_notes_app（Web V2） | 有 user_id | 不支持 share_text |
| get_user_posted_notes | fetch_user_notes（Web V3） | 有 user_id | 支持 num 参数控制返回数量 |
| search_notes | fetch_search_notes（Web V3） | 有 keyword | Web V3 参数更少（无 time_filter/ai_mode 等） |
| search_users | fetch_search_users（Web V3） | 有 keyword | Web V3 参数更少 |
| fetch_note_detail | get_image_note_detail / get_video_note_detail（App V2） | 有 note_id 或 share_text | App V2 不需要 xsec_token；需区分图文/视频 |
| fetch_hot_list | fetch_trending（Web V3） | 无参数 | trending 是热搜词，hot_list 是热榜，语义不同 |

---

## 5. 路径合法性硬校验

> 所有端点的合法路径以 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 为唯一可信源。
> Agent **必须**在调用 API 前对照 `endpoints_whitelist.yaml` 逐字符核对路径，未在清单中的路径**禁止调用**。

---

## 6. SKILL 更新机制（版本检查 + SkillHub / ClawHub 更新）

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
1. **国内首选 ⭐⭐⭐**：`skillhub upgrade maxhub-xiaohongshu`（腾讯云 CDN 加速 + 安全审计）
   - Web 入口：https://skillhub.cn/skills/maxhub-xiaohongshu
2. **国际主源 ⭐⭐⭐**：`clawhub upgrade maxhub-xiaohongshu`
3. **降级方案**：`git pull` 仓库 https://github.com/XieWxx/maxhub-api-skills

### 当前版本
- 读取 [`../_meta.json`](../_meta.json) 中的 `version` 字段（当前：`3.7.2`）

### Agent 推荐话术（详见 [`update.md` § 4](./update.md#4-agent-推荐对话话术)）
- 场景 A：合法路径 404 → 建议升级
- 场景 B：用户问版本 → 给出当前版本 + 检查方法
- 场景 C：批量 410 → 强制升级提示
