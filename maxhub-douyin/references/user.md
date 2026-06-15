# Douyin User / 抖音用户

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖

用户资料查询（多种 ID 类型）、批量用户资料、粉丝/关注列表、用户主页作品、喜欢视频、收藏/收藏夹、合辑视频。**sec_user_id 与 uid 多在本文件首步产出**，是视频、评论、直播、星图等链式调用的常见起点。

> 🔒 **安全**：所有请求将 `MAXHUB_API_KEY` 和查询数据传输至 `https://www.aconfig.cn`。禁止在日志、提示词或客户端存储中暴露 API Key。含 `cookie` 参数的端点仅在用户明确授权后使用。

---

## 端点索引 (Endpoint Index)

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| app_v3_handler_user_profile | ⭐⭐⭐ 首选 | 用 sec_user_id 取用户信息（App V3，**链式起点**） | GET | /api/v1/douyin/app/v3/handler_user_profile | low |
| web_handler_user_profile | ⭐⭐ 条件 | 用 sec_user_id 取用户信息（Web） | GET | /api/v1/douyin/web/handler_user_profile | low |
| web_handler_user_profile_v4 | ⭐⭐ 条件 | 用 sec_user_id 取用户信息 V4（含性别/年龄/直播等级） | GET | /api/v1/douyin/web/handler_user_profile_v4 | low |
| web_handler_user_profile_v2 | ⭐⭐ 条件 | 用 unique_id（抖音号）取用户信息 | GET | /api/v1/douyin/web/handler_user_profile_v2 | low |
| web_handler_user_profile_v3 | ⭐⭐ 条件 | 用 uid 取用户信息 | GET | /api/v1/douyin/web/handler_user_profile_v3 | low |
| web_fetch_user_profile_by_uid | ⭐⭐ 条件 | 用 uid 取用户资料（Web） | GET | /api/v1/douyin/web/fetch_user_profile_by_uid | low |
| web_fetch_user_profile_by_short_id | ⭐ 降级 | 用 short_id 取用户资料 | GET | /api/v1/douyin/web/fetch_user_profile_by_short_id | low |
| web_encrypt_uid_to_sec_user_id | ⭐⭐ 条件 | uid 加密为 sec_user_id | GET | /api/v1/douyin/web/encrypt_uid_to_sec_user_id | low |
| web_fetch_batch_user_profile_v1 | ⭐ 降级 | 批量取用户资料 V1（最多 10 个） | GET | /api/v1/douyin/web/fetch_batch_user_profile_v1 | low |
| web_fetch_batch_user_profile_v2 | ⭐⭐⭐ 首选 | 批量取用户资料 V2（最多 50 个） | GET | /api/v1/douyin/web/fetch_batch_user_profile_v2 | low |
| app_v3_fetch_user_fans_list | ⭐⭐ 条件 | 取用户粉丝列表（App V3） | GET | /api/v1/douyin/app/v3/fetch_user_fans_list | low |
| web_fetch_user_fans_list | ⭐⭐ 条件 | 取用户粉丝列表（Web） | GET | /api/v1/douyin/web/fetch_user_fans_list | low |
| web_fetch_user_following_list | ⭐⭐ 条件 | 取用户关注列表 | GET | /api/v1/douyin/web/fetch_user_following_list | low |
| app_v3_fetch_user_post_videos | ⭐⭐⭐ 首选 | 取用户主页作品（App V3） | GET | /api/v1/douyin/app/v3/fetch_user_post_videos | low |
| web_fetch_user_post_videos | ⭐ 降级 | 取用户主页作品（Web，需 cookie） | GET | /api/v1/douyin/web/fetch_user_post_videos | low |
| app_v3_fetch_user_like_videos | ⭐⭐ 条件 | 取用户喜欢视频（App V3） | GET | /api/v1/douyin/app/v3/fetch_user_like_videos | low |
| web_fetch_user_like_videos | ⭐ 降级 | 取用户喜欢视频（Web，需 cookie） | POST | /api/v1/douyin/web/fetch_user_like_videos | **high** |
| web_fetch_user_collection_videos | ⭐ 特殊 | 取用户收藏视频（需 cookie） | POST | /api/v1/douyin/web/fetch_user_collection_videos | **high** |
| web_fetch_user_collects | ⭐ 特殊 | 取用户收藏夹列表（需 cookie） | POST | /api/v1/douyin/web/fetch_user_collects | **high** |
| web_fetch_user_collects_videos | ⭐⭐ 条件 | 取收藏夹内视频 | GET | /api/v1/douyin/web/fetch_user_collects_videos | low |
| web_fetch_user_mix_videos | ⭐⭐ 条件 | 取用户合辑视频 | GET | /api/v1/douyin/web/fetch_user_mix_videos | low |

---

## 链式调用图谱 (Chain Recipes)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看用户 + 作品 | app_v3_handler_user_profile → app_v3_fetch_user_post_videos | `$.data.user.sec_uid` → `sec_user_id` | 第 1 步失败：STOP；第 2 步空：返回用户信息 + "暂无作品" |
| 看用户 + 粉丝 | app_v3_handler_user_profile → web_fetch_user_fans_list | `$.data.user.sec_uid` → `sec_user_id` | 第 2 步空：返回用户信息 + "暂无粉丝数据" |
| 看用户 + 关注 | app_v3_handler_user_profile → web_fetch_user_following_list | `$.data.user.sec_uid` → `sec_user_id` | 第 2 步空：返回用户信息 + "暂无关注数据" |
| uid → sec_user_id → 用户信息 | web_encrypt_uid_to_sec_user_id → app_v3_handler_user_profile | `$.data.sec_user_id` → `sec_user_id` | 第 1 步失败：STOP |
| 抖音号 → 用户信息 | web_handler_user_profile_v2 | `unique_id` 直接输入 | 单步完成 |
| 看用户 + 直播信息 | app_v3_handler_user_profile → 跳转 `live.md` | `$.data.user.uid` → `uid` | 跨文件链路，详见 live.md |
| 看用户 + 星图数据 | app_v3_handler_user_profile → 跳转 `xingtu.md` | `$.data.user.sec_uid` → `sec_user_id` | 跨文件链路，详见 xingtu.md |
| 看用户 + 视频 + 高清链接 | app_v3_handler_user_profile → app_v3_fetch_user_post_videos → video.md | `sec_user_id` → `aweme_id` 接力 | 三步链路 |
| 收藏夹列表 + 收藏夹视频 | web_fetch_user_collects → web_fetch_user_collects_videos | `$.data.collects_list[].collects_id` → `collects_id` | 第 1 步失败：STOP（需 cookie） |
| 批量用户 → 批量视频 | web_fetch_batch_user_profile_v2 → video.md 批量端点 | `$.data[].sec_uid` / `$.data[].aweme_id` | 按需组合 |

---

## 跨 reference 链路 (In-Chain)

- **流入本文件**：`video.md` 的 `app_v3_fetch_one_video` 输出 `$.data.author.sec_uid` → 本文件用户信息端点
- **流入本文件**：`search.md` 的 `search_fetch_user_search` 输出 `$.data.data[].sec_uid` → 本文件用户信息端点
- **流入本文件**：`tools.md` 的 `web_get_sec_user_id` 输出 `$.data.sec_user_id` → 本文件用户信息端点
- **流入本文件**：`comments.md` 的评论端点输出 `$.data.comments[].user.sec_uid` → 本文件用户信息端点
- **流出本文件**：`$.data.user.sec_uid` → `video.md` 的 `app_v3_fetch_user_post_videos` 等
- **流出本文件**：`$.data.user.uid` → `live.md` 的 `web_fetch_user_live_info_by_uid`
- **流出本文件**：`$.data.user.sec_uid` → `xingtu.md` 的 `xingtu_get_xingtu_kolid_by_sec_user_id`
- **流出本文件**：`$.data.user.unique_id` → `web_handler_user_profile_v2`（抖音号查用户）
- **流出本文件**：`$.data.aweme_list[].aweme_id` → `video.md` 全部视频端点

---

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项；通用规则见此处。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
  - 路径是否在 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 中？
  - Method、参数键名是否符合白名单？
  - 资源 ID（sec_user_id/uid/unique_id 等）是否来自合法响应字段？
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**，向用户报告
- **禁止**：❌ 改路径段（app/v3→web 试探）❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改资源 ID 重试
- **替换**：参考 [`param-mappings.md`](./param-mappings.md) 的"端点替换矩阵"

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
  - 参数名是否逐字符匹配 IN 表？注意 `sec_user_id` vs `sec_uid` vs `uid` vs `unique_id` vs `short_id` 的区别
  - 必填项是否齐全？
  - 传参方式（query vs body）是否正确？
  - **是否有 IN 表外的臆造参数**？
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP

### cookie 参数特化规则
- 含 `cookie` 参数的端点（`web_fetch_user_like_videos`、`web_fetch_user_collection_videos`、`web_fetch_user_collects`、`web_fetch_user_post_videos`），**必须在用户明确授权后才可传递**
- 禁止 Agent 自行构造或缓存 cookie
- cookie 获取方式：调用 `tools.md` 的 `web_generate_ttwid` 或 `web_fetch_douyin_web_guest_cookie`

### 粉丝/关注列表翻页特化规则
- `web_fetch_user_fans_list` / `web_fetch_user_following_list` 首次请求时 `max_time=0`、`source_type=2`，返回空列表含 `max_time`；第二次请求 `source_type=1` + 上次返回的 `max_time`
- 不按此方式请求可能导致返回重复数据

---

## 端点详情

---

### app_v3_handler_user_profile — 获取用户信息（App V3）

**Full path:** `/api/v1/douyin/app/v3/handler_user_profile`
**Method:** GET · **Risk:** low

#### 用途
用 sec_user_id 获取用户完整信息。**链式调用的常见起点**——sec_user_id 与 uid 从此处产出。

#### 何时使用 / 不使用
- ✅ 用户提供 sec_user_id（Base64 格式长字符串）
- ✅ 链式起点：取 sec_user_id 或 uid
- ❌ 用户只有抖音号 → 用 `web_handler_user_profile_v2`
- ❌ 用户只有 uid → 用 `web_handler_user_profile_v3` 或 `web_fetch_user_profile_by_uid`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_user_id | string | yes | Base64 格式 | 用户加密 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user.sec_uid | `$.data.user.sec_uid` | 用户加密 ID | video.md / xingtu.md / 本文件多端点 |
| user.uid | `$.data.user.uid` | 用户数字 ID | live.md / web_fetch_user_profile_by_uid |
| user.unique_id | `$.data.user.unique_id` | 抖音号 | web_handler_user_profile_v2 |
| user.short_id | `$.data.user.short_id` | 短 ID | web_fetch_user_profile_by_short_id |
| user.nickname | `$.data.user.nickname` | 昵称 | 直接交付用户 |
| user.follower_count | `$.data.user.follower_count` | 粉丝数 | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | sec_user_id 不存在 | STOP | 0 | 无替代 |
| 空响应 | App V3 数据源无数据 | 换 Web 版 | ≤1 次 | **替换**：`web_handler_user_profile` |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`web_handler_user_profile` |

---

### web_handler_user_profile — 获取用户信息（Web）

**Full path:** `/api/v1/douyin/web/handler_user_profile`
**Method:** GET · **Risk:** low

#### 用途
Web 版用户信息接口，用 sec_user_id 查询。

#### 何时使用 / 不使用
- ✅ App V3 版本返回空时的降级
- ❌ 首选 → 用 `app_v3_handler_user_profile`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_user_id | string | yes | Base64 格式 | 用户加密 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user.sec_uid | `$.data.user.sec_uid` | 用户加密 ID | 同 app_v3_handler_user_profile |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`app_v3_handler_user_profile` |

---

### web_handler_user_profile_v2 — 用抖音号取用户信息

**Full path:** `/api/v1/douyin/web/handler_user_profile_v2`
**Method:** GET · **Risk:** low

#### 用途
通过抖音号（unique_id）获取用户信息。**当用户只提供抖音号时的首选入口**。

#### 何时使用 / 不使用
- ✅ 用户提供抖音号（如 `TheChief`）
- ❌ 用户有 sec_user_id → 用 `app_v3_handler_user_profile`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| unique_id | string | yes | — | 抖音号 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user.sec_uid | `$.data.user.sec_uid` | 用户加密 ID | app_v3_handler_user_profile / video.md |
| user.uid | `$.data.user.uid` | 用户数字 ID | live.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 抖音号不存在 | STOP | 0 | 无替代 |

---

### web_handler_user_profile_v3 — 用 uid 取用户信息

**Full path:** `/api/v1/douyin/web/handler_user_profile_v3`
**Method:** GET · **Risk:** low

#### 用途
通过 uid（即 short_id）获取用户信息。

#### 何时使用 / 不使用
- ✅ 用户只有 uid
- ❌ 用户有 sec_user_id → 用 `app_v3_handler_user_profile`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | 纯数字字符串 | 用户 uid（即 short_id） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user.sec_uid | `$.data.user.sec_uid` | 用户加密 ID | app_v3_handler_user_profile |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | uid 不存在 | STOP | 0 | 无替代 |

---

### web_handler_user_profile_v4 — 用 sec_user_id 取用户信息 V4

**Full path:** `/api/v1/douyin/web/handler_user_profile_v4`
**Method:** GET · **Risk:** low

#### 用途
V4 版本用户信息，额外包含性别、年龄、直播等级、直播间牌子。性别：1=男, 2=女, 0=未知（在 live_user 字段中）；年龄：在 user 字段中，-1=未知。

#### 何时使用 / 不使用
- ✅ 需要性别/年龄/直播等级等额外字段
- ❌ 只需基本信息 → 用 `app_v3_handler_user_profile`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_user_id | string | yes | Base64 格式 | 用户加密 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user.sec_uid | `$.data.user.sec_uid` | 用户加密 ID | 同 app_v3_handler_user_profile |
| live_user.gender | `$.data.live_user.gender` | 性别 | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`app_v3_handler_user_profile` |

---

### web_fetch_user_profile_by_uid — 用 uid 取用户资料

**Full path:** `/api/v1/douyin/web/fetch_user_profile_by_uid`
**Method:** GET · **Risk:** low

#### 用途
通过 uid 获取用户资料。

#### 何时使用 / 不使用
- ✅ 用户只有 uid
- ❌ 首选 → 用 `web_handler_user_profile_v3`（同参数，更直接）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | 纯数字字符串 | 用户 UID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user.sec_uid | `$.data.user.sec_uid` | 用户加密 ID | app_v3_handler_user_profile |
| user.uid | `$.data.user.uid` | 用户数字 ID | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | uid 不存在 | STOP | 0 | 无替代 |

---

### web_fetch_user_profile_by_short_id — 用 short_id 取用户资料

**Full path:** `/api/v1/douyin/web/fetch_user_profile_by_short_id`
**Method:** GET · **Risk:** low

#### 用途
通过 short_id 获取用户资料。

#### 何时使用 / 不使用
- ✅ 用户只有 short_id
- ❌ 有 sec_user_id 或 uid → 用对应端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| short_id | string | yes | 纯数字字符串 | 用户 Short ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user.sec_uid | `$.data.user.sec_uid` | 用户加密 ID | app_v3_handler_user_profile |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | short_id 不存在 | STOP | 0 | 无替代 |

---

### web_encrypt_uid_to_sec_user_id — uid 加密为 sec_user_id

**Full path:** `/api/v1/douyin/web/encrypt_uid_to_sec_user_id`
**Method:** GET · **Risk:** low

#### 用途
将 uid 转换为 sec_user_id。**ID 转换桥梁**——当只有 uid 但下游端点需要 sec_user_id 时使用。

#### 何时使用 / 不使用
- ✅ 有 uid 但需要 sec_user_id
- ❌ 已有 sec_user_id → 直接使用

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | 纯数字字符串 | 用户 uid |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| sec_user_id | `$.data.sec_user_id` | 用户加密 ID | app_v3_handler_user_profile / video.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | uid 不存在 | STOP | 0 | 无替代 |

---

### web_fetch_batch_user_profile_v1 — 批量取用户资料 V1

**Full path:** `/api/v1/douyin/web/fetch_batch_user_profile_v1`
**Method:** GET · **Risk:** low

#### 用途
批量获取用户资料，最多支持 10 个。

#### 何时使用 / 不使用
- ✅ 需要批量获取少量用户资料（≤10）
- ❌ 超过 10 个 → 用 `web_fetch_batch_user_profile_v2`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_user_ids | string | yes | 逗号分隔，最多 10 个 | sec_user_id 列表 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| [].sec_uid | `$.data[].sec_uid` | 用户加密 ID | 本文件多端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`web_fetch_batch_user_profile_v2` |

---

### web_fetch_batch_user_profile_v2 — 批量取用户资料 V2

**Full path:** `/api/v1/douyin/web/fetch_batch_user_profile_v2`
**Method:** GET · **Risk:** low

#### 用途
批量获取用户资料，最多支持 50 个。**批量查询首选**。

#### 何时使用 / 不使用
- ✅ 批量获取用户资料（≤50 个）
- ❌ 单个用户 → 用 `app_v3_handler_user_profile`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_user_ids | string | yes | 逗号分隔，最多 50 个 | sec_user_id 列表 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| [].sec_uid | `$.data[].sec_uid` | 用户加密 ID | 本文件多端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### app_v3_fetch_user_fans_list — 取用户粉丝列表（App V3）

**Full path:** `/api/v1/douyin/app/v3/fetch_user_fans_list`
**Method:** GET · **Risk:** low

#### 用途
获取用户粉丝列表（App V3 版本）。

#### 何时使用 / 不使用
- ✅ 需要查看用户粉丝列表
- ❌ 需要关注列表 → 用 `web_fetch_user_following_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_user_id | string | no | Base64 格式 | 用户加密 ID |
| max_time | string | no | default: "0" | 最大时间戳，翻页用 |
| count | integer | no | default: 20 | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| follow_list[].sec_uid | `$.data.follow_list[].sec_uid` | 粉丝加密 ID | app_v3_handler_user_profile |
| max_time | `$.data.max_time` | 下一页时间戳 | 同端点翻页 |
| has_more | `$.data.has_more` | 是否有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`web_fetch_user_fans_list` |

---

### web_fetch_user_fans_list — 取用户粉丝列表（Web）

**Full path:** `/api/v1/douyin/web/fetch_user_fans_list`
**Method:** GET · **Risk:** low

#### 用途
获取用户粉丝列表（Web 版本）。

#### 何时使用 / 不使用
- ✅ App V3 版本失败时的降级
- ❌ 首选 → 用 `app_v3_fetch_user_fans_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_user_id | string | no | Base64 格式 | 用户加密 ID |
| max_time | string | no | default: "0" | 最大时间戳 |
| count | integer | no | default: 20 | 每页数量 |
| source_type | integer | no | default: 1 | 来源类型（首次请求用 2，后续用 1） |

> **翻页特化**：首次请求 `max_time=0`、`source_type=2`，返回空列表含 `max_time`；第二次请求 `source_type=1` + 上次返回的 `max_time`。不按此方式可能导致重复数据。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| follow_list[].sec_uid | `$.data.follow_list[].sec_uid` | 粉丝加密 ID | app_v3_handler_user_profile |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`app_v3_fetch_user_fans_list` |

