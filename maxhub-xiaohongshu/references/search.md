# Xiaohongshu Search & Discovery / 小红书 搜索与发现

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
笔记搜索、用户搜索、图片搜索、商品搜索、群聊搜索、热榜、热搜词、搜索联想词、首页推荐 Feed、首页分类 —— 围绕"搜索与发现"的全部读取入口。支持 App V2、Web V2、Web V3 三个版本。**keyword → note_id / user_id / sku_id 是最常见的链式起点**。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| search_notes | ⭐⭐⭐ 首选 | 用 keyword 搜索笔记（App V2，功能最全） | GET | /api/v1/xiaohongshu/app_v2/search_notes | low |
| search_users | ⭐⭐⭐ 首选 | 用 keyword 搜索用户（App V2，**用户名→user_id 入口**） | GET | /api/v1/xiaohongshu/app_v2/search_users | low |
| search_images | ⭐⭐ 条件 | 用 keyword 搜索图片（App V2） | GET | /api/v1/xiaohongshu/app_v2/search_images | low |
| search_products | ⭐⭐ 条件 | 用 keyword 搜索商品（App V2，**keyword→sku_id 入口**） | GET | /api/v1/xiaohongshu/app_v2/search_products | low |
| search_groups | ⭐ 条件 | 用 keyword 搜索群聊（App V2） | GET | /api/v1/xiaohongshu/app_v2/search_groups | low |
| fetch_hot_list | ⭐⭐⭐ 首选 | 取小红书热榜（Web V2，无参数） | GET | /api/v1/xiaohongshu/web_v2/fetch_hot_list | low |
| fetch_search_notes | ⭐⭐ 降级 | 用 keyword 搜索笔记（Web V3，参数较少） | GET | /api/v1/xiaohongshu/web_v3/fetch_search_notes | low |
| fetch_search_users | ⭐⭐ 降级 | 用 keyword 搜索用户（Web V3，参数较少） | GET | /api/v1/xiaohongshu/web_v3/fetch_search_users | low |
| fetch_trending | ⭐⭐⭐ 首选 | 取热搜词（Web V3，无参数） | GET | /api/v1/xiaohongshu/web_v3/fetch_trending | low |
| fetch_search_suggest | ⭐⭐ 条件 | 取搜索联想词（Web V3） | GET | /api/v1/xiaohongshu/web_v3/fetch_search_suggest | low |
| fetch_homefeed | ⭐⭐ 条件 | 取首页推荐 Feed（Web V3，**冷启动入口**） | GET | /api/v1/xiaohongshu/web_v3/fetch_homefeed | low |
| fetch_homefeed_categories | ⭐⭐ 条件 | 取首页分类列表（Web V3，无参数） | GET | /api/v1/xiaohongshu/web_v3/fetch_homefeed_categories | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 搜索笔记 → 看详情 | search_notes → note.md 的 get_image_note_detail | `$.data.items[].note_id` → `note_id` | 跨文件链路 |
| 搜索用户 → 看主页 | search_users → user.md 的 get_user_info | `$.data.users[].user_id` → `user_id` | 跨文件链路 |
| 搜索商品 → 看详情 | search_products → product.md 的 get_product_detail | `$.data.items[].sku_id` → `sku_id` | 跨文件链路 |
| 热搜词 → 搜索笔记 | fetch_trending → search_notes | 热搜词 → `keyword` | 第 1 步失败：让用户自行输入关键词 |
| 热榜 → 看笔记详情 | fetch_hot_list → note.md | 热榜笔记 note_id → `note_id` | 跨文件链路 |
| 首页推荐 → 看详情 | fetch_homefeed → note.md | `$.data.items[].note_id` → `note_id` | 跨文件链路 |
| 搜索联想 → 搜索 | fetch_search_suggest → search_notes | 联想词 → `keyword` | 第 1 步失败：让用户自行输入 |

## 跨 reference 链路 (In-Chain)
- **流出本文件**：`search_notes` / `fetch_search_notes` 的 `$.data.items[].note_id` → `note.md` 多端点
- **流出本文件**：`search_users` / `fetch_search_users` 的 `$.data.users[].user_id` → `user.md` 多端点
- **流出本文件**：`search_products` 的 `$.data.items[].sku_id` → `product.md` 多端点
- **流出本文件**：`fetch_homefeed` 的 `$.data.items[].note_id` → `note.md`
- **流入本文件**：`fetch_homefeed_categories` 输出分类 ID → `fetch_homefeed.category`

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

### search_notes — 搜索笔记

**Full path:** `/api/v1/xiaohongshu/app_v2/search_notes`
**Method:** GET · **Risk:** low

#### 用途
按关键词搜索小红书笔记。功能最全的搜索端点，支持排序、类型筛选、时间筛选、AI 模式等。

