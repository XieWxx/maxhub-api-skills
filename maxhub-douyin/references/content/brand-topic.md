# Douyin Content Index — 品牌+话题 / 抖音指数 — 品牌+话题
> 本文件是 [content/_index.md](./_index.md) 的子文件。完整端点路由、链式调用图谱、错误处理契约请参见 _index.md。

## 端点详情

---

### index_fetch_brand_suggest — 品牌搜索建议

**Full path:** `/api/v1/douyin/index/fetch_brand_suggest`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
搜索品牌，返回匹配的品牌列表。**品牌分析的链式起点**——brand_name 从此处产出，供品牌详情端点使用。

#### 何时使用 / 不使用
- ✅ 搜索品牌获取 brand_name
- ✅ 链式起点：brand_name → 品牌趋势/雷达/周期
- ❌ 已知 brand_name → 直接调用品牌详情端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 品牌名称关键词 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| brand_list[].brand_name | `$.data.brand_list[].brand_name` | 品牌名称 | index_fetch_brand_radar_chart / lines / cycles 等 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | keyword 缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_brand_valid_info — 品牌指数与可用日期

**Full path:** `/api/v1/douyin/index/fetch_brand_valid_info`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取品牌指数和可查询的日期范围。

#### 何时使用 / 不使用
- ✅ 查看品牌指数和可用日期
- ❌ 已知品牌可用日期 → 直接调用品牌趋势端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword_list | string | yes | 逗号分隔 | 品牌名称列表 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| brand_info[].start_date | `$.data.brand_info[].start_date` | 品牌起始日期 | index_fetch_brand_lines 等 |
| brand_info[].end_date | `$.data.brand_info[].end_date` | 品牌结束日期 | index_fetch_brand_lines 等 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | keyword_list 缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_brand_radar_chart — 品牌雷达图

**Full path:** `/api/v1/douyin/index/fetch_brand_radar_chart`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取品牌多维度评分雷达图数据。

#### 何时使用 / 不使用
- ✅ 查看品牌多维度评分
- ❌ 只看热度趋势 → 用 `index_fetch_brand_lines`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| brand_name | string | yes | — | 品牌名称 |
| start_date | string | yes | 格式 YYYYMMDD | 开始日期 |
| end_date | string | yes | 格式 YYYYMMDD | 结束日期 |
| app_name | string | no | default: aweme | 平台筛选 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 雷达图数据为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_brand_lines — 品牌趋势线

**Full path:** `/api/v1/douyin/index/fetch_brand_lines`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取品牌热度趋势线数据。

#### 何时使用 / 不使用
- ✅ 查看品牌热度趋势变化
- ❌ 只看综合评分 → 用 `index_fetch_brand_radar_chart`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| brand_name | string | yes | — | 品牌名称 |
| start_date | string | yes | 格式 YYYYMMDD | 开始日期 |
| end_date | string | yes | 格式 YYYYMMDD | 结束日期 |
| app_name | string | no | default: aweme | 平台筛选 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 趋势线数据为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_brand_cycles — 品牌周期数据

**Full path:** `/api/v1/douyin/index/fetch_brand_cycles`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取品牌周期性热度数据。

#### 何时使用 / 不使用
- ✅ 查看品牌周期性变化规律
- ❌ 只看趋势线 → 用 `index_fetch_brand_lines`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| brand_name | string | yes | — | 品牌名称 |
| start_date | string | yes | 格式 YYYYMMDD | 开始日期 |
| end_date | string | yes | 格式 YYYYMMDD | 结束日期 |
| app_name | string | no | default: aweme | 平台筛选 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 周期数据为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_brand_initiative_rank_weekly — 品牌主动排行周榜

**Full path:** `/api/v1/douyin/index/fetch_brand_initiative_rank_weekly`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取品牌在该周的主动排行数据。

#### 何时使用 / 不使用
- ✅ 查看品牌周排行
- ❌ 只看趋势 → 用 `index_fetch_brand_lines`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| brand_name | string | yes | — | 品牌名称 |
| start_date | string | yes | 格式 YYYYMMDD | 开始日期 |
| end_date | string | yes | 格式 YYYYMMDD | 结束日期 |
| app_name | string | no | default: aweme | 平台筛选 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 排行数据为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_brand_hot_videos_time_scope — 品牌热门视频时间范围

**Full path:** `/api/v1/douyin/index/fetch_brand_hot_videos_time_scope`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取品牌热门视频可查询的时间范围（起止日期、周期单位等）。

#### 何时使用 / 不使用
- ✅ 查询品牌热门视频前获取时间范围
- ❌ 已知时间范围 → 直接使用

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 无必填参数 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 时间范围为参考数据 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_topic_suggest — 话题搜索建议

**Full path:** `/api/v1/douyin/index/fetch_topic_suggest`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
搜索话题，返回匹配的话题列表。**话题分析的链式起点**——keyword 从此处产出，供话题详情端点使用。

#### 何时使用 / 不使用
- ✅ 搜索话题获取 keyword
- ✅ 链式起点：keyword → 话题详情
- ❌ 已知话题关键词 → 直接用 `index_fetch_topic_query`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 话题关键词 |
| app_name | string | no | default: aweme | 平台筛选 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| topic_list[].keyword | `$.data.topic_list[].keyword` | 话题关键词 | index_fetch_topic_query 的 keyword |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | keyword 缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_topic_query — 话题搜索结果

**Full path:** `/api/v1/douyin/index/fetch_topic_query`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取话题详情、话题热度、相关视频数等。

#### 何时使用 / 不使用
- ✅ 查看话题详情和热度
- ❌ 只搜索话题 → 用 `index_fetch_topic_suggest`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 话题关键词 |
| start_date | string | yes | 格式 YYYYMMDD | 开始日期 |
| end_date | string | yes | 格式 YYYYMMDD | 结束日期 |
| app_name | string | no | default: aweme | 平台筛选 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 话题数据为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |
