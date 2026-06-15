# LinkedIn User & People / 领英 用户 & 人脉

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
用户资料、帖子、评论、联系信息、推荐信、工作经历、技能、教育背景、出版物、认证、荣誉、兴趣、点赞反应、志愿者经历、粉丝/连接统计、人脉搜索、近期动态、顶部卡片、发现推荐。含 Web 和 Web V2 双版本。**username 与 urn 多在本文件首步产出**，是其他链式调用的常见起点。

## 端点索引 (Endpoint Index)

### Web API

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| web_get_user_profile | ⭐⭐⭐ 首选 | 用 username 取用户资料（**链式起点，产出 urn**） | GET | /api/v1/linkedin/web/get_user_profile | low |
| web_get_user_posts | ⭐⭐ 条件 | 用 urn 取用户帖子 | GET | /api/v1/linkedin/web/get_user_posts | low |
| web_get_user_comments | ⭐⭐ 条件 | 用 urn 取用户评论 | GET | /api/v1/linkedin/web/get_user_comments | low |
| web_get_user_contact | ⭐⭐ 条件 | 用 username 取联系信息（含 PII） | GET | /api/v1/linkedin/web/get_user_contact | low |
| web_get_user_recommendations | ⭐⭐ 条件 | 用 urn 取推荐信 | GET | /api/v1/linkedin/web/get_user_recommendations | low |
| web_get_user_videos | ⭐ 条件 | 用 urn 取用户视频 | GET | /api/v1/linkedin/web/get_user_videos | low |
| web_get_user_images | ⭐ 条件 | 用 urn 取用户图片 | GET | /api/v1/linkedin/web/get_user_images | low |
| web_get_user_about | ⭐ 条件 | 用 urn 取用户简介 | GET | /api/v1/linkedin/web/get_user_about | low |
| web_get_user_follower_and_connection | ⭐⭐ 条件 | 用 username 取粉丝/连接数 | GET | /api/v1/linkedin/web/get_user_follower_and_connection | low |
| web_get_user_experience | ⭐⭐ 条件 | 用 urn 取工作经历 | GET | /api/v1/linkedin/web/get_user_experience | low |
| web_get_user_skills | ⭐⭐ 条件 | 用 urn 取技能 | GET | /api/v1/linkedin/web/get_user_skills | low |
| web_get_user_educations | ⭐⭐ 条件 | 用 urn 取教育背景 | GET | /api/v1/linkedin/web/get_user_educations | low |
| web_get_user_publications | ⭐ 条件 | 用 urn 取出版物 | GET | /api/v1/linkedin/web/get_user_publications | low |
| web_get_user_certifications | ⭐ 条件 | 用 urn 取认证 | GET | /api/v1/linkedin/web/get_user_certifications | low |
| web_get_user_honors | ⭐ 条件 | 用 urn 取荣誉奖项 | GET | /api/v1/linkedin/web/get_user_honors | low |
| web_get_user_interests_groups | ⭐ 条件 | 用 urn 取感兴趣的群组 | GET | /api/v1/linkedin/web/get_user_interests_groups | low |
| web_get_user_interests_companies | ⭐ 条件 | 用 urn 取感兴趣的公司 | GET | /api/v1/linkedin/web/get_user_interests_companies | low |
| web_get_user_reactions | ⭐ 条件 | 用 urn 取点赞反应 | GET | /api/v1/linkedin/web/get_user_reactions | low |
| web_get_user_volunteers | ⭐ 条件 | 用 urn 取志愿者经历 | GET | /api/v1/linkedin/web/get_user_volunteers | low |
| web_search_people | ⭐⭐⭐ 首选 | 搜索用户（**username→urn 入口**） | GET | /api/v1/linkedin/web/search_people | low |
| web_search_location | ⭐⭐ 辅助 | 搜索地理位置（辅助搜索） | GET | /api/v1/linkedin/web/search_location | low |
| web_search_schools | ⭐⭐ 辅助 | 搜索学校（辅助搜索） | GET | /api/v1/linkedin/web/search_schools | low |

### Web V2 API

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| v2_get_user_profile | ⭐⭐⭐ 首选 | 用 username 取用户主页（V2，**推荐**） | GET | /api/v1/linkedin/web_v2/get_user_profile | low |
| v2_get_user_posts | ⭐⭐⭐ 首选 | 用 username 取用户帖子（V2） | GET | /api/v1/linkedin/web_v2/get_user_posts | low |
| v2_get_user_comments | ⭐⭐ 条件 | 用 username 取用户评论（V2） | GET | /api/v1/linkedin/web_v2/get_user_comments | low |
| v2_get_user_contact_info | ⭐⭐ 条件 | 用 username 取联系信息（V2） | GET | /api/v1/linkedin/web_v2/get_user_contact_info | low |
| v2_get_user_recommendations | ⭐⭐ 条件 | 用 username 取推荐信（V2） | GET | /api/v1/linkedin/web_v2/get_user_recommendations | low |
| v2_get_user_videos | ⭐ 条件 | 用 username 取视频帖子（V2） | GET | /api/v1/linkedin/web_v2/get_user_videos | low |
| v2_get_user_images | ⭐ 条件 | 用 username 取图片帖子（V2） | GET | /api/v1/linkedin/web_v2/get_user_images | low |
| v2_get_user_bio | ⭐⭐ 条件 | 用 username 取简介摘要（V2，轻量） | GET | /api/v1/linkedin/web_v2/get_user_bio | low |
| v2_get_user_follower_and_connection_count | ⭐⭐ 条件 | 用 username 取粉丝/连接数（V2） | GET | /api/v1/linkedin/web_v2/get_user_follower_and_connection_count | low |
| v2_get_user_profile_cards | ⭐ 条件 | 用 username 取全部卡片（V2，批量） | GET | /api/v1/linkedin/web_v2/get_user_profile_cards | low |
| v2_get_user_experiences | ⭐⭐ 条件 | 用 username 取工作经历（V2） | GET | /api/v1/linkedin/web_v2/get_user_experiences | low |
| v2_get_user_skills | ⭐⭐ 条件 | 用 username 取技能（V2） | GET | /api/v1/linkedin/web_v2/get_user_skills | low |
| v2_get_user_educations | ⭐⭐ 条件 | 用 username 取教育背景（V2） | GET | /api/v1/linkedin/web_v2/get_user_educations | low |
| v2_get_user_publications | ⭐ 条件 | 用 username 取出版物（V2） | GET | /api/v1/linkedin/web_v2/get_user_publications | low |
| v2_get_user_certifications | ⭐ 条件 | 用 username 取认证（V2） | GET | /api/v1/linkedin/web_v2/get_user_certifications | low |
| v2_get_user_honors | ⭐ 条件 | 用 username 取荣誉奖项（V2） | GET | /api/v1/linkedin/web_v2/get_user_honors | low |
| v2_get_user_interested_groups | ⭐ 条件 | 用 username 取关注的群组（V2） | GET | /api/v1/linkedin/web_v2/get_user_interested_groups | low |
| v2_get_user_interested_companies | ⭐ 条件 | 用 username 取关注的公司（V2） | GET | /api/v1/linkedin/web_v2/get_user_interested_companies | low |
| v2_get_user_top_card | ⭐⭐⭐ 首选 | 用 username 取顶部卡片（V2，全面） | GET | /api/v1/linkedin/web_v2/get_user_top_card | low |
| v2_get_user_top_card_supplementary | ⭐ 条件 | 用 username 取顶部卡片补充（V2） | GET | /api/v1/linkedin/web_v2/get_user_top_card_supplementary | low |
| v2_get_user_recent_activity | ⭐⭐ 条件 | 用 username 取近期动态聚合（V2） | GET | /api/v1/linkedin/web_v2/get_user_recent_activity | low |
| v2_get_discovery_relevant_to_user | ⭐ 条件 | 用 username 取相关推荐（V2） | GET | /api/v1/linkedin/web_v2/get_discovery_relevant_to_user | low |
| v2_search_users | ⭐⭐⭐ 首选 | 用 keywords 搜索用户（V2） | GET | /api/v1/linkedin/web_v2/search_users | low |

## 链式调用图谱 (Chain Recipes)

| 用户目标 | 链路 | 字段流 | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 用户名→完整资料 | web_get_user_profile → 各子节端点 | `$.data.urn` → `urn` | 第 1 步失败：STOP |
| 用户名→帖子 | v2_get_user_posts（直接用 username） | username 复用 | 失败：降级 web_get_user_posts（需先取 urn） |
| 搜索人→资料 | web_search_people → web_get_user_profile | `$.data.people[].public_identifier` → `username` | 第 1 步空：STOP |
| 用户名→工作经历 | v2_get_user_experiences | username 复用 | 失败：降级 web_get_user_experience（需 urn） |
| 用户名→顶部卡片 | v2_get_user_top_card | username 复用 | 失败：降级 v2_get_user_bio |
| 搜索位置→搜索职位 | web_search_location → web_search_jobs | `$.data.locations[].geocode` → `geocode` | 第 1 步失败：用户可手动提供位置 |
| 用户帖子→帖子详情 | web_get_user_posts → content.md 的 web_get_post_detail | `$.data.posts[].post_id` → `post_id` | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`content.md` 的 `web_get_post_detail` 输出 `$.data.author.username` → 本文件 user 系端点
- **流入本文件**：`company.md` 的 `web_get_company_people` 输出用户 username → 本文件
- **流出本文件**：`web_get_user_posts` / `v2_get_user_posts` 输出 `post_id` / `post_urn` → `content.md`
- **流出本文件**：`web_get_user_interests_groups` 输出 `group_id` → `content.md` 的 `web_get_group_info`
- **流出本文件**：`web_get_user_interests_companies` 输出公司信息 → `company.md`

## 错误处理契约 (Error Contract)

> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）
- 必须先做防臆造自检（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- 自检通过后 STOP 并报告"资源不存在"
- 禁止：改路径段 / 切换版本前缀 / 拼接新路径

### 参数错误（400 / 422）
- 必须先做防臆造自检（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数臆造)）
- **特别注意**：Web 版用 `urn`，V2 版用 `username`，不可混用
- 自检通过后修正参数重试 ≤ 1 次

### 鉴权 / 余额 / 权限 / 限流 / 上游故障 / 网络超时 / 业务错误
- 通用处理见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)

---

## 端点详情

### web_get_user_profile — 获取用户资料 (Web)

**Full path:** `/api/v1/linkedin/web/get_user_profile`
**Method:** GET · **Risk:** low

#### 用途
用 username 获取 LinkedIn 用户资料。**链式起点**——产出 `urn` 供后续 Web 版子节端点使用。

#### 何时使用 / 不使用
- ✅ 已知 username，需取完整资料或 urn
- ✅ 链式起点：username → urn
- ❌ 只需粉丝数 → 用 `web_get_user_follower_and_connection`（更轻量）
- ❌ 已知 urn 且只需子节 → 直接调子节端点
- ❌ 推荐用 V2 版 `v2_get_user_profile`（字段更丰富，直接用 username）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| username | string | yes | — | LinkedIn 用户名（URL slug） |
| include_follower_and_connection | string | no | — | 包含粉丝/连接数（+1 请求） |
| include_experiences | string | no | — | 包含工作经历（+1 请求） |
| include_skills | string | no | — | 包含技能（+1 请求） |
| include_certifications | string | no | — | 包含认证（+1 请求） |
| include_publications | string | no | — | 包含出版物（+1 请求） |
| include_educations | string | no | — | 包含教育背景（+1 请求） |
| include_volunteers | string | no | — | 包含志愿者经历（+1 请求） |
| include_honors | string | no | — | 包含荣誉奖项（+1 请求） |
| include_interests | string | no | — | 包含兴趣（+1 请求） |
| include_bio | string | no | — | 包含个人简介（+1 请求） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| urn | `$.data.urn` | 用户 URN | Web 版全部 urn 系端点 |
| public_identifier | `$.data.public_identifier` | 用户名（回显） | 本文件 username 系端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级 v2_get_user_profile |

---

### web_search_people — 搜索用户 (Web)

**Full path:** `/api/v1/linkedin/web/search_people`
**Method:** GET · **Risk:** low

#### 用途
按姓名/职位/公司/学校等条件搜索 LinkedIn 用户。**username→urn 入口**。

#### 何时使用 / 不使用
- ✅ 用户给出人名但不知 username
- ✅ 链式起点：搜索 → username → profile
- ❌ 已知 username → 直接 web_get_user_profile
- ❌ 搜索公司 → company.md

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| name | string | no | — | 搜索关键词 |
| first_name | string | no | — | 名 |
| last_name | string | no | — | 姓 |
| title | string | no | — | 职位 |
| company | string | no | — | 公司 |
| school | string | no | — | 学校 |
| page | string | no | — | 页码（默认 1） |
| geocode_location | string | no | — | 地理位置代码（从 web_search_location 获取） |
| current_company | string | no | — | 当前公司 ID |
| profile_language | string | no | — | 资料语言 |
| industry | string | no | — | 行业 ID |
| service_category | string | no | — | 服务类别 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| people[].public_identifier | `$.data.people[].public_identifier` | 用户名 | web_get_user_profile |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空结果 | 未命中 | STOP，告知用户 | 0 | — |

---

### v2_get_user_profile — 获取用户主页 (V2)

**Full path:** `/api/v1/linkedin/web_v2/get_user_profile`
**Method:** GET · **Risk:** low

#### 用途
用 username 获取 LinkedIn 用户主页资料（V2 版本，**推荐优先使用**）。支持 include 参数一次性附带多个子节。

#### 何时使用 / 不使用
- ✅ 已知 username，需取完整资料（**推荐**）
- ✅ 需要一次性获取多个子节（通过 include 参数）
- ❌ 只需单个子节 → 用专用端点（如 v2_get_user_experiences）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| username | string | yes | — | LinkedIn 用户名 |
| include_follower_and_connection | string | no | — | 附带粉丝/连接数（+1 请求） |
| include_experiences | string | no | — | 附带工作经历 |
| include_skills | string | no | — | 附带技能 |
| include_certifications | string | no | — | 附带认证 |
| include_publications | string | no | — | 附带出版物 |
| include_educations | string | no | — | 附带教育背景 |
| include_volunteers | string | no | — | 附带志愿者经历 |
| include_honors | string | no | — | 附带荣誉奖项 |
| include_interests | string | no | — | 附带兴趣 |
| include_bio | string | no | — | 附带简介 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| profile | `$.data.profile` | 主资料对象 | 仅展示 |
| 各 include 子节 | `$.data.<section>` | 子节数据块 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级 web_get_user_profile |

---

### v2_get_user_top_card — 获取用户顶部卡片 (V2)

**Full path:** `/api/v1/linkedin/web_v2/get_user_top_card`
**Method:** GET · **Risk:** low

#### 用途
用 username 获取用户主页顶部卡片信息（头像、封面、姓名、头衔、当前职位、教育、位置、粉丝/连接数等）。**比 v2_get_user_bio 更全面**。

#### 何时使用 / 不使用
- ✅ 需要用户主页概览信息（**推荐首选**）
- ✅ 链式验证用户是否存在
- ❌ 需要完整资料 → v2_get_user_profile
- ❌ 只需简介 → v2_get_user_bio（更轻量）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| username | string | yes | — | LinkedIn 用户名 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| full_name | `$.data.full_name` | 全名 | 仅展示 |
| headline | `$.data.headline` | 头衔 | 仅展示 |
| follower_count | `$.data.follower_count` | 粉丝数 | 仅展示 |

---

### v2_search_users — 搜索用户 (V2)

**Full path:** `/api/v1/linkedin/web_v2/search_users`
**Method:** GET · **Risk:** low

#### 用途
用关键词搜索 LinkedIn 用户（V2 版本）。支持按地理位置、行业、公司过滤。

#### 何时使用 / 不使用
- ✅ 按关键词搜索用户（**推荐**）
- ✅ 链式起点：搜索 → username → profile
- ❌ 已知 username → 直接 v2_get_user_profile

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keywords | string | yes | — | 搜索关键词 |
| start | integer | no | — | 分页起始偏移（默认 0） |
| count | integer | no | — | 每页数量（默认 10） |
| geo_urn | string | no | — | 地理位置URN |
| industry_urn | string | no | — | 行业URN |
| current_company_urn | string | no | — | 当前公司URN |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| elements[].public_identifier | `$.data.elements[].public_identifier` | 用户名 | V2 全部 user 系端点 |

---

### 其他 Web 版子节端点（简要）

以下端点均用 `urn`（从 `web_get_user_profile` 获取）作为必填参数，`page` 为可选分页参数：

| 端点 ID | 路径 | 用途 |
|---------|------|------|
| web_get_user_posts | /api/v1/linkedin/web/get_user_posts | 用 urn 取用户帖子 |
| web_get_user_comments | /api/v1/linkedin/web/get_user_comments | 用 urn 取用户评论 |
| web_get_user_recommendations | /api/v1/linkedin/web/get_user_recommendations | 用 urn 取推荐信（可选 type: received/given） |
| web_get_user_videos | /api/v1/linkedin/web/get_user_videos | 用 urn 取用户视频 |
| web_get_user_images | /api/v1/linkedin/web/get_user_images | 用 urn 取用户图片 |
| web_get_user_about | /api/v1/linkedin/web/get_user_about | 用 urn 取用户简介 |
| web_get_user_experience | /api/v1/linkedin/web/get_user_experience | 用 urn 取工作经历 |
| web_get_user_skills | /api/v1/linkedin/web/get_user_skills | 用 urn 取技能 |
| web_get_user_educations | /api/v1/linkedin/web/get_user_educations | 用 urn 取教育背景 |
| web_get_user_publications | /api/v1/linkedin/web/get_user_publications | 用 urn 取出版物 |
| web_get_user_certifications | /api/v1/linkedin/web/get_user_certifications | 用 urn 取认证 |
| web_get_user_honors | /api/v1/linkedin/web/get_user_honors | 用 urn 取荣誉奖项 |
| web_get_user_interests_groups | /api/v1/linkedin/web/get_user_interests_groups | 用 urn 取感兴趣的群组 |
| web_get_user_interests_companies | /api/v1/linkedin/web/get_user_interests_companies | 用 urn 取感兴趣的公司 |
| web_get_user_reactions | /api/v1/linkedin/web/get_user_reactions | 用 urn 取点赞反应 |
| web_get_user_volunteers | /api/v1/linkedin/web/get_user_volunteers | 用 urn 取志愿者经历 |

### 其他 V2 版子节端点（简要）

以下端点均用 `username` 作为必填参数：

| 端点 ID | 路径 | 用途 |
|---------|------|------|
| v2_get_user_posts | /api/v1/linkedin/web_v2/get_user_posts | 用 username 取帖子（可选 start/count） |
| v2_get_user_comments | /api/v1/linkedin/web_v2/get_user_comments | 用 username 取评论 |
| v2_get_user_contact_info | /api/v1/linkedin/web_v2/get_user_contact_info | 用 username 取联系信息（含 PII） |
| v2_get_user_recommendations | /api/v1/linkedin/web_v2/get_user_recommendations | 用 username 取推荐信（可选 direction） |
| v2_get_user_videos | /api/v1/linkedin/web_v2/get_user_videos | 用 username 取视频帖子 |
| v2_get_user_images | /api/v1/linkedin/web_v2/get_user_images | 用 username 取图片帖子 |
| v2_get_user_bio | /api/v1/linkedin/web_v2/get_user_bio | 用 username 取简介摘要 |
| v2_get_user_follower_and_connection_count | /api/v1/linkedin/web_v2/get_user_follower_and_connection_count | 用 username 取粉丝/连接数 |
| v2_get_user_profile_cards | /api/v1/linkedin/web_v2/get_user_profile_cards | 用 username 取全部卡片 |
| v2_get_user_experiences | /api/v1/linkedin/web_v2/get_user_experiences | 用 username 取工作经历 |
| v2_get_user_skills | /api/v1/linkedin/web_v2/get_user_skills | 用 username 取技能 |
| v2_get_user_educations | /api/v1/linkedin/web_v2/get_user_educations | 用 username 取教育背景 |
| v2_get_user_publications | /api/v1/linkedin/web_v2/get_user_publications | 用 username 取出版物 |
| v2_get_user_certifications | /api/v1/linkedin/web_v2/get_user_certifications | 用 username 取认证 |
| v2_get_user_honors | /api/v1/linkedin/web_v2/get_user_honors | 用 username 取荣誉奖项 |
| v2_get_user_interested_groups | /api/v1/linkedin/web_v2/get_user_interested_groups | 用 username 取关注的群组 |
| v2_get_user_interested_companies | /api/v1/linkedin/web_v2/get_user_interested_companies | 用 username 取关注的公司 |
| v2_get_user_top_card_supplementary | /api/v1/linkedin/web_v2/get_user_top_card_supplementary | 用 username 取顶部卡片补充 |
| v2_get_user_recent_activity | /api/v1/linkedin/web_v2/get_user_recent_activity | 用 username 取近期动态聚合 |
| v2_get_discovery_relevant_to_user | /api/v1/linkedin/web_v2/get_discovery_relevant_to_user | 用 username 取相关推荐 |

### 辅助搜索端点

| 端点 ID | 路径 | 用途 |
|---------|------|------|
| web_get_user_contact | /api/v1/linkedin/web/get_user_contact | 用 username 取联系信息 |
| web_get_user_follower_and_connection | /api/v1/linkedin/web/get_user_follower_and_connection | 用 username 取粉丝/连接数 |
| web_search_location | /api/v1/linkedin/web/search_location | 用 keyword 搜索地理位置 |
| web_search_schools | /api/v1/linkedin/web/search_schools | 用 keyword 搜索学校 |
