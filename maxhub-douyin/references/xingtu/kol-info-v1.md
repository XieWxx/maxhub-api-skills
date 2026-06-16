# Douyin Xingtu — KOL 分析 V1 / 抖音星图 — KOL 分析 V1
> 本文件是 [xingtu/_index.md](./_index.md) 的子文件。完整端点路由、链式调用图谱、错误处理契约请参见 _index.md。

## 端点详情

---

### xingtu_kol_base_info_v1 — KOL 基本信息

**Full path:** `/api/v1/douyin/xingtu/kol_base_info_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 基本信息（昵称、头像、粉丝数、简介等）。**V1 端点的链式核心**——kolId 和 platformChannel 从此处确认。

#### 何时使用 / 不使用
- ✅ 已知 kolId，需要获取 KOL 基本信息
- ✅ 链式核心：基本信息 → 粉丝画像/服务报价/数据概览
- ❌ 不知 kolId → 先通过 ID 查找端点获取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |
| platformChannel | string | yes | enum: _1=抖音短视频, _10=抖音直播 | 平台渠道 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| kolId | `$.data.kolId` | 星图 KOL ID | xingtu_kol_*_v1 系列端点 |
| platformChannel | `$.data.platformChannel` | 平台渠道 | xingtu_kol_service_price_v1 等 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | kolId 或 platformChannel 缺失 | 补全参数重试 | ≤1 次 | — |
| 404 | kolId 不存在 | STOP | 0 | — |

---

### xingtu_kol_audience_portrait_v1 — KOL 观众画像

**Full path:** `/api/v1/douyin/xingtu/kol_audience_portrait_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 观众画像数据（性别/年龄/地域/兴趣分布等）。

#### 何时使用 / 不使用
- ✅ 查看 KOL 观众画像
- ❌ 查看粉丝画像 → 用 `xingtu_kol_fans_portrait_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 观众画像为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | kolId 缺失 | 补全参数重试 | ≤1 次 | — |
| 404 | kolId 不存在 | STOP | 0 | — |

---

### xingtu_kol_fans_portrait_v1 — KOL 粉丝画像

**Full path:** `/api/v1/douyin/xingtu/kol_fans_portrait_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 粉丝画像数据，支持粉丝/粉丝团/铁粉三种类型。

#### 何时使用 / 不使用
- ✅ 查看 KOL 粉丝画像
- ✅ 需要区分粉丝团/铁粉 → 设置 fansType
- ❌ 查看观众画像 → 用 `xingtu_kol_audience_portrait_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |
| fansType | string | no | enum: _1=粉丝画像, _2=粉丝团画像, _5=铁粉画像, default: _1 | 粉丝类型 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 粉丝画像为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | kolId 缺失 | 补全参数重试 | ≤1 次 | — |
| 404 | kolId 不存在 | STOP | 0 | — |

---

### xingtu_kol_service_price_v1 — KOL 服务报价

**Full path:** `/api/v1/douyin/xingtu/kol_service_price_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 服务报价信息。

#### 何时使用 / 不使用
- ✅ 查看 KOL 商业报价
- ❌ 不知 platformChannel → 先从 `kol_base_info_v1` 获取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |
| platformChannel | string | yes | enum: _1=抖音短视频, _10=抖音直播 | 平台渠道 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 服务报价为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | kolId 或 platformChannel 缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_kol_data_overview_v1 — KOL 数据概览

**Full path:** `/api/v1/douyin/xingtu/kol_data_overview_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 数据概览（播放量、互动数据等）。

#### 何时使用 / 不使用
- ✅ 查看 KOL 整体数据概览
- ❌ 需要转化能力 → 用 `xingtu_kol_conversion_ability_analysis_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |
| _type | string | yes | enum: _1=个人视频, _2=星图视频 | 类型 |
| _range | string | yes | enum: _2=近30天, _3=近90天 | 范围 |
| flowType | integer | yes | 1=默认 | 流量类型 |
| onlyAssign | boolean | no | false=全部, true=仅指派数据 | 是否仅看指派 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 数据概览为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 必填参数缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_kol_conversion_ability_analysis_v1 — KOL 转化能力分析

**Full path:** `/api/v1/douyin/xingtu/kol_conversion_ability_analysis_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 转化能力分析数据。

#### 何时使用 / 不使用
- ✅ 查看 KOL 转化能力
- ❌ 只看数据概览 → 用 `xingtu_kol_data_overview_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |
| _range | string | yes | enum: _1=近7天, _2=近30天, _3=近90天 | 时间范围 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 转化能力为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 必填参数缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_kol_video_performance_v1 — KOL 视频表现

**Full path:** `/api/v1/douyin/xingtu/kol_video_performance_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 视频表现数据。

#### 何时使用 / 不使用
- ✅ 查看 KOL 视频表现统计
- ❌ 查看具体视频列表 → 用 `xingtu_kol_rec_videos_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |
| onlyAssign | boolean | yes | false=全部, true=仅星图分配作品 | 是否只显示分配作品 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 视频表现为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 必填参数缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_kol_xingtu_index_v1 — KOL 星图指数

**Full path:** `/api/v1/douyin/xingtu/kol_xingtu_index_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 星图指数（传播指数/互动指数/性价比指数等综合评分）。

#### 何时使用 / 不使用
- ✅ 查看 KOL 综合评分
- ❌ 查看具体数据 → 用 `xingtu_kol_data_overview_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 星图指数为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | kolId 缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_kol_convert_video_display_v1 — KOL 转化视频展示

**Full path:** `/api/v1/douyin/xingtu/kol_convert_video_display_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 转化视频展示数据，支持视频数据和商品数据两种类型。

#### 何时使用 / 不使用
- ✅ 查看 KOL 转化视频或商品数据
- ❌ 查看视频表现统计 → 用 `xingtu_kol_video_performance_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |
| detailType | string | yes | enum: _1=相关视频数据, _2=相关商品数据 | 详情类型 |
| page | integer | yes | — | 页码 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 转化视频为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 必填参数缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_kol_link_struct_v1 — KOL 连接用户

**Full path:** `/api/v1/douyin/xingtu/kol_link_struct_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 连接用户数据（粉丝与其他 KOL 的关联结构）。

#### 何时使用 / 不使用
- ✅ 查看 KOL 的用户关联结构
- ❌ 查看连接来源分布 → 用 `xingtu_kol_touch_distribution_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 连接用户为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | kolId 缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_kol_touch_distribution_v1 — KOL 连接用户来源

**Full path:** `/api/v1/douyin/xingtu/kol_touch_distribution_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 连接用户来源分布数据。

#### 何时使用 / 不使用
- ✅ 查看 KOL 粉丝来源渠道分布
- ❌ 查看关联结构 → 用 `xingtu_kol_link_struct_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 来源分布为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | kolId 缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_kol_cp_info_v1 — KOL 性价比分析

**Full path:** `/api/v1/douyin/xingtu/kol_cp_info_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 性价比能力分析数据。

#### 何时使用 / 不使用
- ✅ 评估 KOL 投放性价比
- ❌ 查看服务报价 → 用 `xingtu_kol_service_price_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 性价比为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | kolId 缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_kol_rec_videos_v1 — KOL 内容表现

**Full path:** `/api/v1/douyin/xingtu/kol_rec_videos_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 内容表现数据（推荐视频列表）。

#### 何时使用 / 不使用
- ✅ 查看 KOL 内容表现
- ❌ 查看视频表现统计 → 用 `xingtu_kol_video_performance_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 内容表现为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | kolId 缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_kol_daily_fans_v1 — KOL 粉丝趋势

**Full path:** `/api/v1/douyin/xingtu/kol_daily_fans_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 每日粉丝趋势数据。**注意：日期格式为 `yyyy-MM-dd`（如 `2024-12-01`），与其他端点不同。**

#### 何时使用 / 不使用
- ✅ 查看 KOL 粉丝增长趋势
- ❌ 查看粉丝画像 → 用 `xingtu_kol_fans_portrait_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |
| startDate | string | yes | 格式 `yyyy-MM-dd` | 开始日期 |
| endDate | string | yes | 格式 `yyyy-MM-dd` | 结束日期 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 粉丝趋势为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 必填参数缺失或日期格式错误 | 校正参数重试 | ≤1 次 | — |

---

### xingtu_author_hot_comment_tokens_v1 — KOL 评论热词

**Full path:** `/api/v1/douyin/xingtu/author_hot_comment_tokens_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 评论热词分析数据。

#### 何时使用 / 不使用
- ✅ 查看 KOL 评论中的热门词汇
- ❌ 查看内容热词 → 用 `xingtu_author_content_hot_comment_keywords_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 评论热词为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | kolId 缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_author_content_hot_comment_keywords_v1 — KOL 内容热词

**Full path:** `/api/v1/douyin/xingtu/author_content_hot_comment_keywords_v1`
**Method:** GET · **Risk:** low

#### 用途
获取 KOL 内容热词分析数据。

#### 何时使用 / 不使用
- ✅ 查看 KOL 内容中的热门关键词
- ❌ 查看评论热词 → 用 `xingtu_author_hot_comment_tokens_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kolId | string | yes | — | 星图 KOL ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 内容热词为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | kolId 缺失 | 补全参数重试 | ≤1 次 | — |
