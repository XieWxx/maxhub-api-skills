# Param & Field Mapping Index / 参数与字段映射索引

Skill: `maxhub-linkedin` · Base URL: `https://www.aconfig.cn` · Version: `3.7.2`

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

1. **路径禁止臆造**：所有路径必须逐字符匹配 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml)；不在清单中 → **STOP**，禁止"换一个版本试试"、"改一改路径段试试"、"把 web 改成 web_v2 试探"。
2. **404 / 400 必须先做防臆造自检**：见 [§ 3.1](#-31-防臆造自检清单404--400-处理前置步骤)，绕过自检直接重试或改路径都属于违反防臆造红线。
3. **Web 与 Web V2 不可混用参数**：Web API 用 `urn` / `company_id`，Web V2 API 用 `username` / `universal_name`；禁止跨版本拼接参数。
4. **读取端点 5xx 重试 ≤ 1 次**：避免重复扣配额。
5. **找不到能力必须 STOP 并告知用户**：用户请求 LinkedIn 不支持的能力（见下方"不支持能力清单"）→ 直接告知该 skill 不支持，**禁止**用其他端点拼凑伪造结果。
6. **URN / username 不可臆造**：`urn` 形如 `ACoA...`，`username` 是 LinkedIn URL slug；Agent 不可自行编造。
7. **替换/降级前必须显式告知用户**：例如"由于 X 失败，已切换到 Y，数据完整度可能下降"；禁止静默降级。
8. **404 / 410 强制 STOP**：禁止 Agent 自行修改路径段后重试。**自检通过 + 持续 404** 时才建议用户更新 SKILL（详见 [`update.md`](./update.md)）。
9. **业务 `code != 0` 不重试**：业务错误（配额、合规、权限）不会因重试改变，必须读 `message_zh` 报告用户。
10. **仅 404 / 410 + 自检通过**才建议用户更新 SKILL：401 / 402 / 403 / 网络错**不是** SKILL 版本问题，禁止误导用户更新。

---

## 0.1 ❌ 本 skill 不支持的能力 (Out of Scope)

> 用户请求以下功能时，**直接告知不支持并 STOP**。**禁止**用现有端点"拼凑"或"模拟"以下能力：

| 不支持的能力 | 说明 |
|------------|------|
| 发布/编辑/删除帖子 | 无写入端点 |
| 点赞 / 取消点赞 | 仅支持读点赞反应列表 |
| 评论 / 删评论 | 仅支持读评论，无写入端点 |
| 关注 / 取消关注 | 无写入端点 |
| 发送 InMail / 私信 | 无私信端点 |
| 申请职位 | 无写入端点 |
| 修改用户资料 / 头像 | 无修改端点 |
| 充值 / 计费查询 / 配额查询 | 在 https://www.aconfig.cn 控制台查询 |
| OAuth 用户授权操作 | 本 skill 仅支持 API Key 模式 |
| 实时通知 / WebSocket 流 | 无实时流端点 |
| LinkedIn Learning 课程 | 无相关端点 |
| LinkedIn Sales Navigator | 无相关端点 |

> 遇到上述请求 → 直接回复用户："本 skill 暂不支持此能力，建议在 LinkedIn 官方应用中操作"，**禁止**用 get_user_profile / search_people 等端点伪造结果。

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
| `comment_id` / `comment_urn` | 评论 ID / URN | 见下方 §2 各字段段 OUT 列表 | 见下方 §2 各字段段 IN 列表 |






## 0.4 📍 endpoints_whitelist.yaml 域内导航 (Loading Map)

> 此 yaml 共 **639 行**。**禁止全文加载**——按下表用 `sed -n` 精确加载所需 domain 段。
> Agent 调用前用 `grep '<endpoint_id>' references/endpoints_whitelist.yaml` 一次确认 id 存在即可，无需读完整文件。

| 域 (Domain) | 端点数 | 行号区间 | 加载命令 |
|------------|-------|---------|---------|
| `Web API — User (user.md)` | 22 | 28–182 | `sed -n '28,182p' references/endpoints_whitelist.yaml` |
| `Web API — Company (company.md)` | 8 | 183–239 | `sed -n '183,239p' references/endpoints_whitelist.yaml` |
| `Web API — Content (content.md)` | 10 | 240–310 | `sed -n '240,310p' references/endpoints_whitelist.yaml` |
| `Web API — Jobs (jobs.md)` | 2 | 311–325 | `sed -n '311,325p' references/endpoints_whitelist.yaml` |
| `Web V2 API — User (user.md)` | 23 | 326–487 | `sed -n '326,487p' references/endpoints_whitelist.yaml` |
| `Web V2 API — Company (company.md)` | 12 | 488–572 | `sed -n '488,572p' references/endpoints_whitelist.yaml` |
| `Web V2 API — Content (content.md)` | 6 | 573–615 | `sed -n '573,615p' references/endpoints_whitelist.yaml` |
| `Web V2 API — Jobs (jobs.md)` | 2 | 616–630 | `sed -n '616,630p' references/endpoints_whitelist.yaml` |
| `Pre-call verification protocol` | 0 | 631–638 | `sed -n '631,638p' references/endpoints_whitelist.yaml` |

## 1. 端点路由索引 (Endpoint Routing Index)

### Web API 端点

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| web_get_user_profile | 用 username 取用户资料（**链式起点**） | user.md | GET | low |
| web_get_user_posts | 用 urn 取用户帖子 | user.md | GET | low |
| web_get_user_comments | 用 urn 取用户评论 | user.md | GET | low |
| web_get_user_contact | 用 username 取联系信息 | user.md | GET | low |
| web_get_user_recommendations | 用 urn 取推荐信 | user.md | GET | low |
| web_get_user_videos | 用 urn 取用户视频 | user.md | GET | low |
| web_get_user_images | 用 urn 取用户图片 | user.md | GET | low |
| web_get_user_about | 用 urn 取用户简介 | user.md | GET | low |
| web_get_user_follower_and_connection | 用 username 取粉丝/连接数 | user.md | GET | low |
| web_get_user_experience | 用 urn 取工作经历 | user.md | GET | low |
| web_get_user_skills | 用 urn 取技能 | user.md | GET | low |
| web_get_user_educations | 用 urn 取教育背景 | user.md | GET | low |
| web_get_user_publications | 用 urn 取出版物 | user.md | GET | low |
| web_get_user_certifications | 用 urn 取认证 | user.md | GET | low |
| web_get_user_honors | 用 urn 取荣誉奖项 | user.md | GET | low |
| web_get_user_interests_groups | 用 urn 取感兴趣的群组 | user.md | GET | low |
| web_get_user_interests_companies | 用 urn 取感兴趣的公司 | user.md | GET | low |
| web_get_user_reactions | 用 urn 取点赞反应 | user.md | GET | low |
| web_get_user_volunteers | 用 urn 取志愿者经历 | user.md | GET | low |
| web_search_people | 搜索用户（**username→urn 入口**） | user.md | GET | low |
| web_search_location | 搜索地理位置（辅助搜索） | user.md | GET | low |
| web_search_schools | 搜索学校（辅助搜索） | user.md | GET | low |
| web_get_company_profile | 用 company/company_id 取公司资料 | company.md | GET | low |
| web_get_company_people | 用 company_id 取公司员工 | company.md | GET | low |
| web_get_company_posts | 用 company_id 取公司帖子 | company.md | GET | low |
| web_get_company_jobs | 用 company_id 取公司职位 | company.md | GET | low |
| web_get_company_job_count | 用 company_id 取职位数量 | company.md | GET | low |
| web_get_company_affiliated_pages | 用 company_id 取关联页面 | company.md | GET | low |
| web_get_company_associated_member_insights | 用 company_id 取成员洞察 | company.md | GET | low |
| web_search_suggestion_industry | 搜索行业建议（辅助搜索） | company.md | GET | low |
| web_get_post_detail | 用 post_id 取帖子详情（**链式起点**） | content.md | GET | low |
| web_get_post_comments | 用 post_id 取帖子评论 | content.md | GET | low |
| web_get_post_reactions | 用 post_id 取点赞反应 | content.md | GET | low |
| web_get_post_reposts | 用 post_id 取转发 | content.md | GET | low |
| web_get_comments_replies | 用 post_id+comment_id 取回复 | content.md | GET | low |
| web_search_posts | 搜索帖子（**内容冷启动入口**） | content.md | GET | low |
| web_get_group_info | 用 group_id 取群组信息 | content.md | GET | low |
| web_get_group_posts | 用 group_id 取群组帖子 | content.md | GET | low |
| web_search_ads | 搜索广告 | content.md | GET | low |
| web_get_ad_detail | 用 ad_id 取广告详情 | content.md | GET | low |
| web_get_job_detail | 用 job_id 取职位详情 | jobs.md | GET | low |
| web_search_jobs | 搜索职位（**职位冷启动入口**） | jobs.md | GET | low |

### Web V2 API 端点

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| v2_get_user_profile | 用 username 取用户主页（V2，**推荐**） | user.md | GET | low |
| v2_get_user_posts | 用 username 取用户帖子（V2） | user.md | GET | low |
| v2_get_user_comments | 用 username 取用户评论（V2） | user.md | GET | low |
| v2_get_user_contact_info | 用 username 取联系信息（V2） | user.md | GET | low |
| v2_get_user_recommendations | 用 username 取推荐信（V2） | user.md | GET | low |
| v2_get_user_videos | 用 username 取视频帖子（V2） | user.md | GET | low |
| v2_get_user_images | 用 username 取图片帖子（V2） | user.md | GET | low |
| v2_get_user_bio | 用 username 取简介摘要（V2） | user.md | GET | low |
| v2_get_user_follower_and_connection_count | 用 username 取粉丝/连接数（V2） | user.md | GET | low |
| v2_get_user_profile_cards | 用 username 取全部卡片（V2） | user.md | GET | low |
| v2_get_user_experiences | 用 username 取工作经历（V2） | user.md | GET | low |
| v2_get_user_skills | 用 username 取技能（V2） | user.md | GET | low |
| v2_get_user_educations | 用 username 取教育背景（V2） | user.md | GET | low |
| v2_get_user_publications | 用 username 取出版物（V2） | user.md | GET | low |
| v2_get_user_certifications | 用 username 取认证（V2） | user.md | GET | low |
| v2_get_user_honors | 用 username 取荣誉奖项（V2） | user.md | GET | low |
| v2_get_user_interested_groups | 用 username 取关注的群组（V2） | user.md | GET | low |
| v2_get_user_interested_companies | 用 username 取关注的公司（V2） | user.md | GET | low |
| v2_get_user_top_card | 用 username 取顶部卡片（V2） | user.md | GET | low |
| v2_get_user_top_card_supplementary | 用 username 取顶部卡片补充（V2） | user.md | GET | low |
| v2_get_user_recent_activity | 用 username 取近期动态（V2） | user.md | GET | low |
| v2_get_discovery_relevant_to_user | 用 username 取相关推荐（V2） | user.md | GET | low |
| v2_search_users | 用 keywords 搜索用户（V2） | user.md | GET | low |
| v2_get_company_profile | 用 universal_name 取公司资料（V2，**推荐**） | company.md | GET | low |
| v2_get_company_employees | 用 universal_name 取员工（V2） | company.md | GET | low |
| v2_get_company_posts | 用 universal_name 取公司帖子（V2） | company.md | GET | low |
| v2_get_company_jobs | 用 universal_name 取职位（V2） | company.md | GET | low |
| v2_get_company_job_count | 用 universal_name 取职位数量（V2） | company.md | GET | low |
| v2_get_company_similar_companies | 用 universal_name 取相似公司（V2） | company.md | GET | low |
| v2_get_company_competitors | 用 universal_name 取竞争对手（V2） | company.md | GET | low |
| v2_get_company_stock_quote | 用 universal_name 取股价（V2） | company.md | GET | low |
| v2_get_company_call_to_actions | 用 universal_name 取 CTA 按钮（V2） | company.md | GET | low |
| v2_get_company_employee_count_ranges | 用 universal_name 取员工分布（V2） | company.md | GET | low |
| v2_get_company_grouped_locations | 用 universal_name 取办公地点（V2） | company.md | GET | low |
| v2_get_discovery_relevant_to_company | 用 universal_name 取相关推荐（V2） | company.md | GET | low |
| v2_get_post_detail | 用 post_urn 取帖子详情（V2，**推荐**） | content.md | GET | low |
| v2_get_post_detail_by_slug | 用 slug 取帖子详情（V2） | content.md | GET | low |
| v2_get_post_comments | 用 post_urn 取评论（V2） | content.md | GET | low |
| v2_get_comment_replies | 用 comment_urn 取回复（V2） | content.md | GET | low |
| v2_get_post_reactions | 用 post_urn 取反应（V2） | content.md | GET | low |
| v2_get_hashtag_feed | 用 hashtag 取话题动态（V2） | content.md | GET | low |
| v2_get_job_detail | 用 job_id 取职位详情（V2） | jobs.md | GET | low |
| v2_search_jobs | 用 keywords 搜索职位（V2） | jobs.md | GET | low |

---

## 2. 字段流字典 (Field Flow Dictionary)

> 当用户需要的数据需要"先 A 再 B"才能取到时，查此表确认字段如何在端点间传递。

### `username` — LinkedIn 用户名（URL slug）
- **产出**：用户直接提供 / `web_search_people` → `$.data.people[].public_identifier` / `v2_search_users` → `$.data.elements[].public_identifier`
- **输入**：Web 版 `web_get_user_profile` / `web_get_user_contact` / `web_get_user_follower_and_connection`；V2 版全部 user 系端点

### `urn` — 用户 URN（形如 `ACoA...`）
- **产出**：`web_get_user_profile` → `$.data.urn`
- **输入**：Web 版 `web_get_user_posts` / `web_get_user_comments` / `web_get_user_recommendations` / `web_get_user_videos` / `web_get_user_images` / `web_get_user_about` / `web_get_user_experience` / `web_get_user_skills` / `web_get_user_educations` / `web_get_user_publications` / `web_get_user_certifications` / `web_get_user_honors` / `web_get_user_interests_groups` / `web_get_user_interests_companies` / `web_get_user_reactions` / `web_get_user_volunteers`

### `company_id` — 公司数字 ID
- **产出**：`web_get_company_profile` → `$.data.company_id`
- **输入**：Web 版 `web_get_company_people` / `web_get_company_posts` / `web_get_company_jobs` / `web_get_company_job_count` / `web_get_company_affiliated_pages` / `web_get_company_associated_member_insights`

### `universal_name` — 公司 URL slug
- **产出**：`v2_get_company_profile` → `$.data.universal_name` / 用户直接提供
- **输入**：V2 版全部 company 系端点

### `post_id` — 帖子数字 ID（Web 版）
- **产出**：`web_search_posts` → `$.data.posts[].post_id` / `web_get_user_posts` → `$.data.posts[].post_id` / `web_get_company_posts` → `$.data.posts[].post_id`
- **输入**：Web 版 `web_get_post_detail` / `web_get_post_comments` / `web_get_post_reactions` / `web_get_post_reposts` / `web_get_comments_replies`

### `post_urn` — 帖子 URN（V2 版，形如 `urn:li:activity:X`）
- **产出**：`v2_get_user_posts` → `$.data.elements[].post_urn` / `v2_get_company_posts` → `$.data.elements[].post_urn` / `v2_get_hashtag_feed` → `$.data.elements[].post_urn`
- **输入**：V2 版 `v2_get_post_detail` / `v2_get_post_comments` / `v2_get_post_reactions`

### `comment_id` / `comment_urn` — 评论 ID / URN
- **产出**：`web_get_post_comments` → `$.data.comments[].comment_id` / `v2_get_post_comments` → `$.data.elements[].comment_urn`
- **输入**：`web_get_comments_replies` / `v2_get_comment_replies`

### `job_id` — 职位数字 ID
- **产出**：`web_search_jobs` → `$.data.jobs[].job_id` / `v2_search_jobs` → `$.data.elements[].job_id` / `web_get_company_jobs` → `$.data.jobs[].job_id` / `v2_get_company_jobs` → `$.data.elements[].job_id`
- **输入**：`web_get_job_detail` / `v2_get_job_detail`

### `geocode` — 地理位置代码
- **产出**：`web_search_location` → `$.data.locations[].geocode`
- **输入**：`web_search_people` 的 `geocode_location` / `web_search_jobs` 的 `geocode`

### `group_id` — 群组 ID
- **产出**：`web_get_user_interests_groups` → `$.data.groups[].group_id`
- **输入**：`web_get_group_info` / `web_get_group_posts`

### `ad_id` — 广告 ID
- **产出**：`web_search_ads` → `$.data.ads[].ad_id`
- **输入**：`web_get_ad_detail`

### `forum_id` — 话题 ID
- **产出**：`v2_get_hashtag_feed` → `$.data.metadata.forum_id` / `v2_get_post_detail` → `$.data.hashtag.forum_id`
- **输入**：`v2_get_hashtag_feed`（间接）

---

## 3. 全 skill 错误处理总览 (Error Handling Overview)

### HTTP 状态码权威定义（MaxHub API 官方）

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

#### (A) 收到 **404** 时的自检清单 ⚠️ 防路径臆造

按顺序逐项检查，**任一项失败立即 STOP**：

1. **路径白名单逐字符比对** — 把请求的完整路径与 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 中的 `endpoints[].path` 对照
2. **Method 比对** — 实际请求的 HTTP method 是否等于清单中的 `method`
3. **参数键名比对** — 实际请求的所有 query 键名是否都在该端点的 `required` ∪ `optional` 中
4. **资源 ID 来源溯源** — `username` / `urn` / `company_id` / `post_id` 等是否来自之前某个端点的响应字段
5. **若以上全通过** → 才可以判定"上游资源真的不存在"

#### (B) 收到 **400 / 422** 时的自检清单 ⚠️ 防参数臆造

1. **参数名严格比对** — 逐字符等于该端点 IN 表中的 `name`
2. **必填项齐全** — 所有标 `yes` 的参数是否都已传
3. **类型与格式匹配** — string / integer / enum 是否严格匹配
4. **传参方式正确** — GET 端点参数放 query string；Authorization 头格式 `Bearer $MAXHUB_API_KEY`
5. **没有臆造参数** — 是否传入了 IN 表中未列出的参数
6. **若以上全通过** → 按 `message_zh` 进一步排查

---

### 重试策略矩阵

| 错误类型 | 最大重试 | 退避算法 | 是否换端点 |
|---------|---------|---------|----------|
| 400 / 422 参数错 | 1 次（修正参数后） | 立即 | ❌ |
| 401 鉴权错 | 0 | — | STOP |
| 402 余额不足 | 0 | — | STOP |
| 403 权限/账户问题 | 0 | — | STOP |
| 404 / 410 路径错或资源不存在 | 0 | — | ❌ 不改路径，可走端点替换矩阵 |
| 429 限流 | 2 次 | Retry-After 优先；否则 `min(8s, 2^n) * (0.5 + random*0.5)` | ❌ |
| 5xx 上游错 | 1 次 | 固定 3s | ✅ 走端点替换矩阵 |
| 网络超时 / DNS | 0 | — | STOP |
| 业务 `code != 0` | 0 | — | 读 `message_zh` 报告 |

### 降级策略原则
1. **版本降级**：V2 端点失败 → 尝试 Web 版本端点（字段名可能不同，必须显式告知用户）
2. **数据完整度降级**：详情接口失败 → 列表接口取相同字段
3. **维度降级**：用户资料失败 → search_people 取概要

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
| v2_get_user_profile | web_get_user_profile | V2 失败时 | V2 字段更丰富；Web 版需 urn 做后续调用 |
| v2_get_user_posts | web_get_user_posts | V2 失败且已有 urn | Web 版需 urn 非 username；分页方式不同 |
| v2_get_post_detail | web_get_post_detail | V2 失败且已有 post_id | V2 支持 URN 多格式；Web 版仅支持数字 ID |
| v2_get_post_comments | web_get_post_comments | V2 失败且已有 post_id | V2 排序选项更多 |
| v2_get_company_profile | web_get_company_profile | V2 失败时 | V2 用 universal_name；Web 用 company/company_id |
| v2_get_company_jobs | web_get_company_jobs | V2 失败且已有 company_id | Web 版过滤参数更多 |
| v2_search_jobs | web_search_jobs | V2 失败时 | Web 版过滤参数更多 |
| v2_get_job_detail | web_get_job_detail | V2 失败时 | V2 字段更丰富 |
| web_get_user_profile | v2_get_user_profile | Web 版失败时 | V2 用 username（同 Web），字段更丰富 |
| web_get_post_detail | v2_get_post_detail | Web 版失败且已有 post_urn | V2 需 post_urn |
| web_search_people | v2_search_users | Web 版失败时 | V2 用 keywords；Web 用 name/first_name/last_name |
| web_get_company_profile | v2_get_company_profile | Web 版失败时 | 需先取得 universal_name |

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
1. **国内首选 ⭐⭐⭐**：`skillhub upgrade maxhub-linkedin`
2. **国际主源 ⭐⭐⭐**：`clawhub upgrade maxhub-linkedin`
3. **降级方案**：`git pull` 仓库 https://github.com/XieWxx/maxhub-api-skills

### 当前版本
- 读取 [`../_meta.json`](../_meta.json) 中的 `version` 字段（当前：`3.7.2`）
