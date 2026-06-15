# Zhihu Search / 知乎 搜索

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
文章搜索、用户搜索、话题搜索、论文搜索、AI 搜索、视频搜索、专栏搜索、盐选搜索、电子书搜索、搜索预设词/发现/预测词 —— 围绕"搜索"的全部入口。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| fetch_article_search_v3 | ⭐⭐⭐ 首选 | 按关键词搜索文章/回答 | GET | /api/v1/zhihu/web/fetch_article_search_v3 | low |
| fetch_user_search_v3 | ⭐⭐⭐ 首选 | 按关键词搜索用户（**用户名→user_url_token 入口**） | GET | /api/v1/zhihu/web/fetch_user_search_v3 | low |
| fetch_topic_search_v3 | ⭐⭐ 条件 | 按关键词搜索话题 | GET | /api/v1/zhihu/web/fetch_topic_search_v3 | low |
| fetch_scholar_search_v3 | ⭐⭐ 条件 | 按关键词搜索论文 | POST | /api/v1/zhihu/web/fetch_scholar_search_v3 | low |
| fetch_ai_search | ⭐⭐ 条件 | 发起 AI 搜索（异步） | GET | /api/v1/zhihu/web/fetch_ai_search | low |
| fetch_ai_search_result | ⭐⭐ 条件 | 用 message_id 取 AI 搜索结果 | GET | /api/v1/zhihu/web/fetch_ai_search_result | low |
| fetch_video_search_v3 | ⭐⭐ 条件 | 按关键词搜索视频 | GET | /api/v1/zhihu/web/fetch_video_search_v3 | low |
| fetch_column_search_v3 | ⭐⭐ 条件 | 按关键词搜索专栏 | GET | /api/v1/zhihu/web/fetch_column_search_v3 | low |
| fetch_salt_search_v3 | ⭐ 条件 | 按关键词搜索盐选内容 | GET | /api/v1/zhihu/web/fetch_salt_search_v3 | low |
| fetch_ebook_search_v3 | ⭐ 条件 | 按关键词搜索电子书 | GET | /api/v1/zhihu/web/fetch_ebook_search_v3 | low |
| fetch_preset_search | ⭐ 工具 | 取搜索预设词 | GET | /api/v1/zhihu/web/fetch_preset_search | low |
| fetch_search_recommend | ⭐ 工具 | 取搜索发现 | GET | /api/v1/zhihu/web/fetch_search_recommend | low |
| fetch_search_suggest | ⭐⭐ 工具 | 取搜索预测词（输入补全） | GET | /api/v1/zhihu/web/fetch_search_suggest | low |

## 链式调用图谱 (Chain Recipes)

| 用户目标 | 链路 | 字段流 | 容错 |
|---------|------|-------|------|
| 搜索用户 → 用户主页 | fetch_user_search_v3 → user.md fetch_user_info | `$.data.data[0].url_token` → `user_url_token` | 第 1 步空：STOP |
| 搜索文章 → 文章详情 | fetch_article_search_v3 → post.md fetch_column_article_detail | `$.data.data[].id` → `article_id` | 跨文件 |
| AI 搜索 | fetch_ai_search → fetch_ai_search_result | `$.data.message_id` → `message_id` | 第 1 步失败：STOP；第 2 步需轮询 |
| 搜索专栏 → 专栏文章 | fetch_column_search_v3 → post.md fetch_column_articles | `$.data.data[].id` → `column_id` | 跨文件 |

## 跨 reference 链路 (In-Chain)
- **流出本文件**：`fetch_user_search_v3` → `user.md` 全部 user 系端点
- **流出本文件**：`fetch_article_search_v3` → `post.md` 多端点
- **流出本文件**：`fetch_column_search_v3` → `post.md` fetch_column_articles

## 错误处理契约

> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 通用规则
- 404/410 → 防臆造自检后 STOP
- 400/422 → 防臆造自检后修正重试 ≤1 次
- 401/402/403 → STOP
- 429 → 退避重试 ≤2 次
- 5xx → 等 3s 重试 ≤1 次
- 业务 code≠0 → 读 message_zh，不重试

---

## 端点详情

### fetch_article_search_v3 — 搜索文章/回答

**Full path:** `/api/v1/zhihu/web/fetch_article_search_v3`
**Method:** GET · **Risk:** low

#### 用途
按关键词搜索知乎文章和回答，支持多种筛选条件。**最常用的搜索入口**。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| offset | string | no | default="0" | 偏移量 |
| limit | string | no | default="20" | 每页数量 |
| show_all_topics | integer | no | enum=`[0,1]`，default=0 | 显示所有主题 |
| search_source | string | no | enum=`["Normal","Filter"]` | 搜索来源 |
| search_hash_id | string | no | — | 搜索哈希 ID（翻页用） |
| vertical | string | no | enum=`["","answer","article","zvideo"]` | 垂类筛选 |
| sort | string | no | enum=`["","upvoted_count","created_time"]` | 排序 |
| time_interval | string | no | enum=`["","a_day","a_week","a_month","three_months","half_a_year","a_year"]` | 时间筛选 |
| vertical_info | string | no | — | 垂类信息 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data[].id | `$.data.data[].id` | 文章/回答 ID | post.md |
| data[].author.url_token | `$.data.data[].author.url_token` | 作者标识 | user.md |
| search_hash_id | `$.data.search_hash_id` | 翻页哈希 | 同端点翻页 |

---

### fetch_user_search_v3 — 搜索用户

**Full path:** `/api/v1/zhihu/web/fetch_user_search_v3`
**Method:** GET · **Risk:** low

#### 用途
按关键词搜索知乎用户。**已知用户名时的链式入口**——把关键词转换为 user_url_token。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| offset | string | no | default="0" | 偏移量 |
| limit | string | no | default="25" | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data[].url_token | `$.data.data[].url_token` | 用户标识 | user.md 全部 user 系端点 |

---

### fetch_topic_search_v3 — 搜索话题

**Full path:** `/api/v1/zhihu/web/fetch_topic_search_v3`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| offset | string | no | default="0" | 偏移量 |
| limit | string | no | default="25" | 每页数量 |

---

### fetch_scholar_search_v3 — 搜索论文

**Full path:** `/api/v1/zhihu/web/fetch_scholar_search_v3`
**Method:** POST · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| offset | string | no | default="0" | 偏移量 |
| limit | string | no | default="25" | 每页数量 |

> ⚠️ 本端点为 POST 方法，keyword 通过 query 传递。

---

### fetch_ai_search — 发起 AI 搜索

**Full path:** `/api/v1/zhihu/web/fetch_ai_search`
**Method:** GET · **Risk:** low

#### 用途
发起知乎 AI 搜索，返回 message_id 用于获取搜索结果。**异步链路的第一步**。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| message_content | string | yes | — | 搜索内容 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| message_id | `$.data.message_id` | 消息 ID | fetch_ai_search_result |

---

### fetch_ai_search_result — 获取 AI 搜索结果

**Full path:** `/api/v1/zhihu/web/fetch_ai_search_result`
**Method:** GET · **Risk:** low

#### 用途
用 message_id 获取 AI 搜索结果。需配合 fetch_ai_search 使用。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| message_id | string | yes | — | 消息 ID（来自 fetch_ai_search） |

---

### fetch_video_search_v3 — 搜索视频

**Full path:** `/api/v1/zhihu/web/fetch_video_search_v3`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| limit | string | no | default="20" | 每页数量 |
| offset | string | no | default="0" | 偏移量 |
| search_hash_id | string | no | — | 搜索哈希 ID |

---

### fetch_column_search_v3 — 搜索专栏

**Full path:** `/api/v1/zhihu/web/fetch_column_search_v3`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| offset | string | no | default="0" | 偏移量 |
| limit | string | no | default="20" | 每页数量 |
| search_hash_id | string | no | — | 搜索哈希 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data[].id | `$.data.data[].id` | 专栏 ID | post.md fetch_column_articles |

---

### fetch_salt_search_v3 — 搜索盐选内容

**Full path:** `/api/v1/zhihu/web/fetch_salt_search_v3`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| offset | string | no | default="0" | 偏移量 |
| limit | string | no | default="20" | 每页数量 |
| search_hash_id | string | no | — | 搜索哈希 ID |

---

### fetch_ebook_search_v3 — 搜索电子书

**Full path:** `/api/v1/zhihu/web/fetch_ebook_search_v3`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| offset | string | no | default="0" | 偏移量 |
| limit | string | no | default="20" | 每页数量 |
| search_hash_id | string | no | — | 搜索哈希 ID |

---

### fetch_preset_search — 搜索预设词

**Full path:** `/api/v1/zhihu/web/fetch_preset_search`
**Method:** GET · **Risk:** low

无参数。返回搜索预设词。

---

### fetch_search_recommend — 搜索发现

**Full path:** `/api/v1/zhihu/web/fetch_search_recommend`
**Method:** GET · **Risk:** low

无参数。返回搜索发现/热搜推荐。

---

### fetch_search_suggest — 搜索预测词

**Full path:** `/api/v1/zhihu/web/fetch_search_suggest`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词（输入补全） |
