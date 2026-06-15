# Param & Field Mapping Index / 参数与字段映射索引

Skill: `maxhub-pipixia` · Base URL: `https://www.aconfig.cn` · Version: `3.7.2`

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

1. **路径禁止臆造**：所有路径必须逐字符匹配 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml)；不在清单中 → **STOP**，禁止"换一个版本试试"、"改一改路径段试试"。
2. **404 / 400 必须先做防臆造自检**：见 [§ 3.1](#-31-防臆造自检清单404--400-处理前置步骤)，绕过自检直接重试或改路径都属于违反防臆造红线。
3. **写入操作禁止替代**：`fetch_increase_post_view_count` 失败时，禁止用读端点"模拟"结果；必须 STOP 并让用户重新确认参数。
4. **写入端点 5xx 重试 ≤ 1 次**：避免重复操作。读端点可重试 1 次。
5. **找不到能力必须 STOP 并告知用户**：用户请求皮皮虾不支持的能力（见下方"不支持能力清单"）→ 直接告知该 skill 不支持，**禁止**用其他端点拼凑伪造结果。
6. **替换/降级前必须显式告知用户**：例如"由于 X 失败，已切换到 Y，数据完整度可能下降"；禁止静默降级。
7. **404 / 410 强制 STOP**：禁止 Agent 自行修改路径段后重试。**自检通过 + 持续 404** 时才建议用户更新 SKILL（详见 [`update.md`](./update.md)）。
8. **业务 `code != 0` 不重试**：业务错误（配额、合规、权限）不会因重试改变，必须读 `message_zh` 报告用户。
9. **仅 404 / 410 + 自检通过**才建议用户更新 SKILL：401 / 402 / 403 / 网络错**不是** SKILL 版本问题，禁止误导用户更新。

---

## 0.1 ❌ 本 skill 不支持的能力 (Out of Scope)

> 用户请求以下功能时，**直接告知不支持并 STOP**。**禁止**用现有 17 个端点"拼凑"或"模拟"以下能力：

| 不支持的能力 | 说明 |
|------------|------|
| 发布/删除作品 | 无写入端点（浏览数增加除外） |
| 点赞 / 取消点赞 | 无社交互动写入端点 |
| 评论 / 删评论 | 仅支持读评论，无写入端点 |
| 关注 / 取消关注 | 仅支持读关注/粉丝列表 |
| 转发 / 分享操作 | 无写入端点 |
| 发送私信 / DM | 无私信端点 |
| 修改用户资料 / 头像 | 无修改端点 |
| 充值 / 计费查询 / 配额查询 | 在 https://www.aconfig.cn 控制台查询 |
| OAuth 用户授权操作 | 本 skill 仅支持 API Key 模式 |
| 实时直播 / WebSocket 流 | 无实时流端点 |
| 视频下载 / 无水印解析 | 无下载端点 |

> 遇到上述请求 → 直接回复用户："本 skill 暂不支持此能力，建议在皮皮虾官方应用中操作"，**禁止**用 fetch_post_detail 等端点伪造结果。

---

## 1. 端点路由索引 (Endpoint Routing Index)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| fetch_post_detail | 用 cell_id 取作品完整详情（链式起点） | post.md | GET | low |
| fetch_increase_post_view_count | 增加作品浏览数（写入操作） | post.md | GET | **medium ⚠️** |
| fetch_post_statistics | 用 cell_id 取作品统计数据 | post.md | GET | low |
| fetch_post_comment_list | 用 cell_id 取作品评论列表 | post.md | GET | low |
| fetch_home_feed | 取首页推荐 Feed | post.md | GET | low |
| fetch_home_short_drama_feed | 取首页短剧推荐 | post.md | GET | low |
| fetch_search | 按关键词搜索（综合/视频/图文/用户/话题） | post.md | GET | low |
| fetch_hot_search_words | 取热搜词条 | post.md | GET | low |
| fetch_hot_search_board_list | 取热搜榜单列表 | post.md | GET | low |
| fetch_hot_search_board_detail | 用 block_type 取热搜榜单详情 | post.md | GET | low |
| fetch_hashtag_detail | 用 hashtag_id 取话题详情 | post.md | GET | low |
| fetch_hashtag_post_list | 用 hashtag_id 取话题作品列表 | post.md | GET | low |
| fetch_short_url | 生成短连接 | post.md | GET | low |
| fetch_user_info | 用 user_id 取用户信息 | user.md | GET | low |
| fetch_user_post_list | 用 user_id 取用户作品列表 | user.md | GET | low |
| fetch_user_follower_list | 用 user_id 取用户粉丝列表 | user.md | GET | low |
| fetch_user_following_list | 用 user_id 取用户关注列表 | user.md | GET | low |

---

## 2. 字段流字典 (Field Flow Dictionary)

> 当用户需要的数据需要"先 A 再 B"才能取到时，查此表确认字段如何在端点间传递，避免 Agent 臆造字段名或路径。

### `cell_id` — 作品 ID（纯数字字符串）
- **可从这些端点产出（OUT）**：
  - `fetch_home_feed` → `$.data.data[].cell_id`（首页推荐）
  - `fetch_search` → `$.data.data[].cell_id`（搜索结果）
  - `fetch_hashtag_post_list` → `$.data.data[].cell_id`（话题作品）
  - `fetch_user_post_list` → `$.data.data[].cell_id`（用户作品）
- **可作为输入（IN）**：
  - `fetch_post_detail`
  - `fetch_increase_post_view_count`
  - `fetch_post_statistics`
  - `fetch_post_comment_list`

### `user_id` — 用户 ID（纯数字字符串）
- **可从这些端点产出（OUT）**：
  - `fetch_post_detail` → `$.data.user.user_id`（作品作者）
  - `fetch_post_comment_list` → `$.data.comments[].user.user_id`（评论者）
  - `fetch_search`（search_type=4）→ `$.data.data[].user_id`（用户搜索）
  - `fetch_user_follower_list` → `$.data.data[].user_id`（粉丝）
  - `fetch_user_following_list` → `$.data.data[].user_id`（关注）
- **可作为输入（IN）**：
  - `fetch_user_info`
  - `fetch_user_post_list`
  - `fetch_user_follower_list`
  - `fetch_user_following_list`

### `hashtag_id` — 话题 ID（纯数字字符串）
- **可从这些端点产出（OUT）**：
  - `fetch_search`（search_type=5）→ `$.data.data[].hashtag_id`（话题搜索）
  - `fetch_hashtag_detail` → `$.data.hashtag_id`（话题详情回显）
- **可作为输入（IN）**：
  - `fetch_hashtag_detail`
  - `fetch_hashtag_post_list`

### `block_type` — 热搜榜单类型（整数）
- **可从这些端点产出（OUT）**：
  - `fetch_hot_search_board_list` → `$.data.data[].block_type`
- **可作为输入（IN）**：
  - `fetch_hot_search_board_detail`

### `cursor / offset` — 分页游标（通用）
- **产出/输入**：所有支持分页的端点
  - `fetch_home_feed`：使用 `cursor`，下一页从 `$.data.loadmore_cursor` 取
  - `fetch_post_comment_list`：使用 `offset`，下一页从 `$.data.offset` 取
  - `fetch_search`：使用 `offset`，下一页从 `$.data.offset` 取
  - `fetch_hashtag_post_list`：使用 `cursor`，下一页从 `$.data.loadmore_cursor` 取
  - `fetch_user_post_list`：使用 `cursor`，下一页从 `$.data.loadmore_cursor` 取
  - `fetch_user_follower_list`：使用 `cursor`，下一页从 `$.data.loadmore_cursor` 取
  - `fetch_user_following_list`：使用 `cursor`，下一页从 `$.data.loadmore_cursor` 取

---

## 3. 全 skill 错误处理总览 (Error Handling Overview)

### HTTP 状态码权威定义（MaxHub API 官方）

> 以下为 MaxHub API 平台官方 HTTP 状态码定义。**Agent 必须**按此表语义判定错误类型，不要自行解读。

| HTTP 状态码 | 官方含义 | 细分场景 |
|------------|---------|---------|
| **400 Bad Request** | 请求格式错误或参数不正确 | • 参数缺失 / 类型错 / 格式不符 |
| **401 Unauthorized** | API 令牌身份无效 | • API 令牌无效 / 缺少 / 过期 / 未激活 / 用户不存在 |
| **402 Payment Required** | 余额不足 / 付费路由 | • 余额不足，此路由需要付费 |
| **403 Forbidden** | 已认证但无权限 | • 缺少路由访问权限 / 账户已禁用 / 邮箱未验证 |
| **404 Not Found** | 路由数据未找到 | • 路径不在白名单 / 上游已下线 / 资源不存在或已删除 |
| **429 Too Many Requests** | 请求速率超限 | • 请求速度过快（读 `Retry-After` 头退避） |
| **500 Internal Server Error** | 服务器内部错误 | • 上游异常（含 502/503/504） |

### 错误码 → 行动 → 修复链接（决策表）

> ⚠️ **400 / 404 强制自检前置**：在按下表"行动"列处理 400 或 404 之前，**必须先完成"防臆造自检清单"**（见下方 §3.1）。

| HTTP 码 | 子场景 | 行动 | 重试 | 修复链接 / 文档 |
|--------|-------|------|------|---------------|
| **400** | 参数错（读端点） | **先做 §3.1 防臆造自检 (B)** → 修正参数后重试 1 次；仍失败 STOP | ≤1 次 | 查端点 reference IN 表 |
| **400** | 参数错（**写端点 ⚠️**） | **先做 §3.1 防臆造自检 (B)** → 让用户重新确认参数，**禁止静默重试** | 0 | 查 post.md fetch_increase_post_view_count IN 表 |
| **401** | API 令牌无效 / 缺失 / 过期 | **STOP**，提示用户检查或更换 API Key | 0 | https://www.aconfig.cn/console |
| **402** | 余额不足 | **STOP**，告知用户充值 | 0 | https://www.aconfig.cn/billing |
| **403** | 缺少路由访问权限 / 账户已禁用 | **STOP**，提示用户当前 Token 无该端点权限 | 0 | https://www.aconfig.cn/console |
| **404** | 路径不在白名单（疑似 Agent 臆造） | **先做 §3.1 防臆造自检 (A)** → 自检失败则 STOP | 0 | 查 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) |
| **404** | 资源不存在（cell_id/user_id 等） | **先做 §3.1 防臆造自检 (A)** → 通过后告知用户资源已删除或不存在 | 0 | — |
| **410** | 上游已下线 | **先做 §3.1 防臆造自检 (A)** → 通过后 STOP，提示用户更新 SKILL | 0 | 查 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) + [`update.md`](./update.md) |
| **422** | 参数校验失败 | **先做 §3.1 防臆造自检 (B)** → 修正后重试 1 次 | ≤1 次 | 查端点 reference IN 表 |
| **429** | 限流 | 读 `Retry-After` 头退避；最多重试 2 次 | ≤2 次 | https://www.aconfig.cn/billing |
| **500/502/503/504** | 上游故障（读端点） | 等 3 秒重试 1 次；仍失败走"端点替换矩阵" | ≤1 次 | — |
| **500/502/503/504** | 上游故障（**写端点 ⚠️**） | 等 3 秒重试 1 次封顶 | ≤1 次 | — |
| **网络超时 / DNS 失败** | 网络异常 | **STOP**，向用户报告网络问题 | 0 | — |
| **HTTP 200 + `code != 0`** | 业务错误 | 读 `message_zh` 报告，不重试 | 0 | — |

