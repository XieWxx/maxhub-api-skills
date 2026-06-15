# Douyin Live / 抖音直播

Base URL: `https://www.aconfig.cn` · Auth: `Authorization: Bearer $MAXHUB_API_KEY`

## 本文件覆盖

直播流数据（webcast_id / sec_uid / room_id 三种入口）、用户直播状态查询、直播间弹幕与 IM 消息、送礼排行、直播间商品信息、商品 SKU / 优惠券 / 评价、webcast_id 与 room_id 互转。**room_id 与 webcast_id 多在本文件首步产出**，是弹幕、送礼排行、商品信息等链式调用的常见起点。

> 🔒 **安全**：所有请求将 `MAXHUB_API_KEY` 和查询数据传输至 `https://www.aconfig.cn`。禁止在日志、提示词或客户端存储中暴露 API Key。部分端点接受 `cookie` 参数——仅在用户明确授权后才可传递。

---

## 端点索引 (Endpoint Index)

| ID | 推荐度 | 一句话用途 | Method | Path | Risk |
|----|-------|----------|--------|------|------|
| web_fetch_user_live_videos | ⭐⭐⭐ 首选 | 用 webcast_id 取直播流数据（**链式起点**） | GET | /api/v1/douyin/web/fetch_user_live_videos | low |
| web_fetch_user_live_videos_by_room_id_v2 | ⭐⭐ 条件 | 用 room_id 取直播流数据 V2 | GET | /api/v1/douyin/web/fetch_user_live_videos_by_room_id_v2 | low |
| web_fetch_user_live_videos_by_sec_uid | ⭐⭐ 条件 | 用 sec_uid 取用户直播流数据 | GET | /api/v1/douyin/web/fetch_user_live_videos_by_sec_uid | low |
| web_fetch_user_live_info_by_uid | ⭐⭐⭐ 首选 | 用 uid 查用户直播状态（**链式起点**） | GET | /api/v1/douyin/web/fetch_user_live_info_by_uid | low |
| web_webcast_id_2_room_id | ⭐⭐⭐ 首选 | webcast_id 转 room_id（**链式关键**） | GET | /api/v1/douyin/web/webcast_id_2_room_id | low |
| web_fetch_live_gift_ranking | ⭐⭐ 条件 | 取直播间送礼排行 | GET | /api/v1/douyin/web/fetch_live_gift_ranking | low |
| web_fetch_live_room_product_result | ⭐⭐ 条件 | 取直播间商品列表 | GET | /api/v1/douyin/web/fetch_live_room_product_result | low |
| web_fetch_product_sku_list | ⭐⭐ 条件 | 取商品 SKU 列表 | GET | /api/v1/douyin/web/fetch_product_sku_list | low |
| web_fetch_product_review_score | ⭐⭐ 条件 | 取商品评价评分 | GET | /api/v1/douyin/web/fetch_product_review_score | low |
| web_fetch_product_review_list | ⭐⭐ 条件 | 取商品评价列表 | GET | /api/v1/douyin/web/fetch_product_review_list | low |
| web_fetch_product_coupon | ⭐ 条件 | 取商品优惠券（参数最多，需 5 个必填） | GET | /api/v1/douyin/web/fetch_product_coupon | low |
| web_douyin_live_room | ⭐⭐ 条件 | 取直播间弹幕 WebSocket 连接信息 | GET | /api/v1/douyin/web/douyin_live_room | low |
| web_fetch_live_im_fetch | ⭐ 条件 | 取直播 IM 弹幕参数（需 user_unique_id） | GET | /api/v1/douyin/web/fetch_live_im_fetch | low |

---

## 链式调用图谱 (Chain Recipes)

> 当单个端点无法直接产出用户所需数据时，按下面链路组合调用。`字段流`列指明字段如何从上一步流向下一步，避免 Agent 臆造字段名。

| 用户目标 | 链路 | 字段流 (json_path → 下游参数) | 中间步失败时的容错 |
|---------|------|-------|-------------------|
| 看直播 + 送礼排行 | web_fetch_user_live_videos → web_fetch_live_gift_ranking | `$.data.room_id` → `room_id` | 第 1 步失败：STOP；第 2 步失败：返回直播流 + "排行暂不可取" |
| 看直播 + 商品列表 | web_fetch_user_live_videos → web_fetch_live_room_product_result | `$.data.room_id` → `room_id`；`$.data.author.id` → `author_id` | 第 1 步失败：STOP；第 2 步失败：返回直播流 + "商品暂不可取" |
| 看直播 + 弹幕 | web_fetch_user_live_videos → web_douyin_live_room | `$.data.room_id` → 拼接 `live_room_url` | 第 2 步失败：返回直播流 + "弹幕暂不可取" |
| webcast_id → room_id → 直播流 | web_webcast_id_2_room_id → web_fetch_user_live_videos_by_room_id_v2 | `$.data.room_id` → `room_id` | 第 1 步失败：STOP |
| uid → 直播状态 + 直播流 | web_fetch_user_live_info_by_uid → web_fetch_user_live_videos_by_room_id_v2 | `$.data.room_id` → `room_id` | 第 1 步返回未开播：STOP，告知用户 |
| sec_uid → 直播流 | web_fetch_user_live_videos_by_sec_uid（直接调用） | — | 单步即可 |
| 商品列表 → SKU | web_fetch_live_room_product_result → web_fetch_product_sku_list | `$.data.product_id` → `product_id`；`$.data.author_id` → `author_id` | 第 1 步失败：STOP |
| 商品列表 → 评价评分 | web_fetch_live_room_product_result → web_fetch_product_review_score | `$.data.product_id` → `product_id`；`$.data.shop_id` → `shop_id` | 第 2 步失败：返回商品列表 + "评价暂不可取" |
| 商品列表 → 评价列表 | web_fetch_live_room_product_result → web_fetch_product_review_list | `$.data.product_id` → `product_id`；`$.data.shop_id` → `shop_id` | 第 2 步失败：返回商品列表 + "评价暂不可取" |
| 商品列表 → 优惠券 | web_fetch_live_room_product_result → web_fetch_product_coupon | `$.data.product_id` → `product_id`；`$.data.shop_id` → `shop_id`；`$.data.price` → `price`；`$.data.author_id` → `author_id`；需额外 sec_user_id | 需从 user.md 获取 sec_user_id |
| 用户主页 → 直播状态 | user.md → web_fetch_user_live_info_by_uid | `$.data.user.uid` → `uid` | 跨文件链路，详见 user.md |
| URL → webcast_id → room_id | tools.md → web_webcast_id_2_room_id | `$.data.webcast_id` → `webcast_id` | 跨文件链路，详见 tools.md |

---

## 跨 reference 链路 (In-Chain)

- **流入本文件**：`user.md` 的 `web_handler_user_profile` / `web_fetch_user_profile_by_uid` 输出 `$.data.user.uid` → 本文件 `web_fetch_user_live_info_by_uid` 的 `uid`
- **流入本文件**：`user.md` 的多个端点输出 `$.data.user.sec_uid` → 本文件 `web_fetch_user_live_videos_by_sec_uid` 的 `sec_uid`
- **流入本文件**：`tools.md` 的 `web_get_webcast_id` 输出 `$.data.webcast_id` → 本文件 `web_fetch_user_live_videos` 的 `webcast_id` / `web_webcast_id_2_room_id` 的 `webcast_id`
- **流入本文件**：`search.md` 的 `search_fetch_live_search_v1` 可能输出直播相关 ID → 本文件各端点
- **流出本文件**：`$.data.room_id` → 本文件 `web_fetch_user_live_videos_by_room_id_v2` / `web_fetch_live_gift_ranking` / `web_fetch_live_room_product_result` / `web_fetch_live_im_fetch` 的 `room_id`
- **流出本文件**：`$.data.author.id` / `$.data.author_id` → 本文件 `web_fetch_live_room_product_result` / `web_fetch_product_sku_list` 的 `author_id`
- **流出本文件**：`$.data.product_id` → 本文件 `web_fetch_product_sku_list` / `web_fetch_product_coupon` / `web_fetch_product_review_score` / `web_fetch_product_review_list` 的 `product_id`

---

## 错误处理契约 (Error Contract · 本文件全端点共享)

> 端点级 ERR 表仅列出特殊覆盖项；通用规则见此处。
> **完整 HTTP 状态码语义与决策表见 [`param-mappings.md` § 3](./param-mappings.md#3-全-skill-错误处理总览-error-handling-overview)**

### 路径错误（404 / 410）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (A)](./param-mappings.md#a-收到-404-时的自检清单-️-防路径臆造)）
  - 路径是否在 [`endpoints_whitelist.yaml`](./endpoints_whitelist.yaml) 中？
  - Method、参数键名是否符合白名单？
  - 资源 ID（room_id / webcast_id / author_id / product_id 等）是否来自合法响应字段？
- **第 2 步：自检通过后**才能判定"上游资源真的不存在" → **STOP**，向用户报告
- **禁止**：❌ 改路径段（app/v3→web 试探）❌ 切换平台前缀 ❌ 拼接新路径 ❌ 自行修改资源 ID 重试
- **替换**：参考 [`param-mappings.md`](./param-mappings.md) 的"端点替换矩阵"

### 参数错误（400 / 422）⚠️ 防臆造前置自检
- **第 1 步：必须先做防臆造自检**（详见 [`param-mappings.md` § 3.1 (B)](./param-mappings.md#b-收到-400--422-时的自检清单-️-防参数与传参方式臆造)）
  - 参数名是否逐字符匹配 IN 表？注意 `webcast_id` vs `room_id` 的区别
  - 必填项是否齐全？
  - 传参方式（query vs body）是否正确？Authorization 头是否正确？
  - **是否有 IN 表外的臆造参数**？
- **第 2 步：自检通过后**才能修正参数重试 → 最多重试 1 次 → 仍失败 STOP
- **禁止**：❌ 切换端点 ❌ 在 IN 表外凭空加参数

### 鉴权错误（401）
- **行动**：**STOP**，提示用户检查或更换 API Key（https://www.aconfig.cn/console）

### 余额 / 付费（402）
- **行动**：**STOP**，告知用户充值（https://www.aconfig.cn/billing）；不要自行重试

### 权限错误（403）
- **行动**：**STOP**，按子场景告知用户去控制台处理

### 限流（429）
- **行动**：读 `Retry-After` 头退避；无该头时按 `delay = min(8s, 2^attempt) * (0.5 + random*0.5)`；最多重试 2 次
- **禁止**：❌ 立即重试 ❌ 换端点（换端点不能解决限流）

### 上游故障（500/502/503/504）
- **行动**：等 3 秒重试 1 次 → 仍失败走端点级"降级/替换"列 → 无替换则 STOP

### 网络超时
- **行动**：**STOP**，向用户报告网络异常

### 业务错误（HTTP 200 且 `code != 0`）
- **行动**：读 `message_zh`/`message` 报告用户；不要把 `data` 当作有效数据；不要重试

### 直播特有：room_id 与 webcast_id 区别
- `webcast_id`：直播间号，从直播链接提取（如 `https://www.douyin.com/root/live/376034101029` 中的 `376034101029`）
- `room_id`：房间号，每次开播都会变化，与 webcast_id 不同
- `web_fetch_user_live_videos` 使用 `webcast_id`，`web_fetch_user_live_videos_by_room_id_v2` 使用 `room_id`
- 两者可通过 `web_webcast_id_2_room_id` 互转

### 直播特有：cookie 参数规则
- `web_fetch_live_room_product_result` 旧版文档提到可选 `cookie` 参数，如获取失败需手动过验证码
- cookie 仅限用户明确授权后才可传递，禁止 Agent 自行构造或缓存

### 直播特有：弹幕端点说明
- `web_douyin_live_room`：返回弹幕数据的 WebSocket 连接信息，**此接口不直接返回弹幕数据**，需使用 WebSocket 连接获取
- `web_fetch_live_im_fetch`：返回弹幕参数数据，需配合 `web_generate_wss_xb_signature`（tools.md）使用
- 本 skill **不支持**实时直播推流 / WebSocket 长连接（详见 [`param-mappings.md` § 0.1](./param-mappings.md#01-本-skill-不支持的能力-out-of-scope)）

### 直播特有：商品评价翻页
- `web_fetch_product_review_list`：`cursor` 首次为 0，后续使用上次响应中的 `cursor` 值
- `count` 建议保持默认值 20
- `sort_type`：0 = 默认，1 = 最新

---

## 端点详情

---

### web_fetch_user_live_videos — 用 webcast_id 获取直播流数据

**Full path:** `/api/v1/douyin/web/fetch_user_live_videos`
**Method:** GET · **Risk:** low

#### 用途
用 webcast_id 获取直播流数据。**链式调用的常见起点**——room_id 和 author_id 多从此处产出，是送礼排行、商品列表等下游端点的入口。

#### 何时使用 / 不使用
- ✅ 用户提供 webcast_id（从直播链接提取的数字，如 `376034101029`）
- ✅ 链式起点：取 room_id 或 author_id
- ❌ 用户提供 room_id → 用 `web_fetch_user_live_videos_by_room_id_v2`
- ❌ 用户提供 sec_uid → 用 `web_fetch_user_live_videos_by_sec_uid`
- ❌ 想查用户是否在直播 → 用 `web_fetch_user_live_info_by_uid`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| webcast_id | string | yes | 纯数字字符串 | 直播间 webcast_id，如 `376034101029`。获取方法：直播链接 `https://www.douyin.com/root/live/376034101029` 中最后一段数字 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| room_id | `$.data.room_id` | 直播间房间号 | web_fetch_user_live_videos_by_room_id_v2 / web_fetch_live_gift_ranking / web_fetch_live_room_product_result / web_fetch_live_im_fetch |
| author.id | `$.data.author.id` | 主播用户 ID | web_fetch_live_room_product_result / web_fetch_product_sku_list |
| author.sec_uid | `$.data.author.sec_uid` | 主播加密 ID | user.md 各端点 / web_fetch_product_coupon |
| webcast_id | `$.data.webcast_id` | 直播间号 | web_webcast_id_2_room_id |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | webcast_id 不存在 | STOP，告知用户 | 0 | 无替代 |
| 空响应 | 直播已结束或不存在 | STOP，告知用户直播可能已结束 | 0 | 尝试 `web_fetch_user_live_info_by_uid` 查直播状态 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`web_fetch_user_live_videos_by_room_id_v2`（需先通过 `web_webcast_id_2_room_id` 获取 room_id） |

---

### web_fetch_user_live_videos_by_room_id_v2 — 用 room_id 获取直播流数据 V2

**Full path:** `/api/v1/douyin/web/fetch_user_live_videos_by_room_id_v2`
**Method:** GET · **Risk:** low

#### 用途
用 room_id 获取直播流数据 V2 版本。当用户已有 room_id 时直接使用，无需先转换 ID。

#### 何时使用 / 不使用
- ✅ 用户提供 room_id（如 `7462723839303093032`）
- ✅ 从 `web_webcast_id_2_room_id` 或 `web_fetch_user_live_info_by_uid` 链式获取 room_id 后
- ❌ 用户提供 webcast_id → 先用 `web_webcast_id_2_room_id` 转换，或直接用 `web_fetch_user_live_videos`
- ❌ 用户提供 sec_uid → 用 `web_fetch_user_live_videos_by_sec_uid`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| room_id | string | yes | 纯数字字符串 | 直播间 room_id，如 `7462723839303093032`。注意：room_id 每次开播都会变化 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| room_id | `$.data.room_id` | 直播间房间号 | web_fetch_live_gift_ranking / web_fetch_live_room_product_result / web_fetch_live_im_fetch |
| author.id | `$.data.author.id` | 主播用户 ID | web_fetch_live_room_product_result / web_fetch_product_sku_list |
| author.sec_uid | `$.data.author.sec_uid` | 主播加密 ID | user.md 各端点 / web_fetch_product_coupon |
| modify_time | `$.data.modify_time` | 最后更新时间（≈开播时间） | 仅展示用，下播后不会重置为 0 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | room_id 不存在 | STOP，告知用户 | 0 | 无替代 |
| 空响应 | 直播已结束 | STOP，告知用户 | 0 | 尝试 `web_fetch_user_live_info_by_uid` 查直播状态 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | 替换：`web_fetch_user_live_videos`（需 webcast_id） |

---

### web_fetch_user_live_videos_by_sec_uid — 用 sec_uid 获取用户直播流数据

**Full path:** `/api/v1/douyin/web/fetch_user_live_videos_by_sec_uid`
**Method:** GET · **Risk:** low

#### 用途
用 sec_uid 获取指定用户的直播流数据。当用户已知某用户 sec_uid 并想查看其直播时使用。

#### 何时使用 / 不使用
- ✅ 用户提供 sec_uid 且想看该用户直播
- ✅ 从 user.md 链式获取 sec_uid 后查直播
- ❌ 用户提供 webcast_id → 用 `web_fetch_user_live_videos`
- ❌ 用户提供 room_id → 用 `web_fetch_user_live_videos_by_room_id_v2`
- ❌ 只想查用户是否在直播（不需要直播流） → 用 `web_fetch_user_live_info_by_uid`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_uid | string | yes | Base64 格式长字符串 | 用户 sec_uid，如 `MS4wLjABAAAAAIKOBr_x6p2fPVKOAhqG8LrC1lwwdWChifKEsl-TXFS-kGSGqpMBRexJdzoAfvUF` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| room_id | `$.data.room_id` | 直播间房间号 | web_fetch_user_live_videos_by_room_id_v2 / web_fetch_live_gift_ranking / web_fetch_live_room_product_result |
| author.id | `$.data.author.id` | 主播用户 ID | web_fetch_live_room_product_result / web_fetch_product_sku_list |
| webcast_id | `$.data.webcast_id` | 直播间号 | web_fetch_user_live_videos / web_webcast_id_2_room_id |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | sec_uid 不存在或用户未开播 | STOP，告知用户 | 0 | 尝试 `web_fetch_user_live_info_by_uid`（需 uid） |
| 空响应 | 用户未在直播 | STOP，告知用户可能未开播 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### web_fetch_user_live_info_by_uid — 用 uid 查用户直播状态

**Full path:** `/api/v1/douyin/web/fetch_user_live_info_by_uid`
**Method:** GET · **Risk:** low

#### 用途
用 uid 查询用户当前直播状态。**链式起点**——当用户想了解某用户是否在直播时首选此端点，返回的 room_id 可用于后续直播流获取。

#### 何时使用 / 不使用
- ✅ 想查用户是否在直播（不需要直播流详情）
- ✅ 链式起点：先查直播状态，再取直播流
- ✅ 从 user.md 获取 uid 后查直播状态
- ❌ 已有 webcast_id / room_id → 直接用对应直播流端点
- ❌ 已有 sec_uid → 用 `web_fetch_user_live_videos_by_sec_uid` 一步获取

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | 纯数字字符串 | 用户数字 ID，可从 user.md 各端点获取 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| room_id | `$.data.room_id` | 直播间房间号（未开播时为空） | web_fetch_user_live_videos_by_room_id_v2 / web_fetch_live_gift_ranking / web_fetch_live_room_product_result |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | uid 不存在 | STOP，告知用户 | 0 | 无替代 |
| 空数据 | 用户未在直播 | STOP，告知用户当前未开播 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### web_webcast_id_2_room_id — webcast_id 转 room_id

**Full path:** `/api/v1/douyin/web/webcast_id_2_room_id`
**Method:** GET · **Risk:** low

#### 用途
将 webcast_id 转换为 room_id。**链式关键**——很多直播端点需要 room_id，而用户通常只有 webcast_id（从直播链接提取），此端点完成 ID 转换。

#### 何时使用 / 不使用
- ✅ 用户有 webcast_id 但需要 room_id
- ✅ 链式中间步：webcast_id → room_id → 其他直播端点
- ❌ 已有 room_id → 无需转换
- ❌ 想直接看直播流 → 用 `web_fetch_user_live_videos`（接受 webcast_id）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| webcast_id | string | yes | 纯数字字符串 | 直播间号，如 `775841227732` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| room_id | `$.data.room_id` | 直播间房间号 | web_fetch_user_live_videos_by_room_id_v2 / web_fetch_live_gift_ranking / web_fetch_live_room_product_result / web_fetch_live_im_fetch |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | webcast_id 不存在 | STOP，告知用户 | 0 | 无替代 |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### web_douyin_live_room — 获取直播间弹幕 WebSocket 连接信息

**Full path:** `/api/v1/douyin/web/douyin_live_room`
**Method:** GET · **Risk:** low

#### 用途
获取直播间弹幕的 WebSocket 连接信息。**注意：此接口不直接返回弹幕数据**，返回的是建立 WebSocket 连接所需的参数，需要使用 WebSocket 客户端连接后才能获取实时弹幕。

#### 何时使用 / 不使用
- ✅ 需要获取直播间弹幕连接信息
- ✅ 配合 `web_fetch_live_im_fetch` 和 `web_generate_wss_xb_signature`（tools.md）使用
- ❌ 想直接获取弹幕文本 → 本 skill 不支持实时弹幕流（见 param-mappings.md § 0.1）
- ❌ 想获取视频弹幕 → 用 `comments.md` 的 `web_fetch_one_video_danmaku`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| live_room_url | string | yes | 合法直播链接 | 直播间链接，如 `https://live.douyin.com/834624950943` |
| danmaku_type | string | yes | 枚举值（见下） | 消息类型 |

**danmaku_type 支持的消息类型枚举**：
- `WebcastRoomMessage` — 房间消息
- `WebcastLikeMessage` — 点赞消息
- `WebcastMemberMessage` — 成员进入
- `WebcastChatMessage` — 聊天消息
- `WebcastGiftMessage` — 礼物消息
- `WebcastSocialMessage` — 社交消息
- `WebcastRoomUserSeqMessage` — 用户序列
- `WebcastUpdateFanTicketMessage` — 粉丝票更新
- `WebcastCommonTextMessage` — 通用文本
- `WebcastMatchAgainstScoreMessage` — 对战分数
- `WebcastFansclubMessage` — 粉丝团消息
- `WebcastRanklistHourEntranceMessage` — 排行入口
- `WebcastRoomStatsMessage` — 房间统计
- `WebcastLiveShoppingMessage` — 购物消息
- `WebcastLiveEcomGeneralMessage` — 电商通用消息
- `WebcastProductChangeMessage` — 商品变更
- `WebcastRoomStreamAdaptationMessage` — 流适配
- `WebcastNotifyEffectMessage` — 通知特效
- `WebcastLightGiftMessage` — 轻礼物
- `WebcastProfitInteractionScoreMessage` — 互动积分
- `WebcastRoomRankMessage` — 房间排名

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| WebSocket 连接参数 | 响应数据 | 建立 WebSocket 连接所需参数 | 需配合 WebSocket 客户端使用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | live_room_url 格式错误或 danmaku_type 无效 | STOP，检查参数 | 0 | — |
| 404 | 直播间不存在 | STOP，告知用户 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### web_fetch_live_im_fetch — 获取直播 IM 弹幕参数

**Full path:** `/api/v1/douyin/web/fetch_live_im_fetch`
**Method:** GET · **Risk:** low

#### 用途
获取直播间 IM 弹幕参数数据。配合 `web_generate_wss_xb_signature`（tools.md）使用，用于建立弹幕 WebSocket 连接。

#### 何时使用 / 不使用
- ✅ 需要获取弹幕连接的 IM 参数
- ✅ 配合 tools.md 的签名生成端点使用
- ❌ 只想看直播流数据 → 用 `web_fetch_user_live_videos` 等直播流端点
- ❌ 不需要弹幕功能 → 无需调用

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| room_id | string | yes | 纯数字字符串 | 直播间号，如 `7382517534467115826` |
| user_unique_id | string | yes | 纯数字字符串 | 用户唯一 ID，如 `7382524529011246630` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| IM 参数 | 响应数据 | 弹幕连接参数 | 配合 tools.md `web_generate_wss_xb_signature` 使用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | room_id 或 user_unique_id 无效 | STOP，检查参数 | 0 | — |
| 404 | 直播间不存在 | STOP，告知用户 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### web_fetch_live_gift_ranking — 获取直播间送礼用户排行

**Full path:** `/api/v1/douyin/web/fetch_live_gift_ranking`
**Method:** GET · **Risk:** low

#### 用途
获取直播间送礼用户排行榜。需要 room_id，通常从直播流端点链式获取。

#### 何时使用 / 不使用
- ✅ 想查看直播间送礼排行
- ✅ 已有 room_id（从直播流端点获取）
- ❌ 没有 room_id → 先通过直播流端点或 `web_webcast_id_2_room_id` 获取
- ❌ 想看直播间商品 → 用 `web_fetch_live_room_product_result`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| room_id | string | yes | 纯数字字符串 | 直播间 room_id，如 `7356585666190461731` |
| rank_type | integer | no | 默认 30 | 排行类型 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 排行榜用户 sec_uid | `$.data.ranks[].sec_uid` | 送礼用户加密 ID | user.md 各端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | room_id 不存在或直播已结束 | STOP，告知用户 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### web_fetch_live_room_product_result — 获取直播间商品信息

**Full path:** `/api/v1/douyin/web/fetch_live_room_product_result`
**Method:** GET · **Risk:** low

#### 用途
获取直播间商品列表。**商品链式调用的起点**——返回的 product_id / shop_id 是 SKU、优惠券、评价等下游端点的必要输入。

#### 何时使用 / 不使用
- ✅ 想查看直播间在售商品
- ✅ 链式起点：取 product_id / shop_id / author_id
- ❌ 没有 room_id 和 author_id → 先通过直播流端点获取
- ❌ 已有 product_id 想查 SKU → 直接用 `web_fetch_product_sku_list`
- ❌ 想查送礼排行 → 用 `web_fetch_live_gift_ranking`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| room_id | string | yes | 纯数字字符串 | 直播间 room_id |
| author_id | string | yes | 纯数字字符串 | 主播用户 ID。获取方法：1. 通过 user.md 获取 uid 即为 author_id；2. 通过直播流端点获取 author.id 字段 |
| offset | integer | no | 默认 0 | 偏移量 |
| limit | integer | no | 默认 20 | 每页数量 |

> **注意**：旧版文档提到可选 `cookie` 参数（如获取失败需手动过验证码）。cookie 仅限用户明确授权后才可传递。

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| product_id | `$.data.product_id` | 商品 ID | web_fetch_product_sku_list / web_fetch_product_coupon / web_fetch_product_review_score / web_fetch_product_review_list |
| shop_id | `$.data.shop_id` | 店铺 ID | web_fetch_product_coupon / web_fetch_product_review_score / web_fetch_product_review_list |
| price | `$.data.price` | 商品价格 | web_fetch_product_coupon |
| author_id | `$.data.author_id` | 主播 ID | web_fetch_product_sku_list / web_fetch_product_coupon |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 直播间不存在或无商品 | STOP，告知用户 | 0 | — |
| 400 | author_id 获取方式错误 | 检查 author_id 来源 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### web_fetch_product_sku_list — 获取商品 SKU 列表

**Full path:** `/api/v1/douyin/web/fetch_product_sku_list`
**Method:** GET · **Risk:** low

#### 用途
获取商品 SKU 列表。需要 product_id 和 author_id，通常从 `web_fetch_live_room_product_result` 链式获取。

#### 何时使用 / 不使用
- ✅ 已有 product_id 和 author_id，想查看商品 SKU 规格
- ✅ 从商品列表端点链式获取
- ❌ 没有 product_id → 先用 `web_fetch_live_room_product_result` 获取
- ❌ 想查商品评价 → 用 `web_fetch_product_review_score` / `web_fetch_product_review_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| product_id | string | yes | 纯数字字符串 | 商品 ID，如 `3770337983790711029` |
| author_id | string | yes | 纯数字字符串 | 作者 ID，如 `3109048548866375` |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| SKU 列表 | `$.data.sku_list` | 商品规格列表 | 仅展示用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 商品不存在 | STOP，告知用户 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### web_fetch_product_coupon — 获取商品优惠券信息

**Full path:** `/api/v1/douyin/web/fetch_product_coupon`
**Method:** GET · **Risk:** low

#### 用途
获取商品优惠券信息。**参数最多的直播端点**——需要 5 个必填参数，其中 sec_user_id 需从 user.md 获取。

#### 何时使用 / 不使用
- ✅ 已有全部 5 个必填参数，想查看商品优惠券
- ❌ 缺少 sec_user_id → 先从 user.md 获取
- ❌ 缺少 product_id / shop_id → 先从 `web_fetch_live_room_product_result` 获取
- ❌ 只想查商品价格/SKU → 用更简单的端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| product_id | string | yes | 纯数字字符串 | 商品 ID |
| shop_id | string | yes | 纯数字字符串 | 店铺 ID |
| price | string | yes | 数字字符串 | 商品价格，如 `"1490"` |
| author_id | string | yes | 纯数字字符串 | 作者 ID |
| sec_user_id | string | yes | Base64 格式长字符串 | 作者安全 ID，需从 user.md 获取 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 优惠券信息 | `$.data` | 优惠券详情 | 仅展示用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | 参数缺失或格式错误 | 检查 5 个必填参数 | ≤1 次 | — |
| 404 | 商品/店铺不存在 | STOP，告知用户 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### web_fetch_product_review_score — 获取商品评价评分

**Full path:** `/api/v1/douyin/web/fetch_product_review_score`
**Method:** GET · **Risk:** low

#### 用途
获取商品评价评分汇总。只需 product_id 和 shop_id 两个参数，是商品评价端点中最简单的。

#### 何时使用 / 不使用
- ✅ 想查看商品评分概览
- ✅ 已有 product_id 和 shop_id
- ❌ 想看评价详情列表 → 用 `web_fetch_product_review_list`
- ❌ 想查 SKU → 用 `web_fetch_product_sku_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| product_id | string | yes | 纯数字字符串 | 商品 ID |
| shop_id | string | yes | 纯数字字符串 | 店铺 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| 评分数据 | `$.data` | 评价评分汇总 | 仅展示用 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 商品/店铺不存在 | STOP，告知用户 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |

---

### web_fetch_product_review_list — 获取商品评价列表

**Full path:** `/api/v1/douyin/web/fetch_product_review_list`
**Method:** GET · **Risk:** low

#### 用途
获取商品评价列表，支持翻页和排序。需要 product_id 和 shop_id。

#### 何时使用 / 不使用
- ✅ 想查看商品评价详情列表
- ✅ 已有 product_id 和 shop_id
- ❌ 只想看评分概览 → 用更简单的 `web_fetch_product_review_score`
- ❌ 想查 SKU → 用 `web_fetch_product_sku_list`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| product_id | string | yes | 纯数字字符串 | 商品 ID |
| shop_id | string | yes | 纯数字字符串 | 店铺 ID |
| cursor | integer | no | 默认 0 | 翻页游标，首次为 0，后续使用上次响应的 cursor |
| count | integer | no | 默认 20 | 每页数量，建议保持默认 |
| sort_type | integer | no | 枚举：0/1，默认 0 | 排序方式：0 = 默认，1 = 最新 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| cursor | `$.data.cursor` | 下一页游标 | 本端点翻页 |
| has_more | `$.data.has_more` | 是否有更多 | 判断是否继续翻页 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 404 | 商品/店铺不存在 | STOP，告知用户 | 0 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |
