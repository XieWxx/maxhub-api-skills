# Instagram Search & Discovery / Instagram 搜索与发现

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
用户搜索、话题搜索、地点搜索、综合搜索、坐标搜索、音乐搜索、探索页推荐、话题帖子、地点帖子 —— 围绕"搜索/发现"的全部读取入口。**搜索是 username → user_id 的常见入口**。

## 端点索引 (Endpoint Index)

### V1 端点
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| v1_fetch_search | ⭐⭐ 条件 | 搜索用户/话题/地点（V1 通用搜索） | GET | /api/v1/instagram/v1/fetch_search | low |
| v1_fetch_hashtag_posts | ⭐⭐ 条件 | 用 hashtag 取话题帖子 | GET | /api/v1/instagram/v1/fetch_hashtag_posts | low |
| v1_fetch_location_info | ⭐⭐ 条件 | 用 location_id 取地点信息 | GET | /api/v1/instagram/v1/fetch_location_info | low |
| v1_fetch_location_posts | ⭐⭐ 条件 | 用 location_id 取地点帖子 | GET | /api/v1/instagram/v1/fetch_location_posts | low |
| v1_fetch_cities | ⭐ 条件 | 用 country_code 取城市列表 | GET | /api/v1/instagram/v1/fetch_cities | low |
| v1_fetch_locations | ⭐ 条件 | 用 city_id 取地点列表 | GET | /api/v1/instagram/v1/fetch_locations | low |
| v1_fetch_explore_sections | ⭐ 条件 | 取探索页面分类 | GET | /api/v1/instagram/v1/fetch_explore_sections | low |
| v1_fetch_section_posts | ⭐ 条件 | 用 section_id 取分类帖子 | GET | /api/v1/instagram/v1/fetch_section_posts | low |

### V2 端点
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| v2_search_users | ⭐⭐⭐ 首选 | 用 keyword 搜索用户 | GET | /api/v1/instagram/v2/search_users | low |
| v2_general_search | ⭐⭐⭐ 首选 | 用 keyword 综合搜索 | GET | /api/v1/instagram/v2/general_search | low |
| v2_search_reels | ⭐⭐ 条件 | 用 keyword 搜索 Reels | GET | /api/v1/instagram/v2/search_reels | low |
| v2_search_music | ⭐⭐ 条件 | 用 keyword 搜索音乐 | GET | /api/v1/instagram/v2/search_music | low |
| v2_search_hashtags | ⭐⭐ 条件 | 用 keyword 搜索话题 | GET | /api/v1/instagram/v2/search_hashtags | low |
| v2_search_locations | ⭐⭐ 条件 | 用 keyword 搜索地点 | GET | /api/v1/instagram/v2/search_locations | low |
| v2_search_by_coordinates | ⭐ 条件 | 用经纬度搜索地点 | GET | /api/v1/instagram/v2/search_by_coordinates | low |
| v2_fetch_hashtag_posts | ⭐⭐ 条件 | 用 keyword 取话题帖子（支持 feed_type） | GET | /api/v1/instagram/v2/fetch_hashtag_posts | low |
| v2_fetch_location_posts | ⭐⭐ 条件 | 用 location_id 取地点帖子 | GET | /api/v1/instagram/v2/fetch_location_posts | low |

### V3 端点
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| v3_search_users | ⭐⭐⭐ 首选 | 用 query 搜索用户（**username→user_id 入口**） | GET | /api/v1/instagram/v3/search_users | low |
| v3_search_hashtags | ⭐⭐ 条件 | 用 query 搜索话题 | GET | /api/v1/instagram/v3/search_hashtags | low |
| v3_general_search | ⭐⭐⭐ 首选 | 用 query 综合搜索（支持分页） | GET | /api/v1/instagram/v3/general_search | low |
| v3_get_explore | ⭐⭐ 降级 | 取探索页推荐帖子（冷启动入口） | GET | /api/v1/instagram/v3/get_explore | low |
| v3_get_location_info | ⭐⭐ 条件 | 用 location_id 取地点详情 | GET | /api/v1/instagram/v3/get_location_info | low |
| v3_get_location_posts | ⭐⭐ 条件 | 用 location_id 取地点帖子 | GET | /api/v1/instagram/v3/get_location_posts | low |
| v3_get_location_nearby | ⭐ 条件 | 用 location_id 取附近内容 | GET | /api/v1/instagram/v3/get_location_nearby | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 搜索用户 → 用户主页 | v3_search_users → user.md v3_get_user_profile | `$.data.users[].pk` → `user_id` | 第 1 步空：STOP |
| 搜索用户 → 用户帖子 | v3_search_users → user.md v3_get_user_posts | `$.data.users[].username` → `username` | 第 1 步空：STOP |
| 综合搜索 → 帖子详情 | v3_general_search → post.md v3_get_post_info | 搜索结果中的帖子 ID/shortcode | 跨文件链路 |
| 话题搜索 → 话题帖子 | v2_search_hashtags → v2_fetch_hashtag_posts | `$.data.items[].name` → `keyword` | 第 1 步空：STOP |
| 地点搜索 → 地点帖子 | v2_search_locations → v2_fetch_location_posts | `$.data.items[].id` → `location_id` | 第 1 步空：STOP |
| 探索页 → 帖子详情 | v3_get_explore → post.md v3_get_post_info | 推荐帖子中的 ID | 跨文件链路 |
| 城市列表 → 地点列表 → 地点帖子 | v1_fetch_cities → v1_fetch_locations → v1_fetch_location_posts | `city_id` → `location_id` 接力 | 三步链，中间步失败返回已有数据 |

## 跨 reference 链路 (In-Chain)
- **流出本文件**：搜索结果中的 `user_id` / `username` → `user.md` 各端点
- **流出本文件**：搜索结果中的帖子 ID/shortcode → `post.md` 各端点
- **流出本文件**：搜索结果中的 `location_id` → 本文件地点详情/帖子端点
- **流入本文件**：`post.md` 的音乐帖子需要 `music_id` → 本文件 `v2_search_music`

## 错误处理契约 (Error Contract · 本文件全端点共享)

> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- 必须先做防臆造自检（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- 禁止：❌ 改路径段 ❌ 切换平台前缀 ❌ 拼接新路径

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- 必须先做防臆造自检（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
- **特别注意**：V3 搜索端点参数名是 `query`，V2 是 `keyword`，V1 是 `query`——禁止跨版本套用

### 鉴权错误（401）→ STOP
### 余额 / 付费（402）→ STOP
### 权限错误（403）→ STOP
### 限流（429）→ 退避重试 ≤2 次
### 上游故障（500/502/503/504）→ 等 3s 重试 1 次 → 走端点替换矩阵
### 网络超时 → STOP
### 业务错误（HTTP 200 且 `code != 0`）→ 读 `message_zh`，不重试

---

## 端点详情

### v3_search_users — 搜索用户

**Full path:** `/api/v1/instagram/v3/search_users`
**Method:** GET · **Risk:** low

#### 用途
按关键词搜索 Instagram 用户。**已知用户名时的链式入口**——把搜索结果中的 user_id 传递给 user.md 各端点。

#### 何时使用 / 不使用
- ✅ 用户给出用户名/昵称但未提供 user_id
- ✅ 链式起点：搜索 → user_id
- ❌ 想搜帖子/话题 → 用 `v3_general_search` 或 `v3_search_hashtags`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| query | string | yes | — | 搜索关键词，如 `justin` |
| rank_token | string | no | — | 上一次搜索返回的 rank_token，用于翻页 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.users[].pk | `$.data.users[].pk` | 用户 ID | user.md 各端点 |
| data.users[].username | `$.data.users[].username` | 用户名 | user.md 各端点 |
| data.rank_token | `$.data.rank_token` | 翻页 token | 同端点 rank_token |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空结果 | 关键词未命中 | STOP，告知用户未找到 | 0 | — |
| 多结果 | 多个匹配 | 让用户选择或返回前 N 个 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 v2_search_users |

---

### v3_search_hashtags — 搜索话题标签

**Full path:** `/api/v1/instagram/v3/search_hashtags`
**Method:** GET · **Risk:** low

#### 用途
搜索 Instagram 话题标签。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| query | string | yes | — | 搜索关键词，如 `fashion` |
| rank_token | string | no | — | 翻页 token |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.hashtags[].name | 话题名称 | 如 `fashion` | v2_fetch_hashtag_posts 的 keyword |
| data.rank_token | 翻页 token | 同端点翻页 | 同端点 |

---

### v3_general_search — 综合搜索（支持分页）

**Full path:** `/api/v1/instagram/v3/general_search`
**Method:** GET · **Risk:** low

#### 用途
综合搜索用户、话题、地点等。支持分页。**V3 推荐首选搜索端点**。

#### 何时使用 / 不使用
- ✅ 用户不确定搜什么类型，需要综合结果
- ✅ 需要分页的搜索
- ❌ 只搜用户 → 用 `v3_search_users`（更精准）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| query | string | yes | — | 搜索关键词 |
| next_max_id | string | no | — | 分页 ID，从上次响应获取 |
| rank_token | string | no | — | 排序 token，从上次响应获取 |
| enable_metadata | boolean | no | — | 是否启用元数据 (default: true) |

> **注意**：搜索话题标签时，query 需要带上 `#` 前缀（如 `#fashion`），`#` 需要 URL 编码为 `%23`。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.users[].pk | 用户 ID | user_id | user.md |
| data.hashtags[].name | 话题名称 | hashtag | v2_fetch_hashtag_posts |
| data.places[].location.pk | 地点 ID | location_id | v3_get_location_info |
| data.next_max_id | 下一页 ID | 翻页用 | 同端点 |
| data.rank_token | 排序 token | 翻页用 | 同端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 v2_general_search |

---

### v3_get_explore — 获取探索页推荐帖子

**Full path:** `/api/v1/instagram/v3/get_explore`
**Method:** GET · **Risk:** low

#### 用途
获取探索页推荐内容。**冷启动入口**——用户没有具体搜索目标时使用。

#### 何时使用 / 不使用
- ✅ 用户问"Instagram 有什么热门"等无明确目标的场景
- ✅ 冷启动：批量取帖子后进入其他链路
- ❌ 用户有明确搜索目标 → 用搜索端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| max_id | string | no | — | 分页游标，从 next_max_id 获取 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.sectional_items | 推荐内容分区 | 含帖子列表 | post.md |
| data.next_max_id | 下一页游标 | 翻页用 | 同端点 |

---

### v3_get_location_info — 获取地点详情

**Full path:** `/api/v1/instagram/v3/get_location_info`
**Method:** GET · **Risk:** low

#### 用途
获取指定地点的详细信息（名称、地址、坐标、附近地点等）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| location_id | string | yes | 纯数字 | 地点 ID，如 `1016248898` |
| show_nearby | boolean | no | — | 是否显示附近地点 (default: true) |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.native_location_data | 地点基本信息 | 含 name, address, lat, lng | 直接交付用户 |
| data.nearby_locations | 附近地点 | 含 location_id | v3_get_location_info / v3_get_location_posts |

---

### v3_get_location_posts — 获取地点相关帖子

**Full path:** `/api/v1/instagram/v3/get_location_posts`
**Method:** GET · **Risk:** low

#### 用途
获取指定地点的帖子列表（含分页）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| location_id | string | yes | 纯数字 | 地点 ID |
| tab | string | no | enum=`ranked,recent` | 帖子类型 (default: ranked) |
| first | integer | no | — | 每页数量 (default: 12) |
| after | string | no | — | 翻页游标 |
| page_size_override | integer | no | — | 每页数量覆盖 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.sections | 帖子分区列表 | 含帖子数据 | post.md |
| data.next_max_id | 下一页游标 | 翻页用 | 同端点 |

---

### v3_get_location_nearby — 获取地点附近内容

**Full path:** `/api/v1/instagram/v3/get_location_nearby`
**Method:** GET · **Risk:** low

#### 用途
获取指定地点附近的内容聚合（附近地点、热门帖子等）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| location_id | string | yes | 纯数字 | 地点 ID |

---

### v2_search_users — 搜索用户

**Full path:** `/api/v1/instagram/v2/search_users`
**Method:** GET · **Risk:** low

#### 用途
V2 版本搜索用户。参数名为 `keyword`（注意与 V3 的 `query` 不同）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.items[].pk | 用户 ID | user_id | user.md |
| data.items[].username | 用户名 | username | user.md |

---

### v2_general_search — 综合搜索

**Full path:** `/api/v1/instagram/v2/general_search`
**Method:** GET · **Risk:** low

#### 用途
V2 版本综合搜索。参数名为 `keyword`。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| pagination_token | string | no | — | 分页 token |

---

### v2_search_reels — 搜索 Reels

**Full path:** `/api/v1/instagram/v2/search_reels`
**Method:** GET · **Risk:** low

#### 用途
搜索 Instagram Reels 视频。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| pagination_token | string | no | — | 分页 token |

---

### v2_search_music — 搜索音乐

**Full path:** `/api/v1/instagram/v2/search_music`
**Method:** GET · **Risk:** low

#### 用途
搜索 Instagram 音乐/音频。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.items[].id | 音乐 ID | music_id / audio_canonical_id | post.md v1_fetch_music_posts / v2_fetch_music_posts |

---

### v2_search_hashtags — 搜索话题标签

**Full path:** `/api/v1/instagram/v2/search_hashtags`
**Method:** GET · **Risk:** low

#### 用途
搜索 Instagram 话题标签。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.items[].name | 话题名称 | hashtag | v2_fetch_hashtag_posts |

---

### v2_search_locations — 搜索地点

**Full path:** `/api/v1/instagram/v2/search_locations`
**Method:** GET · **Risk:** low

#### 用途
按关键词搜索地点。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词（地点名称、城市等） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data.items[].id | 地点 ID | location_id | v2_fetch_location_posts / v3_get_location_info |

---

### v2_search_by_coordinates — 根据坐标搜索地点

**Full path:** `/api/v1/instagram/v2/search_by_coordinates`
**Method:** GET · **Risk:** low

#### 用途
根据经纬度坐标搜索附近地点。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| latitude | number | yes | — | 纬度，如 `40.7` |
| longitude | number | yes | — | 经度，如 `-74` |

---

### v2_fetch_hashtag_posts — 获取话题帖子

**Full path:** `/api/v1/instagram/v2/fetch_hashtag_posts`
**Method:** GET · **Risk:** low

#### 用途
获取指定话题标签下的帖子列表。V2 版本支持 feed_type 筛选。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | 不含 # 号 | 话题关键词，如 `cat` |
| feed_type | string | no | enum=`top,recent,reels` | 帖子类型 (default: top) |
| pagination_token | string | no | — | 分页 token |

---

### v2_fetch_location_posts — 获取地点帖子

**Full path:** `/api/v1/instagram/v2/fetch_location_posts`
**Method:** GET · **Risk:** low

#### 用途
获取指定地点的帖子列表。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| location_id | string | yes | 纯数字 | 地点 ID |
| pagination_token | string | no | — | 分页 token |

---

### V1 端点（降级方案）

> V1 搜索端点作为最后降级方案。关键差异：

| V3/V2 首选 | V1 降级 | 关键差异 |
|-----------|---------|---------|
| v3_search_users / v2_search_users | v1_fetch_search(select=users) | V1 用 `select` 参数筛选类型 |
| v3_search_hashtags / v2_search_hashtags | v1_fetch_search(select=hashtags) | V1 返回格式不同 |
| v2_search_locations | v1_fetch_search(select=places) | V1 返回格式不同 |
| v2_fetch_hashtag_posts | v1_fetch_hashtag_posts | V1 用 `hashtag` 参数名，V2 用 `keyword` |
| v3_get_location_info | v1_fetch_location_info | V1 无 show_nearby 参数 |
| v3_get_location_posts | v1_fetch_location_posts | V1 支持 tab 筛选 |
| — | v1_fetch_cities | 仅 V1 有城市列表 |
| — | v1_fetch_locations | 仅 V1 有城市下地点列表 |
| — | v1_fetch_explore_sections | 仅 V1 有探索分类 |
| — | v1_fetch_section_posts | 仅 V1 有分类帖子 |
