# Bilibili Live / B站 直播

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
直播间信息、直播流、分区主播、分区列表 —— 围绕"直播"的全部读取入口。**room_id 从 fetch_live_streamers / fetch_all_live_areas 产出**，是直播详情链路的常见起点。

> 🔒 **Security:** All requests transmit your `MAXHUB_API_KEY` and query data to `https://www.aconfig.cn`. Never expose API keys in logs, prompts, or client-side storage.

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| fetch_live_room_detail | ⭐⭐⭐ 首选 | 用 room_id 取直播间详情（**直播入口**） | GET | /api/v1/bilibili/web/fetch_live_room_detail | low |
| fetch_all_live_areas | ⭐⭐ 条件 | 取所有直播分区（**area_id 入口**，无参数） | GET | /api/v1/bilibili/web/fetch_all_live_areas | low |
| fetch_live_streamers | ⭐⭐ 条件 | 用 area_id 取分区主播列表 | GET | /api/v1/bilibili/web/fetch_live_streamers | low |
| fetch_live_videos | ⭐ 条件 | 用 room_id 取直播视频流 | GET | /api/v1/bilibili/web/fetch_live_videos | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看直播间详情 | fetch_live_room_detail | room_id 直接输入 | 失败：STOP |
| 分区列表 → 分区主播 | fetch_all_live_areas → fetch_live_streamers | `$.data.data[].id` → `area_id` | 第 1 步失败：STOP；第 2 步失败：返回分区列表 + "主播列表暂不可取" |
| 分区主播 → 直播间详情 | fetch_live_streamers → fetch_live_room_detail | `$.data.list[].roomid` → `room_id` | 第 2 步失败：返回主播列表 + "直播间详情暂不可取" |
| 直播间 → 主播主页 | fetch_live_room_detail → 跳到 `user.md` fetch_user_profile | `$.data.uid` → `uid` | 跨文件链路 |
| 搜索直播 → 直播间 | 跳自 `search.md` fetch_search_by_type(live) → fetch_live_room_detail | `$.data.result[].roomid` → `room_id` | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`search.md` 的 `fetch_search_by_type`(search_type=live) 输出 `$.data.result[].roomid` → 本文件 `room_id`
- **流出本文件**：`fetch_live_room_detail` 的 `$.data.uid` → `user.md` uid 系端点
- **流出本文件**：`fetch_live_streamers` 的 `$.data.list[].roomid` → 本文件 `fetch_live_room_detail` / `fetch_live_videos`

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- **第 2 步：自检通过后**才能 STOP 并报告

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次

### 鉴权/余额/权限/限流/上游/网络/业务错误
- 按 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview) 通用规则处理

---

## 端点详情

### fetch_live_room_detail — 获取直播间详情

**Full path:** `/api/v1/bilibili/web/fetch_live_room_detail`
**Method:** GET · **Risk:** low

#### 用途
用 room_id 获取直播间详情（标题、主播、在线人数等）。**直播链路入口**。

#### 何时使用 / 不使用
- ✅ 已知 room_id，想看直播间信息
- ✅ 链式起点：取主播 uid
- ❌ 没有 room_id → 先调 fetch_live_streamers 或 search.md 的搜索端点
- ❌ 想看直播流 → fetch_live_videos

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| room_id | string | yes | 纯数字字符串 | 直播间ID，如 `22816111` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| uid | `$.data.uid` | 主播 uid | user.md uid 系端点 |
| title | `$.data.title` | 直播间标题 | 仅展示 |
| online | `$.data.online` | 在线人数 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | room_id 不存在/未开播 | STOP | 0 | — |

---

### fetch_live_videos — 获取直播视频流

**Full path:** `/api/v1/bilibili/web/fetch_live_videos`
**Method:** GET · **Risk:** low

#### 用途
用 room_id 获取直播间视频流地址。

#### 何时使用 / 不使用
- ✅ 已知 room_id，需要直播流地址
- ❌ 想看直播间详情 → fetch_live_room_detail
- ❌ 直播间未开播 → 可能返回空数据

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| room_id | string | yes | 纯数字字符串 | 直播间ID，如 `1815229528` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 直播视频流地址 | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | room_id 不存在 | STOP | 0 | — |
| 空数据 | 直播间未开播 | 告知用户 | 0 | — |

---

### fetch_live_streamers — 获取分区直播主播

**Full path:** `/api/v1/bilibili/web/fetch_live_streamers`
**Method:** GET · **Risk:** low

#### 用途
用 area_id 获取指定分区正在直播的主播列表（含分页）。产出 room_id 供后续端点使用。

#### 何时使用 / 不使用
- ✅ 已知 area_id，想看该分区的主播
- ✅ 链式起点：area_id → roomid
- ❌ 不知道 area_id → 先调 fetch_all_live_areas
- ❌ 已知 room_id → 直接 fetch_live_room_detail

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| area_id | string | yes | 纯数字字符串 | 直播分区ID，如 `9` |
| pn | integer | no | ≥1 | 页码（default: 1） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| list[].roomid | `$.data.list[].roomid` | 直播间 ID | fetch_live_room_detail / fetch_live_videos |
| list[].uname | `$.data.list[].uname` | 主播昵称 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | area_id 不存在 | STOP | 0 | — |
| 空数据 | 该分区暂无直播 | 返回"该分区暂无直播" | 0 | — |

---

### fetch_all_live_areas — 获取所有直播分区

**Full path:** `/api/v1/bilibili/web/fetch_all_live_areas`
**Method:** GET · **Risk:** low

#### 用途
获取所有直播分区列表（无参数）。**area_id 入口**——分区 ID 从此处产出。

#### 何时使用 / 不使用
- ✅ 用户想浏览直播分区
- ✅ 链式起点：取 area_id 给 fetch_live_streamers
- ❌ 已知 area_id → 直接 fetch_live_streamers

#### 输入 (IN)
无参数

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data[].id | `$.data.data[].id` | 分区 ID | fetch_live_streamers.area_id |
| data[].name | `$.data.data[].name` | 分区名称 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |
