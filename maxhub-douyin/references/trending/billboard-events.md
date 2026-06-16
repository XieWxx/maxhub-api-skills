# Douyin Trending — Billboard 热点榜单+活动日历+作品分析 / 抖音热榜 — Billboard 热点榜单+活动日历+作品分析
> 本文件是 [trending/_index.md](./_index.md) 的子文件。完整端点路由、链式调用图谱、错误处理契约请参见 _index.md。

## 端点详情

---

### billboard_fetch_hot_category_list — 获取热点榜分类

**Full path:** `/api/v1/douyin/billboard/fetch_hot_category_list`
**Method:** GET · **Risk:** low

#### 用途
获取热点榜分类的 ID 与热度。用于了解各热点分类的概况。

#### 何时使用 / 不使用
- ✅ 想了解热点分类概况
- ❌ 想看具体热点列表 → 用 `billboard_fetch_hot_total_list` 等

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| billboard_type | string | yes | 枚举：rise/city/total | 榜单类型：rise = 上升热点榜，city = 城市热点榜，total = 热点总榜 |
| snapshot_time | string | no | yyyyMMddHHmmss 格式 | 快照时间，如 `20250106151500` |
| start_date | string | no | yyyyMMdd 格式 | 快照开始时间（与 end_date 配合，需移除 snapshot_time） |
| end_date | string | no | yyyyMMdd 格式 | 快照结束时间 |
| keyword | string | no | — | 热点搜索词 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 分类 ID 与热度 | `$.data` | 热点分类数据 | 仅展示用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | billboard_type 无效 | 检查参数 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_rise_list — 获取上升热点榜

**Full path:** `/api/v1/douyin/billboard/fetch_hot_rise_list`
**Method:** GET · **Risk:** low

#### 用途
获取上升热点榜，展示热度上升最快的话题。

#### 何时使用 / 不使用
- ✅ 想查看正在上升的热点
- ❌ 想看总榜 → 用 `billboard_fetch_hot_total_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| page | integer | yes | 正整数 | 页码 |
| page_size | integer | yes | 正整数 | 每页数量 |
| order | string | yes | 枚举：rank/rank_diff | 排序方式：rank = 按热度，rank_diff = 按排名变化 |
| sentence_tag | string | no | 逗号分隔 | 热点分类标签，多个逗号分隔，空 = 全部 |
| keyword | string | no | — | 热点搜索词 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 热点列表 | `$.data.list` | 上升热点数据 | search.md 各端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数错误 | 检查 page/page_size/order | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_city_list — 获取同城热点榜

**Full path:** `/api/v1/douyin/billboard/fetch_hot_city_list`
**Method:** GET · **Risk:** low

#### 用途
获取同城热点榜，可按城市编码筛选。

#### 何时使用 / 不使用
- ✅ 想查看特定城市的热点
- ✅ 已有 city_code（从 `billboard_fetch_city_list` 获取）
- ❌ 想看全国热点 → 用 `billboard_fetch_hot_total_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| page | integer | yes | 正整数 | 页码 |
| page_size | integer | yes | 正整数 | 每页数量 |
| order | string | yes | 枚举：rank/rank_diff | 排序方式 |
| city_code | string | no | — | 城市编码，空 = 全部 |
| sentence_tag | string | no | — | 热点分类标签，空 = 全部 |
| keyword | string | no | — | 热点搜索词 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 同城热点列表 | `$.data.list` | 同城热点数据 | search.md 各端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数错误 | 检查必填参数 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_challenge_list — 获取挑战热榜

**Full path:** `/api/v1/douyin/billboard/fetch_hot_challenge_list`
**Method:** GET · **Risk:** low

#### 用途
获取挑战热榜，展示热门挑战赛排行。

#### 何时使用 / 不使用
- ✅ 想查看热门挑战赛排行
- ❌ 想看热搜 → 用 `app_v3_fetch_hot_search_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| page | integer | yes | 正整数 | 页码 |
| page_size | integer | yes | 正整数 | 每页数量 |
| keyword | string | no | — | 热点搜索词 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 挑战列表 | `$.data.list` | 挑战热榜数据 | video.md `app_v3_fetch_hashtag_detail` 等 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数错误 | 检查 page/page_size | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_total_list — 获取热点总榜

**Full path:** `/api/v1/douyin/billboard/fetch_hot_total_list`
**Method:** GET · **Risk:** low

#### 用途
获取热点总榜。**最常用的 Billboard 榜单端点**，支持按时刻或时间范围查询。

#### 何时使用 / 不使用
- ✅ 想查看当前热点总排行
- ✅ 链式起点：取 aweme_id 用于作品分析
- ❌ 想看上升热点 → 用 `billboard_fetch_hot_rise_list`
- ❌ 想看同城热点 → 用 `billboard_fetch_hot_city_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| page | integer | yes | 正整数 | 页码 |
| page_size | integer | yes | 正整数 | 每页数量 |
| type | string | yes | 枚举：snapshot/range | 快照类型：snapshot = 按时刻，range = 按时间范围 |
| snapshot_time | string | no | yyyyMMddHHmmss 格式 | 快照时间（type=snapshot 时有效） |
| start_date | string | no | yyyyMMdd 格式 | 开始时间（type=range 时有效） |
| end_date | string | no | yyyyMMdd 格式 | 结束时间（type=range 时有效） |
| sentence_tag | string | no | — | 热点分类标签，空 = 全部 |
| keyword | string | no | — | 热点搜索词 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].aweme_id | `$.data.list[].aweme_id` | 关联作品 ID | billboard_fetch_hot_user_portrait_list / billboard_fetch_hot_comment_word_list / billboard_fetch_hot_item_trends_list / video.md |
| list[].sec_uid | `$.data.list[].sec_uid` | 关联用户 ID | user.md 各端点 / billboard_fetch_hot_account_* |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数错误（type/snapshot_time 冲突） | 检查参数组合 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_calendar_list — 获取活动日历

**Full path:** `/api/v1/douyin/billboard/fetch_hot_calendar_list`
**Method:** POST · **Risk:** **high** · **需用户确认**

#### 用途
获取活动日历列表。POST 端点，参数通过 body 传递。

#### 何时使用 / 不使用
- ✅ 想查看活动日历
- ❌ 想看热点排行 → 用 GET 榜单端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| start_date | string | yes | 10 位时间戳 | 开始时间 |
| end_date | string | yes | 10 位时间戳 | 结束时间 |
| city_code | string | no | — | 城市编码，空 = 全部 |
| category_code | string | no | — | 热点榜分类编码，空 = 全部 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].calendar_id | `$.data.list[].calendar_id` | 活动 ID | billboard_fetch_hot_calendar_detail |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 日期格式错误 | 检查时间戳格式 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_calendar_detail — 获取活动日历详情

**Full path:** `/api/v1/douyin/billboard/fetch_hot_calendar_detail`
**Method:** GET · **Risk:** low

#### 用途
获取活动日历详情。需要 calendar_id。

#### 何时使用 / 不使用
- ✅ 已有 calendar_id，想查看活动详情
- ❌ 没有 calendar_id → 先用 `billboard_fetch_hot_calendar_list` 获取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| calendar_id | string | yes | — | 活动 ID，如 `1720` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 活动详情 | `$.data` | 活动日历详情 | 仅展示用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | calendar_id 不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_user_portrait_list — 获取作品点赞观众画像

**Full path:** `/api/v1/douyin/billboard/fetch_hot_user_portrait_list`
**Method:** GET · **Risk:** low

#### 用途
获取作品点赞观众画像数据，支持多维度分析（手机价格/性别/年龄/地域/城市等级/手机品牌）。

#### 何时使用 / 不使用
- ✅ 已有 aweme_id，想分析点赞用户画像
- ❌ 没有 aweme_id → 先从榜单或视频端点获取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | yes | 纯数字字符串 | 作品 ID |
| option | integer | no | 枚举 1-7，默认 4 | 选项：1 = 手机价格，2 = 性别，3 = 年龄，4 = 地域-省份，5 = 地域-城市，6 = 城市等级，7 = 手机品牌 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 画像数据 | `$.data` | 观众画像 | 仅展示用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | aweme_id 不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_comment_word_list — 获取作品评论词云权重

**Full path:** `/api/v1/douyin/billboard/fetch_hot_comment_word_list`
**Method:** GET · **Risk:** low

#### 用途
获取作品评论分析的词云权重数据。

#### 何时使用 / 不使用
- ✅ 已有 aweme_id，想分析评论关键词
- ❌ 想看评论列表 → 用 `comments.md` 的评论端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | yes | 纯数字字符串 | 作品 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 词云数据 | `$.data` | 评论词云权重 | 仅展示用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | aweme_id 不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_item_trends_list — 获取作品数据趋势

**Full path:** `/api/v1/douyin/billboard/fetch_hot_item_trends_list`
**Method:** GET · **Risk:** low

#### 用途
获取作品数据趋势（点赞量/分享量/评论量随时间变化）。

#### 何时使用 / 不使用
- ✅ 已有 aweme_id，想分析数据趋势
- ❌ 想看账号趋势 → 用 `billboard_fetch_hot_account_trends_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | no | 纯数字字符串 | 作品 ID |
| option | integer | no | 枚举 7-9，默认 7 | 选项：7 = 点赞量，8 = 分享量，9 = 评论量 |
| date_window | integer | no | 枚举 1-2，默认 1 | 时间窗口：1 = 按小时，2 = 按天 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 趋势数据 | `$.data` | 数据趋势 | 仅展示用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |
