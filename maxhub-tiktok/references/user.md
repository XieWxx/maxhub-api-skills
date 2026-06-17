# TikTok User / TikTok 用户

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
用户资料（App V3 + Web API）、用户作品/喜欢/转发/收藏、粉丝/关注列表及搜索、音乐列表、直播详情、二维码分享、APP 唤起、带货创作者信息与橱窗、用户 ID 提取。**user_id 与 sec_user_id 多在本文件首步产出**，是视频、评论、搜索、分析等链式调用的常见起点。

> 🔒 **Security:** All requests transmit your `MAXHUB_API_KEY` and query data to `https://www.aconfig.cn`. Never expose API keys in logs, prompts, or client-side storage. Web API endpoints return video CDN links requiring `tt_chain_token` Cookie for access. `fetch_user_collect` requires user cookie — use only with explicit user authorization.

> ⚠️ **参数名差异**：App V3 使用 `sec_user_id`（snake_case），Web API 使用 `secUid`（camelCase），两者值相同但参数名不同。跨 API 链式调用时必须注意参数名转换。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| get_user_id_and_sec_user_id_by_username | ⭐⭐⭐ 首选 | 用 username 获取 user_id 和 sec_user_id（**用户名→ID 入口**） | GET | /api/v1/tiktok/app/v3/get_user_id_and_sec_user_id_by_username | low |
| handler_user_profile | ⭐⭐⭐ 首选 | 用 sec_user_id/user_id/unique_id 获取用户信息 | GET | /api/v1/tiktok/app/v3/handler_user_profile | low |
| fetch_webcast_user_info | ⭐⭐ 条件 | 获取 Webcast 用户信息（直播用户专用） | GET | /api/v1/tiktok/app/v3/fetch_webcast_user_info | low |
| fetch_user_country_by_username | ⭐⭐ 条件 | 用 username 获取用户国家地区 | GET | /api/v1/tiktok/app/v3/fetch_user_country_by_username | low |
| fetch_similar_user_recommendations | ⭐⭐ 条件 | 获取类似用户推荐 | GET | /api/v1/tiktok/app/v3/fetch_similar_user_recommendations | low |
| fetch_user_post_videos_v3 | ⭐⭐⭐ 首选 | 获取用户主页作品 V3（精简数据，更快速） | GET | /api/v1/tiktok/app/v3/fetch_user_post_videos_v3 | low |
| fetch_user_post_videos_v2 | ⭐⭐ 降级 | 获取用户主页作品 V2 | GET | /api/v1/tiktok/app/v3/fetch_user_post_videos_v2 | low |
| fetch_user_post_videos | ⭐ 降级 | 获取用户主页作品 V1（支持 region 参数） | GET | /api/v1/tiktok/app/v3/fetch_user_post_videos | low |
| fetch_user_repost_videos | ⭐⭐ 条件 | 获取用户转发作品 | GET | /api/v1/tiktok/app/v3/fetch_user_repost_videos | low |
| fetch_user_like_videos | ⭐⭐ 条件 | 获取用户喜欢作品（App V3） | GET | /api/v1/tiktok/app/v3/fetch_user_like_videos | low |
| fetch_user_follower_list | ⭐⭐ 条件 | 获取用户粉丝列表（App V3） | GET | /api/v1/tiktok/app/v3/fetch_user_follower_list | low |
| fetch_user_following_list | ⭐⭐ 条件 | 获取用户关注列表（App V3） | GET | /api/v1/tiktok/app/v3/fetch_user_following_list | low |
| search_follower_list | ⭐⭐ 条件 | 搜索粉丝列表（按关键词） | GET | /api/v1/tiktok/app/v3/search_follower_list | low |
| search_following_list | ⭐⭐ 条件 | 搜索关注列表（按关键词） | GET | /api/v1/tiktok/app/v3/search_following_list | low |
| fetch_user_music_list | ⭐⭐ 条件 | 获取用户音乐列表 | GET | /api/v1/tiktok/app/v3/fetch_user_music_list | low |
| fetch_share_qr_code | ⭐ 条件 | 获取分享二维码 | GET | /api/v1/tiktok/app/v3/fetch_share_qr_code | low |
| open_tiktok_app_to_user_profile | ⭐ 条件 | 唤起 APP 跳转用户主页 | GET | /api/v1/tiktok/app/v3/open_tiktok_app_to_user_profile | low |
| open_tiktok_app_to_send_private_message | ⭐ 条件 | 唤起 APP 发送私信 | GET | /api/v1/tiktok/app/v3/open_tiktok_app_to_send_private_message | low |
| fetch_creator_info | ⭐⭐ 条件 | 获取带货创作者信息 | GET | /api/v1/tiktok/app/v3/fetch_creator_info | low |
| fetch_creator_showcase_product_list | ⭐⭐ 条件 | 获取创作者橱窗商品列表 | GET | /api/v1/tiktok/app/v3/fetch_creator_showcase_product_list | low |
| fetch_user_profile | ⭐⭐⭐ 首选 | 获取用户资料（Web API） | GET | /api/v1/tiktok/web/fetch_user_profile | low |
| fetch_user_post | ⭐⭐ 条件 | 获取用户作品列表（Web API，需 tt_chain_token） | GET | /api/v1/tiktok/web/fetch_user_post | low |
| fetch_user_repost | ⭐⭐ 条件 | 获取用户转发作品（Web API） | GET | /api/v1/tiktok/web/fetch_user_repost | low |
| fetch_user_like | ⭐⭐ 条件 | 获取用户点赞列表（Web API，需公开状态） | GET | /api/v1/tiktok/web/fetch_user_like | low |
| fetch_user_collect | ⭐ 条件 | 获取用户收藏列表（需 cookie，仅自己） | GET | /api/v1/tiktok/web/fetch_user_collect | low |
| fetch_user_play_list | ⭐⭐ 条件 | 获取用户播放列表（Web API） | GET | /api/v1/tiktok/web/fetch_user_play_list | low |
| fetch_user_fans | ⭐⭐ 条件 | 获取用户粉丝列表（Web API） | GET | /api/v1/tiktok/web/fetch_user_fans | low |
| fetch_user_follow | ⭐⭐ 条件 | 获取用户关注列表（Web API） | GET | /api/v1/tiktok/web/fetch_user_follow | low |
| fetch_user_live_detail | ⭐⭐ 条件 | 获取用户直播详情（Web API） | GET | /api/v1/tiktok/web/fetch_user_live_detail | low |
| get_user_id | ⭐⭐⭐ 首选 | 从用户主页链接提取 user_id | GET | /api/v1/tiktok/web/get_user_id | low |
| get_sec_user_id | ⭐⭐⭐ 首选 | 从用户主页链接提取 sec_user_id | GET | /api/v1/tiktok/web/get_sec_user_id | low |
| get_all_sec_user_id | ⭐⭐ 条件 | 批量提取 sec_user_id（最多 10 个） | POST | /api/v1/tiktok/web/get_all_sec_user_id | low |
| get_unique_id | ⭐⭐ 条件 | 从用户主页链接提取 unique_id | GET | /api/v1/tiktok/web/get_unique_id | low |
| get_all_unique_id | ⭐⭐ 条件 | 批量提取 unique_id（最多 20 个） | POST | /api/v1/tiktok/web/get_all_unique_id | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 用户名 → 用户资料 | get_user_id_and_sec_user_id_by_username → handler_user_profile | `$.data.data.sec_user_id` → `sec_user_id` | 第 1 步空：STOP，告知用户名未命中 |
| 用户名 → 用户作品 | get_user_id_and_sec_user_id_by_username → fetch_user_post_videos_v3 | `$.data.data.sec_user_id` → `sec_user_id` | 第 1 步空：STOP；第 2 步空：返回 ID + "作品暂不可取" |
| 用户名 → 粉丝/关注 | get_user_id_and_sec_user_id_by_username → fetch_user_follower_list + fetch_user_following_list（可并行） | `$.data.data.user_id` → `user_id` | 任一失败：返回另一份 + 告知缺失 |
| URL → 用户资料 | get_sec_user_id → handler_user_profile | `$.data.data.sec_user_id` → `sec_user_id` | 第 1 步失败：STOP |
| URL → 用户作品 | get_sec_user_id → fetch_user_post_videos_v3 | `$.data.data.sec_user_id` → `sec_user_id` | 同上 |
| 用户资料 → 创作者信息 | handler_user_profile → fetch_creator_info | `$.data.data.user.uid` → `creator_uid` | 第 2 步空：返回资料 + "非带货创作者" |
| 创作者信息 → 橱窗商品 | fetch_creator_info → fetch_creator_showcase_product_list | `$.data.data.creator_info.sec_user_id` → `kol_id` | 第 2 步空：返回创作者信息 + "橱窗暂无商品" |
| 用户资料 → 直播详情 | fetch_user_profile(Web) → fetch_user_live_detail | `$.data.data.user.uniqueId` → `uniqueId` | 第 2 步空：返回资料 + "当前未直播" |
| 用户作品 → 视频详情 | fetch_user_post_videos_v3 → 跳转 `video.md` fetch_one_video_v3 | `$.data.data.aweme_list[].aweme_id` → `aweme_id` | 跨文件链路 |
| 用户资料 → 类似推荐 | handler_user_profile → fetch_similar_user_recommendations | `$.data.data.user.sec_uid` → `sec_uid` | 第 2 步空：返回资料 + "暂无推荐" |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`video.md` 的 `fetch_one_video_v3` 输出 `$.data.data.author.sec_uid` → 本文件 App V3 端点的 `sec_user_id`
- **流入本文件**：`video.md` 的 `fetch_one_video_v3` 输出 `$.data.data.author.uid` → 本文件 App V3 端点的 `user_id`
- **流入本文件**：`search.md` 的搜索端点输出 `user_id`/`sec_user_id` → 本文件
- **流出本文件**：`fetch_user_post_videos_v3` 的 `$.data.data.aweme_list[].aweme_id` → `video.md` 多端点
- **流出本文件**：`handler_user_profile` 的 `$.data.data.user.uid` → `creator.md` / `shop.md`
- **流出本文件**：`get_user_id_and_sec_user_id_by_username` 的 `$.data.data.user_id` → `comments.md` 部分端点

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项；通用规则见此处。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**
- **禁止**：❌ 改路径段（v3→v2 试探）❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改 user_id 重试

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP
- **禁止**：❌ 切换端点 ❌ 凭空加参数 ❌ 把 sec_user_id 当 secUid 传（或反之）

### Web API 特有：tt_chain_token CDN 403
- Web API 端点返回的视频 CDN 链接需携带 `Cookie: tt_chain_token={tt_chain_token}`
- 如遇 403 → 提示用户携带 Cookie，或**降级**到 App V3 接口（无此限制）

### Web API 特有：fetch_user_collect 需要 cookie
- `fetch_user_collect` 必须提供用户 cookie，且仅能获取自己的收藏列表
- cookie 属于敏感凭据，仅在用户明确授权时使用

### App V3 特有：oneOf 参数组
- `handler_user_profile`：sec_user_id / user_id / unique_id 三选一，优先级 sec_user_id > user_id > unique_id
- `fetch_user_follower_list` / `fetch_user_following_list`：user_id / sec_user_id 二选一
- `fetch_user_post_videos` 系列：sec_user_id / unique_id 二选一，优先使用 sec_user_id

### 鉴权错误（401）→ STOP，提示用户检查 API Key
### 余额 / 付费（402）→ STOP，告知用户充值
### 权限错误（403）→ STOP，按子场景告知用户
### 限流（429）→ 读 Retry-After 退避；最多重试 2 次
### 上游故障（500/502/503/504）→ 等 3 秒重试 1 次 → 走端点替换
### 业务错误（HTTP 200 且 `code != 0`）→ 读 `message_zh` 报告，不重试

---

## 端点详情

### get_user_id_and_sec_user_id_by_username — 用用户名获取 user_id 和 sec_user_id

**Full path:** `/api/v1/tiktok/app/v3/get_user_id_and_sec_user_id_by_username`
**Method:** GET · **Risk:** low

#### 用途
通过用户名（username）获取用户的 user_id 和 sec_user_id。**已知用户名时的链式入口**——把 username 转换为 user_id / sec_user_id，供后续 user 系端点使用。

#### 何时使用 / 不使用
- ✅ 用户提供用户名但未提供 user_id 或 sec_user_id
- ✅ 链式起点：username → user_id / sec_user_id
- ❌ 已有 sec_user_id → 直接用 handler_user_profile
- ❌ 已有用户主页 URL → 用 get_sec_user_id 或 get_user_id

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| username | string | yes | — | 用户名，如 `tiktok`（即主页链接 `https://www.tiktok.com/@tiktok` 中的 `tiktok`） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user_id | `$.data.data.user_id` | 用户 ID（纯数字） | fetch_user_follower_list / fetch_user_following_list / fetch_user_repost_videos / search_follower_list / search_following_list |
| sec_user_id | `$.data.data.sec_user_id` | 用户 sec_user_id（混合字母数字） | handler_user_profile / fetch_user_post_videos_v3 / fetch_user_like_videos / fetch_user_follower_list |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空结果 | 用户名未命中 | STOP，告知用户未找到 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### handler_user_profile — 获取指定用户的信息

**Full path:** `/api/v1/tiktok/app/v3/handler_user_profile`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的完整信息（昵称、头像、签名、粉丝数等）。**user 系链式调用的常见验证步**。

#### 何时使用 / 不使用
- ✅ 已知 sec_user_id / user_id / unique_id，想看用户主页信息
- ✅ 链式中验证 ID 是否有效
- ❌ 想看用户作品 → fetch_user_post_videos_v3
- ❌ 只有 username → 先用 get_user_id_and_sec_user_id_by_username

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_user_id | string | oneOf(A) | 混合字母数字 | 用户 sec_user_id，**优先使用** |
| user_id | string | oneOf(A) | 纯数字 | 用户 uid，使用时保持 sec_user_id 和 unique_id 为空 |
| unique_id | string | oneOf(A) | — | 用户 unique_id（即用户名），使用时保持 sec_user_id 和 user_id 为空 |

> ⚠️ **oneOf(A)**：sec_user_id / user_id / unique_id 三选一，至少填一个。优先级：sec_user_id > user_id > unique_id，优先级越高速度越快。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user.uid | `$.data.data.user.uid` | 用户 ID（纯数字） | fetch_user_follower_list / fetch_user_repost_videos / search_follower_list / fetch_creator_info |
| user.sec_uid | `$.data.data.user.sec_uid` | 用户 sec_uid | fetch_similar_user_recommendations / fetch_user_music_list |
| user.unique_id | `$.data.data.user.unique_id` | 用户名 | fetch_user_country_by_username |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在/已注销 | STOP | 0 | **降级**：get_user_id_and_sec_user_id_by_username 取候选（如有 username） |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### fetch_webcast_user_info — 获取 Webcast 用户信息

**Full path:** `/api/v1/tiktok/app/v3/fetch_webcast_user_info`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的 Webcast（直播）信息。专用于直播场景下的用户数据获取。

#### 何时使用 / 不使用
- ✅ 需要获取用户的直播相关信息
- ❌ 只需普通用户资料 → handler_user_profile（更全面）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_user_id | string | oneOf(A) | 混合字母数字 | 用户 sec_user_id，**优先使用** |
| user_id | string | oneOf(A) | 纯数字 | 用户 uid，使用时保持 sec_user_id 为空 |

> ⚠️ **oneOf(A)**：sec_user_id / user_id 二选一，至少填一个。优先级：sec_user_id > user_id。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user.uid | `$.data.data.user.uid` | 用户 ID | 同 handler_user_profile |

---

### fetch_user_country_by_username — 通过用户名获取用户国家地区

**Full path:** `/api/v1/tiktok/app/v3/fetch_user_country_by_username`
**Method:** GET · **Risk:** low

#### 用途
通过用户名获取用户账号的国家/地区信息。轻量级端点，仅需 username 即可获取国家代码。

#### 何时使用 / 不使用
- ✅ 只需知道用户所在国家/地区
- ❌ 需要完整用户资料 → handler_user_profile

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| username | string | yes | — | 用户名，如 `tiktok` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| country | `$.data.data.country` | 国家代码（如 US、CN） | 用于 region 参数传递 |
| user_id | `$.data.data.user_id` | 用户 ID | 同 handler_user_profile |
| sec_user_id | `$.data.data.sec_user_id` | 用户 sec_user_id | 同 handler_user_profile |

---

### fetch_similar_user_recommendations — 获取类似用户推荐

**Full path:** `/api/v1/tiktok/app/v3/fetch_similar_user_recommendations`
**Method:** GET · **Risk:** low

#### 用途
获取与指定用户相似的用户推荐列表。支持分页。

#### 何时使用 / 不使用
- ✅ 用户想看"和这个人相似的其他用户"
- ❌ 想看粉丝/关注列表 → fetch_user_follower_list / fetch_user_following_list

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_uid | string | yes | 混合字母数字 | 用户 sec_uid |
| page_token | string | no | — | 分页标记，首次不传，后续传上一次响应的 next_page_token |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| next_page_token | `$.data.data.next_page_token` | 下一页标记 | 同端点翻页 |
| users[].sec_uid | `$.data.data.users[].sec_uid` | 推荐用户 sec_uid | handler_user_profile |

---

### fetch_user_post_videos_v3 — 获取用户主页作品 V3（精简数据，更快速）

**Full path:** `/api/v1/tiktok/app/v3/fetch_user_post_videos_v3`
**Method:** GET · **Risk:** low

#### 用途
获取用户主页作品数据 V3，返回精简数据，速度更快。**获取用户作品的首选端点**。

#### 何时使用 / 不使用
- ✅ 已知 sec_user_id，需要获取用户作品列表
- ✅ 链式产出 aweme_id 给 `video.md`
- ❌ 需要完整数据（非精简）→ fetch_user_post_videos_v2
- ❌ 需要 region 参数 → fetch_user_post_videos（V1）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_user_id | string | oneOf(A) | 混合字母数字 | 用户 sec_user_id，**优先使用** |
| unique_id | string | oneOf(A) | — | 用户 unique_id（用户名），sec_user_id 为空时使用 |
| max_cursor | integer | no | default=0 | 翻页游标，第一页为 0，后续为上次响应的 max_cursor |
| count | integer | no | default=20 | 每页数量，建议保持默认值 |
| sort_type | integer | no | enum: [0, 1] | 排序类型：0=最新 1=热门 |

> ⚠️ **oneOf(A)**：sec_user_id / unique_id 二选一，优先级：sec_user_id > unique_id。建议只使用 sec_user_id。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.data.aweme_list[].aweme_id` | 视频 ID | video.md 多端点 |
| max_cursor | `$.data.data.max_cursor` | 下一页游标 | 同端点翻页 |
| has_more | `$.data.data.has_more` | 是否还有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |
| 空数据 | 该用户暂无作品 | 返回"暂无作品" | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 fetch_user_post_videos_v2 |

---

### fetch_user_post_videos_v2 — 获取用户主页作品 V2

**Full path:** `/api/v1/tiktok/app/v3/fetch_user_post_videos_v2`
**Method:** GET · **Risk:** low

#### 用途
获取用户主页作品数据 V2，返回完整数据。作为 V3 的降级备选。

#### 何时使用 / 不使用
- ✅ V3 接口失败时的降级选择
- ✅ 需要完整数据（非精简）
- ❌ 需要更快速度 → fetch_user_post_videos_v3

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_user_id | string | oneOf(A) | 混合字母数字 | 用户 sec_user_id，**优先使用** |
| unique_id | string | oneOf(A) | — | 用户 unique_id（用户名） |
| max_cursor | integer | no | default=0 | 翻页游标 |
| count | integer | no | default=20 | 每页数量 |
| sort_type | integer | no | enum: [0, 1] | 排序类型：0=最新 1=热门 |

> ⚠️ **oneOf(A)**：sec_user_id / unique_id 二选一，优先级：sec_user_id > unique_id。

#### 输出可链式字段 (OUT)
同 fetch_user_post_videos_v3

#### 错误处理 (ERR)
同 fetch_user_post_videos_v3，降级方向为 fetch_user_post_videos（V1）

---

### fetch_user_post_videos — 获取用户主页作品 V1（支持 region 参数）

**Full path:** `/api/v1/tiktok/app/v3/fetch_user_post_videos`
**Method:** GET · **Risk:** low

#### 用途
获取用户主页作品数据 V1。唯一支持 region 参数的版本，可指定国家/地区获取数据。

#### 何时使用 / 不使用
- ✅ 需要指定国家/地区获取用户作品
- ✅ V3/V2 均失败时的最终降级
- ❌ 不需要 region → 优先用 V3

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_user_id | string | oneOf(A) | 混合字母数字 | 用户 sec_user_id，**优先使用** |
| unique_id | string | oneOf(A) | — | 用户 unique_id（用户名） |
| max_cursor | integer | no | default=0 | 翻页游标 |
| count | integer | no | default=20 | 每页数量 |
| sort_type | integer | no | enum: [0, 1] | 排序类型：0=最新 1=热门 |
| region | string | no | ISO 3166-1 alpha-2 | 国家代码，默认 US，如 US、GB、FR、CN、JP、SG、VN 等 |

> ⚠️ **oneOf(A)**：sec_user_id / unique_id 二选一，优先级：sec_user_id > unique_id。

#### 输出可链式字段 (OUT)
同 fetch_user_post_videos_v3

---

### fetch_user_repost_videos — 获取用户转发作品

**Full path:** `/api/v1/tiktok/app/v3/fetch_user_repost_videos`
**Method:** GET · **Risk:** low

#### 用途
获取用户转发的作品数据。需要 user_id（纯数字），可通过 handler_user_profile 获取。

#### 何时使用 / 不使用
- ✅ 用户想看某用户转发的作品
- ❌ 想看用户原创作品 → fetch_user_post_videos_v3
- ❌ 只有 sec_user_id 没有 user_id → 先用 handler_user_profile 获取 user_id

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | integer | yes | 纯数字 | 用户 ID，可通过 handler_user_profile 获取（响应中关键字为 uid） |
| offset | integer | no | default=0 | 偏移量 |
| count | integer | no | default=21 | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.data.aweme_list[].aweme_id` | 视频 ID | video.md 多端点 |

---

### fetch_user_like_videos — 获取用户喜欢作品

**Full path:** `/api/v1/tiktok/app/v3/fetch_user_like_videos`
**Method:** GET · **Risk:** low

#### 用途
获取用户喜欢（点赞）的作品数据。需要 sec_user_id。

#### 何时使用 / 不使用
- ✅ 用户想看某用户喜欢的作品
- ❌ 想看用户发布的作品 → fetch_user_post_videos_v3

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_user_id | string | yes | 混合字母数字 | 用户 sec_user_id |
| max_cursor | integer | no | default=0 | 翻页游标，第一页为 0，后续为上次响应的 max_cursor |
| counts | integer | no | default=20 | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.data.aweme_list[].aweme_id` | 视频 ID | video.md 多端点 |
| max_cursor | `$.data.data.max_cursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 业务 code≠0 | 喜欢列表未公开 | 告知用户该列表不可查看 | 0 | — |

---

### fetch_user_follower_list — 获取用户粉丝列表（App V3）

**Full path:** `/api/v1/tiktok/app/v3/fetch_user_follower_list`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的粉丝列表。支持分页。

#### 何时使用 / 不使用
- ✅ 用户想看某用户的粉丝列表
- ❌ 想在粉丝中搜索特定用户 → search_follower_list
- ❌ 想看关注列表 → fetch_user_following_list

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | oneOf(A) | 纯数字 | 用户 ID（纯数字版本） |
| sec_user_id | string | oneOf(A) | 混合字母数字 | 用户 sec_user_id（混合字母数字版本） |
| count | integer | no | default=20, max=20 | 每页数量，不要超过 20 |
| min_time | integer | no | default=0 | 翻页时间戳，首次为 0，后续为上次响应的 min_time |
| page_token | string | no | — | 翻页 token，首次为空，后续为上次响应的 page_token |

> ⚠️ **oneOf(A)**：user_id / sec_user_id 二选一，至少填一个。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| followers[].user_id | `$.data.data.followers[].user_id` | 粉丝用户 ID | handler_user_profile |
| followers[].sec_user_id | `$.data.data.followers[].sec_user_id` | 粉丝 sec_user_id | handler_user_profile |
| min_time | `$.data.data.min_time` | 下一页时间戳 | 同端点翻页 |
| page_token | `$.data.data.page_token` | 下一页 token | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 业务 code≠0 | 隐私设置不可见 | 告知用户该列表不可查看 | 0 | — |

---

### fetch_user_following_list — 获取用户关注列表（App V3）

**Full path:** `/api/v1/tiktok/app/v3/fetch_user_following_list`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的关注列表。支持分页。

#### 何时使用 / 不使用
- ✅ 用户想看某用户的关注列表
- ❌ 想在关注中搜索特定用户 → search_following_list
- ❌ 想看粉丝列表 → fetch_user_follower_list

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | oneOf(A) | 纯数字 | 用户 ID（纯数字版本） |
| sec_user_id | string | oneOf(A) | 混合字母数字 | 用户 sec_user_id（混合字母数字版本） |
| count | integer | no | default=20, max=20 | 每页数量，不要超过 20 |
| min_time | integer | no | default=0 | 翻页时间戳，首次为 0，后续为上次响应的 min_time |
| page_token | string | no | — | 翻页 token，首次为空，后续为上次响应的 page_token |

> ⚠️ **oneOf(A)**：user_id / sec_user_id 二选一，至少填一个。

#### 输出可链式字段 (OUT)
同 fetch_user_follower_list 结构（followers → followings）

---

### search_follower_list — 搜索粉丝列表

**Full path:** `/api/v1/tiktok/app/v3/search_follower_list`
**Method:** GET · **Risk:** low

#### 用途
在指定用户的粉丝列表中按昵称关键词搜索。用于查找某用户的粉丝中是否有特定昵称的用户。

#### 何时使用 / 不使用
- ✅ 用户想在某人的粉丝中查找特定昵称
- ❌ 想看完整粉丝列表 → fetch_user_follower_list

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | 纯数字 | 用户 ID，可通过 handler_user_profile 获取 |
| keyword | string | yes | — | 搜索关键词，用户昵称包含该关键词即可匹配 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| users[].user_id | `$.data.data.users[].user_id` | 匹配粉丝的用户 ID | handler_user_profile |

---

### search_following_list — 搜索关注列表

**Full path:** `/api/v1/tiktok/app/v3/search_following_list`
**Method:** GET · **Risk:** low

#### 用途
在指定用户的关注列表中按昵称关键词搜索。用于查找某用户的关注中是否有特定昵称的用户。

#### 何时使用 / 不使用
- ✅ 用户想在某人的关注中查找特定昵称
- ❌ 想看完整关注列表 → fetch_user_following_list

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | 纯数字 | 用户 ID，可通过 handler_user_profile 获取 |
| keyword | string | yes | — | 搜索关键词，用户昵称包含该关键词即可匹配 |

#### 输出可链式字段 (OUT)
同 search_follower_list 结构

---

### fetch_user_music_list — 获取用户音乐列表

**Full path:** `/api/v1/tiktok/app/v3/fetch_user_music_list`
**Method:** GET · **Risk:** low

#### 用途
获取用户使用过的音乐列表数据。

#### 何时使用 / 不使用
- ✅ 用户想看某用户使用过的音乐
- ❌ 想看用户作品 → fetch_user_post_videos_v3

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_uid | string | yes | 混合字母数字 | 用户 sec_uid |
| cursor | integer | no | default=0 | 翻页游标，第一页为 0，后续为上次响应的 cursor |
| count | integer | no | default=10 | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| cursor | `$.data.data.cursor` | 下一页游标 | 同端点翻页 |

---

### fetch_share_qr_code — 获取分享二维码

**Full path:** `/api/v1/tiktok/app/v3/fetch_share_qr_code`
**Method:** GET · **Risk:** low

#### 用途
获取分享二维码图片。当前支持用户 uid 作为参数生成个人主页二维码。

#### 何时使用 / 不使用
- ✅ 用户需要生成个人主页分享二维码
- ❌ 想生成视频分享二维码 → 不支持

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| object_id | string | yes | 纯数字 | 对象 ID，当前支持用户 uid |
| schema_type | integer | no | default=4 | 模式类型 |

---

### open_tiktok_app_to_user_profile — 唤起 APP 跳转用户主页

**Full path:** `/api/v1/tiktok/app/v3/open_tiktok_app_to_user_profile`
**Method:** GET · **Risk:** low

#### 用途
生成 TikTok 分享链接，唤起 TikTok APP 跳转到指定用户主页。注意：如未能跳转，需确保 APP 已在后台运行。

#### 何时使用 / 不使用
- ✅ 用户需要生成 APP 跳转链接
- ❌ 仅需查看用户资料 → handler_user_profile

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | 纯数字 | 用户 ID，从用户主页接口中获取 |

---

### open_tiktok_app_to_send_private_message — 唤起 APP 发送私信

> 🚨 **RESTRICTED — private_messaging**：private-message deep-link
>
> 此端点**默认禁用**。仅在用户当次明确授权后调用，且必须告知合规风险。详见 SKILL.md 「高风险能力清单」章节。


**Full path:** `/api/v1/tiktok/app/v3/open_tiktok_app_to_send_private_message`
**Method:** GET · **Risk:** low

#### 用途
生成 TikTok 分享链接，唤起 TikTok APP 给指定用户发送私信。注意：如未能跳转，需确保 APP 已在后台运行。

#### 何时使用 / 不使用
- ✅ 用户需要生成私信跳转链接
- ❌ 仅需查看用户资料 → handler_user_profile

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | 纯数字 | 用户 ID，从用户主页接口中获取 |

---

### fetch_creator_info — 获取带货创作者信息

**Full path:** `/api/v1/tiktok/app/v3/fetch_creator_info`
**Method:** GET · **Risk:** low

#### 用途
获取带货创作者信息，包括基本信息、粉丝数、橱窗商品数量、带货直播间等。

#### 何时使用 / 不使用
- ✅ 用户想看带货创作者的详细信息
- ✅ 链式产出 sec_user_id 给 fetch_creator_showcase_product_list
- ❌ 想看普通用户资料 → handler_user_profile
- ❌ 想看橱窗商品 → fetch_creator_showcase_product_list

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| creator_uid | string | yes | 纯数字 | 创作者 uid |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| creator_info.creator_id | `$.data.data.creator_info.creator_id` | 创作者 ID | 回显 |
| creator_info.sec_user_id | `$.data.data.creator_info.sec_user_id` | 创作者 sec_user_id | fetch_creator_showcase_product_list（作为 kol_id） |
| creator_info.followers_info.count | `$.data.data.creator_info.followers_info.count` | 粉丝数 | 仅展示 |
| creator_info.product_count_info.count | `$.data.data.creator_info.product_count_info.count` | 橱窗商品数 | 用于决定是否调用 fetch_creator_showcase_product_list |
| live_info.room_id | `$.data.data.live_info.room_id` | 直播间 ID | 跳转 live 相关端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 创作者不存在 | STOP | 0 | — |
| 业务 code≠0 | 非带货创作者 | 告知用户 | 0 | — |

---

### fetch_creator_showcase_product_list — 获取创作者橱窗商品列表

**Full path:** `/api/v1/tiktok/app/v3/fetch_creator_showcase_product_list`
**Method:** GET · **Risk:** low

#### 用途
获取带货创作者橱窗中的商品列表。需要创作者的 sec_user_id 作为 kol_id。

#### 何时使用 / 不使用
- ✅ 已知创作者 sec_user_id，想看其橱窗商品
- ❌ 想看创作者信息 → fetch_creator_info
- ❌ 只有 creator_uid 没有 sec_user_id → 先用 fetch_creator_info 获取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| kol_id | string | yes | 混合字母数字 | 创作者的 sec_user_id |
| count | integer | no | default=20 | 每页数量 |
| next_scroll_param | string | no | — | 翻页参数，第一页为空字符串，后续为上次响应的 next_scroll_param |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| next_scroll_param | `$.data.data.next_scroll_param` | 下一页参数 | 同端点翻页 |
| products[].product_id | `$.data.data.products[].product_id` | 商品 ID | shop.md 相关端点 |

---

### fetch_user_profile — 获取用户资料（Web API）

**Full path:** `/api/v1/tiktok/web/fetch_user_profile`
**Method:** GET · **Risk:** low

#### 用途
通过 Web API 获取用户资料。参数使用 camelCase 命名（secUid / uniqueId）。

#### 何时使用 / 不使用
- ✅ 需要 Web API 特有字段时
- ✅ 已知 uniqueId 或 secUid
- ❌ 不想处理 tt_chain_token → 用 App V3 的 handler_user_profile
- ❌ 参数名注意：Web API 用 `secUid`，App V3 用 `sec_user_id`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| secUid | string | oneOf(A) | 混合字母数字 | 用户 secUid |
| uniqueId | string | oneOf(A) | — | 用户 uniqueId（用户名） |

> ⚠️ **oneOf(A)**：secUid / uniqueId 至少提供一个，优先使用 uniqueId。

> ⚠️ **参数名差异**：Web API 使用 `secUid`（camelCase），App V3 使用 `sec_user_id`（snake_case），值相同。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user.uniqueId | `$.data.data.user.uniqueId` | 用户名 | fetch_user_live_detail |
| user.secUid | `$.data.data.user.secUid` | 用户 secUid | 本文件 Web API 端点 |
| user.userId | `$.data.data.user.userId` | 用户 ID | App V3 端点（注意参数名转换） |

---

### fetch_user_post — 获取用户作品列表（Web API）

**Full path:** `/api/v1/tiktok/web/fetch_user_post`
**Method:** GET · **Risk:** low

#### 用途
通过 Web API 获取用户作品列表。支持排序方式选择。返回的视频 CDN 链接需要 tt_chain_token。

#### 何时使用 / 不使用
- ✅ 需要 Web API 特有数据时
- ❌ 不想处理 tt_chain_token → 用 App V3 的 fetch_user_post_videos_v3
- ❌ 参数名注意：Web API 用 `secUid`，App V3 用 `sec_user_id`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| secUid | string | yes | 混合字母数字 | 用户 secUid |
| cursor | integer | no | default=0 | 翻页游标 |
| count | integer | no | default=20, 不可变更 | 每页数量 |
| coverFormat | integer | no | enum: [1, 2], default=2 | 封面格式 |
| post_item_list_request_type | integer | no | enum: [0, 1, 2], default=0 | 排序方式：0=默认 1=热门 2=最旧 |

> ⚠️ Web API 返回的视频 CDN 链接需 tt_chain_token，详见错误处理契约。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| itemList[].id | `$.data.data.itemList[].id` | 视频 ID | video.md 多端点 |
| cursor | `$.data.data.cursor` | 下一页游标 | 同端点翻页 |
| hasMore | `$.data.data.hasMore` | 是否还有下一页 | 翻页终止条件 |
| tt_chain_token | 响应中的 `tt_chain_token` 字段 | CDN 访问令牌 | 访问视频 CDN 链接时携带 |

---

### fetch_user_repost — 获取用户转发作品（Web API）

**Full path:** `/api/v1/tiktok/web/fetch_user_repost`
**Method:** GET · **Risk:** low

#### 用途
通过 Web API 获取用户转发作品列表。返回的视频 CDN 链接需要 tt_chain_token。

#### 何时使用 / 不使用
- ✅ 需要 Web API 特有数据时
- ❌ 不想处理 tt_chain_token → 用 App V3 的 fetch_user_repost_videos

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| secUid | string | yes | 混合字母数字 | 用户 secUid |
| cursor | integer | no | default=0 | 翻页游标 |
| count | integer | no | default=20, 不可变更 | 每页数量 |
| coverFormat | integer | no | enum: [1, 2], default=2 | 封面格式 |

> ⚠️ Web API 返回的视频 CDN 链接需 tt_chain_token。

---

### fetch_user_like — 获取用户点赞列表（Web API）

**Full path:** `/api/v1/tiktok/web/fetch_user_like`
**Method:** GET · **Risk:** low

#### 用途
通过 Web API 获取用户点赞列表。需要用户点赞列表为公开状态。返回的视频 CDN 链接需要 tt_chain_token。

#### 何时使用 / 不使用
- ✅ 需要 Web API 特有数据时
- ❌ 用户点赞列表未公开 → 会返回错误
- ❌ 不想处理 tt_chain_token → 用 App V3 的 fetch_user_like_videos

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| secUid | string | yes | 混合字母数字 | 用户 secUid |
| cursor | integer | no | default=0 | 翻页游标 |
| count | integer | no | default=20, 不可变更 | 每页数量 |
| coverFormat | integer | no | default=2 | 封面格式 |
| post_item_list_request_type | integer | no | enum: [0, 1, 2], default=0 | 排序方式：0=默认 1=热门 2=最旧 |

> ⚠️ Web API 返回的视频 CDN 链接需 tt_chain_token。

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 业务 code≠0 | 点赞列表未公开 | 告知用户该列表不可查看 | 0 | — |

---

### fetch_user_collect — 获取用户收藏列表（需 cookie）

**Full path:** `/api/v1/tiktok/web/fetch_user_collect`
**Method:** GET · **Risk:** low

#### 用途
获取用户的收藏列表。**仅能获取自己的收藏**，需要提供自己账号的 cookie。返回的视频 CDN 链接需要 tt_chain_token。

#### 何时使用 / 不使用
- ✅ 用户明确要求查看自己的收藏列表，并提供了 cookie
- ❌ 想看别人的收藏 → 不支持
- ❌ 用户未提供 cookie → 无法调用

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cookie | string | yes | 敏感凭据 | 用户 cookie，**仅在用户明确授权时使用** |
| secUid | string | yes | 混合字母数字 | 用户 secUid（自己的） |
| cursor | integer | no | default=0 | 翻页游标 |
| count | integer | no | default=30 | 每页数量 |
| coverFormat | integer | no | default=2 | 封面格式 |

> 🔒 **安全提醒**：cookie 属于敏感登录凭据，仅在用户明确授权访问登录态数据时使用。禁止在日志、提示或客户端存储中暴露。

> ⚠️ Web API 返回的视频 CDN 链接需 tt_chain_token。

---

### fetch_user_play_list — 获取用户播放列表（Web API）

**Full path:** `/api/v1/tiktok/web/fetch_user_play_list`
**Method:** GET · **Risk:** low

#### 用途
获取用户的播放列表（合辑列表）。返回的视频 CDN 链接需要 tt_chain_token。

#### 何时使用 / 不使用
- ✅ 用户想看某用户的播放列表/合辑
- ❌ 想看具体合辑中的视频 → video.md 的 fetch_user_mix

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| secUid | string | yes | 混合字母数字 | 用户 secUid |
| cursor | integer | no | default=0 | 翻页游标 |
| count | integer | no | default=30 | 每页数量 |

> ⚠️ Web API 返回的视频 CDN 链接需 tt_chain_token。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| itemList[].id | `$.data.data.itemList[].id` | 合辑 ID | video.md 的 fetch_user_mix（作为 mixId） |

---

### fetch_user_fans — 获取用户粉丝列表（Web API）

**Full path:** `/api/v1/tiktok/web/fetch_user_fans`
**Method:** GET · **Risk:** low

#### 用途
通过 Web API 获取用户粉丝列表。返回的视频 CDN 链接需要 tt_chain_token。

#### 何时使用 / 不使用
- ✅ 需要 Web API 特有数据时
- ❌ 不想处理 tt_chain_token → 用 App V3 的 fetch_user_follower_list

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| secUid | string | yes | 混合字母数字 | 用户 secUid |
| count | integer | no | default=30 | 每页数量 |
| maxCursor | integer | no | default=0 | 最大游标 |
| minCursor | integer | no | default=0 | 最小游标 |

> ⚠️ Web API 返回的视频 CDN 链接需 tt_chain_token。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| followers[].secUid | `$.data.data.followers[].secUid` | 粉丝 secUid | 本文件 Web API 端点 |

---

### fetch_user_follow — 获取用户关注列表（Web API）

**Full path:** `/api/v1/tiktok/web/fetch_user_follow`
**Method:** GET · **Risk:** low

#### 用途
通过 Web API 获取用户关注列表。返回的视频 CDN 链接需要 tt_chain_token。

#### 何时使用 / 不使用
- ✅ 需要 Web API 特有数据时
- ❌ 不想处理 tt_chain_token → 用 App V3 的 fetch_user_following_list

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| secUid | string | yes | 混合字母数字 | 用户 secUid |
| count | integer | no | default=30 | 每页数量 |
| maxCursor | integer | no | default=0 | 最大游标 |
| minCursor | integer | no | default=0 | 最小游标 |

> ⚠️ Web API 返回的视频 CDN 链接需 tt_chain_token。

---

### fetch_user_live_detail — 获取用户直播详情（Web API）

**Full path:** `/api/v1/tiktok/web/fetch_user_live_detail`
**Method:** GET · **Risk:** low

#### 用途
获取用户的直播详情信息。使用 uniqueId（用户名）查询。返回的视频 CDN 链接需要 tt_chain_token。

#### 何时使用 / 不使用
- ✅ 用户想看某用户是否在直播及直播详情
- ❌ 想看 Webcast 用户信息 → fetch_webcast_user_info（App V3）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uniqueId | string | yes | — | 用户 uniqueId（用户名） |

> ⚠️ Web API 返回的视频 CDN 链接需 tt_chain_token。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| liveRoom.room_id | `$.data.data.liveRoom.room_id` | 直播间 ID | comments.md 直播相关端点 |

---

### get_user_id — 从用户主页链接提取 user_id

**Full path:** `/api/v1/tiktok/web/get_user_id`
**Method:** GET · **Risk:** low

#### 用途
从 TikTok 用户主页链接中提取 user_id。**URL → user_id 的链式入口**。

#### 何时使用 / 不使用
- ✅ 用户提供用户主页 URL 但需要 user_id
- ✅ 链式起点：URL → user_id → handler_user_profile
- ❌ 已有 user_id → 直接用 handler_user_profile
- ❌ 需要 sec_user_id → 用 get_sec_user_id

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| url | string | yes | startsWith=`https://www.tiktok.com/@` | 用户主页链接 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user_id | `$.data.data.user_id` | 用户 ID（纯数字） | handler_user_profile / fetch_user_follower_list |

---

### get_sec_user_id — 从用户主页链接提取 sec_user_id

**Full path:** `/api/v1/tiktok/web/get_sec_user_id`
**Method:** GET · **Risk:** low

#### 用途
从 TikTok 用户主页链接中提取 sec_user_id。**URL → sec_user_id 的链式入口**。

#### 何时使用 / 不使用
- ✅ 用户提供用户主页 URL 但需要 sec_user_id
- ✅ 链式起点：URL → sec_user_id → handler_user_profile / fetch_user_post_videos_v3
- ❌ 已有 sec_user_id → 直接用下游端点
- ❌ 需要 user_id → 用 get_user_id

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| url | string | yes | startsWith=`https://www.tiktok.com/@` | 用户主页链接 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| sec_user_id | `$.data.data.sec_user_id` | 用户 sec_user_id | handler_user_profile / fetch_user_post_videos_v3 / fetch_user_like_videos |

---

### get_all_sec_user_id — 批量提取 sec_user_id

> 🚨 **RESTRICTED — bulk_extraction**：bulk identifier extractor
>
> 此端点**默认禁用**。仅在用户当次明确授权后调用，且必须告知合规风险。详见 SKILL.md 「高风险能力清单」章节。


**Full path:** `/api/v1/tiktok/web/get_all_sec_user_id`
**Method:** POST · **Risk:** low

#### 用途
批量从用户主页链接中提取 sec_user_id，最多支持 10 个链接。如某链接无法获取 sec_user_id，则返回原始输入链接。

#### 何时使用 / 不使用
- ✅ 需要批量提取多个用户的 sec_user_id
- ❌ 只需提取一个 → 用 get_sec_user_id

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| url | array[string] | yes | maxItems=10 | 用户主页链接列表 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| sec_user_ids[] | `$.data.data` | sec_user_id 列表 | handler_user_profile / fetch_user_post_videos_v3 |

---

### get_unique_id — 从用户主页链接提取 unique_id

**Full path:** `/api/v1/tiktok/web/get_unique_id`
**Method:** GET · **Risk:** low

#### 用途
从 TikTok 用户主页链接中提取 unique_id（用户名）。

#### 何时使用 / 不使用
- ✅ 用户提供 URL 但需要用户名
- ❌ 需要 sec_user_id → 用 get_sec_user_id（更常用）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| url | string | yes | startsWith=`https://www.tiktok.com/@` | 用户主页链接 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| unique_id | `$.data.data.unique_id` | 用户名 | get_user_id_and_sec_user_id_by_username / fetch_user_country_by_username |

---

### get_all_unique_id — 批量提取 unique_id

> 🚨 **RESTRICTED — bulk_extraction**：bulk identifier extractor
>
> 此端点**默认禁用**。仅在用户当次明确授权后调用，且必须告知合规风险。详见 SKILL.md 「高风险能力清单」章节。


**Full path:** `/api/v1/tiktok/web/get_all_unique_id`
**Method:** POST · **Risk:** low

#### 用途
批量从用户主页链接中提取 unique_id，最多支持 20 个链接。

#### 何时使用 / 不使用
- ✅ 需要批量提取多个用户的 unique_id
- ❌ 只需提取一个 → 用 get_unique_id

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| url | array[string] | yes | maxItems=20 | 用户主页链接列表 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| unique_ids[] | `$.data.data` | unique_id 列表 | get_user_id_and_sec_user_id_by_username |