---

### § 3.1 防臆造自检清单（404 / 400 处理前置步骤）

> 收到 **404** 或 **400** 时，Agent **必须**先按对应清单完成自检。**自检不是可选的**——绕过自检直接重试或改路径都属于违反防臆造红线。

#### (A) 收到 **404** 时的自检清单 ⚠️ 防路径臆造

按顺序逐项检查，**任一项失败立即 STOP**：

1. **路径白名单逐字符比对**
   - 把刚才请求的完整路径与 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 中的 `endpoints[].path` 对照
   - **是否完全相等？** 不在清单中 → STOP，禁止任何"改路径段"的尝试
2. **Method 比对**
   - 实际请求的 HTTP method 是否等于清单中的 `endpoints[].method`？不等 → STOP
3. **参数键名比对**
   - 实际请求的所有 query 键名是否都在该端点的 `required` ∪ `optional` 中？有臆造参数 → STOP
4. **资源 ID 来源溯源**
   - 请求中的 `cell_id` / `user_id` / `hashtag_id` 等是否来自之前某个端点的**响应字段**？
   - 如果是 Agent 自己编造的 → STOP，告知用户资源不存在
5. **若以上全通过** → 才可以判定"上游资源真的不存在"，**STOP**

#### (B) 收到 **400 / 422** 时的自检清单 ⚠️ 防参数与传参方式臆造

按顺序逐项检查，**任一项失败必须修正**：

1. **参数名严格比对** — 键名是否逐字符等于该端点 IN 表中的 `name`？
2. **必填项齐全** — 该端点 IN 表中所有标 `yes` 的参数是否都已传？
3. **类型与格式严格匹配** — string 是否被错传成了 number？
4. **传参方式正确** — GET 端点参数应放在 query string；Authorization 头格式是否为 `Bearer $MAXHUB_API_KEY`？
5. **没有臆造参数** — 是否传入了 IN 表中**未列出**的参数？
6. **若以上全通过** → 才可以按错误响应中的 `message_zh` 进一步排查

---

### 重试策略矩阵
| 错误类型 | 最大重试 | 退避算法 | 是否换端点 |
|---------|---------|---------|----------|
| 400 / 422 参数错（读端点） | 1 次（修正参数后） | 立即 | ❌ |
| 400 / 422 参数错（**写端点 ⚠️**） | **0 次** | — | ❌ |
| 401 鉴权错 | 0 | — | STOP |
| **402 余额不足** | 0 | — | STOP |
| 403 权限/账户禁用 | 0 | — | STOP |
| 404 / 410 路径错或资源不存在 | 0 | — | ❌ |
| 429 限流 | 2 次 | `min(8s, 2^n) * (0.5 + random*0.5)` | ❌ |
| 5xx 上游错（读端点） | 1 次 | 固定 3s | ✅ 走"端点替换矩阵" |
| 5xx 上游错（**写端点 ⚠️**） | **1 次封顶** | 固定 3s | ❌ |
| 网络超时 / DNS | 0 | — | STOP |
| 业务 `code != 0` | 0 | — | 读 `message_zh` 报告 |

### 降级策略原则
1. **数据完整度降级**：详情接口失败 → 列表接口取相同字段（少几个字段，必须显式告知用户）
2. **数据时效降级**：实时接口失败 → 命中 `cache_url` 取缓存数据（注意时效性）
3. **维度降级**：用户详情失败 → 改用 fetch_search（search_type=4）取概要

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
> - 写入端点（fetch_increase_post_view_count）**无替代**，失败必须 STOP

| 首选端点 | 替代端点 | 替代条件 | 数据差异 |
|---------|---------|---------|---------|
| fetch_post_detail | fetch_search（在搜索结果中匹配 cell_id） | 须有关键词上下文 | 字段较少，缺统计明细 |
| fetch_post_detail | fetch_user_post_list（已知作者 user_id） | 必须先取得作者 user_id | 多一次调用，作品对象字段较少 |
| fetch_post_statistics | fetch_post_detail（取统计相关字段） | 用户接受详情中的部分统计 | 统计字段可能不如专用接口全面 |
| fetch_post_comment_list | 无替代 | — | 评论无替代来源，失败直接 STOP |
| fetch_home_feed | 无替代（顶层入口） | — | 失败 STOP |
| fetch_search | 无替代 | — | 搜索无替代 |
| fetch_hashtag_detail | fetch_search（search_type=5） | 须有话题关键词 | 字段较少 |
| fetch_hashtag_post_list | fetch_search（search_type=5） | 须有话题关键词 | 缺话题聚合排序 |
| fetch_hot_search_board_detail | 无替代 | — | — |
| fetch_short_url | 无替代 | — | — |
| fetch_user_info | fetch_search（search_type=4） | 须有用户名关键词 | 字段更少，可能命中重名 |
| fetch_user_post_list | 无替代 | — | — |
| fetch_user_follower_list | 无替代 | — | — |
| fetch_user_following_list | 无替代 | — | — |

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
1. **国内首选 ⭐⭐⭐**：`skillhub upgrade maxhub-pipixia`（腾讯云 CDN 加速 + 安全审计）
   - Web 入口：https://skillhub.cn/skills/maxhub-pipixia
2. **国际主源 ⭐⭐⭐**：`clawhub upgrade maxhub-pipixia`
3. **降级方案**：`git pull` 仓库 https://github.com/XieWxx/maxhub-api-skills

### 当前版本
- 读取 [`../_meta.json`](../_meta.json) 中的 `version` 字段（当前：`3.7.2`）
