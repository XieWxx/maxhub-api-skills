# Param & Field Mapping Index / 参数与字段映射索引

Skill: `maxhub-temp-mail` · Base URL: `https://www.aconfig.cn` · Version: `3.7.2`

> 本文件不重复端点完整说明（详见各 reference 文件），仅承担六个职能：
> 1. **全局红线 + 不支持能力清单**：防臆造的最强约束
> 2. **端点路由索引**：按 ID 快速定位 reference 文件
> 3. **字段流字典**：跨端点链式调用的字段索引
> 4. **错误处理总览 + 端点替换矩阵**：全 skill 共享的错误策略
> 5. **路径合法性硬校验**：以 `endpoints_whitelist.yaml` 为唯一可信源
> 6. **SKILL 更新机制**：详见 [`update.md`](./update.md)

---

## 0. 🚨 全局红线 (Global Forbidden) — 强制约束

1. **路径禁止臆造**：所有路径必须逐字符匹配 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml)；不在清单中 → **STOP**。
2. **404 / 400 必须先做防臆造自检**：见 [§ 3.1](#-31-防臆造自检清单)。
3. **找不到能力必须 STOP 并告知用户**：用户请求临时邮箱不支持的能力 → 直接告知。
4. **替换/降级前必须显式告知用户**；禁止静默降级。
5. **404 / 410 强制 STOP**：禁止自行修改路径段后重试。
6. **业务 `code != 0` 不重试**：读 `message_zh` 报告用户。
7. **仅 404 / 410 + 自检通过**才建议用户更新 SKILL。
8. **邮箱凭证安全**：token、password、email_address 等敏感字段禁止写入日志或提示词。

---

## 0.1 ❌ 本 skill 不支持的能力 (Out of Scope)

| 不支持的能力 | 说明 |
|------------|------|
| 发送邮件 | 临时邮箱仅支持接收，无发送端点 |
| 删除邮箱 | 无删除端点，邮箱不会被自动删除 |
| 修改邮箱设置 | 无修改端点 |
| 永久邮箱 | 仅提供临时邮箱，非永久邮箱服务 |
| 邮件转发 | 无邮件转发功能 |
| 附件下载 | 依赖上游返回，无专用附件下载端点 |
| 充值 / 计费查询 | 在 https://www.aconfig.cn 控制台查询 |
| 多邮箱管理 | 每次调用 get_temp_email_address 生成一个新邮箱 |

> 遇到上述请求 → 直接回复用户："本 skill 暂不支持此能力，临时邮箱仅支持生成邮箱、接收和查看邮件"。

---

## 1. 端点路由索引 (Endpoint Routing Index)

| ID | 一句话用途 | Reference File | Method | Risk |
|----|----------|---------------|--------|------|
| get_temp_email_address | 生成临时邮箱地址（**链式起点**） | mail.md | GET | low |
| get_emails_inbox | 用 token 获取邮件列表 | mail.md | GET | low |
| get_email_by_id | 用 token + message_id 获取邮件详情 | mail.md | GET | low |

---

## 2. 字段流字典 (Field Flow Dictionary)

### `token` — 邮箱 Bearer Token（敏感字段）
- **产出**：`get_temp_email_address` → `$.data.token`
- **输入**：get_emails_inbox / get_email_by_id
- ⚠️ **安全约束**：禁止将 token 写入日志、提示词或客户端存储；每次使用后应尽快丢弃

### `message_id` — 邮件 ID
- **产出**：`get_emails_inbox` → `$.data.emails[].message_id`（或类似字段）
- **输入**：get_email_by_id

### `email_address` — 邮箱地址（敏感字段）
- **产出**：`get_temp_email_address` → `$.data.email_address`
- **用途**：仅展示给用户，用于注册或接收邮件
- ⚠️ **安全约束**：禁止写入日志或提示词

### `password` — 邮箱密码（敏感字段）
- **产出**：`get_temp_email_address` → `$.data.password`
- **用途**：仅展示给用户自行保存
- ⚠️ **安全约束**：禁止写入日志或提示词；Agent 不应代为存储

---

## 3. 全 skill 错误处理总览 (Error Handling Overview)

### HTTP 状态码权威定义

| HTTP 状态码 | 官方含义 | 细分场景 |
|------------|---------|---------|
| **400** | 请求格式错误 | 参数缺失 / 类型错 |
| **401** | API 令牌无效 | 令牌无效 / 缺少 / 过期 |
| **402** | 余额不足 | 余额不足 |
| **403** | 无权限 | 缺少路由权限 / 账户禁用 |
| **404** | 数据未找到 | 路径不在白名单 / 资源不存在 |
| **429** | 限流 | 请求过快 |
| **500** | 服务器错误 | 上游异常（含 502/503/504） |

### 错误码 → 行动（决策表）

| HTTP 码 | 行动 | 重试 |
|--------|------|------|
| 400 | 先做 §3.1(B) → 修正后重试 1 次 | ≤1 次 |
| 401 | STOP，提示检查 API Key | 0 |
| 402 | STOP，告知充值 | 0 |
| 403 | STOP | 0 |
| 404 | 先做 §3.1(A) → STOP | 0 |
| 410 | 先做 §3.1(A) → STOP，建议更新 | 0 |
| 429 | 退避重试 | ≤2 次 |
| 5xx | 等 3s 重试 | ≤1 次 |
| 网络/DNS | STOP | 0 |
| 业务 code≠0 | 读 message_zh | 0 |

### § 3.1 防臆造自检清单

#### (A) 收到 404 时
1. 路径是否逐字符匹配 `endpoints_whitelist.yaml`？
2. Method 是否匹配？
3. 参数键名是否在 `required` ∪ `optional` 中？
4. 资源 ID（token / message_id）是否来自合法响应字段？
5. 全通过 → 判定"资源不存在"，STOP

#### (B) 收到 400 / 422 时
1. 参数名是否逐字符匹配 IN 表？
2. 必填项是否齐全？
3. 类型/格式是否匹配？
4. 传参方式是否正确？
5. 是否有臆造参数？
6. 全通过 → 按 `message_zh` 排查

### 重试策略矩阵
| 错误类型 | 最大重试 | 退避 | 换端点 |
|---------|---------|------|-------|
| 400/422 | 1 次 | 立即 | ❌ |
| 401/402/403 | 0 | — | STOP |
| 404/410 | 0 | — | ❌ |
| 429 | 2 次 | 指数+抖动 | ❌ |
| 5xx | 1 次 | 3s | ✅ 走替换矩阵 |
| 网络/DNS | 0 | — | STOP |

---

## 4. 端点替换矩阵 (Endpoint Substitution Matrix)

| 首选端点 | 替代端点 | 替代条件 | 数据差异 |
|---------|---------|---------|---------|
| get_temp_email_address | 无替代 | — | 邮箱生成无替代，失败 STOP |
| get_emails_inbox | 无替代 | — | 邮件列表无替代，失败 STOP |
| get_email_by_id | 无替代 | — | 邮件详情无替代，失败 STOP |

> 临时邮箱 skill 端点少且功能独立，无互为降级的端点。任一端点 5xx 重试 1 次后仍失败 → STOP。

---

## 5. 路径合法性硬校验

> 所有端点的合法路径以 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 为唯一可信源。

---

## 6. SKILL 更新机制

> 完整流程见 [`update.md`](./update.md)。

### 何时建议用户更新
- ✅ 合法路径持续 404 / 410
- ✅ 多端点连续 410
- ✅ 用户主动询问版本

### 何时禁止建议更新
- ❌ 401 / 402 / 403 / 网络错

### 更新通道
1. `skillhub upgrade maxhub-temp-mail`（国内首选）
2. `clawhub upgrade maxhub-temp-mail`（国际）
3. `git pull` 仓库 https://github.com/XieWxx/maxhub-api-skills

### 当前版本：`3.7.2`
