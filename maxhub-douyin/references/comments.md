# Douyin Comments / 抖音评论

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖

视频评论列表（App V3 / Web）、评论回复列表（App V3 / Web）、视频弹幕数据（Web）、创作者弹幕管理列表。**comment_id 多在本文件首步产出**，是评论回复链式调用的起点；aweme_id / item_id 则从 `video.md` 流入。

> 🔒 **安全**：所有请求将 `MAXHUB_API_KEY` 和查询数据传输至 `https://www.aconfig.cn`。禁止在日志、提示词或客户端存储中暴露 API Key。

---

## 端点索引 (Endpoint Index)

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| app_v3_fetch_video_comments | ⭐⭐⭐ 首选 | 用 aweme_id 取视频一级评论列表（App V3，**链式起点**） | GET | /api/v1/douyin/app/v3/fetch_video_comments | low |
| app_v3_fetch_video_comment_replies | ⭐⭐ 条件 | 用 comment_id 取二级回复（仅当用户明确要"回复"） | GET | /api/v1/douyin/app/v3/fetch_video_comment_replies | low |
| web_fetch_video_comments | ⭐ 降级 | Web 版视频一级评论列表 | GET | /api/v1/douyin/web/fetch_video_comments | low |
| web_fetch_video_comment_replies | ⭐ 降级 | Web 版二级回复列表 | GET | /api/v1/douyin/web/fetch_video_comment_replies | low |
| web_fetch_one_video_danmaku | ⭐⭐ 条件 | 取视频弹幕数据（需 duration/start_time/end_time） | GET | /api/v1/douyin/web/fetch_one_video_danmaku | low |
| creator_fetch_video_danmaku_list | ⭐⭐ 条件 | 创作者中心弹幕管理列表（支持排序/筛选） | GET | /api/v1/douyin/creator/fetch_video_danmaku_list | low |

---

## 链式调用图谱 (Chain Recipes)

> 当单个端点无法直接产出用户所需数据时，按下面链路组合调用。`字段流`列指明字段如何从上一步流向下一步，避免 Agent 臆造字段名。

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看评论 + 回复 | app_v3_fetch_video_comments → app_v3_fetch_video_comment_replies | `$.data.comments[].comment_id` → `comment_id`；`$.data.aweme_id` → `item_id` | 第 1 步失败：STOP；第 2 步失败：返回已有评论 + "回复暂不可取" |
| 看视频 + 评论 | video.md → app_v3_fetch_video_comments | `$.data.aweme_id` → `aweme_id` | 跨文件链路，详见 video.md |
| 看评论 + 评论者主页 | app_v3_fetch_video_comments → user.md | `$.data.comments[].user.sec_uid` → `sec_user_id` | 跨文件链路，详见 user.md |
| 看视频 + 弹幕 | video.md → web_fetch_one_video_danmaku | `$.data.aweme_id` → `item_id`；`$.data.duration` → `duration` | 跨文件链路，需 duration 字段 |

---

## 跨 reference 链路 (In-Chain)

- **流入本文件**：`video.md` 的 `app_v3_fetch_one_video` 输出 `$.data.aweme_id` → 本文件评论端点的 `aweme_id`
- **流入本文件**：`video.md` 的 `web_fetch_one_video` 输出 `$.data.aweme_id` + `$.data.duration` → 本文件 `web_fetch_one_video_danmaku` 的 `item_id` + `duration`
- **流出本文件**：`$.data.comments[].comment_id` → 本文件 `app_v3_fetch_video_comment_replies` / `web_fetch_video_comment_replies` 的 `comment_id`
- **流出本文件**：`$.data.comments[].user.sec_uid` → `user.md` 全部 user 系端点的 `sec_user_id`

---

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项；通用规则见此处。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
  - 路径是否在 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 中？
  - Method、参数键名是否符合白名单？
  - 资源 ID（aweme_id/comment_id/item_id）是否来自合法响应字段？
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**，向用户报告
- **禁止**：❌ 改路径段（app/v3→web 试探）❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改资源 ID 重试
- **替换**：参考 [`param-mappings.md`](./param-mappings.md) 的"端点替换矩阵"

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
  - 参数名是否逐字符匹配 IN 表？注意 `aweme_id` vs `item_id` 的区别
  - 必填项是否齐全？
  - 传参方式（query vs body）是否正确？Authorization 头是否正确？
  - **是否有 IN 表外的臆造参数**？
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP
- **禁止**：❌ 切换端点 ❌ 在 IN 表外凭空加参数

### 评论翻页特化规则
- `app_v3_fetch_video_comments` / `app_v3_fetch_video_comment_replies`：首次请求 `cursor=0`，后续使用上次响应中的 `cursor` 值
- `count` 参数建议保持默认值 20，修改可能导致 BUG
- `web_fetch_video_comments` / `web_fetch_video_comment_replies`：翻页逻辑同上

### 弹幕端点特化规则
- `web_fetch_one_video_danmaku`：`start_time` 通常为 0，`end_time` 通常等于 `duration - 1`
- `creator_fetch_video_danmaku_list`：使用 `offset` + `count` 分页（非 cursor），`order_type` 控制排序

---

## 端点详情

---

### app_v3_fetch_video_comments — 获取视频评论列表（App V3）

**Full path:** `/api/v1/douyin/app/v3/fetch_video_comments`
**Method:** GET · **Risk:** low

#### 用途
用 aweme_id 获取视频的一级评论列表（含分页 cursor）。**链式调用的常见起点**——comment_id 从此处产出，供回复端点使用。

#### 何时使用 / 不使用
- ✅ 用户提供 aweme_id（视频 ID）
- ✅ 链式起点：取 comment_id 用于查看回复
- ❌ 想看二级回复 → 直接用 `app_v3_fetch_video_comment_replies`
- ❌ 不知 aweme_id → 先调用 `video.md` 的视频详情端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | yes | — | 视频/作品 ID |
| cursor | integer | no | default: 0 | 翻页游标，第一页为 0，第二页为第一次响应中的 cursor 值 |
| count | integer | no | default: 20 | 每页数量，**建议保持默认**，否则可能出现 BUG |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| comments[].comment_id | `$.data.comments[].comment_id` | 一级评论 ID | app_v3_fetch_video_comment_replies |
| comments[].user.sec_uid | `$.data.comments[].user.sec_uid` | 评论者 sec_uid | user.md 全部 user 系端点 |
| cursor | `$.data.cursor` | 下一页游标 | 同端点的下一次调用 |
| has_more | `$.data.has_more` | 是否还有下一页 | 翻页终止条件 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | aweme_id 不存在 | STOP | 0 | 无（评论无替代来源） |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 `web_fetch_video_comments` |

---

### app_v3_fetch_video_comment_replies — 获取评论回复列表（App V3）

**Full path:** `/api/v1/douyin/app/v3/fetch_video_comment_replies`
**Method:** GET · **Risk:** low

#### 用途
获取指定一级评论下的二级回复列表（含分页 cursor）。

#### 何时使用 / 不使用
- ✅ 已通过 `app_v3_fetch_video_comments` 取得 comment_id
- ❌ 不要传 aweme_id 作为 comment_id（参数名不一样，会 400）
- ❌ 不知 comment_id → 先调用 `app_v3_fetch_video_comments`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| item_id | string | yes | — | 视频/作品 ID（注意：此处参数名为 item_id，非 aweme_id） |
| comment_id | string | yes | — | 一级评论 ID（从 `app_v3_fetch_video_comments` 取） |
| cursor | integer | no | default: 0 | 翻页游标 |
| count | integer | no | default: 20 | 每页数量，**建议保持默认** |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| replies[].user.sec_uid | `$.data.replies[].user.sec_uid` | 回复者 sec_uid | user.md |
| cursor | `$.data.cursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | comment_id 不存在 | STOP | 0 | 无 |
| 400 | item_id 或 comment_id 缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级到 `web_fetch_video_comment_replies` |

---

### web_fetch_video_comments — 获取视频评论列表（Web）

**Full path:** `/api/v1/douyin/web/fetch_video_comments`
**Method:** GET · **Risk:** low

#### 用途
Web 版视频一级评论列表。作为 App V3 版本的降级替代。

#### 何时使用 / 不使用
- ✅ App V3 版本返回 5xx 时降级使用
- ❌ 首选应使用 `app_v3_fetch_video_comments`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| aweme_id | string | yes | — | 视频/作品 ID |
| cursor | integer | no | default: 0 | 翻页游标 |
| count | integer | no | default: 20 | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| comments[].comment_id | `$.data.comments[].comment_id` | 一级评论 ID | web_fetch_video_comment_replies |
| cursor | `$.data.cursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | aweme_id 不存在 | STOP | 0 | 无 |

---

### web_fetch_video_comment_replies — 获取评论回复列表（Web）

**Full path:** `/api/v1/douyin/web/fetch_video_comment_replies`
**Method:** GET · **Risk:** low

#### 用途
Web 版二级回复列表。作为 App V3 版本的降级替代。

#### 何时使用 / 不使用
- ✅ App V3 版本返回 5xx 时降级使用
- ❌ 首选应使用 `app_v3_fetch_video_comment_replies`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| item_id | string | yes | — | 视频/作品 ID |
| comment_id | string | yes | — | 一级评论 ID |
| cursor | integer | no | default: 0 | 翻页游标 |
| count | integer | no | default: 20 | 每页数量 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| replies[].user.sec_uid | `$.data.replies[].user.sec_uid` | 回复者 sec_uid | user.md |
| cursor | `$.data.cursor` | 下一页游标 | 同端点翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | comment_id 不存在 | STOP | 0 | 无 |

---

### web_fetch_one_video_danmaku — 获取视频弹幕数据（Web）

**Full path:** `/api/v1/douyin/web/fetch_one_video_danmaku`
**Method:** GET · **Risk:** low

#### 用途
获取指定视频的弹幕数据，需要视频总时长和时间范围参数。

#### 何时使用 / 不使用
- ✅ 用户想看视频弹幕
- ✅ 已知 item_id 和 duration（可从 `video.md` 的 `web_fetch_one_video` 获取）
- ❌ 不知 duration → 需先从视频详情获取
- ❌ 想管理弹幕（排序/筛选） → 用 `creator_fetch_video_danmaku_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| item_id | string | yes | — | 视频/作品 ID |
| duration | integer | yes | — | 视频总时长（毫秒） |
| end_time | integer | yes | — | 结束时间（通常为 duration - 1） |
| start_time | integer | yes | — | 开始时间（通常为 0） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 弹幕数据为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | duration/end_time/start_time 缺失或无效 | 校正参数重试 | ≤1 次 | — |
| 404 | item_id 不存在 | STOP | 0 | 无 |

---

### creator_fetch_video_danmaku_list — 获取创作者弹幕管理列表

**Full path:** `/api/v1/douyin/creator/fetch_video_danmaku_list`
**Method:** GET · **Risk:** low

#### 用途
创作者中心弹幕管理列表，支持排序和筛选（正常/被屏蔽弹幕）。适用于需要管理弹幕的场景。

#### 何时使用 / 不使用
- ✅ 用户想管理弹幕（排序/筛选/查看被屏蔽弹幕）
- ✅ 已知 item_id
- ❌ 只想看弹幕数据 → 用 `web_fetch_one_video_danmaku`（更简单）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| item_id | string | yes | — | 视频/作品 ID |
| count | integer | no | default: 20, range: 1-100 | 每页弹幕数量 |
| offset | integer | no | default: 0 | 偏移量（分页使用） |
| order_type | integer | no | enum: 1=时间排序, 2=其他排序, default: 1 | 排序类型 |
| is_blocked | boolean | no | default: false | 是否获取被屏蔽的弹幕 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 弹幕列表为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | item_id 不存在 | STOP | 0 | 无 |
