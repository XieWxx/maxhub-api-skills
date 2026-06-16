# Douyin Video — Feed+合集/短剧/音乐/话题/频道 / 抖音视频 — Feed+合集/短剧/音乐/话题/频道
> 本文件是 [video/_index.md](./_index.md) 的子文件。完整端点路由、链式调用图谱、错误处理契约请参见 _index.md。

## 端点详情

---

### web_fetch_home_feed — 取首页推荐 Feed

**Full path:** `/api/v1/douyin/web/fetch_home_feed`
**Method:** POST · **Risk:** high · **requires_user_confirmation:** true · **write_operation:** true

#### 用途
获取首页推荐 Feed 流。**作品冷启动入口**——用户没有具体 aweme_id 时，可从此端点采集 aweme_id 进入其他链路。

#### 何时使用 / 不使用
- ✅ 用户问"抖音有什么热门"等无明确目标作品的场景
- ✅ 链式起点：批量取 aweme_id 后并行调用详情端点
- ❌ 用户已给 aweme_id → 直接 `app_v3_fetch_one_video`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| — | — | — | — | 请求体参数由 API 内部定义，无需额外传参 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 推荐作品 ID | 本文件多端点 |
| aweme_list[].author.sec_uid | `$.data.aweme_list[].author.sec_uid` | 作者 ID | user.md |
| has_more | `$.data.has_more` | 是否有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代（feed 是最顶层入口） |

---

### web_fetch_related_posts — 取相关推荐视频

**Full path:** `/api/v1/douyin/web/fetch_related_posts`
**Method:** GET · **Risk:** low

#### 用途
获取指定视频的相关推荐视频列表。

#### 何时使用 / 不使用
- ✅ 用户想看"和这个视频类似的视频"
- ❌ 想看视频本身详情 → 用 `app_v3_fetch_one_video`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | yes | 纯数字字符串 | 作品 ID |
| refresh_index | integer | no | default: 1 | 翻页索引 |
| count | integer | no | default: 20 | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 推荐作品 ID | app_v3_fetch_one_video |
| has_more | `$.data.has_more` | 是否有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 视频不存在 | STOP | 0 | 无替代 |

---

### web_fetch_one_video_danmaku — 取视频弹幕数据

**Full path:** `/api/v1/douyin/web/fetch_one_video_danmaku`
**Method:** GET · **Risk:** low

#### 用途
获取视频弹幕数据（按时间段）。

#### 何时使用 / 不使用
- ✅ 用户需要弹幕数据
- ❌ 想看视频详情 → 用 `app_v3_fetch_one_video`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| item_id | string | yes | 纯数字字符串 | 作品 ID（即 aweme_id） |
| duration | integer | yes | 正整数 | 视频时长（秒） |
| end_time | integer | yes | 正整数 | 结束时间（秒） |
| start_time | integer | yes | ≥0 | 开始时间（秒） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 弹幕数据列表 | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或无效 | 校正后重试 | ≤1 次 | — |

---

### web_fetch_video_channel_result — 取频道内容

**Full path:** `/api/v1/douyin/web/fetch_video_channel_result`
**Method:** GET · **Risk:** low

#### 用途
按频道标签获取视频内容列表。

#### 何时使用 / 不使用
- ✅ 用户想浏览特定频道/垂类内容
- ❌ 想看首页推荐 → 用 `web_fetch_home_feed`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| tag_id | string | yes | — | 频道标签 ID |
| count | integer | no | default: 20 | 每页数量 |
| refresh_index | integer | no | default: 1 | 翻页索引 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | app_v3_fetch_one_video |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | tag_id 无效 | STOP | 0 | 无替代 |

---

### web_fetch_challenge_posts — 取挑战赛视频列表

**Full path:** `/api/v1/douyin/web/fetch_challenge_posts`
**Method:** POST · **Risk:** high · **requires_user_confirmation:** true · **write_operation:** true

#### 用途
获取指定挑战赛（话题）下的视频列表。

#### 何时使用 / 不使用
- ✅ 用户想看某个挑战赛的视频
- ❌ 想看话题详情 → 用 `app_v3_fetch_hashtag_detail`
- ❌ 想看话题视频列表（GET 版本）→ 用 `app_v3_fetch_hashtag_video_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| challenge_id | string | yes (body) | — | 话题 ID |
| sort_type | integer | no (body) | 0=综合, 1=最热, 2=最新 | 排序方式 |
| cursor | integer | no (body) | default: 0 | 游标 |
| count | integer | no (body) | default: 20 | 数量 |
| cookie | string | no (body) | — | 用户自行提供的 Cookie |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | app_v3_fetch_one_video |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | challenge_id 无效 | STOP | 0 | 替换：`app_v3_fetch_hashtag_video_list`（ch_id） |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`app_v3_fetch_hashtag_video_list` |

---

### app_v3_fetch_video_mix_detail — 取合集详情

**Full path:** `/api/v1/douyin/app/v3/fetch_video_mix_detail`
**Method:** GET · **Risk:** low

#### 用途
获取视频合集详情数据。

#### 何时使用 / 不使用
- ✅ 用户想看某个合集的详情
- ✅ 链式起点：取 mix_id 后调用 `app_v3_fetch_video_mix_post_list`
- ❌ 想看合集视频列表 → 直接用 `app_v3_fetch_video_mix_post_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| mix_id | string | yes | 纯数字字符串 | 合集 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| mix_id | `$.data.mix_id` | 合集 ID | app_v3_fetch_video_mix_post_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 合集不存在 | STOP | 0 | 无替代 |

---

### app_v3_fetch_video_mix_post_list — 取合集视频列表

**Full path:** `/api/v1/douyin/app/v3/fetch_video_mix_post_list`
**Method:** GET · **Risk:** low

#### 用途
获取合集下的视频列表（含分页）。

#### 何时使用 / 不使用
- ✅ 已知 mix_id，想看合集内视频
- ❌ 不知 mix_id → 先调用 `app_v3_fetch_video_mix_detail`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| mix_id | string | yes | 纯数字字符串 | 合集 ID |
| cursor | integer | no | default: 0 | 游标 |
| count | integer | no | default: 20 | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | app_v3_fetch_one_video |
| has_more | `$.data.has_more` | 是否有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 合集不存在 | STOP | 0 | 无替代 |

---

### app_v3_fetch_user_series_list — 取用户短剧列表

**Full path:** `/api/v1/douyin/app/v3/fetch_user_series_list`
**Method:** GET · **Risk:** low

#### 用途
获取用户的短剧合集列表。

#### 何时使用 / 不使用
- ✅ 用户想看某作者的短剧列表
- ❌ 想看短剧详情 → 用 `app_v3_fetch_series_detail`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | oneOf(user_id, sec_user_id) | 纯数字字符串 | 用户 ID |
| sec_user_id | string | oneOf(user_id, sec_user_id) | Base64 格式 | 用户加密 ID |
| cursor | integer | no | default: 0 | 游标 |

> **二选一逻辑**：user_id 与 sec_user_id 至少传一个。优先使用 sec_user_id。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| series_list[].series_id | `$.data.series_list[].series_id` | 短剧 ID | app_v3_fetch_series_detail / app_v3_fetch_series_video_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | user_id 和 sec_user_id 都未传 | 修正后重试 | ≤1 次 | — |

---

### app_v3_fetch_series_detail — 取短剧详情

**Full path:** `/api/v1/douyin/app/v3/fetch_series_detail`
**Method:** GET · **Risk:** low

#### 用途
获取短剧详情信息（名称、描述、封面、作者、总集数、更新状态、播放量、收藏量等）。

#### 何时使用 / 不使用
- ✅ 已知 series_id，想看短剧详情
- ✅ 链式起点：取 series_id 后调用 `app_v3_fetch_series_video_list`
- ❌ 想看短剧视频列表 → 直接用 `app_v3_fetch_series_video_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| series_id | string | yes | 纯数字字符串 | 短剧 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| series_id | `$.data.series_id` | 短剧 ID | app_v3_fetch_series_video_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 短剧不存在 | STOP | 0 | 无替代 |

---

### app_v3_fetch_series_video_list — 取短剧视频列表

**Full path:** `/api/v1/douyin/app/v3/fetch_series_video_list`
**Method:** GET · **Risk:** low

#### 用途
获取短剧的视频列表（含分页）。

#### 何时使用 / 不使用
- ✅ 已知 series_id，想看短剧内的视频
- ❌ 不知 series_id → 先调用 `app_v3_fetch_series_detail` 或 `app_v3_fetch_user_series_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| series_id | string | yes | 纯数字字符串 | 短剧 ID |
| cursor | integer | no | default: 0 | 游标 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | app_v3_fetch_one_video |
| has_more | `$.data.has_more` | 是否有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 短剧不存在 | STOP | 0 | 无替代 |

---

### app_v3_fetch_music_detail — 取音乐详情

**Full path:** `/api/v1/douyin/app/v3/fetch_music_detail`
**Method:** GET · **Risk:** low

#### 用途
获取指定音乐的详情数据。

#### 何时使用 / 不使用
- ✅ 已知 music_id，想看音乐详情
- ✅ 链式起点：取 music_id 后调用 `app_v3_fetch_music_video_list`
- ❌ 想看音乐关联视频 → 直接用 `app_v3_fetch_music_video_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| music_id | string | yes | 纯数字字符串 | 音乐 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| music_id | `$.data.music_id` | 音乐 ID | app_v3_fetch_music_video_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 音乐不存在 | STOP | 0 | 无替代 |

---

### app_v3_fetch_music_video_list — 取音乐关联视频列表

**Full path:** `/api/v1/douyin/app/v3/fetch_music_video_list`
**Method:** GET · **Risk:** low

#### 用途
获取使用指定音乐的视频列表（含分页）。

#### 何时使用 / 不使用
- ✅ 已知 music_id，想看使用该音乐的视频
- ❌ 不知 music_id → 先调用 `app_v3_fetch_music_detail`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| music_id | string | yes | 纯数字字符串 | 音乐 ID |
| cursor | integer | no | default: 0 | 游标 |
| count | integer | no | default: 10 | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | app_v3_fetch_one_video |
| has_more | `$.data.has_more` | 是否有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 音乐不存在 | STOP | 0 | 无替代 |

---

### app_v3_fetch_hashtag_detail — 取话题详情

**Full path:** `/api/v1/douyin/app/v3/fetch_hashtag_detail`
**Method:** GET · **Risk:** low

#### 用途
获取指定话题（Hashtag）的详情数据。

#### 何时使用 / 不使用
- ✅ 已知 ch_id，想看话题详情
- ✅ 链式起点：取 ch_id 后调用 `app_v3_fetch_hashtag_video_list`
- ❌ 想看话题视频列表 → 直接用 `app_v3_fetch_hashtag_video_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| ch_id | integer | yes | 正整数 | 话题 ID，如 `1575791821492238` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| ch_id | `$.data.ch_id` | 话题 ID | app_v3_fetch_hashtag_video_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 话题不存在 | STOP | 0 | 无替代 |

---

### app_v3_fetch_hashtag_video_list — 取话题视频列表

**Full path:** `/api/v1/douyin/app/v3/fetch_hashtag_video_list`
**Method:** GET · **Risk:** low

#### 用途
获取指定话题下的视频列表（含分页和排序）。

#### 何时使用 / 不使用
- ✅ 已知 ch_id，想看话题下的视频
- ❌ 不知 ch_id → 先调用 `app_v3_fetch_hashtag_detail`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| ch_id | string | yes | — | 话题 ID |
| cursor | integer | no | default: 0 | 游标 |
| sort_type | integer | no | 0=综合, 1=最多点赞, 2=最新发布 | 排序方式 |
| count | integer | no | default: 10 | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | app_v3_fetch_one_video |
| has_more | `$.data.has_more` | 是否有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 话题不存在 | STOP | 0 | 无替代 |

---

### web_fetch_series_aweme — 取短剧频道内容

**Full path:** `/api/v1/douyin/web/fetch_series_aweme`
**Method:** GET · **Risk:** low

#### 用途
获取短剧频道内容，支持多种短剧类型筛选。

#### 何时使用 / 不使用
- ✅ 用户想浏览短剧频道
- ❌ 想看某个具体短剧 → 用 `app_v3_fetch_series_detail`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| offset | integer | yes | ≥0 | 页码 |
| count | integer | yes | 正整数 | 每页数量 |
| content_type | integer | yes | 0=热榜, 101=甜宠, 102=搞笑, 104=正能量等 17 种 | 短剧类型 |
| cookie | string | no | — | 敏感登录凭据；仅在用户明确授权时使用 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | app_v3_fetch_one_video |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | content_type 无效 | 校正后重试 | ≤1 次 | — |

---

### web_fetch_knowledge_aweme — 取知识频道内容

**Full path:** `/api/v1/douyin/web/fetch_knowledge_aweme`
**Method:** GET · **Risk:** low

#### 用途
获取知识频道推荐内容。

#### 何时使用 / 不使用
- ✅ 用户想浏览知识类视频
- ❌ 搜索特定知识内容 → 用 `search.md` 的搜索端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| count | integer | yes | default: 16 | 每页数量 |
| refresh_index | integer | no | default: 1 | 翻页索引 |
| cookie | string | no | — | 敏感登录凭据 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | app_v3_fetch_one_video |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### web_fetch_game_aweme — 取游戏频道内容

**Full path:** `/api/v1/douyin/web/fetch_game_aweme`
**Method:** GET · **Risk:** low

#### 用途
获取游戏频道推荐内容。

#### 何时使用 / 不使用
- ✅ 用户想浏览游戏类视频

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| count | integer | yes | default: 16 | 每页数量 |
| refresh_index | integer | no | default: 1 | 翻页索引 |
| cookie | string | no | — | 敏感登录凭据 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | app_v3_fetch_one_video |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### web_fetch_cartoon_aweme — 取动漫频道内容

**Full path:** `/api/v1/douyin/web/fetch_cartoon_aweme`
**Method:** GET · **Risk:** low

#### 用途
获取二次元/动漫频道推荐内容。

#### 何时使用 / 不使用
- ✅ 用户想浏览动漫类视频

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| count | integer | yes | default: 16 | 每页数量 |
| refresh_index | integer | no | default: 1 | 翻页索引 |
| cookie | string | no | — | 敏感登录凭据 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | app_v3_fetch_one_video |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### web_fetch_music_aweme — 取音乐频道内容

**Full path:** `/api/v1/douyin/web/fetch_music_aweme`
**Method:** GET · **Risk:** low

#### 用途
获取音乐频道推荐内容。

#### 何时使用 / 不使用
- ✅ 用户想浏览音乐类视频

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| count | integer | yes | default: 16 | 每页数量 |
| refresh_index | integer | no | default: 1 | 翻页索引 |
| cookie | string | no | — | 敏感登录凭据 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | app_v3_fetch_one_video |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### web_fetch_food_aweme — 取美食频道内容

**Full path:** `/api/v1/douyin/web/fetch_food_aweme`
**Method:** GET · **Risk:** low

#### 用途
获取美食频道推荐内容。

#### 何时使用 / 不使用
- ✅ 用户想浏览美食类视频

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| count | integer | yes | default: 16 | 每页数量 |
| refresh_index | integer | no | default: 1 | 翻页索引 |
| cookie | string | no | — | 敏感登录凭据 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | app_v3_fetch_one_video |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |
