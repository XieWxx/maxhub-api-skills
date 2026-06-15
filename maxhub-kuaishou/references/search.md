# Kuaishou Search & Trending / 快手 搜索与热榜

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
综合搜索、分类搜索（视频/用户/图片/直播/音乐/话题标签）、推荐 Feed 流、话题标签聚合页、热榜分类与详情、热搜人物。含 App 和 Web 双端。**photo_id 和 user_id 多在本文件搜索端点首步产出**，是 video.md 和 user.md 的常见上游。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| app_fetch_selection_feed | 首选 | 取精选/推荐 Feed 流（无入参，冷启动入口） | GET | /api/v1/kuaishou/app/fetch_selection_feed | low |
| app_search_comprehensive | 首选 | 综合搜索（视频+用户，支持多维筛选） | GET | /api/v1/kuaishou/app/search_comprehensive | low |
| app_search_video_v2 | 首选 | 搜索视频 V2 | GET | /api/v1/kuaishou/app/search_video_v2 | low |
| app_search_user_v2 | 首选 | 搜索用户 V2（支持关系/性别/粉丝筛选） | GET | /api/v1/kuaishou/app/search_user_v2 | low |
| app_search_image | 条件 | 搜索图片作品 | GET | /api/v1/kuaishou/app/search_image | low |
| app_search_live | 条件 | 搜索直播间 | GET | /api/v1/kuaishou/app/search_live | low |
| app_search_music | 条件 | 搜索音乐 | GET | /api/v1/kuaishou/app/search_music | low |
| app_search_tag | 条件 | 搜索话题标签（hashtag） | GET | /api/v1/kuaishou/app/search_tag | low |
| app_fetch_tag_feed | 条件 | 话题标签聚合页（标签→作品流） | GET | /api/v1/kuaishou/app/fetch_tag_feed | low |
| app_fetch_hot_board_categories | 条件 | 快手热榜分类列表 | GET | /api/v1/kuaishou/app/fetch_hot_board_categories | low |
| app_fetch_hot_board_detail | 条件 | 快手热榜详情 | GET | /api/v1/kuaishou/app/fetch_hot_board_detail | low |
| app_fetch_hot_search_person | 条件 | 快手热搜人物榜单 | GET | /api/v1/kuaishou/app/fetch_hot_search_person | low |
| web_fetch_kuaishou_hot_list_v1 | 条件 | 快手热榜 V1（Web 端，无入参） | GET | /api/v1/kuaishou/web/fetch_kuaishou_hot_list_v1 | low |
| web_fetch_kuaishou_hot_list_v2 | 首选 | 快手热榜 V2（Web 端，支持分类） | GET | /api/v1/kuaishou/web/fetch_kuaishou_hot_list_v2 | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 搜索视频 → 看详情 | app_search_video_v2 → video.md 的 app_fetch_one_video | `$.data.videos[].photo_id` → `photo_id` | 第 1 步空：STOP；第 2 步失败：返回搜索结果 + "详情暂不可取" |
| 搜索用户 → 看主页 | app_search_user_v2 → user.md 的 app_fetch_one_user_v2 | `$.data.users[].user_id` → `user_id` | 第 1 步空：STOP，告知未找到 |
| 搜索标签 → 看标签内容 | app_search_tag → app_fetch_tag_feed | `$.data.tags[].id` → `general_tag_id` | 第 1 步空：STOP；第 2 步空：返回标签信息 + "暂无内容" |
| 热榜分类 → 热榜详情 | app_fetch_hot_board_categories → app_fetch_hot_board_detail | `$.data.categories[].boardType`/`boardId` → 对应参数 | 第 1 步失败：STOP |
| 推荐 Feed → 视频详情 | app_fetch_selection_feed → video.md 的 app_fetch_one_video | `$.data.feeds[].photo_id` → `photo_id` | 跨文件链路 |
| 综合搜索 → 视频 + 评论 | app_search_comprehensive → video.md → comments.md | photo_id 接力 | 多步链路，中间步失败返回截止数据 |

## 跨 reference 链路 (In-Chain)
- **流出本文件**：`app_search_video_v2` 的 `$.data.videos[].photo_id` → `video.md` 多端点
- **流出本文件**：`app_search_user_v2` 的 `$.data.users[].user_id` → `user.md` 全部用户端点
- **流出本文件**：`app_fetch_selection_feed` 的 `$.data.feeds[].photo_id` → `video.md`
- **流出本文件**：`app_fetch_tag_feed` 的 `$.data.mixFeeds[].photo_id` → `video.md`
- **流出本文件**：`app_search_comprehensive` 的 `$.data.items[].photo_id` → `video.md` / `comments.md`

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-防路径臆造)）
- **第 2 步：自检通过后**才能 STOP 并报告"资源不存在"
- **禁止**：改路径段、切换平台前缀、拼接新路径
- **替换**：参考 `param-mappings.md` 的"端点替换矩阵"

### 参数错误（400 / 422）防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-防参数与传参方式臆造)）
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP
- **禁止**：切换端点、凭空加参数

### 鉴权错误（401）/ 余额（402）/ 权限（403）/ 限流（429）/ 上游故障（5xx）/ 网络超时 / 业务错误
- 同 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview) 通用规则

---

## 端点详情

### app_fetch_selection_feed — 精选/推荐 Feed 流

**Full path:** `/api/v1/kuaishou/app/fetch_selection_feed`
**Method:** GET · **Risk:** low

#### 用途
获取 App 首页「精选/推荐」频道的推荐作品流。**作品冷启动入口**——用户没有具体目标时，可从此端点采集 photo_id 进入其他链路。

#### 何时使用 / 不使用
- ✅ 用户问"快手有什么热门/推荐视频"等无明确目标的场景
- ✅ 链式起点：批量取 photo_id 后并行调用 video.md 端点
- ❌ 用户已有 photo_id → 直接用 video.md 端点

#### 输入 (IN)
无入参。

> **注意**：推荐流无游标翻页，想要更多内容直接再次调用即可（结果随推荐策略变化，不保证顺序与去重）。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| feeds[].photo_id | `$.data.feeds[].photo_id` | 推荐作品 ID | video.md 多端点 / comments.md |
| feeds[].user_id | `$.data.feeds[].user_id` | 作者用户 ID | user.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代（Feed 是最顶层入口） |

---

### app_search_comprehensive — 综合搜索

**Full path:** `/api/v1/kuaishou/app/search_comprehensive`
**Method:** GET · **Risk:** low

#### 用途
快手综合搜索接口，支持搜索视频、用户等内容，并提供多维度筛选功能。**不确定搜索目标类型时的首选搜索入口**。

#### 何时使用 / 不使用
- ✅ 用户给出关键词，不确定要搜视频还是用户
- ✅ 需要多维度筛选（排序/时间/时长）
- ❌ 明确只搜视频 → `app_search_video_v2`（更精准）
- ❌ 明确只搜用户 → `app_search_user_v2`（更精准）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| pcursor | string | no | — | 分页游标，首次留空 |
| sort_type | string | no | enum=`all`/`newest`/`most_likes` | 排序：all(综合, 默认) / newest(最新) / most_likes(最多点赞) |
| publish_time | string | no | enum=`all`/`one_day`/`one_week`/`one_month` | 时间：all(全部, 默认) / one_day / one_week / one_month |
| duration | string | no | enum=`all`/`under_1_min`/`1_to_5_min`/`over_5_min` | 时长：all(全部, 默认) / under_1_min / 1_to_5_min / over_5_min |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| items[].photo_id | `$.data.items[].photo_id` | 搜索结果作品 ID | video.md / comments.md |
| items[].user_id | `$.data.items[].user_id` | 搜索结果用户 ID | user.md |
| pcursor | `$.data.pcursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空结果 | 关键词未命中 | STOP，告知用户未找到 | 0 | — |

---

### app_search_video_v2 — 搜索视频 V2

**Full path:** `/api/v1/kuaishou/app/search_video_v2`
**Method:** GET · **Risk:** low

#### 用途
搜索视频 V2，使用游标分页。**明确只搜视频时的首选**。

#### 何时使用 / 不使用
- ✅ 用户明确要搜视频
- ❌ 想同时搜视频和用户 → `app_search_comprehensive`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| pcursor | string | no | — | 分页游标，首次留空 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| videos[].photo_id | `$.data.videos[].photo_id` | 视频作品 ID | video.md / comments.md |
| videos[].user_id | `$.data.videos[].user_id` | 视频作者 ID | user.md |
| pcursor | `$.data.pcursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空结果 | 关键词未命中 | STOP | 0 | — |

---

### app_search_user_v2 — 搜索用户 V2

**Full path:** `/api/v1/kuaishou/app/search_user_v2`
**Method:** GET · **Risk:** low

#### 用途
搜索用户 V2，支持关系、性别、粉丝数等多维筛选。**已知用户名时的链式入口**——把关键词转换为 user_id。

#### 何时使用 / 不使用
- ✅ 用户给出用户名/昵称，需要找到对应用户
- ✅ 链式起点：用户名 → user_id
- ❌ 已知 user_id → 直接用 user.md 端点
- ❌ 想搜视频 → `app_search_video_v2`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| pcursor | string | no | — | 分页游标，首次留空 |
| user_relation | string | no | enum=`all`/`same_city`/`verified`/`live`/`following` | 关系筛选：all(全部) / same_city(同城) / verified(认证) / live(直播中) / following(已关注) |
| user_gender | string | no | enum=`all`/`male`/`female` | 性别筛选：all(不限) / male(男) / female(女) |
| fans_sort | string | no | enum=`default`/`most_to_least`/`least_to_most` | 粉丝排序：default(默认) / most_to_least(从多到少) / least_to_most(从少到多) |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| users[].user_id | `$.data.users[].user_id` | 命中用户 ID | user.md 全部用户端点 |
| users[].user_name | `$.data.users[].user_name` | 用户名 | 用于核对身份避免误命中 |
| pcursor | `$.data.pcursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空结果 | 用户名未命中 | STOP，告知未找到 | 0 | — |
| 多结果 | 重名 | 让用户选择或返回前 N 个候选 | 0 | — |

---

### app_search_image — 搜索图片作品

**Full path:** `/api/v1/kuaishou/app/search_image`
**Method:** GET · **Risk:** low

#### 用途
关键词搜索图片作品，使用游标分页。

#### 何时使用 / 不使用
- ✅ 用户明确要搜图片类作品
- ❌ 搜视频 → `app_search_video_v2`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| pcursor | string | no | — | 分页游标，首次留空 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| items[].photo_id | `$.data.items[].photo_id` | 图片作品 ID | video.md |
| pcursor | `$.data.pcursor` | 下一页游标 | 同端点翻页 |

---

### app_search_live — 搜索直播间

**Full path:** `/api/v1/kuaishou/app/search_live`
**Method:** GET · **Risk:** low

#### 用途
关键词搜索正在直播的直播间，使用游标分页。

#### 何时使用 / 不使用
- ✅ 用户想搜正在直播的直播间
- ❌ 想看直播榜单 → `live.md` 的 `app_fetch_live_top_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| pcursor | string | no | — | 分页游标，首次留空 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| items[].user_id | `$.data.items[].user_id` | 主播用户 ID | user.md / live.md 的 app_fetch_user_live_info |
| pcursor | `$.data.pcursor` | 下一页游标 | 同端点翻页 |

---

### app_search_music — 搜索音乐

**Full path:** `/api/v1/kuaishou/app/search_music`
**Method:** GET · **Risk:** low

#### 用途
关键词搜索音乐（歌曲名/歌手/关键词），使用游标分页。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 歌曲名 / 歌手 / 关键词 |
| pcursor | string | no | — | 分页游标，首次留空 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| musics[].id | `$.data.musics[].id` | 音乐 ID | app_fetch_tag_feed（tag_type=29 时） |
| pcursor | `$.data.pcursor` | 下一页游标 | 同端点翻页 |

---

### app_search_tag — 搜索话题标签

**Full path:** `/api/v1/kuaishou/app/search_tag`
**Method:** GET · **Risk:** low

#### 用途
关键词搜索话题标签（hashtag），结果在 tags[] 中。可配合 app_fetch_tag_feed 翻该标签内容流。

#### 何时使用 / 不使用
- ✅ 用户想搜话题/挑战/标签
- ✅ 链式起点：标签关键词 → tag_id → app_fetch_tag_feed
- ❌ 想看标签下的内容 → 先搜标签再调 app_fetch_tag_feed

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 话题关键词 |
| pcursor | string | no | — | 分页游标，首次留空 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| tags[].id | `$.data.tags[].id` | 标签数字 ID | app_fetch_tag_feed 的 general_tag_id |
| tags[].name | `$.data.tags[].name` | 标签名 | app_fetch_tag_feed 的 tag_name / general_tag_id |
| pcursor | `$.data.pcursor` | 下一页游标 | 同端点翻页 |

---

### app_fetch_tag_feed — 话题标签聚合页

**Full path:** `/api/v1/kuaishou/app/fetch_tag_feed`
**Method:** GET · **Risk:** low

#### 用途
话题标签聚合页：给定标签，返回标签信息 + 关联作品流。hashtag 页有 4 个子 tab（hot/latest/image/live）。

#### 何时使用 / 不使用
- ✅ 已知标签 ID 或标签名，想看该标签下的作品
- ✅ 链式下游：从 app_search_tag 取得 tag_id 后调用
- ❌ 不知标签名 → 先用 app_search_tag 搜索

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| general_tag_id | string | yes | 话题标签传标签名或数字 id；声音标签传编码串 | 如 `清纯甜美少女` |
| tab | string | no | enum=`hot`/`latest`/`image`/`live` | 子 tab：hot(最热门, 默认) / latest(最新) / image(图片) / live(直播) |
| tag_name | string | no | — | 话题标签建议传，等于标签名 |
| tag_type | integer | no | 1=话题标签(默认), 29=声音/音乐标签 | 标签类型 |
| tag_source | integer | no | 2=搜索进入(默认), 3=作品页声音标签 | 来源 |
| from_photo_id | string | no | — | 进入标签页的源作品 photoId（可选） |
| pcursor | string | no | — | 分页游标，首次留空 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| mixFeeds[].photo_id | `$.data.mixFeeds[].photo_id` | 标签下作品 ID | video.md / comments.md |
| tagInfo | `$.data.tagInfo` | 标签信息 | 仅展示 |
| pcursor | `$.data.pcursor` | 下一页游标 | 同端点翻页 |

---

### app_fetch_hot_board_categories — 快手热榜分类

**Full path:** `/api/v1/kuaishou/app/fetch_hot_board_categories`
**Method:** GET · **Risk:** low

#### 用途
获取快手热榜分类列表。返回 boardType 和 boardId 供 app_fetch_hot_board_detail 使用。

#### 输入 (IN)
无入参。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| categories[].boardType | `$.data.categories[].boardType` | 榜单类型 | app_fetch_hot_board_detail 的 boardType |
| categories[].boardId | `$.data.categories[].boardId` | 榜单 ID | app_fetch_hot_board_detail 的 boardId |

---

### app_fetch_hot_board_detail — 快手热榜详情

**Full path:** `/api/v1/kuaishou/app/fetch_hot_board_detail`
**Method:** GET · **Risk:** low

#### 用途
快手热榜详情。boardType 和 boardId 可从热榜分类接口中获取。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| boardType | integer | no | 默认 1 | 榜单类型 |
| boardId | integer | no | 默认 1 | 榜单 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| items[].photo_id | `$.data.items[].photo_id` | 热榜作品 ID | video.md |

---

### app_fetch_hot_search_person — 快手热搜人物榜单

**Full path:** `/api/v1/kuaishou/app/fetch_hot_search_person`
**Method:** GET · **Risk:** low

#### 用途
获取快手热搜人物榜单。

#### 输入 (IN)
无入参。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| persons[].user_id | `$.data.persons[].user_id` | 热搜人物用户 ID | user.md |

---

### web_fetch_kuaishou_hot_list_v1 — 快手热榜 V1（Web 端）

**Full path:** `/api/v1/kuaishou/web/fetch_kuaishou_hot_list_v1`
**Method:** GET · **Risk:** low

#### 用途
获取快手热榜 V1（Web 端），无需参数。

#### 输入 (IN)
无入参。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| items[].photo_id | `$.data.items[].photo_id` | 热榜作品 ID | video.md |

---

### web_fetch_kuaishou_hot_list_v2 — 快手热榜 V2（Web 端）

**Full path:** `/api/v1/kuaishou/web/fetch_kuaishou_hot_list_v2`
**Method:** GET · **Risk:** low

#### 用途
获取快手热榜 V2（Web 端），支持按分类查看。**Web 端首选热榜入口**。

#### 何时使用 / 不使用
- ✅ 想看快手热榜（Web 端）
- ✅ 需要按分类查看热榜
- ❌ 不需分类 → V1 也可用

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| board_type | string | no | enum=`1`/`2`/`3`/`4`/`5`/`6` | 1=热榜(默认) / 2=文娱 / 3=社会 / 4=有用 / 5=挑战 / 6=搜索 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| items[].photo_id | `$.data.items[].photo_id` | 热榜作品 ID | video.md |
