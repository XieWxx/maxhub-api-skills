# Douyin Trending — App V3+Web 热搜+频道+城市/标签基础 / 抖音热榜 — App V3+Web 热搜+频道+城市/标签基础
> 本文件是 [trending/_index.md](./_index.md) 的子文件。完整端点路由、链式调用图谱、错误处理契约请参见 _index.md。

## 端点详情

---

### app_v3_fetch_hot_search_list — 获取抖音热搜榜数据

**Full path:** `/api/v1/douyin/app/v3/fetch_hot_search_list`
**Method:** GET · **Risk:** low

#### 用途
获取抖音热搜榜数据，支持多种子榜单（热点/种草/娱乐/社会/挑战）。**最常用的热搜入口**。

#### 何时使用 / 不使用
- ✅ 想查看抖音热搜榜
- ✅ 链式起点：取 keyword / aweme_id 用于搜索或视频详情
- ❌ 想看 Billboard 详细热点分析 → 用 Billboard 系列端点
- ❌ 想看直播热搜 → 用 `app_v3_fetch_live_hot_search_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| board_type | string | no | 枚举：0/2，默认 0 | 榜单类型：0 = 热点榜，2 = 其他榜单 |
| board_sub_type | string | no | 枚举字符串 | 榜单子类型：空 = 热点榜，`"seeding"` = 种草榜，`"2"` = 娱乐榜，`"4"` = 社会榜，`"hotspot_challenge"` = 挑战榜 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| word_list[].aweme_id | `$.data.word_list[].aweme_id` | 关联视频 ID | video.md 各端点 |
| word_list[].keyword | `$.data.word_list[].word` | 热搜关键词 | search.md 各搜索端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`web_fetch_hot_search_result` |

---

### app_v3_fetch_live_hot_search_list — 获取直播热搜榜数据

**Full path:** `/api/v1/douyin/app/v3/fetch_live_hot_search_list`
**Method:** GET · **Risk:** low

#### 用途
获取抖音直播热搜榜数据。无参数，直接返回直播热搜列表。

#### 何时使用 / 不使用
- ✅ 想查看直播热搜排行
- ❌ 想看综合热搜 → 用 `app_v3_fetch_hot_search_list`

#### 输入 (IN)
无参数

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 直播热搜列表 | `$.data` | 直播热搜数据 | live.md 各端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### app_v3_fetch_music_hot_search_list — 获取音乐榜数据

**Full path:** `/api/v1/douyin/app/v3/fetch_music_hot_search_list`
**Method:** GET · **Risk:** low

#### 用途
获取抖音音乐榜数据，支持热门/飙升/原创三种榜单。

#### 何时使用 / 不使用
- ✅ 想查看音乐排行榜
- ✅ 链式起点：取 music_id 用于音乐详情
- ❌ 想看综合热搜 → 用 `app_v3_fetch_hot_search_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| chart_type | string | no | 枚举：hot/trending/original，默认 hot | 榜单类型：hot = 热门榜，trending = 飙升榜，original = 原创榜 |
| cursor | string | no | 默认 "0" | 翻页游标 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| music_id | `$.data.music_list[].id` | 音乐 ID | video.md `app_v3_fetch_music_detail` / `app_v3_fetch_music_video_list` |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### app_v3_fetch_brand_hot_search_list — 获取品牌热榜分类

**Full path:** `/api/v1/douyin/app/v3/fetch_brand_hot_search_list`
**Method:** GET · **Risk:** low

#### 用途
获取品牌热榜分类列表。返回各品牌分类的 category_id，用于 `app_v3_fetch_brand_hot_search_list_detail`。

#### 何时使用 / 不使用
- ✅ 想查看品牌热榜有哪些分类
- ✅ 链式前置：取 category_id 用于品牌详情
- ❌ 想看具体品牌排行 → 先取分类，再用 `app_v3_fetch_brand_hot_search_list_detail`

#### 输入 (IN)
无参数

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| category_id | `$.data.category_list[].category_id` | 品牌分类 ID | app_v3_fetch_brand_hot_search_list_detail |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### app_v3_fetch_brand_hot_search_list_detail — 获取品牌热榜具体分类数据

**Full path:** `/api/v1/douyin/app/v3/fetch_brand_hot_search_list_detail`
**Method:** GET · **Risk:** low

#### 用途
获取品牌热榜具体分类下的品牌排行数据。需要 category_id，从 `app_v3_fetch_brand_hot_search_list` 获取。

#### 何时使用 / 不使用
- ✅ 已有 category_id，想查看该分类下的品牌排行
- ❌ 没有 category_id → 先用 `app_v3_fetch_brand_hot_search_list` 获取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| category_id | integer | yes | 正整数 | 分类 ID，如 `10` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 品牌排行数据 | `$.data` | 品牌排行详情 | 仅展示用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | category_id 无效 | 检查参数 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### web_fetch_hot_search_result — 获取 Web 版热榜数据

**Full path:** `/api/v1/douyin/web/fetch_hot_search_result`
**Method:** GET · **Risk:** low

#### 用途
获取 Web 版抖音热榜数据。无参数，直接返回热榜结果。

#### 何时使用 / 不使用
- ✅ App V3 热搜端点失败时的降级方案
- ❌ 首选 → 用 `app_v3_fetch_hot_search_list`（数据更丰富）

#### 输入 (IN)
无参数

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 热榜数据 | `$.data` | 热搜结果 | search.md 各端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`app_v3_fetch_hot_search_list` |

---

### web_fetch_video_channel_result — 获取视频频道数据

**Full path:** `/api/v1/douyin/web/fetch_video_channel_result`
**Method:** GET · **Risk:** low

#### 用途
获取抖音视频频道数据。需要 tag_id 指定频道类型。

#### 何时使用 / 不使用
- ✅ 想查看特定频道/垂类下的视频内容
- ✅ 链式起点：取 aweme_id 用于视频详情
- ❌ 想看热搜 → 用 `app_v3_fetch_hot_search_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| tag_id | integer | yes | 正整数 | 标签 ID，如 `300203` |
| count | integer | no | 默认 10 | 每页数量 |
| refresh_index | integer | no | 默认 1 | 刷新索引：0 = 首次，>0 = 翻页 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 视频 ID | video.md 各端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | tag_id 无效 | 检查参数 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_city_list — 获取城市列表

**Full path:** `/api/v1/douyin/billboard/fetch_city_list`
**Method:** GET · **Risk:** low

#### 用途
获取中国城市列表。**链式前置端点**——返回的 city_code 用于同城热点榜等端点。

#### 何时使用 / 不使用
- ✅ 需要城市编码用于同城热点榜
- ✅ 链式前置：取 city_code
- ❌ 直接查同城热点 → 可用空 city_code 查全部城市

#### 输入 (IN)
无参数

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| city_code | `$.data[].city_code` | 城市编码 | billboard_fetch_hot_city_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### billboard_fetch_content_tag — 获取垂类内容标签

**Full path:** `/api/v1/douyin/billboard/fetch_content_tag`
**Method:** GET · **Risk:** low

#### 用途
获取垂类内容标签。**链式前置端点**——返回的标签用于热门账号、视频榜等端点的 query_tag/tags/sentence_tag 参数。

#### 何时使用 / 不使用
- ✅ 需要垂类标签用于筛选热门账号或视频榜
- ✅ 链式前置：取 tag 信息
- ❌ 直接查热门账号 → 可用空 query_tag 查全部

#### 输入 (IN)
无参数

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| tag | `$.data[].tag` | 垂类标签 | billboard_fetch_hot_account_list (query_tag) / billboard_fetch_hot_total_video_list 等 (tags) / billboard_fetch_hot_rise_list 等 (sentence_tag) |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |
