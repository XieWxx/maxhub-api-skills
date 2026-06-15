# LinkedIn Companies / 领英 公司

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
公司资料、员工列表、帖子、职位、职位数量、关联页面、成员洞察、竞争对手、相似公司、股价、CTA按钮、员工分布、办公地点、发现推荐。含 Web 和 Web V2 双版本。**company_id 与 universal_name 多在本文件首步产出**。

## 端点索引 (Endpoint Index)

### Web API

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| web_get_company_profile | ⭐⭐⭐ 首选 | 用 company/company_id 取公司资料（**链式起点**） | GET | /api/v1/linkedin/web/get_company_profile | low |
| web_get_company_people | ⭐⭐ 条件 | 用 company_id 取公司员工 | GET | /api/v1/linkedin/web/get_company_people | low |
| web_get_company_posts | ⭐⭐ 条件 | 用 company_id 取公司帖子 | GET | /api/v1/linkedin/web/get_company_posts | low |
| web_get_company_jobs | ⭐⭐ 条件 | 用 company_id 取公司职位 | GET | /api/v1/linkedin/web/get_company_jobs | low |
| web_get_company_job_count | ⭐⭐ 条件 | 用 company_id 取职位数量 | GET | /api/v1/linkedin/web/get_company_job_count | low |
| web_get_company_affiliated_pages | ⭐ 条件 | 用 company_id 取关联页面 | GET | /api/v1/linkedin/web/get_company_affiliated_pages | low |
| web_get_company_associated_member_insights | ⭐ 条件 | 用 company_id 取成员洞察 | GET | /api/v1/linkedin/web/get_company_associated_member_insights | low |
| web_search_suggestion_industry | ⭐⭐ 辅助 | 搜索行业建议（辅助搜索） | GET | /api/v1/linkedin/web/search_suggestion_industry | low |

### Web V2 API

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| v2_get_company_profile | ⭐⭐⭐ 首选 | 用 universal_name 取公司资料（V2，**推荐**） | GET | /api/v1/linkedin/web_v2/get_company_profile | low |
| v2_get_company_employees | ⭐⭐ 条件 | 用 universal_name 取员工（V2） | GET | /api/v1/linkedin/web_v2/get_company_employees | low |
| v2_get_company_posts | ⭐⭐ 条件 | 用 universal_name 取公司帖子（V2） | GET | /api/v1/linkedin/web_v2/get_company_posts | low |
| v2_get_company_jobs | ⭐⭐ 条件 | 用 universal_name 取职位（V2） | GET | /api/v1/linkedin/web_v2/get_company_jobs | low |
| v2_get_company_job_count | ⭐⭐ 条件 | 用 universal_name 取职位数量（V2） | GET | /api/v1/linkedin/web_v2/get_company_job_count | low |
| v2_get_company_similar_companies | ⭐ 条件 | 用 universal_name 取相似公司（V2） | GET | /api/v1/linkedin/web_v2/get_company_similar_companies | low |
| v2_get_company_competitors | ⭐ 条件 | 用 universal_name 取竞争对手（V2） | GET | /api/v1/linkedin/web_v2/get_company_competitors | low |
| v2_get_company_stock_quote | ⭐ 条件 | 用 universal_name 取股价（V2，仅上市） | GET | /api/v1/linkedin/web_v2/get_company_stock_quote | low |
| v2_get_company_call_to_actions | ⭐ 条件 | 用 universal_name 取 CTA 按钮（V2） | GET | /api/v1/linkedin/web_v2/get_company_call_to_actions | low |
| v2_get_company_employee_count_ranges | ⭐ 条件 | 用 universal_name 取员工分布（V2） | GET | /api/v1/linkedin/web_v2/get_company_employee_count_ranges | low |
| v2_get_company_grouped_locations | ⭐ 条件 | 用 universal_name 取办公地点（V2） | GET | /api/v1/linkedin/web_v2/get_company_grouped_locations | low |
| v2_get_discovery_relevant_to_company | ⭐ 条件 | 用 universal_name 取相关推荐（V2） | GET | /api/v1/linkedin/web_v2/get_discovery_relevant_to_company | low |

## 链式调用图谱 (Chain Recipes)

| 用户目标 | 链路 | 字段流 | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 公司名→资料 | web_get_company_profile | company → company_id | 失败：尝试 v2_get_company_profile（需 universal_name） |
| 公司→员工 | v2_get_company_employees | universal_name 复用 | 失败：降级 web_get_company_people（需 company_id） |
| 公司→帖子 | v2_get_company_posts | universal_name 复用 | 失败：降级 web_get_company_posts（需 company_id） |
| 公司→职位 | v2_get_company_jobs | universal_name 复用 | 失败：降级 web_get_company_jobs（需 company_id） |
| 公司→竞品分析 | v2_get_company_profile → v2_get_company_competitors | universal_name 复用 | 第 1 步失败：STOP |
| 公司帖子→帖子详情 | web_get_company_posts → content.md 的 web_get_post_detail | `$.data.posts[].post_id` → `post_id` | 跨文件链路 |
| 公司职位→职位详情 | web_get_company_jobs → jobs.md 的 web_get_job_detail | `$.data.jobs[].job_id` → `job_id` | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`user.md` 的 `web_get_user_interests_companies` 输出公司信息 → 本文件
- **流出本文件**：`web_get_company_posts` / `v2_get_company_posts` 输出 `post_id` / `post_urn` → `content.md`
- **流出本文件**：`web_get_company_jobs` / `v2_get_company_jobs` 输出 `job_id` → `jobs.md`
- **流出本文件**：`web_get_company_people` / `v2_get_company_employees` 输出用户 username → `user.md`

## 错误处理契约 (Error Contract)

> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

- 路径/参数/鉴权/余额/权限/限流/上游/网络/业务错误：通用处理见 param-mappings.md
- **特别注意**：Web 版用 `company_id`，V2 版用 `universal_name`，不可混用
- `web_get_company_profile` 的 `company` 和 `company_id` 至少提供一个

---

## 端点详情

### web_get_company_profile — 获取公司资料 (Web)

**Full path:** `/api/v1/linkedin/web/get_company_profile`
**Method:** GET · **Risk:** low

#### 用途
用公司名称或 ID 获取 LinkedIn 公司资料。**链式起点**——产出 `company_id` 供后续 Web 版端点使用。

#### 何时使用 / 不使用
- ✅ 已知公司名称或 company_id
- ✅ 链式起点：company/company_id → company_id
- ❌ 推荐用 V2 版 `v2_get_company_profile`（字段更丰富，用 universal_name）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| company | string | no | — | 公司名称 |
| company_id | string | no | — | 公司 ID（+1 请求） |

> company 和 company_id 至少提供一个。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| company_id | `$.data.company_id` | 公司数字 ID | Web 版全部 company 系端点 |

---

### v2_get_company_profile — 获取公司主页资料 (V2)

**Full path:** `/api/v1/linkedin/web_v2/get_company_profile`
**Method:** GET · **Risk:** low

#### 用途
用 universal_name（公司 URL slug）获取公司主页资料（V2 版本，**推荐优先使用**）。

#### 何时使用 / 不使用
- ✅ 已知公司 URL slug（如 `microsoft`）（**推荐**）
- ✅ 链式起点：universal_name → 全部 V2 company 系端点
- ❌ 只知公司名称不知 slug → 先用 web_get_company_profile 查找

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| universal_name | string | yes | — | 公司 URL slug（如 `microsoft`） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| universal_name | `$.data.universal_name` | 公司 slug（回显） | V2 全部 company 系端点 |
| name | `$.data.name` | 公司名称 | 仅展示 |
| followers_count | `$.data.followers_count` | 粉丝数 | 仅展示 |

---

### 其他 Web 版端点（简要）

| 端点 ID | 路径 | 必填参数 | 可选参数 | 用途 |
|---------|------|---------|---------|------|
| web_get_company_people | /api/v1/linkedin/web/get_company_people | company_id | page | 取公司员工 |
| web_get_company_posts | /api/v1/linkedin/web/get_company_posts | company_id | page, sort_by(top/recent) | 取公司帖子 |
| web_get_company_jobs | /api/v1/linkedin/web/get_company_jobs | company_id | page, sort_by, date_posted, experience_level, remote, job_type, easy_apply, under_10_applicants, fair_chance_employer | 取公司职位 |
| web_get_company_job_count | /api/v1/linkedin/web/get_company_job_count | company_id | — | 取职位数量 |
| web_get_company_affiliated_pages | /api/v1/linkedin/web/get_company_affiliated_pages | company_id | — | 取关联页面 |
| web_get_company_associated_member_insights | /api/v1/linkedin/web/get_company_associated_member_insights | company_id | — | 取成员洞察 |
| web_search_suggestion_industry | /api/v1/linkedin/web/search_suggestion_industry | keyword | — | 搜索行业建议 |

### 其他 V2 版端点（简要）

| 端点 ID | 路径 | 必填参数 | 可选参数 | 用途 |
|---------|------|---------|---------|------|
| v2_get_company_employees | /api/v1/linkedin/web_v2/get_company_employees | universal_name | start, count | 取员工列表 |
| v2_get_company_posts | /api/v1/linkedin/web_v2/get_company_posts | universal_name | start, count | 取公司帖子 |
| v2_get_company_jobs | /api/v1/linkedin/web_v2/get_company_jobs | universal_name | start, count | 取职位列表 |
| v2_get_company_job_count | /api/v1/linkedin/web_v2/get_company_job_count | universal_name | — | 取职位总数 |
| v2_get_company_similar_companies | /api/v1/linkedin/web_v2/get_company_similar_companies | universal_name | — | 取相似公司 |
| v2_get_company_competitors | /api/v1/linkedin/web_v2/get_company_competitors | universal_name | — | 取竞争对手 |
| v2_get_company_stock_quote | /api/v1/linkedin/web_v2/get_company_stock_quote | universal_name | — | 取股价（仅上市） |
| v2_get_company_call_to_actions | /api/v1/linkedin/web_v2/get_company_call_to_actions | universal_name | — | 取 CTA 按钮 |
| v2_get_company_employee_count_ranges | /api/v1/linkedin/web_v2/get_company_employee_count_ranges | universal_name | — | 取员工分布 |
| v2_get_company_grouped_locations | /api/v1/linkedin/web_v2/get_company_grouped_locations | universal_name | — | 取办公地点 |
| v2_get_discovery_relevant_to_company | /api/v1/linkedin/web_v2/get_discovery_relevant_to_company | universal_name | count, start, pagination_token | 取相关推荐 |
