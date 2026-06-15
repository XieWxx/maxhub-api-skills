# Bilibili User / B站 用户 & UP主

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
用户信息、关注/粉丝统计、投稿列表、动态详情、用户ID提取 —— 围绕"用户"的全部读取入口。**uid 多在本文件首步产出**（fetch_get_user_id 是从分享链接提取 uid 的链式入口）。含 App 端和 Web 端双端。

> 🔒 **Security & Privacy:** All requests transmit your `MAXHUB_API_KEY` and query data to `https://www.aconfig.cn`. Only access data you are authorized to process. Handle UIDs, share links, and returned profile/relation data as personal or account-associated information. Never expose API keys in logs, prompts, or client-side storage.

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| fetch_user_profile | ⭐⭐⭐ 首选 | 用 uid 取用户资料（Web 端，**链式起点**） | GET | /api/v1/bilibili/web/fetch_user_profile | low |
| fetch_user_post_videos | ⭐⭐⭐ 首选 | 用 uid 取投稿视频列表（Web 端） | GET | /api/v1/bilibili/web/fetch_user_post_videos | low |
| fetch_get_user_id | ⭐⭐⭐ 首选 | 用分享链接提取用户 ID（**分享链接→uid 入口**） | GET | /api/v1/bilibili/web/fetch_get_user_id | low |
| fetch_user_up_stat | ⭐⭐ 条件 | 用 uid 取 UP主统计数据（播放/获赞） | GET | /api/v1/bilibili/web/fetch_user_up_stat | low |
| fetch_user_relation_stat | ⭐⭐ 条件 | 用 uid 取关注/粉丝数 | GET | /api/v1/bilibili/web/fetch_user_relation_stat | low |
| fetch_user_dynamic | ⭐⭐ 条件 | 用 uid 取用户动态列表 | GET | /api/v1/bilibili/web/fetch_user_dynamic | low |
| fetch_dynamic_detail | ⭐⭐ 条件 | 用 dynamic_id 取动态详情 V1（图文/专栏类） | GET | /api/v1/bilibili/web/fetch_dynamic_detail | low |
| fetch_dynamic_detail_v2 | ⭐⭐ 条件 | 用 dynamic_id 取动态详情 V2（视频类） | GET | /api/v1/bilibili/web/fetch_dynamic_detail_v2 | low |
| fetch_user_info_app | ⭐ 条件 | 用 user_id 取用户信息（App 端） | GET | /api/v1/bilibili/app/fetch_user_info | low |
| fetch_user_videos_app | ⭐ 条件 | 用 user_id 取投稿视频（App 端） | GET | /api/v1/bilibili/app/fetch_user_videos | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 分享链接 → 用户主页 | fetch_get_user_id → fetch_user_profile | `$.data.uid` → `uid` | 第 1 步失败：STOP；第 2 步失败：返回 uid + "资料暂不可取" |
| 用户资料 + 投稿 | fetch_user_profile → fetch_user_post_videos | uid 复用 | 第 2 步失败：返回资料 + "投稿列表暂不可取" |
| 用户资料 + 统计 | fetch_user_profile → fetch_user_up_stat + fetch_user_relation_stat（可并行） | uid 复用 | 任一失败：返回另一份 + 告知缺失 |
| 用户资料 + 动态 | fetch_user_profile → fetch_user_dynamic | uid 复用 | 第 2 步空数据：返回资料 + "暂无动态" |
| 动态列表 → 动态详情 | fetch_user_dynamic → fetch_dynamic_detail / fetch_dynamic_detail_v2 | `$.data.cards[].desc.dynamic_id` → `dynamic_id` | 第 2 步失败：返回动态列表 + "详情暂不可取" |
| 用户投稿 → 视频详情 | fetch_user_post_videos → 跳到 `video.md` fetch_one_video_web | `$.data.list.vlist[].bvid` → `bv_id` | 跨文件链路 |
| 用户投稿 → 收藏夹 | fetch_user_profile → 跳到 `collections.md` fetch_collect_folders | uid 复用 | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`video.md` 的 `fetch_one_video_web` 输出 `$.data.owner.mid` → 本文件全部 uid 系端点
- **流入本文件**：`live.md` 的 `fetch_live_room_detail` 输出 `$.data.uid` → 本文件
- **流入本文件**：`search.md` 的 `fetch_search_by_type`(search_type=user) 输出 `$.data.result[].mid` → 本文件
- **流出本文件**：`fetch_user_post_videos` 的 `$.data.list.vlist[].bvid` → `video.md` 多端点
- **流出本文件**：`fetch_user_dynamic` 的 `$.data.cards[].desc.bvid` → `video.md`
- **流出本文件**：uid → `collections.md` 的 `fetch_collect_folders`

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- **第 2 步：自检通过后**才能 STOP 并报告"资源不存在"
- **禁止**：❌ 改路径段 ❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改 uid 重试
- **替换**：参考 `param-mappings.md` 的"端点替换矩阵"

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP
- **禁止**：❌ 切换端点 ❌ 凭空加参数

### 鉴权错误（401）
- **行动**：**STOP**，提示用户检查或更换 API Key（https://www.aconfig.cn）

### 余额 / 付费（402）
- **行动**：**STOP**，告知用户充值（https://www.aconfig.cn）

### 权限错误（403）
- **行动**：**STOP**，按子场景告知用户处理

### 限流（429）
- **行动**：读 `Retry-After` 头退避；无该头时按指数退避 + jitter；最多重试 2 次

### 上游故障（500/502/503/504）
- **行动**：等 3 秒重试 1 次 → 仍失败走端点级"降级/替换"

### 网络超时 / DNS
- **行动**：**STOP**，向用户报告

### 业务错误（HTTP 200 且 `code != 0`）
- **行动**：读 `message_zh`/`message`；不要把 `data` 当作有效数据；不要重试

---

## 端点详情

### fetch_user_profile — 获取用户资料（Web 端）

**Full path:** `/api/v1/bilibili/web/fetch_user_profile`
**Method:** GET · **Risk:** low

#### 用途
用 uid 获取用户完整资料（昵称、头像、签名、等级等）。**user 系链式调用的常见验证步**。

#### 何时使用 / 不使用
- ✅ 已知 uid，想看用户主页信息
- ✅ 链式中验证 uid 是否有效
- ❌ 想看用户投稿 → fetch_user_post_videos
- ❌ 只有分享链接 → 先 fetch_get_user_id
- ❌ App 端用 user_id → fetch_user_info_app

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | 纯数字字符串 | 用户UID，如 `178360345` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| uid | `$.data.uid` | 用户 UID（回显） | 本文件全部 uid 系端点 / collections.md |
| name | `$.data.name` | 用户昵称 | 仅展示 |
| sign | `$.data.sign` | 个人签名 | 仅展示 |
| level | `$.data.level` | 用户等级 | 仅展示 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在/已注销 | STOP | 0 | 降级：fetch_user_info_app（如有 user_id） |

---

### fetch_user_up_stat — 获取UP主统计数据

**Full path:** `/api/v1/bilibili/web/fetch_user_up_stat`
**Method:** GET · **Risk:** low

#### 用途
用 uid 获取 UP主统计数据（总播放数、总获赞数）。

#### 何时使用 / 不使用
- ✅ 已知 uid，想看 UP主数据概览
- ❌ 想看关注/粉丝数 → fetch_user_relation_stat
- ❌ 想看投稿列表 → fetch_user_post_videos

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | 纯数字字符串 | 用户UID，如 `178360345` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| archive.view | `$.data.archive.view` | 总播放数 | 仅展示 |
| likes | `$.data.likes` | 总获赞数 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |

---

### fetch_user_relation_stat — 获取用户关注/粉丝数

**Full path:** `/api/v1/bilibili/web/fetch_user_relation_stat`
**Method:** GET · **Risk:** low

#### 用途
用 uid 获取用户关注数和粉丝数。

#### 何时使用 / 不使用
- ✅ 已知 uid，想看关注/粉丝数
- ❌ 想看 UP主播放统计 → fetch_user_up_stat

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | 纯数字字符串 | 用户UID，如 `178360345` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| following | `$.data.following` | 关注数 | 仅展示 |
| follower | `$.data.follower` | 粉丝数 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |

---

### fetch_user_post_videos — 获取用户投稿视频（Web 端）

**Full path:** `/api/v1/bilibili/web/fetch_user_post_videos`
**Method:** GET · **Risk:** low

#### 用途
用 uid 获取用户投稿视频列表（含分页）。是 `video.md` 的常见上游产出 bv_id 的端点。

#### 何时使用 / 不使用
- ✅ 已知 uid，想看其投稿视频
- ✅ 链式产出 bvid 给 `video.md`
- ❌ 想看用户资料本身 → fetch_user_profile
- ❌ App 端 → fetch_user_videos_app

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | 纯数字字符串 | 用户UID，如 `178360345` |
| pn | integer | no | ≥1 | 页码（default: 1） |
| order | string | no | enum=`pubdate/click/stow` | 排序（default: pubdate） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list.vlist[].bvid | `$.data.list.vlist[].bvid` | 视频 BV号 | video.md 多端点 |
| list.vlist[].aid | `$.data.list.vlist[].aid` | 视频 AV号 | video.md |
| list.vlist[].title | `$.data.list.vlist[].title` | 视频标题 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |
| 空数据 | 该用户暂无投稿 | 返回"暂无投稿" | 0 | — |

---

### fetch_user_dynamic — 获取用户动态列表

**Full path:** `/api/v1/bilibili/web/fetch_user_dynamic`
**Method:** GET · **Risk:** low

#### 用途
用 uid 获取用户动态列表（含分页）。产出 dynamic_id 和 bvid 供后续端点使用。

#### 何时使用 / 不使用
- ✅ 已知 uid，想看用户动态
- ✅ 链式产出 dynamic_id 给 fetch_dynamic_detail / fetch_dynamic_detail_v2
- ❌ 想看单条动态详情 → 直接用 fetch_dynamic_detail（如有 dynamic_id）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | 纯数字字符串 | 用户UID，如 `178360345` |
| offset | string | no | — | 分页偏移（首次留空，后续用上次响应的 offset） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| cards[].desc.dynamic_id | `$.data.cards[].desc.dynamic_id` | 动态 ID | fetch_dynamic_detail / fetch_dynamic_detail_v2 |
| cards[].desc.bvid | `$.data.cards[].desc.bvid` | 动态关联视频 BV号 | video.md |
| offset | `$.data.offset` | 下一页偏移 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |
| 空数据 | 该用户暂无动态 | 返回"暂无动态" | 0 | — |

---

### fetch_dynamic_detail — 获取动态详情 V1

**Full path:** `/api/v1/bilibili/web/fetch_dynamic_detail`
**Method:** GET · **Risk:** low

#### 用途
用 dynamic_id 获取动态详情 V1。**适用于图文/文字/专栏类动态**（含 favorite/coin 数据）。

#### 何时使用 / 不使用
- ✅ 已知 dynamic_id，且动态类型为图文/文字/专栏
- ✅ 需要 favorite/coin 数据
- ❌ 视频类动态（DYNAMIC_TYPE_AV）→ 用 fetch_dynamic_detail_v2
- ❌ 不确定动态类型 → 先试 V2（更通用）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| dynamic_id | string | yes | 纯数字字符串 | 动态ID，如 `1172584638000922630` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 动态详情（含 favorite/coin） | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | dynamic_id 不存在 | STOP | 0 | — |
| 业务 code≠0 | 动态类型不匹配 | 建议改用 fetch_dynamic_detail_v2 | 0 | fetch_dynamic_detail_v2 |

---

### fetch_dynamic_detail_v2 — 获取动态详情 V2

**Full path:** `/api/v1/bilibili/web/fetch_dynamic_detail_v2`
**Method:** GET · **Risk:** low

#### 用途
用 dynamic_id 获取动态详情 V2。**适用于视频类动态**（含 comment/forward/like 数据，不含 favorite/coin）。

#### 何时使用 / 不使用
- ✅ 已知 dynamic_id，且动态类型为视频类（DYNAMIC_TYPE_AV）
- ✅ 需要 comment/forward/like 数据
- ❌ 图文/专栏类动态 → 用 fetch_dynamic_detail（含 favorite/coin）
- ❌ 不确定动态类型 → 优先试 V2

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| dynamic_id | string | yes | 纯数字字符串 | 动态ID，如 `1172584638000922630` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 动态详情（含 comment/forward/like） | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | dynamic_id 不存在 | STOP | 0 | — |
| 业务 code≠0 | 动态类型不匹配 | 建议改用 fetch_dynamic_detail | 0 | fetch_dynamic_detail |

---

### fetch_get_user_id — 从分享链接提取用户 ID

**Full path:** `/api/v1/bilibili/web/fetch_get_user_id`
**Method:** GET · **Risk:** low

#### 用途
从用户分享链接（如 b23.tv 短链）提取用户 uid。**分享链接→uid 的链式入口**。

#### 何时使用 / 不使用
- ✅ 用户提供 b23.tv 分享链接
- ✅ 链式起点：share_link → uid
- ❌ 已知 uid → 直接 fetch_user_profile
- ❌ 用户提供的是视频链接 → 用 video.md 的 fetch_one_video_v3

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| share_link | string | yes | startsWith=`https://b23.tv/` | 用户分享链接，如 `https://b23.tv/1ZuB5NC` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| uid | `$.data.uid` | 用户 UID | 本文件全部 uid 系端点 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 分享链接格式错 | 让用户确认链接 | 0 | — |
| 404 | 链接无效/已过期 | STOP | 0 | — |

---

### fetch_user_info_app — 获取用户信息（App 端）

**Full path:** `/api/v1/bilibili/app/fetch_user_info`
**Method:** GET · **Risk:** low

#### 用途
用 user_id 获取用户信息（App 端）。Web 端失败时的降级端点。

#### 何时使用 / 不使用
- ✅ Web 端 fetch_user_profile 失败时的降级
- ✅ 已知 user_id（App 端格式）
- ❌ 已有 uid → 优先用 fetch_user_profile（Web 端）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | 纯数字字符串 | 用户ID，如 `203680252` |

> **注意**：App 端参数名为 `user_id`，Web 端为 `uid`，两者语义相同但参数名不同。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 用户信息（含粉丝数、关注数、投稿数等） | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |

---

### fetch_user_videos_app — 获取用户投稿视频（App 端）

**Full path:** `/api/v1/bilibili/app/fetch_user_videos`
**Method:** GET · **Risk:** low

#### 用途
用 user_id 获取用户投稿视频列表（App 端，含分页和过滤）。Web 端失败时的降级端点。

#### 何时使用 / 不使用
- ✅ Web 端 fetch_user_post_videos 失败时的降级
- ✅ 已知 user_id（App 端格式）
- ❌ 已有 uid → 优先用 fetch_user_post_videos（Web 端）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | 纯数字字符串 | 用户ID，如 `203680252` |
| post_filter | string | no | enum=`archive/season/contribute` | 过滤类型（default: archive） |
| page | integer | no | ≥1 | 页码（default: 1） |
| ps | integer | no | ≥1 | 每页数量（default: 20） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list.vlist[].bvid | `$.data.list.vlist[].bvid` | 视频 BV号 | video.md 多端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |
| 空数据 | 该用户暂无投稿 | 返回"暂无投稿" | 0 | — |
