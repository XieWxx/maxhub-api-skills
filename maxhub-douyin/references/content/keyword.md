# Douyin Content Index — 热点+关键词+订阅+加密 / 抖音指数 — 热点+关键词+订阅+加密
> 本文件是 [content/_index.md](./_index.md) 的子文件。完整端点路由、链式调用图谱、错误处理契约请参见 _index.md。

## 端点详情

---

### index_fetch_current_hot_topic — 获取实时热点排行

**Full path:** `/api/v1/douyin/index/fetch_current_hot_topic`
**Method:** GET · **Risk:** low

#### 用途
获取实时热点排行，包含热点名称、热点指数、排名变化等信息。**链式调用常见起点**——热点关键词可作为 `index_fetch_multi_keyword_hot_trend` 的输入。

#### 何时使用 / 不使用
- ✅ 想了解当前热门话题
- ✅ 链式起点：热点关键词 → 关键词趋势分析
- ❌ 想看关键词趋势 → 直接用 `index_fetch_multi_keyword_hot_trend`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 无必填参数 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| hot_topics[].word | `$.data.hot_topics[].word` | 热点关键词 | index_fetch_multi_keyword_hot_trend 的 keyword_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_hot_words — 获取热门关键词

**Full path:** `/api/v1/douyin/index/fetch_hot_words`
**Method:** GET · **Risk:** low

#### 用途
获取热门关键词排行，包含关键词名称、搜索指数、增长率等。

#### 何时使用 / 不使用
- ✅ 想了解当前热门搜索词
- ❌ 想看特定关键词趋势 → 用 `index_fetch_multi_keyword_hot_trend`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| app_name | string | no | enum: aweme=抖音, toutiao=头条, default: aweme | 平台筛选 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| hot_words[].word | `$.data.hot_words[].word` | 热门关键词 | index_fetch_multi_keyword_hot_trend 的 keyword_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_keyword_valid_date — 获取关键词有效日期

**Full path:** `/api/v1/douyin/index/fetch_keyword_valid_date`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
查询指定关键词可查询的起止日期范围。

#### 何时使用 / 不使用
- ✅ 不确定关键词可查询的日期范围时
- ❌ 已知有效日期 → 直接使用

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword_list | string | yes | 逗号分隔（如 `美食,旅游`） | 关键词列表 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| keyword_dates[].start_date | `$.data.keyword_dates[].start_date` | 各关键词起始日期 | index_fetch_multi_keyword_hot_trend |
| keyword_dates[].end_date | `$.data.keyword_dates[].end_date` | 各关键词结束日期 | index_fetch_multi_keyword_hot_trend |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | keyword_list 缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_multi_keyword_hot_trend — 多关键词热度趋势

**Full path:** `/api/v1/douyin/index/fetch_multi_keyword_hot_trend`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取多个关键词的热度趋势对比数据。**核心分析端点**——每日热度数据可用于趋势对比和关联分析。

#### 何时使用 / 不使用
- ✅ 对比多个关键词的热度趋势
- ✅ 查看单个关键词的历史热度变化
- ❌ 只看实时排行 → 用 `index_fetch_hot_words`
- ❌ 需要人群画像 → 用 `index_fetch_portrait`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword_list | string | yes | 逗号分隔 | 关键词列表 |
| start_date | string | yes | 格式 YYYYMMDD | 开始日期 |
| end_date | string | yes | 格式 YYYYMMDD | 结束日期 |
| app_name | string | no | enum: aweme, toutiao, default: aweme | 平台筛选 |
| region | string | no | 逗号分隔，留空=全国 | 地区筛选 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| trend_data | `$.data.trend_data` | 每日热度数据 | 终端数据，无下游链式调用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或格式错误 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_multi_keyword_interpretation — 多关键词解读

**Full path:** `/api/v1/douyin/index/fetch_multi_keyword_interpretation`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取多关键词的综合指数解读，包含搜索指数、内容指数等。

#### 何时使用 / 不使用
- ✅ 需要关键词的综合指数解读（搜索指数 + 内容指数）
- ❌ 只看热度趋势 → 用 `index_fetch_multi_keyword_hot_trend`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword_list | string | yes | 逗号分隔 | 关键词列表 |
| start_date | string | yes | 格式 YYYYMMDD | 开始日期 |
| end_date | string | yes | 格式 YYYYMMDD | 结束日期 |
| app_name | string | no | default: aweme | 平台筛选 |
| region | string | no | 逗号分隔 | 地区筛选 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 解读数据为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或格式错误 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_relation_word — 关键词关联词分析

**Full path:** `/api/v1/douyin/index/fetch_relation_word`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取关键词的搜索关联词和内容关联词。**注意：end_date 必须为周日，否则可能返回空数据。**

#### 何时使用 / 不使用
- ✅ 需要查看关键词的关联词图谱
- ✅ 发现新的相关关键词
- ❌ 只看热度趋势 → 用 `index_fetch_multi_keyword_hot_trend`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 关键词 |
| start_date | string | yes | 格式 YYYYMMDD，建议为周一 | 开始日期 |
| end_date | string | yes | 格式 YYYYMMDD，**必须为周日** | 结束日期 |
| app_name | string | no | default: aweme | 平台筛选 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| search_relation_words | `$.data.search_relation_words` | 搜索关联词列表 | index_fetch_multi_keyword_hot_trend 的 keyword_list |
| content_relation_words | `$.data.content_relation_words` | 内容关联词列表 | index_fetch_multi_keyword_hot_trend 的 keyword_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或 end_date 非周日 | 校正日期重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_portrait — 关键词人群画像

**Full path:** `/api/v1/douyin/index/fetch_portrait`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取关键词的人群画像数据，包含性别分布、年龄分布、地域分布、兴趣分布等。

#### 何时使用 / 不使用
- ✅ 需要了解搜索某关键词的人群特征
- ❌ 只看热度趋势 → 用 `index_fetch_multi_keyword_hot_trend`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 关键词 |
| start_date | string | yes | 格式 YYYYMMDD | 开始日期 |
| end_date | string | yes | 格式 YYYYMMDD | 结束日期 |
| app_name | string | no | default: aweme | 平台筛选 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 画像数据为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或格式错误 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_get_user_sub_word — 获取用户订阅关键词

**Full path:** `/api/v1/douyin/index/fetch_get_user_sub_word`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取用户已订阅的关键词列表。

#### 何时使用 / 不使用
- ✅ 查看用户已订阅的关键词
- ❌ 搜索关键词 → 用 `index_fetch_hot_words`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 无必填参数 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| sub_words | `$.data.sub_words` | 订阅关键词列表 | index_fetch_multi_keyword_hot_trend 的 keyword_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_encrypt_user_id — uid 转加密 user_id

**Full path:** `/api/v1/douyin/index/fetch_encrypt_user_id`
**Method:** GET · **Risk:** low

#### 用途
将抖音 uid（纯数字）转换为加密的 user_id。**达人分析端点的前置步骤**——达人端点需要加密后的 user_id。

#### 何时使用 / 不使用
- ✅ 达人端点需要加密 user_id 时
- ✅ 已知抖音 uid 但达人端点报参数错误
- ❌ 已有加密 user_id → 直接使用

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | 纯数字 | 抖音 uid |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user_id | `$.data.user_id` | 加密后的 user_id | index_fetch_daren_* 系列端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | uid 缺失或格式无效 | 校正参数重试 | ≤1 次 | — |
| 404 | uid 不存在 | STOP | 0 | — |
