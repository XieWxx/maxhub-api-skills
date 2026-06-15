# TikTok Comments & Live / TikTok 评论与直播

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
视频评论与回复（App V3 + Web API）、直播间信息、直播在线状态检测、直播排行榜、直播间商品列表、直播弹幕参数、礼物列表与查询、直播间 ID 提取。**comment_id 与 room_id 多在本文件首步产出**，是直播链式调用的常见起点。

> 🔒 **Security:** All requests transmit your `MAXHUB_API_KEY` and query data to `https://www.aconfig.cn`. Never expose API keys in logs, prompts, or client-side storage. Web API endpoints return video CDN links requiring `tt_chain_token` Cookie for access. `fetch_live_room_product_list` / `fetch_live_daily_rank` may require cookie for non-US regions — use only with explicit user authorization.

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| fetch_video_comments | ⭐⭐⭐ 首选 | 获取视频评论列表（App V3） | GET | /api/v1/tiktok/app/v3/fetch_video_comments | low |
| fetch_video_comment_replies | ⭐⭐⭐ 首选 | 获取评论回复（App V3） | GET | /api/v1/tiktok/app/v3/fetch_video_comment_replies | low |
| fetch_live_room_info | ⭐⭐⭐ 首选 | 获取直播间信息（**room_id → anchor_id 入口**） | GET | /api/v1/tiktok/app/v3/fetch_live_room_info | low |
| fetch_live_ranking_list | ⭐⭐ 条件 | 获取直播间排行榜 | GET | /api/v1/tiktok/app/v3/fetch_live_ranking_list | low |
| check_live_room_online | ⭐⭐ 条件 | 检测单个直播间是否在线 | GET | /api/v1/tiktok/app/v3/check_live_room_online | low |
| check_live_room_online_batch | ⭐⭐ 条件 | 批量检测直播间在线状态（最多 50 个） | POST | /api/v1/tiktok/app/v3/check_live_room_online_batch | low |
| fetch_live_room_product_list | ⭐⭐ 条件 | 获取直播间商品列表 | GET | /api/v1/tiktok/app/v3/fetch_live_room_product_list | low |
| fetch_live_room_product_list_v2 | ⭐⭐ 条件 | 获取直播间商品列表 V2 | GET | /api/v1/tiktok/app/v3/fetch_live_room_product_list_v2 | low |
| fetch_live_daily_rank | ⭐⭐ 条件 | 获取直播每日榜单（支持多种榜单类型） | GET | /api/v1/tiktok/app/v3/fetch_live_daily_rank | low |
| fetch_post_comment | ⭐⭐ 条件 | 获取视频评论列表（Web API） | GET | /api/v1/tiktok/web/fetch_post_comment | low |
| fetch_post_comment_reply | ⭐⭐ 条件 | 获取评论回复（Web API） | GET | /api/v1/tiktok/web/fetch_post_comment_reply | low |
| get_live_room_id | ⭐⭐⭐ 首选 | 从直播间链接提取 room_id（**URL → room_id 入口**） | GET | /api/v1/tiktok/web/get_live_room_id | low |
| fetch_check_live_alive | ⭐⭐ 条件 | 检测直播间开播状态（Web API） | GET | /api/v1/tiktok/web/fetch_check_live_alive | low |
| fetch_batch_check_live_alive | ⭐⭐ 条件 | 批量检测开播状态（最多 50 个，Web API） | GET | /api/v1/tiktok/web/fetch_batch_check_live_alive | low |
| fetch_tiktok_live_data | ⭐⭐ 条件 | 通过直播链接获取直播间信息（含离线） | GET | /api/v1/tiktok/web/fetch_tiktok_live_data | low |
| fetch_live_im_fetch | ⭐⭐ 条件 | 获取直播间弹幕参数 | GET | /api/v1/tiktok/web/fetch_live_im_fetch | low |
| generate_wss_xb_signature | ⭐ 条件 | 生成 WSS X-Bogus 签名 | GET | /api/v1/tiktok/web/generate_wss_xb_signature | low |
| tiktok_live_room | ❌ 已废弃 | 提取直播间弹幕（已停止服务） | GET | /api/v1/tiktok/web/tiktok_live_room | low |
| fetch_live_gift_list | ⭐⭐ 条件 | 获取直播间礼物列表 | GET | /api/v1/tiktok/web/fetch_live_gift_list | low |
| fetch_gift_name_by_id | ⭐⭐ 条件 | 根据 Gift ID 查询礼物名称 | POST | /api/v1/tiktok/web/fetch_gift_name_by_id | low |
| fetch_gift_names_by_ids | ⭐⭐ 条件 | 批量查询礼物名称 | POST | /api/v1/tiktok/web/fetch_gift_names_by_ids | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看视频评论 + 回复 | fetch_video_comments → fetch_video_comment_replies | `$.data.data.comments[].cid` → `comment_id` | 第 1 步空：返回"暂无评论"；第 2 步空：返回评论 + "回复暂不可取" |
| 直播链接 → 直播信息 | get_live_room_id → fetch_live_room_info | `$.data.data.room_id` → `room_id` | 第 1 步失败：STOP |
| 直播信息 → 排行榜 | fetch_live_room_info → fetch_live_ranking_list | `$.data.data.owner.id_str` → `anchor_id` + `room_id` 复用 | 第 2 步空：返回直播信息 + "排行榜暂不可取" |
| 直播信息 → 商品列表 | fetch_live_room_info → fetch_live_room_product_list | `$.data.data.owner.id_str` → `author_id` + `room_id` 复用 | 第 2 步空：返回直播信息 + "暂无商品" |
| 批量检测直播在线 | check_live_room_online_batch → fetch_live_room_info（对在线的） | `room_ids` → 逐个获取详情 | 批量检测后仅对在线的调用详情 |
| 视频 → 评论 | video.md fetch_one_video_v3 → fetch_video_comments | `$.data.data.aweme_id` → `aweme_id` | 跨文件链路 |
| 直播间 → 弹幕 | fetch_live_room_info → fetch_live_im_fetch | `$.data.data.room_id` → `room_id` | 第 2 步空：返回直播信息 + "弹幕参数暂不可取" |
| 礼物列表 → 礼物名称 | fetch_live_gift_list → fetch_gift_name_by_id | gift_id → `gift_id` | 第 2 步失败：返回 ID + "名称查询失败" |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`video.md` 的 `fetch_one_video_v3` 输出 `$.data.data.aweme_id` → 本文件评论端点的 `aweme_id`
- **流入本文件**：`user.md` 的 `fetch_user_live_detail` 输出 `$.data.data.liveRoom.room_id` → 本文件直播端点的 `room_id`
- **流入本文件**：`user.md` 的 `fetch_creator_info` 输出 `$.data.data.live_info.room_id` → 本文件直播端点
- **流出本文件**：`fetch_video_comments` 的 `$.data.data.comments[].user.user_id` → `user.md` 的 user 系端点
- **流出本文件**：`fetch_live_room_info` 的 `$.data.data.owner.id_str` → `user.md` 的 handler_user_profile

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项；通用规则见此处。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**
- **禁止**：❌ 改路径段 ❌ 切换平台前缀 ❌ 拼接新路径

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP

### Web API 特有：tt_chain_token CDN 403
- Web API 端点返回的视频 CDN 链接需携带 `Cookie: tt_chain_token={tt_chain_token}`
- 如遇 403 → 提示用户携带 Cookie，或**降级**到 App V3 接口

### 直播特有：已废弃端点
- `tiktok_live_room` 已停止线上服务，禁止调用。如需弹幕功能，使用 `fetch_live_im_fetch`

### 直播特有：非 US 地区需 cookie
- `fetch_live_room_product_list` / `fetch_live_daily_rank` 在非 US 地区需携带 cookie
- cookie 属于敏感凭据，仅在用户明确授权时使用

### 鉴权错误（401）→ STOP，提示用户检查 API Key
### 余额 / 付费（402）→ STOP，告知用户充值
### 权限错误（403）→ STOP，按子场景告知用户
### 限流（429）→ 读 Retry-After 退避；最多重试 2 次
### 上游故障（500/502/503/504）→ 等 3 秒重试 1 次 → 走端点替换
### 业务错误（HTTP 200 且 `code != 0`）→ 读 `message_zh` 报告，不重试

---

## 端点详情

### fetch_video_comments — 获取视频评论列表（App V3）

**Full path:** `/api/v1/tiktok/app/v3/fetch_video_comments`
**Method:** GET · **Risk:** low

#### 用途
获取指定视频的评论列表。**评论链式调用的常见起点**——产出 comment_id 供回复端点使用。

#### 何时使用 / 不使用
- ✅ 已知 aweme_id，需要获取视频评论
- ✅ 链式起点：aweme_id → comment_id
- ❌ 想看评论回复 → fetch_video_comment_replies
- ❌ 想用 Web API → fetch_post_comment

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | yes | 纯数字长整型 | 视频/作品 ID |
| cursor | integer | no | default=0 | 翻页游标，第一页为 0，后续为上次响应的 cursor |
| count | integer | no | default=20 | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| comments[].cid | `$.data.data.comments[].cid` | 评论 ID | fetch_video_comment_replies（作为 comment_id） |
| comments[].user.user_id | `$.data.data.comments[].user.user_id` | 评论者用户 ID | user.md handler_user_profile |
| cursor | `$.data.data.cursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 视频不存在 | STOP | 0 | — |
| 空数据 | 该视频暂无评论 | 返回"暂无评论" | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 fetch_post_comment（Web API） |

---

### fetch_video_comment_replies — 获取评论回复（App V3）

**Full path:** `/api/v1/tiktok/app/v3/fetch_video_comment_replies`
**Method:** GET · **Risk:** low

#### 用途
获取指定评论的回复列表。需要 item_id（视频 ID）和 comment_id。

#### 何时使用 / 不使用
- ✅ 已知 comment_id，需要获取该评论的回复
- ❌ 想获取视频的一级评论 → fetch_video_comments

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| item_id | string | yes | 纯数字长整型 | 视频/作品 ID |
| comment_id | string | yes | 纯数字长整型 | 评论 ID，从 fetch_video_comments 获取 |
| cursor | integer | no | default=0 | 翻页游标 |
| count | integer | no | default=20 | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| cursor | `$.data.data.cursor` | 下一页游标 | 同端点翻页 |

---

### fetch_live_room_info — 获取直播间信息

**Full path:** `/api/v1/tiktok/app/v3/fetch_live_room_info`
**Method:** GET · **Risk:** low

#### 用途
获取指定直播间的详细数据。**直播链式调用的核心入口**——产出 anchor_id 供排行榜、商品列表等端点使用。

#### 何时使用 / 不使用
- ✅ 已知 room_id，需要获取直播间详情
- ✅ 链式起点：room_id → anchor_id
- ❌ 只有直播链接 → 先用 get_live_room_id 提取 room_id

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| room_id | string | yes | 纯数字 | 直播间 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| owner.id_str | `$.data.data.owner.id_str` | 主播 ID（anchor_id） | fetch_live_ranking_list / fetch_live_room_product_list |
| room_id | `$.data.data.room_id` | 直播间 ID（回显） | 复用 |
| owner.sec_uid | `$.data.data.owner.sec_uid` | 主播 sec_uid | user.md handler_user_profile |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 直播间不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_live_ranking_list — 获取直播间排行榜

**Full path:** `/api/v1/tiktok/app/v3/fetch_live_ranking_list`
**Method:** GET · **Risk:** low

#### 用途
获取直播间内观众的排行榜数据。需要 room_id 和 anchor_id。

#### 何时使用 / 不使用
- ✅ 用户想看直播间排行榜
- ❌ 想看全平台榜单 → fetch_live_daily_rank

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| room_id | string | yes | 纯数字 | 直播间 ID |
| anchor_id | string | yes | 纯数字 | 主播 ID，从 fetch_live_room_info 的 `$.data.data.owner.id_str` 获取 |

---

### check_live_room_online — 检测单个直播间是否在线

**Full path:** `/api/v1/tiktok/app/v3/check_live_room_online`
**Method:** GET · **Risk:** low

#### 用途
检测指定直播间是否在线。room_id 可通过 `get_live_room_id` 接口从直播间链接获取。

#### 何时使用 / 不使用
- ✅ 需要检测单个直播间在线状态
- ❌ 需要批量检测 → check_live_room_online_batch

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| room_id | string | yes | 纯数字 | 直播间 ID |

---

### check_live_room_online_batch — 批量检测直播间在线状态

**Full path:** `/api/v1/tiktok/app/v3/check_live_room_online_batch`
**Method:** POST · **Risk:** low

#### 用途
批量检测多个直播间是否在线，最多支持 50 个。room_id 可通过 `get_live_room_id` 获取。

#### 何时使用 / 不使用
- ✅ 需要同时检测多个直播间在线状态
- ❌ 只需检测一个 → check_live_room_online

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| room_ids | array[string] | yes | maxItems=50 | 直播间 ID 列表 |

---

### fetch_live_room_product_list — 获取直播间商品列表

**Full path:** `/api/v1/tiktok/app/v3/fetch_live_room_product_list`
**Method:** GET · **Risk:** low

#### 用途
获取直播间商品列表数据。需要 room_id 和 author_id（主播 ID）。

#### 何时使用 / 不使用
- ✅ 已知 room_id 和 author_id，需要直播间商品
- ❌ 只有 room_id → 先用 fetch_live_room_info 获取 author_id
- ❌ 需要 V2 版本 → fetch_live_room_product_list_v2

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| room_id | string | yes | 纯数字 | 直播间 ID |
| author_id | string | yes | 纯数字 | 主播 ID，从 fetch_live_room_info 的 `$.data.data.owner.id_str` 获取 |
| page_size | integer | no | default=15 | 每页数量 |
| offset | integer | no | default=0 | 翻页游标，每次翻页增加 15 |
| region | string | no | default=US | 地区代码，非 US 地区需携带 cookie |
| cookie | string | no | 敏感凭据 | 用户 cookie，**仅在用户明确授权时使用**，用于非 US 地区 |

> ⚠️ **参数获取链路**：get_live_room_id → fetch_live_room_info → `$.data.data.owner.id_str` 作为 author_id

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| products[].product_id | `$.data.data.products[].product_id` | 商品 ID | shop.md 相关端点 |

---

### fetch_live_room_product_list_v2 — 获取直播间商品列表 V2

**Full path:** `/api/v1/tiktok/app/v3/fetch_live_room_product_list_v2`
**Method:** GET · **Risk:** low

#### 用途
获取直播间商品列表 V2。参数和链路与 V1 相同。

#### 输入 (IN)
同 fetch_live_room_product_list

---

### fetch_live_daily_rank — 获取直播每日榜单

**Full path:** `/api/v1/tiktok/app/v3/fetch_live_daily_rank`
**Method:** GET · **Risk:** low

#### 用途
获取直播每日榜单数据，支持多种榜单类型（日榜、周榜、小时榜、带货榜、游戏榜等）。

#### 何时使用 / 不使用
- ✅ 用户想看直播各类排行榜
- ❌ 想看某个直播间的观众排行 → fetch_live_ranking_list

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| anchor_id | string | no | default=6952422426752205830 | 主播 ID，影响返回数据 |
| room_id | string | no | default=7380221319910312750 | 直播间 ID，影响返回数据 |
| rank_type | integer | no | enum: 详见下表 | 榜单类型，默认 8（日榜） |
| region_type | integer | no | default=1 | 地区类型 |
| gap_interval | integer | no | default=0 | 时间间隔，0=当天，-1=排名记录 |
| cookie | string | no | 敏感凭据 | 用户 cookie，接口不可用时使用 |

> **rank_type 枚举值**：
>
> | type | rankName | 分组 | 说明 |
> |------|----------|------|------|
> | 0 | hourly_rank | GIFT_RANK | 小时榜 |
> | 1 | weekly_rank | GIFT_RANK | 周榜 |
> | 5 | rookie_star_rank | GIFT_RANK | 新星榜 |
> | 6 | sale_rank | E_COMMERCE | 带货榜 |
> | 8 | daily_rank | GIFT_RANK | 日榜 |
> | 10 | weekly_game_rank | GAME_RANK | 周游戏榜 |
> | 11 | daily_game_rank | GAME_RANK | 日游戏榜 |
> | 12 | hall_of_fame_rank | GIFT_RANK | 名人堂 |
> | 13 | champion_tournament | GIFT_RANK | 冠军赛 |
> | 14 | daily_rookie_star_rank | GIFT_RANK | 日新星榜 |
> | 15 | fans_team_rank | GIFT_RANK | 粉丝团榜 |
> | 16 | ranking_league | GIFT_RANK | 排位联赛 |
> | 20 | pubg | GAME_RANK | PUBG 游戏榜 |
> | 21 | mlbb | GAME_RANK | MLBB 游戏榜 |
> | 22 | free_fire | GAME_RANK | Free Fire 游戏榜 |
> | 26 | collectibles | E_COMMERCE | 收藏品榜 |
> | 27 | beauty | E_COMMERCE | 美妆榜 |
> | 28 | women_wear | E_COMMERCE | 女装榜 |
> | 29 | sale_rank_daily | E_COMMERCE | 日带货榜 |

---

### fetch_post_comment — 获取视频评论列表（Web API）

**Full path:** `/api/v1/tiktok/web/fetch_post_comment`
**Method:** GET · **Risk:** low

#### 用途
通过 Web API 获取视频评论列表。支持 current_region 参数。

#### 何时使用 / 不使用
- ✅ 需要 Web API 特有数据或 current_region 参数时
- ❌ 不想处理 tt_chain_token → 用 App V3 的 fetch_video_comments

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | yes | 纯数字长整型 | 视频/作品 ID |
| cursor | integer | no | default=0 | 翻页游标 |
| count | integer | no | default=20 | 每页数量 |
| current_region | string | no | — | 当前地区，默认为空 |

> ⚠️ Web API 返回的视频 CDN 链接需 tt_chain_token。

---

### fetch_post_comment_reply — 获取评论回复（Web API）

**Full path:** `/api/v1/tiktok/web/fetch_post_comment_reply`
**Method:** GET · **Risk:** low

#### 用途
通过 Web API 获取评论回复列表。

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| item_id | string | yes | 纯数字长整型 | 视频/作品 ID |
| comment_id | string | yes | 纯数字长整型 | 评论 ID |
| cursor | integer | no | default=0 | 翻页游标 |
| count | integer | no | default=20 | 每页数量 |
| current_region | string | no | — | 当前地区 |

> ⚠️ Web API 返回的视频 CDN 链接需 tt_chain_token。

---

### get_live_room_id — 从直播间链接提取 room_id

**Full path:** `/api/v1/tiktok/web/get_live_room_id`
**Method:** GET · **Risk:** low

#### 用途
从 TikTok 直播间链接中提取 room_id。**URL → room_id 的链式入口**。支持短链接和长链接。

#### 何时使用 / 不使用
- ✅ 用户提供直播间链接但需要 room_id
- ✅ 链式起点：URL → room_id → fetch_live_room_info
- ❌ 已有 room_id → 直接用 fetch_live_room_info

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| live_room_url | string | yes | startsWith=`https://www.tiktok.com/@` 或 `https://vt.tiktok.com/` | 直播间链接，支持短链接和长链接 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| room_id | `$.data.data.room_id` | 直播间 ID | fetch_live_room_info / check_live_room_online / fetch_live_im_fetch |

---

### fetch_check_live_alive — 检测直播间开播状态（Web API）

**Full path:** `/api/v1/tiktok/web/fetch_check_live_alive`
**Method:** GET · **Risk:** low

#### 用途
检测直播间开播状态。如直播间不存在或已下播，返回空。

#### 何时使用 / 不使用
- ✅ 需要检测单个直播间是否开播
- ❌ 需要批量检测 → fetch_batch_check_live_alive

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| room_id | string | yes | 纯数字 | 直播间 ID |

---

### fetch_batch_check_live_alive — 批量检测开播状态（Web API）

**Full path:** `/api/v1/tiktok/web/fetch_batch_check_live_alive`
**Method:** GET · **Risk:** low

#### 用途
批量检测直播间开播状态，最多支持 50 个。用英文逗号分隔 room_id。如某直播间不存在或已下播，对应位置返回空或 null。

#### 何时使用 / 不使用
- ✅ 需要同时检测多个直播间开播状态
- ❌ 只需检测一个 → fetch_check_live_alive

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| room_ids | string | yes | 逗号分隔，maxItems=50 | 直播间 ID 列表，如 `7530611486784277278,7530633767468288782` |

---

### fetch_tiktok_live_data — 通过直播链接获取直播间信息

**Full path:** `/api/v1/tiktok/web/fetch_tiktok_live_data`
**Method:** GET · **Risk:** low

#### 用途
通过直播链接获取直播间信息。**可获取离线直播间信息**（已下播的直播间）。

#### 何时使用 / 不使用
- ✅ 需要获取已下播直播间的信息
- ✅ 只知直播链接不知 room_id
- ❌ 已有 room_id 且直播间在线 → fetch_live_room_info（App V3，更稳定）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| live_room_url | string | yes | startsWith=`https://www.tiktok.com/@` | 直播间链接 |

---

### fetch_live_im_fetch — 获取直播间弹幕参数

**Full path:** `/api/v1/tiktok/web/fetch_live_im_fetch`
**Method:** GET · **Risk:** low

#### 用途
获取 TikTok 直播间弹幕连接参数。用于建立 WebSocket 连接获取实时弹幕数据。

#### 何时使用 / 不使用
- ✅ 需要获取直播间弹幕参数
- ❌ 想直接获取弹幕文本 → 需结合 WebSocket 客户端使用

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| room_id | string | yes | 纯数字 | 直播间 ID |
| user_unique_id | string | no | — | 用户唯一 ID |
| resp_content_type | string | no | enum: [protobuf, json], default=protobuf | 响应格式 |

---

### generate_wss_xb_signature — 生成 WSS X-Bogus 签名

**Full path:** `/api/v1/tiktok/web/generate_wss_xb_signature`
**Method:** GET · **Risk:** low

#### 用途
生成 TikTok 直播 WSS 连接所需的 X-Bogus 签名。配合 fetch_live_im_fetch 使用。

#### 何时使用 / 不使用
- ✅ 需要建立 WSS 连接获取弹幕时
- ❌ 不需要弹幕功能 → 不用调用

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_agent | string | no | — | 用户浏览器代理，不填则使用默认 UA |

---

### tiktok_live_room — 提取直播间弹幕 ❌ 已废弃

**Full path:** `/api/v1/tiktok/web/tiktok_live_room`
**Method:** GET · **Risk:** low

#### 用途
~~提取直播间弹幕~~。**此接口已停止线上服务，禁止调用。** 如需弹幕功能，请使用 `fetch_live_im_fetch`。

#### 何时使用 / 不使用
- ❌ **已废弃，不要调用**
- ✅ 如需弹幕 → 使用 fetch_live_im_fetch + generate_wss_xb_signature

---

### fetch_live_gift_list — 获取直播间礼物列表

**Full path:** `/api/v1/tiktok/web/fetch_live_gift_list`
**Method:** GET · **Risk:** low

#### 用途
获取直播间礼物列表。room_id 为可选参数，不传则获取通用礼物列表。

#### 何时使用 / 不使用
- ✅ 用户想看直播间可用的礼物列表
- ❌ 想根据 Gift ID 查名称 → fetch_gift_name_by_id

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| room_id | string | no | 纯数字 | 直播间 ID，可选，不传则获取通用礼物列表 |

> ⚠️ Web API 返回的视频 CDN 链接需 tt_chain_token。

---

### fetch_gift_name_by_id — 根据 Gift ID 查询礼物名称

**Full path:** `/api/v1/tiktok/web/fetch_gift_name_by_id`
**Method:** POST · **Risk:** low

#### 用途
根据 TikTok 的 Gift ID 查询对应的礼物名称。

#### 何时使用 / 不使用
- ✅ 已知 Gift ID，需要查询名称
- ❌ 需要批量查询 → fetch_gift_names_by_ids

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| gift_id | string | yes | — | 礼物 ID |

---

### fetch_gift_names_by_ids — 批量查询礼物名称

**Full path:** `/api/v1/tiktok/web/fetch_gift_names_by_ids`
**Method:** POST · **Risk:** low

#### 用途
批量查询多个 TikTok Gift ID 对应的礼物名称。

#### 何时使用 / 不使用
- ✅ 需要批量查询多个 Gift ID 的名称
- ❌ 只需查询一个 → fetch_gift_name_by_id

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| gift_ids | array[string] | yes | — | 礼物 ID 列表 |
