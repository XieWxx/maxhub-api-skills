# Douyin Content Index — 日期与地区工具 / 抖音指数 — 日期与地区工具
> 本文件是 [content/_index.md](./_index.md) 的子文件。完整端点路由、链式调用图谱、错误处理契约请参见 _index.md。

## 端点详情

---

### index_fetch_all_valid_date — 获取所有有效日期

**Full path:** `/api/v1/douyin/index/fetch_all_valid_date`
**Method:** GET · **Risk:** low

#### 用途
获取关键词、品牌、话题等维度的日/周/月最新可用日期。**链式调用的前置步骤**——在调用趋势/画像端点前，先获取有效日期范围。

#### 何时使用 / 不使用
- ✅ 调用趋势/画像端点前获取有效日期
- ✅ 不确定日期范围时查询
- ❌ 已知有效日期范围 → 直接使用

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 无必填参数 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| keyword_date | `$.data.keyword.date_list[-1]` | 关键词最新可用日期 | index_fetch_multi_keyword_hot_trend 等 |
| brand_date | `$.data.brand.date_list[-1]` | 品牌最新可用日期 | index_fetch_brand_lines 等 |
| topic_date | `$.data.topic.date_list[-1]` | 话题最新可用日期 | index_fetch_topic_query 等 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_valid_date_for_relation — 获取关联分析有效日期

**Full path:** `/api/v1/douyin/index/fetch_valid_date_for_relation`
**Method:** GET · **Risk:** low

#### 用途
获取关联分析（`index_fetch_relation_word`）的起止可用日期。

#### 何时使用 / 不使用
- ✅ 调用 `index_fetch_relation_word` 前获取有效日期
- ❌ 非关联分析场景 → 用 `index_fetch_all_valid_date`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 无必填参数 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| start_date | `$.data.start_date` | 关联分析起始日期 | index_fetch_relation_word |
| end_date | `$.data.end_date` | 关联分析结束日期 | index_fetch_relation_word |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_all_area — 获取所有地区列表

**Full path:** `/api/v1/douyin/index/fetch_all_area`
**Method:** GET · **Risk:** low

#### 用途
获取省份和城市的层级结构列表，用于 `region` 参数的地区筛选。

#### 何时使用 / 不使用
- ✅ 需要获取可用的地区列表用于 region 参数
- ❌ 已知地区名称 → 直接使用

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 无必填参数 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 地区列表为参考数据，用于构造 region 参数 | index_fetch_multi_keyword_hot_trend 等 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |
