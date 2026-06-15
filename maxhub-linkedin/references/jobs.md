# LinkedIn Jobs / 领英 职位

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
职位搜索、职位详情。含 Web 和 Web V2 双版本。**job_id 多在本文件首步产出**（从搜索结果或公司职位列表获取）。

## 端点索引 (Endpoint Index)

### Web API

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| web_search_jobs | ⭐⭐⭐ 首选 | 搜索职位（**职位冷启动入口**） | GET | /api/v1/linkedin/web/search_jobs | low |
| web_get_job_detail | ⭐⭐⭐ 首选 | 用 job_id 取职位详情 | GET | /api/v1/linkedin/web/get_job_detail | low |

### Web V2 API

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| v2_search_jobs | ⭐⭐⭐ 首选 | 搜索职位（V2） | GET | /api/v1/linkedin/web_v2/search_jobs | low |
| v2_get_job_detail | ⭐⭐⭐ 首选 | 用 job_id 取职位详情（V2） | GET | /api/v1/linkedin/web_v2/get_job_detail | low |

## 链式调用图谱 (Chain Recipes)

| 用户目标 | 链路 | 字段流 | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 搜索职位→详情 | web_search_jobs → web_get_job_detail | `$.data.jobs[].job_id` → `job_id` | 第 1 步空：STOP |
| V2 搜索→详情 | v2_search_jobs → v2_get_job_detail | `$.data.elements[].job_id` → `job_id` | 第 1 步空：STOP |
| 公司职位→详情 | company.md 的 web_get_company_jobs → web_get_job_detail | `$.data.jobs[].job_id` → `job_id` | 跨文件链路 |
| 位置搜索→职位搜索 | user.md 的 web_search_location → web_search_jobs | `$.data.locations[].geocode` → `geocode` | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`company.md` 的 `web_get_company_jobs` / `v2_get_company_jobs` 输出 `job_id` → 本文件
- **流入本文件**：`user.md` 的 `web_search_location` 输出 `geocode` → 本文件 `web_search_jobs`
- **流出本文件**：`web_search_jobs` / `v2_search_jobs` 输出 `job_id` → 本文件 `web_get_job_detail` / `v2_get_job_detail`

## 错误处理契约 (Error Contract)

> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

- 通用错误处理见 param-mappings.md
- **特别注意**：Web 版搜索用 `keyword`，V2 版用 `keywords`，参数名不同

---

## 端点详情

### web_search_jobs — 搜索职位 (Web)

**Full path:** `/api/v1/linkedin/web/search_jobs`
**Method:** GET · **Risk:** low

#### 用途
按关键词搜索 LinkedIn 职位。**职位冷启动入口**——用户没有具体 job_id 时，可从此端点采集。

#### 何时使用 / 不使用
- ✅ 用户想搜索职位（**首选**）
- ✅ 链式起点：搜索 → job_id → 详情
- ❌ 已知 job_id → 直接 web_get_job_detail
- ❌ 想搜特定公司的职位 → company.md 的 web_get_company_jobs

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| page | string | no | — | 页码（默认 1） |
| sort_by | string | no | enum: recent, relevant | 排序方式 |
| date_posted | string | no | enum: anytime, past_month, past_week, past_24_hours | 发布时间过滤 |
| geocode | string | no | — | 地理位置代码（从 web_search_location 获取） |
| company | string | no | — | 公司 ID 过滤 |
| experience_level | string | no | enum: internship, entry_level, associate, mid_senior, director, executive | 经验级别 |
| remote | string | no | enum: onsite, remote, hybrid | 工作地点类型 |
| job_type | string | no | enum: full_time, part_time, contract, temporary, volunteer, internship, other | 工作类型 |
| easy_apply | string | no | — | 是否易申请 |
| has_verifications | string | no | — | 是否有公司认证 |
| under_10_applicants | string | no | — | 是否少于 10 个申请者 |
| fair_chance_employer | string | no | — | 是否公平机会雇主 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| jobs[].job_id | `$.data.jobs[].job_id` | 职位 ID | web_get_job_detail |

---

### web_get_job_detail — 获取职位详情 (Web)

**Full path:** `/api/v1/linkedin/web/get_job_detail`
**Method:** GET · **Risk:** low

#### 用途
用 job_id 获取 LinkedIn 职位详情。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| job_id | string | yes | — | 职位 ID |
| include_skills | string | no | — | 包含技能要求（+1 请求） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| job_id | `$.data.job_id` | 职位 ID（回显） | 仅展示 |

---

### v2_search_jobs — 搜索职位 (V2)

**Full path:** `/api/v1/linkedin/web_v2/search_jobs`
**Method:** GET · **Risk:** low

#### 用途
按关键词搜索 LinkedIn 职位（V2 版本）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keywords | string | yes | — | 搜索关键词 |
| location | string | no | — | 地点（自由文本） |
| start | integer | no | — | 分页起始偏移（默认 0） |
| count | integer | no | — | 每页数量（默认 20） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| elements[].job_id | `$.data.elements[].job_id` | 职位 ID | v2_get_job_detail |

---

### v2_get_job_detail — 获取职位详情 (V2)

**Full path:** `/api/v1/linkedin/web_v2/get_job_detail`
**Method:** GET · **Risk:** low

#### 用途
用 job_id 获取职位详情（V2 版本，字段更丰富）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| job_id | string | yes | — | LinkedIn 职位数字 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| job_id | `$.data.job_id` | 职位 ID（回显） | 仅展示 |
| apply_url | `$.data.apply_url` | 申请链接 | 直接交付用户 |