---

### web_fetch_user_following_list — 取用户关注列表

**Full path:** `/api/v1/douyin/web/fetch_user_following_list`
**Method:** GET · **Risk:** low

#### 用途
获取用户关注列表。

#### 何时使用 / 不使用
- ✅ 需要查看用户关注了谁
- ❌ 需要粉丝列表 → 用 `app_v3_fetch_user_fans_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_user_id | string | no | Base64 格式 | 用户加密 ID |
| max_time | string | no | default: "0" | 最大时间戳 |
| count | integer | no | default: 20 | 每页数量 |
| source_type | integer | no | default: 1 | 来源类型（首次请求用 2，后续用 1） |

> **翻页特化**：同 `web_fetch_user_fans_list`，首次 `source_type=2`，后续 `source_type=1`。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| follow_list[].sec_uid | `$.data.follow_list[].sec_uid` | 关注者加密 ID | app_v3_handler_user_profile |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### app_v3_fetch_user_post_videos — 取用户主页作品（App V3）

**Full path:** `/api/v1/douyin/app/v3/fetch_user_post_videos`
**Method:** GET · **Risk:** low

#### 用途
获取用户主页作品列表（含分页和排序）。**查看用户作品的首选端点**。

#### 何时使用 / 不使用
- ✅ 需要查看用户发布的视频
- ✅ 链式起点：取 aweme_id 后进入 video.md 链路
- ❌ 想看用户喜欢的视频 → 用 `app_v3_fetch_user_like_videos`
- ❌ Web 版更不稳定 → 优先用 App V3

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_user_id | string | yes | Base64 格式 | 用户加密 ID |
| max_cursor | integer | no | default: 0 | 最大游标，翻页用 |
| count | integer | no | default: 20 | 每页数量（建议不超过 20） |
| sort_type | integer | no | 0=最新排序, 1=最热排序 | 排序类型 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | video.md 全部端点 |
| max_cursor | `$.data.max_cursor` | 下一页游标 | 同端点翻页 |
| has_more | `$.data.has_more` | 是否有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`web_fetch_user_post_videos` |

---

### web_fetch_user_post_videos — 取用户主页作品（Web）

**Full path:** `/api/v1/douyin/web/fetch_user_post_videos`
**Method:** GET · **Risk:** low

#### 用途
Web 版用户主页作品列表。**注意：Web 接口可能不稳定，优先使用 App V3 版本**。

#### 何时使用 / 不使用
- ✅ App V3 版本失败时的降级
- ❌ 首选 → 用 `app_v3_fetch_user_post_videos`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_user_id | string | yes | Base64 格式 | 用户加密 ID |
| max_cursor | string | no | default: "0" | 最大游标 |
| count | integer | no | default: 20 | 每页数量 |
| filter_type | string | no | 0=默认排序, 3=热度排序 | 过滤类型 |
| cookie | string | no | — | 敏感登录凭据；仅在用户明确授权时使用 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | video.md 全部端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`app_v3_fetch_user_post_videos` |

---

### app_v3_fetch_user_like_videos — 取用户喜欢视频（App V3）

**Full path:** `/api/v1/douyin/app/v3/fetch_user_like_videos`
**Method:** GET · **Risk:** low

#### 用途
获取用户喜欢（点赞）的视频列表。

#### 何时使用 / 不使用
- ✅ 需要查看用户点赞的视频
- ❌ 想看用户发布的视频 → 用 `app_v3_fetch_user_post_videos`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_user_id | string | yes | Base64 格式 | 用户加密 ID |
| max_cursor | integer | no | default: 0 | 最大游标 |
| counts | integer | no | default: 20 | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | video.md 全部端点 |
| max_cursor | `$.data.max_cursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在或喜欢列表不可见 | STOP | 0 | 无替代 |

---

### web_fetch_user_like_videos — 取用户喜欢视频（Web）

**Full path:** `/api/v1/douyin/web/fetch_user_like_videos`
**Method:** POST · **Risk:** high · **requires_user_confirmation:** true · **write_operation:** true

#### 用途
Web 版用户喜欢视频列表。需要用户提供 cookie。

#### 何时使用 / 不使用
- ✅ App V3 版本失败时的降级
- ❌ 首选 → 用 `app_v3_fetch_user_like_videos`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_user_id | string | yes (body) | Base64 格式 | 用户加密 ID |
| max_cursor | integer | no (body) | default: 0 | 最大游标 |
| count | integer | no (body) | default: 20 | 每页数量 |
| cookie | string | no (body) | — | 用户自行提供的 Cookie |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | video.md 全部端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`app_v3_fetch_user_like_videos` |

---

### web_fetch_user_collection_videos — 取用户收藏视频

**Full path:** `/api/v1/douyin/web/fetch_user_collection_videos`
**Method:** POST · **Risk:** high · **requires_user_confirmation:** true · **write_operation:** true

#### 用途
获取用户收藏的视频列表。**必须提供用户 cookie**。

#### 何时使用 / 不使用
- ✅ 用户明确要求查看自己收藏的视频（需提供 cookie）
- ❌ 无 cookie → 无法调用

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cookie | string | yes (body) | — | 用户网页版抖音 Cookie |
| max_cursor | integer | no (body) | default: 0 | 最大游标 |
| count | integer | no (body) | default: 20 | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | video.md 全部端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 401 | cookie 无效 | STOP，告知用户 | 0 | 无替代 |

---

### web_fetch_user_collects — 取用户收藏夹列表

**Full path:** `/api/v1/douyin/web/fetch_user_collects`
**Method:** POST · **Risk:** high · **requires_user_confirmation:** true · **write_operation:** true

#### 用途
获取用户收藏夹列表。**必须提供用户 cookie**。链式起点：取 collects_id 后调用 `web_fetch_user_collects_videos`。

#### 何时使用 / 不使用
- ✅ 用户想看自己的收藏夹列表（需提供 cookie）
- ❌ 无 cookie → 无法调用

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cookie | string | yes (body) | — | 用户网页版抖音 Cookie |
| max_cursor | integer | no (body) | default: 0 | 最大游标 |
| count | integer | no (body) | default: 20 | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| collects_list[].collects_id | `$.data.collects_list[].collects_id` | 收藏夹 ID | web_fetch_user_collects_videos |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 401 | cookie 无效 | STOP，告知用户 | 0 | 无替代 |

---

### web_fetch_user_collects_videos — 取收藏夹内视频

**Full path:** `/api/v1/douyin/web/fetch_user_collects_videos`
**Method:** GET · **Risk:** low

#### 用途
获取指定收藏夹内的视频列表。

#### 何时使用 / 不使用
- ✅ 已知 collects_id，想看收藏夹内的视频
- ❌ 不知 collects_id → 先调用 `web_fetch_user_collects`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| collects_id | string | yes | — | 收藏夹 ID |
| max_cursor | integer | no | default: 0 | 最大游标 |
| counts | integer | no | default: 20 | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | video.md 全部端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 收藏夹不存在 | STOP | 0 | 无替代 |

---

### web_fetch_user_mix_videos — 取用户合辑视频

**Full path:** `/api/v1/douyin/web/fetch_user_mix_videos`
**Method:** GET · **Risk:** low

#### 用途
获取用户合辑（合集）内的视频列表。

#### 何时使用 / 不使用
- ✅ 已知 mix_id，想看合辑内的视频
- ❌ 不知 mix_id → 先调用 `video.md` 的 `app_v3_fetch_video_mix_detail`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| mix_id | string | yes | 纯数字字符串 | 合辑 ID |
| max_cursor | integer | no | default: 0 | 最大游标 |
| counts | integer | no | default: 20 | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| aweme_list[].aweme_id | `$.data.aweme_list[].aweme_id` | 作品 ID | video.md 全部端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 合辑不存在 | STOP | 0 | 无替代 |
