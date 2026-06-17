# 参数与字段映射索引 / Param & Field Mapping Index

Skill: `maxhub-weibo` · Base URL: `https://www.aconfig.cn` · Version: `3.7.2`

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

1. **路径禁止臆造**：所有路径必须逐字符匹配 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml)；不在清单中 → **STOP**，禁止"换一个版本试试"、"改一改路径段试试"、"把 app 改成 web_v2 试探"。
2. **404 / 400 必须先做防臆造自检**：见 [§ 3.1](#-31-防臆造自检清单404--400-处理前置步骤)，绕过自检直接重试或改路径都属于违反防臆造红线。
3. **三端路径不可混用**：`/api/v1/weibo/app/`、`/api/v1/weibo/web/`、`/api/v1/weibo/web_v2/` 是三个独立路径前缀，**禁止**把 app 端的端点名拼到 web 路径下，反之亦然。
4. **同功能不同端的参数名不同**：App 端用 `status_id`，Web 端用 `post_id`，Web V2 端用 `id`——**禁止**跨端混用参数名。
5. **写入操作禁止替代**：本 skill 无写入端点，如用户请求发微博/评论/点赞等写入操作，**禁止**用读取端点"模拟"或"伪造"结果；必须 STOP 并告知不支持。
6. **找不到能力必须 STOP 并告知用户**：用户请求微博平台不支持的能力（见下方"不支持能力清单"）→ 直接告知该 skill 不支持，**禁止**用其他端点拼凑伪造结果。
7. **替换/降级前必须显式告知用户**：例如"由于 X 失败，已切换到 Y，数据完整度可能下降"；禁止静默降级。
8. **404 / 410 强制 STOP**：禁止 Agent 自行修改路径段后重试。**自检通过 + 持续 404** 时才建议用户更新 SKILL（详见 [`update.md`](./update.md)）。
9. **业务 `code != 0` 不重试**：业务错误（配额、合规、权限）不会因重试改变，必须读 `message_zh` 报告用户。
10. **仅 404 / 410 + 自检通过**才建议用户更新 SKILL：401 / 402 / 403 / 网络错**不是** SKILL 版本问题，禁止误导用户更新。

---

## 0.1 ❌ 本 skill 不支持的能力 (Out of Scope)

> 用户请求以下功能时，**直接告知不支持并 STOP**。**禁止**用现有 47 个端点"拼凑"或"模拟"以下能力：

| 不支持的能力 | 说明 |
|------------|------|
| 发布微博 / 转发 / 删除微博 | 无写入端点 |
| 评论 / 删评论 / 回复评论 | 仅支持读评论，无写入端点 |
| 点赞 / 取消点赞 | 无社交互动写入端点 |
| 关注 / 取消关注 | 仅支持读关注/粉丝列表 |
| 发送私信 / DM | 无私信端点 |
| 修改用户资料 / 头像 | 无修改端点 |
| 充值 / 计费查询 / 配额查询 | 在 https://www.aconfig.cn 控制台查询 |
| OAuth 用户授权操作 | 本 skill 仅支持 API Key 模式 |
| 实时直播 / WebSocket 流 | 无实时流端点 |
| 上传图片 / 视频 / 文件 | 无上传端点 |

> 遇到上述请求 → 直接回复用户："本 skill 暂不支持此能力，建议在微博官方应用中操作"，**禁止**用 fetch_status_detail / fetch_user_info 等端点伪造结果。

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
| `max_id` / `since_id` / `cursor` | 分页游标（通用） | 见下方 §2 各字段段 OUT 列表 | 见下方 §2 各字段段 IN 列表 |






## 0.4 📍 endpoints_whitelist.yaml 域内导航 (Loading Map)

> 此 yaml 共 **483 行**。**禁止全文加载**——按下表用 `sed -n` 精确加载所需 domain 段。
> Agent 调用前用 `grep '<endpoint_id>' references/endpoints_whitelist.yaml` 一次确认 id 存在即可，无需读完整文件。

| 域 (Domain) | 端点数 | 行号区间 | 加载命令 |
|------------|-------|---------|---------|
| `Posts / 微博内容 (post.md)` | 14 | 24–122 | `sed -n '24,122p' references/endpoints_whitelist.yaml` |
| `Users / 微博用户 (user.md)` | 22 | 123–277 | `sed -n '123,277p' references/endpoints_whitelist.yaml` |
| `Comments / 微博评论 (comments.md)` | 5 | 278–313 | `sed -n '278,313p' references/endpoints_whitelist.yaml` |
| `Search & Discovery / 搜索与发现 (search.md)` | 23 | 314–475 | `sed -n '314,475p' references/endpoints_whitelist.yaml` |
| `调用前校验协议` | 0 | 476–482 | `sed -n '476,482p' references/endpoints_whitelist.yaml` |

## 1. 端点路由索引 (Endpoint Routing Index)

> ID 命名规则：`{端}_` + 原端点名。`app` = App 端，`web` = Web 端，`web_v2` = Web V2 端。

### Posts / 微博内容 (post.md)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| app_fetch_status_detail | 用 status_id 取微博详情（App 端链式起点） | post.md | GET | low |
| app_fetch_status_reposts | 用 status_id 取微博转发列表 | post.md | GET | low |
| app_fetch_status_likes | 用 status_id 取微博点赞列表 | post.md | GET | low |
| app_fetch_video_detail | 用 mid 取视频详情（视频评论前置步） | post.md | GET | low |
| app_fetch_video_featured_feed | 取短视频精选 Feed 流 | post.md | GET | low |
| app_fetch_home_recommend_feed | 取首页推荐 Feed 流 | post.md | GET | low |
| web_fetch_post_detail | 用 post_id 取微博详情（Web 端） | post.md | GET | low |
| web_fetch_config_list | 取频道配置列表（频道入口） | post.md | GET | low |
| web_fetch_trend_top | 用 containerid 取频道热门趋势 | post.md | GET | low |
| web_fetch_channel_feed | 用频道名取热门内容 | post.md | GET | low |
| web_v2_fetch_post_detail | 用 id 取微博详情（Web V2 端，支持长文） | post.md | GET | low |
| web_v2_check_allow_comment_with_pic | 检查微博是否允许带图评论 | post.md | GET | low |
| web_v2_fetch_user_recommend_timeline | 取微博主页推荐时间轴 | post.md | GET | low |
| web_v2_fetch_hot_ranking_timeline | 用 ranking_type 取热门榜单时间轴 | post.md | GET | low |

### Users / 微博用户 (user.md)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| app_fetch_user_info | 用 uid 取用户基本信息（App 端） | user.md | GET | low |
| app_fetch_user_info_detail | 用 uid 取用户详细信息（App 端，更完整） | user.md | GET | low |
| app_fetch_user_timeline | 用 uid 取用户发布的微博（App 端） | user.md | GET | low |
| app_fetch_user_videos | 用 uid 取用户视频列表（App 端） | user.md | GET | low |
| app_fetch_user_super_topics | 用 uid 取用户参与的超话 | user.md | GET | low |
| app_fetch_user_album | 用 uid 取用户相册 | user.md | GET | low |
| app_fetch_user_articles | 用 uid 取用户文章列表 | user.md | GET | low |
| app_fetch_user_audios | 用 uid 取用户音频列表 | user.md | GET | low |
| app_fetch_user_profile_feed | 用 uid 取用户主页动态 | user.md | GET | low |
| web_fetch_user_info | 用 uid 取用户信息（Web 端） | user.md | GET | low |
| web_fetch_user_posts | 用 uid 取用户微博列表（Web 端） | user.md | GET | low |
| web_v2_fetch_user_info | 用 uid/custom 取用户信息（Web V2 端，支持用户名） | user.md | GET | low |
| web_v2_fetch_user_basic_info | 用 uid 取用户基本信息（Web V2 端，轻量级） | user.md | GET | low |
| web_v2_fetch_user_posts | 用 uid 取用户微博（Web V2 端，feature 控制） | user.md | GET | low |
| web_v2_fetch_user_original_posts | 用 uid 取用户原创微博 | user.md | GET | low |
| web_v2_search_user_posts | 用 uid + 关键词搜索用户微博 | user.md | GET | low |
| web_v2_fetch_user_video_collection_list | 用 uid 取用户视频收藏夹列表 | user.md | GET | low |
| web_v2_fetch_user_video_collection_detail | 用 cid 取视频收藏夹详情 | user.md | GET | low |
| web_v2_fetch_user_video_list | 用 uid 取用户全部视频（Web V2 端） | user.md | GET | low |
| web_v2_fetch_user_following | 用 uid 取用户关注列表 | user.md | GET | low |
| web_v2_fetch_user_fans | 用 uid 取用户粉丝列表 | user.md | GET | low |
| web_v2_fetch_all_groups | 取所有分组信息 | user.md | GET | low |

### Comments / 微博评论 (comments.md)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| app_fetch_status_comments | 用 status_id 取微博评论（App 端） | comments.md | GET | low |
| web_fetch_post_comments | 用 post_id + mid 取微博评论（Web 端） | comments.md | GET | low |
| web_fetch_comment_replies | 用 cid 取评论子评论（Web 端） | comments.md | GET | low |
| web_v2_fetch_post_comments | 用 id 取微博评论（Web V2 端） | comments.md | GET | low |
| web_v2_fetch_post_sub_comments | 用 id 取微博子评论（Web V2 端） | comments.md | GET | low |

### Search & Discovery / 搜索与发现 (search.md)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| app_fetch_search_all | 用 query 综合搜索（App 端，多类型） | search.md | GET | low |
| app_fetch_ai_smart_search | 用 query AI 智搜（App 端） | search.md | GET | low |
| app_fetch_hot_search | 取热搜榜（App 端，支持分类） | search.md | GET | low |
| app_fetch_hot_search_categories | 取热搜分类列表 | search.md | GET | low |
| web_fetch_search | 用 keyword 搜索微博（Web 端） | search.md | GET | low |
| web_fetch_hot_search | 取热搜榜（Web 端，Top 50） | search.md | GET | low |
| web_fetch_search_topics | 取搜索页热搜词 | search.md | GET | low |
| web_v2_fetch_hot_search_index | 取热搜词条前 10 条 | search.md | GET | low |
| web_v2_fetch_hot_search_summary | 取完整热搜 50 条 | search.md | GET | low |
| web_v2_fetch_hot_search | 取热搜数据（多板块） | search.md | GET | low |
| web_v2_fetch_entertainment_ranking | 取文娱榜单 | search.md | GET | low |
| web_v2_fetch_life_ranking | 取生活榜单 | search.md | GET | low |
| web_v2_fetch_social_ranking | 取社会榜单 | search.md | GET | low |
| web_v2_fetch_similar_search | 用 keyword 取相似搜索词推荐 | search.md | GET | low |
| web_v2_fetch_ai_search | 用 query AI 智能搜索（Web V2 端） | search.md | GET | low |
| web_v2_fetch_ai_related_search | 用 keyword AI 搜索内容扩展 | search.md | GET | low |
| web_v2_fetch_advanced_search | 用 q 高级搜索（多维度筛选） | search.md | GET | low |
| web_v2_fetch_city_list | 取地区省市映射 | search.md | GET | low |
| web_v2_fetch_realtime_search | 用 query 实时搜索 | search.md | GET | low |
| web_v2_fetch_user_search | 用 query + 多条件搜索用户 | search.md | GET | low |
| web_v2_fetch_video_search | 用 query 搜索视频 | search.md | GET | low |
| web_v2_fetch_pic_search | 用 query 搜索图片 | search.md | GET | low |
| web_v2_fetch_topic_search | 用 query 搜索话题 | search.md | GET | low |

---

## 2. 字段流字典 (Field Flow Dictionary)

> 当用户需要的数据需要"先 A 再 B"才能取到时，查此表确认字段如何在端点间传递，避免 Agent 臆造字段名或路径。

### `status_id` — 微博 ID（App 端参数名）

- **可从这些端点产出（OUT）**：
  - `app_fetch_status_detail` → `$.data.idstr` 或 `$.data.id`
  - `app_fetch_user_timeline` → `$.data.list[].idstr` 或 `$.data.list[].id`
  - `app_fetch_home_recommend_feed` → `$.data.list[].idstr`
  - `app_fetch_search_all` → `$.data.list[].idstr`（search_type=1/61 等）
  - `app_fetch_status_reposts` → `$.data.list[].idstr`
- **可作为输入（IN）**：
  - `app_fetch_status_detail.status_id`
  - `app_fetch_status_reposts.status_id`
  - `app_fetch_status_likes.status_id`
  - `app_fetch_status_comments.status_id`

### `post_id` — 微博 ID（Web 端参数名）

- **可从这些端点产出（OUT）**：
  - `web_fetch_post_detail` → `$.data.id`
  - `web_fetch_user_posts` → `$.data.list[].id`
  - `web_fetch_search` → `$.data.list[].id`
  - `web_fetch_trend_top` → `$.data.list[].id`
  - `web_fetch_channel_feed` → `$.data.list[].id`
- **可作为输入（IN）**：
  - `web_fetch_post_detail.post_id`
  - `web_fetch_post_comments.post_id`

### `id` — 微博 ID（Web V2 端参数名）

- **可从这些端点产出（OUT）**：
  - `web_v2_fetch_post_detail` → `$.data.id`
  - `web_v2_fetch_user_posts` → `$.data.list[].id`
  - `web_v2_fetch_user_original_posts` → `$.data.list[].id`
  - `web_v2_search_user_posts` → `$.data.list[].id`
  - `web_v2_fetch_user_recommend_timeline` → `$.data.list[].id`
  - `web_v2_fetch_hot_ranking_timeline` → `$.data.list[].id`
  - `web_v2_fetch_advanced_search` → `$.data.list[].id`
  - `web_v2_fetch_realtime_search` → `$.data.list[].id`
- **可作为输入（IN）**：
  - `web_v2_fetch_post_detail.id`
  - `web_v2_check_allow_comment_with_pic.id`
  - `web_v2_fetch_post_comments.id`
  - `web_v2_fetch_post_sub_comments.id`

### `uid` — 用户 ID

- **可从这些端点产出（OUT）**：
  - `app_fetch_user_info` → `$.data.uid`
  - `app_fetch_user_info_detail` → `$.data.uid`
  - `web_v2_fetch_user_info` → `$.data.uid`
  - `web_v2_fetch_user_basic_info` → `$.data.uid`
  - `app_fetch_status_detail` → `$.data.user.id`（作者 uid）
  - `app_fetch_status_comments` → `$.data.list[].user.id`（评论者 uid）
  - `app_fetch_status_reposts` → `$.data.list[].user.id`（转发者 uid）
  - `app_fetch_search_all` → `$.data.list[].user.id`（search_type=3 时）
  - `web_v2_fetch_user_search` → `$.data.list[].uid`
  - `web_v2_fetch_user_following` → `$.data.list[].uid`
  - `web_v2_fetch_user_fans` → `$.data.list[].uid`
- **可作为输入（IN）**：
  - 全部 `app_fetch_user_*` 端点的 `uid`
  - `web_fetch_user_info.uid`
  - `web_fetch_user_posts.uid`
  - `web_v2_fetch_user_info.uid`（与 custom 二选一）
  - `web_v2_fetch_user_basic_info.uid`
  - `web_v2_fetch_user_posts.uid`
  - `web_v2_fetch_user_original_posts.uid`
  - `web_v2_search_user_posts.uid`
  - `web_v2_fetch_user_video_collection_list.uid`
  - `web_v2_fetch_user_video_list.uid`
  - `web_v2_fetch_user_following.uid`
  - `web_v2_fetch_user_fans.uid`

### `custom` — 自定义微博用户名

- **可从这些端点产出（OUT）**：
  - `web_v2_fetch_user_info` → `$.data.screen_name`（可作 custom 使用）
  - `app_fetch_user_info` → `$.data.screen_name`
- **可作为输入（IN）**：
  - `web_v2_fetch_user_info.custom`（与 uid 二选一）

### `cid` — 评论 ID / 收藏夹 ID

- **评论 ID 产出**：
  - `web_fetch_post_comments` → `$.data.list[].id`
  - `web_v2_fetch_post_comments` → `$.data.list[].id`
- **评论 ID 输入**：
  - `web_fetch_comment_replies.cid`
  - `web_v2_fetch_post_sub_comments.id`（注意：Web V2 子评论用 `id` 而非 `cid`）
- **收藏夹 ID 产出**：
  - `web_v2_fetch_user_video_collection_list` → `$.data.list[].id`
- **收藏夹 ID 输入**：
  - `web_v2_fetch_user_video_collection_detail.cid`

### `containerid` — 频道容器 ID

- **可从这些端点产出（OUT）**：
  - `web_fetch_config_list` → `$.data[].containerid`
- **可作为输入（IN）**：
  - `web_fetch_trend_top.containerid`
  - `web_v2_fetch_user_recommend_timeline.containerid`

### `mid` — 视频/微博 MID

- **可从这些端点产出（OUT）**：
  - `app_fetch_video_detail` → `$.data.items[0].data.idstr`（真实视频 ID）
- **可作为输入（IN）**：
  - `app_fetch_video_detail.mid`（视频微博 ID）
  - `web_fetch_post_comments.mid`

### `max_id` / `since_id` / `cursor` — 分页游标（通用）

- **产出/输入**：所有支持分页的端点（同端点的下一次调用使用上次响应的 `max_id` / `since_id` / `cursor`，并以返回的 `has_more` / `more` 字段判定是否继续翻页）
- **注意**：不同端点使用不同的分页参数名，必须按各端点 IN 表严格使用，**禁止**跨端点混用

### `region` — 地区编码

- **可从这些端点产出（OUT）**：
  - `web_v2_fetch_city_list` → `$.data[].code`（编码格式 `custom:省代码:市代码`）
- **可作为输入（IN）**：
  - `web_v2_fetch_user_search.region`

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
| **404 Not Found** | 路由数据未找到 | • 路径不在白名单 / 上游已下线<br>• 资源（status_id/uid/post_id 等）不存在或已删除 |
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
| **404** | 资源不存在（status_id/uid/post_id 等） | **先做 §3.1 防臆造自检 (A)** → 通过后告知用户资源已删除或不存在，**STOP** | 0 | — |
| **410** | 上游已下线 | **先做 §3.1 防臆造自检 (A)** → 通过后 STOP，禁止改路径重试；若 SKILL 长期未更新，提示用户运行 §5 SKILL 更新检查 | 0 | 查 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) + §5 |
| **422** | 参数校验失败（如 oneOf 互斥同时传） | **先做 §3.1 防臆造自检 (B)** → 修正后重试 1 次 | ≤1 次 | 查端点 reference IN 表 |
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
   - 把刚才请求的完整路径（`/api/v1/weibo/{app|web|web_v2}/<端点名>`）逐字符与 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 中的 `endpoints[].path` 对照
   - **是否完全相等？** 如果**不在清单中** → 这是 Agent 臆造路径，**STOP**，禁止任何"改 app→web / web→web_v2 / 拼接路径段"的尝试
2. **Method 比对**
   - 实际请求的 HTTP method 是否等于清单中的 `endpoints[].method`？
   - 如果不等 → STOP，禁止换 method 重试
3. **参数键名比对**
   - 实际请求的所有 query/body 键名是否都在该端点的 `required` ∪ `optional` 中？
   - 是否有 Agent 自己加的"看起来合理但清单没列"的参数？→ STOP
   - **特别注意三端参数名差异**：App 端 `status_id` ≠ Web 端 `post_id` ≠ Web V2 端 `id`
4. **资源 ID 来源溯源**
   - 请求中的 `status_id` / `uid` / `post_id` / `id` 等是否真实来自之前某个端点的**响应字段**（json_path 可追溯）？
   - 如果是 Agent 自己生成 / 编造的字符串 → STOP，告知用户资源不存在
5. **若以上全通过** → 才可以判定"上游资源真的不存在"，向用户报告"资源已删除或不存在"，**STOP**（禁止改路径重试）

#### (B) 收到 **400 / 422** 时的自检清单 ⚠️ 防参数与传参方式臆造

按顺序逐项检查，**任一项失败必须修正**：

1. **参数名严格比对**
   - 实际请求的所有键名是否**逐字符**等于该端点 IN 表中的 `name`？
   - 是否有大小写错（`StatusId` vs `status_id`）、端间混用（App 端 `status_id` 传到 Web 端）、缩写错（`uid` vs `user_id`）？
2. **必填项齐全**
   - 该端点 IN 表中所有标 `yes` 的参数是否都已传？
   - `oneOf(uid, custom)` 类型是否做到"传且只传一个"？
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
2. **数据时效降级**：实时接口失败 → 命中缓存数据（注意时效性）
3. **维度降级**：Web V2 详情失败 → 改用 App 端或 Web 端取概要（必须 uid/status_id 上下文）

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
> - 替换时**必须注意参数名差异**（App 端 status_id ≠ Web 端 post_id ≠ Web V2 端 id）

| 首选端点 | 替代端点 | 替代条件 | 数据差异 |
|---------|---------|---------|---------|
| app_fetch_status_detail | web_v2_fetch_post_detail | 同一微博 ID 可复用 | Web V2 支持长文，字段结构可能不同 |
| app_fetch_status_detail | web_fetch_post_detail | 同一微博 ID 可复用 | Web 端字段较少 |
| web_v2_fetch_post_detail | app_fetch_status_detail | 同一微博 ID 可复用 | App 端不支持长文获取参数 |
| web_v2_fetch_user_info | app_fetch_user_info | 同一 uid | App 端不支持 custom 参数 |
| web_v2_fetch_user_info | web_v2_fetch_user_basic_info | 同一 uid | basic_info 字段更少，响应更快 |
| app_fetch_user_info | app_fetch_user_info_detail | 同一 uid | detail 字段更完整（认证、标签、等级） |
| app_fetch_user_timeline | web_v2_fetch_user_posts | 同一 uid | 参数名不同，Web V2 支持 feature 控制 |
| app_fetch_user_timeline | web_fetch_user_posts | 同一 uid | Web 端字段较少 |
| app_fetch_status_comments | web_v2_fetch_post_comments | 同一微博 ID | 参数名不同（status_id → id） |
| app_fetch_status_comments | web_fetch_post_comments | 同一微博 ID | Web 端需要 mid 参数 |
| web_v2_fetch_post_comments | web_fetch_post_comments | 同一微博 ID | Web 端需要 mid 参数 |
| web_fetch_comment_replies | web_v2_fetch_post_sub_comments | 同一评论 ID | 参数名不同（cid → id） |
| app_fetch_search_all | web_fetch_search | 同一关键词 | 参数名不同（query → keyword），Web 端支持 time_scope |
| app_fetch_search_all | web_v2_fetch_advanced_search | 同一关键词 | Web V2 支持更多筛选维度 |
| app_fetch_hot_search | web_v2_fetch_hot_search_summary | — | Web V2 无分类参数，但返回 50 条完整数据 |
| app_fetch_hot_search | web_fetch_hot_search | — | Web 端无分类参数 |
| web_v2_fetch_hot_search_index | web_v2_fetch_hot_search_summary | — | summary 更完整（50 条 vs 10 条） |
| app_fetch_home_recommend_feed | web_v2_fetch_user_recommend_timeline | — | Web V2 支持更多翻页参数 |
| web_fetch_channel_feed | web_fetch_trend_top | 需要 containerid | trend_top 需先调 config_list 获取 containerid |
| web_v2_fetch_user_posts | web_v2_fetch_user_original_posts | 同一 uid | original 仅返回原创，排除转发 |

---

## 5. 路径合法性硬校验

> 所有端点的合法路径以 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 为唯一可信源。
> Agent **必须**在调用 API 前对照 `endpoints_whitelist.yaml` 逐字符核对路径，未在清单中的路径**禁止调用**。
>
> **三端路径前缀不可混用**：
> - `/api/v1/weibo/app/` — App 端
> - `/api/v1/weibo/web/` — Web 端
> - `/api/v1/weibo/web_v2/` — Web V2 端
>
> 禁止把 App 端的端点名拼到 Web 路径下，反之亦然。

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
1. **国内首选 ⭐⭐⭐**：`skillhub upgrade maxhub-weibo`（腾讯云 CDN 加速 + 安全审计）
   - Web 入口：https://skillhub.cn/skills/maxhub-weibo
2. **国际主源 ⭐⭐⭐**：`clawhub upgrade maxhub-weibo`
3. **降级方案**：`git pull` 仓库 https://github.com/XieWxx/maxhub-api-skills

### 当前版本
- 读取 [`../_meta.json`](../_meta.json) 中的 `version` 字段（当前：`3.7.2`）

### Agent 推荐话术（详见 [`update.md` § 4](./update.md#4-agent-推荐对话话术)）
- 场景 A：合法路径 404 → 建议升级
- 场景 B：用户问版本 → 给出当前版本 + 检查方法
- 场景 C：批量 410 → 强制升级提示
