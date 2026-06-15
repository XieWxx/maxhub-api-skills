# Zhihu Posts / 知乎 内容

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
专栏文章、文章详情、评论、子评论、问题回答、首页推荐、热榜、视频榜 —— 围绕"内容"的全部读取入口。**article_id / answer_id / question_id 多在本文件首步产出**，是其他链式调用的常见起点。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| fetch_column_articles | ⭐⭐⭐ 首选 | 用 column_id 取专栏文章列表 | GET | /api/v1/zhihu/web/fetch_column_articles | low |
| fetch_column_article_detail | ⭐⭐⭐ 首选 | 用 article_id 取文章详情 | GET | /api/v1/zhihu/web/fetch_column_article_detail | low |
| fetch_column_recommend | ⭐⭐ 条件 | 用 article_id 取相似专栏推荐 | GET | /api/v1/zhihu/web/fetch_column_recommend | low |
| fetch_column_relationship | ⭐⭐ 条件 | 用 article_id 取文章互动关系 | GET | /api/v1/zhihu/web/fetch_column_relationship | low |
| fetch_column_comment_config | ⭐ 条件 | 用 article_id 取评论区配置 | GET | /api/v1/zhihu/web/fetch_column_comment_config | low |
| fetch_comment_v5 | ⭐⭐⭐ 首选 | 用 answer_id 取评论区 | GET | /api/v1/zhihu/web/fetch_comment_v5 | low |
| fetch_sub_comment_v5 | ⭐⭐ 条件 | 用 comment_id 取子评论 | GET | /api/v1/zhihu/web/fetch_sub_comment_v5 | low |
| fetch_question_answers | ⭐⭐⭐ 首选 | 用 question_id 取问题回答列表 | GET | /api/v1/zhihu/web/fetch_question_answers | low |
| fetch_hot_recommend | ⭐⭐⭐ 首选 | 取首页推荐（**内容冷启动入口**） | GET | /api/v1/zhihu/web/fetch_hot_recommend | low |
| fetch_hot_list | ⭐⭐⭐ 首选 | 取首页热榜 | GET | /api/v1/zhihu/web/fetch_hot_list | low |
| fetch_video_list | ⭐⭐ 条件 | 取首页视频榜 | GET | /api/v1/zhihu/web/fetch_video_list | low |

## 链式调用图谱 (Chain Recipes)

| 用户目标 | 链路 | 字段流 | 容错 |
|---------|------|-------|------|
| 专栏文章 → 文章详情 | fetch_column_articles → fetch_column_article_detail | `$.data.data[].id` → `article_id` | 第 2 步失败：返回列表 + "详情暂不可取" |
| 文章详情 → 互动关系 | fetch_column_article_detail → fetch_column_relationship | `$.data.id` → `article_id` | 第 2 步失败：返回详情 + "互动数据暂不可取" |
| 文章详情 → 相似专栏 | fetch_column_article_detail → fetch_column_recommend | `$.data.id` → `article_id` | 第 2 步空：返回详情 + "暂无推荐" |
| 问题 → 回答 → 评论 | fetch_question_answers → fetch_comment_v5 | `$.data.data[].id` → `answer_id` | 中间步失败：返回已有数据 |
| 评论 → 子评论 | fetch_comment_v5 → fetch_sub_comment_v5 | `$.data.data[].id` → `comment_id` | 第 2 步空：返回已有评论 |
| 热榜 → 问题回答 | fetch_hot_list → fetch_question_answers | `$.data.data[].target.id` → `question_id` | 跨文件链路 |
| 推荐/热榜 → 用户 | fetch_hot_list → user.md fetch_user_info | `$.data.data[].target.author.url_token` → `user_url_token` | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`search.md` 的 `fetch_article_search_v3` 输出 article_id → 本文件
- **流入本文件**：`user.md` 的 `fetch_user_articles` 输出 article_id → 本文件
- **流出本文件**：`$.data.data[].author.url_token` → `user.md` 全部 user 系端点
- **流出本文件**：`fetch_column_articles` 输出 article_id → 本文件多端点

## 错误处理契约 (Error Contract · 本文件全端点共享)

> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- 必须先做防臆造自检（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md)）
- 自检通过后 STOP，禁止改路径段重试

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- 必须先做防臆造自检（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md)）
- 修正后重试 ≤1 次

### 401 → STOP；402 → STOP；403 → STOP；429 → 退避重试 ≤2 次；5xx → 等 3s 重试 ≤1 次
### 网络超时 → STOP；业务 code≠0 → 读 message_zh，不重试

---

## 端点详情

### fetch_column_articles — 获取专栏文章列表

**Full path:** `/api/v1/zhihu/web/fetch_column_articles`
**Method:** GET · **Risk:** low

#### 用途
获取指定专栏的文章列表。**article_id 的常见产出端**。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| column_id | string | yes | — | 专栏 ID，形如 `zhangjiawei` |
| limit | string | no | default="10" | 每页文章数量 |
| offset | string | no | default="0" | 偏移量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data[].id | `$.data.data[].id` | 文章 ID | fetch_column_article_detail / fetch_column_recommend / fetch_column_relationship / fetch_column_comment_config |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 专栏不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_column_article_detail — 获取文章详情

**Full path:** `/api/v1/zhihu/web/fetch_column_article_detail`
**Method:** GET · **Risk:** low

#### 用途
获取指定文章的完整详情。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| article_id | string | yes | — | 文章 ID，形如 `669214677` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| id | `$.data.id` | 文章 ID（回显） | fetch_column_recommend / fetch_column_relationship |
| author.url_token | `$.data.author.url_token` | 作者用户标识 | user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 文章不存在 | STOP | 0 | **降级**：fetch_column_articles 列表中取摘要 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 同上降级 |

---

### fetch_column_recommend — 获取相似专栏推荐

**Full path:** `/api/v1/zhihu/web/fetch_column_recommend`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| article_id | string | yes | — | 文章 ID |
| limit | string | no | default="12" | 每页专栏数量 |
| offset | string | no | default="0" | 偏移量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 推荐专栏列表 | — |

---

### fetch_column_relationship — 获取文章互动关系

**Full path:** `/api/v1/zhihu/web/fetch_column_relationship`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| article_id | string | yes | — | 文章 ID |

---

### fetch_column_comment_config — 获取评论区配置

**Full path:** `/api/v1/zhihu/web/fetch_column_comment_config`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| article_id | string | yes | — | 文章 ID |

---

### fetch_comment_v5 — 获取评论区 V5

**Full path:** `/api/v1/zhihu/web/fetch_comment_v5`
**Method:** GET · **Risk:** low

#### 用途
获取指定回答的评论列表。**comment_id 的常见产出端**。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| answer_id | string | yes | — | 回答 ID |
| order_by | string | no | enum=`["score","ts"]`，default="score" | 排序：score=最热，ts=最新 |
| limit | string | no | default="20" | 每页评论数量 |
| offset | string | no | — | 偏移量/页码 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data[].id | `$.data.data[].id` | 评论 ID | fetch_sub_comment_v5 |
| data[].author.url_token | `$.data.data[].author.url_token` | 评论者标识 | user.md |

---

### fetch_sub_comment_v5 — 获取子评论区 V5

**Full path:** `/api/v1/zhihu/web/fetch_sub_comment_v5`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| comment_id | string | yes | — | 评论 ID（从 fetch_comment_v5 获取） |
| order_by | string | no | enum=`["score","ts"]`，default="score" | 排序 |
| limit | string | no | default="20" | 每页数量 |
| offset | string | no | — | 偏移量 |

---

### fetch_question_answers — 获取问题回答列表

**Full path:** `/api/v1/zhihu/web/fetch_question_answers`
**Method:** GET · **Risk:** low

#### 用途
获取指定问题的回答列表。**answer_id 的常见产出端**。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| question_id | string | yes | — | 问题 ID |
| cursor | string | no | — | 分页游标 |
| limit | integer | no | default=5 | 每页回答数量 |
| offset | integer | no | default=0 | 偏移量 |
| order | string | no | enum=`["default","updated"]` | 排序：default=默认，updated=按时间 |
| session_id | string | no | ⚠️ 敏感参数 | 登录凭据，仅用户明确授权时使用 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data[].id | `$.data.data[].id` | 回答 ID | fetch_comment_v5 |
| data[].author.url_token | `$.data.data[].author.url_token` | 回答者标识 | user.md |
| cursor | `$.data.cursor` | 下一页游标 | 同端点翻页 |

---

### fetch_hot_recommend — 获取首页推荐

**Full path:** `/api/v1/zhihu/web/fetch_hot_recommend`
**Method:** GET · **Risk:** low

#### 用途
获取知乎首页推荐内容。**内容冷启动入口**。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| offset | string | no | default="0" | 偏移量 |
| page_number | string | no | default="1" | 页码 |
| session_token | string | no | ⚠️ 敏感参数 | 登录凭据，仅用户明确授权时使用 |

---

### fetch_hot_list — 获取首页热榜

**Full path:** `/api/v1/zhihu/web/fetch_hot_list`
**Method:** GET · **Risk:** low

#### 用途
获取知乎热榜。**question_id 的常见产出端**。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| limit | string | no | default="50" | 每页数量 |
| desktop | string | no | default="true" | 是否桌面端 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data[].target.id | `$.data.data[].target.id` | 问题 ID | fetch_question_answers |
| data[].target.author.url_token | `$.data.data[].target.author.url_token` | 作者标识 | user.md |

---

### fetch_video_list — 获取首页视频榜

**Full path:** `/api/v1/zhihu/web/fetch_video_list`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| offset | string | no | default="0" | 偏移量 |
| limit | string | no | default="12" | 每页数量 |
