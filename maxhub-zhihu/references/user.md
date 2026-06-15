# Zhihu Users / 知乎 用户

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
用户信息、关注列表、粉丝列表、文章、被收录文章、订阅专栏、关注问题/收藏/话题、推荐关注 —— 围绕"用户"的全部读取入口。**user_url_token 多在本文件首步产出**（fetch_user_info 是已知 token 时的链式入口）。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| fetch_user_info | ⭐⭐⭐ 首选 | 用 user_url_token 取用户信息 | GET | /api/v1/zhihu/web/fetch_user_info | low |
| fetch_user_followees | ⭐⭐ 条件 | 用 user_url_token 取关注列表 | GET | /api/v1/zhihu/web/fetch_user_followees | low |
| fetch_user_followers | ⭐⭐ 条件 | 用 user_url_token 取粉丝列表 | GET | /api/v1/zhihu/web/fetch_user_followers | low |
| fetch_user_articles | ⭐⭐⭐ 首选 | 用 user_url_token 取用户文章列表 | GET | /api/v1/zhihu/web/fetch_user_articles | low |
| fetch_user_included_articles | ⭐⭐ 条件 | 用 user_url_token 取被收录文章 | GET | /api/v1/zhihu/web/fetch_user_included_articles | low |
| fetch_user_follow_columns | ⭐⭐ 条件 | 用 user_url_token 取订阅专栏 | GET | /api/v1/zhihu/web/fetch_user_follow_columns | low |
| fetch_user_follow_questions | ⭐⭐ 条件 | 用 user_url_token 取关注问题 | GET | /api/v1/zhihu/web/fetch_user_follow_questions | low |
| fetch_user_follow_collections | ⭐⭐ 条件 | 用 user_url_token 取关注收藏 | GET | /api/v1/zhihu/web/fetch_user_follow_collections | low |
| fetch_user_follow_topics | ⭐⭐ 条件 | 用 user_url_token 取关注话题 | GET | /api/v1/zhihu/web/fetch_user_follow_topics | low |
| fetch_recommend_followees | ⭐ 工具 | 取推荐关注列表 | GET | /api/v1/zhihu/web/fetch_recommend_followees | low |

## 链式调用图谱 (Chain Recipes)

| 用户目标 | 链路 | 字段流 | 容错 |
|---------|------|-------|------|
| 搜索用户 → 用户主页 | search.md fetch_user_search_v3 → fetch_user_info | `$.data.data[0].url_token` → `user_url_token` | 第 1 步空：STOP |
| 用户主页 → 用户文章 | fetch_user_info → fetch_user_articles | `$.data.url_token` → `user_url_token` | 第 2 步失败：返回资料 + "文章暂不可取" |
| 用户主页 → 社交圈 | fetch_user_info → fetch_user_followees + fetch_user_followers（可并行） | user_url_token 复用 | 任一失败：返回另一份 + 告知缺失 |
| 用户文章 → 文章详情 | fetch_user_articles → post.md fetch_column_article_detail | `$.data.data[].id` → `article_id` | 跨文件 |
| 用户订阅专栏 → 专栏文章 | fetch_user_follow_columns → post.md fetch_column_articles | `$.data.data[].id` → `column_id` | 跨文件 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`post.md` 的 `fetch_comment_v5` / `fetch_question_answers` 输出 `author.url_token` → 本文件
- **流入本文件**：`search.md` 的 `fetch_user_search_v3` 输出 `url_token` → 本文件
- **流出本文件**：`fetch_user_articles` 的 `$.data.data[].id` → `post.md`
- **流出本文件**：`fetch_user_follow_columns` 的 `$.data.data[].id` → `post.md` fetch_column_articles

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

### fetch_user_info — 获取用户信息

**Full path:** `/api/v1/zhihu/web/fetch_user_info`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的完整信息。**user 系链式调用的常见验证步**。

#### 何时使用 / 不使用
- ✅ 已知 user_url_token，想看用户主页
- ❌ 只有用户名 → 先用 `search.md` 的 fetch_user_search_v3

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_url_token | string | yes | — | 用户 URL Token，形如 `ming-he-43-93` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| url_token | `$.data.url_token` | 用户标识（回显） | 复用 |
| name | `$.data.name` | 用户名 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | **降级**：fetch_user_search_v3 取候选 |

---

### fetch_user_followees — 获取关注列表

**Full path:** `/api/v1/zhihu/web/fetch_user_followees`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_url_token | string | yes | — | 用户标识 |
| offset | string | no | default="0" | 偏移量 |
| limit | string | no | default="20" | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data[].url_token | `$.data.data[].url_token` | 被关注用户标识 | 本文件 user 系端点 |

---

### fetch_user_followers — 获取粉丝列表

**Full path:** `/api/v1/zhihu/web/fetch_user_followers`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_url_token | string | yes | — | 用户标识 |
| offset | string | no | default="0" | 偏移量 |
| limit | string | no | default="20" | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data[].url_token | `$.data.data[].url_token` | 粉丝用户标识 | 本文件 user 系端点 |

---

### fetch_user_articles — 获取用户文章列表

**Full path:** `/api/v1/zhihu/web/fetch_user_articles`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的文章列表。**article_id 的常见产出端**，可链式到 post.md。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_url_token | string | yes | — | 用户标识 |
| offset | string | no | default="0" | 偏移量 |
| limit | string | no | default="20" | 每页数量 |
| sort_type | string | no | enum=`["created","voteups"]`，default="created" | 排序：created=按时间，voteups=按点赞 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data[].id | `$.data.data[].id` | 文章 ID | post.md fetch_column_article_detail |

---

### fetch_user_included_articles — 获取被收录文章

**Full path:** `/api/v1/zhihu/web/fetch_user_included_articles`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_url_token | string | yes | — | 用户标识 |
| offset | string | no | default="0" | 偏移量 |
| limit | string | no | default="20" | 每页数量 |

---

### fetch_user_follow_columns — 获取订阅专栏

**Full path:** `/api/v1/zhihu/web/fetch_user_follow_columns`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_url_token | string | yes | — | 用户标识 |
| offset | string | no | default="0" | 偏移量 |
| limit | string | no | default="20" | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data[].id | `$.data.data[].id` | 专栏 ID | post.md fetch_column_articles |

---

### fetch_user_follow_questions — 获取关注问题

**Full path:** `/api/v1/zhihu/web/fetch_user_follow_questions`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_url_token | string | yes | — | 用户标识 |
| offset | string | no | default="0" | 偏移量 |
| limit | string | no | default="20" | 每页数量 |

---

### fetch_user_follow_collections — 获取关注收藏

**Full path:** `/api/v1/zhihu/web/fetch_user_follow_collections`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_url_token | string | yes | — | 用户标识 |
| offset | string | no | default="0" | 偏移量 |
| limit | string | no | default="20" | 每页数量 |

---

### fetch_user_follow_topics — 获取关注话题

**Full path:** `/api/v1/zhihu/web/fetch_user_follow_topics`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_url_token | string | yes | — | 用户标识 |
| offset | string | no | default="0" | 偏移量 |
| limit | string | no | default="20" | 每页数量 |

---

### fetch_recommend_followees — 获取推荐关注列表

**Full path:** `/api/v1/zhihu/web/fetch_recommend_followees`
**Method:** GET · **Risk:** low

无参数。返回推荐关注列表。
