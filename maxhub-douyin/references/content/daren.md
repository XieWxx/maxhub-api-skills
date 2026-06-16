# Douyin Content Index — 达人分析+视频搜索 / 抖音指数 — 达人分析+视频搜索
> 本文件是 [content/_index.md](./_index.md) 的子文件。完整端点路由、链式调用图谱、错误处理契约请参见 _index.md。

## 端点详情

---

### index_fetch_daren_sug_great_user_list — 达人搜索建议

**Full path:** `/api/v1/douyin/index/fetch_daren_sug_great_user_list`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
搜索达人，返回匹配的达人列表（达人 ID、昵称、头像、粉丝数等）。**达人分析的链式起点**——user_id 从此处产出，供达人详情端点使用。

#### 何时使用 / 不使用
- ✅ 搜索达人获取 user_id
- ✅ 链式起点：user_id → 达人详情/粉丝/视频/相似达人
- ❌ 已知 user_id → 直接调用达人详情端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| total | string | no | default: 20 | 返回数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user_list[].user_id | `$.data.user_list[].user_id` | 达人加密 user_id | index_fetch_daren_* 系列端点 |
| user_list[].uid | `$.data.user_list[].uid` | 达人原始 uid | user.md 的 web_fetch_user_profile_by_uid |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | keyword 缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_daren_compare_users_stable — 达人趋势对比

**Full path:** `/api/v1/douyin/index/fetch_daren_compare_users_stable`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
对比多个达人在指定天数内的趋势数据。**注意：user_list 最多 5 个 uid。**

#### 何时使用 / 不使用
- ✅ 对比 2-5 个达人的趋势数据
- ❌ 超过 5 个达人 → 分批对比
- ❌ 只看单个达人 → 用 `index_fetch_daren_great_item_mile_info`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_list | string | yes | 逗号分隔，**最多 5 个** | 达人 uid 列表 |
| days | string | no | enum: 7, 30, default: 7 | 对比天数 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 对比数据为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | user_list 缺失或超过 5 个 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_daren_similar_users — 获取相似达人

**Full path:** `/api/v1/douyin/index/fetch_daren_similar_users`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取与指定达人相似的达人列表。

#### 何时使用 / 不使用
- ✅ 想找与某达人相似的其他达人
- ✅ 已知 user_id
- ❌ 不知 user_id → 先通过 `index_fetch_daren_sug_great_user_list` 搜索

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | 纯数字 uid | 达人 uid |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| similar_users[].user_id | `$.data.similar_users[].user_id` | 相似达人 user_id | index_fetch_daren_* 系列端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | user_id 缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_daren_great_user_top_video — 达人热门视频

**Full path:** `/api/v1/douyin/index/fetch_daren_great_user_top_video`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取达人热门视频列表。**注意：日期范围不超过 30 天。**

#### 何时使用 / 不使用
- ✅ 查看达人近期热门视频
- ✅ 已知 user_id 和日期范围
- ❌ 日期范围超过 30 天 → 缩小范围

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | 纯数字 uid | 达人 uid |
| start_date | string | yes | 格式 YYYYMMDD | 开始日期 |
| end_date | string | yes | 格式 YYYYMMDD，**不超过 start_date 后 30 天** | 结束日期 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| video_list[].aweme_id | `$.data.video_list[].aweme_id` | 视频 ID | video.md 全部 video 系端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或日期范围超过 30 天 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_daren_great_item_mile_info — 达人核心指标

**Full path:** `/api/v1/douyin/index/fetch_daren_great_item_mile_info`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取达人核心指标数据，包含粉丝数、获赞数、作品数、互动率等。

#### 何时使用 / 不使用
- ✅ 查看达人核心数据概览
- ❌ 需要粉丝画像 → 用 `index_fetch_daren_great_user_fans_info`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | 纯数字 uid | 达人 uid |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 核心指标为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | user_id 缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_daren_great_user_fans_info — 达人粉丝分析

**Full path:** `/api/v1/douyin/index/fetch_daren_great_user_fans_info`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取达人粉丝画像数据，包含性别分布、年龄分布、地域分布、活跃时间等。

#### 何时使用 / 不使用
- ✅ 查看达人粉丝画像
- ❌ 只看核心指标 → 用 `index_fetch_daren_great_item_mile_info`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | 纯数字 uid | 达人 uid |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 粉丝画像为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | user_id 缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_item_filter_options — 获取视频搜索筛选选项

**Full path:** `/api/v1/douyin/index/fetch_item_filter_options`
**Method:** GET · **Risk:** low

#### 用途
获取视频搜索的完整筛选选项，包含垂类（categories）、时长（duration_types）、类型（label_types）、发布时间（date_types）的可选值。**视频搜索的前置步骤**——获取 category_id 等筛选参数。

#### 何时使用 / 不使用
- ✅ 调用 `index_fetch_item_query` 前获取筛选选项
- ✅ 需要知道 tag_id / category_id 的有效值
- ❌ 已知筛选参数 → 直接调用 `index_fetch_item_query`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 无必填参数 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| categories[].id | `$.data.categories[].id` | 垂类 ID | index_fetch_item_query 的 category_id；创作指南端点的 tag_id |
| duration_types | `$.data.duration_types` | 时长选项 | index_fetch_item_query 的 duration_type |
| label_types | `$.data.label_types` | 类型选项 | index_fetch_item_query 的 label_type |
| date_types | `$.data.date_types` | 日期选项 | index_fetch_item_query 的 date_type |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_item_sug — 视频搜索建议

**Full path:** `/api/v1/douyin/index/fetch_item_sug`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取视频搜索的关键词建议列表。

#### 何时使用 / 不使用
- ✅ 搜索视频前获取关键词建议
- ❌ 已知搜索关键词 → 直接用 `index_fetch_item_query`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| query | string | yes | — | 搜索关键词 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| suggestions | `$.data.suggestions` | 关键词建议列表 | index_fetch_item_query 的 query |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | query 缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_item_query — 视频搜索结果

**Full path:** `/api/v1/douyin/index/fetch_item_query`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
搜索视频，返回视频列表（含播放量、点赞数、评论数、分享数、作者信息等）。支持垂类/时长/类型/日期筛选。

#### 何时使用 / 不使用
- ✅ 搜索特定类型的视频
- ✅ 需要按垂类/时长/类型筛选
- ❌ 通用搜索 → 用 `search.md` 的搜索端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| query | string | yes | — | 搜索关键词 |
| category_id | string | no | default: 0=全部，从 `index_fetch_item_filter_options` 获取 | 垂类 ID |
| date_type | integer | no | enum: 0=不限, 3=近3天, 7=近7天, 30=近一个月, default: 0 | 发布时间 |
| label_type | integer | no | enum: 0=不限, 1=低粉爆款, 2=高完播率, 3=高涨粉率, 4=高点赞率, default: 0 | 视频类型 |
| duration_type | integer | no | enum: 0=不限, 1=0-15秒, 6=15-60秒, 7=60-120秒, 8=120-180秒, 9=>180秒, default: 0 | 时长 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].aweme_id | `$.data.list[].aweme_id` | 视频 ID | video.md 全部 video 系端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | query 缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |
