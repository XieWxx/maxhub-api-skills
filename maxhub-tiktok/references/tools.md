# TikTok Tools & Crypto / TikTok 工具与加密

Base URL: `https://www.aconfig.cn`
Auth: `Authorization: Bearer $MAXHUB_API_KEY`

> 浏览器指纹生成、msToken、ttwid、web_id、XBogus/XGnarly 签名、strData 加密/解密、设备注册、游客 Cookie、X-Mssdk-Info、哈希 ID、APP 加密算法、登录请求加密。
>
> 本文件覆盖 TikTok Web API 签名工具 (13 个端点) + App V3 加密算法 (2 个端点)，共 15 个端点。
>
> **安全警告**：所有请求会将 `MAXHUB_API_KEY` 和查询数据传输到 `https://www.aconfig.cn`。禁止在日志、提示词或客户端存储中暴露 API Key。Cookie 参数仅限测试账号使用。`encrypt_decrypt_login_request` 涉及用户名/密码，**仅在用户明确授权时使用**。

---

## 本文件覆盖

| 领域 | API 前缀 | 方法 | 端点数 | 特殊要求 |
|------|----------|------|--------|----------|
| Web API 签名工具 | `/api/v1/tiktok/web/` | GET + POST | 13 | cookie 参数需用户授权 |
| App V3 加密算法 | `/api/v1/tiktok/app/v3/` | POST | 2 | - |

---

## 端点索引

### Web API 签名工具

| # | 端点 ID | 方法 | 路径 | 推荐度 | 一句话用途 |
|---|---------|------|------|--------|-----------|
| 1 | generate_real_msToken | GET | /api/v1/tiktok/web/generate_real_msToken | ★★★★★ | 生成真实 msToken |
| 2 | encrypt_strData | GET | /api/v1/tiktok/web/encrypt_strData | ★★★★ | 加密 strData 指纹数据 |
| 3 | decrypt_strData | GET | /api/v1/tiktok/web/decrypt_strData | ★★★ | 解密 strData 指纹数据 |
| 4 | generate_fingerprint | GET | /api/v1/tiktok/web/generate_fingerprint | ★★★★★ | 生成浏览器指纹 |
| 5 | generate_webid | GET | /api/v1/tiktok/web/generate_webid | ★★★★ | 生成 web_id (device_id) |
| 6 | generate_ttwid | GET | /api/v1/tiktok/web/generate_ttwid | ★★★★ | 生成 ttwid |
| 7 | generate_xbogus | POST | /api/v1/tiktok/web/generate_xbogus | ★★★ | 生成 XBogus 签名 |
| 8 | generate_xgnarly | POST | /api/v1/tiktok/web/generate_xgnarly | ★★★★★ | 生成 XGnarly 签名（V5.2.0） |
| 9 | generate_xgnarly_and_xbogus | POST | /api/v1/tiktok/web/generate_xgnarly_and_xbogus | ★★★★★ | 同时生成 XGnarly + XBogus（推荐） |
| 10 | generate_x_mssdk_info | POST | /api/v1/tiktok/web/generate_x_mssdk_info | ★★★ | 生成 X-Mssdk-Info / X-Mssdk-RC |
| 11 | generate_hashed_id | GET | /api/v1/tiktok/web/generate_hashed_id | ★★★ | 根据邮箱生成哈希 ID |
| 12 | fetch_tiktok_web_guest_cookie | GET | /api/v1/tiktok/web/fetch_tiktok_web_guest_cookie | ★★★★★ | 获取游客 Cookie |
| 13 | device_register | GET | /api/v1/tiktok/web/device_register | ★★★★★ | 设备注册（获取 device_id + cookie） |

### App V3 加密算法

| # | 端点 ID | 方法 | 路径 | 推荐度 | 一句话用途 |
|---|---------|------|------|--------|-----------|
| 14 | TTencrypt_algorithm | POST | /api/v1/tiktok/app/v3/TTencrypt_algorithm | ★★★★ | APP 加密算法（x-ladon/x-khronos/x-argus/x-gorgon） |
| 15 | encrypt_decrypt_login_request | POST | /api/v1/tiktok/app/v3/encrypt_decrypt_login_request | ★★ | 登录请求体加密/解密（需用户授权） |

---

## 链式调用图谱

```
# 链路 1: 指纹 → 加密 strData → msToken（完整 msToken 生成流程）
generate_fingerprint(browser_type)
  → fingerprint_data ──→ encrypt_strData(data=fingerprint_data)
  → encrypted_strData ──→ generate_real_msToken(random_strData=true, browser_type)

# 链路 2: 设备注册 → web_id
device_register()
  → device_id ──→ generate_webid(user_unique_id=device_id)

# 链路 3: 设备注册 → 游客 Cookie
device_register()
  → cookie ──→ 可用于 Web API 请求

# 链路 4: 游客 Cookie → ttwid → msToken
fetch_tiktok_web_guest_cookie(user_agent)
  → cookie(含 ttwid) ──→ generate_real_msToken(browser_type)

# 链路 5: XGnarly + XBogus 签名（推荐一次调用）
generate_xgnarly_and_xbogus(url, body)
  → x_gnarly + x_bogus + user_agent ──→ 附加到 Web API 请求参数

# 链路 6: 单独 XGnarly 签名
generate_xgnarly(url, body)
  → x_gnarly + user_agent ──→ 附加到 Web API 请求参数

# 链路 7: 单独 XBogus 签名（旧版兼容）
generate_xbogus(url, user_agent)
  → x_bogus ──→ 附加到 Web API 请求参数

# 链路 8: X-Mssdk-Info → 设备注册
generate_x_mssdk_info()
  → x_mssdk_info + x_mssdk_rc ──→ 附加到设备注册请求头

# 链路 9: APP 加密算法（完整 App V3 请求签名）
TTencrypt_algorithm(url, data, device_info)
  → x-ladon + x-khronos + x-argus + x-gorgon ──→ 附加到 App V3 请求头

# 链路 10: 登录请求加密
encrypt_decrypt_login_request(username, password, mode="encrypt")
  → 加密后的 username + password ──→ 用于登录接口请求体

# 链路 11: 设备注册 → 游客 Cookie → Web API 数据请求
device_register()
  → device_id + cookie ──→ fetch_tiktok_web_guest_cookie(user_agent)
  → 完整游客 Cookie ──→ 配合 generate_xgnarly_and_xbogus 签名请求 Web API
```

### 签名工具使用优先级

1. **Web API 请求签名**：优先使用 `generate_xgnarly_and_xbogus`（一次调用同时获取两个签名）
2. **仅需 XGnarly**：使用 `generate_xgnarly`（V5.2.0 最新版，完美还原算法）
3. **仅需 XBogus**：使用 `generate_xbogus`（需自定义 User-Agent）
4. **App V3 请求签名**：使用 `TTencrypt_algorithm`

### browser_type 枚举值

| 值 | 说明 |
|----|------|
| chrome_windows | Chrome + Windows |
| chrome_mac | Chrome + macOS |
| firefox_windows | Firefox + Windows |
| firefox_mac | Firefox + macOS |
| （不传） | 随机选择 |

---

## 跨 reference 链路

| 源端点 | 源字段 | 目标文件 | 目标端点 | 说明 |
|--------|--------|----------|----------|------|
| device_register | device_id | user.md | handler_user_profile | 设备 ID 用于用户查询 |
| device_register | cookie | video.md | fetch_post_detail | 游客 Cookie 用于 Web API 请求 |
| fetch_tiktok_web_guest_cookie | Cookie | video.md | fetch_user_post | 游客 Cookie 用于 Web API 请求 |
| generate_xgnarly_and_xbogus | x_gnarly + x_bogus | search.md | fetch_general_search | 签名参数用于搜索请求 |
| generate_webid | web_id | user.md | fetch_user_profile | web_id 作为 device_id 参数 |
| TTencrypt_algorithm | x-argus 等 | user.md | handler_user_profile | App V3 请求头加密 |

---

## 错误处理契约

| HTTP 状态码 | 场景 | 处理方式 |
|-------------|------|----------|
| 404 | 端点路径错误 | 触发防臆造自检(A)，STOP |
| 400/422 | 参数格式错误 | 触发防臆造自检(B)，修正后最多重试 1 次 |
| 401 | API Key 无效/过期 | STOP，提示用户检查 API Key |
| 429 | 限流 | 读 Retry-After 退避，最多重试 2 次 |
| 5xx | 上游故障 | 等 3s 重试 1 次，仍失败 STOP |

**Tools API 专用注意事项：**
- `encrypt_strData` 的 `data` 参数必须先将 JSON 转为字符串再传入
- `generate_xgnarly` / `generate_xgnarly_and_xbogus` 的 `url` 参数**不需要 URL 编码**，且必须包含域名
- `generate_xgnarly` / `generate_xgnarly_and_xbogus` **不可自定义 User-Agent**，会自动生成
- `generate_xbogus` **需要自定义 User-Agent**
- `generate_webid` 的 `cookie` 参数为敏感登录凭据，仅在用户明确授权时使用
- `encrypt_decrypt_login_request` 涉及用户名/密码，**仅在用户明确授权时使用**

---

## 端点详情

---

### 1. generate_real_msToken

`GET /api/v1/tiktok/web/generate_real_msToken`

#### 用途

生成真实 msToken，用于 TikTok Web API 请求认证。

#### 何时使用 / 何时不使用

- **使用**：需要 msToken 进行 Web API 请求
- **使用**：配合 `generate_fingerprint` + `encrypt_strData` 完成完整流程
- **不使用**：App V3 API 请求（不需要 msToken）

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| random_strData | query | boolean | 否 | 是否使用随机化的浏览器指纹数据（推荐开启以提高反爬虫能力），默认 false | true |
| browser_type | query | string | 否 | 浏览器类型，可选值：chrome_windows / chrome_mac / firefox_windows / firefox_mac，不传则随机选择 | chrome_mac |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| msToken | string | 生成的真实 msToken |

#### ERR

| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |
| 业务 code≠0 | 签名服务异常 | 读 `message_zh` 告知用户 | 0 | — |

---

### 2. encrypt_strData

`GET /api/v1/tiktok/web/encrypt_strData`

#### 用途

加密 strData 指纹数据，用于生成 msToken 请求。将原始浏览器指纹 JSON 数据加密为密文字符串。

#### 何时使用 / 何时不使用

- **使用**：需要将指纹数据加密后传入 msToken 生成流程
- **使用**：配合 `generate_fingerprint` 产出的指纹数据
- **不使用**：仅需解密 strData → 用 `decrypt_strData`
- **不使用**：直接生成 msToken → 用 `generate_real_msToken(random_strData=true)`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| data | query | string | **是** | 原始指纹数据字符串（请先将 JSON 格式转为字符串再传入） | `{"behavior":{"beResize":[],...},"wID":{...}}` |

> **注意**：`data` 参数内容较长，需先将 JSON 对象转为字符串后传入。

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| encrypted_strData | string | 加密后的 strData 字符串 |

#### ERR

| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400/422 | data 格式错误 | 检查 JSON 字符串格式 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### 3. decrypt_strData

`GET /api/v1/tiktok/web/decrypt_strData`

#### 用途

解密 strData 指纹数据，用于分析 msToken 请求中的指纹信息。

#### 何时使用 / 何时不使用

- **使用**：需要分析已加密的 strData 内容
- **使用**：调试/逆向分析浏览器指纹
- **不使用**：需要加密 → 用 `encrypt_strData`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| encrypted_data | query | string | **是** | 加密后的 strData 字符串（从浏览器抓包获取） | `3BvqYbNXLLOcZehvxZVbjpAu7vq82RoW...` |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| decrypted_data | object | 解密后的原始指纹数据，包含浏览器指纹信息和环境信息 |

#### ERR

| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400/422 | encrypted_data 格式错误 | 检查密文字符串 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### 4. generate_fingerprint

`GET /api/v1/tiktok/web/generate_fingerprint`

#### 用途

生成随机浏览器指纹数据，可用于自定义 msToken 请求。是 msToken 完整生成流程的第一步。

#### 何时使用 / 何时不使用

- **使用**：需要自定义指纹数据来生成 msToken
- **使用**：配合 `encrypt_strData` → `generate_real_msToken` 完成完整流程
- **不使用**：仅需快速获取 msToken → 用 `generate_real_msToken(random_strData=true)` 自动生成

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| browser_type | query | string | 否 | 浏览器类型，可选值：chrome_windows / chrome_mac / firefox_windows / firefox_mac，不传则随机选择 | chrome_mac |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| fingerprint_data | object | 浏览器指纹数据（JSON 格式，需转为字符串后传入 encrypt_strData） |

#### ERR

| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### 5. generate_webid

`GET /api/v1/tiktok/web/generate_webid`

#### 用途

生成 TikTok web_id（Web API 请求参数中的 device_id）。

#### 何时使用 / 何时不使用

- **使用**：需要 web_id 作为 Web API 请求的 device_id
- **使用**：配合 `device_register` 产出的 device_id
- **不使用**：已有 device_id → 无需重复生成

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| cookie | query | string | 否 | 自定义 cookie（需包含 odin_tt），不传则使用随机生成的游客 Cookie | — |
| user_agent | query | string | 否 | 用户代理字符串，默认 Firefox/145.0 | `Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0` |
| url | query | string | 否 | 请求来源 URL，默认 https://www.tiktok.com/explore | `https://www.tiktok.com/explore` |
| referer | query | string | 否 | 来源页面 | — |
| user_unique_id | query | string | 否 | 用户唯一 ID | — |
| app_id | query | integer | 否 | 应用 ID，默认 1988（TikTok Web 应用） | 1988 |

> **安全警告**：`cookie` 为敏感登录凭据，仅在用户明确授权访问登录态数据时使用。

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| web_id | string | 生成的 web_id |
| e | integer | 错误码（0 表示成功） |
| ssid | string | 会话 ID |

#### ERR

| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |
| 业务 code≠0 | 生成失败 | 读 `message_zh` 告知用户 | 0 | — |

---

### 6. generate_ttwid

`GET /api/v1/tiktok/web/generate_ttwid`

#### 用途

生成 ttwid，用于 TikTok Web API 请求。

#### 何时使用 / 何时不使用

- **使用**：需要 ttwid 作为 Web API 请求的 Cookie
- **不使用**：需要完整游客 Cookie → 用 `fetch_tiktok_web_guest_cookie`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| user_agent | query | string | 否 | 用户代理字符串，默认 Firefox/125.0 | `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0` |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| ttwid | string | 生成的 ttwid |

#### ERR

| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### 7. generate_xbogus

`POST /api/v1/tiktok/web/generate_xbogus`

#### 用途

生成 XBogus 签名，用于 TikTok Web API 请求参数加密。需自定义 User-Agent。

#### 何时使用 / 何时不使用

- **使用**：需要 XBogus 签名（旧版兼容场景）
- **使用**：需要自定义 User-Agent 的签名场景
- **不使用**：推荐使用 `generate_xgnarly_and_xbogus` 一次获取双签名
- **不使用**：需要最新版签名 → 用 `generate_xgnarly`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| url | body | string | **是** | 未签名的 API URL（包含完整查询参数） | `https://www.tiktok.com/aweme/v1/web/aweme/detail/?aweme_id=7148736076176215311&...` |
| user_agent | body | string | **是** | 用户浏览器 User-Agent | `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...` |

> **注意**：与 `generate_xgnarly` 不同，本端点**需要自定义 User-Agent**。

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| xbogus | string | 生成的 XBogus 签名字符串 |

#### ERR

| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400/422 | url 或 user_agent 缺失 | 检查必填参数 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### 8. generate_xgnarly

`POST /api/v1/tiktok/web/generate_xgnarly`

#### 用途

生成 XGnarly 加密签名，用于 TikTok Web API 请求。使用最新版本（V5.2.0，截至 2026 年 3 月）的签名服务，完美还原算法，无视除验证码外的一切风控。

#### 何时使用 / 何时不使用

- **使用**：需要最新版 XGnarly 签名
- **使用**：Web API 请求需要签名参数
- **不使用**：同时需要 XBogus → 用 `generate_xgnarly_and_xbogus`（推荐）
- **不使用**：App V3 请求 → 用 `TTencrypt_algorithm`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| url | body | string | **是** | 不携带签名且包含域名的请求 URL，不需要 URL 编码 | `https://www.tiktok.com/api/search/user/full/?WebIdLastTime=...&keyword=musk&...` |
| body | body | string | 否 | 请求的 API 参数，适用于 POST 请求；GET 请求传空字符串或不传 | — |

> **注意**：
> - `url` 参数**不需要 URL 编码**，且**必须包含域名**
> - 本端点**不可自定义 User-Agent**，会自动生成一个常见浏览器的 User-Agent

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| x_gnarly | string | X-Gnarly 加密字符串 |
| user_agent | string | 自动生成的随机浏览器 User-Agent |

#### ERR

| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400/422 | url 缺失或格式错误 | 检查 url 参数 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### 9. generate_xgnarly_and_xbogus

`POST /api/v1/tiktok/web/generate_xgnarly_and_xbogus`

#### 用途

同时生成 XGnarly 和 XBogus 加密签名，用于 TikTok Web API 请求。**推荐使用本端点**，一次调用获取双签名。均为最新版本（V5.2.0，截至 2026 年 3 月），完美还原算法。

#### 何时使用 / 何时不使用

- **使用**：需要同时获取 XGnarly + XBogus 双签名（**推荐优先使用**）
- **使用**：Web API 请求需要完整签名参数
- **不使用**：仅需单个签名 → 用 `generate_xgnarly` 或 `generate_xbogus`
- **不使用**：App V3 请求 → 用 `TTencrypt_algorithm`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| url | body | string | **是** | 不携带签名且包含域名的请求 URL，不需要 URL 编码 | `https://www.tiktok.com/api/search/user/full/?...&keyword=musk&...` |
| body | body | string | 否 | 请求的 API 参数，适用于 POST 请求；GET 请求传空字符串或不传 | — |

> **注意**：
> - `url` 参数**不需要 URL 编码**，且**必须包含域名**
> - 本端点**不可自定义 User-Agent**，会自动生成一个常见浏览器的 User-Agent

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| x_gnarly | string | 最新版本 X-Gnarly 加密字符串 |
| x_bogus | string | 最新版本 X-Bogus 加密字符串 |
| user_agent | string | 自动生成的随机浏览器 User-Agent |

#### ERR

| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400/422 | url 缺失或格式错误 | 检查 url 参数 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### 10. generate_x_mssdk_info

`POST /api/v1/tiktok/web/generate_x_mssdk_info`

#### 用途

生成 X-Mssdk-Info 和 X-Mssdk-RC，用于 TikTok Web 设备注册、登录等场景。

#### 何时使用 / 何时不使用

- **使用**：设备注册/登录请求需要 X-Mssdk-Info 请求头
- **不使用**：普通 Web API 数据请求 → 用 `generate_xgnarly_and_xbogus`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| user_agent | body | string | 否 | 用户代理字符串，**目前不支持自定义**，默认为固定值 | null |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| x_mssdk_info | string | 生成的签名信息 |
| x_mssdk_rc | string | 生成的 RC 值 |
| user_agent | string | 使用的用户代理字符串 |
| version | string | 签名使用的 webmssdk 版本 |

#### ERR

| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### 11. generate_hashed_id

`GET /api/v1/tiktok/web/generate_hashed_id`

#### 用途

根据邮箱地址生成 TikTok Web 的哈希 ID。

#### 何时使用 / 何时不使用

- **使用**：需要根据邮箱生成哈希 ID
- **不使用**：需要设备 ID → 用 `device_register` 或 `generate_webid`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| email | query | string | **是** | 邮箱地址 | `test@example.com` |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| hashed_id | string | 生成的哈希 ID 字符串 |

#### ERR

| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400/422 | email 格式错误 | 检查邮箱格式 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### 12. fetch_tiktok_web_guest_cookie

`GET /api/v1/tiktok/web/fetch_tiktok_web_guest_cookie`

#### 用途

获取 TikTok Web 的游客 Cookie，可用于爬取 TikTok Web 数据（用户作品、合辑作品等）。可固定身份避免部分接口重复数据。

#### 何时使用 / 何时不使用

- **使用**：需要游客 Cookie 进行 Web API 请求
- **使用**：需要固定身份避免重复数据
- **不使用**：需要登录态 Cookie → 需用户自行提供
- **不使用**：需要 device_id → 用 `device_register`

> **注意**：游客 Cookie 无法爬取所有数据，有一定的限制。

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| user_agent | query | string | **是** | 用户浏览器代理 | `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36` |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| User-Agent | string | 使用的 User-Agent |
| Cookie | string | 游客 Cookie（含 ttwid、tt_csrf_token、tt_chain_token） |
| Referer | string | 来源页面 |

> **注意**：返回的 Cookie 中包含 `tt_chain_token`，访问视频 CDN 链接时需要此值。

#### ERR

| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400/422 | user_agent 缺失 | 提供有效的 user_agent | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### 13. device_register

`GET /api/v1/tiktok/web/device_register`

#### 用途

设备注册，为 TikTok Web 生成设备 ID 和游客 Cookie。是 Web API 请求的前置步骤。

#### 何时使用 / 何时不使用

- **使用**：需要 device_id 和初始 Cookie
- **使用**：Web API 请求前的设备初始化
- **不使用**：已有 device_id → 无需重复注册

#### IN

无参数。

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| deviceId | string | 生成的设备 ID |
| cookie | string | 初始 Cookie（含 tt_chain_token） |
| user_agent | string | 使用的 User-Agent |

> **注意**：返回的 `deviceId` 可作为 `generate_webid` 的 `user_unique_id` 参数。

#### ERR

| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |
| 业务 code≠0 | 注册失败 | 读 `message_zh` 告知用户 | 0 | — |

---

### 14. TTencrypt_algorithm

`POST /api/v1/tiktok/app/v3/TTencrypt_algorithm`

#### 用途

TikTok APP 加密算法，用于生成 App V3 请求头中的加密参数（x-ladon、x-khronos、x-argus、x-gorgon）。

#### 何时使用 / 何时不使用

- **使用**：App V3 API 请求需要签名头
- **使用**：需要 x-ladon / x-khronos / x-argus / x-gorgon 加密参数
- **不使用**：Web API 请求 → 用 `generate_xgnarly_and_xbogus`

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| url | body | string | **是** | 需要加密的完整 URL | `https://api.tiktokv.com/aweme/v1/...` |
| data | body | string | 否 | POST 请求的数据参与加密计算；GET 请求传空字符串 | — |
| device_info | body | object | 否 | 设备信息（可选），不填则使用默认设备信息；设备信息会修改传入 URL 中的参数 | — |

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| x-ladon | string | 加密参数 x-ladon |
| x-khronos | string | 加密参数 x-khronos（时间戳） |
| x-argus | string | 加密参数 x-argus |
| x-gorgon | string | 加密参数 x-gorgon（8404 版本） |

#### ERR

| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400/422 | url 缺失或格式错误 | 检查 url 参数 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### 15. encrypt_decrypt_login_request

`POST /api/v1/tiktok/app/v3/encrypt_decrypt_login_request`

#### 用途

加密或解密 TikTok APP 登录请求体，用于登录接口的请求体加密和解密。

#### 何时使用 / 何时不使用

- **使用**：需要加密登录请求体（用户名/密码）
- **使用**：需要解密登录响应体
- **不使用**：非登录场景 → 用 `TTencrypt_algorithm`
- **不使用**：用户未明确授权 → **禁止调用**

> **安全警告**：本端点涉及用户名和密码，**仅在用户明确授权时使用**。禁止硬编码或存储凭据。

#### IN

| 参数 | 位置 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|------|
| username | body | string | **是** | 用户名，可以是密文或明文 | `example_username` |
| password | body | string | **是** | 密码，可以是密文或明文 | `example_password` |
| mode | body | string | **是** | 模式：`encrypt`（加密）/ `decrypt`（解密） | `encrypt` |

> **oneOf mode**：`mode` 参数必须为 `encrypt` 或 `decrypt` 之一。

#### OUT

| 字段 | 类型 | 说明 |
|------|------|------|
| encrypted_body / decrypted_body | string | 加密/解密后的请求体 |

#### ERR

| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400/422 | 参数缺失或 mode 无效 | 检查 username / password / mode | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |
