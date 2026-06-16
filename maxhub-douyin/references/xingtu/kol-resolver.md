# Douyin Xingtu — KOL ID 查找 / 抖音星图 — KOL ID 查找
> 本文件是 [xingtu/_index.md](./_index.md) 的子文件。完整端点路由、链式调用图谱、错误处理契约请参见 _index.md。

## 端点详情

---

### xingtu_get_xingtu_kolid_by_uid — 用 uid 获取星图 kolId

**Full path:** `/api/v1/douyin/xingtu/get_xingtu_kolid_by_uid`
**Method:** GET · **Risk:** low

#### 用途
根据抖音用户 ID（uid）获取星图平台的 kolId。**链式调用的常见起点**——kolId 是 V1 端点的核心入参。

#### 何时使用 / 不使用
- ✅ 已知 uid，需要获取 kolId
- ✅ 链式起点：uid → kolId → KOL 分析端点
- ❌ 已知 sec_user_id → 用 `xingtu_get_xingtu_kolid_by_sec_user_id`
- ❌ 已知 kolId → 直接调用 KOL 分析端点

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uid | string | yes | 纯数字 | 抖音用户 ID |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| kolId | `$.data.kolId` | 星图 KOL ID | xingtu_kol_*_v1 系列端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | uid 缺失 | 补全参数重试 | ≤1 次 | — |
| 404 | uid 不存在或未入驻星图 | STOP | 0 | — |

---

### xingtu_get_xingtu_kolid_by_sec_user_id — 用 sec_user_id 获取星图 kolId

**Full path:** `/api/v1/douyin/xingtu/get_xingtu_kolid_by_sec_user_id`
**Method:** GET · **Risk:** low

#### 用途
根据抖音 sec_user_id 获取星图平台的 kolId。**链式调用的常见起点**——sec_user_id 可从 user.md 或 tools.md 流入。

#### 何时使用 / 不使用
- ✅ 已知 sec_user_id，需要获取 kolId
- ✅ 链式起点：sec_user_id → kolId → KOL 分析端点
- ❌ 已知 uid → 用 `xingtu_get_xingtu_kolid_by_uid`

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| sec_user_id | string | yes | — | 抖音用户 sec_user_id |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| kolId | `$.data.kolId` | 星图 KOL ID | xingtu_kol_*_v1 系列端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | sec_user_id 缺失 | 补全参数重试 | ≤1 次 | — |
| 404 | sec_user_id 不存在或未入驻星图 | STOP | 0 | — |

---

### xingtu_get_xingtu_kolid_by_unique_id — 用抖音号获取星图 kolId

**Full path:** `/api/v1/douyin/xingtu/get_xingtu_kolid_by_unique_id`
**Method:** GET · **Risk:** low

#### 用途
根据抖音号（unique_id）获取星图平台的 kolId。

#### 何时使用 / 不使用
- ✅ 已知抖音号，需要获取 kolId
- ❌ 已知 uid 或 sec_user_id → 优先用对应端点（更可靠）

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| unique_id | string | yes | — | 抖音号 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| kolId | `$.data.kolId` | 星图 KOL ID | xingtu_kol_*_v1 系列端点 |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | unique_id 缺失 | 补全参数重试 | ≤1 次 | — |
| 404 | 抖音号不存在或未入驻星图 | STOP | 0 | — |

---

### xingtu_get_sign_image — 解析星图加密图片

**Full path:** `/api/v1/douyin/xingtu/get_sign_image`
**Method:** GET · **Risk:** low

#### 用途
解析星图加密图片，返回可访问的图片 URL。星图部分图片（如头像、数据图表）使用加密 URI，需通过本端点解析。

#### 何时使用 / 不使用
- ✅ 星图返回的图片 URI 需要解析为可访问 URL
- ❌ 已有可直接访问的图片 URL → 无需解析

#### 输入 (IN)
| name | type | required | constraints | 说明 |
|------|------|----------|-------------|------|
| uri | string | yes | — | 图片 URI |
| durationTS | integer | no | default: 86400 | 有效期时长（秒） |
| format | string | no | default: webp | 图片格式 |

#### 输出可链式字段 (OUT)
| 字段 | json_path | 语义 | 下游端点 |
|------|-----------|------|---------|
| — | — | 图片 URL 为终端数据，无下游链式调用 | — |

#### 错误处理 (ERR)
| code | 含义 | 行动 | 重试 | 降级/替换 |
|------|------|------|------|----------|
| 400 | uri 缺失 | 补全参数重试 | ≤1 次 | — |
| 5xx | 上游故障 | 等 3s 重试 | ≤1 次 | — |