#### 何时使用 / 不使用
- ✅ 用户给出关键词，想搜索笔记
- ✅ 链式起点：keyword → note_id
- ❌ 想搜用户 → search_users
- ❌ 想搜商品 → search_products

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词，如 `美食推荐` |
| page | integer | no | min=1, default=1 | 页码，从 1 开始 |
| sort_type | string | no | enum=`general, time_descending, popularity_descending, comment_descending, collect_descending` | 排序方式，默认 general |
| note_type | string | no | enum=`不限, 视频笔记, 普通笔记, 直播笔记` | 笔记类型，默认 不限 |
| time_filter | string | no | enum=`不限, 一天内, 一周内, 半年内` | 发布时间筛选，默认 不限 |
| search_id | string | no | — | 搜索ID，翻页时传入首次搜索返回的值 |
| search_session_id | string | no | — | 搜索会话ID，翻页时传入首次搜索返回的值（敏感登录凭据） |
| source | string | no | default=`explore_feed` | 来源 |
| ai_mode | integer | no | enum=`0, 1` | AI模式：0=关闭, 1=开启，默认 0 |

> **翻页说明**：首次请求只传 keyword 和 page；翻页时传入首次响应返回的 search_id 和 search_session_id。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| items[].note_id | `$.data.items[].note_id` | 笔记 ID | note.md 多端点 |
| search_id | `$.data.search_id` | 搜索 ID | 同端点翻页 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空结果 | 关键词未命中 | STOP，告知用户 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 fetch_search_notes（Web V3） |

---

### search_users — 搜索用户

**Full path:** `/api/v1/xiaohongshu/app_v2/search_users`
**Method:** GET · **Risk:** low

#### 用途
按关键词搜索小红书用户。**已知用户名时的链式入口**——把 keyword 转换为 user_id，供后续 user 系端点使用。

#### 何时使用 / 不使用
- ✅ 用户给出用户名/昵称但未提供 user_id
- ✅ 链式起点：keyword → user_id
- ❌ 已知 user_id → 直接用 `user.md` 的 get_user_info
- ❌ 想搜笔记 → search_notes

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词，如 `美食博主` |
| page | integer | no | min=1, default=1 | 页码，从 1 开始 |
| search_id | string | no | — | 搜索ID，翻页时传入首次搜索返回的值 |
| source | string | no | default=`explore_feed` | 来源 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| users[].user_id | `$.data.users[].user_id` | 命中用户 ID | user.md 全部 user 系端点 |
| users[].nickname | `$.data.users[].nickname` | 用户昵称 | 用于核对身份避免误命中 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空结果 | 关键词未命中 | STOP，告知用户 | 0 | — |
| 多结果 | 重名 | 让用户选择或返回前 N 个候选 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 fetch_search_users（Web V3） |

---

### search_images — 搜索图片

**Full path:** `/api/v1/xiaohongshu/app_v2/search_images`
**Method:** GET · **Risk:** low

#### 用途
按关键词搜索小红书图片。

#### 何时使用 / 不使用
- ✅ 用户明确想搜图片（如壁纸、头像等）
- ❌ 想搜笔记 → search_notes

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词，如 `壁纸` |
| page | integer | no | min=1, default=1 | 页码 |
| search_id | string | no | — | 搜索ID，翻页时传入 |
| search_session_id | string | no | — | 搜索会话ID（敏感登录凭据） |
| word_request_id | string | no | — | 词请求ID，翻页时传入 |
| source | string | no | default=`explore_feed` | 来源 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| items[].note_id | `$.data.items[].note_id` | 关联笔记 ID | note.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空结果 | 关键词未命中 | STOP | 0 | — |

---

### search_products — 搜索商品

**Full path:** `/api/v1/xiaohongshu/app_v2/search_products`
**Method:** GET · **Risk:** low

#### 用途
按关键词搜索小红书商品。**keyword → sku_id 的链式入口**。

#### 何时使用 / 不使用
- ✅ 用户想搜商品
- ✅ 链式起点：keyword → sku_id → product.md
- ❌ 想搜笔记 → search_notes

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词，如 `手机壳` |
| page | integer | no | min=1, default=1 | 页码 |
| search_id | string | no | — | 搜索ID，翻页时传入 |
| source | string | no | default=`explore_feed` | 来源 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| items[].sku_id | `$.data.items[].sku_id` | 商品 SKU ID | product.md 多端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空结果 | 关键词未命中 | STOP | 0 | — |

---

### search_groups — 搜索群聊

**Full path:** `/api/v1/xiaohongshu/app_v2/search_groups`
**Method:** GET · **Risk:** low

#### 用途
按关键词搜索小红书群聊。

#### 何时使用 / 不使用
- ✅ 用户明确想搜群聊
- ❌ 想搜笔记/用户/商品 → 用对应搜索端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词，如 `上海` |
| page_no | integer | no | min=0, default=0 | 页码，从 0 开始 |
| search_id | string | no | — | 搜索ID，翻页时传入 |
| source | string | no | default=`unifiedSearchGroup` | 来源 |
| is_recommend | integer | no | enum=`0, 1` | 是否推荐：0=否, 1=是，默认 0 |

#### 输出可链式字段 (OUT)
无跨文件链式字段。

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空结果 | 关键词未命中 | STOP | 0 | — |

---

### fetch_hot_list — 获取小红书热榜

**Full path:** `/api/v1/xiaohongshu/web_v2/fetch_hot_list`
**Method:** GET · **Risk:** low

#### 用途
获取小红书热榜数据。无参数。

#### 何时使用 / 不使用
- ✅ 用户问"小红书热榜/热门话题"
- ❌ 想看热搜词 → fetch_trending

#### 输入 (IN)
无参数。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| items[].note_id | `$.data.items[].note_id` | 热榜笔记 ID | note.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 fetch_trending（热搜词，语义不同） |

---

### fetch_search_notes — 搜索笔记（Web V3）

**Full path:** `/api/v1/xiaohongshu/web_v3/fetch_search_notes`
**Method:** GET · **Risk:** low

#### 用途
通过 Web V3 接口搜索笔记。参数较少，不支持 time_filter / ai_mode 等。

#### 何时使用 / 不使用
- ✅ App V2 的 search_notes 5xx 时的降级选择
- ❌ 首选应使用 App V2（功能更全）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| page | integer | no | default=1 | 页码 |
| sort | string | no | enum=`general, time_descending, popularity_descending` | 排序方式 |
| note_type | integer | no | enum=`0, 1, 2` | 笔记类型：0=全部, 1=图文, 2=视频 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| items[].note_id | `$.data.items[].note_id` | 笔记 ID | note.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空结果 | 关键词未命中 | STOP | 0 | — |

---

### fetch_search_users — 搜索用户（Web V3）

**Full path:** `/api/v1/xiaohongshu/web_v3/fetch_search_users`
**Method:** GET · **Risk:** low

#### 用途
通过 Web V3 接口搜索用户。参数较少。

#### 何时使用 / 不使用
- ✅ App V2 的 search_users 5xx 时的降级选择
- ❌ 首选应使用 App V2

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| page | integer | no | default=1 | 页码 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| users[].user_id | `$.data.users[].user_id` | 用户 ID | user.md |

#### 错误处理 (ERR)
同 search_users。

---

### fetch_trending — 获取热搜词

**Full path:** `/api/v1/xiaohongshu/web_v3/fetch_trending`
**Method:** GET · **Risk:** low

#### 用途
获取小红书热搜词列表。无参数。

#### 何时使用 / 不使用
- ✅ 用户问"热搜/热门搜索词"
- ❌ 想看热榜（具体笔记排名）→ fetch_hot_list

#### 输入 (IN)
无参数。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| queries[].query | `$.data.queries[].query` | 热搜关键词 | search_notes.keyword |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_search_suggest — 获取搜索联想词

**Full path:** `/api/v1/xiaohongshu/web_v3/fetch_search_suggest`
**Method:** GET · **Risk:** low

#### 用途
获取搜索联想词/补全建议。keyword 为空时返回热门推荐。

#### 何时使用 / 不使用
- ✅ 用户输入部分关键词，想看联想建议
- ✅ keyword 为空时获取热门搜索推荐
- ❌ 想执行实际搜索 → search_notes

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | no | — | 关键词，为空时返回热门推荐 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| suggestions[].query | `$.data.suggestions[].query` | 联想词 | search_notes.keyword |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_homefeed — 获取首页推荐

**Full path:** `/api/v1/xiaohongshu/web_v3/fetch_homefeed`
**Method:** GET · **Risk:** low

#### 用途
获取小红书首页推荐 Feed 流。**笔记冷启动入口**——用户没有具体目标时，可从此端点采集 note_id 进入其他链路。

#### 何时使用 / 不使用
- ✅ 用户问"小红书有什么推荐/热门"等无明确目标场景
- ✅ 链式起点：批量取 note_id 后并行调用 note.md 端点
- ❌ 用户已给 note_id/关键词 → 直接搜索或查看详情

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| num | integer | no | max=40, default=20 | 返回数量，最大 40 |
| cursor_score | string | no | — | 翻页游标，首次留空 |
| category | string | no | — | 分类频道ID，从 fetch_homefeed_categories 获取，默认 homefeed_recommend |
| need_filter_image | boolean | no | — | 仅图文：true=仅图文, false=综合 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| items[].note_id | `$.data.items[].note_id` | 推荐笔记 ID | note.md 多端点 |
| cursor_score | `$.data.cursor_score` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代（feed 是最顶层入口） |

---

### fetch_homefeed_categories — 获取首页分类列表

**Full path:** `/api/v1/xiaohongshu/web_v3/fetch_homefeed_categories`
**Method:** GET · **Risk:** low

#### 用途
获取小红书首页频道分类列表。无参数。分类 ID 可用于 fetch_homefeed 的 category 参数。

#### 何时使用 / 不使用
- ✅ 用户想按分类浏览推荐内容
- ✅ 为 fetch_homefeed 提供 category 参数
- ❌ 不需要分类 → 直接 fetch_homefeed（默认推荐频道）

#### 输入 (IN)
无参数。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| categories[].category_id | `$.data.categories[].category_id` | 分类频道 ID | fetch_homefeed.category |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |
