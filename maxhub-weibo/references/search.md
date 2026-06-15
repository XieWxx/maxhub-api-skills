# Weibo Search & Discovery / 微博搜索与发现

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
综合搜索、分类搜索、AI 搜索、高级搜索、实时搜索、用户搜索、视频搜索、图片搜索、话题搜索、相似搜索推荐、热搜榜、热搜分类、热搜词条、热搜榜单、文娱榜、社会榜、生活榜、地区映射 —— 围绕"搜索与发现"的全部读取入口。含 App、Web、Web V2 三端。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| app_fetch_search_all | ⭐⭐⭐ 首选 | 用 query 综合搜索（App 端，**多类型**） | GET | /api/v1/weibo/app/fetch_search_all | low |
| app_fetch_ai_smart_search | ⭐⭐ 条件 | 用 query AI 智搜（App 端） | GET | /api/v1/weibo/app/fetch_ai_smart_search | low |
| app_fetch_hot_search | ⭐⭐⭐ 首选 | 取热搜榜（App 端，**支持分类**） | GET | /api/v1/weibo/app/fetch_hot_search | low |
| app_fetch_hot_search_categories | ⭐⭐ 条件 | 取热搜分类列表 | GET | /api/v1/weibo/app/fetch_hot_search_categories | low |
| web_fetch_search | ⭐⭐⭐ 首选 | 用 keyword 搜索微博（Web 端，**支持时间范围**） | GET | /api/v1/weibo/web/fetch_search | low |
| web_fetch_hot_search | ⭐⭐ 条件 | 取热搜榜（Web 端，Top 50） | GET | /api/v1/weibo/web/fetch_hot_search | low |
| web_fetch_search_topics | ⭐⭐ 条件 | 取搜索页热搜词 | GET | /api/v1/weibo/web/fetch_search_topics | low |
| web_v2_fetch_hot_search_index | ⭐⭐ 条件 | 取热搜词条前 10 条 | GET | /api/v1/weibo/web_v2/fetch_hot_search_index | low |
| web_v2_fetch_hot_search_summary | ⭐⭐⭐ 首选 | 取完整热搜 50 条（**含标签**） | GET | /api/v1/weibo/web_v2/fetch_hot_search_summary | low |
| web_v2_fetch_hot_search | ⭐⭐ 条件 | 取热搜数据（多板块） | GET | /api/v1/weibo/web_v2/fetch_hot_search | low |
| web_v2_fetch_entertainment_ranking | ⭐⭐ 条件 | 取文娱榜单 | GET | /api/v1/weibo/web_v2/fetch_entertainment_ranking | low |
| web_v2_fetch_life_ranking | ⭐⭐ 条件 | 取生活榜单 | GET | /api/v1/weibo/web_v2/fetch_life_ranking | low |
| web_v2_fetch_social_ranking | ⭐⭐ 条件 | 取社会榜单 | GET | /api/v1/weibo/web_v2/fetch_social_ranking | low |
| web_v2_fetch_similar_search | ⭐ 条件 | 用 keyword 取相似搜索词推荐 | GET | /api/v1/weibo/web_v2/fetch_similar_search | low |
| web_v2_fetch_ai_search | ⭐⭐ 条件 | 用 query AI 智能搜索（Web V2 端） | GET | /api/v1/weibo/web_v2/fetch_ai_search | low |
| web_v2_fetch_ai_related_search | ⭐ 条件 | 用 keyword AI 搜索内容扩展 | GET | /api/v1/weibo/web_v2/fetch_ai_related_search | low |
| web_v2_fetch_advanced_search | ⭐⭐⭐ 首选 | 用 q 高级搜索（**多维度筛选**） | GET | /api/v1/weibo/web_v2/fetch_advanced_search | low |
| web_v2_fetch_city_list | ⭐ 条件 | 取地区省市映射 | GET | /api/v1/weibo/web_v2/fetch_city_list | low |
| web_v2_fetch_realtime_search | ⭐⭐ 条件 | 用 query 实时搜索 | GET | /api/v1/weibo/web_v2/fetch_realtime_search | low |
| web_v2_fetch_user_search | ⭐⭐⭐ 首选 | 用 query + 多条件搜索用户 | GET | /api/v1/weibo/web_v2/fetch_user_search | low |
| web_v2_fetch_video_search | ⭐⭐ 条件 | 用 query 搜索视频 | GET | /api/v1/weibo/web_v2/fetch_video_search | low |
| web_v2_fetch_pic_search | ⭐⭐ 条件 | 用 query 搜索图片 | GET | /api/v1/weibo/web_v2/fetch_pic_search | low |
| web_v2_fetch_topic_search | ⭐⭐ 条件 | 用 query 搜索话题 | GET | /api/v1/weibo/web_v2/fetch_topic_search | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 搜微博 + 看详情 | app_fetch_search_all → post.md app_fetch_status_detail | `$.data.list[].idstr` → `status_id` | 第 2 步失败：返回搜索概要 |
| 搜用户 + 看主页 | web_v2_fetch_user_search → user.md web_v2_fetch_user_info | `$.data.list[].uid` → `uid` | 跨文件链路 |
| 搜用户 + 看微博 | web_v2_fetch_user_search → user.md web_v2_fetch_user_posts | `$.data.list[].uid` → `uid` | 跨文件链路 |
| 搜视频 + 看详情 | web_v2_fetch_video_search → post.md app_fetch_video_detail | `$.data.list[].id` → `mid` | 跨文件链路 |
| 热搜 + 搜详情 | web_v2_fetch_hot_search_summary → app_fetch_search_all | 热搜关键词 → `query` | 第 2 步失败：返回热搜列表 |
| 高级搜 + 看详情 | web_v2_fetch_advanced_search → post.md web_v2_fetch_post_detail | `$.data.list[].id` → `id` | 第 2 步失败：返回搜索概要 |
| 地区搜用户 | web_v2_fetch_city_list → web_v2_fetch_user_search | `$.data[].code` → `region` | 第 1 步失败：可不用 region 参数 |

## 跨 reference 链路 (In-Chain)
- **流出本文件**：`app_fetch_search_all` 的 `$.data.list[].idstr` → `post.md` 微博详情端点
- **流出本文件**：`web_fetch_search` 的 `$.data.list[].id` → `post.md` Web 端详情端点
- **流出本文件**：`web_v2_fetch_advanced_search` / `web_v2_fetch_realtime_search` 的 `$.data.list[].id` → `post.md` Web V2 端详情端点
- **流出本文件**：`web_v2_fetch_user_search` 的 `$.data.list[].uid` → `user.md` 全部 user 系端点
- **流出本文件**：`web_v2_fetch_video_search` 的 `$.data.list[].id` → `post.md` 视频详情端点

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- **第 2 步：自检通过后**才能 STOP 并报告
- **禁止**：❌ 改路径段 ❌ 切换平台前缀 ❌ 拼接新路径

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
- **特别注意**：App 端搜索用 `query`，Web 端搜索用 `keyword`，Web V2 高级搜索用 `q`——禁止跨端混用
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次

### 鉴权错误（401）→ STOP
### 余额 / 付费（402）→ STOP
### 权限错误（403）→ STOP
### 限流（429）→ 读 Retry-After 退避，最多重试 2 次
### 上游故障（5xx）→ 等 3s 重试 1 次
### 网络超时 → STOP
### 业务错误（code != 0）→ 读 message_zh，不重试

---

## 端点详情

### app_fetch_search_all — 综合搜索

**Full path:** `/api/v1/weibo/app/fetch_search_all`
**Method:** GET · **Risk:** low

#### 用途
综合搜索微博内容，支持多种搜索类型（综合、实时、用户、视频、图片等）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| query | string | yes | — | 搜索关键词 |
| page | integer | no | min=1 | 页码 (default: 1) |
| search_type | integer | no | enum=`[1,61,3,64,63,62,60,21,38,98,92,97]` | 类型: 1=综合, 61=实时, 3=用户, 64=视频, 63=图片, 62=关注, 60=热门, 21=全网, 38=话题, 98=超话, 92=地点, 97=商品 (default: 1) |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].idstr | `$.data.list[].idstr` | 微博 ID | post.md app_fetch_status_detail |
| list[].user.id | `$.data.list[].user.id` | 用户 uid（search_type=3 时） | user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空结果 | 关键词未命中 | 告知用户 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | web_fetch_search 或 web_v2_fetch_advanced_search |

---

### app_fetch_ai_smart_search — AI 智搜

**Full path:** `/api/v1/weibo/app/fetch_ai_smart_search`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| query | string | yes | — | 搜索关键词 |
| page | integer | no | min=1 | 页码 (default: 1) |

---

### app_fetch_hot_search — 获取热搜榜 (App)

**Full path:** `/api/v1/weibo/app/fetch_hot_search`
**Method:** GET · **Risk:** low

#### 用途
获取热搜榜数据（含热搜词条、热度），支持分类和同城热搜。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| category | string | no | enum=`["mineband","realtimehot","social","fun","technologynav","lifenav","region","sportnav","gamenav"]` | 分类 (default: realtimehot) |
| page | integer | no | min=1 | 页码 (default: 1) |
| count | integer | no | min=1, max=50 | 每页数量 (default: 20) |
| region_name | string | no | — | 同城热搜城市名（仅 category=region 时有效，默认北京） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].word | `$.data.list[].word` | 热搜关键词 | app_fetch_search_all.query |

---

### app_fetch_hot_search_categories — 获取热搜分类列表

**Full path:** `/api/v1/weibo/app/fetch_hot_search_categories`
**Method:** GET · **Risk:** low

#### 输入 (IN)
无参数

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 分类列表 | app_fetch_hot_search.category |

---

### web_fetch_search — 搜索微博 (Web)

**Full path:** `/api/v1/weibo/web/fetch_search`
**Method:** GET · **Risk:** low

#### 用途
搜索微博内容（Web 端），支持话题搜索和时间范围筛选。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词，支持话题搜索如 #话题名# |
| page | integer | no | min=1 | 页码 (default: 1, 约 10-20 条/页) |
| search_type | string | no | enum=`["1","61","3","60","64","63","21"]` | 类型: 1=综合, 61=实时, 3=用户, 60=热门, 64=视频, 63=图片, 21=文章 (default: 1) |
| time_scope | string | no | enum=`["hour","day","week","month"]` | 时间范围 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].id | `$.data.list[].id` | 微博 ID | post.md web_fetch_post_detail |

---

### web_fetch_hot_search — 获取热搜榜 (Web)

**Full path:** `/api/v1/weibo/web/fetch_hot_search`
**Method:** GET · **Risk:** low

#### 输入 (IN)
无参数

#### 输出可链式字段 (OUT)
返回实时热搜榜 Top 50 + 实时上升热点。

---

### web_fetch_search_topics — 获取搜索页热搜词

**Full path:** `/api/v1/weibo/web/fetch_search_topics`
**Method:** GET · **Risk:** low

#### 输入 (IN)
无参数

---

### web_v2_fetch_hot_search_index — 获取热搜词条 (10 条)

**Full path:** `/api/v1/weibo/web_v2/fetch_hot_search_index`
**Method:** GET · **Risk:** low

#### 输入 (IN)
无参数

#### 输出可链式字段 (OUT)
热搜词条前 10 条（含关键词、热度值、排名），建议缓存 2-5 分钟。

---

### web_v2_fetch_hot_search_summary — 获取完整热搜榜单 (50 条)

**Full path:** `/api/v1/weibo/web_v2/fetch_hot_search_summary`
**Method:** GET · **Risk:** low

#### 用途
获取完整热搜 50 条（含排名、关键词、标签[热点/沸点/官宣/新]、热度值），rank=0 为置顶。**热搜首选端点**。

#### 输入 (IN)
无参数

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].word | `$.data.list[].word` | 热搜关键词 | app_fetch_search_all.query / web_fetch_search.keyword |

---

### web_v2_fetch_hot_search — 获取热搜榜单 (Web V2)

**Full path:** `/api/v1/weibo/web_v2/fetch_hot_search`
**Method:** GET · **Risk:** low

#### 输入 (IN)
无参数

#### 输出可链式字段 (OUT)
含 realtime[实时热搜]、hotgov 等多板块，建议缓存 2-5 分钟。

---

### web_v2_fetch_entertainment_ranking — 获取文娱榜单

**Full path:** `/api/v1/weibo/web_v2/fetch_entertainment_ranking`
**Method:** GET · **Risk:** low

#### 输入 (IN)
无参数

#### 输出可链式字段 (OUT)
文娱话题列表（娱乐圈/影视/综艺等），含热度值、排名、分类，建议缓存 5-10 分钟。

---

### web_v2_fetch_life_ranking — 获取生活榜单

**Full path:** `/api/v1/weibo/web_v2/fetch_life_ranking`
**Method:** GET · **Risk:** low

#### 输入 (IN)
无参数

#### 输出可链式字段 (OUT)
生活话题列表（美食/旅游/健康/时尚等），建议缓存 5-10 分钟。

---

### web_v2_fetch_social_ranking — 获取社会榜单

**Full path:** `/api/v1/weibo/web_v2/fetch_social_ranking`
**Method:** GET · **Risk:** low

#### 输入 (IN)
无参数

#### 输出可链式字段 (OUT)
社会话题列表（时事新闻/社会热点/民生话题等），建议缓存 2-5 分钟。

---

### web_v2_fetch_similar_search — 获取相似搜索词推荐

**Full path:** `/api/v1/weibo/web_v2/fetch_similar_search`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词（支持话题格式如 #话题名#） |

#### 输出可链式字段 (OUT)
相似搜索词列表（含推荐词、搜索次数），可缓存 15-30 分钟。

---

### web_v2_fetch_ai_search — 微博智能搜索 (Web V2)

**Full path:** `/api/v1/weibo/web_v2/fetch_ai_search`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| query | string | yes | — | 搜索关键词（建议使用话题格式 #话题名#） |

#### 输出可链式字段 (OUT)
AI 搜索结果（含推荐内容、相关话题）。

---

### web_v2_fetch_ai_related_search — 微博 AI 搜索内容扩展

**Full path:** `/api/v1/weibo/web_v2/fetch_ai_related_search`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词（建议使用话题格式 #话题名#） |

#### 输出可链式字段 (OUT)
HTML 格式扩展内容（含相关问题、博主推荐、参考博文，需 HTML 解析）。

---

### web_v2_fetch_advanced_search — 微博高级搜索

**Full path:** `/api/v1/weibo/web_v2/fetch_advanced_search`
**Method:** GET · **Risk:** low

#### 用途
高级搜索微博内容，支持多维度筛选（搜索类型、内容类型、时间范围）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| q | string | yes | — | 搜索关键词 |
| search_type | string | no | enum=`["all","hot","original","verified","media","viewpoint"]` | 搜索类型 (default: hot) |
| include_type | string | no | enum=`["all","pic","video","music","link"]` | 包含类型 (default: all) |
| timescope | string | no | pattern=`^custom:\d{4}-\d{2}-\d{2}-\d+:\d{4}-\d{2}-\d{2}-\d+$` | 时间范围 (custom:start:end, e.g. custom:2025-09-01-0:2025-09-08-23) |
| page | integer | no | min=1 | 页码 (default: 1) |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].id | `$.data.list[].id` | 微博 ID | post.md web_v2_fetch_post_detail |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | app_fetch_search_all 或 web_fetch_search |

---

### web_v2_fetch_city_list — 地区省市映射

**Full path:** `/api/v1/weibo/web_v2/fetch_city_list`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| normalized | boolean | no | — | 是否返回标准化结构 (default: True) |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| [].code | `$.data[].code` | 地区编码（格式 custom:省代码:市代码） | web_v2_fetch_user_search.region |

---

### web_v2_fetch_realtime_search — 实时搜索

**Full path:** `/api/v1/weibo/web_v2/fetch_realtime_search`
**Method:** GET · **Risk:** low

#### 用途
实时搜索微博内容（按时间排序的最新微博）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| query | string | yes | — | 搜索关键词 |
| page | integer | no | min=1 | 页码 (default: 1) |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].id | `$.data.list[].id` | 微博 ID | post.md web_v2_fetch_post_detail |

---

### web_v2_fetch_user_search — 用户搜索

**Full path:** `/api/v1/weibo/web_v2/fetch_user_search`
**Method:** GET · **Risk:** low

#### 用途
搜索微博用户，支持多条件筛选（地区、认证、性别、年龄、昵称、标签、学校、公司）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| query | string | no | — | 搜索关键词（提供则视为"全部"搜索；留空则仅应用筛选参数） |
| page | integer | no | min=1 | 页码 (default: 1) |
| region | string | no | — | 地区编码（从 web_v2_fetch_city_list 获取） |
| auth | string | no | enum=`["org_vip","per_vip","ord"]` | 认证类型 |
| gender | string | no | enum=`["man","women"]` | 性别 |
| age | string | no | enum=`["18y","22y","29y","39y","40y"]` | 年龄段 |
| nickname | string | no | — | 昵称筛选 |
| tag | string | no | — | 标签筛选 |
| school | string | no | — | 学校筛选 |
| work | string | no | — | 公司筛选 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].uid | `$.data.list[].uid` | 用户 ID | user.md 全部 user 系端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空结果 | 筛选条件过多导致无结果 | 告知用户放宽筛选条件 | 0 | — |

---

### web_v2_fetch_video_search — 视频搜索

**Full path:** `/api/v1/weibo/web_v2/fetch_video_search`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| query | string | yes | — | 搜索关键词 |
| mode | string | no | enum=`["hot","all"]` | 模式: hot=热门 / all=全部 (default: hot) |
| page | integer | no | min=1 | 页码 (default: 1) |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].id | `$.data.list[].id` | 微博 ID | post.md app_fetch_video_detail.mid |

---

### web_v2_fetch_pic_search — 图片搜索

**Full path:** `/api/v1/weibo/web_v2/fetch_pic_search`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| query | string | yes | — | 搜索关键词 |
| page | integer | no | min=1 | 页码 (default: 1) |

#### 输出可链式字段 (OUT)
图片列表（按微博 ID 聚合多图，含缩略图[自动转原图]、作者信息、图片数量）。

---

### web_v2_fetch_topic_search — 话题搜索

**Full path:** `/api/v1/weibo/web_v2/fetch_topic_search`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| query | string | yes | — | 搜索关键词 |
| page | integer | no | min=1 | 页码 (default: 1) |

#### 输出可链式字段 (OUT)
话题列表（含话题名、封面图、讨论数[万/亿转整数]、阅读数）。
