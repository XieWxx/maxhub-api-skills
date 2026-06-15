# Kuaishou Live / 快手 直播

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
直播信息、直播榜单（总榜/购物/品牌）、音乐排行榜、直播回放。含 App 和 Web 双端。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| app_fetch_user_live_info | 首选 | 用 user_id 取用户直播信息（App 端，**仅纯数字**） | GET | /api/v1/kuaishou/app/fetch_user_live_info | low |
| app_fetch_live_top_list | 条件 | 快手直播榜单（支持子榜单） | GET | /api/v1/kuaishou/app/fetch_live_top_list | low |
| app_fetch_shopping_top_list | 条件 | 快手购物榜单（支持子榜单） | GET | /api/v1/kuaishou/app/fetch_shopping_top_list | low |
| app_fetch_brand_top_list | 条件 | 快手品牌榜单（支持子榜单） | GET | /api/v1/kuaishou/app/fetch_brand_top_list | low |
| app_fetch_music_ranking | 条件 | 音乐榜单（热歌榜/推荐榜） | GET | /api/v1/kuaishou/app/fetch_music_ranking | low |
| web_fetch_user_live_replay | 条件 | 用 eid 取用户直播回放（Web 端，**仅 eid**） | GET | /api/v1/kuaishou/web/fetch_user_live_replay | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 搜用户 → 看直播 | search.md 的 app_search_user_v2 → app_fetch_user_live_info | `$.data.users[].user_id` → `user_id`（需纯数字） | 跨文件链路 |
| 看用户 → 看直播 | user.md 的 app_fetch_one_user_v2 → app_fetch_user_live_info | `$.data.user_id`（纯数字）→ `user_id` | 第 1 步失败：STOP；第 2 步失败：返回用户资料 + "直播信息暂不可取" |
| 看用户 → 看直播回放 | user.md 的 web_fetch_user_info → web_fetch_user_live_replay | `$.data.userProfile.profile.user_id`（eid）→ `user_id` | 跨文件链路 |
| 直播榜单 → 主播主页 | app_fetch_live_top_list → user.md 的 app_fetch_one_user_v2 | `$.data.list[].user_id` → `user_id` | 跨文件链路 |
| 购物榜单 → 主播主页 | app_fetch_shopping_top_list → user.md 的 app_fetch_one_user_v2 | `$.data.list[].user_id` → `user_id` | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`user.md` 的 `app_fetch_one_user_v2` 输出纯数字 userId → `app_fetch_user_live_info`
- **流入本文件**：`user.md` 的 `web_fetch_user_info` 输出 eid → `web_fetch_user_live_replay`
- **流入本文件**：`search.md` 的 `app_search_user_v2` 输出 user_id → `app_fetch_user_live_info`
- **流出本文件**：`app_fetch_live_top_list` 等榜单端点输出 user_id → `user.md`

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
- **user_id 格式**：app_fetch_user_live_info 仅支持纯数字，web_fetch_user_live_replay 仅支持 eid
- **禁止**：切换端点、凭空加参数

### 鉴权错误（401）/ 余额（402）/ 权限（403）/ 限流（429）/ 上游故障（5xx）/ 网络超时 / 业务错误
- 同 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview) 通用规则

---

## 端点详情

### app_fetch_user_live_info — 获取用户直播信息

**Full path:** `/api/v1/kuaishou/app/fetch_user_live_info`
**Method:** GET · **Risk:** low

#### 用途
获取用户直播信息（App 端）。**仅支持纯数字用户 ID，不支持 eid**。userId 可从 user.md 的 app_fetch_one_user_v2 获取。

#### 何时使用 / 不使用
- ✅ 已知纯数字 userId，想看该用户是否在直播
- ❌ 只有 eid → 先用 app_fetch_one_user_v2 获取纯数字 userId
- ❌ 想看直播榜单 → app_fetch_live_top_list

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | **仅纯数字 userId**，不支持 eid | 如 `1377082950` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| live_status | `$.data.live_status` | 直播状态 | 判断是否在直播 |
| live_room_id | `$.data.live_room_id` | 直播间 ID | 仅展示 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | user_id 为 eid 格式 | 提示需纯数字 userId | 0 | 先调 user.md 获取纯数字 userId |
| 404 | 用户不存在 | STOP | 0 | 无替代（直播信息无替代来源） |

---

### app_fetch_live_top_list — 快手直播榜单

**Full path:** `/api/v1/kuaishou/app/fetch_live_top_list`
**Method:** GET · **Risk:** low

#### 用途
获取快手直播榜单，支持多个子榜单（直播总榜、音乐、舞蹈、颜值等）。

#### 何时使用 / 不使用
- ✅ 用户想看快手直播排行榜
- ❌ 想看购物榜单 → app_fetch_shopping_top_list
- ❌ 想看品牌榜单 → app_fetch_brand_top_list

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| subTabId | integer | no | 默认 0 | 子榜单 ID（见下表） |
| subTabName | string | no | — | 子榜单名称 |

**子榜单列表**：
| 子榜单 | subTabId | subTabName |
|--------|----------|------------|
| 直播总榜 | 0 | (空) |
| 音乐 | 102 | 音乐 |
| 舞蹈 | 107 | 舞蹈 |
| 颜值 | 101 | 颜值 |
| 国艺 | 105 | 国艺 |
| 相亲 | 111 | 相亲 |
| 游戏 | 106 | 游戏 |
| 二次元 | 110 | 二次元 |
| 故事 | 104 | 故事 |
| 团播 | 113 | 团播 |
| 九宫格 | 114 | 九宫格 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].user_id | `$.data.list[].user_id` | 上榜主播用户 ID | user.md |

---

### app_fetch_shopping_top_list — 快手购物榜单

**Full path:** `/api/v1/kuaishou/app/fetch_shopping_top_list`
**Method:** GET · **Risk:** low

#### 用途
获取快手购物榜单，支持多个子榜单（热门主播榜、热销商品榜）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| subTabId | integer | no | 默认 0 | 子榜单 ID |
| subTabName | string | no | — | 子榜单名称 |

**子榜单列表**：
| 子榜单 | subTabId | subTabName |
|--------|----------|------------|
| 热门主播榜 | 0 | (空) |
| 热销商品榜 | 102 | 热销商品 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].user_id | `$.data.list[].user_id` | 上榜主播用户 ID | user.md |

---

### app_fetch_brand_top_list — 快手品牌榜单

**Full path:** `/api/v1/kuaishou/app/fetch_brand_top_list`
**Method:** GET · **Risk:** low

#### 用途
获取快手品牌榜单，支持多个子榜单（美妆、服饰、汽车等）。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| subTabId | integer | no | 默认 0 | 子榜单 ID |
| subTabName | string | no | — | 子榜单名称 |

**子榜单列表**：
| 子榜单 | subTabId | subTabName |
|--------|----------|------------|
| 热门美妆榜 | 0 | (空) |
| 热门服饰榜 | 131 | 服饰 |
| 热门汽车榜 | 1 | 汽车 |
| 热门游戏榜 | 25 | 游戏 |
| 热门医疗健康榜 | 24 | 医疗健康 |
| 热门3C数码榜 | 130 | 3C数码 |
| 热门手机榜 | 128 | 手机 |
| 热门家电榜 | 11 | 家电 |
| 热门母婴榜 | 4 | 母婴 |
| 热门食品饮料榜 | 2 | 食品饮料 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].user_id | `$.data.list[].user_id` | 上榜主播用户 ID | user.md |

---

### app_fetch_music_ranking — 音乐榜单

**Full path:** `/api/v1/kuaishou/app/fetch_music_ranking`
**Method:** GET · **Risk:** low

#### 用途
获取音乐榜单（歌曲列表，结果在 musics[] 中），使用游标分页。

#### 何时使用 / 不使用
- ✅ 用户想看快手音乐排行
- ❌ 想搜音乐 → search.md 的 app_search_music

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| tab_id | integer | no | 100002=热歌榜(默认), 100063=计划推荐榜 | 榜单类型 |
| count | integer | no | min=1, max=50, 默认=20 | 每页数量 |
| pcursor | string | no | — | 分页游标，首次留空 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| musics[].id | `$.data.musics[].id` | 音乐 ID | app_fetch_tag_feed（tag_type=29） |
| pcursor | `$.data.pcursor` | 下一页游标 | 同端点翻页 |

---

### web_fetch_user_live_replay — 获取用户直播回放

**Full path:** `/api/v1/kuaishou/web/fetch_user_live_replay`
**Method:** GET · **Risk:** low

#### 用途
获取用户直播回放列表（Web 端）。**仅支持 eid，不支持纯数字用户 ID**。

#### 何时使用 / 不使用
- ✅ 已知 eid，想看用户直播回放
- ❌ 只有纯数字 userId → 无法使用此端点
- ❌ 想看正在直播的信息 → app_fetch_user_live_info

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | **仅 eid 格式**，不支持纯数字 uid | 如 `3xz63mn6fngqtiq` |
| pcursor | string | no | — | 分页游标，首次留空 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| replays[].photo_id | `$.data.replays[].photo_id` | 回放作品 ID | video.md |
| pcursor | `$.data.pcursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | user_id 为纯数字格式 | 提示需 eid 格式 | 0 | — |
| 404 | 用户不存在 | STOP | 0 | — |
| 空数据 | 该用户暂无直播回放 | 返回"暂无直播回放" | 0 | — |
