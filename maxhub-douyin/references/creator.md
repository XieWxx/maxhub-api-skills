# Douyin Creator / 抖音创作者

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖

创作者活动列表/详情、素材中心（配置/榜单/相关视频）、热点/话题/道具/音乐/挑战榜单、热门课程、内容创作分类/课程、商单任务列表、行业分类配置、弹幕管理列表。Creator V2 端点：作品总览/流量来源/搜索关键词/观看趋势/弹幕分析/观众画像/观众其他数据/垂类标签/投稿分析概览/投稿表现/投稿作品列表/导出/直播场次历史/账号诊断。**Creator V2 端点全部需要 cookie 参数且为 POST + risk:high**。

> 🔒 **安全**：所有请求将 `MAXHUB_API_KEY` 和查询数据传输至 `https://www.aconfig.cn`。禁止在日志、提示词或客户端存储中暴露 API Key。含 `cookie` 参数的端点仅在用户明确授权后使用。

---

## 端点索引 (Endpoint Index)

### Creator V1 端点（GET，risk:low）

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| creator_fetch_creator_activity_list | ⭐⭐ 条件 | 获取创作者活动列表 | GET | /api/v1/douyin/creator/fetch_creator_activity_list | low |
| creator_fetch_creator_activity_detail | ⭐⭐ 条件 | 获取创作者活动详情 | GET | /api/v1/douyin/creator/fetch_creator_activity_detail | low |
| creator_fetch_creator_material_center_config | ⭐ 条件 | 获取创作者中心配置 | GET | /api/v1/douyin/creator/fetch_creator_material_center_config | low |
| creator_fetch_creator_material_center_billboard | ⭐⭐ 条件 | 获取热门视频榜单 | GET | /api/v1/douyin/creator/fetch_creator_material_center_billboard | low |
| creator_fetch_creator_material_center_related | ⭐⭐ 条件 | 获取话题/热点相关视频 | GET | /api/v1/douyin/creator/fetch_creator_material_center_related | low |
| creator_fetch_creator_hot_spot_billboard | ⭐⭐ 条件 | 获取创作热点榜单 | GET | /api/v1/douyin/creator/fetch_creator_hot_spot_billboard | low |
| creator_fetch_creator_hot_topic_billboard | ⭐⭐ 条件 | 获取热门话题榜单 | GET | /api/v1/douyin/creator/fetch_creator_hot_topic_billboard | low |
| creator_fetch_creator_hot_props_billboard | ⭐ 条件 | 获取热门道具榜单 | GET | /api/v1/douyin/creator/fetch_creator_hot_props_billboard | low |
| creator_fetch_creator_hot_challenge_billboard | ⭐ 条件 | 获取热门挑战榜单 | GET | /api/v1/douyin/creator/fetch_creator_hot_challenge_billboard | low |
| creator_fetch_creator_hot_music_billboard | ⭐⭐ 条件 | 获取热门音乐榜单 | GET | /api/v1/douyin/creator/fetch_creator_hot_music_billboard | low |
| creator_fetch_creator_hot_course | ⭐⭐ 条件 | 获取热门课程 | GET | /api/v1/douyin/creator/fetch_creator_hot_course | low |
| creator_fetch_creator_content_category | ⭐ 条件 | 获取内容创作分类 | GET | /api/v1/douyin/creator/fetch_creator_content_category | low |
| creator_fetch_creator_content_course | ⭐⭐ 条件 | 获取内容创作课程 | GET | /api/v1/douyin/creator/fetch_creator_content_course | low |
| creator_fetch_video_danmaku_list | ⭐⭐ 条件 | 获取弹幕管理列表 | GET | /api/v1/douyin/creator/fetch_video_danmaku_list | low |
| creator_fetch_mission_task_list | ⭐⭐ 条件 | 获取商单任务列表 | GET | /api/v1/douyin/creator/fetch_mission_task_list | low |
| creator_fetch_industry_category_config | ⭐ 条件 | 获取行业分类配置 | GET | /api/v1/douyin/creator/fetch_industry_category_config | low |

### Creator V2 端点（POST + cookie，risk:high）

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| creator_v2_fetch_item_overview_data | ⭐⭐⭐ 首选 | 获取作品总览数据（**链式起点**） | POST | /api/v1/douyin/creator_v2/fetch_item_overview_data | **high** |
| creator_v2_fetch_item_play_source | ⭐⭐ 条件 | 获取作品流量来源 | POST | /api/v1/douyin/creator_v2/fetch_item_play_source | **high** |
| creator_v2_fetch_item_search_keyword | ⭐⭐ 条件 | 获取作品搜索关键词 | POST | /api/v1/douyin/creator_v2/fetch_item_search_keyword | **high** |
| creator_v2_fetch_item_watch_trend | ⭐⭐ 条件 | 获取作品观看趋势 | POST | /api/v1/douyin/creator_v2/fetch_item_watch_trend | **high** |
| creator_v2_fetch_item_danmaku_analysis | ⭐⭐ 条件 | 获取作品弹幕分析 | POST | /api/v1/douyin/creator_v2/fetch_item_danmaku_analysis | **high** |
| creator_v2_fetch_item_audience_portrait | ⭐⭐ 条件 | 获取作品观众画像 | POST | /api/v1/douyin/creator_v2/fetch_item_audience_portrait | **high** |
| creator_v2_fetch_item_audience_others | ⭐⭐ 条件 | 获取观众其他数据 | POST | /api/v1/douyin/creator_v2/fetch_item_audience_others | **high** |
| creator_v2_fetch_item_analysis_involved_vertical | ⭐⭐ 条件 | 获取垂类标签 | POST | /api/v1/douyin/creator_v2/fetch_item_analysis_involved_vertical | **high** |
| creator_v2_fetch_item_analysis_overview | ⭐⭐ 条件 | 获取投稿分析概览 | POST | /api/v1/douyin/creator_v2/fetch_item_analysis_overview | **high** |
| creator_v2_fetch_item_analysis_item_performance | ⭐⭐ 条件 | 获取投稿表现数据 | POST | /api/v1/douyin/creator_v2/fetch_item_analysis_item_performance | **high** |
| creator_v2_fetch_item_list | ⭐⭐⭐ 首选 | 获取投稿作品列表 | POST | /api/v1/douyin/creator_v2/fetch_item_list | **high** |
| creator_v2_fetch_item_list_download | ⭐ 条件 | 导出投稿作品列表 | POST | /api/v1/douyin/creator_v2/fetch_item_list_download | **high** |
| creator_v2_fetch_live_room_history_list | ⭐⭐ 条件 | 获取直播场次历史 | POST | /api/v1/douyin/creator_v2/fetch_live_room_history_list | **high** |
| creator_v2_fetch_author_diagnosis | ⭐⭐ 条件 | 获取账号诊断 | POST | /api/v1/douyin/creator_v2/fetch_author_diagnosis | **high** |

---

## 链式调用图谱 (Chain Recipes)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看作品总览 + 流量来源 | creator_v2_fetch_item_overview_data → creator_v2_fetch_item_play_source | item_id 复用 | 第 1 步失败：STOP |
| 看作品总览 + 搜索关键词 | creator_v2_fetch_item_overview_data → creator_v2_fetch_item_search_keyword | item_id 复用 | 第 2 步失败：返回总览 + "搜索关键词暂不可取" |
| 看作品总览 + 观众画像 | creator_v2_fetch_item_overview_data → creator_v2_fetch_item_audience_portrait | item_id 复用 | 第 2 步失败：返回总览 + "观众画像暂不可取" |
| 投稿列表 → 作品详情 | creator_v2_fetch_item_list → creator_v2_fetch_item_overview_data | `$.data.items[].item_id` → `ids` | 第 1 步失败：STOP |
| 垂类标签 → 投稿分析 | creator_v2_fetch_item_analysis_involved_vertical → creator_v2_fetch_item_analysis_overview | `$.data.primary_verticals[]` → `primary_verticals` | 第 1 步失败：STOP |
| 热点榜单 → 相关视频 | creator_fetch_creator_hot_spot_billboard → creator_fetch_creator_material_center_related | `$.data[].query_id` → `query_id` | 第 2 步失败：返回榜单 + "相关视频暂不可取" |
| 投稿列表 → 视频详情 | creator_v2_fetch_item_list → video.md | `$.data.items[].item_id` → `aweme_id` | 跨文件链路 |

---

## 跨 reference 链路 (In-Chain)

- **流入本文件**：`video.md` 的视频端点输出 `aweme_id` → 本文件 Creator V2 端点的 `item_id` / `ids`
- **流入本文件**：`user.md` 的用户端点输出 `sec_user_id` → 本文件部分端点
- **流出本文件**：`$.data.items[].item_id` → `video.md` 的视频详情端点
- **流出本文件**：`creator_fetch_creator_hot_spot_billboard` 的 `$.data[].query_id` → 本文件 `creator_fetch_creator_material_center_related`

---

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项；通用规则见此处。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
  - 注意 Creator V1 路径为 `/api/v1/douyin/creator/`，V2 为 `/api/v1/douyin/creator_v2/`
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
  - Creator V1 端点参数通过 **query** 传递
  - Creator V2 端点参数通过 **body** 传递
  - Creator V2 端点 `cookie` 为必填参数

### cookie 参数特化规则
- Creator V2 全部端点需要 `cookie` 参数（用户的抖音创作者平台 Cookie）
- **必须在用户明确授权后才可传递**
- 禁止 Agent 自行构造或缓存 cookie
- cookie 获取方式：调用 `tools.md` 的 `web_generate_ttwid` 或 `web_fetch_douyin_web_guest_cookie`

### Creator V2 日期参数特化规则
- `start_date` / `end_date` 格式为 `YYYYMMDD`（如 `20260412`）
- `start_time` / `end_time` 为毫秒时间戳（如 `1758988800000`）
- 日期范围最多 90 天

---

## 端点详情

---

### creator_fetch_creator_activity_list — 获取创作者活动列表

**Full path:** `/api/v1/douyin/creator/fetch_creator_activity_list`
**Method:** GET · **Risk:** low

#### 用途
获取创作者活动列表，按时间范围筛选。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| start_time | integer | yes | — | 开始时间戳（秒） |
| end_time | integer | yes | — | 结束时间戳（秒） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| activities[].activity_id | `$.data.activities[].activity_id` | 活动 ID | creator_fetch_creator_activity_detail |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 时间参数缺失 | 补全参数重试 | ≤1 次 | — |

---

### creator_fetch_creator_activity_detail — 获取创作者活动详情

**Full path:** `/api/v1/douyin/creator/fetch_creator_activity_detail`
**Method:** GET · **Risk:** low

#### 用途
获取指定活动的详情。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| activity_id | string | yes | — | 活动 ID |

#### 输出可链式字段 (OUT)
终端数据，无下游链式调用。

---

### creator_fetch_creator_material_center_billboard — 获取热门视频榜单

**Full path:** `/api/v1/douyin/creator/fetch_creator_material_center_billboard`
**Method:** GET · **Risk:** low

#### 用途
获取创作者中心热门视频榜单，支持分类/排序/时间筛选。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| billboard_tag | integer | no | default: 0=全部, 333=美食, 334=旅行, 302=游戏, 336=科技, 337=娱乐等 | 榜单标签（26 个分类） |
| order_key | integer | no | enum: 1=播放最高, 2=点赞最多, 3=评论最多, 4=热度最高, default: 1 | 排序键 |
| time_filter | integer | no | enum: 1=24小时, 2=7天, 3=30天, default: 1 | 时间筛选 |

#### 输出可链式字段 (OUT)
终端数据，无下游链式调用。

---

### creator_fetch_creator_material_center_related — 获取话题/热点相关视频

**Full path:** `/api/v1/douyin/creator/fetch_creator_material_center_related`
**Method:** GET · **Risk:** low

#### 用途
获取指定话题/热点/道具/音乐的相关视频。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| query_id | string | yes | — | 查询 ID（从榜单获取） |
| billboard_type | integer | no | enum: 2=热点, 3=话题, 4=道具, 5=音乐, default: 2 | 榜单类型 |
| limit | integer | no | default: 20 | 每页数量 |
| offset | integer | no | default: 0 | 偏移量 |

#### 输出可链式字段 (OUT)
终端数据，无下游链式调用。

---

### creator_fetch_creator_hot_spot_billboard — 获取创作热点榜单

**Full path:** `/api/v1/douyin/creator/fetch_creator_hot_spot_billboard`
**Method:** GET · **Risk:** low

#### 用途
获取创作者中心创作热点榜单，支持热搜类型和城市筛选。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| billboard_tag | string | no | default: "0" | 热点标签，多个逗号分隔 |
| hot_search_type | integer | no | enum: 1=热点总榜, 2=同城热点榜, 3=热点上升榜, default: 1 | 热搜类型 |
| city_code | string | no | hot_search_type=2 时必需 | 城市代码 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data[].query_id | `$.data[].query_id` | 热点查询 ID | creator_fetch_creator_material_center_related |

---

### creator_fetch_creator_hot_topic_billboard — 获取热门话题榜单

**Full path:** `/api/v1/douyin/creator/fetch_creator_hot_topic_billboard`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| billboard_tag | integer | no | default: 0=全部 | 榜单标签 |
| order_key | integer | no | enum: 1=播放最高, 2=点赞最多, 3=评论最多, 4=投稿最多, default: 1 | 排序键 |
| time_filter | integer | no | enum: 1=24小时, 2=7天, 3=30天, default: 1 | 时间筛选 |

---

### creator_fetch_creator_hot_props_billboard — 获取热门道具榜单

**Full path:** `/api/v1/douyin/creator/fetch_creator_hot_props_billboard`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| billboard_tag | integer | no | default: 0=全部 | 榜单标签 |
| order_key | integer | no | enum: 1=播放最高, 5=投稿最多, 6=展现最高, 7=收藏最高, default: 1 | 排序键 |
| time_filter | integer | no | enum: 1=24小时, 2=7天, 3=30天, default: 1 | 时间筛选 |

---

### creator_fetch_creator_hot_challenge_billboard — 获取热门挑战榜单

**Full path:** `/api/v1/douyin/creator/fetch_creator_hot_challenge_billboard`
**Method:** GET · **Risk:** low

#### 用途
获取热门挑战榜单，无需参数。

---

### creator_fetch_creator_hot_music_billboard — 获取热门音乐榜单

**Full path:** `/api/v1/douyin/creator/fetch_creator_hot_music_billboard`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| billboard_tag | integer | no | default: 0 | 榜单标签 |
| order_key | integer | no | enum: 1=播放最高, 2=点赞最多, 4=热度最高, 5=投稿最多, default: 1 | 排序键 |
| time_filter | integer | no | enum: 1=24小时, 2=7天, 3=30天, default: 1 | 时间筛选 |

---

### creator_fetch_creator_hot_course — 获取热门课程

**Full path:** `/api/v1/douyin/creator/fetch_creator_hot_course`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| order | integer | no | enum: 1=推荐排序, 2=最受欢迎, 3=最新上传, default: 1 | 排序方式 |
| limit | integer | no | default: 24 | 每页数量 |
| offset | integer | no | default: 0 | 偏移量 |
| category_id | string | no | 精选专题分类 ID | 不传则为热门课程 |

---

### creator_fetch_creator_content_category — 获取内容创作分类

**Full path:** `/api/v1/douyin/creator/fetch_creator_content_category`
**Method:** GET · **Risk:** low

#### 用途
获取内容创作合集分类数据，无需参数。产出 `category_id` 供 `creator_fetch_creator_content_course` 使用。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| categories[].category_id | `$.data.categories[].category_id` | 分类 ID | creator_fetch_creator_content_course |

---

### creator_fetch_creator_content_course — 获取内容创作课程

**Full path:** `/api/v1/douyin/creator/fetch_creator_content_course`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| category_id | integer | yes | — | 分类 ID（从 `creator_fetch_creator_content_category` 获取） |
| order | integer | no | enum: 1=推荐, 2=最受欢迎, 3=最新上传, default: 1 | 排序方式 |
| limit | integer | no | default: 24 | 每页数量 |
| offset | integer | no | default: 0 | 偏移量 |

---

### creator_fetch_video_danmaku_list — 获取弹幕管理列表

**Full path:** `/api/v1/douyin/creator/fetch_video_danmaku_list`
**Method:** GET · **Risk:** low

> 详见 `comments.md` 中的同名端点描述。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| item_id | string | yes | — | 视频/作品 ID |
| count | integer | no | default: 20, range: 1-100 | 每页数量 |
| offset | integer | no | default: 0 | 偏移量 |
| order_type | integer | no | enum: 1=时间排序, 2=其他排序, default: 1 | 排序类型 |
| is_blocked | boolean | no | default: false | 是否获取被屏蔽弹幕 |

---

### creator_fetch_mission_task_list — 获取商单任务列表

**Full path:** `/api/v1/douyin/creator/fetch_mission_task_list`
**Method:** GET · **Risk:** low

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cursor | integer | no | default: 0 | 游标 |
| limit | integer | no | default: 24 | 每页数量 |
| mission_type | integer | no | default: 1 | 任务类型 |
| tab_scene | integer | no | enum: 1=可投稿, 2=可报名, 3=好物测评, default: 1 | 场景类型 |
| industry_lv1 | integer | no | default: -1=全部 | 一级行业 |
| industry_lv2 | integer | no | default: -1=全部 | 二级行业 |
| platform_channel | string | no | enum: "1"=抖音视频, "2"=抖音直播, "3"=抖音图文 | 平台渠道 |
| keyword | string | no | — | 关键词（任务名称或 ID） |

---

### creator_fetch_industry_category_config — 获取行业分类配置

**Full path:** `/api/v1/douyin/creator/fetch_industry_category_config`
**Method:** GET · **Risk:** low

#### 用途
获取完整的行业分类树结构（32 个一级行业 + 二级行业），无需参数。产出 `industry_lv1` / `industry_lv2` 供 `creator_fetch_mission_task_list` 使用。

---

### creator_v2_fetch_item_overview_data — 获取作品总览数据

**Full path:** `/api/v1/douyin/creator_v2/fetch_item_overview_data`
**Method:** POST · **Risk:** **high**

#### 用途
获取指定作品的流量指标、审核状态、播放信息等总览数据。**Creator V2 链式起点**。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cookie | string | yes | — | 抖音创作者平台 Cookie（**需用户授权**） |
| ids | string | yes | — | 作品 ID 列表，逗号分隔 |
| fields | string | no | default: "metrics,review,play_info,dou_plus,integrated_incentive,incentive_life,content_analysis" | 返回字段 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data[].item_id | `$.data[].item_id` | 作品 ID | 本文件多个 Creator V2 端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 401 | cookie 无效/过期 | STOP，提示用户更新 cookie | 0 | — |
| 400 | ids 缺失 | 补全参数重试 | ≤1 次 | — |

---

### creator_v2_fetch_item_play_source — 获取作品流量来源

**Full path:** `/api/v1/douyin/creator_v2/fetch_item_play_source`
**Method:** POST · **Risk:** **high**

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cookie | string | yes | — | 抖音创作者平台 Cookie |
| item_id | string | yes | — | 作品 ID |

#### 输出可链式字段 (OUT)
终端数据（推荐页/朋友页/搜索/个人主页/消息页/其他流量来源占比）。

---

### creator_v2_fetch_item_search_keyword — 获取作品搜索关键词

**Full path:** `/api/v1/douyin/creator_v2/fetch_item_search_keyword`
**Method:** POST · **Risk:** **high**

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cookie | string | yes | — | 抖音创作者平台 Cookie |
| item_id | string | yes | — | 作品 ID |

#### 输出可链式字段 (OUT)
终端数据（关键词、搜索次数、占比）。

---

### creator_v2_fetch_item_watch_trend — 获取作品观看趋势

**Full path:** `/api/v1/douyin/creator_v2/fetch_item_watch_trend`
**Method:** POST · **Risk:** **high**

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cookie | string | yes | — | 抖音创作者平台 Cookie |
| item_id | string | yes | — | 作品 ID |
| analysis_type | integer | no | enum: 1=留存分析, 2=点赞分析, 7=跳出分析, default: 1 | 分析类型 |

---

### creator_v2_fetch_item_danmaku_analysis — 获取作品弹幕分析

**Full path:** `/api/v1/douyin/creator_v2/fetch_item_danmaku_analysis`
**Method:** POST · **Risk:** **high**

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cookie | string | yes | — | 抖音创作者平台 Cookie |
| item_id | string | yes | — | 作品 ID |

---

### creator_v2_fetch_item_audience_portrait — 获取作品观众画像

**Full path:** `/api/v1/douyin/creator_v2/fetch_item_audience_portrait`
**Method:** POST · **Risk:** **high**

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cookie | string | yes | — | 抖音创作者平台 Cookie |
| item_id | string | yes | — | 作品 ID |

---

### creator_v2_fetch_item_audience_others — 获取观众其他数据

**Full path:** `/api/v1/douyin/creator_v2/fetch_item_audience_others`
**Method:** POST · **Risk:** **high**

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cookie | string | yes | — | 抖音创作者平台 Cookie |
| item_id | string | yes | — | 作品 ID |

---

### creator_v2_fetch_item_analysis_involved_vertical — 获取垂类标签

**Full path:** `/api/v1/douyin/creator_v2/fetch_item_analysis_involved_vertical`
**Method:** POST · **Risk:** **high**

#### 用途
获取垂类标签列表，**必须先调用**才能为 `creator_v2_fetch_item_analysis_overview` 提供 `primary_verticals` 参数。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cookie | string | yes | — | 抖音创作者平台 Cookie |
| start_date | string | yes | format: YYYYMMDD | 开始日期 |
| end_date | string | yes | format: YYYYMMDD，日期范围最多 90 天 | 结束日期 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| primary_verticals[] | `$.data.primary_verticals[]` | 垂类标签列表 | creator_v2_fetch_item_analysis_overview |

---

### creator_v2_fetch_item_analysis_overview — 获取投稿分析概览

**Full path:** `/api/v1/douyin/creator_v2/fetch_item_analysis_overview`
**Method:** POST · **Risk:** **high**

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cookie | string | yes | — | 抖音创作者平台 Cookie |
| start_date | string | yes | format: YYYYMMDD | 开始日期 |
| end_date | string | yes | format: YYYYMMDD | 结束日期 |
| genres | array | no | enum: 1=<1min, 2=1-3min, 3=3-5min, 4=>5min, 5=图文, 8=长图文 | 体裁类型 |
| primary_verticals | array | yes | — | 垂类标签列表（**从 involved_vertical 接口获取**） |

---

### creator_v2_fetch_item_analysis_item_performance — 获取投稿表现数据

**Full path:** `/api/v1/douyin/creator_v2/fetch_item_analysis_item_performance`
**Method:** POST · **Risk:** **high**

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cookie | string | yes | — | 抖音创作者平台 Cookie |
| start_date | string | yes | format: YYYYMMDD | 开始日期 |
| end_date | string | yes | format: YYYYMMDD，最多 90 天 | 结束日期 |
| genres | array | no | 体裁类型列表 | — |
| primary_verticals | array | yes | — | 垂类标签列表 |
| metric_type | integer | no | enum: 1=播放量, 2=点赞量, 3=评论量, 4=分享量, default: 1 | 指标类型 |

---

### creator_v2_fetch_item_list — 获取投稿作品列表

**Full path:** `/api/v1/douyin/creator_v2/fetch_item_list`
**Method:** POST · **Risk:** **high**

#### 用途
获取投稿作品列表，支持 26 种排序方式。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cookie | string | yes | — | 抖音创作者平台 Cookie |
| start_time | integer | yes | 毫秒时间戳 | 开始时间 |
| end_time | integer | yes | 毫秒时间戳 | 结束时间 |
| count | integer | no | default: 10, max: 100 | 每页数量 |
| order_by | integer | no | default: 1，支持 26 种排序 | 排序方式 |
| fields | string | no | default: "metrics,review,visibility" | 返回字段 |
| cursor | integer | no | — | 分页游标，首次不传 |

> 排序方式（order_by）：1=发布时间↓, 3=播放量↓, 5=点赞量↓, 7=评论量↓, 9=分享量↓, 11=收藏量↓, 13=2s跳出率↓, 15=5s完播率↓, 17=完播率↓, 19=封面点击率↓, 21=平均播放时长↓, 23=主页访问量↓, 25=粉丝增量↓（每个都有对应升序）

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| items[].item_id | `$.data.items[].item_id` | 作品 ID | creator_v2_fetch_item_overview_data 等 |
| cursor | `$.data.cursor` | 下一页游标 | 同端点翻页 |
| has_more | `$.data.has_more` | 是否还有下一页 | 翻页终止条件 |

---

### creator_v2_fetch_item_list_download — 导出投稿作品列表

**Full path:** `/api/v1/douyin/creator_v2/fetch_item_list_download`
**Method:** POST · **Risk:** **high**

#### 用途
导出投稿作品列表为 Excel 文件，最多导出前 1000 条。返回 Content-Type: application/vnd.ms-excel。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cookie | string | yes | — | 抖音创作者平台 Cookie |
| min_cursor | integer | yes | 毫秒时间戳（=开始时间） | 最小游标 |
| max_cursor | integer | yes | 毫秒时间戳（=结束时间） | 最大游标 |
| type_filters | array | no | default: [1,2,3,4,5,8] | 体裁类型过滤 |
| need_long_article | boolean | no | default: true | 是否包含长图文 |

---

### creator_v2_fetch_live_room_history_list — 获取直播场次历史

**Full path:** `/api/v1/douyin/creator_v2/fetch_live_room_history_list`
**Method:** POST · **Risk:** **high**

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cookie | string | yes | — | 抖音创作者平台 Cookie |
| start_date | string | yes | format: YYYY-MM-DD | 开始日期 |
| end_date | string | yes | format: YYYY-MM-DD | 结束日期 |
| limit | integer | no | default: 400, max: 400 | 每页数量 |
| need_living | integer | no | enum: 0=不含, 1=包含正在直播, default: 1 | 是否包含正在直播 |
| download | integer | no | enum: 0=不下载, 1=下载, default: 0 | 是否下载 |

---

### creator_v2_fetch_author_diagnosis — 获取账号诊断

**Full path:** `/api/v1/douyin/creator_v2/fetch_author_diagnosis`
**Method:** POST · **Risk:** **high**

#### 用途
获取账号诊断数据：互动指数、粉丝净增量、视频播放量、视频完播率、投稿活跃度，含 OwnValue/AuthorRank/SimilarRank/SimilarValue。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cookie | string | yes | — | 抖音创作者平台 Cookie |
