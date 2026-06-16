# Douyin Xingtu — KOL 搜索 + V2 排行榜 / 抖音星图 — KOL 搜索 + V2 排行榜
> 本文件是 [xingtu/_index.md](./_index.md) 的子文件。完整端点路由、链式调用图谱、错误处理契约请参见 _index.md。

## 端点详情

---

### xingtu_search_kol_v1 — 基础关键词搜索 KOL

**Full path:** `/api/v1/douyin/xingtu/search_kol_v1`
**Method:** GET · **Risk:** low

#### 用途
基础关键词搜索 KOL，返回匹配的 KOL 列表。

#### 何时使用 / 不使用
- ✅ 简单关键词搜索 KOL
- ❌ 需要粉丝范围/内容标签筛选 → 用 `xingtu_search_kol_v2`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| platformSource | string | yes | enum: _1=抖音, _2=头条, _3=西瓜 | 平台来源 |
| page | integer | yes | — | 页码 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].kolId | `$.data.list[].kolId` | 星图 KOL ID | xingtu_kol_*_v1 系列端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 必填参数缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### xingtu_search_kol_v2 — 高级搜索 KOL

**Full path:** `/api/v1/douyin/xingtu/search_kol_v2`
**Method:** GET · **Risk:** low

#### 用途
高级搜索 KOL，支持粉丝范围和内容标签筛选。**推荐使用**——筛选能力更强。

#### 何时使用 / 不使用
- ✅ 需要按粉丝范围/内容标签筛选 KOL
- ✅ 链式起点：搜索结果 → kolId → KOL 分析
- ❌ 简单搜索 → 用 `xingtu_search_kol_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| followerRange | string | no | 格式: `10-100` 表示 10 万-100 万 | 粉丝范围 |
| contentTag | string | no | 格式: `tag-{id}` 或 `tag_level_two-{id}` | 内容标签（如 `tag-1`=美妆） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].kolId | `$.data.list[].kolId` | 星图 KOL ID | xingtu_kol_*_v1 系列端点 |
| list[].uid | `$.data.list[].uid` | 抖音 uid | user.md 的 web_fetch_user_profile_by_uid |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | keyword 缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### xingtu_v2_get_ranking_list_catalog — 获取星图热榜分类

**Full path:** `/api/v1/douyin/xingtu_v2/get_ranking_list_catalog`
**Method:** GET · **Risk:** low

#### 用途
获取星图热榜分类目录。**排行榜的前置步骤**——获取 code 和 biz_scene 供 `get_ranking_list_data` 使用。

#### 何时使用 / 不使用
- ✅ 调用 `get_ranking_list_data` 前获取分类
- ❌ 已知榜单参数 → 直接调用 `get_ranking_list_data`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| codes | string | no | default: 空字符串 | 分类代码 |
| biz_scene | string | no | douyin_flow_split_video_author_ranks=短视频达人热榜, douyin_flow_split_live_author_ranks=直播达人热榜 | 业务场景 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| catalog[].code | `$.data.catalog[].code` | 榜单类型代码 | xingtu_v2_get_ranking_list_data 的 code |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### xingtu_v2_get_ranking_list_data — 获取达人商业榜数据

**Full path:** `/api/v1/douyin/xingtu_v2/get_ranking_list_data`
**Method:** GET · **Risk:** low

#### 用途
获取星图达人商业榜数据。

#### 何时使用 / 不使用
- ✅ 查看达人商业排行榜
- ❌ 查看短剧演员榜 → 用 `xingtu_v2_get_playlet_actor_rank_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| code | integer | no | default: 1 | 榜单类型代码 |
| qualifier | string | no | default: 1901 | 榜单分类 ID |
| version | string | no | flow_split=短视频榜单, base=直播榜单, default: flow_split | 版本 |
| period | integer | no | enum: 7=周榜, 30=月榜, default: 30 | 统计周期 |
| date | string | no | 格式 YYYYMMDD | 统计日期 |
| limit | integer | no | default: 100 | 返回数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].o_author_id | `$.data.list[].o_author_id` | 创作者 ID | xingtu_v2_get_author_base_info |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### xingtu_v2_get_playlet_actor_rank_catalog — 获取短剧演员热榜分类

**Full path:** `/api/v1/douyin/xingtu_v2/get_playlet_actor_rank_catalog`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取短剧演员热榜分类数据。

#### 何时使用 / 不使用
- ✅ 调用 `get_playlet_actor_rank_list` 前获取分类
- ❌ 已知分类参数 → 直接调用 `get_playlet_actor_rank_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 无必填参数 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 分类数据为参考数据 | xingtu_v2_get_playlet_actor_rank_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### xingtu_v2_get_playlet_actor_rank_list — 获取短剧演员热榜

**Full path:** `/api/v1/douyin/xingtu_v2/get_playlet_actor_rank_list`
**Method:** GET · **Risk:** low

#### 用途
获取短剧演员热榜数据。

#### 何时使用 / 不使用
- ✅ 查看短剧演员排行榜
- ❌ 查看达人商业榜 → 用 `xingtu_v2_get_ranking_list_data`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| category | string | no | default: playlet_actor_list | 分类 |
| name | string | no | default: playlet_actor_composite_list | 榜单名称 |
| qualifier | string | no | 空=不限 | 达人类型 |
| period | integer | no | enum: 7=周榜, 30=月榜, default: 30 | 统计周期 |
| date | string | no | 格式 YYYYMMDD | 统计日期 |
| limit | integer | no | default: 100 | 返回数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 短剧演员榜为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### xingtu_v2_get_author_market_fields — 获取达人广场筛选字段

**Full path:** `/api/v1/douyin/xingtu_v2/get_author_market_fields`
**Method:** GET · **Risk:** low

#### 用途
获取达人广场筛选字段数据。

#### 何时使用 / 不使用
- ✅ 需要了解达人广场的筛选维度
- ❌ 直接搜索达人 → 用 `xingtu_search_kol_v2`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| market_scene | integer | no | default: 1 | 市场场景 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 筛选字段为参考数据 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |
