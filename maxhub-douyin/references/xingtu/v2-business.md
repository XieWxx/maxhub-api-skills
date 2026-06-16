# Douyin Xingtu — 星图 V2 业务 / 抖音星图 — 星图 V2 业务
> 本文件是 [xingtu/_index.md](./_index.md) 的子文件。完整端点路由、链式调用图谱、错误处理契约请参见 _index.md。

## 端点详情

---

### xingtu_v2_get_author_base_info — 创作者基本信息

**Full path:** `/api/v1/douyin/xingtu_v2/get_author_base_info`
**Method:** GET · **Risk:** low

#### 用途
获取创作者基本信息（昵称、头像、粉丝数、sec_uid 等）。**V2 端点的链式核心**——o_author_id 从此处确认，sec_uid 可流出至 user.md。

#### 何时使用 / 不使用
- ✅ 已知 o_author_id，需要获取创作者基本信息
- ✅ 链式核心：基本信息 → 商业卡片/位置/视频/传播价值
- ❌ 不知 o_author_id → 先通过搜索或排行榜获取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| o_author_id | string | yes | — | 创作者 ID |
| platform_source | integer | no | default: 1 | 平台来源 |
| platform_channel | integer | no | default: 1 | 平台渠道 |
| recommend | boolean | no | default: true | 是否返回推荐信息 |
| need_sec_uid | boolean | no | default: true | 是否返回 sec_uid |
| need_linkage_info | boolean | no | default: true | 是否返回联动信息 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| o_author_id | `$.data.o_author_id` | 创作者 ID | xingtu_v2_get_author_* 系列端点 |
| sec_uid | `$.data.sec_uid` | 用户 sec_uid | user.md 全部 user 系端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | o_author_id 缺失 | 补全参数重试 | ≤1 次 | — |
| 404 | o_author_id 不存在 | STOP | 0 | — |

---

### xingtu_v2_get_author_business_card_info — 创作者商业卡片

**Full path:** `/api/v1/douyin/xingtu_v2/get_author_business_card_info`
**Method:** GET · **Risk:** low

#### 用途
获取创作者商业卡片信息。

#### 何时使用 / 不使用
- ✅ 查看创作者商业卡片
- ❌ 查看基本信息 → 用 `xingtu_v2_get_author_base_info`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| o_author_id | string | yes | — | 创作者 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 商业卡片为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | o_author_id 缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_v2_get_author_local_info — 创作者位置信息

**Full path:** `/api/v1/douyin/xingtu_v2/get_author_local_info`
**Method:** GET · **Risk:** low

#### 用途
获取创作者位置信息数据。

#### 何时使用 / 不使用
- ✅ 查看创作者地域分布
- ❌ 查看基本信息 → 用 `xingtu_v2_get_author_base_info`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| o_author_id | string | yes | — | 创作者 ID |
| platform_source | integer | no | default: 1 | 平台来源 |
| platform_channel | integer | no | default: 1 | 平台渠道 |
| time_range | integer | no | default: 30 | 时间范围（天） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 位置信息为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | o_author_id 缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_v2_get_author_show_items — 创作者视频列表

**Full path:** `/api/v1/douyin/xingtu_v2/get_author_show_items`
**Method:** GET · **Risk:** low

#### 用途
获取创作者视频列表数据。

#### 何时使用 / 不使用
- ✅ 查看创作者视频列表
- ❌ 查看视频表现统计 → 用 `xingtu_kol_video_performance_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| o_author_id | string | yes | — | 创作者 ID |
| platform_source | integer | no | default: 1 | 平台来源 |
| platform_channel | integer | no | default: 1 | 平台渠道 |
| limit | integer | no | default: 10 | 返回数量 |
| only_assign | boolean | no | default: false | 仅看指派视频 |
| flow_type | integer | no | default: 0 | 流量类型 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].aweme_id | `$.data.list[].aweme_id` | 视频 ID | video.md 全部 video 系端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | o_author_id 缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_v2_get_author_hot_comment_tokens — 创作者评论热词

**Full path:** `/api/v1/douyin/xingtu_v2/get_author_hot_comment_tokens`
**Method:** GET · **Risk:** low

#### 用途
获取创作者评论热词数据。**注意：参数名为 `author_id`（非 `o_author_id`），但实际值与 o_author_id 相同。**

#### 何时使用 / 不使用
- ✅ 查看 V2 创作者评论热词
- ❌ 查看 V1 KOL 评论热词 → 用 `xingtu_author_hot_comment_tokens_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| author_id | string | yes | 值与 o_author_id 相同 | 创作者 ID |
| num | integer | no | default: 10 | 返回热词数量 |
| without_emoji | boolean | no | default: true | 是否排除 emoji |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 评论热词为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | author_id 缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_v2_get_author_content_hot_keywords — 创作者内容热词

**Full path:** `/api/v1/douyin/xingtu_v2/get_author_content_hot_keywords`
**Method:** GET · **Risk:** low

#### 用途
获取创作者内容热词数据。**注意：参数名为 `author_id`（非 `o_author_id`），但实际值与 o_author_id 相同。**

#### 何时使用 / 不使用
- ✅ 查看 V2 创作者内容热词
- ❌ 查看 V1 KOL 内容热词 → 用 `xingtu_author_content_hot_comment_keywords_v1`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| author_id | string | yes | 值与 o_author_id 相同 | 创作者 ID |
| keyword_type | integer | no | default: 0 | 热词类型 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 内容热词为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | author_id 缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_v2_get_recommend_for_star_authors — 相似创作者推荐

**Full path:** `/api/v1/douyin/xingtu_v2/get_recommend_for_star_authors`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取与指定创作者相似的推荐创作者列表。参数通过 body 传递。

#### 何时使用 / 不使用
- ✅ 查找与某创作者相似的其他创作者
- ❌ 简单搜索 → 用 `xingtu_search_kol_v2`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| author_ids | array | yes | body 传递 | 创作者 ID 列表 |
| similar_type | string | yes | body 传递, enum: comprehension=综合, content=内容, audience=用户, commercial=商业 | 相似类型 |
| page | integer | no | body 传递, default: 1 | 页码 |
| limit | integer | no | body 传递, default: 12 | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].o_author_id | `$.data.list[].o_author_id` | 推荐创作者 ID | xingtu_v2_get_author_base_info |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 必填参数缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### xingtu_v2_get_excellent_case_category_list — 优秀行业分类列表

**Full path:** `/api/v1/douyin/xingtu_v2/get_excellent_case_category_list`
**Method:** GET · **Risk:** low

#### 用途
获取优秀行业分类列表。

#### 何时使用 / 不使用
- ✅ 浏览行业分类
- ❌ 搜索 MCN → 用 `xingtu_v2_get_demander_mcn_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| platform_source | integer | no | default: 1 | 平台来源 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 行业分类为参考数据 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### xingtu_v2_get_author_spread_info — 创作者传播价值

**Full path:** `/api/v1/douyin/xingtu_v2/get_author_spread_info`
**Method:** GET · **Risk:** low

#### 用途
获取创作者传播价值数据。

#### 何时使用 / 不使用
- ✅ 评估创作者传播价值
- ❌ 查看基本信息 → 用 `xingtu_v2_get_author_base_info`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| o_author_id | string | yes | — | 创作者 ID |
| platform_source | integer | no | default: 1 | 平台来源 |
| platform_channel | integer | no | default: 1 | 平台渠道 |
| type | integer | no | 1=个人视频, default: 1 | 视频类型 |
| flow_type | integer | no | default: 0 | 流量类型 |
| only_assign | boolean | no | default: false | 仅看指派视频 |
| range | integer | no | 2=近30天, 3=近90天, default: 2 | 时间范围 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 传播价值为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | o_author_id 缺失 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_v2_get_user_profile_qrcode — 用户主页二维码

**Full path:** `/api/v1/douyin/xingtu_v2/get_user_profile_qrcode`
**Method:** GET · **Risk:** low

#### 用途
获取用户主页二维码。**oneOf 逻辑**：`core_user_id` 与 `sec_uid` 二选一。

#### 何时使用 / 不使用
- ✅ 需要生成用户主页二维码
- ✅ 已知 core_user_id 或 sec_uid（二选一）
- ❌ 不知任何 ID → 先通过搜索或 ID 查找获取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| core_user_id | string | **oneOf** | 与 sec_uid 二选一 | 用户核心 ID |
| sec_uid | string | **oneOf** | 与 core_user_id 二选一 | 用户 sec_uid |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 二维码为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | core_user_id 和 sec_uid 都未提供 | 补全参数重试 | ≤1 次 | — |

---

### xingtu_v2_get_content_trend_guide — 内容趋势指南

**Full path:** `/api/v1/douyin/xingtu_v2/get_content_trend_guide`
**Method:** GET · **Risk:** low

#### 用途
获取内容趋势指南数据（CDN 静态 JSON，无需 Cookie）。

#### 何时使用 / 不使用
- ✅ 查看内容趋势指南
- ❌ 查看具体创作者 → 用搜索端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 无必填参数 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 趋势指南为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### xingtu_v2_get_ip_activity_industry_list — IP 日历行业列表

**Full path:** `/api/v1/douyin/xingtu_v2/get_ip_activity_industry_list`
**Method:** GET · **Risk:** low

#### 用途
获取星图 IP 日历行业列表。**IP 日历的前置步骤**——获取 industry_id 供 `get_ip_activity_list` 使用。

#### 何时使用 / 不使用
- ✅ 调用 `get_ip_activity_list` 前获取行业列表
- ❌ 已知行业 ID → 直接调用 `get_ip_activity_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | 无必填参数 | — |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].industry_id | `$.data.list[].industry_id` | 行业 ID | xingtu_v2_get_ip_activity_list 的 industry_id_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### xingtu_v2_get_ip_activity_list — IP 日历活动列表

**Full path:** `/api/v1/douyin/xingtu_v2/get_ip_activity_list`
**Method:** POST · **Risk:** **high** · **⚠️ 需用户确认**

#### 用途
获取星图 IP 日历活动列表。参数通过 body 传递。

#### 何时使用 / 不使用
- ✅ 查看 IP 日历活动列表
- ❌ 查看活动详情 → 用 `xingtu_v2_get_ip_activity_detail`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| query_start_time | string | yes | body 传递，时间戳 | 查询开始时间 |
| query_end_time | string | yes | body 传递，时间戳 | 查询结束时间 |
| industry_id_list | array | no | body 传递 | 行业 ID 列表 |
| category_list | array | no | body 传递, 1=星图大事件, 2=电商节点, 3=情绪节点, 4=创意营销, 5=行业活动 | IP 类型 |
| status_list | array | no | body 传递, 40=筹备中, 50=招商中, 30=资源上线, 20=已结束 | IP 状态 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].id | `$.data.list[].id` | 活动 ID | xingtu_v2_get_ip_activity_detail 的 id |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 必填参数缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### xingtu_v2_get_ip_activity_detail — IP 活动详情

**Full path:** `/api/v1/douyin/xingtu_v2/get_ip_activity_detail`
**Method:** GET · **Risk:** low

#### 用途
获取星图 IP 活动详情。

#### 何时使用 / 不使用
- ✅ 查看 IP 活动详情
- ✅ 已从 `get_ip_activity_list` 获取活动 ID
- ❌ 不知活动 ID → 先调用 `get_ip_activity_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| id | integer | yes | — | 活动 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 活动详情为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | id 缺失 | 补全参数重试 | ≤1 次 | — |
| 404 | id 不存在 | STOP | 0 | — |

---

### xingtu_v2_get_resource_list — 营销活动案例

**Full path:** `/api/v1/douyin/xingtu_v2/get_resource_list`
**Method:** GET · **Risk:** low

#### 用途
获取营销活动案例数据。

#### 何时使用 / 不使用
- ✅ 查看营销活动案例
- ❌ 查看 IP 活动 → 用 `xingtu_v2_get_ip_activity_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| resource_id | integer | yes | — | 资源 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 营销案例为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | resource_id 缺失 | 补全参数重试 | ≤1 次 | — |
| 404 | resource_id 不存在 | STOP | 0 | — |

---

### xingtu_v2_get_demander_mcn_list — 搜索 MCN 机构

**Full path:** `/api/v1/douyin/xingtu_v2/get_demander_mcn_list`
**Method:** GET · **Risk:** low

#### 用途
搜索 MCN 机构列表，支持模糊搜索和排序。

#### 何时使用 / 不使用
- ✅ 搜索 MCN 机构
- ❌ 搜索 KOL → 用 `xingtu_search_kol_v2`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| mcn_name | string | no | 支持模糊搜索 | MCN 机构名称 |
| page | integer | no | default: 1 | 页码 |
| limit | integer | no | default: 20 | 每页数量 |
| order_by | string | no | default: platform_scores | 排序方式 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | MCN 列表为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |
