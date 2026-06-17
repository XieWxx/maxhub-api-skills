# Param & Field Mapping Index / 参数与字段映射索引

Skill: `maxhub-instagram` · Base URL: `https://www.aconfig.cn` · Version: `3.7.2`

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
3. **V1/V2/V3 同名端点不可混用参数**：如 `v1_fetch_post_comments_v2` 用 `media_id`，`v2_fetch_post_comments` 用 `code_or_url`，`v3_get_post_comments` 用 `code`——参数名不同，**禁止**跨版本套用参数。
4. **读端点可重试 1 次**：5xx / 网络抖动等场景。本 skill 无写入端点，所有端点均为只读。
5. **找不到能力必须 STOP 并告知用户**：用户请求 Instagram 不支持的能力（见下方"不支持能力清单"）→ 直接告知该 skill 不支持，**禁止**用其他端点拼凑伪造结果。
6. **分页游标禁止臆造**：`min_id` / `max_id` / `end_cursor` / `pagination_token` / `rank_token` / `after` / `before` 必须来自上一次响应的对应字段，**禁止**自行编造或修改。
7. **替换/降级前必须显式告知用户**：例如"由于 X 失败，已切换到 Y，数据完整度可能下降"；禁止静默降级。
8. **404 / 410 强制 STOP**：禁止 Agent 自行修改路径段后重试。**自检通过 + 持续 404** 时才建议用户更新 SKILL（详见 [`update.md`](./update.md)）。
9. **业务 `code != 0` 不重试**：业务错误（配额、合规、权限）不会因重试改变，必须读 `message_zh` 报告用户。
10. **仅 404 / 410 + 自检通过**才建议用户更新 SKILL：401 / 402 / 403 / 网络错**不是** SKILL 版本问题，禁止误导用户更新。

---

## 0.1 ❌ 本 skill 不支持的能力 (Out of Scope)

> 用户请求以下功能时，**直接告知不支持并 STOP**。**禁止**用现有端点"拼凑"或"模拟"以下能力：

| 不支持的能力 | 说明 |
|------------|------|
| 发帖 / 发布内容 | 无写入端点，仅支持读取帖子详情 |
| 删帖 / 编辑帖子 | 无删除/修改端点 |
| 点赞 / 取消点赞 | 无社交互动写入端点 |
| 评论写入 / 删评论 | 仅支持读评论，无写入端点 |
| 关注 / 取消关注 | 仅支持读关注/粉丝列表 |
| 私信 / DM | 无私信端点 |
| Story 发布 | 仅支持读取 Stories，无发布端点 |
| OAuth 用户授权操作 | 本 skill 仅支持 API Key 模式 |
| 充值 / 计费查询 / 配额查询 | 在 https://www.aconfig.cn 控制台查询 |
| 实时直播 / WebSocket 流 | 无实时流端点 |
| 帖子编辑 / 二次创作 | 仅支持读取，不支持任何修改 |

> 遇到上述请求 → 直接回复用户："本 skill 暂不支持此能力，建议在 Instagram 官方应用中操作"，**禁止**用 fetch_post_by_url / fetch_user_info 等端点伪造结果。

---

## 0.2 原子化 + 编排入口 (Atomic & Orchestration)

> Agent 可通过两层入口快速定位端点与链路：
> - **原子层**：[`atoms/_index.md`](./atoms/_index.md) — 每个端点封装为原子（atom_id ↔ endpoint_id 映射 + 幂等性 + 链路角色）
> - **编排层**：[`recipes/_index.md`](./recipes/_index.md) — 每个用户目标封装为 Recipe（trigger_keywords + 多步链路 + 容错）
> - **推荐流程**：用户语义 → `recipes/_index.md` 匹配 Recipe → 按 Recipe 的 Atomic Steps 调用 `atoms/_index.md` 中的原子

---


## 0.3 ⚡ Agent 速查 · 同义参数表 (Synonym Quick-Lookup)

> 当 agent 拿到上游响应字段时，先查此表确认它是否能直接传给下游端点。
> 同一行的所有字段名指代**同一个标识**，可在跨端点链路中互换（按下游端点要求的实际名称使用）。

| 同义字段组 | 指代 | 典型出处 (OUT) | 典型用途 (IN) |
|-----------|------|---------------|--------------|
| `shortcode` / `code` | 帖子短代码（如 `DRhvwVLAHAG`） | 见下方 §2 各字段段 OUT 列表 | 见下方 §2 各字段段 IN 列表 |






## 0.4 📍 endpoints_whitelist.yaml 域内导航 (Loading Map)

> 此 yaml 共 **661 行**。**禁止全文加载**——按下表用 `sed -n` 精确加载所需 domain 段。
> Agent 调用前用 `grep '<endpoint_id>' references/endpoints_whitelist.yaml` 一次确认 id 存在即可，无需读完整文件。

| 域 (Domain) | 端点数 | 行号区间 | 加载命令 |
|------------|-------|---------|---------|
| `V1 — 用户 (user.md)` | 13 | 32–123 | `sed -n '32,123p' references/endpoints_whitelist.yaml` |
| `V1 — 帖子 (post.md)` | 6 | 124–166 | `sed -n '124,166p' references/endpoints_whitelist.yaml` |
| `V1 — 评论 (comments.md)` | 2 | 167–181 | `sed -n '167,181p' references/endpoints_whitelist.yaml` |
| `V1 — 搜索 (search.md)` | 8 | 182–238 | `sed -n '182,238p' references/endpoints_whitelist.yaml` |
| `V2 — 用户 (user.md)` | 11 | 239–316 | `sed -n '239,316p' references/endpoints_whitelist.yaml` |
| `V2 — 帖子 (post.md)` | 5 | 317–352 | `sed -n '317,352p' references/endpoints_whitelist.yaml` |
| `V2 — 评论 (comments.md)` | 2 | 353–367 | `sed -n '353,367p' references/endpoints_whitelist.yaml` |
| `V2 — 搜索 (search.md)` | 9 | 368–431 | `sed -n '368,431p' references/endpoints_whitelist.yaml` |
| `V3 — 用户 (user.md)` | 13 | 432–523 | `sed -n '432,523p' references/endpoints_whitelist.yaml` |
| `V3 — 帖子 (post.md)` | 9 | 524–587 | `sed -n '524,587p' references/endpoints_whitelist.yaml` |
| `V3 — 评论 (comments.md)` | 2 | 588–602 | `sed -n '588,602p' references/endpoints_whitelist.yaml` |
| `V3 — 搜索 (search.md)` | 7 | 603–652 | `sed -n '603,652p' references/endpoints_whitelist.yaml` |
| `Pre-call verification protocol` | 0 | 653–660 | `sed -n '653,660p' references/endpoints_whitelist.yaml` |

## 1. 端点路由索引 (Endpoint Routing Index)

> 同名端点在不同 V1/V2/V3 版本中参数名和返回结构可能不同，使用时务必核对版本。

### V1 端点

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| v1_user_id_to_username | 用 user_id 取用户基本信息 | user.md | GET | low |
| v1_fetch_user_info_by_username | 用 username 取用户数据 | user.md | GET | low |
| v1_fetch_user_info_by_username_v2 | 用 username 取用户数据 V2（含最近帖子） | user.md | GET | low |
| v1_fetch_user_info_by_username_v3 | 用 username 取用户数据 V3（含高清头像） | user.md | GET | low |
| v1_fetch_user_info_by_id | 用 user_id 取用户数据 | user.md | GET | low |
| v1_fetch_user_info_by_id_v2 | 用 user_id 取用户数据 V2（含 bio_links） | user.md | GET | low |
| v1_fetch_user_about_info | 用 user_id 取用户 About 信息 | user.md | GET | low |
| v1_fetch_user_posts | 用 user_id 取用户帖子列表 | user.md | GET | low |
| v1_fetch_user_posts_v2 | 用 user_id 取用户帖子列表 V2（GraphQL） | user.md | GET | low |
| v1_fetch_user_reels | 用 user_id 取用户 Reels 列表 | user.md | GET | low |
| v1_fetch_user_reposts | 用 user_id 取用户转发列表 | user.md | GET | low |
| v1_fetch_user_tagged_posts | 用 user_id 取被标记帖子 | user.md | GET | low |
| v1_fetch_related_profiles | 用 user_id 取相关用户推荐 | user.md | GET | low |
| v1_shortcode_to_media_id | Shortcode 转 Media ID | post.md | GET | low |
| v1_media_id_to_shortcode | Media ID 转 Shortcode | post.md | GET | low |
| v1_fetch_post_by_url | 用 URL 取帖子详情 | post.md | GET | low |
| v1_fetch_post_by_url_v2 | 用 URL 取帖子详情 V2（更快但字段少） | post.md | GET | low |
| v1_fetch_post_by_id | 用 post_id 取帖子详情 | post.md | GET | low |
| v1_fetch_music_posts | 用 music_id/URL 取音乐帖子 | post.md | GET | low |
| v1_fetch_post_comments_v2 | 用 media_id 取帖子评论列表 | comments.md | GET | low |
| v1_fetch_comment_replies | 用 media_id+comment_id 取子评论 | comments.md | GET | low |
| v1_fetch_search | 搜索用户/话题/地点 | search.md | GET | low |
| v1_fetch_hashtag_posts | 用 hashtag 取话题帖子 | search.md | GET | low |
| v1_fetch_location_info | 用 location_id 取地点信息 | search.md | GET | low |
| v1_fetch_location_posts | 用 location_id 取地点帖子 | search.md | GET | low |
| v1_fetch_cities | 用 country_code 取城市列表 | search.md | GET | low |
| v1_fetch_locations | 用 city_id 取地点列表 | search.md | GET | low |
| v1_fetch_explore_sections | 取探索页面分类 | search.md | GET | low |
| v1_fetch_section_posts | 用 section_id 取分类帖子 | search.md | GET | low |

### V2 端点

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| v2_user_id_to_username | 用 user_id 取用户基本信息 | user.md | GET | low |
| v2_fetch_user_info | 用 username 或 user_id 取用户信息 | user.md | GET | low |
| v2_fetch_user_posts | 用 username/user_id 取用户帖子 | user.md | GET | low |
| v2_fetch_user_reels | 用 username/user_id 取用户 Reels | user.md | GET | low |
| v2_fetch_user_followers | 用 username/user_id 取粉丝列表 | user.md | GET | low |
| v2_fetch_user_following | 用 username/user_id 取关注列表 | user.md | GET | low |
| v2_fetch_user_stories | 用 username/user_id 取用户 Stories | user.md | GET | low |
| v2_fetch_user_highlights | 用 username/user_id 取用户精选 | user.md | GET | low |
| v2_fetch_highlight_stories | 用 highlight_id 取精选故事详情 | user.md | GET | low |
| v2_fetch_user_tagged_posts | 用 username/user_id 取被标记帖子 | user.md | GET | low |
| v2_fetch_similar_users | 用 username/user_id 取相似用户 | user.md | GET | low |
| v2_shortcode_to_media_id | Shortcode 转 Media ID | post.md | GET | low |
| v2_media_id_to_shortcode | Media ID 转 Shortcode | post.md | GET | low |
| v2_fetch_post_info | 用 code_or_url 取帖子详情 | post.md | GET | low |
| v2_fetch_post_likes | 用 code_or_url 取点赞列表 | post.md | GET | low |
| v2_fetch_music_posts | 用 audio_canonical_id 取音乐帖子 | post.md | GET | low |
| v2_fetch_post_comments | 用 code_or_url 取帖子评论 | comments.md | GET | low |
| v2_fetch_comment_replies | 用 code_or_url+comment_id 取回复 | comments.md | GET | low |
| v2_search_users | 用 keyword 搜索用户 | search.md | GET | low |
| v2_general_search | 用 keyword 综合搜索 | search.md | GET | low |
| v2_search_reels | 用 keyword 搜索 Reels | search.md | GET | low |
| v2_search_music | 用 keyword 搜索音乐 | search.md | GET | low |
| v2_search_hashtags | 用 keyword 搜索话题 | search.md | GET | low |
| v2_search_locations | 用 keyword 搜索地点 | search.md | GET | low |
| v2_search_by_coordinates | 用经纬度搜索地点 | search.md | GET | low |
| v2_fetch_hashtag_posts | 用 keyword 取话题帖子 | search.md | GET | low |
| v2_fetch_location_posts | 用 location_id 取地点帖子 | search.md | GET | low |

### V3 端点

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| v3_get_user_id_by_username | 用 username 取 user_id | user.md | GET | low |
| v3_get_user_profile | 用 user_id/username 取用户资料 | user.md | GET | low |
| v3_get_user_brief | 用 user_id+username 取用户短详情 | user.md | GET | low |
| v3_get_user_posts | 用 username 取用户帖子列表 | user.md | GET | low |
| v3_get_user_tagged_posts | 用 user_id/username 取被标记帖子 | user.md | GET | low |
| v3_get_user_reels | 用 user_id/username 取用户 Reels | user.md | GET | low |
| v3_get_user_highlights | 用 user_id/username 取用户精选 | user.md | GET | low |
| v3_get_highlight_stories | 用 highlight_id 取精选故事详情 | user.md | GET | low |
| v3_get_user_about | 用 user_id/username 取账户简介 | user.md | GET | low |
| v3_get_user_former_usernames | 用 user_id/username 取曾用名 | user.md | GET | low |
| v3_get_user_stories | 用 user_id/username 取用户 Stories | user.md | GET | low |
| v3_get_user_following | 用 user_id/username 取关注列表 | user.md | GET | low |
| v3_get_user_followers | 用 user_id/username 取粉丝列表 | user.md | GET | low |
| v3_shortcode_to_media_id | Shortcode 转 Media ID | post.md | GET | low |
| v3_media_id_to_shortcode | Media ID 转 Shortcode | post.md | GET | low |
| v3_extract_shortcode | 从 URL 提取 Shortcode | post.md | GET | low |
| v3_get_post_info | 用 media_id/url 取帖子详情 | post.md | GET | low |
| v3_get_post_info_by_code | 用 code 取帖子详情 | post.md | GET | low |
| v3_get_post_oembed | 用 url 取 oEmbed 内嵌信息 | post.md | GET | low |
| v3_get_recommended_reels | 取 Reels 推荐列表 | post.md | GET | low |
| v3_translate_comment | 用 comment_id 翻译评论 | post.md | GET | low |
| v3_bulk_translate_comments | 用 comment_ids 批量翻译评论 | post.md | GET | low |
| v3_get_post_comments | 用 code 取帖子评论 | comments.md | GET | low |
| v3_get_comment_replies | 用 media_id+comment_id 取子评论 | comments.md | GET | low |
| v3_search_users | 用 query 搜索用户 | search.md | GET | low |
| v3_search_hashtags | 用 query 搜索话题 | search.md | GET | low |
| v3_general_search | 用 query 综合搜索（支持分页） | search.md | GET | low |
| v3_get_explore | 取探索页推荐帖子 | search.md | GET | low |
| v3_get_location_info | 用 location_id 取地点详情 | search.md | GET | low |
| v3_get_location_posts | 用 location_id 取地点帖子 | search.md | GET | low |
| v3_get_location_nearby | 用 location_id 取附近内容 | search.md | GET | low |

---

## 2. 字段流字典 (Field Flow Dictionary)

> 当用户需要的数据需要"先 A 再 B"才能取到时，查此表确认字段如何在端点间传递，避免 Agent 臆造字段名或路径。

### `user_id` — 用户 ID（纯数字，如 `25025320`）
- **可从这些端点产出（OUT）**：
  - `v1_user_id_to_username` → `$.pk` / `$.pk_id`
  - `v1_fetch_user_info_by_username` → `$.id`
  - `v1_fetch_user_info_by_id` → `$.id`
  - `v2_user_id_to_username` → `$.pk` / `$.pk_id`
  - `v2_fetch_user_info` → `$.data.id`
  - `v3_get_user_id_by_username` → `$.data.user_id`
  - `v3_get_user_profile` → `$.data.user.id`
  - `v3_get_user_brief` → `$.data.id`
  - `v3_search_users` → `$.data.users[].pk`
  - `v2_search_users` → `$.data.items[].pk`
  - `v1_fetch_search` → `$.users[].pk`
- **可作为输入（IN）**：
  - V1: `v1_fetch_user_info_by_id` / `v1_fetch_user_info_by_id_v2` / `v1_fetch_user_about_info` / `v1_fetch_user_posts` / `v1_fetch_user_posts_v2` / `v1_fetch_user_reels` / `v1_fetch_user_reposts` / `v1_fetch_user_tagged_posts` / `v1_fetch_related_profiles`
  - V2: `v2_fetch_user_info` / `v2_fetch_user_posts` / `v2_fetch_user_reels` / `v2_fetch_user_followers` / `v2_fetch_user_following` / `v2_fetch_user_stories` / `v2_fetch_user_highlights` / `v2_fetch_user_tagged_posts` / `v2_fetch_similar_users`
  - V3: `v3_get_user_profile` / `v3_get_user_brief` / `v3_get_user_tagged_posts` / `v3_get_user_reels` / `v3_get_user_highlights` / `v3_get_user_about` / `v3_get_user_former_usernames` / `v3_get_user_stories` / `v3_get_user_following` / `v3_get_user_followers`

### `username` — 用户名（如 `instagram`）
- **可从这些端点产出（OUT）**：
  - `v1_user_id_to_username` → `$.username`
  - `v2_user_id_to_username` → `$.username`
  - `v3_get_user_profile` → `$.data.user.username`
  - `v3_search_users` → `$.data.users[].username`
  - `v2_search_users` → `$.data.items[].username`
  - `v1_fetch_search` → `$.users[].username`
- **可作为输入（IN）**：
  - V1: `v1_fetch_user_info_by_username` / `v1_fetch_user_info_by_username_v2` / `v1_fetch_user_info_by_username_v3`
  - V2: `v2_fetch_user_info` / `v2_fetch_user_posts` / `v2_fetch_user_reels` / `v2_fetch_user_followers` / `v2_fetch_user_following` / `v2_fetch_user_stories` / `v2_fetch_user_highlights` / `v2_fetch_user_tagged_posts` / `v2_fetch_similar_users`
  - V3: `v3_get_user_id_by_username` / `v3_get_user_profile` / `v3_get_user_brief` / `v3_get_user_posts` / `v3_get_user_tagged_posts` / `v3_get_user_reels` / `v3_get_user_highlights` / `v3_get_user_about` / `v3_get_user_former_usernames` / `v3_get_user_stories` / `v3_get_user_following` / `v3_get_user_followers`

### `media_id` — 帖子媒体 ID（纯数字，如 `3766120364183949816`）
- **可从这些端点产出（OUT）**：
  - `v1_shortcode_to_media_id` → `$.media_id`
  - `v2_shortcode_to_media_id` → `$.media_id`
  - `v3_shortcode_to_media_id` → `$.data.media_id`（返回值）
  - `v3_get_post_info` → `$.data.items[].id`
  - `v1_fetch_post_by_url` → 帖子详情中的 ID
  - `v1_fetch_post_by_id` → 帖子详情中的 ID
- **可作为输入（IN）**：
  - V1: `v1_fetch_post_comments_v2` / `v1_fetch_comment_replies` / `v1_media_id_to_shortcode`
  - V2: `v2_media_id_to_shortcode`
  - V3: `v3_get_post_info` / `v3_get_comment_replies` / `v3_media_id_to_shortcode`

### `shortcode` / `code` — 帖子短代码（如 `DRhvwVLAHAG`）
- **可从这些端点产出（OUT）**：
  - `v1_media_id_to_shortcode` → `$.shortcode`
  - `v2_media_id_to_shortcode` → `$.shortcode`
  - `v3_media_id_to_shortcode` → `$.data.shortcode`
  - `v3_extract_shortcode` → 返回提取的短码
  - `v3_get_post_info` → `$.data.items[].code`
- **可作为输入（IN）**：
  - V1: `v1_shortcode_to_media_id`
  - V2: `v2_shortcode_to_media_id`
  - V3: `v3_shortcode_to_media_id` / `v3_get_post_info_by_code` / `v3_get_post_comments`

### `comment_id` — 评论 ID
- **可从这些端点产出（OUT）**：
  - `v1_fetch_post_comments_v2` → `$.comments[].pk`
  - `v2_fetch_post_comments` → `$.data.items[].id`
  - `v3_get_post_comments` → `$.data.comments[].pk` 或 `user.pk`
- **可作为输入（IN）**：
  - V1: `v1_fetch_comment_replies`
  - V2: `v2_fetch_comment_replies`
  - V3: `v3_get_comment_replies` / `v3_translate_comment`

### `highlight_id` — 精选 ID
- **可从这些端点产出（OUT）**：
  - `v2_fetch_user_highlights` → `$.data.items[].id`
  - `v3_get_user_highlights` → `$.data.edges[].node.id`
- **可作为输入（IN）**：
  - V2: `v2_fetch_highlight_stories`
  - V3: `v3_get_highlight_stories`

### `location_id` — 地点 ID
- **可从这些端点产出（OUT）**：
  - `v1_fetch_search` → `$.places[].location.pk`
  - `v2_search_locations` → `$.data.items[].id` 或 `external_id`
  - `v3_get_location_info` → `$.data.native_location_data.location_id`
  - `v1_fetch_cities` → `$.city_list[].id`
  - `v1_fetch_locations` → `$.location_list[].id`
- **可作为输入（IN）**：
  - V1: `v1_fetch_location_info` / `v1_fetch_location_posts`
  - V2: `v2_fetch_location_posts`
  - V3: `v3_get_location_info` / `v3_get_location_posts` / `v3_get_location_nearby`

### 分页游标（多种类型）
- **`min_id`**：V1 评论分页（`next_min_id` → `min_id`）、V3 评论分页（`next_min_id` / `next_min_child_cursor` → `min_id`）
- **`max_id`**：V1 帖子/Reels 分页（`next_max_id` → `max_id`）、V3 关注/粉丝/探索分页
- **`end_cursor`**：V1 GraphQL 分页、V2 点赞分页
- **`pagination_token`**：V2 通用分页
- **`after` / `before`**：V3 GraphQL 风格分页（`page_info.end_cursor` → `after`）
- **`rank_token`**：V3 搜索分页（响应返回 `rank_token` → 下次请求传入）

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
| **404 Not Found** | 路由数据未找到 | • 路径不在白名单 / 上游已下线<br>• 资源（media_id/user_id 等）不存在或已删除 |
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
| **403** | 缺少路由访问权限 / API Token 权限不足 | **STOP**，提示用户当前 Token 无该端点权限 | 0 | https://www.aconfig.cn |
| **403** | 账户已禁用 | **STOP**，提示用户账户被禁用 | 0 | https://www.aconfig.cn |
| **403** | 邮箱未验证 | **STOP**，提示用户先到控制台验证邮箱 | 0 | https://www.aconfig.cn |
| **404** | 路径不在白名单（疑似 Agent 臆造） | **先做 §3.1 防臆造自检 (A)** → 自检失败则 STOP | 0 | 查 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) |
| **404** | 资源不存在（media_id/user_id 等） | **先做 §3.1 防臆造自检 (A)** → 通过后告知用户资源已删除或不存在 | 0 | — |
| **410** | 上游已下线 | **先做 §3.1 防臆造自检 (A)** → 通过后 STOP；若 SKILL 长期未更新，提示用户运行 §6 SKILL 更新检查 | 0 | 查 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) + §6 |
| **422** | 参数校验失败 | **先做 §3.1 防臆造自检 (B)** → 修正后重试 1 次 | ≤1 次 | 查端点 reference IN 表 |
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
   - 把刚才请求的完整路径（`/api/v1/instagram/v1/<id>` 或 `/api/v1/instagram/v2/<id>` 或 `/api/v1/instagram/v3/<id>`）逐字符与 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 中的 `endpoints[].path` 对照
   - **是否完全相等？** 如果**不在清单中** → 这是 Agent 臆造路径，**STOP**，禁止任何"改 v1→v2 / 加路径段 / 拼接前缀"的尝试
2. **Method 比对**
   - 实际请求的 HTTP method 是否等于清单中的 `endpoints[].method`？
   - 如果不等 → STOP，禁止换 method 重试
3. **参数键名比对**
   - 实际请求的所有 query 键名是否都在该端点的 `required` ∪ `optional` 中？
   - 是否有 Agent 自己加的"看起来合理但清单没列"的参数？→ STOP
4. **资源 ID 来源溯源**
   - 请求中的 `user_id` / `media_id` / `shortcode` / `comment_id` 等是否真实来自之前某个端点的**响应字段**（json_path 可追溯）？
   - 如果是 Agent 自己生成 / 编造的字符串 → STOP，告知用户资源不存在
5. **若以上全通过** → 才可以判定"上游资源真的不存在"，向用户报告"资源已删除或不存在"，**STOP**（禁止改路径重试）

#### (B) 收到 **400 / 422** 时的自检清单 ⚠️ 防参数与传参方式臆造

按顺序逐项检查，**任一项失败必须修正**：

1. **参数名严格比对**
   - 实际请求的所有键名是否**逐字符**等于该端点 IN 表中的 `name`？
   - 是否有大小写错（`mediaId` vs `media_id`）、版本错（V1 用 `media_id` 但 V3 用 `code`）？
2. **必填项齐全**
   - 该端点 IN 表中所有标 `yes` 的参数是否都已传？
   - `oneOf(username, user_id)` 类型是否做到"至少传一个"？
3. **类型与格式严格匹配**
   - string 是否被错传成了 number？数组是否被传成 JSON 字符串？
   - 是否符合 `pattern` / `enum` 等约束？
4. **传参方式正确**
   - GET 端点：参数应放在 query string，不应放在 request body
   - Authorization 头格式是否为 `Bearer $MAXHUB_API_KEY`？
5. **没有臆造参数**
   - 是否传入了 IN 表中**未列出**的"看起来合理但 API 不接受"的参数？
6. **若以上全通过** → 才可以按错误响应中的 `message_zh` 进一步排查；如仍无法定位 → STOP

---

### 重试策略矩阵
| 错误类型 | 最大重试 | 退避算法 | 是否换端点 |
|---------|---------|---------|----------|
| 400 / 422 参数错 | 1 次（修正参数后） | 立即 | ❌ 不换端点 |
| 401 鉴权错 | 0 | — | STOP |
| **402 余额不足 / 付费路由** | 0 | — | STOP |
| 403 权限/账户禁用/邮箱未验证 | 0 | — | STOP |
| 404 / 410 路径错或资源不存在 | 0 | — | ❌ 不改路径，可走"端点替换矩阵" |
| 429 限流 | 2 次 | Retry-After 优先；否则 `min(8s, 2^n) * (0.5 + random*0.5)` | ❌ |
| 5xx 上游错 | 1 次 | 固定 3s | ✅ 走"端点替换矩阵" |
| 网络超时 / DNS | 0 | — | STOP |
| 业务 `code != 0` | 0 | — | 读 `message_zh` 报告 |

### 降级策略原则
1. **版本降级**：V3 端点失败 → 尝试 V2 同功能端点 → 再失败尝试 V1（必须显式告知用户版本降级）
2. **数据完整度降级**：详情接口失败 → 列表接口取相同字段（少几个字段，必须显式告知用户）
3. **ID 转换降级**：有 shortcode 但需要 media_id → 先调 `shortcode_to_media_id` 转换后再调目标端点

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
> - 跨版本替换时注意参数名不同

| 首选端点 | 替代端点 | 替代条件 | 数据差异 |
|---------|---------|---------|---------|
| v3_get_user_profile | v2_fetch_user_info | V3 失败时降级到 V2 | V2 返回字段略少 |
| v3_get_user_profile | v1_fetch_user_info_by_username | 已知 username 时 | V1 字段结构不同 |
| v3_get_post_info | v2_fetch_post_info | V3 失败时降级到 V2 | V2 入参为 code_or_url |
| v3_get_post_info | v1_fetch_post_by_url | 已知 URL 时 | V1 返回更完整但更慢 |
| v3_get_post_comments | v2_fetch_post_comments | V3 失败时降级到 V2 | V2 入参为 code_or_url |
| v3_get_post_comments | v1_fetch_post_comments_v2 | V2 也失败时降级到 V1 | V1 入参为 media_id |
| v3_get_comment_replies | v2_fetch_comment_replies | V3 失败时降级到 V2 | V2 入参为 code_or_url |
| v3_get_comment_replies | v1_fetch_comment_replies | V2 也失败时降级到 V1 | V1 入参为 media_id |
| v3_search_users | v2_search_users | V3 失败时降级到 V2 | V2 入参为 keyword |
| v3_search_users | v1_fetch_search(select=users) | V2 也失败时降级到 V1 | V1 返回格式不同 |
| v3_get_user_posts | v2_fetch_user_posts | V3 失败时降级到 V2 | V2 支持 user_id/username |
| v3_get_user_posts | v1_fetch_user_posts | V2 也失败时降级到 V1 | V1 仅支持 user_id |
| v3_get_user_reels | v2_fetch_user_reels | V3 失败时降级到 V2 | V2 支持 user_id/username |
| v3_get_user_reels | v1_fetch_user_reels | V2 也失败时降级到 V1 | V1 仅支持 user_id |
| v3_get_user_following | v2_fetch_user_following | V3 失败时降级到 V2 | 分页方式不同 |
| v3_get_user_followers | v2_fetch_user_followers | V3 失败时降级到 V2 | 分页方式不同 |
| v3_get_location_info | v1_fetch_location_info | V3 失败时降级到 V1 | V1 字段较少 |
| v3_get_location_posts | v2_fetch_location_posts | V3 失败时降级到 V2 | V2 无 tab 筛选 |
| v3_get_location_posts | v1_fetch_location_posts | V2 也失败时降级到 V1 | V1 支持 tab 筛选 |

---

## 5. 路径合法性硬校验

> 所有端点的合法路径以 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 为唯一可信源。
> Agent **必须**在调用 API 前对照 `endpoints_whitelist.yaml` 逐字符核对路径，未在清单中的路径**禁止调用**。
> Instagram 有 V1/V2/V3 三个版本，路径格式为 `/api/v1/instagram/v{1|2|3}/<endpoint_name>`，**禁止**自行修改版本号段。

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
1. **国内首选 ⭐⭐⭐**：`skillhub upgrade maxhub-instagram`（腾讯云 CDN 加速 + 安全审计）
   - Web 入口：https://skillhub.cn/skills/maxhub-instagram
2. **国际主源 ⭐⭐⭐**：`clawhub upgrade maxhub-instagram`
3. **降级方案**：`git pull` 仓库 https://github.com/XieWxx/maxhub-api-skills

### 当前版本
- 读取 [`../_meta.json`](../_meta.json) 中的 `version` 字段（当前：`3.7.2`）

### Agent 推荐话术（详见 [`update.md` § 4](./update.md#4-agent-推荐对话话术)）
- 场景 A：合法路径 404 → 建议升级
- 场景 B：用户问版本 → 给出当前版本 + 检查方法
- 场景 C：批量 410 → 强制升级提示
