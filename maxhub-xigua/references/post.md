# Xigua Posts / 西瓜视频 内容

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
视频详情（V1/V2）、播放链接、评论列表、搜索视频 —— 围绕"内容"的全部读取入口。**item_id 与 user_id 多在本文件首步产出**，是其他链式调用的常见起点。

> ⚠️ **V1 vs V2 差异**：`fetch_one_video`（V1）信息较少但含相关视频推荐；`fetch_one_video_v2`（V2）信息全面但无相关推荐。按需选择，详见各端点说明。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| fetch_one_video | ⭐⭐ 条件 | 用 item_id 取视频数据（V1，含相关推荐但缺标题） | GET | /api/v1/xigua/app/v2/fetch_one_video | low |
| fetch_one_video_v2 | ⭐⭐⭐ 首选 | 用 item_id 取视频数据（V2，信息全面，**链式起点**） | GET | /api/v1/xigua/app/v2/fetch_one_video_v2 | low |
| fetch_one_video_play_url | ⭐⭐⭐ 首选 | 用 item_id 取视频播放链接（已解码，可直接使用） | GET | /api/v1/xigua/app/v2/fetch_one_video_play_url | low |
| fetch_video_comment_list | ⭐⭐ 条件 | 用 item_id 取视频评论列表 | GET | /api/v1/xigua/app/v2/fetch_video_comment_list | low |
| search_video | ⭐⭐⭐ 首选 | 按关键词搜索视频（**内容冷启动入口**） | GET | /api/v1/xigua/app/v2/search_video | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看视频详情 + 评论 | fetch_one_video_v2 → fetch_video_comment_list | `$.data.item_id` → `item_id`（item_id 直接复用） | 第 1 步失败：STOP；第 2 步失败：返回视频详情 + "评论暂不可取" |
| 看视频 + 播放链接 | fetch_one_video_v2 → fetch_one_video_play_url | item_id 复用 | 第 2 步 5xx：降级到 V2 中 Base64 编码的播放地址（需自行解码） |
| 看视频 + 相关推荐 | fetch_one_video（V1）→ 取相关视频列表 | V1 返回含相关视频信息 | V1 缺标题等信息，需结合 V2 使用 |
| 搜索 → 视频详情 | search_video → fetch_one_video_v2 | `$.data.data[].item_id` → `item_id` | 第 2 步失败：返回搜索列表 + "详情暂不可取" |
| 搜索 → 视频播放 | search_video → fetch_one_video_play_url | `$.data.data[].item_id` → `item_id` | 同上 |
| 看视频 + 作者主页 | fetch_one_video_v2 → 跳转 `user.md` 的 fetch_user_info | `$.data.user.user_id` → `user_id` | 跨文件链路，详见 user.md |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`user.md` 的 `fetch_user_post_list` 输出 `$.data.data[].item_id` → 本文件多个端点的 `item_id`
- **流出本文件**：`$.data.user.user_id` → `user.md` 全部 user 系端点的 `user_id`
- **流出本文件**：`fetch_video_comment_list` 输出 `$.data.comments[].user_id` → `user.md`

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项；通用规则见此处。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**
- **禁止**：❌ 改路径段（v2→v1 试探）❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改 item_id 重试

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP

### 鉴权错误（401）→ **STOP**，提示用户检查 API Key（https://www.aconfig.cn/console）
### 余额 / 付费（402）→ **STOP**，告知用户充值（https://www.aconfig.cn/billing）
### 权限错误（403）→ **STOP**，按子场景告知用户去控制台处理
### 限流（429）→ 读 `Retry-After` 头退避；最多重试 2 次
### 上游故障（500/502/503/504）→ 等 3 秒重试 1 次 → 仍失败走端点级"降级/替换"
### 网络超时 → **STOP**
### 业务错误（HTTP 200 且 `code != 0`）→ 读 `message_zh`/`message` 报告用户；不重试

---

## 端点详情

### fetch_one_video — 获取视频数据 V1

**Full path:** `/api/v1/xigua/app/v2/fetch_one_video`
**Method:** GET · **Risk:** low

#### 用途
获取单个视频数据（V1 版本）。信息较少，不包含标题等信息，但包含相关视频推荐信息。播放地址为 Base64 编码，需前端解码或使用 `fetch_one_video_play_url` 获取明文链接。

#### 何时使用 / 不使用
- ✅ 需要相关视频推荐信息
- ✅ V2 端点 5xx 时的降级替代
- ❌ 需要完整信息（标题等）→ 用 `fetch_one_video_v2`
- ❌ 只需要播放链接 → 用 `fetch_one_video_play_url`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| item_id | string | yes | 纯数字字符串 | 视频 ID，形如 `7354954305222377999` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| item_id | `$.data.item_id` | 视频 ID（回显） | 本文件多端点 |
| user.user_id | `$.data.user.user_id` | 视频作者用户 ID | user.md 全部 user 系端点 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 视频不存在/已删除 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | **降级**：改用 `fetch_one_video_v2`（同 item_id），但无相关推荐 |

---

### fetch_one_video_v2 — 获取视频数据 V2

**Full path:** `/api/v1/xigua/app/v2/fetch_one_video_v2`
**Method:** GET · **Risk:** low

#### 用途
获取单个视频数据（V2 版本）。信息全面，包含标题等完整信息，但不包含相关视频推荐。**链式调用的常见起点**——item_id 与 author.user_id 从此处产出。播放地址为 Base64 编码，需前端解码或使用 `fetch_one_video_play_url` 获取明文链接。

#### 何时使用 / 不使用
- ✅ 用户提供 item_id，需要完整视频信息
- ✅ 链式起点：取 item_id 或 author.user_id
- ❌ 需要相关视频推荐 → 用 `fetch_one_video`（V1）
- ❌ 只需要播放链接 → 用 `fetch_one_video_play_url`
- ❌ 想看评论 → 直接用 `fetch_video_comment_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| item_id | string | yes | 纯数字字符串 | 视频 ID，形如 `7354954305222377999` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| item_id | `$.data.item_id` | 视频 ID（回显） | fetch_video_comment_list / fetch_one_video_play_url / fetch_one_video |
| user.user_id | `$.data.user.user_id` | 视频作者用户 ID | user.md 全部 user 系端点 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 视频不存在/已删除 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | **降级**：改用 `fetch_one_video`（同 item_id），但缺标题等信息 |

---

### fetch_one_video_play_url — 获取视频播放链接

**Full path:** `/api/v1/xigua/app/v2/fetch_one_video_play_url`
**Method:** GET · **Risk:** low

#### 用途
获取单个视频的播放链接。返回已解码的明文播放链接，可直接使用。**首选播放链接获取方式**。

#### 何时使用 / 不使用
- ✅ 需要可直接使用的播放链接
- ✅ V1/V2 返回的 Base64 播放地址不便解码时
- ❌ 需要视频完整信息 → 用 `fetch_one_video_v2`
- ❌ 只是想确认视频是否存在 → 用 `fetch_one_video_v2`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| item_id | string | yes | 纯数字字符串 | 视频 ID，形如 `7354954305222377999` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 播放链接明文 | 直接交付用户 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 视频不存在 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | **降级**：改用 `fetch_one_video_v2` 取 Base64 编码播放地址（需自行解码），并显式告知用户 |

---

### fetch_video_comment_list — 获取视频评论列表

**Full path:** `/api/v1/xigua/app/v2/fetch_video_comment_list`
**Method:** GET · **Risk:** low

#### 用途
获取指定视频的评论列表（含分页 offset）。

#### 何时使用 / 不使用
- ✅ 已知 item_id，想看评论
- ❌ 不知 item_id → 先调用 fetch_one_video_v2 或 search_video

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| item_id | string | yes | 纯数字字符串 | 视频 ID |
| offset | integer | no | default=0 | 分页偏移量，首次请求传 0，后续传上一次返回的 offset |
| count | integer | no | default=20 | 每页数量，建议保持默认 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| comments[].user_id | `$.data.comments[].user_id` | 评论者用户 ID | user.md user 系端点 |
| offset | `$.data.offset` | 下一页偏移量 | 同端点的下一次调用 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | item_id 不存在 | STOP | 0 | 无替代（评论无替代来源） |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### search_video — 搜索视频

**Full path:** `/api/v1/xigua/app/v2/search_video`
**Method:** GET · **Risk:** low

#### 用途
按关键词搜索西瓜视频。**内容冷启动入口**——用户没有具体 item_id 时，可从此端点采集 item_id 进入其他链路。支持排序和时长筛选。

#### 何时使用 / 不使用
- ✅ 用户提供关键词想搜索视频
- ✅ 链式起点：批量取 item_id 后并行调用 fetch_one_video_v2 等
- ❌ 用户已给 item_id → 直接 fetch_one_video_v2

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| keyword | string | yes | — | 搜索关键词 |
| offset | integer | no | default=0 | 分页偏移量，首次传 0，后续传上一次返回的 offset |
| order_type | string | no | enum=`["publish_time", "play_count"]` | 排序方式：`publish_time`=最新，`play_count`=最热 |
| min_duration | integer | no | — | 最小时长（秒） |
| max_duration | integer | no | — | 最大时长（秒） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data[].item_id | `$.data.data[].item_id` | 搜索结果视频 ID | 本文件多端点 |
| data[].user_info.user_id | `$.data.data[].user_info.user_id` | 搜索结果作者用户 ID | user.md |
| offset | `$.data.offset` | 下一页偏移量 | 同端点翻页 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 空结果 | 关键词未命中 | STOP，告知用户未找到 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |
