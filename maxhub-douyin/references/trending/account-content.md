# Douyin Trending — 热门账号+视频/话题/搜索/热词榜 / 抖音热榜 — 热门账号+视频/话题/搜索/热词榜
> 本文件是 [trending/_index.md](./_index.md) 的子文件。完整端点路由、链式调用图谱、错误处理契约请参见 _index.md。

## 端点详情

---

### billboard_fetch_hot_account_list — 获取热门账号

**Full path:** `/api/v1/douyin/billboard/fetch_hot_account_list`
**Method:** POST · **Risk:** **high** · **需用户确认**

#### 用途
获取热门账号列表。POST 端点，参数通过 body 传递。**热门账号分析的链式起点**。

#### 何时使用 / 不使用
- ✅ 想查看热门账号排行
- ✅ 链式起点：取 sec_uid 用于粉丝画像/兴趣/趋势分析
- ❌ 想搜索特定用户 → 用 `billboard_fetch_hot_account_search_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| date_window | integer | no | 默认 24 | 时间窗口（小时） |
| page_num | integer | no | 默认 1 | 页码 |
| page_size | integer | no | 默认 20 | 每页数量 |
| query_tag | object | no | — | 子级垂类标签，空 = 全部（从 `billboard_fetch_content_tag` 获取） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].sec_uid | `$.data.list[].sec_uid` | 用户加密 ID | billboard_fetch_hot_account_trends_list / billboard_fetch_hot_account_item_analysis_list / billboard_fetch_hot_account_fans_portrait_list / billboard_fetch_hot_account_fans_interest_* / user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_account_search_list — 搜索用户名或抖音号

**Full path:** `/api/v1/douyin/billboard/fetch_hot_account_search_list`
**Method:** GET · **Risk:** low

#### 用途
在热门账号中搜索用户名或抖音号。

#### 何时使用 / 不使用
- ✅ 想搜索特定用户是否在热门账号中
- ✅ 链式起点：取 sec_uid 用于账号分析
- ❌ 想浏览热门账号列表 → 用 `billboard_fetch_hot_account_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索的用户名或抖音号 |
| cursor | integer | yes | 默认 0 | 游标 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].sec_uid | `$.data.list[].sec_uid` | 用户加密 ID | billboard_fetch_hot_account_* 系列端点 / user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | keyword 为空 | 检查参数 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_account_trends_list — 获取账号数据趋势

**Full path:** `/api/v1/douyin/billboard/fetch_hot_account_trends_list`
**Method:** GET · **Risk:** low

#### 用途
获取账号数据趋势（新增点赞/作品/评论/分享量随时间变化）。

#### 何时使用 / 不使用
- ✅ 已有 sec_uid，想分析账号数据趋势
- ❌ 想看作品数据趋势 → 用 `billboard_fetch_hot_item_trends_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_uid | string | yes | Base64 格式 | 用户 sec_id |
| option | integer | no | 枚举 2-5，默认 2 | 选项：2 = 新增点赞量，3 = 新增作品量，4 = 新增评论量，5 = 新增分享量 |
| date_window | integer | no | 默认 24 | 时间窗口：1 = 按小时，2 = 按天 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 趋势数据 | `$.data` | 账号数据趋势 | 仅展示用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | sec_uid 不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_account_item_analysis_list — 获取账号作品分析

**Full path:** `/api/v1/douyin/billboard/fetch_hot_account_item_analysis_list`
**Method:** GET · **Risk:** low

#### 用途
获取账号作品分析数据（默认 7 天）。

#### 何时使用 / 不使用
- ✅ 已有 sec_uid，想分析账号作品表现
- ❌ 想看数据趋势 → 用 `billboard_fetch_hot_account_trends_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_uid | string | yes | Base64 格式 | 用户 sec_id |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 作品分析数据 | `$.data` | 账号作品分析 | 仅展示用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | sec_uid 不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_account_fans_portrait_list — 获取粉丝画像

**Full path:** `/api/v1/douyin/billboard/fetch_hot_account_fans_portrait_list`
**Method:** GET · **Risk:** low

#### 用途
获取账号粉丝画像，支持 8 个维度分析。

#### 何时使用 / 不使用
- ✅ 已有 sec_uid，想分析粉丝画像
- ❌ 想看粉丝兴趣 → 用 `billboard_fetch_hot_account_fans_interest_*`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_uid | string | yes | Base64 格式 | 用户 sec_id |
| option | integer | no | 枚举 1-8，默认 1 | 选项：1 = 手机价格，2 = 性别，3 = 年龄，4 = 地域-省份，5 = 地域-城市，6 = 城市等级，7 = 手机品牌，8 = 兴趣标签分析 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 画像数据 | `$.data` | 粉丝画像 | 仅展示用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | sec_uid 不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_account_fans_interest_account_list — 获取粉丝兴趣作者

**Full path:** `/api/v1/douyin/billboard/fetch_hot_account_fans_interest_account_list`
**Method:** GET · **Risk:** low

#### 用途
获取粉丝兴趣作者列表（20 个用户）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_uid | string | yes | Base64 格式 | 用户 sec_id |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 兴趣作者列表 | `$.data` | 粉丝兴趣作者（20 个） | user.md 各端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | sec_uid 不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_account_fans_interest_topic_list — 获取粉丝近 3 天感兴趣话题

**Full path:** `/api/v1/douyin/billboard/fetch_hot_account_fans_interest_topic_list`
**Method:** GET · **Risk:** low

#### 用途
获取粉丝近 3 天感兴趣的话题（10 个话题）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_uid | string | yes | Base64 格式 | 用户 sec_id |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 兴趣话题列表 | `$.data` | 粉丝兴趣话题（10 个） | search.md 各端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | sec_uid 不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_account_fans_interest_search_list — 获取粉丝近 3 天搜索词

**Full path:** `/api/v1/douyin/billboard/fetch_hot_account_fans_interest_search_list`
**Method:** GET · **Risk:** low

#### 用途
获取粉丝近 3 天的搜索词（10 个搜索词）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_uid | string | yes | Base64 格式 | 用户 sec_id |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 搜索词列表 | `$.data` | 粉丝搜索词（10 个） | search.md 各端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | sec_uid 不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_total_video_list — 获取视频热榜

**Full path:** `/api/v1/douyin/billboard/fetch_hot_total_video_list`
**Method:** POST · **Risk:** **high** · **需用户确认**

#### 用途
获取视频热榜。**首选视频榜端点**——支持通过 sub_type 切换 5 种子榜（视频总榜/低粉爆款/高完播率/高涨粉率/高点赞率），无需分别调用 5 个独立端点。

#### 何时使用 / 不使用
- ✅ 想查看视频热榜（含各子榜）
- ✅ 链式起点：取 aweme_id 用于视频详情/作品分析
- ❌ 只需低粉爆款 → 可用 `billboard_fetch_hot_total_low_fan_list` 或本端点 `sub_type=1002`
- ❌ 想看话题榜 → 用 `billboard_fetch_hot_total_topic_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| page | integer | no | 默认 1 | 页码 |
| page_size | integer | no | 默认 10 | 每页数量 |
| date_window | integer | no | 枚举 1-2 | 时间窗口：1 = 按小时，2 = 按天 |
| sub_type | integer | no | 枚举，默认 1001 | 榜单分类：1001 = 视频总榜，1002 = 低粉爆款，1003 = 高完播率，1004 = 高涨粉率，1005 = 高点赞率 |
| keyword | string | no | — | 搜索关键词，空 = 全部 |
| tags | object | no | — | 子级垂类标签，空 = 全部 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].aweme_id | `$.data.list[].aweme_id` | 视频 ID | video.md 各端点 / billboard_fetch_hot_user_portrait_list 等 |
| list[].sec_uid | `$.data.list[].sec_uid` | 作者 ID | user.md 各端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_total_low_fan_list — 获取低粉爆款榜

**Full path:** `/api/v1/douyin/billboard/fetch_hot_total_low_fan_list`
**Method:** POST · **Risk:** **high** · **需用户确认**

#### 用途
获取低粉爆款榜。独立端点，也可通过 `billboard_fetch_hot_total_video_list` 的 `sub_type=1002` 获取。

#### 何时使用 / 不使用
- ✅ 专门查低粉爆款榜
- ❌ 首选 → 用 `billboard_fetch_hot_total_video_list`（统一入口）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| page | integer | no | 默认 1 | 页码 |
| page_size | integer | no | 默认 10 | 每页数量 |
| date_window | integer | no | 枚举 1-2 | 时间窗口 |
| keyword | string | no | — | 搜索关键词 |
| tags | object | no | — | 子级垂类标签 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].aweme_id | `$.data.list[].aweme_id` | 视频 ID | video.md 各端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`billboard_fetch_hot_total_video_list` (sub_type=1002) |

---

### billboard_fetch_hot_total_high_play_list — 获取高完播率榜

**Full path:** `/api/v1/douyin/billboard/fetch_hot_total_high_play_list`
**Method:** POST · **Risk:** **high** · **需用户确认**

#### 用途
获取高完播率榜。独立端点，也可通过 `billboard_fetch_hot_total_video_list` 的 `sub_type=1003` 获取。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| page | integer | no | 默认 1 | 页码 |
| page_size | integer | no | 默认 10 | 每页数量 |
| date_window | integer | no | — | 时间窗口 |
| keyword | string | no | — | 搜索关键词 |
| tags | object | no | — | 子级垂类标签 |

#### 输出可链式字段 (OUT)
同 `billboard_fetch_hot_total_low_fan_list`

#### 错误处理 (ERR)
同 `billboard_fetch_hot_total_low_fan_list`，替换：`billboard_fetch_hot_total_video_list` (sub_type=1003)

---

### billboard_fetch_hot_total_high_like_list — 获取高点赞率榜

**Full path:** `/api/v1/douyin/billboard/fetch_hot_total_high_like_list`
**Method:** POST · **Risk:** **high** · **需用户确认**

#### 用途
获取高点赞率榜。独立端点，也可通过 `billboard_fetch_hot_total_video_list` 的 `sub_type=1005` 获取。

#### 输入 (IN)
同 `billboard_fetch_hot_total_high_play_list`

#### 输出可链式字段 (OUT)
同 `billboard_fetch_hot_total_low_fan_list`

#### 错误处理 (ERR)
同 `billboard_fetch_hot_total_low_fan_list`，替换：`billboard_fetch_hot_total_video_list` (sub_type=1005)

---

### billboard_fetch_hot_total_high_fan_list — 获取高涨粉率榜

**Full path:** `/api/v1/douyin/billboard/fetch_hot_total_high_fan_list`
**Method:** POST · **Risk:** **high** · **需用户确认**

#### 用途
获取高涨粉率榜。独立端点，也可通过 `billboard_fetch_hot_total_video_list` 的 `sub_type=1004` 获取。

#### 输入 (IN)
同 `billboard_fetch_hot_total_high_play_list`

#### 输出可链式字段 (OUT)
同 `billboard_fetch_hot_total_low_fan_list`

#### 错误处理 (ERR)
同 `billboard_fetch_hot_total_low_fan_list`，替换：`billboard_fetch_hot_total_video_list` (sub_type=1004)

---

### billboard_fetch_hot_total_topic_list — 获取话题热榜

**Full path:** `/api/v1/douyin/billboard/fetch_hot_total_topic_list`
**Method:** POST · **Risk:** **high** · **需用户确认**

#### 用途
获取话题热榜。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| page | integer | no | 默认 1 | 页码 |
| page_size | integer | no | 默认 10 | 每页数量 |
| date_window | integer | no | — | 时间窗口 |
| keyword | string | no | — | 搜索关键词 |
| tags | object | no | — | 子级垂类标签 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 话题列表 | `$.data.list` | 话题热榜数据 | video.md `app_v3_fetch_hashtag_detail` 等 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_total_high_topic_list — 获取热度飙升话题榜

**Full path:** `/api/v1/douyin/billboard/fetch_hot_total_high_topic_list`
**Method:** POST · **Risk:** **high** · **需用户确认**

#### 用途
获取热度飙升的话题榜。

#### 输入 (IN)
同 `billboard_fetch_hot_total_topic_list`

#### 输出可链式字段 (OUT)
同 `billboard_fetch_hot_total_topic_list`

#### 错误处理 (ERR)
同 `billboard_fetch_hot_total_topic_list`

---

### billboard_fetch_hot_total_search_list — 获取搜索热榜

**Full path:** `/api/v1/douyin/billboard/fetch_hot_total_search_list`
**Method:** POST · **Risk:** **high** · **需用户确认**

#### 用途
获取搜索热榜。注意使用 `page_num`（非 `page`）分页。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| page_num | integer | no | 默认 1 | 页码 |
| page_size | integer | no | 默认 10 | 每页数量 |
| date_window | integer | no | 枚举 1-2 | 时间窗口：1 = 按小时，2 = 按天 |
| keyword | string | no | — | 搜索关键字 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 搜索热榜列表 | `$.data.list` | 搜索热榜数据 | search.md 各端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_total_high_search_list — 获取热度飙升搜索榜

**Full path:** `/api/v1/douyin/billboard/fetch_hot_total_high_search_list`
**Method:** POST · **Risk:** **high** · **需用户确认**

#### 用途
获取热度飙升的搜索榜。注意使用 `page_num` 分页。

#### 输入 (IN)
同 `billboard_fetch_hot_total_search_list`

#### 输出可链式字段 (OUT)
同 `billboard_fetch_hot_total_search_list`

#### 错误处理 (ERR)
同 `billboard_fetch_hot_total_search_list`

---

### billboard_fetch_hot_total_hot_word_list — 获取全部热门内容词

**Full path:** `/api/v1/douyin/billboard/fetch_hot_total_hot_word_list`
**Method:** POST · **Risk:** **high** · **需用户确认**

#### 用途
获取全部热门内容词。**热词详情的链式前置端点**——返回的 word_id + keyword 用于 `billboard_fetch_hot_total_hot_word_detail_list`。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| page_num | integer | no | 默认 1 | 页码 |
| page_size | integer | no | 默认 10 | 每页数量 |
| date_window | integer | no | — | 时间窗口 |
| keyword | string | no | — | 搜索关键字 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].word_id | `$.data.list[].word_id` | 内容词 ID | billboard_fetch_hot_total_hot_word_detail_list |
| list[].keyword | `$.data.list[].keyword` | 关键词 | billboard_fetch_hot_total_hot_word_detail_list / search.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_hot_total_hot_word_detail_list — 获取内容词详情

**Full path:** `/api/v1/douyin/billboard/fetch_hot_total_hot_word_detail_list`
**Method:** GET · **Risk:** low

#### 用途
获取内容词详情。需要 keyword + word_id + query_day 三个必填参数。

#### 何时使用 / 不使用
- ✅ 已有 word_id 和 keyword，想查看内容词详情
- ❌ 没有 word_id → 先用 `billboard_fetch_hot_total_hot_word_list` 获取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键字 |
| word_id | string | yes | — | 内容词 ID |
| query_day | integer | yes | YYYYMMDD 格式 | 查询日期，需为当日，如 `20250105` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 内容词详情 | `$.data` | 内容词详情数据 | 仅展示用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或 query_day 非当日 | 检查参数 | ≤1 次 | — |
| 404 | word_id 不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |
