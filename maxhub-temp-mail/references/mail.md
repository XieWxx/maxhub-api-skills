# Temp Mail / 临时邮箱

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖
生成临时邮箱、获取邮件列表、读取邮件详情 —— 围绕"临时邮箱"的全部操作入口。**token 是本文件的核心链式字段**，从 get_temp_email_address 产出，供后续端点使用。

> 🔒 **安全警告**：所有请求会将 `MAXHUB_API_KEY` 和查询数据传输到 `https://www.aconfig.cn`。禁止在日志、提示词或客户端存储中暴露 API Key、Bearer Token、邮箱地址或邮件内容。临时邮箱数据通过第三方基础设施传输，无端到端加密。

> ⚠️ **邮箱凭证**：`get_temp_email_address` 返回的 token、password、email_address 等信息**请用户自行保存**，Agent 不应代为存储，平台无法帮助找回。

## 端点索引 (Endpoint Index)
| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| get_temp_email_address | ⭐⭐⭐ 首选 | 生成临时邮箱地址（**链式起点**） | GET | /api/v1/temp_mail/v1/get_temp_email_address | low |
| get_emails_inbox | ⭐⭐⭐ 首选 | 用 token 获取邮件列表 | GET | /api/v1/temp_mail/v1/get_emails_inbox | low |
| get_email_by_id | ⭐⭐ 条件 | 用 token + message_id 获取邮件详情 | GET | /api/v1/temp_mail/v1/get_email_by_id | low |

## 链式调用图谱 (Chain Recipes · 本文件内)

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 获取邮箱 + 查看收件箱 | get_temp_email_address → get_emails_inbox | `$.data.token` → `token` | 第 1 步失败：STOP；第 2 步失败：返回邮箱信息 + "收件箱暂不可取" |
| 获取邮箱 + 等待邮件 | get_temp_email_address → （等待用户通知收到邮件）→ get_emails_inbox | `$.data.token` → `token` | 第 1 步失败：STOP |
| 查看邮件列表 + 读邮件详情 | get_emails_inbox → get_email_by_id | `$.data.emails[].message_id` → `message_id` | 第 1 步空：返回"暂无邮件"；第 2 步失败：返回邮件列表 + "详情暂不可取" |
| 完整流程 | get_temp_email_address → get_emails_inbox → get_email_by_id | token → message_id 接力 | 任意中间步失败：返回截止失败前的数据 |

## 跨 reference 链路 (In-Chain)
- 本 skill 仅有 mail.md 一个领域文件，无跨 reference 链路

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项；通用规则见此处。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**
- **禁止**：❌ 改路径段 ❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改 token / message_id 重试

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

### get_temp_email_address — 获取临时邮箱地址

**Full path:** `/api/v1/temp_mail/v1/get_temp_email_address`
**Method:** GET · **Risk:** low

#### 用途
生成一个临时邮箱地址。**链式调用的起点**——产出 token 供后续端点使用。该邮箱不会被删除，也不会被其他人使用，但只能接收邮件，无法发送。

#### 何时使用 / 不使用
- ✅ 用户需要一个临时邮箱来注册或接收邮件
- ✅ 链式起点：生成 token → get_emails_inbox / get_email_by_id
- ❌ 想查看已有邮箱的邮件 → 直接用 get_emails_inbox（需已有 token）
- ❌ 想发送邮件 → 本 skill 不支持

#### 输入 (IN)
无参数。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| token | `$.data.token` | 邮箱 Bearer Token（**核心链式字段**） | get_emails_inbox / get_email_by_id |
| email_address | `$.data.email_address` | 邮箱地址 | 直接交付用户 |
| domain | `$.data.domain` | 邮箱域名 | 仅展示 |
| name | `$.data.name` | 邮箱用户名 | 仅展示 |
| password | `$.data.password` | 邮箱密码 | 直接交付用户自行保存 |

> ⚠️ **安全提醒**：token、password、email_address 为敏感信息，必须提醒用户自行保存，Agent 不应代为存储。平台无法帮助找回这些信息。

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代（邮箱生成无替代端点） |
| 业务 code≠0 | 邮箱服务不可用 | 读 `message_zh` 告知用户 | 0 | — |

---

### get_emails_inbox — 获取邮件列表

**Full path:** `/api/v1/temp_mail/v1/get_emails_inbox`
**Method:** GET · **Risk:** low

#### 用途
获取指定临时邮箱的收件箱邮件列表。需提供 `get_temp_email_address` 返回的 token。

#### 何时使用 / 不使用
- ✅ 已通过 get_temp_email_address 取得 token，想查看收件箱
- ✅ 链式中间步：为 get_email_by_id 提供 message_id
- ❌ 不知 token → 先调用 get_temp_email_address
- ❌ 想看具体邮件内容 → 用 get_email_by_id

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| token | string | yes | — | 邮箱 Bearer Token（从 get_temp_email_address 获取） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| emails[].message_id | `$.data.emails[].message_id` | 邮件 ID | get_email_by_id.message_id |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 401 | token 无效/过期 | STOP，提示用户重新生成邮箱 | 0 | — |
| 空结果 | 暂无邮件 | 返回"暂无邮件"，建议用户稍后再查 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |

---

### get_email_by_id — 获取邮件详情

**Full path:** `/api/v1/temp_mail/v1/get_email_by_id`
**Method:** GET · **Risk:** low

#### 用途
通过邮件 ID 获取指定邮件的完整内容。需提供 token 和 message_id。

#### 何时使用 / 不使用
- ✅ 已通过 get_emails_inbox 取得 message_id，想看邮件详情
- ❌ 不知 message_id → 先调用 get_emails_inbox
- ❌ 只想看邮件列表 → 用 get_emails_inbox

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| token | string | yes | — | 邮箱 Bearer Token（从 get_temp_email_address 获取） |
| message_id | string | yes | — | 邮件 ID（从 get_emails_inbox 获取） |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 邮件完整数据 | 直接交付用户 |

#### 错误处理 (ERR · 端点特化)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 401 | token 无效/过期 | STOP，提示用户重新生成邮箱 | 0 | — |
| 404 | message_id 不存在 | STOP | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 无替代 |
