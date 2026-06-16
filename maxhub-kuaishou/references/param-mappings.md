# Param & Field Mapping Index / 参数与字段映射索引

Skill: `maxhub-kuaishou` · Base URL: `https://www.aconfig.cn` · Version: `3.7.2`

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
3. **App 端与 Web 端不可混用参数**：App 端路径含 `/kuaishou/app/`，Web 端含 `/kuaishou/web/`；参数名可能不同（如 App 端 `share_text` vs Web 端 `url`），必须严格按端点 IN 表传参。
4. **user_id 格式差异**：快手存在两种用户 ID 格式——eid（如 `3xz63mn6fngqtiq`）和纯数字 userId（如 `228905802`）；部分端点仅支持其中一种，必须按端点 IN 表的 `constraints` 传参。
5. **找不到能力必须 STOP 并告知用户**：用户请求快手不支持的能力（见下方"不支持能力清单"）→ 直接告知该 skill 不支持，**禁止**用其他端点拼凑伪造结果。
6. **替换/降级前必须显式告知用户**：例如"由于 X 失败，已切换到 Y，数据完整度可能下降"；禁止静默降级。
7. **404 / 410 强制 STOP**：禁止 Agent 自行修改路径段后重试。**自检通过 + 持续 404** 时才建议用户更新 SKILL（详见 [`update.md`](./update.md)）。
8. **业务 `code != 0` 不重试**：业务错误（配额、合规、权限）不会因重试改变，必须读 `message_zh` 报告用户。
9. **仅 404 / 410 + 自检通过**才建议用户更新 SKILL：401 / 402 / 403 / 网络错**不是** SKILL 版本问题，禁止误导用户更新。
10. **Web 端 fetch_user_info 风控特殊性**：该端点可能因风控返回失败，建议超时设 30s+，失败后可重试但最多 2 次。

---

## 0.1 本 skill 不支持的能力 (Out of Scope)

> 用户请求以下功能时，**直接告知不支持并 STOP**。**禁止**用现有 35 个端点"拼凑"或"模拟"以下能力：

| 不支持的能力 | 说明 |
|------------|------|
| 发布视频 / 上传作品 | 无写入端点 |
| 点赞 / 取消点赞 | 无社交互动写入端点 |
| 评论 / 删评论 | 仅支持读评论，无写入端点 |
| 关注 / 取消关注 | 无写入端点 |
| 发送私信 / DM | 无私信端点 |
| 修改用户资料 / 头像 | 无修改端点 |
| 删除自己的作品 | 无删除端点 |
| 充值 / 计费查询 / 配额查询 | 在 https://www.aconfig.cn 控制台查询 |
| OAuth 用户授权操作 | 本 skill 仅支持 API Key 模式 |
| 实时直播流 / WebSocket | 无实时流端点，仅支持直播信息查询 |
| 视频下载 / 无水印解析 | 本 skill 仅提供视频详情，不提供下载链接 |

> 遇到上述请求 → 直接回复用户："本 skill 暂不支持此能力，建议在快手 App 中操作"，**禁止**用 fetch_one_video 等端点伪造结果。

---

## 0.2 原子化 + 编排入口 (Atomic & Orchestration)

> Agent 可通过两层入口快速定位端点与链路：
> - **原子层**：[`atoms/_index.md`](./atoms/_index.md) — 每个端点封装为原子（atom_id ↔ endpoint_id 映射 + 幂等性 + 链路角色）
> - **编排层**：[`recipes/_index.md`](./recipes/_index.md) — 每个用户目标封装为 Recipe（trigger_keywords + 多步链路 + 容错）
> - **推荐流程**：用户语义 → `recipes/_index.md` 匹配 Recipe → 按 Recipe 的 Atomic Steps 调用 `atoms/_index.md` 中的原子

---

## 1. 端点路由索引 (Endpoint Routing Index)

### Video / 视频 (video.md)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| app_fetch_one_video | 用 photo_id 取视频详情 V1（App 端） | video.md | GET | low |
| app_fetch_videos_batch | 批量查询多个视频（最多 40 个） | video.md | GET | low |
| app_fetch_one_video_by_url | 用分享链接取视频详情（App 端） | video.md | GET | low |
| app_generate_kuaishou_share_link | 生成快手分享链接（App 端） | video.md | GET | low |
| web_fetch_one_video | 用分享链接取视频详情 V1（Web 端） | video.md | GET | low |
| web_fetch_one_video_v2 | 用 photo_id 取视频详情 V2（Web 端） | video.md | GET | low |
| web_fetch_one_video_by_url | 用 URL 取视频详情（Web 端） | video.md | GET | low |
| web_generate_share_short_url | 生成分享短连接（Web 端） | video.md | GET | low |

### User / 用户 (user.md)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| app_fetch_one_user_v2 | 用 user_id 取用户数据 V2（App 端，支持 eid + 纯数字） | user.md | GET | low |
| app_fetch_user_post_v2 | 用 user_id 取用户视频列表（App 端，仅纯数字） | user.md | GET | low |
| app_fetch_user_hot_post | 用 user_id 取用户热门作品（App 端，仅纯数字） | user.md | GET | low |
| web_fetch_user_info | 用 eid 取用户信息（Web 端，仅 eid） | user.md | GET | low |
| web_fetch_user_collect | 用 eid 取用户收藏作品（Web 端，仅 eid） | user.md | GET | low |
| web_fetch_get_user_id | 用分享链接提取用户 ID（Web 端） | user.md | GET | low |

### Comments / 评论 (comments.md)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| app_fetch_video_comment | 用 photo_id 取一级评论（App 端） | comments.md | GET | low |
| app_fetch_video_sub_comments | 用 photo_id + root_comment_id 取二级回复（App 端） | comments.md | GET | low |
| web_fetch_one_video_comment | 用 photo_id 取一级评论（Web 端） | comments.md | GET | low |
| web_fetch_one_video_sub_comment | 用 photo_id + root_comment_id 取二级回复（Web 端） | comments.md | GET | low |

### Search / 搜索 (search.md)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| app_fetch_selection_feed | 取精选/推荐 Feed 流（无入参） | search.md | GET | low |
| app_search_comprehensive | 综合搜索（视频+用户，支持多维筛选） | search.md | GET | low |
| app_search_video_v2 | 搜索视频 V2 | search.md | GET | low |
| app_search_user_v2 | 搜索用户 V2（支持关系/性别/粉丝筛选） | search.md | GET | low |
| app_search_image | 搜索图片作品 | search.md | GET | low |
| app_search_live | 搜索直播间 | search.md | GET | low |
| app_search_music | 搜索音乐 | search.md | GET | low |
| app_search_tag | 搜索话题标签 | search.md | GET | low |
| app_fetch_tag_feed | 话题标签聚合页（标签→作品流） | search.md | GET | low |
| app_fetch_hot_board_categories | 快手热榜分类列表 | search.md | GET | low |
| app_fetch_hot_board_detail | 快手热榜详情 | search.md | GET | low |
| app_fetch_hot_search_person | 快手热搜人物榜单 | search.md | GET | low |
| web_fetch_kuaishou_hot_list_v1 | 快手热榜 V1（Web 端） | search.md | GET | low |
| web_fetch_kuaishou_hot_list_v2 | 快手热榜 V2（Web 端，支持分类） | search.md | GET | low |

### Live / 直播 (live.md)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| app_fetch_user_live_info | 用 user_id 取用户直播信息（App 端，仅纯数字） | live.md | GET | low |
| app_fetch_live_top_list | 快手直播榜单（支持子榜单） | live.md | GET | low |
| app_fetch_shopping_top_list | 快手购物榜单（支持子榜单） | live.md | GET | low |
| app_fetch_brand_top_list | 快手品牌榜单（支持子榜单） | live.md | GET | low |
| app_fetch_music_ranking | 音乐榜单（热歌榜/推荐榜） | live.md | GET | low |
| web_fetch_user_live_replay | 用 eid 取用户直播回放（Web 端，仅 eid） | live.md | GET | low |

---

## 2. 字段流字典 (Field Flow Dictionary)

> 当用户需要的数据需要"先 A 再 B"才能取到时，查此表确认字段如何在端点间传递，避免 Agent 臆造字段名或路径。

### `photo_id` — 作品 ID（支持纯数字和 eid 两种格式）
- **可从这些端点产出（OUT）**：
  - `app_fetch_one_video` → `$.data.photo_id`
  - `app_fetch_one_video_by_url` → `$.data.photo_id`
  - `web_fetch_one_video_v2` → `$.data.photo_id`
  - `web_fetch_one_video_by_url` → `$.data.photo_id`
  - `app_fetch_user_post_v2` → `$.data.videos[].photo_id`
  - `app_fetch_user_hot_post` → `$.data.videos[].photo_id`
  - `app_search_video_v2` → `$.data.videos[].photo_id`
  - `app_search_comprehensive` → `$.data.items[].photo_id`
  - `app_fetch_tag_feed` → `$.data.mixFeeds[].photo_id`
  - `app_fetch_selection_feed` → `$.data.feeds[].photo_id`
- **可作为输入（IN）**：
  - `app_fetch_one_video`（photo_id）
  - `app_fetch_videos_batch`（photo_ids，逗号分隔）
  - `web_fetch_one_video_v2`（photo_id）
  - `app_fetch_video_comment` / `web_fetch_one_video_comment`（photo_id）
  - `app_fetch_video_sub_comments` / `web_fetch_one_video_sub_comment`（photo_id）
  - `app_generate_kuaishou_share_link`（shareObjectId）
  - `web_generate_share_short_url`（photo_id）

### `user_id` — 用户 ID（eid 格式，如 `3xz63mn6fngqtiq`）
- **可从这些端点产出（OUT）**：
  - `app_fetch_one_user_v2` → `$.data.user_id`
  - `web_fetch_user_info` → `$.data.userProfile.profile.user_id`
  - `web_fetch_get_user_id` → `$.data.user_id`
  - `app_search_user_v2` → `$.data.users[].user_id`
  - `app_search_comprehensive` → `$.data.items[].user_id`（搜索结果中的用户）
- **可作为输入（IN）**：
  - `app_fetch_one_user_v2`（支持 eid 和纯数字）
  - `app_fetch_user_post_v2`（**仅纯数字 userId**）
  - `app_fetch_user_hot_post`（**仅纯数字 userId**）
  - `app_fetch_user_live_info`（**仅纯数字 userId**）
  - `web_fetch_user_info`（**仅 eid**）
  - `web_fetch_user_collect`（**仅 eid**）
  - `web_fetch_user_live_replay`（**仅 eid**）

### `root_comment_id` — 一级评论 ID
- **产出**：`app_fetch_video_comment` → `$.data.comments[].comment_id`
- **产出**：`web_fetch_one_video_comment` → `$.data.comments[].comment_id`
- **输入**：`app_fetch_video_sub_comments` / `web_fetch_one_video_sub_comment`

### `general_tag_id` — 话题标签 ID
- **产出**：`app_search_tag` → `$.data.tags[].id`
- **输入**：`app_fetch_tag_feed`（general_tag_id）

### `boardType` / `boardId` — 热榜分类
- **产出**：`app_fetch_hot_board_categories` → `$.data.categories[].boardType` / `boardId`
- **输入**：`app_fetch_hot_board_detail`

### `pcursor` — 分页游标（通用）
- **产出/输入**：所有支持分页的端点（同端点的下一次调用使用上次响应的 `$.data.pcursor`）

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
| **404 Not Found** | 路由数据未找到 | • 路径不在白名单 / 上游已下线<br>• 资源（photo_id/user_id 等）不存在或已删除 |
| **429 Too Many Requests** | 请求速率超限 | • 请求速度过快，超过速率限制（读 `Retry-After` 头退避） |
| **500 Internal Server Error** | 服务器内部错误 | • 上游异常，无法完成请求（5xx 通常归入此类，含 502/503/504） |

### 错误码 → 行动 → 修复链接（决策表）

> **400 / 404 强制自检前置**：在按下表"行动"列处理 400 或 404 之前，**必须先完成"防臆造自检清单"**（见下方 §3.1）。自检通过后再走重试或 STOP。

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
| **404** | 资源不存在（photo_id/user_id 等） | **先做 §3.1 防臆造自检 (A)** → 通过后告知用户资源已删除或不存在，**STOP** | 0 | — |
| **410** | 上游已下线 | **先做 §3.1 防臆造自检 (A)** → 通过后 STOP，禁止改路径重试；若 SKILL 长期未更新，提示用户运行 §5 SKILL 更新检查 | 0 | 查 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) + §5 |
| **422** | 参数校验失败 | **先做 §3.1 防臆造自检 (B)** → 修正后重试 1 次 | ≤1 次 | 查端点 reference IN 表 |
| **429** | 限流 | 读 `Retry-After` 头退避；无该头时指数退避 + jitter；最多重试 2 次 | ≤2 次 | https://www.aconfig.cn |
| **500/502/503/504** | 上游故障 | 等 3 秒重试 1 次；仍失败走"端点替换矩阵" | ≤1 次 | — |
| **网络超时 / DNS 失败** | 网络异常 | **STOP**，向用户报告网络问题 | 0 | — |
| **HTTP 200 + `code != 0`** | 业务层错误 | 读 `message_zh` 告知，不重试 | 0 | — |

---

### § 3.1 防臆造自检清单（404 / 400 处理前置步骤）

> 收到 **404** 或 **400** 时，Agent **必须**先按对应清单完成自检。**自检不是可选的**——绕过自检直接重试或改路径都属于违反防臆造红线。

#### (A) 收到 **404** 时的自检清单 防路径臆造

按顺序逐项检查，**任一项失败立即 STOP**：

1. **路径白名单逐字符比对**
   - 把刚才请求的完整路径（`/api/v1/kuaishou/app/...` 或 `/api/v1/kuaishou/web/...`）逐字符与 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 中的 `endpoints[].path` 对照
   - **是否完全相等？** 如果**不在清单中** → 这是 Agent 臆造路径，**STOP**，禁止任何"改 app→web / 加路径段 / 拼接前缀"的尝试
2. **Method 比对**
   - 实际请求的 HTTP method 是否等于清单中的 `endpoints[].method`？
   - 如果不等 → STOP，禁止换 method 重试
3. **参数键名比对**
   - 实际请求的所有 query/body 键名是否都在该端点的 `required` ∪ `optional` 中？
   - 是否有 Agent 自己加的"看起来合理但清单没列"的参数？→ STOP
4. **资源 ID 来源溯源**
   - 请求中的 `photo_id` / `user_id` / `root_comment_id` 等是否真实来自之前某个端点的**响应字段**（json_path 可追溯）？
   - 如果是 Agent 自己生成 / 编造的字符串 → STOP，告知用户资源不存在
5. **若以上全通过** → 才可以判定"上游资源真的不存在"，向用户报告"资源已删除或不存在"，**STOP**（禁止改路径重试）

#### (B) 收到 **400 / 422** 时的自检清单 防参数与传参方式臆造

按顺序逐项检查，**任一项失败必须修正**：

1. **参数名严格比对**
   - 实际请求的所有键名是否**逐字符**等于该端点 IN 表中的 `name`？
   - 是否有大小写错（`photoId` vs `photo_id`）、端点混淆（App 端 `share_text` vs Web 端 `url`）？
2. **必填项齐全**
   - 该端点 IN 表中所有标 `yes` 的参数是否都已传？
3. **类型与格式严格匹配**
   - string 是否被错传成了 number？数组是否被传成 JSON 字符串？
   - 是否符合 `enum` / `min` / `max` 等 Constraints？
   - **user_id 格式**：App 端部分端点仅支持纯数字（如 `fetch_user_post_v2`），Web 端部分端点仅支持 eid（如 `fetch_user_info`）
4. **传参方式正确**
   - GET 端点：参数应放在 query string，不应放在 request body
   - Authorization 头格式是否为 `Bearer $MAXHUB_API_KEY`？
5. **没有臆造参数**
   - 是否传入了 IN 表中**未列出**的"看起来合理但 API 不接受"的参数？
6. **若以上全通过** → 才可以按错误响应中的 `message_zh` 进一步排查；如仍无法定位 → STOP，向用户报告参数错误

---

### 重试策略矩阵
| 错误类型 | 最大重试 | 退避算法 | 是否换端点 |
|---------|---------|---------|----------|
| 400 / 422 参数错 | 1 次（修正参数后） | 立即 | 不换端点 |
| 401 鉴权错 | 0 | — | STOP |
| **402 余额不足 / 付费路由** | 0 | — | STOP，告知用户充值或升级 |
| 403 权限/账户禁用/邮箱未验证 | 0 | — | STOP，按子场景给修复指引 |
| 404 / 410 路径错或资源不存在 | 0 | — | 不改路径，可走"端点替换矩阵" |
| 429 限流 | 2 次 | Retry-After 优先；否则 `min(8s, 2^n) * (0.5 + random*0.5)` | 不换端点 |
| 5xx 上游错 | 1 次 | 固定 3s | 走"端点替换矩阵" |
| 网络超时 / DNS | 0 | — | STOP |
| 业务 `code != 0` | 0 | — | 读 `message_zh` 报告，不重试 |

### 降级策略原则
1. **App/Web 双端互降**：App 端失败 → 尝试 Web 端同功能端点（注意参数名可能不同）；反之亦然
2. **数据完整度降级**：详情接口失败 → 列表接口取相同字段（少几个字段，必须显式告知用户）
3. **维度降级**：用户详情失败 → 改用 search_user_v2 取概要

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
| app_fetch_one_video | web_fetch_one_video_v2（需 photo_id） | 有 photo_id | Web 端字段结构可能不同 |
| app_fetch_one_video | app_fetch_one_video_by_url（需 share_text） | 有分享链接 | 需要链接而非 ID |
| web_fetch_one_video_v2 | app_fetch_one_video（需 photo_id） | 有 photo_id | App 端字段结构可能不同 |
| web_fetch_one_video | web_fetch_one_video_by_url | 有短链接 | 入参名不同（share_text vs url） |
| app_fetch_one_user_v2 | web_fetch_user_info（需 eid） | 有 eid | Web 端字段更丰富但仅支持 eid |
| web_fetch_user_info | app_fetch_one_user_v2 | 有 user_id | App 端支持 eid + 纯数字 |
| app_fetch_user_post_v2 | app_fetch_user_hot_post | 想看热门作品 | 仅热门，非完整列表 |
| app_fetch_video_comment | web_fetch_one_video_comment | Web 端可用 | 字段结构可能不同 |
| web_fetch_one_video_comment | app_fetch_video_comment | App 端可用 | 字段结构可能不同 |
| app_fetch_video_sub_comments | web_fetch_one_video_sub_comment | Web 端可用 | App 端支持 count 参数 |
| app_search_comprehensive | app_search_video_v2 | 仅需视频结果 | 综合搜索包含更多类型 |
| app_search_comprehensive | app_search_user_v2 | 仅需用户结果 | 综合搜索包含更多类型 |
| web_fetch_kuaishou_hot_list_v1 | web_fetch_kuaishou_hot_list_v2 | V2 支持分类 | V2 字段更丰富 |
| app_fetch_hot_board_detail | web_fetch_kuaishou_hot_list_v2 | 需热榜数据 | 来源不同，字段结构不同 |
| app_fetch_user_live_info | 无替代 | — | 直播信息无替代来源 |

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
1. **国内首选**：`skillhub upgrade maxhub-kuaishou`（腾讯云 CDN 加速 + 安全审计）
   - Web 入口：https://skillhub.cn/skills/maxhub-kuaishou
2. **国际主源**：`clawhub upgrade maxhub-kuaishou`
3. **降级方案**：`git pull` 仓库 https://github.com/XieWxx/maxhub-api-skills

### 当前版本
- 读取 [`../_meta.json`](../_meta.json) 中的 `version` 字段（当前：`3.7.2`）
