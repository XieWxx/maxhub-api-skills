# Douyin Content Index — 创作指南+洞察报告 / 抖音指数 — 创作指南+洞察报告
> 本文件是 [content/_index.md](./_index.md) 的子文件。完整端点路由、链式调用图谱、错误处理契约请参见 _index.md。

## 端点详情

---

### index_fetch_content_valid_date — 创作指南有效日期

**Full path:** `/api/v1/douyin/index/fetch_content_valid_date`
**Method:** GET · **Risk:** low

#### 用途
获取创作指南可查询的起止日期。**创作指南的前置步骤**——获取 end_date 供创作指南端点使用。

#### 何时使用 / 不使用
- ✅ 调用创作指南端点前获取有效日期
- ❌ 已知有效日期 → 直接使用

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 无必填参数 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| end_date | `$.data.end_date` | 创作指南最新可用日期 | index_fetch_content_creative_* 系列端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_content_creative_keywords — 创作热门关键词

**Full path:** `/api/v1/douyin/index/fetch_content_creative_keywords`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取指定垂类下的热门关键词列表。**创作指南的链式起点**——keyword 从此处产出，供关键词相关视频端点使用。**注意：tag_id 必填且不支持 0；period=7 时 end_date 必须为周日。**

#### 何时使用 / 不使用
- ✅ 查看某垂类的热门关键词
- ✅ 链式起点：keyword → 关键词相关视频
- ❌ tag_id=0（不支持全部）→ 需从 `index_fetch_item_filter_options` 获取有效 tag_id

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| tag_id | string | yes | **必填，不支持 0** | 垂类 ID |
| end_date | string | yes | 格式 YYYYMMDD，**period=7 时必须为周日** | 结束日期 |
| period | string | no | enum: 1=近1天, 3=近3天, 7=近7天, default: 7 | 时间周期 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| keywords[].keyword | `$.data.keywords[].keyword` | 热门关键词 | index_fetch_content_creative_keyword_items 的 keyword |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | tag_id 缺失/为 0，或 end_date 非周日 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_content_creative_keyword_items — 关键词相关视频

**Full path:** `/api/v1/douyin/index/fetch_content_creative_keyword_items`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取与指定关键词相关的视频列表。**注意：tag_id 必填且不支持 0。**

#### 何时使用 / 不使用
- ✅ 查看某关键词下的相关视频
- ✅ 已从 `index_fetch_content_creative_keywords` 获取 keyword
- ❌ 不知 keyword → 先调用 `index_fetch_content_creative_keywords`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| tag_id | string | yes | **必填，不支持 0** | 垂类 ID |
| end_date | string | yes | 格式 YYYYMMDD | 结束日期 |
| keyword | string | yes | 从 `index_fetch_content_creative_keywords` 获取 | 关键词 |
| period | string | no | enum: 1, 3, 7, default: 7 | 时间周期 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| item_list[].aweme_id | `$.data.item_list[].aweme_id` | 视频 ID | video.md 全部 video 系端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或 tag_id=0 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_content_creative_topic — 创作热门话题

**Full path:** `/api/v1/douyin/index/fetch_content_creative_topic`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取指定垂类下的热门话题列表。**注意：tag_id 必填且不支持 0。**

#### 何时使用 / 不使用
- ✅ 查看某垂类的热门话题
- ❌ 只看关键词 → 用 `index_fetch_content_creative_keywords`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| tag_id | string | yes | **必填，不支持 0** | 垂类 ID |
| end_date | string | yes | 格式 YYYYMMDD | 结束日期 |
| period | string | no | enum: 1, 3, 7, default: 7 | 时间周期 |
| rank_type | string | no | enum: index=指数排序, rise=飙升排序, default: index | 排序类型 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 话题列表为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或 tag_id=0 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_content_publish_trend — 内容发布趋势

**Full path:** `/api/v1/douyin/index/fetch_content_publish_trend`
**Method:** GET · **Risk:** low

#### 用途
获取指定垂类按日聚合的发布量数据。**注意：tag_id 必填且不支持 0。**

#### 何时使用 / 不使用
- ✅ 查看某垂类的内容发布趋势
- ❌ 只看互动趋势 → 用 `index_fetch_content_interact_trend`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| tag_id | string | yes | **必填，不支持 0** | 垂类 ID |
| start_date | string | yes | 格式 YYYYMMDD | 起始日期 |
| end_date | string | yes | 格式 YYYYMMDD | 结束日期 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 发布趋势为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或 tag_id=0 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_content_creative_duration — 创作时长分布

**Full path:** `/api/v1/douyin/index/fetch_content_creative_duration`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取指定垂类各时长区间的视频数量与占比。**注意：tag_id 必填且不支持 0；end_date 需与 period 对齐。**

#### 何时使用 / 不使用
- ✅ 查看某垂类的视频时长分布
- ❌ 只看发布趋势 → 用 `index_fetch_content_publish_trend`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| tag_id | string | yes | **必填，不支持 0** | 垂类 ID |
| end_date | string | yes | 需与 period 对齐（week→周日, month→月末） | 结束日期 |
| period | string | no | enum: week, month, default: week | 时间粒度 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 时长分布为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或 tag_id=0 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_content_author_portrait — 创作者画像

**Full path:** `/api/v1/douyin/index/fetch_content_author_portrait`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取指定垂类的创作者画像（性别分布、年龄段分布、地域分布、设备分布、活跃时段等）。**注意：tag_id 必填且不支持 0；end_date 需与 period 对齐。**

#### 何时使用 / 不使用
- ✅ 查看某垂类的创作者画像
- ❌ 查看消费者画像 → 用 `index_fetch_content_consumer_portrait`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| tag_id | string | yes | **必填，不支持 0** | 垂类 ID |
| end_date | string | yes | 需与 period 对齐 | 结束日期 |
| period | string | no | enum: week, month, default: month | 时间粒度 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 创作者画像为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或 tag_id=0 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_content_consumer_portrait — 消费者画像

**Full path:** `/api/v1/douyin/index/fetch_content_consumer_portrait`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取指定垂类的消费者画像（性别分布、年龄段分布、地域分布、兴趣偏好、设备分布等）。**注意：tag_id 必填且不支持 0；end_date 需与 period 对齐。**

#### 何时使用 / 不使用
- ✅ 查看某垂类的消费者画像
- ❌ 查看创作者画像 → 用 `index_fetch_content_author_portrait`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| tag_id | string | yes | **必填，不支持 0** | 垂类 ID |
| end_date | string | yes | 需与 period 对齐 | 结束日期 |
| period | string | no | enum: week, month, default: month | 时间粒度 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 消费者画像为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或 tag_id=0 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_content_interact_trend — 互动趋势

**Full path:** `/api/v1/douyin/index/fetch_content_interact_trend`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取指定垂类的每日互动数据（点赞总数、评论总数、分享总数、收藏总数等）。**注意：tag_id 必填且不支持 0。**

#### 何时使用 / 不使用
- ✅ 查看某垂类的互动趋势
- ❌ 只看消费趋势 → 用 `index_fetch_content_consume_trend`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| tag_id | string | yes | **必填，不支持 0** | 垂类 ID |
| start_date | string | yes | 格式 YYYYMMDD | 起始日期 |
| end_date | string | yes | 格式 YYYYMMDD | 结束日期 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 互动趋势为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或 tag_id=0 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_content_consume_trend — 消费趋势

**Full path:** `/api/v1/douyin/index/fetch_content_consume_trend`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取指定垂类的每日消费数据（播放总量、观看时长、独立观看人数等）。**注意：tag_id 必填且不支持 0。**

#### 何时使用 / 不使用
- ✅ 查看某垂类的消费趋势
- ❌ 只看互动趋势 → 用 `index_fetch_content_interact_trend`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| tag_id | string | yes | **必填，不支持 0** | 垂类 ID |
| start_date | string | yes | 格式 YYYYMMDD | 起始日期 |
| end_date | string | yes | 格式 YYYYMMDD | 结束日期 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 消费趋势为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或 tag_id=0 | 校正参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_insight_recommend — 获取推荐报告

**Full path:** `/api/v1/douyin/index/fetch_insight_recommend`
**Method:** GET · **Risk:** low

#### 用途
获取推荐报告列表（含报告 ID、标题、封面、发布时间等）。

#### 何时使用 / 不使用
- ✅ 浏览推荐报告
- ✅ 链式起点：report_id → 报告详情
- ❌ 搜索特定报告 → 用 `index_fetch_report_search`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 无必填参数 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].report_id | `$.data.list[].report_id` | 报告 ID | index_fetch_report_detail / index_fetch_insight_get_rec |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_report_search — 搜索趋势报告

**Full path:** `/api/v1/douyin/index/fetch_report_search`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
搜索趋势报告，支持按类型/产品/年份/关键词筛选。

#### 何时使用 / 不使用
- ✅ 搜索特定类型的趋势报告
- ❌ 浏览推荐 → 用 `index_fetch_insight_recommend`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| current_page | string | no | default: 1 | 页码 |
| page_size | string | no | default: 16 | 每页数量 |
| type | string | no | 行业洞察/产品洞察/用户洞察/趋势洞察 | 报告类型 |
| business | string | no | 逗号分隔: 巨量引擎,今日头条,抖音,西瓜视频,抖音电商,仕小禄,其他 | 所属产品 |
| report_time | string | no | 逗号分隔的年份 | 发布年份 |
| search | string | no | — | 报告关键词搜索 |
| category | string | no | default: 6 | 顶层分类 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].report_id | `$.data.list[].report_id` | 报告 ID | index_fetch_report_detail / index_fetch_insight_get_rec |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### index_fetch_report_detail — 获取报告详情

**Full path:** `/api/v1/douyin/index/fetch_report_detail`
**Method:** GET · **Risk:** low

#### 用途
获取报告完整数据（标题、封面、发布时间、产品标签、内容、图片、PDF 链接等）。

#### 何时使用 / 不使用
- ✅ 查看报告详情
- ✅ 已从搜索/推荐端点获取 report_id
- ❌ 不知 report_id → 先搜索或浏览推荐

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| report_id | string | yes | — | 报告 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 报告详情为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | report_id 缺失 | 补全参数重试 | ≤1 次 | — |
| 404 | report_id 不存在 | STOP | 0 | — |

---

### index_fetch_insight_get_rec — 获取报告相关推荐

**Full path:** `/api/v1/douyin/index/fetch_insight_get_rec`
**Method:** GET · **Risk:** low

#### 用途
获取与指定报告相关的推荐报告列表。

#### 何时使用 / 不使用
- ✅ 查看报告的相关推荐
- ✅ 已知 report_id
- ❌ 不知 report_id → 先搜索或浏览推荐

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| report_id | string | yes | — | 报告 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| rec_list[].report_id | `$.data.rec_list[].report_id` | 推荐报告 ID | index_fetch_report_detail |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | report_id 缺失 | 补全参数重试 | ≤1 次 | — |
| 404 | report_id 不存在 | STOP | 0 | — |
