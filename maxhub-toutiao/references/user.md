# Toutiao Users / 今日头条 用户

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
用户信息、用户 ID 提取 —— 围绕"用户"的全部读取入口（App 端）。**user_id 多在本文件首步产出**（app_get_user_id 是已知用户主页 URL 时的链式入口）。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| app_get_user_id | ⭐⭐⭐ 首选 | 用用户主页 URL 提取 user_id（**URL→user_id 入口**） | GET | /api/v1/toutiao/app/get_user_id | low |
| app_get_user_info | ⭐⭐⭐ 首选 | 用 user_id 取用户信息 | GET | /api/v1/toutiao/app/get_user_info | low |

## 链式调用图谱 (Chain Recipes)

| 用户目标 | 链路 | 字段流 | 容错 |
|---------|------|-------|------|
| 用户主页 URL → 用户信息 | app_get_user_id → app_get_user_info | `$.data.user_id` → `user_id` | 第 1 步失败：STOP |
| 文章作者 → 用户信息 | post.md app_get_article_info → app_get_user_info | `$.data.user_id` → `user_id` | 跨文件链路 |

## 跨 reference 链路 (In-Chain)
- **流入本文件**：`post.md` 的 app_get_article_info / app_get_video_info 输出 `$.data.user_id` → 本文件

## 错误处理契约

> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 通用规则
- 404/410 → 防臆造自检后 STOP
- 400/422 → 防臆造自检后修正重试 ≤1 次
- 401/402/403 → STOP
- 429 → 退避重试 ≤2 次
- 5xx → 等 3s 重试 ≤1 次
- 业务 code≠0 → 读 message_zh，不重试

---

## 端点详情

### app_get_user_id — 从用户主页获取 user_id

**Full path:** `/api/v1/toutiao/app/get_user_id`
**Method:** GET · **Risk:** low

#### 用途
从今日头条用户主页链接中提取 user_id。**已知用户主页 URL 时的链式入口**——把 URL 转换为 user_id。

#### 何时使用 / 不使用
- ✅ 用户提供头条用户主页链接
- ✅ 链式起点：URL → user_id
- ❌ 已知 user_id → 直接用 app_get_user_info

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_profile_url | string | yes | startsWith=`https://www.toutiao.com/c/user/` | 用户主页链接 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user_id | `$.data.user_id` | 用户 ID | app_get_user_info |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | URL 格式错 | 告知用户检查 URL | 0 | — |
| 404 | 用户不存在 | STOP | 0 | 无替代 |

---

### app_get_user_info — 获取用户信息

**Full path:** `/api/v1/toutiao/app/get_user_info`
**Method:** GET · **Risk:** low

#### 用途
获取指定用户的完整信息（App 端）。

#### 何时使用 / 不使用
- ✅ 已知 user_id，想看用户信息
- ❌ 只有用户主页 URL → 先用 app_get_user_id

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| user_id | string | yes | 纯数字字符串 | 用户 ID，形如 `1352838578180211` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| user_id | `$.data.user_id` | 用户 ID（回显） | 复用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 用户不存在 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |
