# Xigua Users / 西瓜视频 用户

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
用户信息、用户作品列表 —— 围绕"用户"的全部读取入口。**user_id 多在本文件首步产出**（fetch_user_info 是已知 user_id 时的链式入口）。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| fetch_user_info | ⭐⭐⭐ 首选 | 用 user_id 取用户信息 | GET | /api/v1/xigua/app/v2/fetch_user_info | low |
| fetch_user_post_list | ⭐⭐⭐ 首选 | 用 user_id 取用户作品列表 | GET | /api/v1/xigua/app/v2/fetch_user_post_list | low |

## 链式调用图谱 (Chain Recipes · 本文件内 + 跨文件)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看用户资料 + 作品 | fetch_user_info → fetch_user_post_list | `$.data.user_id` → `user_id`（user_id 直接复用） | 第 1 步失败：可改用 `post.md` 的 search_video 取候选；第 2 步失败：返回资料 + "作品列表暂不可取" |
| 用户作品 → 视频详情 | fetch_user_post_list → 跳到 `post.md` 的 fetch_one_video_v2 | `$.data.data[].item_id` → `item_id` | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`post.md` 的 `fetch_one_video` / `fetch_one_video_v2` 输出 `$.data.user.user_id` → 本文件全部 user 系端点的 `user_id`
- **流入本文件**：`post.md` 的 `fetch_video_comment_list` 输出 `$.data.comments[].user_id` → 本文件
- **流入本文件**：`post.md` 的 `search_video` 输出 `$.data.data[].user_info.user_id` → 本文件
- **流出本文件**：`fetch_user_post_list` 的 `$.data.data[].item_id` → `post.md` 多端点

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- **第 2 步：自检通过后**才能 STOP 并报告"资源不存在"
- **禁止**：❌ 改路径段 ❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改 user_id 重试

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP

### 鉴权错误（401）→ **STOP**，提示用户检查 API Key
### 余额 / 付费（402）→ **STOP**，告知用户充值
### 权限错误（403）→ **STOP**，按子场景告知用户处理
### 限流（429）→ 读 `Retry-After` 头退避；最多重试 2 次
### 上游故障（500/502/503/504）→ 等 3 秒重试 1 次 → 仍失败走端点级"降级/替换"
### 网络超时 / DNS → **STOP**
### 业务错误（HTTP 200 且 `code != 0`）→ 读 `message_zh`/`message`；不重试

---

## 端点详情

### fetch_user_info — 获取用户信息

**Full path:** `/api/v1/xigua/app/v2/fetch_user_info`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的完整信息（含昵称、头像、简介等）。**user 系链式调用的常见验证步**。

#### 何时使用 / 不使用
- ✅ 已知 user_id，想看用户主页信息
- ✅ 链式中验证 user_id 是否有效
- ❌ 想看用户作品 → fetch_user_post_list（不要先调本端点再调 posts）
- ❌ 不知 user_id → 先用 `post.md` 的 search_video 搜索视频，从结果中取 user_id

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | 纯数字字符串 | 用户 ID，形如 `52712347586` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user_id | `$.data.user_id` | 用户 ID（回显） | 复用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在/已注销 | STOP | 0 | 无替代 |

---

### fetch_user_post_list — 获取用户作品列表

**Full path:** `/api/v1/xigua/app/v2/fetch_user_post_list`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的作品列表（含分页 max_behot_time）。是 `post.md` 的常见上游产出 item_id 的端点。

#### 何时使用 / 不使用
- ✅ 已知 user_id，想看其作品
- ✅ 链式产出 item_id 给 `post.md`
- ❌ 想看用户资料本身 → fetch_user_info

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | 纯数字字符串 | 用户 ID，形如 `1922379661976311` |
| max_behot_time | string | no | — | 分页游标，首次请求留空，后续传上一次返回数据中最后一条的 behot_time |

> **翻页逻辑**：`max_behot_time` 的值取自 JSON 路径 `$.data.data[-1].behot_time`（即 data 数组最后一个元素的 behot_time 值）。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| data[].item_id | `$.data.data[].item_id` | 视频 ID | post.md 多端点 |
| data[].behot_time | `$.data.data[-1].behot_time` | 分页游标（最后一条） | 同端点的下一次调用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | — |
| 空数据 | 该用户暂无作品 | 返回"暂无作品" | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |
