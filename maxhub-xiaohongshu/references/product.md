# Xiaohongshu Products & Topics / 小红书 商品与话题

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
商品详情、商品评论、商品推荐、话题详情、话题笔记列表、创作者灵感 —— 围绕"商品与话题"的全部读取入口。均为 App V2 端点。**sku_id 与 page_id 是最常见的链式输入**。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| get_product_detail | ⭐⭐⭐ 首选 | 用 sku_id 取商品详情 | GET | /api/v1/xiaohongshu/app_v2/get_product_detail | low |
| get_product_review_overview | ⭐⭐⭐ 首选 | 用 sku_id 取商品评论总览 | GET | /api/v1/xiaohongshu/app_v2/get_product_review_overview | low |
| get_product_reviews | ⭐⭐ 条件 | 用 sku_id 取商品评论列表（用户明确要"评论"时用） | GET | /api/v1/xiaohongshu/app_v2/get_product_reviews | low |
| get_product_recommendations | ⭐⭐ 条件 | 用 sku_id 取商品推荐列表 | GET | /api/v1/xiaohongshu/app_v2/get_product_recommendations | low |
| get_topic_info | ⭐⭐⭐ 首选 | 用 page_id 取话题详情 | GET | /api/v1/xiaohongshu/app_v2/get_topic_info | low |
| get_topic_feed | ⭐⭐⭐ 首选 | 用 page_id 取话题笔记列表 | GET | /api/v1/xiaohongshu/app_v2/get_topic_feed | low |
| get_creator_inspiration_feed | ⭐ 条件 | 取创作者推荐灵感列表 | GET | /api/v1/xiaohongshu/app_v2/get_creator_inspiration_feed | low |
| get_creator_hot_inspiration_feed | ⭐ 条件 | 取创作者热点灵感列表 | GET | /api/v1/xiaohongshu/app_v2/get_creator_hot_inspiration_feed | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 搜商品 → 看详情 | search.md 的 search_products → get_product_detail | `$.data.items[].sku_id` → `sku_id` | 跨文件链路 |
| 商品详情 + 评论 | get_product_detail → get_product_review_overview + get_product_reviews | sku_id 复用 | 第 2 步失败：返回商品详情 + "评论暂不可取" |
| 商品详情 + 推荐 | get_product_detail → get_product_recommendations | sku_id 复用 | 第 2 步空数据：返回商品详情 + "暂无推荐" |
| 话题详情 + 笔记 | get_topic_info → get_topic_feed | `$.data.page_id` → `page_id` | 第 2 步空数据：返回话题详情 + "暂无笔记" |
| 话题笔记 → 笔记详情 | get_topic_feed → note.md 的 get_image_note_detail | `$.data.notes[].note_id` → `note_id` | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`search.md` 的 `search_products` 输出 `$.data.items[].sku_id` → 本文件商品系端点
- **流出本文件**：`get_topic_feed` 的 `$.data.notes[].note_id` → `note.md` 多端点
- **流出本文件**：`get_topic_feed` 的 `$.data.notes[].user.user_id` → `user.md`（笔记作者）

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- 详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- 详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)

### 鉴权错误（401）→ STOP · 余额（402）→ STOP · 权限（403）→ STOP
### 限流（429）→ 读 Retry-After 退避，最多重试 2 次
### 上游故障（500/502/503/504）→ 等 3s 重试 1 次，仍失败走替换
### 网络超时 → STOP · 业务错误 → 读 message_zh，不重试

---

## 端点详情

### get_product_detail — 获取商品详情

**Full path:** `/api/v1/xiaohongshu/app_v2/get_product_detail`
**Method:** GET · **Risk:** low

#### 用途
获取小红书商品详情，包含价格、规格、库存、商品描述等。

#### 何时使用 / 不使用
- ✅ 已知 sku_id，想看商品详情
- ✅ 链式起点：取商品基础信息
- ❌ 想看商品评论 → get_product_review_overview / get_product_reviews
- ❌ 想看推荐商品 → get_product_recommendations
- ❌ 不知 sku_id → 先用 search.md 的 search_products 搜索

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sku_id | string | yes | — | 商品 SKU ID，如 `669ddd44e05f3700011067ed` |
| source | string | no | default=`mall_search` | 来源 |
| pre_page | string | no | default=`mall_search` | 前置页面 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| sku_id | `$.data.sku_id` | 商品 SKU ID（回显） | 本文件商品系端点复用 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 商品不存在/已下架 | STOP | 0 | 无替代 |

---

### get_product_review_overview — 获取商品评论总览

**Full path:** `/api/v1/xiaohongshu/app_v2/get_product_review_overview`
**Method:** GET · **Risk:** low

#### 用途
获取商品评论总览数据，包含评分分布、好评率、评论标签等。

#### 何时使用 / 不使用
- ✅ 已知 sku_id，想看评论概览（评分/好评率）
- ❌ 想看具体评论内容 → get_product_reviews

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sku_id | string | yes | — | 商品 SKU ID |
| tab | integer | no | default=2 | 标签类型 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| sku_id | `$.data.sku_id` | 商品 SKU ID（回显） | 复用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 商品不存在 | STOP | 0 | 无替代 |

---

### get_product_reviews — 获取商品评论列表

**Full path:** `/api/v1/xiaohongshu/app_v2/get_product_reviews`
**Method:** GET · **Risk:** low

#### 用途
获取商品评论列表数据，支持排序和图片筛选。

#### 何时使用 / 不使用
- ✅ 已知 sku_id，想看具体评论内容
- ❌ 只想看评分概览 → get_product_review_overview（更快）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sku_id | string | yes | — | 商品 SKU ID |
| page | integer | no | min=0, default=0 | 页码，从 0 开始 |
| sort_strategy_type | integer | no | enum=`0, 1` | 排序：0=综合, 1=最新，默认 0 |
| share_pics_only | integer | no | enum=`0, 1` | 仅看有图：0=否, 1=是，默认 0 |
| from_page | string | no | default=`score_page` | 来源页面 |

> **翻页说明**：page 从 0 开始递增。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| reviews[].user.user_id | `$.data.reviews[].user.user_id` | 评论者用户 ID | user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 商品不存在 | STOP | 0 | 无替代 |
| 空数据 | 暂无评论 | 返回"暂无评论" | 0 | — |

---

### get_product_recommendations — 获取商品推荐列表

**Full path:** `/api/v1/xiaohongshu/app_v2/get_product_recommendations`
**Method:** GET · **Risk:** low

#### 用途
获取与指定商品相关的推荐商品列表。

#### 何时使用 / 不使用
- ✅ 已知 sku_id，想看相关推荐商品
- ❌ 想看商品本身详情 → get_product_detail

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sku_id | string | yes | — | 商品 SKU ID |
| cursor_score | string | no | — | 分页游标，首次请求留空；翻页时传入上一次响应返回的 cursor_score |
| region | string | no | default=`US` | 地区 |

> **翻页说明**：首次请求 cursor_score 留空；翻页时传入上一次响应返回的 cursor_score 值。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| items[].sku_id | `$.data.items[].sku_id` | 推荐商品 SKU ID | 本文件商品系端点 |
| cursor_score | `$.data.cursor_score` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 商品不存在 | STOP | 0 | 无替代 |
| 空数据 | 暂无推荐 | 返回"暂无推荐" | 0 | — |

---

### get_topic_info — 获取话题详情

**Full path:** `/api/v1/xiaohongshu/app_v2/get_topic_info`
**Method:** GET · **Risk:** low

#### 用途
获取小红书话题详情，包含 page_info（名称/浏览量/讨论数）、tabs、share_info 等。

#### 何时使用 / 不使用
- ✅ 已知 page_id，想看话题信息
- ✅ 链式起点：取 page_id 供 get_topic_feed 使用
- ❌ 想看话题下的笔记 → get_topic_feed
- ❌ 不知 page_id → 无法直接获取（需从笔记详情中的话题标签获取）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| page_id | string | yes | — | 话题页面ID，如 `5c1cc866febed9000184b7c1` |
| source | string | no | default=`normal` | 来源 |
| note_id | string | no | — | 来源笔记ID，从笔记跳转到话题时传入 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| page_id | `$.data.page_id` | 话题页面 ID（回显） | get_topic_feed.page_id |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 话题不存在 | STOP | 0 | 无替代 |

---

### get_topic_feed — 获取话题笔记列表

**Full path:** `/api/v1/xiaohongshu/app_v2/get_topic_feed`
**Method:** GET · **Risk:** low

#### 用途
获取指定话题下的笔记列表（含分页），支持排序。

#### 何时使用 / 不使用
- ✅ 已知 page_id，想看话题下的笔记
- ✅ 链式产出 note_id 给 `note.md`
- ❌ 想看话题本身信息 → get_topic_info

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| page_id | string | yes | — | 话题页面ID |
| sort | string | no | enum=`trend, time` | 排序：trend(最热), time(最新)，默认 trend |
| cursor_score | string | no | — | 分页游标分数，翻页时传入上一页最后一个 item 的 cursor_score |
| last_note_id | string | no | — | 上一页最后一条笔记ID，翻页时传入 |
| last_note_ct | string | no | — | 上一页最后一条笔记创建时间，翻页时传入 |
| session_id | string | no | — | 会话ID，翻页时保持一致（敏感登录凭据） |
| first_load_time | string | no | — | 首次加载时间戳，翻页时保持一致 |
| source | string | no | default=`normal` | 来源 |

> **翻页说明**：首次请求只传 page_id 和 sort；翻页时取上一次响应最后一个 item 的 cursor_score、id（作为 last_note_id）、create_time（作为 last_note_ct）；建议同时回传 session_id 和 first_load_time。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| notes[].note_id | `$.data.notes[].note_id` | 笔记 ID | note.md 多端点 |
| notes[].user.user_id | `$.data.notes[].user.user_id` | 笔记作者用户 ID | user.md |
| cursor_score | `$.data.cursor_score` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 话题不存在 | STOP | 0 | 无替代 |
| 空数据 | 话题下暂无笔记 | 返回"暂无笔记" | 0 | — |

---

### get_creator_inspiration_feed — 获取创作者推荐灵感列表

**Full path:** `/api/v1/xiaohongshu/app_v2/get_creator_inspiration_feed`
**Method:** GET · **Risk:** low

#### 用途
获取创作者中心推荐灵感流数据。

#### 何时使用 / 不使用
- ✅ 用户问"创作者灵感/推荐内容"
- ❌ 想看热点灵感 → get_creator_hot_inspiration_feed

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cursor | string | no | — | 分页游标，首次请求留空；翻页时传入上一次响应返回的 cursor 值（如 "r_1", "r_2"） |
| tab | integer | no | default=0 | 标签类型 |
| source | string | no | default=`creator_center` | 来源 |

#### 输出可链式字段 (OUT)
无跨文件链式字段。

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |
| 空数据 | 暂无灵感推荐 | 返回"暂无灵感推荐" | 0 | — |

---

### get_creator_hot_inspiration_feed — 获取创作者热点灵感列表

**Full path:** `/api/v1/xiaohongshu/app_v2/get_creator_hot_inspiration_feed`
**Method:** GET · **Risk:** low

#### 用途
获取创作者中心热点灵感流数据。

#### 何时使用 / 不使用
- ✅ 用户问"创作者热点/热门灵感"
- ❌ 想看推荐灵感 → get_creator_inspiration_feed

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cursor | string | no | — | 分页游标，首次请求留空；翻页时传入上一次响应返回的 cursor 值（如 "1", "2"） |

#### 输出可链式字段 (OUT)
无跨文件链式字段。

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |
| 空数据 | 暂无热点灵感 | 返回"暂无热点灵感" | 0 | — |
