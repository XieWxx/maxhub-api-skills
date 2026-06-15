# Bilibili Comments & Danmaku / B站 评论与弹幕

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
视频评论、二级回复、弹幕 —— 围绕"评论与弹幕"的全部读取入口。含 App 端和 Web 端双端。

> 🔒 **Security:** All requests transmit your `MAXHUB_API_KEY` and query data to `https://www.aconfig.cn`. Never expose API keys in logs, prompts, or client-side storage.

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| fetch_video_comments_web | ⭐⭐⭐ 首选 | 用 bv_id 取视频评论（Web 端，**评论入口**） | GET | /api/v1/bilibili/web/fetch_video_comments | low |
| fetch_comment_reply | ⭐⭐ 条件 | 用 bv_id+rpid 取评论回复（Web 端） | GET | /api/v1/bilibili/web/fetch_comment_reply | low |
| fetch_video_danmaku | ⭐⭐ 条件 | 用 cid 取视频弹幕 | GET | /api/v1/bilibili/web/fetch_video_danmaku | low |
| fetch_video_comments_app | ⭐ 条件 | 用 av_id/bv_id 取视频评论（App 端，oneOf 入口） | GET | /api/v1/bilibili/app/fetch_video_comments | low |
| fetch_reply_detail | ⭐ 条件 | 用 root+av_id/bv_id 取二级回复（App 端） | GET | /api/v1/bilibili/app/fetch_reply_detail | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看视频评论 | fetch_video_comments_web | bv_id 直接输入 | 失败：降级到 fetch_video_comments_app |
| 看评论 + 回复 | fetch_video_comments_web → fetch_comment_reply | `$.data.replies[].rpid` → `rpid`，bv_id 复用 | 第 2 步失败：返回评论 + "回复暂不可取" |
| 看视频 + 评论 + 弹幕 | 跳自 `video.md` → fetch_video_comments_web + fetch_video_danmaku（可并行） | bv_id + cid 分别输入 | 任一失败：返回另一份 + 告知缺失 |
| App 端看评论 + 回复 | fetch_video_comments_app → fetch_reply_detail | `$.data.replies[].rpid` → `root`，av_id/bv_id 复用 | 第 2 步失败：返回评论 + "回复暂不可取" |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`video.md` 的多个端点输出 `$.data.bvid` → 本文件 `bv_id`
- **流入本文件**：`video.md` 的多个端点输出 `$.data.cid` → 本文件 `cid`（弹幕端点）
- **流出本文件**：评论中的用户信息 → `user.md`（如有 uid/mid 字段）

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- **第 2 步：自检通过后**才能 STOP 并报告"资源不存在"
- **禁止**：❌ 改路径段 ❌ 切换平台前缀 ❌ 拼接新路径

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP

### 鉴权错误（401）/ 余额（402）/ 权限（403）
- **行动**：**STOP**，按通用规则处理

### 限流（429）
- **行动**：读 `Retry-After` 头退避；最多重试 2 次

### 上游故障（500/502/503/504）
- **行动**：等 3 秒重试 1 次 → 仍失败走端点级"降级/替换"

### 网络超时 / DNS
- **行动**：**STOP**

### 业务错误（HTTP 200 且 `code != 0`）
- **行动**：读 `message_zh`/`message`；不要重试

---

## 端点详情

### fetch_video_comments_web — 获取视频评论（Web 端）

**Full path:** `/api/v1/bilibili/web/fetch_video_comments`
**Method:** GET · **Risk:** low

#### 用途
用 bv_id 获取视频一级评论列表（含分页）。**评论入口首选端点**。

#### 何时使用 / 不使用
- ✅ 已知 bv_id，想看视频评论
- ✅ 链式中间步：为 fetch_comment_reply 提供 rpid
- ❌ 想看二级回复 → 链式调用 fetch_comment_reply
- ❌ 没有 bv_id → 先调 video.md 的端点获取
- ❌ App 端 → fetch_video_comments_app

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| bv_id | string | yes | pattern=`^BV[a-zA-Z0-9]+$` | BV号，如 `BV1M1421t7hT` |
| pn | integer | no | ≥1 | 页码（default: 1） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| replies[].rpid | `$.data.replies[].rpid` | 一级评论 ID | fetch_comment_reply.rpid / fetch_reply_detail.root |
| replies[].content.message | `$.data.replies[].content.message` | 评论内容 | 仅展示 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | bv_id 不存在 | STOP | 0 | — |
| 空数据 | 该视频暂无评论 | 返回"暂无评论" | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 降级：fetch_video_comments_app（如有 av_id/bv_id） |

---

### fetch_comment_reply — 获取评论回复（Web 端）

**Full path:** `/api/v1/bilibili/web/fetch_comment_reply`
**Method:** GET · **Risk:** low

#### 用途
用 bv_id + rpid 获取指定一级评论的回复列表（含分页）。

#### 何时使用 / 不使用
- ✅ 已通过 fetch_video_comments_web 取得 rpid
- ✅ 用户明确想看某条评论的回复
- ❌ 想看一级评论 → fetch_video_comments_web
- ❌ App 端 → fetch_reply_detail

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| bv_id | string | yes | pattern=`^BV[a-zA-Z0-9]+$` | BV号 |
| rpid | string | yes | 纯数字字符串 | 回复ID（一级评论的 rpid），如 `237109455120` |
| pn | integer | no | ≥1 | 页码（default: 1） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| replies[].content.message | `$.data.replies[].content.message` | 回复内容 | 仅展示 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | rpid 不存在 | STOP | 0 | — |
| 空数据 | 该评论暂无回复 | 返回"暂无回复" | 0 | — |

---

### fetch_video_danmaku — 获取视频弹幕

**Full path:** `/api/v1/bilibili/web/fetch_video_danmaku`
**Method:** GET · **Risk:** low

#### 用途
用 cid 获取视频实时弹幕数据。

#### 何时使用 / 不使用
- ✅ 已知 cid，想看视频弹幕
- ✅ 用户明确提及"弹幕"
- ❌ 没有 cid → 先调 video.md 的端点获取
- ❌ 想看评论 → fetch_video_comments_web

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| cid | string | yes | 纯数字字符串 | 作品cid，如 `1639235405` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 弹幕数据 | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | cid 不存在 | STOP | 0 | — |
| 空数据 | 该视频暂无弹幕 | 返回"暂无弹幕" | 0 | — |

---

### fetch_video_comments_app — 获取视频评论（App 端）

**Full path:** `/api/v1/bilibili/app/fetch_video_comments`
**Method:** GET · **Risk:** low

#### 用途
用 av_id 或 bv_id 获取视频评论（App 端）。**oneOf 入口**——av_id 与 bv_id 二选一。Web 端失败时的降级端点。

#### 何时使用 / 不使用
- ✅ Web 端 fetch_video_comments_web 失败时的降级
- ✅ 已知 av_id（AV号）
- ❌ 已有 bv_id 且 Web 端可用 → 优先用 fetch_video_comments_web
- ❌ 不确定用 av_id 还是 bv_id → 传其中一个，不要同时传

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| av_id | string | oneOf(av_id, bv_id) | 纯数字字符串 | AV号，如 `115568241811221` |
| bv_id | string | oneOf(av_id, bv_id) | pattern=`^BV[a-zA-Z0-9]+$` | BV号，如 `BV18SCrBGE9E` |
| mode | integer | no | enum=`2,3` | 排序：3=热门，2=时间（default: 3） |
| next_offset | integer | no | — | 分页游标（default: 1） |

> **二选一逻辑**：av_id 与 bv_id 必须传且只传一个。同时传 → 422；都不传 → 422。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| replies[].rpid | `$.data.replies[].rpid` | 一级评论 ID | fetch_reply_detail.root |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 422 | av_id/bv_id 同时传或都未传 | 修正后重试 | ≤1 次 | — |
| 404 | 视频不存在 | STOP | 0 | — |

---

### fetch_reply_detail — 获取二级回复（App 端）

**Full path:** `/api/v1/bilibili/app/fetch_reply_detail`
**Method:** GET · **Risk:** low

#### 用途
用 root + av_id/bv_id 获取二级回复（App 端）。Web 端 fetch_comment_reply 失败时的降级端点。

#### 何时使用 / 不使用
- ✅ Web 端 fetch_comment_reply 失败时的降级
- ✅ 已知 root（一级评论 ID）和 av_id/bv_id
- ❌ 已有 bv_id + rpid 且 Web 端可用 → 优先用 fetch_comment_reply

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| root | string | yes | 纯数字字符串 | 一级评论ID，如 `241743663521` |
| av_id | string | no | 纯数字字符串 | AV号（与 bv_id 二选一） |
| bv_id | string | no | pattern=`^BV[a-zA-Z0-9]+$` | BV号（与 av_id 二选一） |
| next_offset | integer | no | — | 下一页游标（default: 0） |
| ps | integer | no | ≥1 | 每页数量（default: 20） |

> **av_id/bv_id 二选一**：建议传其中一个，不要同时传。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 二级回复列表 | 直接交付用户 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | root 不存在 | STOP | 0 | — |
| 空数据 | 该评论暂无回复 | 返回"暂无回复" | 0 | — |
