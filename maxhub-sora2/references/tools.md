# Sora2 Tools & Cameo / Sora2 工具与 Cameo 热榜

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
视频生成任务（create_video / get_task_status / get_task_detail）、图片上传（upload_image）、Cameo 全平台热榜（get_cameo_leaderboard）。

> ⚠️ **写入操作**：`create_video` 与 `upload_image` 会消耗配额并产生异步任务。**调用前必须由用户明确确认参数**。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| upload_image | ⚠️ 写入·条件 | 上传图片获 image_id（图生视频前置步） | GET | /api/v1/sora2/upload_image | **high ⚠️** |
| create_video | ⚠️ 写入·条件 | 创建视频生成任务（文生视频 / 图生视频） | GET | /api/v1/sora2/create_video | **high ⚠️** |
| get_task_status | ⭐⭐⭐ 轮询 | 用 task_id 查任务状态（轮询用） | GET | /api/v1/sora2/get_task_status | low |
| get_task_detail | ⭐⭐⭐ 首选 | 用 task_id 查任务详情（含最终视频 URL） | GET | /api/v1/sora2/get_task_detail | low |
| get_cameo_leaderboard | ⭐⭐ 条件 | 取 Cameo 全平台热榜（用户查"热榜/谁最火"时用） | GET | /api/v1/sora2/get_cameo_leaderboard | low |

## 链式调用图谱 (Chain Recipes)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 文生视频 | create_video → 轮询 get_task_status → get_task_detail | `$.data.task_id` → `task_id` 接力 | 任意步失败：把已得 task_id 返回用户，让其后续可继续轮询 |
| 图生视频 | upload_image → create_video → 轮询 get_task_status → get_task_detail | `$.data.image_id` → `image_id`，再 task_id 接力 | upload_image 失败：STOP；之后失败同上 |
| Cameo 热榜 → 用户主页 | get_cameo_leaderboard → 跳到 `user.md` get_user_profile | `$.data.leaderboard[].user_id` → `user_id` | 跨文件 |

### 轮询规则（仅适用于视频生成任务）
- **轮询间隔**：建议 5–10 秒一次
- **状态语义**：
  - `pending` / `running` → **正常进行中**，继续轮询，不视为失败
  - `succeeded` → 成功，调用 get_task_detail 取最终视频
  - `failed` → 真正失败，读 `message_zh` 报告原因
- **轮询上限**：建议 10 分钟封顶；超时后把 task_id 返回用户

### 异步任务最佳实践（推荐）
- create_video → get_task_status 是典型的**长耗时异步任务**（5–10 分钟级别）
- **推荐**：当宿主 Agent 支持子会话/子进程时，用 **spawn 子会话专职轮询**，主会话保持响应能力，避免阻塞用户其他交互
- **次选**：主会话内每 5–10 秒轮询一次，并定期向用户展示进度（"已生成 N 秒，状态 running"）
- **底线**：任意失败都将已得 `task_id` 显式返回给用户，让用户可在新对话中继续轮询，**禁止**因为轮询失败就再次调用 create_video（会重复扣配额）

## 跨 reference 链路 (In-Chain)
- **流出本文件**：`get_cameo_leaderboard` 的 `$.data.leaderboard[].user_id` → `user.md` 全部 user 系端点
- **流出本文件**：`get_task_detail` 的 `$.data.video.post_id`（如有，任务成功后） → `post.md`

## 错误处理契约 (Error Contract · 本文件全端点共享)

> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- **第 2 步：自检通过后**才能 STOP 并报告"任务/资源不存在"
- **禁止**：❌ 改路径段 ❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改 task_id / image_id 重试

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP
- **写入操作特化（create_video / upload_image）**：自检通过后**仍必须重新让用户确认参数**，禁止 Agent 自行修正后静默重试（避免重复扣配额）

### 鉴权错误（401）
- **子场景**：API 令牌无效 / 缺失 / 过期 / 未激活 / 用户不存在
- **行动**：**STOP**，提示用户检查或更换 API Key（https://www.aconfig.cn/console）

### 余额 / 付费（402）⚠️ 写入端点高发
- **子场景**：余额不足（允许免费额度 / 不接受免费额度）
- **行动**：**STOP**，告知用户充值（https://www.aconfig.cn/billing）；**create_video / upload_image 在 402 后禁止任何重试**

### 权限错误（403）
- **子场景**：缺少路由访问权限 / 账户已禁用 / 邮箱未验证 / API Token 权限不足
- **行动**：**STOP**，按子场景告知用户去控制台处理

### 限流（429）
- **行动**：读 Retry-After 退避；无该头时指数退避 + jitter；最多重试 2 次

### 上游故障（500/502/503/504）
- **写入端点（create_video / upload_image）**：等 3s 重试 1 次 → 仍失败 STOP；**禁止重试 ≥2 次**（避免重复扣配额）
- **读端点（get_task_status / get_task_detail / get_cameo_leaderboard）**：等 3s 重试 1 次

### 网络超时 / DNS
- **行动**：**STOP**

### 业务错误（HTTP 200 且 `code != 0`）
- **写入端点失败**：读 `message_zh` 报告（如配额耗尽、内容违规等），不重试
- **轮询端点**：`pending`/`running` 不是错误，仅 `failed` 状态视为失败

---

## 端点详情

### upload_image — 上传图片 ⚠️ 写入操作

**Full path:** `/api/v1/sora2/upload_image`
**Method:** GET · **Risk:** high · **requires_user_confirmation:** true

#### 用途
上传外部图片到 Sora2，获取 `image_id`，作为图生视频时 `create_video` 的入参。**调用前必须由用户明确确认图片来源 URL**。

#### 何时使用 / 不使用
- ✅ 用户明确想做"图生视频"且提供了图片 URL
- ❌ 仅文生视频 → 跳过本端点，直接 create_video
- ❌ 用户没明确确认 URL → 先与用户确认

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| image_url | string | yes | startsWith=`http://` 或 `https://` | 图片 URL（建议 https） |

> ⚠️ **写入操作前置确认**：调用前必须向用户确认 `image_url` 准确无误。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| image_id | `$.data.image_id` | 上传后的图片 ID | create_video.image_id |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400/422 | URL 格式错或图片不可访问 | **不要静默重试**，让用户确认或更换 URL | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | **≤1 次** | 仍失败 STOP（避免重复消耗配额） |
| 业务 code≠0 | 图片违规/类型不支持 | 读 `message_zh` 告知用户 | 0 | — |

---

### create_video — 创建视频生成任务 ⚠️ 写入操作

**Full path:** `/api/v1/sora2/create_video`
**Method:** GET · **Risk:** high · **requires_user_confirmation:** true

#### 用途
创建视频生成任务（文生视频或图生视频）。返回 `task_id`，需通过 `get_task_status` 轮询、`get_task_detail` 取最终视频。**调用前必须由用户明确确认所有参数**。

#### 何时使用 / 不使用
- ✅ 用户明确想生成 Sora2 视频
- ✅ 文生视频：仅传 prompt
- ✅ 图生视频：先调 upload_image 取 image_id，再传入
- ❌ 用户尚未确认提示词/参数 → 先与用户确认
- ❌ 用户只想看现有视频 → 用 post.md 端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| prompt | string | yes | length≤500 | 视频生成提示词 |
| image_id | string | no | — | 图生视频的图片 ID（来自 upload_image） |
| duration | string | no | enum=`["5","10"]`（按上游实际为准） | 视频时长（秒） |
| aspect_ratio | string | no | enum=`["16:9","9:16","1:1"]`（按上游实际为准） | 画幅比例 |

> ⚠️ **写入操作前置确认**：调用前必须向用户确认 `prompt` 和可选参数。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| task_id | `$.data.task_id` | 异步任务 ID | get_task_status / get_task_detail |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400/422 | prompt 缺失/过长、image_id 无效 | **重新让用户确认参数**，禁止自行修正后重试 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | **≤1 次** | 仍失败 STOP（避免重复扣配额） |
| 业务 code≠0（配额耗尽 / 内容违规） | 配额或合规问题 | 读 `message_zh` 告知用户，不重试 | 0 | — |

---

### get_task_status — 获取任务状态

**Full path:** `/api/v1/sora2/get_task_status`
**Method:** GET · **Risk:** low

#### 用途
轮询视频生成任务状态。**配合 create_video 使用**。

#### 何时使用 / 不使用
- ✅ 已通过 create_video 取得 task_id，需要等待结果
- ❌ 已知任务成功 → 用 get_task_detail 直接取详情

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| task_id | string | yes | — | 任务 ID（由 create_video 返回） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| status | `$.data.status` | 任务状态：pending / running / succeeded / failed | 决定是继续轮询还是取详情 |

#### 状态语义
- `pending` / `running` → **正常进行中**，继续轮询，**不视为失败**
- `succeeded` → 成功，调用 get_task_detail
- `failed` → 失败，读 `$.data.message_zh` 报告

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | task_id 不存在/已过期 | STOP | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 把 task_id 返还用户，让其后续继续轮询 |

---

### get_task_detail — 获取任务详情

**Full path:** `/api/v1/sora2/get_task_detail`
**Method:** GET · **Risk:** low

#### 用途
任务成功后取完整详情（含最终视频 URL）。

#### 何时使用 / 不使用
- ✅ get_task_status 返回 `succeeded` 后调用
- ❌ 任务还在 pending/running → 先继续轮询 get_task_status

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| task_id | string | yes | — | 任务 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| video.url | `$.data.video.url` | 最终视频下载链接 | 直接交付用户 |
| video.post_id | `$.data.video.post_id` | 生成作品的 post_id（如已发布到 Sora2） | post.md |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | task_id 不存在 | STOP | 0 | — |
| 业务 code≠0 | 任务未成功 | 提示用户先 get_task_status 确认 succeeded | 0 | 改用 get_task_status |

---

### get_cameo_leaderboard — 获取 Cameo 出镜热榜

**Full path:** `/api/v1/sora2/get_cameo_leaderboard`
**Method:** GET · **Risk:** low

#### 用途
获取 Cameo 全平台热榜，含上榜用户列表与排名。

#### 何时使用 / 不使用
- ✅ 用户问"Cameo 热榜 / 谁最火"等趋势性问题
- ❌ 看某个用户自己的 Cameo 出镜 → user.md 的 get_user_cameo_appearances

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cursor | string | no | — | 分页游标 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| leaderboard[].user_id | `$.data.leaderboard[].user_id` | 上榜用户 ID | user.md user 系端点 |
| cursor | `$.data.cursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |
